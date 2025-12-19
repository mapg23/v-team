import tripsModel from "../models/trips.mjs";
import createBikes from "../models/bikes.mjs";
import createParkings from "../models/parkings.mjs";
import walletsModel from "../models/wallets.mjs";

// const bikeModel = createBikes();


class TripService {
    constructor(
        tripModel = tripsModel,
        bikeModel = createBikes(),
        parkings = createParkings(),
        wallets = walletsModel
    ) {
        /**
         * Inject the models class is depending on.
         */
        this.trips = tripModel;
        this.bikes = bikeModel;
        this.parkings = parkings;
        this.wallets = wallets;
        /**
         * A list of parking zones
         * @type {Array}
         */
        this.parkingZones = [];
    }
    /**
     * Fetch and cache parking zones.
     * @returns {Promise<Array<Object>>} Parking zones.
     */
    async getParkingZones() {
        if (this.parkingZones.length === 0) {
            this.parkingZones = await this.parkings.getParkings();
        }
        if (this.parkingZones.length === 0) {
            throw new Error("Could not get parking zones");
        }
        // console.log(this.parkingZones);
        return this.parkingZones;
    }

    async getBikeById(bikeId) {
        const bikeResult = await this.bikes.getBikeById(bikeId);
        const bike = bikeResult[0];

        if (!bike) {
            throw new Error(`Bike with id: ${bikeId} was not found`);
        }
        return bike;
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
	        end_latitude: null,
	        end_longitude: null,
            start_time:  now,
            end_time: 0,
        };
        const result = await this.trips.createTrip(tripData);

        // console.log(result);
        if (!result.affectedRows) {
            throw new Error("Ride could not be created");
        }

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

    /**
     * Calculate duration between two timestamps in minutes.
     *
     * @param {string} startTime Datetime for start
     * @param {string} endTime Datetime for end
     * @returns {number} Duration in minutes
     */
    getDuration(startTime, endTime) {
        const start = new Date(startTime);
        const end = new Date(endTime);

        return (end - start) / (1000 * 60);
    }

    /**
     * Calculate rent-cost based on duration
     *
     * @param {Object} data Trip data
     * @param {string} data.start_time Start timestamp
     * @param {string} data.end_time End timestamp
     * @returns {number} Cost of rent
     */
    calculateRent(startTime, endTime) {
        const minutes = this.getDuration(startTime, endTime);

        return minutes * 2.5;
    }

    /**
     * Determine if a location/position is inside a given zone
     *
     * @param {Object} zone The coordinates for top left and bottom right corners of a zone
     * @param {Object} lat The latitude of the position to compare
     * @param {Object} long The longitude of the position to compare
     * @returns {boolean}
     */
    isInZone(zone, lat, long) {
        // console.log(lat, zone.max_lat, zone.min_lat, long, zone.max_long, zone.min_long);
        return (
            lat < zone.max_lat &&
            lat > zone.min_lat &&
            long < zone.max_long &&
            long > zone.min_long
        );
    }

    /**
     * Check whether a location is inside any of our parking zones
     *
     * @param {Object} location {lat: <xx.xxxx>, long: <xx.xxxx>}
     * @returns {Promise<boolean>}
     */
    async isInParking(lat, long) {
        const zones = await this.getParkingZones();

        for (const zone of zones) {
            if (this.isInZone(zone, lat, long)) {
                return true;
            }
        }
        return false;
    }

    /**
     *
     * @param {Object} bike A bike object.
     * @param {Object} trip A trip object
     * @param {Boolean} parkedOK Tells if bike is parked in a parking zone.
     * @returns {Number} totalCost The total cost of the trip.
     */
    async calculateCost(bike, trip, parkedOK) {
        const now = this.getDbDate();
        const rentCost = this.calculateRent(trip.start_time, now);
        const parkingFee = parkedOK ? 0 : 80;

        const startFee = 30;
        let discount = 1;

        if (parkedOK) {
            // this.bikeStatus = 10;
            const rentedFromParking = await this.isInParking(
                trip.start_latitude, trip.start_longitude
            );

            discount = rentedFromParking ? 1 : 0.5;
        }

        const totalCost = (rentCost + parkingFee) + (startFee * discount);

        // Returns number with two decimal places: 1 = 1.00.
        return (+totalCost).toFixed(2);
    }

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
     * @returns {Promise<Array>} Result from db update.
     */
    async endTrip(tripId) {
        const tripRes = await this.trips.getTripById(tripId);
        const trip = tripRes?.[0];

        if (!trip) {
            throw new Error(`Could not find trip with id ${tripId}`);
        }

        if (trip.cost > 0 && trip.end_time > 0) {
            throw new Error(`Trip with id ${tripId} already ended.`);
        }

        const bike = await this.getBikeById(trip.scooter_id);

        const parkedOK = await this.isInParking(bike.latitude, bike.longitude);
        const totalCost = await this.calculateCost(bike, trip, parkedOK);
        const endTime = this.getDbDate();

        const result = await this.trips.updateTrip(trip.id, {
            cost: totalCost,
            end_longitude: bike.longitude,
            end_latitude: bike.latitude,
            end_time: endTime,
        });

        if (!result?.affectedRows) {
            throw new Error("Could not end trip");
        }

        const wallet = await this.getWalletByUserId(trip.user_id);
        const newBalance = wallet.balance - totalCost;
        const walletResult = await this.wallets.updateWallet(wallet.id, {balance: newBalance});

        // console.log(walletResult);
        if (!walletResult?.affectedRows) {
            throw new Error("Could not update balance");
        }

        await this.setBikeStatus(bike, parkedOK);

        const newTripRes = await this.trips.getTripById(tripId);
        const newTrip = newTripRes?.[0];

        if (!newTrip) {
            throw new Error(`Could not find trip with id ${tripId}`);
        }

        return newTrip;
    }
}
export { TripService };
export default new TripService();
