const { Category } = require("../models/category");

/**
 * Gets a list of all categories.
 *
 * @param req the request object
 * @param res the response object
 * @return a list of all categories
 */
const getCategories = async (req, res) => {
  const categoryList = await Category.find();

  if (!categoryList) {
    res.status(500).json({ success: false });
  }
  res.status(200).send(categoryList);
};

/**
 * Gets a category by ID.
 *
 * @param req the request object containing the ID of the category to retrieve
 * @param res the response object
 * @return the category with the given ID
 */
const getCategoriesById = async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    res
      .status(500)
      .json({ message: "The category with the Given ID was not found" });
  }
  res.status(200).send(category);
};

/**
 * Creates a new category.
 *
 * @param req the request object containing the name of the new category
 * @param res the response object
 * @return the newly created category
 */
const postCategory = async (req, res) => {
  let category = new Category({
    name: req.body.name,
  });
  category = await category.save();
  if (!category) {
    return res.status(404).send({message:"the category cannot be created"});
  }
  res.send(category);
};


/**
 * Updates a category by ID.
 *
 * @param req the request object containing the ID of the category to update and the new name
 * @param res the response object
 * @return the updated category
 */
const updateCategory = async (req, res) => {
  const category = await Category.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
    },
    { new: true }
  );
  if (!category) {
    return res.status(404).send({message:"the category cannot be updated"});
  }
  res.send(category);
};

/**
 * Deletes a category by ID.
 *
 * @param req the request object containing the ID of the category to delete
 * @param res the response object
 * @return a message indicating whether the category was successfully deleted
 */
const deleteCategory = (req, res) => {
  Category.findByIdAndRemove(req.params.id)
    .then((category) => {
      if (category) {
        return res
          .status(200)
          .json({ success: true, message: "category is deleted" });
      } else {
        return res
          .status(404)
          .json({ success: false, message: "category not found" });
      }
    })
    .catch((err) => {
      return res.status(400).json({ success: false, error: err });
    });
};

module.exports = {
  getCategories,
  getCategoriesById,
  postCategory,
  updateCategory,
  deleteCategory,
};
