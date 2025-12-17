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
    body("password")
        .notEmpty()
        .withMessage("Password is required.")
        .isLength({ min: 3 })
        .withMessage("Password must be at least 3 characters."),

    body("username").optional(), // NULL enabled
    body("username").optional(), // NULL enabled
];

export const oAuthLoginRules = [
    body("rawState").notEmpty().withMessage("Raw State is required."),
    body("rawState").notEmpty().withMessage("Raw State is required."),

    body("encryptedState")
        .notEmpty()
        .withMessage("Encrypted state is required.")
        .isJWT(),
    body("encryptedState")
        .notEmpty()
        .withMessage("Encrypted state is required.")
        .isJWT(),

    body("code").notEmpty().withMessage("Code is required."),
    body("code").notEmpty().withMessage("Code is required."),

    body("code_verifier")
        .notEmpty()
        .withMessage("Code is required.")
        .isAlphanumeric()
        .withMessage("Code verifier has to be alphanumeric."),
    body("code_verifier")
        .notEmpty()
        .withMessage("Code is required.")
        .isAlphanumeric()
        .withMessage("Code verifier has to be alphanumeric."),
];

export const getStateRules = [
    body("state").notEmpty().withMessage("State is required"),
    body("state").notEmpty().withMessage("State is required"),
];

export const createTrip = [
    body("userId")
        .isInt({ min: 1 })
        .withMessage("User ID must be a positive integer"),

    body("bikeId")
        .isInt({ min: 1 })
        .withMessage("User ID must be a positive integer"),
];
// Om filen blir tung av rulesets kan vi splitta i
// filer och exportera härifrån för att behålla dot-notation syntax
