import "dotenv/config";
import bcrypt from "bcrypt";
// Skapa AUTH SERVICE, ring därifrån
import jwtService from "../services/jwtService.mjs";
// import userModel from "../models/userModel.mjs";

/**
 * Module for authentication operations.
 */
const auth = {
  /**
   * Register user; insert new user data if email not taken.
   * @param {string} email
   * @param {string} password
   * @param {string} username
   * @returns {Array} Result of db query
   */
  registerUser: async function (email, password, username = null) {
    const userExists = await userModel.getUserByEmail(email);

    if (userExists.length > 0) {
      const error = new Error("Email already registred");
      error.status = 409;
      throw error;
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const userData = {
      username: username,
      password: passwordHash,
      email: email,
    };

    // const result = await userModel.createUser(userData);

    return result;
  },

  /**
   * Login user
   * @param   {string} email
   * @param   {string} password
   * @returns {Object} A user object
   */
  loginUser: async function (email, password) {
    const result = await userModel.getUserByEmail(email);
    const user = result[0];

    if (!user) {
      const err = new Error("Invalid username or password. Try again.");
      err.status = 400;
      throw err;
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      throw new Error("Invalid username or password. Try again.");
    }
    const token = await jwtService.createToken(user.id);

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
    console.log("Find or create: ", email);
    const data = { id: 1, email: email };
    return data;
    const result = await userModel.getUserByEmail(email);
    const user = result[0];

    if (!user) {
      // Move to userModel createOauthUser needed?
      const created = userModel.createUser({
        username: email,
        email: email,
        password: null,
        oauth: true,
      });
      if (created.insertId) {
        user = await userModel.getUserById(created.insertId);
      }
    }

    return user;
  },
};

export default auth;
