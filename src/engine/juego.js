/* Fachada del motor de aprendizaje: estado del jugador, registro de intentos y sus efectos. Sin DOM. */
(function (AC) {
  const J = AC.juego = {
    estado: null, aviso: null, reloj: () => new Date(),
    hoy() { return AC.fecha.dia(J.reloj()); },

    iniciar() {
      const r = AC.guardado.cargar(J.hoy());
      J.estado = r.estado; J.aviso = r.error || null;
      return r;
    },
    usar(estado) { J.estado = estado; },
    guardar() { return J.estado ? AC.guardado.guardar(J.estado) : false; },
    codice() { return AC.codice.ganados(J.estado); },

    siguienteSemilla() { J.estado.contador++; return J.estado.semillaBase + '-' + J.estado.contador; },
    instanciar(task) { return AC.ejercicio.instanciar(task, { codice: J.codice() }); },
    corregir(inst, resp) { return AC.ejercicio.corregir(inst, resp); },

    nivelEstado(id) { return J.estado.niveles[id] || (J.estado.niveles[id] = AC.dominio.nuevo()); },

    /* ¿el nivel está abierto? el primero siempre; los demás al dominar el anterior */
    nivelAbierto(id) {
      const lista = Object.keys(AC.reg.niveles);
      const i = lista.indexOf(id);
      if (i <= 0) return i === 0;
      return !!(J.estado.niveles[lista[i - 1]] && J.estado.niveles[lista[i - 1]].dominado);
    },

    /* racha diaria con fichas de gracia: un día cuenta tras una sesión de ≥5 ejercicios */
    _racha(hoy) {
      const r = J.estado.jugador.racha;
      if (r.ultimoDia === hoy) return false;
      if (!r.ultimoDia) r.cuenta = 1;
      else {
        const falto = AC.fecha.diff(r.ultimoDia, hoy) - 1;
        if (falto <= 0) r.cuenta++;
        else if (falto <= r.gracia) { r.gracia -= falto; for (let i = 0; i < falto; i++) r.graciaUsada.push(AC.fecha.suma(r.ultimoDia, i + 1)); r.cuenta++; }
        else r.cuenta = 1;
      }
      if (r.cuenta > 0 && r.cuenta % 7 === 0) r.gracia = Math.min(2, r.gracia + 1);
      r.ultimoDia = hoy;
      return true;
    },

    /* repeticiones recientes de una habilidad ya dominada (rendimientos decrecientes) */
    _repetidas(inst, hoy) {
      const niv = J.estado.niveles[inst.nivel];
      if (!niv || !niv.dominado) return 0;
      const desde = AC.fecha.suma(hoy, -7);
      return J.estado.intentos.filter(a => a.ok && a.d >= desde && a.h.some(h => inst.habilidades.includes(h))).length;
    },

    /* meta: {pistas, ms, confianza (0|1|2|null), contexto, autoexp: {correcta}|null} */
    registrar(inst, res, meta) {
      const est = J.estado, hoy = J.hoy(), ef = { xp: 0, logros: [], subioNivel: false };
      meta = Object.assign({ pistas: 0, ms: 0, confianza: null, contexto: 'practica' }, meta);
      const ok = !!res.ok, falla = !res.ok && !res.parcial;
      const vencidaDias = Math.max(0, ...inst.habilidades.map(h => AC.leitner.vencida(est.habilidades[h], hoy) ? AC.leitner.diasVencida(est.habilidades[h], hoy) : 0));
      const vencida = inst.habilidades.some(h => AC.leitner.vencida(est.habilidades[h], hoy));
      const repetidas = J._repetidas(inst, hoy);

      /* Leitner por habilidad: acierto con ≤2 pistas sube, fallo baja, lo demás no mueve */
      inst.habilidades.forEach(h => {
        const r = ok && meta.pistas <= 2 && !res.autoeval ? 'ok' : falla ? 'fallo' : null;
        est.habilidades[h] = AC.leitner.actualizar(est.habilidades[h], r, hoy);
        const s = est.estadisticas.porHabilidad[h] || (est.estadisticas.porHabilidad[h] = { n: 0, ok: 0 });
        s.n++; if (ok) s.ok++;
      });

      /* ventana de dominio del nivel del ejercicio */
      const niv = J.nivelEstado(inst.nivel);
      const eraDominado = niv.dominado;
      if (AC.dominio.entra(inst, meta.pistas, meta.contexto)) {
        AC.dominio.registrar(niv, { k: inst.variantKey, ok: ok, w: res.autoeval ? 0.5 : 1, dem: inst.familia === 'demostracion', e: inst.enunciadoId || null, ma: res.autoeval ? 1 : 0 });
        if (!niv.dominado && AC.dominio.evaluar(niv).cumple) { niv.dominado = true; ef.dominioNuevo = inst.nivel; }
      }

      /* desvanecimiento por teorema */
      if (inst.tipo === 'dem' && inst.teorema && inst.escalon != null && meta.contexto !== 'reloj') {
        const t = est.teoremas[inst.teorema] || (est.teoremas[inst.teorema] = { escalon: 0, maduro: false, ganado: null, ultimo: null });
        ef.escalonAntes = t.escalon;
        if (ok) {
          if (!t.ganado) { t.ganado = hoy; ef.teoremaGanado = inst.teorema; }
          if (meta.pistas < 3) { t.escalon = Math.min(2, inst.escalon + 1); if (inst.escalon === 2) t.maduro = true; }
        } else if (falla) t.escalon = Math.max(0, inst.escalon - 1);
        t.ultimo = hoy; ef.escalonDespues = t.escalon;
      }

      /* XP */
      if (ok || res.parcial) {
        ef.xp = AC.xp.calcular({ inst, pistas: meta.pistas, vencida, repetidas: eraDominado ? repetidas : 0, parcial: !ok && res.parcial, autoeval: res.autoeval });
        if (meta.contexto === 'diario') ef.xp = Math.round(ef.xp * 1.25);
        if (meta.autoexp && meta.autoexp.correcta) ef.xp += 3;
        est.jugador.xp += ef.xp;
        const n0 = est.jugador.nivel; est.jugador.nivel = AC.xp.nivelDe(est.jugador.xp); ef.subioNivel = est.jugador.nivel > n0;
      }

      /* estadísticas */
      const E = est.estadisticas;
      E.estudioMs[hoy] = (E.estudioMs[hoy] || 0) + Math.min(meta.ms || 0, 300000);
      if (meta.confianza !== null && meta.confianza !== undefined) { E.calibracion[meta.confianza][0]++; if (ok) E.calibracion[meta.confianza][1]++; }
      if (res.firma) E.firmas[res.firma.id] = (E.firmas[res.firma.id] || 0) + 1;
      if (res.errorEncontrado) E.erroresEncontrados++;
      if (meta.autoexp) { E.autoexp[0]++; if (meta.autoexp.correcta) E.autoexp[1]++; }

      /* anillo de intentos */
      est.intentos.push({ d: hoy, t: Date.now(), g: inst.id, k: inst.variantKey, m: inst.modo, ok, p: meta.pistas, ms: Math.min(meta.ms || 0, 300000), c: meta.confianza, f: res.firma ? res.firma.id : null, h: inst.habilidades, n: inst.nivel, e: inst.enunciadoId || null, esc: inst.escalon, x: meta.contexto, fam: inst.familia });
      if (est.intentos.length > 500) est.intentos = est.intentos.slice(-500);

      /* racha */
      if (est.sesion.dia !== hoy) est.sesion = { dia: hoy, n: 0 };
      est.sesion.n++;
      if (est.sesion.n >= 5) ef.rachaNueva = J._racha(hoy);

      /* estrellas y logros */
      Object.keys(AC.reg.niveles).forEach(id => { if (est.niveles[id]) est.niveles[id].estrellas = AC.dominio.estrellas(est, id, hoy); });
      ef.logros = AC.logros.evaluar(est, { ok, vencidaDias, contexto: meta.contexto, teoremaGanado: ef.teoremaGanado, dominioNuevo: ef.dominioNuevo }, hoy);
      J.guardar();
      return ef;
    },

    /* autoexplicación tras un acierto: da un poco de XP, no mueve el dominio */
    autoexplicar(correcta) {
      const est = J.estado, E = est.estadisticas;
      E.autoexp[0]++; if (correcta) { E.autoexp[1]++; est.jugador.xp += 3; est.jugador.nivel = AC.xp.nivelDe(est.jugador.xp); }
      J.guardar();
    },
    cerrarDiario(puntaje) { J.estado.diario[J.hoy()] = { hecho: true, puntaje }; J.guardar(); },
    marcarConvenciones() { J.estado.ajustes.convencionesVistas = true; J.guardar(); },
    exportar() { J.estado.ajustes.ultimoExport = J.hoy(); J.guardar(); return AC.guardado.exportar(J.estado, new Date(J.reloj()).toISOString()); },
    importar(texto) { J.estado = AC.guardado.importar(texto, J.hoy()); J.guardar(); },
    reiniciar() { AC.guardado.reiniciar(); J.estado = AC.guardado.nuevo(J.hoy()); J.guardar(); },
  };
  if (typeof module !== 'undefined') module.exports = AC;
})(globalThis.AC = globalThis.AC || {});
