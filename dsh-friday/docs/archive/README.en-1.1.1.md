# DSH Friday 1.1.1

[简体中文](README-1.1.1.md)

Click the Jarvis particle orb or press `Option + Space` to ask Friday a question on macOS. The quick session can use `web_search`. Open Inbox from the panel or the DSH sidebar to search, review sources and images, or continue the same conversation. Each answer’s source list starts collapsed. Select **Sources** to expand it.

## Install and use

1. On macOS 14 or later, install Node.js 22.18 or later and a Swift 6 toolchain. Run `npm ci` and `npm run build` from this directory.
2. Install this directory in the DSH plugin manager. If an earlier Friday installation uses the same package name, update its local source. The plugin reads existing Friday session IDs and promotion mappings.
3. Select and save a model in Friday’s plugin settings, or inherit the DSH default shown there. The selection applies to new conversations. Existing conversations keep their model. Configure a vision model, hotkey, and retention on the same settings page. The Inbox and desktop panel follow the text and code sizes in DSH General settings as they change. Web search uses the search service configured in DSH.
4. Choose **Upgrade** in the panel or Inbox, edit the compressed brief, select or create a workspace, and confirm. The task opens with the reviewed brief and waits for your next instruction. The archived Inbox record links back to that task.

## Verification

Run `npm test` for Friday and `npm run test:upstream` for the retained Jarvis tests. The native suite uses `swift test --package-path macos` and requires Xcode with XCTest.

The local integration check used an isolated DSH profile with deterministic model and search providers. DSH can briefly display live quick sessions under Ungrouped until the agent is released. Inbox cleanup uses native archival.

[Archived upstream documentation](README.en-0.7.1.md) · [MIT license](../../LICENSE)
