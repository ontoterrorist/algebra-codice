/* Registro del contenido: habilidades, teoremas, generadores, demostraciones, niveles, mundos, referencias. */
(function (AC) {
  const reg = AC.reg = { habilidades: {}, teoremas: {}, generadores: {}, demos: {}, niveles: {}, mundos: [], refs: {}, bancos: {}, diagnosticos: {} };

  function unico(tabla, x, que) {
    if (!x || !x.id) throw new Error(que + ' sin id');
    if (tabla[x.id]) throw new Error(que + ' duplicado: ' + x.id);
    tabla[x.id] = x; return x;
  }
  const exige = (x, campos, que) => campos.forEach(c => { if (x[c] === undefined) throw new Error(que + ' ' + x.id + ': falta «' + c + '»'); });

  AC.registrar = {
    habilidad(h) { exige(h, ['nombre', 'nivel'], 'habilidad'); return unico(reg.habilidades, h, 'habilidad'); },
    teorema(t) { exige(t, ['titulo', 'nivel', 'enunciado', 'requiere', 'habilidades'], 'teorema'); return unico(reg.teoremas, t, 'teorema'); },
    generador(g) {
      exige(g, ['mundo', 'nivel', 'familia', 'habilidades', 'dificultad', 'generar'], 'generador');
      g.requiere = g.requiere || [];
      return unico(reg.generadores, g, 'generador');
    },
    demostracion(d) {
      exige(d, ['mundo', 'nivel', 'habilidades', 'requiere', 'parametros', 'enunciado', 'hipotesis', 'meta', 'lineas', 'orden_referencia', 'distractores', 'errores', 'estrategias', 'criterios', 'modelo', 'pistas'], 'demostración');
      return unico(reg.demos, d, 'demostración');
    },
    nivel(n) { exige(n, ['mundo', 'titulo', 'leccion', 'habilidades'], 'nivel'); return unico(reg.niveles, n, 'nivel'); },
    mundo(m) { reg.mundos.push(m); return m; },
    ref(r) { return unico(reg.refs, r, 'referencia'); },
    diagnostico(d) { return unico(reg.diagnosticos, d, 'diagnóstico'); },
    banco(id, b) { reg.bancos[id] = b; },
  };

  /* consultas */
  AC.catalogo = {
    delNivel(nivelId) {
      return {
        gens: Object.values(reg.generadores).filter(g => g.nivel === nivelId),
        demos: Object.values(reg.demos).filter(d => d.nivel === nivelId),
      };
    },
    tareasDeHabilidad(h) {
      return {
        gens: Object.values(reg.generadores).filter(g => g.habilidades.includes(h)),
        demos: Object.values(reg.demos).filter(d => d.habilidades.includes(h)),
      };
    },
    nombreRef(id) {
      const r = reg.refs[id];
      if (r) return r.nombre;
      const t = reg.teoremas[id];
      return t ? t.titulo : id;
    },
    tipoRef(id) { return reg.refs[id] ? reg.refs[id].tipo : (reg.teoremas[id] ? 'teorema' : 'otro'); },
    /* teoremas de los que depende (cierre transitivo) */
    cierre(ids) {
      const out = new Set(); const pila = ids.slice();
      while (pila.length) { const t = pila.pop(); if (out.has(t)) continue; out.add(t); ((reg.teoremas[t] || {}).requiere || []).forEach(x => pila.push(x)); }
      return out;
    },
  };

  if (typeof module !== 'undefined') module.exports = AC;
})(globalThis.AC = globalThis.AC || {});
