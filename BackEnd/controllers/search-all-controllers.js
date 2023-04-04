const { Category } = require("../models/category");
const mongoose = require("mongoose");
const HttpError = require("../models/http-error");
const { User } = require("../models/user");
const { Post } = require("../models/post");

// Search both post and user via name (Case sensitive)
const search =  async (req, res, next) => {
    const { name } = req.params;
    const { category, listedBy } = req.query;

    let postData, userData, catData;

    try {
        const filter = new RegExp(name, 'i');       

      // trying to find the post specified by the param name
      postData = await Post.find({
        $or: [
          { itemName: filter },
        ]
      })
      .populate({ path: "category", select: { name: 1 } })
      .populate({ path: "listedBy", select: { name: 1, phone: 1 } });
    } catch (err) {
      const error = new HttpError(
        "Could not find the specified user given the name.",
        500
      );
      return next(error);
    }

    postData = postData.filter((post) => {
      if (category && listedBy) {
        return post.category.name === category && post.listedBy.name === listedBy;
      } else if (!category && listedBy) {
        return post.listedBy.name === listedBy;
      } else if (category && !listedBy) {
        return post.category.name === category;
      } else {
        return
      }
    });

    res.status(201).send(postData);
  };
  
  exports.search = search;