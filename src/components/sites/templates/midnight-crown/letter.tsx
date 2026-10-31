import { cn } from '@/lib/utils';
import type { MidnightCrownContent } from '@/sites/templates/quinceaneras/midnight-crown';
import { Reveal } from '../../kit/reveal';
import { BODY, DECO, DISPLAY } from './fonts';
import { ArchPhoto } from './hero';
import { DecoCorners, SectionTitle, Sparkle } from './ornaments';

export const Letter = ({ content }: { content: MidnightCrownContent }) => {
  const { letter, photos, celebrant } = content;
  return (
    <section id="mc-letter" className="scroll-mt-14 px-5 py-20">
      <div className="mx-auto grid max-w-5xl items-center gap-12 @3xl:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
        <Reveal className="mx-auto w-full max-w-[16rem] @3xl:max-w-xs">
          <ArchPhoto
            src={photos.portrait}
            alt={`${celebrant.firstName} ${celebrant.lastName}`}
            className="aspect-[3/4] w-full border-(--mc-blush)/70"
          />
        </Reveal>
        <Reveal delay={150} className="flex flex-col items-center gap-8">
          <SectionTitle kicker="Una carta" title="A letter from me" />
          <div className="relative w-full bg-(--mc-surface)/50 px-6 py-9 @md:px-10">
            <DecoCorners />
            <p
              className={cn(
                BODY,
                'whitespace-pre-line text-center text-(--mc-text)/90 text-xl leading-relaxed',
              )}
            >
              {letter.text}
            </p>
            <span
              className={cn(DISPLAY, 'mt-6 block text-center text-(--mc-blush) text-2xl italic')}
            >
              {letter.signature}
            </span>
          </div>
        </Reveal>
      </div>
    </section>
  );
};

export const Family = ({ content }: { content: MidnightCrownContent }) => {
  const { parents, padrinos } = content;
  if (parents.length === 0 && padrinos.length === 0) {
    return null;
  }
  return (
    <section
      id="mc-family"
      className="scroll-mt-14 border-(--mc-gold)/25 border-y bg-(--mc-surface-deep) px-5 py-20"
    >
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-14">
        {parents.length === 0 ? null : (
          <Reveal className="flex flex-col items-center gap-5 text-center">
            <SectionTitle kicker="Con la bendición de" title="Her parents" />
            <ul className="flex flex-col items-center gap-2 @3xl:flex-row @3xl:gap-6">
              {parents.map((parent, index) => (
                <li key={index} className="flex items-center gap-6">
                  {index === 0 ? null : (
                    <Sparkle className="hidden size-3 text-(--mc-gold) @3xl:block" />
                  )}
                  <span className={cn(DISPLAY, 'text-(--mc-text) text-2xl @3xl:text-3xl')}>
                    {parent.name}
                  </span>
                </li>
              ))}
            </ul>
          </Reveal>
        )}
        {padrinos.length === 0 ? null : (
          <div className="flex w-full flex-col items-center gap-10">
            <Reveal>
              <SectionTitle kicker="Padrinos" title="Our sponsors" />
            </Reveal>
            <div className="grid w-full gap-4 @md:grid-cols-2 @3xl:grid-cols-3">
              {padrinos.map((padrino, index) => (
                <Reveal key={index} delay={(index % 3) * 100}>
                  <div className="relative flex h-full flex-col items-center gap-2 bg-(--mc-bg)/60 px-5 py-7 text-center">
                    <DecoCorners />
                    <span className={cn(DECO, 'text-(--mc-gold) text-[11px]')}>{padrino.role}</span>
                    <span className={cn(DISPLAY, 'text-(--mc-text) text-xl')}>{padrino.names}</span>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
