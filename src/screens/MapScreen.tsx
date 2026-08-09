import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMap, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Crosshair, X, Square, Navigation } from 'lucide-react';

// Custom icons
const createArrowIcon = (heading: number) => {
  return L.divIcon({
    className: '',
    html: `<div style="transform: rotate(${heading}deg); width: 28px; height: 28px; display: flex; align-items: center; justify-content: center;">
      <svg viewBox="0 0 24 24" fill="var(--primary)" stroke="#fff" stroke-width="2" style="width: 100%; height: 100%;">
        <path d="M12 2L2 22l10-4 10 4L12 2z" />
      </svg>
    </div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14]
  });
};

const destIcon = L.divIcon({
  className: '',
  html: '<div style="width: 14px; height: 14px; background-color: var(--danger); border: 2px solid #fff; border-radius: 50%; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>',
  iconSize: [14, 14],
  iconAnchor: [7, 7]
});

// Map Controller Component
const MapController: React.FC<{
  center: [number, number] | null;
  userPos: [number, number] | null;
  destPos: [number, number] | null;
  routeCoords: [number, number][];
  isTravelling: boolean;
}> = ({ center, userPos, routeCoords, isTravelling }) => {
  const map = useMap();

  useEffect(() => {
    if (center && !isTravelling) {
      map.setView(center, 15, { animate: true });
    }
  }, [center, map, isTravelling]);

  useEffect(() => {
    if (isTravelling && userPos) {
      map.setView(userPos, 18, { animate: true, duration: 0.6 });
    }
  }, [isTravelling, userPos, map]);

  useEffect(() => {
    if (routeCoords.length > 0 && !isTravelling) {
      const bounds = L.latLngBounds(routeCoords);
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [routeCoords, map, isTravelling]);

  return null;
};


interface MapScreenProps {
  showToast: (msg: string) => void;
  triggerSOS: () => void;
  crashCooldown: boolean;
}

const MapScreen: React.FC<MapScreenProps> = ({ showToast, triggerSOS, crashCooldown }) => {
  const [userPos, setUserPos] = useState<[number, number] | null>(null);
  const [userHeading, setUserHeading] = useState(0);
  const [destPos, setDestPos] = useState<[number, number] | null>(null);
  const [routeCoords, setRouteCoords] = useState<[number, number][]>([]);
  const [routeDist, setRouteDist] = useState(0);
  const [routeDur, setRouteDur] = useState(0);
  
  const [isTravelling, setIsTravelling] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const searchTimeout = useRef<any>(null);
  
  // Sensors
  const [speed, setSpeed] = useState(0); // km/h
  const [gForce, setGForce] = useState(0);
  const [jerk, setJerk] = useState(0);
  const [rotMag, setRotMag] = useState(0);
  const historyRef = useRef<any[]>([]);
  const lastUpdateRef = useRef(Date.now());

  // Init Geolocation & Compass
  useEffect(() => {
    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude, longitude, speed, heading } = pos.coords;
        setUserPos([latitude, longitude]);
        if (speed) setSpeed(speed * 3.6);
        if (heading !== null && !isNaN(heading)) setUserHeading(heading);
      },
      () => showToast("⚠️ GPS access denied or unavailable."),
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 2000 }
    );

    const handleOrientation = (e: any) => {
      let alpha = e.webkitCompassHeading || (e.alpha ? 360 - e.alpha : null);
      if (alpha !== null) setUserHeading(alpha);
    };

    if (window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', handleOrientation, true);
    }

    return () => {
      navigator.geolocation.clearWatch(watchId);
      window.removeEventListener('deviceorientation', handleOrientation, true);
    };
  }, []);

  // Init Motion Sensors
  useEffect(() => {
    const handleMotion = (e: DeviceMotionEvent) => {
      let acc = e.acceleration;
      if (!acc || (acc.x === null && acc.y === null)) {
        acc = e.accelerationIncludingGravity;
      }
      if (!acc || acc.x === null) return;

      let x = acc.x || 0, y = acc.y || 0, z = acc.z || 0;
      if (e.accelerationIncludingGravity && !e.acceleration) z -= 9.81;

      const rot = e.rotationRate || { alpha: 0, beta: 0, gamma: 0 };
      const degToRad = Math.PI / 180;
      const gx = (rot.alpha || 0) * degToRad;
      const gy = (rot.beta || 0) * degToRad;
      const gz = (rot.gamma || 0) * degToRad;

      const now = Date.now();
      if (now - lastUpdateRef.current > 100) {
        lastUpdateRef.current = now;
        
        const aMag = Math.sqrt(x*x + y*y + z*z);
        const rMag = Math.sqrt(gx*gx + gy*gy + gz*gz);
        const gf = aMag / 9.81;
        
        setGForce(gf);
        setRotMag(rMag);

        historyRef.current.push({ time: now, aMag });
        historyRef.current = historyRef.current.filter(i => now - i.time <= 1500);

        let j = 0;
        if (historyRef.current.length >= 3) {
          const prev = historyRef.current[historyRef.current.length - 3];
          const dt = (now - prev.time) / 1000;
          j = dt > 0 ? Math.abs(aMag - prev.aMag) / dt : 0;
        }
        setJerk(j);

        if (gf > 4.0 && j > 60 && !crashCooldown) {
          triggerSOS();
        }
      }
    };

    window.addEventListener('devicemotion', handleMotion);
    return () => window.removeEventListener('devicemotion', handleMotion);
  }, [crashCooldown, triggerSOS]);

  const centerOnUser = () => {
    if (userPos) {
      // Re-trigger center by updating state ref slightly if needed, or just let MapController handle it
      setUserPos([...userPos]); 
    } else {
      showToast("⚠️ Waiting for GPS signal…");
    }
  };

  const handleSearch = (v: string) => {
    setSearchQuery(v);
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    
    if (v.length < 3) {
      setSearchResults([]);
      return;
    }

    searchTimeout.current = setTimeout(async () => {
      try {
        let viewbox = '';
        if (userPos) {
          viewbox = `&viewbox=${userPos[1]-0.5},${userPos[0]+0.5},${userPos[1]+0.5},${userPos[0]-0.5}&bounded=0`;
        }
        const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(v)}&format=json&limit=5&countrycodes=in&addressdetails=1${viewbox}`;
        const res = await fetch(url);
        const data = await res.json();
        setSearchResults(data);
      } catch (e) {
        console.error(e);
      }
    }, 500);
  };

  const selectPlace = async (lat: number, lon: number, name: string) => {
    setSearchQuery(name);
    setSearchResults([]);
    setDestPos([lat, lon]);

    if (userPos) {
      try {
        const url = `https://router.project-osrm.org/route/v1/driving/${userPos[1]},${userPos[0]};${lon},${lat}?overview=full&geometries=geojson`;
        const res = await fetch(url);
        const data = await res.json();
        if (data.code === 'Ok' && data.routes.length > 0) {
          const coords = data.routes[0].geometry.coordinates.map((c: any[]) => [c[1], c[0]]);
          setRouteCoords(coords);
          setRouteDist(data.routes[0].distance);
          setRouteDur(data.routes[0].duration);
        } else {
          showToast('❌ Could not find a route.');
        }
      } catch (e) {
        showToast('⚠️ Routing service unavailable.');
      }
    } else {
      showToast('📍 Destination set! Enable GPS to calculate route.');
    }
  };

  const clearRoute = () => {
    setDestPos(null);
    setRouteCoords([]);
    setSearchQuery('');
    setIsTravelling(false);
  };

  const formatTime = (seconds: number) => {
    const min = Math.round(seconds / 60);
    if (min < 60) return `${min} min`;
    return `${Math.floor(min/60)} hr ${min%60} min`;
  };

  return (
    <div style={{ position: 'relative', height: '100%', width: '100%', display: 'flex', flexDirection: 'column' }}>
      
      {/* Map Layer */}
      <div style={{ flex: 1, zIndex: 1 }}>
        <MapContainer 
          center={[28.6692, 77.4538]} 
          zoom={14} 
          style={{ height: '100%', width: '100%' }}
          zoomControl={false}
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; CARTO'
          />
          <MapController center={userPos} userPos={userPos} destPos={destPos} routeCoords={routeCoords} isTravelling={isTravelling} />
          
          {userPos && <Marker position={userPos} icon={createArrowIcon(userHeading)} zIndexOffset={1000} />}
          {destPos && <Marker position={destPos} icon={destIcon} />}
          {routeCoords.length > 0 && <Polyline positions={routeCoords} pathOptions={{ color: 'var(--primary)', weight: 6, lineCap: 'round', lineJoin: 'round' }} />}
        </MapContainer>
      </div>

      {/* Overlays UI */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'none', zIndex: 10, display: 'flex', flexDirection: 'column', padding: '16px' }}>
        
        {/* Top Search Bar */}
        {!isTravelling && (
          <div style={{ pointerEvents: 'auto', display: 'flex', gap: '8px', position: 'relative' }}>
            <div style={{ flex: 1, backgroundColor: 'var(--bg-elevated)', borderRadius: '12px', padding: '12px 16px', border: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.5)' }}>
              <span style={{ marginRight: '12px' }}>📍</span>
              <input 
                type="text" 
                placeholder="Search destination..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                style={{ background: 'transparent', border: 'none', color: '#fff', outline: 'none', flex: 1, fontSize: '16px' }}
              />
            </div>
            <button onClick={centerOnUser} style={{ backgroundColor: 'var(--bg-elevated)', border: '1px solid var(--border-light)', borderRadius: '12px', width: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.5)' }}>
              <Crosshair size={24} color="var(--primary)" />
            </button>

            {searchResults.length > 0 && (
              <div style={{ position: 'absolute', top: '56px', left: 0, right: '56px', backgroundColor: 'var(--bg-elevated)', border: '1px solid var(--border-light)', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 8px 24px rgba(0,0,0,0.8)' }}>
                {searchResults.map((r, i) => (
                  <div key={i} onClick={() => selectPlace(parseFloat(r.lat), parseFloat(r.lon), r.display_name.split(',')[0])} style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-light)', cursor: 'pointer' }}>
                    <div style={{ fontWeight: 600 }}>{r.display_name.split(',')[0]}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{r.display_name}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Live Navigation HUD (Top) */}
        {isTravelling && (
          <div className="animate-slide-up" style={{ pointerEvents: 'auto', backgroundColor: 'var(--bg-elevated)', borderRadius: '16px', padding: '16px', border: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', gap: '16px', boxShadow: '0 8px 24px rgba(0,0,0,0.8)' }}>
            <div style={{ width: '60px', height: '60px', borderRadius: '50%', border: '3px solid var(--primary)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ fontWeight: 800, fontSize: '18px' }}>{Math.round(speed)}</div>
              <div style={{ fontSize: '10px', color: 'var(--text-secondary)', fontWeight: 600 }}>KM/H</div>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--primary)', fontFamily: 'var(--font-display)' }}>{formatTime(routeDur)}</div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '13px', fontWeight: 600 }}>{(routeDist/1000).toFixed(1)} km remaining</div>
            </div>
            <button onClick={() => setIsTravelling(false)} style={{ backgroundColor: 'rgba(239, 68, 68, 0.15)', color: 'var(--danger)', padding: '12px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Square size={20} fill="currentColor" />
            </button>
          </div>
        )}

        <div style={{ flex: 1 }}></div>

        {/* Bottom Sensor Panel & Route Sheet */}
        <div style={{ pointerEvents: 'auto', display: 'flex', flexDirection: 'column', gap: '12px', paddingBottom: '90px' }}>
          
          <button onClick={() => triggerSOS()} className="card" style={{ padding: '12px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', color: 'var(--danger)', backgroundColor: 'var(--bg-elevated)', border: '1px solid var(--danger)', fontWeight: 600 }}>
            ⚡ Simulate Crash
          </button>
          
          <div className="card" style={{ padding: '16px', backgroundColor: 'var(--bg-elevated)' }}>
            <div style={{ fontWeight: 600, fontSize: '14px', marginBottom: '12px', display: 'flex', justifyContent: 'space-between' }}>
              Live Sensors
              <span style={{ color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <div style={{ width: '8px', height: '8px', backgroundColor: 'var(--success)', borderRadius: '50%' }}></div> Active
              </span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div><div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>G-Force</div><div style={{ fontWeight: 600 }}>{gForce.toFixed(2)} G</div></div>
              <div><div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Jerk</div><div style={{ fontWeight: 600 }}>{Math.round(jerk)} m/s³</div></div>
              <div><div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Rotation</div><div style={{ fontWeight: 600 }}>{Math.round(rotMag * (180/Math.PI))}°/s</div></div>
              <div><div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Score</div><div style={{ fontWeight: 600, color: 'var(--success)' }}>98</div></div>
            </div>
          </div>

          {!isTravelling && routeCoords.length > 0 && (
            <div className="card animate-slide-up" style={{ backgroundColor: 'var(--bg-surface)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                <div>
                  <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--primary)', fontFamily: 'var(--font-display)' }}>{formatTime(routeDur)}</div>
                  <div style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>{(routeDist/1000).toFixed(1)} km · Fastest route</div>
                </div>
                <button onClick={clearRoute} style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--bg-elevated)', borderRadius: '50%' }}>
                  <X size={18} />
                </button>
              </div>
              <button className="btn-primary" style={{ width: '100%' }} onClick={() => setIsTravelling(true)}>
                <Navigation size={20} style={{ transform: 'rotate(45deg)' }} fill="currentColor" />
                Start Trip
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default MapScreen;
