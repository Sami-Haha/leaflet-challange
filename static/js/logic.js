// from W3 schools added event listener to start.
document.addEventListener('DOMContentLoaded', function () {
    // Initialize the map
    const map = initializeMap();

    // Load earthquake data and plot on the map
    const url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson';
    fetchEarthquakeData(url, map);
});

function initializeMap() {
    // Create and return the Leaflet map with street view base layer
    const map = L.map('map').setView([0, 0], 2);
    const streetLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });
    // add topo layer as an option
    const topoLayer = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.opentopomap.org/about#verwendung">OpenTopoMap</a> contributors'
    });

    // Add both layers to the map
    const baseLayers = {
        "Street View": streetLayer,
        "Topographic View": topoLayer
    };
    streetLayer.addTo(map);

    // Add layer control to switch between base layers
    L.control.layers(baseLayers).addTo(map);

    return map;
}

function fetchEarthquakeData(url, map) {
    // Function to set marker size based on magnitude
    function getMarkerSize(magnitude) {
        return magnitude * 2; 
    }

    // Function to set marker color based on depth
    function getMarkerColor(depth) {
        const colors = ['#0000FF', '#00FF00', '#FFFF00', '#FFA500', '#FF4500', '#FF0000', '#800000']; // Blue, Green, Yellow, Orange, Red, Maroon
        if (depth < -10) {
            return colors[0];
        } else if (depth < 10) {
            return colors[1];
        } else if (depth < 30) {
            return colors[2];
        } else if (depth < 50) {
            return colors[3];
        } else if (depth < 70) {
            return colors[4];
        } else if (depth < 90) {
            return colors[5];
        } else {
            return colors[6];
        }
    }

    // Function to create popup content
    function createPopup(properties) {
        return `
            <b>Location:</b> ${properties.place}<br/>
            <b>Magnitude:</b> ${properties.mag}<br/>
            <b>Depth:</b> ${properties.depth} km<br/>
            <b>Time:</b> ${new Date(properties.time).toLocaleString()}<br/>
        `;
    }

    // Add legend to the map
    const legend = L.control({ position: 'bottomright' });
    legend.onAdd = function (map) {
        const div = L.DomUtil.create('div', 'legend');

        const depthLabels = ['< -10 km', '-10 to 10 km', '10 to 30 km', '30 to 50 km', '50 to 70 km', '70 to 90 km', '> 90 km'];
        const colors = ['#0000FF', '#00FF00', '#FFFF00', '#FFA500', '#FF4500', '#FF0000', '#800000'];


        // Loop through the depth labels and colors to create the legend
        for (let i = 0; i < depthLabels.length; i++) {
            const legendItem = L.DomUtil.create('div', 'legend-item');
            const legendIcon = L.DomUtil.create('i');
            legendIcon.style.backgroundColor = colors[i];
            const legendLabel = L.DomUtil.create('span', 'legend-label');
            legendLabel.textContent = depthLabels[i];
            legendItem.appendChild(legendIcon);
            legendItem.appendChild(legendLabel);
            div.appendChild(legendItem);
        }
        return div;
    };
    legend.addTo(map);

    // Fetch earthquake data using D3
    d3.json(url)
        .then(data => {
            // Plot earthquake data on the map
            data.features.forEach(feature => {
                const coordinates = [feature.geometry.coordinates[1], feature.geometry.coordinates[0]];
                const properties = {
                    place: feature.properties.place,
                    mag: feature.properties.mag,
                    depth: feature.geometry.coordinates[2],
                    time: feature.properties.time
                };
                const marker = L.circleMarker(coordinates, {
                    radius: getMarkerSize(properties.mag),
                    color: getMarkerColor(properties.depth),
                    fillColor: getMarkerColor(properties.depth),
                    fillOpacity: 0.8
                }).addTo(map);

                // Add popup to marker
                marker.bindPopup(createPopup(properties));
            });
        })
        .catch(error => {
            console.error('Error fetching earthquake data:', error);
        });
}
