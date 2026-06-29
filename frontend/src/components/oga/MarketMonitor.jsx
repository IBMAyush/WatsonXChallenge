import { MARKET_METRICS } from './data';
import { Sparkline, OrbBackground, Counter, ScanLine } from './visuals';
import { ArrowDownRight, ArrowUpRight, Zap } from 'lucide-react';

export function MarketMonitor() {
  return (
    <div className="relative">
      <OrbBackground />
      <div className="relative p-6 space-y-6">
        <SectionHeader
          eyebrow="01 · Live Market Monitor"
          title="Energy markets, decoded for IBM revenue motion."
          subtitle="Seven signals refreshed every 15 seconds. Each metric is cross-referenced against your account book and the IBM solution catalog."
        />

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {MARKET_METRICS.map((m, i) => {
            const up = m.delta >= 0;
            return (
              <div
                key={m.key}
                className="panel p-4 relative overflow-hidden animate-fade-up"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-[10px] font-mono uppercase tracking-[0.18em] text-muted-foreground">{m.label}</div>
                    <div className="mt-1.5 text-2xl font-semibold">
                      <Counter value={m.value} decimals={m.unit === "rigs" || m.unit === "%" ? 0 : 2} />
                      <span className="text-xs font-mono text-muted-foreground ml-1.5">{m.unit}</span>
                    </div>
                  </div>
                  <div className={`flex items-center gap-1 text-xs font-mono px-1.5 py-0.5 rounded ${up ? "text-bullish bg-bullish/10" : "text-bearish bg-bearish/10"}`}>
                    {up ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                    {up ? "+" : ""}{m.deltaPct.toFixed(2)}%
                  </div>
                </div>
                <div className="mt-3 -mx-1">
                  <Sparkline data={m.spark} positive={up} width={220} height={44} />
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="panel p-5 lg:col-span-2 relative overflow-hidden">
            <ScanLine />
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-[10px] font-mono uppercase tracking-[0.18em] text-muted-foreground">Cross-signal correlation</div>
                <h3 className="text-base font-semibold mt-0.5">WTI × US Rig Count × Refining Margin</h3>
              </div>
              <div className="flex gap-2 text-[10px] font-mono">
                <span className="flex items-center gap-1 text-bullish">● WTI</span>
                <span className="flex items-center gap-1 text-info">● Rigs</span>
                <span className="flex items-center gap-1 text-warn">● Margin</span>
              </div>
            </div>
            <CorrelationChart />
          </div>

          <div className="panel p-5 space-y-3">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-warn" />
              <div className="text-[10px] font-mono uppercase tracking-[0.18em] text-muted-foreground">Insights · Auto-generated</div>
            </div>
            <Insight
              tone="bullish"
              title="WTI sustaining $78+ for 12 sessions"
              body="Triggers upstream capex confidence. Surface Maximo APM upgrade plays for E&P accounts."
              tag="ExxonMobil · Chevron"
            />
            <Insight
              tone="warn"
              title="Refining margins +4% — petchem squeeze"
              body="Downstream optimization conversations land well. Position Supply Chain + watsonx scenario planning."
              tag="BP · Shell"
            />
            <Insight
              tone="bearish"
              title="Henry Hub gas softens"
              body="LNG operators reassessing throughput. Asset performance & emissions reporting demand rises."
              tag="ConocoPhillips"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function Insight({ tone, title, body, tag }) {
  const color = tone === "bullish" ? "var(--bullish)" : tone === "bearish" ? "var(--bearish)" : "var(--warn)";
  return (
    <div className="relative pl-3 py-1">
      <span className="absolute left-0 top-2 bottom-2 w-0.5 rounded" style={{ background: color }} />
      <div className="text-sm font-medium">{title}</div>
      <div className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{body}</div>
      <div className="text-[10px] font-mono mt-1.5 text-muted-foreground">{tag}</div>
    </div>
  );
}

function CorrelationChart() {
  const wti = MARKET_METRICS[0].spark;
  const rigs = MARKET_METRICS[3].spark;
  const margin = MARKET_METRICS[5].spark;
  const W = 700, H = 240;
  const norm = (arr) => {
    const mn = Math.min(...arr), mx = Math.max(...arr), r = mx - mn || 1;
    return arr.map((v) => (v - mn) / r);
  };
  const toPath = (arr, color, fill = false) => {
    const n = norm(arr);
    const step = W / (n.length - 1);
    const pts = n.map((v, i) => `${(i * step).toFixed(1)},${(H - v * (H - 30) - 15).toFixed(1)}`);
    const id = color.replace(/[^a-z]/gi, "");
    return (
      <g key={color}>
        {fill && (
          <>
            <defs>
              <linearGradient id={id} x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor={color} stopOpacity="0.25" />
                <stop offset="100%" stopColor={color} stopOpacity="0" />
              </linearGradient>
            </defs>
            <polygon points={`0,${H} ${pts.join(" ")} ${W},${H}`} fill={`url(#${id})`} />
          </>
        )}
        <polyline points={pts.join(" ")} fill="none" stroke={color} strokeWidth="1.5" />
      </g>
    );
  };
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-56">
      {[0, 1, 2, 3, 4].map((i) => (
        <line key={i} x1="0" x2={W} y1={(H / 4) * i + 0.5} y2={(H / 4) * i + 0.5} stroke="var(--border)" strokeDasharray="2 4" />
      ))}
      {toPath(wti, "var(--bullish)", true)}
      {toPath(rigs, "var(--info)")}
      {toPath(margin, "var(--warn)")}
    </svg>
  );
}

export function SectionHeader({ eyebrow, title, subtitle }) {
  return (
    <div className="animate-fade-up">
      <div className="text-[10px] font-mono uppercase tracking-[0.22em] text-primary">{eyebrow}</div>
      <h1 className="mt-1.5 text-2xl lg:text-3xl font-semibold tracking-tight max-w-3xl">{title}</h1>
      {subtitle && <p className="mt-2 text-sm text-muted-foreground max-w-2xl leading-relaxed">{subtitle}</p>}
    </div>
  );
}
