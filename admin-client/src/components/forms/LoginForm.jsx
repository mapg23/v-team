import formstyle from "./Form.module.css";
import inputstyle from "../input/input.module.css";

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
  const [username, setUsername] = useState("");

  /**
   * Call parent function onSubmit
   * Keep logic seperated from form
   * @param {Event} e
   */
  function handleSubmit(e) {
    e.preventDefault();
    onFormSubmit({ email, password, username });
    // Reset input
    resetInput();
  }

  /**
   * Reset all user input
   */
  function resetInput() {
    setEmail("");
    setUsername("");
    setPassword("");
  }

  return (
    <form onSubmit={handleSubmit} className={formstyle.form}>

      <input
        type="email"
        placeholder="example@gmail.com"
        value={email} // use for validation
        onChange={(e) => setEmail(e.target.value)}
        className={inputstyle.input}
      />

      <input
        type="password"
        placeholder="Lösenord"
        value={password} // use for validation
        onChange={(e) => setPassword(e.target.value)}
        className={inputstyle.input}
      />

      <input
        type="text"
        placeholder="Username"
        value={username} // use for validation
        onChange={(e) => setUsername(e.target.value)}
        className={inputstyle.input}
      />

      <button type="submit">
        Logga in
      </button>
    </form>
  );
}
