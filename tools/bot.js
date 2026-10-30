/* Jugador de referencia para las pruebas: resuelve cualquier instancia con la información del propio ejercicio. */
/* Funciona en Node (módulo) y en el navegador (carga con fetch + eval; expone AC_BOT). */
const AC = globalThis.AC;
const L = AC.logic;

function rutaMinima(inicio, leyes) {
  let fr = [{ f: L.parse(inicio), ruta: [] }]; const vistos = new Set([L.str(fr[0].f)]);
  for (let d = 0; d < 9; d++) {
    const hit = fr.find(x => L.esFNN(x.f)); if (hit) return hit.ruta;
    const sig = [];
    fr.forEach(x => L.reescrituras(x.f, leyes).forEach(r => { const g = L.aplicar(x.f, r.ruta, r.ley); const s = L.str(g); if (!vistos.has(s)) { vistos.add(s); sig.push({ f: g, ruta: x.ruta.concat([{ ley: r.ley, ruta: r.ruta }]) }); } }));
    fr = sig;
  }
  return null;
}

function resolver(inst) {
  const a = inst.verificador.args;
  switch (inst.verificador.id) {
    case 'tabla-de-verdad': return a.esperado.slice();
    case 'entero': case 'racional': return String(a.esperado);
    case 'equivalente-logica': return inst.solucionLogica;
    case 'indice': return a.esperado;
    case 'conjunto-indices': return a.esperado.slice();
    case 'ruta-valida': return rutaMinima(a.inicio, a.leyes);
    case 'vf-justificado': return { valor: a.valor, just: a.just };
    case 'matriz': return a.esperado.map(f => f.slice());
    case 'asignacion': {
      const f = L.parse(a.f), g = L.parse(a.g);
      return L.envs(a.vars).find(e => L.ev(f, e) !== L.ev(g, e));
    }
    case 'demo-ordenar': return { usadas: AC.demo.topologico(a.g.lineas.map(l => ({ id: l.id, deps: l.deps }))) };
    case 'demo-construccion': return { usadas: AC.demo.topologico(a.g.lineas.map(l => ({ id: l.id, deps: l.deps }))), just: Object.fromEntries(a.g.lineas.map(l => [l.id, l.ref])) };
    case 'demo-justificar': return { just: Object.fromEntries(a.g.lineas.map(l => [l.id, l.ref])) };
    case 'demo-huecos': return Object.assign({}, a.esperado);
    case 'demo-estrategia': return a.validas.slice();
    case 'demo-cazar': return { linea: a.linea, diag: a.diag };
    case 'autoevaluacion': return { checks: a.criterios.map(() => true) };
  }
  throw new Error('el bot no sabe resolver ' + inst.verificador.id);
}

/* una respuesta distinta de la correcta (para comprobar que se rechaza) */
function equivocada(inst) {
  const a = inst.verificador.args, r = resolver(inst);
  switch (inst.verificador.id) {
    case 'tabla-de-verdad': return r.map((x, i) => i === 0 ? !x : x);
    case 'entero': case 'racional': return String(Number(r) + 1);
    case 'equivalente-logica': return 'P';
    case 'indice': return (r + 1) % inst.entrada.opciones.length;
    case 'conjunto-indices': return r.length ? [] : [0];
    case 'ruta-valida': return [];
    case 'vf-justificado': return { valor: !r.valor, just: r.just };
    case 'matriz': return r.map((f, i) => f.map((x, j) => (i === 0 && j === 0 ? '9' : x)));
    case 'asignacion': { const f = L.parse(a.f), g = L.parse(a.g); return L.envs(a.vars).find(e => L.ev(f, e) === L.ev(g, e)); }
    case 'demo-ordenar': return { usadas: r.usadas.slice().reverse() };
    case 'demo-construccion': return { usadas: r.usadas, just: Object.fromEntries(Object.keys(r.just).map(k => [k, 'hip'])) };
    case 'demo-justificar': return { just: Object.fromEntries(Object.keys(r.just).map(k => [k, r.just[k] === 'hip' ? 'b.casos' : 'hip'])) };
    case 'demo-huecos': return Object.fromEntries(Object.keys(r).map(k => [k, (r[k] + 1) % inst.entrada.huecos[k].opciones.length]));
    case 'demo-estrategia': return [];
    case 'demo-cazar': return { linea: inst.entrada.lineas.find(l => l.id !== a.linea).id, diag: a.diag };
    case 'autoevaluacion': return { checks: a.criterios.map(() => false) };
  }
  return null;
}

if (typeof module !== 'undefined') module.exports = { resolver, equivocada, rutaMinima };
else globalThis.AC_BOT = { resolver, equivocada, rutaMinima };
