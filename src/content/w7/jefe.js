/* Mundo 7 — Jefe: «El Oráculo de Autovalores». Sus demostraciones exigen citar teoremas ganados en niveles anteriores. */
(function (AC) {
  const { R, H, T, gen, dem2 } = AC.cont, r = String.raw;
  R.jefe(7, { id: 'J7', titulo: 'El Oráculo de Autovalores', estrategia: 'w7.jefe.estrategia', demos: ['dem.jefe-nilpotente-propio', 'dem.jefe-transpuesta-propios', 'dem.jefe-simetrica-diagonal'] });
  const J = { nivel: 'J7', mundo: 7, habilidades: [] };

  /* ---------- fase de estrategia: ¿qué herramienta del Mundo 7? ---------- */
  const MET = ['Polinomio característico (traza y determinante)', 'Núcleo de $A-\\lambda I$ (vectores propios)', 'Diagonalización $A=PDP^{-1}$', 'Proyecciones y Gram-Schmidt', 'Propiedades de las matrices simétricas', 'Cadenas de Markov y distribución estacionaria'];
  const RAZON = ['Se piden los valores propios de una matriz $2\\times2$ o se conoce su traza y su determinante.', 'Se pide un vector propio o un espacio propio.', 'Se piden potencias de una matriz, una fórmula cerrada o saber si es diagonalizable.', 'Se pide ortogonalizar vectores o proyectar uno sobre otro.', 'La matriz es simétrica y se pide ortogonalidad de propios o que sus valores propios sean reales.', 'Hay probabilidades de transición, pasos del tiempo o un estado de equilibrio.'];
  const CLAIMS = [
    ['Hallar los valores propios de $\\begin{pmatrix}4&1\\\\2&3\\end{pmatrix}$.', 0], ['Una matriz $2\\times2$ tiene traza $7$ y determinante $12$; hallar sus valores propios.', 0], ['Decidir cuál es el valor propio que falta si uno es $2$ y la traza es $5$.', 0],
    ['Hallar un vector propio de $\\lambda=3$ para una matriz dada.', 1], ['Hallar una base del espacio propio $E_2$.', 1], ['Comprobar si $(1,2)$ es vector propio de una matriz.', 1],
    ['Calcular $A^{10}$ para una $2\\times2$ con valores propios $1$ y $2$.', 2], ['Hallar la fórmula cerrada de $x_{n+2}=5x_{n+1}-6x_n$.', 2], ['Decidir si $\\begin{pmatrix}2&1\\\\0&2\\end{pmatrix}$ es diagonalizable.', 2],
    ['Hallar la componente de $v$ en la dirección de $u$.', 3], ['Construir una base ortogonal a partir de tres vectores.', 3], ['Hallar el punto de una recta más cercano a $P$.', 3],
    ['Probar que los vectores propios de $\\begin{pmatrix}3&2\\\\2&3\\end{pmatrix}$ son ortogonales.', 4], ['Decidir si una matriz simétrica $2\\times2$ puede tener valores propios complejos.', 4], ['Hallar una base ortogonal de propios de una matriz simétrica.', 4],
    ['Hallar la distribución del clima dentro de dos días.', 5], ['Hallar la distribución de equilibrio de una cadena de dos estados.', 5], ['Hallar el valor propio $\\ne 1$ de una matriz de transición.', 5],
  ];
  gen.eleccion({
    id: 'w7.jefe.estrategia', nivel: 'J7', mundo: 7, habilidades: [], dificultad: 2, confianza: false,
    hacer(rng) {
      const [txt, t] = rng.pick(CLAIMS), otros = rng.sample([0, 1, 2, 3, 4, 5].filter(x => x !== t), 3);
      return { key: txt + '|' + otros.join(''), enun: 'Tienes que resolver: «' + txt + '» ¿Qué herramienta del Mundo 7 es la más adecuada?', ok: MET[t],
        malas: otros.map(m => ['metodo-' + m, MET[m], 'No es la más directa aquí. En este problema: ' + RAZON[t]]),
        pistas: ['Orientación: fíjate en lo que se pide: valores propios, vectores propios, potencias, ortogonalidad o probabilidades.', 'Idea clave: cada herramienta del mundo responde a un tipo de pregunta.', 'Primer paso: identifica los datos (traza, determinante, simetría, matriz de transición).'], expl: 'La herramienta más adecuada es: ' + MET[t] + '. ' + RAZON[t] };
    },
  });

  /* ---------- fase de demostración ---------- */
  dem2(Object.assign({
    id: 'dem.jefe-nilpotente-propio', enunciadoId: 'jefe.nilpotente-propio', requiere: ['t.propios-potencias', 't.propio-nucleo'], refsExtra: ['d.propio', 'b.sin-divisores-cero'],
    param: rng => ({ a: rng.pick(['A', 'N']), l: rng.pick(['λ', 'μ']), v: rng.pick(['v', 'x']) }),
    enunciado: p => r`Sea $${p.a}$ una matriz con $${p.a}^2=0$. Demuestra que su único valor propio es $0$.`,
    hip: p => [r`$${p.a}^2=0$`, 'Puedes citar la fórmula de potencias de vectores propios'], meta: p => r`si $${p.l}$ es valor propio de $${p.a}$, entonces $${p.l}=0$`,
    L: p => [
      ['L1', r`Sea $${p.l}$ un valor propio de $${p.a}$: existe $${p.v}\neq0$ con $${p.a}${p.v}=${p.l}${p.v}$.`, 'd.propio'],
      ['L2', r`Por el teorema de potencias, $${p.a}^2${p.v}=${p.l}^2${p.v}$.`, 't.propios-potencias', ['L1']],
      ['L3', r`Como $${p.a}^2=0$, $${p.a}^2${p.v}=0$; luego $${p.l}^2${p.v}=0$.`, 't.propio-nucleo', ['L2']],
      ['L4', r`Como $${p.v}\neq0$ y el producto de un escalar por un vector no nulo solo es cero si el escalar es $0$, ⟦h1⟧. Luego $${p.l}=0$. ∎`, 'b.sin-divisores-cero', ['L3'], [H('h1', r`$${p.l}^2=0$`, [r`$${p.l}^2=0$`, r`$${p.v}=0$`, r`$${p.a}=0$`], false)]],
    ],
    dist: p => [[r`Con $\begin{pmatrix}0&1\\0&0\end{pmatrix}$ el único valor propio es $0$; luego siempre.`, 'un ejemplo no prueba el caso general'], [r`Como $${p.a}^2=0$, entonces $${p.a}=0$ y todo vector es propio de $0$.`, 'hay matrices no nulas con cuadrado cero']],
    err: p => [['L2', r`Por el teorema de potencias, $${p.a}^2${p.v}=2${p.l}${p.v}$.`, 'error-de-calculo', 'Es $\\lambda^2v$, no $2\\lambda v$.'], ['L4', r`Como $${p.v}\neq0$, $${p.l}^2=${p.v}$ y por tanto $${p.l}=0$.`, 'error-de-calculo', 'De $\\lambda^2v=0$ con $v\\neq0$ se concluye $\\lambda^2=0$.']],
    valida: [['potencias', r`Aplicar $A$ dos veces a un vector propio`, 'Es la prueba estándar.']],
    idea: p => r`$0=${p.a}^2${p.v}=${p.l}^2${p.v}$ obliga a $${p.l}^2=0$.`, primero: p => r`toma un valor propio $${p.l}$ con vector propio $${p.v}$.`,
  }, J));

  dem2(Object.assign({
    id: 'dem.jefe-transpuesta-propios', enunciadoId: 'jefe.transpuesta-propios', requiere: ['t.polinomio-caracteristico-2x2', 't.propio-nucleo'], refsExtra: ['d.propio', 'd.traza'],
    param: rng => ({ a: rng.pick(['a', 'p']), b: rng.pick(['b', 'q']), c: rng.pick(['c', 'r']), d: rng.pick(['d', 's']) }),
    enunciado: p => r`Demuestra que $A=\begin{pmatrix}${p.a}&${p.b}\\${p.c}&${p.d}\end{pmatrix}$ y $A^T$ tienen los mismos valores propios.`,
    hip: p => [r`$A$ es una matriz $2\times2$`, 'Puedes citar el polinomio característico $2\\times2$'], meta: p => r`$A$ y $A^T$ tienen los mismos valores propios`,
    L: p => [
      ['L1', r`Por el polinomio característico, los valores propios de $A$ son las raíces de $\lambda^2-(${p.a}+${p.d})\lambda+(${p.a}${p.d}-${p.b}${p.c})$.`, 't.polinomio-caracteristico-2x2'],
      ['L2', r`Por el teorema del valor propio y el núcleo, $\lambda$ es valor propio de $A^T$ si y solo si $A^T-\lambda I$ no es invertible; para $2\times2$ esto se expresa con el polinomio característico de $A^T$.`, 't.propio-nucleo', ['L1']],
      ['L3', r`$A^T=\begin{pmatrix}${p.a}&${p.c}\\${p.b}&${p.d}\end{pmatrix}$, cuya traza es ⟦h1⟧.`, 'd.traza', ['L2'], [H('h1', r`$${p.a}+${p.d}$ (igual que la de $A$)`, [r`$${p.a}+${p.d}$ (igual que la de $A$)`, r`$${p.b}+${p.c}$`, r`$0$`], false)]],
      ['L4', r`Su determinante es $${p.a}${p.d}-${p.c}${p.b}=${p.a}${p.d}-${p.b}${p.c}$ (el producto de números es conmutativo).`, 't.polinomio-caracteristico-2x2', ['L3']],
      ['L5', r`Por el polinomio característico aplicado a $A^T$, sus valores propios son las raíces de $\lambda^2-(${p.a}+${p.d})\lambda+(${p.a}${p.d}-${p.b}${p.c})$: el **mismo** polinomio que para $A$. ∎`, 't.polinomio-caracteristico-2x2', ['L1', 'L4']],
    ],
    dist: p => [[r`Con $A=\begin{pmatrix}1&2\\0&3\end{pmatrix}$ ambas tienen $\{1,3\}$; luego siempre.`, 'un ejemplo no prueba el caso general'], [r`Como $A^T$ tiene las mismas entradas, los vectores propios también coinciden.`, 'los valores propios coinciden, los vectores propios no necesariamente']],
    err: p => [['L3', r`$A^T=\begin{pmatrix}${p.a}&${p.c}\\${p.b}&${p.d}\end{pmatrix}$, cuya traza es $${p.b}+${p.c}$.`, 'error-de-calculo', 'La traza suma la **diagonal**: $a+d$.'], ['L4', r`Su determinante es $${p.a}${p.d}+${p.c}${p.b}$.`, 'error-de-calculo', 'El determinante resta: $ad-cb$.']],
    valida: [['caracteristico', r`Comparar los polinomios característicos de $A$ y de $A^T$`, 'Es la prueba estándar.']],
    idea: p => r`$A$ y $A^T$ tienen la misma traza y el mismo determinante, luego el mismo polinomio característico.`, primero: p => r`escribe $A^T$ y calcula su traza.`,
  }, J));

  dem2(Object.assign({
    id: 'dem.jefe-simetrica-diagonal', enunciadoId: 'jefe.simetrica-diagonal', requiere: ['t.simetrica-propios-ortogonales', 't.diagonalizable-base'], refsExtra: ['d.simetrica', 'd.propio', 'd.producto-punto'],
    param: rng => ({ a: rng.pick(['A', 'S']), p: rng.pick(['P', 'Q']), v: rng.pick(['v', 'x']), w: rng.pick(['w', 'y']) }),
    enunciado: p => r`Sea $${p.a}=${p.a}^T$ una matriz $2\times2$ con valores propios distintos $\lambda_1\neq\lambda_2$ y vectores propios $${p.v},${p.w}$. Demuestra que $${p.p}=(${p.v}\ ${p.w})$ cumple que $${p.p}^T${p.a}${p.p}$ es una matriz **diagonal**.`,
    hip: p => [r`$${p.a}$ simétrica con $\lambda_1\neq\lambda_2$, $${p.a}${p.v}=\lambda_1${p.v}$, $${p.a}${p.w}=\lambda_2${p.w}$`, 'Puedes citar la ortogonalidad de los propios de simétricas'], meta: p => r`$${p.p}^T${p.a}${p.p}$ es diagonal`,
    L: p => [
      ['L1', r`Por el teorema de propios de simétricas, $${p.v}\cdot ${p.w}=0$ (valores propios distintos).`, 't.simetrica-propios-ortogonales'],
      ['L2', r`Como $${p.a}${p.p}=(${p.a}${p.v}\ ${p.a}${p.w})=(\lambda_1${p.v}\ \lambda_2${p.w})$, calculamos $${p.p}^T${p.a}${p.p}$ con entradas $${p.v}\cdot(\lambda_1${p.v})$, $${p.v}\cdot(\lambda_2${p.w})$, etc.`, 'd.propio', ['L1']],
      ['L3', r`Las entradas fuera de la diagonal son $\lambda_2(${p.v}\cdot ${p.w})$ y $\lambda_1(${p.w}\cdot ${p.v})$, que valen ⟦h1⟧ por L1.`, 'd.producto-punto', ['L2'], [H('h1', r`$0$`, [r`$0$`, r`$1$`, r`$\lambda_1\lambda_2$`], false)]],
      ['L4', r`Luego $${p.p}^T${p.a}${p.p}=\begin{pmatrix}\lambda_1|${p.v}|^2&0\\0&\lambda_2|${p.w}|^2\end{pmatrix}$ es diagonal. (Además $${p.v},${p.w}$ forman una base de propios, así que $${p.a}$ es diagonalizable.) ∎`, 't.diagonalizable-base', ['L3']],
    ],
    dist: p => [[r`Con $\begin{pmatrix}2&1\\1&2\end{pmatrix}$ y $v=(1,1)$, $w=(1,-1)$ se verifica; luego siempre.`, 'un ejemplo no prueba el caso general'], [r`Como $${p.a}$ es simétrica, $${p.p}^T${p.a}${p.p}$ es simétrica y por tanto diagonal.`, 'simétrica no implica diagonal']],
    err: p => [['L1', r`Por el teorema de propios de simétricas, $${p.v}\cdot ${p.w}=1$.`, 'error-de-calculo', 'Son **ortogonales**: producto punto $0$.'], ['L3', r`Las entradas fuera de la diagonal son $\lambda_2(${p.v}\cdot ${p.w})$ y $\lambda_1(${p.w}\cdot ${p.v})$, que valen $\lambda_1\lambda_2$.`, 'error-de-calculo', 'Valen $0$ porque $v\\cdot w=0$.']],
    valida: [['entradas', r`Calcular las entradas de $P^TAP$ con productos punto`, 'Es la prueba estándar.']],
    idea: p => r`$(${p.p}^T${p.a}${p.p})_{ij}=${p.v}_i\cdot(${p.a}${p.v}_j)=\lambda_j(${p.v}_i\cdot ${p.v}_j)$ y los cruzados se anulan.`, primero: p => r`aplica la ortogonalidad de propios de simétricas.`,
  }, J));

  if (typeof module !== 'undefined') module.exports = AC;
})(globalThis.AC = globalThis.AC || {});
