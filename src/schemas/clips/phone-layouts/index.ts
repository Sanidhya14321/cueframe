import type { ClipModule } from '../../registry';
import { chargeCompareDefaults, chargeCompareMeta, chargeCompareSchema } from './charge-compare';
import { chargeCompareControls } from './charge-compare-controls';
import { phoneFanDefaults, phoneFanMeta, phoneFanSchema } from './phone-fan';
import { phoneFanControls } from './phone-fan-controls';
import { phonePairDefaults, phonePairMeta, phonePairSchema } from './phone-pair';
import { phonePairControls } from './phone-pair-controls';
import { phoneWallDefaults, phoneWallMeta, phoneWallSchema } from './phone-wall';
import { phoneWallControls } from './phone-wall-controls';

export const phoneLayoutsClips: ClipModule[] = [
  {
    id: 'phone-fan',
    schema: phoneFanSchema,
    defaults: phoneFanDefaults,
    meta: phoneFanMeta,
    controls: phoneFanControls,
  },
  {
    id: 'phone-pair',
    schema: phonePairSchema,
    defaults: phonePairDefaults,
    meta: phonePairMeta,
    controls: phonePairControls,
  },
  {
    id: 'phone-wall',
    schema: phoneWallSchema,
    defaults: phoneWallDefaults,
    meta: phoneWallMeta,
    controls: phoneWallControls,
  },
  {
    id: 'charge-compare',
    schema: chargeCompareSchema,
    defaults: chargeCompareDefaults,
    meta: chargeCompareMeta,
    controls: chargeCompareControls,
  },
];
