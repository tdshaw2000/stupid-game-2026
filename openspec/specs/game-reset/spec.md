# game-reset Specification

## Purpose
A single, always-available way to abandon the current game and return to a blank start screen.

## Requirements

### Requirement: Reset Game in the footer
The page footer SHALL always show a "↺ Reset Game" control alongside the "Pass the device, don't peek!" tagline.

#### Scenario: Reset is reachable mid-turn
- **WHEN** a player is on the guessing screen
- **THEN** the Reset Game control is visible in the footer

### Requirement: In-page confirmation when there is progress
When a game is in progress (players exist), tapping Reset Game SHALL open an in-page confirmation overlay with "Cancel" and "Reset Game" buttons, rather than a browser `confirm()` dialog (which fails silently in sandboxed previews). The wording SHALL be "Reset the whole game? This clears both players and all scores." in two-player mode and "Reset the game? This clears your progress." in solo mode. With no game in progress, Reset Game SHALL reset immediately without confirmation.

#### Scenario: Cancel
- **WHEN** the overlay is open and the user taps "Cancel"
- **THEN** the overlay closes and the game continues unchanged

#### Scenario: Solo wording
- **WHEN** the user taps Reset Game during a solo game
- **THEN** the overlay reads "Reset the game? This clears your progress."

### Requirement: Full reset
Confirming a reset SHALL clear players, scores, round number, the in-progress turn and the name fields, set the mode back to two-player, and show the name-entry screen.

#### Scenario: Confirm reset
- **WHEN** the user confirms the reset at a score of 3-2
- **THEN** the name-entry screen appears with empty name fields and no scores remain
