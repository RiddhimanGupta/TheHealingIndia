Here is a complete, well-structured `README.md` for your GitHub repository, generated directly from the provided project document.

---

# THI — The Healing India

**A Road Safety Companion Built for Those Who Cannot Afford to Stop** 



THI (The Healing India) is an integrated road safety platform that turns a rider's existing smartphone into a silent guardian. Built entirely as a Progressive Web App (PWA), it requires no additional hardware, costs nothing to use, and runs in the background while the rider focuses on the road.

This project was developed for the **National Road Safety Hackathon 2026** hosted by CoERS, IIT Madras, under the theme "AI in Road Safety".

## ⚠️ The Problem

India records over 75,000 two-wheeler deaths every year, equating to a rider dying every seven minutes. A disproportionate amount of this risk is carried by India's 12 million gig delivery workers.

* Delivery partners often work 8–14 continuous hours under algorithmic pressure and 10-minute delivery SLAs that dock earnings for lateness.


* They navigate unfamiliar routes, dark colony lanes, and weather hazards, often completely alone without post-crash support or a financial safety net.


* Financial anxiety sharpens decisions; a simple traffic fine can result in vehicle impoundment and total livelihood loss.



## 🚀 Core Modules & How They Work

THI addresses three hackathon challenge tracks within a single cohesive platform.

### 1. RoadSoS (Emergency Response)

**Track:** RoadSoS 

RoadSoS monitors three data streams simultaneously using the phone's built-in hardware without requiring external sensors, OBD devices, or dashcams.


**Impact Detection:** Uses the Accelerometer (`DeviceMotionEvent`) to measure G-Force spikes, detecting if sudden acceleration exceeds a crash threshold.

**Orientation Detection:** Uses the Gyroscope (`DeviceOrientation`) to measure rotation angle changes, distinguishing a real crash from a phone simply falling off a mount.

**Speed Confirmation:** Uses the GPS (`Geolocation API`) to detect a velocity drop to zero, confirming the vehicle was in motion and stopped upon impact.

**Human Check & Dispatch:** If a crash is detected, a 10-second countdown UI appears. If the rider does not press "I'm Safe", live coordinates are automatically dispatched to emergency contacts and the nearest hospital via the Overpass API.



### 2. DriveLegal (Legal Compliance)

**Track:** DriveLegal 

Traffic violations can lead to accumulated debt or vehicle impoundment. DriveLegal closes this gap by providing riders with clear visibility into their legal standing.


**Registration Lookup:** Simulates queries against the Vahan database to check vehicle status.


**Active Challan Tracking:** Pulls and displays all pending violations and fine amounts.


**Integrated Payments:** Features demo deep-links to UPI apps (Google Pay, PhonePe, Paytm) to allow immediate fine settlement.



### 3. RoadWatch (Community Hazard Mapping)

**Track:** RoadWatch 

RoadWatch builds a living, crowd-sourced map of road hazards that government databases often miss.


**Live Hazard Mapping:** Warns riders of dark colony lanes and hidden hazards.



**Pothole Reporting (Future Feature):** Potholes reported by riders will reflect directly on a live navigation overlay for all community users.



### 4. Safety Dashboard (Behavioral Analytics)

The dashboard provides a gamified safety score that riders can actively improve.


**Safety Score (0–100):** Calculates safe mileage traversed relative to community-flagged hazards and valid potholes.



**Trip Log & Challan Zones:** Tracks GPS mileage per session and counts geofencing hits to warn riders of heavy enforcement zones.



**Crash Alert History:** Maintains a RoadSoS event log for insurance or employer incident reports.



## 💻 Technology Stack

THI is built entirely on open web standards to ensure it runs smoothly on budget Android devices with minimal storage. The total app size is around 7MB.

| Layer | Technology | Function / Reason for Choice |
| --- | --- | --- |
| **Frontend** | HTML5, CSS3, ES6+ JavaScript (PWA) 

 | Installable directly from a URL; bypasses Play Store; ultra-lightweight.

 |
| **Hosting** | Vercel 

 | Auto-deploys from repository with a fast global CDN.

 |
| **Crash Detection** | <br>`DeviceMotionEvent` API 

 | Native browser API for accelerometer access without heavy SDKs.

 |
| **Crash Orientation** | <br>`DeviceOrientation` API 

 | Uses gyroscope data to eliminate false positives.

 |
| **Location & Speed** | <br>`Geolocation API` (GPS) 

 | Tracks speed for crash confirmation and coordinates for SOS dispatch.

 |
| **Navigation & Maps** | Leaflet.js 

 | Lightweight open-source mapping for hazard overlays without API key costs.

 |
| **Emergency POI** | Overpass API (OpenStreetMap) 

 | Locates the nearest hospital and police stations in real-time.

 |

## ⚙️ Current Working Stage

The live platform is a functional preview designed to demonstrate the core experience.

* 
**Crash Detection:** The sensor pipeline (accelerometer, gyroscope, GPS) is live with real-time readings. The 10-second countdown fires correctly on impact, though actual SOS messages are currently disabled for the demo.


* 
**Challan Lookup:** Displays pre-set simulated data for defined demo registration numbers (e.g., MH12AB1234, UP16XY4444) with randomized fine amounts. It is not currently connected to the live Vahan database.


* 
**Pothole Overlay:** Currently in development as a planned future feature.



## 🔮 Future Roadmap


**Gig Platform API Integration:** Surfacing safety scores on Zomato/Swiggy profiles to provide financial incentives for safe riding.


  
**Microinsurance Linkage:** Creating dynamic, per-trip coverage priced by the THI safety score.


  
**MoRTH Data Pipeline:** Feeding RoadWatch hazard reports into the government's road maintenance databases.


  
**Multilingual Legal Assistant:** Expanding DriveLegal with an NLP layer to answer traffic law queries in 12 regional languages.

 
**Wearable SOS Extension:** Forwarding crash alerts to smartwatches for hands-free confirmation.



## 👥 Team

* Darshit Shrivastava 


* Riddhiman Gupta 


* Ashita Arora 


* Divij Srivastava
