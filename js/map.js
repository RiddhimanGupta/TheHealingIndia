// js/map.js
import { toast } from './ui.js';

let leafletMap = null;
let userMarker = null;
let destMarker = null;
let routeLine = null;
let mapInited = false;
let isTravelling = false;
let userLatLng = null; // Store user's current location

export function initMap() {
  if (mapInited) return;
  mapInited = true;
  
  const indiaBounds = L.latLngBounds([6.4626, 68.1097], [35.5133, 97.3953]);

  leafletMap = L.map('leaflet-map', {
    center: [28.6692, 77.4538], // Default center
    zoom: 14,
    minZoom: 5,
    maxBounds: indiaBounds
  });

  // Dark mode map tiles
  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; OpenStreetMap &copy; CARTO'
  }).addTo(leafletMap);

  locateUser();
}

// FIX: Forces Leaflet to render correctly when switching to the Map tab
export function fixMapSize() {
  if (leafletMap) {
    leafletMap.invalidateSize();
  }
}

function locateUser() {
  if (!navigator.geolocation) {
    toast('⚠️ Geolocation is not supported by your browser.');
    return;
  }
  
  navigator.geolocation.watchPosition(pos => {
    const { latitude:lat, longitude:lng } = pos.coords;
    userLatLng = [lat, lng];
    const arrowHtml = `<div class="user-dot"></div>`;

    if (!userMarker) {
      userMarker = L.marker(userLatLng, { 
        icon: L.divIcon({ html: arrowHtml, className: '' }) 
      }).addTo(leafletMap);
      leafletMap.setView(userLatLng, 15);
    } else {
      userMarker.setLatLng(userLatLng);
    }
  }, (err) => {
    console.warn('GPS Error:', err);
  }, { enableHighAccuracy: true });
}

export function centerOnUser() {
  if (userMarker && leafletMap) {
    leafletMap.setView(userMarker.getLatLng(), 16, { animate: true });
  } else {
    toast('⚠️ Waiting for GPS signal…');
  }
}

// NEW: Function to draw a route to a destination using free OSRM API
export async function routeTo(destLat, destLng, destName = "Destination") {
  if (!userLatLng) {
    toast('⚠️ Waiting for your GPS location first...');
    return;
  }

  clearRoute(); // Clear previous routes

  // 1. Add Destination Marker
  destMarker = L.marker([destLat, destLng], {
    icon: L.divIcon({ html: `<div class="dest-pin"></div>`, className: '' })
  }).addTo(leafletMap);

  // 2. Fetch Route from OSRM
  try {
    toast('🗺️ Calculating route...');
    const url = `https://router.project-osrm.org/route/v1/driving/${userLatLng[1]},${userLatLng[0]};${destLng},${destLat}?overview=full&geometries=geojson`;
    const res = await fetch(url);
    const data = await res.json();

    if (data.routes && data.routes.length > 0) {
      const route = data.routes[0];
      const coords = route.geometry.coordinates.map(c => [c[1], c[0]]); // Leaflet uses [Lat, Lng]
      
      // 3. Draw the line on the map
      routeLine = L.polyline(coords, { color: 'var(--teal)', weight: 5, opacity: 0.8 }).addTo(leafletMap);
      leafletMap.fitBounds(routeLine.getBounds(), { padding: [40, 40] });

      // 4. Update the UI Sheet with time and distance
      const durationMin = Math.round(route.duration / 60);
      const distanceKm = (route.distance / 1000).toFixed(1);
      
      const sheet = document.getElementById('route-sheet');
      if (sheet) {
        // Assuming your HTML has elements with these classes/IDs
        const timeEl = sheet.querySelector('.rs-time');
        const distEl = sheet.querySelector('.rs-dist');
        if (timeEl) timeEl.textContent = `${durationMin} min`;
        if (distEl) distEl.textContent = `${distanceKm} km · ${destName}`;
        sheet.classList.add('show');
      }
    }
  } catch (err) {
    console.error(err);
    toast('❌ Could not calculate route.');
  }
}

export function startTrip() {
  isTravelling = true;
  document.body.classList.add('nav-mode');
  const sheet = document.getElementById('route-sheet');
  if (sheet) sheet.classList.remove('show');
  
  // Center tightly on user for navigation
  if (userMarker) leafletMap.setView(userMarker.getLatLng(), 18, { animate: true });
  toast("🗺️ Navigation started!");
}

export function endTrip() {
  isTravelling = false;
  document.body.classList.remove('nav-mode');
  clearRoute();
  toast("🛑 Trip ended.");
  centerOnUser();
}

export function clearRoute() {
  if (routeLine) { leafletMap.removeLayer(routeLine); routeLine = null; }
  if (destMarker) { leafletMap.removeLayer(destMarker); destMarker = null; }
  const sheet = document.getElementById('route-sheet');
  if (sheet) sheet.classList.remove('show');
}
