const mongoose = require("mongoose");
// time not displayed when added
const postSchema = mongoose.Schema(
  {
    itemName: {
      type: String,
      required: [true, ""],
    },
    image: String,
    images: [
      {
        type: String,
      },
    ],
    isLost: {
      type: Boolean,
      required: [true, ""],
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, ""],
    },
    location: {
      type: String,
      required: [true, ""],
    },
    latitude: {
      type: Number,
    },
    longitude: {
      type: Number,
    },
    listedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
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
    itemDescription: {
      type: String,
      required: [true, ""],
    },
    finder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

postSchema.virtual("id").get(function () {
  return this._id.toHexString();
});
postSchema.set("toJSON", {
  virtuals: true,
});

exports.Post = mongoose.model("Post", postSchema);
exports.postSchema = postSchema;
