const Joi = require("joi");

const userSchema = Joi.object({
  username: Joi.string().required(),
  email: Joi.string().required(),
  // password: Joi.password().required(),
}).required();

module.exports = userSchema;
