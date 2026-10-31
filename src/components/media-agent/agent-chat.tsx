'use client';

import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { ArrowDown, ArrowUp, Crosshair, RotateCcw, Sparkles, Square } from 'lucide-react';
import { type FormEvent, type KeyboardEvent, useEffect, useRef, useState } from 'react';
import { StickToBottom, useStickToBottomContext } from 'use-stick-to-bottom';
import type { EditOperation } from '@/agent/edits';
import type { MediaContext, MediaKind } from '@/agent/media';
import type { MediaAgentMessage } from '@/agent/tools';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { AgentTurn, isShowingProgress } from './agent-turn';
import type { StoredChat } from './chat-library';
import { Appear } from './collapse';

const SUGGESTIONS: Record<MediaKind, string[]> = {
  clip: [
    'Change the main line to SHIP FASTER WITH LESS STRESS',
    'Make the big words bright orange',
    'Slow the whole animation down a bit',
  ],
  poster: [
    'Rewrite the headline to be more exciting',
    'Switch to a deep navy background and keep the text readable',
    'Make all the review stars gold',
  ],
  site: [
    'We are getting married on 12 June 2027 at 4 pm at Villa Cimbrone, Ravello',
    'Write a warmer love story about meeting at a bookshop in Lisbon',
    'Switch to a dusty blue and silver palette',
  ],
};

const NOUNS: Record<MediaKind, string> = { clip: 'video', poster: 'poster', site: 'website' };

const handledCalls = (messages: readonly MediaAgentMessage[]): Set<string> =>
  new Set(
    messages.flatMap((message) =>
      message.parts.flatMap((part) =>
        part.type === 'tool-editMedia' || part.type === 'tool-renameChat' ? [part.toolCallId] : [],
      ),
    ),
  );

const userText = (message: MediaAgentMessage): string =>
  message.parts.map((part) => (part.type === 'text' ? part.text : '')).join('');

const JumpToLatest = () => {
  const { isAtBottom, scrollToBottom } = useStickToBottomContext();
  return (
    <button
      type="button"
      onClick={() => scrollToBottom()}
      aria-label="Jump to latest"
      className={cn(
        '-translate-x-1/2 absolute bottom-3 left-1/2 flex size-8 items-center justify-center rounded-full border bg-background shadow-md transition-all duration-200',
        isAtBottom ? 'pointer-events-none translate-y-2 opacity-0' : 'opacity-100',
      )}
    >
      <ArrowDown className="size-4" />
    </button>
  );
};

const Working = () => (
  <Appear>
    <p className="flex items-center gap-2 text-xs" data-testid="agent-working">
      <Sparkles className="size-3.5 animate-pulse text-violet-500" />
      <span className="text-shimmer">Thinking</span>
    </p>
  </Appear>
);

interface AgentChatProps {
  chat: StoredChat;
  kind: MediaKind;
  document: unknown;
  readMedia: () => MediaContext;
  selection: readonly string[];
  onEdit: (operations: readonly EditOperation[]) => void;
  onRename: (title: string) => void;
  onSave: (messages: MediaAgentMessage[]) => void;
}

export const AgentChat = ({
  chat,
  kind,
  document,
  readMedia,
  selection,
  onEdit,
  onRename,
  onSave,
}: AgentChatProps) => {
  const latest = useRef({ readMedia, onEdit, onRename, onSave, title: chat.title });
  latest.current = { readMedia, onEdit, onRename, onSave, title: chat.title };
  const [transport] = useState(
    () =>
      new DefaultChatTransport<MediaAgentMessage>({
        api: '/api/agent',
        prepareSendMessagesRequest: (request) => ({
          body: {
            messages: request.messages,
            chatTitle: latest.current.title,
            media: latest.current.readMedia(),
          },
        }),
      }),
  );
  const { messages, sendMessage, status, stop, error, regenerate, clearError } =
    useChat<MediaAgentMessage>({
      id: chat.id,
      messages: chat.messages,
      transport,
      onFinish: ({ messages: finished }) => latest.current.onSave(finished),
    });
  const [input, setInput] = useState('');
  const [handled] = useState(() => handledCalls(chat.messages));
  const busy = status === 'submitted' || status === 'streaming';
  const noun = NOUNS[kind];

  useEffect(() => {
    for (const message of messages) {
      for (const part of message.parts) {
        if (
          part.type === 'tool-editMedia' &&
          part.state === 'output-available' &&
          part.output.ok &&
          !handled.has(part.toolCallId)
        ) {
          handled.add(part.toolCallId);
          latest.current.onEdit(part.output.operations);
        }
        if (
          part.type === 'tool-renameChat' &&
          part.state === 'output-available' &&
          !handled.has(part.toolCallId)
        ) {
          handled.add(part.toolCallId);
          latest.current.onRename(part.output.title);
        }
      }
    }
  }, [messages, handled]);

  const stopOnLeave = useRef(stop);
  stopOnLeave.current = stop;
  useEffect(
    () => () => {
      stopOnLeave.current().catch(() => undefined);
    },
    [],
  );

  const send = (text: string) => {
    const trimmed = text.trim();
    if (trimmed === '' || busy) {
      return;
    }
    clearError();
    sendMessage({ text: trimmed }).catch(() => undefined);
    setInput('');
  };

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    send(input);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) {
      event.preventDefault();
      send(input);
    }
  };

  const last = messages.at(-1);

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <StickToBottom
        className="relative min-h-0 flex-1"
        initial="instant"
        resize="smooth"
        role="log"
        aria-label="Conversation"
      >
        <StickToBottom.Content
          className="flex min-h-full flex-col gap-5 px-4 py-4"
          scrollClassName="overscroll-contain"
        >
          {messages.length === 0 ? (
            <Appear className="my-auto flex flex-col gap-4">
              <div className="space-y-1 text-center">
                <p className="font-medium text-sm">What should change in this {noun}?</p>
                <p className="text-muted-foreground text-xs">
                  Describe it in your own words. Every edit can be undone.
                </p>
              </div>
              <div className="flex flex-col gap-2">
                {SUGGESTIONS[kind].map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => send(suggestion)}
                    className="rounded-lg border bg-muted/30 px-3 py-2 text-left text-sm transition-colors hover:border-violet-500/50 hover:bg-violet-500/5"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </Appear>
          ) : (
            messages.map((message, index) =>
              message.role === 'user' ? (
                <Appear key={message.id} className="flex justify-end">
                  <p className="max-w-[85%] whitespace-pre-wrap break-words rounded-2xl rounded-br-md bg-violet-600 px-3.5 py-2 text-sm text-white">
                    {userText(message)}
                  </p>
                </Appear>
              ) : (
                <AgentTurn
                  key={message.id}
                  message={message}
                  kind={kind}
                  document={document}
                  busy={busy && index === messages.length - 1}
                />
              ),
            )
          )}
          {busy && !isShowingProgress(last) ? <Working /> : null}
          {error === undefined ? null : (
            <Appear className="flex flex-col items-start gap-2">
              <p className="text-destructive text-sm">{error.message}</p>
              <Button
                size="sm"
                variant="outline"
                onClick={() => regenerate().catch(() => undefined)}
              >
                <RotateCcw /> Try again
              </Button>
            </Appear>
          )}
        </StickToBottom.Content>
        <JumpToLatest />
      </StickToBottom>
      <form
        onSubmit={onSubmit}
        className="border-t p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]"
      >
        <div className="flex items-end gap-2 rounded-xl border bg-background px-3 py-2 transition-[border-color,box-shadow] focus-within:border-violet-500/60 focus-within:ring-2 focus-within:ring-violet-500/20">
          <textarea
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={onKeyDown}
            rows={1}
            placeholder={`Ask for a change to this ${noun}`}
            aria-label="Message the AI editor"
            className="field-sizing-content max-h-32 min-h-6 flex-1 resize-none bg-transparent text-base outline-none placeholder:text-muted-foreground sm:text-sm"
          />
          {busy ? (
            <Button
              type="button"
              size="icon-sm"
              variant="secondary"
              onClick={() => stop().catch(() => undefined)}
              aria-label="Stop"
            >
              <Square className="size-3.5 fill-current" />
            </Button>
          ) : (
            <Button
              type="submit"
              size="icon-sm"
              className="bg-violet-600 text-white hover:bg-violet-600/90 disabled:bg-muted disabled:text-muted-foreground"
              disabled={input.trim() === ''}
              aria-label="Send"
            >
              <ArrowUp />
            </Button>
          )}
        </div>
        <p className="mt-2 flex items-center gap-1.5 truncate text-[11px] text-muted-foreground">
          <Crosshair className="size-3 shrink-0" />
          {selection.length === 0 ? `Editing the whole ${noun}` : `Editing ${selection.join(', ')}`}
        </p>
      </form>
    </div>
  );
};
