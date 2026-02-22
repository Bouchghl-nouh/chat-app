const userService = require("../services/userService");
const sendResponse = require("../utils/responseHandler");
const { getIO } = require("../config/socket");
class UserController {
  async getProfile(req, res) {
    const { id } = req.params;
    const me = req.user.id;
    const userProfile = await userService.getUserProfile(me,id);
    sendResponse(res, 200, true, "user data", userProfile);
  }
  async getMyProfile(req, res) {
    const id = req.user.id;
    const userProfile = await userService.getMyProfile(id);
    sendResponse(res, 200, true, "your personal data", userProfile);
  }
  async updateProfile(req, res) {
    const resp = await userService.updateProfile(req.user.id, req.body);
    sendResponse(res, 200, true, "updated profile successfully", resp);
  }
  async requestFriendship(req, res) {
    const { id } = req.params;
    const result = await userService.requestFriendship(req.user.id, id);
    if(result.notificationEvent){
      const io = getIO();
      io.to(result.notificationEvent.userId).emit(
        "new_notification",
        result.notificationEvent.increment
      )
    }
    sendResponse(res, 201, true, "your request was sent successfully");
  }
  async getFriendshipRequests(req, res) {
    const data = await userService.getPendingRequests(req.user.id);
    sendResponse(res, 200, true, "pending requests", data);
  }
  async acceptFriendshipRequest(req, res) {
    const { id } = req.params;
    await userService.acceptFriendshipRequest(req.user.id, id);
    sendResponse(res, 200, true, "You are friends now");
  }
  async blockUser(req, res) {
    const { id } = req.params;
    await userService.blockFriend(req.user.id, id);
    sendResponse(res, 200, true, "You blocked this friend");
  }
  async unblockUser(req, res) {
    const { id } = req.params;
    await userService.unblockFriend(req.user.id, id);
    sendResponse(res, 200, true, "You are friends again");
  }
  async getUsers(req, res) {
    let { page, limit, username } = req.query;
    page = Number(page);
    limit = Number(limit);
    const filter = { page, limit, username };
    const data = await userService.getUsers(filter);
    sendResponse(res, 200, true, "users", data);
  }
}

module.exports = new UserController();
