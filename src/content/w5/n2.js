/* Mundo 5, nivel 5.2 — Combinación lineal, generado e independencia. */
(function (AC) {
  const { R, H, T, gen, dem2 } = AC.cont, r = String.raw, M = AC.mat, Rat = AC.Rat;
  const ref = (id, tipo, nombre) => R.ref({ id, tipo, nombre });
  ref('d.combinacion-lineal', 'definicion', 'Combinación lineal de v₁,…,vₖ: c₁v₁ + ⋯ + cₖvₖ'); ref('d.generado', 'definicion', 'Generado de S: el conjunto de todas las combinaciones lineales de elementos de S');
  ref('d.independencia', 'definicion', 'v₁,…,vₖ son independientes si c₁v₁ + ⋯ + cₖvₖ = 0 solo se da con todos los cᵢ = 0');

  const HB = (id, nombre) => R.habilidad({ id: '5.2.' + id, nombre, nivel: '5.2' });
  HB('combinacion', 'Combinaciones lineales'); HB('generado', 'El generado de un conjunto'); HB('independencia', 'Independencia lineal'); HB('rango-conjunto', 'Rango de un conjunto de vectores'); HB('demostrar', 'Demostrar con generados e independencia');
  const TE = (id, titulo, enunciado, requiere, hab) => R.teorema({ id, titulo, nivel: '5.2', enunciado, requiere, habilidades: hab });
  TE('t.generado-subespacio', 'El generado es subespacio', r`$\operatorname{gen}(S)$ es un subespacio y contiene a $S$.`, ['t.subespacio-criterio'], ['5.2.generado', '5.2.combinacion', '5.2.demostrar']);
  TE('t.dependencia-combinacion', 'Dependencia y combinación', r`$v_1,\dots,v_k$ son dependientes si y solo si alguno es combinación lineal de los demás.`, [], ['5.2.independencia', '5.2.combinacion', '5.2.demostrar']);
  TE('t.independencia-matriz', 'Independencia por rango', r`Las columnas de $A$ ($m\times k$) son independientes si y solo si $Ax=0$ solo tiene $x=0$, es decir, $\operatorname{rango}A=k$.`, ['t.nulidad'], ['5.2.independencia', '5.2.rango-conjunto', '5.2.demostrar']);
  TE('t.agregar-independiente', 'Agregar un vector independiente', r`Si $S$ es independiente y $v\notin\operatorname{gen}(S)$, entonces $S\cup\{v\}$ es independiente.`, ['t.dependencia-combinacion'], ['5.2.independencia', '5.2.generado', '5.2.demostrar']);

  const F = M.fmt, V = v => M.texVec(v), strMat = A => A.map(f => f.map(String));
  const rv = (rng, n, lo, hi) => Array.from({ length: n }, () => Rat.of(rng.int(lo, hi)));
  const lis = vs => vs.map(v => '(' + v.map(String).join(',') + ')').join(', ');
  const tupla = v => '$(' + v.join(', ') + ')$';

  /* ---------- generadores ---------- */
  gen.tupla({
    id: 'w5.n2.coeficientes', nivel: '5.2', habilidades: ['5.2.combinacion'], dificultad: 2,
    hacer(rng) {
      const u1 = rv(rng, 3, -3, 4), u2 = rv(rng, 3, -3, 4); if (M.rango([u1, u2]) < 2) return null; const a = rng.int(-4, 5), b = rng.int(-4, 5), v = M.combina([a, b], [u1, u2]);
      return { key: lis([u1, u2]) + v.join(), enun: 'Escribe $v=(' + v.join(',') + ')$ como combinación lineal $v=a\\,u_1+b\\,u_2$ con $u_1=(' + u1.join(',') + ')$ y $u_2=(' + u2.join(',') + ')$. Halla $(a,b)$.', campos: ['a', 'b'], res: [String(a), String(b)],
        firmas: [['orden', [b, a], 'El orden es $(a,b)$: $a$ multiplica a $u_1$ y $b$ a $u_2$.'], ['signo', [-a, -b], 'Revisa los signos al resolver el sistema.']].filter(f => f[1].join() !== [a, b].join()),
        pistas: ['Orientación: plantea $a u_1+b u_2=v$ coordenada a coordenada.', 'Idea clave: es un sistema lineal $3\\times2$ en $a$ y $b$.', 'Primer paso: escribe las tres ecuaciones y resuelve con dos de ellas.'], expl: '$v=' + a + 'u_1+' + b + 'u_2$ (con $b$ y $a$ como corresponde).' };
    },
  });

  gen.entero({
    id: 'w5.n2.parametro-generado', nivel: '5.2', habilidades: ['5.2.generado', '5.2.combinacion'], dificultad: 3,
    hacer(rng) {
      const u1 = rv(rng, 3, -3, 4), u2 = rv(rng, 3, -3, 4); if (M.rango([u1, u2]) < 2) return null; const a = rng.int(-3, 4), b = rng.int(-3, 4), w = M.combina([a, b], [u1, u2]); if (a === 0 && b === 0) return null;
      const v = [w[0], w[1]]; const k = Number(w[2].n);
      return { key: lis([u1, u2]) + v.join(), enun: '¿Para qué valor de $k$ el vector $(' + v.join(',') + ',k)$ pertenece a $\\operatorname{gen}\\{(' + u1.join(',') + '),(' + u2.join(',') + ')\\}$?', res: k,
        firmas: [['signo', -k, 'Revisa el signo al sustituir los coeficientes.'], ['suma', Number(u1[2].n) + Number(u2[2].n), 'Esa es la suma de las terceras coordenadas; falta hallar los coeficientes $a,b$ con las dos primeras.']].filter(f => f[1] !== k),
        pistas: ['Orientación: debe existir $(a,b)$ con $a u_1+b u_2=(' + v.join(',') + ',k)$.', 'Idea clave: las dos primeras coordenadas determinan $a$ y $b$; la tercera da $k$.', 'Primer paso: resuelve el sistema con las dos primeras coordenadas.'], expl: '$k=' + k + '$.' };
    },
  });

  gen.eleccion({
    id: 'w5.n2.independientes', nivel: '5.2', habilidades: ['5.2.independencia'], dificultad: 2,
    hacer(rng) {
      const u1 = rv(rng, 3, -3, 4), u2 = rv(rng, 3, -3, 4); if (M.rango([u1, u2]) < 2) return null; const dep = rng.chance(0.5), a = rng.int(-2, 2), b = rng.int(-2, 2); let u3;
      if (dep) { if (a === 0 && b === 0) return null; u3 = M.combina([a, b], [u1, u2]); } else { u3 = rv(rng, 3, -3, 4); if (M.rango([u1, u2, u3]) < 3) return null; }
      const ok = dep ? 'No: $u_3$ es combinación lineal de $u_1$ y $u_2$' : 'Sí: son linealmente independientes';
      return { key: lis([u1, u2, u3]), enun: 'Sean $u_1=(' + u1.join(',') + ')$, $u_2=(' + u2.join(',') + ')$, $u_3=(' + u3.join(',') + ')$. ¿Son linealmente independientes?', ok,
        malas: [dep ? ['dice-si', 'Sí: son linealmente independientes', 'Hay una combinación no trivial que da el vector cero: son dependientes.'] : ['dice-no', 'No: $u_3$ es combinación lineal de $u_1$ y $u_2$', 'El determinante es no nulo: ninguno es combinación de los otros.'], ['dos-proporcionales', 'No: dos de ellos son proporcionales', 'Ningún par es proporcional; la dependencia (si existe) es de tres vectores.'], ['nulo', 'No: contiene al vector cero', 'Ninguno de los tres es el vector cero.']],
        pistas: ['Orientación: forma la matriz con estos vectores como columnas.', 'Idea clave: independientes $\\iff$ rango $3$ $\\iff$ determinante no nulo.', 'Primer paso: calcula el determinante o escalona.'], expl: dep ? 'Hay dependencia: $\\operatorname{rango}=2<3$.' : 'El rango es $3$: independientes.' };
    },
  });

  gen.entero({
    id: 'w5.n2.parametro-dependencia', nivel: '5.2', habilidades: ['5.2.independencia'], dificultad: 4,
    hacer(rng) {
      const A = M.de(Array.from({ length: 3 }, () => rv(rng, 3, -3, 4))), i = rng.int(0, 2), j = rng.int(0, 2), at = v => { const B = M.copia(A); B[i][j] = Rat.of(v); return B; };
      const d0 = M.det(at(0)), al = M.det(at(1)).sub(d0); if (al.isZero()) return null; const k = d0.neg().div(al); if (!k.isInt()) return null;
      const fila = (f, a) => '(' + f.map((x, b) => (a === i && b === j ? 'k' : String(x))).join(',') + ')'; const kk = Number(k.n);
      return { key: A.map((f, a) => fila(f, a)).join(), enun: '¿Para qué valor de $k$ son linealmente **dependientes** los vectores $' + A.map((f, a) => fila(f, a)).join(',\\ ') + '$?', res: kk,
        firmas: [['signo', -kk, 'Revisa el signo al despejar $k$.'], ['cero', 0, 'Con ese valor los vectores siguen siendo independientes: calcula el determinante en función de $k$.']].filter(f => f[1] !== kk),
        pistas: ['Orientación: tres vectores de $\\mathbb{R}^3$ son dependientes si y solo si su determinante es $0$.', 'Idea clave: el determinante es lineal en $k$.', 'Primer paso: calcula el determinante desarrollando por la fila o columna con $k$.'], expl: '$k=' + kk + '$.' };
    },
  });

  gen.tupla({
    id: 'w5.n2.relacion-lineal', nivel: '5.2', habilidades: ['5.2.independencia', '5.2.combinacion'], dificultad: 3,
    hacer(rng) {
      const u1 = rv(rng, 3, -3, 4), u2 = rv(rng, 3, -3, 4); if (M.rango([u1, u2]) < 2) return null; const a = rng.int(-3, 3), b = rng.int(-3, 3); if (a === 0 && b === 0) return null; const u3 = M.combina([a, b], [u1, u2]);
      const vecs = [u1, u2, u3], N = M.nucleo(M.T(vecs)); if (N.length !== 1) return null;
      return { key: lis(vecs), enun: 'Los vectores $u_1=(' + u1.join(',') + ')$, $u_2=(' + u2.join(',') + ')$ y $u_3=(' + u3.join(',') + ')$ son dependientes. Halla coeficientes $(c_1,c_2,c_3)$, **no todos cero**, con $c_1u_1+c_2u_2+c_3u_3=0$.', campos: ['c₁', 'c₂', 'c₃'], res: F([N[0]])[0], verificador: { id: 'dependencia-lineal', args: { vecs: strMat(vecs) } },
        firmas: [['cero', ['0', '0', '0'], 'Con todos los coeficientes cero la combinación es trivial: hay que hallar una relación no trivial.'], ['unos', ['1', '1', '1'], 'Con $(1,1,1)$ la suma $u_1+u_2+u_3$ no es el vector cero.']].filter(g => g[0] === 'cero' || M.combina(g[1].map(x => Rat.parse(x)), vecs).some(z => !z.isZero())),
        pistas: ['Orientación: es un sistema homogéneo $3\\times3$ en $c_1,c_2,c_3$.', 'Idea clave: sabes que $u_3=' + a + 'u_1+' + b + 'u_2$ (si lo ves), así que $' + a + 'u_1+' + b + 'u_2-u_3=0$.', 'Primer paso: escribe $c_1u_1+c_2u_2+c_3u_3=0$ coordenada a coordenada.'], expl: 'Sirve $(' + F([N[0]])[0].join(',') + ')$ y sus múltiplos.' };
    },
  });

  gen.entero({
    id: 'w5.n2.rango-conjunto', nivel: '5.2', habilidades: ['5.2.rango-conjunto'], dificultad: 3,
    hacer(rng) {
      const n = rng.int(3, 4), k = rng.int(4, 5), rg = rng.int(2, n - 1), base = Array.from({ length: rg }, () => rv(rng, n, -3, 4)); if (M.rango(base) < rg) return null;
      const vs = base.slice(); while (vs.length < k) { vs.push(M.combina([rng.int(-2, 2), rng.int(-2, 2)], [base[0], base[rg - 1]])); } const S = rng.shuffle(vs); if (M.rango(S) !== rg) return null;
      return { key: lis(S), enun: '¿Cuál es la dimensión del subespacio generado por $' + S.map(v => '(' + v.join(',') + ')').join(',\\ ') + '$?', res: rg,
        firmas: [['cuenta-vectores', k, 'Hay $' + k + '$ vectores, pero algunos son combinación de otros: la dimensión es el rango.'], ['dimension-ambiente', n, 'Esa es la dimensión del espacio ambiente $\\mathbb{R}^' + n + '$; el subespacio generado es más pequeño.']].filter(f => f[1] !== rg),
        pistas: ['Orientación: la dimensión del generado es el rango de la matriz de vectores.', 'Idea clave: escalona la matriz con los vectores como filas y cuenta pivotes.', 'Primer paso: escribe la matriz $' + k + '\\times' + n + '$.'], expl: 'El rango es $' + rg + '$.' };
    },
  });

  gen.eleccion({
    id: 'w5.n2.generan', nivel: '5.2', habilidades: ['5.2.generado', '5.2.independencia'], dificultad: 3,
    hacer(rng) {
      const vs = [rv(rng, 3, -3, 4), rv(rng, 3, -3, 4), rv(rng, 3, -3, 4)], rg = M.rango(vs), ok = rg === 3 ? 'Sí, generan todo $\\mathbb{R}^3$' : (rg === 2 ? 'No: generan solo un plano' : 'No: generan solo una recta o el cero'); if (rg === 0) return null;
      const all = ['Sí, generan todo $\\mathbb{R}^3$', 'No: generan solo un plano', 'No: generan solo una recta o el cero'];
      return { key: lis(vs), enun: '¿Generan $\\mathbb{R}^3$ los vectores $' + vs.map(v => '(' + v.join(',') + ')').join(',\\ ') + '$?', ok, malas: all.filter(t => t !== ok).map((t, i) => ['otra-' + i, t, 'Calcula el rango: generan $\\mathbb{R}^3$ solo si es $3$; el rango aquí es $' + rg + '$.']),
        pistas: ['Orientación: tres vectores generan $\\mathbb{R}^3$ si y solo si son independientes.', 'Idea clave: rango $3$ $\\iff$ determinante no nulo.', 'Primer paso: calcula el rango de la matriz formada por ellos.'], expl: 'El rango es $' + rg + '$.' };
    },
  });

  /* ---------- demostraciones ---------- */
  dem2({
    id: 'dem.generado-subespacio', teorema: 't.generado-subespacio', nivel: '5.2', habilidades: ['5.2.generado', '5.2.combinacion', '5.2.demostrar'], requiere: ['t.subespacio-criterio'], refsExtra: ['d.generado', 'd.combinacion-lineal', 'b.arbitrario'],
    param: rng => ({ s: rng.pick(['S', 'B']), a: rng.pick(['a', 'α']), u: rng.pick(['u', 'x']), w: rng.pick(['w', 'y']) }),
    enunciado: p => r`Demuestra que $\operatorname{gen}(${p.s})$ es un subespacio de $V$ y contiene a $${p.s}=\{v_1,\dots,v_k\}$.`,
    hip: p => [r`$${p.s}=\{v_1,\dots,v_k\}\subseteq V$`, 'Puedes citar el criterio del subespacio'], meta: p => r`$\operatorname{gen}(${p.s})$ es subespacio y $${p.s}\subseteq\operatorname{gen}(${p.s})$`,
    L: p => [
      ['L1', r`$v_i=0\cdot v_1+\cdots+1\cdot v_i+\cdots+0\cdot v_k$: cada $v_i$ es combinación lineal de $${p.s}$, luego $${p.s}\subseteq\operatorname{gen}(${p.s})$ (en particular no es vacío).`, 'd.combinacion-lineal'],
      ['L2', r`Sean $${p.u}=\sum a_iv_i$ y $${p.w}=\sum b_iv_i$ en $\operatorname{gen}(${p.s})$. Entonces $${p.u}+${p.w}=\sum(a_i+b_i)v_i$ por distributividad: es combinación lineal.`, 'd.generado', ['L1']],
      ['L3', r`Para un escalar $${p.a}$, $${p.a}${p.u}=\sum(${p.a}a_i)v_i$: también es combinación lineal de $${p.s}$ (⟦h1⟧).`, 'd.generado', ['L1'], [H('h1', r`por distributividad y asociatividad`, [r`por distributividad y asociatividad`, r`por conmutatividad de los $v_i$`, r`porque $${p.a}=0$`], false)]],
      ['L4', r`Por el criterio del subespacio, $\operatorname{gen}(${p.s})$ es subespacio. ∎`, 't.subespacio-criterio', ['L2', 'L3']],
    ],
    dist: p => [[r`Con $${p.s}=\{(1,0),(0,1)\}$ el generado es $\mathbb{R}^2$, que es subespacio; luego siempre.`, 'un ejemplo no prueba el caso general'], [r`Como $${p.s}$ es finito, su generado es finito y por tanto un subespacio.`, 'el generado suele ser infinito; además no es el argumento']],
    err: p => [['L2', r`Entonces $${p.u}+${p.w}=\sum a_ib_iv_i$.`, 'error-de-calculo', 'Se suman los coeficientes: $(a_i+b_i)$.'], ['L3', r`Para un escalar $${p.a}$, $${p.a}${p.u}=\sum(${p.a}+a_i)v_i$.`, 'error-de-calculo', 'El escalar **multiplica** cada coeficiente.']],
    valida: [['criterio', r`Comprobar que el generado contiene a $S$ y es cerrado bajo suma y escalares`, 'Es la prueba estándar.']],
    idea: p => r`sumar combinaciones lineales y multiplicar por escalares da combinaciones lineales.`, primero: p => r`comprueba que $v_i\in\operatorname{gen}(${p.s})$.`,
  });

  dem2({
    id: 'dem.dependencia-combinacion', teorema: 't.dependencia-combinacion', nivel: '5.2', habilidades: ['5.2.independencia', '5.2.combinacion', '5.2.demostrar'], requiere: [], refsExtra: ['d.independencia', 'd.combinacion-lineal', 'b.doble-implicacion'],
    param: rng => ({ c: rng.pick(['c', 'λ']), j: rng.pick(['j', 'm']) }),
    enunciado: p => r`Demuestra que $v_1,\dots,v_k$ son linealmente dependientes si y solo si algún $v_${p.j}$ es combinación lineal de los otros.`,
    hip: p => [r`$v_1,\dots,v_k\in V$`, 'Basta usar la definición de independencia'], meta: p => r`dependientes $\iff$ algún $v_${p.j}$ es combinación de los demás`,
    L: p => [
      ['L1', r`(⇒) Si son dependientes, existen $${p.c}_i$ no todos cero con $\sum ${p.c}_iv_i=0$. Sea $${p.j}$ con $${p.c}_${p.j}\neq0$.`, 'd.independencia'],
      ['L2', r`Despejando, $v_${p.j}=-\frac{1}{${p.c}_${p.j}}\sum_{i\neq ${p.j}}${p.c}_iv_i$ (se puede dividir porque ⟦h1⟧): es combinación lineal de los demás.`, 'd.combinacion-lineal', ['L1'], [H('h1', r`$${p.c}_${p.j}\neq0$`, [r`$${p.c}_${p.j}\neq0$`, r`$v_${p.j}=0$`, r`$${p.c}_${p.j}=1$`], false)]],
      ['L3', r`(⇐) Si $v_${p.j}=\sum_{i\neq ${p.j}}a_iv_i$, entonces $1\cdot v_${p.j}-\sum_{i\neq ${p.j}}a_iv_i=0$.`, 'd.combinacion-lineal', ['L1']],
      ['L4', r`Es una combinación igual a cero con el coeficiente de $v_${p.j}$ igual a $1\neq0$: los vectores son dependientes. ∎`, 'd.independencia', ['L2', 'L3']],
    ],
    dist: p => [[r`$(1,0)$, $(2,0)$ son dependientes y el segundo es múltiplo del primero; luego siempre.`, 'un ejemplo no prueba el caso general'], [r`Si $v_1=0$ entonces son independientes.`, 'con el vector cero son dependientes']],
    err: p => [['L2', r`Despejando, $v_${p.j}=-${p.c}_${p.j}\sum_{i\neq ${p.j}}${p.c}_iv_i$.`, 'error-de-calculo', 'Hay que **dividir** entre $c_j$, no multiplicar.'], ['L4', r`Es una combinación igual a cero con todos los coeficientes cero: dependientes.`, 'conclusion-invalida', 'El coeficiente de $v_j$ es $1$, no cero: la combinación es no trivial.']],
    valida: [['definicion', r`Usar la definición y despejar un vector`, 'Es la prueba estándar.']],
    idea: p => r`un coeficiente no nulo permite despejar ese vector.`, primero: p => r`parte de $\sum ${p.c}_iv_i=0$ con algún coeficiente no nulo.`,
  });

  dem2({
    id: 'dem.independencia-matriz', teorema: 't.independencia-matriz', nivel: '5.2', habilidades: ['5.2.independencia', '5.2.rango-conjunto', '5.2.demostrar'], requiere: ['t.nulidad'], refsExtra: ['d.independencia', 'd.rango', 'b.doble-implicacion'],
    param: rng => ({ a: rng.pick(['A', 'C']), x: rng.pick(['x', 'c']), k: rng.pick(['k', 'p']) }),
    enunciado: p => r`Sea $${p.a}$ de tamaño $m\times ${p.k}$ con columnas $a_1,\dots,a_${p.k}$. Demuestra que las columnas son independientes si y solo si $\operatorname{rango}${p.a}=${p.k}$.`,
    hip: p => [r`$${p.a}=(a_1\ \cdots\ a_${p.k})$`, 'Puedes citar el teorema del rango y las variables libres'], meta: p => r`columnas independientes $\iff\operatorname{rango}${p.a}=${p.k}$`,
    L: p => [
      ['L1', r`Para $${p.x}=(x_1,\dots,x_${p.k})^T$, $${p.a}${p.x}=x_1a_1+\cdots+x_${p.k}a_${p.k}$: es la combinación lineal de las columnas con coeficientes $x_i$.`, 'd.independencia'],
      ['L2', r`Luego las columnas son independientes $\iff$ ($${p.a}${p.x}=0\Rightarrow ${p.x}=0$) $\iff$ el sistema homogéneo solo tiene la solución trivial.`, 'd.independencia', ['L1']],
      ['L3', r`Por el teorema de rango más nulidad, $${p.a}${p.x}=0$ tiene $${p.k}-\operatorname{rango}${p.a}$ variables libres.`, 't.nulidad', ['L2']],
      ['L4', r`Solo hay la solución trivial $\iff$ no hay variables libres $\iff$ ⟦h1⟧. ∎`, 'd.rango', ['L3'], [H('h1', r`$\operatorname{rango}${p.a}=${p.k}$`, [r`$\operatorname{rango}${p.a}=${p.k}$`, r`$\operatorname{rango}${p.a}=0$`, r`$m=${p.k}$`], false)]],
    ],
    dist: p => [[r`Con $${p.a}=I$ las columnas son independientes y el rango es $${p.k}$; luego siempre.`, 'un ejemplo no prueba el caso general'], [r`Como $${p.a}$ tiene $m$ filas, el rango es siempre $m$.`, 'el rango puede ser menor que $m$']],
    err: p => [['L1', r`$${p.a}${p.x}=x_1+\cdots+x_${p.k}$ (suma de los coeficientes).`, 'error-de-calculo', 'Cada coeficiente multiplica a su columna: $x_ia_i$.'], ['L4', r`Solo hay la solución trivial $\iff$ hay variables libres.`, 'conclusion-invalida', 'Sin variables libres: no hay solución no trivial.']],
    valida: [['homogeneo', r`Escribir la dependencia como $Ax=0$ y contar variables libres`, 'Es la prueba estándar.']],
    idea: p => r`una combinación de columnas con coeficientes $${p.x}$ es $${p.a}${p.x}$.`, primero: p => r`escribe $${p.a}${p.x}$ como combinación lineal de las columnas.`,
  });

  dem2({
    id: 'dem.agregar-independiente', teorema: 't.agregar-independiente', nivel: '5.2', habilidades: ['5.2.independencia', '5.2.generado', '5.2.demostrar'], requiere: ['t.dependencia-combinacion'], refsExtra: ['d.independencia', 'd.generado', 'b.contradiccion'],
    param: rng => ({ s: rng.pick(['S', 'B']), v: rng.pick(['v', 'w']), c: rng.pick(['c', 'λ']) }),
    enunciado: p => r`Sea $${p.s}=\{v_1,\dots,v_k\}$ independiente y $${p.v}\notin\operatorname{gen}(${p.s})$. Demuestra que $${p.s}\cup\{${p.v}\}$ es independiente.`,
    hip: p => [r`$${p.s}$ independiente y $${p.v}\notin\operatorname{gen}(${p.s})$`, 'Puedes citar la caracterización de la dependencia'], meta: p => r`$\{v_1,\dots,v_k,${p.v}\}$ independiente`,
    L: p => [
      ['L1', r`Supongamos $a_1v_1+\cdots+a_kv_k+${p.c}${p.v}=0$. Veamos que todos los coeficientes son cero.`, 'd.independencia'],
      ['L2', r`Si $${p.c}\neq0$, despejando $${p.v}=-\frac{1}{${p.c}}\sum a_iv_i\in\operatorname{gen}(${p.s})$, lo que contradice la hipótesis.`, 'b.contradiccion', ['L1']],
      ['L3', r`Luego $${p.c}=0$ y queda $a_1v_1+\cdots+a_kv_k=0$.`, 'd.independencia', ['L2']],
      ['L4', r`Como $${p.s}$ es independiente, ⟦h1⟧. Así todos los coeficientes son cero. ∎`, 'd.independencia', ['L3'], [H('h1', r`$a_1=\cdots=a_k=0$`, [r`$a_1=\cdots=a_k=0$`, r`$a_1=\cdots=a_k=1$`, r`$${p.v}=0$`], false)]],
    ],
    dist: p => [[r`En $\mathbb{R}^2$, $\{(1,0)\}$ y $(0,1)$ cumplen lo dicho; luego siempre.`, 'un ejemplo no prueba el caso general'], [r`Como $${p.v}\neq0$, el conjunto ampliado es independiente.`, 'no basta: $v$ podría estar en el generado']],
    err: p => [['L2', r`Si $${p.c}\neq0$, entonces $${p.v}\in\operatorname{gen}(${p.s})$ y por tanto no hay contradicción.`, 'conclusion-invalida', 'Sí hay contradicción: se supuso que $v\\notin\\operatorname{gen}(S)$.'], ['L3', r`Luego $${p.c}=0$ y queda $a_1v_1+\cdots+a_kv_k=${p.v}$.`, 'error-de-calculo', 'Queda igual a **cero**.']],
    valida: [['definicion', r`Plantear una combinación igual a cero y probar que todos los coeficientes son nulos`, 'Es la prueba estándar.']],
    idea: p => r`un coeficiente no nulo para $${p.v}$ lo pondría dentro del generado.`, primero: p => r`plantea una combinación lineal igual a cero.`,
  });

  R.nivel({
    id: '5.2', mundo: 5, titulo: 'Combinación lineal e independencia', tema: 'Generados, dependencia y rango de un conjunto',
    habilidades: ['5.2.combinacion', '5.2.generado', '5.2.independencia', '5.2.rango-conjunto', '5.2.demostrar'],
    teoremas: ['t.generado-subespacio', 't.dependencia-combinacion', 't.independencia-matriz', 't.agregar-independiente'],
    leccion: {
      intro: 'Una **combinación lineal** de $v_1,\\dots,v_k$ es $c_1v_1+\\cdots+c_kv_k$. El **generado** es el conjunto de todas ellas; es el menor subespacio que contiene a los $v_i$.',
      definiciones: [
        { nombre: 'Independencia', tex: '$v_1,\\dots,v_k$ son **independientes** si $c_1v_1+\\cdots+c_kv_k=0$ solo ocurre con todos los $c_i=0$; si no, son **dependientes**: algún $v_j$ es combinación de los demás.' },
        { nombre: 'Criterio matricial', tex: 'Con los vectores como columnas de $A$ ($m\\times k$): independientes $\\iff$ $Ax=0$ solo tiene $x=0$ $\\iff$ $\\operatorname{rango}A=k$.' },
        { nombre: 'Pertenencia', tex: '$v\\in\\operatorname{gen}\\{u_1,\\dots,u_k\\}$ $\\iff$ el sistema $c_1u_1+\\cdots+c_ku_k=v$ tiene solución (Rouché-Capelli).' },
        { nombre: 'Dimensión del generado', tex: 'El generado de $k$ vectores tiene dimensión igual al rango de la matriz que los tiene por filas (o columnas).' },
      ],
      teorema: 't.dependencia-combinacion',
      ejemplo: { enunciado: '¿Son independientes $(1,2,3)$, $(2,4,6)$, $(0,1,1)$?', pasos: ['El segundo es $2\\cdot(1,2,3)$: ya hay una relación $2u_1-u_2=0$.', 'Por tanto son dependientes (el rango es $2$, no $3$).', 'Un conjunto con un vector múltiplo de otro nunca es independiente.'] },
    },
  });

  if (typeof module !== 'undefined') module.exports = AC;
})(globalThis.AC = globalThis.AC || {});
