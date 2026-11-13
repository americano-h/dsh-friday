[简体中文](README.md)

# Friday Inbox · a DSH quick-chat plugin

> - Product name: Friday Inbox (sidebar entry: `Inbox`)
> - Package: `dsh-friday`
> - Implementation described here: 0.1.0 (working)
> - Current product requirements: [DSH Friday PRD 1.0.0](docs/PRD.md)
> - Isolated source: `deepseek-v4.1 flash/`

## What it is

Friday Inbox adds a lightweight, "ask and leave" channel to DeepSeek Harness:

> - Press `Option + Space` inside DSH to open a floating quick-chat overlay with a web-search-only tool set.
> - Conversations persist in real time as native DSH Sessions and settle into a new `Inbox` sidebar entry, never into a workspace.
> - Inbox conversations are searchable, continuable, and can be compressed and upgraded into a full-tool task in a chosen workspace. The source conversation is archived and cannot be upgraded twice.

## Status

> - Stage: 0.1.0 implemented, installed, integration-tested, and independently reviewed three times.
> - Source: `deepseek-v4.1 flash/`; prebuilt `client.js` included, no build needed to install.
> - Tests: 11/11 Host unit tests pass; see `docs/process/06-test-report.md`.
> - Known limits: OS-level global hotkey is unavailable to a Web plugin; deletion is a soft archive; PTC presets are not supported for the web-search whitelist.

## Implemented

> - **L1 quick chat**: in-page global hotkey, compact overlay, streaming Markdown, stop, 5-minute resume, new chat, image paste/drag/file picker, citations by default.
> - **L2 Inbox**: first-class sidebar entry, list/detail, search over questions and answers, finder, continue, archive, soft delete, clear, 30-day retention.
> - **L3 upgrade**: model summarization, workspace picker, new workspace, full-tool task creation, source archive, no duplicate upgrade.
> - **Settings**: default model, vision model, hotkey, retention.
> - **Security**: two-layer `web_search` whitelist; authenticated same-origin API; Inbox-only attachment/archive/cancel.

## Documentation

- [Current PRD (1.0.0)](docs/PRD.md)
- [Archived PRD (0.3.0), baseline for this implementation](docs/archive/PRD-0.3.0.md)
- [Technical selection](docs/process/01-tech-selection.md)
- [Architecture](docs/process/02-architecture.md)
- [Sub-agent and model log](docs/process/03-model-and-subagent-log.md)
- [Test report](docs/process/06-test-report.md)
- [Plugin README](deepseek-v4.1%20flash/README.md)

## Quick start

1. Install `deepseek-v4.1 flash/` from the DSH plugin manager's local-directory flow.
2. Press `Option + Space` anywhere in DSH.
3. Open `Inbox` in the sidebar to browse, search, continue, or upgrade.
4. Configure models, hotkey, and retention on the Friday Inbox plugin page.

## License

MIT
