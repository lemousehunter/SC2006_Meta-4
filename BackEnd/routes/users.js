const { User } = require("../models/user");
const { Post } = require("../models/post");
const Pin = require("../models/pinmodel");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const HttpError = require("../models/http-error");
const { Schema } = require("mongoose");

//get single user by ID
router.get(`/:id`, async (req, res, next) => {
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
});

//get list of user
router.get(`/`, async (req, res, next) => {
  let userList;
  try {
    userList = await User.find().sort({ creditScore: -1 }).select("-passwordHash");
    if (!userList) {
      res.status(500).json({ success: false });
    }
  } catch (err) {
    const error = new HttpError("Fetching user list failed, please retry", 500);
    return next(error);
  }
  res.send(userList);
});

router.post("/", async (req, res, next) => {
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

  // // Generating token for user
  // let token;
  // // sign returns a string which is just the token
  // try {
  //   token = jwt.sign(
  //     { userId: user.id, email: user.email },
  //     secret, // for the 2nd arg, it's a private key, never share it elsewhr, only your own server side knows
  //     { expiresIn: "1h" } //adjust expiry of token as deemed fit
  //   );
  // } catch (err) {
  //   const error = new HttpError(
  //     "Signing up failed, please try again later.",
  //     500
  //   );
  //   return next(error);
  // }

  res.status(201).send(user);
});

// create new User localhost://3000/users/
router.post("/register", async (req, res, next) => {
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
    creditScore: 0
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
});

router.post("/login", async (req, res) => {
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
});

// router.get("/search", async (req, res) => {
//   try {
//     const query = req.query;
//     let results;

//     results = await User.aggregate([
//       {
//         $search: {
//           index: "users", // depends on the atlas search index used
//           autocomplete: {
//             query: `${query.name}`,
//             path: "name",
//             tokenOrder: "sequential",
//             fuzzy: { maxEdits: 2 },
//           },
//         },
//       },
//       {
//         $project: { name: 1, email: 1 },
//       },
//       {
//         facet: {
//           docs: [{ $limit: 10 }],
//         },
//       },
//     ]);
//     if (results) {
//       return res.status(200).json({ results: results });
//     }
//     res.status(404).json({ message: "error" });
//   } catch (err) {
//     const error = new HttpError("Could not find the searched user.");
//   }
// });

// //get count of users
// router.get("/count", async (req, res) => {
//   let userCount;
//   try {
//     userCount = await User.find().countDocuments({});
//     if (!userCount) {
//       res.status(404).json({ success: false, message: "No users found" });
//     } else {
//       res.send({ count: userCount });
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// });

router.put("/:id", async (req, res, next) => {
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
});

// change creditScore
router.put("/credit/:id", async (req, res, next) => {
  try {
    user = await User.findById(req.params.id).select("-passwordHash");
    let updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        name: user.name,
        email: user.email,
        passwordHash: user.passwordHash,
        phone: user.phone,
        creditScore: req.body.amount + user.creditScore
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
});

  // Search via name (Case sensitive)
  router.get(`/search/:name`, async (req, res, next) => {
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
  });

//delete user
router.delete("/:id", async (req, res) => {
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
