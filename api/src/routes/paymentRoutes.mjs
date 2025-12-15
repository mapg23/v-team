import express from 'express';
// import * as validation from "../middleware/validation/validationMiddleware.mjs";
import Stripe from "stripe";

const stripe = new Stripe(`${process.env.STRIPE_SECRET}`);

const router = express.Router();

/**
 * Create a Stripe checkout session
 * Request body needs:
 * ID for the user
 * ID for the bike
 * @returns {Array} an array with the trip object.
 */
router.post(`/pay-with-stripe`,
    // validation.idBody,
    // validation.checkValidationResult,
    async (req, res) => {
        const session = await stripe.checkout.sessions.create({
            line_items: [
                {
                    // Provide the exact Price ID (for example,
                    // price_1234) of the product you want to sell
                    price: '{{price_1SeWhVEthuRq4UFn2vzOqCiF}}',
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `localhost:5173/payment?success=true`,
        });

        res.redirect(303, session.url);
    });

export default router;
