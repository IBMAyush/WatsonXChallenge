// skiper28 — 3D perspective text that rises on scroll
import { motion, useMotionTemplate, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

export function Perspective3DText({ children, className = '' }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], [180, 0]);
  const transform = useMotionTemplate`rotateX(28deg) translateY(${y}px) translateZ(10px)`;

  return (
    <div
      ref={ref}
      style={{ perspective: '1200px', perspectiveOrigin: '50% 40%' }}
      className={className}
    >
      <motion.div style={{ transform }}>
        {children}
      </motion.div>
    </div>
  );
}
