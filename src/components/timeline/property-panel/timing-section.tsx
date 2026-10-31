'use client';

import type { Element } from '@/project';
import { NumberField } from './fields';

interface TimingSectionProps {
  element: Element;
  onChange: (next: Element) => void;
}

export const TimingSection = ({ element, onChange }: TimingSectionProps) => (
  <div className="flex flex-col gap-3">
    <h3 className="font-medium text-sm">Timing</h3>
    <div className="grid grid-cols-2 gap-3">
      <NumberField
        label="From (frame)"
        value={element.from}
        onChange={(from) => onChange({ ...element, from: Math.max(0, Math.round(from)) })}
      />
      <NumberField
        label="Duration"
        value={element.durationInFrames}
        onChange={(duration) =>
          onChange({ ...element, durationInFrames: Math.max(1, Math.round(duration)) })
        }
      />
    </div>
  </div>
);
