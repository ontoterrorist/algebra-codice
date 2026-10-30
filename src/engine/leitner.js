/* Leitner por habilidad: cajas 1–5, intervalos 1, 3, 7, 16 y 35 días. Un fallo retrocede una caja. */
(function (AC) {
  const INTERVALOS = [1, 3, 7, 16, 35];
  const nueva = () => ({ caja: 1, visto: null, vence: null, ok: 0, fallo: 0, cambio: null });

  AC.leitner = {
    INTERVALOS,
    nueva,
    intervalo(h) { return INTERVALOS[Math.max(1, Math.min(5, h.caja)) - 1]; },
    vencida(h, hoy) { return !!h && !!h.vence && h.vence <= hoy; },
    diasVencida(h, hoy) { return h && h.vence ? Math.max(0, AC.fecha.diff(h.vence, hoy)) : 0; },
    /* resultado: 'ok' | 'fallo' | null (sin cambio). Solo el primer resultado del día mueve la caja. */
    actualizar(h, resultado, hoy) {
      h = h || nueva();
      h.visto = hoy;
      if (resultado === 'ok') h.ok++; else if (resultado === 'fallo') h.fallo++;
      if (resultado && h.cambio !== hoy) {
        h.caja = resultado === 'ok' ? Math.min(5, h.caja + 1) : Math.max(1, h.caja - 1);
        h.cambio = hoy;
      }
      h.vence = AC.fecha.suma(hoy, INTERVALOS[h.caja - 1]);
      return h;
    },
    /* 1 si está al día; decae linealmente hasta 0 al pasar otro intervalo completo */
    vigencia(h, hoy) {
      if (!h || !h.vence || h.vence >= hoy) return 1;
      return Math.max(0, 1 - AC.fecha.diff(h.vence, hoy) / INTERVALOS[h.caja - 1]);
    },
  };
  if (typeof module !== 'undefined') module.exports = AC;
})(globalThis.AC = globalThis.AC || {});
