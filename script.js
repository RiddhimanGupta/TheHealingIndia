document.addEventListener('DOMContentLoaded', () => {
    console.log("THI Interactive Dashboard Initialized.");
});

// --- Feature 0: Google Maps Initialization ---
let map;
function initMap() {
    // Center map around Ghaziabad / Delhi NCR region
    const centerLocation = { lat: 28.6692, lng: 77.4538 };

    // Set custom dark mode map styling so it matches your website theme
    const darkMapStyle = [
        { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
        { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
        { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
        { featureType: "road", elementType: "geometry", stylers: [{ color: "#38414e" }] },
        { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#212a37" }] },
        { featureType: "water", elementType: "geometry", stylers: [{ color: "#17263c" }] }
    ];

    map = new google.maps.Map(document.getElementById("map"), {
        center: centerLocation,
        zoom: 12,
        styles: darkMapStyle,
        disableDefaultUI: true // Keeps the map looking clean like a custom app
    });

    // Mock a Rider Location Marker
    new google.maps.Marker({
        position: centerLocation,
        map: map,
        title: "Rider Current Location",
        icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 8,
            fillColor: "#3498db",
            fillOpacity: 1,
            strokeWeight: 2,
            strokeColor: "#ffffff"
        }
    });

    // Mock an active "Challan Enforcement Zone"
    new google.maps.Circle({
        strokeColor: "#e74c3c",
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: "#e74c3c",
        fillOpacity: 0.35,
        map: map,
        center: { lat: 28.6750, lng: 77.4300 }, // Slightly offset from rider
        radius: 1500 // 1.5km radius
    });
}

// --- Feature 1: DriveLegal (Vahan DB Mock) ---
function checkVahan() {
    const input = document.getElementById('plateInput').value.toUpperCase().trim();
    const resultBox = document.getElementById('vahanResult');
    
    if (!input) return;

    resultBox.classList.remove('hidden', 'clear', 'alert');
    resultBox.innerHTML = "Querying MoRTH database...";

    setTimeout(() => {
        if (input.includes('UP14') || input.includes('DL') || input.includes('UP-14')) {
            resultBox.classList.add('alert');
            resultBox.innerHTML = `<strong>Status: Action Required</strong><br>1 Pending Challan found for ${input}.<br>Offense: Stop line violation at Mohan Nagar intersection.`;
        } else {
            resultBox.classList.add('clear');
            resultBox.innerHTML = `<strong>Status: Clear</strong><br>No pending challans found for ${input}. Drive safely!`;
        }
    }, 800);
}

// --- Feature 2: RoadSoS (Crash Modal Mock) ---
let sosInterval;
let timeLeft = 10;

function triggerCrash() {
    const modal = document.getElementById('sosModal');
    const timerDisplay = document.getElementById('sosTimer');
    
    timeLeft = 10;
    timerDisplay.innerText = timeLeft;
    timerDisplay.style.color = "white";
    document.querySelector('.sos-title').innerText = "CRASH DETECTED";
    
    modal.classList.remove('hidden');
    
    sosInterval = setInterval(() => {
        timeLeft--;
        timerDisplay.innerText = timeLeft;
        
        if (timeLeft <= 0) {
            clearInterval(sosInterval);
            timerDisplay.innerText = "ALERTS DEPLOYED";
            timerDisplay.style.color = "#e74c3c";
            document.querySelector('.sos-title').innerText = "EMERGENCY PROTOCOL ACTIVE";
            
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
