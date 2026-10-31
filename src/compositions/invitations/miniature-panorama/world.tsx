import type { ReactNode } from 'react';
import {
  type Cam,
  FRAME_HEIGHT,
  FRAME_WIDTH,
  frameTransform,
  layerTransform,
  type WorldView,
} from './camera';
import { Defs, type Ids } from './defs';
import type { Paint } from './palette';

const LAYER = { position: 'absolute', left: 0, top: 0 } as const;

const BLUR_MARGIN = 320;

export const World = ({
  ids,
  paint,
  view,
  blur,
  children,
}: {
  ids: Ids;
  paint: Paint;
  view: WorldView;
  blur: { x: number; y: number };
  children: ReactNode;
}) => {
  if (!view.visible) {
    return null;
  }
  const blurred = blur.x > 0.05 || blur.y > 0.05;
  const margin = BLUR_MARGIN + Math.max(blur.x, blur.y) * 3;
  return (
    <svg
      width={FRAME_WIDTH}
      height={FRAME_HEIGHT}
      viewBox={`0 0 ${FRAME_WIDTH} ${FRAME_HEIGHT}`}
      style={{ ...LAYER, opacity: view.opacity }}
      aria-hidden="true"
    >
      <defs>
        <Defs ids={ids} paint={paint} />
        {blurred ? (
          <filter
            id={ids.id('blur')}
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
            x={-view.pushX - margin}
            y={-view.pushY - margin}
            width={FRAME_WIDTH + margin * 2}
            height={FRAME_HEIGHT + margin * 2}
          >
            <feGaussianBlur stdDeviation={`${blur.x.toFixed(2)} ${blur.y.toFixed(2)}`} />
          </filter>
        ) : null}
      </defs>
      <g transform={frameTransform(view)}>
        <g filter={blurred ? ids.url('blur') : undefined}>{children}</g>
      </g>
    </svg>
  );
};

export const Layer = ({
  cam,
  depth,
  parallax,
  children,
}: {
  cam: Cam;
  depth: number;
  parallax: number;
  children: ReactNode;
}) => <g transform={layerTransform(cam, depth, parallax)}>{children}</g>;
