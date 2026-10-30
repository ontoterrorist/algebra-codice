/* Genera docs/revision-matematica.md: cada teorema y demostración con hipótesis, dependencias y la demostración modelo.
   El bloque «Dudas» (entre las marcas) lo escribo a mano y el script lo conserva. Uso: node tools/auditar.js */
const fs = require('fs'), path = require('path');
globalThis.AC = {};
const SRC = path.join(__dirname, '..', 'src'), M = require(path.join(SRC, 'manifest.js'));
[...M.core, ...M.engine, ...M.content].forEach(f => require(path.join(SRC, f)));
const AC = globalThis.AC, reg = AC.reg;
const salida = path.join(__dirname, '..', 'docs', 'revision-matematica.md');
const A = '<!-- DUDAS:INICIO -->', B = '<!-- DUDAS:FIN -->';
let dudas = '\n_(sin dudas registradas)_\n';
if (fs.existsSync(salida)) { const t = fs.readFileSync(salida, 'utf8'); const i = t.indexOf(A), j = t.indexOf(B); if (i >= 0 && j > i) dudas = t.slice(i + A.length, j); }

const out = [];
out.push('# Revisión matemática — Fase 2 (Mundo 1 completo: niveles 1.1 a 1.6 y jefe)', '',
  'Generado por `node tools/auditar.js`. Las pruebas automáticas comprueban la **consistencia** (grafo sin ciclos, orden de referencia válido, solo se citan teoremas previos, los verificadores aceptan la solución de referencia y rechazan las firmas de error). **No certifican que el contenido matemático sea correcto**: eso es lo que te pido revisar aquí.', '',
  'Convenciones: ℕ incluye el 0; las hipótesis son siempre explícitas; en lógica proposicional se asumen las tablas de verdad de ¬, ∧, ∨ y las propiedades base citadas (conmutatividad, doble negación, transitividad de ≡, prueba condicional, división por casos).', '',
  '## Dudas', A, dudas.replace(/^\n?/, '\n'), B, '', '## Base y definiciones citables', '');
Object.values(reg.refs).forEach(r => out.push('- `' + r.id + '` (' + r.tipo + '): ' + r.nombre));
out.push('', '## Teoremas y demostraciones', '');
const items = Object.values(reg.teoremas).map(t => ({ t, d: Object.values(reg.demos).find(x => x.teorema === t.id) }))
  .concat(Object.values(reg.demos).filter(x => !x.teorema).map(d => ({ t: { id: d.enunciadoId, titulo: 'Jefe: ' + d.id.replace('dem.jefe-', ''), nivel: d.nivel, enunciado: '(enunciado de la prueba del jefe; no entra al Códice)', requiere: d.requiere }, d })));
items.forEach(({ t, d }) => {
  out.push('### ' + t.titulo + ' — `' + t.id + '` (nivel ' + t.nivel + ')', '', '**Enunciado.** ' + t.enunciado, '');
  const rng = AC.rng('auditoria|' + t.id), R = AC.demo.resolver(d, rng);
  out.push('**Hipótesis.** ' + d.hipotesis(R.p).join('; '), '', '**Depende de.** ' + (t.requiere.length ? t.requiere.map(r => '`' + r + '`').join(', ') : 'nada previo (solo definiciones y propiedades base)'), '');
  out.push('**Demostración (grafo de dependencias entre líneas).** Cualquier orden que respete las flechas se acepta.', '');
  R.lineas.forEach(l => {
    const lim = l.texto.replace(/⟦(\w+)⟧/g, (m, id) => { const h = l.huecos.find(x => x.id === id); return h ? (h.math === false ? h.correcta : '$' + h.correcta + '$') : ''; });
    out.push('- **' + l.id + '** ← ' + (l.deps.length ? l.deps.join(', ') : '∅') + ' — ' + lim + ' _[' + AC.catalogo.nombreRef(l.just.ref) + ']_');
  });
  out.push('', '**Líneas distractoras (falsas a propósito).**', '');
  R.distractores.forEach(x => out.push('- ' + x.texto + ' — _falla:_ ' + x.falla));
  out.push('', '**Errores para «cazar el error».**', '');
  R.errores.forEach(e => out.push('- Sustituye **' + e.sustituye + '**: ' + e.texto + ' — _diagnóstico:_ ' + (reg.diagnosticos[e.diagnostico] || { texto: e.diagnostico }).texto));
  out.push('', '**Estrategias.**', '');
  d.estrategias.forEach(e => out.push('- ' + (e.valida ? '✓ válida' : '✗ no sirve') + ': ' + e.texto + ' — ' + e.nota));
  out.push('');
});
out.push('## Generadores de aplicación y de práctica de equivalencias', '');
Object.values(reg.generadores).forEach(g => {
  const inst = AC.ejercicio.instanciar({ tipo: 'gen', id: g.id, seed: 'revision' }, { codice: ['t.demorgan-prop', 't.neg-implicacion'] });
  out.push('### `' + g.id + '`', '', '- Familia: ' + g.familia + (g.modo ? ' (' + g.modo + ')' : '') + '; habilidades: ' + g.habilidades.join(', ') + '; requiere: ' + (g.requiere.length ? g.requiere.join(', ') : 'nada') + '.',
    '- Ejemplo de enunciado: ' + inst.enunciado, '- Verificador: `' + inst.verificador.id + '`. Firmas de error de este ejemplo: ' + (inst.firmas.length ? inst.firmas.map(f => '`' + f.id + '`').join(', ') : 'ninguna (el verificador comprueba propiedades)') + '.', '- Explicación: ' + inst.explicacion, '');
});
fs.writeFileSync(salida, out.join('\n') + '\n');
console.log('docs/revision-matematica.md: ' + out.length + ' líneas');
