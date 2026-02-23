const { getIO } = require("../config/socket");
class EventDispatcher {
  static handlers = {
    NOTIFICATION_CREATED: (payload) => {
      const io = getIO();
      io.to(payload.userId).emit("notification:new", payload.increment);
    },
  };

  static dispatch(event) {
    const handler = this.handlers[event.type];
    if (handler) handler(event.payload);
    else console.warn("Unhandled event:", event.type);
  }
}

module.exports = EventDispatcher;
