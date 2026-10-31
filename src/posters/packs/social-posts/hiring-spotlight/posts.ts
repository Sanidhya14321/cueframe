import {
  checklist,
  group,
  photo,
  pill,
  poly,
  rect,
  star,
  type ThemeSpec,
  text,
  themed,
} from '../../../kit';

export interface HiringTheme {
  brand: string;
  ink: string;
  paper: string;
  accent: string;
}

export const COBALT: HiringTheme = {
  brand: '#3b5bfd',
  ink: '#0b0d17',
  paper: '#fff6ea',
  accent: '#ffd23f',
};

export const PLUM: HiringTheme = {
  brand: '#7a2e5c',
  ink: '#1c0f18',
  paper: '#fdf1f6',
  accent: '#ff9f68',
};

export const POST = { width: 1080, height: 1350 } as const;

export const HEADING = { label: 'Heading font', value: 'Outfit' } as const;
export const BODY = { label: 'Body font', value: 'Inter' } as const;
export const DISPLAY = { label: 'Display font', value: 'Anton' } as const;
export const GREY = '#4b5563';
export const SILVER = '#d1d5db';

export const weAreHiring = (theme: HiringTheme) =>
  themed(
    POST.width,
    POST.height,
    {
      colors: {
        background: { value: theme.brand, hint: 'Page behind everything' },
        surface: {
          value: theme.paper,
          hint: 'Diagonal band, photo frame, small star, the We are Hiring headline, the Join line and the Apply now label',
        },
        accent: { value: theme.accent, hint: 'Job title and the big star' },
        secondary: { value: theme.ink, hint: 'Apply now button' },
      },
      fonts: { heading: HEADING, body: BODY },
      copy: {
        intro: { label: 'Intro', value: 'We are' },
        title: { label: 'Headline', value: 'Hiring' },
        lead: { label: 'Lead-in', value: 'Join our team as a' },
        role: { label: 'Job title', value: 'PRODUCT DESIGNER' },
        cta: { label: 'Button', value: 'Apply now' },
      },
    } as const satisfies ThemeSpec,
    (t) => [
      rect(0, 0, POST.width, POST.height, t.color('background'), { name: 'Background' }),
      poly(
        [
          [0, 1180],
          [POST.width, 520],
          [POST.width, 690],
          [0, 1350],
        ],
        t.color('surface'),
        { name: 'Diagonal band' },
      ),
      text(t.copy('intro'), 80, 110, 600, {
        fontFamily: t.font('heading'),
        fontSize: 64,
        fontWeight: 500,
        fill: t.color('surface'),
      }),
      text(t.copy('title'), 80, 180, 800, {
        fontFamily: t.font('heading'),
        fontSize: 190,
        fontWeight: 800,
        fill: t.color('surface'),
        lineHeight: 1,
      }),
      text(t.copy('lead'), 80, 400, 700, {
        fontFamily: t.font('body'),
        fontSize: 40,
        fontWeight: 500,
        fill: t.color('surface'),
      }),
      text(t.copy('role'), 80, 452, 900, {
        fontFamily: t.font('body'),
        fontSize: 52,
        fontWeight: 800,
        fill: t.color('accent'),
        letterSpacing: 2,
      }),
      photo('team-3', 560, 640, 440, 520, {
        cornerRadius: 36,
        stroke: t.color('surface'),
        strokeWidth: 10,
      }),
      star(5, 900, 90, 110, t.color('accent'), { innerRatio: 0.42 }),
      star(5, 120, 1010, 70, t.color('surface'), { innerRatio: 0.42 }),
      pill(t.copy('cta'), 80, 1180, {
        fill: t.color('secondary'),
        color: t.color('surface'),
        fontSize: 34,
        fontFamily: t.font('body'),
      }),
    ],
  );

export const spotlightBadge = (theme: HiringTheme) =>
  themed(
    POST.width,
    POST.height,
    {
      colors: {
        background: { value: theme.brand, hint: 'Page behind the badge' },
        surface: { value: theme.paper, hint: 'Badge card and the closing line' },
        secondary: {
          value: theme.ink,
          hint: 'Lanyard, back card, badge slot and TEAM SPOTLIGHT',
        },
        accent: { value: theme.accent, hint: 'Team News and the star' },
        text: { value: GREY, hint: 'Name line on the badge' },
      },
      fonts: { heading: HEADING, body: BODY },
      copy: {
        kicker: { label: 'Side label', value: 'Team News' },
        title: { label: 'Title', value: 'TEAM\nSPOTLIGHT' },
        name: { label: 'Name line', value: 'Meet Priya Nair' },
        closing: { label: 'Closing line', value: 'Our new Growth Lead says hello!' },
      },
    } as const satisfies ThemeSpec,
    (t) => [
      rect(0, 0, POST.width, POST.height, t.color('background'), { name: 'Background' }),
      rect(505, 0, 70, 260, t.color('secondary'), { cornerRadius: 12, name: 'Lanyard' }),
      rect(230, 340, 520, 680, t.color('secondary'), {
        cornerRadius: 40,
        rotation: -8,
        name: 'Back card',
      }),
      text(t.copy('kicker'), 270, 860, 360, {
        fontFamily: t.font('heading'),
        fontSize: 56,
        fontWeight: 700,
        fill: t.color('accent'),
        rotation: -98,
      }),
      group(
        rect(330, 230, 460, 700, t.color('surface'), { cornerRadius: 40, name: 'Badge' }),
        rect(490, 260, 140, 26, t.color('secondary'), { cornerRadius: 13, name: 'Badge slot' }),
        photo('woman-portrait-2', 375, 320, 370, 370, { cornerRadius: 28 }),
        text(t.copy('title'), 375, 720, 380, {
          fontFamily: t.font('heading'),
          fontSize: 52,
          fontWeight: 800,
          fill: t.color('secondary'),
          lineHeight: 1,
        }),
        text(t.copy('name'), 375, 840, 380, {
          fontFamily: t.font('body'),
          fontSize: 30,
          fontWeight: 500,
          fill: t.color('text'),
        }),
      ),
      star(5, 760, 200, 130, t.color('accent'), { innerRatio: 0.42 }),
      text(t.copy('closing'), 90, 1150, 900, {
        fontFamily: t.font('heading'),
        fontSize: 46,
        fontWeight: 700,
        fill: t.color('surface'),
        align: 'center',
      }),
    ],
  );

export const verticalHiring = (theme: HiringTheme) =>
  themed(
    POST.width,
    POST.height,
    {
      colors: {
        background: { value: theme.ink, hint: 'Page and the We are label on the tag' },
        primary: { value: theme.brand, hint: 'Giant vertical HIRING word' },
        surface: {
          value: theme.paper,
          hint: 'Tag, star, job title and the section headings',
        },
        accent: { value: theme.accent, hint: 'Arrows in front of every list row' },
        text: { value: SILVER, hint: 'List rows and the contact line' },
      },
      fonts: { display: DISPLAY, heading: HEADING, body: BODY },
      copy: {
        word: { label: 'Vertical word', value: 'HIRING' },
        tag: { label: 'Tag', value: 'We are' },
        role: { label: 'Job title', value: 'Brand Designer' },
        perks: {
          label: 'Project',
          value: ['Social media visuals', 'Packaging refresh', 'Three launches a year'],
        },
        dutiesTitle: { label: 'Duties heading', value: 'What you will do' },
        duties: {
          label: 'Duty',
          value: ['Own the visual system', 'Ship weekly campaigns', 'Mentor two juniors'],
        },
        joinTitle: { label: 'Contact heading', value: 'Join our crew' },
        contact: { label: 'Contact', value: 'Send your portfolio to\njobs@northwind.studio' },
      },
    } as const satisfies ThemeSpec,
    (t) => {
      const list = {
        color: t.color('text'),
        iconColor: t.color('accent'),
        icon: 'arrow-right',
        fontSize: 32,
        fontFamily: t.font('body'),
      } as const;
      const heading = (content: string, y: number, fontSize: number) =>
        text(content, 500, y, 520, {
          fontFamily: t.font('heading'),
          fontSize,
          fontWeight: 800,
          fill: t.color('surface'),
        });
      return [
        rect(0, 0, POST.width, POST.height, t.color('background'), { name: 'Background' }),
        text(t.copy('word'), 60, 1290, 1200, {
          fontFamily: t.font('display'),
          fontSize: 330,
          fontWeight: 400,
          fill: t.color('primary'),
          rotation: -90,
          letterSpacing: 6,
        }),
        rect(80, 1030, 64, 230, t.color('surface'), { cornerRadius: 10, name: 'Tag' }),
        text(t.copy('tag'), 100, 1250, 220, {
          fontFamily: t.font('body'),
          fontSize: 34,
          fontWeight: 700,
          fill: t.color('background'),
          rotation: -90,
        }),
        star(5, 70, 90, 90, t.color('surface'), { innerRatio: 0.42 }),
        heading(t.copy('role'), 150, 60),
        checklist(t.list('perks'), 500, 260, 520, list),
        heading(t.copy('dutiesTitle'), 540, 52),
        checklist(t.list('duties'), 500, 640, 520, list),
        heading(t.copy('joinTitle'), 930, 52),
        text(t.copy('contact'), 500, 1010, 520, {
          fontFamily: t.font('body'),
          fontSize: 32,
          fontWeight: 500,
          fill: t.color('text'),
          lineHeight: 1.4,
        }),
      ];
    },
  );
