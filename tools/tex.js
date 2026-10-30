/* Comprueba con KaTeX todo el TeX que el jugador puede ver y que no haya caracteres de control
   (señal de una barra invertida sin duplicar en una cadena de JavaScript). Lo llama tools/test.js. */
const path = require('path');

module.exports = function ({ AC, SRC, CTX, err, chk, titulo }) {
  titulo('TeX y texto visible');
  const katex = require(path.join(SRC, 'vendor', 'katex', 'katex.min.js'));
  const CONTROL = /[\x08\x09\x0b\x0c\x0d]/;
  let n = 0, malos = 0;
  const falla = m => { if (malos++ < 10) err(m); };

  const revisar = (txt, donde) => {
    if (typeof txt !== 'string') return;
    if (CONTROL.test(txt)) return falla(donde + ': carácter de control (¿barra invertida sin duplicar?): ' + JSON.stringify(txt.slice(0, 80)));
    txt.split(/(\$[^$]+\$)/).forEach(p => {
      if (!/^\$[^$]+\$$/.test(p)) return;
      n++;
      try { katex.renderToString(p.slice(1, -1), { throwOnError: true, strict: 'ignore' }); } catch (e) { falla(donde + ': TeX inválido «' + p + '»: ' + e.message.slice(0, 80)); }
    });
    if ((txt.match(/\$/g) || []).length % 2) falla(donde + ': número impar de $ en «' + txt.slice(0, 80) + '»');
  };
  const recorre = (o, donde) => {
    if (typeof o === 'string') revisar(o, donde);
    else if (Array.isArray(o)) o.forEach(x => recorre(x, donde));
    else if (o && typeof o === 'object') Object.keys(o).forEach(k => { if (k !== 'solucionExpr' && k !== 'solucionLogica') recorre(o[k], donde); });
  };

  Object.values(AC.reg.generadores).forEach(g => { for (let s = 0; s < 25; s++) recorre(AC.ejercicio.instanciar({ tipo: 'gen', id: g.id, seed: 'X' + s }, CTX), g.id + '#' + s); });
  Object.values(AC.reg.demos).forEach(d => ['ordenar', 'justificar', 'huecos', 'estrategia', 'cazar-error', 'construccion', 'redactar'].forEach(m => {
    for (let s = 0; s < 4; s++) recorre(AC.ejercicio.instanciar({ tipo: 'dem', id: d.id, modo: m, seed: 'X' + s, escalon: m === 'huecos' ? s % 2 : null }, { codice: [...AC.catalogo.cierre(d.requiere)] }), d.id + ':' + m);
  }));
  Object.values(AC.reg.teoremas).forEach(t => recorre(t.enunciado, t.id));
  Object.values(AC.reg.niveles).forEach(nv => recorre(nv.leccion, 'lección ' + nv.id));
  Object.values(AC.reg.refs).forEach(x => recorre(x.nombre, x.id));
  chk(!malos, malos + ' problemas de TeX o de texto');
  console.log('  ' + n + ' fragmentos de TeX comprobados con KaTeX.');
};
