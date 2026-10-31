import { cn } from '@/lib/utils';
import { DISPLAY, HAND } from './fonts';
import { SnowflakeMark } from './ornaments';

export const SectionTitle = ({
  kicker,
  title,
  className,
}: {
  kicker: string;
  title: string;
  className?: string;
}) => (
  <div className={cn('flex flex-col items-center text-center', className)}>
    <span className={cn(HAND, 'flex items-center gap-2 text-(--sd-accent) text-2xl')}>
      <SnowflakeMark className="size-4" />
      {kicker}
      <SnowflakeMark className="size-4" />
    </span>
    <h2
      className={cn(
        DISPLAY,
        'mt-1 font-semibold text-(--sd-primary) text-4xl leading-tight @md:text-5xl',
      )}
    >
      {title}
    </h2>
  </div>
);
