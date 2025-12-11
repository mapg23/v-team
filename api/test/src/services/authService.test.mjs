import authService from "../../../src/services/authService.mjs";

import bcrypt from "bcrypt";
// import userModel from "../../../src/models/users.mjs";
import jwtService from "../../../src/services/jwtService.mjs";
process.env.NODE_ENV = "test";

jest.mock("bcrypt", () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

jest.mock("../../../src/services/jwtService.mjs", () => ({
  createToken: jest.fn(),
}));

// Mock instance in authService. Returns mock functions.
jest.mock("../../../src/models/users.mjs", () => {
  return jest.fn(() => ({
    getUserByEmail: jest.fn(),
    createUser: jest.fn(),
  }));
});
// Import it here to run it:
import { userModel } from "../../../src/services/authService.mjs";

describe("authService", () => {
  // beforeEach(() => {
  //   userModel = createUsers.mock.results[0].value;
  // });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("registerUser, fail: same email error", async () => {
    userModel.getUserByEmail.mockResolvedValue({
      id: 1,
      email: "test@test.test",
      password: "passw0rd",
    });

    await expect(
      authService.registerUser("test@test.test", "passw0rd")
    ).rejects.toThrow("Email already registred");
  });

  test("registerUser, success", async () => {
    userModel.getUserByEmail.mockResolvedValue(null);

    bcrypt.hash.mockResolvedValue("hashed password");

    userModel.createUser.mockResolvedValue({
      id: 2,
      email: "test2@test.test",
      password: "hashed password",
      username: "username",
    });

    const user = await authService.registerUser(
      "test2@test.test",
      "passw0rd",
      "username"
    );

    await expect(bcrypt.hash).toHaveBeenCalledWith("passw0rd", 10);

    await expect(userModel.createUser).toHaveBeenCalledWith({
      email: "test2@test.test",
      password: "hashed password",
      username: "username",
    });

    await expect(user).toEqual({
      id: 2,
      email: "test2@test.test",
      password: "hashed password",
      username: "username",
    });
  });

  test("loginUser, fail: not registred", async () => {
    userModel.getUserByEmail.mockResolvedValue(null);
    await expect(
      authService.loginUser("test@test.test", "passw0rd")
    ).rejects.toThrow("Invalid username or password. Try again");
  });

  test("loginUser, fail: wrong password", async () => {
    userModel.getUserByEmail.mockResolvedValue({
      id: 1,
      email: "test@test.test",
      password: "passwordHash",
    });
    bcrypt.compare.mockResolvedValue(false);

    await expect(
      authService.loginUser("test@test.test", "wrongHash")
    ).rejects.toThrow("Invalid username or password. Try again");
  });

  test("loginUser, success", async () => {
    jwtService.createToken.mockResolvedValue("Token");
    userModel.getUserByEmail.mockResolvedValue({
      id: 1,
      email: "test@test.test",
      password: "passwordHash",
    });
    bcrypt.compare.mockResolvedValue(true);

    const token = await authService.loginUser("test@test.test", "passwordHash");

    await expect(token).toBe.String;
  });
});
