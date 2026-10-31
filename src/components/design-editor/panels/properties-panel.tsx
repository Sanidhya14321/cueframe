'use client';

import type { DesignElement } from '@/design';
import { ColorControls } from '../sidebar/theme-panel';
import type { DesignEditorState } from '../use-design-editor';
import { ActionsBar, ArrangeSection } from './arrange-section';
import { Section } from './fields';
import { IconSection } from './icon-section';
import { ImageSection } from './image-section';
import { ShadowSection } from './shadow-section';
import { LineSection, ShapeSection } from './shape-section';
import { TextEffectsSection } from './text-effects-section';
import { TextSection } from './text-section';

const TYPE_LABELS: Record<DesignElement['type'], string> = {
  text: 'Text',
  rect: 'Rectangle',
  ellipse: 'Ellipse',
  polygon: 'Polygon',
  star: 'Star',
  path: 'Shape',
  line: 'Line',
  image: 'Image',
  icon: 'Icon',
};

const TypeSection = ({
  element,
  onChange,
  onCommit,
}: {
  element: DesignElement;
  onChange: (next: DesignElement, live?: boolean) => void;
  onCommit: () => void;
}) => {
  switch (element.type) {
    case 'text':
      return (
        <>
          <TextSection element={element} onChange={onChange} onCommit={onCommit} />
          <TextEffectsSection element={element} onChange={onChange} onCommit={onCommit} />
        </>
      );
    case 'image':
      return <ImageSection element={element} onChange={onChange} onCommit={onCommit} />;
    case 'icon':
      return <IconSection element={element} onChange={onChange} onCommit={onCommit} />;
    case 'line':
      return <LineSection element={element} onChange={onChange} onCommit={onCommit} />;
    default:
      return <ShapeSection element={element} onChange={onChange} onCommit={onCommit} />;
  }
};

export const PropertiesPanel = ({ editor }: { editor: DesignEditorState }) => {
  const { selectedElements, design } = editor;
  const single = selectedElements.length === 1 ? (selectedElements[0] ?? null) : null;

  if (selectedElements.length === 0) {
    return (
      <div className="flex flex-col">
        <div className="border-b px-4 py-3 font-medium text-sm">Design</div>
        {design.controls.some((control) => control.kind === 'color') ? (
          <Section title="Colors">
            <ColorControls editor={editor} />
          </Section>
        ) : null}
        <Section title="Size">
          <p className="text-muted-foreground text-xs">
            {design.width} × {design.height} px
          </p>
        </Section>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <div className="border-b px-4 py-3 font-medium text-sm">
        {single === null ? `${selectedElements.length} elements` : TYPE_LABELS[single.type]}
      </div>
      <ActionsBar editor={editor} />
      {single === null ? null : (
        <TypeSection element={single} onChange={editor.replaceElement} onCommit={editor.seal} />
      )}
      <ArrangeSection editor={editor} element={single} onChange={editor.replaceElement} />
      {single === null ? null : (
        <ShadowSection element={single} onChange={editor.replaceElement} onCommit={editor.seal} />
      )}
    </div>
  );
};
