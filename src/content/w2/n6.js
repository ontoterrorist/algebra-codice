/* Mundo 2, nivel 2.6 — De Moivre y raíces n-ésimas. */
(function (AC) {
  const { R, H, T, gen, dem2 } = AC.cont, r = String.raw, Cx = AC.Cx, Rat = AC.Rat, C = AC.conj;
  R.ref({ id: 'b.angulos', tipo: 'propiedad-base', nombre: 'Dos ángulos tienen el mismo seno y coseno si y solo si difieren en un múltiplo de 2π' });

  const HB = (id, nombre) => R.habilidad({ id: '2.6.' + id, nombre, nivel: '2.6' });
  HB('potencias', 'Potencias de complejos'); HB('raices', 'Raíces n-ésimas'); HB('raices-unidad', 'Argumentos de raíces'); HB('identidades-trig', 'Identidades trigonométricas'); HB('poligonos', 'Polígonos regulares'); HB('demostrar', 'Demostrar con De Moivre');
  const TE = (id, titulo, enunciado, requiere, hab) => R.teorema({ id, titulo, nivel: '2.6', enunciado, requiere, habilidades: hab });
  TE('t.de-moivre', 'Fórmula de De Moivre', r`Para $n\in\mathbb{N}$: $(\cos\theta+i\sin\theta)^n=\cos n\theta+i\sin n\theta$.`, ['t.polar-producto'], ['2.6.potencias', '2.6.demostrar']);
  TE('t.de-moivre-entero', 'De Moivre con exponente entero', r`La fórmula de De Moivre vale para todo $n\in\mathbb{Z}$.`, ['t.de-moivre', 't.complejo-inverso'], ['2.6.potencias', '2.6.demostrar']);
  TE('t.raices-enesimas', 'Raíces n-ésimas', r`Si $z=r(\cos\theta+i\sin\theta)\neq 0$, las soluciones de $w^n=z$ son exactamente $n$: $r^{1/n}\left(\cos\frac{\theta+2\pi k}{n}+i\sin\frac{\theta+2\pi k}{n}\right)$, $k=0,\dots,n-1$.`, ['t.de-moivre', 't.modulo-producto'], ['2.6.raices', '2.6.raices-unidad', '2.6.demostrar']);
  TE('t.suma-raices-unidad', 'Suma de las raíces de la unidad', r`Si $n\ge 2$, la suma de las $n$ raíces $n$-ésimas de $1$ es $0$.`, ['t.serie-geometrica', 't.raices-enesimas'], ['2.6.poligonos', '2.6.demostrar']);

  const lista = (z, p) => z.map(q => q.toString());
  /* ---------- generadores ---------- */
  gen.complejo({
    id: 'w2.n6.potencia-de-moivre', nivel: '2.6', habilidades: ['2.6.potencias'], dificultad: 2,
    hacer(rng) {
      const k = rng.int(1, 3), z = rng.pick([Cx.of(k, k), Cx.of(k, -k), Cx.of(-k, k), Cx.of(-k, -k), Cx.of(0, k), Cx.of(-k, 0)]), n = rng.int(-4, 9);
      if (n === 0 || n === 1) return null;
      const res = z.pow(n), arg = z.argPi();
      const f = [['multiplica-por-n', z.mul(Cx.of(n, 0)), 'Elevar a $n$ no es multiplicar por $n$: el módulo se eleva a $n$ y el argumento se multiplica por $n$.'], ['exponente-menos-uno', z.pow(n - 1), 'Te quedaste en $z^{' + (n - 1) + '}$: el exponente pedido es $' + n + '$.']];
      if (n < 0) f.push(['sin-inverso', z.pow(-n), 'Con exponente negativo hay que invertir: $z^{-m}=1/z^m$.']);
      return { key: z.toString() + '^' + n, enun: 'Calcula $(' + z.toTeX() + ')^{' + n + '}$ y escríbelo como $a+bi$ (puedes usar la forma polar: $\\arg z=' + arg.toString() + '\\pi$).', res: res.toString(), firmas: f.map(q => [q[0], q[1].toString(), q[2]]),
        pistas: ['Orientación: pasa $z$ a forma polar, eleva y vuelve a binomial.', 'Idea clave: $z^n=r^n\\left(\\cos n\\theta+i\\sin n\\theta\\right)$.', 'Primer paso: calcula $|z|^2$ y el argumento de $z$.'], expl: '$z^{' + n + '}=' + res.toTeX() + '$.' };
    },
  });

  gen.conjunto({
    id: 'w2.n6.raices-enesimas', nivel: '2.6', habilidades: ['2.6.raices'], dificultad: 3,
    hacer(rng) {
      const k = rng.int(1, 4), caso = rng.pick([
        { enun: 'z^2=' + (-k * k), res: [Cx.of(0, k), Cx.of(0, -k)], par: 'cuadrado negativo' },
        { enun: 'z^2=' + (2 * k * k) + 'i', res: [Cx.of(k, k), Cx.of(-k, -k)] },
        { enun: 'z^2=-' + (2 * k * k) + 'i', res: [Cx.of(k, -k), Cx.of(-k, k)] },
        { enun: 'z^4=' + k ** 4, res: [Cx.of(k, 0), Cx.of(-k, 0), Cx.of(0, k), Cx.of(0, -k)] },
        { enun: 'z^4=-' + (4 * k ** 4), res: [Cx.of(k, k), Cx.of(k, -k), Cx.of(-k, k), Cx.of(-k, -k)] },
      ]);
      const res = lista(caso.res), n = res.length;
      return { key: caso.enun, enun: 'Halla todas las soluciones complejas de $' + caso.enun + '$ (escribe el conjunto, por ejemplo $\\{1+i,\\ -2i\\}$).', res, norm: 'complejo',
        firmas: [['solo-la-mitad', res.slice(0, Math.ceil(n / 2)), 'Hay $' + n + '$ raíces: las demás se obtienen girando $2\\pi/' + n + '$.'], ['solo-reales', lista(caso.res.filter(q => q.im.isZero())), 'También hay raíces no reales: la ecuación tiene exactamente $' + n + '$ soluciones complejas.'], ['conjugadas', lista(caso.res.map(q => q.conj())), 'Revisa las raíces: su conjugado resuelve la ecuación conjugada, que aquí no es la misma.']],
        pistas: ['Orientación: una ecuación $z^n=w$ tiene exactamente $n$ soluciones complejas.', 'Idea clave: las raíces tienen módulo $|w|^{1/n}$ y argumentos $(\\theta+2\\pi k)/n$.', 'Primer paso: pon $w$ en forma polar.'], expl: 'Las soluciones son $' + C.tex(res) + '$.' };
    },
  });

  gen.tupla({
    id: 'w2.n6.argumentos-raices', nivel: '2.6', habilidades: ['2.6.raices-unidad', '2.6.raices'], dificultad: 3,
    hacer(rng) {
      const n = rng.pick([3, 4, 5, 6]), alpha = rng.pick([Rat.of(1, 2), Rat.of(1), Rat.of(-1, 2), Rat.of(1, 3), Rat.of(1, 4), Rat.of(0)]), R0 = rng.int(2, 9);
      const args = Array.from({ length: n }, (_, k) => alpha.add(Rat.of(2 * k)).div(Rat.of(n)));
      const sinK = Array.from({ length: n }, () => alpha.div(Rat.of(n))), medio = Array.from({ length: n }, (_, k) => alpha.add(Rat.of(k)).div(Rat.of(n)));
      const eq = (a, b) => a.every((x, i) => x.sub(b[i]).div(Rat.of(2)).isInt());
      return { key: [n, alpha.toString(), R0].join(','), enun: 'Las $' + n + '$ raíces $' + n + '$-ésimas de $w=' + R0 + '\\left(\\cos ' + alpha.toTeX() + '\\pi+i\\sin ' + alpha.toTeX() + '\\pi\\right)$ tienen la forma $\\rho(\\cos\\varphi_k+i\\sin\\varphi_k)$, $k=0,\\dots,' + (n - 1) + '$. Escribe $\\varphi_k/\\pi$ para cada $k$ (vale cualquier valor equivalente módulo $2$).', campos: Array.from({ length: n }, (_, k) => 'k=' + k), res: args.map(String), mod: args.map(() => 2),
        firmas: [['sin-2pik', sinK, 'Todos los argumentos serían iguales: falta sumar $2\\pi k$ antes de dividir entre $n$.'], ['pik-sin-doble', medio, 'El incremento es $2\\pi k/n$, no $\\pi k/n$: las raíces están equiespaciadas $2\\pi/n$.']].filter(q => !eq(q[1], args)).map(q => [q[0], q[1].map(String), q[2]]),
        pistas: ['Orientación: aplica la fórmula de las raíces: $\\varphi_k=(\\theta+2\\pi k)/n$.', 'Idea clave: los argumentos están separados $2\\pi/n$ y empiezan en $\\theta/n$.', 'Primer paso: calcula $\\varphi_0=\\theta/n$.'], expl: '$\\varphi_k/\\pi=(' + alpha.toString() + '+2k)/' + n + '$.' };
    },
  });

  const poli = (a, v, esU) => { // polinomio en v con coeficientes enteros a[i] (grado i)
    const t = a.map((c, i) => [c, i]).filter(([c]) => c !== 0).reverse();
    return t.map(([c, i], j) => (c < 0 ? '-' : j ? '+' : '') + (Math.abs(c) === 1 && i > 0 ? '' : Math.abs(c)) + (i === 0 ? '' : (Math.abs(c) === 1 ? '' : '*') + v + (i > 1 ? '^' + i : ''))).join('');
  };
  const cheb = (n, U) => { let a = U ? [1] : [1], b = U ? [0, 2] : [0, 1]; if (n === 0) return a; for (let i = 1; i < n; i++) { const c = [0, ...b.map(x => 2 * x)]; a.forEach((x, j) => { c[j] = (c[j] || 0) - x; }); a = b; b = c; } return b; };
  gen.expr({
    id: 'w2.n6.identidades-trig', nivel: '2.6', habilidades: ['2.6.identidades-trig'], dificultad: 3,
    hacer(rng) {
      const v = rng.pick(['c', 'x']), cos = rng.chance(0.6), n = cos ? rng.int(2, 7) : rng.int(2, 6);
      const coef = cheb(cos ? n : n - 1, !cos), res = poli(coef, v);
      const f = cos ? [['solo-termino-mayor', poli(coef.map((c, i) => (i === coef.length - 1 ? c : 0)), v), 'Eso es solo el término de mayor grado: faltan los de grado menor que da el desarrollo de $(\\cos\\theta+i\\sin\\theta)^n$.'], ['potencia', v + '^' + n, '$\\cos n\\theta$ no es $\\cos^n\\theta$: hay que sumar los términos del binomio con $i^2=-1$.']] : [['cos-en-vez-de-sen', poli(cheb(n, false), v), 'Esa es la expresión de $\\cos n\\theta$; aquí se pide $\\sin n\\theta/\\sin\\theta$.']];
      const sig = cos ? [] : [];
      void sig;
      return { key: (cos ? 'cos' : 'sen') + n + v, enun: cos ? 'Usando De Moivre, expresa $\\cos(' + n + '\\theta)$ como polinomio en $' + v + '=\\cos\\theta$ (escribe el polinomio en $' + v + '$).' : 'Usando De Moivre, expresa $\\dfrac{\\sin(' + n + '\\theta)}{\\sin\\theta}$ como polinomio en $' + v + '=\\cos\\theta$ (con $\\sin\\theta\\neq 0$).', vars: [v], res, firmas: f,
        pistas: ['Orientación: desarrolla $(\\cos\\theta+i\\sin\\theta)^n$ con el binomio y toma parte real o imaginaria.', 'Idea clave: $\\sin^2\\theta=1-\\cos^2\\theta$ para dejar todo en $\\cos\\theta$.', 'Primer paso: empieza con $n=2$ y usa la recurrencia $T_{n+1}=2cT_n-T_{n-1}$.'], expl: 'El polinomio es $' + AC.expr.tex(AC.expr.parse(res)) + '$.' };
    },
  });

  gen.conjunto({
    id: 'w2.n6.vertices-cuadrado', nivel: '2.6', habilidades: ['2.6.poligonos', '2.6.raices'], dificultad: 2,
    hacer(rng) {
      const a = rng.int(-5, 5), b = rng.int(-5, 5), c = rng.int(-4, 4), d = rng.int(-4, 4), centro = rng.chance(0.5), P = Cx.of(a, b), C0 = centro ? Cx.of(c, d) : Cx.of(0, 0);
      if (P.sub(C0).isZero() || (a === 0 && b === 0 && !centro)) return null;
      const res = [1, 2, 3].map(k => C0.add(P.sub(C0).mul(Cx.I.pow(k)))), refl = [C0.add(P.sub(C0).conj()), C0.sub(P.sub(C0).conj()), C0.sub(P.sub(C0))];
      return { key: [a, b, centro ? c : 'o', centro ? d : 'o'].join(','), enun: 'Un cuadrado' + (centro ? ' de centro $' + C0.toTeX() + '$' : ' centrado en el origen') + ' tiene un vértice en $' + P.toTeX() + '$ (en el plano complejo). Escribe el conjunto de los otros tres vértices.', res: lista(res), norm: 'complejo',
        firmas: [['reflexiones', lista(refl), 'Giraste con reflexiones en lugar de rotaciones: los vértices se obtienen girando $\\pi/2$, $\\pi$ y $3\\pi/2$ (multiplicando por $i$, $-1$, $-i$) alrededor del centro.'], ...(centro ? [['olvida-el-centro', lista([1, 2, 3].map(k => P.mul(Cx.I.pow(k)))), 'Giraste alrededor del origen; el centro es $' + C0.toTeX() + '$: gira $P-C$ y suma $C$.']] : []), ['solo-opuesto', lista([C0.sub(P.sub(C0))]), 'Falta los otros dos vértices: el opuesto es solo uno de los tres.']],
        pistas: ['Orientación: los vértices de un cuadrado se obtienen girando $\\pi/2$ alrededor del centro.', 'Idea clave: girar $\\pi/2$ es multiplicar por $i$ el vector $P-C$.', 'Primer paso: calcula $P-C$.'], expl: 'Los vértices son $' + C.tex(lista(res)) + '$.' };
    },
  });

  /* ---------- demostraciones ---------- */
  const TH = [['\\theta', 'n'], ['\\alpha', 'm']];
  dem2({
    id: 'dem.de-moivre', teorema: 't.de-moivre', nivel: '2.6', habilidades: ['2.6.potencias', '2.6.demostrar'], requiere: ['t.polar-producto'], refsExtra: ['b.arbitrario', 'd.polar'],
    param: rng => { const [t, n] = rng.pick(TH); return { t, n, z: rng.pick(['z', 'u']) }; },
    enunciado: p => r`Demuestra por inducción que $(\cos${p.t}+i\sin${p.t})^{${p.n}}=\cos ${p.n}${p.t}+i\sin ${p.n}${p.t}$ para todo $${p.n}\in\mathbb{N}$.`,
    hip: p => [r`$${p.t}\in\mathbb{R}$ y $${p.n}\ge 0$ (con $0\in\mathbb{N}$)`, 'Puedes citar el producto en forma polar'], meta: p => r`$(\cos${p.t}+i\sin${p.t})^{${p.n}}=\cos ${p.n}${p.t}+i\sin ${p.n}${p.t}$`,
    L: p => [
      ['L1', r`Sea $${p.z}=\cos${p.t}+i\sin${p.t}$ y $P(${p.n}):\ ${p.z}^{${p.n}}=\cos ${p.n}${p.t}+i\sin ${p.n}${p.t}$. Probamos $P(${p.n})$ para todo $${p.n}\ge 0$ por inducción.`, 'b.peano'],
      ['L2', r`Base: $${p.z}^0=1=\cos 0+i\sin 0$; $P(0)$ se cumple.`, 'b.cuerpo-algebra', ['L1']],
      ['L3', r`Hipótesis de inducción: $${p.z}^{${p.n}}=\cos ${p.n}${p.t}+i\sin ${p.n}${p.t}$ para algún $${p.n}\ge 0$.`, 'hip', ['L1']],
      ['L4', r`Paso: $${p.z}^{${p.n}+1}=${p.z}^{${p.n}}\cdot ${p.z}=(\cos ${p.n}${p.t}+i\sin ${p.n}${p.t})(\cos${p.t}+i\sin${p.t})$, por la hipótesis de inducción.`, 'd.hip-induccion', ['L3']],
      ['L5', r`Por el producto en forma polar (con módulos $1$), eso es $\cos(${p.n}${p.t}+${p.t})+i\sin(${p.n}${p.t}+${p.t})=$ ⟦h1⟧.`, 't.polar-producto', ['L4'], [H('h1', r`\cos(${p.n}+1)${p.t}+i\sin(${p.n}+1)${p.t}`, [r`\cos ${p.n}${p.t}\cos${p.t}+i\sin ${p.n}${p.t}\sin${p.t}`, r`\cos ${p.n}${p.t}+i\sin ${p.t}`, r`\cos(${p.n}${p.t}\cdot ${p.t})+i\sin(${p.n}${p.t}\cdot ${p.t})`])]],
      ['L6', r`Esto es $P(${p.n}+1)$. Por inducción, la fórmula vale para todo $${p.n}\ge 0$. ∎`, 'b.peano', ['L2', 'L5']],
    ],
    dist: p => [[r`Comprobamos con $${p.t}=\pi/4$ y $${p.n}=2,3,4$; coincide; luego siempre.`, 'comprobar casos no es una demostración'], [r`Los módulos se elevan a $${p.n}$ y los ángulos se suman $${p.n}$ veces.`, 'es una descripción, no una prueba por inducción']],
    err: p => [['L4', r`Paso: $${p.z}^{${p.n}+1}=${p.z}^{${p.n}}+${p.z}$.`, 'error-de-calculo', 'Elevar a $n+1$ es multiplicar por $z$, no sumarle $z$.'], ['L5', r`Por el producto en forma polar, los ángulos se multiplican: $\cos(${p.n}${p.t}\cdot ${p.t})+\cdots$`, 'error-de-calculo', 'Los ángulos **se suman** al multiplicar.'], ['L2', r`Base: $${p.z}^0=0$; $P(0)$ se cumple.`, 'error-de-calculo', '$z^0=1$.']],
    valida: [['induccion', r`Inducción simple sobre $n$`, 'Es la prueba estándar.'], ['exponencial', r`Usar $e^{i\theta}$ y $(e^{i\theta})^n=e^{in\theta}$`, 'Es válida si se admite la exponencial compleja; aquí se parte del producto polar.']],
    idea: p => r`multiplica $${p.z}^{${p.n}}$ por $${p.z}$ con el producto polar.`, primero: p => r`comprueba $${p.n}=0$.`,
  });

  dem2({
    id: 'dem.de-moivre-entero', teorema: 't.de-moivre-entero', nivel: '2.6', habilidades: ['2.6.potencias', '2.6.demostrar'], requiere: ['t.de-moivre', 't.complejo-inverso'], refsExtra: ['d.polar', 'd.conjugado'],
    param: rng => { const [t] = rng.pick(TH); return { t, m: rng.pick(['m', 'k']), z: rng.pick(['z', 'u']) }; },
    enunciado: p => r`Demuestra que $(\cos${p.t}+i\sin${p.t})^{-${p.m}}=\cos(-${p.m}${p.t})+i\sin(-${p.m}${p.t})$ para todo entero $${p.m}\ge 1$.`,
    hip: p => [r`$${p.t}\in\mathbb{R}$ y $${p.m}\ge 1$`, 'Puedes citar De Moivre para $n\\ge 0$ y el inverso de un complejo'], meta: p => r`$${p.z}^{-${p.m}}=\cos(-${p.m}${p.t})+i\sin(-${p.m}${p.t})$`,
    L: p => [
      ['L1', r`Sea $${p.z}=\cos${p.t}+i\sin${p.t}$. Su módulo es $\cos^2${p.t}+\sin^2${p.t}=1\neq 0$, así que tiene inverso.`, 'b.cuerpo-algebra'],
      ['L2', r`Por el teorema del inverso de un complejo, $${p.z}^{-1}=\frac{\cos${p.t}-i\sin${p.t}}{1}=\cos(-${p.t})+i\sin(-${p.t})$.`, 't.complejo-inverso', ['L1']],
      ['L3', r`Entonces $${p.z}^{-${p.m}}=(${p.z}^{-1})^{${p.m}}=(\cos(-${p.t})+i\sin(-${p.t}))^{${p.m}}$.`, 'b.cuerpo-algebra', ['L2']],
      ['L4', r`Por De Moivre aplicada al ángulo $-${p.t}$ y al exponente $${p.m}\ge 0$, eso es $\cos(-${p.m}${p.t})+i\sin(-${p.m}${p.t})$. ∎`, 't.de-moivre', ['L3']],
    ],
    dist: p => [[r`Como $${p.z}^{-${p.m}}=1/${p.z}^{${p.m}}$, el ángulo se divide entre $${p.m}$.`, 'el ángulo se multiplica por $-m$, no se divide'], [r`Con $${p.t}=\pi/2$ y $${p.m}=1$: $i^{-1}=-i$; luego siempre.`, 'un ejemplo no prueba el caso general']],
    err: p => [['L2', r`$${p.z}^{-1}=\cos${p.t}+i\sin${p.t}$ porque el módulo es $1$.`, 'error-de-calculo', 'El inverso es el conjugado dividido por el módulo al cuadrado: cambia el signo de la parte imaginaria.'], ['L4', r`Por De Moivre con ángulo $${p.t}$, eso es $\cos(${p.m}${p.t})+i\sin(${p.m}${p.t})$.`, 'conclusion-invalida', 'Hay que aplicar De Moivre al ángulo $-\\theta$.']],
    valida: [['inverso', r`Calcular el inverso con el conjugado y aplicar De Moivre al ángulo opuesto`, 'Es la prueba estándar.'], ['cociente', r`Usar $z^{-m}\cdot z^m=1$ y la unicidad del inverso`, 'También válida, apoyada en el producto polar.']],
    idea: p => r`$${p.z}^{-1}$ es el conjugado, que tiene ángulo $-${p.t}$.`, primero: p => r`calcula $|${p.z}|$ y el inverso de $${p.z}$.`,
  });

  dem2({
    id: 'dem.raices-enesimas', teorema: 't.raices-enesimas', nivel: '2.6', habilidades: ['2.6.raices', '2.6.raices-unidad', '2.6.demostrar'], requiere: ['t.de-moivre', 't.modulo-producto'], refsExtra: ['d.polar', 'b.arbitrario'],
    param: rng => ({ w: rng.pick(['w', 'v']), z: rng.pick(['z', 'u']), n: rng.pick(['n', 'm']), k: rng.pick(['k', 'j']), t: rng.pick(['\\theta', '\\alpha']) }),
    enunciado: p => r`Demuestra que si $${p.z}=r(\cos${p.t}+i\sin${p.t})\neq 0$, las soluciones de $${p.w}^{${p.n}}=${p.z}$ son exactamente $r^{1/${p.n}}\left(\cos\frac{${p.t}+2\pi ${p.k}}{${p.n}}+i\sin\frac{${p.t}+2\pi ${p.k}}{${p.n}}\right)$, $${p.k}=0,\dots,${p.n}-1$.`,
    hip: p => [r`$r>0$, $${p.n}\ge 1$ entero`, 'Puedes citar De Moivre y el módulo de un producto'], meta: p => r`$${p.w}^{${p.n}}=${p.z}\iff ${p.w}=r^{1/${p.n}}\,\mathrm{cis}\frac{${p.t}+2\pi ${p.k}}{${p.n}}$, $${p.k}=0,\dots,${p.n}-1$`,
    L: p => [
      ['L1', r`(⇐) Si $${p.w}=\rho(\cos\varphi+i\sin\varphi)$ con $\rho=r^{1/${p.n}}$ y $\varphi=\frac{${p.t}+2\pi ${p.k}}{${p.n}}$, por De Moivre $${p.w}^{${p.n}}=\rho^{${p.n}}(\cos ${p.n}\varphi+i\sin ${p.n}\varphi)=r(\cos(${p.t}+2\pi ${p.k})+i\sin(${p.t}+2\pi ${p.k}))=${p.z}$.`, 't.de-moivre'],
      ['L2', r`(⇒) Si $${p.w}^{${p.n}}=${p.z}$, entonces $${p.w}\neq 0$ y $${p.w}=\rho(\cos\varphi+i\sin\varphi)$ con $\rho>0$. Tomando módulos, $\rho^{${p.n}}=|${p.w}|^{${p.n}}=|${p.z}|=r$ por el ⟦h1⟧ de un producto.`, 't.modulo-producto'],
      ['L3', r`Por De Moivre, $${p.w}^{${p.n}}=\rho^{${p.n}}(\cos ${p.n}\varphi+i\sin ${p.n}\varphi)$; igualando con $${p.z}$ y dividiendo entre $r$: $\cos ${p.n}\varphi=\cos${p.t}$ y $\sin ${p.n}\varphi=\sin${p.t}$.`, 't.de-moivre', ['L2']],
      ['L4', r`Dos ángulos con el mismo seno y coseno difieren en un múltiplo de $2\pi$: $${p.n}\varphi=${p.t}+2\pi ${p.k}$ para algún $${p.k}\in\mathbb{Z}$.`, 'b.angulos', ['L3']],
      ['L5', r`Los valores $${p.k}$ y $${p.k}+${p.n}$ dan el mismo $${p.w}$, y $${p.k}=0,\dots,${p.n}-1$ dan $${p.n}$ argumentos distintos en $[\frac{${p.t}}{${p.n}},\frac{${p.t}}{${p.n}}+2\pi)$: hay exactamente $${p.n}$ soluciones. ∎`, 'b.angulos', ['L1', 'L4']],
    ],
    dist: p => [[r`Como $${p.w}=${p.z}^{1/${p.n}}$ tiene una sola raíz real positiva, no hay más soluciones.`, 'en $\\mathbb{C}$ hay $n$ raíces'], [r`Con $${p.z}=-1$ y $${p.n}=2$ se obtienen $\pm i$; luego la fórmula vale siempre.`, 'un ejemplo no prueba el caso general']],
    err: p => [['L1', r`(⇐) Por De Moivre, $${p.w}^{${p.n}}=\rho(\cos ${p.n}\varphi+i\sin ${p.n}\varphi)=\cdots$`, 'error-de-calculo', 'El módulo se eleva a $n$: $\\rho^n=r$.'], ['L4', r`Dos ángulos con el mismo seno y coseno son iguales: $${p.n}\varphi=${p.t}$.`, 'caso-faltante', 'Pueden diferir en un múltiplo de $2\\pi$: ese es el origen de las $n$ raíces.'], ['L5', r`Hay infinitas soluciones, una por cada $${p.k}\in\mathbb{Z}$. ∎`, 'conclusion-invalida', 'Los valores de $k$ que difieren en $n$ dan el mismo número: son $n$ distintos.']],
    valida: [['polar', r`Poner $w$ en forma polar y comparar módulos y argumentos`, 'Es la prueba estándar.'], ['polinomio', r`Usar que $w^n-z$ tiene a lo sumo $n$ raíces (Mundo 3)`, 'Cuenta bien, pero ese teorema aún no está disponible; la prueba aquí no lo necesita.']],
    idea: p => r`escribe $${p.w}$ en forma polar y aplica De Moivre a $${p.w}^{${p.n}}=${p.z}$.`, primero: p => r`prueba que cada número de la lista es raíz.`,
  });

  dem2({
    id: 'dem.suma-raices-unidad', teorema: 't.suma-raices-unidad', nivel: '2.6', habilidades: ['2.6.poligonos', '2.6.demostrar'], requiere: ['t.serie-geometrica', 't.raices-enesimas'], refsExtra: ['d.polar', 'b.angulos'],
    param: rng => ({ n: rng.pick(['n', 'm']), w: rng.pick(['\\omega', '\\zeta']), k: rng.pick(['k', 'j']) }),
    enunciado: p => r`Demuestra que si $${p.n}\ge 2$, la suma de las $${p.n}$ raíces $${p.n}$-ésimas de $1$ es $0$.`,
    hip: p => [r`$${p.n}\ge 2$ es un entero`, 'Puedes citar las raíces n-ésimas y la suma geométrica'], meta: p => r`$\sum_{${p.k}=0}^{${p.n}-1}${p.w}^{${p.k}}=0$`,
    L: p => [
      ['L1', r`Por el teorema de las raíces $${p.n}$-ésimas aplicado a $1$, estas son $${p.w}^${p.k}$ con $${p.w}=\cos\frac{2\pi}{${p.n}}+i\sin\frac{2\pi}{${p.n}}$ y $${p.k}=0,\dots,${p.n}-1$.`, 't.raices-enesimas'],
      ['L2', r`Como $${p.n}\ge 2$, $0<\frac{2\pi}{${p.n}}<2\pi$, así que $${p.w}\neq 1$.`, 'b.angulos', ['L1']],
      ['L3', r`Por la suma geométrica con $r=${p.w}\neq 1$: $\sum_{${p.k}=0}^{${p.n}-1}${p.w}^${p.k}=\dfrac{${p.w}^{${p.n}}-1}{${p.w}-1}$.`, 't.serie-geometrica', ['L2']],
      ['L4', r`Como $${p.w}$ es raíz $${p.n}$-ésima de $1$, $${p.w}^{${p.n}}=1$; el numerador es $0$ y el denominador $\neq 0$: la suma es $0$. ∎`, 'b.cuerpo-algebra', ['L1', 'L3']],
    ],
    dist: p => [[r`Con $${p.n}=4$ las raíces $1,i,-1,-i$ suman $0$; luego siempre.`, 'un ejemplo no prueba el caso general'], [r`Por simetría de los vértices del polígono, el centro es el origen, así que la suma es $0$.`, 'es una intuición geométrica: hace falta el cálculo']],
    err: p => [['L2', r`Como $${p.n}\ge 2$, $${p.w}=1$.`, 'conclusion-invalida', '$\\omega=1$ solo ocurre con $n=1$.'], ['L3', r`Por la suma geométrica, la suma es $\dfrac{${p.w}^{${p.n}}-1}{${p.w}+1}$.`, 'error-de-calculo', 'El denominador es $r-1$.'], ['L4', r`Como $${p.w}^{${p.n}}=0$, la suma es $0$. ∎`, 'error-de-calculo', '$\\omega^n=1$, no $0$.']],
    valida: [['geometrica', r`Escribir las raíces como potencias de $\omega$ y sumar la progresión geométrica`, 'Es la prueba estándar.'], ['vieta', r`Usar las relaciones de Cardano-Vieta en $z^n-1$ (Mundo 3)`, 'Válida: el coeficiente de $z^{n-1}$ es $0$; todavía no se dispone de ella.']],
    idea: p => r`las raíces son las potencias de $${p.w}=\mathrm{cis}(2\pi/${p.n})$ y su suma es geométrica.`, primero: p => r`explica por qué $${p.w}\neq 1$.`,
  });

  R.nivel({
    id: '2.6', mundo: 2, titulo: 'De Moivre y raíces', tema: 'Potencias, raíces n-ésimas y polígonos regulares',
    habilidades: ['2.6.potencias', '2.6.raices', '2.6.raices-unidad', '2.6.identidades-trig', '2.6.poligonos', '2.6.demostrar'],
    teoremas: ['t.de-moivre', 't.de-moivre-entero', 't.raices-enesimas', 't.suma-raices-unidad'],
    leccion: {
      intro: 'La forma polar convierte las potencias en operaciones sencillas: **el módulo se eleva y el argumento se multiplica**. De ahí salen las raíces y los polígonos regulares.',
      definiciones: [
        { nombre: 'De Moivre', tex: '$(\\cos\\theta+i\\sin\\theta)^n=\\cos n\\theta+i\\sin n\\theta$ para todo entero $n$. Para $z=r(\\cos\\theta+i\\sin\\theta)$: $z^n=r^n(\\cos n\\theta+i\\sin n\\theta)$.' },
        { nombre: 'Raíces n-ésimas', tex: 'Hay exactamente $n$ raíces de $w^n=z$: tienen módulo $r^{1/n}$ y argumentos $\\frac{\\theta+2\\pi k}{n}$, $k=0,\\dots,n-1$. Forman un polígono regular de $n$ lados.' },
        { nombre: 'Raíces de la unidad', tex: 'Las raíces $n$-ésimas de $1$ son $1,\\omega,\\omega^2,\\dots,\\omega^{n-1}$ con $\\omega=\\cos\\frac{2\\pi}{n}+i\\sin\\frac{2\\pi}{n}$. Su suma es $0$ si $n\\ge 2$.' },
        { nombre: 'Identidades trigonométricas', tex: 'Desarrollando $(\\cos\\theta+i\\sin\\theta)^n$ y tomando partes real e imaginaria se obtienen $\\cos n\\theta$ y $\\sin n\\theta$ en función de $\\cos\\theta$ y $\\sin\\theta$.' },
      ],
      teorema: 't.raices-enesimas',
      ejemplo: { enunciado: 'Resuelve $z^4=-4$.', pasos: ['$-4=4(\\cos\\pi+i\\sin\\pi)$, así que $|z|=4^{1/4}=\\sqrt2$.', 'Los argumentos son $\\frac{\\pi+2\\pi k}{4}$: $\\frac\\pi4,\\frac{3\\pi}{4},\\frac{5\\pi}{4},\\frac{7\\pi}{4}$.', 'Entonces $z=\\sqrt2\\,(\\pm\\frac{\\sqrt2}{2}\\pm\\frac{\\sqrt2}{2}i)=\\pm1\\pm i$.'] },
    },
  });

  if (typeof module !== 'undefined') module.exports = AC;
})(globalThis.AC = globalThis.AC || {});
