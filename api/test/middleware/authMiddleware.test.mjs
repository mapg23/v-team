// import validateToken from "../../src/middleware/authMiddleware.mjs";
import authMiddleware from "../../src/middleware/authMiddleware.mjs";
import jwt from "jsonwebtoken";
import { restrictTo } from "../../src/middleware/authMiddleware.mjs";


describe("authMiddleware", () => {
    test("Returns 401 when Bearer token is missing", () => {
        const req = { headers: { authorization: "" } };
        const res = {
            status: jest.fn(() => res),
            json: jest.fn()
        };
        const next = jest.fn();

        authMiddleware(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalled();
        expect(next).not.toHaveBeenCalled();
    });

    test("fail: returns 401 when Bearer token is malformed", () => {
        const req = { headers: { authorization: "Bearer 123" } };
        const res = {
            status: jest.fn(() => res),
            json: jest.fn()
        };
        const next = jest.fn();

        authMiddleware(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalled();
        expect(res.json).toHaveBeenCalledWith({
            error: {
                status: 401,
                title: "Failed authentication",
                message: "jwt malformed",
            }
        });
        expect(next).not.toHaveBeenCalled();
    });

    test("success: calls next and sets req.user", () => {
        const payload = {
            sub: {
                userId: 2,
                userRole: "user"
            }
        };
        const token = jwt.sign(payload, process.env.JWT_SECRET);

        const req = { headers: { authorization: `Bearer ${token}` }};
        const res = {
            status: jest.fn(() => res),
            json: jest.fn()
        };
        const next = jest.fn();

        authMiddleware(req, res, next);

        expect(next).toHaveBeenCalled();
        expect(req.user).toEqual({
            id: 2,
            role: "user"
        });
        expect(res.status).not.toHaveBeenCalled();
        expect(res.json).not.toHaveBeenCalled();
    });

    test("fails: payload is malformed (misspelled ´userRole´)", () => {
        const payload = {
            sub: {
                userId: 2,
                cruserRole: "user"
            }
        };
        const token = jwt.sign(payload, process.env.JWT_SECRET);

        const req = {
            headers: { authorization: `Bearer ${token}` }
        };
        const res = {
            status: jest.fn(() => res),
            json: jest.fn()
        };
        const next = jest.fn();

        authMiddleware(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({
            error: {
                status: 401,
                title: "Invalid token payload",
                message: "Token payload is malformed"
            }
        });
        expect(next).not.toHaveBeenCalled();
    });
});

describe("restrictTo", () => {
    test("works thanks to env = test", () => {
        const req = {};
        const res = {
            status: jest.fn(() => res),
            json: jest.fn()
        };
        const next = jest.fn();

        // create the middleware with admin rights
        const restrictMiddleware = restrictTo(["admin"]);

        restrictMiddleware(req, res, next);

        // expect(res.status).toHaveBeenCalledWith(401);
        // expect(res.json).toHaveBeenCalled();
        expect(next).toHaveBeenCalled();
        expect(req.user).toEqual({
            id: 1,
            role: "admin"
        });
        expect(res.status).not.toHaveBeenCalled();
        expect(res.json).not.toHaveBeenCalled();
    });

    test("fails thanks to env = NOT_TEST", () => {
        process.env.NODE_ENV = "NOT_TEST";
        const req = { headers: { authorization: "" } };
        const res = {
            status: jest.fn(() => res),
            json: jest.fn()
        };
        const next = jest.fn();

        // create the middleware with admin rights
        const restrictMiddleware = restrictTo(["admin"]);

        restrictMiddleware(req, res, next);

        // expect(res.status).toHaveBeenCalledWith(401);
        // expect(res.json).toHaveBeenCalled();
        expect(next).not.toHaveBeenCalled();
        expect(req.user).toEqual(undefined);
        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalled();
    });

    test("normal success with set req.user", () => {
        process.env.NODE_ENV = "NOT_TEST";
        const req = { user: { id: 13, role: "user" }};
        const res = {
            status: jest.fn(() => res),
            json: jest.fn()
        };
        const next = jest.fn();

        // create the middleware with admin rights
        const restrictMiddleware = restrictTo(["user"]);

        restrictMiddleware(req, res, next);

        expect(next).toHaveBeenCalled();
        expect(req.user).toEqual({
            id: 13,
            role: "user"
        });
        expect(res.status).not.toHaveBeenCalled();
        expect(res.json).not.toHaveBeenCalled();
        process.env.NODE_ENV = "test";
    });

    test("fails: wrong userRole", () => {
        process.env.NODE_ENV = "NOT_TEST";
        const req = { user: { id: 13, role: "user" }};
        const res = {
            status: jest.fn(() => res),
            json: jest.fn()
        };
        const next = jest.fn();

        // create the middleware with admin rights
        const restrictMiddleware = restrictTo(["admin"]);

        restrictMiddleware(req, res, next);

        expect(next).not.toHaveBeenCalled();
        expect(req.user).toEqual({
            id: 13,
            role: "user"
        });
        expect(res.status).toHaveBeenCalledWith(403);
        console.log(req.path);
        expect(res.json).toHaveBeenCalledWith({
            errors: {
                status: 403,
                source: req.path,
                message: "You do not have permission to access this route.",
            }
        });
        process.env.NODE_ENV = "test";
    });
});
