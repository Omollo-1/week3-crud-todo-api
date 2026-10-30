// middlewares/validator.js
const Joi = require('joi');

const todoSchema = Joi.object({
  task: Joi.string().min(3).max(100).required(),
  completed: Joi.boolean()
});

const validateTodo = (req, res, next) => {
  const { error } = todoSchema.validate(req.body);

  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  next();
};

module.exports = validateTodo;