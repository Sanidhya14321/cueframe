import { useEditor } from '@/editor/use-editor';
import { TICKS_PER_SECOND } from '@/wasm';
import { nativeTracks } from './project-bridge';

const clock = (seconds: number) =>
  `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, '0')}`;
export function ScenesView() {
  const editor = useEditor((e) => e);
  useEditor((e) => e.scenes.getActiveSceneOrNull()?.tracks);
  const tracks = editor.scenes.getActiveSceneOrNull()?.tracks;
  const items = (tracks ? nativeTracks(tracks) : [])
    .flatMap((track) => track.elements.map((element) => ({ track, element })))
    .toSorted((a, b) => a.element.startTime - b.element.startTime);
  if (items.length === 0) {
    return <p className="native-scenes">Add something to the timeline to list it here.</p>;
  }
  return (
    <nav className="native-scenes" aria-label="Scene index">
      {items.map(({ track, element }) => (
        <button
          type="button"
          key={element.id}
          onClick={() => {
            editor.playback.seek({ time: element.startTime });
            editor.selection.setSelectedElements({
              elements: [{ trackId: track.id, elementId: element.id }],
            });
          }}
        >
          <span>{element.name}</span>
          <span>{clock(element.startTime / TICKS_PER_SECOND)}</span>
        </button>
      ))}
    </nav>
  );
}
