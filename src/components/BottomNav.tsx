import React from 'react';
import { Home, FileText, Map as MapIcon, Info } from 'lucide-react';

interface BottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'challan', label: 'Challan', icon: FileText },
    { id: 'maps', label: 'Maps', icon: MapIcon },
    { id: 'about', label: 'About', icon: Info },
  ];

  return (
    <nav style={{
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      height: '70px',
      backgroundColor: 'var(--bg-elevated)',
      borderTop: '1px solid var(--border-light)',
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'center',
      zIndex: 40,
      paddingBottom: 'env(safe-area-inset-bottom)'
    }}>
      {tabs.map(tab => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4px',
              color: isActive ? 'var(--primary)' : 'var(--text-secondary)',
              transition: 'color 0.2s'
            }}
          >
            <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
            <span style={{ fontSize: '11px', fontWeight: isActive ? 600 : 500 }}>{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
};

export default BottomNav;
