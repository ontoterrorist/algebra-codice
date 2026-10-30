/* Logros de hábitos. */
(function (AC) {
  const DEFS = [
    { id: 'cazador', nombre: 'Cazador de errores', desc: 'Encuentra 10 errores en demostraciones.' },
    { id: 'olvidado', nombre: 'Volviste a un tema olvidado', desc: 'Acierta en un repaso de una habilidad vencida hace 14 días o más.' },
    { id: 'sin-pistas-jefe', nombre: 'Sin pistas en un jefe', desc: 'Derrota a un jefe sin usar pistas.' },
    { id: 'calibrado', nombre: 'Buena calibración', desc: 'Con 50 respuestas o más, tu confianza y tu acierto casi coinciden.' },
    { id: 'racha7', nombre: 'Siete días seguidos', desc: 'Mantén una racha de 7 días.' },
    { id: 'primer-teorema', nombre: 'Primer teorema', desc: 'Entra tu primer teorema al Códice.' },
    { id: 'primer-nivel', nombre: 'Nivel dominado', desc: 'Domina tu primer nivel.' },
  ];
  /* calibración: error medio absoluto entre confianza declarada y acierto observado */
  const ESPERADA = [0.4, 0.7, 0.9];
  function calibracion(est) {
    const c = est.estadisticas.calibracion; const total = c.reduce((s, x) => s + x[0], 0);
    if (!total) return { total: 0, error: null, filas: [] };
    const filas = c.map((x, i) => ({ conf: i, n: x[0], acierto: x[0] ? x[1] / x[0] : null, esperada: ESPERADA[i] }));
    const error = filas.reduce((s, f) => s + (f.n ? Math.abs(f.acierto - f.esperada) * f.n : 0), 0) / total;
    return { total, error, filas };
  }
  AC.logros = {
    DEFS, calibracion, ESPERADA,
    evaluar(est, ev, hoy) {
      const nuevos = [];
      const da = id => { if (!est.logros[id]) { est.logros[id] = hoy; nuevos.push(id); } };
      if (est.estadisticas.erroresEncontrados >= 10) da('cazador');
      if (ev.vencidaDias >= 14 && ev.ok && ev.contexto === 'repaso') da('olvidado');
      if (ev.jefeSinPistas) da('sin-pistas-jefe');
      const cal = calibracion(est);
      if (cal.total >= 50 && cal.error <= 0.15) da('calibrado');
      if (est.jugador.racha.cuenta >= 7) da('racha7');
      if (ev.teoremaGanado) da('primer-teorema');
      if (ev.dominioNuevo) da('primer-nivel');
      return nuevos;
    },
  };
  if (typeof module !== 'undefined') module.exports = AC;
})(globalThis.AC = globalThis.AC || {});
