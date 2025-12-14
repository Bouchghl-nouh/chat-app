const rateLimit = require("express-rate-limit");
const sendResponse = require("../utils/responseHandler")
const loginLimit = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    const email = req.body.email || "";
    const ip = rateLimit.ipKeyGenerator(req);
    return `login_${ip}_${email}`;
  },
  handler: (req, res) => {
    console.warn(
      `🚨 Rate limit exceeded for login: ${req.ip} - ${req.body.email}`
    );
    sendResponse(res,429,false,"Too many registration attempts from this IP, please try again later")
  },
});

module.exports = loginLimit ;
