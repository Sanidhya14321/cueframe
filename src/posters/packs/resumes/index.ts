import type { Poster } from '../../pack';
import { blueprintGridResumePack } from './blueprint-grid-resume';
import { focalPointPhotographerPack } from './focal-point-photographer';
import { garnetMonogramResumePack } from './garnet-monogram-resume';
import { graphiteStackEngineerPack } from './graphite-stack-engineer';
import { loopLineDesignerPack } from './loop-line-designer';
import { roseMarbleRealtorPack } from './rose-marble-realtor';
import { skylineWebDeveloperPack } from './skyline-web-developer';
import { tidepoolAppResumePack } from './tidepool-app-resume';

export const RESUME_PACKS: Poster[] = [
  ...blueprintGridResumePack,
  ...focalPointPhotographerPack,
  ...garnetMonogramResumePack,
  ...graphiteStackEngineerPack,
  ...loopLineDesignerPack,
  ...roseMarbleRealtorPack,
  ...skylineWebDeveloperPack,
  ...tidepoolAppResumePack,
];
