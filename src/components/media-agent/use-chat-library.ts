'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import type { MediaAgentMessage } from '@/agent/tools';
import {
  type ChatLibrary,
  deleteChat,
  emptyLibrary,
  openChat,
  parseLibrary,
  renameChat,
  saveMessages,
  startChat,
} from './chat-library';

const storageKeyFor = (mediaKey: string): string => `neuclip-agent-chats:${mediaKey}`;

const readLibrary = (key: string): ChatLibrary => {
  try {
    const raw = localStorage.getItem(key);
    return raw === null ? emptyLibrary() : parseLibrary(JSON.parse(raw));
  } catch {
    return emptyLibrary();
  }
};

const writeLibrary = (key: string, library: ChatLibrary): void => {
  try {
    localStorage.setItem(key, JSON.stringify(library));
  } catch {
    return;
  }
};

export interface ChatLibraryActions {
  start: () => void;
  open: (id: string) => void;
  rename: (id: string, title: string) => void;
  remove: (id: string) => void;
  save: (id: string, messages: MediaAgentMessage[]) => void;
}

export const useChatLibrary = (mediaKey: string): [ChatLibrary | null, ChatLibraryActions] => {
  const key = storageKeyFor(mediaKey);
  const [library, setLibrary] = useState<ChatLibrary | null>(null);

  useEffect(() => {
    setLibrary(readLibrary(key));
  }, [key]);

  const update = useCallback(
    (change: (current: ChatLibrary) => ChatLibrary) => {
      setLibrary((current) => {
        const next = change(current ?? readLibrary(key));
        writeLibrary(key, next);
        return next;
      });
    },
    [key],
  );

  const actions = useMemo<ChatLibraryActions>(
    () => ({
      start: () => update((current) => startChat(current)),
      open: (id) => update((current) => openChat(current, id)),
      rename: (id, title) => update((current) => renameChat(current, id, title)),
      remove: (id) => update((current) => deleteChat(current, id)),
      save: (id, messages) => update((current) => saveMessages(current, id, messages)),
    }),
    [update],
  );

  return [library, actions];
};
