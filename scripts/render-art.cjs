const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const context = vm.createContext({});
vm.runInContext(fs.readFileSync(path.join(root, 'assets', 'museum-art.js'), 'utf8'), context);
const cover = vm.runInContext('MuseumArt.cover()', context);
fs.writeFileSync(path.join(root, 'assets', 'midnight-museum.svg'), cover + '\n');
console.log('Updated assets/midnight-museum.svg');
