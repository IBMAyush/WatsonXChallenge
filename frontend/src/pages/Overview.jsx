import StatCard from '../components/StatCard';
import Card from '../components/Card';
import PriceRow from '../components/PriceRow';
import NewsItem from '../components/NewsItem';
import OppItem from '../components/OppItem';
import Loader from '../components/Loader';
import { useApi } from '../hooks/useApi';

export default function Overview() {
  const market = useApi('/api/market-monitor');
  const news   = useApi('/api/news/top?limit=5');
  const opps   = useApi('/api/opportunities?limit=5');

  const m = market.data?.data;

  return (
    <div>
      {/* Stat row */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:16, marginBottom:20 }}>
        {market.loading || !m ? (
          [0,1,2].map(i => <Card key={i}><Loader /></Card>)
        ) : (
          <>
            <StatCard
              title="WTI Crude"
              value={`$${m.crudeOil.wti.price.toFixed(2)}`}
              sub="per barrel"
              change={`${Math.abs(m.crudeOil.wti.changePercent).toFixed(2)}%`}
              changeVal={m.crudeOil.wti.changePercent}
            />
            <StatCard
              title="Natural Gas"
              value={`$${m.naturalGas.henryHub.price.toFixed(2)}`}
              sub="per MMBtu"
              change={`${Math.abs(m.naturalGas.henryHub.changePercent).toFixed(2)}%`}
              changeVal={m.naturalGas.henryHub.changePercent}
            />
            <StatCard
              title="US Rig Count"
              value={m.rigCount.total}
              sub="active rigs"
              change={`${Math.abs(m.rigCount.change)} this week`}
              changeVal={m.rigCount.change}
            />
          </>
        )}
      </div>

      {/* Prices + Insights */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, marginBottom:20 }}>
        <Card title="Market Prices">
          {market.loading || !m ? <Loader /> : (
            <>
              <PriceRow label="WTI Crude"     value={`$${m.crudeOil.wti.price.toFixed(2)}/bbl`}           changePct={m.crudeOil.wti.changePercent} />
              <PriceRow label="Brent Crude"   value={`$${m.crudeOil.brent.price.toFixed(2)}/bbl`}         changePct={m.crudeOil.brent.changePercent} />
              <PriceRow label="Henry Hub Gas" value={`$${m.naturalGas.henryHub.price.toFixed(2)}/MMBtu`}  changePct={m.naturalGas.henryHub.changePercent} />
              <PriceRow label="Crack Spread"  value={`$${m.refiningMargins.crackSpread.value.toFixed(2)}/bbl`} changePct={m.refiningMargins.crackSpread.change} />
            </>
          )}
        </Card>
        <Card title="Market Insights">
          {market.loading || !market.data ? <Loader /> : (
            (market.data.insights || []).slice(0,4).map((ins, i) => (
              <div key={i} style={{ display:'flex', gap:10, padding:'10px 0', borderBottom:'1px solid var(--border)' }}>
                <div style={{ width:8, height:8, borderRadius:'50%', flexShrink:0, marginTop:5,
                  background: ins.severity==='high' ? 'var(--red)' : ins.severity==='medium' ? 'var(--yellow)' : 'var(--green)'
                }} />
                <div>
                  <div style={{ fontSize:12 }}>{ins.message}</div>
                  <div style={{ fontSize:11, color:'var(--accent)', marginTop:2 }}>→ {ins.ibmOpportunity}</div>
                </div>
              </div>
            ))
          )}
        </Card>
      </div>

      {/* News + Opps */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
        <Card title="Top News">
          <div style={{ maxHeight:360, overflowY:'auto' }}>
            {news.loading ? <Loader /> : (news.data?.stories || []).map((s,i) => <NewsItem key={i} story={s} />)}
          </div>
        </Card>
        <Card title="Top Opportunities">
          <div style={{ maxHeight:360, overflowY:'auto' }}>
            {opps.loading ? <Loader /> : (opps.data || []).length
              ? (opps.data || []).map((o,i) => <OppItem key={i} item={o} />)
              : <div style={{ color:'var(--muted)', fontSize:12, padding:'12px 0' }}>No opportunities detected yet.</div>
            }
          </div>
        </Card>
      </div>
    </div>
  );
}
