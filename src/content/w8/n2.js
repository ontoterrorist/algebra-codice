/* Mundo 8, nivel 8.2 — Subgrupos, órdenes y el teorema de Lagrange. */
(function (AC) {
  const { R, H, T, gen, dem2 } = AC.cont, r = String.raw, G = AC.grupos, N = AC.numth, C = AC.conj;
  const ref = (id, tipo, nombre) => R.ref({ id, tipo, nombre });
  ref('d.subgrupo', 'definicion', 'Subgrupo: subconjunto no vacío H ⊆ G que es grupo con la misma operación'); ref('d.orden-elemento', 'definicion', 'Orden de g: el menor m ≥ 1 con gᵐ = e; ⟨g⟩ = {e, g, …, gᵐ⁻¹}');
  ref('d.clase-lateral', 'definicion', 'Clase lateral aH = {ah : h ∈ H}; índice [G:H] = número de clases laterales');

  const HB = (id, nombre) => R.habilidad({ id: '8.2.' + id, nombre, nivel: '8.2' });
  HB('subgrupos', 'Reconocer subgrupos'); HB('ordenes', 'Órdenes de elementos'); HB('generados', 'Subgrupos cíclicos'); HB('lagrange', 'Aplicar Lagrange'); HB('demostrar', 'Demostrar con subgrupos y Lagrange');
  const TE = (id, titulo, enunciado, requiere, hab) => R.teorema({ id, titulo, nivel: '8.2', enunciado, requiere, habilidades: hab });
  TE('t.subgrupo-criterio', 'Criterio del subgrupo', r`Un $H\subseteq G$ no vacío es subgrupo si y solo si $ab^{-1}\in H$ para todos $a,b\in H$.`, ['t.grupo-unicidad', 't.grupo-inverso-producto'], ['8.2.subgrupos', '8.2.generados', '8.2.demostrar']);
  TE('t.clases-laterales', 'Clases laterales', r`Las clases laterales $aH$ forman una partición de $G$ y todas tienen $|H|$ elementos.`, ['t.grupo-cancelacion', 't.equiv-particion'], ['8.2.lagrange', '8.2.demostrar']);
  TE('t.lagrange', 'Teorema de Lagrange', r`Si $G$ es finito y $H\le G$, entonces $|H|$ divide a $|G|$, y $|G|=[G:H]\,|H|$.`, ['t.clases-laterales'], ['8.2.lagrange', '8.2.ordenes', '8.2.demostrar']);
  TE('t.orden-divide', 'El orden de un elemento divide al del grupo', r`En un grupo finito, $\operatorname{ord}(g)=|\langle g\rangle|$ divide a $|G|$, y $g^{|G|}=e$.`, ['t.lagrange', 't.subgrupo-criterio'], ['8.2.ordenes', '8.2.generados', '8.2.lagrange', '8.2.demostrar']);

  const tx = c => '$' + c + '$';
  const sub = (d, n) => G.generadoSuma(d, n), dts = n => N.divisores(n);

  /* ---------- generadores ---------- */
  gen.multiple({
    id: 'w8.n2.cuales-subgrupos', nivel: '8.2', habilidades: ['8.2.subgrupos'], dificultad: 3,
    hacer(rng) {
      const n = rng.pick([12, 15, 18, 20, 24, 30]), ds = dts(n).filter(d => d > 1 && d < n); if (ds.length < 2) return null;
      const buenos = rng.sample(ds, Math.min(2, ds.length)).map(d => ({ s: sub(d, n), ok: true, por: 'Es el subgrupo cíclico generado por $' + d + '$.' }));
      const malos = []; const k = rng.int(3, 5); malos.push({ s: Array.from({ length: k }, (_, i) => i), ok: false, por: 'No es cerrado: la suma de dos elementos puede salir del conjunto (o no hay inversos).' });
      const d = rng.pick(ds), t = sub(d, n).map(x => (x + 1) % n); if (!t.includes(0)) malos.push({ s: t.sort((a, b) => a - b), ok: false, por: 'No contiene al neutro $0$.' });
      const g = rng.pick(ds), j = rng.int(1, n - 1); malos.push({ s: [...new Set([0, j, (2 * j) % n])].sort((a, b) => a - b), ok: false, por: 'No es cerrado bajo la suma ni bajo inversos (faltan $-j$, $3j$, …).' });
      const ops = rng.shuffle(buenos.concat(malos.filter(m => !buenos.some(b => b.s.join() === m.s.join())))).slice(0, 4); const ok = ops.map((o, i) => (o.ok ? i : -1)).filter(i => i >= 0);
      if (!ok.length || ok.length === ops.length) return null; const fmt = s => '$\\{' + s.join(',') + '\\}$';
      return { key: n + ops.map(o => o.s.join('.')).join('|'), enun: 'En el grupo $(\\mathbb{Z}_{' + n + '},+)$ marca todos los subconjuntos que son **subgrupos**.', opciones: ops.map(o => fmt(o.s)), ok, msg: (j, es) => (es ? 'Sí es subgrupo: ' : 'No es subgrupo: ') + ops[j].por,
        pistas: ['Orientación: debe contener al $0$ y ser cerrado bajo la suma y los opuestos.', 'Idea clave: los subgrupos de $\\mathbb{Z}_n$ son los múltiplos de un divisor $d$ de $n$.', 'Primer paso: ¿contiene al $0$? ¿es cerrado bajo la suma?'], expl: 'Son subgrupos los que son $\\langle d\\rangle$ con $d\\mid ' + n + '$.' };
    },
  });

  gen.entero({
    id: 'w8.n2.orden-en-suma', nivel: '8.2', habilidades: ['8.2.ordenes'], dificultad: 2,
    hacer(rng) {
      const n = rng.int(8, 60), a = rng.int(1, n - 1), o = G.ordenSuma(a, n);
      return { key: a + ',' + n, enun: '¿Cuál es el orden del elemento $' + a + '$ en el grupo $(\\mathbb{Z}_{' + n + '},+)$?', res: o,
        firmas: [['n', n, 'Eso es el orden del grupo; el orden de $a$ es $n/\\gcd(a,n)$ y puede ser menor.'], ['mcd', N.gcd(a, n), 'Ese es $\\gcd(a,n)$; el orden es $n/\\gcd(a,n)$.']].filter(f => f[1] !== o && f[1] > 0),
        pistas: ['Orientación: el orden de $a$ es el menor $m\\ge1$ con $ma\\equiv0\\pmod{' + n + '}$.', 'Idea clave: $m=n/\\gcd(a,n)$.', 'Primer paso: calcula $\\gcd(' + a + ',' + n + ')=' + N.gcd(a, n) + '$.'], expl: '$' + n + '/' + N.gcd(a, n) + '=' + o + '$.' };
    },
  });

  gen.entero({
    id: 'w8.n2.orden-en-producto', nivel: '8.2', habilidades: ['8.2.ordenes', '8.2.lagrange'], dificultad: 3,
    hacer(rng) {
      const n = rng.pick([7, 9, 10, 11, 13, 14, 15, 17, 19, 21, 22, 25]), u = G.unidades(n), a = rng.pick(u.filter(x => x !== 1)), o = G.ordenProducto(a, n);
      return { key: a + ',' + n, enun: '¿Cuál es el orden de $' + a + '$ en el grupo $(\\mathbb{Z}_{' + n + '}^\\times,\\cdot)$ (el menor $m\\ge1$ con $' + a + '^m\\equiv1\\pmod{' + n + '}$)?', res: o,
        firmas: [['phi', N.phi(n), 'Ese es el orden del grupo; el orden de $a$ **divide** a $\\varphi(n)$ pero puede ser menor.'], ['una-mas', o + 1, 'El orden es el **menor** $m$ con $a^m\\equiv1$: revisa el último paso.'], ['n-menos-uno', n - 1, 'Revisa: el orden divide a $|\\mathbb{Z}_n^\\times|=\\varphi(n)=' + N.phi(n) + '$.']].filter(f => f[1] !== o),
        pistas: ['Orientación: calcula las potencias $a,a^2,a^3,\\dots$ módulo $' + n + '$ hasta llegar a $1$.', 'Idea clave: el orden divide a $\\varphi(' + n + ')=' + N.phi(n) + '$ (Lagrange): solo hay que probar divisores.', 'Primer paso: lista los divisores de $' + N.phi(n) + '$.'], expl: '$' + a + '^{' + o + '}\\equiv1\\pmod{' + n + '}$ y no antes.' };
    },
  });

  gen.conjunto({
    id: 'w8.n2.subgrupo-generado', nivel: '8.2', habilidades: ['8.2.generados'], dificultad: 2,
    hacer(rng) {
      const mult = rng.chance(0.5), n = mult ? rng.pick([7, 9, 10, 11, 13, 14, 15]) : rng.int(8, 30); let g, s;
      if (mult) { g = rng.pick(G.unidades(n).filter(x => x !== 1)); s = G.generadoProducto(g, n); } else { g = rng.int(2, n - 1); s = G.generadoSuma(g, n); }
      if (s.length < 2 || s.length > 14) return null; const res = s.map(String);
      return { key: (mult ? 'm' : 's') + g + ',' + n, enun: 'Escribe el subgrupo cíclico $\\langle' + g + '\\rangle$ de $' + (mult ? '(\\mathbb{Z}_{' + n + '}^\\times,\\cdot)' : '(\\mathbb{Z}_{' + n + '},+)') + '$ (todos sus elementos, como conjunto).', res, norm: 'racional',
        firmas: [['solo-generador', [String(g)], 'El subgrupo generado contiene todas las ' + (mult ? 'potencias' : 'múltiplos') + ' de $' + g + '$, incluido el neutro.'], ['sin-neutro', res.filter(x => x !== (mult ? '1' : '0')), 'Todo subgrupo contiene al neutro (' + (mult ? '$1$' : '$0$') + ').']].filter(f => C.fmt(f[1]) !== C.fmt(res) && f[1].length),
        pistas: ['Orientación: ' + (mult ? 'calcula $g,g^2,g^3,\\dots$ módulo $' + n + '$.' : 'calcula $g,2g,3g,\\dots$ módulo $' + n + '$.'), 'Idea clave: para al volver al neutro.', 'Primer paso: calcula ' + (mult ? '$g^2$.' : '$2g$.')], expl: 'Es ' + C.tex(res) + '.' };
    },
  });

  gen.entero({
    id: 'w8.n2.indice', nivel: '8.2', habilidades: ['8.2.lagrange'], dificultad: 2,
    hacer(rng) {
      const n = rng.pick([12, 18, 20, 24, 30, 36, 40, 48, 60]), ds = dts(n).filter(d => d > 1 && d < n), k = rng.pick(ds), idx = n / k;
      return { key: n + ',' + k, enun: 'Sea $G$ un grupo de orden $' + n + '$ y $H$ un subgrupo de orden $' + k + '$. ¿Cuál es el índice $[G:H]$ (número de clases laterales)?', res: idx,
        firmas: [['orden-de-H', k, 'Ese es $|H|$; el índice es $|G|/|H|$.'], ['resta', n - k, 'El índice es un **cociente**: $|G|/|H|$, no una resta.']].filter(f => f[1] !== idx),
        pistas: ['Orientación: $[G:H]=|G|/|H|$.', 'Idea clave: por Lagrange, $|G|=[G:H]\,|H|$.', 'Primer paso: divide $' + n + '$ entre $' + k + '$.'], expl: '$[G:H]=' + n + '/' + k + '=' + idx + '$.' };
    },
  });

  gen.conjunto({
    id: 'w8.n2.ordenes-subgrupos', nivel: '8.2', habilidades: ['8.2.lagrange', '8.2.generados'], dificultad: 3,
    hacer(rng) {
      const n = rng.int(10, 96), res = dts(n).map(String); if (res.length < 4) return null; if (res.length > 12) return null;
      return { key: String(n), enun: 'El grupo $(\\mathbb{Z}_{' + n + '},+)$ es cíclico: tiene exactamente un subgrupo de cada orden posible. Escribe el conjunto de **órdenes** de sus subgrupos.', res, norm: 'racional',
        firmas: [['sin-extremos', res.filter(x => x !== '1' && x !== String(n)), 'Faltan los subgrupos triviales: $\\{0\\}$ (orden $1$) y $\\mathbb{Z}_n$ (orden $n$).'], ['todos-hasta-n', Array.from({ length: n }, (_, i) => String(i + 1)), 'Por Lagrange el orden **divide** a $' + n + '$: no todos los números sirven.']].filter(f => C.fmt(f[1]) !== C.fmt(res) && f[1].length),
        pistas: ['Orientación: por Lagrange el orden de un subgrupo divide a $|G|$.', 'Idea clave: en un grupo cíclico, para cada divisor $d$ de $n$ hay un subgrupo de orden $d$.', 'Primer paso: escribe los divisores de $' + n + '$.'], expl: 'Son los divisores de $' + n + '$: ' + C.tex(res) + '.' };
    },
  });

  gen.conjunto({
    id: 'w8.n2.clase-lateral', nivel: '8.2', habilidades: ['8.2.lagrange', '8.2.generados'], dificultad: 3,
    hacer(rng) {
      const n = rng.pick([12, 15, 18, 20, 24]), ds = dts(n).filter(d => d > 1 && d < n), d = rng.pick(ds), a = rng.int(1, d - 1 + 1), Hh = sub(d, n), cl = G.lateralSuma(a, Hh, n), res = cl.map(String); if (a % d === 0) return null;
      return { key: n + ',' + d + ',' + a, enun: 'Sea $H=\\langle' + d + '\\rangle\\le(\\mathbb{Z}_{' + n + '},+)$. Escribe la clase lateral $' + a + '+H$.', res, norm: 'racional',
        firmas: [['es-H', Hh.map(String), 'Esa es $H$ misma (la clase de $0$); aquí hay que **trasladar** cada elemento sumando $' + a + '$.'], ['solo-a', [String(a)], 'La clase contiene $' + a + '+h$ para todos los $h\\in H$.']].filter(f => C.fmt(f[1]) !== C.fmt(res)),
        pistas: ['Orientación: $a+H=\\{a+h:h\\in H\\}$.', 'Idea clave: suma $' + a + '$ a cada elemento de $H=' + C.tex(Hh.map(String)) + '$ módulo $' + n + '$.', 'Primer paso: calcula $' + a + '+0$.'], expl: '$' + a + '+H=' + C.tex(res) + '$.' };
    },
  });

  gen.eleccion({
    id: 'w8.n2.lagrange-posible', nivel: '8.2', habilidades: ['8.2.lagrange'], dificultad: 3,
    hacer(rng) {
      const n = rng.pick([12, 15, 18, 20, 21, 24, 28, 30, 36]), ds = dts(n), no = []; for (let k = 2; k < n && no.length < 6; k++) if (n % k !== 0) no.push(k); const bad = rng.pick(no), good = rng.pick(ds.filter(d => d > 1 && d < n));
      return { key: n + ',' + bad + good, enun: 'Un grupo finito $G$ tiene orden $' + n + '$. ¿Qué orden **no puede** tener un subgrupo de $G$?', ok: String(bad), malas: ds.filter(d => d > 1 && d !== good).slice(0, 2).concat([good]).map((d, i) => ['divide-' + d, String(d), 'Como $' + d + '$ divide a $' + n + '$, Lagrange no lo impide (podría existir).']),
        pistas: ['Orientación: por Lagrange, $|H|$ divide a $|G|$.', 'Idea clave: descarta los que no dividen a $' + n + '$.', 'Primer paso: ¿cuáles de las opciones dividen a $' + n + '$?'], expl: '$' + bad + '$ no divide a $' + n + '$.' };
    },
  });

  gen.entero({
    id: 'w8.n2.orden-permutacion', nivel: '8.2', habilidades: ['8.2.ordenes'], dificultad: 3,
    hacer(rng) {
      const n = rng.int(4, 6), p = rng.pick(G.permutaciones(n)), o = G.ordenPerm(p); if (o === 1) return null; const lens = G.ciclos(p).map(c => c.length);
      return { key: p.join(), enun: 'En $S_' + n + '$ la permutación $\\sigma$ (notación de una línea) es $(' + p.join(',') + ')$. ¿Cuál es su orden?', res: o,
        firmas: [['suma-ciclos', lens.reduce((a, b) => a + b, 0), 'El orden es el **mcm** de las longitudes de los ciclos, no su suma.'], ['maximo', Math.max(...lens), 'Es el mcm de las longitudes, no el mayor ciclo.']].filter(f => f[1] !== o),
        pistas: ['Orientación: descompón $\\sigma$ en ciclos disjuntos.', 'Idea clave: el orden es el mínimo común múltiplo de las longitudes de los ciclos.', 'Primer paso: sigue el ciclo del $1$.'], expl: 'Ciclos de longitudes $' + lens.join(',') + '$: orden $' + o + '$.' };
    },
  });

  /* ---------- demostraciones ---------- */
  dem2({
    id: 'dem.subgrupo-criterio', teorema: 't.subgrupo-criterio', nivel: '8.2', habilidades: ['8.2.subgrupos', '8.2.generados', '8.2.demostrar'], requiere: ['t.grupo-unicidad', 't.grupo-inverso-producto'], refsExtra: ['d.subgrupo', 'd.grupo', 'b.doble-implicacion'],
    param: rng => ({ h: rng.pick(['H', 'K']), a: rng.pick(['a', 'x']), b: rng.pick(['b', 'y']) }),
    enunciado: p => r`Sea $(G,\ast)$ un grupo y $${p.h}\subseteq G$ no vacío. Demuestra que $${p.h}$ es subgrupo si y solo si $${p.a}\ast ${p.b}^{-1}\in ${p.h}$ para todos $${p.a},${p.b}\in ${p.h}$.`,
    hip: p => [r`$${p.h}\neq\emptyset$`, 'Puedes citar la unicidad de inversos y el inverso de un producto'], meta: p => r`$${p.h}\le G\iff ${p.a}${p.b}^{-1}\in ${p.h}$ ∀$${p.a},${p.b}\in ${p.h}$`,
    L: p => [
      ['L1', r`(⇒) Si $${p.h}$ es subgrupo, es cerrado bajo la operación y los inversos: $${p.b}^{-1}\in ${p.h}$ y por tanto $${p.a}\ast ${p.b}^{-1}\in ${p.h}$.`, 'd.subgrupo'],
      ['L2', r`(⇐) Supongamos $${p.a}\ast ${p.b}^{-1}\in ${p.h}$ para todos. Existe $h\in ${p.h}$; con $${p.a}=${p.b}=h$, $h\ast h^{-1}=e\in ${p.h}$.`, 'd.grupo', ['L1']],
      ['L3', r`Inversos: con $${p.a}=e$ y $${p.b}=h\in ${p.h}$, $e\ast h^{-1}=h^{-1}\in ${p.h}$.`, 't.grupo-unicidad', ['L2']],
      ['L4', r`Cerradura: si $${p.a},${p.b}\in ${p.h}$, entonces $${p.b}^{-1}\in ${p.h}$ y $${p.a}\ast(${p.b}^{-1})^{-1}\in ${p.h}$; pero $(${p.b}^{-1})^{-1}$, que es igual a ⟦h1⟧.`, 't.grupo-inverso-producto', ['L3'], [H('h1', r`$${p.b}$`, [r`$${p.b}$`, r`$e$`, r`$${p.a}$`], false)]],
      ['L5', r`Luego $${p.a}\ast ${p.b}\in ${p.h}$. La asociatividad se hereda de $G$: $${p.h}$ es subgrupo. ∎`, 'd.subgrupo', ['L2', 'L3', 'L4']],
    ],
    dist: p => [[r`En $\mathbb{Z}$ el conjunto $2\mathbb{Z}$ cumple el criterio y es subgrupo; luego siempre.`, 'un ejemplo no prueba el caso general'], [r`Basta que $${p.h}$ sea cerrado bajo la operación.`, 'en grupos infinitos hacen falta también los inversos (por ejemplo $\\mathbb{N}\\subseteq\\mathbb{Z}$)']],
    err: p => [['L2', r`(⇐) Con $${p.a}=${p.b}=h$, $h\ast h^{-1}=h\in ${p.h}$.`, 'error-de-calculo', 'El producto con su inverso es el neutro $e$.'], ['L4', r`Cerradura: $(${p.b}^{-1})^{-1}=e$.`, 'error-de-calculo', 'El inverso del inverso es $b$.']],
    valida: [['pasos', r`Deducir neutro, inversos y cerradura a partir de $ab^{-1}\in H$`, 'Es la prueba estándar.']],
    idea: p => r`$h\ast h^{-1}=e$, luego $e\ast h^{-1}$ y $${p.a}\ast(${p.b}^{-1})^{-1}$ dan el resto.`, primero: p => r`obtén $e\in ${p.h}$ con $${p.a}=${p.b}$.`,
  });

  dem2({
    id: 'dem.clases-laterales', teorema: 't.clases-laterales', nivel: '8.2', habilidades: ['8.2.lagrange', '8.2.demostrar'], requiere: ['t.grupo-cancelacion', 't.equiv-particion'], refsExtra: ['d.clase-lateral', 'd.relacion-equivalencia', 'd.biyectiva'],
    param: rng => ({ h: rng.pick(['H', 'K']), a: rng.pick(['a', 'x']), b: rng.pick(['b', 'y']) }),
    enunciado: p => r`Sea $${p.h}\le G$ con $G$ finito. Demuestra que las clases laterales $${p.a}${p.h}$ particionan $G$ y que todas tienen $|${p.h}|$ elementos.`,
    hip: p => [r`$G$ grupo finito y $${p.h}$ subgrupo`, 'Puedes citar la cancelación y que las clases de equivalencia particionan'], meta: p => r`las clases $${p.a}${p.h}$ forman una partición, todas de tamaño $|${p.h}|$`,
    L: p => [
      ['L1', r`Definimos $${p.a}\sim ${p.b}$ si $${p.a}^{-1}${p.b}\in ${p.h}$. Es relación de equivalencia: reflexiva ($e\in ${p.h}$), simétrica ($(${p.a}^{-1}${p.b})^{-1}=${p.b}^{-1}${p.a}\in ${p.h}$) y transitiva (producto en $${p.h}$).`, 'd.relacion-equivalencia'],
      ['L2', r`La clase de $${p.a}$ es $\{${p.b}:${p.a}^{-1}${p.b}\in ${p.h}\}=\{${p.a}h:h\in ${p.h}\}=${p.a}${p.h}$.`, 'd.clase-lateral', ['L1']],
      ['L3', r`Por el teorema de que las clases de equivalencia particionan, las clases $${p.a}${p.h}$ forman una partición de $G$.`, 't.equiv-particion', ['L2']],
      ['L4', r`Tamaño: la función $f:${p.h}\to ${p.a}${p.h}$, $f(h)=${p.a}h$ es sobreyectiva por definición e inyectiva por ⟦h1⟧: $${p.a}h=${p.a}h'\Rightarrow h=h'$.`, 't.grupo-cancelacion', ['L2'], [H('h1', 'cancelación', ['cancelación', 'conmutatividad', 'asociatividad'], false)]],
      ['L5', r`Luego $|${p.a}${p.h}|=|${p.h}|$ para toda clase. ∎`, 'd.biyectiva', ['L4']],
    ],
    dist: p => [[r`En $\mathbb{Z}_6$ con $H=\{0,3\}$ las clases son $\{0,3\},\{1,4\},\{2,5\}$; luego siempre.`, 'un ejemplo no prueba el caso general'], [r`Como $G$ es finito, las clases deben ser del mismo tamaño.`, 'es lo que hay que probar']],
    err: p => [['L1', r`Definimos $${p.a}\sim ${p.b}$ si $${p.a}${p.b}\in ${p.h}$.`, 'conclusion-invalida', 'Hay que usar $a^{-1}b\\in H$ (si no, no es reflexiva).'], ['L4', r`La función $f(h)=h${p.a}$ va de $${p.h}$ a $${p.a}${p.h}$.`, 'error-de-calculo', 'Las clases son $ah$ (multiplicación por la izquierda).']],
    valida: [['equivalencia', r`Probar que $a\sim b\iff a^{-1}b\in H$ es de equivalencia y que $h\mapsto ah$ es biyección`, 'Es la prueba estándar.']],
    idea: p => r`las clases de $a^{-1}b\in ${p.h}$ son las traslaciones $${p.a}${p.h}$, todas del mismo tamaño por cancelación.`, primero: p => r`prueba que la relación es de equivalencia.`,
  });

  dem2({
    id: 'dem.lagrange', teorema: 't.lagrange', nivel: '8.2', habilidades: ['8.2.lagrange', '8.2.ordenes', '8.2.demostrar'], requiere: ['t.clases-laterales'], refsExtra: ['d.clase-lateral', 'd.divisibilidad', 'b.suma-finita'],
    param: rng => ({ h: rng.pick(['H', 'K']), k: rng.pick(['k', 'm']) }),
    enunciado: p => r`Sea $G$ un grupo finito y $${p.h}\le G$. Demuestra que $|${p.h}|$ divide a $|G|$ y que $|G|=[G:${p.h}]\cdot|${p.h}|$.`,
    hip: p => [r`$G$ finito y $${p.h}$ subgrupo`, 'Puedes citar el teorema de las clases laterales'], meta: p => r`$|G|=[G:${p.h}]\,|${p.h}|$`,
    L: p => [
      ['L1', r`Por el teorema de las clases laterales, $G$ es unión **disjunta** de las clases $g_1${p.h},\dots,g_${p.k}${p.h}$, donde $${p.k}=[G:${p.h}]$.`, 't.clases-laterales'],
      ['L2', r`Todas tienen $|${p.h}|$ elementos, así que cada clase aporta $|${p.h}|$ al total.`, 't.clases-laterales', ['L1']],
      ['L3', r`Como la unión es disjunta, el número de elementos es la suma: $|G|=|g_1${p.h}|+\cdots+|g_${p.k}${p.h}|$, que es igual a ⟦h1⟧.`, 'b.suma-finita', ['L2'], [H('h1', r`$${p.k}\cdot|${p.h}|$`, [r`$${p.k}\cdot|${p.h}|$`, r`$${p.k}+|${p.h}|$`, r`$|${p.h}|^${p.k}$`], false)]],
      ['L4', r`Así $|G|=[G:${p.h}]\cdot|${p.h}|$, y por tanto $|${p.h}|$ divide a $|G|$. ∎`, 'd.divisibilidad', ['L3']],
    ],
    dist: p => [[r`Con $G=\mathbb{Z}_{12}$ y $H=\{0,4,8\}$, $3\mid12$; luego siempre.`, 'un ejemplo no prueba el caso general'], [r`Como $${p.h}\subseteq G$, $|${p.h}|\le|G|$ y eso basta.`, 'menor o igual no es lo mismo que divisor']],
    err: p => [['L2', r`Cada clase aporta $|G|/|${p.h}|$ elementos.`, 'error-de-calculo', 'Cada clase tiene exactamente $|H|$ elementos.'], ['L3', r`Como la unión es disjunta, $|G|=|g_1${p.h}|\cdot\cdots\cdot|g_${p.k}${p.h}|=|${p.h}|^${p.k}$.`, 'error-de-calculo', 'El tamaño de una unión disjunta es la **suma**.']],
    valida: [['conteo', r`Contar los elementos de $G$ por clases laterales`, 'Es la prueba estándar.']],
    idea: p => r`$G$ es unión disjunta de $${p.k}$ clases de tamaño $|${p.h}|$.`, primero: p => r`escribe $G$ como unión disjunta de clases laterales.`,
  });

  dem2({
    id: 'dem.orden-divide', teorema: 't.orden-divide', nivel: '8.2', habilidades: ['8.2.ordenes', '8.2.generados', '8.2.lagrange', '8.2.demostrar'], requiere: ['t.lagrange', 't.subgrupo-criterio'], refsExtra: ['d.orden-elemento', 'd.subgrupo', 'b.casos'],
    param: rng => ({ g: rng.pick(['g', 'a']), m: rng.pick(['m', 'k']), n: rng.pick(['n', 'N']) }),
    enunciado: p => r`Sea $G$ finito de orden $${p.n}$ y $${p.g}\in G$ de orden $${p.m}$. Demuestra que $\langle ${p.g}\rangle$ es un subgrupo de $${p.m}$ elementos, que $${p.m}\mid ${p.n}$ y que $${p.g}^${p.n}=e$.`,
    hip: p => [r`$|G|=${p.n}$ y $\operatorname{ord}(${p.g})=${p.m}$`, 'Puedes citar el criterio del subgrupo y el teorema de Lagrange'], meta: p => r`$${p.m}\mid ${p.n}$ y $${p.g}^${p.n}=e$`,
    L: p => [
      ['L1', r`$\langle ${p.g}\rangle=\{e,${p.g},${p.g}^2,\dots,${p.g}^{${p.m}-1}\}$ y estos $${p.m}$ elementos son distintos: si $${p.g}^i=${p.g}^j$ con $0\le i<j<${p.m}$, entonces $${p.g}^{j-i}=e$ con $j-i<${p.m}$, contra la minimalidad del orden.`, 'd.orden-elemento'],
      ['L2', r`Es subgrupo por el criterio: $${p.g}^i(${p.g}^j)^{-1}=${p.g}^{i-j}$ vuelve a ser una potencia de $${p.g}$.`, 't.subgrupo-criterio', ['L1']],
      ['L3', r`Por Lagrange, $|\langle ${p.g}\rangle|=${p.m}$ divide a $|G|=${p.n}$: $${p.n}=${p.m}q$.`, 't.lagrange', ['L2']],
      ['L4', r`Entonces $${p.g}^${p.n}=${p.g}^{${p.m}q}=(${p.g}^${p.m})^q$, que es igual a ⟦h1⟧.`, 'd.orden-elemento', ['L3'], [H('h1', r`$e^q=e$`, [r`$e^q=e$`, r`$${p.g}^q$`, r`$0$`], false)]],
    ],
    dist: p => [[r`En $\mathbb{Z}_7^\times$, $3^6=729\equiv1$; luego siempre.`, 'un ejemplo no prueba el caso general'], [r`Como $${p.g}\in G$, $${p.g}^${p.n}=e$ por ser $G$ finito.`, 'es lo que hay que probar (se usa Lagrange)']],
    err: p => [['L1', r`$\langle ${p.g}\rangle=\{${p.g},${p.g}^2,\dots,${p.g}^${p.m}\}$ con $${p.g}^${p.m}\neq e$.`, 'error-de-calculo', '$g^m=e$ por definición del orden; el neutro está en la lista.'], ['L4', r`Entonces $${p.g}^${p.n}=${p.g}^{${p.m}+q}=${p.g}^q$.`, 'error-de-calculo', 'Hay que **multiplicar** los exponentes: $g^{mq}=(g^m)^q$.']],
    valida: [['lagrange', r`Probar $|\langle g\rangle|=\operatorname{ord}(g)$ y aplicar Lagrange`, 'Es la prueba estándar.']],
    idea: p => r`el subgrupo cíclico de $${p.g}$ tiene $${p.m}$ elementos, que divide a $${p.n}$.`, primero: p => r`describe $\langle ${p.g}\rangle$ y cuenta sus elementos.`,
  });

  R.nivel({
    id: '8.2', mundo: 8, titulo: 'Subgrupos y Lagrange', tema: 'Subgrupos, órdenes y el teorema de Lagrange',
    habilidades: ['8.2.subgrupos', '8.2.ordenes', '8.2.generados', '8.2.lagrange', '8.2.demostrar'],
    teoremas: ['t.subgrupo-criterio', 't.clases-laterales', 't.lagrange', 't.orden-divide'],
    leccion: {
      intro: 'Un **subgrupo** $H\\le G$ es un subconjunto que es grupo por sí mismo. El **orden** de $g$ es el menor $m$ con $g^m=e$; el subgrupo generado por $g$ es $\\langle g\\rangle=\\{e,g,\\dots,g^{m-1}\\}$.',
      definiciones: [
        { nombre: 'Criterio', tex: '$H\\neq\\emptyset$ es subgrupo si y solo si $ab^{-1}\\in H$ para todos $a,b\\in H$. En $(\\mathbb{Z}_n,+)$ los subgrupos son $\\langle d\\rangle$ con $d\\mid n$.' },
        { nombre: 'Orden de un elemento', tex: 'En $(\\mathbb{Z}_n,+)$: $\\operatorname{ord}(a)=n/\\gcd(a,n)$. En $S_n$: el mcm de las longitudes de los ciclos. En $\\mathbb{Z}_n^\\times$: se calcula con potencias.' },
        { nombre: 'Lagrange', tex: 'Las clases laterales $aH$ particionan $G$ en $[G:H]$ trozos de tamaño $|H|$; así $|G|=[G:H]|H|$ y $|H|$ **divide** a $|G|$.' },
        { nombre: 'Consecuencia', tex: '$\\operatorname{ord}(g)$ divide a $|G|$ y $g^{|G|}=e$. En $\\mathbb{Z}_n^\\times$ esto es el teorema de Euler: $a^{\\varphi(n)}\\equiv1$.' },
      ],
      teorema: 't.lagrange',
      ejemplo: { enunciado: '¿Puede $\\mathbb{Z}_{12}^\\times$ tener un elemento de orden $3$?', pasos: ['$|\\mathbb{Z}_{12}^\\times|=\\varphi(12)=4$.', 'El orden de un elemento divide a $4$: solo $1$, $2$ o $4$.', 'Como $3\\nmid4$, no puede haber elementos de orden $3$.'] },
    },
  });

  if (typeof module !== 'undefined') module.exports = AC;
})(globalThis.AC = globalThis.AC || {});
