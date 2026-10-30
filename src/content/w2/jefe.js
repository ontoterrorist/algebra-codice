/* Mundo 2 — Jefe: «El Archivista de Relojes». Sus demostraciones exigen citar teoremas ganados en niveles anteriores. */
(function (AC) {
  const { R, H, T, gen, dem2 } = AC.cont, r = String.raw;
  R.jefe(2, { id: 'J2', titulo: 'El Archivista de Relojes', estrategia: 'w2.jefe.estrategia', demos: ['dem.jefe-fermat-general', 'dem.jefe-n5-menos-n', 'dem.jefe-z-mas-inverso'] });
  const J = { nivel: 'J2', mundo: 2, habilidades: [] };

  /* ---------- fase de estrategia: ¿qué herramienta del Mundo 2? ---------- */
  const MET = ['Euclides extendido (Bézout)', 'Teorema chino del resto', 'Pequeño teorema de Fermat o Euler', 'Inverso modular y congruencia lineal', 'Forma polar y De Moivre', 'Reducir por casos módulo $n$'];
  const RAZON = ['Se busca una combinación lineal entera de dos números.', 'Hay dos congruencias con módulos coprimos.', 'Una potencia grande con base coprima con el módulo: el exponente se reduce módulo $p-1$ o $\\varphi(n)$.', 'Se pide invertir un número módulo $n$ o resolver $ax\\equiv b$.', 'Hay potencias o raíces de números complejos.', 'Se afirma una propiedad de todos los enteros que depende solo de su resto.'];
  const CLAIMS = [
    ['Hallar enteros $x,y$ con $35x+21y=14$.', 0], ['Escribir $\\operatorname{mcd}(84,30)$ como combinación de $84$ y $30$.', 0], ['Hallar enteros $x,y$ con $17x+29y=1$.', 0],
    ['Hallar $x$ con $x\\equiv 2\\pmod 5$ y $x\\equiv 3\\pmod 7$.', 1], ['Hallar el menor $x\\ge 0$ con $x\\equiv 1\\pmod 4$ y $x\\equiv 4\\pmod 9$.', 1],
    ['Calcular $3^{1000}\\bmod 7$.', 2], ['Calcular $5^{222}\\bmod 11$.', 2], ['Calcular $2^{500}\\bmod 13$.', 2],
    ['Resolver $7x\\equiv 3\\pmod{11}$.', 3], ['Hallar el inverso de $17$ módulo $40$.', 3], ['Resolver $9x\\equiv 6\\pmod{15}$.', 3],
    ['Calcular $(1+i)^{12}$.', 4], ['Resolver $z^4=-16$ en $\\mathbb{C}$.', 4], ['Hallar las raíces cúbicas de $-8i$.', 4],
    ['Demostrar que $n^2+1$ nunca es múltiplo de $3$.', 5], ['Demostrar que ningún cuadrado perfecto termina en $2$.', 5], ['Demostrar que $n^3\\equiv n\\pmod 3$ para todo entero $n$.', 5],
  ];
  gen.eleccion({
    id: 'w2.jefe.estrategia', nivel: 'J2', mundo: 2, habilidades: [], dificultad: 2, confianza: false,
    hacer(rng) {
      const [txt, t] = rng.pick(CLAIMS), otros = rng.sample([0, 1, 2, 3, 4, 5].filter(x => x !== t), 3);
      return { key: txt + '|' + otros.join(''), enun: 'Tienes que resolver: «' + txt + '» ¿Qué herramienta del Mundo 2 es la más adecuada?', ok: MET[t],
        malas: otros.map(m => ['metodo-' + m, MET[m], 'No es la más directa aquí. ' + 'En este problema: ' + RAZON[t]]),
        pistas: ['Orientación: fíjate en lo que se pide: una combinación, dos congruencias, una potencia, un inverso, un complejo o una propiedad de todos los enteros.', 'Idea clave: cada herramienta del mundo responde a un tipo de pregunta.', 'Primer paso: identifica los datos del problema (módulos, exponentes, complejos).'], expl: 'La herramienta más adecuada es: ' + MET[t] + '. ' + RAZON[t] };
    },
  });

  /* ---------- fase de demostración ---------- */
  dem2(Object.assign({
    id: 'dem.jefe-fermat-general', enunciadoId: 'jefe.fermat-general', requiere: ['t.fermat', 't.cong-operaciones'], refsExtra: ['d.primo', 'b.arbitrario'],
    param: rng => ({ a: rng.pick(['a', 'x']), p: rng.pick(['p', 'q']) }),
    enunciado: p => r`Demuestra que si $${p.p}$ es primo, entonces $${p.a}^{${p.p}}\equiv ${p.a}\pmod ${p.p}$ para todo entero $${p.a}$.`,
    hip: p => [r`$${p.p}$ es primo y $${p.a}\in\mathbb{Z}$ es arbitrario`, 'Puedes citar Fermat y las operaciones con congruencias'], meta: p => r`$${p.a}^{${p.p}}\equiv ${p.a}\pmod ${p.p}$`,
    L: p => [
      ['L1', r`Distinguimos dos casos exhaustivos: $${p.p}\mid ${p.a}$ o $${p.p}\nmid ${p.a}$.`, 'b.casos'],
      ['L2', r`Si $${p.p}\mid ${p.a}$: $${p.a}\equiv 0$ y también $${p.a}^{${p.p}}\equiv 0$, luego $${p.a}^{${p.p}}\equiv ${p.a}\pmod ${p.p}$.`, 'd.congruencia', ['L1']],
      ['L3', r`Si $${p.p}\nmid ${p.a}$: por el pequeño teorema de ⟦h1⟧, $${p.a}^{${p.p}-1}\equiv 1\pmod ${p.p}$.`, 't.fermat', ['L1'], [H('h1', 'Fermat', ['Fermat', 'Euler', 'Bézout'], false)]],
      ['L4', r`Multiplicando por $${p.a}$ (las congruencias se pueden multiplicar), $${p.a}^{${p.p}}\equiv ${p.a}\pmod ${p.p}$.`, 't.cong-operaciones', ['L3']],
      ['L5', r`En los dos casos se cumple. ∎`, 'b.casos', ['L2', 'L4']],
    ],
    dist: p => [[r`Comprobamos con $${p.p}=5$ y $${p.a}=2$: $32\equiv 2$; luego siempre.`, 'un ejemplo no prueba el caso general'], [r`Como $${p.a}^{${p.p}-1}\equiv 1$ siempre, se sigue el resultado.`, 'Fermat exige $p\\nmid a$: hay que tratar aparte $p\\mid a$']],
    err: p => [['L2', r`Si $${p.p}\mid ${p.a}$: $${p.a}\equiv 1$ y por tanto $${p.a}^{${p.p}}\equiv 1$.`, 'error-de-calculo', 'Si $p\\mid a$ entonces $a\\equiv 0$, no $1$.'], ['L4', r`Dividiendo por $${p.a}$, $${p.a}^{${p.p}}\equiv ${p.a}$.`, 'error-de-calculo', 'Hay que **multiplicar** por $a$: $a^{p-1}\\cdot a=a^p$.']],
    valida: [['casos', r`Separar $p\mid a$ y $p\nmid a$ y usar Fermat en el segundo`, 'Es la prueba estándar.'], ['induccion', r`Inducción sobre $a$ con el binomio de Newton`, 'Válida (los coeficientes binomiales son múltiplos de $p$), pero no usa los teoremas de este mundo.']],
    idea: p => r`si $${p.p}\nmid ${p.a}$, multiplica $${p.a}^{${p.p}-1}\equiv 1$ por $${p.a}$.`, primero: p => r`separa los casos según $${p.p}\mid ${p.a}$.`,
  }, J));

  dem2(Object.assign({
    id: 'dem.jefe-n5-menos-n', enunciadoId: 'jefe.n5-menos-n', requiere: ['t.fermat', 't.lema-euclides', 't.cong-operaciones'], refsExtra: ['d.primo', 'd.mcd'],
    param: rng => ({ n: rng.pick(['n', 'm']) }),
    enunciado: p => r`Demuestra que $30\mid ${p.n}^5-${p.n}$ para todo entero $${p.n}$.`,
    hip: p => [r`$${p.n}\in\mathbb{Z}$`, 'Puedes citar Fermat, las operaciones con congruencias y el lema de Euclides'], meta: p => r`$30\mid ${p.n}^5-${p.n}$`,
    L: p => [
      ['L1', r`Como $30=2\cdot 3\cdot 5$ con primos distintos, basta probar que $2$, $3$ y $5$ dividen a $${p.n}^5-${p.n}$.`, 'd.primo'],
      ['L2', r`Módulo $5$: si $5\mid ${p.n}$ ambos términos son $\equiv 0$; si no, por Fermat $${p.n}^4\equiv 1$ y, multiplicando por $${p.n}$, $${p.n}^5\equiv ${p.n}$.`, 't.fermat', ['L1']],
      ['L3', r`Módulo $3$: si $3\nmid ${p.n}$, por Fermat $${p.n}^2\equiv 1$, luego $${p.n}^4=(${p.n}^2)^2\equiv 1$ y $${p.n}^5\equiv ${p.n}$; si $3\mid ${p.n}$ es trivial.`, 't.fermat', ['L1']],
      ['L4', r`Módulo $2$: si $${p.n}$ es impar, $${p.n}\equiv 1$ y $${p.n}^5\equiv 1\equiv ${p.n}$; si es par, ambos son $\equiv 0$.`, 't.cong-operaciones', ['L1']],
      ['L5', r`Sea $M=${p.n}^5-${p.n}$ con $2,3,5\mid M$. Como $\operatorname{mcd}(3,2)=1$ y $3\mid 2k$ (con $M=2k$), por el lema de ⟦h1⟧ $3\mid k$; igual con $5$. Luego $30\mid M$. ∎`, 't.lema-euclides', ['L2', 'L3', 'L4'], [H('h1', 'Euclides', ['Euclides', 'Fermat', 'Bézout'], false)]],
    ],
    dist: p => [[r`Comprobamos $${p.n}=1,2,3,4,5$: $0,30,240,1020,3120$ son múltiplos de $30$; luego siempre.`, 'comprobar casos no es una demostración'], [r`Como $2,3,5$ dividen a $${p.n}^5-${p.n}$, también divide su suma $2+3+5=10$.`, 'dividir por cada primo no implica dividir por una suma']],
    err: p => [['L2', r`Módulo $5$: por Fermat $${p.n}^5\equiv 1$.`, 'error-de-calculo', 'Fermat da $n^{4}\\equiv 1$; $n^5\\equiv n$.'], ['L5', r`Como $2,3,5\mid M$, entonces $2+3+5=10\mid M$. ∎`, 'conclusion-invalida', 'Hay que usar que son coprimos dos a dos (lema de Euclides) y concluir con su producto $30$.']],
    valida: [['fermat', r`Probar la divisibilidad por $2$, $3$ y $5$ con Fermat y juntar con el lema de Euclides`, 'Es la prueba estándar.'], ['casos', r`Comprobar los restos módulo $30$ de $n$ (30 casos)`, 'Válida pero larga: 30 casos.']],
    idea: p => r`$30=2\cdot 3\cdot 5$ y Fermat da $${p.n}^5\equiv ${p.n}$ módulo cada primo.`, primero: p => r`factoriza $30$ en primos.`,
  }, J));

  dem2(Object.assign({
    id: 'dem.jefe-z-mas-inverso', enunciadoId: 'jefe.z-mas-inverso', requiere: ['t.complejo-inverso', 't.de-moivre-entero'], refsExtra: ['d.modulo', 'b.trig'],
    param: rng => ({ z: rng.pick(['z', 'w']), n: rng.pick(['n', 'm']), t: rng.pick(['\\theta', '\\alpha']) }),
    enunciado: p => r`Demuestra que si $|${p.z}|=1$, entonces $${p.z}^{${p.n}}+${p.z}^{-${p.n}}=2\cos ${p.n}${p.t}$ para todo entero $${p.n}$, donde $${p.z}=\cos${p.t}+i\sin${p.t}$.`,
    hip: p => [r`$|${p.z}|=1$ y $${p.z}=\cos${p.t}+i\sin${p.t}$`, r`$${p.n}\in\mathbb{Z}$`], meta: p => r`$${p.z}^{${p.n}}+${p.z}^{-${p.n}}=2\cos ${p.n}${p.t}$`,
    L: p => [
      ['L1', r`Como $|${p.z}|=1$, $${p.z}=\cos${p.t}+i\sin${p.t}$ para algún $${p.t}$ (forma polar con módulo $1$).`, 'd.polar'],
      ['L2', r`Por el teorema del inverso de un complejo, $${p.z}^{-1}=\frac{\bar ${p.z}}{|${p.z}|^2}=\cos${p.t}-i\sin${p.t}$.`, 't.complejo-inverso', ['L1']],
      ['L3', r`Por De Moivre con exponente entero, $${p.z}^{${p.n}}=\cos ${p.n}${p.t}+i\sin ${p.n}${p.t}$ y $${p.z}^{-${p.n}}=\cos(-${p.n}${p.t})+i\sin(-${p.n}${p.t})=\cos ${p.n}${p.t}-i\sin ${p.n}${p.t}$.`, 't.de-moivre-entero', ['L2']],
      ['L4', r`Sumando, las partes imaginarias se cancelan: $${p.z}^{${p.n}}+${p.z}^{-${p.n}}=$ ⟦h1⟧. ∎`, 'b.cuerpo-algebra', ['L3'], [H('h1', r`2\cos ${p.n}${p.t}`, [r`2i\sin ${p.n}${p.t}`, r`\cos ${p.n}${p.t}`, r`0`])]],
    ],
    dist: p => [[r`Con $${p.t}=\pi/3$ y $${p.n}=2$: $z^2+z^{-2}=2\cos(2\pi/3)=-1$; luego siempre.`, 'un ejemplo no prueba el caso general'], [r`Como $${p.z}^{-${p.n}}=-${p.z}^{${p.n}}$, la suma es $0$.`, 'el inverso no es el opuesto']],
    err: p => [['L2', r`$${p.z}^{-1}=\cos${p.t}+i\sin${p.t}$ porque $|${p.z}|=1$.`, 'error-de-calculo', 'El inverso es el conjugado (el signo de $i\\sin$ cambia).'], ['L3', r`$${p.z}^{-${p.n}}=\cos ${p.n}${p.t}+i\sin ${p.n}${p.t}$.`, 'error-de-calculo', 'Con exponente $-n$ el ángulo es $-n\\theta$.']],
    valida: [['de-moivre', r`Calcular $z^n$ y $z^{-n}$ con De Moivre y sumar`, 'Es la prueba estándar.'], ['conjugado', r`Notar que $z^{-n}=\overline{z^n}$ y que $w+\bar w=2\operatorname{Re}w$`, 'Válida y más corta si se admite $\\overline{z^n}=\\bar z^n$ (conjugado de un producto).']],
    idea: p => r`si $|${p.z}|=1$, el inverso de $${p.z}$ es su conjugado.`, primero: p => r`escribe $${p.z}^{-1}$ con el teorema del inverso.`,
  }, J));

  if (typeof module !== 'undefined') module.exports = AC;
})(globalThis.AC = globalThis.AC || {});
