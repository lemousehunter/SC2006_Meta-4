const { User } = require("../models/user");
const { Post } = require("../models/post");
const Pin = require("../models/pinmodel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const HttpError = require("../models/http-error");


//get single user by ID
const getUserId =  async (req, res, next) => {
  let user;
  try {
    user = await User.findById(req.params.id).select("-passwordHash");
  } catch (err) {
    const error = new HttpError(
      "Fetching of specified user failed, please retry.",
      500
    );
    return next(error);
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
    const error = new HttpError("Fetching user list failed, please retry", 500);
    return next(error);
  }
  res.send(userList);
};


// create new User localhost://3000/users/
const registerUser = async (req, res, next) => {
  let existingUser;
  try {
    existingUser = await User.findOne({ email: req.body.email });
  } catch (err) {
    const error = new HttpError(
      "Signing up failed as user exists, please retry",
      500
    );
    return next(error);
  }

  if (existingUser) {
    const error = new HttpError(
      "User exists already, please login instead.",
      422
    );
    return next(error);
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
      return res.status(404).send("the user cannot be created");
    }
  } catch (err) {
    const error = new HttpError("Signing up failed, please retry.", 500);
    return next(error);
  }

  res.status(201).send(user);
};

const loginUser = async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  const secret = process.env.secret;
  if (!user) {
    return res.status(401).send("User not found");
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
    res.status(401).send("Password is wrong");
  }
};

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
    res.status(200).send("Logout successful");
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
};

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
      return res.status(404).send("user cannot be updated");
    }
    res.status(201).send(updatedUser);
  } catch (err) {
    const error = new HttpError(" no user found, please retry.", 500);
    return next(error);
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
      return res.status(404).send("user cannot be updated");
    }
    res.status(201).send(updatedUser);
  } catch (err) {
    const error = new HttpError(" no user found, please retry.", 500);
    return next(error);
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
    const error = new HttpError(
      "Could not find the specified user given the name.",
      500
    );
    return next(error);
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
  const userPosts = await Post.find({ listedBy: req.params.userid })
    .populate("category")
    .sort({ date: -1 });
  if (!userPosts) {
    res.status(500).json({ success: false });
  }
  res.send(userPosts);
};

module.exports = {getUserId,getUserList,registerUser,loginUser,logoutUser,updateUser,editCreditScore,findUserByName,displayUserPosts,deleteUser};
