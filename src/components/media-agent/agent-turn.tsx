'use client';

import { PenLine } from 'lucide-react';
import type { MediaKind } from '@/agent/media';
import type { MediaAgentMessage } from '@/agent/tools';
import { Appear } from './collapse';
import { type EditPart, EditStep } from './edit-step';
import { ThinkingStep } from './thinking-step';

type Part = MediaAgentMessage['parts'][number];

const isEdit = (part: Part): part is EditPart => part.type === 'tool-editMedia';

const isSuperseded = (part: EditPart, last: EditPart | undefined): boolean =>
  part !== last && part.state === 'output-available' && !part.output.ok;

export const isShowingProgress = (message: MediaAgentMessage | undefined): boolean => {
  const part = message?.role === 'assistant' ? message.parts.at(-1) : undefined;
  if (part === undefined) {
    return false;
  }
  if (part.type === 'reasoning' || part.type === 'text') {
    return part.state === 'streaming' && part.text.trim() !== '';
  }
  return isEdit(part) && part.state !== 'output-error';
};

interface TurnPartProps {
  part: Part;
  lastEdit: EditPart | undefined;
  kind: MediaKind;
  document: unknown;
  busy: boolean;
}

const TurnPart = ({ part, lastEdit, kind, document, busy }: TurnPartProps) => {
  if (part.type === 'reasoning') {
    return part.text.trim() === '' ? null : (
      <Appear>
        <ThinkingStep text={part.text} live={busy && part.state === 'streaming'} />
      </Appear>
    );
  }
  if (part.type === 'text') {
    return part.text.trim() === '' ? null : (
      <Appear>
        <p className="whitespace-pre-wrap text-foreground text-sm leading-relaxed">
          {part.text.trim()}
        </p>
      </Appear>
    );
  }
  if (isEdit(part)) {
    return isSuperseded(part, lastEdit) ? null : (
      <Appear>
        <EditStep part={part} busy={busy} kind={kind} document={document} />
      </Appear>
    );
  }
  if (part.type === 'tool-renameChat' && part.state === 'output-available') {
    return (
      <Appear>
        <p className="flex items-center gap-1.5 text-muted-foreground text-xs">
          <PenLine className="size-3.5" />
          Named this chat “{part.output.title}”
        </p>
      </Appear>
    );
  }
  return null;
};

interface AgentTurnProps {
  message: MediaAgentMessage;
  kind: MediaKind;
  document: unknown;
  busy: boolean;
}

export const AgentTurn = ({ message, kind, document, busy }: AgentTurnProps) => {
  const lastEdit = message.parts.filter(isEdit).at(-1);
  return (
    <div className="flex w-full flex-col gap-2.5" data-testid="agent-turn">
      {message.parts.map((part, index) => (
        <TurnPart
          key={`${message.id}-${index}`}
          part={part}
          lastEdit={lastEdit}
          kind={kind}
          document={document}
          busy={busy}
        />
      ))}
    </div>
  );
};
