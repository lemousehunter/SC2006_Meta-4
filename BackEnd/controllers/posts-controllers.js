
/**
Requires the Post, Category, Request, and User models along with axios, mongoose, and onemapApiKey.
@module controllers/postController
*/
const { Post } = require("../models/post");
const { Category } = require("../models/category");
const { Request } = require("../models/request");
const mongoose = require("mongoose");
const { User } = require("../models/user");
const axios = require("axios");
const { onemapApiKey } = require("../helpers/config");
const { request } = require("express");


/**
Retrieve all posts, optionally filtered by category.
@function
@async
@param {Object} req - Express request object
@param {Object} res - Express response object
@param {string} req.query.categories - A comma-separated string of category IDs to filter by
@returns {Object} - List of Post objects
*/
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

/**
Retrieve a Post object by ID.
@function
@async
@param {Object} req - Express request object
@param {Object} res - Express response object
@param {string} req.params.id - ID of the Post object to retrieve
@returns {Object} - A Post object
*/
const getPostById = async (req, res) => {
  const post = await Post.findById(req.params.id)
    .populate("category")
    .populate({ path: "listedBy", select: { name: 1, phone: 1 } });
  if (!post) {
    res.status(500).json({ success: false });
  }
  res.send(post);
};

/**
Upload a new Post object to the database.
@function
@async
@param {Object} req - Express request object
@param {Object} res - Express response object
@param {string} req.body.itemName - Name of the item being posted
@param {boolean} req.body.isLost - Whether the item is lost or found
@param {Array} req.files - Array of image files
@param {string} req.body.listedBy - ID of the User who created the post
@param {string} req.body.location - Location of the item
@param {string} req.body.date - Date the item was lost or found
@param {string} req.body.time - Time the item was lost or found
@param {string} req.body.itemDescription - Description of the item
@param {string} req.body.category - ID of the Category the item belongs to
@returns {Object} - The created Post object
*/
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
    isResolved: false,
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

/**
 * Updates a post by its ID.
 *
 * @param {Object} req - Express request object
 * @param {Object} req.params - URL parameters, should contain the ID of the post to update
 * @param {Object} req.body - Request body containing the updated post information
 * @param {Array} req.files - Array of files uploaded with the request
 * @param {Object} res - Express response object
 *
 * @throws {Error} If the post ID in the URL is invalid, a 400 Bad Request error is returned
 * @throws {Error} If the provided category ID is invalid, a 400 Bad Request error is returned
 * @throws {Error} If the specified post cannot be found, a 400 Bad Request error is returned
 *
 * @returns {Object} The updated post object
 */
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
        itemName: post.itemName,
        isLost: post.isLost,
        location: location,
        listedBy: post.listedBy,
        date: post.date,
        time: post.time,
        itemDescription: post.itemDescription,
        category: post.category,
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

/**
 * Deletes a post with the specified ID.
 *
 * @param {ObjectID} id - The ID of the post to delete.
 * @returns {Promise} - A promise that resolves with the deleted post if the deletion is successful, or rejects with an error if not.
 * @throws {Error} - If the ID parameter is not a valid ObjectId or if the post does not exist.
 */
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

/**
 * Retrieves the count of all posts in the database.
 * @param req the request object
 * @param res the response object
 * @throws Error if there is a server error
 */
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


/**
 * Retrieves all unresolved posts from the database.
 * 
 * @param req the HTTP request object
 * @param res the HTTP response object
 * @return a list of unresolved posts
 * @throws HTTP 500 error if the server encounters an error while processing the request
 */
const getUnresolvedPosts = async (req, res) => {
  const urgentPost = await Post.find({ isResolved: false })
    .populate("category")
    .populate({ path: "listedBy", select: { name: 1, phone: 1 } });
  if (!urgentPost) {
    res.status(500).json({ success: false });
  }
  res.send(urgentPost);
};


/**
 * Retrieve all posts that are marked as found and unresolved.
 * Populates the "category" and "listedBy" fields of each post with the corresponding documents.
 * Sends the retrieved posts to the client as a response.
 * 
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * 
 * @throws {Error} Will throw an error if an unexpected error occurs while retrieving the posts.
 * 
 * @return {Object} A JSON response containing the retrieved posts or an error message.
 */

const getFoundPosts = async (req, res) => {
  const foundPosts = await Post.find({ isResolved: false, isLost: false })
    .populate("category")
    .populate({ path: "listedBy", select: { name: 1, phone: 1 } });
  if (!foundPosts) {
    res.status(500).json({ success: false });
  }
  res.send(foundPosts);
};

/**
 * Retrieves all the lost posts that are currently unresolved from the database.
 * Populates the category and listedBy fields of each post with the corresponding
 * category and user documents. Sends the retrieved data as a response to the client.
 * 
 * @param req the HTTP request sent by the client
 * @param res the HTTP response to be sent to the client
 * @return the retrieved lost posts if successful, an error message if unsuccessful
 * @throws Error if there is a server error while processing the request
 */
const getLostPosts = async (req, res) => {
  const lostPosts = await Post.find({ isResolved: false, isLost: true })
    .populate("category")
    .populate({ path: "listedBy", select: { name: 1, phone: 1 } });
  if (!lostPosts) {
    res.status(500).json({ success: false });
  }
  res.send(lostPosts);
};

/**
Retrieves userpost from the database and sends them as a response to the client.
@param req - The request object representing the HTTP request.
@param res - The response object representing the HTTP response.
@returns An array of userpost or an error response.
@throws An error response with status 500 if there is a server error.
*/
const getUserPosts = async (req, res) => {
  const userPosts = await Post.find({ listedBy: req.params.userid })
    .populate("category")
    .populate({ path: "listedBy", select: { name: 1, phone: 1 } })
    .sort({ date: -1 });
  if (!userPosts) {
    res.status(500).json({ success: false });
  }
  res.send(userPosts);
};

/**
Retrieves all unresolved posts from the database and sends them as a response to the client.
@param req - The request object representing the HTTP request.
@param res - The response object representing the HTTP response.
@returns An array of unresolved posts or an error response.
@throws An error response with status 500 if there is a server error.
*/
const getUserUnresolvedPosts = async (req, res) => {
  const userUnresolvedPosts = await Post.find({
    listedBy: req.params.userid,
    isResolved: false,
  })
    .populate("category")
    .populate({ path: "listedBy", select: { name: 1, phone: 1 } });
  if (!userUnresolvedPosts) {
    res.status(500).json({ success: false });
  }
  res.send(userUnresolvedPosts);
};

/**
Retrieves all resolved posts from the database and sends them as a response to the client.
@param req - The request object representing the HTTP request.
@param res - The response object representing the HTTP response.
@returns An array of resolved posts or an error response.
@throws An error response with status 500 if there is a server error.
*/
const getUserResolvedPosts = async (req, res) => {
  const userResolvedPosts = await Post.find({
    listedBy: req.params.userid,
    isResolved: true,
  })
    .populate("category")
    .populate({ path: "listedBy", select: { name: 1, phone: 1 } });
  if (!userResolvedPosts) {
    res.status(500).json({ success: false });
  }
  res.send(userResolvedPosts);
};

/**
 * Search for posts by name and category.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Object} - The data of the found posts.
 */
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
  getUserUnresolvedPosts,
  getUserResolvedPosts,
};
