import { connectionState } from '@/local/connections';
import { localOrigin, requireLocalSession, sessionToken } from '@/local/security';
export const GET = async (request: Request) => {
  const denied = requireLocalSession(request);
  if (denied) {
    return denied;
  }
  const origin = localOrigin(request);
  const state = await connectionState();
  return Response.json(
    {
      ...state,
      command: `claude mcp add --transport http cueframe ${origin}/mcp --header "Authorization: Bearer ${sessionToken()}"`,
    },
    { headers: { 'cache-control': 'no-store' } },
  );
};
