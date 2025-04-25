const Board = require('../models/Board');
const Column = require('../models/Column');
const Task = require('../models/Task');

const getBoard = async (req, res) => {
    try {
        const board = await Board.findOne({ user: req.user._id });

        if (!board) {
            return res.status(404).json({ message: 'Board not found' });
        }

        const columns = await Column.find({ board: board._id }).sort('order');

        const tasks = await Task.find({
            column: { $in: columns.map(col => col._id) }
        }).sort('order');

        const columnsWithTasks = columns.map(column => {
            const columnTasks = tasks.filter(
                task => task.column.toString() === column._id.toString()
            );

            return {
                _id: column._id,
                title: column.title,
                order: column.order,
                tasks: columnTasks
            };
        });

        res.json({
            _id: board._id,
            name: board.name,
            columns: columnsWithTasks
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = { getBoard };