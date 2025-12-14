const Joi = require("joi");

// Define schema
const registerSchema = Joi.object({
  username: Joi.string()
    .min(2)
    .max(30)
    .required(),
  email: Joi.string()
    .email()
    .required(),
  password: Joi.string()
    .min(4)
    .max(100)
    .required()
}).options({ 
  abortEarly: true,  // Return all errors, not just first if false
  allowUnknown: false // Reject extra fields
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(4).required()
}).options({ allowUnknown: false });

module.exports = {
  registerSchema,
  loginSchema
};
