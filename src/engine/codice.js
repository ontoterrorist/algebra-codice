/* El Códice: teoremas ganados. Un teorema no demostrado todavía no se puede usar. */
(function (AC) {
  AC.codice = {
    ganados(est) { return Object.keys(est.teoremas).filter(t => est.teoremas[t].ganado); },
    tiene(est, t) { return !!(est.teoremas[t] && est.teoremas[t].ganado); },
    cumple(est, requiere) { return (requiere || []).every(t => AC.codice.tiene(est, t)); },
    /* maduración 0–3: 0 sin ganar; 1 tras el escalón 0; 2 tras el 1; 3 tras el 2 */
    madurez(est, t) {
      const x = est.teoremas[t];
      if (!x || !x.ganado) return 0;
      return x.maduro ? 3 : Math.min(2, 1 + (x.escalon > 1 ? 1 : 0));
    },
    estado(est, t) { // 'bloqueado' | 'disponible' | 'en-curso' | 'dominado'
      if (AC.codice.tiene(est, t)) return est.teoremas[t].maduro ? 'dominado' : 'en-curso';
      return AC.codice.cumple(est, AC.reg.teoremas[t].requiere) ? 'disponible' : 'bloqueado';
    },
  };
  if (typeof module !== 'undefined') module.exports = AC;
})(globalThis.AC = globalThis.AC || {});
