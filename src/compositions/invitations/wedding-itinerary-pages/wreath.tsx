import type { WeddingItineraryPagesProps } from '@/schemas';
import { accelerate, smooth, TAU, tween } from '../../promo/timing';
import { inviteScriptFonts } from '../fonts';
import { type Art, gid } from './art';
import { Blossom } from './flowers';
import { dark, f, Linear, leafPath, light, memo, mix, random } from './paint';

const ROOM = 46;

const POP_FRAMES = 12;

const FLOURISH_REACH = 1.42;

export const wreathHeight = (radius: number): number => Math.round(2 * (radius + ROOM));

export const Wreath = ({
  art,
  props,
  top,
  frame,
  start,
  exit,
}: {
  art: Art;
  props: WeddingItineraryPagesProps;
  top: number;
  frame: number;
  start: number;
  exit: number;
}) => {
  const { wreath, cover, type } = props;
  const radius = wreath.radius;
  const box = wreathHeight(radius);
  const width = Math.round(radius * FLOURISH_REACH * 2 + 40);
  const cx = width / 2;
  const cy = box / 2;
  const items = memo(`wreath|${radius}|${wreath.flowers}|${wreath.leaves}`, () => {
    const rand = random(31);
    const leaves = Array.from({ length: wreath.leaves * 2 }, (_, index) => {
      const angle = (Math.floor(index / 2) / Math.max(1, wreath.leaves)) * TAU + rand() * 0.06;
      const side = index % 2 === 0 ? 1 : -1;
      const x = cx + Math.cos(angle) * radius;
      const y = cy + Math.sin(angle) * radius;
      return {
        angle,
        d: leafPath(x, y, 20 + rand() * 10, 6.5, angle + Math.PI / 2 - 0.35 + side * 1.05),
        lit: rand() > 0.45,
      };
    });
    const flowers = Array.from({ length: wreath.flowers }, (_, index) => {
      const angle = ((index + 0.35) / Math.max(1, wreath.flowers)) * TAU;
      return {
        angle,
        x: cx + Math.cos(angle) * radius,
        y: cy + Math.sin(angle) * radius,
        r: 15 + rand() * 6,
        blush: index % 3 === 1,
      };
    });
    return { leaves, flowers };
  });
  const reveal = (angle: number): number => {
    const turn = (((angle + Math.PI) % TAU) + TAU) % TAU;
    const at = start + (turn / TAU) * wreath.drawFrames;
    return tween(frame, [at, at + POP_FRAMES], [0, 1], smooth);
  };
  const out = tween(frame, [exit, exit + 26], [0, 1], accelerate);
  const fadeOut = tween(frame, [exit + 6, exit + 26], [1, 0], smooth);
  if (frame < start - 1 || fadeOut <= 0) {
    return null;
  }
  const stem = mix(art.leaf.trunk, art.leaf.dark, 0.5);
  const flourishLength = radius * FLOURISH_REACH * 2 + 20;
  const draw = tween(frame, [start + 4, start + 4 + wreath.drawFrames], [0, 1], smooth);
  const letters = tween(
    frame,
    [start + wreath.drawFrames * 0.4, start + wreath.drawFrames * 0.4 + 16],
    [0, 1],
    smooth,
  );
  const grow = (angle: number, x: number, y: number): string => {
    const amount = reveal(angle);
    return `translate(${f(x)} ${f(y)}) scale(${amount.toFixed(4)}) translate(${f(-x)} ${f(-y)})`;
  };
  return (
    <div
      style={{
        position: 'absolute',
        left: `calc(50% - ${cx}px)`,
        top,
        width,
        height: box,
        opacity: fadeOut,
        transform: `translateX(${(out * 760).toFixed(2)}px) rotate(${(out * 28).toFixed(2)}deg)`,
      }}
    >
      <svg width={width} height={box} viewBox={`0 0 ${width} ${box}`} aria-hidden="true">
        <defs>
          <Linear
            id={gid(art, 'wreath-leaf')}
            stops={[
              [0, art.leaf.light],
              [1, art.leaf.mid],
            ]}
          />
        </defs>
        <circle
          cx={cx}
          cy={cy}
          r={radius}
          fill="none"
          stroke={stem}
          strokeWidth={2}
          strokeDasharray={`${(TAU * radius * draw).toFixed(1)} ${(TAU * radius).toFixed(1)}`}
          transform={`rotate(180 ${cx} ${cy})`}
        />
        {items.leaves.map((leaf, index) => (
          <path
            key={index}
            d={leaf.d}
            fill={leaf.lit ? `url(#${gid(art, 'wreath-leaf')})` : dark(art.leaf.mid, 0.1)}
            transform={grow(
              leaf.angle,
              cx + Math.cos(leaf.angle) * radius,
              cy + Math.sin(leaf.angle) * radius,
            )}
          />
        ))}
        {items.flowers.map((flower, index) => (
          <g key={index} transform={grow(flower.angle, flower.x, flower.y)}>
            <Blossom
              x={flower.x}
              y={flower.y}
              r={flower.r}
              turn={flower.angle}
              color={flower.blush ? art.bloom.blossom : light(art.bloom.rose, 0.25)}
              heart={art.bloom.marigold}
            />
          </g>
        ))}
        {wreath.flourish ? (
          <path
            d={`M${f(cx - flourishLength / 2)} ${f(cy + 18)}C${f(cx - radius * 0.8)} ${f(cy + 8)} ${f(cx - radius * 0.4)} ${f(cy + 30)} ${f(cx)} ${f(cy + 14)}C${f(cx + radius * 0.4)} ${f(cy)} ${f(cx + radius * 0.9)} ${f(cy + 26)} ${f(cx + flourishLength / 2)} ${f(cy + 6)}`}
            fill="none"
            stroke={cover.titleColor}
            strokeWidth={2.2}
            strokeLinecap="round"
            strokeDasharray={`${(flourishLength * 1.1 * draw).toFixed(1)} ${(flourishLength * 1.2).toFixed(1)}`}
          />
        ) : null}
      </svg>
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: Math.round(cy - type.monogramSize * 0.62),
          height: Math.round(type.monogramSize * 1.2),
          lineHeight: `${Math.round(type.monogramSize * 1.2)}px`,
          textAlign: 'center',
          fontFamily: inviteScriptFonts[type.scriptFont],
          fontSize: type.monogramSize,
          color: cover.titleColor,
          opacity: letters,
          whiteSpace: 'pre',
        }}
      >
        {cover.monogram}
      </div>
    </div>
  );
};
