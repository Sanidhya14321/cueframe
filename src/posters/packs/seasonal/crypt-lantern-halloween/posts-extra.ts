import { linear } from '@/design';
import {
  icon,
  POST_SIZE,
  poly,
  rect,
  STORY_SIZE,
  star,
  type Template,
  type ThemeSpec,
  text,
  themed,
} from '../../../kit';
import { BODY, bat, COND, CRYPT, HANDLE, SPOOKY } from './palette';

const { width: W, height: H } = POST_SIZE;

const computerSpec = {
  colors: {
    background: {
      value: CRYPT.mustard,
      hint: 'Page gradient and the big number on the screen',
    },
    surface: {
      value: '#ded6c4',
      hint: 'Monitor case; its shades color the disk slot, badge and stand',
    },
    secondary: { value: CRYPT.night, hint: 'Screen and its teal glow' },
    accent: { value: CRYPT.bone, hint: 'Ghost and the screen headline' },
    text: {
      value: CRYPT.ink,
      hint: 'Bats and the handle; its shades color the keyboard and its keys',
    },
  },
  fonts: { heading: COND, body: BODY },
  copy: {
    number: { label: 'Number', value: '3' },
    headline: { label: 'Headline', value: 'Ways to\nRevive Cold\nLeads' },
    handle: HANDLE,
  },
} as const satisfies ThemeSpec;

const computer = (height: number): Template =>
  themed(W, height, computerSpec, (t) => {
    const top = height / 2 - 420;
    return [
      rect(
        0,
        0,
        W,
        height,
        linear(180, t.color('background'), t.shade('background', CRYPT.amber)),
        {
          name: 'Background',
        },
      ),
      bat(120, top + 10, 150, t.color('text')),
      bat(820, top + 60, 120, t.color('text')),
      icon('ghost', 450, top - 10, 180, t.color('accent'), { strokeWidth: 1.6 }),
      rect(170, top + 150, 740, 560, t.color('surface'), { cornerRadius: 44, name: 'Monitor' }),
      rect(220, top + 200, 640, 400, t.color('secondary'), { cornerRadius: 56, name: 'Screen' }),
      rect(
        250,
        top + 230,
        580,
        340,
        linear(150, t.shade('secondary', '#16454a'), t.shade('secondary', CRYPT.deep)),
        { cornerRadius: 46, name: 'Screen glow' },
      ),
      text(t.copy('number'), 270, top + 240, 220, {
        fontFamily: t.font('heading'),
        fontSize: 300,
        fontWeight: 400,
        fill: t.color('background'),
        align: 'center',
      }),
      text(t.copy('headline'), 480, top + 290, 340, {
        fontFamily: t.font('body'),
        fontSize: 54,
        fontWeight: 700,
        fill: t.color('accent'),
        lineHeight: 1.1,
      }),
      rect(560, top + 630, 260, 24, t.shade('surface', '#b9b09c'), {
        cornerRadius: 12,
        name: 'Disk slot',
      }),
      rect(250, top + 628, 60, 30, t.shade('surface', '#b9b09c'), {
        cornerRadius: 8,
        name: 'Badge',
      }),
      rect(430, top + 710, 220, 60, t.shade('surface', '#c9c0ac'), { name: 'Stand' }),
      rect(130, top + 770, 820, 110, t.shade('text', '#2a2a2a'), {
        cornerRadius: 22,
        name: 'Keyboard',
      }),
      Array.from({ length: 36 }, (_, index) =>
        rect(
          160 + (index % 18) * 43,
          top + 792 + Math.floor(index / 18) * 34,
          34,
          26,
          t.shade('text', '#4a4a4a'),
          { cornerRadius: 6, name: 'Key' },
        ),
      ),
      text(t.copy('handle'), 0, height - 120, W, {
        fontFamily: t.font('body'),
        fontSize: 32,
        fontWeight: 600,
        fill: t.color('text'),
        align: 'center',
      }),
    ];
  });

export const computerPost = computer(H);
export const computerStory = computer(STORY_SIZE.height);

const torn = (x: number, y: number, width: number, height: number, fill: string) => {
  const step = 40;
  const jag = [0, 12, 4, 16, 6];
  const across = Math.floor(width / step);
  const down = Math.floor(height / step);
  const pick = (index: number) => jag[index % jag.length] ?? 0;
  const topEdge = Array.from(
    { length: across + 1 },
    (_, index) => [x + index * (width / across), y + pick(index)] as const,
  );
  const rightEdge = Array.from(
    { length: down + 1 },
    (_, index) => [x + width - pick(index + 2), y + index * (height / down)] as const,
  );
  const bottomEdge = Array.from(
    { length: across + 1 },
    (_, index) => [x + width - index * (width / across), y + height - pick(index + 1)] as const,
  );
  const leftEdge = Array.from(
    { length: down + 1 },
    (_, index) => [x + pick(index + 3), y + height - index * (height / down)] as const,
  );
  return poly([...topEdge, ...rightEdge, ...bottomEdge, ...leftEdge], fill, {
    name: 'Torn paper',
  });
};

interface ComicCopy {
  backdrop: string;
  panel: string;
  burstRole: 'primary' | 'background';
  burstText: string;
  claw: string;
  presenter: string;
  subtitle: string;
}

const comicSpec = (copy: ComicCopy) =>
  ({
    colors: {
      background: {
        value: copy.backdrop,
        hint:
          copy.burstRole === 'background'
            ? 'Page behind the torn paper and the date burst'
            : 'Page behind the torn paper',
      },
      surface: { value: copy.panel, hint: 'Torn paper panel' },
      primary: {
        value: CRYPT.blood,
        hint:
          copy.burstRole === 'primary' ? 'Presenter strip and the date burst' : 'Presenter strip',
      },
      secondary: { value: copy.claw, hint: 'Claw marks' },
      text: {
        value: CRYPT.bone,
        hint: 'Price box, presenter line, HALLOWEEN title and subtitle; its shades color the price box text and the burst date',
      },
    },
    fonts: {
      heading: COND,
      spooky: SPOOKY,
      marker: { label: 'Marker font', value: 'Permanent Marker' },
    },
    copy: {
      issue: { label: 'Price box title', value: 'HALLO\nWEEN' },
      price: { label: 'Price', value: '25¢  ·  No 1' },
      presenter: { label: 'Presenter', value: copy.presenter },
      date: { label: 'Date', value: 'OCT\n31' },
      title: { label: 'Title', value: 'HALLO\nWEEN' },
      subtitle: { label: 'Subtitle', value: copy.subtitle },
    },
  }) as const satisfies ThemeSpec;

const comic = (copy: ComicCopy): Template =>
  themed(W, H, comicSpec(copy), (t) => [
    rect(0, 0, W, H, t.color('background'), { name: 'Background' }),
    torn(40, 40, 1000, 1270, t.color('surface')),
    rect(80, 90, 170, 160, t.color('text'), { name: 'Price box' }),
    text(t.copy('issue'), 80, 100, 170, {
      fontFamily: t.font('heading'),
      fontSize: 34,
      fontWeight: 400,
      fill: t.shade('text', CRYPT.ink),
      align: 'center',
      lineHeight: 0.95,
    }),
    text(t.copy('price'), 80, 184, 170, {
      fontFamily: t.font('heading'),
      fontSize: 40,
      fontWeight: 400,
      fill: t.shade('text', CRYPT.ink),
      align: 'center',
    }),
    rect(250, 90, 750, 72, t.color('primary'), { name: 'Presenter strip' }),
    text(t.copy('presenter'), 250, 100, 750, {
      fontFamily: t.font('heading'),
      fontSize: 56,
      fontWeight: 400,
      fill: t.color('text'),
      align: 'center',
      letterSpacing: 6,
    }),
    star(18, 790, 190, 190, t.color(copy.burstRole), { innerRatio: 0.78 }),
    text(t.copy('date'), 790, 235, 190, {
      fontFamily: t.font('heading'),
      fontSize: 52,
      fontWeight: 400,
      fill: t.shade('text', copy.burstText),
      align: 'center',
      lineHeight: 0.95,
    }),
    text(t.copy('title'), 0, 330, W, {
      fontFamily: t.font('spooky'),
      fontSize: 300,
      fontWeight: 400,
      fill: t.color('text'),
      align: 'center',
      lineHeight: 0.92,
    }),
    [380, 500, 620].map((x) =>
      poly(
        [
          [x, 520],
          [x + 46, 520],
          [x + 116, 980],
          [x + 92, 1000],
        ],
        t.color('secondary'),
        { name: 'Claw mark' },
      ),
    ),
    text(t.copy('subtitle'), 0, 1080, W, {
      fontFamily: t.font('marker'),
      fontSize: 92,
      fontWeight: 400,
      fill: t.color('text'),
      align: 'center',
    }),
  ]);

export const comicCover = comic({
  backdrop: CRYPT.deep,
  panel: CRYPT.teal,
  burstRole: 'primary',
  burstText: CRYPT.bone,
  claw: CRYPT.ink,
  presenter: 'YOUR BRAND PRESENTS',
  subtitle: 'LATE NIGHT Q&A',
});

export const comicRemix = comic({
  backdrop: CRYPT.ink,
  panel: CRYPT.amber,
  burstRole: 'background',
  burstText: CRYPT.mustard,
  claw: CRYPT.wine,
  presenter: 'NIGHTSHADE PRESENTS',
  subtitle: 'GAME NIGHT',
});
