import { useMemo } from 'react';
import type { GoldMonogramInviteProps } from '@/schemas';
import { smooth, tween } from '../../promo/timing';
import { DamaskFill } from './damask';
import { EventText } from './event-text';
import { Couple } from './figure';
import { BAND_MAN, BAND_WOMAN, MAN, WOMAN } from './figure-poses';
import { Embossed, GoldGradients, paint, useGoldIds, useSvgId, withAlpha } from './gold';
import { circleAt, corner, flower, polar, teardrop } from './ornament';
import { OrnamentArt } from './ornament-art';
import { Dust } from './sparks';
import { BlurFilter, RevealText } from './text-fx';
import { BAND, fadeIn, fadeOut, RING } from './timeline';

const BAND_HEIGHT = 540;
const BEAT = 90;

const sprigs = (radius: number): string =>
  Array.from({ length: 22 }, (_, index) => {
    const angle = -Math.PI * 0.95 + (index / 21) * Math.PI * 1.9 + Math.PI / 2;
    const base = polar(radius, angle);
    if (index % 5 === 2) {
      return `${flower(base, radius * 0.07, 6, angle)} ${circleAt(base, radius * 0.018)}`;
    }
    return teardrop(base, angle + (index % 2 === 0 ? 0.9 : -0.9), radius * 0.13, radius * 0.03);
  }).join(' ');

export const BandAct = ({
  frame,
  event,
  eventText,
  saveTheDate,
  gold,
  text,
  sketch,
  background,
  serif,
  script,
}: Pick<
  GoldMonogramInviteProps,
  'eventText' | 'saveTheDate' | 'gold' | 'text' | 'sketch' | 'background'
> & {
  frame: number;
  event: GoldMonogramInviteProps['events'][number];
  serif: string;
  script: string;
}) => {
  const ids = useGoldIds('band-gold');
  const blurId = useSvgId('band-blur');
  const wipeId = useSvgId('band-wipe');
  const maskId = useSvgId('band-mask');
  const clipId = useSvgId('band-clip');
  const shadowId = useSvgId('band-shadow');
  const cornerLayers = useMemo(() => corner(110), []);
  if (frame < RING.wipe[0]) {
    return null;
  }
  const wipe = tween(frame, RING.wipe, [-0.3, 1.3], smooth);
  const open = tween(frame, BAND.open, [0, 1], smooth);
  const height = BAND_HEIGHT * open;
  const top = 540 - height / 2;
  const contentOut: [number, number] = BAND.contentOut;
  const couple = Math.min(fadeIn(frame, BAND.content, 40), fadeOut(frame, contentOut));
  const save = fadeIn(frame, BAND.save[0], BAND.save[1] - BAND.save[0]);
  const lines = saveTheDate.text.split('\n').filter((line) => line.trim().length > 0);
  const size = saveTheDate.size;
  const step = size * 0.74;
  const first = 540 - ((lines.length - 1) * step) / 2 + size * 0.28;
  const ornamentHalf = Math.max(size * 1.95, 300);
  return (
    <svg
      width={1920}
      height={1080}
      viewBox="0 0 1920 1080"
      role="presentation"
      style={{ position: 'absolute' }}
    >
      <defs>
        <GoldGradients ids={ids} gold={gold} sheen={[0, 0, 1920, 400]} />
        <BlurFilter id={blurId} radius={6} />
        <linearGradient
          id={wipeId}
          gradientUnits="userSpaceOnUse"
          x1={0}
          y1={0}
          x2={1920}
          y2={1080}
        >
          <stop offset={Math.max(0, Math.min(1, wipe - 0.18))} stopColor="#ffffff" />
          <stop
            offset={Math.max(0, Math.min(1, wipe + 0.18))}
            stopColor="#ffffff"
            stopOpacity={0}
          />
        </linearGradient>
        <mask id={maskId} maskUnits="userSpaceOnUse" x={0} y={0} width={1920} height={1080}>
          <rect width={1920} height={1080} fill={`url(#${wipeId})`} />
        </mask>
        <clipPath id={clipId}>
          <rect x={0} y={top} width={1920} height={height} />
        </clipPath>
        <linearGradient id={shadowId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={background.night} stopOpacity={0} />
          <stop offset="0.5" stopColor={background.night} stopOpacity={0.85} />
          <stop offset="1" stopColor={background.night} stopOpacity={0} />
        </linearGradient>
      </defs>
      <g mask={`url(#${maskId})`}>
        <rect width={1920} height={1080} fill={background.night} />
        <DamaskFill
          gold={gold}
          size={210}
          strength={1}
          offset={-40 + (frame - RING.wipe[0]) * 0.5}
        />
      </g>
      {height > 0.5 ? (
        <>
          <rect x={0} y={top - 40} width={1920} height={height + 80} fill={`url(#${shadowId})`} />
          <rect x={0} y={top} width={1920} height={height} fill={background.night} />
          <rect x={0} y={top - 5} width={1920} height={5} fill={paint(ids.sheen)} />
          <rect x={0} y={top + height} width={1920} height={5} fill={paint(ids.sheen)} />
          <g clipPath={`url(#${clipId})`}>
            <Dust frame={frame} count={46} color={gold.light} seed="band-dust" />
            <g transform="translate(540 790) scale(0.56)" opacity={couple}>
              <Couple
                beat={Math.max(0, ((frame - BAND.content) / BEAT) * sketch.danceSpeed)}
                man={BAND_MAN}
                woman={BAND_WOMAN}
                builds={{ man: MAN, woman: WOMAN }}
                manLook={{
                  ink: gold.mid,
                  second: null,
                  fill: withAlpha(gold.deep, 1),
                  fillOpacity: 0.55,
                  width: sketch.lineWidth * 1.5,
                  draw: 1,
                }}
                womanLook={{
                  ink: sketch.chalk,
                  second: null,
                  fill: background.night,
                  fillOpacity: 0.9,
                  width: sketch.lineWidth * 1.5,
                  draw: 1,
                }}
              />
            </g>
            <EventText
              event={event}
              eventText={eventText}
              gold={gold}
              band={ids.band}
              cream={text.cream}
              serif={serif}
              script={script}
              scriptTitle
              x={1240}
              y={460}
              frame={frame}
              start={BAND.content + 6}
              out={contentOut}
              blurId={blurId}
            />
            <g opacity={save}>
              {[-1, 1].map((side) => (
                <g
                  key={side}
                  transform={`translate(${960 + side * ornamentHalf} ${540 - size * 1.45}) scale(${-side} 1)`}
                >
                  <Embossed depth={1.2} gold={gold} fill={paint(ids.sheen)}>
                    {(color) => <OrnamentArt layers={cornerLayers} color={color} />}
                  </Embossed>
                </g>
              ))}
              {saveTheDate.sprigs ? (
                <g transform="translate(960 540)">
                  <path d={sprigs(size * 1.55)} fill={withAlpha(gold.light, 0.85)} />
                </g>
              ) : null}
            </g>
            {lines.map((line, index) => (
              <RevealText
                key={`${line}-${index.toString()}`}
                text={line}
                x={960 + (index % 2 === 0 ? -size * 0.12 : size * 0.12)}
                y={first + index * step}
                style={{ fontFamily: script, fontSize: size }}
                color={paint(ids.band)}
                gold={gold}
                depth={2.2}
                frame={frame}
                start={BAND.save[0] + index * 10}
                stagger={4}
                out={[100000, 100001]}
                blurId={blurId}
              />
            ))}
          </g>
        </>
      ) : null}
    </svg>
  );
};
