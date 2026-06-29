import { useState, useEffect } from 'react';
import Card from '../components/Card';
import NewsItem from '../components/NewsItem';
import OppItem from '../components/OppItem';
import PriceRow from '../components/PriceRow';
import Loader from '../components/Loader';
import { API_BASE } from '../hooks/useApi';

const COMPANIES = ['','ExxonMobil','Chevron','Shell','BP','Halliburton','SLB','ConocoPhillips'];

export default function Digest() {
  const [company, setCompany] = useState('');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const url = `${API_BASE}/api/intelligence-digest${company ? `?company=${encodeURIComponent(company)}` : ''}`;
    fetch(url)
      .then(r => r.json())
      .then(json => { setData(json.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [company]);

  return (
    <div>
      <Card>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:24 }}>
          <span style={{ fontSize:15, fontWeight:600 }}>Intelligence Digest</span>
          <select
            value={company}
            onChange={e => setCompany(e.target.value)}
            style={{
              background:'rgba(20,20,36,0.6)', border:'1px solid var(--border)',
              color:'var(--text)', padding:'5px 10px', borderRadius:6,
              fontSize:12, fontFamily:'inherit', cursor:'pointer'
            }}
          >
            {COMPANIES.map(c => <option key={c} value={c}>{c || 'All Companies'}</option>)}
          </select>
        </div>

        {loading ? <Loader /> : !data ? null : (
          <div style={{ maxHeight:'calc(100vh - 200px)', overflowY:'auto' }}>

            {/* Market snapshot */}
            <div style={{ marginBottom:24 }}>
              <div style={{ fontSize:10, fontWeight:600, textTransform:'uppercase', letterSpacing:'0.1em', color:'var(--muted)', marginBottom:8 }}>Market Snapshot</div>
              <p style={{ color:'var(--muted)', fontSize:13, lineHeight:1.7, marginBottom:12 }}>{data.marketMonitor?.summary}</p>
              <div style={{ display:'flex', gap:24, flexWrap:'wrap' }}>
                {[
                  ['WTI', `$${data.marketMonitor?.data?.crudeOil?.wti?.price?.toFixed(2)}`],
                  ['Brent', `$${data.marketMonitor?.data?.crudeOil?.brent?.price?.toFixed(2)}`],
                  ['Nat Gas', `$${data.marketMonitor?.data?.naturalGas?.henryHub?.price?.toFixed(2)}`],
                  ['Rig Count', data.marketMonitor?.data?.rigCount?.total],
                ].map(([label, val]) => (
                  <div key={label}>
                    <div style={{ fontSize:11, color:'var(--muted)' }}>{label}</div>
                    <strong>{val}</strong>
                  </div>
                ))}
              </div>
            </div>

            {/* Top news */}
            <div style={{ marginBottom:24 }}>
              <div style={{ fontSize:10, fontWeight:600, textTransform:'uppercase', letterSpacing:'0.1em', color:'var(--muted)', marginBottom:8 }}>
                Top News ({(data.topNews?.stories||[]).length} stories)
              </div>
              {(data.topNews?.stories||[]).slice(0,5).map((s,i) => <NewsItem key={i} story={s} />)}
            </div>

            {/* Opportunities */}
            <div style={{ marginBottom:24 }}>
              <div style={{ fontSize:10, fontWeight:600, textTransform:'uppercase', letterSpacing:'0.1em', color:'var(--muted)', marginBottom:8 }}>
                Deal Radar ({(data.opportunities||[]).length} opportunities)
              </div>
              {(data.opportunities||[]).slice(0,5).map((o,i) => <OppItem key={i} item={o} />)}
            </div>

            {/* Company-specific */}
            {data.companyNews && (
              <div style={{ marginBottom:24 }}>
                <div style={{ fontSize:10, fontWeight:600, textTransform:'uppercase', letterSpacing:'0.1em', color:'var(--muted)', marginBottom:8 }}>
                  {company} News ({(data.companyNews?.articles||[]).length} articles)
                </div>
                {(data.companyNews?.articles||[]).slice(0,5).map((s,i) => <NewsItem key={i} story={s} />)}
              </div>
            )}

            <div style={{ color:'var(--muted)', fontSize:11 }}>
              Generated: {new Date(data.timestamp).toLocaleString()}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
