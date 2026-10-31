import type { z } from 'zod';
import type { ClipId, ClipPropsMap } from '../clip-props';
import type { ClipMeta, ClipModule } from '../registry';
import { adRevealsClips } from './ad-reveals';
import { backgroundsClips } from './backgrounds';
import { brandClips } from './brand';
import { deskScenesClips } from './desk-scenes';
import { handDrawnClips } from './hand-drawn';
import { importedClips } from './imported';
import { invitationsClips } from './invitations';
import { kineticTypeClips } from './kinetic-type';
import { listPickersClips } from './list-pickers';
import { overlaysClips } from './overlays';
import { phoneLayoutsClips } from './phone-layouts';
import { phoneRevealsClips } from './phone-reveals';
import { screenDemosClips } from './screen-demos';
import { textRevealsClips } from './text-reveals';
import { transitionsClips } from './transitions';

export const CLIP_MODULES: ClipModule[] = [
  ...importedClips,
  ...kineticTypeClips,
  ...textRevealsClips,
  ...handDrawnClips,
  ...phoneRevealsClips,
  ...phoneLayoutsClips,
  ...screenDemosClips,
  ...deskScenesClips,
  ...overlaysClips,
  ...listPickersClips,
  ...brandClips,
  ...adRevealsClips,
  ...backgroundsClips,
  ...transitionsClips,
  ...invitationsClips,
];

export const CLIP_IDS: readonly ClipId[] = CLIP_MODULES.map((module) => module.id);

export const CLIP_REGISTRY: readonly ClipMeta[] = CLIP_MODULES.map((module) => module.meta);

export const CLIP_SCHEMAS = Object.fromEntries(
  CLIP_MODULES.map((module) => [module.id, module.schema]),
) as Record<ClipId, z.ZodType>;

export const CLIP_DEFAULTS = Object.fromEntries(
  CLIP_MODULES.map((module) => [module.id, module.defaults]),
) as { [Id in ClipId]: ClipPropsMap[Id] };

const REGISTRY_BY_ID = Object.fromEntries(CLIP_REGISTRY.map((meta) => [meta.id, meta])) as Record<
  ClipId,
  ClipMeta
>;

export const isClipId = (value: string): value is ClipId => Object.hasOwn(REGISTRY_BY_ID, value);

export const getClipMeta = (id: ClipId): ClipMeta => REGISTRY_BY_ID[id];

export const getClipSchema = (id: ClipId): z.ZodType => CLIP_SCHEMAS[id];

export const getClipDefaults = <Id extends ClipId>(id: Id): ClipPropsMap[Id] => CLIP_DEFAULTS[id];
