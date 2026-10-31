# cueframe

A local-first video studio built on [Remotion](https://www.remotion.dev). Browse
a library of animation clips, edit them on a timeline and export finished video
from your own machine.

## Features

- A searchable gallery of clips, posters and website templates.
- A multi-track video editor with trimming, layers, media import and captions.
- Properties panels generated from each clip's schema.
- Export to MP4 or WebM in the browser, or render locally at full fidelity.
- AI editing through any OpenAI-compatible provider.
- MCP tools that let agents create, edit and render projects.
- Local transcription with Whisper and optional voiceover with Fish.

There are no accounts or database services. Projects are stored as files on
your machine.

## Getting started

You need [Bun](https://bun.sh) 1.4 or newer.

```bash
bun install
bun run dev
```

Open <http://127.0.0.1:3000>. To use AI features, open **Settings** and add your
provider base URL, API key and model. Keep the server local: it only accepts
loopback connections.

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
