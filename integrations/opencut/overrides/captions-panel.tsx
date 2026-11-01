import { type ChangeEvent, useState } from 'react';
import { EditorCore } from '@/core';
import { insertCaptionChunksAsTextTrack } from '@/subtitles/insert';
import { parseSubtitleFile } from '@/subtitles/parse';

export function CaptionsView() {
  const [message, setMessage] = useState('');
  const load = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) {
      return;
    }
    const result = parseSubtitleFile({ fileName: file.name, input: await file.text() });
    const track = insertCaptionChunksAsTextTrack({
      editor: EditorCore.getInstance(),
      captions: result.captions,
    });
    setMessage(
      track
        ? `Imported ${result.captions.length} captions as editable text.`
        : 'No captions were found. Choose an SRT or ASS file with timed lines.',
    );
  };
  return (
    <div className="native-library">
      <label>
        Import SRT or ASS captions
        <input type="file" accept=".srt,.ass" onChange={load} />
      </label>
      <p role="status">{message}</p>
    </div>
  );
}
