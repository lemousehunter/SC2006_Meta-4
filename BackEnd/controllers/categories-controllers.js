const { Category } = require("../models/category");

// get the list of all categories
const getCategories = async (req, res) => {
  const categoryList = await Category.find();

  if (!categoryList) {
    res.status(500).json({ success: false });
  }
  res.status(200).send(categoryList);
};

// get the category by ID
const getCategoriesById = async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    res
      .status(500)
      .json({ message: "The category with the Given ID was not found" });
  }
  res.status(200).send(category);
};
// create new category
const postCategory = async (req, res) => {
  let category = new Category({
    name: req.body.name,
  });
  category = await category.save();
  if (!category) {
    return res.status(404).send("the category cannot be created");
  }
  res.send(category);
};

//update category found by id
const updateCategory = async (req, res) => {
  const category = await Category.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
    },
    { new: true }
  );
  if (!category) {
    return res.status(404).send("the category cannot be updated");
  }
  res.send(category);
};

//api/<id>
//delete category found by id
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
