import track from '@/footage/street-sign-swap.track.json';
import type { FootagePlate } from '../footage/footage-stage';
import { parseTrack } from '../footage/footage-track';

export const STREET_PLATE: FootagePlate = {
  src: 'footage/street-sign-swap/plate.mp4',
  track: parseTrack(track),
};
