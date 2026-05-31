// js/map.js
import { toast } from './ui.js';

let leafletMap = null;
let userMarker = null;
let destMarker = null;
let routeLine = null;
let mapInited = false;
let isTravelling = false;
let srchTimer = null;

export function initMap() {
  if (mapInited) return;
  mapInited = true;
  const indiaBounds = L.latLngBounds([6.4626, 68.1097], [35.5133, 97.3953]);

  leafletMap = L.map('leaflet-map', {
    center: [28.6692, 77.4538], // Default
    zoom: 14,
    minZoom: 5,
    maxBounds: indiaBounds
  });

  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; OpenStreetMap &copy; CARTO'
  }).addTo(leafletMap);

  locateUser();
}

function locateUser() {
  if (!navigator.geolocation) return;
  navigator.geolocation.watchPosition(pos => {
    const { latitude:lat, longitude:lng } = pos.coords;
    const ll = [lat, lng];
    const arrowHtml = `<div class="user-dot"></div>`;

    if (!userMarker) {
      userMarker = L.marker(ll, { icon: L.divIcon({ html:arrowHtml, className:'' }) }).addTo(leafletMap);
      leafletMap.setView(ll, 15);
    } else {
      userMarker.setLatLng(ll);
    }
  }, null, { enableHighAccuracy:true });
}

export function centerOnUser() {
  if (userMarker && leafletMap) leafletMap.setView(userMarker.getLatLng(), 16, { animate:true });
  else toast('⚠️ Waiting for GPS signal…');
}

export function startTrip() {
  isTravelling = true;
  document.body.classList.add('nav-mode');
  document.getElementById('route-sheet').classList.remove('show');
  toast("🗺️ Navigation started!");
}

export function endTrip() {
  isTravelling = false;
  document.body.classList.remove('nav-mode');
  clearRoute();
  toast("🛑 Trip ended.");
}

export function clearRoute() {
  if (routeLine) { leafletMap.removeLayer(routeLine); routeLine = null; }
  if (destMarker) { leafletMap.removeLayer(destMarker); destMarker = null; }
  document.getElementById('route-sheet').classList.remove('show');
}
