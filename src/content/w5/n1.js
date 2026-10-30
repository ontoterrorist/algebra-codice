/* Mundo 5, nivel 5.1 — Subespacios. (Todos los espacios son sobre ℚ; los enunciados dicen «sobre ℝ».) */
(function (AC) {
  const { R, H, T, gen, dem2 } = AC.cont, r = String.raw, M = AC.mat, Rat = AC.Rat;
  const ref = (id, tipo, nombre) => R.ref({ id, tipo, nombre });
  ref('d.espacio-vectorial', 'definicion', 'Espacio vectorial: conjunto con suma y producto por escalares que cumplen los axiomas (asociatividad, conmutatividad, cero, opuesto, distributividades, neutro del escalar 1)');
  ref('d.subespacio', 'definicion', 'Subespacio: subconjunto W de V que es espacio vectorial con las mismas operaciones'); ref('b.axiomas-heredados', 'propiedad-base', 'Los axiomas de identidades (asociatividad, conmutatividad, distributividad) valen en W porque valen en V');
  ref('d.nucleo', 'definicion', 'Núcleo de A: {x : Ax = 0}');

  const HB = (id, nombre) => R.habilidad({ id: '5.1.' + id, nombre, nivel: '5.1' });
  HB('reconocer', 'Reconocer subespacios'); HB('propiedades', 'Propiedades que fallan'); HB('nucleo', 'Núcleos e intersecciones'); HB('parametros', 'Parámetros'); HB('demostrar', 'Demostrar con subespacios');
  const TE = (id, titulo, enunciado, requiere, hab) => R.teorema({ id, titulo, nivel: '5.1', enunciado, requiere, habilidades: hab });
  TE('t.subespacio-criterio', 'Criterio del subespacio', r`Un subconjunto no vacío $W\subseteq V$ es subespacio si y solo si es cerrado bajo la suma y bajo el producto por escalares.`, [], ['5.1.reconocer', '5.1.propiedades', '5.1.demostrar']);
  TE('t.nucleo-subespacio', 'El núcleo es subespacio', r`Para toda matriz $A$, $\ker A=\{x:Ax=0\}$ es un subespacio.`, ['t.subespacio-criterio'], ['5.1.nucleo', '5.1.reconocer', '5.1.demostrar']);
  TE('t.interseccion-subespacios', 'Intersección de subespacios', r`Si $W_1,W_2$ son subespacios de $V$, $W_1\cap W_2$ también lo es.`, ['t.subespacio-criterio'], ['5.1.nucleo', '5.1.demostrar']);
  TE('t.union-subespacio', 'Unión de subespacios', r`$W_1\cup W_2$ es subespacio si y solo si $W_1\subseteq W_2$ o $W_2\subseteq W_1$.`, ['t.subespacio-criterio'], ['5.1.propiedades', '5.1.parametros', '5.1.demostrar']);

  const F = M.fmt, tx = A => M.tex(A);
  const strMat = A => A.map(f => f.map(String));
  /* conjuntos de ℝ³ definidos por condiciones: [texto, ¿subespacio?, propiedad que falla ('cero' | 'suma' | 'escalar' | null), motivo] */
  const CONJ = [
    ['x+y+z=0', true, null, 'Es el núcleo de una matriz: cerrado bajo suma y escalares.'], ['x=2y', true, null, 'Es el núcleo de $(1,-2,0)$.'], ['z=0', true, null, 'Es un plano por el origen.'], ['x+2y-z=0', true, null, 'Es el núcleo de $(1,2,-1)$.'], ['x=y=z', true, null, 'Es la recta generada por $(1,1,1)$.'], ['2x-y=0\\ \\text{y}\\ z=0', true, null, 'Es el núcleo de una matriz $2\\times3$.'],
    ['x+y+z=1', false, 'cero', 'No contiene al vector cero: $0+0+0\\neq1$.'], ['x\\ge0', false, 'escalar', 'Al multiplicar por $-1$ sale de $x\\ge0$.'], ['xy=0', false, 'suma', 'Por ejemplo $(1,0,0)$ y $(0,1,0)$ están, pero su suma $(1,1,0)$ no.'], ['z=x^2', false, 'suma', 'Por ejemplo $(1,0,1)$ está pero $(2,0,2)$ no ($4\\neq2$): no es cerrado.'], ['x,y,z\\in\\mathbb{Z}', false, 'escalar', 'Al multiplicar por $\\tfrac12$ puede salir de $\\mathbb{Z}^3$.'], ['x+y+z\\neq0', false, 'cero', 'No contiene al cero: $0+0+0=0$.'],
  ];
  const llave = c => '$\\{(x,y,z):' + c[0] + '\\}$';

  /* ---------- generadores ---------- */
  gen.multiple({
    id: 'w5.n1.cuales-subespacios', nivel: '5.1', habilidades: ['5.1.reconocer'], dificultad: 2,
    hacer(rng) {
      const si = rng.sample(CONJ.filter(c => c[1]), rng.int(1, 2)), no = rng.sample(CONJ.filter(c => !c[1]), rng.int(2, 3)), ops = rng.shuffle(si.concat(no)), ok = ops.map((c, i) => (c[1] ? i : -1)).filter(i => i >= 0);
      return { key: ops.map(c => c[0]).join('|'), enun: 'Marca todos los subconjuntos de $\\mathbb{R}^3$ que son **subespacios**.', opciones: ops.map(llave), ok,
        msg: (j, es) => es ? 'Esta sí es subespacio: ' + ops[j][3] : 'No lo es: ' + ops[j][3],
        pistas: ['Orientación: prueba si contiene al cero y si es cerrado bajo suma y escalares.', 'Idea clave: una condición **homogénea lineal** (como $x+y+z=0$) da un subespacio; una constante distinta de $0$, una desigualdad o un producto no.', 'Primer paso: ¿está el vector $(0,0,0)$ en el conjunto?'], expl: 'Son subespacios: ' + si.map(c => '$' + c[0] + '$').join(', ') + '.' };
    },
  });

  gen.eleccion({
    id: 'w5.n1.que-falla', nivel: '5.1', habilidades: ['5.1.propiedades'], dificultad: 2,
    hacer(rng) {
      const co = () => { const t = [rng.int(1, 3), rng.int(-3, 3), rng.int(-3, 3)]; return (t[0] === 1 ? '' : t[0]) + 'x' + (t[1] < 0 ? '-' : '+') + (Math.abs(t[1]) === 1 ? '' : Math.abs(t[1])) + 'y' + (t[2] < 0 ? '-' : '+') + (Math.abs(t[2]) === 1 ? '' : Math.abs(t[2])) + 'z'; };
      const fam = rng.pick(['cte', 'semi', 'prod']); let cond, falla, motivo;
      if (fam === 'cte') { const d = rng.int(1, 9); cond = co() + '=' + d; falla = 'cero'; motivo = 'No contiene al vector cero: $0\\neq' + d + '$.'; }
      else if (fam === 'semi') { const v = rng.pick(['x', 'y', 'z']), d = rng.int(1, 4); cond = d + v + '+' + rng.pick(['y', 'z', 'x'].filter(q => q !== v)) + '\\ge 0'; falla = 'escalar'; motivo = 'Al multiplicar un vector del conjunto por un escalar negativo se invierte la desigualdad: sale del conjunto.'; }
      else { const [a, b2] = rng.sample(['x', 'y', 'z'], 2), d = rng.int(0, 3); cond = a + b2 + '=0'; falla = 'suma'; motivo = 'Los vectores de los ejes $' + a + '$ y $' + b2 + '$ están, pero su suma no.'; if (d > 5) return null; }
      const nom = { cero: 'no contiene al vector cero', suma: 'no es cerrado bajo la suma', escalar: 'no es cerrado bajo el producto por escalares' }, ops = Object.keys(nom).filter(k => k !== falla);
      return { key: cond, enun: 'El conjunto $\\{(x,y,z):' + cond + '\\}$ **no** es un subespacio de $\\mathbb{R}^3$. ¿Qué propiedad falla?', ok: nom[falla], malas: ops.map(k => ['otra-' + k, nom[k], 'Esa propiedad sí se cumple aquí; la que falla es otra. ' + motivo]).concat([['si', 'sí es un subespacio', 'Hay una propiedad que falla. ' + motivo]]),
        pistas: ['Orientación: prueba las tres condiciones una por una.', 'Idea clave: busca un contraejemplo concreto para cada una.', 'Primer paso: ¿está el cero?'], expl: motivo };
    },
  });

  gen.entero({
    id: 'w5.n1.parametro-subespacio', nivel: '5.1', habilidades: ['5.1.parametros', '5.1.reconocer'], dificultad: 3,
    hacer(rng) {
      const m = rng.int(2, 9), c = rng.pick([1, 2, 3]), k = c * m * m, ee = k - 0;
      const a = rng.pick([1, 2, 3]), b = rng.pick([-2, -1, 1, 3]), d = rng.pick([1, -1, 2]), rhs = 'k^2-' + (m * m);
      return { key: [a, b, d, m].join(), enun: 'Sea $W_k=\\{(x,y,z):' + (a === 1 ? '' : a) + 'x' + (b < 0 ? '-' : '+') + (Math.abs(b) === 1 ? '' : Math.abs(b)) + 'y' + (d < 0 ? '-' : '+') + (Math.abs(d) === 1 ? '' : Math.abs(d)) + 'z=' + rhs + '\\}$. ¿Para qué valor **positivo** de $k$ es $W_k$ un subespacio de $\\mathbb{R}^3$?', res: m,
        firmas: [['cuadrado', m * m, 'Se necesita $k^2-' + m * m + '=0$, es decir $k^2=' + m * m + '$: hay que tomar la raíz.'], ['negativo', -m, 'Se pide el valor positivo.']].filter(f => f[1] !== m),
        pistas: ['Orientación: un conjunto así es subespacio solo si contiene al $0$.', 'Idea clave: $(0,0,0)\\in W_k\\iff 0=k^2-' + m * m + '$.', 'Primer paso: sustituye $(0,0,0)$ en la ecuación.'], expl: '$k^2=' + m * m + '$ y $k=' + m + '$.' };
    },
  });

  gen.tupla({
    id: 'w5.n1.vector-del-plano', nivel: '5.1', habilidades: ['5.1.nucleo', '5.1.reconocer'], dificultad: 2,
    hacer(rng) {
      const A = M.de([[rng.int(1, 3), rng.int(-3, 3), rng.int(-3, 3)]]), N = M.nucleo(A); if (N.length < 2) return null;
      const t = A[0].map(x => Number(x.n)), eq = (t[0] === 1 ? '' : t[0]) + 'x' + (t[1] < 0 ? '-' : '+') + (Math.abs(t[1]) === 1 ? '' : Math.abs(t[1])) + 'y' + (t[2] < 0 ? '-' : '+') + (Math.abs(t[2]) === 1 ? '' : Math.abs(t[2])) + 'z=0';
      return { key: eq, enun: 'Sea $W=\\{(x,y,z):' + eq + '\\}$. Escribe un vector **no nulo** de $W$.', campos: ['x', 'y', 'z'], res: F([N[0]])[0], verificador: { id: 'nucleo-vector', args: { A: strMat(A), n: 3 } },
        firmas: [['vector-normal', t.map(String), 'Ese es el vector de coeficientes de la ecuación, que no está en el plano (es perpendicular a él).'], ['cero', ['0', '0', '0'], 'El cero siempre cumple la ecuación: busca un vector no nulo.']],
        pistas: ['Orientación: elige dos coordenadas libres y despeja la tercera.', 'Idea clave: $' + eq + '$ es una ecuación en $x,y,z$.', 'Primer paso: da el valor $1$ a una variable y $0$ a otra, y despeja.'], expl: 'Por ejemplo $(' + F([N[0]])[0].join(',') + ')$.' };
    },
  });

  gen.tupla({
    id: 'w5.n1.interseccion-vector', nivel: '5.1', habilidades: ['5.1.nucleo'], dificultad: 3,
    hacer(rng) {
      const A = M.de([[rng.int(1, 3), rng.int(-3, 3), rng.int(-3, 3)], [rng.int(-2, 3), rng.int(1, 3), rng.int(-3, 3)]]); if (M.rango(A) !== 2) return null;
      const N = M.nucleo(A), f = r => { const t = r.map(x => Number(x.n)); return (t[0] === 0 ? '' : (t[0] === 1 ? '' : t[0] === -1 ? '-' : t[0])) + (t[0] === 0 ? '' : 'x') + (t[1] === 0 ? '' : (t[1] < 0 ? '-' : (t[0] === 0 ? '' : '+')) + (Math.abs(t[1]) === 1 ? '' : Math.abs(t[1])) + 'y') + (t[2] === 0 ? '' : (t[2] < 0 ? '-' : '+') + (Math.abs(t[2]) === 1 ? '' : Math.abs(t[2])) + 'z') + '=0'; };
      return { key: tx(A), enun: 'Sean $W_1=\\{' + f(A[0]) + '\\}$ y $W_2=\\{' + f(A[1]) + '\\}$ subespacios de $\\mathbb{R}^3$. Escribe un vector **no nulo** de $W_1\\cap W_2$.', campos: ['x', 'y', 'z'], res: F([N[0]])[0], verificador: { id: 'nucleo-vector', args: { A: strMat(A), n: 3 } },
        firmas: [['solo-uno', M.nucleo(M.de([A[0]]))[0].map(String), 'Ese vector está en $W_1$ pero no cumple la ecuación de $W_2$.'], ['cero', ['0', '0', '0'], 'El cero está en la intersección, pero se pide un vector no nulo.']].filter(g => g[0] === 'cero' || M.evaluaSistema(A, g[1].map(x => Rat.parse(x))).some(z => !z.isZero())),
        pistas: ['Orientación: debe cumplir las dos ecuaciones a la vez.', 'Idea clave: resuelve el sistema homogéneo formado por ambas ecuaciones.', 'Primer paso: escribe las dos ecuaciones como un sistema $2\\times3$.'], expl: 'Resolviendo el sistema se obtiene, por ejemplo, $(' + F([N[0]])[0].join(',') + ')$.' };
    },
  });

  gen.eleccion({
    id: 'w5.n1.pertenece-plano', nivel: '5.1', habilidades: ['5.1.reconocer', '5.1.nucleo'], dificultad: 2,
    hacer(rng) {
      const A = M.de([[rng.int(1, 3), rng.int(-3, 3), rng.int(-3, 3)]]), N = M.nucleo(A); if (N.length < 2) return null; const a = rng.int(-2, 2), b = rng.int(-2, 2), v = M.combina([a, b], [N[0], N[1]]); if (v.every(x => x.isZero())) return null;
      const t = A[0].map(x => Number(x.n)), eq = (t[0] === 1 ? '' : t[0]) + 'x' + (t[1] < 0 ? '-' : '+') + (Math.abs(t[1]) === 1 ? '' : Math.abs(t[1])) + 'y' + (t[2] < 0 ? '-' : '+') + (Math.abs(t[2]) === 1 ? '' : Math.abs(t[2])) + 'z=0';
      const malos = []; for (let k = 0; k < 40 && malos.length < 3; k++) { const w = [rng.int(-3, 3), rng.int(-3, 3), rng.int(-3, 3)]; if (M.evaluaSistema(A, w).some(z => !z.isZero()) && !malos.some(m => m.join() === w.join())) malos.push(w); }
      if (malos.length < 3) return null; const fv = x => '$(' + x.join(',') + ')$';
      return { key: eq + v.join(), enun: '¿Cuál de estos vectores pertenece a $W=\\{(x,y,z):' + eq + '\\}$?', ok: fv(v.map(x => Number(x.n))), malas: malos.map((w, i) => ['no-cumple-' + i, fv(w), 'Al sustituir en $' + eq.replace('=0', '') + '$ no da $0$.']),
        pistas: ['Orientación: sustituye cada vector en la ecuación.', 'Idea clave: pertenece si y solo si la ecuación da $0$.', 'Primer paso: calcula el lado izquierdo con la primera opción.'], expl: 'Solo $(' + v.map(x => x.n).join(',') + ')$ cumple la ecuación.' };
    },
  });

  /* ---------- demostraciones ---------- */
  dem2({
    id: 'dem.subespacio-criterio', teorema: 't.subespacio-criterio', nivel: '5.1', habilidades: ['5.1.reconocer', '5.1.propiedades', '5.1.demostrar'], requiere: [], refsExtra: ['d.espacio-vectorial', 'd.subespacio', 'b.axiomas-heredados'],
    param: rng => ({ w: rng.pick(['W', 'U']), v: rng.pick(['V', 'E']), u: rng.pick(['u', 'x']) }),
    enunciado: p => r`Sea $${p.w}\subseteq ${p.v}$ no vacío, cerrado bajo la suma y bajo el producto por escalares. Demuestra que $${p.w}$ es un espacio vectorial (con las operaciones de $${p.v}$).`,
    hip: p => [r`$${p.w}\neq\emptyset$ y $${p.w}\subseteq ${p.v}$`, r`$u+v\in ${p.w}$ y $cu\in ${p.w}$ para $u,v\in ${p.w}$, $c$ escalar`], meta: p => r`$${p.w}$ es espacio vectorial`,
    L: p => [
      ['L1', r`Las operaciones están bien definidas en $${p.w}$ porque es cerrado bajo la suma y el producto por escalares.`, 'd.subespacio'],
      ['L2', r`Existe $${p.u}\in ${p.w}$ (no vacío); como $0\cdot ${p.u}\in ${p.w}$ y $0\cdot ${p.u}=0$, el cero de $${p.v}$ está en $${p.w}$.`, 'd.espacio-vectorial', ['L1']],
      ['L3', r`Para $${p.u}\in ${p.w}$, $(-1)${p.u}\in ${p.w}$ y $(-1)${p.u}=-${p.u}$: cada elemento tiene opuesto en $${p.w}$.`, 'd.espacio-vectorial', ['L1']],
      ['L4', r`Los demás axiomas (asociatividad, conmutatividad, distributividades, $1\cdot ${p.u}=${p.u}$) son igualdades que ⟦h1⟧ para todos los elementos de $${p.v}$, en particular para los de $${p.w}$.`, 'b.axiomas-heredados', ['L1'], [H('h1', r`ya valen`, [r`ya valen`, r`hay que demostrar de nuevo`, r`no valen`], false)]],
      ['L5', r`Se cumplen todos los axiomas: $${p.w}$ es espacio vectorial. ∎`, 'd.espacio-vectorial', ['L2', 'L3', 'L4']],
    ],
    dist: p => [[r`El conjunto $\{(x,y):x+y=0\}$ cumple lo pedido y es espacio; luego siempre.`, 'un ejemplo no prueba el caso general'], [r`Como $${p.w}\subseteq ${p.v}$, hereda todos los axiomas sin comprobar nada.`, 'falta ver que el cero y los opuestos están en $W$ y que las operaciones no salen de $W$']],
    err: p => [['L2', r`Como $${p.u}+${p.u}\in ${p.w}$, el cero está en $${p.w}$.`, 'conclusion-invalida', 'La suma no da el cero; hay que multiplicar por el escalar $0$.'], ['L3', r`Para $${p.u}\in ${p.w}$, $2${p.u}\in ${p.w}$ es el opuesto de $${p.u}$.`, 'error-de-calculo', 'El opuesto es $(-1)u$.']],
    valida: [['axiomas', r`Comprobar cerradura, cero y opuestos, y heredar el resto de $V$`, 'Es la prueba estándar.']],
    idea: p => r`el cero es $0\cdot ${p.u}$ y el opuesto es $(-1)${p.u}$, ambos en $${p.w}$.`, primero: p => r`prueba que $0\in ${p.w}$.`,
  });

  dem2({
    id: 'dem.nucleo-subespacio', teorema: 't.nucleo-subespacio', nivel: '5.1', habilidades: ['5.1.nucleo', '5.1.reconocer', '5.1.demostrar'], requiere: ['t.subespacio-criterio'], refsExtra: ['d.nucleo', 'b.arbitrario'],
    param: rng => ({ a: rng.pick(['A', 'B']), u: rng.pick(['u', 'x']), v: rng.pick(['v', 'y']), c: rng.pick(['c', 'λ']) }),
    enunciado: p => r`Demuestra que $\ker ${p.a}=\{x:${p.a}x=0\}$ es un subespacio de $\mathbb{Q}^n$.`,
    hip: p => [r`$${p.a}$ es una matriz $m\times n$`, 'Puedes citar el criterio del subespacio'], meta: p => r`$\ker ${p.a}$ es subespacio`,
    L: p => [
      ['L1', r`No es vacío: $${p.a}\,0=0$, así que $0\in\ker ${p.a}$.`, 'd.nucleo'],
      ['L2', r`Sean $${p.u},${p.v}\in\ker ${p.a}$ arbitrarios: $${p.a}${p.u}=0$ y $${p.a}${p.v}=0$. Por distributividad $${p.a}(${p.u}+${p.v})=${p.a}${p.u}+${p.a}${p.v}=0+0=0$.`, 'b.arbitrario', ['L1']],
      ['L3', r`Para un escalar $${p.c}$, $${p.a}(${p.c}${p.u})=${p.c}(${p.a}${p.u})=${p.c}\cdot 0$, es decir, ⟦h1⟧.`, 'd.nucleo', ['L1'], [H('h1', r`$${p.a}(${p.c}${p.u})=0$`, [r`$${p.a}(${p.c}${p.u})=0$`, r`$${p.c}+${p.a}${p.u}=0$`, r`$(${p.a}+${p.c})${p.u}=0$`], false)]],
      ['L4', r`Luego $\ker ${p.a}$ es no vacío y cerrado bajo suma y escalares: por el criterio, es un subespacio. ∎`, 't.subespacio-criterio', ['L2', 'L3']],
    ],
    dist: p => [[r`Con $${p.a}=(1\ 1)$ el núcleo es una recta por el origen; luego siempre.`, 'un ejemplo no prueba el caso general'], [r`Como $${p.a}x=0$ es una ecuación lineal, el conjunto es un subespacio.`, 'es lo que hay que probar: se verifica con el criterio']],
    err: p => [['L2', r`$${p.a}(${p.u}+${p.v})=${p.a}${p.u}\cdot ${p.a}${p.v}=0$.`, 'error-de-calculo', 'Se **suma**: $A(u+v)=Au+Av$.'], ['L1', r`No es vacío: $${p.a}\,0=1$.`, 'error-de-calculo', '$A\\,0=0$.']],
    valida: [['criterio', r`Verificar no vacío, cerrado bajo suma y bajo escalares`, 'Es la prueba estándar.']],
    idea: p => r`$${p.a}$ es lineal: $${p.a}(${p.u}+${p.v})=${p.a}${p.u}+${p.a}${p.v}$ y $${p.a}(${p.c}${p.u})=${p.c}${p.a}${p.u}$.`, primero: p => r`comprueba que el cero está en $\ker ${p.a}$.`,
  });

  dem2({
    id: 'dem.interseccion-subespacios', teorema: 't.interseccion-subespacios', nivel: '5.1', habilidades: ['5.1.nucleo', '5.1.demostrar'], requiere: ['t.subespacio-criterio'], refsExtra: ['d.subespacio', 'b.arbitrario'],
    param: rng => ({ a: rng.pick(['W_1', 'U_1']), b: rng.pick(['W_2', 'U_2']), u: rng.pick(['u', 'x']), v: rng.pick(['v', 'y']), c: rng.pick(['c', 'λ']) }),
    enunciado: p => r`Demuestra que si $${p.a}$ y $${p.b}$ son subespacios de $V$, entonces $${p.a}\cap ${p.b}$ es un subespacio.`,
    hip: p => [r`$${p.a},${p.b}$ son subespacios de $V$`, 'Puedes citar el criterio del subespacio'], meta: p => r`$${p.a}\cap ${p.b}$ es subespacio`,
    L: p => [
      ['L1', r`No es vacío: $0\in ${p.a}$ y $0\in ${p.b}$ (ambos son subespacios), así que $0\in ${p.a}\cap ${p.b}$.`, 'd.subespacio'],
      ['L2', r`Sean $${p.u},${p.v}\in ${p.a}\cap ${p.b}$. Como están en $${p.a}$, $${p.u}+${p.v}\in ${p.a}$; como están en $${p.b}$, $${p.u}+${p.v}\in ${p.b}$. Luego $${p.u}+${p.v}\in ${p.a}\cap ${p.b}$.`, 'b.arbitrario', ['L1']],
      ['L3', r`Análogamente, para un escalar $${p.c}$, $${p.c}${p.u}\in ${p.a}$ y $${p.c}${p.u}\in ${p.b}$ por ser ambos ⟦h1⟧.`, 'd.subespacio', ['L1'], [H('h1', 'cerrados bajo escalares', ['cerrados bajo escalares', 'conjuntos finitos', 'iguales'], false)]],
      ['L4', r`Por el criterio del subespacio, $${p.a}\cap ${p.b}$ es subespacio. ∎`, 't.subespacio-criterio', ['L2', 'L3']],
    ],
    dist: p => [[r`En $\mathbb{R}^2$ dos rectas por el origen se cortan en $\{0\}$, que es subespacio; luego siempre.`, 'un ejemplo no prueba el caso general'], [r`Como $${p.a}\cap ${p.b}\subseteq ${p.a}$, hereda todas las propiedades.`, 'un subconjunto de un subespacio no tiene por qué ser subespacio']],
    err: p => [['L2', r`Como $${p.u}\in ${p.a}$ y $${p.v}\in ${p.b}$, $${p.u}+${p.v}\in ${p.a}\cap ${p.b}$.`, 'conclusion-invalida', 'Hay que usar que ambos están en $W_1$ **y** en $W_2$.'], ['L1', r`No es vacío: $0\in ${p.a}$, así que $0\in ${p.a}\cap ${p.b}$.`, 'conclusion-invalida', 'Hay que comprobar que $0$ está también en $W_2$.']],
    valida: [['criterio', r`Verificar no vacío, suma y escalares usando que cada $W_i$ es subespacio`, 'Es la prueba estándar.']],
    idea: p => r`un elemento de la intersección está en los dos subespacios a la vez.`, primero: p => r`comprueba que $0\in ${p.a}\cap ${p.b}$.`,
  });

  dem2({
    id: 'dem.union-subespacio', teorema: 't.union-subespacio', nivel: '5.1', habilidades: ['5.1.propiedades', '5.1.parametros', '5.1.demostrar'], requiere: ['t.subespacio-criterio'], refsExtra: ['d.subespacio', 'b.contradiccion', 'b.doble-implicacion'],
    param: rng => ({ a: rng.pick(['W_1', 'U_1']), b: rng.pick(['W_2', 'U_2']), u: rng.pick(['u', 'x']), v: rng.pick(['v', 'y']) }),
    enunciado: p => r`Demuestra que si $${p.a}\cup ${p.b}$ es un subespacio, entonces $${p.a}\subseteq ${p.b}$ o $${p.b}\subseteq ${p.a}$.`,
    hip: p => [r`$${p.a},${p.b}$ subespacios y $${p.a}\cup ${p.b}$ subespacio`, 'Puedes razonar por contradicción'], meta: p => r`$${p.a}\subseteq ${p.b}$ o $${p.b}\subseteq ${p.a}$`,
    L: p => [
      ['L1', r`Supongamos por contradicción que ninguna inclusión se cumple: existen $${p.u}\in ${p.a}\setminus ${p.b}$ y $${p.v}\in ${p.b}\setminus ${p.a}$.`, 'b.contradiccion'],
      ['L2', r`Como $${p.u},${p.v}\in ${p.a}\cup ${p.b}$, que es subespacio, $${p.u}+${p.v}\in ${p.a}\cup ${p.b}$: está en $${p.a}$ o en $${p.b}$.`, 't.subespacio-criterio', ['L1']],
      ['L3', r`Si $${p.u}+${p.v}\in ${p.a}$, como $${p.u}\in ${p.a}$ y $${p.a}$ es subespacio, $${p.v}=(${p.u}+${p.v})-${p.u}$ pertenece a ⟦h1⟧, contra $${p.v}\notin ${p.a}$.`, 'd.subespacio', ['L2'], [H('h1', r`$${p.a}$`, [r`$${p.a}$`, r`$${p.b}\setminus ${p.a}$`, r`$\emptyset$`], false)]],
      ['L4', r`Si $${p.u}+${p.v}\in ${p.b}$, de la misma forma $${p.u}=(${p.u}+${p.v})-${p.v}\in ${p.b}$, contra $${p.u}\notin ${p.b}$.`, 'd.subespacio', ['L2']],
      ['L5', r`Ambos casos contradicen; luego $${p.a}\subseteq ${p.b}$ o $${p.b}\subseteq ${p.a}$. ∎`, 'b.contradiccion', ['L3', 'L4']],
    ],
    dist: p => [[r`Los ejes de $\mathbb{R}^2$ no cumplen que su unión sea subespacio, así que el resultado es cierto.`, 'un ejemplo no prueba el caso general'], [r`Como la unión contiene ambos subespacios, uno debe contener al otro.`, 'es lo que hay que probar']],
    err: p => [['L2', r`Como $${p.u},${p.v}\in ${p.a}\cap ${p.b}$, $${p.u}+${p.v}$ también.`, 'conclusion-invalida', '$u$ y $v$ no están en la intersección: están cada uno en un subespacio distinto.'], ['L3', r`Si $${p.u}+${p.v}\in ${p.a}$, entonces $${p.v}=(${p.u}+${p.v})+${p.u}\in ${p.a}$.`, 'error-de-calculo', 'Hay que **restar** $u$: $v=(u+v)-u$.']],
    valida: [['absurdo', r`Suponer elementos fuera de cada subespacio y analizar su suma`, 'Es la prueba estándar.']],
    idea: p => r`la suma $${p.u}+${p.v}$ no puede estar en ninguno de los dos.`, primero: p => r`supón por contradicción $${p.u}\in ${p.a}\setminus ${p.b}$ y $${p.v}\in ${p.b}\setminus ${p.a}$.`,
  });

  R.nivel({
    id: '5.1', mundo: 5, titulo: 'Subespacios', tema: 'Espacios vectoriales y subespacios',
    habilidades: ['5.1.reconocer', '5.1.propiedades', '5.1.nucleo', '5.1.parametros', '5.1.demostrar'],
    teoremas: ['t.subespacio-criterio', 't.nucleo-subespacio', 't.interseccion-subespacios', 't.union-subespacio'],
    leccion: {
      intro: 'Un **espacio vectorial** es un conjunto donde se puede sumar y multiplicar por escalares con las reglas de siempre. Un **subespacio** es un subconjunto que es espacio vectorial por sí mismo. (Aquí los escalares son racionales o reales.)',
      definiciones: [
        { nombre: 'Criterio del subespacio', tex: '$W\\subseteq V$ es subespacio si y solo si $W\\neq\\emptyset$ (basta $0\\in W$) y $u+v\\in W$ y $cu\\in W$ para todo $u,v\\in W$ y todo escalar $c$.' },
        { nombre: 'Núcleo', tex: '$\\ker A=\\{x:Ax=0\\}$ siempre es subespacio. Todo conjunto definido por ecuaciones lineales **homogéneas** es un subespacio.' },
        { nombre: 'Qué falla', tex: 'Una constante distinta de $0$ (como $x+y+z=1$) elimina al cero; una desigualdad rompe los escalares negativos; un producto ($xy=0$) rompe la suma.' },
        { nombre: 'Operaciones', tex: 'La **intersección** de subespacios es subespacio; la **unión** casi nunca lo es (solo si uno contiene al otro).' },
      ],
      teorema: 't.nucleo-subespacio',
      ejemplo: { enunciado: '¿Es $W=\\{(x,y):x+y=0\\}$ un subespacio de $\\mathbb{R}^2$?', pasos: ['$(0,0)\\in W$ porque $0+0=0$.', 'Si $x_1+y_1=0$ y $x_2+y_2=0$, entonces $(x_1+x_2)+(y_1+y_2)=0$: cerrado bajo la suma.', 'Si $x+y=0$ y $c\\in\\mathbb{R}$, $cx+cy=0$: cerrado bajo escalares. Sí es subespacio (una recta por el origen).'] },
    },
  });

  if (typeof module !== 'undefined') module.exports = AC;
})(globalThis.AC = globalThis.AC || {});
