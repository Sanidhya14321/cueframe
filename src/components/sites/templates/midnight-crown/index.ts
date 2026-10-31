import type { MidnightCrownContent } from '@/sites/templates/quinceaneras/midnight-crown';
import type { SiteView } from '../../site-view';
import { DoorsIntro } from './doors-intro';
import { MidnightCrownBody } from './site-body';
import { midnightCrownScope } from './theme';

export const midnightCrownView: SiteView<MidnightCrownContent> = {
  scope: midnightCrownScope,
  Body: MidnightCrownBody,
  Intro: DoorsIntro,
  hasIntro: (content) => content.intro.show,
};
