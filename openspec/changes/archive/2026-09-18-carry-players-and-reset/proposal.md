# Carry players across matches and add Reset Game

> Reconstructed after the fact from git history. This change was built in a Claude Code cloud session before the project used OpenSpec, so only the proposal is recorded here; the resulting behaviour lives in `openspec/specs/`.

**Shipped in:** PR #1, commits b9f8ea7, bbf20e1, dba44b4, 2ae76b3

## Why
Starting another match meant re-typing names, there was no way to abandon a game, and the winner never saw the number they had found.

## What Changes
- "New Match" reused the same players and only reset the scoreboard (b9f8ea7).
- Added a persistent "Reset Game" control that clears players, scores and the current turn, with confirmation when a game is in progress (b9f8ea7).
- The turn summary reveals the secret number, then was restyled to lead with it in large type above the emoji (b9f8ea7, bbf20e1).
- Fixed the header so Reset Game no longer overlapped the title on narrow screens (bbf20e1).
- Reset Game appeared to do nothing because `window.confirm()` is blocked in sandboxed previews; replaced with an in-page Cancel / Reset overlay and moved the control to the footer (dba44b4).
- Removed "New Match" because it overlapped with Reset Game; the round result now only offers "Next Round" (2ae76b3).

## Capabilities
- New: `game-reset`
- Modified: `two-player-match` (secret revealed on win, players persist, no New Match)
