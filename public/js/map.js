import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const MAPTILER_KEY = 'gBM3hM5IVO6FG8pLDrHa';

const displayMap = (locations) => {
	const map = L.map('map').setView([locations[0].coordinates[1], locations[0].coordinates[0]], 8);

	L.tileLayer(`https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=${MAPTILER_KEY}`, {
		tileSize: 512,
		zoomOffset: -1,
		attribution: '&copy; <a href="https://www.maptiler.com/">MapTiler</a> contributors',
	}).addTo(map);

	locations.forEach((loc) => {
		L.marker([loc.coordinates[1], loc.coordinates[0]])
			.addTo(map)
			.bindPopup(
				`<p style="font-size: 12px; font-weight: bold;">Day ${loc.day}: ${loc.description}</p>`,
				{ autoClose: false },
			)
			.openPopup();
	});

	const bounds = L.latLngBounds(locations.map((l) => [l.coordinates[1], l.coordinates[0]]));
	map.fitBounds(bounds, { padding: [50, 50] });
};

export default displayMap;
