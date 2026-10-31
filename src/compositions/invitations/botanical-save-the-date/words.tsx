import type { CSSProperties, ReactNode } from 'react';
import { useVideoConfig } from 'remotion';
import type { BotanicalSaveTheDateProps } from '@/schemas';
import { withAlpha } from './paint';
import {
  type Cue,
  capsStyle,
  fadeCue,
  lineCue,
  scriptStyle,
  splitLines,
  TypedLine,
  type Voice,
} from './type';

type Lettering = BotanicalSaveTheDateProps['lettering'];

interface WordsProps {
  frame: number;
  cue: Cue;
  voice: Voice;
  lettering: Lettering;
  stagger: number;
}

export const Column = ({
  top,
  align = 'center',
  inset = 0,
  children,
}: {
  top: number;
  align?: 'center' | 'right';
  inset?: number;
  children: ReactNode;
}) => (
  <div
    style={{
      position: 'absolute',
      left: inset,
      right: inset,
      top,
      display: 'flex',
      flexDirection: 'column',
      alignItems: align === 'center' ? 'center' : 'flex-end',
      textAlign: align,
    }}
  >
    {children}
  </div>
);

export const Verse = ({
  text,
  frame,
  cue,
  voice,
  lettering,
  stagger,
  top,
}: WordsProps & { text: string; top: number }) => (
  <Column top={top}>
    {splitLines(text).map((line, index) => {
      const script = index % 2 === 1;
      return (
        <TypedLine
          key={`${index}:${line}`}
          text={line}
          frame={frame}
          cue={lineCue(cue, index, stagger)}
          color={script ? voice.accent : voice.ink}
          style={
            script
              ? { ...scriptStyle(voice, lettering.scriptSize), margin: '0 0 0.04em' }
              : { ...capsStyle(voice, lettering.capsSize), margin: '0.3em 0' }
          }
        />
      );
    })}
  </Column>
);

const saveWord = (voice: Voice, lettering: Lettering, opacity: number): CSSProperties => ({
  fontFamily: voice.display,
  fontSize: lettering.saveSize,
  fontWeight: lettering.saveWeight,
  lineHeight: 0.84,
  textTransform: 'uppercase',
  letterSpacing: '-0.01em',
  color: withAlpha(voice.ink, opacity),
  textShadow: `0 0.04em 0.12em ${withAlpha(voice.ink, 0.16 * opacity)}`,
});

export const SaveTheDate = ({
  frame,
  cue,
  voice,
  lettering,
  top,
  words,
}: WordsProps & {
  top: number;
  words: { top: string; joiner: string; bottom: string; date: string };
}) => {
  const big = fadeCue(frame, cue);
  const joiner = fadeCue(frame, cue, 9);
  const date = fadeCue(frame, cue, 14);
  return (
    <Column top={top}>
      <div
        style={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <div style={saveWord(voice, lettering, big)}>{words.top}</div>
        <div style={saveWord(voice, lettering, big)}>{words.bottom}</div>
        {words.joiner.length > 0 ? (
          <div
            style={{
              ...scriptStyle(voice, lettering.saveScriptSize),
              position: 'absolute',
              left: 0,
              right: 0,
              top: lettering.saveSize * 0.84 - lettering.saveScriptSize * 0.62,
              textAlign: 'center',
              color: withAlpha(voice.accent, joiner),
            }}
          >
            {words.joiner}
          </div>
        ) : null}
      </div>
      <div
        style={{
          ...capsStyle(voice, lettering.dateSize, 700, 0.03),
          marginTop: lettering.dateSize * 0.45,
          color: withAlpha(voice.ink, date),
        }}
      >
        {words.date}
      </div>
    </Column>
  );
};

export const Couple = ({
  frame,
  cue,
  voice,
  lettering,
  stagger,
  top,
  inset,
  words,
}: WordsProps & {
  top: number;
  inset: number;
  words: { intro: string; first: string; joiner: string; second: string };
}) => {
  const room = useVideoConfig().width - inset * 2;
  const capsWidth = (text: string) => Array.from(text).length * 0.74;
  const widest = Math.max(
    capsWidth(words.first),
    capsWidth(words.second) + Array.from(words.joiner).length * 0.42,
  );
  const size = Math.min(lettering.nameSize, room / Math.max(1, widest));
  const name: CSSProperties = {
    fontFamily: voice.display,
    fontSize: size,
    fontWeight: 400,
    lineHeight: 1,
    letterSpacing: '0.04em',
    textTransform: 'uppercase',
  };
  return (
    <Column top={top} align="right" inset={inset}>
      <TypedLine
        text={words.intro}
        frame={frame}
        cue={cue}
        color={voice.ink}
        style={{ ...capsStyle(voice, lettering.capsSize * 0.86), marginBottom: '0.5em' }}
      />
      <TypedLine
        text={words.first}
        frame={frame}
        cue={lineCue(cue, 1, stagger)}
        color={voice.ink}
        style={name}
      />
      <div style={{ display: 'flex', alignItems: 'baseline', marginTop: size * 0.12 }}>
        <TypedLine
          text={words.joiner}
          frame={frame}
          cue={lineCue(cue, 2, stagger)}
          color={voice.accent}
          style={{ ...scriptStyle(voice, size * 0.92), lineHeight: 1 }}
        />
        <TypedLine
          text={words.second}
          frame={frame}
          cue={lineCue(cue, 3, stagger)}
          color={voice.ink}
          style={name}
        />
      </div>
    </Column>
  );
};

export const Invitation = ({
  frame,
  cue,
  voice,
  lettering,
  stagger,
  top,
  words,
}: WordsProps & {
  top: number;
  words: {
    line: string;
    script: string;
    first: string;
    firstFamily: string;
    second: string;
    secondFamily: string;
  };
}) => {
  const small = capsStyle(voice, lettering.detailSize * 1.12);
  const name = { ...capsStyle(voice, lettering.titleSize, 700, 0.06), marginTop: '1.4em' };
  return (
    <Column top={top}>
      <TypedLine text={words.line} frame={frame} cue={cue} color={voice.muted} style={small} />
      <TypedLine
        text={words.script}
        frame={frame}
        cue={lineCue(cue, 1, stagger)}
        color={voice.accent}
        style={{ ...scriptStyle(voice, lettering.scriptSize * 0.9), marginTop: '0.3em' }}
      />
      <TypedLine
        text={words.first}
        frame={frame}
        cue={lineCue(cue, 2, stagger)}
        color={voice.ink}
        reveal="block"
        style={name}
      />
      <TypedLine
        text={words.firstFamily}
        frame={frame}
        cue={lineCue(cue, 3, stagger)}
        color={voice.muted}
        style={{ ...small, marginTop: '0.4em' }}
      />
      <TypedLine
        text={words.second}
        frame={frame}
        cue={lineCue(cue, 4, stagger)}
        color={voice.ink}
        reveal="block"
        style={name}
      />
      <TypedLine
        text={words.secondFamily}
        frame={frame}
        cue={lineCue(cue, 5, stagger)}
        color={voice.muted}
        style={{ ...small, marginTop: '0.4em' }}
      />
    </Column>
  );
};

export const EventWords = ({
  frame,
  cue,
  voice,
  lettering,
  stagger,
  top,
  event,
}: WordsProps & { top: number; event: { title: string; details: string; note: string } }) => {
  const details = splitLines(event.details);
  return (
    <Column top={top}>
      <TypedLine
        text={event.title}
        frame={frame}
        cue={cue}
        color={voice.ink}
        reveal="block"
        style={{ ...capsStyle(voice, lettering.titleSize, 700, 0.05), marginBottom: '0.45em' }}
      />
      {details.map((line, index) => (
        <TypedLine
          key={`${index}:${line}`}
          text={line}
          frame={frame}
          cue={lineCue(cue, index + 1, stagger)}
          color={voice.muted}
          style={capsStyle(voice, lettering.detailSize)}
        />
      ))}
      {event.note.length > 0 ? (
        <TypedLine
          text={event.note}
          frame={frame}
          cue={lineCue(cue, details.length + 2, stagger)}
          color={voice.muted}
          style={{ ...capsStyle(voice, lettering.detailSize * 0.84), marginTop: '1.2em' }}
        />
      ) : null}
    </Column>
  );
};
