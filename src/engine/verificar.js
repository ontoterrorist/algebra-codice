/* Verificadores: cada ejercicio declara el suyo (inst.verificador = {id, args}). Datos puros, sin DOM. */
(function (AC) {
  const L = AC.logic, Rat = AC.Rat;
  const verif = AC.verif = {};

  function leerFormula(s) {
    try { return { f: L.parse(s) }; } catch (e) { return { error: e.msg ? e : { msg: String(e), pos: 0 } }; }
  }

  verif['tabla-de-verdad'] = (inst, resp, a) => {
    const exp = a.esperado;
    if (!Array.isArray(resp) || resp.length !== exp.length || resp.some(x => x !== true && x !== false))
      return { ok: false, incompleta: true, msg: 'Completa todas las filas antes de comprobar.' };
    const det = exp.map((e, i) => resp[i] === e);
    const ok = det.every(Boolean);
    return { ok, detalle: det, msg: ok ? 'Tabla correcta.' : 'Hay ' + det.filter(x => !x).length + ' fila(s) mal.' };
  };

  function numero(inst, resp, a, soloEntero) {
    const r = Rat.parse(String(resp == null ? '' : resp));
    if (!r) return { ok: false, sintaxis: true, msg: 'No entiendo ese número. Escribe un entero o una fracción (3/8, 0,375 o 0.375).' };
    if (soloEntero && !r.isInt()) return { ok: false, msg: 'Aquí la respuesta es un número entero.' };
    const ok = r.eq(Rat.parse(String(a.esperado)));
    return { ok, msg: ok ? 'Correcto.' : 'No coincide.' };
  }
  verif['entero'] = (inst, resp, a) => numero(inst, resp, a, true);
  verif['racional'] = (inst, resp, a) => numero(inst, resp, a, false);

  verif['equivalente-logica'] = (inst, resp, a) => {
    const g = leerFormula(String(resp || ''));
    if (g.error) return { ok: false, sintaxis: true, msg: g.error.msg, pos: g.error.pos };
    const f = L.parse(a.f);
    if (!L.equiv(f, g.f)) return { ok: false, msg: 'Tu fórmula no es equivalente a lo que se pide.' };
    if (a.forma === 'fnn' && !L.esFNN(g.f)) {
      return { ok: false, equivalente: true, msg: 'Es equivalente, pero no está en la forma pedida: la negación solo puede afectar a letras (y sin → ni ↔).' };
    }
    return { ok: true, msg: 'Correcto.' };
  };

  verif['indice'] = (inst, resp, a) => {
    if (resp === null || resp === undefined) return { ok: false, incompleta: true, msg: 'Elige una opción.' };
    const ok = resp === a.esperado;
    return { ok, msg: ok ? 'Correcto.' : 'Esa no es.' };
  };

  verif['conjunto-indices'] = (inst, resp, a) => {
    const r = (resp || []).slice().sort((x, y) => x - y), e = a.esperado.slice().sort((x, y) => x - y);
    const ok = r.length === e.length && r.every((x, i) => x === e[i]);
    const det = a.n ? Array.from({ length: a.n }, (_, i) => r.includes(i) === e.includes(i)) : null;
    return { ok, detalle: det, msg: ok ? 'Correcto.' : 'La selección no es la correcta.' };
  };

  /* Procedimiento: cada paso es {ley, ruta}; el juego aplica la reescritura. Vale cualquier ruta que llegue a la meta. */
  verif['ruta-valida'] = (inst, resp, a) => {
    let f = L.parse(a.inicio);
    const pasos = resp || [];
    for (let i = 0; i < pasos.length; i++) {
      const p = pasos[i];
      if (!a.leyes.includes(p.ley)) return { ok: false, msg: 'Paso ' + (i + 1) + ': esa ley todavía no está en tu Códice.' };
      const g = L.aplicar(f, p.ruta, p.ley);
      if (!g) return { ok: false, msg: 'Paso ' + (i + 1) + ' no se puede aplicar.' };
      f = g;
    }
    const final = L.str(f);
    if (!L.esFNN(f)) return { ok: false, incompleta: true, final, msg: 'Aún quedan implicaciones o negaciones sobre fórmulas compuestas.' };
    if (pasos.length > a.maxPasos) return { ok: false, final, msg: 'Llegaste, pero con ' + pasos.length + ' pasos; hay un camino de ' + a.optimo + '.' };
    return { ok: true, final, msg: 'Llegaste a la forma pedida en ' + pasos.length + ' pasos (el mínimo es ' + a.optimo + ').' };
  };

  verif['asignacion'] = (inst, resp, a) => {
    const f = L.parse(a.f), g = L.parse(a.g);
    const env = {}; a.vars.forEach(v => { env[v] = !!(resp || {})[v]; });
    const vf = L.ev(f, env), vg = L.ev(g, env);
    const ok = vf !== vg;
    return { ok, msg: ok ? 'Con esos valores las dos fórmulas difieren: contraejemplo válido.' : 'Con esos valores las dos fórmulas valen lo mismo (' + (vf ? 'V' : 'F') + '): no es un contraejemplo.' };
  };

  verif['matriz'] = (inst, resp, a) => {
    const e = a.esperado;
    if (!Array.isArray(resp) || resp.length !== e.length) return { ok: false, incompleta: true, msg: 'Completa la matriz.' };
    const det = e.map((fila, i) => fila.map((x, j) => { const r = Rat.parse(String((resp[i] || [])[j] || '')); return !!r && r.eq(Rat.parse(String(x))); }));
    const ok = det.every(f => f.every(Boolean));
    return { ok, detalle: det, msg: ok ? 'Correcto.' : 'Hay entradas incorrectas.' };
  };

  verif['vf-justificado'] = (inst, resp, a) => {
    if (!resp || resp.valor === null || resp.valor === undefined || resp.just === null || resp.just === undefined) return { ok: false, incompleta: true, msg: 'Elige verdadero o falso y una justificación.' };
    const v = resp.valor === a.valor, j = resp.just === a.just;
    return { ok: v && j, parcial: v && !j, msg: v && j ? 'Correcto.' : v ? 'El valor es correcto, pero la justificación no.' : 'El valor de verdad no es el correcto.' };
  };

  verif['autoevaluacion'] = (inst, resp, a) => {
    const ch = (resp && resp.checks) || [];
    const n = a.criterios.length, k = ch.filter(Boolean).length;
    return { ok: k === n, parcial: k >= n / 2 && k < n, autoeval: true, msg: k + ' de ' + n + ' criterios cumplidos.' };
  };


  /* conjuntos (fichas): «{1, 2}», «1,2», «∅» */
  verif['igual-conjunto'] = (inst, resp, a) => {
    const r = AC.conj.parse(resp);
    if (r === null) return { ok: false, sintaxis: true, msg: 'No entiendo ese conjunto. Escribe sus elementos separados por comas, por ejemplo {1, 2, 5}, o ∅ si es vacío.' };
    const ok = AC.conj.eq(r, a.esperado);
    return { ok, msg: ok ? 'Correcto.' : (r.length === a.esperado.length ? 'Tienes el mismo número de elementos, pero no son los mismos.' : 'El conjunto no coincide.') };
  };

  /* expresiones algebraicas: equivalencia exacta como funciones racionales */
  verif['equivalente-expr'] = (inst, resp, a) => {
    let g;
    try { g = AC.expr.parse(String(resp || '')); } catch (e) { return { ok: false, sintaxis: true, msg: e.msg || 'Expresión no válida', pos: e.pos }; }
    let ok;
    try { ok = AC.expr.F.igual(AC.expr.aF(g), AC.expr.aF(AC.expr.parse(a.f))); } catch (e) { return { ok: false, sintaxis: true, msg: e.msg || 'Expresión no válida' }; }
    return { ok, msg: ok ? 'Correcto: tu expresión es equivalente.' : 'Tu expresión no es equivalente a la que se pide.' };
  };

  verif['equivalente-complejo'] = (inst, resp, a) => {
    const z = AC.cx.parse(String(resp == null ? '' : resp));
    if (!z) return { ok: false, sintaxis: true, msg: 'Escribe un número complejo, por ejemplo 3-2i, i o (1+i)/2.' };
    const ok = z.eq(AC.cx.parse(a.f));
    return { ok, msg: ok ? 'Correcto.' : 'Ese complejo no coincide.' };
  };

  verif['tupla-racional'] = (inst, resp, a) => {
    const v = (resp || []).map(x => Rat.parse(String(x == null ? '' : x)));
    if (v.length !== a.esperado.length || v.some(x => !x)) return { ok: false, sintaxis: true, msg: 'Completa todos los campos con números (enteros, fracciones o decimales).' };
    const det = a.esperado.map((e, i) => { const d = v[i].sub(Rat.parse(e)); const m = a.mod && a.mod[i]; return m ? d.div(Rat.of(m)).isInt() : d.isZero(); });
    const ok = det.every(Boolean);
    return { ok, detalle: det, msg: ok ? 'Correcto.' : 'Hay ' + det.filter(x => !x).length + ' campo(s) que no coinciden.' };
  };

  /* factorización completa: producto de factores irreducibles en el cuerpo indicado (Q, R o C) que reproduce el polinomio */
  verif['factorizacion'] = (inst, resp, a) => {
    let ast;
    try { ast = AC.expr.parse(String(resp == null ? '' : resp)); } catch (e) { return { ok: false, sintaxis: true, msg: e.msg || 'Expresión no válida', pos: e.pos }; }
    const P = AC.poly, fs = []; let c = Rat.of(1), malo = false;
    (function rec(e) { if (e.t === '*') { rec(e.a); rec(e.b); } else if (e.t === '^') { for (let i = 0; i < e.e; i++) rec(e.a); } else if (e.t === 'neg') { c = c.neg(); rec(e.a); } else { const p = P.fromAst(e, a.v || 'x'); if (!p) malo = true; else if (P.grado(p) <= 0) c = c.mul(p[0] || Rat.of(0)); else fs.push(p); } })(ast);
    if (malo) return { ok: false, sintaxis: true, msg: 'Escribe un producto de polinomios en ' + (a.v || 'x') + ', por ejemplo (x-1)(x^2+x+1).' };
    const prod = fs.reduce((q, p) => P.mul(q, p), [c]), meta = P.parse(a.f, a.v || 'x');
    if (!P.igual(prod, meta)) return { ok: false, msg: 'El producto de tus factores no es el polinomio dado.' };
    const irr = { Q: P.irreducibleQ, R: P.irreducibleR, C: P.irreducibleC }[a.campo || 'Q'];
    const mal = fs.find(p => irr(p) === false);
    if (mal) return { ok: false, equivalente: true, msg: 'Es equivalente, pero el factor «' + P.str(mal, a.v || 'x') + '» todavía se puede factorizar' + ({ Q: ' en ℚ', R: ' en ℝ', C: ' en ℂ' }[a.campo || 'Q']) + '.' };
    return { ok: true, msg: 'Correcto: factorización completa.' };
  };

  /* a·x + b·y = d con enteros: vale cualquier par (Bézout, diofánticas) */
  verif['combinacion-lineal'] = (inst, resp, a) => {
    const v = (resp || []).map(x => Rat.parse(String(x == null ? '' : x)));
    if (v.length !== 2 || v.some(x => !x || !x.isInt())) return { ok: false, sintaxis: true, msg: 'Escribe dos números enteros.' };
    const val = Number(v[0].n) * a.a + Number(v[1].n) * a.b, ok = val === a.d;
    return { ok, msg: ok ? 'Correcto: ' + a.a + '·(' + v[0] + ') + ' + a.b + '·(' + v[1] + ') = ' + a.d + '.' : 'Con esos valores sale ' + a.a + '·(' + v[0] + ') + ' + a.b + '·(' + v[1] + ') = ' + val + ', no ' + a.d + '.' };
  };

  /* ---- espacios vectoriales: respuestas con muchas soluciones válidas ---- */
  const aVecQ = r => (r || []).map(x => Rat.parse(String(x == null ? '' : x)));
  const aMatQ = A => A.map(f => f.map(x => Rat.parse(String(x))));
  verif['nucleo-vector'] = (inst, resp, a) => {
    const v = aVecQ(resp);
    if (v.length !== a.n || v.some(x => !x)) return { ok: false, sintaxis: true, msg: 'Completa todos los campos con números.' };
    if (v.every(x => x.isZero())) return { ok: false, msg: 'El vector cero siempre cumple la condición: busca uno distinto de cero.' };
    const y = AC.mat.evaluaSistema(aMatQ(a.A), v), ok = y.every(z => z.isZero());
    return { ok, msg: ok ? 'Correcto: ese vector cumple todas las condiciones.' : 'Ese vector no cumple todas las condiciones (sustitúyelo en cada ecuación).' };
  };
  verif['dependencia-lineal'] = (inst, resp, a) => {
    const c = aVecQ(resp);
    if (c.length !== a.vecs.length || c.some(x => !x)) return { ok: false, sintaxis: true, msg: 'Completa todos los coeficientes con números.' };
    if (c.every(x => x.isZero())) return { ok: false, msg: 'Con todos los coeficientes cero la combinación es trivial: busca coeficientes no todos nulos.' };
    const V = aMatQ(a.vecs), n = V[0].length; let ok = true;
    for (let j = 0; j < n; j++) { let t = Rat.of(0); V.forEach((f, i) => { t = t.add(c[i].mul(f[j])); }); if (!t.isZero()) ok = false; }
    return { ok, msg: ok ? 'Correcto: la combinación da el vector cero con coeficientes no nulos.' : 'Con esos coeficientes la combinación lineal no da el vector cero.' };
  };
  verif['base-nucleo'] = (inst, resp, a) => {
    if (!Array.isArray(resp) || resp.length !== a.dim) return { ok: false, incompleta: true, msg: 'Completa los ' + a.dim + ' vectores.' };
    const M = resp.map(f => aVecQ(f));
    if (M.some(f => f.length !== a.n || f.some(x => !x))) return { ok: false, sintaxis: true, msg: 'Completa todas las entradas con números.' };
    const A = aMatQ(a.A), dentro = M.every(v => AC.mat.evaluaSistema(A, v).every(z => z.isZero()));
    if (!dentro) return { ok: false, msg: 'Algún vector no cumple las ecuaciones del subespacio.' };
    if (AC.mat.rango(M) < a.dim) return { ok: false, msg: 'Los vectores son linealmente dependientes: una base necesita ' + a.dim + ' independientes.' };
    return { ok: true, msg: 'Correcto: son vectores del subespacio y linealmente independientes, tantos como la dimensión.' };
  };
  verif['completa-base'] = (inst, resp, a) => {
    const w = aVecQ(resp);
    if (w.length !== a.n || w.some(x => !x)) return { ok: false, sintaxis: true, msg: 'Completa todos los campos con números.' };
    const V = aMatQ(a.vecs), ok = AC.mat.rango(V.concat([w])) === V.length + 1;
    return { ok, msg: ok ? 'Correcto: añadir ese vector mantiene la independencia.' : 'Ese vector es combinación lineal de los dados: la lista seguiría siendo dependiente.' };
  };

  verif['matriz-diagonalizante'] = (inst, resp, a) => {
    if (!Array.isArray(resp) || resp.length !== a.n) return { ok: false, incompleta: true, msg: 'Completa la matriz.' };
    const P = resp.map(f => aVecQ(f));
    if (P.some(f => f.length !== a.n || f.some(x => !x))) return { ok: false, sintaxis: true, msg: 'Completa todas las entradas con números.' };
    const A = aMatQ(a.A);
    if (!AC.mat.inversa(P)) return { ok: false, msg: 'Las columnas de $P$ deben ser independientes: la matriz que escribiste no es invertible.' };
    const ok = AC.mat.diagonalizaCon(A, P);
    return { ok, msg: ok ? 'Correcto: con esa $P$, $P^{-1}AP$ es diagonal.' : 'Con esa $P$, $P^{-1}AP$ no es diagonal: las columnas deben ser vectores propios de $A$.' };
  };

  function conjuntoNorm(modo) {
    return (inst, resp, a) => {
      const t = AC.conj.parse(resp);
      if (t === null) return { ok: false, sintaxis: true, msg: 'Escribe los elementos entre llaves y separados por comas, o ∅.' };
      const n = AC.conj.normTokens(t, modo);
      if (n === null) return { ok: false, sintaxis: true, msg: modo === 'racional' ? 'Hay un elemento que no es un número (usa fracciones o decimales).' : 'Hay un elemento que no es un complejo (por ejemplo 1+i, -2i).' };
      const ok = AC.conj.eq(n, a.esperado);
      return { ok, msg: ok ? 'Correcto.' : (n.length === a.esperado.length ? 'Tienes el mismo número de elementos, pero no son los mismos.' : 'El conjunto no coincide.') };
    };
  }
  verif['conjunto-racionales'] = conjuntoNorm('racional');
  verif['conjunto-complejos'] = conjuntoNorm('complejo');

  /* contraejemplos: se evalúa la afirmación con el entero del jugador */
  AC.afirmaciones = AC.afirmaciones || {};
  verif['satisface-entero'] = (inst, resp, a) => {
    const r = Rat.parse(String(resp == null ? '' : resp));
    if (!r || !r.isInt()) return { ok: false, sintaxis: true, msg: 'Escribe un número entero.' };
    const n = Number(r.n);
    if (n < a.rango[0] || n > a.rango[1]) return { ok: false, msg: 'Elige un entero entre ' + a.rango[0] + ' y ' + a.rango[1] + '.' };
    const vale = AC.afirmaciones[a.id](n, a);
    return { ok: !vale, errorEncontrado: false, msg: vale ? 'Con n = ' + n + ' la afirmación se cumple: no la refuta.' : 'Con n = ' + n + ' la afirmación falla: es un contraejemplo válido.' };
  };

  AC.verificar = function (inst, resp) {
    const f = verif[inst.verificador.id];
    if (!f) throw new Error('verificador desconocido: ' + inst.verificador.id);
    return f(inst, resp, inst.verificador.args);
  };

  if (typeof module !== 'undefined') module.exports = AC;
})(globalThis.AC = globalThis.AC || {});
