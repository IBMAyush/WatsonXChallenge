import { useState } from 'react';
import { CLIENTS, DEALS } from './data';
import { SectionHeader } from './MarketMonitor';
import { OrbBackground, Ring } from './visuals';
import { Building2, Globe2, Target, Layers } from 'lucide-react';

export function Clients() {
  const [sel, setSel] = useState(CLIENTS[0]);
  const opps = DEALS.filter((d) => d.client === sel.name);

  return (
    <div className="relative">
      <OrbBackground />
      <div className="relative p-6 space-y-6">
        <SectionHeader
          eyebrow="04 · Client Intelligence"
          title="A 360° view of every account — refreshed on every signal."
          subtitle="Segments, geographies, strategic priorities and the IBM offerings that map to them. Always current."
        />

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {CLIENTS.map((c) => {
            const active = c.name === sel.name;
            return (
              <button
                key={c.name}
                onClick={() => setSel(c)}
                className={`panel p-4 text-left transition-all hover:border-border-strong group ${active ? "ring-1 ring-primary/60 border-primary/40" : ""}`}
              >
                <div className="flex items-center justify-between">
                  <div className="h-10 w-10 rounded-md bg-gradient-to-br from-primary/20 to-info/20 border border-border grid place-items-center font-mono text-xs font-semibold">{c.ticker}</div>
                  <div className="text-[10px] font-mono text-muted-foreground">{c.openOpps} opps</div>
                </div>
                <div className="mt-2.5 text-sm font-medium truncate">{c.name}</div>
                <div className="text-[10px] font-mono text-muted-foreground">{c.hq}</div>
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex-1 h-1 rounded-full bg-border overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-primary to-info" style={{ width: `${c.health}%` }} />
                  </div>
                  <span className="text-[10px] font-mono text-muted-foreground">{c.health}</span>
                </div>
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 panel p-6 space-y-5">
            <div className="flex items-start gap-4">
              <div className="h-14 w-14 rounded-lg bg-gradient-to-br from-primary/30 to-info/30 border border-border grid place-items-center font-mono text-base font-semibold">{sel.ticker}</div>
              <div className="flex-1">
                <div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">{sel.hq}</div>
                <h2 className="text-2xl font-semibold mt-0.5">{sel.name}</h2>
              </div>
              <div className="text-right">
                <div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Open pipeline</div>
                <div className="text-2xl font-semibold text-primary mt-0.5">{sel.pipeline}</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Block icon={Layers} title="Business segments" items={sel.segments} />
              <Block icon={Globe2} title="Geographies" items={sel.geographies} />
              <Block icon={Target} title="Strategic priorities" items={sel.priorities} accent />
              <Block icon={Building2} title="Relevant IBM offerings" items={sel.offerings} brand />
            </div>
          </div>

          <div className="panel p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-[10px] font-mono uppercase tracking-[0.18em] text-muted-foreground">Active opportunities</div>
              <div className="relative">
                <Ring value={sel.health} size={52} stroke={5} color="var(--bullish)" />
                <div className="absolute inset-0 grid place-items-center text-xs font-mono font-semibold">{sel.health}</div>
              </div>
            </div>
            {opps.length === 0 ? (
              <div className="text-sm text-muted-foreground py-6 text-center">No live opportunities for {sel.name}.</div>
            ) : (
              opps.map((o) => (
                <div key={o.id} className="rounded-md border border-border p-3 hover:border-border-strong transition-colors">
                  <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-wider">
                    <span className="text-primary">{o.priority}</span>
                    <span className="text-muted-foreground">score {o.score}</span>
                  </div>
                  <div className="text-sm font-medium mt-1 leading-snug">{o.title}</div>
                  <div className="text-xs text-muted-foreground mt-1">{o.value} · {o.solution}</div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Block({ icon: Icon, title, items, accent, brand }) {
  return (
    <div>
      <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-2">
        <Icon className="h-3 w-3" /> {title}
      </div>
      <div className="flex flex-wrap gap-1.5">
        {items.map((s) => (
          <span
            key={s}
            className={`text-xs px-2.5 py-1 rounded-md border ${
              brand ? "border-primary/40 bg-primary/10 text-primary"
                : accent ? "border-warn/40 bg-warn/10 text-warn"
                : "border-border text-foreground/80"
            }`}
          >
            {s}
          </span>
        ))}
      </div>
    </div>
  );
}
