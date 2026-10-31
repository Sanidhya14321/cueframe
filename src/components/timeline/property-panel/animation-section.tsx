'use client';

import {
  ANIMATION_KINDS,
  type Animation,
  type AnimationKind,
  defaultAnimation,
  type Element,
} from '@/project';
import { EASING_IDS, type EasingId } from '@/schemas';
import { SelectField, SliderField } from './fields';

interface AnimationSectionProps {
  element: Element;
  onChange: (next: Element) => void;
}

export const AnimationSection = ({ element, onChange }: AnimationSectionProps) => {
  const animation = element.animation ?? defaultAnimation();
  const patch = (partial: Partial<Animation>): void =>
    onChange({ ...element, animation: { ...animation, ...partial } });

  return (
    <div className="flex flex-col gap-3">
      <h3 className="font-medium text-sm">Entrance</h3>
      <SelectField
        label="Kind"
        value={animation.kind}
        options={ANIMATION_KINDS}
        onChange={(kind) => patch({ kind: kind as AnimationKind })}
      />
      <SelectField
        label="Easing"
        value={animation.easing}
        options={EASING_IDS}
        onChange={(easing) => patch({ easing: easing as EasingId })}
      />
      <SliderField
        label="Duration"
        value={animation.durationInFrames}
        min={0}
        max={120}
        step={1}
        onChange={(durationInFrames) => patch({ durationInFrames })}
      />
    </div>
  );
};
