/* Campo matemático: entrada + teclado en pantalla + vista previa KaTeX hecha desde el análisis (no desde el texto crudo).
   Modos: 'num' (racionales), 'logica' (fórmulas proposicionales), 'expr' (expresiones algebraicas) y 'conjunto' (elementos entre llaves). */
(function (AC) {
  const ui = AC.ui, h = ui.h, L = AC.logic, Rat = AC.Rat;

  const ETIQ = { '¬': 'negación', '∧': 'y', '∨': 'o', '→': 'implica', '↔': 'si y solo si', '−': 'menos', ',': 'coma', '×': 'por', '∅': 'conjunto vacío', '{': 'abrir llave', '}': 'cerrar llave', '^': 'elevado a', '(': 'abrir paréntesis', ')': 'cerrar paréntesis' };
  const TECLAS = {
    num: () => ['7', '8', '9', '4', '5', '6', '1', '2', '3', '0', ',', '/', '−'],
    logica: o => ['¬', '∧', '∨', '→', '↔', '(', ')'].concat(o.vars || []),
    expr: o => ['7', '8', '9', '+', '−', '4', '5', '6', '×', '/', '1', '2', '3', '^', '(', '0', ',', ')'].concat(o.vars || []),
    conjunto: () => ['{', '}', ',', '∅', '(', ')', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '−', 'a', 'b', 'c', 'd', 'e'],
  };
  const MENSAJE = { num: 'Escribe un número: entero, fracción (3/8) o decimal (0,375).' };

  ui.contadorIds = ui.contadorIds || 0;
  ui.campoMate = function (o) { // {modo, vars, etiqueta, onCambio}
    const id = 'cm' + (++ui.contadorIds), modo = o.modo;
    const input = h('input', { type: 'text', id, class: 'campo-mate', autocomplete: 'off', autocapitalize: 'off', spellcheck: 'false', 'aria-describedby': id + '-prev', inputmode: modo === 'num' ? 'decimal' : 'text', 'aria-label': o.etiqueta || 'Tu respuesta' });
    const prev = h('div', { class: 'previa', id: id + '-prev', 'aria-live': 'polite' });
    function insertar(t) {
      const a = input.selectionStart == null ? input.value.length : input.selectionStart, b = input.selectionEnd == null ? a : input.selectionEnd;
      input.value = input.value.slice(0, a) + t + input.value.slice(b);
      input.focus(); input.setSelectionRange(a + t.length, a + t.length);
      actualizar();
    }
    function error(e, v) { return h('span', { class: 'previa-error' }, (e.msg || 'Expresión incompleta') + (e.pos != null && e.pos < v.length ? ' (posición ' + (e.pos + 1) + ')' : '')); }
    function actualizar() {
      ui.vaciar(prev);
      const v = input.value.trim();
      if (v) {
        if (modo === 'num') {
          const r = Rat.parse(v);
          prev.appendChild(r ? ui.tex(r.toTeX()) : h('span', { class: 'previa-error' }, MENSAJE.num));
        } else if (modo === 'logica') {
          try { prev.appendChild(ui.tex(L.tex(L.parse(v)))); } catch (e) { prev.appendChild(error(e, v)); }
        } else if (modo === 'expr') {
          try { prev.appendChild(ui.tex(AC.expr.tex(AC.expr.parse(v)))); } catch (e) { prev.appendChild(error(e, v)); }
        } else if (modo === 'conjunto') {
          const c = AC.conj.parse(v);
          prev.appendChild(c ? ui.tex(AC.conj.tex(c)) : h('span', { class: 'previa-error' }, 'Escribe los elementos separados por comas, por ejemplo {1, 2, 5}; ∅ para el conjunto vacío.'));
        }
      }
      if (o.onCambio) o.onCambio();
    }
    input.addEventListener('input', actualizar);
    const teclas = TECLAS[modo](o);
    const tec = h('div', { class: 'teclado', role: 'group', 'aria-label': 'Teclado matemático' },
      teclas.map(t => h('button', { type: 'button', class: 'tecla', 'aria-label': ETIQ[t] || t, onclick: () => { AC.sonido.tocar('click'); insertar(t === '−' ? '-' : t === '×' ? '*' : t); } }, t)),
      h('button', { type: 'button', class: 'tecla tecla-borrar', 'aria-label': 'Borrar un carácter', onclick: () => { const a = input.selectionStart == null ? input.value.length : input.selectionStart; if (a > 0) { input.value = input.value.slice(0, a - 1) + input.value.slice(a); input.setSelectionRange(a - 1, a - 1); } input.focus(); actualizar(); } }, '⌫'));
    const el = h('div', { class: 'campo-bloque' }, input, prev, tec);
    return { el, input, valor: () => input.value, bloquear() { input.disabled = true; tec.querySelectorAll('button').forEach(b => { b.disabled = true; }); } };
  };
  if (typeof module !== 'undefined') module.exports = AC;
})(globalThis.AC = globalThis.AC || {});
