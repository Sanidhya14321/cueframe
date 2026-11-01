import { afterEach, describe, expect, it, mock } from 'bun:test';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { ExportVideo } from '@/components/video/export-video';

const realFetch = globalThis.fetch;
const job = (status: string, extra = {}) =>
  Response.json({ id: 'job', status, progress: 0.1, label: status, ...extra });
const stubFetch = (replies: (() => Promise<Response>)[]) => {
  const calls: string[] = [];
  globalThis.fetch = mock((url: string) => {
    calls.push(url);
    const reply = replies.shift();
    return reply ? reply() : Promise.resolve(job('working'));
  }) as unknown as typeof fetch;
  return calls;
};

afterEach(() => {
  globalThis.fetch = realFetch;
});

describe('ExportVideo', () => {
  it('does not start a render when saving the edits fails', async () => {
    const calls = stubFetch([]);
    const checkpoint = mock(() => Promise.reject(new Error('The video editor could not save.')));
    render(<ExportVideo projectId="abc" checkpoint={checkpoint} />);
    fireEvent.click(screen.getByRole('button', { name: 'Export' }));
    expect(await screen.findByRole('alert')).toHaveTextContent('The video editor could not save.');
    expect(calls).toEqual([]);
    expect(screen.getByRole('button', { name: 'Export' })).toBeEnabled();
  });

  it('saves before it starts the render', async () => {
    const order: string[] = [];
    globalThis.fetch = mock(() => {
      order.push('render');
      return Promise.resolve(job('working'));
    }) as unknown as typeof fetch;
    const checkpoint = mock(() => {
      order.push('checkpoint');
      return Promise.resolve();
    });
    render(<ExportVideo projectId="abc" checkpoint={checkpoint} />);
    fireEvent.click(screen.getByRole('button', { name: 'Export' }));
    await waitFor(() => expect(order).toEqual(['checkpoint', 'render']));
  });

  it('keeps polling after one failed status read and finishes the export', async () => {
    const click = mock();
    const anchor = HTMLAnchorElement.prototype.click;
    HTMLAnchorElement.prototype.click = click;
    const calls = stubFetch([
      () => Promise.resolve(job('working')),
      () => Promise.reject(new Error('offline')),
      () =>
        Promise.resolve(
          job('done', { progress: 1, result: { url: '/out.mp4', fileName: 'out.mp4' } }),
        ),
    ]);
    render(<ExportVideo projectId="abc" checkpoint={() => Promise.resolve()} />);
    fireEvent.click(screen.getByRole('button', { name: 'Export' }));
    await waitFor(() => expect(click).toHaveBeenCalledTimes(1), { timeout: 6000 });
    HTMLAnchorElement.prototype.click = anchor;
    expect(calls).toHaveLength(3);
    expect(screen.queryByRole('alert')).toBeNull();
    expect(screen.getByRole('button', { name: 'Export' })).toBeEnabled();
  });
});
