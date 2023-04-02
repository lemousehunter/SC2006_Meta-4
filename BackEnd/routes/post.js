const { Post } = require("../models/post");
const express = require("express");
const { Category } = require("../models/category");
const router = express.Router();
const mongoose = require("mongoose");
const multer = require("multer");
const HttpError = require("../models/http-error");
const { User } = require("../models/user");
const Pin = require("../models/pinmodel");
const axios = require("axios");
const { onemapApiKey } = require("../helpers/config");
const FILE_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",
};
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const isValid = FILE_TYPE_MAP[file.mimetype];
    let uploadError = new Error("invalid image type");
    if (isValid) {
      uploadError = null;
    }
    cb(uploadError, "public/uploads");
  },
  filename: function (req, file, cb) {
    const fileName = file.originalname.replace(" ", "-");
    const extension = FILE_TYPE_MAP[file.mimetype];
    cb(null, `${fileName}-${Date.now()}.${extension}`);
  },
});
const uploadOptions = multer({ storage: storage });

// show all posts or filtered by category posts
router.get(`/`, async (req, res) => {
  let filter = {};
  if (req.query.categories) {
    filter = { category: req.query.categories.split(",") };
  }
  const postList = await Post.find(filter)
    .populate("category")
    .populate({ path: "listedBy", select: { name: 1, phone: 1 } });

  if (!postList) {
    res.status(500).json({ success: false });
  }
  res.send(postList);
});
//show post found by id, can use .select(<attribute>) to show selected attribute
router.get("/get/:id", async (req, res) => {
  const post = await Post.findById(req.params.id)
    .populate("category")
    .populate({ path: "listedBy", select: { name: 1, phone: 1 } });
  if (!post) {
    res.status(500).json({ success: false });
  }
  res.send(post);
});
// upload new post
router.post(`/`, uploadOptions.array("images", 4), async (req, res, next) => {
  const category = await Category.findById(req.body.category);
  if (!category) return res.status(400).send("invalid Category");
  const files = req.files;
  const basePath = `${req.protocol}://${req.get("host")}/public/uploads/`;
  let imagePaths = [];
  if (files) {
    files.map((file) => {
      imagePaths.push(`${basePath}${file.filename}`);
    });
  } else {
    return res.status(400).send("No image in the request");
  }
  let post = new Post({
    itemName: req.body.itemName,
    isLost: req.body.isLost,
    images: imagePaths,
    location: req.body.location,
    listedBy: req.body.listedBy,
    date: req.body.date,
    time: req.body.time,
    itemDescription: req.body.itemDescription,
    category: req.body.category,
    isResolved: req.body.isResolved,
  });
  if (post.isResolved === true) {
    return res.status(404).send("the post cannot be created");
  }
  //We also need to ensure that if there exists a userid with the provided id
  let user;
  let pin;
  try {
    user = await User.findById(post.listedBy);
  } catch (err) {
    const error = new HttpError(" Creating place failed, please retry.", 500);
    return next(error);
  }

  if (!user) {
    const error = new HttpError("Could not find user for the provided id", 404);
    return next(error);
  }
  if (post) {
    // Create a new pin
    const title = post.itemName;
    const description = post.itemDescription;
    const location = post.location;
    post = await post.save();
    // add post created to user
    let postList = user.posts;
    postList.push(post.id);
    user.posts = postList;
    user.save();
    console.log(user);
    if (!title || !description || !location) {
      return res.status(400).json({
        message: "Please provide a title, description, and location.",
      });
    }

    // Geocode the location using the OneMap API
    try {
      const response = await axios.get(
        "https://developers.onemap.sg/commonapi/search",
        {
          params: {
            searchVal: location,
            returnGeom: "Y",
            getAddrDetails: "N",
            pageNum: 1,
            apiKey: onemapApiKey,
          },
        }
      );

      if (response.data.results.length === 0) {
        return res.status(400).json({ message: "Location not found." });
      }

      const { LATITUDE, LONGITUDE } = response.data.results[0];

      pin = new Pin({
        title,
        description,
        latitude: LATITUDE,
        longitude: LONGITUDE,
        postid: post.id,
      });

      await pin.save();
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  } else {
    return res.status(404).send("the post cannot be created");
  }

  // try {
  //   const sess = await mongoose.startSession();
  //   sess.startTransaction();
  //   await post.save({ session: sess }); // save the place
  //   await sess.commitTransaction(); // only at this point will the final record be stored in db
  // } catch (err) {
  //   const error = new HttpError("Creating post failed, please retry.", 500);
  //   return next(error);
  // }

  res.send([pin, post]);
});

//update post found by id and if post has been resolved, remove pin from map
//keep resolved post for history
router.put("/:id", uploadOptions.array("images", 4), async (req, res) => {
  // check if the id in the url is valid
  if (!mongoose.isValidObjectId(req.params.id)) {
    res.status(400).send("Invalid Post ID");
  }

  const category = await Category.findById(req.body.category);
  if (!category) return res.status(400).send("invalid Category");

  let postcheck;
  try {
    postcheck = await Post.findById(req.params.id);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong could not update post.",
      500
    );
    return next(error);
  }

  const post = await Post.findById(req.params.id);
  if (!post) return res.status(400).send("invalid post");
  const files = req.files;
  const basePath = `${req.protocol}://${req.get("host")}/public/uploads/`;

  let imagePaths = [];
  if (files) {
    files.map((file) => {
      imagePaths.push(`${basePath}${file.filename}`);
    });
  } else {
    imagePaths = post.images;
  }
  const updatedPost = await Post.findByIdAndUpdate(
    req.params.id,
    {
      itemName: req.body.itemName,
      isLost: req.body.isLost,
      location: req.body.location,
      listedBy: req.body.listedBy,
      date: req.body.date,
      time: req.body.time,
      itemDescription: req.body.itemDescription,
      category: req.body.category,
      isResolved: req.body.isResolved,
    },
    { new: true }
  );

  if (!updatedPost) {
    return res.status(404).send("the post cannot be updated");
  }
  if (updatedPost.isResolved === true) {
    Pin.findOneAndDelete({ postid: req.params.id }).then((pin) => {
      if (pin) {
        return res
          .status(200)
          .json({ success: true, message: "post is deleted" });
      } else {
        return res
          .status(404)
          .json({ success: false, message: "pin not found" });
      }
    });
  } else {
    const title = updatedPost.itemName;
    const description = updatedPost.itemDescription;
    const location = updatedPost.location;
    if (!title || !description || !location) {
      return res.status(400).json({
        message: "Please provide a title, description, and location.",
      });
    }

    // Geocode the location using the OneMap API
    try {
      const response = await axios.get(
        "https://developers.onemap.sg/commonapi/search",
        {
          params: {
            searchVal: location,
            returnGeom: "Y",
            getAddrDetails: "N",
            pageNum: 1,
            apiKey: onemapApiKey,
          },
        }
      );

      if (response.data.results.length === 0) {
        return res.status(400).json({ message: "Location not found." });
      }

      const { LATITUDE, LONGITUDE } = response.data.results[0];

      const updatedPin = await Pin.findOneAndUpdate(
        { postid: req.params.id },
        {
          title: title,
          location: location,
          latitude: LATITUDE,
          longitude: LONGITUDE,
          postid: req.params.id,
        },
        { new: true }
      );

      res.send([updatedPin, updatedPost]);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
});

//delete post found by id
router.delete("/:id", async (req, res) => {
  let post;
  try {
    post = await Post.findById(req.params.id);
  } catch (err) {
    const error = new HttpError(" no post found, please retry.", 500);
    return next(error);
  }

  let user;
  try {
    user = await User.findById(post.listedBy);
  } catch (err) {
    const error = new HttpError(" no user found, please retry.", 500);
    return next(error);
  }
  let postList = user.posts;
  console.log(user);
  const index = postList.indexOf(req.params.id);
  user.posts = postList.splice(index, 1);
  user.save();
  Post.findByIdAndRemove(req.params.id)
    .then((post) => {
      if (post) {
        Pin.findOneAndDelete({ postid: req.params.id }).then((pin) => {
          if (pin) {
            return res
              .status(200)
              .json({ success: true, message: "post is deleted" });
          } else {
            return res
              .status(404)
              .json({ success: false, message: "pin not found" });
          }
        });
      } else {
        return res
          .status(404)
          .json({ success: false, message: "post not found" });
      }
    })
    .catch((err) => {
      return res.status(400).json({ success: false, error: err });
    });
});

// get the count of posts
router.get("/count", async (req, res) => {
  let postCount;
  try {
    postCount = await Post.find().countDocuments({});
    if (!postCount) {
      res.status(404).json({ success: false, message: "No posts found" });
    } else {
      res.send({ count: postCount });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

//display  unresolved posts
router.get("/get/UrgentPosts", async (req, res) => {
  const posts = await Post.find({ isResolved: false });
  if (!posts) {
    res.status(500).json({ success: false });
  }
  res.send(posts);
});

//display found posts
router.get("/get/FoundPosts", async (req, res) => {
  const foundPosts = await Post.find({ isResolved: false, isLost: false });
  if (!foundPosts) {
    res.status(500).json({ success: false });
  }
  res.send(foundPosts);
});

//display lost posts
router.get("/get/LostPosts", async (req, res) => {
  const lostPosts = await Post.find({ isResolved: false, isLost: true });
  if (!lostPosts) {
    res.status(500).json({ success: false });
  }
  res.send(lostPosts);
});

//display user posts
router.get("/userposts/:userid", async (req, res) => {
  const userPosts = await Post.find({ listedBy: req.params.userid })
    .populate("category")
    .sort({ date: -1 });
  if (!userPosts) {
    res.status(500).json({ success: false });
  }
  res.send(userPosts);
});

module.exports = router;
