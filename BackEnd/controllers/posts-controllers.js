const { Post } = require("../models/post");
const { Category } = require("../models/category");
const { Request } = require("../models/request");
const mongoose = require("mongoose");
const { User } = require("../models/user");
const axios = require("axios");
const { onemapApiKey } = require("../helpers/config");
const { request } = require("express");

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
const uploadPost = async (req, res) => {
  const category = await Category.findById(req.body.category);
  if (!category) return res.status(400).send({ message: "invalid Category" });
  const files = req.files;
  const basePath = `${req.protocol}://${req.get("host")}/public/uploads/`;
  let imagePaths = [];
  if (files) {
    files.map((file) => {
      imagePaths.push(`${basePath}${file.filename}`);
    });
  } else {
    return res.status(400).send({ message: "No image in the request" });
  }

  let location = req.body.location;
  // Geocode the location using the OneMap API
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
  let post = new Post({
    itemName: req.body.itemName,
    isLost: req.body.isLost,
    images: imagePaths,
    listedBy: req.body.listedBy,
    location: location,
    date: req.body.date,
    time: req.body.time,
    itemDescription: req.body.itemDescription,
    category: req.body.category,
    isResolved: req.body.isResolved,
    latitude: LATITUDE,
    longitude: LONGITUDE,
  });
  console.log(imagePaths);
  if (post.isResolved === true) {
    return res.status(404).send({ message: "the post cannot be created" });
  }
  let user = await User.findById(post.listedBy);
  if (!user) {
    return res.status(400).send("invalid user");
  }
  post = await post.save();
  let postList = user.posts;
  postList.push(post.id);
  user.posts = postList;
  user.save();
  res.send(post);
};

//update post found by id and if post has been resolved, remove pin from map
//keep resolved post for history
const updatePostById = async (req, res) => {
  // check if the id in the url is valid
  if (!mongoose.isValidObjectId(req.params.id)) {
    res.status(400).send("Invalid Post ID");
  }

  const category = await Category.findById(req.body.category);
  if (!category) return res.status(400).send("invalid Category");

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
  let location = req.body.location;
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
  let isResolved;
  //find the request that has been verified ie, state = 1
  let request = await Request.find({ post: req.params.id, state: 1 });
  if (!request) {
    isResolved = false;
  } else {
    if (request.state === 1) {
      isResolved = true;
    } else {
      isResolved = false;
    }
  }
  if (isResolved === true) {
    const updatedPost = await Post.findByIdAndUpdate(
      req.params.id,
      {
        itemName: req.body.itemName,
        isLost: req.body.isLost,
        location: location,
        listedBy: req.body.listedBy,
        date: req.body.date,
        time: req.body.time,
        itemDescription: req.body.itemDescription,
        category: req.body.category,
        latitude: LATITUDE,
        longitude: LONGITUDE,
        isResolved: isResolved,
        finder: request.sender,
      },
      { new: true }
    );
    if (!updatedPost) {
      return res.status(404).send("the post cannot be updated");
    }
    finderUser = await User.findById(updatedPost.finder);
    if (!finderUser) {
      return res.status(400).json({ message: "Finder not found." });
    }
    finderUser.creditScore = finderUser.creditScore + 1;
    let foundPosts = finderUser.foundPosts;
    let check = 0;
    for (let index = 0; index < foundPosts.length; index++) {
      const element = foundPosts[index];
      if (element.toString() === req.params.id) {
        check = 1;
      }
    }
    console.log(check);
    if (check != 1) {
      foundPosts.push(req.params.id);
      finderUser.foundPosts = foundPosts;
      finderUser.save();
    }

    res.send(updatedPost);
  } else {
    const updatedPost = await Post.findByIdAndUpdate(
      req.params.id,
      {
        itemName: req.body.itemName,
        isLost: req.body.isLost,
        location: location,
        listedBy: req.body.listedBy,
        date: req.body.date,
        time: req.body.time,
        itemDescription: req.body.itemDescription,
        category: req.body.category,
        latitude: LATITUDE,
        longitude: LONGITUDE,
        isResolved: isResolved,
      },
      { new: true }
    );
    if (!updatedPost) {
      return res.status(404).send("the post cannot be updated");
    }
    res.send(updatedPost);
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
    return res.status(500).send({ message: "no user found, please retry." });
  }
  let postList = user.posts;
  const index = postList.indexOf(req.params.id);
  console.log(postList);
  console.log(index);
  let removed = postList.splice(index, 1);
  user.posts = postList;
  console.log(user.posts);
  user = await user.save();
  console.log(user.posts);

  let request = await Request.find({ post: req.params.id });
  if (request) {
    Request.deleteMany({ post: req.params.id }).then((request) => {
      if (request) {
        console.log("requests tagged to this post deleted");
      } else {
        console.log("no request found");
      }
    });
  }
  Post.findByIdAndRemove(req.params.id).then((post) => {
    if (post) {
      return res
        .status(200)
        .json({ success: true, message: "post is deleted" });
    } else {
      return res
        .status(404)
        .json({ success: false, message: "post not found" });
    }
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

//display all unresolved posts
const getUnresolvedPosts = async (req, res) => {
  const urgentPost = await Post.find({ isResolved: false });
  if (!urgentPost) {
    res.status(500).json({ success: false });
  }
  res.send(urgentPost);
};

//display all found posts
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
const searchPosts = async (req, res) => {
  const { name } = req.params;
  const { category } = req.query;

  let data;
  try {
    const filter = new RegExp(name, "i");

    data = await Post.find({
      $or: [{ itemName: filter }],
    })
      .populate("category")
      .populate({ path: "listedBy", select: { name: 1, phone: 1 } });   
  } catch (err) {
    return res
      .status(500)
      .send({ message: "Could not find the specified post." });
  }

  if (category) {
    data = await data.filter((item) => {
      return item.category && item.category.id === category;
    });
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
