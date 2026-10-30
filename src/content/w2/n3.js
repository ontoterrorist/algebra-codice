/* Mundo 2, nivel 2.3 — Congruencias. */
(function (AC) {
  const { R, H, T, gen, dem2 } = AC.cont, r = String.raw, N = AC.numth, C = AC.conj;

  const HB = (id, nombre) => R.habilidad({ id: '2.3.' + id, nombre, nivel: '2.3' });
  HB('reducir', 'Reducir módulo n'); HB('potencia-modular', 'Potencias modulares'); HB('cong-lineal', 'Congruencias lineales'); HB('criterios', 'Criterios de divisibilidad'); HB('demostrar', 'Demostrar con congruencias');
  const TE = (id, titulo, enunciado, requiere, hab) => R.teorema({ id, titulo, nivel: '2.3', enunciado, requiere, habilidades: hab });
  TE('t.cong-equivalencia', 'La congruencia es de equivalencia', r`$a\equiv b\pmod n$ es reflexiva, simétrica y transitiva en $\mathbb{Z}$.`, ['t.mod-equivalencia'], ['2.3.reducir', '2.3.demostrar']);
  TE('t.cong-operaciones', 'Congruencias y operaciones', r`Si $a\equiv b$ y $c\equiv d\pmod n$, entonces $a+c\equiv b+d$ y $ac\equiv bd\pmod n$.`, ['t.div-combinacion'], ['2.3.potencia-modular', '2.3.demostrar']);
  TE('t.cong-cancelacion', 'Cancelación en congruencias', r`Si $ac\equiv bc\pmod n$ y $\operatorname{mcd}(c,n)=1$, entonces $a\equiv b\pmod n$.`, ['t.lema-euclides'], ['2.3.cong-lineal', '2.3.demostrar']);
  TE('t.inverso-modular', 'Inverso modular', r`Existe $x$ con $ax\equiv 1\pmod n$ si y solo si $\operatorname{mcd}(a,n)=1$.`, ['t.bezout', 't.cong-operaciones'], ['2.3.cong-lineal', '2.3.demostrar']);
  TE('t.cong-lineal', 'Congruencia lineal', r`$ax\equiv b\pmod n$ tiene solución si y solo si $\operatorname{mcd}(a,n)\mid b$.`, ['t.diofantica', 't.cong-equivalencia'], ['2.3.cong-lineal', '2.3.demostrar']);

  /* ---------- generadores ---------- */
  gen.entero({
    id: 'w2.n3.reducir-modulo', nivel: '2.3', habilidades: ['2.3.reducir'], dificultad: 1,
    hacer(rng) {
      const n = rng.int(5, 19), a = rng.int(100, 9000) * (rng.chance(0.5) ? -1 : 1), res = N.mod(a, n);
      return { key: a + 'm' + n, enun: 'Halla el resto de $' + a + '$ módulo $' + n + '$ (el representante $r$ con $0\\le r<' + n + '$).', res,
        firmas: [['resto-negativo', a % n, 'Con números negativos el resto debe quedar entre $0$ y $' + (n - 1) + '$: suma $' + n + '$ hasta lograrlo.'], ['cociente', Math.floor(Math.abs(a) / n), 'Eso es el cociente de la división, no el resto.'], ['complemento', N.mod(-a, n), 'Es el resto de $-a$, no el de $a$.']],
        pistas: ['Orientación: divide $' + a + '$ entre $' + n + '$.', 'Idea clave: $a\\equiv r\\pmod n$ con $0\\le r<n$; para $a<0$ el cociente se redondea hacia abajo.', 'Primer paso: encuentra el múltiplo de $' + n + '$ más cercano sin pasar de $' + a + '$.'], expl: '$' + a + '\\equiv' + res + '\\pmod{' + n + '}$.' };
    },
  });

  gen.entero({
    id: 'w2.n3.potencia-modular', nivel: '2.3', habilidades: ['2.3.potencia-modular'], dificultad: 2,
    hacer(rng) {
      const n = rng.int(7, 31), a = rng.int(2, n - 1), e = rng.int(12, 70);
      if (N.gcd(a, n) !== 1 && rng.chance(0.5)) return null;
      const res = N.potmod(a, e, n);
      return { key: [a, e, n].join(','), enun: 'Calcula $' + a + '^{' + e + '}\\bmod ' + n + '$.', res,
        firmas: [['multiplica', N.mod(a * e, n), 'Confundiste la potencia con el producto: $a^e$ no es $a\\cdot e$.'], ['reduce-exponente', N.potmod(a, e % n, n), 'El exponente no se reduce módulo $n$ (eso solo vale para el periodo del ciclo).'], ['sin-reducir', N.mod(a ** 2, n), 'Eso es solo $a^2$: sigue elevando hasta el exponente pedido.']],
        pistas: ['Orientación: reduce paso a paso; nunca calcules $a^{e}$ completo.', 'Idea clave: eleva al cuadrado y reduce módulo $' + n + '$ en cada paso (cuadrados sucesivos) o busca un ciclo.', 'Primer paso: calcula $' + a + '^2$ módulo $' + n + '$.'], expl: '$' + a + '^{' + e + '}\\equiv' + res + '\\pmod{' + n + '}$.' };
    },
  });

  gen.conjunto({
    id: 'w2.n3.cong-lineal-resolver', nivel: '2.3', habilidades: ['2.3.cong-lineal'], dificultad: 3,
    hacer(rng) {
      const n = rng.pick([6, 8, 9, 10, 12, 14, 15, 18, 20, 21]), a = rng.int(2, n - 1), b = rng.int(0, n - 1);
      const sols = []; for (let x = 0; x < n; x++) if (N.mod(a * x, n) === b) sols.push(String(x));
      const d = N.gcd(a, n), red = n / d, base = []; for (let x = 0; x < red; x++) if (N.mod(a * x, n) === b || N.mod((a / d) * x, red) === N.mod(b / d, red) && b % d === 0) base.push(String(x));
      const f = [];
      if (d === 1) { f.push(['solo-inverso', [String(N.inverso(a, n))], 'Ese es el inverso de $a$ módulo $n$; falta multiplicarlo por $b=' + b + '$.']); f.push(['sin-despejar', [String(b)], 'Escribiste $b$ sin despejar: hay que multiplicar por el inverso de $a$.']); }
      if (sols.length > 1) f.push(['solo-una', [sols[0]], 'Cuando $\\operatorname{mcd}(a,n)=' + d + '>1$ hay $' + d + '$ soluciones módulo $' + n + '$, no solo una.']);
      if (sols.length) f.push(['reducido', base, 'Esas son las soluciones módulo $' + red + '$; módulo $' + n + '$ hay que añadir los $' + d + '$ representantes.']);
      else f.push(['inventa', [String(rng.int(0, n - 1))], 'No hay solución: $\\operatorname{mcd}(a,n)=' + d + '$ no divide a $b$.']);
      return { key: [a, b, n].join(','), enun: 'Resuelve $' + a + 'x\\equiv ' + b + '\\pmod{' + n + '}$: escribe el conjunto de todas las soluciones $x$ con $0\\le x<' + n + '$ (si no hay ninguna, escribe la palabra vacío).', res: sols, firmas: f,
        pistas: ['Orientación: mira si $\\operatorname{mcd}(' + a + ',' + n + ')$ divide a $' + b + '$.', 'Idea clave: si lo divide, hay exactamente $\\operatorname{mcd}$ soluciones módulo $' + n + '$, separadas por $n/\\operatorname{mcd}$.', 'Primer paso: calcula $\\operatorname{mcd}(' + a + ',' + n + ')=' + d + '$.'], expl: sols.length ? 'Soluciones: $' + C.tex(sols) + '$.' : 'No hay soluciones: $' + d + '\\nmid ' + b + '$.' };
    },
  });

  gen.multiple({
    id: 'w2.n3.congruencias-verdaderas', nivel: '2.3', habilidades: ['2.3.reducir', '2.3.potencia-modular'], dificultad: 2,
    hacer(rng) {
      const items = []; const mk = () => {
        const n = rng.int(4, 13), t = rng.pick(['dif', 'prod', 'pot']);
        if (t === 'dif') { const a = rng.int(-60, 90), b = rng.int(-30, 40); return [a + '\\equiv ' + b + '\\pmod{' + n + '}', N.mod(a - b, n) === 0, a + ' - (' + b + ')=' + (a - b) + (N.mod(a - b, n) === 0 ? ' es' : ' no es') + ' múltiplo de ' + n]; }
        if (t === 'prod') { const a = rng.int(2, 12), b = rng.int(2, 12), c = rng.int(0, n - 1); return [a + '\\cdot ' + b + '\\equiv ' + c + '\\pmod{' + n + '}', N.mod(a * b - c, n) === 0, a * b + ' deja resto ' + N.mod(a * b, n) + ' módulo ' + n]; }
        const a = rng.int(2, 9), e = rng.int(3, 12), c = rng.int(0, n - 1); return [a + '^{' + e + '}\\equiv ' + c + '\\pmod{' + n + '}', N.potmod(a, e, n) === c, a + '^' + e + ' deja resto ' + N.potmod(a, e, n) + ' módulo ' + n];
      };
      while (items.length < 5) items.push(mk());
      const ok = items.map((x, j) => (x[1] ? j : -1)).filter(j => j >= 0);
      return { key: items.map(x => x[0]).join('|'), enun: 'Marca todas las congruencias que son verdaderas.', opciones: items.map(x => T(x[0])), ok,
        msg: (j, es) => 'La afirmación $' + items[j][0] + '$ es ' + (es ? 'verdadera' : 'falsa') + ': ' + items[j][2] + '.',
        pistas: ['Orientación: reduce cada lado módulo $n$ y compara los restos.', 'Idea clave: $a\\equiv b\\pmod n$ equivale a que $n$ divida a $a-b$.', 'Primer paso: calcula $a-b$ en la primera afirmación.'], expl: 'Son verdaderas: ' + (ok.length ? ok.map(j => T(items[j][0])).join(', ') : 'ninguna') + '.' };
    },
  });

  gen.entero({
    id: 'w2.n3.criterios-divisibilidad', nivel: '2.3', habilidades: ['2.3.criterios', '2.3.reducir'], dificultad: 2,
    hacer(rng) {
      const tipo = rng.pick(['digito-11', 'resto-9', 'resto-4', 'resto-3']);
      if (tipo === 'digito-11') {
        const ds = Array.from({ length: 5 }, () => rng.int(1, 9)), pos = rng.int(0, 4); let res = null;
        for (let d = 0; d <= 9; d++) { const t = ds.slice(); t[pos] = d; const alt = t.reduce((s, x, i) => s + (i % 2 ? -x : x), 0); if (N.mod(alt, 11) === 0) res = d; }
        if (res === null) return null;
        const mostrar = ds.map((d, i) => (i === pos ? '\\square' : d)).join('');
        return { key: tipo + mostrar, enun: 'Halla el dígito $\\square$ (de $0$ a $9$) para que $' + mostrar + '$ sea divisible por $11$.', res,
          firmas: [['suma-simple', N.mod(-ds.reduce((s, x, i) => (i === pos ? s : s + x), 0), 11) % 10, 'Para el $11$ no basta sumar dígitos: hay que alternar signos (el criterio es la suma alternada).']],
          pistas: ['Orientación: usa el criterio del $11$.', 'Idea clave: un número es múltiplo de $11$ si la suma alternada de sus dígitos lo es.', 'Primer paso: escribe la suma alternada con el dígito desconocido $d$.'], expl: 'El dígito es $' + res + '$.' };
      }
      const big = rng.int(10000, 999999), k = { 'resto-9': 9, 'resto-4': 4, 'resto-3': 3 }[tipo], res = big % k;
      return { key: tipo + big, enun: 'Sin dividir todo el número, halla el resto de $' + big + '$ al dividirlo entre $' + k + '$ (usa los criterios de divisibilidad).', res,
        firmas: [['suma-digitos', String(big).split('').reduce((s, d) => s + +d, 0), 'La suma de dígitos aún no es el resto: hay que reducirla módulo $' + k + '$.'], ['ultima-cifra', big % 10, 'La última cifra sirve para el $2$, el $5$ y el $10$, no para el ' + k + '.']],
        pistas: ['Orientación: elige el criterio que corresponde al divisor.', k === 4 ? 'Idea clave: $100\\equiv 0\\pmod 4$, así que solo importan las dos últimas cifras.' : 'Idea clave: $10\\equiv 1\\pmod ' + k + '$, así que el número es congruente con la suma de sus dígitos.', 'Primer paso: ' + (k === 4 ? 'toma las dos últimas cifras.' : 'suma las cifras.')], expl: 'El resto es $' + res + '$.' };
    },
  });

  /* ---------- demostraciones ---------- */
  const NM = [['a', 'b', 'c', 'd'], ['x', 'y', 'z', 'w']];
  dem2({
    id: 'dem.cong-equivalencia', teorema: 't.cong-equivalencia', nivel: '2.3', habilidades: ['2.3.reducir', '2.3.demostrar'], requiere: ['t.mod-equivalencia'], refsExtra: ['d.divisibilidad', 'b.arbitrario'],
    param: rng => { const [a, b, c] = rng.pick(NM); return { a, b, c, n: rng.pick(['n', 'm']) }; },
    enunciado: p => r`Demuestra que $\equiv\pmod ${p.n}$ es una relación de equivalencia en $\mathbb{Z}$, aprovechando el teorema de la congruencia como relación.`,
    hip: p => [r`$${p.n}\ge 1$ es un entero`, 'Puedes citar que «$a\\sim b\\iff n\\mid a-b$ es de equivalencia»'], meta: p => r`$\equiv\pmod ${p.n}$ es reflexiva, simétrica y transitiva`,
    L: p => [
      ['L1', r`Por definición, $${p.a}\equiv ${p.b}\pmod ${p.n}$ significa $${p.n}\mid ${p.a}-${p.b}$.`, 'd.congruencia'],
      ['L2', r`Esa es exactamente la relación $${p.a}\sim ${p.b}\iff ${p.n}\mid ${p.a}-${p.b}$ del teorema ⟦h1⟧.`, 't.mod-equivalencia', ['L1'], [H('h1', 'de la congruencia como relación de equivalencia', ['de la congruencia como relación de equivalencia', 'de la división con resto', 'de Bézout'], false)]],
      ['L3', r`Por ese teorema, la relación es reflexiva, simétrica y transitiva: es de equivalencia. ∎`, 'd.relacion-equivalencia', ['L2']],
    ],
    dist: p => [[r`Como $${p.a}\equiv ${p.a}$, $${p.a}\equiv ${p.b}\Rightarrow ${p.b}\equiv ${p.a}$ y $${p.a}\equiv ${p.b}$, $${p.b}\equiv ${p.c}\Rightarrow ${p.a}\equiv ${p.c}$ se comprueban con $${p.n}=5$.`, 'un valor de $n$ no prueba el caso general'], [r`Es antisimétrica, así que también es de orden.`, 'no es antisimétrica: $0\\equiv n$ y $n\\equiv 0$ con $0\\neq n$']],
    err: p => [['L1', r`Por definición, $${p.a}\equiv ${p.b}\pmod ${p.n}$ significa $${p.a}\mid ${p.n}-${p.b}$.`, 'error-de-calculo', 'Es $n\\mid a-b$: el módulo divide a la diferencia.'], ['L3', r`Por ese teorema, la relación es reflexiva, antisimétrica y transitiva. ∎`, 'conclusion-invalida', 'El teorema dice **simétrica**, no antisimétrica.']],
    valida: [['reducir', r`Reducir al teorema de 1.3 con la misma relación`, 'Aprovecha lo ya ganado.'], ['directa', r`Probar las tres propiedades a mano con $a-b=nk$`, 'Es la prueba original del teorema de 1.3.']],
    idea: p => r`la congruencia es la misma relación que ya sabes que es de equivalencia.`, primero: p => r`escribe qué significa $${p.a}\equiv ${p.b}\pmod ${p.n}$.`,
  });

  dem2({
    id: 'dem.cong-operaciones', teorema: 't.cong-operaciones', nivel: '2.3', habilidades: ['2.3.potencia-modular', '2.3.demostrar'], requiere: ['t.div-combinacion'], refsExtra: ['d.divisibilidad', 'b.arbitrario'],
    param: rng => { const [a, b, c, d] = rng.pick(NM); return { a, b, c, d, n: rng.pick(['n', 'm']) }; },
    enunciado: p => r`Demuestra que si $${p.a}\equiv ${p.b}$ y $${p.c}\equiv ${p.d}\pmod ${p.n}$, entonces $${p.a}+${p.c}\equiv ${p.b}+${p.d}$ y $${p.a}${p.c}\equiv ${p.b}${p.d}\pmod ${p.n}$.`,
    hip: p => [r`$${p.n}\mid ${p.a}-${p.b}$ y $${p.n}\mid ${p.c}-${p.d}$`, 'Puedes citar la divisibilidad de combinaciones'], meta: p => r`$${p.a}+${p.c}\equiv ${p.b}+${p.d}$ y $${p.a}${p.c}\equiv ${p.b}${p.d}\pmod ${p.n}$`,
    L: p => [
      ['L1', r`Por hipótesis, $${p.n}\mid ${p.a}-${p.b}$ y $${p.n}\mid ${p.c}-${p.d}$.`, 'd.congruencia'],
      ['L2', r`Suma: $(${p.a}+${p.c})-(${p.b}+${p.d})=(${p.a}-${p.b})\cdot 1+(${p.c}-${p.d})\cdot 1$; por la divisibilidad de combinaciones, $${p.n}$ lo divide.`, 't.div-combinacion', ['L1']],
      ['L3', r`Producto: $${p.a}${p.c}-${p.b}${p.d}=${p.c}(${p.a}-${p.b})+${p.b}(${p.c}-${p.d})$.`, 'b.cuerpo-algebra', ['L1']],
      ['L4', r`Por la divisibilidad de combinaciones (con coeficientes ⟦h1⟧), $${p.n}\mid ${p.a}${p.c}-${p.b}${p.d}$. ∎`, 't.div-combinacion', ['L1', 'L3'], [H('h1', r`$${p.c}$ y $${p.b}$`, [r`$${p.a}$ y $${p.d}$`, r`$${p.n}$ y $${p.n}$`, r`$1$ y $1$`], false)]],
    ],
    dist: p => [[r`Con $${p.n}=5$, $${p.a}=7\equiv 2$ y $${p.c}=8\equiv 3$ se cumple $7\cdot 8\equiv 2\cdot 3$; luego vale siempre.`, 'un ejemplo no prueba el caso general'], [r`Como $${p.a}-${p.b}$ y $${p.c}-${p.d}$ son múltiplos de $${p.n}$, su cociente también.`, 'el cociente de múltiplos no es necesariamente múltiplo']],
    err: p => [['L3', r`Producto: $${p.a}${p.c}-${p.b}${p.d}=(${p.a}-${p.b})(${p.c}-${p.d})$.`, 'error-de-calculo', 'No es el producto de las diferencias: el desarrollo correcto es $c(a-b)+b(c-d)$.'], ['L2', r`Suma: $(${p.a}+${p.c})-(${p.b}+${p.d})=(${p.a}-${p.b})-(${p.c}-${p.d})$.`, 'error-de-calculo', 'Las diferencias se **suman**.']],
    valida: [['definicion', r`Usar $n\mid a-b$ y expresar cada diferencia como combinación`, 'Es la prueba estándar.'], ['restos', r`Escribir $a=b+nk$, $c=d+nl$ y desarrollar`, 'También funciona: $a+c=b+d+n(k+l)$ y $ac=bd+n(\\cdots)$.']],
    idea: p => r`$${p.a}${p.c}-${p.b}${p.d}=${p.c}(${p.a}-${p.b})+${p.b}(${p.c}-${p.d})$.`, primero: p => r`escribe las hipótesis como $${p.n}\mid\cdots$.`,
  });

  dem2({
    id: 'dem.cong-cancelacion', teorema: 't.cong-cancelacion', nivel: '2.3', habilidades: ['2.3.cong-lineal', '2.3.demostrar'], requiere: ['t.lema-euclides'], refsExtra: ['d.divisibilidad', 't.div-combinacion'],
    param: rng => { const [a, b, c] = rng.pick(NM); return { a, b, c, n: rng.pick(['n', 'm']) }; },
    enunciado: p => r`Demuestra que si $${p.a}${p.c}\equiv ${p.b}${p.c}\pmod ${p.n}$ y $\operatorname{mcd}(${p.c},${p.n})=1$, entonces $${p.a}\equiv ${p.b}\pmod ${p.n}$.`,
    hip: p => [r`$${p.n}\mid ${p.a}${p.c}-${p.b}${p.c}$`, r`$\operatorname{mcd}(${p.c},${p.n})=1$`], meta: p => r`$${p.a}\equiv ${p.b}\pmod ${p.n}$`,
    L: p => [
      ['L1', r`Por hipótesis, $${p.n}\mid ${p.a}${p.c}-${p.b}${p.c}=${p.c}(${p.a}-${p.b})$.`, 'd.congruencia'],
      ['L2', r`Como $\operatorname{mcd}(${p.n},${p.c})=1$ y $${p.n}\mid ${p.c}(${p.a}-${p.b})$, por el lema de ⟦h1⟧, $${p.n}\mid ${p.a}-${p.b}$.`, 't.lema-euclides', ['L1'], [H('h1', 'Euclides', ['Euclides', 'Bézout', 'Fermat'], false)]],
      ['L3', r`Es decir, $${p.a}\equiv ${p.b}\pmod ${p.n}$. ∎`, 'd.congruencia', ['L2']],
    ],
    dist: p => [[r`Dividimos ambos lados entre $${p.c}$: $${p.a}\equiv ${p.b}$.`, 'dividir no siempre es válido en congruencias: hace falta que $c$ sea coprimo con $n$'], [r`Con $${p.n}=7$, $${p.c}=3$: $3\cdot 5\equiv 3\cdot 12$ y $5\equiv 12$; luego vale siempre.`, 'un ejemplo no prueba el caso general']],
    err: p => [['L2', r`Como $${p.n}\mid ${p.c}(${p.a}-${p.b})$, entonces $${p.n}\mid ${p.c}$ o $${p.n}\mid ${p.a}-${p.b}$.`, 'conclusion-invalida', 'Eso solo vale si $n$ es primo; aquí se usa el lema de Euclides con $\\operatorname{mcd}=1$.'], ['L1', r`Por hipótesis, $${p.n}\mid ${p.a}${p.c}+${p.b}${p.c}$.`, 'error-de-calculo', 'La diferencia es $ac-bc$, no la suma.']],
    valida: [['lema', r`Aplicar el lema de Euclides a $n\mid c(a-b)$`, 'Es la prueba estándar.'], ['inverso', r`Multiplicar por el inverso de $c$ módulo $n$`, 'Válida si se tiene el inverso modular; aquí se probó antes este resultado, que se usa para justificarlo.']],
    idea: p => r`$${p.a}${p.c}-${p.b}${p.c}=${p.c}(${p.a}-${p.b})$ y el lema de Euclides.`, primero: p => r`escribe la hipótesis como una divisibilidad.`,
  });

  dem2({
    id: 'dem.inverso-modular', teorema: 't.inverso-modular', nivel: '2.3', habilidades: ['2.3.cong-lineal', '2.3.demostrar'], requiere: ['t.bezout', 't.cong-operaciones'], refsExtra: ['b.doble-implicacion', 'd.divisibilidad', 't.div-combinacion'],
    param: rng => ({ a: rng.pick(['a', 'u']), n: rng.pick(['n', 'm']), x: rng.pick(['x', 'v']), y: rng.pick(['y', 'w']), k: rng.pick(['k', 'j']) }),
    enunciado: p => r`Demuestra que existe $${p.x}$ con $${p.a}${p.x}\equiv 1\pmod ${p.n}$ si y solo si $\operatorname{mcd}(${p.a},${p.n})=1$.`,
    hip: p => [r`$${p.a},${p.n}\in\mathbb{Z}$, $${p.n}\ge 1$`], meta: p => r`$\exists ${p.x}:\ ${p.a}${p.x}\equiv 1\pmod ${p.n}\iff\operatorname{mcd}(${p.a},${p.n})=1$`,
    L: p => [
      ['L1', r`Probamos las dos implicaciones.`, 'b.doble-implicacion'],
      ['L2', r`(⇐) Si $\operatorname{mcd}(${p.a},${p.n})=1$, por Bézout existen $${p.x},${p.y}$ con $${p.a}${p.x}+${p.n}${p.y}=1$.`, 't.bezout', ['L1']],
      ['L3', r`Entonces $${p.a}${p.x}=1-${p.n}${p.y}\equiv 1\pmod ${p.n}$, pues $${p.n}${p.y}\equiv 0$ y las congruencias se pueden restar (⟦h1⟧).`, 't.cong-operaciones', ['L2'], [H('h1', 'compatibilidad con las operaciones', ['compatibilidad con las operaciones', 'cancelación', 'lema de Euclides'], false)]],
      ['L4', r`(⇒) Si $${p.a}${p.x}\equiv 1\pmod ${p.n}$, existe $${p.k}$ con $${p.a}${p.x}-1=${p.n}${p.k}$, es decir, $${p.a}${p.x}-${p.n}${p.k}=1$.`, 'd.congruencia', ['L1']],
      ['L5', r`Todo divisor común de $${p.a}$ y $${p.n}$ divide a $${p.a}${p.x}-${p.n}${p.k}=1$ (divisibilidad de combinaciones); luego $\operatorname{mcd}(${p.a},${p.n})=1$. ∎`, 't.div-combinacion', ['L4']],
    ],
    dist: p => [[r`Como $${p.a}${p.x}\equiv 1$, entonces $${p.x}=1/${p.a}$.`, 'en $\\mathbb{Z}$ no se divide: hay que usar Bézout'], [r`Probamos con $${p.a}=3$, $${p.n}=7$: existe $5$ con $3\cdot 5\equiv 1$; luego siempre.`, 'un ejemplo no prueba el caso general']],
    err: p => [['L3', r`Entonces $${p.a}${p.x}=1-${p.n}${p.y}\equiv 1-${p.y}\pmod ${p.n}$.`, 'error-de-calculo', '$n y\\equiv 0$ porque $n\\mid ny$, no $y$.'], ['L5', r`Todo divisor común de $${p.a}$ y $${p.n}$ divide a $${p.a}${p.x}$; luego $\operatorname{mcd}=1$. ∎`, 'no-justificado', 'Hay que dividir también la diferencia $ax-nk=1$.']],
    valida: [['bezout', r`(⇐) Bézout y (⇒) divisibilidad de combinaciones`, 'Es la prueba estándar.'], ['cancelacion', r`Usar la cancelación y contar clases`, 'Para $n$ pequeño se puede argumentar con un principio del palomar; la prueba por Bézout es más corta.']],
    idea: p => r`$${p.a}${p.x}\equiv 1\pmod ${p.n}$ significa $${p.a}${p.x}+${p.n}${p.y}=1$ para algún $${p.y}$.`, primero: p => r`prueba (⇐) con la identidad de Bézout.`,
  });

  dem2({
    id: 'dem.cong-lineal', teorema: 't.cong-lineal', nivel: '2.3', habilidades: ['2.3.cong-lineal', '2.3.demostrar'], requiere: ['t.diofantica', 't.cong-equivalencia'], refsExtra: ['b.doble-implicacion', 'd.divisibilidad'],
    param: rng => ({ a: rng.pick(['a', 'u']), b: rng.pick(['b', 'c']), n: rng.pick(['n', 'm']), x: rng.pick(['x', 'z']), y: rng.pick(['y', 't']) }),
    enunciado: p => r`Demuestra que $${p.a}${p.x}\equiv ${p.b}\pmod ${p.n}$ tiene solución si y solo si $\operatorname{mcd}(${p.a},${p.n})\mid ${p.b}$.`,
    hip: p => [r`$${p.a},${p.b},${p.n}\in\mathbb{Z}$, $${p.n}\ge 1$`, 'Puedes citar las ecuaciones diofánticas'], meta: p => r`$${p.a}${p.x}\equiv ${p.b}\pmod ${p.n}$ resoluble $\iff\operatorname{mcd}(${p.a},${p.n})\mid ${p.b}$`,
    L: p => [
      ['L1', r`Por definición, $${p.a}${p.x}\equiv ${p.b}\pmod ${p.n}$ equivale a que exista $${p.y}$ con $${p.a}${p.x}-${p.b}=${p.n}${p.y}$, es decir, $${p.a}${p.x}+${p.n}(-${p.y})=${p.b}$.`, 'd.congruencia'],
      ['L2', r`Así, la congruencia tiene solución si y solo si la ecuación diofántica $${p.a}${p.x}+${p.n}${p.y}'=${p.b}$ la tiene.`, 'b.doble-implicacion', ['L1']],
      ['L3', r`Por el teorema de las ecuaciones ⟦h1⟧, eso ocurre si y solo si $\operatorname{mcd}(${p.a},${p.n})\mid ${p.b}$.`, 't.diofantica', ['L2'], [H('h1', 'diofánticas', ['diofánticas', 'de Bézout', 'de congruencias'], false)]],
      ['L4', r`Además, si $${p.x}_0$ es solución, toda $${p.x}\equiv ${p.x}_0\pmod ${p.n}$ también lo es, por la transitividad de $\equiv$. ∎`, 't.cong-equivalencia', ['L3']],
    ],
    dist: p => [[r`Probamos con $${p.a}=4$, $${p.n}=6$, $${p.b}=2$: $x=2$ funciona; luego siempre hay solución.`, 'un ejemplo no prueba el criterio (con $b=3$ no hay solución)'], [r`Como $\operatorname{mcd}(${p.a},${p.n})\le ${p.a}$, siempre divide a $${p.b}$.`, 'no hay relación entre $a$ y $b$ que lo garantice']],
    err: p => [['L1', r`Por definición, $${p.a}${p.x}\equiv ${p.b}$ equivale a $${p.a}${p.x}+${p.b}=${p.n}${p.y}$.`, 'error-de-calculo', 'Es $ax-b=ny$: la diferencia, no la suma.'], ['L3', r`Por el teorema de las ecuaciones diofánticas, eso ocurre si y solo si $\operatorname{mcd}(${p.a},${p.b})\mid ${p.n}$.`, 'error-de-calculo', 'Los coeficientes de la ecuación son $a$ y $n$, y el término independiente es $b$.']],
    valida: [['diofantica', r`Traducir a una ecuación diofántica y citar su teorema`, 'Es la prueba más corta.'], ['bezout', r`Usar Bézout directamente con $\operatorname{mcd}(a,n)$`, 'Equivale a reconstruir el teorema diofántico.']],
    idea: p => r`$${p.a}${p.x}\equiv ${p.b}\pmod ${p.n}$ equivale a $${p.a}${p.x}+${p.n}${p.y}=${p.b}$ para algún $${p.y}$.`, primero: p => r`escribe la congruencia como una divisibilidad por $${p.n}$.`,
  });

  R.nivel({
    id: '2.3', mundo: 2, titulo: 'Congruencias', tema: 'Aritmética modular, inversos y congruencias lineales',
    habilidades: ['2.3.reducir', '2.3.potencia-modular', '2.3.cong-lineal', '2.3.criterios', '2.3.demostrar'],
    teoremas: ['t.cong-equivalencia', 't.cong-operaciones', 't.cong-cancelacion', 't.inverso-modular', 't.cong-lineal'],
    leccion: {
      intro: 'Dos enteros son **congruentes módulo $n$** si difieren en un múltiplo de $n$: $a\\equiv b\\pmod n$ significa $n\\mid a-b$. Es aritmética con restos.',
      definiciones: [
        { nombre: 'Congruencia', tex: '$a\\equiv b\\pmod n$ si $n\\mid a-b$. Cada entero es congruente con un único resto $r$, $0\\le r<n$. Es una relación de equivalencia.' },
        { nombre: 'Operaciones', tex: 'Si $a\\equiv b$ y $c\\equiv d\\pmod n$, se pueden sumar y multiplicar: $a+c\\equiv b+d$, $ac\\equiv bd$. De ahí $a^e\\equiv b^e$, y se calculan potencias reduciendo en cada paso.' },
        { nombre: 'Cancelar e invertir', tex: 'Se puede cancelar un factor $c$ solo si $\\operatorname{mcd}(c,n)=1$. En ese caso $c$ tiene inverso: un $x$ con $cx\\equiv 1\\pmod n$.' },
        { nombre: 'Congruencia lineal', tex: '$ax\\equiv b\\pmod n$ tiene solución si y solo si $\\operatorname{mcd}(a,n)\\mid b$; entonces hay $\\operatorname{mcd}(a,n)$ soluciones módulo $n$.' },
      ],
      teorema: 't.inverso-modular',
      ejemplo: { enunciado: 'Resuelve $7x\\equiv 3\\pmod{11}$.', pasos: ['$\\operatorname{mcd}(7,11)=1$, así que $7$ tiene inverso módulo $11$.', 'Como $7\\cdot 8=56=5\\cdot 11+1$, el inverso es $8$.', 'Multiplicando: $x\\equiv 8\\cdot 3=24\\equiv 2\\pmod{11}$. Comprobación: $7\\cdot 2=14\\equiv 3$.'] },
    },
  });

  if (typeof module !== 'undefined') module.exports = AC;
})(globalThis.AC = globalThis.AC || {});
