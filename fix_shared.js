import fs from 'fs';
const filePath = './src/shared-articles.js';
let content = fs.readFileSync(filePath, 'utf-8');
content = content.replace(/,\\n/g, ',\n');
content = content.replace(/\\n\];\\n/g, '\n];\n');
fs.writeFileSync(filePath, content, 'utf-8');
console.log('Fixed syntax error in shared-articles.js');
