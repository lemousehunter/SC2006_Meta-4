const { Post } = require("../models/post");
const express = require("express");
const { Category } = require("../models/category");
const router = express.Router();
const mongoose = require("mongoose");
const multer = require("multer");
const HttpError = require("../models/http-error");
const { User } = require("../models/user");

// Search both post and user via name (Case sensitive)
router.get(`/:name`, async (req, res, next) => {
    const { name } = req.params;
    const { category, listedBy } = req.query;

    let postData, userData;
    try {
        const filter = new RegExp(name, 'i');
        const categoryFilter = category ? mongoose.Types.ObjectId(category) : undefined;
        const listedByFilter = listedBy ? { $regex: listedBy, $options: 'i' } : undefined;        

      userData = await User.find({
        $or: [{ name: { $regex: req.params.name } }],
      }).select({ name: 1, email: 1, phone: 1, posts: 1 });
      postData =await Post.find({
        $or: [
          { itemName: filter },
          { category: categoryFilter },
          { listedBy: listedByFilter }
        ]
      })
      .populate("category")
      .populate({ path: "listedBy", select: { name: 1, phone: 1 } });
    } catch (err) {
      const error = new HttpError(
        "Could not find the specified user given the name.",
        500
      );
      return next(error);
    }

    const responseData = {userData, postData};
    res.status(201).send(responseData);
  });
  
  module.exports = router;