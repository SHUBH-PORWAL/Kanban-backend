const express = require('express');
const router = express.Router();
const { createColumn } = require('../controllers/columnController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, createColumn);

module.exports = router;