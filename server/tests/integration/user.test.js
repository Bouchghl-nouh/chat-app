const request = require("supertest");
const express = require("express");
const cookieParser = require("cookie-parser");
const userRoutes = require("@src/routes/userRoutes");
const userService = require("@src/services/userService");
const {
  NotFoundError,
  BadRequestError,
  ConflictError,
  UnauthorizedError,
} = require("@src/utils/errorHandling");
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
jest.mock("@src/middleware/validateObjectId", () => {
  return jest.fn((req, res, next) => next());
});

jest.mock("@src/services/userService");
jest.mock("@src/middleware/verifyJWT", () => {
  return (req, res, next) => {
    req.user = { id: 1 };
    next();
  };
});
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use("/user", userRoutes);
app.use(require("@src/middleware/errorHandler"));
describe("userController integrated Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "warn").mockImplementation(() => {});
  });
  afterEach(() => {
    console.warn.mockRestore();
  });
  describe("GET /user/profile/:id", () => {
    test("get user profile successfully", async () => {
      userService.getUserProfile.mockResolvedValue({ id: 1, username: "John" });
      const res = await request(app).get("/user/profile/1");
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe("user data");
      expect(userService.getUserProfile).toHaveBeenCalledWith("1");
    });
    test("user not found", async () => {
      userService.getUserProfile.mockRejectedValue(
        new NotFoundError("User not found")
      );
      const res = await request(app).get("/user/profile/1");
      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe("User not found");
      expect(userService.getUserProfile).toHaveBeenCalled();
    });
  });
  describe("PATCH /user/me", () => {
    test("update user profile", async () => {
      const userId = 1;
      const data = { avatar: "john.webp", firstName: "john", lastName: "Doe" };
      userService.updateProfile.mockResolvedValue({ uploadedUrl: "url" });
      const res = await request(app).patch("/user/me").send(data);
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe("updated profile successfully");
      expect(userService.updateProfile).toHaveBeenCalledWith(userId, data);
    });
  });
  describe("POST /user/friendships", () => {
    test("send the request successfully", async () => {
      const userId = 1;
      const requester = 2;
      userService.requestFriendship.mockResolvedValue({ _id: 1 });
      const res = await request(app)
        .post("/user/friendships")
        .send({ requester });
      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe("your request was sent successfully");
      expect(userService.requestFriendship).toHaveBeenCalledWith(
        userId,
        requester
      );
    });
    test("already send the request", async () => {
      const requester = 2;
      userService.requestFriendship.mockRejectedValue(
        new ConflictError("you are already send the request")
      );
      const res = await request(app)
        .post("/user/friendships")
        .send({ requester });
      expect(res.status).toBe(409);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe("you are already send the request");
    });
  });
  describe("GET /user/me/requests", () => {
    test("get the requests", async () => {
      const data = [
        {
          id: 1,
          username: "user1",
          firstName: "user",
          lastName: "1",
          imageUrl: expect.any(String),
        },
        {
          id: 2,
          username: "user2",
          firstName: "user",
          lastName: "2",
          imageUrl: expect.any(String),
        },
        {
          id: 3,
          username: "user3",
          firstName: "user",
          lastName: "3",
          imageUrl: "",
        },
      ];
      userService.getPendingRequests.mockResolvedValue(data);
      const res = await request(app).get("/user/me/requests");
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe("pending requests");
    });
  });
  describe("PATCH /user/me/acceptRequest", () => {
    test("accept the request successfully", async () => {
      const userId = 1;
      const requester = 2;
      userService.acceptFriendshipRequest.mockResolvedValue({
        _id: 1,
        status: "accepted",
      });
      const res = await request(app)
        .patch("/user/me/acceptRequest")
        .send({ requester });
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe("You are friends now");
    });
  });
  describe("PATCH /user/me/unblockUser", () => {
    test("block the user successfully", async () => {
      const userId = 1;
      const requester = 2;
      userService.blockFriend.mockResolvedValue({
        _id: 1,
        status: "blocked",
      });
      const res = await request(app)
        .patch("/user/me/blockUser")
        .send({ requester });
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe("You blocked this friend");
    });
  });
   describe("PATCH /user/me/unblockUser", () => {
    test("unblock the user successfully", async () => {
      const userId = 1;
      const requester = 2;
      userService.blockFriend.mockResolvedValue({
        _id: 1,
        status: "accepted",
      });
      const res = await request(app)
        .patch("/user/me/unblockUser")
        .send({ requester });
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe("You are friends again");
    });
  });
});
