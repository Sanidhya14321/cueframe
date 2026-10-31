'use client';

import type {
  EllipseElement,
  LineElement,
  PathElement,
  PolygonElement,
  RectElement,
  StarElement,
} from '@/design';
import { ColorInput, Section, SliderRow, ToggleButton } from './fields';
import { FillEditor } from './fill-editor';

type FilledShape = RectElement | EllipseElement | PolygonElement | StarElement | PathElement;

interface ShapeSectionProps<T> {
  element: T;
  onChange: (next: T, live?: boolean) => void;
  onCommit: () => void;
}

export const ShapeSection = <T extends FilledShape>({
  element,
  onChange,
  onCommit,
}: ShapeSectionProps<T>) => {
  const patch = (partial: Partial<FilledShape>, live = false) =>
    onChange({ ...element, ...partial }, live);

  return (
    <>
      <Section title="Fill">
        <FillEditor
          label="Fill"
          fill={element.fill}
          onChange={(fill, live) => patch({ fill }, live)}
          onCommit={onCommit}
        />
      </Section>
      <Section title="Shape">
        {element.type === 'rect' ? (
          <SliderRow
            label="Corner radius"
            value={element.cornerRadius}
            min={0}
            max={Math.round(Math.min(element.width, element.height) / 2)}
            step={1}
            onChange={(cornerRadius) => onChange({ ...element, cornerRadius }, true)}
            onCommit={onCommit}
          />
        ) : null}
        {element.type === 'polygon' ? (
          <SliderRow
            label="Sides"
            value={element.sides}
            min={3}
            max={12}
            step={1}
            onChange={(sides) => onChange({ ...element, sides }, true)}
            onCommit={onCommit}
          />
        ) : null}
        {element.type === 'star' ? (
          <>
            <SliderRow
              label="Points"
              value={element.points}
              min={3}
              max={24}
              step={1}
              onChange={(points) => onChange({ ...element, points }, true)}
              onCommit={onCommit}
            />
            <SliderRow
              label="Inner radius"
              value={element.innerRatio}
              min={0.1}
              max={0.95}
              step={0.01}
              onChange={(innerRatio) => onChange({ ...element, innerRatio }, true)}
              onCommit={onCommit}
            />
          </>
        ) : null}
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
          <>
            <ColorInput
              label="Border color"
              value={element.stroke}
              onChange={(stroke, live) => patch({ stroke }, live)}
              onCommit={onCommit}
            />
            <ToggleButton
              label="Dashed border"
              active={element.dashed}
              onClick={() => patch({ dashed: !element.dashed })}
            >
              Dashed
            </ToggleButton>
          </>
        ) : null}
      </Section>
    </>
  );
};

export const LineSection = ({ element, onChange, onCommit }: ShapeSectionProps<LineElement>) => {
  const patch = (partial: Partial<LineElement>, live = false) =>
    onChange({ ...element, ...partial }, live);
  return (
    <Section title="Line">
      <ColorInput
        label="Line color"
        value={element.stroke}
        onChange={(stroke, live) => patch({ stroke }, live)}
        onCommit={onCommit}
        showSwatches
      />
      <SliderRow
        label="Thickness"
        value={element.strokeWidth}
        min={1}
        max={60}
        step={1}
        onChange={(strokeWidth) => patch({ strokeWidth }, true)}
        onCommit={onCommit}
      />
      <div className="flex gap-1">
        <ToggleButton
          label="Dashed line"
          active={element.dashed}
          onClick={() => patch({ dashed: !element.dashed })}
        >
          Dashed
        </ToggleButton>
        <ToggleButton
          label="Start arrow"
          active={element.arrowStart}
          onClick={() => patch({ arrowStart: !element.arrowStart })}
        >
          ← Start
        </ToggleButton>
        <ToggleButton
          label="End arrow"
          active={element.arrowEnd}
          onClick={() => patch({ arrowEnd: !element.arrowEnd })}
        >
          End →
        </ToggleButton>
      </div>
    </Section>
  );
};
