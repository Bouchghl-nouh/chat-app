const Joi = require("joi");
const mongoose = require("mongoose");
// Define schema
const updateMeSchema = Joi.object({
  username: Joi.string().min(2).max(30),
  firstName: Joi.string().min(2).max(30),
  lastName: Joi.string().min(2).max(30),
  description:Joi.string().max(500),
  avatar: Joi.string()
    .pattern(/\.(jpg|webp|jpeg|png)$/i)
    .min(1)
    .max(100),
}).options({
  abortEarly: true,
  allowUnknown: false,
});
module.exports = {
  updateMeSchema
};
