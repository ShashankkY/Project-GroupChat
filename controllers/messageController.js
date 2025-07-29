const Message = require('../models/Message');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

exports.postMessage = async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;
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
    res.status(401).json({ message: 'Unauthorized', error: err.message });
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
