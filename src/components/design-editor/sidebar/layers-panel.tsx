'use client';

import {
  Circle,
  Eye,
  EyeOff,
  Image,
  Lock,
  LockOpen,
  Minus,
  Shapes,
  Smile,
  Spline,
  Square,
  Star,
  Triangle,
  Type,
} from 'lucide-react';
import { useState } from 'react';
import type { DesignElement } from '@/design';
import { cn } from '@/lib/utils';
import type { DesignEditorState } from '../use-design-editor';

const TYPE_ICONS: Record<DesignElement['type'], typeof Type> = {
  text: Type,
  rect: Square,
  ellipse: Circle,
  polygon: Triangle,
  star: Star,
  path: Spline,
  line: Minus,
  image: Image,
  icon: Smile,
};

const DEFAULT_TEXT_NAMES = new Set(['Text', 'Heading', 'Subheading', 'Body']);

const layerLabel = (element: DesignElement): string =>
  element.type === 'text' && DEFAULT_TEXT_NAMES.has(element.name)
    ? element.text.split('\n')[0]?.slice(0, 40) || 'Text'
    : element.name;

export const LayersPanel = ({ editor }: { editor: DesignEditorState }) => {
  const { design, selectedIds } = editor;
  const [dragId, setDragId] = useState<string | null>(null);
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const layers = [...design.elements].reverse();

  if (layers.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 py-10 text-center text-muted-foreground text-sm">
        <Shapes className="size-6" />
        Nothing on the canvas yet.
      </div>
    );
  }

  return (
    <ul className="flex flex-col gap-1" aria-label="Layers">
      {layers.map((element) => {
        const Icon = TYPE_ICONS[element.type];
        const selected = selectedIds.includes(element.id);
        return (
          <li
            key={element.id}
            className={cn(
              'group relative flex h-10 items-center gap-2 rounded-lg px-2 text-sm transition-colors',
              selected ? 'bg-violet-500/15' : 'hover:bg-accent',
              element.hidden && 'opacity-50',
            )}
          >
            <button
              type="button"
              draggable
              onDragStart={() => setDragId(element.id)}
              onDragOver={(event) => event.preventDefault()}
              onDrop={() => {
                if (dragId !== null && dragId !== element.id) {
                  editor.moveLayer(
                    dragId,
                    design.elements.findIndex((item) => item.id === element.id),
                  );
                }
                setDragId(null);
              }}
              className="flex h-full min-w-0 flex-1 items-center gap-2 text-left"
              onClick={(event) => editor.select([element.id], event.shiftKey || event.metaKey)}
              onDoubleClick={() => setRenamingId(element.id)}
              title="Double-click to rename"
            >
              <Icon className="size-4 shrink-0 text-muted-foreground" />
              {renamingId === element.id ? null : (
                <span className="truncate">{layerLabel(element)}</span>
              )}
            </button>
            {renamingId === element.id ? (
              <input
                aria-label="Layer name"
                defaultValue={layerLabel(element)}
                ref={(node) => node?.select()}
                onBlur={(event) => {
                  const name = event.target.value.trim();
                  if (name !== '' && name !== element.name) {
                    editor.replaceElement({ ...element, name });
                  }
                  setRenamingId(null);
                }}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    event.currentTarget.blur();
                  }
                  if (event.key === 'Escape') {
                    setRenamingId(null);
                  }
                }}
                className="absolute inset-y-1 right-16 left-8 rounded-md bg-background px-2 text-sm outline outline-violet-500"
              />
            ) : null}
            <button
              type="button"
              aria-label={element.hidden ? 'Show layer' : 'Hide layer'}
              onClick={() => editor.replaceElement({ ...element, hidden: !element.hidden })}
              className="rounded p-1 text-muted-foreground opacity-0 hover:text-foreground group-hover:opacity-100"
            >
              {element.hidden ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
            <button
              type="button"
              aria-label={element.locked ? 'Unlock layer' : 'Lock layer'}
              onClick={() => editor.replaceElement({ ...element, locked: !element.locked })}
              className={cn(
                'rounded p-1 text-muted-foreground hover:text-foreground',
                element.locked ? 'opacity-100' : 'opacity-0 group-hover:opacity-100',
              )}
            >
              {element.locked ? <Lock className="size-4" /> : <LockOpen className="size-4" />}
            </button>
          </li>
        );
      })}
    </ul>
  );
};
