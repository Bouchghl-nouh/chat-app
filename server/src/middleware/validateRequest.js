const sendResponse = require("../utils/responseHandler");

const validateRequest = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.body);

  if (error) {
    const messages = error.details.map(d => d.message).join(", ");
    console.warn("message",messages);
    return sendResponse(res, 400, false, "Invalid Request data");
  }

  req.body = value; 
  next();
};

module.exports = validateRequest;
