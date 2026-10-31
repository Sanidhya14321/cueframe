import { Composition, useCurrentFrame, useVideoConfig } from 'remotion';
import {
  type HandwrittenNoteProps,
  handwrittenNoteDefaults,
  handwrittenNoteMeta,
  handwrittenNoteSchema,
} from '@/schemas';
import { Handwriting } from '../../promo/handwriting';
import { PromoLayer, placementFrame } from '../../promo/promo-layer';
import type { SceneModule } from '../../scene-module';

const ERASE_MARGIN = 2;

export const HandwrittenNote = ({
  text,
  highlight,
  font,
  size,
  lineHeight,
  tilt,
  placement,
  delay,
  charFrames,
  charStagger,
  wordPause,
  jitter,
  underline,
  burst,
  erase,
  eraseFrames,
  seed,
  ink,
  look,
  motion,
}: HandwrittenNoteProps) => {
  const frame = useCurrentFrame() * motion.speed;
  const { durationInFrames } = useVideoConfig();
  const end = durationInFrames * motion.speed;
  return (
    <PromoLayer look={look} motion={motion}>
      <div style={placementFrame(placement)}>
        <div
          style={{
            width: placement.width,
            willChange: 'transform',
            transform: `translate(${(Math.cos(frame / 32) * motion.float * 60).toFixed(3)}px, ${(Math.sin(frame / 32) * motion.float * 60).toFixed(3)}px) rotate(${(tilt + Math.sin(frame / 48) * motion.float * 6).toFixed(4)}deg)`,
          }}
        >
          <Handwriting
            text={text}
            highlight={highlight}
            font={font}
            size={size}
            lineHeight={lineHeight}
            color={look.ink}
            accent={look.accent}
            align={placement.horizontal}
            frame={frame}
            start={delay}
            charFrames={charFrames}
            charStagger={charStagger}
            wordPause={wordPause}
            jitter={jitter}
            ink={ink}
            underline={underline}
            burst={burst}
            eraseStart={erase ? end - eraseFrames - ERASE_MARGIN : end}
            eraseFrames={eraseFrames}
            seed={seed}
          />
        </div>
      </div>
    </PromoLayer>
  );
};

export const handwrittenNoteScene: SceneModule = {
  id: 'handwritten-note',
  component: HandwrittenNote,
  render: (key) => (
    <Composition
      key={key}
      id="handwritten-note"
      component={HandwrittenNote}
      schema={handwrittenNoteSchema}
      defaultProps={handwrittenNoteDefaults}
      durationInFrames={handwrittenNoteMeta.durationInFrames}
      fps={handwrittenNoteMeta.fps}
      width={handwrittenNoteMeta.width}
      height={handwrittenNoteMeta.height}
    />
  ),
};
