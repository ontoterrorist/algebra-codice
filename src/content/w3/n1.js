/* Mundo 3, nivel 3.1 — División de polinomios y teorema del resto. */
(function (AC) {
  const { R, H, T, gen, dem2 } = AC.cont, r = String.raw, P = AC.poly, E = AC.expr, Rat = AC.Rat;
  const ref = (id, tipo, nombre) => R.ref({ id, tipo, nombre });
  ref('d.grado', 'definicion', 'Grado: el mayor exponente con coeficiente no nulo'); ref('b.sin-divisores-cero', 'propiedad-base', 'En ℚ, ℝ y ℂ: si ab = 0 entonces a = 0 o b = 0');
  ref('d.division-polinomios', 'definicion', 'División de polinomios: p = dq + r con grado de r menor que el de d'); ref('d.raiz', 'definicion', 'Raíz de p: un número a con p(a) = 0');

  const HB = (id, nombre) => R.habilidad({ id: '3.1.' + id, nombre, nivel: '3.1' });
  HB('division', 'Dividir polinomios'); HB('resto', 'Teorema del resto'); HB('horner', 'Regla de Horner'); HB('parametros', 'Parámetros y divisibilidad'); HB('demostrar', 'Demostrar con polinomios');
  const TE = (id, titulo, enunciado, requiere, hab) => R.teorema({ id, titulo, nivel: '3.1', enunciado, requiere, habilidades: hab });
  TE('t.grado-producto', 'Grado de un producto', r`Si $p,q\neq 0$, entonces $\operatorname{gr}(pq)=\operatorname{gr}p+\operatorname{gr}q$.`, [], ['3.1.division', '3.1.demostrar']);
  TE('t.division-polinomios', 'División de polinomios', r`Si $d\neq 0$, existen $q,r$ únicos con $p=dq+r$ y $\operatorname{gr}r<\operatorname{gr}d$.`, ['t.grado-producto'], ['3.1.division', '3.1.demostrar']);
  TE('t.teorema-resto', 'Teorema del resto', r`El resto de dividir $p(x)$ entre $x-a$ es $p(a)$.`, ['t.division-polinomios'], ['3.1.resto', '3.1.horner', '3.1.demostrar']);
  TE('t.teorema-factor', 'Teorema del factor', r`$(x-a)\mid p(x)$ si y solo si $p(a)=0$.`, ['t.teorema-resto'], ['3.1.parametros', '3.1.resto', '3.1.demostrar']);

  /* utilidades de generación */
  const P_ = (...c) => P.de(c);
  const cadena = (p, v) => P.str(p, v), texto = (p) => P.tex(p, 'x');
  const rndPoly = (rng, g, lo, hi, monico) => { const c = Array.from({ length: g + 1 }, () => rng.int(lo, hi)); c[g] = monico ? 1 : rng.pick([1, 2, 3, -1]); return P.de(c); };

  /* ---------- generadores ---------- */
  gen.expr({
    id: 'w3.n1.cociente-division', nivel: '3.1', habilidades: ['3.1.division'], dificultad: 2,
    hacer(rng) {
      const q = rndPoly(rng, rng.int(1, 3), -4, 5, false), d = rng.chance(0.5) ? P_(rng.int(-5, 5), 1) : P_(rng.int(-4, 4), rng.int(-3, 3), 1), rr = rndPoly(rng, P.grado(d) - 1, -5, 6, false);
      const p = P.add(P.mul(d, q), rr); if (P.grado(q) < 1 || P.esCero(rr)) return null;
      const sg = P.de(q.map((c, i) => (i === 0 ? c.neg() : c))), sin = P.de(q.slice(1));
      return { key: cadena(p) + '/' + cadena(d), enun: 'Divide $p(x)=' + texto(p) + '$ entre $d(x)=' + texto(d) + '$ y escribe el cociente $q(x)$.', res: cadena(q), vars: ['x'],
        firmas: [['signo-del-termino-independiente', cadena(sg), 'Revisa el signo del último término del cociente al restar en la última etapa.'], ['sin-termino-independiente', cadena(sin), 'Te falta el último término del cociente: sigue dividiendo mientras el grado del resto sea $\\ge$ el de $d$.'], ['resto-como-cociente', cadena(rr), 'Eso es el resto, no el cociente.']],
        pistas: ['Orientación: divide término a término, como en la división larga.', 'Idea clave: cada paso divide el término líder del resto actual entre el de $d$ y resta ese múltiplo de $d$.', 'Primer paso: divide $' + texto(P.de([p[p.length - 1]].map(c => c))) + 'x^{' + P.grado(p) + '}$ entre el líder de $d$.'], expl: '$p=d\\cdot q+r$ con $q=' + texto(q) + '$ y $r=' + texto(rr) + '$.' };
    },
  });

  gen.expr({
    id: 'w3.n1.resto-division', nivel: '3.1', habilidades: ['3.1.division'], dificultad: 2,
    hacer(rng) {
      const q = rndPoly(rng, rng.int(1, 2), -3, 4, false), d = P_(rng.int(-4, 4), rng.int(-3, 3), 1), rr = rndPoly(rng, 1, -6, 7, false);
      if (P.grado(rr) < 1) return null;
      const p = P.add(P.mul(d, q), rr), signo = P.de(rr.map(c => c.neg()));
      return { key: cadena(p) + '/' + cadena(d), enun: 'Halla el resto de dividir $p(x)=' + texto(p) + '$ entre $d(x)=' + texto(d) + '$ (un polinomio de grado menor que $2$).', res: cadena(rr), vars: ['x'],
        firmas: [['cociente', cadena(q), 'Eso es el cociente; piden el resto.'], ['resto-con-signo-cambiado', cadena(signo), 'El resto es el que queda después de restar: revisa los signos de la última resta.']],
        pistas: ['Orientación: haz la división larga hasta que el grado del resto sea menor que $2$.', 'Idea clave: $p=dq+r$; el resto tiene grado $\\le 1$ (forma $ax+b$).', 'Primer paso: divide el término líder de $p$ entre el de $d$.'], expl: 'El resto es $' + texto(rr) + '$.' };
    },
  });

  gen.entero({
    id: 'w3.n1.teorema-resto', nivel: '3.1', habilidades: ['3.1.resto'], dificultad: 1,
    hacer(rng) {
      const p = rndPoly(rng, rng.int(3, 5), -6, 7, false), a = rng.int(-3, 4); if (a === 0) return null;
      const v = P.evalua(p, Rat.of(a)), res = Number(v.n);
      const d = a > 0 ? 'x-' + a : 'x+' + (-a);
      return { key: cadena(p) + '|' + a, enun: '¿Cuál es el resto de dividir $p(x)=' + texto(p) + '$ entre $' + d + '$? (Sin hacer la división larga.)', res,
        firmas: [['p-de-menos-a', Number(P.evalua(p, Rat.of(-a)).n), 'Con $x-a$ se evalúa en $a$ (aquí $a=' + a + '$), no en $-a$.'], ['p-de-cero', Number(p[0].n), 'Eso es $p(0)$; el resto es $p(a)$.'], ['suma-coeficientes', Number(p.reduce((s, c) => s.add(c), Rat.of(0)).n), 'Eso es $p(1)$; hay que evaluar en $a=' + a + '$.']],
        pistas: ['Orientación: el resto de dividir entre $x-a$ es un número.', 'Idea clave: teorema del resto: es $p(a)$.', 'Primer paso: identifica $a$ en $' + d + '$ (cuidado con el signo).'], expl: '$p(' + a + ')=' + res + '$.' };
    },
  });

  gen.entero({
    id: 'w3.n1.horner-coeficiente', nivel: '3.1', habilidades: ['3.1.horner', '3.1.division'], dificultad: 2,
    hacer(rng) {
      const p = rndPoly(rng, rng.int(3, 5), -5, 6, false), a = rng.int(-3, 4); if (a === 0) return null;
      const h = P.horner(p, Rat.of(a)), q = h.q; if (q.length < 2) return null;
      const k = rng.int(0, q.length - 1), res = Number(q[k].n);
      return { key: cadena(p) + '|' + a + '|' + k, enun: 'Al dividir $p(x)=' + texto(p) + '$ entre $x' + (a > 0 ? '-' + a : '+' + (-a)) + '$ con la regla de Horner (división sintética), ¿cuál es el coeficiente de $x^{' + k + '}$ en el cociente?', res,
        firmas: [['resto', Number(h.r.n), 'Eso es el resto (la última casilla de la tabla), no un coeficiente del cociente.'], ['otro-coeficiente', Number((q[k + 1] || q[k - 1] || q[k]).n), 'Revisa el desplazamiento: el coeficiente de $x^{' + k + '}$ es la casilla correspondiente a $x^{' + (k + 1) + '}$ de $p$.'], ['sin-acarreo', Number(p[k + 1].n), 'Falta el acarreo: cada casilla suma el coeficiente de $p$ y $a$ veces la anterior.']],
        pistas: ['Orientación: baja el primer coeficiente y repite: multiplicar por $a$ y sumar.', 'Idea clave: cada casilla es $c_i+a\\cdot(\\text{casilla anterior})$; la última es el resto.', 'Primer paso: escribe los coeficientes de $p$ en orden decreciente.'], expl: 'El cociente es $' + texto(q) + '$ y el coeficiente pedido es ' + res + '.' };
    },
  });

  gen.entero({
    id: 'w3.n1.determinar-parametro', nivel: '3.1', habilidades: ['3.1.parametros'], dificultad: 3,
    hacer(rng) {
      const a = rng.int(-3, 4), k = rng.int(-6, 7); if (a === 0 || k === 0) return null;
      const g = rng.int(3, 4), base = rndPoly(rng, g, -4, 5, true); base[1] = Rat.of(0); const b2 = P.de(base);
      const num = P.evalua(b2, Rat.of(a)), coefK = Rat.of(a), ks = num.neg().div(coefK);
      if (!ks.isInt() || ks.isZero()) return null;
      const res = Number(ks.n), p = P.add(b2, P_(0, res));
      const mostrado = P.add(b2, P_(0, 0));
      return { key: cadena(b2) + '|' + a, enun: 'Halla $k$ para que $x' + (a > 0 ? '-' + a : '+' + (-a)) + '$ divida a $p(x)=' + texto(mostrado) + '+kx$ (es decir, $p(' + a + ')=0$).', res,
        firmas: [['signo', -res, 'Despeja con cuidado: $p(' + a + ')=0$ da $' + a + 'k=-(\\text{parte fija})$.'], ['evalua-en-menos-a', Number(P.evalua(b2, Rat.of(-a)).n) * (a > 0 ? 1 : 1), 'Hay que evaluar en $a=' + a + '$, no en $-a$.'], ['sin-dividir', Number(num.neg().n), 'Falta dividir entre $' + a + '$ (el coeficiente de $k$).']],
        pistas: ['Orientación: usa el teorema del factor.', 'Idea clave: $x-a$ divide a $p$ si y solo si $p(a)=0$; eso da una ecuación en $k$.', 'Primer paso: calcula la parte fija de $p(' + a + ')$.'], expl: '$p(' + a + ')=0$ da $k=' + res + '$.' };
    },
  });

  /* ---------- demostraciones ---------- */
  dem2({
    id: 'dem.grado-producto', teorema: 't.grado-producto', nivel: '3.1', habilidades: ['3.1.division', '3.1.demostrar'], requiere: [], refsExtra: ['d.raiz', 'b.arbitrario'],
    param: rng => ({ p: rng.pick(['p', 'f']), q: rng.pick(['q', 'g']), m: rng.pick(['m', 'r']), n: rng.pick(['n', 's']) }),
    enunciado: p => r`Demuestra que si $${p.p},${p.q}\neq 0$ son polinomios con coeficientes en $\mathbb{Q}$, entonces $\operatorname{gr}(${p.p}${p.q})=\operatorname{gr}${p.p}+\operatorname{gr}${p.q}$.`,
    hip: p => [r`$${p.p}\neq 0$ y $${p.q}\neq 0$`, r`en $\mathbb{Q}$: $ab=0\Rightarrow a=0$ o $b=0$`], meta: p => r`$\operatorname{gr}(${p.p}${p.q})=\operatorname{gr}${p.p}+\operatorname{gr}${p.q}$`,
    L: p => [
      ['L1', r`Sean $\operatorname{gr}${p.p}=${p.m}$ y $\operatorname{gr}${p.q}=${p.n}$, con coeficientes líderes $a_${p.m}\neq 0$ y $b_${p.n}\neq 0$.`, 'd.grado'],
      ['L2', r`En el producto $${p.p}${p.q}$ todos los términos tienen grado $\le ${p.m}+${p.n}$, y el único de grado $${p.m}+${p.n}$ es $a_${p.m}b_${p.n}x^{${p.m}+${p.n}}$.`, 'b.cuerpo-algebra', ['L1']],
      ['L3', r`Como $a_${p.m}\neq 0$ y $b_${p.n}\neq 0$, por ser ⟦h1⟧ en $\mathbb{Q}$, $a_${p.m}b_${p.n}\neq 0$.`, 'b.sin-divisores-cero', ['L1'], [H('h1', 'un cuerpo (sin divisores de cero)', ['un cuerpo (sin divisores de cero)', 'un anillo cualquiera', 'conmutativo'], false)]],
      ['L4', r`Luego el término líder de $${p.p}${p.q}$ es $a_${p.m}b_${p.n}x^{${p.m}+${p.n}}$ y $\operatorname{gr}(${p.p}${p.q})=${p.m}+${p.n}$. ∎`, 'd.grado', ['L2', 'L3']],
    ],
    dist: p => [[r`Con $${p.p}=x+1$, $${p.q}=x-1$: $\operatorname{gr}(x^2-1)=2=1+1$; luego siempre.`, 'un ejemplo no prueba el caso general'], [r`El grado de un producto es el máximo de los grados.`, 'eso es para la suma, no para el producto']],
    err: p => [['L2', r`En el producto, el término de mayor grado es $(a_${p.m}+b_${p.n})x^{${p.m}+${p.n}}$.`, 'error-de-calculo', 'Los líderes se multiplican, no se suman.'], ['L3', r`Como $a_${p.m}\neq 0$ y $b_${p.n}\neq 0$, $a_${p.m}b_${p.n}=0$.`, 'conclusion-invalida', 'Al revés: en un cuerpo el producto de no nulos es no nulo.']],
    valida: [['lideres', r`Multiplicar los coeficientes líderes y verificar que no se anulan`, 'Es la prueba estándar.']],
    idea: p => r`el coeficiente de $x^{${p.m}+${p.n}}$ es $a_${p.m}b_${p.n}\neq 0$.`, primero: p => r`escribe los coeficientes líderes de $${p.p}$ y $${p.q}$.`,
  });

  dem2({
    id: 'dem.division-polinomios', teorema: 't.division-polinomios', nivel: '3.1', habilidades: ['3.1.division', '3.1.demostrar'], requiere: ['t.grado-producto'], refsExtra: ['b.contradiccion', 'b.arbitrario', 'd.grado'],
    param: rng => ({ p: rng.pick(['p', 'f']), d: rng.pick(['d', 'g']), q: rng.pick(['q', 'h']), r: rng.pick(['r', 's']) }),
    enunciado: p => r`Demuestra que si $${p.d}\neq 0$, existen polinomios únicos $${p.q},${p.r}$ con $${p.p}=${p.d}${p.q}+${p.r}$ y $\operatorname{gr}${p.r}<\operatorname{gr}${p.d}$ (o $${p.r}=0$).`,
    hip: p => [r`$${p.p},${p.d}\in\mathbb{Q}[x]$, $${p.d}\neq 0$`, 'Puedes citar el grado de un producto'], meta: p => r`existen y son únicos $${p.q},${p.r}$ con $${p.p}=${p.d}${p.q}+${p.r}$, $\operatorname{gr}${p.r}<\operatorname{gr}${p.d}$`,
    L: p => [
      ['L1', r`Existencia, por inducción sobre $\operatorname{gr}${p.p}$. Si $\operatorname{gr}${p.p}<\operatorname{gr}${p.d}$ (o $${p.p}=0$): $${p.q}=0$ y $${p.r}=${p.p}$.`, 'b.peano'],
      ['L2', r`Si $\operatorname{gr}${p.p}=n\ge\operatorname{gr}${p.d}=m$, con líderes $a_n$ y $b_m$, sea $${p.p}_1=${p.p}-\frac{a_n}{b_m}x^{n-m}${p.d}$: se cancela el término de grado $n$, así que $\operatorname{gr}${p.p}_1<n$.`, 'd.division-polinomios', ['L1']],
      ['L3', r`Por hipótesis de inducción, $${p.p}_1=${p.d}${p.q}_1+${p.r}$ con $\operatorname{gr}${p.r}<\operatorname{gr}${p.d}$; entonces $${p.p}=${p.d}\left(${p.q}_1+\frac{a_n}{b_m}x^{n-m}\right)+${p.r}$.`, 'd.hip-induccion', ['L2']],
      ['L4', r`Unicidad: si $${p.d}${p.q}+${p.r}=${p.d}${p.q}'+${p.r}'$, entonces $${p.d}(${p.q}-${p.q}')=${p.r}'-${p.r}$ con $\operatorname{gr}(${p.r}'-${p.r})<\operatorname{gr}${p.d}$.`, 'b.cuerpo-algebra', ['L3']],
      ['L5', r`Si $${p.q}\neq ${p.q}'$, por el grado de un producto $\operatorname{gr}(${p.d}(${p.q}-${p.q}'))\ge\operatorname{gr}${p.d}$, mayor que $\operatorname{gr}(${p.r}'-${p.r})$: contradicción. Luego $${p.q}=${p.q}'$ y $${p.r}=${p.r}'$. ∎`, 't.grado-producto', ['L4']],
    ],
    dist: p => [[r`Dividimos $x^3+1$ entre $x+1$ y sale $x^2-x+1$ sin resto; luego siempre hay división exacta.`, 'un ejemplo no prueba el teorema (y la división no siempre es exacta)'], [r`Como los coeficientes son racionales, el resto siempre es una constante.`, 'solo si $d$ tiene grado $1$']],
    err: p => [['L2', r`Sea $${p.p}_1=${p.p}+\frac{a_n}{b_m}x^{n-m}${p.d}$.`, 'error-de-calculo', 'Hay que **restar** para cancelar el término líder.'], ['L5', r`Como $\operatorname{gr}(${p.d}(${p.q}-${p.q}'))=\operatorname{gr}${p.d}+\operatorname{gr}(${p.q}-${p.q}')<\operatorname{gr}${p.d}$.`, 'conclusion-invalida', 'La suma de grados con $q-q\'\\neq 0$ es **mayor o igual** que $\\operatorname{gr}d$.']],
    valida: [['induccion', r`Inducción sobre el grado de $p$ restando un múltiplo de $d$ que cancela el término líder`, 'Es la prueba estándar (formaliza la división larga).'], ['sistema', r`Plantear $p=dq+r$ con coeficientes desconocidos y resolver el sistema triangular`, 'También válida; se justifica con el mismo argumento de grados.']],
    idea: p => r`resta a $${p.p}$ un múltiplo de $${p.d}$ que cancele el término líder y repite.`, primero: p => r`trata el caso $\operatorname{gr}${p.p}<\operatorname{gr}${p.d}$.`,
  });

  dem2({
    id: 'dem.teorema-resto', teorema: 't.teorema-resto', nivel: '3.1', habilidades: ['3.1.resto', '3.1.horner', '3.1.demostrar'], requiere: ['t.division-polinomios'], refsExtra: ['d.raiz', 'b.arbitrario'],
    param: rng => ({ p: rng.pick(['p', 'f']), a: rng.pick(['a', 'c']), q: rng.pick(['q', 'h']) }),
    enunciado: p => r`Demuestra que el resto de dividir $${p.p}(x)$ entre $x-${p.a}$ es $${p.p}(${p.a})$.`,
    hip: p => [r`$${p.p}\in\mathbb{Q}[x]$ y $${p.a}\in\mathbb{Q}$`, 'Puedes citar la división de polinomios'], meta: p => r`$${p.p}(x)=(x-${p.a})${p.q}(x)+${p.p}(${p.a})$`,
    L: p => [
      ['L1', r`Por la división de polinomios, existen $${p.q},r$ únicos con $${p.p}(x)=(x-${p.a})${p.q}(x)+r(x)$ y $\operatorname{gr}r<\operatorname{gr}(x-${p.a})=1$.`, 't.division-polinomios'],
      ['L2', r`Como $\operatorname{gr}r<1$, $r$ es una constante $\rho$.`, 'd.grado', ['L1']],
      ['L3', r`Evaluando en $x=${p.a}$: $${p.p}(${p.a})=(${p.a}-${p.a})${p.q}(${p.a})+\rho=$ ⟦h1⟧.`, 'b.cuerpo-algebra', ['L2'], [H('h1', r`\rho`, [r`0`, r`${p.a}`, r`${p.q}(${p.a})`])]],
      ['L4', r`Luego el resto es $\rho=${p.p}(${p.a})$. ∎`, 'd.division-polinomios', ['L3']],
    ],
    dist: p => [[r`Con $${p.p}=x^2+1$ y $${p.a}=2$: el resto es $5=${p.p}(2)$; luego siempre.`, 'un ejemplo no prueba el teorema'], [r`El resto es $${p.p}(-${p.a})$.`, 'el signo se confunde: se evalúa en $a$']],
    err: p => [['L2', r`Como $\operatorname{gr}r<1$, $r=0$.`, 'conclusion-invalida', 'Grado menor que $1$ significa constante, no necesariamente cero.'], ['L3', r`Evaluando en $x=${p.a}$: $${p.p}(${p.a})=(${p.a}-${p.a})${p.q}(${p.a})+\rho=${p.q}(${p.a})+\rho$.`, 'error-de-calculo', 'El factor $(a-a)$ anula todo el término con $q$.']],
    valida: [['evaluar', r`Evaluar la identidad de la división en $x=a$`, 'Es la prueba estándar.'], ['horner', r`Justificar la regla de Horner paso a paso`, 'Equivale a la división sintética y da el mismo resto.']],
    idea: p => r`evalúa $${p.p}=(x-${p.a})${p.q}+r$ en $x=${p.a}$.`, primero: p => r`aplica la división de polinomios con divisor $x-${p.a}$.`,
  });

  dem2({
    id: 'dem.teorema-factor', teorema: 't.teorema-factor', nivel: '3.1', habilidades: ['3.1.parametros', '3.1.resto', '3.1.demostrar'], requiere: ['t.teorema-resto'], refsExtra: ['b.doble-implicacion', 'd.raiz'],
    param: rng => ({ p: rng.pick(['p', 'f']), a: rng.pick(['a', 'c']), q: rng.pick(['q', 'h']) }),
    enunciado: p => r`Demuestra que $(x-${p.a})\mid ${p.p}(x)$ si y solo si $${p.p}(${p.a})=0$.`,
    hip: p => [r`$${p.p}\in\mathbb{Q}[x]$ y $${p.a}\in\mathbb{Q}$`, 'Puedes citar el teorema del resto'], meta: p => r`$(x-${p.a})\mid ${p.p}\iff ${p.p}(${p.a})=0$`,
    L: p => [
      ['L1', r`Por el teorema del resto, $${p.p}(x)=(x-${p.a})${p.q}(x)+${p.p}(${p.a})$.`, 't.teorema-resto'],
      ['L2', r`(⇒) Si $(x-${p.a})\mid ${p.p}$, el resto de la división es $0$; por L1, el resto es $${p.p}(${p.a})$, así que $${p.p}(${p.a})=0$.`, 'd.division-polinomios', ['L1']],
      ['L3', r`(⇐) Si $${p.p}(${p.a})=0$, entonces $${p.p}(x)=(x-${p.a})${p.q}(x)$, es decir $(x-${p.a})\mid ${p.p}(x)$.`, 'b.cuerpo-algebra', ['L1']],
      ['L4', r`Se cumplen las dos implicaciones. ∎`, 'b.doble-implicacion', ['L2', 'L3']],
    ],
    dist: p => [[r`Como $${p.p}(${p.a})=0$, $${p.a}$ es raíz y por eso $(x+${p.a})$ divide a $${p.p}$.`, 'el factor es $x-a$, no $x+a$'], [r`Con $${p.p}=x^2-1$ y $${p.a}=1$ se cumple; luego siempre.`, 'un ejemplo no prueba el teorema']],
    err: p => [['L2', r`(⇒) ... el resto es $0$; luego $${p.p}(0)=0$.`, 'error-de-calculo', 'Se evalúa en $a$, no en $0$.'], ['L3', r`(⇐) Si $${p.p}(${p.a})=0$, entonces $${p.p}(x)=${p.q}(x)$.`, 'error-de-calculo', 'Queda $p(x)=(x-a)q(x)$: el factor $(x-a)$ no desaparece.']],
    valida: [['resto', r`Aplicar el teorema del resto en ambos sentidos`, 'Es la prueba estándar.']],
    idea: p => r`$${p.p}(x)=(x-${p.a})${p.q}+${p.p}(${p.a})$: el resto es cero si y solo si $${p.p}(${p.a})=0$.`, primero: p => r`escribe la identidad del teorema del resto.`,
  });

  R.nivel({
    id: '3.1', mundo: 3, titulo: 'División y teorema del resto', tema: 'División de polinomios, resto y teorema del factor',
    habilidades: ['3.1.division', '3.1.resto', '3.1.horner', '3.1.parametros', '3.1.demostrar'],
    teoremas: ['t.grado-producto', 't.division-polinomios', 't.teorema-resto', 't.teorema-factor'],
    leccion: {
      intro: 'Un **polinomio** es una expresión $p(x)=a_nx^n+\\cdots+a_1x+a_0$. Su **grado** es el mayor exponente con coeficiente no nulo. Se pueden dividir como los enteros.',
      definiciones: [
        { nombre: 'Grado y producto', tex: 'Si $p,q\\neq 0$ (con coeficientes racionales o reales), $\\operatorname{gr}(pq)=\\operatorname{gr}p+\\operatorname{gr}q$: los coeficientes líderes se multiplican y no se anulan.' },
        { nombre: 'División con resto', tex: 'Si $d\\neq 0$, existen únicos $q,r$ con $p=dq+r$ y $\\operatorname{gr}r<\\operatorname{gr}d$. Se calcula con la división larga o, si $d=x-a$, con la **regla de Horner**.' },
        { nombre: 'Teoremas del resto y del factor', tex: 'El resto de dividir $p(x)$ entre $x-a$ es $p(a)$. Por tanto $(x-a)\\mid p(x)$ si y solo si $p(a)=0$, es decir, si $a$ es **raíz**.' },
        { nombre: 'Horner', tex: 'Para dividir entre $x-a$ se baja el primer coeficiente y, en cada paso, se multiplica por $a$ y se suma al coeficiente siguiente. La última casilla es el resto.' },
      ],
      teorema: 't.teorema-resto',
      ejemplo: { enunciado: 'Halla el resto de $p(x)=x^3-2x+5$ entre $x+2$.', pasos: ['$x+2=x-(-2)$: evaluamos en $a=-2$.', '$p(-2)=(-8)-2(-2)+5=-8+4+5=1$.', 'El resto es $1$ (y $x+2$ no divide a $p$).'] },
    },
  });

  if (typeof module !== 'undefined') module.exports = AC;
})(globalThis.AC = globalThis.AC || {});
