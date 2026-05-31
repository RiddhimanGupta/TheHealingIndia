// js/map.js
import { toast } from './ui.js';

let leafletMap = null;
let userMarker = null;
let destMarker = null;
let routeLine = null;
let routeTrailLine = null;   // dimmed "already covered" polyline
let mapInited = false;
let isTravelling = false;
let srchTimer = null;
let navInterval = null;      // interval that updates ETA/distance live

// Route data stored from OSRM
let routeCoords = [];        // full [[lat,lng], ...] from OSRM
let routeTotalDist = 0;      // meters
let routeTotalDur  = 0;      // seconds
let tripStartTime  = 0;      // Date.now() when Start Trip pressed

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
    
    // During live navigation: follow the arrow + update the remaining route
    if (isTravelling) {
      leafletMap.setView(ll, 18, { animate: true, duration: 0.6 });
      updateLiveNavigation(ll);
    }
    
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
  tripStartTime = Date.now();
  document.body.classList.add('nav-mode');
  
  // Hide setup UI, show active navigation UI
  const sheet = document.getElementById('route-sheet');
  const activeUi = document.getElementById('nav-active-ui');
  if (sheet) sheet.classList.remove('show');
  if (activeUi) activeUi.classList.add('show');
  
  if (userMarker) leafletMap.setView(userMarker.getLatLng(), 18, { animate: true, duration: 0.5 });
  
  // Start a 1-second interval that ticks the ETA down even when GPS isn't firing
  clearInterval(navInterval);
  navInterval = setInterval(() => {
    if (!isTravelling) { clearInterval(navInterval); return; }
    // Update speed display even between GPS fixes
    const elSpeed = document.getElementById('nau-speed');
    if (elSpeed) elSpeed.textContent = `${Math.round(gpsSpeed)} km/h`;
  }, 1000);
  
  toast("🗺️ Navigation started! Follow the route.");
}

export function endTrip() {
  isTravelling = false;
  clearInterval(navInterval);
  document.body.classList.remove('nav-mode');
  
  const activeUi = document.getElementById('nav-active-ui');
  if (activeUi) activeUi.classList.remove('show');
  
  clearRoute();
  if (userMarker) leafletMap.setView(userMarker.getLatLng(), 15, { animate: true });
  toast("🛑 Trip ended.");
}

export function clearRoute() {
  if (routeLine) { leafletMap.removeLayer(routeLine); routeLine = null; }
  if (routeTrailLine) { leafletMap.removeLayer(routeTrailLine); routeTrailLine = null; }
  if (destMarker) { leafletMap.removeLayer(destMarker); destMarker = null; }
  routeCoords = [];
  routeTotalDist = 0;
  routeTotalDur = 0;
  
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
      if (data.code !== 'Ok' || !data.routes.length) {
        toast('❌ Could not find a route.'); return;
      }
      const route  = data.routes[0];
      const coords = route.geometry.coordinates.map(c => [c[1], c[0]]);
      
      // Store route data for live navigation
      routeCoords    = coords;
      routeTotalDist = route.distance;   // meters
      routeTotalDur  = route.duration;   // seconds
      
      if (routeLine) leafletMap.removeLayer(routeLine);
      routeLine = L.polyline(coords, { 
        color:'#ff6b35', weight:5, opacity:0.9, 
        lineJoin:'round', lineCap:'round' 
      }).addTo(leafletMap);
      leafletMap.fitBounds(routeLine.getBounds(), { padding:[50,50] });
      
      // Update BOTH the bottom sheet (pre-trip) and the top bar (during trip)
      const durMin = Math.round(route.duration / 60);
      const timeStr = formatTime(durMin);
      const distKm = (route.distance / 1000).toFixed(1);
      
      const elRsTime = document.querySelector('.rs-time');
      const elRsDist = document.querySelector('.rs-dist');
      const elNauTime = document.querySelector('.nau-time');
      const elNauDist = document.querySelector('.nau-dist');
      const elNauSpeed = document.getElementById('nau-speed');

      if (elRsTime) elRsTime.textContent = timeStr;
      if (elRsDist) elRsDist.textContent = `${distKm} km`;
      if (elNauTime) elNauTime.textContent = timeStr;
      if (elNauDist) elNauDist.textContent = `${distKm} km remaining`;
      if (elNauSpeed) elNauSpeed.textContent = '0 km/h';
      
      const sheet = document.getElementById('route-sheet');
      if (sheet) sheet.classList.add('show');
    })
    .catch(() => toast('⚠️ Routing service unavailable.'));
}

/* ----------------------------------------------------------
   LIVE NAVIGATION ENGINE
   Called every GPS tick while isTravelling === true.
   Finds the closest point on the route, calculates remaining
   distance, estimates ETA based on current speed, and dims
   the already-traveled portion of the route.
---------------------------------------------------------- */
function updateLiveNavigation(currentLL) {
  if (!routeCoords.length) return;
  
  // 1. Find the closest point on the route polyline
  let minDist = Infinity;
  let closestIdx = 0;
  for (let i = 0; i < routeCoords.length; i++) {
    const d = haversine(currentLL[0], currentLL[1], routeCoords[i][0], routeCoords[i][1]);
    if (d < minDist) { minDist = d; closestIdx = i; }
  }
  
  // 2. Calculate remaining distance (sum of segments from closestIdx to end)
  let remainDist = 0; // meters
  for (let i = closestIdx; i < routeCoords.length - 1; i++) {
    remainDist += haversine(
      routeCoords[i][0], routeCoords[i][1],
      routeCoords[i+1][0], routeCoords[i+1][1]
    );
  }
  
  // 3. Estimate ETA
  //    Use current speed if available (> 5 km/h), else fall back to route avg speed
  const avgRouteSpeed = routeTotalDur > 0 ? (routeTotalDist / routeTotalDur) : 8.33; // m/s
  const currentSpeedMs = gpsSpeed > 5 ? gpsSpeed / 3.6 : avgRouteSpeed;
  const etaSeconds = currentSpeedMs > 0 ? remainDist / currentSpeedMs : 0;
  const etaMin = Math.max(1, Math.round(etaSeconds / 60));
  const timeStr = formatTime(etaMin);
  
  // 4. Format remaining distance
  const remainKm = remainDist >= 1000 
    ? (remainDist / 1000).toFixed(1) + ' km' 
    : Math.round(remainDist) + ' m';
  
  // 5. Update the active navigation HUD
  const elNauTime  = document.querySelector('.nau-time');
  const elNauDist  = document.querySelector('.nau-dist');
  const elNauSpeed = document.getElementById('nau-speed');
  
  if (elNauTime)  elNauTime.textContent  = timeStr;
  if (elNauDist)  elNauDist.textContent  = `${remainKm} remaining`;
  if (elNauSpeed) elNauSpeed.textContent = `${Math.round(gpsSpeed)} km/h`;
  
  // 6. Dim the already-covered portion of the route
  if (closestIdx > 1) {
    const covered = routeCoords.slice(0, closestIdx + 1);
    if (routeTrailLine) leafletMap.removeLayer(routeTrailLine);
    routeTrailLine = L.polyline(covered, { 
      color:'#555', weight:5, opacity:0.4, dashArray:'8,8' 
    }).addTo(leafletMap);
  }
  
  // 7. Check if arrived (within 40m of destination)
  if (remainDist < 40 && routeCoords.length > 0) {
    toast('🎉 You have arrived at your destination!');
    endTrip();
  }
}

/* Haversine formula — distance in meters between two lat/lng points */
function haversine(lat1, lon1, lat2, lon2) {
  const R = 6371000;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180) * Math.cos(lat2*Math.PI/180) * Math.sin(dLon/2)**2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}

/* Time formatting helper */
function formatTime(minutes) {
  if (minutes < 60) return `${minutes} min`;
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hrs} hr ${mins} min` : `${hrs} hr`;
}
