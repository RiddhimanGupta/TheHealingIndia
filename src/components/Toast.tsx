import React, { useEffect } from 'react';

interface ToastProps {
  message: string | null;
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, onClose }) => {
  useEffect(() => {
    if (message) {
      const t = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(t);
    }
  }, [message, onClose]);

  if (!message) return null;

  return (
    <div className="animate-slide-up" style={{
      position: 'fixed',
      bottom: '100px',
      left: '50%',
      transform: 'translateX(-50%)',
      backgroundColor: 'var(--text-main)',
      color: 'var(--bg-main)',
      padding: '12px 20px',
      borderRadius: '24px',
      fontSize: '14px',
      fontWeight: 600,
      boxShadow: '0 8px 16px rgba(0,0,0,0.3)',
      zIndex: 300,
      whiteSpace: 'nowrap',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    }}>
      {message}
    </div>
  );
};

export default Toast;
