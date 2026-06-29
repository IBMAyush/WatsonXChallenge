const TAG = {
  market:     { bg: 'rgba(59,130,246,0.12)',  color: '#60a5fa',  label: 'Market' },
  policy:     { bg: 'rgba(139,92,246,0.12)',  color: '#a78bfa',  label: 'Policy' },
  company:    { bg: 'rgba(245,158,11,0.12)',  color: '#fbbf24',  label: 'Company' },
  emissions:  { bg: 'rgba(34,197,94,0.12)',   color: '#4ade80',  label: 'Emissions' },
  technology: { bg: 'rgba(236,72,153,0.12)',  color: '#f472b6',  label: 'Tech' },
};

export default function NewsItem({ story }) {
  const cat = story.category || 'market';
  const t   = TAG[cat] || TAG.market;

  return (
    <div style={{
      padding: '11px 0',
      borderBottom: '1px solid var(--border)',
    }}>
      <div style={{ fontSize: 13, fontWeight: 500, color: '#dde4f0', lineHeight: 1.45, marginBottom: 6 }}>
        {story.title}
      </div>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
        {story.source && (
          <span style={{ color: 'var(--muted)', fontSize: 11 }}>{story.source}</span>
        )}
        <span style={{
          fontSize: 10, fontWeight: 600, padding: '1px 6px', borderRadius: 3,
          background: t.bg, color: t.color, letterSpacing: '0.04em',
        }}>{t.label}</span>
        {story.ibmRelevance != null && (
          <span style={{
            fontSize: 10, color: 'var(--accent)', fontWeight: 500,
            background: 'rgba(69,131,255,0.08)', padding: '1px 6px', borderRadius: 3,
          }}>
            IBM {story.ibmRelevance}/100
          </span>
        )}
        {story.sentiment && (
          <span style={{ color: 'var(--muted)', fontSize: 10, textTransform: 'capitalize' }}>
            {story.sentiment}
          </span>
        )}
      </div>
    </div>
  );
}
