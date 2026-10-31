'use client';

import { type Fill, firstFillColor, type Gradient, linear, radial } from '@/design';
import { fillToCss } from '../konva-fill';
import { ColorInput, SliderRow, ToggleButton } from './fields';

export const GRADIENT_PRESETS: Gradient[] = [
  linear(135, '#7c3aed', '#ec4899'),
  linear(135, '#06b6d4', '#3b82f6'),
  linear(135, '#f97316', '#facc15'),
  linear(160, '#0f172a', '#334155'),
  linear(135, '#22c55e', '#14b8a6'),
  linear(180, '#fdf2f8', '#e0e7ff'),
  linear(135, '#111827', '#4f46e5', '#06b6d4'),
  radial('#a78bfa', '#1e1b4b'),
  radial('#fef3c7', '#f59e0b'),
  linear(120, '#ff6b35', '#1a1a1a'),
];

type FillMode = 'solid' | 'linear' | 'radial';

const modeOf = (fill: Fill): FillMode => (typeof fill === 'string' ? 'solid' : fill.type);

interface FillEditorProps {
  label: string;
  fill: Fill;
  onChange: (fill: Fill, live?: boolean) => void;
  onCommit: () => void;
}

export const FillEditor = ({ label, fill, onChange, onCommit }: FillEditorProps) => {
  const mode = modeOf(fill);
  const toMode = (next: FillMode) => {
    const base = firstFillColor(fill);
    const second = typeof fill === 'string' ? '#ffffff' : (fill.stops.at(-1)?.color ?? '#ffffff');
    if (next === 'solid') {
      onChange(base);
    } else if (next === 'linear') {
      onChange(
        linear(typeof fill !== 'string' && fill.type === 'linear' ? fill.angle : 135, base, second),
      );
    } else {
      onChange(radial(base, second));
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-1">
        {(['solid', 'linear', 'radial'] as const).map((option) => (
          <ToggleButton
            key={option}
            label={`${label} ${option}`}
            active={mode === option}
            onClick={() => toMode(option)}
            className="flex-1 capitalize"
          >
            {option}
          </ToggleButton>
        ))}
      </div>
      {typeof fill === 'string' ? (
        <ColorInput
          label={label}
          value={fill}
          onChange={onChange}
          onCommit={onCommit}
          showSwatches
        />
      ) : (
        <>
          <div
            className="h-6 rounded-md ring-1 ring-black/10 ring-inset"
            style={{ background: fillToCss(fill) }}
          />
          {fill.stops.map((stop, index) => (
            <ColorInput
              key={`${index}-${stop.offset}`}
              label={`${label} stop ${index + 1}`}
              value={stop.color}
              onChange={(color, live) =>
                onChange(
                  {
                    ...fill,
                    stops: fill.stops.map((item, position) =>
                      position === index ? { ...item, color } : item,
                    ),
                  },
                  live,
                )
              }
              onCommit={onCommit}
            />
          ))}
          {fill.type === 'linear' ? (
            <SliderRow
              label="Angle"
              value={fill.angle}
              min={0}
              max={360}
              step={1}
              format={(value) => `${Math.round(value)}°`}
              onChange={(angle) => onChange({ ...fill, angle }, true)}
              onCommit={onCommit}
            />
          ) : null}
        </>
      )}
      {mode === 'solid' ? null : (
        <div className="grid grid-cols-5 gap-1.5">
          {GRADIENT_PRESETS.map((preset) => (
            <button
              type="button"
              key={fillToCss(preset)}
              aria-label="Use gradient preset"
              onClick={() => onChange(preset)}
              className="aspect-square rounded-md ring-1 ring-black/10 ring-inset transition-transform hover:scale-105"
              style={{ background: fillToCss(preset) }}
            />
          ))}
        </div>
      )}
    </div>
  );
};
