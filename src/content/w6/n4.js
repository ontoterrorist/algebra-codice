/* Mundo 6, nivel 6.4 — Cambio de base y semejanza. */
(function (AC) {
  const { R, H, T, gen, dem2 } = AC.cont, r = String.raw, M = AC.mat, Rat = AC.Rat;
  const ref = (id, tipo, nombre) => R.ref({ id, tipo, nombre });
  ref('d.semejantes', 'definicion', 'A y B son semejantes si B = P⁻¹AP para alguna P invertible'); ref('d.traza', 'definicion', 'Traza: tr A = Σ aᵢᵢ (suma de la diagonal)');

  const HB = (id, nombre) => R.habilidad({ id: '6.4.' + id, nombre, nivel: '6.4' });
  HB('cambio', 'Cambiar la base de una matriz'); HB('diagonal', 'Matriz diagonal en una base adecuada'); HB('invariantes', 'Traza y determinante'); HB('potencias', 'Potencias con P D P⁻¹'); HB('demostrar', 'Demostrar con semejanza');
  const TE = (id, titulo, enunciado, requiere, hab) => R.teorema({ id, titulo, nivel: '6.4', enunciado, requiere, habilidades: hab });
  TE('t.semejanza-cambio-base', 'Fórmula de semejanza', r`Si $P=P_{C\to B}$, entonces $[T]_C=P^{-1}[T]_BP$.`, ['t.matriz-respecto-bases', 't.cambio-base-inversa', 't.matriz-asociada'], ['6.4.cambio', '6.4.diagonal', '6.4.demostrar']);
  TE('t.traza-semejantes', 'La traza es invariante', r`$\operatorname{tr}(AB)=\operatorname{tr}(BA)$; en consecuencia matrices semejantes tienen la misma traza.`, ['t.mat-producto-asoc'], ['6.4.invariantes', '6.4.demostrar']);
  TE('t.det-semejantes-2x2', 'El determinante es invariante (2×2)', r`Dos matrices $2\times2$ semejantes tienen el mismo determinante.`, ['t.det-producto-2x2', 't.det-invertible-2x2'], ['6.4.invariantes', '6.4.demostrar']);
  TE('t.semejante-potencias', 'Potencias de matrices semejantes', r`Si $A=PDP^{-1}$, entonces $A^k=PD^kP^{-1}$ para todo $k\ge1$.`, ['t.mat-producto-asoc'], ['6.4.potencias', '6.4.diagonal', '6.4.demostrar']);

  const F = M.fmt, tx = A => M.tex(A);
  const rv = (rng, n, lo, hi) => Array.from({ length: n }, () => Rat.of(rng.int(lo, hi)));
  const par = v => '(' + v.join(',') + ')';
  const diag = (a, b) => M.de([[a, 0], [0, b]]);
  const uni = [[[1, 1], [1, 2]], [[1, 2], [0, 1]], [[2, 1], [1, 1]], [[1, 0], [1, 1]], [[3, 1], [2, 1]], [[1, 1], [0, 1]], [[2, 3], [1, 2]], [[1, 3], [1, 2]]];
  const pm = rng => M.de(rng.pick(uni));

  /* ---------- generadores ---------- */
  gen.matriz({
    id: 'w6.n4.cambiar-base-matriz', nivel: '6.4', habilidades: ['6.4.cambio'], dificultad: 3,
    hacer(rng) {
      const A = M.de([rv(rng, 2, -3, 4), rv(rng, 2, -3, 4)]), P = pm(rng), Pi = M.inversa(P), B = M.mul(Pi, M.mul(A, P));
      return { key: tx(A) + tx(P), enun: 'La matriz de $T$ en la base canónica es $A=' + tx(A) + '$. Sea $C$ la base cuyos vectores son las columnas de $P=' + tx(P) + '$. Halla $[T]_C$.', res: F(B), etiqueta: '[T]C',
        firmas: [['orden-invertido', F(M.mul(P, M.mul(A, Pi))), 'La fórmula es $[T]_C=P^{-1}AP$ (con $P$ la matriz cuyas columnas son los vectores de $C$), no $PAP^{-1}$.'], ['sin-inversa', F(M.mul(A, P)), 'Falta multiplicar por $P^{-1}$ a la izquierda.']].filter(f => JSON.stringify(f[1]) !== JSON.stringify(F(B))),
        pistas: ['Orientación: usa la fórmula de cambio de base para transformaciones.', 'Idea clave: $[T]_C=P^{-1}\\,A\\,P$ donde las columnas de $P$ son los vectores de $C$.', 'Primer paso: calcula $P^{-1}$ y luego $AP$.'], expl: '$[T]_C=P^{-1}AP=' + tx(B) + '$.' };
    },
  });

  gen.matriz({
    id: 'w6.n4.base-diagonalizante', nivel: '6.4', habilidades: ['6.4.diagonal', '6.4.cambio'], dificultad: 3,
    hacer(rng) {
      const P = pm(rng), d1 = rng.int(-3, 4), d2 = rng.int(-3, 4); if (d1 === d2) return null; const D = diag(d1, d2), A = M.mul(P, M.mul(D, M.inversa(P))), v1 = M.T(P)[0], v2 = M.T(P)[1];
      return { key: tx(A) + par(v1) + par(v2), enun: 'La transformación $T$ tiene matriz canónica $A=' + tx(A) + '$ y los vectores $v_1=' + par(v1) + '$ y $v_2=' + par(v2) + '$ cumplen $Av_1=' + d1 + 'v_1$ y $Av_2=' + d2 + 'v_2$. Halla la matriz de $T$ en la base $\\{v_1,v_2\\}$.', res: F(D), etiqueta: '[T]B',
        firmas: [['intercambio', F(diag(d2, d1)), 'El orden de la diagonal sigue el orden de la base: $v_1$ primero.'], ['canonica', F(A), 'Esa es la matriz en la base canónica; en la base de $v_1,v_2$ la matriz es diagonal.']].filter(f => JSON.stringify(f[1]) !== JSON.stringify(F(D))),
        pistas: ['Orientación: las columnas de $[T]_B$ son $[T(v_j)]_B$.', 'Idea clave: $T(v_1)=' + d1 + 'v_1$ tiene coordenadas $(' + d1 + ',0)$ en $\\{v_1,v_2\\}$.', 'Primer paso: escribe $[T(v_1)]_B$ y $[T(v_2)]_B$.'], expl: '$[T]_B=' + tx(D) + '$.' };
    },
  });

  gen.matriz({
    id: 'w6.n4.potencia-semejante', nivel: '6.4', habilidades: ['6.4.potencias'], dificultad: 3,
    hacer(rng) {
      const P = pm(rng), d1 = rng.int(-2, 3), d2 = rng.int(-2, 3), k = rng.int(2, 5); if (d1 === d2) return null; const D = diag(d1, d2), Dk = diag(d1 ** k, d2 ** k), Ak = M.mul(P, M.mul(Dk, M.inversa(P)));
      return { key: tx(P) + d1 + d2 + k, enun: 'Sea $A=PDP^{-1}$ con $P=' + tx(P) + '$ y $D=' + tx(D) + '$. Calcula $A^{' + k + '}$.', res: F(Ak), etiqueta: 'A^' + k,
        firmas: [['potencia-de-D', F(Dk), 'Eso es $D^{' + k + '}$; falta multiplicar por $P$ y $P^{-1}$: $A^{' + k + '}=PD^{' + k + '}P^{-1}$.'], ['cada-entrada', F(M.mul(P, M.mul(D, M.inversa(P))).map(f => f.map(x => x.mul(x)))), 'No se eleva entrada por entrada; se usa $PD^kP^{-1}$.']].filter(f => JSON.stringify(f[1]) !== JSON.stringify(F(Ak))),
        pistas: ['Orientación: $A^k=PD^kP^{-1}$.', 'Idea clave: $D^k$ es diagonal con las potencias $k$-ésimas.', 'Primer paso: calcula $D^{' + k + '}$.'], expl: '$A^{' + k + '}=PD^{' + k + '}P^{-1}=' + tx(Ak) + '$.' };
    },
  });

  gen.entero({
    id: 'w6.n4.invariantes', nivel: '6.4', habilidades: ['6.4.invariantes'], dificultad: 2,
    hacer(rng) {
      const A = M.de([rv(rng, 2, -4, 5), rv(rng, 2, -4, 5)]), tr = Number(M.traza(A).n), dt = Number(M.det(A).n), pide = rng.pick(['traza', 'det']); if (tr === 0 || dt === 0) return null;
      return { key: tx(A) + pide, enun: 'Sea $A=' + tx(A) + '$ y $B=P^{-1}AP$ con $P$ una matriz invertible desconocida. ¿Cuánto vale ' + (pide === 'traza' ? '$\\operatorname{tr}B$' : '$\\det B$') + '?', res: pide === 'traza' ? tr : dt,
        firmas: [['otro-invariante', pide === 'traza' ? dt : tr, 'Ese es el otro invariante (' + (pide === 'traza' ? 'el determinante' : 'la traza') + ') de $A$; el que se pide es '+ (pide === 'traza' ? 'la traza' : 'el determinante') + '.'], ['signo', -(pide === 'traza' ? tr : dt), 'Las matrices semejantes comparten traza y determinante exactamente: calcula el de $A$.']].filter(f => f[1] !== (pide === 'traza' ? tr : dt)),
        pistas: ['Orientación: la traza y el determinante son invariantes por semejanza.', 'Idea clave: $\\operatorname{tr}(P^{-1}AP)=\\operatorname{tr}A$ y $\\det(P^{-1}AP)=\\det A$.', 'Primer paso: no necesitas conocer $P$.'], expl: 'Vale $' + (pide === 'traza' ? tr : dt) + '$ (invariante).' };
    },
  });

  gen.eleccion({
    id: 'w6.n4.no-semejantes', nivel: '6.4', habilidades: ['6.4.invariantes'], dificultad: 3,
    hacer(rng) {
      const A = M.de([rv(rng, 2, -3, 4), rv(rng, 2, -3, 4)]), motivo = rng.pick(['traza', 'det']); let B;
      for (let k = 0; k < 60 && !B; k++) { const c = M.de([rv(rng, 2, -3, 4), rv(rng, 2, -3, 4)]), ta = M.traza(A).eq(M.traza(c)), da = M.det(A).eq(M.det(c)); if (motivo === 'traza' ? (!ta && da) : (ta && !da)) B = c; } if (!B) return null;
      const ok = motivo === 'traza' ? 'tienen distinta traza' : 'tienen distinto determinante';
      return { key: tx(A) + tx(B), enun: 'Las matrices $A=' + tx(A) + '$ y $B=' + tx(B) + '$ **no** son semejantes. ¿Qué invariante lo demuestra?', ok, malas: [['otro', motivo === 'traza' ? 'tienen distinto determinante' : 'tienen distinta traza', 'Ese invariante coincide en las dos matrices: no sirve para separarlas.'], ['filas', 'tienen distinto número de filas', 'Ambas son $2\\times2$.'], ['entradas', 'tienen distintas entradas', 'Matrices semejantes pueden tener entradas distintas: no es un invariante.']],
        pistas: ['Orientación: calcula traza y determinante de cada una.', 'Idea clave: si algún invariante difiere, no son semejantes.', 'Primer paso: calcula $\\operatorname{tr}A$ y $\\operatorname{tr}B$.'], expl: 'Aquí ' + ok + '.' };
    },
  });

  gen.matriz({
    id: 'w6.n4.reflexion-en-recta', nivel: '6.4', habilidades: ['6.4.diagonal', '6.4.cambio'], dificultad: 4,
    hacer(rng) {
      const a = rng.int(1, 4), b = rng.int(-3, 4); if (b === 0 || Math.abs(a) === Math.abs(b) && rng.chance(0.5)) return null; const n = a * a + b * b, P = M.de([[a, -b], [b, a]]), D = diag(1, -1), A = M.mul(P, M.mul(D, M.inversa(P))), proy = M.mul(P, M.mul(diag(1, 0), M.inversa(P)));
      return { key: [a, b].join(), enun: 'La transformación $T$ refleja el plano en la recta que pasa por el origen con dirección $(' + a + ',' + b + ')$. En la base $\\{(' + a + ',' + b + '),(' + (-b) + ',' + a + ')\\}$ su matriz es $\\begin{pmatrix}1&0\\\\0&-1\\end{pmatrix}$. Halla su matriz en la base **canónica**.', res: F(A), etiqueta: '[T]',
        firmas: [['proyeccion', F(proy), 'Eso es la matriz de la proyección; la reflexión es $2\\,\\mathrm{proy}-I$.'], ['sin-denominador', F(A.map(f => f.map(x => x.mul(Rat.of(n))))), 'Falta dividir entre $a^2+b^2=' + n + '$.']].filter(f => JSON.stringify(f[1]) !== JSON.stringify(F(A))),
        pistas: ['Orientación: $[T]=P\\,D\\,P^{-1}$ con $P$ la matriz de la base.', 'Idea clave: $P=\\begin{pmatrix}' + a + '&' + (-b) + '\\\\' + b + '&' + a + '\\end{pmatrix}$ y $D=\\mathrm{diag}(1,-1)$.', 'Primer paso: calcula $P^{-1}$.'], expl: '$[T]=PDP^{-1}=' + tx(A) + '$.' };
    },
  });

  /* ---------- demostraciones ---------- */
  dem2({
    id: 'dem.semejanza-cambio-base', teorema: 't.semejanza-cambio-base', nivel: '6.4', habilidades: ['6.4.cambio', '6.4.diagonal', '6.4.demostrar'], requiere: ['t.matriz-respecto-bases', 't.cambio-base-inversa', 't.matriz-asociada'], refsExtra: ['d.matriz-T', 'd.matriz-cambio', 'd.semejantes'],
    param: rng => ({ t: rng.pick(['T', 'F']), p: rng.pick(['P', 'S']), v: rng.pick(['v', 'u']) }),
    enunciado: p => r`Sea $${p.t}:V\to V$ lineal, $B$ y $C$ bases de $V$ y $${p.p}=P_{C\to B}$. Demuestra que $[${p.t}]_C=${p.p}^{-1}[${p.t}]_B\,${p.p}$.`,
    hip: p => [r`$B,C$ bases de $V$ y $${p.t}$ lineal`, 'Puedes citar las matrices respecto de bases, la inversa del cambio de base y la unicidad de la matriz asociada'], meta: p => r`$[${p.t}]_C=${p.p}^{-1}[${p.t}]_B\,${p.p}$`,
    L: p => [
      ['L1', r`Para todo $${p.v}$, $[${p.v}]_B=${p.p}[${p.v}]_C$ (cambio de base de $C$ a $B$).`, 't.cambio-base-inversa'],
      ['L2', r`Por la matriz respecto de bases, $[${p.t}(${p.v})]_B=[${p.t}]_B[${p.v}]_B=[${p.t}]_B\,${p.p}[${p.v}]_C$.`, 't.matriz-respecto-bases', ['L1']],
      ['L3', r`Volviendo a $C$: $[${p.t}(${p.v})]_C=${p.p}^{-1}[${p.t}(${p.v})]_B$, pues $${p.p}^{-1}=P_{B\to C}$.`, 't.cambio-base-inversa', ['L2']],
      ['L4', r`Luego $[${p.t}(${p.v})]_C=(${p.p}^{-1}[${p.t}]_B\,${p.p})[${p.v}]_C$ para todo $${p.v}$.`, 'd.matriz-T', ['L2', 'L3']],
      ['L5', r`Como la matriz que cumple $[${p.t}(${p.v})]_C=X[${p.v}]_C$ es única, ⟦h1⟧. ∎`, 't.matriz-asociada', ['L4'], [H('h1', r`$[${p.t}]_C=${p.p}^{-1}[${p.t}]_B\,${p.p}$`, [r`$[${p.t}]_C=${p.p}^{-1}[${p.t}]_B\,${p.p}$`, r`$[${p.t}]_C=${p.p}[${p.t}]_B$`, r`$[${p.t}]_C=[${p.t}]_B$`], false)]],
    ],
    dist: p => [[r`Con $T=\mathrm{id}$ se obtiene $I=P^{-1}IP$; luego siempre.`, 'un ejemplo no prueba el caso general'], [r`Como cambiar de base no cambia la transformación, las matrices son iguales.`, 'cambian: la fórmula las relaciona con $P$']],
    err: p => [['L2', r`$[${p.t}(${p.v})]_B=[${p.t}]_B[${p.v}]_B=[${p.t}]_B\,${p.p}^{-1}[${p.v}]_C$.`, 'error-de-calculo', 'Para pasar de $C$ a $B$ se usa $P_{C\\to B}=P$.'], ['L3', r`Volviendo a $C$: $[${p.t}(${p.v})]_C=${p.p}[${p.t}(${p.v})]_B$.`, 'error-de-calculo', 'De $B$ a $C$ se usa $P^{-1}$.']],
    valida: [['coordenadas', r`Seguir un vector de $C$ a $B$, aplicar $T$ y volver a $C$`, 'Es la prueba estándar.']],
    idea: p => r`ir de $C$ a $B$, aplicar $[${p.t}]_B$ y volver a $C$.`, primero: p => r`escribe $[${p.v}]_B$ en función de $[${p.v}]_C$.`,
  });

  dem2({
    id: 'dem.traza-semejantes', teorema: 't.traza-semejantes', nivel: '6.4', habilidades: ['6.4.invariantes', '6.4.demostrar'], requiere: ['t.mat-producto-asoc'], refsExtra: ['d.traza', 'd.semejantes', 'd.matriz-producto', 'b.suma-finita'],
    param: rng => ({ a: rng.pick(['A', 'X']), b: rng.pick(['B', 'Y']), p: rng.pick(['P', 'S']) }),
    enunciado: p => r`Demuestra que $\operatorname{tr}(${p.a}${p.b})=\operatorname{tr}(${p.b}${p.a})$ para matrices cuadradas, y que si $${p.b}=${p.p}^{-1}${p.a}${p.p}$, entonces $\operatorname{tr}${p.b}=\operatorname{tr}${p.a}$.`,
    hip: p => [r`$${p.a},${p.b}$ son $n\times n$ y $${p.p}$ invertible`, 'Puedes usar la definición del producto y reordenar sumas finitas'], meta: p => r`$\operatorname{tr}(${p.a}${p.b})=\operatorname{tr}(${p.b}${p.a})$ y la traza es invariante por semejanza`,
    L: p => [
      ['L1', r`$\operatorname{tr}(${p.a}${p.b})=\sum_i(${p.a}${p.b})_{ii}=\sum_i\sum_k${p.a}_{ik}${p.b}_{ki}$ por la definición del producto.`, 'd.matriz-producto'],
      ['L2', r`Intercambiando el orden de las sumas finitas, $=\sum_k\sum_i${p.b}_{ki}${p.a}_{ik}=\sum_k(${p.b}${p.a})_{kk}=\operatorname{tr}(${p.b}${p.a})$.`, 'b.suma-finita', ['L1']],
      ['L3', r`Para la semejanza, $\operatorname{tr}(${p.p}^{-1}(${p.a}${p.p}))=\operatorname{tr}((${p.a}${p.p})\,${p.p}^{-1})$ aplicando L2 con $${p.a}\to ${p.p}^{-1}$ y $${p.b}\to ${p.a}${p.p}$.`, 't.mat-producto-asoc', ['L2']],
      ['L4', r`Y $(${p.a}${p.p})${p.p}^{-1}=${p.a}(${p.p}${p.p}^{-1})$, que por asociatividad e inversa es igual a ⟦h1⟧; así $\operatorname{tr}${p.b}=\operatorname{tr}${p.a}$. ∎`, 't.mat-producto-asoc', ['L3'], [H('h1', r`$${p.a}$`, [r`$${p.a}$`, r`$I$`, r`$0$`], false)]],
    ],
    dist: p => [[r`Con $A=\begin{pmatrix}1&2\\0&1\end{pmatrix}$ y $B=I$ las trazas coinciden; luego siempre.`, 'un ejemplo no prueba el caso general'], [r`Como $AB$ y $BA$ son iguales, tienen la misma traza.`, 'en general $AB\\neq BA$; solo las trazas coinciden']],
    err: p => [['L1', r`$\operatorname{tr}(${p.a}${p.b})=\sum_i(${p.a}_{ii}\cdot ${p.b}_{ii})$.`, 'error-de-calculo', 'La diagonal de $AB$ usa fila por columna.'], ['L4', r`Y $(${p.a}${p.p})${p.p}^{-1}=${p.a}(${p.p}+${p.p}^{-1})$.`, 'error-de-calculo', 'Se **multiplica**: $PP^{-1}=I$.']],
    valida: [['sumas', r`Escribir las trazas con sumas dobles y reordenar`, 'Es la prueba estándar.']],
    idea: p => r`$\sum_i\sum_k a_{ik}b_{ki}$ no cambia al intercambiar las sumas.`, primero: p => r`desarrolla $\operatorname{tr}(${p.a}${p.b})$ con la definición del producto.`,
  });

  dem2({
    id: 'dem.det-semejantes-2x2', teorema: 't.det-semejantes-2x2', nivel: '6.4', habilidades: ['6.4.invariantes', '6.4.demostrar'], requiere: ['t.det-producto-2x2', 't.det-invertible-2x2'], refsExtra: ['d.semejantes', 'd.matriz-inversa', 'd.determinante'],
    param: rng => ({ a: rng.pick(['A', 'X']), b: rng.pick(['B', 'Y']), p: rng.pick(['P', 'S']) }),
    enunciado: p => r`Sean $${p.a},${p.p}$ matrices $2\times2$ con $${p.p}$ invertible y $${p.b}=${p.p}^{-1}${p.a}${p.p}$. Demuestra que $\det ${p.b}=\det ${p.a}$.`,
    hip: p => [r`$${p.p}$ invertible y $${p.b}=${p.p}^{-1}${p.a}${p.p}$`, 'Puedes citar el determinante de un producto $2\\times2$ y el criterio de invertibilidad'], meta: p => r`$\det ${p.b}=\det ${p.a}$`,
    L: p => [
      ['L1', r`Por el determinante de un producto, $\det ${p.b}=\det(${p.p}^{-1})\,\det ${p.a}\,\det ${p.p}$.`, 't.det-producto-2x2'],
      ['L2', r`Como $${p.p}$ es invertible, $\det ${p.p}\neq0$ (criterio de invertibilidad $2\times2$).`, 't.det-invertible-2x2'],
      ['L3', r`De $${p.p}^{-1}${p.p}=I$ se tiene $\det(${p.p}^{-1})\det ${p.p}=\det I=1$, así que $\det(${p.p}^{-1})\det ${p.p}=1$.`, 't.det-producto-2x2', ['L2']],
      ['L4', r`Sustituyendo en L1 y conmutando números, $\det ${p.b}=\det ${p.a}$ por el factor $\det(${p.p}^{-1})\det ${p.p}$, que vale ⟦h1⟧. ∎`, 'd.determinante', ['L1', 'L3'], [H('h1', r`$1$`, [r`$1$`, r`$0$`, r`$\det ${p.p}$`], false)]],
    ],
    dist: p => [[r`Con $${p.p}=2I$ se cumple; luego siempre.`, 'un ejemplo no prueba el caso general'], [r`Como $${p.b}$ y $${p.a}$ se parecen, tienen el mismo determinante.`, 'hay que probarlo con las propiedades del determinante']],
    err: p => [['L1', r`Por el determinante de un producto, $\det ${p.b}=\det(${p.p}^{-1})+\det ${p.a}+\det ${p.p}$.`, 'error-de-calculo', 'El determinante de un producto es el **producto** de los determinantes.'], ['L3', r`De $${p.p}^{-1}${p.p}=I$ se tiene $\det(${p.p}^{-1})\det ${p.p}=\det I=0$.`, 'error-de-calculo', '$\\det I=1$.']],
    valida: [['multiplicativa', r`Usar $\det(XYZ)=\det X\det Y\det Z$ y $\det(P^{-1})=1/\det P$`, 'Es la prueba estándar.']],
    idea: p => r`$\det(${p.p}^{-1})\det ${p.p}=1$ cancela los dos factores.`, primero: p => r`aplica el determinante de un producto a $${p.p}^{-1}${p.a}${p.p}$.`,
  });

  dem2({
    id: 'dem.semejante-potencias', teorema: 't.semejante-potencias', nivel: '6.4', habilidades: ['6.4.potencias', '6.4.diagonal', '6.4.demostrar'], requiere: ['t.mat-producto-asoc'], refsExtra: ['d.semejantes', 'd.hip-induccion', 'b.peano'],
    param: rng => ({ a: rng.pick(['A', 'M']), p: rng.pick(['P', 'S']), d: rng.pick(['D', 'Λ']), k: rng.pick(['k', 'n']) }),
    enunciado: p => r`Demuestra por inducción que si $${p.a}=${p.p}${p.d}${p.p}^{-1}$, entonces $${p.a}^${p.k}=${p.p}${p.d}^${p.k}${p.p}^{-1}$ para todo $${p.k}\ge1$.`,
    hip: p => [r`$${p.a}=${p.p}${p.d}${p.p}^{-1}$ con $${p.p}$ invertible`, 'Puedes citar la asociatividad del producto'], meta: p => r`$${p.a}^${p.k}=${p.p}${p.d}^${p.k}${p.p}^{-1}$`,
    L: p => [
      ['L1', r`Base $${p.k}=1$: $${p.a}^1=${p.a}=${p.p}${p.d}^1${p.p}^{-1}$ por hipótesis.`, 'b.peano'],
      ['L2', r`Paso: supongamos $${p.a}^${p.k}=${p.p}${p.d}^${p.k}${p.p}^{-1}$. Entonces $${p.a}^{${p.k}+1}=${p.a}^${p.k}${p.a}=(${p.p}${p.d}^${p.k}${p.p}^{-1})(${p.p}${p.d}${p.p}^{-1})$.`, 'd.hip-induccion', ['L1']],
      ['L3', r`Por asociatividad, $=${p.p}${p.d}^${p.k}(${p.p}^{-1}${p.p})${p.d}${p.p}^{-1}$, y $${p.p}^{-1}${p.p}=$ ⟦h1⟧.`, 't.mat-producto-asoc', ['L2'], [H('h1', r`$I$`, [r`$I$`, r`$0$`, r`$${p.p}$`], false)]],
      ['L4', r`Así $${p.a}^{${p.k}+1}=${p.p}${p.d}^{${p.k}+1}${p.p}^{-1}$. ∎`, 'd.hip-induccion', ['L3']],
    ],
    dist: p => [[r`Con $${p.d}=2I$ y $k=2$ se comprueba; luego siempre.`, 'un ejemplo no prueba el caso general'], [r`Como $${p.p}$ y $${p.p}^{-1}$ se cancelan, $${p.a}^${p.k}=${p.d}^${p.k}$.`, 'solo se cancelan en el producto intermedio, no en los extremos']],
    err: p => [['L2', r`Entonces $${p.a}^{${p.k}+1}=(${p.p}${p.d}^${p.k}${p.p}^{-1})+(${p.p}${p.d}${p.p}^{-1})$.`, 'error-de-calculo', 'Las potencias se forman **multiplicando**.'], ['L3', r`Por asociatividad, $=${p.p}${p.d}^${p.k}(${p.p}^{-1}+${p.p})${p.d}${p.p}^{-1}$.`, 'error-de-calculo', 'Es el producto $P^{-1}P$.']],
    valida: [['induccion', r`Inducción sobre $k$ con $P^{-1}P=I$ en el medio`, 'Es la prueba estándar.']],
    idea: p => r`en $A^{k+1}=A^kA$ los factores $${p.p}^{-1}${p.p}$ del medio se cancelan.`, primero: p => r`comprueba el caso $${p.k}=1$.`,
  });

  R.nivel({
    id: '6.4', mundo: 6, titulo: 'Cambio de base y semejanza', tema: 'Semejanza, invariantes y diagonalización',
    habilidades: ['6.4.cambio', '6.4.diagonal', '6.4.invariantes', '6.4.potencias', '6.4.demostrar'],
    teoremas: ['t.semejanza-cambio-base', 't.traza-semejantes', 't.det-semejantes-2x2', 't.semejante-potencias'],
    leccion: {
      intro: 'La matriz de una transformación depende de la base elegida. Al cambiar de base, la matriz cambia por **semejanza**: $B=P^{-1}AP$. Con una base adecuada la matriz puede volverse diagonal y los cálculos se simplifican.',
      definiciones: [
        { nombre: 'Fórmula de semejanza', tex: 'Si $A=[T]_B$ (canónica) y $C$ tiene por columnas los vectores de $P$, entonces $[T]_C=P^{-1}AP$.' },
        { nombre: 'Invariantes', tex: 'Matrices semejantes tienen la misma **traza** y el mismo **determinante** (y el mismo rango). Si difieren, no son semejantes.' },
        { nombre: 'Diagonalizar', tex: 'Si hay una base de vectores con $Av_i=\\lambda_iv_i$, en esa base la matriz es $D=\\mathrm{diag}(\\lambda_i)$ y $A=PDP^{-1}$.' },
        { nombre: 'Potencias', tex: '$A^k=PD^kP^{-1}$: elevar una diagonal solo eleva sus entradas.' },
      ],
      teorema: 't.semejante-potencias',
      ejemplo: { enunciado: 'Si $A=PDP^{-1}$ con $P=\\begin{pmatrix}1&1\\\\0&1\\end{pmatrix}$ y $D=\\mathrm{diag}(2,3)$, calcula $A^2$.', pasos: ['$D^2=\\mathrm{diag}(4,9)$ y $P^{-1}=\\begin{pmatrix}1&-1\\\\0&1\\end{pmatrix}$.', '$PD^2=\\begin{pmatrix}4&9\\\\0&9\\end{pmatrix}$.', '$A^2=PD^2P^{-1}=\\begin{pmatrix}4&5\\\\0&9\\end{pmatrix}$.'] },
    },
  });

  if (typeof module !== 'undefined') module.exports = AC;
})(globalThis.AC = globalThis.AC || {});
