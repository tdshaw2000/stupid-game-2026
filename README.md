# Stupid Game 🤪

A pass-the-device, two-player number guessing game for the web.

## How to play

1. Both players enter their names.
2. The app randomly picks one player to secretly choose a number between 1 and 1000.
3. The device is passed to the other player, who guesses the number and gets told **higher**,
   **lower**, or **correct** after each guess.
4. Roles then swap — the guesser becomes the picker for the second turn of the round.
5. Whoever guessed their opponent's number in fewer attempts wins the round (a tie is a tie).
6. Play another round (score carries over) or start a brand new match.

## Running locally

This is a static site — no build step or dependencies required. Serve the folder with any
static file server, for example:

```bash
npx serve .
# or
python3 -m http.server 8000
```

Then open the printed URL in your browser.

## Deploying on Netlify

This repo includes a `netlify.toml` so Netlify picks up the right settings automatically:

1. Push this repo to GitHub (already done if you're reading this from the repo).
2. In [Netlify](https://app.netlify.com), sign in with GitHub and choose **Add new site** →
   **Import an existing project** → **GitHub**, then select this repo.
3. Netlify reads `netlify.toml` automatically (publish directory `.`, no build command) — just
   click **Deploy**.
4. Every push to the deployed branch redeploys automatically.

No environment variables or backend services are needed — all game state lives in the
browser for the duration of the session.
