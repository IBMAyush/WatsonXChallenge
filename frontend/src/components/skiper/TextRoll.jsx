// skiper58 — Text Roll Navigation effect
// On hover each nav link rolls its text vertically revealing a duplicate beneath.
import { motion } from 'framer-motion';

export function TextRoll({ children, className = '', center = false }) {
  const text = typeof children === 'string' ? children : String(children);

  return (
    <span
      className={`relative inline-flex overflow-hidden ${center ? 'justify-center' : ''} ${className}`}
      style={{ height: '1.1em' }}
    >
      {/* Original row */}
      <motion.span
        className="flex"
        whileHover="hover"
        initial="rest"
      >
        <motion.span
          className="flex"
          variants={{
            rest: { y: 0 },
            hover: { y: '-100%' },
          }}
          transition={{ duration: 0.28, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          {text}
        </motion.span>
        {/* Duplicate that rolls up from below */}
        <motion.span
          className="absolute inset-0 flex"
          variants={{
            rest: { y: '100%' },
            hover: { y: 0 },
          }}
          transition={{ duration: 0.28, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          {text}
        </motion.span>
      </motion.span>
    </span>
  );
}

// Standalone nav link wrapper with TextRoll built in
export function RollLink({ href, children, className = '' }) {
  return (
    <a href={href} className={`relative inline-flex overflow-hidden group ${className}`}>
      <motion.span
        className="flex flex-col"
        whileHover="hover"
        initial="rest"
      >
        <motion.span
          variants={{
            rest: { y: 0 },
            hover: { y: '-100%' },
          }}
          transition={{ duration: 0.26, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          {children}
        </motion.span>
        <motion.span
          className="absolute"
          variants={{
            rest: { y: '100%' },
            hover: { y: 0 },
          }}
          transition={{ duration: 0.26, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          {children}
        </motion.span>
      </motion.span>
    </a>
  );
}
