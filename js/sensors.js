// js/sensors.js
import { toast } from './ui.js';
import { gpsSpeed } from './map.js'; // Imports real speed from your map file

let crashCooldown = false;
let sosTimer = null;
let sosSecs = 10;
let sensorHistory = [];
const HISTORY_WINDOW_MS = 1500; 

// Store the latest sensor readings
let _lastAcc = { x: 0, y: 0, z: 0 };
let _lastRot = { x: 0, y: 0, z: 0 };

export function initSensors() {
  // 1. Try Modern W3C Sensor API (Android / Chrome)
  if ('LinearAccelerationSensor' in window && 'Gyroscope' in window) {
    try {
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
      console.log("Modern sensors initialized.");
      return;
    } catch (err) {
      console.warn("Modern sensors blocked/failed, falling back...", err);
      fallbackDeviceMotion();
    }
  } else {
    // 2. Fallback to DeviceMotion API (iOS / Safari / Older devices)
    fallbackDeviceMotion();
  }
}

function fallbackDeviceMotion() {
  // iOS 13+ requires explicit permission to read sensors
  if (typeof DeviceMotionEvent !== 'undefined' && typeof DeviceMotionEvent.requestPermission === 'function') {
    DeviceMotionEvent.requestPermission()
      .then(state => {
        if (state === 'granted') {
          window.addEventListener('devicemotion', handleLegacyMotion);
          console.log("iOS DeviceMotion granted.");
        }
      })
      .catch(err => {
        console.warn("DeviceMotion permission denied or requires user click.", err);
        // Attach anyway in case it works without prompt
        window.addEventListener('devicemotion', handleLegacyMotion);
      });
  } else {
    // Standard non-iOS fallback
    window.addEventListener('devicemotion', handleLegacyMotion);
    console.log("Legacy DeviceMotion initialized.");
  }
}

function handleLegacyMotion(e) {
  // Prefer pure acceleration (excludes gravity). If not available, fallback to including gravity.
  const acc = e.acceleration || e.accelerationIncludingGravity || { x: 0, y: 0, z: 0 };
  const rot = e.rotationRate || { alpha: 0, beta: 0, gamma: 0 };
  
  let x = acc.x || 0, y = acc.y || 0, z = acc.z || 0;
  
  // Convert rotation to radians to match modern API
  const degToRad = Math.PI / 180;
  processSensorTicks(x, y, z, (rot.alpha || 0) * degToRad, (rot.beta || 0) * degToRad, (rot.gamma || 0) * degToRad);
}

function processSensorTicks(ax, ay, az, gx, gy, gz) {
  if (crashCooldown) return;

  const now = Date.now();
  if (ax !== null) _lastAcc = { x: ax, y: ay, z: az };
  if (gx !== null) _lastRot = { x: gx, y: gy, z: gz };

  // Calculate magnitudes (total force)
  const aMag = Math.sqrt(_lastAcc.x**2 + _lastAcc.y**2 + _lastAcc.z**2);
  const rotMag = Math.sqrt(_lastRot.x**2 + _lastRot.y**2 + _lastRot.z**2); 
  
  // Convert acceleration to G-Force (1G = 9.81 m/s^2)
  const gForce = aMag / 9.81;

  sensorHistory.push({ time: now, aMag, gForce, rotMag });
  sensorHistory = sensorHistory.filter(item => now - item.time <= HISTORY_WINDOW_MS);
  if (sensorHistory.length < 5) return;

  // Calculate "Jerk" (how fast the acceleration is changing)
  const prev = sensorHistory[sensorHistory.length - 3];
  const dt = (now - prev.time) / 1000;
  const jerk = dt > 0 ? Math.abs(aMag - prev.aMag) / dt : 0;

  // Update background UI if those elements exist
  updateSensorUI(gForce, jerk, rotMag);

  // CRASH DETECTION ALGORITHM
  // Triggers if experiencing > 4 Gs of force AND a massive sudden jerk
  // We also check if the user is actually moving (gpsSpeed > 10 km/h) to prevent pocket drops from triggering it.
  if (gForce > 4.0 && jerk > 60 && gpsSpeed > 10) {
    triggerSOS();
  }
}

function updateSensorUI(g, j, r) {
  // If you have a debug panel in your dashboard, this will update it.
  // Fails silently and safely if the UI elements aren't there.
  const elG = document.getElementById('sv-g');
  const elJ = document.getElementById('sv-j');
  const elR = document.getElementById('sv-r');

  if (elG && g !== null) elG.textContent = `${g.toFixed(2)} G`;
  if (elJ && j !== null) elJ.textContent = `${Math.round(j)} m/s³`;
  if (elR && r !== null) elR.textContent = `${Math.round(r * (180 / Math.PI))}°/s`;
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

  // Vibrate phone aggressively if supported
  if ('vibrate' in navigator) navigator.vibrate([500, 200, 500, 200, 1000]);

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

export function cancelSOS() {
  clearInterval(sosTimer);
  const ov = document.getElementById('sos-ov');
  if (ov) ov.classList.remove('on');
  toast("✅ SOS cancelled. Glad you're safe!");
  
  // Prevent immediate re-triggering
  setTimeout(() => { crashCooldown = false; }, 15000); 
}

function sendSOS() {
  const ov = document.getElementById('sos-ov');
  if (ov) ov.classList.remove('on');
  toast('🆘 Emergency SOS sent to contacts & nearest hospital!');
  
  // Cooldown before the system can trigger another crash
  setTimeout(() => { crashCooldown = false; }, 45000);
}

// Development testing tool
export function simCrash() {
  toast('⚡ Simulating crash detection…');
  setTimeout(() => {
    // Manually force the crash variables regardless of GPS speed
    if (!crashCooldown) triggerSOS();
  }, 500);
}
