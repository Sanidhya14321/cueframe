import type { ClipModule } from '../../registry';
import { phoneFlatLayDefaults, phoneFlatLayMeta, phoneFlatLaySchema } from './phone-flat-lay';
import { phoneFlatLayControls } from './phone-flat-lay-controls';
import { phonePedestalDefaults, phonePedestalMeta, phonePedestalSchema } from './phone-pedestal';
import { phonePedestalControls } from './phone-pedestal-controls';
import { phoneSpinInDefaults, phoneSpinInMeta, phoneSpinInSchema } from './phone-spin-in';
import { phoneSpinInControls } from './phone-spin-in-controls';
import {
  phoneTurnaroundDefaults,
  phoneTurnaroundMeta,
  phoneTurnaroundSchema,
} from './phone-turnaround';
import { phoneTurnaroundControls } from './phone-turnaround-controls';

export const phoneRevealsClips: ClipModule[] = [
  {
    id: 'phone-spin-in',
    schema: phoneSpinInSchema,
    defaults: phoneSpinInDefaults,
    meta: phoneSpinInMeta,
    controls: phoneSpinInControls,
  },
  {
    id: 'phone-turnaround',
    schema: phoneTurnaroundSchema,
    defaults: phoneTurnaroundDefaults,
    meta: phoneTurnaroundMeta,
    controls: phoneTurnaroundControls,
  },
  {
    id: 'phone-pedestal',
    schema: phonePedestalSchema,
    defaults: phonePedestalDefaults,
    meta: phonePedestalMeta,
    controls: phonePedestalControls,
  },
  {
    id: 'phone-flat-lay',
    schema: phoneFlatLaySchema,
    defaults: phoneFlatLayDefaults,
    meta: phoneFlatLayMeta,
    controls: phoneFlatLayControls,
  },
];
