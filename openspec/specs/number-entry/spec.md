# number-entry Specification

## Purpose
How players enter numbers (secrets and guesses) without the phone's native keyboard covering the game.

## Requirements

### Requirement: On-screen numeric keypad
The picking and guessing screens SHALL each provide an on-screen keypad with keys 0-9, "Clear" and backspace (⌫). The number fields SHALL be read-only with `inputmode="none"` so the device's native keyboard does not open. Player name fields SHALL continue to use the native keyboard.

#### Scenario: Typing with the keypad
- **WHEN** the guesser taps 4, 2, 0 on the keypad
- **THEN** the guess field shows 420 and no native keyboard appears

#### Scenario: Backspace and clear
- **WHEN** the field shows 420 and the user taps ⌫
- **THEN** the field shows 42
- **AND** tapping "Clear" empties the field

### Requirement: Digit limit
The keypad SHALL ignore digit presses once the field holds as many digits as the maximum number (4 digits for 1000).

#### Scenario: Fifth digit ignored
- **WHEN** the field shows 1234 and the user taps 5
- **THEN** the field still shows 1234

### Requirement: Range validation
A submitted secret or guess SHALL be accepted only if it is a whole number from 1 to 1000. Otherwise the app SHALL show "Please enter a whole number between 1 and 1000." and not count an attempt. Any keypad press SHALL hide the error.

#### Scenario: Out-of-range guess
- **WHEN** the guesser submits 1234
- **THEN** the validation error is shown and the attempt count does not change

#### Scenario: Zero rejected
- **WHEN** the picker submits 0
- **THEN** the validation error is shown and the secret is not locked in
