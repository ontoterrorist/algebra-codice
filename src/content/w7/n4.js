/* Mundo 7, nivel 7.4 — Matrices simétricas y cadenas de Markov. */
(function (AC) {
  const { R, H, T, gen, dem2 } = AC.cont, r = String.raw, M = AC.mat, Rat = AC.Rat, C = AC.conj;
  const ref = (id, tipo, nombre) => R.ref({ id, tipo, nombre });
  ref('d.simetrica', 'definicion', 'Matriz simétrica: A = Aᵀ'); ref('d.estocastica', 'definicion', 'Matriz estocástica por columnas: entradas ≥ 0 y cada columna suma 1; vector de probabilidad: entradas ≥ 0 que suman 1');

  const HB = (id, nombre) => R.habilidad({ id: '7.4.' + id, nombre, nivel: '7.4' });
  HB('simetricas', 'Matrices simétricas'); HB('markov-paso', 'Pasos de una cadena de Markov'); HB('estacionario', 'Distribución estacionaria'); HB('estocasticas', 'Matrices estocásticas'); HB('demostrar', 'Demostrar con simétricas y Markov');
  const TE = (id, titulo, enunciado, requiere, hab) => R.teorema({ id, titulo, nivel: '7.4', enunciado, requiere, habilidades: hab });
  TE('t.simetrica-propios-ortogonales', 'Propios de simétricas', r`Si $A=A^T$, los vectores propios de valores propios distintos son ortogonales.`, ['t.mat-transpuesta-producto'], ['7.4.simetricas', '7.4.demostrar']);
  TE('t.espectral-2x2', 'Teorema espectral (2×2)', r`Una $\begin{pmatrix}a&b\\b&d\end{pmatrix}$ real tiene valores propios reales y, si $b\neq0$, una base ortogonal de vectores propios.`, ['t.simetrica-propios-ortogonales', 't.cuadratica-formula', 't.polinomio-caracteristico-2x2'], ['7.4.simetricas', '7.4.demostrar']);
  TE('t.markov-estocastica', 'La estocástica tiene valor propio 1', r`Si $P$ es estocástica por columnas, $1$ es valor propio de $P$.`, ['t.invertible-equivalencias', 't.ops-elementales'], ['7.4.estocasticas', '7.4.estacionario', '7.4.demostrar']);
  TE('t.markov-conserva', 'Markov conserva probabilidades', r`Si $P$ es estocástica y $x$ un vector de probabilidad, $Px$ también lo es.`, ['t.mat-producto-asoc'], ['7.4.markov-paso', '7.4.estocasticas', '7.4.demostrar']);

  const F = M.fmt, tx = A => M.tex(A);
  const par = v => '(' + v.join(',') + ')';
  const pct = x => x.toString();
  const dec = (n, d = 10) => Rat.of(n, d);

  /* matrices simétricas con valores propios racionales: A = d1·uuᵀ/(u·u) + d2·vvᵀ/(v·v) con u ⟂ v */
  const DIR = [[[1, 1], [1, -1]], [[1, 2], [2, -1]], [[2, 1], [1, -2]], [[1, 0], [0, 1]], [[1, 3], [3, -1]], [[3, 1], [1, -3]]];
  const simetrica = (rng, d1, d2) => { const [u, v] = rng.pick(DIR), U = M.de([u]), V = M.de([v]), pu = M.esc(M.mul(M.T(U), U), Rat.of(d1, u[0] * u[0] + u[1] * u[1])), pv = M.esc(M.mul(M.T(V), V), Rat.of(d2, v[0] * v[0] + v[1] * v[1])); return { A: M.add(pu, pv), u, v }; };
  const entera = A => A.every(f => f.every(x => x.isInt()));
  /* matriz estocástica por columnas con décimas */
  const columna = (rng, n) => { const cuts = Array.from({ length: n - 1 }, () => rng.int(0, 10)).sort((a, b) => a - b), p = []; let prev = 0; cuts.forEach(c => { p.push(c - prev); prev = c; }); p.push(10 - prev); return p; };
  const estocastica = (rng, n) => { const cols = Array.from({ length: n }, () => columna(rng, n)); return M.T(M.de(cols.map(c => c.map(x => Rat.of(x, 10))))); };
  const prob = (rng, n) => { const c = columna(rng, n); return c.map(x => Rat.of(x, 10)); };
  const nombres = [['soleado', 'lluvioso'], ['soleado', 'nublado', 'lluvioso']], marcas = ['A', 'B', 'C'];

  /* ---------- generadores ---------- */
  gen.conjunto({
    id: 'w7.n4.valores-simetrica', nivel: '7.4', habilidades: ['7.4.simetricas'], dificultad: 3,
    hacer(rng) {
      const d1 = rng.int(-3, 4), d2 = rng.int(-3, 4); if (d1 === d2) return null; const { A } = simetrica(rng, d1, d2); if (!entera(A) || A[0][1].isZero()) return null;
      return { key: tx(A), enun: 'La matriz simétrica $A=' + tx(A) + '$ tiene valores propios enteros. Escríbelos como conjunto.', res: [String(d1), String(d2)], norm: 'racional',
        firmas: [['diagonal', A.map((f, i) => String(f[i])), 'Los valores propios no son las entradas de la diagonal (la matriz no es triangular).'], ['traza-det', [String(M.traza(A)), String(M.det(A))], 'Esa es la traza y el determinante; los valores propios son las raíces de $\\lambda^2-(\\operatorname{tr}A)\\lambda+\\det A$.']].filter(f => C.fmt(f[1]) !== C.fmt([String(d1), String(d2)])),
        pistas: ['Orientación: $\\lambda^2-(\\operatorname{tr}A)\\lambda+\\det A=0$.', 'Idea clave: busca dos números con suma $' + M.traza(A) + '$ y producto $' + M.det(A) + '$.', 'Primer paso: calcula la traza y el determinante.'], expl: 'Los valores propios son $' + d1 + '$ y $' + d2 + '$.' };
    },
  });

  gen.tupla({
    id: 'w7.n4.otro-propio-ortogonal', nivel: '7.4', habilidades: ['7.4.simetricas'], dificultad: 3,
    hacer(rng) {
      const d1 = rng.int(-3, 4), d2 = rng.int(-3, 4); if (d1 === d2) return null; const { A, u, v } = simetrica(rng, d1, d2); if (!entera(A) || A[0][1].isZero()) return null; const B = M.sub(A, M.esc(M.id(2), Rat.of(d2)));
      return { key: tx(A) + par(u), enun: 'La matriz simétrica $A=' + tx(A) + '$ tiene a $u=' + par(u) + '$ como vector propio con $\\lambda=' + d1 + '$. Halla un vector propio **no nulo** del otro valor propio, $\\lambda=' + d2 + '$ (recuerda que es ortogonal a $u$).', campos: ['x', 'y'], res: v.map(String), verificador: { id: 'nucleo-vector', args: { A: B.map(f => f.map(String)), n: 2 } },
        firmas: [['el-mismo', u.map(String), 'Ese es el vector propio de $\\lambda=' + d1 + '$, no el del otro valor propio.'], ['cero', ['0', '0'], 'El vector cero nunca es vector propio.']],
        pistas: ['Orientación: en una matriz simétrica, los vectores propios de valores distintos son ortogonales.', 'Idea clave: en $\\mathbb{R}^2$ el vector $(x,y)$ ortogonal a $(' + u[0] + ',' + u[1] + ')$ cumple $' + u[0] + 'x+' + u[1] + 'y=0$.', 'Primer paso: comprueba con $(A-' + d2 + 'I)w=0$.'], expl: 'Sirve $' + par(v) + '$.' };
    },
  });

  gen.tupla({
    id: 'w7.n4.un-paso', nivel: '7.4', habilidades: ['7.4.markov-paso'], dificultad: 2,
    hacer(rng) {
      const k = rng.int(2, 3), N = nombres[k - 2], P = estocastica(rng, k), x0 = prob(rng, k), x1 = M.aVec(M.mul(P, M.colVec(x0)));
      return { key: tx(P) + x0.join(), enun: 'El clima de una ciudad (' + N.join(', ') + ') se modela con una cadena de Markov de matriz de transición $P=' + tx(P) + '$ (la columna $j$ da las probabilidades de pasar *desde* el estado $j$). Hoy la distribución es $x_0=' + M.texVec(x0) + '$. ¿Cuál es la distribución de mañana, $x_1=Px_0$?', campos: N.map(n => n.slice(0, 3)), res: x1.map(String),
        firmas: [['transpuesta', M.aVec(M.mul(M.T(P), M.colVec(x0))).map(String), 'La columna $j$ de $P$ da el destino desde el estado $j$: usa $P x_0$, no $P^Tx_0$.'], ['sin-actualizar', x0.map(String), 'Esa es la distribución de hoy: hay que multiplicar por $P$.']].filter(f => f[1].join() !== x1.map(String).join()),
        pistas: ['Orientación: $x_1=Px_0$.', 'Idea clave: cada coordenada de $x_1$ es fila de $P$ por $x_0$.', 'Primer paso: calcula la primera coordenada.'], expl: '$x_1=' + par(x1) + '$.' };
    },
  });

  gen.tupla({
    id: 'w7.n4.dos-pasos', nivel: '7.4', habilidades: ['7.4.markov-paso'], dificultad: 3,
    hacer(rng) {
      const P = estocastica(rng, 2), x0 = prob(rng, 2), x2 = M.aVec(M.mul(M.mul(P, P), M.colVec(x0))), x1 = M.aVec(M.mul(P, M.colVec(x0)));
      return { key: tx(P) + x0.join(), enun: 'Una tienda tiene dos clientes tipo A y B que cambian de marca según $P=' + tx(P) + '$ (columnas = origen). Hoy los clientes se reparten $x_0=' + M.texVec(x0) + '$. ¿Cuál será el reparto dentro de **dos** periodos, $x_2$?', campos: ['A', 'B'], res: x2.map(String),
        firmas: [['un-periodo', x1.map(String), 'Eso es $x_1$ (un periodo); falta aplicar $P$ otra vez.'], ['orden', x2.slice().reverse().map(String), 'Mantén el orden de los estados.']].filter(f => f[1].join() !== x2.map(String).join()),
        pistas: ['Orientación: $x_2=P(Px_0)$.', 'Idea clave: calcula $x_1$ y luego $x_2=Px_1$.', 'Primer paso: calcula $x_1=Px_0$.'], expl: '$x_2=' + par(x2) + '$.' };
    },
  });

  gen.tupla({
    id: 'w7.n4.estacionaria', nivel: '7.4', habilidades: ['7.4.estacionario'], dificultad: 3,
    hacer(rng) {
      const a = rng.int(1, 8), b = rng.int(1, 8); if (a + b > 10 || a === b && rng.chance(0.5)) return null; const A = Rat.of(a, 10), B = Rat.of(b, 10), P = M.de([[Rat.of(1).sub(A), B], [A, Rat.of(1).sub(B)]]), pi = [B.div(A.add(B)), A.div(A.add(B))];
      return { key: a + ',' + b, enun: 'Una cadena de Markov con dos estados tiene $P=' + tx(P) + '$. Halla la distribución **estacionaria** $\\pi$ (con $P\\pi=\\pi$ y suma $1$).', campos: ['π₁', 'π₂'], res: pi.map(String),
        firmas: [['sin-normalizar', [String(B), String(A)], 'El vector propio $(b,a)$ hay que **normalizar** para que sume $1$: divide entre $a+b$.'], ['invertido', pi.slice().reverse().map(String), 'Revisa el orden: $\\pi=\\frac{(b,a)}{a+b}$, con $a$ la probabilidad de salir del estado $1$.']].filter(f => f[1].join() !== pi.map(String).join()),
        pistas: ['Orientación: resuelve $(P-I)\\pi=0$.', 'Idea clave: la primera ecuación es $-a\\pi_1+b\\pi_2=0$; además $\\pi_1+\\pi_2=1$.', 'Primer paso: identifica $a=' + A + '$ (salir del estado 1) y $b=' + B + '$.'], expl: '$\\pi=' + par(pi) + '$.' };
    },
  });

  gen.racional({
    id: 'w7.n4.entrada-faltante', nivel: '7.4', habilidades: ['7.4.estocasticas'], dificultad: 2,
    hacer(rng) {
      const k = rng.int(2, 3), P = estocastica(rng, k), j = rng.int(0, k - 1), i = rng.int(0, k - 1), v = P[i][j]; const filas = P.map((f, a) => f.map((x, b) => (a === i && b === j ? 'p' : M.texN(x))));
      const t = '\\begin{pmatrix}' + filas.map(f => f.join('&')).join('\\\\') + '\\end{pmatrix}';
      return { key: t, enun: '$P=' + t + '$ es una matriz de transición estocástica por columnas. ¿Cuánto vale $p$? (puedes escribirlo como fracción o decimal)', res: v.toString(),
        firmas: [['suma-de-la-fila', P[i].reduce((s, x, b) => (b === j ? s : s.add(x)), Rat.of(0)).toString(), 'Las que suman $1$ son las **columnas**, no las filas.'], ['uno-menos-todo', Rat.of(1).sub(v).toString(), 'Es el complemento: $p=1-$ (suma del resto de la columna $' + (j + 1) + '$), pero revisa la cuenta.']].filter(f => f[1] !== v.toString()),
        pistas: ['Orientación: cada columna de una matriz estocástica suma $1$.', 'Idea clave: $p=1-$ (suma de las demás entradas de la columna $' + (j + 1) + '$).', 'Primer paso: suma las otras entradas de la columna $' + (j + 1) + '$.'], expl: '$p=' + v + '$.' };
    },
  });

  gen.eleccion({
    id: 'w7.n4.cual-estocastica', nivel: '7.4', habilidades: ['7.4.estocasticas'], dificultad: 2,
    hacer(rng) {
      const P = estocastica(rng, 2); if (P[0][0].eq(P[0][1])) return null; const filas = M.T(P), neg = M.de([[Rat.of(12, 10), Rat.of(3, 10)], [Rat.of(-2, 10), Rat.of(7, 10)]]), pasada = M.de([[P[0][0], P[0][1].add(Rat.of(1, 10))], [P[1][0], P[1][1]]]);
      if (M.igual(filas, P)) return null;
      return { key: tx(P), enun: '¿Cuál de estas matrices es **estocástica por columnas** (puede ser matriz de transición de una cadena de Markov)?', ok: '$' + tx(P) + '$', malas: [['por-filas', '$' + tx(filas) + '$', 'Sus **filas** suman $1$ pero sus columnas no.'], ['negativa', '$' + tx(neg) + '$', 'Tiene una entrada negativa: las probabilidades no pueden ser negativas.'], ['suma-mal', '$' + tx(pasada) + '$', 'Una de sus columnas no suma $1$.']],
        pistas: ['Orientación: las entradas deben ser $\\ge0$ y cada **columna** debe sumar $1$.', 'Idea clave: suma cada columna.', 'Primer paso: suma la primera columna de cada opción.'], expl: 'Solo una tiene columnas que suman $1$ con entradas no negativas.' };
    },
  });

  gen.conjunto({
    id: 'w7.n4.valores-markov', nivel: '7.4', habilidades: ['7.4.estacionario', '7.4.estocasticas'], dificultad: 3,
    hacer(rng) {
      const a = rng.int(1, 8), b = rng.int(1, 8); if (a + b > 10 || (a + b) % 10 === 0 && rng.chance(0.5)) return null; const A = Rat.of(a, 10), B = Rat.of(b, 10), P = M.de([[Rat.of(1).sub(A), B], [A, Rat.of(1).sub(B)]]), l2 = Rat.of(1).sub(A).sub(B);
      if (l2.eq(Rat.of(1))) return null; const res = [...new Set(['1', l2.toString()])];
      return { key: a + ',' + b, enun: 'Halla los valores propios de la matriz de transición $P=' + tx(P) + '$ (escribe el conjunto).', res, norm: 'racional',
        firmas: [['solo-uno', ['1'], 'El $1$ siempre es valor propio de una estocástica, pero hay otro: usa la traza $\\operatorname{tr}P$ para hallarlo.'], ['traza', [String(M.traza(P))], 'Esa es la traza; la suma de los valores propios es la traza y uno de ellos es $1$.']].filter(f => C.fmt(f[1]) !== C.fmt(res)),
        pistas: ['Orientación: uno de los valores propios es $1$.', 'Idea clave: la suma de los valores propios es la traza.', 'Primer paso: calcula $\\operatorname{tr}P=' + M.traza(P) + '$.'], expl: 'Los valores propios son $1$ y $' + l2 + '$.' };
    },
  });

  /* ---------- demostraciones ---------- */
  dem2({
    id: 'dem.simetrica-propios-ortogonales', teorema: 't.simetrica-propios-ortogonales', nivel: '7.4', habilidades: ['7.4.simetricas', '7.4.demostrar'], requiere: ['t.mat-transpuesta-producto'], refsExtra: ['d.simetrica', 'd.propio', 'd.producto-punto'],
    param: rng => ({ a: rng.pick(['A', 'S']), v: rng.pick(['v', 'x']), w: rng.pick(['w', 'y']), l: rng.pick(['λ', 'α']), m: rng.pick(['μ', 'β']) }),
    enunciado: p => r`Sea $${p.a}=${p.a}^T$ con $${p.a}${p.v}=${p.l}${p.v}$, $${p.a}${p.w}=${p.m}${p.w}$ y $${p.l}\neq ${p.m}$. Demuestra que $${p.v}\cdot ${p.w}=0$.`,
    hip: p => [r`$${p.a}$ simétrica, $${p.l}\neq ${p.m}$ valores propios`, 'Puedes usar $u\\cdot v=u^Tv$ y la transpuesta de un producto'], meta: p => r`$${p.v}\cdot ${p.w}=0$`,
    L: p => [
      ['L1', r`Calculamos $(${p.a}${p.v})\cdot ${p.w}=${p.l}(${p.v}\cdot ${p.w})$ por ser $${p.v}$ vector propio.`, 'd.propio'],
      ['L2', r`Por otro lado, $(${p.a}${p.v})\cdot ${p.w}=(${p.a}${p.v})^T${p.w}=${p.v}^T${p.a}^T${p.w}$ por la transpuesta de un producto.`, 't.mat-transpuesta-producto', ['L1']],
      ['L3', r`Como $${p.a}^T=${p.a}$, esto es $${p.v}^T${p.a}${p.w}=${p.v}^T(${p.m}${p.w})=${p.m}(${p.v}\cdot ${p.w})$.`, 'd.simetrica', ['L2']],
      ['L4', r`Igualando, $${p.l}(${p.v}\cdot ${p.w})=${p.m}(${p.v}\cdot ${p.w})$, es decir, $(${p.l}-${p.m})(${p.v}\cdot ${p.w})=0$.`, 'd.producto-punto', ['L1', 'L3']],
      ['L5', r`Como $${p.l}-${p.m}\neq0$, ⟦h1⟧. ∎`, 'd.producto-punto', ['L4'], [H('h1', r`$${p.v}\cdot ${p.w}=0$`, [r`$${p.v}\cdot ${p.w}=0$`, r`$${p.v}=0$`, r`$${p.l}=0$`], false)]],
    ],
    dist: p => [[r`Con $\begin{pmatrix}2&1\\1&2\end{pmatrix}$, $(1,1)\perp(1,-1)$; luego siempre.`, 'un ejemplo no prueba el caso general'], [r`Para toda matriz, los vectores propios de valores distintos son ortogonales.`, 'solo para simétricas: $\\begin{pmatrix}1&1\\\\0&2\\end{pmatrix}$ no lo cumple']],
    err: p => [['L2', r`$(${p.a}${p.v})^T${p.w}=${p.a}^T${p.v}^T${p.w}$.`, 'error-de-calculo', 'La transpuesta invierte el orden: $v^TA^T$.'], ['L5', r`Como $${p.l}-${p.m}\neq0$, $${p.l}=${p.m}$.`, 'conclusion-invalida', 'Se concluye que el **producto punto** es cero.']],
    valida: [['transpuesta', r`Calcular $(Av)\cdot w$ de dos maneras usando $A^T=A$`, 'Es la prueba estándar.']],
    idea: p => r`$(${p.a}${p.v})\cdot ${p.w}=${p.v}\cdot(${p.a}${p.w})$ para $${p.a}$ simétrica.`, primero: p => r`calcula $(${p.a}${p.v})\cdot ${p.w}$ usando $${p.a}${p.v}=${p.l}${p.v}$.`,
  });

  dem2({
    id: 'dem.espectral-2x2', teorema: 't.espectral-2x2', nivel: '7.4', habilidades: ['7.4.simetricas', '7.4.demostrar'], requiere: ['t.simetrica-propios-ortogonales', 't.cuadratica-formula', 't.polinomio-caracteristico-2x2'], refsExtra: ['d.simetrica', 'd.discriminante', 'd.propio'],
    param: rng => ({ a: rng.pick(['a', 'p']), b: rng.pick(['b', 'q']), d: rng.pick(['d', 's']), l: rng.pick(['λ', 'μ']) }),
    enunciado: p => r`Sea $A=\begin{pmatrix}${p.a}&${p.b}\\${p.b}&${p.d}\end{pmatrix}$ real con $${p.b}\neq0$. Demuestra que sus valores propios son reales y distintos, y que sus vectores propios son ortogonales.`,
    hip: p => [r`$${p.a},${p.b},${p.d}\in\mathbb{R}$, $${p.b}\neq0$`, 'Puedes citar el polinomio característico $2\\times2$, la fórmula cuadrática y los propios de simétricas'], meta: p => r`valores propios reales, distintos y vectores propios ortogonales`,
    L: p => [
      ['L1', r`Por el polinomio característico, los valores propios son las raíces de $${p.l}^2-(${p.a}+${p.d})${p.l}+(${p.a}${p.d}-${p.b}^2)$.`, 't.polinomio-caracteristico-2x2'],
      ['L2', r`Su discriminante es $\Delta=(${p.a}+${p.d})^2-4(${p.a}${p.d}-${p.b}^2)=(${p.a}-${p.d})^2+4${p.b}^2$.`, 'd.discriminante', ['L1']],
      ['L3', r`Como $${p.b}\neq0$, $4${p.b}^2>0$ y por tanto $\Delta>0$ (suma de un cuadrado y un número positivo).`, 'd.discriminante', ['L2']],
      ['L4', r`Por la fórmula cuadrática, con $\Delta>0$ hay dos raíces reales ⟦h1⟧.`, 't.cuadratica-formula', ['L3'], [H('h1', 'distintas', ['distintas', 'iguales', 'complejas'], false)]],
      ['L5', r`$A$ es simétrica y tiene dos valores propios distintos: por el teorema de propios de simétricas, sus vectores propios son ortogonales. ∎`, 't.simetrica-propios-ortogonales', ['L4']],
    ],
    dist: p => [[r`Con $\begin{pmatrix}2&1\\1&2\end{pmatrix}$ los valores propios son $1,3$; luego siempre.`, 'un ejemplo no prueba el caso general'], [r`Todas las matrices reales tienen valores propios reales.`, 'falso: un giro de $90^\\circ$ no tiene valores propios reales']],
    err: p => [['L2', r`Su discriminante es $\Delta=(${p.a}+${p.d})^2-4(${p.a}${p.d}-${p.b}^2)=(${p.a}-${p.d})^2-4${p.b}^2$.`, 'error-de-calculo', 'Queda $+4b^2$: el signo de $-bc$ al ser $c=b$ es $+b^2$.'], ['L3', r`Como $${p.b}\neq0$, $4${p.b}^2>0$ y por tanto $\Delta<0$.`, 'conclusion-invalida', 'Suma positiva: $\\Delta>0$.']],
    valida: [['discriminante', r`Probar $\Delta=(a-d)^2+4b^2>0$ y aplicar propios de simétricas`, 'Es la prueba estándar.']],
    idea: p => r`$\Delta=(${p.a}-${p.d})^2+4${p.b}^2>0$ garantiza raíces reales distintas.`, primero: p => r`calcula el discriminante del polinomio característico.`,
  });

  dem2({
    id: 'dem.markov-estocastica', teorema: 't.markov-estocastica', nivel: '7.4', habilidades: ['7.4.estocasticas', '7.4.estacionario', '7.4.demostrar'], requiere: ['t.invertible-equivalencias', 't.ops-elementales'], refsExtra: ['d.estocastica', 'd.propio', 'd.escalonada'],
    param: rng => ({ p: rng.pick(['P', 'Q']), n: rng.pick(['n', 'm']), f: rng.pick(['F', 'R']) }),
    enunciado: p => r`Sea $${p.p}$ una matriz $${p.n}\times ${p.n}$ estocástica por columnas. Demuestra que $1$ es valor propio de $${p.p}$.`,
    hip: p => [r`las columnas de $${p.p}$ suman $1$`, 'Puedes citar el criterio de invertibilidad y las operaciones elementales'], meta: p => r`$1$ es valor propio de $${p.p}$`,
    L: p => [
      ['L1', r`Consideramos $${p.p}-I$: cada columna suma $1-1=0$ (la entrada diagonal pierde un $1$).`, 'd.estocastica'],
      ['L2', r`Sumando todas las filas de $${p.p}-I$ se obtiene la fila ⟦h1⟧.`, 'd.escalonada', ['L1'], [H('h1', r`cero $(0,\dots,0)$`, [r`cero $(0,\dots,0)$`, r`$(1,\dots,1)$`, r`$(${p.n},\dots,${p.n})$`], false)]],
      ['L3', r`Entonces, con operaciones elementales (sumar todas las filas a la última), la forma escalonada de $${p.p}-I$ tiene una fila de ceros: su rango es menor que $${p.n}$.`, 't.ops-elementales', ['L2']],
      ['L4', r`Por el criterio de invertibilidad, $${p.p}-I$ no es invertible (rango $<${p.n}$).`, 't.invertible-equivalencias', ['L3']],
      ['L5', r`Existe entonces $v\neq0$ con $(${p.p}-I)v=0$, es decir $${p.p}v=1\cdot v$: $1$ es valor propio. ∎`, 'd.propio', ['L4']],
    ],
    dist: p => [[r`Con $\begin{pmatrix}0.5&0.2\\0.5&0.8\end{pmatrix}$ el valor propio $1$ aparece; luego siempre.`, 'un ejemplo no prueba el caso general'], [r`Las filas de $${p.p}$ suman $1$, así que $1$ es valor propio.`, 'son las **columnas** las que suman $1$']],
    err: p => [['L1', r`Consideramos $${p.p}-I$: cada columna suma $1+1=2$.`, 'error-de-calculo', 'La diagonal pierde un $1$: la columna suma $0$.'], ['L4', r`Por el criterio de invertibilidad, $${p.p}-I$ es invertible (rango $<${p.n}$).`, 'conclusion-invalida', 'Con rango menor que $n$ **no** es invertible.']],
    valida: [['filas', r`Mostrar que las filas de $P-I$ suman cero y deducir que es singular`, 'Es la prueba estándar.']],
    idea: p => r`las columnas de $${p.p}-I$ suman cero, luego sus filas son dependientes.`, primero: p => r`suma todas las filas de $${p.p}-I$.`,
  });

  dem2({
    id: 'dem.markov-conserva', teorema: 't.markov-conserva', nivel: '7.4', habilidades: ['7.4.markov-paso', '7.4.estocasticas', '7.4.demostrar'], requiere: ['t.mat-producto-asoc'], refsExtra: ['d.estocastica', 'd.matriz-producto', 'b.suma-finita'],
    param: rng => ({ p: rng.pick(['P', 'Q']), x: rng.pick(['x', 'π']), j: rng.pick(['j', 'k']) }),
    enunciado: p => r`Sea $${p.p}$ estocástica por columnas y $${p.x}$ un vector de probabilidad (entradas $\ge0$ con suma $1$). Demuestra que $${p.p}${p.x}$ es un vector de probabilidad.`,
    hip: p => [r`$p_{ij}\ge0$, $\sum_ip_{ij}=1$, $${p.x}_${p.j}\ge0$, $\sum_${p.j}${p.x}_${p.j}=1$`, 'Puedes usar la definición del producto y reordenar sumas finitas'], meta: p => r`$${p.p}${p.x}\ge0$ y $\sum_i(${p.p}${p.x})_i=1$`,
    L: p => [
      ['L1', r`Entradas no negativas: $(${p.p}${p.x})_i=\sum_${p.j}p_{i${p.j}}${p.x}_${p.j}$ es suma de productos de números $\ge0$, luego es $\ge0$.`, 'd.matriz-producto'],
      ['L2', r`Suma de las entradas: $\sum_i(${p.p}${p.x})_i=\sum_i\sum_${p.j}p_{i${p.j}}${p.x}_${p.j}$.`, 'd.matriz-producto', ['L1']],
      ['L3', r`Intercambiando el orden de las sumas finitas, $=\sum_${p.j}${p.x}_${p.j}\left(\sum_ip_{i${p.j}}\right)$.`, 'b.suma-finita', ['L2']],
      ['L4', r`Como cada columna suma $1$, el paréntesis vale ⟦h1⟧, y queda $\sum_${p.j}${p.x}_${p.j}=1$. ∎`, 'd.estocastica', ['L3'], [H('h1', r`$1$`, [r`$1$`, r`$0$`, r`$${p.x}_${p.j}$`], false)]],
    ],
    dist: p => [[r`Con $P=I$ se conserva la suma; luego siempre.`, 'un ejemplo no prueba el caso general'], [r`Como $${p.p}$ conserva sumas por ser lineal, $${p.p}${p.x}$ suma $1$.`, 'la linealidad no basta: hace falta que las columnas sumen $1$']],
    err: p => [['L1', r`Entradas no negativas: $(${p.p}${p.x})_i=\sum_${p.j}p_{i${p.j}}-${p.x}_${p.j}$.`, 'error-de-calculo', 'Es un producto: $p_{ij}x_j$.'], ['L3', r`Intercambiando el orden de las sumas, $=\sum_${p.j}${p.x}_${p.j}\left(\sum_jp_{ij}\right)$.`, 'error-de-calculo', 'Se suma sobre $i$ (filas) para tener una columna.']],
    valida: [['sumas', r`Reordenar la suma doble y usar que las columnas suman $1$`, 'Es la prueba estándar.']],
    idea: p => r`la suma de $${p.p}${p.x}$ es $\sum_${p.j}${p.x}_${p.j}\cdot(\text{suma de la columna }${p.j})=1$.`, primero: p => r`escribe $(${p.p}${p.x})_i$ con la definición del producto.`,
  });

  R.nivel({
    id: '7.4', mundo: 7, titulo: 'Simétricas y cadenas de Markov', tema: 'Teorema espectral (2×2) y cadenas de Markov',
    habilidades: ['7.4.simetricas', '7.4.markov-paso', '7.4.estacionario', '7.4.estocasticas', '7.4.demostrar'],
    teoremas: ['t.simetrica-propios-ortogonales', 't.espectral-2x2', 't.markov-estocastica', 't.markov-conserva'],
    leccion: {
      intro: 'Las matrices **simétricas** ($A=A^T$) son las mejores portadas: sus valores propios son reales y sus vectores propios de valores distintos son ortogonales. Las **estocásticas** modelan procesos que saltan entre estados con probabilidades.',
      definiciones: [
        { nombre: 'Simétricas', tex: 'Si $A=A^T$, vectores propios de valores propios distintos son ortogonales; en $2\\times2$ los valores propios de $\\begin{pmatrix}a&b\\\\b&d\\end{pmatrix}$ son reales ($\\Delta=(a-d)^2+4b^2\\ge0$). Existe una base ortogonal de vectores propios.' },
        { nombre: 'Markov', tex: 'Una matriz $P$ **estocástica por columnas** tiene entradas $\\ge0$ y cada columna suma $1$. Si $x_k$ es la distribución en el paso $k$, $x_{k+1}=Px_k$ y $x_k=P^kx_0$. La suma $1$ se conserva.' },
        { nombre: 'Estacionaria', tex: 'Una distribución $\\pi$ con $P\\pi=\\pi$ y suma $1$ es **estacionaria**: es un vector propio de valor propio $1$ (siempre existe). Para $P=\\begin{pmatrix}1-a&b\\\\a&1-b\\end{pmatrix}$, $\\pi=\\frac{(b,a)}{a+b}$.' },
        { nombre: 'Otros valores propios', tex: 'Para esa $P$ de $2\\times2$ los valores propios son $1$ y $1-a-b$ (la traza es $2-a-b$).' },
      ],
      teorema: 't.markov-estocastica',
      ejemplo: { enunciado: 'Con $P=\\begin{pmatrix}0.8&0.4\\\\0.2&0.6\\end{pmatrix}$, halla la distribución estacionaria.', pasos: ['Aquí $a=0{,}2$ y $b=0{,}4$.', '$\\pi=\\frac{(b,a)}{a+b}=\\frac{(0{,}4;\\ 0{,}2)}{0{,}6}$.', '$\\pi=(\\frac23,\\frac13)$.'] },
    },
  });

  if (typeof module !== 'undefined') module.exports = AC;
})(globalThis.AC = globalThis.AC || {});
