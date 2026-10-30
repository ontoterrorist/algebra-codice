/* Fábricas de contenido para los mundos 2 a 8: generadores de aplicación y demostraciones con valores por defecto.
   Un generador solo declara cómo construir una instancia hacia atrás: {key, enun, res, firmas, pistas, expl}. */
(function (AC) {
  const R = AC.registrar, { dem, H } = AC.w1c, Rat = AC.Rat;
  const T = s => '$' + s + '$';

  const aparece = (res, enun) => new RegExp('(^|\\D)' + String(res).replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&') + '(\\D|$)').test(enun.replace(/\\begin\{[a-z*]+\}[\s\S]*?\\end\{[a-z*]+\}/g, ' ').replace(/\$/g, ' '));
  const unicas = (firmas, esIgual) => { const out = []; (firmas || []).forEach(f => { if (f && !esIgual(f[1]) && !out.some(g => JSON.stringify(g.respuesta) === JSON.stringify(f.resp))) out.push({ id: f[0], respuesta: f.resp, mensaje: f[2] }); }); return out; };

  function fabrica(tipo, d) {
    R.generador({
      id: d.id, mundo: d.mundo || Number(String(d.nivel)[0]), nivel: d.nivel, familia: 'aplicacion', habilidades: d.habilidades, requiere: d.requiere || [],
      dificultad: d.dificultad || 2, autoexplicacion: d.autoexplicacion || null, confianza: d.confianza !== false,
      generar(rng, dif, ctx) {
        for (let i = 0; i < 300; i++) {
          const x = d.hacer(rng, ctx || {}); if (!x) continue;
          if (x.pistas.length !== 3) throw new Error(d.id + ': 3 pistas');
          const base = { variantKey: x.key, enunciado: x.enun, pistas: x.pistas, explicacion: x.expl };
          let o;
          switch (tipo) {
            case 'entero': case 'racional': {
              const res = String(x.res);
              if (tipo === 'entero' && aparece(res, x.enun)) continue;
              const fs = (x.firmas || []).map(f => { const g = [f[0], f[1], f[2]]; g.resp = String(f[1]); return g; });
              o = { entrada: { tipo }, verificador: { id: tipo, args: { esperado: res } }, solucionTexto: [res], firmas: unicas(fs, v => String(v) === res) };
              break;
            }
            case 'expr': {
              const fs = (x.firmas || []).map(f => { const g = [f[0], f[1], f[2]]; g.resp = String(f[1]); return g; });
              const eq = v => { try { return AC.expr.equiv(String(v), x.res); } catch (e) { return true; } };
              o = { entrada: { tipo: 'expr', vars: x.vars || ['x'] }, verificador: x.verificador || { id: 'equivalente-expr', args: { f: x.res } }, solucionExpr: x.res, solucionTexto: [], firmas: unicas(fs, x.verificador ? (v => AC.verificar(Object.assign({}, { verificador: x.verificador }), String(v)).ok) : eq) };
              break;
            }
            case 'complejo': {
              const fs = (x.firmas || []).map(f => { const g = [f[0], f[1], f[2]]; g.resp = String(f[1]); return g; });
              const z = AC.cx.parse(x.res);
              const eq = v => { const w = AC.cx.parse(v); return !w || w.eq(z); };
              o = { entrada: { tipo: 'complejo', vars: ['i'] }, verificador: { id: 'equivalente-complejo', args: { f: x.res } }, solucionExpr: x.res, solucionTexto: [], firmas: unicas(fs, eq) };
              break;
            }
            case 'conjunto': {
              const norm = x.norm || null, nt = a => AC.conj.normTokens(a, norm), res = nt(x.res);
              const fs = (x.firmas || []).map(f => { const g = [f[0], f[1], f[2]]; g.resp = AC.conj.fmt(nt(f[1])); return g; });
              o = { entrada: { tipo: 'conjunto', norm }, verificador: { id: norm === 'racional' ? 'conjunto-racionales' : norm === 'complejo' ? 'conjunto-complejos' : 'igual-conjunto', args: { esperado: res } }, solucionTexto: [AC.conj.fmt(res)], firmas: unicas(fs, v => false).filter(f => f.respuesta !== AC.conj.fmt(res)) };
              break;
            }
            case 'tupla': {
              const res = x.res.map(String), fs = (x.firmas || []).map(f => { const g = [f[0], f[1], f[2]]; g.resp = f[1].map(String); return g; });
              o = { entrada: { tipo: 'tupla', campos: x.campos, etiqueta: x.etiqueta || null }, verificador: x.verificador || { id: 'tupla-racional', args: { esperado: res, mod: x.mod || res.map(() => null) } }, solucionTexto: [], firmas: unicas(fs, v => v.length === res.length && v.every((q, i) => { const a = Rat.parse(String(q)), b = Rat.parse(res[i]), m = x.mod && x.mod[i]; if (!a || !b) return false; const d = a.sub(b); return m ? d.div(Rat.of(m)).isInt() : d.isZero(); })) };
              break;
            }
            case 'matriz': {
              const res = x.res.map(f => f.map(String)), fs = (x.firmas || []).map(f => { const g = [f[0], f[1], f[2]]; g.resp = f[1].map(r => r.map(String)); return g; });
              o = { entrada: { tipo: 'matriz', filas: res.length, cols: res[0].length, etiqueta: x.etiqueta || null }, verificador: x.verificador || { id: 'matriz', args: { esperado: res } }, solucionTexto: [], firmas: unicas(fs, v => JSON.stringify(v) === JSON.stringify(res)) };
              break;
            }
            case 'eleccion': {
              const todas = rng.shuffle([['ok', x.ok]].concat(x.malas.map(m => [m[0], m[1]])));
              const vistos = new Set(); const dist = todas.filter(t => { if (vistos.has(t[1])) return false; vistos.add(t[1]); return true; });
              if (dist.length < 3) continue;
              const pos = dist.findIndex(t => t[0] === 'ok');
              o = { entrada: { tipo: 'eleccion', opciones: dist.map(t => t[1]) }, verificador: { id: 'indice', args: { esperado: pos } }, firmas: dist.map((t, j) => { if (t[0] === 'ok') return null; const m = x.malas.find(q => q[1] === t[1]); return { id: m[0], respuesta: j, mensaje: m[2] }; }).filter(Boolean) };
              break;
            }
            case 'multiple': {
              const ok = x.ok.slice().sort((a, b) => a - b);
              if (!ok.length || ok.length >= x.opciones.length) continue;
              o = { entrada: { tipo: 'multiple', opciones: x.opciones }, verificador: { id: 'conjunto-indices', args: { esperado: ok, n: x.opciones.length } },
                firmas: x.opciones.map((_, j) => ({ id: ok.includes(j) ? 'omite-' + j : 'marca-de-mas', respuesta: ok.includes(j) ? ok.filter(v => v !== j) : ok.concat(j), mensaje: x.msg ? x.msg(j, ok.includes(j)) : 'Revisa la opción ' + (j + 1) + '.' })) };
              break;
            }
            default: throw new Error('tipo de generador desconocido ' + tipo);
          }
          return Object.assign(base, o);
        }
        throw new Error(d.id + ': sin instancia');
      },
    });
  }
  const gen = {};
  ['entero', 'racional', 'expr', 'complejo', 'conjunto', 'tupla', 'matriz', 'eleccion', 'multiple'].forEach(t => { gen[t] = d => fabrica(t, d); });

  /* ---------- demostraciones con valores por defecto ---------- */
  const INVALIDAS = [
    ['ejemplo', 'Verificar un ejemplo concreto', false, 'Un ejemplo ilustra, pero no prueba un enunciado general.'],
    ['circular', 'Suponer lo que se quiere probar', false, 'Eso es un argumento circular.'],
    ['intuicion', 'Apoyarse en un dibujo o en la intuición', false, 'Ayuda a entender, pero no es una demostración.'],
  ];
  function dem2(d) {
    const mundo = d.mundo || Number(String(d.nivel)[0]);
    dem({
      id: d.id, teorema: d.teorema, enunciadoId: d.enunciadoId, mundo, nivel: d.nivel, habilidades: d.habilidades, requiere: d.requiere || [], refsExtra: d.refsExtra || [],
      param: d.param, enunciado: d.enunciado, hip: d.hip, meta: d.meta, L: d.L, dist: d.dist, err: d.err,
      est: (d.valida || []).map(([id, texto, nota]) => [id, texto, true, nota]).concat((d.invalidas || INVALIDAS).slice(0, Math.max(2, 4 - (d.valida || []).length))),
      crit: d.crit || ['Enuncié con claridad lo que hay que probar', 'Usé las definiciones y las hipótesis', 'Justifiqué cada paso con un resultado conocido', 'Concluí exactamente lo pedido'],
      pistas: p => ['Orientación: identifica qué hay que probar y con qué definiciones cuentas.', 'Idea clave: ' + d.idea(p), 'Primer paso: ' + d.primero(p)],
    });
  }

  AC.cont = { gen, dem2, H, T, R, Rat, aparece };
  if (typeof module !== 'undefined') module.exports = AC;
})(globalThis.AC = globalThis.AC || {});
