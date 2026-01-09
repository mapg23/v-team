import pricesModel from "../models/prices.mjs";


class PricingService {
    constructor(prices = pricesModel) {
        this.prices = prices;
    }
    /**
     * Fetches current prices for a city.
     * @param {string} cityId A numeric string
     * @returns {object} Prices row for city.
     */
    async fetchPricesForCity(cityId) {
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
     * Calculates cost by adding price/minute, potential parking fee,
     * the start fee and possible discount.
     * @param {Object} bike A bike object.
     * @param {Object} trip A trip object
     * @param {Boolean} parkedOK Tells if bike is parked in a parking zone.
     * @param {string} endTime a datetime string.
     * @returns {Number} totalCost The total cost of the trip.
     */
    async calculateTripCost(bike, bikeInUse, parkedOK, endTime) {
        const prices = await this.fetchPricesForCity(bike.city_id);
        const minutes = this.calculateDuration(bikeInUse.start_time, endTime);
        const rentCost = minutes * prices.minute_fee;
        const parkingFee = parkedOK ? 0 : prices.parking_fee;

        let discountMultiplier = 1;

        if (parkedOK) {
            const rentedFromParking = (bikeInUse.start_zone_type !== null);

            discountMultiplier = rentedFromParking ? 1 : prices.discount_multiplier;
        }

        const totalCost =
            (Number(rentCost) + Number(parkingFee)) +
            (Number(prices.start_fee) * Number(discountMultiplier));

        // Returns number with two decimal places: 1 = 1.00.
        return (+totalCost).toFixed(2);
    }
}
export { PricingService };
export default new PricingService();
