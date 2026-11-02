# Design: remote play

## Constraints from the repo
- `openspec/config.yaml`: static site, **no build step, framework or backend unless explicitly proposed**. This proposal is that explicit proposal for a small backend.
- Phones first; no browser dialogs; no automated tests.
- Netlify static deploy (`netlify.toml`, `publish = "."`). Netlify Functions and Blobs are the lowest-friction backend because they deploy from the same repo.
- Today all logic is client-side in `app.js`: the secret lives in a JS variable and the guess is compared locally. Remote play needs something *other than the guesser's browser* to hold or check the secret.

## Shape of the game
The existing round is symmetric (each player picks and guesses, fewer attempts wins). Remote play can be **asynchronous**: the two players don't need to be online at once.

1. Originator picks a secret and creates a game -> link/QR.
2. Opponent opens link, guesses until correct -> attempts recorded.
3. Originator is told the attempt count. *(Optional round trip, Decision 2: the opponent also picks a secret during the same visit, and the originator guesses it next time they open the app, completing a normal two-turn round and winner.)*

## Transport options

### A. URL-encoded state, no backend
Game state lives in the URL fragment (`#g=...`); results come back as a second link the opponent sends manually (share sheet / message).
- **Fair?** No. The opponent's browser must be able to check guesses, so the secret (or its key) is in the URL. Anyone can read it from the address bar or devtools. Hashing doesn't help: 1,000 possible values are trivially brute-forced.
- **Result back:** manual only; not "sent to the originator".
- **Cost/complexity:** zero hosting cost, smallest code. Fits the "no backend" rule.
- **Verdict:** fine as a trusting-friends toy, but it fails "result is sent back" and cheating is one tap away.

### B. Netlify Function + Netlify Blobs (recommended)
Two or three small serverless endpoints; game record stored in a Blob keyed by an unguessable game id.
- `POST /api/games` {name, secret} -> `{id, ownerToken}` (secret stored server-side only)
- `POST /api/games/:id/guess` {guess, name} -> `higher | lower | correct`, server counts attempts
- `GET /api/games/:id` (with `ownerToken`) -> status/result; the originator's page polls every few seconds while open and also refreshes on load
- **Fair?** Yes. The secret never leaves the server until the game is over; attempts are counted server-side, so refreshing or replaying can't reset the count.
- **Originator offline:** result is stored, so they see it whenever they next open the link (stronger than "if still online"). Browser push notification is an optional extra, not needed for v1.
- **Opponent offline mid-game:** each guess needs a connection; the UI shows a retry. State is server-side so they can resume by reopening the link.
- **Cost:** Netlify free tier should easily cover casual use (a game is roughly 10-15 requests). Check current Netlify function/Blobs limits before launch; they change.
- **Complexity:** moderate. Adds a `netlify/functions/` directory, a `package.json` for `@netlify/blobs`, a `netlify.toml` change (functions dir). The front end remains static, no build step for the client.

### C. Peer-to-peer (WebRTC, e.g. PeerJS)
Link/QR contains the originator's peer id; the opponent's phone connects directly and the originator's phone evaluates guesses.
- **Fair?** Yes (secret stays on the originator's device).
- **Result back:** instant, but only while the originator keeps the app open and in the foreground. Mobile browsers suspend background tabs, so this fails often in practice. "Originator gone" means the game is dead.
- **Cost:** free, but depends on a third-party public broker; WebRTC across mobile carrier NAT sometimes needs a TURN server (cost).
- **Verdict:** the most literal match to "assuming they're still online", but the least reliable.

### D. Hosted realtime service (Ably, Pusher, Supabase, Firebase)
- Similar fairness to B only if logic runs server-side; otherwise the secret is exposed again. Needs an account, API keys and a deploy-secrets step; free tiers exist but add a vendor. More moving parts than B for the same outcome.

| | A: URL only | **B: Netlify fn + Blobs** | C: WebRTC | D: Realtime SaaS |
|---|---|---|---|---|
| Secret kept fair | no | **yes** | yes | only with server logic |
| Result reaches originator | manual | **automatic, even later** | only while online | yes |
| Originator can be offline | n/a | **yes** | no | partly |
| New infra | none | **Netlify (already used)** | 3rd-party broker | new vendor + keys |
| Complexity | low | **medium** | medium-high | medium-high |

## Fairness details (for B)
- Game id: 128-bit random, base64url, so links can't be guessed or enumerated. No accounts.
- Secret stored only in the record and never returned until the game ends. The owner token (kept in the originator's `localStorage`) gates reading the result; the opponent link carries only the id.
- One opponent per game: first join claims it (cookie/`localStorage` token) so a forwarded link can't be replayed by a third person.
- Basic rate limit per game on guesses (the game already allows unlimited guesses, and binary search finds any number in 10; the limit only stops hammering).
- TTL (suggest 7 days) after which records are deleted. Games with no result expire silently and the originator's page says so.

## QR code
- Client-side generation, no network call. Smallest option: vendor a ~20 KB MIT QR library (e.g. `qrcode-generator`) as a plain file in the repo, no build step, rendered to an inline `<svg>`/canvas.
- Alternative: skip the QR and rely on the link plus the existing share sheet. QR is mainly useful when both people are in the same room, which is when pass-the-device is easy anyway, so it's a nice-to-have. Adds a (small, vendored) dependency, so it's a decision.

## Routing
Link form `https://<site>/?g=<id>` (query string, not fragment, so the Function-served API and any future server-side rendering can see it; the page is still static). `app.js` checks the param on load: with it, show the join/guess flow instead of name entry. No client-side router needed.

## Out of scope for v1
Accounts, push notifications, spectators, more than two players, rematch history, anti-bot hardening beyond the rate limit.

## Decisions needed (recommendation first)
1. **Transport.** Recommend **B (Netlify Function + Blobs)**. It's the only option that is fair *and* delivers results without both phones being online. Needs your OK to add a backend, a `package.json` dependency (`@netlify/blobs`) and a `netlify.toml` change, which breaks the repo's current "no backend" rule.
2. **Game shape.** (a) one-way challenge: opponent guesses originator's number, originator sees the attempt count. (b) **Recommended: full async round**: the opponent also picks a number in the same visit, the originator guesses it when they return, and the winner is decided as in `two-player-match`. (b) keeps parity with the existing game and gives the originator something to do, but needs a second state transition and a "waiting for you" screen.
3. **QR code.** Recommend vendoring a small MIT QR library. Alternative: link + share sheet only.
4. **Expiry and cleanup.** Recommend 7-day TTL. Alternative: 24h or 30 days.
5. **Pass-the-device mode.** Recommend keeping it unchanged alongside remote play (no removal).
6. **Anonymity.** Recommend no accounts or analytics; only names the players type and the game record are stored. Confirm that's acceptable for the privacy posture you want.
7. **Cost guardrail.** Recommend free tier only for now, with a note in the README. Say if you want a hard cap or monitoring.

## Next steps once decided
Convert this into spec deltas (`remote-play` new; modified `two-player-match`, `share-game`, `app-shell`), a `tasks.md`, then implement in a follow-up PR, verifying at phone width with two browser profiles.
