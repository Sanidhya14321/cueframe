'use client';

import {
  AlignCenterHorizontal,
  AlignCenterVertical,
  BringToFront,
  ChevronDown,
  ChevronUp,
  ClipboardPaste,
  Copy,
  CopyPlus,
  Eye,
  EyeOff,
  Group,
  ImageIcon,
  Lock,
  LockOpen,
  type LucideIcon,
  Paintbrush,
  PaintRoller,
  Pencil,
  Scissors,
  SendToBack,
  SquareDashedMousePointer,
  Trash2,
  Ungroup,
} from 'lucide-react';
import { useEffect, useRef } from 'react';
import type { Point } from '@/design';
import { cn } from '@/lib/utils';
import type { DesignEditorState } from './use-design-editor';
import type { SelectionActions } from './use-selection-actions';

interface MenuItem {
  label: string;
  shortcut?: string;
  Icon: LucideIcon;
  run: () => void;
  danger?: boolean;
}

const selectionItems = (editor: DesignEditorState, actions: SelectionActions): MenuItem[][] => {
  const { selectedElements } = editor;
  const [first] = selectedElements;
  const locked = selectedElements.every((element) => element.locked);
  const hidden = selectedElements.every((element) => element.hidden);
  const grouped =
    selectedElements.length > 1 &&
    selectedElements.every(
      (element) => element.groupId !== undefined && element.groupId === first?.groupId,
    );
  const special: MenuItem[] = [];
  if (selectedElements.length === 1 && first?.type === 'text') {
    special.push({
      label: 'Edit text',
      shortcut: 'Enter',
      Icon: Pencil,
      run: () => editor.setEditingId(first.id),
    });
  }
  if (selectedElements.length === 1 && first?.type === 'image') {
    special.push({ label: 'Set as background', Icon: ImageIcon, run: actions.setAsBackground });
  }
  return [
    special,
    [
      { label: 'Cut', shortcut: '⌘X', Icon: Scissors, run: editor.cutSelected },
      { label: 'Copy', shortcut: '⌘C', Icon: Copy, run: editor.copySelected },
      { label: 'Paste', shortcut: '⌘V', Icon: ClipboardPaste, run: editor.paste },
      { label: 'Duplicate', shortcut: '⌘D', Icon: CopyPlus, run: editor.duplicateSelected },
    ],
    [
      { label: 'Copy style', shortcut: '⌘⌥C', Icon: Paintbrush, run: actions.copyStyle },
      { label: 'Paste style', shortcut: '⌘⌥V', Icon: PaintRoller, run: actions.pasteStyle },
    ],
    [
      {
        label: 'Bring forward',
        shortcut: '⌘]',
        Icon: ChevronUp,
        run: () => editor.reorderSelected('forward'),
      },
      {
        label: 'Bring to front',
        shortcut: '⌘⌥]',
        Icon: BringToFront,
        run: () => editor.reorderSelected('front'),
      },
      {
        label: 'Send backward',
        shortcut: '⌘[',
        Icon: ChevronDown,
        run: () => editor.reorderSelected('backward'),
      },
      {
        label: 'Send to back',
        shortcut: '⌘⌥[',
        Icon: SendToBack,
        run: () => editor.reorderSelected('back'),
      },
    ],
    [
      {
        label: 'Centre on page',
        Icon: AlignCenterVertical,
        run: () => editor.alignSelected('center', 'page'),
      },
      {
        label: 'Middle of page',
        Icon: AlignCenterHorizontal,
        run: () => editor.alignSelected('middle', 'page'),
      },
      ...(selectedElements.length > 1
        ? [
            {
              label: grouped ? 'Ungroup' : 'Group',
              shortcut: grouped ? '⌘⇧G' : '⌘G',
              Icon: grouped ? Ungroup : Group,
              run: grouped ? editor.ungroupSelected : editor.groupSelected,
            },
          ]
        : []),
      {
        label: locked ? 'Unlock' : 'Lock',
        shortcut: '⌘⇧L',
        Icon: locked ? LockOpen : Lock,
        run: editor.toggleLockSelected,
      },
      {
        label: hidden ? 'Show' : 'Hide',
        shortcut: '⌘⇧H',
        Icon: hidden ? Eye : EyeOff,
        run: actions.toggleHidden,
      },
    ],
    [{ label: 'Delete', shortcut: '⌫', Icon: Trash2, run: editor.removeSelected, danger: true }],
  ];
};

const canvasItems = (editor: DesignEditorState): MenuItem[][] => [
  [
    { label: 'Paste', shortcut: '⌘V', Icon: ClipboardPaste, run: editor.paste },
    { label: 'Select all', shortcut: '⌘A', Icon: SquareDashedMousePointer, run: editor.selectAll },
  ],
];

interface ContextMenuProps {
  point: Point | null;
  editor: DesignEditorState;
  actions: SelectionActions;
  onClose: () => void;
}

export const EditorContextMenu = ({ point, editor, actions, onClose }: ContextMenuProps) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (point === null) {
      return;
    }
    const close = (event: Event) => {
      if (!(event.target instanceof Node && ref.current?.contains(event.target))) {
        onClose();
      }
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('pointerdown', close, true);
    window.addEventListener('wheel', onClose, { passive: true });
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('pointerdown', close, true);
      window.removeEventListener('wheel', onClose);
      window.removeEventListener('keydown', onKey);
    };
  }, [point, onClose]);

  if (point === null) {
    return null;
  }
  const groups = (
    editor.selectedIds.length > 0 ? selectionItems(editor, actions) : canvasItems(editor)
  ).filter((group) => group.length > 0);
  const left = Math.min(point.x, window.innerWidth - 248);
  const top = Math.min(point.y, window.innerHeight - 40 - groups.flat().length * 32);

  return (
    <div
      ref={ref}
      role="menu"
      aria-label="Element actions"
      className="fixed z-50 w-60 overflow-hidden rounded-xl border bg-popover p-1 text-popover-foreground text-sm shadow-xl"
      style={{ left, top: Math.max(8, top) }}
    >
      {groups.map((group, index) => (
        <div key={group[0]?.label ?? index} className={cn(index > 0 && 'mt-1 border-t pt-1')}>
          {group.map((item) => (
            <button
              type="button"
              role="menuitem"
              key={item.label}
              onClick={() => {
                item.run();
                onClose();
              }}
              className={cn(
                'flex h-8 w-full items-center gap-2.5 rounded-md px-2 text-left hover:bg-accent',
                item.danger === true && 'text-destructive',
              )}
            >
              <item.Icon className="size-4 shrink-0 opacity-70" />
              <span className="flex-1">{item.label}</span>
              {item.shortcut === undefined ? null : (
                <span className="text-muted-foreground text-xs">{item.shortcut}</span>
              )}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
};
