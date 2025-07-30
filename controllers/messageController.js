const Message = require('../models/Message');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

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

    res.status(201).json({ message: 'Message stored', data: message });

  } catch (err) {
    res.status(500).json({ message: 'Failed to post message', error: err.message });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const messages = await Message.findAll({
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
    res.status(500).json({ message: 'Could not fetch messages', error: err.message });
  }
};
