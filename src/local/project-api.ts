import { ZodError } from 'zod';
import { ProjectProblem } from './projects';
import { requireLocalSession } from './security';

const problemResponse = (error: unknown): Response => {
  if (error instanceof ProjectProblem) {
    return Response.json({ problem: error.message }, { status: error.status });
  }
  if (error instanceof ZodError || error instanceof SyntaxError) {
    return Response.json(
      { problem: 'The project request failed. Check the input.' },
      { status: 400 },
    );
  }
  if (error instanceof Error && 'code' in error && error.code === 'ENOENT') {
    return Response.json({ problem: 'That file does not exist.' }, { status: 404 });
  }
  console.error('[cueframe api]', error instanceof Error ? error.name : 'Unknown error');
  return Response.json(
    { problem: 'The project request failed. Try again in a moment.' },
    { status: 500 },
  );
};

export const projectApi = async (
  request: Request,
  run: () => Promise<Response>,
): Promise<Response> => {
  const denied = requireLocalSession(request);
  if (denied !== null) {
    return denied;
  }
  try {
    return await run();
  } catch (error) {
    return problemResponse(error);
  }
};
export const requestActor = (request: Request, value: string): string =>
  request.headers.get('authorization')?.startsWith('Bearer ')
    ? 'agent:api'
    : `browser:${value.replace(/[^a-zA-Z0-9-]/g, '').slice(0, 80)}`;
