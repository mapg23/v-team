import { generateRandomString, createPKCE } from "services/crypto";
const clientId = import.meta.env.VITE_GITHUB_CLIENT_ID;
const redirectUri = "http://localhost:5173/login/github/callback";


export default function LoginWithGithub() {

  async function getEncryptedState(state) {
    const response = await fetch("http://localhost:9091/api/v1/auth/oauth/get_state", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ state: state })
    });

    const result = await response.json();
    // console.log(response, result);
    const encryptedState = result.encryptedState;

    return encryptedState;
  }

  async function login() {
    const rawState = generateRandomString(50);
    const encryptedState = await getEncryptedState(rawState);
    // console.log(rawState, encryptedState);
    const { verifier, challenge } = await createPKCE();
    // console.log("PKCE verifier:", verifier);
    // console.log("PKCE challenge:", challenge);
    sessionStorage.setItem("pkce_verifier", verifier)
    sessionStorage.setItem("oauth_state", encryptedState);
    sessionStorage.setItem("oauth_state_raw", rawState);

    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      scope: "user:email",
      state: encryptedState,
      code_challenge: challenge,
      code_challenge_method: "S256",
    });

    window.location.href = `https://github.com/login/oauth/authorize?${params}`;
  }

  return <button onClick={login}>Login with GitHub</button>;
}