import { ImageResponse } from 'next/og';

export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

const AppleIcon = () =>
  new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
      }}
    >
      <svg width="132" height="132" viewBox="0 0 64 64" aria-hidden>
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
    </div>,
    size,
  );

export default AppleIcon;
