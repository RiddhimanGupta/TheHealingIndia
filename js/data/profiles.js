// js/data/profiles.js

const C = {
  signal:      () => ({ icon:"🚦", reason:"Signal Jumping",                  amount:500,   zone:"Andheri East, Mumbai",            law:"Sec 119, MVA",    status:"pending" }),
  mobile:      () => ({ icon:"📱", reason:"Mobile Phone Use While Driving",   amount:1000,  zone:"BKC Signal, Mumbai",              law:"Sec 184, MVA",    status:"pending" }),
  helmet:      () => ({ icon:"⛑️", reason:"Riding Without Helmet",             amount:1000,  zone:"Connaught Place, New Delhi",      law:"Sec 129, MVA",    status:"pending" }),
  speed:       () => ({ icon:"⚡", reason:"Overspeeding (87 km/h in 60 zone)",amount:2000,  zone:"Outer Ring Road, Bengaluru",      law:"Sec 183, MVA",    status:"pending" }),
  wrongside:   () => ({ icon:"↔️", reason:"Wrong Side Riding",                 amount:500,   zone:"Silk Board Junction, Bengaluru",  law:"Sec 116, MVA",    status:"pending" }),
  noins:       () => ({ icon:"📋", reason:"No Valid Third-Party Insurance",    amount:2000,  zone:"MG Road, Bengaluru",              law:"Sec 196, MVA",    status:"pending" }),
  triple:      () => ({ icon:"👥", reason:"Triple Riding",                     amount:500,   zone:"Anna Salai, Chennai",             law:"Sec 128, MVA",    status:"pending" }),
  parking:     () => ({ icon:"🅿️", reason:"Illegal Parking in No-Parking Zone",amount:500,  zone:"Banjara Hills, Hyderabad",        law:"Sec 122, MVA",    status:"pending" }),
  seatbelt:    () => ({ icon:"🪢", reason:"Not Wearing Seatbelt",             amount:500,   zone:"Salt Lake, Kolkata",              law:"Sec 194B, MVA",   status:"pending" }),
  nopuc:       () => ({ icon:"🌫️", reason:"No Valid PUC Certificate",          amount:10000, zone:"CG Road, Ahmedabad",              law:"Sec 190(2), MVA", status:"pending" }),
  drunk:       () => ({ icon:"🍺", reason:"Drunken Driving",                   amount:10000, zone:"NH-48, Gurugram",                 law:"Sec 185, MVA",    status:"pending" }),
  speeding2:   () => ({ icon:"⚡", reason:"Overspeeding (94 km/h in 60 zone)",amount:2000,  zone:"NH-48, Pune Expressway",          law:"Sec 183, MVA",    status:"pending" }),
  // Paid variants
  signalPaid:  () => ({ icon:"🚦", reason:"Signal Jumping",                   amount:500,   zone:"MI Road, Jaipur",                 law:"Sec 119, MVA",    status:"paid"    }),
  helmetPaid:  () => ({ icon:"⛑️", reason:"Riding Without Helmet",             amount:1000,  zone:"Brigade Road, Bengaluru",         law:"Sec 129, MVA",    status:"paid"    }),
  speedPaid:   () => ({ icon:"⚡", reason:"Overspeeding (94 km/h in 60 zone)",amount:2000,  zone:"NH-48, Pune Expressway",          law:"Sec 183, MVA",    status:"paid"    }),
  parkingPaid: () => ({ icon:"🅿️", reason:"Illegal Parking",                  amount:500,   zone:"Anna Salai, Chennai",             law:"Sec 122, MVA",    status:"paid"    }),
  mobilePaid:  () => ({ icon:"📱", reason:"Mobile Phone Use While Driving",   amount:1000,  zone:"Linking Road, Mumbai",            law:"Sec 184, MVA",    status:"paid"    }),
};

const NAMES = ["Arjun Nair", "Vikram Singh", "Deepak Verma", "Ravi Shankar", "Mohammed Ali", "Venkat Rao", "Gopal Das", "Vijay Kumar", "Ramesh Babu", "Naresh Sharma", "Rakesh Tiwari", "Amit Srivastava", "Ganesh Rao", "Suresh Kumar", "Nisha Kumari", "Rajesh Patil", "Kiran Desai", "Prakash Jha", "Sanjay Dutt", "Rahul Dravid", "Mohan Lal", "Harish Chandra", "Anil Kapoor", "Sunil Shetty", "Ajay Devgn", "Karthik Aryan", "Praveen Kumar", "Ashok Leyland", "Srinivas Ramanujan", "Manoj Bajpayee", "Pradeep Kumar", "Satish Kaushik", "Raju Hirani", "Vikas Bahl", "Mahesh Bhatt", "Sandeep Reddy", "Naveen Polishetty", "Vinay Pathak", "Santosh Sivan", "Pawan Kalyan", "Rajesh Khanna", "Nitin Mukesh", "Tarun Mansukhani", "Varun Dhawan", "Vishal Bhardwaj", "Yash Chopra", "Akhil Akkineni", "Rohan Sippy", "Surya Sivakumar", "Aditya Chopra"];
const BIKES = ["Royal Enfield Classic 350", "Bajaj Pulsar NS200", "Hero Splendor Plus", "Honda Shine 100", "Yamaha FZ-S V3", "Bajaj CT100", "Bajaj Discover 125", "KTM Duke 200", "Royal Enfield Bullet 350", "Hero Glamour", "Hero Xpulse 200", "TVS Apache RTR 160", "Bajaj Avenger 160", "Hero HF Deluxe", "Honda CB Hornet", "TVS Raider 125", "Yamaha R15 V4", "Suzuki Gixxer SF", "KTM RC 200", "Royal Enfield Meteor 350", "Honda CB350", "Jawa 42", "Bajaj Dominar 400", "TVS Ronin", "Hero Xtreme 160R"];

const PROFILES = [];
const ALL_CHALLANS = [C.signal, C.mobile, C.helmet, C.speed, C.wrongside, C.noins, C.triple, C.parking, C.seatbelt, C.nopuc, C.drunk, C.speeding2, C.signalPaid, C.helmetPaid, C.speedPaid, C.parkingPaid, C.mobilePaid];

for (let i = 0; i < 50; i++) {
  const numChallans = i < 15 ? 0 : (i % 3) + 1; // 15 with 0 challans, others 1-3
  const challans = [];
  for(let j = 0; j < numChallans; j++) {
    challans.push(ALL_CHALLANS[(i * 7 + j * 3) % ALL_CHALLANS.length]());
  }
  PROFILES.push({
    name: NAMES[i % NAMES.length],
    vehicle: BIKES[i % BIKES.length],
    type: "bike",
    color: ["#1c2833", "#7b241c", "#1a5276", "#145a32", "#2c3e50", "#c0392b"][i % 6],
    phone: "+91 9" + (100000000 + i * 1234567).toString().padStart(9, '0'),
    challans: challans
  });
}

function svgBike(c) {
  return `<svg viewBox="0 0 248 112" xmlns="http://www.w3.org/2000/svg" class="veh-svg">
    <defs><linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${c}"/><stop offset="100%" stop-color="${c}" stop-opacity=".4"/>
    </linearGradient></defs>
    <path d="M68 88 L112 52 L152 62 L192 88" stroke="url(#bg)" stroke-width="7" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M112 52 L122 28 L158 28 L152 62" stroke="${c}" stroke-width="5" fill="${c}" opacity=".58"/>
    <rect x="117" y="22" width="50" height="10" rx="5" fill="${c}" opacity=".9"/>
    <ellipse cx="132" cy="50" rx="22" ry="12" fill="url(#bg)"/>
    <rect x="112" y="57" width="40" height="18" rx="5" fill="${c}" opacity=".38"/>
    <line x1="192" y1="56" x2="200" y2="88" stroke="${c}" stroke-width="6" stroke-linecap="round"/>
    <line x1="186" y1="56" x2="195" y2="88" stroke="${c}" stroke-width="3.5" stroke-linecap="round" opacity=".55"/>
    <rect x="183" y="22" width="28" height="5" rx="2.5" fill="${c}"/>
    <line x1="194" y1="22" x2="194" y2="38" stroke="${c}" stroke-width="4"/>
    <path d="M116 76 Q96 80 76 90" stroke="rgba(180,180,180,.4)" stroke-width="4" fill="none" stroke-linecap="round"/>
    <circle cx="66" cy="90" r="22" fill="#0e131e"/><circle cx="66" cy="90" r="13" fill="#1a2035"/><circle cx="66" cy="90" r="5.5" fill="#2a3248"/>
    <circle cx="198" cy="90" r="22" fill="#0e131e"/><circle cx="198" cy="90" r="13" fill="#1a2035"/><circle cx="198" cy="90" r="5.5" fill="#2a3248"/>
    <line x1="66" y1="68" x2="66" y2="112" stroke="#1e2840" stroke-width="1.5"/>
    <line x1="44" y1="90" x2="88" y2="90" stroke="#1e2840" stroke-width="1.5"/>
    <line x1="198" y1="68" x2="198" y2="112" stroke="#1e2840" stroke-width="1.5"/>
    <line x1="176" y1="90" x2="220" y2="90" stroke="#1e2840" stroke-width="1.5"/>
    <ellipse cx="204" cy="48" rx="9" ry="7" fill="rgba(255,255,200,.9)"/>
  </svg>`;
}

const SVG_FN = { bike: svgBike };
const TYPE_LABEL = { bike: "🏍️ Motorcycle" };

// Export exactly what the Challan algorithm needs
export { PROFILES, SVG_FN, TYPE_LABEL };
