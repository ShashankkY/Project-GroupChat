const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const authenticateToken = require('../middleware/auth');

router.post('/messages', authenticateToken, messageController.postMessage);
router.get('/messages', authenticateToken, messageController.getMessages);

module.exports = router;
