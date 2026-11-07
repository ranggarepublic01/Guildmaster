// Text snapshot of the simulation: every event, floating text, adventurer thought and every unit's reason, over a scripted
// game in each village, digested into one hash. Two builds that print the same hash show the player the same sim text.
//   node tools/text_snapshot.js index.html [builds/step10.html ...]
// The scripted player uses every lever (bounties, sites, shops, arrays, flags, horn, escorts, goods, recruit classes), so most texts appear.
const fs = require('fs'), vm = require('vm'), crypto = require('crypto');
function load(file) {
  const ctx = { window: {}, location: { search: '?headless=1' }, console, Math, performance: { now: () => 0 } };
  const src0 = fs.readFileSync(file, 'utf8'), a = src0.lastIndexOf('<script>') + 8;
  vm.createContext(ctx); vm.runInContext(src0.slice(a, src0.indexOf('</script>', a)), ctx);
  return ctx.window.GM;
}
function snapshot(file) {
  const h = crypto.createHash('sha1'), seen = new Set(); let lines = 0;
  const put = t => { if (t == null) return; t = String(t); h.update(t + '\n'); lines++; seen.add(t); };
  for (const village of [null, 'ashford', 'elmstead', 'stonecrest', 'fordham']) {
    for (let seed = 1; seed <= 3; seed++) {
      const GM = load(file); if (village) GM.applyVillage(village);
      const S = GM.newSim(seed * 7919), dens = S.lairs.filter(l => l.kind === 'den');
      let ev = 0, done = {};
      const once = (k, f) => { if (!done[k]) { done[k] = true; try { f(); } catch (e) { put('ERR ' + k + ' ' + e.message); } } };
      for (let i = 0; S.t < 720 && !S.won && !S.lost; i++) {
        // the scripted player
        if (S.t > 5) once('cls', () => GM.setRecruitClass && GM.setRecruitClass(S, ['archer', 'healer', 'magician'][seed % 3]));
        if (S.t > 10) once('dens', () => dens.forEach(L => GM.postBounty(S, L.id, 50)));
        if (S.t > 20) once('smith', () => GM.buildShop(S, 'smith'));
        if (S.t > 40) once('quarry', () => GM.buildSite(S, 'quarry1'));
        if (S.t > 60) once('master', () => GM.buildShop(S, 'arrays'));
        if (S.t > 70) once('farsite', () => GM.buildSite(S, 'lumber2'));
        if (S.t > 90) once('cancel', () => { GM.postBounty(S, 'camp', 25); GM.cancelBounty(S, 'camp'); });
        if (S.t > 100) once('flag', () => GM.plantFlag(S, 12, 10, 30, null));
        if (S.t > 120) once('arr1', () => GM.buildArray(S, 'a1'));
        if (S.t > 150 && S.gold >= 100) once('camp', () => GM.postBounty(S, 'camp', 100));
        if (S.t > 160) once('wood', () => GM.setSell && GM.setSell(S, 'wood', true));
        if (S.caravan && S.caravan.state === 'stop') once('esc' + S.caravan.id, () => GM.postEscort(S, 25));
        if (S.waves && S.waves.warn && GM.hornReady(S)) once('horn' + S.waves.warn.n, () => GM.soundHorn(S));
        if (S.t > 300) once('up', () => GM.upgradeShop && GM.upgradeShop(S, 'smith'));
        if (S.t > 330) once('arr2', () => GM.buildArray(S, 'a4'));
        GM.step(S, 1 / 30);
        // what the player can read
        while (ev < S.events.length) put('E ' + S.events[ev++].text);
        while (S.fx.length) put('F ' + S.fx.shift().text);
        if (i % 30 === 0) {
          for (const a of S.adv) { put('A ' + a.state + ' ' + a.why); if (a.thoughts && a.thoughts[0]) put('T ' + a.thoughts[0].text); }
          for (const v of S.vil) put('V ' + v.state + ' ' + v.why);
          for (const m of S.mobs) put('M ' + m.state + ' ' + m.why);
          for (const g of S.guards || []) put('G ' + g.state + ' ' + g.why);
          if (S.caravan) put('C ' + S.caravan.state + ' ' + S.caravan.why);
          for (const st of S.sites) put('S ' + (st.dangerBy || ''));
        }
      }
      put('END ' + village + ' ' + seed + ' ' + S.won + ' ' + S.lost + ' ' + Math.round(S.t));
    }
  }
  return { hash: h.digest('hex'), lines, distinct: seen.size };
}
for (const f of process.argv.slice(2)) { const r = snapshot(f); console.log(`${f}: ${r.hash} (${r.lines} lines, ${r.distinct} distinct texts)`); }
