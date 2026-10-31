/* biome-ignore-all lint/complexity/useLiteralKeys: native records require indexed access under strict TypeScript */
import { type DragEvent, useEffect, useState } from 'react';
import { EditorCore } from '@/core';
import { useEditor } from '@/editor/use-editor';
import { TICKS_PER_SECOND } from '@/wasm';
import { canonicalSource, report } from './storage';

type LibraryClip = { id: string; title: string; category: string; still: string };
const CLIP_DRAG = 'application/x-clipkit-clip';
const PIXELS_PER_SECOND = 50;

const projectId = new URLSearchParams(location.search).get('project') ?? '';
async function addLibraryClip(clipId: string, seconds: number) {
  await EditorCore.getInstance().save.flush();
  report('Adding animation');
  const response = await fetch(`/api/projects/${projectId}/library`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      clipId,
      start: Math.max(0, Math.round(seconds * canonicalSource().project.fps)),
    }),
  });
  if (!response.ok) {
    throw new Error('Could not add this animation');
  }
}
const add = (clipId: string, seconds: number) => {
  addLibraryClip(clipId, seconds).catch((error) =>
    report(error instanceof Error ? error.message : 'Could not add this animation'),
  );
};
const dropSeconds = (clientX: number) => {
  const scroll = document.querySelector<HTMLElement>('[data-clipkit-timeline-zoom]');
  const zoom = Number(scroll?.dataset['clipkitTimelineZoom']);
  if (!(scroll && zoom > 0)) {
    return 0;
  }
  const left = clientX - scroll.getBoundingClientRect().left + scroll.scrollLeft;
  return Math.max(0, left / (PIXELS_PER_SECOND * zoom));
};
export const libraryDropTarget = {
  onDragOverCapture: (event: DragEvent) => {
    if (event.dataTransfer.types.includes(CLIP_DRAG)) {
      event.preventDefault();
      event.stopPropagation();
      event.dataTransfer.dropEffect = 'copy';
    }
  },
  onDropCapture: (event: DragEvent) => {
    const clipId = event.dataTransfer.getData(CLIP_DRAG);
    if (clipId) {
      event.preventDefault();
      event.stopPropagation();
      add(clipId, dropSeconds(event.clientX));
    }
  },
};
export function LibraryView() {
  const editor = useEditor();
  const [clips, setClips] = useState<LibraryClip[] | null>(null);
  const [problem, setProblem] = useState('');
  const [query, setQuery] = useState('');
  useEffect(() => {
    fetch('/api/library')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Could not load the library');
        }
        return response.json();
      })
      .then((result: { clips: LibraryClip[] }) => setClips(result.clips))
      .catch((error: Error) => setProblem(error.message));
  }, []);
  const term = query.trim().toLowerCase();
  const shown = clips?.filter((clip) =>
    `${clip.title} ${clip.category}`.toLowerCase().includes(term),
  );
  return (
    <div className="native-library">
      <input
        aria-label="Search library"
        placeholder="Search library"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
      />
      {problem ? <p role="alert">{problem}</p> : null}
      {shown ? null : problem ? null : <p role="status">Loading library</p>}
      {shown?.length === 0 ? <p role="status">No animations match this search.</p> : null}
      <div className="native-library-grid">
        {shown?.map((clip) => (
          // biome-ignore lint/a11y/noNoninteractiveElementInteractions: dragging mirrors the keyboard-reachable Add button
          <article
            key={clip.id}
            draggable={true}
            onDragStart={(event) => {
              event.dataTransfer.setData(CLIP_DRAG, clip.id);
              event.dataTransfer.effectAllowed = 'copy';
            }}
          >
            {/* biome-ignore lint/performance/noImgElement: the static runtime has no image optimizer */}
            <img src={clip.still} alt="" loading="lazy" />
            <span>{clip.title}</span>
            <button
              type="button"
              aria-label={`Add ${clip.title} at playhead`}
              onClick={() => add(clip.id, editor.playback.getCurrentTime() / TICKS_PER_SECOND)}
            >
              Add
            </button>
          </article>
        ))}
      </div>
    </div>
  );
}
