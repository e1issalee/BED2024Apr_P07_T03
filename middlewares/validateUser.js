const Joi = require("joi");

const validateUser = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(50).required(),
    email: Joi.string().min(3).max(50).email().required(),
    password: Joi.string().min(3).max(50).required(),
    points: Joi.number().integer().min(0).default(0), // Validate and set default value
    numberOfVouchers: Joi.number().integer().min(0).default(0), // Validate and set default value
    dailyCalories: Joi.number.integer().min(0).default(0)
  });

  const validation = schema.validate(req.body, { abortEarly: false }); // Validate request body

  if (validation.error) {
    const errors = validation.error.details.map((error) => error.message);
    res.status(400).json({ message: "Validation error", errors });
    return; // Terminate middleware execution on validation error
  }

  next(); // If validation passes, proceed to the next route handler
};

module.exports = validateUser;