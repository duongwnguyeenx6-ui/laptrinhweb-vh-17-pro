import React from 'react';

function Notification({ message, type = 'success' }) {
  const accentColor = type === 'success' ? '#22c55e' : '#f97316';

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        zIndex: 9999,
        padding: '16px',
      }}
    >
      <div
        style={{
          maxWidth: 440,
          width: '100%',
          padding: '24px 28px',
          borderRadius: 24,
          background: `linear-gradient(180deg, rgba(15, 23, 42, 0.98), rgba(30, 41, 59, 0.98))`,
          border: `1px solid ${accentColor}33`,
          boxShadow: '0 30px 80px rgba(0, 0, 0, 0.35)',
          color: '#e2e8f0',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 52,
            height: 52,
            borderRadius: '50%',
            backgroundColor: accentColor,
            color: '#0f172a',
            fontWeight: 700,
            marginBottom: 16,
            fontSize: 24,
            boxShadow: `0 12px 24px ${accentColor}33`,
          }}
        >
          {type === 'success' ? '✓' : '!'}
        </div>
        <div style={{ fontSize: '1rem', lineHeight: 1.6, fontWeight: 600 }}>
          {message}
        </div>
      </div>
    </div>
  );
}

export default Notification;
