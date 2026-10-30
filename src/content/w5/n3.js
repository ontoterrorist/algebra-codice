/* Mundo 5, nivel 5.3 — Base y dimensión. */
(function (AC) {
  const { R, H, T, gen, dem2 } = AC.cont, r = String.raw, M = AC.mat, Rat = AC.Rat;
  const ref = (id, tipo, nombre) => R.ref({ id, tipo, nombre });
  ref('d.base', 'definicion', 'Base: lista de vectores independiente que genera el espacio'); ref('d.dimension', 'definicion', 'Dimensión: número de vectores de una base');

  const HB = (id, nombre) => R.habilidad({ id: '5.3.' + id, nombre, nivel: '5.3' });
  HB('base', 'Hallar y reconocer bases'); HB('dimension', 'Calcular dimensiones'); HB('completar', 'Completar a una base'); HB('espacios', 'Dimensión de espacios de matrices y polinomios'); HB('demostrar', 'Demostrar con bases y dimensión');
  const TE = (id, titulo, enunciado, requiere, hab) => R.teorema({ id, titulo, nivel: '5.3', enunciado, requiere, habilidades: hab });
  TE('t.mas-que-generadores', 'Más vectores que generadores', r`Si $V$ está generado por $m$ vectores, cualquier lista de $m+1$ vectores de $V$ es dependiente.`, ['t.homogeneo-libres', 't.generado-subespacio'], ['5.3.dimension', '5.3.demostrar']);
  TE('t.dimension-bien-definida', 'La dimensión está bien definida', r`Dos bases de un mismo espacio tienen el mismo número de elementos.`, ['t.mas-que-generadores'], ['5.3.dimension', '5.3.base', '5.3.demostrar']);
  TE('t.n-independientes-base', 'Independientes de tamaño n', r`En un espacio de dimensión $n$, $n$ vectores independientes forman una base.`, ['t.dimension-bien-definida', 't.agregar-independiente'], ['5.3.base', '5.3.completar', '5.3.demostrar']);
  TE('t.dim-subespacio', 'Dimensión de un subespacio', r`Si $W\subseteq V$ con $\dim V=n$, entonces $\dim W\le n$, con igualdad si y solo si $W=V$.`, ['t.n-independientes-base', 't.mas-que-generadores'], ['5.3.dimension', '5.3.espacios', '5.3.demostrar']);

  const F = M.fmt, strMat = A => A.map(f => f.map(String));
  const rv = (rng, n, lo, hi) => Array.from({ length: n }, () => Rat.of(rng.int(lo, hi)));
  const sist = A => '\\begin{cases}' + A.map(f => { let s = ''; f.forEach((c, j) => { if (c.isZero()) return; const neg = c.cmp(Rat.of(0)) < 0, a = neg ? c.neg() : c, cs = a.eq(Rat.of(1)) ? '' : M.texN(a); s += (s ? (neg ? '-' : '+') : (neg ? '-' : '')) + cs + ['x', 'y', 'z', 'w'][j]; }); return s + '=0'; }).join('\\\\') + '\\end{cases}';
  const lis = vs => vs.map(v => '(' + v.join(',') + ')').join(', ');

  /* ---------- generadores ---------- */
  gen.entero({
    id: 'w5.n3.dim-solucion', nivel: '5.3', habilidades: ['5.3.dimension'], dificultad: 2,
    hacer(rng) {
      const m = rng.int(2, 3), n = rng.int(3, 5), rg = rng.int(1, Math.min(m, n - 1)), base = Array.from({ length: rg }, () => rv(rng, n, -3, 4)); if (M.rango(base) < rg) return null;
      const A = base.slice(); while (A.length < m) A.push(M.combina([rng.int(-2, 2), rng.int(-2, 2)], [base[0], base[rg - 1]])); const real = M.rango(A), vars = ['x', 'y', 'z', 'w', 'u'];
      if (A.some(f => f.every(x => x.isZero()))) return null;
      return { key: sist(A) + n, enun: '¿Cuál es la dimensión del subespacio $W=\\{' + vars.slice(0, n).join(',') + '\\ \\text{que cumplen}\\ ' + sist(A.map(f => f)) + '\\}\\subseteq\\mathbb{R}^' + n + '$?', res: n - real,
        firmas: [['rango', real, 'Ese es el rango de las ecuaciones; la dimensión del conjunto solución es $n-\\operatorname{rango}$.'], ['num-ecuaciones', n - m, 'Si las ecuaciones son dependientes, quitan menos dimensiones de las que dicen: usa el rango.']].filter(f => f[1] !== n - real),
        pistas: ['Orientación: $W$ es el núcleo de la matriz de coeficientes.', 'Idea clave: $\\dim\\ker A=n-\\operatorname{rango}A$.', 'Primer paso: escalona la matriz de coeficientes y cuenta pivotes.'], expl: '$\\dim W=' + n + '-' + real + '=' + (n - real) + '$.' };
    },
  });

  gen.matriz({
    id: 'w5.n3.base-del-subespacio', nivel: '5.3', habilidades: ['5.3.base'], dificultad: 3,
    hacer(rng) {
      const n = rng.int(3, 4), rg = rng.int(1, 2), A = M.de(Array.from({ length: rg }, () => rv(rng, n, -3, 4))); if (M.rango(A) < rg) return null;
      const N = M.nucleo(A), dim = n - rg, jj = Array.from({ length: n }, (_, j) => j).find(j => A.some(f => !f[j].isZero()));
      return { key: sist(A) + n, enun: 'Halla una **base** de $W=\\{' + ['x', 'y', 'z', 'w'].slice(0, n).join(',') + ':\\ ' + sist(A).replace(/=0/g, '=0') + '\\}\\subseteq\\mathbb{R}^' + n + '$. Escribe los ' + dim + ' vectores como filas.', res: F(N), etiqueta: 'base', verificador: { id: 'base-nucleo', args: { A: strMat(A), dim, n } },
        firmas: [['dependientes', F(Array.from({ length: dim }, () => N[0])), 'Los vectores deben ser **independientes**: no repitas el mismo.'], ['fuera', F(N.map((v, i) => (i === 0 ? v.map((x, j) => (j === jj ? x.add(Rat.of(1)) : x)) : v))), 'Uno de los vectores no cumple las ecuaciones de $W$.']].filter(f => JSON.stringify(f[1]) !== JSON.stringify(F(N))),
        pistas: ['Orientación: resuelve el sistema homogéneo y escribe la solución general con parámetros.', 'Idea clave: cada variable libre da un vector de la base.', 'Primer paso: despeja las variables pivote en función de las libres.'], expl: 'Una base posible es $' + F(N).map(f => '(' + f.join(',') + ')').join(',\\ ') + '$.' };
    },
  });

  gen.tupla({
    id: 'w5.n3.completar-base', nivel: '5.3', habilidades: ['5.3.completar'], dificultad: 3,
    hacer(rng) {
      const n = rng.int(3, 4), k = n - 1, vs = Array.from({ length: k }, () => rv(rng, n, -3, 4)); if (M.rango(vs) < k) return null; const vars = ['x₁', 'x₂', 'x₃', 'x₄'].slice(0, n);
      const e = Array.from({ length: n }, (_, i) => { const w = Array.from({ length: n }, (_, j) => (j === i ? 1 : 0)); return M.rango(vs.concat([w.map(x => Rat.of(x))])) === k + 1 ? w : null; }).find(Boolean);
      return { key: lis(vs), enun: 'Los vectores ' + vs.map(v => '$(' + v.join(',') + ')$').join(' y ') + ' son independientes en $\\mathbb{R}^' + n + '$. Halla un vector $w$ tal que, añadido a ellos, formen una **base** de $\\mathbb{R}^' + n + '$.', campos: vars, res: e.map(String), verificador: { id: 'completa-base', args: { vecs: strMat(vs), n } },
        firmas: [['cero', Array(n).fill('0'), 'El cero no sirve: haría la lista dependiente.'], ['repetido', vs[0].map(String), 'Ya está en la lista: repetirlo la haría dependiente.']],
        pistas: ['Orientación: $w$ no debe estar en el generado de los dados.', 'Idea clave: prueba con vectores canónicos $e_i$ y comprueba el rango.', 'Primer paso: escalona los vectores dados y mira qué columna no tiene pivote.'], expl: 'Sirve, por ejemplo, $(' + e.join(',') + ')$.' };
    },
  });

  gen.eleccion({
    id: 'w5.n3.es-base', nivel: '5.3', habilidades: ['5.3.base'], dificultad: 2,
    hacer(rng) {
      let ok = null; for (let k = 0; k < 40 && !ok; k++) { const c = [rv(rng, 3, -2, 3), rv(rng, 3, -2, 3), rv(rng, 3, -2, 3)]; if (M.rango(c) === 3) ok = c; } if (!ok) return null;
      const pocos = [rv(rng, 3, -2, 3), rv(rng, 3, -2, 3)], muchos = [rv(rng, 3, -2, 3), rv(rng, 3, -2, 3), rv(rng, 3, -2, 3), rv(rng, 3, -2, 3)], dep = [rv(rng, 3, -2, 3), rv(rng, 3, -2, 3)]; dep.push(M.combina([rng.int(1, 2), rng.int(1, 2)], dep));
      if (M.rango(dep) === 3 || M.rango(pocos) < 2 || M.rango(dep) < 2) return null; const fmt = c => '$\\{' + c.map(v => '(' + v.join(',') + ')').join(',') + '\\}$';
      return { key: lis(ok) + lis(pocos), enun: '¿Cuál de estos conjuntos es una **base** de $\\mathbb{R}^3$?', ok: fmt(ok), malas: [['pocos', fmt(pocos), 'Dos vectores no generan $\\mathbb{R}^3$ (una base de $\\mathbb{R}^3$ tiene $3$).'], ['dependientes', fmt(dep), 'Son dependientes (rango $2$): no es base.'], ['muchos', fmt(muchos), 'Cuatro vectores de $\\mathbb{R}^3$ son siempre dependientes.']],
        pistas: ['Orientación: una base de $\\mathbb{R}^3$ debe tener exactamente $3$ vectores independientes.', 'Idea clave: cuenta los vectores y calcula el rango.', 'Primer paso: descarta los conjuntos con un número de vectores distinto de $3$.'], expl: 'Solo uno tiene $3$ vectores independientes.' };
    },
  });

  gen.entero({
    id: 'w5.n3.dim-espacios', nivel: '5.3', habilidades: ['5.3.espacios', '5.3.dimension'], dificultad: 3,
    hacer(rng) {
      const n = rng.int(2, 5), t = rng.pick(['simetricas', 'triangulares', 'traza', 'antisimetricas', 'polinomios', 'matrices']); let res, txt, f1, f2;
      const cuad = n * n;
      if (t === 'simetricas') { res = n * (n + 1) / 2; txt = 'las matrices **simétricas** $' + n + '\\times' + n + '$ ($A=A^T$)'; f1 = cuad; f2 = n; }
      else if (t === 'triangulares') { res = n * (n + 1) / 2; txt = 'las matrices **triangulares superiores** $' + n + '\\times' + n + '$'; f1 = cuad; f2 = n; }
      else if (t === 'traza') { res = cuad - 1; txt = 'las matrices $' + n + '\\times' + n + '$ de **traza cero**'; f1 = cuad; f2 = n; }
      else if (t === 'antisimetricas') { res = n * (n - 1) / 2; txt = 'las matrices **antisimétricas** $' + n + '\\times' + n + '$ ($A^T=-A$)'; f1 = n * (n + 1) / 2; f2 = n; }
      else if (t === 'polinomios') { const a = rng.int(-2, 3); res = n; txt = 'los polinomios $p$ de grado $\\le ' + n + '$ con $p(' + a + ')=0$'; f1 = n + 1; f2 = n - 1; }
      else { const m = rng.int(2, 4); res = m * n; txt = 'las matrices $' + m + '\\times' + n + '$'; f1 = m + n; f2 = m * n + 1; }
      return { key: t + n + res, enun: '¿Cuál es la dimensión del espacio de ' + txt + '?', res,
        firmas: [['tamano-total', f1, 'Revisa cuántas entradas son realmente independientes: las condiciones del enunciado las reducen.'], ['otro-conteo', f2, 'Esa cuenta no corresponde a una base del espacio.']].filter(f => f[1] !== res && f[1] > 0),
        pistas: ['Orientación: cuenta cuántas entradas se pueden elegir libremente.', 'Idea clave: cada entrada libre da un vector de la base.', 'Primer paso: describe una base (por ejemplo, matrices con un solo $1$).'], expl: 'La dimensión es $' + res + '$.' };
    },
  });

  gen.entero({
    id: 'w5.n3.maximo-independientes', nivel: '5.3', habilidades: ['5.3.dimension'], dificultad: 2,
    hacer(rng) {
      const n = rng.int(2, 10), k = rng.int(n + 1, n + 5), pre = rng.pick(['independientes', 'generadores']);
      return pre === 'independientes'
        ? { key: 'i' + n + k, enun: 'En un espacio vectorial de dimensión $' + n + '$, ¿cuál es el **mayor** número de vectores linealmente independientes que puede haber?', res: n,
          firmas: [['uno-mas', n + 1, 'Con $' + (n + 1) + '$ vectores en un espacio de dimensión $' + n + '$ siempre hay dependencia.'], ['cero', n - 1, 'Se pueden tomar $' + n + '$ (una base completa).']],
          pistas: ['Orientación: piensa en una base.', 'Idea clave: más de $n$ vectores en dimensión $n$ son siempre dependientes.', 'Primer paso: ¿cuántos vectores tiene una base?'], expl: 'Como máximo $' + n + '$.' }
        : { key: 'g' + n + k, enun: 'En un espacio de dimensión $' + n + '$ se tienen $' + k + '$ vectores que lo generan. ¿Cuántos de ellos hay que quitar, como **mínimo**, para quedarse con una base?', res: k - n,
          firmas: [['quitar-n', n, 'Eso es el tamaño de la base, no cuántos sobran.'], ['quitar-uno', 1, 'Hay $' + k + '$ vectores y la base tiene $' + n + '$.']].filter(f => f[1] !== k - n),
          pistas: ['Orientación: una base tiene exactamente $' + n + '$ vectores.', 'Idea clave: de un sistema de generadores se puede extraer una base.', 'Primer paso: resta $' + k + '-' + n + '$.'], expl: 'Sobran $' + (k - n) + '$ vectores.' };
    },
  });

  /* ---------- demostraciones ---------- */
  dem2({
    id: 'dem.mas-que-generadores', teorema: 't.mas-que-generadores', nivel: '5.3', habilidades: ['5.3.dimension', '5.3.demostrar'], requiere: ['t.homogeneo-libres', 't.generado-subespacio'], refsExtra: ['d.generado', 'd.independencia', 'd.combinacion-lineal'],
    param: rng => ({ w: rng.pick(['w', 'g']), u: rng.pick(['u', 'v']), m: rng.pick(['m', 'p']), a: rng.pick(['a', 'α']) }),
    enunciado: p => r`Sea $V=\operatorname{gen}(${p.w}_1,\dots,${p.w}_${p.m})$. Demuestra que cualesquiera $${p.m}+1$ vectores $${p.u}_1,\dots,${p.u}_{${p.m}+1}\in V$ son linealmente dependientes.`,
    hip: p => [r`$V=\operatorname{gen}(${p.w}_1,\dots,${p.w}_${p.m})$ y $${p.u}_1,\dots,${p.u}_{${p.m}+1}\in V$`, 'Puedes citar el teorema de homogéneos con más incógnitas y la definición del generado'], meta: p => r`$${p.u}_1,\dots,${p.u}_{${p.m}+1}$ dependientes`,
    L: p => [
      ['L1', r`Como $${p.u}_j\in V=\operatorname{gen}(${p.w}_i)$, existen escalares con $${p.u}_j=\sum_{i=1}^{${p.m}}${p.a}_{ij}${p.w}_i$ para $j=1,\dots,${p.m}+1$.`, 'd.generado'],
      ['L2', r`Consideremos el sistema homogéneo $\sum_{j}${p.a}_{ij}c_j=0$ para $i=1,\dots,${p.m}$: tiene $${p.m}$ ecuaciones y $${p.m}+1$ incógnitas $c_j$.`, 'd.combinacion-lineal', ['L1']],
      ['L3', r`Por el teorema de los homogéneos con más incógnitas que ecuaciones, existe una solución $(c_j)\neq0$.`, 't.homogeneo-libres', ['L2']],
      ['L4', r`Entonces $\sum_jc_j${p.u}_j=\sum_i\left(\sum_j${p.a}_{ij}c_j\right)${p.w}_i$ y cada paréntesis vale $0$ (es la ecuación $i$ del sistema), así que la suma es ⟦h1⟧.`, 'd.combinacion-lineal', ['L1', 'L3'], [H('h1', r`$0$`, [r`$0$`, r`$${p.w}_1$`, r`$c_1$`], false)]],
      ['L5', r`Hay una combinación lineal no trivial igual a $0$: los $${p.u}_j$ son dependientes. ∎`, 'd.independencia', ['L3', 'L4']],
    ],
    dist: p => [[r`En $\mathbb{R}^2$, tres vectores cualesquiera son dependientes; luego vale para todo $m$.`, 'un ejemplo no prueba el caso general'], [r`Como $V$ tiene $${p.m}$ generadores, tiene dimensión $${p.m}$ y eso basta.`, 'eso es una consecuencia que se prueba después de este resultado']],
    err: p => [['L2', r`Consideremos $\sum_{j}${p.a}_{ij}c_j=0$ para $i=1,\dots,${p.m}+1$: $${p.m}+1$ ecuaciones y $${p.m}$ incógnitas.`, 'error-de-calculo', 'Hay $m$ ecuaciones (una por generador) y $m+1$ incógnitas (una por vector).'], ['L4', r`Entonces $\sum_jc_j${p.u}_j=\sum_i\left(\sum_j${p.a}_{ij}c_j\right)${p.w}_i=${p.w}_1$.`, 'error-de-calculo', 'Cada coeficiente interior vale $0$: la combinación da el vector cero.']],
    valida: [['homogeneo', r`Escribir los $u_j$ en función de los $w_i$ y aplicar el teorema de homogéneos`, 'Es la prueba estándar.']],
    idea: p => r`el sistema $\sum_j${p.a}_{ij}c_j=0$ tiene más incógnitas que ecuaciones.`, primero: p => r`expresa cada $${p.u}_j$ con los generadores $${p.w}_i$.`,
  });

  dem2({
    id: 'dem.dimension-bien-definida', teorema: 't.dimension-bien-definida', nivel: '5.3', habilidades: ['5.3.dimension', '5.3.base', '5.3.demostrar'], requiere: ['t.mas-que-generadores'], refsExtra: ['d.base', 'd.dimension', 'b.contradiccion'],
    param: rng => ({ b: rng.pick(['B', 'E']), c: rng.pick(['C', 'G']), p: rng.pick(['p', 'r']), q: rng.pick(['q', 's']) }),
    enunciado: p => r`Demuestra que si $${p.b}$ y $${p.c}$ son bases de $V$, con $${p.p}$ y $${p.q}$ elementos respectivamente, entonces $${p.p}=${p.q}$.`,
    hip: p => [r`$${p.b}$ base con $${p.p}$ elementos y $${p.c}$ base con $${p.q}$ elementos`, 'Puedes citar que más vectores que generadores son dependientes'], meta: p => r`$${p.p}=${p.q}$`,
    L: p => [
      ['L1', r`Supongamos por contradicción que $${p.p}>${p.q}$.`, 'b.contradiccion'],
      ['L2', r`$${p.c}$ genera $V$ con $${p.q}$ vectores y $${p.b}$ tiene $${p.p}\ge ${p.q}+1$ vectores de $V$.`, 'd.base', ['L1']],
      ['L3', r`Por el teorema de más vectores que generadores, ⟦h1⟧.`, 't.mas-que-generadores', ['L2'], [H('h1', r`$${p.b}$ es dependiente`, [r`$${p.b}$ es dependiente`, r`$${p.b}$ es independiente`, r`$${p.b}$ genera menos`], false)]],
      ['L4', r`Pero $${p.b}$ es base y por tanto independiente: contradicción. Luego $${p.p}\le ${p.q}$.`, 'd.base', ['L3']],
      ['L5', r`Intercambiando los papeles de $${p.b}$ y $${p.c}$, $${p.q}\le ${p.p}$. Por tanto $${p.p}=${p.q}$. ∎`, 'd.dimension', ['L4']],
    ],
    dist: p => [[r`En $\mathbb{R}^3$ las bases estándar tienen $3$ elementos; luego todas las bases de cualquier espacio coinciden en tamaño.`, 'un ejemplo no prueba el caso general'], [r`Dos bases generan lo mismo, así que tienen los mismos elementos.`, 'tienen el mismo número, no los mismos vectores']],
    err: p => [['L2', r`$${p.c}$ genera $V$ con $${p.q}$ vectores y $${p.b}$ tiene $${p.p}\ge ${p.q}$ vectores.`, 'error-de-calculo', 'Hacen falta **más** vectores que generadores: $p\\ge q+1$.'], ['L5', r`Con los mismos papeles, $${p.p}\le ${p.q}$ de nuevo.`, 'conclusion-invalida', 'Hay que intercambiar los papeles para obtener la otra desigualdad.']],
    valida: [['simetria', r`Probar $p\le q$ y, intercambiando, $q\le p$`, 'Es la prueba estándar.']],
    idea: p => r`si una base tuviera más vectores que la otra, sería dependiente.`, primero: p => r`supón $${p.p}>${p.q}$ y aplica el teorema de más vectores que generadores.`,
  });

  dem2({
    id: 'dem.n-independientes-base', teorema: 't.n-independientes-base', nivel: '5.3', habilidades: ['5.3.base', '5.3.completar', '5.3.demostrar'], requiere: ['t.dimension-bien-definida', 't.agregar-independiente'], refsExtra: ['d.base', 'd.dimension', 'b.contradiccion'],
    param: rng => ({ s: rng.pick(['S', 'B']), n: rng.pick(['n', 'm']), v: rng.pick(['v', 'w']) }),
    enunciado: p => r`Sea $\dim V=${p.n}$ y $${p.s}$ una lista independiente de $${p.n}$ vectores de $V$. Demuestra que $${p.s}$ es una base de $V$.`,
    hip: p => [r`$\dim V=${p.n}$ y $${p.s}$ es independiente con $${p.n}$ elementos`, 'Puedes citar que las bases tienen el mismo tamaño y que agregar un vector independiente mantiene la independencia'], meta: p => r`$${p.s}$ genera $V$`,
    L: p => [
      ['L1', r`Como $${p.s}$ es independiente, solo falta ver que genera $V$. Supongamos por contradicción que no: existe $${p.v}\in V\setminus\operatorname{gen}(${p.s})$.`, 'b.contradiccion'],
      ['L2', r`Por el teorema de agregar un vector independiente, $${p.s}\cup\{${p.v}\}$ es independiente y tiene $${p.n}+1$ elementos.`, 't.agregar-independiente', ['L1']],
      ['L3', r`Una lista independiente puede completarse hasta una base de $V$, que tendría al menos $${p.n}+1$ elementos.`, 'd.base', ['L2']],
      ['L4', r`Pero todas las bases de $V$ tienen ⟦h1⟧ elementos (la dimensión está bien definida): contradicción.`, 't.dimension-bien-definida', ['L3'], [H('h1', r`$${p.n}$`, [r`$${p.n}$`, r`$${p.n}+1$`, r`$0$`], false)]],
      ['L5', r`Luego $${p.s}$ genera $V$ y es una base. ∎`, 'd.base', ['L4']],
    ],
    dist: p => [[r`En $\mathbb{R}^2$, dos vectores independientes forman base; luego vale en todas las dimensiones.`, 'un ejemplo no prueba el caso general'], [r`Como $${p.s}$ tiene $${p.n}$ vectores, es una base.`, 'falta la independencia (o la generación)']],
    err: p => [['L2', r`Por el teorema de agregar un vector independiente, $${p.s}\cup\{${p.v}\}$ es independiente y tiene $${p.n}$ elementos.`, 'error-de-calculo', 'Al agregar un vector quedan $n+1$ elementos.'], ['L4', r`Pero todas las bases de $V$ tienen $${p.n}+1$ elementos.`, 'error-de-calculo', 'Tienen $n$ elementos, no $n+1$.']],
    valida: [['absurdo', r`Suponer que no genera, agregar un vector fuera del generado y contradecir la dimensión`, 'Es la prueba estándar.']],
    idea: p => r`si no generara, se podría agregar un vector y habría $${p.n}+1$ independientes.`, primero: p => r`supón que $${p.s}$ no genera $V$.`,
  });

  dem2({
    id: 'dem.dim-subespacio', teorema: 't.dim-subespacio', nivel: '5.3', habilidades: ['5.3.dimension', '5.3.espacios', '5.3.demostrar'], requiere: ['t.n-independientes-base', 't.mas-que-generadores'], refsExtra: ['d.base', 'd.dimension', 'b.doble-implicacion'],
    param: rng => ({ w: rng.pick(['W', 'U']), n: rng.pick(['n', 'm']), k: rng.pick(['k', 'd']) }),
    enunciado: p => r`Sea $${p.w}\subseteq V$ subespacio con $\dim V=${p.n}$. Demuestra que $\dim ${p.w}\le ${p.n}$ y que $\dim ${p.w}=${p.n}$ si y solo si $${p.w}=V$.`,
    hip: p => [r`$${p.w}$ subespacio de $V$ y $\dim V=${p.n}$`, 'Puedes citar el teorema de más vectores que generadores y el de $n$ independientes'], meta: p => r`$\dim ${p.w}\le ${p.n}$ y ($\dim ${p.w}=${p.n}\iff ${p.w}=V$)`,
    L: p => [
      ['L1', r`Sea $\{w_1,\dots,w_${p.k}\}$ una base de $${p.w}$, con $${p.k}=\dim ${p.w}$. Es una lista independiente de vectores de $V$.`, 'd.base'],
      ['L2', r`Si fuera $${p.k}>${p.n}$, tendríamos $${p.n}+1$ vectores independientes en un espacio generado por $${p.n}$ vectores, contra el teorema de más vectores que generadores. Luego $${p.k}\le ${p.n}$.`, 't.mas-que-generadores', ['L1']],
      ['L3', r`(⇒) Si $${p.k}=${p.n}$, la base de $${p.w}$ son $${p.n}$ vectores independientes de $V$: por el teorema de $n$ independientes, es una base de $V$.`, 't.n-independientes-base', ['L1']],
      ['L4', r`Entonces $V=\operatorname{gen}(w_1,\dots,w_${p.n})=${p.w}$.`, 'd.base', ['L3']],
      ['L5', r`(⇐) Si $${p.w}=V$, entonces $\dim ${p.w}=\dim V=${p.n}$. ∎`, 'd.dimension', ['L2']],
    ],
    dist: p => [[r`Una recta en $\mathbb{R}^3$ tiene dimensión $1\le3$; luego vale siempre.`, 'un ejemplo no prueba el caso general'], [r`Como $${p.w}\subseteq V$, $\dim ${p.w}\le\dim V$ es evidente.`, 'es lo que hay que demostrar, no un dato']],
    err: p => [['L2', r`Si fuera $${p.k}>${p.n}$ no habría contradicción: los subespacios pueden ser mayores.`, 'conclusion-invalida', 'Sí la hay: $n+1$ independientes en un espacio generado por $n$ vectores.'], ['L4', r`Entonces $V=\operatorname{gen}(w_1,\dots,w_${p.n})$ y por tanto $${p.w}$ es mayor que $V$.`, 'conclusion-invalida', 'Los $w_i$ están en $W$: de $V=\\operatorname{gen}(w_i)\\subseteq W$ y $W\\subseteq V$ sale $W=V$.']],
    valida: [['base', r`Comparar una base de $W$ con las de $V$`, 'Es la prueba estándar.']],
    idea: p => r`una base de $${p.w}$ es una lista independiente en $V$.`, primero: p => r`toma una base de $${p.w}$ y cuéntala.`,
  });

  R.nivel({
    id: '5.3', mundo: 5, titulo: 'Base y dimensión', tema: 'Bases, dimensión y completar a una base',
    habilidades: ['5.3.base', '5.3.dimension', '5.3.completar', '5.3.espacios', '5.3.demostrar'],
    teoremas: ['t.mas-que-generadores', 't.dimension-bien-definida', 't.n-independientes-base', 't.dim-subespacio'],
    leccion: {
      intro: 'Una **base** es una lista de vectores independientes que generan el espacio: cada vector se escribe de una única manera como combinación suya. La **dimensión** es el número de vectores de una base.',
      definiciones: [
        { nombre: 'Dimensión bien definida', tex: 'Todas las bases de un espacio tienen el mismo número de elementos, porque más vectores que generadores son siempre dependientes.' },
        { nombre: 'Reconocer bases', tex: 'En un espacio de dimensión $n$: $n$ vectores independientes forman base; $n$ generadores forman base; más de $n$ vectores son dependientes; menos de $n$ no generan.' },
        { nombre: 'Base de una solución', tex: 'Para $W=\\ker A$ con $A$ de $n$ columnas: $\\dim W=n-\\operatorname{rango}A$; cada variable libre da un vector de la base.' },
        { nombre: 'Dimensiones usuales', tex: '$\\dim\\mathbb{R}^n=n$; matrices $m\\times n$: $mn$; simétricas $n\\times n$: $\\frac{n(n+1)}{2}$; polinomios de grado $\\le n$: $n+1$.' },
      ],
      teorema: 't.n-independientes-base',
      ejemplo: { enunciado: 'Halla una base de $W=\\{(x,y,z):x+y+z=0\\}$.', pasos: ['Despejamos $x=-y-z$: $(x,y,z)=y(-1,1,0)+z(-1,0,1)$.', '$(-1,1,0)$ y $(-1,0,1)$ generan $W$ y son independientes.', 'Una base es $\\{(-1,1,0),(-1,0,1)\\}$ y $\\dim W=2=3-1$.'] },
    },
  });

  if (typeof module !== 'undefined') module.exports = AC;
})(globalThis.AC = globalThis.AC || {});
