import { Gift } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { PumpkinPatchContent } from '@/sites/templates/baby-showers/pumpkin-patch';
import { Reveal } from '../../kit/reveal';
import { SitePhoto } from '../../kit/site-photo';
import { BODY, DISPLAY, HAND } from './fonts';
import { Vine } from './ornaments';
import { PillLink } from './pill';

export const Registry = ({ content }: { content: PumpkinPatchContent }) => {
  const { registry, photos } = content;
  const links = registry.links.filter((entry) => entry.link !== '' && entry.label !== '');
  return (
    <section
      id="pp-registry"
      className="relative scroll-mt-16 overflow-hidden bg-(--pp-secondary) px-5 py-20 text-(--pp-card)"
    >
      <Vine className="absolute -right-10 bottom-4 w-80 rotate-170 opacity-40 [--pp-secondary:var(--pp-card)] [--pp-stem:var(--pp-card)]" />
      <div className="relative mx-auto grid max-w-5xl items-center gap-14 @3xl:grid-cols-2">
        <Reveal className="relative mx-auto w-full max-w-sm">
          <div className="-rotate-3 bg-(--pp-card) p-3 pb-12 shadow-[0_26px_50px_-28px_rgba(0,0,0,0.6)]">
            <SitePhoto
              src={photos.registry}
              alt="Registry"
              className="aspect-square w-full"
              emptyClassName="bg-(--pp-oat)"
            />
            <span
              className={cn(
                HAND,
                'absolute bottom-3 left-0 w-full text-center font-bold text-(--pp-text) text-2xl',
              )}
            >
              little wishes
            </span>
          </div>
          <span className="absolute -top-3 left-6 h-7 w-24 -rotate-12 bg-(--pp-accent)/70" />
          <span className="absolute -top-2 right-6 h-7 w-24 rotate-12 bg-(--pp-primary)/60" />
        </Reveal>
        <Reveal
          delay={150}
          className="flex flex-col items-center text-center @3xl:items-start @3xl:text-left"
        >
          <span className={cn(HAND, 'text-3xl text-(--pp-card)/85')}>for the little one</span>
          <h2 className={cn(DISPLAY, 'text-5xl leading-tight')}>Baby registry</h2>
          <p className={cn(BODY, 'mt-5 max-w-md whitespace-pre-line text-lg leading-relaxed')}>
            {registry.text}
          </p>
          {links.length === 0 ? null : (
            <div className="mt-8 flex flex-wrap justify-center gap-3 @3xl:justify-start">
              {links.map((entry, index) => (
                <PillLink
                  key={index}
                  href={entry.link}
                  className="bg-(--pp-card) text-(--pp-sage-deep) shadow-[0_6px_0_-2px_var(--pp-sage-deep)]"
                >
                  <Gift className="size-4" />
                  {entry.label}
                </PillLink>
              ))}
            </div>
          )}
        </Reveal>
      </div>
    </section>
  );
};
