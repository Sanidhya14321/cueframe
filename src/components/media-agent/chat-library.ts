import { generateId } from 'ai';
import { z } from 'zod';
import { CHAT_TITLE_MAX, type MediaAgentMessage } from '@/agent/tools';

const MAX_CHATS = 20;

const storedChatSchema = z.object({
  id: z.string(),
  title: z.string().nullable(),
  updatedAt: z.number(),
  messages: z.array(
    z.custom<MediaAgentMessage>(
      (value) =>
        typeof value === 'object' &&
        value !== null &&
        'id' in value &&
        'role' in value &&
        'parts' in value &&
        Array.isArray(value.parts),
    ),
  ),
});

const chatLibrarySchema = z.object({
  activeId: z.string(),
  chats: z.array(storedChatSchema).min(1),
});

export type StoredChat = z.infer<typeof storedChatSchema>;

export type ChatLibrary = z.infer<typeof chatLibrarySchema>;

const blankChat = (now: number): StoredChat => ({
  id: generateId(),
  title: null,
  updatedAt: now,
  messages: [],
});

export const emptyLibrary = (now = Date.now()): ChatLibrary => {
  const chat = blankChat(now);
  return { activeId: chat.id, chats: [chat] };
};

export const parseLibrary = (raw: unknown): ChatLibrary => {
  const parsed = chatLibrarySchema.safeParse(raw);
  if (!parsed.success) {
    return emptyLibrary();
  }
  const { chats, activeId } = parsed.data;
  return chats.some((chat) => chat.id === activeId)
    ? parsed.data
    : { chats, activeId: chats[0]?.id ?? activeId };
};

export const activeChat = (library: ChatLibrary): StoredChat =>
  library.chats.find((chat) => chat.id === library.activeId) ?? library.chats[0] ?? blankChat(0);

const byRecent = (chats: StoredChat[]): StoredChat[] =>
  [...chats].sort((a, b) => b.updatedAt - a.updatedAt);

export const startChat = (library: ChatLibrary, now = Date.now()): ChatLibrary => {
  const empty = library.chats.find((candidate) => candidate.messages.length === 0);
  if (empty !== undefined) {
    return { ...library, activeId: empty.id };
  }
  const fresh = blankChat(now);
  return { activeId: fresh.id, chats: byRecent([fresh, ...library.chats]).slice(0, MAX_CHATS) };
};

export const openChat = (library: ChatLibrary, id: string): ChatLibrary =>
  library.chats.some((chat) => chat.id === id) ? { ...library, activeId: id } : library;

const updateChat = (
  library: ChatLibrary,
  id: string,
  change: (chat: StoredChat) => StoredChat,
): ChatLibrary => ({
  ...library,
  chats: byRecent(library.chats.map((chat) => (chat.id === id ? change(chat) : chat))),
});

export const renameChat = (library: ChatLibrary, id: string, title: string): ChatLibrary => {
  const trimmed = title.trim().slice(0, CHAT_TITLE_MAX);
  return updateChat(library, id, (chat) => ({ ...chat, title: trimmed === '' ? null : trimmed }));
};

export const saveMessages = (
  library: ChatLibrary,
  id: string,
  messages: MediaAgentMessage[],
  now = Date.now(),
): ChatLibrary => updateChat(library, id, (chat) => ({ ...chat, messages, updatedAt: now }));

export const deleteChat = (library: ChatLibrary, id: string, now = Date.now()): ChatLibrary => {
  const chats = library.chats.filter((chat) => chat.id !== id);
  const [next] = chats;
  if (next === undefined) {
    return emptyLibrary(now);
  }
  return { chats, activeId: library.activeId === id ? next.id : library.activeId };
};

const firstUserText = (chat: StoredChat): string | undefined => {
  const part = chat.messages
    .find((message) => message.role === 'user')
    ?.parts.find((candidate) => candidate.type === 'text');
  return part?.type === 'text' ? part.text : undefined;
};

export const chatTitle = (chat: StoredChat): string => {
  if (chat.title !== null) {
    return chat.title;
  }
  const text = firstUserText(chat)?.trim().replace(/\s+/g, ' ');
  if (text === undefined || text === '') {
    return 'New chat';
  }
  return text.length > 40 ? `${text.slice(0, 39).trimEnd()}…` : text;
};
