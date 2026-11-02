# guess-feedback Specification

## Purpose
How the guesser learns whether to go higher or lower after each guess.

## Requirements

### Requirement: Higher / lower / correct result
Each valid guess SHALL be classified as "higher" (the secret is above the guess), "lower" (the secret is below the guess) or "correct".

#### Scenario: Guess too low
- **WHEN** the secret is 500 and the guess is 300
- **THEN** the result is "higher"

### Requirement: Inline feedback and attempt counter
The guessing screen SHALL show a running "N attempt(s) so far" counter and an inline message for the latest guess: "⬆️ Higher!", "⬇️ Lower!" or "🎯 Correct!". The guess field SHALL be cleared after each valid guess.

#### Scenario: Counter updates
- **WHEN** the guesser makes their first valid guess
- **THEN** the counter reads "1 attempt so far"

### Requirement: Guess history
The guessing screen SHALL list every guess made this turn, newest first, each with its hint (⬆️ Higher, ⬇️ Lower or 🎯 Correct!). The correct guess SHALL be visually highlighted.

#### Scenario: History order
- **WHEN** the guesser has guessed 300 then 700
- **THEN** the history shows 700 above 300

### Requirement: Flashing higher/lower popup
For each "higher" or "lower" result the app SHALL briefly flash a large full-screen overlay with an arrow and the word HIGHER (blue, ⬆) or LOWER (red, ⬇), which scales in and fades out over about 0.8 seconds. The overlay SHALL NOT block taps, SHALL restart on every guess even if the direction repeats, and SHALL NOT appear for a correct guess.

#### Scenario: Two lows in a row
- **WHEN** the guesser makes two consecutive guesses that are both too high
- **THEN** the LOWER popup flashes once for each guess

#### Scenario: Correct guess
- **WHEN** the guess is correct
- **THEN** no popup is shown
