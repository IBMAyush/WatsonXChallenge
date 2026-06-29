import { useEffect, useState } from 'react';

export function Sparkline({ data, positive = true, height = 36, width = 120 }) {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const step = width / (data.length - 1);
  const points = data.map((v, i) => `${(i * step).toFixed(2)},${(height - ((v - min) / range) * height).toFixed(2)}`).join(" ");
  const last = data[data.length - 1];
  const lastX = (data.length - 1) * step;
  const lastY = height - ((last - min) / range) * height;
  const stroke = positive ? "var(--bullish)" : "var(--bearish)";
  const id = `g-${Math.random().toString(36).slice(2)}`;
  return (
    <svg width={width} height={height} className="overflow-visible">
      <defs>
        <linearGradient id={id} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={stroke} stopOpacity="0.35" />
          <stop offset="100%" stopColor={stroke} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polyline points={`0,${height} ${points} ${width},${height}`} fill={`url(#${id})`} stroke="none" />
      <polyline points={points} fill="none" stroke={stroke} strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />
      <circle cx={lastX} cy={lastY} r="2.5" fill={stroke} />
      <circle cx={lastX} cy={lastY} r="5" fill={stroke} opacity="0.25">
        <animate attributeName="r" values="3;7;3" dur="2s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.4;0;0.4" dur="2s" repeatCount="indefinite" />
      </circle>
    </svg>
  );
}

export function Ring({ value, size = 64, stroke = 6, color = "var(--primary)" }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (value / 100) * c;
  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle cx={size / 2} cy={size / 2} r={r} stroke="var(--border)" strokeWidth={stroke} fill="none" />
      <circle
        cx={size / 2} cy={size / 2} r={r}
        stroke={color} strokeWidth={stroke} fill="none"
        strokeDasharray={c} strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transition: "stroke-dashoffset 1s ease" }}
      />
    </svg>
  );
}

export function OrbBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-50 animate-grid-drift" />
      <div className="absolute -top-40 left-1/3 h-[600px] w-[600px] rounded-full opacity-30 blur-3xl animate-orb"
           style={{ background: "radial-gradient(circle, var(--primary), transparent 60%)" }} />
      <div className="absolute top-1/4 -right-32 h-[500px] w-[500px] rounded-full opacity-20 blur-3xl animate-orb"
           style={{ background: "radial-gradient(circle, var(--info), transparent 60%)", animationDelay: "-7s" }} />
    </div>
  );
}

export function LiveDot({ color = "var(--bullish)" }) {
  return (
    <span className="relative inline-flex h-2 w-2">
      <span className="absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping" style={{ background: color }} />
      <span className="relative inline-flex h-2 w-2 rounded-full" style={{ background: color }} />
    </span>
  );
}

export function ScanLine() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]">
      <div className="absolute left-0 right-0 h-px animate-scan" style={{ background: "linear-gradient(90deg, transparent, var(--primary), transparent)" }} />
    </div>
  );
}

export function useTicker(intervalMs = 1500) {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);
  return tick;
}

export function Counter({ value, decimals = 2, prefix = "", suffix = "" }) {
  const [v, setV] = useState(value);
  useEffect(() => {
    const start = v;
    const diff = value - start;
    const dur = 600;
    const t0 = performance.now();
    let raf = 0;
    const step = (t) => {
      const p = Math.min(1, (t - t0) / dur);
      setV(start + diff * (1 - Math.pow(1 - p, 3)));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);
  return <span className="font-mono tabular-nums">{prefix}{v.toFixed(decimals)}{suffix}</span>;
}
