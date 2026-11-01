import 'server-only';
import { randomUUID } from 'node:crypto';
import { join } from 'node:path';
import type { LanguageModel } from 'ai';
import type { z } from 'zod';
import { describeAgentError } from '@/agent/model';
import { projectChatTools } from '@/agent/project-chat-tools';
import { enqueueEvent, resolveEvent } from './agent-events';
import { appendAgentLog, readAgentLog } from './agent-log';
import { resolveChatEngine } from './chat-engine';
import type { agentEventInputSchema } from './event-schema';
import { serialDisk } from './file-lock';
import type { ChatEngine, ProjectChatUpdate } from './project-chat-schema';
import { mutateProject, ProjectProblem, projectDirectory, setAgentStatus } from './projects';
import { streamProjectReply } from './stream-project-reply';

const selectionInstruction = (itemId: string | null) =>
  itemId ? `Only edit item ${itemId}.` : 'Edit the project as requested.';

export const sendProjectChat = async (
  projectId: string,
  input: z.input<typeof agentEventInputSchema>,
  origin: string,
  modelOverride?: LanguageModel,
  options: {
    engine?: ChatEngine;
    signal?: AbortSignal;
    onUpdate?: (update: ProjectChatUpdate) => void;
  } = {},
) =>
  serialDisk(join(await projectDirectory(projectId), '.chat-turn'), async () => {
    options.signal?.throwIfAborted();
    const log = await readAgentLog(projectId);
    const route = await resolveChatEngine(log.listening, options.engine, modelOverride);
    options.signal?.throwIfAborted();
    if (route.mode === 'external') {
      const saved = await enqueueEvent(projectId, input);
      options.onUpdate?.({
        type: 'accepted',
        mode: 'external',
        eventId: saved.events.at(-1)?.id ?? '',
        waiting: route.waiting,
      });
      options.onUpdate?.({ type: 'finish', mode: 'external', waiting: route.waiting });
      return { mode: 'external' as const };
    }
    const actor = `agent:in-app:${randomUUID()}`;
    const queued = await enqueueEvent(projectId, input, actor);
    const event = queued.events.at(-1);
    if (!event) {
      throw new ProjectProblem('Could not save the chat message.');
    }
    const eventId = event.id;
    const eventText = event.text;
    await setAgentStatus(projectId, actor, {
      status: 'working',
      name: 'AI editor',
      label: 'Reading your request',
      itemIds: event.itemId ? [event.itemId] : [],
    });
    options.onUpdate?.({ type: 'accepted', mode: 'in-app', eventId, waiting: false });
    const heartbeat = setInterval(() => {
      mutateProject(projectId, (state) => ({
        ...state,
        agent:
          state.agent?.actor === actor ? { ...state.agent, heartbeat: Date.now() } : state.agent,
        events: state.events.map((entry) =>
          entry.id === eventId && entry.actor === actor && entry.status === 'in-progress'
            ? { ...entry, claimedAt: Date.now() }
            : entry,
        ),
      })).catch(() => undefined);
    }, 20000);
    heartbeat.unref?.();
    const replyId = randomUUID();
    let streamed = '';
    try {
      await streamProjectReply({
        model: route.model,
        instructions: `You are cueframe's video editor. Work only on project ${projectId}.
The current project settings are ${JSON.stringify({ width: queued.project.width, height: queued.project.height, fps: queued.project.fps, background: queued.project.background, durationInFrames: queued.project.durationInFrames })}.
The current timeline is ${JSON.stringify(queued.project.tracks.map((track, trackIndex) => ({ id: track.id, path: `/tracks/${trackIndex}`, items: track.elements.map((item, itemIndex) => ({ id: item.id, type: item.type, from: item.from, durationInFrames: item.durationInFrames, path: `/tracks/${trackIndex}/elements/${itemIndex}` })) })))}.
Use get_item before changing item properties and get_clip to check animation props. Use get_project if you need an updated outline.
You write the video: plan its story, copy and visual style from the request, and author sections with build_from_beatsheet or edit_project. Library clips are optional: use suggest_clips, and add one only when it truly suits the beat, replacing all of its placeholder copy.
The user's request authorizes the edits it describes; set confirmed:true for those actions.
Use the provided tools so all edits are validated, saved and undoable. Never claim an action succeeded without a successful tool result.
${selectionInstruction(event.itemId)}
The playhead is at frame ${event.frame}. The project brief is: ${queued.brief}.
Reply concisely. Background voice, transcription and render tools return jobs; report their actual pending status.
Recent conversation: ${JSON.stringify(
          log.entries
            .filter((entry) => entry.kind === 'reply')
            .slice(-4)
            .map((entry) => entry.text),
        )}`,
        prompt: eventText,
        tools: projectChatTools(projectId, { origin, actor }),
        signal: options.signal,
        onText: (text) => {
          streamed += text;
          options.onUpdate?.({ type: 'text', id: replyId, text });
        },
      });
      const reply =
        streamed.trim() || 'The tool steps are recorded above. Send another message to continue.';
      await appendAgentLog(projectId, { id: replyId, kind: 'reply', text: reply });
      await resolveEvent(projectId, eventId, reply.slice(0, 1000), actor);
      options.onUpdate?.({ type: 'finish', mode: 'in-app', waiting: false });
      return { mode: 'in-app' as const };
    } catch (error) {
      if (streamed) {
        await appendAgentLog(projectId, { id: replyId, kind: 'reply', text: streamed });
      }
      const message = options.signal?.aborted
        ? 'Reply stopped. Any completed edits are saved and can be undone.'
        : describeAgentError(error);
      await appendAgentLog(projectId, { kind: 'error', text: message });
      await resolveEvent(projectId, eventId, message, actor);
      throw new ProjectProblem(message, 502);
    } finally {
      clearInterval(heartbeat);
      await setAgentStatus(projectId, actor, {
        status: 'idle',
        name: 'AI editor',
        label: 'Ready',
        itemIds: [],
      });
    }
  });
