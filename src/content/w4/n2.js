/* Mundo 4, nivel 4.2 — Eliminación gaussiana y sistemas lineales. */
(function (AC) {
  const { R, H, T, gen, dem2 } = AC.cont, r = String.raw, M = AC.mat, Rat = AC.Rat;
  const ref = (id, tipo, nombre) => R.ref({ id, tipo, nombre });
  ref('d.operacion-elemental', 'definicion', 'Operaciones elementales por filas: intercambiar dos filas, multiplicar una por c ≠ 0, sumar a una un múltiplo de otra');
  ref('d.sistema-lineal', 'definicion', 'Sistema lineal Ax = b; su conjunto de soluciones'); ref('d.escalonada', 'definicion', 'Forma escalonada reducida: pivotes 1 con ceros arriba y abajo');

  const HB = (id, nombre) => R.habilidad({ id: '4.2.' + id, nombre, nivel: '4.2' });
  HB('escalonar', 'Escalonar una matriz'); HB('resolver', 'Resolver un sistema'); HB('clasificar', 'Clasificar sistemas'); HB('parametros', 'Sistemas con parámetro'); HB('demostrar', 'Demostrar con sistemas');
  const TE = (id, titulo, enunciado, requiere, hab) => R.teorema({ id, titulo, nivel: '4.2', enunciado, requiere, habilidades: hab });
  TE('t.ops-elementales', 'Operaciones elementales', r`Las operaciones elementales por filas no cambian el conjunto de soluciones de un sistema.`, [], ['4.2.escalonar', '4.2.resolver', '4.2.demostrar']);
  TE('t.solucion-general', 'Solución general', r`Si $Ax_p=b$, las soluciones de $Ax=b$ son exactamente $x_p+h$ con $Ah=0$.`, [], ['4.2.resolver', '4.2.clasificar', '4.2.demostrar']);
  TE('t.homogeneo-libres', 'Homogéneos con más incógnitas', r`Un sistema homogéneo con más incógnitas que ecuaciones tiene una solución no trivial.`, ['t.ops-elementales'], ['4.2.clasificar', '4.2.demostrar']);
  TE('t.incompatible', 'Criterio de incompatibilidad', r`Un sistema es incompatible si y solo si al escalonar aparece una fila $(0\ \cdots\ 0\mid c)$ con $c\neq0$.`, ['t.ops-elementales'], ['4.2.clasificar', '4.2.parametros', '4.2.demostrar']);

  const F = M.fmt, tx = A => M.tex(A), sis = (A, b) => '$' + M.texSistema(A, b) + '$';
  const rm = (rng, m, n, lo, hi) => M.de(Array.from({ length: m }, () => Array.from({ length: n }, () => rng.int(lo, hi))));
  const invertible = (rng, n, lo, hi) => { for (let k = 0; k < 60; k++) { const A = rm(rng, n, n, lo, hi), d = M.det(A); if (!d.isZero() && Math.abs(Number(d.n)) <= 12 && d.isInt()) return A; } return null; };
  const forward = A0 => { const A = M.copia(A0), m = A.length, n = A[0].length; let r = 0; for (let c = 0; c < n && r < m; c++) { let p = -1; for (let i = r; i < m; i++) if (!A[i][c].isZero()) { p = i; break; } if (p < 0) continue; [A[p], A[r]] = [A[r], A[p]]; for (let i = r + 1; i < m; i++) { const f = A[i][c].div(A[r][c]); A[i] = A[i].map((x, j) => x.sub(f.mul(A[r][j]))); } r++; } return A; };

  /* ---------- generadores ---------- */
  gen.tupla({
    id: 'w4.n2.sistema-3x3', nivel: '4.2', habilidades: ['4.2.resolver'], dificultad: 3,
    hacer(rng) {
      const A = invertible(rng, 3, -3, 4); if (!A) return null; const x = [rng.int(-4, 5), rng.int(-4, 5), rng.int(-4, 5)], b = M.aVec(M.mul(A, M.colVec(x)));
      if (new Set(x).size < 2) return null;
      return { key: tx(A) + x.join(), enun: 'Resuelve el sistema ' + sis(A, b) + ' y escribe $(x,y,z)$.', campos: ['x', 'y', 'z'], res: x.map(String),
        firmas: [['orden', [x[1], x[0], x[2]], 'Tienes los valores en otro orden: los campos son $x$, $y$, $z$.'], ['signo', x.map(v => -v), 'Revisa los signos al sustituir en las ecuaciones.']].filter(f => f[1].join() !== x.join()),
        pistas: ['Orientación: escalona la matriz aumentada.', 'Idea clave: elimina $x$ de las filas 2 y 3, luego $y$ de la fila 3.', 'Primer paso: usa la fila 1 para hacer ceros bajo el primer pivote.'], expl: 'Solución: $(x,y,z)=(' + x.join(',') + ')$.' };
    },
  });

  gen.tupla({
    id: 'w4.n2.circuito', nivel: '4.2', habilidades: ['4.2.resolver'], dificultad: 3,
    hacer(rng) {
      const R2 = rng.int(1, 3), R3 = rng.pick([1, 2, 3].filter(v => v !== R2)), t = rng.int(1, 2), I2 = R3 * t, I3 = R2 * t, I1 = I2 + I3, R1 = rng.int(1, 4), V = R1 * I1 + R2 * I2;
      return { key: [R1, R2, R3, V].join(), enun: 'En un circuito, la corriente $I_1$ se divide en $I_2$ e $I_3$ (nudo: $I_1=I_2+I_3$). Con $R_1=' + R1 + '\\,\\Omega$, $R_2=' + R2 + '\\,\\Omega$ y $R_3=' + R3 + '\\,\\Omega$: la malla de la fuente da $' + R1 + 'I_1+' + R2 + 'I_2=' + V + '$ y la otra malla $' + R2 + 'I_2-' + R3 + 'I_3=0$. Halla $(I_1,I_2,I_3)$ en amperios.', campos: ['I₁', 'I₂', 'I₃'], res: [I1, I2, I3].map(String),
        firmas: [['sin-nudo', [I2, I2, I3], 'Usa también la ecuación del nudo $I_1=I_2+I_3$.'], ['intercambio', [I1, I3, I2], '$I_2$ circula por $R_2$ e $I_3$ por $R_3$: no las intercambies.']].filter(f => f[1].join() !== [I1, I2, I3].join()),
        pistas: ['Orientación: tres ecuaciones lineales con $I_1,I_2,I_3$.', 'Idea clave: sustituye $I_1=I_2+I_3$ en la malla de la fuente.', 'Primer paso: escribe el sistema con las tres incógnitas y escalónalo.'], expl: '$(I_1,I_2,I_3)=(' + [I1, I2, I3].join(',') + ')$ A.' };
    },
  });

  gen.matriz({
    id: 'w4.n2.escalonada-reducida', nivel: '4.2', habilidades: ['4.2.escalonar'], dificultad: 3,
    hacer(rng) {
      const A = invertible(rng, 3, -3, 4); if (!A) return null; const c = rng.int(-3, 5), Aum = A.map((f, i) => f.concat([Rat.of(c * (i + 1) - 2)])), res = M.rref(Aum).R;
      return { key: tx(Aum), enun: 'Halla la forma escalonada **reducida** (Gauss-Jordan) de $' + tx(Aum) + '$.', res: F(res), etiqueta: 'R',
        firmas: [['sin-reducir', F(forward(Aum)), 'Eso es solo escalonada: falta normalizar los pivotes a $1$ y hacer ceros también por encima.']].filter(f => JSON.stringify(f[1]) !== JSON.stringify(F(res))),
        pistas: ['Orientación: elimina por debajo y por encima de cada pivote.', 'Idea clave: cada pivote se convierte en $1$ y su columna en ceros.', 'Primer paso: haz que el primer pivote sea $1$.'], expl: 'La forma reducida es $' + tx(res) + '$.' };
    },
  });

  gen.eleccion({
    id: 'w4.n2.contar-soluciones', nivel: '4.2', habilidades: ['4.2.clasificar'], dificultad: 3,
    hacer(rng) {
      const rows = [rm(rng, 1, 3, -3, 4)[0], rm(rng, 1, 3, -3, 4)[0]], a = rng.int(1, 3), b = rng.int(-2, 2);
      if (rows[0].every(x => x.isZero()) || M.rango([rows[0], rows[1]]) < 2) return null;
      const comb = rows[0].map((x, j) => x.mul(Rat.of(a)).add(rows[1][j].mul(Rat.of(b)))); if (M.rango([rows[0], rows[1], comb]) > 2) return null;
      const bb = [rng.int(-3, 4), rng.int(-3, 4)], tipo = rng.pick(['infinitas', 'ninguna']), b3 = Rat.of(bb[0]).mul(Rat.of(a)).add(Rat.of(bb[1]).mul(Rat.of(b))).add(tipo === 'ninguna' ? Rat.of(rng.pick([-2, -1, 1, 3])) : Rat.of(0));
      const A = [rows[0], rows[1], comb], bv = [Rat.of(bb[0]), Rat.of(bb[1]), b3], sol = M.resolver(A, bv);
      const nombres = { unica: 'una única solución', infinita: 'infinitas soluciones', incompatible: 'ninguna solución' }, ok = nombres[sol.tipo];
      return { key: tx(A) + bv.join(), enun: '¿Cuántas soluciones tiene ' + sis(A, bv) + '?', ok, malas: Object.keys(nombres).filter(k => k !== sol.tipo).map(k => ['otra-' + k, nombres[k], k === 'unica' ? 'La tercera fila depende de las otras dos: no hay tantas condiciones independientes como incógnitas.' : k === 'infinita' ? 'Al escalonar aparece una fila $(0\\,0\\,0\\mid c)$ con $c\\neq0$: es incompatible.' : 'No hay contradicción al escalonar: el sistema es compatible.'])
          .concat([['dos', 'exactamente dos soluciones', 'Un sistema lineal tiene $0$, $1$ o infinitas soluciones: nunca exactamente dos.']]),
        pistas: ['Orientación: escalona la matriz aumentada.', 'Idea clave: una fila $(0\\,0\\,0\\mid c\\neq0)$ da incompatible; sin ella, compárese el rango con el número de incógnitas.', 'Primer paso: resta combinaciones de las filas 1 y 2 a la fila 3.'], expl: 'El sistema tiene ' + ok + '.' };
    },
  });

  gen.entero({
    id: 'w4.n2.parametro-k', nivel: '4.2', habilidades: ['4.2.parametros', '4.2.clasificar'], dificultad: 4,
    hacer(rng) {
      const a = rng.int(1, 3), b = rng.int(-3, 4), c = rng.int(1, 3), m = rng.pick([2, 3, -1, -2]), d = rng.int(1, 5), inf = rng.chance(0.5), k = m * b;
      const A = [[Rat.of(a), Rat.of(b)], [Rat.of(m * a), Rat.of(k)]]; if (b === 0) return null;
      const bb = [Rat.of(d), Rat.of(m * d + (inf ? 0 : c))], sol = M.resolver(A, bb);
      const txt = '$\\begin{cases}' + a + 'x' + (b < 0 ? '-' : '+') + Math.abs(b) + 'y=' + d + '\\\\' + (m * a) + 'x+ky=' + bb[1] + '\\end{cases}$';
      return { key: [a, b, m, d, inf, c].join(), enun: 'Para el sistema ' + txt + ' halla el valor de $k$ para el cual el sistema ' + (inf ? 'tiene infinitas soluciones' : 'no tiene ninguna solución') + '.', res: k,
        firmas: [['signo', -k, 'Revisa el signo: la segunda fila es un múltiplo de la primera con el mismo factor en $x$ y en $y$.'], ['sin-multiplicar', b, 'La segunda fila es $' + m + '$ veces la primera en $x$, así que el coeficiente de $y$ debe ser $' + m + '\\cdot' + b + '$.']].filter(f => f[1] !== k),
        pistas: ['Orientación: si las filas son proporcionales, el sistema es degenerado.', 'Idea clave: para que la fila 2 sea múltiplo de la 1 en las incógnitas, $k=m\\cdot b$ con $m=(m\\cdot a)/a$.', 'Primer paso: calcula la razón entre los coeficientes de $x$.'], expl: '$k=' + k + '$.' };
    },
  });

  gen.entero({
    id: 'w4.n2.variables-libres', nivel: '4.2', habilidades: ['4.2.clasificar'], dificultad: 2,
    hacer(rng) {
      const m = rng.int(3, 4), n = rng.int(4, 6), rg = rng.int(1, Math.min(m, n - 1)), base = rm(rng, rg, n, -3, 4); if (M.rango(base) < rg) return null;
      const filas = base.slice(); while (filas.length < m) { const a = rng.int(-2, 2), b = rng.int(-2, 2); filas.push(base[0].map((x, j) => x.mul(Rat.of(a)).add((base[rg - 1] || base[0])[j].mul(Rat.of(b))))); }
      const A = rng.shuffle(filas), real = M.rango(A); if (real !== rg && real > Math.min(m, n)) return null;
      return { key: tx(A), enun: 'El sistema homogéneo $Ax=0$ tiene la matriz de coeficientes $A=' + tx(A) + '$. ¿Cuántas variables libres tiene la solución general?', res: n - real,
        firmas: [['rango', real, 'Ese es el rango; las variables libres son $n-\\operatorname{rango}$.'], ['filas', n - m, 'No siempre las filas son independientes: usa el rango en lugar de $m$.']].filter(f => f[1] !== n - real),
        pistas: ['Orientación: variables libres = incógnitas − pivotes.', 'Idea clave: el número de pivotes es el rango.', 'Primer paso: escalona $A$ y cuenta los pivotes.'], expl: 'Hay $' + n + '-' + real + '=' + (n - real) + '$ variables libres.' };
    },
  });

  gen.tupla({
    id: 'w4.n2.solucion-particular', nivel: '4.2', habilidades: ['4.2.resolver'], dificultad: 3,
    hacer(rng) {
      const A = rm(rng, 2, 3, -3, 4), sub2 = M.de([[A[0][0], A[0][1]], [A[1][0], A[1][1]]]); if (M.det(sub2).isZero() || !M.det(sub2).isInt() || Math.abs(Number(M.det(sub2).n)) > 5) return null;
      const t = rng.int(-2, 3), x = [rng.int(-3, 4), rng.int(-3, 4)], b = M.aVec(M.mul(A, M.colVec([x[0], x[1], t])));
      return { key: tx(A) + b.join() + t, enun: 'El sistema ' + sis(A, b) + ' tiene infinitas soluciones. Halla la que cumple $z=' + t + '$ y escribe $(x,y)$.', campos: ['x', 'y'], res: x.map(String),
        firmas: [['olvida-z', M.aVec(M.mul(M.inversa(sub2), M.colVec(b))).map(String), 'No olvides pasar $' + t + '$ veces la columna de $z$ al lado derecho.'], ['orden', [x[1], x[0]], 'Los campos son $x$ y luego $y$.']].filter(f => f[1].join() !== x.join()),
        pistas: ['Orientación: fijar $z$ deja un sistema $2\\times2$.', 'Idea clave: pasa $z\\cdot(\\text{columna de }z)$ al lado derecho.', 'Primer paso: sustituye $z=' + t + '$ en ambas ecuaciones.'], expl: 'Solución: $(x,y)=(' + x.join(',') + ')$.' };
    },
  });

  gen.eleccion({
    id: 'w4.n2.operacion-elemental', nivel: '4.2', habilidades: ['4.2.escalonar'], dificultad: 2,
    hacer(rng) {
      const A = rm(rng, 3, 3, -3, 4), i = rng.int(0, 2), j = (i + rng.int(1, 2)) % 3, c = rng.pick([2, 3, -1, -2, 4]), t = rng.pick(['suma', 'esc', 'swap']);
      const B = M.copia(A); let ok, malas;
      if (t === 'suma') { B[i] = B[i].map((x, k) => x.add(Rat.of(c).mul(A[j][k]))); ok = 'F' + (i + 1) + ' ← F' + (i + 1) + (c < 0 ? ' − ' : ' + ') + (Math.abs(c) === 1 ? '' : Math.abs(c)) + 'F' + (j + 1); malas = ['F' + (i + 1) + ' ← F' + (i + 1) + (c < 0 ? ' + ' : ' − ') + (Math.abs(c) === 1 ? '' : Math.abs(c)) + 'F' + (j + 1), 'F' + (j + 1) + ' ← F' + (j + 1) + (c < 0 ? ' − ' : ' + ') + (Math.abs(c) === 1 ? '' : Math.abs(c)) + 'F' + (i + 1), 'F' + (i + 1) + ' ← ' + c + 'F' + (i + 1)]; }
      else if (t === 'esc') { B[i] = B[i].map(x => x.mul(Rat.of(c))); ok = 'F' + (i + 1) + ' ← ' + c + 'F' + (i + 1); malas = ['F' + (i + 1) + ' ← F' + (i + 1) + ' + ' + c + 'F' + (j + 1), 'F' + (j + 1) + ' ← ' + c + 'F' + (j + 1), 'F' + (i + 1) + ' ← ' + (-c) + 'F' + (i + 1)]; }
      else { [B[i], B[j]] = [B[j], B[i]]; ok = 'F' + (i + 1) + ' ↔ F' + (j + 1); malas = ['F' + (i + 1) + ' ← F' + (j + 1), 'F' + (j + 1) + ' ← F' + (i + 1), 'F' + (i + 1) + ' ↔ F' + (3 - i - j + 1)]; }
      if (M.igual(A, B)) return null;
      return { key: tx(A) + ok, enun: '¿Qué operación elemental por filas transforma $' + tx(A) + '$ en $' + tx(B) + '$?', ok: '$' + ok.replace(/F(\d)/g, 'F_$1').replace('←', '\\leftarrow').replace('↔', '\\leftrightarrow') + '$',
        malas: malas.map((m, k) => ['otra-' + k, '$' + m.replace(/F(\d)/g, 'F_$1').replace('←', '\\leftarrow').replace('↔', '\\leftrightarrow') + '$', 'Aplica esa operación a $A$ y compara con la matriz de llegada: no coincide.']),
        pistas: ['Orientación: compara filas: ¿cuál cambió?', 'Idea clave: si dos filas se intercambiaron es un cambio; si una se multiplicó, un escalar; si cambió sumando algo, una combinación.', 'Primer paso: localiza la fila que difiere.'], expl: 'La operación es $' + ok + '$.' };
    },
  });

  /* ---------- demostraciones ---------- */
  dem2({
    id: 'dem.ops-elementales', teorema: 't.ops-elementales', nivel: '4.2', habilidades: ['4.2.escalonar', '4.2.resolver', '4.2.demostrar'], requiere: [], refsExtra: ['d.operacion-elemental', 'd.sistema-lineal', 'b.casos'],
    param: rng => ({ e: rng.pick(['E', 'e']), c: rng.pick(['c', 'λ']), s: rng.pick(['S', 'Σ']), t: rng.pick(['S′', 'S₂']) }),
    enunciado: p => r`Demuestra que si el sistema $${p.t}$ se obtiene de $${p.s}$ con una operación elemental por filas, ambos tienen las mismas soluciones.`,
    hip: p => [r`$${p.t}$ resulta de $${p.s}$ por una operación elemental`, 'Puedes usar que cada operación elemental se deshace con otra del mismo tipo'], meta: p => r`$${p.s}$ y $${p.t}$ tienen las mismas soluciones`,
    L: p => [
      ['L1', r`Sea $x$ una solución de $${p.s}$. Veamos que lo es de $${p.t}$ según el tipo de operación (casos).`, 'b.casos'],
      ['L2', r`Intercambiar dos ecuaciones no cambia el conjunto de condiciones; multiplicar una ecuación por $${p.c}\neq0$ conserva la igualdad que $x$ cumple.`, 'd.operacion-elemental', ['L1']],
      ['L3', r`Sumar a la ecuación $i$ el múltiplo $${p.c}$ de la $j$: si $x$ cumple ambas, cumple su combinación ⟦h1⟧.`, 'd.sistema-lineal', ['L1'], [H('h1', r`$e_i+${p.c}e_j$`, [r`$e_i+${p.c}e_j$`, r`$e_i\cdot e_j$`, r`$e_i-e_j+1$`], false)]],
      ['L4', r`Así toda solución de $${p.s}$ lo es de $${p.t}$. Recíprocamente, la operación inversa (intercambiar de nuevo, multiplicar por $1/${p.c}$, sumar $-${p.c}e_j$) lleva $${p.t}$ a $${p.s}$, luego toda solución de $${p.t}$ lo es de $${p.s}$. ∎`, 'd.operacion-elemental', ['L2', 'L3']],
    ],
    dist: p => [[r`Probamos con un sistema $2\times2$ y las soluciones no cambian; luego siempre.`, 'un ejemplo no prueba el caso general'], [r`Como la nueva ecuación sale de las otras, tiene las mismas soluciones.`, 'falta la dirección contraria: que la operación se pueda deshacer']],
    err: p => [['L2', r`Multiplicar una ecuación por $${p.c}$ conserva la igualdad aunque $${p.c}=0$.`, 'conclusion-invalida', 'Con $c=0$ se pierde información: la operación no sería reversible.'], ['L4', r`Con esto basta: toda solución de $${p.t}$ lo es de $${p.s}$ sin más.`, 'conclusion-invalida', 'Falta usar que la operación es reversible.']],
    valida: [['reversible', r`Probar que las soluciones se conservan y que la operación es reversible`, 'Es la prueba estándar.'], ['matricial', r`Ver cada operación como multiplicar por una matriz invertible $E$: $Ax=b\iff EAx=Eb$`, 'Válida y más corta.']],
    idea: p => r`cada operación conserva las soluciones y tiene inversa del mismo tipo.`, primero: p => r`distingue los tres tipos de operación.`,
  });

  dem2({
    id: 'dem.solucion-general', teorema: 't.solucion-general', nivel: '4.2', habilidades: ['4.2.resolver', '4.2.clasificar', '4.2.demostrar'], requiere: [], refsExtra: ['d.sistema-lineal', 'b.doble-implicacion', 'b.cuerpo-algebra'],
    param: rng => ({ x: rng.pick(['x', 'v']), p: rng.pick(['x_p', 'u']), h: rng.pick(['h', 'w']) }),
    enunciado: p => r`Sea $A${p.p}=b$. Demuestra que $${p.x}$ es solución de $A${p.x}=b$ si y solo si $${p.x}=${p.p}+${p.h}$ con $A${p.h}=0$.`,
    hip: p => [r`$A${p.p}=b$`, 'Puedes usar que el producto de matrices es distributivo'], meta: p => r`$A${p.x}=b\iff ${p.x}=${p.p}+${p.h}$ con $A${p.h}=0$`,
    L: p => [
      ['L1', r`Probamos las dos implicaciones.`, 'b.doble-implicacion'],
      ['L2', r`(⇒) Si $A${p.x}=b$, sea $${p.h}=${p.x}-${p.p}$. Entonces $A${p.h}=A${p.x}-A${p.p}=b-b=0$ y $${p.x}=${p.p}+${p.h}$.`, 'b.cuerpo-algebra', ['L1']],
      ['L3', r`(⇐) Si $${p.x}=${p.p}+${p.h}$ con $A${p.h}=0$, por distributividad $A${p.x}=A${p.p}+A${p.h}$, que es ⟦h1⟧.`, 'b.cuerpo-algebra', ['L1'], [H('h1', r`$b+0=b$`, [r`$b+0=b$`, r`$b+0=0$`, r`$b\cdot 0=b$`], false)]],
      ['L4', r`Por tanto el conjunto de soluciones es $\{${p.p}+${p.h}:A${p.h}=0\}$. ∎`, 'b.doble-implicacion', ['L2', 'L3']],
    ],
    dist: p => [[r`Con $A=(1\ 1)$ y $b=2$ vale para $${p.p}=(1,1)$; luego siempre.`, 'un ejemplo no prueba el caso general'], [r`Las soluciones de $A${p.x}=b$ son exactamente las de $A${p.x}=0$.`, 'solo es cierto si $b=0$']],
    err: p => [['L2', r`(⇒) Sea $${p.h}=${p.x}+${p.p}$; entonces $A${p.h}=2b$.`, 'error-de-calculo', 'Hay que **restar**: $h=x-x_p$.'], ['L3', r`$A${p.x}=A${p.p}\cdot A${p.h}=b\cdot 0=0$.`, 'error-de-calculo', 'Se **suma**: $A(x_p+h)=Ax_p+Ah$.']],
    valida: [['restar', r`Restar dos soluciones y usar linealidad`, 'Es la prueba estándar.']],
    idea: p => r`la diferencia de dos soluciones resuelve el sistema homogéneo.`, primero: p => r`prueba (⇒) con $${p.h}=${p.x}-${p.p}$.`,
  });

  dem2({
    id: 'dem.homogeneo-libres', teorema: 't.homogeneo-libres', nivel: '4.2', habilidades: ['4.2.clasificar', '4.2.demostrar'], requiere: ['t.ops-elementales'], refsExtra: ['d.escalonada', 'd.sistema-lineal', 'b.arbitrario'],
    param: rng => ({ m: rng.pick(['m', 'p']), n: rng.pick(['n', 'q']) }),
    enunciado: p => r`Demuestra que un sistema homogéneo de $${p.m}$ ecuaciones y $${p.n}>${p.m}$ incógnitas tiene una solución no trivial.`,
    hip: p => [r`$Ax=0$ con $A$ de tamaño $${p.m}\times ${p.n}$ y $${p.n}>${p.m}$`, 'Puedes citar que las operaciones elementales conservan las soluciones'], meta: p => r`existe $x\neq0$ con $Ax=0$`,
    L: p => [
      ['L1', r`Escalonamos $A$ a su forma reducida $R$; por el teorema de las operaciones elementales, $Ax=0$ y $Rx=0$ tienen las mismas soluciones.`, 't.ops-elementales'],
      ['L2', r`Cada fila de $R$ tiene a lo sumo un pivote, así que hay a lo sumo $${p.m}$ pivotes.`, 'd.escalonada', ['L1']],
      ['L3', r`Como hay $${p.n}>${p.m}$ columnas, al menos una columna no tiene pivote: es una variable ⟦h1⟧.`, 'd.escalonada', ['L2'], [H('h1', 'libre', ['libre', 'pivote', 'nula'], false)]],
      ['L4', r`Damos a esa variable el valor $1$ (y $0$ a las demás libres) y despejamos las variables pivote; obtenemos $x\neq0$ con $Rx=0$.`, 'd.sistema-lineal', ['L3']],
      ['L5', r`Por L1, $Ax=0$. ∎`, 't.ops-elementales', ['L1', 'L4']],
    ],
    dist: p => [[r`Con $x+y=0$ (una ecuación, dos incógnitas) hay solución no trivial $(1,-1)$; luego siempre.`, 'un ejemplo no prueba el caso general'], [r`Un sistema homogéneo siempre tiene la solución $x=0$.`, 'eso es la solución trivial; aquí se pide una no trivial']],
    err: p => [['L2', r`Cada fila de $R$ puede tener varios pivotes, así que hay a lo sumo $${p.n}$ pivotes.`, 'error-de-calculo', 'Cada fila tiene a lo sumo **un** pivote.'], ['L4', r`Damos a la variable libre el valor $0$ y despejamos.`, 'conclusion-invalida', 'Con todo en $0$ se obtiene la solución trivial; hay que dar el valor $1$.']],
    valida: [['pivotes', r`Contar pivotes en la forma reducida y dar valor $1$ a una variable libre`, 'Es la prueba estándar.']],
    idea: p => r`hay a lo sumo $${p.m}$ pivotes y $${p.n}>${p.m}$ columnas: queda una variable libre.`, primero: p => r`escalona $A$.`,
  });

  dem2({
    id: 'dem.incompatible', teorema: 't.incompatible', nivel: '4.2', habilidades: ['4.2.clasificar', '4.2.parametros', '4.2.demostrar'], requiere: ['t.ops-elementales'], refsExtra: ['d.escalonada', 'd.sistema-lineal', 'b.doble-implicacion'],
    param: rng => ({ c: rng.pick(['c', 'k']), r: rng.pick(['R', 'U']) }),
    enunciado: p => r`Sea $${p.r}$ la forma reducida de la matriz aumentada de un sistema. Demuestra que el sistema es incompatible si y solo si $${p.r}$ tiene una fila $(0\ \cdots\ 0\mid ${p.c})$ con $${p.c}\neq0$.`,
    hip: p => [r`$${p.r}$ es la forma escalonada reducida de $(A\mid b)$`, 'Puedes citar el teorema de las operaciones elementales'], meta: p => r`incompatible $\iff$ fila $(0\cdots0\mid ${p.c}\neq0)$`,
    L: p => [
      ['L1', r`Por el teorema de las operaciones elementales, el sistema original y el de $${p.r}$ tienen las mismas soluciones.`, 't.ops-elementales'],
      ['L2', r`(⇐) Si hay una fila $(0\cdots0\mid ${p.c})$ con $${p.c}\neq0$, esa ecuación es $0=${p.c}$, imposible: no hay soluciones.`, 'd.sistema-lineal', ['L1']],
      ['L3', r`(⇒) Si no hay tal fila, cada fila no nula tiene un pivote. Damos a las variables libres el valor $0$ y a cada variable pivote el valor de la última columna de su fila.`, 'd.escalonada', ['L1']],
      ['L4', r`Esto satisface cada ecuación de $${p.r}$, luego el sistema es compatible. Por contrarrecíproco, ⟦h1⟧. ∎`, 'b.doble-implicacion', ['L2', 'L3'], [H('h1', r`incompatible implica que existe la fila $(0\cdots0\mid ${p.c}\neq0)$`, [r`incompatible implica que existe la fila $(0\cdots0\mid ${p.c}\neq0)$`, r`compatible implica que hay solución única`, r`incompatible implica que $A=0$`], false)]],
    ],
    dist: p => [[r`Con $x+y=1$ y $x+y=2$ aparece $0=1$; luego siempre.`, 'un ejemplo no prueba el caso general'], [r`Si hay más ecuaciones que incógnitas, es incompatible.`, 'puede ser compatible (por ejemplo, ecuaciones repetidas)']],
    err: p => [['L2', r`Si hay una fila $(0\cdots0\mid 0)$, esa ecuación es $0=0$, imposible.`, 'error-de-calculo', '$0=0$ siempre se cumple; la imposible es $0=c$ con $c\\neq0$.'], ['L3', r`Damos a las variables pivote el valor $0$ y a las libres el valor de la última columna.`, 'error-de-calculo', 'Al revés: las libres valen $0$ y cada pivote toma el valor de su fila.']],
    valida: [['rango', r`Comparar el rango de $A$ con el de $(A\mid b)$`, 'Válida: es equivalente a este criterio (Rouché-Capelli).']],
    idea: p => r`la fila $(0\cdots0\mid ${p.c}\neq0)$ es la ecuación imposible $0=${p.c}$.`, primero: p => r`reduce el problema a $${p.r}$ con las operaciones elementales.`,
  });

  R.nivel({
    id: '4.2', mundo: 4, titulo: 'Eliminación gaussiana', tema: 'Resolver y clasificar sistemas lineales',
    habilidades: ['4.2.escalonar', '4.2.resolver', '4.2.clasificar', '4.2.parametros', '4.2.demostrar'],
    teoremas: ['t.ops-elementales', 't.solucion-general', 't.homogeneo-libres', 't.incompatible'],
    leccion: {
      intro: 'Un **sistema lineal** $Ax=b$ se resuelve con la matriz aumentada $(A\\mid b)$ y tres operaciones elementales por filas: intercambiar, multiplicar por $c\\neq0$ y sumar un múltiplo de otra fila. Ninguna cambia las soluciones.',
      definiciones: [
        { nombre: 'Escalonada reducida', tex: 'Cada fila no nula empieza con un pivote $1$, a su derecha en filas sucesivas, y la columna del pivote tiene ceros en el resto (Gauss-Jordan).' },
        { nombre: 'Tipos de solución', tex: 'Un sistema tiene **$0$** soluciones (aparece $0=c\\neq0$), **una** (todas las columnas de $A$ tienen pivote) o **infinitas** (hay variables libres). Nunca exactamente dos.' },
        { nombre: 'Solución general', tex: 'Si $x_p$ resuelve $Ax=b$, las soluciones son $x_p+h$ con $Ah=0$: una particular más la solución del sistema homogéneo.' },
        { nombre: 'Homogéneos', tex: 'Un sistema $Ax=0$ con más incógnitas que ecuaciones tiene siempre una solución no trivial.' },
      ],
      teorema: 't.solucion-general',
      ejemplo: { enunciado: 'Resuelve $x+y=3$, $x-y=1$.', pasos: ['Matriz aumentada $\\begin{pmatrix}1&1&3\\\\1&-1&1\\end{pmatrix}$; $F_2\\leftarrow F_2-F_1$ da $(0,-2\\mid-2)$.', '$F_2\\leftarrow -\\tfrac12F_2$ da $(0,1\\mid1)$; $F_1\\leftarrow F_1-F_2$ da $(1,0\\mid2)$.', 'La solución es $(x,y)=(2,1)$.'] },
    },
  });

  if (typeof module !== 'undefined') module.exports = AC;
})(globalThis.AC = globalThis.AC || {});
