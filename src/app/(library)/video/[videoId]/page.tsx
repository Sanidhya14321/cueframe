import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { cache } from 'react';
import { SavedVideoEditor } from '@/components/video/saved-video-editor';
import { findVideo } from '@/local/videos';

export const dynamic = 'force-dynamic';

type Props = {
  params: Promise<{ videoId: string }>;
  searchParams: Promise<{ workspace?: string }>;
};

const openVideo = cache(findVideo);

export const generateMetadata = async ({ params }: Props): Promise<Metadata> => {
  const video = await openVideo((await params).videoId);
  return { title: `${video?.title ?? 'Video'} · Neuclip` };
};

const VideoPage = async ({ params, searchParams }: Props) => {
  const video = await openVideo((await params).videoId);
  if (video === null) {
    notFound();
  }
  return (
    <SavedVideoEditor
      id={video.id}
      title={video.title}
      project={video.project}
      animation={(await searchParams).workspace === 'animation'}
      readOnly={(await searchParams).workspace === 'render'}
    />
  );
};

export default VideoPage;
