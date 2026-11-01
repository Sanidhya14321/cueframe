'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

type Props = { error: Error & { digest?: string }; reset: () => void };

const ErrorPage = ({ error, reset }: Props) => {
  useEffect(() => {
    console.error('[cueframe] page failed', error.digest ?? error.name);
  }, [error]);
  return (
    <main className="mx-auto flex min-h-[60vh] w-full max-w-md flex-col justify-center gap-3 px-4">
      <h1 className="font-display text-3xl">This page could not load</h1>
      <p className="text-muted-foreground text-sm">
        Your saved work is safe. Try again, or go back to the library.
      </p>
      <div className="flex gap-2">
        <Button onClick={reset}>Try again</Button>
        <Button variant="outline" asChild={true}>
          <a href="/">Back to library</a>
        </Button>
      </div>
    </main>
  );
};

export default ErrorPage;
