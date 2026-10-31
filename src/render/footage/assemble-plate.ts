import { copyFileSync, mkdirSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { $ } from 'bun';
import { type FootageSpec, PLATE_STAMP, type PlateSegment } from '@/footage/footage-spec';
import { plateFile, publishDir, shotFile } from './footage-paths';

const frameName = (index: number) => `${String(index + 1).padStart(5, '0')}.png`;

const segmentFrames = ({ from, to, step = 1 }: PlateSegment): number[] => {
  const direction = to >= from ? 1 : -1;
  const count = Math.floor(Math.abs(to - from) / step) + 1;
  return Array.from({ length: count }, (_, index) => from + direction * index * step);
};

const stampFilter = (spec: FootageSpec): string => {
  const block = spec.width / PLATE_STAMP.bits;
  const boxes = Array.from(
    { length: PLATE_STAMP.bits },
    (_, bit) =>
      `drawbox=x=${bit * block}:y=${spec.height}:w=${block}:h=${PLATE_STAMP.rows}:color=white:t=fill:enable='eq(mod(floor(n/${2 ** bit}),2),1)'`,
  );
  return [`pad=iw:ih+${PLATE_STAMP.rows}:0:0:black`, ...boxes].join(',');
};

type PlateFrame = {
  shot: string;
  frame: number;
  blend?: { shot: string; frame: number; weight: number };
};

export const plateFrameOrder = (spec: FootageSpec): PlateFrame[] =>
  spec.plate.reduce<PlateFrame[]>((order, segment) => {
    const frames = segmentFrames(segment).map((frame) => ({ shot: segment.shot, frame }));
    const overlap = Math.min(segment.blend ?? 0, order.length, frames.length);
    const blended = order.slice(order.length - overlap).map((entry, at) => {
      const incoming = frames[at] as PlateFrame;
      return { ...entry, blend: { ...incoming, weight: (at + 1) / (overlap + 1) } };
    });
    return [...order.slice(0, order.length - overlap), ...blended, ...frames.slice(overlap)];
  }, []);

export const assemblePlate = async (spec: FootageSpec): Promise<void> => {
  const work = mkdtempSync(join(tmpdir(), `${spec.id}-plate-`));
  try {
    const shots = [...new Set(spec.plate.map((segment) => segment.shot))];
    for (const shot of shots) {
      mkdirSync(join(work, shot));
      const fit = `scale=${spec.width}:-2:flags=lanczos,crop=${spec.width}:${spec.height}`;
      await $`ffmpeg -v error -i ${shotFile(spec, shot)} -vf ${fit} ${join(work, shot, '%05d.png')}`;
    }
    const sequence = join(work, 'sequence');
    mkdirSync(sequence);
    for (const [index, { shot, frame, blend }] of plateFrameOrder(spec).entries()) {
      const target = join(sequence, frameName(index));
      if (blend === undefined) {
        copyFileSync(join(work, shot, frameName(frame)), target);
      } else {
        const mix = `blend=all_expr='A*${(1 - blend.weight).toFixed(4)}+B*${blend.weight.toFixed(4)}'`;
        await $`ffmpeg -v error -y -i ${join(work, shot, frameName(frame))} -i ${join(work, blend.shot, frameName(blend.frame))} -filter_complex ${mix} ${target}`;
      }
    }
    mkdirSync(publishDir(spec), { recursive: true });
    await $`ffmpeg -v error -y -framerate ${spec.fps} -i ${join(sequence, '%05d.png')} -vf ${stampFilter(spec)} -c:v libx264 -preset slow -crf 18 -pix_fmt yuv420p -movflags +faststart ${plateFile(spec)}`;
  } finally {
    rmSync(work, { recursive: true, force: true });
  }
};
