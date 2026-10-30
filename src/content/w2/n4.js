/* Mundo 2, nivel 2.4 — Congruencias en uso: inversos, teorema chino del resto, cifrado y rotaciones. */
(function (AC) {
  const { R, H, T, gen, dem2 } = AC.cont, r = String.raw, N = AC.numth;
  R.ref({ id: 'b.palomar', tipo: 'propiedad-base', nombre: 'Si p−1 valores distintos están entre p−1 posibles, aparecen todos' });

  const HB = (id, nombre) => R.habilidad({ id: '2.4.' + id, nombre, nivel: '2.4' });
  HB('inverso', 'Inversos modulares'); HB('tcr', 'Teorema chino del resto'); HB('cifrado-afin', 'Cifrado afín'); HB('rsa', 'RSA de juguete'); HB('rotaciones', 'Rotaciones y ciclos'); HB('demostrar', 'Demostrar con módulos');
  const TE = (id, titulo, enunciado, requiere, hab) => R.teorema({ id, titulo, nivel: '2.4', enunciado, requiere, habilidades: hab });
  TE('t.tcr', 'Teorema chino del resto', r`Si $\operatorname{mcd}(m,n)=1$, el sistema $x\equiv a\pmod m$, $x\equiv b\pmod n$ tiene solución, única módulo $mn$.`, ['t.inverso-modular', 't.cong-operaciones', 't.lema-euclides'], ['2.4.tcr', '2.4.demostrar']);
  TE('t.fermat', 'Pequeño teorema de Fermat', r`Si $p$ es primo y $p\nmid a$, entonces $a^{p-1}\equiv 1\pmod p$.`, ['t.cong-cancelacion', 't.cong-operaciones', 't.lema-euclides'], ['2.4.inverso', '2.4.demostrar']);
  TE('t.euler', 'Teorema de Euler', r`Si $\operatorname{mcd}(a,n)=1$, entonces $a^{\varphi(n)}\equiv 1\pmod n$.`, ['t.cong-cancelacion', 't.cong-operaciones'], ['2.4.inverso', '2.4.demostrar']);
  TE('t.rsa-correccion', 'Corrección de RSA', r`Si $p\neq q$ son primos y $ed\equiv 1\pmod{(p-1)(q-1)}$, entonces $(m^e)^d\equiv m\pmod{pq}$ para todo $m$.`, ['t.fermat', 't.tcr'], ['2.4.rsa', '2.4.demostrar']);

  /* ---------- generadores ---------- */
  gen.entero({
    id: 'w2.n4.inverso-modular', nivel: '2.4', habilidades: ['2.4.inverso'], dificultad: 2,
    hacer(rng) {
      const n = rng.int(7, 60), a = rng.int(2, n - 1), inv = N.inverso(a, n);
      if (inv === null || inv === a) return null;
      return { key: a + ',' + n, enun: 'Halla el inverso de $' + a + '$ módulo $' + n + '$: el $x$ con $0<x<' + n + '$ tal que $' + a + 'x\\equiv 1\\pmod{' + n + '}$.', res: inv,
        firmas: [['opuesto', n - a, 'Eso es $-a$ módulo $n$, no el inverso: $a\\cdot(n-a)\\equiv -a^2$.'], ['opuesto-del-inverso', n - inv, 'Es el inverso con el signo cambiado: $a\\cdot x$ da $-1$, no $1$.'], ['recíproco', 1, 'No se invierte como $1/a$: hay que encontrar $x$ con $ax\\equiv 1$.']],
        pistas: ['Orientación: usa Euclides extendido para escribir $1=' + a + 'x+' + n + 'y$.', 'Idea clave: el inverso es el coeficiente $x$ de Bézout, reducido módulo $' + n + '$.', 'Primer paso: aplica Euclides a $(' + n + ',' + a + ')$.'], expl: '$' + a + '\\cdot ' + inv + '=' + a * inv + '\\equiv 1\\pmod{' + n + '}$.' };
    },
  });

  gen.entero({
    id: 'w2.n4.tcr', nivel: '2.4', habilidades: ['2.4.tcr'], dificultad: 3,
    hacer(rng) {
      const [m, n] = rng.sample([3, 4, 5, 7, 8, 9, 11, 13], 2); if (N.gcd(m, n) !== 1) return null;
      const a = rng.int(0, m - 1), b = rng.int(0, n - 1), x = N.tcr2(a, m, b, n);
      return { key: [a, m, b, n].join(','), enun: 'Halla el menor $x\\ge 0$ con $x\\equiv ' + a + '\\pmod{' + m + '}$ y $x\\equiv ' + b + '\\pmod{' + n + '}$.', res: x,
        firmas: [['restos-cruzados', N.tcr2(b, m, a, n), 'Intercambiaste los restos: $x\\equiv a$ va con el módulo $m$ y $x\\equiv b$ con $n$.'], ['solo-un-modulo', a + m * ((b - a) % n < 0 ? 0 : 1), 'Debe cumplir las dos congruencias a la vez, no solo una.'], ['complemento', m * n - x, 'Es el opuesto módulo $mn$: cumple las congruencias con los signos cambiados.']],
        pistas: ['Orientación: los módulos son coprimos: hay una única solución módulo $' + m * n + '$.', 'Idea clave: escribe $x=' + a + '+' + m + 't$ y exige $x\\equiv ' + b + '\\pmod{' + n + '}$.', 'Primer paso: resuelve $' + m + 't\\equiv ' + (b - a) + '\\pmod{' + n + '}$.'], expl: '$x=' + x + '$.' };
    },
  });

  gen.tupla({
    id: 'w2.n4.cifrado-afin', nivel: '2.4', habilidades: ['2.4.cifrado-afin', '2.4.inverso'], dificultad: 2,
    hacer(rng) {
      const a = rng.pick([3, 5, 7, 9, 11, 15, 17, 19, 21, 23, 25]), b = rng.int(1, 25), xs = rng.sample(Array.from({ length: 26 }, (_, i) => i), 3), descifrar = rng.chance(0.4), inv = N.inverso(a, 26);
      const E = x => N.mod(a * x + b, 26), D = y => N.mod(inv * (y - b), 26);
      const ent = descifrar ? xs : xs; const res = (descifrar ? xs.map(E) : xs.map(E));
      // para descifrar se muestran los cifrados y se piden los originales
      const dadas = descifrar ? xs.map(E) : xs, sol = descifrar ? xs : xs.map(E);
      void ent; void res;
      const mal = descifrar ? [['aplica-cifrado', dadas.map(E), 'Aplicaste el cifrado otra vez; para descifrar hay que deshacerlo: $x=a^{-1}(y-b)$.'], ['sin-inverso', dadas.map(y => N.mod(y - b, 26)), 'Restaste $b$ pero falta multiplicar por el inverso de $a=' + a + '$ (que es $' + inv + '$).']]
        : [['sin-modulo', xs.map(x => a * x + b), 'Falta reducir módulo $26$.'], ['orden-cambiado', xs.map(x => N.mod(a * (x + b), 26)), 'El orden es $ax+b$: primero se multiplica y después se suma $b$.'], ['inverso', xs.map(x => N.mod(inv * (x - b), 26)), 'Eso es descifrar, no cifrar.']];
      return { key: [a, b, descifrar, ...dadas].join(','), enun: (descifrar ? 'Se cifró con $E(x)=' + a + 'x+' + b + '\\pmod{26}$ (letras $A=0,\\dots,Z=25$). Los números cifrados son $' + dadas.join(',\\ ') + '$. Recupera los números originales (' + inv + ' es el inverso de ' + a + ' módulo 26).' : 'Cifra con $E(x)=' + a + 'x+' + b + '\\pmod{26}$ (letras $A=0,\\dots,Z=25$) los números $' + dadas.join(',\\ ') + '$.'),
        campos: ['1.º', '2.º', '3.º'], res: sol, firmas: mal.filter(m => JSON.stringify(m[1].map(String)) !== JSON.stringify(sol.map(String))),
        pistas: ['Orientación: trabaja siempre con restos entre $0$ y $25$.', descifrar ? 'Idea clave: para deshacer $y=ax+b$ se resta $b$ y se multiplica por $a^{-1}$ módulo $26$.' : 'Idea clave: se multiplica por $a$, se suma $b$ y se reduce módulo $26$.', 'Primer paso: ' + (descifrar ? 'resta $' + b + '$ al primer número.' : 'calcula $' + a + '\\cdot ' + dadas[0] + '+' + b + '$.')], expl: 'Resultado: $' + sol.join(',\\ ') + '$.' };
    },
  });

  gen.entero({
    id: 'w2.n4.rsa-juguete', nivel: '2.4', habilidades: ['2.4.rsa', '2.4.inverso'], dificultad: 3,
    hacer(rng) {
      const [p, q] = rng.sample([3, 5, 7, 11, 13], 2), n = p * q, f = (p - 1) * (q - 1), es = N.coprimos(f, 3, f - 1).filter(e => N.inverso(e, f) !== e);
      if (!es.length) return null;
      const e = rng.pick(es), d = N.inverso(e, f), m = rng.int(2, n - 1), c = N.potmod(m, e, n), tipo = rng.pick(['d', 'cifrar']);
      if (tipo === 'd') return { key: 'd' + [p, q, e].join(','), enun: 'Con primos $p=' + p + '$, $q=' + q + '$ y exponente público $e=' + e + '$, ¿cuál es el exponente privado $d$ (con $0<d<(p-1)(q-1)$ y $ed\\equiv 1\\pmod{(p-1)(q-1)}$)?', res: d,
        firmas: [['usa-n', N.inverso(e, n) || 1, 'El inverso se toma módulo $\\varphi(n)=(p-1)(q-1)$, no módulo $n$.'], ['usa-e', e, 'Ese es el exponente público; $d$ es su inverso.'], ['phi-menos-e', f - e, 'Eso es $-e$ módulo $\\varphi(n)$, no el inverso.']],
        pistas: ['Orientación: calcula primero $\\varphi(n)=(p-1)(q-1)=' + f + '$.', 'Idea clave: $d$ es el inverso de $e$ módulo $\\varphi(n)$.', 'Primer paso: aplica Euclides extendido a $(' + f + ',' + e + ')$.'], expl: '$d=' + d + '$.' };
      return { key: 'c' + [p, q, e, m].join(','), enun: 'Con $n=' + n + '$ y clave pública $e=' + e + '$, cifra el mensaje $m=' + m + '$: calcula $m^e\\bmod n$.', res: c,
        firmas: [['sin-modulo', m * e, 'No es $m\\cdot e$: es la potencia $m^e$ reducida módulo $n$.'], ['modulo-phi', N.potmod(m, e, f), 'El módulo del cifrado es $n=' + n + '$, no $\\varphi(n)$.']],
        pistas: ['Orientación: usa cuadrados sucesivos módulo $' + n + '$.', 'Idea clave: reduce en cada multiplicación.', 'Primer paso: calcula $m^2\\bmod ' + n + '$.'], expl: '$' + m + '^{' + e + '}\\equiv' + c + '\\pmod{' + n + '}$.' };
    },
  });

  gen.entero({
    id: 'w2.n4.rotaciones-ciclos', nivel: '2.4', habilidades: ['2.4.rotaciones'], dificultad: 2,
    hacer(rng) {
      const n = rng.pick([8, 10, 12, 15, 16, 18, 20, 24, 30]), t = rng.int(2, n - 1), tipo = rng.pick(['posicion', 'vuelta']);
      if (tipo === 'posicion') { const s = rng.int(0, n - 1), k = rng.int(7, 40), res = N.mod(s + t * k, n);
        return { key: 'p' + [n, s, t, k].join(','), enun: 'Un dial tiene $' + n + '$ marcas numeradas $0,\\dots,' + (n - 1) + '$ y empieza en la marca $' + s + '$. Se gira $' + t + '$ marcas en el mismo sentido, $' + k + '$ veces seguidas. ¿En qué marca queda?', res,
          firmas: [['sin-modulo', s + t * k, 'Falta reducir módulo $' + n + '$: pasada la marca $' + (n - 1) + '$ se vuelve a $0$.'], ['una-vez', N.mod(s + t, n), 'Eso es un solo giro; son $' + k + '$.'], ['olvida-inicio', N.mod(t * k, n), 'Olvidaste la marca inicial $' + s + '$.']],
          pistas: ['Orientación: la posición final es $s+tk$ módulo $' + n + '$.', 'Idea clave: reduce módulo $' + n + '$ al final (o en cada paso).', 'Primer paso: calcula $t\\cdot k$.'], expl: '$' + s + '+' + t + '\\cdot ' + k + '\\equiv' + res + '\\pmod{' + n + '}$.' }; }
      const res = n / N.gcd(t, n);
      return { key: 'v' + [n, t].join(','), enun: 'Un dial tiene $' + n + '$ marcas. Se gira siempre $' + t + '$ marcas en el mismo sentido. ¿Cuántos giros hacen falta, como mínimo, para volver a la marca de partida?', res,
        firmas: [['n', n, 'Eso solo pasa si $\\operatorname{mcd}(t,n)=1$.'], ['mcd', N.gcd(t, n), 'Eso es el mcd; el número de giros es $n/\\operatorname{mcd}(t,n)$.'], ['mcm', N.lcm(t, n), 'El mcm cuenta marcas recorridas, no giros: hay que dividir entre $t$.']],
        pistas: ['Orientación: se vuelve al inicio cuando $tk\\equiv 0\\pmod n$.', 'Idea clave: el menor $k>0$ con $n\\mid tk$ es $n/\\operatorname{mcd}(t,n)$.', 'Primer paso: calcula $\\operatorname{mcd}(' + t + ',' + n + ')$.'], expl: 'Hacen falta ' + res + ' giros.' };
    },
  });

  gen.entero({
    id: 'w2.n4.fermat-aplicar', nivel: '2.4', habilidades: ['2.4.inverso'], dificultad: 3,
    hacer(rng) {
      const p = rng.pick([5, 7, 11, 13, 17, 19, 23]), a = rng.int(2, p - 1), e = rng.int(2 * p, 400), res = N.potmod(a, e, p);
      return { key: [a, e, p].join(','), enun: 'Calcula $' + a + '^{' + e + '}\\bmod ' + p + '$ ayudándote del teorema de Fermat ($p=' + p + '$ es primo).', res,
        firmas: [['reduce-por-p', N.potmod(a, e % p, p), 'El exponente se reduce módulo $p-1=' + (p - 1) + '$, no módulo $p$.'], ['uno', 1, 'Solo $a^{p-1}\\equiv 1$: aquí el exponente no es múltiplo de $p-1$.'], ['resto-exp', e % (p - 1), 'Ese es el resto del exponente, no el valor de la potencia.']],
        pistas: ['Orientación: Fermat dice $a^{p-1}\\equiv 1$; divide el exponente entre $p-1=' + (p - 1) + '$.', 'Idea clave: $a^e\\equiv a^{e\\bmod (p-1)}\\pmod p$.', 'Primer paso: calcula $' + e + '\\bmod ' + (p - 1) + '$.'], expl: '$' + a + '^{' + e + '}\\equiv ' + a + '^{' + (e % (p - 1)) + '}\\equiv ' + res + '\\pmod{' + p + '}$.' };
    },
  });

  /* ---------- demostraciones ---------- */
  dem2({
    id: 'dem.tcr', teorema: 't.tcr', nivel: '2.4', habilidades: ['2.4.tcr', '2.4.demostrar'], requiere: ['t.inverso-modular', 't.cong-operaciones', 't.lema-euclides'], refsExtra: ['d.divisibilidad', 'b.arbitrario', 'd.mcd'],
    param: rng => { const [m, n] = rng.pick([['m', 'n'], ['p', 'q']]); return { m, n, a: rng.pick(['a', 'r']), b: rng.pick(['b', 's']), x: rng.pick(['x', 'z']) }; },
    enunciado: p => r`Demuestra que si $\operatorname{mcd}(${p.m},${p.n})=1$, el sistema $${p.x}\equiv ${p.a}\pmod ${p.m}$, $${p.x}\equiv ${p.b}\pmod ${p.n}$ tiene solución, única módulo $${p.m}${p.n}$.`,
    hip: p => [r`$\operatorname{mcd}(${p.m},${p.n})=1$`, r`$${p.a},${p.b}\in\mathbb{Z}$`], meta: p => r`existe solución y es única módulo $${p.m}${p.n}$`,
    L: p => [
      ['L1', r`Existencia. Como $\operatorname{mcd}(${p.m},${p.n})=1$, existe $u$ con $${p.m}u\equiv 1\pmod ${p.n}$ (inverso modular).`, 't.inverso-modular'],
      ['L2', r`Sea $${p.x}_0=${p.a}+${p.m}\,u\,(${p.b}-${p.a})$. Difiere de $${p.a}$ en un múltiplo de $${p.m}$, así que $${p.x}_0\equiv ${p.a}\pmod ${p.m}$.`, 'd.congruencia', ['L1']],
      ['L3', r`Módulo $${p.n}$: $${p.x}_0\equiv ${p.a}+(${p.m}u)(${p.b}-${p.a})\equiv ${p.a}+1\cdot(${p.b}-${p.a})=$ ⟦h1⟧, por las operaciones con congruencias.`, 't.cong-operaciones', ['L1'], [H('h1', p.b, [p.a, p.m, p.n], false)]],
      ['L4', r`Unicidad. Si $${p.x}$ y $${p.x}'$ son soluciones, $${p.m}\mid ${p.x}-${p.x}'$ y $${p.n}\mid ${p.x}-${p.x}'$; escribimos $${p.x}-${p.x}'=${p.m}k$.`, 'd.congruencia'],
      ['L5', r`Como $${p.n}\mid ${p.m}k$ y $\operatorname{mcd}(${p.n},${p.m})=1$, por el lema de Euclides $${p.n}\mid k$; luego $${p.m}${p.n}\mid ${p.x}-${p.x}'$. ∎`, 't.lema-euclides', ['L4']],
    ],
    dist: p => [[r`Resolvemos $${p.x}\equiv 2\pmod 3$, $${p.x}\equiv 3\pmod 4$ por tanteo: $x=11$; luego siempre hay solución.`, 'un ejemplo no prueba el teorema'], [r`Como $${p.m}$ y $${p.n}$ son coprimos, $${p.x}=${p.a}+${p.b}$ es solución.`, 'sumar los restos no cumple las congruencias en general']],
    err: p => [['L2', r`Sea $${p.x}_0=${p.a}+${p.n}\,u\,(${p.b}-${p.a})$; entonces $${p.x}_0\equiv ${p.a}\pmod ${p.m}$.`, 'error-de-calculo', 'El múltiplo debe ser de $m$ para no cambiar la clase módulo $m$.'], ['L5', r`Como $${p.n}\mid ${p.m}k$, entonces $${p.n}\mid ${p.m}$ o $${p.n}\mid k$. ∎`, 'conclusion-invalida', 'Eso es cierto solo para $n$ primo; aquí se usa el lema de Euclides con $\\operatorname{mcd}=1$.']],
    valida: [['inverso', r`Construir la solución con el inverso de $m$ módulo $n$ y probar unicidad con el lema de Euclides`, 'Es la prueba estándar.'], ['conteo', r`Contar: las $mn$ clases se envían inyectivamente a pares de restos`, 'También funciona: la inyectividad es la unicidad y el conteo da la existencia.']],
    idea: p => r`busca $${p.x}=${p.a}+${p.m}t$ y exige $${p.x}\equiv ${p.b}\pmod ${p.n}$.`, primero: p => r`obtén el inverso de $${p.m}$ módulo $${p.n}$.`,
  });

  dem2({
    id: 'dem.fermat', teorema: 't.fermat', nivel: '2.4', habilidades: ['2.4.inverso', '2.4.demostrar'], requiere: ['t.cong-cancelacion', 't.cong-operaciones', 't.lema-euclides'], refsExtra: ['d.primo', 'b.palomar', 'd.congruencia'],
    param: rng => ({ a: rng.pick(['a', 'b']), p: rng.pick(['p', 'q']), i: rng.pick(['i', 'k']), j: rng.pick(['j', 'l']) }),
    enunciado: p => r`Demuestra que si $${p.p}$ es primo y $${p.p}\nmid ${p.a}$, entonces $${p.a}^{${p.p}-1}\equiv 1\pmod ${p.p}$.`,
    hip: p => [r`$${p.p}$ es primo y $${p.p}\nmid ${p.a}$`, 'Puedes citar la cancelación, las operaciones con congruencias y el lema de Euclides'], meta: p => r`$${p.a}^{${p.p}-1}\equiv 1\pmod ${p.p}$`,
    L: p => [
      ['L1', r`Consideramos los $${p.p}-1$ números $${p.a},2${p.a},\dots,(${p.p}-1)${p.a}$.`, 'd.primo'],
      ['L2', r`Si $${p.i}${p.a}\equiv ${p.j}${p.a}\pmod ${p.p}$ con $1\le ${p.i},${p.j}\le ${p.p}-1$, como $\operatorname{mcd}(${p.a},${p.p})=1$ la ⟦h1⟧ da $${p.i}\equiv ${p.j}$, es decir $${p.i}=${p.j}$.`, 't.cong-cancelacion', ['L1'], [H('h1', 'cancelación', ['cancelación', 'suma', 'reflexividad'], false)]],
      ['L3', r`Además ninguno es $\equiv 0$. Luego los $${p.p}-1$ restos son distintos y no nulos: son $1,2,\dots,${p.p}-1$ en algún orden (principio del palomar).`, 'b.palomar', ['L2']],
      ['L4', r`Multiplicando todos: $${p.a}^{${p.p}-1}(${p.p}-1)!\equiv(${p.p}-1)!\pmod ${p.p}$.`, 't.cong-operaciones', ['L3']],
      ['L5', r`$${p.p}\nmid(${p.p}-1)!$: si dividiera al producto dividiría a algún factor menor que $${p.p}$ (lema de Euclides), absurdo. Luego $\operatorname{mcd}((${p.p}-1)!,${p.p})=1$.`, 't.lema-euclides', ['L4']],
      ['L6', r`Cancelando $(${p.p}-1)!$, $${p.a}^{${p.p}-1}\equiv 1\pmod ${p.p}$. ∎`, 't.cong-cancelacion', ['L4', 'L5']],
    ],
    dist: p => [[r`Comprobamos con $${p.p}=7$ y $${p.a}=3$: $3^6=729\equiv 1$; luego vale siempre.`, 'un ejemplo no prueba el teorema'], [r`Como $${p.a}^{${p.p}}\equiv ${p.a}$ siempre, se sigue $${p.a}^{${p.p}-1}\equiv 1$.`, 'eso es una consecuencia del teorema, no su justificación']],
    err: p => [['L3', r`Los restos son distintos y no nulos, luego son todos pares.`, 'conclusion-invalida', 'Que sean distintos y no nulos solo dice que son $1,\\dots,p-1$ en algún orden.'], ['L5', r`$${p.p}$ divide a $(${p.p}-1)!$ porque $${p.p}$ es primo.`, 'conclusion-invalida', 'Un primo $p$ **no** divide a $(p-1)!$ (todos sus factores son menores que $p$).'], ['L2', r`Si $${p.i}${p.a}\equiv ${p.j}${p.a}$ entonces $${p.a}\equiv 0$.`, 'error-de-calculo', 'Cancelar da $i\\equiv j$, no $a\\equiv 0$.']],
    valida: [['permutacion', r`Multiplicar los restos de $a,2a,\dots,(p-1)a$ y cancelar $(p-1)!$`, 'Es la prueba estándar.'], ['induccion', r`Probar $a^p\equiv a$ por inducción con el binomio de Newton`, 'Es válida con binomio y coeficientes divisibles por $p$; no usa los teoremas de este nivel.']],
    idea: p => r`los múltiplos $${p.a},2${p.a},\dots,(${p.p}-1)${p.a}$ recorren todos los restos no nulos.`, primero: p => r`prueba que dos de esos múltiplos nunca son congruentes.`,
  });

  dem2({
    id: 'dem.euler', teorema: 't.euler', nivel: '2.4', habilidades: ['2.4.inverso', '2.4.demostrar'], requiere: ['t.cong-cancelacion', 't.cong-operaciones'], refsExtra: ['b.coprimo-producto', 'b.palomar', 'd.mcd', 't.lema-euclides'],
    param: rng => ({ a: rng.pick(['a', 'b']), n: rng.pick(['n', 'm']), f: rng.pick(['k', 't']) }),
    enunciado: p => r`Demuestra que si $\operatorname{mcd}(${p.a},${p.n})=1$, entonces $${p.a}^{\varphi(${p.n})}\equiv 1\pmod ${p.n}$.`,
    hip: p => [r`$\operatorname{mcd}(${p.a},${p.n})=1$`, r`$r_1,\dots,r_{\varphi}$ son los restos coprimos con $${p.n}$ (hay $\varphi(${p.n})$ de ellos)`], meta: p => r`$${p.a}^{\varphi(${p.n})}\equiv 1\pmod ${p.n}$`,
    L: p => [
      ['L1', r`Sean $r_1,\dots,r_\varphi$ los restos módulo $${p.n}$ coprimos con $${p.n}$, con $\varphi=\varphi(${p.n})$. Consideramos $${p.a}r_1,\dots,${p.a}r_\varphi$.`, 'd.mcd'],
      ['L2', r`Cada $${p.a}r_i$ es coprimo con $${p.n}$, porque producto de coprimos con $${p.n}$ es coprimo con $${p.n}$.`, 'b.coprimo-producto', ['L1']],
      ['L3', r`Si $${p.a}r_i\equiv ${p.a}r_j$, por ⟦h1⟧ (con $\operatorname{mcd}(${p.a},${p.n})=1$) resulta $r_i\equiv r_j$, es decir $i=j$.`, 't.cong-cancelacion', ['L1'], [H('h1', 'cancelación', ['cancelación', 'suma', 'reflexividad'], false)]],
      ['L4', r`Luego los $${p.a}r_i$ son $\varphi$ restos distintos y coprimos con $${p.n}$: son los $r_i$ en algún orden.`, 'b.palomar', ['L2', 'L3']],
      ['L5', r`Multiplicando: $${p.a}^{\varphi}\,r_1\cdots r_\varphi\equiv r_1\cdots r_\varphi\pmod ${p.n}$.`, 't.cong-operaciones', ['L4']],
      ['L6', r`El producto $r_1\cdots r_\varphi$ es coprimo con $${p.n}$; cancelándolo, $${p.a}^{\varphi}\equiv 1$. ∎`, 't.cong-cancelacion', ['L5']],
    ],
    dist: p => [[r`Comprobamos con $${p.n}=10$ y $${p.a}=3$: $3^4=81\equiv 1$; luego vale siempre.`, 'un ejemplo no prueba el teorema'], [r`Como $\varphi(${p.n})=${p.n}-1$, es el teorema de Fermat.`, 'eso solo es cierto si $n$ es primo']],
    err: p => [['L2', r`Cada $${p.a}r_i$ es coprimo con $${p.n}$ porque $${p.a}$ divide a $${p.n}$.`, 'conclusion-invalida', 'Es justo lo contrario: $a$ es coprimo con $n$, no divisor.'], ['L6', r`El producto es múltiplo de $${p.n}$, así que se anula y $${p.a}^{\varphi}\equiv 0$. ∎`, 'conclusion-invalida', 'El producto es coprimo con $n$, por eso se puede cancelar.'], ['L3', r`Si $${p.a}r_i\equiv ${p.a}r_j$ entonces $${p.a}\equiv 1$.`, 'error-de-calculo', 'Cancelando $a$ queda $r_i\\equiv r_j$.']],
    valida: [['permutacion', r`Multiplicar los restos coprimos reordenados por $a$ y cancelar su producto`, 'Es la prueba estándar (generaliza la de Fermat).'], ['lagrange', r`Usar el teorema de Lagrange en el grupo de unidades módulo $n$`, 'Válida y más breve, pero usa teoría de grupos que se desarrolla en el Mundo 8.']],
    idea: p => r`multiplicar por $${p.a}$ permuta los restos coprimos con $${p.n}$.`, primero: p => r`lista los restos coprimos con $${p.n}$.`,
  });

  dem2({
    id: 'dem.rsa-correccion', teorema: 't.rsa-correccion', nivel: '2.4', habilidades: ['2.4.rsa', '2.4.demostrar'], requiere: ['t.fermat', 't.tcr'], refsExtra: ['d.congruencia', 'd.primo', 't.lema-euclides'],
    param: rng => ({ p: rng.pick(['p', 'u']), q: rng.pick(['q', 'v']), m: rng.pick(['m', 'x']), e: rng.pick(['e']), d: rng.pick(['d']), k: rng.pick(['k', 't']) }),
    enunciado: p => r`Sean $${p.p}\neq ${p.q}$ primos y $${p.e}${p.d}\equiv 1\pmod{(${p.p}-1)(${p.q}-1)}$. Demuestra que $(${p.m}^{${p.e}})^{${p.d}}\equiv ${p.m}\pmod{${p.p}${p.q}}$ para todo entero $${p.m}$.`,
    hip: p => [r`$${p.p},${p.q}$ primos distintos`, r`$${p.e}${p.d}=1+${p.k}(${p.p}-1)(${p.q}-1)$ con $${p.k}\ge 0$`, 'Puedes citar Fermat y el teorema chino del resto'], meta: p => r`$(${p.m}^{${p.e}})^{${p.d}}\equiv ${p.m}\pmod{${p.p}${p.q}}$`,
    L: p => [
      ['L1', r`Como $(${p.m}^{${p.e}})^{${p.d}}=${p.m}^{${p.e}${p.d}}=${p.m}^{1+${p.k}(${p.p}-1)(${p.q}-1)}$, basta probar $${p.m}^{${p.e}${p.d}}\equiv ${p.m}$ módulo $${p.p}$ y módulo $${p.q}$.`, 'd.congruencia'],
      ['L2', r`Módulo $${p.p}$: si $${p.p}\mid ${p.m}$ ambos lados son $\equiv 0$. Si no, por Fermat $${p.m}^{${p.p}-1}\equiv 1$, y $${p.m}^{${p.e}${p.d}}=${p.m}\,(${p.m}^{${p.p}-1})^{${p.k}(${p.q}-1)}\equiv ${p.m}$.`, 't.fermat', ['L1']],
      ['L3', r`Módulo $${p.q}$: el mismo argumento con ⟦h1⟧ da $${p.m}^{${p.e}${p.d}}\equiv ${p.m}\pmod ${p.q}$.`, 't.fermat', ['L1'], [H('h1', 'el pequeño teorema de Fermat', ['el pequeño teorema de Fermat', 'el lema de Euclides', 'la cancelación'], false)]],
      ['L4', r`$x=${p.m}^{${p.e}${p.d}}$ y $${p.m}$ cumplen las mismas dos congruencias; por la unicidad del teorema chino del resto ($\operatorname{mcd}(${p.p},${p.q}) =1$), $x\equiv ${p.m}\pmod{${p.p}${p.q}}$. ∎`, 't.tcr', ['L2', 'L3']],
    ],
    dist: p => [[r`Con $${p.p}=3$, $${p.q}=5$, $${p.e}=3$, $${p.d}=3$ y $${p.m}=2$ se verifica; luego siempre.`, 'un ejemplo no prueba el teorema'], [r`Como $${p.m}^{\varphi(${p.p}${p.q})}\equiv 1$ para todo $${p.m}$, el resultado es inmediato.`, 'Euler exige $\\operatorname{mcd}(m,pq)=1$; aquí $m$ es cualquiera']],
    err: p => [['L2', r`Módulo $${p.p}$: por Fermat, $${p.m}^{${p.p}-1}\equiv 0$.`, 'error-de-calculo', 'Fermat da $\\equiv 1$ (si $p\\nmid m$), no $0$.'], ['L4', r`Como $x\equiv ${p.m}$ módulo $${p.p}$ o módulo $${p.q}$, entonces módulo $${p.p}${p.q}$. ∎`, 'conclusion-invalida', 'Hace falta que valga en **ambos** módulos a la vez (unicidad del TCR).']],
    valida: [['fermat-tcr', r`Probar la congruencia módulo $p$ y módulo $q$ con Fermat y unirlas con el TCR`, 'Es la prueba estándar.'], ['euler', r`Usar Euler cuando $\operatorname{mcd}(m,pq)=1$ y tratar aparte los demás casos`, 'Válida pero deja casos por tratar.']],
    idea: p => r`$${p.e}${p.d}=1+${p.k}(${p.p}-1)(${p.q}-1)$ permite usar Fermat módulo $${p.p}$ y módulo $${p.q}$ por separado.`, primero: p => r`escribe $${p.m}^{${p.e}${p.d}}$ como $${p.m}\cdot(\cdots)$.`,
  });

  R.nivel({
    id: '2.4', mundo: 2, titulo: 'Cifrado y rotaciones', tema: 'Inversos, teorema chino, Fermat, Euler y RSA',
    habilidades: ['2.4.inverso', '2.4.tcr', '2.4.cifrado-afin', '2.4.rsa', '2.4.rotaciones', '2.4.demostrar'],
    teoremas: ['t.tcr', 't.fermat', 't.euler', 't.rsa-correccion'],
    leccion: {
      intro: 'La aritmética modular sirve para **ciclos** (diales, relojes) y para **criptografía**: se cifra con una operación fácil de hacer y difícil de deshacer sin una clave.',
      definiciones: [
        { nombre: 'Teorema chino del resto', tex: 'Si $\\operatorname{mcd}(m,n)=1$, el sistema $x\\equiv a\\pmod m$, $x\\equiv b\\pmod n$ tiene una única solución módulo $mn$.' },
        { nombre: 'Fermat y Euler', tex: 'Si $p$ es primo y $p\\nmid a$, $a^{p-1}\\equiv 1\\pmod p$. En general, si $\\operatorname{mcd}(a,n)=1$, $a^{\\varphi(n)}\\equiv 1\\pmod n$, con $\\varphi(n)$ el número de restos coprimos con $n$.' },
        { nombre: 'Cifrado afín', tex: '$E(x)=ax+b\\pmod{26}$ con $\\operatorname{mcd}(a,26)=1$; se descifra con $D(y)=a^{-1}(y-b)$.' },
        { nombre: 'RSA', tex: 'Con $n=pq$, $e$ coprimo con $(p-1)(q-1)$ y $d$ su inverso módulo $(p-1)(q-1)$: se cifra $c=m^e\\bmod n$ y se descifra $m=c^d\\bmod n$.' },
      ],
      teorema: 't.rsa-correccion',
      ejemplo: { enunciado: 'Con $p=3$, $q=11$, $e=3$: halla $d$ y cifra $m=4$.', pasos: ['$n=33$ y $\\varphi=2\\cdot 10=20$.', '$d$ es el inverso de $3$ módulo $20$: $3\\cdot 7=21\\equiv 1$, así que $d=7$.', 'Cifrado: $c=4^3=64\\equiv 31\\pmod{33}$. Descifrado: $31^7\\equiv 4\\pmod{33}$.'] },
    },
  });

  if (typeof module !== 'undefined') module.exports = AC;
})(globalThis.AC = globalThis.AC || {});
