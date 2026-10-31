import { Composition, useCurrentFrame, useVideoConfig } from 'remotion';
import {
  type BadgeGridOrder,
  type ChalkBadgeGridProps,
  chalkBadgeGridDefaults,
  chalkBadgeGridMeta,
  chalkBadgeGridSchema,
} from '@/schemas';
import { Badge } from '../../connectors/badge';
import { ChalkLayer } from '../../connectors/chalk-board';
import { badgePhase } from '../../connectors/phase';
import { hash } from '../../promo/ink-geometry';
import type { SceneModule } from '../../scene-module';

const FILTER_ID = 'chalk-grid-ink';

const shuffledRanks = (count: number, seed: number): number[] => {
  const order = Array.from({ length: count }, (_, index) => index).sort(
    (a, b) => hash(seed, a) - hash(seed, b),
  );
  const ranks = new Array<number>(count).fill(0);
  order.forEach((badge, rank) => {
    ranks[badge] = rank;
  });
  return ranks;
};

const orderRanks = (order: BadgeGridOrder, count: number, seed: number): number[] => {
  if (order === 'scattered') {
    return shuffledRanks(count, seed);
  }
  return Array.from({ length: count }, (_, index) =>
    order === 'reverse' ? count - 1 - index : index,
  );
};

export const ChalkBadgeGrid = ({
  badges,
  columns,
  scale,
  insetX,
  insetY,
  delay,
  stagger,
  order,
  eraseStagger,
  shuffle,
  timing,
  chalk,
  look,
  motion,
}: ChalkBadgeGridProps) => {
  const frame = useCurrentFrame() * motion.speed;
  const { width, height } = useVideoConfig();
  const columnCount = Math.max(1, Math.round(columns));
  const rows = Math.ceil(badges.length / columnCount);
  const cellWidth = (width - insetX * 2) / columnCount;
  const cellHeight = (height - insetY * 2) / rows;
  const ranks = orderRanks(order, badges.length, shuffle);
  return (
    <ChalkLayer look={look} motion={motion} chalk={chalk} filterId={FILTER_ID}>
      {badges.map((badge, index) => {
        const rank = ranks[index] ?? index;
        const column = index % columnCount;
        const row = Math.floor(index / columnCount);
        const start = delay + rank * stagger;
        const { draw, erase } = badgePhase(frame, start, {
          ...timing,
          eraseAt: timing.eraseAt - rank * stagger + rank * eraseStagger,
        });
        return (
          <Badge
            key={`${index.toString()}-${badge.variant}`}
            badge={badge}
            chalk={chalk}
            draw={draw}
            erase={erase}
            x={insetX + cellWidth * (column + 0.5)}
            y={insetY + cellHeight * (row + 0.5)}
            scale={scale}
            id={`chalk-grid-${index.toString()}`}
            filterId={FILTER_ID}
          />
        );
      })}
    </ChalkLayer>
  );
};

export const chalkBadgeGridScene: SceneModule = {
  id: 'chalk-badge-grid',
  component: ChalkBadgeGrid,
  render: (key) => (
    <Composition
      key={key}
      id="chalk-badge-grid"
      component={ChalkBadgeGrid}
      schema={chalkBadgeGridSchema}
      defaultProps={chalkBadgeGridDefaults}
      durationInFrames={chalkBadgeGridMeta.durationInFrames}
      fps={chalkBadgeGridMeta.fps}
      width={chalkBadgeGridMeta.width}
      height={chalkBadgeGridMeta.height}
    />
  ),
};
