import fs from 'fs';
const filePath = './src/shared-articles.js';
let content = fs.readFileSync(filePath, 'utf-8');

// Fix Cairo University (broken image)
content = content.replace(/cairo-university-visit\.jpeg/g, 'cairo-university-visit1.jpeg');

// Fix Khairun University (moved out of New directory)
content = content.replace(/2026\/New\/khairun-khalifa-isyaka-rabiu-uinversity-nigeria-vist/g, '2026/khairun-khalifa-isyaka-rabiu-uinversity-nigeria-vist');

// Fix Business Dinner (moved out of New directory)
content = content.replace(/2026\/New\/business dinner indonesia/g, '2026/business dinner indonesia');

// Replace kascote logo with actual video URLs for thumbnails
content = content.replace(/"imageUrl": "kascote logo.png",\n\s+"category": "b2b",\n\s+"author": "KASCOTE Admin",\n\s+"publishedAt": new Date\(\),\n\s+"readTime": 2,\n\s+"likesCount": 110/g,
  `"imageUrl": "KASCOTEN IMAGES/2026/New/kpmi-monthly-b2b-business-matchmaking-indonesia/kpmi-monthly-b2b-business-matchmaking-indonesia.mp4",\n    "category": "b2b",\n    "author": "KASCOTE Admin",\n    "publishedAt": new Date(),\n    "readTime": 2,\n    "likesCount": 110`);

content = content.replace(/"imageUrl": "kascote logo.png",\n\s+"category": "b2b",\n\s+"author": "KASCOTE Admin",\n\s+"publishedAt": new Date\(\),\n\s+"readTime": 2,\n\s+"likesCount": 95/g,
  `"imageUrl": "KASCOTEN IMAGES/2026/New/matchmaking-indonesia/matchmaking-indonesia.mp4",\n    "category": "b2b",\n    "author": "KASCOTE Admin",\n    "publishedAt": new Date(),\n    "readTime": 2,\n    "likesCount": 95`);

content = content.replace(/"imageUrl": "kascote logo.png",\n\s+"category": "visitations",\n\s+"author": "KASCOTE Admin",\n\s+"publishedAt": new Date\(\),\n\s+"readTime": 2,\n\s+"likesCount": 75/g,
  `"imageUrl": "KASCOTEN IMAGES/2026/New/ministry-of-works-and-housing-nigeria-visit-abuja/ministry-of-works-and-housing-nigeria-visit-abuja.mp4",\n    "category": "visitations",\n    "author": "KASCOTE Admin",\n    "publishedAt": new Date(),\n    "readTime": 2,\n    "likesCount": 75`);

content = content.replace(/"imageUrl": "kascote logo.png",\n\s+"category": "events",\n\s+"author": "KASCOTE Admin",\n\s+"publishedAt": new Date\(\),\n\s+"readTime": 1,\n\s+"likesCount": 105/g,
  `"imageUrl": "KASCOTEN IMAGES/2026/business dinner indonesia.mp4",\n    "category": "events",\n    "author": "KASCOTE Admin",\n    "publishedAt": new Date(),\n    "readTime": 1,\n    "likesCount": 105`);

fs.writeFileSync(filePath, content, 'utf-8');
console.log('Fixed shared-articles.js images and videos.');
