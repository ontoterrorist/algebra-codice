/* Une src/ en un único index.html: el juego completo (KaTeX y fuentes incrustados, sin red; funciona desde file://).
   Uso: node build.js */
const fs = require('fs'), path = require('path');
const raiz = __dirname, src = f => fs.readFileSync(path.join(raiz, 'src', f), 'utf8');
const b64 = f => fs.readFileSync(path.join(raiz, 'src', f)).toString('base64');
const M = require('./src/manifest.js');

/* fuentes de la interfaz */
const FUENTES = [['EB Garamond', 'normal', 'fonts/ebgaramond.woff2'], ['EB Garamond', 'italic', 'fonts/ebgaramond-i.woff2'], ['Inter', 'normal', 'fonts/inter.woff2']];
const fontCss = FUENTES.map(([n, est, f]) => `@font-face{font-family:'${n}';font-style:${est};font-weight:400 700;font-display:swap;src:url(data:font/woff2;base64,${b64(f)}) format('woff2');}`).join('\n');

/* KaTeX: el CSS original apunta a fonts/*.woff2 (+woff y ttf); se dejan solo los woff2 presentes, incrustados */
let kcss = src('vendor/katex/katex.min.css');
const dir = path.join(raiz, 'src', 'vendor', 'katex', 'fonts');
kcss = kcss.replace(/@font-face\{[^}]*\}/g, bloque => {
  const m = /url\(fonts\/([^)]+?\.woff2)\)/.exec(bloque);
  if (!m || !fs.existsSync(path.join(dir, m[1]))) return '';
  const fam = /font-family:([^;]+);/.exec(bloque)[1], pes = (/font-weight:([^;}]+)/.exec(bloque) || [0, 'normal'])[1], est = (/font-style:([^;}]+)/.exec(bloque) || [0, 'normal'])[1];
  return `@font-face{font-family:${fam};font-style:${est};font-weight:${pes};src:url(data:font/woff2;base64,${b64('vendor/katex/fonts/' + m[1])}) format('woff2');}`;
});

/* JS del juego: núcleo + motor + contenido + interfaz, en el orden del manifiesto */
const juego = ['core', 'engine', 'content', 'ui'].flatMap(k => M[k]).map(f => `/* ${f} */\n` + src(f)).join('\n');
const katexJs = src('vendor/katex/katex.min.js');
for (const [nombre, texto] of [['juego', juego], ['katex', katexJs]]) if (/<\/script/i.test(texto)) throw new Error('el código de ' + nombre + ' contiene </script y rompería la página');

const html = src('index.template.html')
  .replace('/*CSS*/', () => fontCss + '\n' + kcss + '\n' + src('style.css'))
  .replace('/*KATEXJS*/', () => katexJs)
  .replace('/*JS*/', () => juego);

/* sin red: ninguna referencia http(s) en atributos ni en url() (los espacios de nombres XML y comentarios de licencia no cuentan) */
const sinDatos = html.replace(/data:[^)'"]+/g, '');
const ref = sinDatos.match(/(?:src|href)\s*=\s*["']https?:|url\(\s*["']?https?:/gi);
if (ref) throw new Error('el HTML incrustaría recursos de red: ' + ref.slice(0, 3).join(' | '));

fs.writeFileSync(path.join(raiz, 'index.html'), html);
console.log('index.html: ' + (html.length / 1048576).toFixed(2) + ' MB');
