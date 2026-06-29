const PRI = {
  CRITICAL: { bg: 'rgba(239,68,68,0.12)',   color: '#f87171',  dot: '#ef4444' },
  URGENT:   { bg: 'rgba(245,158,11,0.12)',  color: '#fbbf24',  dot: '#f59e0b' },
  HIGH:     { bg: 'rgba(251,146,60,0.12)',  color: '#fb923c',  dot: '#fb923c' },
  MEDIUM:   { bg: 'rgba(69,131,255,0.10)',  color: '#7aa8ff',  dot: '#4583ff' },
  LOW:      { bg: 'rgba(34,197,94,0.10)',   color: '#4ade80',  dot: '#22c55e' },
};

function timeAgo(ts) {
  const m = Math.round((Date.now() - new Date(ts)) / 60000);
  if (m < 60) return `${m}m ago`;
  const h = Math.round(m / 60);
  return h < 24 ? `${h}h ago` : `${Math.round(h/24)}d ago`;
}

export default function OppItem({ item }) {
  const opp     = item.opportunity || item;
  const scoring = item.scoring || {};
  const pri     = scoring.priority || 'MEDIUM';
  const ps      = PRI[pri] || PRI.MEDIUM;
  const val     = opp.estimatedValue ? `$${(opp.estimatedValue / 1e6).toFixed(1)}M` : null;

  return (
    <div style={{
      padding: '12px 0',
      borderBottom: '1px solid var(--border)',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10, marginBottom: 5 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: '#dde4f0', lineHeight: 1.35 }}>
          {opp.title}
        </div>
        <div style={{
          flexShrink: 0, display: 'flex', alignItems: 'center', gap: 5,
          fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 5,
          background: ps.bg, color: ps.color,
        }}>
          <span style={{ width: 5, height: 5, borderRadius: '50%', background: ps.dot, display: 'inline-block' }} />
          {scoring.totalScore ?? '—'} · {pri}
        </div>
      </div>
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
        {opp.client && <span style={{ fontSize: 11, color: 'var(--text-dim)' }}>{opp.client}</span>}
        {val && (
          <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--yellow)',
            background: 'var(--yellow-dim)', padding: '1px 6px', borderRadius: 3 }}>
            {val}
          </span>
        )}
        {opp.businessSegment && <span style={{ fontSize: 11, color: 'var(--muted)' }}>{opp.businessSegment}</span>}
        {item.detectedAt && <span style={{ fontSize: 10, color: 'var(--muted)' }}>{timeAgo(item.detectedAt)}</span>}
      </div>
      {(scoring.recommendation || []).slice(0, 1).map((r, i) => (
        <div key={i} style={{ fontSize: 11, color: 'var(--muted)', marginTop: 4 }}>↳ {r}</div>
      ))}
    </div>
  );
}
