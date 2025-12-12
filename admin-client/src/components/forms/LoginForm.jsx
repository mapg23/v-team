import formstyle from "./Form.module.css";
import inputstyle from "../input/input.module.css";
import btnstyle from "../button/Button.module.css";

import { useState } from "react";

/**
 * @param {Object} onFormSubmit function to call when form is submitted
 * The form only renders the UI - it has nothing to do with the login 
 * logic 
 * @returns 
 */
export default function LoginForm({ onFormSubmit }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  /**
   * Call parent function onSubmit
   * Keep logic seperated from form
   * @param {Event} e
   */
  function handleSubmit(e) {
    console.log("handlesubmit called");
    e.preventDefault();
    onFormSubmit({ email, password });
  }

  return (
    <form onSubmit={handleSubmit} className={formstyle.form}>
      <h2>Logga in</h2>

      {/* {error && <p style={{ color: "red" }}>{error}</p>} */}

      <input
        // type="email"
        placeholder="example@gmail.com"
        value={email} // use for validation
        onChange={(e) => setEmail(e.target.value)}
        className={inputstyle.input}
      />

      <input
        // type="password"
        placeholder="Lösenord"
        value={password} // use for validation
        onChange={(e) => setPassword(e.target.value)}
        className={inputstyle.input}
      />

      <button type="submit" className={btnstyle.btn}>
        Logga in
      </button>
    </form>
  );
}
