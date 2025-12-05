import validateJsonBody from "../../src/middleware/validateJsonBody";

describe("validateJsonBody", () => {
    test("returns 400 when body is missing", () => {
        const req = { body: undefined };
        const res = {
            status: jest.fn(() => res),
            json: jest.fn()
        };
        const next = jest.fn();

        validateJsonBody(req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalled();
        expect(res.json).toHaveBeenCalledWith({ error: "Request body is missing or empty" });
        expect(next).not.toHaveBeenCalled();
    });

    test("returns 400 when body is empty", () => {
        const req = { body: {} };
        const res = {
            status: jest.fn(() => res),
            json: jest.fn()
        };
        const next = jest.fn();

        validateJsonBody(req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalled();
        expect(res.json).toHaveBeenCalledWith({ error: "Request body is missing or empty" });
        expect(next).not.toHaveBeenCalled();
    });

    test("calls next when body exists", () => {
        const req = { body: { name: "test" } };
        const res = {};
        const next = jest.fn();

        validateJsonBody(req, res, next);

        expect(next).toHaveBeenCalled();
    });
});
