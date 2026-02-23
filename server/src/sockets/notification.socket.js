const {getIO} = require("../config/socket");
const notificationRepo = require("../repositories/notificationRepository")
const notifSocket = async(socket) =>{
    let io = getIO();
    const receiver = socket?.user?.id ; 
    const count = await notificationRepo.countUnreadNotifications(receiver);
    io.to(receiver).emit("notification",count)
}
module.exports = notifSocket ;