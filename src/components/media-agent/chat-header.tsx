'use client';

import {
  Check,
  ChevronDown,
  Maximize2,
  Minimize2,
  PenLine,
  SquarePen,
  Trash2,
  X,
} from 'lucide-react';
import { type KeyboardEvent, useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { activeChat, type ChatLibrary, chatTitle } from './chat-library';
import type { ChatLibraryActions } from './use-chat-library';

const UNITS: [Intl.RelativeTimeFormatUnit, number][] = [
  ['day', 86_400_000],
  ['hour', 3_600_000],
  ['minute', 60_000],
];

const timeAgo = (at: number, now: number): string => {
  const elapsed = now - at;
  const format = new Intl.RelativeTimeFormat(undefined, { numeric: 'auto', style: 'short' });
  for (const [unit, size] of UNITS) {
    if (elapsed >= size) {
      return format.format(-Math.floor(elapsed / size), unit);
    }
  }
  return 'just now';
};

const RenameField = ({
  initial,
  onDone,
}: {
  initial: string;
  onDone: (title: string | null) => void;
}) => {
  const [value, setValue] = useState(initial);
  const field = useRef<HTMLInputElement>(null);
  useEffect(() => {
    field.current?.focus();
  }, []);
  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      onDone(value);
    }
    if (event.key === 'Escape') {
      event.stopPropagation();
      onDone(null);
    }
  };
  return (
    <input
      value={value}
      onChange={(event) => setValue(event.target.value)}
      onKeyDown={onKeyDown}
      onBlur={() => onDone(value)}
      onFocus={(event) => event.target.select()}
      aria-label="Chat name"
      maxLength={60}
      ref={field}
      className="h-7 w-full min-w-0 rounded-md border bg-background px-2 font-medium text-base outline-none focus:border-violet-500/60 focus:ring-2 focus:ring-violet-500/20 sm:text-sm"
    />
  );
};

interface ChatHeaderProps {
  library: ChatLibrary;
  actions: ChatLibraryActions;
  mediaTitle: string;
  expanded: boolean;
  onToggleExpanded: () => void;
  onClose: () => void;
}

export const ChatHeader = ({
  library,
  actions,
  mediaTitle,
  expanded,
  onToggleExpanded,
  onClose,
}: ChatHeaderProps) => {
  const [renaming, setRenaming] = useState(false);
  const keepFocus = useRef(false);
  const current = activeChat(library);
  const title = chatTitle(current);
  const now = Date.now();
  const saved = library.chats.filter((chat) => chat.messages.length > 0);

  const finishRename = (next: string | null) => {
    if (next !== null && next.trim() !== '' && next.trim() !== title) {
      actions.rename(current.id, next);
    }
    setRenaming(false);
  };

  return (
    <div className="flex items-center gap-1 border-b px-3 py-2">
      <div className="min-w-0 flex-1">
        {renaming ? (
          <RenameField initial={title} onDone={finishRename} />
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="group flex max-w-full items-center gap-1 rounded-md px-1.5 py-1 text-left transition-colors hover:bg-muted"
                aria-label="Chats"
              >
                <span
                  key={title}
                  className="fade-in-0 truncate font-semibold text-sm animate-in duration-300"
                  data-testid="agent-chat-title"
                >
                  {title}
                </span>
                <ChevronDown className="size-3.5 shrink-0 text-muted-foreground transition-transform group-data-[state=open]:rotate-180" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="start"
              className="w-72"
              onCloseAutoFocus={(event) => {
                if (keepFocus.current) {
                  event.preventDefault();
                  keepFocus.current = false;
                }
              }}
            >
              <DropdownMenuLabel className="truncate">Chats about {mediaTitle}</DropdownMenuLabel>
              {saved.length === 0 ? (
                <p className="px-2 py-1.5 text-muted-foreground text-xs">No saved chats yet</p>
              ) : (
                saved.map((chat) => (
                  <DropdownMenuItem key={chat.id} onSelect={() => actions.open(chat.id)}>
                    <Check
                      className={cn(
                        'size-3.5 shrink-0',
                        chat.id === current.id ? 'opacity-100' : 'opacity-0',
                      )}
                    />
                    <span className="min-w-0 flex-1 truncate">{chatTitle(chat)}</span>
                    <span className="shrink-0 text-muted-foreground text-xs">
                      {timeAgo(chat.updatedAt, now)}
                    </span>
                  </DropdownMenuItem>
                ))
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onSelect={() => {
                  keepFocus.current = true;
                  setRenaming(true);
                }}
              >
                <PenLine className="size-3.5" /> Rename chat
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() => actions.remove(current.id)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="size-3.5" /> Delete chat
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={actions.start}
        disabled={current.messages.length === 0}
        aria-label="New chat"
        title="New chat"
      >
        <SquarePen />
      </Button>
      <Button
        variant="ghost"
        size="icon-sm"
        className="md:hidden"
        onClick={onToggleExpanded}
        aria-label={expanded ? 'Shrink AI editor' : 'Expand AI editor'}
      >
        {expanded ? <Minimize2 /> : <Maximize2 />}
      </Button>
      <Button variant="ghost" size="icon-sm" onClick={onClose} aria-label="Close AI editor">
        <X />
      </Button>
    </div>
  );
};
