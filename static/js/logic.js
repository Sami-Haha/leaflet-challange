// url allowing to select parameters for query
// const url = 'https://earthquake.usgs.gov/fdsnws/event/1/query';

// url selecting earthquake data for the last 7 days.
const url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson';

// Fetch data from USGS API and console log it.
fetch(url)
  .then(response => response.json())
  .then(data => {
    // Process the earthquake data
    console.log(data.features); 
  })
  .catch(error => {
    console.error('Error fetching earthquake data:', error);
  });