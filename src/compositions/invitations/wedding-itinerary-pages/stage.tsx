import type { ReactNode } from 'react';
import { pixelTween, settle, tween } from '../../promo/timing';
import { type Art, fill, gid } from './art';
import { dark, ellipsePath, HEIGHT, Linear, light, memo, mix, random, WIDTH } from './paint';

export type Stage = {
  art: Art;
  local: number;
  build: number;
  frames: number;
};

type From = 'bottom' | 'top' | 'left' | 'right' | 'fade';

const STAGGER = 0.14;

export const Layer = ({
  stage,
  order,
  from,
  distance,
  children,
}: {
  stage: Stage;
  order: number;
  from: From;
  distance: number;
  children: ReactNode;
}) => {
  const begin = order * stage.frames * STAGGER;
  const away = tween(stage.local, [begin, begin + stage.frames], [1, 0], settle);
  const offset = pixelTween(
    stage.local,
    [begin, begin + stage.frames],
    [distance * stage.build, 0],
    settle,
  );
  const x = from === 'left' ? -offset : from === 'right' ? offset : 0;
  const y = from === 'bottom' || from === 'fade' ? offset : from === 'top' ? -offset : 0;
  const opacity = from === 'fade' ? Math.min(0.999, 1 - away * Math.min(1, stage.build)) : 1;
  if (opacity <= 0.001) {
    return null;
  }
  return (
    <g
      transform={`translate(${x.toFixed(2)} ${y.toFixed(2)})`}
      opacity={from === 'fade' ? opacity.toFixed(4) : undefined}
    >
      {children}
    </g>
  );
};

export const Sky = ({ art, wash }: { art: Art; wash: number }) => {
  const blots = memo(`wash|${art.sky}`, () => {
    const rand = random(17);
    let soft = '';
    let deep = '';
    for (let index = 0; index < 26; index++) {
      const blot = ellipsePath(
        rand() * WIDTH,
        rand() * HEIGHT * 0.8,
        80 + rand() * 220,
        40 + rand() * 110,
      );
      if (index % 2 === 0) {
        soft += blot;
      } else {
        deep += blot;
      }
    }
    return { soft, deep };
  });
  return (
    <g>
      <defs>
        <Linear
          id={gid(art, 'sky')}
          stops={[
            [0, art.sky],
            [0.55, mix(art.sky, art.horizon, 0.45)],
            [1, art.horizon],
          ]}
        />
      </defs>
      <rect x={0} y={0} width={WIDTH} height={HEIGHT} fill={fill(art, 'sky')} />
      {wash > 0 ? (
        <g>
          <path d={blots.soft} fill={light(art.sky, 0.5)} opacity={wash * 0.35} />
          <path d={blots.deep} fill={dark(art.sky, 0.08)} opacity={wash * 0.3} />
        </g>
      ) : null}
    </g>
  );
};

export const cameraDrift = (stage: Stage, drift: number): string => {
  const offset = pixelTween(stage.local, [0, stage.frames * 1.4], [drift, 0], settle);
  return `translate(0 ${offset})`;
};
