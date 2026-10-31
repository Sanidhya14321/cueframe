import type { BotanicalSaveTheDateProps } from '@/schemas';
import { fixed, type Point, withAlpha } from './paint';
import {
  type Cue,
  capsStyle,
  glyphStates,
  lineCue,
  scriptStyle,
  splitLines,
  TypedLine,
  type Voice,
} from './type';
import { Column } from './words';

const NARROW = new Set(['I', 'J', '.', ',', "'", ':', ';', '!']);
const WIDE = new Set(['M', 'W']);

const glyphWidth = (character: string): number => {
  if (character === ' ') {
    return 0.5;
  }
  const upper = character.toUpperCase();
  if (NARROW.has(upper)) {
    return 0.42;
  }
  if (WIDE.has(upper)) {
    return 1.12;
  }
  return character === upper ? 0.82 : 0.7;
};

export const ArcText = ({
  text,
  center,
  radius,
  startAngle,
  size,
  tracking,
  frame,
  cue,
  voice,
}: {
  text: string;
  center: Point;
  radius: number;
  startAngle: number;
  size: number;
  tracking: number;
  frame: number;
  cue: Cue;
  voice: Voice;
}) => {
  const characters = Array.from(text);
  const states = glyphStates(frame, characters.length, cue, 'type');
  let angle = startAngle;
  const placed = characters.map((character, index) => {
    const step = ((glyphWidth(character) + tracking) * size * 180) / (Math.PI * radius);
    const middle = angle + step / 2;
    angle += step;
    const radians = (middle * Math.PI) / 180;
    return {
      key: `${index}:${character}`,
      character,
      x: center[0] + Math.cos(radians) * radius,
      y: center[1] + Math.sin(radians) * radius,
      rotation: middle + 90,
      glyph: states[index]?.glyph ?? 0,
    };
  });
  return (
    <>
      {placed.map((item) =>
        item.glyph <= 0.002 ? null : (
          <div
            key={item.key}
            style={{
              position: 'absolute',
              left: Math.round(item.x),
              top: Math.round(item.y),
              width: 0,
              height: 0,
              transform: `rotate(${fixed(item.rotation)}deg)`,
            }}
          >
            <div
              style={{
                position: 'absolute',
                left: -size,
                width: size * 2,
                bottom: 0,
                textAlign: 'center',
                fontFamily: voice.serif,
                fontSize: size,
                lineHeight: 1,
                textTransform: 'uppercase',
                color: withAlpha(voice.muted, item.glyph),
              }}
            >
              {item.character}
            </div>
          </div>
        ),
      )}
    </>
  );
};

export const WeddingWords = ({
  frame,
  cue,
  voice,
  lettering,
  stagger,
  top,
  inset,
  noteTop,
  wedding,
}: {
  frame: number;
  cue: Cue;
  voice: Voice;
  lettering: BotanicalSaveTheDateProps['lettering'];
  stagger: number;
  top: number;
  inset: number;
  noteTop: number;
  wedding: BotanicalSaveTheDateProps['wedding'];
}) => {
  const details = splitLines(wedding.details);
  const small = capsStyle(voice, lettering.detailSize * 0.8, 400, 0.12);
  return (
    <>
      <Column top={top} align="right" inset={inset}>
        <TypedLine
          text={wedding.title}
          frame={frame}
          cue={cue}
          color={voice.ink}
          style={{
            fontFamily: voice.display,
            fontSize: lettering.weddingSize,
            lineHeight: 1,
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
          }}
        />
        <TypedLine
          text={wedding.subtitle}
          frame={frame}
          cue={lineCue(cue, 1, stagger)}
          color={voice.ink}
          style={{
            ...capsStyle(voice, lettering.detailSize * 1.05, 400, 0.08),
            marginTop: '0.2em',
          }}
        />
        <TypedLine
          text={wedding.date}
          frame={frame}
          cue={lineCue(cue, 2, stagger)}
          color={voice.ink}
          style={{ ...capsStyle(voice, lettering.dateSize, 400, 0.04), marginTop: '1.1em' }}
        />
        {details.map((line, index) => (
          <TypedLine
            key={`${index}:${line}`}
            text={line}
            frame={frame}
            cue={lineCue(cue, index + 3, stagger)}
            color={voice.muted}
            style={{ ...small, marginTop: index === 0 ? '0.6em' : '0.25em' }}
          />
        ))}
      </Column>
      <Column top={noteTop} align="right" inset={inset}>
        <TypedLine
          text={wedding.note}
          frame={frame}
          cue={lineCue(cue, details.length + 4, stagger)}
          color={voice.accent}
          style={scriptStyle(voice, lettering.scriptSize * 0.82)}
        />
      </Column>
    </>
  );
};
