import { POST_SIZE } from '../../../kit';

export interface EventPalette {
  top: string;
  deep: string;
  accent: string;
  paper: string;
  ink: string;
  soft: string;
}

export const JADE: EventPalette = {
  top: '#0f9f8a',
  deep: '#032520',
  accent: '#c6f25e',
  paper: '#ffffff',
  ink: '#07130f',
  soft: '#c9f2e8',
};

export const COBALT: EventPalette = {
  top: '#2f6bff',
  deep: '#1d4ed8',
  accent: '#ffd84d',
  paper: '#ffffff',
  ink: '#0a1030',
  soft: '#dbe6ff',
};

export const FONTS = {
  heading: { label: 'Heading font', value: 'Sora' },
  body: { label: 'Body font', value: 'DM Sans' },
} as const;

export const { width: W, height: H } = POST_SIZE;
