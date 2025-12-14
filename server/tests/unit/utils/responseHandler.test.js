const  sendResponse  = require("@src/utils/responseHandler");

describe("sendResponse utility", () => {
  let res;

  beforeEach(() => {
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  it("should call status and json with correct values", () => {
    const statusCode = 200;
    const success = true;
    const message = "OK";
    const data = { id: 1 };

    sendResponse(res, statusCode, success, message, data);

    expect(res.status).toHaveBeenCalledWith(200);

    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: "OK",
      statusCode: 200,
      data: { id: 1 },
    });
  });

  it("should set data to null by default", () => {
    sendResponse(res, 400, false, "Error");

    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Error",
      statusCode: 400,
      data: null,
    });
  });
});
