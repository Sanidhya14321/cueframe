import { cn } from '@/lib/utils';
import { Sparkle } from './ornaments';

const random = (seed: number): (() => number) => {
  let state = seed;
  return () => {
    state = (state * 1_664_525 + 1_013_904_223) % 4_294_967_296;
    return state / 4_294_967_296;
  };
};

const round = (value: number): number => Math.round(value * 100) / 100;

const buildStars = (seed: number, count: number) => {
  const next = random(seed);
  return Array.from({ length: count }, (_, index) => ({
    id: index,
    left: round(next() * 100),
    top: round(next() * 100),
    size: round(1 + next() * 2),
    delay: round(next() * 6),
    duration: round(3 + next() * 4),
    sparkle: index % 9 === 0,
  }));
};

const FIELDS = { sky: buildStars(15, 70), band: buildStars(7, 26) };

export const Starfield = ({
  variant = 'sky',
  className,
}: {
  variant?: keyof typeof FIELDS;
  className?: string;
}) => (
  <div
    aria-hidden="true"
    className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)}
  >
    {FIELDS[variant].map((star) => {
      const style = {
        left: `${star.left}%`,
        top: `${star.top}%`,
        animationDelay: `${star.delay}s`,
        animationDuration: `${star.duration}s`,
      };
      const twinkle =
        'absolute animate-[mc-twinkle_5s_ease-in-out_infinite] motion-reduce:animate-none';
      return star.sparkle ? (
        <span key={star.id} className={twinkle} style={style}>
          <Sparkle className="size-3 text-(--mc-gold-light)" />
        </span>
      ) : (
        <span
          key={star.id}
          className={cn(twinkle, 'rounded-full bg-(--mc-text)')}
          style={{ ...style, width: `${star.size}px`, height: `${star.size}px` }}
        />
      );
    })}
  </div>
);

export const MIDNIGHT_KEYFRAMES = `
@keyframes mc-twinkle { 0%, 100% { opacity: 0.25; transform: scale(0.7); } 50% { opacity: 1; transform: scale(1); } }
@keyframes mc-shimmer { 0%, 100% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } }
@keyframes mc-float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
`;
