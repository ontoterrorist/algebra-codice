/* Instanciación de tareas (generadores y demostraciones) y corrección con firmas de error. */
(function (AC) {
  const reg = AC.reg;

  /* fechas locales «AAAA-MM-DD» */
  AC.fecha = {
    dia(d) {
      d = d || new Date();
      const p = n => (n < 10 ? '0' : '') + n;
      return d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate());
    },
    num(dia) { const [y, m, d] = dia.split('-').map(Number); return Math.round(Date.UTC(y, m - 1, d) / 86400000); },
    suma(dia, n) { const t = new Date((AC.fecha.num(dia) + n) * 86400000); return t.getUTCFullYear() + '-' + String(t.getUTCMonth() + 1).padStart(2, '0') + '-' + String(t.getUTCDate()).padStart(2, '0'); },
    diff(a, b) { return AC.fecha.num(b) - AC.fecha.num(a); },
  };

  function instanciarGen(task, ctx) {
    const g = reg.generadores[task.id];
    if (!g) throw new Error('generador desconocido ' + task.id);
    const rng = AC.rng(task.seed + '|' + g.id);
    const d = g.generar(rng, task.dificultad || g.dificultad, ctx || {});
    if (!d.pistas || d.pistas.length !== 3) throw new Error(g.id + ': hacen falta exactamente 3 pistas');
    return Object.assign({
      tipo: 'gen', id: g.id, seed: task.seed, familia: g.familia, modo: g.modo || 'app', escalon: null,
      mundo: g.mundo, nivel: g.nivel, habilidades: g.habilidades, requiere: g.requiere, dificultad: g.dificultad,
      confianza: g.confianza !== false, autoexplicacion: g.autoexplicacion || null, firmas: [], enunciadoId: null,
    }, d);
  }

  AC.ejercicio = {
    instanciar(task, ctx) { return task.tipo === 'dem' ? AC.demo.instanciar(task, ctx) : instanciarGen(task, ctx); },
    corregir(inst, resp) {
      const r = AC.verificar(inst, resp);
      if (!r.ok && !r.incompleta && !r.sintaxis && !r.autoeval) {
        const f = r.firma || AC.errores.detectar(inst, resp);
        if (f) r.firma = f;
      }
      return r;
    },
  };
  AC.corregir = AC.ejercicio.corregir;

  if (typeof module !== 'undefined') module.exports = AC;
})(globalThis.AC = globalThis.AC || {});
