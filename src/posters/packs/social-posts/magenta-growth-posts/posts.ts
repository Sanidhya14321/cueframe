import {
  circle,
  ellipse,
  type Nodes,
  POST_SIZE,
  photo,
  pill,
  rect,
  rotateNodes,
  star,
  type Template,
  type ThemeSpec,
  text,
  themed,
} from '../../../kit';

export interface GrowthPalette {
  brand: string;
  ink: string;
  paper: string;
  accent: string;
}

export const MAGENTA: GrowthPalette = {
  brand: '#e11d74',
  ink: '#111014',
  paper: '#fdf6f0',
  accent: '#ffcc33',
};

export const EMERALD: GrowthPalette = {
  brand: '#10a37f',
  ink: '#05140f',
  paper: '#f2fbf7',
  accent: '#ffd166',
};

export const HEADING = { label: 'Heading font', value: 'Poppins' } as const;
export const DISPLAY = { label: 'Display font', value: 'Archivo Black' } as const;
export const STUDIO = { label: 'Studio name', value: 'Brightwave Studio' } as const;
export const { width: W, height: H } = POST_SIZE;

export const WHITE = '#ffffff';

const domino = (x: number, angle: number, face: string, side: string): Nodes[] =>
  rotateNodes(angle, x + 110, 1230, [
    rect(x + 96, 1018, 26, 212, side, { name: 'Domino side' }),
    rect(x, 1010, 100, 220, face, {
      cornerRadius: 6,
      name: 'Domino',
      shadow: { color: 'rgba(0,0,0,0.45)', blur: 18, offsetX: 6, offsetY: 6 },
    }),
  ]);

export const moreEyes = (p: GrowthPalette): Template =>
  themed(
    W,
    H,
    {
      colors: {
        background: { value: p.ink, hint: 'Page' },
        primary: { value: p.brand, hint: 'Last headline line and the guide pill' },
        text: {
          value: p.paper,
          hint: 'First two headline lines; its white shade is the pill label',
        },
        surface: {
          value: '#f4f4f5',
          hint: 'Domino faces; its grey shade colors the domino sides',
        },
        accent: { value: p.accent, hint: 'Star in the top left' },
      },
      fonts: { heading: HEADING },
      copy: {
        headline: { label: 'Headline', value: 'MORE EYES,\nMORE CLICKS,' },
        highlight: { label: 'Highlight', value: 'MORE BUSINESS.' },
        button: { label: 'Button', value: 'Step by step guide' },
      },
    } as const satisfies ThemeSpec,
    (t) => {
      const font = t.font('heading');
      return [
        rect(0, 0, W, H, t.color('background'), { name: 'Background' }),
        text(t.copy('headline'), 80, 210, 920, {
          fontFamily: font,
          fontSize: 80,
          fontWeight: 800,
          fill: t.color('text'),
          align: 'right',
          lineHeight: 1.08,
        }),
        text(t.copy('highlight'), 80, 384, 920, {
          fontFamily: font,
          fontSize: 80,
          fontWeight: 800,
          fill: t.color('primary'),
          align: 'right',
        }),
        pill(t.copy('button'), 640, 530, {
          fill: t.color('primary'),
          color: t.shade('text', WHITE),
          fontSize: 32,
          fontFamily: font,
          fontWeight: 700,
        }),
        [0, 1, 2, 3, 4, 5, 6].map((index) =>
          domino(
            40 + index * 140,
            index < 4 ? 64 - index * 16 : 0,
            t.color('surface'),
            t.shade('surface', '#9a9aa3'),
          ),
        ),
        star(5, 80, 90, 80, t.color('accent'), { innerRatio: 0.45 }),
      ];
    },
  );

export const brandTrust = (p: GrowthPalette): Template =>
  themed(
    W,
    H,
    {
      colors: {
        background: { value: p.paper, hint: 'Page; its white shade is the pill label' },
        primary: {
          value: p.brand,
          hint: 'The repeated wordmark (solid and outlined rows) and the studio pill',
        },
        text: {
          value: p.ink,
          hint: 'Divider, headline and the big star; its grey shade colors the subline',
        },
      },
      fonts: { display: DISPLAY, heading: HEADING },
      copy: {
        wordmark: { label: 'Wordmark', value: 'BRIGHTWAVE' },
        headline: { label: 'Headline', value: 'HOW TO BUILD A BRAND\nTHAT PEOPLE TRUST' },
        subline: {
          label: 'Subline',
          value: 'Five habits that turn first clicks into loyal buyers.',
        },
        studio: STUDIO,
      },
    } as const satisfies ThemeSpec,
    (t) => {
      const font = t.font('heading');
      return [
        rect(0, 0, W, H, t.color('background'), { name: 'Background' }),
        [0, 1, 2, 3].map((index) =>
          text(t.copy('wordmark'), 40, 70 + index * 150, 1000, {
            fontFamily: t.font('display'),
            fontSize: 128,
            fontWeight: 400,
            fill: index % 2 === 0 ? t.color('primary') : t.shade('primary', 'rgba(0,0,0,0)'),
            stroke: t.color('primary'),
            strokeWidth: index % 2 === 0 ? 0 : 3,
            align: 'center',
          }),
        ),
        rect(80, 720, 920, 6, t.color('text'), { name: 'Divider' }),
        text(t.copy('headline'), 80, 780, 920, {
          fontFamily: font,
          fontSize: 66,
          fontWeight: 800,
          fill: t.color('text'),
          lineHeight: 1.12,
        }),
        text(t.copy('subline'), 80, 960, 920, {
          fontFamily: font,
          fontSize: 34,
          fontWeight: 500,
          fill: t.shade('text', '#4b5563'),
        }),
        pill(t.copy('studio'), 80, 1110, {
          fill: t.color('primary'),
          color: t.shade('background', WHITE),
          fontSize: 34,
          fontFamily: font,
          fontWeight: 700,
        }),
        star(5, 880, 1080, 130, t.color('text'), { innerRatio: 0.45 }),
      ];
    },
  );

const TAB_SLOTS = [0, 1, 2, 3, 5];

export const tearOffNote = (p: GrowthPalette): Template =>
  themed(
    W,
    H,
    {
      colors: {
        background: { value: p.ink, hint: 'Page' },
        surface: {
          value: WHITE,
          hint: 'Note and its tear-off tabs; its grey shade colors the dashed perforation',
        },
        text: {
          value: p.ink,
          hint: 'Note headline and every other tab label; its grey shade colors the instruction line',
        },
        primary: { value: p.brand, hint: 'Studio name, the other tab labels and the star' },
        accent: { value: p.accent, hint: 'Tape holding the note (at 85%)' },
      },
      fonts: { heading: HEADING },
      copy: {
        headline: { label: 'Headline', value: 'Take what your brand\nneeds right now with' },
        studio: STUDIO,
        instruction: { label: 'Instruction', value: 'Pull a tab, then send us a message' },
        tabs: { label: 'Tab', value: ['SEO', 'PAID ADS', 'EMAIL', 'WEBSITE', 'BRANDING'] },
      },
    } as const satisfies ThemeSpec,
    (t) => {
      const font = t.font('heading');
      return [
        rect(0, 0, W, H, t.color('background'), { name: 'Background' }),
        rotateNodes(-3, 540, 700, [
          rect(160, 200, 760, 470, t.color('surface'), {
            name: 'Note',
            shadow: { color: 'rgba(0,0,0,0.5)', blur: 40, offsetX: 0, offsetY: 16 },
          }),
          text(t.copy('headline'), 210, 280, 660, {
            fontFamily: font,
            fontSize: 48,
            fontWeight: 800,
            fill: t.color('text'),
            lineHeight: 1.15,
          }),
          text(t.copy('studio'), 210, 400, 660, {
            fontFamily: font,
            fontSize: 52,
            fontWeight: 800,
            fill: t.color('primary'),
          }),
          rect(210, 520, 660, 4, t.shade('surface', '#d1d5db'), {
            dashed: true,
            name: 'Perforation',
          }),
          text(t.copy('instruction'), 210, 560, 660, {
            fontFamily: font,
            fontSize: 28,
            fontWeight: 500,
            fill: t.shade('text', '#6b7280'),
          }),
          t.list('tabs').map((label, item) => {
            const index = TAB_SLOTS[item] ?? item;
            return [
              rect(160 + index * 127, 670, 123, 420, t.color('surface'), {
                name: 'Tear tab',
                shadow: { color: 'rgba(0,0,0,0.3)', blur: 14, offsetX: 0, offsetY: 6 },
              }),
              text(label, 196 + index * 127, 1060, 380, {
                fontFamily: font,
                fontSize: 40,
                fontWeight: 700,
                fill: index % 2 === 0 ? t.color('text') : t.color('primary'),
                rotation: -90,
              }),
            ];
          }),
        ]),
        rect(470, 170, 140, 60, t.shade('accent', 'rgba(255,204,51,0.85)'), {
          rotation: -4,
          name: 'Tape',
        }),
        star(5, 900, 1160, 110, t.color('primary'), { innerRatio: 0.45 }),
      ];
    },
  );

export const gotMail = (p: GrowthPalette): Template =>
  themed(
    W,
    H,
    {
      colors: {
        background: { value: p.paper, hint: 'Page' },
        primary: {
          value: p.brand,
          hint: 'Headline, letter stripe, flag and the newsletter pill',
        },
        secondary: {
          value: p.ink,
          hint: 'Mailbox, post, flag pole and star; its shades color the mailbox opening and the ground shadow',
        },
        surface: {
          value: WHITE,
          hint: 'Letter and the pill label; its grey shade colors the letter lines',
        },
      },
      fonts: { heading: HEADING },
      copy: {
        headline: { label: 'Headline', value: "YOU'VE GOT\nA MAIL!" },
        button: { label: 'Button', value: 'Join our newsletter' },
      },
    } as const satisfies ThemeSpec,
    (t) => {
      const font = t.font('heading');
      const box = t.color('secondary');
      return [
        rect(0, 0, W, H, t.color('background'), { name: 'Background' }),
        text(t.copy('headline'), 0, 130, W, {
          fontFamily: font,
          fontSize: 104,
          fontWeight: 800,
          fill: t.color('primary'),
          align: 'center',
          lineHeight: 1.05,
        }),
        rect(515, 820, 50, 360, box, { name: 'Post' }),
        ellipse(380, 1160, 320, 50, t.shade('secondary', 'rgba(0,0,0,0.12)'), {
          name: 'Ground shadow',
        }),
        rect(330, 560, 420, 280, box, { cornerRadius: 30, name: 'Mailbox' }),
        ellipse(330, 480, 420, 180, box, { name: 'Mailbox top' }),
        rect(360, 610, 300, 200, t.shade('secondary', '#2a2930'), {
          cornerRadius: 16,
          name: 'Mailbox opening',
        }),
        rotateNodes(-12, 450, 640, [
          rect(380, 590, 280, 170, t.color('surface'), { cornerRadius: 8, name: 'Letter' }),
          rect(380, 590, 280, 26, t.color('primary'), { cornerRadius: 8, name: 'Letter stripe' }),
          rect(410, 650, 180, 12, t.shade('surface', '#d1d5db'), {
            cornerRadius: 6,
            name: 'Letter line',
          }),
          rect(410, 680, 120, 12, t.shade('surface', '#d1d5db'), {
            cornerRadius: 6,
            name: 'Letter line',
          }),
        ]),
        rect(750, 520, 20, 200, box, { name: 'Flag pole' }),
        rect(770, 520, 110, 70, t.color('primary'), { name: 'Flag' }),
        pill(t.copy('button'), 330, 1220, {
          fill: t.color('primary'),
          color: t.color('surface'),
          fontSize: 34,
          fontFamily: font,
          fontWeight: 700,
        }),
        star(5, 90, 450, 90, box, { innerRatio: 0.45 }),
      ];
    },
  );

export const closeTo = (p: GrowthPalette): Template =>
  themed(
    W,
    H,
    {
      colors: {
        background: { value: p.brand, hint: 'Page' },
        text: { value: p.paper, hint: 'Both headline lines and the caption' },
        accent: { value: p.accent, hint: 'Dot on the top left corner of the photo' },
        secondary: { value: p.ink, hint: 'Star in the top right' },
      },
      fonts: { heading: HEADING },
      copy: {
        intro: { label: 'Intro', value: "You're this" },
        headline: { label: 'Headline', value: 'Close to...' },
        caption: { label: 'Caption', value: 'Read the full story below' },
      },
    } as const satisfies ThemeSpec,
    (t) => {
      const font = t.font('heading');
      return [
        rect(0, 0, W, H, t.color('background'), { name: 'Background' }),
        text(t.copy('intro'), 90, 170, 800, {
          fontFamily: font,
          fontSize: 54,
          fontWeight: 500,
          fill: t.color('text'),
        }),
        text(t.copy('headline'), 90, 236, 900, {
          fontFamily: font,
          fontSize: 120,
          fontWeight: 800,
          fill: t.color('text'),
        }),
        photo('phone-hand-2', 300, 520, 700, 740, { cornerRadius: 40 }),
        circle(300, 520, 70, t.color('accent')),
        text(t.copy('caption'), 90, 1290, 800, {
          fontFamily: font,
          fontSize: 30,
          fontWeight: 600,
          fill: t.color('text'),
        }),
        star(5, 900, 120, 110, t.color('secondary'), { innerRatio: 0.45 }),
      ];
    },
  );
