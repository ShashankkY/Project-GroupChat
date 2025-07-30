const { Group, GroupUser, User } = require('../models');

exports.createGroup = async (req, res) => {
  try {
    const group = await Group.create({ name: req.body.name });
    await GroupUser.create({ groupId: group.id, userId: req.user.userId });
    res.status(201).json({ message: 'Group created', group });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.inviteUser = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: 'User not found' });

    await GroupUser.create({ groupId: req.params.groupId, userId: user.id });
    res.status(200).json({ message: 'User invited to group' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getUserGroups = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.userId);
    const groups = await user.getGroups();
    res.status(200).json({ groups });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
