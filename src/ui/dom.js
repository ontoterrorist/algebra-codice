/* Utilidades de DOM: h(), limpieza, anuncios para lectores de pantalla. */
(function (AC) {
  const ui = AC.ui = AC.ui || {};

  ui.h = function (tag, attrs) {
    const el = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(k => {
      const v = attrs[k];
      if (v === null || v === undefined || v === false) return;
      if (k === 'class') el.className = v;
      else if (k === 'dataset') Object.assign(el.dataset, v);
      else if (k === 'style' && typeof v === 'object') Object.assign(el.style, v);
      else if (k.startsWith('on') && typeof v === 'function') el.addEventListener(k.slice(2).toLowerCase(), v);
      else if (v === true) el.setAttribute(k, '');
      else el.setAttribute(k, v);
    });
    for (let i = 2; i < arguments.length; i++) ui.anadir(el, arguments[i]);
    return el;
  };
  ui.anadir = function (el, c) {
    if (c === null || c === undefined || c === false) return;
    if (Array.isArray(c)) c.forEach(x => ui.anadir(el, x));
    else if (c instanceof Node) el.appendChild(c);
    else el.appendChild(document.createTextNode(String(c)));
  };
  ui.vaciar = el => { while (el.firstChild) el.removeChild(el.firstChild); return el; };
  ui.$ = (sel, raiz) => (raiz || document).querySelector(sel);

  /* anuncios (aria-live) y avisos visibles */
  ui.anunciar = function (texto) {
    const r = ui.$('#vivo'); if (!r) return;
    r.textContent = ''; setTimeout(() => { r.textContent = texto; }, 30);
  };
  ui.aviso = function (texto, tipo) {
    const cont = ui.$('#avisos'); if (!cont) return;
    const n = ui.h('div', { class: 'aviso ' + (tipo || ''), role: 'status' }, texto);
    cont.appendChild(n);
    setTimeout(() => { n.classList.add('sale'); setTimeout(() => n.remove(), 400); }, 3800);
  };
  ui.icono = function (nombre) { // iconos con texto alternativo propio en el contexto
    const mapa = { ok: '✓', mal: '✗', parcial: '◐', pista: '?', candado: '🔒', estrella: '★', estrellaVacia: '☆', fuego: '🔥' };
    return ui.h('span', { class: 'ic ic-' + nombre, 'aria-hidden': 'true' }, mapa[nombre] || nombre);
  };
  if (typeof module !== 'undefined') module.exports = AC;
})(globalThis.AC = globalThis.AC || {});
