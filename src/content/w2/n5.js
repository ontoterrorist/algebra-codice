/* Mundo 2, nivel 2.5 — Números complejos: forma binomial y polar. */
(function (AC) {
  const { R, H, T, gen, dem2 } = AC.cont, r = String.raw, Cx = AC.Cx, Rat = AC.Rat;
  const ref = (id, tipo, nombre) => R.ref({ id, tipo, nombre });
  ref('d.conjugado', 'definicion', 'Conjugado: conj(a+bi) = a − bi'); ref('d.modulo', 'definicion', 'Módulo: |a+bi|² = a² + b² = z·conj(z)'); ref('d.polar', 'definicion', 'Forma polar: z = r(cos θ + i sen θ) con r = |z|');
  ref('b.trig', 'propiedad-base', 'cos(θ+φ) = cos θ cos φ − sen θ sen φ; sen(θ+φ) = sen θ cos φ + cos θ sen φ'); ref('d.inverso-mult', 'definicion', 'Inverso multiplicativo: w es inverso de z si zw = 1');

  const HB = (id, nombre) => R.habilidad({ id: '2.5.' + id, nombre, nivel: '2.5' });
  HB('operaciones', 'Operar con complejos'); HB('conjugado-inverso', 'Conjugado e inverso'); HB('a-polar', 'De binomial a polar'); HB('a-binomial', 'De polar a binomial'); HB('modulo-argumento', 'Módulo y argumento'); HB('demostrar', 'Demostrar con complejos');
  const TE = (id, titulo, enunciado, requiere, hab) => R.teorema({ id, titulo, nivel: '2.5', enunciado, requiere, habilidades: hab });
  TE('t.complejo-inverso', 'Inverso de un complejo', r`Si $z=a+bi\neq 0$, entonces $z^{-1}=\dfrac{a-bi}{a^2+b^2}$.`, [], ['2.5.conjugado-inverso', '2.5.demostrar']);
  TE('t.conj-producto', 'Conjugado de un producto', r`$\overline{zw}=\bar z\,\bar w$.`, [], ['2.5.conjugado-inverso', '2.5.demostrar']);
  TE('t.modulo-producto', 'Módulo de un producto', r`$|zw|=|z|\,|w|$.`, ['t.conj-producto'], ['2.5.modulo-argumento', '2.5.demostrar']);
  TE('t.polar-producto', 'Producto en forma polar', r`Si $z=r(\cos\theta+i\sin\theta)$ y $w=s(\cos\varphi+i\sin\varphi)$, entonces $zw=rs\,(\cos(\theta+\varphi)+i\sin(\theta+\varphi))$.`, [], ['2.5.a-polar', '2.5.demostrar']);

  const sgn = (n, lead) => (n < 0 ? '-' : lead ? '' : '+') + (Math.abs(n) === 1 ? '' : Math.abs(n));
  const zTex = (a, b) => Cx.of(a, b).toTeX();
  const zStr = z => z.toString();

  /* ---------- generadores ---------- */
  gen.complejo({
    id: 'w2.n5.operar-complejos', nivel: '2.5', habilidades: ['2.5.operaciones'], dificultad: 1,
    hacer(rng) {
      const [a, b, c, d] = [rng.int(-6, 6), rng.int(-6, 6), rng.int(-6, 6), rng.int(-6, 6)]; if (!b || !d || (!a && !c)) return null;
      const z = Cx.of(a, b), w = Cx.of(c, d), tipo = rng.pick(['prod', 'prod', 'sumprod', 'cuad']);
      let res, tex, f;
      if (tipo === 'prod') { res = z.mul(w); tex = '(' + zTex(a, b) + ')(' + zTex(c, d) + ')'; f = [['i-cuadrado', Cx.of(a * c + b * d, a * d + b * c), 'Recuerda que $i^2=-1$: el término $bd\\,i^2$ resta, no suma.'], ['sin-cruzados', Cx.of(a * c - b * d, 0), 'Faltan los términos cruzados $ad\\,i+bc\\,i$.'], ['componentes', Cx.of(a * c, b * d), 'No se multiplica parte real con real e imaginaria con imaginaria por separado.']]; }
      else if (tipo === 'sumprod') { res = z.mul(w).add(z); tex = '(' + zTex(a, b) + ')(' + zTex(c, d) + ')+(' + zTex(a, b) + ')'; f = [['sin-sumar', z.mul(w), 'Falta sumar el último término.'], ['i-cuadrado', Cx.of(a * c + b * d, a * d + b * c).add(z), 'Revisa $i^2=-1$ al desarrollar el producto.']]; }
      else { res = z.mul(z); tex = '(' + zTex(a, b) + ')^2'; f = [['sin-cruzado', Cx.of(a * a - b * b, 0), 'Falta el doble producto $2abi$.'], ['i-cuadrado', Cx.of(a * a + b * b, 2 * a * b), 'Recuerda que $i^2=-1$.'], ['componentes', Cx.of(a * a, b * b), 'No se eleva cada parte por separado.']]; }
      return { key: tipo + [a, b, c, d].join(','), enun: 'Calcula $' + tex + '$ y escríbelo como $a+bi$.', res: zStr(res), firmas: f.map(q => [q[0], zStr(q[1]), q[2]]),
        pistas: ['Orientación: desarrolla como un binomio y agrupa.', 'Idea clave: $i^2=-1$.', 'Primer paso: multiplica cada término del primer factor por cada uno del segundo.'], expl: 'El resultado es $' + res.toTeX() + '$.' };
    },
  });

  gen.complejo({
    id: 'w2.n5.conjugado-inverso', nivel: '2.5', habilidades: ['2.5.conjugado-inverso'], dificultad: 2,
    hacer(rng) {
      const [a, b, c, d] = [rng.int(-5, 5), rng.int(-5, 5), rng.int(-5, 5), rng.int(-5, 5)]; if (!b || (!c && !d)) return null;
      const z = Cx.of(a, b), w = Cx.of(c, d), tipo = rng.pick(['inverso', 'cociente']);
      if (tipo === 'inverso') { const res = z.inv(); return { key: 'i' + a + ',' + b, enun: 'Calcula $\\dfrac{1}{' + zTex(a, b) + '}$ y escríbelo como $x+yi$ (con fracciones si hace falta).', res: zStr(res),
        firmas: [['solo-conjugado', zStr(z.conj()), 'El conjugado solo es el numerador: falta dividir entre $a^2+b^2=' + z.norm2() + '$.'], ['reciproco-de-partes', zStr(Cx.of(0, 0).add(new Cx(Rat.of(1).div(Rat.of(a || 1)), Rat.of(1).div(Rat.of(b))))), 'No se invierte cada parte por separado: hay que multiplicar por el conjugado.'], ['signo', zStr(new Cx(z.inv().re, z.inv().im.neg())), 'Cuidado con el signo de la parte imaginaria: el inverso lleva $-b$ en el numerador.']],
        pistas: ['Orientación: multiplica numerador y denominador por el conjugado.', 'Idea clave: $z\\bar z=a^2+b^2$ es real.', 'Primer paso: escribe $\\frac{1}{z}=\\frac{\\bar z}{z\\bar z}$.'], expl: '$' + res.toTeX() + '$.' }; }
      const res = z.div(w);
      return { key: 'c' + [a, b, c, d].join(','), enun: 'Calcula $\\dfrac{' + zTex(a, b) + '}{' + zTex(c, d) + '}$ y escríbelo como $x+yi$ (fracciones si hace falta).', res: zStr(res),
        firmas: [['sin-normalizar', zStr(z.mul(w.conj())), 'Multiplicaste por el conjugado arriba pero faltó dividir entre $|w|^2=' + w.norm2() + '$.'], ['conjugado-del-numerador', zStr(z.conj().div(w)), 'El conjugado va en el denominador (o en ambos), no solo en el numerador.'], ['solo-partes', zStr(new Cx(Rat.of(a).div(Rat.of(c || 1)), Rat.of(b).div(Rat.of(d || 1)))), 'No se divide parte real con real e imaginaria con imaginaria.']],
        pistas: ['Orientación: elimina la $i$ del denominador.', 'Idea clave: multiplica arriba y abajo por el conjugado del denominador.', 'Primer paso: calcula $w\\bar w=' + w.norm2() + '$.'], expl: '$' + res.toTeX() + '$.' };
    },
  });

  gen.tupla({
    id: 'w2.n5.a-polar', nivel: '2.5', habilidades: ['2.5.a-polar', '2.5.modulo-argumento'], dificultad: 2,
    hacer(rng) {
      const k = rng.int(1, 6), forma = rng.pick(['diag', 'diag', 'eje']);
      const [a, b] = forma === 'diag' ? [k * rng.pick([-1, 1]), k * rng.pick([-1, 1])] : rng.pick([[k, 0], [-k, 0], [0, k], [0, -k]]);
      const z = Cx.of(a, b), arg = z.argPi(), n2 = z.norm2();
      const arbitrario = a < 0 ? Cx.of(-a, b).argPi() : null;
      const firmas = [['arg-del-conjugado', [n2.toString(), arg.neg().toString()], 'Ese es el argumento de $\\bar z$: el signo de la parte imaginaria decide el cuadrante.'], ['modulo-sin-cuadrado', [String(Math.abs(a) + Math.abs(b)), arg.toString()], 'El módulo al cuadrado es $a^2+b^2$, no $|a|+|b|$.']];
      if (arbitrario) firmas.push(['cuadrante-mal', [n2.toString(), arbitrario.neg().toString()], 'Cuando $a<0$ no basta $\\arctan(b/a)$: hay que sumar $\\pi$ para caer en el cuadrante correcto.']);
      return { key: a + ',' + b, enun: 'Para $z=' + zTex(a, b) + '$ escribe $|z|^2$ y el argumento $\\operatorname{Arg}(z)/\\pi$ en $(-1,1]$ (como fracción; vale cualquier equivalente módulo $2$).', campos: ['|z|^2', 'Arg(z)/π'], res: [n2.toString(), arg.toString()], mod: [null, 2], firmas,
        pistas: ['Orientación: dibuja el punto en el plano y mira su cuadrante.', 'Idea clave: $|z|^2=a^2+b^2$; los ángulos típicos son múltiplos de $\\pi/4$ sobre las diagonales y de $\\pi/2$ sobre los ejes.', 'Primer paso: calcula $a^2+b^2$.'], expl: '$|z|^2=' + n2 + '$ y $\\operatorname{Arg}(z)=' + arg.toString() + '\\pi$.' };
    },
  });

  gen.complejo({
    id: 'w2.n5.a-binomial', nivel: '2.5', habilidades: ['2.5.a-binomial'], dificultad: 2,
    hacer(rng) {
      const k = rng.int(1, 7), eje = rng.chance(0.4);
      if (eje) { const t = rng.pick([['0', 0, 1, 0], ['\\pi/2', 0, 0, 1], ['\\pi', 1, -1, 0], ['3\\pi/2', 1, 0, -1]]), z = Cx.of(t[2] * k, t[3] * k);
        return { key: 'e' + k + t[0], enun: 'Escribe en forma binomial $z=' + k + '\\left(\\cos ' + t[0] + '+i\\sin ' + t[0] + '\\right)$.', res: zStr(z),
          firmas: [['seno-por-coseno', zStr(Cx.of(t[3] * k, t[2] * k)), 'Intercambiaste $\\cos$ y $\\sin$: la parte real es $r\\cos\\theta$ y la imaginaria $r\\sin\\theta$.'], ['solo-modulo', zStr(Cx.of(k, 0)), 'Falta aplicar el ángulo: $\\cos$ y $\\sin$ no valen siempre $1$ y $0$.']],
          pistas: ['Orientación: evalúa $\\cos\\theta$ y $\\sin\\theta$.', 'Idea clave: $z=r\\cos\\theta+i\\,r\\sin\\theta$.', 'Primer paso: recuerda los valores de seno y coseno en $\\theta=' + t[0] + '$.'], expl: '$z=' + z.toTeX() + '$.' }; }
      const s = rng.pick([[1, 1, '\\pi/4'], [-1, 1, '3\\pi/4'], [-1, -1, '5\\pi/4'], [1, -1, '7\\pi/4']]), z = Cx.of(s[0] * k, s[1] * k);
      return { key: 'd' + k + s[2], enun: 'Escribe en forma binomial $z=' + k + '\\sqrt{2}\\left(\\cos\\dfrac{' + s[2].replace('\\pi/', '\\pi}{') + '}\\right)$.'.replace('\\left(\\cos\\dfrac{' + s[2].replace('\\pi/', '\\pi}{') + '}\\right)', '\\left(\\cos\\tfrac{' + s[2].replace('\\pi/', '\\pi}{') + '}+i\\sin\\tfrac{' + s[2].replace('\\pi/', '\\pi}{') + '}\\right)'), res: zStr(z),
        firmas: [['sin-raiz', zStr(Cx.of(s[0] * k * 1, s[1] * k * 0)), 'No olvides que el módulo es $' + k + '\\sqrt2$ y $\\cos\\frac\\pi4=\\frac{\\sqrt2}{2}$: se compensan.'], ['signos', zStr(Cx.of(-s[0] * k, s[1] * k)), 'Revisa el signo de $\\cos$ y de $\\sin$ en este cuadrante.'], ['modulo-sin-cancelar', zStr(Cx.of(s[0] * k * 2, s[1] * k * 2)), 'Al multiplicar $\\sqrt2\\cdot\\frac{\\sqrt2}{2}=1$, no $2$.']],
        pistas: ['Orientación: $\\cos$ y $\\sin$ de un ángulo múltiplo de $\\pi/4$ valen $\\pm\\frac{\\sqrt2}{2}$.', 'Idea clave: $r\\cdot\\frac{\\sqrt2}{2}=k$ cuando $r=k\\sqrt2$.', 'Primer paso: decide los signos de $\\cos$ y $\\sin$ según el cuadrante.'], expl: '$z=' + z.toTeX() + '$.' };
    },
  });

  gen.complejo({
    id: 'w2.n5.rotacion-plano', nivel: '2.5', habilidades: ['2.5.operaciones', '2.5.a-polar'], dificultad: 2,
    hacer(rng) {
      const a = rng.int(-6, 6), b = rng.int(-6, 6), c = rng.int(-4, 4), d = rng.int(-4, 4), k = rng.int(1, 3), P = Cx.of(a, b), C0 = Cx.of(c, d);
      if (!a && !b) return null;
      const ang = ['\\pi/2', '\\pi', '3\\pi/2'][k - 1], giro = Cx.I.pow(k), desdeC = rng.chance(0.5);
      const res = desdeC ? C0.add(P.sub(C0).mul(giro)) : P.mul(giro);
      const contrario = desdeC ? C0.add(P.sub(C0).mul(Cx.I.pow(-k))) : P.mul(Cx.I.pow(-k)), sinCentro = P.mul(giro);
      return { key: [a, b, c, d, k, desdeC].join(','), enun: desdeC ? 'En el plano complejo se gira el punto $P=' + zTex(a, b) + '$ un ángulo $' + ang + '$ en sentido antihorario alrededor del punto $C=' + zTex(c, d) + '$. ¿A qué número complejo va a parar?' : 'Se gira el punto $P=' + zTex(a, b) + '$ un ángulo $' + ang + '$ en sentido antihorario alrededor del origen. ¿A qué número complejo va a parar?', res: zStr(res),
        firmas: [['sentido-contrario', zStr(contrario), 'Giraste en sentido horario: antihorario es multiplicar por $i^{' + k + '}$.'], ...(desdeC ? [['centro-olvidado', zStr(sinCentro), 'Giraste alrededor del origen; el centro es $C$: gira $P-C$ y vuelve a sumar $C$.']] : []), ['sin-girar', zStr(P), 'El punto no queda quieto: hay que multiplicar por $\\cos\\theta+i\\sin\\theta$.']],
        pistas: ['Orientación: un giro de ángulo $\\theta$ es multiplicar por $\\cos\\theta+i\\sin\\theta$.', 'Idea clave: para $\\theta=\\pi/2$ ese factor es $i$; para $\\pi$, $-1$; para $3\\pi/2$, $-i$.', desdeC ? 'Primer paso: traslada el centro al origen restando $C$.' : 'Primer paso: identifica el factor $e^{i\\theta}$.'], expl: 'El punto va a $' + res.toTeX() + '$.' };
    },
  });

  /* ---------- demostraciones ---------- */
  dem2({
    id: 'dem.complejo-inverso', teorema: 't.complejo-inverso', nivel: '2.5', habilidades: ['2.5.conjugado-inverso', '2.5.demostrar'], requiere: [], refsExtra: ['d.conjugado', 'd.modulo'],
    param: rng => ({ z: rng.pick(['z', 'w']), a: rng.pick(['a', 'x']), b: rng.pick(['b', 'y']) }),
    enunciado: p => r`Demuestra que si $${p.z}=${p.a}+${p.b}i\neq 0$, entonces $${p.z}^{-1}=\dfrac{${p.a}-${p.b}i}{${p.a}^2+${p.b}^2}$.`,
    hip: p => [r`$${p.a},${p.b}\in\mathbb{R}$ no ambos nulos`, r`$i^2=-1$`], meta: p => r`$${p.z}\cdot\dfrac{${p.a}-${p.b}i}{${p.a}^2+${p.b}^2}=1$`,
    L: p => [
      ['L1', r`Como $${p.a},${p.b}$ no son ambos $0$, $${p.a}^2+${p.b}^2>0$; en particular es distinto de $0$.`, 'b.orden'],
      ['L2', r`Calculamos $(${p.a}+${p.b}i)(${p.a}-${p.b}i)=${p.a}^2-${p.b}^2i^2=$ ⟦h1⟧.`, 'b.cuerpo-algebra', ['L1'], [H('h1', r`${p.a}^2+${p.b}^2`, [r`${p.a}^2-${p.b}^2`, r`${p.a}^2+${p.b}^2i`, r`2${p.a}${p.b}`])]],
      ['L3', r`Dividiendo entre $${p.a}^2+${p.b}^2\neq 0$: $${p.z}\cdot\frac{${p.a}-${p.b}i}{${p.a}^2+${p.b}^2}=1$.`, 'b.cuerpo-algebra', ['L1', 'L2']],
      ['L4', r`Por definición de inverso multiplicativo, $${p.z}^{-1}=\frac{${p.a}-${p.b}i}{${p.a}^2+${p.b}^2}$. ∎`, 'd.inverso-mult', ['L3']],
    ],
    dist: p => [[r`Como $${p.z}^{-1}=1/${p.a}+1/(${p.b}i)$, basta invertir cada parte.`, 'no se invierte parte por parte'], [r`Con $${p.z}=1+i$ el inverso es $(1-i)/2$; luego vale siempre.`, 'un ejemplo no prueba el caso general']],
    err: p => [['L2', r`Calculamos $(${p.a}+${p.b}i)(${p.a}-${p.b}i)=${p.a}^2-${p.b}^2$.`, 'error-de-calculo', 'Como $i^2=-1$, $-b^2i^2=+b^2$.'], ['L1', r`Como $${p.z}\neq 0$, $${p.a}\neq 0$.`, 'conclusion-invalida', 'Puede ser $a=0$ si $b\\neq 0$ (p. ej. $z=i$).']],
    valida: [['conjugado', r`Multiplicar por el conjugado y dividir entre $a^2+b^2$`, 'Es la prueba estándar.']],
    idea: p => r`$${p.z}\bar{${p.z}}=${p.a}^2+${p.b}^2$ es un real positivo.`, primero: p => r`calcula $(${p.a}+${p.b}i)(${p.a}-${p.b}i)$.`,
  });

  dem2({
    id: 'dem.conj-producto', teorema: 't.conj-producto', nivel: '2.5', habilidades: ['2.5.conjugado-inverso', '2.5.demostrar'], requiere: [], refsExtra: ['d.modulo'],
    param: rng => ({ z: rng.pick(['z', 'u']), w: rng.pick(['w', 'v']) }),
    enunciado: p => r`Demuestra que $\overline{${p.z}${p.w}}=\bar ${p.z}\,\bar ${p.w}$ para todos $${p.z},${p.w}\in\mathbb{C}$.`,
    hip: p => [r`$${p.z}=a+bi$, $${p.w}=c+di$ con $a,b,c,d\in\mathbb{R}$`], meta: p => r`$\overline{${p.z}${p.w}}=\bar ${p.z}\,\bar ${p.w}$`,
    L: p => [
      ['L1', r`Sean $${p.z}=a+bi$ y $${p.w}=c+di$. Entonces $${p.z}${p.w}=(ac-bd)+(ad+bc)i$.`, 'b.cuerpo-algebra'],
      ['L2', r`Su conjugado es $\overline{${p.z}${p.w}}=(ac-bd)-(ad+bc)i$.`, 'd.conjugado', ['L1']],
      ['L3', r`Por otro lado, $\bar ${p.z}\,\bar ${p.w}=(a-bi)(c-di)=ac-ad\,i-bc\,i+bd\,i^2=$ ⟦h1⟧.`, 'b.cuerpo-algebra', [], [H('h1', r`(ac-bd)-(ad+bc)i`, [r`(ac+bd)-(ad+bc)i`, r`(ac-bd)+(ad+bc)i`, r`(ac-bd)-(ad-bc)i`])]],
      ['L4', r`Las dos expresiones coinciden: $\overline{${p.z}${p.w}}=\bar ${p.z}\,\bar ${p.w}$. ∎`, 'b.cuerpo-algebra', ['L2', 'L3']],
    ],
    dist: p => [[r`Con $${p.z}=1+i$ y $${p.w}=2-i$ se comprueba; luego siempre.`, 'un ejemplo no prueba el caso general'], [r`Como la conjugación cambia el signo de $i$, y $i$ aparece en todos los términos, el producto se conserva.`, 'es una intuición: hay que desarrollar los productos']],
    err: p => [['L1', r`Sean $${p.z}=a+bi$ y $${p.w}=c+di$. Entonces $${p.z}${p.w}=(ac+bd)+(ad+bc)i$.`, 'error-de-calculo', 'Con $i^2=-1$ el término $bd$ lleva signo menos.'], ['L2', r`Su conjugado es $\overline{${p.z}${p.w}}=-(ac-bd)-(ad+bc)i$.`, 'error-de-calculo', 'El conjugado cambia solo el signo de la parte imaginaria.']],
    valida: [['coordenadas', r`Desarrollar en coordenadas $a+bi$ y $c+di$`, 'Es la prueba estándar.'], ['polar', r`Usar la forma polar y que $\overline{r e^{i\theta}}=r e^{-i\theta}$`, 'Válida, pero depende de resultados posteriores del nivel.']],
    idea: p => r`desarrolla $(a+bi)(c+di)$ y $(a-bi)(c-di)$.`, primero: p => r`escribe $${p.z}$ y $${p.w}$ con coordenadas.`,
  });

  dem2({
    id: 'dem.modulo-producto', teorema: 't.modulo-producto', nivel: '2.5', habilidades: ['2.5.modulo-argumento', '2.5.demostrar'], requiere: ['t.conj-producto'], refsExtra: ['d.conjugado'],
    param: rng => ({ z: rng.pick(['z', 'u']), w: rng.pick(['w', 'v']) }),
    enunciado: p => r`Demuestra que $|${p.z}${p.w}|=|${p.z}|\,|${p.w}|$ para todos $${p.z},${p.w}\in\mathbb{C}$.`,
    hip: p => [r`$|${p.z}|^2=${p.z}\bar ${p.z}$ y $|${p.z}|\ge 0$`, 'Puedes citar el conjugado de un producto'], meta: p => r`$|${p.z}${p.w}|=|${p.z}|\,|${p.w}|$`,
    L: p => [
      ['L1', r`Por definición de módulo, $|${p.z}${p.w}|^2=(${p.z}${p.w})\,\overline{${p.z}${p.w}}$.`, 'd.modulo'],
      ['L2', r`Por el teorema del conjugado de un producto, $\overline{${p.z}${p.w}}=\bar ${p.z}\,\bar ${p.w}$.`, 't.conj-producto', ['L1']],
      ['L3', r`Entonces $|${p.z}${p.w}|^2=${p.z}${p.w}\bar ${p.z}\bar ${p.w}=(${p.z}\bar ${p.z})(${p.w}\bar ${p.w})=|${p.z}|^2|${p.w}|^2$.`, 'b.cuerpo-algebra', ['L2']],
      ['L4', r`Como $|${p.z}${p.w}|$ y $|${p.z}|\,|${p.w}|$ son no negativos y sus cuadrados coinciden, son iguales. ∎`, 'b.orden', ['L3']],
    ],
    dist: p => [[r`Como $|${p.z}+${p.w}|\le|${p.z}|+|${p.w}|$, el producto cumple una igualdad análoga.`, 'son propiedades distintas'], [r`Con $${p.z}=3+4i$, $${p.w}=1+i$: $|${p.z}${p.w}|=\sqrt{50}=5\sqrt 2$; luego siempre.`, 'un ejemplo no prueba el caso general']],
    err: p => [['L2', r`Por el teorema del conjugado, $\overline{${p.z}${p.w}}=\bar ${p.z}+\bar ${p.w}$.`, 'error-de-calculo', 'El conjugado de un producto es el producto de los conjugados.'], ['L4', r`Como sus cuadrados coinciden, son iguales (puede ser $a=-b$).`, 'conclusion-invalida', 'Hace falta usar que ambos módulos son no negativos.']],
    valida: [['cuadrados', r`Comparar los cuadrados de los módulos`, 'Es la prueba estándar.'], ['coordenadas', r`Desarrollar con coordenadas $a,b,c,d$ y comprobar la identidad de Lagrange`, 'Válida: $(a^2+b^2)(c^2+d^2)=(ac-bd)^2+(ad+bc)^2$.']],
    idea: p => r`$|${p.z}|^2=${p.z}\bar ${p.z}$ y el conjugado de un producto.`, primero: p => r`escribe $|${p.z}${p.w}|^2$ como $(${p.z}${p.w})\overline{(${p.z}${p.w})}$.`,
  });

  dem2({
    id: 'dem.polar-producto', teorema: 't.polar-producto', nivel: '2.5', habilidades: ['2.5.a-polar', '2.5.demostrar'], requiere: [], refsExtra: ['d.polar', 'd.modulo'],
    param: rng => ({ z: rng.pick(['z', 'u']), w: rng.pick(['w', 'v']), t: rng.pick([['\\theta', '\\varphi'], ['\\alpha', '\\beta']]) }),
    enunciado: p => r`Demuestra que si $${p.z}=r(\cos${p.t[0]}+i\sin${p.t[0]})$ y $${p.w}=s(\cos${p.t[1]}+i\sin${p.t[1]})$, entonces $${p.z}${p.w}=rs\,(\cos(${p.t[0]}+${p.t[1]})+i\sin(${p.t[0]}+${p.t[1]}))$.`,
    hip: p => [r`$r,s\ge 0$ y $${p.t[0]},${p.t[1]}\in\mathbb{R}$`, 'Puedes usar las fórmulas de seno y coseno de una suma'], meta: p => r`$${p.z}${p.w}=rs\,\mathrm{cis}(${p.t[0]}+${p.t[1]})$`,
    L: p => [
      ['L1', r`Multiplicamos: $${p.z}${p.w}=rs\,[(\cos${p.t[0]}\cos${p.t[1]}-\sin${p.t[0]}\sin${p.t[1]})+i(\sin${p.t[0]}\cos${p.t[1]}+\cos${p.t[0]}\sin${p.t[1]})]$, usando $i^2=-1$.`, 'b.cuerpo-algebra'],
      ['L2', r`Por la fórmula del coseno de una suma, $\cos${p.t[0]}\cos${p.t[1]}-\sin${p.t[0]}\sin${p.t[1]}=\cos(${p.t[0]}+${p.t[1]})$.`, 'b.trig', ['L1']],
      ['L3', r`Por la fórmula del seno de una suma, $\sin${p.t[0]}\cos${p.t[1]}+\cos${p.t[0]}\sin${p.t[1]}=$ ⟦h1⟧.`, 'b.trig', ['L1'], [H('h1', r`\sin(${p.t[0]}+${p.t[1]})`, [r`\cos(${p.t[0]}+${p.t[1]})`, r`\sin(${p.t[0]}-${p.t[1]})`, r`\sin${p.t[0]}\sin${p.t[1]}`])]],
      ['L4', r`Sustituyendo, $${p.z}${p.w}=rs\,(\cos(${p.t[0]}+${p.t[1]})+i\sin(${p.t[0]}+${p.t[1]}))$. ∎`, 'b.cuerpo-algebra', ['L2', 'L3']],
    ],
    dist: p => [[r`Con $${p.t[0]}=\pi/2$ y $${p.t[1]}=\pi/2$: $i\cdot i=-1$ y $\cos\pi=-1$; luego vale siempre.`, 'un ejemplo no prueba el caso general'], [r`Los módulos se suman y los ángulos se multiplican.`, 'es al revés: módulos se multiplican y ángulos se suman']],
    err: p => [['L1', r`Multiplicamos: $${p.z}${p.w}=rs\,[(\cos${p.t[0]}\cos${p.t[1]}+\sin${p.t[0]}\sin${p.t[1]})+i(\sin${p.t[0]}\cos${p.t[1]}+\cos${p.t[0]}\sin${p.t[1]})]$.`, 'error-de-calculo', 'Con $i^2=-1$ el producto de senos lleva signo menos en la parte real.'], ['L2', r`Por la fórmula del coseno de una suma, ese bloque es $\cos(${p.t[0]}-${p.t[1]})$.`, 'error-de-calculo', 'El bloque con signo menos entre los productos es el coseno de la **suma**.']],
    valida: [['trig', r`Desarrollar el producto y reconocer las fórmulas de suma de ángulos`, 'Es la prueba estándar.'], ['exponencial', r`Usar $e^{i\theta}e^{i\varphi}=e^{i(\theta+\varphi)}$`, 'Válida si se admite la exponencial compleja; aquí se parte de las fórmulas trigonométricas.']],
    idea: p => r`desarrolla el producto y agrupa para reconocer el coseno y el seno de una suma.`, primero: p => r`escribe $${p.z}${p.w}$ con las dos formas polares.`,
  });

  R.nivel({
    id: '2.5', mundo: 2, titulo: 'Complejos: forma binomial y polar', tema: 'Operaciones, conjugado, módulo y argumento',
    habilidades: ['2.5.operaciones', '2.5.conjugado-inverso', '2.5.a-polar', '2.5.a-binomial', '2.5.modulo-argumento', '2.5.demostrar'],
    teoremas: ['t.complejo-inverso', 't.conj-producto', 't.modulo-producto', 't.polar-producto'],
    leccion: {
      intro: 'Un **número complejo** es $z=a+bi$ con $a,b\\in\\mathbb{R}$ y $i^2=-1$. Se representa como el punto $(a,b)$ del plano.',
      definiciones: [
        { nombre: 'Operaciones y conjugado', tex: 'Se suman y multiplican como binomios usando $i^2=-1$. El **conjugado** es $\\bar z=a-bi$ y cumple $z\\bar z=a^2+b^2$. Por eso $z^{-1}=\\dfrac{\\bar z}{a^2+b^2}$.' },
        { nombre: 'Módulo y argumento', tex: '$|z|=\\sqrt{a^2+b^2}$ es la distancia al origen y $\\theta=\\operatorname{Arg}(z)$ el ángulo con el eje real. Aquí daremos $|z|^2$ y $\\theta/\\pi$ para que sean racionales.' },
        { nombre: 'Forma polar', tex: '$z=r(\\cos\\theta+i\\sin\\theta)$ con $r=|z|$. Al multiplicar, **los módulos se multiplican y los argumentos se suman**; así, multiplicar por $i$ gira $\\pi/2$.' },
        { nombre: 'Ángulos y valores exactos', tex: 'En los ejes y en las diagonales los valores son exactos: $\\arg(1+i)=\\pi/4$, $\\arg(-1+i)=3\\pi/4$, $\\arg(-i)=-\\pi/2$.' },
      ],
      teorema: 't.polar-producto',
      ejemplo: { enunciado: 'Escribe $z=-1+i$ en forma polar.', pasos: ['$|z|^2=(-1)^2+1^2=2$, así que $|z|=\\sqrt2$.', 'Está en el segundo cuadrante, sobre la diagonal: $\\theta=3\\pi/4$.', '$z=\\sqrt2\\left(\\cos\\frac{3\\pi}{4}+i\\sin\\frac{3\\pi}{4}\\right)$.'] },
    },
  });

  if (typeof module !== 'undefined') module.exports = AC;
})(globalThis.AC = globalThis.AC || {});
