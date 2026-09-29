// Headless bot harness for Guildmaster (step 6). Usage: node guildmaster_bot_harness.js index.html <scenario> [runs=30] [minutes=10]
// scenarios: campPush normal noBounty farSites cancel | step 4: raidHorn raidFlag normalHorn farFlag flagDanger
// step 5: mixed mixedPush mixedNoBounty mixedHorn mixedFlag mixedFar twoHealers allArcher allMagician allHealer (the scripted player picks each recruit's class)
// step 6: noSmith shops arrays arraysAll arraysNormal arraysBroke wardFlag. From step 6 the scripted player builds the blacksmith at 20 s in every
// scenario except noSmith (only the alchemist comes built), so the older scenarios keep their meaning.
// Works on older builds too: step 4-6 levers are skipped when the build does not have them, and raids are detected here, not read from the sim.
const fs = require('fs'), vm = require('vm');
// file: index.html (the game's own script is taken from its last <script> block) or a plain .js sim
function load(file) {
  const ctx = { window: {}, location: { search: '?headless=1' }, console, Math, performance: { now: () => 0 } };
  let src = fs.readFileSync(file, 'utf8');
  if (/\.html?$/.test(file)) { const a = src.lastIndexOf('<script>') + 8; src = src.slice(a, src.indexOf('</script>', a)); }
  vm.createContext(ctx); vm.runInContext(src, ctx);
  return ctx.window.GM;
}
const d2 = (a, b, c, d) => Math.hypot(a - c, b - d);
function run(GM, seed, scen, minutes) {
  const CFG = GM.CFG;
  const S = GM.newSim(seed);
  if (scen.noRaids) for (const L of S.lairs) L.raidEvery = 0;
  const DT = 1 / 30, T = minutes * 60;
  const track = new Map(), stuck = [], noWhy = [], bad = [];
  let campPostedT = null, campTakenT = null, denPosted = false, sitesBuilt = false, lvlAt5 = null, gearAt5 = null;
  let maxWild = {}, wildInTown = 0, wildSpawns = {}, seenWild = new Set(), campReadyT = null, ledgerErr = 0, potErr = 0;
  // ---- step 4 bookkeeping ----
  const raids = [], seenRaider = new Set(), prevState = new Map();
  let pendingRaid = false, freeAway = 0, cancelled = false, hallFlagId = null, raidOverT = null, farFlagT = null, farFlagDutyT = null, dangerFlagT = null;
  const hornTimes = [];   // [t sounded, t first answerer home]
  const hasFlags = !!GM.plantFlag, hasHorn = !!GM.soundHorn, hasCls = !!GM.setRecruitClass, hasShops = !!GM.buildShop;
  let healerBad = 0, healerQuest = 0, resErr = 0, brokeT = null, arraysBuiltT = null, tierEnd = null;
  const Lx = (L, k) => (L[k] || 0);
  const wildKinds = ['deer', 'boar', 'bear'];
  for (let i = 0; S.t < T; i++) {
    // ---- scripted player ----
    const den = S.lairs.find(l => l.id === 'den'), camp = S.lairs.find(l => l.id === 'camp');
    if (scen.bounties && !denPosted && S.t > 10) { GM.postBounty(S, 'den', 50); denPosted = true; }
    if (scen.bounties && !den.alive && camp.alive) {
      if (campPostedT == null && S.gold >= 100) { GM.postBounty(S, 'camp', 100); campPostedT = S.t; }
      else if (campPostedT != null && S.bounty.camp < 150 && S.gold >= 25 && S.t - campPostedT > 60 * (S.bounty.camp - 75) / 25) GM.postBounty(S, 'camp', 25);
    }
    if (scen.farSites && !sitesBuilt && S.t > 30) { for (const id of ['quarry1', 'lumber2', 'quarry2', 'farm2']) GM.buildSite(S, id); sitesBuilt = true; }
    if (scen.cancel && S.t > 20 && S.t < 21 && GM.cancelBounty) { GM.postBounty(S, 'camp', 25); }
    // (step 4 fix: the old 40 s window could fall on two steps, and the second call found nothing left to cancel)
    if (scen.cancel && S.t > 40 && !cancelled && GM.cancelBounty) { cancelled = true; const ok = GM.cancelBounty(S, 'camp'); if (!ok && !S.adv.some(a => a.state === 'quest' && a.target === 'camp')) bad.push('cancel refused while untaken'); }
    // step 4 levers
    const liveRaid = S.mobs.filter(m => !m.dead && m.state === 'raid');
    const newRaid = pendingRaid; pendingRaid = false;
    if (scen.horn && newRaid && hasHorn && GM.hornReady(S)) { if (GM.soundHorn(S)) hornTimes.push([S.t, null, null]); }
    if (scen.hallFlag && hasFlags) {
      if (newRaid && !S.flags.some(F => F.id === hallFlagId) && S.gold >= 100) { const F = GM.plantFlag(S, 0, 0, 100, 'hall'); if (F) { hallFlagId = F.id; raidOverT = null; } }
      const hf = S.flags.find(F => F.id === hallFlagId);
      if (hf) {   // a sensible player takes the flag down once the raid is over
        const quiet = !liveRaid.length && !S.mobs.some(m => !m.dead && m.state !== 'scatter' && Math.hypot(m.x, m.z) < CFG.townR + 4);
        if (quiet) { raidOverT = raidOverT == null ? S.t : raidOverT; if (S.t - raidOverT > 10) { GM.cancelFlag(S, hf.id); hallFlagId = null; } } else raidOverT = null;
      }
    }
    if (scen.farFlag && hasFlags && S.t > 32) {
      const F = GM.flagFor(S, 'lumber2');
      if (!F && farFlagT == null && S.sites.find(x => x.id === 'lumber2').built) { if (GM.plantFlag(S, 0, 0, 50, 'lumber2')) farFlagT = S.t; }
      else if (F && F.pot < 15 && S.gold >= 60) GM.raiseFlag(S, F.id, 25);
      if (farFlagT != null && farFlagDutyT == null && S.adv.some(a => a.state === 'flag' && a.onDuty)) farFlagDutyT = S.t;
    }
    if (scen.dangerFlag && hasFlags && S.t > 240 && dangerFlagT == null) {
      const c = CFG.lairs.find(l => l.id === 'camp'), d = Math.hypot(c.x, c.z);
      if (GM.plantFlag(S, c.x - c.x / d * 11, c.z - c.z / d * 11, 150, null)) dangerFlagT = S.t;
    }
    // step 5: the scripted player picks the class of the next recruit
    if (scen.classes && hasCls) { const c = scen.classes[Math.min(S.adv.length, scen.classes.length - 1)]; if (S.nextCls !== c) GM.setRecruitClass(S, c); }
    // step 6: a sensible player builds the blacksmith early; the step 6 scenarios also build a quarry, the array master, arrays and upgrades
    if (hasShops && i % 15 === 0) {
      if (!scen.noSmith && S.t > 20 && !S.shops.smith.built) GM.buildShop(S, 'smith');
      if (scen.quarry && S.t > 40) { const q = S.sites.find(x => x.id === 'quarry1'); if (!q.built) GM.buildSite(S, 'quarry1'); }
      // keep enough back for the camp bounty while it is still wanted
      const reserve = scen.bounties && camp.alive && campPostedT == null ? 100 : 0, spare = c => S.gold - (c.gold || 0) >= reserve;
      if (scen.arrayMaster && S.t > scen.arrayMaster && !S.shops.arrays.built && spare(GM.shopCost('arrays'))) GM.buildShop(S, 'arrays');
      if (scen.arrays && S.shops.arrays.built) for (const id of scen.arrays) { const A = S.arrays.find(x => x.id === id); if (!A.built && GM.canPay(S, GM.arrayCost()) && spare(GM.arrayCost())) GM.buildArray(S, id); }
      if (scen.upgrade) {   // in the order listed: the player saves for the next one rather than buying whatever is cheapest
        const id = scen.upgrade.find(k => S.shops[k].built && S.shops[k].level < 2);
        if (id && GM.canPay(S, CFG.shops[id].up) && spare(CFG.shops[id].up)) GM.upgradeShop(S, id);
      }
      if (arraysBuiltT == null && scen.arrays && scen.arrays.every(id => S.arrays.find(x => x.id === id).built)) arraysBuiltT = S.t;
      // a careless player: at 200 s everything left in the treasury goes on the camp bounty, so the arrays have nothing to fire with
      if (scen.broke && brokeT == null && S.t > 200) { brokeT = S.t; if (S.gold >= 1) GM.postBounty(S, 'camp', Math.floor(S.gold)); }
    }
    for (const a of S.adv) prevState.set(a, a.state);
    GM.step(S, DT);
    for (const a of S.adv) if (!a.dead && a.cls === 'healer') { if (a.state === 'quest') healerQuest++; if (a.state === 'hunt' || a.state === 'game' || a.state === 'chase') healerBad++; }
    // ---- step 4 checks: raids, free defence, horn ----
    for (const m of S.mobs) if (!m.dead && m.state === 'raid' && !seenRaider.has(m.id)) {
      seenRaider.add(m.id); pendingRaid = true;
      let g = raids.find(r => r.t === S.t);
      if (!g) { g = { t: S.t, ids: [], hitT: null, reachedT: null, away: S.adv.filter(a => !a.dead && !a.inside && Math.hypot(a.x, a.z) > 17).length, home: S.adv.filter(a => !a.dead && (a.inside || Math.hypot(a.x, a.z) <= 17)).length }; raids.push(g); }
      g.ids.push(m.id);
    }
    for (const g of raids) {
      if (g.hitT != null && g.reachedT != null) continue;
      for (const id of g.ids) {
        const m = S.mobs.find(x => x.id === id); if (!m) continue;
        if (g.hitT == null && m.hitT > g.t) g.hitT = S.t;
        if (g.reachedT == null && !m.dead && Math.hypot(m.x, m.z) < CFG.hall.r + 1.3) g.reachedT = S.t;
      }
    }
    for (const a of S.adv) {
      if (a.dead) continue;
      const was = prevState.get(a); if (was === a.state) continue;
      const far = Math.hypot(a.x, a.z) > 17 && !a.inside;
      if (a.state === 'defend' && far) freeAway++;
      if (a.state === 'chase' && far) { const m = S.mobs.find(x => x.id === a.target); if (m && m.state === 'raid' && Math.hypot(m.x - a.x, m.z - a.z) > 15) freeAway++; }
    }
    for (const h of hornTimes) { if (h[1] == null && S.adv.some(a => a.state === 'horn' && a.hornAt != null && a.hornAt >= h[0])) h[1] = S.t; if (h[2] == null && S.adv.some(a => a.state === 'horn' && a.hornFromAway && a.hornAt != null && a.hornAt >= h[0])) h[2] = S.t; }
    // ---- checks ----
    if (campPostedT != null && campTakenT == null && S.adv.some(a => !a.dead && a.state === 'quest' && a.target === 'camp')) campTakenT = S.t;
    if (campReadyT == null && camp.alive) {
      const willing = S.adv.filter(a => !a.dead && GM.power(a) + a.courage + 1.6 >= camp.level + 0.35 * camp.cap).length;
      if (willing >= 2) campReadyT = S.t;
    }
    if (lvlAt5 == null && S.t >= 300) { const al = S.adv.filter(a => !a.dead); lvlAt5 = al.reduce((s, a) => s + a.lvl, 0) / Math.max(1, al.length); gearAt5 = al.filter(a => a.weapon > 0).length / Math.max(1, al.length); }
    const units = [...S.adv.filter(a => !a.dead && !a.inside), ...S.vil.filter(v => !v.dead && !v.inside), ...S.mobs.filter(m => !m.dead && m.state !== 'scatter')];
    for (const u of units) {
      let k = track.get(u); if (!k) { k = { x: u.x, z: u.z, px: u.x, pz: u.z, walked: 0, t: 0, mv: 0 }; track.set(u, k); }
      k.t += DT; if (u.wantMove && !u.fighting) k.mv += DT; k.walked += d2(u.x, u.z, k.px, k.pz); k.px = u.x; k.pz = u.z;
      if (k.t >= 8) { if (k.mv >= 7.9 && k.walked < 1) stuck.push(`${u.type}/${u.kind || u.name}/${u.state} at ${u.x.toFixed(1)},${u.z.toFixed(1)} t=${S.t.toFixed(0)}`); k.x = u.x; k.z = u.z; k.t = 0; k.mv = 0; k.walked = 0; }
      if (!u.why && S.t > 1) noWhy.push(`${u.type}/${u.kind || u.name}/${u.state}`);
    }
    for (const m of S.mobs) if (m.wild && !m.dead) {
      if (!seenWild.has(m.id)) { seenWild.add(m.id); wildSpawns[m.kind] = (wildSpawns[m.kind] || 0) + 1; }
      if (d2(m.x, m.z, 0, 0) < CFG.townR + 4) wildInTown++;
    }
    for (const k of wildKinds) { const n = S.mobs.filter(m => m.kind === k && !m.dead).length; maxWild[k] = Math.max(maxWild[k] || 0, n); }
    if (i % 30 === 0) {
      const L = S.ledger, exp = CFG.startGold + L.tax + L.deliveries + L.recovered + Lx(L, 'refunds') + Lx(L, 'flagRefunds') - L.bounties - L.builds - L.stolen - Lx(L, 'flags') - Lx(L, 'horn') - Lx(L, 'arrayShots');
      if (Math.abs(exp - S.gold) > 0.01) ledgerErr++;
      // step 6: wood and stone in the store are what was delivered, less what upgrades and arrays used
      if (S.stats.resSpent) for (const r of ['wood', 'stone']) if (Math.abs(CFG.startRes[r] + S.stats.delivered[r] - S.stats.resSpent[r] - S.res[r]) > 0.01 || S.res[r] < 0) resErr++;
      if (S.flags) { const pots = S.flags.reduce((t, F) => t + F.pot, 0); if (Math.abs(pots - (L.flags - L.flagRefunds - L.wages - L.killPay)) > 0.01 || S.flags.some(F => F.pot < 0)) potErr++; }
      if (S.gold < 0) bad.push('negative gold');
    }
    if (S.won) break;
  }
  // no quest beyond tolerance
  for (const q of S.stats.quests) if (q.gap > q.tol + 1e-9) bad.push('quest beyond tolerance');
  const al = S.adv.filter(a => !a.dead);
  const Ld = S.ledger, st = S.stats;
  const resp = raids.filter(g => g.hitT != null).map(g => g.hitT - g.t);
  return {
    empty: raids.filter(g => g.home === 0).map(g => ({ resp: g.hitT != null ? g.hitT - g.t : null, reached: g.reachedT != null })),
    raids: raids.length, raidsAnswered: resp.length, resp, raidsReached: raids.filter(g => g.reachedT != null).length, raidAway: raids.reduce((t, g) => t + g.away, 0),
    freeAway, potErr, hornResp: hornTimes.filter(h => h[1] != null).map(h => h[1] - h[0]), hornRespAway: hornTimes.filter(h => h[2] != null).map(h => h[2] - h[0]), horns: hornTimes.length,
    flagDeaths: st.flagDeaths || 0, hornDeaths: st.hornDeaths || 0, flagTakes: st.flagTakes || 0, flagKills: st.flagKills || 0, hornAnswers: st.hornAnswers || 0, hornAway: st.hornAway || 0, hornPays: st.hornPays || 0, recheck: st.recheckSwitch || 0,
    flagPosted: Lx(Ld, 'flags'), flagBack: Lx(Ld, 'flagRefunds'), wages: Lx(Ld, 'wages'), killPay: Lx(Ld, 'killPay'), hornPaid: Lx(Ld, 'horn'), recovered: Ld.recovered,
    farFlagDuty: farFlagT != null && farFlagDutyT != null ? farFlagDutyT - farFlagT : null, dangerPlanted: dangerFlagT != null,
    dangerTaken: dangerFlagT != null && (st.quests || []).some(q => q.flag != null && q.t >= dangerFlagT),
    campT0: S.stats.firstTaken.camp,
    won: S.won, wonT: S.won ? S.wonT : null, campReadyT, campPostedT, campTakenT,
    campT: S.stats.cleared.camp, denT: S.stats.cleared.den,
    idle: S.stats.advIdleT / Math.max(1, S.stats.advT), deaths: S.stats.deaths, vilDeaths: S.stats.vilDeaths,
    lvlAt5, gearAt5, lvlEnd: al.reduce((s, a) => s + a.lvl, 0) / Math.max(1, al.length),
    gearEnd: al.filter(a => a.weapon > 0 && a.armour > 0).length / Math.max(1, al.length),
    tax: S.ledger.tax, del: S.ledger.deliveries, gold: S.gold, stuck, noWhy: [...new Set(noWhy)], bad: [...new Set(bad)], ledgerErr,
    maxWild, wildSpawns, wildInTown, kills: S.stats.kills, gameKills: S.stats.gameKills || {}, flees: S.stats.flees, T: S.t,
    stolenG: S.ledger.stolen,
    byCls: st.byCls || null, lvlByCls: al.reduce((m, a) => { const k = a.cls || 'warrior'; (m[k] = m[k] || []).push(a.lvl); return m; }, {}),
    gearByCls: al.reduce((m, a) => { const k = a.cls || 'warrior'; (m[k] = m[k] || []).push(a.weapon > 0 ? 1 : 0); return m; }, {}),
    heals: st.heals || 0, healed: st.healed || 0, overheal: st.overheal || 0, healShare: st.healShare || 0, healerOutT: st.healerOutT || 0, healerMeleeT: st.healerMeleeT || 0,
    follows: st.follows || 0, splashHits: st.splashHits || 0, healerBad, healerQuest,
    healerBounty: (st.healerBountyG || 0),
    // step 6
    shops: S.shops ? Object.fromEntries(Object.entries(S.shops).map(([k, s]) => [k, { built: s.built, level: s.level, sales: s.sales, tax: s.tax, builtT: st.builtShop[k], upT: st.upgraded[k] }])) : null,
    firstBuy: st.firstBuy || {}, bought: st.bought || {}, repairs: st.repairs || 0, repairG: st.repairG || 0, breaks: st.breaks || 0, brokenT: st.brokenT || 0, advT: st.advT,
    wTier: al.map(a => a.weapon), aTier: al.map(a => a.armour), wards: al.filter(a => a.ward).length / Math.max(1, al.length),
    arraysBuilt: S.arrays ? S.arrays.filter(A => A.built).length : 0, arraysBuiltT, arrayShots: st.arrayShots || 0, arrayCoin: Lx(Ld, 'arrayShots'), arrayKills: st.arrayKills || 0,
    arrayDmg: st.arrayDmg || 0, advDmg: st.byCls ? Object.values(st.byCls).reduce((t, b) => t + b.dmg, 0) : 0, arraySilent: st.arraySilent || 0, brokeT,
    wardSets: st.wardSets || 0, wardShots: st.wardShots || 0, wardKills: st.wardKills || 0, resErr, resSpent: st.resSpent || { wood: 0, stone: 0 }, builds: Ld.builds, spent: st.spent
  };
}
module.exports = { load, run };
const MIX = ['warrior', 'healer', 'archer', 'magician', 'warrior'];
if (require.main === module) {
  const [file, scenName, runs = 30, minutes = 10] = process.argv.slice(2);
  const SC = {
    campPush: { bounties: true, noRaids: true },       // den, then camp, no raids to level from
    normal: { bounties: true },                        // den, then camp, raids on
    noBounty: {},                                      // player does nothing
    farSites: { bounties: true, farSites: true },      // all six sites built
    cancel: { cancel: true },
    // step 4
    raidHorn: { horn: true },                           // no bounties, horn on every raid
    raidFlag: { hallFlag: true },                       // no bounties, 100g flag at the hall on every raid, taken down after
    normalHorn: { bounties: true, horn: true },         // den, then camp, horn on every raid
    farQuiet: { farSites: true },                          // all six sites, no bounties: wolves keep hunting
    farFlag: { farSites: true, farFlag: true },            // same, plus a 50g flag on the far lumber camp, topped up
    flagDanger: { flagDangerous: true, dangerFlag: true },       // no bounties, a 150g flag 11 units from the bandit camp at 4 min
    // step 5: the same players with a mixed guild (recruit order: warrior, healer, archer, magician, warrior)
    mixed: { bounties: true, classes: MIX }, mixedPush: { bounties: true, noRaids: true, classes: MIX }, mixedNoBounty: { classes: MIX },
    mixedHorn: { horn: true, classes: MIX }, mixedFlag: { hallFlag: true, classes: MIX }, mixedFar: { bounties: true, farSites: true, classes: MIX },
    twoHealers: { bounties: true, classes: ['warrior', 'healer', 'warrior', 'healer', 'archer'] },
    allArcher: { bounties: true, classes: ['archer'] }, allMagician: { bounties: true, classes: ['magician'] }, allHealer: { bounties: true, classes: ['healer'] },
    // step 6 (all with the mixed guild)
    noSmith: { bounties: true, classes: MIX, noSmith: true },                                                     // the player never builds the blacksmith
    shops: { bounties: true, classes: MIX, quarry: true, upgrade: ['smith', 'alch'] },                           // quarry at 40 s, then upgrades
    shopsLong: { classes: MIX, quarry: true, upgrade: ['smith', 'alch'] },                                       // no bounties: the upgraded blacksmith has 12 min to sell
    arrays: { classes: MIX, quarry: true, arrayMaster: 60, arrays: ['a1', 'a2'] },                                // no bounties; two arrays on the camp side
    arraysAll: { classes: MIX, quarry: true, arrayMaster: 60, arrays: ['a1', 'a2', 'a3', 'a4', 'a5', 'a6'], upgrade: ['arrays', 'smith'] },
    arraysNormal: { bounties: true, classes: MIX, quarry: true, arrayMaster: 60, arrays: ['a1', 'a2'] },
    arraysBroke: { classes: MIX, quarry: true, arrayMaster: 60, arrays: ['a1', 'a2'], broke: true },              // the treasury is emptied at 200 s
    wardFlag: { hallFlag: true, classes: MIX, arrayMaster: 60 }                                                   // hall flag on every raid; ward stones on sale
  };
  const GM = load(file), rs = [];
  const t0 = Date.now();
  for (let i = 0; i < +runs; i++) rs.push(run(GM, 1000 + i * 7919, SC[scenName], +minutes));
  const avg = f => { const v = rs.map(f).filter(x => x != null); return v.length ? (v.reduce((a, b) => a + b, 0) / v.length) : null; };
  const cnt = f => rs.filter(f).length;
  const med = f => { const v = rs.map(f).filter(x => x != null).sort((a, b) => a - b); return v.length ? v[Math.floor(v.length / 2)] : null; };
  const r1 = x => x == null ? '-' : (Math.round(x * 10) / 10);
  console.log(`== ${scenName} × ${runs} runs × ${minutes} min (${((Date.now() - t0) / 1000).toFixed(1)} s)`);
  console.log(`won ${cnt(r => r.won)}/${runs}  median win ${r1(med(r => r.wonT && r.wonT / 60))} min  den cleared ${cnt(r => r.denT != null)}  camp cleared ${cnt(r => r.campT != null)} (median ${r1(med(r => r.campT && r.campT / 60))} min)`);
  console.log(`camp: ready (2 adv willing at max pull) ${cnt(r => r.campReadyT != null)}/${runs} median ${r1(med(r => r.campReadyT && r.campReadyT / 60))} min; posted ${cnt(r => r.campPostedT != null)}; taken ${cnt(r => r.campTakenT != null)} median ${r1(med(r => r.campTakenT && r.campTakenT / 60))} min`);
  console.log(`idle ${r1(avg(r => r.idle * 100))}%  lvl@5min ${r1(avg(r => r.lvlAt5))}  weapon@5min ${r1(avg(r => r.gearAt5 * 100))}%  lvl end ${r1(avg(r => r.lvlEnd))}  full gear end ${r1(avg(r => r.gearEnd * 100))}%`);
  console.log(`adv deaths ${r1(avg(r => r.deaths))}/run  villager deaths ${r1(avg(r => r.vilDeaths))}/run  flees ${r1(avg(r => r.flees))}  kills ${r1(avg(r => r.kills))}  tax ${r1(avg(r => r.tax))}g  deliveries ${r1(avg(r => r.del))}g  stolen ${r1(avg(r => r.stolenG))}g`);
  const gk = {}; for (const r of rs) for (const k in r.gameKills) gk[k] = (gk[k] || 0) + r.gameKills[k];
  if (Object.keys(gk).length) console.log(`game kills/run: ${Object.entries(gk).map(([k, v]) => k + ' ' + r1(v / rs.length)).join(', ')}  max alive: ${JSON.stringify(rs.reduce((m, r) => { for (const k in r.maxWild) m[k] = Math.max(m[k] || 0, r.maxWild[k]); return m; }, {}))}  spawned/run: ${Object.entries(rs.reduce((m, r) => { for (const k in r.wildSpawns) m[k] = (m[k] || 0) + r.wildSpawns[k]; return m; }, {})).map(([k, v]) => k + ' ' + r1(v / rs.length)).join(', ')}  wild-in-town frames ${rs.reduce((s, r) => s + r.wildInTown, 0)}`);
  const stuck = rs.flatMap(r => r.stuck), noWhy = [...new Set(rs.flatMap(r => r.noWhy))], bad = [...new Set(rs.flatMap(r => r.bad))];
  const all = f => rs.flatMap(f), mdn = v => { v = v.slice().sort((a, b) => a - b); return v.length ? v[Math.floor(v.length / 2)] : null; }, mx = v => v.length ? Math.max(...v) : null, p90 = v => { v = v.slice().sort((a, b) => a - b); return v.length ? v[Math.floor(v.length * 0.9)] : null; };
  const nR = rs.reduce((t, r) => t + r.raids, 0), nA = rs.reduce((t, r) => t + r.raidsAnswered, 0), nH = rs.reduce((t, r) => t + r.raidsReached, 0);
  console.log(`RAIDS ${r1(nR / rs.length)}/run, adventurers away at the raid ${r1(rs.reduce((t, r) => t + r.raidAway, 0) / Math.max(1, nR))} of 5; fought ${nA}/${nR}; time from leaving the camp to the first blow: median ${r1(mdn(all(r => r.resp)))} s, 90% ${r1(p90(all(r => r.resp)))} s, max ${r1(mx(all(r => r.resp)))} s; reached the hall ${nH}/${nR}; stolen ${r1(avg(r => r.stolenG))}g/run (recovered ${r1(avg(r => r.recovered))}g); away adventurers defending for free ${rs.reduce((t, r) => t + r.freeAway, 0)}`);
  const E = all(r => r.empty);
  console.log(`EMPTY TOWN (no adventurer within 17 of the hall when the raid left): ${E.length} raids; fought ${E.filter(e => e.resp != null).length}, first blow median ${r1(mdn(E.filter(e => e.resp != null).map(e => e.resp)))} s max ${r1(mx(E.filter(e => e.resp != null).map(e => e.resp)))} s; reached the hall ${E.filter(e => e.reached).length}/${E.length}`);
  if (rs.some(r => r.horns || r.flagPosted)) console.log(`STEP4 horn: ${r1(avg(r => r.horns))}/run, answers ${r1(avg(r => r.hornAnswers))} (${r1(avg(r => r.hornAway))} from outside town), paid ${r1(avg(r => r.hornPaid))}g/run, first answerer from outside town home median ${r1(mdn(all(r => r.hornRespAway)))} s max ${r1(mx(all(r => r.hornRespAway)))} s | flags: posted ${r1(avg(r => r.flagPosted))}g, refunded ${r1(avg(r => r.flagBack))}g, wages ${r1(avg(r => r.wages))}g, kill pay ${r1(avg(r => r.killPay))}g (${r1(avg(r => r.flagKills))} kills), takes ${r1(avg(r => r.flagTakes))} | deaths on a flag ${r1(avg(r => r.flagDeaths))}/run, answering the horn ${r1(avg(r => r.hornDeaths))}/run | hunters switched on recheck ${r1(avg(r => r.recheck))}/run` +
    (rs.some(r => r.farFlagDuty != null) ? ` | far flag: first guard on duty median ${r1(med(r => r.farFlagDuty))} s after planting` : '') +
    (rs.some(r => r.dangerPlanted) ? ` | camp-side flag taken in ${cnt(r => r.dangerTaken)}/${cnt(r => r.dangerPlanted)} runs` : ''));
  if (rs[0].byCls) {
    const K = ['warrior', 'archer', 'magician', 'healer'], sum = (k, f) => rs.reduce((t, r) => t + f(r.byCls[k]), 0);
    const dmgAll = K.reduce((t, k) => t + sum(k, b => b.dmg), 0);
    const line = K.filter(k => sum(k, b => b.recruited)).map(k => {
      const n = sum(k, b => b.recruited), lv = rs.flatMap(r => r.lvlByCls[k] || []), gw = rs.flatMap(r => r.gearByCls[k] || []);
      return `${k} ×${r1(n / rs.length)}: kills ${r1(sum(k, b => b.kills) / rs.length)}, damage ${r1(100 * sum(k, b => b.dmg) / Math.max(1, dmgAll))}%, deaths ${r1(sum(k, b => b.deaths) / rs.length)}, gold earned ${r1(sum(k, b => b.gold) / rs.length)}g, idle ${r1(100 * sum(k, b => b.idleT) / Math.max(1, sum(k, b => b.t)))}%, level end ${r1(lv.reduce((a, b) => a + b, 0) / Math.max(1, lv.length))}, better weapon ${r1(100 * gw.reduce((a, b) => a + b, 0) / Math.max(1, gw.length))}%`;
    });
    console.log('CLASSES ' + line.join(' | '));
    if (sum('healer', b => b.recruited)) console.log(`HEALERS heals ${r1(avg(r => r.heals))}/run, ${r1(avg(r => r.healed))} hp/run (${r1(100 * rs.reduce((t, r) => t + r.overheal, 0) / Math.max(1, rs.reduce((t, r) => t + r.overheal + r.healed, 0)))}% of heal wasted), coin share from kills ${r1(avg(r => r.healShare))}g/run, follows ${r1(avg(r => r.follows))}/run, time with a monster on them in melee ${r1(100 * rs.reduce((t, r) => t + r.healerMeleeT, 0) / Math.max(1, rs.reduce((t, r) => t + r.healerOutT, 0)))}% of time outside; frames on a destroy bounty ${rs.reduce((t, r) => t + r.healerQuest, 0)}, frames hunting ${rs.reduce((t, r) => t + r.healerBad, 0)}`);
    if (rs.some(r => r.splashHits)) console.log(`MAGIC area hits ${r1(avg(r => r.splashHits))}/run`);
  }
  if (rs[0].shops) {
    const S0 = rs[0].shops, ids = Object.keys(S0), hist = v => { const h = {}; for (const x of v) h[x] = (h[x] || 0) + 1; return Object.entries(h).map(([k, n]) => `t${k} ${r1(100 * n / v.length)}%`).join(' '); };
    console.log(`SHOPS ` + ids.map(k => `${k}: built ${cnt(r => r.shops[k].built)}/${runs}${cnt(r => r.shops[k].builtT != null) ? ` (median ${r1(med(r => r.shops[k].builtT))} s)` : ''}, upgraded ${cnt(r => r.shops[k].level >= 2)} (median ${r1(med(r => r.shops[k].upT && r.shops[k].upT / 60))} min), sales ${r1(avg(r => r.shops[k].sales))}g, tax ${r1(avg(r => r.shops[k].tax))}g`).join(' | ') +
      ` | spent on building ${r1(avg(r => r.builds))}g, wood ${r1(avg(r => r.resSpent.wood))}, stone ${r1(avg(r => r.resSpent.stone))}`);
    console.log(`GEAR first tier-1 weapon median ${r1(med(r => r.firstBuy.weapon1))} s (${cnt(r => r.firstBuy.weapon1 != null)}/${runs}), tier-2 weapon ${cnt(r => r.firstBuy.weapon2 != null)}/${runs} runs (median ${r1(med(r => r.firstBuy.weapon2 && r.firstBuy.weapon2 / 60))} min); bought/run ${Object.entries(rs.reduce((m, r) => { for (const k in r.bought) m[k] = (m[k] || 0) + r.bought[k]; return m; }, {})).map(([k, v]) => k + ' ' + r1(v / rs.length)).join(', ')}` +
      ` | end weapons ${hist(all(r => r.wTier))}, armour ${hist(all(r => r.aTier))}, ward stones ${r1(avg(r => r.wards * 100))}% | breaks ${r1(avg(r => r.breaks))}/run, repairs ${r1(avg(r => r.repairs))}/run for ${r1(avg(r => r.repairG))}g, time with broken gear ${r1(100 * rs.reduce((t, r) => t + r.brokenT, 0) / Math.max(1, rs.reduce((t, r) => t + r.advT, 0)))}%`);
    if (rs.some(r => r.arraysBuilt || r.wardSets)) console.log(`ARRAYS built ${r1(avg(r => r.arraysBuilt))}/run (all wanted by median ${r1(med(r => r.arraysBuiltT && r.arraysBuiltT / 60))} min), shots ${r1(avg(r => r.arrayShots))}/run costing ${r1(avg(r => r.arrayCoin))}g, kills ${r1(avg(r => r.arrayKills))}/run (no coin), share of all damage ${r1(100 * rs.reduce((t, r) => t + r.arrayDmg, 0) / Math.max(1, rs.reduce((t, r) => t + r.arrayDmg + r.advDmg, 0)))}%, silent with an empty treasury ${r1(avg(r => r.arraySilent))} s/run` +
      ` | WARDS set ${r1(avg(r => r.wardSets))}/run, shots ${r1(avg(r => r.wardShots))}, kills ${r1(avg(r => r.wardKills))}`);
  }
  console.log(`CHECKS stuck ${stuck.length}${stuck.length ? ' e.g. ' + stuck.slice(0, 4).join(' | ') : ''}  no-reason ${noWhy.length}${noWhy.length ? ' ' + noWhy.slice(0, 5).join(',') : ''}  ledger errors ${rs.reduce((s, r) => s + r.ledgerErr, 0)}  pot errors ${rs.reduce((s, r) => s + r.potErr, 0)}  horn paid more than answered ${cnt(r => r.hornPays > r.hornAnswers)}  store errors ${rs.reduce((s, r) => s + (r.resErr || 0), 0)}  other ${bad.join(', ') || 'none'}`);
}
