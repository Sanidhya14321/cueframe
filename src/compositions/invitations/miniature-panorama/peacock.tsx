import type { Ids } from './defs';
import { darken, lighten, type Paint } from './palette';
import { circle, fx } from './shapes';

export type TailPose = 'down' | 'along' | 'none';

const TAILS: Record<Exclude<TailPose, 'none'>, { body: string; barbs: string }> = {
  down: {
    body: 'M-20 -36C-56 24 -104 96 -156 206Q-148 230 -122 226C-78 128 -32 52 6 -12Z',
    barbs:
      'M-30 0L-44 6M-46 40L-60 46M-62 80L-76 86M-76 120L-90 128M-90 160L-104 168M-104 200L-118 208M-10 10L2 16M-26 50L-12 56M-42 90L-28 98M-56 130L-42 138M-70 170L-56 178M-84 210L-70 218',
  },
  along: {
    body: 'M-14 -40C-80 -50 -200 -40 -310 -12Q-318 0 -306 8C-200 -6 -80 -10 -20 -10Z',
    barbs:
      'M-60 -46L-66 -58M-110 -46L-116 -58M-160 -42L-166 -54M-210 -36L-216 -48M-260 -28L-266 -40M-60 -8L-66 4M-110 -6L-116 6M-160 -4L-166 8M-210 -2L-216 10M-260 2L-266 14',
  },
};

const BODY = 'M-44 -30C-36 -72 18 -76 36 -48C46 -32 30 -8 0 -6C-26 -6 -48 -14 -44 -30Z';

const WING = 'M-40 -32C-30 -62 6 -66 22 -46C8 -30 -20 -20 -40 -32Z';

export const Peacock = ({
  x,
  y,
  scale,
  tail,
  flip,
  frame,
  peacocks,
  ids,
}: {
  x: number;
  y: number;
  scale: number;
  tail: TailPose;
  flip: boolean;
  frame: number;
  peacocks: Paint['peacocks'];
  ids: Ids;
}) => {
  const nod = Math.sin(frame / 37 + x) * 3;
  const sway = Math.sin(frame / 53 + x * 0.1) * 1.2;
  const neck = peacocks.neck;
  const outline = darken(neck, 0.45);
  const shape = tail === 'none' ? null : TAILS[tail];
  return (
    <g transform={`translate(${fx(x)} ${fx(y)}) scale(${flip ? -scale : scale} ${scale})`}>
      {shape === null ? null : (
        <g transform={`rotate(${fx(sway)} -20 -30)`}>
          <path
            d={shape.body}
            fill={ids.url('eyes')}
            stroke={darken(peacocks.tail, 0.4)}
            strokeWidth={1.6}
          />
          <path d={shape.barbs} stroke={lighten(peacocks.tail, 0.35)} strokeWidth={1.4} />
        </g>
      )}
      <path d="M-6 -8L-9 0M6 -8L8 0" stroke={darken(peacocks.wing, 0.5)} strokeWidth={2.2} />
      <path d={BODY} fill={neck} stroke={outline} strokeWidth={1.4} />
      <path
        d={WING}
        fill={ids.url('speckle')}
        stroke={darken(peacocks.wing, 0.4)}
        strokeWidth={1.2}
      />
      <path
        d="M-36 -34Q-14 -26 14 -40"
        fill="none"
        stroke={lighten(peacocks.wing, 0.35)}
        strokeWidth={1.4}
      />
      <g transform={`rotate(${fx(nod)} 26 -48)`}>
        <path
          d="M18 -50C30 -70 26 -86 34 -100L46 -98C40 -84 44 -66 34 -46Z"
          fill={neck}
          stroke={outline}
          strokeWidth={1.3}
        />
        <path
          d="M28 -60C32 -74 32 -86 38 -96"
          fill="none"
          stroke={lighten(neck, 0.4)}
          strokeWidth={2}
        />
        <path d={circle(41, -101, 7.5)} fill={neck} stroke={outline} strokeWidth={1.2} />
        <path d="M37 -103L46 -101" stroke="#ffffff" strokeWidth={2} />
        <path d={circle(42, -103, 1.6)} fill={outline} />
        <path d="M47 -102L55 -99L47 -97Z" fill={darken(peacocks.wing, 0.3)} />
        <path
          d="M40 -108L36 -122M42 -108L42 -124M44 -108L48 -122"
          stroke={outline}
          strokeWidth={1.1}
        />
        <path
          d={circle(36, -123, 2.2) + circle(42, -125, 2.2) + circle(48, -123, 2.2)}
          fill={neck}
        />
      </g>
    </g>
  );
};
