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
     * @returns {Object} trip The trip with the argumented id.
     */
    async getWalletByUserId(userId) {
        const walletResult = await this.wallets.getWalletByUserId(userId);
        const wallet = walletResult[0];

        if (!wallet) {
            throw new Error(`User ${userId}s wallet was not found`);
        }
        return wallet;
    };

    async credit() {
        return "res";
    }
    async debit(userId, amount) {
        const wallet = await this.getWalletByUserId(userId);

        const newBalance = wallet.balance - amount;


        const res = await this.wallets.updateWallet(
            wallet.id,
            {balance: newBalance},
        );

        if (!res?.affectedRows) {
            throw new Error("Failed to update wallet balance");
        }

        return newBalance;
    }
}
export { WalletService };
export default new WalletService();
