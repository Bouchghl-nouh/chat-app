const notificationRepo = require("../repositories/notificationRepository");
const NotificationFactory = require("../factories/notificationFactory");
const NotificationMapper = require("../mappers/notificationMapper");

class NotificationService{
    async notify(type,payload){
        const notifData = NotificationFactory.build(type,payload);
        const notification = await notificationRepo.create(notifData);
        if(!notification) return null;
        return {
            type:"NOTIFICATION_CREATED",
            payload:NotificationMapper.createEvent(notifData.receiver),
        }
    }
}
module.exports = new NotificationService();