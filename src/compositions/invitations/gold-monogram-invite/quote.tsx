import { useMemo } from 'react';
import type { GoldMonogramInviteProps } from '@/schemas';
import { smooth, tween } from '../../promo/timing';
import { Couple, type FigureLook, FloorShadow } from './figure';
import { DANCE_MAN, DANCE_WOMAN, MAN, WOMAN } from './figure-poses';
import { Embossed, GoldGradients, paint, useGoldIds, useSvgId, withAlpha } from './gold';
import { quarterMandala } from './ornament';
import { OrnamentArt } from './ornament-art';
import { BlurFilter, RevealText } from './text-fx';
import { fadeOut, QUOTE } from './timeline';

const PANEL = 772;
const DANCE_BEAT = 112;

type QuoteProps = Pick<
  GoldMonogramInviteProps,
  'quote' | 'gold' | 'text' | 'paper' | 'background' | 'sketch'
> & {
  frame: number;
  serif: string;
  script: string;
};

const Paper = ({ paper, panelEdge }: { paper: QuoteProps['paper']; panelEdge: string }) => {
  const wallId = useSvgId('paper-wall');
  const shadeId = useSvgId('paper-shade');
  return (
    <>
      <defs>
        <linearGradient id={wallId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={paper.wall} />
          <stop offset="0.5" stopColor={paper.wall} stopOpacity={0.96} />
          <stop offset="0.62" stopColor={paper.floor} stopOpacity={0.9} />
          <stop offset="0.7" stopColor={paper.floor} />
          <stop offset="1" stopColor={paper.floor} />
        </linearGradient>
        <linearGradient id={shadeId} x1="0" y1="0" x2="1" y2="0">
          {[0, 0.12, 0.3, 0.55, 0.8, 1].map((offset) => (
            <stop
              key={offset}
              offset={offset}
              stopColor={panelEdge}
              stopOpacity={(0.42 * (1 - offset) ** 2).toFixed(3)}
            />
          ))}
        </linearGradient>
      </defs>
      <rect x={PANEL} y={0} width={1920 - PANEL} height={1080} fill={paper.floor} />
      <rect x={PANEL} y={0} width={1920 - PANEL} height={1080} fill={`url(#${wallId})`} />
      <rect x={PANEL} y={0} width={110} height={1080} fill={`url(#${shadeId})`} />
    </>
  );
};

export const QuoteAct = ({
  frame,
  quote,
  gold,
  text,
  paper,
  background,
  sketch,
  serif,
  script,
}: QuoteProps) => {
  const ids = useGoldIds('quote-gold');
  const clipId = useSvgId('quote-clip');
  const panelId = useSvgId('quote-panel');
  const blurId = useSvgId('quote-blur');
  const layers = useMemo(quarterMandala, []);
  const presence = Math.min(tween(frame, QUOTE.fadeIn, [0, 1], smooth), fadeOut(frame, QUOTE.end));
  if (presence <= 0) {
    return null;
  }
  const sweep = -0.2 + ((frame % 420) / 420) * 1.4;
  const beat = (frame / DANCE_BEAT) * sketch.danceSpeed;
  const figureLook = (fill: string): FigureLook => ({
    ink: sketch.pencil,
    second: sketch.chalk,
    fill,
    fillOpacity: 0.9,
    width: sketch.lineWidth,
    draw: 1,
  });
  const caps = {
    fontFamily: serif,
    fontSize: quote.capsSize,
    letterSpacing: '0.08em',
    fontWeight: 600,
    uppercase: true,
  };
  const scriptStyle = { fontFamily: script, fontSize: quote.scriptSize };
  const center = PANEL / 2;
  const firstScriptStart =
    QUOTE.firstStart + quote.firstCaps.split(/\s+/).length * quote.wordStagger + 6;
  const secondCapsStart = QUOTE.secondStart + 34;
  const lastFrame = 10000;
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
          <GoldGradients ids={ids} gold={gold} sheen={[-200, -400, 900, 700]} />
          <linearGradient id={panelId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={background.panel} />
            <stop offset="0.55" stopColor={background.panel} />
            <stop offset="1" stopColor={background.panelEdge} />
          </linearGradient>
          <BlurFilter id={blurId} radius={7} />
          <clipPath id={clipId}>
            <rect x={0} y={0} width={PANEL} height={1080} />
          </clipPath>
        </defs>
        <Paper paper={paper} panelEdge={background.panelEdge} />
        <g transform="translate(1590 978) scale(1.04)">
          <FloorShadow x={-150} width={130} color={sketch.pencil} />
          <FloorShadow x={150} width={120} color={sketch.pencil} />
          <Couple
            beat={beat}
            man={DANCE_MAN}
            woman={DANCE_WOMAN}
            builds={{ man: MAN, woman: WOMAN }}
            manLook={figureLook(paper.floor)}
            womanLook={figureLook(paper.floor)}
          />
        </g>
        <RevealText
          text={quote.paperLead}
          x={1118}
          y={470}
          style={{ fontFamily: script, fontSize: quote.paperScriptSize * 0.5 }}
          color={text.ink}
          frame={frame}
          start={QUOTE.paperLead}
          stagger={quote.wordStagger}
          out={[lastFrame, lastFrame + 1]}
          blurId={blurId}
        />
        <PaperScript
          frame={frame}
          text={quote.paperScript}
          size={quote.paperScriptSize}
          font={script}
          color={text.ink}
        />
        <rect x={0} y={0} width={PANEL} height={1080} fill={`url(#${panelId})`} />
        <g clipPath={`url(#${clipId})`}>
          <g
            transform={`translate(${PANEL * 0.69} -36) rotate(${(frame * 0.012).toFixed(3)}) scale(1.06)`}
          >
            <Embossed depth={2.4} gold={gold} fill={paint(ids.sheen)}>
              {(color) => <OrnamentArt layers={layers} color={color} />}
            </Embossed>
            <SheenSweep sweep={sweep} highlight={gold.highlight} layers={layers} />
          </g>
        </g>
        <RevealText
          text={quote.firstCaps}
          x={center}
          y={848}
          style={caps}
          color={paint(ids.band)}
          gold={gold}
          depth={1.6}
          frame={frame}
          start={QUOTE.firstStart}
          stagger={quote.wordStagger}
          out={QUOTE.firstOut}
          blurId={blurId}
        />
        <RevealText
          text={quote.firstScript}
          x={center}
          y={848 + quote.scriptSize * 1.1}
          style={scriptStyle}
          color={paint(ids.band)}
          gold={gold}
          depth={1.4}
          frame={frame}
          start={firstScriptStart}
          stagger={quote.wordStagger * 0.6}
          out={[QUOTE.firstOut[0] + 4, QUOTE.firstOut[1] + 4]}
          blurId={blurId}
        />
        <RevealText
          text={quote.secondScript}
          x={center}
          y={858}
          style={{ ...scriptStyle, fontSize: quote.scriptSize * 1.25 }}
          color={paint(ids.band)}
          gold={gold}
          depth={1.6}
          frame={frame}
          start={QUOTE.secondStart}
          stagger={quote.wordStagger}
          out={[lastFrame, lastFrame + 1]}
          blurId={blurId}
        />
        <RevealText
          text={quote.secondCaps}
          x={center}
          y={858 + quote.capsSize * 2.1}
          style={caps}
          color={paint(ids.band)}
          gold={gold}
          depth={1.6}
          frame={frame}
          start={secondCapsStart}
          stagger={quote.wordStagger}
          out={[lastFrame, lastFrame + 1]}
          blurId={blurId}
        />
      </g>
    </svg>
  );
};

const SheenSweep = ({
  sweep,
  highlight,
  layers,
}: {
  sweep: number;
  highlight: string;
  layers: ReturnType<typeof quarterMandala>;
}) => {
  const id = useSvgId('quote-sweep');
  const stops: [number, number][] = [
    [sweep - 0.18, 0],
    [sweep - 0.06, 0.3],
    [sweep, 0.75],
    [sweep + 0.06, 0.3],
    [sweep + 0.18, 0],
  ];
  return (
    <>
      <defs>
        <linearGradient
          id={id}
          gradientUnits="userSpaceOnUse"
          x1={-700}
          y1={-300}
          x2={700}
          y2={500}
        >
          {stops.map(([offset, opacity]) => (
            <stop
              key={offset}
              offset={Math.max(0, Math.min(1, offset))}
              stopColor={highlight}
              stopOpacity={opacity}
            />
          ))}
        </linearGradient>
      </defs>
      <OrnamentArt layers={layers} color={`url(#${id})`} />
    </>
  );
};

const PaperScript = ({
  frame,
  text,
  size,
  font,
  color,
}: {
  frame: number;
  text: string;
  size: number;
  font: string;
  color: string;
}) => {
  const maskId = useSvgId('paper-wipe');
  const fadeId = useSvgId('paper-wipe-fade');
  const reveal = tween(frame, QUOTE.paperScript, [0, 1], (t) => t * t * (3 - 2 * t));
  if (reveal <= 0) {
    return null;
  }
  const left = 780;
  const right = 1280;
  const edge = left + (right - left + 160) * reveal - 80;
  return (
    <>
      <defs>
        <linearGradient
          id={fadeId}
          gradientUnits="userSpaceOnUse"
          x1={edge - 80}
          y1={0}
          x2={edge + 80}
          y2={0}
        >
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor="#ffffff" stopOpacity={0} />
        </linearGradient>
        <mask id={maskId} maskUnits="userSpaceOnUse" x={0} y={0} width={1920} height={1080}>
          <rect x={0} y={0} width={1920} height={1080} fill={`url(#${fadeId})`} />
        </mask>
      </defs>
      <text
        x={1010}
        y={622}
        textAnchor="middle"
        mask={`url(#${maskId})`}
        style={{ fontFamily: font, fontSize: size, textRendering: 'geometricPrecision' }}
        fill={withAlpha(color, 1)}
      >
        {text}
      </text>
    </>
  );
};
