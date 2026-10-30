/* Mundo 3 — Jefe: «El Fundidor de Raíces». Sus demostraciones exigen citar teoremas ganados en niveles anteriores. */
(function (AC) {
  const { R, H, T, gen, dem2 } = AC.cont, r = String.raw;
  R.jefe(3, { id: 'J3', titulo: 'El Fundidor de Raíces', estrategia: 'w3.jefe.estrategia', demos: ['dem.jefe-cubica-irreducible', 'dem.jefe-conjugada-cuadratico', 'dem.jefe-tercera-raiz'] });
  const J = { nivel: 'J3', mundo: 3, habilidades: [] };

  /* ---------- fase de estrategia: ¿qué herramienta del Mundo 3? ---------- */
  const MET = ['Teorema del resto o de Horner', 'Teorema del factor y raíces racionales', 'Irreducibilidad (grados 2 y 3)', 'Raíces complejas conjugadas', 'Relaciones de Vieta', 'Algoritmo de Euclides para polinomios'];
  const RAZON = ['Se pide el resto de una división entre $x-a$, o evaluar rápidamente.', 'Se buscan raíces racionales o se quiere factorizar a partir de una raíz.', 'Se pregunta si un polinomio de grado $2$ o $3$ se puede factorizar.', 'Hay una raíz compleja y coeficientes reales: la conjugada también es raíz.', 'Se piden sumas o productos de raíces sin resolver la ecuación.', 'Se pide el máximo común divisor de dos polinomios.'];
  const CLAIMS = [
    ['Hallar el resto de dividir $x^{20}-3x+5$ entre $x-1$.', 0], ['Calcular $p(2)$ para $p(x)=x^4-3x^3+2x-7$ con pocas operaciones.', 0], ['Hallar el resto de dividir $x^3+x+1$ entre $x+2$.', 0],
    ['Hallar todas las raíces racionales de $2x^3-3x^2-3x+2$.', 1], ['Factorizar $x^3-6x^2+11x-6$.', 1], ['Probar que $x-3$ divide a $x^3-27$.', 1],
    ['Decidir si $x^3-x-1$ es irreducible sobre $\\mathbb{Q}$.', 2], ['Decidir si $x^2+x+1$ se factoriza sobre $\\mathbb{R}$.', 2], ['Decidir si $x^3+2x+2$ es irreducible sobre $\\mathbb{Q}$.', 2],
    ['Un polinomio real tiene la raíz $1+2i$; ¿qué otra raíz debe tener?', 3], ['Construir el polinomio real mónico de menor grado con raíz $2-i$.', 3], ['Un cúbico real tiene la raíz $3i$; ¿cuántas raíces reales tiene?', 3],
    ['Hallar $x_1^2+x_2^2$ si $x_1,x_2$ son raíces de $x^2-5x+3$.', 4], ['Hallar el producto de las raíces de $2x^3-4x^2+x-6$.', 4], ['Hallar $k$ si la suma de las raíces de $x^2-kx+9$ es $10$.', 4],
    ['Hallar el mcd de $x^3-x$ y $x^2-3x+2$.', 5], ['Hallar el mcd de $x^2-4$ y $x^3-8$.', 5], ['Simplificar $\\dfrac{x^2-1}{x^2+x-2}$ hallando un factor común.', 5],
  ];
  gen.eleccion({
    id: 'w3.jefe.estrategia', nivel: 'J3', mundo: 3, habilidades: [], dificultad: 2, confianza: false,
    hacer(rng) {
      const [txt, t] = rng.pick(CLAIMS), otros = rng.sample([0, 1, 2, 3, 4, 5].filter(x => x !== t), 3);
      return { key: txt + '|' + otros.join(''), enun: 'Tienes que resolver: «' + txt + '» ¿Qué herramienta del Mundo 3 es la más adecuada?', ok: MET[t],
        malas: otros.map(m => ['metodo-' + m, MET[m], 'No es la más directa aquí. ' + 'En este problema: ' + RAZON[t]]),
        pistas: ['Orientación: fíjate en lo que se pide: un resto, raíces, irreducibilidad, una raíz compleja, sumas de raíces o un mcd.', 'Idea clave: cada herramienta del mundo responde a un tipo de pregunta.', 'Primer paso: identifica los datos del problema (grado, coeficientes, raíces conocidas).'], expl: 'La herramienta más adecuada es: ' + MET[t] + '. ' + RAZON[t] };
    },
  });

  /* ---------- fase de demostración ---------- */
  dem2(Object.assign({
    id: 'dem.jefe-cubica-irreducible', enunciadoId: 'jefe.cubica-irreducible', requiere: ['t.raices-racionales', 't.cubica-irreducible'], refsExtra: ['d.raiz', 'd.irreducible'],
    param: rng => ({ m: rng.pick([3, 5, 7]) }),
    enunciado: p => r`Demuestra que $x^3-${p.m}$ es irreducible sobre $\mathbb{Q}$.`,
    hip: p => [r`$${p.m}$ es primo`, 'Puedes citar el teorema de las raíces racionales y el de cúbicas irreducibles'], meta: p => r`$x^3-${p.m}$ es irreducible sobre $\mathbb{Q}$`,
    L: p => [
      ['L1', r`Si $\frac{u}{v}$ (irreducible) es raíz racional de $x^3-${p.m}$, por el teorema de las raíces racionales $u\mid ${p.m}$ y $v\mid 1$.`, 't.raices-racionales'],
      ['L2', r`Como $${p.m}$ es primo, los candidatos son $\pm1$ y $\pm ${p.m}$.`, 'd.primo', ['L1']],
      ['L3', r`Evaluando: $p(1)=1-${p.m}\neq0$, $p(-1)=-1-${p.m}\neq0$, $p(${p.m})=${p.m}^3-${p.m}\neq0$ y $p(-${p.m})=-${p.m}^3-${p.m}\neq0$ (⟦h1⟧).`, 'd.raiz', ['L2'], [H('h1', r`porque $${p.m}>1$`, [r`porque $${p.m}>1$`, r`porque $${p.m}$ es par`, r`porque $p$ es mónico`], false)]],
      ['L4', r`Luego $x^3-${p.m}$ no tiene raíces racionales y, al tener grado $3$, es irreducible por el teorema de las cúbicas irreducibles. ∎`, 't.cubica-irreducible', ['L3']],
    ],
    dist: p => [[r`Como $\sqrt[3]{${p.m}}$ es irracional, el polinomio es irreducible.`, 'no basta: hay que descartar factores, y se hace con las raíces racionales'], [r`Probamos $x=1$ y $x=2$ y no son raíces; entonces es irreducible.`, 'faltan candidatos: hay que probarlos todos']],
    err: p => [['L1', r`Por el teorema de las raíces racionales $u\mid 1$ y $v\mid ${p.m}$.`, 'conclusion-invalida', 'El numerador divide al término independiente y el denominador al coeficiente líder.'], ['L4', r`Luego no tiene raíces racionales y por tanto es reducible.`, 'conclusion-invalida', 'Sin raíces racionales, un cúbico es **irreducible**.']],
    valida: [['racionales', r`Descartar todos los candidatos racionales y usar que un cúbico sin raíces es irreducible`, 'Es la prueba estándar.']],
    idea: p => r`lista los candidatos $\pm$ divisores de $${p.m}$ y evalúa.`, primero: p => r`aplica el teorema de las raíces racionales.`,
  }, J));

  dem2(Object.assign({
    id: 'dem.jefe-conjugada-cuadratico', enunciadoId: 'jefe.conjugada-cuadratico', requiere: ['t.conjugadas', 't.teorema-factor'], refsExtra: ['d.conjugado', 'd.raiz'],
    param: rng => ({ z: rng.pick(['z', 'w']), a: rng.pick(['a', 'c']), b: rng.pick(['b', 'e']), p: rng.pick(['p', 'f']) }),
    enunciado: p => r`Sea $${p.p}$ un polinomio de coeficientes reales con una raíz $${p.z}=${p.a}+${p.b}i$, $${p.b}\neq0$ real. Demuestra que $x^2-2${p.a}x+${p.a}^2+${p.b}^2$ divide a $${p.p}$.`,
    hip: p => [r`$${p.p}\in\mathbb{R}[x]$, $${p.p}(${p.z})=0$ y $${p.z}=${p.a}+${p.b}i$ con $${p.b}\neq 0$`, 'Puedes citar el teorema de las conjugadas y el del factor'], meta: p => r`$x^2-2${p.a}x+${p.a}^2+${p.b}^2\mid ${p.p}$`,
    L: p => [
      ['L1', r`Como los coeficientes son reales y $${p.p}(${p.z})=0$, por el teorema de las conjugadas $${p.p}(\overline{${p.z}})=0$.`, 't.conjugadas'],
      ['L2', r`Como $${p.b}\neq 0$, $${p.z}\neq\overline{${p.z}}$: son dos raíces distintas.`, 'd.conjugado', ['L1']],
      ['L3', r`Por el teorema del factor, $(x-${p.z})\mid ${p.p}$; si $${p.p}=(x-${p.z})q$, entonces $q(\overline{${p.z}})=0$ porque ⟦h1⟧.`, 't.teorema-factor', ['L2'], [H('h1', r`$\overline{${p.z}}-${p.z}\neq0$`, [r`$\overline{${p.z}}-${p.z}\neq0$`, r`$\overline{${p.z}}=${p.z}$`, r`$q=0$`], false)]],
      ['L4', r`Otra vez por el teorema del factor $(x-\overline{${p.z}})\mid q$, así que $(x-${p.z})(x-\overline{${p.z}})\mid ${p.p}$.`, 't.teorema-factor', ['L3']],
      ['L5', r`Y $(x-${p.z})(x-\overline{${p.z}})=x^2-2${p.a}x+${p.a}^2+${p.b}^2$. ∎`, 'd.conjugado', ['L4']],
    ],
    dist: p => [[r`Con $${p.p}=x^2+1$ y $${p.z}=i$ se cumple; luego siempre.`, 'un ejemplo no prueba el caso general'], [r`Como $${p.z}$ es raíz, $x-${p.z}$ divide a $${p.p}$, y eso ya da el cuadrático.`, 'falta la conjugada: $x-z$ no tiene coeficientes reales']],
    err: p => [['L2', r`Como $${p.b}\neq 0$, $${p.z}=\overline{${p.z}}$.`, 'conclusion-invalida', 'Un complejo con parte imaginaria no nula **no** es igual a su conjugado.'], ['L5', r`Y $(x-${p.z})(x-\overline{${p.z}})=x^2+2${p.a}x+${p.a}^2+${p.b}^2$.`, 'error-de-calculo', 'La suma de las raíces es $2a$, así que el coeficiente de $x$ es $-2a$.']],
    valida: [['dos-factores', r`Usar el teorema del factor con $z$ y con $\bar z$ (distintas)`, 'Es la prueba estándar.']],
    idea: p => r`$\overline{${p.z}}$ también es raíz; extrae los dos factores.`, primero: p => r`aplica el teorema de las conjugadas.`,
  }, J));

  dem2(Object.assign({
    id: 'dem.jefe-tercera-raiz', enunciadoId: 'jefe.tercera-raiz', requiere: ['t.vieta-cubica', 't.conjugadas'], refsExtra: ['d.conjugado', 'd.raiz'],
    param: rng => ({ z: rng.pick(['z', 'w']), b: rng.pick(['b', 'p']), c: rng.pick(['c', 'q']), d: rng.pick(['d', 's']) }),
    enunciado: p => r`Sea $x^3+${p.b}x^2+${p.c}x+${p.d}$ con coeficientes reales y una raíz no real $${p.z}$. Demuestra que su tercera raíz es real y vale $-${p.b}-2\operatorname{Re}${p.z}$.`,
    hip: p => [r`coeficientes reales y una raíz $${p.z}\notin\mathbb{R}$`, 'Puedes citar el teorema de las conjugadas y las relaciones de Vieta'], meta: p => r`la tercera raíz es $-${p.b}-2\operatorname{Re}${p.z}$`,
    L: p => [
      ['L1', r`Por el teorema de las conjugadas, $\overline{${p.z}}$ también es raíz y $\overline{${p.z}}\neq ${p.z}$ (si $${p.z}\notin\mathbb{R}$).`, 't.conjugadas'],
      ['L2', r`Sean $${p.z}$, $\overline{${p.z}}$ y $x_3$ las tres raíces. Por Vieta, $${p.z}+\overline{${p.z}}+x_3=-${p.b}$.`, 't.vieta-cubica', ['L1']],
      ['L3', r`Como $${p.z}+\overline{${p.z}}=2\operatorname{Re}${p.z}$, despejando $x_3=-${p.b}-2\operatorname{Re}${p.z}$.`, 'd.conjugado', ['L2']],
      ['L4', r`Y $x_3$ es real porque ⟦h1⟧. ∎`, 'b.cuerpo-algebra', ['L3'], [H('h1', r`$${p.b}$ y $\operatorname{Re}${p.z}$ son reales`, [r`$${p.b}$ y $\operatorname{Re}${p.z}$ son reales`, r`$x_3$ es la conjugada de $${p.z}$`, r`$x_3=0$`], false)]],
    ],
    dist: p => [[r`Con $x^3-x^2+x-1$, raíces $1,i,-i$: la tercera es $1$ y se cumple; luego siempre.`, 'un ejemplo no prueba el caso general'], [r`La tercera raíz es $\overline{${p.z}}$.`, 'la conjugada ya es la **segunda** raíz']],
    err: p => [['L2', r`Por Vieta, $${p.z}+\overline{${p.z}}+x_3=${p.b}$.`, 'error-de-calculo', 'La suma de las raíces es $-b$ para un cúbico mónico.'], ['L3', r`Como $${p.z}+\overline{${p.z}}=\operatorname{Re}${p.z}$, queda $x_3=-${p.b}-\operatorname{Re}${p.z}$.`, 'error-de-calculo', '$z+\\bar z=2\\operatorname{Re}z$.']],
    valida: [['vieta-conjugadas', r`Conjugada como segunda raíz y suma de Vieta`, 'Es la prueba estándar.']],
    idea: p => r`las raíces son $${p.z}$, $\overline{${p.z}}$ y una tercera; usa la suma de Vieta.`, primero: p => r`aplica el teorema de las conjugadas.`,
  }, J));

  if (typeof module !== 'undefined') module.exports = AC;
})(globalThis.AC = globalThis.AC || {});
