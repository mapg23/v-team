import "dotenv/config";
import jwt from "jsonwebtoken";

const jwtSecret = process.env.JWT_SECRET;

/**
 * Check validity of token
 * TBD authorization or x-access-token
 *
 */
export default function validateToken(req, res, next) {
    let token = req.headers["authorization"];

    if (!token) {
        return res.status(401).json({
            errors: {
                status: 401,
                source: req.path,
                title: "No token",
                message: "No token provided in request headers",
            },
        });
    }

    if (token.startsWith("Bearer ")) {
        token = token.replace("Bearer ", "");
    }

    const decoded = jwt.verify(token, jwtSecret, function (err, decoded) {
        if (err) {
            return res.status(401).json({
                error: {
                    status: 401,
                    source: req.path,
                    title: "Failed authentication",
                    message: err.message,
                },
            });
        }

        req.userId = decoded.sub.userId;
        req.userRole = decoded.sub.userRole;

        return next();
    });
}

/**
 * Middleware to restrict access based on the users role.
 * Use it like: restrictTo(['admin']) or restrictTo(['admin, user']),
 * and omit if public route
 *
 * @param {string} allowedRoles - An array of roles that are permitted access.
 */
export function restrictTo(allowedRoles) {
    return (req, res, next) => {
        const userRole = req.userRole;

        if (!userRole || !allowedRoles.includes(userRole)) {
            return res.status(403).json({
                errors: {
                    status: 403,
                    source: req.path,
                    title: "Forbidden",
                    message: "You do not have permission to access this route.",
                },
            });
        }

        next();
    };
}
