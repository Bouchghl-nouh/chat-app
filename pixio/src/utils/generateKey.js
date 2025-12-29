const { v4: uuid } = require("uuid");

const generateUniqueKey = (userId, filename) => {
  const ext = filename.split(".").pop();
  return `${userId}/${uuid()}.${ext}`;
};

module.exports = generateUniqueKey;
