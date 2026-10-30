/* Mundo 8, nivel 8.4 — Anillos y cuerpos. */
(function (AC) {
  const { R, H, T, gen, dem2 } = AC.cont, r = String.raw, G = AC.grupos, N = AC.numth, C = AC.conj;
  const ref = (id, tipo, nombre) => R.ref({ id, tipo, nombre });
  ref('d.anillo', 'definicion', 'Anillo: (A,+) grupo abeliano, producto asociativo y distributivo; con unidad 1'); ref('d.divisor-cero', 'definicion', 'Divisor de cero: a ≠ 0 con ab = 0 para algún b ≠ 0');
  ref('d.cuerpo', 'definicion', 'Cuerpo: anillo conmutativo con 1 ≠ 0 donde todo elemento no nulo tiene inverso multiplicativo'); ref('d.dominio', 'definicion', 'Dominio de integridad: anillo conmutativo con 1 ≠ 0 y sin divisores de cero');

  const HB = (id, nombre) => R.habilidad({ id: '8.4.' + id, nombre, nivel: '8.4' });
  HB('reconocer', 'Anillos, dominios y cuerpos'); HB('zn', 'Unidades y divisores de cero en ℤₙ'); HB('ecuaciones', 'Ecuaciones en ℤₙ y en cuerpos finitos'); HB('contar', 'Contar soluciones'); HB('demostrar', 'Demostrar con anillos y cuerpos');
  const TE = (id, titulo, enunciado, requiere, hab) => R.teorema({ id, titulo, nivel: '8.4', enunciado, requiere, habilidades: hab });
  TE('t.anillo-cero-producto', 'Reglas del anillo', r`En un anillo, $0\cdot a=0$, $(-a)b=-(ab)$ y $(-a)(-b)=ab$.`, [], ['8.4.reconocer', '8.4.demostrar']);
  TE('t.unidad-no-divisor-cero', 'Una unidad no es divisor de cero', r`Si $a$ es unidad y $ab=0$, entonces $b=0$.`, ['t.anillo-cero-producto'], ['8.4.zn', '8.4.reconocer', '8.4.demostrar']);
  TE('t.zn-cuerpo', 'ℤₙ es cuerpo si y solo si n es primo', r`$\mathbb{Z}_n$ es un cuerpo si y solo si $n$ es primo.`, ['t.lema-euclides', 't.unidades-grupo', 't.unidad-no-divisor-cero'], ['8.4.zn', '8.4.ecuaciones', '8.4.demostrar']);
  TE('t.dominio-finito-cuerpo', 'Dominios finitos', r`Todo dominio de integridad finito es un cuerpo.`, ['t.anillo-cero-producto'], ['8.4.reconocer', '8.4.contar', '8.4.demostrar']);

  const gcd = N.gcd, md = G.md;
  const lista = (a, n) => { const o = []; for (let x = 0; x < n; x++) if ((a * x) % n === 0 + (0)) o.push(x); return o; };

  /* ---------- generadores ---------- */
  gen.multiple({
    id: 'w8.n4.cuales-cuerpos', nivel: '8.4', habilidades: ['8.4.reconocer', '8.4.zn'], dificultad: 2,
    hacer(rng) {
      const pr = rng.pick([5, 7, 11, 13]), comp = rng.pick([4, 6, 8, 9, 10, 12, 15]), buenos = [[`\\mathbb{Z}_{${pr}}`, `Es un cuerpo: $${pr}$ es primo, así que todo elemento no nulo tiene inverso.`], ['\\mathbb{Q}', 'Todo racional no nulo tiene inverso.'], ['\\mathbb{R}', 'Todo real no nulo tiene inverso.'], ['\\mathbb{C}', 'Todo complejo no nulo tiene inverso.']];
      const malos = [[`\\mathbb{Z}_{${comp}}`, `No es cuerpo: $${comp}$ no es primo y hay divisores de cero (por ejemplo, uno de sus factores propios por otro).`], ['\\mathbb{Z}', 'No es cuerpo: solo $\\pm1$ tienen inverso.'], ['M_2(\\mathbb{R})', 'No es cuerpo: no es conmutativo y tiene divisores de cero.'], ['\\mathbb{N}', 'Ni siquiera es anillo: no hay opuestos.']];
      const si = rng.sample(buenos, rng.int(1, 2)), no = rng.sample(malos, rng.int(2, 3)), ops = rng.shuffle(si.map(x => ({ t: x[0], p: x[1], ok: true })).concat(no.map(x => ({ t: x[0], p: x[1], ok: false })))), ok = ops.map((o, i) => (o.ok ? i : -1)).filter(i => i >= 0);
      return { key: ops.map(o => o.t).join('|'), enun: 'Marca todas las estructuras (con sus operaciones usuales) que son **cuerpos**.', opciones: ops.map(o => '$' + o.t + '$'), ok, msg: (j, es) => (es ? 'Sí es cuerpo: ' : 'No es cuerpo: ') + ops[j].p,
        pistas: ['Orientación: en un cuerpo todo elemento no nulo tiene inverso multiplicativo.', 'Idea clave: $\\mathbb{Z}_n$ es cuerpo exactamente cuando $n$ es primo.', 'Primer paso: ¿hay elementos no nulos sin inverso?'], expl: 'Son cuerpos: ' + si.map(x => '$' + x[0] + '$').join(', ') + '.' };
    },
  });

  gen.conjunto({
    id: 'w8.n4.divisores-de-cero', nivel: '8.4', habilidades: ['8.4.zn'], dificultad: 2,
    hacer(rng) {
      const n = rng.int(6, 36); if (N.esPrimo(n)) return null; const res = G.divisoresCero(n).map(String); if (res.length > 18) return null;
      return { key: String(n), enun: 'Escribe el conjunto de **divisores de cero** de $\\mathbb{Z}_{' + n + '}$ (clases $a\\neq0$ con $ab\\equiv0$ para algún $b\\not\\equiv0$).', res, norm: 'racional',
        firmas: [['unidades', G.unidades(n).map(String), 'Esas son las unidades (coprimas con $n$); los divisores de cero son los no nulos que **no** son unidades.'], ['con-cero', ['0'].concat(res), 'Por definición un divisor de cero es no nulo: el $0$ no cuenta.']].filter(f => C.fmt(f[1]) !== C.fmt(res)),
        pistas: ['Orientación: $a$ es divisor de cero si $\\gcd(a,' + n + ')>1$ y $a\\neq0$.', 'Idea clave: en $\\mathbb{Z}_n$, cada clase no nula es unidad o divisor de cero.', 'Primer paso: factoriza $' + n + '$.'], expl: 'Divisores de cero: ' + C.tex(res) + '.' };
    },
  });

  gen.eleccion({
    id: 'w8.n4.es-cuerpo-zn', nivel: '8.4', habilidades: ['8.4.reconocer', '8.4.zn'], dificultad: 2,
    hacer(rng) {
      const n = rng.int(4, 40), primo = N.esPrimo(n); let a, b; if (!primo) { const f = N.factorizar(n); const p = f[0][0], q = n / p; a = p; b = q; }
      const ok = primo ? 'Sí: $' + n + '$ es primo, todo elemento no nulo tiene inverso' : 'No: $' + a + '\\cdot' + b + '\\equiv0\\pmod{' + n + '}$ con ambos no nulos (hay divisores de cero)';
      return { key: String(n), enun: '¿Es $\\mathbb{Z}_{' + n + '}$ un cuerpo?', ok, malas: [primo ? ['no-falso', 'No: tiene divisores de cero', '$' + n + '$ es primo: $\\mathbb{Z}_{' + n + '}$ no tiene divisores de cero.'] : ['si-falso', 'Sí: todo elemento no nulo tiene inverso', 'Hay divisores de cero (' + a + '·' + b + '≡0), así que no todos tienen inverso.'], ['no-conmutativo', 'No: el producto no es conmutativo', '$\\mathbb{Z}_n$ siempre es conmutativo.'], ['no-anillo', 'No es siquiera un anillo', '$\\mathbb{Z}_n$ siempre es un anillo conmutativo con unidad.']],
        pistas: ['Orientación: $\\mathbb{Z}_n$ es cuerpo si y solo si $n$ es primo.', 'Idea clave: si $n=ab$ con $1<a,b<n$, entonces $ab\\equiv0$ y hay divisores de cero.', 'Primer paso: ¿es $' + n + '$ primo?'], expl: primo ? '$' + n + '$ es primo: $\\mathbb{Z}_{' + n + '}$ es cuerpo.' : '$' + a + '\\cdot' + b + '=' + n + '\\equiv0$: no es cuerpo.' };
    },
  });

  gen.entero({
    id: 'w8.n4.inverso-en-cuerpo', nivel: '8.4', habilidades: ['8.4.ecuaciones'], dificultad: 2,
    hacer(rng) {
      const p = rng.pick([5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41]), a = rng.int(2, p - 1), b = rng.int(1, p - 1), inv = N.inverso(a, p), res = (b * inv) % p, pide = rng.pick(['inverso', 'division']);
      return pide === 'inverso' ? { key: 'i' + a + ',' + p, enun: 'En el cuerpo $\\mathbb{Z}_{' + p + '}$, ¿cuál es el inverso multiplicativo de $' + a + '$? (un valor entre $1$ y $' + (p - 1) + '$).', res: inv,
        firmas: [['opuesto', p - a, 'Ese es el opuesto aditivo; el inverso cumple $a\\cdot a^{-1}\\equiv1$.'], ['a', a, 'Comprueba $' + a + '\\cdot' + a + '\\equiv1$: en general no.']].filter(f => f[1] !== inv),
        pistas: ['Orientación: busca $x$ con $' + a + 'x\\equiv1\\pmod{' + p + '}$.', 'Idea clave: Euclides extendido, o prueba valores.', 'Primer paso: calcula $\\gcd(' + a + ',' + p + ')=1$.'], expl: '$' + a + '\\cdot' + inv + '\\equiv1$.' }
        : { key: 'd' + b + ',' + a + ',' + p, enun: 'En el cuerpo $\\mathbb{Z}_{' + p + '}$, calcula $' + b + '/' + a + '$ (es decir, $' + b + '\\cdot' + a + '^{-1}$), un valor entre $0$ y $' + (p - 1) + '$.', res,
        firmas: [['mal-orden', (a * N.inverso(b, p)) % p, 'La división $b/a$ es $b\\cdot a^{-1}$, no $a\\cdot b^{-1}$.'], ['sin-inverso', Math.floor(b / a), 'Esa es la división entera; en $\\mathbb{Z}_p$ se multiplica por el inverso.']].filter(f => f[1] !== res),
        pistas: ['Orientación: $b/a=b\\cdot a^{-1}$.', 'Idea clave: primero halla $a^{-1}$ módulo $' + p + '$.', 'Primer paso: calcula $' + a + '^{-1}=' + inv + '$.'], expl: '$' + b + '\\cdot' + inv + '\\equiv' + res + '\\pmod{' + p + '}$.' };
    },
  });

  gen.conjunto({
    id: 'w8.n4.ecuacion-lineal-zn', nivel: '8.4', habilidades: ['8.4.ecuaciones'], dificultad: 3,
    hacer(rng) {
      const n = rng.int(6, 30), a = rng.int(2, n - 1), b = rng.int(0, n - 1), sol = []; for (let x = 0; x < n; x++) if ((a * x) % n === b % n) sol.push(x); if (sol.length > 8) return null; const res = sol.map(String); if (res.length === 0 && rng.chance(0.5)) return null;
      return { key: [a, b, n].join(), enun: 'Resuelve $' + a + 'x\\equiv' + b + '\\pmod{' + n + '}$ en $\\mathbb{Z}_{' + n + '}$: escribe el conjunto de **todas** las soluciones (vacío si no hay: $\\emptyset$).', res, norm: 'racional',
        firmas: [['una-sola', sol.length ? [String(sol[0])] : ['0'], 'Si $\\gcd(a,n)>1$ puede haber varias soluciones (o ninguna): $\\mathbb{Z}_n$ no es un cuerpo.'], ['mal-signo', sol.map(x => String((n - x) % n)), 'Revisa el signo: se resuelve $ax=b$.']].filter(f => C.fmt(f[1]) !== C.fmt(res)),
        pistas: ['Orientación: sea $d=\\gcd(' + a + ',' + n + ')=' + gcd(a, n) + '$.', 'Idea clave: hay solución si y solo si $d\\mid ' + b + '$; entonces hay $d$ soluciones.', 'Primer paso: calcula $d$ y comprueba si divide a $' + b + '$.'], expl: sol.length ? 'Soluciones: ' + C.tex(res) + '.' : 'No hay soluciones.' };
    },
  });

  gen.tupla({
    id: 'w8.n4.contar-unidades-y-ceros', nivel: '8.4', habilidades: ['8.4.zn', '8.4.contar'], dificultad: 3,
    hacer(rng) {
      const n = rng.int(6, 60); if (N.esPrimo(n)) return null; const u = N.phi(n), z = n - 1 - u;
      return { key: String(n), enun: 'En $\\mathbb{Z}_{' + n + '}$, ¿cuántas unidades hay y cuántos divisores de cero? (Recuerda que cada clase no nula es una cosa o la otra.)', campos: ['unidades', 'divisores de cero'], res: [String(u), String(z)],
        firmas: [['orden-invertido', [String(z), String(u)], 'El orden es primero unidades y luego divisores de cero.'], ['sin-restar-cero', [String(u), String(n - u)], 'El $0$ no es divisor de cero ni unidad: hay $n-1-\\varphi(n)$ divisores de cero.']].filter(f => f[1].join() !== [u, z].join()),
        pistas: ['Orientación: unidades $=\\varphi(n)$.', 'Idea clave: no nulos $=n-1$; divisores de cero $=n-1-\\varphi(n)$.', 'Primer paso: calcula $\\varphi(' + n + ')=' + u + '$.'], expl: 'Hay $' + u + '$ unidades y $' + z + '$ divisores de cero.' };
    },
  });

  gen.entero({
    id: 'w8.n4.raices-de-uno', nivel: '8.4', habilidades: ['8.4.contar', '8.4.reconocer'], dificultad: 3,
    hacer(rng) {
      const n = rng.int(5, 60); let c = 0; for (let x = 0; x < n; x++) if ((x * x) % n === 1 % n) c++; const primo = N.esPrimo(n);
      return { key: String(n), enun: '¿Cuántas soluciones tiene $x^2\\equiv1\\pmod{' + n + '}$ en $\\mathbb{Z}_{' + n + '}$?', res: c,
        firmas: [['dos', 2, primo ? 'Para $n$ primo hay exactamente dos ($\\pm1$); revisa si $' + n + '$ es primo.' : 'En un cuerpo habría a lo sumo dos, pero $\\mathbb{Z}_{' + n + '}$ no es cuerpo y puede tener más.'], ['uno', 1, 'Siempre están $1$ y $-1$ (que coinciden solo si $n=2$).']].filter(f => f[1] !== c),
        pistas: ['Orientación: prueba $x=1,\\dots,' + (n - 1) + '$ o factoriza $x^2-1=(x-1)(x+1)$.', 'Idea clave: en un cuerpo, un polinomio de grado $2$ tiene a lo sumo $2$ raíces; en $\\mathbb{Z}_n$ compuesto puede tener más.', 'Primer paso: ¿es $' + n + '$ primo?'], expl: 'Hay $' + c + '$ soluciones.' };
    },
  });

  /* ---------- demostraciones ---------- */
  dem2({
    id: 'dem.anillo-cero-producto', teorema: 't.anillo-cero-producto', nivel: '8.4', habilidades: ['8.4.reconocer', '8.4.demostrar'], requiere: [], refsExtra: ['d.anillo', 'd.grupo', 'b.arbitrario'],
    param: rng => ({ a: rng.pick(['a', 'x']), b: rng.pick(['b', 'y']) }),
    enunciado: p => r`Sea $A$ un anillo. Demuestra que $0\cdot ${p.a}=0$ y que $(-${p.a})\cdot ${p.b}=-(${p.a}${p.b})$.`,
    hip: p => [r`$A$ es un anillo`, 'Puedes usar la distributividad y la cancelación de la suma'], meta: p => r`$0\cdot ${p.a}=0$ y $(-${p.a})${p.b}=-(${p.a}${p.b})$`,
    L: p => [
      ['L1', r`$0\cdot ${p.a}=(0+0)\cdot ${p.a}=0\cdot ${p.a}+0\cdot ${p.a}$ por la distributividad.`, 'd.anillo'],
      ['L2', r`Sumando el opuesto de $0\cdot ${p.a}$ a ambos lados (cancelación en el grupo aditivo), $0=0\cdot ${p.a}$.`, 'd.grupo', ['L1']],
      ['L3', r`Para el segundo resultado: $${p.a}${p.b}+(-${p.a})${p.b}=(${p.a}+(-${p.a}))${p.b}=0\cdot ${p.b}=0$.`, 'd.anillo', ['L2']],
      ['L4', r`Luego $(-${p.a})${p.b}$ es el opuesto de $${p.a}${p.b}$ porque ⟦h1⟧. Por la unicidad del opuesto, $(-${p.a})${p.b}=-(${p.a}${p.b})$. ∎`, 'd.grupo', ['L3'], [H('h1', 'sumado con $ab$ da $0$', ['sumado con $ab$ da $0$', 'es igual a $ab$', 'es cero'], false)]],
    ],
    dist: p => [[r`En $\mathbb{Z}$ vale, $0\cdot5=0$; luego en todo anillo.`, 'un ejemplo no prueba el caso general'], [r`Como el cero es el neutro, multiplicar por $0$ da $0$ por definición.`, 'el $0$ es neutro de la suma; que anule al producto hay que probarlo']],
    err: p => [['L1', r`$0\cdot ${p.a}=(0\cdot 0)\cdot ${p.a}=0\cdot ${p.a}+0\cdot ${p.a}$.`, 'error-de-calculo', 'Se usa $0=0+0$ (suma), no un producto.'], ['L3', r`$${p.a}${p.b}+(-${p.a})${p.b}=(${p.a}\cdot(-${p.a}))${p.b}=0$.`, 'error-de-calculo', 'La distributividad factoriza $(a+(-a))b$.']],
    valida: [['distributiva', r`Usar $0=0+0$ y $a+(-a)=0$ con la distributividad`, 'Es la prueba estándar.']],
    idea: p => r`$0\cdot ${p.a}=(0+0)${p.a}$ y la cancelación aditiva da el resultado.`, primero: p => r`escribe $0=0+0$ y distribuye.`,
  });

  dem2({
    id: 'dem.unidad-no-divisor-cero', teorema: 't.unidad-no-divisor-cero', nivel: '8.4', habilidades: ['8.4.zn', '8.4.reconocer', '8.4.demostrar'], requiere: ['t.anillo-cero-producto'], refsExtra: ['d.anillo', 'd.divisor-cero'],
    param: rng => ({ a: rng.pick(['a', 'u']), b: rng.pick(['b', 'x']) }),
    enunciado: p => r`Sea $A$ un anillo conmutativo con unidad y $${p.a}$ una unidad. Demuestra que si $${p.a}${p.b}=0$ entonces $${p.b}=0$.`,
    hip: p => [r`$${p.a}$ tiene inverso $${p.a}^{-1}$ y $${p.a}${p.b}=0$`, 'Puedes citar que $0\\cdot x=0$ en todo anillo'], meta: p => r`$${p.b}=0$`,
    L: p => [
      ['L1', r`Multiplicamos $${p.a}${p.b}=0$ por $${p.a}^{-1}$: $${p.a}^{-1}(${p.a}${p.b})=${p.a}^{-1}\cdot 0$.`, 'd.anillo'],
      ['L2', r`Por asociatividad, el miembro izquierdo es $(${p.a}^{-1}${p.a})${p.b}=1\cdot ${p.b}=${p.b}$.`, 'd.anillo', ['L1']],
      ['L3', r`El miembro derecho es $${p.a}^{-1}\cdot 0$, que es igual a ⟦h1⟧ por las reglas del anillo.`, 't.anillo-cero-producto', ['L1'], [H('h1', r`$0$`, [r`$0$`, r`$1$`, r`$${p.a}^{-1}$`], false)]],
      ['L4', r`Igualando, $${p.b}=0$. Luego una unidad no es divisor de cero. ∎`, 'd.divisor-cero', ['L2', 'L3']],
    ],
    dist: p => [[r`En $\mathbb{Z}_7$, $3b=0$ implica $b=0$; luego siempre.`, 'un ejemplo no prueba el caso general'], [r`Como $${p.a}\neq0$, de $${p.a}${p.b}=0$ sale $${p.b}=0$.`, 'en un anillo con divisores de cero eso falla (por ejemplo $2\\cdot3=0$ en $\\mathbb{Z}_6$); aquí se necesita que $a$ sea unidad']],
    err: p => [['L1', r`Multiplicamos $${p.a}${p.b}=0$ por $${p.a}$ (sumamos): $${p.a}+${p.a}${p.b}=0$.`, 'conclusion-invalida', 'Hay que multiplicar por el **inverso** $a^{-1}$.'], ['L3', r`El miembro derecho es $${p.a}^{-1}\cdot 0=${p.a}^{-1}$.`, 'error-de-calculo', 'Cualquier producto por $0$ es $0$.']],
    valida: [['inverso', r`Multiplicar por el inverso de $a$ para despejar $b$`, 'Es la prueba estándar.']],
    idea: p => r`multiplica por $${p.a}^{-1}$ a ambos lados de $${p.a}${p.b}=0$.`, primero: p => r`aplica $${p.a}^{-1}\cdot$ a la igualdad.`,
  });

  dem2({
    id: 'dem.zn-cuerpo', teorema: 't.zn-cuerpo', nivel: '8.4', habilidades: ['8.4.zn', '8.4.ecuaciones', '8.4.demostrar'], requiere: ['t.lema-euclides', 't.unidades-grupo', 't.unidad-no-divisor-cero'], refsExtra: ['d.cuerpo', 'd.primo', 'd.divisor-cero', 'b.doble-implicacion'],
    param: rng => ({ n: rng.pick(['n', 'p']), a: rng.pick(['a', 'x']), b: rng.pick(['b', 'y']) }),
    enunciado: p => r`Demuestra que $\mathbb{Z}_${p.n}$ ($${p.n}\ge2$) es un cuerpo si y solo si $${p.n}$ es primo.`,
    hip: p => [r`$${p.n}\ge2$`, 'Puedes citar el lema de Euclides, el grupo de unidades de $\\mathbb{Z}_n$ y que una unidad no es divisor de cero'], meta: p => r`$\mathbb{Z}_${p.n}$ cuerpo $\iff ${p.n}$ primo`,
    L: p => [
      ['L1', r`(⇐) Si $${p.n}$ es primo y $1\le ${p.a}<${p.n}$, entonces $\gcd(${p.a},${p.n})=1$ (el único divisor positivo propio de un primo es $1$).`, 'd.primo'],
      ['L2', r`Por el teorema del grupo de unidades, $${p.a}$ es una unidad: tiene inverso. Así todo elemento no nulo tiene inverso: $\mathbb{Z}_${p.n}$ es un cuerpo.`, 't.unidades-grupo', ['L1']],
      ['L3', r`(⇒) Supongamos que $${p.n}$ no es primo: $${p.n}=${p.a}${p.b}$ con $1<${p.a},${p.b}<${p.n}$. Entonces $${p.a}\cdot ${p.b}\equiv0$ con $${p.a},${p.b}\not\equiv0$.`, 'd.divisor-cero'],
      ['L4', r`Si $\mathbb{Z}_${p.n}$ fuera un cuerpo, $${p.a}$ sería unidad y, por el teorema de que una unidad no es divisor de cero, $${p.b}\equiv0$: contradicción.`, 't.unidad-no-divisor-cero', ['L3']],
      ['L5', r`Luego si $\mathbb{Z}_${p.n}$ es cuerpo, ⟦h1⟧. ∎`, 'b.doble-implicacion', ['L2', 'L4'], [H('h1', r`$${p.n}$ es primo`, [r`$${p.n}$ es primo`, r`$${p.n}$ es par`, r`$${p.n}=1$`], false)]],
    ],
    dist: p => [[r`$\mathbb{Z}_5$ y $\mathbb{Z}_7$ son cuerpos y $5,7$ son primos; luego siempre.`, 'un ejemplo no prueba el caso general'], [r`Si $${p.n}$ es primo, $\mathbb{Z}_${p.n}$ es cuerpo; el recíproco es obvio.`, 'el recíproco hay que probarlo con divisores de cero']],
    err: p => [['L1', r`Si $${p.n}$ es primo y $1\le ${p.a}<${p.n}$, entonces $${p.a}$ divide a $${p.n}$.`, 'error-de-calculo', '$a$ no divide a $n$ (si lo hiciera, $n$ no sería primo): son coprimos.'], ['L3', r`$${p.n}=${p.a}${p.b}$ con $1<${p.a},${p.b}<${p.n}$; entonces $${p.a}+${p.b}\equiv0$.`, 'error-de-calculo', 'Es el **producto** $ab\\equiv0$.']],
    valida: [['dos-implicaciones', r`Probar (⇐) con coprimalidad y (⇒) con divisores de cero`, 'Es la prueba estándar.']],
    idea: p => r`primo $\Rightarrow$ todo no nulo es coprimo con $${p.n}$; compuesto $\Rightarrow$ $${p.a}${p.b}\equiv0$.`, primero: p => r`prueba (⇐) con $\gcd(${p.a},${p.n})=1$.`,
  });

  dem2({
    id: 'dem.dominio-finito-cuerpo', teorema: 't.dominio-finito-cuerpo', nivel: '8.4', habilidades: ['8.4.reconocer', '8.4.contar', '8.4.demostrar'], requiere: ['t.anillo-cero-producto'], refsExtra: ['d.dominio', 'd.cuerpo', 'd.inyectiva-lineal', 'b.casos'],
    param: rng => ({ d: rng.pick(['D', 'A']), a: rng.pick(['a', 'x']), f: rng.pick(['f', 'm']) }),
    enunciado: p => r`Sea $${p.d}$ un dominio de integridad finito. Demuestra que $${p.d}$ es un cuerpo.`,
    hip: p => [r`$${p.d}$ es finito, conmutativo, con $1\neq0$ y sin divisores de cero`, 'Puedes citar las reglas del anillo'], meta: p => r`todo $${p.a}\neq0$ tiene inverso en $${p.d}$`,
    L: p => [
      ['L1', r`Sea $${p.a}\in ${p.d}$, $${p.a}\neq0$. Definimos $${p.f}:${p.d}\to ${p.d}$ por $${p.f}(x)=${p.a}x$.`, 'd.dominio'],
      ['L2', r`$${p.f}$ es inyectiva: si $${p.a}x=${p.a}y$, entonces $${p.a}(x-y)=0$ y, como $${p.a}\neq0$ y no hay divisores de cero, $x-y=0$.`, 't.anillo-cero-producto', ['L1']],
      ['L3', r`Como $${p.d}$ es finito y $${p.f}$ es inyectiva, $${p.f}$ es ⟦h1⟧ (principio del palomar).`, 'd.inyectiva-lineal', ['L2'], [H('h1', 'sobreyectiva', ['sobreyectiva', 'constante', 'nula'], false)]],
      ['L4', r`Luego existe $x$ con $${p.a}x=1$: $${p.a}$ tiene inverso. Todo elemento no nulo es invertible y $${p.d}$ es un cuerpo. ∎`, 'd.cuerpo', ['L3']],
    ],
    dist: p => [[r`$\mathbb{Z}_7$ es un dominio finito y es cuerpo; luego siempre.`, 'un ejemplo no prueba el caso general'], [r`El resultado falla para $\mathbb{Z}$ y por tanto es falso.`, '$\\mathbb{Z}$ es un dominio **infinito**: no es contraejemplo']],
    err: p => [['L2', r`$${p.f}$ es inyectiva: si $${p.a}x=${p.a}y$, entonces $x=y$ porque $${p.a}$ es positivo.`, 'conclusion-invalida', 'Se usa que no hay divisores de cero, no el signo.'], ['L3', r`Como $${p.d}$ es finito y $${p.f}$ es inyectiva, $${p.f}$ es constante.`, 'error-de-calculo', 'Una inyectiva de un conjunto finito en sí mismo es sobreyectiva.']],
    valida: [['palomar', r`Mostrar que $x\mapsto ax$ es inyectiva, por tanto sobreyectiva, y alcanzar el $1$`, 'Es la prueba estándar.']],
    idea: p => r`la multiplicación por $${p.a}$ es una biyección del conjunto finito $${p.d}$.`, primero: p => r`define $${p.f}(x)=${p.a}x$ y prueba que es inyectiva.`,
  });

  R.nivel({
    id: '8.4', mundo: 8, titulo: 'Anillos y cuerpos', tema: 'Anillos, divisores de cero, cuerpos finitos',
    habilidades: ['8.4.reconocer', '8.4.zn', '8.4.ecuaciones', '8.4.contar', '8.4.demostrar'],
    teoremas: ['t.anillo-cero-producto', 't.unidad-no-divisor-cero', 't.zn-cuerpo', 't.dominio-finito-cuerpo'],
    leccion: {
      intro: 'Un **anillo** tiene suma (un grupo conmutativo) y producto asociativo, ligados por la distributividad. Si además el producto es conmutativo y todo elemento no nulo tiene inverso, es un **cuerpo**. $\\mathbb{Z}$ es anillo; $\\mathbb{Q},\\mathbb{R},\\mathbb{C}$ son cuerpos.',
      definiciones: [
        { nombre: 'Unidades y divisores de cero', tex: 'En $\\mathbb{Z}_n$ cada clase no nula es **unidad** ($\\gcd(a,n)=1$) o **divisor de cero** ($\\gcd(a,n)>1$). Una unidad nunca es divisor de cero.' },
        { nombre: 'Cuándo es cuerpo', tex: '$\\mathbb{Z}_n$ es cuerpo $\\iff n$ es primo. Para $n$ compuesto hay divisores de cero y ecuaciones $ax=b$ con $0$ o varias soluciones.' },
        { nombre: 'Dominios', tex: 'Un **dominio** no tiene divisores de cero (se puede cancelar). Todo dominio **finito** es cuerpo.' },
        { nombre: 'En un cuerpo', tex: 'Un polinomio de grado $d$ tiene a lo sumo $d$ raíces (por eso $x^2=1$ solo tiene $\\pm1$ en $\\mathbb{Z}_p$), pero en $\\mathbb{Z}_n$ compuesto puede tener más.' },
      ],
      teorema: 't.zn-cuerpo',
      ejemplo: { enunciado: 'Resuelve $4x\\equiv6\\pmod{10}$ en $\\mathbb{Z}_{10}$.', pasos: ['$\\gcd(4,10)=2$ y $2\\mid6$: hay solución, con $2$ soluciones.', 'Dividiendo entre $2$: $2x\\equiv3\\pmod5$, es decir $x\\equiv4\\pmod5$.', 'Las soluciones en $\\mathbb{Z}_{10}$ son $x=4$ y $x=9$.'] },
    },
  });

  if (typeof module !== 'undefined') module.exports = AC;
})(globalThis.AC = globalThis.AC || {});
