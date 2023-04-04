const {
  showAllReports,
    getReportById,
    updateReportById,
    deleteReportById,
    getReportCount,
    uploadReport,
} = require("../controllers/reports-controllers")
const express = require("express");
const router = express.Router();

// show all reports
router.get("/",showAllReports);

//get report by id
router.get("/:id",getReportById);

//update report
router.put("/:id",updateReportById);

//delete report by id
router.delete("/:id",deleteReportById);

//get report count
router.get("/get/ReportCount",getReportCount);

//upload report
router.post("/",uploadReport);

module.exports = router;