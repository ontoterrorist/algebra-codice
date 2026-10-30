/* Incrusta assets/personajes/*.png (PixelLab) como data URIs en src/ui/personajes.js: el juego sigue siendo un único HTML sin red.
   Uso: node tools/imagenes.js */
const fs = require('fs'), path = require('path');
const dir = path.join(__dirname, '..', 'assets', 'personajes');
const o = {};
fs.readdirSync(dir).filter(f => f.endsWith('.png')).sort().forEach(f => { o[f.replace(/\.png$/, '')] = 'data:image/png;base64,' + fs.readFileSync(path.join(dir, f)).toString('base64'); });
const js = '/* Generado por tools/imagenes.js a partir de assets/personajes/*.png (PixelLab). No editar a mano. */\n(function (AC) {\n  AC.personajes = ' + JSON.stringify(o, null, 1) + ';\n})(globalThis.AC = globalThis.AC || {});\n';
fs.writeFileSync(path.join(__dirname, '..', 'src', 'ui', 'personajes.js'), js);
console.log(Object.keys(o).length + ' imágenes, ' + (js.length / 1024).toFixed(0) + ' KB');
