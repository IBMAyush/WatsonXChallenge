import { useMemo, useState } from 'react';
import { DEALS } from './data';
import { SectionHeader } from './MarketMonitor';
import { OrbBackground, Ring, ScanLine, LiveDot } from './visuals';
import { ArrowRight, CheckCircle2, ChevronRight, Clock, Target } from 'lucide-react';

const PRIO_COLOR = {
  CRITICAL: "var(--prio-critical)",
  URGENT: "var(--prio-urgent)",
  HIGH: "var(--prio-high)",
  MEDIUM: "var(--prio-medium)",
  LOW: "var(--prio-low)",
};

const PRIO_ORDER = ["CRITICAL", "URGENT", "HIGH", "MEDIUM", "LOW"];

export function DealRadar() {
  const [filter, setFilter] = useState("ALL");
  const [selected, setSelected] = useState(DEALS[0]);

  const list = useMemo(
    () => DEALS.filter((d) => filter === "ALL" || d.priority === filter).sort((a, b) => b.score - a.score),
    [filter]
  );

  const counts = useMemo(() => {
    const c = { CRITICAL: 0, URGENT: 0, HIGH: 0, MEDIUM: 0, LOW: 0 };
    DEALS.forEach((d) => (c[d.priority]++));
    return c;
  }, []);

  return (
    <div className="relative">
      <OrbBackground />
      <div className="relative p-6 space-y-6">
        <SectionHeader
          eyebrow="03 · Deal Radar"
          title="Autonomous deal discovery. Scored. Ranked. Acted on."
          subtitle="The Deal Radar agent continuously fuses market, news, and client signals to surface opportunities — and tells you exactly what to do next."
        />

        {/* Radar visual + counts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="panel p-5 relative overflow-hidden">
            <ScanLine />
            <div className="flex items-center gap-2 mb-2">
              <LiveDot color="var(--prio-critical)" />
              <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-muted-foreground">Live scan</span>
            </div>
            <RadarSweep deals={DEALS} onSelect={setSelected} selected={selected.id} />
          </div>

          <div className="lg:col-span-2 grid grid-cols-5 gap-3">
            {PRIO_ORDER.map((p) => (
              <button
                key={p}
                onClick={() => setFilter(p === filter ? "ALL" : p)}
                className={`panel p-4 text-left transition-all hover:border-border-strong ${filter === p ? "ring-1 ring-primary/50" : ""}`}
              >
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full" style={{ background: PRIO_COLOR[p] }} />
                  <span className="text-[10px] font-mono tracking-wider" style={{ color: PRIO_COLOR[p] }}>{p}</span>
                </div>
                <div className="mt-2 text-3xl font-semibold tabular-nums">{counts[p]}</div>
                <div className="text-[10px] font-mono text-muted-foreground mt-0.5">open</div>
              </button>
            ))}
            <div className="panel p-4 col-span-5">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-mono uppercase tracking-[0.18em] text-muted-foreground">Total qualified pipeline · radar-sourced</div>
                  <div className="text-3xl font-semibold mt-1">$124M – $196M</div>
                </div>
                <div className="flex items-center gap-6 text-sm">
                  <Stat label="Avg score" value="78" tone="primary" />
                  <Stat label="New (24h)" value="6" tone="bullish" />
                  <Stat label="Actioned" value="4" tone="info" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* List + detail */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          <div className="lg:col-span-3 space-y-2.5">
            {list.map((d, i) => (
              <button
                key={d.id}
                onClick={() => setSelected(d)}
                className={`panel w-full text-left p-4 transition-all hover:border-border-strong animate-fade-up ${
                  selected.id === d.id ? "ring-1 ring-primary/60 border-primary/40" : ""
                }`}
                style={{ animationDelay: `${i * 30}ms` }}
              >
                <div className="flex items-center gap-4">
                  <div className="relative shrink-0">
                    <Ring value={d.score} size={56} stroke={5} color={PRIO_COLOR[d.priority]} />
                    <div className="absolute inset-0 grid place-items-center text-sm font-mono font-semibold">{d.score}</div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-wider">
                      <span className="px-1.5 py-0.5 rounded" style={{ background: `color-mix(in oklab, ${PRIO_COLOR[d.priority]} 18%, transparent)`, color: PRIO_COLOR[d.priority] }}>{d.priority}</span>
                      <span className="text-muted-foreground">{d.client}</span>
                      <span className="text-muted-foreground">·</span>
                      <Clock className="h-3 w-3 text-muted-foreground" />
                      <span className="text-muted-foreground">{d.ageMin}m ago</span>
                    </div>
                    <div className="mt-1 text-sm font-medium leading-snug truncate">{d.title}</div>
                    <div className="mt-1 text-xs text-muted-foreground flex items-center gap-3">
                      <span className="text-foreground/80">{d.value}</span>
                      <span>·</span>
                      <span className="text-primary">{d.solution}</span>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </div>
              </button>
            ))}
          </div>

          <div className="lg:col-span-2">
            <DealDetail deal={selected} />
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value, tone }) {
  const c = tone === "primary" ? "var(--primary)" : tone === "bullish" ? "var(--bullish)" : "var(--info)";
  return (
    <div>
      <div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="text-xl font-semibold tabular-nums" style={{ color: c }}>{value}</div>
    </div>
  );
}

function DealDetail({ deal }) {
  return (
    <div className="panel p-5 sticky top-4 space-y-4">
      <div>
        <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-wider">
          <span className="px-1.5 py-0.5 rounded" style={{ background: `color-mix(in oklab, ${PRIO_COLOR[deal.priority]} 18%, transparent)`, color: PRIO_COLOR[deal.priority] }}>{deal.priority}</span>
          <span className="text-muted-foreground">{deal.client}</span>
        </div>
        <h3 className="mt-2 text-lg font-semibold leading-tight">{deal.title}</h3>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Box label="Est. value" value={deal.value} />
        <Box label="Score" value={`${deal.score} / 100`} />
        <Box label="Solution" value={deal.solution} tone="primary" />
        <Box label="Detected" value={`${deal.ageMin}m ago`} />
      </div>

      <div>
        <div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-1.5">Trigger</div>
        <div className="text-sm">{deal.trigger}</div>
      </div>

      <div>
        <div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-2">Signal stack</div>
        <div className="space-y-1.5">
          {deal.signals.map((s) => (
            <div key={s} className="flex items-start gap-2 text-xs">
              <CheckCircle2 className="h-3.5 w-3.5 text-bullish mt-0.5 shrink-0" />
              <span>{s}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-md border border-primary/40 bg-primary/10 p-3">
        <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-primary mb-1">
          <Target className="h-3 w-3" /> Next best action
        </div>
        <div className="text-sm leading-snug">{deal.nextAction}</div>
      </div>

      <div className="flex gap-2">
        <button className="flex-1 h-10 rounded-md bg-primary text-primary-foreground text-sm font-medium flex items-center justify-center gap-1.5 hover:opacity-90 transition-opacity">
          Run workflow <ArrowRight className="h-3.5 w-3.5" />
        </button>
        <button className="h-10 px-4 rounded-md border border-border text-sm hover:border-border-strong">Snooze</button>
      </div>
    </div>
  );
}

function Box({ label, value, tone }) {
  return (
    <div className="rounded-md border border-border bg-surface-2/50 p-2.5">
      <div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className={`text-sm font-medium mt-0.5 ${tone === "primary" ? "text-primary" : ""}`}>{value}</div>
    </div>
  );
}

function RadarSweep({ deals, onSelect, selected }) {
  const size = 320;
  const r = size / 2 - 10;
  const cx = size / 2;
  const cy = size / 2;

  return (
    <div className="relative grid place-items-center">
      <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-auto max-w-[340px]">
        <defs>
          <radialGradient id="radarGrad">
            <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.25" />
            <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="sweep" x1="0" x2="1">
            <stop offset="0%" stopColor="var(--primary)" stopOpacity="0" />
            <stop offset="100%" stopColor="var(--primary)" stopOpacity="0.6" />
          </linearGradient>
        </defs>
        <circle cx={cx} cy={cy} r={r} fill="url(#radarGrad)" />
        {[0.25, 0.5, 0.75, 1].map((p) => (
          <circle key={p} cx={cx} cy={cy} r={r * p} fill="none" stroke="var(--border)" strokeDasharray="2 3" />
        ))}
        <line x1={cx} y1={10} x2={cx} y2={size - 10} stroke="var(--border)" strokeDasharray="2 3" />
        <line x1={10} y1={cy} x2={size - 10} y2={cy} stroke="var(--border)" strokeDasharray="2 3" />

        {/* sweep */}
        <g style={{ transformOrigin: `${cx}px ${cy}px` }}>
          <path d={`M${cx} ${cy} L${cx + r} ${cy} A${r} ${r} 0 0 0 ${cx + r * Math.cos(-Math.PI / 3)} ${cy + r * Math.sin(-Math.PI / 3)} Z`} fill="url(#sweep)">
            <animateTransform attributeName="transform" type="rotate" from={`0 ${cx} ${cy}`} to={`360 ${cx} ${cy}`} dur="6s" repeatCount="indefinite" />
          </path>
        </g>

        {deals.map((d, i) => {
          const angle = (i / deals.length) * Math.PI * 2;
          const dist = ((100 - d.score) / 100) * (r - 16) + 12;
          const x = cx + Math.cos(angle) * dist;
          const y = cy + Math.sin(angle) * dist;
          const color = PRIO_COLOR[d.priority];
          const isSel = selected === d.id;
          return (
            <g key={d.id} onClick={() => onSelect(d)} className="cursor-pointer">
              <circle cx={x} cy={y} r={isSel ? 6 : 4} fill={color} />
              <circle cx={x} cy={y} r={isSel ? 12 : 8} fill={color} opacity="0.3">
                <animate attributeName="r" values={`${isSel ? 8 : 6};${isSel ? 16 : 12};${isSel ? 8 : 6}`} dur="2s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.4;0;0.4" dur="2s" repeatCount="indefinite" />
              </circle>
            </g>
          );
        })}

        <circle cx={cx} cy={cy} r="3" fill="var(--primary)" />
      </svg>
      <div className="absolute bottom-1 left-1 text-[9px] font-mono text-muted-foreground">RANGE · 0-100 score</div>
    </div>
  );
}
