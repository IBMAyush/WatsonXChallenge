import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useInView, AnimatePresence, useMotionValue, useSpring, useMotionTemplate } from 'framer-motion';
import ReactLenis from 'lenis/react';
import {
  Activity, BarChart3, Brain, ChevronRight, Cpu,
  Globe, Layers, Network, Radar, Shield, Sparkles, TrendingUp,
  Zap, ArrowRight, Play, CheckCircle2, Circle, ExternalLink
} from 'lucide-react';

// ── Skiper components ──────────────────────────────────────
import { ProgressiveBlur }   from '../components/skiper/ProgressiveBlur';
import { RollLink }          from '../components/skiper/TextRoll';
import { MouseFollowSpotlight, MouseFollowContainer } from '../components/skiper/MouseFollow';
import { ScrollProgress }    from '../components/skiper/ScrollProgress';
import { AnimatedStat }      from '../components/skiper/AnimatedNumber';
import { ExpandOnHoverCards } from '../components/skiper/ExpandOnHover';
import { ScatterText }       from '../components/skiper/TextScatter';
import { Perspective3DText } from '../components/skiper/Perspective3DText';

// ── Background ─────────────────────────────────────────────
function NexusBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <div className="absolute inset-0" style={{ background: 'oklch(0.075 0.022 260)' }} />
      <div className="absolute inset-0 opacity-[0.038]" style={{
        backgroundImage: 'linear-gradient(to right,white 1px,transparent 1px),linear-gradient(to bottom,white 1px,transparent 1px)',
        backgroundSize: '64px 64px',
      }} />
      <motion.div
        className="absolute -top-1/4 left-1/2 -translate-x-1/2 w-[900px] h-[600px] rounded-full"
        style={{ background: 'radial-gradient(ellipse,rgba(91,150,255,0.26) 0%,transparent 70%)' }}
        animate={{ scale: [1, 1.09, 1], opacity: [0.22, 0.32, 0.22] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute top-1/3 -left-40 w-[500px] h-[500px] rounded-full"
        style={{ background: 'radial-gradient(ellipse,rgba(167,139,250,0.12) 0%,transparent 70%)' }}
        animate={{ x: [0, 40, 0], y: [0, -20, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-1/4 -right-40 w-[440px] h-[440px] rounded-full"
        style={{ background: 'radial-gradient(ellipse,rgba(45,212,191,0.1) 0%,transparent 70%)' }}
        animate={{ x: [0, -30, 0], y: [0, 25, 0] }}
        transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut' }}
      />
      {/* Scan line — skiper scan effect */}
      <motion.div
        className="absolute left-0 right-0 h-px"
        style={{ background: 'linear-gradient(to right,transparent,rgba(91,150,255,0.3),transparent)' }}
        animate={{ y: ['-5vh', '110vh'] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'linear', repeatDelay: 3 }}
      />
      {/* Rings */}
      {[320, 520, 740].map((s, i) => (
        <motion.div
          key={s}
          className="absolute left-1/2 rounded-full border border-primary/10 pointer-events-none"
          style={{ width: s, height: s, top: '38%', marginLeft: -s/2, marginTop: -s/2 }}
          animate={{ opacity: [0.32, 0.09, 0.32] }}
          transition={{ duration: 4.5 + i * 1.2, repeat: Infinity, ease: 'easeInOut', delay: i * 0.9 }}
        />
      ))}
    </div>
  );
}

// ── Floating particles ─────────────────────────────────────
function Particles() {
  const pts = useRef(
    Array.from({ length: 22 }, (_, i) => ({
      id: i, x: Math.random() * 100, y: Math.random() * 100,
      s: 1 + Math.random() * 2, d: 6 + Math.random() * 10, dl: Math.random() * 6,
    }))
  ).current;
  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      {pts.map(p => (
        <motion.div key={p.id} className="absolute rounded-full bg-primary/50"
          style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.s, height: p.s }}
          animate={{ y: [0, -24, 0], opacity: [0.32, 0.85, 0.32] }}
          transition={{ duration: p.d, delay: p.dl, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
    </div>
  );
}

// ── FadeIn wrapper ─────────────────────────────────────────
function FadeIn({ children, delay = 0, className = '', direction = 'up' }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const variants = {
    up:    { hidden: { opacity: 0, y: 40 },    visible: { opacity: 1, y: 0 } },
    left:  { hidden: { opacity: 0, x: -40 },   visible: { opacity: 1, x: 0 } },
    right: { hidden: { opacity: 0, x: 40 },    visible: { opacity: 1, x: 0 } },
    scale: { hidden: { opacity: 0, scale: 0.85 }, visible: { opacity: 1, scale: 1 } },
  };
  return (
    <motion.div ref={ref} className={className}
      initial="hidden" animate={inView ? 'visible' : 'hidden'}
      variants={variants[direction]}
      transition={{ duration: 0.65, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {children}
    </motion.div>
  );
}

// ── Typewriter ─────────────────────────────────────────────
const PHRASES = ['Oil & Gas Intelligence', 'Deal Scoring in Seconds', 'Market Monitoring 24/7', 'Automated Workflows', 'Client Intelligence'];
function Typewriter() {
  const [pi, setPi] = useState(0);
  const [ci, setCi] = useState(0);
  const [del, setDel] = useState(false);
  useEffect(() => {
    const phrase = PHRASES[pi];
    let t;
    if (!del && ci < phrase.length)       t = setTimeout(() => setCi(c => c + 1), 58);
    else if (!del && ci === phrase.length) t = setTimeout(() => setDel(true), 1900);
    else if (del && ci > 0)               t = setTimeout(() => setCi(c => c - 1), 32);
    else { setDel(false); setPi(p => (p + 1) % PHRASES.length); }
    return () => clearTimeout(t);
  }, [ci, del, pi]);
  return (
    <span style={{ background: 'linear-gradient(90deg,#6fb2ff,#a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
      {PHRASES[pi].slice(0, ci)}
      <motion.span className="inline-block w-0.5 h-[0.85em] bg-primary ml-0.5 align-middle"
        animate={{ opacity: [1, 0, 1] }} transition={{ duration: 1, repeat: Infinity }} />
    </span>
  );
}

// ── NAV ────────────────────────────────────────────────────
function Nav({ onEnter }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', h);
    return () => window.removeEventListener('scroll', h);
  }, []);

  const navLinks = ['Features', 'Agents', 'Roadmap', 'Metrics'];

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 px-8 h-16 flex items-center justify-between transition-all duration-500 ${scrolled ? 'bg-[oklch(0.08_0.025_260)]/90 backdrop-blur-xl border-b border-white/[0.06]' : ''}`}
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3">
        <div className="relative h-8 w-8 grid place-items-center rounded-md bg-primary/15 border border-primary/40">
          <svg viewBox="0 0 24 24" className="h-4 w-4 text-primary" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="3" /><circle cx="12" cy="12" r="7" opacity=".5" /><circle cx="12" cy="12" r="11" opacity=".2" />
          </svg>
          <motion.span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-green-400"
            animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 2, repeat: Infinity }} />
        </div>
        <div className="leading-tight">
          <div className="text-[9px] tracking-[0.24em] text-white/30 font-mono uppercase">IBM · Internal</div>
          <div className="text-sm font-bold text-white">NEXUS<span className="text-primary">.</span></div>
        </div>
      </div>

      {/* TextRoll nav links — skiper58 */}
      <div className="hidden md:flex items-center gap-8">
        {navLinks.map(l => (
          <RollLink
            key={l}
            href={`#${l.toLowerCase()}`}
            className="text-sm text-white/45 hover:text-white transition-colors"
          >
            {l}
          </RollLink>
        ))}
      </div>

      <motion.button onClick={onEnter}
        className="px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-1.5 cursor-pointer text-[oklch(0.12_0.02_260)]"
        style={{ background: 'linear-gradient(135deg,oklch(0.68 0.18 254),oklch(0.62 0.22 270))' }}
        whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
      >
        Launch Dashboard <ArrowRight className="h-3.5 w-3.5" />
      </motion.button>
    </motion.nav>
  );
}

// ── HERO ───────────────────────────────────────────────────
function Hero({ onEnter }) {
  const { scrollY } = useScroll();

  // Rest of hero fades + drifts up normally
  const restY       = useTransform(scrollY, [0, 500], [0, 120]);
  const restOpacity = useTransform(scrollY, [0, 400], [1, 0]);

  // "IBM NEXUS" suck-away: stretches vertically then rockets upward and vanishes
  const titleScaleY  = useTransform(scrollY, [0, 220], [1, 2.8]);
  const titleY       = useTransform(scrollY, [0, 380], [0, -340]);
  const titleOpacity = useTransform(scrollY, [160, 340], [1, 0]);
  const titleBlur    = useTransform(scrollY, [120, 340], [0, 12]);

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-24 pb-32 text-center">

      <motion.div style={{ y: restY, opacity: restOpacity }} className="relative z-10 max-w-5xl mx-auto">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-xs font-mono text-primary mb-8"
        >
          <motion.span className="h-1.5 w-1.5 rounded-full bg-green-400 inline-block"
            animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.8, repeat: Infinity }} />
          IBM Hackathon 2025 · Bobathon
          <Sparkles className="h-3 w-3" />
        </motion.div>

        {/* H1 — in normal flow, transforms applied via relative positioned wrapper */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.7 }}
          className="relative z-20 mb-4"
          style={{
            y: titleY,
            scaleY: titleScaleY,
            opacity: titleOpacity,
            filter: useMotionTemplate`blur(${titleBlur}px)`,
            transformOrigin: 'center top',
          }}
        >
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight text-white leading-[1.04]">
            IBM{' '}
            <span style={{ background: 'linear-gradient(135deg,#75b2ff 0%,#a78bfa 45%,#5b96ff 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              NEXUS
            </span>
          </h1>
        </motion.div>

        {/* Typewriter */}
        <motion.div className="text-2xl md:text-3xl font-medium text-white/70 mb-6 h-10"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
          <Typewriter />
        </motion.div>

        {/* Desc */}
        <motion.p className="max-w-2xl mx-auto text-base md:text-lg text-white/45 leading-relaxed mb-12"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.65 }}>
          Four specialized AI agents that continuously monitor energy markets, score opportunities with an 8-factor algorithm, and execute seven automated workflows — so your sales team spends time closing, not researching.
        </motion.p>

        {/* CTAs */}
        <motion.div className="flex flex-col sm:flex-row items-center justify-center gap-4"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}>
          <motion.button onClick={onEnter}
            className="group relative px-8 py-4 rounded-xl text-sm font-semibold flex items-center gap-2.5 overflow-hidden text-[oklch(0.12_0.02_260)] cursor-pointer"
            style={{ background: 'linear-gradient(135deg,oklch(0.68 0.18 254),oklch(0.62 0.22 270))' }}
            whileHover={{ scale: 1.04, boxShadow: '0 0 40px rgba(91,150,255,0.4)' }}
            whileTap={{ scale: 0.96 }}>
            <span>Launch Dashboard</span>
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </motion.button>
          <motion.a href="#features"
            className="px-8 py-4 rounded-xl text-sm font-semibold text-white/70 border border-white/10 bg-white/[0.03] hover:bg-white/[0.07] hover:text-white transition-all flex items-center gap-2"
            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Play className="h-3.5 w-3.5" />See How It Works
          </motion.a>
        </motion.div>

        <motion.div className="absolute -bottom-16 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/22 text-[10px] font-mono tracking-widest"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}>
          SCROLL
          <motion.div className="h-8 w-px bg-gradient-to-b from-white/20 to-transparent"
            animate={{ scaleY: [0.5, 1, 0.5] }} transition={{ duration: 1.5, repeat: Infinity }} />
        </motion.div>
      </motion.div>
    </section>
  );
}

// ── STATS BAR — AnimatedStat (skiper37) ───────────────────
const STATS = [
  { label: 'Hours saved / user / week', value: 10, suffix: '+',  prefix: '' },
  { label: 'Faster deal response',      value: 70, suffix: '%',  prefix: '' },
  { label: 'Win-rate lift',             value: 30, suffix: '%',  prefix: '' },
  { label: 'Revenue potential',         value: 5,  suffix: 'M+', prefix: '$' },
];
function StatsBar() {
  return (
    <section className="relative z-10 py-12 px-6">
      <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-px bg-white/[0.05] rounded-2xl overflow-hidden border border-white/[0.06]">
        {STATS.map((s, i) => (
          <FadeIn key={s.label} delay={i * 0.1} className="bg-[oklch(0.11_0.02_260)] p-8 text-center">
            <div className="text-4xl font-black text-white tabular-nums mb-1">
              <AnimatedStat value={s.value} prefix={s.prefix} suffix={s.suffix} />
            </div>
            <div className="text-[11px] text-white/38 font-mono tracking-wider">{s.label}</div>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}

// ── TICKER ─────────────────────────────────────────────────
const TICKS = [
  { sym: 'WTI', val: '$82.40', d: '+1.2%', up: true },
  { sym: 'BRENT', val: '$85.60', d: '+0.9%', up: true },
  { sym: 'NAT GAS', val: '$2.84', d: '-0.4%', up: false },
  { sym: 'XOM', val: '$118.20', d: '+2.1%', up: true },
  { sym: 'CVX', val: '$162.80', d: '+0.7%', up: true },
  { sym: 'SLB', val: '$48.30', d: '-0.3%', up: false },
  { sym: 'HAL', val: '$34.50', d: '+1.5%', up: true },
  { sym: 'COP', val: '$128.90', d: '0.0%', up: null },
  { sym: 'DXY', val: '104.2', d: '-0.1%', up: false },
  { sym: 'GOLD', val: '$2,342', d: '+0.5%', up: true },
];
function Ticker() {
  return (
    <div className="relative z-10 h-9 border-y border-white/[0.06] bg-[oklch(0.08_0.025_260)]/80 overflow-hidden flex items-center">
      <div className="absolute inset-y-0 left-0 w-16 z-10 pointer-events-none" style={{ background: 'linear-gradient(to right,oklch(0.08 0.025 260),transparent)' }} />
      <div className="absolute inset-y-0 right-0 w-16 z-10 pointer-events-none" style={{ background: 'linear-gradient(to left,oklch(0.08 0.025 260),transparent)' }} />
      <motion.div className="flex whitespace-nowrap font-mono text-[11px]"
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: 36, repeat: Infinity, ease: 'linear' }}>
        {[...TICKS, ...TICKS].map((t, i) => (
          <span key={i} className="inline-flex items-center gap-2 px-5 border-r border-white/[0.06]">
            <span className="text-white/30 tracking-widest">{t.sym}</span>
            <span className="text-white">{t.val}</span>
            <span className={t.up === true ? 'text-green-400' : t.up === false ? 'text-red-400' : 'text-white/40'}>{t.d}</span>
          </span>
        ))}
      </motion.div>
    </div>
  );
}

// ── AGENTS — ExpandOnHover (skiper52) + ProgressiveBlur (skiper41) ──
const AGENTS_DATA = [
  {
    icon: <Activity className="h-5 w-5" style={{ color: '#22c55e' }} />,
    title: 'Market Monitor', label: 'Market',
    iconBg: 'rgba(34,197,94,0.12)', glowColor: 'rgba(34,197,94,0.14)', borderColor: 'rgba(34,197,94,0.3)',
    events: '1,240 events/day',
    desc: 'Real-time commodity prices, energy market shifts, and macro indicators — refreshed every 60 min across 20+ data sources.',
  },
  {
    icon: <Globe className="h-5 w-5" style={{ color: '#5b96ff' }} />,
    title: 'News Intelligence', label: 'News',
    iconBg: 'rgba(91,150,255,0.12)', glowColor: 'rgba(91,150,255,0.14)', borderColor: 'rgba(91,150,255,0.3)',
    events: '840 articles/day',
    desc: 'Aggregates and summarizes breaking energy sector news, press releases, and filings with AI sentiment scoring.',
  },
  {
    icon: <Radar className="h-5 w-5" style={{ color: '#f5a623' }} />,
    title: 'Deal Radar', label: 'Deals',
    iconBg: 'rgba(245,166,35,0.12)', glowColor: 'rgba(245,166,35,0.14)', borderColor: 'rgba(245,166,35,0.3)',
    events: '320 scores/day',
    desc: '8-factor opportunity scoring engine that ranks and prioritizes deals before competitors can react.',
  },
  {
    icon: <Brain className="h-5 w-5" style={{ color: '#a78bfa' }} />,
    title: 'Client Intelligence', label: 'Clients',
    iconBg: 'rgba(167,139,250,0.12)', glowColor: 'rgba(167,139,250,0.14)', borderColor: 'rgba(167,139,250,0.3)',
    events: '180 profiles',
    desc: 'Deep account profiling with relationship mapping, org-chart tracking, and buying-signal detection at 200+ companies.',
  },
];

function AgentsSection() {
  return (
    <section id="agents" className="relative z-10 py-28 px-6">
      <div className="max-w-6xl mx-auto">
        <FadeIn className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-xs font-mono text-primary/80 mb-4">
            <Cpu className="h-3 w-3" /> Agent Mesh
          </div>
          {/* ScatterText on section heading (skiper31) */}
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
            <ScatterText>Four Minds. One Intelligence.</ScatterText>
          </h2>
          <p className="text-white/45 max-w-xl mx-auto">Specialized AI agents collaborate in real time, each mastering a domain so the whole is greater than the sum of parts.</p>
        </FadeIn>

        {/* ExpandOnHover cards (skiper52) */}
        <FadeIn>
          <ExpandOnHoverCards items={AGENTS_DATA} />
        </FadeIn>

        {/* Live stats row */}
        <div className="mt-6 grid grid-cols-4 gap-3">
          {AGENTS_DATA.map((a, i) => (
            <FadeIn key={a.title} delay={i * 0.08} className="text-center">
              <div className="text-[10px] font-mono tracking-wider mt-2" style={{ color: a.borderColor }}>
                {a.events}
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── FEATURES — MouseFollowContainer (skiper61) ────────────
const FEATURES = [
  { icon: Zap,       label: '< 3s Response',    desc: 'Sub-3-second AI answers across all four agents, even at 1,000 req/min peak load.',             color: 'rgba(91,150,255,0.15)' },
  { icon: Shield,    label: '99.9% Uptime SLA', desc: 'Enterprise-grade IBM Cloud with redundant failover and full SOC 2 compliance.',                  color: 'rgba(34,197,94,0.12)' },
  { icon: Layers,    label: 'Slack-Native',     desc: 'Eight natural-language slash commands — no context switching, no new tools.',                    color: 'rgba(167,139,250,0.12)' },
  { icon: BarChart3, label: '8-Factor Scoring', desc: 'Proprietary algorithm weighing market timing, deal size, relationship strength.',                color: 'rgba(245,166,35,0.12)' },
  { icon: Network,   label: 'Live Integrations',desc: 'Alpha Vantage, NewsAPI, Salesforce CRM, Watson NLP — wired together in real time.',             color: 'rgba(45,212,191,0.1)' },
  { icon: TrendingUp,label: '7 Auto-Workflows', desc: 'From opportunity detection to CRM update: seven end-to-end workflows run autonomously.',         color: 'rgba(91,150,255,0.12)' },
];

function FeaturesSection() {
  return (
    <section id="features" className="relative z-10 py-28 px-6">
      <div className="max-w-6xl mx-auto">
        <FadeIn className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-xs font-mono text-primary/80 mb-4">
            <Zap className="h-3 w-3" /> Platform Features
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
            <ScatterText>Built for Enterprise Scale.</ScatterText>
          </h2>
          <p className="text-white/45 max-w-xl mx-auto">Every capability engineered to IBM production standards — reliable, secure, and fast.</p>
        </FadeIn>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map((f, i) => {
            const Icon = f.icon;
            return (
              <FadeIn key={f.label} delay={i * 0.07} direction="up">
                {/* MouseFollowContainer — skiper61 */}
                <MouseFollowContainer color={f.color} size={320} className="h-full rounded-2xl border border-white/[0.06] bg-white/[0.025] p-6">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 border border-primary/20 grid place-items-center mb-4">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-bold text-white mb-2">{f.label}</h3>
                  <p className="text-sm text-white/45 leading-relaxed">{f.desc}</p>
                </MouseFollowContainer>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ── ROADMAP ────────────────────────────────────────────────
const TIMELINE = [
  { phase: 'Phase 1', label: 'MVP',                   status: 'done',   desc: '5,000+ lines, 4 AI agents, Slack bot, REST API — fully functional.' },
  { phase: 'Phase 2', label: 'watsonx Integration',   status: 'active', desc: 'Five watsonx Orchestrate skills, natural-language assistant, end-to-end Slack flows.' },
  { phase: 'Phase 3', label: 'Production Deploy',     status: 'pend',   desc: 'IBM Cloud deployment, SSL, API auth, monitoring, load-tested at 100 concurrent users.' },
  { phase: 'Phase 4', label: 'Real Data Pipelines',   status: 'pend',   desc: 'Live market feeds, NewsAPI, Salesforce sync, Watson NLP sentiment.' },
  { phase: 'Phase 5', label: 'Scale & Expand',        status: 'pend',   desc: '200+ users, mobile apps, multi-industry rollout, $10M+ attributed revenue target.' },
];
const TL_COLORS = { done: '#22c55e', active: '#5b96ff', pend: 'rgba(255,255,255,0.2)' };

function RoadmapSection() {
  return (
    <section id="roadmap" className="relative z-10 py-28 px-6">
      <div className="max-w-4xl mx-auto">
        <FadeIn className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-xs font-mono text-primary/80 mb-4">
            <TrendingUp className="h-3 w-3" /> Roadmap
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
            <ScatterText>From MVP to Market.</ScatterText>
          </h2>
          <p className="text-white/45 max-w-xl mx-auto">A clear five-phase plan from hackathon demo to $10M+ production impact.</p>
        </FadeIn>

        <div className="relative">
          <div className="absolute left-[19px] top-0 bottom-0 w-px bg-white/[0.06]" />
          <div className="space-y-7">
            {TIMELINE.map((t, i) => (
              <FadeIn key={t.phase} delay={i * 0.1} direction="left">
                <div className="flex gap-6 items-start">
                  <div className="relative shrink-0 mt-1">
                    <motion.div
                      className="h-9 w-9 rounded-full border-2 grid place-items-center"
                      style={{ borderColor: TL_COLORS[t.status], backgroundColor: `color-mix(in srgb,${TL_COLORS[t.status]} 12%,transparent)` }}
                      animate={t.status === 'active' ? { boxShadow: [`0 0 0 0 rgba(91,150,255,0.5)`, `0 0 0 10px transparent`] } : {}}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      {t.status === 'done'   && <CheckCircle2 className="h-4 w-4" style={{ color: TL_COLORS.done }} />}
                      {t.status === 'active' && <motion.div className="h-2 w-2 rounded-full bg-primary" animate={{ scale: [1, 1.4, 1] }} transition={{ duration: 1.5, repeat: Infinity }} />}
                      {t.status === 'pend'   && <Circle className="h-4 w-4 text-white/20" />}
                    </motion.div>
                  </div>
                  <MouseFollowContainer color={`${TL_COLORS[t.status]}22`} size={280} className="flex-1 p-5 rounded-2xl border border-white/[0.06] bg-white/[0.025]">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div>
                        <span className="text-[10px] font-mono text-white/28 uppercase tracking-widest">{t.phase}</span>
                        <h3 className="font-bold text-white text-base">{t.label}</h3>
                      </div>
                      <span className="text-[10px] font-mono shrink-0 mt-1" style={{ color: TL_COLORS[t.status] }}>
                        {t.status === 'done' ? '✓ Complete' : t.status === 'active' ? '⬤ In Progress' : '○ Planned'}
                      </span>
                    </div>
                    <p className="text-sm text-white/45 leading-relaxed">{t.desc}</p>
                  </MouseFollowContainer>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ── METRICS ────────────────────────────────────────────────
const METRICS = [
  { label: 'Active Users Target',  val: 40, max: 50,  unit: 'of 50 users',  color: '#5b96ff' },
  { label: 'Win Rate Improvement', val: 30, max: 100, unit: '% lift',        color: '#22c55e' },
  { label: 'Research Time Saved',  val: 50, max: 100, unit: '% reduction',   color: '#f5a623' },
  { label: 'NPS Score Target',     val: 50, max: 100, unit: 'score',         color: '#a78bfa' },
];

function MetricsSection() {
  return (
    <section id="metrics" className="relative z-10 py-28 px-6">
      <div className="max-w-5xl mx-auto">
        <FadeIn className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-xs font-mono text-primary/80 mb-4">
            <BarChart3 className="h-3 w-3" /> Success Metrics
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
            <ScatterText>Numbers That Matter.</ScatterText>
          </h2>
          <p className="text-white/45 max-w-xl mx-auto">Six-month targets anchored to real business outcomes — not vanity metrics.</p>
        </FadeIn>

        <div className="grid md:grid-cols-2 gap-5">
          {METRICS.map((m, i) => (
            <FadeIn key={m.label} delay={i * 0.1} direction="scale">
              <MouseFollowContainer color={`${m.color}18`} size={300} className="p-6 rounded-2xl border border-white/[0.06] bg-white/[0.025]">
                <div className="flex items-end justify-between mb-4">
                  <span className="text-sm font-medium text-white/65">{m.label}</span>
                  <span className="text-2xl font-black text-white tabular-nums">
                    <AnimatedStat value={m.val} />
                    <span className="text-sm text-white/38 ml-1">{m.unit}</span>
                  </span>
                </div>
                <div className="h-2 bg-white/[0.05] rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: m.color }}
                    initial={{ width: 0 }}
                    whileInView={{ width: `${(m.val / m.max) * 100}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.4, delay: i * 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
                  />
                </div>
              </MouseFollowContainer>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── SCROLL FEED — Progressive Blur (skiper87 / skiper41) ──
function IntelligenceFeed() {
  const items = [
    { t: 'CRITICAL', label: 'ExxonMobil Q3 earnings beat est. by 12%', time: '2m ago', col: '#ef4444' },
    { t: 'HIGH',     label: 'Saudi Aramco increases CapEx guidance to $50B', time: '8m ago', col: '#f5a623' },
    { t: 'MEDIUM',   label: 'Shell announces new LNG terminal in Singapore', time: '15m ago', col: '#5b96ff' },
    { t: 'HIGH',     label: 'Chevron deal radar: Permian Basin expansion', time: '22m ago', col: '#f5a623' },
    { t: 'LOW',      label: 'OPEC+ maintains production cuts through Q1', time: '34m ago', col: '#a78bfa' },
    { t: 'CRITICAL', label: 'BP activist investor stake reaches 8.2%', time: '41m ago', col: '#ef4444' },
    { t: 'MEDIUM',   label: 'ConocoPhillips acquires Permian assets for $22B', time: '58m ago', col: '#5b96ff' },
    { t: 'HIGH',     label: 'Halliburton wins $4B North Sea contract', time: '1h ago', col: '#f5a623' },
  ];

  return (
    <section className="relative z-10 py-28 px-6">
      <div className="max-w-4xl mx-auto">
        <FadeIn className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-xs font-mono text-primary/80 mb-4">
            <Activity className="h-3 w-3" />
            <motion.span className="h-1.5 w-1.5 rounded-full bg-green-400 inline-block" animate={{ opacity: [1,0.3,1] }} transition={{ duration: 1.6, repeat: Infinity }} />
            Live Intelligence Feed
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
            <ScatterText>Always On. Always Ahead.</ScatterText>
          </h2>
          <p className="text-white/45 max-w-xl mx-auto">Every signal that matters, ranked by priority and delivered in real time.</p>
        </FadeIn>

        {/* Scroll area with progressive blur (skiper41 + skiper87) */}
        <FadeIn>
          <div className="relative rounded-2xl border border-white/[0.07] bg-white/[0.02] overflow-hidden" style={{ height: 340 }}>
            <div className="overflow-y-auto h-full p-2" style={{ scrollbarWidth: 'none' }}>
              <div className="space-y-2 pb-6">
                {[...items, ...items].map((item, i) => (
                  <motion.div
                    key={i}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl border border-white/[0.04] bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/[0.08] transition-all cursor-pointer group"
                    initial={{ opacity: 0, x: -12 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: (i % 8) * 0.05 }}
                  >
                    <div className="h-1.5 w-1.5 rounded-full shrink-0" style={{ backgroundColor: item.col }} />
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded shrink-0" style={{ color: item.col, backgroundColor: `${item.col}18` }}>{item.t}</span>
                    <span className="text-sm text-white/65 flex-1 truncate group-hover:text-white/85 transition-colors">{item.label}</span>
                    <span className="text-[11px] font-mono text-white/22 shrink-0">{item.time}</span>
                    <ChevronRight className="h-3.5 w-3.5 text-white/18 shrink-0 group-hover:translate-x-0.5 transition-transform" />
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Progressive blur top & bottom — skiper41 */}
            <ProgressiveBlur position="top"    height="80px"  backgroundColor="oklch(0.08 0.025 260)" blurAmount="4px" />
            <ProgressiveBlur position="bottom" height="100px" backgroundColor="oklch(0.08 0.025 260)" blurAmount="6px" />
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

// ── CTA ────────────────────────────────────────────────────
function CTASection({ onEnter }) {
  return (
    <section className="relative z-10 py-32 px-6">
      <FadeIn className="max-w-3xl mx-auto text-center" direction="scale">
        <MouseFollowContainer color="rgba(91,150,255,0.12)" size={600} className="px-10 py-16 relative overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.025]">
          <div className="absolute inset-0 opacity-12 pointer-events-none" style={{ background: 'radial-gradient(60% 50% at 50% 0%,oklch(0.68 0.18 254),transparent)' }} />
          <div className="relative">
            <motion.div
              className="h-16 w-16 mx-auto mb-6 rounded-2xl bg-primary/15 border border-primary/30 grid place-items-center"
              animate={{ rotate: [0, 6, -6, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            >
              <svg viewBox="0 0 24 24" className="h-8 w-8 text-primary" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="12" cy="12" r="3" /><circle cx="12" cy="12" r="7" opacity=".5" /><circle cx="12" cy="12" r="11" opacity=".2" />
              </svg>
            </motion.div>
            <h2 className="text-4xl font-black text-white mb-4">Ready to Transform<br />Your Sales Intelligence?</h2>
            <p className="text-white/45 mb-10 leading-relaxed">Join the IBM oil &amp; gas sales team in cutting research time by 50% and winning more deals with AI-powered intelligence.</p>
            <motion.button onClick={onEnter}
              className="px-10 py-4 rounded-xl text-sm font-bold flex items-center gap-2 mx-auto cursor-pointer text-[oklch(0.12_0.02_260)]"
              style={{ background: 'linear-gradient(135deg,oklch(0.68 0.18 254),oklch(0.62 0.22 270))' }}
              whileHover={{ scale: 1.05, boxShadow: '0 0 60px rgba(91,150,255,0.45)' }}
              whileTap={{ scale: 0.97 }}
            >
              Open IBM NEXUS Dashboard <ExternalLink className="h-4 w-4" />
            </motion.button>
          </div>
        </MouseFollowContainer>
      </FadeIn>
    </section>
  );
}

// ── FOOTER ─────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="relative z-10 border-t border-white/[0.05] py-10 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-white/22">
        <div className="font-mono">IBM NEXUS · Oil &amp; Gas Intelligence Assistant · Bobathon 2025</div>
        <div className="text-white/18">IBMAyush · rsrivatsan06 · nicperry-IBM · golamyasar67 · wynstonphan</div>
      </div>
    </footer>
  );
}

// ── ROOT ───────────────────────────────────────────────────
export default function LandingPage({ onEnter }) {
  return (
    <ReactLenis root options={{ lerp: 0.1, duration: 1.4, smoothWheel: true }}>
      {/* Global mouse follow spotlight (skiper61) */}
      <MouseFollowSpotlight color="rgba(91,150,255,0.07)" size={600} />

      {/* Draggable scroll progress widget (skiper89) */}
      <ScrollProgress />

      <div className="relative min-h-screen overflow-x-hidden" style={{ background: 'oklch(0.075 0.022 260)', color: 'white' }}>
        <NexusBackground />
        <Particles />
        <Nav onEnter={onEnter} />
        <Hero onEnter={onEnter} />
        <Ticker />
        <StatsBar />
        <AgentsSection />
        <FeaturesSection />
        <IntelligenceFeed />
        <RoadmapSection />
        <MetricsSection />
        <CTASection onEnter={onEnter} />
        <Footer />
      </div>
    </ReactLenis>
  );
}
