/* Conjuntos, relaciones y funciones finitas. Los elementos son «fichas» (cadenas): enteros o letras; los pares se escriben (a,b). */
(function (AC) {
  const num = t => /^-?\d+$/.test(t);
  const cmp = (a, b) => (num(a) && num(b) ? Number(a) - Number(b) : a < b ? -1 : a > b ? 1 : 0);
  const norm = arr => [...new Set(arr.map(String))].sort(cmp);
  const clave = a => norm(a).join('\u0001');

  /* «{1, 2,3}», «1,2,3», «∅», «vacío», «{(1,2),(2,1)}» → fichas, o null si no se entiende */
  function parse(s) {
    s = String(s == null ? '' : s).trim().replace(/−/g, '-');
    if (/^(∅|\{\s*\}|vac[ií]o|\\varnothing)$/i.test(s)) return [];
    if (s.startsWith('{') && s.endsWith('}')) s = s.slice(1, -1);
    if (!s.trim()) return null;
    const out = []; let prof = 0, ini = 0;
    for (let i = 0; i <= s.length; i++) {
      const c = s[i];
      if (c === '(' || c === '{') prof++; else if (c === ')' || c === '}') { prof--; if (prof < 0) return null; }
      if ((c === ',' || c === ';' || i === s.length) && prof === 0) {
        const t = s.slice(ini, i).replace(/\s+/g, '');
        if (!t) return null;
        out.push(t.replace(/^\((.*)\)$/, (m, d) => (d.includes(',') ? '(' + d + ')' : d)));
        ini = i + 1;
      }
    }
    return prof === 0 ? norm(out) : null;
  }
  const fmt = a => (a.length ? '{' + norm(a).join(', ') + '}' : '∅');
  const tex = a => (a.length ? '\\{' + norm(a).join(',') + '\\}' : '\\varnothing');
  const eq = (a, b) => clave(a) === clave(b);
  const uni = (a, b) => norm(a.concat(b));
  const inter = (a, b) => norm(a.filter(x => b.includes(x)));
  const dif = (a, b) => norm(a.filter(x => !b.includes(x)));
  const comp = (U, a) => dif(U, a);
  const sub = (a, b) => a.every(x => b.includes(x));

  /* ---------- relaciones: lista de pares [x, y] sobre un universo U ---------- */
  const tiene = (R, x, y) => R.some(p => p[0] === x && p[1] === y);
  const rel = {
    reflexiva: (R, U) => U.every(x => tiene(R, x, x)),
    simetrica: (R) => R.every(([x, y]) => tiene(R, y, x)),
    antisimetrica: (R) => R.every(([x, y]) => x === y || !tiene(R, y, x)),
    transitiva: (R) => R.every(([x, y]) => R.every(([y2, z]) => y2 !== y || tiene(R, x, z))),
    /* testigos de que una propiedad falla (para mensajes específicos) */
    testigo: {
      reflexiva: (R, U) => { const x = U.find(u => !tiene(R, u, u)); return x === undefined ? null : [x, x]; },
      simetrica: (R) => { const p = R.find(([x, y]) => !tiene(R, y, x)); return p ? [p[1], p[0]] : null; },
      antisimetrica: (R) => R.find(([x, y]) => x !== y && tiene(R, y, x)) || null,
      transitiva: (R) => { for (const [x, y] of R) for (const [y2, z] of R) if (y2 === y && !tiene(R, x, z)) return [x, z]; return null; },
    },
    cierreEquivalencia(R, U) { // menor relación de equivalencia que contiene a R: pares ordenados
      const padre = {}; U.forEach(u => { padre[u] = u; });
      const f = x => (padre[x] === x ? x : (padre[x] = f(padre[x])));
      R.forEach(([x, y]) => { padre[f(x)] = f(y); });
      const out = []; U.forEach(x => U.forEach(y => { if (f(x) === f(y)) out.push([x, y]); }));
      return out;
    },
    clases(R, U) { const vistos = new Set(), out = []; U.forEach(x => { if (vistos.has(x)) return; const c = norm(U.filter(y => tiene(R, x, y))); c.forEach(y => vistos.add(y)); out.push(c); }); return out; },
    str: R => '{' + R.map(([x, y]) => '(' + x + ',' + y + ')').join(', ') + '}',
    tex: R => '\\{' + R.map(([x, y]) => '(' + x + ',' + y + ')').join(',') + '\\}',
  };

  /* ---------- funciones finitas: objeto {a: b} ---------- */
  const fun = {
    imagen: (f, S) => norm(S.map(x => f[x])),
    preimagen: (f, T) => norm(Object.keys(f).filter(x => T.includes(f[x]))),
    inyectiva: f => new Set(Object.values(f)).size === Object.keys(f).length,
    sobreyectiva: (f, B) => B.every(b => Object.values(f).includes(b)),
    str: f => Object.keys(f).map(x => x + '↦' + f[x]).join(', '),
  };

  /* normaliza fichas: 'racional' (2/4 → 1/2) o 'complejo' (i+1 → 1+i); devuelve null si alguna no se entiende */
  function normTokens(a, modo) {
    if (!modo) return norm(a);
    const f = modo === 'racional' ? t => { const r = AC.Rat.parse(String(t)); return r ? r.toString() : null; } : t => { const z = AC.cx.parse(String(t)); return z ? z.toString() : null; };
    const out = a.map(f); return out.some(x => x === null) ? null : norm(out);
  }
  AC.conj = { normTokens, norm, parse, fmt, tex, eq, uni, inter, dif, comp, sub, rel, fun, tiene, cmp };
  if (typeof module !== 'undefined') module.exports = AC;
})(globalThis.AC = globalThis.AC || {});
