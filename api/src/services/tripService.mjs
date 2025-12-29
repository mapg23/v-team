import tripsModel from "../models/trips.mjs";
import createBikes from "../models/bikes.mjs";
// import createParkings from "../models/parkings.mjs";
import walletsModel from "../models/wallets.mjs";
import pricingServices from "./pricingService.mjs";


class TripService {
    constructor(
        tripModel = tripsModel,
        bikeModel = createBikes(),
        // parkings = createParkings(),
        wallets = walletsModel,
        pricingService = pricingServices
    ) {
        /**
         * Inject the models class is depending on.
         */
        this.trips = tripModel;
        this.bikes = bikeModel;
        // this.parkings = parkings;
        this.wallets = wallets;
        this.pricingService = pricingService;
        // /**
        //  * A list of parking zones
        //  * @type {Array}
        //  */
        // this.parkingZones = [];
    }
    // /**
    //  * Fetch and cache parking zones.
    //  * @returns {<Array<Object>>} Parking zones.
    //  */
    // async getParkingZones() {
    //     if (this.parkingZones.length === 0) {
    //         this.parkingZones = await this.parkings.getParkings();
    //     }
    //     if (this.parkingZones.length === 0) {
    //         throw new Error("Could not get parking zones");
    //     }

    //     return this.parkingZones;
    // }

    /**
     * Checks that a bike with the corresponding id exists and returns it.
     *
     * @param {string} bikeId A numeric value in string format.
     * @returns {Object} bike The bike with the argumented id.
     */
    async getBikeById(bikeId) {
        const bikeResult = await this.bikes.getBikeById(bikeId);
        const bike = bikeResult[0];

        if (!bike) {
            throw new Error(`Bike with id: ${bikeId} was not found`);
        }
        return bike;
    }

    /**
     * Checks that a trip with the corresponding id exists and returns it.
     *
     * @param {string} tripId A numeric value in string format.
     * @returns {Object} trip The trip with the argumented id.
     */
    async getTripById(tripId) {
        const tripResult = await this.trips.getTripById(tripId);
        const trip = tripResult[0];

        if (!trip) {
            throw new Error(`Trip with id: ${tripId} was not found`);
        }
        return trip;
    }

    async getWalletByUserId(userId) {
        const walletResult = await this.wallets.getWalletByUserId(userId);
        const wallet = walletResult[0];

        if (!wallet) {
            throw new Error(`User ${userId}s wallet was not found`);
        }
        return wallet;
    };

    /**
     * Start a rent of a bike, and set bikes status to 40 (occupied).
     * @param {Object} data An object containing customers user id and bikes id.
     * @returns {object} The inserted transaction object.
     */
    async startTrip(data) {
        const userId = data.userId;
        const bikeId = data.bikeId;
        const now = this.getDbDate();

        const bike = await this.getBikeById(bikeId);
        const wallet = await this.getWalletByUserId(userId);

        if (wallet.balance <= 0) {
            throw new Error(`Users wallet ${wallet.id} has insufficiant funds`);
        }

        const tripData = {
            user_id: userId,
            scooter_id: bike.id,
            cost: 0,
            start_latitude: bike.latitude,
	        start_longitude: bike.longitude,
            start_zone: bike.current_zone_type,
	        end_latitude: null,
	        end_longitude: null,
            end_zone: null,
            start_time:  now,
            end_time: null,
        };
        const result = await this.trips.createTrip(tripData);

        if (!result.affectedRows) {
            throw new Error("Ride could not be created");
        }

        // Other class responsibillity?
        const statusUpdate = await this.bikes.updateBike(bike.id, {"status": 40});

        if (!statusUpdate.affectedRows) {
            console.error("ERROR: Unable to change status to Occupied");
            throw new Error("Unable to change status to Occupied");
        }

        return await this.trips.getTripById(result.insertId);
    }

    /**
     * Creates and returns current date and time in SQL datetime format.
     * @returns {string} Current date and time.
     */
    getDbDate() {
        const now = new Date();
        const isoFormatDate = now.toISOString();
        const datetimeFormat = isoFormatDate.replace("T", " ").split(".")[0];

        return datetimeFormat;
    }

    async setBikeStatus(bike, parkedOK) {
        let bikeStatus = parkedOK ? 10 : 20;

        bikeStatus = bike.battery > 20 ? bikeStatus : 50;

        await this.bikes.updateBike(bike.id, {status: bikeStatus});
    }

    async chargeForTrip(trip, totalCost) {
        const wallet = await this.getWalletByUserId(trip.user_id);
        const newBalance = wallet.balance - totalCost;
        const walletResult = await this.wallets.updateWallet(wallet.id, {balance: newBalance});

        // console.log(walletResult);
        if (!walletResult?.affectedRows) {
            throw new Error("Could not update balance");
        }
    }

    /**
     * End a scooter rental trip and calculating final cost.
     *
     * @param {Object} data Trip data
     *
     * @returns {Array} Result from db update.
     */
    async endTrip(tripId) {
        const trip = await this.getTripById(tripId);

        if (trip.cost > 0 && trip.end_time > 0) {
            throw new Error(`Trip with id ${tripId} already ended.`);
        }

        const bike = await this.getBikeById(trip.scooter_id);
        const parkedOk =
            bike.current_zone_type === "parking" ||
            bike.current_zone_type === "charging";
        const endTime = this.getDbDate();
        const totalCost = await this.pricingService.calculateTripCost(
            bike,
            trip,
            parkedOk,
            endTime
        );
        const result = await this.trips.updateTrip(trip.id, {
            cost: totalCost,
            end_longitude: bike.longitude,
            end_latitude: bike.latitude,
            end_zone: bike.current_zone_type,
            end_time: endTime,
        });

        if (!result?.affectedRows) {
            throw new Error("Could not end trip");
        }

        await this.chargeForTrip(trip, totalCost);

        // Not this services job?
        await this.setBikeStatus(bike, parkedOk);

        const newTrip = await this.getTripById(tripId);

        return newTrip;
    }
}
export { TripService };
export default new TripService();
