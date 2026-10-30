/* Mundo 1, nivel 1.6 — Inducción simple y fuerte, buen orden. */
(function (AC) {
  const { R, r, H, T, dem, EST_EJEMPLO } = AC.w1c;
  const E = AC.expr;
  const par = n => (n < 0 ? '(' + n + ')' : String(n));
  const fact = n => (n <= 1 ? 1 : n * fact(n - 1));

  /* ---------- catálogo ---------- */
  const HB = (id, nombre) => R.habilidad({ id: '1.6.' + id, nombre, nivel: '1.6' });
  HB('sumas', 'Evaluar sumas'); HB('paso-inductivo', 'El paso inductivo'); HB('base', 'El caso base'); HB('divisibilidad', 'Inducción y divisibilidad'); HB('formula-cerrada', 'Fórmulas cerradas'); HB('demostrar', 'Demostrar por inducción');
  const TE = (id, titulo, enunciado, requiere, habilidades) => R.teorema({ id, titulo, nivel: '1.6', enunciado, requiere, habilidades });
  TE('t.suma-gauss', 'Suma de los primeros n números', r`Para todo $n\ge 1$: $1+2+\cdots+n=\dfrac{n(n+1)}{2}$.`, [], ['1.6.sumas', '1.6.paso-inductivo', '1.6.demostrar']);
  TE('t.serie-geometrica', 'Suma geométrica', r`Si $r\neq 1$ y $n\ge 0$: $1+r+r^2+\cdots+r^n=\dfrac{r^{n+1}-1}{r-1}$.`, [], ['1.6.sumas', '1.6.formula-cerrada', '1.6.demostrar']);
  TE('t.bernoulli', 'Desigualdad de Bernoulli', r`Si $x\ge -1$ y $n\ge 0$: $(1+x)^n\ge 1+nx$.`, [], ['1.6.base', '1.6.paso-inductivo', '1.6.demostrar']);
  TE('t.induccion-fuerte', 'Inducción fuerte', r`Si para todo $n$, «$P(k)$ para todo $k<n$» implica $P(n)$, entonces $P(n)$ vale para todo $n\in\mathbb{N}$.`, [], ['1.6.paso-inductivo', '1.6.demostrar']);
  TE('t.buen-orden', 'Principio del buen orden', r`Todo subconjunto no vacío de $\mathbb{N}$ tiene un mínimo.`, ['t.induccion-fuerte', 't.contrapositiva', 't.neg-cuantificadores'], ['1.6.demostrar']);

  const ref = (id, tipo, nombre) => R.ref({ id, tipo, nombre });
  ref('b.peano', 'propiedad-base', 'Principio de inducción: si P(0) (o P(1)) y P(n)⇒P(n+1), entonces P(n) para todo n'); ref('d.hip-induccion', 'hipotesis', 'Hipótesis de inducción');
  ref('d.minimo', 'definicion', 'Mínimo de S: un elemento m de S con m ≤ s para todo s de S');

  /* ---------- 1. evaluar una suma (entero) ---------- */
  R.generador({
    id: 'w1.n6.evaluar-suma', mundo: 1, nivel: '1.6', familia: 'aplicacion', habilidades: ['1.6.sumas'], dificultad: 1, autoexplicacion: null,
    generar(rng) {
      for (let i = 0; i < 100; i++) {
        const tipo = rng.pick(['lineal', 'cuadrados', 'impares', 'geometrica', 'cubos']), n = rng.int(5, 12);
        let res, enun, firmas;
        if (tipo === 'lineal') {
          const a = rng.int(1, 5), b = rng.int(-3, 5), f = k => a * k + b; let s = 0; for (let k = 1; k <= n; k++) s += f(k); res = s;
          enun = '$\\displaystyle\\sum_{k=1}^{' + n + '}(' + (a === 1 ? '' : a) + 'k' + (b === 0 ? '' : (b < 0 ? '-' : '+') + Math.abs(b)) + ')$';
          firmas = [['sin-ultimo', res - f(n), 'Te falta el último término ($k=' + n + '$).'], ['un-termino-de-mas', res + f(n + 1), 'Sumaste un término de más: la suma llega hasta $k=' + n + '$.'], ['sin-constante', a * n * (n + 1) / 2, 'Olvidaste que la constante se suma $' + n + '$ veces.']];
        } else if (tipo === 'cuadrados') { res = n * (n + 1) * (2 * n + 1) / 6; enun = '$\\displaystyle\\sum_{k=1}^{' + n + '}k^2$'; firmas = [['cuadrado-de-la-suma', (n * (n + 1) / 2) ** 2, 'La suma de cuadrados no es el cuadrado de la suma.'], ['sin-ultimo', res - n * n, 'Te falta el último término ($' + n + '^2$).'], ['solo-suma', n * (n + 1) / 2, 'Sumaste $k$ en vez de $k^2$.']]; }
        else if (tipo === 'impares') { res = n * n; enun = '$\\displaystyle\\sum_{k=1}^{' + n + '}(2k-1)$'; firmas = [['n-por-n-mas-1', n * (n + 1), 'Eso sería la suma de los **pares** $2+4+\\cdots+2n$.'], ['doble', 2 * n * n, 'Revisa: la suma de los primeros $n$ impares es $n^2$.']]; }
        else if (tipo === 'geometrica') { const q = rng.pick([2, 3]); res = (q ** (n + 1) - 1) / (q - 1); enun = '$\\displaystyle\\sum_{k=0}^{' + n + '}' + q + '^k$'; firmas = [['sin-restar', q ** (n + 1), 'La suma empieza en $k=0$; la fórmula es $(q^{n+1}-1)/(q-1)$, no $q^{n+1}$.'], ['uno-menos', (q ** n - 1) / (q - 1), 'Llevas un término de menos: la suma llega hasta $k=' + n + '$ (son $' + (n + 1) + '$ términos).']]; }
        else { res = (n * (n + 1) / 2) ** 2; enun = '$\\displaystyle\\sum_{k=1}^{' + n + '}k^3$'; firmas = [['solo-suma', n * (n + 1) / 2, 'Sumaste $k$ en vez de $k^3$.'], ['cubo-de-suma', (n * (n + 1) / 2) ** 3, 'La suma de cubos es el **cuadrado** de la suma de los primeros $n$ números.']]; }
        const texto = 'Calcula ' + enun + '.';
        if (new RegExp('(^|\\D)' + res + '(\\D|$)').test(texto.replace(/\$/g, ' '))) continue;
        return { variantKey: tipo + '|' + enun + n, enunciado: texto, entrada: { tipo: 'entero' }, verificador: { id: 'entero', args: { esperado: String(res) } }, solucionTexto: [String(res)],
          firmas: firmas.filter(f => f[1] !== res && f[1] > 0).map(f => ({ id: f[0], respuesta: String(f[1]), mensaje: f[2] })),
          pistas: ['Orientación: puedes sumar a mano, pero hay una fórmula cerrada.', 'Idea clave: $\\sum k=\\frac{n(n+1)}{2}$, $\\sum k^2=\\frac{n(n+1)(2n+1)}{6}$, $\\sum(2k-1)=n^2$, $\\sum_{k=0}^{n}q^k=\\frac{q^{n+1}-1}{q-1}$.', 'Primer paso: identifica qué tipo de suma es y cuántos términos tiene.'], explicacion: 'El valor es ' + res + '.' };
      }
      throw new Error('evaluar-suma: sin instancia');
    },
  });

  /* ---------- 2. el paso inductivo (expresión) ---------- */
  const FAM = [
    { suma: 'k', f: n => `${n}*(${n}+1)/2`, t: n => `${n}`, tex: 'k', rhs: '\\frac{n(n+1)}{2}' },
    { suma: '2k-1', f: n => `${n}^2`, t: n => `2*${n}-1`, tex: '(2k-1)', rhs: 'n^2' },
    { suma: 'k^2', f: n => `${n}*(${n}+1)*(2*${n}+1)/6`, t: n => `${n}^2`, tex: 'k^2', rhs: '\\frac{n(n+1)(2n+1)}{6}' },
    { suma: 'k^3', f: n => `${n}^2*(${n}+1)^2/4`, t: n => `${n}^3`, tex: 'k^3', rhs: '\\frac{n^2(n+1)^2}{4}' },
    { suma: 'k(k+1)', f: n => `${n}*(${n}+1)*(${n}+2)/3`, t: n => `${n}*(${n}+1)`, tex: 'k(k+1)', rhs: '\\frac{n(n+1)(n+2)}{3}' },
    { suma: '2k', f: n => `${n}*(${n}+1)`, t: n => `2*${n}`, tex: '2k', rhs: 'n(n+1)' },
    { suma: '3k-1', f: n => `${n}*(3*${n}+1)/2`, t: n => `3*${n}-1`, tex: '(3k-1)', rhs: '\\frac{n(3n+1)}{2}' },
    { suma: '\\frac{1}{k(k+1)}', f: n => `${n}/(${n}+1)`, t: n => `1/(${n}*(${n}+1))`, tex: '\\frac{1}{k(k+1)}', rhs: '\\frac{n}{n+1}' },
  ];
  R.generador({
    id: 'w1.n6.paso-inductivo', mundo: 1, nivel: '1.6', familia: 'aplicacion', habilidades: ['1.6.paso-inductivo'], dificultad: 3, autoexplicacion: 'paso-inductivo-metodo',
    generar(rng) {
      let F = rng.pick(FAM); const modo = rng.pick(['siguiente', 'suma']);
      if (rng.chance(0.5)) { // familia parametrizada: suma de una sucesión lineal a k + b
        const a = rng.int(2, 6), b = rng.int(-3, 5), lt = (a === 1 ? '' : a) + 'k' + (b === 0 ? '' : (b < 0 ? '-' : '+') + Math.abs(b));
        F = { suma: lt, f: n => `${a}*${n}*(${n}+1)/2+${par(b)}*${n}`, t: n => `${a}*${n}+${par(b)}`, tex: '(' + lt + ')', rhs: '\\frac{' + a + 'n(n+1)}{2}' + (b === 0 ? '' : (b < 0 ? '-' : '+') + Math.abs(b) + 'n') };
      }
      const sig = F.f('(n+1)'), ok = sig;
      const firmas = [['sin-termino-nuevo', F.f('n'), 'Olvidaste que al pasar de $n$ a $n+1$ se **suma el término $(n+1)$-ésimo** y la fórmula cambia.'], ['termino-viejo', `${F.f('n')}+${F.t('n')}`, 'Sumaste el término de $n$, no el de $n+1$: el nuevo sumando es $a_{n+1}$.'], ['n-sin-cambiar', F.f('n') + '+1', 'El término nuevo no es $1$: es el sumando general evaluado en $n+1$.']];
      const fs = firmas.filter(s => { try { return !E.equiv(s[1], ok); } catch (e) { return false; } }).map(s => ({ id: s[0], respuesta: s[1], mensaje: s[2] }));
      return {
        variantKey: F.suma + '|' + modo,
        enunciado: modo === 'siguiente'
          ? 'Para probar por inducción que $\\displaystyle\\sum_{k=1}^{n}' + F.tex + '=' + F.rhs + '$, hay que mostrar que al pasar a $n+1$ el lado derecho vale lo que se obtiene al reemplazar $n$ por $n+1$. Escribe esa expresión en $n$ (sin simplificar si quieres).'
          : 'Para probar por inducción que $\\displaystyle\\sum_{k=1}^{n}' + F.tex + '=' + F.rhs + '$ se usa la hipótesis y se **suma el término $(n+1)$-ésimo** al lado derecho. Escribe en $n$ el resultado $' + F.rhs + '+a_{n+1}$ (con $a_{n+1}$ el sumando evaluado en $n+1$).',
        entrada: { tipo: 'expr', vars: ['n'] }, verificador: { id: 'equivalente-expr', args: { f: ok } }, solucionExpr: ok, solucionTexto: [], firmas: fs,
        pistas: ['Orientación: $S(n+1)=S(n)+a_{n+1}$, y debe coincidir con la fórmula evaluada en $n+1$.', 'Idea clave: el sumando general se evalúa en $k=n+1$; la fórmula cerrada se evalúa en $n+1$.', 'Primer paso: escribe la fórmula sustituyendo $n$ por $(n+1)$.'],
        explicacion: 'La expresión pedida es $' + E.tex(E.parse(ok)) + '$.',
      };
    },
  });
  R.banco('paso-inductivo-metodo', { pregunta: '¿Qué hace el paso inductivo?', opciones: [
    { texto: 'Supone la fórmula para $n$ (hipótesis de inducción) y deduce que vale para $n+1$.', correcta: true },
    { texto: 'Prueba la fórmula para $n+1$ sin usar nada de lo anterior.', correcta: false },
    { texto: 'Comprueba la fórmula para muchos valores de $n$ y generaliza.', correcta: false },
    { texto: 'Supone la fórmula para todo $n$, incluido $n+1$, y la comprueba.', correcta: false },
  ] });

  /* ---------- 3. el caso base: menor n que cumple una desigualdad (entero) ---------- */
  R.generador({
    id: 'w1.n6.base-menor', mundo: 1, nivel: '1.6', familia: 'aplicacion', habilidades: ['1.6.base'], dificultad: 2, autoexplicacion: null,
    generar(rng) {
      for (let i = 0; i < 200; i++) {
        const kind = rng.pick(['pot-cuad', 'fact-pot', 'pot-lin', 'pot-cub']);
        let hold, tex;
        if (kind === 'pot-cuad') { const a = rng.pick([2, 3]), c = rng.pick([1, 2, 3, 5]); hold = n => a ** n > c * n * n; tex = a + '^n>' + (c === 1 ? '' : c) + 'n^2'; }
        else if (kind === 'fact-pot') { const a = rng.pick([2, 3, 4]); hold = n => fact(n) > a ** n; tex = 'n!>' + a + '^n'; }
        else if (kind === 'pot-lin') { const a = rng.pick([2, 3]), c = rng.pick([5, 10, 20, 50]); hold = n => a ** n > c * n; tex = a + '^n>' + c + 'n'; }
        else { const a = rng.pick([2, 3]), c = rng.pick([1, 2, 4]); hold = n => a ** n > c * n ** 3; tex = a + '^n>' + (c === 1 ? '' : c) + 'n^3'; }
        let n0 = null; for (let n = 1; n <= 60; n++) if (hold(n)) { if (n0 === null) n0 = n; } else if (n0 !== null) { n0 = null; break; }
        if (n0 === null) { // debe cumplirse siempre desde algún punto
          let ok = false; for (let n = 1; n <= 60; n++) if (hold(n)) { let todos = true; for (let m = n; m <= 60; m++) if (!hold(m)) todos = false; if (todos) { n0 = n; ok = true; break; } }
          if (!ok) continue;
        }
        if (n0 < 2 || n0 > 20) continue;
        const enun = 'Se quiere probar por inducción que $' + tex + '$ para todo $n\\ge n_0$. ¿Cuál es el menor $n_0\\ge 1$ a partir del cual la desigualdad se cumple siempre (y que sirve de caso base)?';
        if (new RegExp('(^|\\D)' + n0 + '(\\D|$)').test(enun.replace(/\$/g, ' ').replace(tex, ' '))) continue;
        if (new RegExp('(^|\\D)' + n0 + '(\\D|$)').test(tex)) continue;
        const firmas = [['uno-menos', n0 - 1, 'Con $n=' + (n0 - 1) + '$ la desigualdad **no** se cumple: compruébalo.'], ['uno-mas', n0 + 1, 'Ya se cumple con $n=' + n0 + '$: ese es el primero.']];
        return { variantKey: tex, enunciado: enun, entrada: { tipo: 'entero' }, verificador: { id: 'entero', args: { esperado: String(n0) } }, solucionTexto: [String(n0)],
          firmas: firmas.filter(f => f[1] >= 1).map(f => ({ id: f[0], respuesta: String(f[1]), mensaje: f[2] })),
          pistas: ['Orientación: prueba valores pequeños de $n$ uno por uno.', 'Idea clave: anota para cada $n$ si la desigualdad se cumple; busca desde cuándo no vuelve a fallar.', 'Primer paso: evalúa ambos lados con $n=1,2,3,\\dots$'],
          explicacion: 'El primero que la cumple, y desde el que ya no falla, es $n_0=' + n0 + '$.' };
      }
      throw new Error('base-menor: sin instancia');
    },
  });

  /* ---------- 4. divisibilidad inductiva (entero) ---------- */
  R.generador({
    id: 'w1.n6.divisibilidad-inductiva', mundo: 1, nivel: '1.6', familia: 'aplicacion', habilidades: ['1.6.divisibilidad', '1.6.paso-inductivo'], dificultad: 3, autoexplicacion: null,
    generar(rng) {
      for (let i = 0; i < 100; i++) {
        const tipo = rng.pick(['uno', 'dos']), a = rng.int(2, 11), b = rng.int(a + 1, 12);
        let enun, res, firmas;
        if (tipo === 'uno') {
          res = a - 1;
          enun = 'Para probar por inducción que $' + a + '^n-1$ es divisible por un cierto entero fijo $d>1$, el paso inductivo escribe $' + a + '^{n+1}-1=' + a + '\\,(' + a + '^n-1)+c$. ¿Cuánto vale $c$?';
          firmas = [['a', a, 'Se descompone $a^{n+1}-1=a(a^n-1)+(a-1)$: el resto es $a-1$, no $a$.'], ['uno', 1, 'Al restar $a\\cdot(a^n-1)$ de $a^{n+1}-1$ queda $a-1$, no $1$.'], ['a-mas-uno', a + 1, 'El signo es el contrario: $a^{n+1}-1-a(a^n-1)=a-1$.']];
        } else {
          res = b - a;
          enun = 'Para probar por inducción que $' + b + '^n-' + a + '^n$ es divisible por un cierto entero fijo, el paso inductivo escribe $' + b + '^{n+1}-' + a + '^{n+1}=' + b + '\\,(' + b + '^n-' + a + '^n)+c\\cdot ' + a + '^n$. ¿Cuánto vale $c$?';
          firmas = [['a-menos-b', a - b, 'El signo está al revés: $b^{n+1}-a^{n+1}-b(b^n-a^n)=(b-a)a^n$.'], ['b', b, 'Al restar $b(b^n-a^n)$ queda $ba^n-a^{n+1}=(b-a)a^n$.'], ['a', a, 'Eso es la base de la potencia que sobra, no el coeficiente.']];
        }
        if (res < 2) continue;
        if (new RegExp('(^|\\D)' + res + '(\\D|$)').test(enun.replace(/\$/g, ' '))) continue;
        return { variantKey: tipo + a + '-' + b, enunciado: enun, entrada: { tipo: 'entero' }, verificador: { id: 'entero', args: { esperado: String(res) } }, solucionTexto: [String(res)],
          firmas: firmas.filter(f => f[1] !== res).map(f => ({ id: f[0], respuesta: String(f[1]), mensaje: f[2] })),
          pistas: ['Orientación: se usa la hipótesis de inducción en la forma $a^n-1=d\\cdot m$.', 'Idea clave: se factoriza $a^{n+1}$ como $a\\cdot a^n$ y se completa con un término que sea múltiplo de $d$.', 'Primer paso: desarrolla $a(a^n-1)$ y compara con $a^{n+1}-1$.'],
          explicacion: 'Se obtiene $c=' + res + '$.' };
      }
      throw new Error('divisibilidad-inductiva: sin instancia');
    },
  });

  /* ---------- 5. fórmula cerrada (expresión) ---------- */
  R.generador({
    id: 'w1.n6.formula-cerrada', mundo: 1, nivel: '1.6', familia: 'aplicacion', habilidades: ['1.6.formula-cerrada', '1.6.sumas'], dificultad: 3, autoexplicacion: null,
    generar(rng) {
      for (let i = 0; i < 100; i++) {
        const tipo = rng.pick(['lineal', 'lineal', 'prod']), a = rng.int(1, 6), b = rng.int(-4, 6);
        let ok, enun, firmas;
        if (tipo === 'lineal') {
          ok = `${a}*n*(n+1)/2+${par(b)}*n`;
          enun = 'Halla una fórmula en $n$ para $S(n)=\\displaystyle\\sum_{k=1}^{n}(' + (a === 1 ? '' : a) + 'k' + (b === 0 ? '' : (b < 0 ? '-' : '+') + Math.abs(b)) + ')$.';
          firmas = [['sin-dividir', `${a}*n*(n+1)+${par(b)}*n`, 'Falta dividir entre $2$: $\\sum k=n(n+1)/2$.'], ['constante-una-vez', `${a}*n*(n+1)/2+${par(b)}`, 'La constante $' + b + '$ se suma en cada uno de los $n$ términos.'], ['n-en-vez-de-n+1', `${a}*n*n/2+${par(b)}*n`, 'La suma $1+\\cdots+n$ es $n(n+1)/2$, no $n^2/2$.']];
        } else {
          ok = `n*(n+1)*(2*n+1)/6+${a}*n*(n+1)/2`;
          enun = 'Halla una fórmula en $n$ para $S(n)=\\displaystyle\\sum_{k=1}^{n}k(k+' + a + ')$.';
          firmas = [['solo-cuadrados', 'n*(n+1)*(2*n+1)/6', 'Falta la parte $' + a + 'k$: $k(k+a)=k^2+ak$.'], ['sin-dividir', `n*(n+1)*(2*n+1)/6+${a}*n*(n+1)`, 'Falta dividir entre $2$ en $\\sum k$.'], ['sin-sexto', `n*(n+1)*(2*n+1)+${a}*n*(n+1)/2`, 'Falta dividir entre $6$ en $\\sum k^2$.']];
        }
        const fs = firmas.filter(s => { try { return !E.equiv(s[1], ok); } catch (e) { return false; } }).map(s => ({ id: s[0], respuesta: s[1], mensaje: s[2] }));
        if (!fs.length) continue;
        return { variantKey: tipo + a + ',' + b, enunciado: enun, entrada: { tipo: 'expr', vars: ['n'] }, verificador: { id: 'equivalente-expr', args: { f: ok } }, solucionExpr: ok, solucionTexto: [], firmas: fs,
          pistas: ['Orientación: separa la suma en sumas conocidas.', 'Idea clave: $\\sum k=\\frac{n(n+1)}{2}$, $\\sum k^2=\\frac{n(n+1)(2n+1)}{6}$ y $\\sum c=cn$.', 'Primer paso: reparte el sumando como suma de potencias de $k$ con coeficientes.'],
          explicacion: 'Una forma es $S(n)=' + E.tex(E.parse(ok)) + '$.' };
      }
      throw new Error('formula-cerrada: sin instancia');
    },
  });

  /* ---------- demostraciones ---------- */
  const IDX = [['n', 'k'], ['m', 'i'], ['n', 'j']];
  const sumTo = (p, e) => r`\sum_{${p.k}=1}^{${e}}`;
  dem({
    id: 'dem.suma-gauss', teorema: 't.suma-gauss', nivel: '1.6', habilidades: ['1.6.sumas', '1.6.paso-inductivo', '1.6.demostrar'], requiere: [], refsExtra: ['b.contradiccion', 'd.minimo'],
    param: rng => { const [n, k] = rng.pick(IDX); return { n, k }; },
    enunciado: p => r`Demuestra por inducción que para todo $${p.n}\ge 1$: $1+2+\cdots+${p.n}=\dfrac{${p.n}(${p.n}+1)}{2}$.`,
    hip: p => [r`$${p.n}$ recorre los enteros $\ge 1$`, 'Puedes usar el principio de inducción'],
    meta: p => r`$P(${p.n}):\ 1+2+\cdots+${p.n}=\dfrac{${p.n}(${p.n}+1)}{2}$ para todo $${p.n}\ge 1$`,
    L: p => [
      ['L1', r`Sea $P(${p.n})$ la afirmación $1+2+\cdots+${p.n}=\frac{${p.n}(${p.n}+1)}{2}$. Probaremos $P(${p.n})$ para todo $${p.n}\ge 1$ por inducción.`, 'b.peano'],
      ['L2', r`Base: para $${p.n}=1$, el lado izquierdo es $1$ y el derecho es $\frac{1\cdot 2}{2}=1$; $P(1)$ se cumple.`, 'b.cuerpo-algebra', ['L1']],
      ['L3', r`Hipótesis de inducción: supongamos $P(${p.n})$ para algún $${p.n}\ge 1$, es decir, $1+\cdots+${p.n}=\frac{${p.n}(${p.n}+1)}{2}$.`, 'hip', ['L1']],
      ['L4', r`Paso: $1+\cdots+${p.n}+(${p.n}+1)=\frac{${p.n}(${p.n}+1)}{2}+(${p.n}+1)$, por la ⟦h1⟧.`, 'd.hip-induccion', ['L3'], [H('h1', 'hipótesis de inducción', ['hipótesis de inducción', 'caso base', 'definición de suma'], false)]],
      ['L5', r`Luego $\frac{${p.n}(${p.n}+1)}{2}+(${p.n}+1)=\frac{${p.n}(${p.n}+1)+2(${p.n}+1)}{2}=$ ⟦h2⟧.`, 'b.cuerpo-algebra', ['L4'], [H('h2', r`\frac{(${p.n}+1)(${p.n}+2)}{2}`, [r`\frac{(${p.n}+1)(${p.n}+1)}{2}`, r`\frac{${p.n}(${p.n}+2)}{2}`, r`\frac{(${p.n}+1)(${p.n}+2)}{4}`])]],
      ['L6', r`Esto es $P(${p.n}+1)$. Por el principio de inducción, $P(${p.n})$ vale para todo $${p.n}\ge 1$. ∎`, 'b.peano', ['L2', 'L5']],
    ],
    dist: p => [
      [r`Comprobamos $P(${p.n})$ para $${p.n}=1,2,3,4,5$; como se cumple en todos, vale siempre.`, 'comprobar casos no prueba un enunciado para todo $n$'],
      [r`Suponemos $P(${p.n}+1)$ y la comprobamos.`, 'la hipótesis es $P(n)$, no la propiedad para $n+1$ (eso es lo que se quiere probar)'],
    ],
    err: p => [
      ['L2', r`Base: para $${p.n}=1$, el lado izquierdo es $1$ y el derecho es $\frac{1\cdot 1}{2}=\frac12$; no coinciden.`, 'error-de-calculo', 'El lado derecho para $n=1$ es $\\frac{1\\cdot 2}{2}=1$.'],
      ['L5', r`Luego $\frac{${p.n}(${p.n}+1)}{2}+(${p.n}+1)=\frac{${p.n}(${p.n}+1)+(${p.n}+1)}{2}=\frac{(${p.n}+1)^2}{2}$.`, 'error-de-calculo', 'Al pasar el sumando $(n+1)$ al denominador común 2 se multiplica por 2: $n(n+1)+2(n+1)$.'],
      ['L6', r`Esto es $P(${p.n})$ otra vez; con esto basta. ∎`, 'circular', 'Hay que obtener $P(n+1)$, no repetir $P(n)$.'],
    ],
    est: [['induccion', 'Inducción simple sobre $n$', true, 'Es el método natural: cada suma se apoya en la anterior.'], ['pares', 'Sumar $1+n$, $2+(n-1)$, … emparejando extremos (Gauss)', true, 'Prueba directa válida para $n$ par; para $n$ impar hay que tratar el término central. No es inducción, pero sirve.'], ['ejemplos', 'Comprobar la fórmula para varios $n$', false, 'Los ejemplos no cubren todos los $n$.'], ['absurdo', 'Suponer que existe un contraejemplo y usar el buen orden', true, 'Funciona si se dispone del buen orden (se ve más adelante en este nivel).']],
    crit: ['Enuncié $P(n)$', 'Probé el caso base', 'Usé la hipótesis de inducción en el paso', 'Obtuve $P(n+1)$ y concluí'],
    pistas: p => ['Orientación: la fórmula debe probarse para todo $n$; la inducción tiene dos partes.', r`Idea clave: en el paso, la suma hasta $${p.n}+1$ es la suma hasta $${p.n}$ más el término $(${p.n}+1)$.`, r`Primer paso: comprueba $${p.n}=1$.`],
  });

  dem({
    id: 'dem.serie-geometrica', teorema: 't.serie-geometrica', nivel: '1.6', habilidades: ['1.6.sumas', '1.6.formula-cerrada', '1.6.demostrar'], requiere: [], refsExtra: ['b.contradiccion'],
    param: rng => { const [n] = rng.pick(IDX); return { n, q: rng.pick(['r', 'q', 'a']) }; },
    enunciado: p => r`Demuestra por inducción que si $${p.q}\neq 1$, para todo $${p.n}\ge 0$: $1+${p.q}+\cdots+${p.q}^{${p.n}}=\dfrac{${p.q}^{${p.n}+1}-1}{${p.q}-1}$.`,
    hip: p => [r`$${p.q}$ es un número con $${p.q}\neq 1$`, r`$${p.n}$ recorre los enteros $\ge 0$`],
    meta: p => r`$P(${p.n}):\ \sum_{i=0}^{${p.n}}${p.q}^i=\frac{${p.q}^{${p.n}+1}-1}{${p.q}-1}$`,
    L: p => [
      ['L1', r`Sea $P(${p.n})$ la igualdad del enunciado. La probamos para todo $${p.n}\ge 0$ por inducción.`, 'b.peano'],
      ['L2', r`Base: para $${p.n}=0$, el lado izquierdo es $1$ y el derecho es $\frac{${p.q}-1}{${p.q}-1}=1$ (pues $${p.q}\neq 1$); $P(0)$ se cumple.`, 'b.cuerpo-algebra', ['L1']],
      ['L3', r`Hipótesis de inducción: supongamos $P(${p.n})$ para algún $${p.n}\ge 0$.`, 'hip', ['L1']],
      ['L4', r`Paso: $1+\cdots+${p.q}^{${p.n}}+${p.q}^{${p.n}+1}=\frac{${p.q}^{${p.n}+1}-1}{${p.q}-1}+${p.q}^{${p.n}+1}$, por la hipótesis de inducción.`, 'd.hip-induccion', ['L3']],
      ['L5', r`Con denominador común, $\frac{${p.q}^{${p.n}+1}-1}{${p.q}-1}+${p.q}^{${p.n}+1}=\frac{${p.q}^{${p.n}+1}-1+${p.q}^{${p.n}+2}-${p.q}^{${p.n}+1}}{${p.q}-1}=$ ⟦h1⟧.`, 'b.cuerpo-algebra', ['L4'], [H('h1', r`\frac{${p.q}^{${p.n}+2}-1}{${p.q}-1}`, [r`\frac{${p.q}^{${p.n}+1}-1}{${p.q}-1}`, r`\frac{${p.q}^{${p.n}+2}+1}{${p.q}-1}`, r`\frac{${p.q}^{${p.n}+2}-1}{${p.q}+1}`])]],
      ['L6', r`Esto es $P(${p.n}+1)$. Por inducción, la fórmula vale para todo $${p.n}\ge 0$. ∎`, 'b.peano', ['L2', 'L5']],
    ],
    dist: p => [
      [r`Si $${p.q}=1$ la fórmula también vale: el lado derecho es $\frac{1-1}{1-1}=1$.`, 'divide entre cero: la fórmula exige $r\\neq 1$'],
      [r`Comprobamos la fórmula para $${p.q}=2$ y $${p.n}=0,1,2,3$; vale siempre.`, 'comprobar casos no prueba el enunciado general'],
    ],
    err: p => [
      ['L2', r`Base: para $${p.n}=0$, el lado izquierdo es $0$ y el derecho también; $P(0)$ se cumple.`, 'error-de-calculo', 'El lado izquierdo para $n=0$ es $1$ (la suma tiene el término $r^0=1$).'],
      ['L5', r`Con denominador común, el numerador queda $${p.q}^{${p.n}+1}-1+${p.q}^{${p.n}+1}=2${p.q}^{${p.n}+1}-1$.`, 'error-de-calculo', 'El término añadido $r^{n+1}$ hay que escribirlo sobre $r-1$: $r^{n+1}(r-1)=r^{n+2}-r^{n+1}$.'],
      ['L4', r`Paso: $1+\cdots+${p.q}^{${p.n}}+${p.q}^{${p.n}+1}=\frac{${p.q}^{${p.n}+1}-1}{${p.q}-1}+${p.q}^{${p.n}}$.`, 'error-de-calculo', 'El término nuevo es $r^{n+1}$, no $r^n$.'],
    ],
    est: [['induccion', 'Inducción simple sobre $n$', true, 'Cada suma es la anterior más un término.'], ['telescopica', 'Multiplicar la suma por $(r-1)$ y ver que se cancela (suma telescópica)', true, 'Prueba directa válida: $(r-1)\\sum r^i=r^{n+1}-1$.'], ['ejemplos', 'Comprobar la fórmula con valores concretos de $r$ y $n$', false, 'Los ejemplos no prueban el caso general.'], ['absurdo', 'Suponer que la fórmula falla para algún $n$ y tomar el menor', true, 'Posible con el buen orden, pero más largo.']],
    crit: ['Probé el caso base con $r\\neq 1$', 'Usé la hipótesis de inducción', 'Sumé el término $r^{n+1}$ con denominador común', 'Concluí $P(n+1)$'],
    pistas: p => ['Orientación: en el paso aparece un solo término nuevo.', r`Idea clave: el término nuevo es $${p.q}^{${p.n}+1}$; hay que escribirlo con denominador $${p.q}-1$.`, r`Primer paso: verifica $${p.n}=0$.`],
  });

  dem({
    id: 'dem.bernoulli', teorema: 't.bernoulli', nivel: '1.6', habilidades: ['1.6.base', '1.6.paso-inductivo', '1.6.demostrar'], requiere: [], refsExtra: ['b.contradiccion', 'b.arbitrario'],
    param: rng => { const [n] = rng.pick(IDX); return { n, x: rng.pick(['x', 'h', 't']) }; },
    enunciado: p => r`Demuestra por inducción que si $${p.x}\ge -1$, entonces $(1+${p.x})^{${p.n}}\ge 1+${p.n}${p.x}$ para todo $${p.n}\ge 0$.`,
    hip: p => [r`$${p.x}\ge -1$ es un número real fijo`, r`$${p.n}$ recorre los enteros $\ge 0$`],
    meta: p => r`$P(${p.n}):\ (1+${p.x})^{${p.n}}\ge 1+${p.n}${p.x}$`,
    L: p => [
      ['L1', r`Sea $P(${p.n})$ la desigualdad del enunciado, con $${p.x}\ge -1$ fijo. La probamos para todo $${p.n}\ge 0$ por inducción.`, 'b.peano'],
      ['L2', r`Base: para $${p.n}=0$, $(1+${p.x})^0=1\ge 1+0\cdot ${p.x}=1$; $P(0)$ se cumple.`, 'b.cuerpo-algebra', ['L1']],
      ['L3', r`Hipótesis de inducción: supongamos $(1+${p.x})^{${p.n}}\ge 1+${p.n}${p.x}$ para algún $${p.n}\ge 0$.`, 'hip', ['L1']],
      ['L4', r`Como $${p.x}\ge -1$, se tiene $1+${p.x}\ge 0$. Multiplicando la hipótesis por $1+${p.x}$ (que no cambia el sentido): $(1+${p.x})^{${p.n}+1}\ge(1+${p.x})(1+${p.n}${p.x})$.`, 'b.orden', ['L3']],
      ['L5', r`Desarrollando, $(1+${p.x})(1+${p.n}${p.x})=1+(${p.n}+1)${p.x}+${p.n}${p.x}^2$.`, 'b.cuerpo-algebra', ['L1']],
      ['L6', r`Como $${p.n}${p.x}^2\ge 0$, resulta $1+(${p.n}+1)${p.x}+${p.n}${p.x}^2\ge$ ⟦h1⟧.`, 'b.orden', ['L5'], [H('h1', r`1+(${p.n}+1)${p.x}`, [r`1+${p.n}${p.x}`, r`1+(${p.n}-1)${p.x}`, r`(1+${p.x})^{${p.n}}`])]],
      ['L7', r`Encadenando L4, L5 y L6: $(1+${p.x})^{${p.n}+1}\ge 1+(${p.n}+1)${p.x}$, es decir, $P(${p.n}+1)$. Por inducción vale para todo $${p.n}\ge 0$. ∎`, 'b.peano', ['L2', 'L4', 'L5', 'L6']],
    ],
    dist: p => [
      [r`Si $${p.x}<-1$ el resultado también vale; la prueba es la misma.`, 'con $x<-1$ el factor $1+x$ es negativo y cambiaría el sentido de la desigualdad'],
      [r`Multiplicamos la hipótesis por $1+${p.x}$ sin comprobar su signo.`, 'multiplicar una desigualdad exige conocer el signo del factor'],
    ],
    err: p => [
      ['L4', r`Como $${p.x}\ge -1$, se tiene $1+${p.x}\ge 0$. Multiplicando la hipótesis por $1+${p.x}$ cambia el sentido: $(1+${p.x})^{${p.n}+1}\le(1+${p.x})(1+${p.n}${p.x})$.`, 'conclusion-invalida', 'Multiplicar por un factor no negativo conserva el sentido de la desigualdad.'],
      ['L5', r`Desarrollando, $(1+${p.x})(1+${p.n}${p.x})=1+${p.n}${p.x}+${p.x}$.`, 'error-de-calculo', 'Falta el término $nx^2$ del producto de $x$ por $nx$.'],
      ['L6', r`Como $${p.n}${p.x}^2\ge 0$, resulta $1+(${p.n}+1)${p.x}+${p.n}${p.x}^2\le 1+(${p.n}+1)${p.x}$.`, 'conclusion-invalida', 'Al sumar un término $\\ge 0$ el valor aumenta o se queda igual: es $\\ge$.']],
    est: [['induccion', 'Inducción simple sobre $n$', true, 'La desigualdad para $n+1$ sale de la de $n$.'], ['binomio', 'Desarrollar el binomio de Newton y acotar', false, 'Con $x\\ge -1$ los demás términos pueden ser negativos: no sirve sin más.'], ['ejemplos', 'Comprobar con valores concretos de $x$ y $n$', false, 'Los ejemplos no prueban el caso general.'], ['absurdo', 'Suponer que falla para algún $n$ y tomar el menor', true, 'Posible con el buen orden y la misma multiplicación.']],
    crit: ['Probé el caso base', 'Justifiqué que $1+x\\ge 0$ antes de multiplicar', 'Desarrollé el producto', 'Acoté con $nx^2\\ge 0$ y concluí'],
    pistas: p => ['Orientación: en el paso hay que multiplicar la hipótesis por $1+x$; ¿por qué se puede?', r`Idea clave: $1+${p.x}\ge 0$ porque $${p.x}\ge -1$, y sobra un término $${p.n}${p.x}^2\ge 0$.`, r`Primer paso: comprueba $${p.n}=0$.`],
  });

  dem({
    id: 'dem.induccion-fuerte', teorema: 't.induccion-fuerte', nivel: '1.6', habilidades: ['1.6.paso-inductivo', '1.6.demostrar'], requiere: [], refsExtra: ['b.contradiccion', 'd.minimo'],
    param: rng => ({ n: rng.pick(['n', 'm']), P: rng.pick(['P', 'A']) }),
    enunciado: p => r`Demuestra la inducción fuerte a partir de la simple: si para todo $${p.n}$, «$${p.P}(k)$ para todo $k<${p.n}$» implica $${p.P}(${p.n})$, entonces $${p.P}(${p.n})$ vale para todo $${p.n}\in\mathbb{N}$.`,
    hip: p => [r`para todo $${p.n}\in\mathbb{N}$: si $${p.P}(k)$ se cumple para todo $k<${p.n}$, entonces se cumple $${p.P}(${p.n})$`, 'Puedes usar la inducción simple'],
    meta: p => r`$${p.P}(${p.n})$ para todo $${p.n}\in\mathbb{N}$`,
    L: p => [
      ['L1', r`Suponemos la hipótesis fuerte: para todo $${p.n}$, si $${p.P}(k)$ vale para todo $k<${p.n}$, entonces vale $${p.P}(${p.n})$.`, 'hip'],
      ['L2', r`Sea $Q(${p.n})$ la afirmación «$${p.P}(k)$ se cumple para todo $k\le ${p.n}$». Probaremos $Q(${p.n})$ para todo $${p.n}$ por inducción simple.`, 'b.peano', ['L1']],
      ['L3', r`Base: para $${p.n}=0$ no hay $k<0$, así que la hipótesis fuerte da $${p.P}(0)$; luego $Q(0)$ se cumple.`, 'hip', ['L1']],
      ['L4', r`Paso: supongamos $Q(${p.n})$. Entonces $${p.P}(k)$ vale para todo $k<${p.n}+1$, y por la ⟦h1⟧ vale $${p.P}(${p.n}+1)$; así $Q(${p.n}+1)$.`, 'hip', ['L2'], [H('h1', 'hipótesis fuerte', ['hipótesis fuerte', 'hipótesis de inducción simple', 'definición de mínimo'], false)]],
      ['L5', r`Por inducción simple, $Q(${p.n})$ vale para todo $${p.n}$; en particular $${p.P}(${p.n})$ vale para todo $${p.n}$. ∎`, 'b.peano', ['L3', 'L4']],
    ],
    dist: p => [
      [r`Probamos $${p.P}(0)$ y suponemos $${p.P}(${p.n})$ para deducir $${p.P}(${p.n}+1)$; esa es la inducción fuerte.`, 'eso es la inducción simple'],
      [r`Como $${p.P}(k)$ vale para todo $k<${p.n}$, vale para todo $${p.n}$.`, 'salta a la conclusión sin pasar por la hipótesis fuerte'],
    ],
    err: p => [
      ['L3', r`Base: $Q(0)$ se cumple porque $${p.P}(0)$ es verdadera por definición.`, 'no-justificado', 'La verdad de $P(0)$ sale de la hipótesis fuerte (con la condición vacía), no de una definición.'],
      ['L4', r`Paso: supongamos $Q(${p.n})$. Entonces $${p.P}(${p.n}+1)$ vale por la hipótesis de inducción simple.`, 'circular', 'La simple no prueba $P(n+1)$ de $P(n)$ aquí; lo que da $P(n+1)$ es la hipótesis fuerte.'],
      ['L5', r`Por inducción simple, $Q(${p.n})$ vale para todo $${p.n}$; luego $${p.P}(0)$ vale. ∎`, 'conclusion-invalida', 'Falta concluir $P(n)$ para todo $n$ (se sigue de $Q(n)$).'],
    ],
    est: [['simple', 'Aplicar la inducción simple a $Q(n)$: «$P(k)$ para todo $k\\le n$»', true, 'Es la prueba estándar.'], ['absurdo', 'Suponer que $P$ falla en algún $n$ y tomar el menor', true, 'Válido, aunque usa el buen orden (que se prueba a partir de este teorema: ojo a la circularidad).'], ['ejemplos', 'Comprobar con varias propiedades $P$', false, 'Los ejemplos no prueban el principio general.'], ['directa', 'Probar $P(n)$ para cada $n$ directamente', false, 'No hay forma general de hacerlo sin la hipótesis.']],
    crit: ['Definí $Q(n)$ con «para todo $k\\le n$»', 'Probé la base con la hipótesis fuerte', 'Hice el paso con la hipótesis fuerte', 'Deduje $P(n)$ de $Q(n)$'],
    pistas: p => ['Orientación: la clave es fortalecer la afirmación que se prueba por inducción simple.', r`Idea clave: $Q(${p.n})$ = «$${p.P}(k)$ para todo $k\le ${p.n}$».`, r`Primer paso: ¿qué dice la hipótesis fuerte para $${p.n}=0$?`],
  });

  dem({
    id: 'dem.buen-orden', teorema: 't.buen-orden', nivel: '1.6', habilidades: ['1.6.demostrar'], requiere: ['t.induccion-fuerte', 't.contrapositiva', 't.neg-cuantificadores'], refsExtra: ['b.contradiccion', 'd.hip-induccion'],
    param: rng => ({ S: rng.pick(['S', 'A', 'X']), n: rng.pick(['n', 'm']) }),
    enunciado: p => r`Demuestra que todo subconjunto no vacío $${p.S}\subseteq\mathbb{N}$ tiene un mínimo.`,
    hip: p => [r`$${p.S}\subseteq\mathbb{N}$`, 'Puedes citar la inducción fuerte, la contrapositiva y la negación de cuantificadores'],
    meta: p => r`si $${p.S}\neq\varnothing$, entonces $${p.S}$ tiene mínimo`,
    L: p => [
      ['L1', r`Probamos la contrapositiva: si $${p.S}\subseteq\mathbb{N}$ no tiene mínimo, entonces $${p.S}=\varnothing$.`, 't.contrapositiva'],
      ['L2', r`Que $${p.S}$ no tenga mínimo es $\neg\exists m\in ${p.S}\ \forall s\in ${p.S}:\ m\le s$, que equivale a: para todo $m\in ${p.S}$ existe $s\in ${p.S}$ con $s<m$.`, 't.neg-cuantificadores', ['L1']],
      ['L3', r`Sea $P(${p.n})$ la afirmación «$${p.n}\notin ${p.S}$». Probamos $P(${p.n})$ para todo $${p.n}$ por inducción fuerte.`, 't.induccion-fuerte', ['L1']],
      ['L4', r`Sea $${p.n}\in\mathbb{N}$ y supongamos $P(k)$ para todo $k<${p.n}$: ningún $k<${p.n}$ está en $${p.S}$.`, 'd.hip-induccion', ['L3']],
      ['L5', r`Si $${p.n}\in ${p.S}$, por L2 existe $s\in ${p.S}$ con $s<${p.n}$; pero ningún $k<${p.n}$ está en $${p.S}$: contradicción.`, 'b.contradiccion', ['L2', 'L4']],
      ['L6', r`Luego $${p.n}\notin ${p.S}$: se cumple $P(${p.n})$.`, 'b.contradiccion', ['L5']],
      ['L7', r`Por inducción fuerte, $${p.n}\notin ${p.S}$ para todo $${p.n}\in\mathbb{N}$; es decir, $${p.S}=\varnothing$.`, 't.induccion-fuerte', ['L3', 'L6']],
      ['L8', r`Por la contrapositiva, todo subconjunto no vacío de $\mathbb{N}$ tiene mínimo. ∎`, 't.contrapositiva', ['L7']],
    ],
    dist: p => [
      [r`Como $\mathbb{N}$ está ordenado, el menor elemento de $${p.S}$ existe porque $${p.S}$ es finito.`, '$S$ puede ser infinito'],
      [r`Tomamos $${p.S}=\{3,5,8\}$ y vemos que su mínimo es $3$; por tanto vale siempre.`, 'un ejemplo no prueba el principio general'],
    ],
    err: p => [
      ['L2', r`Que $${p.S}$ no tenga mínimo equivale a: existe $m\in ${p.S}$ tal que para todo $s\in ${p.S}$, $s<m$.`, 'error-de-calculo', 'Al negar «existe… para todo…» se cambian ambos cuantificadores.'],
      ['L5', r`Si $${p.n}\in ${p.S}$, entonces $${p.n}$ es el mínimo de $${p.S}$, lo cual es consistente.`, 'conclusion-invalida', 'Supusimos que $S$ no tiene mínimo: eso es justo la contradicción buscada.'],
      ['L8', r`Por la contrapositiva, si $${p.S}=\varnothing$ entonces $${p.S}$ no tiene mínimo. ∎`, 'conclusion-invalida', 'Eso es el recíproco de la contrapositiva probada.']],
    est: [['contrapositiva', 'Suponer que $S$ no tiene mínimo y probar $S=\\varnothing$ con inducción fuerte', true, 'Es la prueba estándar.'], ['absurdo', 'Suponer $S$ no vacío sin mínimo y buscar un elemento mínimo con una descomposición', true, 'Equivale a la anterior.'], ['finito', 'Suponer que $S$ es finito', false, 'No es hipótesis del enunciado.'], ['ejemplos', 'Comprobar con varios subconjuntos', false, 'Los ejemplos no prueban un principio general.']],
    crit: ['Enuncié la contrapositiva', 'Negué «tiene mínimo» con cuantificadores', 'Usé inducción fuerte sobre $n\\notin S$', 'Concluí con la contrapositiva'],
    pistas: p => ['Orientación: es más cómodo probar «sin mínimo ⇒ vacío».', r`Idea clave: se prueba $${p.n}\notin ${p.S}$ para todo $${p.n}$ con inducción fuerte.`, r`Primer paso: escribe qué significa que $${p.S}$ no tenga mínimo.`],
  });

  R.nivel({
    id: '1.6', mundo: 1, titulo: 'Inducción', tema: 'Principio de inducción, inducción fuerte y buen orden',
    habilidades: ['1.6.sumas', '1.6.paso-inductivo', '1.6.base', '1.6.divisibilidad', '1.6.formula-cerrada', '1.6.demostrar'],
    teoremas: ['t.suma-gauss', 't.serie-geometrica', 't.bernoulli', 't.induccion-fuerte', 't.buen-orden'],
    leccion: {
      intro: 'La **inducción** prueba que una propiedad $P(n)$ vale para todo $n\\ge n_0$ con dos pasos: un **caso base** y un **paso inductivo**. Funciona porque $\\mathbb{N}$ se obtiene empezando en $0$ y sumando $1$ una y otra vez.',
      definiciones: [
        { nombre: 'Principio de inducción', tex: 'Si $P(n_0)$ es verdadera (**base**) y, para todo $n\\ge n_0$, $P(n)\\Rightarrow P(n+1)$ (**paso**; $P(n)$ es la **hipótesis de inducción**), entonces $P(n)$ vale para todo $n\\ge n_0$.' },
        { nombre: 'Inducción fuerte', tex: 'En el paso se puede suponer $P(k)$ para **todos** los $k<n$ y deducir $P(n)$. Es equivalente a la simple.' },
        { nombre: 'Buen orden', tex: 'Todo subconjunto no vacío de $\\mathbb{N}$ tiene un **mínimo**: un elemento menor o igual que todos los demás del conjunto.' },
        { nombre: 'Sumas que conviene recordar', tex: '$\\sum_{k=1}^{n}k=\\frac{n(n+1)}{2}$, $\\sum_{k=1}^{n}k^2=\\frac{n(n+1)(2n+1)}{6}$, $\\sum_{k=1}^{n}(2k-1)=n^2$, $\\sum_{k=0}^{n}q^k=\\frac{q^{n+1}-1}{q-1}$ ($q\\neq1$).' },
      ],
      teorema: 't.suma-gauss',
      ejemplo: { enunciado: 'Prueba por inducción que $1+3+5+\\cdots+(2n-1)=n^2$ para todo $n\\ge 1$.', pasos: ['**Base** ($n=1$): $1=1^2$.', '**Hipótesis**: $1+3+\\cdots+(2n-1)=n^2$ para algún $n\\ge 1$.', '**Paso**: $1+\\cdots+(2n-1)+(2n+1)=n^2+2n+1=(n+1)^2$, usando la hipótesis.', 'Es la propiedad para $n+1$; por inducción vale para todo $n\\ge 1$. ∎'] },
    },
  });

  if (typeof module !== 'undefined') module.exports = AC;
})(globalThis.AC = globalThis.AC || {});
