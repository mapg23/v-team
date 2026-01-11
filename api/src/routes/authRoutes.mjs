import express from "express";
import authService from "../services/authService.mjs";
import oAuthService from "../services/oAuthService.mjs";
import jwtService from "../services/jwtService.mjs";
import createPKCE from "../services/cryptoService.mjs";
import * as validation from "../middleware/validation/validationMiddleware.mjs";
import { restrictTo } from "../middleware/authMiddleware.mjs";

const router = express.Router();

/**
 * Register a user
 */
router.post(
    `/register`,
    validation.userRules,
    validation.checkValidationResult,
    async (req, res) => {
        const { email, password, username } = req.body;

        try {
            const user = await authService.registerUser(email, password, username);

            return res.json(user);
        } catch (err) {
            return res.status(400).json(err.message);
        }
    }
);

/**
 * Normal login flow. Returns a JWT if credentials match.
 */
router.post(
    `/login`,
    validation.userRules,
    validation.checkValidationResult,
    async (req, res) => {
        try {
            const { email, password, username } = req.body;
            const token = await authService.loginUser(email, password, username);

            return res.json({ jwt: token });
        } catch (err) {
            return res.status(401).json(err.message);
        }
    }
);

/**
 * Oauth login
 * Will login or register a new oauth-user.
 */
router.post(
    `/oauth/login`,
    // validation.oAuthLoginRules,
    // validation.checkValidationResult,
    async (req, res) => {
        try {
            const { encryptedState, code } = req.body;
            const data = await oAuthService.oAuthLogin(
                encryptedState,
                code,
            );

            return res.json({
                jwt: data.token,
                userId: data.id
            });
        } catch (err) {
            return res.status(401).json(err);
        }
    }
);

/**
 * Oauth login - for multiple frontends
 * Will login or register a new oauth-user.
 */
router.post(
    `/oauth/login/:frontEndId`,
    // validation.oAuthLoginRules,
    // validation.checkValidationResult,
    async (req, res) => {
        try {
            const frontEndId = req.params;
            const data = await oAuthService.oAuthLogin(frontEndId);

            return res.json({
                jwt: data.token,
                userId: data.id
            });
        } catch (err) {
            return res.status(401).json(err);
        }
    }
);

/**
 * Allows frontend to get an encrypted "state", a value
 * passed to OAuth provider. Can later be checked here
 * to increase security.
 */
router.post(
    `/oauth/get_state`,
    // validation.getStateRules,
    // validation.checkValidationResult,
    async (req, res) => {
        const clientId = req.body.client_id;

        console.log("STATE:(app id) ", clientId);
        const {challenge, verifier} = await createPKCE();

        console.log("2. CHALLANGE/VERIFIER: ", challenge, verifier);
        const encryptedState = await jwtService.createToken({ clientId, verifier }, 10);

        return res.json({ encryptedState: encryptedState, challenge });
    }
);

router.post('/test/open',
    async (req, res) => {
        return res.json({access: "open route"});
    }
);

router.post('/test/user',
    restrictTo(['user']),
    async (req, res) => {
        return res.json({access: "users allowed"});
    }
);


export default router;
