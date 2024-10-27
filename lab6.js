// Initialize the map centered on the U.S.
const map = L.map('map').setView([37.8, -96], 4);

// Add OpenStreetMap tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Function to generate random coordinates within specified ranges
function getRandomInRange(from, to, fixed) {
    return (Math.random() * (to - from) + from).toFixed(fixed) * 1;
}

// Generate 3 sets of random coordinates
const coords = [];
for (let i = 0; i < 3; i++) {
    const lat = getRandomInRange(30, 35, 3);
    const lon = getRandomInRange(-100, -90, 3);
    coords.push([lat, lon]);
}

// Add markers to the map and fetch locality information for each
coords.forEach((coord, index) => {
    const marker = L.marker(coord).addTo(map);
    const url = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${coord[0]}&longitude=${coord[1]}&localityLanguage=en`;

    // Fetch locality information
    fetch(url)
        .then(response => response.json())
        .then(data => {
            const locality = data.locality || "Not found";

            // Update the text for the respective marker in the HTML
            document.getElementById(`marker${index + 1}`).innerHTML = `Latitude: ${coord[0]}, Longitude: ${coord[1]}<br>Locality: ${locality}`

            // Bind a popup to the marker with coordinate and locality information
            marker.bindPopup(`
                <b>Marker ${index + 1}: Latitude: ${coord[0]}, Longitude: ${coord[1]}
                <br>
                Locality: ${locality}
            `);
        })
        .catch(error => {
            console.error("Error fetching locality information:", error);
            document.getElementById(`marker${index + 1}`).textContent = `Coordinates: (${coord[0]}, ${coord[1]}) - Locality: Error fetching data`;
        });
});
