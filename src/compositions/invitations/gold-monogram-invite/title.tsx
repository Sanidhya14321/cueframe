import type { GoldMonogramInviteProps } from '@/schemas';
import { settle, smooth, tween } from '../../promo/timing';
import { DamaskFill } from './damask';
import { Embossed, GoldGradients, paint, useGoldIds, useSvgId, withAlpha } from './gold';
import { Dust } from './sparks';
import { BlurFilter, RevealText } from './text-fx';
import { fadeOut, TITLE } from './timeline';

const SWASH =
  'M -250 78 C -360 92 -452 34 -428 -38 C -404 -110 -302 -96 -316 -30 C -330 34 -420 70 -470 118 C -522 168 -420 214 -296 182 C -150 144 96 138 252 166 C 372 188 478 160 486 92 C 494 30 424 2 384 40 C 350 74 398 116 452 104';

const CURL =
  'M 318 -18 C 410 -130 534 -112 536 -40 C 538 14 470 26 446 -8 C 428 -34 452 -66 486 -58';

const EdgeShade = ({ color, reach }: { color: string; reach: number }) => {
  const sideId = useSvgId('shade-side');
  const topId = useSvgId('shade-top');
  const stops = [0, 0.1, 0.24, 0.42, 0.62, 0.82, 1];
  const ramp = (mirror: boolean) =>
    stops.map((share) => (
      <stop
        key={share}
        offset={mirror ? 1 - share * reach : share * reach}
        stopColor={color}
        stopOpacity={((1 - share) ** 2 * 0.9).toFixed(3)}
      />
    ));
  return (
    <>
      <defs>
        <linearGradient id={sideId} x1="0" y1="0" x2="1" y2="0">
          {ramp(false)}
          {ramp(true).reverse()}
        </linearGradient>
        <linearGradient id={topId} x1="0" y1="0" x2="0" y2="1">
          {ramp(false)}
          {ramp(true).reverse()}
        </linearGradient>
      </defs>
      <rect width={1920} height={1080} fill={`url(#${sideId})`} />
      <rect width={1920} height={1080} fill={`url(#${topId})`} />
    </>
  );
};

export const TitleAct = ({
  frame,
  title,
  gold,
  text,
  background,
  serif,
  script,
}: Pick<GoldMonogramInviteProps, 'title' | 'gold' | 'text' | 'background'> & {
  frame: number;
  serif: string;
  script: string;
}) => {
  const ids = useGoldIds('title-gold');
  const blurId = useSvgId('title-blur');
  const softId = useSvgId('title-soft');
  const backdrop = Math.min(
    tween(frame, TITLE.backdrop, [0, 1], smooth),
    fadeOut(frame, TITLE.exit),
  );
  const enter = tween(frame, TITLE.enter, [0, 1], settle);
  const presence = Math.min(
    tween(frame, [TITLE.enter[0], TITLE.enter[0] + 40], [0, 1], smooth),
    fadeOut(frame, TITLE.exit),
  );
  if (backdrop <= 0 && presence <= 0) {
    return null;
  }
  const scale = 1.42 - 0.42 * enter;
  const haze = Math.max(
    tween(frame, [TITLE.enter[0], TITLE.enter[1] + 8], [1, 0], smooth),
    tween(frame, TITLE.exit, [0, 1], smooth),
  );
  const draw = tween(frame, TITLE.flourish, [0, 1], (t) => smooth(t) * 0.5 + t * 0.5);
  const glint = tween(frame, [TITLE.eyebrow + 20, TITLE.eyebrow + 80], [-0.2, 1.2], smooth);
  const size = title.size;
  const s = size / 190;
  const word = (fill: string) => (
    <text
      x={0}
      y={size * 0.18}
      textAnchor="middle"
      style={{ fontFamily: script, fontSize: size, textRendering: 'geometricPrecision' }}
      fill={fill}
    >
      {title.word}
    </text>
  );
  const swash = (stroke: string, width: number) =>
    title.flourish ? (
      <g transform={`scale(${s.toFixed(4)})`} fill="none" stroke={stroke} strokeLinecap="round">
        {[SWASH, CURL].map((d) => (
          <path
            key={d.slice(0, 12)}
            d={d}
            strokeWidth={width}
            pathLength={1}
            strokeDasharray={draw >= 1 ? undefined : `${Math.max(0.0001, draw).toFixed(4)} 2`}
          />
        ))}
      </g>
    ) : null;
  const small = {
    fontFamily: serif,
    fontSize: size * 0.19,
    letterSpacing: '0.12em',
    fontWeight: 600,
    uppercase: true,
  };
  return (
    <svg
      width={1920}
      height={1080}
      viewBox="0 0 1920 1080"
      role="presentation"
      style={{ position: 'absolute' }}
    >
      <defs>
        <GoldGradients ids={ids} gold={gold} sheen={[-500, -200, 500, 200]} glint={glint} />
        <BlurFilter id={blurId} radius={6} />
        <filter id={softId} x="-20%" y="-40%" width="140%" height="180%">
          <feGaussianBlur stdDeviation={9} />
        </filter>
      </defs>
      {background.show ? (
        <g opacity={backdrop}>
          <DamaskFill gold={gold} size={150} strength={0.09} offset={frame * 0.6} />
          <EdgeShade color={background.night} reach={0.42} />
          <Dust frame={frame} count={40} color={gold.light} seed="title-dust" />
        </g>
      ) : null}
      {[false, true].map((soft) => (
        <g
          key={soft ? 'soft' : 'sharp'}
          opacity={presence * (soft ? haze : 1 - haze)}
          filter={soft ? `url(#${softId})` : undefined}
        >
          <g transform={`translate(960 520) scale(${scale.toFixed(4)})`}>
            <g transform="translate(2 4)">{swash(withAlpha(gold.deep, 0.9), 6)}</g>
            {swash(paint(ids.sheen), 5.5)}
            {swash(withAlpha(gold.highlight, 0.7), 1.6)}
            <Embossed depth={3} gold={gold} fill={paint(ids.band)}>
              {word}
            </Embossed>
            {word(paint(ids.glint))}
          </g>
        </g>
      ))}
      <RevealText
        text={title.eyebrow}
        x={960 - size * 1.15}
        y={520 - size * 0.62}
        anchor="start"
        style={small}
        color={text.cream}
        frame={frame}
        start={TITLE.eyebrow}
        stagger={8}
        out={[TITLE.exit[0] - 10, TITLE.exit[1] - 14]}
        blurId={blurId}
      />
      <RevealText
        text={title.tail}
        x={960 + size * 1.5}
        y={520 + size * 1.22}
        anchor="end"
        style={small}
        color={text.cream}
        frame={frame}
        start={TITLE.tail}
        stagger={8}
        out={[TITLE.exit[0] - 10, TITLE.exit[1] - 14]}
        blurId={blurId}
      />
    </svg>
  );
};
