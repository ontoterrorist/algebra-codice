/* Compañero: un aprendiz de mago (PixelLab) que acompaña en un rincón, reacciona con frases breves y no estorba:
   es decorativo (aria-hidden), no recibe clics, se oculta solo y se puede apagar en Ajustes. Los jefes tienen su retrato (AC.retrato). */
(function (AC) {
  const ui = AC.ui, h = ui.h;
  const FRASES = {
    saludo: ['Hola de nuevo. Un teorema a la vez.', 'Abramos el Códice: hoy toca demostrar algo.', 'Aquí estoy. Respira y empecemos.'],
    ok: ['¡Bien visto!', '¡Exacto!', 'Eso es.', 'Limpio y correcto.'],
    'ok-sin-pistas': ['¡Sin pistas! Eso es dominio.', 'Sin ayuda y perfecto.'],
    parcial: ['Casi: revisa el último paso.', 'Vas cerca; mira el mensaje.'],
    mal: ['Tranquilo: cada error típico enseña.', 'Revisa la solución con calma.', 'Equivocarse también es parte de la prueba.'],
    teorema: ['¡Un teorema nuevo para el Códice!'],
    nivel: ['¡Nivel dominado! Gran trabajo.'],
    'jefe-inicio': ['Cita bien tus teoremas. Confío en ti.'],
    victoria: ['¡Lo lograste! Un hechicero menos.'],
    derrota: ['Nada se pierde. Repasa y vuelve.'],
  };
  const ANIMO = { ok: 'alegre', 'ok-sin-pistas': 'celebra', teorema: 'celebra', nivel: 'celebra', victoria: 'celebra', mal: 'triste', derrota: 'triste', parcial: 'alegre' };
  const rot = {};
  const elegir = k => { const l = FRASES[k] || []; rot[k] = (rot[k] === undefined ? Math.floor(Math.random() * l.length) : rot[k] + 1) % (l.length || 1); return l[rot[k]]; };
  let caja = null, img = null, burb = null, tBurb = 0, tAnimo = 0;

  const C = AC.companero = {
    activo() { const a = AC.juego.estado && AC.juego.estado.ajustes; return !a || a.companero !== false; },
    montar() {
      if (caja || !AC.personajes || !AC.personajes.companero) return;
      img = h('img', { class: 'companero-img', src: AC.personajes.companero, alt: '', width: 80, height: 80, draggable: 'false' });
      burb = h('div', { class: 'companero-burbuja', hidden: true });
      caja = h('div', { class: 'companero', 'aria-hidden': 'true' }, burb, img);
      document.body.appendChild(caja);
      C.refrescar();
    },
    refrescar() { if (caja) caja.hidden = !C.activo(); },
    decir(texto, animo) {
      if (!caja || !C.activo() || !texto) return;
      burb.textContent = texto; burb.hidden = false;
      clearTimeout(tBurb); tBurb = setTimeout(() => { burb.hidden = true; }, 4200);
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
  };

  /* retrato de un jefe (J1…J8); null si no hay imagen */
  AC.retrato = function (id, titulo, clase) {
    const src = AC.personajes && AC.personajes[id]; if (!src) return null;
    return h('img', { class: 'retrato-jefe ' + (clase || ''), src, alt: 'Retrato de ' + titulo, width: 80, height: 80, draggable: 'false' });
  };
})(globalThis.AC = globalThis.AC || {});
