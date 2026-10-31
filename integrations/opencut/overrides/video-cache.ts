import { ALL_FORMATS, BlobSource, CanvasSink, Input } from './browser-media';

class VideoCache {
  private entries = new Map<string, Promise<Input>>();
  private chains = new Map<string, Promise<unknown>>();
  getFrameAt({ mediaId, file, time }: { mediaId: string; file: File; time: number }) {
    let input = this.entries.get(mediaId);
    if (!input) {
      input = Promise.resolve(new Input({ source: new BlobSource(file), formats: ALL_FORMATS }));
      this.entries.set(mediaId, input);
    }
    const pending = input;
    const task = (this.chains.get(mediaId) ?? Promise.resolve())
      .catch(() => undefined)
      .then(async () => {
        const source = await pending;
        const track = await source.getPrimaryVideoTrack();
        if (!track) {
          return null;
        }
        const iterator = new CanvasSink(track).canvases(time);
        const frame = await iterator.next();
        await iterator.return(undefined);
        return frame.value ?? null;
      });
    this.chains.set(mediaId, task);
    return task;
  }
  clearVideo({ mediaId }: { mediaId: string }) {
    this.entries
      .get(mediaId)
      ?.then((input) => input.dispose())
      .catch(() => undefined);
    this.entries.delete(mediaId);
    this.chains.delete(mediaId);
  }
  clearAll() {
    for (const mediaId of this.entries.keys()) {
      this.clearVideo({ mediaId });
    }
  }
  getStats() {
    return { totalSinks: this.entries.size, activeSinks: this.entries.size, cachedFrames: 0 };
  }
}
export const videoCache = new VideoCache();
