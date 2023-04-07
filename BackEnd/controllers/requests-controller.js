const { Request } = require("../models/request");
const { Post } = require("../models/post");

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
      state: req.body.isLost,
      date: req.body.date,
    },
    { new: true }
  );
  if (!newrequest) {
    return res.status(404).send({ message: "request cannot be updated" });
  }
  res.send(newrequest);
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
};
