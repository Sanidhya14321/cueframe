import { linear } from '@/design';
import { icon, rect, type ThemeSpec, themed } from '../../../kit';
import { BODY, backdrop, CV, fontsOf, HEADING, SH, SW } from './theme';

const COLUMNS = [
  ['Capability', 'Setup time', 'Accuracy', 'Integrations', 'Support', 'Edge analytics'],
  ['Corvane', '< 1 day', '99.2%', '120+', '24/7 live', 'Built in'],
  ['Vendor A', '5-7 days', '94%', '45', 'Email only', 'Add-on'],
  ['Vendor B', '3 weeks', '91%', '30', 'Office hours', 'None'],
] as const;

const COLUMN_KEYS = ['capability', 'ours', 'vendorA', 'vendorB'] as const;

const benchmarksSpec = {
  colors: {
    background: {
      value: CV.wine,
      hint: 'Slide gradient and the header row labels; its lighter shade is the gradient end',
    },
    primary: {
      value: CV.rose,
      hint: 'Header row and the table frame; its pale shade colors the Corvane column',
    },
    text: {
      value: CV.white,
      hint: 'Title and the competitor columns; its faint tint fills the striped rows',
    },
    secondary: { value: CV.muted, hint: 'Subtitle and the capability names' },
  },
  fonts: { heading: HEADING, body: BODY },
  copy: {
    title: { label: 'Title', value: 'Platform Benchmarks' },
    subtitle: {
      label: 'Subtitle',
      value: 'How Corvane compares with the tools teams usually replace.',
    },
    capability: {
      label: 'Capability column',
      value: COLUMNS[0],
      hint: 'Header first, then one entry per row',
    },
    ours: {
      label: 'Corvane column',
      value: COLUMNS[1],
      hint: 'Header first, then one entry per row',
    },
    vendorA: {
      label: 'Second vendor column',
      value: COLUMNS[2],
      hint: 'Header first, then one entry per row',
    },
    vendorB: {
      label: 'Third vendor column',
      value: COLUMNS[3],
      hint: 'Header first, then one entry per row',
    },
  },
} as const satisfies ThemeSpec;

export const benchmarksSlide = themed(SW, SH, benchmarksSpec, (t) => {
  const { head, body } = fontsOf(t);
  const columns = COLUMN_KEYS.map((key) => t.list(key));
  const cellColor = (row: number, column: number) => {
    if (row === 0) {
      return t.shade('background', CV.ink);
    }
    if (column === 0) {
      return t.color('secondary');
    }
    return column === 1 ? t.shade('primary', CV.blush) : t.color('text');
  };
  const tableCell = (cell: string, row: number, column: number, y: number) => {
    const first = column === 0;
    return body(
      cell,
      260 + column * 350 + (first ? 40 : 0),
      y,
      first ? 310 : 350,
      30,
      cellColor(row, column),
      {
        align: first ? 'left' : 'center',
        fontWeight: row === 0 || column < 2 ? 700 : 400,
      },
    );
  };
  return [
    backdrop(t.color('background'), t.shade('background', CV.plum)),
    head(t.copy('title'), 0, 100, SW, 76, t.color('text'), { align: 'center' }),
    body(t.copy('subtitle'), 0, 205, SW, 32, t.color('secondary'), { align: 'center' }),
    rect(260, 320, 1400, 90, linear(90, t.color('primary'), t.shade('primary', '#d77a98')), {
      name: 'Header row',
      cornerRadius: 20,
    }),
    COLUMNS[0].map((_, rowIndex) => {
      const y = 320 + (rowIndex === 0 ? 0 : 90 + (rowIndex - 1) * 110);
      const height = rowIndex === 0 ? 90 : 110;
      return [
        rowIndex > 0 && rowIndex % 2 === 1
          ? rect(260, y, 1400, height, t.shade('text', 'rgba(255,255,255,0.05)'), {
              name: 'Row band',
            })
          : [],
        columns.map((column, columnIndex) =>
          tableCell(column[rowIndex] ?? '', rowIndex, columnIndex, y + height / 2 - 21),
        ),
      ];
    }),
    rect(260, 320, 1400, 640, t.shade('primary', CV.clear), {
      name: 'Table frame',
      cornerRadius: 20,
      stroke: t.shade('primary', CV.edge),
      strokeWidth: 2,
    }),
  ];
});

const COLUMN_X = [140, 760, 1300] as const;

const feedbackSpec = {
  colors: {
    background: {
      value: CV.wine,
      hint: 'Slide gradient; its dark shades color the text on the center panel',
    },
    primary: {
      value: CV.rose,
      hint: 'Second word of each side column; its shades color Context and the faint background icons',
    },
    surface: {
      value: CV.white,
      hint: 'Center panel; its pink shade is the bottom of the panel gradient',
    },
    text: { value: CV.white, hint: 'First word of each side column' },
    secondary: { value: CV.muted, hint: 'Side column paragraphs' },
  },
  fonts: { heading: HEADING, body: BODY },
  copy: {
    leads: { label: 'First word', value: ['Dynamic', 'Engineered', 'Structural'] },
    accents: { label: 'Second word', value: ['Feedback', 'Context', 'Audit'] },
    bodies: {
      label: 'Paragraph',
      value: [
        'Treat the assistant as a teammate. Review, refine and loop until the output fits your voice.',
        'Great answers need great inputs. Share the audience, the goal and the limits before the first prompt is ever written.',
        'Ask for clear sections and checklists so every response can be scanned and verified fast.',
      ],
    },
  },
} as const satisfies ThemeSpec;

export const feedbackSlide = themed(SW, SH, feedbackSpec, (t) => {
  const { head, body } = fontsOf(t);
  const leads = t.list('leads');
  const accents = t.list('accents');
  const bodies = t.list('bodies');
  const sideColumn = (index: number) => {
    const x = COLUMN_X[index] ?? 0;
    return [
      head(leads[index] ?? '', x, 150, 460, 60, t.color('text')),
      head(accents[index] ?? '', x, 222, 460, 60, t.color('primary')),
      body(bodies[index] ?? '', x, 340, 440, 30, t.color('secondary')),
    ];
  };
  return [
    backdrop(t.color('background'), t.shade('background', CV.plum)),
    icon('refresh-cw', 160, 640, 320, t.shade('primary', 'rgba(255,214,223,0.08)'), {
      strokeWidth: 1.4,
    }),
    icon('scan-face', 1440, 640, 320, t.shade('primary', 'rgba(255,214,223,0.08)'), {
      strokeWidth: 1.4,
    }),
    sideColumn(0),
    rect(700, 60, 520, 960, linear(170, t.color('surface'), t.shade('surface', CV.blush)), {
      name: 'Highlight panel',
      cornerRadius: 36,
    }),
    head(leads[1] ?? '', 760, 150, 420, 60, t.shade('background', CV.ink)),
    head(accents[1] ?? '', 760, 222, 420, 60, t.shade('primary', CV.berry)),
    body(bodies[1] ?? '', 760, 340, 400, 30, t.shade('background', CV.cardText)),
    icon('brain', 830, 640, 260, t.shade('primary', 'rgba(92,26,46,0.14)'), { strokeWidth: 1.4 }),
    sideColumn(2),
  ];
});
