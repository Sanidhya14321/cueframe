import type { Poster } from '../../pack';
import { cobaltStudioYogaPack } from './cobalt-studio-yoga';
import { lilacHourSelfcarePack } from './lilac-hour-selfcare';
import { mistFlowPilatesPack } from './mist-flow-pilates';

export const LIFESTYLE_PACKS: Poster[] = [
  ...cobaltStudioYogaPack,
  ...lilacHourSelfcarePack,
  ...mistFlowPilatesPack,
];
