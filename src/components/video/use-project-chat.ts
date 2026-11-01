'use client';
import { useEffect, useRef, useState } from 'react';
import type { z } from 'zod';
import { ChatRequestError, readProjectChat } from '@/lib/read-project-chat';
import type { agentEventInputSchema } from '@/local/event-schema';
import type { ChatEngine, ProjectChatUpdate } from '@/local/project-chat-schema';

const delivery = (mode: 'external' | 'in-app', waiting: boolean, done: boolean) => {
  if (mode === 'in-app') {
    return done ? 'Reply received' : 'Replying…';
  }
  return waiting ? 'Waiting for your coding agent to listen' : 'Sent to your coding agent';
};

export const useProjectChat = (projectId: string) => {
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [needsSettings, setNeedsSettings] = useState(false);
  const [engine, setEngine] = useState<ChatEngine>('auto');
  const [streamed, setStreamed] = useState<{ id: string; text: string } | null>(null);
  const request = useRef<AbortController | null>(null);
  useEffect(() => () => request.current?.abort(), []);
  const send = async (input: z.input<typeof agentEventInputSchema>, accepted: () => void) => {
    if (request.current) {
      return;
    }
    const controller = new AbortController();
    request.current = controller;
    setSending(true);
    setStreamed(null);
    setMessage('Sending…');
    setNeedsSettings(false);
    const update = (part: ProjectChatUpdate) => {
      switch (part.type) {
        case 'status':
          setMessage(part.text);
          break;
        case 'accepted':
          accepted();
          setMessage(delivery(part.mode, part.waiting, false));
          break;
        case 'text':
          setStreamed((current) => ({
            id: part.id,
            text: current?.id === part.id ? current.text + part.text : part.text,
          }));
          break;
        case 'finish':
          setMessage(delivery(part.mode, part.waiting, true));
          break;
        default:
          break;
      }
    };
    try {
      const response = await fetch(`/api/projects/${projectId}/chat`, {
        method: 'POST',
        headers: { 'content-type': 'application/json', accept: 'application/x-ndjson' },
        signal: controller.signal,
        body: JSON.stringify({ ...input, engine }),
      });
      await readProjectChat(response, update);
    } catch (error) {
      setNeedsSettings(error instanceof ChatRequestError && error.configurationRequired);
      setMessage(
        controller.signal.aborted
          ? 'Reply stopped. Completed edits can be undone.'
          : error instanceof Error
            ? error.message
            : 'Could not send this message. Try again.',
      );
    } finally {
      setSending(false);
      request.current = null;
    }
  };
  return {
    message,
    setMessage,
    sending,
    needsSettings,
    engine,
    setEngine,
    streamed,
    send,
    stop: () => request.current?.abort(),
  };
};
