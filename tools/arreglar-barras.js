/* Duplica las barras invertidas de LaTeX en cadenas JS con comillas simples o dobles que contienen «$» (p. ej. '$2\times2$' → '$2\\times2$').
   Las plantillas r`...` no se tocan. Uso: node tools/arreglar-barras.js [archivo ...]  (por defecto todo src/content) */
const fs = require('fs'), path = require('path');
const BS = '\\';
function arreglar(src) {
  let out = '', i = 0, cambios = 0; const n = src.length;
  while (i < n) {
    const c = src[i];
    if (c === '/' && src[i + 1] === '/') { const j = src.indexOf('\n', i); const e = j < 0 ? n : j; out += src.slice(i, e); i = e; continue; }
    if (c === '/' && src[i + 1] === '*') { const j = src.indexOf('*/', i + 2); const e = j < 0 ? n : j + 2; out += src.slice(i, e); i = e; continue; }
    if (c === '`') { // plantilla: se copia tal cual (con ${...} anidados que pueden contener cadenas)
      let j = i + 1, prof = 0; out += c;
      while (j < n) {
        const d = src[j];
        if (d === BS) { out += d + (src[j + 1] || ''); j += 2; continue; }
        if (prof === 0 && d === '`') { out += d; j++; break; }
        if (d === '$' && src[j + 1] === '{') { prof++; out += '${'; j += 2; continue; }
        if (prof > 0 && d === '}') { prof--; out += d; j++; continue; }
        if (prof > 0 && (d === "'" || d === '"')) { const q = d; let k = j + 1; while (k < n && src[k] !== q) { if (src[k] === BS) k++; k++; } out += src.slice(j, k + 1); j = k + 1; continue; }
        out += d; j++;
      }
      i = j; continue;
    }
    if (c === "'" || c === '"') {
      let k = i + 1; while (k < n && src[k] !== c && src[k] !== '\n') { if (src[k] === BS) k++; k++; }
      let cuerpo = src.slice(i + 1, k);
      if (cuerpo.includes('$')) {
        const nuevo = cuerpo.replace(/(^|[^\\])((?:\\\\)*)\\(?=[a-zA-Z])/g, (m, a, b) => a + b + BS + BS);
        if (nuevo !== cuerpo) { cambios++; cuerpo = nuevo; }
      }
      out += c + cuerpo + c; i = k + 1; continue;
    }
    out += c; i++;
  }
  return { out, cambios };
}
function archivos(dir, acc = []) { fs.readdirSync(dir, { withFileTypes: true }).forEach(e => { const p = path.join(dir, e.name); if (e.isDirectory()) archivos(p, acc); else if (e.name.endsWith('.js')) acc.push(p); }); return acc; }
const lista = process.argv.slice(2).length ? process.argv.slice(2) : archivos(path.join(__dirname, '..', 'src', 'content'));
let total = 0;
lista.forEach(f => { const s = fs.readFileSync(f, 'utf8'), { out, cambios } = arreglar(s); if (cambios) { fs.writeFileSync(f, out); total += cambios; console.log(path.basename(f) + ': ' + cambios); } });
console.log(total + ' cadenas corregidas');
