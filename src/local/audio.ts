import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { repoRoot } from '@/lib/repo-root';

export const ffmpegPath = () => {
  const bundled = join(
    repoRoot(),
    'node_modules',
    `@remotion/compositor-${process.platform}-${process.arch}`,
    'ffmpeg',
  );
  return existsSync(bundled) ? bundled : 'ffmpeg';
};
export const runProcess = (command: string, args: string[], timeout = 120000): Promise<Buffer> =>
  new Promise((resolve, reject) => {
    const toolEnvironment = {
      // biome-ignore lint/style/noProcessEnv: native tools inherit the local runtime
      ...process.env,
      ...(process.platform === 'darwin' && /\/ff(mpeg|probe)$/.test(command)
        ? { DYLD_LIBRARY_PATH: dirname(command) }
        : {}),
    };
    const child = spawn(command, args, { stdio: ['ignore', 'pipe', 'pipe'], env: toolEnvironment });
    const chunks: Buffer[] = [];
    let size = 0;
    const timer = setTimeout(() => {
      child.kill();
      reject(new Error('The local media task timed out.'));
    }, timeout);
    child.stdout.on('data', (data: Buffer) => {
      size += data.length;
      if (size > 128 * 1024 * 1024) {
        child.kill();
        reject(new Error('Media output is too large.'));
      } else {
        chunks.push(data);
      }
    });
    child.stderr.on('data', () => undefined);
    child.on('error', () => {
      clearTimeout(timer);
      reject(new Error('A required local media tool is missing.'));
    });
    child.on('close', (code) => {
      clearTimeout(timer);
      code === 0
        ? resolve(Buffer.concat(chunks))
        : reject(new Error('The local media tool could not process this file.'));
    });
  });
const wavSamples = (data: Buffer): Buffer => {
  let offset = 12;
  while (offset + 8 <= data.length) {
    const name = data.toString('ascii', offset, offset + 4);
    const size = data.readUInt32LE(offset + 4);
    if (name === 'data') {
      return data.subarray(offset + 8, Math.min(data.length, offset + 8 + size));
    }
    offset += 8 + size + (size % 2);
  }
  throw new Error('The local audio converter produced invalid WAV data.');
};
export const pcmAudio = async (file: string): Promise<Buffer> =>
  wavSamples(
    await runProcess(ffmpegPath(), [
      '-v',
      'error',
      '-i',
      file,
      '-f',
      'wav',
      '-c:a',
      'pcm_s16le',
      '-ac',
      '1',
      '-ar',
      '11025',
      'pipe:1',
    ]),
  );

export const estimateTempo = (pcm: Buffer): number => {
  const rate = 11025;
  const step = 220;
  const energy: number[] = [];
  for (let index = 0; index + step * 2 < pcm.length; index += step * 2) {
    let sum = 0;
    for (let sample = 0; sample < step; sample++) {
      sum += Math.abs(pcm.readInt16LE(index + sample * 2));
    }
    energy.push(sum / step);
  }
  let best = 128;
  let peak = Number.NEGATIVE_INFINITY;
  for (let bpm = 85; bpm <= 165; bpm++) {
    const lag = Math.round(((rate / step) * 60) / bpm);
    let score = 0;
    for (let index = lag; index < energy.length; index++) {
      score += (energy[index] ?? 0) * (energy[index - lag] ?? 0);
    }
    if (score > peak) {
      best = bpm;
      peak = score;
    }
  }
  return best;
};
export const synthesizeSound = (
  seconds: number,
  bpm: number,
  kind: 'bed' | 'whoosh' | 'hit',
  dropAt = (seconds * 2) / 3,
): Buffer => {
  const rate = 11025;
  const count = Math.ceil(seconds * rate);
  const data = Buffer.alloc(44 + count * 2);
  data.write('RIFF');
  data.writeUInt32LE(data.length - 8, 4);
  data.write('WAVEfmt ', 8);
  data.writeUInt32LE(16, 16);
  data.writeUInt16LE(1, 20);
  data.writeUInt16LE(1, 22);
  data.writeUInt32LE(rate, 24);
  data.writeUInt32LE(rate * 2, 28);
  data.writeUInt16LE(2, 32);
  data.writeUInt16LE(16, 34);
  data.write('data', 36);
  data.writeUInt32LE(count * 2, 40);
  let seed = 7;
  for (let index = 0; index < count; index++) {
    const t = index / rate;
    const beat = t % (60 / bpm);
    seed = (seed * 1664525 + 1013904223) >>> 0;
    const noise = (seed / 4294967296) * 2 - 1;
    const sample =
      kind === 'bed'
        ? Math.sin(2 * Math.PI * (55 + 60 * Math.exp(-beat * 35)) * beat) *
            Math.exp(-beat * 18) *
            0.5 +
          noise * Math.exp(-(t % (30 / bpm)) * 100) * 0.1
        : kind === 'whoosh'
          ? noise * Math.sin((Math.PI * t) / seconds) * 0.3
          : Math.sin(2 * Math.PI * 70 * t) * Math.exp(-t * 20) * 0.8;
    const beatDrop =
      kind === 'bed' && t >= dropAt - 60 / bpm && t < dropAt
        ? 0.12
        : kind === 'bed' && t >= dropAt
          ? 1.35
          : 1;
    data.writeInt16LE(
      Math.round(Math.max(-1, Math.min(1, sample * beatDrop)) * 24000),
      44 + index * 2,
    );
  }
  return data;
};
