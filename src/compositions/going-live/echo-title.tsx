import { AbsoluteFill } from 'remotion';
import type { GoingLiveTeaserProps } from '@/schemas';
import { splitLines } from './beat';
import { headlineStyle, type TeaserType } from './zoom-word';

type EchoCues = {
  at: number;
  flash: number;
  big: number;
  echo: number;
  end: number;
};

const Block = ({
  lines,
  type,
  lineHeight,
  color,
  scale = 1,
  shadow,
}: {
  lines: string[];
  type: TeaserType;
  lineHeight: number;
  color: string;
  scale?: number;
  shadow?: string | undefined;
}) => (
  <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
    <div
      style={{
        ...headlineStyle(type),
        lineHeight,
        color,
        textShadow: shadow,
        transform: scale < 0.9999 ? `scale(${scale.toFixed(4)})` : undefined,
      }}
    >
      {lines.join('\n')}
    </div>
  </AbsoluteFill>
);

const echoStep = (frame: number, cues: EchoCues, echo: GoingLiveTeaserProps['echo']): number =>
  frame < cues.echo
    ? 0
    : Math.min(echo.steps, Math.floor((frame - cues.echo) / echo.stepFrames) + 1) / echo.steps;

const layerColor = (index: number, count: number, look: GoingLiveTeaserProps['look']): string => {
  if (index === count - 1) {
    return look.ink;
  }
  return index % 2 === 0 ? look.accent : look.echoTint;
};

export const EchoTitle = ({
  frame,
  text,
  cues,
  smallType,
  bigType,
  lineHeight,
  look,
  echo,
}: {
  frame: number;
  text: string;
  cues: EchoCues;
  smallType: TeaserType;
  bigType: TeaserType;
  lineHeight: number;
  look: GoingLiveTeaserProps['look'];
  echo: GoingLiveTeaserProps['echo'];
}) => {
  if (frame < cues.at || frame >= cues.end) {
    return null;
  }
  const lines = splitLines(text);
  if (frame < cues.flash) {
    return <Block lines={lines} type={smallType} lineHeight={lineHeight} color={look.accent} />;
  }
  if (frame < cues.big) {
    return (
      <AbsoluteFill style={{ background: look.flash }}>
        <Block lines={lines} type={smallType} lineHeight={lineHeight} color={look.flashInk} />
      </AbsoluteFill>
    );
  }
  const step = echoStep(frame, cues, echo);
  if (step === 0) {
    return <Block lines={lines} type={bigType} lineHeight={lineHeight} color={look.accent} />;
  }
  const count = Math.max(2, 2 * Math.round((echo.layers * step) / 2));
  const front = 1 - (1 - echo.frontScale) * step;
  const shadow = `${echo.shadow}em ${echo.shadow}em 0 ${look.shadow}, ${echo.shadow * 0.5}em ${echo.shadow * 0.5}em ${echo.shadow}em ${look.shadow}`;
  return (
    <AbsoluteFill>
      {Array.from({ length: count }, (_, index) => (
        <Block
          key={index}
          lines={lines}
          type={bigType}
          lineHeight={lineHeight}
          color={layerColor(index, count, look)}
          scale={1 - ((1 - front) * index) / (count - 1)}
          shadow={index === 0 ? undefined : shadow}
        />
      ))}
    </AbsoluteFill>
  );
};
