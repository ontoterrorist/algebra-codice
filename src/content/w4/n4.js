/* Mundo 4, nivel 4.4 — Determinantes. */
(function (AC) {
  const { R, H, T, gen, dem2 } = AC.cont, r = String.raw, M = AC.mat, Rat = AC.Rat;
  const ref = (id, tipo, nombre) => R.ref({ id, tipo, nombre });
  ref('d.determinante', 'definicion', 'Determinante: det A = Σᵢ (−1)^{i+1} aᵢ₁ det(Mᵢ₁), desarrollo por la primera columna'); ref('d.cofactor', 'definicion', 'Cofactor Cᵢⱼ = (−1)^{i+j} det(Mᵢⱼ), con Mᵢⱼ la submatriz sin la fila i y la columna j');

  const HB = (id, nombre) => R.habilidad({ id: '4.4.' + id, nombre, nivel: '4.4' });
  HB('calcular', 'Calcular determinantes'); HB('propiedades', 'Propiedades del determinante'); HB('cramer', 'Regla de Cramer'); HB('geometria', 'Áreas y volúmenes'); HB('demostrar', 'Demostrar con determinantes');
  const TE = (id, titulo, enunciado, requiere, hab) => R.teorema({ id, titulo, nivel: '4.4', enunciado, requiere, habilidades: hab });
  TE('t.det-invertible-2x2', 'Determinante e inversa (2×2)', r`$\begin{pmatrix}a&b\\c&d\end{pmatrix}$ es invertible si y solo si $ad-bc\neq0$, con inversa $\frac{1}{ad-bc}\begin{pmatrix}d&-b\\-c&a\end{pmatrix}$.`, ['t.mat-inversa-unica'], ['4.4.calcular', '4.4.propiedades', '4.4.demostrar']);
  TE('t.det-producto-2x2', 'Determinante de un producto (2×2)', r`Para matrices $2\times2$, $\det(AB)=\det A\cdot\det B$.`, [], ['4.4.propiedades', '4.4.demostrar']);
  TE('t.cramer-2x2', 'Regla de Cramer (2×2)', r`Si $\det A\neq0$, la solución de $Ax=b$ es $x_i=\det A_i/\det A$, con $A_i$ la matriz $A$ cambiando su columna $i$ por $b$.`, ['t.det-invertible-2x2'], ['4.4.cramer', '4.4.demostrar']);
  TE('t.det-triangular', 'Determinante de una triangular', r`El determinante de una matriz triangular superior es el producto de su diagonal.`, [], ['4.4.calcular', '4.4.propiedades', '4.4.demostrar']);

  const tx = A => M.tex(A), vtx = A => M.tex(A, 'vmatrix');
  const rm = (rng, m, n, lo, hi) => M.de(Array.from({ length: m }, () => Array.from({ length: n }, () => rng.int(lo, hi))));
  const dn = A => Number(M.det(A).n);

  /* ---------- generadores ---------- */
  gen.entero({
    id: 'w4.n4.det-3x3', nivel: '4.4', habilidades: ['4.4.calcular'], dificultad: 2,
    hacer(rng) {
      const A = rm(rng, 3, 3, -3, 4), res = dn(A), a = A.map(f => f.map(x => Number(x.n)));
      const solo = a[0][0] * a[1][1] * a[2][2] + a[0][1] * a[1][2] * a[2][0] + a[0][2] * a[1][0] * a[2][1], restan = a[0][2] * a[1][1] * a[2][0] + a[0][0] * a[1][2] * a[2][1] + a[0][1] * a[1][0] * a[2][2];
      return { key: tx(A), enun: 'Calcula $\\det\\!' + vtx(A) + '$.', res,
        firmas: [['sin-restar', solo, 'Falta restar las tres diagonales secundarias (regla de Sarrus).'], ['signo-opuesto', -res, 'Revisa el orden: las diagonales principales **suman** y las secundarias **restan**.'], ['solo-restan', restan, 'Esa es solo la suma de las diagonales secundarias.']].filter(f => f[1] !== res),
        pistas: ['Orientación: usa Sarrus o el desarrollo por cofactores.', 'Idea clave: $\\det=\\sum_{\\text{diag principales}}-\\sum_{\\text{diag secundarias}}$.', 'Primer paso: calcula el producto de la diagonal principal.'], expl: 'El determinante vale $' + res + '$.' };
    },
  });

  gen.entero({
    id: 'w4.n4.det-por-operaciones', nivel: '4.4', habilidades: ['4.4.calcular', '4.4.propiedades'], dificultad: 3,
    hacer(rng) {
      const d = [rng.int(1, 3), rng.int(-3, 3) || 1, rng.int(1, 4), rng.int(-2, 2) || 2], U = M.de([[d[0], rng.int(-3, 3), rng.int(-3, 3), rng.int(-3, 3)], [0, d[1], rng.int(-3, 3), rng.int(-3, 3)], [0, 0, d[2], rng.int(-3, 3)], [0, 0, 0, d[3]]]);
      const A = M.copia(U); let swaps = 0;
      for (let k = 0; k < 4; k++) { const i = rng.int(0, 3), j = rng.int(0, 3); if (i === j) continue; const c = rng.int(-2, 2); A[i] = A[i].map((x, t) => x.add(Rat.of(c).mul(A[j][t]))); }
      const i = rng.int(0, 2); [A[i], A[i + 1]] = [A[i + 1], A[i]]; swaps++;
      const res = dn(A), prod = d.reduce((a, b) => a * b, 1);
      if (res !== -prod && res !== prod) return null;
      return { key: tx(A), enun: 'Calcula $\\det\\!' + vtx(A) + '$ escalonando (trae la matriz a triangular con operaciones elementales y lleva la cuenta de los signos).', res,
        firmas: [['sin-signo', -res, 'Cada intercambio de filas cambia el signo; sumar un múltiplo de otra fila **no** lo cambia.'], ['suma-diagonal', d.reduce((a, b) => a + b, 0), 'El determinante de una triangular es el **producto** de la diagonal, no la suma.']].filter(f => f[1] !== res),
        pistas: ['Orientación: escalona hasta una triangular superior.', 'Idea clave: sumar un múltiplo de otra fila no cambia el determinante; un intercambio lo multiplica por $-1$.', 'Primer paso: elige un pivote en la primera columna.'], expl: 'El determinante vale $' + res + '$.' };
    },
  });

  gen.entero({
    id: 'w4.n4.det-propiedades', nivel: '4.4', habilidades: ['4.4.propiedades'], dificultad: 3,
    hacer(rng) {
      const da = rng.pick([-3, -2, -1, 2, 3, 4]), db = rng.pick([-2, -1, 2, 3]), k = rng.pick([2, 3]), p = rng.int(1, 2), q = rng.int(1, 2), res = k ** 3 * da ** p * db ** q;
      const expr = k + 'A^' + (p > 1 ? '{' + p + '}' : '{}').replace('{}', '') + 'B^{T}' + (q > 1 ? '' : '');
      const exprTex = k + 'A' + (p > 1 ? '^{' + p + '}' : '') + (q > 1 ? '(B^T)^{' + q + '}' : 'B^T');
      return { key: [da, db, k, p, q].join(), enun: 'Sean $A$ y $B$ matrices $3\\times3$ con $\\det A=' + da + '$ y $\\det B=' + db + '$. Calcula $\\det(' + exprTex + ')$.', res,
        firmas: [['sin-k-cubo', k * da ** p * db ** q, 'Al multiplicar una matriz $3\\times3$ por $' + k + '$ el determinante se multiplica por $' + k + '^3$, no por $' + k + '$.'], ['suma', k ** 3 * (da ** p + db ** q), 'El determinante de un producto es el producto de los determinantes, no la suma.'], ['sin-potencia', k ** 3 * da * db, 'Con exponente $' + p + '$ en $A$ y $' + q + '$ en $B^T$ los determinantes también se elevan.']].filter(f => f[1] !== res),
        pistas: ['Orientación: $\\det(XY)=\\det X\\det Y$ y $\\det(X^T)=\\det X$.', 'Idea clave: $\\det(kX)=k^n\\det X$ para $n\\times n$.', 'Primer paso: separa el factor escalar $' + k + '$ y calcula $' + k + '^3$.'], expl: '$' + k + '^3\\cdot(' + da + ')^{' + p + '}(' + db + ')^{' + q + '}=' + res + '$.' };
    },
  });

  gen.entero({
    id: 'w4.n4.parametro-cuadratico', nivel: '4.4', habilidades: ['4.4.calcular'], dificultad: 3,
    hacer(rng) {
      const m = rng.int(2, 9), a = rng.pick([1, 2, 3, 4, -1, -2, -3, -4]), b = (m * m) / a; if (!Number.isInteger(b)) return null;
      const A = M.de([[0, a, 0], [b, 0, 0], [0, 0, 0]]); const t = '\\begin{pmatrix}k&' + a + '\\\\' + b + '&k\\end{pmatrix}';
      return { key: [a, b].join(), enun: '¿Para qué valor **positivo** de $k$ se anula $\\det' + t + '$?', res: m,
        firmas: [['sin-raiz', m * m, 'Se anula cuando $k^2=' + a * b + '$: hay que tomar la raíz cuadrada.'], ['negativa', -m, 'Se pide el valor **positivo**.']].filter(f => f[1] !== m),
        pistas: ['Orientación: calcula $\\det=k\\cdot k-' + (a < 0 ? '(' + a + ')' : a) + '\\cdot' + (b < 0 ? '(' + b + ')' : b) + '$.', 'Idea clave: iguala $k^2-' + (a * b < 0 ? '(' + a * b + ')' : a * b) + '=0$.', 'Primer paso: despeja $k^2$.'], expl: '$k^2=' + a * b + '$ y $k=' + m + '$.' };
    },
  });

  gen.entero({
    id: 'w4.n4.cramer', nivel: '4.4', habilidades: ['4.4.cramer'], dificultad: 3,
    hacer(rng) {
      let A; for (let k = 0; k < 60; k++) { const C = rm(rng, 3, 3, -2, 3), d = dn(C); if (d !== 0 && Math.abs(d) <= 6) { A = C; break; } } if (!A) return null;
      const x = [rng.int(-3, 4), rng.int(-3, 4), rng.int(-3, 4)], b = M.aVec(M.mul(A, M.colVec(x))), c = rng.int(0, 2), Ac = M.copia(A); Ac.forEach((f, i) => { f[c] = b[i]; });
      const nombre = ['x', 'y', 'z'][c], num = dn(Ac), den = dn(A);
      return { key: tx(A) + b.join() + c, enun: 'Usa la regla de Cramer para hallar $' + nombre + '$ en $' + M.texSistema(A, b).replace(/^/, '') + '$', res: x[c],
        firmas: [['solo-numerador', num, 'Falta dividir entre $\\det A=' + den + '$.'], ['cociente-invertido', den === 0 ? 0 : Math.round(den / (num || 1)), 'La fórmula es $\\det A_i/\\det A$ (numerador con la columna cambiada).']].filter(f => f[1] !== x[c]),
        pistas: ['Orientación: $' + nombre + '=\\det A_' + (c + 1) + '/\\det A$.', 'Idea clave: $A_' + (c + 1) + '$ es $A$ con su columna ' + (c + 1) + ' reemplazada por $b$.', 'Primer paso: calcula $\\det A=' + den + '$.'], expl: '$' + nombre + '=' + num + '/' + den + '=' + x[c] + '$.' };
    },
  });

  gen.entero({
    id: 'w4.n4.area-volumen', nivel: '4.4', habilidades: ['4.4.geometria'], dificultad: 2,
    hacer(rng) {
      if (rng.chance(0.5)) { const A = rm(rng, 2, 2, -4, 5), d = dn(A); if (d === 0) return null; const [u, v] = [A[0], A[1]], res = Math.abs(d);
        return { key: 'p' + tx(A), enun: 'Halla el área del paralelogramo generado por $u=(' + u.join(',') + ')$ y $v=(' + v.join(',') + ')$.', res,
          firmas: [['con-signo', d, 'El área es el valor **absoluto** del determinante.'], ['triangulo', res / 2, 'Eso sería el área del triángulo; pide el paralelogramo.'], ['sin-restar', Math.abs(Number(u[0].n * v[1].n + u[1].n * v[0].n)), 'El determinante es $u_1v_2-u_2v_1$: los productos cruzados se **restan**.']].filter(f => f[1] !== res && Number.isInteger(f[1])),
          pistas: ['Orientación: el área es $|\\det|$ de la matriz con $u$ y $v$ como filas.', 'Idea clave: $\\det\\begin{pmatrix}u_1&u_2\\\\v_1&v_2\\end{pmatrix}=u_1v_2-u_2v_1$.', 'Primer paso: calcula $u_1v_2-u_2v_1$.'], expl: 'Área $=|' + d + '|=' + res + '$.' }; }
      const A = rm(rng, 3, 3, -3, 4), d = dn(A); if (d === 0) return null; const res = Math.abs(d);
      return { key: 'v' + tx(A), enun: 'Halla el volumen del paralelepípedo generado por los vectores (filas) de $' + tx(A) + '$.', res,
        firmas: [['con-signo', d, 'El volumen es el valor **absoluto** del determinante.'], ['tetraedro', res / 6, 'Eso sería el volumen del tetraedro; pide el paralelepípedo.'], ['solo-principales', Math.abs(Number(A[0][0].mul(A[1][1]).mul(A[2][2]).add(A[0][1].mul(A[1][2]).mul(A[2][0])).add(A[0][2].mul(A[1][0]).mul(A[2][1])).n)), 'Falta restar las diagonales secundarias.']].filter(f => f[1] !== res && Number.isInteger(f[1])),
        pistas: ['Orientación: volumen $=|\\det|$.', 'Idea clave: calcula el determinante $3\\times3$ y toma valor absoluto.', 'Primer paso: aplica Sarrus.'], expl: 'Volumen $=|' + d + '|=' + res + '$.' };
    },
  });

  gen.entero({
    id: 'w4.n4.cofactor', nivel: '4.4', habilidades: ['4.4.calcular'], dificultad: 2,
    hacer(rng) {
      const A = rm(rng, 3, 3, -3, 4), i = rng.int(0, 2), j = rng.int(0, 2), c = Number(M.cofactor(A, i, j).n), men = dn(M.menor(A, i, j)); if (c === men && c === 0) return null;
      return { key: tx(A) + i + j, enun: 'Para $A=' + tx(A) + '$ calcula el cofactor $C_{' + (i + 1) + (j + 1) + '}$.', res: c,
        firmas: [['sin-signo', men, 'Falta el signo $(-1)^{i+j}$ del cofactor.'], ['indices-cruzados', Number(M.cofactor(A, j, i).n), 'El cofactor $C_{ij}$ quita la fila $i$ y la columna $j$ (en ese orden).'], ['signo-invertido', -c, 'El signo es $(-1)^{i+j}$: positivo si $i+j$ es par y negativo si es impar.']].filter(f => f[1] !== c),
        pistas: ['Orientación: $C_{ij}=(-1)^{i+j}\\det(M_{ij})$.', 'Idea clave: $M_{ij}$ es la submatriz que queda al quitar la fila $i$ y la columna $j$.', 'Primer paso: escribe la submatriz $2\\times2$.'], expl: '$C_{' + (i + 1) + (j + 1) + '}=' + c + '$.' };
    },
  });

  /* ---------- demostraciones ---------- */
  dem2({
    id: 'dem.det-invertible-2x2', teorema: 't.det-invertible-2x2', nivel: '4.4', habilidades: ['4.4.calcular', '4.4.propiedades', '4.4.demostrar'], requiere: ['t.mat-inversa-unica'], refsExtra: ['d.matriz-inversa', 'b.doble-implicacion', 'b.contradiccion'],
    param: rng => ({ a: rng.pick(['a', 'p']), b: rng.pick(['b', 'q']), c: rng.pick(['c', 'r']), d: rng.pick(['d', 's']) }),
    enunciado: p => r`Sea $A=\begin{pmatrix}${p.a}&${p.b}\\${p.c}&${p.d}\end{pmatrix}$ y $\Delta=${p.a}${p.d}-${p.b}${p.c}$. Demuestra que $A$ es invertible si y solo si $\Delta\neq0$.`,
    hip: p => [r`$A$ es una matriz $2\times2$ con entradas racionales`, 'Puedes citar la unicidad de la inversa'], meta: p => r`$A$ invertible $\iff\Delta\neq0$`,
    L: p => [
      ['L1', r`Sea $B=\begin{pmatrix}${p.d}&-${p.b}\\-${p.c}&${p.a}\end{pmatrix}$. Un cálculo directo da $AB=BA=\Delta I$.`, 'd.matriz-inversa'],
      ['L2', r`(⇐) Si $\Delta\neq0$, $\frac1\Delta B$ cumple $A(\frac1\Delta B)=(\frac1\Delta B)A=I$: es la inversa de $A$.`, 'd.matriz-inversa', ['L1']],
      ['L3', r`(⇒) Por contradicción, supongamos $\Delta=0$ y $A$ invertible. Entonces $AB=0$ y, multiplicando por $A^{-1}$ a la izquierda, ⟦h1⟧.`, 'b.contradiccion', ['L1'], [H('h1', r`$B=0$`, [r`$B=0$`, r`$B=I$`, r`$A=0$`], false)]],
      ['L4', r`Si $B=0$ entonces $${p.a}=${p.b}=${p.c}=${p.d}=0$, así que $A=0$, que no es invertible: contradicción. Luego $\Delta\neq0$. ∎`, 't.mat-inversa-unica', ['L3']],
    ],
    dist: p => [[r`Con $A=\begin{pmatrix}1&2\\3&4\end{pmatrix}$, $\Delta=-2\neq0$ y es invertible; luego siempre.`, 'un ejemplo no prueba el caso general'], [r`Si $\Delta=0$ entonces $A=0$.`, 'falso: $\\begin{pmatrix}1&1\\\\1&1\\end{pmatrix}$ tiene $\\Delta=0$ y no es nula']],
    err: p => [['L1', r`Sea $B=\begin{pmatrix}${p.d}&${p.b}\\${p.c}&${p.a}\end{pmatrix}$. Un cálculo directo da $AB=BA=\Delta I$.`, 'error-de-calculo', 'En la adjunta $b$ y $c$ cambian de signo.'], ['L2', r`(⇐) Si $\Delta\neq0$, $\Delta B$ cumple $A(\Delta B)=I$.`, 'error-de-calculo', 'Hay que multiplicar por $1/\\Delta$.']],
    valida: [['adjunta', r`Multiplicar $A$ por su adjunta y usar $AB=\Delta I$`, 'Es la prueba estándar.']],
    idea: p => r`$A\cdot\mathrm{adj}(A)=\Delta I$.`, primero: p => r`calcula $AB$ con $B=\begin{pmatrix}${p.d}&-${p.b}\\-${p.c}&${p.a}\end{pmatrix}$.`,
  });

  dem2({
    id: 'dem.det-producto-2x2', teorema: 't.det-producto-2x2', nivel: '4.4', habilidades: ['4.4.propiedades', '4.4.demostrar'], requiere: [], refsExtra: ['d.matriz-producto', 'b.cuerpo-algebra'],
    param: rng => ({ a: rng.pick(['a', 'x']), b: rng.pick(['b', 'y']), c: rng.pick(['c', 'z']), d: rng.pick(['d', 'w']), p: rng.pick(['p', 'e']), q: rng.pick(['q', 'f']), r: rng.pick(['r', 'g']), s: rng.pick(['s', 'h']) }),
    enunciado: p => r`Demuestra que $\det(AB)=\det A\det B$ para $A=\begin{pmatrix}${p.a}&${p.b}\\${p.c}&${p.d}\end{pmatrix}$ y $B=\begin{pmatrix}${p.p}&${p.q}\\${p.r}&${p.s}\end{pmatrix}$.`,
    hip: p => [r`$A$ y $B$ son $2\times2$`, 'Puedes desarrollar productos y usar propiedades de cuerpo'], meta: p => r`$\det(AB)=\det A\det B$`,
    L: p => [
      ['L1', r`$AB=\begin{pmatrix}${p.a}${p.p}+${p.b}${p.r}&${p.a}${p.q}+${p.b}${p.s}\\${p.c}${p.p}+${p.d}${p.r}&${p.c}${p.q}+${p.d}${p.s}\end{pmatrix}$.`, 'd.matriz-producto'],
      ['L2', r`$\det(AB)=(${p.a}${p.p}+${p.b}${p.r})(${p.c}${p.q}+${p.d}${p.s})-(${p.a}${p.q}+${p.b}${p.s})(${p.c}${p.p}+${p.d}${p.r})$.`, 'b.cuerpo-algebra', ['L1']],
      ['L3', r`Al desarrollar, los términos $${p.a}${p.c}${p.p}${p.q}$ y $${p.b}${p.d}${p.r}${p.s}$ aparecen con ⟦h1⟧ y se cancelan.`, 'b.cuerpo-algebra', ['L2'], [H('h1', 'signos opuestos', ['signos opuestos', 'el mismo signo', 'coeficiente cero'], false)]],
      ['L4', r`Quedan $${p.a}${p.d}${p.p}${p.s}+${p.b}${p.c}${p.q}${p.r}-${p.a}${p.d}${p.q}${p.r}-${p.b}${p.c}${p.p}${p.s}=(${p.a}${p.d}-${p.b}${p.c})(${p.p}${p.s}-${p.q}${p.r})$.`, 'b.cuerpo-algebra', ['L3']],
      ['L5', r`Eso es $\det A\det B$. ∎`, 'b.cuerpo-algebra', ['L4']],
    ],
    dist: p => [[r`Con $A=B=I$ se cumple; luego siempre.`, 'un ejemplo no prueba el caso general'], [r`Como el determinante es lineal, $\det(AB)=\det A+\det B$.`, 'el determinante no es lineal en la matriz entera: es multiplicativo']],
    err: p => [['L1', r`$AB=\begin{pmatrix}${p.a}${p.p}&${p.b}${p.q}\\${p.c}${p.r}&${p.d}${p.s}\end{pmatrix}$.`, 'error-de-calculo', 'El producto no se hace entrada por entrada: es fila por columna.'], ['L4', r`Quedan $${p.a}${p.d}${p.p}${p.s}+${p.b}${p.c}${p.q}${p.r}=(${p.a}${p.d}+${p.b}${p.c})(${p.p}${p.s}+${p.q}${p.r})$.`, 'error-de-calculo', 'Los determinantes llevan resta: $ad-bc$ y $ps-qr$.']],
    valida: [['directa', r`Desarrollar ambos lados y comparar`, 'Es la prueba estándar para $2\\times2$.']],
    idea: p => r`desarrolla $(${p.a}${p.p}+${p.b}${p.r})(${p.c}${p.q}+${p.d}${p.s})-(\cdots)(\cdots)$ y agrupa.`, primero: p => r`calcula la matriz producto $AB$.`,
  });

  dem2({
    id: 'dem.cramer-2x2', teorema: 't.cramer-2x2', nivel: '4.4', habilidades: ['4.4.cramer', '4.4.demostrar'], requiere: ['t.det-invertible-2x2'], refsExtra: ['d.matriz-inversa', 'b.cuerpo-algebra'],
    param: rng => ({ a: rng.pick(['a', 'p']), b: rng.pick(['b', 'q']), c: rng.pick(['c', 'r']), d: rng.pick(['d', 's']), u: rng.pick(['u', 'e']), v: rng.pick(['v', 'f']) }),
    enunciado: p => r`Sea $A=\begin{pmatrix}${p.a}&${p.b}\\${p.c}&${p.d}\end{pmatrix}$ con $\Delta=${p.a}${p.d}-${p.b}${p.c}\neq0$. Demuestra que la solución de $A\binom{x}{y}=\binom{${p.u}}{${p.v}}$ es $x=\frac{${p.u}${p.d}-${p.b}${p.v}}{\Delta}$ e $y=\frac{${p.a}${p.v}-${p.u}${p.c}}{\Delta}$.`,
    hip: p => [r`$\Delta\neq 0$`, 'Puedes citar la fórmula de la inversa de una $2\\times2$'], meta: p => r`$x,y$ dados por Cramer`,
    L: p => [
      ['L1', r`Como $\Delta\neq0$, por el teorema de determinante e inversa, $A^{-1}=\frac1\Delta\begin{pmatrix}${p.d}&-${p.b}\\-${p.c}&${p.a}\end{pmatrix}$.`, 't.det-invertible-2x2'],
      ['L2', r`Multiplicando $A\binom xy=\binom{${p.u}}{${p.v}}$ por $A^{-1}$ a la izquierda, $\binom xy=A^{-1}\binom{${p.u}}{${p.v}}$.`, 'd.matriz-inversa', ['L1']],
      ['L3', r`Calculando el producto, $x=\frac{${p.d}${p.u}-${p.b}${p.v}}{\Delta}$ e $y=\frac{-${p.c}${p.u}+${p.a}${p.v}}{\Delta}$.`, 'b.cuerpo-algebra', ['L2']],
      ['L4', r`El numerador de $x$ es $\det\begin{pmatrix}${p.u}&${p.b}\\${p.v}&${p.d}\end{pmatrix}$ (columna 1 cambiada) y el de $y$ es ⟦h1⟧. ∎`, 'b.cuerpo-algebra', ['L3'], [H('h1', r`$\det\begin{pmatrix}${p.a}&${p.u}\\${p.c}&${p.v}\end{pmatrix}$`, [r`$\det\begin{pmatrix}${p.a}&${p.u}\\${p.c}&${p.v}\end{pmatrix}$`, r`$\det\begin{pmatrix}${p.u}&${p.b}\\${p.v}&${p.d}\end{pmatrix}$`, r`$\det A$`], false)]],
    ],
    dist: p => [[r`Con $x+y=3$, $x-y=1$ da $x=2$, $y=1$; luego la fórmula es correcta.`, 'un ejemplo no prueba el caso general'], [r`La solución es $x=\Delta\cdot ${p.u}$.`, 'falta la matriz inversa: $x$ es un cociente por $\\Delta$']],
    err: p => [['L2', r`Multiplicando por $A^{-1}$ a la derecha, $\binom xy=\binom{${p.u}}{${p.v}}A^{-1}$.`, 'error-de-calculo', 'La inversa multiplica por la izquierda del vector columna.'], ['L3', r`Calculando, $x=\frac{${p.d}${p.u}+${p.b}${p.v}}{\Delta}$.`, 'error-de-calculo', 'El segundo término de la primera fila de $A^{-1}$ es $-b$.']],
    valida: [['inversa', r`Usar $x=A^{-1}b$ con la inversa de $2\times2$`, 'Es la prueba estándar.']],
    idea: p => r`$x=A^{-1}b$ y la inversa de una $2\times2$ tiene fórmula explícita.`, primero: p => r`escribe $A^{-1}$ con el teorema de determinante e inversa.`,
  });

  dem2({
    id: 'dem.det-triangular', teorema: 't.det-triangular', nivel: '4.4', habilidades: ['4.4.calcular', '4.4.propiedades', '4.4.demostrar'], requiere: [], refsExtra: ['d.determinante', 'd.cofactor', 'd.hip-induccion', 'b.peano'],
    param: rng => ({ n: rng.pick(['n', 'm']), u: rng.pick(['U', 'T']), a: rng.pick(['a', 'u']) }),
    enunciado: p => r`Demuestra por inducción que si $${p.u}$ es triangular superior $${p.n}\times ${p.n}$, $\det ${p.u}=${p.a}_{11}${p.a}_{22}\cdots ${p.a}_{${p.n}${p.n}}$ (usa el desarrollo por la primera columna).`,
    hip: p => [r`$${p.u}$ es triangular superior (ceros bajo la diagonal)`, 'El determinante se define por desarrollo en la primera columna'], meta: p => r`$\det ${p.u}=\prod_i ${p.a}_{ii}$`,
    L: p => [
      ['L1', r`Base: si $${p.n}=1$, $\det ${p.u}=${p.a}_{11}$, el producto de su única entrada diagonal.`, 'b.peano'],
      ['L2', r`Paso: supongamos cierto para $(${p.n}-1)\times(${p.n}-1)$. En $${p.n}\times ${p.n}$, la primera columna de $${p.u}$ es $(${p.a}_{11},0,\dots,0)^T$.`, 'd.hip-induccion', ['L1']],
      ['L3', r`En el desarrollo por la primera columna, todos los sumandos con $${p.a}_{i1}$, $i\ge2$, son ⟦h1⟧, así que $\det ${p.u}=${p.a}_{11}\det M_{11}$.`, 'd.determinante', ['L2'], [H('h1', r`cero`, [r`cero`, r`uno`, r`negativos`], false)]],
      ['L4', r`La submatriz $M_{11}$ es triangular superior $(${p.n}-1)\times(${p.n}-1)$ con diagonal $${p.a}_{22},\dots,${p.a}_{${p.n}${p.n}}$; por hipótesis de inducción $\det M_{11}=${p.a}_{22}\cdots ${p.a}_{${p.n}${p.n}}$.`, 'd.hip-induccion', ['L3']],
      ['L5', r`Luego $\det ${p.u}=${p.a}_{11}${p.a}_{22}\cdots ${p.a}_{${p.n}${p.n}}$. ∎`, 'd.determinante', ['L4']],
    ],
    dist: p => [[r`Con $\begin{pmatrix}2&5\\0&3\end{pmatrix}$ el determinante es $6=2\cdot3$; luego siempre.`, 'un ejemplo no prueba el caso general'], [r`Como los ceros anulan todo, el determinante es $0$.`, 'los ceros bajo la diagonal anulan los sumandos, no la diagonal']],
    err: p => [['L3', r`Todos los sumandos con $${p.a}_{i1}$, $i\ge2$, valen $1$, así que $\det ${p.u}=${p.a}_{11}+\det M_{11}$.`, 'error-de-calculo', 'Son cero (la entrada es cero), no uno.'], ['L4', r`La submatriz $M_{11}$ tiene diagonal $${p.a}_{11},\dots,${p.a}_{${p.n}${p.n}}$.`, 'error-de-calculo', 'Al quitar la fila 1 y la columna 1 sale la diagonal $a_{22},\\dots,a_{nn}$.']],
    valida: [['induccion', r`Inducción sobre el tamaño con el desarrollo por la primera columna`, 'Es la prueba estándar.']],
    idea: p => r`la primera columna tiene un solo término no nulo.`, primero: p => r`prueba el caso $${p.n}=1$.`,
  });

  R.nivel({
    id: '4.4', mundo: 4, titulo: 'Determinantes', tema: 'Determinantes, Cramer y geometría',
    habilidades: ['4.4.calcular', '4.4.propiedades', '4.4.cramer', '4.4.geometria', '4.4.demostrar'],
    teoremas: ['t.det-invertible-2x2', 't.det-producto-2x2', 't.cramer-2x2', 't.det-triangular'],
    leccion: {
      intro: 'El **determinante** es un número asociado a una matriz cuadrada que dice si es invertible y mide cuánto escala áreas o volúmenes.',
      definiciones: [
        { nombre: 'Cálculo', tex: 'Para $2\\times2$: $ad-bc$. Para $3\\times3$: regla de Sarrus o desarrollo por cofactores $\\det A=\\sum_j a_{1j}C_{1j}$ con $C_{ij}=(-1)^{i+j}\\det M_{ij}$.' },
        { nombre: 'Propiedades', tex: '$\\det(AB)=\\det A\\det B$, $\\det A^T=\\det A$, $\\det(kA)=k^n\\det A$. Un intercambio de filas cambia el signo; sumar un múltiplo de una fila a otra no lo cambia. En una triangular es el producto de la diagonal.' },
        { nombre: 'Invertibilidad y Cramer', tex: '$A$ es invertible si y solo si $\\det A\\neq0$. Entonces $x_i=\\det A_i/\\det A$ resuelve $Ax=b$.' },
        { nombre: 'Geometría', tex: '$|\\det|$ de la matriz cuyas filas son los vectores es el área (en $\\mathbb{R}^2$) o el volumen (en $\\mathbb{R}^3$) del paralelogramo o paralelepípedo que generan.' },
      ],
      teorema: 't.det-invertible-2x2',
      ejemplo: { enunciado: 'Calcula $\\det\\begin{pmatrix}1&2&0\\\\0&3&1\\\\2&0&1\\end{pmatrix}$.', pasos: ['Diagonales principales: $1\\cdot3\\cdot1+2\\cdot1\\cdot2+0\\cdot0\\cdot0=3+4+0=7$.', 'Diagonales secundarias: $0\\cdot3\\cdot2+1\\cdot1\\cdot0+2\\cdot0\\cdot1=0$.', 'El determinante es $7-0=7$.'] },
    },
  });

  if (typeof module !== 'undefined') module.exports = AC;
})(globalThis.AC = globalThis.AC || {});
