const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');

router.post('/messages', messageController.postMessage);
router.get('/messages', messageController.getMessages);

module.exports = router;
