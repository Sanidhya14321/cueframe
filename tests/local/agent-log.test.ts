import { describe, expect, it } from 'bun:test';
import { appendAgentLog, logToolCall, markListening, readAgentLog } from '@/local/agent-log';
import { createProject } from '@/local/projects';

const project = () =>
  createProject({
    title: 'Log',
    project: {
      width: 100,
      height: 100,
      fps: 30,
      durationInFrames: 30,
      background: '#000',
      tracks: [],
    },
  });

describe('agent log', () => {
  it('keeps the trace without changing the project revision', async () => {
    const state = await project();
    await appendAgentLog(state.id, { kind: 'decision', text: 'Use a dark opener' });
    await logToolCall('add_item', { projectId: state.id, clipId: 'word-build' });
    await logToolCall('resolve_event', { projectId: state.id, note: 'Done' });
    await logToolCall('delete_item', { projectId: state.id, id: 'x' }, 'Unknown item.');
    await logToolCall('get_job', { projectId: state.id });
    const log = await readAgentLog(state.id);
    expect(log.entries.map((entry) => entry.kind)).toEqual(['decision', 'tool', 'reply', 'error']);
    expect(log.entries[1]?.text).toBe('Add item: word-build');
  });
  it('reports listening only after the agent waits for events', async () => {
    const state = await project();
    expect((await readAgentLog(state.id)).listening).toBe(false);
    await markListening(state.id);
    expect((await readAgentLog(state.id)).listening).toBe(true);
  });
});
