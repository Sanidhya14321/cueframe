import type { Poster } from '../../pack';
import { blazeFoxesFootballPack } from './blaze-foxes-football';
import { courtKingsPack } from './court-kings';
import { frostHawksHockeyPack } from './frost-hawks-hockey';

export const SPORTS_PACKS: Poster[] = [
  ...blazeFoxesFootballPack,
  ...courtKingsPack,
  ...frostHawksHockeyPack,
];
