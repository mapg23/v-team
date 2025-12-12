import tripModel from "../models/trips.mjs";
import zonesModel from "../models/zones.mjs";
import bikeStarter from "../models/bikes.mjs";
const bikeModel = bikeStarter();

/**
 * transactionData = {
    id              int(11)
	user_id	        int(11)
	scooter_id      int(11)
	cost	        decimal(10,2)
	start_location	varchar(64)
	end_location	varchar(64)
	start_time	    datetime
	end_time	    datetime
    }
    parkingZones = [
            {
                id: 1,
                min_lat: "59.1111",
                min_long: "18.0000",
                max_lat: "59.2222",
                max_long: "18.1111"
                }
            },
            {
                id: 2,
                min_lat: "59.3333",
                min_long: "18.0000",
                max_lat: "59.5555",
                max_long: "18.1111"
            }
            }
        ]
 */


class TripService {
    constructor() {
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
            this.parkingZones = await zonesModel.getZones();
        }
        if (this.parkingZones.length === 0) {
            throw new Error("Could not get parking zones");
        }
        // console.log(this.parkingZones);
        return this.parkingZones;
    }

    /**
     * Start a rent of a bike, and set bikes status to 40 (occupied).
     * @param {Object} data An object containing customers user id and bikes id.
     * @returns {object} The inserted transaction object.
     */
    async startTrip(data) {
        console.log("starting transaction");
        const userId = data.userId;
        const bikeId = data.bikeId;
        const now = this.getDbDate();

        const bikeResult = await bikeModel.getBikeById(bikeId);
        const bike = bikeResult[0];

        if (!bike) {
            throw new Error(`Bike with id: ${bikeId} was not found`);
        }
        const startLocation = JSON.stringify(bike.location);
        // console.log(bike);
        // console.log("bike . ID", bike.id);
        const tripData = {
            user_id: userId,
            scooter_id: bike.id,
            cost: 0,
            start_location: startLocation,
            end_location: 0,
            start_time:  now,
            end_time: 0
        };
        const result = await tripModel.createTransaction(tripData);

        console.log(result);
        if (!result.affectedRows) {
            throw new Error("Ride could not be created");
        }

        const statusUpdate = await bikeModel.updateBike(bike.id, {"status": 40});

        if (!statusUpdate.affectedRows) {
            console.error("ERROR: Unable to change status to Occupied");
        }

        return await tripModel.getTransactionById(result.insertId);
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
     * @param {Object} data Transaction data
     * @param {string} data.start_time Start timestamp
     * @param {string} data.end_time End timestamp
     * @returns {number} Cost of rent
     */
    calculateRent(data) {
        const minutes = this.getDuration(data.start_time, data.end_time);

        return minutes * 5;
    }

    /**
     * Determine if a location/position is inside a given zone
     *
     * @param {Object} zone The coordinates for top left and bottom right corners
     * @param {Object} location Location to test against zone
     * @returns {boolean}
     */
    isInZone(zone, location) {
        return (
            location.lat < zone.max_lat &&
            location.lat > zone.min_lat &&
            location.long < zone.max_long &&
            location.long > zone.min_long
        );
    }

    /**
     * Check whether a location is inside any of our parking zones
     *
     * @param {Object} location {lat: <xx.xxxx>, long: <xx.xxxx>}
     * @returns {Promise<boolean>}
     */
    async isInParking(location) {
        const zones = await this.getParkingZones();

        for (const zone of zones) {
            if (this.isInZone(zone.location, location)) {
                return true;
            }
        }
        return false;
    }

    async calculateCost(data) {
        const rentCost = this.calculateRent(data);
        const location = await JSON.parse(data.bike.location);
        const parkedOK = await this.isInParking(location);
        const parkingFee = parkedOK ? 0 : 80;

        let discount = 1;

        if (parkedOK) {
            // this.bikeStatus = 10;
            const rentedFromParking = await this.isInParking(data.start_location);

            discount = rentedFromParking ? 1 : 0.8;
        }

        const totalCost = (rentCost + parkingFee) * discount;

        return totalCost;
    }

    // async checkBikeBattery(bikeId) {
    //     const bike = await bikeModel.getBikeById(bikeId);

    //     if (bike.battery <= 20) {
    //         this.bikeStatus = 50;
    //     }
    // }

    /**
     * End a scooter rental transaction and calculating final cost.
     *
     * @param {Object} data Transaction data
     *
     * @returns {Promise<Array>} Result from db update.
     */
    async endRide(data) {
        const totalCost = await this.calculateCost(data);
        const  endLocation = await JSON.stringify(data.location);
        const endTime = this.getDbDate();
        // this.checkBikeBattery(data.bike_id);
        // SET BIKE STATUS

        return tripModel.updateTransaction(data.id, {
            cost: totalCost,
            end_location: endLocation,
            end_time: endTime,
        });
    }
}

export default new TripService();

// export default transaction;

// constructor(data) {
//   this.id = data.id;
//   this.scooterId = data.scooterId;
//   this.startLocation.long = data.start_location.x;
//   this.startLocation.lat = data.start_location.y;
//   this.location.long = data.end_location.x;
//   this.location.lat = data.end_location.y;
//   this.startTime = data.start_time;
//   this.endTime = data.end_time;
// },


// bikeInZone: null,

// setZones: async function getZones(cityID) {
//   const result = await getZones(city);
//   parse result
//   this.parkingZones = parsedResult;
// },

// const transaction = {

//     parkingZones: [],

//     getparkingZones: async function getparkingZones() {
//         if (this.parkingZones.length === 0) {
//             const result = await zonesModel.getZones();

//             this.parkingZones = result;
//         }
//         return this.parkingZones;
//     },

//     /**
//      *Calculate the duration of the ride.
//     * @param {string} start_time String in date format
//     * @param {string} end_time String in date format
//     * @returns {Number}
//     */
//     getDuration: function getDuration(startTime, endTime) {
//         const start = new Date(startTime);
//         const end = new Date(endTime);
//         const timeDifference = end - start;
//         const minutesDifference = timeDifference / (1000 * 60);

//         return minutesDifference;
//     },

//     calculateRent: async function calculateRent(data) {
//         const minutes = this.getDuration(data.start_time, data.end_time);

//         const cost = minutes * 5;

//         return cost;
//     },

//     isInZone: function isInZone(zone, location) {
//         return (
//             location.lat < zone.maxLat &&
//             location.lat > zone.minLat &&
//             location.long < zone.maxLong &&
//             location.long > zone.minLong
//         );
//     },

//     isInParking: async function isInParking(location) {
//         const parkingZones = await this.getparkingZones();

//         for (const zone of parkingZones) {
//             if (this.isInZone(zone, location)) {
//                 return true;
//             }
//         }
//         return false;
//     },
//     calculateCost: async function calculateCost(data) {
//         const rentCost = await this.calculateRent(data);
//         const parkedOK = await this.isInParking(data.end_location);
//         const parkingFee = parkedOK ? 0 : 80;
//         let discount = 1;

//         if (parkedOK) {
//             const rentedFromParking = await this.isInParking(data.start_location);

//             discount = rentedFromParking ? 1 : 0.8;
//         }

//         const totalCost = (rentCost + parkingFee) * discount;

//         return totalCost;
//     },

//     /**
//      * Ends a ride and calculates the cost
//      *
//      * @param {Object} data transaction data.
//      * @returns {Promise<Array>} Result from db update
//      */
//     endTransaction: async function endRide(data) {
//         const totalCost = await this.calculateCost(data);
//         const parkedOK = await this.isInParking(data.end_location);

//         const update = {
//             cost: totalCost,
//         };

//         return transactionModel.updateTransaction(data.id, update);
//     },
// };

// export default transaction;
