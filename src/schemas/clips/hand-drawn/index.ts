import type { ClipModule } from '../../registry';
import { chalkBadgeDefaults, chalkBadgeMeta, chalkBadgeSchema } from './chalk-badge';
import { chalkBadgeControls } from './chalk-badge-controls';
import {
  chalkBadgeGridDefaults,
  chalkBadgeGridMeta,
  chalkBadgeGridSchema,
} from './chalk-badge-grid';
import { chalkBadgeGridControls } from './chalk-badge-grid-controls';
import {
  chalkBadgesReelDefaults,
  chalkBadgesReelMeta,
  chalkBadgesReelSchema,
} from './chalk-badges-reel';
import { chalkBadgesReelControls } from './chalk-badges-reel-controls';
import { chalkTitleDefaults, chalkTitleMeta, chalkTitleSchema } from './chalk-title';
import { chalkTitleControls } from './chalk-title-controls';
import { doodleArrowsDefaults, doodleArrowsMeta, doodleArrowsSchema } from './doodle-arrows';
import { doodleArrowsControls } from './doodle-arrows-controls';
import {
  handwrittenNoteDefaults,
  handwrittenNoteMeta,
  handwrittenNoteSchema,
} from './handwritten-note';
import { handwrittenNoteControls } from './handwritten-note-controls';
import {
  scribbleCaptionDefaults,
  scribbleCaptionMeta,
  scribbleCaptionSchema,
} from './scribble-caption';
import { scribbleCaptionControls } from './scribble-caption-controls';

export const handDrawnClips: ClipModule[] = [
  {
    id: 'handwritten-note',
    schema: handwrittenNoteSchema,
    defaults: handwrittenNoteDefaults,
    meta: handwrittenNoteMeta,
    controls: handwrittenNoteControls,
  },
  {
    id: 'scribble-caption',
    schema: scribbleCaptionSchema,
    defaults: scribbleCaptionDefaults,
    meta: scribbleCaptionMeta,
    controls: scribbleCaptionControls,
  },
  {
    id: 'doodle-arrows',
    schema: doodleArrowsSchema,
    defaults: doodleArrowsDefaults,
    meta: doodleArrowsMeta,
    controls: doodleArrowsControls,
  },
  {
    id: 'chalk-badge',
    schema: chalkBadgeSchema,
    defaults: chalkBadgeDefaults,
    meta: chalkBadgeMeta,
    controls: chalkBadgeControls,
  },
  {
    id: 'chalk-badge-grid',
    schema: chalkBadgeGridSchema,
    defaults: chalkBadgeGridDefaults,
    meta: chalkBadgeGridMeta,
    controls: chalkBadgeGridControls,
  },
  {
    id: 'chalk-title',
    schema: chalkTitleSchema,
    defaults: chalkTitleDefaults,
    meta: chalkTitleMeta,
    controls: chalkTitleControls,
  },
  {
    id: 'chalk-badges-reel',
    schema: chalkBadgesReelSchema,
    defaults: chalkBadgesReelDefaults,
    meta: chalkBadgesReelMeta,
    controls: chalkBadgesReelControls,
  },
];
