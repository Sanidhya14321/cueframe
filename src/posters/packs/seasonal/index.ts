import type { Poster } from '../../pack';
import { cryptLanternHalloweenPack } from './crypt-lantern-halloween';
import { goldlineBlackFridayPack } from './goldline-black-friday';
import { plumHarvestAutumnPack } from './plum-harvest-autumn';

export const SEASONAL_PACKS: Poster[] = [
  ...cryptLanternHalloweenPack,
  ...goldlineBlackFridayPack,
  ...plumHarvestAutumnPack,
];
