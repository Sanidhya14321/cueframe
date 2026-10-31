'use client';

import { Loader2, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { deleteSite } from '@/lib/site-api';

export const DeleteSiteButton = ({ id, address }: { id: string; address: string }) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [problem, setProblem] = useState<string | null>(null);

  const remove = async () => {
    setBusy(true);
    const result = await deleteSite(id);
    setBusy(false);
    if (result.ok) {
      setOpen(false);
      router.refresh();
    } else {
      setProblem(result.problem);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button" size="icon-sm" variant="ghost" aria-label={`Delete ${address}`}>
          <Trash2 />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete this website?</DialogTitle>
          <DialogDescription>
            {address} stops working for everyone and the address becomes free again. This cannot be
            undone.
          </DialogDescription>
        </DialogHeader>
        {problem === null ? null : <p className="text-destructive text-sm">{problem}</p>}
        <DialogFooter>
          <Button
            type="button"
            variant="destructive"
            disabled={busy}
            onClick={() => {
              remove().catch(() => setBusy(false));
            }}
          >
            {busy ? <Loader2 className="animate-spin" /> : <Trash2 />}
            Delete website
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
