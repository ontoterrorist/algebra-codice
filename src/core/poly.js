/* Polinomios univariados con coeficientes racionales: arreglos de Rat (índice = grado). División, mcd, raíces racionales,
   irreducibilidad en grados ≤ 4 y factorización completa sobre ℚ para los polinomios que genera el juego. */
(function (AC) {
  const Rat = AC.Rat, cero = Rat.of(0), uno = Rat.of(1);
  const norm = a => { const p = a.slice(); while (p.length && p[p.length - 1].isZero()) p.pop(); return p; };
  const de = arr => norm(arr.map(x => (x instanceof Rat ? x : Rat.of(x))));
  const grado = p => p.length - 1;
  const lider = p => p[p.length - 1];
  const esCero = p => p.length === 0;
  const add = (a, b) => { const n = Math.max(a.length, b.length), o = []; for (let i = 0; i < n; i++) o.push((a[i] || cero).add(b[i] || cero)); return norm(o); };
  const neg = a => a.map(x => x.neg());
  const sub = (a, b) => add(a, neg(b));
  const mul = (a, b) => { if (!a.length || !b.length) return []; const o = Array.from({ length: a.length + b.length - 1 }, () => cero); a.forEach((x, i) => b.forEach((y, j) => { o[i + j] = o[i + j].add(x.mul(y)); })); return norm(o); };
  const esc = (a, c) => norm(a.map(x => x.mul(c)));
  const igual = (a, b) => a.length === b.length && a.every((x, i) => x.eq(b[i]));
  const evalua = (p, x) => p.reduceRight((s, c) => s.mul(x).add(c), cero);
  const deriv = p => norm(p.slice(1).map((c, i) => c.mul(Rat.of(i + 1))));
  const monico = p => (p.length ? esc(p, uno.div(lider(p))) : p);
  function divmod(a, b) {
    if (esCero(b)) throw new Error('división entre el polinomio cero');
    let r = a.slice(), q = Array.from({ length: Math.max(0, a.length - b.length + 1) }, () => cero);
    while (r.length >= b.length && r.length) {
      const c = lider(r).div(lider(b)), k = r.length - b.length; q[k] = c;
      r = sub(r, mul(Array.from({ length: k }, () => cero).concat([c]), b));
    }
    return { q: norm(q), r: norm(r) };
  }
  function mcd(a, b) { while (!esCero(b)) { [a, b] = [b, divmod(a, b).r]; } return esCero(a) ? a : esc(a, uno.div(lider(a))); }
  /* Horner: devuelve cociente y resto de dividir por (x − a) */
  function horner(p, a) { const q = []; let acc = cero; for (let i = p.length - 1; i >= 0; i--) { acc = acc.mul(a).add(p[i]); q.unshift(acc); } const r = q.shift(); return { q: norm(q), r: r || cero, pasos: q }; }

  /* ---------- texto ---------- */
  function str(p, v) {
    v = v || 'x'; if (!p.length) return '0';
    const t = [];
    for (let i = p.length - 1; i >= 0; i--) {
      const c = p[i]; if (c.isZero()) continue;
      const neg = c.cmp(cero) < 0, a = neg ? c.neg() : c;
      let cs = a.isInt() ? (a.n === 1n && i > 0 ? '' : String(a.n)) : '(' + a + ')';
      let m = i === 0 ? '' : v + (i > 1 ? '^' + i : '');
      if (i > 0 && cs !== '') cs += '*';
      t.push((t.length ? (neg ? '-' : '+') : (neg ? '-' : '')) + cs + m);
    }
    return t.join('');
  }
  function tex(p, v) {
    v = v || 'x'; if (!p.length) return '0';
    const t = [];
    for (let i = p.length - 1; i >= 0; i--) {
      const c = p[i]; if (c.isZero()) continue;
      const neg = c.cmp(cero) < 0, a = neg ? c.neg() : c;
      const cs = a.isInt() ? (a.n === 1n && i > 0 ? '' : String(a.n)) : '\\tfrac{' + a.n + '}{' + a.d + '}';
      const m = i === 0 ? '' : v + (i > 1 ? '^{' + i + '}' : '');
      t.push((t.length ? (neg ? '-' : '+') : (neg ? '-' : '')) + cs + m);
    }
    return t.join('');
  }
  /* polinomio desde una cadena como «x^3-2x+1»; null si no es un polinomio en la variable */
  function parse(s, v) { try { return fromAst(AC.expr.parse(s), v); } catch (e) { return null; } }
  function fromAst(ast, v) {
    v = v || 'x';
    try {
      const f = AC.expr.aF(ast);
      const mk = P => { const out = []; P.forEach((c, k) => { if (k === '') out[0] = (out[0] || cero).add(c); else { const m = new RegExp('^' + v + ':(\\d+)$').exec(k); if (!m) throw new Error('variable'); const e = +m[1]; out[e] = (out[e] || cero).add(c); } }); for (let i = 0; i < out.length; i++) if (!out[i]) out[i] = cero; return norm(out); };
      const n = mk(f.n), d = mk(f.d);
      if (d.length !== 1) { const { q, r } = divmod(n, d); return esCero(r) ? q : null; }
      return esc(n, uno.div(d[0]));
    } catch (e) { return null; }
  }

  /* ---------- raíces racionales ---------- */
  const divisoresAbs = n => { n = Math.abs(n); const o = []; for (let d = 1; d <= n; d++) if (n % d === 0) o.push(d); return o; };
  function aEnteros(p) { // multiplica por el mcm de los denominadores y devuelve enteros
    let m = 1n; p.forEach(c => { const g = (a, b) => { while (b) { [a, b] = [b, a % b]; } return a; }; m = m / g(m, c.d) * c.d; });
    return p.map(c => Number(c.n * (m / c.d)));
  }
  function candidatos(p) { // ±a0/an por divisores, como cadenas racionales
    const e = aEnteros(p); if (e.length < 2) return [];
    let a0 = e[0], k = 0; while (a0 === 0 && k < e.length - 1) { k++; a0 = e[k]; }
    const an = e[e.length - 1], out = new Set(k ? ['0'] : []);
    divisoresAbs(a0).forEach(a => divisoresAbs(an).forEach(b => { const r = Rat.of(a, b); out.add(r.toString()); out.add(r.neg().toString()); }));
    return [...out];
  }
  const raicesRacionales = p => candidatos(p).filter(c => evalua(p, Rat.parse(c)).isZero());
  function multiplicidad(p, a) { let m = 0, q = p; while (!esCero(q)) { const h = horner(q, a); if (!h.r.isZero()) break; m++; q = h.q; } return m; }

  /* ---------- irreducibilidad y factorización sobre ℚ (grados ≤ 4) ---------- */
  const raizCuadradaRacional = r => { if (r.cmp(cero) < 0) return null; const f = x => { const n = BigInt(Math.round(Math.sqrt(Number(x)))); for (const c of [n - 1n, n, n + 1n]) if (c >= 0n && c * c === x) return c; return null; }; const a = f(r.n), b = f(r.d); return a !== null && b !== null ? Rat.of(a, b) : null; };
  const disc2 = p => p[1].mul(p[1]).sub(Rat.of(4).mul(p[2]).mul(p[0]));
  function irreducibleQ(p) {
    const g = grado(p); if (g < 1) return false; if (g === 1) return true;
    if (raicesRacionales(p).length) return false;
    if (g === 2 || g === 3) return g === 2 ? raizCuadradaRacional(disc2(p)) === null : true;
    if (g === 4) { // sin raíces: puede ser producto de dos cuadráticas (monicas tras hacer el polinomio primitivo, con coeficientes enteros acotados)
      const m = monico(p), e = aEnteros(m); const bs = divisoresAbs(e[0]).flatMap(d => [d, -d]);
      if (m.some(c => !c.isInt())) return null;
      for (let a = -30; a <= 30; a++) for (const b of bs) { const d = divmod(m, de([b, a, 1])); if (esCero(d.r)) return false; }
      return true;
    }
    return null; // no se decide con este método
  }
  const irreducibleR = p => grado(p) === 1 || (grado(p) === 2 && disc2(p).cmp(cero) < 0);
  const irreducibleC = p => grado(p) === 1;

  /* factorización completa sobre ℚ: lista [{p, m}] con p mónico irreducible y la constante aparte (solo grados ≤ 4 sin cuadráticas ocultas) */
  function factorizarQ(p) {
    const out = []; let q = p.slice(), c = lider(p);
    q = monico(q);
    for (;;) {
      const rs = raicesRacionales(q); if (!rs.length || grado(q) === 0) break;
      const a = Rat.parse(rs[0]); let m = 0; for (;;) { const h = horner(q, a); if (!h.r.isZero()) break; q = h.q; m++; if (grado(q) < 1) break; }
      out.push({ p: de([a.neg(), 1]), m });
      if (grado(q) < 1) break;
    }
    if (grado(q) >= 1) { // el resto no tiene raíces racionales
      if (grado(q) === 4) { const bs = divisoresAbs(Number(aEnteros(q)[0])).flatMap(d => [d, -d]); let ok = false; for (let a = -30; a <= 30 && !ok; a++) for (const b of bs) { const d = divmod(q, de([b, a, 1])); if (esCero(d.r)) { out.push({ p: de([b, a, 1]), m: 1 }, { p: d.q, m: 1 }); ok = true; break; } } if (!ok) out.push({ p: q, m: 1 }); }
      else out.push({ p: q, m: 1 });
    }
    return { constante: c, factores: out };
  }

  AC.poly = { fromAst, norm, de, grado, lider, esCero, add, neg, sub, mul, esc, igual, evalua, deriv, monico, divmod, mcd, horner, str, tex, parse, candidatos, raicesRacionales, multiplicidad, irreducibleQ, irreducibleR, irreducibleC, factorizarQ, disc2, raizCuadradaRacional, aEnteros, divisoresAbs };
  if (typeof module !== 'undefined') module.exports = AC;
})(globalThis.AC = globalThis.AC || {});
