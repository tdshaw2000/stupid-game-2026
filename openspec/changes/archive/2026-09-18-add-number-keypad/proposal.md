# Replace number inputs with an on-screen keypad

> Reconstructed after the fact from git history. This change was built in a Claude Code cloud session before the project used OpenSpec, so only the proposal is recorded here; the resulting behaviour lives in `openspec/specs/`.

**Shipped in:** PR #4, commit c5a0809

## Why
Every guess re-opened the phone's native keyboard, covering half the game and fighting the centred layout.

## What Changes
- Secret and guess fields are read-only with `inputmode="none"` and driven by a custom keypad (0-9, Clear, backspace).
- Name entry keeps the native keyboard, since it is typed once.

## Capabilities
- New: `number-entry`
