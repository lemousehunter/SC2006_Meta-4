const { Category } = require("../models/category");
const mongoose = require("mongoose");
const { User } = require("../models/user");
const { Post } = require("../models/post");

const searchSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, ""],
  },
});

searchSchema.virtual("id").get(function () {
  return this._id.toHexString();
});
searchSchema.set("toJSON", {
  virtuals: true,
});

exports.Search = mongoose.model("Search", searchSchema);
exports.searchSchema = searchSchema;