/* Mundo 1 — Jefe: «El Guardián del Principio». Sus demostraciones exigen citar teoremas ganados en niveles anteriores. */
(function (AC) {
  const { R, r, H, dem, EST_EJEMPLO } = AC.w1c;
  const ref = (id, tipo, nombre) => R.ref({ id, tipo, nombre });
  ref('b.asoc-comp', 'propiedad-base', 'La composición de funciones es asociativa: (h∘g)∘f = h∘(g∘f)');
  ref('d.inversa', 'definicion', 'Inversa de f: función g con g∘f = id y f∘g = id');
  ref('b.igualdad', 'propiedad-base', 'Propiedades de la igualdad: sustituir iguales por iguales');
  ref('d.identidad', 'definicion', 'Identidad: id(x) = x, y h∘id = h = id∘h');

  const J = { nivel: 'J1', habilidades: [] };

  /* J-A: la inversa de una composición (usa t.comp-biyectiva y t.biyectiva-inversa) */
  dem(Object.assign({
    id: 'dem.jefe-inversa-composicion', enunciadoId: 'jefe.inversa-de-composicion', requiere: ['t.comp-biyectiva', 't.biyectiva-inversa'], refsExtra: ['d.inyectiva', 'd.sobreyectiva', 'b.arbitrario'],
    param: rng => { const [f, g, h] = rng.pick([['f', 'g', 'h'], ['\\varphi', '\\psi', 'h']]); return { f, g, h }; },
    enunciado: p => r`Sean $${p.f}:A\to B$ y $${p.g}:B\to C$ biyectivas. Demuestra que la inversa de $${p.g}\circ ${p.f}$ es $${p.f}^{-1}\circ ${p.g}^{-1}$.`,
    hip: p => [r`$${p.f}$ y $${p.g}$ son biyectivas`, 'Puedes citar los teoremas de composición de biyectivas y de biyectiva ⇔ inversa'],
    meta: p => r`$(${p.g}\circ ${p.f})^{-1}=${p.f}^{-1}\circ ${p.g}^{-1}$`,
    L: p => [
      ['L1', r`Como $${p.f}$ y $${p.g}$ son biyectivas, $${p.g}\circ ${p.f}$ es biyectiva.`, 't.comp-biyectiva'],
      ['L2', r`Por el teorema «biyectiva ⇔ tiene inversa», $${p.f}$ y $${p.g}$ tienen inversas $${p.f}^{-1}$ y $${p.g}^{-1}$, y $${p.g}\circ ${p.f}$ tiene una inversa $${p.h}$ con $${p.h}\circ(${p.g}\circ ${p.f})=\mathrm{id}_A$.`, 't.biyectiva-inversa', ['L1']],
      ['L3', r`Calculamos: $(${p.f}^{-1}\circ ${p.g}^{-1})\circ(${p.g}\circ ${p.f})=${p.f}^{-1}\circ(${p.g}^{-1}\circ ${p.g})\circ ${p.f}=${p.f}^{-1}\circ ${p.f}=\mathrm{id}_A$, por la ⟦h1⟧ de la composición.`, 'b.asoc-comp', ['L2'], [H('h1', 'asociatividad', ['asociatividad', 'conmutatividad', 'inyectividad'], false)]],
      ['L4', r`Análogamente, $(${p.g}\circ ${p.f})\circ(${p.f}^{-1}\circ ${p.g}^{-1})=${p.g}\circ(${p.f}\circ ${p.f}^{-1})\circ ${p.g}^{-1}=${p.g}\circ ${p.g}^{-1}=\mathrm{id}_C$.`, 'd.inversa', ['L2']],
      ['L5', r`Si $${p.h}$ es una inversa de $${p.g}\circ ${p.f}$: $${p.h}=${p.h}\circ\mathrm{id}_C=${p.h}\circ((${p.g}\circ ${p.f})\circ(${p.f}^{-1}\circ ${p.g}^{-1}))=(${p.h}\circ(${p.g}\circ ${p.f}))\circ(${p.f}^{-1}\circ ${p.g}^{-1})=\mathrm{id}_A\circ(${p.f}^{-1}\circ ${p.g}^{-1})=${p.f}^{-1}\circ ${p.g}^{-1}$.`, 'b.asoc-comp', ['L2', 'L4']],
      ['L6', r`Luego $(${p.g}\circ ${p.f})^{-1}=${p.f}^{-1}\circ ${p.g}^{-1}$. ∎`, 'd.inversa', ['L3', 'L5']],
    ],
    dist: p => [
      [r`Como $(${p.g}\circ ${p.f})^{-1}=${p.g}^{-1}\circ ${p.f}^{-1}$, el orden no importa.`, 'el orden se invierte: $g^{-1}\\circ f^{-1}$ ni siquiera está definida en general'],
      [r`Comprobamos con $${p.f}(x)=x+1$ y $${p.g}(x)=2x$; vale en ese caso, luego vale siempre.`, 'un ejemplo no prueba el enunciado general'],
    ],
    err: p => [
      ['L3', r`Calculamos: $(${p.f}^{-1}\circ ${p.g}^{-1})\circ(${p.g}\circ ${p.f})=${p.f}^{-1}\circ(${p.f}\circ ${p.g})\circ ${p.g}^{-1}=\mathrm{id}$.`, 'error-de-calculo', 'Se agrupan $g^{-1}\\circ g$, que están juntas; $f\\circ g$ ni siquiera aparece.'],
      ['L5', r`Si $${p.h}$ es una inversa de $${p.g}\circ ${p.f}$, entonces $${p.h}=${p.f}^{-1}\circ ${p.g}^{-1}$ porque ambas «se parecen».`, 'no-justificado', 'La unicidad se prueba calculando con la asociatividad, no por parecido.'],
      ['L1', r`Como $${p.f}$ y $${p.g}$ son inyectivas, $${p.g}\circ ${p.f}$ es biyectiva.`, 'conclusion-invalida', 'Hacen falta ambas propiedades: biyectivas.'],
    ],
    est: [['directa', 'Verificar con la asociatividad que $f^{-1}\\circ g^{-1}$ cumple las dos identidades y usar la unicidad de la inversa', true, 'Es la prueba estándar.'], ['elementos', 'Despejar elemento a elemento: $(g\\circ f)(x)=c\\Rightarrow x=f^{-1}(g^{-1}(c))$', true, 'Válida: usa que $f$ y $g$ son inyectivas para despejar.'], ['ejemplo', 'Comprobar con funciones lineales concretas', false, 'Un ejemplo no prueba el caso general.'], ['contrapositiva', 'Probar la contrapositiva', false, 'No hay una implicación que invertir.']],
    crit: ['Usé que la composición es biyectiva', 'Verifiqué las dos identidades con la asociatividad', 'Probé la unicidad de la inversa', 'Concluí la igualdad'],
    pistas: p => ['Orientación: hay que mostrar que $f^{-1}\\circ g^{-1}$ hace de inversa y que la inversa es única.', 'Idea clave: la asociatividad deja juntas las parejas $g^{-1}\\circ g$ y $f\\circ f^{-1}$.', r`Primer paso: usa que $${p.g}\circ ${p.f}$ es biyectiva.`],
  }, J));

  /* J-B: el complemento invierte la inclusión (usa t.inclusion-interseccion y t.demorgan-conj) */
  dem(Object.assign({
    id: 'dem.jefe-complemento-inclusion', enunciadoId: 'jefe.complemento-invierte-inclusion', requiere: ['t.inclusion-interseccion', 't.demorgan-conj'], refsExtra: ['d.interseccion', 'b.arbitrario'],
    param: rng => { const [A, B] = rng.pick([['A', 'B'], ['X', 'Y'], ['S', 'T']]); return { A, B, x: rng.pick(['x', 'z']) }; },
    enunciado: p => r`Sea $U$ un universo y $${p.A},${p.B}\subseteq U$. Demuestra que si $${p.A}\subseteq ${p.B}$, entonces $${p.B}^c\subseteq ${p.A}^c$.`,
    hip: p => [r`$${p.A}\subseteq ${p.B}\subseteq U$`, 'Puedes citar «inclusión e intersección» y las leyes de De Morgan para conjuntos'],
    meta: p => r`$${p.B}^c\subseteq ${p.A}^c$`,
    L: p => [
      ['L1', r`Como $${p.A}\subseteq ${p.B}$, por el teorema de inclusión e intersección, $${p.A}\cap ${p.B}=${p.A}$.`, 't.inclusion-interseccion'],
      ['L2', r`Tomando complementos en ambos lados, $(${p.A}\cap ${p.B})^c=${p.A}^c$.`, 'b.igualdad', ['L1']],
      ['L3', r`Por De Morgan para conjuntos, $(${p.A}\cap ${p.B})^c=${p.A}^c\cup ${p.B}^c$.`, 't.demorgan-conj', ['L1']],
      ['L4', r`De L2 y L3, $${p.A}^c\cup ${p.B}^c=${p.A}^c$.`, 'b.igualdad', ['L2', 'L3']],
      ['L5', r`Si $${p.x}\in ${p.B}^c$, entonces $${p.x}\in ${p.A}^c\cup ${p.B}^c=$ ⟦h1⟧; luego $${p.x}\in ${p.A}^c$.`, 'd.union', ['L4'], [H('h1', r`${p.A}^c`, [r`${p.B}^c`, r`${p.A}\cap ${p.B}`, r`U`])]],
      ['L6', r`Como $${p.x}\in ${p.B}^c$ era arbitrario, $${p.B}^c\subseteq ${p.A}^c$. ∎`, 'd.inclusion', ['L5']],
    ],
    dist: p => [
      [r`Como $${p.A}\subseteq ${p.B}$, entonces $${p.A}^c\subseteq ${p.B}^c$.`, 'invierte mal: el complemento invierte la inclusión'],
      [r`Tomamos $U=\{1,2,3\}$, $${p.A}=\{1\}$, $${p.B}=\{1,2\}$: $${p.B}^c=\{3\}\subseteq\{2,3\}=${p.A}^c$; luego vale siempre.`, 'un ejemplo no prueba el caso general'],
    ],
    err: p => [
      ['L3', r`Por De Morgan para conjuntos, $(${p.A}\cap ${p.B})^c=${p.A}^c\cap ${p.B}^c$.`, 'demorgan-mal', 'Al complementar una intersección, la operación cambia a unión.', ['demorgan-mal', 'error-de-calculo', 'circular', 'caso-faltante']],
      ['L5', r`Si $${p.x}\in ${p.B}^c$, entonces $${p.x}\in ${p.A}^c\cup ${p.B}^c=${p.B}^c$; luego $${p.x}\in ${p.A}^c$.`, 'error-de-calculo', 'Según L4 la unión es igual a $A^c$, no a $B^c$.'],
      ['L1', r`Como $${p.A}\subseteq ${p.B}$, por el teorema de inclusión e intersección, $${p.A}\cap ${p.B}=${p.B}$.`, 'error-de-calculo', 'La intersección es $A$ (el menor), no $B$.'],
    ],
    est: [['de-morgan', 'Usar $A\\cap B=A$, De Morgan y la unión', true, 'Aprovecha los dos teoremas ganados.'], ['elementos', 'Tomar $x\\in B^c$ y probar $x\\notin A$ por contraposición', true, 'Válida: si $x\\in A\\subseteq B$ entonces $x\\in B$.'], ['diagrama', 'Dibujar un diagrama de Venn', false, 'Ilustra, no demuestra.'], EST_EJEMPLO],
    crit: ['Pasé de $A\\subseteq B$ a $A\\cap B=A$', 'Complementé con De Morgan', 'Deduje la inclusión de la unión', 'Concluí $B^c\\subseteq A^c$'],
    pistas: p => ['Orientación: cuesta partir de $B^c$; traduce la hipótesis a una igualdad de conjuntos.', r`Idea clave: $${p.A}\subseteq ${p.B}$ equivale a $${p.A}\cap ${p.B}=${p.A}$; complementa y usa De Morgan.`, r`Primer paso: escribe $${p.A}\cap ${p.B}=${p.A}$.`],
  }, J));

  /* J-C: suma de cubos por inducción fuerte (usa t.suma-gauss y t.induccion-fuerte) */
  dem(Object.assign({
    id: 'dem.jefe-suma-cubos', enunciadoId: 'jefe.suma-de-cubos', requiere: ['t.suma-gauss', 't.induccion-fuerte'], refsExtra: ['b.contradiccion'],
    param: rng => ({ n: rng.pick(['n', 'm']) }),
    enunciado: p => r`Demuestra que para todo $${p.n}\ge 1$: $1^3+2^3+\cdots+${p.n}^3=(1+2+\cdots+${p.n})^2$. Usa la fórmula de la suma de los primeros números y la inducción fuerte.`,
    hip: p => [r`$${p.n}$ recorre los enteros $\ge 1$`, 'Puedes citar la suma de los primeros $n$ números y la inducción fuerte'],
    meta: p => r`$1^3+\cdots+${p.n}^3=(1+\cdots+${p.n})^2$`,
    L: p => [
      ['L1', r`Por la fórmula de la suma de los primeros números, $(1+\cdots+${p.n})^2=\left(\frac{${p.n}(${p.n}+1)}{2}\right)^2$. Basta probar $P(${p.n}):\ 1^3+\cdots+${p.n}^3=\left(\frac{${p.n}(${p.n}+1)}{2}\right)^2$.`, 't.suma-gauss'],
      ['L2', r`Probamos $P(${p.n})$ por inducción fuerte: sea $${p.n}\ge 1$ y supongamos $P(k)$ para todo $1\le k<${p.n}$.`, 't.induccion-fuerte', ['L1']],
      ['L3', r`Caso $${p.n}=1$: $1^3=1=\left(\frac{1\cdot 2}{2}\right)^2$.`, 'b.cuerpo-algebra', ['L1']],
      ['L4', r`Caso $${p.n}\ge 2$: en particular vale $P(${p.n}-1)$, es decir, $1^3+\cdots+(${p.n}-1)^3=\left(\frac{(${p.n}-1)${p.n}}{2}\right)^2$.`, 'hip', ['L2']],
      ['L5', r`Sumando $${p.n}^3$ a ambos lados: $1^3+\cdots+${p.n}^3=\left(\frac{(${p.n}-1)${p.n}}{2}\right)^2+${p.n}^3$, por la hipótesis de inducción.`, 'd.hip-induccion', ['L4']],
      ['L6', r`Sacando factor común, $\left(\frac{(${p.n}-1)${p.n}}{2}\right)^2+${p.n}^3=${p.n}^2\cdot\frac{(${p.n}-1)^2+4${p.n}}{4}=${p.n}^2\cdot\frac{(${p.n}+1)^2}{4}=$ ⟦h1⟧.`, 'b.cuerpo-algebra', ['L5'], [H('h1', r`\left(\frac{${p.n}(${p.n}+1)}{2}\right)^2`, [r`\left(\frac{${p.n}(${p.n}-1)}{2}\right)^2`, r`\frac{${p.n}(${p.n}+1)}{2}`, r`\left(\frac{(${p.n}+1)^2}{2}\right)^2`])]],
      ['L7', r`En ambos casos vale $P(${p.n})$. Por inducción fuerte, $P(${p.n})$ vale para todo $${p.n}\ge 1$ y, con L1, $1^3+\cdots+${p.n}^3=(1+\cdots+${p.n})^2$. ∎`, 't.induccion-fuerte', ['L1', 'L3', 'L6']],
    ],
    dist: p => [
      [r`Comprobamos $${p.n}=1,2,3,4$; coincide en todos, luego vale siempre.`, 'comprobar casos no es una demostración'],
      [r`Como $1^3+\cdots+${p.n}^3=1+\cdots+${p.n}$ (porque $k^3=k$), la igualdad es obvia.`, 'falso: $k^3\\neq k$'],
    ],
    err: p => [
      ['L3', r`Caso $${p.n}=1$: $1^3=1$ y $\left(\frac{1\cdot 2}{2}\right)^2=2$; no coinciden.`, 'error-de-calculo', '$\\frac{1\\cdot 2}{2}=1$ y $1^2=1$.'],
      ['L6', r`Sacando factor común, $${p.n}^2\cdot\frac{(${p.n}-1)^2+4${p.n}}{4}=${p.n}^2\cdot\frac{(${p.n}+1)^2}{4}$ y $\frac{(${p.n}-1)^2+4${p.n}}{4}=\frac{${p.n}^2+${p.n}+1}{4}$.`, 'error-de-calculo', '$(n-1)^2+4n=n^2+2n+1=(n+1)^2$.'],
      ['L5', r`Sumando $${p.n}$ a ambos lados: $1^3+\cdots+${p.n}^3=\left(\frac{(${p.n}-1)${p.n}}{2}\right)^2+${p.n}$.`, 'error-de-calculo', 'El término nuevo es $n^3$, no $n$.'],
    ],
    est: [['fuerte', 'Inducción fuerte (o simple) apoyada en la fórmula de Gauss', true, 'Es la prueba estándar; aquí basta la hipótesis para $n-1$.'], ['telescopica', 'Telescopar con $(k+1)^4-k^4$', true, 'Válida: da la suma de cubos a partir de las de cuadrados y de números.'], ['ejemplos', 'Comprobar con valores de $n$', false, 'Los ejemplos no prueban el caso general.'], ['absurdo', 'Suponer que falla para algún $n$ y tomar el menor', true, 'Posible con el buen orden y el mismo cálculo.']],
    crit: ['Usé la fórmula de la suma de los primeros $n$', 'Separé el caso $n=1$', 'Usé la hipótesis fuerte para $n-1$', 'Concluí $P(n)$'],
    pistas: p => ['Orientación: el lado derecho es un cuadrado conocido; reescríbelo con la fórmula de la suma.', r`Idea clave: de $P(${p.n}-1)$ se pasa a $P(${p.n})$ sumando $${p.n}^3$.`, r`Primer paso: comprueba $${p.n}=1$.`],
  }, J));

  if (typeof module !== 'undefined') module.exports = AC;
})(globalThis.AC = globalThis.AC || {});
