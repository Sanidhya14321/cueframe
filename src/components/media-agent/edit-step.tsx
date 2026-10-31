'use client';

import { CircleAlert, CircleCheck, CircleStop, LoaderCircle } from 'lucide-react';
import { describePath } from '@/agent/describe-path';
import type { MediaKind } from '@/agent/media';
import type { MediaAgentMessage } from '@/agent/tools';
import { cn } from '@/lib/utils';
import { AgentValue } from './agent-value';
import { Collapse } from './collapse';

export type EditPart = Extract<MediaAgentMessage['parts'][number], { type: 'tool-editMedia' }>;

type DraftOperation = NonNullable<
  NonNullable<NonNullable<EditPart['input']>['operations']>[number]
>;

type Phase = 'working' | 'applied' | 'rejected' | 'failed' | 'stopped';

const phaseOf = (part: EditPart, busy: boolean): Phase => {
  if (part.state === 'output-available') {
    if (part.output.ok) {
      return 'applied';
    }
    return busy ? 'working' : 'rejected';
  }
  if (part.state === 'output-error') {
    return 'failed';
  }
  return busy ? 'working' : 'stopped';
};

const workingLabel = (part: EditPart): string => {
  if (part.state === 'output-available') {
    return 'Fixing the edit';
  }
  return part.state === 'input-streaming' ? 'Preparing the edit' : 'Applying the edit';
};

const PHASE_ICONS = {
  working: LoaderCircle,
  applied: CircleCheck,
  rejected: CircleAlert,
  failed: CircleAlert,
  stopped: CircleStop,
} as const;

const PHASE_TONES: Record<Phase, string> = {
  working: 'animate-spin text-violet-500',
  applied: 'text-emerald-600 dark:text-emerald-400',
  rejected: 'text-amber-600 dark:text-amber-400',
  failed: 'text-destructive',
  stopped: 'text-muted-foreground',
};

interface Change {
  key: string;
  field: string;
  where: string;
  operation: DraftOperation;
  count: number;
}

const changesOf = (
  operations: readonly DraftOperation[],
  kind: MediaKind,
  document: unknown,
): Change[] => {
  const changes = new Map<string, Change>();
  for (const operation of operations) {
    const target = describePath(kind, document, operation.path ?? '');
    const where = [target.scope, target.section].filter((part) => part !== null).join(' › ');
    const key = JSON.stringify([operation.op, target.field, operation.value]);
    const change = changes.get(key);
    if (change === undefined) {
      changes.set(key, { key, field: target.field, where, operation, count: 1 });
    } else {
      change.count += 1;
    }
  }
  return [...changes.values()];
};

const ChangeValue = ({ operation }: { operation: DraftOperation }) => {
  if (operation.op === 'remove') {
    return <span className="text-destructive">Removed</span>;
  }
  if (operation.op === 'move' || operation.op === 'copy') {
    return (
      <span className="text-muted-foreground">{operation.op === 'move' ? 'Moved' : 'Copied'}</span>
    );
  }
  return <AgentValue value={operation.value} />;
};

const ChangeRow = ({ change }: { change: Change }) => (
  <li
    className="fade-in-0 flex animate-in items-baseline gap-2 duration-300 motion-reduce:animate-none"
    data-testid="agent-operation"
    title={change.where}
  >
    <span className="shrink-0 text-muted-foreground">
      {change.field}
      {change.count > 1 ? ` ×${change.count}` : ''}
    </span>
    <span className="ml-auto min-w-0 truncate text-right text-foreground">
      <ChangeValue operation={change.operation} />
    </span>
  </li>
);

const titleOf = (part: EditPart, phase: Phase, count: number): string => {
  if (phase === 'working') {
    return workingLabel(part);
  }
  if (phase === 'rejected') {
    return "Couldn't apply this edit";
  }
  if (phase === 'failed') {
    return 'The edit failed';
  }
  if (phase === 'stopped') {
    return 'Stopped';
  }
  return part.input?.summary ?? `Changed ${count} setting${count === 1 ? '' : 's'}`;
};

const problemOf = (part: EditPart, phase: Phase): string | null => {
  if (phase === 'rejected' && part.state === 'output-available' && !part.output.ok) {
    return part.output.error;
  }
  if (phase === 'failed' && part.state === 'output-error') {
    return part.errorText;
  }
  return null;
};

interface EditStepProps {
  part: EditPart;
  busy: boolean;
  kind: MediaKind;
  document: unknown;
}

export const EditStep = ({ part, busy, kind, document }: EditStepProps) => {
  const phase = phaseOf(part, busy);
  const operations = (part.input?.operations ?? []).flatMap((operation) =>
    operation === undefined || operation.path === undefined ? [] : [operation],
  );
  const changes = changesOf(operations, kind, document);
  const Icon = PHASE_ICONS[phase];
  const title = titleOf(part, phase, changes.length);
  const problem = problemOf(part, phase);
  return (
    <div
      className="rounded-xl border bg-muted/30 px-3 py-2.5 text-xs"
      data-testid="agent-edit"
      data-state={phase}
    >
      <div className="flex items-center gap-2">
        <span key={phase} className="zoom-in-50 fade-in-0 flex shrink-0 animate-in duration-200">
          <Icon className={cn('size-4', PHASE_TONES[phase])} />
        </span>
        <span key={title} className="fade-in-0 min-w-0 flex-1 animate-in truncate duration-200">
          <span
            className={cn('font-medium', phase === 'working' ? 'text-shimmer' : 'text-foreground')}
          >
            {title}
          </span>
        </span>
      </div>
      <Collapse open={changes.length > 0 && phase !== 'rejected'}>
        <ul className="mt-2 space-y-1 border-t pt-2">
          {changes.map((change) => (
            <ChangeRow key={change.key} change={change} />
          ))}
        </ul>
      </Collapse>
      {problem === null ? null : (
        <p className="mt-1.5 line-clamp-3 text-muted-foreground">{problem}</p>
      )}
    </div>
  );
};
