import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { registerCatalogTools } from './catalog-tools';
import { registerProjectTools } from './project-tools';
import { registerSiteTools } from './site-tools';
import { registerVideoTools } from './video-tools';

const INSTRUCTIONS = `The editor chat only reaches you through wait_for_events, so keep calling it while the person is working. Use share_update to explain what you are thinking and each decision, and put your reply to the person in the resolve_event note.
For live editing: set_agent_status working with a label and itemIds before edits; set idle when done, then wait_for_events; resolve_event after completing each event. Prefer build_from_beatsheet for new videos (16 segments for 30 seconds), resolve each comment after changing only its item, and poll get_job for transcription/voice/render progress.
Live project tools: list_projects/open_project/new_project, get_project/get_item, add_item/update_props/move_item/delete_item. All write tools need confirmed:true. Keep outputs and edits small.
Neuclip builds short promo and launch videos from a library of labelled, editable animation clips, and saves local websites from templates.
Videos: search_clips for each beat of the video (opener, feature, proof, cta, closer), get_clip to learn a clip's props, create_video with the chosen clips and their props, then add_clip and edit_video with its videoId to refine. Videos are saved to the local data folder and their editorUrl never changes. The person can also edit in the browser, so call get_video before editing a video you have not seen in this conversation. list_videos finds earlier videos.
Websites: list_site_templates, get_site_template to learn its content fields, then create_site to save it locally at a slug the person chooses. Websites are saved to the local data folder: create_site returns a siteId, a siteUrl for local viewing and an editorUrl for editing, and edit_site changes the live website at the same links. get_site shows the current content and list_sites finds earlier websites.`;

export const createMcpServer = (origin: string): McpServer => {
  const server = new McpServer(
    { name: 'neuclip', version: '0.3.0' },
    { instructions: INSTRUCTIONS },
  );
  registerCatalogTools(server, origin);
  registerProjectTools(server, origin);
  registerVideoTools(server, origin);
  registerSiteTools(server, origin);
  return server;
};
