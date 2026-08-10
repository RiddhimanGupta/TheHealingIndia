import React from 'react';

const AboutScreen: React.FC = () => {
  return (
    <div className="screen-container animate-fade-in">
      <div style={{
        backgroundColor: 'var(--bg-elevated)',
        border: '1px solid var(--border-light)',
        borderRadius: '16px',
        padding: '32px 24px',
        textAlign: 'center'
      }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: '28px', fontWeight: 800, marginBottom: '8px' }}>
          About THI
        </div>
        <div style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>
          Building a safer tomorrow for India's delivery heroes.
        </div>
      </div>


      <div>
        <div style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '12px' }}>The Team</div>
        <div className="card">
          <ul style={{ 
            fontSize: '15px', 
            color: 'var(--text-main)', 
            lineHeight: 2, 
            paddingLeft: '20px', 
            fontWeight: 500 
          }}>
            <li>Riddhiman Gupta</li>
            <li>Darshit Shrivastava</li>
            <li>Divij Shrivastava</li>
            <li>Ashita Arora</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AboutScreen;
