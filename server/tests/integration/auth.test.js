const request = require("supertest");
const express = require("express");
const cookieParser = require("cookie-parser");
const authRoutes = require("@src/routes/authRoutes");
const authService = require("@src/services/authService");
jest.mock("@src/config/auth", () => ({
  current: {
    tokens: {
      accessTokenExpiry: "15m",
      refreshTokenExpiry: "7d",
      refreshTokenExpiryDays: 7,
      bcryptRounds: 12,
    },
  },
}));
jest.mock("@src/services/authService");
jest.mock("@src/middleware/verifyJWT", () => {
  return (req, res, next) => {
    req.user = { id: 1 };
    next();
  };
});
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use("/auth", authRoutes);

describe("AuthController integrated Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "warn").mockImplementation(() => {});
  });
  afterEach(() => {
    console.warn.mockRestore();
  });

  describe("POST auth/register", () => {
    test("should register a user successfully", async () => {
      authService.register.mockResolvedValue({ id: "1", username: "user" });
      const res = await request(app)
        .post("/auth/register")
        .send({ username: "user", email: "g@gmail.com", password: "pass" });
      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe("User registered");
      expect(res.body.data).toEqual({ id: "1", username: "user" });
      expect(authService.register).toHaveBeenCalledWith(
        "user",
        "pass",
        "g@gmail.com",
      );
    });
    test("should fail if email already exist", async () => {
      authService.register.mockRejectedValue(new Error("Email already used"));
      const res = await request(app)
        .post("/auth/register")
        .send({ username: "user", email: "g@gmail.com", password: "pass" });
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe("Email already used");
    });
  });
  describe("POST auth/login", () => {
    test("should login successfully and set cookie", async () => {
      authService.login.mockResolvedValue({
        user: { _id: "1", username: "user" },
        accessToken: "accessToken",
        refreshToken: "refreshToken",
      });

      const res = await request(app)
        .post("/auth/login")
        .send({ email: "g@gmail.com", password: "pass" });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe("Login successful");
      expect(res.body.data).toEqual({
        id: "1",
        username: "user",
        accessToken: "accessToken",
      });
      expect(res.headers["set-cookie"][0]).toMatch(/refreshToken/);
      expect(authService.login).toHaveBeenCalledWith("g@gmail.com", "pass");
    });
    test("should fail with invalid credentials", async () => {
      authService.login.mockRejectedValue(new Error("Invalid credentials"));

      const res = await request(app)
        .post("/auth/login")
        .send({ email: "u@g.com", password: "wrong" });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe("Invalid credentials");
    });
  });
  describe("POST auth/refreshToken", () => {
    test("should refresh access token successfully", async () => {
      authService.refreshToken.mockResolvedValue({
        accessToken: "newAccess",
        refreshToken: "newRefresh",
      });
      const res = await request(app)
        .post("/auth/refresh")
        .set("Cookie", ["refreshToken=oldToken"]);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe("Access token refreshed");
      expect(res.body.data).toEqual({ accessToken: "newAccess" });
      const cookies = res.headers["set-cookie"];
      expect(cookies.some((c) => c.includes("refreshToken=newRefresh"))).toBe(
        true,
      );
      expect(authService.refreshToken).toHaveBeenCalledWith("oldToken");
    });
    test("should fail if refresh token is invalid", async () => {
      authService.refreshToken.mockRejectedValue(
        new Error("Invalid or expired refresh token"),
      );

      const res = await request(app)
        .post("/auth/refresh")
        .set("Cookie", ["refreshToken=badToken"]);
      expect(res.status).toBe(500);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe("Invalid or expired refresh token");
    });
  });
  describe("Patch auth/newPassword", () => {
    test("should update the password successfully", async () => {
      authService.updatePassword.mockResolvedValue();
      const res = await request(app)
        .patch("/auth/newPassword")
        .send({ oldPassword: "password", password: "newPassword" });
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe("password updated successfully");
    });
    test("should throw invalid request data", async () => {
      authService.updatePassword.mockResolvedValue();
      const res = await request(app)
        .patch("/auth/newPassword")
        .send({ password: "password" });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe("Invalid Request data");
      expect(console.warn).toHaveBeenCalled();
    });
  });
  describe("POST /auth/logout", () => {
    test("should logout successfully", async () => {
      authService.logout.mockResolvedValue();

      const res = await request(app)
        .post("/auth/logout")
        .set("Cookie", ["refreshToken=oldToken"]);
      expect(res.headers["set-cookie"][0]).toMatch(/refreshToken=/);
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe("Logout successful");
      expect(authService.logout).toHaveBeenCalledWith("oldToken");
    });

    test("should fail if token is missing or logout fails", async () => {
      authService.logout.mockRejectedValue(new Error("token is required"));

      const res = await request(app).post("/auth/logout");

      expect(res.status).toBe(500);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe("token is required");
    });
  });
});
