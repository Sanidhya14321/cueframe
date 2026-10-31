import type { BurningPaperRevealProps } from '@/schemas';
import { groteskFont, scriptFont, serifFont } from './fonts';

const HEADLINE_ADVANCE = 0.5;

const INSET = 24;

const swoosh = (type: BurningPaperRevealProps['type'], letters: number): string => {
  const start = type.headlineX + type.headlineSize * 0.04;
  const end = start + type.headlineSize * HEADLINE_ADVANCE * Math.max(1, letters) * 0.96;
  const base = type.headlineY + type.headlineSize * 0.13;
  const mid = (start + end) / 2;
  return [
    `M ${start.toFixed(1)} ${(base + 4).toFixed(1)}`,
    `Q ${mid.toFixed(1)} ${(base + type.headlineSize * 0.07).toFixed(1)}`,
    `${end.toFixed(1)} ${(base - type.headlineSize * 0.03).toFixed(1)}`,
  ].join(' ');
};

export const PaperPrint = ({ props }: { props: BurningPaperRevealProps }) => {
  const { copy, type, paper } = props;
  return (
    <g textRendering="geometricPrecision">
      {paper.border > 0 ? (
        <rect
          x={INSET}
          y={INSET}
          width={paper.width - INSET * 2}
          height={paper.height - INSET * 2}
          fill="none"
          stroke={type.ink}
          strokeWidth={1.6}
          strokeOpacity={paper.border * 0.45}
        />
      ) : null}
      <text
        x={type.kickerX}
        y={type.kickerY}
        transform={`rotate(-4 ${type.kickerX} ${type.kickerY})`}
        fill={type.accent}
        fontFamily={scriptFont}
        fontWeight={600}
        fontSize={type.kickerSize}
      >
        {copy.kicker}
      </text>
      <text
        x={type.headlineX}
        y={type.headlineY}
        fill={type.ink}
        fontFamily={serifFont}
        fontWeight={400}
        fontSize={type.headlineSize}
        letterSpacing={-type.headlineSize * 0.01}
      >
        {copy.headline}
      </text>
      {type.underline ? (
        <path
          d={swoosh(type, copy.headline.length)}
          fill="none"
          stroke={type.accent}
          strokeWidth={Math.max(2, type.headlineSize * 0.035)}
          strokeLinecap="round"
          strokeOpacity={0.92}
        />
      ) : null}
      <text
        x={type.asideX}
        y={type.asideY}
        transform={`rotate(-3 ${type.asideX} ${type.asideY})`}
        textAnchor="end"
        fill={type.accent}
        fontFamily={scriptFont}
        fontWeight={600}
        fontSize={type.asideSize}
      >
        {copy.aside}
      </text>
      <text
        x={type.footerX}
        y={type.footerY}
        fill={type.ink}
        fontFamily={groteskFont}
        fontWeight={600}
        fontSize={type.footerSize}
        letterSpacing={type.footerSize * 0.16}
      >
        {copy.footer.toUpperCase()}
      </text>
    </g>
  );
};
