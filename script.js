document.addEventListener('DOMContentLoaded', () => {
    console.log("THI Interactive Dashboard Initialized.");
});

// --- Feature 1: DriveLegal (Vahan DB Mock) ---
function checkVahan() {
    const input = document.getElementById('plateInput').value.toUpperCase().trim();
    const resultBox = document.getElementById('vahanResult');
    
    if (!input) return;

    resultBox.classList.remove('hidden', 'clear', 'alert');
    resultBox.innerHTML = "Querying MoRTH database...";

    // Simulate API delay
    setTimeout(() => {
        // Mock logic: If plate contains "UP14" or "DL", simulate a found challan
        if (input.includes('UP14') || input.includes('DL') || input.includes('UP-14')) {
            resultBox.classList.add('alert');
            resultBox.innerHTML = `<strong>Status: Action Required</strong><br>1 Pending Challan found for ${input}.<br>Offense: Stop line violation at Mohan Nagar intersection.`;
        } else {
            resultBox.classList.add('clear');
            resultBox.innerHTML = `<strong>Status: Clear</strong><br>No pending challans found for ${input}. Drive safely!`;
        }
    }, 800);
}

// --- Feature 2: RoadWatch (Pothole Mock) ---
let hazardCount = 0;
function simulatePothole() {
    hazardCount++;
    const logList = document.getElementById('hazardLog');
    
    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    
    const newLog = document.createElement('li');
    // Generating mock coordinates near the Delhi-Meerut Expressway region for realism
    const lat = (28.6 + Math.random() * 0.1).toFixed(4);
    const lng = (77.4 + Math.random() * 0.1).toFixed(4);
    
    newLog.innerHTML = `<strong>${timeString}</strong> - Sharp jolt detected.<br>GPS: ${lat}, ${lng} (Awaiting community verification)`;
    
    // Add to top of list
    logList.insertBefore(newLog, logList.firstChild);
}

// --- Feature 3: RoadSoS (Crash Modal Mock) ---
let sosInterval;
let timeLeft = 10;

function triggerCrash() {
    const modal = document.getElementById('sosModal');
    const timerDisplay = document.getElementById('sosTimer');
    
    // Reset values
    timeLeft = 10;
    timerDisplay.innerText = timeLeft;
    timerDisplay.style.color = "white";
    document.querySelector('.sos-title').innerText = "CRASH DETECTED";
    
    // Show modal
    modal.classList.remove('hidden');
    
    // Start countdown
    sosInterval = setInterval(() => {
        timeLeft--;
        timerDisplay.innerText = timeLeft;
        
        if (timeLeft <= 0) {
            clearInterval(sosInterval);
            timerDisplay.innerText = "ALERTS DEPLOYED";
            timerDisplay.style.color = "#e74c3c";
            document.querySelector('.sos-title').innerText = "EMERGENCY PROTOCOL ACTIVE";
            
            // Auto-close after sending (for demo purposes)
            setTimeout(() => {
                cancelSos();
                alert("Demo Note: Overpass API payload sent to nearest hospital and emergency contacts via background SMS.");
            }, 3000);
        }
    }, 1000);
}

function cancelSos() {
    const modal = document.getElementById('sosModal');
    modal.classList.add('hidden');
    clearInterval(sosInterval);
}
