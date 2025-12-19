import transactionModel from "../models/transaction.mjs";
import zonesModel from "../models/zones.mjs";
// import bikeModel from "../models/bikes.mjs";


class TransactionService {
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
        return this.parkingZones;
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
            location.lat < zone.maxLat &&
            location.lat > zone.minLat &&
            location.long < zone.maxLong &&
            location.long > zone.minLong
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
            if (this.isInZone(zone, location)) {
                return true;
            }
        }
        return false;
    }

    async calculateCost(data) {
        const rentCost = this.calculateRent(data);
        const parkedOK = await this.isInParking(data.end_location);
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
     * End a scooter rental transaction by calculating final cost,
     * checking and setting status on used bike.
     *
     * @param {Object} data Transaction data
     *
     * @returns {Promise<Array>} Result from db update.
     */
    async endTransaction(data) {
        const totalCost = await this.calculateCost(data);

        this.checkBikeBattery(data.bike_id);
        // SET BIKE STATUS
        return transactionModel.updateTransaction(data.id, {
            cost: totalCost,
        });
    }
}

export default new TransactionService();

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
