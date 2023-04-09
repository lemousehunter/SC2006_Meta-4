const { Search } = require("../models/search-type");
const { Post } = require("../models/post");
const { User } = require("../models/user");
const { request } = require("express");
const mongoose = require("mongoose");

// get the list of all search types
const getSearchTypes = async (req, res) => {
  const typeList = await Search.find();

  if (!typeList) {
    res.status(500).json({ success: false });
  }
  res.status(200).send(typeList);
};

// get the type by ID from mongodb
const getTypesById = async (req, res) => {
  const searchType = await Search.findById(req.params.id);
  if (!searchType) {
    res
      .status(500)
      .json({ message: "The search type with the given ID was not found" });
  }
  res.status(200).send(category);
};

//Search both post and user via name (Case sensitive)
const search =  async (req, res) => {
    const { name } = req.params;
    const { category, searchType } = req.query;

    // console.log("name: " + name);
    // console.log("category: " + category);
    // console.log("searchType: " + searchType);

    let postData = [];
    let users;

    try {
        const filter = new RegExp(name, 'i');    
        let useridArray = [];   

      // trying to find the post specified by the param name
      if ( searchType === "Item" ){
        console.log("Item is being used to find");
        
        postData = await Post.find({
          $or: [
            { itemName: filter },
          ]
        })
        .populate("category")
        .populate({ path: "listedBy", select: { name: 1, phone: 1 } });
        console.log(postData);
      }
      else if ( searchType === "User" ) {
        console.log("User is being used to find");

        /*users = await User.find({
            $or: [
              { name: filter },
            ]
        });

        if (!users) return;*/

        postData = await Post.find({}, { listedBy: { name: filter } })
            .populate("category")
            .populate({ path: "listedBy", select: { name: 1, phone: 1 } });

        console.log(postData);

        if (!postData) {
            res.status(500).json({ success: false });
        }
        /*postData = postData.filter((item) => {
            return item.listedBy &&  item.listedBy.id && useridArray.includes(item.listedBy.id);
        })*/

      }
    } catch (err) {
        console.log(err);
      return res.status(500).send({message:"Could not find the specified item given the name."});
    }

    if (category) {
        postData = postData.filter((item) => {
          return item.category && item.category.id === category;
        });
    }

    /*if (!users) {
        res.status(201).send([]);
        return;
    }*/

    res.status(201).send(postData);
  }; 

// create new search type
const createType = async (req, res) => {
  let searchType = new Search({
    name: req.body.name,
  });
  searchType = await searchType.save();
  if (!searchType) {
    return res.status(404).send({message:"the search type cannot be created"});
  }
  res.send(searchType);
};

//update search type found by id
const updateType = async (req, res) => {
  const searchType = await Search.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
    },
    { new: true }
  );
  if (!searchType) {
    return res.status(404).send({message:"the search type cannot be updated"});
  }
  res.send(searchType);
};

//api/<id>
//delete search type found by id
const deleteType = (req, res) => {
  Search.findByIdAndRemove(req.params.id)
    .then((searchType) => {
      if (searchType) {
        return res
          .status(200)
          .json({ success: true, message: "search type is deleted" });
      } else {
        return res
          .status(404)
          .json({ success: false, message: "search type not found" });
      }
    })
    .catch((err) => {
      return res.status(400).json({ success: false, error: err });
    });
};

module.exports = {
    getSearchTypes,
    getTypesById,
    createType,
    updateType,
    deleteType,
    search
};
