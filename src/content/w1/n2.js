/* Mundo 1, nivel 1.2 — Cuantificadores y conjuntos. */
(function (AC) {
  const { R, r, H, T, cap, dem, EST_EJEMPLO } = AC.w1c;
  const C = AC.conj;
  const SETS = [['A', 'B', 'C'], ['X', 'Y', 'Z'], ['S', 'T', 'U'], ['E', 'F', 'G']];
  const VARS = [['x', 'y'], ['a', 'b'], ['m', 'n']];

  /* ---------- catálogo ---------- */
  const HB = (id, nombre) => R.habilidad({ id: '1.2.' + id, nombre, nivel: '1.2' });
  HB('negar-cuantificado', 'Negar enunciados cuantificados'); HB('valor-verdad', 'Valor de verdad de enunciados cuantificados');
  HB('operaciones-conjuntos', 'Operaciones entre conjuntos'); HB('cardinalidad', 'Cardinales y conteo'); HB('inclusion', 'Inclusión e igualdad de conjuntos'); HB('demostrar', 'Demostrar con cuantificadores y conjuntos');
  const TE = (id, titulo, enunciado, requiere, habilidades) => R.teorema({ id, titulo, nivel: '1.2', enunciado, requiere, habilidades });
  TE('t.neg-cuantificadores', 'Negación de cuantificadores', r`$\neg\forall x\,P(x)\equiv\exists x\,\neg P(x)$ y $\neg\exists x\,P(x)\equiv\forall x\,\neg P(x)$.`, [], ['1.2.negar-cuantificado', '1.2.demostrar']);
  TE('t.demorgan-conj', 'Leyes de De Morgan para conjuntos', r`$(A\cup B)^c=A^c\cap B^c$ y $(A\cap B)^c=A^c\cup B^c$.`, ['t.demorgan-prop'], ['1.2.operaciones-conjuntos', '1.2.demostrar']);
  TE('t.distrib-conj', 'Distributividad de conjuntos', r`$A\cap(B\cup C)=(A\cap B)\cup(A\cap C)$ y $A\cup(B\cap C)=(A\cup B)\cap(A\cup C)$.`, ['t.distrib-prop'], ['1.2.operaciones-conjuntos', '1.2.demostrar']);
  TE('t.inclusion-interseccion', 'Inclusión e intersección', r`$A\subseteq B\iff A\cap B=A$.`, [], ['1.2.inclusion', '1.2.demostrar']);

  /* ---------- 1. negar un enunciado cuantificado (elección) ---------- */
  const PREDS = [
    { f: (x, y) => `${x}+${y}=0`, n: (x, y) => `${x}+${y}\\neq 0` }, { f: (x, y) => `${x}<${y}`, n: (x, y) => `${x}\\ge ${y}` },
    { f: (x, y) => `${y}>${x}^2`, n: (x, y) => `${y}\\le ${x}^2` }, { f: (x, y) => `${x}\\cdot ${y}=1`, n: (x, y) => `${x}\\cdot ${y}\\neq 1` },
    { f: (x, y) => `${y}^2=${x}`, n: (x, y) => `${y}^2\\neq ${x}` }, { f: (x, y) => `${x}\\le ${y}`, n: (x, y) => `${x}>${y}` },
    { f: (x, y) => `${x}+${y}\\ge 10`, n: (x, y) => `${x}+${y}<10` }, { f: (x, y) => `${x}\\neq ${y}`, n: (x, y) => `${x}=${y}` },
  ];
  const DOMS = [['\\mathbb{R}', 'los reales'], ['\\mathbb{Z}', 'los enteros'], ['\\mathbb{N}', 'los naturales']];
  const QS = [['\\forall', '\\exists'], ['\\exists', '\\forall'], ['\\forall', '\\forall'], ['\\exists', '\\exists']];
  const flipQ = q => (q === '\\forall' ? '\\exists' : '\\forall');
  R.generador({
    id: 'w1.n2.negar-cuantificado', mundo: 1, nivel: '1.2', familia: 'aplicacion', habilidades: ['1.2.negar-cuantificado'], dificultad: 2, autoexplicacion: 'negar-cuant-metodo',
    generar(rng) {
      const [x, y] = rng.pick(VARS), P = rng.pick(PREDS), [D] = rng.pick(DOMS), [q1, q2] = rng.pick(QS);
      const enun = (a, b, pred) => `${a}\\ ${x}\\in ${D}\\;${b}\\ ${y}\\in ${D}:\\ ${pred}`;
      const original = enun(q1, q2, P.f(x, y));
      const correcta = enun(flipQ(q1), flipQ(q2), P.n(x, y));
      const malas = [
        ['no-niega-predicado', enun(flipQ(q1), flipQ(q2), P.f(x, y)), 'Cambiaste los cuantificadores pero no negaste la condición: hay que negar también $' + P.f(x, y) + '$.'],
        ['no-cambia-cuantificador', enun(q1, q2, P.n(x, y)), 'Negaste la condición pero no cambiaste los cuantificadores: ¬∀ se convierte en ∃ y ¬∃ en ∀.'],
        ['cambia-solo-uno', enun(flipQ(q1), q2, P.n(x, y)), 'Al negar hay que cambiar todos los cuantificadores, no solo el primero.'],
      ].filter(m => m[1] !== correcta);
      const todas = rng.shuffle([['ok', correcta]].concat(malas.map(m => [m[0], m[1]])));
      const unicas = [...new Map(todas.map(t => [t[1], t])).values()];
      if (unicas.length < 4) return this.generar(rng);
      const idx = unicas.findIndex(t => t[0] === 'ok');
      return {
        variantKey: original,
        enunciado: 'Niega el enunciado $' + original + '$. ¿Cuál de estas es su negación?',
        entrada: { tipo: 'eleccion', opciones: unicas.map(t => T(t[1])) },
        verificador: { id: 'indice', args: { esperado: idx } },
        firmas: unicas.map((t, i) => t[0] === 'ok' ? null : { id: t[0], respuesta: i, mensaje: malas.find(m => m[1] === t[1]).slice(2)[0] }).filter(Boolean),
        pistas: ['Orientación: ¿qué le pasa a cada cuantificador al negar? ¿y a la condición?', 'Idea clave: ¬∀ ≡ ∃¬ y ¬∃ ≡ ∀¬; se avanza de izquierda a derecha, cuantificador por cuantificador.', 'Primer paso: cambia el primer cuantificador y pasa la negación al resto del enunciado.'],
        explicacion: 'La negación es $' + correcta + '$: cada cuantificador cambia y la condición se niega.',
      };
    },
  });
  R.banco('negar-cuant-metodo', { pregunta: '¿Por qué funcionó el método?', opciones: [
    { texto: 'Cada negación atraviesa un cuantificador y lo cambia (∀↔∃); al final se niega la condición.', correcta: true },
    { texto: 'Porque basta negar la condición y dejar los cuantificadores como están.', correcta: false },
    { texto: 'Porque ¬∀ y ¬∃ significan lo mismo, así que solo hay que tachar la negación.', correcta: false },
    { texto: 'Porque el orden de los cuantificadores no importa.', correcta: false },
  ] });

  /* ---------- 2. valor de verdad en un dominio finito ---------- */
  R.generador({
    id: 'w1.n2.valor-verdad', mundo: 1, nivel: '1.2', familia: 'aplicacion', habilidades: ['1.2.valor-verdad'], dificultad: 2, autoexplicacion: null,
    generar(rng) {
      for (let intento = 0; intento < 200; intento++) {
        const dom = C.norm(rng.sample(['1', '2', '3', '4', '5', '6', '7', '8', '9'], rng.int(4, 5)));
        const k = rng.int(5, 12), [q1, q2] = rng.pick(QS);
        const preds = [
          { tex: (x, y) => `${x}+${y}=${k}`, f: (a, b) => a + b === k },
          { tex: (x, y) => `${x}<${y}`, f: (a, b) => a < b },
          { tex: (x, y) => `${x}\\mid ${y}`, f: (a, b) => b % a === 0 },
          { tex: (x, y) => `${x}\\cdot ${y}\\le ${k + 6}`, f: (a, b) => a * b <= k + 6 },
        ];
        const P = rng.pick(preds), [x, y] = rng.pick(VARS), D = dom.map(Number);
        const val = (qa, qb, swap) => {
          const ev = (a, b) => (swap ? P.f(b, a) : P.f(a, b));
          const dentro = a => (qb === '\\forall' ? D.every(b => ev(a, b)) : D.some(b => ev(a, b)));
          return qa === '\\forall' ? D.every(dentro) : D.some(dentro);
        };
        const v = val(q1, q2, false);
        const alt = [
          ['cambia-cuantificadores', val(flipQ(q1), flipQ(q2), false), 'Parece que cambiaste ∀ por ∃ (o al revés): en este enunciado ' + (q1 === '\\forall' ? 'el primero es «para todo»' : 'el primero es «existe»') + '.'],
          ['intercambia-orden', val(q2, q1, true), 'Parece que intercambiaste el orden de los cuantificadores: no es lo mismo «para todo x existe y» que «existe y para todo x».'],
        ].filter(a => a[1] !== v);
        if (!alt.length) continue;
        const enun = `${q1}\\ ${x}\\in A\\;${q2}\\ ${y}\\in A:\\ ${P.tex(x, y)}`;
        return {
          variantKey: enun + '|' + dom.join(''),
          enunciado: 'Sea $A=' + C.tex(dom) + '$. ¿Es verdadero o falso el enunciado $' + enun + '$?',
          entrada: { tipo: 'eleccion', opciones: ['Verdadero', 'Falso'] },
          verificador: { id: 'indice', args: { esperado: v ? 0 : 1 } },
          firmas: [{ id: alt[0][0], respuesta: v ? 1 : 0, mensaje: alt[0][2] }],
          pistas: ['Orientación: recorre el dominio elemento por elemento; no hace falta probar todas las parejas si ya encuentras un caso decisivo.', 'Idea clave: un «para todo» se refuta con un solo elemento; un «existe» se prueba con uno solo.', 'Primer paso: fija el primer cuantificador y analiza para cada valor de $' + x + '$ lo que pide el segundo.'],
          explicacion: 'El enunciado es ' + (v ? 'verdadero' : 'falso') + '. Se comprueba elemento por elemento del dominio ' + C.fmt(dom) + '.',
        };
      }
      throw new Error('valor-verdad: sin instancia');
    },
  });

  /* ---------- 3. operaciones entre conjuntos (escribir un conjunto) ---------- */
  const OPS = [
    { tex: (A, B) => `${A}\\cup ${B}`, f: (A, B, _, U) => C.uni(A, B), s: [['y-por-o', (A, B) => C.inter(A, B), 'Usaste la intersección: $\\cup$ junta todos los elementos de ambos.']] },
    { tex: (A, B) => `${A}\\cap ${B}^c`, f: (A, B, _, U) => C.inter(A, C.comp(U, B)), s: [['olvida-complemento', (A, B) => C.inter(A, B), 'Olvidaste complementar: $B^c$ son los elementos de $U$ que NO están en $B$.']] },
    { tex: (A, B) => `(${A}\\cup ${B})^c`, f: (A, B, _, U) => C.comp(U, C.uni(A, B)), s: [['olvida-complemento', (A, B) => C.uni(A, B), 'Olvidaste el complemento de fuera del paréntesis.'], ['demorgan-sin-cambiar', (A, B, _, U) => C.uni(C.comp(U, A), C.comp(U, B)), 'De Morgan cambia la operación: $(A\\cup B)^c=A^c\\cap B^c$, no $A^c\\cup B^c$.']] },
    { tex: (A, B) => `${A}\\setminus ${B}`, f: (A, B) => C.dif(A, B), s: [['diferencia-al-reves', (A, B) => C.dif(B, A), 'Invertiste la diferencia: $A\\setminus B$ son los de $A$ que no están en $B$.'], ['quita-nada', (A, B) => A, 'Olvidaste quitar los elementos que también están en $B$.']] },
    { tex: (A, B, Cc) => `(${A}\\cap ${B})\\cup ${Cc}`, f: (A, B, Cc) => C.uni(C.inter(A, B), Cc), s: [['precedencia', (A, B, Cc) => C.inter(A, C.uni(B, Cc)), 'Respeta los paréntesis: primero $A\\cap B$ y luego la unión con el tercero.']] },
    { tex: (A, B, Cc) => `${A}^c\\cap(${B}\\cup ${Cc})`, f: (A, B, Cc, U) => C.inter(C.comp(U, A), C.uni(B, Cc)), s: [['olvida-complemento', (A, B, Cc) => C.inter(A, C.uni(B, Cc)), 'Olvidaste complementar $A$.']] },
    { tex: (A, B) => `(${A}\\setminus ${B})\\cup(${B}\\setminus ${A})`, f: (A, B) => C.uni(C.dif(A, B), C.dif(B, A)), s: [['uniones', (A, B) => C.uni(A, B), 'Olvidaste quitar los elementos comunes: es la diferencia simétrica.']] },
    { tex: (A, B) => `(${A}\\cap ${B})^c`, f: (A, B, _, U) => C.comp(U, C.inter(A, B)), s: [['demorgan-sin-cambiar', (A, B, _, U) => C.inter(C.comp(U, A), C.comp(U, B)), 'De Morgan cambia la operación: $(A\\cap B)^c=A^c\\cup B^c$.'], ['olvida-complemento', (A, B) => C.inter(A, B), 'Olvidaste el complemento.']] },
    { tex: (A, B, Cc) => `${A}\\cap(${B}\\setminus ${Cc})`, f: (A, B, Cc) => C.inter(A, C.dif(B, Cc)), s: [['diferencia-al-reves', (A, B, Cc) => C.inter(A, C.dif(Cc, B)), 'Invertiste la diferencia interna.']] },
    { tex: (A, B, Cc) => `(${A}\\cup ${Cc})\\setminus ${B}`, f: (A, B, Cc) => C.dif(C.uni(A, Cc), B), s: [['precedencia', (A, B, Cc) => C.uni(A, C.dif(Cc, B)), 'Respeta los paréntesis: primero $A\\cup C$, luego se quita $B$.']] },
  ];
  R.generador({
    id: 'w1.n2.operaciones-conjuntos', mundo: 1, nivel: '1.2', familia: 'aplicacion', habilidades: ['1.2.operaciones-conjuntos'], dificultad: 2, autoexplicacion: null,
    generar(rng) {
      for (let i = 0; i < 100; i++) {
        const n = rng.pick([8, 9, 10]), U = Array.from({ length: n }, (_, k) => String(k + 1));
        const [a, b, c] = rng.pick(SETS), A = C.norm(rng.sample(U, rng.int(3, 5))), B = C.norm(rng.sample(U, rng.int(3, 5))), Cc = C.norm(rng.sample(U, rng.int(2, 4)));
        const op = rng.pick(OPS), res = op.f(A, B, Cc, U);
        if (!res.length || res.length === U.length) continue;
        const firmas = []; const vistos = new Set([C.fmt(res)]);
        op.s.forEach(([id, fn, msg]) => { const v = fn(A, B, Cc, U); if (!vistos.has(C.fmt(v))) { vistos.add(C.fmt(v)); firmas.push({ id, respuesta: C.fmt(v), mensaje: msg }); } });
        if (!firmas.length) continue;
        return {
          variantKey: op.tex(a, b, c) + '|' + A.join('') + '|' + B.join('') + '|' + Cc.join(''),
          enunciado: 'Sea $U=' + C.tex(U) + '$, $' + a + '=' + C.tex(A) + '$, $' + b + '=' + C.tex(B) + '$ y $' + c + '=' + C.tex(Cc) + '$. Escribe $' + op.tex(a, b, c) + '$ (por extensión, con llaves y comas; ∅ si es vacío).',
          entrada: { tipo: 'conjunto' },
          verificador: { id: 'igual-conjunto', args: { esperado: res } },
          solucionTexto: [C.fmt(res)],
          firmas,
          pistas: ['Orientación: resuelve primero lo que está entre paréntesis y los complementos.', 'Idea clave: el complemento se calcula respecto de $U$; una diferencia $X\\setminus Y$ conserva lo de $X$ que no está en $Y$.', 'Primer paso: calcula la parte más interna de la expresión.'],
          explicacion: 'Resultado: $' + C.tex(res) + '$.',
        };
      }
      throw new Error('operaciones-conjuntos: sin instancia');
    },
  });

  /* ---------- 4. inclusión-exclusión (entero) ---------- */
  const CTX = [['estudiantes', 'estudian inglés', 'estudian francés', 'estudian ambos'], ['socios de un club', 'juegan al ajedrez', 'juegan al tenis', 'juegan a ambos'], ['personas encuestadas', 'leen el diario', 'leen revistas', 'leen ambos'], ['vecinos', 'tienen perro', 'tienen gato', 'tienen ambos']];
  R.generador({
    id: 'w1.n2.inclusion-exclusion', mundo: 1, nivel: '1.2', familia: 'aplicacion', habilidades: ['1.2.cardinalidad'], dificultad: 2, autoexplicacion: null,
    generar(rng) {
      for (let i = 0; i < 100; i++) {
        const [suj, a, b, ab] = rng.pick(CTX), tipo = rng.pick(['union', 'inter', 'ninguno', 'tres']);
        if (tipo === 'tres') {
          const x = rng.int(15, 40), y = rng.int(15, 40), z = rng.int(15, 40), xy = rng.int(3, 10), xz = rng.int(3, 10), yz = rng.int(3, 10), xyz = rng.int(1, 3);
          const u = x + y + z - xy - xz - yz + xyz;
          const mal1 = x + y + z - xy - xz - yz, mal2 = x + y + z;
          const nums = [x, y, z, xy, xz, yz, xyz];
          if (nums.includes(u) || u === mal1) continue;
          return { variantKey: 'tres|' + nums.join(','), enunciado: 'En un conjunto de ' + suj + ' hay tres actividades. $|A|=' + x + '$, $|B|=' + y + '$, $|C|=' + z + '$, $|A\\cap B|=' + xy + '$, $|A\\cap C|=' + xz + '$, $|B\\cap C|=' + yz + '$ y $|A\\cap B\\cap C|=' + xyz + '$. ¿Cuántos pertenecen a $A\\cup B\\cup C$?',
            entrada: { tipo: 'entero' }, verificador: { id: 'entero', args: { esperado: String(u) } }, solucionTexto: [String(u)],
            firmas: [{ id: 'olvida-triple', respuesta: String(mal1), mensaje: 'Olvidaste sumar la intersección triple: se resta tres veces y hay que devolverla una.' }, { id: 'solo-suma', respuesta: String(mal2), mensaje: 'Sumaste los tres conjuntos sin descontar las intersecciones: contaste varias veces a los que están en dos o más.' }],
            pistas: ['Orientación: los elementos en varios conjuntos se cuentan de más al sumar.', 'Idea clave: $|A\\cup B\\cup C|=|A|+|B|+|C|-|A\\cap B|-|A\\cap C|-|B\\cap C|+|A\\cap B\\cap C|$.', 'Primer paso: suma los tres cardinales.'], explicacion: 'Aplicando inclusión-exclusión: ' + u + '.' };
        }
        const total = rng.int(30, 80), x = rng.int(12, 30), y = rng.int(12, 30), i2 = rng.int(3, Math.min(x, y) - 2), u = x + y - i2;
        if (u > total) continue;
        if (tipo === 'union') {
          if ([x, y, i2, total].includes(u) || u === x + y) continue;
          return { variantKey: 'union|' + [x, y, i2].join(','), enunciado: 'En un grupo de ' + suj + ', ' + x + ' ' + a + ', ' + y + ' ' + b + ' y ' + i2 + ' ' + ab + '. ¿Cuántos hacen al menos una de las dos cosas?',
            entrada: { tipo: 'entero' }, verificador: { id: 'entero', args: { esperado: String(u) } }, solucionTexto: [String(u)],
            firmas: [{ id: 'solo-suma', respuesta: String(x + y), mensaje: 'Sumaste sin descontar a los que están en ambos: esos se contaron dos veces.' }, { id: 'resta-dos-veces', respuesta: String(x + y - 2 * i2), mensaje: 'Descontaste dos veces a los que están en ambos: solo hay que restar la intersección una vez.' }].filter(f => +f.respuesta !== u),
            pistas: ['Orientación: ¿quiénes se cuentan dos veces al sumar?', 'Idea clave: $|A\\cup B|=|A|+|B|-|A\\cap B|$.', 'Primer paso: suma los dos grupos.'], explicacion: x + ' + ' + y + ' − ' + i2 + ' = ' + u + '.' };
        }
        if (tipo === 'inter') {
          if ([x, y, u, total].includes(i2)) continue;
          return { variantKey: 'inter|' + [x, y, u].join(','), enunciado: 'En un grupo de ' + suj + ', ' + x + ' ' + a + ', ' + y + ' ' + b + ' y en total ' + u + ' hacen al menos una de las dos cosas. ¿Cuántos ' + ab.replace(/^(\w+) /, '') + '?',
            entrada: { tipo: 'entero' }, verificador: { id: 'entero', args: { esperado: String(i2) } }, solucionTexto: [String(i2)],
            firmas: [{ id: 'union-menos-suma', respuesta: String(u - x - y), mensaje: 'Restaste al revés: $|A\\cap B|=|A|+|B|-|A\\cup B|$.' }, { id: 'solo-resta', respuesta: String(Math.abs(x - y)), mensaje: 'La diferencia de cardinales no es la intersección.' }].filter(f => +f.respuesta !== i2 && +f.respuesta >= 0 || false),
            pistas: ['Orientación: usa la fórmula de la unión y despeja.', 'Idea clave: $|A\\cap B|=|A|+|B|-|A\\cup B|$.', 'Primer paso: suma los dos grupos.'], explicacion: x + ' + ' + y + ' − ' + u + ' = ' + i2 + '.' };
        }
        // ninguno: cuántos no hacen ninguna de las dos
        const ning = total - u;
        if ([x, y, i2, total, u].includes(ning) || ning <= 0) continue;
        return { variantKey: 'ninguno|' + [total, x, y, i2].join(','), enunciado: 'En un grupo de ' + total + ' ' + suj + ', ' + x + ' ' + a + ', ' + y + ' ' + b + ' y ' + i2 + ' ' + ab + '. ¿Cuántos no hacen ninguna de las dos cosas?',
          entrada: { tipo: 'entero' }, verificador: { id: 'entero', args: { esperado: String(ning) } }, solucionTexto: [String(ning)],
          firmas: [{ id: 'solo-suma', respuesta: String(total - x - y), mensaje: 'Restaste sin devolver la intersección: los que están en ambos se descontaron dos veces.' }, { id: 'olvida-complemento', respuesta: String(u), mensaje: 'Eso es cuántos hacen al menos una; piden los que no hacen ninguna.' }].filter(f => +f.respuesta !== ning),
          pistas: ['Orientación: primero cuenta a los que hacen al menos una; después el complemento.', 'Idea clave: $|(A\\cup B)^c|=|U|-|A\\cup B|$ y $|A\\cup B|=|A|+|B|-|A\\cap B|$.', 'Primer paso: calcula $|A\\cup B|$.'], explicacion: 'Al menos una: ' + u + '; ninguna: ' + total + ' − ' + u + ' = ' + ning + '.' };
      }
      throw new Error('inclusion-exclusion: sin instancia');
    },
  });

  /* ---------- 5. potencias y productos (entero) ---------- */
  const binom = (n, k) => { let b = 1; for (let i = 1; i <= k; i++) b = (b * (n - k + i)) / i; return b; };
  R.generador({
    id: 'w1.n2.potencia-producto', mundo: 1, nivel: '1.2', familia: 'aplicacion', habilidades: ['1.2.cardinalidad'], dificultad: 2, autoexplicacion: null,
    generar(rng) {
      const tipo = rng.pick(['potencia', 'producto', 'subconj-k', 'potencia-prod', 'partes-propias']);
      const n = rng.int(3, 8), m = rng.int(2, 6), k = rng.int(2, Math.max(2, n - 1));
      let res, enun, firmas, expl, key;
      if (tipo === 'potencia') { res = 2 ** n; enun = 'Un conjunto $A$ tiene $' + n + '$ elementos. ¿Cuántos elementos tiene su conjunto potencia $\\mathcal{P}(A)$?'; firmas = [['doble', 2 * n, 'Cada elemento puede estar o no estar en el subconjunto: son $2\\cdot2\\cdots2$, no $2n$.'], ['cuadrado', n * n, 'No es $n^2$: se eligen sí/no para cada uno de los $n$ elementos.'], ['factorial', null, '']]; expl = '$2^{' + n + '}=' + res + '$.'; key = tipo + n; }
      else if (tipo === 'producto') { res = n * m; enun = 'Si $|A|=' + n + '$ y $|B|=' + m + '$, ¿cuántos elementos tiene el producto cartesiano $A\\times B$?'; firmas = [['suma', n + m, 'El producto cartesiano tiene un par por cada combinación: se multiplican los cardinales, no se suman.'], ['potencia', n ** m, 'No es $|A|^{|B|}$ (eso cuenta funciones).']]; expl = '$' + n + '\\cdot ' + m + '=' + res + '$.'; key = tipo + n + '-' + m; }
      else if (tipo === 'subconj-k') { res = binom(n, k); enun = 'Un conjunto tiene $' + n + '$ elementos. ¿Cuántos subconjuntos tiene con exactamente $' + k + '$ elementos?'; firmas = [['potencia', 2 ** n, 'Eso cuenta todos los subconjuntos; piden solo los de tamaño $' + k + '$.'], ['ordenados', binom(n, k) * [1, 1, 2, 6, 24, 120, 720][k] || 0, 'Contaste elecciones ordenadas; en un subconjunto el orden no importa.']]; expl = '$\\binom{' + n + '}{' + k + '}=' + res + '$.'; key = tipo + n + '-' + k; }
      else if (tipo === 'potencia-prod') { const a = rng.int(2, 3), b = rng.int(2, 3); res = 2 ** (a * b); enun = 'Si $|A|=' + a + '$ y $|B|=' + b + '$, ¿cuántos subconjuntos tiene $A\\times B$?'; firmas = [['suma', 2 ** (a + b), 'Primero multiplica: $|A\\times B|=' + a * b + '$; después $2^{' + a * b + '}$.'], ['producto', a * b, 'Eso es $|A\\times B|$; piden los subconjuntos de $A\\times B$.']]; expl = '$|A\\times B|=' + a * b + '$ y hay $2^{' + a * b + '}=' + res + '$ subconjuntos.'; key = tipo + a + '-' + b; }
      else { res = 2 ** n - 1; enun = 'Un conjunto $A$ tiene $' + n + '$ elementos. ¿Cuántos subconjuntos propios no vacíos tiene (los distintos de $\\varnothing$ y de $A$)?'; res = 2 ** n - 2; firmas = [['todos', 2 ** n, 'Eso incluye a $\\varnothing$ y a $A$, que no son propios no vacíos.'], ['uno', 2 ** n - 1, 'Quitaste solo uno de los dos subconjuntos excluidos.']]; expl = '$2^{' + n + '}-2=' + res + '$.'; key = tipo + n; }
      if (new RegExp('(^|\\D)' + res + '(\\D|$)').test(enun.replace(/\$/g, ' '))) return this.generar(rng); // la respuesta no puede aparecer en el enunciado
      const fs = firmas.filter(f => f[1] !== null && f[1] !== res && f[1] > 0).map(f => ({ id: f[0], respuesta: String(f[1]), mensaje: f[2] }));
      return { variantKey: key, enunciado: enun, entrada: { tipo: 'entero' }, verificador: { id: 'entero', args: { esperado: String(res) } }, solucionTexto: [String(res)], firmas: fs,
        pistas: ['Orientación: identifica si se eligen elementos, parejas o subconjuntos.', 'Idea clave: cada elemento puede estar o no (2 posibilidades); una pareja se forma eligiendo un elemento de cada conjunto.', 'Primer paso: traduce el enunciado a «cuántas elecciones independientes hay».'], explicacion: expl };
    },
  });

  /* ---------- 6. inclusiones verdaderas (selección múltiple) ---------- */
  R.generador({
    id: 'w1.n2.inclusiones', mundo: 1, nivel: '1.2', familia: 'aplicacion', habilidades: ['1.2.inclusion'], dificultad: 2, autoexplicacion: null,
    generar(rng) {
      for (let i = 0; i < 100; i++) {
        const U = Array.from({ length: 8 }, (_, k) => String(k + 1)), [a, b, c] = rng.pick(SETS);
        const A = C.norm(rng.sample(U, rng.int(2, 3))), B = C.norm(C.uni(A, rng.sample(U, rng.int(1, 3))).concat(rng.chance(0.5) ? [] : [])), Cc = C.norm(rng.sample(U, rng.int(3, 5)));
        const cand = [
          [`${a}\\subseteq ${b}`, C.sub(A, B), 'Una inclusión se refuta con un elemento de $' + a + '$ que no esté en $' + b + '$.'],
          [`${b}\\subseteq ${a}`, C.sub(B, A), 'Revisa si todos los elementos de $' + b + '$ están en $' + a + '$.'],
          [`${a}\\cap ${b}=${a}`, C.eq(C.inter(A, B), A), 'Recuerda: $A\\cap B=A$ equivale a $A\\subseteq B$.'],
          [`${a}\\cup ${b}=${b}`, C.eq(C.uni(A, B), B), 'Recuerda: $A\\cup B=B$ equivale a $A\\subseteq B$.'],
          [`${a}\\cap ${c}\\subseteq ${a}`, true, 'La intersección siempre está contenida en cada uno de sus conjuntos.'],
          [`${b}\\subseteq ${b}\\cup ${c}`, true, 'Todo conjunto está contenido en su unión con otro.'],
          [`${a}\\setminus ${c}\\subseteq ${c}`, C.sub(C.dif(A, Cc), Cc), 'Los elementos de $A\\setminus C$ están en $A$ y fuera de $C$.'],
        ];
        const ops = rng.sample(cand, 5), ok = ops.map((o, j) => (o[1] ? j : -1)).filter(j => j >= 0);
        if (ok.length < 1 || ok.length > 4) continue;
        const firmas = ops.map((o, j) => o[1] ? null : { id: 'marca-falsa', respuesta: ok.concat(j), mensaje: 'Marcaste $' + o[0] + '$ pero es falsa. ' + o[2] }).filter(Boolean);
        return {
          variantKey: ops.map(o => o[0]).join('|') + A.join('') + B.join('') + Cc.join(''),
          enunciado: 'Sean $' + a + '=' + C.tex(A) + '$, $' + b + '=' + C.tex(B) + '$ y $' + c + '=' + C.tex(Cc) + '$. Marca todas las afirmaciones verdaderas.',
          entrada: { tipo: 'multiple', opciones: ops.map(o => T(o[0])) },
          verificador: { id: 'conjunto-indices', args: { esperado: ok, n: 5 } },
          firmas,
          pistas: ['Orientación: para cada afirmación decide si es verdadera con los conjuntos concretos.', 'Idea clave: $A\\subseteq B$ equivale a $A\\cap B=A$ y a $A\\cup B=B$.', 'Primer paso: comprueba si todos los elementos de $' + a + '$ están en $' + b + '$.'],
          explicacion: 'Son verdaderas: ' + ok.map(j => T(ops[j][0])).join(', ') + '.',
        };
      }
      throw new Error('inclusiones: sin instancia');
    },
  });

  /* ---------- demostraciones ---------- */
  const NEG = r`\neg`;
  dem({
    id: 'dem.neg-cuantificadores', teorema: 't.neg-cuantificadores', nivel: '1.2', habilidades: ['1.2.negar-cuantificado', '1.2.demostrar'], requiere: [], refsExtra: ['b.doble-implicacion', 'b.contradiccion', 'b.arbitrario', 'd.complemento'],
    param: rng => { const [P] = rng.pick([['P'], ['Q'], ['R']]); return { P, x: rng.pick(['x', 'y', 'z']), D: rng.pick(['D', 'U']), dual: rng.chance(0.5) }; },
    enunciado: p => p.dual ? r`Demuestra que $\neg\exists ${p.x}\,${p.P}(${p.x})\equiv\forall ${p.x}\,\neg ${p.P}(${p.x})$ en el dominio $${p.D}$.` : r`Demuestra que $\neg\forall ${p.x}\,${p.P}(${p.x})\equiv\exists ${p.x}\,\neg ${p.P}(${p.x})$ en el dominio $${p.D}$.`,
    hip: p => [r`$${p.D}$ es un conjunto no vacío (el dominio)`, r`$${p.P}(${p.x})$ es una condición sobre los elementos de $${p.D}$`],
    meta: p => p.dual ? r`$\neg\exists ${p.x}\,${p.P}(${p.x})\equiv\forall ${p.x}\,\neg ${p.P}(${p.x})$` : r`$\neg\forall ${p.x}\,${p.P}(${p.x})\equiv\exists ${p.x}\,\neg ${p.P}(${p.x})$`,
    L: p => p.dual ? [
      ['L1', r`Probamos las dos implicaciones; así las dos proposiciones tendrán siempre el mismo valor de verdad.`, 'b.doble-implicacion'],
      ['L2', r`(⇒) Suponemos que $\neg\exists ${p.x}\,${p.P}(${p.x})$ es verdadera: no hay ningún $a\in ${p.D}$ con $${p.P}(a)$ verdadera.`, 'hip', ['L1']],
      ['L3', r`Sea $a\in ${p.D}$ cualquiera. Si $${p.P}(a)$ fuera ⟦h1⟧, entonces $\exists ${p.x}\,${p.P}(${p.x})$ sería verdadera, contra L2; luego $\neg ${p.P}(a)$ es verdadera.`, 'd.existencial', ['L2'], [H('h1', 'verdadera', ['verdadera', 'falsa'], false)]],
      ['L4', r`Como $a$ era arbitrario, $\neg ${p.P}(a)$ es verdadera para todo $a\in ${p.D}$: $\forall ${p.x}\,\neg ${p.P}(${p.x})$ es verdadera.`, 'b.arbitrario', ['L3']],
      ['L5', r`(⇐) Suponemos que $\forall ${p.x}\,\neg ${p.P}(${p.x})$ es verdadera: $\neg ${p.P}(a)$ es verdadera, es decir, $${p.P}(a)$ es falsa, para todo $a\in ${p.D}$.`, 'hip', ['L1']],
      ['L6', r`Por tanto no existe $a\in ${p.D}$ con $${p.P}(a)$ verdadera: $\neg\exists ${p.x}\,${p.P}(${p.x})$ es verdadera.`, 'd.existencial', ['L5']],
      ['L7', r`Se cumplen las dos implicaciones; por tanto $\neg\exists ${p.x}\,${p.P}(${p.x})\equiv\forall ${p.x}\,\neg ${p.P}(${p.x})$. ∎`, 'b.doble-implicacion', ['L4', 'L6']],
    ] : [
      ['L1', r`Probamos las dos implicaciones; así las dos proposiciones tendrán siempre el mismo valor de verdad.`, 'b.doble-implicacion'],
      ['L2', r`(⇒) Suponemos que $\neg\forall ${p.x}\,${p.P}(${p.x})$ es verdadera: $${p.P}(a)$ no es verdadera para todo $a\in ${p.D}$.`, 'hip', ['L1']],
      ['L3', r`Si $\neg ${p.P}(a)$ fuera falsa para todo $a\in ${p.D}$, entonces $${p.P}(a)$ sería ⟦h1⟧ para todo $a$ y $\forall ${p.x}\,${p.P}(${p.x})$ sería verdadera, contra L2.`, 'd.universal', ['L2'], [H('h1', 'verdadera', ['verdadera', 'falsa'], false)]],
      ['L4', r`Luego existe $a\in ${p.D}$ con $\neg ${p.P}(a)$ verdadera: $\exists ${p.x}\,\neg ${p.P}(${p.x})$ es verdadera.`, 'd.existencial', ['L3']],
      ['L5', r`(⇐) Suponemos que $\exists ${p.x}\,\neg ${p.P}(${p.x})$ es verdadera: hay un $a\in ${p.D}$ con $\neg ${p.P}(a)$ verdadera, es decir, con $${p.P}(a)$ falsa.`, 'd.existencial', ['L1']],
      ['L6', r`Como $${p.P}(a)$ es falsa para ese $a$, $${p.P}$ no se cumple en todo $${p.D}$: $\forall ${p.x}\,${p.P}(${p.x})$ es falsa, es decir, $\neg\forall ${p.x}\,${p.P}(${p.x})$ es verdadera.`, 'd.universal', ['L5']],
      ['L7', r`Se cumplen las dos implicaciones; por tanto $\neg\forall ${p.x}\,${p.P}(${p.x})\equiv\exists ${p.x}\,\neg ${p.P}(${p.x})$. ∎`, 'b.doble-implicacion', ['L4', 'L6']],
    ],
    dist: p => [
      [r`Basta comprobar un elemento $a\in ${p.D}$: si $${p.P}(a)$ es verdadera, ya sabemos el valor de $\forall ${p.x}\,${p.P}(${p.x})$.`, 'un solo elemento no decide un «para todo»'],
      [p.dual ? r`Negamos solo la condición: $\neg\exists ${p.x}\,${p.P}(${p.x})\equiv\exists ${p.x}\,\neg ${p.P}(${p.x})$.` : r`Negamos solo la condición: $\neg\forall ${p.x}\,${p.P}(${p.x})\equiv\forall ${p.x}\,\neg ${p.P}(${p.x})$.`, 'al negar hay que cambiar también el cuantificador'],
    ],
    err: p => [
      ['L4', p.dual ? r`Luego existe $a\in ${p.D}$ con $\neg ${p.P}(a)$ verdadera: $\exists ${p.x}\,\neg ${p.P}(${p.x})$ es verdadera.` : r`Luego $\neg ${p.P}(a)$ es verdadera para todo $a\in ${p.D}$: $\forall ${p.x}\,\neg ${p.P}(${p.x})$ es verdadera.`, 'conclusion-invalida', 'Se obtuvo el cuantificador equivocado: aquí lo que se concluye es lo contrario de lo que se quería.'],
      ['L6', r`Como $${p.P}(a)$ es falsa para ese $a$, ${p.dual ? 'no existe ningún elemento con ' + p.P + ' verdadera' : p.P + ' es falsa para todos los elementos de ' + p.D}. ∎`, 'conclusion-invalida', 'De un solo elemento no se concluye nada sobre todos los demás.'],
      ['L2', r`(⇒) Suponemos ${p.dual ? r`que $\exists ${p.x}\,${p.P}(${p.x})$ es verdadera` : r`que $\forall ${p.x}\,${p.P}(${p.x})$ es verdadera`} y llegamos a lo que queremos.`, 'circular', 'La hipótesis es la negación del enunciado, no el enunciado.'],
    ],
    est: [['dos-implicaciones', 'Probar las dos implicaciones por separado', true, 'Es la forma estándar de probar una equivalencia.'], ['contradiccion', 'En cada sentido, suponer lo contrario y llegar a una contradicción', true, 'Es el argumento de L3 y L5.'], ['dominio-finito', 'Comprobarlo en un dominio finito concreto', false, 'El enunciado vale para cualquier dominio; un ejemplo finito no lo prueba.'], ['induccion', 'Inducción sobre el tamaño del dominio', false, 'El dominio es arbitrario, no necesariamente numerable.']],
    crit: ['Probé las dos implicaciones', 'Usé la definición de ∀ y de ∃', 'Argumenté con un elemento arbitrario donde hacía falta', 'Concluí la equivalencia'],
    pistas: p => ['Orientación: una equivalencia se prueba en dos sentidos.', 'Idea clave: «no todos cumplen» se convierte en «alguno no cumple» al razonar por reducción al absurdo.', 'Primer paso: supón la proposición de la izquierda y busca un elemento concreto.'],
  });

  const memb = (X, p) => r`$x\in ${X}$`;
  dem({
    id: 'dem.demorgan-conj', teorema: 't.demorgan-conj', nivel: '1.2', habilidades: ['1.2.operaciones-conjuntos', '1.2.demostrar'], requiere: ['t.demorgan-prop'], refsExtra: ['b.doble-implicacion', 'b.arbitrario', 'd.diferencia'],
    param: rng => { const [A, B] = rng.pick(SETS); return { A, B, dual: rng.chance(0.5) }; },
    enunciado: p => p.dual ? r`Demuestra que $(${p.A}\cap ${p.B})^c=${p.A}^c\cup ${p.B}^c$.` : r`Demuestra que $(${p.A}\cup ${p.B})^c=${p.A}^c\cap ${p.B}^c$.`,
    hip: p => [r`$${p.A}$ y $${p.B}$ son subconjuntos del universo $U$`, 'Puedes citar las leyes de De Morgan de la lógica, ya demostradas'],
    meta: p => p.dual ? r`$(${p.A}\cap ${p.B})^c=${p.A}^c\cup ${p.B}^c$` : r`$(${p.A}\cup ${p.B})^c=${p.A}^c\cap ${p.B}^c$`,
    L: p => { const o = p.dual ? r`\cap` : r`\cup`, od = p.dual ? r`\cup` : r`\cap`, lo = p.dual ? r`\wedge` : r`\vee`, lod = p.dual ? r`\vee` : r`\wedge`, dI = p.dual ? 'd.interseccion' : 'd.union', dD = p.dual ? 'd.union' : 'd.interseccion'; return [
      ['L1', r`Sea $x\in U$ arbitrario. Probaremos $x\in(${p.A}${o} ${p.B})^c\iff x\in ${p.A}^c${od} ${p.B}^c$ con una cadena de equivalencias.`, 'd.igualdad-conj'],
      ['L2', r`$x\in(${p.A}${o} ${p.B})^c\iff x\notin ${p.A}${o} ${p.B}$.`, 'd.complemento', ['L1']],
      ['L3', r`$x\notin ${p.A}${o} ${p.B}\iff\neg(x\in ${p.A}${lo} x\in ${p.B})$.`, dI, ['L2']],
      ['L4', r`$\neg(x\in ${p.A}${lo} x\in ${p.B})\iff$ ⟦h1⟧.`, 't.demorgan-prop', ['L3'], [H('h1', r`x\notin ${p.A}${lod} x\notin ${p.B}`, [r`x\notin ${p.A}${lo} x\notin ${p.B}`, r`x\in ${p.A}${lod} x\in ${p.B}`, r`x\in ${p.A}${lo} x\notin ${p.B}`])]],
      ['L5', r`$x\notin ${p.A}${lod} x\notin ${p.B}\iff x\in ${p.A}^c${lod} x\in ${p.B}^c$.`, 'd.complemento', ['L4']],
      ['L6', r`$x\in ${p.A}^c${lod} x\in ${p.B}^c\iff x\in ${p.A}^c${od} ${p.B}^c$.`, dD, ['L5']],
      ['L7', r`Encadenando, $x\in(${p.A}${o} ${p.B})^c\iff x\in ${p.A}^c${od} ${p.B}^c$ para todo $x\in U$; por tanto $(${p.A}${o} ${p.B})^c=${p.A}^c${od} ${p.B}^c$. ∎`, 'd.igualdad-conj', ['L1', 'L2', 'L3', 'L4', 'L5', 'L6']],
    ]; },
    dist: p => [
      [r`Como $(${p.A}${p.dual ? r`\cap` : r`\cup`} ${p.B})^c$ y $${p.A}^c${p.dual ? r`\cup` : r`\cap`} ${p.B}^c$ tienen un elemento en común, son iguales.`, 'un elemento común no prueba una igualdad de conjuntos'],
      [p.dual ? r`Por De Morgan, $x\notin ${p.A}\cap ${p.B}\iff x\notin ${p.A}\wedge x\notin ${p.B}$.` : r`Por De Morgan, $x\notin ${p.A}\cup ${p.B}\iff x\notin ${p.A}\vee x\notin ${p.B}$.`, 'De Morgan cambia el conector lógico'],
    ],
    err: p => [
      ['L4', p.dual ? r`$\neg(x\in ${p.A}\wedge x\in ${p.B})\iff x\notin ${p.A}\wedge x\notin ${p.B}$.` : r`$\neg(x\in ${p.A}\vee x\in ${p.B})\iff x\notin ${p.A}\vee x\notin ${p.B}$.`, 'demorgan-mal', 'Al negar una disyunción (o una conjunción) el conector cambia.', ['demorgan-mal', 'error-de-calculo', 'circular', 'caso-faltante']],
      ['L6', p.dual ? r`$x\in ${p.A}^c\vee x\in ${p.B}^c\iff x\in ${p.A}^c\cap ${p.B}^c$.` : r`$x\in ${p.A}^c\wedge x\in ${p.B}^c\iff x\in ${p.A}^c\cup ${p.B}^c$.`, 'error-de-calculo', 'La definición de la operación entre conjuntos no coincide con el conector escrito.'],
      ['L7', r`Como $x$ pertenece a ambos lados para el elemento $x=1$, los conjuntos son iguales. ∎`, 'conclusion-invalida', 'Un elemento concreto no prueba una igualdad de conjuntos.'],
    ],
    est: [['cadena', 'Cadena de equivalencias sobre la pertenencia de un elemento arbitrario', true, 'Es la prueba natural y usa De Morgan de la lógica.'], ['doble-inclusion', 'Doble inclusión: probar cada contención por separado', true, 'Equivale a la cadena, probando ⊆ y ⊇.'], ['diagrama', 'Dibujar un diagrama de Venn', false, 'Ilustra, pero no es una demostración.'], EST_EJEMPLO],
    crit: ['Tomé un elemento arbitrario', 'Traduje la pertenencia con las definiciones', 'Cité De Morgan de la lógica', 'Concluí la igualdad de conjuntos'],
    pistas: p => ['Orientación: dos conjuntos son iguales si tienen los mismos elementos; trabaja con un elemento arbitrario.', 'Idea clave: traduce «$x$ está en el complemento» a lógica y usa De Morgan.', r`Primer paso: escribe $x\in(${p.A}${p.dual ? r`\cap` : r`\cup`} ${p.B})^c$ como «$x\notin\dots$».`],
  });

  dem({
    id: 'dem.distrib-conj', teorema: 't.distrib-conj', nivel: '1.2', habilidades: ['1.2.operaciones-conjuntos', '1.2.demostrar'], requiere: ['t.distrib-prop'], refsExtra: ['b.doble-implicacion', 'b.arbitrario', 'd.complemento'],
    param: rng => { const [A, B, Cc] = rng.pick(SETS); return { A, B, C: Cc, dual: rng.chance(0.5) }; },
    enunciado: p => p.dual ? r`Demuestra que $${p.A}\cup(${p.B}\cap ${p.C})=(${p.A}\cup ${p.B})\cap(${p.A}\cup ${p.C})$.` : r`Demuestra que $${p.A}\cap(${p.B}\cup ${p.C})=(${p.A}\cap ${p.B})\cup(${p.A}\cap ${p.C})$.`,
    hip: p => [r`$${p.A}$, $${p.B}$ y $${p.C}$ son conjuntos cualesquiera`, 'Puedes citar la distributividad de la lógica, ya demostrada'],
    meta: p => p.dual ? r`$${p.A}\cup(${p.B}\cap ${p.C})=(${p.A}\cup ${p.B})\cap(${p.A}\cup ${p.C})$` : r`$${p.A}\cap(${p.B}\cup ${p.C})=(${p.A}\cap ${p.B})\cup(${p.A}\cap ${p.C})$`,
    L: p => { const o1 = p.dual ? r`\cup` : r`\cap`, o2 = p.dual ? r`\cap` : r`\cup`, l1 = p.dual ? r`\vee` : r`\wedge`, l2 = p.dual ? r`\wedge` : r`\vee`, d1 = p.dual ? 'd.union' : 'd.interseccion', d2 = p.dual ? 'd.interseccion' : 'd.union'; const A = p.A, B = p.B, Cc = p.C; return [
      ['L1', r`Sea $x$ arbitrario. Probaremos $x\in ${A}${o1}(${B}${o2} ${Cc})\iff x\in(${A}${o1} ${B})${o2}(${A}${o1} ${Cc})$.`, 'd.igualdad-conj'],
      ['L2', r`$x\in ${A}${o1}(${B}${o2} ${Cc})\iff x\in ${A}${l1} x\in ${B}${o2} ${Cc}$.`, d1, ['L1']],
      ['L3', r`$x\in ${A}${l1} x\in ${B}${o2} ${Cc}\iff x\in ${A}${l1}(x\in ${B}${l2} x\in ${Cc})$.`, d2, ['L2']],
      ['L4', r`$x\in ${A}${l1}(x\in ${B}${l2} x\in ${Cc})\iff$ ⟦h1⟧.`, 't.distrib-prop', ['L3'], [H('h1', r`(x\in ${A}${l1} x\in ${B})${l2}(x\in ${A}${l1} x\in ${Cc})`, [r`(x\in ${A}${l2} x\in ${B})${l1}(x\in ${A}${l2} x\in ${Cc})`, r`(x\in ${A}${l1} x\in ${B})${l1}(x\in ${A}${l1} x\in ${Cc})`, r`x\in ${A}${l2}(x\in ${B}${l1} x\in ${Cc})`])]],
      ['L5', r`$(x\in ${A}${l1} x\in ${B})${l2}(x\in ${A}${l1} x\in ${Cc})\iff x\in ${A}${o1} ${B}${l2} x\in ${A}${o1} ${Cc}$.`, d1, ['L4']],
      ['L6', r`$x\in ${A}${o1} ${B}${l2} x\in ${A}${o1} ${Cc}\iff x\in(${A}${o1} ${B})${o2}(${A}${o1} ${Cc})$.`, d2, ['L5']],
      ['L7', r`Como la cadena vale para todo $x$, $${A}${o1}(${B}${o2} ${Cc})=(${A}${o1} ${B})${o2}(${A}${o1} ${Cc})$. ∎`, 'd.igualdad-conj', ['L1', 'L2', 'L3', 'L4', 'L5', 'L6']],
    ]; },
    dist: p => [
      [r`Basta comprobarlo con $${p.A}=${p.B}=${p.C}$: entonces los dos lados coinciden.`, 'un caso particular no prueba la igualdad general'],
      [p.dual ? r`Distribuimos: $x\in ${p.A}\vee(x\in ${p.B}\wedge x\in ${p.C})\iff(x\in ${p.A}\wedge x\in ${p.B})\vee(x\in ${p.A}\wedge x\in ${p.C})$.` : r`Distribuimos: $x\in ${p.A}\wedge(x\in ${p.B}\vee x\in ${p.C})\iff(x\in ${p.A}\vee x\in ${p.B})\wedge(x\in ${p.A}\vee x\in ${p.C})$.`, 'esa es la distributividad de la operación contraria'],
    ],
    err: p => [
      ['L4', p.dual ? r`$x\in ${p.A}\vee(x\in ${p.B}\wedge x\in ${p.C})\iff(x\in ${p.A}\wedge x\in ${p.B})\vee(x\in ${p.A}\wedge x\in ${p.C})$.` : r`$x\in ${p.A}\wedge(x\in ${p.B}\vee x\in ${p.C})\iff(x\in ${p.A}\vee x\in ${p.B})\wedge(x\in ${p.A}\vee x\in ${p.C})$.`, 'error-de-calculo', 'Se distribuyó con los conectores intercambiados: no es la ley de distributividad que corresponde.'],
      ['L2', r`$x\in ${p.A}${p.dual ? r`\cup` : r`\cap`}(${p.B}${p.dual ? r`\cap` : r`\cup`} ${p.C})\iff x\in ${p.A}${p.dual ? r`\wedge` : r`\vee`} x\in ${p.B}${p.dual ? r`\cap` : r`\cup`} ${p.C}$.`, 'error-de-calculo', 'La definición de la operación exterior no corresponde con el conector escrito.'],
      ['L7', r`Como la cadena vale para $x\in ${p.A}$, los conjuntos son iguales. ∎`, 'caso-faltante', 'La cadena debe valer para todo $x$, no solo para los elementos de $A$.'],
    ],
    est: [['cadena', 'Cadena de equivalencias sobre la pertenencia de un elemento arbitrario', true, 'Reduce la igualdad de conjuntos a la distributividad de la lógica.'], ['doble-inclusion', 'Doble inclusión', true, 'Funciona, con más casos.'], ['diagrama', 'Dibujar un diagrama de Venn', false, 'Ilustra, no demuestra.'], EST_EJEMPLO],
    crit: ['Tomé un elemento arbitrario', 'Traduje con las definiciones de ∪ y ∩', 'Cité la distributividad lógica', 'Concluí la igualdad'],
    pistas: p => ['Orientación: traduce todo a pertenencia de un elemento arbitrario.', 'Idea clave: la distributividad de ∧ sobre ∨ (o la dual) de la lógica.', r`Primer paso: escribe lo que significa $x\in ${p.A}${p.dual ? r`\cup` : r`\cap`}(${p.B}${p.dual ? r`\cap` : r`\cup`} ${p.C})$.`],
  });

  dem({
    id: 'dem.inclusion-interseccion', teorema: 't.inclusion-interseccion', nivel: '1.2', habilidades: ['1.2.inclusion', '1.2.demostrar'], requiere: [], refsExtra: ['b.arbitrario', 'd.union', 'd.complemento'],
    param: rng => { const [A, B] = rng.pick(SETS); return { A, B }; },
    enunciado: p => r`Demuestra que $${p.A}\subseteq ${p.B}$ si y solo si $${p.A}\cap ${p.B}=${p.A}$.`,
    hip: p => [r`$${p.A}$ y $${p.B}$ son conjuntos cualesquiera`],
    meta: p => r`$${p.A}\subseteq ${p.B}\iff ${p.A}\cap ${p.B}=${p.A}$`,
    L: p => [
      ['L1', r`Probamos las dos implicaciones.`, 'b.doble-implicacion'],
      ['L2', r`(⇒) Suponemos que $${p.A}\subseteq ${p.B}$.`, 'hip', ['L1']],
      ['L3', r`Si $x\in ${p.A}\cap ${p.B}$, entonces $x\in ${p.A}$; luego $${p.A}\cap ${p.B}\subseteq ${p.A}$.`, 'd.interseccion', ['L1']],
      ['L4', r`Si $x\in ${p.A}$, por la hipótesis $x\in ${p.B}$, así que $x\in ${p.A}\cap ${p.B}$; luego $${p.A}\subseteq ${p.A}\cap ${p.B}$.`, 'd.inclusion', ['L2']],
      ['L5', r`Por la doble inclusión, $${p.A}\cap ${p.B}=${p.A}$.`, 'd.igualdad-conj', ['L3', 'L4']],
      ['L6', r`(⇐) Suponemos que $${p.A}\cap ${p.B}=${p.A}$ y tomamos $x\in ${p.A}$.`, 'hip', ['L1']],
      ['L7', r`Como $${p.A}=${p.A}\cap ${p.B}$, $x\in ${p.A}\cap ${p.B}$ y, por tanto, $x$ pertenece a ⟦h1⟧.`, 'd.interseccion', ['L6'], [H('h1', p.B, [p.A, r`${p.A}\cup ${p.B}`, r`${p.A}^c`])]],
      ['L8', r`Como $x\in ${p.A}$ era arbitrario, $${p.A}\subseteq ${p.B}$. ∎`, 'd.inclusion', ['L5', 'L7']],
    ],
    dist: p => [
      [r`Suponemos $${p.A}\cap ${p.B}=${p.A}$ y concluimos $${p.B}\subseteq ${p.A}$.`, 'confunde la dirección de la inclusión'],
      [r`Si $${p.A}\subseteq ${p.B}$, entonces $${p.A}\cup ${p.B}=${p.A}$.`, 'la unión sería $B$, no $A$'],
    ],
    err: p => [
      ['L4', r`Si $x\in ${p.B}$, por la hipótesis $x\in ${p.A}$, así que $x\in ${p.A}\cap ${p.B}$.`, 'conclusion-invalida', 'La hipótesis da $x\\in B$ a partir de $x\\in A$, no al revés.'],
      ['L7', r`Como $x\in ${p.A}$, entonces $x\in ${p.A}\cup ${p.B}$ y por tanto $x\in ${p.B}$.`, 'conclusion-invalida', 'Estar en la unión no obliga a estar en $B$: hay que usar la intersección.'],
      ['L8', r`Como $x=1$ cumple $x\in ${p.A}\Rightarrow x\in ${p.B}$, entonces $${p.A}\subseteq ${p.B}$. ∎`, 'caso-faltante', 'La inclusión debe valer para todo elemento de $A$.'],
    ],
    est: [['dos-sentidos', 'Probar las dos implicaciones, cada una con un elemento arbitrario', true, 'Es el método estándar.'], ['doble-inclusion', 'En (⇒), probar la igualdad por doble inclusión', true, 'Es parte de la prueba de (⇒).'], ['diagrama', 'Mirar un diagrama de Venn', false, 'Ilustra, no demuestra.'], EST_EJEMPLO],
    crit: ['Probé las dos implicaciones', 'Usé un elemento arbitrario', 'Usé la doble inclusión para la igualdad', 'Concluí la equivalencia'],
    pistas: p => ['Orientación: hay dos sentidos y la igualdad de conjuntos se prueba con dos inclusiones.', r`Idea clave: $${p.A}\cap ${p.B}\subseteq ${p.A}$ siempre es cierto; lo interesante es la otra inclusión.`, r`Primer paso: supón $${p.A}\subseteq ${p.B}$ y toma $x\in ${p.A}$.`],
  });

  /* ---------- nivel ---------- */
  R.nivel({
    id: '1.2', mundo: 1, titulo: 'Cuantificadores y conjuntos', tema: 'Negar enunciados con ∀ y ∃, y operar con conjuntos',
    habilidades: ['1.2.negar-cuantificado', '1.2.valor-verdad', '1.2.operaciones-conjuntos', '1.2.cardinalidad', '1.2.inclusion', '1.2.demostrar'],
    teoremas: ['t.neg-cuantificadores', 't.demorgan-conj', 't.distrib-conj', 't.inclusion-interseccion'],
    leccion: {
      intro: 'Los **cuantificadores** convierten una condición $P(x)$ en una proposición: $\\forall x\\,P(x)$ («para todo $x$») y $\\exists x\\,P(x)$ («existe $x$»). Los **conjuntos** se comparan por sus elementos.',
      definiciones: [
        { nombre: 'Cuantificadores', tex: '$\\forall x\\,P(x)$ es verdadera si $P(a)$ es verdadera para **todo** $a$ del dominio; $\\exists x\\,P(x)$ lo es si $P(a)$ se cumple para **algún** $a$. Un «para todo» se refuta con un solo contraejemplo; un «existe» se prueba con un solo ejemplo.' },
        { nombre: 'Orden de los cuantificadores', tex: '$\\forall x\\,\\exists y\\,P(x,y)$ y $\\exists y\\,\\forall x\\,P(x,y)$ **no** dicen lo mismo: en la primera, $y$ puede depender de $x$.' },
        { nombre: 'Operaciones', tex: '$x\\in A\\cup B$ si $x\\in A$ o $x\\in B$; $x\\in A\\cap B$ si está en ambos; $x\\in A\\setminus B$ si está en $A$ y no en $B$; $x\\in A^c$ si $x\\notin A$ (respecto de un universo $U$).' },
        { nombre: 'Inclusión e igualdad', tex: '$A\\subseteq B$ si todo elemento de $A$ está en $B$. $A=B$ exactamente cuando $A\\subseteq B$ y $B\\subseteq A$ (doble inclusión).' },
      ],
      teorema: 't.neg-cuantificadores',
      ejemplo: { enunciado: 'Niega «para todo real $x$ existe un real $y$ con $x+y=0$».', pasos: ['El enunciado es $\\forall x\\,\\exists y:\\ x+y=0$.', 'Al negar, $\\forall$ pasa a $\\exists$ y $\\exists$ pasa a $\\forall$, uno por uno: $\\exists x\\,\\forall y:\\ \\neg(x+y=0)$.', 'Se niega la condición: $\\exists x\\,\\forall y:\\ x+y\\neq 0$.', 'En palabras: «hay un real $x$ tal que ningún $y$ cumple $x+y=0$». (Es falso para los reales, pero la negación está bien escrita.)'] },
    },
  });

  if (typeof module !== 'undefined') module.exports = AC;
})(globalThis.AC = globalThis.AC || {});
