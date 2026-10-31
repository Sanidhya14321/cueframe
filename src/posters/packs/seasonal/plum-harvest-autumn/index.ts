import { definePack } from '../../../pack';
import { firstDayOfFall, lockScreen, notesQuote, playlist, thankfulFor } from './posts';
import { novemberPost, novemberStory } from './posts-extra';
import {
  autumnEssentials,
  autumnSnacks,
  fallSips,
  shadeCards,
  winterFavorites,
} from './posts-more';

const POSTS = [
  autumnEssentials,
  firstDayOfFall,
  thankfulFor,
  fallSips,
  playlist,
  notesQuote,
  autumnSnacks,
  shadeCards,
  lockScreen,
  novemberPost,
  winterFavorites,
];

export const plumHarvestAutumnPack = definePack({
  id: 'plum-harvest-autumn',
  title: 'Plum Harvest Autumn',
  description:
    'Cozy fall influencer posts and stories with postcards, playlists, notes and palettes in plum, rose, sage and butter.',
  category: 'seasonal',
  tags: ['holiday', 'instagram', 'story', 'photo'],
  theme: 'light',

  designs: [
    ...POSTS,
    firstDayOfFall,
    playlist,
    notesQuote,
    thankfulFor,
    lockScreen,
    shadeCards,
    fallSips,
    autumnEssentials,
    novemberPost,
    autumnSnacks,
    winterFavorites,
    novemberStory,
  ],
});
