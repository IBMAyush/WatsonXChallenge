export default function Loader({ rows = 3 }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: '8px 0' }}>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="shimmer" style={{
          height: 14,
          width: i % 2 === 0 ? '80%' : '55%',
          borderRadius: 4,
        }} />
      ))}
    </div>
  );
}
