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
<<<<<<< HEAD
     * @returns {Object} trip The trip with the argumented id.
     */
    async getWalletByUserId(userId) {
=======
     * @returns {Promise<Array>} trip The trip with the argumented id.
     */
    async findWalletByUserId(userId) {
>>>>>>> 6e40cedfd96eecfd3c13ac6b3622bb49f5b62f1c
        const walletResult = await this.wallets.getWalletByUserId(userId);
        const wallet = walletResult[0];

        if (!wallet) {
            throw new Error(`User ${userId}s wallet was not found`);
        }
        return wallet;
    };

<<<<<<< HEAD
    async credit() {
        return "res";
    }
    async debit(userId, amount) {
        const wallet = await this.getWalletByUserId(userId);

        const newBalance = wallet.balance - amount;
=======
    /**
     * Add funds to a users wallet.
     * @param {string} userId A numeric string representing a users id.
     * @param {string} amount A numeric string representing the amount to credit the wallet.
     * @returns The wallets new balance.
     */
    async credit(userId, amount) {
        const wallet = await this.findWalletByUserId(userId);

        const newBalance = Number(wallet.balance) + Number(amount);
>>>>>>> 6e40cedfd96eecfd3c13ac6b3622bb49f5b62f1c


        const res = await this.wallets.updateWallet(
            wallet.id,
            {balance: newBalance},
        );

        if (!res?.affectedRows) {
            throw new Error("Failed to update wallet balance");
        }

        return newBalance;
    }
<<<<<<< HEAD
=======


    /**
     * Subtract funds to a users wallet.
     * @param {string} userId A numeric string representing a users id.
     * @param {string} amount A numeric string representing the amount to debit the wallet.
     * @returns The wallets new balance.
     */
    async debit(userId, amount) {
        const wallet = await this.findWalletByUserId(userId);
        const newBalance = Number(wallet.balance) - Number(amount);


        const res = await this.wallets.updateWallet(
            wallet.id,
            {balance: newBalance},
        );

        if (!res?.affectedRows) {
            throw new Error("Failed to update wallet balance");
        }

        return newBalance;
    }
    async createWalletForUser(userId) {
        const res = await walletsModel.createWallet({user_id: userId});

        if (!res.insertId) {
            throw new Error(`Could not create wallet for User ${userId}`);
        }
        return res;
    }
>>>>>>> 6e40cedfd96eecfd3c13ac6b3622bb49f5b62f1c
}
export { WalletService };
export default new WalletService();
