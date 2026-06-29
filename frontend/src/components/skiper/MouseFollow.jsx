// skiper61 — Mouse follow cursor spotlight
import { motion, useMotionValue, useSpring } from 'framer-motion';

const SPRING = { mass: 0.08, damping: 10, stiffness: 140 };

export function MouseFollowSpotlight({ color = 'rgba(79,142,255,0.12)', size = 500 }) {
  const rawX = useMotionValue(-9999);
  const rawY = useMotionValue(-9999);
  const x = useSpring(rawX, SPRING);
  const y = useSpring(rawY, SPRING);
  const opacity = useMotionValue(0);

  const handlePointerMove = (e) => {
    rawX.set(e.clientX);
    rawY.set(e.clientY);
  };

  return (
    <div
      className="fixed inset-0 pointer-events-none z-[1]"
      onPointerMove={handlePointerMove}
      onPointerEnter={() => opacity.set(1)}
      onPointerLeave={() => opacity.set(0)}
      style={{ pointerEvents: 'none' }}
    >
      <motion.div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: size,
          height: size,
          x: useSpring(rawX, SPRING),
          y: useSpring(rawY, SPRING),
          translateX: '-50%',
          translateY: '-50%',
          background: `radial-gradient(circle, ${color}, transparent 70%)`,
          opacity,
        }}
      />
    </div>
  );
}

// Lightweight version that attaches to a specific container
export function MouseFollowContainer({ children, color = 'rgba(79,142,255,0.1)', size = 400, className = '' }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const opacity = useMotionValue(0);
  const sx = useSpring(x, SPRING);
  const sy = useSpring(y, SPRING);

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      onPointerMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        x.set(e.clientX - rect.left);
        y.set(e.clientY - rect.top);
      }}
      onPointerEnter={() => opacity.set(1)}
      onPointerLeave={() => opacity.set(0)}
    >
      <motion.div
        className="absolute pointer-events-none rounded-full"
        style={{
          width: size,
          height: size,
          x: sx,
          y: sy,
          translateX: '-50%',
          translateY: '-50%',
          background: `radial-gradient(circle, ${color}, transparent 65%)`,
          opacity,
        }}
      />
      {children}
    </div>
  );
}
