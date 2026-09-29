# Guildmaster (Playgama challenge entry)

Read `playgama_game_brief_guildmaster_v3_6.md` before any work. It is the single source of truth:
the design, the locked decisions, the build order, the build choices waiting for Rawa, and what each
step's bot results showed. The next step is step 8 (scouted waves that escalate; raiders damage the hall; arrays
required) in the build order. Step 7 left three questions for Rawa in 1e first.

## Files
- `index.html`: the game. One self-contained file (three.js inlined, no external assets), as Playgama needs.
- `guildmaster_bot_harness.js`: runs the sim headless in plain Node.
  `node guildmaster_bot_harness.js index.html <scenario> [runs=30] [minutes=10]`
  Scenarios are listed at the top of the file. Use 30 runs × 12 min for the numbers that go in the brief.
  On Rawa's PC, Node is a portable copy (not on PATH): `%LOCALAPPDATA%\Programs\node\node-v24.19.0-win-x64\node.exe`.
  In a cloud session, use `node` from PATH. Nothing to install either way.
- `builds/`: keep a copy of each finished step (`builds/step7.html` is the current `index.html`), so every
  step can be bot-compared with the one before.
- `tools/serve.js`: a tiny static server for testing in the browser pane (`.claude/launch.json`, name `guildmaster`,
  port 8765); the browser pane cannot open `file://`. Cloud sessions have no browser pane: there, the phone-size
  tap tests need a headless browser, or are done on Rawa's PC after pulling.

## Git
- The repository is `https://github.com/ranggarepublic01/Guildmaster` (private), branch `main`.
- Before a session ends, commit and push the work, and note in the brief what is finished and what is left.

## How Rawa wants the work run
- Claude proposes; Rawa decides anything that changes the design. Ask before major decisions rather than
  delivering a finished build that bakes them in.
- Locked decisions stay locked unless Rawa raises them.
- Build choices Claude makes on its own go in the brief, section 1e, marked "to confirm".
- Verify with measurements: run the bot harness on every step and compare with the previous build; test the
  UI in a headless browser at phone portrait (390×844) and landscape (844×390) with real taps; check the
  console for errors. Rawa confirms on an Android phone before release.
- Readability comes first: every adventurer decision has a reason the player can read; the harness
  checks this ("no-reason 0").
- After each step: update the brief (build order, 1e, 1f results, section 6 harness notes), copy the build
  into `builds/`, and write a short plain-language summary for Rawa.
