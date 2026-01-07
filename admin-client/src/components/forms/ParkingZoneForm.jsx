import formstyle from "./Form.module.css";
import inputstyle from "../input/input.module.css";

import { useState } from "react";

/**
 * @param {Object} onFormSubmit function to call when form is submitted
 * The form only renders the UI - it has nothing to do with the login 
 * logic 
 * @returns 
 */
export default function CreateParkingZoneForm({ onFormSubmit }) {
  const [zoneName, setZoneName] = useState("");

  /**
   * Call parent function onSubmit
   * Keep logic seperated from form
   * @param {Event} e
   */
  function handleSubmit(e) {
    e.preventDefault();
    onFormSubmit({ zoneName });
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
      <button type="submit">Vill du spara parkeringen?</button>
    </form>
  );
}
