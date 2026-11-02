# solo-mode Specification

## Purpose
A single-player variant where the app picks the secret number and one person guesses, round after round, with no handoffs.

## Requirements

### Requirement: Starting a solo game
The name-entry screen SHALL offer a "Solo Game" button, below the two-player form and an "or" divider. Tapping it SHALL start a solo game for a player named "You" without requiring any names.

#### Scenario: Start solo
- **WHEN** the user taps "Solo Game"
- **THEN** the guessing screen appears immediately with the banner "Guess the number (1-1000)"
- **AND** no handoff or picking screen is shown

### Requirement: Random secret per solo round
Each solo round SHALL use a secret chosen uniformly at random from 1 to 1000 by the app.

#### Scenario: Fresh secret each round
- **WHEN** a new solo round starts
- **THEN** a new random secret is chosen and the attempt count and guess history are cleared

### Requirement: Solo round loop
A correct guess SHALL show the same turn summary as two-player mode (secret revealed, attempt count). "Continue" SHALL immediately start a new solo round instead of showing a round result or scoreboard.

#### Scenario: Continue in solo
- **WHEN** the solo player guesses correctly and taps "Continue"
- **THEN** a new solo round starts on the guessing screen
