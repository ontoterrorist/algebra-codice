/* Firmas de error: errores típicos calculados para cada instancia (inst.firmas). */
(function (AC) {
  const L = AC.logic, Rat = AC.Rat;

  function coincide(inst, resp, sig) {
    switch (inst.entrada.tipo) {
      case 'tabla':
        return Array.isArray(resp) && resp.length === sig.respuesta.length && resp.every((x, i) => x === sig.respuesta[i]);
      case 'entero': case 'racional': {
        const r = Rat.parse(String(resp == null ? '' : resp)), s = Rat.parse(String(sig.respuesta));
        return !!r && !!s && r.eq(s);
      }
      case 'logica': {
        try { return L.equiv(L.parse(String(resp)), L.parse(sig.respuesta)); } catch (e) { return false; }
      }
      case 'conjunto': { const r = AC.conj.parse(resp), t = AC.conj.parse(sig.respuesta); return r !== null && t !== null && AC.conj.eq(r, t); }
      case 'expr': { try { return AC.expr.equiv(String(resp), sig.respuesta); } catch (e) { return false; } }
      case 'eleccion': return resp === sig.respuesta;
      case 'multiple': {
        const a = (resp || []).slice().sort(), b = sig.respuesta.slice().sort();
        return a.length === b.length && a.every((x, i) => x === b[i]);
      }
    }
    return false;
  }

  AC.errores = {
    detectar(inst, resp) {
      for (const s of inst.firmas || []) if (coincide(inst, resp, s)) return { id: s.id, mensaje: s.mensaje };
      return null;
    },
    /* revisión de contenido: toda firma debe ser distinta de la respuesta correcta y única */
    auditar(inst) {
      const problemas = []; const vistos = new Set();
      (inst.firmas || []).forEach(s => {
        const k = JSON.stringify(s.respuesta);
        if (vistos.has(k)) problemas.push('dos firmas con la misma respuesta (' + s.id + ')');
        vistos.add(k);
        if (!s.mensaje) problemas.push('firma sin mensaje ' + s.id);
      });
      return problemas;
    },
  };
  if (typeof module !== 'undefined') module.exports = AC;
})(globalThis.AC = globalThis.AC || {});
