import { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

import CheckoutForm from "../../components/payments/CheckoutForm";
import AmountSelector from "../../components/payments/AmountSelector";
import "./PaymentView.css";

import { getApiBase } from "../../apiUrl";



// Make sure to call loadStripe outside of a component’s render to avoid
// recreating the Stripe object on every render.
// Test card: 42424242... date=future date, cvc=[0-9]{3}

// public test key.
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC);

export default function PaymentView() {
  const API = getApiBase();
  const [clientSecret, setClientSecret] = useState("");

  const [selectedAmount, setSelectedAmount] = useState("");

  useEffect(() => {
    const token = sessionStorage.getItem("jwt");

    console.log(token);
    if (!selectedAmount) { return };
    // Create PaymentIntent as soon as the page loads
    fetch(`${API}/payments/create-intent`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ amount: selectedAmount }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`could not connect with stripe ${res.status}`)
        }
        return res.json()
      })
      .then((data) => setClientSecret(data.clientSecret));

  }, [selectedAmount]);

  const appearance = {
    theme: 'stripe',
  };
  // Enable the skeleton loader UI for optimal loading. OK?
  const loader = 'auto';

  return (
    <div className="container payment-container">
      <AmountSelector onSelect={setSelectedAmount} />

      {clientSecret && (
        <Elements options={{ clientSecret, appearance, loader }} stripe={stripePromise}>
          <CheckoutForm />
        </Elements>
      )}
    </div>
  );
}
