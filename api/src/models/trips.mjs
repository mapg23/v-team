import db from "../database.mjs";

const trip = {
    /**
     * Start a ride by creating a new trip in the database.
     *
     * @param {Object} body - An object containing the trip data to insert.
     * @returns {Array} An array containing the result from the db operation.
     */
    createTransaction: async function createTransaction(body) {
        return await db.insert("trips", body);
    },

    /**
     * Fetch a single trip by its ID.
     *
     * @param {number} id - ID of the transaction.
     * @returns {Array} An array containing the result from the db operation.
     */
    getTransactionById: async function getTransactionById(id) {
        return await db.select("trips", "*", "id = ?", [id]);
    },

    /**
     * Fetch all trips for a user by user ID.
     *
     * @param {number} userId - ID of the user.
     * @returns {Array} An array containing the result from the db operation.
     * select(table, columns = '*', where = '', params = [])
     */
    getTransactionByUserId: async function getTransactionByUserId(userId) {
        return await db.select("trips", "*", "user_id = ?", [userId]);
    },

    /**
     * Update a trip in the database by its ID.
     *
     * @param {number} id - The ID of the trip to update.
     * @param {Object} body - An object containing the trip data to insert.
     * @returns {Array} An array containing the result from the db operation.
     */
    updateTransaction: async function updateTransaction(id, data) {
        return await db.update("trips", data, "id = ?", [id]);
    },
};

export default trip;
