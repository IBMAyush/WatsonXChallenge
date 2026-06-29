import Card from './Card';

export default function StatCard({ title, value, sub, change, changeVal }) {
  const up   = changeVal > 0;
  const down = changeVal < 0;
  const color = up ? 'var(--green)' : down ? 'var(--red)' : 'var(--muted)';
  const arrow = up ? '▲' : down ? '▼' : null;
  const badgeBg = up ? 'var(--green-dim)' : down ? 'var(--red-dim)' : 'rgba(255,255,255,0.04)';

  return (
    <Card title={title}>
      <div style={{ fontSize: 30, fontWeight: 700, letterSpacing: -1, lineHeight: 1.1, color: '#fff' }}>
        {value}
      </div>
      {sub && (
        <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 4 }}>{sub}</div>
      )}
      {change !== undefined && (
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 4, marginTop: 8,
          fontSize: 11, fontWeight: 600, color,
          background: badgeBg, padding: '2px 7px', borderRadius: 4,
        }}>
          {arrow && <span style={{ fontSize: 9 }}>{arrow}</span>}
          {change}
        </div>
      )}
    </Card>
  );
}
