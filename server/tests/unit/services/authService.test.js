const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userRepo = require("@src/repositories/userRepository");
const refreshTokenRepo = require("@src/repositories/refreshTokenRepository");
const AuthService = require("@src/services/authService");
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
jest.mock("bcrypt");
jest.mock("jsonwebtoken");
jest.mock("@src/repositories/userRepository");
jest.mock("@src/repositories/refreshTokenRepository");

describe("AuthService", () => {
  let authService;
  beforeEach(() => {
    authService = AuthService;
    jest.clearAllMocks();
  });
  describe("register", () => {
    test("it should throw error if username,email or password is missing", async () => {
      await expect(
        authService.register("", "pass", "g@gmail.com")
      ).rejects.toThrow("Username, password, and email are required");
    });
    test("should throw if email already exists", async () => {
      userRepo.findByEmail.mockResolvedValue({ _id: "1" });
      await expect(
        authService.register("user", "pass", "g@gmai.com")
      ).rejects.toThrow("Email already used");
    });
    test("it should hash the password and create the user", async () => {
      userRepo.findByEmail.mockResolvedValue(null);
      bcrypt.hash.mockResolvedValue("hashedPassword");
      userRepo.create.mockResolvedValue({
        _id: "1",
        username: "user",
        email: "g@gmail.com",
        password: "hashedPassword",
      });
      const result = await authService.register("user", "pass", "g@gmail.com");
      expect(bcrypt.hash).toHaveBeenCalledWith("pass", expect.any(Number));
      expect(userRepo.create).toHaveBeenCalledWith(
        "user",
        "g@gmail.com",
        "hashedPassword"
      );
      expect(result).toEqual({
        _id: "1",
        username: "user",
        email: "g@gmail.com",
        password: "hashedPassword",
      });
    });
  });
  describe("login", () => {
    test("it should return not found", async () => {
      userRepo.findByEmail.mockResolvedValue(null);
      await expect(authService.login("g@gmail.com", "pass")).rejects.toThrow(
        "Invalid credentials"
      );
    });
    test("should throw if password doesn't match", async () => {
      const user = { _id: "1", password: "password" };
      userRepo.findByEmail.mockResolvedValue(user);
      bcrypt.compare.mockResolvedValue(false);
      await expect(authService.login("g@gmail.com", "pass")).rejects.toThrow(
        "Invalid credentials"
      );
    });
    test("should return tokens and user if credentials are valid", async () => {
      const user = {
        _id: "1",
        username: "user",
        email: "g@gmail.com",
        password: "hashedPassword",
      };
      userRepo.findByEmail.mockResolvedValue(user);
      bcrypt.compare.mockResolvedValue(true);
      jwt.sign
        .mockReturnValueOnce("accessToken")
        .mockReturnValueOnce("refreshToken");
      refreshTokenRepo.createToken.mockResolvedValue();
      const result = await authService.login("g@gmail.com", "pass");
      expect(jwt.sign).toHaveBeenCalledTimes(2);
      expect(refreshTokenRepo.createToken).toHaveBeenCalledWith(
        user._id,
        "refreshToken",
        expect.any(Date)
      );
      expect(result).toEqual({
        accessToken: "accessToken",
        refreshToken: "refreshToken",
        user,
      });
    });
  });
  describe("refreshToken", () => {
    test("it should throw if token is missing", async () => {
      await expect(authService.refreshToken("")).rejects.toThrow(
        "Refresh token is required"
      );
    });
    test("it should throw if token is invalid", async () => {
      jwt.verify.mockImplementation(() => {
        throw new Error();
      });
      await expect(authService.refreshToken("badToken")).rejects.toThrow(
        "Invalid or expired refresh token"
      );
    });
    test("it should throw if user is not found", async () => {
      jwt.verify.mockReturnValue({ id: "1" });
      userRepo.findById.mockResolvedValue(null);
      await expect(authService.refreshToken("badToken")).rejects.toThrow(
        "Invalid or expired refresh token"
      );
    });
    test("it should throw if token is deleted from database", async () => {
      const user = {
        _id: "1",
        username: "user",
        email: "g@gmail.com",
        password: "hashedPassword",
      };
      jwt.verify.mockReturnValue({ id: "1" });
      userRepo.findById.mockResolvedValue(user);
      refreshTokenRepo.findByToken.mockResolvedValue(null);
      await expect(authService.refreshToken("oldToken")).rejects.toThrow(
        "Invalid or expired refresh token"
      );
    });
    test("it should throw if token is expired", async () => {
      const user = {
        _id: "1",
        username: "user",
        email: "g@gmail.com",
        password: "hashedPassword",
      };
      const storedToken = { _id: "1", expiresAt: new Date(Date.now() - 1000) };
      jwt.verify.mockReturnValue({ id: "1" });
      userRepo.findById.mockResolvedValue(user);
      refreshTokenRepo.findByToken.mockResolvedValue(storedToken);
      refreshTokenRepo.deleteByUser.mockResolvedValue();
      await expect(authService.refreshToken("oldToken")).rejects.toThrow(
        "Invalid or expired refresh token"
      );
      expect(refreshTokenRepo.deleteByUser).toHaveBeenCalledWith("1");
    });
    test("it should return the tokens if refreshToken is valid", async () => {
      const oldToken = "oldToken";
      const payload = { id: "1", username: "user" };
      const user = {
        _id: "1",
        username: "user",
        email: "g@gmail.com",
        password: "hashedPassword",
      };
      const storedToken = { _id: "1", expiresAt: new Date(Date.now() + 1000) };
      jwt.verify.mockReturnValue(payload);
      userRepo.findById.mockResolvedValue(user);
      refreshTokenRepo.findByToken.mockResolvedValue(storedToken);
      refreshTokenRepo.updateToken.mockResolvedValue();
      jwt.sign
        .mockReturnValueOnce("newAccess")
        .mockReturnValueOnce("newRefresh");
      const result = await authService.refreshToken(oldToken);
      expect(result).toEqual({
        accessToken: "newAccess",
        refreshToken: "newRefresh",
      });
      expect(refreshTokenRepo.updateToken).toHaveBeenCalledWith(
        storedToken._id,
        "newRefresh",
        expect.any(Date)
      );
    });
  });
  describe("logout", () => {
    test("it should throw if token is missing", async () => {
      await expect(authService.logout("")).rejects.toThrow("token is required");
    });
    test("should delete token provided", async () => {
      refreshTokenRepo.deleteByToken.mockResolvedValue();
      await authService.logout("token");
      expect(refreshTokenRepo.deleteByToken).toHaveBeenCalledWith("token");
    });
  });
  describe("update Password", () => {
    test("it should update the password", async () => {
      const userId = 1;
      const data = { password: "password", newPassword: "newPassword" };
      userRepo.findById.mockResolvedValue({ password: "password" });
      bcrypt.compare.mockResolvedValue(true);
      bcrypt.hash.mockResolvedValue("hashedPassword");
      await authService.updatePassword(userId, data);

      expect(bcrypt.compare).toHaveBeenCalledWith("password", "password");
      expect(bcrypt.hash).toHaveBeenCalledWith(
        "newPassword",
        expect.any(Number)
      );
      expect(userRepo.update).toHaveBeenCalledWith(userId, {
        password: "hashedPassword",
        passwordChangedAt: expect.any(Date),
      });
      expect(refreshTokenRepo.deleteByUser).toHaveBeenCalledWith(userId);
    });
    test("it should throw if password is different from the one on database", async () => {
      const userId = 1;
      const data = { password: "wrongPassword", newPassword: "newPassword" };
      userRepo.findById.mockResolvedValue({ password: "password" });
      bcrypt.compare.mockResolvedValue(false);
      await expect(authService.updatePassword(userId, data)).rejects.toThrow(
        "Invalid credentials"
      );
      expect(userRepo.update).not.toHaveBeenCalled();
      expect(bcrypt.hash).not.toHaveBeenCalled();
      expect(refreshTokenRepo.deleteByUser).not.toHaveBeenCalled();
    });
  });
});
