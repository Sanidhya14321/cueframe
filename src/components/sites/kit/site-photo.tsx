import { cn } from '@/lib/utils';

export const SitePhoto = ({
  src,
  alt,
  className,
  emptyClassName,
}: {
  src: string;
  alt: string;
  className?: string;
  emptyClassName?: string;
}) =>
  src === '' ? (
    <div role="img" aria-label={alt} className={cn(className, emptyClassName)} />
  ) : (
    // biome-ignore lint/performance/noImgElement: website photos come from bundled files and any image link
    <img src={src} alt={alt} className={cn('object-cover', className)} />
  );
