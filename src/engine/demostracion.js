/* Demostraciones como grafo de dependencias entre líneas; ocho modos derivados de un mismo objeto. */
(function (AC) {
  const reg = AC.reg, verif = AC.verif;

  /* ---------- grafo ---------- */
  function ordenValido(lineas, orden) {
    // orden: ids usados; válido si respeta deps. Devuelve lista de violaciones.
    const pos = {}; orden.forEach((id, i) => { pos[id] = i; });
    const viol = [];
    lineas.forEach(l => {
      if (!(l.id in pos)) return;
      l.deps.forEach(d => { if (!(d in pos) || pos[d] > pos[l.id]) viol.push({ linea: l.id, dep: d, ausente: !(d in pos) }); });
    });
    return viol;
  }
  function topologico(lineas) { // un orden topológico estable, o null si hay ciclo
    const hecho = new Set(), out = [];
    let avanzo = true;
    while (out.length < lineas.length && avanzo) {
      avanzo = false;
      lineas.forEach(l => { if (!hecho.has(l.id) && l.deps.every(d => hecho.has(d))) { hecho.add(l.id); out.push(l.id); avanzo = true; } });
    }
    return out.length === lineas.length ? out : null;
  }

  /* ---------- opciones de justificación ---------- */
  function opcionesJust(demo, lineas, rng, codice) {
    const disp = new Set(codice || []);
    const usados = new Set(lineas.map(l => l.just.ref));
    const out = {};
    lineas.forEach(l => {
      const correcta = l.just.ref;
      const pool = new Set([...usados, ...(demo.refsExtra || [])]);
      disp.forEach(t => pool.add(t));
      if (demo.teorema && rng.chance(0.6)) pool.add(demo.teorema); // trampa de uso circular
      pool.delete(correcta);
      let cand = [...pool].filter(r => {
        const tp = AC.catalogo.tipoRef(r);
        return tp !== 'teorema' || disp.has(r) || r === demo.teorema; // un teorema no demostrado todavía no se ofrece (salvo la trampa circular)
      });
      if (cand.length < 3) Object.keys(reg.refs).filter(r => r !== 'hip' && r !== correcta && !cand.includes(r)).forEach(r => cand.push(r));
      const mismo = cand.filter(r => AC.catalogo.tipoRef(r) === AC.catalogo.tipoRef(correcta));
      const orden = rng.shuffle(mismo).concat(rng.shuffle(cand.filter(r => !mismo.includes(r))));
      const elegidos = [correcta].concat(orden.slice(0, 3));
      out[l.id] = rng.shuffle(elegidos);
    });
    return out;
  }

  /* ---------- instanciación ---------- */
  function resolver(demo, rng) {
    const p = demo.parametros(rng);
    return {
      p,
      lineas: demo.lineas(p).map(l => { const x = Object.assign({ deps: [], huecos: [] }, l); x.plano = limpiar(x, x.texto); return x; }),
      distractores: demo.distractores(p).map((d, i) => Object.assign({ id: 'X' + (i + 1) }, d)),
      errores: demo.errores(p),
    };
  }
  const clave = p => JSON.stringify(p);
  const limpiar = (l, t) => t.replace(/⟦(\w+)⟧/g, (m, id) => { const h = l.huecos.find(x => x.id === id); return h ? (h.math === false ? h.correcta : '$' + h.correcta + '$') : ''; });

  function barajarDistinto(rng, ids, ref) {
    for (let i = 0; i < 12; i++) { const s = rng.shuffle(ids); if (s.join() !== ref.join()) return s; }
    return ids.slice().reverse();
  }

  function instanciar(task, ctx) {
    const demo = reg.demos[task.id];
    if (!demo) throw new Error('demostración desconocida ' + task.id);
    const rng = AC.rng(task.seed + '|' + demo.id + '|' + task.modo);
    const R = resolver(demo, rng);
    const codice = (ctx && ctx.codice) || [...AC.catalogo.cierre(demo.requiere)].filter(t => t !== demo.teorema);
    const refNombre = AC.catalogo.nombreRef;
    const porId = {}; R.lineas.forEach(l => { porId[l.id] = l; });
    const base = {
      tipo: 'dem', id: demo.id, demoId: demo.id, seed: task.seed, modo: task.modo, escalon: task.escalon == null ? null : task.escalon,
      familia: 'demostracion', mundo: demo.mundo, nivel: demo.nivel, habilidades: demo.habilidades, requiere: demo.requiere,
      teorema: demo.teorema || null, enunciadoId: demo.enunciadoId || demo.teorema || demo.id,
      dificultad: 2, confianza: true, autoexplicacion: null, firmas: [],
      enunciado: demo.enunciado(R.p), hipotesis: demo.hipotesis(R.p), meta: demo.meta(R.p),
      pistas: demo.pistas(R.p), explicacion: demo.modelo(R.p),
      variantKey: demo.id + '|' + task.modo + (task.escalon != null ? task.escalon : '') + '|' + clave(R.p),
      guiada: !!task.guiada,
    };
    const refTexto = id => ({ id, nombre: refNombre(id), tipo: AC.catalogo.tipoRef(id) });
    const verifGrafo = { lineas: R.lineas.map(l => ({ id: l.id, deps: l.deps, ref: l.just.ref, alt: l.just.alt || [], texto: l.plano })), distractores: R.distractores.map(d => ({ id: d.id, texto: d.texto, falla: d.falla })), teorema: demo.teorema || null };

    switch (task.modo) {
      case 'ordenar': case 'construccion': {
        const conJust = task.modo === 'construccion';
        const dist = task.guiada ? R.distractores.slice(0, 2) : R.distractores;
        const ref = R.lineas.map(l => l.id);
        const items = [...R.lineas.map(l => ({ id: l.id, texto: l.plano })), ...dist.map(d => ({ id: d.id, texto: d.texto }))];
        const orden = barajarDistinto(rng, items.map(i => i.id), ref.concat(dist.map(d => d.id)));
        const opts = conJust ? opcionesJust(demo, R.lineas, rng, codice) : null;
        return Object.assign(base, {
          entrada: { tipo: conJust ? 'construccion' : 'ordenable', items: orden.map(id => items.find(i => i.id === id)), numLineas: task.guiada || !conJust ? R.lineas.length : null,
            opciones: opts ? Object.fromEntries(Object.entries(opts).map(([k, v]) => [k, v.map(refTexto)])) : null },
          verificador: { id: conJust ? 'demo-construccion' : 'demo-ordenar', args: { g: Object.assign({}, verifGrafo, { distractores: dist.map(d => ({ id: d.id, texto: d.texto, falla: d.falla })) }) } },
          enunciadoCorto: conJust ? 'Construye la demostración: elige las líneas necesarias, ordénalas y justifica cada una.' : 'Ordena las líneas de la demostración y descarta las que sobran.',
        });
      }
      case 'justificar': {
        const opts = opcionesJust(demo, R.lineas, rng, codice);
        return Object.assign(base, {
          entrada: { tipo: 'justificar', lineas: R.lineas.map(l => ({ id: l.id, texto: l.plano, opciones: opts[l.id].map(refTexto) })) },
          verificador: { id: 'demo-justificar', args: { g: verifGrafo } },
          enunciadoCorto: 'Elige la justificación de cada línea.',
        });
      }
      case 'huecos': {
        const esc = task.escalon || 0;
        const gaps = {}; let n = 0;
        const gap = (kind, opciones, correcta) => { const id = 'g' + (++n); gaps[id] = { id, kind, opciones, correcta }; return id; };
        const optsJ = opcionesJust(demo, R.lineas, rng, codice);
        let lineas;
        const limpio = limpiar;
        if (esc === 0) {
          // pocos huecos: un fragmento de texto y una justificación (si existen)
          const conFrag = R.lineas.filter(l => l.huecos.length);
          const fragL = conFrag.length ? rng.pick(conFrag) : null;
          const justL = rng.pick(R.lineas.filter(l => l !== fragL));
          lineas = R.lineas.map(l => {
            let partes = [limpio(l, l.texto)];
            let just = { ref: l.just.ref };
            if (l === fragL) {
              const h = rng.pick(l.huecos);
              const opc = rng.shuffle([h.correcta].concat(rng.sample(h.opciones.filter(o => o !== h.correcta), 3)));
              const gid = gap('tex', opc.map(tx => h.math === false ? { txt: tx } : { tex: tx }), opc.indexOf(h.correcta));
              const [x, y] = l.texto.split('⟦' + h.id + '⟧');
              partes = [limpio(l, x), { gap: gid }, limpio(l, y)];
            }
            if (l === justL) {
              const opc = optsJ[l.id];
              just = { gap: gap('ref', opc.map(refTexto), opc.indexOf(l.just.ref)) };
            }
            return { id: l.id, partes, just };
          });
        } else {
          // la mitad (o más) de las líneas ocultas y todas las justificaciones por elegir
          const ocultas = new Set(rng.sample(R.lineas.map(l => l.id), Math.ceil(R.lineas.length / 2)));
          const alternativas = [...R.distractores.map(d => d.texto), ...R.errores.map(e => e.texto)];
          lineas = R.lineas.map(l => {
            const texto = limpio(l, l.texto);
            let partes = [texto];
            if (ocultas.has(l.id)) {
              const otras = alternativas.concat(R.lineas.filter(x => x !== l).map(x => limpio(x, x.texto))).filter(t => t !== texto);
              const opc = rng.shuffle([texto].concat(rng.sample([...new Set(otras)], 3)));
              partes = [{ gap: gap('tex', opc.map(tx => ({ txt: tx })), opc.indexOf(texto)) }];
            }
            const opc = optsJ[l.id];
            return { id: l.id, partes, just: { gap: gap('ref', opc.map(refTexto), opc.indexOf(l.just.ref)) } };
          });
        }
        return Object.assign(base, {
          entrada: { tipo: 'huecos', lineas, huecos: gaps, escalon: esc },
          verificador: { id: 'demo-huecos', args: { esperado: Object.fromEntries(Object.values(gaps).map(g => [g.id, g.correcta])), kinds: Object.fromEntries(Object.values(gaps).map(g => [g.id, g.kind])), teorema: demo.teorema || null, opciones: Object.fromEntries(Object.values(gaps).map(g => [g.id, g.opciones.map(o => o.ref || o.tex || o.txt)])) } },
          enunciadoCorto: esc === 0 ? 'Completa los huecos de la demostración.' : 'Reconstruye la demostración: faltan líneas y todas las justificaciones.',
        });
      }
      case 'estrategia': {
        const op = rng.shuffle(demo.estrategias.map(e => ({ id: e.id, texto: e.texto })));
        return Object.assign(base, {
          entrada: { tipo: 'estrategia', opciones: op },
          verificador: { id: 'demo-estrategia', args: { validas: demo.estrategias.filter(e => e.valida).map(e => e.id), notas: Object.fromEntries(demo.estrategias.map(e => [e.id, { texto: e.texto, valida: e.valida, nota: e.nota }])) } },
          enunciadoCorto: 'Marca todas las estrategias que permiten demostrarlo.',
        });
      }
      case 'cazar-error': {
        const e = rng.pick(R.errores);
        const lineas = R.lineas.map(l => ({ id: l.id, texto: l.id === e.sustituye ? e.texto : limpiar(l, l.texto) }));
        const diag = rng.shuffle(e.opciones.map(id => ({ id, texto: (reg.diagnosticos[id] || { texto: id }).texto })));
        return Object.assign(base, {
          entrada: { tipo: 'cazar', lineas, diagnosticos: diag },
          verificador: { id: 'demo-cazar', args: { linea: e.sustituye, diag: e.diagnostico, explicacion: e.explicacion || '' } },
          enunciadoCorto: 'Una de las líneas es falsa. Márcala y elige el diagnóstico.',
        });
      }
      case 'redactar': {
        return Object.assign(base, {
          entrada: { tipo: 'redactar', criterios: demo.criterios, modelo: demo.modelo(R.p), lineasModelo: R.lineas.map(l => limpiar(l, l.texto)) },
          verificador: { id: 'autoevaluacion', args: { criterios: demo.criterios } },
          enunciadoCorto: 'Escribe la demostración con tus palabras y compárala con la respuesta modelo.',
        });
      }
    }
    throw new Error('modo desconocido ' + task.modo);
  }

  /* ---------- verificadores del grafo ---------- */
  verif['demo-ordenar'] = (inst, resp, a) => {
    const g = a.g, usadas = (resp && resp.usadas) || [];
    const necesarias = g.lineas.map(l => l.id);
    const dist = new Set(g.distractores.map(d => d.id));
    const msgs = [];
    const usadasDist = usadas.filter(id => dist.has(id));
    const faltan = necesarias.filter(id => !usadas.includes(id));
    usadasDist.forEach(id => { const d = g.distractores.find(x => x.id === id); msgs.push('Sobra una línea: ' + (d.falla ? '«' + d.falla + '».' : 'no pertenece a la demostración.')); });
    if (faltan.length) msgs.push('Faltan ' + faltan.length + ' línea(s) necesaria(s).');
    const viol = ordenValido(g.lineas, usadas.filter(id => !dist.has(id)));
    viol.filter(v => !v.ausente).forEach(v => msgs.push('La línea «' + g.lineas.find(l => l.id === v.linea).texto + '» necesita antes «' + g.lineas.find(l => l.id === v.dep).texto + '».'));
    const ok = !msgs.length;
    return { ok, msg: ok ? 'Orden válido.' : msgs.slice(0, 3).join(' '), fallos: { distractores: usadasDist, faltan, violaciones: viol } };
  };

  verif['demo-construccion'] = (inst, resp, a) => {
    const base = verif['demo-ordenar'](inst, resp, a);
    const g = a.g, just = (resp && resp.just) || {};
    const malas = [];
    let circular = false;
    g.lineas.forEach(l => {
      if ((resp.usadas || []).includes(l.id)) {
        const r = just[l.id];
        if (r !== l.ref && !(l.alt || []).includes(r)) { malas.push(l.id); if (r && r === g.teorema) circular = true; }
      }
    });
    const ok = base.ok && !malas.length;
    let msg = base.msg;
    if (base.ok && malas.length) msg = 'El orden es válido, pero ' + malas.length + ' justificación(es) no son correctas' + (circular ? ' (una de ellas es circular: usa el propio teorema que se demuestra)' : '') + '.';
    else if (!base.ok && malas.length) msg += ' Además hay justificaciones por revisar.';
    return { ok, msg, fallos: Object.assign(base.fallos, { justMalas: malas }), firma: circular ? { id: 'uso-circular', mensaje: 'Usaste el teorema que estás demostrando para justificar un paso: eso es circular.' } : null };
  };

  verif['demo-justificar'] = (inst, resp, a) => {
    const g = a.g, just = (resp && resp.just) || {};
    if (g.lineas.some(l => !just[l.id])) return { ok: false, incompleta: true, msg: 'Falta justificar alguna línea.' };
    const malas = g.lineas.filter(l => just[l.id] !== l.ref && !(l.alt || []).includes(just[l.id]));
    const circ = malas.some(l => just[l.id] === g.teorema);
    return { ok: !malas.length, detalle: Object.fromEntries(g.lineas.map(l => [l.id, !malas.includes(l)])), msg: malas.length ? malas.length + ' justificación(es) incorrecta(s)' + (circ ? '; una usa el propio teorema que se demuestra (circular)' : '') + '.' : 'Todas las justificaciones son correctas.', firma: circ ? { id: 'uso-circular', mensaje: 'Usaste el teorema que estás demostrando para justificar un paso: eso es circular.' } : null };
  };

  verif['demo-huecos'] = (inst, resp, a) => {
    resp = resp || {};
    const ids = Object.keys(a.esperado);
    if (ids.some(id => resp[id] === undefined || resp[id] === null)) return { ok: false, incompleta: true, msg: 'Falta rellenar algún hueco.' };
    const det = Object.fromEntries(ids.map(id => [id, resp[id] === a.esperado[id]]));
    const malos = ids.filter(id => !det[id]);
    const circ = malos.some(id => a.kinds[id] === 'ref' && a.opciones[id][resp[id]] === a.teorema);
    return { ok: !malos.length, detalle: det, msg: malos.length ? malos.length + ' de ' + ids.length + ' huecos incorrectos' + (circ ? ' (uno usa el propio teorema que se demuestra: circular)' : '') + '.' : 'Todos los huecos correctos.', firma: circ ? { id: 'uso-circular', mensaje: 'Usaste el teorema que estás demostrando para justificar un paso: eso es circular.' } : null };
  };

  verif['demo-estrategia'] = (inst, resp, a) => {
    const r = (resp || []).slice().sort(), v = a.validas.slice().sort();
    const ok = r.length === v.length && r.every((x, i) => x === v[i]);
    return { ok, notas: a.notas, msg: ok ? 'Correcto: esas son todas las estrategias que funcionan.' : 'La selección no coincide con las estrategias que funcionan.' };
  };

  verif['demo-cazar'] = (inst, resp, a) => {
    if (!resp || !resp.linea) return { ok: false, incompleta: true, msg: 'Marca la línea falsa.' };
    const l = resp.linea === a.linea, d = resp.diag === a.diag;
    if (l && !resp.diag) return { ok: false, incompleta: true, msg: 'Ahora elige el diagnóstico.' };
    return { ok: l && d, parcial: l && !d, errorEncontrado: l, msg: l && d ? 'Correcto. ' + a.explicacion : l ? 'Encontraste la línea, pero el diagnóstico no es ese. ' + a.explicacion : 'Esa línea está bien; el error está en otra. ' };
  };

  /* ---------- validación de contenido (usada por tools/test.js) ---------- */
  function auditar(demo) {
    const rng = AC.rng('auditoria|' + demo.id), pr = [];
    const R = resolver(demo, rng);
    const ids = R.lineas.map(l => l.id);
    if (new Set(ids).size !== ids.length) pr.push('ids de línea repetidos');
    R.lineas.forEach(l => l.deps.forEach(d => { if (!ids.includes(d)) pr.push(l.id + ' depende de ' + d + ' que no existe'); }));
    const topo = topologico(R.lineas);
    if (!topo) pr.push('el grafo tiene un ciclo');
    if (ordenValido(R.lineas, demo.orden_referencia).length || demo.orden_referencia.length !== ids.length) pr.push('orden_referencia no respeta el grafo');
    R.distractores.forEach(d => { if (R.lineas.some(l => l.deps.includes(d.id))) pr.push('un distractor aparece en deps'); });
    R.errores.forEach(e => { if (!ids.includes(e.sustituye)) pr.push('error sustituye una línea inexistente'); if (!e.opciones.includes(e.diagnostico)) pr.push('el diagnóstico no está entre las opciones'); });
    const permitidos = new Set(AC.catalogo.cierre(demo.requiere));
    R.lineas.forEach(l => {
      [l.just.ref, ...(l.just.alt || [])].forEach(r => {
        if (!reg.refs[r] && !reg.teoremas[r]) pr.push(l.id + ': referencia desconocida ' + r);
        if (reg.teoremas[r]) {
          if (r === demo.teorema) pr.push(l.id + ': uso circular de ' + r);
          else if (!permitidos.has(r)) pr.push(l.id + ': usa ' + r + ' que no está en requiere');
        }
      });
    });
    if (demo.teorema && !reg.teoremas[demo.teorema]) pr.push('teorema inexistente');
    if (demo.teorema) { const t = reg.teoremas[demo.teorema]; if (t && t.requiere.slice().sort().join() !== demo.requiere.slice().sort().join()) pr.push('requiere de la demostración difiere del teorema'); }
    return pr;
  }

  AC.demo = { instanciar, ordenValido, topologico, auditar, resolver };
  if (typeof module !== 'undefined') module.exports = AC;
})(globalThis.AC = globalThis.AC || {});
