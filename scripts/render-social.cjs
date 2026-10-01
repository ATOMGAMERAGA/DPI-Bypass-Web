// Optional development tool: npm install --no-save sharp, then node scripts/render-social.cjs.
// The generated PNG is committed, so publishing the site needs no image tooling.
const fs = require('node:fs');
const path = require('node:path');
const sharp = require('sharp');
const assets = path.join(__dirname, '../assets/img');
const logo = fs.readFileSync(path.join(assets, 'logo.svg')).toString('base64');
const svg = fs.readFileSync(path.join(assets, 'social.svg'), 'utf8')
  .replace('href="logo.svg"', `href="data:image/svg+xml;base64,${logo}"`);
sharp(Buffer.from(svg)).png().toFile(path.join(assets, 'social.png'))
  .then(info => console.log(`Social preview: ${info.width}×${info.height}, ${info.size} bytes`))
  .catch(error => { console.error(error); process.exitCode = 1; });
