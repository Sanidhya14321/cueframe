import {
  alphaOf,
  type ColorProp,
  type ColorTarget,
  type DesignControl,
  type DesignElement,
  type Fill,
  type Tone,
  toneBetween,
} from '@/design';
import { flatten, type Nodes } from './elements';
import type { Template } from './template';

export const COLOR_KEYS = [
  'background',
  'surface',
  'primary',
  'secondary',
  'accent',
  'text',
] as const;

export type ColorKey = (typeof COLOR_KEYS)[number];

const COLOR_LABELS = {
  background: 'Background color',
  surface: 'Surface color',
  primary: 'Primary color',
  secondary: 'Secondary color',
  accent: 'Accent color',
  text: 'Text color',
} as const satisfies Record<ColorKey, string>;

interface Field<T> {
  label: string;
  value: T;
  hint?: string;
}

export interface ThemeSpec {
  colors: Partial<Record<ColorKey, { value: string; hint: string }>>;
  fonts?: Record<string, Field<string>>;
  copy?: Record<string, Field<string | readonly string[]>>;
}

type ColorsOf<S extends ThemeSpec> = keyof S['colors'] & ColorKey;
type FontsOf<S extends ThemeSpec> = keyof NonNullable<S['fonts']> & string;
type CopyOf<S extends ThemeSpec> = keyof NonNullable<S['copy']> & string;

export interface Theme<S extends ThemeSpec> {
  color: (key: ColorsOf<S>) => string;
  shade: (key: ColorsOf<S>, exact: string) => string;
  font: (key: FontsOf<S>) => string;
  copy: (key: CopyOf<S>) => string;
  list: (key: CopyOf<S>) => string[];
}

interface Marker {
  key: string;
  tone?: Tone;
  alpha?: number;
}

const realTheme = <S extends ThemeSpec>(spec: S): Theme<S> => {
  const colorOf = (key: ColorKey): string => {
    const entry = spec.colors[key];
    if (entry === undefined) {
      throw new Error(`Theme has no ${key} color`);
    }
    return entry.value;
  };
  const copyOf = (key: string) => {
    const entry = spec.copy?.[key];
    if (entry === undefined) {
      throw new Error(`Theme has no ${key} copy`);
    }
    return entry.value;
  };
  return {
    color: colorOf,
    shade: (key, exact) => {
      colorOf(key);
      return exact;
    },
    font: (key) => {
      const entry = spec.fonts?.[key];
      if (entry === undefined) {
        throw new Error(`Theme has no ${key} font`);
      }
      return entry.value;
    },
    copy: (key) => {
      const value = copyOf(key);
      if (typeof value !== 'string') {
        throw new Error(`Copy ${key} is a list; use list()`);
      }
      return value;
    },
    list: (key) => {
      const value = copyOf(key);
      if (typeof value === 'string') {
        throw new Error(`Copy ${key} is a single line; use copy()`);
      }
      return [...value];
    },
  };
};

const markerTheme = <S extends ThemeSpec>(spec: S, markers: Map<string, Marker>): Theme<S> => {
  const real = realTheme(spec);
  let count = 0;
  const mark = (marker: Marker): string => {
    count += 1;
    const id = `#${count.toString(16).padStart(6, '0')}01`;
    markers.set(id, marker);
    return id;
  };
  const text = (kind: string, key: string): string => {
    const id = `\u0001${kind}:${key}`;
    markers.set(id, { key: `${kind}:${key}` });
    return id;
  };
  return {
    color: (key) => {
      real.color(key);
      return mark({ key: `color:${key}` });
    },
    shade: (key, exact) => {
      const base = real.color(key);
      const tone = toneBetween(base, exact);
      const alpha = alphaOf(exact);
      return mark({
        key: `color:${key}`,
        ...(tone === undefined ? {} : { tone }),
        ...(alpha < 1 ? { alpha } : {}),
      });
    },
    font: (key) => {
      real.font(key);
      return text('font', key);
    },
    copy: (key) => {
      real.copy(key);
      return text('copy', key);
    },
    list: (key) => real.list(key).map((_, index) => text('copy', `${key}.${index}`)),
  };
};

interface FoundColor {
  prop: ColorProp;
  value: string;
  stop?: number;
}

const fillValues = (fill: Fill, prop: ColorProp): FoundColor[] =>
  typeof fill === 'string'
    ? [{ prop, value: fill }]
    : fill.stops.map((stop, index) => ({ prop, value: stop.color, stop: index }));

export const elementColors = (element: DesignElement): FoundColor[] => {
  const shadow: FoundColor[] =
    element.shadow === undefined ? [] : [{ prop: 'shadow', value: element.shadow.color }];
  switch (element.type) {
    case 'icon':
      return [{ prop: 'color', value: element.color }, ...shadow];
    case 'line':
      return [{ prop: 'stroke', value: element.stroke }, ...shadow];
    case 'image':
      return [
        ...(element.strokeWidth > 0 ? [{ prop: 'stroke' as const, value: element.stroke }] : []),
        ...shadow,
      ];
    case 'text':
      return [
        ...fillValues(element.fill, 'fill'),
        ...(element.strokeWidth > 0 ? [{ prop: 'stroke' as const, value: element.stroke }] : []),
        ...(element.background === undefined
          ? []
          : [{ prop: 'textBackground' as const, value: element.background.fill }]),
        ...shadow,
      ];
    default:
      return [
        ...fillValues(element.fill, 'fill'),
        ...(element.strokeWidth > 0 ? [{ prop: 'stroke' as const, value: element.stroke }] : []),
        ...shadow,
      ];
  }
};

const colorTarget = (element: string, found: FoundColor, marker: Marker): ColorTarget => ({
  element,
  prop: found.prop,
  ...(found.stop === undefined ? {} : { stop: found.stop }),
  ...(marker.tone === undefined ? {} : { tone: marker.tone }),
  ...(marker.alpha === undefined ? {} : { alpha: marker.alpha }),
});

const bindControls = <S extends ThemeSpec>(
  spec: S,
  real: readonly DesignElement[],
  marked: readonly DesignElement[],
  markers: ReadonlyMap<string, Marker>,
): DesignControl[] => {
  if (real.length !== marked.length) {
    throw new Error('A themed template must build the same elements for every theme');
  }
  const colorTargets = new Map<string, ColorTarget[]>();
  const elementTargets = new Map<string, { element: string }[]>();
  const add = <T>(map: Map<string, T[]>, key: string, value: T) =>
    map.set(key, [...(map.get(key) ?? []), value]);
  real.forEach((element, index) => {
    const twin = marked[index];
    if (twin === undefined) {
      return;
    }
    for (const found of elementColors(twin)) {
      const marker = markers.get(found.value);
      if (marker !== undefined) {
        add(colorTargets, marker.key, colorTarget(element.id, found, marker));
      }
    }
    const words = twin.type === 'text' ? [twin.text, twin.fontFamily] : [];
    for (const marker of words.map((value) => markers.get(value))) {
      if (marker !== undefined) {
        add(elementTargets, marker.key, { element: element.id });
      }
    }
  });
  const colors = COLOR_KEYS.flatMap((key): DesignControl[] => {
    const entry = spec.colors[key];
    return entry === undefined
      ? []
      : [
          {
            kind: 'color',
            id: key,
            label: COLOR_LABELS[key],
            hint: entry.hint,
            value: entry.value,
            targets: colorTargets.get(`color:${key}`) ?? [],
          },
        ];
  });
  const fonts = Object.entries(spec.fonts ?? {}).map(
    ([key, entry]): DesignControl => ({
      kind: 'font',
      id: `font:${key}`,
      label: entry.label,
      ...(entry.hint === undefined ? {} : { hint: entry.hint }),
      value: entry.value,
      targets: elementTargets.get(`font:${key}`) ?? [],
    }),
  );
  const copy = Object.entries(spec.copy ?? {}).map(([key, entry]): DesignControl => {
    const hint = entry.hint === undefined ? {} : { hint: entry.hint };
    if (typeof entry.value === 'string') {
      return {
        kind: 'text',
        id: `copy:${key}`,
        label: entry.label,
        ...hint,
        value: entry.value,
        targets: elementTargets.get(`copy:${key}`) ?? [],
      };
    }
    return {
      kind: 'list',
      id: `copy:${key}`,
      label: entry.label,
      ...hint,
      values: [...entry.value],
      targets: entry.value.map((_, index) => elementTargets.get(`copy:${key}.${index}`) ?? []),
    };
  });
  return [...colors, ...fonts, ...copy];
};

export const themed = <S extends ThemeSpec>(
  width: number,
  height: number,
  spec: S,
  build: (theme: Theme<S>) => Nodes[],
): Template => ({
  width,
  height,
  build: () => build(realTheme(spec)),
  compose: () => {
    const elements = flatten(build(realTheme(spec)));
    const markers = new Map<string, Marker>();
    const marked = flatten(build(markerTheme(spec, markers)));
    return { elements, controls: bindControls(spec, elements, marked, markers) };
  },
});

const swapColor = (value: string, colors: Readonly<Record<string, string>>): string =>
  colors[value.toLowerCase()] ?? colors[value] ?? value;

const swapFill = (fill: Fill, colors: Readonly<Record<string, string>>): Fill =>
  typeof fill === 'string'
    ? swapColor(fill, colors)
    : {
        ...fill,
        stops: fill.stops.map((stop) => ({ ...stop, color: swapColor(stop.color, colors) })),
      };

export const paint = (
  nodes: readonly Nodes[],
  colors: Readonly<Record<string, string>>,
): DesignElement[] =>
  flatten(nodes).map((element): DesignElement => {
    const shadow =
      element.shadow === undefined
        ? {}
        : { shadow: { ...element.shadow, color: swapColor(element.shadow.color, colors) } };
    switch (element.type) {
      case 'icon':
        return { ...element, ...shadow, color: swapColor(element.color, colors) };
      case 'line':
      case 'image':
        return { ...element, ...shadow, stroke: swapColor(element.stroke, colors) };
      case 'text':
        return {
          ...element,
          ...shadow,
          fill: swapFill(element.fill, colors),
          stroke: swapColor(element.stroke, colors),
          ...(element.background === undefined
            ? {}
            : {
                background: {
                  ...element.background,
                  fill: swapColor(element.background.fill, colors),
                },
              }),
        };
      default:
        return {
          ...element,
          ...shadow,
          fill: swapFill(element.fill, colors),
          stroke: swapColor(element.stroke, colors),
        };
    }
  });
