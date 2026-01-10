import formstyle from "./Form.module.css";
import inputstyle from "../input/input.module.css";
import { useState } from "react";

/**
 * @param {Object} onFormSubmit function to call when form is submitted
 * The form only renders the UI - it has nothing to do with the login 
 * logic 
 * @returns 
 */
export default function CostForm({ onFormSubmit, priceDetails }) {
  const [startFee, setStartFee] = useState(priceDetails.start_fee);
  const [minuteFee, setMinuteFee] = useState(priceDetails.minute_fee);
  const [parkingFee, setParkingFee] = useState(priceDetails.parking_fee);
  const [discountMultiplier, setDiscountMultiplier] = useState(priceDetails.discount_multiplier);

  /**
   * Call parent function onSubmit
   * Keep logic seperated from form
   * @param {Event} e
   */
  function handleSubmit(e) {
    e.preventDefault();
    const updatedPriceDetails = {
      startFee,
      minuteFee,
      parkingFee,
      discountMultiplier,
    };
    onFormSubmit(updatedPriceDetails);
  }

  return (
    <form onSubmit={handleSubmit} className={formstyle.form}>
      <label>Start fee</label>
      <input
        type="Number"
        placeholder="Starting fee"
        value={startFee} // use for validation
        onChange={(e) => setStartFee(e.target.value)}
        className={inputstyle.input}
      />

      <label>Price per minute fee</label>
      <input
        type="Number"
        placeholder="Price per minute fee"
        value={minuteFee} // use for validation
        onChange={(e) => setMinuteFee(e.target.value)}
        className={inputstyle.input}
      />

      <label>Ticket fee for invalid parking</label>
      <input
        type="Number"
        placeholder="Ticket fee for invalid parking"
        value={parkingFee} // use for validation
        onChange={(e) => setParkingFee(e.target.value)}
        className={inputstyle.input}
      />

      <label>Discount if correct parking</label>
      <input
        type="Number"
        placeholder="Discount if correct parking"
        value={discountMultiplier} // use for validation
        onChange={(e) => setDiscountMultiplier(e.target.value)}
        className={inputstyle.input}
      />

      <button type="submit">Update cost!</button>
    </form>
  );
}
