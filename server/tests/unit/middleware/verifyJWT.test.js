const jwt = require("jsonwebtoken");
const verifyJWT = require("@src/middleware/verifyJWT");

jest.mock("jsonwebtoken");

describe("verifyJWT middleware", () => {
  let req, res, next;
  beforeEach(() => {
    req = { headers: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });
  test("should return 401 if token isn't provided", () => {
    req.headers.authorization = "";
    verifyJWT(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: "No token provided" });
    expect(next).not.toHaveBeenCalled();
  });
  test("should return 403 if token is invalid", () => {
    req.headers.authorization = "Bearer invalid_token";
    jwt.verify.mockImplementation((_token, _secure, cb) => {
      cb(new Error("Invalid token"), null);
    });
    verifyJWT(req, res, next);
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ error: "Invalid token" });
    expect(next).not.toHaveBeenCalled();
  });
  test("should call next() with decoded user when token is valid",()=>{
    req.headers.authorization = "Bearer valid_token";
    const decodedUser = {id :"1",name:"Noah"};
    jwt.verify.mockImplementation((_token,_secure,cb)=>{
        cb(null,decodedUser);
    })
    verifyJWT(req,res,next);
    expect(req.user).toEqual(decodedUser);
    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  })
});
