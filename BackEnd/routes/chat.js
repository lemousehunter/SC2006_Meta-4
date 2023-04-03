const express = require('express');
const router = express.Router();
const Chat = require('../models/chat');

// Handle chat messages
router.post('/', async (req, res) => {
  try {
    const { message, senderId, receiverId } = req.body;

    const chatMessage = new Chat({ message, senderId, receiverId });

    const savedMessage = await chatMessage.save();

    res.json(savedMessage);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to save chat message' });
  }
});

router.get('/', (req, res) => {
  const { senderId, receiverId } = req.query;

  Chat.find({ $or: [{ senderId, receiverId }, { senderId: receiverId, receiverId: senderId }] })
    .then(messages => res.json(messages))
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'Failed to get chat messages' });
    });
});

module.exports = router;
