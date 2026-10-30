/* Mundo 1, nivel 1.1 — Lógica proposicional: habilidades, teoremas, generadores de aplicación y práctica de equivalencias. */
(function (AC) {
  const L = AC.logic, R = AC.registrar;
  const { V, N, A, O, I, E } = L;
  const NOMBRES = [['P', 'Q', 'R'], ['A', 'B', 'C'], ['p', 'q', 'r'], ['S', 'T', 'U'], ['X', 'Y', 'Z']];
  const T = f => '$' + L.tex(f) + '$';
  const VF = b => (b ? 'V' : 'F');
  const dobleNeg = (f) => f.t === 'not' && f.a.t === 'not' ? dobleNeg(f.a.a) : f;
  const neg = f => (f.t === 'not' ? f.a : N(f));

  /* ---------- catálogo ---------- */
  const H = (id, nombre) => R.habilidad({ id: '1.1.' + id, nombre, nivel: '1.1' });
  H('tabla', 'Tablas de verdad'); H('equivalencia', 'Equivalencia lógica'); H('negacion', 'Negación y De Morgan');
  H('contrapositiva', 'Contrapositiva, recíproca e inversa'); H('simplificar', 'Reescritura paso a paso'); H('demostrar', 'Demostrar equivalencias');

  const TE = (id, titulo, enunciado, requiere, habilidades) => R.teorema({ id, titulo, nivel: '1.1', enunciado, requiere, habilidades });
  TE('t.demorgan-prop', 'Leyes de De Morgan', '$\\neg(P\\wedge Q)\\equiv\\neg P\\vee\\neg Q$ y $\\neg(P\\vee Q)\\equiv\\neg P\\wedge\\neg Q$.', [], ['1.1.negacion', '1.1.demostrar']);
  TE('t.contrapositiva', 'Contrapositiva', '$(P\\to Q)\\equiv(\\neg Q\\to\\neg P)$.', [], ['1.1.contrapositiva', '1.1.demostrar']);
  TE('t.neg-implicacion', 'Negación de una implicación', '$\\neg(P\\to Q)\\equiv P\\wedge\\neg Q$.', ['t.demorgan-prop'], ['1.1.negacion', '1.1.demostrar']);
  TE('t.silogismo-hipotetico', 'Silogismo hipotético', 'Si $P\\to Q$ y $Q\\to R$ son verdaderas, entonces $P\\to R$ es verdadera.', [], ['1.1.equivalencia', '1.1.demostrar']);
  TE('t.distrib-prop', 'Distributividad', '$P\\wedge(Q\\vee R)\\equiv(P\\wedge Q)\\vee(P\\wedge R)$ (y la dual con $\\vee$ y $\\wedge$ intercambiados).', [], ['1.1.equivalencia', '1.1.demostrar']);

  /* ---------- utilidades de formulas ---------- */
  function randF(rng, vs, ops) {
    ops = ops || ['and', 'or', 'imp', 'imp', 'and', 'or', 'iff'];
    for (let intento = 0; intento < 80; intento++) {
      const hojas = vs.map(v => rng.chance(0.3) ? N(V(v)) : V(v));
      if (rng.chance(0.35)) hojas.push(rng.chance(0.3) ? N(V(rng.pick(vs))) : V(rng.pick(vs)));
      const items = rng.shuffle(hojas);
      while (items.length > 1) {
        const i = rng.int(0, items.length - 2);
        items.splice(i, 2, { t: rng.pick(ops), a: items[i], b: items[i + 1] });
      }
      const f = items[0];
      if (L.tamano(f) > 12 || L.tamano(f) < 4) continue;
      if (L.tautologia(f) || L.contradiccion(f)) continue;
      if (L.vars(f).length !== vs.length) continue;
      if (vs.some(v => L.equiv(f, V(v)) || L.equiv(f, N(V(v))))) continue; // degenerada: equivale a una letra
      return f;
    }
    throw new Error('randF no encontró fórmula');
  }
  const hay = (f, t) => { let h = false; (function r(g) { if (g.t === t) h = true; if (g.a) r(g.a); if (g.b) r(g.b); })(f); return h; };
  /* errores típicos al leer o evaluar una fórmula */
  function mutaciones(f) {
    const out = [];
    if (hay(f, 'imp')) {
      out.push({ id: 'imp-invertida', f2: L.mapa(f, g => g.t === 'imp' ? I(g.b, g.a) : g), mensaje: 'Leíste «A→B» al revés, como «B→A». Recuerda: A→B solo es falsa cuando A es verdadera y B es falsa.' });
      out.push({ id: 'imp-como-iff', f2: L.mapa(f, g => g.t === 'imp' ? E(g.a, g.b) : g), mensaje: 'Trataste «→» como «↔». En A→B, si A es falsa la implicación es verdadera sea cual sea B.' });
    }
    if (hay(f, 'or')) out.push({ id: 'o-exclusivo', f2: L.mapa(f, g => g.t === 'or' ? N(E(g.a, g.b)) : g), mensaje: 'Usaste el «o» exclusivo. En lógica, A∨B también es verdadera cuando ambas lo son.' });
    if (hay(f, 'and') && hay(f, 'or')) out.push({ id: 'y-por-o', f2: L.mapa(f, g => g.t === 'and' ? O(g.a, g.b) : g.t === 'or' ? A(g.a, g.b) : g), mensaje: 'Confundiste ∧ con ∨: ∧ pide que ambas sean verdaderas; ∨, que al menos una lo sea.' });
    if (hay(f, 'not')) out.push({ id: 'sin-negacion', f2: L.mapa(f, g => g.t === 'not' && g.a.t === 'v' ? g.a : g), mensaje: 'Se te pasó alguna negación sobre una letra: ¬P vale lo contrario de P en cada fila.' });
    return out;
  }
  function renombrarConjunto(rng, f) { // pasa de P,Q,R a otro juego de letras
    const set = rng.pick(NOMBRES), base = ['P', 'Q', 'R'];
    const m = {}; base.forEach((b, i) => { m[b] = set[i]; });
    return L.renombrar(f, m);
  }
  const col = (f, vs) => L.tabla(f, vs).map(VF).join(' ');

  /* ---------- 1. tabla de verdad (grilla V/F) ---------- */
  R.generador({
    id: 'w1.n1.tabla-de-verdad', mundo: 1, nivel: '1.1', familia: 'aplicacion', habilidades: ['1.1.tabla'], dificultad: 1, autoexplicacion: null,
    generar(rng) {
      const nv = rng.chance(0.35) ? 3 : 2;
      const vs = rng.pick(NOMBRES).slice(0, nv);
      const f = randF(rng, vs);
      const esperado = L.tabla(f, vs);
      const firmas = mutaciones(f).map(m => ({ id: m.id, respuesta: L.tabla(m.f2, vs), mensaje: m.mensaje }))
        .filter((s, i, a) => s.respuesta.join() !== esperado.join() && a.findIndex(x => x.respuesta.join() === s.respuesta.join()) === i);
      return {
        variantKey: L.str(f),
        enunciado: 'Completa la columna de la fórmula ' + T(f) + ' en su tabla de verdad. (Haz clic en cada celda para alternar V y F.)',
        entrada: { tipo: 'tabla', vars: vs, filas: L.envs(vs).map(e => vs.map(v => e[v])), formulaTex: L.tex(f) },
        verificador: { id: 'tabla-de-verdad', args: { esperado } },
        firmas,
        pistas: ['Orientación: evalúa la fórmula fila por fila, de adentro hacia afuera.', 'Idea clave: calcula primero las negaciones y los paréntesis más internos; «→» solo es falsa con V seguido de F.', 'Primer paso: en la primera fila todas las letras son V; sustituye y reduce.'],
        explicacion: 'Columna correcta (de arriba abajo): ' + col(f, vs) + '.',
      };
    },
  });

  /* ---------- 2. contar modelos (entero o fracción) ---------- */
  R.generador({
    id: 'w1.n1.contar-modelos', mundo: 1, nivel: '1.1', familia: 'aplicacion', habilidades: ['1.1.tabla'], dificultad: 2, autoexplicacion: null,
    generar(rng) {
      const nv = rng.chance(0.7) ? 3 : 2;
      const vs = rng.pick(NOMBRES).slice(0, nv);
      let f; do { f = randF(rng, vs); } while (L.modelos(f, vs) === 0 || L.modelos(f, vs) === (1 << nv));
      const filas = 1 << nv, k = L.modelos(f, vs);
      const pregunta = rng.chance(0.5) ? 'cuantas' : 'fraccion';
      const comp = filas - k;
      const val = x => pregunta === 'cuantas' ? String(x) : new AC.Rat(x, filas).toString();
      const ya = new Set([val(k)]);
      const firmas = [];
      if (!ya.has(val(comp))) { firmas.push({ id: 'cuenta-las-falsas', respuesta: val(comp), mensaje: 'Contaste las filas en que la fórmula es FALSA en vez de las verdaderas.' }); ya.add(val(comp)); }
      mutaciones(f).forEach(m => { const x = val(L.modelos(m.f2, vs)); if (!ya.has(x)) { ya.add(x); firmas.push({ id: m.id, respuesta: x, mensaje: m.mensaje }); } });
      return {
        variantKey: pregunta + '|' + L.str(f),
        enunciado: pregunta === 'cuantas'
          ? 'Para la fórmula ' + T(f) + ', ¿en cuántas filas de su tabla de verdad es verdadera?'
          : 'Para la fórmula ' + T(f) + ', ¿qué fracción de las filas de su tabla de verdad la hacen verdadera? (Escribe una fracción o un decimal.)',
        entrada: { tipo: pregunta === 'cuantas' ? 'entero' : 'racional' },
        verificador: { id: pregunta === 'cuantas' ? 'entero' : 'racional', args: { esperado: val(k) } },
        solucionTexto: [val(k)],
        firmas,
        pistas: ['Orientación: construye la tabla completa; no hace falta escribirla, pero sí evaluar todas las filas.', 'Idea clave: evalúa por filas y cuenta; revisa cada «→» y cada negación con cuidado.', 'Primer paso: con todas las letras verdaderas, ¿qué valor toma la fórmula?'],
        explicacion: 'Columna: ' + col(f, vs) + '. Hay ' + k + ' filas verdaderas de ' + filas + (pregunta === 'fraccion' ? ', es decir ' + val(k) + '.' : '.'),
      };
    },
  });

  /* ---------- 3. negar una fórmula (escribir expresión lógica) ---------- */
  function nnf(f, ng) {
    switch (f.t) {
      case 'v': return ng ? N(f) : f;
      case 'not': return nnf(f.a, !ng);
      case 'and': return ng ? O(nnf(f.a, true), nnf(f.b, true)) : A(nnf(f.a, false), nnf(f.b, false));
      case 'or': return ng ? A(nnf(f.a, true), nnf(f.b, true)) : O(nnf(f.a, false), nnf(f.b, false));
      case 'imp': return ng ? A(nnf(f.a, false), nnf(f.b, true)) : O(nnf(f.a, true), nnf(f.b, false));
      case 'iff': return ng ? O(A(nnf(f.a, false), nnf(f.b, true)), A(nnf(f.a, true), nnf(f.b, false))) : A(O(nnf(f.a, true), nnf(f.b, false)), O(nnf(f.a, false), nnf(f.b, true)));
    }
  }
  AC.w1 = { NOMBRES, randF, mutaciones, nnf, renombrarConjunto, hay, T, col, dobleNeg, neg };

  R.generador({
    id: 'w1.n1.negar-formula', mundo: 1, nivel: '1.1', familia: 'aplicacion', habilidades: ['1.1.negacion'], dificultad: 2, autoexplicacion: 'negar-metodo',
    generar(rng) {
      const nv = rng.chance(0.75) ? 2 : 3;
      const vs = rng.pick(NOMBRES).slice(0, nv);
      let f;
      do { f = randF(rng, vs, ['and', 'or', 'imp', 'imp', 'and', 'or']); } while (!['and', 'or', 'imp'].includes(f.t) || L.tamano(f) > 9);
      const correcta = nnf(f, true);
      const firmas = [];
      const mal = (id, g, mensaje) => { if (g && !L.equiv(g, N(f))) firmas.push({ id, respuesta: L.str(g), mensaje }); };
      const n = x => nnf(x, true);
      if (f.t === 'and') mal('demorgan-sin-cambiar', A(n(f.a), n(f.b)), 'Al negar una conjunción el conector cambia: ¬(A∧B) equivale a ¬A∨¬B, no a ¬A∧¬B.');
      if (f.t === 'or') mal('demorgan-sin-cambiar', O(n(f.a), n(f.b)), 'Al negar una disyunción el conector cambia: ¬(A∨B) equivale a ¬A∧¬B, no a ¬A∨¬B.');
      if (f.t === 'imp') {
        mal('neg-ambos-lados', I(n(f.a), n(f.b)), 'Negar una implicación no es negar sus dos partes (esa es la inversa): ¬(A→B) equivale a A∧¬B.');
        mal('neg-implicacion-como-implicacion', I(f.a, n(f.b)), 'La negación de «A→B» no es otra implicación: A→B solo falla cuando A es verdadera y B falsa, es decir A∧¬B.');
      }
      return {
        variantKey: L.str(f),
        enunciado: 'Escribe una fórmula equivalente a ' + T(N(f)) + ' en la que la negación aparezca solo delante de letras (y sin usar → ni ↔).',
        entrada: { tipo: 'logica', vars: vs },
        verificador: { id: 'equivalente-logica', args: { f: L.str(N(f)), forma: 'fnn' } },
        solucionTexto: [L.tex(correcta)],
        solucionLogica: L.str(correcta),
        firmas,
        pistas: ['Orientación: ¿qué ley te dice cómo se niega un ∧, un ∨ o un →?', 'Idea clave: De Morgan cambia el conector y niega las partes; ¬(A→B) equivale a A∧¬B.', 'Primer paso: identifica el conector principal de ' + L.str(f) + ' y niégalo con la ley que le corresponde.'],
        explicacion: 'Una respuesta correcta es ' + T(correcta) + '.',
      };
    },
  });

  R.banco('negar-metodo', {
    pregunta: '¿Por qué funcionó el método?',
    opciones: [
      { texto: 'Cada ley (De Morgan, negación de →) es una equivalencia, así que cada paso conserva la tabla de verdad.', correcta: true },
      { texto: 'Porque negar una fórmula es lo mismo que negar cada una de sus letras.', correcta: false },
      { texto: 'Porque al negar siempre se cambian todos los conectivos por su contrario.', correcta: false },
      { texto: 'Porque las negaciones se pueden mover libremente de un lugar a otro.', correcta: false },
    ],
  });

  /* ---------- 4. contrapositiva, recíproca e inversa (elección) ---------- */
  const PARES = [
    { a: '$n$ es múltiplo de 4', na: '$n$ no es múltiplo de 4', b: '$n$ es par', nb: '$n$ es impar' },
    { a: 'llueve', na: 'no llueve', b: 'el suelo está mojado', nb: 'el suelo no está mojado' },
    { a: 'la figura es un cuadrado', na: 'la figura no es un cuadrado', b: 'la figura tiene cuatro lados', nb: 'la figura no tiene cuatro lados' },
    { a: '$p$ es un primo mayor que 2', na: '$p$ no es un primo mayor que 2', b: '$p$ es impar', nb: '$p$ es par' },
    { a: 'la función $f$ es derivable en $a$', na: 'la función $f$ no es derivable en $a$', b: '$f$ es continua en $a$', nb: '$f$ no es continua en $a$' },
    { a: '$x>2$', na: '$x\\le 2$', b: '$x^2>4$', nb: '$x^2\\le 4$' },
    { a: 'el triángulo es equilátero', na: 'el triángulo no es equilátero', b: 'el triángulo es isósceles', nb: 'el triángulo no es isósceles' },
    { a: 'el conjunto $S\\subseteq\\mathbb{R}$ es finito', na: '$S$ no es finito', b: '$S$ es acotado', nb: '$S$ no es acotado' },
  ];
  const cap = s => s.charAt(0).toUpperCase() + s.slice(1);
  R.generador({
    id: 'w1.n1.contrapositiva-reciproca', mundo: 1, nivel: '1.1', familia: 'aplicacion', habilidades: ['1.1.contrapositiva'], dificultad: 1, autoexplicacion: 'contrapositiva-metodo',
    generar(rng) {
      const simbolico = rng.chance(0.4);
      const ask = rng.pick(['contrapositiva', 'reciproca', 'inversa']);
      const na = rng.chance(0.3), nb = rng.chance(0.3);
      const flip = x => ({ neg: !x.neg }); // un literal es {neg}; negarlo lo invierte
      let item, fmtImp, fmtSwap, fmtCon;
      if (simbolico) {
        const set = rng.pick(NOMBRES), a = set[0], b = set[1];
        const lit = (nom, x) => (x.neg ? '\\neg ' : '') + nom;
        fmtImp = (X, Y) => '$' + lit(a, X) + ' \\to ' + lit(b, Y) + '$';
        fmtSwap = (X, Y) => '$' + lit(b, Y) + ' \\to ' + lit(a, X) + '$';
        fmtCon = (X, Y) => '$' + lit(a, X) + ' \\wedge ' + lit(b, flip(Y)) + '$';
        item = 'sim:' + a + b;
      } else {
        const idx = rng.int(0, PARES.length - 1), p = PARES[idx]; item = 'txt:' + idx;
        const t = (pos, x) => (x.neg ? p['n' + pos] : p[pos]);
        fmtImp = (X, Y) => 'Si ' + t('a', X) + ', entonces ' + t('b', Y) + '.';
        fmtSwap = (X, Y) => 'Si ' + t('b', Y) + ', entonces ' + t('a', X) + '.';
        fmtCon = (X, Y) => cap(t('a', X)) + ' y ' + t('b', flip(Y)) + '.';
      }
      const X = { neg: na }, Y = { neg: nb };
      const orig = fmtImp(X, Y);
      const formas = {
        reciproca: fmtSwap(X, Y),
        inversa: fmtImp(flip(X), flip(Y)),
        contrapositiva: fmtSwap(flip(X), flip(Y)),
        contradictoria: fmtCon(X, Y),
      };
      const correcta = formas[ask];
      const resto = Object.keys(formas).filter(k => k !== ask);
      const opciones = rng.shuffle([ask].concat(resto));
      const nombresMsg = {
        reciproca: 'Esa es la recíproca: intercambia hipótesis y conclusión, pero no equivale a la original.',
        inversa: 'Esa es la inversa: niega ambas partes pero no las intercambia, y no equivale a la original.',
        contrapositiva: 'Esa es la contrapositiva: intercambia y niega ambas partes (y sí equivale a la original). Aquí se pedía otra.',
        contradictoria: 'Esa es la negación de la implicación («A y no B»), no una de sus formas derivadas.',
      };
      const firmas = resto.map(k => ({ id: 'elige-' + k, respuesta: opciones.indexOf(k), mensaje: nombresMsg[k] }));
      return {
        variantKey: ask + '|' + item + '|' + (na ? 1 : 0) + (nb ? 1 : 0),
        enunciado: 'Dada la implicación ' + orig + ' ¿cuál es su ' + ask + '?',
        entrada: { tipo: 'eleccion', opciones: opciones.map(k => formas[k]) },
        verificador: { id: 'indice', args: { esperado: opciones.indexOf(ask) } },
        firmas,
        pistas: ['Orientación: recuerda qué hace cada forma con el orden y con las negaciones.', 'Idea clave: contrapositiva = intercambiar y negar; recíproca = solo intercambiar; inversa = solo negar.', 'Primer paso: identifica el antecedente y el consecuente de la implicación dada.'],
        explicacion: 'La ' + ask + ' es: ' + correcta + (ask === 'contrapositiva' ? ' Es la única, junto con la original, que siempre tiene su mismo valor de verdad.' : ''),
      };
    },
  });
  R.banco('contrapositiva-metodo', {
    pregunta: '¿Qué distingue a la contrapositiva de las otras formas?',
    opciones: [
      { texto: 'Es equivalente a la original: ambas son verdaderas o falsas a la vez.', correcta: true },
      { texto: 'Es equivalente a la recíproca, porque ambas intercambian las partes.', correcta: false },
      { texto: 'Es la negación de la original.', correcta: false },
      { texto: 'Es verdadera siempre que la original sea falsa.', correcta: false },
    ],
  });

  /* ---------- 5. reescritura paso a paso (procedimiento) ---------- */
  function minimoPasos(inicio, leyes, tope) {
    const vistos = new Set([L.str(inicio)]); let fr = [inicio];
    for (let d = 0; d <= tope; d++) {
      if (fr.some(L.esFNN)) return d;
      const sig = [];
      fr.forEach(f => L.reescrituras(f, leyes).forEach(r => { const g = L.aplicar(f, r.ruta, r.ley); const s = L.str(g); if (!vistos.has(s)) { vistos.add(s); sig.push(g); } }));
      fr = sig; if (!fr.length || vistos.size > 4000) break;
    }
    return null;
  }
  R.generador({
    id: 'w1.n1.simplificar-pasos', mundo: 1, nivel: '1.1', familia: 'aplicacion', habilidades: ['1.1.simplificar', '1.1.negacion'], requiere: ['t.demorgan-prop'], dificultad: 3, autoexplicacion: null, confianza: false,
    generar(rng, dif, ctx) {
      const codice = (ctx && ctx.codice) || ['t.demorgan-prop'];
      const leyes = ['def-imp', 'def-iff', 'dobleneg', 'demorgan'].concat(codice.includes('t.neg-implicacion') ? ['neg-imp'] : []);
      const vs = rng.pick(NOMBRES).slice(0, rng.chance(0.5) ? 2 : 3);
      let f, opt;
      for (let i = 0; i < 60; i++) {
        const g = randF(rng, vs, ['and', 'or', 'imp', 'imp', 'and', 'or']);
        if (L.tamano(g) > 9) continue;
        const h = rng.chance(0.6) ? N(g) : g;
        if (L.esFNN(h)) continue;
        const o = minimoPasos(h, leyes, 7);
        if (o && o >= 2 && o <= 6) { f = h; opt = o; break; }
      }
      if (!f) throw new Error('simplificar-pasos: sin fórmula adecuada');
      return {
        variantKey: L.str(f) + '|' + leyes.length,
        enunciado: 'Transforma ' + T(f) + ' en una fórmula equivalente donde las negaciones solo afecten a letras y no haya → ni ↔. Elige en cada paso la ley que aplicas y dónde; el juego hace la sustitución.',
        entrada: { tipo: 'procedimiento', inicio: L.str(f), leyes: leyes.map(id => ({ id, nombre: L.LEYES[id] })) },
        verificador: { id: 'ruta-valida', args: { inicio: L.str(f), leyes, maxPasos: opt + 4, optimo: opt } },
        firmas: [],
        pistas: ['Orientación: primero elimina → y ↔; después baja las negaciones hasta las letras.', 'Idea clave: la definición de → convierte A→B en ¬A∨B; De Morgan baja la negación; ¬¬A se simplifica.', 'Primer paso: busca la implicación o la negación más externa y aplícale su ley.'],
        explicacion: 'Hay un camino de ' + opt + ' pasos; el tuyo puede ser otro mientras llegue a la forma pedida.',
      };
    },
  });

  /* ---------- 6. fórmula equivalente (elección) ---------- */
  function equivalenteDe(rng, f) { // transformación que conserva la tabla de verdad
    const opciones = [];
    L.reescrituras(f, ['def-imp', 'dobleneg', 'demorgan', 'neg-imp']).forEach(r => opciones.push(() => L.aplicar(f, r.ruta, r.ley)));
    // contrapositiva de una implicación interna
    (function rec(g, ruta) {
      if (g.t === 'imp') opciones.push(() => en(f, ruta, I(neg(g.b), neg(g.a))));
      if (g.t === 'and' || g.t === 'or') opciones.push(() => en(f, ruta, { t: g.t, a: g.b, b: g.a }));
      if (g.t === 'not') rec(g.a, ruta.concat('a')); else if (g.t !== 'v') { rec(g.a, ruta.concat('a')); rec(g.b, ruta.concat('b')); }
    })(f, []);
    return rng.pick(opciones)();
  }
  function en(f, ruta, nuevo) {
    if (!ruta.length) return nuevo;
    const [h, ...r] = ruta;
    if (f.t === 'not') return N(en(f.a, r, nuevo));
    return h === 'a' ? { t: f.t, a: en(f.a, r, nuevo), b: f.b } : { t: f.t, a: f.a, b: en(f.b, r, nuevo) };
  }
  R.generador({
    id: 'w1.n1.equivalente-a', mundo: 1, nivel: '1.1', familia: 'aplicacion', habilidades: ['1.1.equivalencia'], dificultad: 2, autoexplicacion: null,
    generar(rng) {
      const vs = rng.pick(NOMBRES).slice(0, rng.chance(0.6) ? 2 : 3);
      for (let i = 0; i < 100; i++) {
        const f = randF(rng, vs, ['and', 'or', 'imp', 'imp', 'imp', 'and']);
        if (L.tamano(f) > 9) continue;
        let g; try { g = equivalenteDe(rng, f); } catch (e) { continue; }
        if (!L.equiv(f, g) || L.str(f) === L.str(g)) continue;
        const cand = [];
        mutaciones(f).forEach(m => cand.push({ id: m.id, f: m.f2, mensaje: m.mensaje }));
        mutaciones(g).forEach(m => cand.push({ id: m.id, f: m.f2, mensaje: m.mensaje }));
        cand.push({ id: 'neg-total', f: N(f), mensaje: 'Esa es la negación de la fórmula: vale lo contrario en cada fila.' });
        const malas = []; const vistas = new Set([L.str(f), L.str(g)]);
        rng.shuffle(cand).forEach(c => { const s = L.str(c.f); if (!vistas.has(s) && !L.equiv(c.f, f) && malas.length < 3) { vistas.add(s); malas.push(c); } });
        if (malas.length < 3) continue;
        const todas = rng.shuffle([{ id: 'ok', f: g }].concat(malas));
        const pos = todas.findIndex(x => x.id === 'ok');
        return {
          variantKey: L.str(f) + '→' + L.str(g),
          enunciado: '¿Cuál de estas fórmulas es equivalente a ' + T(f) + '?',
          entrada: { tipo: 'eleccion', opciones: todas.map(x => T(x.f)) },
          verificador: { id: 'indice', args: { esperado: pos } },
          firmas: todas.map((x, i) => x.id === 'ok' ? null : { id: x.id, respuesta: i, mensaje: x.mensaje }).filter(Boolean),
          pistas: ['Orientación: dos fórmulas son equivalentes si tienen la misma tabla de verdad.', 'Idea clave: prueba una fila donde la original sea falsa y descarta las opciones que ahí sean verdaderas.', 'Primer paso: evalúa la original con todas las letras verdaderas y después con todas falsas.'],
          explicacion: 'La equivalente es ' + T(g) + ': tiene la misma columna que ' + T(f) + ' (' + col(f, L.unionVars(f, g)) + ').',
        };
      }
      throw new Error('equivalente-a: sin instancia');
    },
  });

  /* ---------- 7. tautologías (selección múltiple) ---------- */
  const TAUTS = ['P→(Q→P)', '(P∧Q)→P', 'P∨¬P', '((P→Q)∧P)→Q', '¬(P∧¬P)', '(P→Q)↔(¬Q→¬P)', 'P→(P∨Q)', '((P→Q)∧(Q→R))→(P→R)'];
  const NOTAUTS = [
    ['(P→Q)→(Q→P)', 'Esa afirma que una implicación implica su recíproca, y no es una tautología.'],
    ['((P→Q)∧Q)→P', 'Eso es afirmar el consecuente: Q verdadera no obliga a que P lo sea.'],
    ['P→(P∧Q)', 'Falla cuando P es verdadera y Q falsa.'],
    ['(P∨Q)→P', 'Falla cuando solo Q es verdadera.'],
    ['(P∧Q)↔(P∨Q)', 'Falla cuando solo una de las dos letras es verdadera.'],
    ['(P→Q)→(¬P→¬Q)', 'Esa es la inversa: no se sigue de la original.'],
    ['((P→Q)∧¬P)→¬Q', 'Eso es negar el antecedente: P falsa no obliga a que Q lo sea.'],
  ];
  R.generador({
    id: 'w1.n1.tautologias', mundo: 1, nivel: '1.1', familia: 'aplicacion', habilidades: ['1.1.equivalencia', '1.1.tabla'], dificultad: 2, autoexplicacion: null,
    generar(rng) {
      const k = rng.int(1, 3);
      const si = rng.sample(TAUTS, k), no = rng.sample(NOTAUTS, 5 - k);
      const items = rng.shuffle(si.map(s => ({ s, taut: true })).concat(no.map(([s, m]) => ({ s, taut: false, m }))));
      const set = rng.pick(NOMBRES), map = { P: set[0], Q: set[1], R: set[2] };
      const fs = items.map(x => L.renombrar(L.parse(x.s), map));
      const correcta = items.map((x, i) => x.taut ? i : -1).filter(i => i >= 0);
      const firmas = items.map((x, i) => x.taut ? null : { id: 'marca-falacia', respuesta: correcta.concat(i), mensaje: 'Marcaste ' + T(fs[i]) + ' pero no es tautología: ' + x.m }).filter(Boolean);
      return {
        variantKey: items.map(x => x.s).join('|') + set[0],
        enunciado: 'Marca todas las fórmulas que son tautologías (verdaderas en todas las filas de su tabla).',
        entrada: { tipo: 'multiple', opciones: fs.map(T) },
        verificador: { id: 'conjunto-indices', args: { esperado: correcta, n: 5 } },
        firmas,
        pistas: ['Orientación: una tautología no tiene ninguna fila falsa; basta encontrar una fila falsa para descartarla.', 'Idea clave: para una implicación A→B, busca una fila con A verdadera y B falsa.', 'Primer paso: toma la primera fórmula e intenta hacerla falsa asignando valores.'],
        explicacion: 'Son tautologías las opciones: ' + correcta.map(i => T(fs[i])).join(', ') + '.',
      };
    },
  });

  /* ---------- 8 y 9. verdadero/falso con justificación; contraejemplo ---------- */
  const VERDADERAS = [['P→Q', '¬Q→¬P'], ['¬(P∧Q)', '¬P∨¬Q'], ['¬(P∨Q)', '¬P∧¬Q'], ['P→Q', '¬P∨Q'], ['¬(P→Q)', 'P∧¬Q'], ['P∧(Q∨R)', '(P∧Q)∨(P∧R)'], ['P↔Q', '(P→Q)∧(Q→P)'], ['P→(Q→R)', '(P∧Q)→R']];
  const FALSAS = [['P→Q', 'Q→P'], ['P→Q', '¬P→¬Q'], ['¬(P∧Q)', '¬P∧¬Q'], ['¬(P∨Q)', '¬P∨¬Q'], ['¬(P→Q)', '¬P→¬Q'], ['P∨(Q∧R)', '(P∨Q)∧R'], ['P→(Q→R)', '(P→Q)→R'], ['P↔Q', 'P→Q']];
  const envTxt = (vs, e) => vs.map(v => v + '=' + VF(e[v])).join(', ');
  function elegirPar(rng, listaVerdad) {
    const par = rng.pick(listaVerdad); const swap = rng.chance(0.5);
    const set = rng.pick(NOMBRES), map = { P: set[0], Q: set[1], R: set[2] };
    const f = L.renombrar(L.parse(swap ? par[1] : par[0]), map), g = L.renombrar(L.parse(swap ? par[0] : par[1]), map);
    return { f, g, id: par.join('≡'), swap, vs: L.unionVars(f, g) };
  }
  R.generador({
    id: 'w1.n1.vf-equivalencia', mundo: 1, nivel: '1.1', familia: 'demostracion', modo: 'vf-justificado', habilidades: ['1.1.equivalencia', '1.1.demostrar'], dificultad: 2, autoexplicacion: null,
    generar(rng) {
      const verdadera = rng.chance(0.5);
      const { f, g, id, vs } = elegirPar(rng, verdadera ? VERDADERAS : FALSAS);
      const es = ev => ({ a: L.ev(f, ev), b: L.ev(g, ev) });
      const envs = L.envs(vs), difieren = envs.filter(e => es(e).a !== es(e).b), coinciden = envs.filter(e => es(e).a === es(e).b);
      let correcta, malas;
      if (!verdadera) {
        const e = rng.pick(difieren), r = es(e);
        correcta = 'Falso: con ' + envTxt(vs, e) + ' la primera vale ' + VF(r.a) + ' y la segunda ' + VF(r.b) + '; basta una fila distinta.';
        const c = rng.pick(coinciden);
        malas = ['Verdadero: con ' + envTxt(vs, c) + ' las dos valen lo mismo, así que son equivalentes.', 'Verdadero: ambas fórmulas usan las mismas letras y los mismos conectivos.', 'Falso: porque una de las dos fórmulas es más larga que la otra.'];
      } else {
        const c = rng.pick(coinciden);
        correcta = 'Verdadero: coinciden en las ' + envs.length + ' filas de la tabla de verdad.';
        malas = ['Verdadero: con ' + envTxt(vs, c) + ' las dos valen lo mismo (un ejemplo basta para probarlo).', 'Falso: son fórmulas escritas de forma distinta, así que no pueden ser equivalentes.', 'Falso: una implicación nunca equivale a otra fórmula.'];
        if (!hay(f, 'imp') && !hay(g, 'imp')) malas[2] = 'Falso: la negación cambia el valor de verdad, así que no se conserva.';
      }
      const op = rng.shuffle([{ t: correcta, ok: true }].concat(malas.map(t => ({ t, ok: false }))));
      return {
        variantKey: id + '|' + op.map(x => x.t.slice(0, 8)).join(''),
        enunciadoId: 'vf:' + id,
        enunciado: 'Afirmación: ' + T(f) + ' y ' + T(g) + ' son equivalentes ($\\equiv$). Decide si es verdadera o falsa y elige la justificación correcta.',
        entrada: { tipo: 'vf', justificaciones: op.map(x => x.t) },
        verificador: { id: 'vf-justificado', args: { valor: verdadera, just: op.findIndex(x => x.ok) } },
        firmas: [],
        pistas: ['Orientación: equivalentes significa misma columna en la tabla de verdad.', 'Idea clave: una fila distinta basta para refutar; para afirmar hay que revisarlas todas (o usar un teorema).', 'Primer paso: evalúa ambas fórmulas con todas las letras verdaderas y luego busca una fila que difiera.'],
        explicacion: correcta,
      };
    },
  });

  R.generador({
    id: 'w1.n1.contraejemplo', mundo: 1, nivel: '1.1', familia: 'demostracion', modo: 'contraejemplo', habilidades: ['1.1.equivalencia', '1.1.demostrar'], dificultad: 2, autoexplicacion: null,
    generar(rng) {
      const { f, g, id, vs } = elegirPar(rng, FALSAS);
      return {
        variantKey: id + '|' + L.str(f),
        enunciadoId: 'cx:' + id,
        enunciado: 'Se afirma que ' + T(f) + ' y ' + T(g) + ' son equivalentes, pero no lo son. Construye un contraejemplo: asigna V o F a cada letra de modo que las dos fórmulas tengan valores distintos.',
        entrada: { tipo: 'asignacion', vars: vs },
        verificador: { id: 'asignacion', args: { f: L.str(f), g: L.str(g), vars: vs } },
        firmas: [],
        pistas: ['Orientación: busca una fila de la tabla donde las dos fórmulas difieran.', 'Idea clave: para que A→B sea falsa necesitas A verdadera y B falsa.', 'Primer paso: pon todas las letras en V y mira si ya difieren; si no, cambia una a la vez.'],
        explicacion: 'Un contraejemplo es ' + envTxt(vs, rng.pick(L.envs(vs).filter(e => L.ev(f, e) !== L.ev(g, e)))) + '.',
      };
    },
  });

  /* ---------- nivel ---------- */
  R.nivel({
    id: '1.1', mundo: 1, titulo: 'Lógica proposicional', tema: 'Conectivos, tablas de verdad y equivalencias',
    habilidades: ['1.1.tabla', '1.1.equivalencia', '1.1.negacion', '1.1.contrapositiva', '1.1.simplificar', '1.1.demostrar'],
    teoremas: ['t.demorgan-prop', 't.contrapositiva', 't.neg-implicacion', 't.silogismo-hipotetico', 't.distrib-prop'],
    leccion: {
      intro: 'Una **proposición** es un enunciado que es verdadero o falso. Con los conectivos construimos proposiciones compuestas cuyo valor depende solo del valor de sus partes.',
      definiciones: [
        { nombre: 'Negación, conjunción, disyunción', tex: '$\\neg P$ es verdadera cuando $P$ es falsa. $P\\wedge Q$ es verdadera cuando ambas lo son. $P\\vee Q$ es verdadera cuando al menos una lo es (no excluyente).' },
        { nombre: 'Implicación', tex: '$P\\to Q$ es falsa únicamente cuando $P$ es verdadera y $Q$ es falsa. En particular, si $P$ es falsa, $P\\to Q$ es verdadera. Equivale a $\\neg P\\vee Q$.' },
        { nombre: 'Equivalencia lógica', tex: '$A\\equiv B$ significa que $A$ y $B$ tienen el mismo valor de verdad en **todas** las filas de la tabla de verdad. Una fila distinta basta para refutarla; para probarla hay que cubrir todas las filas (o usar leyes ya demostradas).' },
        { nombre: 'Formas de una implicación', tex: 'De $P\\to Q$ se derivan: la **recíproca** $Q\\to P$, la **inversa** $\\neg P\\to\\neg Q$ y la **contrapositiva** $\\neg Q\\to\\neg P$. Solo la contrapositiva equivale a la original.' },
      ],
      teorema: 't.contrapositiva',
      ejemplo: {
        enunciado: 'Verifica con una tabla que $P\\to Q$ y $\\neg Q\\to\\neg P$ son equivalentes.',
        pasos: [
          'Hay cuatro filas, según los valores de $P$ y $Q$: VV, VF, FV, FF.',
          '$P\\to Q$ vale: V, F, V, V (solo falla en VF).',
          '$\\neg Q\\to\\neg P$ vale: V, F, V, V: con $P$=V y $Q$=F el antecedente $\\neg Q$ es V y el consecuente $\\neg P$ es F, así que falla; en las demás filas se cumple.',
          'Las dos columnas coinciden en las cuatro filas; por tanto son equivalentes. ∎',
        ],
      },
    },
  });

  if (typeof module !== 'undefined') module.exports = AC;
})(globalThis.AC = globalThis.AC || {});
