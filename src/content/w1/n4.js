/* Mundo 1, nivel 1.4 — Funciones: inyectiva, sobreyectiva, biyectiva, composición e inversa. */
(function (AC) {
  const { R, r, H, T, dem, EST_EJEMPLO } = AC.w1c;
  const C = AC.conj, E = AC.expr;
  const par = n => (n < 0 ? '(' + n + ')' : String(n));
  const sg = (n, primero) => (n < 0 ? '-' : primero ? '' : '+') + (Math.abs(n) === 1 ? '' : Math.abs(n));
  const lin = (a, b, v) => { v = v || 'x'; return (a === 0 ? '' : sg(a, true) + v) + (b === 0 ? (a === 0 ? '0' : '') : (b < 0 ? '-' : (a === 0 ? '' : '+')) + Math.abs(b)); };

  /* ---------- catálogo ---------- */
  const HB = (id, nombre) => R.habilidad({ id: '1.4.' + id, nombre, nivel: '1.4' });
  HB('clasificar', 'Inyectiva, sobreyectiva, biyectiva'); HB('imagen-preimagen', 'Imagen y preimagen'); HB('composicion', 'Composición de funciones'); HB('inversa', 'Función inversa'); HB('contar', 'Contar funciones'); HB('demostrar', 'Demostrar propiedades de funciones');
  const TE = (id, titulo, enunciado, requiere, habilidades) => R.teorema({ id, titulo, nivel: '1.4', enunciado, requiere, habilidades });
  TE('t.comp-inyectiva', 'Composición de inyectivas', r`Si $f:A\to B$ y $g:B\to C$ son inyectivas, $g\circ f$ es inyectiva.`, [], ['1.4.composicion', '1.4.demostrar']);
  TE('t.comp-sobreyectiva', 'Composición de sobreyectivas', r`Si $f:A\to B$ y $g:B\to C$ son sobreyectivas, $g\circ f$ es sobreyectiva.`, [], ['1.4.composicion', '1.4.demostrar']);
  TE('t.comp-biyectiva', 'Composición de biyectivas', r`Si $f$ y $g$ son biyectivas, $g\circ f$ es biyectiva.`, ['t.comp-inyectiva', 't.comp-sobreyectiva'], ['1.4.composicion', '1.4.demostrar']);
  TE('t.biyectiva-inversa', 'Biyectiva si y solo si tiene inversa', r`$f:A\to B$ es biyectiva si y solo si existe $g:B\to A$ con $g\circ f=\mathrm{id}_A$ y $f\circ g=\mathrm{id}_B$.`, [], ['1.4.inversa', '1.4.demostrar']);
  TE('t.factor-inyectiva', 'Si g∘f es inyectiva, f lo es', r`Si $g\circ f$ es inyectiva, entonces $f$ es inyectiva.`, [], ['1.4.clasificar', '1.4.demostrar']);

  /* ---------- 1. clasificar una función (elección) ---------- */
  const OPC = ['Inyectiva pero no sobreyectiva', 'Sobreyectiva pero no inyectiva', 'Biyectiva', 'Ni inyectiva ni sobreyectiva'];
  const GEN_INJ = 'Sí es inyectiva: valores iguales solo se obtienen de entradas iguales.', GEN_SOB = 'Sí es sobreyectiva: todo elemento del codominio es imagen de alguno.';
  function casosAnaliticos(rng) {
    const a = rng.pick([2, 3, 4, -2, -3]), b = rng.int(-5, 5), c = rng.int(-4, 6), k = rng.int(1, 5), s = rng.pick([1, -1]);
    return rng.pick([
      { tex: `f:\\mathbb{Z}\\to\\mathbb{Z},\\ f(x)=${lin(a, b)}`, tipo: 0, ri: null, rs: `los valores son ${lin(a, b)} y, por ejemplo, $${b + 1}$ no tiene preimagen entera (haría falta $x=\\frac{1}{${a}}$).` },
      { tex: `f:\\mathbb{Z}\\to\\mathbb{Z},\\ f(x)=${s === 1 ? 'x' : '-x'}${b === 0 ? '' : (b < 0 ? '-' : '+') + Math.abs(b)}`, tipo: 2 },
      { tex: `f:\\mathbb{R}\\to\\mathbb{R},\\ f(x)=${lin(a, b)}`, tipo: 2 },
      { tex: `f:\\mathbb{R}\\to\\mathbb{R},\\ f(x)=x^2${c === 0 ? '' : (c < 0 ? '-' : '+') + Math.abs(c)}`, tipo: 3, ri: `$f(1)=f(-1)=${1 + c}$ con $1\\neq-1$.`, rs: `$${c - 1}$ no es imagen de ningún real (los valores son $\\ge ${c}$).` },
      { tex: `f:\\mathbb{R}\\to[${c},\\infty),\\ f(x)=x^2${c === 0 ? '' : (c < 0 ? '-' : '+') + Math.abs(c)}`, tipo: 1, ri: `$f(1)=f(-1)=${1 + c}$ con $1\\neq-1$.` },
      { tex: `f:[0,\\infty)\\to[${c},\\infty),\\ f(x)=x^2${c === 0 ? '' : (c < 0 ? '-' : '+') + Math.abs(c)}`, tipo: 2 },
      { tex: `f:\\mathbb{N}\\to\\mathbb{N},\\ f(n)=n+${k}`, tipo: 0, rs: `$0$ no es de la forma $n+${k}$ con $n\\in\\mathbb{N}$.` },
      { tex: `f:\\mathbb{N}\\to\\mathbb{N},\\ f(n)=\\lfloor n/2\\rfloor`, tipo: 1, ri: `$f(0)=f(1)=0$ con $0\\neq 1$.` },
      { tex: `f:\\mathbb{R}\\to\\mathbb{R},\\ f(x)=x^3${c === 0 ? '' : (c < 0 ? '-' : '+') + Math.abs(c)}`, tipo: 2 },
      { tex: `f:\\mathbb{R}\\to\\mathbb{R},\\ f(x)=|x|${c === 0 ? '' : (c < 0 ? '-' : '+') + Math.abs(c)}`, tipo: 3, ri: `$f(1)=f(-1)=${1 + c}$ con $1\\neq-1$.`, rs: `$${c - 1}$ no es imagen de ningún real (los valores son $\\ge ${c}$).` },
      { tex: `f:\\mathbb{Z}\\to\\mathbb{Z},\\ f(x)=x^2`, tipo: 3, ri: `$f(2)=f(-2)=4$ con $2\\neq-2$.`, rs: `$2$ no es el cuadrado de ningún entero.` },
    ]);
  }
  function casoFinito(rng) {
    const tipo = rng.pick([0, 1, 2, 3, 3]);
    let nA, nB;
    if (tipo === 0) { nB = rng.int(3, 5); nA = rng.int(2, nB - 1); } else if (tipo === 1) { nA = rng.int(3, 5); nB = rng.int(2, nA - 1); } else if (tipo === 2) { nA = nB = rng.int(3, 5); } else { nA = rng.int(3, 5); nB = rng.int(3, 5); }
    const A = Array.from({ length: nA }, (_, i) => String(i + 1)), B = 'abcde'.slice(0, nB).split('');
    for (let i = 0; i < 200; i++) {
      let f = {};
      if (tipo === 0 || tipo === 2) { const im = rng.shuffle(B).slice(0, nA); A.forEach((x, j) => { f[x] = im[j]; }); }
      else if (tipo === 1) { const base = rng.shuffle(A); const im = B.concat(Array.from({ length: nA - nB }, () => rng.pick(B))); const mezclado = rng.shuffle(im); base.forEach((x, j) => { f[x] = mezclado[j]; }); }
      else A.forEach(x => { f[x] = rng.pick(B); });
      const inj = C.fun.inyectiva(f), sob = C.fun.sobreyectiva(f, B), t = inj && sob ? 2 : inj ? 0 : sob ? 1 : 3;
      if (t !== tipo) continue;
      const flechas = A.map(x => `${x}\\mapsto ${f[x]}`).join(',\\ ');
      const rep = Object.keys(f).find(x => Object.keys(f).some(y => y !== x && f[y] === f[x])), rep2 = rep && Object.keys(f).find(y => y !== rep && f[y] === f[rep]);
      const falta = B.find(b => !Object.values(f).includes(b));
      return { tex: `f:\\{${A.join(',')}\\}\\to\\{${B.join(',')}\\},\\ ${flechas}`, tipo, ri: rep ? `$f(${rep})=f(${rep2})=${f[rep]}$ con $${rep}\\neq ${rep2}$.` : null, rs: falta ? `$${falta}$ no es imagen de ningún elemento.` : null };
    }
    return casosAnaliticos(rng);
  }
  R.generador({
    id: 'w1.n4.clasificar-funcion', mundo: 1, nivel: '1.4', familia: 'aplicacion', habilidades: ['1.4.clasificar'], dificultad: 2, autoexplicacion: 'clasificar-metodo',
    generar(rng) {
      const caso = rng.chance(0.5) ? casoFinito(rng) : casosAnaliticos(rng);
      const claims = [[true, false], [false, true], [true, true], [false, false]];
      const real = [caso.tipo === 0 || caso.tipo === 2, caso.tipo === 1 || caso.tipo === 2];
      const perm = rng.shuffle([0, 1, 2, 3]);
      const firmas = perm.map((t, pos) => {
        if (t === caso.tipo) return null;
        let msg;
        if (claims[t][0] !== real[0]) msg = claims[t][0] ? 'No es inyectiva: ' + (caso.ri || 'dos entradas distintas tienen la misma imagen') : GEN_INJ;
        else msg = claims[t][1] ? 'No es sobreyectiva: ' + (caso.rs || 'hay elementos del codominio sin preimagen') : GEN_SOB;
        return { id: 'elige-' + ['inyectiva', 'sobreyectiva', 'biyectiva', 'ninguna'][t], respuesta: pos, mensaje: msg };
      }).filter(Boolean);
      return {
        variantKey: caso.tex + '|' + perm.join(''),
        enunciado: 'Clasifica la función $' + caso.tex + '$.',
        entrada: { tipo: 'eleccion', opciones: perm.map(t => OPC[t]) }, verificador: { id: 'indice', args: { esperado: perm.indexOf(caso.tipo) } }, firmas,
        pistas: ['Orientación: decide por separado si es inyectiva y si es sobreyectiva.', 'Idea clave: inyectiva = no hay dos entradas distintas con la misma imagen; sobreyectiva = todo elemento del codominio es imagen de alguno.', 'Primer paso: busca dos entradas distintas con la misma imagen, o un elemento del codominio que nadie alcance.'],
        explicacion: 'Es ' + OPC[caso.tipo].toLowerCase() + '.' + (caso.ri ? ' No inyectiva: ' + caso.ri : '') + (caso.rs ? ' No sobreyectiva: ' + caso.rs : ''),
      };
    },
  });
  R.banco('clasificar-metodo', { pregunta: '¿Qué hace falta para refutar una de estas propiedades?', opciones: [
    { texto: 'Un solo ejemplo: dos entradas con la misma imagen (inyectividad) o un elemento sin preimagen (sobreyectividad).', correcta: true },
    { texto: 'Comprobar que fallan todas las entradas.', correcta: false },
    { texto: 'Basta que el dominio y el codominio tengan distinto tamaño.', correcta: false },
    { texto: 'No se puede refutar con ejemplos.', correcta: false },
  ] });

  /* ---------- 2. imagen y preimagen (conjunto) ---------- */
  R.generador({
    id: 'w1.n4.imagen-preimagen', mundo: 1, nivel: '1.4', familia: 'aplicacion', habilidades: ['1.4.imagen-preimagen'], dificultad: 2, autoexplicacion: null,
    generar(rng) {
      for (let i = 0; i < 200; i++) {
        const nA = rng.int(5, 7), A = Array.from({ length: nA }, (_, k) => String(k + 1)), B = 'abcdef'.slice(0, rng.int(4, 5)).split('');
        const f = {}; A.forEach(x => { f[x] = rng.pick(B); });
        const flechas = A.map(x => `${x}\\mapsto ${f[x]}`).join(',\\ ');
        const pide = rng.pick(['imagen', 'preimagen']);
        if (pide === 'imagen') {
          const S = C.norm(rng.sample(A, rng.int(2, 4))), res = C.fun.imagen(f, S), pre = C.fun.preimagen(f, S.filter(x => B.includes(x)));
          const firmas = [];
          const todo = C.norm(Object.values(f)); if (!C.eq(todo, res)) firmas.push({ id: 'imagen-de-todo', respuesta: C.fmt(todo), mensaje: 'Esa es la imagen de todo el dominio; piden solo la de $S$.' });
          const conRep = S.map(x => f[x]); if (new Set(conRep).size !== conRep.length) firmas.push({ id: 'repite', respuesta: C.fmt(res.concat([])), mensaje: '' }); firmas.pop();
          const dom = C.norm(A.filter(x => !S.includes(x) && res.includes(f[x]))); const mezcla = C.uni(res, dom); if (dom.length) firmas.push({ id: 'confunde-preimagen', respuesta: C.fmt(C.norm(A.filter(x => res.includes(f[x])))), mensaje: 'Aquí aparecen elementos del dominio: eso es la preimagen de la imagen, no la imagen.' }); void mezcla; void pre;
          return { variantKey: 'img|' + flechas + '|' + S.join(''), enunciado: 'Sea $f:\\{' + A.join(',') + '\\}\\to\\{' + B.join(',') + '\\}$ con $' + flechas + '$. Halla la imagen $f(S)$ de $S=' + C.tex(S) + '$ (escribe un conjunto).', entrada: { tipo: 'conjunto' }, verificador: { id: 'igual-conjunto', args: { esperado: res } }, solucionTexto: [C.fmt(res)], firmas: firmas.filter(f2 => f2.mensaje),
            pistas: ['Orientación: la imagen reúne los valores $f(x)$ para $x\\in S$.', 'Idea clave: un valor que se repite cuenta una sola vez en el conjunto.', 'Primer paso: calcula $f(x)$ para cada $x\\in S$.'], explicacion: '$f(S)=' + C.tex(res) + '$.' };
        }
        const T2 = C.norm(rng.sample(B, rng.int(1, 2))), res = C.fun.preimagen(f, T2);
        if (!res.length || res.length === A.length) continue;
        const firmas = [{ id: 'confunde-imagen', respuesta: C.fmt(T2), mensaje: 'Eso es el propio $T$: la preimagen se busca en el dominio (los números).' }];
        const parcial = C.norm(A.filter(x => f[x] === T2[0])); if (T2.length > 1 && !C.eq(parcial, res)) firmas.push({ id: 'solo-un-elemento', respuesta: C.fmt(parcial), mensaje: 'Te faltan los elementos que van a los demás valores de $T$.' });
        return { variantKey: 'pre|' + flechas + '|' + T2.join(''), enunciado: 'Sea $f:\\{' + A.join(',') + '\\}\\to\\{' + B.join(',') + '\\}$ con $' + flechas + '$. Halla la preimagen $f^{-1}(T)$ de $T=' + C.tex(T2) + '$ (escribe un conjunto).', entrada: { tipo: 'conjunto' }, verificador: { id: 'igual-conjunto', args: { esperado: res } }, solucionTexto: [C.fmt(res)], firmas,
          pistas: ['Orientación: la preimagen son los elementos del dominio cuya imagen cae en $T$.', 'Idea clave: se recorre el dominio y se conservan los $x$ con $f(x)\\in T$.', 'Primer paso: mira qué entradas van a ' + T2[0] + '.'], explicacion: '$f^{-1}(T)=' + C.tex(res) + '$.' };
      }
      throw new Error('imagen-preimagen: sin instancia');
    },
  });

  /* ---------- 3. composición (expresión) ---------- */
  R.generador({
    id: 'w1.n4.composicion', mundo: 1, nivel: '1.4', familia: 'aplicacion', habilidades: ['1.4.composicion'], dificultad: 2, autoexplicacion: null,
    generar(rng) {
      for (let i = 0; i < 100; i++) {
        const a = rng.pick([1, 2, 3, -1, -2]), b = rng.int(-5, 5), c = rng.pick([1, 2, 3, -1]), d = rng.int(-4, 4), cuad = rng.chance(0.5), orden = rng.pick(['gf', 'fg']);
        const fS = x => `${par(a)}*(${x})+${par(b)}`, gS = x => (cuad ? `${par(c)}*(${x})^2+${par(d)}` : `${par(c)}*(${x})+${par(d)}`);
        const fTex = lin(a, b), gTex = cuad ? `${sg(c, true)}x^2${d === 0 ? '' : (d < 0 ? '-' : '+') + Math.abs(d)}` : lin(c, d);
        const ok = orden === 'gf' ? gS(fS('x')) : fS(gS('x')), otro = orden === 'gf' ? fS(gS('x')) : gS(fS('x'));
        const prod = `(${fS('x')})*(${gS('x')})`, suma = `${fS('x')}+${gS('x')}`;
        const firmas = [['orden-invertido', otro, 'Compusiste en el otro orden: $(g\\circ f)(x)=g(f(x))$ aplica primero $f$.'], ['producto', prod, 'Eso es el producto $f(x)g(x)$, no la composición.'], ['suma', suma, 'Eso es la suma $f(x)+g(x)$; composición es sustituir una función dentro de la otra.']];
        if (cuad && orden === 'gf') firmas.push(['sin-cuadrado', `${par(c)}*(${fS('x')})+${par(d)}`, 'Olvidaste elevar al cuadrado todo $f(x)$.']);
        const fs = firmas.filter(f => { try { return !E.equiv(f[1], ok); } catch (e) { return false; } }).map(f => ({ id: f[0], respuesta: f[1], mensaje: f[2] }));
        return {
          variantKey: [a, b, c, d, cuad, orden].join('|'),
          enunciado: 'Sean $f(x)=' + fTex + '$ y $g(x)=' + gTex + '$. Escribe $(' + (orden === 'gf' ? 'g\\circ f' : 'f\\circ g') + ')(x)$ (puedes dejarlo sin simplificar; usa ^ para potencias).',
          entrada: { tipo: 'expr', vars: ['x'] }, verificador: { id: 'equivalente-expr', args: { f: ok } }, solucionExpr: ok, solucionTexto: [],
          firmas: fs,
          pistas: ['Orientación: $(g\\circ f)(x)$ significa «primero $f$, luego $g$».', 'Idea clave: en la fórmula de la función exterior se reemplaza $x$ por la fórmula de la interior (entre paréntesis).', 'Primer paso: escribe la función exterior con un paréntesis donde va $x$.'],
          explicacion: 'Se sustituye: $' + E.tex(E.parse(ok)) + '$.',
        };
      }
      throw new Error('composicion: sin instancia');
    },
  });

  /* ---------- 4. inversa (expresión) ---------- */
  R.generador({
    id: 'w1.n4.inversa', mundo: 1, nivel: '1.4', familia: 'aplicacion', habilidades: ['1.4.inversa'], dificultad: 3, autoexplicacion: null,
    generar(rng) {
      for (let i = 0; i < 200; i++) {
        const tipo = rng.pick(['afin', 'afin', 'frac', 'recip']);
        const a = rng.pick([2, 3, 4, 5, -2, -3]), b = rng.int(-6, 6), c = rng.pick([1, 2, 3]), d = rng.int(-4, 4);
        let tex, inv, f, firmas = [];
        if (tipo === 'afin') {
          tex = lin(a, b); f = `${par(a)}*x+${par(b)}`; inv = `(x-${par(b)})/${par(a)}`;
          firmas = [['signo', `(x+${par(b)})/${par(a)}`, 'Al despejar, $b$ pasa **restando**: de $y=ax+b$ sale $x=(y-b)/a$.'], ['sin-dividir', `x-${par(b)}`, 'Falta dividir entre $a$ al despejar $x$.'], ['reciproco', `1/(${f})`, 'La inversa no es $1/f(x)$: es la función que deshace a $f$.']];
        } else if (tipo === 'frac') {
          if (a * d - b * c === 0) continue;
          tex = `\\frac{${lin(a, b)}}{${lin(c, d)}}`; f = `(${par(a)}*x+${par(b)})/(${par(c)}*x+${par(d)})`; inv = `(${par(d)}*x-${par(b)})/(${par(a)}-${par(c)}*x)`;
          firmas = [['reciproco', `(${par(c)}*x+${par(d)})/(${par(a)}*x+${par(b)})`, 'El recíproco $1/f(x)$ no es la inversa: hay que despejar $x$ en $y=f(x)$.'], ['copia-f', f, 'Esa es la propia $f$; la inversa se obtiene despejando $x$.'], ['signo', `(${par(d)}*x+${par(b)})/(${par(a)}-${par(c)}*x)`, 'Cuidado con el signo de $b$ al pasar sumando términos al otro lado.']];
        } else {
          tex = `\\frac{${a}}{x${b === 0 ? '' : (b < 0 ? '-' : '+') + Math.abs(b)}}${d === 0 ? '' : (d < 0 ? '-' : '+') + Math.abs(d)}`; f = `${par(a)}/(x+${par(b)})+${par(d)}`; inv = `${par(a)}/(x-${par(d)})-${par(b)}`;
          firmas = [['sin-restar', `${par(a)}/(x)-${par(b)}`, 'Falta restar $' + d + '$ al despejar: de $y=\\frac{a}{x+b}+d$ sale $\\frac{a}{y-d}=x+b$.'], ['reciproco', `(x+${par(b)})/${par(a)}`, 'Eso es el recíproco de la parte fraccionaria, no la inversa.']];
        }
        const dominio = tipo === 'afin' ? '' : tipo === 'frac' ? ' (donde esté definida)' : ' (donde esté definida)';
        const fs = firmas.filter(s => { try { return !E.equiv(s[1], inv); } catch (e) { return false; } }).map(s => ({ id: s[0], respuesta: s[1], mensaje: s[2] }));
        if (!fs.length) continue;
        return {
          variantKey: tipo + [a, b, c, d].join(','),
          enunciado: 'La función $f(x)=' + tex + '$ es biyectiva' + dominio + '. Escribe su inversa $f^{-1}(x)$ (como expresión en $x$).',
          entrada: { tipo: 'expr', vars: ['x'] }, verificador: { id: 'equivalente-expr', args: { f: inv } }, solucionExpr: inv, solucionTexto: [], firmas: fs,
          pistas: ['Orientación: si $y=f(x)$, la inversa devuelve $x$ a partir de $y$.', 'Idea clave: escribe $y=f(x)$, despeja $x$ y al final cambia el nombre de la variable.', 'Primer paso: multiplica por los denominadores (si los hay) y reúne los términos con $x$.'],
          explicacion: 'Despejando $x$ en $y=f(x)$ se obtiene $f^{-1}(x)=' + E.tex(E.parse(inv)) + '$.',
        };
      }
      throw new Error('inversa: sin instancia');
    },
  });

  /* ---------- 5. contar funciones (entero) ---------- */
  const fact = n => (n <= 1 ? 1 : n * fact(n - 1));
  R.generador({
    id: 'w1.n4.contar-funciones', mundo: 1, nivel: '1.4', familia: 'aplicacion', habilidades: ['1.4.contar'], dificultad: 2, autoexplicacion: null,
    generar(rng) {
      for (let i = 0; i < 100; i++) {
        const n = rng.int(2, 5), m = rng.int(n, 7), tipo = rng.pick(['todas', 'inyectivas', 'biyectivas', 'fija-una']);
        let res, desc, firmas, key = tipo + n + '-' + m;
        const A = `A`, B = `B`;
        if (tipo === 'todas') { res = m ** n; desc = `¿Cuántas funciones $f:A\\to B$ hay si $|A|=${n}$ y $|B|=${m}$?`; firmas = [['al-reves', n ** m, 'Al revés: cada uno de los $|A|$ elementos elige entre $|B|$ imágenes, así que son $|B|^{|A|}$.'], ['producto', n * m, 'Eso cuenta pares $(a,b)$, no funciones: cada elemento elige su imagen de forma independiente.']]; }
        else if (tipo === 'inyectivas') { res = fact(m) / fact(m - n); desc = `¿Cuántas funciones inyectivas $f:A\\to B$ hay si $|A|=${n}$ y $|B|=${m}$?`; firmas = [['todas', m ** n, 'Eso cuenta todas las funciones; en las inyectivas no se repiten imágenes: $m(m-1)\\cdots(m-n+1)$.'], ['combinaciones', fact(m) / (fact(n) * fact(m - n)), 'Eso cuenta subconjuntos; en una función el orden de asignación importa.']]; }
        else if (tipo === 'biyectivas') { res = fact(n); desc = `¿Cuántas funciones biyectivas $f:A\\to B$ hay si $|A|=|B|=${n}$?`; key = tipo + n; firmas = [['potencia', n ** n, 'Eso cuenta todas las funciones; en las biyectivas las imágenes son todas distintas: $n!$.'], ['doble', 2 * n, 'No es lineal: cada elección reduce las opciones del siguiente elemento.']]; }
        else { res = m ** (n - 1); desc = `Si $|A|=${n}$ y $|B|=${m}$, ¿cuántas funciones $f:A\\to B$ cumplen $f(a_1)=b_1$ para un par fijo $a_1\\in A$, $b_1\\in B$?`; firmas = [['todas', m ** n, 'Eso incluye funciones con otro valor en $a_1$; ese valor está fijado.'], ['uno-menos', (m - 1) ** (n - 1), 'Los demás elementos pueden tomar cualquiera de los $|B|$ valores (también $b_1$).']]; }
        if (new RegExp('(^|\\D)' + res + '(\\D|$)').test(desc.replace(/\$/g, ' ')) || res > 100000) continue;
        void A; void B;
        return { variantKey: key, enunciado: desc, entrada: { tipo: 'entero' }, verificador: { id: 'entero', args: { esperado: String(res) } }, solucionTexto: [String(res)],
          firmas: firmas.filter(f => f[1] !== res).map(f => ({ id: f[0], respuesta: String(f[1]), mensaje: f[2] })),
          pistas: ['Orientación: piensa en cada elemento del dominio eligiendo su imagen, uno tras otro.', 'Idea clave: si las elecciones son independientes se multiplican; si no se puede repetir, cada elección tiene una opción menos.', 'Primer paso: ¿cuántas opciones tiene el primer elemento? ¿y el segundo?'],
          explicacion: 'Resultado: ' + res + '.' };
      }
      throw new Error('contar-funciones: sin instancia');
    },
  });

  /* ---------- demostraciones ---------- */
  const FN = [['f', 'g'], ['\\varphi', '\\psi'], ['u', 'v']];
  const compo = (g, f) => g + r`\circ ` + f;
  dem({
    id: 'dem.comp-inyectiva', teorema: 't.comp-inyectiva', nivel: '1.4', habilidades: ['1.4.composicion', '1.4.demostrar'], requiere: [], refsExtra: ['d.sobreyectiva', 'b.arbitrario', 'b.contradiccion'],
    param: rng => { const [f, g] = rng.pick(FN); return { f, g, x: rng.pick(['x', 'a']), y: rng.pick(['y', 'b']) }; },
    enunciado: p => r`Sean $${p.f}:A\to B$ y $${p.g}:B\to C$ funciones inyectivas. Demuestra que $${compo(p.g, p.f)}$ es inyectiva.`,
    hip: p => [r`$${p.f}$ es inyectiva`, r`$${p.g}$ es inyectiva`],
    meta: p => r`$${compo(p.g, p.f)}$ es inyectiva`,
    L: p => [
      ['L1', r`Sean $${p.x},${p.y}\in A$ con $(${compo(p.g, p.f)})(${p.x})=(${compo(p.g, p.f)})(${p.y})$; debemos probar que $${p.x}=${p.y}$.`, 'd.inyectiva'],
      ['L2', r`Por la definición de composición, $${p.g}(${p.f}(${p.x}))=${p.g}(${p.f}(${p.y}))$.`, 'd.composicion', ['L1']],
      ['L3', r`Como $${p.g}$ es inyectiva, ⟦h1⟧.`, 'hip', ['L2'], [H('h1', r`${p.f}(${p.x})=${p.f}(${p.y})`, [r`${p.x}=${p.y}`, r`${p.g}(${p.x})=${p.g}(${p.y})`, r`${p.f}(${p.x})\neq ${p.f}(${p.y})`])]],
      ['L4', r`Como $${p.f}$ es inyectiva, $${p.x}=${p.y}$.`, 'hip', ['L3']],
      ['L5', r`Luego $${compo(p.g, p.f)}$ es inyectiva. ∎`, 'd.inyectiva', ['L4']],
    ],
    dist: p => [
      [r`Como $${p.f}(${p.x})=${p.f}(${p.y})$, entonces $${p.g}(${p.f}(${p.x}))=${p.g}(${p.f}(${p.y}))$; luego $${compo(p.g, p.f)}$ es inyectiva.`, 'parte de la conclusión de la inyectividad de $f$ en vez de probarla'],
      [r`Como $${p.f}$ es sobreyectiva, $${compo(p.g, p.f)}$ es inyectiva.`, 'la sobreyectividad no es la hipótesis ni da la inyectividad'],
    ],
    err: p => [
      ['L2', r`Por la definición de composición, $${p.f}(${p.g}(${p.x}))=${p.f}(${p.g}(${p.y}))$.`, 'error-de-calculo', 'El orden está invertido: $(g\\circ f)(x)=g(f(x))$.'],
      ['L3', r`Como $${p.f}$ es inyectiva, $${p.f}(${p.x})=${p.f}(${p.y})$.`, 'no-justificado', 'La inyectividad de $f$ da $x=y$ a partir de $f(x)=f(y)$, no al revés; aquí hay que usar la de $g$.'],
      ['L4', r`Como $${p.g}$ es inyectiva, $${p.x}=${p.y}$.`, 'no-justificado', 'De $f(x)=f(y)$ se pasa a $x=y$ con la inyectividad de $f$, no de $g$.'],
    ],
    est: [['directa', 'Tomar dos elementos con la misma imagen y retroceder paso a paso', true, 'Es la prueba estándar.'], ['contrapositiva', 'Probar que $x\\neq y$ implica $g(f(x))\\neq g(f(y))$', true, 'Es la contrapositiva y funciona igual.'], ['sobreyectividad', 'Probar que la composición es sobreyectiva', false, 'Es otra propiedad.'], EST_EJEMPLO],
    crit: ['Partí de $(g\\circ f)(x)=(g\\circ f)(y)$', 'Usé la inyectividad de $g$ y luego la de $f$', 'Respeté el orden de la composición', 'Concluí la inyectividad'],
    pistas: p => ['Orientación: la inyectividad se prueba partiendo de dos elementos con la misma imagen.', r`Idea clave: se «retrocede»: primero con $${p.g}$, después con $${p.f}$.`, r`Primer paso: sean $${p.x},${p.y}$ con $(${compo(p.g, p.f)})(${p.x})=(${compo(p.g, p.f)})(${p.y})$.`],
  });

  dem({
    id: 'dem.comp-sobreyectiva', teorema: 't.comp-sobreyectiva', nivel: '1.4', habilidades: ['1.4.composicion', '1.4.demostrar'], requiere: [], refsExtra: ['d.inyectiva', 'b.arbitrario'],
    param: rng => { const [f, g] = rng.pick(FN); return { f, g, c: rng.pick(['c', 'z']), a: rng.pick(['a', 'x']), b: rng.pick(['b', 'y']) }; },
    enunciado: p => r`Sean $${p.f}:A\to B$ y $${p.g}:B\to C$ funciones sobreyectivas. Demuestra que $${compo(p.g, p.f)}$ es sobreyectiva.`,
    hip: p => [r`$${p.f}$ es sobreyectiva`, r`$${p.g}$ es sobreyectiva`],
    meta: p => r`$${compo(p.g, p.f)}$ es sobreyectiva`,
    L: p => [
      ['L1', r`Sea $${p.c}\in C$ arbitrario. Debemos hallar $${p.a}\in A$ con $(${compo(p.g, p.f)})(${p.a})=${p.c}$.`, 'd.sobreyectiva'],
      ['L2', r`Como $${p.g}$ es sobreyectiva, existe $${p.b}\in B$ con $${p.g}(${p.b})=${p.c}$.`, 'hip', ['L1']],
      ['L3', r`Como $${p.f}$ es sobreyectiva, existe $${p.a}\in A$ con ⟦h1⟧.`, 'hip', ['L2'], [H('h1', r`${p.f}(${p.a})=${p.b}`, [r`${p.f}(${p.a})=${p.c}`, r`${p.f}(${p.b})=${p.a}`, r`${p.g}(${p.a})=${p.b}`])]],
      ['L4', r`Entonces $(${compo(p.g, p.f)})(${p.a})=${p.g}(${p.f}(${p.a}))=${p.g}(${p.b})=${p.c}$.`, 'd.composicion', ['L2', 'L3']],
      ['L5', r`Como $${p.c}$ era arbitrario, $${compo(p.g, p.f)}$ es sobreyectiva. ∎`, 'd.sobreyectiva', ['L4']],
    ],
    dist: p => [
      [r`Tomamos $${p.a}\in A$ arbitrario y calculamos $${p.g}(${p.f}(${p.a}))$; como está definido, la composición es sobreyectiva.`, 'parte del dominio: eso no prueba que cada elemento de $C$ se alcance'],
      [r`Como $${p.g}$ es sobreyectiva, para cada $${p.b}\in B$ existe un único $${p.c}\in C$ con $${p.g}(${p.b})=${p.c}$.`, 'confunde sobreyectiva con función bien definida'],
    ],
    err: p => [
      ['L2', r`Como $${p.f}$ es sobreyectiva, existe $${p.b}\in B$ con $${p.g}(${p.b})=${p.c}$.`, 'no-justificado', 'El elemento $c$ está en $C$: se retrocede primero con $g$ (cuyo codominio es $C$).'],
      ['L4', r`Entonces $(${compo(p.g, p.f)})(${p.a})=${p.f}(${p.g}(${p.a}))=${p.c}$.`, 'error-de-calculo', 'La composición $g\\circ f$ aplica primero $f$ y después $g$.'],
      ['L5', r`Como $${p.c}=${p.g}(${p.b})$ para este $${p.c}$, $${compo(p.g, p.f)}$ es sobreyectiva. ∎`, 'caso-faltante', 'Hay que argumentar con un $c$ arbitrario; lo probado vale para todos.'],
    ],
    est: [['directa', 'Tomar un elemento arbitrario de $C$ y retroceder dos veces', true, 'Es la prueba estándar.'], ['contradiccion', 'Suponer que algún $c\\in C$ no es alcanzado y llegar a una contradicción', true, 'Funciona, con el mismo retroceso.'], ['inyectividad', 'Probar que $g\\circ f$ es inyectiva', false, 'Es otra propiedad.'], EST_EJEMPLO],
    crit: ['Tomé un elemento arbitrario del codominio', 'Retrocedí con $g$ y luego con $f$', 'Calculé $(g\\circ f)(a)$', 'Concluí la sobreyectividad'],
    pistas: p => ['Orientación: la sobreyectividad se prueba partiendo del codominio.', r`Idea clave: dado $${p.c}\in C$, busca primero un $${p.b}\in B$ y luego un $${p.a}\in A$.`, r`Primer paso: sea $${p.c}\in C$ arbitrario.`],
  });

  dem({
    id: 'dem.comp-biyectiva', teorema: 't.comp-biyectiva', nivel: '1.4', habilidades: ['1.4.composicion', '1.4.demostrar'], requiere: ['t.comp-inyectiva', 't.comp-sobreyectiva'], refsExtra: ['d.inyectiva', 'd.sobreyectiva'],
    param: rng => { const [f, g] = rng.pick(FN); return { f, g }; },
    enunciado: p => r`Sean $${p.f}:A\to B$ y $${p.g}:B\to C$ biyectivas. Demuestra que $${compo(p.g, p.f)}$ es biyectiva, usando los teoremas anteriores.`,
    hip: p => [r`$${p.f}$ y $${p.g}$ son biyectivas`, 'Puedes citar los teoremas de composición de inyectivas y de sobreyectivas'],
    meta: p => r`$${compo(p.g, p.f)}$ es biyectiva`,
    L: p => [
      ['L1', r`Como $${p.f}$ y $${p.g}$ son biyectivas, ambas son inyectivas y ambas son sobreyectivas.`, 'd.biyectiva'],
      ['L2', r`Como $${p.f}$ y $${p.g}$ son inyectivas, por el teorema de ⟦h1⟧, $${compo(p.g, p.f)}$ es inyectiva.`, 't.comp-inyectiva', ['L1'], [H('h1', 'la composición de inyectivas', ['la composición de inyectivas', 'la composición de sobreyectivas', 'la función inversa'], false)]],
      ['L3', r`Como $${p.f}$ y $${p.g}$ son sobreyectivas, por el teorema correspondiente, $${compo(p.g, p.f)}$ es sobreyectiva.`, 't.comp-sobreyectiva', ['L1']],
      ['L4', r`Por ser inyectiva y sobreyectiva, $${compo(p.g, p.f)}$ es biyectiva. ∎`, 'd.biyectiva', ['L2', 'L3']],
    ],
    dist: p => [
      [r`Como $${compo(p.g, p.f)}$ es biyectiva, $${p.f}$ y $${p.g}$ también lo son.`, 'es el recíproco y es falso en general'],
      [r`Como $${p.g}$ es sobreyectiva, $${compo(p.g, p.f)}$ es inyectiva.`, 'la sobreyectividad de $g$ no da inyectividad'],
    ],
    err: p => [
      ['L2', r`Como $${p.f}$ y $${p.g}$ son inyectivas, por el teorema de la composición de sobreyectivas, $${compo(p.g, p.f)}$ es inyectiva.`, 'no-justificado', 'Ese teorema habla de sobreyectividad; hay que citar el de inyectivas.'],
      ['L3', r`Como $${p.f}$ y $${p.g}$ son inyectivas, $${compo(p.g, p.f)}$ es sobreyectiva.`, 'conclusion-invalida', 'Inyectiva no da sobreyectiva; se usa la hipótesis de sobreyectividad.'],
      ['L4', r`Por ser inyectiva, $${compo(p.g, p.f)}$ es biyectiva. ∎`, 'caso-faltante', 'Falta la sobreyectividad.'],
    ],
    est: [['teoremas', 'Combinar los teoremas de composición de inyectivas y de sobreyectivas', true, 'Aprovecha lo ya ganado y es la más corta.'], ['definicion', 'Repetir desde cero la prueba de inyectividad y de sobreyectividad', true, 'Válida, pero larga.'], ['inversa', 'Construir la inversa $f^{-1}\\circ g^{-1}$ y verificarla', true, 'También funciona con el teorema de la inversa, si lo tienes en el Códice.'], EST_EJEMPLO],
    crit: ['Separé inyectiva y sobreyectiva', 'Cité el teorema de inyectivas', 'Cité el teorema de sobreyectivas', 'Concluí biyectiva'],
    pistas: p => ['Orientación: biyectiva = inyectiva + sobreyectiva; ya tienes un teorema para cada parte.', 'Idea clave: aplica cada teorema a las hipótesis correspondientes.', r`Primer paso: ¿qué sabes de $${p.f}$ y $${p.g}$ por ser biyectivas?`],
  });

  dem({
    id: 'dem.biyectiva-inversa', teorema: 't.biyectiva-inversa', nivel: '1.4', habilidades: ['1.4.inversa', '1.4.demostrar'], requiere: [], refsExtra: ['b.arbitrario', 'd.complemento'],
    param: rng => { const [f, g] = rng.pick([['f', 'g'], ['\\varphi', '\\psi']]); return { f, g, a: rng.pick(['a', 'x']), b: rng.pick(['b', 'y']) }; },
    enunciado: p => r`Sea $${p.f}:A\to B$. Demuestra que $${p.f}$ es biyectiva si y solo si existe $${p.g}:B\to A$ con $${p.g}\circ ${p.f}=\mathrm{id}_A$ y $${p.f}\circ ${p.g}=\mathrm{id}_B$.`,
    hip: p => [r`$${p.f}$ es una función de $A$ en $B$`],
    meta: p => r`$${p.f}$ biyectiva $\iff$ $${p.f}$ tiene una inversa $${p.g}$`,
    L: p => [
      ['L1', r`Probamos las dos implicaciones.`, 'b.doble-implicacion'],
      ['L2', r`(⇒) Sea $${p.f}$ biyectiva y $${p.b}\in B$. Por sobreyectividad existe $${p.a}\in A$ con $${p.f}(${p.a})=${p.b}$ y, por inyectividad, es único. Definimos $${p.g}(${p.b})=${p.a}$.`, 'd.biyectiva', ['L1']],
      ['L3', r`Por construcción, $${p.f}(${p.g}(${p.b}))=${p.b}$ para todo $${p.b}\in B$, es decir, $${p.f}\circ ${p.g}=\mathrm{id}_B$.`, 'd.composicion', ['L2']],
      ['L4', r`Para $${p.a}\in A$, $${p.g}(${p.f}(${p.a}))$ es el único $${p.a}'$ con $${p.f}(${p.a}')=${p.f}(${p.a})$; por ⟦h1⟧, $${p.a}'=${p.a}$. Luego $${p.g}\circ ${p.f}=\mathrm{id}_A$.`, 'd.inyectiva', ['L2'], [H('h1', 'inyectividad', ['inyectividad', 'sobreyectividad', 'reflexividad'], false)]],
      ['L5', r`(⇐) Supongamos que existe $${p.g}$ con $${p.g}\circ ${p.f}=\mathrm{id}_A$ y $${p.f}\circ ${p.g}=\mathrm{id}_B$. Inyectividad: si $${p.f}(x)=${p.f}(y)$, entonces $x=${p.g}(${p.f}(x))=${p.g}(${p.f}(y))=y$.`, 'd.inyectiva', ['L1']],
      ['L6', r`Sobreyectividad: dado $${p.b}\in B$, el elemento $${p.a}=${p.g}(${p.b})$ cumple $${p.f}(${p.a})=${p.f}(${p.g}(${p.b}))=${p.b}$.`, 'd.sobreyectiva', ['L1']],
      ['L7', r`Por L5 y L6, $${p.f}$ es biyectiva.`, 'd.biyectiva', ['L5', 'L6']],
      ['L8', r`Se cumplen ambas implicaciones, de modo que $${p.f}$ es biyectiva si y solo si tiene inversa. ∎`, 'b.doble-implicacion', ['L3', 'L4', 'L7']],
    ],
    dist: p => [
      [r`Como $${p.g}\circ ${p.f}=\mathrm{id}_A$, $${p.f}$ es biyectiva.`, 'solo una inversa por un lado da inyectividad'],
      [r`Como $${p.f}(${p.a})=${p.a}$, entonces $${p.g}(${p.f}(${p.a}))=${p.a}$.`, 'supone sin razón que $f$ deja fijo a cada elemento'],
    ],
    err: p => [
      ['L2', r`(⇒) Sea $${p.f}$ biyectiva y $${p.b}\in B$. Por inyectividad existe $${p.a}\in A$ con $${p.f}(${p.a})=${p.b}$. Definimos $${p.g}(${p.b})=${p.a}$.`, 'no-justificado', 'La existencia viene de la sobreyectividad; la inyectividad da la unicidad (para que $g$ esté bien definida).'],
      ['L5', r`(⇐) ... Inyectividad: si $${p.f}(x)=${p.f}(y)$, entonces $x=${p.f}(${p.g}(x))=${p.f}(${p.g}(y))=y$.`, 'error-de-calculo', 'La composición que vale la identidad en $A$ es $g\\circ f$, no $f\\circ g$.'],
      ['L6', r`Sobreyectividad: dado $${p.b}\in B$, el elemento $${p.a}=${p.f}(${p.b})$ cumple $${p.f}(${p.a})=${p.b}$.`, 'error-de-calculo', 'El elemento del dominio se obtiene con $g$ (de $B$ en $A$), no con $f$.'],
    ],
    est: [['dos-sentidos', 'Probar las dos implicaciones por separado', true, 'Es la forma estándar de una equivalencia.'], ['contradiccion', 'En cada sentido, suponer lo contrario y llegar a una contradicción', true, 'Posible, aunque más larga.'], ['ejemplo', 'Comprobarlo con $f(x)=2x$ en $\\mathbb{R}$', false, 'Un ejemplo no prueba el teorema general.'], ['finito', 'Suponer que $A$ y $B$ son finitos y contar elementos', false, 'El teorema vale para conjuntos cualesquiera.']],
    crit: ['Probé (⇒) construyendo $g$', 'Probé $f\\circ g=\\mathrm{id}_B$ y $g\\circ f=\\mathrm{id}_A$', 'Probé (⇐) con inyectividad y sobreyectividad', 'Concluí la equivalencia'],
    pistas: p => ['Orientación: hay que construir la inversa en un sentido y deducir biyectividad en el otro.', r`Idea clave: la biyectividad permite definir $${p.g}(${p.b})$ como el único $${p.a}$ con $${p.f}(${p.a})=${p.b}$.`, r`Primer paso: para (⇒), toma $${p.b}\in B$ y busca su preimagen.`],
  });

  dem({
    id: 'dem.factor-inyectiva', teorema: 't.factor-inyectiva', nivel: '1.4', habilidades: ['1.4.clasificar', '1.4.demostrar'], requiere: [], refsExtra: ['d.sobreyectiva', 'b.arbitrario', 'b.contradiccion'],
    param: rng => { const [f, g] = rng.pick(FN); return { f, g, x: rng.pick(['x', 'a']), y: rng.pick(['y', 'b']) }; },
    enunciado: p => r`Sean $${p.f}:A\to B$ y $${p.g}:B\to C$ tales que $${compo(p.g, p.f)}$ es inyectiva. Demuestra que $${p.f}$ es inyectiva.`,
    hip: p => [r`$${compo(p.g, p.f)}$ es inyectiva`],
    meta: p => r`$${p.f}$ es inyectiva`,
    L: p => [
      ['L1', r`Sean $${p.x},${p.y}\in A$ con $${p.f}(${p.x})=${p.f}(${p.y})$; debemos probar que $${p.x}=${p.y}$.`, 'd.inyectiva'],
      ['L2', r`Aplicando $${p.g}$ a ambos lados, $${p.g}(${p.f}(${p.x}))=${p.g}(${p.f}(${p.y}))$, es decir, ⟦h1⟧.`, 'd.composicion', ['L1'], [H('h1', r`(${compo(p.g, p.f)})(${p.x})=(${compo(p.g, p.f)})(${p.y})`, [r`(${compo(p.f, p.g)})(${p.x})=(${compo(p.f, p.g)})(${p.y})`, r`${p.g}(${p.x})=${p.g}(${p.y})`, r`${p.x}=${p.y}`])]],
      ['L3', r`Como $${compo(p.g, p.f)}$ es inyectiva, $${p.x}=${p.y}$.`, 'hip', ['L2']],
      ['L4', r`Luego $${p.f}$ es inyectiva. ∎`, 'd.inyectiva', ['L3']],
    ],
    dist: p => [
      [r`Como $${p.g}$ es inyectiva, de $${p.g}(${p.f}(${p.x}))=${p.g}(${p.f}(${p.y}))$ se sigue $${p.x}=${p.y}$.`, '$g$ no es hipótesis: solo lo es $g\\circ f$'],
      [r`Como $${compo(p.g, p.f)}$ es inyectiva, $${p.g}$ también lo es.`, 'falso en general: $g$ puede fallar fuera de la imagen de $f$'],
    ],
    err: p => [
      ['L2', r`Aplicando $${p.g}$ a ambos lados, $${p.f}(${p.g}(${p.x}))=${p.f}(${p.g}(${p.y}))$.`, 'error-de-calculo', 'Se aplica $g$ a $f(x)$ y $f(y)$: $g(f(x))=g(f(y))$.'],
      ['L3', r`Como $${p.f}$ es inyectiva, $${p.x}=${p.y}$.`, 'circular', 'Eso es justo lo que se quiere probar.'],
      ['L4', r`Luego $${p.g}$ es inyectiva. ∎`, 'conclusion-invalida', 'Lo que se pedía era la inyectividad de $f$.'],
    ],
    est: [['directa', 'Tomar $f(x)=f(y)$, aplicar $g$ y usar la inyectividad de la composición', true, 'Es la prueba estándar.'], ['contrapositiva', 'Suponer $f$ no inyectiva y probar que $g\\circ f$ no lo es', true, 'Es la contrapositiva y funciona igual.'], ['g-inyectiva', 'Probar primero que $g$ es inyectiva', false, 'No es cierto en general.'], EST_EJEMPLO],
    crit: ['Partí de $f(x)=f(y)$', 'Apliqué $g$ a ambos lados', 'Usé la hipótesis sobre $g\\circ f$', 'Concluí que $f$ es inyectiva'],
    pistas: p => ['Orientación: la inyectividad de $f$ se prueba desde $f(x)=f(y)$.', r`Idea clave: aplica $${p.g}$ para poder usar la hipótesis sobre $${compo(p.g, p.f)}$.`, r`Primer paso: sean $${p.x},${p.y}$ con $${p.f}(${p.x})=${p.f}(${p.y})$.`],
  });

  /* refs de funciones */
  const ref = (id, tipo, nombre) => R.ref({ id, tipo, nombre });
  ref('d.inyectiva', 'definicion', 'Inyectiva: f(x)=f(y) implica x=y'); ref('d.sobreyectiva', 'definicion', 'Sobreyectiva: para todo b del codominio existe a con f(a)=b');
  ref('d.biyectiva', 'definicion', 'Biyectiva: inyectiva y sobreyectiva'); ref('d.composicion', 'definicion', 'Composición: (g∘f)(x)=g(f(x))');

  R.nivel({
    id: '1.4', mundo: 1, titulo: 'Funciones', tema: 'Inyectiva, sobreyectiva, biyectiva, composición e inversa',
    habilidades: ['1.4.clasificar', '1.4.imagen-preimagen', '1.4.composicion', '1.4.inversa', '1.4.contar', '1.4.demostrar'],
    teoremas: ['t.comp-inyectiva', 't.comp-sobreyectiva', 't.comp-biyectiva', 't.biyectiva-inversa', 't.factor-inyectiva'],
    leccion: {
      intro: 'Una **función** $f:A\\to B$ asigna a cada elemento de $A$ exactamente un elemento de $B$. Tres propiedades la clasifican.',
      definiciones: [
        { nombre: 'Inyectiva', tex: '$f$ es **inyectiva** si $f(x)=f(y)$ implica $x=y$: no hay dos entradas distintas con la misma imagen.' },
        { nombre: 'Sobreyectiva', tex: '$f$ es **sobreyectiva** si para cada $b\\in B$ existe $a\\in A$ con $f(a)=b$: todo elemento del codominio es imagen de alguno. Lo que sea inyectiva o sobreyectiva depende también del dominio y del codominio elegidos.' },
        { nombre: 'Biyectiva, composición e inversa', tex: '$f$ es **biyectiva** si es inyectiva y sobreyectiva. $(g\\circ f)(x)=g(f(x))$. $f$ tiene inversa $g$ cuando $g\\circ f=\\mathrm{id}_A$ y $f\\circ g=\\mathrm{id}_B$.' },
        { nombre: 'Imagen y preimagen', tex: '$f(S)=\\{f(x):x\\in S\\}$ y $f^{-1}(T)=\\{x\\in A:f(x)\\in T\\}$. La preimagen existe aunque $f$ no tenga inversa.' },
      ],
      teorema: 't.biyectiva-inversa',
      ejemplo: { enunciado: 'Decide si $f:\\mathbb{R}\\to\\mathbb{R}$, $f(x)=x^2$, es inyectiva o sobreyectiva.', pasos: ['No es inyectiva: $f(1)=f(-1)=1$ con $1\\neq-1$ (un solo ejemplo basta).', 'No es sobreyectiva: $-1$ no es imagen de ningún real, porque $x^2\\ge 0$.', 'Si cambiamos el dominio a $[0,\\infty)$ y el codominio a $[0,\\infty)$, sí es biyectiva, con inversa $\\sqrt{x}$.'] },
    },
  });

  if (typeof module !== 'undefined') module.exports = AC;
})(globalThis.AC = globalThis.AC || {});
