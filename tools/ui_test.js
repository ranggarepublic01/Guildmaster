// Phone-size tap test in a headless browser (Playwright + Chromium), against tools/serve.js on port 8765.
//   node tools/serve.js . 8765 &        then        node tools/ui_test.js [outDir]
// Taps by real touch at 390×844 and 844×390: a guard, the caravan (sell wood, post an escort), the guild hall
// (sell stone), an adventurer, the bandit camp. Prints what each card showed, draw calls and any page errors,
// and saves a screenshot of each step to outDir (default: the current folder).
// Playwright: in a cloud session it is installed globally (npm root -g); on a PC, `npm i -g playwright` once.
const path = require('path');
let pw; try { pw = require('playwright'); } catch (e) { pw = require(path.join(require('child_process').execSync('npm root -g').toString().trim(), 'playwright')); }
const OUT = process.argv[2] || '.';
(async () => {
  const browser = await pw.chromium.launch();
  for (const [name, w, h] of [['portrait', 390, 844], ['landscape', 844, 390]]) {
    const ctx = await browser.newContext({ viewport: { width: w, height: h }, hasTouch: true, isMobile: true, deviceScaleFactor: 2 });
    const page = await ctx.newPage(); const errs = [];
    page.on('pageerror', e => errs.push('PAGEERROR ' + e.message));
    page.on('console', m => { if (m.type() === 'error' && !/favicon|404/.test(m.text())) errs.push(m.text()); });
    await page.goto('http://localhost:8765/index.html'); await page.waitForFunction(() => window.GM && GM.ready);
    // fast-forward the sim, with a sensible player building the blacksmith
    const ff = (cond, max) => page.evaluate(([c, m]) => { const S = GM.sim(); const f = new Function('S', 'return ' + c); let n = 0; while (!f(S) && n < m * 30) { GM.step(S, 1 / 30); n++; if (S.t > 22 && !S.shops.smith.built) GM.buildShop(S, 'smith'); } S.fx.length = 0; return S.t; }, [cond, max]);
    const tap = async (x, y) => { await page.touchscreen.tap(x, y); await page.waitForTimeout(400); };
    const tapEl = async sel => { const el = await page.$(sel); await el.scrollIntoViewIfNeeded(); await page.waitForTimeout(150); const b = await el.boundingBox(); await tap(b.x + b.width / 2, b.y + b.height / 2); };
    const title = () => page.$eval('#card', e => e.hidden ? 'HIDDEN' : (e.querySelector('h2') || {}).textContent);
    const R = { name };
    // a guard at the hall door
    await page.evaluate(() => { GM.look(0, 3, 22); GM.select(null); }); await page.waitForTimeout(500);
    const gp = await page.evaluate(() => GM.screenOf('guard', GM.sim().guards[0].id)); await tap(gp.x, gp.y);
    R.guard = await title(); await page.screenshot({ path: path.join(OUT, name + '_1_guard.png') });
    // the caravan while it loads: sell wood, post an escort
    await ff("S.caravan && S.caravan.state === 'load' && S.caravan.loadT < 3", 400);
    await page.evaluate(() => { const C = GM.sim().caravan; GM.look(C.x, C.z, 30); GM.select(null); }); await page.waitForTimeout(500);
    const cp = await page.evaluate(() => GM.screenOf('caravan')); await tap(cp.x, cp.y);
    R.caravan = await title();
    await tapEl('#card [data-f="sell_wood"]'); R.sellWood = await page.evaluate(() => GM.sim().sell.wood);
    R.goods = await page.$eval('#card [data-f="goods"]', e => e.textContent);
    await tapEl('#card [data-f="e50"]'); R.escort = await page.evaluate(() => GM.sim().caravan.bounty);
    await page.screenshot({ path: path.join(OUT, name + '_2_caravan.png') });
    // the guild hall card: sell stone from there too
    await page.evaluate(() => { GM.look(0, 0, 30); GM.select(null); }); await page.waitForTimeout(400);
    const hp = await page.evaluate(() => GM.screenOf('hall')); await tap(hp.x, hp.y);
    R.hall = await title(); await tapEl('#card [data-f="sell_stone"]'); R.sellStone = await page.evaluate(() => GM.sim().sell.stone);
    await page.screenshot({ path: path.join(OUT, name + '_3_hall.png') });
    // an adventurer out of the hall
    await page.evaluate(() => GM.select(null));
    const aid = await page.evaluate(() => { const a = GM.sim().adv.find(a => !a.dead && !a.inside); if (a) GM.look(a.x, a.z, 26); return a ? a.id : null; }); await page.waitForTimeout(400);
    if (aid != null) { const ap = await page.evaluate(id => GM.screenOf('adv', id), aid); await tap(ap.x, ap.y); R.adventurer = await title(); }
    // the bandit camp (a bandit standing on it takes the tap first; then open the card directly)
    await page.evaluate(() => { const L = GM.sim().lairs[1]; GM.look(L.x, L.z, 30); GM.select(null); }); await page.waitForTimeout(400);
    const lp = await page.evaluate(() => GM.screenOf('lair', 'camp')); await tap(lp.x, lp.y);
    R.camp = await title(); if (R.camp !== 'Bandit camp') { await page.evaluate(() => GM.select('lair', 'camp')); await page.waitForTimeout(300); R.camp += ' (a bandit took the tap; opened directly: ' + await title() + ')'; }
    await page.screenshot({ path: path.join(OUT, name + '_4_camp.png') });
    R.drawCalls = await page.evaluate(() => GM.drawCalls()); R.errors = errs;
    console.log(JSON.stringify(R)); await ctx.close();
  }
  await browser.close();
})();
