const { Post } = require("../models/post");
const { Category } = require("../models/category");
const mongoose = require("mongoose");
const HttpError = require("../models/http-error");
const { User } = require("../models/user");
const Pin = require("../models/pinmodel");
const axios = require("axios");
const { onemapApiKey } = require("../helpers/config");


// show all posts or filtered by category posts
const showAllPosts = async (req, res) => {
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
};
//show post found by id, can use .select(<attribute>) to show selected attribute
const getPostById = async (req, res) => {
  const post = await Post.findById(req.params.id)
    .populate("category")
    .populate({ path: "listedBy", select: { name: 1, phone: 1 } });
  if (!post) {
    res.status(500).json({ success: false });
  }
  res.send(post);
};
// upload new post
const uploadPost =
  async (req, res, next) => {
    const category = await Category.findById(req.body.category);
    if (!category) return res.status(400).send({message:"invalid Category"});
    const files = req.files;
    const basePath = `${req.protocol}://${req.get("host")}/public/uploads/`;
    let imagePaths = [];
    if (files) {
      files.map((file) => {
        imagePaths.push(`${basePath}${file.filename}`);
      });
    } else {
      return res.status(400).send({message:"No image in the request"});
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
      return res.status(404).send({message:"the post cannot be created"});
    }
    //We also need to ensure that if there exists a userid with the provided id
    let user;
    let pin;
    try {
      user = await User.findById(post.listedBy);
    } catch (err) {
      return res.status(500).send({message:"Creating place failed, please retry."});
    }

    if (!user) {
      return res.status(404).send({message:"Could not find user for the provided id"});
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
      return res.status(404).send({message:"the post cannot be created"});
    }

    res.send([pin, post]);
  };

//update post found by id and if post has been resolved, remove pin from map
//keep resolved post for history
const updatePostById =
  async (req, res) => {
    // check if the id in the url is valid
    if (!mongoose.isValidObjectId(req.params.id)) {
      res.status(400).send({message:"Invalid Post ID"});
    }

    const category = await Category.findById(req.body.category);
    if (!category) return res.status(400).send({message:"invalid Category"});

    let postcheck;
    try {
      postcheck = await Post.findById(req.params.id);
    } catch (err) {
      return res.status(500).send({message:"Something went wrong could not update post."});
    }

    const post = await Post.findById(req.params.id);
    if (!post) return res.status(400).send({message:"invalid post"});
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
      return res.status(404).send({message:"the post cannot be updated"});
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
            description: description,
          },
          { new: true }
        );

        res.send([updatedPin, updatedPost]);
      } catch (err) {
        res.status(500).json({ message: err.message });
      }
    }
  };

//delete post found by id
const deletePostById = async (req, res, next) => {
  let post;
  try {
    post = await Post.findById(req.params.id);
  } catch (err) {
    return res.status(500).send("no post found, please retry.");
  }

  let user;
  try {
    user = await User.findById(post.listedBy);
  } catch (err) {
    return res.status(500).send({message:"no user found, please retry."});
  }
  let postList = user.posts;
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
};

// get the count of posts
const getPostCount = async (req, res) => {
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
};

//display  unresolved posts
const getUnresolvedPosts = async (req, res) => {
  const urgentPost = await Post.find({ isResolved: "false" });
  if (!urgentPost) {
    res.status(500).json({ success: false });
  }
  res.send(urgentPost);
};

//display found posts
const getFoundPosts = async (req, res) => {
  const foundPosts = await Post.find({ isResolved: false, isLost: false });
  if (!foundPosts) {
    res.status(500).json({ success: false });
  }
  res.send(foundPosts);
};

//display lost posts
const getLostPosts = async (req, res) => {
  const lostPosts = await Post.find({ isResolved: false, isLost: true });
  if (!lostPosts) {
    res.status(500).json({ success: false });
  }
  res.send(lostPosts);
};

//display user posts
const getUserPosts = async (req, res) => {
  const userPosts = await Post.find({ listedBy: req.params.userid })
    .populate("category")
    .sort({ date: -1 });
  if (!userPosts) {
    res.status(500).json({ success: false });
  }
  res.send(userPosts);
};

// Search posts
const searchPosts = async (req, res, next) => {
  const { name } = req.params;
  const { category, listedBy } = req.query;

  let data;
  try {
    const filter = new RegExp(name, "i");
    const categoryFilter = category
      ? mongoose.Types.ObjectId(category)
      : undefined;
    const listedByFilter = listedBy
      ? { $regex: listedBy, $options: "i" }
      : undefined;

    data = await Post.find({
      $or: [
        { itemName: filter },
        { category: categoryFilter },
        { listedBy: listedByFilter },
      ],
    })
      .populate("category")
      .populate({ path: "listedBy", select: { name: 1, phone: 1 } });
  } catch (err) {
    return res.status(500).send({message:"Could not find the specified post."});
  }
  res.status(201).send(data);
};

module.exports = {
  showAllPosts,
  getPostById,
  uploadPost,
  updatePostById,
  deletePostById,
  getPostCount,
  getUnresolvedPosts,
  getFoundPosts,
  getLostPosts,
  getUserPosts,
  searchPosts,
};
