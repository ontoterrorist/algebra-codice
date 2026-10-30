/* Fórmulas proposicionales: parser, impresión, evaluación, tablas, equivalencia y reescrituras. */
(function (AC) {
  const V = n => ({ t: 'v', n });
  const N = a => ({ t: 'not', a });
  const mk = t => (a, b) => ({ t, a, b });
  const A = mk('and'), O = mk('or'), I = mk('imp'), E = mk('iff');
  const BIN = { and: '∧', or: '∨', imp: '→', iff: '↔' };
  const TEX = { and: '\\wedge', or: '\\vee', imp: '\\to', iff: '\\leftrightarrow' };

  /* ---------- análisis ---------- */
  function tokens(s) {
    const out = []; let i = 0;
    const ops = [['<=>', 'iff'], ['<->', 'iff'], ['↔', 'iff'], ['=>', 'imp'], ['->', 'imp'], ['→', 'imp'], ['\\/', 'or'], ['∨', 'or'], ['|', 'or'],
      ['/\\', 'and'], ['∧', 'and'], ['&', 'and'], ['^', 'and'], ['¬', 'not'], ['~', 'not'], ['!', 'not'], ['(', '('], [')', ')'], ['[', '('], [']', ')']];
    while (i < s.length) {
      const c = s[i];
      if (/\s/.test(c)) { i++; continue; }
      const op = ops.find(([k]) => s.startsWith(k, i));
      if (op) { out.push({ k: op[1], pos: i }); i += op[0].length; continue; }
      if (/[A-Za-z]/.test(c)) { out.push({ k: 'v', n: c, pos: i }); i++; continue; }
      throw { msg: 'Símbolo no reconocido «' + c + '»', pos: i };
    }
    return out;
  }

  function parse(s) {
    const tk = tokens(String(s)); let p = 0;
    const peek = () => tk[p];
    const fail = (msg, pos) => { throw { msg, pos: pos == null ? String(s).length : pos }; };
    function not() {
      const t = peek();
      if (!t) fail('Falta una fórmula al final');
      if (t.k === 'not') { p++; return N(not()); }
      if (t.k === 'v') { p++; return V(t.n); }
      if (t.k === '(') {
        p++; const f = iff();
        if (!peek() || peek().k !== ')') fail('Falta cerrar el paréntesis', peek() ? peek().pos : undefined);
        p++; return f;
      }
      return fail('No se esperaba este símbolo aquí', t.pos);
    }
    function and() { let f = not(); while (peek() && peek().k === 'and') { p++; f = A(f, not()); } return f; }
    function or() { let f = and(); while (peek() && peek().k === 'or') { p++; f = O(f, and()); } return f; }
    function imp() { const f = or(); if (peek() && peek().k === 'imp') { p++; return I(f, imp()); } return f; }
    function iff() { let f = imp(); while (peek() && peek().k === 'iff') { p++; f = E(f, imp()); } return f; }
    if (!tk.length) fail('Escribe una fórmula', 0);
    const f = iff();
    if (p < tk.length) fail('Sobra un símbolo (¿paréntesis de más?)', tk[p].pos);
    return f;
  }

  /* ---------- impresión (paréntesis explícitos salvo ∧∧ y ∨∨) ---------- */
  function show(f, sym, top) {
    if (f.t === 'v') return f.n;
    if (f.t === 'not') {
      const inner = f.a.t === 'v' || f.a.t === 'not' ? show(f.a, sym) : '(' + show(f.a, sym, true) + ')';
      return sym.not + inner;
    }
    const side = g => (g.t === 'v' || g.t === 'not' || (g.t === f.t && (f.t === 'and' || f.t === 'or'))) ? show(g, sym) : '(' + show(g, sym, true) + ')';
    return side(f.a) + sym[f.t] + side(f.b);
  }
  const str = f => show(f, { not: '¬', and: '∧', or: '∨', imp: '→', iff: '↔' });
  const tex = f => show(f, { not: '\\neg ', and: ' \\wedge ', or: ' \\vee ', imp: ' \\to ', iff: ' \\leftrightarrow ' });

  /* ---------- semántica ---------- */
  function vars(f, acc = new Set()) {
    if (f.t === 'v') acc.add(f.n); else { vars(f.a, acc); if (f.b) vars(f.b, acc); }
    return [...acc].sort();
  }
  function ev(f, env) {
    switch (f.t) {
      case 'v': return !!env[f.n];
      case 'not': return !ev(f.a, env);
      case 'and': return ev(f.a, env) && ev(f.b, env);
      case 'or': return ev(f.a, env) || ev(f.b, env);
      case 'imp': return !ev(f.a, env) || ev(f.b, env);
      case 'iff': return ev(f.a, env) === ev(f.b, env);
    }
    throw new Error('nodo desconocido ' + f.t);
  }
  /* filas en el orden usual: V…V primero */
  function envs(vs) {
    const out = [], n = vs.length;
    for (let i = 0; i < (1 << n); i++) {
      const env = {}; vs.forEach((v, k) => { env[v] = ((i >> (n - 1 - k)) & 1) === 0; }); out.push(env);
    }
    return out;
  }
  const tabla = (f, vs) => envs(vs || vars(f)).map(env => ev(f, env));
  const unionVars = (f, g) => [...new Set([...vars(f), ...vars(g)])].sort();
  const equiv = (f, g) => { const vs = unionVars(f, g); return envs(vs).every(e => ev(f, e) === ev(g, e)); };
  const tautologia = f => tabla(f).every(Boolean);
  const contradiccion = f => tabla(f).every(x => !x);
  const modelos = (f, vs) => tabla(f, vs).filter(Boolean).length;
  const igual = (f, g) => str(f) === str(g);

  /* ---------- formas ---------- */
  function esFNN(f) {
    if (f.t === 'v') return true;
    if (f.t === 'not') return f.a.t === 'v';
    if (f.t === 'and' || f.t === 'or') return esFNN(f.a) && esFNN(f.b);
    return false; // → y ↔ no están en forma normal de negación
  }
  const sinImp = f => f.t === 'v' || (f.t === 'not' ? sinImp(f.a) : (f.t === 'and' || f.t === 'or') && sinImp(f.a) && sinImp(f.b));
  const tamano = f => f.t === 'v' ? 1 : 1 + tamano(f.a) + (f.b ? tamano(f.b) : 0);
  function mapa(f, fn) { // transforma de abajo hacia arriba
    const g = f.t === 'v' ? f : f.t === 'not' ? N(mapa(f.a, fn)) : { t: f.t, a: mapa(f.a, fn), b: mapa(f.b, fn) };
    return fn(g);
  }
  function renombrar(f, tabla) { return mapa(f, g => g.t === 'v' ? V(tabla[g.n] || g.n) : g); }

  /* ---------- reescrituras (ejercicio paso a paso) ---------- */
  const LEYES = {
    'def-imp': 'Definición de →',
    'def-iff': 'Definición de ↔',
    'dobleneg': 'Doble negación',
    'demorgan': 'De Morgan',
    'neg-imp': 'Negación de una implicación',
  };
  function local(g, ley) {
    switch (ley) {
      case 'def-imp': return g.t === 'imp' ? O(N(g.a), g.b) : null;
      case 'def-iff': return g.t === 'iff' ? A(I(g.a, g.b), I(g.b, g.a)) : null;
      case 'dobleneg': return g.t === 'not' && g.a.t === 'not' ? g.a.a : null;
      case 'demorgan':
        if (g.t === 'not' && g.a.t === 'and') return O(N(g.a.a), N(g.a.b));
        if (g.t === 'not' && g.a.t === 'or') return A(N(g.a.a), N(g.a.b));
        return null;
      case 'neg-imp': return g.t === 'not' && g.a.t === 'imp' ? A(g.a.a, N(g.a.b)) : null;
    }
    return null;
  }
  function en(f, ruta, fn) { // aplica fn al subárbol en `ruta`
    if (!ruta.length) return fn(f);
    const [h, ...r] = ruta;
    if (f.t === 'not') return N(en(f.a, r, fn));
    return h === 'a' ? { t: f.t, a: en(f.a, r, fn), b: f.b } : { t: f.t, a: f.a, b: en(f.b, r, fn) };
  }
  function sub(f, ruta) { return ruta.reduce((g, h) => g.t === 'not' ? g.a : g[h], f); }
  function reescrituras(f, leyes) {
    const out = [];
    (function rec(g, ruta) {
      leyes.forEach(ley => {
        const r = local(g, ley);
        if (r) out.push({ ley, ruta: ruta.slice(), antes: str(g), despues: str(r) });
      });
      if (g.t === 'not') rec(g.a, ruta.concat('a'));
      else if (g.t !== 'v') { rec(g.a, ruta.concat('a')); rec(g.b, ruta.concat('b')); }
    })(f, []);
    return out;
  }
  function aplicar(f, ruta, ley) {
    const g = sub(f, ruta), r = local(g, ley);
    if (!r) return null;
    return en(f, ruta, () => r);
  }

  AC.logic = { V, N, A, O, I, E, BIN, TEX, parse, str, tex, vars, ev, envs, tabla, equiv, tautologia, contradiccion, modelos, igual, esFNN, sinImp, tamano, mapa, renombrar, LEYES, reescrituras, aplicar, sub, unionVars };
  if (typeof module !== 'undefined') module.exports = AC;
})(globalThis.AC = globalThis.AC || {});
