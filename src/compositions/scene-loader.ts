import type { FC } from 'react';
import { type ClipCategory, type ClipId, getClipMeta, isClipId } from '@/schemas';
import type { SceneModule } from './scene-module';

type SceneComponent = FC<Record<string, unknown>>;

const CATEGORY_LOADERS: Record<ClipCategory, () => Promise<SceneModule[]>> = {
  imported: () => import('./scenes/imported').then((module) => module.importedScenes),
  'kinetic-type': () => import('./scenes/kinetic-type').then((module) => module.kineticTypeScenes),
  'text-reveals': () => import('./scenes/text-reveals').then((module) => module.textRevealsScenes),
  'hand-drawn': () => import('./scenes/hand-drawn').then((module) => module.handDrawnScenes),
  'phone-reveals': () =>
    import('./scenes/phone-reveals').then((module) => module.phoneRevealsScenes),
  'phone-layouts': () =>
    import('./scenes/phone-layouts').then((module) => module.phoneLayoutsScenes),
  'screen-demos': () => import('./scenes/screen-demos').then((module) => module.screenDemosScenes),
  'desk-scenes': () => import('./scenes/desk-scenes').then((module) => module.deskScenesScenes),
  overlays: () => import('./scenes/overlays').then((module) => module.overlaysScenes),
  'list-pickers': () => import('./scenes/list-pickers').then((module) => module.listPickersScenes),
  brand: () => import('./scenes/brand').then((module) => module.brandScenes),
  'ad-reveals': () => import('./scenes/ad-reveals').then((module) => module.adRevealsScenes),
  backgrounds: () => import('./scenes/backgrounds').then((module) => module.backgroundsScenes),
  transitions: () => import('./scenes/transitions').then((module) => module.transitionsScenes),
  invitations: () => import('./scenes/invitations').then((module) => module.invitationsScenes),
};

const loadedScenes = new Map<string, SceneComponent>();
const pendingCategories = new Map<ClipCategory, Promise<void>>();

export const loadedSceneComponent = (id: string): SceneComponent | null =>
  loadedScenes.get(id) ?? null;

export const loadSceneComponent = (id: ClipId): Promise<void> => {
  const { category } = getClipMeta(id);
  const pending = pendingCategories.get(category);
  if (pending !== undefined) {
    return pending;
  }
  const loading = CATEGORY_LOADERS[category]().then((scenes) => {
    for (const scene of scenes) {
      loadedScenes.set(scene.id, scene.component as SceneComponent);
    }
  });
  loading.catch(() => pendingCategories.delete(category));
  pendingCategories.set(category, loading);
  return loading;
};

export const preloadProjectScenes = (clipIds: readonly string[]): Promise<void> =>
  Promise.all(clipIds.filter(isClipId).map(loadSceneComponent)).then(() => undefined);
