/* Mundo 7, nivel 7.2 — Diagonalización. */
(function (AC) {
  const { R, H, T, gen, dem2 } = AC.cont, r = String.raw, M = AC.mat, Rat = AC.Rat, C = AC.conj;
  const ref = (id, tipo, nombre) => R.ref({ id, tipo, nombre });
  ref('d.diagonalizable', 'definicion', 'A es diagonalizable si A = PDP⁻¹ con D diagonal y P invertible'); ref('d.mult-geometrica', 'definicion', 'Multiplicidad geométrica de λ: dim E_λ; algebraica: multiplicidad como raíz del polinomio característico');

  const HB = (id, nombre) => R.habilidad({ id: '7.2.' + id, nombre, nivel: '7.2' });
  HB('diagonalizar', 'Diagonalizar una matriz'); HB('criterios', 'Decidir si es diagonalizable'); HB('potencias', 'Potencias de una matriz'); HB('recurrencias', 'Recurrencias lineales'); HB('demostrar', 'Demostrar con diagonalización');
  const TE = (id, titulo, enunciado, requiere, hab) => R.teorema({ id, titulo, nivel: '7.2', enunciado, requiere, habilidades: hab });
  TE('t.diagonalizable-base', 'Diagonalizable y base de propios', r`$A$ ($n\times n$) es diagonalizable si y solo si hay una base de $\mathbb{Q}^n$ formada por vectores propios de $A$; entonces $A=PDP^{-1}$ con $P$ las columnas propias.`, ['t.semejanza-cambio-base', 't.invertible-equivalencias'], ['7.2.diagonalizar', '7.2.criterios', '7.2.demostrar']);
  TE('t.n-propios-distintos', 'n valores propios distintos', r`Si $A$ ($n\times n$) tiene $n$ valores propios distintos, es diagonalizable.`, ['t.propios-distintos-independientes', 't.n-independientes-base', 't.diagonalizable-base'], ['7.2.criterios', '7.2.diagonalizar', '7.2.demostrar']);
  TE('t.no-diagonalizable-defectiva', 'Matriz defectiva (2×2)', r`Si una $2\times2$ tiene un único valor propio $\lambda$ y $A\neq\lambda I$, no es diagonalizable.`, ['t.diagonalizable-base'], ['7.2.criterios', '7.2.demostrar']);
  TE('t.recurrencia-diagonal', 'Recurrencias con diagonalización', r`Si $x_{k+1}=Ax_k$ y $A=PDP^{-1}$, entonces $x_k=PD^kP^{-1}x_0$.`, ['t.semejante-potencias'], ['7.2.recurrencias', '7.2.potencias', '7.2.demostrar']);

  const F = M.fmt, tx = A => M.tex(A), strMat = A => A.map(f => f.map(String));
  const par = v => '(' + v.join(',') + ')';
  const uni2 = [[[1, 1], [1, 2]], [[1, 2], [0, 1]], [[2, 1], [1, 1]], [[1, 0], [1, 1]], [[3, 1], [2, 1]], [[1, 1], [0, 1]], [[2, 3], [1, 2]], [[1, 3], [1, 2]], [[1, -1], [1, 0]], [[1, 0], [-2, 1]]];
  const unimodular3 = rng => { for (let k = 0; k < 40; k++) { const L = M.de([[1, 0, 0], [rng.int(-2, 2), 1, 0], [rng.int(-2, 2), rng.int(-2, 2), 1]]), U = M.de([[1, rng.int(-2, 2), rng.int(-2, 2)], [0, 1, rng.int(-2, 2)], [0, 0, 1]]), P = M.mul(L, U); if (P.every(f => f.every(x => Math.abs(Number(x.n)) <= 5))) return P; } return M.id(3); };
  const dg = d => d.map((x, i) => d.map((_, j) => (i === j ? x : 0)));
  const A2 = (rng, d1, d2) => { const P = M.de(rng.pick(uni2)); return { A: M.mul(P, M.mul(M.de(dg([d1, d2])), M.inversa(P))), P }; };
  const A3 = (rng, d) => { const P = unimodular3(rng); return { A: M.mul(P, M.mul(M.de(dg(d)), M.inversa(P))), P }; };

  /* ---------- generadores ---------- */
  gen.matriz({
    id: 'w7.n2.matriz-diagonalizante', nivel: '7.2', habilidades: ['7.2.diagonalizar'], dificultad: 3,
    hacer(rng) {
      const tres = rng.chance(0.4), d = tres ? [rng.int(-2, 3), rng.int(-2, 3), rng.int(-2, 3)] : [rng.int(-3, 4), rng.int(-3, 4)]; if (new Set(d).size < d.length) return null; const { A, P } = tres ? A3(rng, d) : A2(rng, ...d), n = d.length;
      return { key: tx(A), enun: 'Halla una matriz invertible $P$ ($' + n + '\\times' + n + '$) tal que $P^{-1}AP$ sea **diagonal**, con $A=' + tx(A) + '$. (Los valores propios de $A$ son enteros.)', res: F(P), etiqueta: 'P', verificador: { id: 'matriz-diagonalizante', args: { A: strMat(A), n } },
        firmas: [['identidad', F(M.id(n)), 'Con $P=I$ queda $P^{-1}AP=A$, que no es diagonal: las columnas de $P$ deben ser vectores propios.'], ['columnas-iguales', F(P.map(f => f.map((_, j) => f[0]))), 'Las columnas deben ser independientes (una base de vectores propios).']].filter(f => !M.diagonalizaCon(A, f[1].map(row => row.map(x => Rat.parse(x))))),
        pistas: ['Orientación: las columnas de $P$ son vectores propios de $A$.', 'Idea clave: halla los valores propios y para cada uno un vector no nulo de $\\ker(A-\\lambda I)$.', 'Primer paso: calcula $\\operatorname{tr}A$ y $\\det A$ (o el polinomio característico).'], expl: 'Una $P$ posible es $' + tx(P) + '$.' };
    },
  });

  gen.eleccion({
    id: 'w7.n2.es-diagonalizable', nivel: '7.2', habilidades: ['7.2.criterios'], dificultad: 3,
    hacer(rng) {
      const a = rng.int(-2, 3), b = rng.int(-2, 3), c = rng.int(-2, 3); const caso = rng.pick(['distintos', 'jordan', 'repetido-bueno', 'complejos']); let A, ok;
      if (caso === 'distintos') { if (new Set([a, b, c]).size < 3) return null; A = A3(rng, [a, b, c]).A; ok = 'Sí: tiene $3$ valores propios distintos'; }
      else if (caso === 'jordan') { if (a === b) return null; A = M.de([[a, 1, 0], [0, a, 0], [0, 0, b]]); ok = 'No: el espacio propio de $' + a + '$ tiene dimensión menor que su multiplicidad'; }
      else if (caso === 'repetido-bueno') { if (a === b) return null; A = M.mul(unimodular3(rng), M.mul(M.de(dg([a, a, b])), M.inversa(unimodular3(rng)))); const P = unimodular3(rng); A = M.mul(P, M.mul(M.de(dg([a, a, b])), M.inversa(P))); ok = 'Sí: los espacios propios suman dimensión $3$'; }
      else { A = M.de([[0, -1], [1, 0]]); ok = 'No: no tiene valores propios reales'; }
      const todas = ['Sí: tiene $3$ valores propios distintos', 'No: el espacio propio de $' + a + '$ tiene dimensión menor que su multiplicidad', 'Sí: los espacios propios suman dimensión $3$', 'No: no tiene valores propios reales'].filter(t => t !== ok);
      const razon = { distintos: 'Con $3$ valores propios distintos es diagonalizable.', jordan: 'Hay un solo vector propio independiente para el valor repetido.', 'repetido-bueno': 'El valor repetido tiene dos vectores propios independientes.', complejos: 'Su polinomio característico $\\lambda^2+1$ no tiene raíces reales.' }[caso];
      const nombre = caso === 'complejos' ? '2' : '3';
      return { key: tx(A) + caso, enun: '¿Es diagonalizable $A=' + tx(A) + '$ (sobre $\\mathbb{R}$)?', ok, malas: rng.sample(todas, 3).map((t, i) => ['otra-' + i, t, 'Esa razón no corresponde a esta matriz. ' + razon]),
        pistas: ['Orientación: hallar los valores propios y la dimensión de cada espacio propio.', 'Idea clave: diagonalizable si y solo si los espacios propios suman dimensión ' + nombre + '.', 'Primer paso: calcula los valores propios.'], expl: razon };
    },
  });

  gen.matriz({
    id: 'w7.n2.hallar-diagonal', nivel: '7.2', habilidades: ['7.2.diagonalizar'], dificultad: 3,
    hacer(rng) {
      const d1 = rng.int(-3, 4), d2 = rng.int(-3, 4); if (d1 === d2) return null; const { A, P } = A2(rng, d1, d2), D = M.de(dg([d1, d2])), v = M.T(P);
      return { key: tx(A) + par(v[0]) + par(v[1]), enun: 'Los vectores $v_1=' + par(v[0]) + '$ y $v_2=' + par(v[1]) + '$ son vectores propios de $A=' + tx(A) + '$. Halla la matriz diagonal $D=P^{-1}AP$ con $P=(v_1\\ v_2)$.', res: F(D), etiqueta: 'D',
        firmas: [['orden-invertido', F(M.de(dg([d2, d1]))), 'El orden de la diagonal sigue el orden de las columnas de $P$: $v_1$ primero.'], ['A', F(A), 'Esa es $A$; $D$ es diagonal con los valores propios de $v_1$ y $v_2$.']].filter(f => JSON.stringify(f[1]) !== JSON.stringify(F(D))),
        pistas: ['Orientación: $D$ tiene en la diagonal los valores propios de $v_1$ y $v_2$.', 'Idea clave: calcula $Av_1$ y compáralo con $v_1$.', 'Primer paso: multiplica $A$ por $v_1$.'], expl: '$D=' + tx(D) + '$.' };
    },
  });

  gen.matriz({
    id: 'w7.n2.potencia-diagonalizando', nivel: '7.2', habilidades: ['7.2.potencias', '7.2.diagonalizar'], dificultad: 4,
    hacer(rng) {
      const d1 = rng.int(-2, 3), d2 = rng.int(-2, 3), k = rng.int(3, 6); if (d1 === d2) return null; const { A } = A2(rng, d1, d2), Ak = M.pot(A, k);
      return { key: tx(A) + k, enun: 'Calcula $A^{' + k + '}$ para $A=' + tx(A) + '$ diagonalizando (los valores propios son enteros).', res: F(Ak), etiqueta: 'A^' + k,
        firmas: [['por-entradas', F(A.map(f => f.map(x => x.mul(x).mul(x)))), 'No se eleva cada entrada: $A^k=PD^kP^{-1}$.'], ['una-sola-vez', F(A), 'Eso es $A^1$; hay que aplicar $A$ ' + k + ' veces: $A^k=PD^kP^{-1}$.']].filter(f => JSON.stringify(f[1]) !== JSON.stringify(F(Ak))),
        pistas: ['Orientación: encuentra $P$ y $D$ con $A=PDP^{-1}$.', 'Idea clave: $A^k=PD^kP^{-1}$ y $D^k$ eleva cada entrada diagonal.', 'Primer paso: halla los valores propios con traza $' + M.traza(A) + '$ y determinante $' + M.det(A) + '$.'], expl: '$A^{' + k + '}=' + tx(Ak) + '$.' };
    },
  });

  gen.entero({
    id: 'w7.n2.recurrencia', nivel: '7.2', habilidades: ['7.2.recurrencias'], dificultad: 4,
    hacer(rng) {
      const r1 = rng.int(1, 3), r2 = rng.int(-2, 3); if (r1 === r2 || r2 === 0) return null; const s = r1 + r2, p = r1 * r2, x0 = rng.int(0, 3), x1 = rng.int(1, 4), k = rng.int(5, 8);
      const x = [x0, x1]; for (let i = 2; i <= k; i++) x.push(s * x[i - 1] - p * x[i - 2]);
      return { key: [s, p, x0, x1, k].join(), enun: 'La sucesión cumple $x_{n+2}=' + s + 'x_{n+1}' + (p > 0 ? '-' : '+') + Math.abs(p) + 'x_n$ con $x_0=' + x0 + '$ y $x_1=' + x1 + '$. Calcula $x_{' + k + '}$ (puedes usar la matriz $\\begin{pmatrix}' + s + '&' + (-p) + '\\\\1&0\\end{pmatrix}$ y su diagonalización, de valores propios $' + r1 + '$ y $' + r2 + '$).', res: x[k],
        firmas: [['indice-corrido', x[k - 1], 'Revisa el índice: se pide $x_' + k + '$.'], ['signo-recurrencia', (() => { const y = [x0, x1]; for (let i = 2; i <= k; i++) y.push(s * y[i - 1] + p * y[i - 2]); return y[k]; })(), 'Revisa el signo del término $x_n$ en la recurrencia.']].filter(f => f[1] !== x[k]),
        pistas: ['Orientación: aplica la recurrencia paso a paso o diagonaliza.', 'Idea clave: $\\binom{x_{n+1}}{x_{n+2}}=A\\binom{x_n}{x_{n+1}}$.', 'Primer paso: calcula $x_2$.'], expl: '$x_{' + k + '}=' + x[k] + '$.' };
    },
  });

  gen.entero({
    id: 'w7.n2.parametro-defectiva', nivel: '7.2', habilidades: ['7.2.criterios'], dificultad: 3,
    hacer(rng) {
      const a = rng.int(-3, 4), m = rng.pick([1, 2, 3, -1]); if (a === 0) return null;
      return { key: a + ',' + m, enun: 'Sea $A_k=\\begin{pmatrix}' + a + '&' + (m === 1 ? '' : m) + 'k\\\\0&' + a + '\\end{pmatrix}$. ¿Para qué valor de $k$ es $A_k$ **diagonalizable**?', res: 0,
        firmas: [['uno', 1, 'Con $k=1$ la matriz tiene un único valor propio $' + a + '$ y no es múltiplo de la identidad: no es diagonalizable.'], ['a', a, 'Ese es el valor propio, no el parámetro $k$.']].filter(f => f[1] !== 0),
        pistas: ['Orientación: el único valor propio es $' + a + '$ (matriz triangular).', 'Idea clave: una $2\\times2$ con un único valor propio es diagonalizable solo si es múltiplo de $I$.', 'Primer paso: ¿cuándo $A_k=' + a + 'I$?'], expl: 'Solo si $k=0$, cuando $A_k=' + a + 'I$.' };
    },
  });

  gen.entero({
    id: 'w7.n2.propios-independientes', nivel: '7.2', habilidades: ['7.2.criterios'], dificultad: 3,
    hacer(rng) {
      const a = rng.int(-2, 3), b = rng.int(-2, 3), c = rng.int(-2, 3); const filas = rng.pick([[[a, 1, 0], [0, a, 0], [0, 0, b]], [[a, 0, 0], [0, b, 1], [0, 0, b]], [[a, 0, 0], [0, a, 0], [0, 0, a]], [[a, 1, 0], [0, a, 1], [0, 0, a]]]); const A = M.de(filas), vp = M.valoresPropios(A).valores; if (vp.length === 0) return null;
      const tot = vp.reduce((s, x) => s + M.espacioPropio(A, x.v).length, 0); if (a === b && filas[2][2] !== filas[0][0]) return null;
      return { key: tx(A), enun: '¿Cuál es el **máximo** número de vectores propios linealmente independientes de $A=' + tx(A) + '$?', res: tot,
        firmas: [['valores-propios', vp.length, 'Cuenta vectores propios independientes: suma las dimensiones de los espacios propios, no el número de valores propios distintos.'], ['tres', 3, 'Solo habría $3$ si $A$ fuera diagonalizable; calcula las dimensiones de los espacios propios.']].filter(f => f[1] !== tot),
        pistas: ['Orientación: para cada valor propio calcula $\\dim\\ker(A-\\lambda I)$.', 'Idea clave: el máximo es la suma de esas dimensiones.', 'Primer paso: lee los valores propios (la matriz es triangular).'], expl: 'Hay $' + tot + '$ vectores propios independientes.' };
    },
  });

  /* ---------- demostraciones ---------- */
  dem2({
    id: 'dem.diagonalizable-base', teorema: 't.diagonalizable-base', nivel: '7.2', habilidades: ['7.2.diagonalizar', '7.2.criterios', '7.2.demostrar'], requiere: ['t.semejanza-cambio-base', 't.invertible-equivalencias'], refsExtra: ['d.diagonalizable', 'd.propio', 'd.invertible'],
    param: rng => ({ a: rng.pick(['A', 'B']), p: rng.pick(['P', 'S']), d: rng.pick(['D', 'Λ']), v: rng.pick(['v', 'p']) }),
    enunciado: p => r`Demuestra que $${p.a}$ ($n\times n$) es diagonalizable ($${p.a}=${p.p}${p.d}${p.p}^{-1}$ con $${p.d}$ diagonal) si y solo si hay una base de $\mathbb{Q}^n$ formada por vectores propios de $${p.a}$.`,
    hip: p => [r`$${p.a}$ es $n\times n$`, 'Puedes citar el criterio de invertibilidad por columnas independientes'], meta: p => r`diagonalizable $\iff$ base de vectores propios`,
    L: p => [
      ['L1', r`(⇒) Si $${p.a}=${p.p}${p.d}${p.p}^{-1}$, entonces $${p.a}${p.p}=${p.p}${p.d}$. La columna $j$ de esta igualdad dice $${p.a}${p.v}_j=d_j${p.v}_j$, con $${p.v}_j$ la columna $j$ de $${p.p}$.`, 'd.diagonalizable'],
      ['L2', r`Como $${p.p}$ es invertible, sus columnas $${p.v}_j$ son ⟦h1⟧ y no nulas: forman una base de $\mathbb{Q}^n$ de vectores propios.`, 't.invertible-equivalencias', ['L1'], [H('h1', 'independientes', ['independientes', 'iguales', 'ortogonales'], false)]],
      ['L3', r`(⇐) Sea $(${p.v}_1,\dots,${p.v}_n)$ una base de vectores propios con $${p.a}${p.v}_j=d_j${p.v}_j$. Formamos $${p.p}=(${p.v}_1\ \cdots\ ${p.v}_n)$ y $${p.d}=\mathrm{diag}(d_j)$.`, 'd.propio'],
      ['L4', r`Entonces $${p.a}${p.p}=(${p.a}${p.v}_1\ \cdots\ ${p.a}${p.v}_n)=(d_1${p.v}_1\ \cdots\ d_n${p.v}_n)=${p.p}${p.d}$.`, 'd.diagonalizable', ['L3']],
      ['L5', r`Como las columnas de $${p.p}$ son independientes, $${p.p}$ es invertible (criterio de invertibilidad) y $${p.a}=${p.p}${p.d}${p.p}^{-1}$. ∎`, 't.invertible-equivalencias', ['L4']],
    ],
    dist: p => [[r`Con $\mathrm{diag}(1,2)$ la base canónica es de vectores propios; luego siempre.`, 'un ejemplo no prueba el caso general'], [r`Como $${p.a}$ tiene vectores propios, es diagonalizable.`, 'hacen falta $n$ vectores propios independientes']],
    err: p => [['L1', r`(⇒) De $${p.a}=${p.p}${p.d}${p.p}^{-1}$ resulta $${p.p}${p.a}=${p.d}${p.p}$.`, 'error-de-calculo', 'Multiplicando por $P$ a la derecha: $AP=PD$.'], ['L4', r`Entonces $${p.a}${p.p}=(d_1${p.v}_1\ \cdots\ d_n${p.v}_n)=${p.d}${p.p}$.`, 'error-de-calculo', 'Cada columna se multiplica por su escalar: es $PD$ (diagonal a la derecha).']],
    valida: [['ap-pd', r`Usar $AP=PD$ columna a columna`, 'Es la prueba estándar.']],
    idea: p => r`$${p.a}${p.p}=${p.p}${p.d}$ dice, columna a columna, que cada columna de $${p.p}$ es vector propio.`, primero: p => r`prueba (⇒) escribiendo $${p.a}${p.p}=${p.p}${p.d}$.`,
  });

  dem2({
    id: 'dem.n-propios-distintos', teorema: 't.n-propios-distintos', nivel: '7.2', habilidades: ['7.2.criterios', '7.2.diagonalizar', '7.2.demostrar'], requiere: ['t.propios-distintos-independientes', 't.n-independientes-base', 't.diagonalizable-base'], refsExtra: ['d.propio', 'd.base', 'd.diagonalizable'],
    param: rng => ({ a: rng.pick(['A', 'B']), v: rng.pick(['v', 'p']), l: rng.pick(['λ', 'μ']) }),
    enunciado: p => r`Demuestra que si $${p.a}$ ($n\times n$) tiene $n$ valores propios distintos, entonces es diagonalizable.`,
    hip: p => [r`$${p.a}$ tiene $n$ valores propios distintos $${p.l}_1,\dots,${p.l}_n$`, 'Puedes citar la independencia de vectores propios, el criterio de $n$ independientes y la caracterización de diagonalizable'], meta: p => r`$${p.a}$ diagonalizable`,
    L: p => [
      ['L1', r`Para cada $${p.l}_i$ existe un vector propio $${p.v}_i\neq0$ con $${p.a}${p.v}_i=${p.l}_i${p.v}_i$.`, 'd.propio'],
      ['L2', r`Como los $${p.l}_i$ son distintos, $${p.v}_1,\dots,${p.v}_n$ son linealmente independientes.`, 't.propios-distintos-independientes', ['L1']],
      ['L3', r`Son $n$ vectores independientes en un espacio de dimensión $n$: por el criterio de $n$ independientes, ⟦h1⟧.`, 't.n-independientes-base', ['L2'], [H('h1', 'forman una base', ['forman una base', 'son ortogonales', 'son iguales'], false)]],
      ['L4', r`Hay una base de $\mathbb{Q}^n$ formada por vectores propios de $${p.a}$; por la caracterización de diagonalizable, $${p.a}$ es diagonalizable. ∎`, 't.diagonalizable-base', ['L3']],
    ],
    dist: p => [[r`La matriz $\begin{pmatrix}1&1\\0&2\end{pmatrix}$ lo cumple y es diagonalizable; luego siempre.`, 'un ejemplo no prueba el caso general'], [r`Si es diagonalizable entonces tiene $n$ valores propios distintos.`, 'es la implicación contraria (y falsa: $I$ es diagonalizable)']],
    err: p => [['L2', r`Como los $${p.l}_i$ son distintos, $${p.v}_1,\dots,${p.v}_n$ son iguales.`, 'error-de-calculo', 'Son **independientes**, no iguales.'], ['L3', r`Son $n$ vectores independientes, por lo que generan un espacio de dimensión $n-1$.`, 'error-de-calculo', 'Generan un espacio de dimensión $n$: forman una base.']],
    valida: [['independencia', r`Usar que los propios de valores distintos son independientes y que $n$ independientes son base`, 'Es la prueba estándar.']],
    idea: p => r`$n$ propios independientes en dimensión $n$ forman una base.`, primero: p => r`toma un vector propio para cada valor propio.`,
  });

  dem2({
    id: 'dem.no-diagonalizable-defectiva', teorema: 't.no-diagonalizable-defectiva', nivel: '7.2', habilidades: ['7.2.criterios', '7.2.demostrar'], requiere: ['t.diagonalizable-base'], refsExtra: ['d.diagonalizable', 'd.propio', 'b.contradiccion'],
    param: rng => ({ a: rng.pick(['A', 'B']), l: rng.pick(['λ', 'μ']), p: rng.pick(['P', 'S']), d: rng.pick(['D', 'Λ']) }),
    enunciado: p => r`Sea $${p.a}$ una matriz $2\times2$ con un único valor propio $${p.l}$ y $${p.a}\neq ${p.l}I$. Demuestra que $${p.a}$ no es diagonalizable.`,
    hip: p => [r`el único valor propio de $${p.a}$ es $${p.l}$ y $${p.a}\neq ${p.l}I$`, 'Puedes citar la caracterización de las matrices diagonalizables'], meta: p => r`$${p.a}$ no es diagonalizable`,
    L: p => [
      ['L1', r`Supongamos por contradicción que $${p.a}=${p.p}${p.d}${p.p}^{-1}$ con $${p.d}$ diagonal.`, 'b.contradiccion'],
      ['L2', r`Por la caracterización de diagonalizable, las entradas de la diagonal de $${p.d}$ son valores propios de $${p.a}$ (cada columna de $${p.p}$ es vector propio).`, 't.diagonalizable-base', ['L1']],
      ['L3', r`Como el único valor propio es $${p.l}$, $${p.d}=${p.l}I$.`, 'd.propio', ['L2']],
      ['L4', r`Entonces $${p.a}=${p.p}(${p.l}I)${p.p}^{-1}=${p.l}(${p.p}${p.p}^{-1})$, que es igual a ⟦h1⟧.`, 'd.diagonalizable', ['L3'], [H('h1', r`$${p.l}I$`, [r`$${p.l}I$`, r`$0$`, r`$${p.p}$`], false)]],
      ['L5', r`Esto contradice $${p.a}\neq ${p.l}I$. Luego $${p.a}$ no es diagonalizable. ∎`, 'b.contradiccion', ['L4']],
    ],
    dist: p => [[r`La matriz $\begin{pmatrix}1&1\\0&1\end{pmatrix}$ no es diagonalizable; luego siempre.`, 'un ejemplo no prueba el caso general'], [r`Como el valor propio se repite, la matriz no puede ser diagonalizable.`, '$I$ tiene un valor propio repetido y es diagonal']],
    err: p => [['L3', r`Como el único valor propio es $${p.l}$, $${p.d}=0$.`, 'error-de-calculo', 'La diagonal tiene el valor propio $\\lambda$, no $0$.'], ['L4', r`Entonces $${p.a}=${p.p}(${p.l}I)${p.p}^{-1}=${p.l}${p.p}^2$.`, 'error-de-calculo', '$PP^{-1}=I$.']],
    valida: [['absurdo', r`Suponer $A=PDP^{-1}$ y obtener $A=\lambda I$`, 'Es la prueba estándar.']],
    idea: p => r`si fuera diagonalizable, $${p.d}$ tendría solo el valor $${p.l}$ y $${p.a}=${p.l}I$.`, primero: p => r`supón que $${p.a}=${p.p}${p.d}${p.p}^{-1}$.`,
  });

  dem2({
    id: 'dem.recurrencia-diagonal', teorema: 't.recurrencia-diagonal', nivel: '7.2', habilidades: ['7.2.recurrencias', '7.2.potencias', '7.2.demostrar'], requiere: ['t.semejante-potencias'], refsExtra: ['d.diagonalizable', 'd.hip-induccion', 'b.peano'],
    param: rng => ({ x: rng.pick(['x', 'u']), a: rng.pick(['A', 'M']), p: rng.pick(['P', 'S']), d: rng.pick(['D', 'Λ']), k: rng.pick(['k', 'n']) }),
    enunciado: p => r`Sea $${p.x}_{${p.k}+1}=${p.a}${p.x}_${p.k}$ con $${p.a}=${p.p}${p.d}${p.p}^{-1}$. Demuestra que $${p.x}_${p.k}=${p.p}${p.d}^${p.k}${p.p}^{-1}${p.x}_0$ para todo $${p.k}\ge0$.`,
    hip: p => [r`$${p.x}_{${p.k}+1}=${p.a}${p.x}_${p.k}$ y $${p.a}=${p.p}${p.d}${p.p}^{-1}$`, 'Puedes citar la fórmula de potencias de matrices semejantes'], meta: p => r`$${p.x}_${p.k}=${p.p}${p.d}^${p.k}${p.p}^{-1}${p.x}_0$`,
    L: p => [
      ['L1', r`Por inducción, $${p.x}_${p.k}=${p.a}^${p.k}${p.x}_0$: para $${p.k}=0$ es $${p.x}_0=I${p.x}_0$ y si vale para $${p.k}$, $${p.x}_{${p.k}+1}=${p.a}${p.x}_${p.k}=${p.a}^{${p.k}+1}${p.x}_0$.`, 'd.hip-induccion'],
      ['L2', r`Por el teorema de las potencias de matrices semejantes, $${p.a}^${p.k}=${p.p}${p.d}^${p.k}${p.p}^{-1}$ para $${p.k}\ge1$.`, 't.semejante-potencias', ['L1']],
      ['L3', r`Sustituyendo, $${p.x}_${p.k}=${p.p}${p.d}^${p.k}${p.p}^{-1}${p.x}_0$.`, 'd.diagonalizable', ['L1', 'L2']],
      ['L4', r`Para $${p.k}=0$ el lado derecho es $${p.p}${p.p}^{-1}${p.x}_0$, que es igual a ⟦h1⟧, que coincide. ∎`, 'b.peano', ['L3'], [H('h1', r`$${p.x}_0$`, [r`$${p.x}_0$`, r`$0$`, r`$${p.p}$`], false)]],
    ],
    dist: p => [[r`Con $A=\mathrm{diag}(2,3)$ se cumple la fórmula; luego siempre.`, 'un ejemplo no prueba el caso general'], [r`Como $${p.d}$ es diagonal, $${p.x}_${p.k}=${p.d}^${p.k}${p.x}_0$.`, 'faltan $P$ y $P^{-1}$']],
    err: p => [['L1', r`Por inducción, $${p.x}_${p.k}=${p.a}${p.k}${p.x}_0$.`, 'error-de-calculo', 'Es la potencia $A^k$, no un producto con $k$.'], ['L3', r`Sustituyendo, $${p.x}_${p.k}=${p.p}^{-1}${p.d}^${p.k}${p.p}${p.x}_0$.`, 'error-de-calculo', 'La fórmula es $PD^kP^{-1}$.']],
    valida: [['inducción', r`Probar $x_k=A^kx_0$ por inducción y sustituir $A^k=PD^kP^{-1}$`, 'Es la prueba estándar.']],
    idea: p => r`$${p.x}_${p.k}=${p.a}^${p.k}${p.x}_0$ y $${p.a}^${p.k}=${p.p}${p.d}^${p.k}${p.p}^{-1}$.`, primero: p => r`prueba por inducción que $${p.x}_${p.k}=${p.a}^${p.k}${p.x}_0$.`,
  });

  R.nivel({
    id: '7.2', mundo: 7, titulo: 'Diagonalización', tema: 'Diagonalizar, potencias y recurrencias',
    habilidades: ['7.2.diagonalizar', '7.2.criterios', '7.2.potencias', '7.2.recurrencias', '7.2.demostrar'],
    teoremas: ['t.diagonalizable-base', 't.n-propios-distintos', 't.no-diagonalizable-defectiva', 't.recurrencia-diagonal'],
    leccion: {
      intro: 'Una matriz es **diagonalizable** si en alguna base su matriz es diagonal: $A=PDP^{-1}$. Las columnas de $P$ son vectores propios y la diagonal de $D$ guarda los valores propios.',
      definiciones: [
        { nombre: 'Criterio', tex: '$A$ ($n\\times n$) es diagonalizable $\\iff$ existe una base de vectores propios $\\iff$ $\\sum_\\lambda\\dim E_\\lambda=n$. Con $n$ valores propios distintos siempre lo es.' },
        { nombre: 'Cuándo falla', tex: 'Falla si un valor propio repetido tiene menos vectores propios independientes que su multiplicidad (por ejemplo $\\begin{pmatrix}1&1\\\\0&1\\end{pmatrix}$) o si no hay valores propios reales (un giro).' },
        { nombre: 'Potencias', tex: '$A^k=PD^kP^{-1}$: eleva solo la diagonal.' },
        { nombre: 'Recurrencias', tex: 'Una recurrencia lineal $x_{k+1}=Ax_k$ se resuelve con $x_k=PD^kP^{-1}x_0$; así se obtienen fórmulas cerradas.' },
      ],
      teorema: 't.diagonalizable-base',
      ejemplo: { enunciado: 'Diagonaliza $A=\\begin{pmatrix}2&1\\\\1&2\\end{pmatrix}$.', pasos: ['Valores propios $3$ y $1$ con vectores propios $(1,1)$ y $(1,-1)$.', '$P=\\begin{pmatrix}1&1\\\\1&-1\\end{pmatrix}$ y $D=\\begin{pmatrix}3&0\\\\0&1\\end{pmatrix}$.', 'Entonces $A=PDP^{-1}$ y $A^k=PD^kP^{-1}$.'] },
    },
  });

  if (typeof module !== 'undefined') module.exports = AC;
})(globalThis.AC = globalThis.AC || {});
