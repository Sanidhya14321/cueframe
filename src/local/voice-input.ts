import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { ffmpegPath, runProcess } from './audio';
import { setupWhisper } from './whisper-setup';

export const transcribeSpeech = async (audio: Uint8Array): Promise<string> => {
  const engine = await setupWhisper(() => Promise.resolve());
  const folder = await mkdtemp(join(tmpdir(), 'cueframe-voice-'));
  try {
    const source = join(folder, 'speech.input');
    const wav = join(folder, 'speech.wav');
    const output = join(folder, 'speech');
    await writeFile(source, audio);
    await runProcess(ffmpegPath(), [
      '-v',
      'error',
      '-y',
      '-i',
      source,
      '-ac',
      '1',
      '-ar',
      '16000',
      '-c:a',
      'pcm_s16le',
      wav,
    ]);
    await runProcess(engine.binary, ['-m', engine.model, '-f', wav, '-nt', '-otxt', '-of', output]);
    return (await readFile(`${output}.txt`, 'utf8')).replace(/\s+/g, ' ').trim();
  } finally {
    await rm(folder, { recursive: true, force: true });
  }
};
