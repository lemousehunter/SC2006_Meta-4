const { User } = require("../models/user");
const { Post } = require("../models/post");
const Pin = require("../models/pinmodel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const HttpError = require("../models/http-error");
const { Report } = require("../models/report");

//get single user by ID
const getUserId = async (req, res, next) => {
  let user;
  try {
    user = await User.findById(req.params.id).select("-passwordHash");
  } catch (err) {
    return res.status(500).send({message:"Fetching of specified user failed, please retry."});
  }

  if (!user) {
    res.status(500).json({ success: false });
  }
  res.send(user);
};

//get list of user
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
    return res.status(500).send({message:"Fetching user list failed, please retry."});
  }
  res.send(userList);
};

// create new User localhost://3000/users/
const registerUser = async (req, res, next) => {
  let existingUser;
  try {
    existingUser = await User.findOne({ email: req.body.email });
  } catch (err) {
    return res.status(500).send({message:"Signing up failed as user exists, please retry"});
  }

  if (existingUser) {
    return res.status(422).send({message:"User exists already, please login instead."});
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
      return res.status(404).send({message:"the user cannot be created"});
    }
  } catch (err) {
    return res.status(500).send({message:"Signing up failed, please retry."});
  }

  res.status(201).send(user);
};

// Log in user by taking in email and password as input in body
const loginUser = async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  const secret = process.env.secret;
  if (!user) {
    return res.status(401).send({message:"User not found"});
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
    res.status(401).send({message:"Password is wrong"});
  }
};

// Log out user by using userId as input in body
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
    res.status(200).send({message:"Logout successful"});
  } catch (error) {
    console.error(error);
    res.status(500).send({message:"Internal server error"});
  }
};

// Update user information 
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
      return res.status(404).send({message:"user cannot be updated"});
    }
    res.status(201).send(updatedUser);
  } catch (err) {
    return res.status(500).send({message:"no user found, please retry."});
  }
};

// change creditScore
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
      return res.status(404).send({message:"user cannot be updated"});
    }
    res.status(201).send(updatedUser);
  } catch (err) {
    return res.status(500).send({message:"no user found, please retry."});
  }
};

// Search via name (Case sensitive)
const findUserByName = async (req, res, next) => {
  let data;
  try {
    data = await User.find({
      $or: [{ name: { $regex: req.params.name } }],
    }).select({ name: 1, email: 1, phone: 1, posts: 1 });
  } catch (err) {
    return res.status(500).send({message:"Could not find the specified user given the name."});
  }
  res.status(201).send(data);
};

//delete user
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
            .json({ success: false, message: "post not found" });
        }
      });
      Pin.findOneAndDelete({ postid: delpostid }).then((pin) => {
        if (!pin) {
          return res
            .status(404)
            .json({ success: false, message: "pin not found" });
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

//display user posts
const displayUserPosts = async (req, res) => {
  const { category } = req.query;
  const userPosts = await Post.find({ listedBy: req.params.userid })
    .populate("category")
    .sort({ date: -1 });

  if (category){
    userPosts = userPosts.filter((user) => {
      return user.category.name === category;
    });
  }

  if (!userPosts) {
    res.status(500).json({ success: false });
  }
  res.send(userPosts);
};

const displayUserReports = async (req, res) => {
  const user = await User.findById(req.params.userid);
  if(!user){
    res.status(500).json({ success: false });
  }
  
const reportAgainst = user.gotReported;
const reportby = user.reportedOthers;
  res.send([reportAgainst,reportby]);
};

module.exports = {
  getUserId,
  getUserList,
  registerUser,
  loginUser,logoutUser,
  updateUser,
  editCreditScore,
  findUserByName,
  displayUserPosts,
  deleteUser,displayUserReports
};
