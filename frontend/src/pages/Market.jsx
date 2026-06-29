import Card from '../components/Card';
import StatCard from '../components/StatCard';
import PriceRow from '../components/PriceRow';
import Loader from '../components/Loader';
import { useApi } from '../hooks/useApi';

export default function Market() {
  const { data, loading } = useApi('/api/market-monitor');
  const m = data?.data;

  if (loading || !m) return <Card><Loader /></Card>;

  return (
    <div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:16, marginBottom:20 }}>
        <StatCard
          title="Brent Crude"
          value={`$${m.crudeOil.brent.price.toFixed(2)}`}
          sub="per barrel"
          change={`${Math.abs(m.crudeOil.brent.changePercent).toFixed(2)}%`}
          changeVal={m.crudeOil.brent.changePercent}
        />
        <StatCard
          title="OPEC+ Compliance"
          value={`${m.opecCompliance?.complianceRate ?? '—'}%`}
          sub="production adherence"
          changeVal={0}
        />
        <StatCard
          title="Crude Inventory"
          value={m.inventoryLevels ? `${(m.inventoryLevels.crude/1e6).toFixed(0)}M` : '—'}
          sub="barrels"
          changeVal={0}
        />
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, marginBottom:20 }}>
        <Card title="Crude Oil Prices">
          <PriceRow label="WTI"   value={`$${m.crudeOil.wti.price.toFixed(2)}/bbl`}   changePct={m.crudeOil.wti.changePercent} />
          <PriceRow label="Brent" value={`$${m.crudeOil.brent.price.toFixed(2)}/bbl`} changePct={m.crudeOil.brent.changePercent} />
        </Card>
        <Card title="Gas & Refining">
          <PriceRow label="Henry Hub"      value={`$${m.naturalGas.henryHub.price.toFixed(2)}/MMBtu`}          changePct={m.naturalGas.henryHub.changePercent} />
          <PriceRow label="Crack Spread"   value={`$${m.refiningMargins.crackSpread.value.toFixed(2)}/bbl`}    changePct={m.refiningMargins.crackSpread.change} />
          <PriceRow label="Utilization"    value={`${m.refiningMargins.utilizationRate}%`}                     changePct={null} />
          <PriceRow label="Oil Rigs"       value={`${m.rigCount.oil} active`}                                  changePct={null} />
          <PriceRow label="Gas Rigs"       value={`${m.rigCount.gas} active`}                                  changePct={null} />
        </Card>
      </div>

      <Card title="IBM Solution Relevance" style={{ marginBottom:20 }}>
        {(data.ibmRelevance || []).map((r,i) => (
          <div key={i} style={{ display:'flex', gap:10, padding:'10px 0', borderBottom:'1px solid var(--border)' }}>
            <div style={{ width:8, height:8, borderRadius:'50%', background:'var(--yellow)', flexShrink:0, marginTop:5 }} />
            <div>
              <div style={{ fontSize:12 }}>{r.condition}</div>
              <div style={{ fontSize:11, color:'var(--accent)', marginTop:2 }}>💡 {r.ibmSolution} — {r.rationale}</div>
            </div>
          </div>
        ))}
      </Card>

      <Card title="Market Summary">
        <p style={{ color:'var(--muted)', fontSize:13, lineHeight:1.7 }}>{data.summary}</p>
        <div style={{ color:'var(--muted)', fontSize:11, marginTop:8 }}>
          Last updated: {new Date(m.lastUpdate || Date.now()).toLocaleString()}
        </div>
      </Card>
    </div>
  );
}
