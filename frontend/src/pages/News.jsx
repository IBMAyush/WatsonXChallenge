import { useState, useEffect } from 'react';
import Card from '../components/Card';
import NewsItem from '../components/NewsItem';
import Loader from '../components/Loader';
import { API_BASE } from '../hooks/useApi';

const COMPANIES = ['ExxonMobil','Chevron','Shell','BP','Halliburton','SLB'];

export default function News() {
  const [company, setCompany] = useState('');
  const [search, setSearch] = useState('');
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const url = company
      ? `${API_BASE}/api/news/company/${encodeURIComponent(company)}?limit=20`
      : `${API_BASE}/api/news/top?limit=20`;
    fetch(url)
      .then(r => r.json())
      .then(json => {
        setArticles(json.data?.stories || json.data?.articles || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [company]);

  const filtered = search
    ? articles.filter(a => (a.title||'').toLowerCase().includes(search.toLowerCase()))
    : articles;

  return (
    <div>
      {/* Company filter */}
      <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginBottom:16 }}>
        <button onClick={() => setCompany('')} style={chipStyle(company === '')}>All</button>
        {COMPANIES.map(c => (
          <button key={c} onClick={() => setCompany(c)} style={chipStyle(company === c)}>{c}</button>
        ))}
      </div>

      {/* Search */}
      <input
        value={search}
        onChange={e => setSearch(e.target.value)}
        placeholder="Search news by keyword..."
        style={{
          width:'100%', background:'rgba(20,20,36,0.6)', border:'1px solid var(--border)',
          color:'var(--text)', padding:'8px 14px', borderRadius:8, fontSize:13,
          fontFamily:'inherit', outline:'none', marginBottom:16
        }}
      />

      <Card>
        <div style={{ display:'flex', justifyContent:'space-between', marginBottom:16 }}>
          <span style={{ fontSize:15, fontWeight:600 }}>
            {company ? `${company} News` : 'Top Stories'}
          </span>
          <span style={{ fontSize:12, color:'var(--muted)' }}>{filtered.length} articles</span>
        </div>
        <div style={{ maxHeight:'calc(100vh - 320px)', overflowY:'auto' }}>
          {loading ? <Loader /> : filtered.map((s,i) => <NewsItem key={i} story={s} />)}
        </div>
      </Card>
    </div>
  );
}

function chipStyle(active) {
  return {
    padding:'5px 12px', borderRadius:20, cursor:'pointer', fontSize:12,
    fontFamily:'inherit', transition:'all 0.15s',
    border: active ? '1px solid var(--accent)' : '1px solid var(--border)',
    background: active ? 'rgba(97,128,254,0.12)' : 'rgba(20,20,36,0.6)',
    color: active ? 'var(--accent)' : 'var(--muted)',
  };
}
