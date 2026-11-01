import { useEffect } from 'react';
import { useEditor } from '@/editor/use-editor';
import { mediaTimeFromSeconds, TICKS_PER_SECOND } from '@/wasm';
import { nativeTracks } from './project-bridge';
export function HostContext() {
  const editor = useEditor();
  useEffect(() => {
    const notify = () => {
      const project = editor.project.getActive();
      const fps = project.settings.fps.numerator / project.settings.fps.denominator;
      window.parent.postMessage(
        {
          type: 'cueframe-context',
          selectedId: editor.selection.getSelectedElements()[0]?.elementId ?? null,
          frame: Math.round((editor.playback.getCurrentTime() / TICKS_PER_SECOND) * fps),
        },
        location.origin,
      );
    };
    const selection = editor.selection.subscribe(notify);
    const playback = editor.playback.onUpdate(notify);
    // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: origin-checked host selection and seek messages validate their independent payloads
    const receive = (event: MessageEvent<unknown>) => {
      if (event.origin !== location.origin || event.source !== window.parent) {
        return;
      }
      const data = event.data;
      if (!(data && typeof data === 'object' && 'type' in data)) {
        return;
      }
      if (data.type === 'cueframe-focus' && 'id' in data && typeof data.id === 'string') {
        const track = nativeTracks(editor.scenes.getActiveScene().tracks).find((candidate) =>
          candidate.elements.some((item) => item.id === data.id),
        );
        if (track) {
          editor.selection.setSelectedElements({
            elements: [{ trackId: track.id, elementId: data.id }],
          });
        }
      }
      if (
        data.type === 'cueframe-seek' &&
        'frame' in data &&
        typeof data.frame === 'number' &&
        Number.isFinite(data.frame)
      ) {
        const fps = editor.project.getActive().settings.fps;
        editor.playback.seek({
          time: mediaTimeFromSeconds({
            seconds: (Math.max(0, data.frame) * fps.denominator) / fps.numerator,
          }),
        });
      }
    };
    window.addEventListener('message', receive);
    notify();
    return () => {
      selection();
      playback();
      window.removeEventListener('message', receive);
    };
  }, [editor]);
  return null;
}
