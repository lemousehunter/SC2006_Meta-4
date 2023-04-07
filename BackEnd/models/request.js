const mongoose = require("mongoose");

const requestSchema = mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, ""],
    },

    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, ""],
    },
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: [true, ""],
    },
    isLost: {
      type: Boolean, //true for "i lost it", false for "i found it"
    },
    state: {
      type: Number,
      default: 0, //pending
      min: -1, //rejected
      max: 1, //accepted
    },
    date: {
      type: Date,
      default: Date.now,
      required: [true, ""],
    },
    time: {
      type: String,
      default: () => new Date().toLocaleDateString,
    },
  },
  {
    timestamps: true,
  }
);

requestSchema.virtual("id").get(function () {
  return this._id.toHexString();
});
requestSchema.set("toJSON", {
  virtuals: true,
});

exports.Request = mongoose.model("Request", requestSchema);
exports.requestSchema = requestSchema;
