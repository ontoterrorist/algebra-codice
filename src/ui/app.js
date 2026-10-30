/* Arranque, rutas por hash (funcionan desde file://), cabecera, ajustes visibles y avisos. */
(function (AC) {
  const ui = AC.ui, h = ui.h, J = AC.juego;

  ui.aplicarAjustes = function () {
    const a = J.estado.ajustes, raiz = document.documentElement;
    let tema = a.tema;
    if (tema === 'auto') tema = globalThis.matchMedia && matchMedia('(prefers-color-scheme: light)').matches ? 'claro' : 'oscuro';
    raiz.dataset.tema = tema;
    raiz.classList.toggle('reducir', !!a.reducirAnim);
    const m = ui.$('#btn-sonido');
    if (m) { m.setAttribute('aria-pressed', String(!a.silencio)); m.textContent = a.silencio ? '🔇' : '🔊'; m.setAttribute('aria-label', a.silencio ? 'Activar sonidos' : 'Silenciar sonidos'); }
    const mt = document.querySelector('meta[name=theme-color]');
    if (mt) mt.setAttribute('content', tema === 'claro' ? '#f6f0e1' : '#0b1530');
  };

  ui.actualizarCabecera = function () {
    const e = J.estado, p = AC.xp.progreso(e.jugador.xp);
    const x = ui.$('#cab-xp'); if (!x) return;
    ui.vaciar(x);
    x.append(
      h('span', { class: 'cab-nivel' }, 'Nv ' + p.nivel),
      h('span', { class: 'cab-barra', role: 'progressbar', 'aria-valuemin': '0', 'aria-valuemax': '100', 'aria-valuenow': String(Math.round(p.frac * 100)), 'aria-label': 'Progreso hacia el nivel ' + (p.nivel + 1) },
        h('span', { class: 'cab-relleno', style: { width: Math.round(p.frac * 100) + '%' } })),
      h('span', { class: 'cab-racha', title: 'Racha diaria' }, '🔥 ' + e.jugador.racha.cuenta));
  };

  function convenciones() {
    const cerrar = () => { J.marcarConvenciones(); fondo.remove(); ui.$('#main').focus(); };
    const fondo = h('div', { class: 'fondo-modal' }, h('div', { class: 'modal', role: 'dialog', 'aria-modal': 'true', 'aria-labelledby': 'tit-conv' },
      h('h2', { id: 'tit-conv' }, 'Antes de empezar'),
      h('ul', null,
        h('li', null, ui.mate('$\\mathbb{N}$ incluye el 0.')),
        h('li', null, 'Las hipótesis de cada enunciado son siempre explícitas: lo que no está escrito no se supone.'),
        h('li', null, 'En las respuestas numéricas puedes usar coma o punto decimal (3,5 o 3.5) o fracciones (7/2).'),
        h('li', null, 'Un teorema solo se puede citar cuando ya lo has demostrado: ese es el Códice.'),
        h('li', null, 'Se asumen sin demostrar las propiedades de la lógica que aparecen como «base» (conmutatividad, doble negación…) y las tablas de los conectivos.'),
        h('li', null, 'Las pistas restan XP pero nunca bloquean nada.')),
      h('button', { type: 'button', class: 'primario', onclick: cerrar }, 'Entendido')));
    document.body.appendChild(fondo);
    fondo.querySelector('button').focus();
    fondo.addEventListener('keydown', ev => {
      if (ev.key === 'Escape') cerrar();
      if (ev.key === 'Tab') { ev.preventDefault(); fondo.querySelector('button').focus(); }
    });
  }

  function ruta() {
    const partes = (location.hash || '#/inicio').replace(/^#\/?/, '').split('/');
    const r = partes[0] || 'inicio', a = partes.slice(1).join('/');
    const V = ui.vistas;
    const mapa = {
      inicio: () => V.inicio(), mapa: () => V.mapa(), nivel: () => V.nivel(a), leccion: () => V.leccion(a), practica: () => V.practica(a),
      repaso: () => V.repaso(), diario: () => V.diario(), reloj: () => V.reloj(), codice: () => V.codice(a), demostrar: () => V.demostrar(a),
      panel: () => V.panel(), ajustes: () => V.ajustes(),
    };
    const main = ui.$('#main'); ui.vaciar(main);
    let vista;
    try { vista = (mapa[r] || mapa.inicio)(); } catch (e) {
      console.error(e);
      vista = h('div', { class: 'vista' }, h('h1', null, 'Algo salió mal'), h('p', null, e.message), h('a', { href: '#/inicio' }, 'Volver al inicio'));
    }
    main.appendChild(vista);
    document.querySelectorAll('nav a').forEach(l => l.setAttribute('aria-current', l.getAttribute('href') === '#/' + r ? 'page' : 'false'));
    const t = main.querySelector('h1');
    document.title = t && t.textContent !== 'El Códice de Álgebra' ? t.textContent + ' · El Códice de Álgebra' : 'El Códice de Álgebra';
    window.scrollTo(0, 0);
    ui.actualizarCabecera();
  }

  ui.arrancar = function () {
    const r = J.iniciar();
    const app = ui.$('#app');
    const nav = h('nav', { 'aria-label': 'Principal' }, [['inicio', 'Inicio'], ['mapa', 'Mapa'], ['codice', 'Códice'], ['panel', 'Panel'], ['ajustes', 'Ajustes']].map(([k, t]) => h('a', { href: '#/' + k }, t)));
    const btnSonido = h('button', { type: 'button', id: 'btn-sonido', class: 'icono-btn', onclick: () => { J.estado.ajustes.silencio = !J.estado.ajustes.silencio; J.guardar(); ui.aplicarAjustes(); AC.sonido.tocar('click'); } }, '🔊');
    app.append(
      h('a', { href: '#main', class: 'saltar', onclick: ev => { ev.preventDefault(); ui.$('#main').focus(); } }, 'Saltar al contenido'),
      h('header', { class: 'cabecera' }, h('a', { href: '#/inicio', class: 'marca-sitio' }, h('span', { 'aria-hidden': 'true' }, '𝔄 '), 'Códice de Álgebra'), h('div', { id: 'cab-xp', class: 'cab-xp' }), btnSonido, nav),
      h('div', { id: 'aviso-mem', class: 'aviso-fijo', role: 'alert', hidden: true }),
      h('main', { id: 'main', tabindex: '-1' }),
      h('div', { id: 'avisos', class: 'avisos' }),
      h('div', { id: 'vivo', class: 'sr', 'aria-live': 'polite', 'aria-atomic': 'true' }));
    ui.aplicarAjustes();
    const aviso = ui.$('#aviso-mem'), msgs = [];
    if (r.error) msgs.push(r.error);
    if (!AC.almacen.persistente) msgs.push('Este navegador no permite guardar datos: tu progreso solo vive mientras la página esté abierta. Exporta tu progreso desde Ajustes antes de cerrar.');
    if (msgs.length) { aviso.textContent = msgs.join(' '); aviso.hidden = false; }
    window.addEventListener('hashchange', ruta);
    ruta();
    if (!J.estado.ajustes.convencionesVistas) convenciones();
  };
  if (typeof module !== 'undefined') module.exports = AC;
})(globalThis.AC = globalThis.AC || {});
