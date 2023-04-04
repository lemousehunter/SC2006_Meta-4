const { Report } = require("../models/report");
const mongoose = require("mongoose");
const HttpError = require("../models/http-error");
const { User } = require("../models/user");

// show all reports
const showAllReports = async (req, res) => {
  const reportlist = await Report.find()
    .populate({
      path: "sender",
      select: { name: 1, phone: 1, creditScore: 1 },
    })
    .populate({
      path: "recipient",
      select: { name: 1, phone: 1, creditScore: 1 },
    })
    .populate("post");

  if (!reportlist) {
    res.status(500).json({ success: false });
  }
  res.send(reportlist);
};
//show post found by id, can use .select(<attribute>) to show selected attribute
const getReportById = async (req, res) => {
  const report = await Report.findById(req.params.id)
    .populate({
      path: "sender",
      select: { name: 1, phone: 1, creditScore: 1 },
    })
    .populate({
      path: "recipient",
      select: { name: 1, phone: 1, creditScore: 1 },
    })
    .populate("post");
  if (!report) {
    res.status(500).json({ success: false });
  }
  res.send(report);
};
// upload new post
const uploadReport = async (req, res) => {
  let report = new Report({
    sender: req.body.sender,
    recipient: req.body.recipient,
    post: req.body.post,
    title: req.body.title,
    description: req.body.description,
    date: req.body.date,
  });
  console.log(report.description);
  if (report) {
    report = await report.save();
    let Sender = await User.findById(report.sender);
    if (!Sender) {
      return res.status(404).send({ message: "the sender cannot be found" });
    }
    let reportedOthersList = Sender.reportedOthers;
    reportedOthersList.push(report.id);
    Sender.reportedOthers = reportedOthersList;
    Sender.save();
    let Recipient = await User.findById(report.recipient);
    if (!Sender) {
      return res.status(404).send({ message: "the recipient cannot be found" });
    }
    let gotReportedlist = Recipient.gotReported;
    gotReportedlist.push(report.id);
    Recipient.gotReported = gotReportedlist;
    Recipient.save();
    res.send(report);
  } else {
    return res.status(404).send({ message: "the report cannot be created" });
  }
};

//update report found by id
//keep resolved report for history
const updateReportById = async (req, res) => {
  // check if the id in the url is valid
  if (!mongoose.isValidObjectId(req.params.id)) {
    res.status(400).send({ message: "Invalid Report ID" });
  }
  const report = await Report.findById(req.params.id);
  if (!report) return res.status(400).send({ message: "invalid report" });

  const updatedReport = await Report.findByIdAndUpdate(
    req.params.id,
    {
      sender: report.sender,
      recipient: report.recipient,
      post: report.post,
      title: report.title,
      description: req.body.description,
      date: report.date,
      time: report.time,
      state: req.body.state,
    },

    { new: true }
  );

  if (!updatedReport) {
    return res.status(404).send({ message: "the post cannot be updated" });
  }
  let reportedUser = await User.findById(updatedReport.recipient);
  reportedUser.creditScore = reportedUser.creditScore + updatedReport.state;
  reportedUser.save();
  res.send(updatedReport);
};

//delete post found by id
const deleteReportById = async (req, res, next) => {
  let report;
  try {
    report = await Report.findById(req.params.id);
  } catch (err) {
    return res.status(500).send({message:"no report found, please retry."});
  }
  let Sender;
  try {
    Sender = await User.findById(report.sender);
  } catch (err) {
    return res.status(500).send({message:"no sender found, please retry."});
  }
  let reportedOthersList = Sender.reportedOthers;
  let i = reportedOthersList.indexOf(req.params.id);
  Sender.reportedOthers = reportedOthersList.splice(i, 1);
  Sender.save();

  let Recipient;
  try {
    Recipient = await User.findById(report.recipient);
  } catch (err) {
    return res.status(500).send({message:"no recipient found, please retry."});
  }
  let gotReportedList = Recipient.gotReported;
  let j = gotReportedList.indexOf(req.params.id);
  Recipient.gotReported = gotReportedList.splice(j, 1);
  Recipient.save();

  Report.findByIdAndRemove(req.params.id).then((report) => {
    if (report) {
      return res
        .status(200)
        .json({ success: true, message: "report is deleted" });
    } else {
      return res
        .status(404)
        .json({ success: false, message: "report not found" });
    }
  });
};

// get the count of posts
const getReportCount = async (req, res) => {
  let reportCount;
  try {
    reportCount = await Report.find().countDocuments({});
    if (!reportCount) {
      res.status(404).json({ success: false, message: "No report found" });
    } else {
      res.send({ count: reportCount });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = {
  showAllReports,
  getReportById,
  updateReportById,
  deleteReportById,
  getReportCount,
  uploadReport,
};
