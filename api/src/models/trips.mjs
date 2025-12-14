import db from "../database.mjs";

const trip = {
    /**
     * Start a ride by creating a new trip in the database.
     *
     * @param {Object} body - An object containing the trip data to insert.
     * @returns {Array} An array containing the result from the db operation.
     */
    createTrip: async function createTrip(body) {
        return await db.insert("trips", body);
    },

    /**
     * Fetch a single trip by its ID.
     *
     * @param {number} id - ID of the transaction.
     * @returns {Array} An array containing the result from the db operation.
     */
    getTripById: async function getTripById(id) {
        return await db.select("trips", "*", "id = ?", [id]);
    },

    /**
     * Fetch all trips for a user by user ID.
     *
     * @param {number} userId - ID of the user.
     * @returns {Array} An array containing the result from the db operation.
     * select(table, columns = '*', where = '', params = [])
     */
    getTripsByUserId: async function getTripByUserId(userId) {
        return await db.select("trips", "*", "user_id = ?", [userId]);
    },

    /**
     * Update a trip in the database by its ID.
     *
     * @param {number} id - The ID of the trip to update.
     * @param {Object} body - An object containing the trip data to insert.
     * @returns {Array} An array containing the result from the db operation.
     */
    updateTrip: async function updateTrip(id, data) {
        return await db.update("trips", data, "id = ?", [id]);
    },
};

export default trip;
