import express from 'express';
import * as validation from "../middleware/validation/validationMiddleware.mjs";
import Stripe from "stripe";
import wallets from '../models/wallets.mjs';
import walletService from '../services/walletService.mjs';

const stripe = new Stripe(`${process.env.STRIPE_SECRET}`);

const router = express.Router();

/**
 * Create a Stripe payment intent
 * Request body needs: amount in öre/cent/pence
 * @returns the client secret
 */
router.post(`/create-intent`,
    // validation.idBody,
    // validation.checkValidationResult,
    async (req, res) => {
        const { amount } = req.body;

        // console.log("initializing create-intent for: ", amount);
        try {
        // Create a PaymentIntent with the order amount and currency
            const paymentIntent = await stripe.paymentIntents.create({
                // amount: calculateOrderAmount(items),
                amount: amount,
                currency: "sek",
                // In the latest version of the API, specifying the
                // `automatic_payment_methods` parameter is optional
                // because Stripe enables its functionality by default.
                automatic_payment_methods: {
                    enabled: true,
                },
            });

            console.log(paymentIntent);

            res.send({
                clientSecret: paymentIntent.client_secret,
            });
        } catch (err) {
            console.error('Error creating Stripe payment intent: ', err);
            res.status(500).json({ error: err.message });
        }
    });
/**
 * If payment is successfull, this route will add the sum to logged in users balance
 * Returns the amount in swedish krona and the updated balance.
 */
router.post(`/payment-success`,
    // validation.payment,
    // validation.checkValidationResult,
    async (req, res) => {
        // req.body.userId = 3;
        const { userId, intentId, status } = req.body;

        console.log("Status: ", status, ". For: ", intentId);

        try {
            const paymentIntent = await stripe.paymentIntents.retrieve(intentId);
            const {amount, status} = paymentIntent;
            const amountInKrona = amount / 100;


            // console.log(paymentIntent, "*** status, amount: ", status, amount);

            if (status !== "succeeded") {
                return res.json({ status: status, message: "Payment was not successfull." });
            }

            let walletRes = await wallets.getWalletByUserId(userId);

            if (!walletRes[0]) {
                walletRes = await wallets.createWallet(userId);
            }
            // console.log("WalletRes: ", walletRes);
            const userWallet = walletRes[0];

            const newBalance = userWallet.balance += (amountInKrona);
            const updateData = {
                balance: newBalance
            };

            // Update balance in users wallet
            const result = await wallets.updateWallet(userWallet.id, updateData);

            // console.log(result); // OkPacket { affectedRows: 1, insertId: 0n, warningStatus: 0 }
            if (result.affectedRows === 0) {
                throw new Error("balance was not updated");
            }

            return res.json({ added: amountInKrona, balance: newBalance });
        } catch (err) {
            console.error('Error creating Stripe payment intent: ', err);
            res.status(500).json({ error: err.message });
        }
    });
/**
 * Returns user balance
*/
router.get(`/user/:id`,
    validation.idParam,
    validation.checkValidationResult,
    async (req, res) => {
        try {
            const userWallet = await walletService.findWalletByUserId(req.params.id);

            return res.status(200).json(userWallet);
        } catch (err) {
            console.error(err);
            return res.status(500).json({
                error: `Could not fetch wallet for user ${req.params.id}`,
                message: err.message
            });
        }
    });

export default router;
