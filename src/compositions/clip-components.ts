import type { FC } from 'react';
import type { ClipId, ClipPropsMap } from '@/schemas';
import { CLIP_SCENES } from './scenes';

export type ClipComponent<Id extends ClipId> = FC<ClipPropsMap[Id]>;

export const CLIP_COMPONENTS = Object.fromEntries(
  CLIP_SCENES.map((scene) => [scene.id, scene.component]),
) as { [Id in ClipId]: ClipComponent<Id> };

export const getClipComponent = <Id extends ClipId>(id: Id): ClipComponent<Id> =>
  CLIP_COMPONENTS[id];
