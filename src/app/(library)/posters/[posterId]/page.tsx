import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PosterEditor } from '@/components/design-editor/poster-editor';
import { shareMetadata } from '@/lib/share-metadata';
import { findPoster, POSTER_META } from '@/posters';

export const generateStaticParams = () => POSTER_META.map((meta) => ({ posterId: meta.id }));

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ posterId: string }>;
}): Promise<Metadata> => {
  const { posterId } = await params;
  const poster = findPoster(posterId);
  return poster === undefined
    ? { title: 'Poster' }
    : shareMetadata(`${poster.meta.title} · Neuclip`, poster.meta.description);
};

const PosterEditorPage = async ({ params }: { params: Promise<{ posterId: string }> }) => {
  const { posterId } = await params;
  const poster = findPoster(posterId);
  if (poster === undefined) {
    notFound();
  }
  return <PosterEditor posterId={posterId} design={poster.build()} />;
};

export default PosterEditorPage;
