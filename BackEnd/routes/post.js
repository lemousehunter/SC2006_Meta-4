const {
  showAllPosts,
  getPostById,
  uploadPost,
  updatePostById,
  deletePostById,
  getPostCount,
  getUnresolvedPosts,
  getFoundPosts,
  getLostPosts,
  getUserPosts,
  searchPosts,
} = require("../controllers/posts-controllers");
const express = require("express");
const multer = require("multer");
const router = express.Router();


const FILE_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const isValid = FILE_TYPE_MAP[file.mimetype];
    let uploadError = new Error("invalid image type");

    if (isValid) {
      uploadError = null;
    }
    cb(uploadError, "public/uploads");
  },
  filename: function (req, file, cb) {
    const fileName = file.originalname.split(" ").join("-");
    const extension = FILE_TYPE_MAP[file.mimetype];
    cb(null, `${fileName}-${Date.now()}.${extension}`);
  },
});

const uploadOptions = multer({ storage: storage });

// show all posts or filtered by category posts
router.get(`/`, showAllPosts);

//show post found by id, can use .select(<attribute>) to show selected attribute
router.get("/:id", getPostById);

// upload new post
router.post(`/`,uploadOptions.array("images", 4), uploadPost);

//update post found by id and if post has been resolved, remove pin from map
//keep resolved post for history
router.put("/:id", uploadOptions.array("images", 4), updatePostById);

//delete post found by id
router.delete("/:id", deletePostById);
 
//get post counts
router.get("/get/count", getPostCount);

//display  unresolved posts 
router.get("/get/UrgentPosts", getUnresolvedPosts);

//display found posts
router.get("/get/FoundPosts", getFoundPosts);

//display lost posts
router.get("/get/LostPosts", getLostPosts);

//display user posts
router.get("/userposts/:userid", getUserPosts);

// Search posts
router.get(`/search/:name`, searchPosts);

module.exports = router;
