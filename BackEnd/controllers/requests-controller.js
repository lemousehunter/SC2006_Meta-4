const { Request } = require("../models/request");
const { Post } = require("../models/post");
const { User } = require("../models/user");
const { findById } = require("../models/chat");

//get all request details
const displayAllRequests = async (req, res) => {
  const request = await Request.find()
    .populate("sender")
    .populate("recipient")
    .populate("post");
  if (!request) {
    res.status(500).json({ success: false });
  }
  res.send(request);
};

//user making request
const makeNewRequest = async (req, res) => {
  let post = await Post.findById(req.params.id);
  if (!post) {
    return res.status(500).json({ success: false });
  }
  let state;
  if (post.isLost === true) {
    state = true;
  } else {
    state = false;
  }
  let request = new Request({
    sender: req.body.sender, //the session user id
    recipient: post.listedBy, //the post owner
    post: req.params.id,
    isLost: req.body.isLost,
    date: req.body.date,
    isLost: state,
  });
  try {
    request = await request.save();
    if (!request) {
      return res.status(404).send({ message: "the request cannot be created" });
    }
  } catch (err) {
    return res
      .status(500)
      .send({ message: "Creating request failed, please retry." });
  }
  res.send(request);
};

//editing request ie changing the state
const updateRequestStatus = async (req, res) => {
  let oldrequest = await Request.findById(req.params.id);
  if (!oldrequest) {
    return res.status(404).send({ message: "the request cannot be found" });
  }
  let newrequest = await Request.findByIdAndUpdate(
    req.params.id,
    {
      sender: oldrequest.sender,
      recipient: oldrequest.recipient,
      post: oldrequest.post,
      isLost: oldrequest.isLost,
      state: req.body.state,
      date: oldrequest.date,
    },
    { new: true }
  );
  if (!newrequest) {
    return res.status(404).send({ message: "request cannot be updated" });
  }
  if (newrequest.state === 1) {
    //change state of other requests tagged to the post to be -1
    let oldpost = await Post.findById(oldrequest.post);
    let updatedPost = await Post.findByIdAndUpdate(
      oldrequest.post,
      {
        itemName: oldpost.itemName,
        isLost: oldpost.isLost,
        location: oldpost.location,
        listedBy: oldpost.listedBy,
        date: oldpost.date,
        time: oldpost.time,
        itemDescription: oldpost.itemDescription,
        category: oldpost.category,
        latitude: oldpost.latitude,
        longitude: oldpost.longitude,
        isResolved: true,
        finder: oldrequest.sender,
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

    let reqlist = await Request.find({ post: oldrequest.post });
    for (let index = 0; index < reqlist.length; index++) {
      const element = reqlist[index];
      let oldreq = await Request.findById(element);
      let rejReq = await Request.findByIdAndUpdate(
        element,
        {
          sender: oldreq.sender,
          recipient: oldreq.recipient,
          post: oldreq.post,
          isLost: oldreq.isLost,
          state: -1,
          date: oldreq.date,
        },
        { new: true }
      );
    }
  }
  res.send(newrequest);
};

const validateUser = async (req, res) => {
  let userid = req.body.user;
  let user = await User.findById(userid);
  if (!user) {
    return res.status(500).json({ success: false });
  }
  let post = await Post.findById(req.params.id);
  if (!post) {
    return res.status(500).json({ success: false });
  }
  let checkReq = await Request.find({ post: req.params.id });
  // console.log(checkReq);
  if (!checkReq) {
    return res.status(500).json({ success: false });
  }
  let check = false;
  for (let index = 0; index < checkReq.length; index++) {
    const element = checkReq[index];
    // console.log(element);
    let r = await Request.findById(element);
    console.log(r.sender.toString() === userid);

    if (r.sender.toString() === userid && r.state === 0) {
      check = true;
      console.log(check);
      return res.send({ check });
    }
  }
  res.send({ check });
};

//delete request
const deleteRequest = async (req, res) => {
  Request.findByIdAndRemove(req.params.id)
    .then((request) => {
      if (request) {
        return res
          .status(200)
          .json({ success: true, message: "request is deleted" });
      } else {
        return res
          .status(404)
          .json({ success: false, message: "request not found" });
      }
    })
    .catch((err) => {
      return res.status(400).json({ success: false, error: err });
    });
};

module.exports = {
  deleteRequest,
  updateRequestStatus,
  displayAllRequests,
  makeNewRequest,
  validateUser,
};
