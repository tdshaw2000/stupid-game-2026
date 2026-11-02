# Add Stupid Game

> Reconstructed after the fact from git history. This change was built in a Claude Code cloud session before the project used OpenSpec, so only the proposal is recorded here; the resulting behaviour lives in `openspec/specs/`.

**Shipped in:** PR #1, commit fe97747

## Why
A silly pass-the-device number guessing game that two people can play on one phone, with nothing to install.

## What Changes
- Static HTML/CSS/JS app: players enter names, one is randomly chosen to secretly pick a number from 1 to 1000, the other guesses with higher/lower/correct feedback.
- Each round is one turn per player; fewer attempts wins, ties are declared; further rounds keep a running score, or a "New Match" starts afresh.
- Included a `render.yaml` for deploying as a Render static site (later replaced, see `2026-09-18-deploy-to-netlify`).

## Capabilities
- New: `two-player-match`, `guess-feedback`, `app-shell`
