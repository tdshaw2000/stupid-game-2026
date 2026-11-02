# Add remote two-player play via link / QR code

> **Status: exploration only.** Nothing here is implemented. This proposal lays out the options and a recommendation, and lists the decisions needed before anyone writes code or specs deltas.

## Why
Two-player mode needs a single device passed between players (`two-player-match`). The goal: one person sets up a game and gets a QR code or unique URL; the opponent opens it on their own phone, plays, and the result goes back to the originator at the end (assuming they are still around).

## What Changes (proposed)
- A new "Challenge a friend" entry point next to the existing pass-the-device mode (which stays).
- Originator enters their name and a secret number, and gets a unique game link plus a QR code (and the existing native-share/copy flow from `share-game`).
- The opponent opens the link, enters a name, guesses the secret on their own phone, and their attempt count is delivered to the originator.
- Originator sees the result (and optionally plays the return turn, see Decision 2).

## Capabilities
- New: `remote-play` (challenge creation, join, guessing, result delivery, expiry)
- Modified: `two-player-match` (mode selection), `share-game` (QR code) , `app-shell` (routing on `?g=` / `#g=`)

## Open decisions
See `design.md` → "Decisions needed". Recommended answers are marked, so a plain "go with the recommendation" is enough.
