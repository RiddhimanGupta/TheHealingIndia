// js/main.js
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
