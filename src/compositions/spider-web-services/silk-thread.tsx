import { useId } from 'react';
import type { SpiderWebServicesProps } from '@/schemas';

const SCREEN_HEIGHT = 1920;

const OVERSCAN = 160;

export const SilkThread = ({
  thread,
  top,
  bottom,
}: {
  thread: SpiderWebServicesProps['thread'];
  top: number;
  bottom: number;
}) => {
  const id = useId().replaceAll(':', '');
  const visibleTop = Math.max(top, -OVERSCAN);
  const visibleBottom = Math.min(bottom, SCREEN_HEIGHT + OVERSCAN);
  if (visibleBottom <= visibleTop) {
    return null;
  }
  const width = thread.width;
  const period = thread.twist;
  const height = visibleBottom - visibleTop;
  const shift = ((-visibleTop % period) + period) % period;
  const band = (offset: number) =>
    `0,${offset} ${width},${offset + period * 0.7} ${width},${offset + period * 1.15} 0,${offset + period * 0.45}`;
  return (
    <svg
      width={width + 8}
      height={height}
      viewBox={`-4 0 ${width + 8} ${height}`}
      style={{ position: 'absolute', left: thread.x - width / 2 - 4, top: visibleTop }}
      aria-hidden="true"
    >
      <defs>
        <pattern
          id={`${id}-twist`}
          width={width}
          height={period}
          patternUnits="userSpaceOnUse"
          patternTransform={`translate(0 ${shift})`}
        >
          <rect width={width} height={period} fill={thread.shade} />
          {[-2, -1, 0, 1].map((step) => (
            <polygon key={step} points={band(step * period)} fill={thread.color} />
          ))}
        </pattern>
        <linearGradient id={`${id}-round`} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#000000" stopOpacity="0.45" />
          <stop offset="0.28" stopColor="#000000" stopOpacity="0" />
          <stop offset="0.42" stopColor="#ffffff" stopOpacity="0.35" />
          <stop offset="0.62" stopColor="#ffffff" stopOpacity="0" />
          <stop offset="1" stopColor="#000000" stopOpacity="0.55" />
        </linearGradient>
      </defs>
      <rect x={0} y={0} width={width} height={height} rx={width / 2} fill={`url(#${id}-twist)`} />
      <rect x={0} y={0} width={width} height={height} rx={width / 2} fill={`url(#${id}-round)`} />
    </svg>
  );
};
