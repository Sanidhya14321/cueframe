import { AbsoluteFill } from 'remotion';
import type { HangingWordsProps } from '@/schemas';
import { progress } from './physics';

const WIDTH = 1080;
const HEIGHT = 1920;

const coverage = (props: HangingWordsProps, frame: number): number => {
  const { drop } = props;
  if (frame < drop.liftStart) {
    return progress(frame, drop.fallStart, drop.fallFrames);
  }
  return 1 - progress(frame, drop.liftStart, drop.liftFrames);
};

const diamondShape = (amount: number, width: number, centerY: number): string | undefined => {
  if (amount >= 1) {
    return undefined;
  }
  const centerX = WIDTH / 2;
  const reach = (centerX / width + Math.max(centerY, HEIGHT - centerY)) * 1.04;
  const eased = 1 - (1 - amount) ** 2;
  const vertical = eased * reach;
  const horizontal = vertical * width;
  const point = (x: number, y: number) => `${x.toFixed(1)}px ${y.toFixed(1)}px`;
  return `polygon(${[
    point(centerX, centerY - vertical),
    point(centerX + horizontal, centerY),
    point(centerX, centerY + vertical),
    point(centerX - horizontal, centerY),
  ].join(', ')})`;
};

export const inkCovers = (props: HangingWordsProps, frame: number): boolean =>
  coverage(props, frame) >= 1;

export const InkDrop = ({ props, frame }: { props: HangingWordsProps; frame: number }) => {
  const amount = coverage(props, frame);
  if (amount <= 0) {
    return null;
  }
  return (
    <AbsoluteFill
      style={{
        background: props.palette.night,
        clipPath: diamondShape(amount, props.drop.width, props.knot.y),
      }}
    />
  );
};
