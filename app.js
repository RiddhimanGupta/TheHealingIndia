/* ==========================================================
   THI – THE HEALING INDIA  |  app.js
   Challan profiles · Map · Crash Detection · SOS
========================================================== */

/* ----------------------------------------------------------
   HASH FUNCTION
---------------------------------------------------------- */
function hashStr(s) {
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = Math.imul(h, 33) ^ s.charCodeAt(i);
  return Math.abs(h);
}

/* ----------------------------------------------------------
   APP STATE
---------------------------------------------------------- */
let currentPayId = null;
let leafletMap    = null;
let userMarker    = null;
let destMarker    = null;
let routeLine     = null;
let mapInited     = false;
let gpsSpeed      = 0;
let crashCooldown = false;
let sosTimer      = null;
let sosSecs       = 10;
let srchTimer     = null;
let isTravelling  = false;

// Sliding sensor buffer for math-accurate collision calculations
let sensorHistory = [];
const HISTORY_WINDOW_MS = 1500; 

/* ----------------------------------------------------------
   SPLASH → APP
---------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    const splash = document.getElementById('splash');
    const app = document.getElementById('app');
    
    if (splash) splash.classList.add('out');
    if (app) app.classList.add('show');
    
    initSensors();
  }, 1000); 
  
  initNavbarScroll();
});

/* ----------------------------------------------------------
   NAVIGATION
---------------------------------------------------------- */
function go(tab) {
  document.querySelectorAll('.screen, .ni').forEach(el => el.classList.remove('on'));
  
  const screenEl = document.getElementById('screen-' + tab);
  const navItemEl = document.getElementById('ni-' + tab);
  if (screenEl) screenEl.classList.add('on');
  if (navItemEl) navItemEl.classList.add('on');
  
  const nav = document.querySelector('nav');
  if (nav) nav.classList.remove('nav-hidden'); 

  if (tab === 'maps' && !mapInited) initMap();
}

/* ----------------------------------------------------------
   CHALLAN LOGIC
---------------------------------------------------------- */
function lookupChallan(val) {
  let q = val || document.getElementById('reg-inp').value;
  q = q.toUpperCase().trim();
  
  if (!q) { toast("Please enter a vehicle number."); return; }
  if (q.length < 4) { toast("Invalid registration number."); return; }

  const out = document.getElementById('ch-result');
  out.innerHTML = `<div style="text-align:center; padding:40px; color:var(--t2)">
    <div class="load-spin"></div><br>Searching RTO database for ${q}...
  </div>`;

  setTimeout(() => {
    const idx = hashStr(q) % window.PROFILES.length;
    const p = window.PROFILES[idx];
    const profile = {
      ...p,
      registration: q,
      challans: p.challans.map(ch => ({ ...ch, _id: `${q}-${Math.random().toString(36).slice(2,7)}` }))
    };
    renderResult(profile, q, out);
  }, 600 + Math.random() * 600);
}

function quickLook(reg) {
  document.getElementById('reg-inp').value = reg;
  lookupChallan(reg);
  setTimeout(() => document.getElementById('ch-result').scrollIntoView({ behavior:'smooth', block:'start' }), 150);
}

function renderResult(d, plate, out) {
  const pending  = d.challans.filter(c => c.status === 'pending');
  const totalAmt = pending.reduce((s, c) => s + c.amount, 0);
  const svgFn    = window.SVG_FN[d.type] || window.SVG_FN.bike;

  const cards = d.challans.length === 0
    ? `<div class="no-res" style="padding:24px 0">
         <div style="font-size:42px; margin-bottom:12px">🎉</div>
         <div style="color:var(--green); font-weight:700">No Pending Challans!</div>
         <div style="font-size:12px; margin-top:4px; opacity:.6">Ride safe.</div>
       </div>`
    : d.challans.map(c => `
      <div class="card ch-card ch-${c.status}" id="card-${c._id}">
        <div class="cch-top">
          <div class="cch-ico">${c.icon}</div>
          <div>
            <div class="cch-rsn">${c.reason}</div>
            <div class="cch-id">ID: ${c._id.toUpperCase()} · ${c.law}</div>
          </div>
          <span class="sbadge s-${c.status}">${c.status === 'pending' ? '⚠️ Pending' : '✅ Paid'}</span>
        </div>
        <div class="cch-meta"><div class="cch-mc">📍 ${c.zone}</div></div>
        <div class="cch-amt-row">
          <div>
            <div style="font-size:11px;color:var(--t2);margin-bottom:2px">Fine Amount</div>
            <div class="cch-amt ${c.status === 'paid' ? 'cch-amt-paid' : ''}">₹${c.amount.toLocaleString('en-IN')}</div>
          </div>
          <div style="text-align:right">
            <div style="font-size:11px;color:var(--t2);margin-bottom:2px">Under</div>
            <div style="font-size:12px;color:var(--t3)">${c.law}</div>
          </div>
        </div>
        <div class="cch-actions">
          ${c.status === 'pending'
            ? `<button class="btn btn-accent" onclick="openPay('${c._id}',${c.amount},'${c.reason.replace(/'/g, "\\'")}')">💳 Pay Now</button>
               <button class="btn btn-ghost" onclick="disputeIt('${c._id}')">⚠️ Dispute</button>`
            : `<button class="btn btn-green" disabled>✅ Paid</button>
               <button class="btn btn-ghost" onclick="toast('🧾 Receipt sent to registered email!')">🧾 Receipt</button>`
          }
        </div>
      </div>`).join('');

  out.innerHTML = `
    <div class="veh-card card">
      <div class="veh-banner" style="background:linear-gradient(135deg,${d.color}28 0%,${d.color}44 100%)">
        ${svgFn(d.color)}
        <div class="veh-banner-grad"></div>
      </div>
      <div class="veh-info">
        <div class="veh-name">${d.vehicle}</div>
        <div class="veh-own">👤 ${d.name} &nbsp;·&nbsp; 📞 ${d.phone}</div>
        <div class="veh-meta">
          <div class="vm-chip">🔖 ${plate}</div>
          <div class="vm-chip">${window.TYPE_LABEL[d.type] || '🚗 Vehicle'}</div>
          ${pending.length > 0
            ? `<div class="vm-pend">⚠️ ${pending.length} Pending · ₹${totalAmt.toLocaleString('en-IN')} Due</div>`
            : `<div class="vm-chip" style="color:var(--green)">✅ No Pending Challans</div>`}
        </div>
      </div>
    </div>
    <div class="sec-label">Challan History</div>
    <div class="ch-cards">${cards}</div>`;
}

/* ----------------------------------------------------------
   PAY MODAL
---------------------------------------------------------- */
function openPay(id, amt, rsn) {
  currentPayId = id;
  document.getElementById('ps-ttl').textContent = 'Pay Challan';
  document.getElementById('ps-amt').textContent = `₹${Number(amt).toLocaleString('en-IN')}`;
  document.getElementById('ps-rsn').textContent = rsn;
  document.getElementById('pay-ov').classList.add('on');
}
function closePay() { document.getElementById('pay-ov').classList.remove('on'); }
function selPM(el) {
  document.querySelectorAll('.pm').forEach(m => m.classList.remove('sel'));
  el.classList.add('sel');
}
function confirmPay() {
  closePay();
  toast('✅ Payment successful! Challan cleared.');
  if (!currentPayId) return;
  const card = document.getElementById('card-' + currentPayId);
  if (!card) return;
  card.classList.replace('ch-pend', 'ch-paid');
  card.querySelector('.sbadge').className = 'sbadge s-paid';
  card.querySelector('.sbadge').textContent = '✅ Paid';
  const amt = card.querySelector('.cch-amt');
  if (amt) amt.classList.add('cch-amt-paid');
  const acts = card.querySelector('.cch-actions');
  if (acts) acts.innerHTML = `
    <button class="btn btn-green" disabled>✅ Paid</button>
    <button class="btn btn-ghost" onclick="toast('🧾 Receipt sent to registered email!')">🧾 Receipt</button>`;
}
function disputeIt(id) { toast('📝 Dispute filed for ' + id.toUpperCase() + '. You will hear back in 7 working days.'); }

/* ----------------------------------------------------------
   MAP ENGINE (LEAFLET)
---------------------------------------------------------- */
function initMap() {
  mapInited = true;
  const indiaBounds = L.latLngBounds([6.4626, 68.1097], [35.5133, 97.3953]);

  leafletMap = L.map('leaflet-map', {
    center: [28.6692, 77.4538], // Ghaziabad / Delhi NCR
    zoom: 14,
    minZoom: 5,
    maxBounds: indiaBounds,
    maxBoundsViscosity: 1.0,
    zoomControl: true,
    attributionControl: true
  });

  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>',
    subdomains:'abcd', maxZoom:19, noWrap: true, detectRetina: true
  }).addTo(leafletMap);

  leafletMap.zoomControl.setPosition('bottomright');
  locateUser();
}

function locateUser() {
  if (!navigator.geolocation) return;
  navigator.geolocation.watchPosition(pos => {
    const { latitude:lat, longitude:lng, speed, heading } = pos.coords;
    gpsSpeed = speed ? speed * 3.6 : 0;
    const ll = [lat, lng];
    const rot = heading || 0;
    const arrowHtml = `<div class="nav-arrow" style="transform: rotate(${rot}deg)">
      <svg viewBox="0 0 24 24" fill="var(--accent)" stroke="#fff" stroke-width="2">
        <path d="M12 2L2 22l10-4 10 4L12 2z" />
      </svg>
    </div>`;

    if (!userMarker) {
      userMarker = L.marker(ll, {
        icon: L.divIcon({ className:'', html:arrowHtml, iconSize:[28,28], iconAnchor:[14,14] }),
        zIndexOffset:1000
      }).addTo(leafletMap);
      leafletMap.setView(ll, 15);
    } else {
      userMarker.setLatLng(ll);
      userMarker.setIcon(L.divIcon({ className:'', html:arrowHtml, iconSize:[28,28], iconAnchor:[14,14] }));
    }
    if (isTravelling) leafletMap.setView(ll, 17, { animate: true });
    updateSensorUI(null, null, null); // Sync UI elements
  }, null, { enableHighAccuracy:true, timeout:15000, maximumAge:2000 });
}

function startTrip() {
  isTravelling = true;
  document.body.classList.add('nav-mode');
  document.getElementById('route-sheet').classList.remove('show');
  document.getElementById('nav-active-ui').classList.add('show');
  if (userMarker) leafletMap.setView(userMarker.getLatLng(), 18, { animate: true });
  toast("🗺️ Navigation started! Follow the route.");
}

function endTrip() {
  isTravelling = false;
  document.body.classList.remove('nav-mode');
  document.getElementById('nav-active-ui').classList.remove('show');
  clearRoute();
  if (userMarker) leafletMap.setView(userMarker.getLatLng(), 15, { animate: true });
  toast("🛑 Trip ended.");
}

function clearRoute() {
  if (routeLine) { leafletMap.removeLayer(routeLine); routeLine = null; }
  if (destMarker) { leafletMap.removeLayer(destMarker); destMarker = null; }
  document.getElementById('route-sheet').classList.remove('show');
  document.getElementById('map-inp').value = '';
}

function centerOnUser() {
  if (!leafletMap) return;
  if (userMarker) leafletMap.setView(userMarker.getLatLng(), 16, { animate:true });
  else { toast('⚠️ Waiting for GPS signal…'); locateUser(); }
}

/* ----------------------------------------------------------
   NOMINATIM SEARCH
---------------------------------------------------------- */
function onMapSearch(val) {
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
      const data = await res.json();
      if (!data.length) { drop.innerHTML = '<div class="sd-info" style="color:var(--t3)">No results found.</div>'; return; }
      drop.innerHTML = data.map(r => {
        const name = r.name || r.display_name.split(',')[0].trim();
        return `<div class="sd-item" onclick="selectPlace(${parseFloat(r.lat)},${parseFloat(r.lon)},'${esc(name)}')">
          <span class="sd-ico">📌</span><div><div class="sd-name">${name}</div><div class="sd-addr">${r.display_name}</div></div>
        </div>`;
      }).join('');
    } catch(err) {
      drop.innerHTML = `<div class="sd-info">⚠️ Search unavailable.</div>`;
    }
  }, 420);
}

function esc(s) { return s.replace(/\\/g,'\\\\').replace(/'/g,"\\'"); }

function selectPlace(lat, lng, name) {
  document.getElementById('srch-drop').classList.remove('show');
  document.getElementById('map-inp').value = name;
  const ll = [lat, lng];
  if (destMarker) leafletMap.removeLayer(destMarker);
  destMarker = L.marker(ll, { icon: L.divIcon({ className:'', html:'<div class="dest-pin"></div>', iconSize:[14,14], iconAnchor:[7,7] }) }).addTo(leafletMap);
  if (userMarker) fetchRoute([userMarker.getLatLng().lat, userMarker.getLatLng().lng], ll);
  else { leafletMap.setView(ll, 15); toast('📍 Destination set! Enable GPS.'); }
}

function fetchRoute(origin, dest) {
  const url = `https://router.project-osrm.org/route/v1/driving/${origin[1]},${origin[0]};${dest[1]},${dest[0]}?overview=full&geometries=geojson`;
  fetch(url)
    .then(r => r.json())
    .then(data => {
      if(!data.routes || !data.routes.length) return;
      const route  = data.routes[0];
      const coords = route.geometry.coordinates.map(c => [c[1], c[0]]);
      if (routeLine) leafletMap.removeLayer(routeLine);
      routeLine = L.polyline(coords, { color:'#ff6b35', weight:5 }).addTo(leafletMap);
      leafletMap.fitBounds(routeLine.getBounds(), { padding:[50,50] });
      
      document.getElementById('rs-dur').textContent = `${Math.round(route.duration/60)} min`;
      document.getElementById('rs-dist').textContent = `${(route.distance/1000).toFixed(1)} km`;
      document.getElementById('nau-dur').textContent = `${Math.round(route.duration/60)} min`;
      document.getElementById('nau-dist').textContent = `${(route.distance/1000).toFixed(1)} km remaining`;
      document.getElementById('route-sheet').classList.add('show');
    })
    .catch(() => toast('⚠️ Routing service unavailable.'));
}

/* ----------------------------------------------------------
   PRODUCTION CRASH DETECTION ENGINE (ACTUAL HARDWARE SENSORS)
---------------------------------------------------------- */
function initSensors() {
  // Option A: Modern W3C Generic Sensor API Tier
  if ('LinearAccelerationSensor' in window && 'Gyroscope' in window) {
    Promise.all([
      navigator.permissions.query({ name: 'accelerometer' }),
      navigator.permissions.query({ name: 'gyroscope' })
    ]).then(results => {
      if (results.every(result => result.state === 'granted' || result.state === 'prompt')) {
        const accSensor = new LinearAccelerationSensor({ frequency: 20 });
        const gyroSensor = new Gyroscope({ frequency: 20 });
        
        accSensor.addEventListener('reading', () => {
          processSensorTicks(accSensor.x, accSensor.y, accSensor.z, null, null, null);
        });
        gyroSensor.addEventListener('reading', () => {
          processSensorTicks(null, null, null, gyroSensor.x, gyroSensor.y, gyroSensor.z);
        });
        
        accSensor.start();
        gyroSensor.start();
        return;
      }
      fallbackDeviceMotion();
    }).catch(() => fallbackDeviceMotion());
  } else {
    fallbackDeviceMotion();
  }
}

function fallbackDeviceMotion() {
  if (typeof DeviceMotionEvent !== 'undefined' && typeof DeviceMotionEvent.requestPermission === 'function') {
    DeviceMotionEvent.requestPermission().then(state => {
      if (state === 'granted') window.addEventListener('devicemotion', handleLegacyMotion);
    }).catch(err => console.log("Sensor permission denied", err));
  } else {
    window.addEventListener('devicemotion', handleLegacyMotion);
  }
}

// Global cached vectors to synchronize separate axis reads
let _lastAcc = { x: 0, y: 0, z: 0 };
let _lastRot = { x: 0, y: 0, z: 0 };

function handleLegacyMotion(e) {
  const acc = e.acceleration || e.accelerationIncludingGravity || { x: 0, y: 0, z: 0 };
  const rot = e.rotationRate || { alpha: 0, beta: 0, gamma: 0 };
  
  // Convert standard gravity offsets if reading includes base gravity
  let x = acc.x || 0, y = acc.y || 0, z = acc.z || 0;
  if (e.accelerationIncludingGravity) {
    z = z - 9.81; 
  }
  
  // Deg/sec convert to rad/sec if using standard rotation rate fallbacks
  const degToRad = Math.PI / 180;
  processSensorTicks(x, y, z, (rot.alpha || 0) * degToRad, (rot.beta || 0) * degToRad, (rot.gamma || 0) * degToRad);
}

function processSensorTicks(ax, ay, az, gx, gy, gz) {
  if (crashCooldown) return;

  const now = Date.now();
  if (ax !== null) _lastAcc = { x: ax, y: ay, z: az };
  if (gx !== null) _lastRot = { x: gx, y: gy, z: gz };

  const aMag = Math.sqrt(_lastAcc.x**2 + _lastAcc.y**2 + _lastAcc.z**2);
  const rotMag = Math.sqrt(_lastRot.x**2 + _lastRot.y**2 + _lastRot.z**2); // Rad/s
  const gForce = aMag / 9.81;

  sensorHistory.push({ time: now, aMag, gForce, rotMag });
  
  // Retain historical logging constraints
  sensorHistory = sensorHistory.filter(item => now - item.time <= HISTORY_WINDOW_MS);
  if (sensorHistory.length < 5) return;

  const prev = sensorHistory[sensorHistory.length - 3];
  const dt = (now - prev.time) / 1000;
  const jerk = dt > 0 ? Math.abs(aMag - prev.aMag) / dt : 0;

  updateSensorUI(gForce, jerk, rotMag);

  // Crash Threshold: G-Force > 4.0G and Jerk rate displacement > 60m/s³
  if (gForce > 4.0 && jerk > 60) {
    triggerSOS();
  }
}

function updateSensorUI(g, j, r) {
  const elG = document.getElementById('sv-g');
  const elJ = document.getElementById('sv-j');
  const elR = document.getElementById('sv-r');
  const elS = document.getElementById('sv-s');
  const elF = document.getElementById('sv-sf');

  if (elG && g !== null) elG.textContent = `${g.toFixed(2)} G`;
  if (elJ && j !== null) elJ.textContent = `${Math.round(j)} m/s³`;
  if (elR && r !== null) elR.textContent = `${Math.round(r * (180 / Math.PI))}°/s`;

  // Calculate dynamic driving safety indicator score
  let baseScore = 98;
  if (g > 1.5) baseScore -= 15;
  if (gpsSpeed > 75) baseScore -= 20;
  const finalScore = Math.max(10, baseScore);

  if (elS) elS.textContent = finalScore;
  if (elF) elF.style.width = `${finalScore}%`;
}

/* ----------------------------------------------------------
   SOS SYSTEM
---------------------------------------------------------- */
function triggerSOS() {
  if (crashCooldown) return;
  crashCooldown = true;
  sosSecs = 10;
  
  const ov = document.getElementById('sos-ov');
  const num = document.getElementById('sos-num');
  const ct = document.getElementById('sos-ct');
  
  if (ov) ov.classList.add('on');
  if (num) num.textContent = sosSecs;
  if (ct) ct.textContent = sosSecs;

  clearInterval(sosTimer);
  sosTimer = setInterval(() => {
    sosSecs--;
    if (num) num.textContent = sosSecs;
    if (ct) ct.textContent = sosSecs;
    
    if (sosSecs <= 0) { 
      clearInterval(sosTimer); 
      sendSOS(); 
    }
  }, 1000);
}

function cancelSOS() {
  clearInterval(sosTimer);
  const ov = document.getElementById('sos-ov');
  if (ov) ov.classList.remove('on');
  toast("✅ SOS cancelled. Glad you're safe!");
  setTimeout(() => { crashCooldown = false; }, 15000); // 15s cooldown reset safely
}

function sendSOS() {
  const ov = document.getElementById('sos-ov');
  if (ov) ov.classList.remove('on');
  toast('🆘 Emergency SOS sent to contacts & nearest hospital!');
  setTimeout(() => { crashCooldown = false; }, 45000);
}

function simCrash() {
  toast('⚡ Simulating crash detection…');
  setTimeout(() => {
    processSensorTicks(42.5, 12.1, 8.4, 4.5, 2.1, 1.2); 
  }, 500);
}

/* ----------------------------------------------------------
   NAVBAR VISIBILITY AND UTILITIES
---------------------------------------------------------- */
let _toastTimer;
function toast(msg) {
  const el = document.getElementById('toast');
  if (!el) return;
  clearTimeout(_toastTimer);
  el.textContent = msg;
  el.classList.add('show');
  _toastTimer = setTimeout(() => el.classList.remove('show'), 3200);
}

function initNavbarScroll() {
  const navbar = document.querySelector('nav');
  let lastScrollY = 0;

  document.querySelectorAll('.screen').forEach(screen => {
    screen.addEventListener('scroll', (e) => {
      const currentScrollY = e.target.scrollTop;
      if (Math.abs(currentScrollY - lastScrollY) < 12) return;

      if (currentScrollY > lastScrollY && currentScrollY > 60) {
        if (navbar) navbar.classList.add('nav-hidden'); 
      } else {
        if (navbar) navbar.classList.remove('nav-hidden'); 
      }
      lastScrollY = currentScrollY;
    }, { passive: true });
  });
}
