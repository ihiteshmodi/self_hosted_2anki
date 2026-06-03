<p align="center">
  <img src="web/public/mascot/Notion 1.png" width="140" alt="2anki mascot" />
</p>

# 2anki.net

[2anki.net](https://2anki.net) helps you turn your Notion pages, HTML, Markdown, and other study material into Anki flashcards. Drop something in, get a clean `.apkg` deck back — no fuss.

## Why 2anki?

We're not replacing Anki or Notion — we're building a bridge between them. Drop in what you're studying, get a deck back.

- Free to use, no technical skills required
- Multi-format: Notion pages (via API or HTML export), Markdown, HTML, Excel (xlsx), zip bundles
- Toggle lists become cards, cloze deletions work out of the box
- Embeds, audio, images, code blocks, and LaTeX carried over
- Self-hostable if you hit the free-tier quota
- No VC funding — sustained by paying subscribers and lifetime users

## Getting started

```bash
git clone https://github.com/2anki/server.git
cd server
pnpm install
touch .env
pnpm dev
```

The server starts on `http://localhost:2020` and the frontend on `http://localhost:3000`. For server-only work: `pnpm dev:server`.
MAKE SURE YOU ARE ON "http://localhost:3000" AND NOT OTHER, ELSE SERVER REJECT ED ERROR IWLL COME!

## Host locally

This section is for private self-hosting where you want the app fully local on your own machine.

### 1. System requirements

- Node.js 22.x (matches `.nvmrc`)
- pnpm 10+
- Python 3.10+
- Git

### 2. Clone and install

```bash
git clone <your-private-repo-url>
cd server
pnpm install
```

Install Python dependencies used for APKG generation:

```bash
python3 -m venv .venv
. .venv/bin/activate
python -m ensurepip --upgrade
python -m pip install -r create_deck/requirements.txt
```

### 3. Create environment files

Create root `.env`:

```env
SECRET=change-me-to-long-random-string
WORKSPACE_BASE=/tmp/2anki-workspaces
UPLOAD_BASE=/tmp/2anki-uploads
LOCAL_DEV=true
PORT=2020

# Required at startup by Stripe/Spaces integrations even in local mode
STRIPE_KEY=sk_test_local_placeholder
SPACES_ENDPOINT=https://nyc3.digitaloceanspaces.com
SPACES_REGION=us-east-1
SPACES_DEFAULT_BUCKET_NAME=local-dev-placeholder

# Force deck generation to use local virtualenv python
PYTHON="/absolute/path/to/server/.venv/bin/python"
```

Create `web/.env`:

```env
REACT_APP_LOCALHOST=
REACT_APP_RELEASE=local
REACT_APP_DROPBOX_APP_KEY=
REACT_APP_GOOGLE_CLIENT_ID=
REACT_APP_GOOGLE_API_KEY=
```

Create local working directories:

```bash
mkdir -p /tmp/2anki-workspaces /tmp/2anki-uploads
```

### 4. Run app

```bash
pnpm dev
```

- Web: `http://localhost:3000`
- API: `http://localhost:2020`

In this local mode (`LOCAL_DEV=true`), local usage limits and paywalls are disabled so self-host users can run unlimited local conversions.

### 5. Verify conversion

Example with a local file upload:

```bash
curl -sS \
  -H 'Origin: http://localhost:3000' \
  -F 'pakker=@/absolute/path/to/file.zip' \
  http://localhost:2020/api/upload/file \
  -o out.apkg -D headers.txt
```

You should get `HTTP/1.1 200 OK` and an `.apkg` output.

### 6. Optional Notion OAuth (not required for file uploads)

If you only upload HTML/Markdown/ZIP exports, you can skip Notion OAuth entirely.

If later needed, add:

- `NOTION_CLIENT_ID`
- `NOTION_CLIENT_SECRET`
- `NOTION_REDIRECT_URI`

### 7. Push to your private GitHub repository

If this is a fresh private fork or copy:

```bash
git init
git add .
git commit -m "chore: private self-host baseline"
git branch -M main
git remote add origin <your-private-repo-url>
git push -u origin main
```

If this repo already has a remote and you want to point to your private repo:

```bash
git remote set-url origin <your-private-repo-url>
git push -u origin main
```

## How we develop

Every change that touches user-facing behavior goes through a **product trio** — three AI agents (PM, Designer, Engineer) working in parallel at the center of the loop. Alexander (lead developer) is the human in the loop: he sets direction, approves specs, and merges PRs. The goal is to catch bad assumptions before engineering time is committed.

<p align="center">
  <img src="web/public/trio-flow.svg" alt="2anki product trio kaizen loop — signal to ship in hours" />
</p>

The trio is powered by Claude subagents in `.claude/agents/`. Use `/trio <task>` to invoke all three in parallel on any prompt.

## Contributing

We'd love your help! See [CONTRIBUTING.md](./CONTRIBUTING.md) for how to get started, run the test gate, and submit a PR.

## Supported by

<p>This project is supported by:</p>
<p>
  <a href="https://www.digitalocean.com/?utm_medium=opensource&utm_source=2anki">
    <img src="https://opensource.nyc3.cdn.digitaloceanspaces.com/attribution/assets/SVG/DO_Logo_horizontal_blue.svg" width="201px" alt="DigitalOcean" />
  </a>
</p>

## License

The code is licensed under the [MIT](./LICENSE) Copyright (c) 2020-2026, [Alexander Alemayhu](https://alemayhu.com). See [CREDITS.md](./CREDITS.md) for contributors.
