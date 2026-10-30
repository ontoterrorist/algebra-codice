/* Mundo 6, nivel 6.3 — Matriz asociada a una transformación lineal. */
(function (AC) {
  const { R, H, T, gen, dem2 } = AC.cont, r = String.raw, M = AC.mat, Rat = AC.Rat;
  const ref = (id, tipo, nombre) => R.ref({ id, tipo, nombre });
  ref('d.matriz-T', 'definicion', 'Matriz de T respecto de las bases B y C: columnas [T(bⱼ)]_C; para las canónicas, columnas T(eⱼ)');

  const HB = (id, nombre) => R.habilidad({ id: '6.3.' + id, nombre, nivel: '6.3' });
  HB('matriz', 'Hallar la matriz de T'); HB('composicion', 'Composición y producto'); HB('inversa', 'La matriz de la inversa'); HB('bases', 'Matriz respecto de otras bases'); HB('demostrar', 'Demostrar con la matriz asociada');
  const TE = (id, titulo, enunciado, requiere, hab) => R.teorema({ id, titulo, nivel: '6.3', enunciado, requiere, habilidades: hab });
  TE('t.matriz-asociada', 'Matriz asociada', r`Toda lineal $T:\mathbb{Q}^n\to\mathbb{Q}^m$ es $T(x)=Ax$ para una única $A$, cuyas columnas son $T(e_1),\dots,T(e_n)$.`, ['t.criterio-lineal', 't.lineal-determinada-base'], ['6.3.matriz', '6.3.demostrar']);
  TE('t.matriz-composicion', 'Matriz de la composición', r`$[S\circ T]=[S]\,[T]$.`, ['t.matriz-asociada', 't.mat-producto-asoc'], ['6.3.composicion', '6.3.demostrar']);
  TE('t.matriz-inversa-transformacion', 'Matriz de la inversa', r`$T$ es invertible si y solo si $[T]$ lo es, y entonces $[T^{-1}]=[T]^{-1}$.`, ['t.matriz-composicion', 't.mat-inversa-unica'], ['6.3.inversa', '6.3.demostrar']);
  TE('t.matriz-respecto-bases', 'Matriz respecto de bases', r`Si $[T]_{B,C}$ tiene columnas $[T(b_j)]_C$, entonces $[T(v)]_C=[T]_{B,C}[v]_B$.`, ['t.coordenadas-lineales', 't.matriz-cambio-base'], ['6.3.bases', '6.3.demostrar']);

  const F = M.fmt, tx = A => M.tex(A);
  const rv = (rng, n, lo, hi) => Array.from({ length: n }, () => Rat.of(rng.int(lo, hi)));
  const coord = (f, vars) => { let s = ''; f.forEach((c, j) => { if (c.isZero()) return; const neg = c.cmp(Rat.of(0)) < 0, a = neg ? c.neg() : c, cs = a.eq(Rat.of(1)) ? '' : M.texN(a); s += (s ? (neg ? '-' : '+') : (neg ? '-' : '')) + cs + vars[j]; }); return s || '0'; };
  const formula = (A, vars) => '(' + A.map(f => coord(f, vars)).join(',\\ ') + ')';
  const par = v => '(' + v.join(',') + ')';
  const basesInt = (rng, lo, hi, maxdet) => { for (let k = 0; k < 80; k++) { const b = [rv(rng, 2, lo, hi), rv(rng, 2, lo, hi)], d = M.det(b); if (!d.isZero() && Math.abs(Number(d.n)) <= maxdet && d.isInt()) return b; } return null; };
  /* operaciones geométricas del plano: nombre en frase, matriz */
  const GEO = [['gira $90^\\circ$ en sentido antihorario', [[0, -1], [1, 0]]], ['gira $90^\\circ$ en sentido horario', [[0, 1], [-1, 0]]], ['gira $180^\\circ$', [[-1, 0], [0, -1]]], ['se refleja en el eje $x$', [[1, 0], [0, -1]]], ['se refleja en el eje $y$', [[-1, 0], [0, 1]]], ['se refleja en la recta $y=x$', [[0, 1], [1, 0]]], ['se estira al doble en el eje $x$', [[2, 0], [0, 1]]], ['se estira al triple en el eje $y$', [[1, 0], [0, 3]]], ['se proyecta sobre el eje $x$', [[1, 0], [0, 0]]], ['se desliza horizontalmente (cizalla $x\\mapsto x+y$)', [[1, 1], [0, 1]]]];

  /* ---------- generadores ---------- */
  gen.matriz({
    id: 'w6.n3.matriz-de-T', nivel: '6.3', habilidades: ['6.3.matriz'], dificultad: 2,
    hacer(rng) {
      const m = rng.int(2, 3), n = rng.int(2, 3), A = M.de(Array.from({ length: m }, () => rv(rng, n, -3, 4))); if (A.every(f => f.every(x => x.isZero()))) return null; const vars = ['x', 'y', 'z'].slice(0, n);
      return { key: tx(A), enun: 'Halla la matriz $[T]$ (respecto de las bases canónicas) de $T:\\mathbb{R}^' + n + '\\to\\mathbb{R}^' + m + '$, $T(' + vars.join(',') + ')=' + formula(A, vars) + '$.', res: F(A), etiqueta: '[T]',
        firmas: [['transpuesta', F(M.T(A)), 'La matriz de $T:\\mathbb{R}^' + n + '\\to\\mathbb{R}^' + m + '$ tiene $' + m + '$ filas y $' + n + '$ columnas.'], ['filas-intercambiadas', F(A).slice().reverse(), 'Cada fila de la matriz corresponde a una coordenada de la salida, en ese orden.']].filter(f => JSON.stringify(f[1]) !== JSON.stringify(F(A)) && f[1].length === m),
        pistas: ['Orientación: cada fila corresponde a una coordenada de la salida.', 'Idea clave: las columnas de $[T]$ son $T(e_1),\\dots,T(e_n)$.', 'Primer paso: calcula $T(e_1)$.'], expl: '$[T]=' + tx(A) + '$.' };
    },
  });

  gen.matriz({
    id: 'w6.n3.matriz-por-imagenes', nivel: '6.3', habilidades: ['6.3.matriz'], dificultad: 2,
    hacer(rng) {
      const n = rng.int(2, 3), m = rng.int(2, 3); if (n === m && rng.chance(0.4)) return null; const A = M.de(Array.from({ length: m }, () => rv(rng, n, -3, 4))); if (A.every(f => f.every(x => x.isZero()))) return null; const cols = M.T(A);
      return { key: tx(A) + 'i', enun: 'Una transformación lineal $T:\\mathbb{R}^' + n + '\\to\\mathbb{R}^' + m + '$ cumple ' + cols.map((c, j) => '$T(e_' + (j + 1) + ')=' + par(c) + '$').join(', ') + '. Escribe su matriz $[T]$.', res: F(A), etiqueta: '[T]',
        firmas: [['filas-en-vez-de-columnas', F(M.T(A)), 'Las imágenes $T(e_j)$ van como **columnas**, no como filas.'], ['columnas-intercambiadas', F(A).map(f => f.slice().reverse()), 'Las columnas siguen el orden de $e_1,e_2,\\dots$ (la columna $j$ es $T(e_j)$).']].filter(f => JSON.stringify(f[1]) !== JSON.stringify(F(A)) && f[1].length === m),
        pistas: ['Orientación: la columna $j$ es la imagen del vector $e_j$.', 'Idea clave: $[T]=(T(e_1)\\ \\cdots\\ T(e_n))$.', 'Primer paso: escribe $T(e_1)$ como primera columna.'], expl: '$[T]=' + tx(A) + '$.' };
    },
  });

  gen.matriz({
    id: 'w6.n3.pipeline-grafico', nivel: '6.3', habilidades: ['6.3.composicion'], dificultad: 3,
    hacer(rng) {
      const [g1, g2] = rng.sample(GEO, 2), A = M.de(g1[1]), B = M.de(g2[1]), C = M.mul(B, A), D = M.mul(A, B); if (M.igual(C, D)) return null;
      return { key: g1[0] + g2[0], enun: 'En un videojuego, un objeto primero ' + g1[0] + ' y **después** ' + g2[0] + '. Halla la matriz $2\\times2$ que hace las dos operaciones a la vez.', res: F(C), etiqueta: 'M',
        firmas: [['orden-invertido', F(D), 'La matriz de «primero $A$, luego $B$» es $BA$ (la transformación que actúa primero va a la derecha).']],
        pistas: ['Orientación: escribe la matriz de cada paso.', 'Idea clave: $[S\\circ T]=[S]\\,[T]$: el primer paso queda a la derecha.', 'Primer paso: escribe $A$ (primer paso) y $B$ (segundo paso).'], expl: 'La matriz es $BA=' + tx(C) + '$.' };
    },
  });

  gen.matriz({
    id: 'w6.n3.matriz-respecto-bases', nivel: '6.3', habilidades: ['6.3.bases'], dificultad: 4,
    hacer(rng) {
      const B = basesInt(rng, -2, 3, 3), C = basesInt(rng, -2, 3, 3); if (!B || !C) return null; const A = M.de([rv(rng, 2, -2, 3), rv(rng, 2, -2, 3)]); const cols = B.map(b => M.aVec(M.mul(A, M.colVec(b)))), res = M.T(cols.map(w => M.coordenadas(C, w)));
      if (res.some(f => f.some(x => x.d > 2n))) return null;
      return { key: tx(A) + par(B[0]) + par(B[1]) + par(C[0]) + par(C[1]), enun: 'Sea $T:\\mathbb{R}^2\\to\\mathbb{R}^2$ con matriz canónica $' + tx(A) + '$, $B=\\{' + par(B[0]) + ',' + par(B[1]) + '\\}$ y $C=\\{' + par(C[0]) + ',' + par(C[1]) + '\\}$. Halla $[T]_{B,C}$.', res: F(res), etiqueta: '[T]B,C',
        firmas: [['sin-cambiar-base', F(A), 'Esa es la matriz canónica; la columna $j$ de $[T]_{B,C}$ es $[T(b_j)]_C$.'], ['transpuesta', F(M.T(res)), 'Las coordenadas $[T(b_j)]_C$ van como **columnas**.']].filter(f => JSON.stringify(f[1]) !== JSON.stringify(F(res))),
        pistas: ['Orientación: calcula $T(b_1)$ y $T(b_2)$.', 'Idea clave: expresa cada $T(b_j)$ en la base $C$; esas coordenadas son las columnas.', 'Primer paso: calcula $T(b_1)=A\\,b_1$.'], expl: '$[T]_{B,C}=' + tx(res) + '$.' };
    },
  });

  gen.matriz({
    id: 'w6.n3.matriz-de-la-inversa', nivel: '6.3', habilidades: ['6.3.inversa'], dificultad: 3,
    hacer(rng) {
      const A = M.de([rv(rng, 2, -3, 4), rv(rng, 2, -3, 4)]), d = M.det(A); if (d.isZero() || !d.isInt() || Math.abs(Number(d.n)) > 5) return null; const I = M.inversa(A);
      return { key: tx(A), enun: 'La transformación $T(x,y)=' + formula(A, ['x', 'y']) + '$ es biyectiva. Halla la matriz de $T^{-1}$.', res: F(I), etiqueta: '[T⁻¹]',
        firmas: [['misma-matriz', F(A), 'Esa es la matriz de $T$; la de $T^{-1}$ es su inversa.'], ['transpuesta-de-T', F(M.T(A)), 'La inversa no es la transpuesta (salvo en rotaciones).']].filter(f => JSON.stringify(f[1]) !== JSON.stringify(F(I))),
        pistas: ['Orientación: $[T^{-1}]=[T]^{-1}$.', 'Idea clave: para $2\\times2$, $\\frac1{ad-bc}\\begin{pmatrix}d&-b\\\\-c&a\\end{pmatrix}$.', 'Primer paso: escribe $[T]$ y calcula su determinante.'], expl: '$[T^{-1}]=' + tx(I) + '$.' };
    },
  });

  gen.tupla({
    id: 'w6.n3.secuencia-punto', nivel: '6.3', habilidades: ['6.3.composicion', '6.3.matriz'], dificultad: 3,
    hacer(rng) {
      const g = rng.sample(GEO, 3), mats = g.map(x => M.de(x[1])), v = rv(rng, 2, -5, 6); if (v[0].isZero() && v[1].isZero()) return null; const P = mats.reduce((acc, m) => M.mul(m, acc), M.id(2)), w = M.aVec(M.mul(P, M.colVec(v))), mal = M.aVec(M.mul(M.mul(mats[0], M.mul(mats[1], mats[2])), M.colVec(v)));
      return { key: g.map(x => x[0]).join() + v.join(), enun: 'Un personaje está en $' + par(v) + '$. En orden, ' + g.map(x => x[0]).join('; luego ') + '. ¿Dónde queda?', campos: ['x', 'y'], res: w.map(String),
        firmas: [['orden-invertido', mal.map(String), 'Las transformaciones se aplican en el orden indicado: la primera actúa primero sobre el punto.'], ['omite-la-ultima', M.aVec(M.mul(M.mul(mats[1], mats[0]), M.colVec(v))).map(String), 'Faltó aplicar la última operación.']].filter(f => f[1].join() !== w.map(String).join()),
        pistas: ['Orientación: aplica una operación a la vez.', 'Idea clave: o multiplica las tres matrices (la primera operación queda a la derecha) y aplica el resultado.', 'Primer paso: aplica la primera operación al punto.'], expl: 'Queda en ' + par(w) + '.' };
    },
  });

  /* ---------- demostraciones ---------- */
  dem2({
    id: 'dem.matriz-asociada', teorema: 't.matriz-asociada', nivel: '6.3', habilidades: ['6.3.matriz', '6.3.demostrar'], requiere: ['t.criterio-lineal', 't.lineal-determinada-base'], refsExtra: ['d.matriz-T', 'd.lineal', 'd.matriz-producto'],
    param: rng => ({ t: rng.pick(['T', 'L']), a: rng.pick(['A', 'P']), b: rng.pick(['B', 'Q']), x: rng.pick(['x', 'v']) }),
    enunciado: p => r`Sea $${p.t}:\mathbb{Q}^n\to\mathbb{Q}^m$ lineal. Demuestra que existe una única matriz $${p.a}$ con $${p.t}(${p.x})=${p.a}${p.x}$ para todo $${p.x}$, y que sus columnas son $${p.t}(e_1),\dots,${p.t}(e_n)$.`,
    hip: p => [r`$${p.t}$ es lineal y $(e_j)$ la base canónica`, 'Puedes citar que una lineal queda determinada por una base'], meta: p => r`$${p.t}(${p.x})=${p.a}${p.x}$, con $${p.a}=(${p.t}(e_1)\ \cdots\ ${p.t}(e_n))$`,
    L: p => [
      ['L1', r`Definimos $${p.a}$ con columnas $${p.t}(e_1),\dots,${p.t}(e_n)$. Todo $${p.x}=\sum x_je_j$.`, 'd.matriz-T'],
      ['L2', r`Por linealidad, $${p.t}(${p.x})=\sum x_j${p.t}(e_j)$.`, 'd.lineal', ['L1']],
      ['L3', r`Y $${p.a}${p.x}=\sum x_j(\text{columna }j\text{ de }${p.a})=\sum x_j${p.t}(e_j)$ por la definición del producto matriz-vector.`, 'd.matriz-producto', ['L1']],
      ['L4', r`Luego $${p.t}(${p.x})=${p.a}${p.x}$ para todo $${p.x}$. Unicidad: si $${p.a}${p.x}=${p.b}${p.x}$ para todo $${p.x}$, tomando $${p.x}=e_j$ las columnas $j$ coinciden, así que ⟦h1⟧. ∎`, 'd.matriz-T', ['L2', 'L3'], [H('h1', r`$${p.a}=${p.b}$`, [r`$${p.a}=${p.b}$`, r`$${p.a}=0$`, r`$${p.b}=I$`], false)]],
    ],
    dist: p => [[r`Con $${p.t}(x,y)=(x+y,x)$ la matriz es $\begin{pmatrix}1&1\\1&0\end{pmatrix}$; luego siempre.`, 'un ejemplo no prueba el caso general'], [r`Como $${p.t}$ es una función de $\mathbb{Q}^n$, siempre es multiplicar por una matriz.`, 'solo las lineales; hay que probarlo']],
    err: p => [['L3', r`Y $${p.a}${p.x}=\sum x_j(\text{fila }j\text{ de }${p.a})$.`, 'error-de-calculo', 'Es una combinación de las **columnas**.'], ['L2', r`Por linealidad, $${p.t}(${p.x})=\sum ${p.t}(x_j)e_j$.`, 'error-de-calculo', '$T$ actúa sobre los vectores $e_j$, no sobre los escalares $x_j$.']],
    valida: [['canonica', r`Escribir $x$ en la base canónica y usar linealidad`, 'Es la prueba estándar.']],
    idea: p => r`$${p.t}(${p.x})=\sum x_j${p.t}(e_j)$ es una combinación de las columnas.`, primero: p => r`escribe $${p.x}=\sum x_je_j$.`,
  });

  dem2({
    id: 'dem.matriz-composicion', teorema: 't.matriz-composicion', nivel: '6.3', habilidades: ['6.3.composicion', '6.3.demostrar'], requiere: ['t.matriz-asociada', 't.mat-producto-asoc'], refsExtra: ['d.matriz-T', 'd.composicion-fun', 'd.matriz-producto'],
    param: rng => ({ s: rng.pick(['S', 'G']), t: rng.pick(['T', 'F']), x: rng.pick(['x', 'v']) }),
    enunciado: p => r`Demuestra que $[${p.s}\circ ${p.t}]=[${p.s}]\,[${p.t}]$ para $${p.t}:\mathbb{Q}^n\to\mathbb{Q}^m$ y $${p.s}:\mathbb{Q}^m\to\mathbb{Q}^k$ lineales.`,
    hip: p => [r`$${p.s},${p.t}$ lineales`, 'Puedes citar la matriz asociada y la asociatividad del producto'], meta: p => r`$[${p.s}\circ ${p.t}]=[${p.s}][${p.t}]$`,
    L: p => [
      ['L1', r`Para todo $${p.x}$, $(${p.s}\circ ${p.t})(${p.x})=${p.s}(${p.t}(${p.x}))$ por definición.`, 'd.composicion-fun'],
      ['L2', r`Por la matriz asociada, $${p.t}(${p.x})=[${p.t}]${p.x}$ y $${p.s}(w)=[${p.s}]w$.`, 't.matriz-asociada', ['L1']],
      ['L3', r`Entonces $(${p.s}\circ ${p.t})(${p.x})=[${p.s}]([${p.t}]${p.x})=([${p.s}][${p.t}])${p.x}$ por ⟦h1⟧ del producto.`, 't.mat-producto-asoc', ['L2'], [H('h1', 'la asociatividad', ['la asociatividad', 'la conmutatividad', 'la inversa'], false)]],
      ['L4', r`Así $${p.s}\circ ${p.t}$ es multiplicar por $[${p.s}][${p.t}]$. Por la unicidad de la matriz asociada, $[${p.s}\circ ${p.t}]=[${p.s}][${p.t}]$. ∎`, 't.matriz-asociada', ['L3']],
    ],
    dist: p => [[r`Con dos giros de $90^\circ$ se obtiene un giro de $180^\circ$; luego siempre.`, 'un ejemplo no prueba el caso general'], [r`Como la composición de funciones es asociativa, las matrices se multiplican.`, 'hay que identificar la matriz con la unicidad']],
    err: p => [['L3', r`Entonces $(${p.s}\circ ${p.t})(${p.x})=([${p.t}][${p.s}])${p.x}$.`, 'error-de-calculo', 'Primero actúa $T$: $[S][T]x=[S]([T]x)$.'], ['L1', r`$(${p.s}\circ ${p.t})(${p.x})=${p.t}(${p.s}(${p.x}))$.`, 'error-de-calculo', 'En $S\\circ T$ se aplica primero $T$.']],
    valida: [['unicidad', r`Probar $(S\circ T)(x)=([S][T])x$ y usar la unicidad de la matriz`, 'Es la prueba estándar.']],
    idea: p => r`$[${p.s}]([${p.t}]${p.x})=([${p.s}][${p.t}])${p.x}$.`, primero: p => r`aplica la matriz asociada a cada transformación.`,
  });

  dem2({
    id: 'dem.matriz-inversa-transformacion', teorema: 't.matriz-inversa-transformacion', nivel: '6.3', habilidades: ['6.3.inversa', '6.3.demostrar'], requiere: ['t.matriz-composicion', 't.mat-inversa-unica'], refsExtra: ['d.matriz-inversa', 'd.matriz-T', 'b.doble-implicacion'],
    param: rng => ({ t: rng.pick(['T', 'F']), s: rng.pick(['S', 'G']), a: rng.pick(['A', 'P']) }),
    enunciado: p => r`Sea $${p.t}:\mathbb{Q}^n\to\mathbb{Q}^n$ lineal con matriz $${p.a}$. Demuestra que si $${p.t}$ es invertible (con inversa lineal $${p.s}$), entonces $${p.a}$ es invertible y $[${p.s}]=${p.a}^{-1}$.`,
    hip: p => [r`$${p.t}$ lineal con matriz $${p.a}$ y $${p.s}=${p.t}^{-1}$ lineal`, 'Puedes citar la matriz de la composición y la unicidad de la inversa'], meta: p => r`$[${p.s}]=${p.a}^{-1}$`,
    L: p => [
      ['L1', r`Como $${p.s}\circ ${p.t}=\mathrm{id}$ y $[\mathrm{id}]=I$, por la matriz de la composición $[${p.s}]\,${p.a}=I$.`, 't.matriz-composicion'],
      ['L2', r`Como $${p.t}\circ ${p.s}=\mathrm{id}$, igualmente $${p.a}\,[${p.s}]=I$.`, 't.matriz-composicion'],
      ['L3', r`Luego $[${p.s}]$ es una inversa de $${p.a}$ por ambos lados: $${p.a}$ es invertible.`, 'd.matriz-inversa', ['L1', 'L2']],
      ['L4', r`Por la ⟦h1⟧ de la inversa, $[${p.s}]=${p.a}^{-1}$. ∎`, 't.mat-inversa-unica', ['L3'], [H('h1', 'unicidad', ['unicidad', 'existencia', 'simetría'], false)]],
    ],
    dist: p => [[r`Con $T(x)=2x$ la matriz de la inversa es $\frac12I$; luego siempre.`, 'un ejemplo no prueba el caso general'], [r`La matriz de la inversa de una función es la transpuesta de su matriz.`, 'falso en general']],
    err: p => [['L1', r`Como $${p.s}\circ ${p.t}=\mathrm{id}$, $[${p.s}]\,${p.a}=0$.`, 'error-de-calculo', '$[\\mathrm{id}]=I$.'], ['L2', r`Como $${p.t}\circ ${p.s}=\mathrm{id}$, igualmente $[${p.s}]\,${p.a}=I$ y no hay nada más que probar.`, 'conclusion-invalida', 'Falta ver también $A[S]=I$ (se necesitan ambos lados).']],
    valida: [['composicion', r`Aplicar la matriz de la composición a $S\circ T$ y $T\circ S$`, 'Es la prueba estándar.']],
    idea: p => r`la matriz de la identidad es $I$ y la de una composición es el producto.`, primero: p => r`escribe $${p.s}\circ ${p.t}=\mathrm{id}$ con matrices.`,
  });

  dem2({
    id: 'dem.matriz-respecto-bases', teorema: 't.matriz-respecto-bases', nivel: '6.3', habilidades: ['6.3.bases', '6.3.demostrar'], requiere: ['t.coordenadas-lineales', 't.matriz-cambio-base'], refsExtra: ['d.matriz-T', 'd.coordenadas', 'd.lineal'],
    param: rng => ({ t: rng.pick(['T', 'F']), b: rng.pick(['b', 'e']), v: rng.pick(['v', 'u']), a: rng.pick(['A', 'P']) }),
    enunciado: p => r`Sea $${p.a}=[${p.t}]_{B,C}$ la matriz con columnas $[${p.t}(${p.b}_j)]_C$. Demuestra que $[${p.t}(${p.v})]_C=${p.a}\,[${p.v}]_B$ para todo $${p.v}\in V$.`,
    hip: p => [r`$B=(${p.b}_j)$ base de $V$, $C$ base de $W$, $${p.t}$ lineal`, 'Puedes citar la linealidad de las coordenadas'], meta: p => r`$[${p.t}(${p.v})]_C=${p.a}[${p.v}]_B$`,
    L: p => [
      ['L1', r`Sea $[${p.v}]_B=(x_1,\dots,x_n)$, es decir, $${p.v}=\sum x_j${p.b}_j$.`, 'd.coordenadas'],
      ['L2', r`Por linealidad de $${p.t}$, $${p.t}(${p.v})=\sum x_j${p.t}(${p.b}_j)$.`, 'd.lineal', ['L1']],
      ['L3', r`Aplicando $[\cdot]_C$ y su linealidad, $[${p.t}(${p.v})]_C=\sum x_j[${p.t}(${p.b}_j)]_C$.`, 't.coordenadas-lineales', ['L2']],
      ['L4', r`Esa suma es la combinación lineal de las columnas de $${p.a}$ con coeficientes $x_j$, o sea ⟦h1⟧. ∎`, 'd.matriz-T', ['L3'], [H('h1', r`$${p.a}\,[${p.v}]_B$`, [r`$${p.a}\,[${p.v}]_B$`, r`$[${p.v}]_B\,${p.a}$`, r`$${p.a}+[${p.v}]_B$`], false)]],
    ],
    dist: p => [[r`Con $T=\mathrm{id}$ se obtiene la matriz de cambio de base; luego siempre.`, 'un ejemplo no prueba el caso general'], [r`Como $[\cdot]_C$ es lineal, ya queda demostrado.`, 'también hace falta la linealidad de $T$ y la definición de la matriz']],
    err: p => [['L3', r`Aplicando $[\cdot]_C$, $[${p.t}(${p.v})]_C=\sum x_j[${p.t}(${p.b}_j)]_B$.`, 'error-de-calculo', 'Las coordenadas de $T(b_j)$ se toman respecto de $C$.'], ['L4', r`Esa suma es la combinación de las **filas** de $${p.a}$.`, 'error-de-calculo', 'Son las columnas.']],
    valida: [['coordenadas', r`Aplicar $T$ y luego las coordenadas a $v=\sum x_jb_j$`, 'Es la prueba estándar.']],
    idea: p => r`$[${p.t}(${p.v})]_C=\sum x_j[${p.t}(${p.b}_j)]_C$.`, primero: p => r`escribe $${p.v}$ en la base $B$.`,
  });

  R.nivel({
    id: '6.3', mundo: 6, titulo: 'Matriz asociada', tema: 'Matrices de transformaciones lineales',
    habilidades: ['6.3.matriz', '6.3.composicion', '6.3.inversa', '6.3.bases', '6.3.demostrar'],
    teoremas: ['t.matriz-asociada', 't.matriz-composicion', 't.matriz-inversa-transformacion', 't.matriz-respecto-bases'],
    leccion: {
      intro: 'Toda transformación lineal $T:\\mathbb{R}^n\\to\\mathbb{R}^m$ es multiplicar por una matriz: $T(x)=Ax$. La matriz $A=[T]$ se arma con las imágenes de la base canónica y traduce la composición en producto.',
      definiciones: [
        { nombre: 'Matriz de T', tex: '$[T]=(T(e_1)\\ \\cdots\\ T(e_n))$: la columna $j$ es $T(e_j)$. Si $T(x,y)=(ax+by,cx+dy)$, $[T]=\\begin{pmatrix}a&b\\\\c&d\\end{pmatrix}$.' },
        { nombre: 'Composición', tex: '$[S\\circ T]=[S]\\,[T]$: el primer paso va a la derecha. Giros, reflexiones y cizallas se encadenan multiplicando sus matrices.' },
        { nombre: 'Inversa', tex: '$T$ es invertible si y solo si $[T]$ es invertible; $[T^{-1}]=[T]^{-1}$.' },
        { nombre: 'Otras bases', tex: '$[T]_{B,C}$ tiene columnas $[T(b_j)]_C$ y cumple $[T(v)]_C=[T]_{B,C}[v]_B$.' },
      ],
      teorema: 't.matriz-composicion',
      ejemplo: { enunciado: 'Un objeto gira $90^\\circ$ antihorario y luego se refleja en el eje $x$. ¿Cuál es la matriz total?', pasos: ['Giro: $R=\\begin{pmatrix}0&-1\\\\1&0\\end{pmatrix}$. Reflexión: $S=\\begin{pmatrix}1&0\\\\0&-1\\end{pmatrix}$.', 'El primer paso va a la derecha: $SR=\\begin{pmatrix}1&0\\\\0&-1\\end{pmatrix}\\begin{pmatrix}0&-1\\\\1&0\\end{pmatrix}$.', 'Resultado: $\\begin{pmatrix}0&-1\\\\-1&0\\end{pmatrix}$ (la reflexión en la recta $y=-x$).'] },
    },
  });

  if (typeof module !== 'undefined') module.exports = AC;
})(globalThis.AC = globalThis.AC || {});
