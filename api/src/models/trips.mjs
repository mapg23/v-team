import db from "../database.mjs";

const trip = {
    /**
     * Start a ride by creating a new trip in the database.
     *
     * @param {Object} body - An object containing the trip data to insert.
     * @returns {Array} An array containing the result from the db operation.
     */
    createTrip: function createTrip(body) {
        return db.insert("trips", body);
    },

    /**
     * Fetch all trips.
     *
     * @returns {Array} An array containing the result from the db operation.
     */
    getTrips: function getTrips() {
        return db.select("trips", "*");
    },

    /**
     * Fetch a single trip by its ID.
     *
     * @param {number} id - ID of the transaction.
     * @returns {Array} An array containing the result from the db operation.
     */
    getTripById: function getTripById(id) {
        return db.select("trips", "*", "id = ?", [id]);
    },

    /**
     * Fetch all trips for a user by user ID.
     *
     * @param {number} userId - ID of the user.
     * @returns {Array} An array containing the result from the db operation.
     * select(table, columns = '*', where = '', params = [])
     */
    getTripsByUserId: function getTripsByUserId(userId) {
        return db.select("trips", "*", "user_id = ?", [userId]);
    },

    /**
     * Update a trip in the database by its ID.
     *
     * @param {number} id - The ID of the trip to update.
     * @param {Object} body - An object containing the trip data to insert.
     * @returns {Promise<Array>} An array containing the result from the db operation.
     */
    updateTrip: function updateTrip(id, data) {
        return db.update("trips", data, "id = ?", [id]);
    },

    /**
     * Delete a trip in the database by its ID.
     *
     * @param {number} id - The ID of the trip to delete.
     * @returns {Array} An array containing the result from the db operation.
     */
    deleteTrip: function deleteTrip(id) {
        return db.remove("trips", "id = ?", [id]);
    },
};

export default trip;

