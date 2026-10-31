import { type InferUITools, tool, type UIDataTypes, type UIMessage } from 'ai';
import { z } from 'zod';
import { restoreAssets } from './assets';
import { applyEdits, type EditOperation, editOperationSchema } from './edits';
import type { MediaKind } from './media';

const editOutputSchema = z.discriminatedUnion('ok', [
  z.object({ ok: z.literal(true), operations: z.array(editOperationSchema) }),
  z.object({ ok: z.literal(false), error: z.string() }),
]);

type EditOutput = z.infer<typeof editOutputSchema>;

export const CHAT_TITLE_MAX = 60;

export const createMediaTools = (kind: MediaKind, document: unknown, assets: readonly string[]) => {
  let current = document;
  return {
    renameChat: tool({
      description:
        'Rename the current chat. Use it when the user asks to rename the chat, or to name a chat that has no name yet.',
      inputSchema: z.object({
        title: z.string().min(1).max(CHAT_TITLE_MAX).describe('A short title of two to five words'),
      }),
      outputSchema: z.object({ title: z.string() }),
      execute: ({ title }) => ({ title: title.trim() }),
      toModelOutput: () => ({ type: 'text', value: 'Renamed.' }),
    }),
    editMedia: tool({
      description:
        'Apply RFC 6902 JSON Patch operations to the current media document. The result is validated against the schema; on failure nothing changes and the error is returned.',
      inputSchema: z.object({
        summary: z.string().describe('A short plain-English label for the change'),
        operations: z.array(editOperationSchema).min(1),
      }),
      outputSchema: editOutputSchema,
      execute: ({ operations }): EditOutput => {
        const result = applyEdits(kind, current, operations);
        if (!result.ok) {
          return { ok: false, error: result.error };
        }
        current = result.document;
        return { ok: true, operations: restoreAssets(operations, assets) as EditOperation[] };
      },
      toModelOutput: ({ output }) =>
        output.ok
          ? { type: 'text', value: 'Applied. The editor now shows the change.' }
          : { type: 'error-text', value: output.error },
    }),
  };
};

export const editSucceeded = ({
  steps,
}: {
  steps: ReadonlyArray<{ toolResults: ReadonlyArray<{ output: unknown }> }>;
}): boolean =>
  steps
    .at(-1)
    ?.toolResults.some((result) => editOutputSchema.safeParse(result.output).data?.ok === true) ??
  false;

export type MediaAgentMessage = UIMessage<
  never,
  UIDataTypes,
  InferUITools<ReturnType<typeof createMediaTools>>
>;
