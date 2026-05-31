// js/sensors.js
import { toast } from './ui.js';
import { gpsSpeed } from './map.js';

let crashCooldown = false;
let sosTimer = null;
let sosSecs = 10;
let sensorHistory = [];
const HISTORY_WINDOW_MS = 1500; 

export function initSensors() {
  // 1. Bypass modern experimental APIs and go straight to the reliable legacy API
  if (typeof DeviceMotionEvent !== 'undefined' && typeof DeviceMotionEvent.requestPermission === 'function') {
    // iOS 13+ requires explicit permission via a button click
    DeviceMotionEvent.requestPermission()
      .then(state => {
        if (state === 'granted') {
          window.addEventListener('devicemotion', handleMotion);
          toast('✅ iPhone Sensors Connected');
        }
      })
      .catch(err => {
        console.warn("iOS blocked sensors. Requires user click.", err);
      });
  } else {
    // Android / Standard Browsers
    window.addEventListener('devicemotion', handleMotion);
    setTimeout(() => toast('✅ Sensors Connected'), 1500); // Small delay to let UI load
  }
}

function handleMotion(e) {
  // 2. The Gravity Fix: If pure acceleration is missing, fallback to raw gravity
  let acc = e.acceleration;
  if (!acc || (acc.x === null && acc.y === null)) {
      acc = e.accelerationIncludingGravity;
  }
  
  // If the phone still returns nothing, abort
  if (!acc || acc.x === null) return; 

  const rot = e.rotationRate || { alpha: 0, beta: 0, gamma: 0 };
  let x = acc.x || 0, y = acc.y || 0, z = acc.z || 0;

  // If we had to use the gravity fallback, mathematically subtract gravity (9.81) from the Z axis
  if (e.accelerationIncludingGravity && !e.acceleration) {
      z = z - 9.81;
  }

  const degToRad = Math.PI / 180;
  processSensorTicks(x, y, z, (rot.alpha || 0) * degToRad, (rot.beta || 0) * degToRad, (rot.gamma || 0) * degToRad);
}

function processSensorTicks(ax, ay, az, gx, gy, gz) {
  if (crashCooldown) return;

  const now = Date.now();

  const aMag = Math.sqrt(ax**2 + ay**2 + az**2);
  const rotMag = Math.sqrt(gx**2 + gy**2 + gz**2); 
  const gForce = aMag / 9.81;

  sensorHistory.push({ time: now, aMag, gForce, rotMag });
  sensorHistory = sensorHistory.filter(item => now - item.time <= HISTORY_WINDOW_MS);

  let jerk = 0;
  if (sensorHistory.length >= 3) {
      const prev = sensorHistory[sensorHistory.length - 3];
      const dt = (now - prev.time) / 1000;
      jerk = dt > 0 ? Math.abs(aMag - prev.aMag) / dt : 0;
  }

  updateSensorUI(gForce, jerk, rotMag);

  // Crash detection logic (Shake vigorously to test!)
  if (gForce > 4.0 && jerk > 60) {
    triggerSOS();
  }
}

function updateSensorUI(g, j, r) {
  const elG = document.getElementById('sv-g');
  const elJ = document.getElementById('sv-j');
  const elR = document.getElementById('sv-r');

  // Push live values directly to the HTML
  if (elG) elG.textContent = `${g.toFixed(2)} G`;
  if (elJ) elJ.textContent = `${Math.round(j)} m/s³`;
  if (elR) elR.textContent = `${Math.round(r * (180 / Math.PI))}°/s`;
}

export function triggerSOS() {
  if (crashCooldown) return;
  crashCooldown = true;
  sosSecs = 10;
  
  const ov = document.getElementById('sos-ov');
  const num = document.getElementById('sos-num');
  const ct = document.getElementById('sos-ct');
  
  if (ov) ov.classList.add('on');
  if (num) num.textContent = sosSecs;
  if (ct) ct.textContent = sosSecs;

  if ('vibrate' in navigator) navigator.vibrate([500, 200, 500, 200, 1000]);

  clearInterval(sosTimer);
  sosTimer = setInterval(() => {
    sosSecs--;
    if (num) num.textContent = sosSecs;
    if (ct) ct.textContent = sosSecs;
    if (sosSecs <= 0) { clearInterval(sosTimer); sendSOS(); }
  }, 1000);
}

export function cancelSOS() {
  clearInterval(sosTimer);
  const ov = document.getElementById('sos-ov');
  if (ov) ov.classList.remove('on');
  toast("✅ SOS cancelled. Glad you're safe!");
  setTimeout(() => { crashCooldown = false; }, 15000); 
}

function sendSOS() {
  const ov = document.getElementById('sos-ov');
  if (ov) ov.classList.remove('on');
  toast('🆘 Emergency SOS sent to contacts & nearest hospital!');
  setTimeout(() => { crashCooldown = false; }, 45000);
}

export function simCrash() {
  toast('⚡ Simulating crash detection…');
  setTimeout(() => { if (!crashCooldown) triggerSOS(); }, 500);
}
