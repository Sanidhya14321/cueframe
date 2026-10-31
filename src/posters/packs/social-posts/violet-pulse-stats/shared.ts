import { POST_SIZE, text } from '../../../kit';

export interface StatTheme {
  brand: string;
  ink: string;
  paper: string;
  surface: string;
  copy: string;
  muted: string;
}

export const VIOLET: StatTheme = {
  brand: '#6d3df5',
  ink: '#0e0a1f',
  paper: '#ffffff',
  surface: '#ffffff',
  copy: '#0e0a1f',
  muted: '#4b4766',
};

export const CORAL: StatTheme = {
  brand: '#f2554a',
  ink: '#1d0907',
  paper: '#ffffff',
  surface: '#fff5ef',
  copy: '#1d0907',
  muted: '#6b4a45',
};

export const MIDNIGHT: StatTheme = {
  brand: '#9b7bff',
  ink: '#05040c',
  paper: '#ffffff',
  surface: '#16122b',
  copy: '#ffffff',
  muted: '#b9b4d6',
};

export const FONTS = {
  heading: { label: 'Heading font', value: 'Sora' },
  body: { label: 'Body font', value: 'Inter' },
} as const;

export const { width: PW, height: PH } = POST_SIZE;

export const kicker = (content: string, fill: string, fontFamily: string, y = 110) =>
  text(content, 90, y, 800, {
    fontFamily,
    fontSize: 28,
    fontWeight: 600,
    fill,
    opacity: 0.85,
    letterSpacing: 1,
  });
