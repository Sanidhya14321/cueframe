import { linear } from '@/design';
import { pill, rect, text, themed } from '../../../kit';
import { BODY, crest, FOX, HEADING, TITLE } from './palette';
import { H, W } from './posts';

const HOME_ROWS = [true, false, true, false, true, false, true];

export const gameTimes = themed(
  W,
  H,
  {
    colors: {
      primary: {
        value: FOX.blaze,
        hint: 'Page gradient, and HOME and the kickoff time on home rows; its darker shade colors the bottom of the page',
      },
      text: {
        value: FOX.ink,
        hint: 'GAME, the home rows, AWAY and the kickoff time on away rows, and the footer',
      },
      surface: {
        value: FOX.white,
        hint: 'TIMES, the dates and opponents, and the translucent away rows',
      },
    },
    fonts: { title: TITLE, body: BODY },
    copy: {
      title: { label: 'Title', value: 'GAME' },
      subtitle: { label: 'Second title line', value: 'TIMES' },
      venues: { label: 'Venue', value: ['HOME', 'AWAY', 'HOME', 'AWAY', 'HOME', 'AWAY', 'HOME'] },
      dates: { label: 'Date', value: ['9.05', '9.12', '9.19', '9.26', '10.03', '10.10', '10.17'] },
      teams: {
        label: 'Opponent',
        value: [
          'Bay City Rams',
          'Northgate Owls',
          'Pine Hill Wolves',
          'Coral Bay Sharks',
          'Ashford Knights',
          'Delmar Hawks',
          'Granite Bears',
        ],
      },
      times: {
        label: 'Kickoff',
        value: ['7:45 PM', '5:00 PM', 'NOON', '3:30 PM', '7:45 PM', '2:00 PM', 'NOON'],
      },
      footer: { label: 'Footer', value: 'All home games at Hollis Field' },
    },
  },
  (t) => {
    const title = (content: string, y: number, fill: string) =>
      text(content, 0, y, W, {
        fontFamily: t.font('title'),
        fontSize: 150,
        fontWeight: 400,
        fill,
        align: 'center',
        lineHeight: 1,
      });
    const dates = t.list('dates');
    const teams = t.list('teams');
    const times = t.list('times');
    return [
      rect(0, 0, W, H, linear(160, t.color('primary'), t.shade('primary', FOX.deep)), {
        name: 'Background',
      }),
      title(t.copy('title'), 70, t.color('text')),
      title(t.copy('subtitle'), 215, t.color('surface')),
      t.list('venues').map((venue, index) => {
        const y = 430 + index * 112;
        const home = HOME_ROWS[index] ?? false;
        const accent = home ? t.color('primary') : t.color('text');
        return [
          rect(
            80,
            y,
            920,
            88,
            home ? t.color('text') : t.shade('surface', 'rgba(255,255,255,0.18)'),
            { cornerRadius: 44, name: 'Game row' },
          ),
          text(venue, 120, y + 28, 110, {
            fontFamily: t.font('body'),
            fontSize: 30,
            fontWeight: 700,
            fill: accent,
            letterSpacing: 2,
          }),
          text(dates[index] ?? '', 230, y + 18, 120, {
            fontFamily: t.font('body'),
            fontSize: 46,
            fontWeight: 700,
            fill: t.color('surface'),
          }),
          text(teams[index] ?? '', 370, y + 20, 400, {
            fontFamily: t.font('body'),
            fontSize: 42,
            fontWeight: 600,
            fill: t.color('surface'),
          }),
          text(times[index] ?? '', 760, y + 20, 200, {
            fontFamily: t.font('body'),
            fontSize: 42,
            fontWeight: 700,
            fill: accent,
            align: 'right',
          }),
        ];
      }),
      text(t.copy('footer'), 0, 1250, W, {
        fontFamily: t.font('body'),
        fontSize: 36,
        fontWeight: 500,
        fill: t.color('text'),
        align: 'center',
        letterSpacing: 2,
      }),
    ];
  },
);

interface RivalStyle {
  home: string;
  away: string;
  homeColor: string;
  awayColor: string;
  top: string;
  bottom: string;
  topIsAway: boolean;
  tag: string;
  footer: string;
}

const rival = (style: RivalStyle) =>
  themed(
    W,
    H,
    {
      colors: {
        background: {
          value: FOX.white,
          hint: 'Page; its grey shade colors the top of the glow behind the crests',
        },
        primary: {
          value: style.homeColor,
          hint: `${style.home} crest and name, ${style.bottom} and the date tag`,
        },
        secondary: {
          value: style.awayColor,
          hint: style.topIsAway
            ? `${style.away} crest and name, and ${style.top}`
            : `${style.away} crest and name`,
        },
        surface: { value: FOX.white, hint: 'Crest icons and the date tag text' },
        text: {
          value: FOX.ink,
          hint: style.topIsAway ? 'VS and the footer' : `VS, ${style.top} and the footer`,
        },
      },
      fonts: { heading: HEADING, title: TITLE, body: BODY },
      copy: {
        vs: { label: 'Versus', value: 'VS' },
        teams: { label: 'Team', value: [style.home, style.away] },
        top: { label: 'Headline', value: style.top },
        bottom: { label: 'Second headline line', value: style.bottom },
        tag: { label: 'Date tag', value: style.tag },
        footer: { label: 'Footer', value: style.footer },
      },
    },
    (t) => {
      const [home = '', away = ''] = t.list('teams');
      const team = (label: string, x: number, fill: string) =>
        text(label, x, 560, 400, {
          fontFamily: t.font('body'),
          fontSize: 34,
          fontWeight: 700,
          fill,
          align: 'center',
          letterSpacing: 6,
        });
      const headline = (content: string, y: number, fill: string) =>
        text(content, 0, y, W, {
          fontFamily: t.font('title'),
          fontSize: 150,
          fontWeight: 400,
          fill,
          align: 'center',
          lineHeight: 1,
        });
      return [
        rect(0, 0, W, H, t.color('background'), { name: 'Background' }),
        rect(0, 0, W, 640, linear(180, t.shade('background', '#ececec'), t.color('background')), {
          name: 'Glow',
        }),
        crest(70, 90, 400, t.color('primary'), 'flame', t.color('surface')),
        crest(610, 90, 400, t.color('secondary'), 'zap', t.color('surface')),
        text(t.copy('vs'), 470, 260, 140, {
          fontFamily: t.font('heading'),
          fontSize: 96,
          fontWeight: 400,
          fill: t.color('text'),
          align: 'center',
        }),
        team(home, 70, t.color('primary')),
        team(away, 610, t.color('secondary')),
        headline(t.copy('top'), 680, style.topIsAway ? t.color('secondary') : t.color('text')),
        headline(t.copy('bottom'), 840, t.color('primary')),
        pill(t.copy('tag'), 390, 1040, {
          width: 300,
          fill: t.color('primary'),
          color: t.color('surface'),
          fontSize: 38,
          fontFamily: t.font('body'),
          fontWeight: 700,
          letterSpacing: 4,
        }),
        text(t.copy('footer'), 0, 1190, W, {
          fontFamily: t.font('body'),
          fontSize: 34,
          fontWeight: 600,
          fill: t.color('text'),
          align: 'center',
          letterSpacing: 8,
        }),
      ];
    },
  );

export const rivalNight = rival({
  home: 'FOXES',
  away: 'RAMS',
  homeColor: FOX.blaze,
  awayColor: FOX.rival,
  top: 'RIVAL',
  bottom: 'NIGHT',
  topIsAway: false,
  tag: 'OCT 24',
  footer: 'HOLLIS MEMORIAL FIELD',
});

export const rivalRemix = rival({
  home: 'TITANS',
  away: 'COMETS',
  homeColor: '#6d28d9',
  awayColor: '#e11d48',
  top: 'CLASH OF',
  bottom: 'CHAMPIONS',
  topIsAway: true,
  tag: 'NOV 07',
  footer: 'SATURDAY  ·  LAKESIDE BOWL',
});
