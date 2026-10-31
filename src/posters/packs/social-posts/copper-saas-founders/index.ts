import { definePack } from '../../../pack';
import { allInOne, COPPER, introNumber, LILAC, smartStrategy, systemsPost } from './posts';
import { benefitsApp, bookDemo, quotePhone, statDonut } from './posts-more';
import { fromZero, ourServices } from './posts-words';

const SERVICES = ourServices(COPPER, 'OUR SERVICES', [
  'CONNECT',
  'BETTER',
  'SOCIAL MEDIA',
  'DO THE WORK',
  'BRANDING',
  'OPTIMIZE',
  'FAST',
  'LAUNCH',
]);
const ZERO = fromZero(COPPER, {
  left: 'Start today',
  right: 'Join us',
  tag: 'From 0 to',
  word: 'launch',
});
const SYSTEMS = systemsPost(COPPER);
const INTRO = introNumber(COPPER);
const SMART = smartStrategy(COPPER);
const PLACE = allInOne(COPPER);
const QUOTE = quotePhone(COPPER);
const DEMO = bookDemo(COPPER);
const DONUT = statDonut(COPPER);
const BENEFITS = benefitsApp(COPPER);

const TILES = [SYSTEMS, INTRO, SMART, PLACE, QUOTE, DEMO, DONUT, DEMO, BENEFITS, SERVICES];

export const copperSaasFoundersPack = definePack({
  id: 'copper-saas-founders',
  title: 'Copper SaaS Founders',
  description:
    'Startup marketing posts for SaaS and AI founders in copper orange on near black, with story-ready layouts.',
  category: 'social-posts',
  tags: ['saas', 'ai', 'linkedin', 'instagram', 'b2b'],
  theme: 'dark',

  designs: [
    INTRO,
    DEMO,
    SERVICES,
    PLACE,
    ZERO,
    DONUT,
    SMART,
    BENEFITS,
    QUOTE,
    SYSTEMS,
    ...TILES,
    ourServices(LILAC, 'OUR TOOLS', [
      'STORAGE',
      'CRM',
      'SEARCH',
      'ANALYTICS',
      'HOSTING',
      'VIDEO',
      'MAPS',
      'BILLING',
    ]),
    fromZero(LILAC, {
      left: 'Fast and easy',
      right: 'Join us',
      tag: 'Start today',
      word: 'Better',
    }),
  ],
});
