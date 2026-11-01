/* biome-ignore-all lint/complexity/useLiteralKeys: native parameter records require indexed access under strict TypeScript */
/* biome-ignore-all lint/complexity/noExcessiveCognitiveComplexity: typed conversion explicitly covers each source and native element variant */
import type { Element } from '@cueframe/project/element';
import type { Project } from '@cueframe/project/project';
import { needsSourcePreview } from '@cueframe/project/source-preview';
import type { MediaAsset } from '@/media/types';
import type { TProject } from '@/project/types';
import { FONT_SIZE_SCALE_REFERENCE } from '@/text/typography';
import type { SceneTracks, TimelineElement, TimelineTrack } from '@/timeline';
import { DEFAULTS } from '@/timeline/defaults';
import {
  buildElementFromMedia,
  buildGraphicElement,
  buildTextElement,
} from '@/timeline/element-utils';
import { mediaTimeFromSeconds, TICKS_PER_SECOND } from '@/wasm';

export type CanonicalProject = Project;
export type CanonicalElement = Element;
const time = (position: number, fps: number) => mediaTimeFromSeconds({ seconds: position / fps });
const frame = (ticks: number, fps: number) =>
  Math.max(0, Math.round((ticks / TICKS_PER_SECOND) * fps));
const allTracks = (rows: SceneTracks): TimelineTrack[] => [
  ...rows.overlay,
  rows.main,
  ...rows.audio,
];
const transformParams = (item: Element) => ({
  'transform.positionX': item.transform.x,
  'transform.positionY': item.transform.y,
  'transform.scaleX': item.transform.scale,
  'transform.scaleY': item.transform.scale,
  'transform.rotate': item.transform.rotation,
  opacity: item.transform.opacity,
});
const seenItems = new Map<string, Element>();

export { needsSourcePreview };

const nativeItem = (
  item: Element,
  project: Project,
  media: MediaAsset[],
  old: TimelineElement | undefined,
): TimelineElement => {
  const startTime = time(item.from, project.fps);
  const duration = time(item.durationInFrames, project.fps);
  let built: Omit<TimelineElement, 'id'>;
  const proxy = needsSourcePreview(item);
  if (item.type === 'text' && !proxy) {
    built = buildTextElement({
      raw: {
        ...DEFAULTS.text.element,
        params: {
          ...DEFAULTS.text.element.params,
          content: item.content,
          fontSize: (item.fontSize * FONT_SIZE_SCALE_REFERENCE) / project.height,
          fontFamily: item.fontFamily,
          color: item.color,
          fontWeight: 'bold',
          lineHeight: 1.1,
        },
      },
      startTime,
    });
  } else if (item.type === 'shape' && !proxy) {
    built = buildGraphicElement({
      definitionId: item.kind === 'ellipse' ? 'ellipse' : 'rectangle',
      startTime,
      params: {
        fill: item.color,
        cornerRadius: Math.min(50, (item.radius / Math.min(item.width, item.height)) * 100),
      },
    });
  } else {
    const asset =
      media.find((candidate) => candidate.id === `source-${item.id}`) ||
      media.find(
        (candidate) =>
          (item.type === 'image' || item.type === 'video' || item.type === 'audio') &&
          candidate.url === item.src,
      );
    if (!asset) {
      throw new Error(`Preparing ${item.type} ${item.id}. Retry opening after media is ready.`);
    }
    built = buildElementFromMedia({
      mediaId: asset.id,
      mediaType: asset.type,
      name: item.type === 'composition' ? item.clipId : item.type,
      duration,
      startTime,
    });
    if ('sourceDuration' in built) {
      built.sourceDuration = time(
        Math.max(
          item.durationInFrames + (item.sourceFrom ?? 0),
          (asset.duration ?? 0) * project.fps,
        ),
        project.fps,
      );
    }
  }
  const params = { ...built.params, ...transformParams(item) };
  if (item.type === 'shape' && !proxy) {
    const fit = Math.min(project.width, project.height);
    params['transform.scaleX'] = (item.width / fit) * item.transform.scale;
    params['transform.scaleY'] = (item.height / fit) * item.transform.scale;
  }
  if (item.type === 'audio') {
    Object.assign(params, { volume: item.volume === 0 ? -100 : 20 * Math.log10(item.volume) });
  }
  const trimStart = time(item.sourceFrom ?? 0, project.fps);
  const result = {
    ...old,
    ...built,
    id: item.id,
    name: old?.name ?? (item.type === 'composition' ? item.clipId : item.type),
    startTime,
    duration,
    trimStart,
    params: { ...old?.params, ...params },
  } as TimelineElement;
  return result;
};
export function projectToNative(
  project: Project,
  template: TProject,
  media: MediaAsset[],
): TProject {
  const previousItems = new Map(
    template.scenes
      .flatMap((previousScene) =>
        allTracks(previousScene.tracks).flatMap<TimelineElement>((track) => track.elements),
      )
      .map((entry) => [entry.id, entry]),
  );
  const previousTracks = new Map(
    template.scenes.flatMap((item) => allTracks(item.tracks)).map((track) => [track.id, track]),
  );
  const snapshot = project.opencut ? (JSON.parse(project.opencut.source) as Project) : undefined;
  const sourceItems = new Map(
    snapshot?.tracks.flatMap((track) => track.elements).map((item) => [item.id, item]) ?? [],
  );
  const tracks: TimelineTrack[] = project.tracks.flatMap((track) => {
    const groups = new Map<string, TimelineElement[]>();
    for (const item of track.elements) {
      const prior = previousItems.get(item.id);
      const same = JSON.stringify(sourceItems.get(item.id)) === JSON.stringify(item);
      let element = same && prior ? prior : nativeItem(item, project, media, prior);
      if (same && prior && 'mediaId' in prior) {
        const replacement = media.find((asset) => asset.id === `source-${item.id}`);
        if (replacement) {
          element = { ...prior, mediaId: replacement.id };
        }
      }
      const type =
        element.type === 'audio'
          ? 'audio'
          : element.type === 'text'
            ? 'text'
            : element.type === 'graphic' || element.type === 'sticker'
              ? 'graphic'
              : element.type === 'effect'
                ? 'effect'
                : 'video';
      groups.set(type, [...(groups.get(type) ?? []), element]);
    }
    if (groups.size === 0) {
      groups.set('video', []);
    }
    return [...groups].map(
      ([type, elements], index) =>
        ({
          id: index === 0 ? track.id : `${track.id}-${type}`,
          name: track.name,
          type,
          elements,
          hidden:
            track.hidden ??
            ('hidden' in (previousTracks.get(track.id) ?? {})
              ? Reflect.get(previousTracks.get(track.id) ?? {}, 'hidden')
              : false),
          muted:
            track.muted ??
            ('muted' in (previousTracks.get(track.id) ?? {})
              ? Reflect.get(previousTracks.get(track.id) ?? {}, 'muted')
              : false),
        }) as TimelineTrack,
    );
  });
  const main: SceneTracks['main'] = {
    id: 'opencut-main',
    name: 'Main Track',
    type: 'video',
    elements: [],
    muted: false,
    hidden: false,
  };
  const first = template.scenes[0];
  if (!first) {
    throw new Error('The native main scene is missing');
  }
  const scene = {
    ...first,
    tracks: {
      overlay: tracks.filter(
        (track): track is SceneTracks['overlay'][number] => track.type !== 'audio',
      ),
      main,
      audio: tracks.filter(
        (track): track is SceneTracks['audio'][number] => track.type === 'audio',
      ),
    },
  };
  return {
    ...template,
    metadata: { ...template.metadata, duration: time(project.durationInFrames, project.fps) },
    scenes: [scene],
    currentSceneId: scene.id,
    settings: {
      ...template.settings,
      canvasSize: { width: project.width, height: project.height },
      fps: { numerator: project.fps, denominator: 1 },
      background: { type: 'color', color: project.background },
    },
  };
}

export function nativeToProject(native: TProject, source: Project, media: MediaAsset[]): Project {
  const fps = native.settings.fps.numerator / native.settings.fps.denominator;
  const fit = Math.min(native.settings.canvasSize.width, native.settings.canvasSize.height);
  for (const item of source.tracks.flatMap((track) => track.elements)) {
    seenItems.set(item.id, item);
  }
  const originals = seenItems;
  const assets = new Map(media.map((asset) => [asset.id, asset]));
  const tracks = native.scenes
    .flatMap((scene) => allTracks(scene.tracks))
    .filter((track) => track.id !== 'opencut-main' || track.elements.length > 0)
    .map((track) => ({
      id: track.id,
      name: track.name,
      hidden: 'hidden' in track ? track.hidden : false,
      muted: 'muted' in track ? track.muted : false,
      elements: track.elements.map((item) => {
        const original =
          originals.get(item.id) ??
          ('mediaId' in item && item.mediaId.startsWith('source-')
            ? originals.get(item.mediaId.slice(7))
            : undefined);
        const base = {
          id: item.id,
          sourceFrom: frame(item.trimStart, fps),
          from: frame(item.startTime, fps),
          durationInFrames: Math.max(1, frame(item.duration, fps)),
          transform: {
            x: Number(item.params['transform.positionX'] ?? 0),
            y: Number(item.params['transform.positionY'] ?? 0),
            scale: Number(item.params['transform.scaleX'] ?? 1),
            rotation: Number(item.params['transform.rotate'] ?? 0),
            opacity: Number(item.params['opacity'] ?? 1),
          },
        };
        const asset = 'mediaId' in item ? assets.get(item.mediaId) : undefined;
        let element: Element;
        if (original && needsSourcePreview(original)) {
          element = { ...original, ...base };
        } else if (item.type === 'text') {
          element = {
            ...original,
            ...base,
            type: 'text',
            content: String(item.params['content'] ?? ''),
            fontSize:
              Math.round(
                ((Number(item.params['fontSize'] ?? 48) * native.settings.canvasSize.height) /
                  FONT_SIZE_SCALE_REFERENCE) *
                  1000,
              ) / 1000,
            fontFamily: String(item.params['fontFamily'] ?? 'Inter'),
            color: String(item.params['color'] ?? '#ffffff'),
          };
        } else if (item.type === 'video' || item.type === 'image') {
          if (!asset?.url) {
            throw new Error('Media is not saved. Wait for import to finish.');
          }
          element =
            item.type === 'video'
              ? {
                  ...original,
                  ...base,
                  type: 'video',
                  src: asset.url,
                  sourceFrom: frame(item.trimStart, fps),
                }
              : { ...original, ...base, type: 'image', src: asset.url };
        } else if (item.type === 'audio') {
          const src = item.sourceType === 'library' ? item.sourceUrl : asset?.url;
          if (!src) {
            throw new Error('Audio is not saved. Wait for import to finish.');
          }
          element = {
            ...original,
            ...base,
            type: 'audio',
            src,
            volume: Math.max(0, Math.min(1, 10 ** (Number(item.params['volume'] ?? 0) / 20))),
            role: original?.type === 'audio' ? original.role : 'effect',
            playbackRate: item.retime?.rate ?? 1,
          };
        } else {
          element = {
            ...base,
            type: 'shape',
            kind: item.type === 'graphic' && item.definitionId === 'ellipse' ? 'ellipse' : 'rect',
            color: String(item.params['fill'] ?? '#ffffff'),
            width: fit * Math.abs(Number(item.params['transform.scaleX'] ?? 1)),
            height: fit * Math.abs(Number(item.params['transform.scaleY'] ?? 1)),
            radius:
              (Number(item.params['cornerRadius'] ?? 0) / 100) *
              fit *
              Math.min(
                Math.abs(Number(item.params['transform.scaleX'] ?? 1)),
                Math.abs(Number(item.params['transform.scaleY'] ?? 1)),
              ),
            transform: { ...base.transform, scale: 1 },
          };
        }
        return {
          ...element,
          opencut: JSON.stringify(item),
        };
      }),
    }));
  const next: Project = {
    ...source,
    width: native.settings.canvasSize.width,
    height: native.settings.canvasSize.height,
    fps: Math.max(1, Math.round(fps)),
    background:
      native.settings.background.type === 'color'
        ? native.settings.background.color
        : source.background,
    durationInFrames: Math.max(1, frame(native.metadata.duration, fps)),
    tracks,
  };
  next.opencut = undefined;
  return next;
}
export const nativeTime = time;
export const nativeTracks = allTracks;
