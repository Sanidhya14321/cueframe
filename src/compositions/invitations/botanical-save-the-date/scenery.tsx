import type { BotanicalSaveTheDateProps } from '@/schemas';
import { settle, smooth, tween } from '../../promo/timing';
import { EucalyptusFrame } from './eucalyptus';
import { type Hexagon, PeonyGarland } from './garland';
import { fixed, type Point, shade } from './paint';
import { isStaying, Placed, type Stay, stayOpen, swayAt } from './pose';
import { CornerSpray } from './spray';
import { WillowSprig } from './sprig';
import type { Timeline } from './timeline';
import { type Arch, ArchCard, TropicalBouquet } from './tropical';
import { inksOf } from './voice';
import { PeachWash } from './wash';

const CARD = { x: 200, y: 470, width: 700, height: 960 };
const HEXAGON: Hexagon = { center: [540, 790], rx: 500, ry: 500 };
export const ARCH: Arch = { left: 90, right: 1060, top: 250, bottom: 1700 };

interface SprayPlace {
  at: Point;
  from: Point;
  scale: number;
  rotation: number;
  seed: number;
}

const PAIRS: Record<'verse' | 'save' | 'invite' | 'ring' | 'closing', SprayPlace[]> = {
  verse: [
    { at: [300, 440], from: [-1, -1], scale: 1, rotation: 0, seed: 3 },
    { at: [470, 1650], from: [1, 1], scale: 1, rotation: 0, seed: 9 },
  ],
  save: [
    { at: [330, 360], from: [-1, -1], scale: 1, rotation: 4, seed: 5 },
    { at: [430, 1570], from: [1, 1], scale: 1, rotation: -4, seed: 13 },
  ],
  invite: [
    { at: [760, 270], from: [1, -1], scale: 0.85, rotation: 8, seed: 21 },
    { at: [830, 1650], from: [1, 1], scale: 0.9, rotation: -6, seed: 27 },
  ],
  ring: [
    { at: [720, 150], from: [0.4, -1], scale: 0.68, rotation: 6, seed: 33 },
    { at: [880, 1790], from: [1, 1], scale: 0.7, rotation: -8, seed: 37 },
  ],
  closing: [
    { at: [300, 330], from: [-1, -1], scale: 0.95, rotation: 2, seed: 41 },
    { at: [500, 1690], from: [1, 1], scale: 1, rotation: -2, seed: 47 },
  ],
};

const SPRAY_LEAD = 6;

const sprayStay = (stay: Stay, index: number, stagger: number): Stay => {
  const start = stay.start + SPRAY_LEAD + index * stagger;
  const end = stay.end - (1 - index) * Math.round(stagger * 0.6);
  return { start, end: Math.max(start + 1, end) };
};

const Fading = ({
  frame,
  stay,
  props,
  grow = 0,
  origin,
  children,
}: {
  frame: number;
  stay: Stay;
  props: BotanicalSaveTheDateProps;
  grow?: number;
  origin: Point;
  children: React.ReactNode;
}) => {
  const drift = { ...props.florals, slide: 0 };
  if (!isStaying(frame, stay, drift)) {
    return null;
  }
  const arrive = tween(frame, [stay.start, stay.start + props.florals.enterFrames], [0, 1], settle);
  const scale = 1 + grow * (1 - arrive);
  return (
    <g
      opacity={stayOpen(frame, stay, drift)}
      transform={`translate(${fixed(origin[0])} ${fixed(origin[1])}) scale(${scale.toFixed(4)}) translate(${fixed(-origin[0])} ${fixed(-origin[1])})`}
    >
      {children}
    </g>
  );
};

export const Scenery = ({
  props,
  timeline,
  frame,
  width,
  height,
}: {
  props: BotanicalSaveTheDateProps;
  timeline: Timeline;
  frame: number;
  width: number;
  height: number;
}) => {
  const { beats, drift } = timeline;
  const { florals, frames, wash } = props;
  const pair = (name: keyof typeof PAIRS, stay: Stay, key: string) =>
    PAIRS[name].map((place, index) => (
      <Placed
        key={`${key}-${place.seed}`}
        frame={frame}
        stay={sprayStay(stay, index, florals.stagger)}
        drift={drift}
        at={place.at}
        from={place.from}
        rotation={place.rotation}
        scale={place.scale * florals.size}
        phase={index * 2.1}
      >
        <CornerSpray
          id={`${key}-${index}`}
          inks={inksOf(props, `${key}-${index}`)}
          seed={place.seed}
        />
      </Placed>
    ));
  const washStay: Stay = { start: 0, end: beats.verseTwo.stay.end };
  const washEnd = washStay.end + florals.exitFrames;
  const washShift = tween(frame, [0, washEnd], [0, 1], (t) => t) * wash.drift;
  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      style={{ position: 'absolute', left: 0, top: 0 }}
      aria-hidden="true"
    >
      {wash.show && frame <= washEnd + 1 ? (
        <g
          opacity={
            wash.opacity *
            tween(frame, [0, 18], [0, 1], smooth) *
            tween(frame, [washStay.end, washEnd], [1, 0], smooth)
          }
          transform={`translate(${fixed(-washShift)} ${fixed(washShift * 0.6)})`}
        >
          <PeachWash id="wash" color={wash.color} gold={florals.gold} />
        </g>
      ) : null}
      {pair('verse', beats.verseOne.stay, 'one')}
      {pair('verse', beats.verseTwo.stay, 'two')}
      {pair('save', beats.save.stay, 'save')}
      <Placed
        frame={frame}
        stay={beats.couple.stay}
        drift={drift}
        at={[300, 1110]}
        from={[-1, 0.25]}
        scale={florals.size}
      >
        <WillowSprig id="sprig" inks={inksOf(props, 'sprig')} />
      </Placed>
      {pair('invite', beats.invite.stay, 'invite')}
      <Fading frame={frame} stay={beats.mehendi.stay} props={props} grow={0.04} origin={[540, 950]}>
        <EucalyptusFrame
          id="eucalyptus"
          base={frames.eucalyptus}
          card={CARD}
          paper={props.look.background}
          frame={frame}
          start={beats.mehendi.stay.start}
          swing={(index) => swayAt(frame, beats.mehendi.stay, drift, index * 1.7, 0.9)}
        />
      </Fading>
      <Fading frame={frame} stay={beats.ring.stay} props={props} origin={[540, 960]}>
        <PeonyGarland
          id="garland"
          hexagon={HEXAGON}
          gold={florals.gold}
          lineWidth={frames.lineWidth}
          greens={frames.garland}
          color={frames.peony}
          heart={frames.peonyHeart}
          filler={florals.heart}
          frame={frame}
          start={beats.ring.stay.start}
          swing={(index) => swayAt(frame, beats.ring.stay, drift, index * 1.3, 0.9)}
        />
      </Fading>
      {pair('ring', beats.ring.stay, 'ring')}
      <Fading frame={frame} stay={beats.wedding.stay} props={props} grow={0.03} origin={[575, 975]}>
        <ArchCard arch={ARCH} fill={frames.archFill} border={frames.archBorder} />
      </Fading>
      <Placed
        frame={frame}
        stay={beats.wedding.stay}
        drift={drift}
        at={[220, 1800]}
        from={[-1, 0.6]}
        scale={florals.size}
      >
        <g transform="translate(-220 -1800)">
          <TropicalBouquet
            id="tropical"
            leaf={frames.tropical}
            flower={frames.anthurium}
            stem={shade(frames.anthurium, 0.45)}
            spadix={florals.gold}
          />
        </g>
      </Placed>
      {pair('closing', beats.closing.stay, 'closing')}
    </svg>
  );
};
