'use client';

import dynamic from 'next/dynamic';
import type { Project } from '@/project';
import { OpenCutEditor } from './opencut-editor';

const ClipTimelineEditor = dynamic(
  () =>
    import('@/components/clip-timeline/clip-timeline-editor').then(
      (module) => module.ClipTimelineEditor,
    ),
  { ssr: false },
);

interface SavedVideoEditorProps {
  id: string;
  title: string;
  project: Project;
  animation?: boolean;
  readOnly?: boolean;
}

export const SavedVideoEditor = ({
  id,
  title,
  project,
  animation,
  readOnly,
}: SavedVideoEditorProps) => {
  if (!animation) {
    return (
      <OpenCutEditor
        key={id}
        id={id}
        title={title}
        initialProject={project}
        readOnly={readOnly ?? false}
      />
    );
  }
  return (
    <ClipTimelineEditor
      title={title}
      storageKey={`neuclip-video:${id}`}
      initialProject={project}
      demoSrc={null}
      projectId={id}
    />
  );
};
