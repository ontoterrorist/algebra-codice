/* Mundo 4, nivel 4.3 — Rango e inversa. */
(function (AC) {
  const { R, H, T, gen, dem2 } = AC.cont, r = String.raw, M = AC.mat, Rat = AC.Rat;
  const ref = (id, tipo, nombre) => R.ref({ id, tipo, nombre });
  ref('d.rango', 'definicion', 'Rango de A: número de pivotes de su forma escalonada reducida'); ref('d.invertible', 'definicion', 'A es invertible si existe B con AB = BA = I');

  const HB = (id, nombre) => R.habilidad({ id: '4.3.' + id, nombre, nivel: '4.3' });
  HB('rango', 'Calcular el rango'); HB('inversa', 'Calcular la inversa'); HB('rouche', 'Rouché-Capelli'); HB('invertibilidad', 'Criterios de invertibilidad'); HB('demostrar', 'Demostrar con rango e inversa');
  const TE = (id, titulo, enunciado, requiere, hab) => R.teorema({ id, titulo, nivel: '4.3', enunciado, requiere, habilidades: hab });
  TE('t.rouche-capelli', 'Rouché-Capelli', r`$Ax=b$ es compatible si y solo si $\operatorname{rango}A=\operatorname{rango}(A\mid b)$.`, ['t.incompatible'], ['4.3.rouche', '4.3.rango', '4.3.demostrar']);
  TE('t.inversa-gauss', 'Inversa por Gauss-Jordan', r`$A$ ($n\times n$) es invertible si y solo si su forma reducida es $I$; entonces $(A\mid I)\to(I\mid A^{-1})$.`, ['t.ops-elementales', 't.mat-inversa-producto'], ['4.3.inversa', '4.3.invertibilidad', '4.3.demostrar']);
  TE('t.invertible-equivalencias', 'Criterios de invertibilidad', r`Para $A$ cuadrada $n\times n$: $A$ invertible $\iff$ $Ax=0$ solo tiene $x=0$ $\iff$ $\operatorname{rango}A=n$.`, ['t.inversa-gauss'], ['4.3.invertibilidad', '4.3.rango', '4.3.demostrar']);
  TE('t.nulidad', 'Rango más nulidad', r`El sistema $Ax=0$ ($A$ de tamaño $m\times n$) tiene $n-\operatorname{rango}A$ variables libres.`, ['t.solucion-general'], ['4.3.rango', '4.3.rouche', '4.3.demostrar']);

  const F = M.fmt, tx = A => M.tex(A), sis = (A, b) => '$' + M.texSistema(A, b) + '$';
  const rm = (rng, m, n, lo, hi) => M.de(Array.from({ length: m }, () => Array.from({ length: n }, () => rng.int(lo, hi))));
  const conRango = (rng, m, n, rg) => { const base = rm(rng, rg, n, -3, 4); if (M.rango(base) < rg) return null; const f = base.slice(); while (f.length < m) { const a = rng.int(-2, 2), b = rng.int(-2, 2); f.push(base[0].map((x, j) => x.mul(Rat.of(a)).add(base[rg - 1][j].mul(Rat.of(b))))); } const A = rng.shuffle(f); return M.rango(A) === rg ? A : null; };

  /* ---------- generadores ---------- */
  gen.entero({
    id: 'w4.n3.rango', nivel: '4.3', habilidades: ['4.3.rango'], dificultad: 2,
    hacer(rng) {
      const m = rng.int(3, 4), n = rng.int(3, 5), rg = rng.int(1, Math.min(m, n) - 1 || 1), A = conRango(rng, m, n, rg); if (!A) return null;
      return { key: tx(A), enun: 'Calcula el rango de $A=' + tx(A) + '$.', res: rg,
        firmas: [['filas', m, 'Eso es el número de filas: algunas son combinación de otras y no cuentan.'], ['minimo', Math.min(m, n), 'Es el máximo rango posible; esta matriz tiene filas dependientes.'], ['columnas', n, 'Eso es el número de columnas, no el de pivotes.']].filter(f => f[1] !== rg),
        pistas: ['Orientación: el rango es el número de pivotes al escalonar.', 'Idea clave: busca filas que sean combinación de otras.', 'Primer paso: escalona $A$ con operaciones elementales.'], expl: 'El rango es $' + rg + '$.' };
    },
  });

  gen.matriz({
    id: 'w4.n3.inversa-3x3', nivel: '4.3', habilidades: ['4.3.inversa'], dificultad: 4,
    hacer(rng) {
      const A = rm(rng, 3, 3, -2, 3), d = M.det(A); if (d.isZero() || !d.isInt() || Math.abs(Number(d.n)) > 3) return null; const I = M.inversa(A);
      return { key: tx(A), enun: 'Halla $A^{-1}$ para $A=' + tx(A) + '$ escalonando $(A\\mid I)$.', res: F(I), etiqueta: 'A⁻¹',
        firmas: [['transpuesta', F(M.T(I)), 'Cuidado: la inversa no es la transpuesta de lo que obtuviste; revisa filas y columnas.'], ['sin-dividir', F(M.adjunta(A)), 'La adjunta hay que dividirla entre $\\det A=' + d + '$.']].filter(f => JSON.stringify(f[1]) !== JSON.stringify(F(I))),
        pistas: ['Orientación: escribe $(A\\mid I)$ y lleva el lado izquierdo a $I$.', 'Idea clave: lo que aparece a la derecha es $A^{-1}$.', 'Primer paso: usa la fila 1 para hacer ceros en la primera columna.'], expl: '$A^{-1}=' + tx(I) + '$.' };
    },
  });

  gen.eleccion({
    id: 'w4.n3.rouche', nivel: '4.3', habilidades: ['4.3.rouche'], dificultad: 3,
    hacer(rng) {
      const n = rng.int(3, 5), rA = rng.int(1, n), rAb = rng.pick([rA, Math.min(rA + 1, n)]), m = rng.int(Math.max(rAb, 3), 6);
      const c = rAb > rA ? 'ninguna solución' : rA === n ? 'una única solución' : 'infinitas soluciones';
      const todas = ['ninguna solución', 'una única solución', 'infinitas soluciones'];
      return { key: [n, rA, rAb, m].join(), enun: 'Un sistema de $' + m + '$ ecuaciones con $' + n + '$ incógnitas tiene $\\operatorname{rango}A=' + rA + '$ y $\\operatorname{rango}(A\\mid b)=' + rAb + '$. ¿Cuántas soluciones tiene?', ok: c,
        malas: todas.filter(t => t !== c).map((t, i) => ['otra-' + i, t, 'Compara los rangos: si difieren no hay solución; si coinciden con $n=' + n + '$ es única; si coinciden y son menores que $n$ hay infinitas.']).concat([['dos', 'exactamente dos soluciones', 'Un sistema lineal tiene $0$, $1$ o infinitas soluciones.']]),
        pistas: ['Orientación: compara $\\operatorname{rango}A$ con $\\operatorname{rango}(A\\mid b)$.', 'Idea clave: Rouché-Capelli: compatible si coinciden; entonces única si el rango es $n$.', 'Primer paso: ¿coinciden los dos rangos?'], expl: 'Resultado: ' + c + '.' };
    },
  });

  gen.entero({
    id: 'w4.n3.parametro-singular', nivel: '4.3', habilidades: ['4.3.invertibilidad'], dificultad: 4,
    hacer(rng) {
      const A = rm(rng, 3, 3, -3, 4), i = rng.int(0, 2), j = rng.int(0, 2), at = (v) => { const B = M.copia(A); B[i][j] = Rat.of(v); return B; };
      const d0 = M.det(at(0)), d1 = M.det(at(1)), al = d1.sub(d0); if (al.isZero()) return null; const k = d0.neg().div(al); if (!k.isInt()) return null;
      const B = at(0); const texA = M.tex(B).replace(/&|\\\\/g, m => m);
      const filas = A.map((f, a) => f.map((x, b) => (a === i && b === j ? 'k' : M.texN(x)))); const t = '\\begin{pmatrix}' + filas.map(f => f.join('&')).join('\\\\') + '\\end{pmatrix}';
      const kk = Number(k.n);
      return { key: t, enun: '¿Para qué valor de $k$ la matriz $' + t + '$ **no** es invertible?', res: kk,
        firmas: [['signo', -kk, 'Revisa el signo al despejar $k$ de $\\det=0$.'], ['cero', 0, '$k=0$ no la hace singular: calcula el determinante en función de $k$.']].filter(f => f[1] !== kk),
        pistas: ['Orientación: no invertible equivale a determinante $0$ (o rango menor).', 'Idea clave: el determinante es una expresión lineal en $k$.', 'Primer paso: desarrolla el determinante por la fila o columna que contiene a $k$.'], expl: '$\\det=0$ cuando $k=' + kk + '$.' };
    },
  });

  gen.tupla({
    id: 'w4.n3.resolver-con-inversa', nivel: '4.3', habilidades: ['4.3.inversa'], dificultad: 3,
    hacer(rng) {
      const A = rm(rng, 2, 2, -3, 4), d = M.det(A); if (d.isZero() || !d.isInt() || Math.abs(Number(d.n)) > 5) return null; const I = M.inversa(A), x = [rng.int(-4, 5), rng.int(-4, 5)], b = M.aVec(M.mul(A, M.colVec(x)));
      return { key: tx(A) + b.join(), enun: 'Se sabe que $A^{-1}=' + tx(I) + '$. Resuelve $Ax=b$ con $b=' + M.texVec(b) + '$ y escribe $(x_1,x_2)$.', campos: ['x₁', 'x₂'], res: x.map(String),
        firmas: [['multiplica-por-A', M.aVec(M.mul(M.inversa(I), M.colVec(b))).map(String), 'Se multiplica por $A^{-1}$ (la inversa que te dan), no por $A$.'], ['orden', [x[1], x[0]], 'Los campos son $x_1$ y luego $x_2$.']].filter(f => f[1].join() !== x.join()),
        pistas: ['Orientación: $x=A^{-1}b$.', 'Idea clave: multiplica la matriz inversa por el vector $b$ (fila por columna).', 'Primer paso: calcula la primera entrada de $A^{-1}b$.'], expl: '$x=(' + x.join(',') + ')$.' };
    },
  });

  gen.eleccion({
    id: 'w4.n3.cual-invertible', nivel: '4.3', habilidades: ['4.3.invertibilidad', '4.3.rango'], dificultad: 3,
    hacer(rng) {
      let inv = null; for (let k = 0; k < 50 && !inv; k++) { const A = rm(rng, 3, 3, -2, 3); if (!M.det(A).isZero()) inv = A; } if (!inv) return null;
      const sing = () => { const B = rm(rng, 3, 3, -2, 3); const a = rng.int(-2, 2), b = rng.int(1, 2); B[2] = B[0].map((x, j) => x.mul(Rat.of(a)).add(B[1][j].mul(Rat.of(b)))); return B; };
      const m = [sing(), sing(), sing()]; if (m.some(B => !M.det(B).isZero())) return null;
      return { key: tx(inv) + m.map(tx).join(''), enun: 'Solo una de estas matrices es invertible. ¿Cuál?', ok: '$' + tx(inv) + '$',
        malas: m.map((B, i) => ['singular-' + i, '$' + tx(B) + '$', 'Su tercera fila es combinación de las otras dos: el rango es menor que $3$ y no es invertible.']),
        pistas: ['Orientación: invertible equivale a rango máximo (determinante no nulo).', 'Idea clave: busca una fila que sea combinación de las otras.', 'Primer paso: compara la tercera fila con las dos primeras.'], expl: 'Solo $' + tx(inv) + '$ tiene determinante no nulo.' };
    },
  });

  gen.entero({
    id: 'w4.n3.nulidad', nivel: '4.3', habilidades: ['4.3.rango', '4.3.rouche'], dificultad: 2,
    hacer(rng) {
      const m = rng.int(3, 6), n = rng.int(3, 8), rg = rng.int(1, Math.min(m, n)); if (rg === n) return null;
      return { key: [m, n, rg].join(), enun: 'Una matriz $' + m + '\\times' + n + '$ tiene rango $' + rg + '$. ¿Cuántos parámetros libres tiene la solución general de $Ax=0$?', res: n - rg,
        firmas: [['con-filas', m - rg, 'Los parámetros libres se cuentan con las **columnas**: $n-\\operatorname{rango}$.'], ['rango', rg, 'Ese es el número de pivotes; los libres son las columnas sin pivote.']].filter(f => f[1] !== n - rg),
        pistas: ['Orientación: cada columna tiene pivote o es libre.', 'Idea clave: libres $=n-\\operatorname{rango}A$.', 'Primer paso: identifica $n$ (columnas) y el rango.'], expl: '$' + n + '-' + rg + '=' + (n - rg) + '$.' };
    },
  });

  /* ---------- demostraciones ---------- */
  dem2({
    id: 'dem.rouche-capelli', teorema: 't.rouche-capelli', nivel: '4.3', habilidades: ['4.3.rouche', '4.3.rango', '4.3.demostrar'], requiere: ['t.incompatible'], refsExtra: ['d.rango', 'd.escalonada', 'b.doble-implicacion'],
    param: rng => ({ a: rng.pick(['A', 'C']), b: rng.pick(['b', 'c']) }),
    enunciado: p => r`Demuestra que $${p.a}x=${p.b}$ es compatible si y solo si $\operatorname{rango}${p.a}=\operatorname{rango}(${p.a}\mid ${p.b})$.`,
    hip: p => [r`$${p.a}$ es $m\times n$ y $${p.b}\in\mathbb{Q}^m$`, 'Puedes citar el criterio de incompatibilidad'], meta: p => r`compatible $\iff\operatorname{rango}${p.a}=\operatorname{rango}(${p.a}\mid ${p.b})$`,
    L: p => [
      ['L1', r`Escalonamos $(${p.a}\mid ${p.b})$; las mismas operaciones, restringidas a las primeras $n$ columnas, escalonan $${p.a}$.`, 'd.escalonada'],
      ['L2', r`Los pivotes de $${p.a}$ son los pivotes de $(${p.a}\mid ${p.b})$ en las primeras $n$ columnas; la última columna tiene pivote o no.`, 'd.rango', ['L1']],
      ['L3', r`Si la última columna tiene pivote, hay una fila $(0\cdots0\mid 1)$ y $\operatorname{rango}(${p.a}\mid ${p.b})=\operatorname{rango}${p.a}+1$; si no, ⟦h1⟧.`, 'd.rango', ['L2'], [H('h1', r`los rangos coinciden`, [r`los rangos coinciden`, r`$\operatorname{rango}(A\mid b)=0$`, r`$A=0$`], false)]],
      ['L4', r`Por el criterio de incompatibilidad, la fila $(0\cdots0\mid 1)$ aparece si y solo si el sistema es incompatible.`, 't.incompatible', ['L3']],
      ['L5', r`Luego es compatible si y solo si los rangos coinciden. ∎`, 'b.doble-implicacion', ['L3', 'L4']],
    ],
    dist: p => [[r`Con un sistema $2\times2$ de rangos iguales hay solución; luego siempre.`, 'un ejemplo no prueba el caso general'], [r`Si $\operatorname{rango}${p.a}=n$ siempre hay solución.`, 'falso: con más ecuaciones que incógnitas puede ser incompatible']],
    err: p => [['L3', r`Si la última columna tiene pivote, $\operatorname{rango}(${p.a}\mid ${p.b})=\operatorname{rango}${p.a}-1$.`, 'error-de-calculo', 'Un pivote adicional **aumenta** el rango en $1$.'], ['L5', r`Luego es incompatible si y solo si los rangos coinciden.`, 'conclusion-invalida', 'Es compatible cuando coinciden.']],
    valida: [['pivote-ultima', r`Analizar si la última columna tiene pivote`, 'Es la prueba estándar.']],
    idea: p => r`un pivote en la columna de $${p.b}$ es una fila $(0\cdots0\mid1)$.`, primero: p => r`escalona la matriz aumentada.`,
  });

  dem2({
    id: 'dem.inversa-gauss', teorema: 't.inversa-gauss', nivel: '4.3', habilidades: ['4.3.inversa', '4.3.invertibilidad', '4.3.demostrar'], requiere: ['t.ops-elementales', 't.mat-inversa-producto'], refsExtra: ['d.invertible', 'd.escalonada', 'b.doble-implicacion'],
    param: rng => ({ a: rng.pick(['A', 'P']), e: rng.pick(['E', 'G']) }),
    enunciado: p => r`Demuestra que $${p.a}$ ($n\times n$) es invertible si y solo si su forma reducida es $I$.`,
    hip: p => [r`$${p.a}$ es $n\times n$`, 'Puedes citar las operaciones elementales y la inversa de un producto'], meta: p => r`$${p.a}$ invertible $\iff$ forma reducida $=I$`,
    L: p => [
      ['L1', r`(⇒) Si $${p.a}$ es invertible y $${p.a}x=0$, entonces $x=${p.a}^{-1}${p.a}x=0$: solo hay la solución trivial.`, 'd.invertible'],
      ['L2', r`Si la reducida tuviera una columna sin pivote habría una variable libre y una solución no trivial; luego hay $n$ pivotes en $n$ columnas y la reducida es $I$.`, 'd.escalonada', ['L1']],
      ['L3', r`(⇐) Si la reducida es $I$, cada operación elemental es multiplicar por una matriz invertible $${p.e}_i$: $${p.e}_k\cdots ${p.e}_1${p.a}=I$.`, 't.ops-elementales'],
      ['L4', r`Entonces $${p.a}=${p.e}_1^{-1}\cdots ${p.e}_k^{-1}$ es un producto de invertibles, así que ⟦h1⟧ y su inversa es $${p.e}_k\cdots ${p.e}_1$. ∎`, 't.mat-inversa-producto', ['L3'], [H('h1', r`$${p.a}$ es invertible`, [r`$${p.a}$ es invertible`, r`$${p.a}=I$`, r`$${p.a}=0$`], false)]],
    ],
    dist: p => [[r`Con $${p.a}=\begin{pmatrix}1&1\\0&1\end{pmatrix}$ la reducida es $I$ y es invertible; luego siempre.`, 'un ejemplo no prueba el caso general'], [r`Como todas las matrices cuadradas se reducen, todas son invertibles.`, 'se reducen, pero no siempre a $I$']],
    err: p => [['L1', r`Si $${p.a}$ es invertible y $${p.a}x=0$, entonces $x=${p.a}x\cdot ${p.a}^{-1}=0$.`, 'error-de-calculo', 'La inversa se multiplica **por la izquierda**: $x=A^{-1}(Ax)$.'], ['L3', r`Si la reducida es $I$, $${p.e}_1\cdots ${p.e}_k${p.a}=I$.`, 'error-de-calculo', 'El orden de las matrices elementales va al revés: $E_k\\cdots E_1A$.']],
    valida: [['elementales', r`Interpretar cada operación elemental como multiplicar por una matriz invertible`, 'Es la prueba estándar.']],
    idea: p => r`cada paso de Gauss-Jordan es multiplicar por una matriz invertible.`, primero: p => r`prueba (⇒) con $x=${p.a}^{-1}(${p.a}x)$.`,
  });

  dem2({
    id: 'dem.invertible-equivalencias', teorema: 't.invertible-equivalencias', nivel: '4.3', habilidades: ['4.3.invertibilidad', '4.3.rango', '4.3.demostrar'], requiere: ['t.inversa-gauss'], refsExtra: ['d.invertible', 'd.rango', 'd.escalonada'],
    param: rng => ({ a: rng.pick(['A', 'B']), x: rng.pick(['x', 'v']) }),
    enunciado: p => r`Para $${p.a}$ cuadrada $n\times n$, demuestra: invertible $\Rightarrow$ ($${p.a}${p.x}=0\Rightarrow ${p.x}=0$) $\Rightarrow$ $\operatorname{rango}${p.a}=n$ $\Rightarrow$ invertible.`,
    hip: p => [r`$${p.a}$ es $n\times n$`, 'Puedes citar el criterio de Gauss-Jordan para la inversa'], meta: p => r`las tres condiciones son equivalentes`,
    L: p => [
      ['L1', r`(1⇒2) Si $${p.a}$ es invertible y $${p.a}${p.x}=0$: $${p.x}=${p.a}^{-1}(${p.a}${p.x})=${p.a}^{-1}0=0$.`, 'd.invertible'],
      ['L2', r`(2⇒3) Si $\operatorname{rango}${p.a}<n$, hay una columna sin pivote, es decir una variable libre; poniéndole $1$ se obtiene $${p.x}\neq0$ con $${p.a}${p.x}=0$, contra (2). Luego $\operatorname{rango}${p.a}=n$.`, 'd.escalonada', ['L1']],
      ['L3', r`(3⇒1) Con $n$ pivotes en $n$ columnas la reducida de $${p.a}$ es ⟦h1⟧.`, 'd.rango', ['L2'], [H('h1', r`$I$`, [r`$I$`, r`$0$`, r`$${p.a}$`], false)]],
      ['L4', r`Por el criterio de Gauss-Jordan, $${p.a}$ es invertible. Hemos cerrado el ciclo $1\Rightarrow2\Rightarrow3\Rightarrow1$. ∎`, 't.inversa-gauss', ['L3']],
    ],
    dist: p => [[r`Con $${p.a}=I$ las tres condiciones se cumplen; luego siempre.`, 'un ejemplo no prueba el caso general'], [r`Basta probar (1⇒2) para tener la equivalencia.`, 'una sola implicación no da equivalencia']],
    err: p => [['L1', r`(1⇒2) $${p.x}=(${p.a}${p.x})${p.a}^{-1}=0$.`, 'error-de-calculo', 'La inversa multiplica por la izquierda: $A^{-1}(Ax)$.'], ['L3', r`(3⇒1) Con $n$ pivotes la reducida de $${p.a}$ es $0$.`, 'error-de-calculo', 'Con $n$ pivotes en $n\\times n$ la reducida es $I$.']],
    valida: [['ciclo', r`Demostrar el ciclo $1\Rightarrow2\Rightarrow3\Rightarrow1$`, 'Es la prueba estándar.']],
    idea: p => r`cierra un ciclo de implicaciones usando que $n$ pivotes dan $I$.`, primero: p => r`prueba (1⇒2) multiplicando por $${p.a}^{-1}$.`,
  });

  dem2({
    id: 'dem.nulidad', teorema: 't.nulidad', nivel: '4.3', habilidades: ['4.3.rango', '4.3.rouche', '4.3.demostrar'], requiere: ['t.solucion-general'], refsExtra: ['d.rango', 'd.escalonada', 'b.arbitrario'],
    param: rng => ({ a: rng.pick(['A', 'C']), x: rng.pick(['x', 'v']), n: rng.pick(['n', 'q']) }),
    enunciado: p => r`Demuestra que las soluciones de $${p.a}${p.x}=0$ ($${p.a}$ de tamaño $m\times ${p.n}$) se describen con exactamente $${p.n}-\operatorname{rango}${p.a}$ parámetros libres.`,
    hip: p => [r`$${p.a}$ es $m\times ${p.n}$ con forma reducida $R$`, 'Puedes citar la descripción de la solución general'], meta: p => r`$${p.n}-\operatorname{rango}${p.a}$ parámetros libres`,
    L: p => [
      ['L1', r`Las soluciones de $${p.a}${p.x}=0$ y de $R${p.x}=0$ coinciden; cada una de las $${p.n}$ columnas de $R$ es pivote o libre.`, 'd.escalonada'],
      ['L2', r`Hay $\operatorname{rango}${p.a}$ columnas pivote, así que hay $${p.n}-\operatorname{rango}${p.a}$ columnas libres.`, 'd.rango', ['L1']],
      ['L3', r`Cada fila de $R$ expresa su variable pivote en función de las libres: elegidas las libres arbitrariamente, ⟦h1⟧.`, 'b.arbitrario', ['L2'], [H('h1', r`las pivote quedan determinadas`, [r`las pivote quedan determinadas`, r`las pivote son siempre cero`, r`las libres quedan fijadas`], false)]],
      ['L4', r`Por la descripción de la solución general (con $b=0$ y $x_p=0$), el conjunto de soluciones se parametriza por las libres: $${p.n}-\operatorname{rango}${p.a}$ parámetros. ∎`, 't.solucion-general', ['L3']],
    ],
    dist: p => [[r`En $x+y=0$ hay un parámetro, que es $2-1$; luego siempre.`, 'un ejemplo no prueba el caso general'], [r`El número de parámetros es $m-\operatorname{rango}${p.a}$.`, 'los parámetros se cuentan con columnas, no con filas']],
    err: p => [['L2', r`Hay $\operatorname{rango}${p.a}$ columnas libres y $${p.n}-\operatorname{rango}${p.a}$ pivote.`, 'error-de-calculo', 'Al revés: hay rango columnas pivote.'], ['L3', r`Fijadas las pivote arbitrariamente, quedan determinadas las libres.`, 'conclusion-invalida', 'Las libres son las que se eligen.']],
    valida: [['pivotes-libres', r`Clasificar las columnas en pivote y libres`, 'Es la prueba estándar.']],
    idea: p => r`cada columna es pivote o libre: $${p.n}=\operatorname{rango}+\text{libres}$.`, primero: p => r`pasa a la forma reducida $R$.`,
  });

  R.nivel({
    id: '4.3', mundo: 4, titulo: 'Rango e inversa', tema: 'Rouché-Capelli, inversa e invertibilidad',
    habilidades: ['4.3.rango', '4.3.inversa', '4.3.rouche', '4.3.invertibilidad', '4.3.demostrar'],
    teoremas: ['t.rouche-capelli', 't.inversa-gauss', 't.invertible-equivalencias', 't.nulidad'],
    leccion: {
      intro: 'El **rango** de una matriz es el número de pivotes de su forma escalonada. Mide cuántas filas (o columnas) son realmente independientes y decide si un sistema tiene solución y si una matriz cuadrada es invertible.',
      definiciones: [
        { nombre: 'Rango', tex: '$\\operatorname{rango}A=$ número de pivotes de la reducida de $A$. Rango $+$ variables libres $=n$ (número de columnas).' },
        { nombre: 'Rouché-Capelli', tex: '$Ax=b$ es compatible si y solo si $\\operatorname{rango}A=\\operatorname{rango}(A\\mid b)$; es única si además ese rango es $n$.' },
        { nombre: 'Inversa por Gauss-Jordan', tex: 'Se escalona $(A\\mid I)$: si el lado izquierdo llega a $I$, el derecho es $A^{-1}$; si no llega, $A$ no es invertible.' },
        { nombre: 'Invertibilidad', tex: 'Para $A$ cuadrada: invertible $\\iff$ rango $n$ $\\iff$ $Ax=0$ solo tiene la solución trivial.' },
      ],
      teorema: 't.invertible-equivalencias',
      ejemplo: { enunciado: 'Halla la inversa de $\\begin{pmatrix}1&2\\\\3&5\\end{pmatrix}$.', pasos: ['$(A\\mid I)=\\begin{pmatrix}1&2&1&0\\\\3&5&0&1\\end{pmatrix}$; $F_2\\leftarrow F_2-3F_1$ da $(0,-1\\mid-3,1)$.', '$F_2\\leftarrow-F_2$ da $(0,1\\mid3,-1)$; $F_1\\leftarrow F_1-2F_2$ da $(1,0\\mid-5,2)$.', 'Luego $A^{-1}=\\begin{pmatrix}-5&2\\\\3&-1\\end{pmatrix}$.'] },
    },
  });

  if (typeof module !== 'undefined') module.exports = AC;
})(globalThis.AC = globalThis.AC || {});
