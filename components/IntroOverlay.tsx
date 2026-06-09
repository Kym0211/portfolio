/**
 * One-time page-load intro: a full-screen branded panel where the monogram
 * strokes itself in (rounded frame → K spine → K arms), the wordmark fades in,
 * then the whole panel wipes upward to reveal the site. Pure CSS (runs once on
 * initial paint) and skipped under prefers-reduced-motion.
 */
export default function IntroOverlay() {
  return (
    <div className="intro" aria-hidden="true">
      <div className="intro-brand">
        <svg className="intro-mark" viewBox="0 0 48 48" fill="none">
          <defs>
            <linearGradient id="introMark" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#22d3ee" />
              <stop offset="0.55" stopColor="#6366f1" />
              <stop offset="1" stopColor="#c084fc" />
            </linearGradient>
          </defs>
          <path
            className="mark-frame"
            pathLength={1}
            stroke="url(#introMark)"
            d="M15 3 H33 A12 12 0 0 1 45 15 V33 A12 12 0 0 1 33 45 H15 A12 12 0 0 1 3 33 V15 A12 12 0 0 1 15 3 Z"
          />
          <path
            className="mark-k mark-k1"
            pathLength={1}
            stroke="url(#introMark)"
            d="M18 13 V35"
          />
          <path
            className="mark-k mark-k2"
            pathLength={1}
            stroke="url(#introMark)"
            d="M32 13 L18 24 L33 35"
          />
        </svg>
        <span className="intro-word">Kavyam</span>
      </div>
      <span className="intro-line">
        <i />
      </span>
    </div>
  );
}
