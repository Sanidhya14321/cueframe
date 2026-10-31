'use client';

import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  CaseUpper,
  Italic,
  Strikethrough,
  Underline,
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { cssFontFamily, FONT_FAMILIES, FONT_WEIGHTS, type TextElement } from '@/design';
import { loadFontFamily } from '../font-loader';
import { ColorInput, NumberInput, Section, SliderRow, ToggleButton } from './fields';
import { FillEditor } from './fill-editor';

interface TextSectionProps {
  element: TextElement;
  onChange: (next: TextElement, live?: boolean) => void;
  onCommit: () => void;
}

const ALIGN_ICONS = { left: AlignLeft, center: AlignCenter, right: AlignRight } as const;

export const TextSection = ({ element, onChange, onCommit }: TextSectionProps) => {
  const patch = (partial: Partial<TextElement>, live = false) =>
    onChange({ ...element, ...partial }, live);

  return (
    <>
      <Section title="Text">
        <Textarea
          aria-label="Text content"
          rows={3}
          value={element.text}
          onChange={(event) => patch({ text: event.target.value })}
        />
        <Select
          value={element.fontFamily}
          onValueChange={(fontFamily) => {
            loadFontFamily(fontFamily).catch(() => undefined);
            patch({ fontFamily });
          }}
        >
          <SelectTrigger className="h-8 w-full" aria-label="Font family">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="max-h-80">
            {FONT_FAMILIES.map((font) => (
              <SelectItem
                key={font.family}
                value={font.family}
                onMouseEnter={() => loadFontFamily(font.family).catch(() => undefined)}
              >
                <span style={{ fontFamily: cssFontFamily(font.family) }}>{font.family}</span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="grid grid-cols-2 gap-2">
          <NumberInput
            label="Aa"
            value={element.fontSize}
            min={4}
            onChange={(fontSize) => patch({ fontSize })}
          />
          <Select
            value={String(element.fontWeight)}
            onValueChange={(weight) => patch({ fontWeight: Number(weight) })}
          >
            <SelectTrigger className="h-8 w-full" aria-label="Font weight">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {FONT_WEIGHTS.map((weight) => (
                <SelectItem key={weight} value={String(weight)}>
                  {weight}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-wrap gap-1">
          <ToggleButton
            label="Bold"
            active={element.fontWeight >= 700}
            onClick={() => patch({ fontWeight: element.fontWeight >= 700 ? 400 : 700 })}
          >
            <Bold />
          </ToggleButton>
          <ToggleButton
            label="Italic"
            active={element.italic}
            onClick={() => patch({ italic: !element.italic })}
          >
            <Italic />
          </ToggleButton>
          <ToggleButton
            label="Underline"
            active={element.underline}
            onClick={() => patch({ underline: !element.underline })}
          >
            <Underline />
          </ToggleButton>
          <ToggleButton
            label="Strikethrough"
            active={element.strikethrough}
            onClick={() => patch({ strikethrough: !element.strikethrough })}
          >
            <Strikethrough />
          </ToggleButton>
          <ToggleButton
            label="Uppercase"
            active={element.uppercase}
            onClick={() => patch({ uppercase: !element.uppercase })}
          >
            <CaseUpper />
          </ToggleButton>
          {(['left', 'center', 'right'] as const).map((align) => {
            const Icon = ALIGN_ICONS[align];
            return (
              <ToggleButton
                key={align}
                label={`Align ${align}`}
                active={element.align === align}
                onClick={() => patch({ align })}
              >
                <Icon />
              </ToggleButton>
            );
          })}
        </div>
        <SliderRow
          label="Line height"
          value={element.lineHeight}
          min={0.6}
          max={3}
          step={0.05}
          onChange={(lineHeight) => patch({ lineHeight }, true)}
          onCommit={onCommit}
        />
        <SliderRow
          label="Letter spacing"
          value={element.letterSpacing}
          min={-20}
          max={60}
          step={0.5}
          onChange={(letterSpacing) => patch({ letterSpacing }, true)}
          onCommit={onCommit}
        />
      </Section>
      <Section title="Text color">
        <FillEditor
          label="Text fill"
          fill={element.fill}
          onChange={(fill, live) => patch({ fill }, live)}
          onCommit={onCommit}
        />
      </Section>
      <Section title="Outline">
        <SliderRow
          label="Outline width"
          value={element.strokeWidth}
          min={0}
          max={20}
          step={0.5}
          onChange={(strokeWidth) => patch({ strokeWidth }, true)}
          onCommit={onCommit}
        />
        {element.strokeWidth > 0 ? (
          <ColorInput
            label="Outline color"
            value={element.stroke}
            onChange={(stroke, live) => patch({ stroke }, live)}
            onCommit={onCommit}
          />
        ) : null}
      </Section>
    </>
  );
};
