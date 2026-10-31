import { cn } from '@/lib/utils';
import { SitePhoto } from '../../kit/site-photo';

export const Photo = ({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) => (
  <SitePhoto
    src={src}
    alt={alt}
    className={cn('[filter:var(--il-photo-filter)]', className)}
    emptyClassName="bg-(--il-rule)"
  />
);
