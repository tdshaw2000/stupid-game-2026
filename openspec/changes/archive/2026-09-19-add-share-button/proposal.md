# Add a share button

> Reconstructed after the fact from git history. This change was built in a Claude Code cloud session before the project used OpenSpec, so only the proposal is recorded here; the resulting behaviour lives in `openspec/specs/`.

**Shipped in:** PR #5, commits 4a0c269, f903b24

## Why
Make it easy to invite friends to play.

## What Changes
- Share button on the start screen using the Web Share API, falling back to copying the link with a "Link copied!" note, then to a `window.prompt`.
- Label changed from "Share this game" to "Share Stupid Game" so it does not read as sharing the game in progress (f903b24).

## Capabilities
- New: `share-game`
