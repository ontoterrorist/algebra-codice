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
