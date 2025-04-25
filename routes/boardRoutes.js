const express = require('express');
const router = express.Router();
const { getBoard } = require('../controllers/boardController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getBoard);

module.exports = router;