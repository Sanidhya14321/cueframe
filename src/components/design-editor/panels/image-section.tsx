'use client';

import { FlipHorizontal2, FlipVertical2, ImageUp } from 'lucide-react';
import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import {
  cssFilterString,
  fitInside,
  IMAGE_FILTER_PRESETS,
  IMAGE_FITS,
  type ImageElement,
  type ImageFilterPreset,
  type ImageFilters,
  NO_FILTERS,
} from '@/design';
import { readImageFile } from '../read-image-file';
import { ColorInput, Section, SliderRow, ToggleButton } from './fields';

interface ImageSectionProps {
  element: ImageElement;
  onChange: (next: ImageElement, live?: boolean) => void;
  onCommit: () => void;
}

const ADJUSTMENTS: {
  key: keyof ImageFilters;
  label: string;
  min: number;
  max: number;
  step: number;
}[] = [
  { key: 'brightness', label: 'Brightness', min: 0, max: 2, step: 0.01 },
  { key: 'contrast', label: 'Contrast', min: 0, max: 2, step: 0.01 },
  { key: 'saturation', label: 'Saturation', min: 0, max: 3, step: 0.01 },
  { key: 'hue', label: 'Hue', min: -180, max: 180, step: 1 },
  { key: 'blur', label: 'Blur', min: 0, max: 40, step: 0.5 },
  { key: 'grayscale', label: 'Grayscale', min: 0, max: 1, step: 0.01 },
  { key: 'sepia', label: 'Sepia', min: 0, max: 1, step: 0.01 },
  { key: 'invert', label: 'Invert', min: 0, max: 1, step: 0.01 },
];

const DEFAULT_CROP = { zoom: 1, focusX: 0.5, focusY: 0.5 };

export const ImageSection = ({ element, onChange, onCommit }: ImageSectionProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const patch = (partial: Partial<ImageElement>, live = false) =>
    onChange({ ...element, ...partial }, live);
  const setFilter = (key: keyof ImageFilters, value: number) =>
    patch({ filters: { ...element.filters, [key]: value } }, true);

  return (
    <>
      <Section title="Image">
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          aria-label="Replace image file"
          onChange={async (event) => {
            const file = event.target.files?.[0];
            event.target.value = '';
            const loaded = file === undefined ? null : await readImageFile(file);
            if (loaded !== null) {
              const size =
                element.src === ''
                  ? { width: element.width, height: element.height }
                  : fitInside(loaded.width, loaded.height, element.width, element.height);
              patch({ src: loaded.src, ...(element.fit === 'stretch' ? size : {}) });
            }
          }}
        />
        <Button variant="outline" size="sm" onClick={() => inputRef.current?.click()}>
          <ImageUp /> {element.src === '' ? 'Upload image' : 'Replace image'}
        </Button>
        <div className="flex gap-1">
          {IMAGE_FITS.map((fit) => (
            <ToggleButton
              key={fit}
              label={`Fit ${fit}`}
              active={element.fit === fit}
              onClick={() => patch({ fit })}
              className="flex-1 capitalize"
            >
              {fit}
            </ToggleButton>
          ))}
        </div>
        {element.fit === 'cover' && element.src !== '' ? (
          <>
            <SliderRow
              label="Crop zoom"
              value={element.crop?.zoom ?? 1}
              min={1}
              max={5}
              step={0.01}
              format={(value) => `${Math.round(value * 100)}%`}
              onChange={(zoom) =>
                patch({ crop: { ...(element.crop ?? DEFAULT_CROP), zoom } }, true)
              }
              onCommit={onCommit}
            />
            <SliderRow
              label="Focus left to right"
              value={element.crop?.focusX ?? 0.5}
              min={0}
              max={1}
              step={0.01}
              format={(value) => `${Math.round(value * 100)}%`}
              onChange={(focusX) =>
                patch({ crop: { ...(element.crop ?? DEFAULT_CROP), focusX } }, true)
              }
              onCommit={onCommit}
            />
            <SliderRow
              label="Focus top to bottom"
              value={element.crop?.focusY ?? 0.5}
              min={0}
              max={1}
              step={0.01}
              format={(value) => `${Math.round(value * 100)}%`}
              onChange={(focusY) =>
                patch({ crop: { ...(element.crop ?? DEFAULT_CROP), focusY } }, true)
              }
              onCommit={onCommit}
            />
          </>
        ) : null}
        <div className="flex gap-1">
          <ToggleButton
            label="Flip horizontal"
            active={element.flipX}
            onClick={() => patch({ flipX: !element.flipX })}
          >
            <FlipHorizontal2 />
          </ToggleButton>
          <ToggleButton
            label="Flip vertical"
            active={element.flipY}
            onClick={() => patch({ flipY: !element.flipY })}
          >
            <FlipVertical2 />
          </ToggleButton>
        </div>
        <SliderRow
          label="Corner radius"
          value={element.cornerRadius}
          min={0}
          max={Math.round(Math.min(element.width, element.height) / 2)}
          step={1}
          onChange={(cornerRadius) => patch({ cornerRadius }, true)}
          onCommit={onCommit}
        />
        <SliderRow
          label="Border width"
          value={element.strokeWidth}
          min={0}
          max={40}
          step={1}
          onChange={(strokeWidth) => patch({ strokeWidth }, true)}
          onCommit={onCommit}
        />
        {element.strokeWidth > 0 ? (
          <ColorInput
            label="Border color"
            value={element.stroke}
            onChange={(stroke, live) => patch({ stroke }, live)}
            onCommit={onCommit}
          />
        ) : null}
      </Section>
      <Section
        title="Filters"
        action={
          <button
            type="button"
            className="text-muted-foreground text-xs hover:text-foreground"
            onClick={() => patch({ filters: NO_FILTERS })}
          >
            Reset
          </button>
        }
      >
        <div className="grid grid-cols-3 gap-1.5">
          {(Object.keys(IMAGE_FILTER_PRESETS) as ImageFilterPreset[]).map((preset) => (
            <button
              type="button"
              key={preset}
              onClick={() => patch({ filters: IMAGE_FILTER_PRESETS[preset] })}
              className="flex flex-col items-center gap-1 rounded-md p-1 text-[11px] capitalize hover:bg-accent"
            >
              <span
                className="aspect-square w-full rounded-md bg-center bg-cover"
                style={{
                  backgroundImage:
                    element.src === ''
                      ? 'linear-gradient(135deg,#f97316,#7c3aed)'
                      : `url("${element.src}")`,
                  filter: cssFilterString(IMAGE_FILTER_PRESETS[preset]),
                }}
              />
              {preset}
            </button>
          ))}
        </div>
        {ADJUSTMENTS.map((adjustment) => (
          <SliderRow
            key={adjustment.key}
            label={adjustment.label}
            value={element.filters[adjustment.key]}
            min={adjustment.min}
            max={adjustment.max}
            step={adjustment.step}
            onChange={(value) => setFilter(adjustment.key, value)}
            onCommit={onCommit}
          />
        ))}
      </Section>
    </>
  );
};
