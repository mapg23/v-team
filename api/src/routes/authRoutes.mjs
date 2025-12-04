import express from "express";
import authService from "../services/authService.mjs";
import oAuthService from "../services/oAuthService.mjs";
import jwtService from "../services/jwtService.mjs";

const router = express.Router();

/**
 * Register a user
 */
router.post(`/register`, async (req, res) => {
  const { email, password, username } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: "Missing email or password",
    });
  }

  try {
    const user = await authService.registerUser(email, password, username);
    return res.json(user);
  } catch (err) {
    return res.status(400).json(err);
  }
});

/**
 * Normal login flow. Returns a JWT if credentials match.
 */
router.post(`/login`, async (req, res) => {
  try {
    const { email, password, username } = req.body;

    const token = await authService.loginUser(email, password, username);

    return res.json({ jwt: token });
  } catch (err) {
    return res.status(401).json(err);
  }
});

/**
 * Oauth login
 * Will login or register a new oauth-user.
 */
router.post(`/oauth/login`, async (req, res) => {
  try {
    const { rawState, encryptedState, code } = req.body;

    const token = await oAuthService.oauthLogin(rawState, encryptedState, code);

    return res.json({ jwt: token });
  } catch (err) {
    return res.status(401).json(err);
  }
});

/**
 * Allows frontend to get an encrypted "state", a value
 * passed to OAuth provider. Can later be checked here
 * to increase security.
 */
router.post(`/oauth/get_state`, async (req, res) => {
  const state = req.body.state;

  const encryptedState = await jwtService.createToken(state, 60);

  return res.json({ encryptedState: encryptedState });
});

export default router;
