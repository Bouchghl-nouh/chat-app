const {getIO} = require("../config/socket");
const notificationRepo = require("../repositories/notificationRepository")
const notifSocket = async(socket) =>{
    let io = getIO();
    const userId = socket?.user?.id ; 
    const count = await notificationRepo.countUnreadNotifications(userId);
    io.to(userId).emit("notification",count)
}
module.exports = notifSocket ;