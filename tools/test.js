/* Pruebas de aceptación 1 y 2: generadores (500 semillas), demostraciones, árbol de teoremas y motor de aprendizaje.
   Uso: node tools/test.js [semillas]    (por defecto 500) */
const fs = require('fs'), path = require('path');
globalThis.AC = {};
const SRC = path.join(__dirname, '..', 'src');
const M = require(path.join(SRC, 'manifest.js'));
[...M.core, ...M.engine, ...M.content].forEach(f => require(path.join(SRC, f)));
const AC = globalThis.AC, L = AC.logic, Rat = AC.Rat;
const bot = require('./bot.js');
const SEMILLAS = +process.argv[2] || 500;

let malos = 0, comprobaciones = 0;
const err = m => { malos++; if (malos <= 60) console.log('  ✗ ' + m); };
const chk = (c, m) => { comprobaciones++; if (!c) err(m); };
const titulo = t => console.log('\n' + t);

/* ============ núcleo ============ */
titulo('Núcleo');
chk(Rat.parse('3,5').eq(Rat.of(7, 2)) && Rat.parse('3.5').eq(Rat.of(7, 2)) && Rat.parse('-7/2').eq(Rat.of(-7, 2)) && Rat.parse('0,125').eq(Rat.of(1, 8)), 'Rat.parse decimales y fracciones');
chk(Rat.parse('1/0') === null && Rat.parse('abc') === null && Rat.parse('') === null, 'Rat.parse rechaza basura');
chk(Rat.of(6, -4).toString() === '-3/2', 'Rat reduce y normaliza signo');
chk(AC.rng('x').int(1, 6) === AC.rng('x').int(1, 6), 'rng determinista');
chk(L.equiv(L.parse('¬(P∧Q)'), L.parse('¬P∨¬Q')) && !L.equiv(L.parse('P→Q'), L.parse('Q→P')), 'equivalencias lógicas básicas');
chk(L.str(L.parse('P -> Q -> R')) === 'P→(Q→R)', '→ asocia a la derecha');
chk(L.str(L.parse('~(p & q) | r')) === '¬(p∧q)∨r', 'sintaxis ASCII');
chk((() => { try { L.parse('P ∧'); return false; } catch (e) { return !!e.msg; } })(), 'error de sintaxis con mensaje');

/* verificador de matrices con una instancia de prueba (el contenido matricial llega en el Mundo 4) */
(function () {
  const inst = { verificador: { id: 'matriz', args: { esperado: [['1/2', '0'], ['-3', '1,5'.replace(',', '.')]] } }, entrada: { tipo: 'matriz' }, firmas: [] };
  chk(AC.verificar(inst, [['0,5', '0'], ['-3', '3/2']]).ok, 'matriz: acepta equivalentes (0,5 = 1/2; 3/2 = 1.5)');
  chk(!AC.verificar(inst, [['0,5', '0'], ['3', '3/2']]).ok, 'matriz: rechaza una entrada distinta');
  chk(AC.verificar(inst, [['0,5']]).incompleta, 'matriz: detecta que está incompleta');
})();

/* ============ árbol de teoremas ============ */
titulo('Árbol de teoremas y catálogo');
const T = AC.reg.teoremas;
Object.values(T).forEach(t => {
  t.requiere.forEach(r => chk(T[r], t.id + ' requiere ' + r + ' que no existe'));
  t.habilidades.forEach(h => chk(AC.reg.habilidades[h], t.id + ': habilidad desconocida ' + h));
  chk(Object.values(AC.reg.demos).some(d => d.teorema === t.id), t.id + ' no tiene demostración');
});
(function ciclos() {
  const st = {};
  const v = (t, pila) => { if (st[t] === 2) return; if (st[t] === 1) return err('ciclo: ' + pila.concat(t).join(' > ')); st[t] = 1; (T[t].requiere || []).forEach(d => T[d] && v(d, pila.concat(t))); st[t] = 2; };
  Object.keys(T).forEach(t => v(t, []));
})();
Object.values(T).forEach(t => t.requiere.forEach(r => { if (T[r]) chk(T[r].nivel <= t.nivel, t.id + ' requiere ' + r + ' de un nivel posterior'); }));
// coherencia con docs/diseno.md (§11.4)
const doc = fs.readFileSync(path.join(__dirname, '..', 'docs', 'diseno.md'), 'utf8');
const bloque = doc.split('```text')[1].split('```')[0].trim().split(/\r?\n/);
const D = {};
bloque.forEach(l => { const m = l.match(/^\[(\d\.\d)\] (\S+) <-\s*(.*)$/); if (m) D[m[2]] = { nivel: m[1], req: m[3] ? m[3].split(',').map(s => s.trim()).sort() : [] }; });
Object.values(T).forEach(t => {
  chk(D[t.id], t.id + ' no está en docs/diseno.md');
  if (D[t.id]) { chk(D[t.id].nivel === t.nivel, t.id + ': nivel distinto del diseño'); chk(D[t.id].req.join() === t.requiere.slice().sort().join(), t.id + ': requiere distinto del diseño'); }
});
Object.values(AC.reg.niveles).forEach(n => {
  n.teoremas.forEach(t => chk(T[t] && T[t].nivel === n.id, n.id + ': teorema ' + t + ' mal asignado'));
  n.habilidades.forEach(h => chk(AC.reg.habilidades[h], n.id + ': habilidad ' + h));
});
Object.values(AC.reg.generadores).forEach(g => {
  g.habilidades.forEach(h => chk(AC.reg.habilidades[h], g.id + ': habilidad ' + h));
  g.requiere.forEach(t => chk(T[t], g.id + ': requiere teorema inexistente ' + t));
});
console.log('  ' + Object.keys(T).length + ' teoremas, sin ciclos; coherentes con el diseño.');

/* ============ generadores de aplicación y práctica ============ */
titulo('Generadores (' + SEMILLAS + ' semillas cada uno)');
const CTX = { codice: ['t.demorgan-prop', 't.neg-implicacion'] };
const conFirmas = ['tabla', 'entero', 'racional', 'logica', 'eleccion', 'multiple', 'conjunto', 'expr'];
Object.values(AC.reg.generadores).forEach(g => {
  const claves = new Set(); let sinFirma = 0, nFirmas = 0, t0 = Date.now(), conAnsw = 0;
  for (let s = 0; s < SEMILLAS; s++) {
    let a, b;
    try { a = AC.ejercicio.instanciar({ tipo: 'gen', id: g.id, seed: 'T' + s }, CTX); b = AC.ejercicio.instanciar({ tipo: 'gen', id: g.id, seed: 'T' + s }, CTX); } catch (e) { err(g.id + ' semilla ' + s + ': ' + e.message); break; }
    claves.add(a.variantKey);
    chk(JSON.stringify(a) === JSON.stringify(b), g.id + ' no es determinista (semilla ' + s + ')');
    chk(a.pistas.length === 3, g.id + ': pistas');
    chk(a.explicacion && a.enunciado, g.id + ': falta explicación o enunciado');
    // la respuesta correcta se acepta
    const ok = AC.ejercicio.corregir(a, bot.resolver(a));
    if (!ok.ok) { err(g.id + ' semilla ' + s + ': la respuesta de referencia no se acepta (' + ok.msg + ')'); continue; }
    // una respuesta equivocada se rechaza
    const mala = bot.equivocada(a);
    if (mala !== null && mala !== undefined) { const r = AC.ejercicio.corregir(a, mala); chk(!r.ok, g.id + ' semilla ' + s + ': acepta una respuesta equivocada'); }
    // firmas de error
    nFirmas += a.firmas.length; if (!a.firmas.length) sinFirma++;
    a.firmas.forEach(f => {
      const r = AC.ejercicio.corregir(a, f.respuesta);
      chk(!r.ok, g.id + ' semilla ' + s + ': la firma «' + f.id + '» se acepta como correcta');
      const d = AC.errores.detectar(a, f.respuesta);
      chk(d && d.mensaje, g.id + ' semilla ' + s + ': la firma «' + f.id + '» no se detecta');
    });
    AC.errores.auditar(a).forEach(p => err(g.id + ': ' + p));
    // degeneradas y enunciado resuelto
    if (a.verificador.id === 'tabla-de-verdad') chk(new Set(a.verificador.args.esperado).size === 2, g.id + ': tabla constante');
    (a.solucionTexto || []).forEach(sol => chk(!(/^-?\d+$/.test(sol) ? new RegExp('(^|\\D)' + sol + '(\\D|$)').test(a.enunciado) : a.enunciado.includes(sol)), g.id + ' semilla ' + s + ': el enunciado contiene la respuesta «' + sol + '»'));
    if (a.verificador.id === 'indice') chk(new Set(a.entrada.opciones).size === a.entrada.opciones.length, g.id + ': opciones repetidas');
    if (a.verificador.id === 'conjunto-indices') chk(a.verificador.args.esperado.length >= 1 && a.verificador.args.esperado.length < a.entrada.opciones.length, g.id + ': selección degenerada');
    conAnsw++;
  }
  chk(claves.size >= 20, g.id + ': solo ' + claves.size + ' variantes distintas en ' + SEMILLAS + ' semillas');
  const frac = sinFirma / SEMILLAS;
  const caps = conFirmas.includes((AC.ejercicio.instanciar({ tipo: 'gen', id: g.id, seed: 'z' }, CTX).entrada || {}).tipo);
  if (caps) chk(frac <= 0.2, g.id + ': ' + Math.round(frac * 100) + ' % de las instancias sin firmas de error');
  console.log('  ✓ ' + g.id.padEnd(34) + claves.size + ' variantes · ' + (nFirmas / SEMILLAS).toFixed(1) + ' firmas/inst. · ' + (Date.now() - t0) + ' ms');
});

/* ============ demostraciones ============ */
titulo('Demostraciones');
const MODOS = ['ordenar', 'justificar', 'huecos', 'estrategia', 'cazar-error', 'construccion', 'redactar'];
const estadoVacio = AC.guardado.nuevo('2026-01-01');
Object.values(AC.reg.demos).forEach(d => {
  AC.demo.auditar(d).forEach(p => err(d.id + ': ' + p));
  chk(d.estrategias.some(e => e.valida) && d.estrategias.some(e => !e.valida) && d.estrategias.length >= 4, d.id + ': estrategias insuficientes');
  const rng = AC.rng('t|' + d.id), R0 = AC.demo.resolver(d, rng);
  chk(R0.distractores.length >= 2 && R0.errores.length >= 2, d.id + ': pocos distractores o errores');
  chk(d.criterios.length >= 3 && d.pistas(R0.p).length === 3, d.id + ': criterios o pistas');
  const codice = [...AC.catalogo.cierre(d.requiere)].filter(t => t !== d.teorema);
  let n = 0;
  MODOS.forEach(modo => {
    const escalas = modo === 'huecos' ? [0, 1] : [null];
    escalas.forEach(esc => {
      for (let s = 0; s < Math.min(SEMILLAS, 200); s++) {
        let inst;
        try { inst = AC.ejercicio.instanciar({ tipo: 'dem', id: d.id, modo, seed: 'D' + s, escalon: esc, guiada: s % 2 === 0 }, { codice }); } catch (e) { err(d.id + ' ' + modo + ': ' + e.message); return; }
        n++;
        const ok = AC.ejercicio.corregir(inst, bot.resolver(inst));
        if (!ok.ok) { err(d.id + ' ' + modo + esc + ' semilla ' + s + ': la solución de referencia no se acepta: ' + ok.msg); continue; }
        const mal = AC.ejercicio.corregir(inst, bot.equivocada(inst));
        chk(!mal.ok, d.id + ' ' + modo + ' semilla ' + s + ': acepta una respuesta equivocada');
        // los huecos de texto nunca dejan marcadores sin resolver
        chk(!JSON.stringify(inst.entrada).includes('⟦') && !inst.enunciado.includes('⟦'), d.id + ' ' + modo + ': quedó un marcador ⟦⟧');
        if (modo === 'ordenar' || modo === 'construccion') {
          const ids = inst.entrada.items.map(i => i.id);
          chk(ids.join() !== bot.resolver(inst).usadas.join(), d.id + ': el orden barajado coincide con el de referencia');
          // incluir un distractor se rechaza
          const dist = ids.find(i => i.startsWith('X'));
          const r1 = bot.resolver(inst); r1.usadas = r1.usadas.concat(dist);
          chk(!AC.ejercicio.corregir(inst, r1).ok, d.id + ': acepta un distractor');
          // omitir una línea se rechaza
          const r2 = bot.resolver(inst); r2.usadas = r2.usadas.slice(1);
          chk(!AC.ejercicio.corregir(inst, r2).ok, d.id + ': acepta una demostración incompleta');
          // todos los órdenes topológicos se aceptan: invertimos líneas incomparables
          const lin = inst.verificador.args.g.lineas, base = bot.resolver(inst);
          const alt = AC.demo.topologico(lin.map(l => ({ id: l.id, deps: l.deps }))).slice();
          for (let i = 0; i + 1 < alt.length; i++) { const a = lin.find(l => l.id === alt[i + 1]); if (!a.deps.includes(alt[i])) { const u = alt.slice(); [u[i], u[i + 1]] = [u[i + 1], u[i]]; const r3 = Object.assign({}, base, { usadas: u }); chk(AC.ejercicio.corregir(inst, r3).ok, d.id + ': rechaza un orden válido ' + u.join()); } }
        }
        if (modo === 'justificar' || modo === 'construccion') {
          const ops = modo === 'justificar' ? inst.entrada.lineas.map(l => l.opciones) : Object.values(inst.entrada.opciones);
          ops.forEach(o => { chk(new Set(o.map(x => x.id)).size === o.length && o.length >= 3, d.id + ': opciones de justificación repetidas o escasas'); o.forEach(x => { if (x.tipo === 'teorema') chk(codice.includes(x.id) || x.id === d.teorema, d.id + ': ofrece un teorema que no está en el Códice (' + x.id + ')'); }); });
        }
        if (modo === 'huecos') Object.values(inst.entrada.huecos).forEach(h => chk(h.opciones.length >= 2 && h.correcta >= 0 && h.correcta < h.opciones.length, d.id + ': hueco mal formado'));
        if (modo === 'cazar-error') { const a = inst.verificador.args; chk(inst.entrada.diagnosticos.some(x => x.id === a.diag), d.id + ': el diagnóstico correcto no está entre las opciones'); }
      }
    });
  });
  console.log('  ✓ ' + d.id.padEnd(28) + n + ' instancias verificadas en ' + MODOS.length + ' modos');
});
// uso circular: elegir el propio teorema como justificación se detecta
(function () {
  const d = AC.reg.demos['dem.contrapositiva'];
  let visto = false;
  for (let s = 0; s < 60 && !visto; s++) {
    const inst = AC.ejercicio.instanciar({ tipo: 'dem', id: d.id, modo: 'justificar', seed: 'C' + s }, { codice: [] });
    const lin = inst.entrada.lineas.find(l => l.opciones.some(o => o.id === d.teorema));
    if (lin) { const resp = bot.resolver(inst); resp.just[lin.id] = d.teorema; const r = AC.ejercicio.corregir(inst, resp); visto = !r.ok && r.firma && r.firma.id === 'uso-circular'; }
  }
  chk(visto, 'el uso circular del teorema que se demuestra debería detectarse');
})();
// cuotas de cada nivel: ≥4 generadores de aplicación, demostraciones sobre ≥4 enunciados y ≥8 ejercicios de demostración
Object.values(AC.reg.niveles).forEach(n => {
  const c = AC.catalogo.delNivel(n.id), app = c.gens.filter(g => g.familia === 'aplicacion'), dg = c.gens.filter(g => g.familia === 'demostracion');
  const enun = new Set(c.demos.map(d => d.enunciadoId)); dg.forEach(g => enun.add(g.id));
  chk(app.length >= 4, 'el nivel ' + n.id + ' necesita ≥4 generadores de aplicación (tiene ' + app.length + ')');
  chk(enun.size >= 4, 'el nivel ' + n.id + ' necesita demostraciones sobre ≥4 enunciados (tiene ' + enun.size + ')');
  chk(c.demos.length * MODOS.length + dg.length >= 8, 'el nivel ' + n.id + ' necesita ≥8 ejercicios de demostración');
  chk(n.leccion && n.leccion.definiciones.length >= 3 && n.leccion.ejemplo.pasos.length >= 2 && AC.reg.teoremas[n.leccion.teorema], 'el nivel ' + n.id + ' necesita mini-lección completa');
  console.log('  nivel ' + n.id + ': ' + app.length + ' generadores de aplicación, ' + c.demos.length + ' demostraciones × ' + MODOS.length + ' modos, ' + dg.length + ' de V/F y contraejemplo, ' + n.teoremas.length + ' teoremas.');
});

require('./tex.js')({ AC, SRC, CTX, err, chk, titulo });

/* ============ motor de aprendizaje ============ */
titulo('Motor de aprendizaje');
const J = AC.juego;
let reloj = new Date(2026, 10, 1, 10, 0, 0);
J.reloj = () => reloj;
const sumaDias = n => { reloj = new Date(reloj.getTime() + n * 86400000); };

// Leitner
(function () {
  let h = AC.leitner.actualizar(null, 'ok', '2026-11-01');
  chk(h.caja === 2 && h.vence === '2026-11-04', 'Leitner: primer acierto → caja 2, vence en 3 días (' + h.vence + ')');
  h = AC.leitner.actualizar(h, 'ok', '2026-11-01'); chk(h.caja === 2, 'Leitner: solo el primer resultado del día mueve la caja');
  h = AC.leitner.actualizar(h, 'ok', '2026-11-04'); chk(h.caja === 3 && h.vence === '2026-11-11', 'Leitner: caja 3 → 7 días');
  h = AC.leitner.actualizar(h, 'fallo', '2026-11-11'); chk(h.caja === 2, 'Leitner: un fallo retrocede una caja');
  let g = { caja: 5 }; g = AC.leitner.actualizar(g, 'ok', '2026-01-01'); chk(g.caja === 5 && g.vence === '2026-02-05', 'Leitner: la caja 5 se queda y vence a 35 días');
  chk(AC.leitner.vigencia({ caja: 2, vence: '2026-11-04' }, '2026-11-04') === 1 && AC.leitner.vigencia({ caja: 2, vence: '2026-11-04' }, '2026-11-05') < 1, 'vigencia decae solo al vencer');
  chk(AC.leitner.vigencia({ caja: 2, vence: '2026-11-04' }, '2027-06-01') === 0, 'vigencia mínima 0, nunca bloquea');
})();
// dominio: 3 pistas no cuentan; variantes repetidas cuentan una vez; hace falta 2 enunciados
(function () {
  const niv = AC.dominio.nuevo();
  for (let i = 0; i < 10; i++) AC.dominio.registrar(niv, { k: 'a' + i, ok: true, w: 1, dem: false, e: null, ma: 0 });
  chk(!AC.dominio.evaluar(niv).cumple, 'dominio: 10 aciertos de aplicación sin demostraciones no basta');
  const niv2 = AC.dominio.nuevo();
  for (let i = 0; i < 8; i++) AC.dominio.registrar(niv2, { k: 'a' + i, ok: true, w: 1, dem: false, e: null, ma: 0 });
  AC.dominio.registrar(niv2, { k: 'd1', ok: true, w: 1, dem: true, e: 't1', ma: 0 });
  AC.dominio.registrar(niv2, { k: 'd2', ok: true, w: 1, dem: true, e: 't1', ma: 0 });
  chk(!AC.dominio.evaluar(niv2).cumple, 'dominio: dos demostraciones del mismo enunciado no bastan');
  AC.dominio.registrar(niv2, { k: 'd3', ok: true, w: 1, dem: true, e: 't2', ma: 0 });
  chk(AC.dominio.evaluar(niv2).cumple, 'dominio: 10 aciertos y 2 enunciados distintos sí');
  AC.dominio.registrar(niv2, { k: 'd3', ok: true, w: 1, dem: true, e: 't2', ma: 0 });
  chk(niv2.ventana.length === 10, 'dominio: repetir la misma variante cuenta una sola vez');
  chk(AC.dominio.entra({}, 3, 'practica') === false && AC.dominio.entra({}, 2, 'practica') === true && AC.dominio.entra({}, 0, 'reloj') === false, 'dominio: 3 pistas y contrarreloj no entran');
  const niv3 = AC.dominio.nuevo();
  for (let i = 0; i < 7; i++) AC.dominio.registrar(niv3, { k: 'a' + i, ok: true, w: 1, dem: false, e: null, ma: 0 });
  for (let i = 0; i < 3; i++) AC.dominio.registrar(niv3, { k: 'f' + i, ok: false, w: 1, dem: true, e: 't' + i, ma: 0 });
  chk(AC.dominio.evaluar(niv3).ratio === 0.7, 'dominio: 7/10 es 70 %');
})();
// XP, racha, calibración
chk(AC.xp.nivelDe(0) === 1 && AC.xp.nivelDe(100) === 2 && AC.xp.nivelDe(AC.xp.acum(5)) === 6, 'XP: curva creciente');
chk(AC.xp.calcular({ inst: { familia: 'demostracion', modo: 'huecos', escalon: 1, dificultad: 2 }, pistas: 0 }) > AC.xp.calcular({ inst: { familia: 'aplicacion', dificultad: 2 }, pistas: 0 }), 'XP: más por demostraciones');
chk(AC.xp.calcular({ inst: { familia: 'aplicacion', dificultad: 2 }, pistas: 0 }) > AC.xp.calcular({ inst: { familia: 'aplicacion', dificultad: 2 }, pistas: 2 }), 'XP: las pistas la reducen');
chk(AC.xp.calcular({ inst: { familia: 'aplicacion', dificultad: 2 }, pistas: 0, vencida: true }) > AC.xp.calcular({ inst: { familia: 'aplicacion', dificultad: 2 }, pistas: 0 }), 'XP: más por repasos pendientes');
chk(AC.xp.calcular({ inst: { familia: 'aplicacion', dificultad: 2 }, pistas: 0, repetidas: 6 }) < AC.xp.calcular({ inst: { familia: 'aplicacion', dificultad: 2 }, pistas: 0, repetidas: 0 }) / 3, 'XP: rendimientos decrecientes');

// guardado
(function () {
  const e = AC.guardado.nuevo('2026-11-01'); e.jugador.xp = 123; e.logros.x = '2026-11-01';
  const txt = AC.guardado.exportar(e, 'ahora');
  chk(AC.guardado.importar(txt, '2026-11-01').jugador.xp === 123, 'exportar/importar conserva el progreso');
  chk((() => { try { AC.guardado.importar(txt.replace('123', '124'), '2026-11-01'); return false; } catch (x) { return /suma de control/.test(x.message); } })(), 'importar detecta archivos alterados');
  chk((() => { try { AC.guardado.importar('{"app":"otro"}', '2026-11-01'); return false; } catch (x) { return true; } })(), 'importar rechaza archivos ajenos');
  chk((() => { try { AC.guardado.migrar({ v: 99 }, '2026-11-01'); return false; } catch (x) { return /más nueva/.test(x.message); } })(), 'migrar rechaza versiones futuras');
  const viejo = { v: 1, jugador: { xp: 5 } };
  const m = AC.guardado.migrar(viejo, '2026-11-01');
  chk(m.jugador.xp === 5 && Array.isArray(m.intentos) && m.ajustes.tema === 'oscuro', 'migrar rellena los campos que faltan');
  AC.almacen.persistente = false; chk(AC.guardado.guardar(e) === false, 'sin localStorage el guardado sigue en memoria y lo indica');
})();

/* simulación: un jugador que contesta bien sin pistas */
function jugar(estado, opciones) {
  J.usar(estado);
  const log = { tareas: 0, noDisponibles: 0, proof: 0, ganados: [], dominioEn: null, repetidasSeguidas: 0 };
  const recientes = [];
  for (let i = 0; i < opciones.n; i++) {
    const hoy = J.hoy();
    const t = AC.planificador.siguiente(estado, { nivel: opciones.nivel, hoy });
    const def = t.tipo === 'gen' ? AC.reg.generadores[t.id] : AC.reg.demos[t.id];
    if (!AC.codice.cumple(estado, def.requiere)) log.noDisponibles++;
    const inst = J.instanciar(t);
    if (recientes.slice(-10).includes(inst.variantKey)) log.repetidasSeguidas++;
    recientes.push(inst.variantKey);
    const resp = opciones.falla && opciones.falla(i, inst) ? bot.equivocada(inst) : bot.resolver(inst);
    const res = J.corregir(inst, resp);
    if (inst.familia === 'demostracion') log.proof++;
    const ef = J.registrar(inst, res, { pistas: opciones.pistas || 0, ms: 4000, confianza: i % 3 === 0 ? (res.ok ? 2 : 0) : null, contexto: 'practica' });
    log.tareas++;
    if (ef.teoremaGanado) log.ganados.push(ef.teoremaGanado + '@' + i);
    if (ef.dominioNuevo && log.dominioEn === null) log.dominioEn = i + 1;
    if (opciones.cadaDia && i % opciones.cadaDia === opciones.cadaDia - 1) sumaDias(1);
  }
  return log;
}
(function () {
  const e = AC.guardado.nuevo('2026-11-01');
  const log = jugar(e, { n: 80, nivel: '1.1', cadaDia: 8 });
  chk(log.noDisponibles === 0, 'el planificador ofreció ' + log.noDisponibles + ' tareas con teoremas que faltan en el Códice');
  chk(AC.codice.ganados(e).length === 5, 'tras 80 tareas perfectas deberían estar los 5 teoremas en el Códice (hay ' + AC.codice.ganados(e).length + ')');
  chk(e.niveles['1.1'] && e.niveles['1.1'].dominado, 'el jugador perfecto debería dominar el nivel 1.1 (ventana ' + JSON.stringify(e.niveles['1.1'] && AC.dominio.evaluar(e.niveles['1.1'])) + ')');
  chk(log.dominioEn !== null && log.dominioEn >= 10, 'dominio no antes de 10 intentos (fue ' + log.dominioEn + ')');
  chk(log.proof / log.tareas >= 0.3, 'al menos 30 % de demostraciones (fue ' + Math.round(100 * log.proof / log.tareas) + ' %)');
  chk(log.repetidasSeguidas <= 4, 'demasiadas variantes repetidas entre las últimas 10 (' + log.repetidasSeguidas + ')');
  chk(Object.values(e.teoremas).some(t => t.maduro), 'algún teorema debería llegar al escalón 3 (maduro)');
  chk(e.jugador.xp > 0 && e.jugador.nivel > 1, 'XP y nivel de jugador');
  chk(e.jugador.racha.cuenta >= 5, 'la racha cuenta días con ≥5 ejercicios (' + e.jugador.racha.cuenta + ')');
  chk(e.niveles['1.1'].estrellas >= 1 && e.logros['primer-teorema'] && e.logros['primer-nivel'], 'estrellas y logros');
  chk(e.estadisticas.calibracion.some(c => c[0] > 0), 'se registra la calibración');
  console.log('  jugador perfecto: ' + log.tareas + ' tareas, dominio en la n.º ' + log.dominioEn + ', teoremas ' + log.ganados.join(' ') + ', XP ' + e.jugador.xp + ', nivel ' + e.jugador.nivel);
  const sim = JSON.stringify(e);
  chk(AC.guardado.importar(AC.guardado.exportar(e, 'x'), J.hoy()).jugador.xp === e.jugador.xp && JSON.stringify(AC.guardado.migrar(JSON.parse(sim), J.hoy())).length > 100, 'un guardado real sobrevive a exportar e importar');
})();
(function () { // con tres pistas no se domina
  const e = AC.guardado.nuevo('2026-11-01');
  const log = jugar(e, { n: 40, nivel: '1.1', pistas: 3 });
  chk(!e.niveles['1.1'] || !e.niveles['1.1'].dominado, 'con 3 pistas en todo no se debe dominar el nivel');
  chk((e.niveles['1.1'] ? e.niveles['1.1'].ventana.length : 0) === 0, 'los intentos con 3 pistas no entran en la ventana');
  chk(AC.codice.ganados(e).length >= 1 && e.jugador.xp > 0, 'con 3 pistas sí se avanza en el Códice y se gana algo de XP (nunca bloquean)');
  console.log('  jugador con 3 pistas: ' + log.tareas + ' tareas, sin dominio, ' + AC.codice.ganados(e).length + ' teoremas.');
})();
(function () { // un fallo baja un escalón; la racha pierde con días sin jugar
  const e = AC.guardado.nuevo('2026-11-01'); J.usar(e);
  const task = { tipo: 'dem', id: 'dem.contrapositiva', modo: 'huecos', seed: 'f1', escalon: 0, guiada: false };
  let inst = J.instanciar(task); J.registrar(inst, J.corregir(inst, bot.resolver(inst)), { pistas: 0 });
  chk(e.teoremas['t.contrapositiva'].escalon === 1 && AC.codice.tiene(e, 't.contrapositiva'), 'éxito en el escalón 0 → entra al Códice y sube al 1');
  inst = J.instanciar({ tipo: 'dem', id: 'dem.contrapositiva', modo: 'huecos', seed: 'f2', escalon: 1, guiada: false });
  J.registrar(inst, J.corregir(inst, bot.equivocada(inst)), { pistas: 0 });
  chk(e.teoremas['t.contrapositiva'].escalon === 0 && AC.codice.tiene(e, 't.contrapositiva'), 'un fallo baja un escalón pero el teorema sigue en el Códice');
  const r = e.jugador.racha;
  const e2 = AC.guardado.nuevo('2026-11-01'); J.usar(e2);
  for (let i = 0; i < 5; i++) { const g = J.instanciar({ tipo: 'gen', id: 'w1.n1.tabla-de-verdad', seed: 'r' + i }); J.registrar(g, J.corregir(g, bot.resolver(g)), {}); }
  chk(e2.jugador.racha.cuenta === 1, 'racha: 5 ejercicios cuentan el día');
  sumaDias(2); // un día sin jugar: sin gracia se rompe
  for (let i = 0; i < 5; i++) { const g = J.instanciar({ tipo: 'gen', id: 'w1.n1.tabla-de-verdad', seed: 'q' + i }); J.registrar(g, J.corregir(g, bot.resolver(g)), {}); }
  chk(e2.jugador.racha.cuenta === 1, 'racha: sin ficha de gracia, un día perdido la reinicia');
  e2.jugador.racha.gracia = 1; sumaDias(2);
  for (let i = 0; i < 5; i++) { const g = J.instanciar({ tipo: 'gen', id: 'w1.n1.tabla-de-verdad', seed: 'p' + i }); J.registrar(g, J.corregir(g, bot.resolver(g)), {}); }
  chk(e2.jugador.racha.cuenta === 2 && e2.jugador.racha.gracia === 0, 'racha: la ficha de gracia absorbe un día perdido');
})();
(function () { // repaso, vigencia, desafío diario y contrarreloj
  const e = AC.guardado.nuevo('2026-11-01'); J.usar(e);
  jugar(e, { n: 60, nivel: '1.1', cadaDia: 6 });
  sumaDias(40);
  const hoy = J.hoy();
  const venc = Object.keys(e.habilidades).filter(h => AC.leitner.vencida(e.habilidades[h], hoy));
  chk(venc.length > 0, 'tras 40 días hay habilidades vencidas');
  const rep = AC.planificador.sesionRepaso(e, hoy, 12);
  chk(rep.length > 0 && rep.length <= 12, 'sesión de repaso con 1–12 tareas (' + rep.length + ')');
  rep.forEach(t => { const def = t.tipo === 'gen' ? AC.reg.generadores[t.id] : AC.reg.demos[t.id]; chk(AC.codice.cumple(e, def.requiere), 'repaso ofrece algo no disponible'); });
  chk(e.niveles['1.1'].dominado, 'el dominio se conserva aunque se venzan las habilidades (nunca vuelve a bloquear)');
  const d1 = AC.reto.tareas(e, hoy), d2 = AC.reto.tareas(e, hoy), d3 = AC.reto.tareas(e, AC.fecha.suma(hoy, 1));
  chk(d1.length === 5 && JSON.stringify(d1) === JSON.stringify(d2), 'el desafío diario es determinista para la misma fecha');
  chk(JSON.stringify(d1) !== JSON.stringify(d3), 'el desafío diario cambia con la fecha');
  d1.forEach(t => { const inst = J.instanciar(t); chk(AC.ejercicio.corregir(inst, bot.resolver(inst)).ok, 'el desafío diario contiene un ejercicio que no se resuelve'); });
  const rng = AC.rng('reloj'); const tr = AC.planificador.siguienteReloj(e, rng);
  chk(tr && AC.reg.generadores[tr.id].familia === 'aplicacion', 'contrarreloj solo con contenido dominado');
  const virgen = AC.guardado.nuevo('2026-11-01'); chk(AC.planificador.siguienteReloj(virgen, rng) === null, 'contrarreloj no ofrece nada si no hay nada dominado');
  const inst = J.instanciar(tr);
  const antes = JSON.stringify(e.niveles['1.1'].ventana);
  J.registrar(inst, J.corregir(inst, bot.resolver(inst)), { pistas: 0, contexto: 'reloj' });
  chk(JSON.stringify(e.niveles['1.1'].ventana) === antes, 'contrarreloj no mueve la ventana de dominio');
  const cal = AC.logros.calibracion(e); chk(cal.total > 0 && cal.error !== null, 'calibración calculable');
})();

(function () { // mundo completo y jefe
  const e = AC.guardado.nuevo('2026-11-01'); J.usar(e);
  chk(!AC.jefe.disponible(e, 1).ok, 'el jefe no está disponible al empezar');
  chk(J.nivelAbierto('1.1') && !J.nivelAbierto('1.2'), 'solo el primer nivel está abierto al empezar');
  const niveles = Object.keys(AC.reg.niveles);
  let tareas = 0;
  niveles.forEach(n => {
    let i = 0;
    while (!(e.niveles[n] && e.niveles[n].dominado) && i < 200) {
      const t = AC.planificador.siguiente(e, { nivel: n, hoy: J.hoy() });
      const def = t.tipo === 'gen' ? AC.reg.generadores[t.id] : AC.reg.demos[t.id];
      if (!AC.codice.cumple(e, def.requiere)) err('el planificador ofreció algo no disponible en ' + n);
      const inst = J.instanciar(t), res = J.corregir(inst, bot.resolver(inst));
      if (!res.ok) { err(n + ': el bot falló ' + inst.id + ' ' + (inst.modo || '') + ': ' + res.msg); break; }
      J.registrar(inst, res, { pistas: 0, ms: 3000, contexto: 'practica' }); i++; tareas++;
    }
    chk(e.niveles[n] && e.niveles[n].dominado, 'el jugador perfecto debería dominar el nivel ' + n);
    // seguir practicando el nivel debe acabar entregando los teoremas que falten (la demostración «de ceremonia» tiene prioridad)
    for (let j = 0; j < 80 && AC.reg.niveles[n].teoremas.some(t => !AC.codice.tiene(e, t)); j++) {
      const t = AC.planificador.siguiente(e, { nivel: n, hoy: J.hoy() }), inst = J.instanciar(t), res = J.corregir(inst, bot.resolver(inst));
      J.registrar(inst, res, { pistas: 0, ms: 3000, contexto: 'practica' }); tareas++;
    }
    if (n !== niveles[niveles.length - 1]) chk(J.nivelAbierto(niveles[niveles.indexOf(n) + 1]), 'al dominar ' + n + ' se abre el siguiente');
    AC.reg.niveles[n].teoremas.forEach(t => chk(AC.codice.tiene(e, t), 'el teorema ' + t + ' debería estar en el Códice'));
    sumaDias(1);
  });
  console.log('  mundo 1: ' + niveles.length + ' niveles dominados en ' + tareas + ' tareas perfectas; teoremas en el Códice: ' + AC.codice.ganados(e).length + ' de ' + Object.keys(AC.reg.teoremas).length + '.');
  const d = AC.jefe.disponible(e, 1); chk(d.ok, 'con todo dominado el jefe está disponible');
  // victoria sin pistas
  let B = AC.jefe.nuevo(e, 1);
  chk(B.cola.length === 10 && B.cola.filter(x => x.fase === 'calculo').length === 6 && B.cola.filter(x => x.fase === 'estrategia').length === 3 && B.cola.filter(x => x.fase === 'demostracion').length === 1, 'el jefe tiene 6 + 3 + 1 pruebas');
  chk(AC.jefe.DANO.calculo * 6 + AC.jefe.DANO.estrategia * 3 + AC.jefe.DANO.demostracion === 100, 'el daño total suma 100');
  const ventana = JSON.stringify(e.niveles['1.1'].ventana);
  for (let paso; (paso = AC.jefe.actual(B)); ) {
    const inst = J.instanciar(paso.task), res = J.corregir(inst, bot.resolver(inst));
    chk(res.ok, 'el jefe: la solución de referencia de ' + inst.id + ' no se acepta');
    J.registrar(inst, res, { pistas: 0, ms: 3000, contexto: 'jefe' });
    AC.jefe.resolver(B, res.ok, 0, inst.habilidades);
  }
  chk(B.resultado === 'victoria' && B.vida === 0 && B.corazones === 3, 'el jugador perfecto derrota al jefe sin perder corazones');
  chk(JSON.stringify(e.niveles['1.1'].ventana) === ventana, 'los intentos del jefe no tocan la ventana de dominio');
  const logros = AC.jefe.cerrar(e, B, J.hoy());
  chk(e.mundos[1].jefeDerrotado && e.mundos[1].sinPistas && logros.includes('sin-pistas-jefe'), 'victoria sin pistas: jefe derrotado y logro «Sin pistas en un jefe»');
  // el jefe exige citar teoremas de niveles anteriores (la demostración es una construcción abierta)
  AC.reg.mundos[0].jefe.demos.forEach(id => { const citados = new Set(AC.demo.resolver(AC.reg.demos[id], AC.rng('x')).lineas.map(l => l.just.ref).filter(x => AC.reg.teoremas[x])); chk(citados.size >= 2, id + ': la demostración del jefe debe citar al menos 2 teoremas de niveles anteriores (cita ' + citados.size + ')'); });
  // derrota: tres fallos, repaso dirigido y reintento con otras instancias
  B = AC.jefe.nuevo(e, 1); const primera = JSON.stringify(B.cola.map(x => x.task.seed));
  let fallos = 0;
  for (let paso; (paso = AC.jefe.actual(B)); ) {
    const inst = J.instanciar(paso.task), mala = fallos < 3, res = J.corregir(inst, mala ? bot.equivocada(inst) : bot.resolver(inst));
    if (mala) fallos++;
    J.registrar(inst, res, { pistas: 1, ms: 3000, contexto: 'jefe' }); AC.jefe.resolver(B, res.ok, 1, inst.habilidades);
  }
  chk(B.resultado === 'derrota' && B.corazones === 0 && B.vida > 0, 'tres fallos son una derrota con vida restante');
  const dir = AC.jefe.repasoDirigido(e, B);
  chk(dir.length >= 3 && dir.length <= 5, 'el repaso dirigido tiene entre 3 y 5 ejercicios');
  chk(dir.every(t => { const inst = J.instanciar(t); return AC.ejercicio.corregir(inst, bot.resolver(inst)).ok; }), 'los ejercicios del repaso dirigido se pueden resolver');
  const intentos = e.mundos[1].intentos; AC.jefe.cerrar(e, B, J.hoy());
  chk(e.mundos[1].intentos === intentos + 1 && e.mundos[1].jefeDerrotado, 'una derrota no borra una victoria anterior');
  chk(JSON.stringify(AC.jefe.nuevo(e, 1).cola.map(x => x.task.seed)) !== primera, 'el reintento usa instancias nuevas');
  // con pistas no hay logro de «sin pistas»
  const e2 = AC.guardado.nuevo('2026-11-01'); e2.mundos[1] = { jefeDerrotado: false, intentos: 0, sinPistas: false };
  const B2 = { pistas: 2, resultado: 'victoria', mundo: 1 }; const l2 = AC.jefe.cerrar(e2, B2, '2026-11-01');
  chk(e2.mundos[1].jefeDerrotado && !e2.mundos[1].sinPistas && !l2.includes('sin-pistas-jefe'), 'con pistas se derrota al jefe pero sin el logro');
})();

console.log('\n' + (malos ? '✗ ' + malos + ' fallo(s) en ' + comprobaciones + ' comprobaciones' : '✓ ' + comprobaciones + ' comprobaciones, 0 fallos'));
process.exit(malos ? 1 : 0);
