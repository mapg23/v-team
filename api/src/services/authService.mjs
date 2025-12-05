import "dotenv/config";
import bcrypt from "bcrypt";
import jwtService from "../services/jwtService.mjs";
import createUsers from "../models/users.mjs";

// Export for testing
export const userModel = createUsers();

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
    // let user;

    if (userExists) {
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

    const user = await userModel.createUser(userData);

    return user;
  },

  /**
   * Login user
   * @param   {string} email
   * @param   {string} password
   * @returns {Object} A user object
   */
  loginUser: async function (email, password) {
    const user = await userModel.getUserByEmail(email);

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
};

export default auth;
