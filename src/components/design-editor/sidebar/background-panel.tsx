'use client';

import type { Fill } from '@/design';
import { fillToCss } from '../konva-fill';
import { SWATCHES } from '../panels/fields';
import { FillEditor, GRADIENT_PRESETS } from '../panels/fill-editor';

interface BackgroundPanelProps {
  fill: Fill;
  onChange: (fill: Fill, live?: boolean) => void;
  onCommit: () => void;
}

export const BackgroundPanel = ({ fill, onChange, onCommit }: BackgroundPanelProps) => (
  <div className="flex flex-col gap-5">
    <div className="grid grid-cols-5 gap-2">
      {[...SWATCHES, ...GRADIENT_PRESETS].map((preset) => (
        <button
          type="button"
          key={fillToCss(preset)}
          aria-label="Set background"
          onClick={() => onChange(preset)}
          className="aspect-square rounded-lg ring-1 ring-black/10 ring-inset transition-transform hover:scale-105"
          style={{ background: fillToCss(preset) }}
        />
      ))}
    </div>
    <FillEditor label="Background" fill={fill} onChange={onChange} onCommit={onCommit} />
  </div>
);
