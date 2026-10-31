import type { DesignIconName } from '@/design';
import { icon, line, polygon, rect, text } from '../../../kit';

export const GARNET = {
  wine: '#3a1024',
  rose: '#f27aa3',
  blush: '#fbe3ec',
  paper: '#ffffff',
  ink: '#1f0b14',
  muted: '#5e4a53',
};

export const CLEAR = 'rgba(0,0,0,0)';
export const LETTER = { width: 1275, height: 1650 } as const;

export const HEADING_FONT = { label: 'Heading font', value: 'Barlow Condensed' } as const;
export const BODY_FONT = { label: 'Body font', value: 'Barlow' } as const;
export const SCRIPT_FONT = { label: 'Script font', value: 'Dancing Script' } as const;

export const INITIALS = { label: 'Initials', value: 'AV' } as const;
export const NAME = { label: 'Name', value: 'ARLO VANCE' } as const;
export const ROLE = { label: 'Role', value: 'BRAND DESIGNER\nART DIRECTOR' } as const;
export const CONTACTS = {
  label: 'Contact',
  value: ['ARLO@VANCESTUDIO.CO', '(555) 618-2034', 'VANCESTUDIO.CO'],
} as const;
export const CONTACT_ICONS: readonly DesignIconName[] = ['mail', 'phone', 'globe'];

export interface MonogramStyle {
  fill: string;
  color: string;
  clear: string;
  fontFamily: string;
}

export const monogram = (
  initials: string,
  x: number,
  y: number,
  size: number,
  style: MonogramStyle,
) => [
  polygon(6, x, y, size, size, style.fill, { rotation: 0, name: 'Monogram' }),
  polygon(6, x + size * 0.14, y + size * 0.14, size * 0.72, size * 0.72, style.clear, {
    stroke: style.color,
    strokeWidth: size * 0.03,
    name: 'Monogram ring',
  }),
  text(initials, x, y + size * 0.27, size, {
    fontFamily: style.fontFamily,
    fontSize: size * 0.4,
    fontWeight: 700,
    fill: style.color,
    align: 'center',
    lineHeight: 1,
    letterSpacing: size * 0.01,
  }),
];

export const doubleRule = (x: number, y: number, width: number, color: string) => [
  line(x, y, width, color, 2),
  line(x, y + 10, width, color, 2, { dashed: true }),
];

export const iconTile = (
  name: DesignIconName,
  x: number,
  y: number,
  size: number,
  colors: { tile: string; glyph: string },
) => [
  rect(x, y, size, size, colors.tile, { cornerRadius: size * 0.22, name: 'Icon tile' }),
  icon(name, x + size * 0.2, y + size * 0.2, size * 0.6, colors.glyph, { strokeWidth: 2.4 }),
];

export const heading =
  (fontFamily: string) => (label: string, x: number, y: number, size: number, color: string) =>
    text(label, x, y, 900, {
      fontFamily,
      fontSize: size,
      fontWeight: 600,
      fill: color,
      lineHeight: 1,
    });

export const caps =
  (fontFamily: string) =>
  (label: string, x: number, y: number, width: number, size: number, color: string, weight = 500) =>
    text(label, x, y, width, {
      fontFamily,
      fontSize: size,
      fontWeight: weight,
      fill: color,
      lineHeight: 1.3,
    });

export const LETTER_TEXT = [
  'Dear Hiring Team,',
  'I am writing to apply for the Senior Brand Designer role at Copperline. Your identity work for independent makers has inspired me for years, and I would love to help shape the next chapter of the studio.',
  'For the past seven years I have built visual systems for consumer brands, from logo and type to packaging and campaign rollouts. At Orchard and Co I led a rebrand for a regional coffee roaster that lifted shelf sales by 31% in its first season, and I set up the template library our team still uses today.',
  'I enjoy turning complicated briefs into simple, confident ideas, and I care about craft down to the last kerning pair. I would welcome the chance to share my portfolio and learn more about your plans.',
  'Thank you for your time and consideration.',
  'Sincerely,',
].join('\n\n');
