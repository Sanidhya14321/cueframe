import type { SnowDayOneContent } from '@/sites/templates/birthdays/snow-day-one';
import type { SiteView } from '../../site-view';
import { FrostIntro } from './frost-intro';
import { SnowDayOneBody } from './site-body';
import { snowDayOneScope } from './theme';

export const snowDayOneView: SiteView<SnowDayOneContent> = {
  scope: snowDayOneScope,
  Body: SnowDayOneBody,
  Intro: FrostIntro,
  hasIntro: (content) => content.intro.show,
};
