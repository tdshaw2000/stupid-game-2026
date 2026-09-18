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

## Deploying on Render

This repo includes a `render.yaml` for Render's [Static Site](https://render.com/docs/static-sites)
hosting (Infrastructure as Code / Blueprints):

1. Push this repo to GitHub.
2. In Render, choose **New +** → **Blueprint**, and point it at this repo. It will pick up
   `render.yaml` automatically.
3. Alternatively, create a **Static Site** manually with:
   - **Build Command:** (leave empty)
   - **Publish Directory:** `.`

No environment variables or backend services are needed — all game state lives in the
browser for the duration of the session.
