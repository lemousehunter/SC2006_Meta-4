const {
    getSearchTypes,
    getTypesById,
    createType,
    updateType,
    deleteType,
    search
  } = require("../controllers/search-type-controllers");
  const express = require("express");
  const router = express.Router();
  
  // get the list of all search types
  router.get(`/`, getSearchTypes);
  
  // get the type by ID from mongodb
  router.get("/:id", getTypesById);

  // Do the actual search
  router.get("/:name", search);

  // create new search type
  router.post("/", createType);
  
  //update search type found by id
  router.put("/:id", updateType);
  
  //api/<id>
  //delete search type found by id
  router.delete("/:id", deleteType);
  
  module.exports = router;
   