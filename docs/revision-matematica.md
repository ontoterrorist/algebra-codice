# Revisión matemática — Fase 1 (nivel 1.1, lógica proposicional)

Generado por `node tools/auditar.js`. Las pruebas automáticas comprueban la **consistencia** (grafo sin ciclos, orden de referencia válido, solo se citan teoremas previos, los verificadores aceptan la solución de referencia y rechazan las firmas de error). **No certifican que el contenido matemático sea correcto**: eso es lo que te pido revisar aquí.

Convenciones: ℕ incluye el 0; las hipótesis son siempre explícitas; en lógica proposicional se asumen las tablas de verdad de ¬, ∧, ∨ y las propiedades base citadas (conmutatividad, doble negación, transitividad de ≡, prueba condicional, división por casos).

## Dudas
<!-- DUDAS:INICIO -->




1. **`b.casos` y `d.conectivos` como justificaciones.** «Dividir en casos exhaustivos» y «tablas de ¬, ∧, ∨» las trato como base sin demostrar. Es lo habitual en un primer curso, pero decide qué se puede citar sin pasar por el Códice.
2. **Silogismo hipotético (`t.silogismo-hipotetico`).** Está enunciado semánticamente («si P→Q y Q→R son verdaderas, P→R lo es»), no como equivalencia ni como tautología `((P→Q)∧(Q→R))→(P→R)`. La demostración usa la prueba condicional (`b.prueba-condicional`) y el valor de → (`d.implicacion-valor`). Dime si prefieres la versión como tautología.
3. **Estrategias marcadas como válidas.** Para De Morgan acepto «tabla», «casos» y «suponer una fila donde difieren y llegar a contradicción» como tres formas legítimas; marco como inválidas «un solo ejemplo» e «inducción sobre el número de letras» (esta última no es incorrecta en abstracto, solo no aplica con dos letras). Revisa si la nota de cada una te convence.
4. **Contrapositiva por cadena.** La cadena usa `d.implicacion`, conmutatividad y doble negación. Es una prueba algebraica correcta, pero depende de que `P→Q ≡ ¬P∨Q` se acepte como *definición*; en otros textos es un teorema que se prueba con tabla.
5. **Distributividad.** Se prueba por casos sobre P (dos casos en vez de ocho filas). La línea L4 usa «transitividad de ≡» para decir que dos fórmulas que valen lo mismo que Q∘R coinciden: es transitividad de la igualdad de valores, no de ≡ entre fórmulas. Lo dejo así por simplicidad; si te molesta, cambio la justificación a una definición de ≡.
6. **Reescritura paso a paso.** El generador `simplificar-pasos` solo permite `neg-implicacion` si ya está en el Códice, pero siempre permite De Morgan (por eso exige `t.demorgan-prop`). La ley «definición de ↔» se ofrece sin que la lección la explique con detalle.
7. **Ejemplos con letras minúsculas** (p, q, r) como nombres de proposiciones: la sintaxis del campo de respuesta distingue mayúsculas y minúsculas; no hay conflicto con variables de otros mundos porque aquí no hay álgebra.


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

