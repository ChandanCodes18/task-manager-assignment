const Joi = require('joi');

const createTaskSchema = Joi.object({
  title: Joi.string().trim().min(2).max(120).required(),
  description: Joi.string().trim().allow('').max(500).optional(),
  status: Joi.string().valid('todo', 'in-progress', 'done').optional(),
});

const updateTaskSchema = Joi.object({
  title: Joi.string().trim().min(2).max(120).optional(),
  description: Joi.string().trim().allow('').max(500).optional(),
  status: Joi.string().valid('todo', 'in-progress', 'done').optional(),
}).min(1);

module.exports = {
  createTaskSchema,
  updateTaskSchema,
};