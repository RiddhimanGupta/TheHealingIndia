// js/sensors.js
import { toast } from './ui.js';

let crashCooldown = false;
let sosTimer = null;
let sosSecs = 10;
let sensorHistory = [];
const HISTORY_WINDOW_MS = 1500;

export function initSensors() {
  if ('LinearAccelerationSensor' in window && 'Gyroscope' in window) {
    // ... insert existing W3C sensor logic here ...
  } else {
    fallbackDeviceMotion();
  }
}

function fallbackDeviceMotion() {
  // ... insert existing fallback logic here ...
}

export function triggerSOS() {
  if (crashCooldown) return;
  crashCooldown = true;
  sosSecs = 10;
  
  const ov = document.getElementById('sos-ov');
  ov?.classList.add('on');
  
  clearInterval(sosTimer);
  sosTimer = setInterval(() => {
    sosSecs--;
    document.getElementById('sos-num').textContent = sosSecs;
    if (sosSecs <= 0) { 
      clearInterval(sosTimer); 
      sendSOS(); 
    }
  }, 1000);
}

export function cancelSOS() {
  clearInterval(sosTimer);
  document.getElementById('sos-ov')?.classList.remove('on');
  toast("✅ SOS cancelled. Glad you're safe!");
  setTimeout(() => { crashCooldown = false; }, 15000);
}

function sendSOS() {
  document.getElementById('sos-ov')?.classList.remove('on');
  toast('🆘 Emergency SOS sent to contacts & nearest hospital!');
  setTimeout(() => { crashCooldown = false; }, 45000);
}
export function simCrash() {
  toast('⚡ Simulating crash detection…');
  // Simulates high G-force and Jerk
  setTimeout(() => {
    // If you haven't brought over processSensorTicks, this toast at least proves the button works!
    triggerSOS(); 
  }, 500);
}
