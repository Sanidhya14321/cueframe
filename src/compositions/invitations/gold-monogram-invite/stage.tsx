import type { GoldMonogramInviteProps } from '@/schemas';
import { land, settle, smooth, tween } from '../../promo/timing';
import { type Gold, GoldGradients, paint, useGoldIds, useSvgId, withAlpha } from './gold';
import { MonogramLetters, Plaque } from './monogram';
import { Bursts, Dust, Sparklers } from './sparks';
import { fadeOut, progress, STAGE } from './timeline';
import { Veil } from './veil';

const FLOOR = 868;
const TIERS: [number, number, number][] = [
  [868, 360, 64],
  [804, 292, 52],
  [752, 228, 44],
];

const Pedestal = ({ gold, rim, night }: { gold: Gold; rim: string; night: string }) => {
  const sideId = useSvgId('pedestal-side');
  return (
    <g>
      <defs>
        <linearGradient id={sideId} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor={night} />
          <stop offset="0.3" stopColor={withAlpha(gold.deep, 0.35)} />
          <stop offset="0.45" stopColor={withAlpha(gold.mid, 0.28)} />
          <stop offset="0.7" stopColor={night} />
          <stop offset="1" stopColor={night} />
        </linearGradient>
      </defs>
      {TIERS.map(([base, rx, height]) => {
        const ry = rx * 0.13;
        const top = base - height;
        return (
          <g key={base}>
            <path
              d={`M ${960 - rx} ${top} L ${960 - rx} ${base} A ${rx} ${ry} 0 0 0 ${960 + rx} ${base} L ${960 + rx} ${top} Z`}
              fill={night}
            />
            <path
              d={`M ${960 - rx} ${top} L ${960 - rx} ${base} A ${rx} ${ry} 0 0 0 ${960 + rx} ${base} L ${960 + rx} ${top} Z`}
              fill={`url(#${sideId})`}
            />
            <ellipse cx={960} cy={top} rx={rx} ry={ry} fill={night} />
            <path
              d={`M ${960 - rx} ${top} A ${rx} ${ry} 0 0 0 ${960 + rx} ${top}`}
              fill="none"
              stroke={rim}
              strokeWidth={4}
            />
            <path
              d={`M ${960 - rx} ${base - 6} A ${rx} ${ry} 0 0 0 ${960 + rx} ${base - 6}`}
              fill="none"
              stroke={withAlpha(gold.mid, 0.5)}
              strokeWidth={1.6}
            />
          </g>
        );
      })}
    </g>
  );
};

export const StageAct = ({
  frame,
  monogram,
  stage,
  gold,
  background,
  serif,
}: Pick<GoldMonogramInviteProps, 'monogram' | 'stage' | 'gold' | 'background'> & {
  frame: number;
  serif: string;
}) => {
  const ids = useGoldIds('stage-gold');
  const reflectId = useSvgId('stage-reflect');
  const maskId = useSvgId('stage-mask');
  const glowId = useSvgId('stage-glow');
  const contentId = useSvgId('stage-content');
  const presence = Math.min(tween(frame, STAGE.enter, [0, 1], smooth), fadeOut(frame, STAGE.exit));
  if (presence <= 0) {
    return null;
  }
  const scale = land(frame, STAGE.push, [0.44, 1], 0.0012);
  const push = (scale - 0.44) / 0.56;
  const focusY = 640 - 120 * push;
  const lift = stage.veil ? progress(frame, STAGE.lift, (t) => t * t) : 1;
  const reveal = stage.veil
    ? tween(frame, [STAGE.lift[0] + 20, STAGE.lift[0] + 90], [0, 1], smooth)
    : 1;
  const plaque = tween(frame, [STAGE.plaque, STAGE.plaque + 36], [0, 1], settle);
  const glint = tween(frame, STAGE.glint, [-0.25, 1.25], smooth);
  const center: [number, number] = [960, 470];
  const ring = monogram.size * 0.86;
  return (
    <svg
      width={1920}
      height={1080}
      viewBox="0 0 1920 1080"
      role="presentation"
      style={{ position: 'absolute' }}
    >
      <g opacity={presence}>
        <defs>
          <GoldGradients ids={ids} gold={gold} sheen={[500, 300, 1420, 900]} glint={glint} />
          <linearGradient
            id={reflectId}
            gradientUnits="userSpaceOnUse"
            x1={0}
            y1={FLOOR}
            x2={0}
            y2={FLOOR + 420}
          >
            <stop offset="0" stopColor="#ffffff" stopOpacity={stage.reflection} />
            <stop offset="0.4" stopColor="#ffffff" stopOpacity={stage.reflection * 0.35} />
            <stop offset="1" stopColor="#ffffff" stopOpacity={0} />
          </linearGradient>
          <mask
            id={maskId}
            maskUnits="userSpaceOnUse"
            x={-2000}
            y={FLOOR}
            width={6000}
            height={2000}
          >
            <rect x={-2000} y={FLOOR} width={6000} height={2000} fill={`url(#${reflectId})`} />
          </mask>
          <filter id={glowId} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation={60} />
          </filter>
        </defs>
        {background.show ? <rect width={1920} height={1080} fill={background.night} /> : null}
        <g
          transform={`translate(960 600) scale(${scale.toFixed(5)}) translate(-960 ${-focusY.toFixed(3)})`}
        >
          <ellipse
            cx={960}
            cy={FLOOR + 10}
            rx={900}
            ry={120}
            fill={withAlpha(gold.mid, 0.16)}
            filter={`url(#${glowId})`}
          />
          <ellipse
            cx={960}
            cy={500}
            rx={520}
            ry={420}
            fill={withAlpha(gold.deep, 0.22 * reveal)}
            filter={`url(#${glowId})`}
          />
          <g id={contentId}>
            <Pedestal gold={gold} rim={paint(ids.sheen)} night={background.night} />
            <g opacity={reveal}>
              <circle
                cx={center[0]}
                cy={center[1]}
                r={ring}
                fill="none"
                stroke={withAlpha(gold.light, 0.28)}
                strokeWidth={2}
              />
              <path
                d={`M ${center[0] - ring * 0.94} ${center[1] - ring * 0.34} A ${ring} ${ring} 0 0 1 ${center[0] + ring * 0.5} ${center[1] - ring * 0.866}`}
                fill="none"
                stroke={withAlpha(gold.highlight, 0.7)}
                strokeWidth={3}
                strokeLinecap="round"
              />
              <MonogramLetters
                monogram={monogram}
                gold={gold}
                ids={ids}
                serif={serif}
                center={center}
                glint={monogram.glint && glint > -0.2 && glint < 1.2}
                heart={
                  stage.veil
                    ? tween(frame, [STAGE.lift[0] + 80, STAGE.lift[0] + 116], [0, 1], smooth)
                    : 1
                }
              />
            </g>
            <Plaque
              monogram={monogram}
              gold={gold}
              ids={ids}
              serif={serif}
              y={792}
              opacity={plaque}
              backing={background.night}
            />
            {stage.veil ? <Veil frame={frame} lift={lift} gold={gold} /> : null}
          </g>
          {stage.reflection > 0 ? (
            <g mask={`url(#${maskId})`}>
              <use href={`#${contentId}`} transform={`translate(0 ${FLOOR * 2}) scale(1 -1)`} />
            </g>
          ) : null}
          <Sparklers frame={frame} from={STAGE.sparklersFrom} count={stage.sparklers} gold={gold} />
        </g>
        <Bursts frame={frame} from={STAGE.burstsFrom} count={stage.bursts} gold={gold} />
        <Dust frame={frame} count={stage.dust} color={gold.light} seed="stage-dust" />
      </g>
    </svg>
  );
};
