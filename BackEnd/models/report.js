const mongoose = require("mongoose");

const reportSchema = mongoose.Schema(
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
    title: {
      type: String,
      required: [true, ""],
    },
    description: {
      type: String,
      required: [true, ""],
    },
    state: {
      type: Number,
      default: 0,
      min: -1,
      max: 1,
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

reportSchema.virtual("id").get(function () {
  return this._id.toHexString();
});
reportSchema.set("toJSON", {
  virtuals: true,
});

exports.Report = mongoose.model("Report", reportSchema);
exports.reportSchema = reportSchema;
