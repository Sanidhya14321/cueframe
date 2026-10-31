import { AbsoluteFill } from 'remotion';
import type { HangingWordsProps } from '@/schemas';
import { fontFamily } from './fonts';
import { GlitchWord } from './glitch-word';
import { dampedSwing, landDistance, launchDistance, launchSpeed, progress } from './physics';
import { Streak } from './streak';
import { TextLine } from './text-line';

const lineOffset = (index: number): number =>
  index === 0 ? 0 : index % 2 === 1 ? (index + 1) / 2 : -index / 2;

const greetingLines = (count: number) =>
  Array.from({ length: count }, (_, order) => ({ order, offset: lineOffset(order) }));

const exitStarts = (props: HangingWordsProps): Map<number, number> => {
  const { greeting, hang } = props;
  const sorted = greetingLines(greeting.lines).sort((a, b) => a.offset - b.offset);
  const starts = new Map<number, number>();
  sorted.forEach((line, rank) => {
    const later = hang.arrive - 1 - sorted.length + rank;
    starts.set(line.order, rank === 0 ? greeting.exitStart : Math.max(greeting.exitStart, later));
  });
  return starts;
};

const dotTravel = (props: HangingWordsProps, frame: number) => {
  const { knot } = props;
  const span = knot.y + knot.dotSize;
  if (frame < knot.fallStart) {
    const elapsed = frame - knot.riseStart;
    return {
      y: knot.y - launchDistance(elapsed, knot.riseFrames, span),
      speed: launchSpeed(elapsed, knot.riseFrames, span),
    };
  }
  const elapsed = frame - knot.fallStart;
  const y = -knot.dotSize + landDistance(elapsed, knot.fallFrames, span);
  const before = -knot.dotSize + landDistance(elapsed - 1, knot.fallFrames, span);
  return { y, speed: elapsed >= knot.fallFrames ? 0 : y - before };
};

export const HangingAct = ({ props, frame }: { props: HangingWordsProps; frame: number }) => {
  const { knot, greeting, hang, look } = props;
  const exits = exitStarts(props);
  const dot = dotTravel(props, frame);
  const landed = frame - hang.arrive;
  const angle = dampedSwing(landed, hang.swing, hang.swingPeriod, hang.swingDamping, hang.swings);
  const drop = progress(frame, hang.arrive - hang.dropFrames, hang.dropFrames);
  const dropOffset = hang.dropHeight * (1 - drop) * (1 - drop);
  const dropSpeed =
    drop > 0 && drop < 1 ? (2 * hang.dropHeight * (1 - drop)) / Math.max(1, hang.dropFrames) : 0;
  const textTop = knot.y + knot.dotSize / 2 + hang.gap;
  const topCenter = textTop + hang.topSize * 0.5;
  const bottomCenter = topCenter + hang.topSize * 0.5 + hang.bottomSize * (hang.leading - 0.5);
  const showHang = drop > 0;
  const bobSide = knot.dotSize * (0.8 + (0.2 * knot.corner) / 50);
  return (
    <AbsoluteFill>
      {greetingLines(greeting.lines).map((line) => {
        const start = greeting.start + line.order * greeting.stagger;
        const reveal = progress(frame, start, greeting.revealFrames);
        const exit = progress(
          frame,
          exits.get(line.order) ?? greeting.exitStart,
          greeting.exitFrames,
        );
        if (reveal <= 0 || exit >= 1) {
          return null;
        }
        const hollow = line.offset !== 0 && greeting.outline > 0;
        return (
          <TextLine
            key={line.order}
            centerY={knot.y + line.offset * greeting.pitch}
            size={greeting.size}
            font={fontFamily(greeting.font)}
            weight={greeting.weight}
            tracking={greeting.tracking}
            color={hollow ? 'transparent' : look.ink}
            style={hollow ? { WebkitTextStroke: `${greeting.outline}px ${look.ink}` } : {}}
          >
            <GlitchWord word={greeting.word} reveal={reveal} exit={exit} />
          </TextLine>
        );
      })}
      <AbsoluteFill
        style={{ transformOrigin: '50% 0', transform: `rotate(${angle.toFixed(4)}deg)` }}
      >
        <div
          style={{
            position: 'absolute',
            left: 540 - knot.stringWidth / 2,
            top: -40,
            width: knot.stringWidth,
            height: knot.y + 40 - knot.dotSize * 0.3,
            background: look.ink,
          }}
        />
        <Streak
          y={Math.abs(dot.speed) * knot.blur * 0.12}
          style={{ position: 'absolute', inset: 0 }}
        >
          <div
            style={{
              position: 'absolute',
              left: 540 - bobSide / 2,
              top: dot.y - bobSide / 2,
              width: bobSide,
              height: bobSide,
              borderRadius: `${knot.corner}%`,
              transform: 'rotate(45deg)',
              background: look.ink,
            }}
          />
        </Streak>
        {showHang ? (
          <Streak
            y={dropSpeed * knot.blur * 0.25}
            style={{ position: 'absolute', inset: 0, transform: `translateY(${-dropOffset}px)` }}
          >
            <TextLine
              centerY={topCenter}
              size={hang.topSize}
              font={fontFamily(hang.font)}
              weight={hang.weight}
              color={look.accent}
            >
              {hang.top}
            </TextLine>
            <TextLine
              centerY={bottomCenter}
              size={hang.bottomSize}
              font={fontFamily(hang.font)}
              weight={hang.weight}
              color={look.ink}
            >
              {hang.bottom}
            </TextLine>
          </Streak>
        ) : null}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
