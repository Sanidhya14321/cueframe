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

const equalToken = (value: string): boolean => {
  const expected = Buffer.from(sessionToken());
  const received = Buffer.from(value);
  return expected.length === received.length && timingSafeEqual(expected, received);
};

const ROLES = ['admin', 'creator', 'viewer'] as const;
export type Role = (typeof ROLES)[number];
export const ROLE_COOKIE = 'cueframe-role';

interface Account {
  email: string;
  password: string;
  role: Role;
}

const hostedConfig = (): { accounts: Account[]; origin: string } | null => {
  // biome-ignore lint/style/noProcessEnv: hosted access is configured by the server operator
  const env = process.env;
  const { CUEFRAME_PASSWORD: password, CUEFRAME_USERS: users, CUEFRAME_PUBLIC_URL: url } = env;
  if (!(url && (password || users))) {
    return null;
  }
  const accounts: Account[] = users
    ? (JSON.parse(users) as Account[])
    : [{ email: 'admin', password: password ?? '', role: 'admin' }];
  return { accounts, origin: new URL(url).origin };
};

export const isHosted = (): boolean => hostedConfig() !== null;

const digest = (value: string): Buffer => createHash('sha256').update(value).digest();

export const authenticate = (email: string, password: string): Role | null => {
  const account = hostedConfig()?.accounts.find((entry) => entry.email === email.trim());
  return account && timingSafeEqual(digest(password), digest(account.password))
    ? account.role
    : null;
};

export const roleCookie = (role: Role): string =>
  `${role}.${createHmac('sha256', sessionToken()).update(role).digest('hex')}`;

const cookieValue = (request: Request, name: string): string | undefined =>
  request.headers
    .get('cookie')
    ?.split(';')
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${name}=`))
    ?.slice(name.length + 1);

export const requestRole = (request: Request): Role | null => {
  const value = cookieValue(request, ROLE_COOKIE) ?? '';
  return ROLES.find((role) => roleCookie(role) === value) ?? null;
};

export const roleProblem = (request: Request): Response | null => {
  if (!isHosted() || ['GET', 'HEAD'].includes(request.method)) {
    return null;
  }
  const role = requestRole(request);
  const adminOnly = new URL(request.url).pathname.startsWith('/api/settings');
  return role === 'viewer' || (adminOnly && role !== 'admin')
    ? Response.json({ problem: 'Your role cannot make this change.' }, { status: 403 })
    : null;
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
    return Response.json({ problem: 'Open cueframe locally to start a session.' }, { status: 401 });
  }
  const denied = cli ? null : roleProblem(request);
  if (denied !== null) {
    return denied;
  }
  if (
    !(cli || ['GET', 'HEAD'].includes(request.method)) &&
    request.headers.get('origin') !== localOrigin(request)
  ) {
    return Response.json({ problem: 'A same-origin request is required.' }, { status: 403 });
  }
  return null;
};
