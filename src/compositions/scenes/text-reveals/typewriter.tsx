import { Composition, useCurrentFrame } from 'remotion';
import {
  type TypewriterProps,
  typewriterDefaults,
  typewriterMeta,
  typewriterSchema,
} from '@/schemas';
import { displayType, KineticLayer } from '../../promo/kinetic';
import { land, settle, smooth, tween } from '../../promo/timing';
import type { SceneModule } from '../../scene-module';

const FADE_FRAMES = 3;
const BLOCK_FRAMES = 30;

const EDGE = 30;
const linear = (t: number): number => t;

const softEdge = (progress: number, side: 'reveal-before' | 'reveal-after') => {
  const at = progress * (100 + EDGE);
  const [first, second] =
    side === 'reveal-before' ? ['#000', 'transparent'] : ['transparent', '#000'];
  const mask = `linear-gradient(90deg, ${first} ${(at - EDGE).toFixed(2)}%, ${second} ${at.toFixed(2)}%)`;
  return { maskImage: mask, WebkitMaskImage: mask };
};

const clamp01 = (value: number): number => Math.min(1, Math.max(0, value));

const charStates = (
  frame: number,
  count: number,
  { intro, outro, charFrames, outroAt }: TypewriterProps,
  typeStart: number,
  typedIn: number,
): { opacity: number; typed: boolean }[] =>
  Array.from({ length: count }, (_, index) => {
    const fade = Math.max(FADE_FRAMES, charFrames * 1.5);
    const shown =
      intro === 'cut'
        ? 1
        : intro === 'typed'
          ? typedIn
          : clamp01((frame - typeStart - index * charFrames) / fade);
    const erased =
      outro === 'erase' ? clamp01((frame - outroAt - (count - 1 - index) * charFrames) / fade) : 0;
    return { opacity: shown * (1 - erased), typed: shown > 0 };
  });

const blockStyle = (frame: number, delay: number, size: number, caretWidth: number) => {
  const grow = land(frame, [delay, delay + 12], [0, 1], 1 / size);
  const shrink = tween(frame, [delay + 16, delay + BLOCK_FRAMES], [0, 1], smooth);
  const side = size * 0.86 * grow;
  const width = side + (caretWidth - side) * shrink;
  const height = (0.86 + 0.04 * shrink) * grow;
  return { left: -width / 2, top: `${0.5 - height / 2}em`, width, height: `${height}em` };
};

const caretOpacity = (
  frame: number,
  { intro, showCaret, caretPulse }: TypewriterProps,
  caretFrom: number,
  typedIn: number,
  select: number,
): number => {
  if (!showCaret || frame < caretFrom) {
    return 0;
  }
  const pulse = 0.55 + 0.45 * Math.cos(((frame - caretFrom) / caretPulse) * Math.PI * 2);
  return pulse * (1 - select) * (intro === 'typed' ? typedIn : 1);
};

export const Typewriter = (props: TypewriterProps) => {
  const { text, size, weight, tracking, intro, outro, delay, outroAt, placement, look, motion } =
    props;
  const frame = useCurrentFrame() * motion.speed;
  const chars = Array.from(text);
  const caretFrom = delay + (intro === 'block' ? BLOCK_FRAMES : 0);
  const typeStart = caretFrom + props.caretHold;
  const typedIn = tween(frame, [delay, delay + 18], [0, 1], settle);
  const typedRise = land(frame, [delay, delay + 18], [size * 0.3, 0]);
  const states = charStates(frame, chars.length, props, typeStart, typedIn);
  const caretAt = states.filter((state) => state.opacity > 0).length;
  const select = outro === 'select' ? tween(frame, [outroAt, outroAt + 9], [0, 1], linear) : 0;
  const collapse =
    outro === 'select' ? tween(frame, [outroAt + 10, outroAt + 18], [0, 0.96], linear) : 0;
  const vanish =
    outro === 'select' ? tween(frame, [outroAt + 19, outroAt + 22], [0, 1], linear) : 0;
  const zoomEnd = outroAt + (outro === 'erase' ? chars.length * props.charFrames : 0);
  const zoom = land(frame, [delay, zoomEnd], [props.zoom, 1], 4 / size);
  const caretWidth = Math.max(3, size * 0.06);
  const blockActive = intro === 'block' && frame < caretFrom;
  const caret = (
    <span
      key="caret"
      style={{ position: 'relative', display: 'inline-block', width: 0, height: '1em' }}
    >
      <span
        style={{
          position: 'absolute',
          background: props.caretColor,
          ...(blockActive
            ? { ...blockStyle(frame, delay, size, caretWidth), opacity: 1 }
            : {
                left: size * 0.03,
                top: '0.05em',
                width: caretWidth,
                height: '0.9em',
                opacity: caretOpacity(frame, props, caretFrom, typedIn, select),
              }),
        }}
      />
    </span>
  );
  const line = chars.map((char, index) => (
    <span
      key={`${index}:${char}`}
      style={{
        opacity: states[index]?.opacity ?? 0,
        display: states[index]?.typed ? 'inline' : 'none',
      }}
    >
      {char}
    </span>
  ));
  const selected = select > 0;
  return (
    <KineticLayer look={look} motion={motion} placement={placement}>
      <div
        style={{
          ...displayType(size, weight, tracking),
          color: look.ink,
          position: 'relative',
          transform: `translateY(${intro === 'typed' ? typedRise : 0}px) scale(${zoom.toFixed(5)})`,
        }}
      >
        <span style={selected ? softEdge(1 - select, 'reveal-before') : undefined}>
          {[...line.slice(0, caretAt), caret, ...line.slice(caretAt)]}
        </span>
        {selected ? (
          <span
            aria-hidden="true"
            style={{
              position: 'absolute',
              inset: '-0.06em -0.04em',
              padding: '0.06em 0.04em',
              background: props.selectionColor,
              color: look.background,
              opacity: 1 - vanish,
              ...(collapse > 0
                ? { clipPath: `inset(0 ${(collapse * 50).toFixed(3)}%)` }
                : softEdge(1 - select, 'reveal-after')),
            }}
          >
            {line}
          </span>
        ) : null}
      </div>
    </KineticLayer>
  );
};

export const typewriterScene: SceneModule = {
  id: 'typewriter',
  component: Typewriter,
  render: (key) => (
    <Composition
      key={key}
      id="typewriter"
      component={Typewriter}
      schema={typewriterSchema}
      defaultProps={typewriterDefaults}
      durationInFrames={typewriterMeta.durationInFrames}
      fps={typewriterMeta.fps}
      width={typewriterMeta.width}
      height={typewriterMeta.height}
    />
  ),
};
