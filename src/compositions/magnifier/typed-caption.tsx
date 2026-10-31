import type { MagnifierCaptionProps } from '@/schemas';
import { glide, tween } from '../promo/timing';
import { charOpacity, wordStart } from './choreography';

interface Glyph {
  char: string;
  order: number;
  id: string;
}

interface WordSlot {
  index: number;
  word: string;
  chars: Glyph[];
}

const bareWord = (word: string): string => word.toLowerCase().replace(/[^\p{L}\p{N}']/gu, '');

const Underline = ({
  frame,
  start,
  length,
  props,
}: {
  frame: number;
  start: number;
  length: number;
  props: MagnifierCaptionProps;
}) => {
  const { caption, timing, glow } = props;
  const drawFrom = start + caption.wordFrames * 0.4;
  const drawn = tween(frame, [drawFrom, drawFrom + caption.underlineFrames], [0, 1], glide);
  const fade = tween(
    frame,
    [
      timing.fadeOutFrame,
      timing.fadeOutFrame + (length - 1) * timing.fadeOutStagger + caption.charFade,
    ],
    [1, 0],
  );
  return (
    <span
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: '-0.15em',
        height: caption.underline,
        borderRadius: caption.underline,
        backgroundColor: glow.accent,
        boxShadow: `0 0 ${caption.underline * 3}px ${glow.accent}`,
        transform: `scaleX(${drawn})`,
        transformOrigin: 'left center',
        opacity: fade * Math.min(1, drawn * 4),
      }}
    />
  );
};

const lineWords = (text: string): WordSlot[][] => {
  let index = 0;
  return text.split('\n').map((line) =>
    line
      .split(/\s+/)
      .filter((word) => word.length > 0)
      .map((word) => {
        const slot = {
          index,
          word,
          chars: Array.from(word).map((char, order) => ({ char, order, id: `${index}-${order}` })),
        };
        index += 1;
        return slot;
      }),
  );
};

export const TypedCaption = ({
  frame,
  props,
  font,
}: {
  frame: number;
  props: MagnifierCaptionProps;
  font: string;
}) => {
  const { caption } = props;
  const accentWord = bareWord(props.glow.accentWord);
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        top: caption.top,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        fontFamily: font,
        fontSize: caption.size,
        fontWeight: caption.weight,
        lineHeight: caption.lineHeight,
        color: caption.color,
        whiteSpace: 'pre',
      }}
    >
      {lineWords(caption.text).map((words) => (
        <div key={words.map((word) => `${word.index}`).join('-')}>
          {words.map((word, position) => {
            const start = wordStart(word.index, props.timing);
            const accent = accentWord.length > 0 && bareWord(word.word) === accentWord;
            return (
              <span key={word.index}>
                {position > 0 ? ' ' : ''}
                <span
                  style={{
                    position: 'relative',
                    color: accent ? props.glow.accentText : undefined,
                  }}
                >
                  {accent && caption.underline > 0 ? (
                    <Underline
                      frame={frame}
                      start={start}
                      length={word.chars.length}
                      props={props}
                    />
                  ) : null}
                  {word.chars.map((glyph) => (
                    <span
                      key={glyph.id}
                      style={{
                        opacity: charOpacity(frame, start, glyph.order, word.chars.length, props),
                      }}
                    >
                      {glyph.char}
                    </span>
                  ))}
                </span>
              </span>
            );
          })}
        </div>
      ))}
    </div>
  );
};
