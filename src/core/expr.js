/* Expresiones algebraicas exactas: analizador → árbol → función racional (polinomios multivariados con coeficientes racionales).
   Equivalencia de dos expresiones = igualdad de funciones racionales (producto cruzado). Sin math.js. */
(function (AC) {
  const Rat = AC.Rat;
  const cero = Rat.of(0), uno = Rat.of(1);

  /* ---------- polinomios: Map «monomio» → Rat, monomio = «x:2,y:1» ordenado ---------- */
  const P = {
    const: r => { const m = new Map(); if (!r.isZero()) m.set('', r); return m; },
    vari: v => new Map([[v + ':1', uno]]),
    suma(a, b) { const m = new Map(a); b.forEach((c, k) => { const s = (m.get(k) || cero).add(c); if (s.isZero()) m.delete(k); else m.set(k, s); }); return m; },
    neg(a) { const m = new Map(); a.forEach((c, k) => m.set(k, c.neg())); return m; },
    mulMono(k1, k2) {
      if (!k1) return k2; if (!k2) return k1;
      const e = {}; [k1, k2].forEach(k => k.split(',').forEach(t => { const [v, n] = t.split(':'); e[v] = (e[v] || 0) + Number(n); }));
      return Object.keys(e).sort().map(v => v + ':' + e[v]).join(',');
    },
    mul(a, b) { let m = new Map(); a.forEach((c1, k1) => b.forEach((c2, k2) => { m = P.suma(m, new Map([[P.mulMono(k1, k2), c1.mul(c2)]])); })); return m; },
    pow(a, n) { let r = P.const(uno); for (let i = 0; i < n; i++) r = P.mul(r, a); return r; },
    esCero: a => a.size === 0,
    igual(a, b) { return P.esCero(P.suma(a, P.neg(b))); },
  };
  const F = { // función racional {n, d}
    de: p => ({ n: p, d: P.const(uno) }),
    suma: (a, b) => ({ n: P.suma(P.mul(a.n, b.d), P.mul(b.n, a.d)), d: P.mul(a.d, b.d) }),
    neg: a => ({ n: P.neg(a.n), d: a.d }),
    mul: (a, b) => ({ n: P.mul(a.n, b.n), d: P.mul(a.d, b.d) }),
    div(a, b) { if (P.esCero(b.n)) throw { msg: 'División entre cero', pos: 0 }; return { n: P.mul(a.n, b.d), d: P.mul(a.d, b.n) }; },
    pow(a, n) { return { n: P.pow(a.n, n), d: P.pow(a.d, n) }; },
    igual: (a, b) => P.igual(P.mul(a.n, b.d), P.mul(b.n, a.d)),
  };

  /* ---------- análisis ---------- */
  function tokens(s) {
    const out = []; let i = 0;
    while (i < s.length) {
      const c = s[i];
      if (/\s/.test(c)) { i++; continue; }
      let m;
      if ((m = /^\d+(?:[.,]\d+)?/.exec(s.slice(i)))) { out.push({ k: 'n', v: m[0], pos: i }); i += m[0].length; continue; }
      if (/[A-Za-z]/.test(c)) { out.push({ k: 'v', v: c, pos: i }); i++; continue; }
      if (c === '−') { out.push({ k: '-', pos: i }); i++; continue; }
      if (c === '×' || c === '·' || c === '*') { out.push({ k: '*', pos: i }); i++; continue; }
      if ('+-/^()'.includes(c)) { out.push({ k: c, pos: i }); i++; continue; }
      throw { msg: 'Símbolo no reconocido «' + c + '»', pos: i };
    }
    return out;
  }
  function parse(s) {
    s = String(s); const tk = tokens(s); let p = 0;
    const pk = () => tk[p], fin = s.length;
    const fallo = (msg, pos) => { throw { msg, pos: pos === undefined ? fin : pos }; };
    function atomo() {
      const t = pk();
      if (!t) fallo('Falta una expresión al final');
      if (t.k === 'n') { p++; const r = Rat.parse(t.v); if (!r) fallo('Número no válido', t.pos); return { t: 'n', r }; }
      if (t.k === 'v') { p++; return { t: 'v', v: t.v }; }
      if (t.k === '(') { p++; const e = suma(); if (!pk() || pk().k !== ')') fallo('Falta cerrar el paréntesis', pk() ? pk().pos : undefined); p++; return e; }
      return fallo('No se esperaba este símbolo aquí', t.pos);
    }
    function potencia() {
      const b = atomo();
      if (pk() && pk().k === '^') {
        p++; let neg = false; if (pk() && pk().k === '-') { fallo('Solo se admiten exponentes enteros no negativos', pk().pos); }
        const e = atomo(); if (e.t !== 'n' || !e.r.isInt() || e.r.n < 0n || e.r.n > 12n) fallo('El exponente debe ser un entero entre 0 y 12', tk[p - 1] ? tk[p - 1].pos : undefined);
        void neg; return { t: '^', a: b, e: Number(e.r.n) };
      }
      return b;
    }
    function unario() { if (pk() && pk().k === '-') { p++; return { t: 'neg', a: unario() }; } return potencia(); }
    function producto() {
      let a = unario();
      for (;;) {
        const t = pk();
        if (t && (t.k === '*' || t.k === '/')) { p++; a = { t: t.k, a, b: unario() }; }
        else if (t && (t.k === 'v' || t.k === '(' || t.k === 'n')) a = { t: '*', a, b: potencia(), impl: true }; // multiplicación implícita
        else return a;
      }
    }
    function suma() {
      let a = producto();
      while (pk() && (pk().k === '+' || pk().k === '-')) { const k = pk().k; p++; a = { t: k, a, b: producto() }; }
      return a;
    }
    if (!tk.length) fallo('Escribe una expresión', 0);
    const e = suma();
    if (p < tk.length) fallo('Sobra un símbolo (¿paréntesis de más?)', tk[p].pos);
    return e;
  }
  function aF(e) {
    switch (e.t) {
      case 'n': return F.de(P.const(e.r));
      case 'v': return F.de(P.vari(e.v));
      case 'neg': return F.neg(aF(e.a));
      case '+': return F.suma(aF(e.a), aF(e.b));
      case '-': return F.suma(aF(e.a), F.neg(aF(e.b)));
      case '*': return F.mul(aF(e.a), aF(e.b));
      case '/': return F.div(aF(e.a), aF(e.b));
      case '^': return F.pow(aF(e.a), e.e);
    }
    throw new Error('nodo ' + e.t);
  }
  const vars = (e, s = new Set()) => { if (e.t === 'v') s.add(e.v); else { if (e.a) vars(e.a, s); if (e.b) vars(e.b, s); } return [...s].sort(); };

  /* ---------- LaTeX desde el árbol ---------- */
  function tex(e, prec) {
    const par = (s, cond) => (cond ? '\\left(' + s + '\\right)' : s);
    switch (e.t) {
      case 'n': return e.r.d === 1n ? (e.r.n < 0n ? '(' + e.r.n + ')' : String(e.r.n)) : e.r.toTeX();
      case 'v': return e.v;
      case 'neg': return '-' + tex(e.a, 3);
      case '+': return par(tex(e.a, 1) + '+' + tex(e.b, 1), prec > 1);
      case '-': return par(tex(e.a, 1) + '-' + tex(e.b, 2), prec > 1);
      case '*': {
        const a = tex(e.a, 2), b = tex(e.b, 3);
        const juntar = e.impl || (e.a.t === 'n' && e.b.t !== 'n');
        return par(a + (juntar ? (e.b.t === 'n' ? '\\cdot ' : '') : '\\cdot ') + b, prec > 2);
      }
      case '/': return '\\frac{' + tex(e.a, 0) + '}{' + tex(e.b, 0) + '}';
      case '^': return tex(e.a, 4) + '^{' + e.e + '}';
    }
    return '?';
  }
  function texBase(e, prec) { // paréntesis sobre bases de potencias y cocientes
    return tex(e, prec);
  }
  void texBase;

  /* equivalencia de dos cadenas: devuelve {ok} o {error:{msg,pos}} */
  function equiv(a, b) { return F.igual(aF(parse(a)), aF(parse(b))); }
  function evaluar(s, env) { // valor racional en un punto (para comprobaciones numéricas); null si el denominador se anula
    const f = aF(parse(s));
    const ev = p => { let tot = cero; p.forEach((c, k) => { let t = c; if (k) k.split(',').forEach(x => { const [v, n] = x.split(':'); for (let i = 0; i < Number(n); i++) t = t.mul(env[v]); }); tot = tot.add(t); }); return tot; };
    const d = ev(f.d); return d.isZero() ? null : ev(f.n).div(d);
  }
  AC.expr = { parse, aF, equiv, tex: e => tex(e, 0), vars, evaluar, F, P };
  if (typeof module !== 'undefined') module.exports = AC;
})(globalThis.AC = globalThis.AC || {});
