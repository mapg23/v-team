import express from 'express';
// import * as validation from "../middleware/validation/validationMiddleware.mjs";
import Stripe from "stripe";

const stripe = new Stripe(`${process.env.STRIPE_SECRET}`);

const router = express.Router();

/**
 * Create a Stripe payment intent
 * Request body needs:
 * ID for the user
 * ID for the bike
 * @returns {Array} an array with the trip object.
 */
router.post(`/create-intent`,
    // validation.idBody,
    // validation.checkValidationResult,
    async (req, res) => {
        const { amount } = req.body;

        console.log("initializing create-intent for: ", amount);
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

export default router;
