import { useState, useRef, useEffect } from 'react';

/* ─── Built-in agents ─────────────────────────────────────────── */
const BUILTIN_AGENTS = [
  {
    id: 'market',
    name: 'Market Monitor',
    icon: '↗',
    color: '#4583ff',
    colorDim: 'rgba(69,131,255,0.1)',
    badge: 'LIVE',
    badgeColor: '#22c55e',
    description:
      'Tracks WTI & Brent crude, natural gas, rig counts, refining margins, and OPEC activity in real time. Surfaces market-moving signals before they hit your desk.',
    feeds: ['Crude Oil Prices', 'Natural Gas (Henry Hub)', 'US Rig Count', 'Crack Spreads', 'Inventory Levels', 'OPEC Activity'],
    updateFreq: 'Every 60 min',
    tab: 'market',
    builtin: true,
    guidelines: '',
  },
  {
    id: 'news',
    name: 'News & Intel',
    icon: '⊡',
    color: '#8b5cf6',
    colorDim: 'rgba(139,92,246,0.1)',
    badge: 'LIVE',
    badgeColor: '#22c55e',
    description:
      'Monitors Reuters, Bloomberg, Oil & Gas Journal, and 6 other high-credibility sources. Filters, scores, and surfaces the stories that matter for your book of business.',
    feeds: ['Industry Headlines', 'Policy & Regulation', 'Emissions Developments', 'M&A Activity', 'Earnings Signals', 'Geopolitical Events'],
    updateFreq: 'Every 30 min',
    tab: 'news',
    builtin: true,
    guidelines: '',
  },
  {
    id: 'deals',
    name: 'Deal Radar',
    icon: '◎',
    color: '#f59e0b',
    colorDim: 'rgba(245,158,11,0.1)',
    badge: 'ALERTS',
    badgeColor: '#f59e0b',
    description:
      'Continuously scans your opportunity pipeline and scores each deal against market conditions and client context. Fires critical alerts at 90+ score so nothing slips.',
    feeds: ['Opportunity Scoring', 'Critical Alerts (90+)', 'Urgent Alerts (80+)', 'Pipeline Rankings', 'Workflow Triggers', 'CRM Sync'],
    updateFreq: 'Every 5 min',
    tab: 'deals',
    builtin: true,
    guidelines: '',
  },
  {
    id: 'client',
    name: 'Client Intelligence',
    icon: '◈',
    color: '#22c55e',
    colorDim: 'rgba(34,197,94,0.1)',
    badge: 'PROFILES',
    badgeColor: '#22c55e',
    description:
      'Maintains deep account profiles and tracks client-specific developments — recent news, contract history, and strategic priorities — so you walk in every room prepared.',
    feeds: ['Account Profiles', 'Client-Specific News', 'Contract History', 'Strategic Priorities', 'Key Contacts', 'Engagement Signals'],
    updateFreq: 'On demand',
    tab: 'digest',
    builtin: true,
    guidelines: '',
  },
  {
    id: 'digest',
    name: 'Digest Engine',
    icon: '≡',
    color: '#ef4444',
    colorDim: 'rgba(239,68,68,0.1)',
    badge: 'SUMMARY',
    badgeColor: '#9baabf',
    description:
      'Aggregates all agent outputs into a single morning briefing per account or portfolio. Zero noise, all signal — the first thing you open every day.',
    feeds: ['Cross-Agent Summary', 'Per-Company Briefs', 'Priority Highlights', 'Action Items', 'Market + News + Deals', 'Timestamped Reports'],
    updateFreq: 'On demand',
    tab: 'digest',
    builtin: true,
    guidelines: '',
  },
];

const ICON_OPTIONS = ['◈', '↗', '⊡', '◎', '≡', '⬡', '◆', '⊕', '⊗', '★', '⚡', '⬤', '◐', '⌘', '✦', '⊞'];
const COLOR_OPTIONS = [
  { hex: '#4583ff', dim: 'rgba(69,131,255,0.12)' },
  { hex: '#8b5cf6', dim: 'rgba(139,92,246,0.12)' },
  { hex: '#22c55e', dim: 'rgba(34,197,94,0.12)' },
  { hex: '#f59e0b', dim: 'rgba(245,158,11,0.12)' },
  { hex: '#ef4444', dim: 'rgba(239,68,68,0.12)' },
  { hex: '#06b6d4', dim: 'rgba(6,182,212,0.12)' },
  { hex: '#f97316', dim: 'rgba(249,115,22,0.12)' },
  { hex: '#ec4899', dim: 'rgba(236,72,153,0.12)' },
];

const FREQ_OPTIONS = ['Every 5 min', 'Every 15 min', 'Every 30 min', 'Every 60 min', 'Every 6 hours', 'Daily', 'On demand'];

const STORAGE_SELECTED = 'og_selected_agents';
const STORAGE_CUSTOM   = 'og_custom_agents';
const STORAGE_GUIDELINES = 'og_agent_guidelines';

/* ─── Persistence helpers ─────────────────────────────────────── */
function loadSelected(allIds) {
  try {
    const raw = localStorage.getItem(STORAGE_SELECTED);
    if (raw) return new Set(JSON.parse(raw));
  } catch (_) {}
  return new Set(allIds);
}
function saveSelected(set) {
  try { localStorage.setItem(STORAGE_SELECTED, JSON.stringify([...set])); } catch (_) {}
}
function loadCustom() {
  try {
    const raw = localStorage.getItem(STORAGE_CUSTOM);
    if (raw) return JSON.parse(raw);
  } catch (_) {}
  return [];
}
function saveCustom(arr) {
  try { localStorage.setItem(STORAGE_CUSTOM, JSON.stringify(arr)); } catch (_) {}
}
function loadGuidelines() {
  try {
    const raw = localStorage.getItem(STORAGE_GUIDELINES);
    if (raw) return JSON.parse(raw);
  } catch (_) {}
  return {};
}
function saveGuidelines(obj) {
  try { localStorage.setItem(STORAGE_GUIDELINES, JSON.stringify(obj)); } catch (_) {}
}

/* ─── Default form state ──────────────────────────────────────── */
const BLANK_FORM = {
  name: '',
  icon: '⬡',
  color: COLOR_OPTIONS[0],
  description: '',
  feeds: '',          // comma-separated input
  updateFreq: 'Every 30 min',
  guidelines: '',
};

/* ════════════════════════════════════════════════════════════════ */
export default function Agents({ onNavigate }) {
  const [customAgents, setCustomAgents] = useState(loadCustom);
  const [guidelines, setGuidelines]     = useState(loadGuidelines);

  const allAgents = [...BUILTIN_AGENTS, ...customAgents];
  const allIds    = allAgents.map(a => a.id);

  const [selected, setSelected] = useState(() => loadSelected(allIds));
  const [hovered, setHovered]   = useState(null);

  /* drawer state */
  const [drawerOpen, setDrawerOpen]   = useState(false);
  const [drawerMode, setDrawerMode]   = useState('add');   // 'add' | 'edit' | 'guidelines'
  const [editTarget, setEditTarget]   = useState(null);    // agent id being edited/guided
  const [form, setForm]               = useState(BLANK_FORM);
  const [step, setStep]               = useState(1);       // 1=identity, 2=data, 3=guidelines
  const [errors, setErrors]           = useState({});
  const nameRef = useRef(null);

  /* focus name field when drawer opens */
  useEffect(() => {
    if (drawerOpen && drawerMode === 'add') {
      setTimeout(() => nameRef.current?.focus(), 80);
    }
  }, [drawerOpen, drawerMode]);

  /* close on Escape */
  useEffect(() => {
    const handler = e => { if (e.key === 'Escape') closeDrawer(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  /* ── helpers ── */
  function toggle(id) {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      saveSelected(next);
      return next;
    });
  }

  function openAddDrawer() {
    setForm(BLANK_FORM);
    setStep(1);
    setErrors({});
    setDrawerMode('add');
    setEditTarget(null);
    setDrawerOpen(true);
  }

  function openGuidelinesDrawer(agent, e) {
    e.stopPropagation();
    setEditTarget(agent.id);
    setForm(f => ({ ...f, guidelines: guidelines[agent.id] || agent.guidelines || '' }));
    setDrawerMode('guidelines');
    setDrawerOpen(true);
  }

  function openEditDrawer(agent, e) {
    e.stopPropagation();
    setEditTarget(agent.id);
    const feedStr = (agent.feeds || []).join(', ');
    const col = COLOR_OPTIONS.find(c => c.hex === agent.color) || COLOR_OPTIONS[0];
    setForm({
      name: agent.name,
      icon: agent.icon,
      color: col,
      description: agent.description,
      feeds: feedStr,
      updateFreq: agent.updateFreq,
      guidelines: guidelines[agent.id] || agent.guidelines || '',
    });
    setStep(1);
    setErrors({});
    setDrawerMode('edit');
    setDrawerOpen(true);
  }

  function closeDrawer() {
    setDrawerOpen(false);
    setEditTarget(null);
  }

  function setField(key, val) {
    setForm(f => ({ ...f, [key]: val }));
    if (errors[key]) setErrors(e => ({ ...e, [key]: null }));
  }

  /* ── validation ── */
  function validateStep(s) {
    const errs = {};
    if (s === 1) {
      if (!form.name.trim()) errs.name = 'Agent name is required';
      if (!form.description.trim()) errs.description = 'Description is required';
    }
    if (s === 2) {
      if (!form.feeds.trim()) errs.feeds = 'Add at least one data source';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function nextStep() {
    if (validateStep(step)) setStep(s => s + 1);
  }

  /* ── save custom agent ── */
  function saveAgent() {
    if (!validateStep(3)) return;
    const feedList = form.feeds.split(',').map(f => f.trim()).filter(Boolean);
    const id = editTarget && drawerMode === 'edit' ? editTarget : `custom_${Date.now()}`;
    const agent = {
      id,
      name: form.name.trim(),
      icon: form.icon,
      color: form.color.hex,
      colorDim: form.color.dim,
      badge: 'CUSTOM',
      badgeColor: form.color.hex,
      description: form.description.trim(),
      feeds: feedList,
      updateFreq: form.updateFreq,
      tab: null,
      builtin: false,
      guidelines: form.guidelines,
    };

    setCustomAgents(prev => {
      const next = drawerMode === 'edit'
        ? prev.map(a => a.id === id ? agent : a)
        : [...prev, agent];
      saveCustom(next);
      return next;
    });

    /* also save guidelines */
    setGuidelines(prev => {
      const next = { ...prev, [id]: form.guidelines };
      saveGuidelines(next);
      return next;
    });

    /* auto-select new agent */
    if (drawerMode === 'add') {
      setSelected(prev => {
        const next = new Set(prev);
        next.add(id);
        saveSelected(next);
        return next;
      });
    }

    closeDrawer();
  }

  /* ── save guidelines only (for built-ins) ── */
  function saveGuidelinesOnly() {
    setGuidelines(prev => {
      const next = { ...prev, [editTarget]: form.guidelines };
      saveGuidelines(next);
      return next;
    });
    closeDrawer();
  }

  function deleteCustomAgent(id, e) {
    e.stopPropagation();
    setCustomAgents(prev => {
      const next = prev.filter(a => a.id !== id);
      saveCustom(next);
      return next;
    });
    setSelected(prev => {
      const next = new Set(prev);
      next.delete(id);
      saveSelected(next);
      return next;
    });
  }

  const activeCount = [...selected].filter(id => allAgents.find(a => a.id === id)).length;

  /* ════════ render ════════ */
  return (
    <div style={{ position: 'relative' }}>

      {/* ── Header row ── */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <div style={{ fontSize: 18, fontWeight: 700, color: '#fff', letterSpacing: -0.5 }}>Agent Library</div>
          <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 3 }}>
            Select which agents feed your dashboard.&nbsp;
            <span style={{ color: activeCount > 0 ? 'var(--accent-bright)' : 'var(--red)' }}>
              {activeCount} of {allAgents.length} active
            </span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => { const s = new Set(allIds); setSelected(s); saveSelected(s); }} style={pillBtn}>
            Select all
          </button>
          <button onClick={() => { const s = new Set(); setSelected(s); saveSelected(s); }} style={{ ...pillBtn, color: 'var(--muted)' }}>
            Clear all
          </button>
          <button onClick={openAddDrawer} style={{ ...pillBtn, color: '#fff', background: 'rgba(69,131,255,0.18)', border: '1px solid rgba(69,131,255,0.35)' }}>
            + Add Agent
          </button>
        </div>
      </div>

      {/* ── Agent grid ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
        {allAgents.map(agent => {
          const active    = selected.has(agent.id);
          const isHovered = hovered === agent.id;
          const agentGuidelines = guidelines[agent.id] || agent.guidelines || '';
          return (
            <div
              key={agent.id}
              onMouseEnter={() => setHovered(agent.id)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => toggle(agent.id)}
              style={{
                position: 'relative',
                background: active ? 'rgba(10,10,18,0.7)' : 'rgba(6,6,12,0.45)',
                border: active ? `1px solid ${agent.color}44` : '1px solid rgba(255,255,255,0.06)',
                borderRadius: 12,
                padding: '20px 20px 16px',
                backdropFilter: 'blur(14px)',
                WebkitBackdropFilter: 'blur(14px)',
                cursor: 'pointer',
                transition: 'border-color 0.18s, background 0.18s, box-shadow 0.18s',
                boxShadow: active && isHovered
                  ? `0 0 0 1px ${agent.color}33, 0 4px 24px ${agent.color}18`
                  : isHovered ? '0 2px 12px rgba(0,0,0,0.3)' : 'none',
                opacity: active ? 1 : 0.52,
              }}
            >
              {/* Top row */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{
                    width: 34, height: 34, borderRadius: 8,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: active ? agent.colorDim : 'rgba(255,255,255,0.04)',
                    border: `1px solid ${active ? agent.color + '44' : 'rgba(255,255,255,0.07)'}`,
                    fontSize: 15, color: active ? agent.color : 'var(--muted)',
                    transition: 'all 0.18s',
                  }}>
                    {agent.icon}
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: active ? '#fff' : 'var(--muted)' }}>{agent.name}</div>
                    <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', color: active ? agent.badgeColor : 'var(--muted)', marginTop: 2 }}>
                      {agent.badge}
                    </div>
                  </div>
                </div>
                {/* Toggle pill */}
                <div style={{
                  width: 38, height: 22, borderRadius: 11,
                  background: active ? agent.color : 'rgba(255,255,255,0.08)',
                  border: `1px solid ${active ? agent.color : 'rgba(255,255,255,0.1)'}`,
                  position: 'relative', transition: 'background 0.18s, border-color 0.18s', flexShrink: 0,
                }}>
                  <div style={{
                    position: 'absolute', top: 3, left: active ? 19 : 3,
                    width: 14, height: 14, borderRadius: '50%',
                    background: '#fff', transition: 'left 0.18s',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.4)',
                  }} />
                </div>
              </div>

              {/* Description */}
              <p style={{ fontSize: 11.5, color: active ? 'var(--text-dim)' : 'var(--muted)', lineHeight: 1.6, marginBottom: 14, transition: 'color 0.18s' }}>
                {agent.description}
              </p>

              {/* Feed tags */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 14 }}>
                {agent.feeds.map(f => (
                  <span key={f} style={{
                    fontSize: 10, padding: '2px 7px', borderRadius: 4,
                    background: active ? agent.colorDim : 'rgba(255,255,255,0.04)',
                    border: `1px solid ${active ? agent.color + '30' : 'rgba(255,255,255,0.07)'}`,
                    color: active ? agent.color : 'var(--muted)',
                    transition: 'all 0.18s',
                  }}>{f}</span>
                ))}
              </div>

              {/* Guidelines indicator */}
              {agentGuidelines && (
                <div style={{
                  fontSize: 10, color: agent.color, marginBottom: 10,
                  display: 'flex', alignItems: 'center', gap: 4,
                }}>
                  <span style={{ opacity: 0.7 }}>📋</span>
                  <span>Guidelines set</span>
                </div>
              )}

              {/* Footer */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 10 }}>
                <span style={{ fontSize: 10, color: 'var(--muted)' }}>🔄 {agent.updateFreq}</span>
                <div style={{ display: 'flex', gap: 10 }}>
                  {!agent.builtin && (
                    <>
                      <button onClick={e => openEditDrawer(agent, e)} style={footerBtn(agent.color)}>Edit</button>
                      <button onClick={e => deleteCustomAgent(agent.id, e)} style={footerBtn('var(--red)')}>Delete</button>
                    </>
                  )}
                  <button onClick={e => openGuidelinesDrawer(agent, e)} style={footerBtn(agent.color)}>
                    Guidelines {agentGuidelines ? '✓' : '→'}
                  </button>
                  {active && onNavigate && agent.tab && (
                    <button onClick={e => { e.stopPropagation(); onNavigate(agent.tab); }} style={footerBtn(agent.color)}>
                      View →
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {/* ── "Add new" card ── */}
        <div
          onClick={openAddDrawer}
          style={{
            border: '1px dashed rgba(69,131,255,0.25)',
            borderRadius: 12,
            padding: '20px',
            backdropFilter: 'blur(14px)',
            WebkitBackdropFilter: 'blur(14px)',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
            minHeight: 200,
            opacity: hovered === '__add__' ? 0.9 : 0.45,
            transition: 'opacity 0.18s, border-color 0.18s',
            borderColor: hovered === '__add__' ? 'rgba(69,131,255,0.55)' : 'rgba(69,131,255,0.25)',
          }}
          onMouseEnter={() => setHovered('__add__')}
          onMouseLeave={() => setHovered(null)}
        >
          <div style={{
            width: 40, height: 40, borderRadius: 10,
            border: '1px solid rgba(69,131,255,0.3)',
            background: 'rgba(69,131,255,0.08)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 20, color: 'var(--accent)',
          }}>+</div>
          <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--accent-bright)' }}>Add Custom Agent</div>
          <div style={{ fontSize: 11, color: 'var(--muted)', textAlign: 'center', maxWidth: 180 }}>
            Define a new agent with custom data sources and processing guidelines
          </div>
        </div>
      </div>

      {/* Info note */}
      <div style={{ marginTop: 20, padding: '12px 16px', background: 'rgba(69,131,255,0.06)', border: '1px solid rgba(69,131,255,0.15)', borderRadius: 8, fontSize: 11.5, color: 'var(--muted)', lineHeight: 1.6 }}>
        <span style={{ color: 'var(--accent-bright)', fontWeight: 600 }}>Tip:</span> Deselecting an agent hides it from your dashboard feeds. Click <strong style={{ color: 'var(--text-dim)' }}>Guidelines</strong> on any agent to give it specific instructions on how to process and prioritise incoming data.
      </div>

      {/* ════════════════════════════════════════════════
          DRAWER OVERLAY
      ════════════════════════════════════════════════ */}
      {drawerOpen && (
        <>
          {/* backdrop */}
          <div
            onClick={closeDrawer}
            style={{
              position: 'fixed', inset: 0, zIndex: 40,
              background: 'rgba(0,0,0,0.55)',
              backdropFilter: 'blur(4px)',
              WebkitBackdropFilter: 'blur(4px)',
            }}
          />
          {/* panel */}
          <div style={{
            position: 'fixed', top: 0, right: 0, bottom: 0, zIndex: 50,
            width: 480, maxWidth: '95vw',
            background: 'rgba(8,9,20,0.97)',
            borderLeft: '1px solid rgba(255,255,255,0.1)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            display: 'flex', flexDirection: 'column',
            overflowY: 'auto',
          }}>
            {drawerMode === 'guidelines'
              ? <GuidelinesPanel
                  agentId={editTarget}
                  allAgents={allAgents}
                  guidelines={guidelines}
                  form={form}
                  setField={setField}
                  onSave={saveGuidelinesOnly}
                  onClose={closeDrawer}
                />
              : <AgentFormPanel
                  mode={drawerMode}
                  step={step}
                  form={form}
                  errors={errors}
                  setField={setField}
                  onNext={nextStep}
                  onBack={() => setStep(s => s - 1)}
                  onSave={saveAgent}
                  onClose={closeDrawer}
                  nameRef={nameRef}
                />
            }
          </div>
        </>
      )}
    </div>
  );
}

/* ─── Guidelines-only panel (for built-ins & custom) ─────────── */
function GuidelinesPanel({ agentId, allAgents, guidelines, form, setField, onSave, onClose }) {
  const agent = allAgents.find(a => a.id === agentId);
  if (!agent) return null;
  return (
    <div style={{ padding: '28px 28px 24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: `${agent.color}18`, border: `1px solid ${agent.color}44`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 14, color: agent.color,
          }}>{agent.icon}</div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>{agent.name}</div>
            <div style={{ fontSize: 10, color: 'var(--muted)' }}>Agent Guidelines</div>
          </div>
        </div>
        <button onClick={onClose} style={closeBtn}>✕</button>
      </div>

      <div style={{ fontSize: 11.5, color: 'var(--muted)', marginBottom: 16, lineHeight: 1.7 }}>
        Write instructions that tell this agent <strong style={{ color: 'var(--text-dim)' }}>how to process new data</strong> — what to prioritise, what to ignore, how to score or flag information, and what format to surface results in.
      </div>

      <GuidelinesExamples color={agent.color} />

      <label style={labelStyle}>Guidelines</label>
      <textarea
        value={form.guidelines}
        onChange={e => setField('guidelines', e.target.value)}
        placeholder={`e.g.\n• Focus only on Permian Basin activity\n• Flag any rig count drop > 5% as high priority\n• Ignore international news unless it affects US prices\n• Always include an IBM sales angle in summaries`}
        style={{ ...textareaStyle, flex: 1, minHeight: 240 }}
        autoFocus
      />

      <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
        <button onClick={onSave} style={primaryBtn(agent.color)}>Save Guidelines</button>
        <button onClick={onClose} style={ghostBtn}>Cancel</button>
      </div>
    </div>
  );
}

/* ─── Add / Edit agent multi-step form ───────────────────────── */
function AgentFormPanel({ mode, step, form, errors, setField, onNext, onBack, onSave, onClose, nameRef }) {
  const isEdit = mode === 'edit';
  const title = isEdit ? 'Edit Agent' : 'Add Custom Agent';
  const accent = form.color?.hex || '#4583ff';

  return (
    <div style={{ padding: '28px 28px 24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: '#fff' }}>{title}</div>
        <button onClick={onClose} style={closeBtn}>✕</button>
      </div>

      {/* Step indicator */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 28 }}>
        {['Identity', 'Data Sources', 'Guidelines'].map((label, i) => {
          const s = i + 1;
          const done = step > s;
          const active = step === s;
          return (
            <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 6, flex: 1 }}>
              <div style={{
                width: 20, height: 20, borderRadius: '50%', flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 10, fontWeight: 700,
                background: done ? accent : active ? `${accent}28` : 'rgba(255,255,255,0.06)',
                border: `1px solid ${done || active ? accent : 'rgba(255,255,255,0.1)'}`,
                color: done ? '#fff' : active ? accent : 'var(--muted)',
              }}>
                {done ? '✓' : s}
              </div>
              <span style={{ fontSize: 11, color: active ? '#fff' : 'var(--muted)', whiteSpace: 'nowrap' }}>{label}</span>
              {i < 2 && <div style={{ flex: 1, height: 1, background: done ? `${accent}66` : 'rgba(255,255,255,0.07)' }} />}
            </div>
          );
        })}
      </div>

      {/* ─ Step 1: Identity ─ */}
      {step === 1 && (
        <div style={{ flex: 1 }}>
          <label style={labelStyle}>Agent Name *</label>
          <input
            ref={nameRef}
            value={form.name}
            onChange={e => setField('name', e.target.value)}
            placeholder="e.g. Competitor Watch, ESG Tracker…"
            style={{ ...inputStyle, borderColor: errors.name ? 'var(--red)' : 'rgba(255,255,255,0.1)' }}
          />
          {errors.name && <div style={errStyle}>{errors.name}</div>}

          <label style={{ ...labelStyle, marginTop: 18 }}>Icon</label>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 18 }}>
            {ICON_OPTIONS.map(ic => (
              <button key={ic} onClick={() => setField('icon', ic)} style={{
                width: 36, height: 36, borderRadius: 8, cursor: 'pointer', fontSize: 15,
                background: form.icon === ic ? `${accent}22` : 'rgba(255,255,255,0.04)',
                border: `1px solid ${form.icon === ic ? accent : 'rgba(255,255,255,0.1)'}`,
                color: form.icon === ic ? accent : 'var(--muted)',
                fontFamily: 'inherit', transition: 'all 0.15s',
              }}>{ic}</button>
            ))}
          </div>

          <label style={labelStyle}>Accent Colour</label>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 18 }}>
            {COLOR_OPTIONS.map(col => (
              <button key={col.hex} onClick={() => setField('color', col)} style={{
                width: 28, height: 28, borderRadius: '50%', cursor: 'pointer',
                background: col.hex,
                border: `2px solid ${form.color?.hex === col.hex ? '#fff' : 'transparent'}`,
                outline: form.color?.hex === col.hex ? `2px solid ${col.hex}` : 'none',
                outlineOffset: 2, transition: 'all 0.15s',
              }} />
            ))}
          </div>

          <label style={labelStyle}>Description *</label>
          <textarea
            value={form.description}
            onChange={e => setField('description', e.target.value)}
            placeholder="What does this agent monitor and why does it matter?"
            style={{ ...textareaStyle, minHeight: 80, borderColor: errors.description ? 'var(--red)' : 'rgba(255,255,255,0.1)' }}
          />
          {errors.description && <div style={errStyle}>{errors.description}</div>}
        </div>
      )}

      {/* ─ Step 2: Data sources ─ */}
      {step === 2 && (
        <div style={{ flex: 1 }}>
          <label style={labelStyle}>Data Sources / Feed Tags *</label>
          <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 8, lineHeight: 1.6 }}>
            Enter comma-separated labels for what this agent watches. These become the tags shown on the card.
          </div>
          <textarea
            value={form.feeds}
            onChange={e => setField('feeds', e.target.value)}
            placeholder="e.g. Competitor Pricing, Earnings Calls, Press Releases, Patent Filings"
            style={{ ...textareaStyle, minHeight: 100, borderColor: errors.feeds ? 'var(--red)' : 'rgba(255,255,255,0.1)' }}
            autoFocus
          />
          {errors.feeds && <div style={errStyle}>{errors.feeds}</div>}

          {/* live preview of tags */}
          {form.feeds.trim() && (
            <div style={{ marginTop: 12 }}>
              <div style={{ fontSize: 10, color: 'var(--muted)', marginBottom: 6 }}>Preview</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                {form.feeds.split(',').map(f => f.trim()).filter(Boolean).map(f => (
                  <span key={f} style={{
                    fontSize: 10, padding: '2px 7px', borderRadius: 4,
                    background: form.color?.dim,
                    border: `1px solid ${form.color?.hex}30`,
                    color: form.color?.hex,
                  }}>{f}</span>
                ))}
              </div>
            </div>
          )}

          <label style={{ ...labelStyle, marginTop: 20 }}>Update Frequency</label>
          <select
            value={form.updateFreq}
            onChange={e => setField('updateFreq', e.target.value)}
            style={{ ...inputStyle, cursor: 'pointer' }}
          >
            {FREQ_OPTIONS.map(f => <option key={f} value={f}>{f}</option>)}
          </select>
        </div>
      )}

      {/* ─ Step 3: Guidelines ─ */}
      {step === 3 && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: 11.5, color: 'var(--muted)', marginBottom: 14, lineHeight: 1.7 }}>
            Tell this agent <strong style={{ color: 'var(--text-dim)' }}>exactly how to handle new data</strong>. Think of it like a prompt — what to prioritise, what to skip, how to score and format results.
          </div>
          <GuidelinesExamples color={accent} />
          <label style={labelStyle}>Guidelines</label>
          <textarea
            value={form.guidelines}
            onChange={e => setField('guidelines', e.target.value)}
            placeholder={`e.g.\n• Only surface news with direct revenue impact\n• Score urgency 1–10 based on deal size and timeline\n• Ignore anything older than 48 hours\n• Always pair findings with a recommended IBM action`}
            style={{ ...textareaStyle, flex: 1, minHeight: 220 }}
            autoFocus
          />
        </div>
      )}

      {/* Footer buttons */}
      <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
        {step > 1 && (
          <button onClick={onBack} style={ghostBtn}>← Back</button>
        )}
        {step < 3 && (
          <button onClick={onNext} style={primaryBtn(accent)}>Continue →</button>
        )}
        {step === 3 && (
          <button onClick={onSave} style={primaryBtn(accent)}>
            {isEdit ? 'Save Changes' : 'Create Agent'}
          </button>
        )}
        <button onClick={onClose} style={{ ...ghostBtn, marginLeft: 'auto' }}>Cancel</button>
      </div>
    </div>
  );
}

/* ─── Guidelines examples hint box ──────────────────────────── */
function GuidelinesExamples({ color }) {
  return (
    <div style={{
      marginBottom: 16, padding: '10px 14px',
      background: `${color}0c`, border: `1px solid ${color}22`, borderRadius: 8,
      fontSize: 11, color: 'var(--muted)', lineHeight: 1.7,
    }}>
      <div style={{ color, fontWeight: 600, marginBottom: 4 }}>Example instructions</div>
      <div>• Only alert when confidence score is above 80%</div>
      <div>• Ignore press releases from companies with &lt; $1B revenue</div>
      <div>• Always include an IBM Consulting sales angle</div>
      <div>• Summarise in 2 sentences max, then bullet key facts</div>
    </div>
  );
}

/* ─── Shared style tokens ────────────────────────────────────── */
const pillBtn = {
  fontSize: 11, padding: '5px 12px', borderRadius: 6,
  background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
  color: 'var(--accent-bright)', cursor: 'pointer', fontFamily: 'inherit',
};
const closeBtn = {
  background: 'none', border: 'none', color: 'var(--muted)',
  fontSize: 16, cursor: 'pointer', padding: '4px 6px', fontFamily: 'inherit',
};
const labelStyle = {
  display: 'block', fontSize: 10, fontWeight: 700, textTransform: 'uppercase',
  letterSpacing: '0.1em', color: 'var(--muted)', marginBottom: 7,
};
const inputStyle = {
  width: '100%', background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.1)', borderRadius: 7,
  color: 'var(--text)', padding: '9px 12px', fontSize: 12.5,
  fontFamily: 'inherit', outline: 'none', marginBottom: 2,
};
const textareaStyle = {
  ...inputStyle,
  resize: 'vertical', lineHeight: 1.65,
};
const errStyle = { fontSize: 10.5, color: 'var(--red)', marginTop: 4, marginBottom: 4 };

const primaryBtn = color => ({
  padding: '9px 18px', borderRadius: 7, cursor: 'pointer',
  background: color, border: 'none',
  color: '#fff', fontSize: 12.5, fontWeight: 600, fontFamily: 'inherit',
});
const ghostBtn = {
  padding: '9px 16px', borderRadius: 7, cursor: 'pointer',
  background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
  color: 'var(--muted)', fontSize: 12, fontFamily: 'inherit',
};
const footerBtn = color => ({
  fontSize: 10, color, background: 'none', border: 'none',
  cursor: 'pointer', fontFamily: 'inherit', padding: 0,
});
