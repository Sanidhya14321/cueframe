// biome-ignore lint/style/noProcessEnv: the public address is read once at build time for share links
const { CUEFRAME_PUBLIC_URL: publicUrl } = process.env;

export const SITE_URL = new URL(publicUrl || 'http://127.0.0.1:3000');
