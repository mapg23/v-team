import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

export default function GithubCallback({ onLogin }) {
  const navigate = useNavigate();
  const effectRan = useRef(false);

  useEffect(() => {
    if (effectRan.current) return;
    effectRan.current = true;

    async function handleCallback() {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get("code");
      const encryptedState = urlParams.get("state");

      const savedState = sessionStorage.getItem("oauth_state");
      const rawState = sessionStorage.getItem("oauth_state_raw");
      const codeVerifier = sessionStorage.getItem("pkce_verifier");
      //   console.log("Stored verifier:", codeVerifier);

      if (encryptedState !== savedState) {
        console.error("Invalid OAuth state!");
        return;
      }

      const response = await fetch(
        "/api/v1/auth/oauth/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            code,
            encryptedState,
            rawState,
            code_verifier: codeVerifier,
          }),
        }
      );

      const data = await response.json();
      // Empty session storage
      sessionStorage.clear();

      if (data.jwt) {
        // Token ska göra att jag är inloggad
        sessionStorage.setItem("jwt", data.jwt);
        await onLogin();
        navigate("/");
      }
    }

    handleCallback();
  }, [navigate, onLogin]);

  return <p>Logging in... </p>;
} 