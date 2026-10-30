/* Mundo 1, nivel 1.5 — Métodos de demostración: directa, contrapositiva, contradicción y construcción. */
(function (AC) {
  const { R, r, H, T, dem, EST_EJEMPLO } = AC.w1c;
  const esPrimo = n => { if (n < 2) return false; for (let d = 2; d * d <= n; d++) if (n % d === 0) return false; return true; };

  /* ---------- catálogo ---------- */
  const HB = (id, nombre) => R.habilidad({ id: '1.5.' + id, nombre, nivel: '1.5' });
  HB('metodo', 'Elegir el método de demostración'); HB('negar-para-contradiccion', 'Qué suponer en una reducción al absurdo'); HB('paridad', 'Paridad'); HB('contraejemplo', 'Buscar contraejemplos'); HB('construir', 'Pruebas por construcción'); HB('demostrar', 'Demostrar con distintos métodos');
  const TE = (id, titulo, enunciado, requiere, habilidades) => R.teorema({ id, titulo, nivel: '1.5', enunciado, requiere, habilidades });
  TE('t.paridad-operaciones', 'Paridad de sumas y productos', r`La suma de dos enteros impares es par y su producto es impar.`, [], ['1.5.paridad', '1.5.demostrar']);
  TE('t.cuadrado-par', 'Si n² es par, n es par', r`Para todo entero $n$: si $n^2$ es par, entonces $n$ es par.`, ['t.contrapositiva', 't.paridad-operaciones'], ['1.5.metodo', '1.5.paridad', '1.5.demostrar']);
  TE('t.raiz2-irracional', '√2 es irracional', r`No existe un racional $q$ con $q^2=2$; es decir, $\sqrt{2}$ es irracional.`, ['t.cuadrado-par'], ['1.5.metodo', '1.5.negar-para-contradiccion', '1.5.demostrar']);
  TE('t.densidad-racionales', 'Entre dos racionales hay otro', r`Si $p<q$ son racionales, existe un racional $r$ con $p<r<q$.`, [], ['1.5.construir', '1.5.demostrar']);

  const ref = (id, tipo, nombre) => R.ref({ id, tipo, nombre });
  ref('d.par', 'definicion', 'Par: n = 2k para algún entero k'); ref('d.impar', 'definicion', 'Impar: n = 2k+1 para algún entero k');
  ref('b.dicotomia-paridad', 'propiedad-base', 'Todo entero es par o impar, y no ambos'); ref('b.cuerpo-algebra', 'propiedad-base', 'Álgebra de los números: operar, despejar, sustituir');
  ref('b.orden', 'propiedad-base', 'Orden de los números: sumar lo mismo o multiplicar por un positivo conserva la desigualdad'); ref('b.construccion', 'propiedad-base', 'Para probar «existe» basta exhibir un objeto y comprobar que cumple lo pedido');
  ref('b.fraccion-irreducible', 'propiedad-base', 'Todo racional positivo se escribe a/b con a, b naturales no ambos pares');

  /* ---------- 1. elegir el método (elección) ---------- */
  const METODOS = ['Directa', 'Contrapositiva', 'Reducción al absurdo', 'Construcción (exhibir un objeto)', 'Inducción', 'Contraejemplo'];
  const RAZON = { 0: 'Se parte de la hipótesis y se avanza con definiciones hasta la conclusión.', 1: 'La conclusión «no Q» es más fácil de manejar que la hipótesis: se prueba «no Q ⇒ no P».', 2: 'Se afirma que algo **no** existe o que algo es irracional: se supone lo contrario y se busca una contradicción.', 3: 'Se afirma que algo **existe**: basta exhibirlo y comprobarlo.', 4: 'El enunciado es para todo número natural y cada caso se apoya en el anterior.', 5: 'Se afirma algo para todos los casos y es falso: un solo caso que falle lo refuta.' };
  const GEN_MAL = { 0: 'Una prueba directa no tiene un camino claro aquí.', 1: 'La contrapositiva no simplifica este enunciado.', 2: 'No hay nada que «no exista» ni que suponer por absurdo.', 3: 'No se pide la existencia de un objeto.', 4: 'No hay una estructura recursiva en $n$ que aprovechar.', 5: 'El enunciado es verdadero: no se puede refutar con un caso.' };
  const CLAIMS = [
    ['La suma de dos enteros pares es par.', 0], ['Si $a\\mid b$ y $b\\mid c$, entonces $a\\mid c$.', 0], ['El producto de dos enteros impares es impar.', 0], ['Si $x>0$ e $y>0$, entonces $x+y>0$.', 0],
    ['Si $n^2$ es par, entonces $n$ es par.', 1], ['Si $3n+2$ es impar, entonces $n$ es impar.', 1], ['Si el producto $ab$ es impar, entonces $a$ y $b$ son impares.', 1], ['Si $a+b\\ge 10$, entonces $a\\ge 5$ o $b\\ge 5$.', 1],
    ['$\\sqrt{2}$ es irracional.', 2], ['No existe un mayor número entero.', 2], ['No existen enteros $a,b$ con $4a+6b=1$.', 2], ['No existe un racional $q$ con $q^2=2$.', 2],
    ['Existe un entero $n$ con $n^2+n=12$.', 3], ['Entre dos racionales distintos existe otro racional.', 3], ['Existen dos irracionales cuya suma es racional.', 3], ['Existe un múltiplo de $7$ que termina en $3$.', 3],
    ['Para todo $n\\ge 1$: $1+2+\\cdots+n=\\dfrac{n(n+1)}{2}$.', 4], ['Para todo $n\\ge 1$: $1+3+5+\\cdots+(2n-1)=n^2$.', 4], ['Para todo $n\\ge 1$: $2^n\\ge n+1$.', 4],
    ['Para todo $n\\ge 0$: $n^2+n+41$ es primo.', 5], ['Para todo entero $n$: $n^2>n$.', 5], ['Todo entero impar mayor que 1 es primo.', 5],
  ];
  R.generador({
    id: 'w1.n5.clasificar-metodo', mundo: 1, nivel: '1.5', familia: 'aplicacion', habilidades: ['1.5.metodo'], dificultad: 2, autoexplicacion: 'metodo-razon',
    generar(rng) {
      const [txt, t] = rng.pick(CLAIMS);
      const otros = rng.sample([0, 1, 2, 3, 4, 5].filter(x => x !== t), 3), perm = rng.shuffle([t].concat(otros));
      return {
        variantKey: txt + '|' + perm.join(''),
        enunciado: 'Quieres demostrar (o refutar): «' + txt + '». ¿Qué método es el más natural?',
        entrada: { tipo: 'eleccion', opciones: perm.map(m => METODOS[m]) }, verificador: { id: 'indice', args: { esperado: perm.indexOf(t) } },
        firmas: perm.map((m, pos) => m === t ? null : { id: 'metodo-' + ['directa', 'contrapositiva', 'absurdo', 'construccion', 'induccion', 'contraejemplo'][m], respuesta: pos, mensaje: GEN_MAL[m] + ' En este caso: ' + RAZON[t] }).filter(Boolean),
        pistas: ['Orientación: fíjate en el tipo de afirmación: ¿«para todo», «existe», «no existe», «si…entonces»?', 'Idea clave: «existe» se prueba construyendo; «no existe» o «irracional», por absurdo; un «para todo n» recursivo, por inducción; un «para todo» falso, con un contraejemplo.', 'Primer paso: ¿qué sería lo más fácil de suponer o de escribir al empezar la prueba?'],
        explicacion: 'El método más natural es: ' + METODOS[t] + '. ' + RAZON[t],
      };
    },
  });
  R.banco('metodo-razon', { pregunta: '¿Por qué ese método?', opciones: [
    { texto: 'Porque la forma del enunciado (existe, no existe, para todo, si…entonces) sugiere qué suponer o qué construir.', correcta: true },
    { texto: 'Porque siempre es mejor la reducción al absurdo.', correcta: false },
    { texto: 'Porque el método depende solo de lo largo que sea el enunciado.', correcta: false },
    { texto: 'Porque los métodos no se pueden comparar.', correcta: false },
  ] });

  /* ---------- 2. qué suponer en una reducción al absurdo (elección) ---------- */
  const ABS = [
    { c: 'Si $n^2$ es par, entonces $n$ es par.', ok: '$n^2$ es par y $n$ es impar', mal: ['$n^2$ es impar y $n$ es par', '$n^2$ es impar y $n$ es impar', '$n^2$ es par y $n$ es par'] },
    { c: '$\\sqrt{2}$ es irracional.', ok: '$\\sqrt{2}$ es racional', mal: ['$\\sqrt{2}$ es entero', '$\\sqrt{2}$ no es un número real', '$\\sqrt{2}<0$'] },
    { c: 'No existe un mayor número entero.', ok: 'existe un mayor entero $M$', mal: ['todo entero es mayor que algún otro entero', 'no existe ningún entero', 'existen dos enteros mayores'] },
    { c: 'Si $a$ y $b$ son impares, entonces $a+b$ es par.', ok: '$a$ y $b$ son impares y $a+b$ es impar', mal: ['$a$ y $b$ son pares y $a+b$ es impar', '$a$ o $b$ es par y $a+b$ es par', '$a+b$ es par y $a$ es par'] },
    { c: 'No existen enteros $a,b$ con $4a+6b=1$.', ok: 'existen enteros $a,b$ con $4a+6b=1$', mal: ['para todos los enteros $a,b$, $4a+6b=1$', 'existen enteros $a,b$ con $4a+6b\\neq 1$', 'no existen enteros $a,b$'] },
    { c: 'Todo número primo mayor que 2 es impar.', ok: 'existe un primo $p>2$ que es par', mal: ['todo primo $p>2$ es par', 'existe un primo $p\\le 2$ que es impar', 'existe un impar $p>2$ que no es primo'] },
    { c: 'Si $x>0$ y $xy<0$, entonces $y<0$.', ok: '$x>0$, $xy<0$ y $y\\ge 0$', mal: ['$x\\le 0$, $xy<0$ y $y<0$', '$x>0$, $xy\\ge 0$ y $y<0$', '$x>0$ y $y<0$'] },
    { c: 'La ecuación $x^2=-1$ no tiene soluciones reales.', ok: 'existe un real $x$ con $x^2=-1$', mal: ['para todo real $x$, $x^2=-1$', 'existe un real $x$ con $x^2=1$', 'existe un complejo $x$ con $x^2=-1$'] },
  ];
  R.generador({
    id: 'w1.n5.suponer-absurdo', mundo: 1, nivel: '1.5', familia: 'aplicacion', habilidades: ['1.5.negar-para-contradiccion'], dificultad: 2, autoexplicacion: null,
    generar(rng) {
      const c = rng.pick(ABS), ops = rng.shuffle([['ok', c.ok]].concat(c.mal.map((m, i) => ['mal' + i, m])));
      return {
        variantKey: c.c + '|' + ops.map(o => o[0]).join(''),
        enunciado: 'Vas a demostrar por reducción al absurdo: «' + c.c + '». ¿Qué debes suponer al comienzo?',
        entrada: { tipo: 'eleccion', opciones: ops.map(o => 'Suponer que ' + o[1]) }, verificador: { id: 'indice', args: { esperado: ops.findIndex(o => o[0] === 'ok') } },
        firmas: ops.map((o, i) => o[0] === 'ok' ? null : { id: 'suposicion-' + o[0], respuesta: i, mensaje: 'Eso no es la negación del enunciado: se supone que la hipótesis se cumple y la conclusión **no** (o, si no hay hipótesis, lo contrario de lo afirmado).' }).filter(Boolean),
        pistas: ['Orientación: por absurdo se supone lo contrario de lo que se quiere probar.', 'Idea clave: la negación de «si P entonces Q» es «P y no Q»; la de «no existe» es «existe»; la de «es irracional», «es racional».', 'Primer paso: escribe el enunciado simbólicamente y niégalo.'],
        explicacion: 'Se supone que ' + c.ok + '.',
      };
    },
  });

  /* ---------- 3. negar un «para todo… si…» (elección) ---------- */
  const IMPL = [
    ['$n$ es par', '$n^2$ es par'], ['$n$ es múltiplo de $6$', '$n$ es múltiplo de $3$'], ['$n$ es primo', '$n$ es impar'], ['$a$ divide a $b$', '$a$ divide a $b^2$'],
    ['$x>1$', '$x^2>x$'], ['$n^2$ es impar', '$n$ es impar'], ['$n$ es múltiplo de $4$', '$n$ es par'], ['$n$ es impar', '$n^2$ es impar'],
  ];
  R.generador({
    id: 'w1.n5.negar-para-todo-si', mundo: 1, nivel: '1.5', familia: 'aplicacion', habilidades: ['1.5.contraejemplo', '1.5.negar-para-contradiccion'], dificultad: 2, autoexplicacion: null,
    generar(rng) {
      const [P, Q] = rng.pick(IMPL), cuant = rng.pick(['todo entero $n$', 'todo entero positivo $n$']);
      const exis = cuant.replace('todo', 'algún').replace('algún entero $n$', 'algún entero $n$');
      const original = 'Para ' + cuant + ', si ' + P + ', entonces ' + Q + '.';
      const ok = 'Existe un entero (positivo, según el caso) $n$ tal que ' + P + ' y **no** ' + Q.replace('$', '$').toString() + '.';
      const opciones = [['ok', 'Existe un $n$ del mismo tipo tal que se cumple ' + P + ' y no se cumple ' + Q + '.'], ['todos-no-q', 'Para todo $n$ del mismo tipo, se cumple ' + P + ' y no se cumple ' + Q + '.'], ['no-p-y-q', 'Existe un $n$ tal que no se cumple ' + P + ' y se cumple ' + Q + '.'], ['no-p-no-q', 'Existe un $n$ tal que no se cumple ' + P + ' ni se cumple ' + Q + '.']];
      const ops = rng.shuffle(opciones); void exis; void ok;
      const msgs = { 'todos-no-q': 'Al negar un «para todo» el cuantificador cambia a «existe» (no se queda en «para todo»).', 'no-p-y-q': 'Para refutar la implicación hace falta que se cumpla la hipótesis y falle la conclusión, no al revés.', 'no-p-no-q': 'Si la hipótesis no se cumple, la implicación es verdadera: eso nunca la refuta.' };
      return {
        variantKey: P + '|' + Q + '|' + ops.map(o => o[0]).join(''),
        enunciado: 'Sea la afirmación: «' + original + '» ¿Cuál es su negación?',
        entrada: { tipo: 'eleccion', opciones: ops.map(o => o[1]) }, verificador: { id: 'indice', args: { esperado: ops.findIndex(o => o[0] === 'ok') } },
        firmas: ops.map((o, i) => o[0] === 'ok' ? null : { id: o[0], respuesta: i, mensaje: msgs[o[0]] }).filter(Boolean),
        pistas: ['Orientación: niega primero el cuantificador y después la implicación.', 'Idea clave: $\\neg(P\\to Q)\\equiv P\\wedge\\neg Q$ y $\\neg\\forall\\equiv\\exists\\neg$.', 'Primer paso: cambia «para todo» por «existe».'],
        explicacion: 'La negación es «existe un $n$ tal que ' + P + ' y no ' + Q + '»: un contraejemplo de la afirmación.',
      };
    },
  });

  /* ---------- 4. buscar un contraejemplo (entero verificado por evaluación) ---------- */
  AC.afirmaciones = AC.afirmaciones || {};
  AC.afirmaciones['primo-poli'] = (n, a) => esPrimo(a.a * n * n + a.b * n + a.c);
  AC.afirmaciones['multiplo-cuadrado'] = (n, a) => !((n * n) % a.a === 0 && n % a.a !== 0);
  AC.afirmaciones['no-multiplo-primo'] = (n, a) => !(n > 1 && n % a.a !== 0) || esPrimo(n);
  AC.afirmaciones['cuadrado-mayor'] = (n, a) => n * n > a.a * n;
  AC.afirmaciones['potencia-mayor'] = (n, a) => a.a ** n >= n ** a.b;
  const poliTex = (a, b, c) => (a === 1 ? 'n^2' : a + 'n^2') + (b === 0 ? '' : (b < 0 ? '-' : '+') + (Math.abs(b) === 1 ? '' : Math.abs(b)) + 'n') + (c < 0 ? '-' : '+') + Math.abs(c);
  const CONTRA = rng => rng.pick([
    () => { const [a, b, c] = rng.pick([[1, 1, 41], [1, -1, 41], [2, 0, 29], [1, 1, 17], [1, -1, 11], [1, 1, 11]]); return { id: 'primo-poli', args: { a, b, c }, rango: [0, 60], texto: 'Para todo entero $n\\ge 0$, el número $' + poliTex(a, b, c) + '$ es primo.' }; },
    () => { const a = rng.pick([4, 8, 9, 12, 16, 18, 25]); return { id: 'multiplo-cuadrado', args: { a }, rango: [1, 80], texto: 'Para todo entero $n\\ge 1$: si $' + a + '$ divide a $n^2$, entonces $' + a + '$ divide a $n$.' }; },
    () => { const a = rng.pick([2, 3, 5]); return { id: 'no-multiplo-primo', args: { a }, rango: [2, 80], texto: 'Todo entero $n>1$ que no es múltiplo de $' + a + '$ es primo.' }; },
    () => { const a = rng.int(3, 12); return { id: 'cuadrado-mayor', args: { a }, rango: [1, 40], texto: 'Para todo entero $n\\ge 1$: $n^2>' + a + 'n$.' }; },
    () => { const [a, b] = rng.pick([[2, 2], [2, 3], [2, 4], [3, 4]]); return { id: 'potencia-mayor', args: { a, b }, rango: [1, 30], texto: 'Para todo entero $n\\ge 1$: $' + a + '^n\\ge n^' + b + '$.' }; },
  ])();
  R.generador({
    id: 'w1.n5.buscar-contraejemplo', mundo: 1, nivel: '1.5', familia: 'aplicacion', habilidades: ['1.5.contraejemplo'], dificultad: 2, autoexplicacion: null,
    generar(rng) {
      for (let i = 0; i < 60; i++) {
        const c = CONTRA(rng), f = AC.afirmaciones[c.id];
        const contra = [], cumple = [];
        for (let n = c.rango[0]; n <= c.rango[1]; n++) (f(n, c.args) ? cumple : contra).push(n);
        if (!contra.length || cumple.length < 2) continue;
        const dos = rng.sample(cumple, 2);
        return {
          variantKey: c.texto,
          enunciado: 'Se afirma: «' + c.texto + '». Es falsa. Escribe un entero $n$ entre ' + c.rango[0] + ' y ' + c.rango[1] + ' que la **refute** (un contraejemplo).',
          entrada: { tipo: 'entero' }, verificador: { id: 'satisface-entero', args: Object.assign({ id: c.id, rango: c.rango }, c.args) },
          firmas: dos.map(n => ({ id: 'ejemplo-que-cumple', respuesta: String(n), mensaje: 'Con $n=' + n + '$ la afirmación **se cumple**: un ejemplo que la confirma no la refuta; hay que encontrar uno donde falle.' })),
          pistas: ['Orientación: un contraejemplo es un caso concreto en que la afirmación falla.', 'Idea clave: prueba valores pequeños uno por uno, comprobando si se cumple lo que se afirma.', 'Primer paso: evalúa la afirmación para los primeros valores.'],
          explicacion: 'Por ejemplo, con $n=' + contra[0] + '$ la afirmación falla.',
        };
      }
      throw new Error('buscar-contraejemplo: sin instancia');
    },
  });

  /* ---------- 5. paridad de expresiones (selección múltiple) ---------- */
  const EXPRS = [
    ['a+b', (a, b) => a + b], ['a\\cdot b', (a, b) => a * b], ['a^2+b', (a, b) => a * a + b], ['a^2+b^2', (a, b) => a * a + b * b], ['a(b+1)', (a, b) => a * (b + 1)],
    ['2a+b', (a, b) => 2 * a + b], ['a+b+1', (a, b) => a + b + 1], ['ab+a', (a, b) => a * b + a], ['(a+1)(b+1)', (a, b) => (a + 1) * (b + 1)], ['a^2b', (a, b) => a * a * b], ['a^3-a', (a, b) => a ** 3 - a], ['a+2b', (a, b) => a + 2 * b],
  ];
  R.generador({
    id: 'w1.n5.paridad-expresiones', mundo: 1, nivel: '1.5', familia: 'aplicacion', habilidades: ['1.5.paridad'], dificultad: 2, autoexplicacion: null,
    generar(rng) {
      for (let i = 0; i < 100; i++) {
        const pa = rng.pick(['par', 'impar']), pb = rng.pick(['par', 'impar']), a = pa === 'par' ? 2 : 1, b = pb === 'par' ? 4 : 3;
        const ops = rng.sample(EXPRS, 5), par = ops.map((o, j) => (o[1](a, b) % 2 === 0 ? j : -1)).filter(j => j >= 0);
        if (!par.length || par.length === 5) continue;
        const firmas = ops.map((o, j) => ({ id: par.includes(j) ? 'omite-par' : 'marca-impar', respuesta: par.includes(j) ? par.filter(x => x !== j) : par.concat(j), mensaje: 'Con $a$ ' + pa + ' y $b$ ' + pb + ', $' + o[0] + '$ es ' + (par.includes(j) ? 'par' : 'impar') + ' (por ejemplo, con $a=' + a + '$, $b=' + b + '$ vale $' + o[1](a, b) + '$; solo importa la paridad de $a$ y $b$).' }));
        return {
          variantKey: pa + pb + ops.map(o => o[0]).join('|'),
          enunciado: 'Sabiendo que $a$ es **' + pa + '** y $b$ es **' + pb + '**, marca todas las expresiones que son **pares**.',
          entrada: { tipo: 'multiple', opciones: ops.map(o => T(o[0])) }, verificador: { id: 'conjunto-indices', args: { esperado: par, n: 5 } }, firmas,
          pistas: ['Orientación: solo importa la paridad de $a$ y $b$; basta probar con un par y un impar concretos.', 'Idea clave: par+par=par, impar+impar=par, par+impar=impar; par·cualquiera=par, impar·impar=impar.', 'Primer paso: sustituye $a$ y $b$ por números de la paridad dada y evalúa.'],
          explicacion: 'Son pares: ' + (par.length ? par.map(j => T(ops[j][0])).join(', ') : 'ninguna') + '.',
        };
      }
      throw new Error('paridad-expresiones: sin instancia');
    },
  });

  /* ---------- demostraciones ---------- */
  const NM = [['a', 'b'], ['m', 'n'], ['x', 'y']];
  dem({
    id: 'dem.paridad-operaciones', teorema: 't.paridad-operaciones', nivel: '1.5', habilidades: ['1.5.paridad', '1.5.demostrar'], requiere: [], refsExtra: ['b.dicotomia-paridad', 'b.contradiccion'],
    param: rng => { const [a, b] = rng.pick(NM); return { a, b, k: rng.pick(['k', 'p']), l: rng.pick(['l', 'q']) }; },
    enunciado: p => r`Demuestra que si $${p.a}$ y $${p.b}$ son enteros impares, entonces $${p.a}+${p.b}$ es par y $${p.a}${p.b}$ es impar.`,
    hip: p => [r`$${p.a}$ y $${p.b}$ son enteros impares`, r`un entero $z$ es par si $z=2m$ e impar si $z=2m+1$, con $m\in\mathbb{Z}$`],
    meta: p => r`$${p.a}+${p.b}$ es par y $${p.a}${p.b}$ es impar`,
    L: p => [
      ['L1', r`Por ser impares, existen $${p.k},${p.l}\in\mathbb{Z}$ con $${p.a}=2${p.k}+1$ y $${p.b}=2${p.l}+1$.`, 'd.impar'],
      ['L2', r`Suma: $${p.a}+${p.b}=2${p.k}+2${p.l}+2=2\cdot$ ⟦h1⟧, con $${p.k}+${p.l}+1\in\mathbb{Z}$; luego $${p.a}+${p.b}$ es par.`, 'd.par', ['L1'], [H('h1', '(' + p.k + '+' + p.l + '+1)', ['(' + p.k + '+' + p.l + ')', '(' + p.k + p.l + '+1)', '(2' + p.k + '+' + p.l + ')'])]],
      ['L3', r`Producto: $${p.a}${p.b}=(2${p.k}+1)(2${p.l}+1)=4${p.k}${p.l}+2${p.k}+2${p.l}+1=2(2${p.k}${p.l}+${p.k}+${p.l})+1$, con $2${p.k}${p.l}+${p.k}+${p.l}\in\mathbb{Z}$; luego $${p.a}${p.b}$ es impar.`, 'd.impar', ['L1']],
      ['L4', r`Las dos afirmaciones están probadas. ∎`, 'b.cerradura-enteros', ['L2', 'L3']],
    ],
    dist: p => [
      [r`Como $3$ y $5$ son impares, $3+5=8$ es par y $3\cdot 5=15$ es impar; por tanto vale siempre.`, 'un ejemplo no prueba un enunciado general'],
      [r`Sean $${p.a}=2${p.k}$ y $${p.b}=2${p.l}$; entonces $${p.a}+${p.b}=2(${p.k}+${p.l})$ es par.`, 'toma pares en lugar de impares'],
    ],
    err: p => [
      ['L2', r`Suma: $${p.a}+${p.b}=2${p.k}+2${p.l}+1=2(${p.k}+${p.l})+1$; luego $${p.a}+${p.b}$ es impar.`, 'error-de-calculo', 'Los dos $+1$ suman $2$, no $1$: $2k+1+2l+1=2(k+l+1)$.'],
      ['L3', r`Producto: $${p.a}${p.b}=(2${p.k}+1)(2${p.l}+1)=4${p.k}${p.l}+1$; luego es impar.`, 'error-de-calculo', 'Faltan los términos cruzados $2k+2l$ al desarrollar.'],
      ['L1', r`Por ser impares, existe $${p.k}\in\mathbb{Z}$ con $${p.a}=2${p.k}+1$ y $${p.b}=2${p.k}+1$.`, 'conclusion-invalida', 'Cada número necesita su propio entero: $a$ y $b$ pueden ser distintos.'],
    ],
    est: [['directa', 'Escribir $a=2k+1$ y $b=2l+1$ y operar', true, 'Es la prueba estándar.'], ['clases', 'Trabajar con los restos módulo $2$', true, 'Equivale a lo anterior con otra notación.'], ['ejemplos', 'Comprobar con varios pares de impares', false, 'Ningún número finito de ejemplos prueba un enunciado para todos.'], ['contradiccion', 'Suponer que la suma es impar y buscar una contradicción', true, 'Funciona, aunque no aporta nada sobre la directa.']],
    crit: ['Escribí $a$ y $b$ con enteros distintos', 'Desarrollé la suma y el producto', 'Reconocí la forma $2m$ o $2m+1$', 'Verifiqué que el entero obtenido es entero'],
    pistas: p => ['Orientación: la definición de «impar» es la herramienta.', r`Idea clave: escribe $${p.a}=2${p.k}+1$, $${p.b}=2${p.l}+1$ con enteros **distintos** $${p.k},${p.l}$.`, r`Primer paso: desarrolla $(2${p.k}+1)+(2${p.l}+1)$.`],
  });

  dem({
    id: 'dem.cuadrado-par', teorema: 't.cuadrado-par', nivel: '1.5', habilidades: ['1.5.metodo', '1.5.paridad', '1.5.demostrar'], requiere: ['t.contrapositiva', 't.paridad-operaciones'], refsExtra: ['d.par', 'b.contradiccion'],
    param: rng => ({ n: rng.pick(['n', 'm', 'k']) }),
    enunciado: p => r`Demuestra que, para todo entero $${p.n}$: si $${p.n}^2$ es par, entonces $${p.n}$ es par.`,
    hip: p => [r`$${p.n}\in\mathbb{Z}$`, 'Puedes citar la contrapositiva y la paridad de productos'],
    meta: p => r`$${p.n}^2$ par $\Rightarrow ${p.n}$ par`,
    L: p => [
      ['L1', r`Todo entero es par o impar, y no ambos; por eso «$${p.n}$ no es par» equivale a «$${p.n}$ es impar».`, 'b.dicotomia-paridad'],
      ['L2', r`Probamos la contrapositiva: si $${p.n}$ es impar, entonces $${p.n}^2$ es impar.`, 't.contrapositiva', ['L1']],
      ['L3', r`Sea $${p.n}$ impar. Por el teorema de ⟦h1⟧ aplicado a $${p.n}$ y $${p.n}$, el producto $${p.n}\cdot ${p.n}$ es impar.`, 't.paridad-operaciones', ['L2'], [H('h1', 'paridad de sumas y productos', ['paridad de sumas y productos', 'la contrapositiva', 'la división con resto'], false)]],
      ['L4', r`Luego $${p.n}^2$ es impar, y la contrapositiva está probada.`, 'd.impar', ['L3']],
      ['L5', r`Por la contrapositiva, si $${p.n}^2$ es par entonces $${p.n}$ es par. ∎`, 't.contrapositiva', ['L4']],
    ],
    dist: p => [
      [r`Como $${p.n}^2=2k$, entonces $${p.n}=2\sqrt{k}$; luego $${p.n}$ es par.`, 'supone que $\\sqrt{k}$ es un entero'],
      [r`Probamos el recíproco: si $${p.n}$ es par, entonces $${p.n}^2$ es par.`, 'confunde la contrapositiva con el recíproco'],
    ],
    err: p => [
      ['L3', r`Sea $${p.n}$ impar. Como $${p.n}$ es impar, $${p.n}\cdot ${p.n}$ es par.`, 'error-de-calculo', 'El producto de dos impares es impar, no par.'],
      ['L4', r`Luego $${p.n}^2$ es par, y la contrapositiva está probada.`, 'conclusion-invalida', 'Lo que se obtiene es $n^2$ impar.'],
      ['L5', r`Por la contrapositiva, si $${p.n}$ es par entonces $${p.n}^2$ es par. ∎`, 'conclusion-invalida', 'Eso es el recíproco, no la contrapositiva.'],
    ],
    est: [['contrapositiva', 'Probar la contrapositiva: $n$ impar $\\Rightarrow n^2$ impar', true, 'Es la prueba más corta.'], ['absurdo', 'Suponer $n^2$ par y $n$ impar, y llegar a una contradicción', true, 'Equivale a la contrapositiva.'], ['directa', 'Partir de $n^2=2k$ y despejar $n$', false, 'No se puede despejar $n$ sin saber ya lo que se quiere probar.'], ['induccion', 'Inducción sobre $n$', false, 'No hay estructura recursiva en la hipótesis.']],
    crit: ['Enuncié la contrapositiva correcta', 'Usé la dicotomía par/impar', 'Cité la paridad de productos', 'Concluí con la contrapositiva'],
    pistas: p => ['Orientación: partir de $n^2=2k$ no lleva a ninguna parte; mira la contrapositiva.', r`Idea clave: la contrapositiva es «$${p.n}$ impar $\Rightarrow ${p.n}^2$ impar».`, r`Primer paso: escribe la contrapositiva de «$${p.n}^2$ par $\Rightarrow ${p.n}$ par».`],
  });

  dem({
    id: 'dem.raiz2-irracional', teorema: 't.raiz2-irracional', nivel: '1.5', habilidades: ['1.5.metodo', '1.5.negar-para-contradiccion', '1.5.demostrar'], requiere: ['t.cuadrado-par'], refsExtra: ['d.impar', 'b.construccion'],
    param: rng => { const [a, b] = rng.pick([['a', 'b'], ['p', 'q']]); return { a, b, k: rng.pick(['k', 'm']) }; },
    enunciado: p => r`Demuestra que $\sqrt{2}$ es irracional.`,
    hip: p => ['Puedes citar el teorema «$n^2$ par implica $n$ par»', r`Todo racional positivo se escribe $a/b$ con $a,b\in\mathbb{N}$, $b\neq 0$, no ambos pares`],
    meta: p => r`$\sqrt{2}\notin\mathbb{Q}$`,
    L: p => [
      ['L1', r`Supongamos, por reducción al absurdo, que $\sqrt{2}$ es racional.`, 'b.contradiccion'],
      ['L2', r`Entonces $\sqrt{2}=${p.a}/${p.b}$ con $${p.a},${p.b}\in\mathbb{N}$, $${p.b}\neq 0$, no ambos pares.`, 'b.fraccion-irreducible', ['L1']],
      ['L3', r`Elevando al cuadrado, $2=${p.a}^2/${p.b}^2$, es decir, $${p.a}^2=2${p.b}^2$.`, 'b.cuerpo-algebra', ['L2']],
      ['L4', r`Luego $${p.a}^2$ es par (es $2$ por un entero).`, 'd.par', ['L3']],
      ['L5', r`Por el teorema de ⟦h1⟧, $${p.a}$ es par: $${p.a}=2${p.k}$ con $${p.k}\in\mathbb{N}$.`, 't.cuadrado-par', ['L4'], [H('h1', 'el cuadrado par', ['el cuadrado par', 'la paridad de sumas', 'la contrapositiva'], false)]],
      ['L6', r`Sustituyendo, $4${p.k}^2=2${p.b}^2$, o sea $${p.b}^2=2${p.k}^2$; luego $${p.b}^2$ es par.`, 'b.cuerpo-algebra', ['L3', 'L5']],
      ['L7', r`Por el mismo teorema, $${p.b}$ es par.`, 't.cuadrado-par', ['L6']],
      ['L8', r`Entonces $${p.a}$ y $${p.b}$ son ambos pares, en contradicción con L2. Por tanto $\sqrt{2}$ es irracional. ∎`, 'b.contradiccion', ['L2', 'L5', 'L7']],
    ],
    dist: p => [
      [r`Como $\sqrt{2}=1{,}41421\ldots$ no se repite, $\sqrt{2}$ es irracional.`, 'comprobar cifras no prueba nada: no es una demostración'],
      [r`Como $${p.a}^2=2${p.b}^2$, $${p.a}^2$ es par; luego $${p.a}$ y $${p.b}$ son pares.`, 'omite probar que $b$ es par y usa un salto sin justificar'],
    ],
    err: p => [
      ['L3', r`Elevando al cuadrado, $2=${p.a}^2/${p.b}$, es decir, $${p.a}^2=2${p.b}$.`, 'error-de-calculo', 'También $b$ se eleva al cuadrado: $a^2=2b^2$.'],
      ['L6', r`Sustituyendo, $2${p.k}^2=2${p.b}^2$, o sea $${p.b}^2=${p.k}^2$.`, 'error-de-calculo', '$(2k)^2=4k^2$, no $2k^2$.'],
      ['L2', r`Entonces $\sqrt{2}=${p.a}/${p.b}$ con $${p.a},${p.b}\in\mathbb{N}$ pares.`, 'conclusion-invalida', 'La fracción se toma con $a,b$ **no ambos pares**; esa condición es la que da la contradicción.'],
    ],
    est: [['absurdo', 'Reducción al absurdo con la fracción irreducible', true, 'Es la prueba clásica.'], ['descenso', 'Descenso infinito: de $a^2=2b^2$ salen enteros más pequeños con la misma propiedad', true, 'Es la versión sin fracción irreducible; usa el buen orden de $\\mathbb{N}$.'], ['decimales', 'Calcular muchas cifras decimales de $\\sqrt{2}$', false, 'Un número finito de cifras no decide la irracionalidad.'], ['directa', 'Probar directamente que $\\sqrt{2}$ no es un cociente de enteros', false, 'No hay un camino directo: se razona mejor negando.']],
    crit: ['Supuse que es racional', 'Escribí la fracción con no ambos pares', 'Concluí $a$ par y $b$ par', 'Señalé la contradicción'],
    pistas: p => ['Orientación: «es irracional» es una negación; se prueba mejor por reducción al absurdo.', r`Idea clave: de $${p.a}^2=2${p.b}^2$ salen, con el teorema de paridad, $${p.a}$ y $${p.b}$ pares.`, r`Primer paso: supón $\sqrt{2}=${p.a}/${p.b}$ con $${p.a},${p.b}$ no ambos pares.`],
  });

  dem({
    id: 'dem.densidad-racionales', teorema: 't.densidad-racionales', nivel: '1.5', habilidades: ['1.5.construir', '1.5.demostrar'], requiere: [], refsExtra: ['b.contradiccion', 'b.arbitrario'],
    param: rng => { const [p, q] = rng.pick([['p', 'q'], ['a', 'b'], ['x', 'y']]); return { p, q, r: rng.pick(['r', 's']) }; },
    enunciado: p => r`Demuestra que si $${p.p}<${p.q}$ son números racionales, existe un racional $${p.r}$ con $${p.p}<${p.r}<${p.q}$.`,
    hip: p => [r`$${p.p},${p.q}\in\mathbb{Q}$ con $${p.p}<${p.q}$`],
    meta: p => r`existe $${p.r}\in\mathbb{Q}$ con $${p.p}<${p.r}<${p.q}$`,
    L: p => [
      ['L1', r`Construimos el candidato $${p.r}=\dfrac{${p.p}+${p.q}}{2}$.`, 'b.construccion'],
      ['L2', r`$${p.r}$ es racional: la suma de racionales es racional y dividir entre $2$ también.`, 'b.cuerpo-algebra', ['L1']],
      ['L3', r`Como $${p.p}<${p.q}$, sumando $${p.p}$ a ambos lados, $2${p.p}<${p.p}+${p.q}$, y dividiendo entre ⟦h1⟧ queda $${p.p}<${p.r}$.`, 'b.orden', ['L1'], [H('h1', '2', ['2', '-2', '(p+q)'].map((x, i) => i === 2 ? '(' + p.p + '+' + p.q + ')' : x), false)]],
      ['L4', r`Como $${p.p}<${p.q}$, sumando $${p.q}$ a ambos lados, $${p.p}+${p.q}<2${p.q}$, y dividiendo entre $2$ queda $${p.r}<${p.q}$.`, 'b.orden', ['L1']],
      ['L5', r`Entonces $${p.p}<${p.r}<${p.q}$ con $${p.r}$ racional. ∎`, 'b.construccion', ['L2', 'L3', 'L4']],
    ],
    dist: p => [
      [r`Sea $${p.r}=${p.p}+${p.q}$; entonces $${p.p}<${p.r}<${p.q}$.`, 'falso: por ejemplo con $p=2$, $q=3$ da $r=5>q$'],
      [r`Como los racionales son un conjunto infinito, entre dos racionales siempre hay otro.`, 'ser infinito no basta: los enteros también lo son y entre $1$ y $2$ no hay otro'],
    ],
    err: p => [
      ['L3', r`Como $${p.p}<${p.q}$, sumando $${p.p}$ a ambos lados, $2${p.p}<${p.p}+${p.q}$, y dividiendo entre $-2$ queda $${p.p}<${p.r}$.`, 'error-de-calculo', 'Dividir entre un negativo invierte la desigualdad; aquí se divide entre $2>0$.'],
      ['L4', r`Como $${p.p}<${p.q}$, sumando $${p.q}$ a ambos lados, $${p.p}+${p.q}<${p.q}$.`, 'error-de-calculo', 'Al sumar $q$ a ambos lados queda $p+q<2q$.'],
      ['L2', r`$${p.r}$ es racional porque $${p.p}$ y $${p.q}$ lo son y $${p.r}$ está entre ellos.`, 'circular', 'Estar entre dos racionales no hace racional a un número: eso es lo que hay que justificar con las operaciones.'],
    ],
    est: [['construccion', 'Construir el punto medio y verificarlo', true, 'Es la prueba estándar para un «existe».'], ['absurdo', 'Suponer que no hay racionales entre $p$ y $q$ y llegar a una contradicción', true, 'Posible, pero acaba construyendo el punto medio igualmente.'], ['induccion', 'Inducción sobre el denominador', false, 'No es necesaria ni natural aquí.'], EST_EJEMPLO],
    crit: ['Propuse un candidato concreto', 'Probé que es racional', 'Probé las dos desigualdades', 'Concluí la existencia'],
    pistas: p => ['Orientación: un «existe» se prueba exhibiendo el objeto.', r`Idea clave: el punto medio de $${p.p}$ y $${p.q}$.`, r`Primer paso: define $${p.r}=(${p.p}+${p.q})/2$.`],
  });

  R.nivel({
    id: '1.5', mundo: 1, titulo: 'Métodos de demostración', tema: 'Directa, contrapositiva, reducción al absurdo y construcción',
    habilidades: ['1.5.metodo', '1.5.negar-para-contradiccion', '1.5.paridad', '1.5.contraejemplo', '1.5.construir', '1.5.demostrar'],
    teoremas: ['t.paridad-operaciones', 't.cuadrado-par', 't.raiz2-irracional', 't.densidad-racionales'],
    leccion: {
      intro: 'Demostrar es dar una cadena de pasos justificados desde las hipótesis hasta la conclusión. La **forma del enunciado** sugiere el método.',
      definiciones: [
        { nombre: 'Directa y contrapositiva', tex: '**Directa**: se supone $P$ y se llega a $Q$. **Contrapositiva**: se prueba $\\neg Q\\Rightarrow\\neg P$, que es equivalente a $P\\Rightarrow Q$; conviene cuando «no $Q$» da más información que $P$.' },
        { nombre: 'Reducción al absurdo', tex: 'Para probar $P$ se supone $\\neg P$ y se llega a una contradicción. Para probar $P\\Rightarrow Q$ se supone $P$ **y** $\\neg Q$.' },
        { nombre: 'Construcción y contraejemplo', tex: 'Un enunciado «existe» se prueba exhibiendo el objeto. Un enunciado «para todo» se refuta con **un** contraejemplo; un ejemplo que lo cumple no prueba nada.' },
        { nombre: 'Paridad', tex: 'Un entero es **par** si es $2k$ e **impar** si es $2k+1$ con $k\\in\\mathbb{Z}$. Cada entero es de una sola clase.' },
      ],
      teorema: 't.raiz2-irracional',
      ejemplo: { enunciado: 'Demuestra que la suma de dos enteros pares es par.', pasos: ['Método directo. Sean $a=2k$ y $b=2l$ con $k,l\\in\\mathbb{Z}$ (definición de par; enteros distintos para cada número).', '$a+b=2k+2l=2(k+l)$.', 'Como $k+l\\in\\mathbb{Z}$, $a+b$ es par. ∎'] },
    },
  });

  if (typeof module !== 'undefined') module.exports = AC;
})(globalThis.AC = globalThis.AC || {});
