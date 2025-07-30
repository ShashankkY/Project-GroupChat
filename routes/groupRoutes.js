const express = require('express');
const router = express.Router();
const groupController = require('../controllers/groupController');
const authenticate = require('../middleware/auth');

router.post('/groups', authenticate, groupController.createGroup);
router.post('/groups/:groupId/invite', authenticate, groupController.inviteUser);
router.get('/groups', authenticate, groupController.getUserGroups);

module.exports = router;
