/* Compañero: un aprendiz de mago (PixelLab) que acompaña en un rincón. Habla en un cuadro de diálogo tipo RPG, reacciona a tus respuestas
   y, durante un ejercicio, te da las pistas: tócalo (o pulsa su botón) y te dice la siguiente. Las pistas siguen restando XP igual que los
   botones de la página. Se puede apagar en Ajustes. Los jefes tienen su retrato (AC.retrato). */
(function (AC) {
  const ui = AC.ui, h = ui.h;
  const FRASES = {
    saludo: ['Hola de nuevo. Un teorema a la vez.', 'Abramos el Códice: hoy toca demostrar algo.', 'Aquí estoy. Respira y empecemos.'],
    ok: ['¡Bien visto!', '¡Exacto!', 'Eso es.', 'Limpio y correcto.'],
    'ok-sin-pistas': ['¡Sin pistas! Eso es dominio.', 'Sin ayuda y perfecto.'],
    'ok-con-pistas': ['Bien: las pistas están para usarse.', 'Correcto. Otro paso en el Códice.'],
    parcial: ['Casi: revisa el último paso.', 'Vas cerca; mira el mensaje.'],
    mal: ['Tranquilo: cada error típico enseña.', 'Revisa la solución con calma.', 'Equivocarse también es parte de la prueba.'],
    teorema: ['¡Un teorema nuevo para el Códice!'],
    nivel: ['¡Nivel dominado! Gran trabajo.'],
    'jefe-inicio': ['Cita bien tus teoremas. Confío en ti.'],
    victoria: ['¡Lo lograste! Un hechicero menos.'],
    derrota: ['Nada se pierde. Repasa y vuelve.'],
    ejercicio: ['Tócame si quieres una pista.', 'Si te atascas, pídeme una pista.'],
    sin: ['Abre un ejercicio y te daré pistas. Toca el mapa para elegir una misión.'],
    agotadas: ['Ya te di las tres pistas. Ahora te toca a ti.'],
    atasco: ['¿Atascado? Tócame y te doy una pista.'],
  };
  const ANIMO = { ok: 'alegre', 'ok-sin-pistas': 'celebra', 'ok-con-pistas': 'alegre', teorema: 'celebra', nivel: 'celebra', victoria: 'celebra', mal: 'triste', derrota: 'triste', parcial: 'alegre', pista: 'alegre' };
  const ROTULO = ['orientación', 'idea clave', 'primer paso'];
  const rot = {};
  const elegir = k => { const l = FRASES[k] || []; rot[k] = (rot[k] === undefined ? Math.floor(Math.random() * l.length) : rot[k] + 1) % (l.length || 1); return l[rot[k]]; };
  let caja = null, img = null, burb = null, nombre = null, cuerpo = null, btn = null, insignia = null, tBurb = 0, tAnimo = 0, tTeclas = 0, tAtasco = 0, prov = null;

  const C = AC.companero = {
    activo() { const a = AC.juego.estado && AC.juego.estado.ajustes; return !a || a.companero !== false; },
    montar() {
      if (caja || !AC.personajes || !AC.personajes.companero) return;
      img = h('img', { class: 'companero-img', src: AC.personajes.companero, alt: '', width: 80, height: 80, draggable: 'false' });
      insignia = h('span', { class: 'companero-insignia', hidden: true, 'aria-hidden': 'true' }, '');
      btn = h('button', { type: 'button', class: 'companero-btn', 'aria-label': 'Hablar con el aprendiz de mago', onclick: () => C.pedirPista() }, img, insignia);
      nombre = h('span', { class: 'cb-nombre' }, 'Aprendiz');
      cuerpo = h('div', { class: 'cb-texto' });
      burb = h('div', { class: 'companero-burbuja', hidden: true, 'aria-hidden': 'true', onclick: () => { burb.hidden = true; } }, nombre, cuerpo, h('span', { class: 'cb-flecha' }, '▼'));
      caja = h('div', { class: 'companero' }, burb, btn);
      document.body.appendChild(caja);
      C.refrescar();
    },
    refrescar() { if (caja) caja.hidden = !C.activo(); },
    /* escribe en el cuadro de diálogo: texto (con máquina de escribir) o un nodo ya armado (por ejemplo con KaTeX) */
    decir(contenido, animo, opciones) {
      if (!caja || !C.activo() || !contenido) return;
      const op = opciones || {};
      clearInterval(tTeclas); ui.vaciar(cuerpo); nombre.textContent = op.nombre || 'Aprendiz'; burb.classList.toggle('pista', !!op.pista); burb.hidden = false;
      if (typeof contenido === 'string') {
        if (AC.fx && AC.fx.reducir()) cuerpo.textContent = contenido;
        else { let i = 0; tTeclas = setInterval(() => { i++; cuerpo.textContent = contenido.slice(0, i); if (i >= contenido.length) clearInterval(tTeclas); }, 18); }
      } else cuerpo.appendChild(contenido);
      clearTimeout(tBurb); tBurb = setTimeout(() => { burb.hidden = true; }, op.ms || 4600);
      if (animo) {
        img.classList.remove('alegre', 'triste', 'celebra'); void img.offsetWidth; img.classList.add(animo);
        clearTimeout(tAnimo); tAnimo = setTimeout(() => img.classList.remove('alegre', 'triste', 'celebra'), 1400);
      }
    },
    reaccionar(evento) { C.decir(elegir(evento), ANIMO[evento]); },
    saludar() {
      const e = AC.juego.estado, racha = e && e.jugador && e.jugador.racha && e.jugador.racha.cuenta;
      C.decir(racha >= 2 ? 'Racha de ' + racha + ' días. ¡Sigamos! 🔥' : elegir('saludo'), 'alegre');
    },

    /* ---- pistas ----  proveedor = { dar(): {n, nodo}|null, quedan(): número }; lo pone la vista del ejercicio */
    enlazarPistas(proveedor) {
      prov = proveedor; if (!btn) return;
      C.actualizarPistas();
      clearTimeout(tAtasco); tAtasco = setTimeout(() => { if (prov === proveedor && proveedor.quedan() === 3) C.decir(elegir('atasco'), 'alegre'); }, 50000);
    },
    soltarPistas() { prov = null; clearTimeout(tAtasco); if (btn) C.actualizarPistas(); },
    actualizarPistas() {
      if (!btn) return; const q = prov ? prov.quedan() : 0;
      insignia.hidden = !prov || q <= 0; insignia.textContent = String(q); btn.classList.toggle('con-pista', !!prov && q > 0);
      btn.setAttribute('aria-label', prov ? (q > 0 ? 'Pedirle una pista al aprendiz de mago (quedan ' + q + ')' : 'Ya no quedan pistas') : 'Hablar con el aprendiz de mago');
    },
    pedirPista() {
      if (!caja) return;
      if (!prov) { C.decir(elegir('sin'), 'alegre'); return; }
      const r = prov.dar();
      if (!r) { C.decir(elegir('agotadas'), 'alegre'); return; }
      C.actualizarPistas(); clearTimeout(tAtasco);
      const marca = h('strong', { class: 'cb-marca' }, 'Pista ' + r.n + ' de 3 · ' + ROTULO[r.n - 1]);
      C.decir(h('div', null, marca, h('div', { class: 'cb-pista' }, r.nodo), r.n === 1 ? h('div', { class: 'cb-nota' }, 'Cada pista resta un poco de XP; nunca te bloquea.') : null), ANIMO.pista, { pista: true, nombre: 'Aprendiz', ms: 16000 });
    },
  };

  /* retrato de un jefe (J1…J8); null si no hay imagen */
  AC.retrato = function (id, titulo, clase) {
    const src = AC.personajes && AC.personajes[id]; if (!src) return null;
    return h('img', { class: 'retrato-jefe ' + (clase || ''), src, alt: 'Retrato de ' + titulo, width: 80, height: 80, draggable: 'false' });
  };
})(globalThis.AC = globalThis.AC || {});
