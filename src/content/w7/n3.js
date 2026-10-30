/* Mundo 7, nivel 7.3 — Producto interno, proyecciones y Gram-Schmidt. */
(function (AC) {
  const { R, H, T, gen, dem2 } = AC.cont, r = String.raw, M = AC.mat, Rat = AC.Rat;
  const ref = (id, tipo, nombre) => R.ref({ id, tipo, nombre });
  ref('d.producto-punto', 'definicion', 'Producto punto: u·v = Σ uᵢvᵢ; norma |u|² = u·u; u ⟂ v si u·v = 0'); ref('d.proyeccion', 'definicion', 'Proyección de v sobre u ≠ 0: proy_u(v) = ((v·u)/(u·u))u');

  const HB = (id, nombre) => R.habilidad({ id: '7.3.' + id, nombre, nivel: '7.3' });
  HB('punto', 'Producto punto y ortogonalidad'); HB('proyeccion', 'Proyección ortogonal'); HB('gram-schmidt', 'Gram-Schmidt'); HB('geometria', 'Normas y ángulos'); HB('demostrar', 'Demostrar con el producto interno');
  const TE = (id, titulo, enunciado, requiere, hab) => R.teorema({ id, titulo, nivel: '7.3', enunciado, requiere, habilidades: hab });
  TE('t.cauchy-schwarz', 'Desigualdad de Cauchy-Schwarz', r`$(u\cdot v)^2\le(u\cdot u)(v\cdot v)$ para todos $u,v\in\mathbb{R}^n$.`, ['t.cuadratica-formula'], ['7.3.punto', '7.3.geometria', '7.3.demostrar']);
  TE('t.ortogonales-independientes', 'Ortogonales no nulos son independientes', r`Vectores no nulos y ortogonales dos a dos son linealmente independientes.`, [], ['7.3.punto', '7.3.gram-schmidt', '7.3.demostrar']);
  TE('t.proyeccion-ortogonal', 'Proyección ortogonal', r`Para $u\neq0$, $v-\operatorname{proy}_u(v)$ es ortogonal a $u$, y es el único múltiplo $cu$ con $v-cu\perp u$.`, [], ['7.3.proyeccion', '7.3.demostrar']);
  TE('t.gram-schmidt', 'Gram-Schmidt', r`De $v_1,\dots,v_k$ independientes se obtienen $u_1=v_1$, $u_j=v_j-\sum_{i<j}\operatorname{proy}_{u_i}(v_j)$, ortogonales y con el mismo generado.`, ['t.proyeccion-ortogonal', 't.ortogonales-independientes', 't.agregar-independiente'], ['7.3.gram-schmidt', '7.3.proyeccion', '7.3.demostrar']);

  const F = M.fmt, tx = A => M.tex(A);
  const rv = (rng, n, lo, hi) => Array.from({ length: n }, () => Rat.of(rng.int(lo, hi)));
  const par = v => '(' + v.join(',') + ')', dot = M.dot, proy = M.proy;

  /* ---------- generadores ---------- */
  gen.entero({
    id: 'w7.n3.producto-punto', nivel: '7.3', habilidades: ['7.3.punto'], dificultad: 1,
    hacer(rng) {
      const n = rng.int(3, 4), u = rv(rng, n, -4, 5), v = rv(rng, n, -4, 5), res = Number(dot(u, v).n), suma = u.reduce((s, x, i) => s + Number(x.n) + Number(v[i].n), 0);
      return { key: par(u) + par(v), enun: 'Calcula $u\\cdot v$ para $u=' + par(u) + '$ y $v=' + par(v) + '$.', res,
        firmas: [['suma', suma, 'El producto punto multiplica coordenada a coordenada y **luego suma**: $\\sum u_iv_i$.'], ['sin-signos', Math.abs(res), 'Revisa los signos de cada producto $u_iv_i$.']].filter(f => f[1] !== res),
        pistas: ['Orientación: multiplica coordenada a coordenada.', 'Idea clave: $u\\cdot v=u_1v_1+\\cdots+u_nv_n$.', 'Primer paso: calcula $u_1v_1$.'], expl: '$u\\cdot v=' + res + '$.' };
    },
  });

  gen.entero({
    id: 'w7.n3.ortogonal-parametro', nivel: '7.3', habilidades: ['7.3.punto'], dificultad: 2,
    hacer(rng) {
      const n = rng.int(3, 4), u = rv(rng, n, -3, 4), v = rv(rng, n - 1, -3, 4), pos = rng.int(0, n - 1), cu = u[pos]; if (cu.isZero()) return null;
      const restoU = u.filter((_, i) => i !== pos), s = restoU.reduce((acc, x, i) => acc.add(x.mul(v[i])), Rat.of(0)), k = s.neg().div(cu); if (!k.isInt()) return null;
      const vv = v.slice(); vv.splice(pos, 0, 'k'); const kk = Number(k.n);
      return { key: par(u) + par(vv), enun: 'Halla $k$ para que $u=' + par(u) + '$ y $v=' + par(vv) + '$ sean **ortogonales**.', res: kk,
        firmas: [['signo', -kk, 'Se resuelve $u\\cdot v=0$: revisa el signo al despejar $k$.'], ['producto-punto', Number(s.n), 'Ese es el producto punto parcial (sin $k$); hay que sumar $k\\cdot u_' + (pos + 1) + '$ y despejar.']].filter(f => f[1] !== kk),
        pistas: ['Orientación: ortogonales significa $u\\cdot v=0$.', 'Idea clave: $u\\cdot v$ es una expresión lineal en $k$.', 'Primer paso: escribe $u\\cdot v=0$ con las coordenadas.'], expl: '$k=' + kk + '$.' };
    },
  });

  gen.tupla({
    id: 'w7.n3.proyeccion', nivel: '7.3', habilidades: ['7.3.proyeccion'], dificultad: 3,
    hacer(rng) {
      const n = rng.int(2, 3), u = rv(rng, n, -3, 4), v = rv(rng, n, -4, 5); if (u.every(x => x.isZero()) || v.every(x => x.isZero())) return null; const p = proy(v, u), vars = ['x', 'y', 'z'].slice(0, n);
      return { key: par(u) + par(v), enun: 'Halla la proyección ortogonal de $v=' + par(v) + '$ sobre $u=' + par(u) + '$.', campos: vars, res: p.map(String),
        firmas: [['escalar', [dot(v, u).toString(), ...Array(n - 1).fill('0')], 'Eso es solo el producto punto; la proyección es un **vector**: $\\frac{v\\cdot u}{u\\cdot u}u$.'], ['sin-dividir', u.map(x => x.mul(dot(v, u)).toString()), 'Falta dividir entre $u\\cdot u=' + dot(u, u) + '$.']].filter(f => f[1].join() !== p.map(String).join()),
        pistas: ['Orientación: $\\operatorname{proy}_u(v)=\\frac{v\\cdot u}{u\\cdot u}\\,u$.', 'Idea clave: primero calcula los dos productos punto.', 'Primer paso: calcula $v\\cdot u=' + dot(v, u) + '$ y $u\\cdot u=' + dot(u, u) + '$.'], expl: '$\\operatorname{proy}_u(v)=' + par(p) + '$.' };
    },
  });

  gen.tupla({
    id: 'w7.n3.vector-ortogonal', nivel: '7.3', habilidades: ['7.3.punto'], dificultad: 3,
    hacer(rng) {
      const A = M.de([rv(rng, 3, -3, 4), rv(rng, 3, -3, 4)]); if (M.rango(A) < 2) return null; const N = M.nucleo(A);
      return { key: tx(A), enun: 'Halla un vector **no nulo** de $\\mathbb{R}^3$ ortogonal a la vez a $u=' + par(A[0]) + '$ y a $v=' + par(A[1]) + '$.', campos: ['x', 'y', 'z'], res: F([N[0]])[0], verificador: { id: 'nucleo-vector', args: { A: A.map(f => f.map(String)), n: 3 } },
        firmas: [['cero', ['0', '0', '0'], 'El cero es ortogonal a todo, pero se pide un vector no nulo.'], ['uno-de-ellos', A[0].map(String), 'Ese es $u$, que no es ortogonal a sí mismo (ni a $v$ en general).']].filter(g => g[0] === 'cero' || M.evaluaSistema(A, g[1].map(x => Rat.parse(x))).some(z => !z.isZero())),
        pistas: ['Orientación: el vector $w$ cumple $w\\cdot u=0$ y $w\\cdot v=0$.', 'Idea clave: es un sistema homogéneo de dos ecuaciones (o usa el producto vectorial).', 'Primer paso: escribe las dos ecuaciones.'], expl: 'Sirve, por ejemplo, $' + par(F([N[0]])[0]) + '$.' };
    },
  });

  gen.tupla({
    id: 'w7.n3.gram-schmidt-paso', nivel: '7.3', habilidades: ['7.3.gram-schmidt', '7.3.proyeccion'], dificultad: 3,
    hacer(rng) {
      const n = rng.int(2, 3), v1 = rv(rng, n, -3, 4), v2 = rv(rng, n, -3, 4); if (M.rango([v1, v2]) < 2) return null; const u2 = M.gramSchmidt([v1, v2])[1], vars = ['x', 'y', 'z'].slice(0, n);
      return { key: par(v1) + par(v2), enun: 'Aplica un paso de Gram-Schmidt a $v_1=' + par(v1) + '$ y $v_2=' + par(v2) + '$: con $u_1=v_1$, halla $u_2=v_2-\\operatorname{proy}_{u_1}(v_2)$.', campos: vars, res: u2.map(String),
        firmas: [['sin-restar', v2.map(String), 'Falta restar la proyección sobre $u_1$.'], ['proyeccion', proy(v2, v1).map(String), 'Esa es la proyección; $u_2$ es lo que **queda** al restarla de $v_2$.']].filter(f => f[1].join() !== u2.map(String).join()),
        pistas: ['Orientación: $u_2=v_2-\\frac{v_2\\cdot u_1}{u_1\\cdot u_1}u_1$.', 'Idea clave: $u_2$ debe ser ortogonal a $u_1$.', 'Primer paso: calcula $v_2\\cdot u_1$ y $u_1\\cdot u_1$.'], expl: '$u_2=' + par(u2) + '$.' };
    },
  });

  gen.matriz({
    id: 'w7.n3.gram-schmidt-3', nivel: '7.3', habilidades: ['7.3.gram-schmidt'], dificultad: 4,
    hacer(rng) {
      const V = [rv(rng, 3, -2, 3), rv(rng, 3, -2, 3), rv(rng, 3, -2, 3)]; if (M.rango(V) < 3) return null; const U = M.gramSchmidt(V);
      if (U.some(f => f.some(x => x.d > 30n))) return null; const mal = V.map((v, i) => (i === 2 ? v.map((x, j) => x.sub(proy(v, U[1])[j])) : U[i]));
      return { key: tx(V), enun: 'Aplica Gram-Schmidt (sin normalizar) a los vectores $v_1,v_2,v_3$ que son las filas de $' + tx(V) + '$. Escribe $u_1,u_2,u_3$ como filas.', res: F(U), etiqueta: 'U',
        firmas: [['una-sola-proyeccion', F(mal), 'En el tercer paso hay que restar la proyección sobre $u_1$ **y** sobre $u_2$.'], ['sin-cambiar', F(V), 'Esos son los vectores originales; no son ortogonales entre sí.']].filter(f => JSON.stringify(f[1]) !== JSON.stringify(F(U))),
        pistas: ['Orientación: $u_1=v_1$; $u_2=v_2-\\operatorname{proy}_{u_1}v_2$; $u_3=v_3-\\operatorname{proy}_{u_1}v_3-\\operatorname{proy}_{u_2}v_3$.', 'Idea clave: cada $u_j$ es ortogonal a los anteriores.', 'Primer paso: toma $u_1=v_1$ y calcula $u_2$.'], expl: 'Resultado: $' + tx(U) + '$.' };
    },
  });

  gen.entero({
    id: 'w7.n3.norma-distancia', nivel: '7.3', habilidades: ['7.3.geometria', '7.3.punto'], dificultad: 2,
    hacer(rng) {
      const n = rng.int(2, 4), a = rv(rng, n, -4, 5), b = rv(rng, n, -4, 5), pide = rng.pick(['norma', 'distancia']), d = a.map((x, i) => x.sub(b[i])), res = Number(dot(pide === 'norma' ? a : d, pide === 'norma' ? a : d).n);
      if (res === 0) return null;
      return { key: pide + par(a) + par(b), enun: pide === 'norma' ? 'Calcula $|u|^2$ para $u=' + par(a) + '$.' : 'Calcula el **cuadrado** de la distancia entre los puntos $P=' + par(a) + '$ y $Q=' + par(b) + '$.', res,
        firmas: [['sin-cuadrado', pide === 'norma' ? a.reduce((s, x) => s + Number(x.n), 0) : d.reduce((s, x) => s + Number(x.n), 0), 'Hay que **elevar al cuadrado** cada coordenada antes de sumar.'], ['signo', -res, 'La suma de cuadrados es siempre positiva.']].filter(f => f[1] !== res && f[1] !== 0),
        pistas: ['Orientación: $|u|^2=u\\cdot u$.', 'Idea clave: ' + (pide === 'norma' ? 'suma los cuadrados de las coordenadas.' : 'resta los puntos $P-Q$ y suma los cuadrados de las diferencias.'), 'Primer paso: ' + (pide === 'norma' ? 'eleva la primera coordenada al cuadrado.' : 'calcula $P-Q$.')], expl: 'Vale $' + res + '$.' };
    },
  });

  gen.eleccion({
    id: 'w7.n3.tipo-de-angulo', nivel: '7.3', habilidades: ['7.3.geometria', '7.3.punto'], dificultad: 2,
    hacer(rng) {
      const n = rng.int(2, 4), u = rv(rng, n, -3, 4), v = rv(rng, n, -3, 4); if (u.every(x => x.isZero()) || v.every(x => x.isZero())) return null; const d = dot(u, v), o = { a: 'agudo (menor que $90^\\circ$)', r: 'recto ($90^\\circ$)', b: 'obtuso (mayor que $90^\\circ$)' }, c = d.cmp(Rat.of(0)) > 0 ? 'a' : d.isZero() ? 'r' : 'b';
      return { key: par(u) + par(v), enun: '¿Qué tipo de ángulo forman $u=' + par(u) + '$ y $v=' + par(v) + '$?', ok: o[c], malas: Object.keys(o).filter(k => k !== c).map(k => ['otro-' + k, o[k], 'Calcula $u\\cdot v=' + d + '$: positivo es agudo, cero es recto y negativo es obtuso.']),
        pistas: ['Orientación: mira el signo de $u\\cdot v$.', 'Idea clave: $u\\cdot v=|u||v|\\cos\\theta$.', 'Primer paso: calcula $u\\cdot v$.'], expl: '$u\\cdot v=' + d + '$: ' + o[c] + '.' };
    },
  });

  /* ---------- demostraciones ---------- */
  dem2({
    id: 'dem.cauchy-schwarz', teorema: 't.cauchy-schwarz', nivel: '7.3', habilidades: ['7.3.punto', '7.3.geometria', '7.3.demostrar'], requiere: ['t.cuadratica-formula'], refsExtra: ['d.producto-punto', 'd.discriminante', 'b.cuerpo-algebra'],
    param: rng => ({ u: rng.pick(['u', 'x']), v: rng.pick(['v', 'y']), t: rng.pick(['t', 's']) }),
    enunciado: p => r`Demuestra que $(${p.u}\cdot ${p.v})^2\le(${p.u}\cdot ${p.u})(${p.v}\cdot ${p.v})$ para $${p.u},${p.v}\in\mathbb{R}^n$.`,
    hip: p => [r`$${p.u},${p.v}\in\mathbb{R}^n$ con $${p.v}\neq0$`, 'Puedes usar que $w\\cdot w\\ge0$ y la fórmula cuadrática (el caso $v=0$ es trivial)'], meta: p => r`$(${p.u}\cdot ${p.v})^2\le(${p.u}\cdot ${p.u})(${p.v}\cdot ${p.v})$`,
    L: p => [
      ['L1', r`Si $${p.v}=0$ ambos lados valen $0$. Suponemos $${p.v}\neq0$ y consideramos $q(${p.t})=(${p.u}-${p.t}${p.v})\cdot(${p.u}-${p.t}${p.v})\ge0$ para todo real $${p.t}$.`, 'd.producto-punto'],
      ['L2', r`Desarrollando, $q(${p.t})=(${p.v}\cdot ${p.v})${p.t}^2-2(${p.u}\cdot ${p.v})${p.t}+(${p.u}\cdot ${p.u})$, una cuadrática con coeficiente líder $${p.v}\cdot ${p.v}>0$.`, 'b.cuerpo-algebra', ['L1']],
      ['L3', r`Si su discriminante fuera positivo, tendría dos raíces reales distintas y tomaría valores ⟦h1⟧ entre ellas (por la fórmula cuadrática), contra $q\ge0$.`, 't.cuadratica-formula', ['L2'], [H('h1', 'negativos', ['negativos', 'positivos', 'nulos'], false)]],
      ['L4', r`Luego $\Delta=4(${p.u}\cdot ${p.v})^2-4(${p.v}\cdot ${p.v})(${p.u}\cdot ${p.u})\le0$, es decir, $(${p.u}\cdot ${p.v})^2\le(${p.u}\cdot ${p.u})(${p.v}\cdot ${p.v})$. ∎`, 'd.discriminante', ['L3']],
    ],
    dist: p => [[r`Con $u=(1,0)$ y $v=(1,1)$: $1\le2$; luego siempre.`, 'un ejemplo no prueba el caso general'], [r`Como $|\cos\theta|\le1$, vale automáticamente.`, 'usa la desigualdad que se quiere demostrar para definir el ángulo']],
    err: p => [['L2', r`Desarrollando, $q(${p.t})=(${p.v}\cdot ${p.v})${p.t}^2+2(${p.u}\cdot ${p.v})${p.t}+(${p.u}\cdot ${p.u})$.`, 'error-de-calculo', 'El término del medio es $-2(u\\cdot v)t$.'], ['L4', r`Luego $\Delta\ge0$, es decir, $(${p.u}\cdot ${p.v})^2\ge(${p.u}\cdot ${p.u})(${p.v}\cdot ${p.v})$.`, 'conclusion-invalida', 'Como $q\\ge0$, $\\Delta\\le0$.']],
    valida: [['cuadratica', r`Estudiar $\lvert u-tv\rvert^2\ge0$ como cuadrática en $t$`, 'Es la prueba estándar.'], ['proyeccion', r`Descomponer $u=\mathrm{proy}_v u+w$ y usar $w\cdot w\ge0$`, 'Válida: también da la desigualdad.']],
    idea: p => r`$(${p.u}-${p.t}${p.v})\cdot(${p.u}-${p.t}${p.v})\ge0$ para todo $${p.t}$ obliga a $\Delta\le0$.`, primero: p => r`define $q(${p.t})=(${p.u}-${p.t}${p.v})\cdot(${p.u}-${p.t}${p.v})$.`,
  });

  dem2({
    id: 'dem.ortogonales-independientes', teorema: 't.ortogonales-independientes', nivel: '7.3', habilidades: ['7.3.punto', '7.3.gram-schmidt', '7.3.demostrar'], requiere: [], refsExtra: ['d.producto-punto', 'd.independencia', 'b.arbitrario'],
    param: rng => ({ v: rng.pick(['v', 'u']), c: rng.pick(['c', 'a']), j: rng.pick(['j', 'm']) }),
    enunciado: p => r`Sean $${p.v}_1,\dots,${p.v}_k$ no nulos y ortogonales dos a dos. Demuestra que son linealmente independientes.`,
    hip: p => [r`$${p.v}_i\neq0$ y $${p.v}_i\cdot ${p.v}_l=0$ si $i\neq l$`, 'Basta la definición de independencia y el producto punto'], meta: p => r`$${p.v}_1,\dots,${p.v}_k$ independientes`,
    L: p => [
      ['L1', r`Supongamos $${p.c}_1${p.v}_1+\cdots+${p.c}_k${p.v}_k=0$. Fijamos un índice $${p.j}$ arbitrario.`, 'd.independencia'],
      ['L2', r`Hacemos el producto punto con $${p.v}_${p.j}$: $\sum_i${p.c}_i(${p.v}_i\cdot ${p.v}_${p.j})=0\cdot ${p.v}_${p.j}=0$.`, 'd.producto-punto', ['L1']],
      ['L3', r`Por ortogonalidad, todos los sumandos con $i\neq ${p.j}$ valen $0$, y queda $${p.c}_${p.j}(${p.v}_${p.j}\cdot ${p.v}_${p.j})=0$.`, 'd.producto-punto', ['L2']],
      ['L4', r`Como $${p.v}_${p.j}\neq0$, $${p.v}_${p.j}\cdot ${p.v}_${p.j}>0$, así que ⟦h1⟧.`, 'd.producto-punto', ['L3'], [H('h1', r`$${p.c}_${p.j}=0$`, [r`$${p.c}_${p.j}=0$`, r`$${p.v}_${p.j}=0$`, r`$${p.c}_${p.j}=1$`], false)]],
      ['L5', r`Como $${p.j}$ era arbitrario, todos los coeficientes son $0$: independientes. ∎`, 'b.arbitrario', ['L4']],
    ],
    dist: p => [[r`Con $e_1,e_2,e_3$ se cumple; luego siempre.`, 'un ejemplo no prueba el caso general'], [r`Como son ortogonales, no pueden ser proporcionales y por tanto son independientes.`, 'dos a dos no proporcionales no basta: hay que probarlo con todos a la vez']],
    err: p => [['L3', r`Por ortogonalidad, todos los sumandos con $i=${p.j}$ valen $0$.`, 'error-de-calculo', 'Se anulan los sumandos con $i\\neq j$.'], ['L4', r`Como $${p.v}_${p.j}\neq0$, $${p.v}_${p.j}\cdot ${p.v}_${p.j}=0$.`, 'error-de-calculo', 'Es **positivo**.']],
    valida: [['punto', r`Hacer el producto punto de una relación nula con cada $v_j$`, 'Es la prueba estándar.']],
    idea: p => r`el producto punto con $${p.v}_${p.j}$ anula todos los términos menos uno.`, primero: p => r`supón una combinación lineal igual a cero.`,
  });

  dem2({
    id: 'dem.proyeccion-ortogonal', teorema: 't.proyeccion-ortogonal', nivel: '7.3', habilidades: ['7.3.proyeccion', '7.3.demostrar'], requiere: [], refsExtra: ['d.proyeccion', 'd.producto-punto', 'b.cuerpo-algebra'],
    param: rng => ({ u: rng.pick(['u', 'a']), v: rng.pick(['v', 'w']), c: rng.pick(['c', 'λ']) }),
    enunciado: p => r`Sea $${p.u}\neq0$. Demuestra que $v-${p.c}${p.u}\perp ${p.u}$ si y solo si $${p.c}=\dfrac{${p.v}\cdot ${p.u}}{${p.u}\cdot ${p.u}}$.`,
    hip: p => [r`$${p.u}\neq0$ y $${p.c}$ es un escalar`, 'Basta la definición de ortogonalidad'], meta: p => r`$${p.v}-${p.c}${p.u}\perp ${p.u}\iff ${p.c}=\frac{${p.v}\cdot ${p.u}}{${p.u}\cdot ${p.u}}$`,
    L: p => [
      ['L1', r`$(${p.v}-${p.c}${p.u})\perp ${p.u}$ significa $(${p.v}-${p.c}${p.u})\cdot ${p.u}=0$.`, 'd.producto-punto'],
      ['L2', r`Por bilinealidad, $(${p.v}-${p.c}${p.u})\cdot ${p.u}=${p.v}\cdot ${p.u}-${p.c}(${p.u}\cdot ${p.u})$.`, 'b.cuerpo-algebra', ['L1']],
      ['L3', r`Entonces la condición es $${p.v}\cdot ${p.u}-${p.c}(${p.u}\cdot ${p.u})=0$, es decir, $${p.c}(${p.u}\cdot ${p.u})=${p.v}\cdot ${p.u}$.`, 'b.cuerpo-algebra', ['L2']],
      ['L4', r`Como $${p.u}\neq0$, $${p.u}\cdot ${p.u}>0$ y podemos ⟦h1⟧: $${p.c}=\dfrac{${p.v}\cdot ${p.u}}{${p.u}\cdot ${p.u}}$. Todos los pasos son equivalencias. ∎`, 'd.producto-punto', ['L3'], [H('h1', 'dividir', ['dividir', 'restar', 'derivar'], false)]],
    ],
    dist: p => [[r`Con $u=(1,0)$ y $v=(3,4)$: $c=3$ y $v-3u=(0,4)\perp u$; luego siempre.`, 'un ejemplo no prueba el caso general'], [r`Como $${p.v}-${p.c}${p.u}$ es perpendicular a $${p.u}$ por construcción, el resultado es evidente.`, 'es lo que hay que probar']],
    err: p => [['L2', r`$(${p.v}-${p.c}${p.u})\cdot ${p.u}=${p.v}\cdot ${p.u}+${p.c}(${p.u}\cdot ${p.u})$.`, 'error-de-calculo', 'Se **resta**: $v\\cdot u-c(u\\cdot u)$.'], ['L4', r`Como $${p.u}\neq0$, podemos dividir y queda $${p.c}=\dfrac{${p.u}\cdot ${p.u}}{${p.v}\cdot ${p.u}}$.`, 'error-de-calculo', 'Es $(v\\cdot u)/(u\\cdot u)$.']],
    valida: [['bilineal', r`Imponer $(v-cu)\cdot u=0$ y despejar $c$`, 'Es la prueba estándar.']],
    idea: p => r`$(${p.v}-${p.c}${p.u})\cdot ${p.u}=0$ es lineal en $${p.c}$.`, primero: p => r`escribe $(${p.v}-${p.c}${p.u})\cdot ${p.u}=0$.`,
  });

  dem2({
    id: 'dem.gram-schmidt', teorema: 't.gram-schmidt', nivel: '7.3', habilidades: ['7.3.gram-schmidt', '7.3.proyeccion', '7.3.demostrar'], requiere: ['t.proyeccion-ortogonal', 't.ortogonales-independientes', 't.agregar-independiente'], refsExtra: ['d.proyeccion', 'd.generado', 'd.hip-induccion'],
    param: rng => ({ v: rng.pick(['v', 'x']), u: rng.pick(['u', 'w']), j: rng.pick(['j', 'm']) }),
    enunciado: p => r`Sean $${p.v}_1,\dots,${p.v}_k$ independientes y $${p.u}_1=${p.v}_1$, $${p.u}_${p.j}=${p.v}_${p.j}-\sum_{i<${p.j}}\operatorname{proy}_{${p.u}_i}(${p.v}_${p.j})$. Demuestra por inducción que los $${p.u}_${p.j}$ son no nulos, ortogonales dos a dos y $\operatorname{gen}(${p.u}_1..${p.u}_${p.j})=\operatorname{gen}(${p.v}_1..${p.v}_${p.j})$.`,
    hip: p => [r`$${p.v}_1,\dots,${p.v}_k$ independientes`, 'Puedes citar la proyección ortogonal, que los ortogonales no nulos son independientes y que agregar un vector fuera del generado mantiene la independencia'], meta: p => r`$${p.u}_i$ ortogonales, no nulos, mismo generado`,
    L: p => [
      ['L1', r`Base: $${p.u}_1=${p.v}_1\neq0$ (es independiente) y $\operatorname{gen}(${p.u}_1)=\operatorname{gen}(${p.v}_1)$.`, 'd.generado'],
      ['L2', r`Paso: suponemos $${p.u}_1,\dots,${p.u}_{${p.j}-1}$ no nulos, ortogonales y con $\operatorname{gen}(${p.u}_1..${p.u}_{${p.j}-1})=\operatorname{gen}(${p.v}_1..${p.v}_{${p.j}-1})$.`, 'd.hip-induccion', ['L1']],
      ['L3', r`Ortogonalidad: para $l<${p.j}$, $${p.u}_${p.j}\cdot ${p.u}_l=${p.v}_${p.j}\cdot ${p.u}_l-\frac{${p.v}_${p.j}\cdot ${p.u}_l}{${p.u}_l\cdot ${p.u}_l}(${p.u}_l\cdot ${p.u}_l)=0$, ya que los demás $${p.u}_i$ son ortogonales a $${p.u}_l$ (proyección ortogonal).`, 't.proyeccion-ortogonal', ['L2']],
      ['L4', r`No nulo: $${p.u}_${p.j}=${p.v}_${p.j}-(\text{vector de }\operatorname{gen}(${p.u}_i))$ y $${p.v}_${p.j}\notin\operatorname{gen}(${p.v}_1..${p.v}_{${p.j}-1})=\operatorname{gen}(${p.u}_i)$ porque los $${p.v}_i$ son ⟦h1⟧.`, 't.agregar-independiente', ['L2'], [H('h1', 'independientes', ['independientes', 'ortogonales', 'unitarios'], false)]],
      ['L5', r`Mismo generado: $${p.u}_${p.j}$ difiere de $${p.v}_${p.j}$ en un vector de $\operatorname{gen}(${p.v}_1..${p.v}_{${p.j}-1})$, así que ambos generados coinciden hasta $${p.j}$. Los $${p.u}_i$ son independientes (ortogonales no nulos). ∎`, 't.ortogonales-independientes', ['L3', 'L4']],
    ],
    dist: p => [[r`Con $v_1=(1,1)$, $v_2=(1,0)$ da $u_2=(1/2,-1/2)\perp u_1$; luego siempre.`, 'un ejemplo no prueba el caso general'], [r`Como restamos proyecciones, el resultado es ortogonal automáticamente.`, 'hay que comprobar el producto punto con cada $u_l$']],
    err: p => [['L3', r`$${p.u}_${p.j}\cdot ${p.u}_l=${p.v}_${p.j}\cdot ${p.u}_l+\frac{${p.v}_${p.j}\cdot ${p.u}_l}{${p.u}_l\cdot ${p.u}_l}(${p.u}_l\cdot ${p.u}_l)$.`, 'error-de-calculo', 'La proyección se **resta**.'], ['L4', r`No nulo: $${p.v}_${p.j}\in\operatorname{gen}(${p.u}_i)$, así que $${p.u}_${p.j}=0$.`, 'conclusion-invalida', 'Por independencia, $v_j\\notin\\operatorname{gen}(v_1..v_{j-1})$.']],
    valida: [['induccion', r`Inducción sobre $j$ comprobando ortogonalidad, no nulidad e igualdad de generados`, 'Es la prueba estándar.']],
    idea: p => r`restar las proyecciones deja un vector ortogonal a todos los anteriores y fuera de su generado.`, primero: p => r`trata la base $j=1$.`,
  });

  R.nivel({
    id: '7.3', mundo: 7, titulo: 'Producto interno y Gram-Schmidt', tema: 'Producto punto, proyecciones y bases ortogonales',
    habilidades: ['7.3.punto', '7.3.proyeccion', '7.3.gram-schmidt', '7.3.geometria', '7.3.demostrar'],
    teoremas: ['t.cauchy-schwarz', 't.ortogonales-independientes', 't.proyeccion-ortogonal', 't.gram-schmidt'],
    leccion: {
      intro: 'El **producto punto** $u\\cdot v=\\sum u_iv_i$ mide longitudes ($|u|^2=u\\cdot u$) y ángulos ($u\\cdot v=|u||v|\\cos\\theta$). Dos vectores son **ortogonales** si $u\\cdot v=0$.',
      definiciones: [
        { nombre: 'Proyección', tex: '$\\operatorname{proy}_u(v)=\\frac{v\\cdot u}{u\\cdot u}\\,u$ es el múltiplo de $u$ más cercano a $v$; $v-\\operatorname{proy}_u(v)\\perp u$.' },
        { nombre: 'Ortogonales e independientes', tex: 'Vectores no nulos y ortogonales dos a dos son independientes. Una base ortogonal permite hallar coordenadas con proyecciones.' },
        { nombre: 'Gram-Schmidt', tex: 'De una base cualquiera se fabrica una ortogonal: $u_1=v_1$, $u_j=v_j-\\sum_{i<j}\\operatorname{proy}_{u_i}(v_j)$ (sin normalizar se conservan los racionales).' },
        { nombre: 'Cauchy-Schwarz', tex: '$(u\\cdot v)^2\\le(u\\cdot u)(v\\cdot v)$: por eso $|\\cos\\theta|\\le1$.' },
      ],
      teorema: 't.gram-schmidt',
      ejemplo: { enunciado: 'Ortogonaliza $v_1=(1,1)$, $v_2=(1,0)$.', pasos: ['$u_1=v_1=(1,1)$.', '$v_2\\cdot u_1=1$ y $u_1\\cdot u_1=2$, así que $\\operatorname{proy}=\\frac12(1,1)$.', '$u_2=(1,0)-(\\frac12,\\frac12)=(\\frac12,-\\frac12)$, ortogonal a $u_1$.'] },
    },
  });

  if (typeof module !== 'undefined') module.exports = AC;
})(globalThis.AC = globalThis.AC || {});
