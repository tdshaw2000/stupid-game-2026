# Add solo game mode

> Reconstructed after the fact from git history. This change was built in a Claude Code cloud session before the project used OpenSpec, so only the proposal is recorded here; the resulting behaviour lives in `openspec/specs/`.

**Shipped in:** PR #3, commit 9478659

## Why
Let one person play alone against a random number.

## What Changes
- "Solo Game" button under "Let's Play!" goes straight to guessing a random number, with no handoff or pick screens.
- "Continue" after a correct guess starts a new solo round instead of a round result.
- Reset Game's confirmation wording adapts for solo play.

## Capabilities
- New: `solo-mode`
- Modified: `game-reset`
