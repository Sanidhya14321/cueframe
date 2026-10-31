import { linear } from '@/design';
import { icon, photo, pill, rect, text, themed } from '../../../kit';
import { BODY, crest, FOX, HEADING, TITLE } from './palette';
import { H, W } from './posts';

export const topFive = themed(
  W,
  H,
  {
    colors: {
      background: {
        value: FOX.ink,
        hint: 'Page, and the rank, record and crown on the top row',
      },
      primary: {
        value: FOX.blaze,
        hint: 'Top rule, TOP 5, the top row and the other rank numbers',
      },
      surface: { value: FOX.smoke, hint: 'The other poll rows' },
      text: {
        value: FOX.white,
        hint: 'POWER POLL, team names and shield icons; its grey shade colors the records and the footer',
      },
    },
    fonts: { title: TITLE, heading: HEADING, body: BODY },
    copy: {
      title: { label: 'Title', value: 'TOP 5' },
      subtitle: { label: 'Subtitle', value: 'POWER POLL' },
      ranks: { label: 'Rank', value: ['1', '2', '3', '4', '5'] },
      teams: { label: 'Team', value: ['FOXES', 'KNIGHTS', 'RAMS', 'OWLS', 'WOLVES'] },
      records: { label: 'Record', value: ['9-0', '8-1', '7-1', '7-2', '6-3'] },
      footer: { label: 'Footer', value: 'Week 9 standings  ·  Valley Conference' },
    },
  },
  (t) => {
    const ranks = t.list('ranks');
    const records = t.list('records');
    const grey = t.shade('text', FOX.grey);
    return [
      rect(0, 0, W, H, t.color('background'), { name: 'Background' }),
      rect(0, 0, W, 16, t.color('primary'), { name: 'Top rule' }),
      text(t.copy('title'), 0, 90, W, {
        fontFamily: t.font('title'),
        fontSize: 170,
        fontWeight: 400,
        fill: t.color('primary'),
        align: 'center',
        lineHeight: 1,
      }),
      text(t.copy('subtitle'), 0, 270, W, {
        fontFamily: t.font('title'),
        fontSize: 84,
        fontWeight: 400,
        fill: t.color('text'),
        align: 'center',
        lineHeight: 1,
      }),
      t.list('teams').map((team, index) => {
        const y = 450 + index * 150;
        const lead = index === 0;
        return [
          rect(90, y, 900, 120, lead ? t.color('primary') : t.color('surface'), {
            cornerRadius: 20,
            name: 'Poll row',
          }),
          text(ranks[index] ?? '', 120, y + 18, 90, {
            fontFamily: t.font('heading'),
            fontSize: 72,
            fontWeight: 400,
            fill: lead ? t.color('background') : t.color('primary'),
            align: 'center',
          }),
          text(team, 240, y + 24, 400, {
            fontFamily: t.font('body'),
            fontSize: 62,
            fontWeight: 700,
            fill: t.color('text'),
            letterSpacing: 2,
          }),
          text(records[index] ?? '', 640, y + 34, 160, {
            fontFamily: t.font('body'),
            fontSize: 44,
            fontWeight: 600,
            fill: lead ? t.color('background') : grey,
            align: 'right',
          }),
          icon(
            lead ? 'crown' : 'shield',
            870,
            y + 30,
            60,
            lead ? t.color('background') : t.color('text'),
          ),
        ];
      }),
      text(t.copy('footer'), 0, 1240, W, {
        fontFamily: t.font('body'),
        fontSize: 34,
        fontWeight: 500,
        fill: grey,
        align: 'center',
        letterSpacing: 2,
      }),
    ];
  },
);

export const gameStats = themed(
  W,
  H,
  {
    colors: {
      background: { value: FOX.ink, hint: 'Page and the fade under the photo' },
      primary: { value: FOX.blaze, hint: 'Foxes pill and the Foxes numbers' },
      secondary: { value: FOX.rival, hint: 'Rams pill and the Rams numbers' },
      surface: { value: FOX.smoke, hint: 'Stat rows' },
      text: { value: FOX.white, hint: 'GAME STATS, the team pill labels and the stat names' },
    },
    fonts: { heading: HEADING, body: BODY },
    copy: {
      title: { label: 'Title', value: 'GAME STATS' },
      teams: { label: 'Team', value: ['FOXES', 'RAMS'] },
      home: { label: 'Foxes stat', value: ['418', '271', '147'] },
      labels: { label: 'Stat name', value: ['TOTAL YARDS', 'PASS YARDS', 'RUSH YARDS'] },
      away: { label: 'Rams stat', value: ['352', '230', '122'] },
    },
  },
  (t) => {
    const [home = '', away = ''] = t.list('teams');
    const homeStats = t.list('home');
    const awayStats = t.list('away');
    const team = (label: string, x: number, fill: string) =>
      pill(label, x, 810, {
        width: 260,
        fill,
        color: t.color('text'),
        fontSize: 34,
        fontFamily: t.font('body'),
        fontWeight: 700,
        letterSpacing: 3,
      });
    const number = (value: string, x: number, y: number, fill: string) =>
      text(value, x, y + 16, 180, {
        fontFamily: t.font('heading'),
        fontSize: 58,
        fontWeight: 400,
        fill,
        align: 'center',
      });
    return [
      rect(0, 0, W, H, t.color('background'), { name: 'Background' }),
      photo('football-1', 0, 0, W, 640, { name: 'Hero' }),
      rect(
        0,
        420,
        W,
        230,
        linear(180, t.shade('background', 'rgba(20,20,20,0)'), t.color('background')),
        { name: 'Fade' },
      ),
      text(t.copy('title'), 0, 640, W, {
        fontFamily: t.font('heading'),
        fontSize: 120,
        fontWeight: 400,
        fill: t.color('text'),
        align: 'center',
      }),
      team(home, 250, t.color('primary')),
      team(away, 570, t.color('secondary')),
      t.list('labels').map((label, index) => {
        const y = 920 + index * 120;
        return [
          rect(110, y, 860, 96, t.color('surface'), { cornerRadius: 16, name: 'Stat row' }),
          number(homeStats[index] ?? '', 140, y, t.color('primary')),
          text(label, 340, y + 26, 400, {
            fontFamily: t.font('body'),
            fontSize: 40,
            fontWeight: 700,
            fill: t.color('text'),
            align: 'center',
            letterSpacing: 4,
          }),
          number(awayStats[index] ?? '', 760, y, t.color('secondary')),
        ];
      }),
    ];
  },
);

export const finalScore = themed(
  W,
  H,
  {
    colors: {
      background: { value: FOX.ink, hint: 'Page behind the field photo' },
      primary: { value: FOX.blaze, hint: 'Score panel, the crest icon and FINAL' },
      text: {
        value: FOX.ink,
        hint: 'Crest, team names, the FINAL tag, the losing score and the date',
      },
      accent: { value: FOX.white, hint: 'Winning score' },
    },
    fonts: { heading: HEADING, body: BODY },
    copy: {
      teams: { label: 'Team', value: ['FOXES', 'RAMS'] },
      scores: { label: 'Score', value: ['31', '24'] },
      tag: { label: 'Tag', value: 'FINAL' },
      date: { label: 'Date', value: 'OCT 10  ·  WEEK 6' },
    },
  },
  (t) => {
    const [home = '', away = ''] = t.list('teams');
    const [win = '', lose = ''] = t.list('scores');
    const team = (label: string, y: number) =>
      text(label, 700, y, 380, {
        fontFamily: t.font('body'),
        fontSize: 48,
        fontWeight: 700,
        fill: t.color('text'),
        align: 'center',
        letterSpacing: 6,
      });
    const score = (value: string, y: number, fill: string) =>
      text(value, 700, y, 380, {
        fontFamily: t.font('heading'),
        fontSize: 230,
        fontWeight: 400,
        fill,
        align: 'center',
      });
    return [
      rect(0, 0, W, H, t.color('background'), { name: 'Background' }),
      photo('football-field', 0, 0, 700, H, { name: 'Field' }),
      rect(700, 0, 380, H, t.color('primary'), { name: 'Score panel' }),
      crest(830, 90, 120, t.color('text'), 'flame', t.color('primary')),
      team(home, 260),
      score(win, 310, t.color('accent')),
      rect(760, 640, 260, 70, t.color('text'), { cornerRadius: 35, name: 'Final tag' }),
      text(t.copy('tag'), 760, 652, 260, {
        fontFamily: t.font('body'),
        fontSize: 40,
        fontWeight: 700,
        fill: t.color('primary'),
        align: 'center',
        letterSpacing: 8,
      }),
      score(lose, 740, t.color('text')),
      team(away, 1040),
      text(t.copy('date'), 700, 1220, 380, {
        fontFamily: t.font('body'),
        fontSize: 30,
        fontWeight: 600,
        fill: t.color('text'),
        align: 'center',
        letterSpacing: 3,
      }),
    ];
  },
);

export const playerOfWeek = themed(
  W,
  H,
  {
    colors: {
      background: { value: FOX.cream, hint: 'Page' },
      primary: {
        value: FOX.blaze,
        hint: 'OF THE tag, WEEK and RUSH YARDS; its darker shade colors the position line',
      },
      text: {
        value: FOX.ink,
        hint: 'PLAYER, the player name and the dark fade over the photo',
      },
      surface: { value: FOX.white, hint: 'OF THE and the stat number' },
    },
    fonts: { heading: HEADING, title: TITLE, body: BODY },
    copy: {
      title: { label: 'Title', value: 'PLAYER' },
      tag: { label: 'Tag', value: 'OF THE' },
      week: { label: 'Second title line', value: 'WEEK' },
      name: { label: 'Player', value: 'DANTE\nREYES' },
      position: { label: 'Position', value: '#7  ·  RUNNING BACK' },
      stat: { label: 'Stat', value: '186' },
      statLabel: { label: 'Stat name', value: 'RUSH\nYARDS' },
    },
  },
  (t) => [
    rect(0, 0, W, H, t.color('background'), { name: 'Background' }),
    photo('man-portrait-3', 600, 0, 480, H, { name: 'Player' }),
    rect(
      600,
      900,
      480,
      450,
      linear(180, t.shade('text', 'rgba(20,20,20,0)'), t.shade('text', 'rgba(20,20,20,0.85)')),
      { name: 'Fade' },
    ),
    text(t.copy('title'), 60, 90, 540, {
      fontFamily: t.font('heading'),
      fontSize: 190,
      fontWeight: 400,
      fill: t.color('text'),
      lineHeight: 1,
    }),
    rect(60, 330, 250, 90, t.color('primary'), { name: 'Of the tag' }),
    text(t.copy('tag'), 60, 344, 250, {
      fontFamily: t.font('body'),
      fontSize: 54,
      fontWeight: 700,
      fill: t.color('surface'),
      align: 'center',
      letterSpacing: 4,
    }),
    text(t.copy('week'), 60, 440, 540, {
      fontFamily: t.font('heading'),
      fontSize: 190,
      fontWeight: 400,
      fill: t.color('primary'),
      lineHeight: 1,
    }),
    text(t.copy('name'), 60, 760, 500, {
      fontFamily: t.font('title'),
      fontSize: 84,
      fontWeight: 400,
      fill: t.color('text'),
      lineHeight: 1.05,
    }),
    text(t.copy('position'), 60, 960, 500, {
      fontFamily: t.font('body'),
      fontSize: 36,
      fontWeight: 600,
      fill: t.shade('primary', FOX.deep),
      letterSpacing: 2,
    }),
    text(t.copy('stat'), 640, 1140, 200, {
      fontFamily: t.font('heading'),
      fontSize: 110,
      fontWeight: 400,
      fill: t.color('surface'),
    }),
    text(t.copy('statLabel'), 830, 1160, 220, {
      fontFamily: t.font('body'),
      fontSize: 40,
      fontWeight: 700,
      fill: t.color('primary'),
      lineHeight: 1.1,
      letterSpacing: 3,
    }),
  ],
);
