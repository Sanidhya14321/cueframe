import { describe, expect, it } from 'bun:test';
import type { MediaAgentMessage } from '@/agent/tools';
import {
  activeChat,
  chatTitle,
  deleteChat,
  emptyLibrary,
  openChat,
  parseLibrary,
  renameChat,
  saveMessages,
  startChat,
} from '@/components/media-agent/chat-library';

const ask = (text: string): MediaAgentMessage => ({
  id: `user-${text}`,
  role: 'user',
  parts: [{ type: 'text', text }],
});

describe('chat library', () => {
  it('starts with one empty chat and reuses it instead of piling up blank chats', () => {
    const library = emptyLibrary(1);
    expect(library.chats).toHaveLength(1);
    expect(startChat(library, 2)).toEqual(library);
  });

  it('opens a fresh chat once the current one has messages and keeps the newest first', () => {
    const first = emptyLibrary(1);
    const saved = saveMessages(first, first.activeId, [ask('Make it gold')], 5);
    const next = startChat(saved, 10);
    expect(next.chats).toHaveLength(2);
    expect(next.activeId).not.toBe(first.activeId);
    expect(next.chats[0]?.id).toBe(next.activeId);
    expect(openChat(next, first.activeId).activeId).toBe(first.activeId);
    expect(openChat(next, 'missing').activeId).toBe(next.activeId);
  });

  it('titles a chat by its name, else its first request, else New chat', () => {
    const library = emptyLibrary(1);
    expect(chatTitle(activeChat(library))).toBe('New chat');
    const asked = saveMessages(library, library.activeId, [ask('  Make   the stars gold ')]);
    expect(chatTitle(activeChat(asked))).toBe('Make the stars gold');
    const long = saveMessages(library, library.activeId, [ask('word '.repeat(20))]);
    expect(chatTitle(activeChat(long))).toHaveLength(40);
    const named = renameChat(asked, asked.activeId, '  Gold stars  ');
    expect(chatTitle(activeChat(named))).toBe('Gold stars');
    expect(activeChat(renameChat(named, named.activeId, '   ')).title).toBeNull();
  });

  it('moves to another chat when the open one is deleted and never ends empty', () => {
    const first = emptyLibrary(1);
    const both = startChat(saveMessages(first, first.activeId, [ask('One')], 2), 3);
    const remaining = deleteChat(both, both.activeId);
    expect(remaining.chats).toHaveLength(1);
    expect(remaining.activeId).toBe(first.activeId);
    const reset = deleteChat(remaining, first.activeId, 9);
    expect(reset.chats).toHaveLength(1);
    expect(activeChat(reset).messages).toEqual([]);
  });

  it('parses stored libraries and falls back to an empty one when the data is broken', () => {
    const library = emptyLibrary(1);
    expect(parseLibrary(JSON.parse(JSON.stringify(library)))).toEqual(library);
    expect(parseLibrary({ activeId: 'x', chats: [] }).chats).toHaveLength(1);
    expect(parseLibrary('nope').chats[0]?.messages).toEqual([]);
    const stray = { ...library, activeId: 'gone' };
    expect(parseLibrary(stray).activeId).toBe(library.chats[0]?.id ?? '');
  });
});
