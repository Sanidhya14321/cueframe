import '@fontsource/inter/700.css';
import '@fontsource/instrument-serif/400.css';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import type { WebMotionProps } from '@/schemas/clips/imported/common';
import { MotionCards } from './cards';
import { MotionSurface } from './surfaces';
import { TextEffects } from './text-effects';
export const WebMotion = ({ variant, ...props }: WebMotionProps & { variant: number }) => {
  const current = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const frame = Math.max(0, (current - props.delay) * props.speed);
  const scale = Math.min(width / 1920, height / 1080);
  const size = Math.min(props.size, width / (props.text.length * 0.57));
  const style = {
    fontFamily: `${props.font}, sans-serif`,
    fontSize: size,
    fontWeight: props.font === 'Inter' ? 700 : 400,
    lineHeight: 1.12,
    letterSpacing: '-0.045em',
    color: props.textColor,
    textAlign: 'center' as const,
    maxWidth: '100%',
    overflowWrap: 'anywhere' as const,
  };
  const card = [9, 10, 17, 19, 20, 21].includes(variant);
  return (
    <AbsoluteFill style={{ background: props.background, overflow: 'hidden' }}>
      <AbsoluteFill>
        <MotionSurface
          variant={variant}
          frame={frame}
          props={props}
          width={width}
          height={height}
        />
      </AbsoluteFill>
      <AbsoluteFill
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: `${70 * scale}px`,
          fontSize: size,
        }}
      >
        {card ? (
          <MotionCards variant={variant} frame={frame} props={props} style={style} />
        ) : (
          <TextEffects variant={variant} frame={frame} props={props} style={style} />
        )}
      </AbsoluteFill>
      <div
        style={{
          position: 'absolute',
          left: '8%',
          right: '8%',
          bottom: '9%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontFamily: 'Inter, sans-serif',
          fontSize: Math.max(14, 22 * scale),
          color: props.textColor,
          opacity: 0.55,
        }}
      >
        <span>{props.subtitle}</span>
        <span style={{ width: 40 * scale, height: 3, background: props.primary }} />
      </div>
    </AbsoluteFill>
  );
};
