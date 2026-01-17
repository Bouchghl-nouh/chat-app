const friendshipRepo = require("@src/repositories/friendshipRepository");
const userRepo = require("@src/repositories/userRepository");
const UserService = require("@src/services/userService");
const { upload, getPresignedUrl } = require("@src/utils/fileService");
jest.mock("@src/config/auth", () => ({
  current: {
    tokens: {
      accessTokenExpiry: "15m",
      refreshTokenExpiry: "7d",
      refreshTokenExpiryDays: 7,
      bcryptRounds: 12,
    },
  },
}));
jest.mock("@src/repositories/userRepository");
jest.mock("@src/repositories/friendshipRepository");
jest.mock("@src/utils/fileService", () => ({
  upload: jest.fn(),
  getPresignedUrl: jest.fn(),
}));
describe("UserService", () => {
  let userService;
  const makeDoc = (obj) => ({
    ...obj,
    toJSON: jest.fn().mockReturnValue(obj),
  });
  beforeEach(() => {
    userService = UserService;

    jest.clearAllMocks();
  });
  describe("getUserProfile", () => {
    test("it should throw if user didn't found", async () => {
      const id = 0;
      await expect(userService.getUserProfile(id)).rejects.toThrow(
        "User not found"
      );
    });
    test("get the user profile successfully without image url", async () => {
      const id = 1;
      const data = {
        _id: 1,
        username: "JohnDoe",
        email: "john@gmail.com",
        profile: {
          firstName: "John",
          lastName: "Doe",
        },
      };
      userRepo.findById.mockResolvedValue(data);
      const result = await userService.getUserProfile(id);
      expect(result).toEqual({
        firstName: "John",
        lastName: "Doe",
        username: "JohnDoe",
        avatar: "",
      });
    });
    test("get the user profile successfully with image url", async () => {
      const id = 1;
      const data = {
        _id: 1,
        username: "JohnDoe",
        email: "john@gmail.com",
        profile: {
          firstName: "John",
          lastName: "Doe",
          avatar: {
            url: "url",
            bucket: "bucket",
          },
        },
      };
      userRepo.findById.mockResolvedValue(data);
      getPresignedUrl.mockResolvedValue({
        data: { downloadUrl: "https://signed-url.com/avatar.png" },
      });
      const result = await userService.getUserProfile(id);
      expect(result).toEqual({
        firstName: "John",
        lastName: "Doe",
        username: "JohnDoe",
        avatar: expect.any(String),
      });
    });
  });
    describe("getMyProfile", () => {
    test("get the user profile successfully without image url", async () => {
      const id = 1;
      const data = {
        _id: 1,
        username: "JohnDoe",
        email: "john@gmail.com",
        profile: {
          firstName: "John",
          lastName: "Doe",
        },
      };
      userRepo.findById.mockResolvedValue(data);
      const result = await userService.getUserProfile(id);
      expect(result).toEqual({
        firstName: "John",
        lastName: "Doe",
        username: "JohnDoe",
        avatar: "",
      });
    });
    test("get the user profile successfully with image url", async () => {
      const id = 1;
      const data = {
        _id: 1,
        username: "JohnDoe",
        email: "john@gmail.com",
        profile: {
          firstName: "John",
          lastName: "Doe",
          avatar: {
            url: "url",
            bucket: "bucket",
          },
        },
      };
      userRepo.findById.mockResolvedValue(data);
      getPresignedUrl.mockResolvedValue({
        data: { downloadUrl: "https://signed-url.com/avatar.png" },
      });
      const result = await userService.getMyProfile(id);
      expect(result).toEqual({
        firstName: "John",
        lastName: "Doe",
        username: "JohnDoe",
        email:"john@gmail.com",
        avatar: expect.any(String),
      });
    });
  });
  describe("update Profile", () => {
    test("it should update the profile successfully without image", async () => {
      const id = 1;
      const data = {
        firstName: "john",
        lastName: "Doe",
      };
      const result = await userService.updateProfile(id, data);
      expect(result).toEqual({
        uploadUrl: "",
      });
      expect(userRepo.update).toHaveBeenCalledWith(id, {
        "profile.firstName": "john",
        "profile.lastName": "Doe",
      });
      expect(upload).not.toHaveBeenCalled();
    });
    test("it should update the profile successfully with image", async () => {
      const id = 1;
      const data = {
        username: "john",
        avatar: "john.webp",
      };
      upload.mockResolvedValue({
        data: {
          uploadUrl: "https://download-url.com/hashedJohn.webp",
          key: "hashedJohn.webp",
        },
      });
      const result = await userService.updateProfile(id, data);
      const normalizedData = {
        username: "john",
        "profile.avatar.url": "hashedJohn.webp",
        "profile.avatar.bucket": "userId",
        "profile.avatar.updatedAt": expect.any(Date),
      };
      expect(result).toEqual({
        uploadUrl: "https://download-url.com/hashedJohn.webp",
      });
      expect(userRepo.update).toHaveBeenCalledWith(id, normalizedData);
      expect(upload).toHaveBeenCalledWith("john.webp");
    });
  });
  describe("request friendship", () => {
    test("the recipient doesn't exist", async () => {
      const recipientId = 1;
      const userId = 2;
      userRepo.findById.mockResolvedValue(null);
      await expect(
        userService.requestFriendship(userId, recipientId)
      ).rejects.toThrow("user doesn't exist");
      expect(friendshipRepo.create).not.toHaveBeenCalled();
    });
    test("the recipient is deleted", async () => {
      const recipientId = 1;
      const userId = 2;
      userRepo.findById.mockResolvedValue({
        deletedAt: "2025-12-14T18:32:54.492+00:00",
      });
      await expect(
        userService.requestFriendship(userId, recipientId)
      ).rejects.toThrow("user doesn't exist");
      expect(friendshipRepo.create).not.toHaveBeenCalled();
    });
    test("the recipient is deleted", async () => {
      const recipientId = 1;
      const userId = 2;
      userRepo.findById.mockResolvedValue({
        deletedAt: "2025-12-14T18:32:54.492+00:00",
      });
      await expect(
        userService.requestFriendship(userId, recipientId)
      ).rejects.toThrow("user doesn't exist");
      expect(friendshipRepo.create).not.toHaveBeenCalled();
    });
    test("send the request successfully", async () => {
      const userId = 2;
      const recipientId = 1;
      const data = { requester: userId, recipient: recipientId };
      userRepo.findById.mockResolvedValue({ _id: 1, username: "John" });
      friendshipRepo.checkFriendship.mockResolvedValue(null);
      await userService.requestFriendship(userId, recipientId);
      expect(friendshipRepo.create).toHaveBeenCalledWith(data);
    });
    test("the request already exist", async () => {
      const recipientId = 1;
      const userId = 2;
      const data = { requester: 1, recipient: 2 };
      userRepo.findById.mockResolvedValue({ _id: 1, username: "John" });
      friendshipRepo.checkFriendship.mockResolvedValue({ _id: 1 });
      await expect(
        userService.requestFriendship(recipientId, userId)
      ).rejects.toThrow("you are already send the request");
      expect(friendshipRepo.create).not.toHaveBeenCalled();
    });
  });
  describe("pending requests", () => {
    test("get the pending requests", async () => {
      const userId = 1;
      const pendingRequests = [
        makeDoc({
          requester: {
            _id: 1,
            username: "user1",
            profile: {
              firstName: "user",
              lastName: "1",
              avatar: {
                url: "url",
                bucket: "userId",
              },
            },
          },
        }),
        makeDoc({
          requester: {
            _id: 2,
            username: "user2",
            profile: {
              firstName: "user",
              lastName: "2",
              avatar: {
                url: "url2",
                bucket: "userId",
              },
            },
          },
        }),
        makeDoc({
          requester: {
            _id: 3,
            username: "user3",
            profile: {
              firstName: "user",
              lastName: "3",
            },
          },
        }),
      ];
      friendshipRepo.getPendingRequests.mockResolvedValue(pendingRequests);
      const result = await userService.getPendingRequests(userId);
      expect(result).toEqual([
        {
          id: 1,
          username: "user1",
          firstName: "user",
          lastName: "1",
          avatar: expect.any(String),
        },
        {
          id: 2,
          username: "user2",
          firstName: "user",
          lastName: "2",
          avatar: expect.any(String),
        },
        {
          id: 3,
          username: "user3",
          firstName: "user",
          lastName: "3",
          avatar: "",
        },
      ]);
      expect(getPresignedUrl).toHaveBeenCalledTimes(2);
    });
  });
  describe("accept friendship request", () => {
    test("request doesn't exist", async () => {
      friendshipRepo.getPendingRequest.mockResolvedValue(null);
      await expect(userService.acceptFriendshipRequest).rejects.toThrow();
      expect(friendshipRepo.updateStatus).not.toHaveBeenCalled();
    });
    test("request accepted successfully", async () => {
      const recipient =1;
      const requester = 2; 
      friendshipRepo.getPendingRequest.mockResolvedValue({_id:1});
      await userService.acceptFriendshipRequest(recipient,requester);
      expect(friendshipRepo.updateStatus).toHaveBeenCalledWith(1,"accepted",recipient)
    });
  });
  describe("block friend ", () => {
    test("friend blocked successfully", async () => {
      const blocker =1;
      const friend = 2; 
      friendshipRepo.getPendingRequest.mockResolvedValue({_id:1});
      await userService.blockFriend(blocker,friend);
      expect(friendshipRepo.updateStatus).toHaveBeenCalledWith(1,"blocked",blocker)
    });
  });
  describe("unblock friend ", () => {
    test("friend blocked successfully", async () => {
      const blocker =1;
      const blocked = 2; 
      friendshipRepo.getPendingRequest.mockResolvedValue({_id:1});
      await userService.unblockFriend(blocker,blocked);
      expect(friendshipRepo.updateStatus).toHaveBeenCalledWith(1,"accepted",blocker)
    });
  });
});
