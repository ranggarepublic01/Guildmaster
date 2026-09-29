# Playgama game brief — Guildmaster (v3.6)

Template written 24 Sep 2026, from what Cadenza and Find the Village taught us.
Section 1 locked 24 Sep 2026. **v2 locked 25 Sep 2026:** villagers and resources, merchant
caravan, guard and escort bounties, roaming monsters, and a new build order.
**v3 locked 25 Sep 2026:** four classes picked at the guild hall, score is the coin left at
the win, each new village starts fresh, no retreat on guard and escort, caravan and food
rules, escalating waves, a tutorial village, and a new build order.
**v3.1 locked 25 Sep 2026:** what a wave costs — defence bounties, array running costs,
gear wear and repair, no coin from array kills, and raiders damaging the hall and taking coin.
**v3.2 locked 25 Sep 2026** (from Rawa's phone test of step 3): wild animals (deer, boar,
bear) that roam the whole map and slowly respawn from the forest, a bigger map with the lairs
far out, and a new step 3b before guard bounties. **Step 3b built 25 Sep 2026** (see 1f); no
design changes, only the build choices listed in 1e to confirm.
**v3.3 locked 25 Sep 2026** (from Rawa's phone test of step 3b: raiders hit the village while the
adventurers were away hunting): the guard bounty becomes a defend flag that can be planted anywhere
and pays a wage for standing by plus a payment per kill; a separate recall horn; free defence only
from adventurers already in town; step 4 reshaped to match. The proposed details (pay, refunds, who
answers the horn, planting by tapping) were confirmed by Rawa the same day.
**Step 4 built 26 Sep 2026** (see 1f). **v3.4 locked 26 Sep 2026** (from the step 4 bot results): the recall
horn pays only adventurers who come back from outside the village; a defend flag planted beside a lair
stays allowed, as a lesson for the player; the guild guard waits until Rawa has reviewed step 4.
**v3.5 locked 27 Sep 2026:** villages differ from one another (levels), and a short letter from guild
headquarters frames each one (light story). Both are part of step 9. A full story mode is not in the
challenge entry.
**Step 5 built 27 Sep 2026** (see 1f): the four classes and the recruit picker. No design changes; the build
choices are listed in 1e to confirm.
**v3.6 locked 28 Sep 2026:** healers keep following the adventurer they chose, even on a hunt, so a mixed
guild leaves the village emptier when raids come and the horn and defend flag answer it.
**Step 6 built 28 Sep 2026** in Claude Code (see 1f): specialists, gear condition and repair, arrays, ward stones.
Rawa decided three points before the build (only the alchemist comes built; array gear is a ward stone; two bought
gear tiers); the other build choices are in 1e to confirm.
**From step 6 the build moves to Claude Code.** Keep this file, `index.html` (the step 5 build) and
`guildmaster_bot_harness.js` in one project folder, with `CLAUDE.md` pointing to them. The last claude.ai
build link, for reference: https://claude.ai/artifact/HpUoHyAbPg8UaJdLb22gbF

---

## 1. The game

- **Working title:** Guildmaster (placeholder).
- **Reference:** Majesty: The Fantasy Kingdom Sim (2000), the game Rawa played when young.
  Use it for the feel of indirect control only. All names, art, characters and text are
  our own.
- **One line:** You are the new branch guildmaster of a village under threat. You post
  bounties and build the town. Adventurers decide for themselves which threats to take on,
  and villagers work the land around you.
- **Why it is worth playing:** Being in control without giving orders. The player spends
  limited gold and materials between bounties and buildings, then watches those choices
  play out in a village that goes about its own business.
- **The repeated decision:** Where does the next gold go?
  - A bounty: destroy a threat, guard a spot with a defend flag *(v3.3)*, or escort a caravan. A bigger reward is
    taken sooner and by stronger adventurers.
  - Or the town: a work site, a specialist, a defensive array, or an upgrade. Upgrades also
    cost wood and stone, which only villagers can gather.
  - *(v3)* Or keep it. Coin left at the win is the score, but waves keep coming and grow
    stronger the longer the map stays uncleared.
- **Session shape:** One village is one mission, about 10–15 min for a first-timer.
  Mission 1 is a short tutorial village.
  - **Win:** every threat source on the map is destroyed. The guildmaster is reallocated to
    another village. The coin left in the treasury is the score, and it goes to guild
    headquarters as accomplishment points.
  - **Lose:** the village centre (guild hall) is destroyed. The mission restarts.
  - *(v3.5)* **Each village is different.** Villages change what the systems already support: map
    layout, which lairs are out there and how strong, where the work sites and the caravan route lie,
    starting coin, and how soon the waves start. For example, a forest village with two wolf dens and
    plenty of wood; a hill village with a big bandit camp and rich stone but little food; a river
    village where the caravan route is long and exposed.
  - *(v3.5)* **Light story.** Before each village, a short letter from guild headquarters sets up its
    problem and what is special about it ("The last guildmaster here fled. Bandits hold the stone
    road."). After the win, a reply from headquarters rates the result by the coin left.
  - **Next run (v3):** a new village that starts fresh, with the default coin and a small
    guild guard. Nothing else carries over: no buildings, upgrades, adventurers or
    resources.
- **Platform target:** Phone first (Android, portrait and landscape). Desktop too.
- **2D or 3D:** Low-poly 3D with a fixed, angled top-down camera. No free look.
- **Setting:** Medieval fantasy.
- **Sound:** Ambient (Web Audio, generated).

### Locked decisions

- The player never commands any NPC. That includes adventurers, guards, specialists,
  villagers and the caravan. The only levers are rewards, buildings, and *(v3)* choosing
  the class of the next recruit at the guild hall.
- Adventurers spend their own gold (from bounties and monster drops) on equipment,
  potions and array gear, at different levels.
- Monsters drop coins and give experience; adventurers level up.
- The guild builds side-job specialists: blacksmith, alchemist and array master.
- Part of every specialist sale returns to the treasury as tax.
- The array master sells array gear and places defensive arrays that fire on their own.
- Threats come two ways: monsters that roam out of their lairs and camps with their own
  motives, and scouted waves.
- The lose condition is the village centre destroyed.
- *(v2)* Villagers gather wood, stone and food at work sites the player builds.
  They choose their own work and flee to the guild hall when attacked.
- *(v2)* Wood and stone are required, with gold, to upgrade buildings.
- *(v2)* Every safe delivery of resources back to town pays a small amount into the treasury.
  Protected work sites therefore earn more.
- *(v2)* A merchant caravan crosses the map carrying food. If it reaches the far edge, the
  treasury gets a large payment. Bandits target the caravan first.
- *(v2)* Bounties come in three kinds: destroy, guard and escort.
- *(v2, from step 1)* Resting adventurers go inside the guild hall, hidden and safe. The hall
  shows a resting badge with a count.
- *(v3)* Four adventurer classes: warrior, archer, magician and healer. The player taps the
  guild hall to pick the class of the next recruit.
- *(v3)* On guard and escort bounties, adventurers cannot retreat. They can still drink
  potions. The guild guard, which defends the hall, follows the same rule.
- *(v3)* The score is the coin left in the treasury at the win. It is recorded at guild
  headquarters as accomplishment points and buys nothing.
- *(v3)* Each new village starts fresh with the default coin and a small guild guard.
  Nothing else carries over.
- *(v3)* Waves keep coming and grow stronger until the map is cleared. Stalling for coin
  risks the score, and the town itself.
- *(v3)* Bandits who stop a caravan take its goods. Their camp grows stronger and its
  raiders carry better weapons and potions.
- *(v3)* Villagers eat food from the town store. Only the surplus goes on the caravan.
- *(v3)* A killed villager is replaced 30–60 s later.
- *(v3)* Mission 1 is a tutorial village, where the first success comes fast on purpose.
- *(v3.2)* Wild animals (deer, boar, bear) roam the whole map, belong to no lair, and
  slowly respawn from the forest when killed. They do not count toward the win.
- *(v3.2)* A bigger map, with the lairs far out from the village.
- *(v3.3)* The guard bounty is a **defend flag** the player can plant anywhere: on the guild hall,
  a work site, or open ground. Adventurers who take it go to the flag and stand guard there.
  It pays a wage for every stretch spent standing by, plus a payment per enemy killed near the
  flag, both from the pot the player posts. The flag comes down when the pot is empty.
- *(v3.3)* A **recall horn**, sounded from the guild hall, calls adventurers home from anywhere on
  the map to defend the village. It is separate from the flag. Adventurers decide for themselves
  whether to answer.
- *(v3.3)* Adventurers defend the village for free only when they are already in town. Those away
  come back only for a defend flag or the recall horn.
- *(v3.1)* Every wave costs the guild coin: extra defence bounties, and arrays that cost
  coin to run. Surviving a wave may leave the guild richer or poorer.
- *(v3.1)* Enemies killed by arrays drop no coin. Only adventurer kills drop coin.
- *(v3.1)* Adventurers cannot hold a wave without arrays. Arrays are required, not optional.
- *(v3.1)* Gear wears in fights and can break. Adventurers pay to repair or replace it at the
  blacksmith, and buy more potions after heavy fights.
- *(v3.1)* Raiders who reach the guild hall damage it and take coin from the treasury, even
  when the hall does not fall.

## 1a. Core systems

**Economy loop**
1. The treasury pays for bounties and buildings.
2. Adventurers complete bounties and keep the rewards, plus coins dropped by monsters.
3. Adventurers spend that gold at the specialists. Part of every sale returns as tax
   (40% in step 2; tune from play).
4. Villagers deliver wood, stone and food. Each delivery pays a small amount of gold.
5. Villagers eat food from the store; the surplus goes out on the caravan. A delivered
   caravan pays the largest single sum.
6. Wood and stone, with gold, pay for building upgrades.
7. *(v3)* The coin left at the win is the score. Raids eat into it (see Threats).
8. *(v3.1)* Waves cost coin: defence bounties, array running costs, and raider theft.
   Adventurers spend more on repairs and potions after a wave, and the tax on those sales
   returns some of it. Array kills drop nothing, so the only wave income is adventurer
   kills and that tax.

**Adventurers**
- Each adventurer has a level, health, gold, and gear tiers (weapon, armour, potions, array gear).
- *(v3.1)* Weapons and armour have condition. It drops in every fight, faster in waves. Worn
  gear fights worse, broken gear stops working, and the adventurer goes to the blacksmith to
  repair or replace it before taking new work.
- *(v3)* **Classes:** warrior (melee, tough), archer (ranged), magician (area damage), and
  healer (follows other adventurers and heals them, keeping out of melee). The guild hall
  recruits on its own; tapping the hall sets the class of the next recruit (default warrior).
- Autonomous loop: pick a bounty worth the risk → go there → fight → retreat to heal
  when hurt → return to town and shop → rest → repeat.
- *(v3)* **No retreat on guard or escort:** once on a guard or escort bounty, an adventurer
  stays and fights. Potions and healers are the only way through a long fight, so they
  ask a higher reward before taking one.
- All three bounty kinds are judged the same way: the reward against the risk. A higher
  reward pulls a quest up their list; a stronger threat pushes it down until they are strong enough.
- When there is no bounty they will take, they hunt easy monsters or wild game for coins, or wait
  in the village.
- *(v3.3)* While hunting, they recheck the bounties and the horn every few seconds, so a flag or a
  horn reaches them mid-hunt. (Found in step 3b: they only rechecked after a hunt ended, and the
  slowest response to a raid was 175 s.)
- *(v3.3)* **Free defence:** an adventurer already in town defends it from raiders unpaid, as now.
  *(v3.4)* That includes answering the horn: those already in the village answer it unpaid.
  One who is away does not come back for a raid unless a defend flag or the horn pays them to.
- **Readability rule:** the player must always be able to see *why* an adventurer is
  doing something. Use a small icon above each head and a tap-for-details card with the
  reason in a plain sentence.

**Villagers (v2)**
- Starting count 3–4. They look clearly different from adventurers: plain clothes, no weapons.
- Autonomous loop: pick a work site → walk there → gather → carry the load home → repeat.
- When a monster comes near, they drop what they are doing and flee to the guild hall, and
  work stops. That lost work is the cost of an unguarded site.
- Icons: axe (wood), pick (stone), hoe (food), fleeing.
- *(v3)* A villager killed is replaced 30–60 s later.
- *(v3)* The count stays at 3–4 in the first build. Whether houses add villagers is open.
- *(v3)* Villagers eat from the town's food store. If it runs out, they work at half speed.

**Work sites (v2)**
- Lumber camp (wood, beside the forest), quarry (stone, beside rocks), farm (food).
- Built by the player. Villagers decide which one to work at.
- Sites near the forest edge and far from town produce more, and are more exposed.

**Merchant caravan (v2)**
- Arrives from one map edge every 3–5 min *(v3)*. The first one comes around minute 3–4, never in
  the first two minutes.
- Loads the surplus food (what villagers do not need), then travels to the far edge.
- If it arrives, the treasury gets a large payment based on the goods carried. If bandits
  stop it, the goods are lost.
- *(v3)* Bandits who stop it take the goods. Their camp tiers up (a bigger flag, and a tap
  card saying why), and its raiders gain better weapons and potions, so they are harder to
  eliminate.

**Bounties (v2)**
- **Destroy:** on a lair or camp. Paid when it is destroyed.
- **Guard, as a defend flag (v3.3):** planted anywhere: the guild hall, a work site, or open ground,
  for example in the path of a scouted wave. The player posts a pot. Adventurers who take it walk
  to the flag and stand guard within a few units of it, fighting whatever comes near. No retreat
  *(v3)*. From the pot, each adventurer standing by earns a wage, and each enemy they kill near
  the flag earns a payment. When the pot is empty, the flag comes down. Starting values to tune:
  1g per adventurer every 5 s standing by, and 5g per kill. A flag nobody has taken can be
  cancelled for a full refund; one that has been drawn on refunds what is left in the pot.
- **Escort:** on the caravan. Paid when the caravan reaches the edge. No retreat *(v3)*.

**Recall horn (v3.3)**
- Sounded from the guild hall card. It reaches every adventurer on the map at once, so the player
  can see it spread: a horn icon over each head as they hear it, and a tap card saying why they are
  or are not coming.
- It is a call, not a command. Each adventurer weighs it against what they are doing:
  hunters and idle adventurers answer; those on a destroy, guard or escort bounty keep to the
  bounty they took.
- Those who answer come back and defend the village until no raiders are left in it, then return
  to their own business. Unlike a flag, they may still retreat when badly hurt.
- Payment: a fixed sum to each adventurer who answers *from outside the village*, paid when they reach
  it (starting value 10g each), so a horn costs more the more adventurers come back. *(v3.4)* Those already
  in the village answer unpaid, since they defend it for free anyway. (Step 4 bot: paying everyone who
  answered cost 278g per run with no bounties posted and 78g with the den and camp bounties; paying only
  returners cost 179g and 29g, and no raid reached the hall either way.) A short cooldown (about 30 s)
  stops it being sounded over and over.

**Specialists**
- **Blacksmith:** sells weapons and armour in tiers. Upgrading the building (gold, wood,
  stone) unlocks higher tiers. *(v3.1)* Also repairs worn and broken gear, for a fee.
- **Alchemist:** sells healing potions, so adventurers survive longer fights.
- **Array master:** sells array gear to adventurers, and places defensive arrays around
  the town that fire on enemies automatically, like towers in a tower-defence game.
  *(v3.1)* Each shot costs the treasury a little coin. With an empty treasury, arrays stop
  firing. Enemies they kill drop no coin.

**Threats**
- **Monster motives (v2):** monsters have their own loop and reason, like adventurers,
  shown with an icon and a tap card.
  - Wolves roam when hungry and are drawn to villagers working near the forest.
  - Bandits go for the caravan first. With no caravan on the map, they raid the village.
  - After a raid or hunt, monsters return to their lair.
- **Lairs and camps** keep spawning monsters. Destroying the source removes them.
- *(v3.2)* **Wild animals** fill the gap between the wolf den (threat 1) and the bandit camp
  (threat about 5). Found in step 3: once the den falls, adventurers stall at level 2 with no
  way to earn XP or coin for gear, and refuse the camp at any bounty. Starting values to tune:
  - **Deer:** harmless, flees from anyone near. Easy coin and XP for new adventurers.
  - **Boar:** about level 2. Territorial: charges anyone who comes close, villagers included.
  - **Bear:** about level 3. Roams slowly and attacks anything within reach. Rare, dangerous.
  - They roam the forest outside the village and do not walk into town. They respawn one at a
    time from forest edges far from town, up to a cap per kind; bears respawn slowest.
  - Like other monsters, each shows an icon and a tap card with its motive.
- *(v3.2)* **Map:** grows from about 96 to about 144 units across. The wolf den sits about 40
  units from the hall (was 31), the bandit camp about 55 (was 31). Work sites stay where they
  are; the wild animals roam the new ring between village and lairs.
- **Waves:** scouts report an incoming wave ahead of time, with its direction and a
  countdown. This gives a window to raise bounties and build arrays before it hits.
- *(v3)* **Waves escalate:** they keep coming until the map is cleared, each stronger than
  the last. If the hall falls, the mission restarts.
- *(v3.1)* **What a wave costs:** defence bounties, array shots, and raiders who reach the
  guild hall. Those raiders damage the hall and take coin from the treasury, even when it
  does not fall. Waves are tuned so adventurers alone cannot hold them; arrays are needed.
- **Guild guard:** the starting squad. It defends the village centre on its own and
  cannot be commanded. It does not retreat *(v3)*.

**Scoring (v3):** the coin left in the treasury when the map is cleared. Higher is better.
It goes to guild headquarters as accomplishment points, which are a record and buy nothing.
Which number the leaderboard shows is open (see 1e).
**Random per run:** threat positions and wave directions. **Fixed:** the map layout.

## 1b. Phone controls

- Drag to pan the camera, pinch to zoom. Keep the edges clear of controls.
- Tap a building or building spot to build, upgrade or inspect it (including work sites).
- *(v3)* Tap the guild hall to pick the class of the next recruit.
- Tap a lair to post or raise a **destroy** bounty.
- *(v3.2, built in step 3b)* Cancel a bounty nobody has taken, with the gold refunded, so gold is not
  locked on a job no adventurer will accept (seen in the step 3 phone test: 250g stuck on the camp).
  The lair card shows "Cancel bounty and refund Xg"; once an adventurer takes it, the button is
  locked and says who took it.
- *(v3.3)* Plant a **defend flag** on the guild hall, a work site, or open ground, and post or raise its
  pot. Tap empty ground to open a small "Plant a defend flag here" card; tapping a work site or
  the hall offers the same.
- *(v3.3)* Tap the guild hall to sound the **recall horn**.
- Tap the caravan to post or raise an **escort** bounty.
- Tap a flag to raise its pot, see who is standing by, or cancel it.
- Tap an adventurer, villager or monster to see what it is doing and why.

## 1c. The first two minutes

*(v3)* These timings are for mission 1, the tutorial village.

- **0 s:** You arrive with a small guard. Villagers are working near town. Wolves prowl
  from a single den that glows. This is the visible "go there".
- **~10 s:** A prompt in the world: tap the den to post a bounty.
- **~30 s:** An adventurer comes out of the guild hall and walks to the den.
- **First success:** the den is cleared, coins drop, and the adventurer levels up. In the
  tutorial village this comes fast on purpose (about 23 s after posting is fine). From
  mission 2 the target is about 2 min.
- **After that:** Build or upgrade something with the first wood and stone. The first caravan
  arrives around minute 3–4, then the first wave warning.
- Teach one rule at a time. The caravan and guard bounties are introduced when they first
  matter, not in the opening.

## 1d. Smallest version worth playing (first build)

- One small map.
- Guild hall, blacksmith, alchemist, array master (with one array type).
- Lumber camp, quarry and farm, with 3–4 villagers.
- Four adventurer classes (warrior, archer, magician, healer). The guild hall recruits on its
  own; the player picks the next class.
- Two lairs: bandit camp and wolf den, with roaming monsters, plus one scouted wave.
- *(v3.2)* Wild deer, boar and bear roaming the map.
- One caravan route.
- Destroy, guard and escort bounties; adventurer levels, two gear tiers, potions.
- A tutorial village as mission 1.
- Win and lose conditions, the coin score, a fresh start in the next village, and a save
  between missions.

**Build order (v2).** Each step is tested headlessly with a bot before the next one begins.

1. ~~Adventurer behaviour and readability.~~ Done 25 Sep.
2. ~~Economy: tax on sales is the only treasury income.~~ Done 25 Sep.
3. ~~Villagers, work sites, resources, food eaten from the store, villager replacement, and
   roaming monsters with motives.~~ Done 25 Sep.
3b. ~~*(v3.2)* Wild animals (deer, boar, bear) with motives and slow respawn; bigger map with
    the lairs far out; cancel a bounty.~~ Done 25 Sep.
4. ~~*(v3.3)* Defend flags (the guard bounty, planted anywhere) with the no-retreat rule, the
   standing-by wage and per-kill pay; the recall horn; free defence only from adventurers in town;
   hunters recheck bounties every few seconds.~~ Done 26 Sep. *(v3.4)* The guild guard, and its
   no-retreat rule, is not built yet; Rawa reviews step 4 first, as it may not be needed.
5. ~~*(v3)* Four classes (warrior, archer, magician, healer) and picking the next recruit at the
   guild hall. The healer's follow-and-heal loop is the biggest new piece.~~ Done 27 Sep.
6. ~~Specialists and arrays, with gear for all four classes and upgrades paid in gold, wood
   and stone. *(v3.1)* Gear condition and blacksmith repair; array cost per shot, and no
   coin from array kills.~~ Done 28 Sep.
7. Caravan every 3–5 min, bandits' caravan targeting and camp tier-up, and escort bounties.
8. Scouted waves that escalate over time. *(v3.1)* Raiders damage the hall and take treasury
   coin; waves tuned so arrays are required.
9. *(v3)* Missions: the tutorial village, the coin score to guild headquarters, and a fresh
   start in the next village. *(v3.5)* Different villages (layout, lairs, sites, caravan route,
   starting coin, wave timing), and a headquarters letter before each village and a reply after
   the win. Bot checks: every village is winnable by the scripted player, with win time and coin
   left reported per village.
10. Content and tuning pass (the first two minutes, difficulty), then platform wiring
    (Bridge, saves, leaderboard).

## 1e. Still open

- Playgama weekly challenge: not now, maybe a future one. No deadline.
- Leaderboard: the best single-mission coin score, or the guild headquarters total?
- *(v3.5)* How many villages in the challenge entry (tutorial plus how many)?
- *(v3.5)* Headquarters letters: one short paragraph, or longer? Does the reply after a win give a
  rank (for example by coin left), or only words?
- *(v3.5)* Villages played in a fixed order, or can the player pick any unlocked one?
- *(v3.5)* A full story mode (set campaign, recurring characters, scripted events, an ending) is left
  for an update after launch, if the numbers are good.
- Each new village: a new map layout, or the same map with new threat positions?
- Recruit cost per class, and a cap on how many adventurers the guild can hold.
- Whether more houses mean more villagers.
- *(step 3, to confirm)* Choices made in the build: killing a bandit who carries stolen coin
  returns it to the treasury; adventurers chase roaming monsters only within 15 units or near
  the village; wolves do ×1.7 damage to villagers; site costs 30/40/50g, far sites ×1.4–1.6
  yield and 2g per load instead of 1g; two sites come pre-built (town farm, near lumber camp).
- *(v3.1, to confirm)* Array running cost is charged per shot, and an empty treasury stops
  the arrays. Whether the guild hall repairs itself or costs coin to repair.
- *(step 3b, to confirm)* Choices made in the build:
  - Numbers: deer up to 6 (4 at the start, one back every 20–30 s), boar up to 3 (2 at the start,
    40–60 s), bear up to 1 (the first comes out at 2.5–3.5 min, then 2.5–3.5 min after each kill).
  - Worth: deer 3–5g and 8 XP, boar 7–11g and 18 XP, bear 22–30g and 50 XP.
  - Animals attack people only (adventurers and villagers), never wolves or bandits. Deer run only
    from people. Villagers do not run from deer.
  - Animals stay at least 20 units from the guild hall, and new ones come out 34+ units from it.
  - Like lair monsters, animals show an icon only while doing something (running, charging,
    attacking, going back), not while grazing or wandering. The tap card always explains them.
  - Adventurers see game within 36 units. They skip game within 13 units of a lair they would
    refuse, and give up a chase that runs toward one.
  - Wolf den at (31, −26), 40 units out; bandit camp at (−45, 32), 55 units out.
  - Tutorial timing: with the den 40 units out, it falls about 35 s after posting (was 23 s).
- *(step 4, to confirm)* Choices made in the build:
  - A flag asks for about 35g more pot than a destroy bounty at the same risk (no-retreat ask 0.5 on
    the same pull scale).
  - At most 3 guards on one flag, and at most 4 flags up at once.
  - Guards stand within 3.5 units of the flag and fight within 8 (10 at the hall door flag). Wages
    are paid while within that area plus 3; kill pay for kills within the same distance.
  - Flag threat, as adventurers see it: the strongest danger within 16 units, plus 0.35 for each
    extra one. A lair in range counts at its full threat. For a flag in town, raiders on their way
    to the village count. Quiet ground counts as 0.5.
  - Guards fight everything near the flag except deer; wild animals only when they are attacking
    someone or come within 5 units.
  - "In town" is within 17 units of the hall.
  - The horn spreads out at 22 units/s (about 3 s to the map edge). Idle adventurers and those
    hunting or chasing answer; those on a bounty, a flag, resting, retreating, shopping or just
    recruited keep to it and say why. The horn pays at most what the treasury holds. Answerers wait
    up to 90 s in the village for raiders who have not arrived.
  - Hunters recheck every 3 s and switch only for a destroy bounty, a flag, or (when in town)
    defending the village.
  - Tapping empty ground first closes an open card; the next tap offers a flag there. The hall and
    built work sites offer a flag on their cards. Pots of 25, 50 or 100g; raise by 25 or 50g.
  - At the first raid, a hint says to tap the guild hall for the horn or a flag.
- *(step 4, open)* The recheck makes hunters join destroy bounties mid-hunt, so rewards are split and
  gear comes slower (see 1f). Tune in the content pass, or limit who joins a bounty already taken?
- *(v3.4)* The guild guard: build it, and in which step? Rawa decides after reviewing step 4.
- *(step 5, to confirm)* Choices made in the build:
  - The warrior is the step 1–4 adventurer, unchanged, so older bot results still compare.
  - Archer: 62 health (+14 a level), 7 damage every 1.15 s, range 7. Magician: 55 health (+12), 8 damage
    every 1.8 s, range 6; the fire also hits every hostile within 2.6 units of the target at 60% (never deer
    or a calm animal). Healer: 65 health (+14); heals 12 (+2.5 a level) every 2.5 s within 6.5 units; a weak
    bolt (4 damage) only when nobody near needs healing.
  - How each class judges risk: its own strength, plus 0.2 for the magician and minus 1 for a healer alone.
  - A healer never takes a destroy bounty or hunts. It follows one adventurer who is on a destroy bounty,
    a flag, or a hunt of something that fights back (not deer), at most one healer each. It judges the
    risk as that adventurer's strength plus half its own. It stands about 2.6 units behind them in a
    fight, runs toward a fighter when something comes for it, and hits back only when cornered.
  - A healer takes a defend flag only where someone already stands guard (its strength there is its own
    plus 0.6 of the strongest guard), and is paid wages like any guard.
  - Healer pay: healing an adventurer on a destroy bounty counts at half weight, like damage, toward the
    bounty share; a third of the coin from kills by the adventurer it follows; 1 XP per 4 health healed.
  - Warriors, archers and magicians step in when a monster goes for a healer within 6 units of them.
  - A healer answers the horn unless the one it follows is on a bounty or a flag.
  - The class picked at the guild hall stays picked until changed (default warrior). Recruiting stays free
    and the cap stays at 5 (recruit cost per class is still open, above).
  - Gear keeps two tiers at the same prices, named for each class: steel sword, longbow, runed staff, silver
    wand; chainmail, studded leather, warded robe. Step 6 replaces this with the specialists.
  - A hint, "Tap the guild hall to choose who it recruits next", shows after the wolf den falls (or at
    75 s), until 170 s, and stops once a class has been picked.
  - Level-up messages now go only to the thoughts log, so the reason line keeps saying what an adventurer is
    doing and why (all classes).
- *(v3.6, decided 28 Sep)* A mixed guild leaves the village emptier when raids come: healers go out with
  hunters, and a lone archer or magician holds the hall worse than a warrior. With no bounties posted, raids
  reached the hall 61/210 times (all warriors: 28/210); the horn brings it to 4/210 and a hall flag to 2/210.
  Rawa's decision: healers keep following, even on a hunt. The horn and flag are the answer.
- *(step 6, decided by Rawa 28 Sep)* Only the alchemist comes built; the player builds the blacksmith and the array
  master. Array gear is a **ward stone**. Two bought gear tiers, the second after a blacksmith upgrade.
- *(step 6, to confirm)* Choices made in the build:
  - Where things stand: the alchemist takes the old market's spot east of the hall; the blacksmith plot is in front of
    the hall door; the array master plot is west of the hall. Six fixed array plots ring the village about 13–14 units
    out (south-west, west, north-west, north, east, south); two face the bandit camp. Their "+" marks show only once the
    array master stands.
  - Building costs gold only: blacksmith 70g, array master 90g. Each specialist has one upgrade, in gold, wood and stone:
    blacksmith 80g + 40 wood + 30 stone (tier 2 gear); alchemist 50g + 30 wood + 20 stone (strong potions: heal 70 for
    16g, was 45 for 12g); array master 70g + 30 wood + 40 stone (arrays range 14 and 13 damage, was 12 and 9; ward
    stones hit 40% harder). This is the first use of wood and stone, and the first reason to build a quarry.
  - Gear: starter gear is free and never wears. Tier 1 costs 60g, tier 2 130g, for each of weapon and armour.
    Weapons add 5 damage a tier (a healer's wand adds 4 healing); armour stops 25% / 40% of each hit. Tier 2 names:
    knight's blade, plate armour; yew warbow, ranger's mail; starfire staff, archmage robe; sunstone wand, blessed
    vestments.
  - Condition: a weapon loses 2% a blow (a wand 1.2% a heal), armour 2.5% a hit taken. Below 50% it is worn and gives
    50–100% of its bonus; at 0% it is broken and gives none. Strength (how they judge risk) counts the gear as it is now.
  - Repairs cost up to half the item's price (a broken steel sword 30g), taxed like any sale. Broken gear is repaired
    before new work when they can afford it; worn gear when they can afford it; while at the blacksmith, anything worn.
  - Shopping order: repair broken → next gear (each tier filled, weapon then armour, before the next tier) → repair
    worn → potions → ward stone (once the weapon and armour are the best the blacksmith sells). They keep to one potion
    instead of two while they have 40% of the price of their next gear, and say so. Each specialist is its own trip.
  - Ward stone: 40g, never wears. Set beside its owner while they stand guard on a flag, defend the village, or are
    back for the horn: range 6, 6 damage every 2 s, shots free. Its kills count as the owner's (coin, experience, flag
    kill pay), since it is their gear. It shoots monsters, raiders, and wild animals only while they attack.
  - Arrays: 40g + 10 wood + 15 stone each. Range 12, 9 damage every 1.6 s, 1g a shot. They shoot lair monsters and
    raiders, never wild animals. Their kills give no coin and no experience; a raider's stolen coin still returns to
    the treasury. An adventurer who was fighting the victim notes "No coin from array kills". With less than 1g in the
    treasury they fall silent, and the array card says why.
  - A hint, "An adventurer has gold for better gear. Tap the empty plot in front of the guild hall to build a
    blacksmith", shows while nobody can buy gear they can afford. No hint now shows under an open card.
  - An idle adventurer with gold for gear but no blacksmith says so in their reason.
- *(step 6, decided by Rawa 28 Sep)* Ward stone kills pay coin to their owner, as built. Tier-2 gear being out of reach
  waits for the income from escorts and waves (steps 7–8); no price change now.
- Whether destroying an enriched bandit camp drops some of the stolen goods (a comeback reward).
- More classes and more maps after the first four classes.
- Plan for now: saves between missions only (mission number, headquarters points), with a
  mid-mission save later. English first, with all text in one table so languages can be
  added later.

## 1f. Build status and findings (v2)

**Step 1, adventurer behaviour.** Built and bot-tested with 400 runs over four scenarios.
Zero stuck adventurers. Every decision has a reason, and no quest is taken beyond an
adventurer's risk tolerance. The bot caught three bugs, all fixed: walking into the hall
wall, hunters going back and forth to an emptied den, and retreating into raiders.

**Step 2, economy.** The placeholder 1g/s income is removed. Tax (40%) is now the only
income. The ledger balanced in all 250 runs, and the treasury never went negative.

**Step 3, villagers and resources.** Built and bot-tested: 4 scenarios × 30 runs × 10 min.
Zero stuck units, every villager and monster decision has a reason, the ledger balances, and
replacement delays stay within 30–60 s. The bot caught three bugs, all fixed: villagers
deadlocking head-on at the hall wall (both now keep right), bandit guards blocking each other's
wander spots (new spot after 6 s), and wolves that could never catch anyone (hunting wolves are
now noticed at 3.5 units, not 7). Results: villager deaths 0 with near sites only, about 1 per
10 min with far sites; adventurer idle time 74% (was about 80%); delivery income 110–145g per
10 min against 60–130g of tax. Raids never reached the hall with adventurers present; stealing was
verified in a separate run without them. Draw calls went from 128 to 178 per frame after merging
site meshes. Real frame times still need Rawa's Android.

**Step 3b, wild animals, bigger map, cancel a bounty.** Built and bot-tested: 4 scenarios × 30 runs ×
12 min, plus 60 runs of the cancel rule. Zero stuck units, every animal and adventurer decision has
a reason, the ledger balances (refunds included), animals never entered town, and counts never
passed their caps. The bot caught one problem, fixed: an adventurer chasing a deer ran into the
bandit camp at level 1 and had to flee four bandits. Results against step 3:

| Scenario (30 runs × 12 min) | Step 3 | Step 3b |
|---|---|---|
| Den, then camp bounty, raids off | camp cleared 6/30 | camp cleared 29/30, median 5.1 min |
| Den, then camp bounty, raids on | camp cleared 24/30 | camp cleared 30/30, median 6.1 min |
| Adventurer idle time (raids on) | 80% | 40% |
| Idle time, no bounties at all | 73% | 37% |
| Average level at 12 min, no bounties | 2.8 | 3.6 (22% in full gear, was 5%) |
| Adventurer deaths per run, no bounties | 0 | 0.5 (bears, mostly) |
| Villager deaths per run, all six sites | 0 | 0 |

Cancel: an untaken bounty refunds in full (60/60); one being walked to cannot be cancelled (60/60).
Draw calls: 73 per frame at a mid zoom (loose rocks are now one instanced mesh). Real frame times
still need Rawa's Android.

**Step 4, defend flags and the recall horn.** Built and bot-tested: 13 scenarios × 30 runs × 12 min, plus
60 runs of the cancel rule. Zero stuck units, every decision has a reason, the ledger balances with the
flag pots and the horn in it, pots never go below zero, no quest or flag is taken beyond an adventurer's
risk tolerance, the horn never pays more adventurers than answered it, and no adventurer outside town
turns back to defend for free (3b: 268–280 times per 30 runs). The harness had one bug, fixed: its
cancel check could fire twice in one run and the second call found nothing to cancel. The UI was
tested in a real browser at phone portrait and landscape: every card, button and tap path, no errors.

Raids, with no bounties posted (adventurers hunting game, raids every 80 s from minute 2):

| 30 runs × 12 min | Raids reaching the hall | Stolen per run | Slowest first blow | Cost per run |
|---|---|---|---|---|
| Step 3b | 31/210 | 10.5g | 34 s | – |
| Step 4, no response | 28/210 | 14.9g | 277 s | – |
| Step 4, horn on every raid | 0/210 | 0g | 23 s | 179g (v3.4 pay rule) |
| Step 4, 100g flag at the hall on every raid, taken down after | 0/210 | 0g | 21 s | 155g net |

- Raids are still mostly fought without a flag or horn, because about two of five adventurers are
  in town when a raid leaves the camp. The horn and flag matter for the raids that find the town empty.
- With the horn, the first adventurer back from outside the village arrives a median 8 s after it sounds.
- Hall flag: 700g posted per run, 545g refunded on taking it down; 91g in wages and 51g in kill pay
  (10 kills). Deaths on a flag: 0.2 per run.
- A flag on the far lumber camp with the wolves alive: villager deaths fell from 1.3 to 0.5 per run,
  but guards on the flag cannot defend the town, so raids reaching the hall rose from 31/210 to 56/210
  and stolen coin from 17g to 52g per run. The flag cost 156g per run, mostly wages (4 kills).
- A 150g flag 11 units from the bandit camp (a player mistake): taken in 30/30 runs, 3.1 deaths per run
  on the flag. *(v3.4: allowed, as a lesson for the player.)*
- The recheck: the den falls about 5 s sooner, but a second hunter often joins, the reward is split, and
  nobody can afford both a sword and potions. The camp is first taken at a median 3.3 min (was 1.6).
  Median win: den then camp with raids off 6.7 min (was 5.1), with raids on 6.3 (was 6.1), with all six
  sites 7.2 (was 6.2).
- Each flag adds 7 draw calls (at most 4 flags). Real frame times still need Rawa's Android.

**Step 5, four classes and the recruit picker.** Built and bot-tested: 10 new scenarios × 30 runs × 12 min,
where the scripted player picks each recruit's class (mixed order: warrior, healer, archer, magician,
warrior). The all-warrior scenarios give the same numbers as step 4, run for run. Zero stuck units, every
decision has a reason, the ledger and flag pots balance, the horn never pays more than answered it, and no
healer ever took a destroy bounty or hunted. The UI was tested in a real browser at phone portrait and
landscape: the picker by real taps, every card, no errors. The bot caught three problems, all fixed: healers
followed warriors hunting deer, which took them out of the village for nothing; a healer in town would not
bolt raiders hitting the hall; level-up messages replaced the reason line. A fourth was tuning: healers
out-levelled everyone, so healing now counts half toward a bounty share and gives 1 XP per 4 health (was 1 per 3).

| 30 runs × 12 min | Result |
|---|---|
| All warriors, den then camp (step 4 `normal`) | same as step 4: median win 5.9 min |
| Mixed guild, den then camp, raids on | won 30/30, median 4.2 min; camp first taken at 1.8 min (was 3.5) |
| Mixed, raids off / all six sites | median win 3.8 / 4.5 min |
| Two healers, two warriors, an archer | median win 3.9 min |
| All archers / all magicians | won 30/30, median 5.0 / 7.0 min |
| All healers | never wins: nobody to follow; idle 80%, every reason readable |
| Mixed, no bounties: raids reaching the hall | 61/210 (all warriors 28/210); horn 4/210, hall flag 2/210 |

- Why the mixed guild wins sooner: the second recruit is a healer, not a second warrior who joins the den
  bounty mid-hunt and splits it (the step 4 recheck finding). The first warrior can afford a steel sword about
  a minute in, and takes the camp with the healer behind them.
- Healers: 20–43 heals and 270–600 health per run; a monster on them in melee 0.3–0.7% of their time outside
  the hall; no healer deaths in any mixed scenario. A single healer earns 80–120g a run, about what each warrior earns
  on bounty runs (two healers split it); 25–55g of it is the third of kill coin, the rest bounty shares and wages.
- Adventurer deaths stay near zero (0–0.6 a run), so still little tension; the healer makes it lower.
- Archers and magicians recruited third and fourth idle 51–63% on bounty runs and end at level 1.4–1.8, because
  the map is cleared about 3 min after they join. With no bounties they idle about 32% and reach level 3.6–4.2.
- Magician fire hits a second target 0.3–1.1 times a run when the den and camp are pushed, and 39 times a run
  in an all-magician guild. Groups are rare before step 8's waves.
- Draw calls: each class model is 1–3 meshes more than the old adventurer, and projectiles come from a small
  pool. Real frame times still need Rawa's Android.

**Step 6, specialists, gear condition, arrays and ward stones.** Built in Claude Code and bot-tested: 25 scenarios × 30
runs × 12 min (the 17 older ones plus 8 new). Zero stuck units, every decision has a reason, and the ledger (now with array
shots), flag pots and stores (wood and stone) balance in every run. From step 6 the scripted player builds the blacksmith
at 20 s, since only the alchemist comes built. The UI was tested in a real browser at phone portrait and landscape by real
taps (build the blacksmith and the array master, build an array, upgrade the blacksmith, adventurer and specialist cards,
the blacksmith hint), with no console errors. Draw calls: 84 at a mid zoom. The bot caught four problems, all fixed:
arrays with range 9 could not reach the hall wall from their plots (raids reaching the hall 32/210 → 29/210 at range 12,
see below); gear never broke (wear raised 2.5×); once the blacksmith was upgraded, adventurers saved for a tier-2 weapon
before buying tier-1 armour (each tier is now filled first); hints showed underneath an open card (also true in step 5).

| 30 runs × 12 min | Step 5 | Step 6 |
|---|---|---|
| All warriors, den then camp (`normal`) | median win 6.3 min | 5.7 min; better weapon at 5 min 23% (was 15%) |
| `campPush` / `farSites` | 6.7 / 7.2 min | 5.4 / 6.3 min |
| Mixed guild, den then camp (`mixed`) | 4.2 min | 4.6 min |
| Mixed, all six sites (`mixedFar`) | 4.5 min | 5.8 min (the player also pays 70g for the blacksmith, so the camp bounty comes later) |
| All archers / all magicians | 5.0 / 7.0 min | 4.4 / 5.9 min |
| Never build the blacksmith (`noSmith`, mixed) | – | won 30/30, median 5.1 min |
| Mixed, no bounties: raids reaching the hall | 61/210 | 52/210 (another 30 seeds: 73/210) |
| Same, two arrays on the camp side (`arrays`) | – | 29/210; stolen 11g a run, all recovered (24g without arrays) |

- Warriors win sooner because they save: one potion instead of two while they have 40% of the next gear's price. The mixed
  guild is 0.4 min slower. The camp is taken at the same time (1.8 min), but it falls later. Wear and saving are not the cause
  (tested: 4.5–4.6 min either way). The likely cause is that shopping is now separate trips (blacksmith, then alchemist) plus
  repairs mid-push.
- Gear condition: in 12-minute runs without bounties, 2–5 repairs a run (40–85g, taxed) and 0.1–0.4 breaks. Broken gear is
  under 1% of adventurer time, because they repair as soon as gear is worn and they can pay. In bounty runs, 0.3–0.6 repairs.
- **Tier 2 is never bought**, in any scenario, even with the blacksmith upgraded at 2.4 min and 12 minutes to shop
  (`shopsLong`), and even at 90g. Adventurers cannot finish tier 1 first: at 12 min about 80% have a tier-1 weapon but only
  about 30% tier-1 armour. Income (hunting, bounty shares) is spent on potions (13–18 a run) and repairs. This is the
  "gear is still slow" note below; escort pay and wave defence (steps 7–8) or cheaper gear would change it.
- Specialist sales in 12-minute runs without bounties: blacksmith about 400g (160g tax), alchemist about 200g (80g tax),
  array master 12–45g. Upgrades when the player saves for them: blacksmith at 2.4–4 min, alchemist at 4.3–6 min.
- Arrays (range 12): two arrays fire about 66 shots a run (66g), kill 5 raiders or wolves (no coin), and do 13–14% of all
  damage. All six and the upgrade: 67 shots, 7 kills, raids reaching the hall 26/210. With the treasury emptied at 200 s
  (`arraysBroke`), the arrays were silent for about 3 s a run before tax came back in. Arrays help but do not hold the hall
  alone. That is for step 8's waves, where arrays must be required.
- Ward stones: bought by 8–22% of adventurers by 12 min (only after their weapon and armour are the best on sale), set
  0.4–1.2 times a run on a hall flag, almost no kills. They will matter only when waves bring groups to the flags.
- The scripted player never has gold to spare for arrays before the map is cleared in bounty runs (`arraysNormal`: 0.1
  arrays a run).
- Seed noise: "raids reaching the hall" for the mixed guild ranges 52–73/210 between two sets of 30 seeds, so differences
  smaller than about 20 are not meaningful.

**Tuning notes for the content pass**
- First success is fast: the den falls about 23 s after posting. *(v3)* Keep that for the
  tutorial village. From mission 2, target about 2 min.
- Adventurer deaths are near zero, so there is little tension. *(v3)* No retreat on guard and
  escort should fix this; recheck deaths after step 4. *(step 4: 0.2 per run on a hall flag during
  raids; 3.1 per run on a flag beside the bandit camp. Deaths come from where the player plants.)*
- *(v3)* Guard and escort rewards will need to be higher than destroy rewards, because
  adventurers cannot walk away from them.
- Adventurers idle about 80% of the time with no bounty. Villagers, guard and escort work
  and roaming monsters should fill this. *(step 3: 74%. Phone test: most of the rest is the
  level wall after the den; wild animals in step 3b address it. Step 3b: about 40%.)*
- *(step 3b)* Levels now come from game, but gear is still slow: only about 10% of adventurers own a
  steel sword at 5 min. Specialist prices in step 6 decide this.
- *(step 3b)* A bear kills an adventurer about once every two runs when nobody posts bounties. That
  is the first real danger outside bounties; recheck after step 4.
- Gold does not yet hold progress back. Levels do. Tax is about 84g per run once gear is
  bought. Resources, upgrades and caravan income address this.
- *(v3)* The coin score gives a reason to hold gold back. Check first-timers still spend
  enough to clear the map.
- *(v3)* The wave escalation rate decides whether stalling pays. Tune it so waiting past the
  point of clearing costs more coin than caravans and tax bring in.
- *(v3.1)* Bot checks for waves: with no arrays, a wave breaks through the adventurers and
  reaches the hall; with arrays and bounties, it is held. Across many runs, surviving a
  wave should leave the treasury sometimes up and sometimes down, not always one way.
- *(v3.1)* Array shot cost against treasury size: an empty treasury silencing the arrays
  mid-wave should be a real danger, not the normal case.
- *(step 5)* Class balance is untuned. All archers clear faster than all warriors (5.0 against 5.9 min) with no
  more deaths, so fragility is not felt yet; check again once waves (step 8) bring groups to the village.
- *(step 6)* Tier-2 gear is out of reach in a 12-minute mission (see step 6). *(Rawa, 28 Sep: wait for the income from
  escorts and waves; recheck tier-2 purchases after steps 7 and 8.)*
- *(step 6)* The blacksmith now costs the player 70g, which delays the camp bounty when sites are built early (`mixedFar`
  5.8 min, was 4.5).
- *(step 5)* A healer makes the camp fall in under 2 min from mission start. Keep for the tutorial village;
  from mission 2 the target is about 2 min for the first success.

---

## 2. How the work runs

- Plan first, locked with Rawa. Change a locked point only when Rawa raises it.
- Claude proposes; Rawa decides anything that changes the design.
- Verify with measurements, not assertions: headless tests for placement, rules,
  frame times and platform calls. Always confirm on Rawa's Android before release.
- Keep the brief updated as the single source of truth; start long builds in a new
  chat with the brief and the current `index.html` (or its artifact link) attached,
  because long chats cost more per message. *(From step 6, Guildmaster)* In Claude Code the brief,
  `index.html` and the harness live in one folder, and `CLAUDE.md` tells each session to read the brief
  first. Clear the session between steps instead of starting a new chat.

## 3. What Playgama needs from the build

- **One file:** `index.html`, self-contained, plus `playgama-bridge-config.json` beside
  it. Upload both together. Everything inlined; no external assets to fetch.
- **Bridge v2** from `https://bridge.playgama.com/v2/stable/playgama-bridge.js`.
  Required order and calls:
  - `bridge.initialize()` first, before anything else touches the platform.
  - Saves through `bridge.storage`: v2 `get([keys])` returns an array (v1 was
    `get(key, false)`). One JSON string under one key is enough.
  - Pause and audio events: `bridge.platform.on(EVENT_NAME.PAUSE_STATE_CHANGED)` opens
    the pause menu and stops the clock; `AUDIO_STATE_CHANGED` suspends sound.
  - `sendMessage('game_ready')` once the title screen is playable, then
    `level_started` / `completed` / `failed` / `paused` / `resumed`.
  - Interstitials only between runs, never at the start or mid-play.
  - Without Bridge (a plain test page) the game must fall back to device storage and
    run the same.
- **Leaderboards:** create each board in the Playgama dashboard first. On Playgama they
  come through the `saas` block with the public token from the game's Leaderboards tab.
  List `playgama_sandbox` in the leaderboard platforms in the config. Boards show
  Playgama's random nicknames. Bridge's SaaS calls do not check for server errors.
- **Localisation** is listed as a required step (`platform.language`). Find the Village
  shipped English only; plan for it if there is time.
- **Licences:** anything added later (sounds, images, fonts, map data) needs a licence record.
  three.js (MIT) is inlined in the build; keep its licence header.

## 4. Store page and launch

- Title, tagline, description, How to play. Keep How to play in step with the controls;
  it is easy to forget after a control change.
- Square cover. Make it match the game's real look, so the click and the game agree.
  Do not put a "3D" badge on it; say it in the description instead.
- Form: Desktop yes, Android after the phone test, portrait and landscape, features
  (Leaderboards, saves), languages.
- 3 share boosts per game. Spend one at launch, keep the rest for after fixes or a
  gameplay clip. PL4YThemALL (Rawa's channel, 1,900+ subs) is the other traffic source.

## 5. Numbers that decide a weekly challenge

Guildmaster is not entered in a challenge now. This section is kept for a future one.

Challenges run 7 days and can be entered before the deadline; the sandbox entry can be
updated until it closes, so put the last update in with a day to spare.

- Qualify: **100+ gameplay sessions** and an **average playtime of 5 minutes or more**.
- Win: the **most-liked** qualifying game.
- So the build must hold attention past five minutes, and end a run well enough that
  someone wants to press like.

**What the numbers looked like on Find the Village (23–24 Sep):** 100+ sessions, 20 likes,
only 6 players on the leaderboard. Plenty started, few finished. Lesson for the next game:

- **Teach the core rule in the first 30 seconds**, in the world if possible, not in a wall
  of text. A player who does not know what to do quits before the first reward.
- **Make the first success short.** The first level should be winnable in about two
  minutes by someone who has never played.
- **Give a visible target early.** Something on screen that says "go there".
- Watch: sessions, average playtime, share of sessions past 30 s (Cadenza: ~35%),
  likes, and real players' scores. Decide difficulty from those, not from Rawa's own runs,
  which are always far better than a first-timer's.

## 6. Technical lessons worth carrying

- Keep touch controls off the screen edges.
- Phone controls that worked (first-person games): drag the left half to move, drag the
  right half to look. Guildmaster uses a strategy camera instead (see 1b).
- A 10 km low-poly world runs at 60 fps on Android when terrain is built in chunks around
  the player, trees are instanced, and anything between the camera and the player is cut away.
- Web Audio built from oscillators and noise costs nothing to ship and needs no licence.
  Give every ambient sound a reason to fade out; a sound that never stops becomes a nuisance.
- Test headlessly with a real browser: placement rules, the movement code driven by a bot,
  frame times, and the platform call order against a mock Bridge.
- Save progress under one versioned key so later builds can read older saves.
- *(Guildmaster)* Keep the simulation separate from the rendering, so the bot can run
  hundreds of games in seconds without a browser. Step 1's simulation costs about 0.03 ms
  per step.
- *(Guildmaster)* Bot checks that caught real bugs: "wanted to move for 8 s but walked less
  than 1 unit", "every decision has a reason", "no quest beyond risk tolerance", and
  "the ledger balances".
- *(Guildmaster, step 3b)* The bot harness (`guildmaster_bot_harness.js`) loads the sim from
  `index.html` in Node, runs scripted-player scenarios (campPush, normal, noBounty, farSites) and
  reports win times, idle time, levels, deaths, and the checks: stuck units, decisions without a
  reason, ledger balance, animals in town, caps. Compare every step against the previous build.
  *(Step 4)* New scenarios: raidHorn, raidFlag, normalHorn, farQuiet, farFlag, flagDanger. New reports:
  raid response (time to first blow, raids reaching the hall, raids that find the town empty), flag pots
  and horn pay, deaths on a flag, and away adventurers defending for free. It runs on older builds too,
  so each step can be compared with the one before. About 60 s per scenario on one core; run them one
  at a time in the foreground, since a background run is killed when its tool call ends (claude.ai; in
  Claude Code, scenarios can run in parallel). Plain Node, nothing to install.
  *(Step 5)* The scripted player picks each recruit's class. New scenarios: mixed, mixedPush, mixedNoBounty,
  mixedHorn, mixedFlag, mixedFar, twoHealers, allArcher, allMagician, allHealer. New reports: per class
  (recruits, kills, damage share, deaths, gold, idle, level, gear), healing (heals, health healed, wasted heal,
  coin share, time with a monster on the healer in melee), magician area hits, and a check that no healer
  takes a destroy bounty or hunts.
  *(Step 6, in Claude Code)* Run with the Node at `%LOCALAPPDATA%\Programs\node\node-v24.19.0-win-x64\node.exe` (a
  portable copy; nothing is installed system-wide). On 8 cores all 25 scenarios run in parallel in about 15 min; output
  appears only when a scenario finishes. From step 6 the scripted player builds the blacksmith at 20 s in every scenario
  except `noSmith`, since only the alchemist comes built. New scenarios: noSmith, shops, shopsLong, arrays, arraysAll,
  arraysNormal, arraysBroke, wardFlag. New levers: quarry at 40 s, array master at a set time, arrays on listed plots,
  upgrades in a listed order (saving for the next rather than buying the cheapest), keeping 100g back for the camp
  bounty, and emptying the treasury at 200 s. New reports: SHOPS (built, upgraded, sales and tax per specialist, gold,
  wood and stone spent on building), GEAR (first tier-1 and tier-2 weapon, purchases, end tiers, ward stones, breaks,
  repairs, time with broken gear), ARRAYS (shots and their cost, kills, share of all damage, time silent) and WARDS.
  New checks: the ledger includes array shots; the stores balance (wood and stone delivered, less what was spent, equals
  what is in the store).
- *(Guildmaster, step 6)* Testing the UI in Claude Code: the built-in browser cannot open `file://`, so
  `.claude/launch.json` starts a tiny static server (`tools/serve.js`, plain Node). The page runs slowly while
  the browser pane is hidden, so fast-forward from the console with `GM.step(GM.sim(), 1/30)` and use `GM.screenOf` to
  find where to tap. Browser checks time out while a full bot batch is running; do them before or after.
- *(Guildmaster)* Units need steering around buildings, not just a push-out. Otherwise they
  stick to walls.
- *(Guildmaster)* Frame the start camera on the first target for the actual screen shape.
  In portrait, a fixed zoom left the wolf den off-screen.

## 7. Timeline for a challenge entry

1. Brief locked, then a playable core in one build.
2. Levels or content pass, then the platform wiring (Bridge, saves, leaderboard).
3. Sandbox upload, store page, phone test.
4. Launch with one share boost; read the numbers the next day.
5. One tuning update from real data, in with a day to spare.
