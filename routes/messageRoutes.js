const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const authenticateToken = require('../middleware/auth');

router.post('/groups/:groupId/messages', authenticateToken, messageController.postMessage);
router.get('/groups/:groupId/messages', authenticateToken, messageController.getGroupMessages);

module.exports = router;
