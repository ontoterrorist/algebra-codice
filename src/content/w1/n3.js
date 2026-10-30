/* Mundo 1, nivel 1.3 — Relaciones de equivalencia y de orden. */
(function (AC) {
  const { R, r, H, T, dem, EST_EJEMPLO } = AC.w1c;
  const C = AC.conj, rel = C.rel;
  const gcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) { [a, b] = [b, a % b]; } return a; };
  const sumDig = n => String(Math.abs(n)).split('').reduce((s, d) => s + +d, 0);
  const nDiv = n => { let c = 0; for (let d = 1; d <= n; d++) if (n % d === 0) c++; return c; };

  /* ---------- catálogo ---------- */
  const HB = (id, nombre) => R.habilidad({ id: '1.3.' + id, nombre, nivel: '1.3' });
  HB('propiedades', 'Propiedades de una relación'); HB('clases', 'Clases de equivalencia'); HB('particion', 'Particiones y conteo de clases'); HB('orden', 'Relaciones de orden'); HB('maximales', 'Máximos y elementos maximales'); HB('demostrar', 'Demostrar con relaciones');
  const TE = (id, titulo, enunciado, requiere, habilidades) => R.teorema({ id, titulo, nivel: '1.3', enunciado, requiere, habilidades });
  TE('t.clase-igual', 'Elementos relacionados, clases iguales', r`Si $\sim$ es de equivalencia y $a\sim b$, entonces $[a]=[b]$.`, [], ['1.3.clases', '1.3.demostrar']);
  TE('t.clases-disjuntas', 'Las clases distintas son disjuntas', r`Si $[a]\cap[b]\neq\varnothing$ entonces $[a]=[b]$; es decir, dos clases distintas son disjuntas.`, ['t.clase-igual', 't.contrapositiva'], ['1.3.clases', '1.3.demostrar']);
  TE('t.equiv-particion', 'Una equivalencia define una partición', r`Las clases de una relación de equivalencia en $X$ son no vacías, cubren $X$ y son disjuntas dos a dos: forman una partición de $X$.`, ['t.clases-disjuntas'], ['1.3.particion', '1.3.demostrar']);
  TE('t.mod-equivalencia', 'La congruencia es de equivalencia', r`Para $n\ge 1$, la relación $a\sim b\iff n\mid a-b$ es de equivalencia en $\mathbb{Z}$.`, [], ['1.3.propiedades', '1.3.demostrar']);
  TE('t.unicidad-maximo', 'Unicidad del máximo', r`En un conjunto parcialmente ordenado, si existe un máximo, es único.`, [], ['1.3.orden', '1.3.maximales', '1.3.demostrar']);

  /* ---------- 1. propiedades de una relación (selección múltiple) ---------- */
  const PROPS = [['reflexiva', 'reflexiva'], ['simetrica', 'simétrica'], ['antisimetrica', 'antisimétrica'], ['transitiva', 'transitiva']];
  function propiedades(R_, U) { return [rel.reflexiva(R_, U), rel.simetrica(R_), rel.antisimetrica(R_), rel.transitiva(R_)]; }
  const parTxt = ([x, y]) => '(' + x + ',' + y + ')';
  R.generador({
    id: 'w1.n3.propiedades-relacion', mundo: 1, nivel: '1.3', familia: 'aplicacion', habilidades: ['1.3.propiedades'], dificultad: 2, autoexplicacion: 'propiedades-metodo',
    generar(rng) {
      for (let i = 0; i < 200; i++) {
        const n = rng.pick([4, 4, 5]), U = Array.from({ length: n }, (_, k) => String(k + 1));
        const tipo = rng.pick(['equiv', 'orden', 'libre', 'libre']);
        let Rr = [];
        if (tipo === 'equiv') {
          const bloques = rng.int(2, 3), asig = {}; U.forEach(u => { asig[u] = rng.int(0, bloques - 1); });
          U.forEach(x => U.forEach(y => { if (asig[x] === asig[y]) Rr.push([x, y]); }));
        } else if (tipo === 'orden') {
          const base = []; for (let k = 0; k < rng.int(2, 4); k++) { const a = rng.int(0, n - 2), b = rng.int(a + 1, n - 1); base.push([U[a], U[b]]); }
          U.forEach(u => Rr.push([u, u])); base.forEach(p => Rr.push(p));
          for (let it = 0; it < 4; it++) Rr.forEach(([x, y]) => Rr.forEach(([y2, z]) => { if (y === y2 && !C.tiene(Rr, x, z)) Rr.push([x, z]); }));
        } else { const k = rng.int(4, 8); for (let j = 0; j < k; j++) Rr.push([rng.pick(U), rng.pick(U)]); }
        // a veces se rompe una propiedad quitando o añadiendo un par
        if (tipo !== 'libre' && rng.chance(0.65)) {
          if (rng.chance(0.5)) { const q = rng.pick(Rr); Rr = Rr.filter(p => p !== q); } else { Rr.push([rng.pick(U), rng.pick(U)]); }
        }
        const uniq = [...new Map(Rr.map(p => [p.join(), p])).values()].sort((p, q) => C.cmp(p[0], q[0]) || C.cmp(p[1], q[1]));
        if (uniq.length < 3 || uniq.length > 14) continue;
        const props = propiedades(uniq, U), ok = props.map((v, j) => (v ? j : -1)).filter(j => j >= 0);
        if (ok.length === 0 || ok.length === 4) continue;
        const firmas = PROPS.map(([id, nom], j) => {
          const marcada = props[j];
          let msg;
          if (marcada) msg = 'Sí es ' + nom + ': ' + ({ reflexiva: 'todos los pares $(a,a)$ están en la relación', simetrica: 'cada par tiene su par invertido', antisimetrica: 'no hay dos elementos distintos relacionados en ambos sentidos', transitiva: 'todo $(a,b),(b,c)$ tiene su $(a,c)$' })[id] + '.';
          else { const t = rel.testigo[id === 'simetrica' ? 'simetrica' : id](uniq, U); msg = 'No es ' + nom + ': ' + ({ reflexiva: t && 'falta $' + parTxt(t) + '$', simetrica: t && 'está el par dado pero falta $' + parTxt(t) + '$', antisimetrica: t && 'están $' + parTxt(t) + '$ y $' + parTxt([t[1], t[0]]) + '$ con elementos distintos', transitiva: t && 'faltaría $' + parTxt(t) + '$ por transitividad' })[id] + '.'; }
          return { id: (marcada ? 'omite-' : 'marca-de-mas-') + id, respuesta: ok.includes(j) ? ok.filter(x => x !== j) : ok.concat(j), mensaje: msg };
        });
        return {
          variantKey: rel.str(uniq) + '|' + n,
          enunciado: 'Sea $R$ la relación en $A=' + C.tex(U) + '$ dada por $R=' + rel.tex(uniq) + '$. Marca todas las propiedades que cumple $R$.',
          entrada: { tipo: 'multiple', opciones: PROPS.map(p => p[1].charAt(0).toUpperCase() + p[1].slice(1)) },
          verificador: { id: 'conjunto-indices', args: { esperado: ok, n: 4 } },
          firmas,
          pistas: ['Orientación: revisa las cuatro propiedades una por una; basta un par que falle para descartarla.', 'Idea clave: reflexiva = todos los $(a,a)$; simétrica = cada $(a,b)$ trae su $(b,a)$; antisimétrica = no hay $(a,b),(b,a)$ con $a\\neq b$; transitiva = $(a,b),(b,c)$ obliga a $(a,c)$.', 'Primer paso: mira la diagonal: ¿están todos los pares $(a,a)$?'],
          explicacion: 'Cumple: ' + (ok.length ? ok.map(j => PROPS[j][1]).join(', ') : 'ninguna de las cuatro') + '.',
        };
      }
      throw new Error('propiedades-relacion: sin instancia');
    },
  });
  R.banco('propiedades-metodo', { pregunta: '¿Cómo se refuta una propiedad de una relación?', opciones: [
    { texto: 'Con un solo par (o pareja de pares) que incumpla la condición.', correcta: true },
    { texto: 'Hay que comprobar que fallan todos los pares.', correcta: false },
    { texto: 'Con que la mitad de los pares la cumplan, ya vale.', correcta: false },
    { texto: 'No se puede refutar: solo se puede probar.', correcta: false },
  ] });

  /* ---------- 2. clase de equivalencia (escribir un conjunto) ---------- */
  const KINDS = [
    { id: 'mod', mk: rng => { const n = rng.pick([2, 3, 4, 5, 6]); return { n, P: Array.from({ length: 40 }, (_, k) => k + 1), U: Array.from({ length: 14 }, (_, k) => k + 1), f: x => ((x % n) + n) % n, desc: '$a\\sim b$ si $a-b$ es múltiplo de $' + n + '$', cid: 'mod' + n }; } },
    { id: 'abs', mk: rng => ({ P: Array.from({ length: 25 }, (_, k) => k - 12), U: Array.from({ length: 11 }, (_, k) => k - 5), f: x => Math.abs(x), desc: '$a\\sim b$ si $|a|=|b|$', cid: 'abs' }) },
    { id: 'dig', mk: rng => ({ P: Array.from({ length: 60 }, (_, k) => k + 1), U: Array.from({ length: 24 }, (_, k) => k + 1), f: sumDig, desc: '$a\\sim b$ si $a$ y $b$ tienen la misma suma de dígitos', cid: 'dig' }) },
    { id: 'gcd', mk: rng => { const N = rng.pick([12, 18, 20, 24]); return { N, P: Array.from({ length: 2 * N }, (_, k) => k + 1), U: Array.from({ length: N }, (_, k) => k + 1), f: x => gcd(x, N), desc: '$a\\sim b$ si $\\operatorname{mcd}(a,' + N + ')=\\operatorname{mcd}(b,' + N + ')$', cid: 'gcd' + N }; } },
    { id: 'div', mk: rng => ({ P: Array.from({ length: 30 }, (_, k) => k + 1), U: Array.from({ length: 16 }, (_, k) => k + 1), f: nDiv, desc: '$a\\sim b$ si $a$ y $b$ tienen el mismo número de divisores positivos', cid: 'div' }) },
  ];
  R.generador({
    id: 'w1.n3.clases-de-equivalencia', mundo: 1, nivel: '1.3', familia: 'aplicacion', habilidades: ['1.3.clases'], dificultad: 2, autoexplicacion: null,
    generar(rng) {
      for (let i = 0; i < 100; i++) {
        const K = rng.pick(KINDS).mk(rng), rawU = K.U, a = rng.pick(rawU);
        const U = rawU.map(String), clase = U.filter(x => K.f(+x) === K.f(a));
        if (clase.length < 2 || clase.length === U.length) continue;
        const otra = rawU.map(String).filter(x => K.f(+x) !== K.f(a));
        const otraClase = (() => { const b = +rng.pick(otra); return U.filter(x => K.f(+x) === K.f(b)); })();
        const sinA = clase.filter(x => x !== String(a)), mas = C.norm(clase);
        const firmas = [];
        if (sinA.length && sinA.length !== clase.length) firmas.push({ id: 'olvida-el-propio', respuesta: C.fmt(sinA), mensaje: 'Falta el propio $' + a + '$: por reflexividad $a\\in[a]$.' });
        if (!C.eq(otraClase, clase)) firmas.push({ id: 'otra-clase', respuesta: C.fmt(otraClase), mensaje: 'Esa es la clase de otro elemento, no la de $' + a + '$.' });
        return {
          variantKey: K.cid + '|' + a,
          enunciado: 'En $A=' + C.tex(U) + '$ se define la relación de equivalencia ' + K.desc + '. Halla la clase $[' + a + ']$ (escribe sus elementos entre llaves).',
          entrada: { tipo: 'conjunto' }, verificador: { id: 'igual-conjunto', args: { esperado: mas } }, solucionTexto: [C.fmt(mas)], firmas,
          pistas: ['Orientación: la clase de $a$ reúne a todos los elementos relacionados con $a$ (incluido $a$).', 'Idea clave: decide qué cantidad comparten los elementos de la misma clase (resto, valor absoluto, suma de dígitos…).', 'Primer paso: calcula esa cantidad para $' + a + '$ y busca los demás elementos con el mismo valor.'],
          explicacion: '$[' + a + ']=' + C.tex(mas) + '$.',
        };
      }
      throw new Error('clases-de-equivalencia: sin instancia');
    },
  });

  /* ---------- 3. número de clases (entero) ---------- */
  R.generador({
    id: 'w1.n3.numero-de-clases', mundo: 1, nivel: '1.3', familia: 'aplicacion', habilidades: ['1.3.particion'], dificultad: 2, autoexplicacion: null,
    generar(rng) {
      for (let i = 0; i < 100; i++) {
        const K = rng.pick(KINDS).mk(rng), U = C.norm(rng.sample(K.P, rng.int(8, 10)).map(String)).map(Number);
        const clases = new Map(); U.forEach(x => { const k = K.f(x); clases.set(k, (clases.get(k) || 0) + 1); });
        const n = clases.size, tam = Math.max(...clases.values()), m = U.length;
        const sigs = [[n - 1, 'menos-una', 'Contaste una clase de menos: revisa si el resto $0$ (o el valor más pequeño) también forma una clase.'], [tam, 'tam-clase', 'Eso es el tamaño de la clase más grande, no el número de clases.'], [m, 'todos', 'Eso es el número de elementos: varios elementos comparten clase.']].filter(s => s[0] !== n && s[0] > 0);
        if (!sigs.length || n < 2 || U.length.toString() === String(n)) continue;
        const enun = 'En $A=' + C.tex(U.map(String)) + '$ se define la relación de equivalencia ' + K.desc + '. ¿Cuántas clases de equivalencia distintas hay?';
        if (new RegExp('(^|\\D)' + n + '(\\D|$)').test(enun.replace(/\$/g, ' '))) continue;
        return { variantKey: K.cid + '|' + U.join(','), enunciado: enun, entrada: { tipo: 'entero' }, verificador: { id: 'entero', args: { esperado: String(n) } }, solucionTexto: [String(n)],
          firmas: sigs.map(s => ({ id: s[1], respuesta: String(s[0]), mensaje: s[2] })),
          pistas: ['Orientación: cuenta cuántos valores distintos toma la cantidad que define la relación.', 'Idea clave: cada clase corresponde a un valor distinto de esa cantidad (un resto, un valor absoluto…).', 'Primer paso: calcula la cantidad para los primeros elementos y anota los valores distintos.'],
          explicacion: 'Hay ' + n + ' clases.' };
      }
      throw new Error('numero-de-clases: sin instancia');
    },
  });

  /* ---------- 4. cierre de equivalencia (entero) ---------- */
  R.generador({
    id: 'w1.n3.cierre-equivalencia', mundo: 1, nivel: '1.3', familia: 'aplicacion', habilidades: ['1.3.propiedades', '1.3.particion'], dificultad: 3, autoexplicacion: null,
    generar(rng) {
      for (let i = 0; i < 200; i++) {
        const n = rng.pick([4, 5]), U = Array.from({ length: n }, (_, k) => String(k + 1)), k = rng.int(2, 4), Rr = [];
        for (let j = 0; j < k; j++) { const x = rng.pick(U), y = rng.pick(U); if (x !== y && !C.tiene(Rr, x, y)) Rr.push([x, y]); }
        if (Rr.length < 2) continue;
        const cierre = rel.cierreEquivalencia(Rr, U), res = cierre.length - Rr.length;
        const refl = n - Rr.filter(p => p[0] === p[1]).length, sim = Rr.filter(([x, y]) => x !== y && !C.tiene(Rr, y, x)).length;
        const sigs = [[refl + sim, 'sin-transitiva', 'Olvidaste los pares que exige la transitividad: tras añadir diagonal y simétricos, quedan pares por completar.'], [refl, 'solo-reflexiva', 'Además de la diagonal faltan los pares simétricos y los de la transitividad.'], [cierre.length, 'tamano-total', 'Eso es el tamaño de la relación final; piden cuántos pares hay que **añadir**.']].filter(s => s[0] !== res && s[0] > 0);
        if (!sigs.length || res < 3) continue;
        const enun = 'Sea $R=' + rel.tex(Rr) + '$ en $A=' + C.tex(U) + '$. ¿Cuántos pares hay que añadir como mínimo para que $R$ sea una relación de equivalencia?';
        if (new RegExp('(^|\\D)' + res + '(\\D|$)').test(enun.replace(/\$/g, ' '))) continue;
        return { variantKey: rel.str(Rr) + n, enunciado: enun, entrada: { tipo: 'entero' }, verificador: { id: 'entero', args: { esperado: String(res) } }, solucionTexto: [String(res)],
          firmas: sigs.map(s => ({ id: s[1], respuesta: String(s[0]), mensaje: s[2] })),
          pistas: ['Orientación: una equivalencia debe ser reflexiva, simétrica y transitiva a la vez.', 'Idea clave: agrupa los elementos conectados; la relación mínima relaciona entre sí a todos los de un mismo grupo (todos los pares dentro del grupo).', 'Primer paso: encuentra los grupos de elementos conectados por los pares dados.'],
          explicacion: 'La relación mínima tiene ' + cierre.length + ' pares (todos los pares dentro de cada grupo conectado); como ya hay ' + Rr.length + ', se añaden ' + res + '.' };
      }
      throw new Error('cierre-equivalencia: sin instancia');
    },
  });

  /* ---------- 5. maximales y minimales en el orden de divisibilidad ---------- */
  R.generador({
    id: 'w1.n3.maximales-minimales', mundo: 1, nivel: '1.3', familia: 'aplicacion', habilidades: ['1.3.orden', '1.3.maximales'], dificultad: 2, autoexplicacion: null,
    generar(rng) {
      for (let i = 0; i < 200; i++) {
        const pool = Array.from({ length: 24 }, (_, k) => k + 2), S = C.norm(rng.sample(pool, rng.int(6, 8)).map(String)).map(Number);
        const pide = rng.pick(['maximales', 'minimales']);
        const div = (a, b) => b % a === 0;
        const maxim = S.filter(x => !S.some(y => y !== x && div(x, y))), minim = S.filter(x => !S.some(y => y !== x && div(y, x)));
        const res = (pide === 'maximales' ? maxim : minim).map(String), otro = (pide === 'maximales' ? minim : maxim).map(String);
        if (res.length < 1 || res.length === S.length || C.eq(res, otro)) continue;
        const firmas = [{ id: 'confunde-extremo', respuesta: C.fmt(otro), mensaje: 'Esos son los ' + (pide === 'maximales' ? 'minimales' : 'maximales') + ', no los ' + pide + '.' }];
        const biggest = String(Math.max(...S)), smallest = String(Math.min(...S));
        if (pide === 'maximales' && res.length > 1) firmas.push({ id: 'solo-el-mayor', respuesta: C.fmt([biggest]), mensaje: 'El mayor número no es el único maximal: aquí el orden es la divisibilidad, no el tamaño.' });
        if (pide === 'minimales' && res.length > 1) firmas.push({ id: 'solo-el-menor', respuesta: C.fmt([smallest]), mensaje: 'El menor número no es el único minimal: el orden es la divisibilidad, no el tamaño.' });
        const unicas = []; const vistos = new Set([C.fmt(res)]); firmas.forEach(f => { if (!vistos.has(f.respuesta)) { vistos.add(f.respuesta); unicas.push(f); } });
        return {
          variantKey: pide + '|' + S.join(','),
          enunciado: 'En $S=' + C.tex(S.map(String)) + '$ se considera el orden «$a\\preceq b$ si $a$ divide a $b$». Escribe el conjunto de elementos ' + pide + ' de $S$.',
          entrada: { tipo: 'conjunto' }, verificador: { id: 'igual-conjunto', args: { esperado: C.norm(res) } }, solucionTexto: [C.fmt(res)], firmas: unicas,
          pistas: ['Orientación: un elemento es maximal si ningún otro elemento de $S$ está «por encima» de él.', 'Idea clave: aquí «por encima» significa «es múltiplo propio»; un minimal no tiene divisores propios en $S$.', 'Primer paso: para cada elemento, busca si otro de $S$ es múltiplo (o divisor) suyo.'],
          explicacion: 'Los ' + pide + ' son ' + C.fmt(res) + '.',
        };
      }
      throw new Error('maximales-minimales: sin instancia');
    },
  });

  /* ---------- 6. ¿qué tipo de relación es? (elección) ---------- */
  const TIPOS = ['Relación de equivalencia', 'Relación de orden parcial', 'Ambas', 'Ninguna de las dos'];
  const RELS = [
    { id: 'mod', mk: n => ({ tex: `a\\sim b\\iff ${n}\\mid a-b`, dom: 'Z', f: (a, b) => (a - b) % n === 0 }), nv: [2, 3, 4, 5, 6, 7], tipo: 0 },
    { id: 'le', tex: 'a\\le b', dom: 'Z', f: (a, b) => a <= b, tipo: 1 }, { id: 'ge', tex: 'a\\ge b', dom: 'Z', f: (a, b) => a >= b, tipo: 1 },
    { id: 'lt', tex: 'a<b', dom: 'Z', f: (a, b) => a < b, tipo: 3 }, { id: 'neq', tex: 'a\\neq b', dom: 'Z', f: (a, b) => a !== b, tipo: 3 },
    { id: 'div', tex: 'a\\mid b', dom: 'N', f: (a, b) => b % a === 0, tipo: 1 }, { id: 'abs', tex: '|a|=|b|', dom: 'Z', f: (a, b) => Math.abs(a) === Math.abs(b), tipo: 0 },
    { id: 'sumpar', tex: 'a+b\\text{ es par}', dom: 'Z', f: (a, b) => (a + b) % 2 === 0, tipo: 0 }, { id: 'difimp', tex: 'a-b\\text{ es impar}', dom: 'Z', f: (a, b) => Math.abs(a - b) % 2 === 1, tipo: 3 },
    { id: 'eq', tex: 'a=b', dom: 'Z', f: (a, b) => a === b, tipo: 2 }, { id: 'ndiv', tex: 'a\\text{ y }b\\text{ tienen igual número de divisores}', dom: 'N', f: (a, b) => nDiv(a) === nDiv(b), tipo: 0 },
    { id: 'sq4', tex: 'a^2\\equiv b^2\\pmod 4', dom: 'Z', f: (a, b) => (((a * a - b * b) % 4) + 4) % 4 === 0, tipo: 0 },
  ];
  R.generador({
    id: 'w1.n3.tipo-de-relacion', mundo: 1, nivel: '1.3', familia: 'aplicacion', habilidades: ['1.3.propiedades', '1.3.orden'], dificultad: 2, autoexplicacion: null,
    generar(rng) {
      const base = rng.pick(RELS), rr = base.mk ? Object.assign({ id: base.id + rng.pick(base.nv), tipo: base.tipo }, base.mk(base.nv[0] && rng.pick(base.nv))) : base;
      const dominio = rr.dom === 'Z' ? Array.from({ length: 13 }, (_, k) => String(k - 6)) : Array.from({ length: 12 }, (_, k) => String(k + 1));
      const Rr = []; dominio.forEach(x => dominio.forEach(y => { if (rr.f(+x, +y)) Rr.push([x, y]); }));
      const p = propiedades(Rr, dominio);
      const esEq = p[0] && p[1] && p[3], esOrd = p[0] && p[2] && p[3], tipo = esEq && esOrd ? 2 : esEq ? 0 : esOrd ? 1 : 3;
      if (rr.tipo !== tipo) throw new Error('tipo-de-relacion: ' + rr.id + ' clasificada distinto de lo declarado');
      const perm = rng.shuffle([0, 1, 2, 3]), opciones = perm.map(i => TIPOS[i]);
      const faltante = (j) => { const nm = ['reflexiva', 'simétrica', 'antisimétrica', 'transitiva'][j], id = ['reflexiva', 'simetrica', 'antisimetrica', 'transitiva'][j]; const t = rel.testigo[id](Rr, dominio); return t ? { nm, t } : null; };
      const firmas = perm.map((ti, pos) => {
        if (ti === tipo) return null;
        let msg;
        if (ti === 0) { const f = [0, 1, 3].map(faltante).find(Boolean); msg = f ? 'No es de equivalencia: no es ' + f.nm + ' (por ejemplo, ' + (f.nm === 'transitiva' ? 'faltaría el par ' : 'falla con el par ') + '$' + parTxt(f.t) + '$).' : 'Sí es de equivalencia; revisa si también es de orden.'; }
        else if (ti === 1) { const f = [0, 2, 3].map(faltante).find(Boolean); msg = f ? 'No es de orden: no es ' + f.nm + ' (por ejemplo, ' + (f.nm === 'antisimétrica' ? 'están $' + parTxt(f.t) + '$ y su inverso' : 'falla con el par $' + parTxt(f.t) + '$') + ').' : 'Sí es de orden; revisa si también es de equivalencia.'; }
        else if (ti === 2) msg = 'Para ser ambas tendría que ser simétrica y antisimétrica a la vez, es decir, la igualdad.';
        else msg = 'Sí cumple las propiedades de ' + (esEq && !esOrd ? 'equivalencia' : 'orden') + ': reflexiva, ' + (esEq ? 'simétrica' : 'antisimétrica') + ' y transitiva.';
        return { id: 'elige-' + ['equivalencia', 'orden', 'ambas', 'ninguna'][ti], respuesta: pos, mensaje: msg };
      }).filter(Boolean);
      return {
        variantKey: rr.id + '|' + perm.join(''),
        enunciado: 'En ' + (rr.dom === 'Z' ? '$\\mathbb{Z}$' : '$\\mathbb{N}^+=\\{1,2,3,\\dots\\}$') + ' se define la relación $R$ por $' + rr.tex + '$. ¿Qué tipo de relación es?',
        entrada: { tipo: 'eleccion', opciones }, verificador: { id: 'indice', args: { esperado: perm.indexOf(tipo) } }, firmas,
        pistas: ['Orientación: comprueba reflexividad, simetría, antisimetría y transitividad.', 'Idea clave: equivalencia = reflexiva + simétrica + transitiva; orden = reflexiva + antisimétrica + transitiva.', 'Primer paso: ¿es $aRa$ para todo $a$?'],
        explicacion: 'Es ' + TIPOS[tipo].toLowerCase() + ' (reflexiva: ' + (p[0] ? 'sí' : 'no') + ', simétrica: ' + (p[1] ? 'sí' : 'no') + ', antisimétrica: ' + (p[2] ? 'sí' : 'no') + ', transitiva: ' + (p[3] ? 'sí' : 'no') + ').',
      };
    },
  });

  /* ---------- demostraciones ---------- */
  const NM = [['a', 'b', 'c'], ['x', 'y', 'z'], ['p', 'q', '']];
  dem({
    id: 'dem.clase-igual', teorema: 't.clase-igual', nivel: '1.3', habilidades: ['1.3.clases', '1.3.demostrar'], requiere: [], refsExtra: ['b.arbitrario', 'd.diferencia', 'b.contradiccion'],
    param: rng => { const [a, b, x] = rng.pick(NM); return { a, b, x }; },
    enunciado: p => r`Sea $\sim$ una relación de equivalencia en $X$. Demuestra que si $${p.a}\sim ${p.b}$, entonces $[${p.a}]=[${p.b}]$.`,
    hip: p => [r`$\sim$ es reflexiva, simétrica y transitiva en $X$`, r`$${p.a},${p.b}\in X$ con $${p.a}\sim ${p.b}$`, r`$[${p.a}]=\{${p.x}\in X: ${p.x}\sim ${p.a}\}$`],
    meta: p => r`$[${p.a}]=[${p.b}]$`,
    L: p => [
      ['L1', r`Suponemos que $${p.a}\sim ${p.b}$.`, 'hip'],
      ['L2', r`($[${p.a}]\subseteq[${p.b}]$) Sea $${p.x}\in[${p.a}]$: $${p.x}\sim ${p.a}$. Como $${p.x}\sim ${p.a}$ y $${p.a}\sim ${p.b}$, por transitividad $${p.x}\sim$ ⟦h1⟧, es decir, $${p.x}\in[${p.b}]$.`, 'd.relacion-equivalencia', ['L1'], [H('h1', p.b, [p.a, p.x, r`${p.a},${p.b}`])]],
      ['L3', r`($[${p.b}]\subseteq[${p.a}]$) Por ⟦h2⟧, de $${p.a}\sim ${p.b}$ sale $${p.b}\sim ${p.a}$. Si $${p.x}\in[${p.b}]$, entonces $${p.x}\sim ${p.b}$ y $${p.b}\sim ${p.a}$; por transitividad $${p.x}\sim ${p.a}$, es decir, $${p.x}\in[${p.a}]$.`, 'd.relacion-equivalencia', ['L1'], [H('h2', 'simetría', ['simetría', 'reflexividad', 'antisimetría'], false)]],
      ['L4', r`Por doble inclusión, $[${p.a}]=[${p.b}]$. ∎`, 'd.igualdad-conj', ['L2', 'L3']],
    ],
    dist: p => [
      [r`Como $${p.a}\in[${p.a}]$ y $${p.a}\in[${p.b}]$, las dos clases comparten un elemento y por tanto son iguales.`, 'compartir un elemento exige antes el teorema que se quiere probar'],
      [r`Suponemos $[${p.a}]=[${p.b}]$ y deducimos $${p.a}\sim ${p.b}$.`, 'prueba el recíproco, no lo pedido'],
    ],
    err: p => [
      ['L2', r`($[${p.a}]\subseteq[${p.b}]$) Sea $${p.x}\in[${p.a}]$: $${p.x}\sim ${p.a}$. Por simetría, $${p.x}\sim ${p.b}$, es decir, $${p.x}\in[${p.b}]$.`, 'no-justificado', 'La simetría solo invierte un par; para encadenar $x\\sim a$ y $a\\sim b$ hace falta la transitividad.'],
      ['L3', r`($[${p.b}]\subseteq[${p.a}]$) Si $${p.x}\in[${p.b}]$, entonces $${p.x}\sim ${p.b}$ y $${p.a}\sim ${p.b}$; por transitividad $${p.x}\sim ${p.a}$.`, 'no-justificado', 'Para encadenar hay que tener $b\\sim a$ (invertir $a\\sim b$ con la simetría); $x\\sim b$ y $a\\sim b$ no se encadenan.'],
      ['L4', r`Como $[${p.a}]\subseteq[${p.b}]$, las clases son iguales. ∎`, 'caso-faltante', 'La igualdad exige las dos inclusiones.'],
    ],
    est: [['doble-inclusion', 'Doble inclusión entre las dos clases', true, 'Es la prueba estándar de L2–L4.'], ['cadena', 'Cadena de equivalencias: $x\\in[a]\\iff x\\sim a\\iff x\\sim b\\iff x\\in[b]$', true, 'Vale porque $a\\sim b$ permite sustituir $a$ por $b$ en las dos direcciones.'], ['particion', 'Usar que las clases forman una partición', false, 'Circular: ese teorema se demuestra a partir de este.'], EST_EJEMPLO],
    crit: ['Probé las dos inclusiones', 'Usé la transitividad con los pares correctos', 'Usé la simetría para invertir $a\\sim b$', 'Concluí por doble inclusión'],
    pistas: p => ['Orientación: dos clases son iguales si cada una está contenida en la otra.', r`Idea clave: usa $${p.a}\sim ${p.b}$ y la transitividad para pasar un elemento de $[${p.a}]$ a $[${p.b}]$, y la simetría para el otro sentido.`, r`Primer paso: toma $${p.x}\in[${p.a}]$ y escribe qué significa.`],
  });

  dem({
    id: 'dem.clases-disjuntas', teorema: 't.clases-disjuntas', nivel: '1.3', habilidades: ['1.3.clases', '1.3.demostrar'], requiere: ['t.clase-igual', 't.contrapositiva'], refsExtra: ['b.arbitrario', 'd.diferencia', 'b.contradiccion'],
    param: rng => { const [a, b, c] = rng.pick(NM); return { a, b, c }; },
    enunciado: p => r`Sea $\sim$ una relación de equivalencia en $X$. Demuestra que si $[${p.a}]\cap[${p.b}]\neq\varnothing$, entonces $[${p.a}]=[${p.b}]$; en consecuencia, dos clases distintas son disjuntas.`,
    hip: p => [r`$\sim$ es una relación de equivalencia en $X$`, r`$${p.a},${p.b}\in X$`, 'Puedes citar el teorema anterior (clases de elementos relacionados)'],
    meta: p => r`$[${p.a}]\cap[${p.b}]\neq\varnothing\Rightarrow[${p.a}]=[${p.b}]$`,
    L: p => [
      ['L1', r`Suponemos que $[${p.a}]\cap[${p.b}]\neq\varnothing$: existe $${p.c}\in[${p.a}]\cap[${p.b}]$.`, 'hip'],
      ['L2', r`Como $${p.c}\in[${p.a}]$, $${p.c}\sim ${p.a}$; como $${p.c}\in[${p.b}]$, $${p.c}\sim ${p.b}$.`, 'd.clase', ['L1']],
      ['L3', r`Por la simetría, $${p.a}\sim ${p.c}$; por la transitividad con $${p.c}\sim ${p.b}$ obtenemos $${p.a}\sim$ ⟦h1⟧.`, 'd.relacion-equivalencia', ['L2'], [H('h1', p.b, [p.c, p.a, r`${p.c}${p.b}`])]],
      ['L4', r`Como $${p.a}\sim ${p.b}$, el teorema anterior da $[${p.a}]=[${p.b}]$.`, 't.clase-igual', ['L3']],
      ['L5', r`Hemos probado la implicación; por su contrapositiva, si $[${p.a}]\neq[${p.b}]$ entonces $[${p.a}]\cap[${p.b}]=\varnothing$. ∎`, 't.contrapositiva', ['L4']],
    ],
    dist: p => [
      [r`Como $${p.a}\in[${p.a}]$ y $${p.b}\in[${p.b}]$, ambas clases son no vacías y por tanto se cortan.`, 'ser no vacías no implica que se corten'],
      [r`Como $[${p.a}]=[${p.b}]$, entonces $[${p.a}]\cap[${p.b}]\neq\varnothing$; esto prueba la implicación.`, 'prueba el recíproco'],
    ],
    err: p => [
      ['L3', r`Por la reflexividad, $${p.a}\sim ${p.c}$; por la transitividad con $${p.c}\sim ${p.b}$ obtenemos $${p.a}\sim ${p.b}$.`, 'no-justificado', 'Para invertir $c\\sim a$ en $a\\sim c$ se usa la simetría, no la reflexividad.'],
      ['L4', r`Como $${p.c}\sim ${p.a}$, el teorema anterior da $[${p.a}]=[${p.b}]$.`, 'conclusion-invalida', 'El teorema anterior necesita $a\\sim b$, no $c\\sim a$.'],
      ['L5', r`Por tanto, si $[${p.a}]\cap[${p.b}]=\varnothing$ entonces $[${p.a}]\neq[${p.b}]$. ∎`, 'conclusion-invalida', 'Eso es el recíproco de lo que se pidió, no su contrapositiva.'],
    ],
    est: [['elemento-comun', 'Tomar un elemento común y usar el teorema de elementos relacionados', true, 'Es la prueba estándar.'], ['contradiccion', 'Suponer que las clases son distintas y no disjuntas, y llegar a una contradicción', true, 'Equivale a la contrapositiva.'], ['particion', 'Usar que las clases forman una partición', false, 'Circular: ese teorema se apoya en este.'], EST_EJEMPLO],
    crit: ['Tomé un elemento común', 'Obtuve $a\\sim b$ con simetría y transitividad', 'Cité el teorema de clases iguales', 'Pasé a la versión «distintas ⇒ disjuntas»'],
    pistas: p => ['Orientación: el hecho de que se corten da un elemento concreto.', r`Idea clave: de $${p.c}\sim ${p.a}$ y $${p.c}\sim ${p.b}$ se deduce $${p.a}\sim ${p.b}$; luego se aplica el teorema anterior.`, r`Primer paso: sea $${p.c}\in[${p.a}]\cap[${p.b}]$.`],
  });

  dem({
    id: 'dem.equiv-particion', teorema: 't.equiv-particion', nivel: '1.3', habilidades: ['1.3.particion', '1.3.demostrar'], requiere: ['t.clases-disjuntas'], refsExtra: ['b.arbitrario', 'd.union', 'd.interseccion'],
    param: rng => { const [a, b] = rng.pick(NM); return { a, b }; },
    enunciado: p => r`Sea $\sim$ una relación de equivalencia en $X$. Demuestra que sus clases forman una partición de $X$: son no vacías, su unión es $X$ y dos clases distintas son disjuntas.`,
    hip: p => [r`$\sim$ es reflexiva, simétrica y transitiva en $X$`, 'Puedes citar el teorema de las clases disjuntas'],
    meta: p => r`las clases $[${p.a}]$, $${p.a}\in X$, forman una partición de $X$`,
    L: p => [
      ['L1', r`Debemos probar tres cosas: (i) cada clase es no vacía; (ii) la unión de las clases es $X$; (iii) dos clases distintas son disjuntas.`, 'd.particion'],
      ['L2', r`(i) Para $${p.a}\in X$, la reflexividad da $${p.a}\sim ${p.a}$; luego $${p.a}\in[${p.a}]$ y $[${p.a}]\neq\varnothing$.`, 'd.relacion-equivalencia', ['L1']],
      ['L3', r`(ii) Cada clase es un subconjunto de $X$, así que su unión está contenida en $X$. Recíprocamente, todo $${p.a}\in X$ está en $[${p.a}]$ (por L2), así que $X\subseteq\bigcup_{${p.a}\in X}[${p.a}]$. Las dos contenciones dan la igualdad.`, 'd.igualdad-conj', ['L2']],
      ['L4', r`(iii) Sean $[${p.a}]\neq[${p.b}]$. Por el teorema de las clases ⟦h1⟧, si tuvieran un elemento común serían iguales; luego no lo tienen.`, 't.clases-disjuntas', ['L1'], [H('h1', 'disjuntas', ['disjuntas', 'iguales', 'finitas'], false)]],
      ['L5', r`Por tanto $[${p.a}]\cap[${p.b}]=\varnothing$ siempre que $[${p.a}]\neq[${p.b}]$.`, 'd.interseccion', ['L4']],
      ['L6', r`Las clases son no vacías, cubren $X$ y son disjuntas dos a dos: forman una partición de $X$. ∎`, 'd.particion', ['L2', 'L3', 'L5']],
    ],
    dist: p => [
      [r`Como $X$ es finito, la unión de las clases es $X$.`, 'no hace falta ni se usa que $X$ sea finito'],
      [r`Como $[${p.a}]\neq[${p.b}]$, deben tener elementos distintos y, por tanto, ser disjuntas.`, 'tener elementos distintos no implica ser disjuntas'],
    ],
    err: p => [
      ['L2', r`(i) Para $${p.a}\in X$, la simetría da $${p.a}\sim ${p.a}$; luego $${p.a}\in[${p.a}]$.`, 'no-justificado', 'Lo que da $a\\sim a$ es la reflexividad, no la simetría.'],
      ['L3', r`(ii) Cada $${p.a}\in X$ está en $[${p.a}]$, así que la unión es $X$. (No hace falta más.)`, 'caso-faltante', 'Falta ver que la unión no sale de $X$: cada clase es subconjunto de $X$.'],
      ['L5', r`Por tanto $[${p.a}]\cap[${p.b}]=X$ siempre que $[${p.a}]\neq[${p.b}]$.`, 'error-de-calculo', 'La intersección de dos clases distintas es vacía, no $X$.'],
    ],
    est: [['tres-partes', 'Probar por separado las tres condiciones de una partición', true, 'Es la definición de partición.'], ['particiones-de-x', 'Construir a mano una partición concreta de un conjunto pequeño', false, 'Un ejemplo no prueba el caso general.'], ['circular', 'Suponer que las clases ya forman una partición', false, 'Es lo que se quiere probar.'], EST_EJEMPLO],
    crit: ['Enuncié las tres condiciones', 'Usé la reflexividad para probar que no son vacías', 'Probé que cubren $X$ con doble contención', 'Cité el teorema de clases disjuntas'],
    pistas: p => ['Orientación: una partición exige tres cosas distintas.', 'Idea clave: la reflexividad da que cada elemento está en su propia clase; lo demás es el teorema anterior.', r`Primer paso: ¿a qué clase pertenece $${p.a}$?`],
  });

  dem({
    id: 'dem.mod-equivalencia', teorema: 't.mod-equivalencia', nivel: '1.3', habilidades: ['1.3.propiedades', '1.3.demostrar'], requiere: [], refsExtra: ['b.arbitrario', 'd.diferencia'],
    param: rng => { const [a, b, c] = rng.pick(NM); return { a, b, c, n: rng.pick(['n', 'm']), k: rng.pick(['k', 'j']), l: rng.pick(['l', 't']) }; },
    enunciado: p => r`Sea $${p.n}\ge 1$ un entero. En $\mathbb{Z}$ se define $${p.a}\sim ${p.b}$ si $${p.n}\mid ${p.a}-${p.b}$. Demuestra que $\sim$ es una relación de equivalencia.`,
    hip: p => [r`$${p.n}\ge 1$ es un entero fijo`, r`$${p.n}\mid z$ significa que existe $${p.k}\in\mathbb{Z}$ con $z=${p.n}${p.k}$`],
    meta: p => r`$\sim$ es reflexiva, simétrica y transitiva`,
    L: p => [
      ['L1', r`Por definición, $${p.a}\sim ${p.b}$ significa que existe $${p.k}\in\mathbb{Z}$ con $${p.a}-${p.b}=${p.n}${p.k}$.`, 'd.divisibilidad'],
      ['L2', r`Reflexiva: $${p.a}-${p.a}=0=${p.n}\cdot 0$ con $0\in\mathbb{Z}$; luego $${p.a}\sim ${p.a}$.`, 'd.divisibilidad', ['L1']],
      ['L3', r`Simétrica: si $${p.a}-${p.b}=${p.n}${p.k}$, entonces $${p.b}-${p.a}=${p.n}\cdot$ ⟦h1⟧, con ⟦h2⟧; luego $${p.b}\sim ${p.a}$.`, 'd.divisibilidad', ['L1'], [H('h1', '(-' + p.k + ')', ['(' + p.k + ')', '(1/' + p.k + ')', '(-' + p.n + ')']), H('h2', '$-' + p.k + '\\in\\mathbb{Z}$', ['$' + p.k + '\\in\\mathbb{N}$', '$-' + p.k + '\\in\\mathbb{N}$'], false)]],
      ['L4', r`Transitiva: si $${p.a}-${p.b}=${p.n}${p.k}$ y $${p.b}-${p.c}=${p.n}${p.l}$, entonces $${p.a}-${p.c}=(${p.a}-${p.b})+(${p.b}-${p.c})=${p.n}\cdot$ ⟦h3⟧, con $${p.k}+${p.l}\in\mathbb{Z}$; luego $${p.a}\sim ${p.c}$.`, 'b.cerradura-enteros', ['L1'], [H('h3', p.k + '+' + p.l, [p.k + p.l, p.k + '-' + p.l, p.k + '\\cdot ' + p.l])]],
      ['L5', r`Es reflexiva, simétrica y transitiva: $\sim$ es una relación de equivalencia. ∎`, 'd.relacion-equivalencia', ['L2', 'L3', 'L4']],
    ],
    dist: p => [
      [r`Antisimétrica: si $${p.a}\sim ${p.b}$ y $${p.b}\sim ${p.a}$ entonces $${p.a}=${p.b}$.`, 'es falso (p. ej. $0\\sim n$ y $n\\sim 0$) y no se pide'],
      [r`Como $${p.n}=4$ cumple $6\sim 2$, la relación es de equivalencia.`, 'un ejemplo no prueba una propiedad general'],
    ],
    err: p => [
      ['L2', r`Reflexiva: $${p.a}-${p.a}=${p.n}\cdot ${p.a}$; luego $${p.a}\sim ${p.a}$.`, 'error-de-calculo', '$a-a=0$, no $n\\cdot a$.'],
      ['L3', r`Simétrica: si $${p.a}-${p.b}=${p.n}${p.k}$, entonces $${p.b}-${p.a}=${p.n}${p.k}$; luego $${p.b}\sim ${p.a}$.`, 'error-de-calculo', 'Al invertir el orden de la resta cambia el signo: $b-a=n(-k)$.'],
      ['L4', r`Transitiva: entonces $${p.a}-${p.c}=${p.n}${p.k}${p.l}$ con $${p.k}${p.l}\in\mathbb{Z}$; luego $${p.a}\sim ${p.c}$.`, 'error-de-calculo', 'Las restas se suman, no se multiplican: $a-c=n(k+l)$.'],
    ],
    est: [['definicion', 'Probar reflexividad, simetría y transitividad con la definición de divisibilidad', true, 'Es el método directo.'], ['mismo-resto', 'Probar que $a\\sim b$ equivale a que $a$ y $b$ tienen el mismo resto al dividir por $n$, y deducir las tres propiedades', true, 'Funciona, usando la división con resto.'], ['clases', 'Exhibir las clases de equivalencia', false, 'Circular: las clases solo tienen sentido si ya es de equivalencia.'], EST_EJEMPLO],
    crit: ['Escribí qué significa $a\\sim b$', 'Probé la reflexividad', 'Probé la simetría (con el signo)', 'Probé la transitividad sumando'],
    pistas: p => ['Orientación: hay tres propiedades que probar con la definición de divisibilidad.', r`Idea clave: $${p.a}-${p.c}=(${p.a}-${p.b})+(${p.b}-${p.c})$.`, r`Primer paso: escribe $${p.a}-${p.a}$ y encuentra el múltiplo de $${p.n}$.`],
  });

  dem({
    id: 'dem.unicidad-maximo', teorema: 't.unicidad-maximo', nivel: '1.3', habilidades: ['1.3.orden', '1.3.maximales', '1.3.demostrar'], requiere: [], refsExtra: ['d.relacion-equivalencia', 'b.arbitrario'],
    param: rng => ({ m: rng.pick(['m', 'u']), mp: rng.pick(["m'", 'v']), dual: rng.chance(0.4) }),
    enunciado: p => p.dual ? r`Sea $(X,\le)$ un conjunto parcialmente ordenado. Demuestra que si tiene un mínimo, es único.` : r`Sea $(X,\le)$ un conjunto parcialmente ordenado. Demuestra que si tiene un máximo, es único.`,
    hip: p => [r`$\le$ es reflexiva, antisimétrica y transitiva en $X$`, p.dual ? r`$${p.m}$ es mínimo: $${p.m}\le x$ para todo $x\in X$` : r`$${p.m}$ es máximo: $x\le ${p.m}$ para todo $x\in X$`],
    meta: p => r`$${p.m}=${p.mp}$`,
    L: p => { const le = (a, b) => (p.dual ? r`${b}\le ${a}` : r`${a}\le ${b}`); return [
      ['L1', r`Sean $${p.m}$ y $${p.mp}$ dos ${p.dual ? 'mínimos' : 'máximos'} de $X$.`, (q => q.dual ? 'd.minimo' : 'd.maximo')],
      ['L2', r`Como $${p.m}$ es ${p.dual ? 'mínimo' : 'máximo'} y $${p.mp}\in X$, se cumple $${le(p.mp, p.m)}$.`, (q => q.dual ? 'd.minimo' : 'd.maximo'), ['L1']],
      ['L3', r`Como $${p.mp}$ es ${p.dual ? 'mínimo' : 'máximo'} y $${p.m}\in X$, se cumple $${le(p.m, p.mp)}$.`, (q => q.dual ? 'd.minimo' : 'd.maximo'), ['L1']],
      ['L4', r`Por la ⟦h1⟧, de $${le(p.mp, p.m)}$ y $${le(p.m, p.mp)}$ se sigue $${p.m}=${p.mp}$. ∎`, 'd.orden-parcial', ['L2', 'L3'], [H('h1', 'antisimetría', ['antisimetría', 'reflexividad', 'transitividad'], false)]],
    ]; },
    dist: p => [
      [r`Como ambos son ${p.dual ? 'minimales' : 'maximales'}, son iguales.`, 'un orden parcial puede tener varios elementos maximales (o minimales)'],
      [r`Como $${p.m}\le ${p.mp}$, entonces $${p.m}<${p.mp}$ y no pueden ser iguales.`, 'asume lo contrario de lo que se quiere probar'],
    ],
    err: p => [
      ['L2', r`Como $${p.m}$ es ${p.dual ? 'mínimo' : 'máximo'}, se cumple $${p.dual ? p.mp + '\\le ' + p.m : p.m + '\\le ' + p.mp}$.`, 'conclusion-invalida', 'El sentido está al revés: el máximo queda por encima de todos, no por debajo.'],
      ['L4', r`Por la reflexividad, de $${p.m}\le ${p.mp}$ y $${p.mp}\le ${p.m}$ se sigue $${p.m}=${p.mp}$. ∎`, 'no-justificado', 'La propiedad que da la igualdad es la antisimetría.'],
      ['L3', r`Como $${p.mp}$ es ${p.dual ? 'mínimo' : 'máximo'} y $${p.m}\in X$, se cumple $${p.m}=${p.mp}$.`, 'circular', 'Eso es justo lo que se quiere probar.'],
    ],
    est: [['antisimetria', 'Comparar los dos en ambos sentidos y usar la antisimetría', true, 'Es la prueba estándar.'], ['contradiccion', 'Suponer $m\\neq m\'$ y llegar a una contradicción con la antisimetría', true, 'Es la misma idea por reducción al absurdo.'], ['maximales', 'Decir que máximo y maximal son lo mismo', false, 'Un maximal no tiene por qué ser máximo ni único.'], EST_EJEMPLO],
    crit: ['Tomé dos máximos', 'Usé la definición de máximo dos veces', 'Cité la antisimetría', 'Concluí la igualdad'],
    pistas: p => ['Orientación: si hay dos, compáralos entre sí.', 'Idea clave: cada uno es mayor o igual que todos, incluido el otro.', r`Primer paso: aplica la definición de ${p.dual ? 'mínimo' : 'máximo'} de $${p.m}$ al elemento $${p.mp}$.`],
  });

  /* ---------- nivel ---------- */
  R.nivel({
    id: '1.3', mundo: 1, titulo: 'Relaciones de equivalencia y de orden', tema: 'Propiedades, clases, particiones y órdenes',
    habilidades: ['1.3.propiedades', '1.3.clases', '1.3.particion', '1.3.orden', '1.3.maximales', '1.3.demostrar'],
    teoremas: ['t.clase-igual', 't.clases-disjuntas', 't.equiv-particion', 't.mod-equivalencia', 't.unicidad-maximo'],
    leccion: {
      intro: 'Una **relación** en $A$ es un conjunto $R$ de pares de elementos de $A$; escribimos $aRb$ si $(a,b)\\in R$. Las relaciones útiles cumplen combinaciones de cuatro propiedades.',
      definiciones: [
        { nombre: 'Propiedades', tex: '**Reflexiva**: $aRa$ para todo $a$. **Simétrica**: $aRb\\Rightarrow bRa$. **Antisimétrica**: $aRb$ y $bRa$ $\\Rightarrow a=b$. **Transitiva**: $aRb$ y $bRc\\Rightarrow aRc$.' },
        { nombre: 'Equivalencia y clases', tex: 'Una relación es **de equivalencia** si es reflexiva, simétrica y transitiva. La **clase** de $a$ es $[a]=\\{x: x\\sim a\\}$.' },
        { nombre: 'Orden parcial', tex: 'Una relación es **de orden parcial** si es reflexiva, antisimétrica y transitiva. Un **máximo** es un elemento mayor o igual que todos; un **maximal** es un elemento sobre el que no hay otro.' },
        { nombre: 'Partición', tex: 'Una **partición** de $X$ es una familia de subconjuntos no vacíos, disjuntos dos a dos, cuya unión es $X$.' },
      ],
      teorema: 't.equiv-particion',
      ejemplo: { enunciado: 'En $A=\\{1,2,\\dots,6\\}$, sea $a\\sim b$ si $a-b$ es múltiplo de $3$. Halla las clases.', pasos: ['Es una relación de equivalencia (la congruencia módulo 3).', '$[1]=\\{1,4\\}$, porque $1-4=-3$ es múltiplo de 3.', '$[2]=\\{2,5\\}$ y $[3]=\\{3,6\\}$.', 'Las tres clases son no vacías, cubren $A$ y son disjuntas: forman una partición de $A$.'] },
    },
  });

  if (typeof module !== 'undefined') module.exports = AC;
})(globalThis.AC = globalThis.AC || {});
