/* Contraste WCAG AA (4,5:1 texto, 3:1 componentes) de las combinaciones de color del CSS, en ambos temas. */
const fs = require('fs'), path = require('path');
const css = fs.readFileSync(path.join(__dirname, '..', 'src', 'style.css'), 'utf8');

/* variables --nombre: #rrggbb del bloque que empieza con `inicio` */
function tema(inicio) {
  const i = css.indexOf(inicio), f = css.indexOf('}', i);
  const o = {};
  css.slice(i, f).split(';').forEach(par => {
    const m = /--([\w-]+):\s*(#[0-9a-fA-F]{6})/.exec(par);
    if (m) o[m[1]] = m[2];
  });
  return o;
}
const lum = hex => {
  const c = [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16) / 255).map(v => (v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)));
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
};
const ratio = (a, b) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };

const TEXTO = [['ink', 'bg'], ['ink', 'bg2'], ['ink', 'panel'], ['ink', 'panel2'], ['mute', 'bg'], ['mute', 'bg2'], ['mute', 'panel'], ['mute', 'panel2'],
  ['gold-ink', 'bg'], ['gold-ink', 'panel'], ['gold-ink', 'bg2'], ['teal', 'bg'], ['teal', 'panel'], ['teal', 'bg2'], ['ok', 'ok-bg'], ['mal', 'mal-bg'], ['warn', 'warn-bg'],
  ['ok', 'panel'], ['mal', 'panel'], ['warn', 'panel'], ['btn-ink', 'gold'], ['ink', 'ok-bg'], ['ink', 'mal-bg'], ['ink', 'warn-bg']];
const NO_TEXTO = [['gold', 'bg'], ['gold', 'panel'], ['teal', 'panel'], ['ok', 'bg'], ['mal', 'bg'], ['focus', 'bg'], ['focus', 'panel']];

let malos = 0;
[['oscuro', ':root, :root[data-tema="oscuro"]'], ['claro', ':root[data-tema="claro"]']].forEach(([n, ini]) => {
  const t = tema(ini);
  console.log('Tema ' + n);
  TEXTO.forEach(([a, b]) => { const r = ratio(t[a], t[b]); if (r < 4.5) { malos++; console.log('  ✗ texto ' + a + ' sobre ' + b + ': ' + r.toFixed(2)); } });
  NO_TEXTO.forEach(([a, b]) => { const r = ratio(t[a], t[b]); if (r < 3) { malos++; console.log('  ✗ componente ' + a + ' sobre ' + b + ': ' + r.toFixed(2)); } });
  console.log('  ' + (TEXTO.length + NO_TEXTO.length) + ' combinaciones revisadas');
});
console.log(malos ? '✗ ' + malos + ' combinaciones por debajo de AA' : '✓ contraste AA en ambos temas');
process.exit(malos ? 1 : 0);
