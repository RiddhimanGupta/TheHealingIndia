import React, { useEffect, useState } from 'react';

interface SOSOverlayProps {
  isActive: boolean;
  onCancel: () => void;
  onSend: () => void;
}

const SOSOverlay: React.FC<SOSOverlayProps> = ({ isActive, onCancel, onSend }) => {
  const [seconds, setSeconds] = useState(10);

  useEffect(() => {
    let timer: number;
    if (isActive) {
      setSeconds(10);
      if ('vibrate' in navigator) navigator.vibrate([500, 200, 500, 200, 1000]);
      
      timer = window.setInterval(() => {
        setSeconds((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            onSend();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isActive, onSend]);

  if (!isActive) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.85)',
      zIndex: 200,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      textAlign: 'center',
      backdropFilter: 'blur(8px)'
    }}>
      <div className="animate-slide-up" style={{ width: '100%' }}>
        
        <div style={{
          width: '180px', height: '180px',
          borderRadius: '50%',
          border: '4px solid var(--danger)',
          margin: '0 auto 32px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(239, 68, 68, 0.1)'
        }}>
          <div style={{ fontSize: '64px', fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--danger)', lineHeight: 1 }}>
            {seconds}
          </div>
          <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--danger)', letterSpacing: '2px', marginTop: '4px' }}>
            SECONDS
          </div>
        </div>

        <div style={{ fontSize: '28px', fontWeight: 800, fontFamily: 'var(--font-display)', marginBottom: '12px', color: '#fff' }}>
          ⚠️ Crash Detected!
        </div>
        
        <div style={{ color: 'var(--text-secondary)', fontSize: '15px', lineHeight: 1.6, marginBottom: '40px' }}>
          A potential crash was detected. If you are safe, press the button below. Otherwise, emergency services and your contacts will be alerted automatically.
        </div>

        <button 
          onClick={onCancel}
          style={{
            backgroundColor: 'var(--success)',
            color: '#fff',
            width: '100%',
            padding: '16px',
            borderRadius: '12px',
            fontSize: '18px',
            fontWeight: 700,
            fontFamily: 'var(--font-display)',
            marginBottom: '20px'
          }}
        >
          ✅ I'm Safe
        </button>

        <div style={{ color: 'var(--text-tertiary)', fontSize: '13px' }}>
          Auto-sending SOS in <span style={{ color: 'var(--danger)', fontWeight: 700 }}>{seconds}</span> seconds…
        </div>

      </div>
    </div>
  );
};

export default SOSOverlay;
