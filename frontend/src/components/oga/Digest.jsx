import { useState } from 'react';
import { CLIENTS, DEALS, MARKET_METRICS, NEWS } from './data';
import { SectionHeader } from './MarketMonitor';
import { OrbBackground, Sparkline } from './visuals';
import { Download, FileText, Mail, Printer, Sparkles } from 'lucide-react';

export function Digest() {
  const [client, setClient] = useState("ExxonMobil");
  const c = CLIENTS.find((x) => x.name === client);
  const opps = DEALS.filter((d) => d.client === client).slice(0, 3);
  const topNews = NEWS.filter((n) => n.company === client).slice(0, 3);

  return (
    <div className="relative">
      <OrbBackground />
      <div className="relative p-6 space-y-6">
        <SectionHeader
          eyebrow="05 · Intelligence Digest"
          title="Meeting-ready briefings, generated in 90 seconds."
          subtitle="Market snapshot, top headlines, and ranked opportunities — tailored for the conversation in front of you."
        />

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground mr-1">Tailor for</span>
          {CLIENTS.map((cl) => (
            <button
              key={cl.name}
              onClick={() => setClient(cl.name)}
              className={`text-xs px-3 py-1.5 rounded-md border transition-colors ${
                client === cl.name ? "bg-primary/15 border-primary/50 text-primary" : "border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {cl.name}
            </button>
          ))}
          <div className="flex-1" />
          <button className="text-xs h-8 px-3 rounded-md border border-border hover:border-border-strong flex items-center gap-1.5"><Printer className="h-3 w-3" /> Print</button>
          <button className="text-xs h-8 px-3 rounded-md border border-border hover:border-border-strong flex items-center gap-1.5"><Mail className="h-3 w-3" /> Email AE team</button>
          <button className="text-xs h-8 px-3 rounded-md bg-primary text-primary-foreground flex items-center gap-1.5"><Download className="h-3 w-3" /> Export PDF</button>
        </div>

        <div className="panel p-8 max-w-4xl mx-auto relative overflow-hidden">
          <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />
          <div className="relative space-y-8">
            {/* Header */}
            <div className="flex items-start justify-between pb-6 border-b border-border">
              <div>
                <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.22em] text-primary">
                  <Sparkles className="h-3 w-3" /> Intelligence digest · auto-generated
                </div>
                <h2 className="mt-2 text-3xl font-semibold">{c.name} <span className="text-muted-foreground font-light">briefing</span></h2>
                <p className="mt-1 text-sm text-muted-foreground">Prepared {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })} · for M. Rodriguez · Sr. AE, Energy NA</p>
              </div>
              <div className="text-right text-[10px] font-mono text-muted-foreground space-y-0.5">
                <div>DIGEST · #AP-{Math.floor(Math.random() * 9000) + 1000}</div>
                <div>CLASSIFICATION · INTERNAL</div>
                <div>CONFIDENCE · 94%</div>
              </div>
            </div>

            {/* Executive summary */}
            <section>
              <SectionTitle n="01">Executive summary</SectionTitle>
              <p className="text-sm leading-relaxed text-foreground/90">
                {c.name} is operating in a constructive macro environment — WTI sustained above $78 and refining margins expanding 4% week-over-week.
                Three signals converge into actionable opportunities: <span className="text-primary">{opps[0]?.trigger ?? "ongoing operational scale-up"}</span>,
                continuing pressure on emissions data quality, and an accelerating shift toward AI-augmented operations. Combined qualified pipeline
                stands at <span className="text-primary font-medium">{c.pipeline}</span> across {c.openOpps} active opportunities.
              </p>
            </section>

            {/* Market snapshot */}
            <section>
              <SectionTitle n="02">Market snapshot</SectionTitle>
              <div className="grid grid-cols-4 gap-3">
                {MARKET_METRICS.slice(0, 4).map((m) => {
                  const up = m.delta >= 0;
                  return (
                    <div key={m.key} className="rounded-md border border-border bg-surface-2/40 p-3">
                      <div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">{m.label}</div>
                      <div className="mt-1 flex items-end justify-between">
                        <div className="text-lg font-semibold tabular-nums">{m.value}<span className="text-[10px] font-mono text-muted-foreground ml-1">{m.unit}</span></div>
                        <div className={`text-[10px] font-mono ${up ? "text-bullish" : "text-bearish"}`}>{up ? "+" : ""}{m.deltaPct.toFixed(1)}%</div>
                      </div>
                      <div className="mt-1 -mx-1"><Sparkline data={m.spark} positive={up} width={170} height={28} /></div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Top headlines */}
            <section>
              <SectionTitle n="03">Top headlines for {c.name}</SectionTitle>
              <div className="space-y-3">
                {topNews.map((n) => (
                  <div key={n.id} className="flex gap-3 pb-3 border-b border-border last:border-0">
                    <div className="text-2xl font-mono font-light text-primary/70 w-10">{n.relevance}</div>
                    <div className="flex-1">
                      <div className="text-sm font-medium leading-snug">{n.title}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">{n.source} · {n.time} ago · {n.category}</div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Top opportunities */}
            <section>
              <SectionTitle n="04">Top opportunities</SectionTitle>
              <div className="space-y-3">
                {opps.map((o) => (
                  <div key={o.id} className="rounded-md border border-border bg-surface-2/30 p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-wider">
                          <span className="text-primary">{o.priority}</span>
                          <span className="text-muted-foreground">· score {o.score} · {o.value}</span>
                        </div>
                        <div className="mt-1 text-sm font-medium leading-snug">{o.title}</div>
                        <div className="mt-1.5 text-xs text-muted-foreground"><span className="text-primary">{o.solution}</span> — {o.trigger}</div>
                        <div className="mt-2 text-xs text-foreground/80"><span className="font-mono text-muted-foreground">NEXT → </span>{o.nextAction}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <div className="pt-4 border-t border-border flex items-center gap-2 text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
              <FileText className="h-3 w-3" /> Generated by Aperture · IBM Sales Intelligence · For internal use only
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SectionTitle({ n, children }) {
  return (
    <div className="flex items-baseline gap-3 mb-3">
      <span className="text-[10px] font-mono text-primary">{n}</span>
      <h3 className="text-base font-semibold uppercase tracking-wider">{children}</h3>
      <div className="flex-1 h-px bg-border" />
    </div>
  );
}
