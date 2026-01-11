const userService = require("../services/userService");
const sendResponse = require("../utils/responseHandler");
class UserController {
  async getProfile(req, res) {
    const { id } = req.params;
    const userProfile = await userService.getUserProfile(id);
    if (userProfile) {
      sendResponse(res, 200, true, "user data", userProfile);
    } else {
      sendResponse(res, 404, false, "User not found");
    }
  }
  async updateProfile(req, res) {
    const resp = await userService.updateProfile(req.user.id, req.body);
    sendResponse(res, 200, true, "updated profile successfully", resp);
  }
  async requestFriendship(req, res) {
    const { requester } = req.body;
    await userService.requestFriendship(req.user.id, requester);
    sendResponse(res, 201, true, "your request was sent successfully");
  }
  async getFriendshipRequests(req, res) {
    const data = await userService.getPendingRequests(req.user.id);
    sendResponse(res, 200, true, "pending requests", data);
  }
  async acceptFriendshipRequest(req, res) {
    const { requester } = req.body;
    await userService.acceptFriendshipRequest(req.user.id, requester);
    sendResponse(res, 200, true, "You are friends now ");
  }
  async blockUser(req, res) {
    const { requester } = req.body;
    await userService.blockFriend(req.user.id, requester);
    sendResponse(res, 200, true, "You blocked this friend");
  }
   async unblockUser(req, res) {
    const { requester } = req.body;
    await userService.unblockFriend(req.user.id, requester);
    sendResponse(res, 200, true, "You are friends again");
  }
}

module.exports = new UserController();
