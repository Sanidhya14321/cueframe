import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ClipTimelineEditor } from '@/components/clip-timeline/clip-timeline-editor';
import { seedProjectForClip } from '@/core';
import { clipPreviewVideo } from '@/lib/clips';
import { shareMetadata } from '@/lib/share-metadata';
import { CLIP_IDS, getClipMeta, isClipId } from '@/schemas';

export const dynamicParams = false;

export const generateStaticParams = () => CLIP_IDS.map((clipId) => ({ clipId }));

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ clipId: string }>;
}): Promise<Metadata> => {
  const { clipId } = await params;
  if (!isClipId(clipId)) {
    return { title: 'Clip' };
  }
  const meta = getClipMeta(clipId);
  return shareMetadata(`${meta.title} · Neuclip`, meta.description);
};

const ClipEditorPage = async ({ params }: { params: Promise<{ clipId: string }> }) => {
  const { clipId } = await params;
  if (!isClipId(clipId)) {
    notFound();
  }

  return (
    <ClipTimelineEditor
      title={getClipMeta(clipId).title}
      storageKey={`neuclip-clip:${clipId}`}
      initialProject={seedProjectForClip(clipId)}
      demoSrc={clipPreviewVideo(clipId)}
    />
  );
};

export default ClipEditorPage;
