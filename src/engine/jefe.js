/* Jefes: barra de vida, tres fases (cálculo, estrategia, demostración) y tres corazones. Las pistas restan XP, nunca bloquean.
   Una derrota ofrece un repaso dirigido a lo fallado y se puede reintentar al instante con instancias nuevas. */
(function (AC) {
  const reg = AC.reg;
  const DANO = { calculo: 8, estrategia: 10, demostracion: 22 };
  const NOMBRE_FASE = { calculo: 'Cálculo', estrategia: 'Estrategia', demostracion: 'Demostración' };

  const mundo = id => reg.mundos.find(m => m.id === id);

  AC.jefe = {
    DANO, NOMBRE_FASE,
    /* el jefe se abre con todos los niveles del mundo dominados y todos sus teoremas en el Códice */
    disponible(est, mundoId) {
      const m = mundo(mundoId);
      if (!m || !m.jefe) return { ok: false, falta: { niveles: [], teoremas: [] }, motivo: 'Este mundo todavía no tiene jefe.' };
      const niveles = m.niveles.filter(n => !(est.niveles[n] && est.niveles[n].dominado));
      const teoremas = m.niveles.flatMap(n => reg.niveles[n].teoremas).filter(t => !AC.codice.tiene(est, t));
      return { ok: !niveles.length && !teoremas.length, falta: { niveles, teoremas } };
    },

    nuevo(est, mundoId) {
      const m = mundo(mundoId), rng = AC.rng('jefe|' + est.semillaBase + '|' + mundoId + '|' + ((est.mundos[mundoId] || {}).intentos || 0) + '|' + est.contador);
      const sem = () => { est.contador++; return est.semillaBase + '-j' + est.contador; };
      const cola = [];
      // cálculo: un ejercicio de aplicación por nivel, mezclados
      const porNivel = m.niveles.map(n => AC.planificador.disponibles(est, n).gens.filter(g => g.familia === 'aplicacion'));
      rng.shuffle(porNivel.map((gs, i) => i)).forEach(i => { if (porNivel[i].length) cola.push({ fase: 'calculo', task: { tipo: 'gen', id: rng.pick(porNivel[i]).id, seed: sem() } }); });
      // estrategia: tres elecciones de método con enunciados distintos
      const vistos = new Set();
      for (let i = 0; i < 30 && vistos.size < 3; i++) {
        const t = { tipo: 'gen', id: m.jefe.estrategia, seed: sem() };
        const k = AC.ejercicio.instanciar(t, { codice: AC.codice.ganados(est) }).variantKey;
        if (!vistos.has(k)) { vistos.add(k); cola.push({ fase: 'estrategia', task: t }); }
      }
      // demostración: construcción abierta, exige citar teoremas ganados antes
      const dems = m.jefe.demos.filter(d => AC.codice.cumple(est, reg.demos[d].requiere));
      cola.push({ fase: 'demostracion', task: { tipo: 'dem', id: rng.pick(dems), modo: 'construccion', seed: sem(), escalon: null, guiada: false } });
      return { mundo: mundoId, titulo: m.jefe.titulo, vidaMax: 100, vida: 100, corazones: 3, cola, idx: 0, pistas: 0, fallos: [], resultado: null };
    },

    actual(B) { return B.resultado ? null : B.cola[B.idx] || null; },

    /* ok: acierto del ejercicio actual; pistas: pistas usadas en él */
    resolver(B, ok, pistas, habilidades) {
      const paso = B.cola[B.idx]; if (!paso || B.resultado) return B;
      B.pistas += pistas || 0;
      if (ok) B.vida = Math.max(0, B.vida - DANO[paso.fase]);
      else { B.corazones--; (habilidades || []).forEach(h => { if (!B.fallos.includes(h)) B.fallos.push(h); }); }
      B.idx++;
      if (B.corazones <= 0) B.resultado = 'derrota';
      else if (B.idx >= B.cola.length) { B.resultado = 'victoria'; B.vida = 0; }
      return B;
    },

    /* cinco ejercicios sobre exactamente lo fallado (se completa con las habilidades más débiles del mundo) */
    repasoDirigido(est, B) {
      const m = mundo(B.mundo), rng = AC.rng('dirigido|' + est.semillaBase + '|' + est.contador);
      const habs = B.fallos.slice();
      const resto = m.niveles.flatMap(n => reg.niveles[n].habilidades).filter(h => !habs.includes(h))
        .sort((a, b) => { const f = h => { const s = est.estadisticas.porHabilidad[h]; return s && s.n ? s.ok / s.n : 0; }; return f(a) - f(b); });
      const tareas = [];
      habs.concat(resto).forEach(h => { if (tareas.length < 5) { const t = AC.planificador.tareaParaHabilidad(est, h, rng); if (t) tareas.push(t); } });
      return tareas;
    },

    /* guarda el resultado en el estado del jugador; devuelve los logros nuevos */
    cerrar(est, B, hoy) {
      const e = est.mundos[B.mundo] || (est.mundos[B.mundo] = { jefeDerrotado: false, intentos: 0, sinPistas: false });
      e.intentos++;
      let logros = [];
      if (B.resultado === 'victoria') {
        e.jefeDerrotado = true;
        if (B.pistas === 0) e.sinPistas = true;
        logros = AC.logros.evaluar(est, { jefeSinPistas: B.pistas === 0, contexto: 'jefe' }, hoy);
      }
      return logros;
    },
  };
  if (typeof module !== 'undefined') module.exports = AC;
})(globalThis.AC = globalThis.AC || {});
