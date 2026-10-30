/* Utilidades de contenido del Mundo 1: fábrica de demostraciones compactas, huecos y respuesta modelo. */
(function (AC) {
  const R = AC.registrar, r = String.raw;
  const H = (id, correcta, opciones, math) => ({ id, correcta, opciones, math: math !== false });
  const DIAG = ['error-de-calculo', 'circular', 'no-justificado', 'caso-faltante', 'conclusion-invalida'];
  const T = s => '$' + s + '$';
  const cap = s => s.charAt(0).toUpperCase() + s.slice(1);

  const modeloDe = lineasFn => p => lineasFn(p).map((l, i) => (i + 1) + '. ' + l.texto.replace(/⟦(\w+)⟧/g, (m, id) => { const h = (l.huecos || []).find(x => x.id === id); return h ? (h.math === false ? h.correcta : '$' + h.correcta + '$') : ''; })).join('\n');

  /* d.L(p) devuelve filas [id, texto, ref | p=>ref, deps, huecos?]; el resto de campos como en R.demostracion pero en forma de listas. */
  function dem(d) {
    const lineas = p => d.L(p).map(([id, texto, ref, deps, huecos]) => ({ id, texto, just: { ref: typeof ref === 'function' ? ref(p) : ref }, deps: deps || [], huecos: huecos || [] }));
    const p0 = d.param(AC.rng('orden|' + d.id));
    R.demostracion({
      id: d.id, teorema: d.teorema || null, enunciadoId: d.enunciadoId || d.teorema || d.id, mundo: d.mundo || 1, nivel: d.nivel,
      habilidades: d.habilidades, requiere: d.requiere || [], refsExtra: d.refsExtra || [],
      parametros: d.param, enunciado: d.enunciado, hipotesis: d.hip, meta: d.meta,
      lineas, orden_referencia: lineas(p0).map(l => l.id),
      distractores: p => d.dist(p).map(([texto, falla]) => ({ texto, falla })),
      errores: p => d.err(p).map(([sustituye, texto, diagnostico, explicacion, ops]) => ({ sustituye, texto, diagnostico, explicacion, opciones: ops || [diagnostico].concat(DIAG.filter(x => x !== diagnostico).slice(0, 3)) })),
      estrategias: d.est.map(([id, texto, valida, nota]) => ({ id, texto, valida, nota })),
      criterios: d.crit, modelo: modeloDe(lineas), pistas: d.pistas,
    });
  }

  /* estrategias de relleno que casi todas las demostraciones comparten */
  const EST_EJEMPLO = ['ejemplo', 'Verificar un ejemplo concreto', false, 'Un ejemplo ilustra, pero no demuestra que valga siempre.'];

  AC.w1c = { R, r, H, T, cap, dem, modeloDe, EST_EJEMPLO, DIAG };
  if (typeof module !== 'undefined') module.exports = AC;
})(globalThis.AC = globalThis.AC || {});
