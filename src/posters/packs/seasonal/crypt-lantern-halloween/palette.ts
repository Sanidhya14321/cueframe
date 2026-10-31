import { poly } from '../../../kit';

export const CRYPT = {
  night: '#0c2328',
  deep: '#061417',
  teal: '#1f5a5e',
  bone: '#f1e8d4',
  blood: '#d6243a',
  wine: '#7a0f1d',
  mustard: '#f0a92c',
  amber: '#d9821a',
  ink: '#0b0b0b',
  stone: '#8e9997',
};

export const SPOOKY = { label: 'Spooky font', value: 'Creepster' } as const;
export const COND = { label: 'Heading font', value: 'Bebas Neue' } as const;
export const BODY = { label: 'Body font', value: 'Poppins' } as const;
export const HANDLE = { label: 'Handle', value: 'nightshade.studio' } as const;

const BAT: readonly (readonly [number, number])[] = [
  [0, 12],
  [22, 0],
  [32, 14],
  [42, 6],
  [50, 16],
  [58, 6],
  [68, 14],
  [78, 0],
  [100, 12],
  [82, 18],
  [72, 32],
  [56, 24],
  [50, 34],
  [44, 24],
  [28, 32],
  [18, 18],
];

export const bat = (x: number, y: number, width: number, fill: string) =>
  poly(
    BAT.map(([px, py]) => [x + (px * width) / 100, y + (py * width) / 100] as const),
    fill,
    { name: 'Bat' },
  );
