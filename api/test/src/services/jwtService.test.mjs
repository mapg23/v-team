// import jwtService from "../../../src/services/jwtService.mjs";
import jwt from "jsonwebtoken";

describe("jwtService, functional tests", () => {
  test("created token can be validated", async () => {
    process.env.JWT_SECRET = "testsecret123";
    const { default: jwtService } = await import(
      "../../../src/services/jwtService.mjs"
    );
    const token = await jwtService.createToken("test@test.test");
    const verify = await jwtService.verifyToken(token);

    expect(typeof token).toBe("string");
    expect(verify).toBe("test@test.test");
  });
  test("expired token throws error", async () => {
    process.env.JWT_SECRET = "testsecret123";
    const { default: jwtService } = await import(
      "../../../src/services/jwtService.mjs"
    );
    const token2 = await jwtService.createToken("test@test.test", -1);

    await expect(jwtService.verifyToken(token2)).rejects.toThrow(
      "Invalid token."
    );
  });
});
