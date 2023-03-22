const { User } = require("../models/user");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const HttpError = require('../models/http-error');

//get single user by ID
router.get(`/:id`, async (req, res) => {

  let user
  try{
    user = await User.findById(req.params.id).select("-passwordHash");
  } catch (err) {
    const error = new HttpError('Fetching of specified user failed, please retry.', 500);
    return next(error);
  }

  if (!user) {
    res.status(500).json({ success: false });
  }
  res.send(user);
});

//get list of user
router.get(`/`, async (req, res) => {

  let userList;
  try{
    userList = await User.find().select("-passwordHash");
    if (!userList) {
      res.status(500).json({ success: false });
    }
  } catch(err) {
    const error = new HttpError('Fetching user list failed, please retry', 500);
    return next(error);
  }

  res.send(userList);
});
// create new User
router.post("/", async (req, res) => {
  let existingUser;
  try{
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error  = new HttpError('Signing up failed, please retry',500);
    return next(error);
  }

  if (existingUser) {
    const error = new HttpError('User exists already, please login instead.', 422);
    return next(error);
  }
  const secret = process.env.secret;
  let user = new User({
    name: req.body.name,
    email: req.body.email,
    passwordHash: bcrypt.hashSync(req.body.password, secret),
    phone: req.body.phone,
    isAdmin: req.body.isAdmin,
  });
  try{
    user = await user.save();
    if (!user) {
      return res.status(404).send("the user cannot be created");
    }
  } catch(err) {
    const error = new HttpError(
      'Signing up failed, please try again.',
      500
    );
    return next(error);
  }

  // Generating token for user
  let token;
  // sign returns a string which is just the token
  try{
    token = jwt.sign(
      { userId: user.id, email: user.email }, 
      'oliver_handsome', // for the 2nd arg, it's a private key, never share it elsewhr, only your own server side knows
      {expiresIn: '1h'} //adjust expiry of token as deemed fit
    ); 
  } catch(err) {
    const error = new HttpError('Signing up failed, please try again later.', 500);
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
  if (user && bcrypt.compareSync(req.body.password, user.passwordHash)) {
    const token = jwt.sign(
      {
        userId: user.id,
      },
      secret
      //{expiresIn:"1d"} for eg, jwt token expires in 1day
    );
    res.status(200).send({ user: user.email, token: token });
  } else {
    res.status(401).send("Password is wrong");
  }

  let token;

  try{
    token = jwt.sign(
      { userId: user.id, email: user.email }, 
      'oliver_handsome', 
      {expiresIn: '1h'}
    ); 
  } catch(err) {
    const error = new HttpError('Logging in failed, please try again later.', 500);
    return next(error);
  }

  res.json({
    message: 'Logged in!',
    userId: existingUser.id,
    email: existingUser.email,
    token: token
  });  
});

router.get("/search", async(req, res) => {
  try{
    const query = req.query;
    let results;

    results = await User.aggregate([
      {
        $search: {
          "index": "users", // depends on the atlas search index used
          "autocomplete": {"query": `${query.name}`, "path": "name", "tokenOrder": "sequential", "fuzzy": { maxEdits:2 },}
        }
      },
      {
        $project: {name: 1, email: 1}
      },
      {
        "facet": {
          "docs": [
            {"$limit": 10}
          ]
        }
      }
    ]); 
    if (results) {
      return res.status(200).json({results: results});
    }
    res.status(404).json({message: "error"});
  } catch(err) {
    const error = new HttpError('Could not find the searched user.', )
  }
});

module.exports = router;
