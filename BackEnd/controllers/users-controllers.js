const { User } = require("../models/user");
const { Post } = require("../models/post");
const { Request } = require("../models/request");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

/**
 * Retrieve a single user by ID.
 * @async
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise} - A promise that resolves to the user object.
 */
const getUserId = async (req, res, next) => {
  let user;
  try {
    user = await User.findById(req.params.id).select("-passwordHash");
  } catch (err) {
    return res
      .status(500)
      .send({ message: "Fetching of specified user failed, please retry." });
  }

  if (!user) {
    res.status(500).json({ success: false });
  }
  res.send(user);
};

/**
 * Retrieve a list of all users sorted by credit score.
 * @async
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise} - A promise that resolves to an array of user objects.
 */
const getUserList = async (req, res, next) => {
  let userList;
  try {
    userList = await User.find()
      .sort({ creditScore: -1 })
      .select("-passwordHash");
    if (!userList) {
      res.status(500).json({ success: false });
    }
  } catch (err) {
    return res
      .status(500)
      .send({ message: "Fetching user list failed, please retry." });
  }
  res.send(userList);
};

/**
 * Create a new user.
 * @async
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise} - A promise that resolves to the newly created user object.
 */
const registerUser = async (req, res, next) => {
  let existingUser;
  try {
    existingUser = await User.findOne({ email: req.body.email });
  } catch (err) {
    return res
      .status(500)
      .send({ message: "Signing up failed as user exists, please retry" });
  }

  if (existingUser) {
    return res
      .status(422)
      .send({ message: "User exists already, please login instead." });
  }
  const secret = process.env.secret;
  let user = new User({
    name: req.body.name,
    email: req.body.email,
    passwordHash: bcrypt.hashSync(req.body.password, 10),
    phone: req.body.phone,
  });
  try {
    user = await user.save();
    if (!user) {
      return res.status(404).send({ message: "the user cannot be created" });
    }
  } catch (err) {
    return res
      .status(500)
      .send({ message: "Signing up failed, please retry." });
  }

  res.status(201).send(user);
};

/**
 * Log in a user with email and password.
 * @async
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise} - A promise that resolves to an object containing user email, token, and ID.
 */
const loginUser = async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  const secret = process.env.secret;
  if (!user) {
    return res.status(401).send({ message: "User not found" });
  }
  let token;
  if (user && bcrypt.compareSync(req.body.password, user.passwordHash)) {
    token = jwt.sign(
      {
        userId: user.id,
      },
      secret
      //{expiresIn:"1d"} for eg, jwt token expires in 1day
    );
    res.status(200).send({ user: user.email, token: token, id: user.id });
  } else {
    res.status(401).send({ message: "Password is wrong" });
  }
};

/**
 * Log out a user with user ID.
 * @async
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise} - A promise that resolves to a success message.
 */
const logoutUser = async (req, res) => {
  // Get the user ID from the request object
  const userId = req.body.userId;

  // Remove the token associated with the user from the database
  try {
    const user = await User.findByIdAndUpdate(
      userId,
      { $unset: { token: 1 } },
      { new: true }
    );
    res.status(200).send({ message: "Logout successful" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Internal server error" });
  }
};

/**
 * Update user information by user ID.
 * @async
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise} - A promise that resolves to the updated user object.
 */
const updateUser = async (req, res, next) => {
  try {
    let updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        email: req.body.email,
        passwordHash: bcrypt.hashSync(req.body.password, 10),
        phone: req.body.phone,
      },
      { new: true }
    );
    if (!updatedUser) {
      return res.status(404).send({ message: "user cannot be updated" });
    }
    res.status(201).send(updatedUser);
  } catch (err) {
    return res.status(500).send({ message: "no user found, please retry." });
  }
};

/**
 * Edit the credit score of a user by user ID.
 * @async
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise} - A promise that resolves to the updated user object.
 */
const editCreditScore = async (req, res, next) => {
  try {
    user = await User.findById(req.params.id).select("-passwordHash");
    let updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        name: user.name,
        email: user.email,
        passwordHash: user.passwordHash,
        phone: user.phone,
        creditScore: req.body.amount + user.creditScore,
      },
      { new: true }
    );
    if (!updatedUser) {
      return res.status(404).send({ message: "user cannot be updated" });
    }
    res.status(201).send(updatedUser);
  } catch (err) {
    return res.status(500).send({ message: "no user found, please retry." });
  }
};

/**
Finds users by name using a case sensitive search and returns their name, email, phone, and posts
@function
@async
@param {Object} req - Express request object
@param {string} req.params.name - Name to search for
@param {Object} res - Express response object
@returns {Object} Returns an object containing name, email, phone, and posts of the found users or an error message
*/
const findUserByName = async (req, res, next) => {
  let data;
  try {
    data = await User.find({
      $or: [{ name: { $regex: req.params.name } }],
    }).select({ name: 1, email: 1, phone: 1, posts: 1 });
  } catch (err) {
    return res
      .status(500)
      .send({ message: "Could not find the specified user given the name." });
  }
  res.status(201).send(data);
};

/**
 * Deletes a user with the specified ID from the database.
 *
 * @param req the HTTP request object containing the ID of the user to delete
 * @param res the HTTP response object that will contain the result of the operation
 * @param next the next middleware function in the chain
 * @return the HTTP response object indicating the success or failure of the operation
 * @throws Error if an error occurs while deleting the user or if the user does not exist
 */
const deleteUser = async (req, res) => {
  let user = await User.findById(req.params.id);
  if (!user) {
    return res.status(400).send("invalid user");
  }
  let postList = user.posts;
  if (postList.length > 0) {
    for (let index = 0; index < postList.length; index++) {
      const delpostid = postList[index].toString();
      console.log(delpostid);
      Post.findByIdAndRemove(delpostid).then((post) => {
        if (!post) {
          return res
            .status(404)
            .json({ success: false, message: "user not found" });
        }
      });
    }
  }
  User.findByIdAndRemove(req.params.id)
    .then((user) => {
      if (user) {
        return res
          .status(200)
          .json({ success: true, message: "User is deleted" });
      } else {
        return res
          .status(404)
          .json({ success: false, message: "User not found" });
      }
    })
    .catch((err) => {
      return res.status(400).json({ success: false, error: err });
    });
};

/**

Retrieves all the posts associated with a specific user ID and returns them
in descending order by creation date/time.
@param {object} req - The HTTP request object
@param {object} res - The HTTP response object
@returns {object} - The HTTP response object with an array of the user's posts
*/
const displayUserPosts = async (req, res) => {
  const { userid } = req.params;
  const { category } = req.query;

  const filter = new RegExp(userid, 'i');

  const userPosts = await Post.find({ listedby: {name: filter} })
    .populate("category")
    .populate("listedBy")
    .sort({ date: -1 });

  if (!userPosts) {
    res.status(500).json({ success: false });
  }

  let postData;
  postData = userPosts.filter((item) => {
    return item.category &&  item.category.name && item.category.name === category;
  })

  res.send(postData);
};

/**
 * Displays a report of a user's information and posts.
 *
 * @function
 * @async
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<Object>} An object containing the user's information and posts.
 * @throws {Error} If there is an error fetching the user's information or posts.
 */
const displayUserReports = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(500).json({ message: 'invalidUser' });
  }

  const reportAgainst = user.gotReported;
  const reportby = user.reportedOthers;
  res.send([reportAgainst, reportby]);
};

/**
Displays the report information of a specified user including reports made against them
@function
@async
@param {Object} req - Express request object
@param {string} req.params.id - The ID of the user to display reports for
@param {Object} res - Express response object
@returns {Object} Returns an array containing report information of the specified user or an error message
*/
const displayUserReportsReceived = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(500).json({ message: 'invalidUser' });
  }

  const reportAgainst = user.gotReported;
  res.send(reportAgainst);
};

/**
Displays all posts that have been marked as resolved by a specified user
@function
@async
@param {Object} req - Express request object
@param {string} req.params.id - The ID of the user to display resolved posts for
@param {Object} res - Express response object
@returns {Object} Returns an array containing resolved posts of the specified user or an error message
*/
const displayResolvedPosts = async (req, res) => {
  const resolvedPost = await Post.find({
    listedby: req.params.id,
    isResolved: "True",
  });
  if (!resolvedPost) {
    res.status(500).json({ success: false });
  }
  res.send(resolvedPost);
};

/**
Displays all posts that have been found by a specified user
@function
@async
@param {Object} req - Express request object
@param {string} req.params.id - The ID of the user to display found posts for
@param {Object} res - Express response object
@returns {Object} Returns an array containing found posts of the specified user or an error message
*/
const displayFoundPosts = async (req, res) => {
  const foundPost = await Post.find({ finder: req.params.id });
  if (!foundPost) {
    res.status(500).json({ success: false });
  }
  res.send(foundPost);
};


/**
Displays all requests sent or received by a specified user
@function
@async
@param {Object} req - Express request object
@param {string} req.params.id - The ID of the user to display requests for
@param {Object} res - Express response object
@returns {Object} Returns an array containing all requests of the specified user or an error message
*/
const displayAllUserRequests = async (req, res) => {
  const request = await Request.find({
    $or: [{ sender: req.params.id }, { recipient: req.params.id }],
  })
    .populate("sender")
    .populate("recipient")
    .populate("post");
  if (!request) {
    res.status(500).json({ success: false });
  }
  res.send(request);
};

/**
Displays all requests sent by a specified user
@function
@async
@param {Object} req - Express request object
@param {string} req.params.id - The ID of the user to display requests for
@param {Object} res - Express response object
@returns {Object} Returns an array containing all requests made by the specified user or an error message
*/
const displayUserMadeRequests = async (req, res) => {
  const request = await Request.find({ sender: req.params.id })
    .populate("sender")
    .populate("recipient")
    .populate("post");
  if (!request) {
    res.status(500).json({ success: false });
  }
  res.send(request);
};

/**
 * Retrieves all requests received by a user with the specified ID, where the state of the request is 0 (i.e., pending).
 *
 * @param {Object} req - The HTTP request object.
 * @param {Object} req.params - The URL parameters sent with the request.
 * @param {string} req.params.id - The ID of the user whose received requests are being retrieved.
 * @param {Object} res - The HTTP response object.
 * @returns {Object} An array of Request objects received by the specified user, where the state of the request is 0 (i.e., pending).
 * @throws {Error} If an error occurs while retrieving the requests.
 */
const displayUserRecievedRequests = async (req, res) => {
  const request = await Request.find({ recipient: req.params.id, state: 0})
    .populate("sender")
    .populate("recipient")
    .populate("post");
  if (!request) {
    res.status(500).json({ success: false });
  }
  res.send(request);
};

module.exports = {
  getUserId,
  getUserList,
  registerUser,
  loginUser,
  logoutUser,
  updateUser,
  editCreditScore,
  findUserByName,
  displayUserPosts,
  deleteUser,
  displayUserReports,
  displayResolvedPosts,
  displayFoundPosts,
  displayAllUserRequests,
  displayUserRecievedRequests,
  displayUserMadeRequests,
  displayUserReportsReceived,
};
