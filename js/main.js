// js/main.js
import { initUI, go, toast } from './ui.js';
import { initSensors, triggerSOS, cancelSOS, simCrash } from './sensors.js';
import { lookupChallan, quickLook, openPay, closePay, selPM, confirmPay, disputeIt } from './challan.js';
import { initMap, centerOnUser, startTrip, endTrip, clearRoute } from './map.js';

document.addEventListener('DOMContentLoaded', () => {
  initUI();
  initSensors();
});

// Expose UI to window
window.go = (tab) => {
  go(tab);
  if (tab === 'maps') initMap();
};
window.toast = toast;

// Expose Sensors to window
window.triggerSOS = triggerSOS;
window.cancelSOS = cancelSOS;
window.simCrash = simCrash;

// Expose Challan to window
window.lookupChallan = lookupChallan;
window.quickLook = quickLook;
window.openPay = openPay;
window.closePay = closePay;
window.selPM = selPM;
window.confirmPay = confirmPay;
window.disputeIt = disputeIt;

// Expose Map to window
window.centerOnUser = centerOnUser;
window.startTrip = startTrip;
window.endTrip = endTrip;
window.clearRoute = clearRoute;// js/main.js
import { initUI, go, toast } from './ui.js';
import { initSensors, triggerSOS, cancelSOS } from './sensors.js';
import { lookupChallan, quickLook, openPay, closePay, selPM, confirmPay, disputeIt } from './challan.js';
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
window.lookupChallan = lookupChallan;
window.quickLook = quickLook;
window.openPay = openPay;
window.closePay = closePay;
window.selPM = selPM;
window.confirmPay = confirmPay;
window.disputeIt = disputeIt;
// window.lookupChallan = lookupChallan;
// window.centerOnUser = centerOnUser;
// ... map the rest of your button actions here ...
