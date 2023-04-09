/**
A module that handles all the operations related to reports.
@module reportController
*/
const { Report } = require("../models/report");
const mongoose = require("mongoose");
const { User } = require("../models/user");


/**
Returns a list of all reports with populated sender, recipient, and post fields.
@function
@async
@param {Object} req - The request object.
@param {Object} res - The response object.
@returns {Object} - A list of all reports.
@throws {Object} - If an error occurs while performing the operation.
*/
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

/**
Returns a report with the given ID and populated sender, recipient, and post fields.
@function
@async
@param {Object} req - The request object.
@param {Object} res - The response object.
@returns {Object} - A report with the given ID.
@throws {Object} - If an error occurs while performing the operation.
*/
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

/**
Creates a new report and saves it to the database. Also updates the reported user's credit score and
updates the reportedOthers and gotReported fields of the sender and recipient users respectively.
@function
@async
@param {Object} req - The request object.
@param {Object} res - The response object.
@returns {Object} - The newly created report object.
@throws {Object} - If an error occurs while performing the operation.
*/
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
    Sender = await Sender.save();
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

/**
 * Updates an existing report by its ID.
 *
 * @param req the HTTP request object containing the report ID in the URL and the updated report data in the request body
 * @param res the HTTP response object that will contain the updated report if successful
 *
 * @throws 400 Bad Request if the report ID in the URL is not a valid MongoDB ObjectID
 * @throws 404 Not Found if no report is found with the given ID
 * @throws 500 Internal Server Error if there is a problem finding or updating the report or updating the credit score of the recipient user
 */
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

/**
Deletes a report by ID from the database, as well as removes the report from both the sender and recipient's reportedOthers/gotReported list.
@param {Object} req - The request object
@param {Object} res - The response object
@param {Function} next - The next middleware function
@returns {Object} The JSON response containing the success status and message
@throws {Object} If no report, sender or recipient is found in the database, returns an error message with status code 500.
*/
const deleteReportById = async (req, res, next) => {
  let report;
  try {
    report = await Report.findById(req.params.id);
  } catch (err) {
    return res.status(500).send({ message: "no report found, please retry." });
  }
  let Sender;
  try {
    Sender = await User.findById(report.sender);
  } catch (err) {
    return res.status(500).send({ message: "no sender found, please retry." });
  }
  let reportedOthersList = Sender.reportedOthers;
  let i = reportedOthersList.indexOf(req.params.id);
  let removed = reportedOthersList.splice(i, 1);
  Sender.reportedOthers = reportedOthersList;
  Sender = await Sender.save();

  let Recipient;
  try {
    Recipient = await User.findById(report.recipient);
  } catch (err) {
    return res
      .status(500)
      .send({ message: "no recipient found, please retry." });
  }
  let gotReportedList = Recipient.gotReported;
  let j = gotReportedList.indexOf(req.params.id);
  let rremoved = gotReportedList.splice(j, 1);
  Recipient.gotReported = gotReportedList;
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

/**
Retrieves the count of all reports using the Report model.
@param req the HTTP request object
@param res the HTTP response object
@return a JSON object containing the count of all reports
@throws Error if an error occurs while retrieving the report count
*/
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
