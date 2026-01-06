import pricesModel from "../models/prices.mjs";


class PricingService {
    constructor(prices = pricesModel) {
<<<<<<< HEAD
        // Inject the models class it is depending on.
        this.prices = prices;
    }
    async getPricesForCity(cityId) {
=======
        this.prices = prices;
    }
    /**
     * Fetches current prices for a city.
     * @param {string} cityId A numeric string
     * @returns {object} Prices row for city.
     */
    async fetchPricesForCity(cityId) {
>>>>>>> 6e40cedfd96eecfd3c13ac6b3622bb49f5b62f1c
        const res = await this.prices.getPricesByCityId(cityId);
        const prices = res?.[0];

        if (!prices) {
            throw new Error(`No prices set for city ${cityId}`);
        }
        return prices;
    }

    /**
     * Calculate duration between two timestamps in minutes.
     *
     * @param {string} startTime Datetime for start
     * @param {string} endTime Datetime for end
     * @returns {number} Duration in minutes
     */
    calculateDuration(startTime, endTime) {
        const start = new Date(startTime);
        const end = new Date(endTime);

        return (end - start) / (1000 * 60);
    }

    /**
<<<<<<< HEAD
     *
=======
     * Calculates cost by adding price/minute, potential parking fee,
     * the start fee and possible discount.
>>>>>>> 6e40cedfd96eecfd3c13ac6b3622bb49f5b62f1c
     * @param {Object} bike A bike object.
     * @param {Object} trip A trip object
     * @param {Boolean} parkedOK Tells if bike is parked in a parking zone.
     * @param {string} endTime a datetime string.
     * @returns {Number} totalCost The total cost of the trip.
     */
<<<<<<< HEAD
    async calculateTripCost(bike, trip, parkedOK, endTime) {
        const prices = await this.getPricesForCity(bike.city_id);
        const minutes = this.calculateDuration(trip.start_time, endTime);
=======
    async calculateTripCost(bike, bikeInUse, parkedOK, endTime) {
        const prices = await this.fetchPricesForCity(bike.city_id);
        const minutes = this.calculateDuration(bikeInUse.start_time, endTime);
>>>>>>> 6e40cedfd96eecfd3c13ac6b3622bb49f5b62f1c
        const rentCost = minutes * prices.minute_fee;
        const parkingFee = parkedOK ? 0 : prices.parking_fee;

        let discountMultiplier = 1;

        if (parkedOK) {
<<<<<<< HEAD
            const rentedFromParking = (trip.start_zone_type !== null);

            discountMultiplier = rentedFromParking ? 1 : prices.discount_multiplier;
        }
        console.log("COSTS: ", rentCost, parkingFee, prices.start_fee, discountMultiplier);
=======
            const rentedFromParking = (bikeInUse.start_zone_type !== null);

            discountMultiplier = rentedFromParking ? 1 : prices.discount_multiplier;
        }

>>>>>>> 6e40cedfd96eecfd3c13ac6b3622bb49f5b62f1c
        const totalCost =
            (Number(rentCost) + Number(parkingFee)) +
            (Number(prices.start_fee) * Number(discountMultiplier));

        // Returns number with two decimal places: 1 = 1.00.
<<<<<<< HEAD
        console.log("total price: ", (+totalCost).toFixed(2));
=======
>>>>>>> 6e40cedfd96eecfd3c13ac6b3622bb49f5b62f1c
        return (+totalCost).toFixed(2);
    }
}
export { PricingService };
export default new PricingService();
