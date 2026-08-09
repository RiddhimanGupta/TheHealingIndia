import type { Profile, Challan } from '../types';

const C = {
  signal:      (): Challan => ({ icon:"🚦", reason:"Signal Jumping",                  amount:500,   zone:"Andheri East, Mumbai",            law:"Sec 119, MVA",    status:"pending" }),
  mobile:      (): Challan => ({ icon:"📱", reason:"Mobile Phone Use While Driving",   amount:1000,  zone:"BKC Signal, Mumbai",              law:"Sec 184, MVA",    status:"pending" }),
  helmet:      (): Challan => ({ icon:"⛑️", reason:"Riding Without Helmet",             amount:1000,  zone:"Connaught Place, New Delhi",      law:"Sec 129, MVA",    status:"pending" }),
  speed:       (): Challan => ({ icon:"⚡", reason:"Overspeeding (87 km/h in 60 zone)",amount:2000,  zone:"Outer Ring Road, Bengaluru",      law:"Sec 183, MVA",    status:"pending" }),
  wrongside:   (): Challan => ({ icon:"↔️", reason:"Wrong Side Riding",                 amount:500,   zone:"Silk Board Junction, Bengaluru",  law:"Sec 116, MVA",    status:"pending" }),
  noins:       (): Challan => ({ icon:"📋", reason:"No Valid Third-Party Insurance",    amount:2000,  zone:"MG Road, Bengaluru",              law:"Sec 196, MVA",    status:"pending" }),
  triple:      (): Challan => ({ icon:"👥", reason:"Triple Riding",                     amount:500,   zone:"Anna Salai, Chennai",             law:"Sec 128, MVA",    status:"pending" }),
  parking:     (): Challan => ({ icon:"🅿️", reason:"Illegal Parking in No-Parking Zone",amount:500,  zone:"Banjara Hills, Hyderabad",        law:"Sec 122, MVA",    status:"pending" }),
  seatbelt:    (): Challan => ({ icon:"🪢", reason:"Not Wearing Seatbelt",             amount:500,   zone:"Salt Lake, Kolkata",              law:"Sec 194B, MVA",   status:"pending" }),
  nopuc:       (): Challan => ({ icon:"🌫️", reason:"No Valid PUC Certificate",          amount:10000, zone:"CG Road, Ahmedabad",              law:"Sec 190(2), MVA", status:"pending" }),
  drunk:       (): Challan => ({ icon:"🍺", reason:"Drunken Driving",                   amount:10000, zone:"NH-48, Gurugram",                 law:"Sec 185, MVA",    status:"pending" }),
  speeding2:   (): Challan => ({ icon:"⚡", reason:"Overspeeding (94 km/h in 60 zone)",amount:2000,  zone:"NH-48, Pune Expressway",          law:"Sec 183, MVA",    status:"pending" }),
  signalPaid:  (): Challan => ({ icon:"🚦", reason:"Signal Jumping",                   amount:500,   zone:"MI Road, Jaipur",                 law:"Sec 119, MVA",    status:"paid"    }),
  helmetPaid:  (): Challan => ({ icon:"⛑️", reason:"Riding Without Helmet",             amount:1000,  zone:"Brigade Road, Bengaluru",         law:"Sec 129, MVA",    status:"paid"    }),
  speedPaid:   (): Challan => ({ icon:"⚡", reason:"Overspeeding (94 km/h in 60 zone)",amount:2000,  zone:"NH-48, Pune Expressway",          law:"Sec 183, MVA",    status:"paid"    }),
  parkingPaid: (): Challan => ({ icon:"🅿️", reason:"Illegal Parking",                  amount:500,   zone:"Anna Salai, Chennai",             law:"Sec 122, MVA",    status:"paid"    }),
  mobilePaid:  (): Challan => ({ icon:"📱", reason:"Mobile Phone Use While Driving",   amount:1000,  zone:"Linking Road, Mumbai",            law:"Sec 184, MVA",    status:"paid"    }),
};

const NAMES = ["Arjun Nair", "Vikram Singh", "Deepak Verma", "Ravi Shankar", "Mohammed Ali", "Venkat Rao", "Gopal Das", "Vijay Kumar", "Ramesh Babu", "Naresh Sharma"];
const BIKES = ["Royal Enfield Classic 350", "Bajaj Pulsar NS200", "Hero Splendor Plus", "Honda Shine 100", "Yamaha FZ-S V3", "Bajaj CT100", "KTM Duke 200"];

export const PROFILES: Profile[] = [];
const ALL_CHALLANS = [C.signal, C.mobile, C.helmet, C.speed, C.wrongside, C.noins, C.triple, C.parking, C.seatbelt, C.nopuc, C.drunk, C.speeding2, C.signalPaid, C.helmetPaid, C.speedPaid, C.parkingPaid, C.mobilePaid];

for (let i = 0; i < 50; i++) {
  const numChallans = i < 15 ? 0 : (i % 3) + 1;
  const challans: Challan[] = [];
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

export const hashStr = (s: string) => {
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = Math.imul(h, 33) ^ s.charCodeAt(i);
  return Math.abs(h);
};
