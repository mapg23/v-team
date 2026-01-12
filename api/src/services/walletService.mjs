import walletsModel from "../models/wallets.mjs";

//potential refactor: controller gets bike & wallet.

class WalletService {
    constructor(wallets = walletsModel) {
        this.wallets = wallets;
    }
    /**
     * Checks that a wallet with the corresponding user_id exists and returns it.
     *
     * @param {string} userId A numeric value in string format.
     * @returns {Promise<Array>} trip The trip with the argumented id.
     */
    async findWalletByUserId(userId) {
        const walletResult = await this.wallets.getWalletByUserId(userId);
        const wallet = walletResult[0];

        if (!wallet) {
            throw new Error(`User ${userId}s wallet was not found`);
        }
        return wallet;
    };

    /**
     * Add funds to a users wallet.
     * @param {string} userId A numeric string representing a users id.
     * @param {string} amount A numeric string representing the amount to credit the wallet.
     * @returns The wallets new balance.
     */
    async credit(userId, amount, intentId = null) {
        const wallet = await this.findWalletByUserId(userId);

        const newBalance = Number(wallet.balance) + Number(amount);

        // Start transaction
        const res = await this.wallets.updateWallet(
            wallet.id,
            {balance: newBalance},
        );

        if (!res?.affectedRows) {
            console.error(
                `User ${userId} successfully paid ${amount}, but users wallet was not credited`
            );
            throw new Error("Failed to update wallet balance");
        }

        const logData = {
            wallet_id: wallet.id,
            amount,
            direction: "credit",
            intent_id: intentId
        };

        const logRes = await this.logWalletUpdate(logData);

        if (!logRes?.insertId) {
            throw new Error("Wallet credited but log failed");
        }

        return newBalance;
    }


    /**
     * Subtract funds to a users wallet.
     * @param {string} userId A numeric string representing a users id.
     * @param {string} amount A numeric string representing the amount to debit the wallet.
     * @returns The wallets new balance.
     */
    async debit(userId, amount, tripId = null) {
        const wallet = await this.findWalletByUserId(userId);
        const newBalance = Number(wallet.balance) - Number(amount);


        const res = await this.wallets.updateWallet(
            wallet.id,
            {balance: newBalance},
        );

        if (!res?.affectedRows) {
            throw new Error("Failed to update wallet balance");
        }
        const logData = {
            wallet_id: wallet.id,
            amount,
            direction: "debit",
            trip_id: tripId
        };

        this.logWalletUpdate(logData);

        return newBalance;
    }
    async createWalletForUser(userId) {
        const res = await walletsModel.createWallet({user_id: userId});

        if (!res.insertId) {
            throw new Error(`Could not create wallet for User ${userId}`);
        }
        return res;
    }

    /**
     * Creates a log for the wallet update.
     * Obligatory:  `wallet_id`, `amount` decimal(11,2), `direction` enum('credit','debit')
     * Auto:        `id`, `created`
     * Opptional:   `trip_id`, `intent_id`, `comment`.
     *
     * @param {Object} body - An object containing the log data to insert.
     * @returns {Promise<Array>} An array containing the result from the db operation.
     */
    async logWalletUpdate(body) {
        const res = await this.wallets.createWalletLog(body);

        console.log("WALLET_LOG: ", res);
        if (!res.insertId) {
            throw new Error(`Could not create a log for the wallet update`);
        }
        return res;
    }
}
export { WalletService };
export default new WalletService();
