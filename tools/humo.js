/* Prueba de humo en navegador real: monta cada ejercicio con la interfaz de verdad, lo resuelve a base de clics y comprueba que se acepta.
   Uso: abre index.html servido por http (o file://) y ejecuta en la consola:  fetch('tools/humo.js').then(r => r.text()).then(eval)
   (con file:// pega el contenido). Devuelve un informe en window.HUMO. */
(async function () {
  const AC = globalThis.AC, ui = AC.ui, J = AC.juego, h = ui.h;
  if (!globalThis.AC_BOT) { const t = await fetch('tools/bot.js').then(r => r.text()); (0, eval)(t); }
  const bot = globalThis.AC_BOT;
  const espera = ms => new Promise(r => setTimeout(r, ms));
  const informe = { total: 0, ok: 0, fallos: [], tipos: {} };

  function ordenar(raiz, sol, conJust) {
    const filas = () => [...raiz.querySelectorAll('.fila-orden')];
    // descartar lo que sobra
    filas().forEach(li => { if (!sol.usadas.includes(li.dataset.id)) [...li.querySelectorAll('button')].find(b => /Descartar/.test(b.textContent)).click(); });
    sol.usadas.forEach((id, k) => {
      for (let guardia = 0; guardia < 40; guardia++) {
        const ids = filas().filter(li => !li.classList.contains('descartada')).map(li => li.dataset.id);
        const p = ids.indexOf(id); if (p <= k) break;
        const li = filas().find(x => x.dataset.id === id), sube = li.querySelector('button[aria-label="Subir"]'); sube.click();
        // los descartados también ocupan lugar: seguimos subiendo hasta que quede en k entre los usados
      }
    });
    if (conJust) filas().forEach(li => { const id = li.dataset.id; if (sol.just[id]) { const s = li.querySelector('select'); s.value = sol.just[id]; s.dispatchEvent(new Event('change', { bubbles: true })); } });
  }

  function resolverUI(inst, raiz) {
    const sol = bot.resolver(inst), e = inst.entrada, q = s => raiz.querySelector(s), qa = s => [...raiz.querySelectorAll(s)];
    switch (e.tipo) {
      case 'matriz': { const ins = qa('.matriz-grilla input'); sol.forEach((f, i) => f.forEach((x, j) => { const el = ins[i * e.cols + j]; el.value = x; el.dispatchEvent(new Event('input', { bubbles: true })); })); break; }
      case 'tabla': { const bs = qa('.celda-vf'); bs.forEach((b, i) => { b.click(); if (sol[i] === false) b.click(); }); break; }
      case 'entero': case 'racional': { const i = q('input.campo-mate'); i.value = String(sol).replace('/', '/'); i.dispatchEvent(new Event('input', { bubbles: true })); break; }
      case 'tupla': { const ins = qa('input.campo-mate'); sol.forEach((x, i) => { ins[i].value = String(x); ins[i].dispatchEvent(new Event('input', { bubbles: true })); }); break; }
      case 'logica': case 'expr': case 'conjunto': case 'complejo': { const i = q('input.campo-mate'); i.value = sol; i.dispatchEvent(new Event('input', { bubbles: true })); break; }
      case 'eleccion': qa('.opciones input')[sol].click(); break;
      case 'multiple': sol.forEach(i => qa('.opciones input')[i].click()); break;
      case 'procedimiento': pasosUI(raiz, e, sol); break;
      case 'asignacion': qa('.celda-vf').forEach((b, i) => { if (sol[e.vars[i]]) b.click(); }); break;
      case 'vf': { const r = qa('.opciones'); r[0].querySelectorAll('input')[sol.valor ? 0 : 1].click(); r[1].querySelectorAll('input')[sol.just].click(); break; }
      case 'ordenable': ordenar(raiz, sol, false); break;
      case 'construccion': ordenar(raiz, sol, true); break;
      case 'justificar': qa('select').forEach((s, i) => { s.value = sol.just[e.lineas[i].id]; s.dispatchEvent(new Event('change', { bubbles: true })); }); break;
      case 'huecos': {
        const chips = qa('.chip-hueco'); const ids = [];
        e.lineas.forEach(l => { l.partes.forEach(p => { if (typeof p !== 'string') ids.push(p.gap); }); if (l.just.gap) ids.push(l.just.gap); });
        chips.forEach((c, i) => { c.click(); const paneles = qa('.panel-hueco'); paneles[i].querySelectorAll('button')[sol[ids[i]]].click(); });
        break;
      }
      case 'estrategia': sol.forEach(id => { const i = e.opciones.findIndex(o => o.id === id); qa('.opciones input')[i].click(); }); break;
      case 'cazar': { const i = e.lineas.findIndex(l => l.id === sol.linea); qa('.opciones')[0].querySelectorAll('input')[i].click(); const d = e.diagnosticos.findIndex(x => x.id === sol.diag); qa('.opciones')[1].querySelectorAll('input')[d].click(); break; }
      case 'redactar': { qa('button').find(b => /Comparar/.test(b.textContent)).click(); qa('.opciones input').forEach(c => c.click()); break; }
      default: throw new Error('tipo sin conductor: ' + e.tipo);
    }
  }
  function pasosUI(raiz, e, sol) { // aplica la ruta eligiendo, en cada paso, el botón con la misma ley y la misma subfórmula
    let f = AC.logic.parse(e.inicio);
    sol.forEach(p => {
      const ops = AC.logic.reescrituras(f, e.leyes.map(l => l.id));
      const k = ops.findIndex(o => o.ley === p.ley && JSON.stringify(o.ruta) === JSON.stringify(p.ruta));
      raiz.querySelectorAll('.paso')[k].click();
      f = AC.logic.aplicar(f, p.ruta, p.ley);
    });
  }

  globalThis.HUMO_RESOLVER = resolverUI;
  if (globalThis.HUMO_SOLO_CONDUCTOR) return;
  if (!AC.reg.generadores['fixture.matriz']) AC.registrar.generador({ id: 'fixture.matriz', mundo: 1, nivel: '1.1', familia: 'aplicacion', habilidades: ['1.1.tabla'], dificultad: 1,
    generar() { return { variantKey: 'm', enunciado: 'Escribe la matriz identidad $2\times 2$ (usa coma o punto decimal si quieres).', entrada: { tipo: 'matriz', filas: 2, cols: 2 }, verificador: { id: 'matriz', args: { esperado: [['1', '0'], ['0', '1']] } }, firmas: [], pistas: ['a', 'b', 'c'], explicacion: 'x' }; } });
  const raiz = document.createElement('div'); raiz.id = 'humo'; document.querySelector('#main').replaceChildren(raiz);
  const tareas = [];
  Object.values(AC.reg.generadores).forEach(g => { for (let s = 0; s < (g.id === 'fixture.matriz' ? 1 : 3); s++) tareas.push({ tipo: 'gen', id: g.id, seed: 'H' + s }); });
  Object.values(AC.reg.demos).forEach(d => ['ordenar', 'justificar', 'huecos', 'huecos', 'estrategia', 'cazar-error', 'construccion', 'redactar'].forEach((m, i) => tareas.push({ tipo: 'dem', id: d.id, modo: m, seed: 'H' + i, escalon: m === 'huecos' ? (i === 2 ? 0 : 1) : (m === 'construccion' ? 2 : null), guiada: false })));
  const est = AC.guardado.nuevo(J.hoy());
  // el jugador de prueba ya tiene en el Códice lo que cada tarea necesita
  est.ajustes.convencionesVistas = true; est.ajustes.silencio = true; J.usar(est);
  Object.values(AC.reg.teoremas).forEach(t => { est.teoremas[t.id] = { escalon: 0, maduro: false, ganado: '2026-01-01', ultimo: null }; });
  for (const task of tareas) {
    informe.total++;
    const etiqueta = task.id + (task.modo ? ':' + task.modo + (task.escalon !== null ? task.escalon : '') : '') + '#' + task.seed;
    try {
      raiz.replaceChildren();
      let i = 0;
      const S = { contexto: 'practica', siguiente: () => (i++ ? null : task), alFinal: () => h('p', null, 'fin') };
      const v = ui.vistaEjercicio(S); raiz.appendChild(v);
      const inst = J.instanciar(task);
      informe.tipos[inst.entrada.tipo] = (informe.tipos[inst.entrada.tipo] || 0) + 1;
      // si pide confianza, se elige una
      const conf = v.querySelector('fieldset.confianza input'); if (conf) conf.click();
      resolverUI(inst, v);
      const b = [...v.querySelectorAll('button.primario')].find(x => x.textContent === 'Comprobar');
      if (b.disabled) throw new Error('«Comprobar» sigue desactivado tras responder');
      b.click();
      await espera(5);
      const banner = v.querySelector('.banner');
      if (!banner || !banner.classList.contains('ok')) throw new Error('no se aceptó: ' + (banner ? banner.textContent : 'sin banner'));
      if (v.querySelector('.mate .katex-error')) throw new Error('error de KaTeX');
      informe.ok++;
    } catch (err) { informe.fallos.push(etiqueta + ' → ' + err.message); }
  }
  window.HUMO = informe;
  return informe;
})();
