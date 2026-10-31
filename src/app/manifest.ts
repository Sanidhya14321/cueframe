import type { MetadataRoute } from 'next';

const manifest = (): MetadataRoute.Manifest => ({
  name: 'Neuclip',
  short_name: 'Neuclip',
  description: 'A library of Remotion animation clips with a deep, schema-driven editor.',
  start_url: '/',
  display: 'standalone',
  background_color: '#0a0a0a',
  theme_color: '#8b5cf6',
  icons: [
    { src: '/icon.svg', sizes: 'any', type: 'image/svg+xml' },
    { src: '/apple-icon', sizes: '180x180', type: 'image/png' },
  ],
});

export default manifest;
