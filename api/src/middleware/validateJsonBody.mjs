/**
 * Middleware to validate that the request body exists and is not empty.
 /**
 * Middleware to validate that the request body exists and is not empty.
 * Sends a 400 response if the body is missing or empty.
 *
 * @param {object} req - Request object
 * @param {object} res - Response object
 * @param {function} next - Next middleware function
 */
export default function validateJsonBody(req, res, next) {
    // Kontrollerar att request body finns och inte är tom
    if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).json({ error: "Request body is missing or empty" });
    }
    next();
}
