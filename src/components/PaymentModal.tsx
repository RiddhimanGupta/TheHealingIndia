import React, { useState } from 'react';
import { CreditCard, Smartphone, Building, X } from 'lucide-react';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  amount: number;
  reason: string;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, onConfirm, amount, reason }) => {
  const [method, setMethod] = useState<'upi' | 'net' | 'card'>('upi');

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.6)',
      zIndex: 100,
      display: 'flex',
      alignItems: 'flex-end',
      backdropFilter: 'blur(4px)'
    }}>
      <div className="animate-slide-up" style={{
        backgroundColor: 'var(--bg-surface)',
        width: '100%',
        maxWidth: '500px',
        margin: '0 auto',
        borderTopLeftRadius: '24px',
        borderTopRightRadius: '24px',
        padding: '24px',
        borderTop: '1px solid var(--border-light)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div style={{ fontSize: '20px', fontWeight: 700, fontFamily: 'var(--font-display)' }}>Pay Challan</div>
          <button onClick={onClose} style={{ color: 'var(--text-secondary)' }}><X size={24} /></button>
        </div>

        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{ fontSize: '36px', fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--primary-light)' }}>
            ₹{amount.toLocaleString('en-IN')}
          </div>
          <div style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>{reason}</div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
          
          <button 
            onClick={() => setMethod('upi')}
            style={{
              display: 'flex', alignItems: 'center', gap: '16px', padding: '16px',
              backgroundColor: method === 'upi' ? 'rgba(37, 99, 235, 0.1)' : 'var(--bg-elevated)',
              border: `1px solid ${method === 'upi' ? 'var(--primary)' : 'var(--border-light)'}`,
              borderRadius: '12px', textAlign: 'left'
            }}
          >
            <div style={{ color: method === 'upi' ? 'var(--primary)' : 'var(--text-secondary)' }}><Smartphone size={24} /></div>
            <div>
              <div style={{ fontWeight: 600 }}>UPI Payment</div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Google Pay · PhonePe · Paytm</div>
            </div>
          </button>

          <button 
            onClick={() => setMethod('net')}
            style={{
              display: 'flex', alignItems: 'center', gap: '16px', padding: '16px',
              backgroundColor: method === 'net' ? 'rgba(37, 99, 235, 0.1)' : 'var(--bg-elevated)',
              border: `1px solid ${method === 'net' ? 'var(--primary)' : 'var(--border-light)'}`,
              borderRadius: '12px', textAlign: 'left'
            }}
          >
            <div style={{ color: method === 'net' ? 'var(--primary)' : 'var(--text-secondary)' }}><Building size={24} /></div>
            <div>
              <div style={{ fontWeight: 600 }}>Net Banking</div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>All major banks supported</div>
            </div>
          </button>

          <button 
            onClick={() => setMethod('card')}
            style={{
              display: 'flex', alignItems: 'center', gap: '16px', padding: '16px',
              backgroundColor: method === 'card' ? 'rgba(37, 99, 235, 0.1)' : 'var(--bg-elevated)',
              border: `1px solid ${method === 'card' ? 'var(--primary)' : 'var(--border-light)'}`,
              borderRadius: '12px', textAlign: 'left'
            }}
          >
            <div style={{ color: method === 'card' ? 'var(--primary)' : 'var(--text-secondary)' }}><CreditCard size={24} /></div>
            <div>
              <div style={{ fontWeight: 600 }}>Debit / Credit Card</div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Visa · Mastercard · RuPay</div>
            </div>
          </button>

        </div>

        <button className="btn-primary" style={{ width: '100%' }} onClick={onConfirm}>
          Pay Now →
        </button>
      </div>
    </div>
  );
};

export default PaymentModal;
