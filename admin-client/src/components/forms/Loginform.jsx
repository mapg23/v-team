import formstyle from "./Loginform.module.css";
import inputstyle from "../input/input.module.css";
import btnstyle from "../button/Button.module.css"

/**
 * 
 * @returns HTML Form
 */
export default function LoginForm() {
    return (
      <form className={formstyle.form}>
        <label for="email">Email:</label>
        <input className={inputstyle.input} type="email" placeholder="example@gmail.com"></input>
        <label for="password">Password:</label>
        <input className={inputstyle.input} type="password" placeholder="s3cretPassw0rd"></input>
        <button className={btnstyle.btn} type="submit">Log in</button>
      </form>
    );
}