const Board = require('../models/Board');
const Column = require('../models/Column');

const createColumn = async (req, res) => {
    try {
        const { title } = req.body;

        const board = await Board.findOne({ user: req.user._id });

        if (!board) {
            return res.status(404).json({ message: 'Board not found' });
        }

        const columns = await Column.find({ board: board._id }).sort('-order');
        const order = columns.length > 0 ? columns[0].order + 1 : 0;

        const column = await Column.create({
            board: board._id,
            title,
            order
        });

        res.status(201).json(column);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = { createColumn };