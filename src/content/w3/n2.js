/* Mundo 3, nivel 3.2 — Raíces de un polinomio. */
(function (AC) {
  const { R, H, T, gen, dem2 } = AC.cont, r = String.raw, P = AC.poly, Rat = AC.Rat, C = AC.conj;
  R.ref({ id: 'b.derivada-producto', tipo: 'propiedad-base', nombre: 'Regla del producto para derivadas: (fg)′ = f′g + fg′' });

  const HB = (id, nombre) => R.habilidad({ id: '3.2.' + id, nombre, nivel: '3.2' });
  HB('candidatos', 'Candidatos a raíces racionales'); HB('raices', 'Hallar raíces'); HB('multiplicidad', 'Multiplicidad'); HB('construir', 'Construir un polinomio'); HB('demostrar', 'Demostrar sobre raíces');
  const TE = (id, titulo, enunciado, requiere, hab) => R.teorema({ id, titulo, nivel: '3.2', enunciado, requiere, habilidades: hab });
  TE('t.raices-maximo', 'Número máximo de raíces', r`Un polinomio no nulo de grado $n$ tiene a lo sumo $n$ raíces.`, ['t.teorema-factor', 't.grado-producto'], ['3.2.raices', '3.2.demostrar']);
  TE('t.identidad-polinomios', 'Identidad de polinomios', r`Si dos polinomios de grado $\le n$ coinciden en $n+1$ puntos distintos, son iguales.`, ['t.raices-maximo'], ['3.2.construir', '3.2.demostrar']);
  TE('t.raices-racionales', 'Raíces racionales', r`Si $\frac{p}{q}$ (irreducible) es raíz de $a_nx^n+\cdots+a_0\in\mathbb{Z}[x]$, entonces $p\mid a_0$ y $q\mid a_n$.`, ['t.lema-euclides'], ['3.2.candidatos', '3.2.demostrar']);
  TE('t.raiz-multiple', 'Raíz múltiple y derivada', r`$a$ es raíz de multiplicidad $\ge 2$ de $p$ si y solo si $p(a)=p'(a)=0$.`, ['t.teorema-factor'], ['3.2.multiplicidad', '3.2.demostrar']);

  const px = p => P.str(p, 'x'), tx = p => P.tex(p, 'x'), de = P.de;
  const prodRaices = (rs, lider) => rs.reduce((q, a) => P.mul(q, de([-a, 1])), de([lider || 1]));

  /* ---------- generadores ---------- */
  gen.conjunto({
    id: 'w3.n2.candidatos-racionales', nivel: '3.2', habilidades: ['3.2.candidatos'], dificultad: 2,
    hacer(rng) {
      const g = rng.int(3, 4), c = Array.from({ length: g + 1 }, () => rng.pick([-6, -4, -3, -2, -1, 1, 2, 3, 4, 6])), p = de(c), cand = P.candidatos(p);
      if (cand.length < 4 || cand.length > 24) return null;
      const enteros = cand.filter(x => !x.includes('/')), positivos = cand.filter(x => !x.startsWith('-'));
      return { key: px(p), enun: 'Según el teorema de las raíces racionales, ¿cuáles son todos los posibles candidatos a raíz racional de $p(x)=' + tx(p) + '$? (Escribe el conjunto de fracciones.)', res: cand, norm: 'racional',
        firmas: [['solo-enteros', enteros, 'Olvidaste las fracciones: el numerador divide al término independiente y el denominador al coeficiente líder.'], ['solo-positivos', positivos, 'Cada candidato puede tener signo $+$ o $-$.']],
        pistas: ['Orientación: usa $p\\mid a_0$ y $q\\mid a_n$.', 'Idea clave: los candidatos son $\\pm\\frac{\\text{divisor de }a_0}{\\text{divisor de }a_n}$.', 'Primer paso: lista los divisores de $' + Math.abs(P.aEnteros(p)[0]) + '$ y de $' + Math.abs(P.aEnteros(p)[g]) + '$.'], expl: 'Los candidatos son $' + C.tex(cand) + '$.' };
    },
  });

  gen.conjunto({
    id: 'w3.n2.raices-racionales', nivel: '3.2', habilidades: ['3.2.raices'], dificultad: 3,
    hacer(rng) {
      const rs = rng.sample([-4, -3, -2, -1, 1, 2, 3, 4, 5], rng.int(2, 3)), extra = rng.chance(0.5) ? de([rng.int(1, 4), 0, 1]) : de([1]);
      const p = P.mul(prodRaices(rs, 1), extra); if (P.grado(p) > 5) return null;
      const res = rs.map(String), neg = rs.map(a => String(-a));
      return { key: px(p), enun: 'Halla todas las raíces racionales de $p(x)=' + tx(p) + '$ (escribe el conjunto).', res, norm: 'racional',
        firmas: [['signos', neg, 'Cuidado con el signo: $x-a$ da la raíz $a$; si el factor es $x+a$ la raíz es $-a$.'], ['una-sola', [res[0]], 'Hay más raíces racionales: sigue probando candidatos o divide por el factor ya encontrado.']],
        pistas: ['Orientación: prueba los candidatos del teorema de las raíces racionales.', 'Idea clave: cuando $p(a)=0$ divide por $x-a$ y busca raíces del cociente.', 'Primer paso: lista los divisores de $' + Math.abs(P.aEnteros(p)[0]) + '$.'], expl: 'Las raíces racionales son $' + C.tex(res) + '$.' };
    },
  });

  gen.entero({
    id: 'w3.n2.multiplicidad', nivel: '3.2', habilidades: ['3.2.multiplicidad'], dificultad: 2,
    hacer(rng) {
      const a = rng.int(-3, 4), m = rng.int(1, 4), otro = rng.pick([-2, 5, 6, 7]); if (a === otro) return null;
      const p = P.mul(P.mul(prodRaices(Array(m).fill(a), 1), de([-otro, 1])), de([rng.int(1, 3), 0, 1]));
      return { key: px(p) + '|' + a, enun: '¿Cuál es la multiplicidad de $x=' + a + '$ como raíz de $p(x)=' + tx(p) + '$?', res: m,
        firmas: [['una-menos', m - 1, 'Divide una vez más: ¿sigue siendo raíz del cociente?'], ['una-mas', m + 1, 'Te pasaste: tras dividir $' + m + '$ veces, $' + a + '$ ya no es raíz del cociente.'], ['grado', P.grado(p), 'Eso es el grado de $p$, no la multiplicidad de esa raíz.']],
        pistas: ['Orientación: la multiplicidad es el mayor $m$ con $(x-a)^m\\mid p$.', 'Idea clave: divide repetidamente por $x-a$ (Horner) hasta que el resto no sea $0$.', 'Primer paso: comprueba que $p(' + a + ')=0$.'], expl: 'La multiplicidad es $' + m + '$.' };
    },
  });

  gen.expr({
    id: 'w3.n2.polinomio-con-raices', nivel: '3.2', habilidades: ['3.2.construir'], dificultad: 2,
    hacer(rng) {
      const rs = rng.sample([-4, -3, -2, -1, 1, 2, 3, 4], rng.int(2, 3)), l = rng.chance(0.4) ? rng.pick([2, 3, -1]) : 1, p = prodRaices(rs, l);
      const listado = rs.map(a => String(a)).join(', ');
      return { key: rs.join(',') + 'l' + l, enun: 'Escribe, expandido, el polinomio ' + (l === 1 ? 'mónico' : 'de coeficiente líder $' + l + '$') + ' de menor grado cuyas raíces son $' + listado + '$.', res: px(p), vars: ['x'],
        firmas: [['signos-opuestos', px(prodRaices(rs.map(a => -a), l)), 'Si $a$ es raíz el factor es $(x-a)$, no $(x+a)$.'], ['sin-lider', px(prodRaices(rs, 1)), 'Falta el coeficiente líder pedido.'], ['falta-una-raiz', px(prodRaices(rs.slice(1), l)), 'Cada raíz aporta un factor: te falta uno.']].filter(q => q[1] !== px(p)),
        pistas: ['Orientación: cada raíz $a$ aporta un factor $(x-a)$.', 'Idea clave: $p(x)=c\\,(x-r_1)(x-r_2)\\cdots$; luego se expande.', 'Primer paso: escribe los factores.'], expl: '$p(x)=' + tx(p) + '$.' };
    },
  });

  gen.entero({
    id: 'w3.n2.raiz-doble-parametro', nivel: '3.2', habilidades: ['3.2.multiplicidad', '3.2.raices'], dificultad: 3,
    hacer(rng) {
      if (rng.chance(0.5)) { const b = 2 * rng.int(1, 9) * (rng.chance(0.5) ? 1 : -1), res = (b / 2) ** 2;
        return { key: 'q' + b, enun: '¿Para qué valor de $k$ tiene $x^2' + (b > 0 ? '+' : '-') + Math.abs(b) + 'x+k$ una raíz doble?', res, firmas: [['mitad', b / 2, 'La condición es $k=(b/2)^2$: hay que elevar al cuadrado.'], ['b-cuadrado', b * b, 'El discriminante es $b^2-4k=0$, así que $k=b^2/4$, no $b^2$.']],
          pistas: ['Orientación: raíz doble significa $p(a)=p\'(a)=0$ (o discriminante cero).', 'Idea clave: $p\'(x)=2x+b$ se anula en $x=-b/2$.', 'Primer paso: sustituye $x=-b/2$ en $p$ e iguala a cero.'], expl: '$k=' + res + '$.' }; }
      const c = rng.int(1, 6), res = 2 * c ** 3;
      return { key: 'c' + c, enun: 'El polinomio $x^3-' + 3 * c * c + 'x+k$ tiene una raíz doble para dos valores de $k$ (opuestos). Halla el valor **positivo** de $k$.', res,
        firmas: [['sin-factor-2', c ** 3, 'Al evaluar $p(' + c + ')=' + c + '^3-3\\cdot' + c + '^3+k$ da $k=2\\cdot' + c + '^3$.'], ['c', c, 'Eso es la raíz doble; piden el parámetro $k$.']],
        pistas: ['Orientación: raíz doble: $p(a)=0$ y $p\'(a)=0$.', 'Idea clave: $p\'(x)=3x^2-' + 3 * c * c + '$ se anula en $x=\\pm' + c + '$.', 'Primer paso: sustituye $x=' + c + '$ en $p$ y despeja $k$.'], expl: '$k=2\\cdot' + c + '^3=' + res + '$.' };
    },
  });

  /* ---------- demostraciones ---------- */
  dem2({
    id: 'dem.raices-maximo', teorema: 't.raices-maximo', nivel: '3.2', habilidades: ['3.2.raices', '3.2.demostrar'], requiere: ['t.teorema-factor', 't.grado-producto'], refsExtra: ['b.arbitrario', 'd.raiz'],
    param: rng => ({ p: rng.pick(['p', 'f']), n: rng.pick(['n', 'm']), a: rng.pick(['a', 'c']), b: rng.pick(['b', 'e']), q: rng.pick(['q', 'h']) }),
    enunciado: p => r`Demuestra por inducción que un polinomio no nulo $${p.p}\in\mathbb{Q}[x]$ de grado $${p.n}$ tiene a lo sumo $${p.n}$ raíces.`,
    hip: p => [r`$${p.p}\neq 0$ y $\operatorname{gr}${p.p}=${p.n}\ge 0$`, 'Puedes citar el teorema del factor y el grado de un producto'], meta: p => r`$${p.p}$ tiene a lo sumo $${p.n}$ raíces`,
    L: p => [
      ['L1', r`Base: si $${p.n}=0$, $${p.p}$ es una constante no nula y no tiene raíces ($0\le 0$).`, 'b.peano'],
      ['L2', r`Paso: supongamos el resultado para grado $${p.n}-1$ y sea $\operatorname{gr}${p.p}=${p.n}\ge 1$. Si $${p.p}$ no tiene raíces, ya está.`, 'd.hip-induccion', ['L1']],
      ['L3', r`Si $${p.a}$ es una raíz, por el teorema del factor $${p.p}=(x-${p.a})${p.q}$ y, por el grado de un producto, $\operatorname{gr}${p.q}=${p.n}-1$.`, 't.teorema-factor', ['L2']],
      ['L4', r`Si $${p.b}\neq ${p.a}$ es otra raíz, $0=(${p.b}-${p.a})${p.q}(${p.b})$ y, como $${p.b}-${p.a}\neq 0$, ⟦h1⟧.`, 'b.sin-divisores-cero', ['L3'], [H('h1', r`$${p.q}(${p.b})=0$`, [r`$${p.q}(${p.b})\neq 0$`, r`$${p.q}=0$`, r`$${p.b}=0$`], false)]],
      ['L5', r`Por hipótesis de inducción $${p.q}$ tiene a lo sumo $${p.n}-1$ raíces; las raíces de $${p.p}$ son $${p.a}$ y esas: a lo sumo $${p.n}$. ∎`, 'd.hip-induccion', ['L4']],
    ],
    dist: p => [[r`Con $${p.p}=x^3-x$, las raíces $0,1,-1$ son $3$; luego siempre hay a lo sumo $3$.`, 'un ejemplo no prueba el caso general'], [r`Como $\mathbb{Q}$ es infinito, un polinomio puede tener infinitas raíces.`, 'es falso para polinomios no nulos']],
    err: p => [['L3', r`Si $${p.a}$ es una raíz, $${p.p}=(x+${p.a})${p.q}$.`, 'error-de-calculo', 'El factor es $x-a$.'], ['L5', r`Por hipótesis de inducción $${p.q}$ tiene a lo sumo $${p.n}$ raíces; luego $${p.p}$ tiene a lo sumo $2${p.n}$.`, 'error-de-calculo', 'El cociente tiene grado $n-1$, con a lo sumo $n-1$ raíces.']],
    valida: [['induccion', r`Inducción sobre el grado extrayendo un factor $(x-a)$`, 'Es la prueba estándar.'], ['absurdo', r`Suponer $n+1$ raíces y factorizar $n+1$ factores lineales (grado $\ge n+1>n$)`, 'Válida: da una contradicción de grados con el grado de un producto.']],
    idea: p => r`extrae un factor $(x-${p.a})$ y aplica la hipótesis al cociente.`, primero: p => r`trata el grado $0$.`,
  });

  dem2({
    id: 'dem.identidad-polinomios', teorema: 't.identidad-polinomios', nivel: '3.2', habilidades: ['3.2.construir', '3.2.demostrar'], requiere: ['t.raices-maximo'], refsExtra: ['b.contradiccion', 'd.raiz'],
    param: rng => ({ p: rng.pick(['p', 'f']), q: rng.pick(['q', 'g']), n: rng.pick(['n', 'm']), x: rng.pick(['x'])}),
    enunciado: p => r`Demuestra que si $${p.p},${p.q}\in\mathbb{Q}[x]$ tienen grado $\le ${p.n}$ y coinciden en $${p.n}+1$ puntos distintos, entonces $${p.p}=${p.q}$.`,
    hip: p => [r`$\operatorname{gr}${p.p},\operatorname{gr}${p.q}\le ${p.n}$`, r`$${p.p}(a_i)=${p.q}(a_i)$ para $${p.n}+1$ valores distintos $a_i$`, 'Puedes citar el máximo de raíces'], meta: p => r`$${p.p}=${p.q}$`,
    L: p => [
      ['L1', r`Sea $h=${p.p}-${p.q}$: tiene grado $\le ${p.n}$.`, 'd.grado'],
      ['L2', r`$h(a_i)=${p.p}(a_i)-${p.q}(a_i)=0$ para los $${p.n}+1$ puntos: $h$ tiene al menos $${p.n}+1$ raíces distintas.`, 'd.raiz', ['L1']],
      ['L3', r`Si $h\neq 0$, por el máximo de raíces tendría a lo sumo $\operatorname{gr}h\le ${p.n}$ raíces: ⟦h1⟧.`, 't.raices-maximo', ['L2'], [H('h1', 'contradicción', ['contradicción', 'consecuencia', 'tautología'], false)]],
      ['L4', r`Luego $h=0$ y $${p.p}=${p.q}$. ∎`, 'b.contradiccion', ['L3']],
    ],
    dist: p => [[r`Con $${p.n}=1$ y dos rectas que coinciden en $2$ puntos son la misma; luego vale siempre.`, 'un ejemplo no prueba el caso general'], [r`Coinciden en $${p.n}$ puntos, así que son iguales.`, 'hacen falta $n+1$ puntos, no $n$']],
    err: p => [['L1', r`Sea $h=${p.p}+${p.q}$: tiene grado $\le ${p.n}$.`, 'error-de-calculo', 'La diferencia es la que se anula en los puntos comunes.'], ['L3', r`Si $h\neq 0$, tendría a lo sumo $\operatorname{gr}h$ raíces, lo cual es compatible con $${p.n}+1$ raíces.`, 'conclusion-invalida', '$n+1>n\\ge\\operatorname{gr}h$: es una contradicción.']],
    valida: [['diferencia', r`Considerar $p-q$ y contar raíces`, 'Es la prueba estándar.'], ['lagrange', r`Usar la interpolación de Lagrange (unicidad)`, 'Válida; la unicidad de la interpolación es justamente este teorema.']],
    idea: p => r`$${p.p}-${p.q}$ tiene grado $\le ${p.n}$ y $${p.n}+1$ raíces.`, primero: p => r`define $h=${p.p}-${p.q}$.`,
  });

  dem2({
    id: 'dem.raices-racionales', teorema: 't.raices-racionales', nivel: '3.2', habilidades: ['3.2.candidatos', '3.2.demostrar'], requiere: ['t.lema-euclides'], refsExtra: ['b.coprimo-producto', 'd.divisibilidad', 'd.mcd'],
    param: rng => ({ u: rng.pick(['u', 'r']), v: rng.pick(['v', 's']), n: rng.pick(['n', 'm']) }),
    enunciado: p => r`Sea $a_${p.n}x^${p.n}+\cdots+a_0$ con coeficientes enteros y $\frac{${p.u}}{${p.v}}$ una raíz con $\operatorname{mcd}(${p.u},${p.v})=1$. Demuestra que $${p.u}\mid a_0$ y $${p.v}\mid a_${p.n}$.`,
    hip: p => [r`$a_i\in\mathbb{Z}$, $a_${p.n}\neq 0$`, r`$\operatorname{mcd}(${p.u},${p.v})=1$ y $p(${p.u}/${p.v})=0$`], meta: p => r`$${p.u}\mid a_0$ y $${p.v}\mid a_${p.n}$`,
    L: p => [
      ['L1', r`Multiplicando $p(${p.u}/${p.v})=0$ por $${p.v}^${p.n}$: $a_${p.n}${p.u}^${p.n}+a_{${p.n}-1}${p.u}^{${p.n}-1}${p.v}+\cdots+a_0${p.v}^${p.n}=0$.`, 'b.cuerpo-algebra'],
      ['L2', r`Todos los términos salvo el último son múltiplos de $${p.u}$; por tanto $${p.u}\mid a_0${p.v}^${p.n}$.`, 't.div-combinacion', ['L1']],
      ['L3', r`Como $\operatorname{mcd}(${p.u},${p.v})=1$, también $\operatorname{mcd}(${p.u},${p.v}^${p.n})=1$ (producto de coprimos); por el lema de Euclides, $${p.u}\mid a_0$.`, 't.lema-euclides', ['L2']],
      ['L4', r`Análogamente, todos los términos salvo el primero son múltiplos de $${p.v}$, así que $${p.v}\mid a_${p.n}${p.u}^${p.n}$, y por el lema de ⟦h1⟧ $${p.v}\mid a_${p.n}$. ∎`, 't.lema-euclides', ['L1'], [H('h1', 'Euclides', ['Euclides', 'Bézout', 'Fermat'], false)]],
    ],
    dist: p => [[r`Como $${p.u}/${p.v}$ es raíz, $a_0=${p.u}$ y $a_${p.n}=${p.v}$.`, 'solo dividen, no tienen por qué ser iguales'], [r`Con $2x^2-3x+1$ y raíz $1/2$: $1\mid 1$ y $2\mid 2$; luego siempre.`, 'un ejemplo no prueba el teorema']],
    err: p => [['L2', r`Todos los términos salvo el último son múltiplos de $${p.v}$; por tanto $${p.v}\mid a_0${p.v}^${p.n}$.`, 'conclusion-invalida', 'Los términos con $u$ son múltiplos de $u$, no de $v$.'], ['L3', r`Como $${p.u}\mid a_0${p.v}^${p.n}$, entonces $${p.u}\mid a_0$ porque $${p.u}$ es primo.`, 'conclusion-invalida', '$u$ no tiene por qué ser primo: se usa que es coprimo con $v^n$.']],
    valida: [['multiplicar', r`Multiplicar por $v^n$, aislar un término y usar el lema de Euclides`, 'Es la prueba estándar.']],
    idea: p => r`multiplica por $${p.v}^${p.n}$ para limpiar denominadores.`, primero: p => r`escribe $p(${p.u}/${p.v})=0$ y multiplica por $${p.v}^${p.n}$.`,
  });

  dem2({
    id: 'dem.raiz-multiple', teorema: 't.raiz-multiple', nivel: '3.2', habilidades: ['3.2.multiplicidad', '3.2.demostrar'], requiere: ['t.teorema-factor'], refsExtra: ['b.doble-implicacion', 'd.raiz'],
    param: rng => ({ p: rng.pick(['p', 'f']), a: rng.pick(['a', 'c']), q: rng.pick(['q', 'h']) }),
    enunciado: p => r`Demuestra que $(x-${p.a})^2\mid ${p.p}(x)$ si y solo si $${p.p}(${p.a})=0$ y $${p.p}'(${p.a})=0$.`,
    hip: p => [r`$${p.p}\in\mathbb{Q}[x]$, $${p.a}\in\mathbb{Q}$`, 'Puedes citar el teorema del factor y la regla del producto para derivadas'], meta: p => r`$(x-${p.a})^2\mid ${p.p}\iff ${p.p}(${p.a})=${p.p}'(${p.a})=0$`,
    L: p => [
      ['L1', r`Probamos las dos implicaciones.`, 'b.doble-implicacion'],
      ['L2', r`(⇒) Si $${p.p}=(x-${p.a})^2${p.q}$, entonces $${p.p}(${p.a})=0$ y, por la regla del producto, $${p.p}'=2(x-${p.a})${p.q}+(x-${p.a})^2${p.q}'$, que vale $0$ en $x=${p.a}$.`, 'b.derivada-producto', ['L1']],
      ['L3', r`(⇐) Si $${p.p}(${p.a})=0$, por el teorema del factor $${p.p}=(x-${p.a})${p.q}$.`, 't.teorema-factor', ['L1']],
      ['L4', r`Derivando, $${p.p}'=${p.q}+(x-${p.a})${p.q}'$, así que $${p.p}'(${p.a})=${p.q}(${p.a})$. Como $${p.p}'(${p.a})=0$, $${p.q}(${p.a})=0$.`, 'b.derivada-producto', ['L3']],
      ['L5', r`Por el teorema del factor, $(x-${p.a})\mid ${p.q}$, luego $(x-${p.a})^2\mid ${p.p}$. Con L2, se cumplen ambas implicaciones. ∎`, 't.teorema-factor', ['L2', 'L4']],
    ],
    dist: p => [[r`Si $${p.p}(${p.a})=0$ entonces $${p.a}$ es raíz doble.`, 'solo es simple en general: hace falta también $p\'(a)=0$'], [r`Con $x^2$ y $a=0$ se cumple; luego siempre.`, 'un ejemplo no prueba el caso general']],
    err: p => [['L4', r`Derivando, $${p.p}'=${p.q}'$, así que $${p.p}'(${p.a})=${p.q}'(${p.a})$.`, 'error-de-calculo', 'La regla del producto da $q+(x-a)q\'$.'], ['L3', r`(⇐) Si $${p.p}'(${p.a})=0$, por el teorema del factor $${p.p}=(x-${p.a})${p.q}$.`, 'conclusion-invalida', 'Ese factor se obtiene de $p(a)=0$, no de $p\'(a)=0$.']],
    valida: [['factor', r`Aplicar el teorema del factor dos veces con la regla del producto`, 'Es la prueba estándar.']],
    idea: p => r`si $${p.p}=(x-${p.a})${p.q}$ entonces $${p.p}'(${p.a})=${p.q}(${p.a})$.`, primero: p => r`prueba (⇒) escribiendo $${p.p}=(x-${p.a})^2${p.q}$ y derivando.`,
  });

  R.nivel({
    id: '3.2', mundo: 3, titulo: 'Raíces de un polinomio', tema: 'Raíces racionales, multiplicidad y número de raíces',
    habilidades: ['3.2.candidatos', '3.2.raices', '3.2.multiplicidad', '3.2.construir', '3.2.demostrar'],
    teoremas: ['t.raices-maximo', 't.identidad-polinomios', 't.raices-racionales', 't.raiz-multiple'],
    leccion: {
      intro: 'Una **raíz** de $p$ es un $a$ con $p(a)=0$. Por el teorema del factor, cada raíz $a$ extrae un factor $x-a$.',
      definiciones: [
        { nombre: 'Número de raíces', tex: 'Un polinomio no nulo de grado $n$ tiene a lo sumo $n$ raíces. En consecuencia, dos polinomios de grado $\\le n$ que coinciden en $n+1$ puntos son iguales.' },
        { nombre: 'Raíces racionales', tex: 'Si $p/q$ (irreducible) es raíz de un polinomio con coeficientes enteros $a_nx^n+\\cdots+a_0$, entonces $p\\mid a_0$ y $q\\mid a_n$: así se acota la búsqueda a un número finito de candidatos.' },
        { nombre: 'Multiplicidad', tex: '$a$ tiene **multiplicidad** $m$ si $(x-a)^m\\mid p$ pero $(x-a)^{m+1}\\nmid p$. Es raíz múltiple (m ≥ 2) si y solo si $p(a)=p\'(a)=0$.' },
        { nombre: 'Construir polinomios', tex: 'El polinomio mónico con raíces $r_1,\\dots,r_k$ es $(x-r_1)\\cdots(x-r_k)$; si hay un coeficiente líder $c$, se multiplica por $c$.' },
      ],
      teorema: 't.raices-racionales',
      ejemplo: { enunciado: 'Halla las raíces racionales de $2x^3-3x^2-3x+2$.', pasos: ['Candidatos: $\\pm\\{1,2\\}/\\{1,2\\}$ = $\\pm1,\\pm2,\\pm\\tfrac12$.', '$p(-1)=-2-3+3+2=0$: $-1$ es raíz. Dividiendo: $2x^3-3x^2-3x+2=(x+1)(2x^2-5x+2)$.', '$2x^2-5x+2=(2x-1)(x-2)$: las raíces son $-1,\\ \\tfrac12,\\ 2$.'] },
    },
  });

  if (typeof module !== 'undefined') module.exports = AC;
})(globalThis.AC = globalThis.AC || {});
