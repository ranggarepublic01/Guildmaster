// Writes the game's own code (the last <script> block of index.html: the sim, the view and the UI, without the inlined
// three.js) to game_only.js, small enough to upload to a claude.ai chat (about 290 KB; the whole index.html is about 900 KB).
//   node tools/game_only.js            -> game_only.js
// It is a read-only copy for discussing the code. Changes are made to index.html itself (in Claude Code).
const fs = require('fs');
const src = fs.readFileSync('index.html', 'utf8'), a = src.lastIndexOf('<script>') + 8, b = src.indexOf('</script>', a);
fs.writeFileSync('game_only.js', '// Guildmaster: the game script from index.html (read-only copy, made by tools/game_only.js)\n' + src.slice(a, b));
console.log(`game_only.js: ${(b - a) / 1000 | 0} KB, ${src.slice(a, b).split('\n').length} lines`);
