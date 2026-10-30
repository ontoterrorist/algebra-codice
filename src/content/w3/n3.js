/* Mundo 3, nivel 3.3 — Factorización de polinomios. */
(function (AC) {
  const { R, H, T, gen, dem2 } = AC.cont, r = String.raw, P = AC.poly, Rat = AC.Rat, C = AC.conj;
  R.ref({ id: 'd.irreducible', tipo: 'definicion', nombre: 'Polinomio irreducible: no constante y no es producto de dos polinomios de grado menor' });

  const HB = (id, nombre) => R.habilidad({ id: '3.3.' + id, nombre, nivel: '3.3' });
  HB('factorizar', 'Factorizar completamente'); HB('irreducibles', 'Decidir irreducibilidad'); HB('mcd', 'Máximo común divisor'); HB('conjugadas', 'Raíces complejas conjugadas'); HB('demostrar', 'Demostrar sobre factorización');
  const TE = (id, titulo, enunciado, requiere, hab) => R.teorema({ id, titulo, nivel: '3.3', enunciado, requiere, habilidades: hab });
  TE('t.mcd-polinomios', 'Algoritmo de Euclides para polinomios', r`Si $p=sq+r$, entonces $\operatorname{mcd}(p,q)=\operatorname{mcd}(q,r)$.`, ['t.division-polinomios'], ['3.3.mcd', '3.3.demostrar']);
  TE('t.cuadratica-irreducible', 'Cuadráticas irreducibles', r`$x^2+bx+c$ es irreducible sobre $\mathbb{R}$ si y solo si $b^2-4c<0$.`, ['t.teorema-factor'], ['3.3.irreducibles', '3.3.demostrar']);
  TE('t.cubica-irreducible', 'Cúbicas irreducibles', r`Un polinomio de grado $2$ o $3$ sobre $\mathbb{Q}$ es irreducible si y solo si no tiene raíces racionales.`, ['t.teorema-factor', 't.grado-producto'], ['3.3.irreducibles', '3.3.factorizar', '3.3.demostrar']);
  TE('t.conjugadas', 'Raíces complejas conjugadas', r`Si $p$ tiene coeficientes reales y $p(z)=0$, entonces $p(\bar z)=0$.`, ['t.conj-producto'], ['3.3.conjugadas', '3.3.demostrar']);

  const px = p => P.str(p, 'x'), tx = p => P.tex(p, 'x'), de = P.de;
  const lin = a => de([-a, 1]), fac = p => '(' + px(p) + ')';
  const unir = (c, fs) => (c !== 1 ? [String(c)] : []).concat(fs.map(fac)).join('*');
  const prod = (c, fs) => fs.reduce((q, f) => P.mul(q, f), de([c]));
  const quadIrr = (rng) => { for (let k = 0; k < 40; k++) { const b = rng.int(-4, 4), c = rng.int(1, 7), q = de([c, b, 1]); if (P.irreducibleQ(q) === true) return q; } return de([1, 0, 1]); };

  /* ---------- generadores ---------- */
  gen.expr({
    id: 'w3.n3.factorizar-Q', nivel: '3.3', habilidades: ['3.3.factorizar'], dificultad: 3,
    hacer(rng) {
      const rs = rng.sample([-3, -2, -1, 1, 2, 3, 4], rng.int(1, 2)), q = quadIrr(rng), c = rng.chance(0.3) ? rng.pick([2, 3]) : 1, fs = rs.map(lin).concat([q]);
      const f = prod(c, fs), res = unir(c, fs);
      const junta = prod(c, rs.length === 2 ? [prod(1, rs.map(lin)), q] : [lin(rs[0]), q]);
      const mala = unir(c, [prod(1, rs.map(lin)), q]);
      return { key: px(f), enun: 'Factoriza completamente en $\\mathbb{Q}[x]$ el polinomio $p(x)=' + tx(f) + '$. Escribe un producto de factores irreducibles (usa $*$ entre factores).', res, vars: ['x'],
        verificador: { id: 'factorizacion', args: { f: px(f), campo: 'Q', v: 'x' } },
        firmas: rs.length === 2 ? [['sin-separar', mala, 'Falta separar el factor de grado 2 que tiene raíces racionales: sigue factorizando.'], ['expandido', px(f), 'Eso es el mismo polinomio sin factorizar: escribe un producto.']] : [['expandido', px(f), 'Eso es el mismo polinomio sin factorizar: escribe un producto.'], ['sin-factor-cuadratico', unir(c, rs.map(lin)), 'El producto no reproduce el polinomio: falta el factor irreducible de grado 2.']],
        pistas: ['Orientación: busca primero las raíces racionales de $p$.', 'Idea clave: cada raíz $a$ da un factor $(x-a)$; el cociente restante puede ser irreducible.', 'Primer paso: prueba con los candidatos $\\pm$ divisores del término independiente.'], expl: '$p(x)=' + (c !== 1 ? c : '') + fs.map(f => '(' + tx(f) + ')').join('') + '$.' };
    },
  });

  gen.eleccion({
    id: 'w3.n3.cual-irreducible', nivel: '3.3', habilidades: ['3.3.irreducibles'], dificultad: 3,
    hacer(rng) {
      const g = rng.pick([2, 3]);
      const irr = () => { for (let k = 0; k < 80; k++) { const c = Array.from({ length: g + 1 }, () => rng.int(-5, 6)); c[g] = 1; const p = de(c); if (c[0] !== 0 && P.irreducibleQ(p) === true) return p; } return null; };
      const conRaiz = () => { const a = rng.pick([-3, -2, -1, 1, 2, 3]), q = g === 2 ? lin(rng.pick([-4, -2, 1, 2, 5])) : de([rng.int(1, 4), rng.int(-2, 2), 1]); return P.mul(lin(a), q); };
      const ok = irr(), m1 = conRaiz(), m2 = conRaiz(), m3 = g === 2 ? de([-rng.pick([4, 9, 16]), 0, 1]) : P.mul(lin(rng.pick([-1, 2])), de([1, 0, 1]));
      if (!ok) return null;
      return { key: px(ok) + '|' + px(m1), enun: 'Solo uno de estos polinomios es irreducible en $\\mathbb{Q}[x]$. ¿Cuál?', ok: '$' + tx(ok) + '$',
        malas: [['tiene-raiz', '$' + tx(m1) + '$', 'Tiene una raíz racional, así que es divisible por $(x-a)$.'], ['tiene-raiz-2', '$' + tx(m2) + '$', 'Tiene una raíz racional, así que es divisible por $(x-a)$.'], ['tiene-raiz-3', '$' + tx(m3) + '$', 'Este polinomio se factoriza: busca su raíz racional.']],
        pistas: ['Orientación: en grado $2$ o $3$, irreducible equivale a no tener raíces racionales.', 'Idea clave: prueba los candidatos $\\pm$ divisores de $a_0$ sobre divisores de $a_n$.', 'Primer paso: calcula el término independiente de cada opción.'], expl: 'Solo $' + tx(ok) + '$ no tiene raíces racionales.' };
    },
  });

  gen.expr({
    id: 'w3.n3.mcd', nivel: '3.3', habilidades: ['3.3.mcd'], dificultad: 3,
    hacer(rng) {
      const g = P.mul(lin(rng.int(-3, 3)), rng.chance(0.5) ? lin(rng.pick([-2, 1, 4])) : de([1]));
      const a = de([rng.int(1, 3), 1]), b = de([-rng.int(1, 3), 1]); if (P.igual(a, b)) return null;
      const p = P.mul(g, a), q = P.mul(g, b), d = P.mcd(p, q);
      if (P.grado(d) < 1 || !P.igual(d, g)) return null;
      const doble = P.esc(d, Rat.of(2));
      return { key: px(p) + '|' + px(q), enun: 'Halla el máximo común divisor **mónico** de $p(x)=' + tx(p) + '$ y $q(x)=' + tx(q) + '$ usando el algoritmo de Euclides (o factorizando).', res: px(d), vars: ['x'],
        firmas: [['no-monico', px(doble), 'El mcd se toma mónico (coeficiente líder $1$).'], ['solo-un-factor', px(lin(Number(P.raicesRacionales(d)[0]))), 'Falta algún factor común: el mcd contiene todos los factores comunes.'], ['producto', px(P.mul(p, q)), 'Eso es un múltiplo común; el mcd divide a ambos.']].filter(f => f[1] !== px(d)),
        pistas: ['Orientación: aplica el algoritmo de Euclides: $\\operatorname{mcd}(p,q)=\\operatorname{mcd}(q,r)$ con $p=sq+r$.', 'Idea clave: sigue hasta que el resto sea $0$; el último resto no nulo (hecho mónico) es el mcd.', 'Primer paso: divide $p$ entre $q$ y calcula el resto.'], expl: 'El mcd mónico es $' + tx(d) + '$.' };
    },
  });

  const cstr = (re, im) => { const i = (Math.abs(im) === 1 ? '' : String(Math.abs(im))) + 'i'; return re === 0 ? (im < 0 ? '-' : '') + i : re + (im < 0 ? '-' : '+') + i; };
  gen.conjunto({
    id: 'w3.n3.raices-conjugadas', nivel: '3.3', habilidades: ['3.3.conjugadas'], dificultad: 3,
    hacer(rng) {
      const re = rng.int(-4, 4), im = rng.int(1, 5), real = rng.pick([-3, -2, -1, 1, 2, 3, 5]), z = cstr(re, im);
      return { key: re + ',' + im + ',' + real, enun: 'Un polinomio **de coeficientes reales** y grado $3$ tiene como raíces $' + real + '$ y $' + z + '$. Escribe el conjunto de sus tres raíces.', res: [String(real), z, cstr(re, -im)], norm: 'complejo',
        firmas: [['sin-conjugada', [String(real), z], 'Falta la tercera raíz: las no reales aparecen en pares conjugados.'], ['opuesta', [String(real), z, cstr(-re, -im)], 'La otra raíz es el **conjugado** (cambia solo el signo de la parte imaginaria), no el opuesto.']],
        pistas: ['Orientación: los coeficientes son reales.', 'Idea clave: si $z$ es raíz, también lo es $\\bar z$.', 'Primer paso: escribe el conjugado de la raíz no real.'], expl: 'Las raíces son $' + real + '$, $' + z + '$ y $' + cstr(re, -im) + '$.' };
    },
  });

  gen.expr({
    id: 'w3.n3.polinomio-conjugadas', nivel: '3.3', habilidades: ['3.3.conjugadas', '3.3.factorizar'], dificultad: 4,
    hacer(rng) {
      const a = rng.int(-3, 3), b = rng.int(1, 3), s = rng.pick([-2, -1, 1, 2, 3]);
      const q = de([a * a + b * b, -2 * a, 1]), p = P.mul(lin(s), q);
      const raiz = cstr(a, b);
      return { key: a + ',' + b + ',' + s, enun: 'Halla el polinomio **mónico de coeficientes reales** y menor grado que tiene como raíces $' + s + '$ y $' + raiz + '$. Escríbelo expandido.', res: px(p), vars: ['x'],
        firmas: [['sin-conjugada', px(P.mul(lin(s), de([a, 1]))), 'No tiene coeficientes reales: hay que incluir también la raíz conjugada.'], ['signo-parte-real', px(P.mul(lin(s), de([a * a + b * b, 2 * a, 1]))), 'El factor es $x^2-2a\\,x+(a^2+b^2)$ para la raíz $a\\pm bi$.']].filter(f => f[1] !== px(p)),
        pistas: ['Orientación: añade la raíz conjugada.', 'Idea clave: $(x-(a+bi))(x-(a-bi))=x^2-2ax+a^2+b^2$.', 'Primer paso: escribe el factor cuadrático real y multiplícalo por $(x-' + s + ')$.'], expl: '$p(x)=' + tx(p) + '$.' };
    },
  });

  gen.entero({
    id: 'w3.n3.contar-irreducibles', nivel: '3.3', habilidades: ['3.3.irreducibles'], dificultad: 3,
    hacer(rng) {
      const m = rng.int(2, 9), N = rng.int(4, 8);
      let ok = 0, igual = 0, pos = 0; for (let k = -N; k <= N; k++) { if (k * k < 4 * m) ok++; if (k * k <= 4 * m) igual++; if (k > 0 && k * k < 4 * m) pos++; }
      if (ok === igual) { /* sin diferencia con ≤: se acepta pero la firma se filtra sola */ }
      return { key: m + ',' + N, enun: '¿Para cuántos enteros $k$ con $-' + N + '\\le k\\le ' + N + '$ es $x^2+kx+' + m + '$ irreducible sobre $\\mathbb{R}$?', res: ok,
        firmas: [['con-igualdad', igual, 'Si $k^2=4m$ el discriminante es $0$: hay una raíz doble y el polinomio se factoriza.'], ['solo-positivos', pos, 'Los $k$ negativos también cuentan (el discriminante usa $k^2$).'], ['total', 2 * N + 1, 'No todos son irreducibles: exige $k^2<' + 4 * m + '$.']],
        pistas: ['Orientación: irreducible sobre $\\mathbb{R}$ equivale a discriminante negativo.', 'Idea clave: $k^2-4\\cdot' + m + '<0$ es decir $k^2<' + 4 * m + '$.', 'Primer paso: encuentra el mayor $|k|$ con $k^2<' + 4 * m + '$.'], expl: 'Hay $' + ok + '$ valores.' };
    },
  });

  /* ---------- demostraciones ---------- */
  dem2({
    id: 'dem.mcd-polinomios', teorema: 't.mcd-polinomios', nivel: '3.3', habilidades: ['3.3.mcd', '3.3.demostrar'], requiere: ['t.division-polinomios'], refsExtra: ['d.divisibilidad', 'd.mcd', 'b.doble-implicacion'],
    param: rng => ({ p: rng.pick(['p', 'f']), q: rng.pick(['q', 'g']), s: rng.pick(['s', 'c']), r: rng.pick(['r', 'u']), d: rng.pick(['d', 'h']) }),
    enunciado: p => r`Sean $${p.p}=${p.s}${p.q}+${p.r}$ polinomios. Demuestra que $${p.p}$ y $${p.q}$ tienen los mismos divisores comunes que $${p.q}$ y $${p.r}$, y concluye que $\operatorname{mcd}(${p.p},${p.q})=\operatorname{mcd}(${p.q},${p.r})$.`,
    hip: p => [r`$${p.p}=${p.s}${p.q}+${p.r}$`, 'Puedes usar la definición de divisibilidad'], meta: p => r`$\operatorname{mcd}(${p.p},${p.q})=\operatorname{mcd}(${p.q},${p.r})$`,
    L: p => [
      ['L1', r`Sea $${p.d}$ un divisor común de $${p.p}$ y $${p.q}$: $${p.p}=${p.d}a$ y $${p.q}=${p.d}b$.`, 'd.divisibilidad'],
      ['L2', r`Entonces $${p.r}=${p.p}-${p.s}${p.q}=${p.d}(a-${p.s}b)$, así que $${p.d}\mid ${p.r}$ y $${p.d}$ divide a $${p.q}$ y a $${p.r}$.`, 'd.divisibilidad', ['L1']],
      ['L3', r`Recíprocamente, si $${p.d}\mid ${p.q}$ y $${p.d}\mid ${p.r}$, de ⟦h1⟧ se sigue que $${p.d}\mid ${p.p}$.`, 'd.divisibilidad', ['L2'], [H('h1', r`$${p.p}=${p.s}${p.q}+${p.r}$`, [r`$${p.p}=${p.s}${p.q}+${p.r}$`, r`$${p.q}=${p.s}${p.p}+${p.r}$`, r`$${p.r}=${p.s}${p.p}+${p.q}$`], false)]],
      ['L4', r`Ambos pares tienen los mismos divisores comunes, luego el de mayor grado (hecho mónico) es el mismo: los mcd coinciden. ∎`, 'd.mcd', ['L2', 'L3']],
    ],
    dist: p => [[r`Con $${p.p}=x^2-1$, $${p.q}=x-1$, $${p.r}=0$ el mcd es $x-1$; luego el resultado vale siempre.`, 'un ejemplo no prueba el caso general'], [r`Como $${p.p}$ es mayor que $${p.q}$, su mcd es $${p.q}$.`, 'el mcd no es el menor de los dos en general']],
    err: p => [['L2', r`Entonces $${p.r}=${p.p}+${p.s}${p.q}=${p.d}(a+${p.s}b)$.`, 'error-de-calculo', 'De $p=sq+r$ se despeja $r=p-sq$.'], ['L3', r`Recíprocamente, si $${p.d}\mid ${p.q}$, entonces $${p.d}\mid ${p.p}$.`, 'conclusion-invalida', 'Hay que usar también que $d\\mid r$.']],
    valida: [['doble-inclusion', r`Probar que los divisores comunes de $(p,q)$ y de $(q,r)$ coinciden`, 'Es la prueba estándar.']],
    idea: p => r`si $${p.d}$ divide a dos de los tres, divide al tercero por $${p.p}=${p.s}${p.q}+${p.r}$.`, primero: p => r`toma un divisor común de $${p.p}$ y $${p.q}$.`,
  });

  dem2({
    id: 'dem.cuadratica-irreducible', teorema: 't.cuadratica-irreducible', nivel: '3.3', habilidades: ['3.3.irreducibles', '3.3.demostrar'], requiere: ['t.teorema-factor'], refsExtra: ['d.irreducible', 'd.raiz', 'b.contradiccion'],
    param: rng => ({ b: rng.pick(['b', 'p']), c: rng.pick(['c', 'q']), a: rng.pick(['a', 't']) }),
    enunciado: p => r`Demuestra que si $${p.b}^2-4${p.c}<0$, el polinomio $x^2+${p.b}x+${p.c}$ es irreducible sobre $\mathbb{R}$.`,
    hip: p => [r`$${p.b},${p.c}\in\mathbb{R}$ y $${p.b}^2-4${p.c}<0$`, 'Puedes citar el teorema del factor'], meta: p => r`$x^2+${p.b}x+${p.c}$ es irreducible sobre $\mathbb{R}$`,
    L: p => [
      ['L1', r`Supongamos por reducción al absurdo que se factoriza: tendría un factor de grado $1$ (los grados suman $2$).`, 'b.contradiccion'],
      ['L2', r`Un factor lineal $x-${p.a}$ implica, por el teorema del factor, que $${p.a}$ es una raíz real.`, 't.teorema-factor', ['L1']],
      ['L3', r`Completando el cuadrado, $x^2+${p.b}x+${p.c}=(x+\tfrac{${p.b}}{2})^2-\tfrac{${p.b}^2-4${p.c}}{4}$; evaluado en $${p.a}$ y por L2 da $(${p.a}+\tfrac{${p.b}}{2})^2=\tfrac{${p.b}^2-4${p.c}}{4}$.`, 'b.cuerpo-algebra', ['L2']],
      ['L4', r`El miembro izquierdo es ⟦h1⟧ y el derecho es negativo: contradicción. Por tanto es irreducible. ∎`, 'b.contradiccion', ['L3'], [H('h1', r`no negativo (un cuadrado real)`, [r`no negativo (un cuadrado real)`, r`siempre positivo`, r`siempre cero`], false)]],
    ],
    dist: p => [[r`Con $x^2+1$ no hay raíces reales; luego todo polinomio de grado $2$ es irreducible.`, 'un ejemplo no prueba el caso general'], [r`Como $${p.b}^2-4${p.c}<0$, el polinomio no tiene coeficientes reales.`, 'no se sigue: es el discriminante, no los coeficientes']],
    err: p => [['L3', r`Completando el cuadrado, $x^2+${p.b}x+${p.c}=(x+${p.b})^2-(${p.b}^2-4${p.c})$.`, 'error-de-calculo', 'El cuadrado se completa con $b/2$.'], ['L4', r`El miembro izquierdo es un cuadrado negativo y el derecho también.`, 'conclusion-invalida', 'Un cuadrado real nunca es negativo.']],
    valida: [['absurdo', r`Suponer una raíz real y completar el cuadrado`, 'Es la prueba estándar.'], ['formula', r`Usar la fórmula cuadrática para ver que no hay raíces reales`, 'Válida: sin raíces reales no hay factor lineal real.']],
    idea: p => r`un factor lineal daría una raíz real; completa el cuadrado.`, primero: p => r`supón que tiene un factor lineal.`,
  });

  dem2({
    id: 'dem.cubica-irreducible', teorema: 't.cubica-irreducible', nivel: '3.3', habilidades: ['3.3.irreducibles', '3.3.demostrar'], requiere: ['t.teorema-factor', 't.grado-producto'], refsExtra: ['d.irreducible', 'd.raiz', 'b.doble-implicacion'],
    param: rng => ({ p: rng.pick(['p', 'f']), a: rng.pick(['a', 'c']), q: rng.pick(['q', 'h']) }),
    enunciado: p => r`Demuestra que un polinomio $${p.p}\in\mathbb{Q}[x]$ de grado $3$ es reducible sobre $\mathbb{Q}$ si y solo si tiene una raíz racional.`,
    hip: p => [r`$${p.p}\in\mathbb{Q}[x]$, $\operatorname{gr}${p.p}=3$`, 'Puedes citar el teorema del factor y el grado de un producto'], meta: p => r`$${p.p}$ reducible $\iff$ tiene una raíz en $\mathbb{Q}$`,
    L: p => [
      ['L1', r`(⇐) Si $${p.a}\in\mathbb{Q}$ es una raíz, por el teorema del factor $${p.p}=(x-${p.a})${p.q}$ con $\operatorname{gr}${p.q}=2$: es producto de dos polinomios no constantes.`, 't.teorema-factor'],
      ['L2', r`(⇒) Si $${p.p}=uv$ con $u,v$ no constantes, por el grado de un producto $\operatorname{gr}u+\operatorname{gr}v=3$.`, 't.grado-producto'],
      ['L3', r`Como ambos grados son $\ge 1$, uno de ellos vale ⟦h1⟧: digamos $u=\alpha x+\beta$ con $\alpha\neq 0$.`, 'b.casos', ['L2'], [H('h1', '1', ['1', '2', '3'], false)]],
      ['L4', r`Entonces $${p.a}=-\beta/\alpha\in\mathbb{Q}$ cumple $${p.p}(${p.a})=u(${p.a})v(${p.a})=0$: es una raíz racional. ∎`, 'd.raiz', ['L3']],
    ],
    dist: p => [[r`El polinomio $x^3-2$ no tiene raíces racionales; luego todo cúbico es irreducible.`, 'un ejemplo no prueba el caso general'], [r`Como el grado es $3$ impar, tiene una raíz racional.`, 'tiene raíz real, no necesariamente racional']],
    err: p => [['L1', r`(⇐) Si $${p.a}$ es una raíz, $${p.p}=(x+${p.a})${p.q}$.`, 'error-de-calculo', 'El factor es $x-a$.'], ['L4', r`Entonces $${p.a}=\beta/\alpha$ cumple $${p.p}(${p.a})=0$.`, 'error-de-calculo', 'La raíz de $\\alpha x+\\beta$ es $-\\beta/\\alpha$.']],
    valida: [['doble', r`Probar las dos implicaciones por separado con el teorema del factor`, 'Es la prueba estándar.']],
    idea: p => r`reducible implica un factor de grado $1$, y este da una raíz.`, primero: p => r`prueba (⇐) con el teorema del factor.`,
  });

  dem2({
    id: 'dem.conjugadas', teorema: 't.conjugadas', nivel: '3.3', habilidades: ['3.3.conjugadas', '3.3.demostrar'], requiere: ['t.conj-producto'], refsExtra: ['d.conjugado', 'd.raiz', 'b.arbitrario'],
    param: rng => ({ z: rng.pick(['z', 'w']), a: rng.pick(['a', 'c']), n: rng.pick(['n', 'm']) }),
    enunciado: p => r`Sea $p(x)=${p.a}_${p.n}x^${p.n}+\cdots+${p.a}_0$ con coeficientes reales. Demuestra que si $p(${p.z})=0$ con $${p.z}\in\mathbb{C}$, entonces $p(\overline{${p.z}})=0$.`,
    hip: p => [r`$${p.a}_k\in\mathbb{R}$ para todo $k$`, r`$p(${p.z})=0$`, 'Puedes usar que el conjugado respeta sumas y productos'], meta: p => r`$p(\overline{${p.z}})=0$`,
    L: p => [
      ['L1', r`Como $${p.a}_k$ es real, $\overline{${p.a}_k}=${p.a}_k$.`, 'd.conjugado'],
      ['L2', r`Por el conjugado de un producto y de una suma, $\overline{p(${p.z})}=\sum \overline{${p.a}_k}\,\overline{${p.z}}^{\,k}$.`, 't.conj-producto', ['L1']],
      ['L3', r`Usando L1, $\overline{p(${p.z})}=\sum ${p.a}_k\,\overline{${p.z}}^{\,k}=p(\overline{${p.z}})$.`, 'd.conjugado', ['L2']],
      ['L4', r`Como $p(${p.z})=0$ y ⟦h1⟧, concluimos $p(\overline{${p.z}})=\overline{0}=0$. ∎`, 'd.conjugado', ['L3'], [H('h1', r`$\overline{0}=0$`, [r`$\overline{0}=0$`, r`$\overline{0}=1$`, r`$\overline{0}=i$`], false)]],
    ],
    dist: p => [[r`Con $x^2+1$ y $${p.z}=i$ se cumple; luego vale para todos.`, 'un ejemplo no prueba el caso general'], [r`Si $${p.z}$ es raíz, también lo es $-${p.z}$.`, 'es falso en general: solo vale el conjugado, y solo con coeficientes reales']],
    err: p => [['L1', r`Como $${p.a}_k$ es real, $\overline{${p.a}_k}=-${p.a}_k$.`, 'error-de-calculo', 'Un real es igual a su conjugado.'], ['L3', r`Usando L1, $\overline{p(${p.z})}=\sum ${p.a}_k\,${p.z}^{k}=p(${p.z})$.`, 'conclusion-invalida', 'Queda el conjugado de $z$ en cada potencia.']],
    valida: [['directa', r`Calcular $\overline{p(z)}$ término a término`, 'Es la prueba estándar.']],
    idea: p => r`conjuga $p(${p.z})$ término a término: los coeficientes reales no cambian.`, primero: p => r`usa que los $${p.a}_k$ son reales.`,
  });

  R.nivel({
    id: '3.3', mundo: 3, titulo: 'Factorización', tema: 'Polinomios irreducibles, mcd y raíces conjugadas',
    habilidades: ['3.3.factorizar', '3.3.irreducibles', '3.3.mcd', '3.3.conjugadas', '3.3.demostrar'],
    teoremas: ['t.mcd-polinomios', 't.cuadratica-irreducible', 't.cubica-irreducible', 't.conjugadas'],
    leccion: {
      intro: 'Un polinomio es **irreducible** si no se puede escribir como producto de dos polinomios de menor grado. Factorizar es descomponerlo en irreducibles; qué factores son irreducibles depende del cuerpo.',
      definiciones: [
        { nombre: 'Irreducibles según el cuerpo', tex: 'Sobre $\\mathbb{C}$ solo son irreducibles los de grado $1$. Sobre $\\mathbb{R}$, los de grado $1$ y los cuadráticos con discriminante $<0$. Sobre $\\mathbb{Q}$ hay irreducibles de todos los grados.' },
        { nombre: 'Grados 2 y 3', tex: 'Un polinomio de grado $2$ o $3$ sobre $\\mathbb{Q}$ es irreducible si y solo si **no tiene raíces racionales** (un factor propio tendría grado $1$).' },
        { nombre: 'mcd de polinomios', tex: 'Se calcula con el algoritmo de Euclides: $\\operatorname{mcd}(p,q)=\\operatorname{mcd}(q,r)$ con $p=sq+r$. El mcd se toma **mónico**.' },
        { nombre: 'Conjugadas', tex: 'Si $p$ tiene coeficientes reales y $z$ es raíz, también lo es $\\bar z$. Por eso las raíces no reales vienen en pares y $(x-z)(x-\\bar z)=x^2-2\\operatorname{Re}(z)x+|z|^2$ es real.' },
      ],
      teorema: 't.cubica-irreducible',
      ejemplo: { enunciado: 'Factoriza completamente $x^3-x^2+x-1$ sobre $\\mathbb{Q}$.', pasos: ['Candidatos a raíz: $\\pm1$. $p(1)=1-1+1-1=0$: $x-1$ es factor.', 'Dividiendo: $x^3-x^2+x-1=(x-1)(x^2+1)$.', '$x^2+1$ no tiene raíces racionales (de hecho ni reales): es irreducible. Resultado: $(x-1)(x^2+1)$.'] },
    },
  });

  if (typeof module !== 'undefined') module.exports = AC;
})(globalThis.AC = globalThis.AC || {});
