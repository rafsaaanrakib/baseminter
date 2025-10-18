const fs = require('fs');
const path = require('path');

function rmrf(p) {
  if (!fs.existsSync(p)) return;
  const stat = fs.statSync(p);
  if (stat.isDirectory()) {
    fs.readdirSync(p).forEach((f) => rmrf(path.join(p, f)));
    fs.rmdirSync(p);
  } else {
    fs.unlinkSync(p);
  }
}

const root = path.resolve(__dirname, '..');
console.log('Resetting workspace at', root);
const toRemove = [
  path.join(root, 'artifacts'),
  path.join(root, 'cache'),
  path.join(root, 'flattened-BaseToken.sol')
];
for (const p of toRemove) {
  try {
    rmrf(p);
    console.log('Removed', p);
  } catch (e) {
    console.warn('Failed to remove', p, e && e.message);
  }
}
console.log('Reset complete. Run `npx hardhat compile` to rebuild artifacts.');
