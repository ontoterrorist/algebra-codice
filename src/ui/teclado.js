/* Campo matemático: entrada + teclado en pantalla + vista previa KaTeX hecha desde el análisis (no desde el texto crudo). */
(function (AC) {
  const ui = AC.ui, h = ui.h, L = AC.logic, Rat = AC.Rat;

  ui.contadorIds = ui.contadorIds || 0;
  ui.campoMate = function (o) { // {modo:'num'|'logica', vars, etiqueta, onCambio}
    const id = 'cm' + (++ui.contadorIds);
    const input = h('input', { type: 'text', id, class: 'campo-mate', autocomplete: 'off', autocapitalize: 'off', spellcheck: 'false', 'aria-describedby': id + '-prev', inputmode: o.modo === 'num' ? 'decimal' : 'text', 'aria-label': o.etiqueta || 'Tu respuesta' });
    const prev = h('div', { class: 'previa', id: id + '-prev', 'aria-live': 'polite' });
    const teclas = o.modo === 'num'
      ? ['7', '8', '9', '4', '5', '6', '1', '2', '3', '0', ',', '/', '−']
      : ['¬', '∧', '∨', '→', '↔', '(', ')'].concat(o.vars || []);
    function insertar(t) {
      const a = input.selectionStart == null ? input.value.length : input.selectionStart, b = input.selectionEnd == null ? a : input.selectionEnd;
      input.value = input.value.slice(0, a) + t + input.value.slice(b);
      input.focus(); input.setSelectionRange(a + t.length, a + t.length);
      actualizar();
    }
    function actualizar() {
      ui.vaciar(prev);
      const v = input.value.trim();
      if (v) {
        if (o.modo === 'num') {
          const r = Rat.parse(v);
          if (r) prev.appendChild(ui.tex(r.toTeX())); else prev.appendChild(h('span', { class: 'previa-error' }, 'Escribe un número: entero, fracción (3/8) o decimal (0,375).'));
        } else {
          try { prev.appendChild(ui.tex(L.tex(L.parse(v)))); } catch (e) {
            prev.appendChild(h('span', { class: 'previa-error' }, (e.msg || 'Fórmula incompleta') + (e.pos != null && e.pos < v.length ? ' (posición ' + (e.pos + 1) + ')' : '')));
          }
        }
      }
      if (o.onCambio) o.onCambio();
    }
    input.addEventListener('input', actualizar);
    const tec = h('div', { class: 'teclado', role: 'group', 'aria-label': 'Teclado matemático' },
      teclas.map(t => h('button', { type: 'button', class: 'tecla', 'aria-label': ({ '¬': 'negación', '∧': 'y', '∨': 'o', '→': 'implica', '↔': 'si y solo si', '−': 'menos', ',': 'coma decimal' })[t] || t, onclick: () => { AC.sonido.tocar('click'); insertar(t === '−' ? '-' : t); } }, t)),
      h('button', { type: 'button', class: 'tecla tecla-borrar', 'aria-label': 'Borrar un carácter', onclick: () => { const a = input.selectionStart == null ? input.value.length : input.selectionStart; if (a > 0) { input.value = input.value.slice(0, a - 1) + input.value.slice(a); input.setSelectionRange(a - 1, a - 1); } input.focus(); actualizar(); } }, '⌫'));
    const el = h('div', { class: 'campo-bloque' }, input, prev, tec);
    return { el, input, valor: () => input.value, bloquear() { input.disabled = true; tec.querySelectorAll('button').forEach(b => { b.disabled = true; }); } };
  };
  if (typeof module !== 'undefined') module.exports = AC;
})(globalThis.AC = globalThis.AC || {});
