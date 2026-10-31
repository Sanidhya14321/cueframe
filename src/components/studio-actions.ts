import {
  Clapperboard,
  FolderOpen,
  Globe,
  Home,
  Library,
  Plug,
  Settings,
  SunMoon,
} from 'lucide-react';

export const STUDIO_PAGES = [
  { href: '/', label: 'Home', description: 'Return to the studio', icon: Home },
  { href: '/projects', label: 'Projects', description: 'Resume a local video', icon: FolderOpen },
  {
    href: '/library',
    label: 'Library',
    description: 'Browse clips, posters and websites',
    icon: Library,
  },
  {
    href: '/connect',
    label: 'Connect an agent',
    description: 'Set up your coding agent',
    icon: Plug,
  },
  {
    href: '/settings',
    label: 'Settings',
    description: 'Providers, keys and local data',
    icon: Settings,
  },
  { href: '/websites', label: 'Websites', description: 'Open saved local websites', icon: Globe },
] as const;

export const STUDIO_COMMANDS = [
  {
    id: 'new',
    label: 'New video',
    description: 'Create a blank, editable timeline',
    icon: Clapperboard,
    href: null,
  },
  ...STUDIO_PAGES.map((page) => ({ ...page, id: page.href })),
  {
    id: 'theme',
    label: 'Switch appearance',
    description: 'Toggle light and dark mode',
    icon: SunMoon,
    href: null,
  },
];
