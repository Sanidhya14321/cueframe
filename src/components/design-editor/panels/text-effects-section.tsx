'use client';

import { firstFillColor, type TextElement } from '@/design';
import { cn } from '@/lib/utils';
import { ColorInput, Section, SliderRow } from './fields';

const TRANSPARENT = 'rgba(0,0,0,0)';

const plain = (element: TextElement): TextElement => {
  const { shadow: _shadow, background: _background, ...rest } = element;
  const fill = rest.fill === TRANSPARENT ? rest.stroke : rest.fill;
  return { ...rest, fill, strokeWidth: 0 };
};

interface TextEffect {
  id: string;
  label: string;
  apply: (element: TextElement) => TextElement;
  preview: string;
}

const EFFECTS: TextEffect[] = [
  { id: 'none', label: 'None', apply: plain, preview: '' },
  {
    id: 'shadow',
    label: 'Shadow',
    apply: (element) => ({
      ...plain(element),
      shadow: {
        color: 'rgba(0,0,0,0.4)',
        blur: element.fontSize * 0.12,
        offsetX: element.fontSize * 0.06,
        offsetY: element.fontSize * 0.06,
      },
    }),
    preview: '3px 3px 4px rgba(0,0,0,0.45)',
  },
  {
    id: 'lift',
    label: 'Lift',
    apply: (element) => ({
      ...plain(element),
      shadow: {
        color: 'rgba(0,0,0,0.28)',
        blur: element.fontSize * 0.45,
        offsetX: 0,
        offsetY: element.fontSize * 0.2,
      },
    }),
    preview: '0 6px 10px rgba(0,0,0,0.3)',
  },
  {
    id: 'hollow',
    label: 'Hollow',
    apply: (element) => {
      const base = plain(element);
      return {
        ...base,
        stroke: firstFillColor(base.fill),
        strokeWidth: Math.max(1.5, element.fontSize * 0.03),
        fill: TRANSPARENT,
      };
    },
    preview: 'hollow',
  },
  {
    id: 'outline',
    label: 'Outline',
    apply: (element) => ({
      ...plain(element),
      stroke: '#ffffff',
      strokeWidth: Math.max(2, element.fontSize * 0.07),
    }),
    preview: 'outline',
  },
  {
    id: 'neon',
    label: 'Neon',
    apply: (element) => {
      const base = plain(element);
      return {
        ...base,
        shadow: {
          color: firstFillColor(base.fill),
          blur: element.fontSize * 0.45,
          offsetX: 0,
          offsetY: 0,
        },
      };
    },
    preview: '0 0 6px #a855f7, 0 0 12px #a855f7',
  },
  {
    id: 'highlight',
    label: 'Highlight',
    apply: (element) => ({
      ...plain(element),
      background: {
        fill: '#fde047',
        padding: element.fontSize * 0.22,
        radius: element.fontSize * 0.12,
      },
    }),
    preview: 'highlight',
  },
];

const activeEffect = (element: TextElement): string => {
  if (element.background !== undefined) {
    return 'highlight';
  }
  if (element.fill === TRANSPARENT && element.strokeWidth > 0) {
    return 'hollow';
  }
  if (element.strokeWidth > 0) {
    return 'outline';
  }
  if (element.shadow !== undefined) {
    return element.shadow.offsetX === 0 && element.shadow.offsetY === 0
      ? 'neon'
      : element.shadow.offsetX === 0
        ? 'lift'
        : 'shadow';
  }
  return 'none';
};

const previewStyle = (preview: string) => {
  if (preview === 'hollow') {
    return { color: 'transparent', WebkitTextStroke: '1.5px currentColor', caretColor: 'auto' };
  }
  if (preview === 'outline') {
    return { WebkitTextStroke: '3px #a3a3a3', paintOrder: 'stroke fill' };
  }
  if (preview === 'highlight') {
    return { background: '#fde047', color: '#111', borderRadius: 4, padding: '0 4px' };
  }
  return { textShadow: preview };
};

interface TextEffectsSectionProps {
  element: TextElement;
  onChange: (next: TextElement, live?: boolean) => void;
  onCommit: () => void;
}

export const TextEffectsSection = ({ element, onChange, onCommit }: TextEffectsSectionProps) => {
  const active = activeEffect(element);
  const background = element.background;
  return (
    <Section title="Effects">
      <div className="grid grid-cols-4 gap-1.5">
        {EFFECTS.map((effect) => (
          <button
            type="button"
            key={effect.id}
            aria-pressed={active === effect.id}
            onClick={() => onChange(effect.apply(element))}
            className={cn(
              'flex flex-col items-center gap-1 rounded-lg p-1.5 text-[11px] transition-colors hover:bg-accent',
              active === effect.id
                ? 'bg-violet-500/15 text-violet-700 dark:text-violet-300'
                : 'bg-muted/60',
            )}
          >
            <span className="font-black text-lg leading-none" style={previewStyle(effect.preview)}>
              Ag
            </span>
            {effect.label}
          </button>
        ))}
      </div>
      {background === undefined ? null : (
        <>
          <ColorInput
            label="Highlight colour"
            value={background.fill}
            onChange={(fill, live) =>
              onChange({ ...element, background: { ...background, fill } }, live)
            }
            onCommit={onCommit}
          />
          <SliderRow
            label="Padding"
            value={background.padding}
            min={0}
            max={Math.max(40, element.fontSize)}
            step={1}
            onChange={(padding) =>
              onChange({ ...element, background: { ...background, padding } }, true)
            }
            onCommit={onCommit}
          />
          <SliderRow
            label="Roundness"
            value={background.radius}
            min={0}
            max={Math.max(40, element.fontSize)}
            step={1}
            onChange={(radius) =>
              onChange({ ...element, background: { ...background, radius } }, true)
            }
            onCommit={onCommit}
          />
        </>
      )}
    </Section>
  );
};
