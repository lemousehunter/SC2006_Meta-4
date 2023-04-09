const express = require('express');
const router = express.Router();
const {getAllPins} = require('../controllers/pins-controllers');


// Get all pins
router.get('/',getAllPins);

// // Create a new pin
// router.post('/', async (req, res) => {
//   const { title, description, location } = req.body;

//   if (!title || !description || !location) {
//     return res.status(400).json({ message: 'Please provide a title, description, and location.' });
//   }

//   // Geocode the location using the OneMap API
//   try {
//     const response = await axios.get('https://developers.onemap.sg/commonapi/search', {
//       params: {
//         searchVal: location,
//         returnGeom: 'Y',
//         getAddrDetails: 'N',
//         pageNum: 1,
//         apiKey: onemapApiKey
//       }
//     });

//     if (response.data.results.length === 0) {
//       return res.status(400).json({ message: 'Location not found.' });
//     }

//     const { LATITUDE, LONGITUDE } = response.data.results[0];

//     const pin = new Pin({
//       title,
//       description,
//       latitude: LATITUDE,
//       longitude: LONGITUDE
//     });

//     await pin.save();

//     res.status(201).json(pin);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// console.log("Router" + router);

module.exports = router;