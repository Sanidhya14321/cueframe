'use client';

import { ExternalLink } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { SavedSite } from '@/lib/site-api';
import { publicSitePath, siteEditorPath } from '@/sites/published-site';
import { CopyField } from './copy-field';

export const ShareDialog = ({
  open,
  onOpenChange,
  site,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  site: SavedSite;
}) => {
  const [origin, setOrigin] = useState('');
  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Your local website is ready</DialogTitle>
          <DialogDescription>
            Open this preview on this computer while ClipKit is running. Saved websites are listed
            under Websites.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-5">
          <CopyField
            id="share-public"
            label="Website link"
            value={`${origin}${publicSitePath(site.slug)}`}
            hint="Local preview on this computer only."
          />
          <CopyField
            id="share-edit"
            label="Edit link"
            value={`${origin}${siteEditorPath(site.id)}`}
            hint="Opens this local website in the editor."
          />
          <Button asChild variant="outline" className="self-start">
            <a href={publicSitePath(site.slug)} target="_blank" rel="noreferrer">
              <ExternalLink />
              Open website
            </a>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
