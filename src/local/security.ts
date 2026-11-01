import { createHash, createHmac, randomBytes, timingSafeEqual } from 'node:crypto';

export const SESSION_COOKIE = 'cueframe-session';

export const sessionToken = (): string => {
  // biome-ignore lint/style/noProcessEnv: local runtime configuration is isolated from provider credentials
  const { CUEFRAME_SESSION_TOKEN: existing } = process.env;
  if (existing) {
    return existing;
  }
  const token = randomBytes(32).toString('hex');
  // biome-ignore lint/style/noProcessEnv: local runtime configuration is isolated from provider credentials
  Object.assign(process.env, { CUEFRAME_SESSION_TOKEN: token });
  return token;
};

const equalToken = (value: string, token = sessionToken()): boolean => {
  const expected = Buffer.from(token);
  const received = Buffer.from(value);
  return expected.length === received.length && timingSafeEqual(expected, received);
};

const hostedConfig = (): { password: string; origin: string } | null => {
  // biome-ignore lint/style/noProcessEnv: the single owner login is configured by the server operator
  const { CUEFRAME_PASSWORD: password, CUEFRAME_PUBLIC_URL: url } = process.env;
  if (!(url && password)) {
    return null;
  }
  return { password, origin: new URL(url).origin };
};

export const isHosted = (): boolean => hostedConfig() !== null;

export const browserSessionToken = (): string =>
  isHosted()
    ? createHmac('sha256', sessionToken()).update('owner-session-v1').digest('hex')
    : sessionToken();

const MIN_PASSWORD_LENGTH = 12;

export const hostedStartupProblems = (): { errors: string[]; warnings: string[] } => {
  // biome-ignore lint/style/noProcessEnv: hosted access is configured by the server operator
  const { CUEFRAME_PUBLIC_URL: url, CUEFRAME_PERSISTENT_TOKEN: token } = process.env;
  try {
    const hosted = hostedConfig();
    if (hosted === null) {
      return {
        errors: [],
        warnings: url ? ['CUEFRAME_PUBLIC_URL is set without any login, so it is ignored.'] : [],
      };
    }
    return {
      errors: [],
      warnings: [
        ...(hosted.origin.startsWith('https:') ? [] : ['CUEFRAME_PUBLIC_URL is not HTTPS.']),
        ...(token === '1'
          ? []
          : ['CUEFRAME_SESSION_TOKEN is not set, so a restart signs everyone out.']),
        ...(hosted.password.length < MIN_PASSWORD_LENGTH ? ['The owner password is short.'] : []),
      ],
    };
  } catch (error) {
    return {
      errors: [error instanceof Error ? error.message : 'Hosted settings are invalid.'],
      warnings: [],
    };
  }
};

const digest = (value: string): Buffer => createHash('sha256').update(value).digest();

export const authenticate = (password: string): boolean => {
  const hosted = hostedConfig();
  return hosted !== null && timingSafeEqual(digest(password), digest(hosted.password));
};

export const canSeeAgentToken = (request: Request): boolean => {
  const bearer = request.headers.get('authorization');
  return (
    !isHosted() ||
    hasBrowserSession(request) ||
    (bearer?.startsWith('Bearer ') === true && equalToken(bearer.slice(7)))
  );
};

export const localOrigin = (request: Request): string | null => {
  const hosted = hostedConfig();
  if (hosted) {
    const host = request.headers.get('host') ?? new URL(request.url).host;
    return host === new URL(hosted.origin).host ? hosted.origin : null;
  }
  const url = new URL(request.url);
  const host = request.headers.get('host') ?? url.host;
  try {
    const supplied = new URL(`${url.protocol}//${host}`);
    const localHosts = ['127.0.0.1', 'localhost', '[::1]'];
    return localHosts.includes(url.hostname) &&
      localHosts.includes(supplied.hostname) &&
      supplied.host === host &&
      supplied.port === url.port
      ? supplied.origin
      : null;
  } catch {
    return null;
  }
};

export const localRequestProblem = (request: Request): Response | null => {
  const origin = localOrigin(request);
  if (origin === null) {
    return Response.json({ problem: 'cueframe accepts local requests only.' }, { status: 403 });
  }
  const incoming = request.headers.get('origin');
  if (
    (incoming !== null && incoming !== origin) ||
    request.headers.get('sec-fetch-site') === 'cross-site'
  ) {
    return Response.json({ problem: 'This website cannot access cueframe.' }, { status: 403 });
  }
  return null;
};

export const hasBrowserSession = (request: Request): boolean => {
  const cookie = request.headers
    .get('cookie')
    ?.split(';')
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${SESSION_COOKIE}=`))
    ?.slice(SESSION_COOKIE.length + 1);
  return cookie !== undefined && equalToken(cookie, browserSessionToken());
};

export const requireLocalSession = (request: Request): Response | null => {
  const problem = localRequestProblem(request);
  if (problem !== null) {
    return problem;
  }
  const bearer = request.headers.get('authorization');
  const token = bearer?.startsWith('Bearer ') ? bearer.slice(7) : null;
  const cookie = request.headers
    .get('cookie')
    ?.split(';')
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${SESSION_COOKIE}=`))
    ?.slice(SESSION_COOKIE.length + 1);
  const cli = token !== null && equalToken(token);
  const browser = cookie !== undefined && equalToken(cookie, browserSessionToken());
  if (!(cli || browser)) {
    return Response.json({ problem: 'Open cueframe locally to start a session.' }, { status: 401 });
  }
  if (
    !(cli || ['GET', 'HEAD'].includes(request.method)) &&
    request.headers.get('origin') !== localOrigin(request)
  ) {
    return Response.json({ problem: 'A same-origin request is required.' }, { status: 403 });
  }
  return null;
};
