const { Post } = require("../models/post");
const express = require("express");
const { Category } = require("../models/category");
const router = express.Router();
const mongoose = require("mongoose");
const multer = require("multer");
const HttpError = require("../models/http-error");
const { User } = require("../models/user");

// Search both post and user via name (Case sensitive)
router.get(`/search/:name`, async (req, res, next) => {
    let postData, userData;
    try {
      userData = await User.find({
        $or: [{ name: { $regex: req.params.name } }],
      }).select({ name: 1, email: 1, phone: 1, posts: 1 });
      postData = await Post.find({
        $or: [
          { itemName: { $regex: req.params.name } },
          { category: {$regex: req.params.name} },
          { listedBy: {$regex: req.params.name} },
        ],
      });
    } catch (err) {
      const error = new HttpError(
        "Could not find the specified user given the name.",
        500
      );
      return next(error);
    }
    res.status(201).send(userData);
    res.send(postData);
  });
  
  module.exports = router;