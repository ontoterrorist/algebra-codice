/* Mundo 5 — Jefe: «El Arquitecto de Bases». Sus demostraciones exigen citar teoremas ganados en niveles anteriores. */
(function (AC) {
  const { R, H, T, gen, dem2 } = AC.cont, r = String.raw;
  R.jefe(5, { id: 'J5', titulo: 'El Arquitecto de Bases', estrategia: 'w5.jefe.estrategia', demos: ['dem.jefe-interseccion-dim', 'dem.jefe-coordenadas-independencia', 'dem.jefe-n-generadores'] });
  const J = { nivel: 'J5', mundo: 5, habilidades: [] };

  /* ---------- fase de estrategia: ¿qué herramienta del Mundo 5? ---------- */
  const MET = ['Criterio del subespacio', 'Resolver un sistema para combinar vectores', 'Rango o determinante para la independencia', 'Contar con bases y dimensiones', 'Coordenadas y cambio de base', 'Núcleo y variables libres'];
  const RAZON = ['Se pregunta si un conjunto es subespacio: cero, suma y escalares.', 'Se pide expresar un vector como combinación o decidir si pertenece al generado.', 'Se pregunta si unos vectores son independientes o generan.', 'Se pregunta por la dimensión o si una lista es una base.', 'Hay una base distinta de la canónica y se piden coordenadas.', 'El subespacio se describe con ecuaciones homogéneas y se pide una base o su dimensión.'];
  const CLAIMS = [
    ['Decidir si $\\{(x,y,z):x+y+z=1\\}$ es un subespacio de $\\mathbb{R}^3$.', 0], ['¿Es $\\{(x,y):xy\\ge0\\}$ un subespacio de $\\mathbb{R}^2$?', 0], ['Decidir si el conjunto de matrices $2\\times2$ invertibles es subespacio.', 0],
    ['Escribir $(5,1,3)$ como combinación lineal de dos vectores dados.', 1], ['Hallar $k$ para que $(1,2,k)$ esté en el generado de dos vectores.', 1], ['Decidir si $v\\in\\operatorname{gen}\\{u_1,u_2\\}$.', 1],
    ['Decidir si tres vectores de $\\mathbb{R}^3$ son independientes.', 2], ['Hallar $k$ que hace dependientes tres vectores con un parámetro.', 2], ['Decidir si cuatro vectores generan $\\mathbb{R}^3$.', 2],
    ['Hallar la dimensión del espacio de matrices simétricas $3\\times3$.', 3], ['¿Forman base de $\\mathbb{R}^4$ estos tres vectores?', 3], ['Completar dos vectores independientes de $\\mathbb{R}^3$ a una base.', 3],
    ['Hallar $[v]_B$ para una base no canónica $B$ de $\\mathbb{R}^2$.', 4], ['Hallar la matriz $P_{B\\to C}$ entre dos bases.', 4], ['Reescribir un polinomio en la base $\\{1,x-2,(x-2)^2\\}$.', 4],
    ['Hallar una base de $\\{(x,y,z,w):x+y=0,\\ z-w=0\\}$.', 5], ['Calcular la dimensión de $\\{Ax=0\\}$ para una matriz $4\\times6$ de rango $3$.', 5], ['Describir en forma paramétrica el plano $2x-y+z=0$.', 5],
  ];
  gen.eleccion({
    id: 'w5.jefe.estrategia', nivel: 'J5', mundo: 5, habilidades: [], dificultad: 2, confianza: false,
    hacer(rng) {
      const [txt, t] = rng.pick(CLAIMS), otros = rng.sample([0, 1, 2, 3, 4, 5].filter(x => x !== t), 3);
      return { key: txt + '|' + otros.join(''), enun: 'Tienes que resolver: «' + txt + '» ¿Qué herramienta del Mundo 5 es la más adecuada?', ok: MET[t],
        malas: otros.map(m => ['metodo-' + m, MET[m], 'No es la más directa aquí. En este problema: ' + RAZON[t]]),
        pistas: ['Orientación: fíjate en lo que se pide: pertenencia, independencia, dimensión, coordenadas o una base.', 'Idea clave: cada herramienta del mundo responde a un tipo de pregunta.', 'Primer paso: identifica los datos (vectores, ecuaciones, bases).'], expl: 'La herramienta más adecuada es: ' + MET[t] + '. ' + RAZON[t] };
    },
  });

  /* ---------- fase de demostración ---------- */
  dem2(Object.assign({
    id: 'dem.jefe-interseccion-dim', enunciadoId: 'jefe.interseccion-dim', requiere: ['t.interseccion-subespacios', 't.dim-subespacio'], refsExtra: ['d.subespacio', 'd.dimension'],
    param: rng => ({ a: rng.pick(['W_1', 'U_1']), b: rng.pick(['W_2', 'U_2']) }),
    enunciado: p => r`Sean $${p.a},${p.b}$ subespacios de dimensión finita de $V$. Demuestra que $${p.a}\cap ${p.b}$ es un subespacio y que $\dim(${p.a}\cap ${p.b})\le\min\{\dim ${p.a},\dim ${p.b}\}$.`,
    hip: p => [r`$${p.a},${p.b}$ subespacios de dimensión finita`, 'Puedes citar la intersección de subespacios y la dimensión de un subespacio'], meta: p => r`$\dim(${p.a}\cap ${p.b})\le\min\{\dim ${p.a},\dim ${p.b}\}$`,
    L: p => [
      ['L1', r`Por el teorema de la intersección, $${p.a}\cap ${p.b}$ es un subespacio de $V$.`, 't.interseccion-subespacios'],
      ['L2', r`Además $${p.a}\cap ${p.b}\subseteq ${p.a}$ y es subespacio; es decir, es un subespacio del espacio vectorial $${p.a}$.`, 'd.subespacio', ['L1']],
      ['L3', r`Por el teorema de la dimensión de un subespacio (aplicado a $${p.a}$), $\dim(${p.a}\cap ${p.b})\le\dim ${p.a}$.`, 't.dim-subespacio', ['L2']],
      ['L4', r`Intercambiando los papeles, $\dim(${p.a}\cap ${p.b})\le\dim ${p.b}$, ya que $${p.a}\cap ${p.b}\subseteq ${p.b}$ también.`, 't.dim-subespacio', ['L1']],
      ['L5', r`Una cantidad menor o igual que dos números es menor o igual que ⟦h1⟧. ∎`, 'd.dimension', ['L3', 'L4'], [H('h1', 'el mínimo', ['el mínimo', 'el máximo', 'la suma'], false)]],
    ],
    dist: p => [[r`Dos rectas distintas por el origen en $\mathbb{R}^2$ se cortan en $\{0\}$ (dimensión $0$); luego siempre.`, 'un ejemplo no prueba el caso general'], [r`Como $${p.a}\cap ${p.b}$ está en ambos, su dimensión es la mayor de las dos.`, 'es la desigualdad contraria']],
    err: p => [['L3', r`Por el teorema anterior, $\dim(${p.a}\cap ${p.b})\ge\dim ${p.a}$.`, 'error-de-calculo', 'Un subespacio tiene dimensión **menor o igual**.'], ['L1', r`$${p.a}\cap ${p.b}$ es subespacio porque $${p.a}\subseteq ${p.b}$.`, 'conclusion-invalida', 'No hay tal inclusión; se usa que la intersección de subespacios es subespacio.']],
    valida: [['inclusion', r`Usar que la intersección es un subespacio contenido en cada uno`, 'Es la prueba estándar.']],
    idea: p => r`la intersección es un subespacio de cada uno de los dos.`, primero: p => r`aplica el teorema de la intersección.`,
  }, J));

  dem2(Object.assign({
    id: 'dem.jefe-coordenadas-independencia', enunciadoId: 'jefe.coordenadas-independencia', requiere: ['t.coordenadas-lineales', 't.coordenadas-unicas'], refsExtra: ['d.independencia', 'd.coordenadas'],
    param: rng => ({ b: rng.pick(['B', 'C']), v: rng.pick(['v', 'w']) }),
    enunciado: p => r`Sea $${p.b}$ una base de $V$. Demuestra que $${p.v}_1,\dots,${p.v}_k\in V$ son linealmente independientes si y solo si $[${p.v}_1]_${p.b},\dots,[${p.v}_k]_${p.b}$ lo son en $\mathbb{Q}^n$.`,
    hip: p => [r`$${p.b}$ es una base de $V$ y $\dim V=n$`, 'Puedes citar la linealidad y la unicidad de las coordenadas'], meta: p => r`independencia en $V$ $\iff$ independencia de las coordenadas`,
    L: p => [
      ['L1', r`Para escalares $c_i$, por la linealidad de las coordenadas, $\left[\sum c_i${p.v}_i\right]_${p.b}=\sum c_i[${p.v}_i]_${p.b}$.`, 't.coordenadas-lineales'],
      ['L2', r`Por la unicidad de coordenadas, un vector tiene coordenadas $(0,\dots,0)$ si y solo si es el vector ⟦h1⟧: $\sum c_i${p.v}_i=0\iff\sum c_i[${p.v}_i]_${p.b}=0$.`, 't.coordenadas-unicas', ['L1'], [H('h1', 'cero', ['cero', 'unidad', 'base'], false)]],
      ['L3', r`Así, las combinaciones lineales nulas de los $${p.v}_i$ y las de sus coordenadas tienen **los mismos** coeficientes.`, 'd.independencia', ['L2']],
      ['L4', r`Luego los $${p.v}_i$ solo tienen la combinación nula trivial si y solo si sus coordenadas también. ∎`, 'd.independencia', ['L3']],
    ],
    dist: p => [[r`En $\mathbb{R}^2$ con $B=\{e_1,e_2\}$ las coordenadas coinciden con el vector; luego siempre.`, 'un ejemplo no prueba el caso general'], [r`Las coordenadas son una función inyectiva, así que preservan todo.`, 'falta probar que preservan combinaciones lineales']],
    err: p => [['L1', r`Por la linealidad de las coordenadas, $\left[\sum c_i${p.v}_i\right]_${p.b}=\prod c_i[${p.v}_i]_${p.b}$.`, 'error-de-calculo', 'Las coordenadas respetan **sumas** y escalares, no productos.'], ['L2', r`La unicidad dice que $[v]_${p.b}=0$ si y solo si $v$ es un vector de la base.`, 'conclusion-invalida', 'Solo el vector **cero** tiene coordenadas nulas.']],
    valida: [['linealidad', r`Transportar toda combinación lineal nula con las coordenadas`, 'Es la prueba estándar.']],
    idea: p => r`una combinación nula de los $${p.v}_i$ equivale a una combinación nula de sus coordenadas.`, primero: p => r`aplica $[\cdot]_${p.b}$ a $\sum c_i${p.v}_i$.`,
  }, J));

  dem2(Object.assign({
    id: 'dem.jefe-n-generadores', enunciadoId: 'jefe.n-generadores', requiere: ['t.dependencia-combinacion', 't.dimension-bien-definida'], refsExtra: ['d.base', 'd.dimension', 'b.contradiccion'],
    param: rng => ({ n: rng.pick(['n', 'm']), v: rng.pick(['v', 'g']) }),
    enunciado: p => r`Sea $\dim V=${p.n}$ y $${p.v}_1,\dots,${p.v}_${p.n}$ vectores que generan $V$. Demuestra que forman una base.`,
    hip: p => [r`$\dim V=${p.n}$ y los $${p.n}$ vectores generan $V$`, 'Puedes citar la caracterización de la dependencia y que la dimensión está bien definida'], meta: p => r`$${p.v}_1,\dots,${p.v}_${p.n}$ son independientes (y por tanto base)`,
    L: p => [
      ['L1', r`Como generan, solo falta ver que son independientes. Supongamos por contradicción que son dependientes.`, 'b.contradiccion'],
      ['L2', r`Por la caracterización de la dependencia, uno de ellos, digamos $${p.v}_j$, es combinación lineal de los otros.`, 't.dependencia-combinacion', ['L1']],
      ['L3', r`Entonces los otros $${p.n}-1$ vectores también generan $V$ (⟦h1⟧).`, 'd.generado', ['L2'], [H('h1', r`pues $${p.v}_j$ ya está en su generado`, [r`pues $${p.v}_j$ ya está en su generado`, r`pues $${p.v}_j=0$`, r`pues $${p.n}=1$`], false)]],
      ['L4', r`De una lista generadora se puede extraer una base, que tendría a lo sumo $${p.n}-1$ elementos.`, 'd.base', ['L3']],
      ['L5', r`Pero toda base de $V$ tiene $${p.n}$ elementos (la dimensión está bien definida): contradicción. Luego son independientes y forman una base. ∎`, 't.dimension-bien-definida', ['L4']],
    ],
    dist: p => [[r`En $\mathbb{R}^2$, dos vectores que generan son base; luego vale para todo $n$.`, 'un ejemplo no prueba el caso general'], [r`Como son $${p.n}$ vectores y la dimensión es $${p.n}$, son una base automáticamente.`, 'falta usar que generan (o que son independientes)']],
    err: p => [['L3', r`Entonces los otros $${p.n}-1$ vectores generan algo más pequeño que $V$.`, 'conclusion-invalida', 'Siguen generando $V$: el vector quitado es combinación de los demás.'], ['L5', r`Pero toda base de $V$ tiene $${p.n}-1$ elementos: contradicción.`, 'error-de-calculo', 'Toda base tiene $n$ elementos.']],
    valida: [['absurdo', r`Suponer dependencia, quitar un vector redundante y contradecir la dimensión`, 'Es la prueba estándar.']],
    idea: p => r`si fueran dependientes sobraría uno y quedarían $${p.n}-1$ generadores.`, primero: p => r`supón por contradicción que son dependientes.`,
  }, J));

  if (typeof module !== 'undefined') module.exports = AC;
})(globalThis.AC = globalThis.AC || {});
