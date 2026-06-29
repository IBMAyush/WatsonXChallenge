// skiper41 — Progressive Blur
// Pure CSS, no dependencies. Adds a frosted-glass fade at top or bottom of a scroll container.

export function ProgressiveBlur({
  className = '',
  backgroundColor = 'oklch(0.08 0.025 260)',
  position = 'bottom',
  height = '120px',
  blurAmount = '6px',
}) {
  const isTop = position === 'top';
  return (
    <div
      className={`pointer-events-none absolute left-0 w-full select-none z-10 ${className}`}
      style={{
        [isTop ? 'top' : 'bottom']: 0,
        height,
        background: isTop
          ? `linear-gradient(to top, transparent, ${backgroundColor})`
          : `linear-gradient(to bottom, transparent, ${backgroundColor})`,
        maskImage: isTop
          ? `linear-gradient(to bottom, ${backgroundColor} 50%, transparent)`
          : `linear-gradient(to top, ${backgroundColor} 50%, transparent)`,
        WebkitBackdropFilter: `blur(${blurAmount})`,
        backdropFilter: `blur(${blurAmount})`,
      }}
    />
  );
}
