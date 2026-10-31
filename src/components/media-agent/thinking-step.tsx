'use client';

import { ChevronRight, Lightbulb } from 'lucide-react';
import { Fragment, type ReactNode, useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { Collapse } from './collapse';

const withBold = (text: string): ReactNode[] =>
  text.split(/\*\*(.+?)\*\*/g).map((chunk, index) =>
    index % 2 === 1 ? (
      <strong key={`${index}-${chunk}`} className="font-medium text-foreground">
        {chunk}
      </strong>
    ) : (
      <Fragment key={`${index}-${chunk}`}>{chunk}</Fragment>
    ),
  );

export const ThinkingStep = ({ text, live }: { text: string; live: boolean }) => {
  const [open, setOpen] = useState(live);
  const wasLive = useRef(live);
  const body = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (wasLive.current && !live) {
      setOpen(false);
    }
    wasLive.current = live;
  }, [live]);

  useEffect(() => {
    if (live && text !== '' && body.current !== null) {
      body.current.scrollTop = body.current.scrollHeight;
    }
  }, [live, text]);

  return (
    <div data-testid="agent-thinking" data-open={open}>
      <button
        type="button"
        onClick={() => setOpen((wasOpen) => !wasOpen)}
        aria-expanded={open}
        className="flex items-center gap-1.5 text-muted-foreground text-xs transition-colors hover:text-foreground"
      >
        <Lightbulb className="size-3.5" />
        <span className={cn(live && 'text-shimmer')}>{live ? 'Thinking' : 'Thought'}</span>
        <ChevronRight
          className={cn('size-3.5 transition-transform duration-200', open && 'rotate-90')}
        />
      </button>
      <Collapse open={open}>
        <p
          ref={body}
          className="mt-1.5 ml-[6px] max-h-44 overflow-y-auto whitespace-pre-wrap border-l pl-3 text-muted-foreground text-xs leading-relaxed"
        >
          {withBold(text.trim())}
        </p>
      </Collapse>
    </div>
  );
};
