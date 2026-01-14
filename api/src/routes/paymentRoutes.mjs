import express from 'express';
import * as validation from "../middleware/validation/validationMiddleware.mjs";
import Stripe from "stripe";
// import wallets from '../models/wallets.mjs';
import walletService from '../services/walletService.mjs';

const stripe = new Stripe(`${process.env.STRIPE_SECRET}`);

const router = express.Router();

/**
 * Create a Stripe payment intent
 * Request body needs: amount in öre/cent/pence
 * @returns the client secret
 */
router.post(`/create-intent`,
    validation.createIntent,
    validation.checkValidationResult,
    async (req, res) => {
        console.log("INIT INTENT : ", process.env.STRIPE_SECRET);
        const { amount, id } = req.body;

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
                metadata: {
                    "user_id": id,
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
                console.error(`Payment with intent ${intentId} failed`);
                return res.json({ status: status, message: "Payment was not successfull." });
            }

            const newBalance = walletService.credit(userId, amountInKrona, intentId);

            // console.log("SUCCESS for INTENT : ", intentId);
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
