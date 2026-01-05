import "dotenv/config";
import jwt from "jsonwebtoken";

const jwtSecret = process.env.JWT_SECRET;

/**
 * Check validity of token
 * TBD authorization or x-access-token
 *
 */
export default function validateToken(req, res, next) {
    let token = req?.headers?.authorization;

    if (!token) {
        return res.status(401).json({
            error: {
                status: 401,
                message: "No token provided in request headers",
            },
        });
    }

    if (!token.startsWith("Bearer ")) {
        return res.status(401).json({
            error: {
                status: 401,
                message: "Authorization header must use Bearer token"
            }
        });
    }

    token = token.replace("Bearer ", "");

    jwt.verify(token, jwtSecret, function (err, decoded) {
        if (err) {
            return res.status(401).json({
                error: {
                    status: 401,
                    title: "Failed authentication",
                    message: err.message,
                },
            });
        }
        if (!decoded?.sub?.userId || !decoded?.sub?.userRole) {
            return res.status(401).json({
                error: {
                    status: 401,
                    title: "Invalid token payload",
                    message: "Token payload is malformed"
                }
            });
        }
        req.user = {
            id: decoded.sub.userId,
            role: decoded.sub.userRole,
        };

        return next();
    });
}

/**
 * Middleware creator to restrict access based on the users role.
 * Use it like: restrictTo(['admin']) or restrictTo(['admin, user']),
 *
 * @param {string} allowedRoles - An array of roles that are permitted access.
 */
export function restrictTo(allowedRoles) {
    return (req, res, next) => {
        // Sets all users to admin for tests
        if (process.env.NODE_ENV === "test") {
            req.user = { id: 1, role: "admin" };
        }

        const userRole = req?.user?.role;

        if (!userRole || !allowedRoles.includes(userRole)) {
            return res.status(403).json({
                errors: {
                    status: 403,
                    source: req.path,
                    message: "You do not have permission to access this route.",
                },
            });
        }

        next();
    };
}
