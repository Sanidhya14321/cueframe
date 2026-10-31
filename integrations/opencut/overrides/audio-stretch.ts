import type { RetimeConfig } from '@/timeline/types';
export function renderRetimedBuffer({
  audioContext,
  sourceBuffer,
  trimStart,
  clipDuration,
  retime,
}: {
  audioContext: BaseAudioContext;
  sourceBuffer: AudioBuffer;
  trimStart: number;
  clipDuration: number;
  retime?: RetimeConfig;
  maintainPitch?: boolean;
}): Promise<AudioBuffer> {
  const output = audioContext.createBuffer(
    sourceBuffer.numberOfChannels,
    Math.max(1, Math.ceil(clipDuration * audioContext.sampleRate)),
    audioContext.sampleRate,
  );
  const rate = retime?.rate ?? 1;
  for (let channel = 0; channel < output.numberOfChannels; channel++) {
    const input = sourceBuffer.getChannelData(channel);
    const target = output.getChannelData(channel);
    for (let index = 0; index < target.length; index++) {
      const position = (trimStart + (index * rate) / output.sampleRate) * sourceBuffer.sampleRate;
      const lower = Math.floor(position);
      target[index] =
        (input[lower] ?? 0) * (1 - position + lower) + (input[lower + 1] ?? 0) * (position - lower);
    }
  }
  return Promise.resolve(output);
}
