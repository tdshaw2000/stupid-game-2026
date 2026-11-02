# app-shell Specification

## Purpose
How the app is built, laid out and deployed: a dependency-free static site tuned for phones.

## Requirements

### Requirement: Static, client-only app
The app SHALL be plain HTML, CSS and JavaScript (`index.html`, `styles.css`, `app.js`) with no build step, dependencies or backend. All game state SHALL live in memory in the browser for the current page load only; reloading the page starts over.

#### Scenario: Reload
- **WHEN** the page is reloaded mid-game
- **THEN** the app returns to the name-entry screen

### Requirement: Netlify deployment
The repository SHALL include a `netlify.toml` that publishes the repository root with no build command, so the site deploys on Netlify by importing the GitHub repo.

#### Scenario: Push redeploys
- **WHEN** a commit is pushed to the deployed branch
- **THEN** Netlify republishes the static files as-is

### Requirement: Single-screen flow
The app SHALL show exactly one game screen at a time (name entry, handoff, picking, guessing, turn summary or round result) inside a card no wider than 480px, under a "🤪 Stupid Game" header and above the footer.

#### Scenario: Screen change
- **WHEN** the app moves from picking to handoff
- **THEN** the picking screen is hidden and only the handoff screen is visible

### Requirement: Mobile-friendly layout
The layout SHALL size to its content and be vertically centred in the viewport, rather than forcing a full `100vh` height, so the footer sits directly below the game card on real mobile browsers (where `100vh` can exceed the visible area). Taller content, such as a long guess history, SHALL scroll normally.

#### Scenario: Short phone viewport
- **WHEN** the app is opened in a mobile browser with the address bar visible
- **THEN** the footer with Reset Game is visible below the card without hidden off-screen space
