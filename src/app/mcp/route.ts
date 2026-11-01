import { WebStandardStreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js';
import { holdConnection, markConnected } from '@/local/connections';
import { localOrigin, requireLocalSession } from '@/local/security';
import { createMcpServer } from '@/mcp/server';

const handle = async (request: Request): Promise<Response> => {
  const denied = requireLocalSession(request);
  if (denied !== null) {
    return denied;
  }
  const body = (await request
    .clone()
    .json()
    .catch(() => null)) as { params?: { clientInfo?: { name?: string } } } | null;
  await markConnected(
    typeof body?.params?.clientInfo?.name === 'string' ? body.params.clientInfo.name : undefined,
  ).catch(() => undefined);
  const transport = new WebStandardStreamableHTTPServerTransport({ enableJsonResponse: true });
  await createMcpServer(localOrigin(request) ?? new URL(request.url).origin).connect(transport);
  const response = await transport.handleRequest(request);
  if (request.method === 'GET' && response.ok) {
    holdConnection(request.signal);
  }
  return response;
};
export const GET = handle;
export const POST = handle;
export const DELETE = handle;
