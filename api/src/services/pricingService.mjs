import pricesModel from "../models/prices.mjs";


class PricingService {
    constructor(prices = pricesModel) {
        // Inject the models class it is depending on.
        this.prices = prices;
    }
    async getPricesForCity(cityId) {
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
     *
     * @param {Object} bike A bike object.
     * @param {Object} trip A trip object
     * @param {Boolean} parkedOK Tells if bike is parked in a parking zone.
     * @param {string} endTime a datetime string.
     * @returns {Number} totalCost The total cost of the trip.
     */
    async calculateTripCost(bike, trip, parkedOK, endTime) {
        const prices = await this.getPricesForCity(bike.city_id);
        const minutes = this.calculateDuration(trip.start_time, endTime);
        const rentCost = minutes * prices.minute_fee;
        const parkingFee = parkedOK ? 0 : prices.parking_fee;

        let discountMultiplier = 1;

        if (parkedOK) {
            const rentedFromParking = (trip.start_zone !== null);

            discountMultiplier = rentedFromParking ? 1 : prices.discount_multiplier;
        }
        console.log("COSTS: ", rentCost, parkingFee, prices.start_fee, discountMultiplier);
        const totalCost =
            (Number(rentCost) + Number(parkingFee)) +
            (Number(prices.start_fee) * Number(discountMultiplier));

        // Returns number with two decimal places: 1 = 1.00.
        console.log("total price: ", (+totalCost).toFixed(2));
        return (+totalCost).toFixed(2);
    }
}
export { PricingService };
export default new PricingService();
