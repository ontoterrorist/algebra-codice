/* Vistas: inicio, mapa/árbol de habilidades, nivel, lección, práctica, repaso, desafío diario, contrarreloj, Códice, panel, ajustes. */
(function (AC) {
  const ui = AC.ui, h = ui.h, J = AC.juego, reg = AC.reg;
  const est = () => J.estado;
  const hash = (r) => { location.hash = r; };
  const enlace = (r, txt, cls) => h('a', { href: '#' + r, class: cls || '' }, txt);
  const barra = (f, etiqueta) => h('div', { class: 'barra', role: 'progressbar', 'aria-valuemin': '0', 'aria-valuemax': '100', 'aria-valuenow': String(Math.round(f * 100)), 'aria-label': etiqueta || 'Progreso' }, h('div', { class: 'relleno', style: { width: Math.round(Math.max(0, Math.min(1, f)) * 100) + '%' } }));
  const estrellas = n => h('span', { class: 'estrellas', role: 'img', 'aria-label': n + ' de 3 estrellas' }, [1, 2, 3].map(i => h('span', { class: i <= n ? 'llena' : 'vacia', 'aria-hidden': 'true' }, i <= n ? '★' : '☆')));
  const nivelDef = id => reg.niveles[id];
  const actualizarCabecera = () => { if (ui.actualizarCabecera) ui.actualizarCabecera(); };
  const FIRMAS = {
    'imp-invertida': 'Leer A→B como B→A', 'imp-como-iff': 'Tratar → como ↔', 'o-exclusivo': 'Usar el «o» exclusivo', 'y-por-o': 'Confundir ∧ con ∨', 'sin-negacion': 'Olvidar una negación',
    'cuenta-las-falsas': 'Contar las filas falsas en vez de las verdaderas', 'demorgan-sin-cambiar': 'De Morgan sin cambiar el conector', 'neg-ambos-lados': 'Negar ambas partes de una implicación',
    'neg-implicacion-como-implicacion': 'Negar A→B como otra implicación', 'elige-reciproca': 'Elegir la recíproca', 'elige-inversa': 'Elegir la inversa', 'elige-contrapositiva': 'Elegir la contrapositiva por error',
    'elige-contradictoria': 'Elegir «A y no B»', 'neg-total': 'Elegir la negación de la fórmula', 'marca-falacia': 'Marcar una falacia como tautología', 'uso-circular': 'Usar circularmente el teorema que se prueba',
  };

  /* ---------- sesiones de ejercicios ---------- */
  function vistaEjercicio(S) {
    // S: {contexto, titulo, total (opcional), siguiente(): task|null, otra(task): task|null, alFinal(resumen): nodo}
    const raiz = h('section', { class: 'sesion' });
    const R = { n: 0, ok: 0, xp: 0, nuevos: [] };
    let t0 = 0;
    function cargar() {
      ui.vaciar(raiz);
      const task = S.actual || (S.actual = S.siguiente());
      if (!task) { raiz.appendChild(S.alFinal(R)); return; }
      pintar(task);
    }
    function pintar(task) {
      let inst;
      try { inst = J.instanciar(task); } catch (e) { raiz.appendChild(h('p', { class: 'error' }, 'No pude crear el ejercicio: ' + e.message)); return; }
      t0 = Date.now(); ui.ultima = inst; // (la prueba de humo en navegador lo lee)
      const pidioConfianza = !S.sinExtras && inst.confianza && AC.hash(inst.seed + '|conf') % 3 === 0;
      let pistas = 0, confianza = null, hecho = false;
      const res = h('div', { class: 'resultado', 'aria-live': 'polite' });
      const bPistas = h('div', { class: 'pistas' });
      const txtPistas = h('div', { class: 'pistas-texto' });
      const botonesPista = [0, 1, 2].map(i => h('button', { type: 'button', class: 'secundario pista', disabled: i > 0, onclick: () => {
        if (hecho || pistas !== i) return;
        pistas++; txtPistas.appendChild(h('div', { class: 'pista-lin dialogo-pista' }, AC.personajes && AC.personajes.companero ? h('img', { class: 'dp-avatar', src: AC.personajes.companero, alt: '', width: 48, height: 48, draggable: 'false' }) : null, h('div', { class: 'dp-texto' }, h('strong', null, 'Pista ' + pistas + ' de 3: '), ui.mate(inst.pistas[i]))));
        botonesPista[i].disabled = true; if (botonesPista[i + 1]) botonesPista[i + 1].disabled = false;
        ui.anunciar('Pista ' + pistas); AC.sonido.tocar('click'); AC.companero.actualizarPistas();
      } }, 'Pista ' + (i + 1) + [' · orientación', ' · idea clave', ' · primer paso'][i]));
      bPistas.append(h('span', { class: 'etq' }, 'Pistas (restan XP, nunca bloquean): '), ...botonesPista);
      AC.companero.enlazarPistas({ dar: () => { if (hecho || pistas > 2) return null; const i = pistas; botonesPista[i].click(); return { n: i + 1, el: txtPistas.lastChild }; }, quedan: () => (hecho ? 0 : 3 - pistas) });
      if (R.n === 0 && S.contexto !== 'jefe') AC.companero.reaccionar('ejercicio');
      const bComprobar = h('button', { type: 'button', class: 'primario', onclick: comprobar }, 'Comprobar');
      const ctl = ui.crearControl(inst, { cambio() { if (hecho) return; bComprobar.disabled = false; } });
      const enunc = h('div', { class: 'enunciado' }, h('p', null, ui.mate(inst.enunciado)));
      if (inst.tipo === 'dem') {
        enunc.appendChild(h('p', { class: 'etq' }, inst.enunciadoCorto));
        enunc.appendChild(h('p', { class: 'etq' }, h('strong', null, 'Hipótesis: '), ...inst.hipotesis.map((x, i) => h('span', null, i ? ' · ' : '', ui.mate(x)))));
        if (inst.modo === 'ordenar' || inst.modo === 'construccion' || inst.modo === 'justificar' || inst.modo === 'huecos') enunc.appendChild(h('p', { class: 'etq' }, h('strong', null, 'Meta: '), ui.mate(inst.meta)));
      }
      const encabezado = h('header', { class: 'cab-ejercicio' },
        h('span', { class: 'chip' }, 'Nivel ' + inst.nivel), h('span', { class: 'chip' }, inst.familia === 'demostracion' ? 'Demostración' : 'Aplicación'),
        inst.modo && inst.modo !== 'app' ? h('span', { class: 'chip' }, { huecos: inst.escalon === 1 ? 'Escalón 2: más huecos' : 'Escalón 1: casi completa', construccion: 'Escalón 3: desde cero', ordenar: 'Ordenar', justificar: 'Justificar', estrategia: 'Estrategia', 'cazar-error': 'Cazar el error', redactar: 'Redactar', 'vf-justificado': 'Verdadero o falso', contraejemplo: 'Contraejemplo' }[inst.modo] || inst.modo) : null,
        S.total ? h('span', { class: 'chip prog' }, 'Ejercicio ' + (R.n + 1) + ' de ' + S.total) : null,
        S.reloj ? h('span', { class: 'chip reloj', id: 'reloj-vivo' }, '') : null);
      const conf = pidioConfianza ? h('fieldset', { class: 'confianza' }, h('legend', null, '¿Qué tan seguro estás de tu respuesta?'),
        [['Baja', 0], ['Media', 1], ['Alta', 2]].map(([t, v]) => h('label', { class: 'opcion corta' }, h('input', { type: 'radio', name: 'conf', onchange: () => { confianza = v; } }), h('span', { class: 'texto-opcion' }, t)))) : null;

      function comprobar() {
        if (hecho) return;
        const resp = ctl.leer();
        if (inst.modo === 'redactar' && ctl.listo && !ctl.listo()) { ui.vaciar(res); res.appendChild(h('p', { class: 'aviso-in' }, 'Primero compara con la respuesta modelo.')); return; }
        const r = J.corregir(inst, resp);
        if (r.incompleta || r.sintaxis) { ui.vaciar(res); res.appendChild(h('p', { class: 'aviso-in' }, h('span', { 'aria-hidden': 'true' }, '! '), r.msg)); ui.anunciar(r.msg); return; }
        if (pidioConfianza && confianza === null) { ui.vaciar(res); res.appendChild(h('p', { class: 'aviso-in' }, 'Antes de comprobar, elige tu nivel de confianza.')); return; }
        hecho = true; bComprobar.disabled = true; AC.companero.soltarPistas();
        const ef = J.registrar(inst, r, { pistas, ms: Date.now() - t0, confianza: pidioConfianza ? confianza : null, contexto: S.contexto });
        R.n++; if (r.ok) R.ok++; R.xp += ef.xp; (ef.logros || []).forEach(l => R.nuevos.push(l));
        ctl.marcar(r); ctl.bloquear();
        if (S.alResultado) S.alResultado(r, ef, pistas, inst);
        resultado(r, ef);
        actualizarCabecera();
      }

      function resultado(r, ef) {
        ui.vaciar(res);
        const tipo = r.ok ? 'ok' : r.parcial ? 'parcial' : 'mal';
        const titulo = r.ok ? 'Correcto' : r.parcial ? 'Casi' : 'Incorrecto';
        AC.sonido.tocar(tipo);
        AC.companero.reaccionar(r.ok ? (pistas ? 'ok-con-pistas' : 'ok-sin-pistas') : r.parcial ? 'parcial' : 'mal');
        const banner = h('div', { class: 'banner ' + tipo, role: 'status' }, h('span', { class: 'ic', 'aria-hidden': 'true' }, r.ok ? '✓' : r.parcial ? '◐' : '✗'), h('strong', null, titulo + '. '), r.msg);
        res.appendChild(banner);
        if (r.firma && r.firma.mensaje) res.appendChild(h('p', { class: 'firma' }, h('strong', null, 'Error típico: '), r.firma.mensaje));
        if (r.final) res.appendChild(h('p', { class: 'ayuda' }, 'Fórmula final: ', ui.tex(AC.logic.tex(AC.logic.parse(r.final)))));
        if (ef.xp) {
          const x = h('span', { class: 'xp-ganado' }, '+' + ef.xp + ' XP');
          res.appendChild(h('p', { class: 'xp-linea' }, x, pistas ? ' (con ' + pistas + ' pista' + (pistas > 1 ? 's' : '') + ')' : ' (sin pistas)'));
          AC.fx.particulas(x, 24);
        }
        if (ef.teoremaGanado) { const t = reg.teoremas[ef.teoremaGanado]; AC.sonido.tocar('teorema'); AC.companero.reaccionar('teorema'); res.appendChild(h('div', { class: 'logro-linea teorema' }, h('strong', null, 'Nuevo teorema en tu Códice: '), t.titulo, ' — ya puedes citarlo en otras demostraciones.')); AC.fx.particulas(banner, 40, ['#d4a847', '#f4e3a1']); }
        if (ef.escalonDespues !== undefined && ef.escalonAntes !== ef.escalonDespues) res.appendChild(h('p', { class: 'ayuda' }, 'Escalón del teorema: ' + (ef.escalonAntes + 1) + ' → ' + (ef.escalonDespues + 1) + ' de 3.'));
        if (ef.dominioNuevo) { AC.sonido.tocar('nivel'); AC.companero.reaccionar('nivel'); res.appendChild(h('div', { class: 'logro-linea nivel' }, h('strong', null, '¡Nivel ' + ef.dominioNuevo + ' dominado! '), 'Se abre el siguiente nivel cuando haya contenido.')); AC.fx.particulas(banner, 60); }
        if (ef.subioNivel) res.appendChild(h('p', { class: 'logro-linea' }, 'Subiste al nivel de jugador ' + est().jugador.nivel + '.'));
        (ef.logros || []).forEach(l => res.appendChild(h('p', { class: 'logro-linea' }, h('span', { 'aria-hidden': 'true' }, '🏅 '), 'Logro: ', AC.logros.DEFS.find(d => d.id === l).nombre)));
        if (ef.rachaNueva) res.appendChild(h('p', { class: 'logro-linea' }, 'Racha: ' + est().jugador.racha.cuenta + ' día' + (est().jugador.racha.cuenta > 1 ? 's' : '') + '.'));
        if (inst.explicacion && inst.modo !== 'redactar' && !r.ok) res.appendChild(h('details', { class: 'solucion', open: true }, h('summary', null, 'Solución'), ui.parrafo(inst.explicacion)));
        else if (inst.explicacion && r.ok && inst.tipo === 'gen') res.appendChild(h('details', { class: 'solucion' }, h('summary', null, 'Ver el razonamiento'), ui.parrafo(inst.explicacion)));
        else if (inst.tipo === 'dem' && inst.modo !== 'redactar') res.appendChild(h('details', { class: 'solucion' }, h('summary', null, 'Ver la demostración modelo'), ui.parrafo(inst.explicacion)));
        // autoexplicación
        if (r.ok && !S.sinExtras && inst.autoexplicacion && AC.hash(inst.seed + '|auto') % 2 === 0 && reg.bancos[inst.autoexplicacion]) {
          const b = reg.bancos[inst.autoexplicacion], orden = AC.rng(inst.seed + '|ae').shuffle(b.opciones);
          const caja = h('fieldset', { class: 'autoexp' }, h('legend', null, 'Autoexplicación: ' + b.pregunta));
          orden.forEach(o => caja.appendChild(h('button', { type: 'button', class: 'opcion-ae', onclick: ev => {
            J.autoexplicar(o.correcta); caja.querySelectorAll('button').forEach(x => { x.disabled = true; });
            ev.currentTarget.classList.add(o.correcta ? 'ok' : 'mal'); caja.appendChild(h('p', { class: o.correcta ? 'ok-txt' : 'mal-txt' }, o.correcta ? '✓ Esa es la razón.' : '✗ No es la mejor explicación; la correcta era: ' + b.opciones.find(x => x.correcta).texto)); actualizarCabecera();
          } }, o.texto)));
          res.appendChild(caja);
        }
        const nav = h('div', { class: 'acciones nav-final' });
        const sig = h('button', { type: 'button', class: 'primario', onclick: () => { S.actual = null; cargar(); window.scrollTo(0, 0); } }, S.total && R.n >= S.total ? 'Ver resumen' : 'Siguiente');
        nav.appendChild(sig);
        if (!r.ok && S.otra) nav.appendChild(h('button', { type: 'button', class: 'secundario', onclick: () => { S.actual = S.otra(task); cargar(); window.scrollTo(0, 0); } }, 'Probar otra variante'));
        nav.appendChild(h('button', { type: 'button', class: 'secundario', onclick: () => { S.actual = null; ui.vaciar(raiz); raiz.appendChild(S.alFinal(R)); } }, S.etiquetaFin || 'Terminar sesión'));
        res.appendChild(nav);
        setTimeout(() => sig.focus(), 50);
      }

      ui.anadir(raiz, [encabezado, enunc, h('div', { class: 'control' }, ctl.el), bPistas, txtPistas, conf, h('div', { class: 'acciones' }, bComprobar), res]);
      bComprobar.disabled = true;
      if (ctl.foco) ctl.foco();
    }
    cargar();
    return raiz;
  }

  ui.vistaEjercicio = vistaEjercicio;

  function resumenSesion(titulo, volver) {
    return R => h('div', { class: 'tarjeta resumen' }, h('h2', null, titulo),
      h('p', null, R.n ? 'Hiciste ' + R.n + ' ejercicio' + (R.n > 1 ? 's' : '') + ' y acertaste ' + R.ok + ' (' + Math.round(100 * R.ok / R.n) + ' %). Ganaste ' + R.xp + ' XP.' : 'No hiciste ejercicios en esta sesión.'),
      R.nuevos.length ? h('ul', null, R.nuevos.map(l => h('li', null, '🏅 ' + AC.logros.DEFS.find(d => d.id === l).nombre))) : null,
      est().ajustes.ultimoExport === null || AC.fecha.diff(est().ajustes.ultimoExport, J.hoy()) > 7 ? h('p', { class: 'ayuda' }, 'Hace tiempo que no exportas tu progreso. ', enlace('/ajustes', 'Exportar ahora')) : null,
      h('div', { class: 'acciones' }, enlace(volver, 'Seguir', 'boton primario'), enlace('/inicio', 'Inicio', 'boton secundario')));
  }

  /* ---------- vistas ---------- */
  const V = ui.vistas = {};

  V.inicio = function () {
    const e = est(), hoy = J.hoy();
    const venc = Object.keys(e.habilidades).filter(k => AC.leitner.vencida(e.habilidades[k], hoy));
    const p = AC.xp.progreso(e.jugador.xp), racha = e.jugador.racha;
    const diaHecho = e.diario[hoy] && e.diario[hoy].hecho;
    const relojOk = AC.planificador.nivelesReloj(e).length > 0;
    const niveles = Object.keys(reg.niveles);
    const nSeg = niveles.find(n => J.nivelAbierto(n) && !(e.niveles[n] && e.niveles[n].dominado));
    const mJefe = reg.mundos.find(x => x.jefe && x.niveles.length);
    const jefeVencido = mJefe && e.mundos[mJefe.id] && e.mundos[mJefe.id].jefeDerrotado;
    const jefeAbierto = mJefe && AC.jefe.disponible(e, mJefe.id).ok;
    const t = (id, txt, desc, extra) => h('a', { href: '#' + id, class: 'tarjeta enlace-tarjeta' }, h('h3', null, txt), h('p', null, desc), extra || null);
    const mision = () => {
      const jefeListo = mJefe && jefeAbierto && !jefeVencido;
      const txt = jefeListo ? '¡' + mJefe.jefe.titulo + ' te espera! Ya tienes los teoremas que necesitas. Cuando quieras, entra al combate.'
        : nSeg ? 'Tu próxima misión: Nivel ' + nSeg + ' — ' + reg.niveles[nSeg].titulo + '. Si te atascas, tócame y te doy una pista.' : venc.length ? 'Tienes ' + venc.length + ' habilidad' + (venc.length > 1 ? 'es' : '') + ' por repasar. Un repaso rápido y seguimos.' : 'Todo lo disponible está dominado. Prueba el desafío del día.';
      const dest = jefeListo ? '/jefe/' + mJefe.id : nSeg ? '/nivel/' + nSeg : venc.length ? '/repaso' : '/diario';
      const etq = jefeListo ? 'Entrar al combate' : nSeg ? 'Empezar la misión' : venc.length ? 'Repasar' : 'Desafío del día';
      return h('section', { class: 'mision', 'aria-label': 'Misión' }, AC.personajes && AC.personajes.companero ? h('img', { class: 'mision-avatar', src: AC.personajes.companero, alt: '', width: 96, height: 96, draggable: 'false' }) : null,
        h('div', { class: 'dialogo' }, h('span', { class: 'cb-nombre' }, 'Aprendiz'), h('p', null, txt), h('a', { href: '#' + dest, class: 'boton primario' }, etq)));
    };
    return h('div', { class: 'vista' },
      h('h1', null, 'El Códice de Álgebra'),
      h('p', { class: 'lema' }, 'Cada teorema que demuestras entra al Códice y se vuelve una herramienta para demostrar el siguiente.'),
      mision(),
      h('div', { class: 'estado-jugador' },
        h('div', null, h('strong', null, 'Nivel ' + p.nivel), h('span', { class: 'etq' }, ' · ' + e.jugador.xp + ' XP'), barra(p.frac, 'Progreso hacia el nivel ' + (p.nivel + 1))),
        h('div', null, h('span', { 'aria-hidden': 'true' }, '🔥 '), h('strong', null, racha.cuenta + (racha.cuenta === 1 ? ' día' : ' días')), h('span', { class: 'etq' }, ' de racha' + (racha.gracia ? ' · ' + racha.gracia + ' ficha' + (racha.gracia > 1 ? 's' : '') + ' de gracia' : '')))),
      h('div', { class: 'rejilla' },
        nSeg ? t('/nivel/' + nSeg, 'Seguir', 'Nivel ' + nSeg + ' — ' + reg.niveles[nSeg].titulo + '.') : t('/mapa', 'Seguir', 'Todo lo disponible está dominado.'),
        mJefe ? t('/jefe/' + mJefe.id, 'Jefe', jefeVencido ? 'Derrotado: ' + mJefe.jefe.titulo + '.' : jefeAbierto ? mJefe.jefe.titulo + ': ¡listo para el combate!' : mJefe.jefe.titulo + ' (se abre al dominar el mundo).') : null,
        t('/repaso', 'Repaso', venc.length ? venc.length + ' habilidad' + (venc.length > 1 ? 'es' : '') + ' por repasar.' : 'Nada vencido por ahora.', venc.length ? h('span', { class: 'insignia' }, String(venc.length)) : null),
        t('/diario', 'Desafío del día', diaHecho ? 'Hecho hoy (' + e.diario[hoy].puntaje + '/5).' : 'Cinco ejercicios nuevos cada día.'),
        relojOk ? t('/reloj', 'Contrarreloj', 'Con contenido que ya dominas.') : h('div', { class: 'tarjeta desactivada' }, h('h3', null, 'Contrarreloj'), h('p', null, 'Se abre al dominar un nivel.')),
        t('/mapa', 'Mapa y árbol', 'Mundos, niveles y dependencias entre teoremas.'),
        t('/codice', 'Códice', AC.codice.ganados(e).length + ' de ' + Object.keys(reg.teoremas).length + ' teoremas demostrados.'),
        t('/panel', 'Panel', 'Precisión, tiempo, calibración y próximos repasos.')));
  };

  V.nivel = function (id) {
    const def = nivelDef(id), e = est();
    if (!def) {
      const pend = reg.mundos.flatMap(m => m.pendientes.map(p => Object.assign({ mundo: m.id }, p))).find(p => p.id === id);
      return h('div', { class: 'vista' }, h('h1', null, pend ? pend.titulo : 'Nivel ' + id), h('p', { class: 'construccion' }, 'En construcción.'), enlace('/mapa', 'Volver al mapa'));
    }
    const niv = J.nivelEstado(id), ev = AC.dominio.evaluar(niv);
    return h('div', { class: 'vista' },
      h('p', { class: 'migas' }, enlace('/mapa', 'Mapa'), ' › Mundo ' + def.mundo + ' › Nivel ' + id),
      h('h1', null, def.titulo), h('p', { class: 'lema' }, def.tema),
      h('div', { class: 'tarjeta' },
        h('h2', null, 'Dominio'),
        niv.dominado ? h('p', null, 'Nivel dominado. ', estrellas(niv.estrellas || 1)) : h('p', null, 'Para dominar el nivel: al menos 8 aciertos de tus últimos 10 intentos válidos y demostraciones correctas sobre 2 enunciados distintos.'),
        barra(ev.n / AC.dominio.TAM, 'Intentos en la ventana'), h('p', { class: 'etq' }, ev.n + ' de 10 intentos · ' + Math.round(ev.ratio * 100) + ' % de aciertos · ' + ev.enunciados + ' de 2 enunciados con demostración correcta'),
        h('p', { class: 'etq' }, 'Un acierto con las tres pistas no cuenta para el dominio; repetir la misma variante cuenta una vez.')),
      def.teoremas.some(t => !AC.codice.tiene(e, t)) ? h('p', { class: 'firma' }, h('strong', null, 'Te faltan teoremas por demostrar: '), def.teoremas.filter(t => !AC.codice.tiene(e, t)).map((t, i) => h('span', null, i ? ', ' : '', enlace('/demostrar/' + t, reg.teoremas[t].titulo))), '. Los necesitarás para el jefe.') : null,
      h('div', { class: 'acciones' }, enlace('/leccion/' + id, 'Mini-lección', 'boton secundario'), enlace('/practica/' + id, 'Practicar', 'boton primario')),
      h('h2', null, 'Teoremas del nivel'),
      h('ul', { class: 'lista-teoremas' }, def.teoremas.map(t => {
        const d = reg.teoremas[t], st = AC.codice.estado(e, t);
        return h('li', { class: 'tm ' + st }, h('a', { href: '#/codice/' + t }, d.titulo), h('span', { class: 'etiqueta-estado' }, { bloqueado: ' · requiere otros teoremas', disponible: ' · listo para demostrar', 'en-curso': ' · en tu Códice', dominado: ' · dominado' }[st]));
      })));
  };

  V.leccion = function (id) {
    const def = nivelDef(id); if (!def) return V.nivel(id);
    const L = def.leccion, t = reg.teoremas[L.teorema];
    return h('div', { class: 'vista leccion' },
      h('p', { class: 'migas' }, enlace('/nivel/' + id, 'Nivel ' + id), ' › Mini-lección'),
      h('h1', null, def.titulo), ui.parrafo(L.intro),
      h('h2', null, 'Definiciones'), h('dl', null, L.definiciones.flatMap(d => [h('dt', null, d.nombre), h('dd', null, ui.mate(d.tex))])),
      h('h2', null, 'Teorema clave'), h('div', { class: 'tarjeta teorema' }, h('h3', null, t.titulo), h('p', null, ui.mate(t.enunciado)), enlace('/codice/' + t.id, 'Ver en el Códice')),
      h('h2', null, 'Ejemplo resuelto'), h('div', { class: 'tarjeta' }, ui.parrafo(L.ejemplo.enunciado), h('ol', null, L.ejemplo.pasos.map(p => h('li', null, ui.mate(p))))),
      h('div', { class: 'acciones' }, enlace('/practica/' + id, 'Empezar a practicar', 'boton primario')));
  };

  V.practica = function (id) {
    const def = nivelDef(id); if (!def) return V.nivel(id);
    const S = { contexto: 'practica', siguiente: () => AC.planificador.siguiente(est(), { nivel: id, hoy: J.hoy() }),
      otra: t => Object.assign({}, t, { seed: J.siguienteSemilla() }), alFinal: resumenSesion('Sesión de práctica', '/practica/' + id) };
    return h('div', { class: 'vista' }, h('p', { class: 'migas' }, enlace('/nivel/' + id, 'Nivel ' + id), ' › Práctica'), vistaEjercicio(S));
  };

  V.repaso = function () {
    const tareas = AC.planificador.sesionRepaso(est(), J.hoy(), 12);
    if (!tareas.length) return h('div', { class: 'vista' }, h('h1', null, 'Repaso'), h('p', { class: 'lema' }, 'No hay habilidades vencidas. Vuelve cuando se acerquen sus fechas, o sigue practicando.'), enlace('/inicio', 'Volver al inicio', 'boton primario'));
    let i = 0;
    const S = { contexto: 'repaso', total: tareas.length, siguiente: () => tareas[i++] || null, alFinal: resumenSesion('Repaso terminado', '/inicio') };
    return h('div', { class: 'vista' }, h('h1', null, 'Repaso'), h('p', { class: 'lema' }, 'Habilidades vencidas, mezcladas.'), vistaEjercicio(S));
  };

  V.diario = function () {
    const hoy = J.hoy(), d = est().diario[hoy];
    if (d && d.hecho) return h('div', { class: 'vista' }, h('h1', null, 'Desafío del día'), h('p', { class: 'lema' }, 'Ya lo completaste hoy: ' + d.puntaje + ' de 5. Mañana habrá uno nuevo.'), enlace('/inicio', 'Inicio', 'boton primario'));
    const tareas = AC.reto.tareas(est(), hoy); let i = 0;
    const S = { contexto: 'diario', total: tareas.length, siguiente: () => tareas[i++] || null,
      alFinal: R => { J.cerrarDiario(R.ok); return resumenSesion('Desafío del día completado', '/inicio')(R); } };
    return h('div', { class: 'vista' }, h('h1', null, 'Desafío del día'), h('p', { class: 'lema' }, 'Cinco ejercicios, un intento cada uno. La semilla es la fecha de hoy.'), vistaEjercicio(S));
  };

  V.reloj = function () {
    const rng = AC.rng('reloj|' + est().semillaBase + '|' + Date.now());
    if (!AC.planificador.siguienteReloj(est(), AC.rng('x'))) return h('div', { class: 'vista' }, h('h1', null, 'Contrarreloj'), h('p', { class: 'lema' }, 'Se abre al dominar un nivel.'), enlace('/inicio', 'Inicio'));
    const total = 90; let resta = total, fin = false;
    const S = { contexto: 'reloj', reloj: true, siguiente: () => (fin ? null : AC.planificador.siguienteReloj(est(), rng)), alFinal: resumenSesion('Contrarreloj', '/reloj') };
    const vista = h('div', { class: 'vista' }, h('h1', null, 'Contrarreloj'), h('p', { class: 'lema' }, '90 segundos con contenido que ya dominas. No cambia tu dominio.'));
    const sesion = vistaEjercicio(S); vista.appendChild(sesion);
    const iv = setInterval(() => {
      if (!document.body.contains(vista)) { clearInterval(iv); return; }
      resta--; const el = ui.$('#reloj-vivo'); if (el) el.textContent = '⏱ ' + resta + ' s';
      if (resta <= 0) { fin = true; clearInterval(iv); }
    }, 1000);
    return vista;
  };

  /* ---------- jefe ---------- */
  V.jefe = function (id) {
    const mid = Number(id) || 1, m = reg.mundos.find(x => x.id === mid), e = est();
    const vista = h('div', { class: 'vista' });
    if (!m || !m.jefe) { vista.append(h('h1', null, 'Jefe'), h('p', { class: 'construccion' }, 'En construcción.'), enlace('/mapa', 'Volver al mapa')); return vista; }
    vista.append(h('p', { class: 'migas' }, enlace('/mapa', 'Mapa'), ' › Mundo ' + mid + ' › Jefe'), h('div', { class: 'cab-jefe' }, AC.retrato(m.jefe.id, m.jefe.titulo, 'grande'), h('h1', null, m.jefe.titulo)));
    const disp = AC.jefe.disponible(e, mid);
    if (!disp.ok) {
      ui.anadir(vista, [h('p', { class: 'lema' }, 'El jefe se abre cuando dominas todos los niveles del mundo y tienes todos sus teoremas en el Códice: sus pruebas exigen citarlos.'),
        disp.falta.niveles.length ? h('div', { class: 'tarjeta' }, h('h3', null, 'Niveles por dominar'), h('ul', null, disp.falta.niveles.map(n => h('li', null, enlace('/nivel/' + n, 'Nivel ' + n + ' · ' + reg.niveles[n].titulo))))) : null,
        disp.falta.teoremas.length ? h('div', { class: 'tarjeta' }, h('h3', null, 'Teoremas por demostrar'), h('ul', null, disp.falta.teoremas.map(t => h('li', null, enlace('/demostrar/' + t, reg.teoremas[t].titulo))))) : null]);
      return vista;
    }
    const caja = h('div', null); vista.appendChild(caja);
    const ya = e.mundos[mid] && e.mundos[mid].jefeDerrotado;
    function intro() {
      ui.vaciar(caja);
      ui.anadir(caja, [h('p', { class: 'lema' }, ya ? 'Ya lo derrotaste' + (e.mundos[mid].sinPistas ? ' sin pistas' : '') + '. Puedes volver a enfrentarlo cuando quieras.' : 'Un combate de tres fases con todo lo que aprendiste en el Mundo ' + mid + '.'),
        h('div', { class: 'tarjeta' }, h('ul', null,
          h('li', null, h('strong', null, 'Cálculo: '), '6 ejercicios, uno por nivel (8 puntos de daño cada uno).'),
          h('li', null, h('strong', null, 'Estrategia: '), '3 elecciones de método (10 de daño cada una).'),
          h('li', null, h('strong', null, 'Demostración: '), 'una construcción abierta que exige citar teoremas ganados (22 de daño).'),
          h('li', null, 'Tienes ', h('strong', null, '3 corazones'), ': un fallo te quita uno y no hace daño. Las pistas restan XP, nunca bloquean.'),
          h('li', null, 'Si pierdes, practicas lo que fallaste y puedes reintentar al instante con ejercicios nuevos; no se pierde nada.'))),
        h('div', { class: 'acciones' }, h('button', { type: 'button', class: 'primario', onclick: combate }, ya ? 'Enfrentarlo de nuevo' : 'Empezar el combate'))]);
    }
    function combate() {
      ui.vaciar(caja);
      const B = AC.jefe.nuevo(est(), mid); let cerrado = false, logros = [], vidaPrev = 100, corazPrev = 3; AC.companero.reaccionar('jefe-inicio');
      const panel = h('div', { class: 'panel-jefe' });
      function pintar() {
        ui.vaciar(panel); const paso = AC.jefe.actual(B);
        const golpe = B.vida < vidaPrev, perdio = B.corazones < corazPrev; vidaPrev = B.vida; corazPrev = B.corazones;
        ui.anadir(panel, [h('div', { class: 'fila-jefe' }, AC.retrato(m.jefe.id, m.jefe.titulo, (golpe ? 'herido ' : perdio ? 'burla ' : '') + (B.resultado === 'victoria' ? 'vencido' : '')), h('strong', null, m.jefe.titulo), h('span', { class: 'chip' }, paso ? 'Fase: ' + AC.jefe.NOMBRE_FASE[paso.fase] : B.resultado === 'victoria' ? 'Vencido' : 'Derrota')),
          h('div', { class: 'barra vida', role: 'progressbar', 'aria-valuemin': '0', 'aria-valuemax': '100', 'aria-valuenow': String(B.vida), 'aria-label': 'Vida del jefe' }, h('div', { class: 'relleno', style: { width: B.vida + '%' } })),
          h('div', { class: 'fila-jefe' }, h('span', { class: 'etq' }, 'Vida del jefe: ' + B.vida + ' / 100'), h('span', { class: 'corazones', role: 'img', 'aria-label': B.corazones + ' de 3 corazones' }, [0, 1, 2].map(i => h('span', { class: i < B.corazones ? 'corazon' : 'corazon perdido', 'aria-hidden': 'true' }, i < B.corazones ? '♥' : '♡'))))]);
      }
      function repasoDirigido() {
        const tareas = AC.jefe.repasoDirigido(est(), B); let i = 0;
        ui.vaciar(caja);
        ui.anadir(caja, [h('h2', null, 'Repaso dirigido'), h('p', { class: 'lema' }, 'Ejercicios sobre lo que falló en el combate.'), ui.vistaEjercicio({ contexto: 'repaso', total: tareas.length, siguiente: () => tareas[i++] || null,
          alFinal: R => h('div', { class: 'tarjeta resumen' }, h('h2', null, 'Repaso terminado'), h('p', null, 'Acertaste ' + R.ok + ' de ' + R.n + '. ¿Listo para otra vuelta?'), h('div', { class: 'acciones' }, h('button', { type: 'button', class: 'primario', onclick: combate }, 'Reintentar al jefe'), enlace('/mapa', 'Mapa', 'boton secundario'))) })]);
      }
      function final() {
        if (!cerrado && B.resultado) { cerrado = true; logros = AC.jefe.cerrar(est(), B, J.hoy()); J.guardar(); actualizarCabecera(); }
        pintar();
        const nombres = B.fallos.map(hid => (reg.habilidades[hid] || { nombre: hid }).nombre);
        if (B.resultado === 'victoria') { AC.sonido.tocar('nivel'); AC.fx.particulas(panel, 70); AC.companero.reaccionar('victoria'); } else if (B.resultado === 'derrota') AC.companero.reaccionar('derrota');
        return h('div', { class: 'tarjeta resumen' },
          B.resultado === 'victoria' ? h('div', null, h('h2', null, '¡Derrotaste a ' + m.jefe.titulo + '!'), h('p', null, 'Terminaste con ' + B.corazones + ' de 3 corazones' + (B.pistas === 0 ? ', sin usar pistas.' : ' y ' + B.pistas + ' pista' + (B.pistas > 1 ? 's' : '') + '.')), (logros || []).map(l => h('p', { class: 'logro-linea' }, '🏅 ', AC.logros.DEFS.find(d => d.id === l).nombre)))
            : B.resultado === 'derrota' ? h('div', null, h('h2', null, m.jefe.titulo + ' resiste'), h('p', null, 'Perdiste los tres corazones. Quedaban ' + B.vida + ' puntos de vida; nada se pierde.'), nombres.length ? h('p', null, 'Lo que falló: ', nombres.join(', '), '.') : null)
              : h('div', null, h('h2', null, 'Combate interrumpido'), h('p', null, 'Puedes empezar otro cuando quieras.')),
          h('div', { class: 'acciones' }, B.resultado === 'derrota' ? h('button', { type: 'button', class: 'primario', onclick: repasoDirigido }, 'Repaso dirigido') : null,
            h('button', { type: 'button', class: B.resultado === 'derrota' ? 'secundario' : 'primario', onclick: combate }, B.resultado === 'victoria' ? 'Enfrentarlo de nuevo' : 'Reintentar ahora'), enlace('/mapa', 'Mapa', 'boton secundario')));
      }
      pintar();
      ui.anadir(caja, [panel, vistaEjercicio({ contexto: 'jefe', sinExtras: true, etiquetaFin: 'Abandonar el combate', total: B.cola.length,
        siguiente: () => { const p = AC.jefe.actual(B); return p ? p.task : null; },
        alResultado: (r, ef, pistas, inst) => { AC.jefe.resolver(B, !!r.ok, pistas, inst.habilidades); pintar(); },
        alFinal: () => final() })]);
    }
    intro();
    return vista;
  };

  /* ---------- Códice ---------- */
  V.codice = function (foco) {
    const e = est(), ganados = AC.codice.ganados(e);
    const tarjetas = Object.values(reg.teoremas).map(t => {
      const st = AC.codice.estado(e, t.id), x = e.teoremas[t.id], mad = AC.codice.madurez(e, t.id);
      const dem = Object.values(reg.demos).find(d => d.teorema === t.id);
      const modelo = dem ? dem.modelo(dem.parametros(AC.rng('codice|' + t.id))) : '';
      const cuerpo = [
        h('p', null, ui.mate(t.enunciado)),
        h('p', { class: 'etq' }, 'Nivel ' + t.nivel + ' · depende de: ', t.requiere.length ? t.requiere.map((r, i) => h('span', null, i ? ', ' : '', h('a', { href: '#/codice/' + r }, reg.teoremas[r].titulo))) : 'nada previo'),
      ];
      if (st === 'bloqueado' || st === 'disponible') cuerpo.push(h('p', { class: 'etq' }, 'Todavía no está demostrado: no puedes citarlo en otras demostraciones.'));
      if (st !== 'bloqueado') cuerpo.push(h('div', { class: 'acciones' }, enlace('/demostrar/' + t.id, ganados.includes(t.id) ? 'Practicar su demostración' : 'Demostrarlo', 'boton ' + (ganados.includes(t.id) ? 'secundario' : 'primario'))));
      else cuerpo.push(h('p', { class: 'etq' }, 'Primero demuestra: ' + t.requiere.filter(r => !AC.codice.tiene(e, r)).map(r => reg.teoremas[r].titulo).join(', ') + '.'));
      if (ganados.includes(t.id)) cuerpo.push(h('details', { class: 'solucion' }, h('summary', null, 'Demostración modelo'), ui.parrafo(modelo)));
      return h('article', { class: 'tarjeta tm-card ' + st, id: 'tm-' + t.id.replace(/\./g, '-'), tabindex: '-1' },
        h('h3', null, ganados.includes(t.id) ? '✓ ' : '', t.titulo, ' ', h('span', { class: 'madurez', role: 'img', 'aria-label': 'Maduración ' + mad + ' de 3' }, [1, 2, 3].map(i => h('span', { class: i <= mad ? 'punto lleno' : 'punto', 'aria-hidden': 'true' }))), h('span', { class: 'etiqueta-estado' }, { bloqueado: ' bloqueado', disponible: ' disponible', 'en-curso': ' en tu Códice', dominado: ' dominado' }[st])),
        cuerpo, x && x.ganado ? h('p', { class: 'etq' }, 'Ganado el ' + x.ganado) : null);
    });
    const vista = h('div', { class: 'vista' }, h('h1', null, 'El Códice'),
      h('p', { class: 'lema' }, ganados.length + ' de ' + Object.keys(reg.teoremas).length + ' teoremas demostrados. Solo puedes citar los que ya están aquí.'),
      h('h2', null, 'Base y convenciones'),
      h('div', { class: 'tarjeta' }, h('ul', null,
        h('li', null, ui.mate('$\\mathbb{N}$ incluye el 0.')), h('li', null, 'Las hipótesis siempre son explícitas.'), h('li', null, 'Se acepta coma o punto decimal.'),
        h('li', null, 'Se asumen sin demostrar las propiedades de la lógica listadas en cada justificación («conmutatividad», «doble negación»…) y las definiciones de los conectivos.'))),
      h('h2', null, 'Teoremas'), tarjetas);
    if (foco) setTimeout(() => { const el = document.getElementById('tm-' + foco.replace(/\./g, '-')); if (el) { el.scrollIntoView({ block: 'center' }); el.focus(); AC.fx.iluminar(el); } }, 60);
    return vista;
  };

  V.demostrar = function (tid) {
    const dem = Object.values(reg.demos).find(d => d.teorema === tid), e = est();
    if (!dem || !AC.codice.cumple(e, dem.requiere)) return h('div', { class: 'vista' }, h('h1', null, 'Aún no'), h('p', null, 'Primero demuestra los teoremas de los que depende.'), enlace('/codice/' + tid, 'Volver al Códice'));
    const mk = seed => {
      const t = e.teoremas[tid], esc = t && t.ganado ? t.escalon : 0;
      return { tipo: 'dem', id: dem.id, modo: esc >= 2 ? 'construccion' : 'huecos', seed, escalon: esc, guiada: true };
    };
    const S = { contexto: 'practica', siguiente: () => mk(J.siguienteSemilla()), otra: () => mk(J.siguienteSemilla()), alFinal: resumenSesion('Sesión de demostración', '/codice/' + tid) };
    return h('div', { class: 'vista' }, h('p', { class: 'migas' }, enlace('/codice/' + tid, 'Códice'), ' › ' + reg.teoremas[tid].titulo), vistaEjercicio(S));
  };

  /* ---------- mapa y árbol de habilidades ---------- */
  V.mapa = function () {
    const e = est();
    const niveles = Object.values(reg.niveles);
    const W = 232, Hn = 58, GX = 80, GY = 22, X0 = 16, Y0 = 44;
    const pos = {}, cols = []; let maxFilas = 0, xBase = X0;
    niveles.forEach(n => {
      const prof = {};
      const d = t => prof[t] !== undefined ? prof[t] : (prof[t] = Math.max(-1, ...reg.teoremas[t].requiere.filter(r => n.teoremas.includes(r)).map(d)) + 1);
      const maxD = Math.max(0, ...n.teoremas.map(d)), filasPorD = {};
      n.teoremas.forEach(t => { const k = d(t), r = filasPorD[k] = (filasPorD[k] === undefined ? 0 : filasPorD[k] + 1); pos[t] = { x: xBase + k * (W + 56), y: Y0 + r * (Hn + GY) }; maxFilas = Math.max(maxFilas, r + 1); });
      cols.push({ x: xBase, titulo: 'Nivel ' + n.id + ' · ' + n.titulo });
      xBase += (maxD + 1) * (W + 56) + GX - 56;
    });
    const ancho = xBase - GX + X0, alto = Y0 + maxFilas * (Hn + GY);
    const NS = 'http://www.w3.org/2000/svg';
    const s = (tag, a, ...hijos) => { const el = document.createElementNS(NS, tag); Object.keys(a || {}).forEach(k => { if (k.startsWith('on')) el.addEventListener(k.slice(2), a[k]); else el.setAttribute(k, a[k]); }); hijos.flat().forEach(x => { if (x !== null && x !== undefined) el.appendChild(typeof x === 'string' ? document.createTextNode(x) : x); }); return el; };
    const svg = s('svg', { viewBox: '0 0 ' + ancho + ' ' + alto, width: ancho, height: alto, class: 'arbol', role: 'group', 'aria-label': 'Árbol de habilidades: teoremas y sus dependencias' });
    cols.forEach(c => svg.appendChild(s('text', { x: c.x, y: 28, class: 'arbol-titulo' }, c.titulo)));
    Object.values(reg.teoremas).forEach(t => t.requiere.forEach(r => {
      if (!pos[t.id] || !pos[r]) return;
      const a = pos[r], b = pos[t.id], mismo = a.x === b.x;
      const d = mismo ? 'M' + (a.x + W / 2) + ',' + (a.y + Hn) + ' C' + (a.x + W / 2) + ',' + (a.y + Hn + 16) + ' ' + (b.x + W / 2) + ',' + (b.y - 16) + ' ' + (b.x + W / 2) + ',' + b.y
        : 'M' + (a.x + W) + ',' + (a.y + Hn / 2) + ' C' + (a.x + W + 40) + ',' + (a.y + Hn / 2) + ' ' + (b.x - 40) + ',' + (b.y + Hn / 2) + ' ' + b.x + ',' + (b.y + Hn / 2);
      svg.appendChild(s('path', { d, class: 'arista' + (AC.codice.tiene(e, r) ? ' viva' : '') + (reg.teoremas[r].nivel !== t.nivel ? ' cruza' : '') }));
    }));
    Object.values(reg.teoremas).forEach(t => {
      const p = pos[t.id], st = AC.codice.estado(e, t.id), mad = AC.codice.madurez(e, t.id);
      const g = s('g', { class: 'nodo ' + st, tabindex: '0', role: 'link', 'aria-label': t.titulo + ': ' + ({ bloqueado: 'bloqueado', disponible: 'disponible', 'en-curso': 'en tu Códice', dominado: 'dominado' }[st]), onclick: () => hash('/codice/' + t.id), onkeydown: ev => { if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); hash('/codice/' + t.id); } } },
        s('rect', { x: p.x, y: p.y, width: W, height: Hn, rx: 10 }),
        s('text', { x: p.x + 12, y: p.y + 24, class: 'nodo-titulo' }, t.titulo),
        s('text', { x: p.x + 12, y: p.y + 46, class: 'nodo-estado' }, { bloqueado: '🔒 bloqueado', disponible: 'disponible', 'en-curso': '✓ en el Códice', dominado: '★ dominado' }[st]),
        [1, 2, 3].map(i => s('circle', { cx: p.x + W - 56 + i * 14, cy: p.y + 44, r: 4, class: i <= mad ? 'pto lleno' : 'pto' })));
      svg.appendChild(g);
    });
    const pend = reg.mundos.flatMap(m => m.pendientes.map(p => 'Nivel ' + p.id + ' · ' + p.titulo));
    return h('div', { class: 'vista' }, h('h1', null, 'Mapa'),
      h('p', { class: 'lema' }, 'Un teorema se ilumina cuando lo demuestras; solo se abre si ya tienes los que necesita.'),
      h('div', { class: 'arbol-caja', tabindex: '0', 'aria-label': 'Árbol de habilidades (se desplaza)' }, svg),
      h('div', { class: 'leyenda' }, [['bloqueado', 'Bloqueado'], ['disponible', 'Disponible'], ['en-curso', 'En tu Códice'], ['dominado', 'Dominado']].map(([c, t]) => h('span', { class: 'ley-item' }, h('span', { class: 'ley-muestra ' + c, 'aria-hidden': 'true' }), t))),
      h('h2', null, 'Mundos'),
      h('div', { class: 'rejilla' }, reg.mundos.map(m => {
        const activo = m.niveles.length > 0;
        return h('div', { class: 'tarjeta ' + (activo ? '' : 'desactivada') }, h('h3', null, m.id + '. ' + m.titulo), h('p', null, m.resumen),
          activo ? h('div', null, m.niveles.map(n => h('p', null, enlace('/nivel/' + n, 'Nivel ' + n + ' · ' + nivelDef(n).titulo), ' ', estrellas((est().niveles[n] || {}).estrellas || 0))), m.jefe ? h('p', { class: 'jefe-mapa' }, AC.retrato(m.jefe.id, m.jefe.titulo, 'mini'), enlace('/jefe/' + m.id, 'Jefe · ' + m.jefe.titulo), ' ', (est().mundos[m.id] || {}).jefeDerrotado ? '✓ derrotado' : '') : null, m.pendientes.length ? h('p', { class: 'etq' }, 'En construcción: ' + m.pendientes.map(p => p.id).join(', ') + '.') : null) : h('p', { class: 'construccion' }, 'En construcción'));
      })));
  };

  /* ---------- panel ---------- */
  V.panel = function () {
    const e = est(), hoy = J.hoy(), E = e.estadisticas;
    const habs = Object.values(reg.habilidades);
    const filas = habs.map(hb => { const s = E.porHabilidad[hb.id] || { n: 0, ok: 0 }, st = e.habilidades[hb.id]; const vig = AC.leitner.vigencia(st, hoy);
      return h('li', { class: 'fila-hab' }, h('span', { class: 'nombre-hab' }, hb.nombre), s.n ? barra(s.ok / s.n, 'Precisión en ' + hb.nombre) : h('span', { class: 'etq' }, 'sin datos'), h('span', { class: 'pct' }, s.n ? Math.round(100 * s.ok / s.n) + ' % (' + s.n + ')' : ''), st ? h('span', { class: 'vig' + (vig < 1 ? ' baja' : ''), title: 'Vigencia' }, vig >= 1 ? 'al día' : 'vigencia ' + Math.round(vig * 100) + ' %') : null); });
    const debiles = Object.entries(E.firmas).sort((a, b) => b[1] - a[1]).slice(0, 6);
    // últimos 7 días
    const dias = Array.from({ length: 7 }, (_, i) => AC.fecha.suma(hoy, i - 6)), maxMs = Math.max(60000, ...dias.map(d => E.estudioMs[d] || 0));
    const NS = 'http://www.w3.org/2000/svg';
    const barras = document.createElementNS(NS, 'svg'); barras.setAttribute('viewBox', '0 0 280 110'); barras.setAttribute('class', 'grafico'); barras.setAttribute('role', 'img');
    barras.setAttribute('aria-label', 'Minutos de estudio por día, últimos 7 días: ' + dias.map(d => Math.round((E.estudioMs[d] || 0) / 60000) + ' min').join(', '));
    dias.forEach((d, i) => { const v = (E.estudioMs[d] || 0) / maxMs, r = document.createElementNS(NS, 'rect'); r.setAttribute('x', 8 + i * 38); r.setAttribute('width', 28); r.setAttribute('y', 90 - v * 80); r.setAttribute('height', v * 80); r.setAttribute('rx', 4); barras.appendChild(r);
      const t = document.createElementNS(NS, 'text'); t.setAttribute('x', 22 + i * 38); t.setAttribute('y', 106); t.setAttribute('text-anchor', 'middle'); t.textContent = d.slice(8); barras.appendChild(t); });
    const cal = AC.logros.calibracion(e);
    let calNodo;
    if (cal.total < 20) calNodo = h('p', { class: 'etq' }, 'La curva de calibración aparece desde 20 respuestas con confianza (llevas ' + cal.total + ').');
    else {
      const sv = document.createElementNS(NS, 'svg'); sv.setAttribute('viewBox', '0 0 240 160'); sv.setAttribute('class', 'grafico'); sv.setAttribute('role', 'img');
      sv.setAttribute('aria-label', 'Calibración: ' + cal.filas.map((f, i) => ['baja', 'media', 'alta'][i] + ' ' + (f.n ? Math.round(f.acierto * 100) + ' % de acierto' : 'sin datos')).join('; '));
      const P = (c, a) => [30 + c * 90, 140 - a * 120];
      const diag = document.createElementNS(NS, 'polyline'); diag.setAttribute('points', cal.filas.map(f => P(f.conf, f.esperada).join(',')).join(' ')); diag.setAttribute('class', 'ideal'); sv.appendChild(diag);
      const real = cal.filas.filter(f => f.n); const ln = document.createElementNS(NS, 'polyline'); ln.setAttribute('points', real.map(f => P(f.conf, f.acierto).join(',')).join(' ')); ln.setAttribute('class', 'real'); sv.appendChild(ln);
      cal.filas.forEach(f => { if (!f.n) return; const [x, y] = P(f.conf, f.acierto); const c = document.createElementNS(NS, 'circle'); c.setAttribute('cx', x); c.setAttribute('cy', y); c.setAttribute('r', 5); c.setAttribute('class', 'pto-real'); sv.appendChild(c); });
      ['Baja', 'Media', 'Alta'].forEach((t, i) => { const tx = document.createElementNS(NS, 'text'); tx.setAttribute('x', 30 + i * 90); tx.setAttribute('y', 157); tx.setAttribute('text-anchor', 'middle'); tx.textContent = t; sv.appendChild(tx); });
      calNodo = h('div', null, sv, h('p', { class: 'etq' }, 'Línea punteada: lo esperado para cada confianza. Error medio: ' + Math.round(cal.error * 100) + ' puntos' + (cal.total >= 50 ? '.' : ' (con 50 respuestas se evalúa el logro de calibración).')));
    }
    const prox = habs.filter(hb => e.habilidades[hb.id]).sort((a, b) => e.habilidades[a.id].vence.localeCompare(e.habilidades[b.id].vence)).filter(hb => AC.fecha.diff(hoy, e.habilidades[hb.id].vence) <= 14);
    return h('div', { class: 'vista' }, h('h1', null, 'Panel'),
      h('div', { class: 'rejilla-2' },
        h('div', { class: 'tarjeta' }, h('h2', null, 'Precisión por habilidad'), h('ul', { class: 'lista-hab' }, filas)),
        h('div', { class: 'tarjeta' }, h('h2', null, 'Conceptos débiles'), debiles.length ? h('ul', null, debiles.map(([k, n]) => h('li', null, (FIRMAS[k] || k) + ' — ' + n + (n > 1 ? ' veces' : ' vez')))) : h('p', { class: 'etq' }, 'Aún no hay errores tipificados.')),
        h('div', { class: 'tarjeta' }, h('h2', null, 'Tiempo de estudio'), barras, h('p', { class: 'etq' }, 'Minutos por día (últimos 7 días). Total hoy: ' + Math.round((E.estudioMs[hoy] || 0) / 60000) + ' min.')),
        h('div', { class: 'tarjeta' }, h('h2', null, 'Calibración'), calNodo),
        h('div', { class: 'tarjeta' }, h('h2', null, 'Próximos repasos (14 días)'), prox.length ? h('ul', null, prox.map(hb => { const d = AC.fecha.diff(hoy, e.habilidades[hb.id].vence); return h('li', null, hb.nombre + ' — ' + (d <= 0 ? 'hoy o vencida' : 'en ' + d + (d === 1 ? ' día' : ' días'))); })) : h('p', { class: 'etq' }, 'Nada por ahora.')),
        h('div', { class: 'tarjeta' }, h('h2', null, 'Logros'), h('ul', { class: 'logros' }, AC.logros.DEFS.map(d => h('li', { class: e.logros[d.id] ? 'ganado' : '' }, h('strong', null, (e.logros[d.id] ? '🏅 ' : '○ ') + d.nombre), h('span', { class: 'etq' }, ' — ' + d.desc + (e.logros[d.id] ? ' (' + e.logros[d.id] + ')' : ''))))))));
  };

  /* ---------- ajustes ---------- */
  V.ajustes = function () {
    const e = est(), a = e.ajustes;
    const guardar = () => { J.guardar(); AC.ui.aplicarAjustes(); };
    const radio = (v, t) => h('label', { class: 'opcion corta' }, h('input', { type: 'radio', name: 'tema', checked: a.tema === v, onchange: () => { a.tema = v; guardar(); } }), h('span', { class: 'texto-opcion' }, t));
    const msg = h('p', { class: 'resultado', 'aria-live': 'polite' });
    const entrada = h('input', { type: 'file', accept: '.json,application/json', class: 'sr', id: 'archivo-import', onchange: ev => {
      const f = ev.target.files[0]; if (!f) return;
      const rd = new FileReader();
      rd.onload = () => {
        let nuevo; try { nuevo = AC.guardado.importar(String(rd.result), J.hoy()); } catch (x) { msg.textContent = '✗ ' + x.message; return; }
        if (!confirm('Importar reemplazará tu progreso actual (' + e.jugador.xp + ' XP, ' + AC.codice.ganados(e).length + ' teoremas) por el del archivo (' + nuevo.jugador.xp + ' XP, ' + AC.codice.ganados(nuevo).length + ' teoremas). ¿Continuar?')) return;
        J.usar(nuevo); J.guardar(); AC.ui.aplicarAjustes(); msg.textContent = '✓ Progreso importado.'; setTimeout(() => hash('/inicio'), 700);
      };
      rd.readAsText(f);
    } });
    return h('div', { class: 'vista' }, h('h1', null, 'Ajustes'),
      h('fieldset', { class: 'tarjeta' }, h('legend', null, 'Tema'), h('div', { class: 'opciones fila' }, radio('oscuro', 'Nocturno'), radio('claro', 'Claro'), radio('auto', 'Según el sistema'))),
      h('div', { class: 'tarjeta' }, h('label', { class: 'opcion' }, h('input', { type: 'checkbox', checked: a.companero !== false, onchange: ev => { a.companero = ev.target.checked; guardar(); if (a.companero) AC.companero.saludar(); } }), h('span', { class: 'texto-opcion' }, 'Mostrar a mi compañero (el aprendiz de mago)')),
        h('label', { class: 'opcion' }, h('input', { type: 'checkbox', checked: a.silencio, onchange: ev => { a.silencio = ev.target.checked; guardar(); } }), h('span', { class: 'texto-opcion' }, 'Silenciar sonidos')),
        h('label', { class: 'opcion' }, h('input', { type: 'checkbox', checked: a.reducirAnim, onchange: ev => { a.reducirAnim = ev.target.checked; guardar(); } }), h('span', { class: 'texto-opcion' }, 'Reducir animaciones (el sistema ya lo pide si tienes «reducir movimiento» activado)'))),
      h('div', { class: 'tarjeta' }, h('h2', null, 'Tu progreso'), h('p', { class: 'etq' }, AC.almacen.persistente ? 'Se guarda automáticamente en este navegador.' : '⚠ Este navegador no permite guardar: el progreso vive solo en memoria. Exporta antes de cerrar.'),
        h('div', { class: 'acciones' },
          h('button', { type: 'button', class: 'secundario', onclick: () => {
            const txt = J.exportar(), blob = new Blob([txt], { type: 'application/json' });
            try { const u = URL.createObjectURL(blob), l = h('a', { href: u, download: 'codice-algebra-' + J.hoy() + '.json' }); document.body.appendChild(l); l.click(); l.remove(); setTimeout(() => URL.revokeObjectURL(u), 2000); msg.textContent = '✓ Archivo exportado.'; }
            catch (x) { msg.textContent = ''; msg.appendChild(h('textarea', { rows: 6, readonly: true, class: 'redaccion' }, txt)); }
          } }, 'Exportar'),
          h('button', { type: 'button', class: 'secundario', onclick: () => entrada.click() }, 'Importar…'), entrada,
          h('button', { type: 'button', class: 'peligro', onclick: () => {
            if (!confirm('Esto borra TODO tu progreso. ¿Seguro?')) return;
            if (!confirm('Última confirmación: no se puede deshacer (¿exportaste antes?).')) return;
            J.reiniciar(); AC.ui.aplicarAjustes(); hash('/inicio'); location.reload();
          } }, 'Reiniciar progreso')), msg),
      h('p', { class: 'etq' }, 'El Códice de Álgebra · versión de guardado ' + AC.guardado.VERSION + '.'));
  };

  if (typeof module !== 'undefined') module.exports = AC;
})(globalThis.AC = globalThis.AC || {});
