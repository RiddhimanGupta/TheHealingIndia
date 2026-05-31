// js/main.js
import { initUI, go, toast } from './ui.js';
import { initSensors, triggerSOS, cancelSOS } from './sensors.js';
// import { initMap, centerOnUser } from './map.js';
// import { lookupChallan, quickLook } from './challan.js';

// Wait for DOM
document.addEventListener('DOMContentLoaded', () => {
  initUI();
  initSensors();
});

// Expose functions to window for inline HTML onclick attributes
window.go = (tab) => {
  go(tab);
  // if (tab === 'maps') initMap();
};

window.toast = toast;
window.triggerSOS = triggerSOS;
window.cancelSOS = cancelSOS;
// window.lookupChallan = lookupChallan;
// window.centerOnUser = centerOnUser;
// ... map the rest of your button actions here ...
