const friendshipRepo = require("../repositories/friendshipRepository");
const userRepo = require("../repositories/userRepository");
const { upload, getPresignedUrl } = require("../utils/fileService");
const UserMapper = require("../mappers/userMapper");
const {
  NotFoundError,
  BadRequestError,
  ConflictError,
  UnauthorizedError,
} = require("../utils/errorHandling");
class UserService {
  async getUserProfile(userId) {
    const userData = await userRepo.findById(userId);
    if (!userData) throw new NotFoundError("User not found");
    let avatar = "";
    if (userData?.profile?.avatar?.url) {
      const resp = await getPresignedUrl(userData.profile.avatar.url);
      avatar = resp?.data?.downloadUrl ?? "";
    }
    const userProfile = UserMapper.getProfileDTO(userData, avatar);
    return userProfile;
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
      recipientId
    );
    if (friendship) {
      throw new ConflictError("you are already send the request");
    }
    const data = {
      requester: userId,
      recipient: recipientId,
    };
    await friendshipRepo.create(data);
  }
  async getPendingRequests(userId) {
    const data = await friendshipRepo.getPendingRequests(userId);
    const dataWithImages = await UserMapper.getDataWithImages(data);
    return UserMapper.getRequests(dataWithImages);
  }
  async acceptFriendshipRequest(recipientId, requesterId) {
    const friendship = await friendshipRepo.getPendingRequest(
      recipientId,
      requesterId
    );
    if (!friendship) {
      throw new NotFoundError("request doesn't exist");
    }
    return await friendshipRepo.updateStatus(
      friendship._id,
      "accepted",
      recipientId
    );
  }
  async blockFriend(blockerId, friendId) {
    const friendship = await friendshipRepo.checkFriendship(
      blockerId,
      friendId
    );
    if (!friendship) {
      throw new NotFoundError("request doesn't exist");
    }
    return await friendshipRepo.updateStatus(
      friendship._id,
      "blocked",
      blockerId
    );
  }
  async unblockFriend(blockerId, blockedId) {
    const friendship = await friendshipRepo.checkFriendship(
      blockerId,
      blockedId
    );
    if (!friendship) {
      throw new UnauthorizedError("you don't have permission");
    }
    return await friendshipRepo.updateStatus(
      friendship._id,
      "accepted",
      blockerId
    );
  }
}
module.exports = new UserService();
