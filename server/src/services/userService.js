const friendshipRepo = require("../repositories/friendshipRepository");
const userRepo = require("../repositories/userRepository");
const notificationRepo = require("../repositories/notificationRepository");
const { upload, getPresignedUrl } = require("../utils/fileService");
const UserMapper = require("../mappers/userMapper");
const NotificationMapper = require("../mappers/notificationMapper");
const {
  NotFoundError,
  BadRequestError,
  ConflictError,
  UnauthorizedError,
} = require("../utils/errorHandling");
class UserService {
  async getUserProfile(me, userId) {
    const userData = await userRepo.findById(userId);
    if (!userData) throw new NotFoundError("User not found");
    const friendshipData = await friendshipRepo.checkFriendship(me, userId);
    let status = friendshipData?.status;
    let canUnBlock = false;
    if (
      status === "blocked" &&
      me === friendshipData?.statusChangedBy.toString()
    ) {
      canUnBlock = true;
    }
    if (status === "pending") {
      if (me === friendshipData.recipient.toString()) {
        status = "pending_received";
      } else if (me === friendshipData.requester.toString()) {
        status = "pending_sent";
      }
    }
    let avatar = "";
    if (userData?.profile?.avatar?.url) {
      const resp = await getPresignedUrl(userData.profile.avatar.url);
      avatar = resp?.data?.downloadUrl ?? "";
    }
    const userProfile = UserMapper.getProfileDTO(userData, avatar);
    return { ...userProfile, status, canUnBlock };
  }
  async getMyProfile(userId) {
    const userData = await userRepo.findById(userId);
    if (!userData) throw new NotFoundError("User not found");
    let avatar = "";
    if (userData?.profile?.avatar?.url) {
      const resp = await getPresignedUrl(userData.profile.avatar.url);
      avatar = resp?.data?.downloadUrl ?? "";
    }
    const userProfile = UserMapper.getMyProfileDTO(userData, avatar);
    return userProfile;
  }
  async updateProfile(userId, data) {
    let uploadUrl = "";
    const normalizedData = { ...data };
    if (data.avatar) {
      const response = await upload(data.avatar);
      if (response) {
        normalizedData.avatar = {
          url: response.data?.key,
          bucket: "userId",
          updatedAt: new Date(),
        };
        uploadUrl = response.data?.uploadUrl;
      }
    }
    const update = UserMapper.toPersistenceUpdate(normalizedData);
    await userRepo.update(userId, update);
    return { uploadUrl };
  }
  async requestFriendship(userId, recipientId) {
    if (userId === recipientId) {
      throw new BadRequestError("you can't be friend with yourself");
    }
    const recipient = await userRepo.findById(recipientId);
    if (!recipient || recipient?.deletedAt) {
      throw new NotFoundError("user doesn't exist");
    }
    const friendship = await friendshipRepo.checkFriendship(
      userId,
      recipientId,
    );
    if (friendship) {
      throw new ConflictError("you are already send the request");
    }
    const resp = await friendshipRepo.create({
      requester: userId,
      recipient: recipientId,
    });
    let notificationEvent = null;
    if (resp) {
      const notifData = NotificationMapper.createFriendRequest(
        recipientId,
        userId,
      );
      await notificationRepo.create(notifData);
      notificationEvent = NotificationMapper.createEvent(recipientId);
    }
    return {
      friendship: resp,
      event: notificationEvent
        ? {
            type: "NOTIFICATION_CREATED",
            payload: notificationEvent,
          }
        : null,
    };
  }
  async getPendingRequests(userId) {
    const data = await friendshipRepo.getPendingRequests(userId);
    const mappedRequests = data.map((element) => element?.requester);
    const dataWithImages = await UserMapper.getUsersWithImages(mappedRequests);
    return UserMapper.getUsersDTO(dataWithImages);
  }
  async acceptFriendshipRequest(recipientId, requesterId) {
    const friendship = await friendshipRepo.getPendingRequest(
      recipientId,
      requesterId,
    );
    if (!friendship) {
      throw new NotFoundError("request doesn't exist");
    }
    return await friendshipRepo.updateStatus(
      friendship._id,
      "accepted",
      recipientId,
    );
  }
  async blockFriend(blockerId, friendId) {
    const friendship = await friendshipRepo.checkFriendship(
      blockerId,
      friendId,
    );
    if (!friendship) {
      throw new NotFoundError("request doesn't exist");
    }
    return await friendshipRepo.updateStatus(
      friendship._id,
      "blocked",
      blockerId,
    );
  }
  async unblockFriend(blockerId, blockedId) {
    const friendship = await friendshipRepo.checkFriendship(
      blockerId,
      blockedId,
    );
    if (!friendship) {
      throw new UnauthorizedError("you don't have permission");
    }
    return await friendshipRepo.updateStatus(
      friendship._id,
      "accepted",
      blockerId,
    );
  }
  async getUsers(filter) {
    const { page, limit, username } = filter;
    const query = {};
    query.$or = [{ username: { $regex: username ?? "", $options: "i" } }];
    const data = await userRepo.findUsers(query, { page, limit });
    const dataWithImages = await UserMapper.getUsersWithImages(data?.users);
    const users = UserMapper.getUsersDTO(dataWithImages);
    return { ...data, users };
  }
}
module.exports = new UserService();
