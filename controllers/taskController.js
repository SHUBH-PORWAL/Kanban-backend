const Column = require('../models/Column');
const Task = require('../models/Task');
const Board = require('../models/Board');

const createTask = async (req, res) => {
    try {
        const { columnId, title, description } = req.body;

        const column = await Column.findById(columnId);
        if (!column) {
            return res.status(404).json({ message: 'Column not found' });
        }

        const board = await Board.findOne({
            _id: column.board,
            user: req.user._id
        });

        if (!board) {
            return res.status(403).json({ message: 'Not authorized to access this board' });
        }

        const tasks = await Task.find({ column: columnId }).sort('-order');
        const order = tasks.length > 0 ? tasks[0].order + 1 : 0;

        const task = await Task.create({
            column: columnId,
            title,
            description,
            order
        });

        res.status(201).json(task);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

const updateTask = async (req, res) => {
    try {
        const { title, description, columnId, order } = req.body;
        const taskId = req.params.id;

        const task = await Task.findById(taskId);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        const column = await Column.findById(task.column);
        const board = await Board.findOne({
            _id: column.board,
            user: req.user._id
        });

        if (!board) {
            return res.status(403).json({ message: 'Not authorized to access this task' });
        }

        if (columnId && columnId !== task.column.toString()) {
            const targetColumn = await Column.findById(columnId);
            if (!targetColumn || targetColumn.board.toString() !== board._id.toString()) {
                return res.status(400).json({ message: 'Invalid target column' });
            }
            task.column = columnId;
        }

        if (title !== undefined) task.title = title;
        if (description !== undefined) task.description = description;
        if (order !== undefined) task.order = order;

        await task.save();

        res.json(task);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

const deleteTask = async (req, res) => {
    try {
        const taskId = req.params.id;

        const task = await Task.findById(taskId);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        const column = await Column.findById(task.column);
        const board = await Board.findOne({
            _id: column.board,
            user: req.user._id
        });

        if (!board) {
            return res.status(403).json({ message: 'Not authorized to access this task' });
        }

        await Task.deleteOne({ _id: taskId });

        res.json({ message: 'Task removed' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = { createTask, updateTask, deleteTask };