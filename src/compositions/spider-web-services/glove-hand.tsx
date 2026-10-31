import { useId } from 'react';
import type { SpiderWebServicesProps } from '@/schemas';

type Finger = { x: number; y: number; width: number; length: number; angle: number };

const EXTENDED: Finger[] = [
  { x: -116, y: 250, width: 64, length: 320, angle: 8 },
  { x: 116, y: 240, width: 54, length: 250, angle: -11 },
];

const CURLED: Finger[] = [
  { x: -46, y: 282, width: 70, length: 92, angle: 3 },
  { x: 40, y: 282, width: 68, length: 86, angle: -3 },
];

const PALM =
  'M -112 -40 L 112 -40 L 118 120 C 150 170 168 230 160 300 C 120 330 -120 330 -162 300 C -168 230 -150 170 -118 120 Z';

const THUMB =
  'M -128 120 C -170 150 -214 210 -236 280 C -244 304 -216 318 -204 298 C -178 250 -150 214 -112 196 Z';

export const GloveHand = ({
  intro,
  x,
  y,
  sway,
  bob,
}: {
  intro: SpiderWebServicesProps['intro'];
  x: number;
  y: number;
  sway: number;
  bob: number;
}) => {
  const id = useId().replaceAll(':', '');
  const fill = `url(#${id}-leather)`;
  return (
    <svg
      width={600}
      height={900}
      viewBox="-300 -300 600 900"
      style={{
        position: 'absolute',
        left: x - 300,
        top: y - 300,
        transform: `scale(${intro.handScale})`,
        transformOrigin: '300px 300px',
      }}
      aria-hidden="true"
    >
      <defs>
        <radialGradient id={`${id}-leather`} cx="0.42" cy="0.3" r="0.75">
          <stop offset="0" stopColor={intro.glove} />
          <stop offset="0.7" stopColor={intro.glove} />
          <stop offset="1" stopColor={intro.gloveShade} />
        </radialGradient>
        <linearGradient id={`${id}-finger`} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor={intro.gloveShade} />
          <stop offset="0.35" stopColor={intro.glove} />
          <stop offset="0.6" stopColor={intro.glove} />
          <stop offset="1" stopColor={intro.gloveShade} />
        </linearGradient>
        <linearGradient id={`${id}-curl`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor={intro.glove} stopOpacity="0" />
          <stop offset="0.3" stopColor={intro.glove} />
          <stop offset="0.75" stopColor={intro.glove} />
          <stop offset="1" stopColor={intro.gloveShade} />
        </linearGradient>
        <linearGradient id={`${id}-cuff`} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor={intro.gloveShade} />
          <stop offset="0.45" stopColor={intro.cuff} />
          <stop offset="1" stopColor={intro.gloveShade} />
        </linearGradient>
        <filter id={`${id}-shadow`} x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="14" stdDeviation="14" floodColor="#06010f" floodOpacity="0.6" />
        </filter>
      </defs>
      <g filter={`url(#${id}-shadow)`} transform={`translate(0 ${bob}) rotate(${sway} 0 -200)`}>
        <path d={THUMB} fill={fill} />
        {EXTENDED.map((finger) => (
          <g
            key={finger.x}
            transform={`translate(${finger.x} ${finger.y}) rotate(${finger.angle})`}
          >
            <rect
              x={-finger.width / 2}
              y={-60}
              width={finger.width}
              height={finger.length + 60}
              rx={finger.width / 2}
              fill={`url(#${id}-finger)`}
            />
            {[0.38, 0.7].map((joint) => (
              <path
                key={joint}
                d={`M ${-finger.width * 0.4} ${finger.length * joint} Q 0 ${finger.length * joint + 9} ${finger.width * 0.4} ${finger.length * joint}`}
                fill="none"
                stroke={intro.gloveShade}
                strokeWidth={3}
                strokeOpacity={0.55}
              />
            ))}
            <path
              d={`M ${finger.width * 0.12} 20 L ${finger.width * 0.12} ${finger.length - finger.width * 0.6}`}
              stroke={intro.gloveSeam}
              strokeWidth={2}
              strokeDasharray="6 7"
              strokeOpacity={0.45}
            />
          </g>
        ))}
        <path d={PALM} fill={fill} />
        {CURLED.map((finger) => (
          <g
            key={finger.x}
            transform={`translate(${finger.x} ${finger.y}) rotate(${finger.angle})`}
          >
            <rect
              x={-finger.width / 2}
              y={-30}
              width={finger.width}
              height={finger.length + 30}
              rx={finger.width / 2}
              fill={`url(#${id}-curl)`}
            />
            <path
              d={`M ${-finger.width * 0.36} ${finger.length * 0.42} Q 0 ${finger.length * 0.42 + 10} ${finger.width * 0.36} ${finger.length * 0.42}`}
              fill="none"
              stroke={intro.gloveShade}
              strokeWidth={3}
              strokeOpacity={0.6}
            />
          </g>
        ))}
        <path
          d="M -150 262 Q 0 300 150 262"
          fill="none"
          stroke={intro.gloveSeam}
          strokeWidth={2}
          strokeDasharray="6 7"
          strokeOpacity={0.5}
        />
        <rect x={-122} y={-300} width={244} height={330} rx={26} fill={`url(#${id}-cuff)`} />
        {[-240, -190, -140, -90, -40].map((rib) => (
          <path
            key={rib}
            d={`M -116 ${rib} L 116 ${rib}`}
            stroke={intro.gloveSeam}
            strokeOpacity={0.22}
            strokeWidth={3}
          />
        ))}
        <rect x={-126} y={10} width={252} height={30} rx={12} fill={intro.gloveShade} />
      </g>
    </svg>
  );
};
