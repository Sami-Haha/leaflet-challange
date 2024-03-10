// Fetch tectonic plates data using D3
d3.json('https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json')
    .then(data => {
        // Plot tectonic plates data on the map
        L.geoJSON(data, {
            style: function(feature) {
                return {
                    color: 'yellow', // Customize the line color
                    weight: 2 // Customize the line weight
                };
            }
        }).addTo(map);
    })
    .catch(error => {
        console.error('Error fetching tectonic plates data:', error);
    });