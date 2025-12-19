import express from 'express';
// import * as validation from "../middleware/validation/validationMiddleware.mjs";
import Stripe from "stripe";
const router = express.Router();

const stripe = new Stripe(`${process.env.STRIPE_SECRET}`);



// Replace this endpoint secret with your unique endpoint secret key
// If you're testing with the CLI, run 'stripe listen' to find the secret key
// If you defined your endpoint using the API or the Dashboard,
// check your webhook settings for your endpoint secret: https://dashboard.stripe.com/webhooks
const endpointSecret = process.env.STRIPE_WEBHOOK;

// The express.raw middleware keeps the request body unparsed;
// this is necessary for the signature verification process
router.post('/webhook', express.raw({type: 'application/json'}), (request, response) => {
    console.log("webhook hooked up");
    let event;
    let paymentIntent;
    let paymentMethod;

    if (endpointSecret) {
    // Get the signature sent by Stripe
        const signature = request.headers['stripe-signature'];

        try {
            event = stripe.webhooks.constructEvent(
                request.body,
                signature,
                endpointSecret
            );
        } catch (err) {
            console.log(`⚠️ Webhook signature verification failed.`, err.message);
            return response.sendStatus(400);
        }
        console.log(event);
        // Handle the event
        switch (event.type) {
            case 'payment_intent.succeeded':
                paymentIntent = event.data.object;
                // Then define and call a method to handle the successful payment intent.
                // handlePaymentIntentSucceeded(paymentIntent);
                console.log(paymentIntent);
                break;
            case 'payment_method.attached':
                paymentMethod = event.data.object;
                // Then define and call a method to handle the
                // successful attachment of a PaymentMethod.
                // handlePaymentMethodAttached(paymentMethod);
                console.log(paymentMethod);
                break;
                // ... handle other event types
            default:
                console.log(`Unhandled event type ${event.type}`);
        }

        // Return a response to acknowledge receipt of the event
        response.json({received: true});
    }
});

export default router;
