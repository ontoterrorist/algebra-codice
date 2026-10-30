/* Mundo 5, nivel 5.4 — Coordenadas y cambio de base. */
(function (AC) {
  const { R, H, T, gen, dem2 } = AC.cont, r = String.raw, M = AC.mat, Rat = AC.Rat;
  const ref = (id, tipo, nombre) => R.ref({ id, tipo, nombre });
  ref('d.coordenadas', 'definicion', 'Coordenadas de v respecto de la base B = (b₁,…,bₙ): el único (x₁,…,xₙ) con v = x₁b₁ + ⋯ + xₙbₙ');
  ref('d.matriz-cambio', 'definicion', 'Matriz de cambio de base de B a C: columnas [b₁]_C, …, [bₙ]_C');

  const HB = (id, nombre) => R.habilidad({ id: '5.4.' + id, nombre, nivel: '5.4' });
  HB('coordenadas', 'Coordenadas en una base'); HB('reconstruir', 'Reconstruir un vector'); HB('cambio', 'Matriz de cambio de base'); HB('polinomios', 'Coordenadas en polinomios'); HB('demostrar', 'Demostrar con coordenadas');
  const TE = (id, titulo, enunciado, requiere, hab) => R.teorema({ id, titulo, nivel: '5.4', enunciado, requiere, habilidades: hab });
  TE('t.coordenadas-unicas', 'Unicidad de coordenadas', r`Si $B=(b_1,\dots,b_n)$ es base, cada $v$ se escribe de una única manera como $v=x_1b_1+\cdots+x_nb_n$.`, ['t.dependencia-combinacion'], ['5.4.coordenadas', '5.4.reconstruir', '5.4.demostrar']);
  TE('t.coordenadas-lineales', 'Las coordenadas son lineales', r`$[u+v]_B=[u]_B+[v]_B$ y $[cv]_B=c[v]_B$.`, ['t.coordenadas-unicas'], ['5.4.coordenadas', '5.4.polinomios', '5.4.demostrar']);
  TE('t.matriz-cambio-base', 'Matriz de cambio de base', r`Si $P$ tiene por columnas $[b_j]_C$, entonces $[v]_C=P[v]_B$ para todo $v$.`, ['t.coordenadas-lineales'], ['5.4.cambio', '5.4.demostrar']);
  TE('t.cambio-base-inversa', 'Inversa del cambio de base', r`$P_{B\to C}$ es invertible y su inversa es $P_{C\to B}$.`, ['t.matriz-cambio-base', 't.mat-inversa-unica'], ['5.4.cambio', '5.4.demostrar']);

  const F = M.fmt, tx = A => M.tex(A);
  const rv = (rng, n, lo, hi) => Array.from({ length: n }, () => Rat.of(rng.int(lo, hi)));
  const basesInt = (rng, n, lo, hi, maxdet) => { for (let k = 0; k < 80; k++) { const b = Array.from({ length: n }, () => rv(rng, n, lo, hi)), d = M.det(b); if (!d.isZero() && Math.abs(Number(d.n)) <= maxdet && d.isInt()) return b; } return null; };
  const vt = v => '(' + v.join(',') + ')', lis = bs => bs.map(vt).join(', ');
  const poly = (c, v) => P().tex(c, v);
  const P = () => AC.poly;
  const pol = c => AC.poly.tex(AC.poly.de(c), 'x');

  /* ---------- generadores ---------- */
  gen.tupla({
    id: 'w5.n4.coordenadas', nivel: '5.4', habilidades: ['5.4.coordenadas'], dificultad: 2,
    hacer(rng) {
      const n = rng.int(2, 3), B = basesInt(rng, n, -2, 3, 4); if (!B) return null; const x = rv(rng, n, -3, 4), v = M.combina(x, B), nom = ['x₁', 'x₂', 'x₃'].slice(0, n);
      return { key: lis(B) + v.join(), enun: 'Sea $B=\\{' + B.map(vt).map(s => s.replace(/,/g, ',')).join(',\\ ') + '\\}$ una base de $\\mathbb{R}^' + n + '$. Halla las coordenadas de $v=' + vt(v) + '$ respecto de $B$, es decir, $[v]_B=(' + nom.map(q => q.replace('₁', '_1').replace('₂', '_2').replace('₃', '_3')).join(',') + ')$.', campos: nom, res: x.map(String),
        firmas: [['coordenadas-canonicas', v.map(String), 'Esas son las coordenadas respecto de la base canónica; aquí se piden las de $B$.'], ['orden', x.slice().reverse().map(String), 'El orden de las coordenadas sigue el orden de la base.']].filter(f => f[1].join() !== x.join()),
        pistas: ['Orientación: busca $x_i$ con $x_1b_1+\\cdots+x_nb_n=v$.', 'Idea clave: es un sistema lineal cuya matriz tiene los $b_i$ por columnas.', 'Primer paso: plantea el sistema coordenada a coordenada.'], expl: '$[v]_B=(' + x.join(',') + ')$.' };
    },
  });

  gen.tupla({
    id: 'w5.n4.reconstruir-vector', nivel: '5.4', habilidades: ['5.4.reconstruir'], dificultad: 2,
    hacer(rng) {
      const n = rng.int(2, 3), B = basesInt(rng, n, -2, 3, 4); if (!B) return null; const x = rv(rng, n, -3, 4), v = M.combina(x, B), nom = ['v₁', 'v₂', 'v₃'].slice(0, n);
      return { key: lis(B) + x.join(), enun: 'En la base $B=\\{' + B.map(vt).join(',\\ ') + '\\}$ de $\\mathbb{R}^' + n + '$, un vector tiene coordenadas $[v]_B=' + vt(x) + '$. ¿Cuál es $v$ en la base canónica?', campos: nom, res: v.map(String),
        firmas: [['coordenadas-sin-multiplicar', x.map(String), 'Esas son las coordenadas en $B$: hay que combinar los vectores de la base con ellas.'], ['transpuesta', M.aVec(M.mul(M.T(B.map(f => f.slice())), M.colVec(x))).map(String).map((_, i) => String(M.aVec(M.mul(B, M.colVec(x)))[i])), 'Cada $x_i$ multiplica al **vector** $b_i$ completo (una fila de la lista de la base), no a una coordenada.']].filter(f => f[1].join() !== v.join()),
        pistas: ['Orientación: $v=x_1b_1+\\cdots+x_nb_n$.', 'Idea clave: cada coordenada de $v$ es una combinación de las coordenadas de los $b_i$.', 'Primer paso: calcula $x_1b_1$.'], expl: '$v=' + vt(v) + '$.' };
    },
  });

  gen.tupla({
    id: 'w5.n4.polinomio-taylor', nivel: '5.4', habilidades: ['5.4.polinomios', '5.4.coordenadas'], dificultad: 3,
    hacer(rng) {
      const a = rng.int(-3, 3), c = [rng.int(-4, 5), rng.int(-4, 5), rng.int(1, 3)], p = AC.poly.de(c), d0 = AC.poly.evalua(p, Rat.of(a)), d1 = AC.poly.evalua(AC.poly.deriv(p), Rat.of(a)), d2 = AC.poly.evalua(AC.poly.deriv(AC.poly.deriv(p)), Rat.of(a)).div(Rat.of(2));
      const base = '\\{1,\\ (x' + (a < 0 ? '+' : '-') + Math.abs(a) + '),\\ (x' + (a < 0 ? '+' : '-') + Math.abs(a) + ')^2\\}'; if (a === 0) return null;
      return { key: c.join() + a, enun: 'En el espacio de polinomios de grado $\\le2$, halla las coordenadas de $p(x)=' + pol(c) + '$ respecto de la base $B=' + base + '$.', campos: ['a₀', 'a₁', 'a₂'], res: [d0, d1, d2].map(String),
        firmas: [['canonicas', c.map(String), 'Esas son las coordenadas en $\\{1,x,x^2\\}$; aquí la base está centrada en $' + a + '$.'], ['orden', [d2, d1, d0].map(String), 'El orden sigue el de la base: $1$, $(x-a)$, $(x-a)^2$.']].filter(f => f[1].join() !== [d0, d1, d2].map(String).join()),
        pistas: ['Orientación: escribe $p(x)=a_0+a_1(x-' + a + ')+a_2(x-' + a + ')^2$.', 'Idea clave: $a_0=p(' + a + ')$, $a_1=p\'(' + a + ')$, $a_2=p\'\'(' + a + ')/2$ (desarrollo de Taylor).', 'Primer paso: evalúa $p(' + a + ')$.'], expl: '$[p]_B=(' + [d0, d1, d2].join(',') + ')$.' };
    },
  });

  gen.matriz({
    id: 'w5.n4.matriz-cambio', nivel: '5.4', habilidades: ['5.4.cambio'], dificultad: 3,
    hacer(rng) {
      const B = basesInt(rng, 2, -2, 3, 4), C = basesInt(rng, 2, -2, 3, 4); if (!B || !C) return null; const Pbc = M.cambioBase(B, C), Pcb = M.cambioBase(C, B);
      if (Pbc.some(f => f.some(x => x.d > 4n))) return null;
      return { key: lis(B) + lis(C), enun: 'Sean $B=\\{' + B.map(vt).join(',\\ ') + '\\}$ y $C=\\{' + C.map(vt).join(',\\ ') + '\\}$ bases de $\\mathbb{R}^2$. Halla la matriz de cambio de base $P_{B\\to C}$ (de modo que $[v]_C=P[v]_B$).', res: F(Pbc), etiqueta: 'P',
        firmas: [['inversa', F(Pcb), 'Esa es $P_{C\\to B}$: la matriz que cambia de $C$ a $B$. Aquí se pide $P_{B\\to C}$.'], ['transpuesta', F(M.T(Pbc)), 'Las **columnas** de $P$ son las coordenadas $[b_j]_C$ (no las filas).']].filter(f => JSON.stringify(f[1]) !== JSON.stringify(F(Pbc))),
        pistas: ['Orientación: las columnas de $P_{B\\to C}$ son $[b_1]_C$ y $[b_2]_C$.', 'Idea clave: calcula las coordenadas de cada vector de $B$ respecto de $C$.', 'Primer paso: resuelve $x\\,c_1+y\\,c_2=b_1$.'], expl: '$P_{B\\to C}=' + tx(Pbc) + '$.' };
    },
  });

  gen.tupla({
    id: 'w5.n4.cambio-coordenadas', nivel: '5.4', habilidades: ['5.4.cambio', '5.4.coordenadas'], dificultad: 4,
    hacer(rng) {
      const B = basesInt(rng, 2, -2, 3, 3), C = basesInt(rng, 2, -2, 3, 3); if (!B || !C) return null; const xb = rv(rng, 2, -3, 4), v = M.combina(xb, B), xc = M.coordenadas(C, v); if (xc.some(x => x.d > 1n)) return null;
      return { key: lis(B) + lis(C) + xb.join(), enun: 'Sean $B=\\{' + B.map(vt).join(',\\ ') + '\\}$ y $C=\\{' + C.map(vt).join(',\\ ') + '\\}$ bases de $\\mathbb{R}^2$ y $[v]_B=' + vt(xb) + '$. Halla $[v]_C$.', campos: ['y₁', 'y₂'], res: xc.map(String),
        firmas: [['sin-cambiar', xb.map(String), 'Esas son las coordenadas respecto de $B$; hay que reexpresar $v$ en la base $C$.'], ['canonicas', v.map(String), 'Esas son las coordenadas canónicas de $v$, no las de $C$.']].filter(f => f[1].join() !== xc.map(String).join()),
        pistas: ['Orientación: pasa por el vector $v$ o usa la matriz de cambio $P_{B\\to C}$.', 'Idea clave: $[v]_C=P_{B\\to C}[v]_B$.', 'Primer paso: calcula $v=x_1b_1+x_2b_2$ en la base canónica.'], expl: '$[v]_C=(' + xc.join(',') + ')$.' };
    },
  });

  gen.matriz({
    id: 'w5.n4.inversa-cambio', nivel: '5.4', habilidades: ['5.4.cambio'], dificultad: 3,
    hacer(rng) {
      const B = basesInt(rng, 2, -2, 3, 3), C = basesInt(rng, 2, -2, 3, 3); if (!B || !C) return null; const Pbc = M.cambioBase(B, C), Pcb = M.cambioBase(C, B); if (Pbc.some(f => f.some(x => !x.isInt()))) return null;
      return { key: tx(Pbc) + lis(C), enun: 'Se sabe que $P_{B\\to C}=' + tx(Pbc) + '$. Sin conocer las bases, halla $P_{C\\to B}$.', res: F(Pcb), etiqueta: 'P',
        firmas: [['misma', F(Pbc), 'Esa es $P_{B\\to C}$: se pide la matriz del cambio en sentido contrario, que es su inversa.'], ['transpuesta', F(M.T(Pbc)), 'La inversa no es la transpuesta; calcula $P^{-1}$ con la fórmula de $2\\times2$.']].filter(f => JSON.stringify(f[1]) !== JSON.stringify(F(Pcb))),
        pistas: ['Orientación: $P_{C\\to B}=(P_{B\\to C})^{-1}$.', 'Idea clave: para $2\\times2$, $\\frac{1}{ad-bc}\\begin{pmatrix}d&-b\\\\-c&a\\end{pmatrix}$.', 'Primer paso: calcula el determinante de la matriz dada.'], expl: '$P_{C\\to B}=' + tx(Pcb) + '$.' };
    },
  });

  /* ---------- demostraciones ---------- */
  dem2({
    id: 'dem.coordenadas-unicas', teorema: 't.coordenadas-unicas', nivel: '5.4', habilidades: ['5.4.coordenadas', '5.4.reconstruir', '5.4.demostrar'], requiere: ['t.dependencia-combinacion'], refsExtra: ['d.base', 'd.independencia', 'd.coordenadas'],
    param: rng => ({ b: rng.pick(['b', 'e']), x: rng.pick(['x', 'a']), y: rng.pick(['y', 'c']), v: rng.pick(['v', 'w']) }),
    enunciado: p => r`Sea $B=(${p.b}_1,\dots,${p.b}_n)$ una base de $V$. Demuestra que todo $${p.v}\in V$ se escribe de **una única manera** como $${p.v}=\sum ${p.x}_i${p.b}_i$.`,
    hip: p => [r`$B$ es una base: independiente y generadora`, 'Basta la definición de independencia'], meta: p => r`existe y es única la combinación lineal`,
    L: p => [
      ['L1', r`Existencia: como $B$ genera $V$, $${p.v}$ es combinación lineal de los $${p.b}_i$.`, 'd.base'],
      ['L2', r`Unicidad: supongamos $${p.v}=\sum ${p.x}_i${p.b}_i=\sum ${p.y}_i${p.b}_i$.`, 'd.coordenadas', ['L1']],
      ['L3', r`Restando, $\sum(${p.x}_i-${p.y}_i)${p.b}_i=0$ por distributividad.`, 'd.combinacion-lineal', ['L2']],
      ['L4', r`Como $B$ es ⟦h1⟧, todos los coeficientes son cero: $${p.x}_i-${p.y}_i=0$ para todo $i$.`, 'd.independencia', ['L3'], [H('h1', 'independiente', ['independiente', 'generadora', 'finita'], false)]],
      ['L5', r`Luego $${p.x}_i=${p.y}_i$ para todo $i$: la combinación es única. ∎`, 'd.coordenadas', ['L4']],
    ],
    dist: p => [[r`En $\mathbb{R}^2$ con la base canónica las coordenadas son únicas; luego siempre.`, 'un ejemplo no prueba el caso general'], [r`Como $B$ genera $V$, las coordenadas son únicas.`, 'generar da existencia; la unicidad usa la independencia']],
    err: p => [['L3', r`Sumando, $\sum(${p.x}_i+${p.y}_i)${p.b}_i=0$.`, 'error-de-calculo', 'Hay que **restar** las dos expresiones de $v$.'], ['L4', r`Como $B$ es generadora, todos los coeficientes son cero.`, 'conclusion-invalida', 'La independencia es la que anula los coeficientes.']],
    valida: [['restar', r`Restar dos expresiones de $v$ y usar la independencia`, 'Es la prueba estándar.']],
    idea: p => r`si hubiera dos expresiones, su diferencia sería una combinación nula.`, primero: p => r`supón dos expresiones de $${p.v}$.`,
  });

  dem2({
    id: 'dem.coordenadas-lineales', teorema: 't.coordenadas-lineales', nivel: '5.4', habilidades: ['5.4.coordenadas', '5.4.polinomios', '5.4.demostrar'], requiere: ['t.coordenadas-unicas'], refsExtra: ['d.coordenadas', 'b.cuerpo-algebra'],
    param: rng => ({ u: rng.pick(['u', 'x']), v: rng.pick(['v', 'y']), c: rng.pick(['c', 'λ']), b: rng.pick(['b', 'e']) }),
    enunciado: p => r`Sea $B=(${p.b}_1,\dots,${p.b}_n)$ una base. Demuestra que $[${p.u}+${p.v}]_B=[${p.u}]_B+[${p.v}]_B$ y $[${p.c}${p.v}]_B=${p.c}[${p.v}]_B$.`,
    hip: p => [r`$B$ es base y $[${p.u}]_B=(a_i)$, $[${p.v}]_B=(a_i')$`, 'Puedes citar la unicidad de coordenadas'], meta: p => r`las coordenadas respetan suma y escalares`,
    L: p => [
      ['L1', r`Sean $${p.u}=\sum a_i${p.b}_i$ y $${p.v}=\sum a_i'${p.b}_i$ las expresiones (únicas) de $${p.u}$ y $${p.v}$.`, 'd.coordenadas'],
      ['L2', r`Entonces $${p.u}+${p.v}=\sum(a_i+a_i')${p.b}_i$ por distributividad.`, 'b.cuerpo-algebra', ['L1']],
      ['L3', r`Esa es una expresión de $${p.u}+${p.v}$ como combinación de la base; por la ⟦h1⟧ de coordenadas es **la** expresión, así que $[${p.u}+${p.v}]_B=(a_i+a_i')=[${p.u}]_B+[${p.v}]_B$.`, 't.coordenadas-unicas', ['L2'], [H('h1', 'unicidad', ['unicidad', 'existencia', 'conmutatividad'], false)]],
      ['L4', r`Igualmente $${p.c}${p.v}=\sum(${p.c}a_i')${p.b}_i$ es la expresión de $${p.c}${p.v}$, luego $[${p.c}${p.v}]_B=${p.c}[${p.v}]_B$. ∎`, 't.coordenadas-unicas', ['L1']],
    ],
    dist: p => [[r`Con la base canónica de $\mathbb{R}^2$ se comprueba; luego siempre.`, 'un ejemplo no prueba el caso general'], [r`Como $[\cdot]_B$ es una función, conserva todas las operaciones.`, 'no toda función conserva las operaciones: hay que probarlo']],
    err: p => [['L2', r`Entonces $${p.u}+${p.v}=\sum a_ia_i'${p.b}_i$.`, 'error-de-calculo', "Se suman los coeficientes de cada vector de la base."], ['L4', r`Igualmente $${p.c}${p.v}=\sum(${p.c}+a_i')${p.b}_i$.`, 'error-de-calculo', 'El escalar multiplica cada coeficiente.']],
    valida: [['unicidad', r`Escribir $u+v$ y $cv$ con la base y usar la unicidad`, 'Es la prueba estándar.']],
    idea: p => r`la suma de las expresiones es una expresión de la suma, y la unicidad la identifica.`, primero: p => r`escribe $${p.u}$ y $${p.v}$ en la base.`,
  });

  dem2({
    id: 'dem.matriz-cambio-base', teorema: 't.matriz-cambio-base', nivel: '5.4', habilidades: ['5.4.cambio', '5.4.demostrar'], requiere: ['t.coordenadas-lineales'], refsExtra: ['d.matriz-cambio', 'd.coordenadas', 'd.matriz-producto'],
    param: rng => ({ v: rng.pick(['v', 'u']), b: rng.pick(['b', 'e']), p: rng.pick(['P', 'Q']) }),
    enunciado: p => r`Sean $B=(${p.b}_1,\dots,${p.b}_n)$ y $C$ bases de $V$ y $${p.p}$ la matriz con columnas $[${p.b}_j]_C$. Demuestra que $[${p.v}]_C=${p.p}[${p.v}]_B$ para todo $${p.v}\in V$.`,
    hip: p => [r`$${p.p}=([${p.b}_1]_C\ \cdots\ [${p.b}_n]_C)$`, 'Puedes citar que las coordenadas son lineales'], meta: p => r`$[${p.v}]_C=${p.p}[${p.v}]_B$`,
    L: p => [
      ['L1', r`Sea $[${p.v}]_B=(x_1,\dots,x_n)$, es decir, $${p.v}=\sum x_j${p.b}_j$.`, 'd.coordenadas'],
      ['L2', r`Por la linealidad de las coordenadas, $[${p.v}]_C=\sum x_j[${p.b}_j]_C$.`, 't.coordenadas-lineales', ['L1']],
      ['L3', r`El miembro derecho es la combinación lineal de las columnas de $${p.p}$ con coeficientes $x_j$, que es ⟦h1⟧.`, 'd.matriz-producto', ['L2'], [H('h1', r`$${p.p}x$ con $x=[${p.v}]_B$`, [r`$${p.p}x$ con $x=[${p.v}]_B$`, r`$x^T${p.p}$`, r`$${p.p}+x$`], false)]],
      ['L4', r`Luego $[${p.v}]_C=${p.p}[${p.v}]_B$. ∎`, 'd.matriz-cambio', ['L3']],
    ],
    dist: p => [[r`Con $V=\mathbb{R}^2$ y bases concretas se verifica; luego siempre.`, 'un ejemplo no prueba el caso general'], [r`Como $${p.p}$ tiene las coordenadas de los $${p.b}_j$, es la identidad.`, 'es la identidad solo si $B=C$']],
    err: p => [['L2', r`Por la linealidad, $[${p.v}]_C=\sum x_j[${p.b}_j]_B$.`, 'error-de-calculo', 'Hay que usar las coordenadas respecto de $C$.'], ['L3', r`El miembro derecho es la combinación lineal de las **filas** de $${p.p}$ con coeficientes $x_j$.`, 'error-de-calculo', 'Son las **columnas**: $Px=\\sum x_jP_{\\cdot j}$.']],
    valida: [['linealidad', r`Aplicar $[\cdot]_C$ a $v=\sum x_jb_j$ usando linealidad`, 'Es la prueba estándar.']],
    idea: p => r`aplica $[\cdot]_C$ a $${p.v}=\sum x_j${p.b}_j$.`, primero: p => r`escribe $${p.v}$ en la base $B$.`,
  });

  dem2({
    id: 'dem.cambio-base-inversa', teorema: 't.cambio-base-inversa', nivel: '5.4', habilidades: ['5.4.cambio', '5.4.demostrar'], requiere: ['t.matriz-cambio-base', 't.mat-inversa-unica'], refsExtra: ['d.matriz-inversa', 'd.matriz-cambio'],
    param: rng => ({ p: rng.pick(['P', 'S']), q: rng.pick(['Q', 'T']), v: rng.pick(['v', 'u']) }),
    enunciado: p => r`Sean $${p.p}=P_{B\to C}$ y $${p.q}=P_{C\to B}$. Demuestra que $${p.p}$ es invertible y $${p.p}^{-1}=${p.q}$.`,
    hip: p => [r`$B$ y $C$ son bases del mismo espacio de dimensión $n$`, 'Puedes citar la fórmula del cambio de base y la unicidad de la inversa'], meta: p => r`$${p.p}^{-1}=${p.q}$`,
    L: p => [
      ['L1', r`Para todo $${p.v}$, $[${p.v}]_C=${p.p}[${p.v}]_B$ y $[${p.v}]_B=${p.q}[${p.v}]_C$ (teorema del cambio de base).`, 't.matriz-cambio-base'],
      ['L2', r`Sustituyendo, $[${p.v}]_B=${p.q}${p.p}[${p.v}]_B$ para todo $${p.v}$.`, 't.matriz-cambio-base', ['L1']],
      ['L3', r`Como los vectores $[${p.v}]_B$ recorren **todos** los $x\in\mathbb{Q}^n$ (tomando $${p.v}=\sum x_jb_j$), $${p.q}${p.p}x=x$ para todo $x$; en particular para $x=e_j$, y por eso ⟦h1⟧.`, 'd.matriz-inversa', ['L2'], [H('h1', r`$${p.q}${p.p}=I$`, [r`$${p.q}${p.p}=I$`, r`$${p.q}${p.p}=0$`, r`$${p.q}=${p.p}$`], false)]],
      ['L4', r`Intercambiando los papeles de $B$ y $C$ se obtiene $${p.p}${p.q}=I$.`, 't.matriz-cambio-base', ['L3']],
      ['L5', r`Luego $${p.q}$ es una inversa de $${p.p}$ y, por la unicidad de la inversa, $${p.p}^{-1}=${p.q}$. ∎`, 't.mat-inversa-unica', ['L3', 'L4']],
    ],
    dist: p => [[r`Con $B=\{e_1,e_2\}$ y $C=\{e_2,e_1\}$ se cumple; luego siempre.`, 'un ejemplo no prueba el caso general'], [r`Como cambiar de base y volver es no hacer nada, $${p.q}=${p.p}$.`, 'volver deshace el cambio: es la inversa, no la misma matriz']],
    err: p => [['L2', r`Sustituyendo, $[${p.v}]_B=${p.p}${p.q}[${p.v}]_B$ para todo $${p.v}$.`, 'error-de-calculo', 'Al sustituir queda $Q\\cdot P$ (primero actúa $P$).'], ['L4', r`Intercambiando los papeles se obtiene $${p.p}${p.q}=0$.`, 'error-de-calculo', 'Se obtiene $PQ=I$.']],
    valida: [['unicidad', r`Probar $QP=I=PQ$ y usar la unicidad de la inversa`, 'Es la prueba estándar.']],
    idea: p => r`ir de $B$ a $C$ y volver deja las coordenadas igual.`, primero: p => r`encadena $[${p.v}]_C=${p.p}[${p.v}]_B$ con $[${p.v}]_B=${p.q}[${p.v}]_C$.`,
  });

  R.nivel({
    id: '5.4', mundo: 5, titulo: 'Coordenadas', tema: 'Coordenadas, polinomios y cambio de base',
    habilidades: ['5.4.coordenadas', '5.4.reconstruir', '5.4.cambio', '5.4.polinomios', '5.4.demostrar'],
    teoremas: ['t.coordenadas-unicas', 't.coordenadas-lineales', 't.matriz-cambio-base', 't.cambio-base-inversa'],
    leccion: {
      intro: 'Con una base $B=(b_1,\\dots,b_n)$ cada vector $v$ se escribe de una **única** manera $v=x_1b_1+\\cdots+x_nb_n$; el vector $[v]_B=(x_1,\\dots,x_n)$ son sus **coordenadas**. Así cualquier espacio de dimensión $n$ se comporta como $\\mathbb{R}^n$.',
      definiciones: [
        { nombre: 'Coordenadas', tex: '$[v]_B$ se halla resolviendo $x_1b_1+\\cdots+x_nb_n=v$: un sistema cuya matriz tiene los $b_i$ por columnas.' },
        { nombre: 'Linealidad', tex: '$[u+v]_B=[u]_B+[v]_B$ y $[cv]_B=c[v]_B$: calcular con vectores es calcular con sus coordenadas.' },
        { nombre: 'Cambio de base', tex: '$P_{B\\to C}$ tiene por columnas $[b_j]_C$ y cumple $[v]_C=P_{B\\to C}[v]_B$.' },
        { nombre: 'Inversa', tex: '$P_{C\\to B}=(P_{B\\to C})^{-1}$. Con polinomios: en $\\{1,x-a,(x-a)^2\\}$ las coordenadas de $p$ son $(p(a),p\'(a),p\'\'(a)/2)$.' },
      ],
      teorema: 't.matriz-cambio-base',
      ejemplo: { enunciado: 'Halla $[v]_B$ para $v=(3,1)$ y $B=\\{(1,1),(1,-1)\\}$.', pasos: ['Plantea $x(1,1)+y(1,-1)=(3,1)$: $x+y=3$, $x-y=1$.', 'Sumando, $2x=4$, $x=2$ y $y=1$.', 'Entonces $[v]_B=(2,1)$.'] },
    },
  });

  if (typeof module !== 'undefined') module.exports = AC;
})(globalThis.AC = globalThis.AC || {});
