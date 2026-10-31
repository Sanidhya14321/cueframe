export const FONT_CATEGORIES = ['sans', 'serif', 'display', 'script', 'mono'] as const;

export type FontCategory = (typeof FONT_CATEGORIES)[number];

export interface FontFamily {
  family: string;
  category: FontCategory;
}

export const FONT_FAMILIES = [
  { family: 'Inter', category: 'sans' },
  { family: 'Poppins', category: 'sans' },
  { family: 'Montserrat', category: 'sans' },
  { family: 'DM Sans', category: 'sans' },
  { family: 'Plus Jakarta Sans', category: 'sans' },
  { family: 'Manrope', category: 'sans' },
  { family: 'Outfit', category: 'sans' },
  { family: 'Sora', category: 'sans' },
  { family: 'Space Grotesk', category: 'sans' },
  { family: 'Raleway', category: 'sans' },
  { family: 'Work Sans', category: 'sans' },
  { family: 'Lexend', category: 'sans' },
  { family: 'Urbanist', category: 'sans' },
  { family: 'Figtree', category: 'sans' },
  { family: 'Rubik', category: 'sans' },
  { family: 'Nunito', category: 'sans' },
  { family: 'Quicksand', category: 'sans' },
  { family: 'Barlow', category: 'sans' },
  { family: 'Barlow Condensed', category: 'display' },
  { family: 'Bricolage Grotesque', category: 'display' },
  { family: 'Syne', category: 'display' },
  { family: 'Unbounded', category: 'display' },
  { family: 'Archivo Black', category: 'display' },
  { family: 'Anton', category: 'display' },
  { family: 'Bebas Neue', category: 'display' },
  { family: 'Oswald', category: 'display' },
  { family: 'Bungee', category: 'display' },
  { family: 'Teko', category: 'display' },
  { family: 'Kanit', category: 'display' },
  { family: 'Righteous', category: 'display' },
  { family: 'Creepster', category: 'display' },
  { family: 'Press Start 2P', category: 'display' },
  { family: 'Silkscreen', category: 'display' },
  { family: 'Playfair Display', category: 'serif' },
  { family: 'DM Serif Display', category: 'serif' },
  { family: 'Instrument Serif', category: 'serif' },
  { family: 'Lora', category: 'serif' },
  { family: 'Fraunces', category: 'serif' },
  { family: 'Abril Fatface', category: 'serif' },
  { family: 'Cormorant Garamond', category: 'serif' },
  { family: 'Libre Baskerville', category: 'serif' },
  { family: 'Caveat', category: 'script' },
  { family: 'Pacifico', category: 'script' },
  { family: 'Dancing Script', category: 'script' },
  { family: 'Permanent Marker', category: 'script' },
  { family: 'Satisfy', category: 'script' },
  { family: 'Shadows Into Light', category: 'script' },
  { family: 'Space Mono', category: 'mono' },
  { family: 'VT323', category: 'mono' },
] as const satisfies readonly FontFamily[];

export type FontFamilyName = (typeof FONT_FAMILIES)[number]['family'];

export const FONT_WEIGHTS = [100, 200, 300, 400, 500, 600, 700, 800, 900] as const;

export const isKnownFont = (family: string): family is FontFamilyName =>
  FONT_FAMILIES.some((font) => font.family === family);

export const fontStyleString = (weight: number, italic: boolean): string =>
  `${italic ? 'italic ' : ''}${weight}`;

export const textDecorationString = (underline: boolean, strikethrough: boolean): string =>
  [underline ? 'underline' : '', strikethrough ? 'line-through' : ''].filter(Boolean).join(' ');

const REGISTERED_FAMILIES: Record<string, string> = {
  'Press Start 2P': 'Press Start TwoP',
  VT323: 'VTThreeTwoThree',
};

export const cssFontFamily = (family: string): string => REGISTERED_FAMILIES[family] ?? family;
