const PHONE_KEYWORDS = ['device', 'iphone', 'mobile', 'smartphone', 'mockup', 'app'] as const;

export const CLIP_CATEGORIES = [
  {
    id: 'imported',
    label: 'Web Motion',
    keywords: [
      'web',
      'react',
      'magic ui',
      '21st.dev',
      'motion primitives',
      'components',
      'imported',
      'react bits',
    ],
  },
  {
    id: 'kinetic-type',
    label: 'Kinetic Type',
    keywords: ['typography', 'type', 'words', 'title', 'motion text', 'big text'],
  },
  {
    id: 'text-reveals',
    label: 'Text Reveals',
    keywords: ['typography', 'type', 'title', 'letters', 'characters', 'numbers', 'stats'],
  },
  {
    id: 'hand-drawn',
    label: 'Hand-drawn',
    keywords: ['handwritten', 'marker', 'ink', 'scribble', 'drawn', 'pen', 'annotation'],
  },
  {
    id: 'phone-reveals',
    label: 'Phone Reveals',
    keywords: [...PHONE_KEYWORDS, 'entrance', 'intro', 'hero'],
  },
  {
    id: 'phone-layouts',
    label: 'Multi-phone Layouts',
    keywords: [...PHONE_KEYWORDS, 'phones', 'multiple', 'arrangement', 'composition'],
  },
  {
    id: 'screen-demos',
    label: 'Screen Demos',
    keywords: [...PHONE_KEYWORDS, 'ui', 'walkthrough', 'demo', 'screens', 'feed'],
  },
  {
    id: 'desk-scenes',
    label: 'Desk & Laptop',
    keywords: ['laptop', 'computer', 'notebook', 'desk', 'workspace', 'hands', 'live action'],
  },
  {
    id: 'overlays',
    label: 'Overlays',
    keywords: ['layer', 'effect', 'ui', 'popup', 'vintage'],
  },
  {
    id: 'list-pickers',
    label: 'Lists & Pickers',
    keywords: [
      'list',
      'menu',
      'picker',
      'selector',
      'wheel',
      'carousel',
      'options',
      'ui',
      'scroll',
    ],
  },
  {
    id: 'brand',
    label: 'Logo & End Cards',
    keywords: ['brand', 'branding', 'intro', 'outro', 'ending', 'call to action', 'wordmark'],
  },
  {
    id: 'backgrounds',
    label: 'Backgrounds',
    keywords: ['background', 'bg', 'scene', 'set', 'clay', 'wall'],
  },
  {
    id: 'ad-reveals',
    label: 'Ad Reveals',
    keywords: [
      'billboard',
      'poster',
      'hoarding',
      'outdoor',
      'advertising',
      'unveil',
      'launch',
      'helicopter',
      'banner',
      'newspaper',
      'elevator',
    ],
  },
  {
    id: 'transitions',
    label: 'Transitions',
    keywords: ['transition', 'cut', 'bridge', 'cover', 'between'],
  },
  {
    id: 'invitations',
    label: 'Invitations',
    keywords: [
      'wedding',
      'invite',
      'invitation',
      'save the date',
      'marriage',
      'ceremony',
      'rsvp',
      'event',
      'shaadi',
    ],
  },
] as const;

export type ClipCategory = (typeof CLIP_CATEGORIES)[number]['id'];

export const CLIP_CATEGORY_IDS: readonly ClipCategory[] = CLIP_CATEGORIES.map(
  (category) => category.id,
);

export const CLIP_TAGS = [
  'kinetic',
  'headline',
  'text',
  'typing',
  'caret',
  'counter',
  'marquee',
  'outline',
  'repeat',
  'stack',
  'zoom',
  'flip',
  'glow',
  'reveal',
  'handwriting',
  'doodle',
  'sketch',
  'arrows',
  'draw',
  '3d',
  'phone',
  'laptop',
  'hand',
  'multi-phone',
  'screen',
  'spin',
  'float',
  'drop',
  'slide',
  'orbit',
  'grid',
  'scroll',
  'crossfade',
  'top-down',
  'camera-move',
  'cards',
  'notification',
  'overlay',
  'film',
  'footage',
  'grain',
  'texture',
  'logo',
  'icon',
  'cta',
  'end-card',
  'backdrop',
  'wipe',
  'cover',
  'minimal',
  'paper',
  'billboard',
  'cloth',
  'list',
  'picker',
  'wheel',
  'badge',
  'chalkboard',
  'wedding',
  'invitation',
  'floral',
  'monogram',
  'panorama',
] as const;

export type ClipTag = (typeof CLIP_TAGS)[number];

export const CLIP_THEMES = ['light', 'dark'] as const;

export type ClipTheme = (typeof CLIP_THEMES)[number];

export const POSTER_CATEGORIES = [
  {
    id: 'social-posts',
    label: 'Social Posts',
    keywords: [
      'poster',
      'instagram',
      'linkedin',
      'facebook',
      'post',
      'story',
      'social media',
      'marketing',
    ],
  },
  {
    id: 'carousels',
    label: 'Carousels',
    keywords: ['poster', 'carousel', 'slides', 'swipe', 'linkedin', 'instagram'],
  },
  {
    id: 'pitch-decks',
    label: 'Pitch Decks',
    keywords: ['poster', 'presentation', 'slides', 'deck', 'powerpoint', 'investor', 'startup'],
  },
  {
    id: 'resumes',
    label: 'Resumes & Cards',
    keywords: ['poster', 'cv', 'resume', 'cover letter', 'business card', 'job', 'portfolio'],
  },
  {
    id: 'sports',
    label: 'Sports',
    keywords: ['poster', 'game day', 'basketball', 'hockey', 'football', 'team', 'score', 'match'],
  },
  {
    id: 'seasonal',
    label: 'Seasonal',
    keywords: ['poster', 'holiday', 'autumn', 'fall', 'halloween', 'black friday', 'sale'],
  },
  {
    id: 'lifestyle',
    label: 'Lifestyle',
    keywords: ['poster', 'yoga', 'wellness', 'self care', 'real estate', 'podcast', 'fitness'],
  },
] as const;

export type PosterCategory = (typeof POSTER_CATEGORIES)[number]['id'];

export const POSTER_TAGS = [
  'poster',
  'instagram',
  'story',
  'linkedin',
  'carousel',
  'hiring',
  'stats',
  'review',
  'event',
  'sale',
  'quote',
  'tips',
  'comparison',
  'quiz',
  'product',
  'mockup',
  'pitch-deck',
  'resume',
  'business-card',
  'saas',
  'ai',
  'b2b',
  'freelance',
  'small-business',
  'corporate',
  'sports',
  'holiday',
  'wellness',
  'real-estate',
  'podcast',
  'retro',
  'gradient',
  'photo',
  'neon',
] as const;

export type PosterTag = (typeof POSTER_TAGS)[number] | ClipTag;

export const SITE_CATEGORIES = [
  {
    id: 'weddings',
    label: 'Weddings',
    keywords: ['website', 'wedding', 'invitation', 'invite', 'rsvp', 'save the date', 'marriage'],
  },
  {
    id: 'birthdays',
    label: 'Birthdays',
    keywords: ['website', 'birthday', 'party', 'first birthday', 'kids', 'invitation', 'rsvp'],
  },
  {
    id: 'quinceaneras',
    label: 'Quinceañeras',
    keywords: ['website', 'quinceanera', 'quince', 'xv', 'sweet sixteen', 'invitation', 'rsvp'],
  },
  {
    id: 'baby-showers',
    label: 'Baby Showers',
    keywords: ['website', 'baby shower', 'baby', 'gender reveal', 'sprinkle', 'invitation', 'rsvp'],
  },
] as const;

export type SiteCategory = (typeof SITE_CATEGORIES)[number]['id'];

export const SITE_TAGS = [
  'website',
  'invitation',
  'rsvp',
  'countdown',
  'wedding',
  'floral',
  'elegant',
  'editorial',
  'birthday',
  'quinceanera',
  'baby-shower',
  'winter',
  'autumn',
  'playful',
  'royal',
] as const;

export type SiteTag = (typeof SITE_TAGS)[number];

export const GALLERY_CATEGORIES = [...CLIP_CATEGORIES, ...POSTER_CATEGORIES, ...SITE_CATEGORIES];

export type GalleryCategory = ClipCategory | PosterCategory | SiteCategory;

export const GALLERY_CATEGORY_IDS: readonly GalleryCategory[] = GALLERY_CATEGORIES.map(
  (category) => category.id,
);

export type GalleryTag = ClipTag | PosterTag | SiteTag;

export const GALLERY_TAGS: readonly GalleryTag[] = [
  ...new Set<GalleryTag>([...CLIP_TAGS, ...POSTER_TAGS, ...SITE_TAGS]),
];

const categoryById = (id: GalleryCategory) =>
  GALLERY_CATEGORIES.find((category) => category.id === id);

export const categoryLabel = (id: GalleryCategory): string => categoryById(id)?.label ?? id;

export const categoryKeywords = (id: GalleryCategory): readonly string[] =>
  categoryById(id)?.keywords ?? [];
