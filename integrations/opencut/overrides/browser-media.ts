/* biome-ignore-all lint/performance/noAwaitInLoops: media decoding and seeking must execute sequentially */
export type VideoCodec = string;
export const ALL_FORMATS: readonly string[] = [];
export class BlobSource {
  blob: Blob;
  constructor(blob: Blob) {
    this.blob = blob;
  }
}
export type WrappedCanvas = { canvas: HTMLCanvasElement; timestamp: number; duration: number };
const waitFor = (target: EventTarget, success: string) =>
  new Promise<void>((resolve, reject) => {
    const done = () => {
      cleanup();
      resolve();
    };
    const fail = () => {
      cleanup();
      reject(new Error('This browser cannot decode this media file'));
    };
    const timeout = setTimeout(fail, 15000);
    const cleanup = () => {
      clearTimeout(timeout);
      target.removeEventListener(success, done);
      target.removeEventListener('error', fail);
    };
    target.addEventListener(success, done, { once: true });
    target.addEventListener('error', fail, { once: true });
  });
class Track {
  codec = null;
  input: Input;
  constructor(input: Input) {
    this.input = input;
  }
  get displayWidth() {
    return this.input.video.videoWidth;
  }
  get displayHeight() {
    return this.input.video.videoHeight;
  }
  canDecode() {
    return Promise.resolve(this.displayWidth > 0);
  }
  computePacketStats() {
    return Promise.resolve({ averagePacketRate: Number.NaN });
  }
}
export class Input {
  video = document.createElement('video');
  url: string;
  ready: Promise<void>;
  private audio: Promise<AudioBuffer> | null = null;
  options: { source: BlobSource; formats: unknown };
  constructor(options: { source: BlobSource; formats: unknown }) {
    this.options = options;
    this.url = URL.createObjectURL(options.source.blob);
    this.video.muted = true;
    this.video.playsInline = true;
    this.video.preload = 'auto';
    this.ready = waitFor(this.video, 'loadeddata');
    this.video.src = this.url;
  }
  async computeDuration() {
    await this.ready;
    return this.video.duration;
  }
  async getPrimaryVideoTrack() {
    await this.ready;
    return this.video.videoWidth ? new Track(this) : null;
  }
  decodeAudio() {
    if (!this.audio) {
      this.audio = (async () => {
        const context = new AudioContext();
        try {
          return await context.decodeAudioData(await this.options.source.blob.arrayBuffer());
        } finally {
          await context.close();
        }
      })();
    }
    return this.audio;
  }
  async getPrimaryAudioTrack() {
    try {
      await this.decodeAudio();
      return new Track(this);
    } catch {
      return null;
    }
  }
  dispose() {
    this.video.pause();
    this.video.removeAttribute('src');
    this.video.load();
    URL.revokeObjectURL(this.url);
  }
}
export class CanvasSink {
  track: Track;
  constructor(track: Track, _options?: unknown) {
    this.track = track;
  }
  async *canvases(startTime = 0): AsyncGenerator<WrappedCanvas> {
    const video = this.track.input.video;
    await this.track.input.ready;
    let time = startTime;
    while (time < video.duration) {
      const target = Math.min(time, Math.max(0, video.duration - 0.001));
      if (Math.abs(video.currentTime - target) > 0.00001) {
        const seeked = waitFor(video, 'seeked');
        video.currentTime = target;
        await seeked;
      }
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas.getContext('2d')?.drawImage(video, 0, 0);
      yield { canvas, timestamp: time, duration: 1 / 30 };
      time += 1 / 30;
    }
  }
}
export class VideoSampleSink {
  track: Track;
  constructor(track: Track) {
    this.track = track;
  }
  async getSample(time: number) {
    const frame = (
      await new CanvasSink(this.track)
        .canvases(Math.min(time, this.track.input.video.duration / 2))
        .next()
    ).value;
    return frame
      ? {
          draw: (
            context: CanvasRenderingContext2D,
            x: number,
            y: number,
            width: number,
            height: number,
          ) => context.drawImage(frame.canvas, x, y, width, height),
          close: () => undefined,
        }
      : null;
  }
}
export class AudioBufferSink {
  track: Track;
  constructor(track: Track) {
    this.track = track;
  }
  async *buffers(time = 0) {
    const source = await this.track.input.decodeAudio();
    const size = Math.round(source.sampleRate / 4);
    for (
      let offset = Math.floor(time * source.sampleRate);
      offset < source.length;
      offset += size
    ) {
      const buffer = new AudioBuffer({
        numberOfChannels: source.numberOfChannels,
        length: Math.min(size, source.length - offset),
        sampleRate: source.sampleRate,
      });
      for (let channel = 0; channel < source.numberOfChannels; channel++) {
        buffer.copyToChannel(
          source.getChannelData(channel).subarray(offset, offset + size),
          channel,
        );
      }
      yield { buffer, timestamp: offset / source.sampleRate };
    }
  }
}
