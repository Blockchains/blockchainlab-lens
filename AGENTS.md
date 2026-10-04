# AGENTS.md: blockchainlab-lens

Instructions for AI coding agents (Grok, Cursor, Claude Code, Codex, Copilot and others) working **in** this repo or **using it as a building block**. Humans: see [README.md](README.md).

## What this is

One-click explainer for Etherscan-family and Blockscout explorers: a Manifest V3 extension and a bookmarklet that open the matching blockchainlab-tools page. Its URL detector (`extension/detect.js`) is a reusable UMD module.

- Kind: browser-extension, library · stability: `stable` · licence: MIT
- Machine-readable manifest: [`blocks.json`](blocks.json) (schema: [BLOCKS-SCHEMA](https://github.com/Blockchains/.github/blob/main/docs/BLOCKS-SCHEMA.md))
- How it fits with the other Blockchains repos: [Build with Blocks](https://github.com/Blockchains/.github/blob/main/docs/BUILD-WITH-BLOCKS.md)

## Setup

```bash
pip install playwright && python -m playwright install chromium
```

## Build and test

```bash
python test_extension.py   # loads the real unpacked extension in Chromium
```

Tests hit **live** public networks/APIs (the org rule is no mocks). A failure can be an upstream outage: re-run before changing code.

## Structure

| Path | What |
|---|---|
| `extension/detect.js` | URL/text → tools deep link (UMD: browser global + CommonJS) |
| `extension/content.js, background.js, popup.*` | MV3 extension |
| `bookmarklet/` | bookmarklet source and encoded form |
| `index.html` | install page |
| `test_extension.py` | Playwright test |

## Conventions

- Permissions stay minimal (`contextMenus` + explorer content scripts).
- No analytics or data collection.

## Extension points

- New explorer: add the host → chain mapping in `extension/detect.js` and the manifest match list, then a test case.

## Do

- Keep `detect.js` dependency-free so it can be loaded with a plain script tag.

## Don't

- Request broad host permissions.
- Invent data, mock network responses in shipped code, or hard-code values that should come from the live source; every repo here is 'no mocks, real data'.
- Commit secrets, keys or `.env` files. Run `gitleaks` before pushing; CI and the org policy reject leaks.

## Using it from another project

- **BLLens (detect.js)** (browser-script): `<script src="https://blockchains.github.io/blockchainlab-lens/extension/detect.js"></script>`
- **extension/** (file): `chrome://extensions → Load unpacked → extension/`
- **bookmarklet** (web): `https://blockchains.github.io/blockchainlab-lens/`

See the README section [Use as a building block](README.md#use-as-a-building-block) for a copy-paste example.

## Related blocks

- [Blockchains/blockchainlab-tools](https://github.com/Blockchains/blockchainlab-tools): every explanation is a tools page
- [Blockchains/blockchainlab-api](https://github.com/Blockchains/blockchainlab-api): use with API data in dashboards (Build with Blocks recipe 3)
- [Blockchains/blockchainlab-mcp](https://github.com/Blockchains/blockchainlab-mcp): same deep links in MCP results
