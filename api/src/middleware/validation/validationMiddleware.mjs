import { validationResult, body } from "express-validator";

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
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

/**
 * Rulesets for validation
 */
export const userRules = [
  body("email")
    .notEmpty()
    .withMessage("Email is required.")
    .isEmail()
    .withMessage("Must be a valid email format."),

  body("password")
    .notEmpty()
    .withMessage("Password is required.")
    .isLength({ min: 3 })
    .withMessage("Password must be at least 3 characters."),

  body("username").optional(), // NULL enabled
];

export const oAuthLoginRules = [
  body("rawState").notEmpty().withMessage("Raw State is required."),

  body("encryptedState")
    .notEmpty()
    .withMessage("Encrypted state is required.")
    .isJWT(),

  body("code").notEmpty().withMessage("Code is required."),
];

export const getStateRules = [
  body("state").notEmpty().withMessage("State is required"),
];

// Om filen blir tung av rulesets kan vi splitta i
// filer och exportera härifrån för att behålla dot-notation syntax
