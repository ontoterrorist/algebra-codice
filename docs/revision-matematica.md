# Revisión matemática — Fase 2 (Mundo 1 completo: niveles 1.1 a 1.6 y jefe)

Generado por `node tools/auditar.js`. Las pruebas automáticas comprueban la **consistencia** (grafo sin ciclos, orden de referencia válido, solo se citan teoremas previos, los verificadores aceptan la solución de referencia y rechazan las firmas de error). **No certifican que el contenido matemático sea correcto**: eso es lo que te pido revisar aquí.

Convenciones: ℕ incluye el 0; las hipótesis son siempre explícitas; en lógica proposicional se asumen las tablas de verdad de ¬, ∧, ∨ y las propiedades base citadas (conmutatividad, doble negación, transitividad de ≡, prueba condicional, división por casos).

## Dudas
<!-- DUDAS:INICIO -->


**Del nivel 1.1 (siguen abiertas).** El silogismo hipotético está enunciado semánticamente, no como tautología; `b.casos` y `d.conectivos` se aceptan como base; la nota de la estrategia «inducción» en De Morgan es una simplificación; la contrapositiva por cadena presupone `P→Q ≡ ¬P∨Q` como definición; en la distributividad, L4 llama «transitividad de ≡» a la transitividad de la igualdad de valores; la ley de «definición de ↔» se ofrece en la reescritura sin que la lección la explique con detalle.

**Nuevas, fase 2.**

1. **`b.cuerpo-algebra` es un comodín.** Justifica «operar, despejar, sustituir» con números (suma, producto, desarrollo de un binomio, comprobar una base de inducción). Es lo habitual, pero hace que muchas líneas de las pruebas por inducción y de `t.mod-equivalencia` tengan la misma justificación. Si prefieres justificaciones más finas (distributividad, asociatividad…), las separo.
2. **Fracción irreducible (D1, sigue abierta).** `t.raiz2-irracional` sigue apoyándose en `b.fraccion-irreducible` como base, aunque `t.buen-orden` ya está en el Códice cuando se llega a esa demostración. La estrategia «descenso infinito» está registrada como válida pero no se ofrece como prueba paso a paso.
3. **Dominio no vacío en `t.neg-cuantificadores`.** La hipótesis del enunciado dice «dominio no vacío», pero la equivalencia es cierta también con dominio vacío (ambos lados son falsos). La hipótesis es innecesaria; la dejé para evitar el caso degenerado en una primera lectura. Dime si la quito.
4. **Cambios respecto del diseño del árbol (§11.4).** `t.clases-disjuntas` ahora requiere también `t.contrapositiva` (se usa para pasar de «se cortan ⇒ iguales» a «distintas ⇒ disjuntas»). `t.equiv-particion` requiere solo `t.clases-disjuntas` (`t.clase-igual` entra por cierre transitivo) y `t.raiz2-irracional` solo `t.cuadrado-par`. El bloque de `docs/diseno.md` ya está actualizado y el test lo compara.
5. **Estrategias marcadas como válidas.** En `t.suma-gauss` marqué «emparejar extremos (Gauss)» como válida; funciona para $n$ par y exige tratar aparte el término central si $n$ es impar. En varias pruebas por inducción marqué «absurdo con el buen orden» como válida aunque usa un teorema posterior del mismo nivel (`t.buen-orden`): válido como método, pero no sería citable antes de ganarlo. Revisa si te parece correcto.
6. **Jefe, demostración de la suma de cubos.** Usa la inducción fuerte aunque la simple bastaba: es deliberado, para que el jefe exija citar dos teoremas ganados antes. Matemáticamente es correcta (la hipótesis para $n-1$ es un caso particular de «para todo $k<n$»).
7. **Jefe, inversa de una composición.** Toma como base `b.asoc-comp` (asociatividad de la composición) y `d.identidad`; la unicidad de la inversa se prueba dentro de la propia demostración (línea L5) en lugar de citarla.
8. **«Método más natural» (`clasificar-metodo`).** Es una elección subjetiva: tomé solo enunciados donde el método habitual es claro, pero algunos admiten dos (por ejemplo, «si $ab$ es impar entonces $a$ y $b$ son impares»: contrapositiva o directa). Si alguno te parece discutible, lo quito.
9. **Clasificación de relaciones y funciones por muestreo.** `tipo-de-relacion` comprueba cada propiedad sobre un dominio finito de muestra (−6…6 o 1…12) y verifica por código que coincide con el tipo declarado; vale para las relaciones listadas, pero no es una prueba general. Lo mismo para las funciones analíticas de `clasificar-funcion`: la clasificación está escrita a mano por familia.
10. **Antisimétrica en `t.unicidad-maximo` con el mínimo.** La variante dual (mínimo) cita ahora `d.minimo`; antes citaba la definición de máximo.

<!-- DUDAS:FIN -->

## Base y definiciones citables

- `hip` (hipotesis): Hipótesis
- `d.implicacion` (definicion): Definición de →: «P→Q» equivale a «¬P ∨ Q»
- `d.implicacion-valor` (definicion): Tabla de →: si P→Q y P son verdaderas, Q es verdadera
- `d.equivalencia-logica` (definicion): Definición de ≡: mismos valores de verdad en todas las filas
- `d.conectivos` (definicion): Tablas de verdad de ¬, ∧ y ∨
- `d.bicondicional` (definicion): Definición de ↔: «P↔Q» equivale a «(P→Q) ∧ (Q→P)»
- `b.conmutatividad` (propiedad-base): Conmutatividad de ∧ y ∨
- `b.asociatividad` (propiedad-base): Asociatividad de ∧ y ∨
- `b.doble-negacion` (propiedad-base): Doble negación: ¬¬P ≡ P
- `b.idempotencia` (propiedad-base): Idempotencia: P ∧ P ≡ P
- `b.transitividad-equiv` (propiedad-base): Transitividad de ≡
- `b.casos` (propiedad-base): División en casos que cubren todas las posibilidades
- `b.prueba-condicional` (propiedad-base): Para probar «A→B» se supone A y se deduce B
- `d.universal` (definicion): Definición de ∀: «para todo x, P(x)» significa que P(a) es verdadera para cada a del dominio
- `d.existencial` (definicion): Definición de ∃: «existe x con P(x)» significa que P(a) es verdadera para algún a del dominio
- `d.complemento` (definicion): Definición de complemento: x ∈ Aᶜ ⟺ x ∉ A
- `d.union` (definicion): Definición de unión: x ∈ A∪B ⟺ x ∈ A o x ∈ B
- `d.interseccion` (definicion): Definición de intersección: x ∈ A∩B ⟺ x ∈ A y x ∈ B
- `d.diferencia` (definicion): Definición de diferencia: x ∈ A∖B ⟺ x ∈ A y x ∉ B
- `d.inclusion` (definicion): Definición de inclusión: A ⊆ B si todo elemento de A está en B
- `d.igualdad-conj` (definicion): Igualdad de conjuntos: A = B si tienen los mismos elementos (doble inclusión)
- `b.doble-implicacion` (propiedad-base): Para probar P ⟺ Q se prueban P ⇒ Q y Q ⇒ P
- `b.contradiccion` (propiedad-base): Reducción al absurdo: si suponer lo contrario lleva a una contradicción, lo supuesto es falso
- `b.arbitrario` (propiedad-base): Lo probado para un elemento arbitrario vale para todos los elementos
- `d.relacion-equivalencia` (definicion): Relación de equivalencia: reflexiva, simétrica y transitiva
- `d.clase` (definicion): Clase de equivalencia: [a] = { x : x ~ a }
- `d.particion` (definicion): Partición: subconjuntos no vacíos, disjuntos dos a dos, con unión igual al conjunto
- `d.divisibilidad` (definicion): Divisibilidad: n | z si existe k entero con z = nk
- `b.cerradura-enteros` (propiedad-base): Los enteros son cerrados bajo suma, resta y producto
- `d.maximo` (definicion): Máximo: m es máximo si x ≤ m para todo x del conjunto
- `d.orden-parcial` (definicion): Orden parcial: reflexivo, antisimétrico y transitivo
- `d.inyectiva` (definicion): Inyectiva: f(x)=f(y) implica x=y
- `d.sobreyectiva` (definicion): Sobreyectiva: para todo b del codominio existe a con f(a)=b
- `d.biyectiva` (definicion): Biyectiva: inyectiva y sobreyectiva
- `d.composicion` (definicion): Composición: (g∘f)(x)=g(f(x))
- `d.par` (definicion): Par: n = 2k para algún entero k
- `d.impar` (definicion): Impar: n = 2k+1 para algún entero k
- `b.dicotomia-paridad` (propiedad-base): Todo entero es par o impar, y no ambos
- `b.cuerpo-algebra` (propiedad-base): Álgebra de los números: operar, despejar, sustituir
- `b.orden` (propiedad-base): Orden de los números: sumar lo mismo o multiplicar por un positivo conserva la desigualdad
- `b.construccion` (propiedad-base): Para probar «existe» basta exhibir un objeto y comprobar que cumple lo pedido
- `b.fraccion-irreducible` (propiedad-base): Todo racional positivo se escribe a/b con a, b naturales no ambos pares
- `b.peano` (propiedad-base): Principio de inducción: si P(0) (o P(1)) y P(n)⇒P(n+1), entonces P(n) para todo n
- `d.hip-induccion` (hipotesis): Hipótesis de inducción
- `d.minimo` (definicion): Mínimo de S: un elemento m de S con m ≤ s para todo s de S
- `b.asoc-comp` (propiedad-base): La composición de funciones es asociativa: (h∘g)∘f = h∘(g∘f)
- `d.inversa` (definicion): Inversa de f: función g con g∘f = id y f∘g = id
- `b.igualdad` (propiedad-base): Propiedades de la igualdad: sustituir iguales por iguales
- `d.identidad` (definicion): Identidad: id(x) = x, y h∘id = h = id∘h

## Teoremas y demostraciones

### Leyes de De Morgan — `t.demorgan-prop` (nivel 1.1)

**Enunciado.** $\neg(P\wedge Q)\equiv\neg P\vee\neg Q$ y $\neg(P\vee Q)\equiv\neg P\wedge\neg Q$.

**Hipótesis.** $p$ y $q$ son proposiciones cualesquiera

**Depende de.** nada previo (solo definiciones y propiedades base)

**Demostración (grafo de dependencias entre líneas).** Cualquier orden que respete las flechas se acepta.

- **L0** ← ∅ — Dos fórmulas son equivalentes si toman el mismo valor de verdad en cada asignación de valores a $p$ y $q$; las cuatro asignaciones se revisan una por una. _[Definición de ≡: mismos valores de verdad en todas las filas]_
- **L1** ← L0 — Si $p$ es verdadera y $q$ es verdadera: $p\vee q$ es verdadera, luego $\neg(p\vee q)$ es falsa; además $\neg p$ es falsa y $\neg q$ es falsa, luego $\neg p\wedge\neg q$ es falsa. Coinciden. _[Tablas de verdad de ¬, ∧ y ∨]_
- **L2** ← L0 — Si $p$ es verdadera y $q$ es falsa: $p\vee q$ es verdadera, luego $\neg(p\vee q)$ es falsa; además $\neg p$ es falsa y $\neg q$ es verdadera, luego $\neg p\wedge\neg q$ es falsa. Coinciden. _[Tablas de verdad de ¬, ∧ y ∨]_
- **L3** ← L0 — Si $p$ es falsa y $q$ es verdadera: $p\vee q$ es verdadera, luego $\neg(p\vee q)$ es falsa; además $\neg p$ es verdadera y $\neg q$ es falsa, luego $\neg p\wedge\neg q$ es falsa. Coinciden. _[Tablas de verdad de ¬, ∧ y ∨]_
- **L4** ← L0 — Si $p$ es falsa y $q$ es falsa: $p\vee q$ es falsa, luego $\neg(p\vee q)$ es verdadera; además $\neg p$ es verdadera y $\neg q$ es verdadera, luego $\neg p\wedge\neg q$ es verdadera. Coinciden. _[Tablas de verdad de ¬, ∧ y ∨]_
- **L5** ← L1, L2, L3, L4 — Las dos fórmulas toman el mismo valor en las cuatro asignaciones; por tanto son equivalentes. ∎ _[Definición de ≡: mismos valores de verdad en todas las filas]_

**Líneas distractoras (falsas a propósito).**

- Como $\neg(p\vee q)$ es verdadera en la asignación en que $p$ es verdadera y $q$ es falsa, la equivalencia queda probada. — _falla:_ un solo caso no prueba una equivalencia
- Distribuimos la negación: $\neg(p\vee q)=\neg p\vee\neg q$. — _falla:_ la negación cambia el conector; no se «reparte» sin más
- Suponemos que $\neg p\wedge\neg q$ es verdadera y deducimos que $\neg(p\vee q)$ lo es; con eso basta. — _falla:_ solo prueba un sentido

**Errores para «cazar el error».**

- Sustituye **L2**: Si $p$ es verdadera y $q$ es falsa: $p\vee q$ es falsa, luego $\neg(p\vee q)$ es verdadera; además $\neg p$ es falsa y $\neg q$ es verdadera, luego $\neg p\wedge\neg q$ es falsa. Coinciden. — _diagnóstico:_ Error de cálculo: el resultado de la línea no sale de la anterior
- Sustituye **L5**: Como las dos fórmulas coinciden en la primera asignación, son equivalentes. ∎ — _diagnóstico:_ Caso omitido: falta una posibilidad
- Sustituye **L0**: Basta comprobar la asignación en que $p$ y $q$ son verdaderas. — _diagnóstico:_ Caso omitido: falta una posibilidad

**Estrategias.**

- ✓ válida: Comparar las cuatro filas de la tabla de verdad — Es el método directo: dos fórmulas son equivalentes exactamente cuando sus tablas coinciden.
- ✓ válida: Dividir en casos según los valores de las dos letras — Es la misma idea escrita por casos.
- ✓ válida: Suponer que existe una fila donde difieren y llegar a una contradicción — Funciona, pero acaba revisando las mismas cuatro filas.
- ✗ no sirve: Verificar un solo ejemplo concreto — Un ejemplo no basta: la equivalencia exige todas las filas.
- ✗ no sirve: Inducción sobre el número de letras — Aquí solo hay dos letras: no hay estructura recursiva que aprovechar.

### Contrapositiva — `t.contrapositiva` (nivel 1.1)

**Enunciado.** $(P\to Q)\equiv(\neg Q\to\neg P)$.

**Hipótesis.** $P$ y $Q$ son proposiciones cualesquiera

**Depende de.** nada previo (solo definiciones y propiedades base)

**Demostración (grafo de dependencias entre líneas).** Cualquier orden que respete las flechas se acepta.

- **L1** ← ∅ — Por la definición de la implicación, $P\to Q\equiv$ $\neg P\vee Q$. _[Definición de →: «P→Q» equivale a «¬P ∨ Q»]_
- **L2** ← L1 — Por la conmutatividad de $\vee$: $\neg P\vee Q\equiv$ $Q\vee\neg P$. _[Conmutatividad de ∧ y ∨]_
- **L3** ← L2 — Como $Q\equiv\neg\neg Q$: $Q\vee\neg P\equiv\neg\neg Q\vee\neg P$. _[Doble negación: ¬¬P ≡ P]_
- **L4** ← L3 — Aplicando la definición de la implicación a $\neg Q$ y $\neg P$: $\neg\neg Q\vee\neg P\equiv$ $\neg Q\to\neg P$. _[Definición de →: «P→Q» equivale a «¬P ∨ Q»]_
- **L5** ← L1, L2, L3, L4 — Encadenando las equivalencias anteriores: $P\to Q\equiv\neg Q\to\neg P$. ∎ _[Transitividad de ≡]_

**Líneas distractoras (falsas a propósito).**

- Intercambiamos antecedente y consecuente: $P\to Q\equiv Q\to P$. — _falla:_ confunde la contrapositiva con la recíproca
- Como $P\to Q$ es verdadera, también lo es $\neg P\to\neg Q$. — _falla:_ la inversa no equivale a la original

**Errores para «cazar el error».**

- Sustituye **L2**: Por la conmutatividad de $\vee$: $\neg P\vee Q\equiv P\vee\neg Q$. — _diagnóstico:_ Error de cálculo: el resultado de la línea no sale de la anterior
- Sustituye **L4**: Aplicando la definición de la implicación: $\neg\neg Q\vee\neg P\equiv\neg P\to\neg Q$. — _diagnóstico:_ Usa la recíproca o la inversa en lugar de la contrapositiva
- Sustituye **L5**: Como $P\to Q$ y $\neg Q\to\neg P$ son verdaderas en la primera fila, son equivalentes. ∎ — _diagnóstico:_ La conclusión no se sigue de lo anterior (falacia)

**Estrategias.**

- ✓ válida: Encadenar equivalencias a partir de la definición de la implicación — Es la prueba algebraica: ¬P∨Q, conmutar, doble negación y volver a la implicación.
- ✓ válida: Comparar las cuatro filas de la tabla de verdad — Siempre funciona para fórmulas con pocas letras; es más larga que la cadena.
- ✓ válida: Suponer P→Q verdadera y ¬Q→¬P falsa, y llegar a una contradicción — Una implicación falsa exige ¬Q verdadera y ¬P falsa, es decir P verdadera y Q falsa, lo que contradice la primera.
- ✗ no sirve: Probar con un ejemplo en lenguaje natural — Un ejemplo ilustra, pero no demuestra que valga siempre.
- ✗ no sirve: Demostrar la recíproca Q→P — La recíproca es otra proposición: no equivale a la original.

### Negación de una implicación — `t.neg-implicacion` (nivel 1.1)

**Enunciado.** $\neg(P\to Q)\equiv P\wedge\neg Q$.

**Hipótesis.** $P$ y $Q$ son proposiciones cualesquiera; Puedes citar las leyes de De Morgan, ya demostradas

**Depende de.** `t.demorgan-prop`

**Demostración (grafo de dependencias entre líneas).** Cualquier orden que respete las flechas se acepta.

- **L1** ← ∅ — Por la definición de la implicación: $\neg(P\to Q)\equiv\neg(\neg P\vee Q)$. _[Definición de →: «P→Q» equivale a «¬P ∨ Q»]_
- **L2** ← L1 — Por De Morgan: $\neg(\neg P\vee Q)\equiv$ $\neg\neg P\wedge\neg Q$. _[Leyes de De Morgan]_
- **L3** ← L2 — Por la doble negación: $\neg\neg P\wedge\neg Q\equiv P\wedge\neg Q$. _[Doble negación: ¬¬P ≡ P]_
- **L4** ← L1, L2, L3 — Por transitividad de $\equiv$: $\neg(P\to Q)\equiv P\wedge\neg Q$. ∎ _[Transitividad de ≡]_

**Líneas distractoras (falsas a propósito).**

- Negamos ambas partes de la implicación: $\neg(P\to Q)\equiv\neg P\to\neg Q$. — _falla:_ negar una implicación no es negar sus dos partes
- Por De Morgan: $\neg(\neg P\vee Q)\equiv\neg\neg P\vee\neg Q$. — _falla:_ De Morgan cambia el conector

**Errores para «cazar el error».**

- Sustituye **L2**: Por De Morgan: $\neg(\neg P\vee Q)\equiv\neg\neg P\vee\neg Q$. — _diagnóstico:_ De Morgan mal aplicado: no se cambió el conector
- Sustituye **L3**: Por la doble negación: $\neg\neg P\wedge\neg Q\equiv P\wedge Q$. — _diagnóstico:_ Error de cálculo: el resultado de la línea no sale de la anterior
- Sustituye **L1**: Por la definición de la implicación: $\neg(P\to Q)\equiv\neg(P\vee\neg Q)$. — _diagnóstico:_ Error de cálculo: el resultado de la línea no sale de la anterior

**Estrategias.**

- ✓ válida: Encadenar equivalencias: definición de →, De Morgan y doble negación — Es la prueba natural cuando ya se dispone de De Morgan.
- ✓ válida: Comparar las cuatro filas de la tabla de verdad — Siempre válida; no aprovecha los teoremas ya ganados.
- ✗ no sirve: Comprobar con un ejemplo en lenguaje natural — Un ejemplo no prueba una equivalencia general.
- ✗ no sirve: Inducción sobre la longitud de la fórmula — Es innecesaria aquí: hay una cadena finita de pasos.

### Silogismo hipotético — `t.silogismo-hipotetico` (nivel 1.1)

**Enunciado.** Si $P\to Q$ y $Q\to R$ son verdaderas, entonces $P\to R$ es verdadera.

**Hipótesis.** $p\to q$ es verdadera; $q\to r$ es verdadera

**Depende de.** nada previo (solo definiciones y propiedades base)

**Demostración (grafo de dependencias entre líneas).** Cualquier orden que respete las flechas se acepta.

- **L1** ← ∅ — Supongamos que $p\to q$ y $q\to r$ son verdaderas. _[Hipótesis]_
- **L2** ← L1 — Para probar que $p\to r$ es verdadera, suponemos que $p$ es verdadera y debemos deducir $r$. _[Para probar «A→B» se supone A y se deduce B]_
- **L3** ← L1, L2 — Como $p$ es verdadera y $p\to q$ es verdadera, $q$ es verdadera. _[Tabla de →: si P→Q y P son verdaderas, Q es verdadera]_
- **L4** ← L1, L3 — Como $q$ es verdadera y $q\to r$ es verdadera, $r$ es verdadera. _[Tabla de →: si P→Q y P son verdaderas, Q es verdadera]_
- **L5** ← L2, L4 — Hemos deducido $r$ suponiendo $p$; por tanto $p\to r$ es verdadera. ∎ _[Para probar «A→B» se supone A y se deduce B]_

**Líneas distractoras (falsas a propósito).**

- Como $p\to r$ es verdadera, $p$ y $r$ son verdaderas. — _falla:_ una implicación verdadera no asegura que su antecedente lo sea
- Como $q$ es verdadera y $p\to q$ es verdadera, $p$ es verdadera. — _falla:_ afirma el consecuente (falacia)

**Errores para «cazar el error».**

- Sustituye **L3**: Como $p\to q$ es verdadera y $q$ es verdadera, $p$ es verdadera. — _diagnóstico:_ La conclusión no se sigue de lo anterior (falacia)
- Sustituye **L4**: Como $q\to r$ es verdadera y $r$ es verdadera, $q$ es verdadera. — _diagnóstico:_ La conclusión no se sigue de lo anterior (falacia)
- Sustituye **L5**: Por tanto $p$ y $r$ son verdaderas. ∎ — _diagnóstico:_ Paso no justificado: se afirma sin razón

**Estrategias.**

- ✓ válida: Suponer P verdadera y deducir R — Es la forma natural de probar una implicación.
- ✓ válida: Probar la contrapositiva ¬R → ¬P — Si R es falsa, Q es falsa por Q→R, y P es falsa por P→Q.
- ✓ válida: Revisar las ocho filas de la tabla de verdad — Es válida pero larga con tres letras.
- ✗ no sirve: Verificar un ejemplo concreto — Un ejemplo no demuestra una afirmación general.
- ✗ no sirve: Demostrar la recíproca R → P — La recíproca es otra proposición.

### Distributividad — `t.distrib-prop` (nivel 1.1)

**Enunciado.** $P\wedge(Q\vee R)\equiv(P\wedge Q)\vee(P\wedge R)$ (y la dual con $\vee$ y $\wedge$ intercambiados).

**Hipótesis.** $X$, $Y$ y $Z$ son proposiciones cualesquiera

**Depende de.** nada previo (solo definiciones y propiedades base)

**Demostración (grafo de dependencias entre líneas).** Cualquier orden que respete las flechas se acepta.

- **L0** ← ∅ — Distinguimos dos casos según el valor de $X$: falsa o verdadera. _[División en casos que cubren todas las posibilidades]_
- **L1** ← L0 — Si $X$ es falsa: $X\wedge(Y\vee Z)$ es falsa, y $X\wedge Y$ y $X\wedge Z$ son falsa, así que $(X\wedge Y)\vee(X\wedge Z)$ es falsa: las dos coinciden. _[Tablas de verdad de ¬, ∧ y ∨]_
- **L2** ← L0 — Si $X$ es verdadera: $X\wedge(Y\vee Z)$ tiene el mismo valor que $Y\vee Z$. _[Tablas de verdad de ¬, ∧ y ∨]_
- **L3** ← L0 — Si $X$ es verdadera: $X\wedge Y$ tiene el valor de $Y$ y $X\wedge Z$ el de $Z$, así que $(X\wedge Y)\vee(X\wedge Z)$ tiene el valor de $Y\vee Z$. _[Tablas de verdad de ¬, ∧ y ∨]_
- **L4** ← L2, L3 — Si $X$ es verdadera: ambas fórmulas tienen el valor de $Y\vee Z$, luego coinciden. _[Transitividad de ≡]_
- **L5** ← L1, L4 — En los dos casos coinciden; por tanto son equivalentes. ∎ _[División en casos que cubren todas las posibilidades]_

**Líneas distractoras (falsas a propósito).**

- Basta comprobar el caso en que $X$ es verdadera. — _falla:_ omite uno de los casos
- Como $X\wedge(Y\vee Z)$ se escribe igual que $X\wedge Y\vee Z$, no hay nada que probar. — _falla:_ ignora la estructura de los paréntesis

**Errores para «cazar el error».**

- Sustituye **L1**: Si $X$ es falsa: $X\wedge(Y\vee Z)$ es falsa, y $X\wedge Y$ y $X\wedge Z$ son falsa, así que $(X\wedge Y)\vee(X\wedge Z)$ es verdadera: las dos coinciden. — _diagnóstico:_ Error de cálculo: el resultado de la línea no sale de la anterior
- Sustituye **L4**: Si $X$ es verdadera: ambas fórmulas tienen el valor de $Y\wedge Z$, luego coinciden. — _diagnóstico:_ Error de cálculo: el resultado de la línea no sale de la anterior
- Sustituye **L5**: Como coinciden cuando $X$ es verdadera, son equivalentes. ∎ — _diagnóstico:_ Caso omitido: falta una posibilidad

**Estrategias.**

- ✓ válida: Dividir en casos según el valor de P — Reduce ocho filas a dos casos.
- ✓ válida: Revisar las ocho filas de la tabla de verdad — Siempre válida; es la más larga.
- ✗ no sirve: Verificar un ejemplo concreto — Un ejemplo no prueba una equivalencia.
- ✗ no sirve: Inducción sobre el número de letras — No aplica: la fórmula tiene tres letras fijas.

### Negación de cuantificadores — `t.neg-cuantificadores` (nivel 1.2)

**Enunciado.** $\neg\forall x\,P(x)\equiv\exists x\,\neg P(x)$ y $\neg\exists x\,P(x)\equiv\forall x\,\neg P(x)$.

**Hipótesis.** $D$ es un conjunto no vacío (el dominio); $P(z)$ es una condición sobre los elementos de $D$

**Depende de.** nada previo (solo definiciones y propiedades base)

**Demostración (grafo de dependencias entre líneas).** Cualquier orden que respete las flechas se acepta.

- **L1** ← ∅ — Probamos las dos implicaciones; así las dos proposiciones tendrán siempre el mismo valor de verdad. _[Para probar P ⟺ Q se prueban P ⇒ Q y Q ⇒ P]_
- **L2** ← L1 — (⇒) Suponemos que $\neg\forall z\,P(z)$ es verdadera: $P(a)$ no es verdadera para todo $a\in D$. _[Hipótesis]_
- **L3** ← L2 — Si $\neg P(a)$ fuera falsa para todo $a\in D$, entonces $P(a)$ sería verdadera para todo $a$ y $\forall z\,P(z)$ sería verdadera, contra L2. _[Definición de ∀: «para todo x, P(x)» significa que P(a) es verdadera para cada a del dominio]_
- **L4** ← L3 — Luego existe $a\in D$ con $\neg P(a)$ verdadera: $\exists z\,\neg P(z)$ es verdadera. _[Definición de ∃: «existe x con P(x)» significa que P(a) es verdadera para algún a del dominio]_
- **L5** ← L1 — (⇐) Suponemos que $\exists z\,\neg P(z)$ es verdadera: hay un $a\in D$ con $\neg P(a)$ verdadera, es decir, con $P(a)$ falsa. _[Definición de ∃: «existe x con P(x)» significa que P(a) es verdadera para algún a del dominio]_
- **L6** ← L5 — Como $P(a)$ es falsa para ese $a$, $P$ no se cumple en todo $D$: $\forall z\,P(z)$ es falsa, es decir, $\neg\forall z\,P(z)$ es verdadera. _[Definición de ∀: «para todo x, P(x)» significa que P(a) es verdadera para cada a del dominio]_
- **L7** ← L4, L6 — Se cumplen las dos implicaciones; por tanto $\neg\forall z\,P(z)\equiv\exists z\,\neg P(z)$. ∎ _[Para probar P ⟺ Q se prueban P ⇒ Q y Q ⇒ P]_

**Líneas distractoras (falsas a propósito).**

- Basta comprobar un elemento $a\in D$: si $P(a)$ es verdadera, ya sabemos el valor de $\forall z\,P(z)$. — _falla:_ un solo elemento no decide un «para todo»
- Negamos solo la condición: $\neg\forall z\,P(z)\equiv\forall z\,\neg P(z)$. — _falla:_ al negar hay que cambiar también el cuantificador

**Errores para «cazar el error».**

- Sustituye **L4**: Luego $\neg P(a)$ es verdadera para todo $a\in D$: $\forall z\,\neg P(z)$ es verdadera. — _diagnóstico:_ La conclusión no se sigue de lo anterior (falacia)
- Sustituye **L6**: Como $P(a)$ es falsa para ese $a$, P es falsa para todos los elementos de D. ∎ — _diagnóstico:_ La conclusión no se sigue de lo anterior (falacia)
- Sustituye **L2**: (⇒) Suponemos que $\forall z\,P(z)$ es verdadera y llegamos a lo que queremos. — _diagnóstico:_ Argumento circular: usa lo que se quiere probar

**Estrategias.**

- ✓ válida: Probar las dos implicaciones por separado — Es la forma estándar de probar una equivalencia.
- ✓ válida: En cada sentido, suponer lo contrario y llegar a una contradicción — Es el argumento de L3 y L5.
- ✗ no sirve: Comprobarlo en un dominio finito concreto — El enunciado vale para cualquier dominio; un ejemplo finito no lo prueba.
- ✗ no sirve: Inducción sobre el tamaño del dominio — El dominio es arbitrario, no necesariamente numerable.

### Leyes de De Morgan para conjuntos — `t.demorgan-conj` (nivel 1.2)

**Enunciado.** $(A\cup B)^c=A^c\cap B^c$ y $(A\cap B)^c=A^c\cup B^c$.

**Hipótesis.** $E$ y $F$ son subconjuntos del universo $U$; Puedes citar las leyes de De Morgan de la lógica, ya demostradas

**Depende de.** `t.demorgan-prop`

**Demostración (grafo de dependencias entre líneas).** Cualquier orden que respete las flechas se acepta.

- **L1** ← ∅ — Sea $x\in U$ arbitrario. Probaremos $x\in(E\cup F)^c\iff x\in E^c\cap F^c$ con una cadena de equivalencias. _[Igualdad de conjuntos: A = B si tienen los mismos elementos (doble inclusión)]_
- **L2** ← L1 — $x\in(E\cup F)^c\iff x\notin E\cup F$. _[Definición de complemento: x ∈ Aᶜ ⟺ x ∉ A]_
- **L3** ← L2 — $x\notin E\cup F\iff\neg(x\in E\vee x\in F)$. _[Definición de unión: x ∈ A∪B ⟺ x ∈ A o x ∈ B]_
- **L4** ← L3 — $\neg(x\in E\vee x\in F)\iff$ $x\notin E\wedge x\notin F$. _[Leyes de De Morgan]_
- **L5** ← L4 — $x\notin E\wedge x\notin F\iff x\in E^c\wedge x\in F^c$. _[Definición de complemento: x ∈ Aᶜ ⟺ x ∉ A]_
- **L6** ← L5 — $x\in E^c\wedge x\in F^c\iff x\in E^c\cap F^c$. _[Definición de intersección: x ∈ A∩B ⟺ x ∈ A y x ∈ B]_
- **L7** ← L1, L2, L3, L4, L5, L6 — Encadenando, $x\in(E\cup F)^c\iff x\in E^c\cap F^c$ para todo $x\in U$; por tanto $(E\cup F)^c=E^c\cap F^c$. ∎ _[Igualdad de conjuntos: A = B si tienen los mismos elementos (doble inclusión)]_

**Líneas distractoras (falsas a propósito).**

- Como $(E\cup F)^c$ y $E^c\cap F^c$ tienen un elemento en común, son iguales. — _falla:_ un elemento común no prueba una igualdad de conjuntos
- Por De Morgan, $x\notin E\cup F\iff x\notin E\vee x\notin F$. — _falla:_ De Morgan cambia el conector lógico

**Errores para «cazar el error».**

- Sustituye **L4**: $\neg(x\in E\vee x\in F)\iff x\notin E\vee x\notin F$. — _diagnóstico:_ De Morgan mal aplicado: no se cambió el conector
- Sustituye **L6**: $x\in E^c\wedge x\in F^c\iff x\in E^c\cup F^c$. — _diagnóstico:_ Error de cálculo: el resultado de la línea no sale de la anterior
- Sustituye **L7**: Como $x$ pertenece a ambos lados para el elemento $x=1$, los conjuntos son iguales. ∎ — _diagnóstico:_ La conclusión no se sigue de lo anterior (falacia)

**Estrategias.**

- ✓ válida: Cadena de equivalencias sobre la pertenencia de un elemento arbitrario — Es la prueba natural y usa De Morgan de la lógica.
- ✓ válida: Doble inclusión: probar cada contención por separado — Equivale a la cadena, probando ⊆ y ⊇.
- ✗ no sirve: Dibujar un diagrama de Venn — Ilustra, pero no es una demostración.
- ✗ no sirve: Verificar un ejemplo concreto — Un ejemplo ilustra, pero no demuestra que valga siempre.

### Distributividad de conjuntos — `t.distrib-conj` (nivel 1.2)

**Enunciado.** $A\cap(B\cup C)=(A\cap B)\cup(A\cap C)$ y $A\cup(B\cap C)=(A\cup B)\cap(A\cup C)$.

**Hipótesis.** $A$, $B$ y $C$ son conjuntos cualesquiera; Puedes citar la distributividad de la lógica, ya demostrada

**Depende de.** `t.distrib-prop`

**Demostración (grafo de dependencias entre líneas).** Cualquier orden que respete las flechas se acepta.

- **L1** ← ∅ — Sea $x$ arbitrario. Probaremos $x\in A\cup(B\cap C)\iff x\in(A\cup B)\cap(A\cup C)$. _[Igualdad de conjuntos: A = B si tienen los mismos elementos (doble inclusión)]_
- **L2** ← L1 — $x\in A\cup(B\cap C)\iff x\in A\vee x\in B\cap C$. _[Definición de unión: x ∈ A∪B ⟺ x ∈ A o x ∈ B]_
- **L3** ← L2 — $x\in A\vee x\in B\cap C\iff x\in A\vee(x\in B\wedge x\in C)$. _[Definición de intersección: x ∈ A∩B ⟺ x ∈ A y x ∈ B]_
- **L4** ← L3 — $x\in A\vee(x\in B\wedge x\in C)\iff$ $(x\in A\vee x\in B)\wedge(x\in A\vee x\in C)$. _[Distributividad]_
- **L5** ← L4 — $(x\in A\vee x\in B)\wedge(x\in A\vee x\in C)\iff x\in A\cup B\wedge x\in A\cup C$. _[Definición de unión: x ∈ A∪B ⟺ x ∈ A o x ∈ B]_
- **L6** ← L5 — $x\in A\cup B\wedge x\in A\cup C\iff x\in(A\cup B)\cap(A\cup C)$. _[Definición de intersección: x ∈ A∩B ⟺ x ∈ A y x ∈ B]_
- **L7** ← L1, L2, L3, L4, L5, L6 — Como la cadena vale para todo $x$, $A\cup(B\cap C)=(A\cup B)\cap(A\cup C)$. ∎ _[Igualdad de conjuntos: A = B si tienen los mismos elementos (doble inclusión)]_

**Líneas distractoras (falsas a propósito).**

- Basta comprobarlo con $A=B=C$: entonces los dos lados coinciden. — _falla:_ un caso particular no prueba la igualdad general
- Distribuimos: $x\in A\vee(x\in B\wedge x\in C)\iff(x\in A\wedge x\in B)\vee(x\in A\wedge x\in C)$. — _falla:_ esa es la distributividad de la operación contraria

**Errores para «cazar el error».**

- Sustituye **L4**: $x\in A\vee(x\in B\wedge x\in C)\iff(x\in A\wedge x\in B)\vee(x\in A\wedge x\in C)$. — _diagnóstico:_ Error de cálculo: el resultado de la línea no sale de la anterior
- Sustituye **L2**: $x\in A\cup(B\cap C)\iff x\in A\wedge x\in B\cap C$. — _diagnóstico:_ Error de cálculo: el resultado de la línea no sale de la anterior
- Sustituye **L7**: Como la cadena vale para $x\in A$, los conjuntos son iguales. ∎ — _diagnóstico:_ Caso omitido: falta una posibilidad

**Estrategias.**

- ✓ válida: Cadena de equivalencias sobre la pertenencia de un elemento arbitrario — Reduce la igualdad de conjuntos a la distributividad de la lógica.
- ✓ válida: Doble inclusión — Funciona, con más casos.
- ✗ no sirve: Dibujar un diagrama de Venn — Ilustra, no demuestra.
- ✗ no sirve: Verificar un ejemplo concreto — Un ejemplo ilustra, pero no demuestra que valga siempre.

### Inclusión e intersección — `t.inclusion-interseccion` (nivel 1.2)

**Enunciado.** $A\subseteq B\iff A\cap B=A$.

**Hipótesis.** $E$ y $F$ son conjuntos cualesquiera

**Depende de.** nada previo (solo definiciones y propiedades base)

**Demostración (grafo de dependencias entre líneas).** Cualquier orden que respete las flechas se acepta.

- **L1** ← ∅ — Probamos las dos implicaciones. _[Para probar P ⟺ Q se prueban P ⇒ Q y Q ⇒ P]_
- **L2** ← L1 — (⇒) Suponemos que $E\subseteq F$. _[Hipótesis]_
- **L3** ← L1 — Si $x\in E\cap F$, entonces $x\in E$; luego $E\cap F\subseteq E$. _[Definición de intersección: x ∈ A∩B ⟺ x ∈ A y x ∈ B]_
- **L4** ← L2 — Si $x\in E$, por la hipótesis $x\in F$, así que $x\in E\cap F$; luego $E\subseteq E\cap F$. _[Definición de inclusión: A ⊆ B si todo elemento de A está en B]_
- **L5** ← L3, L4 — Por la doble inclusión, $E\cap F=E$. _[Igualdad de conjuntos: A = B si tienen los mismos elementos (doble inclusión)]_
- **L6** ← L1 — (⇐) Suponemos que $E\cap F=E$ y tomamos $x\in E$. _[Hipótesis]_
- **L7** ← L6 — Como $E=E\cap F$, $x\in E\cap F$ y, por tanto, $x$ pertenece a $F$. _[Definición de intersección: x ∈ A∩B ⟺ x ∈ A y x ∈ B]_
- **L8** ← L5, L7 — Como $x\in E$ era arbitrario, $E\subseteq F$. ∎ _[Definición de inclusión: A ⊆ B si todo elemento de A está en B]_

**Líneas distractoras (falsas a propósito).**

- Suponemos $E\cap F=E$ y concluimos $F\subseteq E$. — _falla:_ confunde la dirección de la inclusión
- Si $E\subseteq F$, entonces $E\cup F=E$. — _falla:_ la unión sería $B$, no $A$

**Errores para «cazar el error».**

- Sustituye **L4**: Si $x\in F$, por la hipótesis $x\in E$, así que $x\in E\cap F$. — _diagnóstico:_ La conclusión no se sigue de lo anterior (falacia)
- Sustituye **L7**: Como $x\in E$, entonces $x\in E\cup F$ y por tanto $x\in F$. — _diagnóstico:_ La conclusión no se sigue de lo anterior (falacia)
- Sustituye **L8**: Como $x=1$ cumple $x\in E\Rightarrow x\in F$, entonces $E\subseteq F$. ∎ — _diagnóstico:_ Caso omitido: falta una posibilidad

**Estrategias.**

- ✓ válida: Probar las dos implicaciones, cada una con un elemento arbitrario — Es el método estándar.
- ✓ válida: En (⇒), probar la igualdad por doble inclusión — Es parte de la prueba de (⇒).
- ✗ no sirve: Mirar un diagrama de Venn — Ilustra, no demuestra.
- ✗ no sirve: Verificar un ejemplo concreto — Un ejemplo ilustra, pero no demuestra que valga siempre.

### Elementos relacionados, clases iguales — `t.clase-igual` (nivel 1.3)

**Enunciado.** Si $\sim$ es de equivalencia y $a\sim b$, entonces $[a]=[b]$.

**Hipótesis.** $\sim$ es reflexiva, simétrica y transitiva en $X$; $a,b\in X$ con $a\sim b$; $[a]=\{c\in X: c\sim a\}$

**Depende de.** nada previo (solo definiciones y propiedades base)

**Demostración (grafo de dependencias entre líneas).** Cualquier orden que respete las flechas se acepta.

- **L1** ← ∅ — Suponemos que $a\sim b$. _[Hipótesis]_
- **L2** ← L1 — ($[a]\subseteq[b]$) Sea $c\in[a]$: $c\sim a$. Como $c\sim a$ y $a\sim b$, por transitividad $c\sim$ $b$, es decir, $c\in[b]$. _[Relación de equivalencia: reflexiva, simétrica y transitiva]_
- **L3** ← L1 — ($[b]\subseteq[a]$) Por simetría, de $a\sim b$ sale $b\sim a$. Si $c\in[b]$, entonces $c\sim b$ y $b\sim a$; por transitividad $c\sim a$, es decir, $c\in[a]$. _[Relación de equivalencia: reflexiva, simétrica y transitiva]_
- **L4** ← L2, L3 — Por doble inclusión, $[a]=[b]$. ∎ _[Igualdad de conjuntos: A = B si tienen los mismos elementos (doble inclusión)]_

**Líneas distractoras (falsas a propósito).**

- Como $a\in[a]$ y $a\in[b]$, las dos clases comparten un elemento y por tanto son iguales. — _falla:_ compartir un elemento exige antes el teorema que se quiere probar
- Suponemos $[a]=[b]$ y deducimos $a\sim b$. — _falla:_ prueba el recíproco, no lo pedido

**Errores para «cazar el error».**

- Sustituye **L2**: ($[a]\subseteq[b]$) Sea $c\in[a]$: $c\sim a$. Por simetría, $c\sim b$, es decir, $c\in[b]$. — _diagnóstico:_ Paso no justificado: se afirma sin razón
- Sustituye **L3**: ($[b]\subseteq[a]$) Si $c\in[b]$, entonces $c\sim b$ y $a\sim b$; por transitividad $c\sim a$. — _diagnóstico:_ Paso no justificado: se afirma sin razón
- Sustituye **L4**: Como $[a]\subseteq[b]$, las clases son iguales. ∎ — _diagnóstico:_ Caso omitido: falta una posibilidad

**Estrategias.**

- ✓ válida: Doble inclusión entre las dos clases — Es la prueba estándar de L2–L4.
- ✓ válida: Cadena de equivalencias: $x\in[a]\iff x\sim a\iff x\sim b\iff x\in[b]$ — Vale porque $a\sim b$ permite sustituir $a$ por $b$ en las dos direcciones.
- ✗ no sirve: Usar que las clases forman una partición — Circular: ese teorema se demuestra a partir de este.
- ✗ no sirve: Verificar un ejemplo concreto — Un ejemplo ilustra, pero no demuestra que valga siempre.

### Las clases distintas son disjuntas — `t.clases-disjuntas` (nivel 1.3)

**Enunciado.** Si $[a]\cap[b]\neq\varnothing$ entonces $[a]=[b]$; es decir, dos clases distintas son disjuntas.

**Hipótesis.** $\sim$ es una relación de equivalencia en $X$; $a,b\in X$; Puedes citar el teorema anterior (clases de elementos relacionados)

**Depende de.** `t.clase-igual`, `t.contrapositiva`

**Demostración (grafo de dependencias entre líneas).** Cualquier orden que respete las flechas se acepta.

- **L1** ← ∅ — Suponemos que $[a]\cap[b]\neq\varnothing$: existe $c\in[a]\cap[b]$. _[Hipótesis]_
- **L2** ← L1 — Como $c\in[a]$, $c\sim a$; como $c\in[b]$, $c\sim b$. _[Clase de equivalencia: [a] = { x : x ~ a }]_
- **L3** ← L2 — Por la simetría, $a\sim c$; por la transitividad con $c\sim b$ obtenemos $a\sim$ $b$. _[Relación de equivalencia: reflexiva, simétrica y transitiva]_
- **L4** ← L3 — Como $a\sim b$, el teorema anterior da $[a]=[b]$. _[Elementos relacionados, clases iguales]_
- **L5** ← L4 — Hemos probado la implicación; por su contrapositiva, si $[a]\neq[b]$ entonces $[a]\cap[b]=\varnothing$. ∎ _[Contrapositiva]_

**Líneas distractoras (falsas a propósito).**

- Como $a\in[a]$ y $b\in[b]$, ambas clases son no vacías y por tanto se cortan. — _falla:_ ser no vacías no implica que se corten
- Como $[a]=[b]$, entonces $[a]\cap[b]\neq\varnothing$; esto prueba la implicación. — _falla:_ prueba el recíproco

**Errores para «cazar el error».**

- Sustituye **L3**: Por la reflexividad, $a\sim c$; por la transitividad con $c\sim b$ obtenemos $a\sim b$. — _diagnóstico:_ Paso no justificado: se afirma sin razón
- Sustituye **L4**: Como $c\sim a$, el teorema anterior da $[a]=[b]$. — _diagnóstico:_ La conclusión no se sigue de lo anterior (falacia)
- Sustituye **L5**: Por tanto, si $[a]\cap[b]=\varnothing$ entonces $[a]\neq[b]$. ∎ — _diagnóstico:_ La conclusión no se sigue de lo anterior (falacia)

**Estrategias.**

- ✓ válida: Tomar un elemento común y usar el teorema de elementos relacionados — Es la prueba estándar.
- ✓ válida: Suponer que las clases son distintas y no disjuntas, y llegar a una contradicción — Equivale a la contrapositiva.
- ✗ no sirve: Usar que las clases forman una partición — Circular: ese teorema se apoya en este.
- ✗ no sirve: Verificar un ejemplo concreto — Un ejemplo ilustra, pero no demuestra que valga siempre.

### Una equivalencia define una partición — `t.equiv-particion` (nivel 1.3)

**Enunciado.** Las clases de una relación de equivalencia en $X$ son no vacías, cubren $X$ y son disjuntas dos a dos: forman una partición de $X$.

**Hipótesis.** $\sim$ es reflexiva, simétrica y transitiva en $X$; Puedes citar el teorema de las clases disjuntas

**Depende de.** `t.clases-disjuntas`

**Demostración (grafo de dependencias entre líneas).** Cualquier orden que respete las flechas se acepta.

- **L1** ← ∅ — Debemos probar tres cosas: (i) cada clase es no vacía; (ii) la unión de las clases es $X$; (iii) dos clases distintas son disjuntas. _[Partición: subconjuntos no vacíos, disjuntos dos a dos, con unión igual al conjunto]_
- **L2** ← L1 — (i) Para $a\in X$, la reflexividad da $a\sim a$; luego $a\in[a]$ y $[a]\neq\varnothing$. _[Relación de equivalencia: reflexiva, simétrica y transitiva]_
- **L3** ← L2 — (ii) Cada clase es un subconjunto de $X$, así que su unión está contenida en $X$. Recíprocamente, todo $a\in X$ está en $[a]$ (por L2), así que $X\subseteq\bigcup_{a\in X}[a]$. Las dos contenciones dan la igualdad. _[Igualdad de conjuntos: A = B si tienen los mismos elementos (doble inclusión)]_
- **L4** ← L1 — (iii) Sean $[a]\neq[b]$. Por el teorema de las clases disjuntas, si tuvieran un elemento común serían iguales; luego no lo tienen. _[Las clases distintas son disjuntas]_
- **L5** ← L4 — Por tanto $[a]\cap[b]=\varnothing$ siempre que $[a]\neq[b]$. _[Definición de intersección: x ∈ A∩B ⟺ x ∈ A y x ∈ B]_
- **L6** ← L2, L3, L5 — Las clases son no vacías, cubren $X$ y son disjuntas dos a dos: forman una partición de $X$. ∎ _[Partición: subconjuntos no vacíos, disjuntos dos a dos, con unión igual al conjunto]_

**Líneas distractoras (falsas a propósito).**

- Como $X$ es finito, la unión de las clases es $X$. — _falla:_ no hace falta ni se usa que $X$ sea finito
- Como $[a]\neq[b]$, deben tener elementos distintos y, por tanto, ser disjuntas. — _falla:_ tener elementos distintos no implica ser disjuntas

**Errores para «cazar el error».**

- Sustituye **L2**: (i) Para $a\in X$, la simetría da $a\sim a$; luego $a\in[a]$. — _diagnóstico:_ Paso no justificado: se afirma sin razón
- Sustituye **L3**: (ii) Cada $a\in X$ está en $[a]$, así que la unión es $X$. (No hace falta más.) — _diagnóstico:_ Caso omitido: falta una posibilidad
- Sustituye **L5**: Por tanto $[a]\cap[b]=X$ siempre que $[a]\neq[b]$. — _diagnóstico:_ Error de cálculo: el resultado de la línea no sale de la anterior

**Estrategias.**

- ✓ válida: Probar por separado las tres condiciones de una partición — Es la definición de partición.
- ✗ no sirve: Construir a mano una partición concreta de un conjunto pequeño — Un ejemplo no prueba el caso general.
- ✗ no sirve: Suponer que las clases ya forman una partición — Es lo que se quiere probar.
- ✗ no sirve: Verificar un ejemplo concreto — Un ejemplo ilustra, pero no demuestra que valga siempre.

### La congruencia es de equivalencia — `t.mod-equivalencia` (nivel 1.3)

**Enunciado.** Para $n\ge 1$, la relación $a\sim b\iff n\mid a-b$ es de equivalencia en $\mathbb{Z}$.

**Hipótesis.** $n\ge 1$ es un entero fijo; $n\mid z$ significa que existe $j\in\mathbb{Z}$ con $z=nj$

**Depende de.** nada previo (solo definiciones y propiedades base)

**Demostración (grafo de dependencias entre líneas).** Cualquier orden que respete las flechas se acepta.

- **L1** ← ∅ — Por definición, $x\sim y$ significa que existe $j\in\mathbb{Z}$ con $x-y=nj$. _[Divisibilidad: n | z si existe k entero con z = nk]_
- **L2** ← L1 — Reflexiva: $x-x=0=n\cdot 0$ con $0\in\mathbb{Z}$; luego $x\sim x$. _[Divisibilidad: n | z si existe k entero con z = nk]_
- **L3** ← L1 — Simétrica: si $x-y=nj$, entonces $y-x=n\cdot$ $(-j)$, con $-j\in\mathbb{Z}$; luego $y\sim x$. _[Divisibilidad: n | z si existe k entero con z = nk]_
- **L4** ← L1 — Transitiva: si $x-y=nj$ y $y-z=nt$, entonces $x-z=(x-y)+(y-z)=n\cdot$ $j+t$, con $j+t\in\mathbb{Z}$; luego $x\sim z$. _[Los enteros son cerrados bajo suma, resta y producto]_
- **L5** ← L2, L3, L4 — Es reflexiva, simétrica y transitiva: $\sim$ es una relación de equivalencia. ∎ _[Relación de equivalencia: reflexiva, simétrica y transitiva]_

**Líneas distractoras (falsas a propósito).**

- Antisimétrica: si $x\sim y$ y $y\sim x$ entonces $x=y$. — _falla:_ es falso (p. ej. $0\sim n$ y $n\sim 0$) y no se pide
- Como $n=4$ cumple $6\sim 2$, la relación es de equivalencia. — _falla:_ un ejemplo no prueba una propiedad general

**Errores para «cazar el error».**

- Sustituye **L2**: Reflexiva: $x-x=n\cdot x$; luego $x\sim x$. — _diagnóstico:_ Error de cálculo: el resultado de la línea no sale de la anterior
- Sustituye **L3**: Simétrica: si $x-y=nj$, entonces $y-x=nj$; luego $y\sim x$. — _diagnóstico:_ Error de cálculo: el resultado de la línea no sale de la anterior
- Sustituye **L4**: Transitiva: entonces $x-z=njt$ con $jt\in\mathbb{Z}$; luego $x\sim z$. — _diagnóstico:_ Error de cálculo: el resultado de la línea no sale de la anterior

**Estrategias.**

- ✓ válida: Probar reflexividad, simetría y transitividad con la definición de divisibilidad — Es el método directo.
- ✓ válida: Probar que $a\sim b$ equivale a que $a$ y $b$ tienen el mismo resto al dividir por $n$, y deducir las tres propiedades — Funciona, usando la división con resto.
- ✗ no sirve: Exhibir las clases de equivalencia — Circular: las clases solo tienen sentido si ya es de equivalencia.
- ✗ no sirve: Verificar un ejemplo concreto — Un ejemplo ilustra, pero no demuestra que valga siempre.

### Unicidad del máximo — `t.unicidad-maximo` (nivel 1.3)

**Enunciado.** En un conjunto parcialmente ordenado, si existe un máximo, es único.

**Hipótesis.** $\le$ es reflexiva, antisimétrica y transitiva en $X$; $m$ es mínimo: $m\le x$ para todo $x\in X$

**Depende de.** nada previo (solo definiciones y propiedades base)

**Demostración (grafo de dependencias entre líneas).** Cualquier orden que respete las flechas se acepta.

- **L1** ← ∅ — Sean $m$ y $m'$ dos mínimos de $X$. _[Mínimo de S: un elemento m de S con m ≤ s para todo s de S]_
- **L2** ← L1 — Como $m$ es mínimo y $m'\in X$, se cumple $m\le m'$. _[Mínimo de S: un elemento m de S con m ≤ s para todo s de S]_
- **L3** ← L1 — Como $m'$ es mínimo y $m\in X$, se cumple $m'\le m$. _[Mínimo de S: un elemento m de S con m ≤ s para todo s de S]_
- **L4** ← L2, L3 — Por la antisimetría, de $m\le m'$ y $m'\le m$ se sigue $m=m'$. ∎ _[Orden parcial: reflexivo, antisimétrico y transitivo]_

**Líneas distractoras (falsas a propósito).**

- Como ambos son minimales, son iguales. — _falla:_ un orden parcial puede tener varios elementos maximales (o minimales)
- Como $m\le m'$, entonces $m<m'$ y no pueden ser iguales. — _falla:_ asume lo contrario de lo que se quiere probar

**Errores para «cazar el error».**

- Sustituye **L2**: Como $m$ es mínimo, se cumple $m'\le m$. — _diagnóstico:_ La conclusión no se sigue de lo anterior (falacia)
- Sustituye **L4**: Por la reflexividad, de $m\le m'$ y $m'\le m$ se sigue $m=m'$. ∎ — _diagnóstico:_ Paso no justificado: se afirma sin razón
- Sustituye **L3**: Como $m'$ es mínimo y $m\in X$, se cumple $m=m'$. — _diagnóstico:_ Argumento circular: usa lo que se quiere probar

**Estrategias.**

- ✓ válida: Comparar los dos en ambos sentidos y usar la antisimetría — Es la prueba estándar.
- ✓ válida: Suponer $m\neq m'$ y llegar a una contradicción con la antisimetría — Es la misma idea por reducción al absurdo.
- ✗ no sirve: Decir que máximo y maximal son lo mismo — Un maximal no tiene por qué ser máximo ni único.
- ✗ no sirve: Verificar un ejemplo concreto — Un ejemplo ilustra, pero no demuestra que valga siempre.

### Composición de inyectivas — `t.comp-inyectiva` (nivel 1.4)

**Enunciado.** Si $f:A\to B$ y $g:B\to C$ son inyectivas, $g\circ f$ es inyectiva.

**Hipótesis.** $u$ es inyectiva; $v$ es inyectiva

**Depende de.** nada previo (solo definiciones y propiedades base)

**Demostración (grafo de dependencias entre líneas).** Cualquier orden que respete las flechas se acepta.

- **L1** ← ∅ — Sean $a,y\in A$ con $(v\circ u)(a)=(v\circ u)(y)$; debemos probar que $a=y$. _[Inyectiva: f(x)=f(y) implica x=y]_
- **L2** ← L1 — Por la definición de composición, $v(u(a))=v(u(y))$. _[Composición: (g∘f)(x)=g(f(x))]_
- **L3** ← L2 — Como $v$ es inyectiva, $u(a)=u(y)$. _[Hipótesis]_
- **L4** ← L3 — Como $u$ es inyectiva, $a=y$. _[Hipótesis]_
- **L5** ← L4 — Luego $v\circ u$ es inyectiva. ∎ _[Inyectiva: f(x)=f(y) implica x=y]_

**Líneas distractoras (falsas a propósito).**

- Como $u(a)=u(y)$, entonces $v(u(a))=v(u(y))$; luego $v\circ u$ es inyectiva. — _falla:_ parte de la conclusión de la inyectividad de $f$ en vez de probarla
- Como $u$ es sobreyectiva, $v\circ u$ es inyectiva. — _falla:_ la sobreyectividad no es la hipótesis ni da la inyectividad

**Errores para «cazar el error».**

- Sustituye **L2**: Por la definición de composición, $u(v(a))=u(v(y))$. — _diagnóstico:_ Error de cálculo: el resultado de la línea no sale de la anterior
- Sustituye **L3**: Como $u$ es inyectiva, $u(a)=u(y)$. — _diagnóstico:_ Paso no justificado: se afirma sin razón
- Sustituye **L4**: Como $v$ es inyectiva, $a=y$. — _diagnóstico:_ Paso no justificado: se afirma sin razón

**Estrategias.**

- ✓ válida: Tomar dos elementos con la misma imagen y retroceder paso a paso — Es la prueba estándar.
- ✓ válida: Probar que $x\neq y$ implica $g(f(x))\neq g(f(y))$ — Es la contrapositiva y funciona igual.
- ✗ no sirve: Probar que la composición es sobreyectiva — Es otra propiedad.
- ✗ no sirve: Verificar un ejemplo concreto — Un ejemplo ilustra, pero no demuestra que valga siempre.

### Composición de sobreyectivas — `t.comp-sobreyectiva` (nivel 1.4)

**Enunciado.** Si $f:A\to B$ y $g:B\to C$ son sobreyectivas, $g\circ f$ es sobreyectiva.

**Hipótesis.** $u$ es sobreyectiva; $v$ es sobreyectiva

**Depende de.** nada previo (solo definiciones y propiedades base)

**Demostración (grafo de dependencias entre líneas).** Cualquier orden que respete las flechas se acepta.

- **L1** ← ∅ — Sea $c\in C$ arbitrario. Debemos hallar $x\in A$ con $(v\circ u)(x)=c$. _[Sobreyectiva: para todo b del codominio existe a con f(a)=b]_
- **L2** ← L1 — Como $v$ es sobreyectiva, existe $b\in B$ con $v(b)=c$. _[Hipótesis]_
- **L3** ← L2 — Como $u$ es sobreyectiva, existe $x\in A$ con $u(x)=b$. _[Hipótesis]_
- **L4** ← L2, L3 — Entonces $(v\circ u)(x)=v(u(x))=v(b)=c$. _[Composición: (g∘f)(x)=g(f(x))]_
- **L5** ← L4 — Como $c$ era arbitrario, $v\circ u$ es sobreyectiva. ∎ _[Sobreyectiva: para todo b del codominio existe a con f(a)=b]_

**Líneas distractoras (falsas a propósito).**

- Tomamos $x\in A$ arbitrario y calculamos $v(u(x))$; como está definido, la composición es sobreyectiva. — _falla:_ parte del dominio: eso no prueba que cada elemento de $C$ se alcance
- Como $v$ es sobreyectiva, para cada $b\in B$ existe un único $c\in C$ con $v(b)=c$. — _falla:_ confunde sobreyectiva con función bien definida

**Errores para «cazar el error».**

- Sustituye **L2**: Como $u$ es sobreyectiva, existe $b\in B$ con $v(b)=c$. — _diagnóstico:_ Paso no justificado: se afirma sin razón
- Sustituye **L4**: Entonces $(v\circ u)(x)=u(v(x))=c$. — _diagnóstico:_ Error de cálculo: el resultado de la línea no sale de la anterior
- Sustituye **L5**: Como $c=v(b)$ para este $c$, $v\circ u$ es sobreyectiva. ∎ — _diagnóstico:_ Caso omitido: falta una posibilidad

**Estrategias.**

- ✓ válida: Tomar un elemento arbitrario de $C$ y retroceder dos veces — Es la prueba estándar.
- ✓ válida: Suponer que algún $c\in C$ no es alcanzado y llegar a una contradicción — Funciona, con el mismo retroceso.
- ✗ no sirve: Probar que $g\circ f$ es inyectiva — Es otra propiedad.
- ✗ no sirve: Verificar un ejemplo concreto — Un ejemplo ilustra, pero no demuestra que valga siempre.

### Composición de biyectivas — `t.comp-biyectiva` (nivel 1.4)

**Enunciado.** Si $f$ y $g$ son biyectivas, $g\circ f$ es biyectiva.

**Hipótesis.** $\varphi$ y $\psi$ son biyectivas; Puedes citar los teoremas de composición de inyectivas y de sobreyectivas

**Depende de.** `t.comp-inyectiva`, `t.comp-sobreyectiva`

**Demostración (grafo de dependencias entre líneas).** Cualquier orden que respete las flechas se acepta.

- **L1** ← ∅ — Como $\varphi$ y $\psi$ son biyectivas, ambas son inyectivas y ambas son sobreyectivas. _[Biyectiva: inyectiva y sobreyectiva]_
- **L2** ← L1 — Como $\varphi$ y $\psi$ son inyectivas, por el teorema de la composición de inyectivas, $\psi\circ \varphi$ es inyectiva. _[Composición de inyectivas]_
- **L3** ← L1 — Como $\varphi$ y $\psi$ son sobreyectivas, por el teorema correspondiente, $\psi\circ \varphi$ es sobreyectiva. _[Composición de sobreyectivas]_
- **L4** ← L2, L3 — Por ser inyectiva y sobreyectiva, $\psi\circ \varphi$ es biyectiva. ∎ _[Biyectiva: inyectiva y sobreyectiva]_

**Líneas distractoras (falsas a propósito).**

- Como $\psi\circ \varphi$ es biyectiva, $\varphi$ y $\psi$ también lo son. — _falla:_ es el recíproco y es falso en general
- Como $\psi$ es sobreyectiva, $\psi\circ \varphi$ es inyectiva. — _falla:_ la sobreyectividad de $g$ no da inyectividad

**Errores para «cazar el error».**

- Sustituye **L2**: Como $\varphi$ y $\psi$ son inyectivas, por el teorema de la composición de sobreyectivas, $\psi\circ \varphi$ es inyectiva. — _diagnóstico:_ Paso no justificado: se afirma sin razón
- Sustituye **L3**: Como $\varphi$ y $\psi$ son inyectivas, $\psi\circ \varphi$ es sobreyectiva. — _diagnóstico:_ La conclusión no se sigue de lo anterior (falacia)
- Sustituye **L4**: Por ser inyectiva, $\psi\circ \varphi$ es biyectiva. ∎ — _diagnóstico:_ Caso omitido: falta una posibilidad

**Estrategias.**

- ✓ válida: Combinar los teoremas de composición de inyectivas y de sobreyectivas — Aprovecha lo ya ganado y es la más corta.
- ✓ válida: Repetir desde cero la prueba de inyectividad y de sobreyectividad — Válida, pero larga.
- ✓ válida: Construir la inversa $f^{-1}\circ g^{-1}$ y verificarla — También funciona con el teorema de la inversa, si lo tienes en el Códice.
- ✗ no sirve: Verificar un ejemplo concreto — Un ejemplo ilustra, pero no demuestra que valga siempre.

### Biyectiva si y solo si tiene inversa — `t.biyectiva-inversa` (nivel 1.4)

**Enunciado.** $f:A\to B$ es biyectiva si y solo si existe $g:B\to A$ con $g\circ f=\mathrm{id}_A$ y $f\circ g=\mathrm{id}_B$.

**Hipótesis.** $f$ es una función de $A$ en $B$

**Depende de.** nada previo (solo definiciones y propiedades base)

**Demostración (grafo de dependencias entre líneas).** Cualquier orden que respete las flechas se acepta.

- **L1** ← ∅ — Probamos las dos implicaciones. _[Para probar P ⟺ Q se prueban P ⇒ Q y Q ⇒ P]_
- **L2** ← L1 — (⇒) Sea $f$ biyectiva y $y\in B$. Por sobreyectividad existe $a\in A$ con $f(a)=y$ y, por inyectividad, es único. Definimos $g(y)=a$. _[Biyectiva: inyectiva y sobreyectiva]_
- **L3** ← L2 — Por construcción, $f(g(y))=y$ para todo $y\in B$, es decir, $f\circ g=\mathrm{id}_B$. _[Composición: (g∘f)(x)=g(f(x))]_
- **L4** ← L2 — Para $a\in A$, $g(f(a))$ es el único $a'$ con $f(a')=f(a)$; por inyectividad, $a'=a$. Luego $g\circ f=\mathrm{id}_A$. _[Inyectiva: f(x)=f(y) implica x=y]_
- **L5** ← L1 — (⇐) Supongamos que existe $g$ con $g\circ f=\mathrm{id}_A$ y $f\circ g=\mathrm{id}_B$. Inyectividad: si $f(x)=f(y)$, entonces $x=g(f(x))=g(f(y))=y$. _[Inyectiva: f(x)=f(y) implica x=y]_
- **L6** ← L1 — Sobreyectividad: dado $y\in B$, el elemento $a=g(y)$ cumple $f(a)=f(g(y))=y$. _[Sobreyectiva: para todo b del codominio existe a con f(a)=b]_
- **L7** ← L5, L6 — Por L5 y L6, $f$ es biyectiva. _[Biyectiva: inyectiva y sobreyectiva]_
- **L8** ← L3, L4, L7 — Se cumplen ambas implicaciones, de modo que $f$ es biyectiva si y solo si tiene inversa. ∎ _[Para probar P ⟺ Q se prueban P ⇒ Q y Q ⇒ P]_

**Líneas distractoras (falsas a propósito).**

- Como $g\circ f=\mathrm{id}_A$, $f$ es biyectiva. — _falla:_ solo una inversa por un lado da inyectividad
- Como $f(a)=a$, entonces $g(f(a))=a$. — _falla:_ supone sin razón que $f$ deja fijo a cada elemento

**Errores para «cazar el error».**

- Sustituye **L2**: (⇒) Sea $f$ biyectiva y $y\in B$. Por inyectividad existe $a\in A$ con $f(a)=y$. Definimos $g(y)=a$. — _diagnóstico:_ Paso no justificado: se afirma sin razón
- Sustituye **L5**: (⇐) ... Inyectividad: si $f(x)=f(y)$, entonces $x=f(g(x))=f(g(y))=y$. — _diagnóstico:_ Error de cálculo: el resultado de la línea no sale de la anterior
- Sustituye **L6**: Sobreyectividad: dado $y\in B$, el elemento $a=f(y)$ cumple $f(a)=y$. — _diagnóstico:_ Error de cálculo: el resultado de la línea no sale de la anterior

**Estrategias.**

- ✓ válida: Probar las dos implicaciones por separado — Es la forma estándar de una equivalencia.
- ✓ válida: En cada sentido, suponer lo contrario y llegar a una contradicción — Posible, aunque más larga.
- ✗ no sirve: Comprobarlo con $f(x)=2x$ en $\mathbb{R}$ — Un ejemplo no prueba el teorema general.
- ✗ no sirve: Suponer que $A$ y $B$ son finitos y contar elementos — El teorema vale para conjuntos cualesquiera.

### Si g∘f es inyectiva, f lo es — `t.factor-inyectiva` (nivel 1.4)

**Enunciado.** Si $g\circ f$ es inyectiva, entonces $f$ es inyectiva.

**Hipótesis.** $g\circ f$ es inyectiva

**Depende de.** nada previo (solo definiciones y propiedades base)

**Demostración (grafo de dependencias entre líneas).** Cualquier orden que respete las flechas se acepta.

- **L1** ← ∅ — Sean $x,b\in A$ con $f(x)=f(b)$; debemos probar que $x=b$. _[Inyectiva: f(x)=f(y) implica x=y]_
- **L2** ← L1 — Aplicando $g$ a ambos lados, $g(f(x))=g(f(b))$, es decir, $(g\circ f)(x)=(g\circ f)(b)$. _[Composición: (g∘f)(x)=g(f(x))]_
- **L3** ← L2 — Como $g\circ f$ es inyectiva, $x=b$. _[Hipótesis]_
- **L4** ← L3 — Luego $f$ es inyectiva. ∎ _[Inyectiva: f(x)=f(y) implica x=y]_

**Líneas distractoras (falsas a propósito).**

- Como $g$ es inyectiva, de $g(f(x))=g(f(b))$ se sigue $x=b$. — _falla:_ $g$ no es hipótesis: solo lo es $g\circ f$
- Como $g\circ f$ es inyectiva, $g$ también lo es. — _falla:_ falso en general: $g$ puede fallar fuera de la imagen de $f$

**Errores para «cazar el error».**

- Sustituye **L2**: Aplicando $g$ a ambos lados, $f(g(x))=f(g(b))$. — _diagnóstico:_ Error de cálculo: el resultado de la línea no sale de la anterior
- Sustituye **L3**: Como $f$ es inyectiva, $x=b$. — _diagnóstico:_ Argumento circular: usa lo que se quiere probar
- Sustituye **L4**: Luego $g$ es inyectiva. ∎ — _diagnóstico:_ La conclusión no se sigue de lo anterior (falacia)

**Estrategias.**

- ✓ válida: Tomar $f(x)=f(y)$, aplicar $g$ y usar la inyectividad de la composición — Es la prueba estándar.
- ✓ válida: Suponer $f$ no inyectiva y probar que $g\circ f$ no lo es — Es la contrapositiva y funciona igual.
- ✗ no sirve: Probar primero que $g$ es inyectiva — No es cierto en general.
- ✗ no sirve: Verificar un ejemplo concreto — Un ejemplo ilustra, pero no demuestra que valga siempre.

### Paridad de sumas y productos — `t.paridad-operaciones` (nivel 1.5)

**Enunciado.** La suma de dos enteros impares es par y su producto es impar.

**Hipótesis.** $a$ y $b$ son enteros impares; un entero $z$ es par si $z=2m$ e impar si $z=2m+1$, con $m\in\mathbb{Z}$

**Depende de.** nada previo (solo definiciones y propiedades base)

**Demostración (grafo de dependencias entre líneas).** Cualquier orden que respete las flechas se acepta.

- **L1** ← ∅ — Por ser impares, existen $k,l\in\mathbb{Z}$ con $a=2k+1$ y $b=2l+1$. _[Impar: n = 2k+1 para algún entero k]_
- **L2** ← L1 — Suma: $a+b=2k+2l+2=2\cdot$ $(k+l+1)$, con $k+l+1\in\mathbb{Z}$; luego $a+b$ es par. _[Par: n = 2k para algún entero k]_
- **L3** ← L1 — Producto: $ab=(2k+1)(2l+1)=4kl+2k+2l+1=2(2kl+k+l)+1$, con $2kl+k+l\in\mathbb{Z}$; luego $ab$ es impar. _[Impar: n = 2k+1 para algún entero k]_
- **L4** ← L2, L3 — Las dos afirmaciones están probadas. ∎ _[Los enteros son cerrados bajo suma, resta y producto]_

**Líneas distractoras (falsas a propósito).**

- Como $3$ y $5$ son impares, $3+5=8$ es par y $3\cdot 5=15$ es impar; por tanto vale siempre. — _falla:_ un ejemplo no prueba un enunciado general
- Sean $a=2k$ y $b=2l$; entonces $a+b=2(k+l)$ es par. — _falla:_ toma pares en lugar de impares

**Errores para «cazar el error».**

- Sustituye **L2**: Suma: $a+b=2k+2l+1=2(k+l)+1$; luego $a+b$ es impar. — _diagnóstico:_ Error de cálculo: el resultado de la línea no sale de la anterior
- Sustituye **L3**: Producto: $ab=(2k+1)(2l+1)=4kl+1$; luego es impar. — _diagnóstico:_ Error de cálculo: el resultado de la línea no sale de la anterior
- Sustituye **L1**: Por ser impares, existe $k\in\mathbb{Z}$ con $a=2k+1$ y $b=2k+1$. — _diagnóstico:_ La conclusión no se sigue de lo anterior (falacia)

**Estrategias.**

- ✓ válida: Escribir $a=2k+1$ y $b=2l+1$ y operar — Es la prueba estándar.
- ✓ válida: Trabajar con los restos módulo $2$ — Equivale a lo anterior con otra notación.
- ✗ no sirve: Comprobar con varios pares de impares — Ningún número finito de ejemplos prueba un enunciado para todos.
- ✓ válida: Suponer que la suma es impar y buscar una contradicción — Funciona, aunque no aporta nada sobre la directa.

### Si n² es par, n es par — `t.cuadrado-par` (nivel 1.5)

**Enunciado.** Para todo entero $n$: si $n^2$ es par, entonces $n$ es par.

**Hipótesis.** $m\in\mathbb{Z}$; Puedes citar la contrapositiva y la paridad de productos

**Depende de.** `t.contrapositiva`, `t.paridad-operaciones`

**Demostración (grafo de dependencias entre líneas).** Cualquier orden que respete las flechas se acepta.

- **L1** ← ∅ — Todo entero es par o impar, y no ambos; por eso «$m$ no es par» equivale a «$m$ es impar». _[Todo entero es par o impar, y no ambos]_
- **L2** ← L1 — Probamos la contrapositiva: si $m$ es impar, entonces $m^2$ es impar. _[Contrapositiva]_
- **L3** ← L2 — Sea $m$ impar. Por el teorema de paridad de sumas y productos aplicado a $m$ y $m$, el producto $m\cdot m$ es impar. _[Paridad de sumas y productos]_
- **L4** ← L3 — Luego $m^2$ es impar, y la contrapositiva está probada. _[Impar: n = 2k+1 para algún entero k]_
- **L5** ← L4 — Por la contrapositiva, si $m^2$ es par entonces $m$ es par. ∎ _[Contrapositiva]_

**Líneas distractoras (falsas a propósito).**

- Como $m^2=2k$, entonces $m=2\sqrt{k}$; luego $m$ es par. — _falla:_ supone que $\sqrt{k}$ es un entero
- Probamos el recíproco: si $m$ es par, entonces $m^2$ es par. — _falla:_ confunde la contrapositiva con el recíproco

**Errores para «cazar el error».**

- Sustituye **L3**: Sea $m$ impar. Como $m$ es impar, $m\cdot m$ es par. — _diagnóstico:_ Error de cálculo: el resultado de la línea no sale de la anterior
- Sustituye **L4**: Luego $m^2$ es par, y la contrapositiva está probada. — _diagnóstico:_ La conclusión no se sigue de lo anterior (falacia)
- Sustituye **L5**: Por la contrapositiva, si $m$ es par entonces $m^2$ es par. ∎ — _diagnóstico:_ La conclusión no se sigue de lo anterior (falacia)

**Estrategias.**

- ✓ válida: Probar la contrapositiva: $n$ impar $\Rightarrow n^2$ impar — Es la prueba más corta.
- ✓ válida: Suponer $n^2$ par y $n$ impar, y llegar a una contradicción — Equivale a la contrapositiva.
- ✗ no sirve: Partir de $n^2=2k$ y despejar $n$ — No se puede despejar $n$ sin saber ya lo que se quiere probar.
- ✗ no sirve: Inducción sobre $n$ — No hay estructura recursiva en la hipótesis.

### √2 es irracional — `t.raiz2-irracional` (nivel 1.5)

**Enunciado.** No existe un racional $q$ con $q^2=2$; es decir, $\sqrt{2}$ es irracional.

**Hipótesis.** Puedes citar el teorema «$n^2$ par implica $n$ par»; Todo racional positivo se escribe $a/b$ con $a,b\in\mathbb{N}$, $b\neq 0$, no ambos pares

**Depende de.** `t.cuadrado-par`

**Demostración (grafo de dependencias entre líneas).** Cualquier orden que respete las flechas se acepta.

- **L1** ← ∅ — Supongamos, por reducción al absurdo, que $\sqrt{2}$ es racional. _[Reducción al absurdo: si suponer lo contrario lleva a una contradicción, lo supuesto es falso]_
- **L2** ← L1 — Entonces $\sqrt{2}=a/b$ con $a,b\in\mathbb{N}$, $b\neq 0$, no ambos pares. _[Todo racional positivo se escribe a/b con a, b naturales no ambos pares]_
- **L3** ← L2 — Elevando al cuadrado, $2=a^2/b^2$, es decir, $a^2=2b^2$. _[Álgebra de los números: operar, despejar, sustituir]_
- **L4** ← L3 — Luego $a^2$ es par (es $2$ por un entero). _[Par: n = 2k para algún entero k]_
- **L5** ← L4 — Por el teorema de el cuadrado par, $a$ es par: $a=2m$ con $m\in\mathbb{N}$. _[Si n² es par, n es par]_
- **L6** ← L3, L5 — Sustituyendo, $4m^2=2b^2$, o sea $b^2=2m^2$; luego $b^2$ es par. _[Álgebra de los números: operar, despejar, sustituir]_
- **L7** ← L6 — Por el mismo teorema, $b$ es par. _[Si n² es par, n es par]_
- **L8** ← L2, L5, L7 — Entonces $a$ y $b$ son ambos pares, en contradicción con L2. Por tanto $\sqrt{2}$ es irracional. ∎ _[Reducción al absurdo: si suponer lo contrario lleva a una contradicción, lo supuesto es falso]_

**Líneas distractoras (falsas a propósito).**

- Como $\sqrt{2}=1{,}41421\ldots$ no se repite, $\sqrt{2}$ es irracional. — _falla:_ comprobar cifras no prueba nada: no es una demostración
- Como $a^2=2b^2$, $a^2$ es par; luego $a$ y $b$ son pares. — _falla:_ omite probar que $b$ es par y usa un salto sin justificar

**Errores para «cazar el error».**

- Sustituye **L3**: Elevando al cuadrado, $2=a^2/b$, es decir, $a^2=2b$. — _diagnóstico:_ Error de cálculo: el resultado de la línea no sale de la anterior
- Sustituye **L6**: Sustituyendo, $2m^2=2b^2$, o sea $b^2=m^2$. — _diagnóstico:_ Error de cálculo: el resultado de la línea no sale de la anterior
- Sustituye **L2**: Entonces $\sqrt{2}=a/b$ con $a,b\in\mathbb{N}$ pares. — _diagnóstico:_ La conclusión no se sigue de lo anterior (falacia)

**Estrategias.**

- ✓ válida: Reducción al absurdo con la fracción irreducible — Es la prueba clásica.
- ✓ válida: Descenso infinito: de $a^2=2b^2$ salen enteros más pequeños con la misma propiedad — Es la versión sin fracción irreducible; usa el buen orden de $\mathbb{N}$.
- ✗ no sirve: Calcular muchas cifras decimales de $\sqrt{2}$ — Un número finito de cifras no decide la irracionalidad.
- ✗ no sirve: Probar directamente que $\sqrt{2}$ no es un cociente de enteros — No hay un camino directo: se razona mejor negando.

### Entre dos racionales hay otro — `t.densidad-racionales` (nivel 1.5)

**Enunciado.** Si $p<q$ son racionales, existe un racional $r$ con $p<r<q$.

**Hipótesis.** $x,y\in\mathbb{Q}$ con $x<y$

**Depende de.** nada previo (solo definiciones y propiedades base)

**Demostración (grafo de dependencias entre líneas).** Cualquier orden que respete las flechas se acepta.

- **L1** ← ∅ — Construimos el candidato $r=\dfrac{x+y}{2}$. _[Para probar «existe» basta exhibir un objeto y comprobar que cumple lo pedido]_
- **L2** ← L1 — $r$ es racional: la suma de racionales es racional y dividir entre $2$ también. _[Álgebra de los números: operar, despejar, sustituir]_
- **L3** ← L1 — Como $x<y$, sumando $x$ a ambos lados, $2x<x+y$, y dividiendo entre 2 queda $x<r$. _[Orden de los números: sumar lo mismo o multiplicar por un positivo conserva la desigualdad]_
- **L4** ← L1 — Como $x<y$, sumando $y$ a ambos lados, $x+y<2y$, y dividiendo entre $2$ queda $r<y$. _[Orden de los números: sumar lo mismo o multiplicar por un positivo conserva la desigualdad]_
- **L5** ← L2, L3, L4 — Entonces $x<r<y$ con $r$ racional. ∎ _[Para probar «existe» basta exhibir un objeto y comprobar que cumple lo pedido]_

**Líneas distractoras (falsas a propósito).**

- Sea $r=x+y$; entonces $x<r<y$. — _falla:_ falso: por ejemplo con $p=2$, $q=3$ da $r=5>q$
- Como los racionales son un conjunto infinito, entre dos racionales siempre hay otro. — _falla:_ ser infinito no basta: los enteros también lo son y entre $1$ y $2$ no hay otro

**Errores para «cazar el error».**

- Sustituye **L3**: Como $x<y$, sumando $x$ a ambos lados, $2x<x+y$, y dividiendo entre $-2$ queda $x<r$. — _diagnóstico:_ Error de cálculo: el resultado de la línea no sale de la anterior
- Sustituye **L4**: Como $x<y$, sumando $y$ a ambos lados, $x+y<y$. — _diagnóstico:_ Error de cálculo: el resultado de la línea no sale de la anterior
- Sustituye **L2**: $r$ es racional porque $x$ y $y$ lo son y $r$ está entre ellos. — _diagnóstico:_ Argumento circular: usa lo que se quiere probar

**Estrategias.**

- ✓ válida: Construir el punto medio y verificarlo — Es la prueba estándar para un «existe».
- ✓ válida: Suponer que no hay racionales entre $p$ y $q$ y llegar a una contradicción — Posible, pero acaba construyendo el punto medio igualmente.
- ✗ no sirve: Inducción sobre el denominador — No es necesaria ni natural aquí.
- ✗ no sirve: Verificar un ejemplo concreto — Un ejemplo ilustra, pero no demuestra que valga siempre.

### Suma de los primeros n números — `t.suma-gauss` (nivel 1.6)

**Enunciado.** Para todo $n\ge 1$: $1+2+\cdots+n=\dfrac{n(n+1)}{2}$.

**Hipótesis.** $m$ recorre los enteros $\ge 1$; Puedes usar el principio de inducción

**Depende de.** nada previo (solo definiciones y propiedades base)

**Demostración (grafo de dependencias entre líneas).** Cualquier orden que respete las flechas se acepta.

- **L1** ← ∅ — Sea $P(m)$ la afirmación $1+2+\cdots+m=\frac{m(m+1)}{2}$. Probaremos $P(m)$ para todo $m\ge 1$ por inducción. _[Principio de inducción: si P(0) (o P(1)) y P(n)⇒P(n+1), entonces P(n) para todo n]_
- **L2** ← L1 — Base: para $m=1$, el lado izquierdo es $1$ y el derecho es $\frac{1\cdot 2}{2}=1$; $P(1)$ se cumple. _[Álgebra de los números: operar, despejar, sustituir]_
- **L3** ← L1 — Hipótesis de inducción: supongamos $P(m)$ para algún $m\ge 1$, es decir, $1+\cdots+m=\frac{m(m+1)}{2}$. _[Hipótesis]_
- **L4** ← L3 — Paso: $1+\cdots+m+(m+1)=\frac{m(m+1)}{2}+(m+1)$, por la hipótesis de inducción. _[Hipótesis de inducción]_
- **L5** ← L4 — Luego $\frac{m(m+1)}{2}+(m+1)=\frac{m(m+1)+2(m+1)}{2}=$ $\frac{(m+1)(m+2)}{2}$. _[Álgebra de los números: operar, despejar, sustituir]_
- **L6** ← L2, L5 — Esto es $P(m+1)$. Por el principio de inducción, $P(m)$ vale para todo $m\ge 1$. ∎ _[Principio de inducción: si P(0) (o P(1)) y P(n)⇒P(n+1), entonces P(n) para todo n]_

**Líneas distractoras (falsas a propósito).**

- Comprobamos $P(m)$ para $m=1,2,3,4,5$; como se cumple en todos, vale siempre. — _falla:_ comprobar casos no prueba un enunciado para todo $n$
- Suponemos $P(m+1)$ y la comprobamos. — _falla:_ la hipótesis es $P(n)$, no la propiedad para $n+1$ (eso es lo que se quiere probar)

**Errores para «cazar el error».**

- Sustituye **L2**: Base: para $m=1$, el lado izquierdo es $1$ y el derecho es $\frac{1\cdot 1}{2}=\frac12$; no coinciden. — _diagnóstico:_ Error de cálculo: el resultado de la línea no sale de la anterior
- Sustituye **L5**: Luego $\frac{m(m+1)}{2}+(m+1)=\frac{m(m+1)+(m+1)}{2}=\frac{(m+1)^2}{2}$. — _diagnóstico:_ Error de cálculo: el resultado de la línea no sale de la anterior
- Sustituye **L6**: Esto es $P(m)$ otra vez; con esto basta. ∎ — _diagnóstico:_ Argumento circular: usa lo que se quiere probar

**Estrategias.**

- ✓ válida: Inducción simple sobre $n$ — Es el método natural: cada suma se apoya en la anterior.
- ✓ válida: Sumar $1+n$, $2+(n-1)$, … emparejando extremos (Gauss) — Prueba directa válida para $n$ par; para $n$ impar hay que tratar el término central. No es inducción, pero sirve.
- ✗ no sirve: Comprobar la fórmula para varios $n$ — Los ejemplos no cubren todos los $n$.
- ✓ válida: Suponer que existe un contraejemplo y usar el buen orden — Funciona si se dispone del buen orden (se ve más adelante en este nivel).

### Suma geométrica — `t.serie-geometrica` (nivel 1.6)

**Enunciado.** Si $r\neq 1$ y $n\ge 0$: $1+r+r^2+\cdots+r^n=\dfrac{r^{n+1}-1}{r-1}$.

**Hipótesis.** $q$ es un número con $q\neq 1$; $m$ recorre los enteros $\ge 0$

**Depende de.** nada previo (solo definiciones y propiedades base)

**Demostración (grafo de dependencias entre líneas).** Cualquier orden que respete las flechas se acepta.

- **L1** ← ∅ — Sea $P(m)$ la igualdad del enunciado. La probamos para todo $m\ge 0$ por inducción. _[Principio de inducción: si P(0) (o P(1)) y P(n)⇒P(n+1), entonces P(n) para todo n]_
- **L2** ← L1 — Base: para $m=0$, el lado izquierdo es $1$ y el derecho es $\frac{q-1}{q-1}=1$ (pues $q\neq 1$); $P(0)$ se cumple. _[Álgebra de los números: operar, despejar, sustituir]_
- **L3** ← L1 — Hipótesis de inducción: supongamos $P(m)$ para algún $m\ge 0$. _[Hipótesis]_
- **L4** ← L3 — Paso: $1+\cdots+q^{m}+q^{m+1}=\frac{q^{m+1}-1}{q-1}+q^{m+1}$, por la hipótesis de inducción. _[Hipótesis de inducción]_
- **L5** ← L4 — Con denominador común, $\frac{q^{m+1}-1}{q-1}+q^{m+1}=\frac{q^{m+1}-1+q^{m+2}-q^{m+1}}{q-1}=$ $\frac{q^{m+2}-1}{q-1}$. _[Álgebra de los números: operar, despejar, sustituir]_
- **L6** ← L2, L5 — Esto es $P(m+1)$. Por inducción, la fórmula vale para todo $m\ge 0$. ∎ _[Principio de inducción: si P(0) (o P(1)) y P(n)⇒P(n+1), entonces P(n) para todo n]_

**Líneas distractoras (falsas a propósito).**

- Si $q=1$ la fórmula también vale: el lado derecho es $\frac{1-1}{1-1}=1$. — _falla:_ divide entre cero: la fórmula exige $r\neq 1$
- Comprobamos la fórmula para $q=2$ y $m=0,1,2,3$; vale siempre. — _falla:_ comprobar casos no prueba el enunciado general

**Errores para «cazar el error».**

- Sustituye **L2**: Base: para $m=0$, el lado izquierdo es $0$ y el derecho también; $P(0)$ se cumple. — _diagnóstico:_ Error de cálculo: el resultado de la línea no sale de la anterior
- Sustituye **L5**: Con denominador común, el numerador queda $q^{m+1}-1+q^{m+1}=2q^{m+1}-1$. — _diagnóstico:_ Error de cálculo: el resultado de la línea no sale de la anterior
- Sustituye **L4**: Paso: $1+\cdots+q^{m}+q^{m+1}=\frac{q^{m+1}-1}{q-1}+q^{m}$. — _diagnóstico:_ Error de cálculo: el resultado de la línea no sale de la anterior

**Estrategias.**

- ✓ válida: Inducción simple sobre $n$ — Cada suma es la anterior más un término.
- ✓ válida: Multiplicar la suma por $(r-1)$ y ver que se cancela (suma telescópica) — Prueba directa válida: $(r-1)\sum r^i=r^{n+1}-1$.
- ✗ no sirve: Comprobar la fórmula con valores concretos de $r$ y $n$ — Los ejemplos no prueban el caso general.
- ✓ válida: Suponer que la fórmula falla para algún $n$ y tomar el menor — Posible con el buen orden, pero más largo.

### Desigualdad de Bernoulli — `t.bernoulli` (nivel 1.6)

**Enunciado.** Si $x\ge -1$ y $n\ge 0$: $(1+x)^n\ge 1+nx$.

**Hipótesis.** $h\ge -1$ es un número real fijo; $m$ recorre los enteros $\ge 0$

**Depende de.** nada previo (solo definiciones y propiedades base)

**Demostración (grafo de dependencias entre líneas).** Cualquier orden que respete las flechas se acepta.

- **L1** ← ∅ — Sea $P(m)$ la desigualdad del enunciado, con $h\ge -1$ fijo. La probamos para todo $m\ge 0$ por inducción. _[Principio de inducción: si P(0) (o P(1)) y P(n)⇒P(n+1), entonces P(n) para todo n]_
- **L2** ← L1 — Base: para $m=0$, $(1+h)^0=1\ge 1+0\cdot h=1$; $P(0)$ se cumple. _[Álgebra de los números: operar, despejar, sustituir]_
- **L3** ← L1 — Hipótesis de inducción: supongamos $(1+h)^{m}\ge 1+mh$ para algún $m\ge 0$. _[Hipótesis]_
- **L4** ← L3 — Como $h\ge -1$, se tiene $1+h\ge 0$. Multiplicando la hipótesis por $1+h$ (que no cambia el sentido): $(1+h)^{m+1}\ge(1+h)(1+mh)$. _[Orden de los números: sumar lo mismo o multiplicar por un positivo conserva la desigualdad]_
- **L5** ← L1 — Desarrollando, $(1+h)(1+mh)=1+(m+1)h+mh^2$. _[Álgebra de los números: operar, despejar, sustituir]_
- **L6** ← L5 — Como $mh^2\ge 0$, resulta $1+(m+1)h+mh^2\ge$ $1+(m+1)h$. _[Orden de los números: sumar lo mismo o multiplicar por un positivo conserva la desigualdad]_
- **L7** ← L2, L4, L5, L6 — Encadenando L4, L5 y L6: $(1+h)^{m+1}\ge 1+(m+1)h$, es decir, $P(m+1)$. Por inducción vale para todo $m\ge 0$. ∎ _[Principio de inducción: si P(0) (o P(1)) y P(n)⇒P(n+1), entonces P(n) para todo n]_

**Líneas distractoras (falsas a propósito).**

- Si $h<-1$ el resultado también vale; la prueba es la misma. — _falla:_ con $x<-1$ el factor $1+x$ es negativo y cambiaría el sentido de la desigualdad
- Multiplicamos la hipótesis por $1+h$ sin comprobar su signo. — _falla:_ multiplicar una desigualdad exige conocer el signo del factor

**Errores para «cazar el error».**

- Sustituye **L4**: Como $h\ge -1$, se tiene $1+h\ge 0$. Multiplicando la hipótesis por $1+h$ cambia el sentido: $(1+h)^{m+1}\le(1+h)(1+mh)$. — _diagnóstico:_ La conclusión no se sigue de lo anterior (falacia)
- Sustituye **L5**: Desarrollando, $(1+h)(1+mh)=1+mh+h$. — _diagnóstico:_ Error de cálculo: el resultado de la línea no sale de la anterior
- Sustituye **L6**: Como $mh^2\ge 0$, resulta $1+(m+1)h+mh^2\le 1+(m+1)h$. — _diagnóstico:_ La conclusión no se sigue de lo anterior (falacia)

**Estrategias.**

- ✓ válida: Inducción simple sobre $n$ — La desigualdad para $n+1$ sale de la de $n$.
- ✗ no sirve: Desarrollar el binomio de Newton y acotar — Con $x\ge -1$ los demás términos pueden ser negativos: no sirve sin más.
- ✗ no sirve: Comprobar con valores concretos de $x$ y $n$ — Los ejemplos no prueban el caso general.
- ✓ válida: Suponer que falla para algún $n$ y tomar el menor — Posible con el buen orden y la misma multiplicación.

### Inducción fuerte — `t.induccion-fuerte` (nivel 1.6)

**Enunciado.** Si para todo $n$, «$P(k)$ para todo $k<n$» implica $P(n)$, entonces $P(n)$ vale para todo $n\in\mathbb{N}$.

**Hipótesis.** para todo $m\in\mathbb{N}$: si $A(k)$ se cumple para todo $k<m$, entonces se cumple $A(m)$; Puedes usar la inducción simple

**Depende de.** nada previo (solo definiciones y propiedades base)

**Demostración (grafo de dependencias entre líneas).** Cualquier orden que respete las flechas se acepta.

- **L1** ← ∅ — Suponemos la hipótesis fuerte: para todo $m$, si $A(k)$ vale para todo $k<m$, entonces vale $A(m)$. _[Hipótesis]_
- **L2** ← L1 — Sea $Q(m)$ la afirmación «$A(k)$ se cumple para todo $k\le m$». Probaremos $Q(m)$ para todo $m$ por inducción simple. _[Principio de inducción: si P(0) (o P(1)) y P(n)⇒P(n+1), entonces P(n) para todo n]_
- **L3** ← L1 — Base: para $m=0$ no hay $k<0$, así que la hipótesis fuerte da $A(0)$; luego $Q(0)$ se cumple. _[Hipótesis]_
- **L4** ← L2 — Paso: supongamos $Q(m)$. Entonces $A(k)$ vale para todo $k<m+1$, y por la hipótesis fuerte vale $A(m+1)$; así $Q(m+1)$. _[Hipótesis]_
- **L5** ← L3, L4 — Por inducción simple, $Q(m)$ vale para todo $m$; en particular $A(m)$ vale para todo $m$. ∎ _[Principio de inducción: si P(0) (o P(1)) y P(n)⇒P(n+1), entonces P(n) para todo n]_

**Líneas distractoras (falsas a propósito).**

- Probamos $A(0)$ y suponemos $A(m)$ para deducir $A(m+1)$; esa es la inducción fuerte. — _falla:_ eso es la inducción simple
- Como $A(k)$ vale para todo $k<m$, vale para todo $m$. — _falla:_ salta a la conclusión sin pasar por la hipótesis fuerte

**Errores para «cazar el error».**

- Sustituye **L3**: Base: $Q(0)$ se cumple porque $A(0)$ es verdadera por definición. — _diagnóstico:_ Paso no justificado: se afirma sin razón
- Sustituye **L4**: Paso: supongamos $Q(m)$. Entonces $A(m+1)$ vale por la hipótesis de inducción simple. — _diagnóstico:_ Argumento circular: usa lo que se quiere probar
- Sustituye **L5**: Por inducción simple, $Q(m)$ vale para todo $m$; luego $A(0)$ vale. ∎ — _diagnóstico:_ La conclusión no se sigue de lo anterior (falacia)

**Estrategias.**

- ✓ válida: Aplicar la inducción simple a $Q(n)$: «$P(k)$ para todo $k\le n$» — Es la prueba estándar.
- ✓ válida: Suponer que $P$ falla en algún $n$ y tomar el menor — Válido, aunque usa el buen orden (que se prueba a partir de este teorema: ojo a la circularidad).
- ✗ no sirve: Comprobar con varias propiedades $P$ — Los ejemplos no prueban el principio general.
- ✗ no sirve: Probar $P(n)$ para cada $n$ directamente — No hay forma general de hacerlo sin la hipótesis.

### Principio del buen orden — `t.buen-orden` (nivel 1.6)

**Enunciado.** Todo subconjunto no vacío de $\mathbb{N}$ tiene un mínimo.

**Hipótesis.** $A\subseteq\mathbb{N}$; Puedes citar la inducción fuerte, la contrapositiva y la negación de cuantificadores

**Depende de.** `t.induccion-fuerte`, `t.contrapositiva`, `t.neg-cuantificadores`

**Demostración (grafo de dependencias entre líneas).** Cualquier orden que respete las flechas se acepta.

- **L1** ← ∅ — Probamos la contrapositiva: si $A\subseteq\mathbb{N}$ no tiene mínimo, entonces $A=\varnothing$. _[Contrapositiva]_
- **L2** ← L1 — Que $A$ no tenga mínimo es $\neg\exists m\in A\ \forall s\in A:\ m\le s$, que equivale a: para todo $m\in A$ existe $s\in A$ con $s<m$. _[Negación de cuantificadores]_
- **L3** ← L1 — Sea $P(n)$ la afirmación «$n\notin A$». Probamos $P(n)$ para todo $n$ por inducción fuerte. _[Inducción fuerte]_
- **L4** ← L3 — Sea $n\in\mathbb{N}$ y supongamos $P(k)$ para todo $k<n$: ningún $k<n$ está en $A$. _[Hipótesis de inducción]_
- **L5** ← L2, L4 — Si $n\in A$, por L2 existe $s\in A$ con $s<n$; pero ningún $k<n$ está en $A$: contradicción. _[Reducción al absurdo: si suponer lo contrario lleva a una contradicción, lo supuesto es falso]_
- **L6** ← L5 — Luego $n\notin A$: se cumple $P(n)$. _[Reducción al absurdo: si suponer lo contrario lleva a una contradicción, lo supuesto es falso]_
- **L7** ← L3, L6 — Por inducción fuerte, $n\notin A$ para todo $n\in\mathbb{N}$; es decir, $A=\varnothing$. _[Inducción fuerte]_
- **L8** ← L7 — Por la contrapositiva, todo subconjunto no vacío de $\mathbb{N}$ tiene mínimo. ∎ _[Contrapositiva]_

**Líneas distractoras (falsas a propósito).**

- Como $\mathbb{N}$ está ordenado, el menor elemento de $A$ existe porque $A$ es finito. — _falla:_ $S$ puede ser infinito
- Tomamos $A=\{3,5,8\}$ y vemos que su mínimo es $3$; por tanto vale siempre. — _falla:_ un ejemplo no prueba el principio general

**Errores para «cazar el error».**

- Sustituye **L2**: Que $A$ no tenga mínimo equivale a: existe $m\in A$ tal que para todo $s\in A$, $s<m$. — _diagnóstico:_ Error de cálculo: el resultado de la línea no sale de la anterior
- Sustituye **L5**: Si $n\in A$, entonces $n$ es el mínimo de $A$, lo cual es consistente. — _diagnóstico:_ La conclusión no se sigue de lo anterior (falacia)
- Sustituye **L8**: Por la contrapositiva, si $A=\varnothing$ entonces $A$ no tiene mínimo. ∎ — _diagnóstico:_ La conclusión no se sigue de lo anterior (falacia)

**Estrategias.**

- ✓ válida: Suponer que $S$ no tiene mínimo y probar $S=\varnothing$ con inducción fuerte — Es la prueba estándar.
- ✓ válida: Suponer $S$ no vacío sin mínimo y buscar un elemento mínimo con una descomposición — Equivale a la anterior.
- ✗ no sirve: Suponer que $S$ es finito — No es hipótesis del enunciado.
- ✗ no sirve: Comprobar con varios subconjuntos — Los ejemplos no prueban un principio general.

### Jefe: inversa-composicion — `jefe.inversa-de-composicion` (nivel J1)

**Enunciado.** (enunciado de la prueba del jefe; no entra al Códice)

**Hipótesis.** $f$ y $g$ son biyectivas; Puedes citar los teoremas de composición de biyectivas y de biyectiva ⇔ inversa

**Depende de.** `t.comp-biyectiva`, `t.biyectiva-inversa`

**Demostración (grafo de dependencias entre líneas).** Cualquier orden que respete las flechas se acepta.

- **L1** ← ∅ — Como $f$ y $g$ son biyectivas, $g\circ f$ es biyectiva. _[Composición de biyectivas]_
- **L2** ← L1 — Por el teorema «biyectiva ⇔ tiene inversa», $f$ y $g$ tienen inversas $f^{-1}$ y $g^{-1}$, y $g\circ f$ tiene una inversa $h$ con $h\circ(g\circ f)=\mathrm{id}_A$. _[Biyectiva si y solo si tiene inversa]_
- **L3** ← L2 — Calculamos: $(f^{-1}\circ g^{-1})\circ(g\circ f)=f^{-1}\circ(g^{-1}\circ g)\circ f=f^{-1}\circ f=\mathrm{id}_A$, por la asociatividad de la composición. _[La composición de funciones es asociativa: (h∘g)∘f = h∘(g∘f)]_
- **L4** ← L2 — Análogamente, $(g\circ f)\circ(f^{-1}\circ g^{-1})=g\circ(f\circ f^{-1})\circ g^{-1}=g\circ g^{-1}=\mathrm{id}_C$. _[Inversa de f: función g con g∘f = id y f∘g = id]_
- **L5** ← L2, L4 — Si $h$ es una inversa de $g\circ f$: $h=h\circ\mathrm{id}_C=h\circ((g\circ f)\circ(f^{-1}\circ g^{-1}))=(h\circ(g\circ f))\circ(f^{-1}\circ g^{-1})=\mathrm{id}_A\circ(f^{-1}\circ g^{-1})=f^{-1}\circ g^{-1}$. _[La composición de funciones es asociativa: (h∘g)∘f = h∘(g∘f)]_
- **L6** ← L3, L5 — Luego $(g\circ f)^{-1}=f^{-1}\circ g^{-1}$. ∎ _[Inversa de f: función g con g∘f = id y f∘g = id]_

**Líneas distractoras (falsas a propósito).**

- Como $(g\circ f)^{-1}=g^{-1}\circ f^{-1}$, el orden no importa. — _falla:_ el orden se invierte: $g^{-1}\circ f^{-1}$ ni siquiera está definida en general
- Comprobamos con $f(x)=x+1$ y $g(x)=2x$; vale en ese caso, luego vale siempre. — _falla:_ un ejemplo no prueba el enunciado general

**Errores para «cazar el error».**

- Sustituye **L3**: Calculamos: $(f^{-1}\circ g^{-1})\circ(g\circ f)=f^{-1}\circ(f\circ g)\circ g^{-1}=\mathrm{id}$. — _diagnóstico:_ Error de cálculo: el resultado de la línea no sale de la anterior
- Sustituye **L5**: Si $h$ es una inversa de $g\circ f$, entonces $h=f^{-1}\circ g^{-1}$ porque ambas «se parecen». — _diagnóstico:_ Paso no justificado: se afirma sin razón
- Sustituye **L1**: Como $f$ y $g$ son inyectivas, $g\circ f$ es biyectiva. — _diagnóstico:_ La conclusión no se sigue de lo anterior (falacia)

**Estrategias.**

- ✓ válida: Verificar con la asociatividad que $f^{-1}\circ g^{-1}$ cumple las dos identidades y usar la unicidad de la inversa — Es la prueba estándar.
- ✓ válida: Despejar elemento a elemento: $(g\circ f)(x)=c\Rightarrow x=f^{-1}(g^{-1}(c))$ — Válida: usa que $f$ y $g$ son inyectivas para despejar.
- ✗ no sirve: Comprobar con funciones lineales concretas — Un ejemplo no prueba el caso general.
- ✗ no sirve: Probar la contrapositiva — No hay una implicación que invertir.

### Jefe: complemento-inclusion — `jefe.complemento-invierte-inclusion` (nivel J1)

**Enunciado.** (enunciado de la prueba del jefe; no entra al Códice)

**Hipótesis.** $A\subseteq B\subseteq U$; Puedes citar «inclusión e intersección» y las leyes de De Morgan para conjuntos

**Depende de.** `t.inclusion-interseccion`, `t.demorgan-conj`

**Demostración (grafo de dependencias entre líneas).** Cualquier orden que respete las flechas se acepta.

- **L1** ← ∅ — Como $A\subseteq B$, por el teorema de inclusión e intersección, $A\cap B=A$. _[Inclusión e intersección]_
- **L2** ← L1 — Tomando complementos en ambos lados, $(A\cap B)^c=A^c$. _[Propiedades de la igualdad: sustituir iguales por iguales]_
- **L3** ← L1 — Por De Morgan para conjuntos, $(A\cap B)^c=A^c\cup B^c$. _[Leyes de De Morgan para conjuntos]_
- **L4** ← L2, L3 — De L2 y L3, $A^c\cup B^c=A^c$. _[Propiedades de la igualdad: sustituir iguales por iguales]_
- **L5** ← L4 — Si $z\in B^c$, entonces $z\in A^c\cup B^c=$ $A^c$; luego $z\in A^c$. _[Definición de unión: x ∈ A∪B ⟺ x ∈ A o x ∈ B]_
- **L6** ← L5 — Como $z\in B^c$ era arbitrario, $B^c\subseteq A^c$. ∎ _[Definición de inclusión: A ⊆ B si todo elemento de A está en B]_

**Líneas distractoras (falsas a propósito).**

- Como $A\subseteq B$, entonces $A^c\subseteq B^c$. — _falla:_ invierte mal: el complemento invierte la inclusión
- Tomamos $U=\{1,2,3\}$, $A=\{1\}$, $B=\{1,2\}$: $B^c=\{3\}\subseteq\{2,3\}=A^c$; luego vale siempre. — _falla:_ un ejemplo no prueba el caso general

**Errores para «cazar el error».**

- Sustituye **L3**: Por De Morgan para conjuntos, $(A\cap B)^c=A^c\cap B^c$. — _diagnóstico:_ De Morgan mal aplicado: no se cambió el conector
- Sustituye **L5**: Si $z\in B^c$, entonces $z\in A^c\cup B^c=B^c$; luego $z\in A^c$. — _diagnóstico:_ Error de cálculo: el resultado de la línea no sale de la anterior
- Sustituye **L1**: Como $A\subseteq B$, por el teorema de inclusión e intersección, $A\cap B=B$. — _diagnóstico:_ Error de cálculo: el resultado de la línea no sale de la anterior

**Estrategias.**

- ✓ válida: Usar $A\cap B=A$, De Morgan y la unión — Aprovecha los dos teoremas ganados.
- ✓ válida: Tomar $x\in B^c$ y probar $x\notin A$ por contraposición — Válida: si $x\in A\subseteq B$ entonces $x\in B$.
- ✗ no sirve: Dibujar un diagrama de Venn — Ilustra, no demuestra.
- ✗ no sirve: Verificar un ejemplo concreto — Un ejemplo ilustra, pero no demuestra que valga siempre.

### Jefe: suma-cubos — `jefe.suma-de-cubos` (nivel J1)

**Enunciado.** (enunciado de la prueba del jefe; no entra al Códice)

**Hipótesis.** $m$ recorre los enteros $\ge 1$; Puedes citar la suma de los primeros $n$ números y la inducción fuerte

**Depende de.** `t.suma-gauss`, `t.induccion-fuerte`

**Demostración (grafo de dependencias entre líneas).** Cualquier orden que respete las flechas se acepta.

- **L1** ← ∅ — Por la fórmula de la suma de los primeros números, $(1+\cdots+m)^2=\left(\frac{m(m+1)}{2}\right)^2$. Basta probar $P(m):\ 1^3+\cdots+m^3=\left(\frac{m(m+1)}{2}\right)^2$. _[Suma de los primeros n números]_
- **L2** ← L1 — Probamos $P(m)$ por inducción fuerte: sea $m\ge 1$ y supongamos $P(k)$ para todo $1\le k<m$. _[Inducción fuerte]_
- **L3** ← L1 — Caso $m=1$: $1^3=1=\left(\frac{1\cdot 2}{2}\right)^2$. _[Álgebra de los números: operar, despejar, sustituir]_
- **L4** ← L2 — Caso $m\ge 2$: en particular vale $P(m-1)$, es decir, $1^3+\cdots+(m-1)^3=\left(\frac{(m-1)m}{2}\right)^2$. _[Hipótesis]_
- **L5** ← L4 — Sumando $m^3$ a ambos lados: $1^3+\cdots+m^3=\left(\frac{(m-1)m}{2}\right)^2+m^3$, por la hipótesis de inducción. _[Hipótesis de inducción]_
- **L6** ← L5 — Sacando factor común, $\left(\frac{(m-1)m}{2}\right)^2+m^3=m^2\cdot\frac{(m-1)^2+4m}{4}=m^2\cdot\frac{(m+1)^2}{4}=$ $\left(\frac{m(m+1)}{2}\right)^2$. _[Álgebra de los números: operar, despejar, sustituir]_
- **L7** ← L1, L3, L6 — En ambos casos vale $P(m)$. Por inducción fuerte, $P(m)$ vale para todo $m\ge 1$ y, con L1, $1^3+\cdots+m^3=(1+\cdots+m)^2$. ∎ _[Inducción fuerte]_

**Líneas distractoras (falsas a propósito).**

- Comprobamos $m=1,2,3,4$; coincide en todos, luego vale siempre. — _falla:_ comprobar casos no es una demostración
- Como $1^3+\cdots+m^3=1+\cdots+m$ (porque $k^3=k$), la igualdad es obvia. — _falla:_ falso: $k^3\neq k$

**Errores para «cazar el error».**

- Sustituye **L3**: Caso $m=1$: $1^3=1$ y $\left(\frac{1\cdot 2}{2}\right)^2=2$; no coinciden. — _diagnóstico:_ Error de cálculo: el resultado de la línea no sale de la anterior
- Sustituye **L6**: Sacando factor común, $m^2\cdot\frac{(m-1)^2+4m}{4}=m^2\cdot\frac{(m+1)^2}{4}$ y $\frac{(m-1)^2+4m}{4}=\frac{m^2+m+1}{4}$. — _diagnóstico:_ Error de cálculo: el resultado de la línea no sale de la anterior
- Sustituye **L5**: Sumando $m$ a ambos lados: $1^3+\cdots+m^3=\left(\frac{(m-1)m}{2}\right)^2+m$. — _diagnóstico:_ Error de cálculo: el resultado de la línea no sale de la anterior

**Estrategias.**

- ✓ válida: Inducción fuerte (o simple) apoyada en la fórmula de Gauss — Es la prueba estándar; aquí basta la hipótesis para $n-1$.
- ✓ válida: Telescopar con $(k+1)^4-k^4$ — Válida: da la suma de cubos a partir de las de cuadrados y de números.
- ✗ no sirve: Comprobar con valores de $n$ — Los ejemplos no prueban el caso general.
- ✓ válida: Suponer que falla para algún $n$ y tomar el menor — Posible con el buen orden y el mismo cálculo.

## Generadores de aplicación y de práctica de equivalencias

### `w1.n1.tabla-de-verdad`

- Familia: aplicacion; habilidades: 1.1.tabla; requiere: nada.
- Ejemplo de enunciado: Completa la columna de la fórmula $B \wedge (C \vee A)$ en su tabla de verdad. (Haz clic en cada celda para alternar V y F.)
- Verificador: `tabla-de-verdad`. Firmas de error de este ejemplo: `o-exclusivo`, `y-por-o`.
- Explicación: Columna correcta (de arriba abajo): V V F F V F F F.

### `w1.n1.contar-modelos`

- Familia: aplicacion; habilidades: 1.1.tabla; requiere: nada.
- Ejemplo de enunciado: Para la fórmula $(B \vee C) \wedge \neg A$, ¿qué fracción de las filas de su tabla de verdad la hacen verdadera? (Escribe una fracción o un decimal.)
- Verificador: `racional`. Firmas de error de este ejemplo: `cuenta-las-falsas`, `o-exclusivo`.
- Explicación: Columna: F F F F V V V F. Hay 3 filas verdaderas de 8, es decir 3/8.

### `w1.n1.negar-formula`

- Familia: aplicacion; habilidades: 1.1.negacion; requiere: nada.
- Ejemplo de enunciado: Escribe una fórmula equivalente a $\neg ((\neg Q \to P) \wedge \neg R)$ en la que la negación aparezca solo delante de letras (y sin usar → ni ↔).
- Verificador: `equivalente-logica`. Firmas de error de este ejemplo: `demorgan-sin-cambiar`.
- Explicación: Una respuesta correcta es $(\neg Q \wedge \neg P) \vee R$.

### `w1.n1.contrapositiva-reciproca`

- Familia: aplicacion; habilidades: 1.1.contrapositiva; requiere: nada.
- Ejemplo de enunciado: Dada la implicación Si la función $f$ no es derivable en $a$, entonces $f$ es continua en $a$. ¿cuál es su inversa?
- Verificador: `indice`. Firmas de error de este ejemplo: `elige-reciproca`, `elige-contrapositiva`, `elige-contradictoria`.
- Explicación: La inversa es: Si la función $f$ es derivable en $a$, entonces $f$ no es continua en $a$.

### `w1.n1.simplificar-pasos`

- Familia: aplicacion; habilidades: 1.1.simplificar, 1.1.negacion; requiere: t.demorgan-prop.
- Ejemplo de enunciado: Transforma $(C \vee B) \wedge (\neg B \to A)$ en una fórmula equivalente donde las negaciones solo afecten a letras y no haya → ni ↔. Elige en cada paso la ley que aplicas y dónde; el juego hace la sustitución.
- Verificador: `ruta-valida`. Firmas de error de este ejemplo: ninguna (el verificador comprueba propiedades).
- Explicación: Hay un camino de 2 pasos; el tuyo puede ser otro mientras llegue a la forma pedida.

### `w1.n1.equivalente-a`

- Familia: aplicacion; habilidades: 1.1.equivalencia; requiere: nada.
- Ejemplo de enunciado: ¿Cuál de estas fórmulas es equivalente a $(r \vee q) \wedge \neg p$?
- Verificador: `indice`. Firmas de error de este ejemplo: `y-por-o`, `neg-total`, `o-exclusivo`.
- Explicación: La equivalente es $\neg p \wedge (r \vee q)$: tiene la misma columna que $(r \vee q) \wedge \neg p$ (F F F F V V V F).

### `w1.n1.tautologias`

- Familia: aplicacion; habilidades: 1.1.equivalencia, 1.1.tabla; requiere: nada.
- Ejemplo de enunciado: Marca todas las fórmulas que son tautologías (verdaderas en todas las filas de su tabla).
- Verificador: `conjunto-indices`. Firmas de error de este ejemplo: `marca-falacia`, `marca-falacia`.
- Explicación: Son tautologías las opciones: $((X \to Y) \wedge (Y \to Z)) \to (X \to Z)$, $X \vee \neg X$, $X \to (X \vee Y)$.

### `w1.n1.vf-equivalencia`

- Familia: demostracion (vf-justificado); habilidades: 1.1.equivalencia, 1.1.demostrar; requiere: nada.
- Ejemplo de enunciado: Afirmación: $\neg B \to \neg A$ y $A \to B$ son equivalentes ($\equiv$). Decide si es verdadera o falsa y elige la justificación correcta.
- Verificador: `vf-justificado`. Firmas de error de este ejemplo: ninguna (el verificador comprueba propiedades).
- Explicación: Verdadero: coinciden en las 4 filas de la tabla de verdad.

### `w1.n1.contraejemplo`

- Familia: demostracion (contraejemplo); habilidades: 1.1.equivalencia, 1.1.demostrar; requiere: nada.
- Ejemplo de enunciado: Se afirma que $A \leftrightarrow B$ y $A \to B$ son equivalentes, pero no lo son. Construye un contraejemplo: asigna V o F a cada letra de modo que las dos fórmulas tengan valores distintos.
- Verificador: `asignacion`. Firmas de error de este ejemplo: ninguna (el verificador comprueba propiedades).
- Explicación: Un contraejemplo es A=F, B=V.

### `w1.n2.negar-cuantificado`

- Familia: aplicacion; habilidades: 1.2.negar-cuantificado; requiere: nada.
- Ejemplo de enunciado: Niega el enunciado $\forall\ x\in \mathbb{R}\;\exists\ y\in \mathbb{R}:\ x+y\ge 10$. ¿Cuál de estas es su negación?
- Verificador: `indice`. Firmas de error de este ejemplo: `cambia-solo-uno`, `no-cambia-cuantificador`, `no-niega-predicado`.
- Explicación: La negación es $\exists\ x\in \mathbb{R}\;\forall\ y\in \mathbb{R}:\ x+y<10$: cada cuantificador cambia y la condición se niega.

### `w1.n2.valor-verdad`

- Familia: aplicacion; habilidades: 1.2.valor-verdad; requiere: nada.
- Ejemplo de enunciado: Sea $A=\{2,4,5,6\}$. ¿Es verdadero o falso el enunciado $\exists\ m\in A\;\exists\ n\in A:\ m+n=7$?
- Verificador: `indice`. Firmas de error de este ejemplo: `cambia-cuantificadores`.
- Explicación: El enunciado es verdadero. Se comprueba elemento por elemento del dominio {2, 4, 5, 6}.

### `w1.n2.operaciones-conjuntos`

- Familia: aplicacion; habilidades: 1.2.operaciones-conjuntos; requiere: nada.
- Ejemplo de enunciado: Sea $U=\{1,2,3,4,5,6,7,8,9\}$, $S=\{2,6,8\}$, $T=\{1,2,3,6,8\}$ y $U=\{4,6\}$. Escribe $S\cap(T\setminus U)$ (por extensión, con llaves y comas; ∅ si es vacío).
- Verificador: `igual-conjunto`. Firmas de error de este ejemplo: `diferencia-al-reves`.
- Explicación: Resultado: $\{2,8\}$.

### `w1.n2.inclusion-exclusion`

- Familia: aplicacion; habilidades: 1.2.cardinalidad; requiere: nada.
- Ejemplo de enunciado: En un grupo de 63 socios de un club, 22 juegan al ajedrez, 15 juegan al tenis y 3 juegan a ambos. ¿Cuántos no hacen ninguna de las dos cosas?
- Verificador: `entero`. Firmas de error de este ejemplo: `solo-suma`, `olvida-complemento`.
- Explicación: Al menos una: 34; ninguna: 63 − 34 = 29.

### `w1.n2.potencia-producto`

- Familia: aplicacion; habilidades: 1.2.cardinalidad; requiere: nada.
- Ejemplo de enunciado: Si $|A|=4$ y $|B|=4$, ¿cuántos elementos tiene el producto cartesiano $A\times B$?
- Verificador: `entero`. Firmas de error de este ejemplo: `suma`, `potencia`.
- Explicación: $4\cdot 4=16$.

### `w1.n2.inclusiones`

- Familia: aplicacion; habilidades: 1.2.inclusion; requiere: nada.
- Ejemplo de enunciado: Sean $S=\{4,5\}$, $T=\{4,5,8\}$ y $U=\{1,6,8\}$. Marca todas las afirmaciones verdaderas.
- Verificador: `conjunto-indices`. Firmas de error de este ejemplo: `marca-falsa`.
- Explicación: Son verdaderas: $S\cap T=S$, $S\cap U\subseteq S$, $T\subseteq T\cup U$, $S\cup T=T$.

### `w1.n3.propiedades-relacion`

- Familia: aplicacion; habilidades: 1.3.propiedades; requiere: nada.
- Ejemplo de enunciado: Sea $R$ la relación en $A=\{1,2,3,4,5\}$ dada por $R=\{(1,1),(1,2),(2,1),(2,2),(3,2),(3,3),(3,4),(3,5),(4,3),(4,4),(4,5),(5,3),(5,4),(5,5)\}$. Marca todas las propiedades que cumple $R$.
- Verificador: `conjunto-indices`. Firmas de error de este ejemplo: `omite-reflexiva`, `marca-de-mas-simetrica`, `marca-de-mas-antisimetrica`, `marca-de-mas-transitiva`.
- Explicación: Cumple: reflexiva.

### `w1.n3.clases-de-equivalencia`

- Familia: aplicacion; habilidades: 1.3.clases; requiere: nada.
- Ejemplo de enunciado: En $A=\{1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16\}$ se define la relación de equivalencia $a\sim b$ si $a$ y $b$ tienen el mismo número de divisores positivos. Halla la clase $[10]$ (escribe sus elementos entre llaves).
- Verificador: `igual-conjunto`. Firmas de error de este ejemplo: `olvida-el-propio`, `otra-clase`.
- Explicación: $[10]=\{6,8,10,14,15\}$.

### `w1.n3.numero-de-clases`

- Familia: aplicacion; habilidades: 1.3.particion; requiere: nada.
- Ejemplo de enunciado: En $A=\{13,16,20,21,27,28,31,35,36,40\}$ se define la relación de equivalencia $a\sim b$ si $a-b$ es múltiplo de $4$. ¿Cuántas clases de equivalencia distintas hay?
- Verificador: `entero`. Firmas de error de este ejemplo: `menos-una`, `tam-clase`, `todos`.
- Explicación: Hay 3 clases.

### `w1.n3.cierre-equivalencia`

- Familia: aplicacion; habilidades: 1.3.propiedades, 1.3.particion; requiere: nada.
- Ejemplo de enunciado: Sea $R=\{(4,5),(2,4),(1,4)\}$ en $A=\{1,2,3,4,5\}$. ¿Cuántos pares hay que añadir como mínimo para que $R$ sea una relación de equivalencia?
- Verificador: `entero`. Firmas de error de este ejemplo: `sin-transitiva`, `solo-reflexiva`, `tamano-total`.
- Explicación: La relación mínima tiene 17 pares (todos los pares dentro de cada grupo conectado); como ya hay 3, se añaden 14.

### `w1.n3.maximales-minimales`

- Familia: aplicacion; habilidades: 1.3.orden, 1.3.maximales; requiere: nada.
- Ejemplo de enunciado: En $S=\{4,10,15,17,20,21,25\}$ se considera el orden «$a\preceq b$ si $a$ divide a $b$». Escribe el conjunto de elementos minimales de $S$.
- Verificador: `igual-conjunto`. Firmas de error de este ejemplo: `confunde-extremo`, `solo-el-menor`.
- Explicación: Los minimales son {4, 10, 15, 17, 21, 25}.

### `w1.n3.tipo-de-relacion`

- Familia: aplicacion; habilidades: 1.3.propiedades, 1.3.orden; requiere: nada.
- Ejemplo de enunciado: En $\mathbb{Z}$ se define la relación $R$ por $a-b\text{ es impar}$. ¿Qué tipo de relación es?
- Verificador: `indice`. Firmas de error de este ejemplo: `elige-equivalencia`, `elige-orden`, `elige-ambas`.
- Explicación: Es ninguna de las dos (reflexiva: no, simétrica: sí, antisimétrica: no, transitiva: no).

### `w1.n4.clasificar-funcion`

- Familia: aplicacion; habilidades: 1.4.clasificar; requiere: nada.
- Ejemplo de enunciado: Clasifica la función $f:\mathbb{R}\to\mathbb{R},\ f(x)=|x|-3$.
- Verificador: `indice`. Firmas de error de este ejemplo: `elige-sobreyectiva`, `elige-biyectiva`, `elige-inyectiva`.
- Explicación: Es ni inyectiva ni sobreyectiva. No inyectiva: $f(1)=f(-1)=-2$ con $1\neq-1$. No sobreyectiva: $-4$ no es imagen de ningún real (los valores son $\ge -3$).

### `w1.n4.imagen-preimagen`

- Familia: aplicacion; habilidades: 1.4.imagen-preimagen; requiere: nada.
- Ejemplo de enunciado: Sea $f:\{1,2,3,4,5,6\}\to\{a,b,c,d\}$ con $1\mapsto c,\ 2\mapsto a,\ 3\mapsto b,\ 4\mapsto b,\ 5\mapsto d,\ 6\mapsto a$. Halla la imagen $f(S)$ de $S=\{3,5,6\}$ (escribe un conjunto).
- Verificador: `igual-conjunto`. Firmas de error de este ejemplo: `confunde-preimagen`.
- Explicación: $f(S)=\{a,b,d\}$.

### `w1.n4.composicion`

- Familia: aplicacion; habilidades: 1.4.composicion; requiere: nada.
- Ejemplo de enunciado: Sean $f(x)=x+4$ y $g(x)=3x^2+1$. Escribe $(g\circ f)(x)$ (puedes dejarlo sin simplificar; usa ^ para potencias).
- Verificador: `equivalente-expr`. Firmas de error de este ejemplo: `orden-invertido`, `producto`, `suma`, `sin-cuadrado`.
- Explicación: Se sustituye: $3\left(1x+4\right)^{2}+1$.

### `w1.n4.inversa`

- Familia: aplicacion; habilidades: 1.4.inversa; requiere: nada.
- Ejemplo de enunciado: La función $f(x)=\frac{4x}{2x+1}$ es biyectiva (donde esté definida). Escribe su inversa $f^{-1}(x)$ (como expresión en $x$).
- Verificador: `equivalente-expr`. Firmas de error de este ejemplo: `reciproco`, `copia-f`.
- Explicación: Despejando $x$ en $y=f(x)$ se obtiene $f^{-1}(x)=\frac{1x-0}{4-2x}$.

### `w1.n4.contar-funciones`

- Familia: aplicacion; habilidades: 1.4.contar; requiere: nada.
- Ejemplo de enunciado: ¿Cuántas funciones $f:A\to B$ hay si $|A|=2$ y $|B|=7$?
- Verificador: `entero`. Firmas de error de este ejemplo: `al-reves`, `producto`.
- Explicación: Resultado: 49.

### `w1.n5.clasificar-metodo`

- Familia: aplicacion; habilidades: 1.5.metodo; requiere: nada.
- Ejemplo de enunciado: Quieres demostrar (o refutar): «No existe un mayor número entero.». ¿Qué método es el más natural?
- Verificador: `indice`. Firmas de error de este ejemplo: `metodo-contraejemplo`, `metodo-directa`, `metodo-contrapositiva`.
- Explicación: El método más natural es: Reducción al absurdo. Se afirma que algo **no** existe o que algo es irracional: se supone lo contrario y se busca una contradicción.

### `w1.n5.suponer-absurdo`

- Familia: aplicacion; habilidades: 1.5.negar-para-contradiccion; requiere: nada.
- Ejemplo de enunciado: Vas a demostrar por reducción al absurdo: «Si $x>0$ y $xy<0$, entonces $y<0$.». ¿Qué debes suponer al comienzo?
- Verificador: `indice`. Firmas de error de este ejemplo: `suposicion-mal2`, `suposicion-mal0`, `suposicion-mal1`.
- Explicación: Se supone que $x>0$, $xy<0$ y $y\ge 0$.

### `w1.n5.negar-para-todo-si`

- Familia: aplicacion; habilidades: 1.5.contraejemplo, 1.5.negar-para-contradiccion; requiere: nada.
- Ejemplo de enunciado: Sea la afirmación: «Para todo entero positivo $n$, si $n$ es par, entonces $n^2$ es par.» ¿Cuál es su negación?
- Verificador: `indice`. Firmas de error de este ejemplo: `todos-no-q`, `no-p-y-q`, `no-p-no-q`.
- Explicación: La negación es «existe un $n$ tal que $n$ es par y no $n^2$ es par»: un contraejemplo de la afirmación.

### `w1.n5.buscar-contraejemplo`

- Familia: aplicacion; habilidades: 1.5.contraejemplo; requiere: nada.
- Ejemplo de enunciado: Se afirma: «Para todo entero $n\ge 1$: si $8$ divide a $n^2$, entonces $8$ divide a $n$.». Es falsa. Escribe un entero $n$ entre 1 y 80 que la **refute** (un contraejemplo).
- Verificador: `satisface-entero`. Firmas de error de este ejemplo: `ejemplo-que-cumple`, `ejemplo-que-cumple`.
- Explicación: Por ejemplo, con $n=4$ la afirmación falla.

### `w1.n5.paridad-expresiones`

- Familia: aplicacion; habilidades: 1.5.paridad; requiere: nada.
- Ejemplo de enunciado: Sabiendo que $a$ es **impar** y $b$ es **impar**, marca todas las expresiones que son **pares**.
- Verificador: `conjunto-indices`. Firmas de error de este ejemplo: `omite-par`, `omite-par`, `omite-par`, `marca-impar`, `marca-impar`.
- Explicación: Son pares: $a+b$, $a^2+b$, $a^2+b^2$.

### `w1.n6.evaluar-suma`

- Familia: aplicacion; habilidades: 1.6.sumas; requiere: nada.
- Ejemplo de enunciado: Calcula $\displaystyle\sum_{k=1}^{6}k^2$.
- Verificador: `entero`. Firmas de error de este ejemplo: `cuadrado-de-la-suma`, `sin-ultimo`, `solo-suma`.
- Explicación: El valor es 91.

### `w1.n6.paso-inductivo`

- Familia: aplicacion; habilidades: 1.6.paso-inductivo; requiere: nada.
- Ejemplo de enunciado: Para probar por inducción que $\displaystyle\sum_{k=1}^{n}(3k-3)=\frac{3n(n+1)}{2}-3n$ se usa la hipótesis y se **suma el término $(n+1)$-ésimo** al lado derecho. Escribe en $n$ el resultado $\frac{3n(n+1)}{2}-3n+a_{n+1}$ (con $a_{n+1}$ el sumando evaluado en $n+1$).
- Verificador: `equivalente-expr`. Firmas de error de este ejemplo: `sin-termino-nuevo`, `termino-viejo`, `n-sin-cambiar`.
- Explicación: La expresión pedida es $\frac{3\left(n+1\right)\cdot \left(n+1+1\right)}{2}+-3\cdot \left(n+1\right)$.

### `w1.n6.base-menor`

- Familia: aplicacion; habilidades: 1.6.base; requiere: nada.
- Ejemplo de enunciado: Se quiere probar por inducción que $3^n>n^3$ para todo $n\ge n_0$. ¿Cuál es el menor $n_0\ge 1$ a partir del cual la desigualdad se cumple siempre (y que sirve de caso base)?
- Verificador: `entero`. Firmas de error de este ejemplo: `uno-menos`, `uno-mas`.
- Explicación: El primero que la cumple, y desde el que ya no falla, es $n_0=4$.

### `w1.n6.divisibilidad-inductiva`

- Familia: aplicacion; habilidades: 1.6.divisibilidad, 1.6.paso-inductivo; requiere: nada.
- Ejemplo de enunciado: Para probar por inducción que $4^n-1$ es divisible por un cierto entero fijo $d>1$, el paso inductivo escribe $4^{n+1}-1=4\,(4^n-1)+c$. ¿Cuánto vale $c$?
- Verificador: `entero`. Firmas de error de este ejemplo: `a`, `uno`, `a-mas-uno`.
- Explicación: Se obtiene $c=3$.

### `w1.n6.formula-cerrada`

- Familia: aplicacion; habilidades: 1.6.formula-cerrada, 1.6.sumas; requiere: nada.
- Ejemplo de enunciado: Halla una fórmula en $n$ para $S(n)=\displaystyle\sum_{k=1}^{n}(5k+4)$.
- Verificador: `equivalente-expr`. Firmas de error de este ejemplo: `sin-dividir`, `constante-una-vez`, `n-en-vez-de-n+1`.
- Explicación: Una forma es $S(n)=\frac{5n\cdot \left(n+1\right)}{2}+4n$.

