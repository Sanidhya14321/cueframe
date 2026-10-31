import type { ClipModule } from '../../registry';
import { colorPillsDefaults, colorPillsMeta, colorPillsSchema } from './color-pills';
import { colorPillsControls } from './color-pills-controls';
import { headingListDefaults, headingListMeta, headingListSchema } from './heading-list';
import { headingListControls } from './heading-list-controls';
import {
  listPickersReelDefaults,
  listPickersReelMeta,
  listPickersReelSchema,
} from './list-pickers-reel';
import { listPickersReelControls } from './list-pickers-reel-controls';
import {
  mailinfraDewStepsDefaults,
  mailinfraDewStepsMeta,
  mailinfraDewStepsSchema,
} from './mailinfra-dew-steps';
import { mailinfraDewStepsControls } from './mailinfra-dew-steps-controls';
import { menuStackDefaults, menuStackMeta, menuStackSchema } from './menu-stack';
import { menuStackControls } from './menu-stack-controls';
import { mindMapDefaults, mindMapMeta, mindMapSchema } from './mind-map';
import { mindMapControls } from './mind-map-controls';
import { pillFanDefaults, pillFanMeta, pillFanSchema } from './pill-fan';
import { pillFanControls } from './pill-fan-controls';
import { productCardsDefaults, productCardsMeta, productCardsSchema } from './product-cards';
import { productCardsControls } from './product-cards-controls';
import { skillWheelDefaults, skillWheelMeta, skillWheelSchema } from './skill-wheel';
import { skillWheelControls } from './skill-wheel-controls';
import { wordPickerDefaults, wordPickerMeta, wordPickerSchema } from './word-picker';
import { wordPickerControls } from './word-picker-controls';
import { yearDialDefaults, yearDialMeta, yearDialSchema } from './year-dial';
import { yearDialControls } from './year-dial-controls';

export const listPickersClips: ClipModule[] = [
  {
    id: 'word-picker',
    schema: wordPickerSchema,
    defaults: wordPickerDefaults,
    meta: wordPickerMeta,
    controls: wordPickerControls,
  },
  {
    id: 'pill-fan',
    schema: pillFanSchema,
    defaults: pillFanDefaults,
    meta: pillFanMeta,
    controls: pillFanControls,
  },
  {
    id: 'menu-stack',
    schema: menuStackSchema,
    defaults: menuStackDefaults,
    meta: menuStackMeta,
    controls: menuStackControls,
  },
  {
    id: 'heading-list',
    schema: headingListSchema,
    defaults: headingListDefaults,
    meta: headingListMeta,
    controls: headingListControls,
  },
  {
    id: 'year-dial',
    schema: yearDialSchema,
    defaults: yearDialDefaults,
    meta: yearDialMeta,
    controls: yearDialControls,
  },
  {
    id: 'mind-map',
    schema: mindMapSchema,
    defaults: mindMapDefaults,
    meta: mindMapMeta,
    controls: mindMapControls,
  },
  {
    id: 'color-pills',
    schema: colorPillsSchema,
    defaults: colorPillsDefaults,
    meta: colorPillsMeta,
    controls: colorPillsControls,
  },
  {
    id: 'skill-wheel',
    schema: skillWheelSchema,
    defaults: skillWheelDefaults,
    meta: skillWheelMeta,
    controls: skillWheelControls,
  },
  {
    id: 'product-cards',
    schema: productCardsSchema,
    defaults: productCardsDefaults,
    meta: productCardsMeta,
    controls: productCardsControls,
  },
  {
    id: 'list-pickers-reel',
    schema: listPickersReelSchema,
    defaults: listPickersReelDefaults,
    meta: listPickersReelMeta,
    controls: listPickersReelControls,
  },
  {
    id: 'mailinfra-dew-steps',
    schema: mailinfraDewStepsSchema,
    defaults: mailinfraDewStepsDefaults,
    meta: mailinfraDewStepsMeta,
    controls: mailinfraDewStepsControls,
  },
];
