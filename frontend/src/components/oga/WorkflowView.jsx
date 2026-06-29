import { useEffect, useState } from 'react';
import { SectionHeader } from './MarketMonitor';
import { OrbBackground, LiveDot } from './visuals';
import { Bell, Database, Mail, CheckSquare, ArrowRight, Play } from 'lucide-react';

const STEPS = [
  { key: "alert", label: "Alert account team", icon: Bell, detail: "Slack #xom-account + SMS to lead AE", color: "var(--warn)" },
  { key: "crm", label: "Log in CRM", icon: Database, detail: "Salesforce opportunity created, linked to parent account", color: "var(--info)" },
  { key: "draft", label: "Draft outreach", icon: Mail, detail: "Personalized email + LinkedIn DM drafted via watsonx", color: "var(--primary)" },
  { key: "task", label: "Assign follow-up", icon: CheckSquare, detail: "Tasks routed to AE, SE, and Industry Lead with SLAs", color: "var(--bullish)" },
];

const RUNS = [
  { id: "wf-2841", deal: "Asset performance refresh — Guyana FPSO", client: "ExxonMobil", time: "2 min ago", status: "completed" },
  { id: "wf-2840", deal: "Methane data governance", client: "Chevron", time: "11 min ago", status: "completed" },
  { id: "wf-2839", deal: "OT/IT zero-trust segmentation", client: "Chevron", time: "27 min ago", status: "in-progress" },
  { id: "wf-2838", deal: "Trading platform modernization", client: "BP", time: "1h ago", status: "completed" },
  { id: "wf-2837", deal: "Subsurface ML-Ops expansion", client: "Shell", time: "2h ago", status: "completed" },
];

export function WorkflowView() {
  const [active, setActive] = useState(0);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      setActive((a) => {
        if (a >= STEPS.length - 1) {
          setRunning(false);
          return STEPS.length - 1;
        }
        return a + 1;
      });
    }, 900);
    return () => clearInterval(id);
  }, [running]);

  return (
    <div className="relative">
      <OrbBackground />
      <div className="relative p-6 space-y-6">
        <SectionHeader
          eyebrow="06 · Workflow Automation"
          title="From signal to action — without a single keystroke."
          subtitle="Each opportunity can trigger a fully-audited workflow: notify, log, draft and assign. Configurable per priority tier."
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 panel p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="text-[10px] font-mono uppercase tracking-[0.18em] text-muted-foreground">Workflow · CRITICAL tier</div>
                <h3 className="text-lg font-semibold mt-1">Auto-route on radar trigger</h3>
              </div>
              <button
                onClick={() => { setActive(0); setRunning(true); }}
                disabled={running}
                className="h-9 px-4 rounded-md bg-primary text-primary-foreground text-sm font-medium flex items-center gap-1.5 hover:opacity-90 disabled:opacity-50 transition-opacity"
              >
                <Play className="h-3.5 w-3.5" />
                {running ? "Running…" : "Simulate run"}
              </button>
            </div>

            <div className="space-y-3">
              {STEPS.map((s, i) => {
                const done = i < active || (!running && active === STEPS.length - 1 && i <= active);
                const cur = running && i === active;
                const Icon = s.icon;
                return (
                  <div key={s.key} className="relative">
                    {i < STEPS.length - 1 && (
                      <div className="absolute left-5 top-11 bottom-[-12px] w-px bg-border" />
                    )}
                    <div className={`flex items-start gap-4 p-3 rounded-md border transition-all ${
                      cur ? "border-primary/60 bg-primary/5" : done ? "border-border" : "border-border opacity-60"
                    }`}>
                      <div className="relative">
                        <div
                          className="h-10 w-10 rounded-md grid place-items-center border"
                          style={{
                            borderColor: cur || done ? s.color : "var(--border)",
                            background: cur ? `color-mix(in oklab, ${s.color} 15%, transparent)` : "transparent",
                          }}
                        >
                          <Icon className="h-4 w-4" style={{ color: cur || done ? s.color : "var(--muted-foreground)" }} />
                        </div>
                        {cur && (
                          <span className="absolute -top-1 -right-1"><LiveDot color={s.color} /></span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0 pt-1">
                        <div className="flex items-center gap-2">
                          <div className="text-sm font-medium">{s.label}</div>
                          {done && <span className="text-[10px] font-mono text-bullish">✓ COMPLETE</span>}
                          {cur && <span className="text-[10px] font-mono text-primary">EXECUTING</span>}
                        </div>
                        <div className="text-xs text-muted-foreground mt-0.5">{s.detail}</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 pt-4 border-t border-border flex items-center gap-3 text-xs text-muted-foreground">
              <ArrowRight className="h-3.5 w-3.5" />
              Estimated time saved per opportunity: <span className="text-foreground font-medium">42 minutes</span>
              <span>·</span>
              Workflows executed this week: <span className="text-foreground font-medium">128</span>
            </div>
          </div>

          <div className="panel p-5">
            <div className="text-[10px] font-mono uppercase tracking-[0.18em] text-muted-foreground mb-3">Recent runs</div>
            <div className="space-y-2.5">
              {RUNS.map((r) => (
                <div key={r.id} className="border-b border-border last:border-0 pb-2.5 last:pb-0">
                  <div className="flex items-center justify-between text-[10px] font-mono">
                    <span className="text-muted-foreground">{r.id}</span>
                    <span className={r.status === "completed" ? "text-bullish" : "text-warn"}>
                      {r.status === "completed" ? "✓ COMPLETED" : "● IN PROGRESS"}
                    </span>
                  </div>
                  <div className="text-sm font-medium mt-1 leading-snug">{r.deal}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{r.client} · {r.time}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
