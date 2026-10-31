import { type Point, pt, teardrop } from './ornament';

export type Pose = {
  hip: Point;
  chest: Point;
  head: Point;
  backElbow: Point;
  backHand: Point;
  frontElbow: Point;
  frontHand: Point;
  backKnee: Point;
  backFoot: Point;
  frontKnee: Point;
  frontFoot: Point;
  sway: number;
};

export type Build = {
  facing: 1 | -1;
  dress: boolean;
  shoulder: number;
  waist: number;
  hips: number;
  arm: [number, number, number];
  leg: [number, number, number];
  head: [number, number];
};

const KEYS = [
  'hip',
  'chest',
  'head',
  'backElbow',
  'backHand',
  'frontElbow',
  'frontHand',
  'backKnee',
  'backFoot',
  'frontKnee',
  'frontFoot',
] as const;

const flatten = (pose: Pose): number[] => [...KEYS.flatMap((key) => pose[key]), pose.sway];

const unflatten = (values: number[]): Pose => {
  const read = (index: number): Point => [values[index * 2] ?? 0, values[index * 2 + 1] ?? 0];
  const entries = KEYS.map((key, index) => [key, read(index)] as const);
  return { ...Object.fromEntries(entries), sway: values[KEYS.length * 2] ?? 0 } as Pose;
};

const catmull = (a: number, b: number, c: number, d: number, t: number): number =>
  0.5 *
  (2 * b +
    (-a + c) * t +
    (2 * a - 5 * b + 4 * c - d) * t * t +
    (-a + 3 * b - 3 * c + d) * t * t * t);

export const poseAt = (poses: Pose[], beat: number): Pose => {
  const count = poses.length;
  const base = Math.floor(beat);
  const t = beat - base;
  const pick = (offset: number): number[] => {
    const pose = poses[(((base + offset) % count) + count) % count];
    return pose === undefined ? [] : flatten(pose);
  };
  const [a, b, c, d] = [pick(-1), pick(0), pick(1), pick(2)];
  return unflatten(
    b.map((value, index) =>
      catmull(a[index] ?? value, value, c[index] ?? value, d[index] ?? value, t),
    ),
  );
};

const sub = ([ax, ay]: Point, [bx, by]: Point): Point => [ax - bx, ay - by];
const add = ([ax, ay]: Point, [bx, by]: Point, scale = 1): Point => [
  ax + bx * scale,
  ay + by * scale,
];
const unit = ([x, y]: Point): Point => {
  const length = Math.hypot(x, y) || 1;
  return [x / length, y / length];
};
const perp = ([x, y]: Point): Point => [-y, x];
const lerp = (a: Point, b: Point, t: number): Point => [
  a[0] + (b[0] - a[0]) * t,
  a[1] + (b[1] - a[1]) * t,
];

export const curve = (points: Point[], closed: boolean): string => {
  const count = points.length;
  const at = (index: number): Point => {
    const wrapped = closed
      ? ((index % count) + count) % count
      : Math.max(0, Math.min(count - 1, index));
    return points[wrapped] ?? [0, 0];
  };
  const first = points[0];
  if (first === undefined) {
    return '';
  }
  const segments = Array.from({ length: closed ? count : count - 1 }, (_, index) => {
    const p0 = at(index - 1);
    const p1 = at(index);
    const p2 = at(index + 1);
    const p3 = at(index + 2);
    const c1 = add(p1, sub(p2, p0), 1 / 6);
    const c2 = add(p2, sub(p3, p1), -1 / 6);
    return `C ${pt(c1)} ${pt(c2)} ${pt(p2)}`;
  });
  return `M ${pt(first)} ${segments.join(' ')}${closed ? ' Z' : ''}`;
};

const limb = (joints: Point[], widths: number[]): string => {
  const normals = joints.map((joint, index) => {
    const before = joints[Math.max(0, index - 1)] ?? joint;
    const after = joints[Math.min(joints.length - 1, index + 1)] ?? joint;
    return perp(unit(sub(after, before)));
  });
  const side = (sign: number) =>
    joints.map((joint, index) => add(joint, normals[index] ?? [0, 0], sign * (widths[index] ?? 0)));
  const last = joints.at(-1) ?? [0, 0];
  const before = joints.at(-2) ?? last;
  const tip = add(last, unit(sub(last, before)), (widths.at(-1) ?? 0) * 0.9);
  return curve([...side(1), tip, ...side(-1).reverse()], true);
};

export type FigureShape = {
  backArm: string;
  frontArm: string;
  legs: string[];
  skirt: string;
  body: string;
  head: string;
  hair: string;
  details: string;
};

const angleOf = ([x, y]: Point): number => Math.atan2(y, x);

export const shapeFigure = (pose: Pose, build: Build): FigureShape => {
  const up = unit(sub(pose.chest, pose.hip));
  const side = perp(up);
  const at = (share: number, width: number): Point =>
    add(lerp(pose.hip, pose.chest, share), side, width);
  const { shoulder, waist, hips, facing } = build;
  const back = -facing;
  const shoulderBack = at(0.94, -shoulder * 0.78 * facing);
  const shoulderFront = at(0.94, shoulder * 0.78 * facing);
  const hipBack = at(0.06, -hips * 0.48 * facing);
  const hipFront = at(0.06, hips * 0.48 * facing);
  const [armTop, armMid, armEnd] = build.arm;
  const [legTop, legMid, legEnd] = build.leg;
  const arm = (from: Point, elbow: Point, hand: Point) =>
    `${limb([from, elbow, hand], [armTop, armMid, armEnd])} ${teardrop(add(hand, unit(sub(hand, elbow)), -armEnd * 0.4), angleOf(sub(hand, elbow)), armEnd * 3.6, armEnd * 0.95)}`;
  const leg = (from: Point, knee: Point, foot: Point) =>
    `${limb([from, knee, foot], [legTop, legMid, legEnd])} ${curve(
      [
        add(foot, [back * legEnd * 1.1, -legEnd * 0.9]),
        add(foot, [facing * legEnd * 1.4, -legEnd * 0.7]),
        add(foot, [facing * legEnd * (build.dress ? 3.2 : 3.6), legEnd * 0.55]),
        add(foot, [back * legEnd * 0.9, legEnd * 0.75]),
      ],
      true,
    )}`;
  const torsoLeft = [
    at(1.02, -shoulder * 0.34),
    at(0.97, -shoulder),
    at(0.8, -shoulder * 0.92),
    at(0.5, -waist),
  ];
  const torsoRight = [
    at(0.5, waist),
    at(0.8, shoulder * 0.92),
    at(0.97, shoulder),
    at(1.02, shoulder * 0.34),
  ];
  const gravity = unit(lerp([-up[0], -up[1]], [0, 1], 0.6));
  const hemSide: Point = [-perp(gravity)[0], -perp(gravity)[1]];
  const length = Math.hypot(...sub(pose.hip, lerp(pose.backFoot, pose.frontFoot, 0.5))) * 0.62;
  const hem = add(add(pose.hip, gravity, length), hemSide, pose.sway);
  const flare = hips * 1.7 + Math.abs(pose.sway) * 0.45;
  const waistLeft = at(0.36, -waist * 1.05);
  const waistRight = at(0.36, waist * 1.05);
  const hemLeft = add(hem, hemSide, -flare);
  const hemRight = add(hem, hemSide, flare);
  const scallop = (from: Point, to: Point, drop: number) =>
    `Q ${pt(add(lerp(from, to, 0.5), gravity, drop))} ${pt(to)}`;
  const hemOne = lerp(hemLeft, hemRight, 1 / 3);
  const hemTwo = lerp(hemLeft, hemRight, 2 / 3);
  const skirt = build.dress
    ? `M ${pt(waistLeft)} C ${pt(at(0.04, -hips * 1.1))} ${pt(add(lerp(pose.hip, hem, 0.55), hemSide, -flare * 0.75))} ${pt(hemLeft)} ${scallop(hemLeft, hemOne, 14)} ${scallop(hemOne, hemTwo, 9)} ${scallop(hemTwo, hemRight, 14)} C ${pt(add(lerp(pose.hip, hem, 0.55), hemSide, flare * 0.75))} ${pt(at(0.04, hips * 1.1))} ${pt(waistRight)} Z`
    : '';
  const body = build.dress
    ? curve([...torsoLeft, at(0.3, -waist * 1.08), at(0.3, waist * 1.08), ...torsoRight], true)
    : curve(
        [
          ...torsoLeft,
          at(0.08, -hips * 1.04),
          at(-0.12, -hips),
          at(-0.15, 0),
          at(-0.12, hips),
          at(0.08, hips * 1.04),
          ...torsoRight,
        ],
        true,
      );
  const [rx, ry] = build.head;
  const tilt = Math.atan2(pose.head[0] - pose.chest[0], pose.chest[1] - pose.head[1]);
  const local = (x: number, y: number): Point => [
    pose.head[0] + x * Math.cos(tilt) - y * Math.sin(tilt),
    pose.head[1] + x * Math.sin(tilt) + y * Math.cos(tilt),
  ];
  const head = curve(
    [
      local(0, -ry),
      local(facing * rx * 0.95, -ry * 0.4),
      local(facing * rx * 1.04, ry * 0.1),
      local(facing * rx * 0.72, ry * 0.72),
      local(facing * rx * 0.1, ry),
      local(back * rx * 0.6, ry * 0.7),
      local(back * rx, -ry * 0.2),
    ],
    true,
  );
  const neck = `M ${pt(local(back * rx * 0.25, ry * 0.85))} L ${pt(at(1.01, back * shoulder * 0.3))} M ${pt(local(facing * rx * 0.4, ry * 0.8))} L ${pt(at(1.01, facing * shoulder * 0.3))}`;
  const flow = pose.sway * 0.3;
  const hair = build.dress
    ? curve(
        [
          local(facing * rx * 0.55, -ry * 0.92),
          local(back * rx * 0.2, -ry * 1.16),
          local(back * rx * 1.12, -ry * 0.45),
          local(back * rx * 1.2, ry * 0.55),
          add(pose.chest, [back * shoulder * 0.95 + flow, ry * 1.6]),
          add(pose.chest, [back * shoulder * 0.55 + flow * 1.4, ry * 3.1]),
          add(pose.chest, [back * shoulder * 0.1 + flow, ry * 1.4]),
          local(back * rx * 0.45, ry * 0.7),
          local(back * rx * 0.2, -ry * 0.1),
          local(facing * rx * 0.2, -ry * 0.62),
        ],
        true,
      )
    : curve(
        [
          local(facing * rx * 0.92, -ry * 0.5),
          local(facing * rx * 0.45, -ry * 1.08),
          local(back * rx * 0.6, -ry * 1.02),
          local(back * rx * 1.06, -ry * 0.3),
          local(back * rx * 0.7, -ry * 0.48),
          local(facing * rx * 0.4, -ry * 0.72),
        ],
        true,
      );
  const strands = build.dress
    ? `M ${pt(local(back * rx * 0.75, -ry * 0.55))} Q ${pt(local(back * rx * 1.05, ry * 0.6))} ${pt(add(pose.chest, [back * shoulder * 0.6 + flow * 1.2, ry * 2.4]))} M ${pt(local(back * rx * 0.35, -ry * 0.8))} Q ${pt(local(back * rx * 0.7, ry * 0.4))} ${pt(add(pose.chest, [back * shoulder * 0.35 + flow, ry * 1.9]))}`
    : `M ${pt(local(facing * rx * 0.75, -ry * 0.05))} L ${pt(local(facing * rx * 1.12, ry * 0.12))} L ${pt(local(facing * rx * 0.8, ry * 0.28))}`;
  const ear = `M ${pt(local(back * rx * 0.05, -ry * 0.12))} Q ${pt(local(back * rx * 0.32, ry * 0.05))} ${pt(local(back * rx * 0.06, ry * 0.3))}`;
  const lapel = build.dress
    ? `M ${pt(at(0.98, -shoulder * 0.42))} Q ${pt(at(0.82, 0))} ${pt(at(0.98, shoulder * 0.42))} M ${pt(at(0.36, -waist))} Q ${pt(at(0.32, 0))} ${pt(at(0.36, waist))}`
    : `M ${pt(at(1, -shoulder * 0.3))} L ${pt(at(0.52, facing * waist * 0.12))} L ${pt(at(1, shoulder * 0.3))} M ${pt(at(0.52, facing * waist * 0.12))} L ${pt(at(-0.08, facing * hips * 0.2))} M ${pt(at(0.75, facing * shoulder * 0.5))} L ${pt(at(0.72, facing * shoulder * 0.78))}`;
  return {
    backArm: arm(shoulderBack, pose.backElbow, pose.backHand),
    frontArm: arm(shoulderFront, pose.frontElbow, pose.frontHand),
    legs: [
      leg(hipBack, pose.backKnee, pose.backFoot),
      leg(hipFront, pose.frontKnee, pose.frontFoot),
    ],
    skirt,
    body,
    head,
    hair,
    details: `${neck} ${lapel} ${ear} ${strands}`,
  };
};
