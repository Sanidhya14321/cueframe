import type { PumpkinPatchContent } from '@/sites/templates/baby-showers/pumpkin-patch';
import type { SiteView } from '../../site-view';
import { GiftBoxIntro } from './gift-box-intro';
import { PumpkinPatchBody } from './site-body';
import { pumpkinPatchScope } from './theme';

export const pumpkinPatchView: SiteView<PumpkinPatchContent> = {
  scope: pumpkinPatchScope,
  Body: PumpkinPatchBody,
  Intro: GiftBoxIntro,
  hasIntro: (content) => content.intro.show,
};
