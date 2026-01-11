import jwtService from "./jwtService.mjs";
import createUsers from "../models/users.mjs";
import walletService from "./walletService.mjs";

export const userModel = createUsers();

const oAuthService = {
    /**
   * Takes a unique code and a code verifier, used to get an access token from Github.
   * The access token gives us right to see the data (defined in our scope on the
   * initial request from frontend).
   * @param   {string} code         Code from Oatuh provider
   * @param   {string} verifier     The PKCE code verifyer for the code challenge
   * @returns {string} accessToken  Access token from Oatuh provider
   */
    getAccessToken: async function (
        code,
        verifier,
        clientId,
        githubCallbackUrl,
        gitHubSecret
    ) {
        const res = await fetch("https://github.com/login/oauth/access_token", {
            method: "POST",
            headers: { Accept: "application/json" },
            body: new URLSearchParams({
                client_id: clientId,
                client_secret: gitHubSecret,
                redirect_uri: githubCallbackUrl,
                code: code,
                code_verifier: verifier,
            }),
        });

        const result = await res.json();

        console.log(result);

        if (result.error) {
            const err = new Error(`Failed getting Github token: ${result.error}`);

            err.status = 401;
            err.details = result.error;
            throw err;
        };

        const accessToken = result.access_token;

        return accessToken;
    },

    /**
   * Uses access token to fetch users emails from github.
   * @param   {string} access_token token provided by GitHub
   * @returns {string} Users email
   */
    getUserEmail: async function (accessToken) {
        console.log("Getting user emails\n\n\n\n");
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

        console.log(userEmails);
        const primaryEmailObject = userEmails.find(
            (em) => em.verified === true && em.primary === true
        );

        if (!primaryEmailObject) {
            throw new Error("No verified primary email found on GitHub");
        }
        console.log(primaryEmailObject);

        return primaryEmailObject.email;
    },

    /**
   * Login Oauth user.
   * @param   {string} rawState       State in raw form
   * @param   {string} encryptedState State encrypted with jwt_secret
   * @param   {string} code           Code from Oatuh provider
   * @returns {string} token          A JWT to access API
   */
    oAuthLogin: async function (encryptedState, code) {
        const state = await jwtService.verifyToken(encryptedState);

        let githubCallbackUrl = process.env.VITE_GITHUB_CALLBACK_USER;
        let gitHubSecret = process.env.GITHUB_CLIENT_SECRET_USER;

        if (state.clientId === process.env.VITE_GITHUB_CLIENT_ID_ADMIN) {
            githubCallbackUrl = process.env.VITE_GITHUB_CALLBACK_ADMIN;
            gitHubSecret = process.env.GITHUB_CLIENT_SECRET_ADMIN;
        }

        const accessToken = await this.getAccessToken(
            code,
            state.verifier,
            state.clientId,
            githubCallbackUrl,
            gitHubSecret,
        );

        const userEmail = await this.getUserEmail(accessToken);
        const user = await this.findOrCreateOauthUser(userEmail);
        const token = await jwtService.createToken({
            userId: user.id,
            userRole: user.role,
        });

        return {token, userId: user.id};
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
                password: null,
                oauth: true,
            });

            if (created.insertId) {
                await walletService.createWalletForUser(created.insertId);
                const userRes = await userModel.getUserById(created.insertId);

                user = userRes[0];
            } else {
                throw new Error("User did not exist, and could not be created");
            }
        }

        return user;
    },
};

export default oAuthService;
