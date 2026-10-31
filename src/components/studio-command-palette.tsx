'use client';

import { Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { STUDIO_COMMANDS } from '@/components/studio-actions';
import { useTheme } from '@/components/theme-provider';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { prepareEditorNavigation } from '@/lib/editor-navigation';
import { useCreateProject } from '@/lib/use-create-project';
import { cn } from '@/lib/utils';

export const StudioCommandPalette = () => {
  const router = useRouter();
  const [navigationProblem, setNavigationProblem] = useState('');
  const { toggle } = useTheme();
  const { create, busy, problem } = useCreateProject();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const selected = useRef<HTMLButtonElement>(null);
  const invokingElement = useRef<HTMLElement | null>(null);
  const changeOpen = useCallback((next: boolean) => {
    if (next) {
      invokingElement.current =
        document.activeElement instanceof HTMLElement ? document.activeElement : null;
      setQuery('');
      setActive(0);
    }
    setOpen(next);
  }, []);
  const commands = STUDIO_COMMANDS.filter((command) =>
    `${command.label} ${command.description}`.toLowerCase().includes(query.toLowerCase()),
  );
  useEffect(() => {
    const keydown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        changeOpen(!open);
      }
    };
    window.addEventListener('keydown', keydown);
    return () => window.removeEventListener('keydown', keydown);
  }, [changeOpen, open]);
  useEffect(() => {
    if (active >= 0) {
      selected.current?.scrollIntoView({ block: 'nearest' });
    }
  }, [active]);
  const run = async (command: (typeof STUDIO_COMMANDS)[number]) => {
    setNavigationProblem('');
    if (command.id === 'new') {
      if (await create()) {
        changeOpen(false);
      }
    } else if (command.id === 'theme') {
      toggle();
    } else if (command.href) {
      try {
        await prepareEditorNavigation();
        router.push(command.href);
      } catch (error) {
        setNavigationProblem(error instanceof Error ? error.message : 'Save before navigating.');
        return;
      }
    }
    if (command.id !== 'new') {
      changeOpen(false);
    }
  };
  return (
    <Dialog open={open} onOpenChange={changeOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="size-11 lg:w-auto lg:gap-3 lg:px-3"
          aria-label="Open command palette"
        >
          <Search />
          <kbd className="hidden text-xs text-muted-foreground lg:inline">⌘ / Ctrl K</kbd>
        </Button>
      </DialogTrigger>
      <DialogContent
        className="flex max-h-[calc(100dvh-2rem)] flex-col gap-0 overflow-hidden p-0 shadow-floating duration-(--motion-panel) ease-(--ease-ui)"
        showCloseButton={false}
        onCloseAutoFocus={(event) => {
          if (invokingElement.current?.isConnected) {
            event.preventDefault();
            invokingElement.current.focus({ preventScroll: true });
          }
        }}
      >
        <div className="shrink-0 px-5 pt-5 pb-3">
          <DialogTitle className="font-display text-3xl font-normal">
            Find your next action
          </DialogTitle>
          <DialogDescription className="mt-1">Search pages and studio commands.</DialogDescription>
        </div>
        <div className="shrink-0 border-b px-3 pb-3">
          <Input
            aria-label="Search commands"
            role="combobox"
            aria-expanded="true"
            aria-controls="studio-commands"
            aria-activedescendant={commands[active] ? `command-${active}` : undefined}
            autoComplete="off"
            placeholder="Projects, new video, settings…"
            className="h-11"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setActive(0);
            }}
            onKeyDown={(event) => {
              if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
                event.preventDefault();
                setActive((value) =>
                  commands.length === 0
                    ? 0
                    : (value + (event.key === 'ArrowDown' ? 1 : -1) + commands.length) %
                      commands.length,
                );
              }
              if (event.key === 'Enter' && commands[active] && !busy) {
                event.preventDefault();
                run(commands[active]).catch(() => changeOpen(false));
              }
            }}
          />
        </div>
        <div
          id="studio-commands"
          role="listbox"
          aria-label="Studio commands"
          className="min-h-0 max-h-[50dvh] flex-1 overflow-y-auto p-2"
        >
          {commands.map((command, index) => (
            <button
              id={`command-${index}`}
              ref={index === active ? selected : null}
              role="option"
              tabIndex={-1}
              aria-selected={index === active}
              type="button"
              key={command.id}
              disabled={busy}
              className={cn(
                'flex min-h-14 w-full items-center gap-3 rounded-md px-3 py-2 text-left',
                index === active ? 'bg-accent text-accent-foreground' : 'hover:bg-muted',
              )}
              onMouseEnter={() => setActive(index)}
              onClick={() => run(command).catch(() => changeOpen(false))}
            >
              <command.icon className="size-4 shrink-0 text-muted-foreground" />
              <span className="min-w-0">
                <span className="block text-sm font-medium">
                  {busy && command.id === 'new' ? 'Creating your project…' : command.label}
                </span>
                <span className="block text-xs text-muted-foreground">{command.description}</span>
              </span>
            </button>
          ))}
          {commands.length === 0 ? (
            <p role="status" className="px-3 py-8 text-sm text-muted-foreground">
              No actions found. Try “project” or “settings”.
            </p>
          ) : null}
        </div>
        {problem || navigationProblem ? (
          <p role="alert" className="px-5 py-3 text-sm text-destructive">
            {problem || navigationProblem}
          </p>
        ) : null}
        <div className="flex shrink-0 items-center justify-between border-t px-5 py-3 text-xs text-muted-foreground">
          <span>↑ ↓ to move · Enter to open</span>
          <span>Esc to close</span>
        </div>
      </DialogContent>
    </Dialog>
  );
};
