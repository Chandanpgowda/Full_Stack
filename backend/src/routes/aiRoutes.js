const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');

// Status route
router.get('/status', aiController.getStatus);

// Chat route
router.post('/chat', aiController.chat);

module.exports = router;
