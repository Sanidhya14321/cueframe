'use client';

import dynamic from 'next/dynamic';
import { DesignEditorSkeleton } from '@/components/skeletons';
import type { Design } from '@/design';

interface PosterEditorProps {
  posterId: string;
  design: Design;
}

export const PosterEditor = dynamic(
  () =>
    import('./design-editor').then(({ DesignEditor }) => {
      const PosterDesignEditor = ({ posterId, design }: PosterEditorProps) => (
        <DesignEditor
          initialDesign={design}
          storageKey={`neuclip-poster:${posterId}`}
          backHref="/?type=poster"
          initialPanel="theme"
        />
      );
      return PosterDesignEditor;
    }),
  { ssr: false, loading: () => <DesignEditorSkeleton /> },
);
