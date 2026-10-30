/* Mundo 4, nivel 4.1 — Matrices y sus operaciones. */
(function (AC) {
  const { R, H, T, gen, dem2 } = AC.cont, r = String.raw, M = AC.mat, Rat = AC.Rat;
  const ref = (id, tipo, nombre) => R.ref({ id, tipo, nombre });
  ref('d.matriz-producto', 'definicion', 'Producto de matrices: (AB)ᵢⱼ = Σₖ aᵢₖ bₖⱼ'); ref('d.matriz-transpuesta', 'definicion', 'Transpuesta: (Aᵀ)ᵢⱼ = Aⱼᵢ');
  ref('d.matriz-inversa', 'definicion', 'Inversa de A: una matriz B con AB = BA = I'); ref('b.suma-finita', 'propiedad-base', 'Las sumas finitas se pueden reordenar y distribuir');

  const HB = (id, nombre) => R.habilidad({ id: '4.1.' + id, nombre, nivel: '4.1' });
  HB('producto', 'Multiplicar matrices'); HB('propiedades', 'Propiedades del producto'); HB('transpuesta', 'Transpuesta'); HB('inversa-2x2', 'Inversa de una 2×2'); HB('demostrar', 'Demostrar con matrices');
  const TE = (id, titulo, enunciado, requiere, hab) => R.teorema({ id, titulo, nivel: '4.1', enunciado, requiere, habilidades: hab });
  TE('t.mat-producto-asoc', 'Asociatividad del producto', r`$(AB)C=A(BC)$ siempre que los productos estén definidos.`, [], ['4.1.producto', '4.1.propiedades', '4.1.demostrar']);
  TE('t.mat-transpuesta-producto', 'Transpuesta de un producto', r`$(AB)^T=B^TA^T$.`, [], ['4.1.transpuesta', '4.1.propiedades', '4.1.demostrar']);
  TE('t.mat-inversa-unica', 'Unicidad de la inversa', r`Si $A$ tiene inversa, es única.`, ['t.mat-producto-asoc'], ['4.1.inversa-2x2', '4.1.demostrar']);
  TE('t.mat-inversa-producto', 'Inversa de un producto', r`Si $A,B$ son invertibles, $(AB)^{-1}=B^{-1}A^{-1}$.`, ['t.mat-inversa-unica'], ['4.1.inversa-2x2', '4.1.propiedades', '4.1.demostrar']);

  const rm = (rng, m, n, lo, hi) => M.de(Array.from({ length: m }, () => Array.from({ length: n }, () => rng.int(lo, hi))));
  const F = M.fmt, tx = A => M.tex(A);
  const hadamard = (A, B) => A.map((f, i) => f.map((x, j) => x.mul(B[i][j])));

  /* ---------- generadores ---------- */
  gen.matriz({
    id: 'w4.n1.producto', nivel: '4.1', habilidades: ['4.1.producto'], dificultad: 2,
    hacer(rng) {
      const m = rng.int(2, 3), n = rng.int(2, 3), p = m, A = rm(rng, m, n, -3, 4), B = rm(rng, n, p, -3, 4), C = M.mul(A, B);
      const firmas = [['transpuesta', F(M.T(C)), 'Cuidado con las dimensiones: $AB$ es de $' + m + '\\times ' + p + '$, no su transpuesta.']];
      if (m === n && n === p) firmas.push(['entrada-por-entrada', F(hadamard(A, B)), 'El producto no se hace entrada por entrada: cada entrada es fila × columna.']);
      if (m === n && n === p) { const D = M.mul(B, A); if (!M.igual(C, D)) firmas.push(['orden-invertido', F(D), 'El producto de matrices no conmuta: calculaste $BA$ en lugar de $AB$.']); }
      return { key: tx(A) + tx(B), enun: 'Calcula $AB$ para $A=' + tx(A) + '$ y $B=' + tx(B) + '$.', res: F(C), etiqueta: 'AB', firmas: firmas.filter(f => f[1].length === m && f[1][0].length === p),
        pistas: ['Orientación: la entrada $(i,j)$ de $AB$ es la fila $i$ de $A$ por la columna $j$ de $B$.', 'Idea clave: $c_{ij}=\\sum_k a_{ik}b_{kj}$.', 'Primer paso: calcula $c_{11}$ multiplicando la primera fila de $A$ por la primera columna de $B$.'], expl: '$AB=' + tx(C) + '$.' };
    },
  });

  gen.entero({
    id: 'w4.n1.entrada-producto', nivel: '4.1', habilidades: ['4.1.producto'], dificultad: 2,
    hacer(rng) {
      const A = rm(rng, 3, 3, -3, 4), B = rm(rng, 3, 3, -3, 4), C = M.mul(A, B), i = rng.int(1, 3), j = rng.int(1, 3), k = i === j ? (i % 3) + 1 : j, res = C[i - 1][j - 1].n;
      return { key: tx(A) + tx(B) + i + j, enun: 'Sean $A=' + tx(A) + '$ y $B=' + tx(B) + '$. Calcula solo la entrada $(AB)_{' + i + j + '}$ (sin multiplicar toda la matriz).', res: Number(res),
        firmas: [['transpuesta', Number(C[j - 1][i - 1].n), 'Esa es la entrada $(' + j + ',' + i + ')$: la fila es la primera cifra y la columna la segunda.'], ['orden-invertido', Number(M.mul(B, A)[i - 1][j - 1].n), 'Usaste $BA$ en lugar de $AB$: la fila viene de $A$ y la columna de $B$.']].filter(f => f[1] !== Number(res)),
        pistas: ['Orientación: solo hace falta una fila de $A$ y una columna de $B$.', 'Idea clave: $(AB)_{ij}=\\sum_k a_{ik}b_{kj}$.', 'Primer paso: toma la fila ' + i + ' de $A$ y la columna ' + j + ' de $B$.'], expl: 'La entrada vale $' + res + '$.' };
    },
  });

  gen.matriz({
    id: 'w4.n1.potencia-polinomio', nivel: '4.1', habilidades: ['4.1.producto', '4.1.propiedades'], dificultad: 3,
    hacer(rng) {
      const A = rm(rng, 2, 2, -3, 3), a = rng.int(-3, 4), b = rng.int(-4, 4); if (a === 0 && b === 0) return null;
      const A2 = M.mul(A, A), P = M.add(M.sub(A2, M.esc(A, a)), M.esc(M.id(2), b));
      const sinI = M.sub(A2, M.esc(A, a)), cuad = A.map(f => f.map(x => x.mul(x))).map((f, i) => f.map((x, j) => x.sub(A[i][j].mul(Rat.of(a))).add(i === j ? Rat.of(b) : Rat.of(0))));
      return { key: tx(A) + a + ',' + b, enun: 'Para $A=' + tx(A) + '$ calcula $A^2' + (a < 0 ? '+' : '-') + Math.abs(a) + 'A' + (b < 0 ? '-' : '+') + Math.abs(b) + 'I$ (con $I$ la identidad $2\\times2$).', res: F(P), etiqueta: 'p(A)',
        firmas: [['sin-identidad', F(sinI), 'Falta sumar $' + b + 'I$: el término constante se convierte en $' + b + '$ por la identidad, en toda la diagonal.'], ['cuadrado-entradas', F(cuad), 'Elevar al cuadrado **cada entrada** no es $A^2$: hay que hacer el producto $A\\cdot A$.']].filter(f => JSON.stringify(f[1]) !== JSON.stringify(F(P))),
        pistas: ['Orientación: calcula primero $A^2=A\\cdot A$.', 'Idea clave: el número $' + b + '$ suma $' + b + 'I$ (identidad), no una matriz de unos.', 'Primer paso: multiplica $A$ por $A$.'], expl: '$' + tx(P) + '$.' };
    },
  });

  gen.matriz({
    id: 'w4.n1.inversa-2x2', nivel: '4.1', habilidades: ['4.1.inversa-2x2'], dificultad: 2,
    hacer(rng) {
      const A = rm(rng, 2, 2, -4, 5), d = M.det(A); if (d.isZero() || Number(d.n) > 6 || Number(d.n) < -6) return null;
      const I = M.inversa(A), adj = M.adjunta(A);
      return { key: tx(A), enun: 'Halla la inversa de $A=' + tx(A) + '$.', res: F(I), etiqueta: 'A⁻¹',
        firmas: [['sin-dividir', F(adj), 'Falta dividir entre el determinante $ad-bc=' + d + '$.'], ['sin-cambiar-signos', F(M.esc(M.T(M.de([[A[1][1], A[0][1]], [A[1][0], A[0][0]]])), d.eq(Rat.of(1)) ? 1 : Rat.of(1).div(d))), 'En la adjunta los elementos $b$ y $c$ cambian de signo y $a$, $d$ se intercambian.'], ['transpuesta', F(M.T(I)), 'Cuidado con las posiciones de $b$ y $c$.']].filter(f => JSON.stringify(f[1]) !== JSON.stringify(F(I))),
        pistas: ['Orientación: para una $2\\times2$ existe una fórmula directa.', 'Idea clave: $A^{-1}=\\frac{1}{ad-bc}\\begin{pmatrix}d&-b\\\\-c&a\\end{pmatrix}$.', 'Primer paso: calcula $ad-bc=' + d + '$.'], expl: '$A^{-1}=' + tx(I) + '$.' };
    },
  });

  gen.matriz({
    id: 'w4.n1.transpuesta-producto', nivel: '4.1', habilidades: ['4.1.transpuesta', '4.1.propiedades'], dificultad: 3,
    hacer(rng) {
      const A = rm(rng, 2, 3, -3, 4), B = rm(rng, 3, 2, -3, 4), C = M.T(M.mul(A, B));
      return { key: tx(A) + tx(B), enun: 'Con $A=' + tx(A) + '$ y $B=' + tx(B) + '$, calcula $(AB)^T$.', res: F(C), etiqueta: '(AB)ᵀ',
        firmas: [['sin-transponer', F(M.mul(A, B)), 'Falta trasponer el resultado.']].filter(f => JSON.stringify(f[1]) !== JSON.stringify(F(C))),
        pistas: ['Orientación: puedes calcular $AB$ y trasponer, o usar $(AB)^T=B^TA^T$.', 'Idea clave: trasponer intercambia filas y columnas del producto.', 'Primer paso: calcula $AB$.'], expl: '$(AB)^T=' + tx(C) + '$.' };
    },
  });

  gen.eleccion({
    id: 'w4.n1.identidad-valida', nivel: '4.1', habilidades: ['4.1.propiedades'], dificultad: 3,
    hacer(rng) {
      const buenas = [['$(AB)^T=B^TA^T$', 'Se cumple siempre.'], ['$(AB)C=A(BC)$', 'El producto es asociativo.'], ['$A(B+C)=AB+AC$', 'Distributividad por la izquierda.'], ['$(A^T)^T=A$', 'Trasponer dos veces devuelve $A$.'], ['$(AB)^{-1}=B^{-1}A^{-1}$ si $A,B$ son invertibles', 'Se cumple invirtiendo el orden.']];
      const malas = [['$AB=BA$', 'El producto de matrices **no conmuta** en general.'], ['$(A+B)^2=A^2+2AB+B^2$', 'Solo vale si $AB=BA$: en general $(A+B)^2=A^2+AB+BA+B^2$.'], ['$(AB)^T=A^TB^T$', 'Hay que invertir el orden: $(AB)^T=B^TA^T$.'], ['$(AB)^{-1}=A^{-1}B^{-1}$', 'Hay que invertir el orden: $(AB)^{-1}=B^{-1}A^{-1}$.'], ['si $AB=0$ entonces $A=0$ o $B=0$', 'Falso: hay matrices no nulas con producto cero.'], ['$(A-B)(A+B)=A^2-B^2$', 'Solo vale si $AB=BA$.']];
      const ok = rng.pick(buenas), mm = rng.sample(malas, 3);
      return { key: ok[0] + mm.map(x => x[0]).join(''), enun: '¿Cuál de estas igualdades es **verdadera para todas** las matrices (con tamaños compatibles)?', ok: ok[0],
        malas: mm.map((x, i) => ['falsa-' + i, x[0], x[1]]),
        pistas: ['Orientación: busca la propiedad que **no** supone conmutatividad.', 'Idea clave: el producto es asociativo y distributivo, pero no conmutativo; trasponer o invertir invierte el orden.', 'Primer paso: prueba cada igualdad con matrices $2\\times2$ sencillas.'], expl: ok[0] + ': ' + ok[1] };
    },
  });

  /* ---------- demostraciones ---------- */
  dem2({
    id: 'dem.mat-producto-asoc', teorema: 't.mat-producto-asoc', nivel: '4.1', habilidades: ['4.1.producto', '4.1.propiedades', '4.1.demostrar'], requiere: [], refsExtra: ['d.matriz-producto', 'b.suma-finita', 'b.arbitrario'],
    param: rng => ({ i: rng.pick(['i', 'r']), j: rng.pick(['j', 's']), k: rng.pick(['k', 'p']), l: rng.pick(['l', 'q']) }),
    enunciado: p => r`Demuestra que $(AB)C=A(BC)$ para matrices $A\in M_{m\times n}$, $B\in M_{n\times p}$, $C\in M_{p\times q}$.`,
    hip: p => [r`los tamaños son compatibles`, 'Puedes usar la definición del producto y que las sumas finitas se reordenan'], meta: p => r`$(AB)C=A(BC)$`,
    L: p => [
      ['L1', r`Fijamos $(${p.i},${p.j})$. Por definición, $((AB)C)_{${p.i}${p.j}}=\sum_{${p.k}}(AB)_{${p.i}${p.k}}C_{${p.k}${p.j}}$.`, 'd.matriz-producto'],
      ['L2', r`Y $(AB)_{${p.i}${p.k}}=\sum_{${p.l}}A_{${p.i}${p.l}}B_{${p.l}${p.k}}$, luego $((AB)C)_{${p.i}${p.j}}=\sum_{${p.k}}\sum_{${p.l}}A_{${p.i}${p.l}}B_{${p.l}${p.k}}C_{${p.k}${p.j}}$.`, 'd.matriz-producto', ['L1']],
      ['L3', r`Como las sumas son finitas, se puede ⟦h1⟧: $=\sum_{${p.l}}A_{${p.i}${p.l}}\sum_{${p.k}}B_{${p.l}${p.k}}C_{${p.k}${p.j}}$.`, 'b.suma-finita', ['L2'], [H('h1', r`intercambiar el orden de las dos sumas y sacar factor común`, [r`intercambiar el orden de las dos sumas y sacar factor común`, r`conmutar $A$ con $B$`, r`derivar término a término`], false)]],
      ['L4', r`La suma interior es $(BC)_{${p.l}${p.j}}$ y la exterior es la definición de $(A(BC))_{${p.i}${p.j}}$.`, 'd.matriz-producto', ['L3']],
      ['L5', r`Las entradas coinciden para todo $(${p.i},${p.j})$, así que $(AB)C=A(BC)$. ∎`, 'b.arbitrario', ['L4']],
    ],
    dist: p => [[r`Con matrices $2\times2$ concretas se comprueba que $(AB)C=A(BC)$; luego siempre.`, 'un ejemplo no prueba el caso general'], [r`Como el producto de números es asociativo, el de matrices también lo es.`, 'las entradas son sumas de productos: hay que reordenar las sumas']],
    err: p => [['L1', r`Por definición, $((AB)C)_{${p.i}${p.j}}=\sum_{${p.k}}(AB)_{${p.k}${p.i}}C_{${p.k}${p.j}}$.`, 'error-de-calculo', 'La entrada $(i,k)$ de $AB$ lleva la fila en la primera posición.'], ['L3', r`Intercambiamos $A$ y $B$ dentro de la suma: $\sum A_{${p.l}${p.i}}B\cdots$`, 'conclusion-invalida', 'El producto de matrices no conmuta; lo que se reordena son las sumas, no las matrices.']],
    valida: [['entradas', r`Comparar la entrada $(i,j)$ de ambos lados con la definición del producto`, 'Es la prueba estándar.']],
    idea: p => r`escribe la entrada $(${p.i},${p.j})$ con dos sumas y cámbialas de orden.`, primero: p => r`aplica la definición del producto a $(AB)C$.`,
  });

  dem2({
    id: 'dem.mat-transpuesta-producto', teorema: 't.mat-transpuesta-producto', nivel: '4.1', habilidades: ['4.1.transpuesta', '4.1.propiedades', '4.1.demostrar'], requiere: [], refsExtra: ['d.matriz-producto', 'd.matriz-transpuesta', 'b.suma-finita'],
    param: rng => ({ i: rng.pick(['i', 'r']), j: rng.pick(['j', 's']), k: rng.pick(['k', 'p']) }),
    enunciado: p => r`Demuestra que $(AB)^T=B^TA^T$ para $A\in M_{m\times n}$ y $B\in M_{n\times p}$.`,
    hip: p => [r`$A$ es $m\times n$ y $B$ es $n\times p$`, 'Puedes usar las definiciones de producto y de transpuesta'], meta: p => r`$(AB)^T=B^TA^T$`,
    L: p => [
      ['L1', r`Los tamaños coinciden: $(AB)^T$ es $p\times m$ y $B^TA^T$ es $(p\times n)(n\times m)=p\times m$.`, 'd.matriz-producto'],
      ['L2', r`Por definición de transpuesta, $((AB)^T)_{${p.i}${p.j}}=(AB)_{${p.j}${p.i}}$.`, 'd.matriz-transpuesta', ['L1']],
      ['L3', r`Por definición del producto, $(AB)_{${p.j}${p.i}}=\sum_{${p.k}}A_{${p.j}${p.k}}B_{${p.k}${p.i}}$.`, 'd.matriz-producto', ['L2']],
      ['L4', r`Como $A_{${p.j}${p.k}}=(A^T)_{${p.k}${p.j}}$ y $B_{${p.k}${p.i}}=(B^T)_{${p.i}${p.k}}$, la suma es $\sum_{${p.k}}(B^T)_{${p.i}${p.k}}(A^T)_{${p.k}${p.j}}$ (⟦h1⟧).`, 'd.matriz-transpuesta', ['L3'], [H('h1', r`el producto de números es conmutativo`, [r`el producto de números es conmutativo`, r`el producto de matrices es conmutativo`, r`$A=A^T$`], false)]],
      ['L5', r`Eso es $(B^TA^T)_{${p.i}${p.j}}$ por la definición del producto. Las entradas coinciden: $(AB)^T=B^TA^T$. ∎`, 'd.matriz-producto', ['L4']],
    ],
    dist: p => [[r`Con $A=\begin{pmatrix}1&2\\0&1\end{pmatrix}$ y $B=I$ se cumple; luego siempre.`, 'un ejemplo no prueba el caso general'], [r`Trasponer reparte sobre el producto: $(AB)^T=A^TB^T$.`, 'el orden se invierte; $A^TB^T$ ni siquiera tiene el tamaño correcto en general']],
    err: p => [['L2', r`Por definición de transpuesta, $((AB)^T)_{${p.i}${p.j}}=(AB)_{${p.i}${p.j}}$.`, 'error-de-calculo', 'La transpuesta intercambia los índices.'], ['L4', r`Como $A_{${p.j}${p.k}}=(A^T)_{${p.j}${p.k}}$, la suma es $\sum(A^T)_{${p.j}${p.k}}(B^T)_{${p.k}${p.i}}$.`, 'error-de-calculo', 'La transpuesta cambia el orden de los índices: $A_{jk}=(A^T)_{kj}$.']],
    valida: [['entradas', r`Comparar entradas con las definiciones de transpuesta y producto`, 'Es la prueba estándar.']],
    idea: p => r`escribe $(AB)_{${p.j}${p.i}}$ como suma y reconoce un producto de transpuestas.`, primero: p => r`aplica la definición de transpuesta a $(AB)^T$.`,
  });

  dem2({
    id: 'dem.mat-inversa-unica', teorema: 't.mat-inversa-unica', nivel: '4.1', habilidades: ['4.1.inversa-2x2', '4.1.demostrar'], requiere: ['t.mat-producto-asoc'], refsExtra: ['d.matriz-inversa', 'b.arbitrario'],
    param: rng => ({ b: rng.pick(['B', 'X']), c: rng.pick(['C', 'Y']) }),
    enunciado: p => r`Demuestra que si $${p.b}$ y $${p.c}$ son inversas de $A$, entonces $${p.b}=${p.c}$.`,
    hip: p => [r`$A${p.b}=${p.b}A=I$ y $A${p.c}=${p.c}A=I$`, 'Puedes citar la asociatividad del producto'], meta: p => r`$${p.b}=${p.c}$`,
    L: p => [
      ['L1', r`Partimos de $${p.b}=${p.b}I$, porque $I$ es el neutro del producto.`, 'd.matriz-inversa'],
      ['L2', r`Como $${p.c}$ es inversa de $A$, $I=A${p.c}$; entonces $${p.b}=${p.b}(A${p.c})$.`, 'd.matriz-inversa', ['L1']],
      ['L3', r`Por la asociatividad, $${p.b}(A${p.c})=(${p.b}A)${p.c}$.`, 't.mat-producto-asoc', ['L2']],
      ['L4', r`Como $${p.b}$ es inversa de $A$, $${p.b}A=I$ y $(${p.b}A)${p.c}=I${p.c}=${p.c}$.`, 'd.matriz-inversa', ['L3']],
      ['L5', r`Encadenando, $${p.b}=${p.c}$. ∎`, 'b.arbitrario', ['L4']],
    ],
    dist: p => [[r`Con $A=I$ la inversa es $I$ y es única; luego siempre.`, 'un ejemplo no prueba el caso general'], [r`Dos inversas deben coincidir porque ambas multiplican a $A$ y dan $I$.`, 'es lo que hay que probar: se necesita una cadena de igualdades']],
    err: p => [['L3', r`Por la conmutatividad, $${p.b}(A${p.c})=(A${p.b})${p.c}$.`, 'conclusion-invalida', 'El producto de matrices no es conmutativo; se usa la asociatividad.'], ['L4', r`Como $${p.b}$ es inversa de $A$, $${p.b}A=0$.`, 'error-de-calculo', 'El producto con la inversa da la identidad $I$, no la matriz cero.']],
    valida: [['cadena', r`Escribir $B=B(AC)=(BA)C=C$`, 'Es la prueba estándar.']],
    idea: p => r`$${p.b}=${p.b}(A${p.c})=(${p.b}A)${p.c}=${p.c}$.`, primero: p => r`escribe $${p.b}=${p.b}I$.`,
  });

  dem2({
    id: 'dem.mat-inversa-producto', teorema: 't.mat-inversa-producto', nivel: '4.1', habilidades: ['4.1.inversa-2x2', '4.1.propiedades', '4.1.demostrar'], requiere: ['t.mat-inversa-unica'], refsExtra: ['d.matriz-inversa', 't.mat-producto-asoc'],
    param: rng => ({ a: rng.pick(['A', 'P']), b: rng.pick(['B', 'Q']) }),
    enunciado: p => r`Demuestra que si $${p.a}$ y $${p.b}$ son invertibles, entonces $${p.a}${p.b}$ es invertible y $(${p.a}${p.b})^{-1}=${p.b}^{-1}${p.a}^{-1}$.`,
    hip: p => [r`$${p.a}$ y $${p.b}$ invertibles`, 'Puedes citar la unicidad de la inversa y la asociatividad'], meta: p => r`$(${p.a}${p.b})^{-1}=${p.b}^{-1}${p.a}^{-1}$`,
    L: p => [
      ['L1', r`Calculamos $(${p.a}${p.b})(${p.b}^{-1}${p.a}^{-1})=${p.a}(${p.b}${p.b}^{-1})${p.a}^{-1}$ por asociatividad.`, 't.mat-producto-asoc'],
      ['L2', r`Como $${p.b}${p.b}^{-1}=I$: $${p.a}I${p.a}^{-1}=${p.a}${p.a}^{-1}=I$.`, 'd.matriz-inversa', ['L1']],
      ['L3', r`Análogamente $(${p.b}^{-1}${p.a}^{-1})(${p.a}${p.b})=${p.b}^{-1}(${p.a}^{-1}${p.a})${p.b}=${p.b}^{-1}${p.b}=I$.`, 'd.matriz-inversa', ['L2']],
      ['L4', r`Luego $${p.b}^{-1}${p.a}^{-1}$ es una inversa de $${p.a}${p.b}$, y por la ⟦h1⟧ de la inversa, es **la** inversa. ∎`, 't.mat-inversa-unica', ['L2', 'L3'], [H('h1', 'unicidad', ['unicidad', 'existencia', 'conmutatividad'], false)]],
    ],
    dist: p => [[r`Con $${p.a}=${p.b}=2I$ se cumple; luego siempre.`, 'un ejemplo no prueba el caso general'], [r`Como cada una se invierte, el producto se invierte en el mismo orden: $${p.a}^{-1}${p.b}^{-1}$.`, 'el orden se invierte; hay que comprobarlo multiplicando']],
    err: p => [['L1', r`Calculamos $(${p.a}${p.b})(${p.a}^{-1}${p.b}^{-1})=${p.a}(${p.b}${p.a}^{-1})${p.b}^{-1}$.`, 'conclusion-invalida', 'Con este orden no aparece $BB^{-1}$ al asociar.'], ['L3', r`$(${p.b}^{-1}${p.a}^{-1})(${p.a}${p.b})=${p.b}^{-1}(${p.a}^{-1}${p.a})${p.b}=0$.`, 'error-de-calculo', '$B^{-1}B=I$, no $0$.']],
    valida: [['multiplicar', r`Multiplicar $AB$ por $B^{-1}A^{-1}$ en los dos órdenes y usar unicidad`, 'Es la prueba estándar.']],
    idea: p => r`multiplica y agrupa con asociatividad para ver que $${p.b}^{-1}${p.a}^{-1}$ actúa como inversa.`, primero: p => r`calcula $(${p.a}${p.b})(${p.b}^{-1}${p.a}^{-1})$.`,
  });

  R.nivel({
    id: '4.1', mundo: 4, titulo: 'Matrices y sus operaciones', tema: 'Producto, transpuesta e inversa de matrices',
    habilidades: ['4.1.producto', '4.1.propiedades', '4.1.transpuesta', '4.1.inversa-2x2', '4.1.demostrar'],
    teoremas: ['t.mat-producto-asoc', 't.mat-transpuesta-producto', 't.mat-inversa-unica', 't.mat-inversa-producto'],
    leccion: {
      intro: 'Una **matriz** $m\\times n$ es una tabla de números con $m$ filas y $n$ columnas. Sumarlas y multiplicarlas por escalares es entrada por entrada; el producto es más sutil.',
      definiciones: [
        { nombre: 'Producto', tex: 'Si $A$ es $m\\times n$ y $B$ es $n\\times p$, $AB$ es $m\\times p$ con $(AB)_{ij}=\\sum_k a_{ik}b_{kj}$ (fila por columna). Es asociativo y distributivo, pero **no conmutativo**.' },
        { nombre: 'Transpuesta', tex: '$(A^T)_{ij}=A_{ji}$: filas y columnas se intercambian. $(AB)^T=B^TA^T$.' },
        { nombre: 'Inversa', tex: '$B$ es inversa de $A$ si $AB=BA=I$. Es única si existe. Para $A=\\begin{pmatrix}a&b\\\\c&d\\end{pmatrix}$ con $ad-bc\\neq0$: $A^{-1}=\\frac{1}{ad-bc}\\begin{pmatrix}d&-b\\\\-c&a\\end{pmatrix}$.' },
        { nombre: 'Inversa de un producto', tex: '$(AB)^{-1}=B^{-1}A^{-1}$: se invierte el orden, como al deshacer «ponerse los calcetines y luego los zapatos».' },
      ],
      teorema: 't.mat-inversa-producto',
      ejemplo: { enunciado: 'Calcula $\\begin{pmatrix}1&2\\\\0&1\\end{pmatrix}\\begin{pmatrix}3&0\\\\1&1\\end{pmatrix}$.', pasos: ['Entrada $(1,1)$: $1\\cdot3+2\\cdot1=5$; $(1,2)$: $1\\cdot0+2\\cdot1=2$.', 'Entrada $(2,1)$: $0\\cdot3+1\\cdot1=1$; $(2,2)$: $0\\cdot0+1\\cdot1=1$.', 'Resultado: $\\begin{pmatrix}5&2\\\\1&1\\end{pmatrix}$.'] },
    },
  });

  if (typeof module !== 'undefined') module.exports = AC;
})(globalThis.AC = globalThis.AC || {});
