import { validationResult, body, param } from "express-validator";

/**
 * Middleware for validation.
 * Create rule sets with body, bodychecks the req, stores errors.
 * Then validationResult, run by checkValidationResult gets and presents them.
 */

/**
 * Creates validation result.
 *
 * @param {object} req - Request object
 * @param {object} res - Response object
 * @param {function} next - Next middleware function
 * @returns {object|function} response | newxt()
 */
export const checkValidationResult = (req, res, next) => {
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

/**
 * Rulesets for validation
 */

// General rules
export const idParam =
    param("id")
        .isInt({ min: 1 })
        .withMessage("ID must be a positive integer");

export const idBody =
    body("id")
        .isInt({ min: 1 })
        .withMessage("ID must be a positive integer");

export const emailBody =
    body("email")
        .notEmpty()
        .withMessage("Email is required.")
        .isEmail()
        .withMessage("Must be a valid email format.");

// Route specific rules
export const userRules = [
    emailBody,

    body("password")
        .notEmpty()
        .withMessage("Password is required.")
        .isLength({ min: 3 })
        .withMessage("Password must be at least 3 characters."),

    body("username").optional(), // NULL enabled
];

// AUTH
export const oAuthLoginRules = [
    body("encryptedState")
        .notEmpty()
        .withMessage("Encrypted state is required.")
        .isJWT(),

    body("code")
        .notEmpty()
        .isAlphanumeric()
        .withMessage("Code is required."),
];

export const getStateRules = [
    body("client_id")
        .notEmpty()
        .isAlphanumeric()
        .withMessage("State is required"),
];

// TRIP
export const createTrip = [
    body("userId")
        .isInt({ min: 1 })
        .withMessage("User ID must be a positive integer"),

    body("bikeId")
        .isInt({ min: 1 })
        .withMessage("User ID must be a positive integer"),
];

//PAYMENT
export const createIntent = [
    body("amount")
        .notEmpty()
        .isNumeric()
        .withMessage("Failed to read ammount"),
    idBody
];

export const paymentSuccess = [
    // body("intentId").notEmpty().isNumeric().withMessage("Missibng intent ID"),
    // body("status").notEmpty().isString().withMessage("Missing status")
];

// Om filen blir tung av rulesets kan vi splitta i
// filer och exportera härifrån för att behålla dot-notation syntax
