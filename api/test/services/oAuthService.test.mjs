import oauthService from "../../src/services/oAuthService.mjs";
import jwtService from "../../src/services/jwtService.mjs";
// import userModel from "../../src/models/users.mjs";
process.env.NODE_ENV = "test";

jest.mock("../../src/services/jwtService.mjs", () => ({
    verifyToken: jest.fn(),
    createToken: jest.fn(),
}));

// Mock instance in authService. Returns mock functions.
jest.mock("../../src/models/users.mjs", () => {
    return jest.fn(() => ({
        getUserByEmail: jest.fn(),
        createUser: jest.fn(),
        getUserById: jest.fn(),
    }));
});
// Import it here to run it:
import { userModel } from "../../src/services/oAuthService.mjs";

describe("oAuthService", () => {
    afterEach(() => {
    // to prevent spyOn
        jest.restoreAllMocks();
        // normal reset
        jest.clearAllMocks();
    });
    test("getAccessToken, fail: bad code provided", async () => {
        global.fetch = jest.fn(() =>
            Promise.resolve({
                json: () => Promise.resolve({ error: "Invalid code" }),
                ok: true,
                status: 200,
            })
        );

        await expect(oauthService.getAccessToken("bad code")).rejects.toThrow(
            `Failed getting Github token: Invalid code`
        );
    });
    test("getAccessToken, success", async () => {
        global.fetch = jest.fn(() =>
            Promise.resolve({
                json: () => Promise.resolve({ access_token: "test token" }),
                ok: true,
                status: 200,
            })
        );
        const accessToken = await oauthService.getAccessToken("test code");

        await expect(fetch).toHaveBeenCalledWith(
            "https://github.com/login/oauth/access_token",
            expect.any(Object)
        );

        await expect(accessToken).toBe("test token");
    });

    test("getUserEmails, fail: response not OK", async () => {
        global.fetch = jest.fn(() =>
            Promise.resolve({
                json: () =>
                    Promise.resolve([
                        { email: "test@test.test", verified: true, primary: true },
                    ]),
                ok: false,
                status: 200,
            })
        );

        await expect(oauthService.getUserEmail("access_token")).rejects.toThrow(
            "Failed to fetch user emails from GitHub"
        );
    });

    test("getUserEmails, fail: No verified primary email", async () => {
        global.fetch = jest.fn(() =>
            Promise.resolve({
                json: () =>
                    Promise.resolve([
                        { email: "test@test.test", verified: true, primary: false },
                    ]),
                ok: true,
                status: 200,
            })
        );

        await expect(oauthService.getUserEmail("access_token")).rejects.toThrow(
            "No verified primary email found on GitHub"
        );
    });

    test("getUserEmails, success", async () => {
        global.fetch = jest.fn(() =>
            Promise.resolve({
                json: () =>
                    Promise.resolve([
                        { email: "test@test.test", verified: true, primary: true },
                    ]),
                ok: true,
                status: 200,
            })
        );

        const userEmail = await oauthService.getUserEmail("access_token");

        expect(userEmail).toBe("test@test.test");
    });
    test("oAuthLogin, fail: bad state provided", async () => {
        jwtService.verifyToken.mockResolvedValue("bad value");

        await expect(
            oauthService.oAuthLogin("real value", "encrypted value", "code")
        ).rejects.toThrow("Failed to authenticate state");
    });

    test("oAuthLogin, success", async () => {
        jwtService.verifyToken.mockResolvedValue("real value");
        jest.spyOn(oauthService, "getAccessToken").mockResolvedValue("test token");
        jest.spyOn(oauthService, "getUserEmail").mockResolvedValue("test email");
        jest
            .spyOn(oauthService, "findOrCreateOauthUser")
            .mockResolvedValue("test user");
        jwtService.createToken.mockResolvedValue("test token");

        const token = await oauthService.oAuthLogin(
            "real value",
            "encrypted value",
            "code"
        );

        await expect(token).toBe("test token");
    });

    test("findOrCreateOauthUser, fail: could not create user", async () => {
        userModel.getUserByEmail.mockResolvedValue([]);
        userModel.createUser.mockResolvedValue({ noInsertId: 0 });
        userModel.getUserById.mockResolvedValue([
            { id: 1, email: "test@test.test" },
        ]);

        await expect(
            oauthService.findOrCreateOauthUser("test@test.test")
        ).rejects.toThrow("User did not exist, and could not be created");
    });

    test("findOrCreateOauthUser, new user success", async () => {
        userModel.getUserByEmail.mockResolvedValue([]);
        userModel.createUser.mockResolvedValue({ insertId: 2 });
        userModel.getUserById.mockResolvedValue([
            { id: 1, email: "test@test.test" },
        ]);

        const user = await oauthService.findOrCreateOauthUser("test@test.test");

        await expect(user).toStrictEqual({ id: 1, email: "test@test.test" });
    });

    test("findOrCreateOauthUser, success", async () => {
        userModel.getUserByEmail.mockResolvedValue([
            { id: 1, email: "test@test.test" },
        ]);

        const user = await oauthService.findOrCreateOauthUser("test@test.test");

        await expect(user).toStrictEqual({ id: 1, email: "test@test.test" });
    });
});
