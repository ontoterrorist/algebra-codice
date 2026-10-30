/* Guardado: localStorage siempre en try/catch, esquema versionado, migraciones, exportar/importar/reiniciar. */
(function (AC) {
  const VERSION = 1, CLAVE = 'ac.v1', APP = 'codice-algebra';

  /* Almacén con respaldo en memoria: si localStorage falla, el juego sigue y avisa. */
  const almacen = AC.almacen = {
    mem: {}, persistente: false,
    probar() {
      try {
        const ls = globalThis.localStorage;
        if (!ls) return (almacen.persistente = false);
        ls.setItem('ac.prueba', '1'); ls.removeItem('ac.prueba');
        return (almacen.persistente = true);
      } catch (e) { return (almacen.persistente = false); }
    },
    leer(k) { try { if (almacen.persistente) return globalThis.localStorage.getItem(k); } catch (e) { almacen.persistente = false; } return almacen.mem[k] === undefined ? null : almacen.mem[k]; },
    escribir(k, v) { almacen.mem[k] = v; try { if (almacen.persistente) globalThis.localStorage.setItem(k, v); } catch (e) { almacen.persistente = false; } return almacen.persistente; },
    borrar(k) { delete almacen.mem[k]; try { if (almacen.persistente) globalThis.localStorage.removeItem(k); } catch (e) { almacen.persistente = false; } },
  };

  function nuevo(dia) {
    return {
      v: VERSION, creado: dia,
      ajustes: { tema: 'oscuro', silencio: false, reducirAnim: false, ultimoExport: null, convencionesVistas: false },
      jugador: { xp: 0, nivel: 1, racha: { cuenta: 0, ultimoDia: null, gracia: 0, graciaUsada: [] } },
      habilidades: {}, teoremas: {}, niveles: {}, mundos: {},
      intentos: [],
      estadisticas: { porHabilidad: {}, estudioMs: {}, calibracion: [[0, 0], [0, 0], [0, 0]], erroresEncontrados: 0, firmas: {}, autoexp: [0, 0] },
      logros: {}, diario: {}, sesion: { dia: null, n: 0 },
      semillaBase: AC.hash(String(Date.now()) + (globalThis.navigator ? navigator.userAgent : 'node')), contador: 0,
    };
  }

  /* migraciones[v] lleva de la versión v a la v+1. Con una sola versión basta rellenar lo que falte. */
  const migraciones = {};
  function rellenar(est, dia) {
    const base = nuevo(dia);
    (function mezcla(d, s) {
      Object.keys(s).forEach(k => {
        if (d[k] === undefined) d[k] = JSON.parse(JSON.stringify(s[k]));
        else if (s[k] && typeof s[k] === 'object' && !Array.isArray(s[k]) && typeof d[k] === 'object') mezcla(d[k], s[k]);
      });
    })(est, base);
    return est;
  }
  function migrar(est, dia) {
    if (!est || typeof est !== 'object') throw new Error('Los datos guardados no tienen el formato esperado.');
    if (typeof est.v !== 'number') throw new Error('Falta la versión del guardado.');
    if (est.v > VERSION) throw new Error('El guardado es de una versión más nueva (' + est.v + ') que este juego (' + VERSION + ').');
    while (est.v < VERSION) { est = migraciones[est.v](est); }
    return rellenar(est, dia);
  }

  AC.guardado = {
    VERSION, CLAVE, nuevo, migrar,
    cargar(dia) {
      almacen.probar();
      const t = almacen.leer(CLAVE);
      if (!t) return { estado: nuevo(dia), vacio: true };
      try { return { estado: migrar(JSON.parse(t), dia) }; } catch (e) {
        almacen.escribir(CLAVE + '.respaldo', t);
        return { estado: nuevo(dia), vacio: true, error: 'No pude leer el progreso guardado (' + e.message + '). Lo dejé en una copia de respaldo y empecé de cero.' };
      }
    },
    guardar(est) { return almacen.escribir(CLAVE, JSON.stringify(est)); },
    exportar(est, ahora) {
      const cuerpo = JSON.stringify(est);
      return JSON.stringify({ app: APP, v: VERSION, exportado: ahora, suma: AC.hash(cuerpo), estado: est }, null, 1);
    },
    importar(texto, dia) {
      let o;
      try { o = JSON.parse(texto); } catch (e) { throw new Error('El archivo no es JSON válido.'); }
      if (!o || o.app !== APP) throw new Error('Este archivo no es un guardado de El Códice de Álgebra.');
      if (o.suma !== AC.hash(JSON.stringify(o.estado))) throw new Error('El archivo parece estar truncado o modificado (la suma de control no coincide).');
      return migrar(o.estado, dia);
    },
    reiniciar() { almacen.borrar(CLAVE); },
  };
  if (typeof module !== 'undefined') module.exports = AC;
})(globalThis.AC = globalThis.AC || {});
