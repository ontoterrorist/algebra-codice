/* Mundo 2, nivel 2.2 — Algoritmo de Euclides, Bézout y ecuaciones diofánticas. */
(function (AC) {
  const { R, H, T, gen, dem2 } = AC.cont, r = String.raw, N = AC.numth;

  const HB = (id, nombre) => R.habilidad({ id: '2.2.' + id, nombre, nivel: '2.2' });
  HB('euclides', 'El algoritmo de Euclides'); HB('mcd-mcm', 'mcd y mcm'); HB('bezout', 'Identidad de Bézout'); HB('diofantica', 'Ecuaciones diofánticas'); HB('contexto', 'Problemas en contexto'); HB('demostrar', 'Demostrar con mcd');
  const TE = (id, titulo, enunciado, requiere, hab) => R.teorema({ id, titulo, nivel: '2.2', enunciado, requiere, habilidades: hab });
  TE('t.mcd-euclides', 'Paso del algoritmo de Euclides', r`Si $a=bq+r$, entonces $\operatorname{mcd}(a,b)=\operatorname{mcd}(b,r)$.`, ['t.div-combinacion'], ['2.2.euclides', '2.2.demostrar']);
  TE('t.bezout', 'Identidad de Bézout', r`Si $a,b$ no son ambos $0$, existen $x,y\in\mathbb{Z}$ con $\operatorname{mcd}(a,b)=ax+by$.`, ['t.algoritmo-division', 't.buen-orden', 't.div-combinacion'], ['2.2.bezout', '2.2.demostrar']);
  TE('t.lema-euclides', 'Lema de Euclides', r`Si $\operatorname{mcd}(a,b)=1$ y $a\mid bc$, entonces $a\mid c$.`, ['t.bezout', 't.div-combinacion'], ['2.2.mcd-mcm', '2.2.demostrar']);
  TE('t.diofantica', 'Ecuación diofántica lineal', r`$ax+by=c$ tiene solución entera si y solo si $\operatorname{mcd}(a,b)\mid c$.`, ['t.bezout', 't.div-combinacion'], ['2.2.diofantica', '2.2.demostrar']);

  /* ---------- generadores ---------- */
  gen.entero({
    id: 'w2.n2.mcd-mcm', nivel: '2.2', habilidades: ['2.2.mcd-mcm'], dificultad: 1,
    hacer(rng) {
      const g = rng.int(2, 9), x = rng.int(2, 12), y = rng.int(2, 12);
      if (N.gcd(x, y) !== 1 || x === y) return null;
      const a = g * x, b = g * y, pide = rng.pick(['mcd', 'mcm']), res = pide === 'mcd' ? g : g * x * y;
      return { key: pide + a + ',' + b, enun: 'Calcula $\\operatorname{' + pide + '}(' + a + ',' + b + ')$.', res,
        firmas: [['confunde-mcd-mcm', pide === 'mcd' ? g * x * y : g, 'Confundiste el mcd con el mcm: el mcd es el mayor divisor común; el mcm, el menor múltiplo común.'], ['producto', a * b, 'Eso es el producto $ab$; se cumple $\\operatorname{mcd}\\cdot\\operatorname{mcm}=ab$.'], ['menor', Math.min(a, b), 'El menor de los números no es ni el mcd ni el mcm en general.']],
        pistas: ['Orientación: usa el algoritmo de Euclides o factoriza ambos números.', 'Idea clave: $\\operatorname{mcd}(a,b)\\cdot\\operatorname{mcm}(a,b)=ab$.', 'Primer paso: divide $' + Math.max(a, b) + '$ entre $' + Math.min(a, b) + '$.'], expl: '$\\operatorname{mcd}=' + g + '$ y $\\operatorname{mcm}=' + g * x * y + '$.' };
    },
  });

  gen.entero({
    id: 'w2.n2.pasos-euclides', nivel: '2.2', habilidades: ['2.2.euclides'], dificultad: 2,
    hacer(rng) {
      const a = rng.int(60, 999), b = rng.int(20, a - 1), pasos = N.pasosEuclides(a, b), res = pasos.length;
      if (res < 3 || res > 8) return null;
      return { key: a + ',' + b, enun: 'Al aplicar el algoritmo de Euclides a $(' + a + ',' + b + ')$, ¿cuántas divisiones se hacen hasta llegar a resto $0$?', res,
        firmas: [['sin-la-ultima', res - 1, 'Cuenta también la última división, la que da resto $0$.'], ['una-mas', res + 1, 'Te pasaste de una: se detiene al obtener resto $0$.']],
        pistas: ['Orientación: ejecuta el algoritmo paso a paso.', 'Idea clave: $a=bq+r$; luego se repite con $(b,r)$ hasta que $r=0$.', 'Primer paso: $' + a + '=' + b + '\\cdot ' + pasos[0].q + '+' + pasos[0].r + '$.'], expl: pasos.map(p => p.a + '=' + p.b + '\\cdot ' + p.q + '+' + p.r).map(T).join('; ') + '.' };
    },
  });

  const COMB = (a, b, d) => (x, y) => a * x + b * y === d;
  gen.tupla({
    id: 'w2.n2.bezout-coef', nivel: '2.2', habilidades: ['2.2.bezout'], dificultad: 3,
    hacer(rng) {
      const a = rng.int(7, 90), b = rng.int(7, 90); if (a === b) return null;
      const [g, x, y] = N.egcd(a, b); if (Math.abs(x) < 1 && Math.abs(y) < 1) return null;
      const ok = COMB(a, b, g);
      const f = [['signo', [-x, -y], 'Cambiaste el signo de ambos: da $-' + g + '$.'], ['intercambiados', [y, x], 'Intercambiaste $x$ e $y$: $x$ multiplica a $' + a + '$ y $y$ a $' + b + '$.'], ['solo-un-resto', [1, -Math.floor(a / b)], 'Eso es solo el primer paso del algoritmo: hay que seguir hasta el mcd.']].filter(q => !ok(q[1][0], q[1][1]));
      return { key: a + ',' + b, enun: 'Halla enteros $x,y$ tales que $' + a + 'x+' + b + 'y=\\operatorname{mcd}(' + a + ',' + b + ')$. Vale cualquier solución (el juego la comprueba).', campos: ['x', 'y'], res: [x, y], verificador: { id: 'combinacion-lineal', args: { a, b, d: g } }, firmas: f,
        pistas: ['Orientación: aplica Euclides y despeja los restos hacia atrás.', 'Idea clave: cada resto es combinación de los dos anteriores; sustituye de abajo hacia arriba.', 'Primer paso: escribe las divisiones del algoritmo: $' + N.pasosEuclides(a, b).map(p => p.a + '=' + p.b + p.q + '+' + p.r).slice(0, 2).join(',\\ ') + '\\dots$'], expl: 'Por ejemplo $x=' + x + '$, $y=' + y + '$ (hay infinitas).' };
    },
  });

  gen.tupla({
    id: 'w2.n2.diofantica-particular', nivel: '2.2', habilidades: ['2.2.diofantica'], dificultad: 3,
    hacer(rng) {
      const g = rng.int(1, 6), a = g * rng.int(2, 12), b = g * rng.int(2, 12); if (N.gcd(a, b) !== g || a === b) return null;
      const k = rng.int(1, 9) * (rng.chance(0.3) ? -1 : 1), c = g * k, [, x0, y0] = N.egcd(a, b), x = x0 * k, y = y0 * k, ok = COMB(a, b, c);
      const f = [['sin-escalar', [x0, y0], 'Esa es una solución de $' + a + 'x+' + b + 'y=' + g + '$; hay que multiplicarla por $' + c / g + '$ para obtener ' + c + '.'], ['signo', [-x, -y], 'Con el signo contrario sale $' + (-c) + '$.']].filter(q => !ok(q[1][0], q[1][1]));
      return { key: [a, b, c].join(','), enun: 'Halla una solución entera $(x,y)$ de $' + a + 'x+' + b + 'y=' + c + '$.', campos: ['x', 'y'], res: [x, y], verificador: { id: 'combinacion-lineal', args: { a, b, d: c } }, firmas: f,
        pistas: ['Orientación: primero comprueba que $\\operatorname{mcd}(' + a + ',' + b + ')$ divide a $' + c + '$.', 'Idea clave: halla Bézout para el mcd y multiplica por $c/\\operatorname{mcd}$.', 'Primer paso: calcula $\\operatorname{mcd}(' + a + ',' + b + ')=' + g + '$ con Euclides.'], expl: 'Una solución es $(' + x + ',' + y + ')$.' };
    },
  });

  gen.entero({
    id: 'w2.n2.contexto-mcd-mcm', nivel: '2.2', habilidades: ['2.2.contexto', '2.2.mcd-mcm'], dificultad: 2,
    hacer(rng) {
      const g = rng.int(2, 9), x = rng.int(2, 9), y = rng.int(2, 9); if (N.gcd(x, y) !== 1 || x === y) return null;
      const a = g * x, b = g * y, tipo = rng.pick(['jarras', 'baldosas', 'luces', 'engranajes']);
      const T0 = {
        jarras: { enun: 'Tienes dos jarras de $' + a + '$ y $' + b + '$ litros y un depósito grande. Llenando, vaciando y trasvasando, ¿cuál es la menor cantidad positiva de litros que puedes medir en el depósito?', res: g, f: [['menor', Math.min(a, b), 'No basta con la menor jarra: combinando se pueden medir cantidades menores.'], ['mcm', g * x * y, 'El mcm no es la cantidad mínima medible: es la mínima coincidencia de múltiplos.']] },
        baldosas: { enun: 'Se quiere cubrir un suelo rectangular de $' + a + '\\times ' + b + '$ decímetros con baldosas cuadradas iguales, sin cortar ni solapar. ¿Cuál es el lado máximo (en decímetros) de la baldosa?', res: g, f: [['mcm', g * x * y, 'El lado debe dividir a ambas medidas: es el mcd, no el mcm.'], ['menor', Math.min(a, b), 'La menor medida no siempre divide a la mayor.']] },
        luces: { enun: 'Una luz parpadea cada $' + a + '$ segundos y otra cada $' + b + '$ segundos; ahora coinciden. ¿Dentro de cuántos segundos volverán a coincidir por primera vez?', res: g * x * y, f: [['mcd', g, 'El mcd da el mayor intervalo que divide a ambos; la coincidencia es el menor múltiplo común.'], ['producto', a * b, 'El producto $ab$ coincide solo si son coprimos; el primer instante común es el mcm.']] },
        engranajes: { enun: 'Dos engranajes tienen $' + a + '$ y $' + b + '$ dientes y empiezan alineados. ¿Cuántos dientes habrán pasado cuando vuelvan a estar alineados por primera vez?', res: g * x * y, f: [['mcd', g, 'Vuelven a alinearse cuando ambos han pasado un múltiplo de sus dientes: el mcm.'], ['producto', a * b, 'El producto es un instante de alineación, pero no el primero.']] },
      }[tipo];
      return { key: tipo + a + ',' + b, enun: T0.enun, res: T0.res, firmas: T0.f,
        pistas: ['Orientación: decide si se pide un divisor común (mcd) o un múltiplo común (mcm).', 'Idea clave: «el mayor tamaño que cabe en ambos» es mcd; «cuándo coinciden» es mcm.', 'Primer paso: calcula $\\operatorname{mcd}(' + a + ',' + b + ')$ con Euclides.'], expl: 'La respuesta es ' + T0.res + '.' };
    },
  });

  /* ---------- demostraciones ---------- */
  const NM = [['a', 'b', 'c'], ['m', 'n', 'k']];
  dem2({
    id: 'dem.mcd-euclides', teorema: 't.mcd-euclides', nivel: '2.2', habilidades: ['2.2.euclides', '2.2.demostrar'], requiere: ['t.div-combinacion'], refsExtra: ['b.arbitrario'],
    param: rng => { const [a, b, c] = rng.pick(NM); return { a, b, q: rng.pick(['q', 'k']), r: rng.pick(['r', 's']), d: rng.pick(['d', 'e']) }; },
    enunciado: p => r`Demuestra que si $${p.a}=${p.b}${p.q}+${p.r}$, entonces $\operatorname{mcd}(${p.a},${p.b})=\operatorname{mcd}(${p.b},${p.r})$.`,
    hip: p => [r`$${p.a},${p.b},${p.q},${p.r}\in\mathbb{Z}$ con $${p.a}=${p.b}${p.q}+${p.r}$`, 'Puedes citar la divisibilidad de combinaciones'], meta: p => r`$\operatorname{mcd}(${p.a},${p.b})=\operatorname{mcd}(${p.b},${p.r})$`,
    L: p => [
      ['L1', r`Sea $${p.d}$ un divisor común de $${p.a}$ y $${p.b}$. Como $${p.r}=${p.a}\cdot 1+${p.b}\cdot(-${p.q})$, por la divisibilidad de combinaciones $${p.d}\mid ${p.r}$; así $${p.d}$ divide a $${p.b}$ y a $${p.r}$.`, 't.div-combinacion'],
      ['L2', r`Recíprocamente, si $${p.d}$ divide a $${p.b}$ y a $${p.r}$, como $${p.a}=${p.b}\cdot ${p.q}+${p.r}\cdot 1$, por la ⟦h1⟧, $${p.d}\mid ${p.a}$.`, 't.div-combinacion', [], [H('h1', 'divisibilidad de combinaciones', ['divisibilidad de combinaciones', 'transitividad', 'cota del divisor'], false)]],
      ['L3', r`Los pares $(${p.a},${p.b})$ y $(${p.b},${p.r})$ tienen los mismos divisores comunes; por tanto el mayor de ellos es el mismo: $\operatorname{mcd}(${p.a},${p.b})=\operatorname{mcd}(${p.b},${p.r})$. ∎`, 'd.mcd', ['L1', 'L2']],
    ],
    dist: p => [[r`Como $${p.a}>${p.b}>${p.r}$, el mcd de los mayores es mayor: $\operatorname{mcd}(${p.a},${p.b})>\operatorname{mcd}(${p.b},${p.r})$.`, 'los mcd coinciden; el tamaño de los números no los cambia'], [r`Con $${p.a}=12$, $${p.b}=8$, $${p.r}=4$ vale: $\operatorname{mcd}(12,8)=\operatorname{mcd}(8,4)$; luego siempre.`, 'un ejemplo no prueba el resultado general']],
    err: p => [['L1', r`Sea $${p.d}$ un divisor común de $${p.a}$ y $${p.b}$. Como $${p.r}=${p.a}+${p.b}${p.q}$, $${p.d}\mid ${p.r}$.`, 'error-de-calculo', 'De $a=bq+r$ sale $r=a-bq$, con signo menos.'], ['L3', r`Los pares tienen los mismos divisores comunes, luego $${p.a}=${p.b}$. ∎`, 'conclusion-invalida', 'De los mismos divisores comunes se concluye la igualdad de mcd, no de $a$ y $b$.']],
    valida: [['conjuntos', r`Probar que los dos pares tienen los mismos divisores comunes`, 'Es la prueba estándar.']],
    idea: p => r`escribe $${p.r}=${p.a}-${p.b}${p.q}$ y $${p.a}=${p.b}${p.q}+${p.r}$ como combinaciones.`, primero: p => r`toma un divisor común $${p.d}$ de $${p.a}$ y $${p.b}$.`,
  });

  dem2({
    id: 'dem.bezout', teorema: 't.bezout', nivel: '2.2', habilidades: ['2.2.bezout', '2.2.demostrar'], requiere: ['t.algoritmo-division', 't.buen-orden', 't.div-combinacion'], refsExtra: ['b.arbitrario', 'd.division-euclidiana'],
    param: rng => { const [a, b] = rng.pick([['a', 'b'], ['m', 'n']]); return { a, b, d: rng.pick(['d', 'g']), x: rng.pick(['x', 's']), y: rng.pick(['y', 't']) }; },
    enunciado: p => r`Demuestra que si $${p.a},${p.b}$ no son ambos $0$, existen $${p.x},${p.y}\in\mathbb{Z}$ con $\operatorname{mcd}(${p.a},${p.b})=${p.a}${p.x}+${p.b}${p.y}$.`,
    hip: p => [r`$${p.a},${p.b}\in\mathbb{Z}$ no ambos nulos`, 'Puedes citar el buen orden, el algoritmo de la división y la divisibilidad de combinaciones'], meta: p => r`$\operatorname{mcd}(${p.a},${p.b})=${p.a}${p.x}+${p.b}${p.y}$`,
    L: p => [
      ['L1', r`Sea $S=\{${p.a}${p.x}+${p.b}${p.y}\ :\ ${p.x},${p.y}\in\mathbb{Z},\ ${p.a}${p.x}+${p.b}${p.y}>0\}\subseteq\mathbb{N}$. Es no vacío: $${p.a}^2+${p.b}^2\in S$.`, 'b.cuerpo-algebra'],
      ['L2', r`Por el buen orden, $S$ tiene un mínimo $${p.d}=${p.a}${p.x}_0+${p.b}${p.y}_0$.`, 't.buen-orden', ['L1']],
      ['L3', r`Por el algoritmo de la división, $${p.a}=${p.d}q+r$ con $0\le r<${p.d}$; entonces $r=${p.a}(1-q${p.x}_0)+${p.b}(-q${p.y}_0)$ es una combinación de $${p.a}$ y $${p.b}$.`, 't.algoritmo-division', ['L2']],
      ['L4', r`Si $r>0$ estaría en $S$ y sería menor que $${p.d}$: contradicción. Luego $r=0$ y $${p.d}\mid ${p.a}$; igual se prueba $${p.d}\mid ${p.b}$.`, 'b.contradiccion', ['L3']],
      ['L5', r`Si $c$ divide a $${p.a}$ y a $${p.b}$, por la divisibilidad de combinaciones $c\mid ${p.a}${p.x}_0+${p.b}${p.y}_0=${p.d}$; así $${p.d}$ es el mayor divisor común: $${p.d}=\operatorname{mcd}(${p.a},${p.b})$. ∎`, 't.div-combinacion', ['L2', 'L4']],
    ],
    dist: p => [[r`Dividimos $${p.a}$ entre $${p.b}$ y tomamos el último resto no nulo; por eso es combinación.`, 'eso describe el algoritmo, pero no prueba que el último resto sea combinación sin argumentar hacia atrás'], [r`Con $${p.a}=12$, $${p.b}=18$ se tiene $6=12\cdot(-1)+18\cdot 1$; vale siempre.`, 'un ejemplo no prueba el caso general']],
    err: p => [['L1', r`Sea $S=\{${p.a}${p.x}+${p.b}${p.y}\}$ con $${p.x},${p.y}\in\mathbb{Z}$. Es no vacío: $0\in S$.`, 'conclusion-invalida', 'El conjunto debe contener solo valores positivos para aplicar el buen orden: $0\\notin S$.'], ['L4', r`Si $r>0$ estaría en $S$ y sería mayor que $${p.d}$: contradicción.`, 'error-de-calculo', '$r<d$, así que $r$ sería **menor**.'], ['L5', r`Si $c$ divide a $${p.a}$ y a $${p.b}$, $c\mid ${p.d}$; luego $c=${p.d}$. ∎`, 'conclusion-invalida', 'De $c\\mid d$ solo se sigue $c\\le d$, no $c=d$.']],
    valida: [['buen-orden', r`Tomar la menor combinación positiva y probar que divide a ambos`, 'Es la prueba estándar.'], ['euclides', r`Retroceder en el algoritmo de Euclides sustituyendo restos`, 'Es constructiva y válida; se justifica por inducción sobre los pasos.']],
    idea: p => r`la menor combinación positiva de $${p.a}$ y $${p.b}$ divide a ambos y es divisible por cualquier divisor común.`, primero: p => r`define el conjunto $S$ de las combinaciones positivas.`,
  });

  dem2({
    id: 'dem.lema-euclides', teorema: 't.lema-euclides', nivel: '2.2', habilidades: ['2.2.mcd-mcm', '2.2.demostrar'], requiere: ['t.bezout', 't.div-combinacion'], refsExtra: ['d.mcd', 'b.arbitrario'],
    param: rng => { const [a, b, c] = rng.pick(NM); return { a, b, c, x: rng.pick(['x', 's']), y: rng.pick(['y', 't']) }; },
    enunciado: p => r`Demuestra que si $\operatorname{mcd}(${p.a},${p.b})=1$ y $${p.a}\mid ${p.b}${p.c}$, entonces $${p.a}\mid ${p.c}$.`,
    hip: p => [r`$\operatorname{mcd}(${p.a},${p.b})=1$`, r`$${p.a}\mid ${p.b}${p.c}$`], meta: p => r`$${p.a}\mid ${p.c}$`,
    L: p => [
      ['L1', r`Como $\operatorname{mcd}(${p.a},${p.b})=1$, por Bézout existen $${p.x},${p.y}\in\mathbb{Z}$ con $${p.a}${p.x}+${p.b}${p.y}=1$.`, 't.bezout'],
      ['L2', r`Multiplicando por $${p.c}$: $${p.c}=${p.a}${p.c}${p.x}+${p.b}${p.c}${p.y}$.`, 'b.cuerpo-algebra', ['L1']],
      ['L3', r`Como $${p.a}\mid ${p.a}${p.c}$ y $${p.a}\mid ${p.b}${p.c}$, por la divisibilidad de combinaciones $${p.a}\mid ${p.a}${p.c}${p.x}+${p.b}${p.c}${p.y}$.`, 't.div-combinacion', ['L2']],
      ['L4', r`Por L2 y L3, $${p.a}\mid ${p.c}$. ∎`, 'b.cuerpo-algebra', ['L2', 'L3']],
    ],
    dist: p => [[r`Como $${p.a}\mid ${p.b}${p.c}$, entonces $${p.a}\mid ${p.b}$ o $${p.a}\mid ${p.c}$.`, 'falso si $a$ no es primo (p. ej. $6\\mid 2\\cdot 3$)'], [r`Con $${p.a}=3$, $${p.b}=2$, $${p.c}=6$ se cumple; luego vale siempre.`, 'un ejemplo no prueba el caso general']],
    err: p => [['L2', r`Multiplicando por $${p.c}$: $${p.c}=${p.a}${p.x}+${p.b}${p.y}$.`, 'error-de-calculo', 'Al multiplicar por $c$ ambos sumandos quedan multiplicados por $c$.'], ['L3', r`Como $${p.a}\mid ${p.a}${p.c}$ y $${p.a}\mid ${p.c}$, por la divisibilidad de combinaciones...`, 'circular', 'Eso presupone lo que se quiere probar: $a\\mid c$.']],
    valida: [['bezout', r`Escribir $1=ax+by$ y multiplicar por $c$`, 'Es la prueba estándar.']],
    idea: p => r`multiplica la identidad de Bézout por $${p.c}$.`, primero: p => r`escribe $${p.a}${p.x}+${p.b}${p.y}=1$.`,
  });

  dem2({
    id: 'dem.diofantica', teorema: 't.diofantica', nivel: '2.2', habilidades: ['2.2.diofantica', '2.2.demostrar'], requiere: ['t.bezout', 't.div-combinacion'], refsExtra: ['b.doble-implicacion', 'd.mcd'],
    param: rng => { const [a, b, c] = rng.pick(NM); return { a, b, c, x: rng.pick(['x', 's']), y: rng.pick(['y', 't']), d: rng.pick(['d', 'g']) }; },
    enunciado: p => r`Demuestra que $${p.a}${p.x}+${p.b}${p.y}=${p.c}$ tiene solución entera si y solo si $\operatorname{mcd}(${p.a},${p.b})\mid ${p.c}$.`,
    hip: p => [r`$${p.a},${p.b},${p.c}\in\mathbb{Z}$ con $${p.a},${p.b}$ no ambos nulos`], meta: p => r`$\exists ${p.x},${p.y}:\ ${p.a}${p.x}+${p.b}${p.y}=${p.c}\iff\operatorname{mcd}(${p.a},${p.b})\mid ${p.c}$`,
    L: p => [
      ['L1', r`Sea $${p.d}=\operatorname{mcd}(${p.a},${p.b})$. Probamos las dos implicaciones.`, 'b.doble-implicacion'],
      ['L2', r`(⇒) Si $${p.a}${p.x}_0+${p.b}${p.y}_0=${p.c}$, como $${p.d}\mid ${p.a}$ y $${p.d}\mid ${p.b}$, por la divisibilidad de combinaciones $${p.d}\mid ${p.c}$.`, 't.div-combinacion', ['L1']],
      ['L3', r`(⇐) Si $${p.d}\mid ${p.c}$, existe $k$ con $${p.c}=${p.d}k$; por Bézout, $${p.d}=${p.a}${p.x}_1+${p.b}${p.y}_1$.`, 't.bezout', ['L1']],
      ['L4', r`Entonces $${p.c}=${p.a}(${p.x}_1k)+${p.b}(${p.y}_1k)$ y $(${p.x}_1k,${p.y}_1k)$ es una solución entera.`, 'b.cuerpo-algebra', ['L3']],
      ['L5', r`Se cumplen las dos implicaciones. ∎`, 'b.doble-implicacion', ['L2', 'L4']],
    ],
    dist: p => [[r`Si $${p.c}$ es mayor que $${p.a}$ y $${p.b}$, la ecuación siempre tiene solución.`, 'falso: $2x+4y=3$ no tiene solución'], [r`Resolvemos $6x+9y=15$ por tanteo y encontramos $(−1,\,3)$; luego vale siempre.`, 'un ejemplo no prueba el criterio']],
    err: p => [['L2', r`(⇒) ... como $${p.d}\mid ${p.c}$ por definición, $${p.d}\mid ${p.a}${p.x}_0+${p.b}${p.y}_0$.`, 'circular', 'Eso presupone la conclusión.'], ['L4', r`Entonces $${p.c}=${p.a}${p.x}_1+${p.b}${p.y}_1$ y $(${p.x}_1,${p.y}_1)$ es solución.`, 'error-de-calculo', 'Esa combinación vale $d$, no $c$: hay que multiplicar por $k$.']],
    valida: [['bezout', r`(⇒) divisibilidad de combinaciones y (⇐) Bézout multiplicado por el cociente`, 'Es la prueba estándar.']],
    idea: p => r`el mcd divide a toda combinación, y por Bézout él mismo es una combinación.`, primero: p => r`llama $${p.d}=\operatorname{mcd}(${p.a},${p.b})$ y prueba cada sentido.`,
  });

  R.nivel({
    id: '2.2', mundo: 2, titulo: 'Euclides y Bézout', tema: 'mcd, algoritmo de Euclides, Bézout y ecuaciones diofánticas',
    habilidades: ['2.2.euclides', '2.2.mcd-mcm', '2.2.bezout', '2.2.diofantica', '2.2.contexto', '2.2.demostrar'],
    teoremas: ['t.mcd-euclides', 't.bezout', 't.lema-euclides', 't.diofantica'],
    leccion: {
      intro: 'El **máximo común divisor** $\\operatorname{mcd}(a,b)$ es el mayor entero que divide a ambos. Se calcula con el algoritmo de Euclides y siempre es una combinación de $a$ y $b$.',
      definiciones: [
        { nombre: 'Algoritmo de Euclides', tex: 'Si $a=bq+r$, entonces $\\operatorname{mcd}(a,b)=\\operatorname{mcd}(b,r)$. Se repite hasta que el resto es $0$; el último resto no nulo es el mcd.' },
        { nombre: 'Bézout', tex: 'Existen enteros $x,y$ con $ax+by=\\operatorname{mcd}(a,b)$. Se obtienen despejando los restos del algoritmo hacia atrás.' },
        { nombre: 'Ecuaciones diofánticas', tex: '$ax+by=c$ tiene solución entera si y solo si $\\operatorname{mcd}(a,b)\\mid c$. Una solución se obtiene multiplicando la de Bézout por $c/\\operatorname{mcd}(a,b)$.' },
        { nombre: 'mcm', tex: '$\\operatorname{mcm}(a,b)$ es el menor múltiplo positivo común y cumple $\\operatorname{mcd}(a,b)\\operatorname{mcm}(a,b)=|ab|$.' },
      ],
      teorema: 't.bezout',
      ejemplo: { enunciado: 'Calcula $\\operatorname{mcd}(84,30)$ y escríbelo como combinación de $84$ y $30$.', pasos: ['$84=30\\cdot 2+24$, $30=24\\cdot 1+6$, $24=6\\cdot 4+0$: el mcd es $6$.', 'Despejamos: $6=30-24\\cdot 1$ y $24=84-30\\cdot 2$.', 'Sustituyendo, $6=30-(84-30\\cdot 2)=84\\cdot(-1)+30\\cdot 3$.'] },
    },
  });

  if (typeof module !== 'undefined') module.exports = AC;
})(globalThis.AC = globalThis.AC || {});
