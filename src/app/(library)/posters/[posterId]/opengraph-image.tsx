import { notFound } from 'next/navigation';
import { posterImage } from '@/og/poster-card';
import { findPoster, POSTER_META } from '@/posters';

export const alt = 'A neuclip poster pack';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export const generateStaticParams = () => POSTER_META.map((meta) => ({ posterId: meta.id }));

const Image = async ({ params }: { params: Promise<{ posterId: string }> }) => {
  const poster = findPoster((await params).posterId);
  if (poster === undefined) {
    notFound();
  }
  return posterImage(poster);
};

export default Image;
