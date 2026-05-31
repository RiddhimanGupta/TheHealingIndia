// js/map.js
import { toast } from './ui.js';

let leafletMap = null;
let userMarker = null;
let destMarker = null;
let routeLine = null;
let mapInited = false;
let isTravelling = false;
let srchTimer = null;

// Export gpsSpeed so sensors.js can read it for crash severity
export let gpsSpeed = 0; 
let userHeading = 0;

export function initMap() {
  if (mapInited) return;
  mapInited = true;

  leafletMap = L.map('leaflet-map', {
    center: [28.6692, 77.4538], // Default
    zoom: 14,
    zoomControl: true, 
    attributionControl: true
  });

  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>',
    subdomains: 'abcd', maxZoom: 19
  }).addTo(leafletMap);

  leafletMap.zoomControl.setPosition('bottomright');
  
  locateUser();
  initDeviceCompass();
}

// Fixes Leaflet's hidden div rendering issue
export function fixMapSize() {
  if (leafletMap) leafletMap.invalidateSize();
}

/* ----------------------------------------------------------
   GPS & HARDWARE SENSORS (Phone Compass)
---------------------------------------------------------- */
function initDeviceCompass() {
  // Uses actual hardware compass so the arrow rotates even when standing still
  if (window.DeviceOrientationEvent) {
    window.addEventListener('deviceorientation', (event) => {
      let webkitAlpha = event.webkitCompassHeading; // iOS
      let alpha = event.alpha; // Android
      
      if (webkitAlpha !== undefined && webkitAlpha !== null) {
        userHeading = webkitAlpha;
      } else if (alpha !== null) {
        userHeading = 360 - alpha;
      }
      updateUserMarker();
    }, true);
  }
}

function locateUser() {
  if (!navigator.geolocation) return;
  
  navigator.geolocation.watchPosition(pos => {
    const { latitude:lat, longitude:lng, speed, heading } = pos.coords;
    
    // Convert m/s to km/h for the safety score system
    gpsSpeed = speed ? speed * 3.6 : 0; 
    
    // Fallback to GPS heading if hardware compass isn't supported
    if (heading !== null && !isNaN(heading)) userHeading = heading;
    
    const ll = [lat, lng];

    if (!userMarker) {
      userMarker = L.marker(ll, {
        icon: getArrowIcon(),
        zIndexOffset: 1000
      }).addTo(leafletMap);
      leafletMap.setView(ll, 15);
    } else {
      userMarker.setLatLng(ll);
      updateUserMarker();
    }
    
    if (isTravelling) leafletMap.setView(ll, 17, { animate: true });
    
  }, null, { enableHighAccuracy: true, timeout: 15000, maximumAge: 2000 });
}

function getArrowIcon() {
  const arrowHtml = `<div class="nav-arrow" style="transform: rotate(${userHeading}deg)">
    <svg viewBox="0 0 24 24" fill="var(--accent)" stroke="#fff" stroke-width="2">
      <path d="M12 2L2 22l10-4 10 4L12 2z" />
    </svg>
  </div>`;
  return L.divIcon({ className:'', html: arrowHtml, iconSize:[28,28], iconAnchor:[14,14] });
}

function updateUserMarker() {
  if (userMarker) userMarker.setIcon(getArrowIcon());
}

export function centerOnUser() {
  if (!leafletMap) return;
  if (userMarker) leafletMap.setView(userMarker.getLatLng(), 16, { animate:true });
  else { toast('⚠️ Waiting for GPS signal…'); locateUser(); }
}

/* ----------------------------------------------------------
   TRIP CONTROLS
---------------------------------------------------------- */
export function startTrip() {
  isTravelling = true;
  document.body.classList.add('nav-mode');
  
  // Hide setup UI, show active navigation UI
  const sheet = document.getElementById('route-sheet');
  const activeUi = document.getElementById('nav-active-ui');
  if (sheet) sheet.classList.remove('show');
  if (activeUi) activeUi.classList.add('show');
  
  if (userMarker) leafletMap.setView(userMarker.getLatLng(), 18, { animate: true });
  toast("🗺️ Navigation started! Follow the route.");
}

export function endTrip() {
  isTravelling = false;
  document.body.classList.remove('nav-mode');
  
  const activeUi = document.getElementById('nav-active-ui');
  if (activeUi) activeUi.classList.remove('show');
  
  clearRoute();
  if (userMarker) leafletMap.setView(userMarker.getLatLng(), 15, { animate: true });
  toast("🛑 Trip ended.");
}

export function clearRoute() {
  if (routeLine) { leafletMap.removeLayer(routeLine); routeLine = null; }
  if (destMarker) { leafletMap.removeLayer(destMarker); destMarker = null; }
  
  const sheet = document.getElementById('route-sheet');
  const inp = document.getElementById('map-inp');
  if (sheet) sheet.classList.remove('show');
  if (inp) inp.value = '';
}

/* ----------------------------------------------------------
   SEARCH & ROUTING ALGORITHM
---------------------------------------------------------- */
export function onMapSearch(val) {
  clearTimeout(srchTimer);
  const drop = document.getElementById('srch-drop');
  if (!val || val.length < 3) { drop.classList.remove('show'); drop.innerHTML = ''; return; }
  
  srchTimer = setTimeout(async () => {
    drop.classList.add('show');
    drop.innerHTML = '<div class="sd-info">🔍 Searching…</div>';
    try {
      let viewboxParam = '';
      if (userMarker) {
        const o = userMarker.getLatLng();
        viewboxParam = `&viewbox=${o.lng-0.5},${o.lat+0.5},${o.lng+0.5},${o.lat-0.5}&bounded=0`;
      }
      const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(val)}&format=json&limit=6&countrycodes=in&addressdetails=1${viewboxParam}`;
      const res  = await fetch(url, { headers:{ 'Accept':'application/json' } });
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const data = await res.json();
      
      if (!data.length) { drop.innerHTML = '<div class="sd-info" style="color:var(--t3)">No results found.</div>'; return; }
      
      drop.innerHTML = data.map(r => {
        const name = r.name || r.display_name.split(',')[0].trim();
        const addr = r.display_name;
        const lat  = parseFloat(r.lat);
        const lng  = parseFloat(r.lon);
        return `<div class="sd-item" onclick="selectPlace(${lat},${lng},'${esc(name)}','${esc(addr)}')">
          <span class="sd-ico">📌</span><div><div class="sd-name">${name}</div><div class="sd-addr">${addr}</div></div>
        </div>`;
      }).join('');
    } catch(err) {
      drop.innerHTML = `<div class="sd-info">⚠️ Search unavailable.</div>`;
    }
  }, 420);
}

// Utility to escape quotes in place names
function esc(s) { return s.replace(/\\/g,'\\\\').replace(/'/g,"\\'"); }

export function selectPlace(lat, lng, name, addr) {
  const drop = document.getElementById('srch-drop');
  if (drop) drop.classList.remove('show');
  
  const inp = document.getElementById('map-inp');
  if (inp) inp.value = name;
  
  const ll = [lat, lng];
  if (destMarker) leafletMap.removeLayer(destMarker);
  
  destMarker = L.marker(ll, { 
    icon: L.divIcon({ className:'', html:'<div class="dest-pin"></div>', iconSize:[14,14], iconAnchor:[7,7] }) 
  }).addTo(leafletMap);
  
  if (userMarker) {
    fetchRoute([userMarker.getLatLng().lat, userMarker.getLatLng().lng], ll);
  } else { 
    leafletMap.setView(ll, 15); 
    toast('📍 Destination set! Enable GPS to calculate route.'); 
  }
}

function fetchRoute(origin, dest) {
  const url = `https://router.project-osrm.org/route/v1/driving/${origin[1]},${origin[0]};${dest[1]},${dest[0]}?overview=full&geometries=geojson`;
  
  fetch(url)
    .then(r => r.json())
    .then(data => {
      const route  = data.routes[0];
      const coords = route.geometry.coordinates.map(c => [c[1], c[0]]);
      
      if (routeLine) leafletMap.removeLayer(routeLine);
      routeLine = L.polyline(coords, { color:'#ff6b35', weight:5 }).addTo(leafletMap);
      leafletMap.fitBounds(routeLine.getBounds(), { padding:[50,50] });
      
      // Update UI panels with time and distance
      const durMin = Math.round(route.duration/60);
      const distKm = (route.distance/1000).toFixed(1);
      
      document.getElementById('rs-dur').textContent = `${durMin} min`;
      document.getElementById('rs-dist').textContent = `${distKm} km`;
      document.getElementById('nau-dur').textContent = `${durMin} min`;
      document.getElementById('nau-dist').textContent = `${distKm} km remaining`;
      
      const sheet = document.getElementById('route-sheet');
      if (sheet) sheet.classList.add('show');
    })
    .catch(() => toast('⚠️ Routing service unavailable.'));
}// js/map.js
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
