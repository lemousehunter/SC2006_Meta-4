const {
  deleteRequest,
  updateRequestStatus,
  displayAllRequests,
  makeNewRequest,
} = require("../controllers/requests-controller");

const express = require("express");
const router = express.Router();

//display all requests
router.get("/", displayAllRequests);

//make new requests params is post id
router.post("/:id", makeNewRequest);

//update request status params is request id
router.put("/:id", updateRequestStatus);

//delete request params is request id
router.delete("/:id", deleteRequest);

module.exports = router;
