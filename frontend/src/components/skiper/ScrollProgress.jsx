// skiper89 — Scroll progress indicator (draggable widget)
import NumberFlow from '@number-flow/react';
import { motion, useMotionValueEvent, useScroll, useTransform } from 'framer-motion';
import { useState } from 'react';

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const [pct, setPct] = useState(0);

  const clamped = useTransform(scrollYProgress, (v) => Math.min(Math.max(v, 0), 1));
  const asPct = useTransform(clamped, (v) => Math.round(v * 100));
  useMotionValueEvent(asPct, 'change', setPct);

  const r = 18;
  const circ = 2 * Math.PI * r;
  const dash = useTransform(clamped, (v) => circ * v);
  const gap = useTransform(clamped, (v) => circ * (1 - v));

  return (
    <motion.div
      drag
      dragMomentum={false}
      className="fixed bottom-6 right-6 z-50 cursor-grab active:cursor-grabbing"
      whileHover={{ scale: 1.08 }}
    >
      <div className="relative flex items-center justify-center w-14 h-14">
        {/* Track */}
        <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 44 44">
          <circle cx="22" cy="22" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="2.5" />
          <motion.circle
            cx="22" cy="22" r={r}
            fill="none"
            stroke="rgba(91,150,255,0.85)"
            strokeWidth="2.5"
            strokeLinecap="round"
            style={{ pathLength: clamped }}
          />
        </svg>
        {/* Number */}
        <NumberFlow
          value={pct}
          className="text-[11px] font-mono font-semibold text-white/70 tabular-nums relative z-10"
          suffix="%"
        />
      </div>
    </motion.div>
  );
}
