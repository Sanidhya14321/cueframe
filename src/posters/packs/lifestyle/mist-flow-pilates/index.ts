import { definePack } from '../../../pack';
import { flowJams, pilatesBig, profileFrame, workoutCalendar } from './posts';
import {
  morningMeditation,
  stressEmergency,
  sundayPilates,
  treePosePost,
  treePoseStory,
} from './posts-extra';
import { classCalendar, formTips, principles, searchPoses } from './posts-more';

const POSTS = [
  principles,
  formTips,
  pilatesBig,
  flowJams,
  workoutCalendar,
  stressEmergency,
  profileFrame,
  classCalendar,
  searchPoses,
  treePosePost,
  sundayPilates,
];

export const mistFlowPilatesPack = definePack({
  id: 'mist-flow-pilates',
  title: 'Mist Flow Pilates',
  description:
    'Calm yoga and pilates studio posts and stories with schedules, form tips and playlists in mist blue, slate and mint.',
  category: 'lifestyle',
  tags: ['wellness', 'instagram', 'story', 'tips'],
  theme: 'light',

  designs: [
    ...POSTS,
    flowJams,
    pilatesBig,
    workoutCalendar,
    profileFrame,
    stressEmergency,
    classCalendar,
    formTips,
    principles,
    searchPoses,
    treePosePost,
    sundayPilates,
    morningMeditation,
    treePoseStory,
  ],
});
