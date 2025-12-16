import { promisify } from "util";
import jwt from "jsonwebtoken";
import "dotenv/config";

const jwtSecret = process.env.JWT_SECRET;

// Create async version of jwt.verify:
const verifyAsync = promisify(jwt.verify);

/**
 * Create and verify JW-Tokens
 */
const jwtService = {
    /**
   * Create a JWT, valid for a certain time, defaults to 5 hours.
   * @param   {string} payload  An id, email-address or other string you want to keep in the JWT.
   * @param   {string} expiryTime How long a token is valid.
   * @returns {string} token A JWT token
   */
    createToken: async function (payload, expiryTime = 60 * 60 * 5) {
        const token = jwt.sign({ sub: payload }, jwtSecret, {
            expiresIn: expiryTime,
        });

        return token;
    },

    verifyToken: async function (token) {
        try {
            const decoded = await verifyAsync(token, jwtSecret);
            // console.log("decoded.sub: ", decoded.sub);

            return decoded.sub;
        } catch (err) {
            throw new Error("Invalid token.");
        }
    },
};

export default jwtService;
