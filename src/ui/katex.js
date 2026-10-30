/* Envoltura de KaTeX: salida HTML + MathML (accesible). Texto con $...$ y **negrita**. */
(function (AC) {
  const ui = AC.ui;

  ui.tex = function (tex, display) {
    const span = document.createElement('span');
    span.className = 'mate';
    try {
      globalThis.katex.render(String(tex), span, { throwOnError: false, output: 'htmlAndMathml', displayMode: !!display, strict: 'ignore', trust: false });
    } catch (e) { span.textContent = tex; }
    return span;
  };

  function texto(frag, s) {
    s.split('\n').forEach((linea, i) => {
      if (i) frag.appendChild(document.createElement('br'));
      linea.split(/(\*\*[^*]+\*\*)/).forEach(p => {
        if (/^\*\*[^*]+\*\*$/.test(p)) { const b = document.createElement('strong'); b.textContent = p.slice(2, -2); frag.appendChild(b); }
        else if (p) frag.appendChild(document.createTextNode(p));
      });
    });
  }
  ui.mate = function (str) {
    const frag = document.createDocumentFragment();
    String(str).split(/(\$[^$]+\$)/).forEach(p => {
      if (/^\$[^$]+\$$/.test(p)) frag.appendChild(ui.tex(p.slice(1, -1)));
      else if (p) texto(frag, p);
    });
    return frag;
  };
  ui.parrafo = (str, clase) => { const p = document.createElement('p'); if (clase) p.className = clase; p.appendChild(ui.mate(str)); return p; };
  if (typeof module !== 'undefined') module.exports = AC;
})(globalThis.AC = globalThis.AC || {});
