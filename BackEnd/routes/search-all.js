const express = require('express');

const searchAllControllers = require('../controllers/search-all-controllers');
const router = express.Router();

router.get("/:name", searchAllControllers.search);

module.exports = router; 