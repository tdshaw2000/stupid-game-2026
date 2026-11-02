# Fix footer pushed off-screen on mobile

> Reconstructed after the fact from git history. This change was built in a Claude Code cloud session before the project used OpenSpec, so only the proposal is recorded here; the resulting behaviour lives in `openspec/specs/`.

**Shipped in:** PR #2, commit 2c42dff

## Why
On real phones the footer (tagline and Reset Game) sat below the fold with no hint to scroll, because the layout forced `min-height: calc(100vh - 48px)` and mobile `100vh` is taller than the visible area. A leftover `margin-top: 20vh` on the handoff card made it worse.

## What Changes
- Let the layout size to its content, centred vertically on the body, and removed the stray margin, so the footer sits directly under the card.

## Capabilities
- Modified: `app-shell`
