import db from "../database.mjs";

const transaction = {
    /**
     * Start a ride by creating a new transaction in the database.
     *
     * @param {Object} body - An object containing the transaction data to insert.
     * @returns {Array} An array containing the result from the db operation.
     */
    createTransaction: async function createTransaction(body) {
        return await db.insert("transactions", body);
    },

    /**
     * Fetch a single transaction by its ID.
     *
     * @param {number} id - ID of the transaction.
     * @returns {Array} An array containing the result from the db operation.
     */
    getTransactionById: async function getTransactionById(id) {
        return await db.select("transactions", "*", "id = ?", [id]);
    },

    /**
     * Fetch all transactions for a user by user ID.
     *
     * @param {number} userId - ID of the user.
     * @returns {Array} An array containing the result from the db operation.
     * select(table, columns = '*', where = '', params = [])
     */
    getTransactionByUserId: async function getTransactionByUserId(userId) {
        return await db.select("transactions", "*", "user_id = ?", [userId]);
    },

    /**
     * Update a transaction in the database by its ID.
     *
     * @param {number} id - The ID of the transaction to update.
     * @param {Object} body - An object containing the transaction data to insert.
     * @returns {Array} An array containing the result from the db operation.
     */
    updateTransaction: async function updateTransaction(id, data) {
        return await db.update("transactions", data, "id = ?", [id]);
    },
};

export default transaction;
