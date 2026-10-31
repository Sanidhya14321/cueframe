'use client';

import {
  ChevronLeft,
  CloudCheck,
  FolderOpen,
  Keyboard,
  LayoutGrid,
  Maximize2,
  Minus,
  MoreHorizontal,
  Plus,
  Redo2,
  RotateCcw,
  Scaling,
  Undo2,
} from 'lucide-react';
import Link from 'next/link';
import { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { DESIGN_FORMATS, type Design } from '@/design';
import { DownloadMenu } from './download-menu';
import { parseDesignJson } from './export-design';
import type { DesignEditorState } from './use-design-editor';

interface EditorHeaderProps {
  editor: DesignEditorState;
  zoom: number;
  backHref: string;
  onZoom: (direction: 'in' | 'out' | 'fit') => void;
  onOpen: (design: Design) => void;
  onReset: () => void;
  onHelp: () => void;
  savedAt: number | null;
  view: EditorView;
  onViewChange: (view: EditorView) => void;
}

interface EditorView {
  grid: boolean;
  snap: boolean;
}

const ResizeItems = ({ onResize }: { onResize: (width: number, height: number) => void }) => (
  <>
    <DropdownMenuLabel>Resize design</DropdownMenuLabel>
    {DESIGN_FORMATS.map((format) => (
      <DropdownMenuItem key={format.id} onSelect={() => onResize(format.width, format.height)}>
        <span className="flex-1">{format.label}</span>
        <span className="text-muted-foreground text-xs tabular-nums">
          {format.width}×{format.height}
        </span>
      </DropdownMenuItem>
    ))}
  </>
);

const ViewItems = ({
  view,
  onViewChange,
}: {
  view: EditorView;
  onViewChange: (view: EditorView) => void;
}) => (
  <>
    <DropdownMenuCheckboxItem
      checked={view.grid}
      onCheckedChange={(checked) => onViewChange({ ...view, grid: checked === true })}
    >
      Show grid
    </DropdownMenuCheckboxItem>
    <DropdownMenuCheckboxItem
      checked={view.snap}
      onCheckedChange={(checked) => onViewChange({ ...view, snap: checked === true })}
    >
      Snap to smart guides
    </DropdownMenuCheckboxItem>
  </>
);

export const EditorHeader = ({
  editor,
  zoom,
  backHref,
  onZoom,
  onOpen,
  onReset,
  onHelp,
  savedAt,
  view,
  onViewChange,
}: EditorHeaderProps) => {
  const { design } = editor;
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const openRef = useRef<HTMLInputElement>(null);

  const run = (task: () => Promise<void> | void) => {
    runTask(task).catch(() => undefined);
  };

  const runTask = async (task: () => Promise<void> | void) => {
    setBusy(true);
    setError(null);
    try {
      await task();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Export failed');
    } finally {
      setBusy(false);
    }
  };

  return (
    <header className="relative flex h-14 shrink-0 items-center gap-1 border-b bg-background px-2 sm:gap-2 sm:px-3">
      <Button variant="ghost" size="icon-sm" asChild>
        <Link href={backHref} aria-label="Back to designs">
          <ChevronLeft />
        </Link>
      </Button>
      <input
        aria-label="Design title"
        key={design.title}
        defaultValue={design.title}
        onBlur={(event) => {
          const title = event.target.value.trim();
          if (title !== '' && title !== design.title) {
            editor.rename(title);
          }
        }}
        onKeyDown={(event) => {
          if (event.key === 'Enter') {
            event.currentTarget.blur();
          }
        }}
        className="h-8 w-28 min-w-0 truncate rounded-md bg-transparent sm:w-44 xl:w-56 px-2 font-medium text-sm outline-none hover:bg-muted focus:bg-muted"
      />
      <div className="flex items-center gap-0.5">
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label="Undo"
          disabled={!editor.canUndo}
          onClick={editor.undo}
        >
          <Undo2 />
        </Button>
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label="Redo"
          disabled={!editor.canRedo}
          onClick={editor.redo}
        >
          <Redo2 />
        </Button>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="hidden lg:inline-flex">
            <Scaling /> Resize
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <ResizeItems onResize={editor.resize} />
        </DropdownMenuContent>
      </DropdownMenu>
      <span
        className="hidden items-center gap-1 text-muted-foreground text-xs xl:flex"
        title="Your edits are saved in this browser automatically"
      >
        <CloudCheck className="size-4" />
        {savedAt === null ? 'Saved' : `Saved ${new Date(savedAt).toLocaleTimeString()}`}
      </span>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="hidden lg:inline-flex">
            <LayoutGrid /> View
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <ViewItems view={view} onViewChange={onViewChange} />
        </DropdownMenuContent>
      </DropdownMenu>
      <div className="ml-auto flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label="Keyboard shortcuts"
          onClick={onHelp}
          className="hidden lg:inline-flex"
        >
          <Keyboard />
        </Button>
        <div className="hidden items-center gap-0.5 rounded-md bg-muted px-1 sm:flex">
          <Button
            variant="ghost"
            size="icon-xs"
            aria-label="Zoom out"
            onClick={() => onZoom('out')}
          >
            <Minus />
          </Button>
          <button
            type="button"
            className="w-12 text-center text-xs tabular-nums"
            title="Fit to screen"
            onClick={() => onZoom('fit')}
          >
            {Math.round(zoom * 100)}%
          </button>
          <Button variant="ghost" size="icon-xs" aria-label="Zoom in" onClick={() => onZoom('in')}>
            <Plus />
          </Button>
          <Button
            variant="ghost"
            size="icon-xs"
            aria-label="Fit to screen"
            onClick={() => onZoom('fit')}
          >
            <Maximize2 />
          </Button>
        </div>
        <input
          ref={openRef}
          type="file"
          accept="application/json,.json"
          className="hidden"
          aria-label="Open design file"
          onChange={async (event) => {
            const file = event.target.files?.[0];
            event.target.value = '';
            if (file === undefined) {
              return;
            }
            const parsed = parseDesignJson(await file.text());
            if (parsed === null) {
              setError('That file is not a valid design');
              return;
            }
            onOpen(parsed);
          }}
        />
        <Button
          variant="ghost"
          size="sm"
          onClick={onReset}
          title="Discard your edits and restore the original poster"
          className="hidden lg:inline-flex"
        >
          <RotateCcw /> Reset
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => openRef.current?.click()}
          className="hidden lg:inline-flex"
        >
          <FolderOpen /> Open
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon-sm" aria-label="More options" className="lg:hidden">
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64">
            <ResizeItems onResize={editor.resize} />
            <DropdownMenuSeparator />
            <ViewItems view={view} onViewChange={onViewChange} />
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={onReset}>
              <RotateCcw /> Reset to original
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => openRef.current?.click()}>
              <FolderOpen /> Open design file
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <DownloadMenu design={design} busy={busy} run={run} />
      </div>
      {error === null ? null : (
        <p
          role="alert"
          className="absolute top-14 right-3 rounded-md bg-destructive px-3 py-1.5 text-white text-xs"
        >
          {error}
        </p>
      )}
    </header>
  );
};
