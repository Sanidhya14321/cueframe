import { cn } from '@/lib/utils';

const KEYFRAMES = `
@keyframes sd-fall { from { transform: translate3d(0, -100%, 0); } to { transform: translate3d(0, 4%, 0); } }
@keyframes sd-sway { 0%, 100% { transform: translateX(-6px) rotate(0deg); } 50% { transform: translateX(10px) rotate(40deg); } }
@keyframes sd-bob { 0%, 100% { transform: translateY(0) rotate(-5deg); } 50% { transform: translateY(-7px) rotate(5deg); } }
@keyframes sd-twinkle { 0%, 100% { opacity: 0.35; transform: scale(0.8); } 50% { opacity: 1; transform: scale(1.1); } }
`;

export const SnowKeyframes = () => <style>{KEYFRAMES}</style>;

const seeded = (index: number, salt: number): number => {
  let state = (index * 2654 + salt * 40_503 + 0x6d2b79f5) | 0;
  state = Math.imul(state ^ (state >>> 15), state | 1);
  state ^= state + Math.imul(state ^ (state >>> 7), state | 61);
  return ((state ^ (state >>> 14)) >>> 0) / 4_294_967_296;
};

const round = (value: number): number => Math.round(value * 100) / 100;

interface Flake {
  left: number;
  size: number;
  duration: number;
  delay: number;
  sway: number;
  opacity: number;
  crystal: boolean;
}

const flakes = (count: number): Flake[] =>
  Array.from({ length: count }, (_, index) => ({
    left: round(seeded(index, 1) * 100),
    size: round(3 + seeded(index, 2) * 7),
    duration: round(9 + seeded(index, 3) * 12),
    delay: round(-seeded(index, 4) * 20),
    sway: round(3 + seeded(index, 5) * 4),
    opacity: round(0.45 + seeded(index, 6) * 0.5),
    crystal: index % 5 === 0,
  }));

const CrystalFlake = ({ size, color }: { size: number; color: string }) => (
  <svg viewBox="-12 -12 24 24" width={size * 2} height={size * 2} aria-hidden="true">
    <g stroke={color} strokeWidth="1.8" strokeLinecap="round" fill="none">
      {[0, 60, 120].map((angle) => (
        <path
          key={angle}
          d="M0 -10 V10 M-3 -7 L0 -4 L3 -7 M-3 7 L0 4 L3 7"
          transform={`rotate(${angle})`}
        />
      ))}
    </g>
  </svg>
);

export const Snowfall = ({
  count = 36,
  color = 'white',
  className,
}: {
  count?: number;
  color?: string;
  className?: string;
}) => (
  <div
    aria-hidden="true"
    className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)}
  >
    {flakes(count).map((flake, index) => (
      <div
        key={index}
        className="absolute top-0 h-full animate-[sd-fall_linear_infinite] motion-reduce:[animation-play-state:paused]"
        style={{
          left: `${flake.left}%`,
          animationDuration: `${flake.duration}s`,
          animationDelay: `${flake.delay}s`,
        }}
      >
        <div
          className="absolute bottom-0 animate-[sd-sway_ease-in-out_infinite] motion-reduce:[animation-play-state:paused]"
          style={{ animationDuration: `${flake.sway}s`, opacity: flake.opacity }}
        >
          {flake.crystal ? (
            <CrystalFlake size={flake.size} color={color} />
          ) : (
            <span
              className="block rounded-full shadow-[0_0_6px_rgba(255,255,255,0.8)]"
              style={{ width: flake.size, height: flake.size, backgroundColor: color }}
            />
          )}
        </div>
      </div>
    ))}
  </div>
);
