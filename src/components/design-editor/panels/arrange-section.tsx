'use client';

import {
  AlignCenterHorizontal,
  AlignCenterVertical,
  AlignEndHorizontal,
  AlignEndVertical,
  AlignHorizontalDistributeCenter,
  AlignStartHorizontal,
  AlignStartVertical,
  AlignVerticalDistributeCenter,
  BringToFront,
  ChevronDown,
  ChevronUp,
  Copy,
  Group,
  Lock,
  LockOpen,
  SendToBack,
  Trash2,
  Ungroup,
} from 'lucide-react';
import type { Alignment, DesignElement } from '@/design';
import type { DesignEditorState } from '../use-design-editor';
import { NumberInput, Section, SliderRow, ToggleButton } from './fields';

const ALIGN_BUTTONS: { alignment: Alignment; label: string; Icon: typeof AlignStartVertical }[] = [
  { alignment: 'left', label: 'Align left', Icon: AlignStartVertical },
  { alignment: 'center', label: 'Align centre', Icon: AlignCenterVertical },
  { alignment: 'right', label: 'Align right', Icon: AlignEndVertical },
  { alignment: 'top', label: 'Align top', Icon: AlignStartHorizontal },
  { alignment: 'middle', label: 'Align middle', Icon: AlignCenterHorizontal },
  { alignment: 'bottom', label: 'Align bottom', Icon: AlignEndHorizontal },
];

interface ArrangeSectionProps {
  editor: DesignEditorState;
  element: DesignElement | null;
  onChange: (next: DesignElement, live?: boolean) => void;
}

export const ActionsBar = ({ editor }: { editor: DesignEditorState }) => {
  const { selectedElements } = editor;
  const locked = selectedElements.length > 0 && selectedElements.every((element) => element.locked);
  const grouped =
    selectedElements.length > 1 &&
    selectedElements.every(
      (element) =>
        element.groupId !== undefined && element.groupId === selectedElements[0]?.groupId,
    );
  return (
    <div className="flex flex-wrap gap-1 border-b px-4 py-3">
      <ToggleButton label="Duplicate" active={false} onClick={editor.duplicateSelected}>
        <Copy />
      </ToggleButton>
      <ToggleButton
        label={locked ? 'Unlock' : 'Lock'}
        active={locked}
        onClick={editor.toggleLockSelected}
      >
        {locked ? <Lock /> : <LockOpen />}
      </ToggleButton>
      {selectedElements.length > 1 ? (
        <ToggleButton
          label={grouped ? 'Ungroup' : 'Group'}
          active={grouped}
          onClick={grouped ? editor.ungroupSelected : editor.groupSelected}
        >
          {grouped ? <Ungroup /> : <Group />}
        </ToggleButton>
      ) : null}
      <ToggleButton
        label="Bring forward"
        active={false}
        onClick={() => editor.reorderSelected('forward')}
      >
        <ChevronUp />
      </ToggleButton>
      <ToggleButton
        label="Send backward"
        active={false}
        onClick={() => editor.reorderSelected('backward')}
      >
        <ChevronDown />
      </ToggleButton>
      <ToggleButton
        label="Bring to front"
        active={false}
        onClick={() => editor.reorderSelected('front')}
      >
        <BringToFront />
      </ToggleButton>
      <ToggleButton
        label="Send to back"
        active={false}
        onClick={() => editor.reorderSelected('back')}
      >
        <SendToBack />
      </ToggleButton>
      <ToggleButton
        label="Delete"
        active={false}
        onClick={editor.removeSelected}
        className="ml-auto text-destructive"
      >
        <Trash2 />
      </ToggleButton>
    </div>
  );
};

export const ArrangeSection = ({ editor, element, onChange }: ArrangeSectionProps) => (
  <Section title="Position">
    {element === null ? null : (
      <>
        <div className="grid grid-cols-2 gap-2">
          <NumberInput label="X" value={element.x} onChange={(x) => onChange({ ...element, x })} />
          <NumberInput label="Y" value={element.y} onChange={(y) => onChange({ ...element, y })} />
          <NumberInput
            label="W"
            value={element.width}
            min={1}
            onChange={(width) => onChange({ ...element, width })}
          />
          {element.type === 'text' || element.type === 'line' ? null : (
            <NumberInput
              label="H"
              value={element.height}
              min={1}
              onChange={(height) => onChange({ ...element, height })}
            />
          )}
          <NumberInput
            label="↻"
            value={element.rotation}
            suffix="°"
            onChange={(rotation) => onChange({ ...element, rotation })}
          />
        </div>
        <SliderRow
          label="Transparency"
          value={element.opacity}
          min={0}
          max={1}
          step={0.01}
          format={(value) => `${Math.round(value * 100)}%`}
          onChange={(opacity) => onChange({ ...element, opacity }, true)}
          onCommit={editor.seal}
        />
      </>
    )}
    <div className="flex flex-wrap gap-1">
      {ALIGN_BUTTONS.map(({ alignment, label, Icon }) => (
        <ToggleButton
          key={alignment}
          label={label}
          active={false}
          onClick={() => editor.alignSelected(alignment)}
        >
          <Icon />
        </ToggleButton>
      ))}
      {editor.selectedIds.length > 2 ? (
        <>
          <ToggleButton
            label="Distribute horizontally"
            active={false}
            onClick={() => editor.distributeSelected('horizontal')}
          >
            <AlignHorizontalDistributeCenter />
          </ToggleButton>
          <ToggleButton
            label="Distribute vertically"
            active={false}
            onClick={() => editor.distributeSelected('vertical')}
          >
            <AlignVerticalDistributeCenter />
          </ToggleButton>
        </>
      ) : null}
    </div>
  </Section>
);
