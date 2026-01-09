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
     * @returns {Promise<Array>} An array containing the result from the db operation.
     */
    createWallet: async function createWallet(body) {
        return await db.insert("wallets", body);
    },

    /**
     * Fetch a single wallet by its ID.
     *
     * @param {number} id - ID of the transaction.
     * @returns {Promise<Array>} An array containing the result from the db operation.
     */
    getWalletById: async function getWalletById(id) {
        return await db.select("wallets", "*", "id = ?", [id]);
    },

    /**
     * Fetch wallet by the user ID (UNIQUE).
     *
     * @param {number} userId - ID of the user.
     * @returns {Promise<Array>} An array containing the result from the db operation.
     * select(table, columns = '*', where = '', params = [])
     */
    getWalletByUserId: async function getWalletByUserId(userId) {
        return await db.select("wallets", "*", "user_id = ?", [userId]);
    },

    /**
     * Update a wallet in the database by its ID.
     *
     * @param {number} id - The ID of the trip to update.
     * @param {Object} body - An object containing the trip data to insert.
     * @returns {Promise<Array>} An array containing the result from the db operation.
     */
    updateWallet: async function updateWallet(id, data) {
        return await db.update("wallets", data, "id = ?", [id]);
    },

    /**
     * Log a wallet update.
     * Auto:        `id`, `created`
     * Obligatory:  `wallet_id`, `amount`, decimal(11,2), `direction` enum('credit','debit')
     * Opptional:   `trip_id`, `intent_id`, `comment`.
     * @param {Object} body - An object containing the wallet data to insert.
     * @returns {Promise<Array>} An array containing the result from the db operation.
     */
    createWalletLog: async function createWallet(body) {
        return await db.insert("wallet_logs", body);
    },
};

export default wallets;

