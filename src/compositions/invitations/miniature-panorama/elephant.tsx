import { memo } from 'react';
import { darken, lighten, type Paint } from './palette';
import { circle, fx, scallop } from './shapes';

type Procession = Paint['procession'];

const LEGS = [
  { x: -95, phase: Math.PI, back: true },
  { x: 70, phase: 0, back: true },
  { x: -70, phase: 0, back: false },
  { x: 95, phase: Math.PI, back: false },
] as const;

const Leg = ({
  x,
  swing,
  color,
  trim,
}: {
  x: number;
  swing: number;
  color: string;
  trim: string;
}) => (
  <g transform={`rotate(${fx(swing)} ${x} -110)`}>
    <path
      d={`M${x - 19} -120L${x - 17} -6Q${x} 2 ${x + 17} -6L${x + 19} -120Z`}
      fill={color}
      stroke={darken(color, 0.35)}
      strokeWidth={1.4}
    />
    <rect x={x - 19} y={-30} width={38} height={7} fill={trim} />
    <path
      d={`${circle(x - 9, -4, 3.4)}${circle(x, -2, 3.4)}${circle(x + 9, -4, 3.4)}`}
      fill={lighten(color, 0.6)}
    />
  </g>
);

const BlanketBody = memo(({ procession }: { procession: Procession }) => {
  const { blanket, trim, howdah, elephant } = procession;
  const panel = 'M-104 -236L104 -236L110 -128L-110 -128Z';
  return (
    <g>
      <path d={panel} fill={blanket} stroke={darken(blanket, 0.35)} strokeWidth={1.5} />
      <path d="M-92 -226L92 -226L96 -140L-96 -140Z" fill="none" stroke={trim} strokeWidth={6} />
      <path
        d="M-60 -206L0 -186L60 -206L60 -158L0 -176L-60 -158Z"
        fill={darken(blanket, 0.2)}
        stroke={trim}
        strokeWidth={2}
      />
      <path d={[-48, -24, 0, 24, 48].map((dx) => circle(dx, -182, 4)).join('')} fill={trim} />
      <path d={`${scallop(-110, 110, -128, 14, 14)}L110 -128Z`} fill={trim} />
      <path
        d={Array.from(
          { length: 16 },
          (_, index) => `M${-105 + index * 14} -118L${-105 + index * 14} -104`,
        ).join('')}
        stroke={darken(trim, 0.2)}
        strokeWidth={2}
      />
      <path
        d="M-84 -236L84 -236L78 -300L-78 -300Z"
        fill={howdah}
        stroke={darken(howdah, 0.35)}
        strokeWidth={1.5}
      />
      <path d="M-74 -250L74 -250M-70 -284L70 -284" stroke={lighten(howdah, 0.5)} strokeWidth={3} />
      <path d={[-50, -25, 0, 25, 50].map((dx) => circle(dx, -267, 5)).join('')} fill={blanket} />
      <path d="M-60 -300Q-62 -340 -34 -344L34 -344Q62 -340 60 -300Z" fill={blanket} />
      <path
        d="M-70 -344L70 -344M-64 -300L-64 -380M64 -300L64 -380"
        stroke={howdah}
        strokeWidth={5}
      />
      <path
        d="M-78 -378Q0 -440 78 -378Z"
        fill={howdah}
        stroke={darken(howdah, 0.35)}
        strokeWidth={1.5}
      />
      <path d="M-4 -412L0 -440L4 -412Z" fill={howdah} />
      <path d={circle(0, -442, 6)} fill={blanket} />
      <path
        d="M110 -200Q132 -180 128 -120"
        fill="none"
        stroke={darken(elephant, 0.3)}
        strokeWidth={3}
      />
    </g>
  );
});

export const Elephant = ({ walk, procession }: { walk: number; procession: Procession }) => {
  const { elephant, trim, kurta, turban, skin } = procession;
  const outline = darken(elephant, 0.4);
  const back = darken(elephant, 0.22);
  const bob = Math.sin(walk * 2) * 2.2;
  const trunk = Math.sin(walk * 0.5) * 5;
  return (
    <g>
      <ellipse cx={0} cy={4} rx={150} ry={12} fill={darken(elephant, 0.6)} opacity={0.25} />
      {LEGS.filter((leg) => leg.back).map((leg) => (
        <Leg
          key={leg.x}
          x={leg.x}
          swing={Math.sin(walk + leg.phase) * 9}
          color={back}
          trim={darken(trim, 0.2)}
        />
      ))}
      <g transform={`translate(0 ${fx(bob)})`}>
        <path
          d="M140 -128C150 -210 70 -246 -40 -244C-112 -242 -152 -206 -150 -156C-148 -118 -120 -100 -84 -100L116 -100C136 -100 142 -112 140 -128Z"
          fill={elephant}
          stroke={outline}
          strokeWidth={1.6}
        />
        <path
          d={`M-150 -170C-176 -168 -206 -176 -214 -150C-222 -110 -220 -60 -${fx(214 - trunk)} -30Q-${fx(220 - trunk)} -12 -${fx(204 - trunk)} -14Q-${fx(196 - trunk)} -22 -${fx(202 - trunk)} -34C-198 -70 -196 -110 -186 -140Z`}
          fill={elephant}
          stroke={outline}
          strokeWidth={1.5}
        />
        <path
          d="M-210 -120Q-206 -116 -202 -120M-212 -100Q-207 -96 -202 -100M-212 -80Q-207 -76 -202 -80M-210 -60Q-205 -56 -200 -60"
          fill="none"
          stroke={outline}
          strokeWidth={1.2}
        />
        <path
          d="M-196 -146C-212 -136 -226 -124 -232 -104L-224 -102C-214 -120 -204 -130 -188 -138Z"
          fill={lighten(elephant, 0.75)}
          stroke={outline}
          strokeWidth={1}
        />
        <ellipse
          cx={-168}
          cy={-196}
          rx={50}
          ry={46}
          fill={elephant}
          stroke={outline}
          strokeWidth={1.5}
        />
        <path
          d="M-150 -232C-112 -240 -96 -200 -104 -160C-110 -128 -136 -122 -150 -140C-160 -170 -164 -210 -150 -232Z"
          fill={darken(elephant, 0.12)}
          stroke={outline}
          strokeWidth={1.4}
        />
        <path
          d="M-146 -222C-118 -226 -106 -196 -112 -164C-116 -140 -134 -134 -144 -148"
          fill="none"
          stroke={procession.blanket}
          strokeWidth={4}
        />
        <path
          d="M-194 -236Q-172 -250 -150 -236L-156 -170Q-170 -150 -186 -170Z"
          fill={trim}
          stroke={darken(trim, 0.35)}
          strokeWidth={1.2}
        />
        <path
          d={`${circle(-172, -222, 6)}${circle(-172, -198, 5)}${circle(-172, -178, 4)}`}
          fill={procession.blanket}
        />
        <path d="M-212 -132L-190 -128M-214 -100L-196 -96" stroke={trim} strokeWidth={4} />
        <path d={circle(-198, -194, 3.2)} fill={darken(elephant, 0.75)} />
        <BlanketBody procession={procession} />
        <g transform="translate(-118 -244)">
          <path
            d="M-14 0L14 0L18 -44L-18 -44Z"
            fill={kurta}
            stroke={darken(kurta, 0.25)}
            strokeWidth={1}
          />
          <path d="M-18 -2L-22 22L-8 24L-4 0Z" fill={kurta} />
          <path d={circle(0, -55, 10)} fill={skin} />
          <path d="M-12 -60Q0 -80 12 -60L12 -56L-12 -56Z" fill={turban} />
          <path d="M14 -40L40 -60" stroke={trim} strokeWidth={3} />
        </g>
      </g>
      {LEGS.filter((leg) => !leg.back).map((leg) => (
        <Leg
          key={leg.x}
          x={leg.x}
          swing={Math.sin(walk + leg.phase) * 9}
          color={elephant}
          trim={trim}
        />
      ))}
    </g>
  );
};
