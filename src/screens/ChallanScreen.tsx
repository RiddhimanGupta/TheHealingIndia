import React, { useState } from 'react';
import { Search as SearchIcon } from 'lucide-react';
import { PROFILES, hashStr } from '../data/profiles';
import type { Profile } from '../types';

interface ChallanProps {
  showToast: (msg: string) => void;
  onPay: (id: string, amount: number, reason: string) => void;
}

const ChallanScreen: React.FC<ChallanProps> = ({ showToast, onPay }) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Profile | null>(null);

  const search = (q: string) => {
    const cleanQ = q.toUpperCase().trim();
    if (!cleanQ) {
      showToast('Please enter a vehicle number.');
      return;
    }
    if (cleanQ.length < 4) {
      showToast('Invalid registration number.');
      return;
    }
    
    setQuery(cleanQ);
    setLoading(true);
    setResult(null);
    
    setTimeout(() => {
      const idx = hashStr(cleanQ) % PROFILES.length;
      const p = PROFILES[idx];
      setResult({ ...p, registration: cleanQ });
      setLoading(false);
    }, 800);
  };

  return (
    <div className="screen-container animate-fade-in">
      <div>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: '24px', fontWeight: 700, marginBottom: '4px' }}>
          Bike Challan Lookup 🔍
        </div>
        <div style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
          Enter any bike registration number — any plate works
        </div>
      </div>

      <div style={{ display: 'flex', gap: '8px' }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <div style={{ position: 'absolute', left: '16px', top: '14px', color: 'var(--text-tertiary)' }}>
            <SearchIcon size={20} />
          </div>
          <input 
            type="text" 
            className="input-base"
            style={{ paddingLeft: '44px', textTransform: 'uppercase' }}
            placeholder="e.g. MH12AB1234"
            value={query}
            onChange={(e) => setQuery(e.target.value.toUpperCase())}
            onKeyDown={(e) => e.key === 'Enter' && search(query)}
          />
        </div>
        <button className="btn-primary" onClick={() => search(query)}>Search</button>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
        <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Try:</span>
        {['MH12AB1234', 'DL08XY5678', 'KA03MN9012'].map(plate => (
          <button 
            key={plate}
            onClick={() => search(plate)}
            style={{ 
              backgroundColor: 'var(--bg-elevated)', 
              border: '1px solid var(--border-light)', 
              padding: '4px 10px', 
              borderRadius: '16px', 
              fontSize: '12px',
              fontWeight: 500
            }}
          >
            {plate}
          </button>
        ))}
      </div>

      {loading && (
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
          <div style={{ display: 'inline-block', width: '24px', height: '24px', border: '3px solid var(--border-strong)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          <div style={{ marginTop: '16px' }}>Searching RTO database for {query}...</div>
        </div>
      )}

      {result && (
        <div className="animate-slide-up" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px', borderTop: `4px solid ${result.color}` }}>
            <div style={{ fontSize: '40px' }}>🏍️</div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '18px' }}>{result.vehicle}</div>
              <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '8px' }}>👤 {result.name} &nbsp;·&nbsp; 📞 {result.phone}</div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <span style={{ backgroundColor: 'var(--bg-elevated)', padding: '2px 8px', borderRadius: '4px', fontSize: '11px', border: '1px solid var(--border-light)' }}>🔖 {result.registration}</span>
                {result.challans.filter(c => c.status === 'pending').length > 0 ? (
                  <span style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 600 }}>⚠️ {result.challans.filter(c => c.status === 'pending').length} Pending</span>
                ) : (
                  <span style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)', padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 600 }}>✅ All Clear</span>
                )}
              </div>
            </div>
          </div>

          <div>
            <div style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '12px' }}>Challan History</div>
            
            {result.challans.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '32px 0' }}>
                <div style={{ fontSize: '42px', marginBottom: '12px' }}>🎉</div>
                <div style={{ color: 'var(--success)', fontWeight: 700, fontSize: '18px' }}>No Pending Challans!</div>
                <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>Ride safe.</div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {result.challans.map((c, i) => {
                  const cid = `${result.registration}-${i}-${hashStr(c.reason)}`;
                  const isPending = c.status === 'pending';
                  
                  return (
                    <div key={cid} className="card" style={{ borderLeft: `4px solid ${isPending ? 'var(--warning)' : 'var(--success)'}` }}>
                      <div className="flex-between" style={{ marginBottom: '12px' }}>
                        <div className="flex-row" style={{ gap: '12px' }}>
                          <div style={{ fontSize: '24px', backgroundColor: 'var(--bg-elevated)', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{c.icon}</div>
                          <div>
                            <div style={{ fontWeight: 600 }}>{c.reason}</div>
                            <div style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>ID: {cid.toUpperCase()} · {c.law}</div>
                          </div>
                        </div>
                      </div>
                      
                      <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                        📍 {c.zone}
                      </div>

                      <div className="flex-between" style={{ backgroundColor: 'var(--bg-elevated)', padding: '12px', borderRadius: '8px', marginBottom: '16px' }}>
                        <div>
                          <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Fine Amount</div>
                          <div style={{ fontSize: '18px', fontWeight: 700, color: isPending ? 'var(--text-main)' : 'var(--success)' }}>
                            ₹{c.amount.toLocaleString('en-IN')}
                          </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Status</div>
                          <div style={{ fontSize: '13px', fontWeight: 600, color: isPending ? 'var(--warning)' : 'var(--success)' }}>
                            {isPending ? '⚠️ Pending' : '✅ Paid'}
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '8px' }}>
                        {isPending ? (
                          <>
                            <button className="btn-primary" style={{ flex: 1, padding: '10px' }} onClick={() => onPay(cid, c.amount, c.reason)}>💳 Pay Now</button>
                            <button className="btn-secondary" style={{ flex: 1, padding: '10px' }} onClick={() => showToast(`📝 Dispute filed for ${cid.toUpperCase()}.`)}>⚠️ Dispute</button>
                          </>
                        ) : (
                          <>
                            <button className="btn-secondary" style={{ flex: 1, padding: '10px', opacity: 0.5 }} disabled>✅ Paid</button>
                            <button className="btn-secondary" style={{ flex: 1, padding: '10px' }} onClick={() => showToast('🧾 Receipt sent to registered email!')}>🧾 Receipt</button>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ChallanScreen;
