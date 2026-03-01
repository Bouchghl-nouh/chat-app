const notifService = require("../services/notificationService");
const sendResponse = require("../utils/responseHandler");
const EventDispatcher = require("../events/eventDispatcher");
class UserController {
  async getUnreadNotifs(req, res) {
    let { page, limit } = req.query;
    page = Number(page);
    limit = Number(limit);
    const filter = { page, limit };
    const data = await notifService.getUnreadNotifs(filter, req.user.id);
    sendResponse(res, 200, true, "unread notifications", data);
  }
  async readNotif(req, res) {
    const { id } = req.params;
    const result = await notifService.readNotif(id);
    if (result.event) {
      EventDispatcher.dispatch(result.event);
    }
    sendResponse(res, 200, true, "notification read");
  }
}

module.exports = new UserController();
