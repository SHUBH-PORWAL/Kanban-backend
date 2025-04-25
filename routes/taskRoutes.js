const express = require('express');
const router = express.Router();
const { createTask, updateTask, deleteTask } = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, createTask);
router.patch('/:id', protect, updateTask);
router.delete('/:id', protect, deleteTask);

module.exports = router;