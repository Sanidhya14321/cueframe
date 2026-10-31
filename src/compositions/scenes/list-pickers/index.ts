import type { SceneModule } from '../../scene-module';
import { colorPillsScene } from './color-pills';
import { headingListScene } from './heading-list';
import { listPickersReelScene } from './list-pickers-reel';
import { mailinfraDewStepsScene } from './mailinfra-dew-steps';
import { menuStackScene } from './menu-stack';
import { mindMapScene } from './mind-map';
import { pillFanScene } from './pill-fan';
import { productCardsScene } from './product-cards';
import { skillWheelScene } from './skill-wheel';
import { wordPickerScene } from './word-picker';
import { yearDialScene } from './year-dial';

export const listPickersScenes: SceneModule[] = [
  wordPickerScene,
  pillFanScene,
  menuStackScene,
  headingListScene,
  yearDialScene,
  mindMapScene,
  colorPillsScene,
  skillWheelScene,
  productCardsScene,
  listPickersReelScene,
  mailinfraDewStepsScene,
];
