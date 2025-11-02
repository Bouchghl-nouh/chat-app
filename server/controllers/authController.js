const authService = require("../services/authService");
const authConfig = require("../config/auth").current.tokens;
const { sendResponse } = require("../utils/responseHandler");

class AuthController {
  async register(req, res) {
    try {
      const { username, password,email } = req.body;
      const registeredUser = await authService.register(username, password,email);
      sendResponse( res,201,true, "User registered", registeredUser );
    } catch (err) {
      sendResponse( res,400,false, err.message );
    }
  }
  async login(req, res) {
    try {
      const { email, password } = req.body;
      const loggedInUser = await authService.login(email, password);
      const { accessToken, refreshToken, user } = loggedInUser;
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // HTTPS in production
        sameSite: "strict",
        maxAge: authConfig.refreshTokenExpiryDays * 24 * 60 * 60 * 1000,
      });
      const data = { id: user._id, username: user.username ,accessToken:accessToken };
      sendResponse( res,200,true, "Login successful", data );
      
    } catch (err) {
      sendResponse( res,400,false, err.message );
    }
  }
  async refreshAccessToken(req, res) {
    try {
      const { refreshToken } = req.cookies;

      const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
        await authService.refreshToken(refreshToken);
      res.clearCookie("refreshToken");
      res.cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // HTTPS in production
        sameSite: "strict",
        maxAge: authConfig.refreshTokenExpiryDays * 24 * 60 * 60 * 1000,
      });
      sendResponse( res,200,true, "Access token refreshed", { accessToken: newAccessToken } );
    } catch (err) {
      res.clearCookie("refreshToken");
      sendResponse( res,500,false, err.message );
    }
  }
  async logout(req, res) {
    try {
      const { refreshToken } = req.cookies;
      await authService.logout(refreshToken);
      res.clearCookie("refreshToken");
      sendResponse( res,200,true, "Logout successful" );
    } catch (err) {
      sendResponse( res,500,false, err.message );
    }
  }
}




module.exports = new AuthController();
