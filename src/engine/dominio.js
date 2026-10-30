/* Dominio de un nivel: ≥80 % en los últimos 10 intentos válidos y demostraciones correctas sobre ≥2 enunciados.
   Un acierto con 3 pistas no entra en la ventana; la misma variante cuenta una sola vez; lo autoevaluado cuenta la mitad. */
(function (AC) {
  const TAM = 10;
  const nuevo = () => ({ dominado: false, estrellas: 0, ventana: [] });

  AC.dominio = {
    TAM,
    nuevo,
    entra(inst, pistas, contexto) {
      if (contexto === 'reloj') return false;
      return !(pistas >= 3); // 3 pistas: ni suma ni resta (se decide en §12.1.2)
    },
    registrar(niv, e) { // e = {k, ok, w, dem, e, ma}
      niv.ventana = niv.ventana.filter(x => x.k !== e.k);
      niv.ventana.push(e);
      if (niv.ventana.length > TAM) niv.ventana = niv.ventana.slice(-TAM);
    },
    evaluar(niv) {
      const v = niv.ventana;
      const pesos = v.reduce((s, x) => s + x.w, 0);
      const aciertos = v.reduce((s, x) => s + (x.ok ? x.w : 0), 0);
      const ratio = pesos ? aciertos / pesos : 0;
      const enunciados = new Set(v.filter(x => x.dem && x.ok && !x.ma && x.e).map(x => x.e));
      const cumple = v.length >= TAM && ratio >= 0.8 && enunciados.size >= 2;
      return { n: v.length, ratio, enunciados: enunciados.size, cumple, falta: Math.max(0, TAM - v.length) };
    },
    /* estrellas 1–3 según vigencia de las habilidades del nivel y madurez de sus teoremas */
    estrellas(est, nivelId, hoy) {
      const niv = est.niveles[nivelId];
      if (!niv || !niv.dominado) return 0;
      const def = AC.reg.niveles[nivelId];
      const hs = def.habilidades.map(h => AC.leitner.vigencia(est.habilidades[h], hoy));
      const vig = hs.length ? hs.reduce((a, b) => a + b, 0) / hs.length : 1;
      const teoOk = (def.teoremas || []).every(t => est.teoremas[t] && est.teoremas[t].ganado && est.teoremas[t].escalon >= 1);
      return vig >= 0.9 && teoOk ? 3 : vig >= 0.7 ? 2 : 1;
    },
  };
  if (typeof module !== 'undefined') module.exports = AC;
})(globalThis.AC = globalThis.AC || {});
