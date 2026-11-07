# Guildmaster: moving to a new chat

How to carry on this project in a new chat, either a **Claude Code** session or a **claude.ai chat**. It sits beside the
brief and points into it. The brief (`playgama_game_brief_guildmaster_v3_6.md`) stays the single source of truth for the
design. This file covers where the work stands and how the work is run.

Written 5 Nov 2026, at the end of the session that built steps 7 and 7b and the graphics pass. Updated 5 Nov after step 8.

---

## 1. Where things stand

**Step 9 in progress (7 Nov, branch step9-wip, not merged):** built: four villages (VILLAGES in index.html: ashford, elmstead, stonecrest, fordham), HQ screen, letters, stars, device save, wave max for the tutorial, wagon steering fix, harness scenarios <village>Full/NoArrays/Camp/Thrifty and a SCORE line. Not done: tuning (8-run tests: Ashford camp still falls too late for the array players, ~9 min, try camp hp 500 lvl 4.5 cap 4 and an earlier array build; Stonecrest best so far camp hp 900 lvl 6 cap 7, wave.first 190, farm1 yield 0.9, 3-4/8 wins; Fordham best wave.first 190 and caravan.every [180,300], 5/8; Elmstead 6/8 at 8.9 min, fine), star thresholds (set from Thrifty medians), the full 30-run comparison with step 8b, the browser tap tests of the new screens (not run at all yet), the brief update and builds/step9.html.

- **Repository:** `https://github.com/ranggarepublic01/Guildmaster` (private), default branch `main`.
- **On `main`:** steps 1–8, 7b, 8b, the graphics pass, this file and the test tools.
- **Build order (brief, 1d):**
  - Steps 1–8 are done, plus 7b (Rawa's v3.7 decisions), 8b (harder waves, v3.9) and the graphics pass.
  - **Next: step 9**, missions: the tutorial village, the coin score, a fresh start in the next village. Its design was decided
    on 7 Nov (brief, v3.10, build order step 9); it is ready to build.
- **Latest build copy:** `builds/step8b.html`, the same as `index.html`.
- **Not yet done by Rawa:** the Android phone test of steps 7, 7b, 8, 8b and the new graphics.

### Before step 9 (open)

1. **Waves every 95 s:** kept by Rawa on 7 Nov (22/30 wins with arrays, 7/30 without). The pace is still to be felt on the phone. See the brief, 1e, first step 8b item.
2. **Step 8's build choices** (brief, 1e): waves that grow stronger from wave 3, more brutes, stronger arrays. These went past the v3.8 decisions.
3. **The phone test:** the look, the frame rate, and a wave on screen (up to 266 draw calls seen, was 90–120). Until then waves stay at about 20 enemies at most.

---

## 2. Option A: a new Claude Code session (recommended for building)

Claude Code can run the bot harness, the headless browser tests, git and pull requests. Building steps should happen here.

1. Start a new session on the repository `ranggarepublic01/Guildmaster`. Use the Claude Code web app with the cloud
   environment, or Claude Code on the PC in the project folder.
2. `CLAUDE.md` loads by itself. It tells the session to read the brief first and says what the next step is.
3. A first message that works:

   > Read CLAUDE.md, MIGRATION.md and the brief. Then answer/confirm the open questions with me (MIGRATION.md section 1)
   > before starting step 9. Propose step 9's design points as questions first, as in steps 6, 7 and 8.

**Cloud session notes (all learned the hard way):**
- Node is on PATH, and Playwright with Chromium is installed globally (`npm root -g`). Don't run `playwright install`.
- The scratchpad folder is wiped when the session's machine restarts, so keep test scripts in `tools/` (now in the repo).
- 4 cores: run scenarios in parallel with `xargs -P4`. The 37 older scenarios took about 20 minutes before waves; step 8's 46, with both builds, took 75 minutes on 8 cores, so expect
  longer on 4.
- A command that matches its own command line, like `pkill -f guildmaster_bot_harness`, kills the shell running it. Kill
  harness processes by PID instead.
- Commit and push before long waits. Unpushed work is lost if the session ends.

**On Rawa's PC:** Node is a portable copy at `%LOCALAPPDATA%\Programs\node\node-v24.19.0-win-x64\node.exe` (not on PATH).
The Claude Code browser pane opens the game through `tools/serve.js` (see `.claude/launch.json`). Playwright is not installed there, so `tools/ui_test.js`
does not run; test in the browser pane with real clicks (brief, section 6).

---

## 3. Option B: a claude.ai chat (for design talk, not for building)

A plain chat cannot run the game, the bot harness or a browser, and it cannot push to GitHub. Use it to discuss design,
decide open questions and draft brief changes. Then bring the decisions back to Claude Code to build and measure.

1. Create a **Project** on claude.ai, named for example "Guildmaster", and add these files to its knowledge:
   - `playgama_game_brief_guildmaster_v3_6.md` (76 KB): the design and every result.
   - `MIGRATION.md` (this file).
   - `CLAUDE.md` (3 KB): how Rawa wants the work run.
   - Only when the code itself is needed: `game_only.js` (288 KB, about 85,000 tokens), made with `node tools/game_only.js`.
     It is the game's own code without three.js.
   - **Do not upload `index.html`** (906 KB, about 250,000 tokens with three.js inlined). It fills the whole chat.
2. A first message that works:

   > This is the Guildmaster project. Read MIGRATION.md and the brief. Let's settle the open questions in MIGRATION.md
   > section 1, then plan step 9 as questions for me, without writing code. At the end, write the brief changes as a list
   > I can give to Claude Code.

3. When decisions are made, open a Claude Code session (Option A). Paste the list in and ask it to build, test and update
   the brief.

The older claude.ai artifact build link in the brief (step 5) is out of date. To play the current build on a phone,
copy `index.html` to the phone and open it in Chrome. It is one self-contained file. (Publishing it as a claude.ai link needs a session
to read the whole page first, and the game code alone is about 160,000 tokens, too much for one session on 5 Nov.)

---

## 4. How the work is run (from CLAUDE.md and the brief, section 2)

- Claude proposes; **Rawa decides anything that changes the design**. Ask before major decisions, as multiple-choice
  questions with a recommended option, rather than delivering a build that bakes them in.
- Locked decisions stay locked unless Rawa raises them. Rawa's decisions are dated in the brief (v2 … v3.7).
- Build choices Claude makes alone go in the brief, section 1e, marked **"to confirm"**.
- **Measure, don't assert.** For every step:
  1. Run the bot harness (30 runs × 12 min) on the new build and the previous one, with the same harness.
  2. Test the UI at phone portrait (390×844) and landscape (844×390) with real taps; no console errors.
  3. Update the brief: build order, 1e, 1f results with a step-against-step table, and section 6 harness notes.
  4. Copy the build into `builds/`.
  5. Write a short plain-language summary for Rawa, and push.
- Readability first: every unit decision has a reason the player can read (the harness checks "no-reason 0").
- `index.html` must stay **one self-contained file** (three.js r149 inlined, no external assets), as Playgama needs.

---

## 5. Tools

| File | What it does |
|---|---|
| `guildmaster_bot_harness.js` | Runs the sim headless in Node. `node guildmaster_bot_harness.js index.html <scenario> 30 12`. Scenarios are listed at the top of the file and in the brief, section 6. It also runs on older builds in `builds/`. |
| `tools/ui_test.js` | Phone-size tap test in headless Chromium. It taps a guard, the caravan (sells wood, posts an escort), the hall (sells stone), an adventurer and the camp, at portrait and landscape. It prints what each card showed, draw calls and page errors, and saves screenshots. Start `node tools/serve.js . 8765` first. |
| `tools/serve.js` | Tiny static server on port 8765. Browsers in Claude cannot open `file://`. |
| `tools/game_only.js` | Writes `game_only.js` (the game code without three.js) for uploading to a chat. |
| `docs/screens/` | Before and after screenshots of the graphics pass. |

The page exposes `window.GM` for tests:
- `GM.sim()` is the live sim, and `GM.step(S, 1/30)` fast-forwards it.
- `GM.look(x, z, dist)` moves the camera, `GM.screenOf(kind, id)` gives where to tap, and `GM.select(kind, id)` opens a card.
- `GM.drawCalls()` gives the renderer's draw calls.

**Gotchas from the tests:**
- Cards scroll in landscape, so scroll a button into view before tapping it.
- A bandit standing on the camp takes the tap before the camp does.
- Fast-forwarding many seconds in one go queues hundreds of floating texts. The view now keeps only the latest 10.
- The browser's missing tab icon gives a harmless 404.

---

## 6. Map of `index.html` (line numbers as of this writing; they drift)

| Lines | What |
|---|---|
| 1–118 | Page, CSS, HUD and card markup |
| 119–120 | three.js r149 (minified, inlined) |
| 132 | `CFG`: every number in the game (classes, gear, shops, arrays, lairs, sites, wild animals, flags, horn, caravan, guard, camp tiers) |
| 247 | `newSim(seed)`: the sim state `S` |
| 513 / 638 | `plan` / `planHealer`: how adventurers choose what to do, and the reason they give |
| 741 | `hitMob`: kills, coin and experience |
| 970 | `updateAdv`: adventurer states (quest, hunt, game, chase, shop, rest, retreat, defend, flag, horn, follow, escort) |
| 1159 | Ward stones and arrays |
| 1298 / 1379 | Monsters, and lairs (spawning, wolf hunts, raids) |
| 1439 / 1507 | Villagers |
| 1647 | `step(S, dt)`: one tick of everything |
| 1676 | Waves (step 8): `waveMake`, `spawnWave`, `updateWaves`; numbers in `CFG.wave` |
| 1645 | Player levers: bounties, cancel |
| 1666 | Defend flags and the recall horn |
| 1793 | Guild guard (step 7b) |
| 1872 | Merchant caravan, robbing it, camp tiers, escort bounties, goods for sale (steps 7, 7b) |
| 2058 | Wild animals |
| 2199 | View starts: `window.GM`, icons |
| 2354 | `startGame()`: renderer, lights and shadows, ground, nature, town, lairs, sites, shops, units, input, cards, sync, loop |

The sim (above line 2199) never touches three.js. The harness loads only the last `<script>` block and runs the sim in plain Node.

---

## 7. The graphics pass (Nov, for Rawa to confirm on the phone)

Rawa chose a bright, toy-like look, all four areas, and best look always (no automatic fall-back).

- **Ground:** smooth colour blends instead of a checkerboard; two greens mixed by noise with sunny meadow patches; a sandy
  village plaza; dirt roads with soft edges.
- **Nature:** round leafy trees and two-tier pines mixed by noise; bushes, flower drifts and grass tufts. Each kind is one
  instanced draw call.
- **Lighting:** warm sun with soft real shadows (2048 shadow map) that follow the camera, and a bluer sky.
- **Buildings:** the guild hall has a stone footing, timber frame, gable roof, lit windows, chimney smoke and a blue guild
  banner. Houses have colourful roofs, doors, windows and chimneys. The blacksmith gets a slate roof, the alchemist a
  brighter roof, and the array master white stone with violet bands.
- **Lairs:** the wolf den has more rocks and glowing eyes in its mouth; the bandit camp has striped tents and a palisade.
- **Units:** drawn 1.25× bigger with a thick dark outline, and brighter monster colours.
- **Floating text:** a new message near a young one stacks above it, and a burst keeps only the latest 10.
- **Cost:** draw calls went from about 35–85 to about 90–120 (the outlines cost the most). Frame rate on a real phone is not
  measured yet: the headless browser uses software rendering.
- **To confirm:** the look; the frame rate on Rawa's Android; whether the outlines are too heavy at the widest zoom.
- **Sim unchanged:** the bot numbers are the same as step 7b.
