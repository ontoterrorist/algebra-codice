/* Planificador: función pura (estado, contexto) → próxima tarea. Respeta `requiere`, evita variantes recientes
   y garantiza al menos un 30 % de demostraciones en cada nivel. */
(function (AC) {
  const reg = AC.reg;
  const MODOS_VARIEDAD = ['ordenar', 'justificar', 'cazar-error', 'estrategia'];

  const cumple = (est, req) => AC.codice.cumple(est, req);
  function disponibles(est, nivelId) {
    const c = AC.catalogo.delNivel(nivelId);
    return { gens: c.gens.filter(g => cumple(est, g.requiere)), demos: c.demos.filter(d => cumple(est, d.requiere)) };
  }
  const esGuiada = nivelId => { const [m, n] = nivelId.split('.').map(Number); return m === 1 && n < 4; }; // construcción abierta desde 1.4
  const tareaGen = (g, seed) => ({ tipo: 'gen', id: g.id, seed });
  const tareaDem = (d, modo, seed, escalon) => ({ tipo: 'dem', id: d.id, modo, seed, escalon: escalon == null ? null : escalon, guiada: modo === 'construccion' && esGuiada(d.nivel) });
  function tareaFade(est, d, seed) { // según el escalón del teorema
    const t = est.teoremas[d.teorema];
    const e = t && t.ganado ? t.escalon : 0;
    return tareaDem(d, e >= 2 ? 'construccion' : 'huecos', seed, e);
  }

  function recientes(est) { return new Set(est.intentos.slice(-10).map(a => a.k)); }

  /* busca una semilla cuya variante no se haya visto hace poco */
  function conSemilla(est, mk) {
    const rec = recientes(est);
    let t;
    for (let i = 0; i < 8; i++) {
      est.contador++;
      t = mk(est.semillaBase + '-' + est.contador);
      try { const inst = AC.ejercicio.instanciar(t, { codice: AC.codice.ganados(est) }); if (!rec.has(inst.variantKey)) return t; } catch (e) { throw e; }
    }
    return t;
  }

  function tareaVariedad(est, rng, gensProof, demos) {
    const opciones = [];
    gensProof.forEach(g => opciones.push(s => tareaGen(g, s)));
    demos.forEach(d => {
      if (d.teorema && !AC.codice.tiene(est, d.teorema)) return;
      const t = est.teoremas[d.teorema];
      const modos = MODOS_VARIEDAD.concat(t && t.maduro ? ['redactar'] : []);
      modos.forEach(m => opciones.push(s => tareaDem(d, m, s, null)));
    });
    if (!opciones.length) return null;
    const mk = rng.pick(opciones);
    return conSemilla(est, mk);
  }

  function pruebaPendiente(est, demos, rng, gensProof) {
    const conTeorema = demos.filter(d => d.teorema);
    const sinGanar = conTeorema.filter(d => !AC.codice.tiene(est, d.teorema));
    if (sinGanar.length) { const d = sinGanar[0]; return conSemilla(est, s => tareaDem(d, 'huecos', s, 0)); }
    const enCurso = conTeorema.filter(d => !est.teoremas[d.teorema].maduro)
      .sort((a, b) => (est.teoremas[a.teorema].escalon - est.teoremas[b.teorema].escalon) || String(est.teoremas[a.teorema].ultimo).localeCompare(String(est.teoremas[b.teorema].ultimo)));
    if (enCurso.length && rng.chance(0.6)) { const d = enCurso[0]; return conSemilla(est, s => tareaFade(est, d, s)); }
    return tareaVariedad(est, rng, gensProof, demos);
  }

  function habilidadMasDebil(est, nivelId, gens, rng) {
    const hs = reg.niveles[nivelId].habilidades.filter(h => gens.some(g => g.habilidades.includes(h)));
    if (!hs.length) return null;
    const puntaje = h => { const s = est.estadisticas.porHabilidad[h]; return s && s.n ? s.ok / s.n + s.n * 0.002 : -1; };
    const orden = hs.slice().sort((a, b) => puntaje(a) - puntaje(b));
    return rng.pick(orden.slice(0, Math.min(2, orden.length)));
  }

  function tareaParaHabilidad(est, h, rng) {
    const c = AC.catalogo.tareasDeHabilidad(h);
    const gens = c.gens.filter(g => cumple(est, g.requiere));
    const demos = c.demos.filter(d => cumple(est, d.requiere) && (!d.teorema || AC.codice.tiene(est, d.teorema)));
    const opc = [];
    gens.forEach(g => opc.push(s => tareaGen(g, s)));
    demos.forEach(d => MODOS_VARIEDAD.forEach(m => opc.push(s => tareaDem(d, m, s, null))));
    if (!opc.length) return null;
    return conSemilla(est, rng.pick(opc));
  }

  AC.planificador = {
    disponibles, tareaParaHabilidad,
    siguiente(est, ctx) {
      const nivel = ctx.nivel, rng = AC.rng('plan|' + est.semillaBase + '|' + est.contador + '|' + nivel);
      const { gens, demos } = disponibles(est, nivel);
      const gensApp = gens.filter(g => g.familia === 'aplicacion'), gensProof = gens.filter(g => g.familia === 'demostracion');
      const ult = est.intentos.filter(a => a.n === nivel && a.x !== 'reloj').slice(-10);
      const prop = ult.length ? ult.filter(a => a.fam === 'demostracion').length / ult.length : 0;

      // 1. demostración necesaria para sostener ≥30 %
      if (ult.length >= 2 && prop < 0.36 && (demos.length || gensProof.length)) { const t = pruebaPendiente(est, demos, rng, gensProof); if (t) return t; }
      // 2. repaso de lo vencido, 1 de cada 4
      const hoy = ctx.hoy || AC.fecha.dia();
      const vencidas = reg.niveles[nivel].habilidades.filter(h => AC.leitner.vencida(est.habilidades[h], hoy));
      if (vencidas.length && est.contador % 4 === 0) { const t = tareaParaHabilidad(est, vencidas[0], rng); if (t) return t; }
      // 3. el primer ejercicio de un nivel nuevo con teoremas por ganar: calentar con aplicación; luego prueba cada 3
      // 4. habilidad más débil
      const h = habilidadMasDebil(est, nivel, gensApp, rng);
      if (h) { const cand = gensApp.filter(g => g.habilidades.includes(h)); return conSemilla(est, s => tareaGen(rng.pick(cand), s)); }
      const t = pruebaPendiente(est, demos, rng, gensProof);
      if (t) return t;
      throw new Error('el nivel ' + nivel + ' no tiene tareas disponibles');
    },

    /* sesión de repaso: habilidades vencidas de distintos niveles, intercaladas (máx. 12) */
    sesionRepaso(est, hoy, max) {
      max = max || 12;
      const rng = AC.rng('repaso|' + est.semillaBase + '|' + hoy);
      const vencidas = Object.keys(est.habilidades).filter(h => AC.leitner.vencida(est.habilidades[h], hoy))
        .sort((a, b) => est.habilidades[a].vence.localeCompare(est.habilidades[b].vence));
      const porNivel = {};
      vencidas.forEach(h => { const n = (reg.habilidades[h] || {}).nivel; (porNivel[n] = porNivel[n] || []).push(h); });
      const colas = Object.values(porNivel), orden = [];
      while (orden.length < max && colas.some(c => c.length)) colas.forEach(c => { if (c.length && orden.length < max) orden.push(c.shift()); });
      const tareas = [];
      orden.forEach(h => { const t = tareaParaHabilidad(est, h, rng); if (t) tareas.push(t); });
      // al menos una demostración si hay un teorema vencido: ya entra por las habilidades de demostración
      return tareas;
    },

    /* niveles dominados → contrarreloj sólo con contenido ya dominado */
    nivelesReloj(est) { return Object.keys(reg.niveles).filter(n => est.niveles[n] && est.niveles[n].dominado); },
    siguienteReloj(est, rng) {
      const gens = [];
      AC.planificador.nivelesReloj(est).forEach(n => disponibles(est, n).gens.filter(g => g.familia === 'aplicacion').forEach(g => gens.push(g)));
      if (!gens.length) return null;
      const g = rng.pick(gens);
      return conSemilla(est, s => tareaGen(g, s));
    },
  };
  if (typeof module !== 'undefined') module.exports = AC;
})(globalThis.AC = globalThis.AC || {});
