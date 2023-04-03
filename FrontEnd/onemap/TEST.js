const axios = require('axios');

// fetch('http://localhost:3000/pins')
//   .then(response => response.json())
//   .then(data => console.log(data))
//   .catch(error => console.error(error));

async function fetchData() {
  try {
    const response = await axios.get('http://localhost:3000/pins');
    console.log(response);
    setMarkers(response.data);
  } catch (error) {
    console.log('Error fetching data: ', error.message);
    // Handle the error here, e.g. show an error message to the user
  }
}

fetchData();