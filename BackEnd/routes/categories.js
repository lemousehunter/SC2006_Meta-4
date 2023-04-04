const {
  getCategories,
  getCategoriesById,
  postCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/categories-controllers");
const express = require("express");
const router = express.Router();

// get the list of all categories
router.get(`/`, getCategories);

// get the category by ID
router.get("/:id", getCategoriesById);
// create new category
router.post("/", postCategory);

//update category found by id
router.put("/:id", updateCategory);

//api/<id>
//delete category found by id
router.delete("/:id", deleteCategory);

module.exports = router;
