import db from "../database.mjs";

const wallets = {
    /**
     * Create a new wallet in the database.
     *
     * id - Auto increment
     * user_id - Required
     * amount - Default 0
     *
     * @param {Object} body - An object containing the wallet data to insert.
     * @returns {Array} An array containing the result from the db operation.
     */
    createWallet: function createWallet(body) {
        return db.insert("wallets", body);
    },

    /**
     * Fetch a single wallet by its ID.
     *
     * @param {number} id - ID of the transaction.
     * @returns {Array} An array containing the result from the db operation.
     */
    getWalletById: function getWalletById(id) {
        return db.select("wallets", "*", "id = ?", [id]);
    },

    /**
     * Fetch wallet by the user ID (UNIQUE).
     *
     * @param {number} userId - ID of the user.
     * @returns {Array} An array containing the result from the db operation.
     * select(table, columns = '*', where = '', params = [])
     */
    getWalletByUserId: function getWalletByUserId(userId) {
        return db.select("wallets", "*", "user_id = ?", [userId]);
    },

    /**
     * Update a wallet in the database by its ID.
     *
     * @param {number} id - The ID of the trip to update.
     * @param {Object} body - An object containing the trip data to insert.
     * @returns {Array} An array containing the result from the db operation.
     */
    updateWallet: function updateWallet(id, data) {
        return db.update("wallets", data, "id = ?", [id]);
    },
};

export default wallets;

