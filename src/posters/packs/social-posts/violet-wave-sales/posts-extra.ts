import { circle, icon, photo, rect, rotateNodes, type ThemeSpec, themed } from '../../../kit';
import {
  BODY,
  buildPills,
  copy,
  H,
  HANDLE,
  HEADING,
  handle,
  opportunities,
  PW,
  tag,
  unlockInsights,
  verbList,
  W,
} from './posts';
import { badHabits, expertsBuilt, feedbackQuote } from './posts-more';

const nowWhatSpec = {
  colors: {
    primary: { value: PW.violet, hint: 'Page' },
    surface: { value: PW.white, hint: 'Intro, the now what? label, the arrow circle and the link' },
    text: { value: PW.ink, hint: 'The now what? pill, the arrow and the rule above the photo' },
  },
  fonts: { heading: HEADING, body: BODY },
  copy: {
    intro: { label: 'Intro', value: "You've integrated\nthe framework..." },
    tag: { label: 'Pill', value: 'now what?' },
    link: { label: 'Link', value: 'Learn to scale search traffic today' },
  },
} as const satisfies ThemeSpec;

const nowWhat = themed(W, H, nowWhatSpec, (t) => {
  const body = copy(t.font('body'));
  return [
    rect(0, 0, W, H, t.color('primary'), { name: 'Background' }),
    body(t.copy('intro'), 90, 130, 900, 68, t.color('surface'), {
      fontWeight: 500,
      lineHeight: 1.2,
    }),
    tag(t.copy('tag'), 90, 330, t.color('text'), t.color('surface'), 56, t.font('heading')),
    circle(118, 528, 28, t.color('surface')),
    icon('arrow-right', 100, 510, 36, t.color('text'), { strokeWidth: 2.6 }),
    body(t.copy('link'), 165, 507, 800, 34, t.color('surface')),
    photo('workspace-1', 0, 660, W, 690, { crop: { zoom: 1, focusX: 0.5, focusY: 0.5 } }),
    rect(0, 660, W, 10, t.color('text'), { name: 'Rule' }),
  ];
});

const teamSpec = {
  colors: {
    background: {
      value: PW.ink,
      hint: 'Shade over the photo and the Strategy label',
    },
    primary: { value: PW.violet, hint: 'Insights pill and the Results outline' },
    surface: {
      value: PW.white,
      hint: 'Strategy pill, the Insights and Results labels and the handle',
    },
  },
  fonts: { heading: HEADING, body: BODY },
  copy: {
    pills: { label: 'Pill', value: ['Insights', 'Strategy', 'Results'] },
    handle: HANDLE,
  },
} as const satisfies ThemeSpec;

const teamPills = (height: number) =>
  themed(W, height, teamSpec, (t) => {
    const middle = height / 2;
    const [insights = '', strategy = '', results = ''] = t.list('pills');
    const head = t.font('heading');
    return [
      rect(0, 0, W, height, t.color('background'), { name: 'Background' }),
      photo('team-1', 0, 0, W, height, { crop: { zoom: 1, focusX: 0.5, focusY: 0.5 } }),
      rect(0, 0, W, height, t.shade('background', 'rgba(20,17,43,0.5)'), { name: 'Shade' }),
      rotateNodes(-6, 480, middle - 170, [
        tag(insights, 280, middle - 250, t.color('primary'), t.color('surface'), 64, head),
      ]),
      rotateNodes(4, 600, middle, [
        tag(strategy, 400, middle - 76, t.color('surface'), t.color('background'), 64, head),
      ]),
      rotateNodes(-3, 500, middle + 180, [
        tag(
          results,
          320,
          middle + 100,
          t.shade('primary', 'rgba(0,0,0,0)'),
          t.color('surface'),
          64,
          head,
          t.color('primary'),
        ),
      ]),
      handle(t.copy('handle'), height - 110, t.color('surface'), t.font('body')),
    ];
  });

export const teamPost = teamPills(H);
export const teamStory = teamPills(1920);

export const POSTS = [
  buildPills,
  opportunities,
  unlockInsights,
  verbList,
  expertsBuilt,
  badHabits,
  feedbackQuote,
  nowWhat,
  teamPost,
];
