import { useState } from "react";

/**
 * @param {Object} onFormSubmit function to call when form is submitted
 * The form only renders the UI - it has nothing to do with the login 
 * logic 
 * @returns 
 */
export default function CreateChargingZoneForm({ onFormSubmit }) {
  const [zoneName, setZoneName] = useState("");

  /**
   * Call parent function onSubmit
   * Keep logic seperated from form
   * @param {Event} e
   */
  function handleSubmit(e) {
    e.preventDefault();
    onFormSubmit(zoneName);
    // Reset input
    resetInput();
  }

  /**
   * Reset all user input
   */
  function resetInput() {
    setZoneName("");
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="input">
        <label htmlFor="zoneName">Välj ett namn för laddstationen: </label>
        <input
          type="text"
          id="zoneName"
          onChange={(e) => setZoneName(e.target.value)}
          required
        />
      </div>
      <button type="submit">Spara laddstation!</button>
    </form>
  );
}
