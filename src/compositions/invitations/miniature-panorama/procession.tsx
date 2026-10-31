import { Elephant } from './elephant';
import { darken, lighten, type Paint } from './palette';
import { circle, fx } from './shapes';

type Procession = Paint['procession'];

const ROLES = ['horn', 'drum', 'flag', 'horn', 'umbrella', 'drum', 'staff', 'flag'] as const;

type Role = (typeof ROLES)[number];

const STRIDE = 46;

const WALKER_GAP = 112;

const ELEPHANT_GAP = 330;

const Held = ({ role, procession, beat }: { role: Role; procession: Procession; beat: number }) => {
  const { trim, blanket, howdah, kurta } = procession;
  if (role === 'horn') {
    return (
      <path
        d="M-10 -118Q-40 -150 -30 -190Q-26 -204 -16 -200Q-24 -160 -4 -126Z"
        fill={howdah}
        stroke={darken(howdah, 0.35)}
        strokeWidth={1}
      />
    );
  }
  if (role === 'drum') {
    return (
      <g transform={`translate(0 ${fx(beat * 2)})`}>
        <rect
          x={-30}
          y={-108}
          width={46}
          height={30}
          rx={13}
          fill={blanket}
          stroke={darken(blanket, 0.35)}
          strokeWidth={1}
        />
        <path d="M-24 -108L-24 -78M10 -108L10 -78M-30 -93L16 -93" stroke={trim} strokeWidth={2} />
        <path
          d={`M-34 -120L${fx(-46 + beat * 6)} -104`}
          stroke={darken(kurta, 0.6)}
          strokeWidth={2.4}
        />
      </g>
    );
  }
  if (role === 'umbrella') {
    return (
      <g>
        <path d="M-12 -110L-12 -246" stroke={darken(howdah, 0.3)} strokeWidth={3} />
        <path d="M-62 -232Q-12 -290 38 -232Z" fill={blanket} stroke={trim} strokeWidth={3} />
        <path d="M-62 -232L38 -232" stroke={trim} strokeWidth={5} strokeDasharray="4 4" />
      </g>
    );
  }
  if (role === 'flag') {
    return (
      <g>
        <path d="M-14 -108L-14 -250" stroke={darken(howdah, 0.3)} strokeWidth={3} />
        <path
          d={`M-14 -248Q${fx(-44 + beat * 3)} -238 -60 -226L-14 -206Z`}
          fill={howdah}
          stroke={darken(howdah, 0.3)}
          strokeWidth={1}
        />
      </g>
    );
  }
  return <path d="M-16 -100L-22 -230" stroke={lighten(trim, 0.2)} strokeWidth={4} />;
};

const Walker = ({
  role,
  walk,
  procession,
}: {
  role: Role;
  walk: number;
  procession: Procession;
}) => {
  const { kurta, turban, skin, trim } = procession;
  const swing = Math.sin(walk) * 20;
  const bob = Math.abs(Math.cos(walk)) * 3;
  const outline = darken(kurta, 0.35);
  return (
    <g>
      <ellipse cx={0} cy={3} rx={30} ry={6} fill={darken(kurta, 0.8)} opacity={0.2} />
      {[swing, -swing].map((angle, index) => (
        <g key={index} transform={`rotate(${fx(angle)} 0 -66)`}>
          <path
            d="M-6 -70L-5 -4L5 -4L6 -70Z"
            fill={index === 0 ? darken(kurta, 0.12) : kurta}
            stroke={outline}
            strokeWidth={0.8}
          />
          <path d="M-8 -6L-14 2L6 2L6 -6Z" fill={darken(turban, 0.5)} />
        </g>
      ))}
      <g transform={`translate(0 ${fx(-bob)})`}>
        <path d="M-15 -140L15 -140L28 -60L-30 -60Z" fill={kurta} stroke={outline} strokeWidth={1} />
        <path d="M-15 -140L-6 -140L-14 -60L-30 -60Z" fill={darken(kurta, 0.08)} />
        <path d="M-17 -104L19 -104L20 -94L-18 -94Z" fill={turban} />
        <path d="M14 -98L22 -70L16 -68L10 -94Z" fill={turban} />
        <path d="M-12 -110L12 -138" stroke={trim} strokeWidth={2} />
        <path
          d={`M-10 -136Q${fx(-26 - swing * 0.4)} -116 -30 -104`}
          fill="none"
          stroke={kurta}
          strokeWidth={9}
          strokeLinecap="round"
        />
        <Held role={role} procession={procession} beat={Math.sin(walk * 2)} />
        <path
          d={`M8 -136Q${fx(18 + swing * 0.4)} -112 12 -96`}
          fill="none"
          stroke={darken(kurta, 0.1)}
          strokeWidth={8}
          strokeLinecap="round"
        />
        <path d={circle(-2, -153, 11)} fill={skin} stroke={darken(skin, 0.3)} strokeWidth={0.8} />
        <path d="M-11 -154L-16 -148L-11 -147Z" fill={skin} />
        <path
          d="M-11 -143Q-6 -138 2 -141Q6 -143 7 -149Q1 -144 -4 -143Q-8 -143 -11 -143Z"
          fill={darken(skin, 0.65)}
        />
        <path
          d="M-13 -145Q-9 -147.5 -5 -144.5"
          fill="none"
          stroke={darken(skin, 0.65)}
          strokeWidth={2}
          strokeLinecap="round"
        />
        <path
          d="M-15 -158Q-14 -178 2 -176Q16 -174 12 -158Z"
          fill={turban}
          stroke={darken(turban, 0.3)}
          strokeWidth={1}
        />
        <path d="M10 -164L24 -150L18 -146L8 -158Z" fill={turban} />
        <path d="M-14 -162L12 -166" stroke={trim} strokeWidth={2} />
        <path d={circle(-8, -152, 1.6)} fill={darken(skin, 0.7)} />
      </g>
    </g>
  );
};

export const Procession = ({
  x,
  y,
  travelled,
  procession,
}: {
  x: number;
  y: number;
  travelled: number;
  procession: Procession;
}) => {
  const walk = (travelled / STRIDE) * Math.PI;
  const members: { kind: 'walker' | 'elephant'; offset: number; role: Role; index: number }[] = [];
  let offset = 0;
  for (let index = 0; index < procession.walkers; index += 1) {
    if (index === 1) {
      offset += ELEPHANT_GAP;
      members.push({ kind: 'elephant', offset, role: 'horn', index: -1 });
      offset += ELEPHANT_GAP;
    }
    members.push({ kind: 'walker', offset, role: ROLES[index % ROLES.length] ?? 'horn', index });
    offset += WALKER_GAP;
  }
  if (procession.walkers <= 1) {
    members.push({ kind: 'elephant', offset: offset + ELEPHANT_GAP, role: 'horn', index: -1 });
  }
  return (
    <g transform={`translate(${fx(x)} ${y}) scale(${procession.scale})`}>
      {members.map((member) => (
        <g
          key={`${member.kind}-${member.index}`}
          transform={`translate(${member.offset} ${member.index % 2 === 0 ? 0 : 10})`}
        >
          {member.kind === 'elephant' ? (
            <Elephant walk={walk * 0.5} procession={procession} />
          ) : (
            <Walker role={member.role} walk={walk + member.index * 0.9} procession={procession} />
          )}
        </g>
      ))}
    </g>
  );
};
