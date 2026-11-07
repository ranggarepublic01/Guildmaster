// Writes mock_bridge.html: index.html with the Playgama Bridge script swapped for a mock that records every call in window.__calls.
//   node tools/make_mock.js        then open http://localhost:8765/mock_bridge.html (tools/serve.js)
// The mock: storage kept in localStorage under 'mockBridge.<key>'; ads play 'loading', 'opened', ('rewarded'), 'closed' over about a second;
// leaderboard type 'in_game' with two fake rows plus the player's; window.__mock.pause(true|false) and window.__mock.audio(true|false)
// fire the platform's pause and audio events. window.__mock.adFail = true makes the next ad fail.
const fs = require('fs'), path = require('path');
const root = path.join(__dirname, '..');
const src = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const tag = /<script async src="https:\/\/bridge\.playgama\.com[^"]*"[^>]*><\/script>/;
if (!tag.test(src)) throw new Error('no Bridge script tag in index.html');
const mock = `<script>
(function () {
  const calls = window.__calls = [], on = {}, adOn = {}, log = (n, a) => calls.push([n].concat(a || []));
  const emit = (h, ev, v) => (h[ev] || []).forEach(f => f(v));
  const ad = (kind, seq) => { const ev = kind + '_state_changed'; if (window.__mock.adFail) { window.__mock.adFail = false; setTimeout(() => emit(adOn, ev, 'failed'), 100); return; } seq.forEach((st, i) => setTimeout(() => emit(adOn, ev, st), 200 + i * 300)); };
  window.__mock = { adFail: false, pause: p => emit(on, 'pause_state_changed', p), audio: a => emit(on, 'audio_state_changed', a) };
  window.bridge = {
    initialize: () => { log('initialize'); return Promise.resolve(); },
    platform: { id: 'mock', language: 'en', isAudioEnabled: true, isPaused: false,
      on: (ev, f) => { log('platform.on', [ev]); (on[ev] = on[ev] || []).push(f); },
      sendMessage: m => { log('sendMessage', [m]); return Promise.resolve(); } },
    storage: {
      get: (keys, parse) => { log('storage.get', [keys, parse]); return Promise.resolve(keys.map(k => localStorage.getItem('mockBridge.' + k))); },
      set: (keys, vals) => { log('storage.set', [keys, vals.map(v => typeof v)]); keys.forEach((k, i) => localStorage.setItem('mockBridge.' + k, vals[i])); return Promise.resolve(); },
      delete: keys => { log('storage.delete', [keys]); keys.forEach(k => localStorage.removeItem('mockBridge.' + k)); return Promise.resolve(); } },
    advertisement: {
      on: (ev, f) => { log('advertisement.on', [ev]); (adOn[ev] = adOn[ev] || []).push(f); },
      showInterstitial: p => { log('showInterstitial', [p]); ad('interstitial', ['loading', 'opened', 'closed']); },
      showRewarded: p => { log('showRewarded', [p]); ad('rewarded', ['loading', 'opened', 'rewarded', 'closed']); } },
    leaderboards: { type: 'in_game',
      setScore: (id, sc) => { log('setScore', [id, sc]); window.__mock.score = sc; return Promise.resolve(true); },
      getEntries: id => { log('getEntries', [id]); return Promise.resolve([{ id: 'a', name: 'Brave Otter', score: 900, rank: 1 }, { id: 'me', name: 'Quiet Fox', score: window.__mock.score || 0, rank: 2 }, { id: 'b', name: 'Sly Heron', score: 120, rank: 3 }]); },
      showNativePopup: id => { log('showNativePopup', [id]); return Promise.resolve(); } },
    player: { id: 'me', name: 'Quiet Fox' }
  };
  window.__pgLoad = 1;
})();
</script>`;
fs.writeFileSync(path.join(root, 'mock_bridge.html'), src.replace(tag, mock));
console.log('wrote mock_bridge.html');
