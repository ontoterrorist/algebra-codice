/* Escribe en docs/diseno.md (Apéndice C) las dependencias entre teoremas de los mundos 3 a 8. Uso: node tools/arbol.js */
const fs = require('fs'), path = require('path');
globalThis.AC = {};
const SRC = path.join(__dirname, '..', 'src'), M = require(path.join(SRC, 'manifest.js'));
[...M.core, ...M.engine, ...M.content].forEach(f => require(path.join(SRC, f)));
const lineas = Object.values(AC.reg.teoremas).filter(t => Number(t.nivel[0]) >= 3).map(t => '[' + t.nivel + '] ' + t.id + ' <- ' + t.requiere.join(', '));
const p = path.join(__dirname, '..', 'docs', 'diseno.md');
let s = fs.readFileSync(p, 'utf8');
const a = s.indexOf('<!-- ARBOL:INICIO -->'), b = s.indexOf('<!-- ARBOL:FIN -->');
s = s.slice(0, a) + '<!-- ARBOL:INICIO -->\n```text\n' + lineas.join('\n') + '\n```\n' + s.slice(b);
fs.writeFileSync(p, s);
console.log(lineas.length + ' teoremas de los mundos 3 a 8 escritos en docs/diseno.md');
