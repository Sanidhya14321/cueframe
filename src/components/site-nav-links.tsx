'use client';

import { Check, Menu } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { STUDIO_PAGES } from '@/components/studio-actions';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

export const SiteNavLinks = () => {
  const pathname = usePathname();
  return (
    <>
      <div className="hidden items-center gap-1 md:flex">
        {STUDIO_PAGES.filter((page) => ['/projects', '/library'].includes(page.href)).map(
          (page) => (
            <Link
              key={page.href}
              href={page.href}
              aria-current={pathname === page.href ? 'page' : undefined}
              className={cn(
                'flex min-h-11 items-center gap-2 rounded-md px-3 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground',
                pathname === page.href && 'bg-accent text-foreground',
              )}
            >
              <page.icon className="size-4" />
              {page.label}
            </Link>
          ),
        )}
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="size-11" aria-label="Open navigation menu">
            <Menu />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          {STUDIO_PAGES.map((page) => (
            <DropdownMenuItem key={page.href} asChild className="min-h-11">
              <Link
                href={page.href}
                aria-current={pathname === page.href ? 'page' : undefined}
                className={cn(pathname === page.href && 'bg-accent text-accent-foreground')}
              >
                <page.icon />
                {page.label}
                {pathname === page.href ? <Check className="ml-auto size-4" aria-hidden /> : null}
              </Link>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
