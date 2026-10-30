/* Mundo 8 — Jefe: «La Gran Maga de las Estructuras». Sus demostraciones exigen citar teoremas ganados en niveles anteriores. */
(function (AC) {
  const { R, H, T, gen, dem2 } = AC.cont, r = String.raw;
  R.jefe(8, { id: 'J8', titulo: 'La Gran Maga de las Estructuras', estrategia: 'w8.jefe.estrategia', demos: ['dem.jefe-orden-primo-ciclico', 'dem.jefe-fermat-lagrange', 'dem.jefe-hom-coprimos'] });
  const J = { nivel: 'J8', mundo: 8, habilidades: [] };

  /* ---------- fase de estrategia: ¿qué herramienta del Mundo 8? ---------- */
  const MET = ['Axiomas, cancelación e inversos en un grupo', 'Subgrupos y el teorema de Lagrange', 'Homomorfismos: núcleo, imagen y $|G|=|\\ker||\\operatorname{im}|$', 'Unidades de $\\mathbb{Z}_n$ y $\\varphi(n)$', 'Anillos y cuerpos: divisores de cero', 'Órdenes de elementos'];
  const RAZON = ['Se trabaja con la operación de un grupo: inversos, cancelación o tablas.', 'Se pregunta qué órdenes puede tener un subgrupo o cuántas clases laterales hay.', 'Hay una función entre grupos que respeta la operación: núcleo, imagen o conteo de homomorfismos.', 'Se pregunta por inversos módulo $n$, unidades o el orden del grupo multiplicativo.', 'Se pregunta si $\\mathbb{Z}_n$ es cuerpo, divisores de cero o cuántas soluciones tiene una ecuación.', 'Se pide el menor $m$ con $g^m=e$ o el orden de una permutación.'];
  const CLAIMS = [
    ['Decidir si $(\\mathbb{Z},\\cdot)$ es un grupo.', 0], ['Probar que $(ab)^{-1}=b^{-1}a^{-1}$ en un grupo.', 0], ['Completar la tabla de un grupo de orden $4$.', 0],
    ['¿Puede un grupo de orden $15$ tener un subgrupo de orden $4$?', 1], ['Hallar el índice de un subgrupo de orden $6$ en un grupo de orden $30$.', 1], ['Decidir si un subconjunto de $\\mathbb{Z}_{12}$ es subgrupo.', 1],
    ['¿Cuántos homomorfismos hay de $\\mathbb{Z}_{12}$ en $\\mathbb{Z}_{18}$?', 2], ['Hallar $|\\ker\\varphi|$ sabiendo $|\\operatorname{im}\\varphi|$.', 2], ['Decidir si $x\\mapsto3x$ de $\\mathbb{Z}_{10}$ en $\\mathbb{Z}_{6}$ es homomorfismo.', 2],
    ['Calcular $|\\mathbb{Z}_{36}^\\times|$.', 3], ['Hallar el inverso de $7$ módulo $26$.', 3], ['Hallar las unidades de $\\mathbb{Z}_{15}$.', 3],
    ['Decidir si $\\mathbb{Z}_{21}$ es un cuerpo.', 4], ['Hallar los divisores de cero de $\\mathbb{Z}_{12}$.', 4], ['Contar las soluciones de $x^2\\equiv1\\pmod{24}$.', 4],
    ['Hallar el orden de $5$ en $\\mathbb{Z}_{17}^\\times$.', 5], ['Hallar el orden de la permutación $(1\\,2\\,3)(4\\,5)$.', 5], ['Hallar el orden de $8$ en $(\\mathbb{Z}_{20},+)$.', 5],
  ];
  gen.eleccion({
    id: 'w8.jefe.estrategia', nivel: 'J8', mundo: 8, habilidades: [], dificultad: 2, confianza: false,
    hacer(rng) {
      const [txt, t] = rng.pick(CLAIMS), otros = rng.sample([0, 1, 2, 3, 4, 5].filter(x => x !== t), 3);
      return { key: txt + '|' + otros.join(''), enun: 'Tienes que resolver: «' + txt + '» ¿Qué herramienta del Mundo 8 es la más adecuada?', ok: MET[t],
        malas: otros.map(m => ['metodo-' + m, MET[m], 'No es la más directa aquí. En este problema: ' + RAZON[t]]),
        pistas: ['Orientación: fíjate en lo que se pide: axiomas, subgrupos, homomorfismos, unidades, cuerpos u órdenes.', 'Idea clave: cada herramienta del mundo responde a un tipo de pregunta.', 'Primer paso: identifica la estructura (grupo, anillo, cuerpo) y la operación.'], expl: 'La herramienta más adecuada es: ' + MET[t] + '. ' + RAZON[t] };
    },
  });

  /* ---------- fase de demostración ---------- */
  dem2(Object.assign({
    id: 'dem.jefe-orden-primo-ciclico', enunciadoId: 'jefe.orden-primo-ciclico', requiere: ['t.orden-divide', 't.lagrange'], refsExtra: ['d.orden-elemento', 'd.primo'],
    param: rng => ({ g: rng.pick(['g', 'a']), p: rng.pick(['p', 'q']) }),
    enunciado: p => r`Sea $G$ un grupo de orden primo $${p.p}$. Demuestra que $G$ es cíclico: todo $${p.g}\neq e$ lo genera.`,
    hip: p => [r`$|G|=${p.p}$ primo y $${p.g}\in G$, $${p.g}\neq e$`, 'Puedes citar que el orden de un elemento divide al del grupo y el teorema de Lagrange'], meta: p => r`$\langle ${p.g}\rangle=G$`,
    L: p => [
      ['L1', r`Por el teorema del orden de un elemento, $\operatorname{ord}(${p.g})$ divide a $|G|=${p.p}$.`, 't.orden-divide'],
      ['L2', r`Como $${p.p}$ es primo, sus únicos divisores positivos son $1$ y $${p.p}$.`, 'd.primo', ['L1']],
      ['L3', r`Como $${p.g}\neq e$, $\operatorname{ord}(${p.g})\neq1$; luego $\operatorname{ord}(${p.g})=${p.p}$.`, 'd.orden-elemento', ['L2']],
      ['L4', r`Entonces $\langle ${p.g}\rangle$ tiene $${p.p}$ elementos, y es un subgrupo de $G$ con $|G|=${p.p}$ elementos: por ⟦h1⟧, $\langle ${p.g}\rangle=G$. ∎`, 't.lagrange', ['L3'], [H('h1', 'tener el mismo número de elementos (finitos)', ['tener el mismo número de elementos (finitos)', 'ser conmutativos', 'ser cíclicos'], false)]],
    ],
    dist: p => [[r`$\mathbb{Z}_5$ es cíclico y $5$ es primo; luego siempre.`, 'un ejemplo no prueba el caso general'], [r`Como $|G|$ es primo, $G$ no tiene subgrupos, y por eso es cíclico.`, 'tiene los subgrupos triviales; el argumento es sobre el orden de un elemento']],
    err: p => [['L2', r`Como $${p.p}$ es primo, sus únicos divisores positivos son $${p.p}$ y $${p.p}^2$.`, 'error-de-calculo', 'Los divisores de un primo son $1$ y $p$.'], ['L3', r`Como $${p.g}\neq e$, $\operatorname{ord}(${p.g})\neq ${p.p}$; luego $\operatorname{ord}(${p.g})=1$.`, 'error-de-calculo', 'Al revés: $g\\neq e$ descarta el orden $1$.']],
    valida: [['orden', r`Usar que $\operatorname{ord}(g)\mid p$ y $\operatorname{ord}(g)\neq1$`, 'Es la prueba estándar.']],
    idea: p => r`$\operatorname{ord}(${p.g})$ divide al primo $${p.p}$ y no vale $1$.`, primero: p => r`aplica que el orden de $${p.g}$ divide a $|G|$.`,
  }, J));

  dem2(Object.assign({
    id: 'dem.jefe-fermat-lagrange', enunciadoId: 'jefe.fermat-lagrange', requiere: ['t.unidades-grupo', 't.orden-divide', 't.zn-cuerpo'], refsExtra: ['d.unidades-zn', 'd.primo', 'd.congruencia'],
    param: rng => ({ a: rng.pick(['a', 'x']), p: rng.pick(['p', 'q']) }),
    enunciado: p => r`Sea $${p.p}$ primo y $${p.a}$ un entero con $${p.p}\nmid ${p.a}$. Demuestra que $${p.a}^{${p.p}-1}\equiv1\pmod ${p.p}$ usando teoría de grupos.`,
    hip: p => [r`$${p.p}$ primo y $${p.p}\nmid ${p.a}$`, 'Puedes citar el grupo de unidades de $\\mathbb{Z}_n$, que $\\mathbb{Z}_p$ es cuerpo y que $g^{|G|}=e$'], meta: p => r`$${p.a}^{${p.p}-1}\equiv1\pmod ${p.p}$`,
    L: p => [
      ['L1', r`Como $${p.p}$ es primo, $\mathbb{Z}_${p.p}$ es un cuerpo: toda clase no nula es una unidad.`, 't.zn-cuerpo'],
      ['L2', r`El grupo de unidades $\mathbb{Z}_${p.p}^\times$ tiene $\varphi(${p.p})=${p.p}-1$ elementos (todas las clases no nulas).`, 't.unidades-grupo', ['L1']],
      ['L3', r`La clase $[${p.a}]$ es no nula (pues $${p.p}\nmid ${p.a}$), así que está en $\mathbb{Z}_${p.p}^\times$.`, 'd.unidades-zn', ['L1']],
      ['L4', r`Por el teorema del orden de un elemento, $[${p.a}]^{|G|}=e$ con $|G|=${p.p}-1$ y $e=[1]$: $[${p.a}]^{${p.p}-1}=[1]$.`, 't.orden-divide', ['L2', 'L3']],
      ['L5', r`Es decir, $${p.a}^{${p.p}-1}\equiv1\pmod ${p.p}$, que es el pequeño teorema de ⟦h1⟧. ∎`, 'd.congruencia', ['L4'], [H('h1', 'Fermat', ['Fermat', 'Bézout', 'Lagrange'], false)]],
    ],
    dist: p => [[r`Con $p=7$ y $a=3$: $3^6=729\equiv1$; luego siempre.`, 'un ejemplo no prueba el caso general'], [r`Como $${p.a}^{${p.p}}\equiv ${p.a}$ siempre, se sigue el resultado.`, 'es otra forma del teorema, no una demostración con grupos']],
    err: p => [['L2', r`El grupo de unidades $\mathbb{Z}_${p.p}^\times$ tiene $${p.p}$ elementos.`, 'error-de-calculo', 'No incluye el $0$: tiene $p-1$ elementos.'], ['L4', r`Por el teorema del orden, $[${p.a}]^{|G|}=e$ con $|G|=${p.p}$.`, 'error-de-calculo', 'Aquí $|G|=p-1$.']],
    valida: [['lagrange', r`Aplicar $g^{|G|}=e$ al grupo de unidades de $\mathbb{Z}_p$`, 'Es la prueba estándar.'], ['induccion-binomial', r`Inducción sobre $a$ con el binomio de Newton`, 'Válida, pero no usa teoría de grupos.']],
    idea: p => r`$\mathbb{Z}_${p.p}^\times$ tiene orden $${p.p}-1$ y todo elemento elevado al orden del grupo vale $1$.`, primero: p => r`describe el grupo $\mathbb{Z}_${p.p}^\times$ y su orden.`,
  }, J));

  dem2(Object.assign({
    id: 'dem.jefe-hom-coprimos', enunciadoId: 'jefe.hom-coprimos', requiere: ['t.orden-hom-divide', 't.nucleo-subgrupo'], refsExtra: ['d.homomorfismo', 'd.mcd'],
    param: rng => ({ f: rng.pick(['φ', 'f']), g: rng.pick(['g', 'x']) }),
    enunciado: p => r`Sean $G,K$ grupos finitos con $\gcd(|G|,|K|)=1$. Demuestra que el único homomorfismo $${p.f}:G\to K$ es el trivial ($${p.f}(${p.g})=e$ para todo $${p.g}$).`,
    hip: p => [r`$\gcd(|G|,|K|)=1$ y $${p.f}:G\to K$ homomorfismo`, 'Puedes citar que $|\\operatorname{im}\\varphi|$ divide a $\\gcd(|G|,|K|)$ y que la imagen es subgrupo'], meta: p => r`$${p.f}(${p.g})=e$ para todo $${p.g}\in G$`,
    L: p => [
      ['L1', r`Por el teorema de órdenes de homomorfismos, $|\operatorname{im}${p.f}|$ divide a $\gcd(|G|,|K|)=1$.`, 't.orden-hom-divide'],
      ['L2', r`Entonces $|\operatorname{im}${p.f}|=1$: la imagen es un subgrupo con un solo elemento, y todo subgrupo contiene al neutro.`, 't.nucleo-subgrupo', ['L1']],
      ['L3', r`Luego $\operatorname{im}${p.f}=\{e\}$: para todo $${p.g}\in G$, $${p.f}(${p.g})\in\operatorname{im}${p.f}$ y por tanto ⟦h1⟧.`, 'd.homomorfismo', ['L2'], [H('h1', r`$${p.f}(${p.g})=e$`, [r`$${p.f}(${p.g})=e$`, r`$${p.f}(${p.g})=${p.g}$`, r`$${p.g}=e$`], false)]],
      ['L4', r`Es decir, $${p.f}$ es el homomorfismo trivial. ∎`, 'd.homomorfismo', ['L3']],
    ],
    dist: p => [[r`De $\mathbb{Z}_3$ a $\mathbb{Z}_4$ el único homomorfismo es el trivial; luego siempre.`, 'un ejemplo no prueba el caso general'], [r`Como los órdenes son coprimos, no existen homomorfismos.`, 'siempre existe el trivial']],
    err: p => [['L1', r`Por el teorema, $|\operatorname{im}${p.f}|$ es múltiplo de $\gcd(|G|,|K|)=1$.`, 'error-de-calculo', 'Divide al mcd, no es un múltiplo.'], ['L2', r`Entonces $|\operatorname{im}${p.f}|=1$ y por tanto $\ker ${p.f}=\{e\}$.`, 'conclusion-invalida', 'Con imagen de un elemento el núcleo es todo $G$.']],
    valida: [['imagen', r`Probar que la imagen tiene un solo elemento`, 'Es la prueba estándar.']],
    idea: p => r`$|\operatorname{im}${p.f}|$ divide a $\gcd(|G|,|K|)=1$, luego la imagen es $\{e\}$.`, primero: p => r`aplica el teorema de órdenes de un homomorfismo.`,
  }, J));

  if (typeof module !== 'undefined') module.exports = AC;
})(globalThis.AC = globalThis.AC || {});
