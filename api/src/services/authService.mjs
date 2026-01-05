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

        const userResult = await userModel.createUser(userData);
        const userId = userResult.insertId;
        const user = await userModel.getUserById(userId);

        return user;
    },

    /**
   * Login user
   * @param   {string} email
   * @param   {string} password
   * @returns {Object} A user object
   */
    loginUser: async function (email, password) {
        const userResult = await userModel.getUserByEmail(email);

        if (!userResult[0]) {
            throw new Error("Invalid username or password. Try again.");
        }
        const user = userResult[0];

        if (user.oauth) {
            throw new Error("User is registred via OAuth and does not have. apassword");
        }
        const match = await bcrypt.compare(password, user.password);

        console.log("HERE")
        console.log(match);

        if (!match) {
            throw new Error("Invalid username or password. Try again.");
        }
        const token = await jwtService.createToken({ userId: user.id, userRole: user.role });

        return token;
    },
};

export default auth;
