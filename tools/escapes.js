/* Detecta barras invertidas sin duplicar en cadenas de JavaScript ('...' o "..."): en LaTeX '\pi' pierde la barra y '\neg' se convierte en salto de línea.
   Las plantillas con r`...` (String.raw) no se revisan: allí la barra es literal. Lo llama tools/test.js. */
const fs = require('fs'), path = require('path');

function archivos(dir, out = []) {
  fs.readdirSync(dir, { withFileTypes: true }).forEach(e => {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) { if (e.name !== 'vendor' && e.name !== 'fonts') archivos(p, out); } else if (e.name.endsWith('.js')) out.push(p);
  });
  return out;
}

/* extrae literales de cadena entre comillas simples o dobles, saltando comentarios, plantillas y expresiones regulares simples */
function literales(src) {
  const out = []; let i = 0, linea = 1;
  const n = src.length;
  while (i < n) {
    const c = src[i];
    if (c === '\n') { linea++; i++; continue; }
    if (c === '/' && src[i + 1] === '/') { while (i < n && src[i] !== '\n') i++; continue; }
    if (c === '/' && src[i + 1] === '*') { i += 2; while (i < n && !(src[i] === '*' && src[i + 1] === '/')) { if (src[i] === '\n') linea++; i++; } i += 2; continue; }
    if (c === '`') { // plantilla: se recorre respetando ${ ... } anidados
      i++; let prof = 0;
      while (i < n) {
        if (src[i] === '\\') { i += 2; continue; }
        if (src[i] === '\n') linea++;
        if (prof === 0 && src[i] === '`') { i++; break; }
        if (src[i] === '$' && src[i + 1] === '{') { prof++; i += 2; continue; }
        if (prof > 0 && src[i] === '}') { prof--; i++; continue; }
        if (prof > 0 && (src[i] === "'" || src[i] === '"')) { const q = src[i]; i++; const ini = i; while (i < n && src[i] !== q) { if (src[i] === '\\') i++; i++; } out.push({ texto: src.slice(ini, i), linea }); i++; continue; }
        i++;
      }
      continue;
    }
    if (c === "'" || c === '"') {
      const q = c; i++; const ini = i, l0 = linea;
      while (i < n && src[i] !== q && src[i] !== '\n') { if (src[i] === '\\') i++; i++; }
      out.push({ texto: src.slice(ini, i), linea: l0 }); i++; continue;
    }
    if (c === '/' && /[=(,:;!&|?{}[\n]\s*$/.test(src.slice(Math.max(0, i - 3), i)) && src[i + 1] !== ' ') { // posible expresión regular
      i++; while (i < n && src[i] !== '/' && src[i] !== '\n') { if (src[i] === '\\') i++; i++; } i++; continue;
    }
    i++;
  }
  return out;
}

module.exports = function ({ SRC, err, chk, titulo }) {
  titulo('Barras invertidas en cadenas de JavaScript');
  let malos = 0, total = 0;
  archivos(SRC).forEach(f => {
    const rel = path.relative(SRC, f);
    literales(fs.readFileSync(f, 'utf8')).forEach(({ texto, linea }) => {
      total++;
      const m = /(^|[^\\])(\\\\)*\\([a-zA-Z])([a-z]+)/.exec(texto);
      if (m && !/^(u|x)/.test(m[3] + m[4])) { if (malos++ < 12) err(rel + ':' + linea + ': posible barra sin duplicar «\\' + m[3] + m[4] + '» en «' + texto.slice(0, 70) + '»'); }
    });
  });
  chk(!malos, malos + ' cadenas con barras invertidas sospechosas');
  console.log('  ' + total + ' cadenas revisadas.');
};
