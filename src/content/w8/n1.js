/* Mundo 8, nivel 8.1 — Grupos. */
(function (AC) {
  const { R, H, T, gen, dem2 } = AC.cont, r = String.raw, G = AC.grupos, N = AC.numth, M = AC.mat, Rat = AC.Rat, C = AC.conj;
  const ref = (id, tipo, nombre) => R.ref({ id, tipo, nombre });
  ref('d.grupo', 'definicion', 'Grupo (G,∗): cerrado, asociativo, con elemento neutro e y con inverso a⁻¹ para cada a'); ref('d.unidades-zn', 'definicion', 'ℤₙ^×: clases de ℤₙ con inverso multiplicativo (coprimas con n)'); ref('d.permutacion', 'definicion', 'S_n: permutaciones de {1,…,n} con la composición');

  const HB = (id, nombre) => R.habilidad({ id: '8.1.' + id, nombre, nivel: '8.1' });
  HB('reconocer', 'Reconocer grupos'); HB('unidades', 'Unidades de ℤₙ'); HB('permutaciones', 'Permutaciones'); HB('tablas', 'Tablas de operación'); HB('demostrar', 'Demostrar con grupos');
  const TE = (id, titulo, enunciado, requiere, hab) => R.teorema({ id, titulo, nivel: '8.1', enunciado, requiere, habilidades: hab });
  TE('t.grupo-unicidad', 'Neutro e inversos únicos', r`En un grupo el elemento neutro es único y cada elemento tiene un único inverso.`, [], ['8.1.reconocer', '8.1.demostrar']);
  TE('t.grupo-cancelacion', 'Cancelación', r`En un grupo, $ab=ac\Rightarrow b=c$, y la ecuación $ax=b$ tiene la única solución $x=a^{-1}b$.`, ['t.grupo-unicidad'], ['8.1.reconocer', '8.1.tablas', '8.1.demostrar']);
  TE('t.grupo-inverso-producto', 'Inverso de un producto', r`En un grupo, $(ab)^{-1}=b^{-1}a^{-1}$.`, ['t.grupo-unicidad'], ['8.1.permutaciones', '8.1.reconocer', '8.1.demostrar']);
  TE('t.unidades-grupo', 'El grupo de unidades de ℤₙ', r`Las clases de $\mathbb{Z}_n$ coprimas con $n$ forman un grupo con la multiplicación, de orden $\varphi(n)$.`, ['t.inverso-modular', 't.cong-operaciones'], ['8.1.unidades', '8.1.tablas', '8.1.demostrar']);

  const par = v => '(' + v.join(',') + ')';
  const tabla = (el, n) => el.map(a => el.map(b => (a * b) % n));
  const tx = A => M.tex(A.map(f => f.map(x => Rat.of(x))));
  const CONJ = [
    ['(\\mathbb{Z},+)', true, 'Es el grupo aditivo de los enteros: neutro $0$ e inverso $-a$.'], ['(\\mathbb{R},+)', true, 'Neutro $0$ e inverso $-a$.'], ['(\\mathbb{Q}\\setminus\\{0\\},\\cdot)', true, 'Neutro $1$ e inverso $1/a$.'], ['(\\{1,-1\\},\\cdot)', true, 'Cerrado: $(-1)(-1)=1$; cada elemento es su propio inverso.'], ['(\\mathbb{R}\\setminus\\{0\\},\\cdot)', true, 'Neutro $1$ e inverso $1/a$.'],
    ['(\\mathbb{N},+)', false, 'No hay inversos: $-3\\notin\\mathbb{N}$.'], ['(\\mathbb{Z},\\cdot)', false, 'Solo $\\pm1$ tienen inverso en $\\mathbb{Z}$.'], ['(\\mathbb{R},\\cdot)', false, 'El $0$ no tiene inverso multiplicativo.'], ['(\\mathbb{Z},-)', false, 'La resta no es asociativa: $(3-2)-1\\neq3-(2-1)$.'], ['(M_2(\\mathbb{R}),\\cdot)', false, 'No toda matriz tiene inversa (las singulares).'],
  ];

  /* ---------- generadores ---------- */
  gen.multiple({
    id: 'w8.n1.cuales-grupos', nivel: '8.1', habilidades: ['8.1.reconocer'], dificultad: 2,
    hacer(rng) {
      const n = rng.pick([5, 6, 7, 8, 9, 10, 12]), extra = [[`(\\mathbb{Z}_{${n}},+)`, true, 'Es el grupo cíclico aditivo de orden $' + n + '$: neutro $0$ e inverso $-a$.'], [`(\\mathbb{Z}_{${n}},\\cdot)`, false, 'El $0$ no tiene inverso multiplicativo (y otros elementos tampoco si $' + n + '$ no es primo).'], [`(\\mathbb{Z}_{${n}}^\\times,\\cdot)`, true, 'Son las clases coprimas con $' + n + '$: cada una tiene inverso.']];
      const si = rng.sample(CONJ.filter(c => c[1]).concat(extra.filter(c => c[1])), rng.int(1, 2)), no = rng.sample(CONJ.filter(c => !c[1]).concat(extra.filter(c => !c[1])), rng.int(2, 3)), ops = rng.shuffle(si.concat(no)), ok = ops.map((c, i) => (c[1] ? i : -1)).filter(i => i >= 0);
      return { key: ops.map(c => c[0]).join('|'), enun: 'Marca todas las estructuras que son **grupos**.', opciones: ops.map(c => '$' + c[0] + '$'), ok, msg: (j, es) => (es ? 'Sí es grupo: ' : 'No es grupo: ') + ops[j][2],
        pistas: ['Orientación: comprueba cerradura, asociatividad, neutro e inversos.', 'Idea clave: el fallo más común es que algún elemento no tenga inverso (el $0$ al multiplicar).', 'Primer paso: ¿hay elemento neutro y cada elemento tiene inverso?'], expl: 'Son grupos: ' + si.map(c => '$' + c[0] + '$').join(', ') + '.' };
    },
  });

  gen.conjunto({
    id: 'w8.n1.unidades', nivel: '8.1', habilidades: ['8.1.unidades'], dificultad: 2,
    hacer(rng) {
      const n = rng.int(6, 45), u = G.unidades(n); if (u.length < 2 || u.length > 16) return null; const res = u.map(String);
      return { key: String(n), enun: 'Escribe el conjunto de **unidades** de $\\mathbb{Z}_{' + n + '}$ (las clases $a\\in\\{1,\\dots,' + (n - 1) + '\\}$ con inverso multiplicativo).', res, norm: 'racional',
        firmas: [['todos-los-no-nulos', Array.from({ length: n - 1 }, (_, i) => String(i + 1)), 'No todas tienen inverso: $a$ es unidad exactamente cuando $\\gcd(a,' + n + ')=1$.'], ['primos', [...Array(n - 1).keys()].map(i => i + 1).filter(k => N.esPrimo(k)).map(String), 'No hace falta que $a$ sea primo: basta que sea coprimo con $' + n + '$ (por ejemplo, $1$ siempre).']].filter(f => C.fmt(f[1]) !== C.fmt(res)),
        pistas: ['Orientación: $a$ es unidad en $\\mathbb{Z}_n$ si y solo si $\\gcd(a,n)=1$.', 'Idea clave: ve elemento por elemento calculando el mcd con $' + n + '$.', 'Primer paso: factoriza $' + n + '$ y descarta los múltiplos de sus primos.'], expl: 'Las unidades son ' + C.tex(res) + ' ($\\varphi(' + n + ')=' + u.length + '$).' };
    },
  });

  gen.entero({
    id: 'w8.n1.inverso-en-grupo', nivel: '8.1', habilidades: ['8.1.unidades', '8.1.reconocer'], dificultad: 2,
    hacer(rng) {
      const n = rng.int(7, 40), u = G.unidades(n); if (u.length < 3) return null; const a = rng.pick(u), inv = N.inverso(a, n), pide = rng.pick(['mult', 'suma']);
      return pide === 'mult' ? { key: 'm' + a + ',' + n, enun: 'En el grupo $(\\mathbb{Z}_{' + n + '}^\\times,\\cdot)$, ¿cuál es el inverso de $' + a + '$? (un representante entre $1$ y $' + (n - 1) + '$).', res: inv,
        firmas: [['opuesto', n - a, 'Ese es el opuesto aditivo; aquí el grupo es multiplicativo: $a\\cdot a^{-1}\\equiv1$.'], ['mismo', a, 'Comprueba que $' + a + '\\cdot' + a + '\\equiv1$ (mod $' + n + '$): en general no.']].filter(f => f[1] !== inv && f[1] > 0),
        pistas: ['Orientación: busca $x$ con $' + a + 'x\\equiv1\\pmod{' + n + '}$.', 'Idea clave: usa el algoritmo de Euclides extendido (Bézout).', 'Primer paso: calcula $\\gcd(' + a + ',' + n + ')$.'], expl: '$' + a + '\\cdot' + inv + '\\equiv1\\pmod{' + n + '}$.' }
        : { key: 's' + a + ',' + n, enun: 'En el grupo $(\\mathbb{Z}_{' + n + '},+)$, ¿cuál es el inverso (opuesto) de $' + a + '$? (un representante entre $0$ y $' + (n - 1) + '$).', res: n - a,
        firmas: [['inverso-mult', inv, 'Ese es el inverso multiplicativo; en el grupo aditivo el inverso de $a$ es $-a$.'], ['mismo', a, 'Solo $a=-a$ cuando $2a\\equiv0$.']].filter(f => f[1] !== n - a && f[1] > 0),
        pistas: ['Orientación: el neutro de la suma es $0$.', 'Idea clave: busca $x$ con $' + a + '+x\\equiv0\\pmod{' + n + '}$.', 'Primer paso: calcula $' + n + '-' + a + '$.'], expl: '$-' + a + '\\equiv' + (n - a) + '\\pmod{' + n + '}$.' };
    },
  });

  gen.entero({
    id: 'w8.n1.orden-unidades', nivel: '8.1', habilidades: ['8.1.unidades'], dificultad: 2,
    hacer(rng) {
      const n = rng.int(6, 60), phi = N.phi(n); if (phi < 3) return null;
      return { key: String(n), enun: '¿Cuántos elementos tiene el grupo $(\\mathbb{Z}_{' + n + '}^\\times,\\cdot)$ (su **orden**)?', res: phi,
        firmas: [['n-menos-uno', n - 1, 'No todas las clases no nulas son unidades: solo las coprimas con $n$.'], ['n', n, 'Eso es $|\\mathbb{Z}_n|$; las unidades son las coprimas con $n$ y su número es $\\varphi(n)$.']].filter(f => f[1] !== phi),
        pistas: ['Orientación: el orden es $\\varphi(' + n + ')$.', 'Idea clave: si $n=p_1^{a_1}\\cdots p_k^{a_k}$, $\\varphi(n)=n\\prod(1-1/p_i)$.', 'Primer paso: factoriza $' + n + '$.'], expl: '$\\varphi(' + n + ')=' + phi + '$.' };
    },
  });

  gen.tupla({
    id: 'w8.n1.componer-permutaciones', nivel: '8.1', habilidades: ['8.1.permutaciones'], dificultad: 3,
    hacer(rng) {
      const n = rng.int(3, 4), ps = G.permutaciones(n), p = rng.pick(ps), q = rng.pick(ps), c = G.compose(p, q), c2 = G.compose(q, p); if (c.join() === c2.join()) return null; const fin = x => '$' + G.textoCiclos(x) + '$';
      return { key: p.join() + q.join(), enun: 'En $S_' + n + '$ sean $\\sigma=' + par(p) + '$ y $\\tau=' + par(q) + '$ en notación de una línea ($\\sigma(i)$ es la $i$-ésima entrada). Calcula $\\sigma\\circ\\tau$ (primero $\\tau$) y escríbela en notación de una línea.', campos: Array.from({ length: n }, (_, i) => '(' + (i + 1) + ')'), res: c.map(String),
        firmas: [['orden-invertido', c2.map(String), 'En $\\sigma\\circ\\tau$ se aplica **primero** $\\tau$ y luego $\\sigma$.']],
        pistas: ['Orientación: $(\\sigma\\circ\\tau)(i)=\\sigma(\\tau(i))$.', 'Idea clave: para cada $i$, mira $\\tau(i)$ y luego aplícale $\\sigma$.', 'Primer paso: calcula $\\tau(1)$ y después $\\sigma(\\tau(1))$.'], expl: '$\\sigma\\circ\\tau=' + par(c) + '$.' };
    },
  });

  gen.tupla({
    id: 'w8.n1.inversa-permutacion', nivel: '8.1', habilidades: ['8.1.permutaciones'], dificultad: 2,
    hacer(rng) {
      const n = rng.int(3, 5), p = rng.pick(G.permutaciones(n)), i = G.inversaPerm(p); if (p.join() === i.join()) return null;
      return { key: p.join(), enun: 'En $S_' + n + '$, $\\sigma=' + par(p) + '$ (notación de una línea). Halla $\\sigma^{-1}$.', campos: Array.from({ length: n }, (_, k) => '(' + (k + 1) + ')'), res: i.map(String),
        firmas: [['misma', p.map(String), 'Esa es $\\sigma$; en su inversa, si $\\sigma(i)=j$ entonces $\\sigma^{-1}(j)=i$.'], ['reflejada', p.slice().reverse().map(String), 'La inversa no es el reverso de la lista.']].filter(f => f[1].join() !== i.join()),
        pistas: ['Orientación: $\\sigma^{-1}(j)$ es el $i$ tal que $\\sigma(i)=j$.', 'Idea clave: busca en qué posición aparece cada número.', 'Primer paso: ¿en qué posición aparece el $1$?'], expl: '$\\sigma^{-1}=' + par(i) + '$.' };
    },
  });

  gen.eleccion({
    id: 'w8.n1.que-axioma-falla', nivel: '8.1', habilidades: ['8.1.reconocer'], dificultad: 3,
    hacer(rng) {
      const casos = [['(\\mathbb{N},+)', 'inverso', 'Faltan inversos: el opuesto de $3$ no está en $\\mathbb{N}$.'], ['(\\mathbb{Z},\\cdot)', 'inverso', 'Faltan inversos: $2$ no tiene inverso entero.'], ['(\\mathbb{Z},-)', 'asoc', 'La resta no es asociativa.'], ['(\\mathbb{R},\\cdot)', 'inverso', 'El $0$ no tiene inverso.'], ['(\\mathbb{Z}_{6}\\setminus\\{0\\},\\cdot)', 'cerr', 'No es cerrado: $2\\cdot3\\equiv0$.'], ['(\\{x\\in\\mathbb{R}:x>0\\},-)', 'cerr', 'No es cerrado: $1-2<0$.'], ['(\\mathbb{Z},\\max)', 'inverso', 'No hay neutro con inversos: $\\max(a,b)$ no permite deshacer.'], ['(2\\mathbb{Z}\\setminus\\{0\\},+)', 'cerr', 'No es cerrado: $2+(-2)=0\\notin$.']];
      const nn = rng.pick([4, 6, 8, 9, 10, 12, 14, 15, 16, 18, 20, 21]); casos.push(['(\\mathbb{Z}_{' + nn + '}\\setminus\\{0\\},\\cdot)', 'cerr', 'No es cerrado: hay divisores de cero en \\(\\mathbb{Z}_{' + nn + '}\\)' + ' (por ejemplo, un producto de dos clases no nulas da $0$).'], ['(\\mathbb{Z}_{' + nn + '},\\cdot)', 'inverso', 'El $0$ no tiene inverso multiplicativo.']);
      const [t, k, m] = rng.pick(casos), nom = { cerr: 'no es cerrado bajo la operación', asoc: 'la operación no es asociativa', neutro: 'no tiene elemento neutro', inverso: 'algún elemento no tiene inverso' };
      return { key: t, enun: 'La estructura $' + t + '$ **no** es un grupo. ¿Qué propiedad falla?', ok: nom[k], malas: Object.keys(nom).filter(x => x !== k).map(x => ['otra-' + x, nom[x], 'Esa propiedad sí se cumple o no es la determinante. ' + m]),
        pistas: ['Orientación: revisa una por una las cuatro propiedades.', 'Idea clave: busca un contraejemplo concreto.', 'Primer paso: ¿es cerrada la operación?'], expl: m };
    },
  });

  gen.matriz({
    id: 'w8.n1.tabla-unidades', nivel: '8.1', habilidades: ['8.1.tablas', '8.1.unidades'], dificultad: 3,
    hacer(rng) {
      const n = rng.pick([8, 10, 12, 18]), u = rng.shuffle(G.unidades(n)); if (u.length < 3 || u.length > 6) return null; const t = tabla(u, n);
      return { key: n + ':' + u.join(), enun: 'Completa la tabla de multiplicar del grupo $(\\mathbb{Z}_{' + n + '}^\\times,\\cdot)$, con filas y columnas ordenadas como $' + u.join(',\\ ') + '$ (la entrada $(i,j)$ es el producto de la fila $i$ por la columna $j$ módulo $' + n + '$).', res: t.map(f => f.map(String)), etiqueta: 'tabla',
        firmas: [['sin-reducir', u.map(a => u.map(b => String(a * b))), 'Hay que reducir cada producto módulo $' + n + '$.'], ['transpuesta-con-suma', u.map(a => u.map(b => String((a + b) % n))), 'La operación del grupo es la **multiplicación** módulo $' + n + '$, no la suma.']].filter(f => JSON.stringify(f[1]) !== JSON.stringify(t.map(x => x.map(String)))),
        pistas: ['Orientación: multiplica y reduce módulo $' + n + '$.', 'Idea clave: cada fila y cada columna contiene todos los elementos una sola vez (cancelación).', 'Primer paso: la fila del $1$ repite la lista de columnas.'], expl: 'La tabla es $' + tx(t) + '$.' };
    },
  });

  /* ---------- demostraciones ---------- */
  dem2({
    id: 'dem.grupo-unicidad', teorema: 't.grupo-unicidad', nivel: '8.1', habilidades: ['8.1.reconocer', '8.1.demostrar'], requiere: [], refsExtra: ['d.grupo', 'b.arbitrario'],
    param: rng => ({ e: rng.pick(['e', 'u']), f: rng.pick(['e_2', 'f']), b: rng.pick(['b', 'x']), c: rng.pick(['c', 'y']) }),
    enunciado: p => r`Sea $(G,\ast)$ un grupo. Demuestra que (a) el neutro es único y (b) cada $a$ tiene un único inverso.`,
    hip: p => [r`$(G,\ast)$ es un grupo`, 'Basta usar los axiomas'], meta: p => r`neutro e inverso únicos`,
    L: p => [
      ['L1', r`(a) Sean $${p.e}$ y $${p.f}$ elementos neutros. Como $${p.e}$ es neutro, $${p.e}\ast ${p.f}=${p.f}$.`, 'd.grupo'],
      ['L2', r`Como $${p.f}$ es neutro, $${p.e}\ast ${p.f}=${p.e}$.`, 'd.grupo', ['L1']],
      ['L3', r`Luego $${p.e}=${p.e}\ast ${p.f}=${p.f}$: el neutro es único.`, 'b.arbitrario', ['L1', 'L2']],
      ['L4', r`(b) Sean $${p.b},${p.c}$ inversos de $a$: $a\ast ${p.b}=${p.b}\ast a=e$ y $a\ast ${p.c}=${p.c}\ast a=e$. Entonces $${p.b}=${p.b}\ast e=${p.b}\ast(a\ast ${p.c})=(${p.b}\ast a)\ast ${p.c}=e\ast ${p.c}=${p.c}$ por ⟦h1⟧.`, 'd.grupo', ['L3'], [H('h1', 'la asociatividad', ['la asociatividad', 'la conmutatividad', 'la cerradura'], false)]],
      ['L5', r`Por tanto el inverso de $a$ es único. ∎`, 'd.grupo', ['L4']],
    ],
    dist: p => [[r`En $(\mathbb{Z},+)$ el neutro es $0$ y es único; luego siempre.`, 'un ejemplo no prueba el caso general'], [r`Como el neutro actúa sobre todos, no puede haber otro.`, 'hay que probarlo con dos neutros']],
    err: p => [['L2', r`Como $${p.f}$ es neutro, $${p.e}\ast ${p.f}=${p.f}$ también.`, 'conclusion-invalida', 'Al ser $f$ neutro, $e\\ast f=e$ (cada neutro actúa sobre el otro).'], ['L4', r`Entonces $${p.b}=${p.b}\ast e=${p.b}\ast(a\ast ${p.c})=(${p.b}\ast a)\ast ${p.c}=e\ast ${p.c}=${p.b}$.`, 'error-de-calculo', 'La cadena termina en $c$.']],
    valida: [['dos-neutros', r`Considerar dos neutros (e inversos) y compararlos con asociatividad`, 'Es la prueba estándar.']],
    idea: p => r`un elemento que es neutro (o inverso) por los dos lados fuerza a dos candidatos a coincidir.`, primero: p => r`toma dos neutros $${p.e},${p.f}$ y calcula $${p.e}\ast ${p.f}$.`,
  });

  dem2({
    id: 'dem.grupo-cancelacion', teorema: 't.grupo-cancelacion', nivel: '8.1', habilidades: ['8.1.reconocer', '8.1.tablas', '8.1.demostrar'], requiere: ['t.grupo-unicidad'], refsExtra: ['d.grupo', 'b.doble-implicacion'],
    param: rng => ({ b: rng.pick(['b', 'x']), c: rng.pick(['c', 'y']), x: rng.pick(['x', 'z']) }),
    enunciado: p => r`Sea $(G,\ast)$ un grupo. Demuestra que si $a\ast ${p.b}=a\ast ${p.c}$ entonces $${p.b}=${p.c}$, y que $a\ast x=${p.b}$ tiene como única solución $x=a^{-1}\ast ${p.b}$.`,
    hip: p => [r`$(G,\ast)$ grupo, $a,${p.b},${p.c}\in G$`, 'Puedes citar la unicidad del neutro y del inverso'], meta: p => r`cancelación y solución única de $ax=b$`,
    L: p => [
      ['L1', r`Sea $a\ast ${p.b}=a\ast ${p.c}$. Operando por la izquierda con $a^{-1}$: $a^{-1}\ast(a\ast ${p.b})=a^{-1}\ast(a\ast ${p.c})$.`, 'd.grupo'],
      ['L2', r`Por asociatividad, $(a^{-1}\ast a)\ast ${p.b}=(a^{-1}\ast a)\ast ${p.c}$, es decir, $e\ast ${p.b}=e\ast ${p.c}$.`, 'd.grupo', ['L1']],
      ['L3', r`Como $e$ es neutro, $${p.b}=${p.c}$. Esto prueba la cancelación.`, 't.grupo-unicidad', ['L2']],
      ['L4', r`Existencia: $x=a^{-1}\ast ${p.b}$ cumple $a\ast x=(a\ast a^{-1})\ast ${p.b}=e\ast ${p.b}=${p.b}$.`, 'd.grupo', ['L3']],
      ['L5', r`Unicidad: si $a\ast x=${p.b}=a\ast x'$, por ⟦h1⟧ resulta $x=x'$. ∎`, 'b.doble-implicacion', ['L3', 'L4'], [H('h1', 'cancelación', ['cancelación', 'conmutatividad', 'existencia'], false)]],
    ],
    dist: p => [[r`En $\mathbb{Z}_5^\times$ se cumple; luego siempre.`, 'un ejemplo no prueba el caso general'], [r`Como $a\ast ${p.b}=a\ast ${p.c}$, se puede dividir entre $a$ en cualquier estructura.`, 'solo en grupos (existe $a^{-1}$)']],
    err: p => [['L1', r`Operando por la derecha con $a^{-1}$: $(a\ast ${p.b})\ast a^{-1}=(a\ast ${p.c})\ast a^{-1}$.`, 'conclusion-invalida', 'Con $a$ a la izquierda hay que operar por la izquierda (el grupo puede no ser conmutativo).'], ['L4', r`Existencia: $x=${p.b}\ast a^{-1}$ cumple $a\ast x=${p.b}$.`, 'error-de-calculo', 'Hay que multiplicar por la izquierda: $x=a^{-1}\\ast b$.']],
    valida: [['inverso', r`Operar por la izquierda con $a^{-1}$`, 'Es la prueba estándar.']],
    idea: p => r`multiplicar por $a^{-1}$ por la izquierda deshace $a$.`, primero: p => r`aplica $a^{-1}\ast$ a ambos lados de $a\ast ${p.b}=a\ast ${p.c}$.`,
  });

  dem2({
    id: 'dem.grupo-inverso-producto', teorema: 't.grupo-inverso-producto', nivel: '8.1', habilidades: ['8.1.permutaciones', '8.1.reconocer', '8.1.demostrar'], requiere: ['t.grupo-unicidad'], refsExtra: ['d.grupo', 'd.permutacion'],
    param: rng => ({ a: rng.pick(['a', 'x']), b: rng.pick(['b', 'y']) }),
    enunciado: p => r`Sea $(G,\ast)$ un grupo. Demuestra que $(${p.a}\ast ${p.b})^{-1}=${p.b}^{-1}\ast ${p.a}^{-1}$.`,
    hip: p => [r`$(G,\ast)$ grupo, $${p.a},${p.b}\in G$`, 'Puedes citar la unicidad del inverso'], meta: p => r`$(${p.a}${p.b})^{-1}=${p.b}^{-1}${p.a}^{-1}$`,
    L: p => [
      ['L1', r`Calculamos $(${p.a}\ast ${p.b})\ast(${p.b}^{-1}\ast ${p.a}^{-1})=${p.a}\ast(${p.b}\ast ${p.b}^{-1})\ast ${p.a}^{-1}$ por asociatividad.`, 'd.grupo'],
      ['L2', r`Como $${p.b}\ast ${p.b}^{-1}=e$, esto es $${p.a}\ast e\ast ${p.a}^{-1}=${p.a}\ast ${p.a}^{-1}=e$.`, 'd.grupo', ['L1']],
      ['L3', r`Análogamente $(${p.b}^{-1}\ast ${p.a}^{-1})\ast(${p.a}\ast ${p.b})=${p.b}^{-1}\ast(${p.a}^{-1}\ast ${p.a})\ast ${p.b}=${p.b}^{-1}\ast ${p.b}=e$.`, 'd.grupo', ['L2']],
      ['L4', r`Luego $${p.b}^{-1}\ast ${p.a}^{-1}$ es un inverso de $${p.a}\ast ${p.b}$ y, por la ⟦h1⟧ del inverso, es **el** inverso. ∎`, 't.grupo-unicidad', ['L2', 'L3'], [H('h1', 'unicidad', ['unicidad', 'existencia', 'conmutatividad'], false)]],
    ],
    dist: p => [[r`En $S_3$ con dos transposiciones se verifica; luego siempre.`, 'un ejemplo no prueba el caso general'], [r`Como los inversos se conservan, $(${p.a}\ast ${p.b})^{-1}=${p.a}^{-1}\ast ${p.b}^{-1}$.`, 'el orden se invierte (solo coinciden en grupos conmutativos)']],
    err: p => [['L1', r`Calculamos $(${p.a}\ast ${p.b})\ast(${p.a}^{-1}\ast ${p.b}^{-1})=${p.a}\ast(${p.b}\ast ${p.a}^{-1})\ast ${p.b}^{-1}$.`, 'conclusion-invalida', 'Con ese orden no se cancela nada: hay que usar $b^{-1}a^{-1}$.'], ['L3', r`$(${p.b}^{-1}\ast ${p.a}^{-1})\ast(${p.a}\ast ${p.b})=${p.b}^{-1}\ast ${p.b}\ast ${p.a}^{-1}\ast ${p.a}=${p.a}$.`, 'error-de-calculo', 'Los inversos se cancelan en el centro: $a^{-1}a=e$.']],
    valida: [['multiplicar', r`Multiplicar $ab$ por $b^{-1}a^{-1}$ en ambos órdenes y usar unicidad`, 'Es la prueba estándar.']],
    idea: p => r`los factores internos $${p.b}\ast ${p.b}^{-1}$ se cancelan.`, primero: p => r`calcula $(${p.a}\ast ${p.b})\ast(${p.b}^{-1}\ast ${p.a}^{-1})$.`,
  });

  dem2({
    id: 'dem.unidades-grupo', teorema: 't.unidades-grupo', nivel: '8.1', habilidades: ['8.1.unidades', '8.1.tablas', '8.1.demostrar'], requiere: ['t.inverso-modular', 't.cong-operaciones'], refsExtra: ['d.unidades-zn', 'd.grupo', 'd.congruencia', 'd.mcd'],
    param: rng => ({ n: rng.pick(['n', 'm']), a: rng.pick(['a', 'x']), b: rng.pick(['b', 'y']) }),
    enunciado: p => r`Demuestra que $U_${p.n}=\{a\in\mathbb{Z}_${p.n}:\gcd(a,${p.n})=1\}$ es un grupo con la multiplicación módulo $${p.n}$.`,
    hip: p => [r`$${p.n}\ge2$`, 'Puedes citar la existencia del inverso modular y las operaciones con congruencias'], meta: p => r`$(U_${p.n},\cdot)$ es un grupo`,
    L: p => [
      ['L1', r`Cerradura: si $\gcd(${p.a},${p.n})=\gcd(${p.b},${p.n})=1$, entonces $\gcd(${p.a}${p.b},${p.n})=1$ (un primo que divide a $${p.a}${p.b}$ y a $${p.n}$ dividiría a $${p.a}$ o a $${p.b}$, lema de Euclides), y la multiplicación módulo $${p.n}$ está bien definida.`, 't.cong-operaciones'],
      ['L2', r`Asociatividad: viene de la asociatividad de $\mathbb{Z}$ y de que las congruencias respetan el producto.`, 't.cong-operaciones', ['L1']],
      ['L3', r`Neutro: $1\in U_${p.n}$ y $1\cdot ${p.a}\equiv ${p.a}$.`, 'd.unidades-zn', ['L1']],
      ['L4', r`Inversos: si $\gcd(${p.a},${p.n})=1$, existe $${p.a}^{-1}$ con $${p.a}\,${p.a}^{-1}\equiv1\pmod{${p.n}}$ (teorema del inverso modular), y ⟦h1⟧ también es coprimo con $${p.n}$.`, 't.inverso-modular', ['L1'], [H('h1', r`$${p.a}^{-1}$`, [r`$${p.a}^{-1}$`, r`$${p.n}$`, r`$0$`], false)]],
      ['L5', r`Se cumplen los cuatro axiomas: $(U_${p.n},\cdot)$ es un grupo, de orden $\varphi(${p.n})$. ∎`, 'd.grupo', ['L1', 'L2', 'L3', 'L4']],
    ],
    dist: p => [[r`Para $n=7$ se verifica; luego siempre.`, 'un ejemplo no prueba el caso general'], [r`Todo $\mathbb{Z}_${p.n}$ es un grupo para la multiplicación.`, 'el $0$ no tiene inverso, y tampoco los no coprimos']],
    err: p => [['L1', r`Cerradura: si $\gcd(${p.a},${p.n})=\gcd(${p.b},${p.n})=1$, entonces $\gcd(${p.a}+${p.b},${p.n})=1$.`, 'error-de-calculo', 'La operación es el producto, no la suma.'], ['L4', r`Inversos: si $\gcd(${p.a},${p.n})=1$, el inverso es $${p.n}-${p.a}$.`, 'error-de-calculo', '$n-a$ es el opuesto aditivo; el inverso se halla con Bézout.']],
    valida: [['axiomas', r`Comprobar cerradura, asociatividad, neutro e inversos`, 'Es la prueba estándar.']],
    idea: p => r`el producto de coprimos es coprimo y Bézout da el inverso.`, primero: p => r`prueba la cerradura con el lema de Euclides.`,
  });

  R.nivel({
    id: '8.1', mundo: 8, titulo: 'Grupos', tema: 'Grupos, unidades de ℤₙ y permutaciones',
    habilidades: ['8.1.reconocer', '8.1.unidades', '8.1.permutaciones', '8.1.tablas', '8.1.demostrar'],
    teoremas: ['t.grupo-unicidad', 't.grupo-cancelacion', 't.grupo-inverso-producto', 't.unidades-grupo'],
    leccion: {
      intro: 'Un **grupo** $(G,\\ast)$ es un conjunto con una operación cerrada y asociativa, con elemento neutro $e$ y un inverso $a^{-1}$ para cada elemento. Los enteros con la suma, las unidades de $\\mathbb{Z}_n$ con el producto y las permutaciones con la composición son ejemplos.',
      definiciones: [
        { nombre: 'Propiedades básicas', tex: 'El neutro y los inversos son únicos; se puede **cancelar** ($ab=ac\\Rightarrow b=c$); $(ab)^{-1}=b^{-1}a^{-1}$. Cada fila y cada columna de la tabla de un grupo contiene cada elemento una sola vez.' },
        { nombre: 'Unidades de ℤₙ', tex: '$\\mathbb{Z}_n^\\times=\\{a:\\gcd(a,n)=1\\}$ es un grupo para el producto, de orden $\\varphi(n)$. Por ejemplo $\\mathbb{Z}_{12}^\\times=\\{1,5,7,11\\}$.' },
        { nombre: 'Permutaciones', tex: '$S_n$ tiene $n!$ elementos; la operación es componer ($\\sigma\\circ\\tau$ aplica primero $\\tau$). No es conmutativa para $n\\ge3$.' },
        { nombre: 'Qué puede fallar', tex: '$(\\mathbb{N},+)$ no tiene inversos; $(\\mathbb{Z},\\cdot)$ tampoco; $(\\mathbb{Z},-)$ no es asociativa; $(\\mathbb{Z}_n,\\cdot)$ no es grupo porque $0$ no tiene inverso.' },
      ],
      teorema: 't.unidades-grupo',
      ejemplo: { enunciado: 'Halla el inverso de $5$ en $\\mathbb{Z}_{12}^\\times$.', pasos: ['$\\gcd(5,12)=1$, así que $5$ es unidad.', 'Buscamos $x$ con $5x\\equiv1\\pmod{12}$: $5\\cdot5=25\\equiv1$.', 'Luego $5^{-1}=5$ (cada elemento de $\\mathbb{Z}_{12}^\\times$ es su propio inverso).'] },
    },
  });

  if (typeof module !== 'undefined') module.exports = AC;
})(globalThis.AC = globalThis.AC || {});
