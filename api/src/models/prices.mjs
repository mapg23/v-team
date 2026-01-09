import db from "../database.mjs";

const prices = {
    /**
     * Create prices for a new city
     *
     * @param {Object} body - An object containing the trip data to insert.
     * @returns {Array} An array containing the result from the db operation.
     */
    createPrices: function createPrices(body) {
        return db.insert("prices", body);
    },

    /**
     * Fetch a set of prices by its ID.
     *
     * @param {number} id - ID of the transaction.
     * @returns {Array} An array containing the result from the db operation.
     */
    getPricesById: function getPricesById(id) {
        return db.select("prices", "*", "id = ?", [id]);
    },

    /**
     * Fetch prices for a city by city ID.
     *
     * @param {number} cityId - ID of the city.
     * @returns {Array} An array containing the result from the db operation.
     * select(table, columns = '*', where = '', params = [])
     */
    getPricesByCityId: function getPricesByCityId(cityId) {
        return db.select("prices", "*", "city_id = ?", [cityId]);
    },

    /**
     * Update prices in the database by city ID.
     *
     * @param {number} cityId - The ID of the city where prices should be updated.
     * @param {Object} body - An object containing the prices data to insert.
     * @returns {Array} An array containing the result from the db operation.
     */
    updatePricesByCityId: function updatePricesByCityId(cityId, data) {
        return db.update("prices", data, "id = ?", [cityId]);
    },

};

export default prices;

