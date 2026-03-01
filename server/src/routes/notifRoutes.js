const express = require("express");
const NotifController = require("../controllers/notifController");
const router = express.Router();
const verifyJWT = require("../middleware/verifyJWT");
router.get("/unread",verifyJWT, NotifController.getUnreadNotifs);
router.patch("/read/:id",verifyJWT,NotifController.readNotif)
module.exports = router;
