import type { WebMotionProps } from '@/schemas/clips/imported/common';

const seeded = (index: number) => {
  const value = Math.sin(index * 127.1 + 311.7) * 43758.5453;
  return value - Math.floor(value);
};
export const MotionSurface = ({
  variant,
  frame,
  props,
  width,
  height,
}: {
  variant: number;
  frame: number;
  props: WebMotionProps;
  width: number;
  height: number;
}) => {
  const count = Math.round(props.amount);
  const color = props.primary;
  if (variant === 12) {
    return (
      <>
        {Array.from({ length: 8 }, (_, index) => {
          const size = 210 + index * 140 + Math.sin(frame / 18 - index * 0.4) * 35;
          return (
            <div
              key={index}
              style={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                width: size,
                height: size,
                borderRadius: '50%',
                border: `2px solid ${color}`,
                opacity: 0.32 - index * 0.03,
                transform: 'translate(-50%,-50%)',
              }}
            />
          );
        })}
      </>
    );
  }
  if (variant === 13) {
    return (
      <svg
        width="100%"
        height="100%"
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label="Animated dot field"
      >
        {Array.from({ length: count * 10 }, (_, index) => {
          const columns = 20;
          const x = (((index % columns) + 0.5) / columns) * width;
          const y = ((Math.floor(index / columns) + 0.5) / Math.ceil(count / 2)) * height;
          return (
            <circle
              key={index}
              cx={x}
              cy={y}
              r={3 + Math.sin(index / 7 + frame / 12) * 1.5}
              fill={color}
              opacity={0.15 + (Math.sin(index / 7 + frame / 12) + 1) * 0.14}
            />
          );
        })}
      </svg>
    );
  }
  if (variant === 14) {
    return (
      <svg width="100%" height="100%" role="img" aria-label="Drifting grid">
        <defs>
          <pattern
            id="motion-grid"
            width="80"
            height="80"
            patternUnits="userSpaceOnUse"
            patternTransform={`translate(${frame % 80} ${frame % 80})`}
          >
            <path d="M 80 0 L 0 0 0 80" fill="none" stroke={color} strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#motion-grid)" opacity="0.25" />
      </svg>
    );
  }
  if (variant === 15) {
    return (
      <>
        {Array.from({ length: count }, (_, index) => (
          <div
            key={index}
            style={{
              position: 'absolute',
              width: 220,
              height: 2,
              left: `${((seeded(index) * 130 - frame * 0.55 + 200) % 130) - 15}%`,
              top: `${((seeded(index + 90) * 140 + frame * 0.6) % 140) - 20}%`,
              background: `linear-gradient(90deg,transparent,${color})`,
              transform: 'rotate(35deg)',
              opacity: 0.5,
            }}
          />
        ))}
      </>
    );
  }
  if (variant === 16) {
    return (
      <>
        {[0, 1, 2].map((ring) => (
          <div
            key={ring}
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              width: 470 + ring * 180,
              height: 470 + ring * 180,
              border: `1px solid ${color}44`,
              borderRadius: '50%',
              transform: 'translate(-50%,-50%)',
            }}
          />
        ))}
        {Array.from({ length: Math.min(count, 12) }, (_, index) => {
          const radius = 235 + (index % 3) * 90;
          const angle =
            (frame / 90) * (index % 2 ? -1 : 1) + (index / Math.min(count, 12)) * Math.PI * 2;
          return (
            <div
              key={index}
              style={{
                position: 'absolute',
                left: width / 2 + Math.cos(angle) * radius - 22,
                top: height / 2 + Math.sin(angle) * radius - 22,
                width: 44,
                height: 44,
                borderRadius: index % 2 ? 12 : '50%',
                background: index % 3 === 0 ? props.textColor : color,
                transform: `rotate(${frame + index * 20}deg)`,
              }}
            />
          );
        })}
      </>
    );
  }
  if (variant === 22) {
    return (
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 1920 1080"
        preserveAspectRatio="none"
        role="img"
        aria-label="Flowing aurora ribbons"
      >
        <defs>
          <linearGradient id="aurora-fill">
            <stop offset="0" stopColor={color} stopOpacity="0.05" />
            <stop offset="0.5" stopColor={color} stopOpacity="0.55" />
            <stop offset="1" stopColor={props.textColor} stopOpacity="0.03" />
          </linearGradient>
        </defs>
        {[0, 1, 2, 3, 4].map((index) => (
          <path
            key={index}
            d={`M -200 ${650 + index * 60} C 300 ${180 + Math.sin(frame / 25 + index) * 140}, 1000 ${900 - index * 140}, 2100 ${280 + index * 75}`}
            stroke="url(#aurora-fill)"
            strokeWidth="100"
            fill="none"
            opacity="0.55"
          />
        ))}
      </svg>
    );
  }
  if (variant === 23) {
    return (
      <svg
        width="100%"
        height="100%"
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label="Seeded particle vortex"
      >
        {Array.from({ length: count * 6 }, (_, index) => {
          const radius = 140 + seeded(index) * Math.min(width, height) * 0.5;
          const angle = index * 2.4 + frame / (70 + (index % 70));
          return (
            <circle
              key={index}
              cx={width / 2 + Math.cos(angle) * radius}
              cy={height / 2 + Math.sin(angle) * radius}
              r={1 + seeded(index + 100) * 4}
              fill={index % 4 ? color : props.textColor}
              opacity={0.2 + seeded(index + 7) * 0.6}
            />
          );
        })}
      </svg>
    );
  }
  if (variant === 24) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          width: '100%',
          height: '100%',
          opacity: 0.45,
        }}
      >
        {Array.from({ length: count }, (_, index) => (
          <div
            key={index}
            style={{
              flex: 1,
              height: `${30 + (Math.sin(index * 0.7 + frame / 15) + 1) * 28}%`,
              background: `linear-gradient(${index % 2 ? 0 : 180}deg,${color},${props.surface})`,
              borderRadius: 8,
            }}
          />
        ))}
      </div>
    );
  }
  return null;
};
