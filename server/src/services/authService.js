const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userRepo = require("../repositories/userRepository");
const refreshTokenRepo = require("../repositories/refreshTokenRepository");
const authConfig = require("../config/auth").current.tokens;
const {NotFoundError,BadRequestError} = require("../utils/errorHandling");
class AuthService {
  #generateTokenPair(user) {
    const accessToken = jwt.sign(
      { id: user._id, username: user.username, email: user.email , url: user?.profile?.avatar?.url ?? "" },
      process.env.JWT_SECRET,
      { expiresIn: authConfig.accessTokenExpiry }
    );
    const refreshToken = jwt.sign(
      { id: user._id, username: user.username, email: user.email, url: user?.profile?.avatar?.url ?? "" },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: authConfig.refreshTokenExpiry }
    );
    return { accessToken, refreshToken };
  }
  async register(username, password, email) {
    if (!username || !password || !email) {
      throw new Error("Username, password, and email are required");
    }
    const existingEmail = await userRepo.findByEmail(email);
    if (existingEmail) {
      throw new Error("Email already used");
    }
    const hashedPassword = await bcrypt.hash(password, authConfig.bcryptRounds);
    return await userRepo.create(username, email, hashedPassword);
  }

  async login(email, password) {
    const user = await userRepo.findByEmail(email);
    if (!user) throw new Error("Invalid credentials");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error("Invalid credentials");

    const tokens = this.#generateTokenPair(user);
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + authConfig.refreshTokenExpiryDays);
    await refreshTokenRepo.createToken(
      user._id,
      tokens.refreshToken,
      expiresAt
    );
    return { ...tokens, user };
  }

  async refreshToken(oldToken) {
    if (!oldToken) throw new Error("Refresh token is required");
    try {
      const payload = jwt.verify(oldToken, process.env.JWT_REFRESH_SECRET);
      const user = await userRepo.findById(payload.id);
      if (!user) throw new Error("User not found");

      const storedToken = await refreshTokenRepo.findByToken(oldToken);
      if (!storedToken || storedToken.expiresAt < new Date()) {
        await refreshTokenRepo.deleteByUser(payload.id);
        throw new Error("Invalid or expired refresh token");
      }
      const tokens = this.#generateTokenPair(user);
      const expiresAt = new Date();
      expiresAt.setDate(
        expiresAt.getDate() + authConfig.refreshTokenExpiryDays
      );
      await refreshTokenRepo.updateToken(
        storedToken._id,
        tokens.refreshToken,
        expiresAt
      );

      return tokens;
    } catch (err) {
      throw new Error("Invalid or expired refresh token");
    }
  }
  async updatePassword(userId, data) {
      const {password,newPassword}=data;
      if(password === newPassword){
        throw new BadRequestError("New password must differ from current password")
      }
      const user = await userRepo.findById(userId);
      if (!user) throw new NotFoundError("User not found");
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) throw new BadRequestError("Invalid credentials");
      const hashedPassword = await bcrypt.hash(newPassword,authConfig.bcryptRounds);
      await userRepo.update(userId,{password:hashedPassword,passwordChangedAt:new Date()});
      await refreshTokenRepo.deleteByUser(userId);
  }
  async logout(token) {
    if (!token) throw new Error("token is required");
    await refreshTokenRepo.deleteByToken(token);
  }
}
module.exports = new AuthService();
