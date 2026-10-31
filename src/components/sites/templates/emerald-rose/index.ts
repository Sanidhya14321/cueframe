import type { EmeraldRoseContent } from '@/sites/templates/weddings/emerald-rose';
import type { SiteView } from '../../site-view';
import { GateIntro } from './gate-intro';
import { EmeraldRoseBody } from './site-body';
import { emeraldRoseScope } from './theme';

export const emeraldRoseView: SiteView<EmeraldRoseContent> = {
  scope: emeraldRoseScope,
  Body: EmeraldRoseBody,
  Intro: GateIntro,
  hasIntro: (content) => content.intro.show,
};
