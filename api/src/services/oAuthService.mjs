import jwtService from "./jwtService.mjs";
import createUsers from "../models/users.mjs";

export const userModel = createUsers();

const oAuthService = {
    /**
   * Takes a unique code and a code verifier, used to get an access token from Github.
   * The access token combined with the code verifier gives us right to see the
   * data defined in our scope on the initial request from frontend.
   * @param   {string} code         Code from Oatuh provider
   * @param   {string} codeVerifier The PKCE code verifyer is sent again from backend
   * @returns {string} accessToken  Access token from Oatuh provider
   */
    getAccessToken: async function (code, codeVerifier) {
        const res = await fetch("https://github.com/login/oauth/access_token", {
            method: "POST",
            headers: { Accept: "application/json" },
            body: new URLSearchParams({
                client_id: process.env.GITHUB_CLIENT_ID,
                client_secret: process.env.GITHUB_CLIENT_SECRET,
                redirect_uri: "http://localhost:5173/login/github/callback",
                code: code,
                code_verifier: codeVerifier,
            }),
        });

        const { access_token: accessToken, error } = await res.json();

        if (error) {
            const err = new Error(`Failed getting Github token: ${error}`);

            err.status = 401;
            err.details = error;
            throw err;
        }

        return accessToken;
    },

    /**
   * Uses access token to fetch users emails from github.
   * @param   {string} access_token token provided by GitHub
   * @returns {string} Users email
   */
    getUserEmail: async function (accessToken) {
        const emailsResponse = await fetch("https://api.github.com/user/emails", {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                Accept: "application/vnd.github+json",
                "X-GitHub-Api-Version": "2022-11-28",
            },
        });

        if (!emailsResponse.ok) {
            throw new Error("Failed to fetch user emails from GitHub");
        }

        const userEmails = await emailsResponse.json();
        const primaryEmailObject = userEmails.find(
            (em) => em.verified === true && em.primary === true
        );

        if (!primaryEmailObject) {
            throw new Error("No verified primary email found on GitHub");
        }

        return primaryEmailObject.email;
    },

    /**
   * Login Oauth user.
   * @param   {string} rawState       State in raw form
   * @param   {string} encryptedState State encrypted with jwt_secret
   * @param   {string} code           Code from Oatuh provider
   * @returns {string} token          A JWT to access API
   */
    oAuthLogin: async function (rawState, encryptedState, code, codeVerifier) {
        const decryptedState = await jwtService.verifyToken(encryptedState);

        if (decryptedState !== rawState) {
            throw new Error("Failed to authenticate state");
        }

        const accessToken = await this.getAccessToken(code, codeVerifier);

        const userEmail = await this.getUserEmail(accessToken);
        const user = await this.findOrCreateOauthUser(userEmail);
        const token = await jwtService.createToken({
            userId: user.id,
            userRole: user.role,
        });

        return token;
    },

    /**
   * Will find a user in our database by email, or create one.
   * Username: <email>
   * password: null
   * email: <email>
   * oauth: true
   * @param   {string} email
   * @returns {object} A user object
   */
    findOrCreateOauthUser: async function (email) {
        let user;

        const result = await userModel.getUserByEmail(email);

        user = result[0];

        if (!user) {
            const created = await userModel.createUser({
                username: email,
                email: email,
                password: "-",
                oauth: true,
                // role: 'user',
            });

            if (created.insertId) {
                const newUser = await userModel.getUserById(created.insertId);

                user = newUser[0];
            } else {
                throw new Error("User did not exist, and could not be created");
            }
        }

        return user;
    },
};

export default oAuthService;
