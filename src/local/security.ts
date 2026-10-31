import { createHash, randomBytes, timingSafeEqual } from 'node:crypto';

export const SESSION_COOKIE = 'clipkit-session';

export const sessionToken = (): string => {
  // biome-ignore lint/style/noProcessEnv: local runtime configuration is isolated from provider credentials
  const { CLIPKIT_SESSION_TOKEN: existing } = process.env;
  if (existing) {
    return existing;
  }
  const token = randomBytes(32).toString('hex');
  // biome-ignore lint/style/noProcessEnv: local runtime configuration is isolated from provider credentials
  Object.assign(process.env, { CLIPKIT_SESSION_TOKEN: token });
  return token;
};

const equalToken = (value: string): boolean => {
  const expected = Buffer.from(sessionToken());
  const received = Buffer.from(value);
  return expected.length === received.length && timingSafeEqual(expected, received);
};

const hostedConfig = (): { password: string; origin: string } | null => {
  // biome-ignore lint/style/noProcessEnv: hosted access is configured by the server operator
  const { CLIPKIT_PASSWORD: password, CLIPKIT_PUBLIC_URL: url } = process.env;
  return password && url ? { password, origin: new URL(url).origin } : null;
};

export const isHosted = (): boolean => hostedConfig() !== null;

const digest = (value: string): Buffer => createHash('sha256').update(value).digest();

export const passwordMatches = (value: string): boolean => {
  const config = hostedConfig();
  return config !== null && timingSafeEqual(digest(value), digest(config.password));
};

export const localOrigin = (request: Request): string | null => {
  const hosted = hostedConfig();
  if (hosted) {
    return request.headers.get('host') === new URL(hosted.origin).host ? hosted.origin : null;
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
    return Response.json({ problem: 'ClipKit accepts local requests only.' }, { status: 403 });
  }
  const incoming = request.headers.get('origin');
  if (
    (incoming !== null && incoming !== origin) ||
    request.headers.get('sec-fetch-site') === 'cross-site'
  ) {
    return Response.json({ problem: 'This website cannot access ClipKit.' }, { status: 403 });
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
  return cookie !== undefined && equalToken(cookie);
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
  const browser = cookie !== undefined && equalToken(cookie);
  if (!(cli || browser)) {
    return Response.json({ problem: 'Open ClipKit locally to start a session.' }, { status: 401 });
  }
  if (
    !(cli || ['GET', 'HEAD'].includes(request.method)) &&
    request.headers.get('origin') !== localOrigin(request)
  ) {
    return Response.json({ problem: 'A same-origin request is required.' }, { status: 403 });
  }
  return null;
};
