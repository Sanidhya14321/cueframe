import type { MagnifierCaptionProps } from '@/schemas';
import type { LensPose } from './field';

type LensProps = MagnifierCaptionProps['lens'];

const arcPath = (radius: number, from: number, to: number): string => {
  const point = (degrees: number) => {
    const angle = (degrees * Math.PI) / 180;
    return `${radius * Math.cos(angle)} ${radius * Math.sin(angle)}`;
  };
  return `M ${point(from)} A ${radius} ${radius} 0 0 1 ${point(to)}`;
};

const Handle = ({ lens }: { lens: LensProps }) => {
  const half = lens.handleWidth / 2;
  const collarWidth = lens.handleWidth * 1.36;
  const collarHeight = lens.handleWidth * 0.62;
  const top = lens.radius + lens.rimWidth / 2 + lens.handleGap;
  return (
    <>
      <rect
        x={-half}
        y={top + collarHeight * 0.5}
        width={lens.handleWidth}
        height={lens.handleLength}
        rx={half}
        fill={lens.handle}
        stroke={lens.rim}
        strokeWidth={lens.rimWidth}
      />
      <rect
        x={-collarWidth / 2}
        y={top}
        width={collarWidth}
        height={collarHeight}
        rx={collarHeight * 0.32}
        fill={lens.rim}
      />
      <line
        x1={0}
        y1={top + collarHeight + lens.handleWidth * 0.5}
        x2={0}
        y2={top + collarHeight * 0.5 + lens.handleLength - lens.handleWidth * 0.55}
        stroke={lens.rim}
        strokeOpacity={0.28}
        strokeWidth={Math.max(1.5, lens.rimWidth * 0.32)}
        strokeLinecap="round"
      />
    </>
  );
};

export const MagnifierGlass = ({ pose, lens }: { pose: LensPose; lens: LensProps }) => {
  const glintRadius = lens.radius - lens.rimWidth * 2.4;
  const glintWidth = Math.max(2, lens.rimWidth * 0.75);
  return (
    <svg
      width={1080}
      height={1920}
      viewBox="0 0 1080 1920"
      aria-hidden="true"
      style={{ position: 'absolute', inset: 0, overflow: 'visible' }}
    >
      <g transform={`translate(${pose.x} ${pose.y}) rotate(${pose.angle})`}>
        {lens.handleLength > 0 ? <Handle lens={lens} /> : null}
        <circle r={lens.radius} fill="none" stroke={lens.rim} strokeWidth={lens.rimWidth} />
        <circle
          r={lens.radius - lens.rimWidth * 1.4}
          fill="none"
          stroke={lens.rim}
          strokeOpacity={0.32}
          strokeWidth={Math.max(1, lens.rimWidth * 0.2)}
        />
      </g>
      {lens.glint > 0 ? (
        <g
          transform={`translate(${pose.x} ${pose.y})`}
          fill="none"
          stroke="#ffffff"
          strokeLinecap="round"
          strokeWidth={glintWidth}
        >
          <path d={arcPath(glintRadius, 198, 246)} strokeOpacity={lens.glint} />
          <path d={arcPath(glintRadius, 254, 263)} strokeOpacity={lens.glint * 0.7} />
        </g>
      ) : null}
    </svg>
  );
};
