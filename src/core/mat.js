/* Matrices sobre ℚ (arreglos de filas de Rat): operaciones, escalonamiento con registro de pasos, rango, inversa, determinante,
   núcleo y resolución de sistemas. Es la base de los Mundos 4 a 7. */
(function (AC) {
  const Rat = AC.Rat, cero = Rat.of(0), uno = Rat.of(1);
  const q = x => (x instanceof Rat ? x : Rat.of(x));
  const de = filas => filas.map(f => f.map(q));
  const dims = A => [A.length, A.length ? A[0].length : 0];
  const copia = A => A.map(f => f.slice());
  const id = n => Array.from({ length: n }, (_, i) => Array.from({ length: n }, (_, j) => (i === j ? uno : cero)));
  const ceros = (m, n) => Array.from({ length: m }, () => Array.from({ length: n }, () => cero));
  const igual = (A, B) => A.length === B.length && A.every((f, i) => f.length === B[i].length && f.every((x, j) => x.eq(B[i][j])));
  const add = (A, B) => A.map((f, i) => f.map((x, j) => x.add(B[i][j])));
  const sub = (A, B) => A.map((f, i) => f.map((x, j) => x.sub(B[i][j])));
  const esc = (A, c) => A.map(f => f.map(x => x.mul(q(c))));
  const T = A => (A.length ? A[0].map((_, j) => A.map(f => f[j])) : []);
  const mul = (A, B) => { const [m, n] = dims(A), p = dims(B)[1]; return Array.from({ length: m }, (_, i) => Array.from({ length: p }, (_, j) => { let s = cero; for (let k = 0; k < n; k++) s = s.add(A[i][k].mul(B[k][j])); return s; })); };
  const pot = (A, k) => { let r = id(A.length); for (let i = 0; i < k; i++) r = mul(r, A); return r; };
  const traza = A => A.reduce((s, f, i) => s.add(f[i]), cero);
  const colVec = v => v.map(x => [q(x)]);
  const aVec = M => M.map(f => f[0]);

  /* escalonamiento reducido de Gauss-Jordan; registra cada operación elemental: {t:'swap',i,j} {t:'esc',i,c} {t:'suma',i,j,c} (fila i += c·fila j) */
  function rref(A0, ncolsPivote) {
    const A = copia(A0), [m, n] = dims(A), lim = ncolsPivote === undefined ? n : ncolsPivote, pasos = [], piv = [];
    let r = 0;
    for (let c = 0; c < lim && r < m; c++) {
      let p = -1; for (let i = r; i < m; i++) if (!A[i][c].isZero()) { p = i; break; }
      if (p < 0) continue;
      if (p !== r) { [A[p], A[r]] = [A[r], A[p]]; pasos.push({ t: 'swap', i: r, j: p }); }
      const d = A[r][c]; if (!d.eq(uno)) { A[r] = A[r].map(x => x.div(d)); pasos.push({ t: 'esc', i: r, c: uno.div(d) }); }
      for (let i = 0; i < m; i++) if (i !== r && !A[i][c].isZero()) { const f = A[i][c].neg(); A[i] = A[i].map((x, j) => x.add(f.mul(A[r][j]))); pasos.push({ t: 'suma', i, j: r, c: f }); }
      piv.push(c); r++;
    }
    return { R: A, pivotes: piv, rango: piv.length, pasos };
  }
  const rango = A => rref(A).rango;

  /* inversa por [A | I] → [I | A⁻¹]; null si es singular */
  function inversa(A) {
    const n = A.length; if (!n || A[0].length !== n) return null;
    const aug = A.map((f, i) => f.concat(id(n)[i])), { R, pivotes } = rref(aug, n);
    if (pivotes.length < n) return null;
    return R.map(f => f.slice(n));
  }

  /* determinante por eliminación (exacto en ℚ) */
  function det(A) {
    const M = copia(A), n = M.length; let d = uno;
    for (let c = 0; c < n; c++) {
      let p = -1; for (let i = c; i < n; i++) if (!M[i][c].isZero()) { p = i; break; }
      if (p < 0) return cero;
      if (p !== c) { [M[p], M[c]] = [M[c], M[p]]; d = d.neg(); }
      d = d.mul(M[c][c]);
      for (let i = c + 1; i < n; i++) { const f = M[i][c].div(M[c][c]); if (!f.isZero()) M[i] = M[i].map((x, j) => x.sub(f.mul(M[c][j]))); }
    }
    return d;
  }
  const menor = (A, i, j) => A.filter((_, k) => k !== i).map(f => f.filter((_, k) => k !== j));
  const cofactor = (A, i, j) => { const d = det(menor(A, i, j)); return (i + j) % 2 ? d.neg() : d; };
  const adjunta = A => T(A.map((f, i) => f.map((_, j) => cofactor(A, i, j))));

  /* base del núcleo {x : Ax = 0}: un vector por variable libre */
  function nucleo(A) {
    const n = dims(A)[1], { R, pivotes } = rref(A), libres = []; for (let c = 0; c < n; c++) if (!pivotes.includes(c)) libres.push(c);
    return libres.map(l => { const v = Array.from({ length: n }, () => cero); v[l] = uno; pivotes.forEach((pc, r) => { v[pc] = R[r][l].neg(); }); return v; });
  }

  /* Ax = b: {tipo:'unica', x} | {tipo:'infinita', particular, base, libres} | {tipo:'incompatible'} */
  function resolver(A, b) {
    const n = dims(A)[1], aug = A.map((f, i) => f.concat([q(b[i])])), { R, pivotes } = rref(aug, n), rA = pivotes.length;
    const incompatible = R.some(f => f.slice(0, n).every(x => x.isZero()) && !f[n].isZero());
    if (incompatible) return { tipo: 'incompatible', rangoA: rA };
    const part = Array.from({ length: n }, () => cero); pivotes.forEach((pc, r) => { part[pc] = R[r][n]; });
    if (rA === n) return { tipo: 'unica', x: part };
    return { tipo: 'infinita', particular: part, base: nucleo(A), libres: n - rA };
  }
  const evaluaSistema = (A, x) => aVec(mul(A, colVec(x)));

  /* texto */
  const fmt = A => A.map(f => f.map(x => x.toString()));
  const texN = x => (x.isInt() ? String(x.n) : (x.n < 0n ? '-' : '') + '\\tfrac{' + (x.n < 0n ? -x.n : x.n) + '}{' + x.d + '}');
  const tex = (A, entorno) => '\\begin{' + (entorno || 'pmatrix') + '}' + A.map(f => f.map(texN).join('&')).join('\\\\') + '\\end{' + (entorno || 'pmatrix') + '}';
  const texVec = v => tex(colVec(v));
  const texAum = (A, b) => '\\left(\\begin{array}{' + 'c'.repeat(dims(A)[1]) + '|c}' + A.map((f, i) => f.map(texN).concat([texN(q(b[i]))]).join('&')).join('\\\\') + '\\end{array}\\right)';
  const texSistema = (A, b, vars) => { vars = vars || ['x', 'y', 'z', 'w']; return '\\begin{cases}' + A.map((f, i) => { let s = ''; f.forEach((c, j) => { if (c.isZero()) return; const neg = c.cmp(cero) < 0, a = neg ? c.neg() : c, cs = a.eq(uno) ? '' : texN(a); s += (s ? (neg ? '-' : '+') : (neg ? '-' : '')) + cs + vars[j]; }); return (s || '0') + '=' + texN(q(b[i])); }).join('\\\\') + '\\end{cases}'; };
  const parsea = txt => { try { const f = String(txt).trim().split(/\s*;\s*/).map(r => r.split(/[\s,]+/).filter(Boolean).map(s => Rat.parse(s))); return f.every(r => r.length === f[0].length && r.every(Boolean)) ? f : null; } catch (e) { return null; } };

  /* espacios vectoriales (vectores = arreglos de Rat) */
  const independientes = vs => rango(vs) === vs.length;
  const combina = (coefs, vs) => vs[0].map((_, j) => coefs.reduce((s, c, i) => s.add(q(c).mul(vs[i][j])), cero));
  /* coordenadas de v respecto de la base bs (lista de vectores): null si v no está en el generado */
  const coordenadas = (bs, v) => { const s = resolver(T(bs), v); return s.tipo === 'unica' ? s.x : (s.tipo === 'infinita' ? s.particular : null); };
  const enGenerado = (vs, v) => resolver(T(vs), v).tipo !== 'incompatible';
  const baseColumnas = A => { const { pivotes } = rref(A); return pivotes.map(c => A.map(f => f[c])); };
  const cambioBase = (B, C) => T(B.map(b => coordenadas(C, b)));

  AC.mat = { independientes, combina, coordenadas, enGenerado, baseColumnas, cambioBase, q, de, dims, copia, id, ceros, igual, add, sub, esc, T, mul, pot, traza, colVec, aVec, rref, rango, inversa, det, menor, cofactor, adjunta, nucleo, resolver, evaluaSistema, fmt, tex, texN, texVec, texAum, texSistema, parsea };
  if (typeof module !== 'undefined') module.exports = AC;
})(globalThis.AC = globalThis.AC || {});
