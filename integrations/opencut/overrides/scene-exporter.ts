/* biome-ignore-all lint/performance/noAwaitInLoops: encoder queues and timeline frames must be processed in order */
import EventEmitter from 'eventemitter3';
import { Muxer as Mp4Muxer, ArrayBufferTarget as Mp4Target } from 'mp4-muxer';
import type { FrameRate } from 'opencut-wasm';
import { Muxer as WebmMuxer, ArrayBufferTarget as WebmTarget } from 'webm-muxer';
import { CanvasRenderer } from '@/services/renderer/canvas-renderer';
import type { RootNode } from '@/services/renderer/nodes/root-node';
import { TICKS_PER_SECOND } from '@/wasm';

type ExportParams = {
  width: number;
  height: number;
  fps: FrameRate;
  format: 'mp4' | 'webm';
  quality: string;
  shouldIncludeAudio?: boolean;
  audioBuffer?: AudioBuffer;
};
export type SceneExporterEvents = {
  progress: [number];
  complete: [ArrayBuffer];
  error: [Error];
  cancelled: [];
};
export class SceneExporter extends EventEmitter<SceneExporterEvents> {
  private renderer: CanvasRenderer;
  private cancelled = false;
  private options: ExportParams;
  constructor(options: ExportParams) {
    super();
    this.options = options;
    this.renderer = new CanvasRenderer(options);
  }
  cancel() {
    this.cancelled = true;
  }
  // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: export owns muxer and encoder cleanup in a single transaction
  async export({ rootNode }: { rootNode: RootNode }): Promise<ArrayBuffer | null> {
    const { width, height, fps, format, quality, audioBuffer, shouldIncludeAudio } = this.options;
    const rate = fps.numerator / fps.denominator;
    const count = Math.ceil((rootNode.duration / TICKS_PER_SECOND) * rate);
    const withAudio = shouldIncludeAudio && audioBuffer;
    const target = format === 'mp4' ? new Mp4Target() : new WebmTarget();
    const config = {
      target,
      video: { codec: format === 'mp4' ? 'avc' : 'V_VP9', width, height, frameRate: rate },
      ...(withAudio
        ? {
            audio: {
              codec: format === 'mp4' ? 'aac' : 'A_OPUS',
              numberOfChannels: audioBuffer.numberOfChannels,
              sampleRate: audioBuffer.sampleRate,
            },
          }
        : {}),
      firstTimestampBehavior: 'offset',
    };
    const muxer =
      format === 'mp4'
        ? new Mp4Muxer({ ...config, fastStart: 'in-memory' } as ConstructorParameters<
            typeof Mp4Muxer
          >[0])
        : new WebmMuxer(config as ConstructorParameters<typeof WebmMuxer>[0]);
    let failure: Error | null = null;
    const encoder = new VideoEncoder({
      output: (chunk, metadata) => {
        try {
          muxer.addVideoChunk(chunk, metadata);
        } catch (error) {
          failure = error instanceof Error ? error : new Error('Video muxing failed');
        }
      },
      error: (error) => {
        failure = error;
      },
    });
    const bitrate =
      (
        { low: 1_000_000, medium: 4_000_000, high: 8_000_000, very_high: 16_000_000 } as Record<
          string,
          number
        >
      )[quality] ?? 8_000_000;
    const videoConfig = {
      codec: format === 'mp4' ? 'avc1.420034' : 'vp09.00.10.08',
      width,
      height,
      bitrate,
      framerate: rate,
      latencyMode: 'realtime' as const,
    };
    if (!(await VideoEncoder.isConfigSupported(videoConfig)).supported) {
      throw new Error('This browser cannot encode this format. Choose WebM or use Chrome.');
    }
    encoder.configure(videoConfig);
    try {
      if (withAudio) {
        const audio = new AudioEncoder({
          output: (chunk, metadata) => {
            try {
              muxer.addAudioChunk(chunk, metadata);
            } catch (error) {
              failure = error instanceof Error ? error : new Error('Audio muxing failed');
            }
          },
          error: (error) => {
            failure = error;
          },
        });
        const audioConfig = {
          codec: format === 'mp4' ? 'mp4a.40.2' : 'opus',
          sampleRate: audioBuffer.sampleRate,
          numberOfChannels: audioBuffer.numberOfChannels,
          bitrate: 192000,
        };
        if (!(await AudioEncoder.isConfigSupported(audioConfig)).supported) {
          throw new Error('This browser cannot encode audio in this format. Choose WebM.');
        }
        audio.configure(audioConfig);
        for (let offset = 0; offset < audioBuffer.length; offset += 4096) {
          const length = Math.min(4096, audioBuffer.length - offset);
          const data = new Float32Array(length * audioBuffer.numberOfChannels);
          for (let channel = 0; channel < audioBuffer.numberOfChannels; channel++) {
            data.set(
              audioBuffer.getChannelData(channel).subarray(offset, offset + length),
              channel * length,
            );
          }
          const frame = new AudioData({
            format: 'f32-planar',
            sampleRate: audioBuffer.sampleRate,
            numberOfFrames: length,
            numberOfChannels: audioBuffer.numberOfChannels,
            timestamp: Math.round((offset / audioBuffer.sampleRate) * 1e6),
            data,
          });
          audio.encode(frame);
          frame.close();
          if (audio.encodeQueueSize > 8) {
            await new Promise<void>((resolve) =>
              audio.addEventListener('dequeue', () => resolve(), { once: true }),
            );
          }
        }
        await audio.flush();
        audio.close();
      }
      for (let index = 0; index < count; index++) {
        if (this.cancelled) {
          this.emit('cancelled');
          return null;
        }
        if (failure) {
          throw failure;
        }
        await this.renderer.render({
          node: rootNode,
          time: Math.round((index / rate) * TICKS_PER_SECOND),
        });
        const frame = new VideoFrame(this.renderer.getOutputCanvas(), {
          timestamp: Math.round((index / rate) * 1e6),
          duration: Math.round(1e6 / rate),
        });
        encoder.encode(frame, { keyFrame: index % Math.round(rate * 2) === 0 });
        frame.close();
        if (encoder.encodeQueueSize > 4) {
          await new Promise<void>((resolve) =>
            encoder.addEventListener('dequeue', () => resolve(), { once: true }),
          );
        }
        this.emit('progress', (index + 1) / count);
      }
      await encoder.flush();
      if (failure) {
        throw failure;
      }
      muxer.finalize();
      const buffer = target.buffer;
      this.emit('complete', buffer);
      return buffer;
    } finally {
      encoder.close();
    }
  }
}
