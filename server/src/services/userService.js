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
    let imageUrl = "";
    if (userData?.profile?.avatar?.url) {
      const resp = await getPresignedUrl(userData.profile.avatar.url);
      imageUrl = resp?.data?.downloadUrl ?? "";
    }
    const userProfile = UserMapper.getProfileDTO(userData, imageUrl);
    return userProfile;
  }
  async updateProfile(userId, data) {
    let uploadedUrl = "";
    const normalizedData = { ...data };
    if (data.avatar) {
      const response = await upload(data.avatar);
      if (response) {
        normalizedData.avatar = {
          url: response.data?.key,
          bucket: "userId",
          updatedAt: new Date(),
        };
        uploadedUrl = response.data?.uploadUrl;
      }
    }
    const update = UserMapper.toPersistenceUpdate(normalizedData);
    await userRepo.update(userId, update);
    return { uploadedUrl };
  }
  async requestFriendship(userId, user) {
    if (userId === user) {
      throw new BadRequestError("you can't be friend with yourself");
    }
    const recipient = await userRepo.findById(user);
    if (!recipient || recipient?.deletedAt) {
      throw new NotFoundError("user doesn't exist");
    }
    const friendship = await friendshipRepo.checkFriendship(userId, user);
    if (friendship) {
      throw new ConflictError("you are already send the request");
    }
    const data = {
      requester: userId,
      recipient: user,
    };
    await friendshipRepo.create(data);
  }
  async getPendingRequests(userId) {
    const data = await friendshipRepo.getPendingRequests(userId);
    const dataWithImages = await Promise.all(
      data.map(async (element) => {
        const avatarKey = element.requester.profile.avatar.url;
        if (!avatarKey) {
          return {
            ...element.toJSON(),
            avatarUrl: "",
          };
        }
        const resp = await getPresignedUrl(avatarKey);
        return {
          ...element.toJSON(),
          avatarUrl: resp.data.downloadUrl ?? "",
        };
      })
    );
    return UserMapper.getRequests(dataWithImages);
  }
  async acceptFriendshipRequest(recipient, requester) {
    const friendship = await friendshipRepo.getPendingRequest(
      recipient,
      requester
    );
    if (!friendship) {
      throw new NotFoundError("request doesn't exist");
    }
    return await friendshipRepo.updateStatus(
      friendship.id,
      "accepted",
      recipient
    );
  }
  async blockFriend(blocker, friend) {
    const friendship = await friendshipRepo.checkFriendship(blocker, friend);
    if (!friendship) {
      throw new NotFoundError("request doesn't exist");
    }
    return await friendshipRepo.updateStatus(friendship.id, "blocked", blocker);
  }
  async unblockFriend(blocker, blocked) {
    const friendship = await friendshipRepo.checkFriendship(blocker, blocked);
    if (!friendship) {
      throw new UnauthorizedError("you don't have permission");
    }
    return await friendshipRepo.updateStatus(
      friendship.id,
      "accepted",
      blocker
    );
  }
}
module.exports = new UserService();
