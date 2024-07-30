const Joi = require("joi");

const listingSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  price: Joi.number().min(0),
  image: {
    filename: Joi.string(),
    url: Joi.string(),
  },
  location: Joi.string().required(),
  country: Joi.string().required(),
});

module.exports = listingSchema;
