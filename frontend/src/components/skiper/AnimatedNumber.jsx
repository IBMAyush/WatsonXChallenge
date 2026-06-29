// skiper37 — Animated number with @number-flow/react + framer-motion
import NumberFlow from '@number-flow/react';
import { useInView } from 'react-intersection-observer';
import { useEffect, useState } from 'react';

export function AnimatedStat({ value, prefix = '', suffix = '', className = '' }) {
  const [displayed, setDisplayed] = useState(0);
  const { ref, inView } = useInView({ once: true, threshold: 0.3 });

  useEffect(() => {
    if (!inView) return;
    // small delay before animating so it's visible
    const id = setTimeout(() => setDisplayed(value), 200);
    return () => clearTimeout(id);
  }, [inView, value]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      <NumberFlow
        value={displayed}
        transformTiming={{ duration: 900, easing: 'ease-out' }}
      />
      {suffix}
    </span>
  );
}
