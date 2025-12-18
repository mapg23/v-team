import { useNavigate } from "react-router-dom";
import { useState } from "react";

import "./AuthForm.css";

export default function AuthForm({ callback }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const login = () => {
        callback({ email: email, password: password });
    }

    return (
        <div className="login-box">
            <h2>Sign in</h2>

            <form className="login-form">
                <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
                <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />

                <label className="remember-row">
                    <input type="checkbox" />
                    <span>Remember me</span>
                </label>

                <button className="btn-primary" onClick={login}>Sign in</button>

                <button type="button" className="btn-github">
                    Sign in with Github
                </button>

                <a href="#" className="form-link">Forgotten your password?</a>
                <a href="#" className="form-link">Create an account</a>
            </form>
        </div>
    );
}
