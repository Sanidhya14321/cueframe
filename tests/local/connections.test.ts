import { describe, expect, it } from 'bun:test';
import { connectionState, holdConnection, markConnected } from '@/local/connections';

const pause = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

describe('agent connection', () => {
  it('keeps the client name on requests that do not send one', async () => {
    await markConnected('claude-code');
    await markConnected();
    expect((await connectionState()).name).toBe('claude-code');
  });

  it('refreshes while a stream is open and stops when it closes', async () => {
    await markConnected('claude-code');
    const before = (await connectionState()).lastSeen;
    const stream = new AbortController();
    holdConnection(stream.signal, 5);
    await pause(40);
    stream.abort();
    await pause(20);
    const held = (await connectionState()).lastSeen;
    expect(held).toBeGreaterThan(before);
    await pause(30);
    expect((await connectionState()).lastSeen).toBe(held);
  });
});
