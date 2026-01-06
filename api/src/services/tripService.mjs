import tripsModel from "../models/trips.mjs";
<<<<<<< HEAD
import createBikes from "../models/bikes.mjs";
// import createParkings from "../models/parkings.mjs";
import walletsServices from "../services/walletService.mjs";
import pricingServices from "./pricingService.mjs";
=======
import BikeService from "../services/bikeService.mjs";
import WalletsService from "../services/walletService.mjs";
import PricingService from "./pricingService.mjs";
>>>>>>> 6e40cedfd96eecfd3c13ac6b3622bb49f5b62f1c

//potential refactor: controller gets bike & wallet.

class TripService {
    constructor(
        tripModel = tripsModel,
<<<<<<< HEAD
        bikeModel = createBikes(),
        // parkings = createParkings(),
        walletsService = walletsServices,
        pricingService = pricingServices
=======
        bikeService = BikeService,
        walletsService = WalletsService,
        pricingService = PricingService,
>>>>>>> 6e40cedfd96eecfd3c13ac6b3622bb49f5b62f1c
    ) {
        /**
         * Inject the models class is depending on.
         */
<<<<<<< HEAD
        this.trips = tripModel;
        this.bikes = bikeModel;
        // this.parkings = parkings;
        this.walletsService = walletsService;
        this.pricingService = pricingService;
        // /**
        //  * A list of parking zones
        //  * @type {Array}
        //  */
        // this.parkingZones = [];
=======
        this.tripsModel = tripModel;
        this.bikeService = bikeService;
        this.walletsService = walletsService;
        this.pricingService = pricingService;
    }

    /**
     * Checks that a trip with the corresponding id exists and returns it.
     *
     * @param {string} tripId A numeric value in string format.
     * @returns {Object} trip The trip with the argumented id.
     */
    async findTripById(tripId) {
        const tripResult = await this.tripsModel.getTripById(tripId);
        const trip = tripResult[0];

        if (!trip) {
            throw new Error(`Trip with id: ${tripId} was not found`);
        }
        return trip;
>>>>>>> 6e40cedfd96eecfd3c13ac6b3622bb49f5b62f1c
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

<<<<<<< HEAD
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

=======
>>>>>>> 6e40cedfd96eecfd3c13ac6b3622bb49f5b62f1c
    /**
     * Start a rent of a bike by:
     * asserting the user has money, setting bikes status (occupied),
     * and creating a scooter in use row in db.
     * @param {Object} data An object containing customers user id and bikes id.
     * @returns {object} The inserted bike in use object.
     */
    async startTrip(data) {
        const userId = data.userId;
        const bikeId = data.bikeId;
        const now = this._getDbDate();

<<<<<<< HEAD
        const bike = await this.getBikeById(bikeId);
        const wallet = await this.walletsService.getWalletByUserId(userId);
=======
        const bike = await this.bikeService.findBikeById(bikeId);
        const wallet = await this.walletsService.findWalletByUserId(userId);
>>>>>>> 6e40cedfd96eecfd3c13ac6b3622bb49f5b62f1c

        if (wallet.balance <= 0) {
            throw new Error(`Users wallet ${wallet.id} has insufficiant funds`);
        }
        await this.bikeService.updateBikeZone(bikeId, bike);

        const bikeData = {
            user_id: userId,
            scooter_id: bike.id,
            start_time: now,
            start_latitude: bike.latitude,
	        start_longitude: bike.longitude,
            start_zone_type: bike.current_zone_type,
<<<<<<< HEAD
	        end_latitude: null,
	        end_longitude: null,
            end_zone_type: null,
            start_time:  now,
            end_time: null,
=======
>>>>>>> 6e40cedfd96eecfd3c13ac6b3622bb49f5b62f1c
        };

<<<<<<< HEAD
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
=======
        await this.bikeService.startBike(bikeData);

        return await this.bikeService.findBikeInUseByBikeId(bike.id);
>>>>>>> 6e40cedfd96eecfd3c13ac6b3622bb49f5b62f1c
    }

    /**
     * Creates and returns current date and time in SQL datetime format.
     * @returns {string} Current date and time.
     */
    _getDbDate() {
        const now = new Date();
        const isoFormatDate = now.toISOString();
        const datetimeFormat = isoFormatDate.replace("T", " ").split(".")[0];

        return datetimeFormat;
    }

<<<<<<< HEAD
    async setBikeStatus(bike, parkedOK) {
        let bikeStatus = parkedOK ? 10 : 20;

        bikeStatus = bike.battery > 20 ? bikeStatus : 50;

        await this.bikes.updateBike(bike.id, {status: bikeStatus});
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
=======
    /**
     * End a scooter rental trip by:
     * updating bike status, removing it from scooters in use table,
     * getting the cost, creating a trip row in the table and charging the user.
     *
     * @param {Object} bikeId Bike id
     * @returns {Array} Result from db update.
     */
    async endTrip(bikeId) {
        const bikeInUse = await this.bikeService.findBikeInUseByBikeId(bikeId);
        const bike = await this.bikeService.findBikeById(bikeInUse.scooter_id);

        await this.bikeService.updateBikeZone(bikeId, bike);

        const parkedOk =
            bike.current_zone_type === "parking" ||
            bike.current_zone_type === "charging";
        const endTime = this._getDbDate();

        const totalCost = await this.pricingService.calculateTripCost(
            bike,
            bikeInUse,
            parkedOk,
            endTime
        );

        const result = await this.tripsModel.createTrip({
            user_id: bikeInUse.user_id,
            scooter_id: bikeInUse.scooter_id,
>>>>>>> 6e40cedfd96eecfd3c13ac6b3622bb49f5b62f1c
            cost: totalCost,
            start_latitude: bikeInUse.start_latitude,
            start_longitude: bikeInUse.start_longitude,
            start_zone_type: bikeInUse.start_zone_type,
            end_longitude: bike.longitude,
            end_latitude: bike.latitude,
            end_zone_type: bike.current_zone_type,
<<<<<<< HEAD
=======
            start_time: bikeInUse.start_time,
>>>>>>> 6e40cedfd96eecfd3c13ac6b3622bb49f5b62f1c
            end_time: endTime,
        });

        if (!result?.affectedRows) {
            throw new Error("Could not end trip");
        }

<<<<<<< HEAD
        await this.walletsService.debit(trip.user_id, totalCost);

        // Not this services job?
        await this.setBikeStatus(bike, parkedOk);

        const newTrip = await this.getTripById(tripId);
=======
        await this.walletsService.debit(bikeInUse.user_id, totalCost);
        await this.bikeService.stopBike(bike, bikeInUse.id, parkedOk);

        const newTrip = await this.findTripById(result.insertId);
>>>>>>> 6e40cedfd96eecfd3c13ac6b3622bb49f5b62f1c

        return newTrip;
    }

    async getCurrentTripCost(bikeId) {
        const bikeInUse = await this.bikeService.findBikeInUseByBikeId(bikeId);
        const bike = await this.bikeService.findBikeById(bikeInUse.scooter_id);
        const currTime = this._getDbDate();
        const currPrice = this.pricingService.calculateTripCost(bike, bikeInUse, true, currTime);

        return currPrice;
    }
}
export { TripService };
export default new TripService();
