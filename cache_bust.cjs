const fs = require('fs');
const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));
for (const f of files) {
  let c = fs.readFileSync(f, 'utf8');
  c = c.replace(/href="src\/([^"]+\.css)(\?v=\d+)?"/g, 'href="src/$1?v=' + Date.now() + '"');
  fs.writeFileSync(f, c);
}
console.log('Done!');
