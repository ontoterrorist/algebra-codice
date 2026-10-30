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
      case 'conjunto': { const r = AC.conj.parse(resp), t = AC.conj.parse(sig.respuesta); if (r === null || t === null) return false; const nr = AC.conj.normTokens(r, inst.entrada.norm), nt = AC.conj.normTokens(t, inst.entrada.norm); return nr !== null && nt !== null && AC.conj.eq(nr, nt); }
      case 'complejo': { const z = AC.cx.parse(String(resp)), w = AC.cx.parse(sig.respuesta); return !!z && !!w && z.eq(w); }
      case 'tupla': { const v = (resp || []).map(x => Rat.parse(String(x == null ? '' : x))); return v.length === sig.respuesta.length && v.every((x, i) => { const w = Rat.parse(String(sig.respuesta[i])); return x && w && x.eq(w); }); }
      case 'matriz': { if (!Array.isArray(resp) || resp.length !== sig.respuesta.length) return false; return sig.respuesta.every((f, i) => f.every((x, j) => { const a = Rat.parse(String((resp[i] || [])[j] || '')), b = Rat.parse(String(x)); return a && b && a.eq(b); })); }
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
