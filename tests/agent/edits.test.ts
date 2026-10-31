import { describe, expect, it } from 'bun:test';
import { dropObjectUrls, maskAssets, restoreAssets } from '@/agent/assets';
import { applyEdits } from '@/agent/edits';
import { mediaInstructions } from '@/agent/instructions';
import { checkMedia } from '@/agent/media';
import { createMediaTools, editSucceeded } from '@/agent/tools';
import { seedProjectForClip } from '@/core';
import { findPoster } from '@/posters';

const clip = seedProjectForClip('word-build');
const poster = findPoster('amber-client-reviews-01')?.build();

if (poster === undefined) {
  throw new Error('missing poster fixture');
}

const textIndex = poster.elements.findIndex((element) => element.type === 'text');

describe('applyEdits', () => {
  it('replaces a clip prop and keeps the project valid', () => {
    const result = applyEdits('clip', clip, [
      { op: 'replace', path: '/tracks/0/elements/0/props/text', value: 'HELLO WORLD' },
    ]);
    expect(result.ok).toBe(true);
    expect(result.ok ? result.document.tracks[0]?.elements[0] : null).toMatchObject({
      props: { text: 'HELLO WORLD' },
    });
  });

  it('rejects a prop that breaks the clip schema', () => {
    const result = applyEdits('clip', clip, [
      { op: 'replace', path: '/tracks/0/elements/0/props/bigColor', value: 'red' },
    ]);
    expect(result.ok).toBe(false);
    expect(result.ok ? '' : result.error).toContain('/tracks/0/elements/0/props');
  });

  it('reports a path that does not exist', () => {
    const result = applyEdits('clip', clip, [{ op: 'remove', path: '/tracks/9' }]);
    expect(result.ok).toBe(false);
  });

  it('does not mutate the source document', () => {
    const before = JSON.stringify(poster);
    applyEdits('poster', poster, [{ op: 'replace', path: '/title', value: 'Changed' }]);
    expect(JSON.stringify(poster)).toBe(before);
  });

  it('rejects fonts outside the bundled set', () => {
    const result = applyEdits('poster', poster, [
      { op: 'replace', path: `/elements/${textIndex}/fontFamily`, value: 'Comic Sans MS' },
    ]);
    expect(result.ok ? '' : result.error).toContain('not a bundled font');
  });

  it('rejects duplicate element ids', () => {
    const result = applyEdits('poster', poster, [
      { op: 'copy', from: `/elements/${textIndex}`, path: '/elements/-' },
    ]);
    expect(result.ok ? '' : result.error).toContain('duplicate id');
  });
});

describe('theme controls', () => {
  const controlIndex = (id: string) => poster.controls.findIndex((control) => control.id === id);
  const primary = controlIndex('primary');
  const heading = controlIndex('font:heading');
  const names = controlIndex('copy:names');
  const star = poster.elements.findIndex((element) => element.locked && element.type === 'star');
  const title = poster.elements.findIndex((element) => element.name === 'CLIENT');

  it('recolours every element a colour role drives and records the new value', () => {
    const result = applyEdits('poster', poster, [
      { op: 'replace', path: `/controls/${primary}/value`, value: '#2a9d8f' },
    ]);
    if (!result.ok) {
      throw new Error(result.error);
    }
    expect(result.document.controls[primary]).toMatchObject({ value: '#2a9d8f' });
    expect(result.document.elements[star]).toMatchObject({ fill: '#2a9d8f' });
    expect(JSON.stringify(result.document.background)).not.toBe(JSON.stringify(poster.background));
  });

  it('sets font roles and list copy through their controls', () => {
    const result = applyEdits('poster', poster, [
      { op: 'replace', path: `/controls/${heading}/value`, value: 'Nunito' },
      { op: 'replace', path: `/controls/${names}/values/1`, value: 'Zoe Park' },
    ]);
    if (!result.ok) {
      throw new Error(result.error);
    }
    expect(result.document.elements[title]).toMatchObject({ fontFamily: 'Nunito' });
    expect(
      result.document.elements.some((element) => 'text' in element && element.text === 'Zoe Park'),
    ).toBe(true);
  });

  it('rejects a font role outside the bundled set', () => {
    const result = applyEdits('poster', poster, [
      { op: 'replace', path: `/controls/${heading}/value`, value: 'Comic Sans MS' },
    ]);
    expect(result.ok ? '' : result.error).toContain('not a bundled font');
  });

  it('points direct writes to a controlled property at the owning control', () => {
    const result = applyEdits('poster', poster, [
      { op: 'replace', path: `/elements/${title}/fontFamily`, value: 'Nunito' },
    ]);
    expect(result.ok ? '' : result.error).toContain(`Replace /controls/${heading}/value instead`);
  });

  it('keeps locked shapes and control definitions read-only but lets them be removed', () => {
    const moved = applyEdits('poster', poster, [
      { op: 'replace', path: `/elements/${star}/x`, value: 0 },
    ]);
    expect(moved.ok ? '' : moved.error).toContain('is a locked shape');
    const relabelled = applyEdits('poster', poster, [
      { op: 'replace', path: `/controls/${primary}/label`, value: 'Accent color' },
    ]);
    expect(relabelled.ok).toBe(false);
    expect(applyEdits('poster', poster, [{ op: 'remove', path: `/elements/${star}` }]).ok).toBe(
      true,
    );
  });

  it('rejects a colour role value that is not a colour', () => {
    const result = applyEdits('poster', poster, [
      { op: 'replace', path: `/controls/${primary}/value`, value: 'sunny' },
    ]);
    expect(result.ok ? '' : result.error).toContain('not a valid colour');
  });
});

describe('clip colour roles', () => {
  const props = (result: ReturnType<typeof applyEdits<'clip'>>) =>
    result.ok ? result.document.tracks[0]?.elements[0] : undefined;

  it('recolours the linked fields of a role, keeping their designed shades', () => {
    const result = applyEdits('clip', clip, [
      { op: 'replace', path: '/tracks/0/elements/0/props/look/background', value: '#102040' },
    ]);
    expect(props(result)).toMatchObject({
      props: { look: { background: '#102040', backgroundEdge: '#020b29' } },
    });
  });

  it('leaves a linked field alone when the same edit sets it', () => {
    const result = applyEdits('clip', clip, [
      { op: 'replace', path: '/tracks/0/elements/0/props/look/ink', value: '#ff6600' },
      { op: 'replace', path: '/tracks/0/elements/0/props/bigColor', value: '#00ff00' },
    ]);
    expect(props(result)).toMatchObject({
      props: { look: { ink: '#ff6600' }, bigColor: '#00ff00' },
    });
  });
});

describe('checkMedia', () => {
  it('accepts the seeded clip and the built poster', () => {
    expect(checkMedia('clip', clip).ok).toBe(true);
    expect(checkMedia('poster', poster).ok).toBe(true);
  });

  it('rejects a poster sent as a clip', () => {
    expect(checkMedia('clip', poster).ok).toBe(false);
  });
});

describe('assets', () => {
  it('masks heavy strings and restores them', () => {
    const image = `data:image/png;base64,${'a'.repeat(50)}`;
    const { masked, assets } = maskAssets({ src: image, again: image, name: 'photo' });
    expect(masked).toEqual({ src: 'asset://0', again: 'asset://0', name: 'photo' });
    expect(restoreAssets(masked, assets)).toEqual({ src: image, again: image, name: 'photo' });
  });

  it('leaves unknown asset references alone', () => {
    expect(restoreAssets('asset://4', [])).toBe('asset://4');
  });
});

describe('dropObjectUrls', () => {
  it('empties object URLs that die with the page and keeps everything else', () => {
    expect(
      dropObjectUrls({ src: 'blob:http://localhost/1', poster: 'data:image/png;base64,x', n: 2 }),
    ).toEqual({ src: '', poster: 'data:image/png;base64,x', n: 2 });
  });
});

describe('mediaInstructions', () => {
  it('describes clip fields with their prop paths and the selection', () => {
    const text = mediaInstructions({
      kind: 'clip',
      title: 'Word Build',
      document: clip,
      focus: ['element-1'],
      chatTitle: 'Brighter words',
    });
    expect(text).toContain('props/text');
    expect(text).toContain('This chat is named "Brighter words".');
    expect(text).toContain('set props/look/ink; the editor recolours props/bigColor');
    expect(text).toContain('Selected element ids: element-1.');
  });

  it('lists the bundled fonts and the theme controls for posters', () => {
    const text = mediaInstructions({
      kind: 'poster',
      title: 'Amber',
      document: poster,
      focus: [],
      chatTitle: null,
    });
    expect(text).toContain('Bebas Neue');
    expect(text).toContain('also call renameChat');
    expect(text).toContain('Primary color: /controls/1/value = "#ffb703"');
    expect(text).toContain('/controls/8/values/2 = "Nia Brooks"');
    expect(text).toContain('Nothing is selected.');
  });
});

describe('createMediaTools', () => {
  const run = (tools: ReturnType<typeof createMediaTools>, value: string) => {
    const execute = tools.editMedia.execute;
    if (execute === undefined) {
      throw new Error('editMedia has no execute');
    }
    return execute(
      {
        summary: 'Rename',
        operations: [{ op: 'replace', path: '/elements/0/name', value }],
      },
      { toolCallId: 'call', messages: [], context: {} } as never,
    );
  };

  it('chains edits and restores masked assets in the returned operations', async () => {
    const { masked, assets } = maskAssets(poster);
    const tools = createMediaTools('poster', masked, [...assets, 'data:image/png;base64,x']);
    const output = await run(tools, `asset://${assets.length}`);
    expect(output).toEqual({
      ok: true,
      operations: [{ op: 'replace', path: '/elements/0/name', value: 'data:image/png;base64,x' }],
    });
  });

  it('renames the chat with a trimmed title', () => {
    const execute = createMediaTools('poster', poster, []).renameChat.execute;
    expect(
      execute?.({ title: '  Gold stars ' }, {
        toolCallId: 'call',
        messages: [],
        context: {},
      } as never),
    ).toEqual({ title: 'Gold stars' });
  });

  it('stops the loop only after a successful edit', () => {
    expect(
      editSucceeded({ steps: [{ toolResults: [{ output: { ok: false, error: 'x' } }] }] }),
    ).toBe(false);
    expect(
      editSucceeded({ steps: [{ toolResults: [{ output: { ok: true, operations: [] } }] }] }),
    ).toBe(true);
    expect(editSucceeded({ steps: [] })).toBe(false);
  });
});
