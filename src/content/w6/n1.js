/* Mundo 6, nivel 6.1 — Transformaciones lineales. */
(function (AC) {
  const { R, H, T, gen, dem2 } = AC.cont, r = String.raw, M = AC.mat, Rat = AC.Rat;
  const ref = (id, tipo, nombre) => R.ref({ id, tipo, nombre });
  ref('d.lineal', 'definicion', 'Transformación lineal: T(u + v) = T(u) + T(v) y T(cv) = cT(v)'); ref('d.composicion-fun', 'definicion', '(S∘T)(v) = S(T(v))');

  const HB = (id, nombre) => R.habilidad({ id: '6.1.' + id, nombre, nivel: '6.1' });
  HB('reconocer', 'Reconocer transformaciones lineales'); HB('evaluar', 'Evaluar T'); HB('por-base', 'T a partir de una base'); HB('geometria', 'Rotaciones y reflexiones'); HB('demostrar', 'Demostrar con transformaciones');
  const TE = (id, titulo, enunciado, requiere, hab) => R.teorema({ id, titulo, nivel: '6.1', enunciado, requiere, habilidades: hab });
  TE('t.lineal-cero-opuesto', 'T(0) = 0', r`Si $T$ es lineal, $T(0)=0$ y $T(-v)=-T(v)$.`, [], ['6.1.reconocer', '6.1.demostrar']);
  TE('t.criterio-lineal', 'Criterio de linealidad', r`$T$ es lineal si y solo si $T(au+bv)=aT(u)+bT(v)$ para todos $u,v$ y escalares $a,b$.`, [], ['6.1.reconocer', '6.1.evaluar', '6.1.demostrar']);
  TE('t.lineal-determinada-base', 'T queda fijada por una base', r`Dada una base $(b_1,\dots,b_n)$ y vectores $w_1,\dots,w_n$ existe una única $T$ lineal con $T(b_i)=w_i$.`, ['t.coordenadas-unicas', 't.coordenadas-lineales'], ['6.1.por-base', '6.1.evaluar', '6.1.demostrar']);
  TE('t.composicion-lineal', 'La composición es lineal', r`Si $T$ y $S$ son lineales, $S\circ T$ es lineal.`, ['t.criterio-lineal'], ['6.1.evaluar', '6.1.geometria', '6.1.demostrar']);

  const F = M.fmt;
  const par = v => '(' + v.join(', ') + ')';
  const rv = (rng, n, lo, hi) => Array.from({ length: n }, () => Rat.of(rng.int(lo, hi)));
  /* fórmulas de T(x,y,z) con matriz A: texto de cada coordenada */
  const coord = (f, vars) => { let s = ''; f.forEach((c, j) => { if (c.isZero()) return; const neg = c.cmp(Rat.of(0)) < 0, a = neg ? c.neg() : c, cs = a.eq(Rat.of(1)) ? '' : M.texN(a); s += (s ? (neg ? '-' : '+') : (neg ? '-' : '')) + cs + vars[j]; }); return s || '0'; };
  const formula = (A, vars) => '(' + A.map(f => coord(f, vars)).join(',\\ ') + ')';
  const DEFS = [
    ['(x+y,\\ 2x)', true, null, 'Cada coordenada es una combinación lineal de $x$ e $y$.'], ['(2x,\\ 3y)', true, null, 'Cada coordenada es un múltiplo de una variable.'], ['(x-y,\\ 0)', true, null, 'Combinaciones lineales (la segunda es $0$).'], ['(3x+2y,\\ y)', true, null, 'Combinaciones lineales de $x$ e $y$.'], ['(y,\\ -x)', true, null, 'Es una rotación de $90^\\circ$.'],
    ['(x+1,\\ y)', false, 'cero', 'No cumple $T(0,0)=(0,0)$: da $(1,0)$.'], ['(xy,\\ x)', false, 'suma', 'No es aditiva: $T(1,1)=(1,1)\\neq T(1,0)+T(0,1)=(0,1)$.'], ['(x^2,\\ y)', false, 'escalar', 'No es homogénea: $T(2v)\\neq2T(v)$ para $v=(1,0)$.'], ['(|x|,\\ y)', false, 'escalar', 'No es homogénea: $T(-1,0)=(1,0)\\neq-T(1,0)$.'], ['(x+y+2,\\ y)', false, 'cero', 'No cumple $T(0,0)=(0,0)$.'],
  ];

  /* ---------- generadores ---------- */
  gen.multiple({
    id: 'w6.n1.cuales-lineales', nivel: '6.1', habilidades: ['6.1.reconocer'], dificultad: 2,
    hacer(rng) {
      const si = rng.sample(DEFS.filter(d => d[1]), rng.int(1, 2)), no = rng.sample(DEFS.filter(d => !d[1]), rng.int(2, 3)), ops = rng.shuffle(si.concat(no)), ok = ops.map((d, i) => (d[1] ? i : -1)).filter(i => i >= 0);
      return { key: ops.map(d => d[0]).join('|'), enun: 'Marca todas las funciones $T:\\mathbb{R}^2\\to\\mathbb{R}^2$ que son **lineales**.', opciones: ops.map(d => '$T(x,y)=' + d[0] + '$'), ok, msg: (j, es) => (es ? 'Sí es lineal: ' : 'No es lineal: ') + ops[j][3],
        pistas: ['Orientación: una transformación lineal conserva sumas y escalares, y cumple $T(0)=0$.', 'Idea clave: cada coordenada de la imagen debe ser una combinación lineal de las variables, sin constantes, productos, potencias ni valores absolutos.', 'Primer paso: calcula $T(0,0)$.'], expl: 'Son lineales: ' + si.map(d => '$' + d[0] + '$').join(', ') + '.' };
    },
  });

  gen.eleccion({
    id: 'w6.n1.que-falla', nivel: '6.1', habilidades: ['6.1.reconocer'], dificultad: 2,
    hacer(rng) {
      const d = rng.pick(DEFS.filter(x => !x[1])), nom = { cero: 'no cumple $T(0)=0$', suma: 'no es aditiva: $T(u+v)\\neq T(u)+T(v)$', escalar: 'no es homogénea: $T(cv)\\neq cT(v)$' }, ops = Object.keys(nom).filter(k => k !== d[2]);
      const n = rng.int(1, 6);
      return { key: d[0] + n, enun: 'La función $T(x,y)=' + d[0] + '$ **no** es lineal. ¿Qué falla?', ok: nom[d[2]], malas: ops.map(k => ['otra-' + k, nom[k], 'Esa propiedad sí se cumple aquí. ' + d[3]]).concat([['si', 'sí es lineal', 'Alguna propiedad falla. ' + d[3]]]),
        pistas: ['Orientación: comprueba el cero, la suma y los escalares.', 'Idea clave: busca un contraejemplo concreto para cada una.', 'Primer paso: calcula $T(0,0)$.'], expl: d[3] };
    },
  });

  gen.tupla({
    id: 'w6.n1.evaluar', nivel: '6.1', habilidades: ['6.1.evaluar'], dificultad: 2,
    hacer(rng) {
      const A = M.de(Array.from({ length: 3 }, () => rv(rng, 3, -3, 4))); if (A.every(f => f.every(x => x.isZero()))) return null; const v = rv(rng, 3, -3, 4), w = M.aVec(M.mul(A, M.colVec(v)));
      return { key: M.tex(A) + v.join(), enun: 'Sea $T(x,y,z)=' + formula(A, ['x', 'y', 'z']) + '$. Calcula $T' + par(v) + '$.', campos: ['T₁', 'T₂', 'T₃'], res: w.map(String),
        firmas: [['transpuesta', M.aVec(M.mul(M.T(A), M.colVec(v))).map(String), 'Cada coordenada de $T(v)$ usa los coeficientes de **una** fila (una por coordenada de salida).'], ['orden', w.slice().reverse().map(String), 'Mantén el orden de las coordenadas de salida.']].filter(f => f[1].join() !== w.join()),
        pistas: ['Orientación: sustituye $x,y,z$ en cada coordenada.', 'Idea clave: es el producto de la matriz de coeficientes por el vector.', 'Primer paso: calcula la primera coordenada.'], expl: '$T' + par(v) + '=' + par(w) + '$.' };
    },
  });

  gen.tupla({
    id: 'w6.n1.por-valores-base', nivel: '6.1', habilidades: ['6.1.por-base', '6.1.evaluar'], dificultad: 3,
    hacer(rng) {
      let B; for (let k = 0; k < 40 && !B; k++) { const c = [rv(rng, 2, -2, 3), rv(rng, 2, -2, 3)]; if (!M.det(c).isZero() && M.det(c).isInt()) B = c; } if (!B) return null; const W = [rv(rng, 2, -3, 4), rv(rng, 2, -3, 4)], x = rv(rng, 2, -3, 4), v = M.combina(x, B), res = M.combina(x, W);
      return { key: B.map(par).join() + W.map(par).join() + x.join(), enun: 'Sea $T:\\mathbb{R}^2\\to\\mathbb{R}^2$ lineal con $T' + par(B[0]) + '=' + par(W[0]) + '$ y $T' + par(B[1]) + '=' + par(W[1]) + '$. Calcula $T' + par(v) + '$.', campos: ['T₁', 'T₂'], res: res.map(String),
        firmas: [['sin-coordenadas', M.combina(v, W).map(String), 'Hay que escribir primero $v$ como combinación de la base y luego aplicar $T$ a cada término.'], ['orden', res.slice().reverse().map(String), 'Mantén el orden de las coordenadas.']].filter(f => f[1].join() !== res.map(String).join()),
        pistas: ['Orientación: escribe $v=x_1b_1+x_2b_2$.', 'Idea clave: $T(v)=x_1T(b_1)+x_2T(b_2)$ por linealidad.', 'Primer paso: resuelve $x_1b_1+x_2b_2=v$.'], expl: '$v=' + x[0] + 'b_1+' + x[1] + 'b_2$, luego $T(v)=' + par(res) + '$.' };
    },
  });

  gen.tupla({
    id: 'w6.n1.composicion', nivel: '6.1', habilidades: ['6.1.evaluar', '6.1.geometria'], dificultad: 3,
    hacer(rng) {
      const A = M.de(Array.from({ length: 2 }, () => rv(rng, 2, -3, 3))), B = M.de(Array.from({ length: 2 }, () => rv(rng, 2, -3, 3))), v = rv(rng, 2, -3, 4), w = M.aVec(M.mul(B, M.mul(A, M.colVec(v)))); if (M.det(A).isZero() || M.det(B).isZero()) return null;
      return { key: M.tex(A) + M.tex(B) + v.join(), enun: 'Sean $T(x,y)=' + formula(A, ['x', 'y']) + '$ y $S(x,y)=' + formula(B, ['x', 'y']) + '$. Calcula $(S\\circ T)' + par(v) + '$.', campos: ['x', 'y'], res: w.map(String),
        firmas: [['orden-inverso', M.aVec(M.mul(A, M.mul(B, M.colVec(v)))).map(String), 'En $S\\circ T$ se aplica **primero** $T$ y luego $S$.']].filter(f => f[1].join() !== w.map(String).join()),
        pistas: ['Orientación: aplica primero $T$ a $v$.', 'Idea clave: $(S\\circ T)(v)=S(T(v))$.', 'Primer paso: calcula $T' + par(v) + '$.'], expl: '$T(v)=' + par(M.aVec(M.mul(A, M.colVec(v)))) + '$ y $S(T(v))=' + par(w) + '$.' };
    },
  });

  gen.entero({
    id: 'w6.n1.parametro-lineal', nivel: '6.1', habilidades: ['6.1.reconocer'], dificultad: 3,
    hacer(rng) {
      const m = rng.int(2, 9), a = rng.pick([1, 2, 3]), b = rng.pick([-3, -2, 1, 2]);
      return { key: [m, a, b].join(), enun: 'Sea $T_k(x,y)=(' + a + 'x' + (b < 0 ? '-' : '+') + Math.abs(b) + 'y+k^2-' + m * m + ',\\ y)$. ¿Para qué valor **positivo** de $k$ es $T_k$ lineal?', res: m,
        firmas: [['cuadrado', m * m, 'Se necesita $T(0,0)=0$: $k^2-' + m * m + '=0$, así que $k$ es la raíz.'], ['negativo', -m, 'Se pide el valor positivo.']].filter(f => f[1] !== m),
        pistas: ['Orientación: una transformación lineal cumple $T(0,0)=(0,0)$.', 'Idea clave: la constante $k^2-' + m * m + '$ debe ser $0$.', 'Primer paso: calcula $T_k(0,0)$.'], expl: '$k^2=' + m * m + '$ y $k=' + m + '$.' };
    },
  });

  gen.tupla({
    id: 'w6.n1.mapa-geometrico', nivel: '6.1', habilidades: ['6.1.geometria', '6.1.evaluar'], dificultad: 2,
    hacer(rng) {
      const ops = [['gira $90^\\circ$ en sentido antihorario', v => [v[1].neg(), v[0]]], ['gira $90^\\circ$ en sentido horario', v => [v[1], v[0].neg()]], ['gira $180^\\circ$', v => [v[0].neg(), v[1].neg()]], ['se refleja en el eje $x$', v => [v[0], v[1].neg()]], ['se refleja en el eje $y$', v => [v[0].neg(), v[1]]], ['se refleja en la recta $y=x$', v => [v[1], v[0]]]];
      const [txt, f] = rng.pick(ops), v = rv(rng, 2, -5, 6); if (v[0].isZero() && v[1].isZero() || v[0].eq(v[1])) return null; const w = f(v);
      return { key: txt + v.join(), enun: 'Un personaje está en el punto $' + par(v) + '$ del mapa (con el origen en el centro). Si ' + txt + ', ¿en qué punto queda?', campos: ['x', 'y'], res: w.map(String),
        firmas: [['sin-mover', v.map(String), 'Ese es el punto original: aplica la transformación.'], ['intercambio', [v[1], v[0]].map(String), 'Cuidado con el orden y los signos de la regla geométrica.'], ['opuesto', v.map(x => x.neg().toString()), 'Eso es el giro de $180^\\circ$; revisa qué transformación se pide.']].filter(f => f[1].join() !== w.map(String).join()),
        pistas: ['Orientación: escribe la matriz de la transformación.', 'Idea clave: giro de $90^\\circ$: $(x,y)\\mapsto(-y,x)$; reflexión en el eje $x$: $(x,y)\\mapsto(x,-y)$.', 'Primer paso: recuerda cómo actúa sobre los vectores $e_1=(1,0)$ y $e_2=(0,1)$.'], expl: 'Queda en ' + par(w) + '.' };
    },
  });

  /* ---------- demostraciones ---------- */
  dem2({
    id: 'dem.lineal-cero-opuesto', teorema: 't.lineal-cero-opuesto', nivel: '6.1', habilidades: ['6.1.reconocer', '6.1.demostrar'], requiere: [], refsExtra: ['d.lineal', 'b.cuerpo-algebra', 'b.arbitrario'],
    param: rng => ({ t: rng.pick(['T', 'L']), v: rng.pick(['v', 'u']) }),
    enunciado: p => r`Demuestra que si $${p.t}$ es lineal, entonces $${p.t}(0)=0$ y $${p.t}(-${p.v})=-${p.t}(${p.v})$.`,
    hip: p => [r`$${p.t}:V\to W$ es lineal`, 'Basta usar la definición de linealidad'], meta: p => r`$${p.t}(0)=0$ y $${p.t}(-${p.v})=-${p.t}(${p.v})$`,
    L: p => [
      ['L1', r`$${p.t}(0)=${p.t}(0+0)=${p.t}(0)+${p.t}(0)$ por aditividad.`, 'd.lineal'],
      ['L2', r`Restando $${p.t}(0)$ a ambos lados, $0=${p.t}(0)$.`, 'b.cuerpo-algebra', ['L1']],
      ['L3', r`Para $${p.v}$ arbitrario, $-${p.v}=(-1)${p.v}$, así que por homogeneidad $${p.t}(-${p.v})=${p.t}((-1)${p.v})$, que es igual a ⟦h1⟧.`, 'b.arbitrario', ['L2'], [H('h1', r`$(-1)${p.t}(${p.v})=-${p.t}(${p.v})$`, [r`$(-1)${p.t}(${p.v})=-${p.t}(${p.v})$`, r`$${p.t}(${p.v})-1$`, r`$0$`], false)]],
      ['L4', r`Con esto se cumplen las dos igualdades. ∎`, 'd.lineal', ['L2', 'L3']],
    ],
    dist: p => [[r`Con $${p.t}(x)=2x$ se cumple $${p.t}(0)=0$; luego siempre.`, 'un ejemplo no prueba el caso general'], [r`Como $${p.t}$ conserva las operaciones, el cero va al cero.`, 'hay que probarlo con la definición']],
    err: p => [['L1', r`$${p.t}(0)=${p.t}(0\cdot 0)=${p.t}(0)\cdot ${p.t}(0)$.`, 'error-de-calculo', 'Se usa la **suma**: $0=0+0$.'], ['L3', r`$${p.t}(-${p.v})=${p.t}(${p.v})-1$.`, 'error-de-calculo', 'La homogeneidad da $(-1)\\cdot T(v)$.']],
    valida: [['definicion', r`Escribir $0=0+0$ y $-v=(-1)v$ y aplicar la definición`, 'Es la prueba estándar.']],
    idea: p => r`$0=0+0$ y $-${p.v}=(-1)${p.v}$.`, primero: p => r`calcula $${p.t}(0+0)$.`,
  });

  dem2({
    id: 'dem.criterio-lineal', teorema: 't.criterio-lineal', nivel: '6.1', habilidades: ['6.1.reconocer', '6.1.evaluar', '6.1.demostrar'], requiere: [], refsExtra: ['d.lineal', 'b.doble-implicacion', 'b.arbitrario'],
    param: rng => ({ t: rng.pick(['T', 'L']), u: rng.pick(['u', 'x']), v: rng.pick(['v', 'y']) }),
    enunciado: p => r`Demuestra que $${p.t}$ es lineal si y solo si $${p.t}(a${p.u}+b${p.v})=a${p.t}(${p.u})+b${p.t}(${p.v})$ para todos $${p.u},${p.v}$ y escalares $a,b$.`,
    hip: p => [r`$${p.t}:V\to W$ es una función`, 'Basta usar la definición de linealidad'], meta: p => r`lineal $\iff$ $${p.t}(a${p.u}+b${p.v})=a${p.t}(${p.u})+b${p.t}(${p.v})$`,
    L: p => [
      ['L1', r`(⇒) Si $${p.t}$ es lineal: $${p.t}(a${p.u}+b${p.v})=${p.t}(a${p.u})+${p.t}(b${p.v})$ por aditividad y $=a${p.t}(${p.u})+b${p.t}(${p.v})$ por homogeneidad.`, 'd.lineal'],
      ['L2', r`(⇐) Supongamos la identidad para todos $a,b,${p.u},${p.v}$. Tomando $a=b=1$ se obtiene $${p.t}(${p.u}+${p.v})=${p.t}(${p.u})+${p.t}(${p.v})$: aditividad.`, 'b.arbitrario', ['L1']],
      ['L3', r`Tomando $b=0$: $${p.t}(a${p.u})=a${p.t}(${p.u})+0\cdot ${p.t}(${p.v})$, que es igual a ⟦h1⟧, que es la homogeneidad.`, 'b.arbitrario', ['L1'], [H('h1', r`$a${p.t}(${p.u})$`, [r`$a${p.t}(${p.u})$`, r`$${p.t}(a)${p.u}$`, r`$0$`], false)]],
      ['L4', r`Se cumplen aditividad y homogeneidad: $${p.t}$ es lineal. ∎`, 'b.doble-implicacion', ['L2', 'L3']],
    ],
    dist: p => [[r`Con $${p.t}(x)=3x$ se cumple la identidad; luego el criterio vale.`, 'un ejemplo no prueba el caso general'], [r`Como la identidad solo usa suma y escalar, es lo mismo que linealidad.`, 'hay que deducir las dos propiedades por separado']],
    err: p => [['L2', r`Tomando $a=b=0$ se obtiene $${p.t}(${p.u}+${p.v})=${p.t}(${p.u})+${p.t}(${p.v})$.`, 'error-de-calculo', 'Para la suma se toma $a=b=1$.'], ['L3', r`Tomando $a=0$: $${p.t}(b${p.v})=b${p.t}(${p.v})$ y por eso $${p.t}(${p.u}+${p.v})$ ya está.`, 'conclusion-invalida', 'Para la homogeneidad en $u$ se toma $b=0$.']],
    valida: [['casos', r`Probar (⇒) con la definición y (⇐) con $a=b=1$ y $b=0$`, 'Es la prueba estándar.']],
    idea: p => r`$a=b=1$ da la suma y $b=0$ da el escalar.`, primero: p => r`prueba (⇒) con aditividad y homogeneidad.`,
  });

  dem2({
    id: 'dem.lineal-determinada-base', teorema: 't.lineal-determinada-base', nivel: '6.1', habilidades: ['6.1.por-base', '6.1.evaluar', '6.1.demostrar'], requiere: ['t.coordenadas-unicas', 't.coordenadas-lineales'], refsExtra: ['d.lineal', 'd.coordenadas', 'b.arbitrario'],
    param: rng => ({ t: rng.pick(['T', 'L']), b: rng.pick(['b', 'e']), w: rng.pick(['w', 'z']), v: rng.pick(['v', 'u']) }),
    enunciado: p => r`Sea $(${p.b}_1,\dots,${p.b}_n)$ una base de $V$ y $${p.w}_1,\dots,${p.w}_n\in W$. Demuestra que existe una única transformación lineal $${p.t}$ con $${p.t}(${p.b}_i)=${p.w}_i$.`,
    hip: p => [r`$(${p.b}_i)$ es una base de $V$`, 'Puedes citar la unicidad y la linealidad de las coordenadas'], meta: p => r`existe una única $${p.t}$ lineal con $${p.t}(${p.b}_i)=${p.w}_i$`,
    L: p => [
      ['L1', r`Existencia: definimos $${p.t}(${p.v})=\sum x_i${p.w}_i$ donde $(x_i)=[${p.v}]_B$ (las coordenadas son únicas, así que está bien definida).`, 'd.coordenadas'],
      ['L2', r`Es lineal: como $[${p.v}+${p.v}']_B=[${p.v}]_B+[${p.v}']_B$ y $[c${p.v}]_B=c[${p.v}]_B$, se tiene $${p.t}(${p.v}+${p.v}')=${p.t}(${p.v})+${p.t}(${p.v}')$ y $${p.t}(c${p.v})=c${p.t}(${p.v})$.`, 't.coordenadas-lineales', ['L1']],
      ['L3', r`Además $[${p.b}_i]_B=e_i$, así que $${p.t}(${p.b}_i)=${p.w}_i$.`, 'd.coordenadas', ['L1']],
      ['L4', r`Unicidad: si $S$ es lineal con $S(${p.b}_i)=${p.w}_i$, para $${p.v}=\sum x_i${p.b}_i$ se tiene $S(${p.v})=\sum x_iS(${p.b}_i)=\sum x_i${p.w}_i$, que es igual a ⟦h1⟧.`, 'd.lineal', ['L3'], [H('h1', r`$${p.t}(${p.v})$`, [r`$${p.t}(${p.v})$`, r`$0$`, r`$${p.w}_1$`], false)]],
      ['L5', r`Luego $S=${p.t}$. ∎`, 'b.arbitrario', ['L2', 'L4']],
    ],
    dist: p => [[r`En $\mathbb{R}^2$ con la base canónica $T(x,y)=xw_1+yw_2$ cumple lo pedido; luego siempre.`, 'un ejemplo no prueba el caso general'], [r`Como las coordenadas existen, la transformación existe y es única.`, 'falta probar la linealidad y que coincide con cualquier otra']],
    err: p => [['L2', r`Como $[${p.v}+${p.v}']_B=[${p.v}]_B\cdot[${p.v}']_B$ se tiene $${p.t}(${p.v}+${p.v}')=\cdots$`, 'error-de-calculo', 'Las coordenadas respetan la **suma**, no el producto.'], ['L4', r`$S(${p.v})=\sum S(x_i)${p.b}_i$.`, 'error-de-calculo', 'La linealidad saca el escalar: $S(x_ib_i)=x_iS(b_i)$.']],
    valida: [['coordenadas', r`Definir $T$ con coordenadas y probar unicidad por linealidad`, 'Es la prueba estándar.']],
    idea: p => r`$${p.t}(${p.v})=\sum x_i${p.w}_i$ con $x=[${p.v}]_B$.`, primero: p => r`define $${p.t}$ mediante las coordenadas.`,
  });

  dem2({
    id: 'dem.composicion-lineal', teorema: 't.composicion-lineal', nivel: '6.1', habilidades: ['6.1.evaluar', '6.1.geometria', '6.1.demostrar'], requiere: ['t.criterio-lineal'], refsExtra: ['d.lineal', 'd.composicion-fun'],
    param: rng => ({ s: rng.pick(['S', 'G']), t: rng.pick(['T', 'F']), u: rng.pick(['u', 'x']), v: rng.pick(['v', 'y']) }),
    enunciado: p => r`Demuestra que si $${p.t}:U\to V$ y $${p.s}:V\to W$ son lineales, $${p.s}\circ ${p.t}$ es lineal.`,
    hip: p => [r`$${p.t}$ y $${p.s}$ lineales`, 'Puedes usar el criterio de linealidad'], meta: p => r`$${p.s}\circ ${p.t}$ es lineal`,
    L: p => [
      ['L1', r`Sean $${p.u},${p.v}\in U$ y $a,b$ escalares. Por definición, $(${p.s}\circ ${p.t})(a${p.u}+b${p.v})=${p.s}(${p.t}(a${p.u}+b${p.v}))$.`, 'd.composicion-fun'],
      ['L2', r`Como $${p.t}$ es lineal, $${p.t}(a${p.u}+b${p.v})=a${p.t}(${p.u})+b${p.t}(${p.v})$.`, 't.criterio-lineal', ['L1']],
      ['L3', r`Como $${p.s}$ es lineal, $${p.s}(a${p.t}(${p.u})+b${p.t}(${p.v}))=a${p.s}(${p.t}(${p.u}))+b${p.s}(${p.t}(${p.v}))$.`, 't.criterio-lineal', ['L2']],
      ['L4', r`Esto es $a(${p.s}\circ ${p.t})(${p.u})+b(${p.s}\circ ${p.t})(${p.v})$. Por el ⟦h1⟧, $${p.s}\circ ${p.t}$ es lineal. ∎`, 'd.composicion-fun', ['L3'], [H('h1', 'criterio de linealidad', ['criterio de linealidad', 'teorema de la dimensión', 'criterio del subespacio'], false)]],
    ],
    dist: p => [[r`Con $T=S=2\cdot$ la composición $4\cdot$ es lineal; luego siempre.`, 'un ejemplo no prueba el caso general'], [r`Como composiciones de funciones son funciones, $${p.s}\circ ${p.t}$ es lineal.`, 'solo si ambas lo son, y hay que probarlo']],
    err: p => [['L2', r`Como $${p.t}$ es lineal, $${p.t}(a${p.u}+b${p.v})=${p.t}(a)${p.u}+${p.t}(b)${p.v}$.`, 'error-de-calculo', '$T$ actúa sobre los vectores, no sobre los escalares.'], ['L3', r`Como $${p.s}$ es lineal, $${p.s}(a${p.t}(${p.u})+b${p.t}(${p.v}))=a${p.s}(${p.u})+b${p.s}(${p.v})$.`, 'error-de-calculo', 'Hay que aplicar $S$ a $T(u)$ y a $T(v)$.']],
    valida: [['criterio', r`Aplicar el criterio de linealidad dos veces`, 'Es la prueba estándar.']],
    idea: p => r`aplica linealidad primero de $${p.t}$ y luego de $${p.s}$.`, primero: p => r`calcula $(${p.s}\circ ${p.t})(a${p.u}+b${p.v})$.`,
  });

  R.nivel({
    id: '6.1', mundo: 6, titulo: 'Transformaciones lineales', tema: 'Definición, criterios, bases y composición',
    habilidades: ['6.1.reconocer', '6.1.evaluar', '6.1.por-base', '6.1.geometria', '6.1.demostrar'],
    teoremas: ['t.lineal-cero-opuesto', 't.criterio-lineal', 't.lineal-determinada-base', 't.composicion-lineal'],
    leccion: {
      intro: 'Una **transformación lineal** $T:V\\to W$ conserva las dos operaciones: $T(u+v)=T(u)+T(v)$ y $T(cv)=cT(v)$. Son las funciones que respetan la estructura de espacio vectorial.',
      definiciones: [
        { nombre: 'Criterio', tex: '$T$ es lineal si y solo si $T(au+bv)=aT(u)+bT(v)$. En particular $T(0)=0$: si falla, no es lineal.' },
        { nombre: 'Reconocerlas', tex: 'En $\\mathbb{R}^n\\to\\mathbb{R}^m$, $T$ es lineal si cada coordenada de $T(x)$ es combinación lineal de las $x_i$ (sin constantes, productos, potencias ni valores absolutos).' },
        { nombre: 'Determinadas por una base', tex: 'Conocer $T(b_1),\\dots,T(b_n)$ en una base basta: $T(\\sum x_ib_i)=\\sum x_iT(b_i)$, y cualquier asignación define una única $T$.' },
        { nombre: 'Composición', tex: '$(S\\circ T)(v)=S(T(v))$ (primero $T$, luego $S$) es lineal. Giros y reflexiones del plano son transformaciones lineales.' },
      ],
      teorema: 't.criterio-lineal',
      ejemplo: { enunciado: 'Si $T(1,0)=(2,1)$ y $T(0,1)=(0,3)$, ¿cuánto vale $T(3,-2)$?', pasos: ['$(3,-2)=3(1,0)-2(0,1)$.', 'Por linealidad $T(3,-2)=3T(1,0)-2T(0,1)=3(2,1)-2(0,3)$.', 'El resultado es $(6,-3)$.'] },
    },
  });

  if (typeof module !== 'undefined') module.exports = AC;
})(globalThis.AC = globalThis.AC || {});
