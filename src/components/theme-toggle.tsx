'use client';

import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from './theme-provider';

export const ThemeToggle = () => {
  const { resolved, toggle } = useTheme();
  const isDark = resolved === 'dark';
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className="size-11"
      onClick={toggle}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
    </Button>
  );
};
