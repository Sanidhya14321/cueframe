# Contributing to cueframe

Thanks for helping out. Bug reports, fixes and new clips are all welcome.

## Setup

You need [Bun](https://bun.sh) 1.4 or newer.

```bash
bun install
bun run dev
```

## The two versions

cueframe ships as a local app people install themselves and as a hosted server we
run for customers, which is the business model. Both come from this codebase, so
check that a change works in each mode: local loopback with no accounts, and
hosted with `CUEFRAME_PUBLIC_URL` plus `CUEFRAME_PASSWORD` or `CUEFRAME_USERS`.

Never commit credentials. `.env.example` lists variable names only, with empty
values; real values go in `.env.local`, which git ignores.

## Making a change

1. Fork the repository and create a branch from `main`.
2. Keep each pull request focused on one change.
3. Add or update tests for any behavior you change.
4. Run `bun run verify` and fix anything it reports.
5. Open a pull request that explains what changed and why.

## Adding a clip

Add a schema under `src/schemas/clips/<category>/` and a scene under
`src/compositions/scenes/<category>/`, then register each in its category
`index.ts`. Render its preview with `bun run render <clipId>` and commit it.
[AGENTS.md](AGENTS.md) covers every step.

## Reporting bugs

Open an issue with steps to reproduce, what you expected and what happened.
Report security problems as described in [SECURITY.md](SECURITY.md), not in a
public issue.

## License

By contributing, you agree that your contributions are released under the
[MIT License](LICENSE).
