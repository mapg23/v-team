import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

export default function GithubCallback({ onLogin }) {
    // console.log("GH CALLBACK");
    const navigate = useNavigate();
    const effectRan = useRef(false);

    useEffect(() => {
        if (effectRan.current) return;
        effectRan.current = true;

        async function handleCallback() {
            console.log("HANDLE CALLBACK");
            const urlParams = new URLSearchParams(window.location.search);
            const code = urlParams.get("code");
            const encryptedState = urlParams.get("state");

            const response = await fetch(
                "/api/v1/auth/oauth/login",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        code,
                        encryptedState,
                    }),
                }
            );

            const data = await response.json();

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