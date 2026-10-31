import { linear } from '@/design';
import {
  ellipse,
  icon,
  line,
  photo,
  poly,
  rect,
  rotateNodes,
  STORY_SIZE,
  shadow,
  type ThemeSpec,
  text,
  themed,
} from '../../../kit';
import { brandLine, FONT, H, HANDLE, MINT, starReviews, W, webinarNote, writer } from './posts';
import { connectingTeams, ideasResults, struggling } from './posts-team';
import { fourThings, shareThis } from './posts-tips';

const brandMistakesSpec = {
  colors: {
    background: {
      value: MINT.paper,
      hint: 'Page; its lighter shade colors the words on the tags',
    },
    primary: {
      value: MINT.green,
      hint: 'Big number, dashed lines and the tags; its darker shade colors the handle',
    },
    text: { value: MINT.ink, hint: 'Title and the mistake descriptions' },
  },
  fonts: { body: FONT },
  copy: {
    number: { label: 'Number', value: '3' },
    title: { label: 'Title', value: 'Brand\nMistakes' },
    tags: { label: 'Mistake', value: ['Inconsistent', 'Confusing', 'Vague'] },
    bodies: {
      label: 'Description',
      value: [
        'Mixing visuals and voices\nacross channels blurs\nwho you really are.',
        'Copying rivals instead of\nstanding apart leaves\nbuyers unsure.',
        'A fuzzy promise makes\nyour brand easy to\nforget and skip.',
      ],
    },
    handle: HANDLE,
  },
} as const satisfies ThemeSpec;

const brandMistakes = themed(W, H, brandMistakesSpec, (t) => {
  const say = writer(t.font('body'));
  const bodies = t.list('bodies');
  return [
    rect(0, 0, W, H, t.color('background'), { name: 'Background' }),
    say(t.copy('number'), 80, 70, 260, 320, t.color('primary'), 800),
    say(t.copy('title'), 300, 130, 700, 100, t.color('text'), 700),
    line(130, 450, 690, t.color('primary'), 4, { dashed: true, rotation: 90 }),
    t.list('tags').map((tag, index) => {
      const y = 500 + index * 240;
      return [
        line(130, y + 40, 80, t.color('primary'), 4, { dashed: true }),
        rect(220, y, 270, 80, t.color('primary'), { name: 'Tag', cornerRadius: 40 }),
        say(tag, 220, y + 20, 270, 32, t.shade('background', MINT.white), 700, 'center'),
        say(bodies[index] ?? '', 530, y - 10, 480, 30, t.color('text'), 500),
      ];
    }),
    brandLine(t.copy('handle'), 1240, t.shade('primary', MINT.deep), t.font('body')),
  ];
});

const invitedEnvelopeSpec = {
  colors: {
    background: { value: MINT.black, hint: 'Page and the sign up pill' },
    surface: { value: MINT.white, hint: 'Invite card and the sign up label' },
    primary: {
      value: MINT.green,
      hint: 'ONLINE WEBINAR, the envelope pocket and the icons; its darker shade colors the envelope back and the script line',
    },
    text: { value: MINT.white, hint: 'Place and date lines' },
  },
  fonts: { body: FONT, script: { label: 'Script font', value: 'Caveat' } },
  copy: {
    script: { label: 'Script line', value: "You're invited" },
    title: { label: 'Title', value: 'ONLINE\nWEBINAR' },
    button: { label: 'Button', value: 'Sign up today!' },
    details: { label: 'Detail', value: ['Live online, everywhere', 'June 3, 2027'] },
  },
} as const satisfies ThemeSpec;

const invitedEnvelope = themed(W, H, invitedEnvelopeSpec, (t) => {
  const say = writer(t.font('body'));
  const [place = '', date = ''] = t.list('details');
  return [
    rect(0, 0, W, H, t.color('background'), { name: 'Background' }),
    rect(200, 520, 680, 520, t.shade('primary', MINT.deep), {
      name: 'Envelope back',
      cornerRadius: 22,
    }),
    rotateNodes(-4, 540, 560, [
      rect(260, 300, 560, 540, t.color('surface'), {
        name: 'Invite card',
        cornerRadius: 12,
        ...shadow(30, 10, 'rgba(0,0,0,0.4)'),
      }),
      text(t.copy('script'), 260, 330, 560, {
        fontFamily: t.font('script'),
        fontSize: 64,
        fontWeight: 700,
        fill: t.shade('primary', MINT.deep),
        align: 'center',
      }),
      say(t.copy('title'), 260, 420, 560, 92, t.color('primary'), 800, 'center'),
      rect(400, 640, 280, 66, t.color('background'), { name: 'Sign up pill', cornerRadius: 33 }),
      say(t.copy('button'), 400, 655, 280, 30, t.color('surface'), 700, 'center'),
    ]),
    poly(
      [
        [200, 690],
        [540, 880],
        [880, 690],
        [880, 1018],
        [858, 1040],
        [222, 1040],
        [200, 1018],
      ],
      linear(160, t.shade('primary', MINT.light), t.shade('primary', MINT.deep)),
      { name: 'Envelope pocket', ...shadow(30, -6, 'rgba(0,0,0,0.35)') },
    ),
    icon('map-pin', 360, 1110, 42, t.color('primary')),
    say(place, 420, 1114, 500, 32, t.color('text'), 500),
    icon('calendar-days', 360, 1180, 42, t.color('primary')),
    say(date, 420, 1184, 500, 32, t.color('text'), 500),
  ];
});

const PEOPLE = [
  { x: 80, y: 480, face: 'woman-portrait-4' as const },
  { x: 390, y: 440, face: 'man-portrait-3' as const },
  { x: 700, y: 480, face: 'woman-portrait-5' as const },
];

const hiringPositionsSpec = {
  colors: {
    background: { value: MINT.black, hint: 'Page, Positions and the role names' },
    surface: { value: MINT.white, hint: 'Photo frames and the role chips' },
    primary: { value: MINT.green, hint: 'Highlight behind Positions' },
    text: {
      value: MINT.white,
      hint: "We're Hiring; its shades color the faint ring and the apply line",
    },
  },
  fonts: { body: FONT },
  copy: {
    title: { label: 'Title', value: "We're Hiring" },
    highlight: { label: 'Highlighted word', value: 'Positions' },
    roles: { label: 'Role', value: ['Social Lead', 'Design Director', 'Content Strategist'] },
    apply: { label: 'Apply line', value: 'Apply at brightlane.studio/careers' },
  },
} as const satisfies ThemeSpec;

const hiringPositions = themed(W, H, hiringPositionsSpec, (t) => {
  const say = writer(t.font('body'));
  const roles = t.list('roles');
  return [
    rect(0, 0, W, H, t.color('background'), { name: 'Background' }),
    ellipse(140, 300, 800, 800, t.shade('text', MINT.clear), {
      name: 'Ring',
      stroke: t.shade('text', 'rgba(255,255,255,0.08)'),
      strokeWidth: 40,
    }),
    say(t.copy('title'), 0, 120, W, 100, t.color('text'), 800, 'center'),
    rect(320, 245, 440, 112, t.color('primary'), { name: 'Highlight', cornerRadius: 12 }),
    say(t.copy('highlight'), 320, 254, 440, 84, t.color('background'), 800, 'center'),
    PEOPLE.map((person, index) => [
      photo(person.face, person.x, person.y, 300, 560, {
        cornerRadius: 40,
        stroke: t.color('surface'),
        strokeWidth: 6,
      }),
      rect(person.x + 10, person.y + 500, 280, 64, t.color('surface'), {
        name: 'Role chip',
        cornerRadius: 32,
        ...shadow(20, 8, 'rgba(0,0,0,0.4)'),
      }),
      say(
        roles[index] ?? '',
        person.x + 10,
        person.y + 518,
        280,
        24,
        t.color('background'),
        700,
        'center',
      ),
    ]),
    say(t.copy('apply'), 0, 1170, W, 32, t.shade('text', MINT.grey), 500, 'center'),
  ];
});

export const strugglingPost = struggling(H);
export const strugglingStory = struggling(STORY_SIZE.height);

export const POSTS = [
  connectingTeams,
  starReviews,
  ideasResults,
  brandMistakes,
  webinarNote,
  strugglingPost,
  fourThings,
  shareThis,
  invitedEnvelope,
  hiringPositions,
];
