# Stupid Game: project overview and story so far

Stupid Game 🤪 is a silly pass-the-device number guessing game for the web. Two players share one phone, take turns secretly choosing a number from 1 to 1000 for the other to guess, and whoever needs fewer guesses wins the round. There is also a solo mode against a random number.

This `openspec/` folder was added on 2026-11-02 to document the game as it already stood. Everything below was reverse-engineered from the code and git history, because the game was built in Claude Code cloud sessions before the project used OpenSpec.

## Where things live

| Path | What it is |
| --- | --- |
| `openspec/specs/` | The current behaviour, one capability per folder. This is the source of truth. |
| `openspec/changes/archive/` | One reconstructed proposal per past change, recording why it was made. |
| `openspec/changes/` | Where new proposals go (for example via `/opsx:propose`). |
| `openspec/config.yaml` | OpenSpec settings and project context for AI assistants. |

## Capabilities

| Capability | Summary |
| --- | --- |
| [`two-player-match`](specs/two-player-match/spec.md) | Name entry, random first picker, handoffs, picking, guessing, turn summary, round result and scoreboard |
| [`solo-mode`](specs/solo-mode/spec.md) | One player guesses a random number, round after round |
| [`number-entry`](specs/number-entry/spec.md) | On-screen keypad and 1-1000 validation |
| [`guess-feedback`](specs/guess-feedback/spec.md) | Higher/lower/correct, attempt counter, guess history, flashing popup |
| [`game-reset`](specs/game-reset/spec.md) | Footer Reset Game with in-page confirmation |
| [`share-game`](specs/share-game/spec.md) | Share link via native share sheet or clipboard |
| [`app-shell`](specs/app-shell/spec.md) | Static site, single-screen flow, mobile layout, Netlify deploy |

## Tech stack

- Plain HTML (`index.html`), CSS (`styles.css`) and vanilla JavaScript (`app.js`, a single IIFE). No framework, build step, dependencies or backend.
- All state is in memory for one page load; nothing is stored.
- Deployed as a static site on Netlify via `netlify.toml`.
- No automated tests; changes have been checked by playing the game in a browser.

## The story so far

All work was done by Claude in Claude Code cloud sessions and merged by Tim Shaw (`tdshaw2000`). PRs #1 to #5 came from one long session on branch `claude/stupid-game-web-app-tx5foi`; PR #6 came from a separate session on `claude/game-higher-lower-popup-mc9mhc`.

**18 September 2026: from nothing to a playable game (PR #1)**
1. [Add Stupid Game](changes/archive/2026-09-18-add-stupid-game/proposal.md): the first version, two players, rounds, scoring, a "New Match" button, Render deploy config.
2. [Carry players across matches and add Reset Game](changes/archive/2026-09-18-carry-players-and-reset/proposal.md): keep players between matches, reveal the secret on a win, add Reset Game. `window.confirm()` silently failed in sandboxed previews, so it became an in-page overlay in the footer. "New Match" was then dropped as redundant.
3. [Deploy to Netlify instead of Render](changes/archive/2026-09-18-deploy-to-netlify/proposal.md): no backend needed, so a plain static host.

**18 September 2026: making it work on real phones (PRs #2 to #4)**
4. [Fix footer pushed off-screen on mobile](changes/archive/2026-09-18-fix-mobile-footer/proposal.md) (PR #2): stop forcing `100vh`, which hid the footer below the fold.
5. [Add solo game mode](changes/archive/2026-09-18-add-solo-mode/proposal.md) (PR #3).
6. [Replace number inputs with an on-screen keypad](changes/archive/2026-09-18-add-number-keypad/proposal.md) (PR #4): the native keyboard kept covering the game.

**19 September 2026: polish (PRs #5 and #6)**
7. [Add a share button](changes/archive/2026-09-19-add-share-button/proposal.md) (PR #5).
8. [Add a flashing Higher/Lower popup](changes/archive/2026-09-19-add-higher-lower-popup/proposal.md) (PR #6).

## Themes from the history

- **Mobile first, learned the hard way.** Three of the eight changes fixed things that only showed up on real phones: header overlap, the `100vh` footer bug and the native keyboard.
- **Avoid browser dialogs.** `window.confirm()` failed silently in sandboxed previews; in-page overlays are used instead. The share fallback still uses `window.prompt` as a last resort.
- **One way to do each thing.** "New Match" was removed because it duplicated Reset Game.

## Known gaps and loose ends

- No persistence: reloading the page loses players and scores.
- Solo mode tracks no score or best attempt count across rounds.
- No automated tests.
