import type { ImgHTMLAttributes } from 'react';
export default function Image(
  props: ImgHTMLAttributes<HTMLImageElement> & {
    fill?: boolean;
    unoptimized?: boolean;
    priority?: boolean;
  },
) {
  const { fill, unoptimized, priority, ...image } = props;
  // biome-ignore lint/performance/noImgElement: the isolated static runtime does not use the Next image server
  return <img {...image} alt={image.alt ?? ''} />;
}
