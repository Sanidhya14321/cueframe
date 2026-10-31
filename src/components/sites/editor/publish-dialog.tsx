'use client';

import { Globe, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { slugify, slugProblem } from '@/sites/slug';

interface PublishDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  suggestion: string;
  onPublish: (slug: string) => Promise<string | null>;
}

export const PublishDialog = ({
  open,
  onOpenChange,
  suggestion,
  onPublish,
}: PublishDialogProps) => {
  const [slug, setSlug] = useState(() => slugify(suggestion));
  const [touched, setTouched] = useState(false);
  const [host, setHost] = useState('');
  const [busy, setBusy] = useState(false);
  const [failure, setFailure] = useState<string | null>(null);
  const problem = slugProblem(slug);

  useEffect(() => {
    setHost(window.location.host);
  }, []);

  useEffect(() => {
    if (open && !touched) {
      setSlug(slugify(suggestion));
    }
  }, [open, suggestion, touched]);

  const publish = async () => {
    setBusy(true);
    setFailure(await onPublish(slug));
    setBusy(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Save website locally</DialogTitle>
          <DialogDescription>
            Choose a local address. This website stays on this computer and is available only while
            ClipKit is running.
          </DialogDescription>
        </DialogHeader>
        <form
          className="flex flex-col gap-2"
          onSubmit={(event) => {
            event.preventDefault();
            if (problem === null && !busy) {
              publish().catch(() => setBusy(false));
            }
          }}
        >
          <Label htmlFor="site-slug">Website address</Label>
          <div className="flex items-center overflow-hidden rounded-md bg-muted text-sm">
            <span className="shrink-0 pl-3 text-muted-foreground">{host}/s/</span>
            <Input
              id="site-slug"
              value={slug}
              autoFocus
              spellCheck={false}
              onChange={(event) => {
                setTouched(true);
                setSlug(event.target.value.toLowerCase().replace(/\s+/g, '-'));
              }}
              className="rounded-none bg-transparent pl-0.5 shadow-none focus-visible:ring-0"
            />
          </div>
          <p className="min-h-5 text-destructive text-xs" aria-live="polite">
            {slug === '' ? null : problem}
          </p>
          {failure === null ? null : <p className="text-destructive text-sm">{failure}</p>}
          <DialogFooter className="mt-2">
            <Button type="submit" disabled={problem !== null || busy}>
              {busy ? <Loader2 className="animate-spin" /> : <Globe />}
              Save locally
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
