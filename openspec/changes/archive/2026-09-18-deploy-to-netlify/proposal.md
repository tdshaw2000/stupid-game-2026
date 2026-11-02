# Deploy to Netlify instead of Render

> Reconstructed after the fact from git history. This change was built in a Claude Code cloud session before the project used OpenSpec, so only the proposal is recorded here; the resulting behaviour lives in `openspec/specs/`.

**Shipped in:** PR #1, commit f5d5c05

## Why
The game needs no backend, so a plain static host is simpler.

## What Changes
- Replaced `render.yaml` with `netlify.toml` (publish `.`, no build command).
- Updated README deployment instructions.

## Capabilities
- Modified: `app-shell`
