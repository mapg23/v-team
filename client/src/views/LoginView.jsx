import { useNavigate } from "react-router-dom";

import { useAuth } from "../components/AuthProvider";


export default function LoginView() {
  const navigate = useNavigate(); // redirect på React vis
  const { login } = useAuth();

  function handleLogin(e) {
    e.preventDefault();
    console.log("Login");
    login();
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
              placeholder=""
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Lösenord</label>
            <input
              type="password"
              className="form-control"
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

        <button className="btn btn-outline-dark w-100 d-flex align-items-center justify-content-center gap-2 mb-4">
          <i className="bi bi-github"></i>
          Logga in med Github
        </button>
      </div>
    </div>
  );
}
