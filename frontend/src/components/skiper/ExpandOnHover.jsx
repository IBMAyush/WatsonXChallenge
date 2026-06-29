// skiper52 — ExpandOnHover card (horizontal accordion)
// Cards sit side-by-side; hovering one expands it and shrinks neighbours.
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';

export function ExpandOnHoverCards({ items }) {
  const [hovered, setHovered] = useState(null);

  return (
    <div className="flex gap-3 w-full h-full" style={{ minHeight: 220 }}>
      {items.map((item, i) => {
        const isHovered = hovered === i;
        const isShrunken = hovered !== null && !isHovered;

        return (
          <motion.div
            key={i}
            className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.03] cursor-pointer flex-1"
            animate={{
              flex: isHovered ? 3 : isShrunken ? 0.6 : 1,
            }}
            transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            onHoverStart={() => setHovered(i)}
            onHoverEnd={() => setHovered(null)}
          >
            {/* Glow overlay */}
            <motion.div
              className="absolute inset-0 pointer-events-none"
              style={{ background: `radial-gradient(circle at 30% 50%, ${item.glowColor || 'rgba(79,142,255,0.15)'}, transparent 65%)` }}
              animate={{ opacity: isHovered ? 1 : 0 }}
              transition={{ duration: 0.3 }}
            />

            {/* Icon always visible */}
            <div className="absolute top-5 left-5 z-10">
              <div
                className="h-10 w-10 rounded-xl flex items-center justify-center border border-white/10"
                style={{ background: item.iconBg || 'rgba(79,142,255,0.1)' }}
              >
                {item.icon}
              </div>
            </div>

            {/* Content fades in on hover */}
            <AnimatePresence>
              {isHovered && (
                <motion.div
                  className="absolute inset-0 flex flex-col justify-end p-5 pt-16 z-10"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  transition={{ duration: 0.25 }}
                >
                  <div className="text-sm font-bold text-white mb-1.5">{item.title}</div>
                  <div className="text-xs text-white/50 leading-relaxed">{item.desc}</div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Collapsed label */}
            <AnimatePresence>
              {!isHovered && (
                <motion.div
                  className="absolute bottom-4 left-0 right-0 flex justify-center z-10"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <span
                    className="text-[10px] font-mono text-white/30 tracking-widest uppercase"
                    style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
                  >
                    {item.label || item.title}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Active border */}
            {isHovered && (
              <motion.div
                className="absolute inset-0 rounded-2xl pointer-events-none"
                style={{ border: `1px solid ${item.borderColor || 'rgba(91,150,255,0.3)'}` }}
                layoutId="expand-border"
                transition={{ duration: 0.3 }}
              />
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
