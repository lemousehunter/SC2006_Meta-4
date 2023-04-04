const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, ""],
  },
  email: {
    type: String,
    required: [true, ""],
    unique: true,
  },
  passwordHash: {
    type: String,
    required: [true, ""],
  },
  phone: {
    type: String,
    required: [true, ""],
  },
  creditScore: {
    type: Number,
    default: 0,
  },

  // To bind the posts of this user to this user. makes an empty array of posts initially
  posts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
    },
  ],
  reportedOthers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Report",
    },
  ],
  gotReported: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Report",
    },
  ],
});

userSchema.virtual("id").get(function () {
  return this._id.toHexString();
});
userSchema.set("toJSON", {
  virtuals: true,
});

exports.User = mongoose.model("User", userSchema);
exports.userSchema = userSchema;
