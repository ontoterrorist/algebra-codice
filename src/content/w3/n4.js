/* Mundo 3, nivel 3.4 — Fórmula cuadrática y relaciones de Cardano-Vieta. */
(function (AC) {
  const { R, H, T, gen, dem2 } = AC.cont, r = String.raw, P = AC.poly, Rat = AC.Rat, C = AC.conj;
  R.ref({ id: 'd.discriminante', tipo: 'definicion', nombre: 'Discriminante de ax² + bx + c: Δ = b² − 4ac' });

  const HB = (id, nombre) => R.habilidad({ id: '3.4.' + id, nombre, nivel: '3.4' });
  HB('formula', 'Fórmula cuadrática'); HB('vieta', 'Relaciones de Vieta'); HB('simetricas', 'Expresiones simétricas de las raíces'); HB('construir', 'Construir desde las raíces'); HB('demostrar', 'Demostrar con raíces');
  const TE = (id, titulo, enunciado, requiere, hab) => R.teorema({ id, titulo, nivel: '3.4', enunciado, requiere, habilidades: hab });
  TE('t.cuadratica-formula', 'Fórmula cuadrática', r`Las raíces de $ax^2+bx+c$ ($a\neq0$) son $x=\dfrac{-b\pm\sqrt{b^2-4ac}}{2a}$.`, ['t.teorema-factor'], ['3.4.formula', '3.4.demostrar']);
  TE('t.vieta-cuadratica', 'Vieta para cuadráticas', r`Si $x_1,x_2$ son las raíces de $ax^2+bx+c$, entonces $x_1+x_2=-\frac{b}{a}$ y $x_1x_2=\frac{c}{a}$.`, ['t.teorema-factor'], ['3.4.vieta', '3.4.construir', '3.4.demostrar']);
  TE('t.vieta-cubica', 'Vieta para cúbicas', r`Si $x_1,x_2,x_3$ son las raíces de $x^3+bx^2+cx+d$, entonces $\sum x_i=-b$, $\sum_{i<j}x_ix_j=c$ y $x_1x_2x_3=-d$.`, ['t.vieta-cuadratica'], ['3.4.vieta', '3.4.construir', '3.4.demostrar']);
  TE('t.potencias-raices', 'Sumas de potencias de raíces', r`$x_1^2+x_2^2+x_3^2=(x_1+x_2+x_3)^2-2(x_1x_2+x_1x_3+x_2x_3)$.`, ['t.vieta-cubica'], ['3.4.simetricas', '3.4.demostrar']);

  const px = p => P.str(p, 'x'), tx = p => P.tex(p, 'x'), de = P.de, lin = a => de([-a, 1]);
  const sg = n => (n < 0 ? '-' : '+') + Math.abs(n);
  const cst = n => String(n);

  /* ---------- generadores ---------- */
  gen.conjunto({
    id: 'w3.n4.formula-cuadratica', nivel: '3.4', habilidades: ['3.4.formula'], dificultad: 2,
    hacer(rng) {
      const a = rng.pick([1, 1, 2, 3]), x1 = rng.int(-5, 5), x2 = rng.int(-5, 5); if (x1 === x2) return null;
      const f = P.mul(de([a]), P.mul(lin(x1), lin(x2))), [c, b] = [Number(f[0].n), Number(f[1].n)];
      return { key: a + ',' + x1 + ',' + x2, enun: 'Usa la fórmula cuadrática para hallar las raíces de $' + tx(f) + '=0$ (escribe el conjunto).', res: [String(x1), String(x2)], norm: 'racional',
        firmas: [['signo-de-b', [String(-x1), String(-x2)], 'Revisa el signo de $-b$ en el numerador: las raíces son $\\frac{-b\\pm\\sqrt{\\Delta}}{2a}$.'], ['sin-2a', [String(x1 * a), String(x2 * a)], 'Olvidaste dividir entre $2a$ (no solo entre $2$).']].filter(q => C.fmt(q[1]) !== C.fmt([String(x1), String(x2)])),
        pistas: ['Orientación: calcula primero el discriminante $\\Delta=b^2-4ac$.', 'Idea clave: $x=\\dfrac{-b\\pm\\sqrt\\Delta}{2a}$.', 'Primer paso: identifica $a=' + a + '$, $b=' + b + '$, $c=' + c + '$.'], expl: 'Las raíces son $' + C.tex([String(x1), String(x2)]) + '$.' };
    },
  });

  gen.conjunto({
    id: 'w3.n4.formula-complejas', nivel: '3.4', habilidades: ['3.4.formula'], dificultad: 3,
    hacer(rng) {
      const re = rng.int(-4, 4), im = rng.int(1, 5), b = -2 * re, c = re * re + im * im;
      const z1 = (re === 0 ? '' : re) + (re === 0 ? '' : '+') + (im === 1 ? '' : im) + 'i', z2 = (re === 0 ? '-' : re + '-') + (im === 1 ? '' : im) + 'i';
      const f = de([c, b, 1]);
      return { key: re + ',' + im, enun: 'Halla en $\\mathbb{C}$ las raíces de $' + tx(f) + '=0$ (escribe el conjunto).', res: [z1, z2], norm: 'complejo',
        firmas: [['una-sola', [z1], 'Una cuadrática de discriminante negativo tiene dos raíces complejas conjugadas.'], ['parte-real-opuesta', [(re === 0 ? '' : -re + '+') + (im === 1 ? '' : im) + 'i', (re === 0 ? '-' : -re + '-') + (im === 1 ? '' : im) + 'i'], 'La parte real es $-b/2a$: revisa su signo.']].filter(q => re !== 0 || q[0] !== 'parte-real-opuesta'),
        pistas: ['Orientación: $\\Delta=b^2-4ac<0$, así que $\\sqrt\\Delta=i\\sqrt{|\\Delta|}$.', 'Idea clave: $x=\\dfrac{-b}{2a}\\pm\\dfrac{\\sqrt{|\\Delta|}}{2a}\\,i$.', 'Primer paso: calcula $\\Delta=' + (b * b - 4 * c) + '$.'], expl: 'Las raíces son $' + z1 + '$ y $' + z2 + '$.' };
    },
  });

  gen.tupla({
    id: 'w3.n4.vieta-cuadratica', nivel: '3.4', habilidades: ['3.4.vieta'], dificultad: 2,
    hacer(rng) {
      const a = rng.pick([1, 2, 3, 4]), b = rng.int(-9, 9), c = rng.int(-9, 9); if (!b || !c) return null;
      const f = de([c, b, a]), S = Rat.of(-b, a).toString(), Pp = Rat.of(c, a).toString();
      return { key: a + ',' + b + ',' + c, enun: 'Sin calcular las raíces, halla su suma $x_1+x_2$ y su producto $x_1x_2$ para $' + tx(f) + '$.', campos: ['x₁+x₂', 'x₁x₂'], res: [S, Pp],
        firmas: [['signo-suma', [Rat.of(b, a).toString(), Pp], 'La suma es $-b/a$, con el signo cambiado.'], ['sin-dividir', [String(-b), String(c)], 'Falta dividir entre el coeficiente líder $a=' + a + '$.'], ['intercambia', [Pp, S], 'El orden es primero la suma y luego el producto.']],
        pistas: ['Orientación: usa las relaciones de Vieta.', 'Idea clave: $x_1+x_2=-b/a$ y $x_1x_2=c/a$.', 'Primer paso: identifica $a=' + a + '$, $b=' + b + '$ y $c=' + c + '$.'], expl: '$x_1+x_2=' + S + '$, $x_1x_2=' + Pp + '$.' };
    },
  });

  gen.tupla({
    id: 'w3.n4.vieta-cubica', nivel: '3.4', habilidades: ['3.4.vieta'], dificultad: 3,
    hacer(rng) {
      const b = rng.int(-8, 8), c = rng.int(-8, 8), d = rng.int(-9, 9), a = rng.pick([1, 1, 2, 3]); if (!b || !c || !d) return null;
      const f = de([d, c, b, a]), e1 = Rat.of(-b, a).toString(), e2 = Rat.of(c, a).toString(), e3 = Rat.of(-d, a).toString();
      return { key: [a, b, c, d].join(','), enun: 'Para $' + tx(f) + '$ con raíces $x_1,x_2,x_3$, halla $x_1+x_2+x_3$, $x_1x_2+x_1x_3+x_2x_3$ y $x_1x_2x_3$.', campos: ['Σxᵢ', 'Σxᵢxⱼ', 'x₁x₂x₃'], res: [e1, e2, e3],
        firmas: [['signos-de-vieta', [Rat.of(b, a).toString(), e2, Rat.of(d, a).toString()], 'Los signos alternan: $\\sum x_i=-b/a$, $\\sum x_ix_j=+c/a$, $x_1x_2x_3=-d/a$.'], ['producto-signo', [e1, e2, Rat.of(d, a).toString()], 'El producto de las tres raíces es $-d/a$ (grado impar).'], ['sin-dividir', [String(-b), String(c), String(-d)], 'Divide cada relación entre el coeficiente líder $a=' + a + '$.']],
        pistas: ['Orientación: usa las relaciones de Vieta de grado 3.', 'Idea clave: $x^3+\\tfrac ba x^2+\\tfrac ca x+\\tfrac da=(x-x_1)(x-x_2)(x-x_3)$; compara coeficientes.', 'Primer paso: divide por el coeficiente líder $a=' + a + '$.'], expl: 'Valen $' + e1 + '$, $' + e2 + '$ y $' + e3 + '$.' };
    },
  });

  gen.entero({
    id: 'w3.n4.suma-cuadrados-raices', nivel: '3.4', habilidades: ['3.4.simetricas'], dificultad: 3,
    hacer(rng) {
      if (rng.chance(0.5)) { const b = rng.int(-8, 8), c = rng.int(-8, 8); if (!b || !c) return null; const res = b * b - 2 * c;
        return { key: 'q' + b + ',' + c, enun: 'Si $x_1,x_2$ son las raíces de $x^2' + sg(b) + 'x' + sg(c) + '$, calcula $x_1^2+x_2^2$ sin resolver la ecuación.', res,
          firmas: [['sin-2P', b * b, 'Falta restar $2x_1x_2$: $x_1^2+x_2^2=(x_1+x_2)^2-2x_1x_2$.'], ['signo-2P', b * b + 2 * c, 'Se **resta** $2P$ (el cuadrado de la suma incluye $+2x_1x_2$).'], ['suma-productos', -b - 2 * c, 'Eso no es el cuadrado de la suma: $(x_1+x_2)^2=b^2$.']].filter(q => q[1] !== res),
          pistas: ['Orientación: expresa la suma pedida con $S=x_1+x_2$ y $P=x_1x_2$.', 'Idea clave: $x_1^2+x_2^2=S^2-2P$.', 'Primer paso: calcula $S=' + (-b) + '$ y $P=' + c + '$.'], expl: '$x_1^2+x_2^2=(' + (-b) + ')^2-2(' + c + ')=' + res + '$.' }; }
      const b = rng.int(-6, 6), c = rng.int(-6, 6), d = rng.int(-9, 9); if (!b || !c) return null; const res = b * b - 2 * c;
      return { key: 'c' + [b, c, d].join(','), enun: 'Si $x_1,x_2,x_3$ son las raíces de $x^3' + sg(b) + 'x^2' + sg(c) + 'x' + sg(d) + '$, calcula $x_1^2+x_2^2+x_3^2$.', res,
        firmas: [['sin-2e2', b * b, 'Falta restar $2(x_1x_2+x_1x_3+x_2x_3)$.'], ['signo', b * b + 2 * c, 'Se resta el doble de la suma de productos.'], ['con-d', b * b - 2 * c - 2 * d, 'El término independiente no interviene en esta expresión.']].filter(q => q[1] !== res),
        pistas: ['Orientación: usa $(\\sum x_i)^2$ para despejar $\\sum x_i^2$.', 'Idea clave: $\\sum x_i^2=(\\sum x_i)^2-2\\sum_{i<j}x_ix_j$.', 'Primer paso: obtén $\\sum x_i=' + (-b) + '$ y $\\sum x_ix_j=' + c + '$.'], expl: '$' + b * b + '-2(' + c + ')=' + res + '$.' };
    },
  });

  gen.expr({
    id: 'w3.n4.polinomio-desde-vieta', nivel: '3.4', habilidades: ['3.4.construir'], dificultad: 3,
    hacer(rng) {
      if (rng.chance(0.5)) { const S = rng.int(-7, 7), Pr = rng.int(-9, 9); if (!S || !Pr) return null; const p = de([Pr, -S, 1]);
        return { key: 'q' + S + ',' + Pr, enun: 'Escribe el polinomio mónico de grado $2$ cuyas raíces tienen suma $' + S + '$ y producto $' + Pr + '$.', res: px(p), vars: ['x'],
          firmas: [['signo-suma', px(de([Pr, S, 1])), 'El coeficiente de $x$ es $-S$: $x^2-Sx+P$.'], ['signo-producto', px(de([-Pr, -S, 1])), 'El término independiente es $+P$.']].filter(q => q[1] !== px(p)),
          pistas: ['Orientación: $(x-x_1)(x-x_2)$.', 'Idea clave: $(x-x_1)(x-x_2)=x^2-(x_1+x_2)x+x_1x_2$.', 'Primer paso: sustituye $S$ y $P$.'], expl: '$' + tx(p) + '$.' }; }
      const e1 = rng.int(-6, 6), e2 = rng.int(-8, 8), e3 = rng.int(-9, 9); if (!e1 || !e2 || !e3) return null; const p = de([-e3, e2, -e1, 1]);
      return { key: 'c' + [e1, e2, e3].join(','), enun: 'Escribe el polinomio mónico de grado $3$ cuyas raíces cumplen $x_1+x_2+x_3=' + e1 + '$, $x_1x_2+x_1x_3+x_2x_3=' + e2 + '$ y $x_1x_2x_3=' + e3 + '$.', res: px(p), vars: ['x'],
        firmas: [['signos', px(de([e3, e2, e1, 1])), 'Los signos alternan: $x^3-e_1x^2+e_2x-e_3$.'], ['producto', px(de([-e3, e2, e1, 1])), 'El coeficiente de $x^2$ es $-e_1$.']].filter(q => q[1] !== px(p)),
        pistas: ['Orientación: desarrolla $(x-x_1)(x-x_2)(x-x_3)$.', 'Idea clave: $x^3-e_1x^2+e_2x-e_3$.', 'Primer paso: identifica $e_1,e_2,e_3$.'], expl: '$' + tx(p) + '$.' };
    },
  });

  gen.entero({
    id: 'w3.n4.parametro-razon', nivel: '3.4', habilidades: ['3.4.vieta', '3.4.simetricas'], dificultad: 4,
    hacer(rng) {
      const k = rng.pick([2, 3, 4]), t = rng.pick([-5, -4, -3, -2, -1, 1, 2, 3, 4, 5]), b = -(k + 1) * t, res = k * t * t, pal = { 2: 'el doble', 3: 'el triple', 4: 'el cuádruple' }[k];
      return { key: 'razon' + k + ',' + t, enun: 'En $x^2' + sg(b) + 'x+m$ una raíz es ' + pal + ' de la otra. Halla $m$.', res,
        firmas: [['una-t-cuadrada', t * t, 'Si las raíces son $t$ y $' + k + 't$, el producto es $' + k + 't^2$, no $t^2$.'], ['suma', -b, 'Eso es la suma de las raíces; $m$ es su producto.'], ['signo-t', -res, 'El producto de dos raíces del mismo signo es positivo.']].filter(q => q[1] !== res),
        pistas: ['Orientación: llama $t$ y $' + k + 't$ a las raíces.', 'Idea clave: la suma $' + (k + 1) + 't=-b$ y el producto $' + k + 't^2=m$.', 'Primer paso: despeja $t$ de la suma.'], expl: '$t=' + t + '$ y $m=' + k + 't^2=' + res + '$.' };
    },
  });

  /* ---------- demostraciones ---------- */
  dem2({
    id: 'dem.cuadratica-formula', teorema: 't.cuadratica-formula', nivel: '3.4', habilidades: ['3.4.formula', '3.4.demostrar'], requiere: ['t.teorema-factor'], refsExtra: ['d.discriminante', 'd.raiz', 'b.doble-implicacion', 'b.cuerpo-algebra'],
    param: rng => ({ a: rng.pick(['a', 'p']), b: rng.pick(['b', 'q']), c: rng.pick(['c', 'm']), x: rng.pick(['x', 'z']) }),
    enunciado: p => r`Demuestra que si $${p.a}\neq 0$ y $\Delta=${p.b}^2-4${p.a}${p.c}\ge 0$ (real), las soluciones de $${p.a}${p.x}^2+${p.b}${p.x}+${p.c}=0$ son $${p.x}=\dfrac{-${p.b}\pm\sqrt{\Delta}}{2${p.a}}$.`,
    hip: p => [r`$${p.a}\neq 0$ y $\Delta\ge 0$`, 'Puedes completar el cuadrado'], meta: p => r`$${p.x}=\dfrac{-${p.b}\pm\sqrt\Delta}{2${p.a}}$`,
    L: p => [
      ['L1', r`Como $${p.a}\neq 0$, dividimos entre $${p.a}$: $${p.x}^2+\tfrac{${p.b}}{${p.a}}${p.x}+\tfrac{${p.c}}{${p.a}}=0$.`, 'b.cuerpo-algebra'],
      ['L2', r`Completando el cuadrado: $\left(${p.x}+\tfrac{${p.b}}{2${p.a}}\right)^2=\tfrac{${p.b}^2}{4${p.a}^2}-\tfrac{${p.c}}{${p.a}}=\tfrac{\Delta}{4${p.a}^2}$.`, 'b.cuerpo-algebra', ['L1']],
      ['L3', r`Como $\Delta\ge 0$, un cuadrado es igual a $\tfrac{\Delta}{4${p.a}^2}$ si y solo si la base es ⟦h1⟧.`, 'b.sin-divisores-cero', ['L2'], [H('h1', r`$\pm\tfrac{\sqrt\Delta}{2${p.a}}$`, [r`$\pm\tfrac{\sqrt\Delta}{2${p.a}}$`, r`$\tfrac{\Delta}{2${p.a}}$`, r`$\pm\tfrac{\Delta}{4${p.a}^2}$`], false)]],
      ['L4', r`Despejando, $${p.x}=\dfrac{-${p.b}\pm\sqrt\Delta}{2${p.a}}$. Cada paso es una equivalencia, así que son todas las soluciones. ∎`, 'b.doble-implicacion', ['L3']],
    ],
    dist: p => [[r`Con $x^2-3x+2$ la fórmula da $1$ y $2$; luego es correcta.`, 'un ejemplo no prueba el caso general'], [r`Como $\Delta\ge 0$, el polinomio tiene exactamente una raíz.`, 'puede tener dos distintas (si $\\Delta>0$)']],
    err: p => [['L2', r`Completando el cuadrado: $\left(${p.x}+\tfrac{${p.b}}{${p.a}}\right)^2=\tfrac{\Delta}{4${p.a}^2}$.`, 'error-de-calculo', 'Se completa con la **mitad** del coeficiente: $b/(2a)$.'], ['L3', r`Como $\Delta\ge 0$, la base es $\tfrac{\sqrt\Delta}{2${p.a}}$ únicamente.`, 'conclusion-invalida', 'Hay dos signos: $\\pm$.']],
    valida: [['cuadrado', r`Dividir entre $a$ y completar el cuadrado`, 'Es la prueba estándar.']],
    idea: p => r`divide entre $${p.a}$ y completa el cuadrado en $${p.x}$.`, primero: p => r`divide la ecuación entre $${p.a}$.`,
  });

  dem2({
    id: 'dem.vieta-cuadratica', teorema: 't.vieta-cuadratica', nivel: '3.4', habilidades: ['3.4.vieta', '3.4.demostrar'], requiere: ['t.teorema-factor'], refsExtra: ['d.raiz', 'b.arbitrario', 'b.cuerpo-algebra'],
    param: rng => ({ a: rng.pick(['a', 'p']), b: rng.pick(['b', 'q']), c: rng.pick(['c', 'm']), u: rng.pick(['x_1', 'r_1']), v: rng.pick(['x_2', 'r_2']) }),
    enunciado: p => r`Sea $${p.a}x^2+${p.b}x+${p.c}$ con $${p.a}\neq0$ y raíces $${p.u},${p.v}$. Demuestra que $${p.u}+${p.v}=-\frac{${p.b}}{${p.a}}$ y $${p.u}${p.v}=\frac{${p.c}}{${p.a}}$.`,
    hip: p => [r`$${p.a}\neq 0$, $${p.u},${p.v}$ raíces con $${p.u}\neq ${p.v}$`, 'Puedes citar el teorema del factor'], meta: p => r`$${p.u}+${p.v}=-\frac{${p.b}}{${p.a}}$ y $${p.u}${p.v}=\frac{${p.c}}{${p.a}}$`,
    L: p => [
      ['L1', r`Por el teorema del factor, $(x-${p.u})$ divide al polinomio: $${p.a}x^2+${p.b}x+${p.c}=(x-${p.u})(${p.a}x+k)$ para algún $k$.`, 't.teorema-factor'],
      ['L2', r`Como $${p.v}\neq ${p.u}$ es raíz, $(${p.v}-${p.u})(${p.a}${p.v}+k)=0$ y, al ser $${p.v}-${p.u}\neq0$, ⟦h1⟧.`, 'b.sin-divisores-cero', ['L1'], [H('h1', r`$${p.a}${p.v}+k=0$`, [r`$${p.a}${p.v}+k=0$`, r`$k=0$`, r`$${p.a}=0$`], false)]],
      ['L3', r`Así $k=-${p.a}${p.v}$ y el polinomio es $${p.a}(x-${p.u})(x-${p.v})=${p.a}x^2-${p.a}(${p.u}+${p.v})x+${p.a}${p.u}${p.v}$.`, 'b.cuerpo-algebra', ['L2']],
      ['L4', r`Comparando coeficientes: $${p.b}=-${p.a}(${p.u}+${p.v})$ y $${p.c}=${p.a}${p.u}${p.v}$; dividiendo entre $${p.a}\neq 0$ se obtiene lo pedido. ∎`, 'b.cuerpo-algebra', ['L3']],
    ],
    dist: p => [[r`Con $x^2-5x+6$ y raíces $2,3$: suma $5$, producto $6$; luego siempre.`, 'un ejemplo no prueba el caso general'], [r`Como la suma de las raíces es $${p.b}$, queda demostrado.`, 'falta el signo y dividir entre $a$']],
    err: p => [['L3', r`Así $k=${p.a}${p.v}$ y el polinomio es $${p.a}(x-${p.u})(x-${p.v})$.`, 'error-de-calculo', 'De $a v+k=0$ se despeja $k=-av$.'], ['L4', r`Comparando coeficientes: $${p.b}=${p.a}(${p.u}+${p.v})$.`, 'error-de-calculo', 'El coeficiente de $x$ es $-a(u+v)$.']],
    valida: [['comparar', r`Factorizar con el teorema del factor y comparar coeficientes`, 'Es la prueba estándar.'], ['formula', r`Sumar y multiplicar las dos raíces dadas por la fórmula cuadrática`, 'Válida (para $\\Delta\\ge0$): se comprueba con las fórmulas del teorema anterior.']],
    idea: p => r`escribe $${p.a}x^2+${p.b}x+${p.c}=${p.a}(x-${p.u})(x-${p.v})$ y compara coeficientes.`, primero: p => r`aplica el teorema del factor a la raíz $${p.u}$.`,
  });

  dem2({
    id: 'dem.vieta-cubica', teorema: 't.vieta-cubica', nivel: '3.4', habilidades: ['3.4.vieta', '3.4.demostrar'], requiere: ['t.vieta-cuadratica'], refsExtra: ['d.raiz', 'b.cuerpo-algebra', 'b.doble-implicacion'],
    param: rng => ({ b: rng.pick(['b', 'p']), c: rng.pick(['c', 'q']), d: rng.pick(['d', 's']) }),
    enunciado: p => r`Sea $x^3+${p.b}x^2+${p.c}x+${p.d}$ con raíces $x_1,x_2,x_3$ (distintas). Demuestra que $x_1+x_2+x_3=-${p.b}$, $x_1x_2+x_1x_3+x_2x_3=${p.c}$ y $x_1x_2x_3=-${p.d}$.`,
    hip: p => [r`el polinomio es mónico con raíces distintas $x_1,x_2,x_3$`, 'Puedes citar el teorema del factor'], meta: p => r`las tres relaciones de Vieta`,
    L: p => [
      ['L1', r`Por el teorema del factor aplicado tres veces (las raíces son distintas), $x^3+${p.b}x^2+${p.c}x+${p.d}=(x-x_1)(x-x_2)(x-x_3)\,g$ con $g$ constante.`, 't.teorema-factor'],
      ['L2', r`Comparando los términos de grado $3$ (ambos mónicos), ⟦h1⟧.`, 'b.cuerpo-algebra', ['L1'], [H('h1', r`$g=1$`, [r`$g=1$`, r`$g=0$`, r`$g=-1$`], false)]],
      ['L3', r`Expandiendo: $(x-x_1)(x-x_2)(x-x_3)=x^3-(x_1+x_2+x_3)x^2+(x_1x_2+x_1x_3+x_2x_3)x-x_1x_2x_3$.`, 'b.cuerpo-algebra', ['L2']],
      ['L4', r`Comparando coeficientes de $x^2$, $x$ y el término independiente: $${p.b}=-\sum x_i$, $${p.c}=\sum x_ix_j$ y $${p.d}=-x_1x_2x_3$. ∎`, 'b.cuerpo-algebra', ['L3']],
    ],
    dist: p => [[r`Con $x^3-6x^2+11x-6$ (raíces $1,2,3$) las tres relaciones se verifican; luego valen siempre.`, 'un ejemplo no prueba el caso general'], [r`Como $${p.b}$ es el coeficiente de $x^2$, la suma de raíces es $${p.b}$.`, 'la suma de raíces es $-b$']],
    err: p => [['L3', r`Expandiendo: $(x-x_1)(x-x_2)(x-x_3)=x^3+(x_1+x_2+x_3)x^2+\cdots$`, 'error-de-calculo', 'El coeficiente de $x^2$ es $-(x_1+x_2+x_3)$.'], ['L4', r`Comparando: $${p.d}=x_1x_2x_3$.`, 'error-de-calculo', 'El término independiente es $-x_1x_2x_3$.']],
    valida: [['expandir', r`Factorizar con tres factores lineales, expandir y comparar coeficientes`, 'Es la prueba estándar.']],
    idea: p => r`el polinomio es $(x-x_1)(x-x_2)(x-x_3)$; expándelo.`, primero: p => r`factoriza con el teorema del factor.`,
  });

  dem2({
    id: 'dem.potencias-raices', teorema: 't.potencias-raices', nivel: '3.4', habilidades: ['3.4.simetricas', '3.4.demostrar'], requiere: ['t.vieta-cubica'], refsExtra: ['b.cuerpo-algebra', 'b.arbitrario'],
    param: rng => ({ b: rng.pick(['b', 'p']), c: rng.pick(['c', 'q']), d: rng.pick(['d', 's']) }),
    enunciado: p => r`Sean $x_1,x_2,x_3$ las raíces de $x^3+${p.b}x^2+${p.c}x+${p.d}$. Demuestra que $x_1^2+x_2^2+x_3^2=${p.b}^2-2${p.c}$.`,
    hip: p => [r`$x_1,x_2,x_3$ raíces del cúbico mónico`, 'Puedes citar las relaciones de Vieta para cúbicas'], meta: p => r`$x_1^2+x_2^2+x_3^2=${p.b}^2-2${p.c}$`,
    L: p => [
      ['L1', r`Elevando al cuadrado la suma: $(x_1+x_2+x_3)^2=x_1^2+x_2^2+x_3^2+2(x_1x_2+x_1x_3+x_2x_3)$.`, 'b.cuerpo-algebra'],
      ['L2', r`Despejando: $x_1^2+x_2^2+x_3^2=(x_1+x_2+x_3)^2-2(x_1x_2+x_1x_3+x_2x_3)$.`, 'b.cuerpo-algebra', ['L1']],
      ['L3', r`Por Vieta, $x_1+x_2+x_3=-${p.b}$ y $x_1x_2+x_1x_3+x_2x_3=${p.c}$.`, 't.vieta-cubica'],
      ['L4', r`Sustituyendo: $x_1^2+x_2^2+x_3^2=(-${p.b})^2-2${p.c}=$ ⟦h1⟧. ∎`, 'b.cuerpo-algebra', ['L2', 'L3'], [H('h1', r`$${p.b}^2-2${p.c}$`, [r`$${p.b}^2-2${p.c}$`, r`$${p.b}^2+2${p.c}$`, r`$-${p.b}^2-2${p.c}$`], false)]],
    ],
    dist: p => [[r`Con raíces $1,2,3$ la suma de cuadrados es $14$ y $b^2-2c=36-22=14$; luego siempre.`, 'un ejemplo no prueba el caso general'], [r`Como la suma de cuadrados es mayor que cero, $${p.b}^2>2${p.c}$.`, 'no es una demostración de la identidad']],
    err: p => [['L1', r`Elevando al cuadrado la suma: $(x_1+x_2+x_3)^2=x_1^2+x_2^2+x_3^2$.`, 'error-de-calculo', 'Faltan los dobles productos.'], ['L2', r`Despejando: $x_1^2+x_2^2+x_3^2=(x_1+x_2+x_3)^2+2(x_1x_2+x_1x_3+x_2x_3)$.`, 'error-de-calculo', 'Al despejar, el término cruzado se **resta**.']],
    valida: [['cuadrado-de-suma', r`Elevar al cuadrado la suma de las raíces y usar Vieta`, 'Es la prueba estándar.']],
    idea: p => r`eleva al cuadrado $x_1+x_2+x_3$ y despeja la suma de cuadrados.`, primero: p => r`desarrolla $(x_1+x_2+x_3)^2$.`,
  });

  R.nivel({
    id: '3.4', mundo: 3, titulo: 'Fórmula cuadrática y Vieta', tema: 'Cardano-Vieta: raíces y coeficientes',
    habilidades: ['3.4.formula', '3.4.vieta', '3.4.simetricas', '3.4.construir', '3.4.demostrar'],
    teoremas: ['t.cuadratica-formula', 't.vieta-cuadratica', 't.vieta-cubica', 't.potencias-raices'],
    leccion: {
      intro: 'Los coeficientes de un polinomio y sus raíces están ligados: sin resolver la ecuación se pueden conocer sumas y productos de las raíces. Son las **relaciones de Cardano-Vieta**.',
      definiciones: [
        { nombre: 'Fórmula cuadrática', tex: 'Las raíces de $ax^2+bx+c$ son $x=\\dfrac{-b\\pm\\sqrt{\\Delta}}{2a}$ con $\\Delta=b^2-4ac$. Si $\\Delta<0$ las raíces son complejas conjugadas.' },
        { nombre: 'Vieta de grado 2', tex: '$x_1+x_2=-\\dfrac{b}{a}$ y $x_1x_2=\\dfrac{c}{a}$.' },
        { nombre: 'Vieta de grado 3', tex: 'Para $x^3+bx^2+cx+d$: $\\sum x_i=-b$, $\\sum_{i<j}x_ix_j=c$, $x_1x_2x_3=-d$. Los signos alternan.' },
        { nombre: 'Expresiones simétricas', tex: 'Sumas de potencias como $x_1^2+x_2^2$ se calculan con $S$ y $P$: $x_1^2+x_2^2=S^2-2P$.' },
      ],
      teorema: 't.vieta-cubica',
      ejemplo: { enunciado: 'Si $x_1,x_2$ son raíces de $x^2-5x+3$, calcula $x_1^2+x_2^2$.', pasos: ['Por Vieta: $S=5$ y $P=3$.', '$x_1^2+x_2^2=S^2-2P=25-6$.', 'El resultado es $19$.'] },
    },
  });

  if (typeof module !== 'undefined') module.exports = AC;
})(globalThis.AC = globalThis.AC || {});
