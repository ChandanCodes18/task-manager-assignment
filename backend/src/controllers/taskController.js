const mongoose = require('mongoose');
const Task = require('../models/Task');

const createTask = async (req, res, next) => {
  try {
    const task = await Task.create({ ...req.body, userId: req.user.id });
    return res.status(201).json({ message: 'Task created', task });
  } catch (error) {
    return next(error);
  }
};

const getTasks = async (req, res, next) => {
  try {
    const tasks = await Task.find({})
      .populate('userId', 'email role')
      .sort({ createdAt: -1 });
    return res.status(200).json({ count: tasks.length, tasks });
  } catch (error) {
    return next(error);
  }
};

const updateTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid task id' });
    }

    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const isOwner = task.userId.toString() === req.user.id;
    const isAdmin = req.user.role === 'admin';

    if (!isAdmin && !isOwner) {
      return res.status(403).json({ message: 'Not allowed to update this task' });
    }

    if (!isAdmin) {
      const owner = await task.populate('userId', 'role');
      if (owner.userId?.role === 'admin') {
        return res
          .status(403)
          .json({ message: 'Users cannot update tasks created by admins' });
      }
    }

    Object.assign(task, req.body);
    await task.save();

    return res.status(200).json({ message: 'Task updated', task });
  } catch (error) {
    return next(error);
  }
};

const deleteTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid task id' });
    }

    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const isOwner = task.userId.toString() === req.user.id;
    const isAdmin = req.user.role === 'admin';

    if (!isAdmin && !isOwner) {
      return res.status(403).json({ message: 'Not allowed to delete this task' });
    }

    if (!isAdmin) {
      const owner = await task.populate('userId', 'role');
      if (owner.userId?.role === 'admin') {
        return res
          .status(403)
          .json({ message: 'Users cannot delete tasks created by admins' });
      }
    }

    await task.deleteOne();
    return res.status(200).json({ message: 'Task deleted' });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
};
