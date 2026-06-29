export default function PriceRow({ label, value, changePct }) {
  const up   = changePct > 0;
  const down = changePct < 0;
  const color  = up ? 'var(--green)' : down ? 'var(--red)' : 'var(--muted)';
  const bg     = up ? 'var(--green-dim)' : down ? 'var(--red-dim)' : 'rgba(255,255,255,0.04)';
  const arrow  = up ? '▲' : down ? '▼' : null;

  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '9px 0', borderBottom: '1px solid var(--border)',
    }}>
      <span style={{ color: 'var(--muted)', fontSize: 12 }}>{label}</span>
      <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 14, fontWeight: 600, color: '#fff' }}>{value}</span>
        {changePct != null && (
          <span style={{
            fontSize: 10, fontWeight: 600, padding: '2px 6px', borderRadius: 4,
            background: bg, color,
            display: 'flex', alignItems: 'center', gap: 3,
          }}>
            {arrow && <span style={{ fontSize: 8 }}>{arrow}</span>}
            {Math.abs(changePct).toFixed(2)}%
          </span>
        )}
      </span>
    </div>
  );
}
