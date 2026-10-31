'use client';

import { Button } from '@/components/ui/button';
import { useCreateProject } from '@/lib/use-create-project';

export const NewProject = () => {
  const { create, busy, problem } = useCreateProject();
  return (
    <div>
      <Button type="button" disabled={busy} onClick={create}>
        {busy ? 'Opening…' : 'New blank project'}
      </Button>
      {problem ? (
        <p role="alert" className="mt-2 text-sm text-destructive">
          {problem}
        </p>
      ) : null}
    </div>
  );
};
