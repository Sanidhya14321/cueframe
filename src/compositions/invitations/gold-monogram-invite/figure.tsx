import { type Build, type Pose, poseAt, shapeFigure } from './figure-rig';
import { withAlpha } from './gold';

export type FigureLook = {
  ink: string;
  second: string | null;
  fill: string;
  fillOpacity: number;
  width: number;
  draw: number;
};

const dash = (draw: number) =>
  draw >= 0.999 ? undefined : `${Math.max(0.0001, draw).toFixed(4)} 2`;

const Part = ({ d, look }: { d: string; look: FigureLook }) => (
  <>
    <path
      d={d}
      fill={look.fill}
      fillOpacity={look.fillOpacity * Math.min(1, look.draw * 1.6)}
      stroke={look.ink}
      strokeWidth={look.width}
      strokeLinejoin="round"
      strokeLinecap="round"
      pathLength={1}
      strokeDasharray={dash(look.draw)}
    />
    {look.second === null ? null : (
      <path
        d={d}
        transform="translate(1.6 -1.4)"
        fill="none"
        stroke={look.second}
        strokeOpacity={0.55}
        strokeWidth={look.width * 0.55}
        strokeLinecap="round"
        pathLength={1}
        strokeDasharray={dash(look.draw * 0.94)}
      />
    )}
    <path
      d={d}
      transform="translate(-0.9 0.8)"
      fill="none"
      stroke={look.ink}
      strokeOpacity={0.35}
      strokeWidth={look.width * 0.6}
      strokeLinecap="round"
      pathLength={1}
      strokeDasharray={dash(look.draw * 0.97)}
    />
  </>
);

export const Figure = ({ pose, build, look }: { pose: Pose; build: Build; look: FigureLook }) => {
  const shape = shapeFigure(pose, build);
  return (
    <g>
      <Part d={shape.backArm} look={look} />
      {shape.legs.map((leg, index) => (
        <Part key={index.toString()} d={leg} look={look} />
      ))}
      {shape.skirt === '' ? null : <Part d={shape.skirt} look={look} />}
      <Part d={shape.body} look={look} />
      <Part d={shape.head} look={look} />
      <Part d={shape.hair} look={look} />
      <Part d={shape.details} look={{ ...look, fillOpacity: 0, width: look.width * 0.8 }} />
      <Part d={shape.frontArm} look={look} />
    </g>
  );
};

export const FloorShadow = ({ x, width, color }: { x: number; width: number; color: string }) => (
  <ellipse cx={x} cy={8} rx={width} ry={width * 0.09} fill={withAlpha(color, 0.18)} />
);

export const Couple = ({
  beat,
  man,
  woman,
  manLook,
  womanLook,
  builds,
}: {
  beat: number;
  man: Pose[];
  woman: Pose[];
  manLook: FigureLook;
  womanLook: FigureLook;
  builds: { man: Build; woman: Build };
}) => (
  <>
    <Figure pose={poseAt(man, beat)} build={builds.man} look={manLook} />
    <Figure pose={poseAt(woman, beat)} build={builds.woman} look={womanLook} />
  </>
);
