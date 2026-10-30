/* Mundo 8, nivel 8.3 — Homomorfismos de grupos. */
(function (AC) {
  const { R, H, T, gen, dem2 } = AC.cont, r = String.raw, G = AC.grupos, N = AC.numth, C = AC.conj;
  const ref = (id, tipo, nombre) => R.ref({ id, tipo, nombre });
  ref('d.homomorfismo', 'definicion', 'Homomorfismo: φ(a∗b) = φ(a)∘φ(b); núcleo ker φ = {a : φ(a) = e}; imagen im φ = φ(G)');
  ref('d.biyeccion-clases', 'definicion', 'Las clases laterales de ker φ se corresponden uno a uno con los elementos de im φ');

  const HB = (id, nombre) => R.habilidad({ id: '8.3.' + id, nombre, nivel: '8.3' });
  HB('reconocer', 'Reconocer homomorfismos'); HB('nucleo-imagen', 'Núcleo e imagen'); HB('ordenes', 'Órdenes y homomorfismos'); HB('contar', 'Contar homomorfismos'); HB('demostrar', 'Demostrar con homomorfismos');
  const TE = (id, titulo, enunciado, requiere, hab) => R.teorema({ id, titulo, nivel: '8.3', enunciado, requiere, habilidades: hab });
  TE('t.hom-identidad-inverso', 'Neutro e inversos', r`Si $\varphi$ es homomorfismo, $\varphi(e)=e$ y $\varphi(a^{-1})=\varphi(a)^{-1}$.`, ['t.grupo-cancelacion', 't.grupo-unicidad'], ['8.3.reconocer', '8.3.demostrar']);
  TE('t.nucleo-subgrupo', 'Núcleo e imagen son subgrupos', r`$\ker\varphi\le G$ e $\operatorname{im}\varphi\le H$; además $\varphi$ es inyectivo si y solo si $\ker\varphi=\{e\}$.`, ['t.hom-identidad-inverso', 't.subgrupo-criterio'], ['8.3.nucleo-imagen', '8.3.reconocer', '8.3.demostrar']);
  TE('t.orden-ker-im', 'Orden de G, núcleo e imagen', r`Si $G$ es finito, $|G|=|\ker\varphi|\cdot|\operatorname{im}\varphi|$.`, ['t.lagrange', 't.nucleo-subgrupo'], ['8.3.nucleo-imagen', '8.3.ordenes', '8.3.demostrar']);
  TE('t.orden-hom-divide', 'Órdenes que respeta un homomorfismo', r`$|\operatorname{im}\varphi|$ divide a $\gcd(|G|,|H|)$ y $\operatorname{ord}(\varphi(g))$ divide a $\operatorname{ord}(g)$.`, ['t.orden-ker-im', 't.lagrange'], ['8.3.ordenes', '8.3.contar', '8.3.demostrar']);

  const dts = N.divisores, gcd = N.gcd;
  /* φ: ℤₙ → ℤₘ, x ↦ kx; está bien definido (y es homomorfismo) si y solo si m | nk */
  const bien = (n, m, k) => (n * k) % m === 0;
  const nucleo = (n, m, k) => { const o = []; for (let x = 0; x < n; x++) if ((k * x) % m === 0) o.push(x); return o; };
  const imagen = (n, m, k) => [...new Set(Array.from({ length: n }, (_, x) => (k * x) % m))].sort((a, b) => a - b);

  /* ---------- generadores ---------- */
  gen.multiple({
    id: 'w8.n3.cuales-homomorfismos', nivel: '8.3', habilidades: ['8.3.reconocer'], dificultad: 3,
    hacer(rng) {
      const m = rng.pick([6, 8, 9, 10, 12]), n = rng.pick([4, 6, 9, 12]), ks = []; for (let k = 1; k < m && ks.length < 8; k++) ks.push(k);
      const buenos = ks.filter(k => bien(n, m, k)), malos = ks.filter(k => !bien(n, m, k)); if (!buenos.length || malos.length < 2) return null;
      const si = rng.sample(buenos, Math.min(rng.int(1, 2), buenos.length)), no = rng.sample(malos, Math.min(rng.int(2, 3), malos.length)), ops = rng.shuffle(si.map(k => ({ k, ok: true })).concat(no.map(k => ({ k, ok: false })))), ok = ops.map((o, i) => (o.ok ? i : -1)).filter(i => i >= 0);
      return { key: n + ',' + m + ',' + ops.map(o => o.k).join(), enun: 'Considera $\\varphi:\\mathbb{Z}_{' + n + '}\\to\\mathbb{Z}_{' + m + '}$ dada por $\\varphi(x)=kx\\bmod ' + m + '$. Marca los valores de $k$ para los que $\\varphi$ está bien definida y es un **homomorfismo**.', opciones: ops.map(o => '$k=' + o.k + '$'), ok,
        msg: (j, es) => es ? 'Sí: $' + n + 'k=' + n * ops[j].k + '$ es múltiplo de $' + m + '$, así que $\\varphi(x+' + n + ')=\\varphi(x)$.' : 'No: $' + n + 'k=' + n * ops[j].k + '$ no es múltiplo de $' + m + '$; $\\varphi(0)\\neq\\varphi(' + n + ')$ y la función no está bien definida.',
        pistas: ['Orientación: $\\varphi$ debe ser independiente del representante: $\\varphi(x+' + n + ')=\\varphi(x)$.', 'Idea clave: eso ocurre si y solo si $' + m + '$ divide a $' + n + 'k$.', 'Primer paso: calcula $' + n + 'k$ para cada opción.'], expl: 'Sirven los $k$ con $' + m + '\\mid ' + n + 'k$.' };
    },
  });

  gen.entero({
    id: 'w8.n3.tamano-nucleo', nivel: '8.3', habilidades: ['8.3.nucleo-imagen'], dificultad: 3,
    hacer(rng) {
      const n = rng.pick([12, 15, 18, 20, 24, 30, 36]), m = rng.pick([6, 8, 9, 10, 12, 14, 15]), ks = []; for (let k = 1; k < m; k++) if (bien(n, m, k) && imagen(n, m, k).length > 1) ks.push(k); if (!ks.length) return null; const k = rng.pick(ks), sz = nucleo(n, m, k).length, im = imagen(n, m, k).length;
      return { key: [n, m, k].join(), enun: 'El homomorfismo $\\varphi:\\mathbb{Z}_{' + n + '}\\to\\mathbb{Z}_{' + m + '}$, $\\varphi(x)=' + k + 'x\\bmod ' + m + '$, está bien definido. ¿Cuántos elementos tiene $\\ker\\varphi$?', res: sz,
        firmas: [['imagen', im, 'Ese es $|\\operatorname{im}\\varphi|$; se pide el núcleo ($|\\ker|=|G|/|\\operatorname{im}|$).'], ['uno', 1, 'El núcleo siempre contiene al $0$, pero aquí tiene más elementos.']].filter(f => f[1] !== sz),
        pistas: ['Orientación: $\\ker\\varphi=\\{x:' + k + 'x\\equiv0\\pmod{' + m + '}\\}$.', 'Idea clave: $|G|=|\\ker|\\cdot|\\operatorname{im}|$.', 'Primer paso: calcula $|\\operatorname{im}\\varphi|$ (cuántos valores distintos toma).'], expl: '$|\\ker\\varphi|=' + sz + '$ ($|\\operatorname{im}|=' + im + '$).' };
    },
  });

  gen.entero({
    id: 'w8.n3.tamano-imagen', nivel: '8.3', habilidades: ['8.3.nucleo-imagen', '8.3.ordenes'], dificultad: 3,
    hacer(rng) {
      const n = rng.pick([12, 15, 18, 20, 24, 30, 36]), m = rng.pick([6, 8, 9, 10, 12, 14, 15]), k = rng.int(1, m - 1); if (!bien(n, m, k)) return null; const nu = nucleo(n, m, k).length, im = imagen(n, m, k).length; if (im === 1) return null;
      return { key: [n, m, k].join(), enun: 'Para $\\varphi:\\mathbb{Z}_{' + n + '}\\to\\mathbb{Z}_{' + m + '}$, $\\varphi(x)=' + k + 'x\\bmod ' + m + '$ (homomorfismo), sabemos que $|\\ker\\varphi|=' + nu + '$. ¿Cuánto vale $|\\operatorname{im}\\varphi|$?', res: im,
        firmas: [['nucleo', nu, 'Ese es el dato; la imagen cumple $|\\operatorname{im}|=|G|/|\\ker|$.'], ['m', m, 'Esa es $|\\mathbb{Z}_' + m + '|$; la imagen puede ser un subgrupo propio.']].filter(f => f[1] !== im),
        pistas: ['Orientación: $|G|=|\\ker\\varphi|\\cdot|\\operatorname{im}\\varphi|$.', 'Idea clave: despeja $|\\operatorname{im}\\varphi|=|G|/|\\ker\\varphi|$.', 'Primer paso: divide $' + n + '$ entre $' + nu + '$.'], expl: '$' + n + '/' + nu + '=' + im + '$.' };
    },
  });

  gen.entero({
    id: 'w8.n3.parametro-hom', nivel: '8.3', habilidades: ['8.3.reconocer', '8.3.contar'], dificultad: 3,
    hacer(rng) {
      const n = rng.int(4, 30), m = rng.int(4, 30), g = gcd(n, m), k = m / g; if (g === 1 || g === m) return null;
      return { key: n + ',' + m, enun: '¿Cuál es el **menor** $k\\ge1$ para el que $\\varphi:\\mathbb{Z}_{' + n + '}\\to\\mathbb{Z}_{' + m + '}$, $\\varphi(x)=kx\\bmod ' + m + '$, es un homomorfismo bien definido?', res: k,
        firmas: [['uno', 1, 'Con $k=1$ se necesitaría $' + m + '\\mid ' + n + '$.'], ['mcd', g, 'Ese es $\\gcd(' + n + ',' + m + ')$; la condición es $' + m + '\\mid ' + n + 'k$, es decir $k$ múltiplo de $' + m + '/\\gcd$.']].filter(f => f[1] !== k),
        pistas: ['Orientación: debe cumplirse $' + m + '\\mid ' + n + 'k$.', 'Idea clave: $k$ debe ser múltiplo de $' + m + '/\\gcd(' + n + ',' + m + ')$.', 'Primer paso: calcula $\\gcd(' + n + ',' + m + ')=' + g + '$.'], expl: '$k=' + m + '/' + g + '=' + k + '$.' };
    },
  });

  gen.conjunto({
    id: 'w8.n3.nucleo-conjunto', nivel: '8.3', habilidades: ['8.3.nucleo-imagen'], dificultad: 2,
    hacer(rng) {
      const n = rng.pick([12, 15, 18, 20, 24, 30]), m = rng.pick([6, 8, 9, 10, 12, 14, 15]), k = rng.int(1, m - 1); if (!bien(n, m, k)) return null; const nu = nucleo(n, m, k); if (nu.length < 2 || nu.length > 10 || nu.length === n) return null; const res = nu.map(String);
      return { key: [n, m, k].join(), enun: 'Para el homomorfismo $\\varphi:\\mathbb{Z}_{' + n + '}\\to\\mathbb{Z}_{' + m + '}$, $\\varphi(x)=' + k + 'x\\bmod ' + m + '$, escribe $\\ker\\varphi$ (como conjunto).', res, norm: 'racional',
        firmas: [['solo-cero', ['0'], 'El núcleo es todo $x$ con $' + k + 'x\\equiv0\\pmod{' + m + '}$, no solo el $0$.'], ['imagen', imagen(n, m, k).map(String), 'Esa es la imagen; el núcleo son los $x$ que van al $0$.']].filter(f => C.fmt(f[1]) !== C.fmt(res)),
        pistas: ['Orientación: busca los $x\\in\\{0,\\dots,' + (n - 1) + '\\}$ con $' + k + 'x\\equiv0\\pmod{' + m + '}$.', 'Idea clave: el núcleo es un subgrupo de $\\mathbb{Z}_{' + n + '}$ (es $\\langle' + (n / nu.length) + '\\rangle$).', 'Primer paso: prueba los múltiplos de $' + (n / nu.length) + '$.'], expl: '$\\ker\\varphi=' + C.tex(res) + '$.' };
    },
  });

  gen.conjunto({
    id: 'w8.n3.tamanos-imagen-posibles', nivel: '8.3', habilidades: ['8.3.ordenes', '8.3.contar'], dificultad: 4,
    hacer(rng) {
      const a = rng.pick([6, 8, 9, 10, 12, 15, 16, 18, 20, 24]), b = rng.pick([4, 6, 9, 10, 12, 14, 15, 18, 21]), g = gcd(a, b), res = dts(g).map(String); if (res.length < 2) return null;
      return { key: a + ',' + b, enun: 'Sea $\\varphi:G\\to K$ un homomorfismo con $|G|=' + a + '$ y $|K|=' + b + '$. Escribe el conjunto de **todos los valores posibles** de $|\\operatorname{im}\\varphi|$ que permiten las condiciones de divisibilidad (los que dividen a ambos órdenes).', res, norm: 'racional',
        firmas: [['solo-uno-y-mcd', ['1', String(g)], 'Faltan divisores intermedios de $\\gcd(' + a + ',' + b + ')$.'], ['divisores-de-G', dts(a).map(String), '$|\\operatorname{im}\\varphi|$ también debe dividir a $|K|=' + b + '$ (es un subgrupo de $K$).']].filter(f => C.fmt(f[1]) !== C.fmt(res)),
        pistas: ['Orientación: $|\\operatorname{im}|$ divide a $|G|$ (por $|G|=|\\ker||\\operatorname{im}|$) y a $|K|$ (por Lagrange).', 'Idea clave: son los divisores de $\\gcd(' + a + ',' + b + ')$.', 'Primer paso: calcula $\\gcd(' + a + ',' + b + ')=' + g + '$.'], expl: 'Los divisores de $' + g + '$: ' + C.tex(res) + '.' };
    },
  });

  gen.entero({
    id: 'w8.n3.contar-homomorfismos', nivel: '8.3', habilidades: ['8.3.contar'], dificultad: 4,
    hacer(rng) {
      const n = rng.int(4, 30), m = rng.int(4, 30), g = gcd(n, m); if (g === 1) return null;
      let c = 0; for (let k = 0; k < m; k++) if (bien(n, m, k)) c++;
      return { key: n + ',' + m, enun: '¿Cuántos homomorfismos distintos $\\varphi:\\mathbb{Z}_{' + n + '}\\to\\mathbb{Z}_{' + m + '}$ hay? (Todo homomorfismo es $\\varphi(x)=kx$ con $k=\\varphi(1)$.)', res: c,
        firmas: [['m', m, 'No toda elección de $k$ vale: hace falta $' + m + '\\mid ' + n + 'k$.'], ['uno', 1, 'Además del trivial ($k=0$) hay otros cuando $\\gcd(' + n + ',' + m + ')>1$.']].filter(f => f[1] !== c),
        pistas: ['Orientación: $\\varphi(1)=k$ determina $\\varphi$, pero $k$ debe cumplir $' + n + 'k\\equiv0\\pmod{' + m + '}$.', 'Idea clave: hay exactamente $\\gcd(' + n + ',' + m + ')$ valores de $k$.', 'Primer paso: calcula $\\gcd(' + n + ',' + m + ')$.'], expl: 'Hay $\\gcd(' + n + ',' + m + ')=' + g + '$.' };
    },
  });

  /* ---------- demostraciones ---------- */
  dem2({
    id: 'dem.hom-identidad-inverso', teorema: 't.hom-identidad-inverso', nivel: '8.3', habilidades: ['8.3.reconocer', '8.3.demostrar'], requiere: ['t.grupo-cancelacion', 't.grupo-unicidad'], refsExtra: ['d.homomorfismo', 'd.grupo'],
    param: rng => ({ f: rng.pick(['φ', 'f']), a: rng.pick(['a', 'x']) }),
    enunciado: p => r`Sea $${p.f}:G\to K$ un homomorfismo de grupos. Demuestra que $${p.f}(e_G)=e_K$ y $${p.f}(${p.a}^{-1})=${p.f}(${p.a})^{-1}$.`,
    hip: p => [r`$${p.f}(xy)=${p.f}(x)${p.f}(y)$`, 'Puedes citar la cancelación y la unicidad de inversos'], meta: p => r`$${p.f}(e)=e$ y $${p.f}(${p.a}^{-1})=${p.f}(${p.a})^{-1}$`,
    L: p => [
      ['L1', r`$${p.f}(e)=${p.f}(e\ast e)=${p.f}(e)\ast ${p.f}(e)$ por ser $${p.f}$ homomorfismo.`, 'd.homomorfismo'],
      ['L2', r`Escribimos $${p.f}(e)=${p.f}(e)\ast e_K$ y cancelamos $${p.f}(e)$ por la izquierda: ⟦h1⟧.`, 't.grupo-cancelacion', ['L1'], [H('h1', r`$${p.f}(e)=e_K$`, [r`$${p.f}(e)=e_K$`, r`$${p.f}(e)=0$`, r`$${p.f}=e_K$`], false)]],
      ['L3', r`Para el inverso: $${p.f}(${p.a})\ast ${p.f}(${p.a}^{-1})=${p.f}(${p.a}\ast ${p.a}^{-1})=${p.f}(e)=e_K$.`, 'd.homomorfismo', ['L2']],
      ['L4', r`Luego $${p.f}(${p.a}^{-1})$ es un inverso de $${p.f}(${p.a})$ y, por la unicidad del inverso, $${p.f}(${p.a}^{-1})=${p.f}(${p.a})^{-1}$. ∎`, 't.grupo-unicidad', ['L3']],
    ],
    dist: p => [[r`Para $x\mapsto2x$ de $(\mathbb{Z},+)$ en sí mismo se cumple; luego siempre.`, 'un ejemplo no prueba el caso general'], [r`Como $${p.f}$ es una función, lleva neutro en neutro.`, 'para funciones cualesquiera no es cierto: hace falta el homomorfismo']],
    err: p => [['L1', r`$${p.f}(e)=${p.f}(e\ast e)=${p.f}(e)+${p.f}(e)$ siempre (suma).`, 'conclusion-invalida', 'La operación es la del grupo $K$ (no tiene por qué ser $+$).'], ['L3', r`$${p.f}(${p.a})\ast ${p.f}(${p.a}^{-1})=${p.f}(${p.a}\ast ${p.a}^{-1})=${p.f}(${p.a})$.`, 'error-de-calculo', '$a\\ast a^{-1}=e$.']],
    valida: [['operar', r`Usar $e=e\ast e$ y $a\ast a^{-1}=e$ dentro de $\varphi$`, 'Es la prueba estándar.']],
    idea: p => r`$${p.f}(e)=${p.f}(e)${p.f}(e)$ y la cancelación obliga a $${p.f}(e)=e$.`, primero: p => r`calcula $${p.f}(e\ast e)$.`,
  });

  dem2({
    id: 'dem.nucleo-subgrupo', teorema: 't.nucleo-subgrupo', nivel: '8.3', habilidades: ['8.3.nucleo-imagen', '8.3.reconocer', '8.3.demostrar'], requiere: ['t.hom-identidad-inverso', 't.subgrupo-criterio'], refsExtra: ['d.homomorfismo', 'd.subgrupo', 'b.doble-implicacion'],
    param: rng => ({ f: rng.pick(['φ', 'f']), a: rng.pick(['a', 'x']), b: rng.pick(['b', 'y']) }),
    enunciado: p => r`Sea $${p.f}:G\to K$ homomorfismo. Demuestra que $\ker ${p.f}$ es un subgrupo de $G$ y que $${p.f}$ es inyectivo si y solo si $\ker ${p.f}=\{e\}$.`,
    hip: p => [r`$${p.f}$ homomorfismo`, 'Puedes citar $\\varphi(e)=e$, $\\varphi(a^{-1})=\\varphi(a)^{-1}$ y el criterio del subgrupo'], meta: p => r`$\ker ${p.f}\le G$ y ($${p.f}$ inyectivo $\iff\ker ${p.f}=\{e\}$)`,
    L: p => [
      ['L1', r`$\ker ${p.f}\neq\emptyset$ porque $${p.f}(e)=e_K$, así que $e\in\ker ${p.f}$.`, 't.hom-identidad-inverso'],
      ['L2', r`Si $${p.a},${p.b}\in\ker ${p.f}$: $${p.f}(${p.a}\ast ${p.b}^{-1})=${p.f}(${p.a})\ast ${p.f}(${p.b})^{-1}=e_K\ast e_K^{-1}=e_K$, luego $${p.a}\ast ${p.b}^{-1}\in\ker ${p.f}$.`, 't.hom-identidad-inverso', ['L1']],
      ['L3', r`Por el criterio del subgrupo, $\ker ${p.f}\le G$.`, 't.subgrupo-criterio', ['L2']],
      ['L4', r`Inyectivo $\Rightarrow\ker=\{e\}$: si $${p.f}(${p.a})=e_K=${p.f}(e)$, la inyectividad da $${p.a}=e$.`, 'd.homomorfismo', ['L1']],
      ['L5', r`$\ker=\{e\}\Rightarrow$ inyectivo: si $${p.f}(${p.a})=${p.f}(${p.b})$, entonces $${p.f}(${p.a}\ast ${p.b}^{-1})=e_K$, así que $${p.a}\ast ${p.b}^{-1}\in\ker=\{e\}$ y ⟦h1⟧. ∎`, 'b.doble-implicacion', ['L3', 'L4'], [H('h1', r`$${p.a}=${p.b}$`, [r`$${p.a}=${p.b}$`, r`$${p.a}=e$`, r`$${p.f}=e_K$`], false)]],
    ],
    dist: p => [[r`Con $x\mapsto x\bmod2$ de $\mathbb{Z}$ en $\mathbb{Z}_2$ el núcleo es $2\mathbb{Z}$, un subgrupo; luego siempre.`, 'un ejemplo no prueba el caso general'], [r`Como $\ker ${p.f}\subseteq G$, hereda ser subgrupo.`, 'un subconjunto no siempre es subgrupo']],
    err: p => [['L2', r`$${p.f}(${p.a}\ast ${p.b}^{-1})=${p.f}(${p.a})\ast ${p.f}(${p.b})=e_K$.`, 'error-de-calculo', 'Falta el inverso: $\\varphi(b^{-1})=\\varphi(b)^{-1}$.'], ['L5', r`...y $${p.a}\ast ${p.b}^{-1}\in\ker=\{e\}$, así que $${p.a}=e$.`, 'conclusion-invalida', 'De $ab^{-1}=e$ se concluye $a=b$.']],
    valida: [['criterio', r`Verificar el criterio del subgrupo y probar las dos implicaciones`, 'Es la prueba estándar.']],
    idea: p => r`$${p.f}(${p.a})=${p.f}(${p.b})$ equivale a $${p.a}${p.b}^{-1}\in\ker ${p.f}$.`, primero: p => r`comprueba que $e\in\ker ${p.f}$.`,
  });

  dem2({
    id: 'dem.orden-ker-im', teorema: 't.orden-ker-im', nivel: '8.3', habilidades: ['8.3.nucleo-imagen', '8.3.ordenes', '8.3.demostrar'], requiere: ['t.lagrange', 't.nucleo-subgrupo'], refsExtra: ['d.homomorfismo', 'd.clase-lateral', 'd.biyeccion-clases'],
    param: rng => ({ f: rng.pick(['φ', 'f']), k: rng.pick(['K', 'N']), a: rng.pick(['a', 'x']), b: rng.pick(['b', 'y']) }),
    enunciado: p => r`Sea $${p.f}:G\to H$ un homomorfismo con $G$ finito y $${p.k}=\ker ${p.f}$. Demuestra que $|G|=|\ker ${p.f}|\cdot|\operatorname{im}${p.f}|$.`,
    hip: p => [r`$G$ finito y $${p.f}$ homomorfismo`, 'Puedes citar que el núcleo es subgrupo y el teorema de Lagrange'], meta: p => r`$|G|=|\ker ${p.f}|\,|\operatorname{im}${p.f}|$`,
    L: p => [
      ['L1', r`$${p.k}=\ker ${p.f}$ es un subgrupo de $G$, así que por Lagrange $|G|=[G:${p.k}]\cdot|${p.k}|$.`, 't.lagrange'],
      ['L2', r`Basta probar que $[G:${p.k}]=|\operatorname{im}${p.f}|$: definimos $\psi:G/${p.k}\to\operatorname{im}${p.f}$ por $\psi(${p.a}${p.k})=${p.f}(${p.a})$.`, 'd.clase-lateral', ['L1']],
      ['L3', r`Está bien definida e inyectiva: $${p.a}${p.k}=${p.b}${p.k}\iff ${p.a}^{-1}${p.b}\in ${p.k}\iff ${p.f}(${p.a}^{-1}${p.b})=e\iff ${p.f}(${p.a})=${p.f}(${p.b})$.`, 't.nucleo-subgrupo', ['L2']],
      ['L4', r`Es sobreyectiva: todo elemento de $\operatorname{im}${p.f}$ es $${p.f}(${p.a})=\psi(${p.a}${p.k})$.`, 'd.homomorfismo', ['L2']],
      ['L5', r`Por tanto $\psi$ es una ⟦h1⟧ y $[G:${p.k}]=|\operatorname{im}${p.f}|$. Así $|G|=|\operatorname{im}${p.f}|\cdot|\ker ${p.f}|$. ∎`, 'd.biyeccion-clases', ['L3', 'L4'], [H('h1', 'biyección', ['biyección', 'inclusión', 'permutación'], false)]],
    ],
    dist: p => [[r`Con $\mathbb{Z}_{12}\to\mathbb{Z}_4$, $|\ker|=3$ e $|\operatorname{im}|=4$: $3\cdot4=12$; luego siempre.`, 'un ejemplo no prueba el caso general'], [r`Como $|\operatorname{im}${p.f}|\le|H|$, se cumple automáticamente.`, 'la igualdad exige argumento con clases laterales']],
    err: p => [['L1', r`Por Lagrange $|G|=[G:${p.k}]+|${p.k}|$.`, 'error-de-calculo', 'Es un **producto**: $|G|=[G:K]\\cdot|K|$.'], ['L3', r`...$\iff ${p.a}${p.b}^{-1}\in ${p.k}$...`, 'error-de-calculo', 'Para clases por la izquierda es $a^{-1}b\\in K$.']],
    valida: [['biyeccion', r`Construir la biyección entre las clases laterales de $\ker\varphi$ y $\operatorname{im}\varphi$`, 'Es la prueba estándar.']],
    idea: p => r`las clases laterales de $\ker ${p.f}$ se corresponden con los elementos de la imagen.`, primero: p => r`aplica Lagrange al subgrupo $\ker ${p.f}$.`,
  });

  dem2({
    id: 'dem.orden-hom-divide', teorema: 't.orden-hom-divide', nivel: '8.3', habilidades: ['8.3.ordenes', '8.3.contar', '8.3.demostrar'], requiere: ['t.orden-ker-im', 't.lagrange'], refsExtra: ['d.homomorfismo', 'd.orden-elemento', 'd.divisibilidad'],
    param: rng => ({ f: rng.pick(['φ', 'f']), g: rng.pick(['g', 'a']), m: rng.pick(['m', 'k']) }),
    enunciado: p => r`Sea $${p.f}:G\to H$ homomorfismo de grupos finitos. Demuestra que $|\operatorname{im}${p.f}|$ divide a $\gcd(|G|,|H|)$.`,
    hip: p => [r`$G,H$ finitos`, 'Puedes citar la relación entre $|G|$, $|\\ker|$ e $|\\operatorname{im}|$ y el teorema de Lagrange'], meta: p => r`$|\operatorname{im}${p.f}|\mid\gcd(|G|,|H|)$`,
    L: p => [
      ['L1', r`Por $|G|=|\ker ${p.f}|\cdot|\operatorname{im}${p.f}|$, $|\operatorname{im}${p.f}|$ divide a $|G|$.`, 't.orden-ker-im'],
      ['L2', r`$\operatorname{im}${p.f}$ es un subgrupo de $H$, así que por Lagrange $|\operatorname{im}${p.f}|$ divide a $|H|$.`, 't.lagrange', ['L1']],
      ['L3', r`Un número que divide a $|G|$ y a $|H|$ divide a su ⟦h1⟧.`, 'd.divisibilidad', ['L1', 'L2'], [H('h1', 'máximo común divisor', ['máximo común divisor', 'producto', 'suma'], false)]],
      ['L4', r`Por tanto $|\operatorname{im}${p.f}|$ divide a $\gcd(|G|,|H|)$. ∎`, 'd.divisibilidad', ['L3']],
    ],
    dist: p => [[r`Para $\mathbb{Z}_6\to\mathbb{Z}_9$ la imagen tiene orden $1$ o $3$, divisores de $3$; luego siempre.`, 'un ejemplo no prueba el caso general'], [r`Como $\operatorname{im}${p.f}\subseteq H$, su orden divide a $|G|$.`, 'divide a $|H|$ por Lagrange, pero a $|G|$ hay que probarlo con el núcleo']],
    err: p => [['L1', r`Por $|G|=|\ker ${p.f}|+|\operatorname{im}${p.f}|$, ...`, 'error-de-calculo', 'Es un producto, no una suma.'], ['L2', r`$\operatorname{im}${p.f}$ es un subgrupo de $G$, así que por Lagrange divide a $|G|$.`, 'conclusion-invalida', 'La imagen es subgrupo de $H$, no de $G$.']],
    valida: [['dos-lados', r`Probar que divide a $|G|$ (núcleo e imagen) y a $|H|$ (Lagrange)`, 'Es la prueba estándar.']],
    idea: p => r`la imagen divide a $|G|$ por el núcleo y a $|H|$ por Lagrange.`, primero: p => r`aplica $|G|=|\ker ${p.f}||\operatorname{im}${p.f}|$.`,
  });

  R.nivel({
    id: '8.3', mundo: 8, titulo: 'Homomorfismos', tema: 'Homomorfismos, núcleo, imagen y órdenes',
    habilidades: ['8.3.reconocer', '8.3.nucleo-imagen', '8.3.ordenes', '8.3.contar', '8.3.demostrar'],
    teoremas: ['t.hom-identidad-inverso', 't.nucleo-subgrupo', 't.orden-ker-im', 't.orden-hom-divide'],
    leccion: {
      intro: 'Un **homomorfismo** $\\varphi:G\\to H$ respeta las operaciones: $\\varphi(ab)=\\varphi(a)\\varphi(b)$. Lleva el neutro al neutro y los inversos a los inversos. Es la versión de «transformación lineal» para grupos.',
      definiciones: [
        { nombre: 'Núcleo e imagen', tex: '$\\ker\\varphi=\\{a:\\varphi(a)=e\\}\\le G$ e $\\operatorname{im}\\varphi\\le H$ son subgrupos. $\\varphi$ es inyectivo $\\iff\\ker\\varphi=\\{e\\}$.' },
        { nombre: 'Teorema del orden', tex: '$|G|=|\\ker\\varphi|\\cdot|\\operatorname{im}\\varphi|$ (como rango más nulidad). Por eso $|\\operatorname{im}\\varphi|$ divide a $\\gcd(|G|,|H|)$.' },
        { nombre: 'Homomorfismos cíclicos', tex: 'Los homomorfismos $\\mathbb{Z}_n\\to\\mathbb{Z}_m$ son $x\\mapsto kx$ con $m\\mid nk$: hay exactamente $\\gcd(n,m)$ de ellos.' },
        { nombre: 'Órdenes', tex: '$\\operatorname{ord}(\\varphi(g))$ divide a $\\operatorname{ord}(g)$: un homomorfismo no puede aumentar el orden.' },
      ],
      teorema: 't.orden-ker-im',
      ejemplo: { enunciado: '$\\varphi:\\mathbb{Z}_{12}\\to\\mathbb{Z}_{8}$, $\\varphi(x)=2x$. ¿Está bien definida? ¿Cuánto vale $|\\ker|$?', pasos: ['Bien definida si $8\\mid12\\cdot2=24$: sí, $24=3\\cdot8$.', 'Núcleo: $2x\\equiv0\\pmod 8$, $x\\in\\{0,4,8\\}$: $|\\ker|=3$.', 'Imagen: $|\\operatorname{im}|=12/3=4$ (los pares de $\\mathbb{Z}_8$).'] },
    },
  });

  if (typeof module !== 'undefined') module.exports = AC;
})(globalThis.AC = globalThis.AC || {});
