import { join } from 'node:path';
import type { FootageSpec } from '@/footage/footage-spec';

export const sourceDir = (spec: FootageSpec) => join('footage', spec.id);
export const stillFile = (spec: FootageSpec, name: string) => join(sourceDir(spec), `${name}.png`);
export const shotFile = (spec: FootageSpec, name: string) => join(sourceDir(spec), `${name}.mp4`);
export const publishDir = (spec: FootageSpec) => join('public', 'footage', spec.id);
export const plateFile = (spec: FootageSpec) => join(publishDir(spec), 'plate.mp4');
export const trackFile = (spec: FootageSpec) => join('src', 'footage', `${spec.id}.track.json`);
