import type { InkAndLaceContent } from '@/sites/templates/weddings/ink-and-lace';
import type { SiteView } from '../../site-view';
import { CoverIntro } from './cover-intro';
import { InkAndLaceBody } from './site-body';
import { inkAndLaceScope } from './theme';

export const inkAndLaceView: SiteView<InkAndLaceContent> = {
  scope: inkAndLaceScope,
  Body: InkAndLaceBody,
  Intro: CoverIntro,
  hasIntro: (content) => content.intro.show,
};
