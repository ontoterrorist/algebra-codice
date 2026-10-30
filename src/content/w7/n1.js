/* Mundo 7, nivel 7.1 — Valores y vectores propios. */
(function (AC) {
  const { R, H, T, gen, dem2 } = AC.cont, r = String.raw, M = AC.mat, Rat = AC.Rat, C = AC.conj;
  const ref = (id, tipo, nombre) => R.ref({ id, tipo, nombre });
  ref('d.propio', 'definicion', 'Valor propio λ de A: existe v ≠ 0 con Av = λv; v es un vector propio'); ref('d.espacio-propio', 'definicion', 'Espacio propio E_λ = ker(A − λI)');

  const HB = (id, nombre) => R.habilidad({ id: '7.1.' + id, nombre, nivel: '7.1' });
  HB('valores', 'Hallar valores propios'); HB('vectores', 'Hallar vectores propios'); HB('reconocer', 'Reconocer vectores propios'); HB('potencias', 'Potencias aplicadas a un vector propio'); HB('demostrar', 'Demostrar con valores propios');
  const TE = (id, titulo, enunciado, requiere, hab) => R.teorema({ id, titulo, nivel: '7.1', enunciado, requiere, habilidades: hab });
  TE('t.propio-nucleo', 'Valor propio y núcleo', r`$\lambda$ es valor propio de $A$ si y solo si $A-\lambda I$ no es invertible; entonces $E_\lambda=\ker(A-\lambda I)$ es un subespacio.`, ['t.invertible-equivalencias', 't.nucleo-subespacio'], ['7.1.valores', '7.1.vectores', '7.1.demostrar']);
  TE('t.propios-distintos-independientes', 'Propios distintos son independientes', r`Vectores propios asociados a valores propios distintos son linealmente independientes.`, ['t.dependencia-combinacion'], ['7.1.reconocer', '7.1.vectores', '7.1.demostrar']);
  TE('t.polinomio-caracteristico-2x2', 'Polinomio característico (2×2)', r`Los valores propios de una $2\times2$ son las raíces de $\lambda^2-(\operatorname{tr}A)\lambda+\det A$; su suma es $\operatorname{tr}A$ y su producto $\det A$.`, ['t.vieta-cuadratica', 't.det-invertible-2x2', 't.propio-nucleo'], ['7.1.valores', '7.1.demostrar']);
  TE('t.propios-potencias', 'Potencias y valores propios', r`Si $Av=\lambda v$, entonces $A^kv=\lambda^kv$ para todo $k\ge1$.`, ['t.mat-producto-asoc'], ['7.1.potencias', '7.1.reconocer', '7.1.demostrar']);

  const F = M.fmt, tx = A => M.tex(A), strMat = A => A.map(f => f.map(String));
  const par = v => '(' + v.join(',') + ')';
  const uni2 = [[[1, 1], [1, 2]], [[1, 2], [0, 1]], [[2, 1], [1, 1]], [[1, 0], [1, 1]], [[3, 1], [2, 1]], [[1, 1], [0, 1]], [[2, 3], [1, 2]], [[1, 3], [1, 2]], [[1, -1], [1, 0]], [[1, 0], [-2, 1]]];
  const unimodular3 = rng => { for (let k = 0; k < 40; k++) { const L = M.de([[1, 0, 0], [rng.int(-2, 2), 1, 0], [rng.int(-2, 2), rng.int(-2, 2), 1]]), U = M.de([[1, rng.int(-2, 2), rng.int(-2, 2)], [0, 1, rng.int(-2, 2)], [0, 0, 1]]), P = M.mul(L, U); if (P.every(f => f.every(x => Math.abs(Number(x.n)) <= 6))) return P; } return M.id(3); };
  const A2 = (rng, d1, d2) => { const P = M.de(rng.pick(uni2)); return { A: M.mul(P, M.mul(M.de([[d1, 0], [0, d2]]), M.inversa(P))), P }; };

  /* ---------- generadores ---------- */
  gen.conjunto({
    id: 'w7.n1.valores-2x2', nivel: '7.1', habilidades: ['7.1.valores'], dificultad: 2,
    hacer(rng) {
      const d1 = rng.int(-3, 4), d2 = rng.int(-3, 4); if (d1 === d2) return null; const { A } = A2(rng, d1, d2), res = [String(d1), String(d2)];
      return { key: tx(A), enun: 'Halla los valores propios de $A=' + tx(A) + '$ (escribe el conjunto).', res, norm: 'racional',
        firmas: [['diagonal', A.map((f, i) => String(f[i])), 'Los valores propios no son las entradas de la diagonal (salvo en triangulares).'], ['traza-det', [String(M.traza(A)), String(M.det(A))], 'Esa es la traza y el determinante; los valores propios son las raíces de $\\lambda^2-(\\operatorname{tr}A)\\lambda+\\det A$.']].filter(f => C.fmt(f[1]) !== C.fmt(res)),
        pistas: ['Orientación: resuelve $\\det(A-\\lambda I)=0$.', 'Idea clave: para $2\\times2$, $\\lambda^2-(\\operatorname{tr}A)\\lambda+\\det A=0$.', 'Primer paso: calcula $\\operatorname{tr}A=' + M.traza(A) + '$ y $\\det A=' + M.det(A) + '$.'], expl: 'Los valores propios son $' + d1 + '$ y $' + d2 + '$.' };
    },
  });

  gen.tupla({
    id: 'w7.n1.vector-propio', nivel: '7.1', habilidades: ['7.1.vectores'], dificultad: 3,
    hacer(rng) {
      const tres = rng.chance(0.4); let A, lam; const d = [rng.int(-2, 3), rng.int(-2, 3), rng.int(-2, 3)];
      if (tres) { if (new Set(d).size < 3) return null; const P = unimodular3(rng); A = M.mul(P, M.mul(M.de([[d[0], 0, 0], [0, d[1], 0], [0, 0, d[2]]]), M.inversa(P))); lam = d[rng.int(0, 2)]; }
      else { if (d[0] === d[1]) return null; A = A2(rng, d[0], d[1]).A; lam = d[rng.int(0, 1)]; }
      const n = A.length, B = M.sub(A, M.esc(M.id(n), lam)), N = M.nucleo(B); if (N.length !== 1) return null; const vars = ['x', 'y', 'z'].slice(0, n);
      return { key: tx(A) + lam, enun: 'Sea $A=' + tx(A) + '$, que tiene a $\\lambda=' + lam + '$ como valor propio. Escribe un vector propio **no nulo** asociado a $\\lambda=' + lam + '$.', campos: vars, res: F([N[0]])[0], verificador: { id: 'nucleo-vector', args: { A: strMat(B), n } },
        firmas: [['cero', Array(n).fill('0'), 'El vector cero nunca es vector propio (por definición).'], ['vector-unitario', [1, ...Array(n - 1).fill(0)].map(String), 'Comprueba $A v=' + lam + 'v$: el vector $e_1$ no cumple la condición en general.']].filter(g => g[0] === 'cero' || M.evaluaSistema(B, g[1].map(x => Rat.parse(x))).some(z => !z.isZero())),
        pistas: ['Orientación: resuelve $(A-' + lam + 'I)v=0$.', 'Idea clave: los vectores propios de $\\lambda$ son los vectores no nulos del núcleo de $A-\\lambda I$.', 'Primer paso: escribe la matriz $A-' + lam + 'I$.'], expl: 'Sirve, por ejemplo, $' + par(F([N[0]])[0]) + '$.' };
    },
  });

  gen.eleccion({
    id: 'w7.n1.cual-es-propio', nivel: '7.1', habilidades: ['7.1.reconocer'], dificultad: 2,
    hacer(rng) {
      const d1 = rng.int(-2, 3), d2 = rng.int(-2, 3); if (d1 === d2) return null; const { A, P } = A2(rng, d1, d2), cols = M.T(P), v = cols[rng.int(0, 1)];
      const malos = []; for (let k = 0; k < 80 && malos.length < 3; k++) { const w = [Rat.of(rng.int(-3, 3)), Rat.of(rng.int(-3, 3))]; if (w.every(x => x.isZero())) continue; const Aw = M.aVec(M.mul(A, M.colVec(w))); const esProp = Aw[0].mul(w[1]).eq(Aw[1].mul(w[0])); if (!esProp && !malos.some(m => m.join() === w.join())) malos.push(w); }
      if (malos.length < 3) return null; const fv = x => '$' + par(x) + '$';
      return { key: tx(A) + par(v), enun: 'Sea $A=' + tx(A) + '$. ¿Cuál de estos vectores es un **vector propio** de $A$?', ok: fv(v), malas: malos.map((w, i) => ['no-propio-' + i, fv(w), 'Calcula $Aw$: no es un múltiplo de $w$, así que no es vector propio.']),
        pistas: ['Orientación: $v$ es propio si $Av$ es un múltiplo de $v$.', 'Idea clave: calcula $Av$ y compara con $v$.', 'Primer paso: multiplica $A$ por la primera opción.'], expl: 'Solo $' + par(v) + '$ cumple que $Av$ es múltiplo de $v$.' };
    },
  });

  gen.entero({
    id: 'w7.n1.valor-del-vector', nivel: '7.1', habilidades: ['7.1.reconocer', '7.1.valores'], dificultad: 2,
    hacer(rng) {
      const d1 = rng.int(-3, 4), d2 = rng.int(-3, 4); if (d1 === d2) return null; const { A, P } = A2(rng, d1, d2), j = rng.int(0, 1), v = M.T(P)[j], lam = [d1, d2][j];
      return { key: tx(A) + par(v), enun: 'El vector $v=' + par(v) + '$ es un vector propio de $A=' + tx(A) + '$. ¿Para qué valor propio $\\lambda$ se cumple $Av=\\lambda v$?', res: lam,
        firmas: [['otro-valor', [d1, d2][1 - j], 'Ese es el otro valor propio de $A$; calcula $Av$ y compáralo con $v$.'], ['norma', Number(M.dot(v, v).n), 'Eso es $v\\cdot v$; el valor propio es el factor por el que $A$ multiplica a $v$.']].filter(f => f[1] !== lam),
        pistas: ['Orientación: calcula $Av$.', 'Idea clave: $Av=\\lambda v$, así que compara una coordenada no nula.', 'Primer paso: multiplica $A$ por $v$.'], expl: '$Av=' + lam + 'v$.' };
    },
  });

  gen.conjunto({
    id: 'w7.n1.triangular', nivel: '7.1', habilidades: ['7.1.valores'], dificultad: 2,
    hacer(rng) {
      const d = [rng.int(-3, 4), rng.int(-3, 4), rng.int(-3, 4)], A = M.de([[d[0], rng.int(-3, 3), rng.int(-3, 3)], [0, d[1], rng.int(-3, 3)], [0, 0, d[2]]]), res = [...new Set(d.map(String))];
      return { key: tx(A), enun: 'Halla los valores propios de la matriz triangular $A=' + tx(A) + '$ (escribe el conjunto, sin repetir).', res, norm: 'racional',
        firmas: [['suma', [String(d[0] + d[1] + d[2])], 'La suma es la traza; los valores propios de una triangular son las entradas de su diagonal, cada una por separado.'], ['sin-diagonal', [String(A[0][1]), String(A[1][2])], 'Los valores propios son las entradas de la **diagonal**.']].filter(f => C.fmt(f[1]) !== C.fmt(res)),
        pistas: ['Orientación: $\\det(A-\\lambda I)$ es el producto de la diagonal $(a_{ii}-\\lambda)$.', 'Idea clave: en una matriz triangular los valores propios son los elementos de la diagonal.', 'Primer paso: lee la diagonal.'], expl: 'Los valores propios son ' + C.tex(res) + '.' };
    },
  });

  gen.tupla({
    id: 'w7.n1.potencia-vector', nivel: '7.1', habilidades: ['7.1.potencias'], dificultad: 3,
    hacer(rng) {
      const d1 = rng.int(-2, 3), d2 = rng.int(-2, 3); if (d1 === d2) return null; const { A, P } = A2(rng, d1, d2), j = rng.int(0, 1), v = M.T(P)[j], lam = [d1, d2][j], k = rng.int(3, 7); if (lam === 0 || Math.abs(lam) === 1) return null;
      const w = v.map(x => x.mul(Rat.of(lam ** k)));
      return { key: tx(A) + par(v) + k, enun: 'Se sabe que $v=' + par(v) + '$ es vector propio de $A=' + tx(A) + '$. Calcula $A^{' + k + '}v$ sin calcular $A^{' + k + '}$.', campos: ['x', 'y'], res: w.map(String),
        firmas: [['una-vez', v.map(x => String(x.mul(Rat.of(lam)))), 'Eso es $Av$; hay que aplicar $A$ **' + k + '** veces: $A^kv=\\lambda^kv$.'], ['k-por-lambda', v.map(x => String(x.mul(Rat.of(lam * k)))), 'Es $\\lambda^k$, no $k\\lambda$.']].filter(f => f[1].join() !== w.map(String).join()),
        pistas: ['Orientación: primero halla $\\lambda$ con $Av=\\lambda v$.', 'Idea clave: $A^kv=\\lambda^kv$.', 'Primer paso: calcula $Av$ y compáralo con $v$.'], expl: '$\\lambda=' + lam + '$ y $A^{' + k + '}v=' + lam + '^{' + k + '}v=' + par(w) + '$.' };
    },
  });

  gen.conjunto({
    id: 'w7.n1.traza-determinante', nivel: '7.1', habilidades: ['7.1.valores'], dificultad: 2,
    hacer(rng) {
      const a = rng.int(-4, 5), b = rng.int(-4, 5); if (a === b) return null; const A = M.de([[a + b, 0], [0, 0]]).map(f => f.slice());
      return { key: a + ',' + b, enun: 'Una matriz $2\\times2$ tiene traza $' + (a + b) + '$ y determinante $' + a * b + '$. ¿Cuáles son sus valores propios? (escribe el conjunto).', res: [String(a), String(b)], norm: 'racional',
        firmas: [['con-signo-opuesto', [String(-a), String(-b)], 'Revisa los signos: la suma de los valores propios es la traza y su producto el determinante.'], ['traza-det', [String(a + b), String(a * b)], 'Esos son la traza y el determinante; los valores propios son las raíces de $\\lambda^2-(\\operatorname{tr}A)\\lambda+\\det A$.']].filter(f => C.fmt(f[1]) !== C.fmt([String(a), String(b)])),
        pistas: ['Orientación: $\\lambda_1+\\lambda_2=\\operatorname{tr}A$ y $\\lambda_1\\lambda_2=\\det A$.', 'Idea clave: son las raíces de $\\lambda^2-(' + (a + b) + ')\\lambda+' + a * b + '$.', 'Primer paso: busca dos números con esa suma y ese producto.'], expl: 'Son $' + a + '$ y $' + b + '$.' };
    },
  });

  gen.entero({
    id: 'w7.n1.dim-espacio-propio', nivel: '7.1', habilidades: ['7.1.vectores', '7.1.valores'], dificultad: 3,
    hacer(rng) {
      const a = rng.int(-2, 3), b = rng.int(-2, 3); if (a === b) return null; const caso = rng.pick(['diag', 'jordan']);
      const A = caso === 'diag' ? M.de([[a, 0, 0], [0, a, 0], [0, 0, b]]) : M.de([[a, 1, 0], [0, a, 0], [0, 0, b]]), dim = M.espacioPropio(A, Rat.of(a)).length;
      return { key: tx(A) + a, enun: '$A=' + tx(A) + '$ tiene a $\\lambda=' + a + '$ como valor propio con multiplicidad algebraica $2$. ¿Cuál es la dimensión de su espacio propio $E_{' + a + '}$?', res: dim,
        firmas: [['multiplicidad', 2, 'La dimensión del espacio propio (multiplicidad geométrica) puede ser menor que la multiplicidad algebraica.'], ['uno-mas', caso === 'diag' ? 1 : 2, 'Calcula $\\dim\\ker(A-' + a + 'I)=3-\\operatorname{rango}(A-' + a + 'I)$.']].filter(f => f[1] !== dim),
        pistas: ['Orientación: $E_\\lambda=\\ker(A-\\lambda I)$.', 'Idea clave: $\\dim E_\\lambda=3-\\operatorname{rango}(A-\\lambda I)$.', 'Primer paso: escribe $A-' + a + 'I$ y calcula su rango.'], expl: '$\\dim E_{' + a + '}=' + dim + '$.' };
    },
  });

  /* ---------- demostraciones ---------- */
  dem2({
    id: 'dem.propio-nucleo', teorema: 't.propio-nucleo', nivel: '7.1', habilidades: ['7.1.valores', '7.1.vectores', '7.1.demostrar'], requiere: ['t.invertible-equivalencias', 't.nucleo-subespacio'], refsExtra: ['d.propio', 'd.espacio-propio', 'd.invertible'],
    param: rng => ({ a: rng.pick(['A', 'B']), v: rng.pick(['v', 'x']), l: rng.pick(['λ', 'μ']) }),
    enunciado: p => r`Demuestra que $${p.l}$ es valor propio de $${p.a}$ ($n\times n$) si y solo si $${p.a}-${p.l}I$ no es invertible, y que $E_${p.l}=\ker(${p.a}-${p.l}I)$ es un subespacio.`,
    hip: p => [r`$${p.a}$ es $n\times n$`, 'Puedes citar los criterios de invertibilidad y que el núcleo es subespacio'], meta: p => r`$${p.l}$ propio $\iff ${p.a}-${p.l}I$ no invertible; $E_${p.l}$ subespacio`,
    L: p => [
      ['L1', r`$${p.l}$ es valor propio $\iff$ existe $${p.v}\neq0$ con $${p.a}${p.v}=${p.l}${p.v}$, por definición.`, 'd.propio'],
      ['L2', r`$${p.a}${p.v}=${p.l}${p.v}\iff(${p.a}-${p.l}I)${p.v}=0$ (pasando $${p.l}${p.v}$ al otro lado y usando $I${p.v}=${p.v}$).`, 'd.espacio-propio', ['L1']],
      ['L3', r`Entonces $${p.l}$ es propio $\iff(${p.a}-${p.l}I)${p.v}=0$ tiene una solución $${p.v}\neq0$ $\iff$ ⟦h1⟧.`, 't.invertible-equivalencias', ['L2'], [H('h1', r`$${p.a}-${p.l}I$ no es invertible`, [r`$${p.a}-${p.l}I$ no es invertible`, r`$${p.a}-${p.l}I=0$`, r`$${p.a}=${p.l}I$`], false)]],
      ['L4', r`Por el teorema del núcleo, $E_${p.l}=\ker(${p.a}-${p.l}I)$ es un subespacio. ∎`, 't.nucleo-subespacio', ['L2']],
    ],
    dist: p => [[r`Con $${p.a}=\mathrm{diag}(2,3)$ y $${p.l}=2$ se cumple; luego siempre.`, 'un ejemplo no prueba el caso general'], [r`Como $${p.a}${p.v}=${p.l}${p.v}$, la matriz $${p.a}-${p.l}I$ es la matriz cero.`, 'solo se anula sobre $v$, no sobre todo vector']],
    err: p => [['L2', r`$${p.a}${p.v}=${p.l}${p.v}\iff(${p.a}+${p.l}I)${p.v}=0$.`, 'error-de-calculo', 'Al pasar $\\lambda v$ al otro lado **resta**.'], ['L3', r`Es propio $\iff$ $(${p.a}-${p.l}I)${p.v}=0$ solo tiene $${p.v}=0$ $\iff$ no invertible.`, 'conclusion-invalida', 'Un vector propio es **no** nulo: debe haber solución no trivial.']],
    valida: [['definicion', r`Pasar de $Av=\lambda v$ a $(A-\lambda I)v=0$ y usar los criterios de invertibilidad`, 'Es la prueba estándar.']],
    idea: p => r`$${p.a}${p.v}=${p.l}${p.v}$ equivale a $(${p.a}-${p.l}I)${p.v}=0$.`, primero: p => r`reescribe $${p.a}${p.v}=${p.l}${p.v}$.`,
  });

  dem2({
    id: 'dem.propios-distintos-independientes', teorema: 't.propios-distintos-independientes', nivel: '7.1', habilidades: ['7.1.reconocer', '7.1.vectores', '7.1.demostrar'], requiere: ['t.dependencia-combinacion'], refsExtra: ['d.propio', 'd.independencia', 'd.hip-induccion'],
    param: rng => ({ a: rng.pick(['A', 'B']), v: rng.pick(['v', 'w']), l: rng.pick(['λ', 'μ']), c: rng.pick(['c', 'a']) }),
    enunciado: p => r`Sean $${p.v}_1,\dots,${p.v}_k$ vectores propios de $${p.a}$ con valores propios **distintos** $${p.l}_1,\dots,${p.l}_k$. Demuestra por inducción que son linealmente independientes.`,
    hip: p => [r`$${p.a}${p.v}_i=${p.l}_i${p.v}_i$, $${p.v}_i\neq0$, $${p.l}_i$ distintos`, 'Basta la definición de independencia'], meta: p => r`$${p.v}_1,\dots,${p.v}_k$ independientes`,
    L: p => [
      ['L1', r`Base $k=1$: $${p.v}_1\neq0$, así que $\{${p.v}_1\}$ es independiente.`, 'd.independencia'],
      ['L2', r`Paso: supongamos independientes $${p.v}_1,\dots,${p.v}_{k-1}$ y sea $${p.c}_1${p.v}_1+\cdots+${p.c}_k${p.v}_k=0$ (1).`, 'd.hip-induccion', ['L1']],
      ['L3', r`Aplicando $${p.a}$: $${p.c}_1${p.l}_1${p.v}_1+\cdots+${p.c}_k${p.l}_k${p.v}_k=0$ (2); multiplicando (1) por $${p.l}_k$: $${p.c}_1${p.l}_k${p.v}_1+\cdots+${p.c}_k${p.l}_k${p.v}_k=0$ (3).`, 'd.propio', ['L2']],
      ['L4', r`Restando (3) de (2): $${p.c}_1(${p.l}_1-${p.l}_k)${p.v}_1+\cdots+${p.c}_{k-1}(${p.l}_{k-1}-${p.l}_k)${p.v}_{k-1}=0$.`, 'd.independencia', ['L3']],
      ['L5', r`Por hipótesis de inducción y como $${p.l}_i-${p.l}_k\neq0$, resulta ⟦h1⟧. Entonces (1) queda $${p.c}_k${p.v}_k=0$, así que $${p.c}_k=0$. ∎`, 'd.hip-induccion', ['L4'], [H('h1', r`$${p.c}_1=\cdots=${p.c}_{k-1}=0$`, [r`$${p.c}_1=\cdots=${p.c}_{k-1}=0$`, r`$${p.v}_1=\cdots=${p.v}_{k-1}=0$`, r`$${p.l}_k=0$`], false)]],
    ],
    dist: p => [[r`Con $\mathrm{diag}(1,2)$ y $e_1,e_2$ se cumple; luego siempre.`, 'un ejemplo no prueba el caso general'], [r`Como son vectores propios, son independientes por definición.`, 'hace falta que los valores propios sean distintos']],
    err: p => [['L3', r`Aplicando $${p.a}$: $${p.c}_1${p.l}_1+\cdots+${p.c}_k${p.l}_k=0$.`, 'error-de-calculo', 'Hay que conservar los vectores: $c_i\\lambda_iv_i$.'], ['L4', r`Sumando (3) y (2) se obtiene $${p.c}_1(${p.l}_1+${p.l}_k)${p.v}_1+\cdots=0$.`, 'error-de-calculo', 'Hay que **restar** para cancelar el término de $v_k$.']],
    valida: [['induccion', r`Inducción sobre $k$ aplicando $A$ y restando un múltiplo de la relación`, 'Es la prueba estándar.']],
    idea: p => r`aplica $${p.a}$ a la relación y réstale $${p.l}_k$ veces la relación original.`, primero: p => r`comprueba el caso $k=1$.`,
  });

  dem2({
    id: 'dem.polinomio-caracteristico-2x2', teorema: 't.polinomio-caracteristico-2x2', nivel: '7.1', habilidades: ['7.1.valores', '7.1.demostrar'], requiere: ['t.vieta-cuadratica', 't.det-invertible-2x2', 't.propio-nucleo'], refsExtra: ['d.propio', 'd.traza', 'b.cuerpo-algebra'],
    param: rng => ({ a: rng.pick(['a', 'p']), b: rng.pick(['b', 'q']), c: rng.pick(['c', 'r']), d: rng.pick(['d', 's']), l: rng.pick(['λ', 'μ']) }),
    enunciado: p => r`Sea $A=\begin{pmatrix}${p.a}&${p.b}\\${p.c}&${p.d}\end{pmatrix}$. Demuestra que sus valores propios son las raíces de $${p.l}^2-(${p.a}+${p.d})${p.l}+(${p.a}${p.d}-${p.b}${p.c})$, y que suman $\operatorname{tr}A$ y multiplican $\det A$.`,
    hip: p => [r`$A$ es una matriz $2\times2$`, 'Puedes citar el criterio de invertibilidad $2\\times2$, que un valor propio anula $A-\\lambda I$ no invertible y Vieta'], meta: p => r`suma $=\operatorname{tr}A$ y producto $=\det A$`,
    L: p => [
      ['L1', r`Por el teorema del valor propio y el núcleo, $${p.l}$ es propio $\iff A-${p.l}I$ no es invertible.`, 't.propio-nucleo'],
      ['L2', r`Por el criterio de invertibilidad $2\times2$, eso ocurre $\iff\det(A-${p.l}I)=0$, es decir, $(${p.a}-${p.l})(${p.d}-${p.l})-${p.b}${p.c}=0$.`, 't.det-invertible-2x2', ['L1']],
      ['L3', r`Desarrollando, $${p.l}^2-(${p.a}+${p.d})${p.l}+(${p.a}${p.d}-${p.b}${p.c})=0$.`, 'b.cuerpo-algebra', ['L2']],
      ['L4', r`Por Vieta, la suma de las raíces es ⟦h1⟧ (menos el coeficiente de $${p.l}$) y el producto es el término independiente $${p.a}${p.d}-${p.b}${p.c}=\det A$. ∎`, 't.vieta-cuadratica', ['L3'], [H('h1', r`$${p.a}+${p.d}=\operatorname{tr}A$`, [r`$${p.a}+${p.d}=\operatorname{tr}A$`, r`$${p.a}${p.d}=\det A$`, r`$0$`], false)]],
    ],
    dist: p => [[r`Para $\begin{pmatrix}2&0\\0&3\end{pmatrix}$ el polinomio es $(\lambda-2)(\lambda-3)$; luego siempre.`, 'un ejemplo no prueba el caso general'], [r`Como $A$ tiene dos entradas diagonales, esos son los valores propios.`, 'solo en triangulares']],
    err: p => [['L2', r`Eso ocurre $\iff(${p.a}-${p.l})(${p.d}-${p.l})+${p.b}${p.c}=0$.`, 'error-de-calculo', 'El determinante resta $bc$.'], ['L4', r`Por Vieta, la suma de las raíces es $-(${p.a}+${p.d})$.`, 'error-de-calculo', 'La suma es $-(\\text{coeficiente de }\\lambda)=a+d$.']],
    valida: [['directa', r`Desarrollar $\det(A-\lambda I)$ y aplicar Vieta`, 'Es la prueba estándar.']],
    idea: p => r`$\det(A-${p.l}I)=0$ es una ecuación cuadrática en $${p.l}$.`, primero: p => r`escribe $A-${p.l}I$.`,
  });

  dem2({
    id: 'dem.propios-potencias', teorema: 't.propios-potencias', nivel: '7.1', habilidades: ['7.1.potencias', '7.1.reconocer', '7.1.demostrar'], requiere: ['t.mat-producto-asoc'], refsExtra: ['d.propio', 'd.hip-induccion', 'b.peano'],
    param: rng => ({ a: rng.pick(['A', 'B']), v: rng.pick(['v', 'x']), l: rng.pick(['λ', 'μ']), k: rng.pick(['k', 'n']) }),
    enunciado: p => r`Sea $${p.a}${p.v}=${p.l}${p.v}$. Demuestra por inducción que $${p.a}^${p.k}${p.v}=${p.l}^${p.k}${p.v}$ para todo $${p.k}\ge1$.`,
    hip: p => [r`$${p.a}${p.v}=${p.l}${p.v}$`, 'Puedes usar la asociatividad del producto'], meta: p => r`$${p.a}^${p.k}${p.v}=${p.l}^${p.k}${p.v}$`,
    L: p => [
      ['L1', r`Base $${p.k}=1$: $${p.a}${p.v}=${p.l}${p.v}$ por hipótesis.`, 'b.peano'],
      ['L2', r`Paso: supongamos $${p.a}^${p.k}${p.v}=${p.l}^${p.k}${p.v}$. Entonces $${p.a}^{${p.k}+1}${p.v}=${p.a}(${p.a}^${p.k}${p.v})$ por asociatividad.`, 't.mat-producto-asoc', ['L1']],
      ['L3', r`Por hipótesis de inducción, $=${p.a}(${p.l}^${p.k}${p.v})=${p.l}^${p.k}(${p.a}${p.v})$ (el escalar sale de la multiplicación).`, 'd.hip-induccion', ['L2']],
      ['L4', r`Y $${p.a}${p.v}=${p.l}${p.v}$, de modo que $=${p.l}^${p.k}\cdot ${p.l}${p.v}$, que es igual a ⟦h1⟧.`, 'd.propio', ['L3'], [H('h1', r`$${p.l}^{${p.k}+1}${p.v}$`, [r`$${p.l}^{${p.k}+1}${p.v}$`, r`$(${p.k}+1)${p.l}${p.v}$`, r`$${p.l}^${p.k}${p.v}$`], false)]],
    ],
    dist: p => [[r`Con $A=\mathrm{diag}(2,3)$ y $v=e_1$: $A^3e_1=8e_1$; luego siempre.`, 'un ejemplo no prueba el caso general'], [r`Como $${p.a}^${p.k}$ es un producto de matrices, no puede actuar como un escalar.`, 'sobre un vector propio sí actúa como $\\lambda^k$']],
    err: p => [['L3', r`Por hipótesis de inducción, $=${p.a}(${p.l}^${p.k}${p.v})=(${p.l}+${p.k})(${p.a}${p.v})$.`, 'error-de-calculo', 'El escalar $\\lambda^k$ sale tal cual; no se suma.'], ['L4', r`Y $${p.a}${p.v}=${p.l}${p.v}$, de modo que $=${p.k}${p.l}${p.v}$.`, 'error-de-calculo', 'Se **multiplican** las potencias: $\\lambda^{k+1}$.']],
    valida: [['induccion', r`Inducción sobre $k$ sacando el escalar`, 'Es la prueba estándar.']],
    idea: p => r`$${p.a}^{${p.k}+1}${p.v}=${p.a}(${p.a}^${p.k}${p.v})$ y un escalar sale de $${p.a}$.`, primero: p => r`comprueba el caso $${p.k}=1$.`,
  });

  R.nivel({
    id: '7.1', mundo: 7, titulo: 'Valores y vectores propios', tema: 'Valores propios, vectores propios y espacios propios',
    habilidades: ['7.1.valores', '7.1.vectores', '7.1.reconocer', '7.1.potencias', '7.1.demostrar'],
    teoremas: ['t.propio-nucleo', 't.propios-distintos-independientes', 't.polinomio-caracteristico-2x2', 't.propios-potencias'],
    leccion: {
      intro: 'Un **vector propio** de $A$ es un $v\\neq0$ que $A$ solo estira o encoge: $Av=\\lambda v$. El factor $\\lambda$ es su **valor propio**. Estos vectores marcan las direcciones donde la matriz se comporta como un número.',
      definiciones: [
        { nombre: 'Cómo hallarlos', tex: '$\\lambda$ es propio si $A-\\lambda I$ no es invertible, es decir $\\det(A-\\lambda I)=0$. Para $2\\times2$: $\\lambda^2-(\\operatorname{tr}A)\\lambda+\\det A=0$. Sus vectores propios son los vectores no nulos de $E_\\lambda=\\ker(A-\\lambda I)$.' },
        { nombre: 'Casos fáciles', tex: 'En una matriz triangular los valores propios son los de la diagonal. La suma de los valores propios es la traza y su producto el determinante.' },
        { nombre: 'Independencia', tex: 'Vectores propios de valores propios distintos son independientes: $n$ valores propios distintos dan $n$ vectores independientes.' },
        { nombre: 'Potencias', tex: 'Si $Av=\\lambda v$, entonces $A^kv=\\lambda^kv$: elevar la matriz solo eleva el valor propio.' },
      ],
      teorema: 't.propio-nucleo',
      ejemplo: { enunciado: 'Halla los valores y vectores propios de $\\begin{pmatrix}2&1\\\\1&2\\end{pmatrix}$.', pasos: ['$\\operatorname{tr}=4$, $\\det=3$: $\\lambda^2-4\\lambda+3=0$, así que $\\lambda=1,3$.', 'Para $\\lambda=3$: $(A-3I)v=0$ da $-x+y=0$, es decir $v=(1,1)$.', 'Para $\\lambda=1$: $x+y=0$, es decir $v=(1,-1)$.'] },
    },
  });

  if (typeof module !== 'undefined') module.exports = AC;
})(globalThis.AC = globalThis.AC || {});
