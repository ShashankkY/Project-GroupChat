const Message = require('../models/Message');
const User = require('../models/User');
const { Op } = require('sequelize');

// ✅ POST /messages
exports.postMessage = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ message: 'Message content is required' });
    }

    const message = await Message.create({
      content,
      UserId: userId
    });

    res.status(201).json({
      id: message.id,
      content: message.content,
      sender: req.user.name,
      time: message.createdAt
    });
  } catch (err) {
    res.status(500).json({
      message: 'Failed to post message',
      error: err.message
    });
  }
};

// ✅ GET /messages?after=ID
exports.getMessages = async (req, res) => {
  try {
    const afterId = parseInt(req.query.after || 0, 10);

    const messages = await Message.findAll({
      where: {
        id: { [Op.gt]: afterId }
      },
      include: [{ model: User, attributes: ['name'] }],
      order: [['id', 'ASC']]
    });

    const formatted = messages.map(msg => ({
      id: msg.id,
      content: msg.content,
      sender: msg.User.name,
      time: msg.createdAt
    }));

    res.status(200).json({ messages: formatted });
  } catch (err) {
    res.status(500).json({
      message: 'Could not fetch messages',
      error: err.message
    });
  }
};
