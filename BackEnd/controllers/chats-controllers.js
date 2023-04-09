
/**
 * Handles chat messages by creating and retrieving chat messages from the database.
 */
const Chat = require("../models/chat");


/**
 * Creates a new chat message with the given content and saves it to the database.
 *
 * @param {Object} req - The HTTP request object.
 * @param {Object} req.body - The body of the HTTP request containing the chat message content.
 * @param {string} req.body.message - The content of the chat message.
 * @param {string} req.body.senderId - The ID of the user who sent the chat message.
 * @param {string} req.body.receiverId - The ID of the user who received the chat message.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<Object>} A Promise that resolves to the saved chat message object.
 * @throws {Error} If there is an error saving the chat message to the database.
 */
const createChat = async (req, res) => {
  try {
    const { message, senderId, receiverId } = req.body;

    const chatMessage = new Chat({ message, senderId, receiverId });

    const savedMessage = await chatMessage.save();

    res.json(savedMessage);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to save chat message" });
  }
};

/**
 * Retrieves all chat messages between two users from the database.
 *
 * @param {Object} req - The HTTP request object.
 * @param {Object} req.query - The query parameters of the HTTP request.
 * @param {string} req.query.senderId - The ID of the sender user.
 * @param {string} req.query.receiverId - The ID of the receiver user.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<Object[]>} A Promise that resolves to an array of chat message objects.
 * @throws {Error} If there is an error retrieving chat messages from the database.
 */
const getChat = (req, res) => {
  const { senderId, receiverId } = req.query;
 
  Chat.find({
    $or: [
      { senderId, receiverId },
      { senderId: receiverId, receiverId: senderId },
    ],
  })
    .then((messages) => res.json(messages))
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: "Failed to get chat messages" });
    });
};

module.exports = {createChat,getChat};
