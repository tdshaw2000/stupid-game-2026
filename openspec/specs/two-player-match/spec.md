# two-player-match Specification

## Purpose
The core pass-the-device game: two players share one device, take turns secretly picking a number between 1 and 1000 for the other to guess, and whoever needs fewer guesses wins the round. Rounds repeat with a running score.

## Requirements

### Requirement: Player name entry
The app SHALL start on a name-entry screen with two name fields (max 20 characters each) and a "Let's Play!" button. Names are trimmed; a field left blank after trimming SHALL fall back to "Player 1" or "Player 2" respectively.

#### Scenario: Starting a match with names
- **WHEN** the players enter "Alex" and "Sam" and tap "Let's Play!"
- **THEN** a new two-player match starts with both players on 0 rounds won and round number 1

#### Scenario: Whitespace-only name
- **WHEN** a name field contains only spaces and the form is submitted
- **THEN** that player is named "Player 1" (or "Player 2" for the second field)

### Requirement: Random first picker, alternating each round
At the start of a match the app SHALL randomly choose which player picks first. On each subsequent round the first picker SHALL alternate.

#### Scenario: Next round alternates the starter
- **WHEN** Alex picked first in round 1 and the players tap "Next Round"
- **THEN** Sam picks first in round 2

### Requirement: Two turns per round with swapped roles
Each round SHALL consist of exactly two turns. In turn 1 the starter picks and the other player guesses; in turn 2 the roles swap.

#### Scenario: Turn 2 swaps roles
- **WHEN** turn 1 ends after Sam correctly guesses Alex's number
- **THEN** turn 2 begins with Sam picking and Alex guessing

### Requirement: Handoff screens between players
Before the picker picks and before the guesser guesses, the app SHALL show a "Pass the device to <name>" screen showing the round number, "Turn N of 2", and what that player is about to do. The next screen SHALL only appear after the named player taps "I've got it, I'm ready".

#### Scenario: Handing off to the guesser
- **WHEN** the picker locks in their secret number
- **THEN** the app shows "Pass the device to <guesser>" with "try to guess <picker>'s number!"
- **AND** the guessing screen appears only after the ready button is tapped

### Requirement: Secret number picking
The picker SHALL enter a secret whole number from 1 to 1000 using the on-screen keypad (see `number-entry`). The entered digits SHALL be masked. Tapping "Lock it in" with an invalid value SHALL show a validation error and not advance.

#### Scenario: Locking in a valid secret
- **WHEN** the picker enters 742 and taps "Lock it in"
- **THEN** 742 becomes the secret for this turn and the app hands off to the guesser

### Requirement: Guessing until correct
The guesser SHALL submit guesses until one equals the secret. Each valid guess SHALL increment the attempt counter and produce higher, lower or correct feedback (see `guess-feedback`). There is no attempt limit.

#### Scenario: Correct guess ends the turn
- **WHEN** the guesser submits a guess equal to the secret
- **THEN** the turn's attempt count is recorded
- **AND** after about 600 ms the turn summary screen is shown

### Requirement: Turn summary reveals the secret
After a correct guess the app SHALL show a turn summary that leads with the secret number in large type, followed by "<guesser> guessed it in N attempt(s)!" (singular for 1) and a "Continue" button.

#### Scenario: Continue after turn 1
- **WHEN** the turn summary for turn 1 is shown and "Continue" is tapped
- **THEN** turn 2 starts with a handoff to the new picker

### Requirement: Round result and scoreboard
After turn 2, the app SHALL compare the two guessers' attempt counts. The player with fewer attempts SHALL win the round and gain one round won; equal attempts SHALL be declared a tie with no score change. The result screen SHALL show a title (winner or tie), a scoreboard of both players' rounds won with the winner highlighted, and a single "Next Round" button.

#### Scenario: A player wins the round
- **WHEN** Alex guessed in 7 attempts and Sam in 9
- **THEN** the screen shows "Alex wins the round!" with a trophy and Alex's rounds won increases by 1

#### Scenario: A tie
- **WHEN** both players guessed in 8 attempts
- **THEN** the screen shows "It's a tie! Both guessed in 8." and neither score changes

### Requirement: Players persist across rounds
"Next Round" SHALL keep both players and their scores and increment the round number. There is no "New Match" action; starting over with a fresh scoreboard is done with Reset Game (see `game-reset`).

#### Scenario: Scores carry over
- **WHEN** the players tap "Next Round" with a score of 2-1
- **THEN** round N+1 starts with the score still 2-1
