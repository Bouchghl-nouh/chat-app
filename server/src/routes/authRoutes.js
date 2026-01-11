const express = require("express");
const authController = require("../controllers/authController");
const router = express.Router();
const loginLimit = require("../middleware/rateLimiter");
const validateRequest = require("../middleware/validateRequest")
const verifyJWT = require("../middleware/verifyJWT");
const {registerSchema,loginSchema,updatePasswordSchema} = require("../validators/authValidator");

router.post("/register",validateRequest(registerSchema), authController.register);
router.post("/login",loginLimit,validateRequest(loginSchema) ,authController.login);
router.post("/logout", authController.logout);
router.post("/refresh", authController.refreshAccessToken);
router.patch("/newPassword",verifyJWT,validateRequest(updatePasswordSchema),authController.updatePassword);
module.exports = router;
