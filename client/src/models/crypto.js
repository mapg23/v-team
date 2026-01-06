// C

export function generateRandomString(length) {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Enodes string with sha256, recommended way
// https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/digest#basic_example
async function sha256(string) {
  const encoder = new TextEncoder();
  const data = encoder.encode(string);
  return crypto.subtle.digest("SHA-256", data);
}

// https://stackoverflow.com/questions/59911194/how-to-calculate-pckes-code-verifier
function base64UrlEncode(verifier) {
  return btoa(String.fromCharCode(...new Uint8Array(verifier)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

// Creates challange and verifier for PKCE OAuth 2.1
export async function createPKCE() {
  const verifier = generateRandomString(64);
  const challenge = base64UrlEncode(await sha256(verifier));
  return { verifier, challenge };
}
