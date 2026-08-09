import React from 'react';

interface HeaderProps {
  onSOSClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onSOSClick }) => {
  return (
    <header style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '16px 20px',
      borderBottom: '1px solid var(--border-light)',
      backgroundColor: 'var(--bg-elevated)',
      position: 'sticky',
      top: 0,
      zIndex: 50
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div style={{
          backgroundColor: 'var(--primary)',
          color: '#fff',
          fontWeight: 800,
          padding: '4px 8px',
          borderRadius: '8px',
          fontSize: '14px'
        }}>THI</div>
        <div style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 600,
          fontSize: '18px'
        }}>
          The Healing <span style={{ color: 'var(--primary)', fontStyle: 'italic' }}>India</span>
        </div>
      </div>
      
      <button 
        onClick={onSOSClick}
        style={{
          backgroundColor: 'var(--danger)',
          color: '#fff',
          padding: '6px 14px',
          borderRadius: '20px',
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          fontSize: '14px',
          boxShadow: '0 4px 12px rgba(239, 68, 68, 0.2)' // mild shadow, no glow
        }}
      >
        <div style={{ width: 8, height: 8, backgroundColor: '#fff', borderRadius: '50%' }} />
        SOS
      </button>
    </header>
  );
};

export default Header;
