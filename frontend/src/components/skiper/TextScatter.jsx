// skiper31 — Text scatter / assemble on scroll
// Each character starts offset based on distance from centre, then converges as the section enters view.
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

function Char({ char, index, total, scrollYProgress, tag: Tag = 'span' }) {
  const isSpace = char === ' ';
  const center = Math.floor(total / 2);
  const dist = index - center;

  const x = useTransform(scrollYProgress, [0, 0.55], [dist * 40, 0]);
  const opacity = useTransform(scrollYProgress, [0, 0.4], [0, 1]);

  if (isSpace) return <span className="inline-block w-[0.3em]" />;

  return (
    <motion.span className="inline-block" style={{ x, opacity }}>
      {char}
    </motion.span>
  );
}

export function ScatterText({ children, className = '' }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 85%', 'start 30%'],
  });

  const chars = String(children).split('');

  return (
    <span ref={ref} className={`inline-flex flex-wrap justify-center ${className}`}>
      {chars.map((c, i) => (
        <Char key={i} char={c} index={i} total={chars.length} scrollYProgress={scrollYProgress} />
      ))}
    </span>
  );
}
