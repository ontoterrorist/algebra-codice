/* XP: más por demostraciones, por no usar pistas y por repasos pendientes; rendimientos decrecientes al repetir lo dominado. */
(function (AC) {
  const MP = [1.25, 0.8, 0.6, 0.4];
  const acum = n => Math.round(100 * Math.pow(n, 1.5)); // XP necesaria para pasar del nivel n al n+1

  AC.xp = {
    acum,
    nivelDe(xp) { let n = 1; while (xp >= acum(n)) n++; return n; },
    progreso(xp) { const n = AC.xp.nivelDe(xp), a = n > 1 ? acum(n - 1) : 0; return { nivel: n, desde: a, hasta: acum(n), frac: (xp - a) / (acum(n) - a) }; },
    base(inst) {
      if (inst.familia === 'demostracion') {
        if (inst.modo === 'construccion') return 40;
        if (inst.modo === 'huecos') return 20 + 10 * (inst.escalon || 0);
        return 20;
      }
      return 10 * (1 + 0.25 * (inst.dificultad - 1));
    },
    /* {inst, pistas, vencida, repetidas, parcial, autoeval, jefe} */
    calcular(o) {
      let x = AC.xp.base(o.inst) * MP[Math.min(3, o.pistas || 0)];
      if (o.vencida) x *= 1.5;
      else x *= Math.max(0.1, Math.pow(0.6, o.repetidas || 0));
      if (o.parcial) x *= 0.25;
      if (o.autoeval) x *= 0.5;
      if (o.jefe) x *= 2;
      return Math.max(1, Math.round(x));
    },
  };
  if (typeof module !== 'undefined') module.exports = AC;
})(globalThis.AC = globalThis.AC || {});
