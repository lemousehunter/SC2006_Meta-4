const express = require("express");
const router = express.Router();
const { createChat, getChat } = require("../controllers/chats-controllers");

// Handle chat messages
router.post("/", createChat);

router.get("/", getChat);

module.exports = router;
