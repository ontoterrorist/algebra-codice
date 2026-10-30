/* Desafío diario: 5 ejercicios generados con la fecha (y el progreso abierto) como semilla. */
(function (AC) {
  AC.reto = {
    tareas(est, dia) {
      const abiertas = Object.keys(AC.reg.niveles).filter(n => AC.juego.nivelAbierto(n));
      const codice = AC.codice.ganados(est).sort().join(',');
      const rng = AC.rng('diario|' + dia + '|' + abiertas.join(',') + '|' + codice);
      const out = [];
      const pool = [];
      abiertas.forEach(n => {
        const { gens, demos } = AC.planificador.disponibles(est, n);
        gens.forEach(g => pool.push({ prof: g.familia === 'demostracion', mk: s => ({ tipo: 'gen', id: g.id, seed: s }), habs: g.habilidades }));
        demos.forEach(d => { if (d.teorema && !AC.codice.tiene(est, d.teorema)) return; ['ordenar', 'justificar', 'cazar-error', 'estrategia'].forEach(m => pool.push({ prof: true, mk: s => ({ tipo: 'dem', id: d.id, modo: m, seed: s, escalon: null, guiada: false }), habs: d.habilidades })); });
      });
      if (!pool.length) return out;
      const usadas = new Set();
      for (let i = 0; i < 5; i++) {
        let cand = pool.filter(p => (i === 2 ? p.prof : true) && !p.habs.some(h => usadas.has(h)));
        if (!cand.length) cand = pool;
        const p = rng.pick(cand);
        p.habs.forEach(h => usadas.add(h));
        out.push(p.mk(dia + '|' + i + '|' + rng.int(0, 99999)));
      }
      return out;
    },
  };
  if (typeof module !== 'undefined') module.exports = AC;
})(globalThis.AC = globalThis.AC || {});
