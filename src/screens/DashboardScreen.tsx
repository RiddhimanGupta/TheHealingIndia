import React from 'react';
import { Search, Map as MapIcon, AlertTriangle, ShieldAlert } from 'lucide-react';

interface DashboardProps {
  goToTab: (tab: string) => void;
  triggerSOS: () => void;
  showToast: (msg: string) => void;
}

const DashboardScreen: React.FC<DashboardProps> = ({ goToTab, triggerSOS, showToast }) => {
  return (
    <div className="screen-container animate-fade-in">
      <div style={{
        backgroundColor: 'var(--primary)',
        borderRadius: '16px',
        padding: '24px',
        color: '#fff',
        boxShadow: '0 10px 25px rgba(37, 99, 235, 0.15)' // subtle shadow, not glowing
      }}>
        <div style={{ opacity: 0.9, fontSize: '14px', marginBottom: '4px' }}>Good Evening, Rider 👋</div>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: '24px', fontWeight: 700, marginBottom: '20px' }}>
          Stay Safe on Every Delivery
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div><div style={{ fontSize: '20px', fontWeight: 700 }}>12</div><div style={{ fontSize: '12px', opacity: 0.8 }}>Trips</div></div>
          <div><div style={{ fontSize: '20px', fontWeight: 700 }}>47km</div><div style={{ fontSize: '12px', opacity: 0.8 }}>Distance</div></div>
          <div><div style={{ fontSize: '20px', fontWeight: 700 }}>98</div><div style={{ fontSize: '12px', opacity: 0.8 }}>Safety Score</div></div>
        </div>
      </div>

      <div>
        <div style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '12px' }}>Today's Overview</div>
        <div className="grid-2">
          <div className="card flex-col" style={{ alignItems: 'center', gap: '8px' }}>
            <div style={{ fontSize: '24px' }}>🚦</div>
            <div style={{ fontSize: '20px', fontWeight: 700, color: 'var(--danger)' }}>2</div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Challan Zones</div>
          </div>
          <div className="card flex-col" style={{ alignItems: 'center', gap: '8px' }}>
            <div style={{ fontSize: '24px' }}>🕳️</div>
            <div style={{ fontSize: '20px', fontWeight: 700, color: 'var(--warning)' }}>5</div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Potholes Flagged</div>
          </div>
          <div className="card flex-col" style={{ alignItems: 'center', gap: '8px' }}>
            <div style={{ fontSize: '24px' }}>🛡️</div>
            <div style={{ fontSize: '20px', fontWeight: 700, color: 'var(--success)' }}>0</div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Crash Alerts</div>
          </div>
          <div className="card flex-col" style={{ alignItems: 'center', gap: '8px' }}>
            <div style={{ fontSize: '24px' }}>⭐</div>
            <div style={{ fontSize: '20px', fontWeight: 700, color: 'var(--success)' }}>98</div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Safety Score</div>
          </div>
        </div>
      </div>

      <div>
        <div style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '12px' }}>Crash Detection</div>
        <div className="card flex-row" style={{ justifyContent: 'space-between' }}>
          <div className="flex-row" style={{ gap: '16px' }}>
            <div style={{ fontSize: '28px' }}>🛡️</div>
            <div>
              <div style={{ fontWeight: 600, fontSize: '16px' }}>Active Protection</div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Monitoring sensors in real-time</div>
            </div>
          </div>
          <div style={{ width: '12px', height: '12px', backgroundColor: 'var(--success)', borderRadius: '50%' }}></div>
        </div>
      </div>

      <div>
        <div style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '12px' }}>Quick Actions</div>
        <div className="grid-actions">
          
          <button className="card flex-row" style={{ gap: '16px', textAlign: 'left', padding: '12px 16px' }} onClick={() => goToTab('challan')}>
            <div style={{ padding: '10px', backgroundColor: 'var(--bg-elevated)', borderRadius: '12px', color: 'var(--primary)' }}><Search size={24} /></div>
            <div>
              <div style={{ fontWeight: 600 }}>Check Challan</div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Any reg. number</div>
            </div>
          </button>
          
          <button className="card flex-row" style={{ gap: '16px', textAlign: 'left', padding: '12px 16px' }} onClick={() => goToTab('maps')}>
            <div style={{ padding: '10px', backgroundColor: 'var(--bg-elevated)', borderRadius: '12px', color: 'var(--success)' }}><MapIcon size={24} /></div>
            <div>
              <div style={{ fontWeight: 600 }}>Open Maps</div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Navigate safely</div>
            </div>
          </button>
          
          <button className="card flex-row" style={{ gap: '16px', textAlign: 'left', padding: '12px 16px' }} onClick={() => { showToast('🆘 SOS sent to emergency contacts!'); triggerSOS(); }}>
            <div style={{ padding: '10px', backgroundColor: 'var(--bg-elevated)', borderRadius: '12px', color: 'var(--danger)' }}><ShieldAlert size={24} /></div>
            <div>
              <div style={{ fontWeight: 600 }}>Emergency SOS</div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Alert contacts now</div>
            </div>
          </button>
          
          <button className="card flex-row" style={{ gap: '16px', textAlign: 'left', padding: '12px 16px' }} onClick={() => showToast('🕳️ Hazard reported — thank you!')}>
            <div style={{ padding: '10px', backgroundColor: 'var(--bg-elevated)', borderRadius: '12px', color: 'var(--warning)' }}><AlertTriangle size={24} /></div>
            <div>
              <div style={{ fontWeight: 600 }}>Report Hazard</div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Help other riders</div>
            </div>
          </button>

        </div>
      </div>

    </div>
  );
};

export default DashboardScreen;
