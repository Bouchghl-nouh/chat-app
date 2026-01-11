const express = require("express");
const UserController = require("../controllers/userController");
const router = express.Router();
const validateRequest = require("../middleware/validateRequest");
const validateObjectId = require("../middleware/validateObjectId");
const verifyJWT = require("../middleware/verifyJWT");
const {updateMeSchema,requestFriendshipSchema} = require("../validators/userValidator")

router.get("/profile/:id",verifyJWT,validateObjectId, UserController.getProfile);
router.patch("/me",verifyJWT,validateRequest(updateMeSchema),UserController.updateProfile);
router.post("/friendships",verifyJWT,validateRequest(requestFriendshipSchema),UserController.requestFriendship);
router.get("/me/requests",verifyJWT,UserController.getFriendshipRequests);
router.patch("/me/acceptRequest",verifyJWT,validateRequest(requestFriendshipSchema),UserController.acceptFriendshipRequest);
router.patch("/me/blockUser",verifyJWT,validateRequest(requestFriendshipSchema),UserController.blockUser);
router.patch("/me/unblockUser",verifyJWT,validateRequest(requestFriendshipSchema),UserController.unblockUser)
module.exports = router;
