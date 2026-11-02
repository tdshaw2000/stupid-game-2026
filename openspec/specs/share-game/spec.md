# share-game Specification

## Purpose
Let players invite others to play by sharing a link to the app.

## Requirements

### Requirement: Share button on the start screen
The name-entry screen SHALL show a "📤 Share Stupid Game" link-style button. It shares the app itself (the current page URL), not the state of any game in progress.

#### Scenario: Native share sheet
- **WHEN** the browser supports the Web Share API and the user taps the share button
- **THEN** the native share sheet opens with the title "Stupid Game", the text "Play Stupid Game with me — guess the secret number in the fewest tries!" and the page URL
- **AND** cancelling the sheet does nothing further

### Requirement: Fallbacks when native sharing is unavailable
Without the Web Share API the app SHALL copy the URL to the clipboard and show "Link copied!" for about 2 seconds. If clipboard access also fails, it SHALL show a browser prompt containing the URL to copy manually.

#### Scenario: Desktop browser
- **WHEN** the browser has no `navigator.share` and the user taps the share button
- **THEN** the URL is copied and "Link copied!" appears briefly
