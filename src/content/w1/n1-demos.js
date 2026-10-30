/* Mundo 1, nivel 1.1 — demostraciones: cada una es un grafo de líneas con justificaciones, distractores, errores y estrategias. */
(function (AC) {
  const R = AC.registrar, r = String.raw;
  const { NOMBRES } = AC.w1;
  const w = b => (b ? 'verdadera' : 'falsa');
  const W2 = ['verdadera', 'falsa'];
  const H = (id, correcta, opciones, math) => ({ id, correcta, opciones, math: math !== false });

  /* respuesta modelo: las líneas en orden de referencia, con los huecos rellenos */
  const modeloDe = (lineasFn) => p => lineasFn(p).map((l, i) => (i + 1) + '. ' + l.texto.replace(/⟦(\w+)⟧/g, (m, id) => { const h = (l.huecos || []).find(x => x.id === id); return h ? (h.math === false ? h.correcta : '$' + h.correcta + '$') : ''; })).join('\n');

  /* ---------- De Morgan (tabla de verdad por casos; con parámetro de dualidad) ---------- */
  const dm = {
    f: p => p.dual ? r`$\neg(${p.P}\vee ${p.Q})$` : r`$\neg(${p.P}\wedge ${p.Q})$`,
    g: p => p.dual ? r`$\neg ${p.P}\wedge\neg ${p.Q}$` : r`$\neg ${p.P}\vee\neg ${p.Q}$`,
    interna: (p, vp, vq) => p.dual ? (vp || vq) : (vp && vq),
    derecha: (p, vp, vq) => p.dual ? (!vp && !vq) : (!vp || !vq),
  };
  const casosDM = (p, malo) => [[true, true], [true, false], [false, true], [false, false]].map(([vp, vq], i) => {
    const op = p.dual ? r`\vee` : r`\wedge`, opD = p.dual ? r`\wedge` : r`\vee`;
    let vi = dm.interna(p, vp, vq), izq = !vi, der = dm.derecha(p, vp, vq);
    if (malo && i === 1) { vi = !vi; izq = !izq; }
    return {
      id: 'L' + (i + 1),
      texto: r`Si $${p.P}$ es ${w(vp)} y $${p.Q}$ es ${w(vq)}: $${p.P}${op} ${p.Q}$ es ${w(vi)}, luego $\neg(${p.P}${op} ${p.Q})$ es ⟦h1⟧; además $\neg ${p.P}$ es ${w(!vp)} y $\neg ${p.Q}$ es ${w(!vq)}, luego $\neg ${p.P}${opD}\neg ${p.Q}$ es ⟦h2⟧. Coinciden.`,
      just: { tipo: 'definicion', ref: 'd.conectivos' }, deps: ['L0'],
      huecos: [H('h1', w(izq), W2, false), H('h2', w(der), W2, false)],
    };
  });
  const dmLineas = p => [
    { id: 'L0', texto: r`Dos fórmulas son equivalentes si toman el mismo valor de verdad en cada asignación de valores a $${p.P}$ y $${p.Q}$; las cuatro asignaciones se revisan una por una.`, just: { tipo: 'definicion', ref: 'd.equivalencia-logica' }, deps: [] },
    ...casosDM(p),
    { id: 'L5', texto: r`Las dos fórmulas toman el mismo valor en las cuatro asignaciones; por tanto son equivalentes. ∎`, just: { tipo: 'definicion', ref: 'd.equivalencia-logica' }, deps: ['L1', 'L2', 'L3', 'L4'] },
  ];
  R.demostracion({
    id: 'dem.demorgan-prop', teorema: 't.demorgan-prop', enunciadoId: 't.demorgan-prop', mundo: 1, nivel: '1.1',
    habilidades: ['1.1.negacion', '1.1.demostrar'], requiere: [],
    parametros(rng) { const s = rng.pick(NOMBRES); return { P: s[0], Q: s[1], dual: rng.chance(0.5) }; },
    enunciado: p => r`Demuestra que ${dm.f(p)} es equivalente a ${dm.g(p)}.`,
    hipotesis: p => [r`$${p.P}$ y $${p.Q}$ son proposiciones cualesquiera`],
    meta: p => r`${dm.f(p)} $\equiv$ ${dm.g(p)}`,
    lineas: dmLineas, orden_referencia: ['L0', 'L1', 'L2', 'L3', 'L4', 'L5'],
    distractores: p => [
      { texto: r`Como ${dm.f(p)} es verdadera en la asignación en que $${p.P}$ es verdadera y $${p.Q}$ es falsa, la equivalencia queda probada.`, falla: 'un solo caso no prueba una equivalencia' },
      { texto: p.dual ? r`Distribuimos la negación: $\neg(${p.P}\vee ${p.Q})=\neg ${p.P}\vee\neg ${p.Q}$.` : r`Distribuimos la negación: $\neg(${p.P}\wedge ${p.Q})=\neg ${p.P}\wedge\neg ${p.Q}$.`, falla: 'la negación cambia el conector; no se «reparte» sin más' },
      { texto: r`Suponemos que ${dm.g(p)} es verdadera y deducimos que ${dm.f(p)} lo es; con eso basta.`, falla: 'solo prueba un sentido' },
    ],
    errores: p => [
      { sustituye: 'L2', texto: casosDM(p, true)[1].texto.replace(/⟦h1⟧/, w(dm.interna(p, true, false))).replace(/⟦h2⟧/, w(dm.derecha(p, true, false))), diagnostico: 'error-de-calculo', opciones: ['error-de-calculo', 'circular', 'no-justificado', 'caso-faltante'], explicacion: 'El valor de la conjunción o disyunción en esa fila está mal calculado.' },
      { sustituye: 'L5', texto: r`Como las dos fórmulas coinciden en la primera asignación, son equivalentes. ∎`, diagnostico: 'caso-faltante', opciones: ['caso-faltante', 'error-de-calculo', 'circular', 'demorgan-mal'], explicacion: 'Hay que revisar las cuatro asignaciones, no solo una.' },
      { sustituye: 'L0', texto: r`Basta comprobar la asignación en que $${p.P}$ y $${p.Q}$ son verdaderas.`, diagnostico: 'caso-faltante', opciones: ['caso-faltante', 'circular', 'no-justificado', 'conclusion-invalida'], explicacion: 'Una equivalencia exige coincidencia en todas las filas.' },
    ],
    estrategias: [
      { id: 'tabla', texto: 'Comparar las cuatro filas de la tabla de verdad', valida: true, nota: 'Es el método directo: dos fórmulas son equivalentes exactamente cuando sus tablas coinciden.' },
      { id: 'casos', texto: 'Dividir en casos según los valores de las dos letras', valida: true, nota: 'Es la misma idea escrita por casos.' },
      { id: 'contradiccion', texto: 'Suponer que existe una fila donde difieren y llegar a una contradicción', valida: true, nota: 'Funciona, pero acaba revisando las mismas cuatro filas.' },
      { id: 'ejemplo', texto: 'Verificar un solo ejemplo concreto', valida: false, nota: 'Un ejemplo no basta: la equivalencia exige todas las filas.' },
      { id: 'induccion', texto: 'Inducción sobre el número de letras', valida: false, nota: 'Aquí solo hay dos letras: no hay estructura recursiva que aprovechar.' },
    ],
    criterios: ['Dije qué significa que dos fórmulas sean equivalentes', 'Revisé las cuatro asignaciones de valores', 'Calculé el valor de ambas fórmulas en cada una', 'Concluí que coinciden en todas'],
    modelo: modeloDe(dmLineas),
    pistas: p => ['Orientación: ¿qué hay que comparar para decidir si dos fórmulas son equivalentes?', 'Idea clave: con dos letras hay cuatro asignaciones; calcula ambos lados en cada una.', r`Primer paso: toma $${p.P}$ y $${p.Q}$ ambas verdaderas y evalúa los dos lados.`],
  });

  /* ---------- Contrapositiva (cadena de equivalencias) ---------- */
  const cpLineas = p => {
    const { P, Q } = p;
    return [
      { id: 'L1', texto: r`Por la definición de la implicación, $${P}\to ${Q}\equiv$ ⟦h1⟧.`, just: { tipo: 'definicion', ref: 'd.implicacion' }, deps: [], huecos: [H('h1', r`\neg ${P}\vee ${Q}`, [r`${P}\vee\neg ${Q}`, r`\neg ${P}\wedge ${Q}`, r`\neg(${P}\vee ${Q})`, r`${Q}\to ${P}`])] },
      { id: 'L2', texto: r`Por la conmutatividad de $\vee$: $\neg ${P}\vee ${Q}\equiv$ ⟦h2⟧.`, just: { tipo: 'propiedad-base', ref: 'b.conmutatividad' }, deps: ['L1'], huecos: [H('h2', r`${Q}\vee\neg ${P}`, [r`${P}\vee\neg ${Q}`, r`\neg ${Q}\vee ${P}`, r`${Q}\wedge\neg ${P}`])] },
      { id: 'L3', texto: r`Como $${Q}\equiv\neg\neg ${Q}$: $${Q}\vee\neg ${P}\equiv\neg\neg ${Q}\vee\neg ${P}$.`, just: { tipo: 'propiedad-base', ref: 'b.doble-negacion' }, deps: ['L2'] },
      { id: 'L4', texto: r`Aplicando la definición de la implicación a $\neg ${Q}$ y $\neg ${P}$: $\neg\neg ${Q}\vee\neg ${P}\equiv$ ⟦h3⟧.`, just: { tipo: 'definicion', ref: 'd.implicacion' }, deps: ['L3'], huecos: [H('h3', r`\neg ${Q}\to\neg ${P}`, [r`\neg ${P}\to\neg ${Q}`, r`${Q}\to ${P}`, r`\neg ${Q}\wedge\neg ${P}`])] },
      { id: 'L5', texto: r`Encadenando las equivalencias anteriores: $${P}\to ${Q}\equiv\neg ${Q}\to\neg ${P}$. ∎`, just: { tipo: 'propiedad-base', ref: 'b.transitividad-equiv' }, deps: ['L1', 'L2', 'L3', 'L4'] },
    ];
  };
  R.demostracion({
    id: 'dem.contrapositiva', teorema: 't.contrapositiva', enunciadoId: 't.contrapositiva', mundo: 1, nivel: '1.1',
    habilidades: ['1.1.contrapositiva', '1.1.demostrar'], requiere: [],
    parametros(rng) { const s = rng.pick(NOMBRES); return { P: s[0], Q: s[1] }; },
    enunciado: p => r`Demuestra que $${p.P}\to ${p.Q}$ es equivalente a su contrapositiva $\neg ${p.Q}\to\neg ${p.P}$.`,
    hipotesis: p => [r`$${p.P}$ y $${p.Q}$ son proposiciones cualesquiera`],
    meta: p => r`$${p.P}\to ${p.Q}\equiv\neg ${p.Q}\to\neg ${p.P}$`,
    lineas: cpLineas, orden_referencia: ['L1', 'L2', 'L3', 'L4', 'L5'],
    distractores: p => [
      { texto: r`Intercambiamos antecedente y consecuente: $${p.P}\to ${p.Q}\equiv ${p.Q}\to ${p.P}$.`, falla: 'confunde la contrapositiva con la recíproca' },
      { texto: r`Como $${p.P}\to ${p.Q}$ es verdadera, también lo es $\neg ${p.P}\to\neg ${p.Q}$.`, falla: 'la inversa no equivale a la original' },
    ],
    errores: p => [
      { sustituye: 'L2', texto: r`Por la conmutatividad de $\vee$: $\neg ${p.P}\vee ${p.Q}\equiv ${p.P}\vee\neg ${p.Q}$.`, diagnostico: 'error-de-calculo', opciones: ['error-de-calculo', 'circular', 'caso-faltante', 'no-justificado'], explicacion: 'Conmutar solo intercambia los lados; aquí además se cambió la negación de sitio.' },
      { sustituye: 'L4', texto: r`Aplicando la definición de la implicación: $\neg\neg ${p.Q}\vee\neg ${p.P}\equiv\neg ${p.P}\to\neg ${p.Q}$.`, diagnostico: 'forma-equivocada', opciones: ['forma-equivocada', 'circular', 'caso-faltante', 'no-justificado'], explicacion: 'Eso da la inversa, no la contrapositiva: la definición A→B ≡ ¬A∨B aplicada aquí lleva a ¬Q→¬P.' },
      { sustituye: 'L5', texto: r`Como $${p.P}\to ${p.Q}$ y $\neg ${p.Q}\to\neg ${p.P}$ son verdaderas en la primera fila, son equivalentes. ∎`, diagnostico: 'conclusion-invalida', opciones: ['conclusion-invalida', 'error-de-calculo', 'circular', 'caso-faltante'], explicacion: 'Una fila no prueba una equivalencia.' },
    ],
    estrategias: [
      { id: 'cadena', texto: 'Encadenar equivalencias a partir de la definición de la implicación', valida: true, nota: 'Es la prueba algebraica: ¬P∨Q, conmutar, doble negación y volver a la implicación.' },
      { id: 'tabla', texto: 'Comparar las cuatro filas de la tabla de verdad', valida: true, nota: 'Siempre funciona para fórmulas con pocas letras; es más larga que la cadena.' },
      { id: 'contradiccion', texto: 'Suponer P→Q verdadera y ¬Q→¬P falsa, y llegar a una contradicción', valida: true, nota: 'Una implicación falsa exige ¬Q verdadera y ¬P falsa, es decir P verdadera y Q falsa, lo que contradice la primera.' },
      { id: 'ejemplo', texto: 'Probar con un ejemplo en lenguaje natural', valida: false, nota: 'Un ejemplo ilustra, pero no demuestra que valga siempre.' },
      { id: 'reciproca', texto: 'Demostrar la recíproca Q→P', valida: false, nota: 'La recíproca es otra proposición: no equivale a la original.' },
    ],
    criterios: ['Partí de la definición de la implicación', 'Usé conmutatividad y doble negación donde hacía falta', 'Reconocí la contrapositiva al final', 'Concluí por transitividad de la equivalencia'],
    modelo: modeloDe(cpLineas),
    pistas: p => ['Orientación: convierte la implicación en una disyunción y trabaja con ella.', r`Idea clave: $${p.P}\to ${p.Q}\equiv\neg ${p.P}\vee ${p.Q}$; conmuta y usa la doble negación sobre $${p.Q}$.`, r`Primer paso: escribe $${p.P}\to ${p.Q}\equiv\neg ${p.P}\vee ${p.Q}$.`],
  });

  /* ---------- Negación de una implicación (usa De Morgan) ---------- */
  const niLineas = p => {
    const { P, Q } = p;
    return [
      { id: 'L1', texto: r`Por la definición de la implicación: $\neg(${P}\to ${Q})\equiv\neg(\neg ${P}\vee ${Q})$.`, just: { tipo: 'definicion', ref: 'd.implicacion' }, deps: [] },
      { id: 'L2', texto: r`Por De Morgan: $\neg(\neg ${P}\vee ${Q})\equiv$ ⟦h1⟧.`, just: { tipo: 'teorema', ref: 't.demorgan-prop' }, deps: ['L1'], huecos: [H('h1', r`\neg\neg ${P}\wedge\neg ${Q}`, [r`\neg\neg ${P}\vee\neg ${Q}`, r`\neg ${P}\wedge\neg ${Q}`, r`\neg ${P}\vee\neg ${Q}`])] },
      { id: 'L3', texto: r`Por la doble negación: $\neg\neg ${P}\wedge\neg ${Q}\equiv ${P}\wedge\neg ${Q}$.`, just: { tipo: 'propiedad-base', ref: 'b.doble-negacion' }, deps: ['L2'] },
      { id: 'L4', texto: r`Por transitividad de $\equiv$: $\neg(${P}\to ${Q})\equiv ${P}\wedge\neg ${Q}$. ∎`, just: { tipo: 'propiedad-base', ref: 'b.transitividad-equiv' }, deps: ['L1', 'L2', 'L3'] },
    ];
  };
  R.demostracion({
    id: 'dem.neg-implicacion', teorema: 't.neg-implicacion', enunciadoId: 't.neg-implicacion', mundo: 1, nivel: '1.1',
    habilidades: ['1.1.negacion', '1.1.demostrar'], requiere: ['t.demorgan-prop'], refsExtra: ['d.bicondicional', 'b.asociatividad'],
    parametros(rng) { const s = rng.pick(NOMBRES); return { P: s[0], Q: s[1] }; },
    enunciado: p => r`Demuestra que $\neg(${p.P}\to ${p.Q})$ es equivalente a $${p.P}\wedge\neg ${p.Q}$.`,
    hipotesis: p => [r`$${p.P}$ y $${p.Q}$ son proposiciones cualesquiera`, 'Puedes citar las leyes de De Morgan, ya demostradas'],
    meta: p => r`$\neg(${p.P}\to ${p.Q})\equiv ${p.P}\wedge\neg ${p.Q}$`,
    lineas: niLineas, orden_referencia: ['L1', 'L2', 'L3', 'L4'],
    distractores: p => [
      { texto: r`Negamos ambas partes de la implicación: $\neg(${p.P}\to ${p.Q})\equiv\neg ${p.P}\to\neg ${p.Q}$.`, falla: 'negar una implicación no es negar sus dos partes' },
      { texto: r`Por De Morgan: $\neg(\neg ${p.P}\vee ${p.Q})\equiv\neg\neg ${p.P}\vee\neg ${p.Q}$.`, falla: 'De Morgan cambia el conector' },
    ],
    errores: p => [
      { sustituye: 'L2', texto: r`Por De Morgan: $\neg(\neg ${p.P}\vee ${p.Q})\equiv\neg\neg ${p.P}\vee\neg ${p.Q}$.`, diagnostico: 'demorgan-mal', opciones: ['demorgan-mal', 'error-de-calculo', 'circular', 'caso-faltante'], explicacion: 'Al negar una disyunción el conector pasa a ser ∧.' },
      { sustituye: 'L3', texto: r`Por la doble negación: $\neg\neg ${p.P}\wedge\neg ${p.Q}\equiv ${p.P}\wedge ${p.Q}$.`, diagnostico: 'error-de-calculo', opciones: ['error-de-calculo', 'demorgan-mal', 'circular', 'no-justificado'], explicacion: 'La doble negación solo afecta a la primera letra; ¬Q se queda.' },
      { sustituye: 'L1', texto: r`Por la definición de la implicación: $\neg(${p.P}\to ${p.Q})\equiv\neg(${p.P}\vee\neg ${p.Q})$.`, diagnostico: 'error-de-calculo', opciones: ['error-de-calculo', 'circular', 'caso-faltante', 'no-justificado'], explicacion: 'La definición es P→Q ≡ ¬P∨Q, no P∨¬Q.' },
    ],
    estrategias: [
      { id: 'cadena', texto: 'Encadenar equivalencias: definición de →, De Morgan y doble negación', valida: true, nota: 'Es la prueba natural cuando ya se dispone de De Morgan.' },
      { id: 'tabla', texto: 'Comparar las cuatro filas de la tabla de verdad', valida: true, nota: 'Siempre válida; no aprovecha los teoremas ya ganados.' },
      { id: 'ejemplo', texto: 'Comprobar con un ejemplo en lenguaje natural', valida: false, nota: 'Un ejemplo no prueba una equivalencia general.' },
      { id: 'induccion', texto: 'Inducción sobre la longitud de la fórmula', valida: false, nota: 'Es innecesaria aquí: hay una cadena finita de pasos.' },
    ],
    criterios: ['Reescribí la implicación como disyunción', 'Cité De Morgan al negar la disyunción', 'Usé la doble negación', 'Concluí por transitividad'],
    modelo: modeloDe(niLineas),
    pistas: p => ['Orientación: ¿puedes escribir la implicación de otra forma para poder negarla?', r`Idea clave: $${p.P}\to ${p.Q}\equiv\neg ${p.P}\vee ${p.Q}$ y luego De Morgan.`, r`Primer paso: escribe $\neg(\neg ${p.P}\vee ${p.Q})$.`],
  });

  /* ---------- Silogismo hipotético (demostración condicional) ---------- */
  const shLineas = p => {
    const { P, Q, R: R3 } = p;
    return [
      { id: 'L1', texto: r`Supongamos que $${P}\to ${Q}$ y $${Q}\to ${R3}$ son verdaderas.`, just: { tipo: 'hipotesis', ref: 'hip' }, deps: [] },
      { id: 'L2', texto: r`Para probar que $${P}\to ${R3}$ es verdadera, suponemos que $${P}$ es verdadera y debemos deducir $${R3}$.`, just: { tipo: 'propiedad-base', ref: 'b.prueba-condicional' }, deps: ['L1'] },
      { id: 'L3', texto: r`Como $${P}$ es verdadera y $${P}\to ${Q}$ es verdadera, $${Q}$ es ⟦h1⟧.`, just: { tipo: 'definicion', ref: 'd.implicacion-valor' }, deps: ['L1', 'L2'], huecos: [H('h1', 'verdadera', ['verdadera', 'falsa'], false)] },
      { id: 'L4', texto: r`Como $${Q}$ es verdadera y $${Q}\to ${R3}$ es verdadera, $${R3}$ es verdadera.`, just: { tipo: 'definicion', ref: 'd.implicacion-valor' }, deps: ['L1', 'L3'] },
      { id: 'L5', texto: r`Hemos deducido $${R3}$ suponiendo $${P}$; por tanto $${P}\to ${R3}$ es verdadera. ∎`, just: { tipo: 'propiedad-base', ref: 'b.prueba-condicional' }, deps: ['L2', 'L4'] },
    ];
  };
  R.demostracion({
    id: 'dem.silogismo-hipotetico', teorema: 't.silogismo-hipotetico', enunciadoId: 't.silogismo-hipotetico', mundo: 1, nivel: '1.1',
    habilidades: ['1.1.equivalencia', '1.1.demostrar'], requiere: [], refsExtra: ['d.conectivos', 'b.casos'],
    parametros(rng) { const s = rng.pick(NOMBRES); return { P: s[0], Q: s[1], R: s[2] }; },
    enunciado: p => r`Demuestra: si $${p.P}\to ${p.Q}$ y $${p.Q}\to ${p.R}$ son verdaderas, entonces $${p.P}\to ${p.R}$ es verdadera.`,
    hipotesis: p => [r`$${p.P}\to ${p.Q}$ es verdadera`, r`$${p.Q}\to ${p.R}$ es verdadera`],
    meta: p => r`$${p.P}\to ${p.R}$ es verdadera`,
    lineas: shLineas, orden_referencia: ['L1', 'L2', 'L3', 'L4', 'L5'],
    distractores: p => [
      { texto: r`Como $${p.P}\to ${p.R}$ es verdadera, $${p.P}$ y $${p.R}$ son verdaderas.`, falla: 'una implicación verdadera no asegura que su antecedente lo sea' },
      { texto: r`Como $${p.Q}$ es verdadera y $${p.P}\to ${p.Q}$ es verdadera, $${p.P}$ es verdadera.`, falla: 'afirma el consecuente (falacia)' },
    ],
    errores: p => [
      { sustituye: 'L3', texto: r`Como $${p.P}\to ${p.Q}$ es verdadera y $${p.Q}$ es verdadera, $${p.P}$ es verdadera.`, diagnostico: 'conclusion-invalida', opciones: ['conclusion-invalida', 'error-de-calculo', 'circular', 'caso-faltante'], explicacion: 'Afirmar el consecuente no permite concluir el antecedente.' },
      { sustituye: 'L4', texto: r`Como $${p.Q}\to ${p.R}$ es verdadera y $${p.R}$ es verdadera, $${p.Q}$ es verdadera.`, diagnostico: 'conclusion-invalida', opciones: ['conclusion-invalida', 'error-de-calculo', 'circular', 'caso-faltante'], explicacion: 'De R verdadera no se sigue Q verdadera.' },
      { sustituye: 'L5', texto: r`Por tanto $${p.P}$ y $${p.R}$ son verdaderas. ∎`, diagnostico: 'no-justificado', opciones: ['no-justificado', 'error-de-calculo', 'circular', 'caso-faltante'], explicacion: 'Lo que se debe concluir es la implicación P→R, no que P y R sean verdaderas.' },
    ],
    estrategias: [
      { id: 'condicional', texto: 'Suponer P verdadera y deducir R', valida: true, nota: 'Es la forma natural de probar una implicación.' },
      { id: 'contrapositiva', texto: 'Probar la contrapositiva ¬R → ¬P', valida: true, nota: 'Si R es falsa, Q es falsa por Q→R, y P es falsa por P→Q.' },
      { id: 'tabla', texto: 'Revisar las ocho filas de la tabla de verdad', valida: true, nota: 'Es válida pero larga con tres letras.' },
      { id: 'ejemplo', texto: 'Verificar un ejemplo concreto', valida: false, nota: 'Un ejemplo no demuestra una afirmación general.' },
      { id: 'reciproca', texto: 'Demostrar la recíproca R → P', valida: false, nota: 'La recíproca es otra proposición.' },
    ],
    criterios: ['Declaré las hipótesis', 'Supuse el antecedente para probar la implicación', 'Encadené los dos pasos Q y R', 'Concluí la implicación P→R'],
    modelo: modeloDe(shLineas),
    pistas: p => ['Orientación: para probar una implicación se supone su antecedente.', r`Idea clave: de $${p.P}$ y $${p.P}\to ${p.Q}$ sale $${p.Q}$; de $${p.Q}$ y $${p.Q}\to ${p.R}$ sale $${p.R}$.`, r`Primer paso: supón que $${p.P}$ es verdadera.`],
  });

  /* ---------- Distributividad (por casos sobre P; con dual) ---------- */
  const dsLineas = p => {
    const { P, Q, R: R3, dual } = p;
    const o1 = dual ? r`\vee` : r`\wedge`, o2 = dual ? r`\wedge` : r`\vee`;
    const abs = dual ? 'verdadera' : 'falsa', neu = dual ? 'falsa' : 'verdadera';
    const dentro = r`${Q}${o2} ${R3}`;
    return [
      { id: 'L0', texto: r`Distinguimos dos casos según el valor de $${P}$: falsa o verdadera.`, just: { tipo: 'propiedad-base', ref: 'b.casos' }, deps: [] },
      { id: 'L1', texto: r`Si $${P}$ es ${abs}: $${P}${o1}(${dentro})$ es ${abs}, y $${P}${o1} ${Q}$ y $${P}${o1} ${R3}$ son ${abs}, así que $(${P}${o1} ${Q})${o2}(${P}${o1} ${R3})$ es ⟦h1⟧: las dos coinciden.`, just: { tipo: 'definicion', ref: 'd.conectivos' }, deps: ['L0'], huecos: [H('h1', abs, W2, false)] },
      { id: 'L2', texto: r`Si $${P}$ es ${neu}: $${P}${o1}(${dentro})$ tiene el mismo valor que $${dentro}$.`, just: { tipo: 'definicion', ref: 'd.conectivos' }, deps: ['L0'] },
      { id: 'L3', texto: r`Si $${P}$ es ${neu}: $${P}${o1} ${Q}$ tiene el valor de $${Q}$ y $${P}${o1} ${R3}$ el de $${R3}$, así que $(${P}${o1} ${Q})${o2}(${P}${o1} ${R3})$ tiene el valor de ⟦h2⟧.`, just: { tipo: 'definicion', ref: 'd.conectivos' }, deps: ['L0'], huecos: [H('h2', dentro, [dentro, r`${Q}${o1} ${R3}`, Q, R3])] },
      { id: 'L4', texto: r`Si $${P}$ es ${neu}: ambas fórmulas tienen el valor de $${dentro}$, luego coinciden.`, just: { tipo: 'propiedad-base', ref: 'b.transitividad-equiv' }, deps: ['L2', 'L3'] },
      { id: 'L5', texto: r`En los dos casos coinciden; por tanto son equivalentes. ∎`, just: { tipo: 'propiedad-base', ref: 'b.casos' }, deps: ['L1', 'L4'] },
    ];
  };
  const dsF = p => p.dual ? r`$${p.P}\vee(${p.Q}\wedge ${p.R})$` : r`$${p.P}\wedge(${p.Q}\vee ${p.R})$`;
  const dsG = p => p.dual ? r`$(${p.P}\vee ${p.Q})\wedge(${p.P}\vee ${p.R})$` : r`$(${p.P}\wedge ${p.Q})\vee(${p.P}\wedge ${p.R})$`;
  R.demostracion({
    id: 'dem.distrib-prop', teorema: 't.distrib-prop', enunciadoId: 't.distrib-prop', mundo: 1, nivel: '1.1',
    habilidades: ['1.1.equivalencia', '1.1.demostrar'], requiere: [], refsExtra: ['b.conmutatividad', 'b.asociatividad'],
    parametros(rng) { const s = rng.pick(NOMBRES); return { P: s[0], Q: s[1], R: s[2], dual: rng.chance(0.5) }; },
    enunciado: p => r`Demuestra que ${dsF(p)} es equivalente a ${dsG(p)}.`,
    hipotesis: p => [r`$${p.P}$, $${p.Q}$ y $${p.R}$ son proposiciones cualesquiera`],
    meta: p => r`${dsF(p)} $\equiv$ ${dsG(p)}`,
    lineas: dsLineas, orden_referencia: ['L0', 'L1', 'L2', 'L3', 'L4', 'L5'],
    distractores: p => [
      { texto: r`Basta comprobar el caso en que $${p.P}$ es verdadera.`, falla: 'omite uno de los casos' },
      { texto: r`Como ${dsF(p)} se escribe igual que ${p.dual ? r`$${p.P}\vee ${p.Q}\wedge ${p.R}$` : r`$${p.P}\wedge ${p.Q}\vee ${p.R}$`}, no hay nada que probar.`, falla: 'ignora la estructura de los paréntesis' },
    ],
    errores: p => {
      const dentro = p.dual ? r`${p.Q}\wedge ${p.R}` : r`${p.Q}\vee ${p.R}`, otro = p.dual ? r`${p.Q}\vee ${p.R}` : r`${p.Q}\wedge ${p.R}`;
      const abs = p.dual ? 'verdadera' : 'falsa', neu = p.dual ? 'falsa' : 'verdadera', mal = p.dual ? 'falsa' : 'verdadera';
      return [
        { sustituye: 'L1', texto: dsLineas(p)[1].texto.replace('⟦h1⟧', mal), diagnostico: 'error-de-calculo', opciones: ['error-de-calculo', 'circular', 'caso-faltante', 'no-justificado'], explicacion: 'En el caso en que P absorbe, ambas fórmulas valen lo contrario de lo que se afirma.' },
        { sustituye: 'L4', texto: r`Si $${p.P}$ es ${neu}: ambas fórmulas tienen el valor de $${otro}$, luego coinciden.`, diagnostico: 'error-de-calculo', opciones: ['error-de-calculo', 'circular', 'caso-faltante', 'no-justificado'], explicacion: 'El valor común es el de ' + '$' + dentro + '$' + ', no el de la otra combinación.' },
        { sustituye: 'L5', texto: r`Como coinciden cuando $${p.P}$ es ${neu}, son equivalentes. ∎`, diagnostico: 'caso-faltante', opciones: ['caso-faltante', 'error-de-calculo', 'circular', 'conclusion-invalida'], explicacion: 'Falta el otro caso de P.' },
      ];
    },
    estrategias: [
      { id: 'casos', texto: 'Dividir en casos según el valor de P', valida: true, nota: 'Reduce ocho filas a dos casos.' },
      { id: 'tabla', texto: 'Revisar las ocho filas de la tabla de verdad', valida: true, nota: 'Siempre válida; es la más larga.' },
      { id: 'ejemplo', texto: 'Verificar un ejemplo concreto', valida: false, nota: 'Un ejemplo no prueba una equivalencia.' },
      { id: 'induccion', texto: 'Inducción sobre el número de letras', valida: false, nota: 'No aplica: la fórmula tiene tres letras fijas.' },
    ],
    criterios: ['Separé en casos según P', 'Evalué ambas fórmulas en cada caso', 'Reconocí que en un caso las dos valen lo mismo que Q∘R', 'Concluí que coinciden en todos los casos'],
    modelo: modeloDe(dsLineas),
    pistas: p => ['Orientación: dividir en casos según una letra reduce el trabajo.', r`Idea clave: si $${p.P}$ ${p.dual ? 'es verdadera' : 'es falsa'}, las dos fórmulas se simplifican de golpe.`, r`Primer paso: considera el caso en que $${p.P}$ es ${p.dual ? 'verdadera' : 'falsa'}.`],
  });

  /* diagnóstico extra */
  if (!AC.reg.diagnosticos['forma-equivocada']) R.diagnostico({ id: 'forma-equivocada', texto: 'Usa la recíproca o la inversa en lugar de la contrapositiva' });

  if (typeof module !== 'undefined') module.exports = AC;
})(globalThis.AC = globalThis.AC || {});
