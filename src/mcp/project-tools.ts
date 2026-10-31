import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { projectTools } from '@/agent/project-tools';
import { allowToolCall } from './rate-limit';
import { failure, json } from './results';
export const registerProjectTools = (server: McpServer, origin: string) => {
  for (const [name, definition] of Object.entries(projectTools)) {
    server.registerTool(
      name,
      { description: definition.description, inputSchema: definition.input },
      async (input: unknown) => {
        if (!allowToolCall()) {
          return failure('Please wait a minute before making more tool calls.');
        }
        console.info(`[ClipKit tool] ${name} ${new Date().toISOString()}`);
        try {
          return json(await definition.invoke(input, { origin, actor: 'agent:mcp' }));
        } catch (error) {
          return failure(error instanceof Error ? error.message : 'Project tool failed.');
        }
      },
    );
  }
};
