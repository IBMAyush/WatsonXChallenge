import Card from '../components/Card';
import StatCard from '../components/StatCard';
import OppItem from '../components/OppItem';
import Loader from '../components/Loader';
import { useApi } from '../hooks/useApi';

export default function DealRadar() {
  const opps   = useApi('/api/opportunities?limit=20');
  const status = useApi('/api/opportunities/status');

  const list = opps.data || [];
  const st   = status.data || {};

  const critical = list.filter(o => o.scoring?.priority === 'CRITICAL').length;
  const urgent   = list.filter(o => o.scoring?.priority === 'URGENT').length;

  return (
    <div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:16, marginBottom:20 }}>
        <StatCard title="Total Detected"  value={opps.loading ? '…' : list.length} sub="opportunities" changeVal={0} />
        <StatCard
          title="Critical / Urgent"
          value={opps.loading ? '…' : critical + urgent}
          sub={`${critical} critical · ${urgent} urgent`}
          changeVal={critical + urgent > 0 ? 1 : 0}
        />
        <Card title="Radar Status">
          <div style={{ fontSize:18, fontWeight:700, color: st.isMonitoring ? 'var(--green)' : 'var(--muted)' }}>
            {status.loading ? '…' : st.isMonitoring ? '● Active' : '○ Standby'}
          </div>
          <div style={{ fontSize:12, color:'var(--muted)', marginTop:4 }}>
            threshold: {st.alertThresholds?.critical ?? '—'}+ = critical
          </div>
        </Card>
      </div>

      <Card>
        <div style={{ display:'flex', justifyContent:'space-between', marginBottom:16 }}>
          <span style={{ fontSize:15, fontWeight:600 }}>Detected Opportunities</span>
          <span style={{ fontSize:12, color:'var(--muted)' }}>{list.length} total</span>
        </div>
        <div style={{ maxHeight:'calc(100vh - 300px)', overflowY:'auto' }}>
          {opps.loading ? <Loader /> : list.length
            ? list.map((o,i) => <OppItem key={i} item={o} />)
            : <div style={{ color:'var(--muted)', padding:'20px 0', textAlign:'center', fontSize:13 }}>
                No opportunities detected yet — Deal Radar is scanning...
              </div>
          }
        </div>
      </Card>
    </div>
  );
}
