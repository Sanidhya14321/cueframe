/* biome-ignore-all lint/performance/noAwaitInLoops: items commit in timeline order */
import { commitAction, readProject } from '@/local/projects';
import { recommendClips } from '@/mcp/clip-recommend';
import { orientationOf } from '@/mcp/clip-search';
import { createCompositionElement, createTrack } from '@/project';
import { getClipDefaults, isClipId } from '@/schemas';

export const composeFromBrief = async (projectId: string, brief: string, actor: string) => {
  const { project } = await readProject(projectId);
  const steps = await recommendClips(brief, { orientation: orientationOf(project) });
  const clips = steps.flatMap(({ clip, role }) =>
    clip && isClipId(clip.id) ? [{ id: clip.id, role }] : [],
  );
  const track = project.tracks[0] ?? createTrack('Clips');
  if (!project.tracks[0]) {
    await commitAction(
      projectId,
      { type: 'patch', operations: [{ op: 'add', path: '/tracks/0', value: track }] },
      { actor, label: 'Add clips track' },
    );
  }
  const duration = Math.floor(project.durationInFrames / Math.max(1, clips.length));
  const items: { id: string; clipId: string; role: string; from: number }[] = [];
  for (const [index, clip] of clips.entries()) {
    const from = index * duration;
    const element = createCompositionElement(clip.id, getClipDefaults(clip.id), {
      from,
      durationInFrames: duration,
    });
    await commitAction(
      projectId,
      { type: 'add-item', trackId: track.id, element },
      { actor, label: `${clip.role}: ${clip.id}` },
    );
    items.push({ id: element.id, clipId: clip.id, role: clip.role, from });
  }
  return { projectId, items };
};
