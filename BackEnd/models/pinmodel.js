const mongoose = require("mongoose");

const pinSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  latitude: {
    type: Number,
    required: true,
  },
  longitude: {
    type: Number,
    required: true,
  },
  postid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post",
    required: [true, ""],
  },
});

module.exports = mongoose.model("Pin", pinSchema);
