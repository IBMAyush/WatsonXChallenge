import { useState } from 'react';
import { NEWS, COMPANIES, CATEGORIES } from './data';
import { SectionHeader } from './MarketMonitor';
import { OrbBackground, Ring } from './visuals';
import { ExternalLink, TrendingDown, TrendingUp, Minus } from 'lucide-react';

const CAT_COLOR = {
  market: "var(--bullish)",
  policy: "var(--warn)",
  company: "var(--info)",
  emissions: "var(--prio-high)",
  technology: "var(--primary)",
};

export function NewsFeed() {
  const [company, setCompany] = useState("All");
  const [cats, setCats] = useState(new Set(CATEGORIES));

  const filtered = NEWS.filter((n) => (company === "All" || n.company === company) && cats.has(n.category));

  return (
    <div className="relative">
      <OrbBackground />
      <div className="relative p-6 space-y-6">
        <SectionHeader
          eyebrow="02 · News & Intelligence Feed"
          title="Every signal that moves a deal — scored before you read it."
          subtitle="Aggregated from 600+ sources, deduplicated, ranked for IBM relevance and source credibility, with sentiment overlays."
        />

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground mr-1">Account</span>
          {COMPANIES.map((c) => (
            <button
              key={c}
              onClick={() => setCompany(c)}
              className={`text-xs px-3 py-1.5 rounded-md border transition-colors ${
                company === c
                  ? "bg-primary/15 border-primary/50 text-primary"
                  : "border-border text-muted-foreground hover:text-foreground hover:border-border-strong"
              }`}
            >
              {c}
            </button>
          ))}
          <div className="w-px h-6 bg-border mx-2" />
          <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground mr-1">Category</span>
          {CATEGORIES.map((c) => {
            const on = cats.has(c);
            return (
              <button
                key={c}
                onClick={() => {
                  const next = new Set(cats);
                  if (on) next.delete(c); else next.add(c);
                  setCats(next);
                }}
                className="text-xs px-2.5 py-1.5 rounded-md border transition-all flex items-center gap-1.5"
                style={{
                  borderColor: on ? CAT_COLOR[c] : "var(--border)",
                  color: on ? CAT_COLOR[c] : "var(--muted-foreground)",
                  background: on ? `color-mix(in oklab, ${CAT_COLOR[c]} 12%, transparent)` : "transparent",
                }}
              >
                <span className="h-1.5 w-1.5 rounded-full" style={{ background: CAT_COLOR[c] }} />
                {c}
              </button>
            );
          })}
        </div>

        <div className="space-y-3">
          {filtered.map((n, i) => (
            <article
              key={n.id}
              className="panel p-5 group hover:border-border-strong transition-colors animate-fade-up cursor-pointer"
              style={{ animationDelay: `${i * 40}ms` }}
            >
              <div className="flex gap-5">
                <div className="shrink-0 flex flex-col items-center gap-2 w-16">
                  <div className="relative">
                    <Ring value={n.relevance} size={56} stroke={5} color="var(--primary)" />
                    <div className="absolute inset-0 grid place-items-center text-sm font-mono font-semibold">{n.relevance}</div>
                  </div>
                  <div className="text-[9px] font-mono uppercase tracking-wider text-muted-foreground">Relevance</div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-wider">
                    <span className="px-1.5 py-0.5 rounded" style={{ background: `color-mix(in oklab, ${CAT_COLOR[n.category]} 15%, transparent)`, color: CAT_COLOR[n.category] }}>
                      {n.category}
                    </span>
                    <span className="text-muted-foreground">{n.source}</span>
                    <span className="text-muted-foreground">·</span>
                    <span className="text-muted-foreground">{n.time} ago</span>
                    <span className="text-muted-foreground">·</span>
                    <span className="text-foreground/80">{n.company}</span>
                  </div>
                  <h3 className="mt-2 text-base font-semibold leading-snug group-hover:text-primary transition-colors">{n.title}</h3>
                  <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{n.summary}</p>
                  <div className="mt-3 flex items-center gap-4 text-[11px] font-mono">
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <span className="opacity-70">CREDIBILITY</span>
                      <div className="w-20 h-1 rounded-full bg-border overflow-hidden">
                        <div className="h-full bg-info" style={{ width: `${n.credibility}%` }} />
                      </div>
                      <span>{n.credibility}</span>
                    </div>
                    <SentimentBadge s={n.sentiment} />
                  </div>
                </div>
                <ExternalLink className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}

function SentimentBadge({ s }) {
  const m = {
    positive: { c: "var(--bullish)", Icon: TrendingUp, t: "POSITIVE" },
    neutral: { c: "var(--muted-foreground)", Icon: Minus, t: "NEUTRAL" },
    negative: { c: "var(--bearish)", Icon: TrendingDown, t: "NEGATIVE" },
  }[s];
  const { Icon } = m;
  return (
    <span className="inline-flex items-center gap-1" style={{ color: m.c }}>
      <Icon className="h-3 w-3" />
      {m.t}
    </span>
  );
}
