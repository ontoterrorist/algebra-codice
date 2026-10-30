/* Mundo 6 — Jefe: «La Hechicera del Espejo». Sus demostraciones exigen citar teoremas ganados en niveles anteriores. */
(function (AC) {
  const { R, H, T, gen, dem2 } = AC.cont, r = String.raw;
  R.jefe(6, { id: 'J6', titulo: 'La Hechicera del Espejo', estrategia: 'w6.jefe.estrategia', demos: ['dem.jefe-inyectiva-sobre', 'dem.jefe-proyector', 'dem.jefe-traza-cuadrado'] });
  const J = { nivel: 'J6', mundo: 6, habilidades: [] };

  /* ---------- fase de estrategia: ¿qué herramienta del Mundo 6? ---------- */
  const MET = ['Criterio de linealidad (cero, suma, escalares)', 'Núcleo, imagen y teorema de la dimensión', 'Matriz asociada y producto de matrices', 'Cambio de base $P^{-1}AP$', 'Inversa de una transformación', 'Invariantes por semejanza (traza, determinante)'];
  const RAZON = ['Se pregunta si una función es lineal o qué propiedad falla.', 'Se piden dimensiones, bases del núcleo, inyectividad o sobreyectividad.', 'Se encadenan transformaciones o se pide la matriz de $T$.', 'Se da otra base y se pide la matriz de $T$ en ella, o una potencia $PD^kP^{-1}$.', 'Se pide deshacer una transformación biyectiva.', 'Se pregunta si dos matrices pueden ser semejantes.'];
  const CLAIMS = [
    ['Decidir si $T(x,y)=(x+1,y)$ es lineal.', 0], ['Decidir si $T(x,y)=(xy,x)$ es lineal.', 0], ['Hallar $k$ para que $T_k(x,y)=(x+k^2-9,y)$ sea lineal.', 0],
    ['Hallar $\\dim\\ker T$ para $T:\\mathbb{R}^5\\to\\mathbb{R}^3$ de rango $2$.', 1], ['Decidir si $T:\\mathbb{R}^3\\to\\mathbb{R}^2$ puede ser inyectiva.', 1], ['Hallar una base del núcleo de una $T:\\mathbb{R}^4\\to\\mathbb{R}^2$.', 1],
    ['Hallar la matriz de «gira $90^\\circ$ y luego refleja en el eje $x$».', 2], ['Hallar la matriz de $T(x,y,z)=(x+z,y-z)$.', 2], ['Hallar la imagen de $(3,-1)$ tras tres transformaciones geométricas.', 2],
    ['Hallar $[T]_C$ si $A=[T]$ y $C$ tiene por columnas los vectores de $P$.', 3], ['Calcular $A^6$ sabiendo $A=PDP^{-1}$.', 3], ['Expresar $T$ en una base de vectores propios.', 3],
    ['Hallar la matriz de $T^{-1}$ para una $T$ biyectiva.', 4], ['Deshacer un giro seguido de un estiramiento.', 4], ['Decidir si $T:\\mathbb{R}^2\\to\\mathbb{R}^2$ con matriz de determinante $3$ es invertible.', 4],
    ['Decidir si $\\begin{pmatrix}1&2\\\\3&4\\end{pmatrix}$ y $\\begin{pmatrix}1&0\\\\0&5\\end{pmatrix}$ pueden ser semejantes.', 5], ['Si $B=P^{-1}AP$ y $\\operatorname{tr}A=7$, ¿cuánto vale $\\operatorname{tr}B$?', 5], ['Demostrar que dos matrices semejantes tienen el mismo determinante.', 5],
  ];
  gen.eleccion({
    id: 'w6.jefe.estrategia', nivel: 'J6', mundo: 6, habilidades: [], dificultad: 2, confianza: false,
    hacer(rng) {
      const [txt, t] = rng.pick(CLAIMS), otros = rng.sample([0, 1, 2, 3, 4, 5].filter(x => x !== t), 3);
      return { key: txt + '|' + otros.join(''), enun: 'Tienes que resolver: «' + txt + '» ¿Qué herramienta del Mundo 6 es la más adecuada?', ok: MET[t],
        malas: otros.map(m => ['metodo-' + m, MET[m], 'No es la más directa aquí. En este problema: ' + RAZON[t]]),
        pistas: ['Orientación: fíjate en lo que se pide: linealidad, núcleo e imagen, matrices, otra base, inversa o invariantes.', 'Idea clave: cada herramienta del mundo responde a un tipo de pregunta.', 'Primer paso: identifica los datos (fórmula de $T$, bases, matrices).'], expl: 'La herramienta más adecuada es: ' + MET[t] + '. ' + RAZON[t] };
    },
  });

  /* ---------- fase de demostración ---------- */
  dem2(Object.assign({
    id: 'dem.jefe-inyectiva-sobre', enunciadoId: 'jefe.inyectiva-sobre', requiere: ['t.inyectiva-nucleo', 't.rango-nulidad', 't.dim-subespacio'], refsExtra: ['d.nucleo-T', 'd.imagen-T', 'd.inyectiva-lineal'],
    param: rng => ({ t: rng.pick(['T', 'L']), n: rng.pick(['n', 'm']) }),
    enunciado: p => r`Sea $${p.t}:V\to V$ lineal con $\dim V=${p.n}$ finita. Demuestra que $${p.t}$ es inyectiva si y solo si es sobreyectiva.`,
    hip: p => [r`$${p.t}:V\to V$ lineal, $\dim V=${p.n}$`, 'Puedes citar la caracterización de la inyectividad, el teorema de la dimensión y la dimensión de un subespacio'], meta: p => r`inyectiva $\iff$ sobreyectiva`,
    L: p => [
      ['L1', r`Por la caracterización de la inyectividad, $${p.t}$ es inyectiva $\iff\ker ${p.t}=\{0\}\iff\dim\ker ${p.t}=0$.`, 't.inyectiva-nucleo'],
      ['L2', r`Por el teorema de la dimensión, $\dim\operatorname{im}${p.t}=${p.n}-\dim\ker ${p.t}$. Luego $\dim\ker ${p.t}=0\iff\dim\operatorname{im}${p.t}=${p.n}$.`, 't.rango-nulidad', ['L1']],
      ['L3', r`Como $\operatorname{im}${p.t}\subseteq V$ y $\dim V=${p.n}$, por la dimensión de un subespacio, $\dim\operatorname{im}${p.t}=${p.n}\iff\operatorname{im}${p.t}=V$.`, 't.dim-subespacio', ['L2']],
      ['L4', r`Y $\operatorname{im}${p.t}=V$ significa que $${p.t}$ es ⟦h1⟧.`, 'd.inyectiva-lineal', ['L3'], [H('h1', 'sobreyectiva', ['sobreyectiva', 'inyectiva', 'nula'], false)]],
      ['L5', r`Encadenando las equivalencias, inyectiva $\iff$ sobreyectiva. ∎`, 'b.doble-implicacion', ['L1', 'L2', 'L3', 'L4']],
    ],
    dist: p => [[r`En $\mathbb{R}^2$ el giro es inyectivo y sobreyectivo; luego siempre.`, 'un ejemplo no prueba el caso general'], [r`En dimensión infinita también ocurre, así que no hace falta la hipótesis.`, 'en dimensión infinita puede fallar (por ejemplo, el desplazamiento)']],
    err: p => [['L2', r`Por el teorema de la dimensión, $\dim\operatorname{im}${p.t}=${p.n}+\dim\ker ${p.t}$.`, 'error-de-calculo', 'La suma de ambas dimensiones es $n$: se **resta**.'], ['L3', r`Como $\operatorname{im}${p.t}\subseteq V$, $\dim\operatorname{im}${p.t}=${p.n}$ siempre.`, 'conclusion-invalida', 'Solo ocurre cuando el núcleo es trivial.']],
    valida: [['dimension', r`Convertir inyectiva en núcleo $\{0\}$ y usar rango más nulidad`, 'Es la prueba estándar.']],
    idea: p => r`núcleo cero equivale a imagen de dimensión $${p.n}$, que es todo $V$.`, primero: p => r`traduce inyectiva a $\ker ${p.t}=\{0\}$.`,
  }, J));

  dem2(Object.assign({
    id: 'dem.jefe-proyector', enunciadoId: 'jefe.proyector', requiere: ['t.nucleo-imagen-subespacios', 't.lineal-cero-opuesto'], refsExtra: ['d.nucleo-T', 'd.imagen-T', 'b.arbitrario'],
    param: rng => ({ q: rng.pick(['P', 'E']), w: rng.pick(['w', 'z']), u: rng.pick(['u', 'x']) }),
    enunciado: p => r`Sea $${p.q}:V\to V$ lineal con $${p.q}^2=${p.q}$ (un proyector). Demuestra que $\ker ${p.q}\cap\operatorname{im}${p.q}=\{0\}$.`,
    hip: p => [r`$${p.q}$ lineal y $${p.q}\circ ${p.q}=${p.q}$`, 'Puedes citar que núcleo e imagen son subespacios y que $T(0)=0$'], meta: p => r`$\ker ${p.q}\cap\operatorname{im}${p.q}=\{0\}$`,
    L: p => [
      ['L1', r`El cero está en ambos (son subespacios), así que $\{0\}\subseteq\ker ${p.q}\cap\operatorname{im}${p.q}$.`, 't.nucleo-imagen-subespacios'],
      ['L2', r`Recíprocamente, sea $${p.w}\in\ker ${p.q}\cap\operatorname{im}${p.q}$ arbitrario. Como $${p.w}\in\operatorname{im}${p.q}$, existe $${p.u}$ con $${p.w}=${p.q}(${p.u})$.`, 'd.imagen-T', ['L1']],
      ['L3', r`Como $${p.w}\in\ker ${p.q}$, $${p.q}(${p.w})=0$. Pero $${p.q}(${p.w})=${p.q}(${p.q}(${p.u}))=${p.q}^2(${p.u})$, que es igual a ⟦h1⟧.`, 'd.nucleo-T', ['L2'], [H('h1', r`$${p.q}(${p.u})=${p.w}$`, [r`$${p.q}(${p.u})=${p.w}$`, r`$0$`, r`$${p.u}$`], false)]],
      ['L4', r`Entonces $${p.w}=0$ (por L3 igualado con $0$). Luego la intersección es $\{0\}$. ∎`, 't.lineal-cero-opuesto', ['L3']],
    ],
    dist: p => [[r`Con el proyector sobre el eje $x$ la intersección es $\{0\}$; luego siempre.`, 'un ejemplo no prueba el caso general'], [r`Como núcleo e imagen son subespacios, su intersección es $\{0\}$ por defecto.`, 'la intersección de dos subespacios no es siempre $\{0\}$']],
    err: p => [['L3', r`Pero $${p.q}(${p.w})=${p.q}(${p.q}(${p.u}))=${p.q}^2(${p.u})=0$.`, 'error-de-calculo', 'Por la hipótesis, $P^2(u)=P(u)$, no $0$.'], ['L2', r`Como $${p.w}\in\operatorname{im}${p.q}$, $${p.w}=${p.q}(${p.w})$.`, 'conclusion-invalida', 'Hay que tomar un preimagen $u$; $w=P(w)$ es lo que hay que deducir.']],
    valida: [['elemento', r`Tomar $w$ en ambos y usar $P^2=P$`, 'Es la prueba estándar.']],
    idea: p => r`si $${p.w}=${p.q}(${p.u})$ y $${p.q}(${p.w})=0$, entonces $0=${p.q}^2(${p.u})=${p.q}(${p.u})=${p.w}$.`, primero: p => r`toma $${p.w}$ en la intersección y escríbelo como $${p.q}(${p.u})$.`,
  }, J));

  dem2(Object.assign({
    id: 'dem.jefe-traza-cuadrado', enunciadoId: 'jefe.traza-cuadrado', requiere: ['t.semejante-potencias', 't.traza-semejantes'], refsExtra: ['d.semejantes', 'd.traza'],
    param: rng => ({ a: rng.pick(['A', 'M']), b: rng.pick(['B', 'N']), p: rng.pick(['P', 'S']) }),
    enunciado: p => r`Si $${p.b}=${p.p}^{-1}${p.a}${p.p}$ con $${p.p}$ invertible, demuestra que $\operatorname{tr}(${p.b}^2)=\operatorname{tr}(${p.a}^2)$.`,
    hip: p => [r`$${p.b}=${p.p}^{-1}${p.a}${p.p}$`, 'Puedes citar las potencias de matrices semejantes y la invariancia de la traza'], meta: p => r`$\operatorname{tr}(${p.b}^2)=\operatorname{tr}(${p.a}^2)$`,
    L: p => [
      ['L1', r`De $${p.b}=${p.p}^{-1}${p.a}${p.p}$ se despeja $${p.a}=${p.p}${p.b}${p.p}^{-1}$ (multiplicando por $${p.p}$ y $${p.p}^{-1}$).`, 'd.semejantes'],
      ['L2', r`Por el teorema de las potencias de matrices semejantes, $${p.a}^2=${p.p}${p.b}^2${p.p}^{-1}$.`, 't.semejante-potencias', ['L1']],
      ['L3', r`Es decir, $${p.a}^2$ y $${p.b}^2$ son semejantes: $${p.b}^2=${p.p}^{-1}${p.a}^2${p.p}$.`, 'd.semejantes', ['L2']],
      ['L4', r`Por la invariancia de la ⟦h1⟧ por semejanza, $\operatorname{tr}(${p.b}^2)=\operatorname{tr}(${p.a}^2)$. ∎`, 't.traza-semejantes', ['L3'], [H('h1', 'traza', ['traza', 'matriz', 'inversa'], false)]],
    ],
    dist: p => [[r`Con $${p.a}=\mathrm{diag}(1,2)$ y $${p.p}=I$ se cumple; luego siempre.`, 'un ejemplo no prueba el caso general'], [r`Como $${p.b}$ y $${p.a}$ tienen la misma traza, sus cuadrados también.`, 'hay que pasar por la semejanza de los cuadrados']],
    err: p => [['L2', r`Por el teorema de las potencias, $${p.a}^2=${p.p}^2${p.b}^2(${p.p}^{-1})^2$.`, 'error-de-calculo', 'Con $A=PBP^{-1}$ queda $PB^2P^{-1}$; $P$ no se eleva al cuadrado.'], ['L4', r`Por la invariancia del determinante, $\operatorname{tr}(${p.b}^2)=\operatorname{tr}(${p.a}^2)$.`, 'conclusion-invalida', 'Se usa la invariancia de la **traza**.']],
    valida: [['semejanza', r`Probar que $A^2$ y $B^2$ son semejantes y usar la invariancia de la traza`, 'Es la prueba estándar.']],
    idea: p => r`$${p.a}=${p.p}${p.b}${p.p}^{-1}$ implica $${p.a}^2=${p.p}${p.b}^2${p.p}^{-1}$, semejante a $${p.b}^2$.`, primero: p => r`despeja $${p.a}$ en función de $${p.b}$.`,
  }, J));

  if (typeof module !== 'undefined') module.exports = AC;
})(globalThis.AC = globalThis.AC || {});
