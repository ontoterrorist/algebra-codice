/* Mundo 4 — Jefe: «La Tejedora de Matrices». Sus demostraciones exigen citar teoremas ganados en niveles anteriores. */
(function (AC) {
  const { R, H, T, gen, dem2 } = AC.cont, r = String.raw;
  R.jefe(4, { id: 'J4', titulo: 'La Tejedora de Matrices', estrategia: 'w4.jefe.estrategia', demos: ['dem.jefe-transpuesta-inversa', 'dem.jefe-nilpotente', 'dem.jefe-det-inversa'] });
  const J = { nivel: 'J4', mundo: 4, habilidades: [] };

  /* ---------- fase de estrategia: ¿qué herramienta del Mundo 4? ---------- */
  const MET = ['Eliminación gaussiana (escalonar)', 'Inversa por $(A\\mid I)$', 'Rango y Rouché-Capelli', 'Determinante o regla de Cramer', 'Propiedades del producto, la transpuesta y la inversa', 'Solución particular más homogénea'];
  const RAZON = ['Hay que resolver un sistema o llevar una matriz a forma escalonada.', 'Se pide la inversa de una matriz o resolver con ella.', 'Se pregunta si un sistema tiene solución, cuántas soluciones o cuántas variables libres.', 'Se pregunta por invertibilidad, áreas, volúmenes o un parámetro que anula el determinante.', 'Se simplifica una expresión con productos, transpuestas e inversas sin calcular entradas.', 'Se describe el conjunto de todas las soluciones de un sistema compatible.'];
  const CLAIMS = [
    ['Resolver $\\begin{cases}x+y+z=6\\\\2x-y+z=3\\\\x+2y-z=2\\end{cases}$.', 0], ['Llevar una matriz $3\\times4$ a su forma escalonada reducida.', 0], ['Hallar el valor de $z$ en un sistema $3\\times3$ con solución única.', 0],
    ['Hallar $A^{-1}$ para una matriz $3\\times3$ con entradas enteras.', 1], ['Resolver $Ax=b$ varias veces con el mismo $A$ y distintos $b$.', 1], ['Calcular la inversa de $\\begin{pmatrix}2&1\\\\5&3\\end{pmatrix}$.', 1],
    ['¿Cuántas soluciones tiene un sistema con $\\operatorname{rango}A=2$ y $\\operatorname{rango}(A\\mid b)=3$?', 2], ['¿Cuántos parámetros libres tiene $Ax=0$ si $A$ es $4\\times6$ de rango $3$?', 2], ['Decidir si $x+y=1,\\ x+y=2$ tiene solución.', 2],
    ['Hallar los valores de $k$ que hacen singular una matriz $3\\times3$.', 3], ['Hallar el área del paralelogramo generado por $(2,1)$ y $(1,3)$.', 3], ['Resolver $2\\times2$ con la fórmula $x=\\det A_1/\\det A$.', 3],
    ['Simplificar $(AB)^{-1}(AB)^T$ cuando $A,B$ son invertibles.', 4], ['Demostrar que $(A^{-1})^T=(A^T)^{-1}$.', 4], ['Calcular $\\det(2A^{-1}B^T)$ conociendo $\\det A$ y $\\det B$.', 4],
    ['Describir todas las soluciones de $x+y+z=3$.', 5], ['Dada una solución $x_p$ de $Ax=b$ y una base de $\\{Ax=0\\}$, escribir todas las soluciones.', 5], ['Si $u$ y $v$ resuelven $Ax=b$, ¿qué sistema resuelve $u-v$?', 5],
  ];
  gen.eleccion({
    id: 'w4.jefe.estrategia', nivel: 'J4', mundo: 4, habilidades: [], dificultad: 2, confianza: false,
    hacer(rng) {
      const [txt, t] = rng.pick(CLAIMS), otros = rng.sample([0, 1, 2, 3, 4, 5].filter(x => x !== t), 3);
      return { key: txt + '|' + otros.join(''), enun: 'Tienes que resolver: «' + txt + '» ¿Qué herramienta del Mundo 4 es la más adecuada?', ok: MET[t],
        malas: otros.map(m => ['metodo-' + m, MET[m], 'No es la más directa aquí. En este problema: ' + RAZON[t]]),
        pistas: ['Orientación: fíjate en lo que se pide: resolver, invertir, contar soluciones, un determinante, simplificar o describir un conjunto.', 'Idea clave: cada herramienta del mundo responde a un tipo de pregunta.', 'Primer paso: identifica los datos (matriz, sistema, rangos).'], expl: 'La herramienta más adecuada es: ' + MET[t] + '. ' + RAZON[t] };
    },
  });

  /* ---------- fase de demostración ---------- */
  dem2(Object.assign({
    id: 'dem.jefe-transpuesta-inversa', enunciadoId: 'jefe.transpuesta-inversa', requiere: ['t.mat-transpuesta-producto', 't.mat-inversa-unica'], refsExtra: ['d.matriz-inversa', 'd.matriz-transpuesta'],
    param: rng => ({ a: rng.pick(['A', 'P']) }),
    enunciado: p => r`Demuestra que si $${p.a}$ es invertible, entonces $${p.a}^T$ es invertible y $(${p.a}^T)^{-1}=(${p.a}^{-1})^T$.`,
    hip: p => [r`$${p.a}$ es invertible`, 'Puedes citar la transpuesta de un producto y la unicidad de la inversa'], meta: p => r`$(${p.a}^T)^{-1}=(${p.a}^{-1})^T$`,
    L: p => [
      ['L1', r`Sea $B=(${p.a}^{-1})^T$. Calculamos $${p.a}^TB=${p.a}^T(${p.a}^{-1})^T$.`, 'd.matriz-transpuesta'],
      ['L2', r`Por la transpuesta de un producto, $${p.a}^T(${p.a}^{-1})^T=(${p.a}^{-1}${p.a})^T$.`, 't.mat-transpuesta-producto', ['L1']],
      ['L3', r`Como $${p.a}^{-1}${p.a}=I$ y $I^T=I$, resulta $${p.a}^TB=I$.`, 'd.matriz-inversa', ['L2']],
      ['L4', r`Análogamente $B${p.a}^T=(${p.a}^{-1})^T${p.a}^T=(${p.a}${p.a}^{-1})^T=I^T=I$.`, 't.mat-transpuesta-producto', ['L3']],
      ['L5', r`Luego $B$ es una inversa de $${p.a}^T$ y, por la ⟦h1⟧ de la inversa, es **la** inversa: $(${p.a}^T)^{-1}=(${p.a}^{-1})^T$. ∎`, 't.mat-inversa-unica', ['L3', 'L4'], [H('h1', 'unicidad', ['unicidad', 'existencia', 'simetría'], false)]],
    ],
    dist: p => [[r`Con $${p.a}=\begin{pmatrix}1&1\\0&1\end{pmatrix}$ la igualdad se verifica; luego siempre.`, 'un ejemplo no prueba el caso general'], [r`Trasponer e invertir son operaciones distintas, así que no pueden coincidir.`, 'justamente se prueba que conmutan']],
    err: p => [['L2', r`Por la transpuesta de un producto, $${p.a}^T(${p.a}^{-1})^T=(${p.a}${p.a}^{-1})^T$.`, 'error-de-calculo', 'La transpuesta **invierte el orden**: sale $(A^{-1}A)^T$.'], ['L3', r`Como $${p.a}^{-1}${p.a}=I$ y $I^T=0$, resulta $${p.a}^TB=0$.`, 'error-de-calculo', '$I^T=I$.']],
    valida: [['multiplicar', r`Probar que $(A^{-1})^T$ multiplica a $A^T$ dando $I$ por ambos lados y usar unicidad`, 'Es la prueba estándar.']],
    idea: p => r`$${p.a}^T(${p.a}^{-1})^T=(${p.a}^{-1}${p.a})^T=I$.`, primero: p => r`multiplica $${p.a}^T$ por $(${p.a}^{-1})^T$.`,
  }, J));

  dem2(Object.assign({
    id: 'dem.jefe-nilpotente', enunciadoId: 'jefe.nilpotente', requiere: ['t.mat-producto-asoc', 't.mat-inversa-unica'], refsExtra: ['d.matriz-inversa', 'b.cuerpo-algebra'],
    param: rng => ({ a: rng.pick(['A', 'N']) }),
    enunciado: p => r`Demuestra que si $${p.a}^2=0$, entonces $I-${p.a}$ es invertible y su inversa es $I+${p.a}$.`,
    hip: p => [r`$${p.a}$ es cuadrada con $${p.a}^2=0$`, 'Puedes citar la asociatividad y la unicidad de la inversa'], meta: p => r`$(I-${p.a})^{-1}=I+${p.a}$`,
    L: p => [
      ['L1', r`Calculamos $(I-${p.a})(I+${p.a})=I+${p.a}-${p.a}-${p.a}^2$ (distributividad).`, 'b.cuerpo-algebra'],
      ['L2', r`Como $${p.a}^2=0$, $(I-${p.a})(I+${p.a})=I$.`, 't.mat-producto-asoc', ['L1']],
      ['L3', r`Análogamente $(I+${p.a})(I-${p.a})=I-${p.a}+${p.a}-${p.a}^2$, que es igual a ⟦h1⟧.`, 'b.cuerpo-algebra', ['L1'], [H('h1', r`$I$`, [r`$I$`, r`$0$`, r`$2I$`], false)]],
      ['L4', r`Luego $I+${p.a}$ es una inversa de $I-${p.a}$ por ambos lados y, por la unicidad de la inversa, **la** inversa. ∎`, 't.mat-inversa-unica', ['L2', 'L3']],
    ],
    dist: p => [[r`Con $${p.a}=\begin{pmatrix}0&1\\0&0\end{pmatrix}$ se cumple; luego siempre.`, 'un ejemplo no prueba el caso general'], [r`Como $${p.a}^2=0$, entonces $${p.a}=0$.`, 'falso: hay matrices no nulas con cuadrado cero']],
    err: p => [['L1', r`Calculamos $(I-${p.a})(I+${p.a})=I+${p.a}+${p.a}-${p.a}^2$.`, 'error-de-calculo', 'Al distribuir, $-A\\cdot I=-A$: se cancela con $+A$.'], ['L3', r`Análogamente $(I+${p.a})(I-${p.a})=I-${p.a}^2-${p.a}^2$.`, 'error-de-calculo', 'Hay que distribuir los cuatro términos: $I-A+A-A^2$.']],
    valida: [['multiplicar', r`Multiplicar $(I-A)$ por $(I+A)$ en ambos órdenes`, 'Es la prueba estándar.'], ['serie', r`Usar la serie geométrica $I+A+A^2+\cdots$`, 'Válida (la serie se corta), pero necesita justificar la suma.']],
    idea: p => r`$(I-${p.a})(I+${p.a})=I-${p.a}^2=I$ y lo mismo al revés.`, primero: p => r`multiplica $(I-${p.a})(I+${p.a})$.`,
  }, J));

  dem2(Object.assign({
    id: 'dem.jefe-det-inversa', enunciadoId: 'jefe.det-inversa', requiere: ['t.det-producto-2x2', 't.det-invertible-2x2'], refsExtra: ['d.matriz-inversa', 'd.determinante'],
    param: rng => ({ a: rng.pick(['A', 'P']) }),
    enunciado: p => r`Demuestra que si $${p.a}$ es una matriz $2\times2$ invertible, entonces $\det ${p.a}\neq0$ y $\det(${p.a}^{-1})=\dfrac{1}{\det ${p.a}}$.`,
    hip: p => [r`$${p.a}$ es $2\times2$ invertible`, 'Puedes citar el determinante de un producto $2\\times2$ y el criterio de invertibilidad'], meta: p => r`$\det(${p.a}^{-1})=1/\det ${p.a}$`,
    L: p => [
      ['L1', r`Por el criterio de determinante e inversa $2\times2$, $${p.a}$ invertible implica $\det ${p.a}\neq0$.`, 't.det-invertible-2x2'],
      ['L2', r`Como $${p.a}${p.a}^{-1}=I$, aplicamos el determinante: $\det(${p.a}${p.a}^{-1})=\det I=1$.`, 'd.determinante', ['L1']],
      ['L3', r`Por el determinante de un producto, $\det ${p.a}\cdot\det(${p.a}^{-1})=1$.`, 't.det-producto-2x2', ['L2']],
      ['L4', r`Como $\det ${p.a}\neq0$ se puede ⟦h1⟧ entre $\det ${p.a}$ y queda $\det(${p.a}^{-1})=1/\det ${p.a}$. ∎`, 'b.cuerpo-algebra', ['L1', 'L3'], [H('h1', 'dividir', ['dividir', 'restar', 'derivar'], false)]],
    ],
    dist: p => [[r`Con $${p.a}=2I$, $\det=4$ y $\det(${p.a}^{-1})=1/4$; luego siempre.`, 'un ejemplo no prueba el caso general'], [r`Como $\det(${p.a}^{-1})=-\det ${p.a}$, la igualdad es inmediata.`, 'la inversa del determinante es el recíproco, no el opuesto']],
    err: p => [['L2', r`Como $${p.a}${p.a}^{-1}=I$, $\det(${p.a}${p.a}^{-1})=\det I=0$.`, 'error-de-calculo', '$\\det I=1$.'], ['L3', r`Por el determinante de un producto, $\det ${p.a}+\det(${p.a}^{-1})=1$.`, 'error-de-calculo', 'El determinante de un producto es el **producto** de los determinantes.']],
    valida: [['multiplicativa', r`Usar $\det(AB)=\det A\det B$ con $B=A^{-1}$`, 'Es la prueba estándar.']],
    idea: p => r`$\det(${p.a})\det(${p.a}^{-1})=\det I=1$.`, primero: p => r`aplica $\det$ a $${p.a}${p.a}^{-1}=I$.`,
  }, J));

  if (typeof module !== 'undefined') module.exports = AC;
})(globalThis.AC = globalThis.AC || {});
