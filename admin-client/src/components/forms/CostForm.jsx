import formstyle from "./Form.module.css";
import inputstyle from "../input/input.module.css";
import { useState } from "react";

/**
 * @param {Object} onFormSubmit function to call when form is submitted
 * The form only renders the UI - it has nothing to do with the login 
 * logic 
 * @returns 
 */
export default function CostForm({ onFormSubmit }) {
  const [initialCost, setInitialCost] = useState(10);
  const [variableCost, setVariableCost] = useState(2);
  const [loading, setLoading] = useState(false);

  /**
   * Call parent function onSubmit
   * Keep logic seperated from form
   * @param {Event} e
   */
  function handleSubmit(e) {
    e.preventDefault();
    onFormSubmit({ initialCost, variableCost});
    // Reset input
    resetInput();
  }

  /**
   * Reset all user input
   */
  function resetInput() {
    setInitialCost("");
    setVariableCost("");
  }

  if (loading) return <p>loading..</p>

  return (
    <form onSubmit={handleSubmit} className={formstyle.form}>
      <input
        type="Number"
        min="10"
        max="50"
        placeholder="Startkostnad"
        value={initialCost} // use for validation
        onChange={(e) => setInitialCost(e.target.value)}
        className={inputstyle.input}
      />

      <input
        type="Number"
        min="2"
        max="10"
        placeholder="Kostnad per minut"
        value={variableCost} // use for validation
        onChange={(e) => setVariableCost(e.target.value)}
        className={inputstyle.input}
      />

      <button type="submit">
        Uppdatera priser
      </button>
    </form>
  );
}
