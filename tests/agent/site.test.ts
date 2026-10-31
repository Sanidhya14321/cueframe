import { describe, expect, it } from 'bun:test';
import { describePath } from '@/agent/describe-path';
import { applyEdits } from '@/agent/edits';
import { mediaInstructions } from '@/agent/instructions';
import { emeraldRoseDefaults } from '@/sites/templates/weddings/emerald-rose';

const document = { templateId: 'emerald-rose', content: emeraldRoseDefaults };

describe('website agent', () => {
  it('applies content edits and validates them against the template', () => {
    const edited = applyEdits('site', document, [
      { op: 'replace', path: '/content/couple/firstName', value: 'Maya' },
      { op: 'add', path: '/content/faqs/-', value: { question: 'Kids?', answer: 'Adults only.' } },
    ]);
    expect(edited.ok && edited.document.content).toMatchObject({ couple: { firstName: 'Maya' } });
    expect(
      applyEdits('site', document, [
        { op: 'replace', path: '/content/event/startsAt', value: 'next June' },
      ]).ok,
    ).toBe(false);
    expect(
      applyEdits('site', document, [{ op: 'replace', path: '/templateId', value: 'x' }]).ok,
    ).toBe(false);
  });

  it('names changed fields with their editor labels', () => {
    expect(describePath('site', document, '/content/couple/firstName')).toEqual({
      scope: 'Website',
      section: 'Couple',
      field: 'First name',
    });
    expect(describePath('site', document, '/content/schedule/2/time')).toEqual({
      scope: 'Website',
      section: 'Order of the day',
      field: 'Moments 3 › Time',
    });
  });

  it('briefs the model with the field guide and content schema', () => {
    const instructions = mediaInstructions({
      kind: 'site',
      title: 'Rachelle & Thomas',
      document,
      focus: [],
      chatTitle: null,
    });
    expect(instructions).toContain('/content/event/startsAt');
    expect(instructions).toContain('Emerald Rose Wedding Website');
  });
});
