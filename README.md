# cueframe

A video studio built on [Remotion](https://www.remotion.dev). Browse a library of
animation clips, edit them on a timeline and export finished video.

## Two ways to use cueframe

- **Local (free):** download cueframe and run it on your own computer with your
  own AI and voice keys. Your projects stay on your machine as files.
- **Hosted (paid):** we run a private cueframe server for you, end to end, so you
  need no installation or configuration. Each customer gets an isolated instance.
  This is how the project is funded. See `/pricing` in the app; online payments
  are not enabled yet.

## Features

- A searchable gallery of clips, posters and website templates.
- A multi-track video editor with trimming, layers, media import and captions.
- Properties panels generated from each clip's schema.
- Export to MP4 or WebM in the browser, or render locally at full fidelity.
- AI editing through any OpenAI-compatible provider.
- MCP tools that let agents create, edit and render projects.
- Local transcription with Whisper and optional voiceover with Fish.

Projects are stored as files, on your machine or in your hosted instance's
private storage. The local version has no accounts. YugabyteDB is optional and stores library metadata embeddings for agent search.

## Run it locally

You need [Bun](https://bun.sh) 1.4 or newer.

```bash
bun install
bun run dev
```

Open <http://127.0.0.1:3000>. To use AI features, open **Settings** and add your
provider base URL, API key and model. A local install only accepts loopback
connections.

## Host it

[docs/CUEFRAME_DEPLOY.md](docs/CUEFRAME_DEPLOY.md) covers Docker and private
server instances, including the settings that turn on login.

## Yugabyte and voice setup

Put your existing cluster's YSQL connection URL in `.env.local` as
`YUGABYTE_DATABASE_URL=postgresql://USER:PASSWORD@HOST:5433/DATABASE?sslmode=require`.
Use your cluster's TLS settings and URL-encode credentials. The database user
needs permission to enable the `vector` extension and create the
`cueframe_library_vectors` table. An administrator can enable the extension first.
Yugabyte supports [pgvector cosine distance](https://docs.yugabyte.com/stable/additional-features/pg-extensions/extension-pgvector/).

For the same setup command, add `FISH_AUDIO_API_KEY`, `AGENT_BASE_URL`,
`AGENT_MODEL` and `AGENT_API_KEY` to `.env.local`, or enter the provider and Fish
keys in Settings. Then run:

```bash
bun run local:configure
bun run library:index
bun run dev
```

Configuration imports nonempty values into the private local `settings.json`;
the application reads credentials from that file. Existing settings are preserved.
The settings API returns only presence flags for keys and the database URL.

Indexing downloads the local MiniLM embedding model on first use and stores
384-dimensional vectors and metadata for clips, poster pages and sites. Run it
again after library changes: unchanged documents are skipped, changed documents
are embedded again and removed entries are deleted in one transaction. Search
uses exact cosine distance, suitable for this curated library, with no ANN index
required. Clip search and agent storyboards combine semantic and keyword ranks.
The `search_library` MCP tool searches across all three library types. Project
documents and user prompts are not persisted in the database.

Without Yugabyte configured, existing local clip search and recommendations
remain available. A configured but unreachable database produces an error.
Fish voiceover uses the saved key and requires a voice reference ID on the
voiceover request.

## Commands

- `bun run dev`: start the dev server.
- `bun run build`: create a production build.
- `bun run render [clipId...]`: render gallery previews.
- `bun run test`: run unit and component tests.
- `bun run test:e2e`: run the Playwright suite.
- `bun run verify`: run lint, type checks, tests and repository checks.

## Project layout

- `src/app`, `src/components`, `src/lib`: the Next.js interface.
- `src/schemas`: clip schemas, defaults and registry metadata.
- `src/compositions`: Remotion scenes and the motion kit.
- `src/project`: the project model and reducers.
- `src/agent`, `src/mcp`: agent tools and the MCP server.
- `src/render`: rendering scripts.
- `tests`, `e2e`: unit, component and end-to-end tests.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) and [SECURITY.md](SECURITY.md).

## License

[MIT](LICENSE)
