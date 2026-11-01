import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { projectTools } from '@/agent/project-tools';
import { logToolCall, markListening } from '@/local/agent-log';
import { allowToolCall } from './rate-limit';
import { failure, json } from './results';

const WAITING_TOOLS = new Set(['wait_for_comments', 'wait_for_events']);
const record = (work: Promise<unknown>) => work.catch(() => undefined);
export const registerProjectTools = (server: McpServer, origin: string) => {
  for (const [name, definition] of Object.entries(projectTools)) {
    server.registerTool(
      name,
      { description: definition.description, inputSchema: definition.input },
      async (input: unknown) => {
        if (!allowToolCall()) {
          return failure('Please wait a minute before making more tool calls.');
        }
        console.info(`[cueframe tool] ${name} ${new Date().toISOString()}`);
        const projectId = (input as { projectId?: unknown }).projectId;
        if (WAITING_TOOLS.has(name) && typeof projectId === 'string') {
          await record(markListening(projectId));
        }
        try {
          const result = await definition.invoke(input, { origin, actor: 'agent:mcp' });
          await record(logToolCall(name, input));
          return json(result);
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Project tool failed.';
          await record(logToolCall(name, input, message));
          return failure(message);
        }
      },
    );
  }
};
