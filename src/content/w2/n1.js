/* Mundo 2, nivel 2.1 — Divisibilidad. */
(function (AC) {
  const { R, H, T, gen, dem2 } = AC.cont, r = String.raw, N = AC.numth, C = AC.conj;
  const ref = (id, tipo, nombre) => R.ref({ id, tipo, nombre });
  ref('b.entero-no-nulo', 'propiedad-base', 'Un entero distinto de 0 tiene valor absoluto ≥ 1');
  ref('d.division-euclidiana', 'definicion', 'División con resto: a = bq + r con 0 ≤ r < b');
  ref('d.mcd', 'definicion', 'mcd(a,b): el mayor entero que divide a ambos');
  ref('d.congruencia', 'definicion', 'a ≡ b (mod n) significa n | a − b');
  ref('d.primo', 'definicion', 'Primo: entero p > 1 cuyos únicos divisores positivos son 1 y p');
  ref('b.coprimo-producto', 'propiedad-base', 'Si a y b son coprimos con n, su producto ab también es coprimo con n');

  /* ---------- catálogo ---------- */
  const HB = (id, nombre) => R.habilidad({ id: '2.1.' + id, nombre, nivel: '2.1' });
  HB('divisores', 'Divisores y múltiplos'); HB('division-entera', 'División con resto'); HB('combinaciones', 'Combinaciones de múltiplos'); HB('contar-divisores', 'Contar divisores y múltiplos'); HB('demostrar', 'Demostrar divisibilidad');
  const TE = (id, titulo, enunciado, requiere, hab) => R.teorema({ id, titulo, nivel: '2.1', enunciado, requiere, habilidades: hab });
  TE('t.div-combinacion', 'Divisibilidad de combinaciones', r`Si $a\mid b$ y $a\mid c$, entonces $a\mid bx+cy$ para todos $x,y\in\mathbb{Z}$.`, [], ['2.1.combinaciones', '2.1.demostrar']);
  TE('t.div-transitiva', 'Transitividad de la divisibilidad', r`Si $a\mid b$ y $b\mid c$, entonces $a\mid c$.`, [], ['2.1.divisores', '2.1.demostrar']);
  TE('t.div-cota', 'Cota del divisor', r`Si $a\mid b$ y $b\neq 0$, entonces $|a|\le|b|$.`, [], ['2.1.divisores', '2.1.demostrar']);
  TE('t.div-antisimetria', 'Antisimetría de la divisibilidad', r`Si $a\mid b$, $b\mid a$ y $a,b\neq 0$, entonces $|a|=|b|$.`, ['t.div-cota'], ['2.1.divisores', '2.1.demostrar']);
  TE('t.algoritmo-division', 'Algoritmo de la división', r`Para $a\in\mathbb{Z}$ y $b>0$ existen $q,r$ únicos con $a=bq+r$ y $0\le r<b$.`, ['t.buen-orden', 't.div-cota'], ['2.1.division-entera', '2.1.demostrar']);

  /* ---------- generadores ---------- */
  const NS = [12, 18, 20, 24, 28, 30, 36, 40, 42, 45, 48, 50, 54, 56, 60, 63, 64, 66, 70, 72, 75, 80, 84, 90, 96, 100, 108, 120];
  gen.conjunto({
    id: 'w2.n1.divisores-de-n', nivel: '2.1', habilidades: ['2.1.divisores'], dificultad: 1,
    hacer(rng) {
      const n = rng.pick(NS), d = N.divisores(n), pr = d.filter(x => N.esPrimo(x)).map(String);
      return { key: String(n), enun: 'Escribe el conjunto de todos los divisores positivos de $' + n + '$.', res: d.map(String),
        firmas: [['sin-extremos', d.filter(x => x !== 1 && x !== n).map(String), 'El $1$ y el propio $' + n + '$ también son divisores.'], ['sin-el-propio', d.filter(x => x !== n).map(String), 'Falta el propio $' + n + '$: todo número se divide a sí mismo.'], ['solo-primos', pr, 'Los divisores no son solo los primos: también valen los productos de primos.']],
        pistas: ['Orientación: prueba los números desde el $1$ hasta $' + n + '$ (basta llegar a la raíz y aparear).', 'Idea clave: si $d$ divide a $' + n + '$, también lo hace $' + n + '/d$; los divisores vienen en parejas.', 'Primer paso: empieza con la pareja $1$ y $' + n + '$.'],
        expl: 'Divisores de $' + n + '$: $' + C.tex(d.map(String)) + '$.' };
    },
  });

  gen.tupla({
    id: 'w2.n1.division-entera', nivel: '2.1', habilidades: ['2.1.division-entera'], dificultad: 2,
    hacer(rng) {
      const b = rng.int(3, 15), a = rng.chance(0.5) ? -rng.int(5, 150) : rng.int(5, 150), q = Math.floor(a / b), r = a - b * q, qt = Math.trunc(a / b);
      const f = [['intercambia', [r, q], 'Escribiste $(r,q)$; el orden pedido es primero el cociente $q$ y luego el resto $r$.']];
      if (a < 0 && a % b !== 0) f.unshift(['resto-negativo', [qt, a - b * qt], 'El resto debe cumplir $0\\le r<b$: con $a$ negativo hay que bajar un cociente más (el cociente es el **piso** de $a/b$).']);
      return { key: a + '/' + b, enun: 'Divide $' + a + '$ entre $' + b + '$ con resto no negativo: halla $q$ y $r$ con $' + a + '=' + b + 'q+r$ y $0\\le r<' + b + '$.', campos: ['q', 'r'], res: [q, r], firmas: f,
        pistas: ['Orientación: busca el mayor múltiplo de $' + b + '$ que no supere a $' + a + '$.', 'Idea clave: el resto $r=a-bq$ debe quedar entre $0$ y $' + (b - 1) + '$.', 'Primer paso: calcula $' + a + '/' + b + '$ aproximadamente y redondea hacia abajo.'],
        expl: '$' + a + '=' + b + '\\cdot(' + q + ')+' + r + '$.' };
    },
  });

  gen.entero({
    id: 'w2.n1.combinacion-divisible', nivel: '2.1', habilidades: ['2.1.combinaciones'], dificultad: 2,
    hacer(rng) {
      const a = rng.int(3, 12), k = rng.int(2, 9), l = rng.int(2, 9), x = rng.int(-4, 5), y = rng.int(-4, 5);
      if (k === l || x === 0 || y === 0) return null;
      const b = a * k, c = a * l, res = k * x + l * y;
      return { key: [a, k, l, x, y].join(','), enun: 'Sabes que $' + a + '$ divide a $b=' + b + '$ y a $c=' + c + '$. Calcula $\\dfrac{bx+cy}{' + a + '}$ para $x=' + x + '$, $y=' + y + '$ (el resultado es entero).', res,
        firmas: [['signo', k * x - l * y, 'Revisa el signo: es $kx+ly$, con $y=' + y + '$.'], ['sin-factorizar', b * x + c * y, 'Falta dividir entre $' + a + '$.'], ['suma-simple', k + l, 'No se suman solo $k$ y $l$: cada uno va multiplicado por $x$ o $y$.']],
        pistas: ['Orientación: escribe $b$ y $c$ como múltiplos de $' + a + '$.', 'Idea clave: $bx+cy=' + a + '(kx+ly)$ con $k=b/' + a + '$, $l=c/' + a + '$.', 'Primer paso: calcula $k=' + k + '$ y $l=' + l + '$.'], expl: '$(bx+cy)/' + a + '=' + k + '\\cdot(' + x + ')+' + l + '\\cdot(' + y + ')=' + res + '$.' };
    },
  });

  gen.entero({
    id: 'w2.n1.numero-de-divisores', nivel: '2.1', habilidades: ['2.1.contar-divisores'], dificultad: 2,
    hacer(rng) {
      const ps = rng.sample([2, 3, 5, 7], rng.int(2, 3)).sort((a, b) => a - b), es = ps.map(() => rng.int(1, 4)), n = ps.reduce((m, p, i) => m * p ** es[i], 1);
      if (n > 4000) return null;
      const res = es.reduce((m, e) => m * (e + 1), 1);
      return { key: String(n), enun: '¿Cuántos divisores positivos tiene $' + n + '$?', res,
        firmas: [['suma-exponentes', es.reduce((a, b) => a + b, 0), 'No se suman los exponentes: cada primo aporta $(e+1)$ posibilidades y se multiplican.'], ['producto-exponentes', es.reduce((a, b) => a * b, 1), 'Falta sumar 1 a cada exponente (el exponente $0$ también cuenta).'], ['sin-uno', res - 1, 'El $1$ también es divisor: no se resta.']],
        pistas: ['Orientación: factoriza $' + n + '$ en primos.', 'Idea clave: un divisor elige, para cada primo $p^e$, un exponente entre $0$ y $e$.', 'Primer paso: $' + n + '=' + ps.map((p, i) => p + (es[i] > 1 ? '^{' + es[i] + '}' : '')).join('\\cdot ') + '$.'], expl: 'Resultado: $' + es.map(e => '(' + e + '+1)').join('\\cdot ') + '=' + res + '$.' };
    },
  });

  gen.entero({
    id: 'w2.n1.multiplos-en-rango', nivel: '2.1', habilidades: ['2.1.contar-divisores'], dificultad: 1,
    hacer(rng) {
      const m = rng.int(3, 13), a = rng.int(1, 60), b = a + rng.int(40, 300), res = Math.floor(b / m) - Math.floor((a - 1) / m);
      return { key: [m, a, b].join(','), enun: '¿Cuántos múltiplos de $' + m + '$ hay entre $' + a + '$ y $' + b + '$, ambos incluidos?', res,
        firmas: [['sin-extremo', Math.floor(b / m) - Math.floor(a / m), 'Si $' + a + '$ fuera múltiplo habría que contarlo (el rango incluye los extremos).'], ['diferencia', Math.floor((b - a) / m), 'Eso cuenta saltos de $' + m + '$ dentro del intervalo, pero puede perder o añadir un múltiplo según dónde caigan los extremos.'], ['mas-uno', Math.floor(b / m) - Math.floor((a - 1) / m) + 1, 'Te pasaste por uno: $\\lfloor b/m\\rfloor-\\lfloor (a-1)/m\\rfloor$ ya cuenta los dos extremos.']],
        pistas: ['Orientación: cuenta los múltiplos hasta $' + b + '$ y resta los que hay antes de $' + a + '$.', 'Idea clave: hay $\\lfloor n/' + m + '\\rfloor$ múltiplos de $' + m + '$ entre $1$ y $n$.', 'Primer paso: calcula $\\lfloor ' + b + '/' + m + '\\rfloor$.'], expl: '$' + Math.floor(b / m) + '-' + Math.floor((a - 1) / m) + '=' + res + '$.' };
    },
  });

  /* ---------- demostraciones ---------- */
  const NM = [['a', 'b', 'c'], ['d', 'm', 'n']];
  dem2({
    id: 'dem.div-combinacion', teorema: 't.div-combinacion', nivel: '2.1', habilidades: ['2.1.combinaciones', '2.1.demostrar'], requiere: [], refsExtra: ['d.congruencia', 'd.mcd', 'b.arbitrario'],
    param: rng => { const [a, b, c] = rng.pick(NM); return { a, b, c, x: rng.pick(['x', 'u']), y: rng.pick(['y', 'v']) }; },
    enunciado: p => r`Demuestra que si $${p.a}\mid ${p.b}$ y $${p.a}\mid ${p.c}$, entonces $${p.a}\mid ${p.b}${p.x}+${p.c}${p.y}$ para todos $${p.x},${p.y}\in\mathbb{Z}$.`,
    hip: p => [r`$${p.a},${p.b},${p.c}\in\mathbb{Z}$ con $${p.a}\mid ${p.b}$ y $${p.a}\mid ${p.c}$`, r`$${p.x},${p.y}\in\mathbb{Z}$ son arbitrarios`], meta: p => r`$${p.a}\mid ${p.b}${p.x}+${p.c}${p.y}$`,
    L: p => [
      ['L1', r`Por hipótesis existen $k,l\in\mathbb{Z}$ con $${p.b}=${p.a}k$ y $${p.c}=${p.a}l$.`, 'd.divisibilidad'],
      ['L2', r`Entonces $${p.b}${p.x}+${p.c}${p.y}=${p.a}k${p.x}+${p.a}l${p.y}=$ ⟦h1⟧.`, 'b.cuerpo-algebra', ['L1'], [H('h1', r`${p.a}(k${p.x}+l${p.y})`, [r`${p.a}(k+l)${p.x}${p.y}`, r`${p.a}k${p.x}l${p.y}`, r`(${p.a}+k${p.x})(${p.a}+l${p.y})`])]],
      ['L3', r`Como $k${p.x}+l${p.y}\in\mathbb{Z}$, por la definición de divisibilidad, $${p.a}\mid ${p.b}${p.x}+${p.c}${p.y}$. ∎`, 'd.divisibilidad', ['L2']],
    ],
    dist: p => [[r`Como $${p.a}\mid ${p.b}$ y $${p.a}\mid ${p.c}$, también $${p.a}\mid ${p.b}+${p.c}$; eso basta.`, 'solo cubre $x=y=1$'], [r`Tomamos $${p.a}=3$, $${p.b}=6$, $${p.c}=9$: $3\mid 6x+9y$; luego vale siempre.`, 'un ejemplo no prueba el caso general']],
    err: p => [['L2', r`Entonces $${p.b}${p.x}+${p.c}${p.y}=${p.a}(k+l)${p.x}${p.y}$.`, 'error-de-calculo', 'Cada sumando conserva su propio multiplicador: $a k x+a l y=a(kx+ly)$.'], ['L3', r`Como $k,l\in\mathbb{Z}$, $${p.a}\mid ${p.b}${p.x}+${p.c}${p.y}$. ∎`, 'no-justificado', 'Hay que ver que la combinación $kx+ly$ es un entero.']],
    valida: [['directa', r`Escribir $b=ak$, $c=al$ y sacar factor común $a$`, 'Es la prueba estándar.']],
    idea: p => r`escribe $${p.b}$ y $${p.c}$ como múltiplos de $${p.a}$ y saca $${p.a}$ como factor.`, primero: p => r`usa la definición: $${p.b}=${p.a}k$, $${p.c}=${p.a}l$.`,
  });

  dem2({
    id: 'dem.div-transitiva', teorema: 't.div-transitiva', nivel: '2.1', habilidades: ['2.1.divisores', '2.1.demostrar'], requiere: [], refsExtra: ['d.mcd', 'b.arbitrario'],
    param: rng => { const [a, b, c] = rng.pick(NM); return { a, b, c }; },
    enunciado: p => r`Demuestra que si $${p.a}\mid ${p.b}$ y $${p.b}\mid ${p.c}$, entonces $${p.a}\mid ${p.c}$.`,
    hip: p => [r`$${p.a},${p.b},${p.c}\in\mathbb{Z}$`, r`$${p.a}\mid ${p.b}$ y $${p.b}\mid ${p.c}$`], meta: p => r`$${p.a}\mid ${p.c}$`,
    L: p => [
      ['L1', r`Por hipótesis existen $k,l\in\mathbb{Z}$ con $${p.b}=${p.a}k$ y $${p.c}=${p.b}l$.`, 'd.divisibilidad'],
      ['L2', r`Sustituyendo, $${p.c}=${p.b}l=(${p.a}k)l=$ ⟦h1⟧.`, 'b.cuerpo-algebra', ['L1'], [H('h1', r`${p.a}(kl)`, [r`${p.a}(k+l)`, r`${p.b}(kl)`, r`${p.a}kl+1`])]],
      ['L3', r`Como $kl\in\mathbb{Z}$, $${p.a}\mid ${p.c}$. ∎`, 'b.cerradura-enteros', ['L2']],
    ],
    dist: p => [[r`Como $${p.a}\mid ${p.b}$ y $${p.b}\mid ${p.c}$, entonces $${p.a}\le ${p.b}\le ${p.c}$ y por eso $${p.a}\mid ${p.c}$.`, 'ser menor no implica dividir'], [r`Con $${p.a}=2$, $${p.b}=4$, $${p.c}=8$ se cumple; luego vale siempre.`, 'un ejemplo no prueba el caso general']],
    err: p => [['L2', r`Sustituyendo, $${p.c}=${p.b}l=(${p.a}+k)l=${p.a}l+kl$.`, 'error-de-calculo', 'Es $b=ak$ (producto), no $a+k$.'], ['L3', r`Como $k+l\in\mathbb{Z}$, $${p.a}\mid ${p.c}$. ∎`, 'error-de-calculo', 'El cociente que aparece es $kl$, no $k+l$.']],
    valida: [['directa', r`Escribir $b=ak$, $c=bl$ y sustituir`, 'Es la prueba estándar.']],
    idea: p => r`sustituye $${p.b}=${p.a}k$ en $${p.c}=${p.b}l$.`, primero: p => r`escribe las dos hipótesis con cocientes enteros $k$ y $l$.`,
  });

  dem2({
    id: 'dem.div-cota', teorema: 't.div-cota', nivel: '2.1', habilidades: ['2.1.divisores', '2.1.demostrar'], requiere: [], refsExtra: ['b.arbitrario', 'b.contradiccion'],
    param: rng => { const [a, b] = rng.pick([['a', 'b'], ['d', 'n']]); return { a, b }; },
    enunciado: p => r`Demuestra que si $${p.a}\mid ${p.b}$ y $${p.b}\neq 0$, entonces $|${p.a}|\le|${p.b}|$.`,
    hip: p => [r`$${p.a},${p.b}\in\mathbb{Z}$, $${p.b}\neq 0$`, r`$${p.a}\mid ${p.b}$`], meta: p => r`$|${p.a}|\le|${p.b}|$`,
    L: p => [
      ['L1', r`Por hipótesis existe $k\in\mathbb{Z}$ con $${p.b}=${p.a}k$.`, 'd.divisibilidad'],
      ['L2', r`Como $${p.b}\neq 0$, ⟦h1⟧.`, 'b.cuerpo-algebra', ['L1'], [H('h1', r`$k\neq 0$`, [r`$k=0$`, r`$${p.a}=0$ solamente`, r`$k>1$`], false)]],
      ['L3', r`Un entero distinto de $0$ cumple $|k|\ge 1$.`, 'b.entero-no-nulo', ['L2']],
      ['L4', r`Luego $|${p.b}|=|${p.a}|\,|k|\ge|${p.a}|\cdot 1=|${p.a}|$. ∎`, 'b.orden', ['L1', 'L3']],
    ],
    dist: p => [[r`Como $${p.a}\mid ${p.b}$, entonces $${p.a}\le ${p.b}$.`, 'falla con números negativos: hay que usar valores absolutos'], [r`Con $${p.a}=3$, $${p.b}=6$ se cumple $3\le 6$; luego vale siempre.`, 'un ejemplo no prueba el caso general']],
    err: p => [['L2', r`Como $${p.b}\neq 0$, $k=0$.`, 'conclusion-invalida', 'Al revés: si $k$ fuera $0$ entonces $b=0$.'], ['L4', r`Luego $|${p.b}|=|${p.a}|\,|k|\le|${p.a}|$. ∎`, 'conclusion-invalida', 'Como $|k|\\ge 1$, el producto es **mayor o igual** que $|a|$.']],
    valida: [['directa', r`Escribir $b=ak$ y acotar $|k|\ge 1$`, 'Es la prueba estándar.'], ['absurdo', r`Suponer $|a|>|b|$ y concluir que $k=0$`, 'Equivale a la anterior: $|b|=|a||k|<|a|$ obliga a $k=0$.']],
    idea: p => r`$|k|\ge 1$ porque $k$ es un entero no nulo.`, primero: p => r`escribe $${p.b}=${p.a}k$ y toma valores absolutos.`,
  });

  dem2({
    id: 'dem.div-antisimetria', teorema: 't.div-antisimetria', nivel: '2.1', habilidades: ['2.1.divisores', '2.1.demostrar'], requiere: ['t.div-cota'], refsExtra: ['b.arbitrario'],
    param: rng => { const [a, b] = rng.pick([['a', 'b'], ['m', 'n']]); return { a, b }; },
    enunciado: p => r`Demuestra que si $${p.a}\mid ${p.b}$ y $${p.b}\mid ${p.a}$ con $${p.a},${p.b}\neq 0$, entonces $|${p.a}|=|${p.b}|$.`,
    hip: p => [r`$${p.a},${p.b}\in\mathbb{Z}\setminus\{0\}$`, r`$${p.a}\mid ${p.b}$ y $${p.b}\mid ${p.a}$`, 'Puedes citar la cota del divisor'], meta: p => r`$|${p.a}|=|${p.b}|$`,
    L: p => [
      ['L1', r`Como $${p.a}\mid ${p.b}$ y $${p.b}\neq 0$, por la cota del divisor, $|${p.a}|\le|${p.b}|$.`, 't.div-cota'],
      ['L2', r`Como $${p.b}\mid ${p.a}$ y $${p.a}\neq 0$, por la cota del divisor, $|${p.b}|\le|${p.a}|$.`, 't.div-cota'],
      ['L3', r`De $|${p.a}|\le|${p.b}|$ y $|${p.b}|\le|${p.a}|$ se sigue $|${p.a}|=|${p.b}|$. ∎`, 'b.orden', ['L1', 'L2']],
    ],
    dist: p => [[r`Como $${p.a}\mid ${p.b}$ y $${p.b}\mid ${p.a}$, entonces $${p.a}=${p.b}$.`, 'también puede ser $a=-b$'], [r`Con $${p.a}=3$ y $${p.b}=3$ se cumple; luego vale siempre.`, 'un ejemplo no prueba el caso general']],
    err: p => [['L2', r`Como $${p.b}\mid ${p.a}$, por la cota del divisor, $|${p.a}|\le|${p.b}|$.`, 'conclusion-invalida', 'La cota da $|b|\\le|a|$ (el divisor es menor o igual).'], ['L3', r`De $|${p.a}|\le|${p.b}|$ y $|${p.b}|\le|${p.a}|$ se sigue $${p.a}=${p.b}$. ∎`, 'conclusion-invalida', 'Solo se obtiene la igualdad de valores absolutos.']],
    valida: [['cotas', r`Aplicar la cota del divisor en los dos sentidos`, 'Es la prueba más corta.'], ['cocientes', r`Escribir $b=ak$, $a=bl$ y concluir $kl=1$`, 'También funciona: $kl=1$ obliga a $k=\\pm 1$.']],
    idea: p => r`la cota del divisor da dos desigualdades opuestas.`, primero: p => r`aplica la cota a $${p.a}\mid ${p.b}$.`,
  });

  dem2({
    id: 'dem.algoritmo-division', teorema: 't.algoritmo-division', nivel: '2.1', habilidades: ['2.1.division-entera', '2.1.demostrar'], requiere: ['t.buen-orden', 't.div-cota'], refsExtra: ['b.arbitrario', 'd.divisibilidad'],
    param: rng => { const [a, b] = rng.pick([['a', 'b'], ['n', 'd']]); return { a, b, q: rng.pick(['q', 'k']), r: rng.pick(['r', 's']) }; },
    enunciado: p => r`Demuestra que para $${p.a}\in\mathbb{Z}$ y $${p.b}>0$ existen $${p.q},${p.r}\in\mathbb{Z}$ únicos con $${p.a}=${p.b}${p.q}+${p.r}$ y $0\le ${p.r}<${p.b}$.`,
    hip: p => [r`$${p.a}\in\mathbb{Z}$, $${p.b}\in\mathbb{Z}$, $${p.b}>0$`, 'Puedes citar el buen orden de $\\mathbb{N}$ y la cota del divisor'], meta: p => r`existen y son únicos $${p.q},${p.r}$ con $${p.a}=${p.b}${p.q}+${p.r}$, $0\le ${p.r}<${p.b}$`,
    L: p => [
      ['L1', r`Sea $S=\{${p.a}-${p.b}t\ :\ t\in\mathbb{Z},\ ${p.a}-${p.b}t\ge 0\}\subseteq\mathbb{N}$.`, 'd.division-euclidiana'],
      ['L2', r`$S\neq\varnothing$: con $t=-|${p.a}|$ se tiene $${p.a}+${p.b}|${p.a}|\ge ${p.a}+|${p.a}|\ge 0$.`, 'b.orden', ['L1']],
      ['L3', r`Por el buen orden, $S$ tiene un mínimo $${p.r}=${p.a}-${p.b}${p.q}$ para algún $${p.q}\in\mathbb{Z}$; así $${p.a}=${p.b}${p.q}+${p.r}$ y $${p.r}\ge 0$.`, 't.buen-orden', ['L2']],
      ['L4', r`Si fuera $${p.r}\ge ${p.b}$, entonces $${p.r}-${p.b}=${p.a}-${p.b}(${p.q}+1)\in S$ y sería menor que $${p.r}$, contra la minimalidad. Luego $${p.r}<${p.b}$ (existencia).`, 'b.contradiccion', ['L3']],
      ['L5', r`Unicidad: si $${p.a}=${p.b}${p.q}+${p.r}=${p.b}q'+r'$ con $0\le ${p.r},r'<${p.b}$, entonces $${p.b}\mid ${p.r}-r'$.`, 'd.divisibilidad', ['L4']],
      ['L6', r`Como $|${p.r}-r'|<${p.b}$, la cota del divisor obliga a $${p.r}-r'=0$; luego $${p.r}=r'$ y, cancelando, $${p.q}=q'$. ∎`, 't.div-cota', ['L5']],
    ],
    dist: p => [[r`Dividimos $${p.a}$ entre $${p.b}$ con calculadora y redondeamos: eso da $${p.q}$ y $${p.r}$.`, 'la demostración debe valer para todos los enteros, no para un cálculo concreto'], [r`Como $${p.r}<${p.b}$, el resto es único.`, 'hay que probar la unicidad con la cota del divisor']],
    err: p => [['L2', r`$S\neq\varnothing$: con $t=0$ se tiene $${p.a}\in S$.`, 'caso-faltante', 'Si $a<0$, $a\\notin S$: hay que elegir $t$ de modo que $a-bt\\ge 0$ siempre.'], ['L4', r`Si fuera $${p.r}\ge ${p.b}$, entonces $${p.r}-${p.b}\in S$ y sería mayor que $${p.r}$.`, 'error-de-calculo', '$r-b<r$ porque $b>0$.'], ['L6', r`Como $|${p.r}-r'|<${p.b}$, obtenemos $${p.r}=r'$ por simetría. ∎`, 'no-justificado', 'Hace falta la cota del divisor: un múltiplo de $b$ con valor absoluto menor que $b$ es $0$.']],
    valida: [['buen-orden', r`Tomar el menor elemento no negativo de $\{a-bt\}$ (buen orden)`, 'Es la prueba estándar.'], ['induccion', r`Inducción sobre $a\ge 0$ y tratar $a<0$ aparte`, 'Funciona para $a\\ge 0$ restando $b$ repetidamente; hay que añadir el caso negativo.']],
    idea: p => r`el resto es el menor elemento no negativo de $\{${p.a}-${p.b}t\}$.`, primero: p => r`define el conjunto $S$ de los números $${p.a}-${p.b}t\ge 0$.`,
  });

  R.nivel({
    id: '2.1', mundo: 2, titulo: 'Divisibilidad', tema: 'Divisores, combinaciones y el algoritmo de la división',
    habilidades: ['2.1.divisores', '2.1.division-entera', '2.1.combinaciones', '2.1.contar-divisores', '2.1.demostrar'],
    teoremas: ['t.div-combinacion', 't.div-transitiva', 't.div-cota', 't.div-antisimetria', 't.algoritmo-division'],
    leccion: {
      intro: 'En $\\mathbb{Z}$ decimos que **$a$ divide a $b$** ($a\\mid b$) si existe un entero $k$ con $b=ak$. Es la base de toda la aritmética.',
      definiciones: [
        { nombre: 'Divisibilidad', tex: '$a\\mid b$ si $b=ak$ para algún $k\\in\\mathbb{Z}$. El $1$ y el propio número siempre dividen. Si $a\\mid b$ y $a\\mid c$, también divide a toda combinación $bx+cy$.' },
        { nombre: 'División con resto', tex: 'Para $b>0$, todo $a$ se escribe de forma única como $a=bq+r$ con $0\\le r<b$. El **cociente** $q=\\lfloor a/b\\rfloor$ y el **resto** $r$ nunca son negativos en esta convención.' },
        { nombre: 'Contar divisores', tex: 'Si $n=p_1^{e_1}\\cdots p_k^{e_k}$ (primos distintos), un divisor elige un exponente entre $0$ y $e_i$ para cada $p_i$: hay $(e_1+1)\\cdots(e_k+1)$ divisores positivos.' },
      ],
      teorema: 't.algoritmo-division',
      ejemplo: { enunciado: 'Divide $-17$ entre $5$ con resto no negativo.', pasos: ['Buscamos el mayor múltiplo de $5$ que no supere a $-17$: $-20$.', 'Entonces $q=-4$ y $r=-17-5(-4)=3$.', 'Comprobación: $5(-4)+3=-17$ y $0\\le 3<5$.'] },
    },
  });

  if (typeof module !== 'undefined') module.exports = AC;
})(globalThis.AC = globalThis.AC || {});
