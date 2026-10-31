import {
  circle,
  icon,
  type Nodes,
  poly,
  rect,
  shadow,
  type Template,
  type ThemeSpec,
  text,
  themed,
} from '../../../kit';
import { POST, STORY } from '../lagoon-saas-stats/theme';
import {
  bodyStyle,
  type EventDayCopy,
  type EventTheme,
  eventDay,
  fontsOf,
  headStyle,
  type MonthCopy,
  monthCalendar,
  type SaveCopy,
  saveTheDate,
  sparkle,
} from './posts';

interface PlannerCopy {
  title: string;
  subtitle: string;
  ideas: readonly string[];
}

export interface AgendaCopy {
  month: string;
  rows: readonly { day: string; title: string; body: string }[];
}

export interface EventsCopy {
  day: EventDayCopy;
  month: MonthCopy;
  save: SaveCopy;
  planner: PlannerCopy;
  agenda: AgendaCopy;
}

const W = POST.width;

const planner = (theme: EventTheme, copy: PlannerCopy, height: number): Template =>
  themed(
    W,
    height,
    {
      colors: {
        background: { value: '#f6f6f8', hint: 'Page' },
        primary: { value: theme.main, hint: 'Title and the corner triangles' },
        surface: { value: theme.paper, hint: 'Notebook, idea cells and the swipe arrow' },
        text: {
          value: theme.ink,
          hint: 'Subtitle, spiral rings, cell borders, ideas and the swipe button; its light tint colors the note lines',
        },
      },
      fonts: fontsOf(theme),
      copy: {
        title: { label: 'Title', value: copy.title },
        subtitle: { label: 'Subtitle', value: copy.subtitle },
        ideas: { label: 'Idea', value: copy.ideas.slice(0, 9) },
      },
    } as const satisfies ThemeSpec,
    (t): Nodes[] => {
      const head = t.font('heading');
      const extra = height - POST.height;
      const top = 120 + extra * 0.12;
      const gridTop = top + 380;
      const cellHeight = 210 + extra * 0.18;
      const ink = t.color('text');
      const noteLine = t.shade('text', '#d1d5db');
      return [
        rect(0, 0, W, height, t.color('background'), { name: 'Background' }),
        poly(
          [
            [0, gridTop + 60],
            [110, gridTop + 140],
            [0, gridTop + 220],
          ],
          t.color('primary'),
          { name: 'Accent triangle' },
        ),
        poly(
          [
            [W, gridTop + cellHeight * 2],
            [W - 120, gridTop + cellHeight * 2 + 80],
            [W, gridTop + cellHeight * 2 + 170],
          ],
          t.color('primary'),
          { name: 'Accent triangle' },
        ),
        text(t.copy('title'), 0, top, W, {
          ...headStyle(head, 76, t.color('primary')),
          align: 'center',
        }),
        text(t.copy('subtitle'), 0, top + 190, W, {
          ...headStyle(head, 38, ink),
          align: 'center',
        }),
        rect(130, gridTop - 50, 820, cellHeight * 3 + 140, t.color('surface'), {
          name: 'Notebook',
          cornerRadius: 10,
          ...shadow(40, 16, 'rgba(0,0,0,0.18)'),
        }),
        Array.from({ length: 12 }, (_, index) =>
          rect(170 + index * 66, gridTop - 86, 18, 70, ink, {
            name: 'Spiral ring',
            cornerRadius: 9,
          }),
        ),
        t.list('ideas').map((idea, index) => {
          const x = 170 + (index % 3) * 252;
          const y = gridTop + Math.floor(index / 3) * (cellHeight + 18);
          return [
            rect(x, y, 236, cellHeight, t.color('surface'), {
              name: 'Idea cell',
              cornerRadius: 6,
              stroke: ink,
              strokeWidth: 3,
            }),
            text(idea, x + 18, y + 22, 200, bodyStyle(t.font('body'), 26, ink, 700)),
            rect(x + 18, y + cellHeight - 50, 120, 8, noteLine, {
              name: 'Note line',
              cornerRadius: 4,
            }),
            rect(x + 18, y + cellHeight - 30, 170, 8, noteLine, {
              name: 'Note line',
              cornerRadius: 4,
            }),
          ];
        }),
        circle(990, height - 90, 48, ink, { name: 'Swipe button' }),
        icon('arrow-up-right', 966, height - 114, 48, t.color('surface'), { strokeWidth: 2.6 }),
      ];
    },
  );

export const agenda = (theme: EventTheme, copy: AgendaCopy): Template =>
  themed(
    W,
    POST.height,
    {
      colors: {
        background: { value: theme.main, hint: 'Page' },
        surface: { value: theme.paper, hint: 'Date tiles' },
        text: { value: theme.onMain, hint: 'Event titles, descriptions and the sparkles' },
        secondary: {
          value: theme.dark,
          hint: 'Pins and the dates on the tiles; its grey shade colors the month',
        },
        accent: { value: theme.pop, hint: 'Pin heads' },
      },
      fonts: fontsOf(theme),
      copy: {
        month: { label: 'Month', value: copy.month, hint: 'Shown on every date tile' },
        days: { label: 'Date', value: copy.rows.slice(0, 4).map((row) => row.day) },
        titles: { label: 'Event', value: copy.rows.slice(0, 4).map((row) => row.title) },
        bodies: { label: 'Description', value: copy.rows.slice(0, 4).map((row) => row.body) },
      },
    } as const satisfies ThemeSpec,
    (t) => {
      const head = t.font('heading');
      const body = t.font('body');
      const titles = t.list('titles');
      const bodies = t.list('bodies');
      return [
        rect(0, 0, W, POST.height, t.color('background'), { name: 'Background' }),
        sparkle(470, 12, 130, t.color('text')),
        t.list('days').map((day, index) => {
          const y = 160 + index * 290;
          return [
            rect(100, y, 160, 160, t.color('surface'), {
              name: 'Date tile',
              cornerRadius: 6,
              ...shadow(20, 8, 'rgba(0,0,0,0.25)'),
            }),
            text(day, 100, y + 22, 160, {
              ...headStyle(head, 76, t.color('secondary')),
              align: 'center',
              lineHeight: 1,
            }),
            text(t.copy('month'), 100, y + 110, 160, {
              ...bodyStyle(body, 22, t.shade('secondary', '#6b7280'), 700),
              align: 'center',
            }),
            circle(250, y + 6, 18, t.color('secondary'), { name: 'Pin' }),
            circle(250, y + 6, 7, t.color('accent'), { name: 'Pin head' }),
            text(titles[index] ?? '', 310, y + 6, 700, headStyle(head, 54, t.color('text'))),
            text(bodies[index] ?? '', 310, y + 76, 700, bodyStyle(body, 30, t.color('text'))),
          ];
        }),
        sparkle(870, 1150, 160, t.color('text')),
      ];
    },
  );

interface EventSet {
  day: Template;
  month: Template;
  save: Template;
  planner: Template;
  agenda: Template;
  story: Template;
}

export const eventTemplates = (theme: EventTheme, copy: EventsCopy): EventSet => ({
  day: eventDay(theme, copy.day),
  month: monthCalendar(theme, copy.month),
  save: saveTheDate(theme, copy.save),
  planner: planner(theme, copy.planner, POST.height),
  agenda: agenda(theme, copy.agenda),
  story: planner(theme, copy.planner, STORY.height),
});
