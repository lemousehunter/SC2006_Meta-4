const { Post } = require("../models/post");
const express = require("express");
const { Category } = require("../models/category");
const router = express.Router();
const mongoose = require("mongoose");
const { User } = require("../models/user");
const multer = require("multer");
const HttpError = require("../models/http-error");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads");
  },
  filename: function (req, file, cb) {
    const fileName = file.originalname.replace(" ", "-");
    cb(null, file.fieldname + "-" + Date.now());
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
router.post(`/`, uploadOptions.single("image"), async (req, res, next) => {
  const category = await Category.findById(req.body.category);
  if (!category) return res.status(400).send("invalid Category");
  const fileName = req.file.filename;
  const basePath = `${req.protocol}://${req.get("host")}/public/uploads/`;
  let post = new Post({
    itemName: req.body.itemName,
    isLost: req.body.isLost,
    image: `${basePath}${fileName}`,
    location: req.body.location,
    listedBy: req.body.listedBy,
    date: req.body.date,
    time: req.body.time,
    itemDescription: req.body.itemDescription,
    category: req.body.category,
    isResolved: req.body.isResolved,
  });

  // We also need to ensure that if there exists a userid with the provided id
  let user;

  try {
    user = await User.findById(listedBy);
  } catch (err) {
    const error = new HttpError(' Creating place failed, please retry.', 500);
    return next(error);
  }

  if (!user) {
    const error = new HttpError('Could not find user for the provided id', 404);
    return next(error);
  }

  // post = await post.save();
  // if (!post) {
  //   return res.status(404).send("the post cannot be created");
  // }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await post.save({ session: sess}); // save the place
    await sess.commitTransaction(); // only at this point will the final record be stored in db
  } catch(err) {
    const error = new HttpError('Creating post failed, please retry.', 500);
    return next(error);
  }

  res.send(post);
});
//update post found by id and if post has been resolved, remove it from listing
router.put("/:id", async (req, res, next) => {
  // check if the id in the url is valid
  if (!mongoose.isValidObjectId(req.params.id)) {
    res.status(400).send("Invalid Post ID");
  }
  const category = await Category.findById(req.body.category);
  if (!category) return res.status(400).send("invalid Category");

  // Since the place has a listedBy field, if the creator of post != user trying to access this put function, then deny auth
  let postcheck;
  try {
    postcheck = await Post.findById(req.params.id);
  } catch(err) {
    const error = new HttpError('Something went wrong could not update post.', 500);
    return next(error);
  }
  if (postcheck.listedBy.toString() !== req.userData.userId) {
    const error = new HttpError('You are not allowed to edit this place.', 401); // 401 is auth error code
    return next(error);
  }

  const post = await Post.findByIdAndUpdate(
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
  if (!post) {
    return res.status(404).send("the post cannot be updated");
  }
  if (post.isResolved === true) {
    Post.findByIdAndDelete(post.id);
    return res.status(200).send("Post has been resolved");
  }
  res.send(post);
});
//delete post found by id
router.delete("/:id", (req, res) => {
  Post.findByIdAndRemove(req.params.id)
    .then((post) => {
      if (post) {
        return res
          .status(200)
          .json({ success: true, message: "post is deleted" });
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
