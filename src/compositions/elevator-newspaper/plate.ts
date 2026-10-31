import track from '@/footage/elevator-newspaper.track.json';
import type { FootagePlate } from '../footage/footage-stage';
import { parseTrack } from '../footage/footage-track';

export const ELEVATOR_PLATE: FootagePlate = {
  src: 'footage/elevator-newspaper/plate.mp4',
  track: parseTrack(track),
};
