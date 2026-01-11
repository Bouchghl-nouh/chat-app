const sendResponse = require("../utils/responseHandler")

const errorHandler = (err, req, res, next) => {
  const status = err.statusCode || 500;
  if(err){
   sendResponse(res,status,false,err.message || "Server error");
  }
};

module.exports = errorHandler;