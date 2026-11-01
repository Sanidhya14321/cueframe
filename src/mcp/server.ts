import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { registerCatalogTools } from './catalog-tools';
import { registerProjectTools } from './project-tools';
import { registerSiteTools } from './site-tools';
import { registerVideoTools } from './video-tools';

const INSTRUCTIONS = `The editor chat reaches you through wait_for_events, so keep calling it while the person is working. Use share_update for concise progress and decisions; use kind reply to send the person your answer immediately, then resolve_event with a short completion note.
For live editing: set_agent_status working with a label and itemIds before edits; set idle when done, then wait_for_events; resolve_event after completing each event. Resolve each comment after changing only its item, and poll get_job for transcription/voice/render progress.
Live project tools: list_projects/open_project/new_project, get_project/get_item, suggest_clips, build_from_beatsheet, edit_project, add_item/update_props/move_item/delete_item. All write tools need confirmed:true. Keep outputs and edits small.
cueframe is the editable layer between you and video editing: you write and direct the video, and every section you make stays editable until the person exports the MP4. It also saves local websites from templates.
Videos: you decide the story, copy and visual style. Call suggest_clips with the brief and your beats to see library clips matched by metadata embeddings; they are suggestions, not the default. Use a clip only if it truly suits the beat, get_clip to learn its props, then replace every placeholder. Make everything else your own: build_from_beatsheet with a style that fits the brief creates editable sections (16 segments for 30 seconds), and edit_project authors or refines text, shapes and images. Videos are saved to the local data folder and their editorUrl never changes. The person can also edit in the browser, so call get_video before editing a video you have not seen in this conversation. list_videos finds earlier videos.
Websites: list_site_templates, get_site_template to learn its content fields, then create_site to save it locally at a slug the person chooses. Websites are saved to the local data folder: create_site returns a siteId, a siteUrl for local viewing and an editorUrl for editing, and edit_site changes the live website at the same links. get_site shows the current content and list_sites finds earlier websites.`;

export const createMcpServer = (origin: string): McpServer => {
  const server = new McpServer(
    { name: 'cueframe', version: '0.3.0' },
    { instructions: INSTRUCTIONS },
  );
  registerCatalogTools(server, origin);
  registerProjectTools(server, origin);
  registerVideoTools(server, origin);
  registerSiteTools(server, origin);
  return server;
};
