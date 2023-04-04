const {
  getUserId,
  getUserList,
  registerUser,
  loginUser,
  updateUser,
  editCreditScore,
  findUserByName,
  displayUserPosts,
  deleteUser,
  displayUserReports,
} = require("../controllers/users-controllers");
const express = require("express");
const router = express.Router();

//get single user by ID
router.get(`/:id`, getUserId);

//get list of user
router.get(`/`, getUserList);

// create new User localhost://3000/users/
router.post("/register", registerUser);

//login route
router.post("/login", loginUser);

//update user profile
router.put("/:id", updateUser);

// change creditScore
router.put("/credit/:id", editCreditScore);

// Search via name (Case sensitive)
router.get(`/search/:name`, findUserByName);

//delete user
router.delete("/:id", deleteUser);

//display user posts
router.get("/userposts/:userid", displayUserPosts);

//display user reports
router.get("/userreports/:id", displayUserReports);

module.exports = router;
