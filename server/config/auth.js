const development = {
  tokens: {
    accessTokenExpiry: "15m",
    refreshTokenExpiry: "7d",
    refreshTokenExpiryDays: 7,
    bcryptRounds: 12,
  },
};
const production = {
  tokens: {
    accessTokenExpiry: process.env.ACCESS_TOKEN_EXPIRY || "5m",
    refreshTokenExpiry: process.env.REFRESH_TOKEN_EXPIRY || "1d",
    refreshTokenExpiryDays:
      parseInt(process.env.REFRESH_TOKEN_EXPIRY_DAYS) || 1,
    bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS) || 15,
  },
};
const currentEnv = process.env.NODE_ENV || "development";
const configs = { development, production };
module.exports = { 
  development, 
  production, 
  current: configs[currentEnv] 
};