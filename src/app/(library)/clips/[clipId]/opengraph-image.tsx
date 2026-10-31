import { notFound } from 'next/navigation';
import { clipImage } from '@/og/clip-card';
import { CLIP_IDS, isClipId } from '@/schemas';

export const alt = 'A neuclip video clip';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export const generateStaticParams = () => CLIP_IDS.map((clipId) => ({ clipId }));

const Image = async ({ params }: { params: Promise<{ clipId: string }> }) => {
  const { clipId } = await params;
  if (!isClipId(clipId)) {
    notFound();
  }
  return clipImage(clipId);
};

export default Image;
