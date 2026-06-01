const express = require('express');
const {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
} = require('../controllers/taskController');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');
const { createTaskSchema, updateTaskSchema } = require('../validations/taskValidation');

const router = express.Router();

router.use(auth);

router.post('/', validate(createTaskSchema), createTask);
router.get('/', getTasks);
router.put('/:id', validate(updateTaskSchema), updateTask);
router.delete('/:id', deleteTask);

module.exports = router;