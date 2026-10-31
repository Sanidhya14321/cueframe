import type { PuzzleSuccessProps } from '@/schemas';
import type { PuzzleBeat } from './choreography';

export const Sparks = ({
  props,
  beat,
  prefix,
}: {
  props: PuzzleSuccessProps;
  beat: PuzzleBeat;
  prefix: string;
}) => {
  const { sparks, block } = props;
  const count = Math.round(sparks.count);
  if (!sparks.show || beat.spark <= 0 || beat.spark >= 1 || count < 1) {
    return null;
  }
  const progress = beat.spark;
  const travel = 1 - (1 - progress) ** 3;
  const base = block.size * beat.wordScale * 0.6;
  const inner = base + sparks.reach * travel;
  const outer = inner + sparks.length * (1 - 0.75 * travel);
  const fade = (1 - progress) ** 1.6;
  const spin = (sparks.twist * travel * Math.PI) / 180;
  const rays = Array.from({ length: count }, (_, index) => {
    const angle = (index / count) * Math.PI * 2 + Math.PI / count + spin;
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    const stretch = index % 2 === 0 ? 1 : 0.7;
    const near = base + (inner - base) * stretch;
    const far = near + (outer - inner) * stretch;
    return {
      key: index,
      d: `M ${(block.centerX + cos * near).toFixed(2)} ${(block.centerY + sin * near).toFixed(2)} L ${(block.centerX + cos * far).toFixed(2)} ${(block.centerY + sin * far).toFixed(2)}`,
    };
  });
  return (
    <g fill="none" strokeLinecap="round" opacity={fade}>
      <g filter={`url(#${prefix}-neon-glow)`} opacity={0.8}>
        {rays.map(({ key, d }) => (
          <path key={key} d={d} stroke={sparks.color} strokeWidth={sparks.width * 3} />
        ))}
      </g>
      {rays.map(({ key, d }) => (
        <path key={key} d={d} stroke={sparks.color} strokeWidth={sparks.width} />
      ))}
    </g>
  );
};
