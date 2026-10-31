'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { createTrack } from '@/project';
import { prepareEditorNavigation } from './editor-navigation';

export const useCreateProject = () => {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [problem, setProblem] = useState('');
  const create = async () => {
    if (busy) {
      return;
    }
    setBusy(true);
    setProblem('');
    try {
      await prepareEditorNavigation();
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          title: 'Untitled video',
          project: {
            width: 1920,
            height: 1080,
            fps: 30,
            durationInFrames: 1,
            background: '#0b0d17',
            tracks: [createTrack('Clips')],
          },
        }),
      });
      if (!response.ok) {
        throw new Error('Could not create a local project. Try again.');
      }
      const state = (await response.json()) as { id: string };
      router.push(`/video/${state.id}`);
      setBusy(false);
      return true;
    } catch (error) {
      setProblem(
        error instanceof Error && error.message.startsWith('OpenCut')
          ? error.message
          : 'Could not create a local project. Try again.',
      );
      setBusy(false);
      return false;
    }
  };
  return { create, busy, problem };
};
