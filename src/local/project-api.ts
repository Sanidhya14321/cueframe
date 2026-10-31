import { ProjectProblem } from './projects';
import { requireLocalSession } from './security';

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
    return Response.json(
      {
        problem:
          error instanceof ProjectProblem
            ? error.message
            : 'The project request failed. Check the input and local files.',
      },
      { status: error instanceof ProjectProblem ? error.status : 400 },
    );
  }
};
export const requestActor = (request: Request, value: string): string =>
  request.headers.get('authorization')?.startsWith('Bearer ')
    ? 'agent:api'
    : `browser:${value.replace(/[^a-zA-Z0-9-]/g, '').slice(0, 80)}`;
