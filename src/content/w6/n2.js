/* Mundo 6, nivel 6.2 — Núcleo e imagen. */
(function (AC) {
  const { R, H, T, gen, dem2 } = AC.cont, r = String.raw, M = AC.mat, Rat = AC.Rat;
  const ref = (id, tipo, nombre) => R.ref({ id, tipo, nombre });
  ref('d.nucleo-T', 'definicion', 'Núcleo de T: ker T = {v : T(v) = 0}'); ref('d.imagen-T', 'definicion', 'Imagen de T: im T = {T(v) : v ∈ V}');
  ref('d.inyectiva-lineal', 'definicion', 'Inyectiva: T(u) = T(v) implica u = v. Sobreyectiva: im T = W');

  const HB = (id, nombre) => R.habilidad({ id: '6.2.' + id, nombre, nivel: '6.2' });
  HB('nucleo', 'Calcular el núcleo'); HB('imagen', 'Calcular la imagen'); HB('inyectiva', 'Inyectividad y sobreyectividad'); HB('rango-nulidad', 'Teorema de la dimensión'); HB('demostrar', 'Demostrar con núcleo e imagen');
  const TE = (id, titulo, enunciado, requiere, hab) => R.teorema({ id, titulo, nivel: '6.2', enunciado, requiere, habilidades: hab });
  TE('t.nucleo-imagen-subespacios', 'Núcleo e imagen son subespacios', r`$\ker T\subseteq V$ e $\operatorname{im}T\subseteq W$ son subespacios.`, ['t.subespacio-criterio', 't.lineal-cero-opuesto'], ['6.2.nucleo', '6.2.imagen', '6.2.demostrar']);
  TE('t.inyectiva-nucleo', 'Inyectividad y núcleo', r`$T$ es inyectiva si y solo si $\ker T=\{0\}$.`, ['t.lineal-cero-opuesto'], ['6.2.inyectiva', '6.2.nucleo', '6.2.demostrar']);
  TE('t.rango-nulidad', 'Teorema de la dimensión', r`Si $\dim V=n$ es finita, $\dim\ker T+\dim\operatorname{im}T=n$.`, ['t.nucleo-imagen-subespacios', 't.agregar-independiente', 't.dimension-bien-definida'], ['6.2.rango-nulidad', '6.2.imagen', '6.2.demostrar']);
  TE('t.inversa-lineal', 'La inversa es lineal', r`Si $T$ es lineal y biyectiva, $T^{-1}$ es lineal.`, ['t.criterio-lineal'], ['6.2.inyectiva', '6.2.demostrar']);

  const F = M.fmt, strMat = A => A.map(f => f.map(String));
  const rv = (rng, n, lo, hi) => Array.from({ length: n }, () => Rat.of(rng.int(lo, hi)));
  const coord = (f, vars) => { let s = ''; f.forEach((c, j) => { if (c.isZero()) return; const neg = c.cmp(Rat.of(0)) < 0, a = neg ? c.neg() : c, cs = a.eq(Rat.of(1)) ? '' : M.texN(a); s += (s ? (neg ? '-' : '+') : (neg ? '-' : '')) + cs + vars[j]; }); return s || '0'; };
  const VARS = ['x', 'y', 'z', 'w'];
  const formula = A => '(' + A.map(f => coord(f, VARS)).join(',\\ ') + ')';
  const conRango = (rng, m, n, rg) => { const base = Array.from({ length: rg }, () => rv(rng, n, -3, 4)); if (M.rango(base) < rg) return null; const f = base.slice(); while (f.length < m) f.push(M.combina([rng.int(-2, 2), rng.int(-2, 2)], [base[0], base[rg - 1]])); const A = rng.shuffle(f); return M.rango(A) === rg && !A.some(r0 => r0.every(x => x.isZero())) ? M.de(A) : null; };

  /* ---------- generadores ---------- */
  gen.tupla({
    id: 'w6.n2.dim-nucleo-imagen', nivel: '6.2', habilidades: ['6.2.nucleo', '6.2.imagen'], dificultad: 3,
    hacer(rng) {
      const n = rng.int(3, 4), m = rng.int(2, 3), rg = rng.int(1, Math.min(m, n) - (m === n ? 1 : 0)), A = conRango(rng, m, n, rg); if (!A) return null;
      return { key: M.tex(A), enun: 'Sea $T:\\mathbb{R}^' + n + '\\to\\mathbb{R}^' + m + '$, $T(' + VARS.slice(0, n).join(',') + ')=' + formula(A) + '$. Halla $\\dim\\ker T$ y $\\dim\\operatorname{im}T$.', campos: ['dim ker T', 'dim im T'], res: [String(n - rg), String(rg)],
        firmas: [['intercambio', [rg, n - rg], 'El orden es primero el núcleo y luego la imagen.'], ['filas', [n - m, m], 'Las dimensiones se calculan con el **rango**, no con el número de ecuaciones.']].filter(f => f[1].join() !== [n - rg, rg].join()),
        pistas: ['Orientación: la matriz de $T$ tiene por filas los coeficientes.', 'Idea clave: $\\dim\\operatorname{im}T=\\operatorname{rango}$ y $\\dim\\ker T=n-\\operatorname{rango}$.', 'Primer paso: escalona la matriz y cuenta pivotes.'], expl: '$\\dim\\ker T=' + (n - rg) + '$ y $\\dim\\operatorname{im}T=' + rg + '$.' };
    },
  });

  gen.matriz({
    id: 'w6.n2.base-del-nucleo', nivel: '6.2', habilidades: ['6.2.nucleo'], dificultad: 3,
    hacer(rng) {
      const n = rng.int(3, 4), m = rng.int(1, 2), rg = rng.int(1, Math.min(m, n - 1)), A = conRango(rng, m, n, rg); if (!A) return null; const N = M.nucleo(A), dim = n - rg, jj = Array.from({ length: n }, (_, j) => j).find(j => A.some(f => !f[j].isZero()));
      return { key: M.tex(A) + n, enun: 'Sea $T(' + VARS.slice(0, n).join(',') + ')=' + formula(A) + '$. Halla una **base** de $\\ker T$ (escribe los ' + dim + ' vectores como filas).', res: F(N), etiqueta: 'base', verificador: { id: 'base-nucleo', args: { A: strMat(A), dim, n } },
        firmas: [['dependientes', F(Array.from({ length: dim }, () => N[0])), 'Los vectores deben ser **independientes**.'], ['fuera', F(N.map((v, i) => (i === 0 ? v.map((x, j) => (j === jj ? x.add(Rat.of(1)) : x)) : v))), 'Uno de los vectores no cumple $T(v)=0$.']].filter(f => JSON.stringify(f[1]) !== JSON.stringify(F(N))),
        pistas: ['Orientación: $\\ker T$ son las soluciones de $T(v)=0$.', 'Idea clave: cada variable libre da un vector de la base.', 'Primer paso: escribe el sistema homogéneo y escalónalo.'], expl: 'Una base posible es $' + F(N).map(f => '(' + f.join(',') + ')').join(',\\ ') + '$.' };
    },
  });

  gen.eleccion({
    id: 'w6.n2.en-la-imagen', nivel: '6.2', habilidades: ['6.2.imagen'], dificultad: 3,
    hacer(rng) {
      const A = conRango(rng, 3, 3, 2); if (!A) return null; const cols = M.T(A), x = rv(rng, 3, -2, 3), w = M.aVec(M.mul(A, M.colVec(x))); if (w.every(z => z.isZero())) return null;
      const malos = []; for (let k = 0; k < 60 && malos.length < 3; k++) { const c = rv(rng, 3, -3, 3); if (!M.enGenerado(cols, c) && !malos.some(m => m.join() === c.join())) malos.push(c); } if (malos.length < 3) return null; const fv = v => '$(' + v.join(',') + ')$';
      return { key: M.tex(A) + w.join(), enun: 'Sea $T(x,y,z)=' + formula(A) + '$. ¿Cuál de estos vectores pertenece a $\\operatorname{im}T$?', ok: fv(w), malas: malos.map((c, i) => ['no-esta-' + i, fv(c), 'El sistema $T(v)=' + fv(c).slice(1, -1) + '$ es incompatible: no está en la imagen.']),
        pistas: ['Orientación: $w\\in\\operatorname{im}T$ si existe $v$ con $T(v)=w$.', 'Idea clave: es un sistema lineal; decide si es compatible (Rouché-Capelli).', 'Primer paso: escribe $T(v)=w$ como sistema y escalona.'], expl: 'Solo uno da un sistema compatible.' };
    },
  });

  gen.eleccion({
    id: 'w6.n2.inyectiva-sobre', nivel: '6.2', habilidades: ['6.2.inyectiva', '6.2.rango-nulidad'], dificultad: 3,
    hacer(rng) {
      const n = rng.int(2, 4), m = rng.int(2, 4), rg = rng.int(1, Math.min(m, n)), A = conRango(rng, m, n, rg); if (!A) return null; const inj = rg === n, sob = rg === m;
      const o = { ii: 'inyectiva y sobreyectiva', is: 'inyectiva pero no sobreyectiva', si: 'sobreyectiva pero no inyectiva', no: 'ni inyectiva ni sobreyectiva' }, c = inj && sob ? 'ii' : inj ? 'is' : sob ? 'si' : 'no';
      return { key: M.tex(A) + n + m, enun: 'La transformación $T:\\mathbb{R}^' + n + '\\to\\mathbb{R}^' + m + '$, $T(' + VARS.slice(0, n).join(',') + ')=' + formula(A) + '$, es:', ok: o[c], malas: Object.keys(o).filter(k => k !== c).map(k => ['otra-' + k, o[k], 'Calcula el rango $' + rg + '$: es inyectiva si el rango es $' + n + '$ y sobreyectiva si es $' + m + '$.']),
        pistas: ['Orientación: usa el rango de la matriz.', 'Idea clave: inyectiva $\\iff\\ker T=\\{0\\}\\iff\\operatorname{rango}=n$; sobreyectiva $\\iff\\operatorname{rango}=m$.', 'Primer paso: escalona la matriz.'], expl: 'Rango $' + rg + '$: ' + o[c] + '.' };
    },
  });

  gen.entero({
    id: 'w6.n2.rango-nulidad', nivel: '6.2', habilidades: ['6.2.rango-nulidad'], dificultad: 2,
    hacer(rng) {
      const n = rng.int(3, 9), k = rng.int(0, n), pide = rng.pick(['imagen', 'nucleo', 'espacio']);
      if (pide === 'imagen') return { key: 'i' + n + k, enun: 'Una transformación lineal $T:V\\to W$ con $\\dim V=' + n + '$ tiene $\\dim\\ker T=' + k + '$. ¿Cuánto vale $\\dim\\operatorname{im}T$?', res: n - k, firmas: [['suma', n + k, 'La relación es $\\dim\\ker T+\\dim\\operatorname{im}T=\\dim V$: se resta.'], ['nucleo', k, 'Ese es el dato; se pide la dimensión de la imagen.']].filter(f => f[1] !== n - k), pistas: ['Orientación: teorema de la dimensión.', 'Idea clave: $\\dim\\operatorname{im}T=\\dim V-\\dim\\ker T$.', 'Primer paso: resta.'], expl: '$' + n + '-' + k + '=' + (n - k) + '$.' };
      if (pide === 'nucleo') return { key: 'n' + n + k, enun: 'Una transformación lineal $T:\\mathbb{R}^' + n + '\\to\\mathbb{R}^m$ tiene rango $' + (n - k) + '$. ¿Cuánto vale $\\dim\\ker T$?', res: k, firmas: [['rango', n - k, 'Ese es el rango; se pide la dimensión del núcleo.'], ['suma', n + (n - k), 'Se resta: $\\dim\\ker=n-\\operatorname{rango}$.']].filter(f => f[1] !== k), pistas: ['Orientación: teorema de la dimensión.', 'Idea clave: $\\dim\\ker T=n-\\operatorname{rango}$.', 'Primer paso: resta.'], expl: '$' + n + '-' + (n - k) + '=' + k + '$.' };
      return { key: 'e' + n + k, enun: 'Una transformación lineal $T$ con $\\dim\\ker T=' + k + '$ y $\\dim\\operatorname{im}T=' + (n - k) + '$ está definida en un espacio $V$. ¿Cuánto vale $\\dim V$?', res: n, firmas: [['solo-imagen', n - k, 'Falta sumar la dimensión del núcleo.'], ['diferencia', Math.abs(n - 2 * k), 'Se **suman** las dos dimensiones.']].filter(f => f[1] !== n), pistas: ['Orientación: teorema de la dimensión.', 'Idea clave: $\\dim V=\\dim\\ker T+\\dim\\operatorname{im}T$.', 'Primer paso: suma.'], expl: '$' + k + '+' + (n - k) + '=' + n + '$.' };
    },
  });

  gen.tupla({
    id: 'w6.n2.vector-del-nucleo', nivel: '6.2', habilidades: ['6.2.nucleo'], dificultad: 2,
    hacer(rng) {
      const n = rng.int(3, 4), A = conRango(rng, 2, n, rng.int(1, 2)); if (!A || n - M.rango(A) < 1) return null; const N = M.nucleo(A), vars = ['x', 'y', 'z', 'w'].slice(0, n);
      return { key: M.tex(A) + n, enun: 'Sea $T(' + vars.join(',') + ')=' + formula(A) + '$. Escribe un vector **no nulo** de $\\ker T$.', campos: vars, res: F([N[0]])[0], verificador: { id: 'nucleo-vector', args: { A: strMat(A), n } },
        firmas: [['cero', Array(n).fill('0'), 'El cero siempre está en el núcleo: busca uno distinto de cero.'], ['fila', A[0].map(String), 'Ese vector (una fila de coeficientes) no se anula al aplicar $T$.']].filter(g => g[0] === 'cero' || M.evaluaSistema(A, g[1].map(x => Rat.parse(x))).some(z => !z.isZero())),
        pistas: ['Orientación: resuelve $T(v)=0$.', 'Idea clave: da valor $1$ a una variable libre y despeja las demás.', 'Primer paso: escalona la matriz de coeficientes.'], expl: 'Por ejemplo $' + par(F([N[0]])[0]) + '$.' };
    },
  });
  const par = v => '(' + v.join(',') + ')';

  gen.entero({
    id: 'w6.n2.derivada-contexto', nivel: '6.2', habilidades: ['6.2.rango-nulidad', '6.2.nucleo', '6.2.imagen'], dificultad: 3,
    hacer(rng) {
      const n = rng.int(3, 14), k = rng.int(1, 3), pide = rng.pick(['nucleo', 'imagen']), dk = k === 1 ? '\\frac{d}{dx}' : k === 2 ? '\\frac{d^2}{dx^2}' : '\\frac{d^3}{dx^3}', ker = k, im = n + 1 - k;
      return { key: [n, k, pide].join(), enun: 'Sea $T=' + dk + ':P_' + n + '\\to P_' + n + '$ sobre los polinomios de grado $\\le' + n + '$. ¿Cuánto vale $\\dim' + (pide === 'nucleo' ? '\\ker ' : '\\operatorname{im}') + 'T$?', res: pide === 'nucleo' ? ker : im,
        firmas: [['intercambio', pide === 'nucleo' ? im : ker, 'Revisa: el núcleo son los polinomios de grado $<' + k + '$ y la imagen $P_{' + (n - k) + '}$.'], ['dim-total', n + 1, 'Esa es $\\dim P_' + n + '$; el núcleo y la imagen suman eso.']].filter(f => f[1] !== (pide === 'nucleo' ? ker : im)),
        pistas: ['Orientación: ¿qué polinomios se anulan al derivar $' + k + '$ veces?', 'Idea clave: el núcleo son los polinomios de grado $<' + k + '$ (dimensión $' + k + '$); teorema de la dimensión para la imagen.', 'Primer paso: $\\dim P_' + n + '=' + (n + 1) + '$.'], expl: '$\\dim\\ker T=' + ker + '$, $\\dim\\operatorname{im}T=' + im + '$.' };
    },
  });

  /* ---------- demostraciones ---------- */
  dem2({
    id: 'dem.nucleo-imagen-subespacios', teorema: 't.nucleo-imagen-subespacios', nivel: '6.2', habilidades: ['6.2.nucleo', '6.2.imagen', '6.2.demostrar'], requiere: ['t.subespacio-criterio', 't.lineal-cero-opuesto'], refsExtra: ['d.nucleo-T', 'd.imagen-T', 'd.lineal'],
    param: rng => ({ t: rng.pick(['T', 'L']), u: rng.pick(['u', 'x']), v: rng.pick(['v', 'y']), c: rng.pick(['c', 'λ']) }),
    enunciado: p => r`Demuestra que si $${p.t}:V\to W$ es lineal, $\ker ${p.t}$ e $\operatorname{im}${p.t}$ son subespacios.`,
    hip: p => [r`$${p.t}$ es lineal`, 'Puedes citar el criterio del subespacio y que $T(0)=0$'], meta: p => r`$\ker ${p.t}$ e $\operatorname{im}${p.t}$ son subespacios`,
    L: p => [
      ['L1', r`$\ker ${p.t}$: como $${p.t}(0)=0$, $0\in\ker ${p.t}$ (no vacío).`, 't.lineal-cero-opuesto'],
      ['L2', r`Si $${p.u},${p.v}\in\ker ${p.t}$, $${p.t}(${p.u}+${p.v})=${p.t}(${p.u})+${p.t}(${p.v})=0$ y $${p.t}(${p.c}${p.u})=${p.c}${p.t}(${p.u})=0$: cerrado bajo suma y escalares.`, 'd.nucleo-T', ['L1']],
      ['L3', r`$\operatorname{im}${p.t}$: $0=${p.t}(0)\in\operatorname{im}${p.t}$. Si $w_1=${p.t}(${p.u})$ y $w_2=${p.t}(${p.v})$, entonces $w_1+w_2=${p.t}(${p.u}+${p.v})$ y $${p.c}w_1=${p.t}(${p.c}${p.u})$ están en la imagen por ⟦h1⟧.`, 'd.imagen-T', ['L1'], [H('h1', 'linealidad', ['linealidad', 'inyectividad', 'sobreyectividad'], false)]],
      ['L4', r`Por el criterio del subespacio, ambos son subespacios. ∎`, 't.subespacio-criterio', ['L2', 'L3']],
    ],
    dist: p => [[r`Con $${p.t}(x,y)=x$ el núcleo es el eje $y$ y la imagen $\mathbb{R}$; luego siempre.`, 'un ejemplo no prueba el caso general'], [r`Como $\ker ${p.t}\subseteq V$, hereda ser subespacio.`, 'un subconjunto no siempre es subespacio']],
    err: p => [['L2', r`Si $${p.u},${p.v}\in\ker ${p.t}$, $${p.t}(${p.u}+${p.v})=${p.t}(${p.u})\cdot ${p.t}(${p.v})=0$.`, 'error-de-calculo', 'La linealidad da una **suma**.'], ['L3', r`$w_1+w_2=${p.t}(${p.u})+${p.t}(${p.v})=${p.t}(${p.u}\cdot ${p.v})$.`, 'error-de-calculo', 'Es $T(u+v)$, no un producto.']],
    valida: [['criterio', r`Aplicar el criterio del subespacio a cada uno`, 'Es la prueba estándar.']],
    idea: p => r`la linealidad lleva sumas y escalares dentro y fuera.`, primero: p => r`comprueba que el cero está en ambos.`,
  });

  dem2({
    id: 'dem.inyectiva-nucleo', teorema: 't.inyectiva-nucleo', nivel: '6.2', habilidades: ['6.2.inyectiva', '6.2.nucleo', '6.2.demostrar'], requiere: ['t.lineal-cero-opuesto'], refsExtra: ['d.inyectiva-lineal', 'd.nucleo-T', 'b.doble-implicacion'],
    param: rng => ({ t: rng.pick(['T', 'L']), u: rng.pick(['u', 'x']), v: rng.pick(['v', 'y']) }),
    enunciado: p => r`Demuestra que una transformación lineal $${p.t}$ es inyectiva si y solo si $\ker ${p.t}=\{0\}$.`,
    hip: p => [r`$${p.t}$ es lineal`, 'Puedes citar que $T(0)=0$'], meta: p => r`inyectiva $\iff\ker ${p.t}=\{0\}$`,
    L: p => [
      ['L1', r`(⇒) Si $${p.t}$ es inyectiva y $${p.v}\in\ker ${p.t}$, entonces $${p.t}(${p.v})=0=${p.t}(0)$, así que $${p.v}=0$.`, 't.lineal-cero-opuesto'],
      ['L2', r`(⇐) Supongamos $\ker ${p.t}=\{0\}$ y $${p.t}(${p.u})=${p.t}(${p.v})$.`, 'd.nucleo-T'],
      ['L3', r`Por linealidad, $${p.t}(${p.u}-${p.v})=${p.t}(${p.u})-${p.t}(${p.v})=0$, es decir, $${p.u}-${p.v}\in\ker ${p.t}$.`, 'd.lineal', ['L2']],
      ['L4', r`Como el núcleo es $\{0\}$, $${p.u}-${p.v}=0$ y por tanto ⟦h1⟧. Así $${p.t}$ es inyectiva. ∎`, 'd.inyectiva-lineal', ['L3'], [H('h1', r`$${p.u}=${p.v}$`, [r`$${p.u}=${p.v}$`, r`$${p.u}=0$`, r`$${p.t}=0$`], false)]],
    ],
    dist: p => [[r`Con $${p.t}(x)=2x$ se cumple; luego siempre.`, 'un ejemplo no prueba el caso general'], [r`Como $${p.t}(0)=0$, el núcleo es $\{0\}$.`, 'el cero siempre está; el núcleo podría ser mayor']],
    err: p => [['L1', r`Si $${p.v}\in\ker ${p.t}$, entonces $${p.t}(${p.v})=0=${p.t}(0)$, así que $${p.v}\neq0$.`, 'conclusion-invalida', 'Por inyectividad $v=0$.'], ['L3', r`Por linealidad, $${p.t}(${p.u}-${p.v})=${p.t}(${p.u})+${p.t}(${p.v})=0$.`, 'error-de-calculo', 'La resta de imágenes.']],
    valida: [['doble', r`Probar las dos implicaciones usando $T(u-v)=T(u)-T(v)$`, 'Es la prueba estándar.']],
    idea: p => r`$${p.t}(${p.u})=${p.t}(${p.v})$ equivale a $${p.u}-${p.v}\in\ker ${p.t}$.`, primero: p => r`prueba (⇒) con $${p.t}(0)=0$.`,
  });

  dem2({
    id: 'dem.rango-nulidad', teorema: 't.rango-nulidad', nivel: '6.2', habilidades: ['6.2.rango-nulidad', '6.2.imagen', '6.2.demostrar'], requiere: ['t.nucleo-imagen-subespacios', 't.agregar-independiente', 't.dimension-bien-definida'], refsExtra: ['d.base', 'd.nucleo-T', 'd.imagen-T', 'd.independencia'],
    param: rng => ({ t: rng.pick(['T', 'L']), k: rng.pick(['k', 'a']), v: rng.pick(['v', 'w']), n: rng.pick(['n', 'm']) }),
    enunciado: p => r`Sea $${p.t}:V\to W$ lineal con $\dim V=${p.n}$. Demuestra que $\dim\ker ${p.t}+\dim\operatorname{im}${p.t}=${p.n}$.`,
    hip: p => [r`$\dim V=${p.n}$ finita y $${p.t}$ lineal`, 'Puedes citar que el núcleo es subespacio, que una lista independiente se extiende a una base y que la dimensión está bien definida'], meta: p => r`$\dim\ker ${p.t}+\dim\operatorname{im}${p.t}=${p.n}$`,
    L: p => [
      ['L1', r`$\ker ${p.t}$ es un subespacio; sea $(${p.k}_1,\dots,${p.k}_p)$ una base suya. Es una lista independiente de $V$.`, 't.nucleo-imagen-subespacios'],
      ['L2', r`Extendemos esa lista a una base $(${p.k}_1,\dots,${p.k}_p,${p.v}_1,\dots,${p.v}_q)$ de $V$, con $p+q=${p.n}$.`, 't.agregar-independiente', ['L1']],
      ['L3', r`Generan la imagen: para $x=\sum a_i${p.k}_i+\sum b_j${p.v}_j$, $${p.t}(x)=\sum b_j${p.t}(${p.v}_j)$ porque $${p.t}(${p.k}_i)=0$.`, 'd.imagen-T', ['L2']],
      ['L4', r`Son independientes: si $\sum c_j${p.t}(${p.v}_j)=0$, entonces $\sum c_j${p.v}_j\in\ker ${p.t}$, o sea $=\sum d_i${p.k}_i$; como la lista completa es independiente, ⟦h1⟧.`, 'd.independencia', ['L3'], [H('h1', r`todos los $c_j=0$`, [r`todos los $c_j=0$`, r`todos los $d_i=1$`, r`$q=0$`], false)]],
      ['L5', r`Luego $(${p.t}(${p.v}_j))$ es base de $\operatorname{im}${p.t}$ y $\dim\operatorname{im}${p.t}=q$. Entonces $\dim\ker ${p.t}+\dim\operatorname{im}${p.t}=p+q=${p.n}$ (la dimensión está bien definida). ∎`, 't.dimension-bien-definida', ['L2', 'L4']],
    ],
    dist: p => [[r`Con $${p.t}(x,y)=x$: $1+1=2$; luego siempre.`, 'un ejemplo no prueba el caso general'], [r`Como el núcleo y la imagen son subespacios de $V$, sus dimensiones suman $\dim V$.`, 'la imagen vive en $W$, no en $V$; hay que probarlo']],
    err: p => [['L2', r`Extendemos a una base con $p+q=${p.n}+1$ elementos.`, 'error-de-calculo', 'La base de $V$ tiene $n$ elementos.'], ['L3', r`Para $x=\sum a_i${p.k}_i+\sum b_j${p.v}_j$, $${p.t}(x)=\sum a_i${p.t}(${p.k}_i)$.`, 'error-de-calculo', 'Los $T(k_i)$ valen cero: quedan los términos con $v_j$.']],
    valida: [['base', r`Extender una base del núcleo y probar que las imágenes de los nuevos vectores son base de la imagen`, 'Es la prueba estándar.']],
    idea: p => r`los vectores que se añaden al núcleo van a una base de la imagen.`, primero: p => r`toma una base del núcleo.`,
  });

  dem2({
    id: 'dem.inversa-lineal', teorema: 't.inversa-lineal', nivel: '6.2', habilidades: ['6.2.inyectiva', '6.2.demostrar'], requiere: ['t.criterio-lineal'], refsExtra: ['d.lineal', 'd.inyectiva-lineal', 'b.arbitrario'],
    param: rng => ({ t: rng.pick(['T', 'L']), u: rng.pick(['w_1', 'p']), v: rng.pick(['w_2', 'q']) }),
    enunciado: p => r`Sea $${p.t}:V\to W$ lineal y biyectiva. Demuestra que $${p.t}^{-1}:W\to V$ es lineal.`,
    hip: p => [r`$${p.t}$ lineal y biyectiva`, 'Puedes usar el criterio de linealidad'], meta: p => r`$${p.t}^{-1}$ es lineal`,
    L: p => [
      ['L1', r`Sean $${p.u},${p.v}\in W$ y $a,b$ escalares. Basta probar $${p.t}^{-1}(a${p.u}+b${p.v})=a${p.t}^{-1}(${p.u})+b${p.t}^{-1}(${p.v})$.`, 't.criterio-lineal'],
      ['L2', r`Aplicamos $${p.t}$ al miembro derecho: $${p.t}(a${p.t}^{-1}(${p.u})+b${p.t}^{-1}(${p.v}))=a${p.t}(${p.t}^{-1}(${p.u}))+b${p.t}(${p.t}^{-1}(${p.v}))=a${p.u}+b${p.v}$.`, 'd.lineal', ['L1']],
      ['L3', r`Entonces $a${p.t}^{-1}(${p.u})+b${p.t}^{-1}(${p.v})$ es un vector que $${p.t}$ envía a $a${p.u}+b${p.v}$.`, 'b.arbitrario', ['L2']],
      ['L4', r`Como $${p.t}$ es ⟦h1⟧, el único vector que $${p.t}$ envía a $a${p.u}+b${p.v}$ es $${p.t}^{-1}(a${p.u}+b${p.v})$: coinciden. ∎`, 'd.inyectiva-lineal', ['L3'], [H('h1', 'inyectiva', ['inyectiva', 'nula', 'constante'], false)]],
    ],
    dist: p => [[r`Con $${p.t}(x)=2x$ la inversa $x/2$ es lineal; luego siempre.`, 'un ejemplo no prueba el caso general'], [r`Como la inversa de una función lineal es lineal por definición.`, 'hay que probarlo']],
    err: p => [['L2', r`$${p.t}(a${p.t}^{-1}(${p.u})+b${p.t}^{-1}(${p.v}))=${p.t}(a)${p.u}+${p.t}(b)${p.v}$.`, 'error-de-calculo', '$T$ actúa sobre vectores.'], ['L4', r`Como $${p.t}$ es sobreyectiva, el único vector enviado a $a${p.u}+b${p.v}$ es $${p.t}^{-1}(a${p.u}+b${p.v})$.`, 'conclusion-invalida', 'La **unicidad** viene de la inyectividad.']],
    valida: [['criterio', r`Verificar la identidad del criterio aplicando $T$ y usando inyectividad`, 'Es la prueba estándar.']],
    idea: p => r`$T$ envía $a${p.t}^{-1}(${p.u})+b${p.t}^{-1}(${p.v})$ a $a${p.u}+b${p.v}$.`, primero: p => r`aplica $${p.t}$ al candidato.`,
  });

  R.nivel({
    id: '6.2', mundo: 6, titulo: 'Núcleo e imagen', tema: 'Núcleo, imagen, inyectividad y el teorema de la dimensión',
    habilidades: ['6.2.nucleo', '6.2.imagen', '6.2.inyectiva', '6.2.rango-nulidad', '6.2.demostrar'],
    teoremas: ['t.nucleo-imagen-subespacios', 't.inyectiva-nucleo', 't.rango-nulidad', 't.inversa-lineal'],
    leccion: {
      intro: 'El **núcleo** de $T$ son los vectores que $T$ aplasta a cero; la **imagen**, todo lo que $T$ alcanza. Los dos son subespacios y sus dimensiones están ligadas.',
      definiciones: [
        { nombre: 'Núcleo e imagen', tex: '$\\ker T=\\{v:T(v)=0\\}\\subseteq V$ e $\\operatorname{im}T=\\{T(v)\\}\\subseteq W$. Para $T(x)=Ax$: $\\ker T=\\ker A$ e $\\operatorname{im}T$ es el generado por las columnas de $A$.' },
        { nombre: 'Inyectividad', tex: '$T$ es inyectiva $\\iff\\ker T=\\{0\\}$. Sobreyectiva $\\iff\\operatorname{im}T=W$. Para $T:\\mathbb{R}^n\\to\\mathbb{R}^m$ de rango $r$: inyectiva si $r=n$, sobreyectiva si $r=m$.' },
        { nombre: 'Teorema de la dimensión', tex: '$\\dim\\ker T+\\dim\\operatorname{im}T=\\dim V$ (nulidad $+$ rango $=n$).' },
        { nombre: 'Inversa', tex: 'Si $T$ es lineal y biyectiva, $T^{-1}$ es lineal.' },
      ],
      teorema: 't.rango-nulidad',
      ejemplo: { enunciado: 'Sea $T(x,y,z)=(x+y,\\ y+z)$. Halla $\\dim\\ker T$ y $\\dim\\operatorname{im}T$.', pasos: ['La matriz es $\\begin{pmatrix}1&1&0\\\\0&1&1\\end{pmatrix}$, de rango $2$.', 'Luego $\\dim\\operatorname{im}T=2$ (toda $\\mathbb{R}^2$).', '$\\dim\\ker T=3-2=1$ (generado por $(1,-1,1)$).'] },
    },
  });

  if (typeof module !== 'undefined') module.exports = AC;
})(globalThis.AC = globalThis.AC || {});
