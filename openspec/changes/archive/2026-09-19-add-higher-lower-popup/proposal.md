# Add a flashing Higher/Lower popup

> Reconstructed after the fact from git history. This change was built in a Claude Code cloud session before the project used OpenSpec, so only the proposal is recorded here; the resulting behaviour lives in `openspec/specs/`.

**Shipped in:** PR #6, commit cc924a1 (branch `claude/game-higher-lower-popup-mc9mhc`, a separate Claude Code session)

## Why
The inline hint was easy to miss; a big flash makes each wrong guess obvious.

## What Changes
- A bright, full-screen, non-blocking overlay with an arrow and HIGHER/LOWER text flashes and fades on every wrong guess, alongside the existing inline feedback and history.

## Capabilities
- Modified: `guess-feedback`
