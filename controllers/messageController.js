const Message = require('../models/Message');
const User = require('../models/User');
const { Op } = require('sequelize');

// ✅ POST /messages
exports.postMessage = async (req, res) => {
  try {
    const { content } = req.body;
    const { groupId } = req.params;

    // Check if user is in group
    const isMember = await GroupUser.findOne({
      where: { userId: req.user.userId, groupId }
    });

    if (!isMember) return res.status(403).json({ message: 'Not a group member' });

    const message = await Message.create({
      content,
      UserId: req.user.userId,
      GroupId: groupId
    });

    res.status(201).json({ message: 'Message sent', data: message });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getGroupMessages = async (req, res) => {
  try {
    const { groupId } = req.params;

    const isMember = await GroupUser.findOne({
      where: { userId: req.user.userId, groupId }
    });

    if (!isMember) return res.status(403).json({ message: 'Not a group member' });

    const messages = await Message.findAll({
      where: { GroupId: groupId },
      include: [{ model: User, attributes: ['name'] }],
      order: [['createdAt', 'ASC']]
    });

    const formatted = messages.map(msg => ({
      id: msg.id,
      content: msg.content,
      sender: msg.User.name,
      time: msg.createdAt
    }));

    res.status(200).json({ messages: formatted });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

