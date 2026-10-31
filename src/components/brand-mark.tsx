export const BrandMark = ({ className, size }: { className?: string; size?: number }) => (
  <svg viewBox="0 0 64 64" className={className} width={size} height={size} aria-hidden>
    <defs>
      <linearGradient id="brand-mark" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
        <stop offset="0" stopColor="#8b5cf6" />
        <stop offset="1" stopColor="#ec4899" />
      </linearGradient>
    </defs>
    <rect width="64" height="64" rx="16" fill="url(#brand-mark)" />
    <rect
      x="12"
      y="17"
      width="34"
      height="26"
      rx="6"
      fill="none"
      stroke="#fff"
      strokeOpacity="0.45"
      strokeWidth="3.5"
    />
    <rect x="19" y="23" width="34" height="26" rx="6" fill="#fff" />
    <path d="M32 29.5v13l11-6.5z" fill="#c026d3" />
  </svg>
);
