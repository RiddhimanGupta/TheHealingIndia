/* =======================================================
   VEHICLE DATABASE
======================================================= */
const DB = {
  "MH12AB1234": {
    owner:"Rahul Sharma", vehicle:"Honda City ZX 2022",
    type:"car", color:"#c0392b", phone:"+91 98765 43210",
    challans:[
      { id:"CH-MH-00123", icon:"🚦", reason:"Signal Jumping", date:"15 May 2026", amount:500, zone:"Andheri East Junction, Mumbai", law:"Section 119, MVA", status:"pending" },
      { id:"CH-MH-00456", icon:"📱", reason:"Mobile Phone Use While Driving", date:"22 May 2026", amount:1000, zone:"BKC Signal, Mumbai", law:"Section 184, MVA", status:"pending" }
    ]
  },
  "DL08XY5678": {
    owner:"Priya Singh", vehicle:"Honda Activa 6G",
    type:"scooter", color:"#2471a3", phone:"+91 97654 32109",
    challans:[
      { id:"CH-DL-00789", icon:"⛑️", reason:"Riding Without Helmet", date:"20 May 2026", amount:1000, zone:"Connaught Place, New Delhi", law:"Section 129, MVA", status:"pending" }
    ]
  },
  "KA03MN9012": {
    owner:"Arjun Nair", vehicle:"Royal Enfield Classic 350",
    type:"bike", color:"#1c2833", phone:"+91 96543 21098",
    challans:[
      { id:"CH-KA-01234", icon:"⚡", reason:"Overspeeding (87 in 60 zone)", date:"10 May 2026", amount:2000, zone:"Outer Ring Road, Bengaluru", law:"Section 183, MVA", status:"pending" },
      { id:"CH-KA-01235", icon:"↔️", reason:"Wrong Side Riding", date:"18 May 2026", amount:500, zone:"Silk Board Junction, Bengaluru", law:"Section 116, MVA", status:"paid" },
      { id:"CH-KA-01236", icon:"📋", reason:"No Valid Third-Party Insurance", date:"25 May 2026", amount:2000, zone:"MG Road, Bengaluru", law:"Section 196, MVA", status:"pending" }
    ]
  },
  "TN22CD3456": {
    owner:"Fatima Begum", vehicle:"Mahindra XUV700 AX7",
    type:"suv", color:"#1e8449", phone:"+91 95432 10987",
    challans:[
      { id:"CH-TN-02345", icon:"🅿️", reason:"Illegal Parking in No-Parking Zone", date:"28 May 2026", amount:500, zone:"Anna Salai, Chennai", law:"Section 122, MVA", status:"paid" }
    ]
  }
};

/* =======================================================
   SVG VEHICLE SILHOUETTES
======================================================= */
function svgCar(c) {
  return `<svg viewBox="0 0 260 96" xmlns="http://www.w3.org/2000/svg" class="veh-svg">
    <defs>
      <linearGradient id="cg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="${c}"/>
        <stop offset="100%" stop-color="${c}" stop-opacity=".55"/>
      </linearGradient>
    </defs>
    <rect x="18" y="54" width="224" height="28" rx="8" fill="url(#cg)"/>
    <polygon points="58,54 80,22 178,22 202,54" fill="${c}" opacity=".88"/>
    <polygon points="66,52 83,27 132,27 132,52" fill="rgba(150,220,255,.38)"/>
    <polygon points="136,52 136,27 174,27 196,52" fill="rgba(150,220,255,.38)"/>
    <line x1="132" y1="27" x2="136" y2="52" stroke="${c}" stroke-width="3"/>
    <circle cx="70" cy="82" r="14" fill="#0e131e"/><circle cx="70" cy="82" r="8" fill="#1a2035"/><circle cx="70" cy="82" r="3.5" fill="#2a3248"/>
    <circle cx="190" cy="82" r="14" fill="#0e131e"/><circle cx="190" cy="82" r="8" fill="#1a2035"/><circle cx="190" cy="82" r="3.5" fill="#2a3248"/>
    <rect x="232" y="58" width="14" height="10" rx="3" fill="rgba(255,255,200,.9)"/>
    <rect x="14" y="58" width="11" height="10" rx="3" fill="rgba(255,60,60,.88)"/>
    <line x1="132" y1="54" x2="132" y2="82" stroke="rgba(255,255,255,.1)" stroke-width="1.5"/>
    <rect x="197" y="40" width="13" height="7" rx="2" fill="${c}" opacity=".65"/>
  </svg>`;
}

function svgScooter(c) {
  return `<svg viewBox="0 0 230 110" xmlns="http://www.w3.org/2000/svg" class="veh-svg">
    <defs>
      <linearGradient id="sg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="${c}"/><stop offset="100%" stop-color="${c}" stop-opacity=".5"/>
      </linearGradient>
    </defs>
    <path d="M58 72 Q68 42 98 36 L164 36 Q182 36 192 52 L197 72" fill="url(#sg)"/>
    <rect x="93" y="30" width="68" height="12" rx="6" fill="${c}" opacity=".9"/>
    <path d="M192 52 L182 87" stroke="${c}" stroke-width="6" stroke-linecap="round" fill="none"/>
    <rect x="88" y="70" width="96" height="8" rx="4" fill="${c}" opacity=".65"/>
    <rect x="178" y="26" width="26" height="5" rx="2.5" fill="${c}" opacity=".8"/>
    <line x1="188" y1="26" x2="188" y2="38" stroke="${c}" stroke-width="4"/>
    <circle cx="55" cy="90" r="20" fill="#0e131e"/><circle cx="55" cy="90" r="12" fill="#1a2035"/><circle cx="55" cy="90" r="5" fill="#2a3248"/>
    <circle cx="188" cy="90" r="20" fill="#0e131e"/><circle cx="188" cy="90" r="12" fill="#1a2035"/><circle cx="188" cy="90" r="5" fill="#2a3248"/>
    <ellipse cx="196" cy="48" rx="8" ry="6" fill="rgba(255,255,200,.9)"/>
  </svg>`;
}

function svgBike(c) {
  return `<svg viewBox="0 0 248 112" xmlns="http://www.w3.org/2000/svg" class="veh-svg">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="${c}"/><stop offset="100%" stop-color="${c}" stop-opacity=".4"/>
      </linearGradient>
    </defs>
    <path d="M68 88 L112 52 L152 62 L192 88" stroke="url(#bg)" stroke-width="7" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M112 52 L122 28 L158 28 L152 62" stroke="${c}" stroke-width="5" fill="${c}" opacity=".58"/>
    <rect x="117" y="22" width="50" height="10" rx="5" fill="${c}" opacity=".9"/>
    <ellipse cx="132" cy="50" rx="22" ry="12" fill="url(#bg)"/>
    <rect x="112" y="57" width="40" height="18" rx="5" fill="${c}" opacity=".38"/>
    <line x1="192" y1="56" x2="200" y2="88" stroke="${c}" stroke-width="6" stroke-linecap="round"/>
    <line x1="186" y1="56" x2="195" y2="88" stroke="${c}" stroke-width="3.5" stroke-linecap="round" opacity=".55"/>
    <rect x="183" y="22" width="28" height="5" rx="2.5" fill="${c}"/>
    <line x1="194" y1="22" x2="194" y2="38" stroke="${c}" stroke-width="4"/>
    <path d="M116 76 Q96 80 76 90" stroke="rgba(180,180,180,.4)" stroke-width="4" fill="none" stroke-linecap="round"/>
    <circle cx="66" cy="90" r="22" fill="#0e131e"/><circle cx="66" cy="90" r="13" fill="#1a2035"/><circle cx="66" cy="90" r="5.5" fill="#2a3248"/>
    <circle cx="198" cy="90" r="22" fill="#0e131e"/><circle cx="198" cy="90" r="13" fill="#1a2035"/><circle cx="198" cy="90" r="5.5" fill="#2a3248"/>
    <line x1="66" y1="68" x2="66" y2="112" stroke="#1e2840" stroke-width="1.5"/>
    <line x1="44" y1="90" x2="88" y2="90" stroke="#1e2840" stroke-width="1.5"/>
    <line x1="198" y1="68" x2="198" y2="112" stroke="#1e2840" stroke-width="1.5"/>
    <line x1="176" y1="90" x2="220" y2="90" stroke="#1e2840" stroke-width="1.5"/>
    <ellipse cx="204" cy="48" rx="9" ry="7" fill="rgba(255,255,200,.9)"/>
  </svg>`;
}

function svgSUV(c) {
  return `<svg viewBox="0 0 288 108" xmlns="http://www.w3.org/2000/svg" class="veh-svg">
    <defs>
      <linearGradient id="uvg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="${c}"/><stop offset="100%" stop-color="${c}" stop-opacity=".52"/>
      </linearGradient>
    </defs>
    <rect x="18" y="44" width="252" height="40" rx="8" fill="url(#uvg)"/>
    <rect x="26" y="14" width="222" height="32" rx="8" fill="${c}" opacity=".84"/>
    <rect x="36" y="19" width="62" height="22" rx="4" fill="rgba(150,220,255,.32)"/>
    <rect x="106" y="19" width="62" height="22" rx="4" fill="rgba(150,220,255,.32)"/>
    <rect x="176" y="19" width="62" height="22" rx="4" fill="rgba(150,220,255,.32)"/>
    <rect x="101" y="16" width="5" height="26" fill="${c}" opacity=".8"/>
    <rect x="171" y="16" width="5" height="26" fill="${c}" opacity=".8"/>
    <rect x="28" y="11" width="218" height="5" rx="2" fill="${c}" opacity=".45"/>
    <circle cx="78" cy="86" r="20" fill="#0e131e"/><circle cx="78" cy="86" r="12" fill="#1a2035"/><circle cx="78" cy="86" r="5" fill="#2a3248"/>
    <circle cx="210" cy="86" r="20" fill="#0e131e"/><circle cx="210" cy="86" r="12" fill="#1a2035"/><circle cx="210" cy="86" r="5" fill="#2a3248"/>
    <rect x="255" y="52" width="17" height="14" rx="3" fill="rgba(255,255,200,.9)"/>
    <rect x="255" y="47" width="15" height="5" rx="2" fill="rgba(255,255,255,.55)"/>
    <rect x="16" y="52" width="14" height="14" rx="3" fill="rgba(255,60,60,.88)"/>
    <line x1="103" y1="44" x2="103" y2="84" stroke="rgba(255,255,255,.1)" stroke-width="1.5"/>
    <line x1="173" y1="44" x2="173" y2="84" stroke="rgba(255,255,255,.1)" stroke-width="1.5"/>
    <rect x="34" y="66" width="20" height="9" rx="3" fill="rgba(255,220,100,.45)"/>
  </svg>`;
}

const svgMap = { car:svgCar, scooter:svgScooter, bike:svgBike, suv:svgSUV };
const typeLabel = { car:"🚗 Car", scooter:"🛵 Scooter", bike:"🏍️ Motorcycle", suv:"🚙 SUV" };

/* =======================================================
   APP STATE
======================================================= */
let currentPayId = null;
let leafletMap    = null;
let userMarker    = null;
let destMarker    = null;
let routeLine     = null;
let mapInited     = false;
let gpsSpeed      = 0;       // km/h
let gyroRate      = 0;       // deg/s
let prevMag       = 9.81;
let prevTime      = 0;
let accBuf        = [];
let jerkBuf       = [];
let recentHighG   = [];
let crashCooldown = false;
let sosTimer      = null;
let sosSecs       = 10;
let srchTimer     = null;

/* =======================================================
   SPLASH → APP
======================================================= */
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('splash').classList.add('out');
    document.getElementById('app').classList.add('show');
    initCrashDetection();
  }, 2300);
});

/* =======================================================
   NAVIGATION
======================================================= */
function go(tab) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('on'));
  document.querySelectorAll('.ni').forEach(n => n.classList.remove('on'));
  document.getElementById('screen-' + tab).classList.add('on');
  document.getElementById('ni-' + tab).classList.add('on');
  
  // Ensure navbar reappears instantly when changing tabs
  const nav = document.querySelector('nav');
  if(nav) nav.classList.remove('nav-hidden'); 
  
  if (tab === 'maps' && !mapInited) initMap();
}

/* =======================================================
   CHALLAN LOOKUP
======================================================= */
function lookupChallan() {
  const reg = document.getElementById('reg-inp').value.trim().replace(/\s/g,'').toUpperCase();
  const out  = document.getElementById('ch-result');
  if (!reg) { toast('⚠️ Please enter a registration number'); return; }

  if (DB[reg]) {
    renderResult(DB[reg], out);
  } else {
    out.innerHTML = `<div class="no-res">
      <div class="no-res-ico">✅</div>
      <div class="no-res-t">No Challans Found</div>
      <div class="no-res-s">No active challans for <strong>${reg}</strong>.<br>The vehicle has a clean record on this platform.</div>
    </div>`;
  }
}

function quickLook(reg) {
  document.getElementById('reg-inp').value = reg;
  lookupChallan();
  setTimeout(() => document.getElementById('ch-result').scrollIntoView({ behavior:'smooth', block:'start' }), 150);
}

function renderResult(d, out) {
  const pending  = d.challans.filter(c => c.status === 'pending');
  const totalAmt = pending.reduce((s, c) => s + c.amount, 0);
  const svgFn    = svgMap[d.type] || svgCar;

  const cards = d.challans.map(c => `
    <div class="card ch-card ch-${c.status}" id="card-${c.id}">
      <div class="cch-top">
        <div class="cch-ico">${c.icon}</div>
        <div>
          <div class="cch-rsn">${c.reason}</div>
          <div class="cch-id">${c.id} · ${c.law}</div>
        </div>
        <span class="sbadge s-${c.status}">${c.status === 'pending' ? '⚠️ Pending' : '✅ Paid'}</span>
      </div>
      <div class="cch-meta">
        <div class="cch-mc">📅 ${c.date}</div>
        <div class="cch-mc">📍 ${c.zone}</div>
      </div>
      <div class="cch-amt-row">
        <div>
          <div style="font-size:11px;color:var(--t2);margin-bottom:2px">Fine Amount</div>
          <div class="cch-amt ${c.status==='paid'?'cch-amt-paid':''}">₹${c.amount.toLocaleString('en-IN')}</div>
        </div>
      </div>
      <div class="cch-actions">
        ${c.status === 'pending'
          ? `<button class="btn btn-accent" onclick="openPay('${c.id}',${c.amount},'${c.reason.replace(/'/g,"\\'")}')" style="flex:1">💳 Pay Now</button>
             <button class="btn btn-ghost" onclick="disputeIt('${c.id}')" style="flex:1">⚠️ Dispute</button>`
          : `<button class="btn btn-green" disabled style="flex:1">✅ Paid</button>
             <button class="btn btn-ghost" onclick="toast('🧾 Receipt sent to registered email!')" style="flex:1">🧾 Receipt</button>`
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
        <div class="veh-own">👤 ${d.owner} &nbsp;·&nbsp; 📞 ${d.phone}</div>
        <div class="veh-meta">
          <div class="vm-chip">🔖 ${Object.keys(DB).find(k=>DB[k]===d)}</div>
          <div class="vm-chip">${typeLabel[d.type]}</div>
          ${pending.length > 0
            ? `<div class="vm-pend">⚠️ ${pending.length} Pending · ₹${totalAmt.toLocaleString('en-IN')} Due</div>`
            : `<div class="vm-chip" style="color:var(--green)">✅ No Pending Challans</div>`}
        </div>
      </div>
    </div>
    <div class="sec-label">Challan History</div>
    <div class="ch-cards">${cards}</div>`;
}

/* =======================================================
   PAY MODAL
======================================================= */
function openPay(id, amt, rsn) {
  currentPayId = id;
  document.getElementById('ps-ttl').textContent = `Pay Challan ${id}`;
  document.getElementById('ps-amt').textContent  = `₹${amt.toLocaleString('en-IN')}`;
  document.getElementById('ps-rsn').textContent  = rsn;
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
  card.classList.replace('ch-pend','ch-paid');
  card.querySelector('.sbadge').className = 'sbadge s-paid';
  card.querySelector('.sbadge').textContent = '✅ Paid';
  const amt = card.querySelector('.cch-amt');
  if (amt) amt.classList.add('cch-amt-paid');
  const acts = card.querySelector('.cch-actions');
  if (acts) acts.innerHTML = `<button class="btn btn-green" disabled style="flex:1">✅ Paid</button>
    <button class="btn btn-ghost" onclick="toast('🧾 Receipt sent to registered email!')" style="flex:1">🧾 Receipt</button>`;
}
function disputeIt(id) { toast('📝 Dispute filed for ' + id + '. You will be notified within 7 days.'); }

/* =======================================================
   OPENSTREETMAP + LEAFLET
======================================================= */
function initMap() {
  mapInited = true;

  // Restrict map panning to India to prevent endless scrolling/looping
  const indiaBounds = L.latLngBounds(
    [6.4626, 68.1097], // South-West
    [35.5133, 97.3953] // North-East
  );

  leafletMap = L.map('leaflet-map', {
    center: [28.6692, 77.4538], // Centered directly on Ghaziabad / Delhi NCR
    zoom: 14,
    minZoom: 5, // Prevents zooming out to see the whole earth
    maxBounds: indiaBounds,
    maxBoundsViscosity: 1.0, // Creates a hard bounce when hitting the edge
    zoomControl: true,
    attributionControl: true
  });

  // Added detectRetina for sharper graphics and noWrap to stop the map from repeating
  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 19,
    noWrap: true, // This explicitly stops the looping issue
    detectRetina: true // This fixes the "nasty" low-res image scaling
  }).addTo(leafletMap);

  leafletMap.zoomControl.setPosition('bottomright');

  // Try to get user location
  locateUser();
}

function locateUser() {
  if (!navigator.geolocation) return;
  navigator.geolocation.watchPosition(pos => {
    const { latitude: lat, longitude: lng, speed } = pos.coords;
    gpsSpeed = speed ? speed * 3.6 : 0;

    const latlng = [lat, lng];

    if (!userMarker) {
      userMarker = L.marker(latlng, {
        icon: L.divIcon({ className:'', html:'<div class="user-dot"></div>', iconSize:[16,16], iconAnchor:[8,8] }),
        zIndexOffset: 1000
      }).addTo(leafletMap)
        .bindPopup('<b style="font-family:Outfit,sans-serif">📍 Your Location</b>');
      leafletMap.setView(latlng, 15);
    } else {
      userMarker.setLatLng(latlng);
    }
  }, null, { enableHighAccuracy:true, timeout:15000, maximumAge:2000 });
}

function centerOnUser() {
  if (!leafletMap) return;
  if (userMarker) {
    leafletMap.setView(userMarker.getLatLng(), 16, { animate:true });
  } else {
    toast('⚠️ Waiting for GPS signal…');
    locateUser();
  }
}

/* Nominatim search */
function onMapSearch(val) {
  clearTimeout(srchTimer);
  const drop = document.getElementById('srch-drop');
  if (!val || val.length < 3) { drop.classList.remove('show'); drop.innerHTML=''; return; }

  srchTimer = setTimeout(() => {
    drop.classList.add('show');
    drop.innerHTML = '<div class="sd-loading">🔍 Searching…</div>';

    fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(val)}&format=json&limit=6&countrycodes=in&addressdetails=1`, {
      headers: { 'Accept-Language': 'en-IN', 'User-Agent': 'THI-SafetyApp/1.0' }
    })
    .then(r => r.json())
    .then(results => {
      if (!results.length) {
        drop.innerHTML = '<div class="sd-loading" style="color:var(--t3)">No results found</div>';
        return;
      }
      drop.innerHTML = results.map(r => {
        const name = r.name || r.display_name.split(',')[0];
        const addr = r.display_name;
        return `<div class="sd-item" onclick="selectPlace(${r.lat},${r.lon},'${name.replace(/'/g,"\\'")}','${addr.replace(/'/g,"\\'")}')">
          <span class="sd-ico">📌</span>
          <div><div class="sd-name">${name}</div><div class="sd-addr">${addr}</div></div>
        </div>`;
      }).join('');
    })
    .catch(() => {
      drop.innerHTML = '<div class="sd-loading" style="color:var(--red)">Search failed. Check connection.</div>';
    });
  }, 450);
}

function selectPlace(lat, lng, name, addr) {
  const drop = document.getElementById('srch-drop');
  drop.classList.remove('show');
  document.getElementById('map-inp').value = name;

  const latlng = [parseFloat(lat), parseFloat(lng)];

  if (destMarker) leafletMap.removeLayer(destMarker);
  destMarker = L.marker(latlng, {
    icon: L.divIcon({ className:'', html:'<div class="dest-pin"></div>', iconSize:[14,14], iconAnchor:[7,7] })
  }).addTo(leafletMap)
    .bindPopup(`<b style="font-family:Outfit,sans-serif">🎯 ${name}</b><br><span style="font-size:11px;color:var(--t2)">${addr}</span>`)
    .openPopup();

  // Get route from user location
  if (userMarker) {
    const o = userMarker.getLatLng();
    fetchRoute([o.lat, o.lng], latlng);
  } else {
    leafletMap.setView(latlng, 15, { animate:true });
    toast('📍 Destination set! Enable location for route.');
  }
}

function fetchRoute(origin, dest) {
  const url = `https://router.project-osrm.org/route/v1/driving/${origin[1]},${origin[0]};${dest[1]},${dest[0]}?overview=full&geometries=geojson`;

  fetch(url)
  .then(r => r.json())
  .then(data => {
    if (data.code !== 'Ok' || !data.routes.length) {
      toast('❌ Could not find route. Try a different destination.');
      return;
    }
    const route = data.routes[0];
    const coords = route.geometry.coordinates.map(c => [c[1], c[0]]);

    if (routeLine) leafletMap.removeLayer(routeLine);
    routeLine = L.polyline(coords, {
      color:'#ff6b35', weight:5, opacity:.88,
      lineJoin:'round', lineCap:'round'
    }).addTo(leafletMap);

    leafletMap.fitBounds(routeLine.getBounds(), { padding:[50,50], animate:true });

    const km   = (route.distance / 1000).toFixed(1);
    const mins = Math.round(route.duration / 60);
    document.getElementById('rb-dist').textContent = km + ' km';
    document.getElementById('rb-dur').textContent  = mins + ' min · via fastest route';
    document.getElementById('route-bar').classList.add('show');
    toast(`🗺️ Route: ${km} km · ${mins} mins`);
  })
  .catch(() => toast('⚠️ Routing failed. Check connection.'));
}

function clearRoute() {
  if (routeLine) { leafletMap.removeLayer(routeLine); routeLine = null; }
  if (destMarker){ leafletMap.removeLayer(destMarker); destMarker = null; }
  document.getElementById('route-bar').classList.remove('show');
  document.getElementById('map-inp').value = '';
}

// Close search dropdown on map click
document.addEventListener('click', e => {
  const drop = document.getElementById('srch-drop');
  if (!drop.contains(e.target) && !document.getElementById('map-inp').contains(e.target)) {
    drop.classList.remove('show');
  }
});

/* =======================================================
   CRASH DETECTION ENGINE
   Multi-factor scoring algorithm:
   Score = f(linearAcc) + f(jerk) + f(gyro) + context-gates
   Trigger when Score >= 65 and not in cooldown
======================================================= */
function initCrashDetection() {
  if (typeof DeviceMotionEvent === 'undefined') return;

  const attachMotion = () => {
    window.addEventListener('devicemotion', onMotion, { passive:true });
    window.addEventListener('deviceorientationabsolute', onOrientation, { passive:true });
    window.addEventListener('deviceorientation', onOrientation, { passive:true });
  };

  if (typeof DeviceMotionEvent.requestPermission === 'function') {
    // iOS 13+ — defer until user taps maps tab
    document.getElementById('ni-maps').addEventListener('click', () => {
      DeviceMotionEvent.requestPermission().then(s => { if (s==='granted') attachMotion(); }).catch(()=>{});
    }, { once:true });
  } else {
    attachMotion();
  }
}

function onMotion(e) {
  const acc = e.accelerationIncludingGravity;
  if (!acc || acc.x === null) return;

  const now = Date.now();
  const dt  = prevTime ? (now - prevTime) / 1000 : 0.1;
  prevTime  = now;
  if (dt <= 0 || dt > 2) return;

  const ax = acc.x||0, ay = acc.y||0, az = acc.z||0;
  const mag = Math.sqrt(ax*ax + ay*ay + az*az);

  // Rolling baseline (last 12 samples)
  accBuf.push(mag);
  if (accBuf.length > 12) accBuf.shift();
  const baseline = accBuf.reduce((a,b)=>a+b,0) / accBuf.length;
  const linAcc   = Math.max(0, mag - baseline);

  // Jerk (smoothed over last 4)
  const rawJerk = Math.abs(mag - prevMag) / Math.max(dt, 0.01);
  prevMag = mag;
  jerkBuf.push(rawJerk);
  if (jerkBuf.length > 4) jerkBuf.shift();
  const jerk = Math.max(...jerkBuf);

  // Rotation (from gyro event)
  const rot = gyroRate;

  // Rotation from motion event (if available)
  if (e.rotationRate && e.rotationRate.alpha !== null) {
    gyroRate = Math.sqrt(
      (e.rotationRate.alpha||0)**2 +
      (e.rotationRate.beta||0)**2 +
      (e.rotationRate.gamma||0)**2
    );
  }

  // ── SCORING ──────────────────────────────────────────
  let score = 0;

  // Factor 1: Linear acceleration spike (impact)
  if      (linAcc > 22) score += 45;
  else if (linAcc > 14) score += 30;
  else if (linAcc > 8 ) score += 14;

  // Factor 2: Jerk (sudden change in force)
  if      (jerk > 110) score += 30;
  else if (jerk > 55 ) score += 20;
  else if (jerk > 28 ) score += 10;

  // Factor 3: Gyroscope rotation (tumble/spin)
  if      (rot > 220) score += 25;
  else if (rot > 110) score += 15;
  else if (rot > 65 ) score += 8;

  // Context gate 1: GPS speed
  // If moving very slowly → almost certainly not a crash
  if      (gpsSpeed < 3 ) score *= 0.08;
  else if (gpsSpeed < 10) score *= 0.40;

  // Context gate 2: Rough road detection
  // Many high readings in last 30s → bumpy road, not crash
  const hiRecent = recentHighG.filter(t => now - t < 30000).length;
  if (hiRecent > 6) score *= 0.55;

  if (linAcc > 6) recentHighG.push(now);
  recentHighG = recentHighG.filter(t => now - t < 30000);

  // ── UPDATE SENSOR UI ─────────────────────────────────
  const s = Math.min(100, Math.round(score));
  updateSensorUI(linAcc, jerk, rot, s);

  // ── TRIGGER ──────────────────────────────────────────
  if (score >= 65 && !crashCooldown) triggerSOS();
}

function onOrientation(e) {
  if (e.beta !== null && e.gamma !== null) {
    gyroRate = Math.abs(e.beta||0) + Math.abs(e.gamma||0);
  }
}

function updateSensorUI(g, j, r, s) {
  const sv = (id, val, hi) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.textContent = val;
    el.classList.toggle('hi', hi);
  };
  sv('sv-g', g.toFixed(1)+' m/s²', g > 10);
  sv('sv-j', j.toFixed(0)+' m/s³', j > 50);
  sv('sv-r', r.toFixed(0)+'°/s',   r > 100);
  sv('sv-s', s,                      s > 60);
  const fill = document.getElementById('sv-sf');
  if (fill) {
    fill.style.width = s + '%';
    fill.style.background = s > 65 ? 'var(--red)' : s > 35 ? 'var(--yellow)' : 'var(--teal)';
  }
}

/* =======================================================
   SOS SYSTEM
======================================================= */
function triggerSOS() {
  if (crashCooldown) return;
  crashCooldown = true;
  sosSecs = 10;

  const ov = document.getElementById('sos-ov');
  ov.classList.add('on');
  document.getElementById('sos-num').textContent = sosSecs;
  document.getElementById('sos-ct').textContent  = sosSecs;

  sosTimer = setInterval(() => {
    sosSecs--;
    document.getElementById('sos-num').textContent = sosSecs;
    document.getElementById('sos-ct').textContent  = sosSecs;
    if (sosSecs <= 0) {
      clearInterval(sosTimer);
      sendSOS();
    }
  }, 1000);
}

function cancelSOS() {
  clearInterval(sosTimer);
  document.getElementById('sos-ov').classList.remove('on');
  toast('✅ SOS cancelled. Glad you\'re safe!');
  setTimeout(() => { crashCooldown = false; }, 30000);
}

function sendSOS() {
  document.getElementById('sos-ov').classList.remove('on');
  toast('🆘 Emergency SOS sent to contacts & nearest hospital!');
  setTimeout(() => { crashCooldown = false; }, 60000);
}

/* Desktop simulate crash */
function simCrash() {
  toast('⚡ Simulating crash detection…');
  setTimeout(() => {
    updateSensorUI(26.4, 118, 255, 88);
    if (!crashCooldown) triggerSOS();
  }, 700);
}

/* =======================================================
   UTILITIES
======================================================= */
let toastTimer;
function toast(msg) {
  const el = document.getElementById('toast');
  clearTimeout(toastTimer);
  el.textContent = msg;
  el.classList.add('show');
  toastTimer = setTimeout(() => el.classList.remove('show'), 3200);
}

/* =======================================================
   SMART SCROLL NAVBAR LOGIC
======================================================= */
const navbar = document.querySelector('nav');
let lastScrollY = 0;

// Attach scroll listeners to all scrollable screens
document.querySelectorAll('.screen').forEach(screen => {
  screen.addEventListener('scroll', (e) => {
    const currentScrollY = e.target.scrollTop;

    // Ignore tiny accidental scrolls (less than 10px) to prevent jitter
    if (Math.abs(currentScrollY - lastScrollY) < 10) return;

    // If scrolling down AND past the top 50px of the screen
    if (currentScrollY > lastScrollY && currentScrollY > 50) {
      navbar.classList.add('nav-hidden'); // Hide it
    } else {
      navbar.classList.remove('nav-hidden'); // Show it
    }

    lastScrollY = currentScrollY;
  }, { passive: true });
});
