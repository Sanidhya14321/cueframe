export type Point = [number, number];

export type OrnamentLayer = { d: string; mode: 'fill' | 'stroke'; width: number };

const fixed = (value: number): string => value.toFixed(1);

export const pt = ([x, y]: Point): string => `${fixed(x)} ${fixed(y)}`;

export const polar = (radius: number, angle: number, [cx, cy]: Point = [0, 0]): Point => [
  cx + radius * Math.cos(angle),
  cy + radius * Math.sin(angle),
];

const plus = ([ax, ay]: Point, [bx, by]: Point, scale = 1): Point => [
  ax + bx * scale,
  ay + by * scale,
];

const around = (count: number, offset: number, build: (angle: number, index: number) => string) =>
  Array.from({ length: count }, (_, index) =>
    build(offset + (index / count) * Math.PI * 2 - Math.PI / 2, index),
  ).join(' ');

export const circleAt = ([cx, cy]: Point, radius: number): string =>
  `M ${fixed(cx + radius)} ${fixed(cy)} A ${fixed(radius)} ${fixed(radius)} 0 1 0 ${fixed(cx - radius)} ${fixed(cy)} A ${fixed(radius)} ${fixed(radius)} 0 1 0 ${fixed(cx + radius)} ${fixed(cy)} Z`;

const ring = (radius: number): string => circleAt([0, 0], radius);

const lobe = (center: Point, angle: number, r0: number, r1: number, spread: number): string => {
  const reach = r1 + (r1 - r0) * 0.18;
  return `M ${pt(polar(r0, angle - spread, center))} C ${pt(polar(reach, angle - spread * 1.5, center))} ${pt(polar(reach, angle + spread * 1.5, center))} ${pt(polar(r0, angle + spread, center))}`;
};

const pointed = (
  center: Point,
  angle: number,
  r0: number,
  r1: number,
  spread: number,
  closed = false,
): string => {
  const length = r1 - r0;
  const side = (sign: number) => [
    polar(r0 + length * 0.5, angle + sign * spread * 1.3, center),
    polar(r1 - length * 0.22, angle + sign * spread * 0.32, center),
  ];
  const [a1, a2] = side(-1);
  const [b1, b2] = side(1);
  return `M ${pt(polar(r0, angle - spread, center))} C ${pt(a1 as Point)} ${pt(a2 as Point)} ${pt(polar(r1, angle, center))} C ${pt(b2 as Point)} ${pt(b1 as Point)} ${pt(polar(r0, angle + spread, center))}${closed ? ' Z' : ''}`;
};

export const teardrop = (base: Point, angle: number, length: number, width: number): string => {
  const direction: Point = [Math.cos(angle), Math.sin(angle)];
  const normal: Point = [-direction[1], direction[0]];
  const end = plus(base, direction, length);
  const shoulder = plus(base, direction, length * 0.36);
  return `M ${pt(base)} C ${pt(plus(shoulder, normal, width * 1.25))} ${pt(plus(end, normal, width * 0.95))} ${pt(end)} C ${pt(plus(end, normal, -width * 0.95))} ${pt(plus(shoulder, normal, -width * 1.25))} ${pt(base)} Z`;
};

const smoothPath = (points: Point[]): string => {
  const [first, ...rest] = points;
  if (first === undefined) {
    return '';
  }
  const segments = rest.map((point, index) => {
    const next = rest[index + 1];
    if (next === undefined) {
      return `L ${pt(point)}`;
    }
    return `Q ${pt(point)} ${pt([(point[0] + next[0]) / 2, (point[1] + next[1]) / 2])}`;
  });
  return `M ${pt(first)} ${segments.join(' ')}`;
};

export const spiral = (
  center: Point,
  radius: number,
  start: number,
  turns: number,
  sign = 1,
): string =>
  smoothPath(
    Array.from({ length: Math.ceil(turns * 18) + 1 }, (_, index) => {
      const t = index / (turns * 18);
      return polar(radius * (1 - 0.82 * t), start + sign * t * turns * Math.PI * 2, center);
    }),
  );

export const flower = (center: Point, radius: number, petals: number, rotation = 0): string =>
  around(petals, rotation, (angle) =>
    lobe(center, angle, radius * 0.28, radius, (Math.PI / petals) * 0.82),
  );

const dots = (radius: number, count: number, size: number, offset = 0): string =>
  around(count, offset, (angle) => circleAt(polar(radius, angle), size));

const step = (count: number) => Math.PI / count;

export const quarterMandala = (): OrnamentLayer[] => [
  { mode: 'stroke', width: 2.6, d: around(12, 0, (a) => lobe([0, 0], a, 6, 48, step(12) * 0.85)) },
  {
    mode: 'fill',
    width: 0,
    d: around(12, step(12), (a) => pointed([0, 0], a, 34, 84, step(12) * 0.62, true)),
  },
  { mode: 'stroke', width: 3.2, d: `${ring(94)} ${ring(101)}` },
  {
    mode: 'stroke',
    width: 2.4,
    d: around(
      14,
      0,
      (a) =>
        `${spiral(polar(136, a), 26, a + Math.PI, 1.4)} ${spiral(polar(136, a + step(14)), 20, a, 1.2, -1)}`,
    ),
  },
  { mode: 'stroke', width: 3, d: `${ring(174)} ${ring(183)}` },
  { mode: 'fill', width: 0, d: around(28, 0, (a) => teardrop(polar(190, a), a, 56, 11)) },
  { mode: 'fill', width: 0, d: dots(258, 28, 4.2, step(28)) },
  { mode: 'stroke', width: 3, d: ring(266) },
  { mode: 'fill', width: 0, d: dots(277, 96, 3.1) },
  { mode: 'fill', width: 0, d: around(16, 0, (a) => flower(polar(326, a), 40, 8, a)) },
  { mode: 'stroke', width: 2.2, d: around(16, step(16), (a) => spiral(polar(322, a), 18, a, 1.3)) },
  { mode: 'stroke', width: 3, d: `${ring(372)} ${ring(380)}` },
  { mode: 'stroke', width: 3, d: around(36, 0, (a) => lobe([0, 0], a, 382, 432, step(36) * 0.95)) },
  { mode: 'stroke', width: 2, d: around(36, 0, (a) => lobe([0, 0], a, 382, 412, step(36) * 0.55)) },
  { mode: 'fill', width: 0, d: dots(448, 120, 3.4) },
  {
    mode: 'stroke',
    width: 3,
    d: around(30, 0, (a) => pointed([0, 0], a, 458, 548, step(30) * 0.96)),
  },
  {
    mode: 'fill',
    width: 0,
    d: around(30, 0, (a) => pointed([0, 0], a, 476, 528, step(30) * 0.5, true)),
  },
  { mode: 'fill', width: 0, d: around(30, step(30), (a) => teardrop(polar(556, a), a, 50, 11)) },
  { mode: 'stroke', width: 2.4, d: around(30, step(30), (a) => circleAt(polar(622, a), 7)) },
];

export const lotusMandala = (): OrnamentLayer[] => [
  {
    mode: 'stroke',
    width: 1.8,
    d: around(16, 0, (a) => pointed([0, 0], a, 8, 58, step(16) * 0.9)),
  },
  { mode: 'stroke', width: 2.4, d: `${ring(64)} ${ring(70)}` },
  {
    mode: 'stroke',
    width: 1.8,
    d: around(16, step(16), (a) => pointed([0, 0], a, 72, 122, step(16) * 0.92)),
  },
  {
    mode: 'stroke',
    width: 1.2,
    d: around(16, step(16), (a) => pointed([0, 0], a, 80, 110, step(16) * 0.42)),
  },
  { mode: 'stroke', width: 2.4, d: `${ring(128)} ${ring(135)}` },
  { mode: 'fill', width: 0, d: dots(144, 64, 2.4) },
  {
    mode: 'stroke',
    width: 2,
    d: around(8, 0, (a) => `${circleAt(polar(182, a), 24)} ${circleAt(polar(182, a), 12)}`),
  },
  {
    mode: 'stroke',
    width: 1.4,
    d: around(8, 0, (a) =>
      around(
        14,
        0,
        (b) => `M ${pt(polar(28, b, polar(182, a)))} L ${pt(polar(38, b, polar(182, a)))}`,
      ),
    ),
  },
  {
    mode: 'stroke',
    width: 1.8,
    d: around(
      8,
      step(8),
      (a) =>
        `${teardrop(polar(156, a), a - 0.05, 52, 9)} ${teardrop(polar(156, a), a + 0.05, 52, 9)}`,
    ),
  },
  { mode: 'stroke', width: 2.4, d: `${ring(220)} ${ring(227)}` },
  {
    mode: 'stroke',
    width: 2.6,
    d: around(10, 0, (a) => pointed([0, 0], a, 228, 430, step(10) * 0.86)),
  },
  {
    mode: 'stroke',
    width: 1.8,
    d: around(10, 0, (a) => pointed([0, 0], a, 244, 392, step(10) * 0.62)),
  },
  {
    mode: 'stroke',
    width: 1.4,
    d: around(10, 0, (a) => pointed([0, 0], a, 262, 350, step(10) * 0.36)),
  },
  {
    mode: 'stroke',
    width: 1,
    d: around(10, 0, (a) =>
      [-0.5, -0.25, 0, 0.25, 0.5]
        .map(
          (share) =>
            `M ${pt(polar(272, a + share * step(10) * 0.5))} L ${pt(polar(330 - Math.abs(share) * 60, a + share * step(10) * 0.3))}`,
        )
        .join(' '),
    ),
  },
  {
    mode: 'stroke',
    width: 2,
    d: around(10, step(10), (a) => pointed([0, 0], a, 230, 318, step(10) * 0.5)),
  },
  { mode: 'stroke', width: 1.6, d: around(10, step(10), (a) => flower(polar(344, a), 22, 9, a)) },
  { mode: 'fill', width: 0, d: around(10, step(10), (a) => circleAt(polar(344, a), 6)) },
  { mode: 'fill', width: 0, d: around(10, 0, (a) => circleAt(polar(444, a), 5)) },
];

const heart = ([cx, cy]: Point, angle: number, size: number): string => {
  const local = (x: number, y: number): Point => [
    cx + x * size * Math.cos(angle) - y * size * Math.sin(angle),
    cy + x * size * Math.sin(angle) + y * size * Math.cos(angle),
  ];
  return `M ${pt(local(0, 0.9))} C ${pt(local(-0.2, 0.62))} ${pt(local(-1, 0.3))} ${pt(local(-1, -0.25))} C ${pt(local(-1, -0.8))} ${pt(local(-0.4, -1))} ${pt(local(0, -0.5))} C ${pt(local(0.4, -1))} ${pt(local(1, -0.8))} ${pt(local(1, -0.25))} C ${pt(local(1, 0.3))} ${pt(local(0.2, 0.62))} ${pt(local(0, 0.9))} Z`;
};

export const heartPath = heart;

export const damaskTile = (size: number): OrnamentLayer[] => {
  const half = size / 2;
  const center: Point = [half, half];
  const corners: Point[] = [
    [0, 0],
    [size, 0],
    [0, size],
    [size, size],
  ];
  return [
    {
      mode: 'stroke',
      width: size * 0.028,
      d: around(4, Math.PI / 4, (a) =>
        heart(polar(size * 0.165, a, center), a + Math.PI / 2, size * 0.105),
      ),
    },
    {
      mode: 'stroke',
      width: size * 0.018,
      d: around(4, Math.PI / 4, (a) =>
        [-1, 1]
          .map((sign) =>
            spiral(
              polar(size * 0.3, a + sign * 0.42, center),
              size * 0.058,
              a + Math.PI,
              1.25,
              sign,
            ),
          )
          .join(' '),
      ),
    },
    {
      mode: 'fill',
      width: 0,
      d: `${flower(center, size * 0.085, 8)} ${circleAt(center, size * 0.022)}`,
    },
    { mode: 'fill', width: 0, d: corners.map((point) => flower(point, size * 0.13, 10)).join(' ') },
    {
      mode: 'fill',
      width: 0,
      d: [0.3, 0.38, 0.62, 0.7]
        .flatMap((share) => [
          circleAt([half, share * size - half + (share < 0.5 ? 0 : size)], size * 0.014),
          circleAt([share * size - half + (share < 0.5 ? 0 : size), half], size * 0.014),
        ])
        .join(' '),
    },
  ];
};

export const vine = (height: number): OrnamentLayer[] => {
  const width = height * 0.26;
  const curls = 5;
  const stem = smoothPath(
    Array.from({ length: 21 }, (_, index) => [
      Math.sin((index / 20) * Math.PI * 3) * width * 0.08,
      (index / 20) * height,
    ]),
  );
  const pieces = Array.from({ length: curls }, (_, index) => {
    const y = (height * (index + 0.6)) / (curls + 0.4);
    const sign = index % 2 === 0 ? 1 : -1;
    return {
      curl: spiral([sign * width * 0.3, y], width * 0.24, sign > 0 ? Math.PI : 0, 1.35, sign),
      leaf: teardrop(
        [0, y + height * 0.05],
        sign > 0 ? Math.PI * 0.85 : Math.PI * 0.15,
        width * 0.42,
        width * 0.09,
      ),
      bud: circleAt([-sign * width * 0.18, y - height * 0.03], width * 0.035),
    };
  });
  return [
    { mode: 'stroke', width: 2.6, d: stem },
    { mode: 'stroke', width: 2.4, d: pieces.map((piece) => piece.curl).join(' ') },
    { mode: 'fill', width: 0, d: pieces.map((piece) => `${piece.leaf} ${piece.bud}`).join(' ') },
    {
      mode: 'fill',
      width: 0,
      d: `${flower([0, -width * 0.12], width * 0.16, 6)} ${flower([0, height + width * 0.1], width * 0.12, 6)}`,
    },
  ];
};

export const corner = (size: number): OrnamentLayer[] => [
  {
    mode: 'stroke',
    width: 2.2,
    d: `M ${pt([size, 0])} L ${pt([size * 0.18, 0])} M ${pt([0, size])} L ${pt([0, size * 0.18])} ${spiral([size * 0.3, size * 0.3], size * 0.2, Math.PI * 1.25, 1.4)} ${spiral([size * 0.62, size * 0.12], size * 0.1, Math.PI, 1.2)} ${spiral([size * 0.12, size * 0.62], size * 0.1, -Math.PI / 2, 1.2, -1)}`,
  },
  {
    mode: 'fill',
    width: 0,
    d: `${teardrop([size * 0.48, size * 0.48], Math.PI / 4, size * 0.3, size * 0.06)} ${circleAt([size * 0.9, size * 0.08], size * 0.03)} ${circleAt([size * 0.08, size * 0.9], size * 0.03)}`,
  },
];
