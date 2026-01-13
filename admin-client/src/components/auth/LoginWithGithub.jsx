// import { generateRandomString, createPKCE } from "services/crypto";
const clientId = import.meta.env.VITE_GITHUB_CLIENT_ID_ADMIN;
const redirectUri = import.meta.env.VITE_GITHUB_CALLBACK_ADMIN;
import { FaGithub } from "react-icons/fa";

/**
 * Gets PKCE data from the API.
 * A challenge and a state variable.
 * @returns {object} PKCEData
 */
export default function LoginWithGithub() {
    console.log("CLIENT ID: ", clientId);
    async function getPKCEData(clientId) {
        const response = await fetch("http://localhost:9091/api/v1/auth/oauth/get_state", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ client_id: clientId })
        });

        const result = await response.json();
        const PKCEData = {
            state: result.encryptedState,
            challenge: result.challenge
        };

        return PKCEData;
    }

    /**
     * Uses the PKCE-Data, builds the long URL with URLSearchParams
     * and starts the OAuth procedure.
     */
    async function login() {
        const PKCEData = await getPKCEData(clientId);
        // console.log("STATE: ", PKCEData.state, "CHALLENGE: ", PKCEData.challenge,);

        const params = new URLSearchParams({
            client_id: clientId,
            redirect_uri: redirectUri,
            scope: "user:email",
            state: PKCEData.state,
            code_challenge: PKCEData.challenge,
            code_challenge_method: "S256",
        });

        window.location.href = `https://github.com/login/oauth/authorize?${params}`;
    }

    return (
        <button
            onClick={login}><FaGithub size={25} /> Login with GitHub
        </button>
    );
}