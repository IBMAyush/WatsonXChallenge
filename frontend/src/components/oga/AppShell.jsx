import { useEffect, useState } from 'react';
import { Activity, Newspaper, Radar, Users, FileText, Workflow, Search, Bell, Settings, Command, BotMessageSquare } from 'lucide-react';
import { TICKER, AGENTS } from './data';
import { LiveDot } from './visuals';

const NAV = [
  { key: "market", label: "Market Monitor", icon: Activity },
  { key: "news", label: "News & Intelligence", icon: Newspaper, badge: "9" },
  { key: "deals", label: "Deal Radar", icon: Radar, badge: "10" },
  { key: "clients", label: "Client Intelligence", icon: Users },
  { key: "digest", label: "Intelligence Digest", icon: FileText },
  { key: "workflow", label: "Workflow Automation", icon: Workflow },
  { key: "agents", label: "Agent Library", icon: BotMessageSquare },
];

export function AppShell({ view, setView, children }) {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      {/* Sidebar */}
      <aside className="w-64 shrink-0 border-r border-border bg-sidebar flex flex-col">
        <div className="p-5 border-b border-sidebar-border">
          <div className="flex items-center gap-2.5">
            <div className="relative h-9 w-9 grid place-items-center rounded-md bg-primary/15 border border-primary/40">
              <svg viewBox="0 0 24 24" className="h-5 w-5 text-primary" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="3" />
                <circle cx="12" cy="12" r="7" opacity="0.5" />
                <circle cx="12" cy="12" r="11" opacity="0.2" />
              </svg>
              <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-bullish animate-blink" />
            </div>
            <div className="leading-tight">
              <div className="text-[10px] tracking-[0.2em] text-muted-foreground font-mono">IBM · INTERNAL</div>
              <div className="text-sm font-semibold">Aperture<span className="text-primary">.</span></div>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-0.5">
          <div className="px-2 pt-2 pb-1.5 text-[10px] uppercase tracking-[0.18em] text-muted-foreground font-mono">Intelligence</div>
          {NAV.map((n) => {
            const active = view === n.key;
            const Icon = n.icon;
            return (
              <button
                key={n.key}
                onClick={() => setView(n.key)}
                className={`group relative w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-all ${
                  active
                    ? "bg-sidebar-accent text-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-sidebar-accent/50"
                }`}
              >
                {active && <span className="absolute left-0 top-1.5 bottom-1.5 w-0.5 rounded-r bg-primary" />}
                <Icon className="h-4 w-4" />
                <span className="flex-1 text-left">{n.label}</span>
                {n.badge && (
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-primary/15 text-primary border border-primary/30">{n.badge}</span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="p-3 border-t border-sidebar-border space-y-3">
          <div className="px-2 text-[10px] uppercase tracking-[0.18em] text-muted-foreground font-mono">Agent Mesh</div>
          <div className="space-y-1.5">
            {AGENTS.map((a) => (
              <div key={a.name} className="flex items-center gap-2 px-2 py-1 rounded text-xs">
                <LiveDot color={a.color} />
                <span className="flex-1 text-foreground/80">{a.name}</span>
                <span className="font-mono text-[10px] text-muted-foreground">{a.events}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2 px-2 pt-2 border-t border-sidebar-border">
            <div className="h-7 w-7 rounded-full bg-gradient-to-br from-primary to-info grid place-items-center text-[10px] font-semibold text-primary-foreground">MR</div>
            <div className="flex-1 text-xs">
              <div className="font-medium">M. Rodriguez</div>
              <div className="text-muted-foreground text-[10px]">Sr. AE · Energy NA</div>
            </div>
            <Settings className="h-3.5 w-3.5 text-muted-foreground" />
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-14 border-b border-border bg-surface/60 backdrop-blur flex items-center px-5 gap-4">
          <div className="flex-1 max-w-xl relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <input
              placeholder='Ask Aperture — "What changed at Chevron this week?"'
              className="w-full h-9 pl-9 pr-20 rounded-md bg-surface-2 border border-border text-sm placeholder:text-muted-foreground/70 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
            />
            <kbd className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-mono text-muted-foreground border border-border rounded px-1.5 py-0.5 flex items-center gap-1">
              <Command className="h-2.5 w-2.5" />K
            </kbd>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-2 text-muted-foreground">
              <LiveDot />
              <span className="font-mono">LIVE</span>
              <span>· markets open</span>
            </div>
            <div className="font-mono text-muted-foreground tabular-nums">
              {now.toUTCString().slice(17, 25)} UTC
            </div>
            <button className="relative h-8 w-8 grid place-items-center rounded-md hover:bg-surface-2">
              <Bell className="h-4 w-4" />
              <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-prio-critical animate-blink" />
            </button>
          </div>
        </header>

        {/* Ticker */}
        <div className="h-9 border-b border-border bg-surface/40 overflow-hidden relative">
          <div className="absolute inset-0 flex items-center whitespace-nowrap animate-ticker font-mono text-xs">
            {[...TICKER, ...TICKER].map((t, i) => {
              const up = t.d.startsWith("+");
              const down = t.d.startsWith("-");
              return (
                <span key={i} className="px-5 inline-flex items-center gap-2 border-r border-border/50">
                  <span className="text-muted-foreground tracking-wider">{t.sym}</span>
                  <span className="text-foreground tabular-nums">{t.val}</span>
                  <span className={up ? "text-bullish" : down ? "text-bearish" : "text-muted-foreground"}>{t.d}</span>
                </span>
              );
            })}
          </div>
        </div>

        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
