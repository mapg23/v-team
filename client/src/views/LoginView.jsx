import { useNavigate } from "react-router-dom";
import { useState } from "react";

import { useAuth } from "../components/AuthProvider";

import LoginWithGithub from "../components/LoginWithGithub";

import UserModel from "../models/UserModel";


export default function LoginView() {
  const navigate = useNavigate(); // redirect på React vis
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin(e) {
    e.preventDefault();
    console.log("Login");

    let id = await UserModel.loginUser(email, password);

    login(id);
    navigate("/", { replace: true });
  }

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
      <div
        className="card shadow-sm p-4"
        style={{ width: "100%", maxWidth: "380px" }}
      >
        <h4 className="text-center mb-4 fw-semibold">Logga in</h4>

        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label className="form-label">Epost</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder=""
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Lösenord</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder=""
            />
          </div>

          <button
            type="submit"
            className="btn btn-secondary w-100 mb-3"
          >
            Logga in
          </button>
        </form>

        <div className="text-center text-muted my-3">eller</div>

        <LoginWithGithub></LoginWithGithub>

      </div>
    </div>
  );
}
