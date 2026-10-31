import { z } from 'zod';
import { type ControlEntry, clipControlsFor } from '@/core';
import { type Design, type DesignControl, designSchema, FONT_FAMILIES } from '@/design';
import { type Project, projectSchema } from '@/project';
import { CLIP_SCHEMAS, getClipMeta, isClipId } from '@/schemas';
import { findSiteTemplate } from '@/sites/templates';
import type { MediaKind } from './media';
import { siteFieldGuide } from './site';

export const jsonSchema = (schema: z.ZodType): string =>
  JSON.stringify(z.toJSONSchema(schema, { unrepresentable: 'any' }));

const SHARED_RULES = `Rules:
- Change the media only by calling the editMedia tool with RFC 6902 JSON Patch operations against the current document. Paths are JSON pointers from the document root.
- Batch every operation for one request into a single editMedia call. Prefer "replace" on existing fields.
- Every value must satisfy the schema. Colors are hex strings like #1f2937. New elements need a fresh unique id.
- Strings like asset://3 stand for uploaded media. Keep or move them, never invent new ones.
- If editMedia returns an error, read it, fix the operations and call editMedia again.
- When the user says "this", "it" or "the selected one", they mean the selected elements.
- Before calling editMedia, write one short plain sentence telling the user what you are changing. Once editMedia succeeds you are done, so do not add more text. Never paste JSON or patch operations into the reply.
- If the request is unclear, make the most sensible change instead of asking. If the request cannot be done with this document, say so briefly.
- The user may ask to rename this chat. Do that with the renameChat tool, then confirm in one short sentence without editing the media.`;

const fieldLine = (entry: ControlEntry): string => {
  const hint = entry.hint === null ? '' : ` (${entry.hint})`;
  const [lead, ...linked] = entry.targets.map((target) => `props/${target.join('/')}`);
  if (entry.shades !== null && linked.length > 0) {
    return `  - ${entry.descriptor.label}: set ${lead}; the editor recolours ${linked.join(', ')} to match, keeping their designed shades${hint}`;
  }
  return `  - ${entry.descriptor.label}: ${[lead, ...linked].join(', ')}${hint}`;
};

export const clipFieldGuide = (clipId: string): string =>
  clipControlsFor(clipId)
    .map((section) => {
      const fields = [...section.fields, ...section.more].map(fieldLine);
      return [`${section.title}:`, ...fields].join('\n');
    })
    .join('\n');

const clipSections = (project: Project): string[] => {
  const clipIds = [
    ...new Set(
      project.tracks.flatMap((track) =>
        track.elements.flatMap((element) =>
          element.type === 'composition' && isClipId(element.clipId) ? [element.clipId] : [],
        ),
      ),
    ),
  ];
  return clipIds.map(
    (
      clipId,
    ) => `Animation "${clipId}" (${getClipMeta(clipId).title}), the props of its composition elements:
Field guide (label: path inside props):
${clipFieldGuide(clipId)}
Props JSON schema: ${jsonSchema(CLIP_SCHEMAS[clipId])}`,
  );
};

const clipInstructions = (title: string, document: unknown): string => {
  const parsed = projectSchema.safeParse(document);
  return `You are the editing agent for the animated video clip "${title}" in a browser video editor.
The document is a Remotion project: fps, width x height in pixels, durationInFrames, and tracks of timed elements. The first track is the top visual layer. Element transform x/y are pixel offsets from the centre.
Most of the clip's look lives in the props of its "composition" elements, for example /tracks/0/elements/0/props/headline.
To recolour a clip, use the roles in its Colors section: replace only the role's first path and the linked paths follow. To change only the first path of a role, also replace its linked paths with their current values.

${SHARED_RULES}

Project JSON schema: ${jsonSchema(projectSchema)}

${parsed.success ? clipSections(parsed.data).join('\n\n') : ''}`;
};

const controlLine = (control: DesignControl, index: number): string => {
  const hint = control.hint === undefined ? '' : ` (${control.hint})`;
  if (control.kind === 'list') {
    const items = control.values
      .map((value, at) => `/controls/${index}/values/${at} = ${JSON.stringify(value)}`)
      .join(', ');
    return `  - ${control.label}, a list: ${items}${hint}`;
  }
  return `  - ${control.label}: /controls/${index}/value = ${JSON.stringify(control.value)}${hint}`;
};

const themeGuide = (design: Design): string => {
  if (design.controls.length === 0) {
    return 'This poster has no theme controls.';
  }
  return `Theme controls (label: path = current value):
${design.controls.map(controlLine).join('\n')}`;
};

const posterInstructions = (title: string, document: unknown): string => {
  const parsed = designSchema.safeParse(document);
  return `You are the editing agent for the poster design "${title}" in a browser image editor.
The document is one page: width x height in pixels, a background fill, and elements painted in array order, so later elements sit on top. x and y are the top-left corner in pixels.
Elements sharing a groupId move together.
The poster is styled through its theme controls. A colour role paints every element it targets, keeping each one's designed shade, a font role sets the font of its texts, and a copy control sets its texts.

${SHARED_RULES}
- Change colours, fonts and the text of controlled elements only with "replace" on a theme control path. Writing those element properties directly is rejected.
- Locked elements are the poster's shapes. Never change their properties; recolour them through the colour roles. You may remove one when the user asks.
- Positions, sizes, photos, the title and new elements are edited with normal operations.
- Fonts must be one of: ${FONT_FAMILIES.map((font) => font.family).join(', ')}.
- Keep every element inside the page.

${parsed.success ? themeGuide(parsed.data) : ''}

Design JSON schema: ${jsonSchema(designSchema)}`;
};

const siteInstructions = (title: string, document: unknown): string => {
  const templateId =
    typeof document === 'object' && document !== null && 'templateId' in document
      ? String(document.templateId)
      : '';
  const template = findSiteTemplate(templateId);
  if (template === undefined) {
    return `You are the editing agent for the website "${title}". Its template is unknown, so explain that you cannot edit it.`;
  }
  return `You are the editing agent for the website "${title}", built from the "${template.meta.title}" template (${template.meta.description}).
The document is { templateId, content }. Only content changes: every path starts with /content/. The template decides the layout, so you change words, dates, places, photos, lists and colours, never the structure.
Write warm, natural copy that fits the occasion. Keep names, monogram, dates and venue consistent everywhere they appear: when names change, update the monogram to the new initials, and when the date changes, update the RSVP deadline and any FAQ answers that mention dates or times.
Dates and times like event.startsAt are local time written YYYY-MM-DDTHH:mm. Photos are image URLs; keep the current ones or asset://N values unless the user gives a new https image URL.
Lists such as the schedule, details and FAQs can grow or shrink within their schema limits; to add an item use "add" with a path ending in /-.

${SHARED_RULES}

Field guide (label: path, with hints):
${siteFieldGuide(template)}

Content JSON schema: ${jsonSchema(template.schema)}`;
};

const INSTRUCTION_BUILDERS: Record<MediaKind, (title: string, document: unknown) => string> = {
  clip: clipInstructions,
  poster: posterInstructions,
  site: siteInstructions,
};

const chatLine = (chatTitle: string | null): string =>
  chatTitle === null
    ? 'This chat has no name yet. In your first step, also call renameChat with a short title for what the user wants.'
    : `This chat is named "${chatTitle}". Call renameChat only when the user asks to rename it.`;

interface InstructionInput {
  kind: MediaKind;
  title: string;
  document: unknown;
  focus: readonly string[];
  chatTitle: string | null;
}

export const mediaInstructions = ({
  kind,
  title,
  document,
  focus,
  chatTitle,
}: InstructionInput): string => {
  const base = INSTRUCTION_BUILDERS[kind](title, document);
  const selection =
    focus.length === 0 ? 'Nothing is selected.' : `Selected element ids: ${focus.join(', ')}.`;
  return `${base}

${chatLine(chatTitle)}

${selection}

Current document:
${JSON.stringify(document)}`;
};
