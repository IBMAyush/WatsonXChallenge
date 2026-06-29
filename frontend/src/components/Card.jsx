import { useState } from 'react';

export default function Card({ title, children, style, accent = false }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? 'rgba(8,10,24,0.72)' : 'rgba(6,8,20,0.6)',
        border: `1px solid ${accent || hovered ? 'rgba(69,131,255,0.25)' : 'rgba(255,255,255,0.07)'}`,
        borderRadius: 10,
        padding: '16px 18px',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        transition: 'background 0.2s, border-color 0.2s',
        ...style
      }}
    >
      {title && (
        <div style={{
          fontSize: 10, fontWeight: 700, textTransform: 'uppercase',
          letterSpacing: '0.1em', color: 'var(--muted)', marginBottom: 14,
          display: 'flex', alignItems: 'center', gap: 6,
        }}>
          <span style={{
            display: 'inline-block', width: 3, height: 12,
            background: 'var(--accent)', borderRadius: 2, opacity: 0.7,
          }} />
          {title}
        </div>
      )}
      {children}
    </div>
  );
}
