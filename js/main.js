// js/main.js

import { initUI, go, toast } from './ui.js';
import { initSensors, triggerSOS, cancelSOS, simCrash } from './sensors.js';
import { lookupChallan, quickLook, openPay, closePay, selPM, confirmPay, disputeIt } from './challan.js';
import { initMap, centerOnUser, startTrip, endTrip, clearRoute } from './map.js';

// 1. RUN INITIALIZATION DIRECTLY (No DOMContentLoaded wrapper needed for modules!)
initUI();
initSensors();

// 2. EXPOSE UI TO WINDOW
window.go = (tab) => {
  go(tab);
  if (tab === 'maps') initMap();
};
window.toast = toast;

// 3. EXPOSE SENSORS TO WINDOW
window.triggerSOS = triggerSOS;
window.cancelSOS = cancelSOS;
window.simCrash = simCrash;

// 4. EXPOSE CHALLAN TO WINDOW
window.lookupChallan = lookupChallan;
window.quickLook = quickLook;
window.openPay = openPay;
window.closePay = closePay;
window.selPM = selPM;
window.confirmPay = confirmPay;
window.disputeIt = disputeIt;

// 5. EXPOSE MAP TO WINDOW
window.centerOnUser = centerOnUser;
window.startTrip = startTrip;
window.endTrip = endTrip;
window.clearRoute = clearRoute;
window.go = (tab) => {
  go(tab);
  if (tab === 'maps') {
    initMap();
    setTimeout(fixMapSize, 400); // Wait for the CSS animation to finish before fixing size
  }
};
