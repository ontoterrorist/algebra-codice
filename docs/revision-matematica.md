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


**Nuevas, fases 3 a 8 (Mundos 2 a 8; todo es obra mía y espera tu revisión).**

11. **Todo cálculo es sobre ℚ.** Los espacios vectoriales, las matrices y los valores propios se calculan con racionales; los enunciados dicen «sobre ℝ» o «ℝⁿ» como pedía el diseño (§3.5). Los generadores solo producen matrices con valores propios **enteros** (y racionales en las simétricas); el ejemplo del giro de 90° aparece solo como caso sin valores propios reales.
12. **Determinantes: casos 2×2 y triangulares.** El producto `det(AB)=det A det B`, el criterio de invertibilidad por `det≠0`, la regla de Cramer, la invariancia por semejanza y el teorema espectral están **demostrados solo para 2×2** (`t.det-producto-2x2`, `t.det-invertible-2x2`, `t.cramer-2x2`, `t.det-semejantes-2x2`, `t.espectral-2x2`). Para n×n el juego usa el determinante como cálculo (Sarrus, cofactores, escalonamiento), pero no demuestra que sea multiplicativo ni que decida la invertibilidad; por eso `t.propio-nucleo` usa `t.invertible-equivalencias` (rango) en lugar de `det(A−λI)=0` en general.
13. **Rango: filas y columnas.** El rango se define como número de pivotes de la forma reducida. Nunca se enuncia «rango por filas = rango por columnas». En `t.markov-estocastica` se pasa de «las filas de P−I son dependientes» a «P−I no es invertible» con operaciones elementales (aparece una fila de ceros), que es correcto pero no es una consecuencia literal de `t.invertible-equivalencias` (que habla de columnas).
14. **Base y dimensión.** `t.rango-nulidad` usa «una lista independiente se extiende a una base» y la citamos a través de `t.agregar-independiente` (agregar un vector fuera del generado); la extensión repetida hasta llegar a un generador es un argumento por iteración que no queda como teorema aparte. `t.mas-que-generadores` se prueba escribiendo cada vector en función de los generadores y aplicando `t.homogeneo-libres` (correcto).
15. **Gram-Schmidt y Cauchy-Schwarz.** `t.gram-schmidt` está probado por inducción de forma esquemática (ortogonalidad con `t.proyeccion-ortogonal`, no nulidad con `t.agregar-independiente`, mismo generado por diferencia en el generado anterior). `t.cauchy-schwarz` trata aparte `v=0` y deduce `Δ≤0` de que la cuadrática `q(t)=|u−tv|²` no puede tomar valores negativos (por la fórmula cuadrática); es la prueba clásica pero breve.
16. **Gram-Schmidt sin normalizar.** Para conservar los racionales se produce una base **ortogonal**, no ortonormal; los enunciados lo dicen. Las matrices ortogonales no aparecen.
17. **`t.cubica-irreducible` solo para grados 2 y 3.** El nombre sugiere cúbicas, pero el enunciado cubre ambos grados (en grado 4 el juego solo decide con el programa `poly.js`, no con un teorema). Las factorizaciones completas sobre ℚ se restringen a grados ≤ 5 con factores cuadráticos irreducibles verificados por código.
18. **Convenciones.** `S∘T` actúa primero con T; las matrices estocásticas son **por columnas** (la columna j es el origen j); `P_{B→C}` tiene por columnas `[b_j]_C`; en `S_n` se compone de derecha a izquierda y se escribe en notación de una línea. Cualquier cambio de convención es una decisión tuya.
19. **Jefes 3 a 8.** Cada demostración de jefe cita al menos dos teoremas de niveles anteriores (lo comprueba `tools/test.js`). Algunas son más cortas que las del jefe 2 porque el teorema que se aplica ya contiene la parte difícil (por ejemplo, J8 prueba el pequeño teorema de Fermat desde Lagrange, y la unidad `ℤₚ^×` se identifica con las clases no nulas gracias a `t.zn-cuerpo`).
20. **Estrategias de los jefes.** Como en el Mundo 1, la elección de «herramienta más adecuada» es subjetiva; incluí solo enunciados donde una herramienta es claramente la natural.
21. **Distractores de las demostraciones.** Los «errores típicos» de cada demostración (`err`) y las estrategias no válidas son deliberadamente verosímiles; si alguno te parece una prueba válida, avísame para moverlo a «válida».

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
- `b.entero-no-nulo` (propiedad-base): Un entero distinto de 0 tiene valor absoluto ≥ 1
- `d.division-euclidiana` (definicion): División con resto: a = bq + r con 0 ≤ r < b
- `d.mcd` (definicion): mcd(a,b): el mayor entero que divide a ambos
- `d.congruencia` (definicion): a ≡ b (mod n) significa n | a − b
- `d.primo` (definicion): Primo: entero p > 1 cuyos únicos divisores positivos son 1 y p
- `b.coprimo-producto` (propiedad-base): Si a y b son coprimos con n, su producto ab también es coprimo con n
- `b.palomar` (propiedad-base): Si p−1 valores distintos están entre p−1 posibles, aparecen todos
- `d.conjugado` (definicion): Conjugado: conj(a+bi) = a − bi
- `d.modulo` (definicion): Módulo: |a+bi|² = a² + b² = z·conj(z)
- `d.polar` (definicion): Forma polar: z = r(cos θ + i sen θ) con r = |z|
- `b.trig` (propiedad-base): cos(θ+φ) = cos θ cos φ − sen θ sen φ; sen(θ+φ) = sen θ cos φ + cos θ sen φ
- `d.inverso-mult` (definicion): Inverso multiplicativo: w es inverso de z si zw = 1
- `b.angulos` (propiedad-base): Dos ángulos tienen el mismo seno y coseno si y solo si difieren en un múltiplo de 2π
- `d.grado` (definicion): Grado: el mayor exponente con coeficiente no nulo
- `b.sin-divisores-cero` (propiedad-base): En ℚ, ℝ y ℂ: si ab = 0 entonces a = 0 o b = 0
- `d.division-polinomios` (definicion): División de polinomios: p = dq + r con grado de r menor que el de d
- `d.raiz` (definicion): Raíz de p: un número a con p(a) = 0
- `b.derivada-producto` (propiedad-base): Regla del producto para derivadas: (fg)′ = f′g + fg′
- `d.irreducible` (definicion): Polinomio irreducible: no constante y no es producto de dos polinomios de grado menor
- `d.discriminante` (definicion): Discriminante de ax² + bx + c: Δ = b² − 4ac
- `d.matriz-producto` (definicion): Producto de matrices: (AB)ᵢⱼ = Σₖ aᵢₖ bₖⱼ
- `d.matriz-transpuesta` (definicion): Transpuesta: (Aᵀ)ᵢⱼ = Aⱼᵢ
- `d.matriz-inversa` (definicion): Inversa de A: una matriz B con AB = BA = I
- `b.suma-finita` (propiedad-base): Las sumas finitas se pueden reordenar y distribuir
- `d.operacion-elemental` (definicion): Operaciones elementales por filas: intercambiar dos filas, multiplicar una por c ≠ 0, sumar a una un múltiplo de otra
- `d.sistema-lineal` (definicion): Sistema lineal Ax = b; su conjunto de soluciones
- `d.escalonada` (definicion): Forma escalonada reducida: pivotes 1 con ceros arriba y abajo
- `d.rango` (definicion): Rango de A: número de pivotes de su forma escalonada reducida
- `d.invertible` (definicion): A es invertible si existe B con AB = BA = I
- `d.determinante` (definicion): Determinante: det A = Σᵢ (−1)^{i+1} aᵢ₁ det(Mᵢ₁), desarrollo por la primera columna
- `d.cofactor` (definicion): Cofactor Cᵢⱼ = (−1)^{i+j} det(Mᵢⱼ), con Mᵢⱼ la submatriz sin la fila i y la columna j
- `d.espacio-vectorial` (definicion): Espacio vectorial: conjunto con suma y producto por escalares que cumplen los axiomas (asociatividad, conmutatividad, cero, opuesto, distributividades, neutro del escalar 1)
- `d.subespacio` (definicion): Subespacio: subconjunto W de V que es espacio vectorial con las mismas operaciones
- `b.axiomas-heredados` (propiedad-base): Los axiomas de identidades (asociatividad, conmutatividad, distributividad) valen en W porque valen en V
- `d.nucleo` (definicion): Núcleo de A: {x : Ax = 0}
- `d.combinacion-lineal` (definicion): Combinación lineal de v₁,…,vₖ: c₁v₁ + ⋯ + cₖvₖ
- `d.generado` (definicion): Generado de S: el conjunto de todas las combinaciones lineales de elementos de S
- `d.independencia` (definicion): v₁,…,vₖ son independientes si c₁v₁ + ⋯ + cₖvₖ = 0 solo se da con todos los cᵢ = 0
- `d.base` (definicion): Base: lista de vectores independiente que genera el espacio
- `d.dimension` (definicion): Dimensión: número de vectores de una base
- `d.coordenadas` (definicion): Coordenadas de v respecto de la base B = (b₁,…,bₙ): el único (x₁,…,xₙ) con v = x₁b₁ + ⋯ + xₙbₙ
- `d.matriz-cambio` (definicion): Matriz de cambio de base de B a C: columnas [b₁]_C, …, [bₙ]_C
- `d.lineal` (definicion): Transformación lineal: T(u + v) = T(u) + T(v) y T(cv) = cT(v)
- `d.composicion-fun` (definicion): (S∘T)(v) = S(T(v))
- `d.nucleo-T` (definicion): Núcleo de T: ker T = {v : T(v) = 0}
- `d.imagen-T` (definicion): Imagen de T: im T = {T(v) : v ∈ V}
- `d.inyectiva-lineal` (definicion): Inyectiva: T(u) = T(v) implica u = v. Sobreyectiva: im T = W
- `d.matriz-T` (definicion): Matriz de T respecto de las bases B y C: columnas [T(bⱼ)]_C; para las canónicas, columnas T(eⱼ)
- `d.semejantes` (definicion): A y B son semejantes si B = P⁻¹AP para alguna P invertible
- `d.traza` (definicion): Traza: tr A = Σ aᵢᵢ (suma de la diagonal)
- `d.propio` (definicion): Valor propio λ de A: existe v ≠ 0 con Av = λv; v es un vector propio
- `d.espacio-propio` (definicion): Espacio propio E_λ = ker(A − λI)
- `d.diagonalizable` (definicion): A es diagonalizable si A = PDP⁻¹ con D diagonal y P invertible
- `d.mult-geometrica` (definicion): Multiplicidad geométrica de λ: dim E_λ; algebraica: multiplicidad como raíz del polinomio característico
- `d.producto-punto` (definicion): Producto punto: u·v = Σ uᵢvᵢ; norma |u|² = u·u; u ⟂ v si u·v = 0
- `d.proyeccion` (definicion): Proyección de v sobre u ≠ 0: proy_u(v) = ((v·u)/(u·u))u
- `d.simetrica` (definicion): Matriz simétrica: A = Aᵀ
- `d.estocastica` (definicion): Matriz estocástica por columnas: entradas ≥ 0 y cada columna suma 1; vector de probabilidad: entradas ≥ 0 que suman 1
- `d.grupo` (definicion): Grupo (G,∗): cerrado, asociativo, con elemento neutro e y con inverso a⁻¹ para cada a
- `d.unidades-zn` (definicion): ℤₙ^×: clases de ℤₙ con inverso multiplicativo (coprimas con n)
- `d.permutacion` (definicion): S_n: permutaciones de {1,…,n} con la composición
- `d.subgrupo` (definicion): Subgrupo: subconjunto no vacío H ⊆ G que es grupo con la misma operación
- `d.orden-elemento` (definicion): Orden de g: el menor m ≥ 1 con gᵐ = e; ⟨g⟩ = {e, g, …, gᵐ⁻¹}
- `d.clase-lateral` (definicion): Clase lateral aH = {ah : h ∈ H}; índice [G:H] = número de clases laterales
- `d.homomorfismo` (definicion): Homomorfismo: φ(a∗b) = φ(a)∘φ(b); núcleo ker φ = {a : φ(a) = e}; imagen im φ = φ(G)
- `d.biyeccion-clases` (definicion): Las clases laterales de ker φ se corresponden uno a uno con los elementos de im φ
- `d.anillo` (definicion): Anillo: (A,+) grupo abeliano, producto asociativo y distributivo; con unidad 1
- `d.divisor-cero` (definicion): Divisor de cero: a ≠ 0 con ab = 0 para algún b ≠ 0
- `d.cuerpo` (definicion): Cuerpo: anillo conmutativo con 1 ≠ 0 donde todo elemento no nulo tiene inverso multiplicativo
- `d.dominio` (definicion): Dominio de integridad: anillo conmutativo con 1 ≠ 0 y sin divisores de cero

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

### Divisibilidad de combinaciones — `t.div-combinacion` (nivel 2.1)

**Enunciado.** Si $a\mid b$ y $a\mid c$, entonces $a\mid bx+cy$ para todos $x,y\in\mathbb{Z}$.

**Hipótesis.** $a,b,c\in\mathbb{Z}$ con $a\mid b$ y $a\mid c$; $x,v\in\mathbb{Z}$ son arbitrarios

**Depende de.** nada previo (solo definiciones y propiedades base)

**Demostración (grafo de dependencias entre líneas).** Cualquier orden que respete las flechas se acepta.

- **L1** ← ∅ — Por hipótesis existen $k,l\in\mathbb{Z}$ con $b=ak$ y $c=al$. _[Divisibilidad: n | z si existe k entero con z = nk]_
- **L2** ← L1 — Entonces $bx+cv=akx+alv=$ $a(kx+lv)$. _[Álgebra de los números: operar, despejar, sustituir]_
- **L3** ← L2 — Como $kx+lv\in\mathbb{Z}$, por la definición de divisibilidad, $a\mid bx+cv$. ∎ _[Divisibilidad: n | z si existe k entero con z = nk]_

**Líneas distractoras (falsas a propósito).**

- Como $a\mid b$ y $a\mid c$, también $a\mid b+c$; eso basta. — _falla:_ solo cubre $x=y=1$
- Tomamos $a=3$, $b=6$, $c=9$: $3\mid 6x+9y$; luego vale siempre. — _falla:_ un ejemplo no prueba el caso general

**Errores para «cazar el error».**

- Sustituye **L2**: Entonces $bx+cv=a(k+l)xv$. — _diagnóstico:_ Error de cálculo: el resultado de la línea no sale de la anterior
- Sustituye **L3**: Como $k,l\in\mathbb{Z}$, $a\mid bx+cv$. ∎ — _diagnóstico:_ Paso no justificado: se afirma sin razón

**Estrategias.**

- ✓ válida: Escribir $b=ak$, $c=al$ y sacar factor común $a$ — Es la prueba estándar.
- ✗ no sirve: Verificar un ejemplo concreto — Un ejemplo ilustra, pero no prueba un enunciado general.
- ✗ no sirve: Suponer lo que se quiere probar — Eso es un argumento circular.
- ✗ no sirve: Apoyarse en un dibujo o en la intuición — Ayuda a entender, pero no es una demostración.

### Transitividad de la divisibilidad — `t.div-transitiva` (nivel 2.1)

**Enunciado.** Si $a\mid b$ y $b\mid c$, entonces $a\mid c$.

**Hipótesis.** $d,m,n\in\mathbb{Z}$; $d\mid m$ y $m\mid n$

**Depende de.** nada previo (solo definiciones y propiedades base)

**Demostración (grafo de dependencias entre líneas).** Cualquier orden que respete las flechas se acepta.

- **L1** ← ∅ — Por hipótesis existen $k,l\in\mathbb{Z}$ con $m=dk$ y $n=ml$. _[Divisibilidad: n | z si existe k entero con z = nk]_
- **L2** ← L1 — Sustituyendo, $n=ml=(dk)l=$ $d(kl)$. _[Álgebra de los números: operar, despejar, sustituir]_
- **L3** ← L2 — Como $kl\in\mathbb{Z}$, $d\mid n$. ∎ _[Los enteros son cerrados bajo suma, resta y producto]_

**Líneas distractoras (falsas a propósito).**

- Como $d\mid m$ y $m\mid n$, entonces $d\le m\le n$ y por eso $d\mid n$. — _falla:_ ser menor no implica dividir
- Con $d=2$, $m=4$, $n=8$ se cumple; luego vale siempre. — _falla:_ un ejemplo no prueba el caso general

**Errores para «cazar el error».**

- Sustituye **L2**: Sustituyendo, $n=ml=(d+k)l=dl+kl$. — _diagnóstico:_ Error de cálculo: el resultado de la línea no sale de la anterior
- Sustituye **L3**: Como $k+l\in\mathbb{Z}$, $d\mid n$. ∎ — _diagnóstico:_ Error de cálculo: el resultado de la línea no sale de la anterior

**Estrategias.**

- ✓ válida: Escribir $b=ak$, $c=bl$ y sustituir — Es la prueba estándar.
- ✗ no sirve: Verificar un ejemplo concreto — Un ejemplo ilustra, pero no prueba un enunciado general.
- ✗ no sirve: Suponer lo que se quiere probar — Eso es un argumento circular.
- ✗ no sirve: Apoyarse en un dibujo o en la intuición — Ayuda a entender, pero no es una demostración.

### Cota del divisor — `t.div-cota` (nivel 2.1)

**Enunciado.** Si $a\mid b$ y $b\neq 0$, entonces $|a|\le|b|$.

**Hipótesis.** $a,b\in\mathbb{Z}$, $b\neq 0$; $a\mid b$

**Depende de.** nada previo (solo definiciones y propiedades base)

**Demostración (grafo de dependencias entre líneas).** Cualquier orden que respete las flechas se acepta.

- **L1** ← ∅ — Por hipótesis existe $k\in\mathbb{Z}$ con $b=ak$. _[Divisibilidad: n | z si existe k entero con z = nk]_
- **L2** ← L1 — Como $b\neq 0$, $k\neq 0$. _[Álgebra de los números: operar, despejar, sustituir]_
- **L3** ← L2 — Un entero distinto de $0$ cumple $|k|\ge 1$. _[Un entero distinto de 0 tiene valor absoluto ≥ 1]_
- **L4** ← L1, L3 — Luego $|b|=|a|\,|k|\ge|a|\cdot 1=|a|$. ∎ _[Orden de los números: sumar lo mismo o multiplicar por un positivo conserva la desigualdad]_

**Líneas distractoras (falsas a propósito).**

- Como $a\mid b$, entonces $a\le b$. — _falla:_ falla con números negativos: hay que usar valores absolutos
- Con $a=3$, $b=6$ se cumple $3\le 6$; luego vale siempre. — _falla:_ un ejemplo no prueba el caso general

**Errores para «cazar el error».**

- Sustituye **L2**: Como $b\neq 0$, $k=0$. — _diagnóstico:_ La conclusión no se sigue de lo anterior (falacia)
- Sustituye **L4**: Luego $|b|=|a|\,|k|\le|a|$. ∎ — _diagnóstico:_ La conclusión no se sigue de lo anterior (falacia)

**Estrategias.**

- ✓ válida: Escribir $b=ak$ y acotar $|k|\ge 1$ — Es la prueba estándar.
- ✓ válida: Suponer $|a|>|b|$ y concluir que $k=0$ — Equivale a la anterior: $|b|=|a||k|<|a|$ obliga a $k=0$.
- ✗ no sirve: Verificar un ejemplo concreto — Un ejemplo ilustra, pero no prueba un enunciado general.
- ✗ no sirve: Suponer lo que se quiere probar — Eso es un argumento circular.

### Antisimetría de la divisibilidad — `t.div-antisimetria` (nivel 2.1)

**Enunciado.** Si $a\mid b$, $b\mid a$ y $a,b\neq 0$, entonces $|a|=|b|$.

**Hipótesis.** $m,n\in\mathbb{Z}\setminus\{0\}$; $m\mid n$ y $n\mid m$; Puedes citar la cota del divisor

**Depende de.** `t.div-cota`

**Demostración (grafo de dependencias entre líneas).** Cualquier orden que respete las flechas se acepta.

- **L1** ← ∅ — Como $m\mid n$ y $n\neq 0$, por la cota del divisor, $|m|\le|n|$. _[Cota del divisor]_
- **L2** ← ∅ — Como $n\mid m$ y $m\neq 0$, por la cota del divisor, $|n|\le|m|$. _[Cota del divisor]_
- **L3** ← L1, L2 — De $|m|\le|n|$ y $|n|\le|m|$ se sigue $|m|=|n|$. ∎ _[Orden de los números: sumar lo mismo o multiplicar por un positivo conserva la desigualdad]_

**Líneas distractoras (falsas a propósito).**

- Como $m\mid n$ y $n\mid m$, entonces $m=n$. — _falla:_ también puede ser $a=-b$
- Con $m=3$ y $n=3$ se cumple; luego vale siempre. — _falla:_ un ejemplo no prueba el caso general

**Errores para «cazar el error».**

- Sustituye **L2**: Como $n\mid m$, por la cota del divisor, $|m|\le|n|$. — _diagnóstico:_ La conclusión no se sigue de lo anterior (falacia)
- Sustituye **L3**: De $|m|\le|n|$ y $|n|\le|m|$ se sigue $m=n$. ∎ — _diagnóstico:_ La conclusión no se sigue de lo anterior (falacia)

**Estrategias.**

- ✓ válida: Aplicar la cota del divisor en los dos sentidos — Es la prueba más corta.
- ✓ válida: Escribir $b=ak$, $a=bl$ y concluir $kl=1$ — También funciona: $kl=1$ obliga a $k=\pm 1$.
- ✗ no sirve: Verificar un ejemplo concreto — Un ejemplo ilustra, pero no prueba un enunciado general.
- ✗ no sirve: Suponer lo que se quiere probar — Eso es un argumento circular.

### Algoritmo de la división — `t.algoritmo-division` (nivel 2.1)

**Enunciado.** Para $a\in\mathbb{Z}$ y $b>0$ existen $q,r$ únicos con $a=bq+r$ y $0\le r<b$.

**Hipótesis.** $a\in\mathbb{Z}$, $b\in\mathbb{Z}$, $b>0$; Puedes citar el buen orden de $\mathbb{N}$ y la cota del divisor

**Depende de.** `t.buen-orden`, `t.div-cota`

**Demostración (grafo de dependencias entre líneas).** Cualquier orden que respete las flechas se acepta.

- **L1** ← ∅ — Sea $S=\{a-bt\ :\ t\in\mathbb{Z},\ a-bt\ge 0\}\subseteq\mathbb{N}$. _[División con resto: a = bq + r con 0 ≤ r < b]_
- **L2** ← L1 — $S\neq\varnothing$: con $t=-|a|$ se tiene $a+b|a|\ge a+|a|\ge 0$. _[Orden de los números: sumar lo mismo o multiplicar por un positivo conserva la desigualdad]_
- **L3** ← L2 — Por el buen orden, $S$ tiene un mínimo $r=a-bq$ para algún $q\in\mathbb{Z}$; así $a=bq+r$ y $r\ge 0$. _[Principio del buen orden]_
- **L4** ← L3 — Si fuera $r\ge b$, entonces $r-b=a-b(q+1)\in S$ y sería menor que $r$, contra la minimalidad. Luego $r<b$ (existencia). _[Reducción al absurdo: si suponer lo contrario lleva a una contradicción, lo supuesto es falso]_
- **L5** ← L4 — Unicidad: si $a=bq+r=bq'+r'$ con $0\le r,r'<b$, entonces $b\mid r-r'$. _[Divisibilidad: n | z si existe k entero con z = nk]_
- **L6** ← L5 — Como $|r-r'|<b$, la cota del divisor obliga a $r-r'=0$; luego $r=r'$ y, cancelando, $q=q'$. ∎ _[Cota del divisor]_

**Líneas distractoras (falsas a propósito).**

- Dividimos $a$ entre $b$ con calculadora y redondeamos: eso da $q$ y $r$. — _falla:_ la demostración debe valer para todos los enteros, no para un cálculo concreto
- Como $r<b$, el resto es único. — _falla:_ hay que probar la unicidad con la cota del divisor

**Errores para «cazar el error».**

- Sustituye **L2**: $S\neq\varnothing$: con $t=0$ se tiene $a\in S$. — _diagnóstico:_ Caso omitido: falta una posibilidad
- Sustituye **L4**: Si fuera $r\ge b$, entonces $r-b\in S$ y sería mayor que $r$. — _diagnóstico:_ Error de cálculo: el resultado de la línea no sale de la anterior
- Sustituye **L6**: Como $|r-r'|<b$, obtenemos $r=r'$ por simetría. ∎ — _diagnóstico:_ Paso no justificado: se afirma sin razón

**Estrategias.**

- ✓ válida: Tomar el menor elemento no negativo de $\{a-bt\}$ (buen orden) — Es la prueba estándar.
- ✓ válida: Inducción sobre $a\ge 0$ y tratar $a<0$ aparte — Funciona para $a\ge 0$ restando $b$ repetidamente; hay que añadir el caso negativo.
- ✗ no sirve: Verificar un ejemplo concreto — Un ejemplo ilustra, pero no prueba un enunciado general.
- ✗ no sirve: Suponer lo que se quiere probar — Eso es un argumento circular.

### Paso del algoritmo de Euclides — `t.mcd-euclides` (nivel 2.2)

**Enunciado.** Si $a=bq+r$, entonces $\operatorname{mcd}(a,b)=\operatorname{mcd}(b,r)$.

**Hipótesis.** $a,b,k,s\in\mathbb{Z}$ con $a=bk+s$; Puedes citar la divisibilidad de combinaciones

**Depende de.** `t.div-combinacion`

**Demostración (grafo de dependencias entre líneas).** Cualquier orden que respete las flechas se acepta.

- **L1** ← ∅ — Sea $d$ un divisor común de $a$ y $b$. Como $s=a\cdot 1+b\cdot(-k)$, por la divisibilidad de combinaciones $d\mid s$; así $d$ divide a $b$ y a $s$. _[Divisibilidad de combinaciones]_
- **L2** ← ∅ — Recíprocamente, si $d$ divide a $b$ y a $s$, como $a=b\cdot k+s\cdot 1$, por la divisibilidad de combinaciones, $d\mid a$. _[Divisibilidad de combinaciones]_
- **L3** ← L1, L2 — Los pares $(a,b)$ y $(b,s)$ tienen los mismos divisores comunes; por tanto el mayor de ellos es el mismo: $\operatorname{mcd}(a,b)=\operatorname{mcd}(b,s)$. ∎ _[mcd(a,b): el mayor entero que divide a ambos]_

**Líneas distractoras (falsas a propósito).**

- Como $a>b>s$, el mcd de los mayores es mayor: $\operatorname{mcd}(a,b)>\operatorname{mcd}(b,s)$. — _falla:_ los mcd coinciden; el tamaño de los números no los cambia
- Con $a=12$, $b=8$, $s=4$ vale: $\operatorname{mcd}(12,8)=\operatorname{mcd}(8,4)$; luego siempre. — _falla:_ un ejemplo no prueba el resultado general

**Errores para «cazar el error».**

- Sustituye **L1**: Sea $d$ un divisor común de $a$ y $b$. Como $s=a+bk$, $d\mid s$. — _diagnóstico:_ Error de cálculo: el resultado de la línea no sale de la anterior
- Sustituye **L3**: Los pares tienen los mismos divisores comunes, luego $a=b$. ∎ — _diagnóstico:_ La conclusión no se sigue de lo anterior (falacia)

**Estrategias.**

- ✓ válida: Probar que los dos pares tienen los mismos divisores comunes — Es la prueba estándar.
- ✗ no sirve: Verificar un ejemplo concreto — Un ejemplo ilustra, pero no prueba un enunciado general.
- ✗ no sirve: Suponer lo que se quiere probar — Eso es un argumento circular.
- ✗ no sirve: Apoyarse en un dibujo o en la intuición — Ayuda a entender, pero no es una demostración.

### Identidad de Bézout — `t.bezout` (nivel 2.2)

**Enunciado.** Si $a,b$ no son ambos $0$, existen $x,y\in\mathbb{Z}$ con $\operatorname{mcd}(a,b)=ax+by$.

**Hipótesis.** $m,n\in\mathbb{Z}$ no ambos nulos; Puedes citar el buen orden, el algoritmo de la división y la divisibilidad de combinaciones

**Depende de.** `t.algoritmo-division`, `t.buen-orden`, `t.div-combinacion`

**Demostración (grafo de dependencias entre líneas).** Cualquier orden que respete las flechas se acepta.

- **L1** ← ∅ — Sea $S=\{mx+nt\ :\ x,t\in\mathbb{Z},\ mx+nt>0\}\subseteq\mathbb{N}$. Es no vacío: $m^2+n^2\in S$. _[Álgebra de los números: operar, despejar, sustituir]_
- **L2** ← L1 — Por el buen orden, $S$ tiene un mínimo $g=mx_0+nt_0$. _[Principio del buen orden]_
- **L3** ← L2 — Por el algoritmo de la división, $m=gq+r$ con $0\le r<g$; entonces $r=m(1-qx_0)+n(-qt_0)$ es una combinación de $m$ y $n$. _[Algoritmo de la división]_
- **L4** ← L3 — Si $r>0$ estaría en $S$ y sería menor que $g$: contradicción. Luego $r=0$ y $g\mid m$; igual se prueba $g\mid n$. _[Reducción al absurdo: si suponer lo contrario lleva a una contradicción, lo supuesto es falso]_
- **L5** ← L2, L4 — Si $c$ divide a $m$ y a $n$, por la divisibilidad de combinaciones $c\mid mx_0+nt_0=g$; así $g$ es el mayor divisor común: $g=\operatorname{mcd}(m,n)$. ∎ _[Divisibilidad de combinaciones]_

**Líneas distractoras (falsas a propósito).**

- Dividimos $m$ entre $n$ y tomamos el último resto no nulo; por eso es combinación. — _falla:_ eso describe el algoritmo, pero no prueba que el último resto sea combinación sin argumentar hacia atrás
- Con $m=12$, $n=18$ se tiene $6=12\cdot(-1)+18\cdot 1$; vale siempre. — _falla:_ un ejemplo no prueba el caso general

**Errores para «cazar el error».**

- Sustituye **L1**: Sea $S=\{mx+nt\}$ con $x,t\in\mathbb{Z}$. Es no vacío: $0\in S$. — _diagnóstico:_ La conclusión no se sigue de lo anterior (falacia)
- Sustituye **L4**: Si $r>0$ estaría en $S$ y sería mayor que $g$: contradicción. — _diagnóstico:_ Error de cálculo: el resultado de la línea no sale de la anterior
- Sustituye **L5**: Si $c$ divide a $m$ y a $n$, $c\mid g$; luego $c=g$. ∎ — _diagnóstico:_ La conclusión no se sigue de lo anterior (falacia)

**Estrategias.**

- ✓ válida: Tomar la menor combinación positiva y probar que divide a ambos — Es la prueba estándar.
- ✓ válida: Retroceder en el algoritmo de Euclides sustituyendo restos — Es constructiva y válida; se justifica por inducción sobre los pasos.
- ✗ no sirve: Verificar un ejemplo concreto — Un ejemplo ilustra, pero no prueba un enunciado general.
- ✗ no sirve: Suponer lo que se quiere probar — Eso es un argumento circular.

### Lema de Euclides — `t.lema-euclides` (nivel 2.2)

**Enunciado.** Si $\operatorname{mcd}(a,b)=1$ y $a\mid bc$, entonces $a\mid c$.

**Hipótesis.** $\operatorname{mcd}(a,b)=1$; $a\mid bc$

**Depende de.** `t.bezout`, `t.div-combinacion`

**Demostración (grafo de dependencias entre líneas).** Cualquier orden que respete las flechas se acepta.

- **L1** ← ∅ — Como $\operatorname{mcd}(a,b)=1$, por Bézout existen $s,t\in\mathbb{Z}$ con $as+bt=1$. _[Identidad de Bézout]_
- **L2** ← L1 — Multiplicando por $c$: $c=acs+bct$. _[Álgebra de los números: operar, despejar, sustituir]_
- **L3** ← L2 — Como $a\mid ac$ y $a\mid bc$, por la divisibilidad de combinaciones $a\mid acs+bct$. _[Divisibilidad de combinaciones]_
- **L4** ← L2, L3 — Por L2 y L3, $a\mid c$. ∎ _[Álgebra de los números: operar, despejar, sustituir]_

**Líneas distractoras (falsas a propósito).**

- Como $a\mid bc$, entonces $a\mid b$ o $a\mid c$. — _falla:_ falso si $a$ no es primo (p. ej. $6\mid 2\cdot 3$)
- Con $a=3$, $b=2$, $c=6$ se cumple; luego vale siempre. — _falla:_ un ejemplo no prueba el caso general

**Errores para «cazar el error».**

- Sustituye **L2**: Multiplicando por $c$: $c=as+bt$. — _diagnóstico:_ Error de cálculo: el resultado de la línea no sale de la anterior
- Sustituye **L3**: Como $a\mid ac$ y $a\mid c$, por la divisibilidad de combinaciones... — _diagnóstico:_ Argumento circular: usa lo que se quiere probar

**Estrategias.**

- ✓ válida: Escribir $1=ax+by$ y multiplicar por $c$ — Es la prueba estándar.
- ✗ no sirve: Verificar un ejemplo concreto — Un ejemplo ilustra, pero no prueba un enunciado general.
- ✗ no sirve: Suponer lo que se quiere probar — Eso es un argumento circular.
- ✗ no sirve: Apoyarse en un dibujo o en la intuición — Ayuda a entender, pero no es una demostración.

### Ecuación diofántica lineal — `t.diofantica` (nivel 2.2)

**Enunciado.** $ax+by=c$ tiene solución entera si y solo si $\operatorname{mcd}(a,b)\mid c$.

**Hipótesis.** $m,n,k\in\mathbb{Z}$ con $m,n$ no ambos nulos

**Depende de.** `t.bezout`, `t.div-combinacion`

**Demostración (grafo de dependencias entre líneas).** Cualquier orden que respete las flechas se acepta.

- **L1** ← ∅ — Sea $d=\operatorname{mcd}(m,n)$. Probamos las dos implicaciones. _[Para probar P ⟺ Q se prueban P ⇒ Q y Q ⇒ P]_
- **L2** ← L1 — (⇒) Si $ms_0+ny_0=k$, como $d\mid m$ y $d\mid n$, por la divisibilidad de combinaciones $d\mid k$. _[Divisibilidad de combinaciones]_
- **L3** ← L1 — (⇐) Si $d\mid k$, existe $k$ con $k=dk$; por Bézout, $d=ms_1+ny_1$. _[Identidad de Bézout]_
- **L4** ← L3 — Entonces $k=m(s_1k)+n(y_1k)$ y $(s_1k,y_1k)$ es una solución entera. _[Álgebra de los números: operar, despejar, sustituir]_
- **L5** ← L2, L4 — Se cumplen las dos implicaciones. ∎ _[Para probar P ⟺ Q se prueban P ⇒ Q y Q ⇒ P]_

**Líneas distractoras (falsas a propósito).**

- Si $k$ es mayor que $m$ y $n$, la ecuación siempre tiene solución. — _falla:_ falso: $2x+4y=3$ no tiene solución
- Resolvemos $6x+9y=15$ por tanteo y encontramos $(−1,\,3)$; luego vale siempre. — _falla:_ un ejemplo no prueba el criterio

**Errores para «cazar el error».**

- Sustituye **L2**: (⇒) ... como $d\mid k$ por definición, $d\mid ms_0+ny_0$. — _diagnóstico:_ Argumento circular: usa lo que se quiere probar
- Sustituye **L4**: Entonces $k=ms_1+ny_1$ y $(s_1,y_1)$ es solución. — _diagnóstico:_ Error de cálculo: el resultado de la línea no sale de la anterior

**Estrategias.**

- ✓ válida: (⇒) divisibilidad de combinaciones y (⇐) Bézout multiplicado por el cociente — Es la prueba estándar.
- ✗ no sirve: Verificar un ejemplo concreto — Un ejemplo ilustra, pero no prueba un enunciado general.
- ✗ no sirve: Suponer lo que se quiere probar — Eso es un argumento circular.
- ✗ no sirve: Apoyarse en un dibujo o en la intuición — Ayuda a entender, pero no es una demostración.

### La congruencia es de equivalencia — `t.cong-equivalencia` (nivel 2.3)

**Enunciado.** $a\equiv b\pmod n$ es reflexiva, simétrica y transitiva en $\mathbb{Z}$.

**Hipótesis.** $m\ge 1$ es un entero; Puedes citar que «$a\sim b\iff n\mid a-b$ es de equivalencia»

**Depende de.** `t.mod-equivalencia`

**Demostración (grafo de dependencias entre líneas).** Cualquier orden que respete las flechas se acepta.

- **L1** ← ∅ — Por definición, $a\equiv b\pmod m$ significa $m\mid a-b$. _[a ≡ b (mod n) significa n | a − b]_
- **L2** ← L1 — Esa es exactamente la relación $a\sim b\iff m\mid a-b$ del teorema de la congruencia como relación de equivalencia. _[La congruencia es de equivalencia]_
- **L3** ← L2 — Por ese teorema, la relación es reflexiva, simétrica y transitiva: es de equivalencia. ∎ _[Relación de equivalencia: reflexiva, simétrica y transitiva]_

**Líneas distractoras (falsas a propósito).**

- Como $a\equiv a$, $a\equiv b\Rightarrow b\equiv a$ y $a\equiv b$, $b\equiv c\Rightarrow a\equiv c$ se comprueban con $m=5$. — _falla:_ un valor de $n$ no prueba el caso general
- Es antisimétrica, así que también es de orden. — _falla:_ no es antisimétrica: $0\equiv n$ y $n\equiv 0$ con $0\neq n$

**Errores para «cazar el error».**

- Sustituye **L1**: Por definición, $a\equiv b\pmod m$ significa $a\mid m-b$. — _diagnóstico:_ Error de cálculo: el resultado de la línea no sale de la anterior
- Sustituye **L3**: Por ese teorema, la relación es reflexiva, antisimétrica y transitiva. ∎ — _diagnóstico:_ La conclusión no se sigue de lo anterior (falacia)

**Estrategias.**

- ✓ válida: Reducir al teorema de 1.3 con la misma relación — Aprovecha lo ya ganado.
- ✓ válida: Probar las tres propiedades a mano con $a-b=nk$ — Es la prueba original del teorema de 1.3.
- ✗ no sirve: Verificar un ejemplo concreto — Un ejemplo ilustra, pero no prueba un enunciado general.
- ✗ no sirve: Suponer lo que se quiere probar — Eso es un argumento circular.

### Congruencias y operaciones — `t.cong-operaciones` (nivel 2.3)

**Enunciado.** Si $a\equiv b$ y $c\equiv d\pmod n$, entonces $a+c\equiv b+d$ y $ac\equiv bd\pmod n$.

**Hipótesis.** $n\mid a-b$ y $n\mid c-d$; Puedes citar la divisibilidad de combinaciones

**Depende de.** `t.div-combinacion`

**Demostración (grafo de dependencias entre líneas).** Cualquier orden que respete las flechas se acepta.

- **L1** ← ∅ — Por hipótesis, $n\mid a-b$ y $n\mid c-d$. _[a ≡ b (mod n) significa n | a − b]_
- **L2** ← L1 — Suma: $(a+c)-(b+d)=(a-b)\cdot 1+(c-d)\cdot 1$; por la divisibilidad de combinaciones, $n$ lo divide. _[Divisibilidad de combinaciones]_
- **L3** ← L1 — Producto: $ac-bd=c(a-b)+b(c-d)$. _[Álgebra de los números: operar, despejar, sustituir]_
- **L4** ← L1, L3 — Por la divisibilidad de combinaciones (con coeficientes $c$ y $b$), $n\mid ac-bd$. ∎ _[Divisibilidad de combinaciones]_

**Líneas distractoras (falsas a propósito).**

- Con $n=5$, $a=7\equiv 2$ y $c=8\equiv 3$ se cumple $7\cdot 8\equiv 2\cdot 3$; luego vale siempre. — _falla:_ un ejemplo no prueba el caso general
- Como $a-b$ y $c-d$ son múltiplos de $n$, su cociente también. — _falla:_ el cociente de múltiplos no es necesariamente múltiplo

**Errores para «cazar el error».**

- Sustituye **L3**: Producto: $ac-bd=(a-b)(c-d)$. — _diagnóstico:_ Error de cálculo: el resultado de la línea no sale de la anterior
- Sustituye **L2**: Suma: $(a+c)-(b+d)=(a-b)-(c-d)$. — _diagnóstico:_ Error de cálculo: el resultado de la línea no sale de la anterior

**Estrategias.**

- ✓ válida: Usar $n\mid a-b$ y expresar cada diferencia como combinación — Es la prueba estándar.
- ✓ válida: Escribir $a=b+nk$, $c=d+nl$ y desarrollar — También funciona: $a+c=b+d+n(k+l)$ y $ac=bd+n(\cdots)$.
- ✗ no sirve: Verificar un ejemplo concreto — Un ejemplo ilustra, pero no prueba un enunciado general.
- ✗ no sirve: Suponer lo que se quiere probar — Eso es un argumento circular.

### Cancelación en congruencias — `t.cong-cancelacion` (nivel 2.3)

**Enunciado.** Si $ac\equiv bc\pmod n$ y $\operatorname{mcd}(c,n)=1$, entonces $a\equiv b\pmod n$.

**Hipótesis.** $m\mid xz-yz$; $\operatorname{mcd}(z,m)=1$

**Depende de.** `t.lema-euclides`

**Demostración (grafo de dependencias entre líneas).** Cualquier orden que respete las flechas se acepta.

- **L1** ← ∅ — Por hipótesis, $m\mid xz-yz=z(x-y)$. _[a ≡ b (mod n) significa n | a − b]_
- **L2** ← L1 — Como $\operatorname{mcd}(m,z)=1$ y $m\mid z(x-y)$, por el lema de Euclides, $m\mid x-y$. _[Lema de Euclides]_
- **L3** ← L2 — Es decir, $x\equiv y\pmod m$. ∎ _[a ≡ b (mod n) significa n | a − b]_

**Líneas distractoras (falsas a propósito).**

- Dividimos ambos lados entre $z$: $x\equiv y$. — _falla:_ dividir no siempre es válido en congruencias: hace falta que $c$ sea coprimo con $n$
- Con $m=7$, $z=3$: $3\cdot 5\equiv 3\cdot 12$ y $5\equiv 12$; luego vale siempre. — _falla:_ un ejemplo no prueba el caso general

**Errores para «cazar el error».**

- Sustituye **L2**: Como $m\mid z(x-y)$, entonces $m\mid z$ o $m\mid x-y$. — _diagnóstico:_ La conclusión no se sigue de lo anterior (falacia)
- Sustituye **L1**: Por hipótesis, $m\mid xz+yz$. — _diagnóstico:_ Error de cálculo: el resultado de la línea no sale de la anterior

**Estrategias.**

- ✓ válida: Aplicar el lema de Euclides a $n\mid c(a-b)$ — Es la prueba estándar.
- ✓ válida: Multiplicar por el inverso de $c$ módulo $n$ — Válida si se tiene el inverso modular; aquí se probó antes este resultado, que se usa para justificarlo.
- ✗ no sirve: Verificar un ejemplo concreto — Un ejemplo ilustra, pero no prueba un enunciado general.
- ✗ no sirve: Suponer lo que se quiere probar — Eso es un argumento circular.

### Inverso modular — `t.inverso-modular` (nivel 2.3)

**Enunciado.** Existe $x$ con $ax\equiv 1\pmod n$ si y solo si $\operatorname{mcd}(a,n)=1$.

**Hipótesis.** $a,n\in\mathbb{Z}$, $n\ge 1$

**Depende de.** `t.bezout`, `t.cong-operaciones`

**Demostración (grafo de dependencias entre líneas).** Cualquier orden que respete las flechas se acepta.

- **L1** ← ∅ — Probamos las dos implicaciones. _[Para probar P ⟺ Q se prueban P ⇒ Q y Q ⇒ P]_
- **L2** ← L1 — (⇐) Si $\operatorname{mcd}(a,n)=1$, por Bézout existen $v,y$ con $av+ny=1$. _[Identidad de Bézout]_
- **L3** ← L2 — Entonces $av=1-ny\equiv 1\pmod n$, pues $ny\equiv 0$ y las congruencias se pueden restar (compatibilidad con las operaciones). _[Congruencias y operaciones]_
- **L4** ← L1 — (⇒) Si $av\equiv 1\pmod n$, existe $k$ con $av-1=nk$, es decir, $av-nk=1$. _[a ≡ b (mod n) significa n | a − b]_
- **L5** ← L4 — Todo divisor común de $a$ y $n$ divide a $av-nk=1$ (divisibilidad de combinaciones); luego $\operatorname{mcd}(a,n)=1$. ∎ _[Divisibilidad de combinaciones]_

**Líneas distractoras (falsas a propósito).**

- Como $av\equiv 1$, entonces $v=1/a$. — _falla:_ en $\mathbb{Z}$ no se divide: hay que usar Bézout
- Probamos con $a=3$, $n=7$: existe $5$ con $3\cdot 5\equiv 1$; luego siempre. — _falla:_ un ejemplo no prueba el caso general

**Errores para «cazar el error».**

- Sustituye **L3**: Entonces $av=1-ny\equiv 1-y\pmod n$. — _diagnóstico:_ Error de cálculo: el resultado de la línea no sale de la anterior
- Sustituye **L5**: Todo divisor común de $a$ y $n$ divide a $av$; luego $\operatorname{mcd}=1$. ∎ — _diagnóstico:_ Paso no justificado: se afirma sin razón

**Estrategias.**

- ✓ válida: (⇐) Bézout y (⇒) divisibilidad de combinaciones — Es la prueba estándar.
- ✓ válida: Usar la cancelación y contar clases — Para $n$ pequeño se puede argumentar con un principio del palomar; la prueba por Bézout es más corta.
- ✗ no sirve: Verificar un ejemplo concreto — Un ejemplo ilustra, pero no prueba un enunciado general.
- ✗ no sirve: Suponer lo que se quiere probar — Eso es un argumento circular.

### Congruencia lineal — `t.cong-lineal` (nivel 2.3)

**Enunciado.** $ax\equiv b\pmod n$ tiene solución si y solo si $\operatorname{mcd}(a,n)\mid b$.

**Hipótesis.** $u,c,m\in\mathbb{Z}$, $m\ge 1$; Puedes citar las ecuaciones diofánticas

**Depende de.** `t.diofantica`, `t.cong-equivalencia`

**Demostración (grafo de dependencias entre líneas).** Cualquier orden que respete las flechas se acepta.

- **L1** ← ∅ — Por definición, $ux\equiv c\pmod m$ equivale a que exista $t$ con $ux-c=mt$, es decir, $ux+m(-t)=c$. _[a ≡ b (mod n) significa n | a − b]_
- **L2** ← L1 — Así, la congruencia tiene solución si y solo si la ecuación diofántica $ux+mt'=c$ la tiene. _[Para probar P ⟺ Q se prueban P ⇒ Q y Q ⇒ P]_
- **L3** ← L2 — Por el teorema de las ecuaciones diofánticas, eso ocurre si y solo si $\operatorname{mcd}(u,m)\mid c$. _[Ecuación diofántica lineal]_
- **L4** ← L3 — Además, si $x_0$ es solución, toda $x\equiv x_0\pmod m$ también lo es, por la transitividad de $\equiv$. ∎ _[La congruencia es de equivalencia]_

**Líneas distractoras (falsas a propósito).**

- Probamos con $u=4$, $m=6$, $c=2$: $x=2$ funciona; luego siempre hay solución. — _falla:_ un ejemplo no prueba el criterio (con $b=3$ no hay solución)
- Como $\operatorname{mcd}(u,m)\le u$, siempre divide a $c$. — _falla:_ no hay relación entre $a$ y $b$ que lo garantice

**Errores para «cazar el error».**

- Sustituye **L1**: Por definición, $ux\equiv c$ equivale a $ux+c=mt$. — _diagnóstico:_ Error de cálculo: el resultado de la línea no sale de la anterior
- Sustituye **L3**: Por el teorema de las ecuaciones diofánticas, eso ocurre si y solo si $\operatorname{mcd}(u,c)\mid m$. — _diagnóstico:_ Error de cálculo: el resultado de la línea no sale de la anterior

**Estrategias.**

- ✓ válida: Traducir a una ecuación diofántica y citar su teorema — Es la prueba más corta.
- ✓ válida: Usar Bézout directamente con $\operatorname{mcd}(a,n)$ — Equivale a reconstruir el teorema diofántico.
- ✗ no sirve: Verificar un ejemplo concreto — Un ejemplo ilustra, pero no prueba un enunciado general.
- ✗ no sirve: Suponer lo que se quiere probar — Eso es un argumento circular.

### Teorema chino del resto — `t.tcr` (nivel 2.4)

**Enunciado.** Si $\operatorname{mcd}(m,n)=1$, el sistema $x\equiv a\pmod m$, $x\equiv b\pmod n$ tiene solución, única módulo $mn$.

**Hipótesis.** $\operatorname{mcd}(m,n)=1$; $r,b\in\mathbb{Z}$

**Depende de.** `t.inverso-modular`, `t.cong-operaciones`, `t.lema-euclides`

**Demostración (grafo de dependencias entre líneas).** Cualquier orden que respete las flechas se acepta.

- **L1** ← ∅ — Existencia. Como $\operatorname{mcd}(m,n)=1$, existe $u$ con $mu\equiv 1\pmod n$ (inverso modular). _[Inverso modular]_
- **L2** ← L1 — Sea $z_0=r+m\,u\,(b-r)$. Difiere de $r$ en un múltiplo de $m$, así que $z_0\equiv r\pmod m$. _[a ≡ b (mod n) significa n | a − b]_
- **L3** ← L1 — Módulo $n$: $z_0\equiv r+(mu)(b-r)\equiv r+1\cdot(b-r)=$ b, por las operaciones con congruencias. _[Congruencias y operaciones]_
- **L4** ← ∅ — Unicidad. Si $z$ y $z'$ son soluciones, $m\mid z-z'$ y $n\mid z-z'$; escribimos $z-z'=mk$. _[a ≡ b (mod n) significa n | a − b]_
- **L5** ← L4 — Como $n\mid mk$ y $\operatorname{mcd}(n,m)=1$, por el lema de Euclides $n\mid k$; luego $mn\mid z-z'$. ∎ _[Lema de Euclides]_

**Líneas distractoras (falsas a propósito).**

- Resolvemos $z\equiv 2\pmod 3$, $z\equiv 3\pmod 4$ por tanteo: $x=11$; luego siempre hay solución. — _falla:_ un ejemplo no prueba el teorema
- Como $m$ y $n$ son coprimos, $z=r+b$ es solución. — _falla:_ sumar los restos no cumple las congruencias en general

**Errores para «cazar el error».**

- Sustituye **L2**: Sea $z_0=r+n\,u\,(b-r)$; entonces $z_0\equiv r\pmod m$. — _diagnóstico:_ Error de cálculo: el resultado de la línea no sale de la anterior
- Sustituye **L5**: Como $n\mid mk$, entonces $n\mid m$ o $n\mid k$. ∎ — _diagnóstico:_ La conclusión no se sigue de lo anterior (falacia)

**Estrategias.**

- ✓ válida: Construir la solución con el inverso de $m$ módulo $n$ y probar unicidad con el lema de Euclides — Es la prueba estándar.
- ✓ válida: Contar: las $mn$ clases se envían inyectivamente a pares de restos — También funciona: la inyectividad es la unicidad y el conteo da la existencia.
- ✗ no sirve: Verificar un ejemplo concreto — Un ejemplo ilustra, pero no prueba un enunciado general.
- ✗ no sirve: Suponer lo que se quiere probar — Eso es un argumento circular.

### Pequeño teorema de Fermat — `t.fermat` (nivel 2.4)

**Enunciado.** Si $p$ es primo y $p\nmid a$, entonces $a^{p-1}\equiv 1\pmod p$.

**Hipótesis.** $q$ es primo y $q\nmid b$; Puedes citar la cancelación, las operaciones con congruencias y el lema de Euclides

**Depende de.** `t.cong-cancelacion`, `t.cong-operaciones`, `t.lema-euclides`

**Demostración (grafo de dependencias entre líneas).** Cualquier orden que respete las flechas se acepta.

- **L1** ← ∅ — Consideramos los $q-1$ números $b,2b,\dots,(q-1)b$. _[Primo: entero p > 1 cuyos únicos divisores positivos son 1 y p]_
- **L2** ← L1 — Si $kb\equiv jb\pmod q$ con $1\le k,j\le q-1$, como $\operatorname{mcd}(b,q)=1$ la cancelación da $k\equiv j$, es decir $k=j$. _[Cancelación en congruencias]_
- **L3** ← L2 — Además ninguno es $\equiv 0$. Luego los $q-1$ restos son distintos y no nulos: son $1,2,\dots,q-1$ en algún orden (principio del palomar). _[Si p−1 valores distintos están entre p−1 posibles, aparecen todos]_
- **L4** ← L3 — Multiplicando todos: $b^{q-1}(q-1)!\equiv(q-1)!\pmod q$. _[Congruencias y operaciones]_
- **L5** ← L4 — $q\nmid(q-1)!$: si dividiera al producto dividiría a algún factor menor que $q$ (lema de Euclides), absurdo. Luego $\operatorname{mcd}((q-1)!,q)=1$. _[Lema de Euclides]_
- **L6** ← L4, L5 — Cancelando $(q-1)!$, $b^{q-1}\equiv 1\pmod q$. ∎ _[Cancelación en congruencias]_

**Líneas distractoras (falsas a propósito).**

- Comprobamos con $q=7$ y $b=3$: $3^6=729\equiv 1$; luego vale siempre. — _falla:_ un ejemplo no prueba el teorema
- Como $b^{q}\equiv b$ siempre, se sigue $b^{q-1}\equiv 1$. — _falla:_ eso es una consecuencia del teorema, no su justificación

**Errores para «cazar el error».**

- Sustituye **L3**: Los restos son distintos y no nulos, luego son todos pares. — _diagnóstico:_ La conclusión no se sigue de lo anterior (falacia)
- Sustituye **L5**: $q$ divide a $(q-1)!$ porque $q$ es primo. — _diagnóstico:_ La conclusión no se sigue de lo anterior (falacia)
- Sustituye **L2**: Si $kb\equiv jb$ entonces $b\equiv 0$. — _diagnóstico:_ Error de cálculo: el resultado de la línea no sale de la anterior

**Estrategias.**

- ✓ válida: Multiplicar los restos de $a,2a,\dots,(p-1)a$ y cancelar $(p-1)!$ — Es la prueba estándar.
- ✓ válida: Probar $a^p\equiv a$ por inducción con el binomio de Newton — Es válida con binomio y coeficientes divisibles por $p$; no usa los teoremas de este nivel.
- ✗ no sirve: Verificar un ejemplo concreto — Un ejemplo ilustra, pero no prueba un enunciado general.
- ✗ no sirve: Suponer lo que se quiere probar — Eso es un argumento circular.

### Teorema de Euler — `t.euler` (nivel 2.4)

**Enunciado.** Si $\operatorname{mcd}(a,n)=1$, entonces $a^{\varphi(n)}\equiv 1\pmod n$.

**Hipótesis.** $\operatorname{mcd}(b,m)=1$; $r_1,\dots,r_{\varphi}$ son los restos coprimos con $m$ (hay $\varphi(m)$ de ellos)

**Depende de.** `t.cong-cancelacion`, `t.cong-operaciones`

**Demostración (grafo de dependencias entre líneas).** Cualquier orden que respete las flechas se acepta.

- **L1** ← ∅ — Sean $r_1,\dots,r_\varphi$ los restos módulo $m$ coprimos con $m$, con $\varphi=\varphi(m)$. Consideramos $br_1,\dots,br_\varphi$. _[mcd(a,b): el mayor entero que divide a ambos]_
- **L2** ← L1 — Cada $br_i$ es coprimo con $m$, porque producto de coprimos con $m$ es coprimo con $m$. _[Si a y b son coprimos con n, su producto ab también es coprimo con n]_
- **L3** ← L1 — Si $br_i\equiv br_j$, por cancelación (con $\operatorname{mcd}(b,m)=1$) resulta $r_i\equiv r_j$, es decir $i=j$. _[Cancelación en congruencias]_
- **L4** ← L2, L3 — Luego los $br_i$ son $\varphi$ restos distintos y coprimos con $m$: son los $r_i$ en algún orden. _[Si p−1 valores distintos están entre p−1 posibles, aparecen todos]_
- **L5** ← L4 — Multiplicando: $b^{\varphi}\,r_1\cdots r_\varphi\equiv r_1\cdots r_\varphi\pmod m$. _[Congruencias y operaciones]_
- **L6** ← L5 — El producto $r_1\cdots r_\varphi$ es coprimo con $m$; cancelándolo, $b^{\varphi}\equiv 1$. ∎ _[Cancelación en congruencias]_

**Líneas distractoras (falsas a propósito).**

- Comprobamos con $m=10$ y $b=3$: $3^4=81\equiv 1$; luego vale siempre. — _falla:_ un ejemplo no prueba el teorema
- Como $\varphi(m)=m-1$, es el teorema de Fermat. — _falla:_ eso solo es cierto si $n$ es primo

**Errores para «cazar el error».**

- Sustituye **L2**: Cada $br_i$ es coprimo con $m$ porque $b$ divide a $m$. — _diagnóstico:_ La conclusión no se sigue de lo anterior (falacia)
- Sustituye **L6**: El producto es múltiplo de $m$, así que se anula y $b^{\varphi}\equiv 0$. ∎ — _diagnóstico:_ La conclusión no se sigue de lo anterior (falacia)
- Sustituye **L3**: Si $br_i\equiv br_j$ entonces $b\equiv 1$. — _diagnóstico:_ Error de cálculo: el resultado de la línea no sale de la anterior

**Estrategias.**

- ✓ válida: Multiplicar los restos coprimos reordenados por $a$ y cancelar su producto — Es la prueba estándar (generaliza la de Fermat).
- ✓ válida: Usar el teorema de Lagrange en el grupo de unidades módulo $n$ — Válida y más breve, pero usa teoría de grupos que se desarrolla en el Mundo 8.
- ✗ no sirve: Verificar un ejemplo concreto — Un ejemplo ilustra, pero no prueba un enunciado general.
- ✗ no sirve: Suponer lo que se quiere probar — Eso es un argumento circular.

### Corrección de RSA — `t.rsa-correccion` (nivel 2.4)

**Enunciado.** Si $p\neq q$ son primos y $ed\equiv 1\pmod{(p-1)(q-1)}$, entonces $(m^e)^d\equiv m\pmod{pq}$ para todo $m$.

**Hipótesis.** $u,v$ primos distintos; $ed=1+t(u-1)(v-1)$ con $t\ge 0$; Puedes citar Fermat y el teorema chino del resto

**Depende de.** `t.fermat`, `t.tcr`

**Demostración (grafo de dependencias entre líneas).** Cualquier orden que respete las flechas se acepta.

- **L1** ← ∅ — Como $(x^{e})^{d}=x^{ed}=x^{1+t(u-1)(v-1)}$, basta probar $x^{ed}\equiv x$ módulo $u$ y módulo $v$. _[a ≡ b (mod n) significa n | a − b]_
- **L2** ← L1 — Módulo $u$: si $u\mid x$ ambos lados son $\equiv 0$. Si no, por Fermat $x^{u-1}\equiv 1$, y $x^{ed}=x\,(x^{u-1})^{t(v-1)}\equiv x$. _[Pequeño teorema de Fermat]_
- **L3** ← L1 — Módulo $v$: el mismo argumento con el pequeño teorema de Fermat da $x^{ed}\equiv x\pmod v$. _[Pequeño teorema de Fermat]_
- **L4** ← L2, L3 — $x=x^{ed}$ y $x$ cumplen las mismas dos congruencias; por la unicidad del teorema chino del resto ($\operatorname{mcd}(u,v) =1$), $x\equiv x\pmod{uv}$. ∎ _[Teorema chino del resto]_

**Líneas distractoras (falsas a propósito).**

- Con $u=3$, $v=5$, $e=3$, $d=3$ y $x=2$ se verifica; luego siempre. — _falla:_ un ejemplo no prueba el teorema
- Como $x^{\varphi(uv)}\equiv 1$ para todo $x$, el resultado es inmediato. — _falla:_ Euler exige $\operatorname{mcd}(m,pq)=1$; aquí $m$ es cualquiera

**Errores para «cazar el error».**

- Sustituye **L2**: Módulo $u$: por Fermat, $x^{u-1}\equiv 0$. — _diagnóstico:_ Error de cálculo: el resultado de la línea no sale de la anterior
- Sustituye **L4**: Como $x\equiv x$ módulo $u$ o módulo $v$, entonces módulo $uv$. ∎ — _diagnóstico:_ La conclusión no se sigue de lo anterior (falacia)

**Estrategias.**

- ✓ válida: Probar la congruencia módulo $p$ y módulo $q$ con Fermat y unirlas con el TCR — Es la prueba estándar.
- ✓ válida: Usar Euler cuando $\operatorname{mcd}(m,pq)=1$ y tratar aparte los demás casos — Válida pero deja casos por tratar.
- ✗ no sirve: Verificar un ejemplo concreto — Un ejemplo ilustra, pero no prueba un enunciado general.
- ✗ no sirve: Suponer lo que se quiere probar — Eso es un argumento circular.

### Inverso de un complejo — `t.complejo-inverso` (nivel 2.5)

**Enunciado.** Si $z=a+bi\neq 0$, entonces $z^{-1}=\dfrac{a-bi}{a^2+b^2}$.

**Hipótesis.** $x,b\in\mathbb{R}$ no ambos nulos; $i^2=-1$

**Depende de.** nada previo (solo definiciones y propiedades base)

**Demostración (grafo de dependencias entre líneas).** Cualquier orden que respete las flechas se acepta.

- **L1** ← ∅ — Como $x,b$ no son ambos $0$, $x^2+b^2>0$; en particular es distinto de $0$. _[Orden de los números: sumar lo mismo o multiplicar por un positivo conserva la desigualdad]_
- **L2** ← L1 — Calculamos $(x+bi)(x-bi)=x^2-b^2i^2=$ $x^2+b^2$. _[Álgebra de los números: operar, despejar, sustituir]_
- **L3** ← L1, L2 — Dividiendo entre $x^2+b^2\neq 0$: $z\cdot\frac{x-bi}{x^2+b^2}=1$. _[Álgebra de los números: operar, despejar, sustituir]_
- **L4** ← L3 — Por definición de inverso multiplicativo, $z^{-1}=\frac{x-bi}{x^2+b^2}$. ∎ _[Inverso multiplicativo: w es inverso de z si zw = 1]_

**Líneas distractoras (falsas a propósito).**

- Como $z^{-1}=1/x+1/(bi)$, basta invertir cada parte. — _falla:_ no se invierte parte por parte
- Con $z=1+i$ el inverso es $(1-i)/2$; luego vale siempre. — _falla:_ un ejemplo no prueba el caso general

**Errores para «cazar el error».**

- Sustituye **L2**: Calculamos $(x+bi)(x-bi)=x^2-b^2$. — _diagnóstico:_ Error de cálculo: el resultado de la línea no sale de la anterior
- Sustituye **L1**: Como $z\neq 0$, $x\neq 0$. — _diagnóstico:_ La conclusión no se sigue de lo anterior (falacia)

**Estrategias.**

- ✓ válida: Multiplicar por el conjugado y dividir entre $a^2+b^2$ — Es la prueba estándar.
- ✗ no sirve: Verificar un ejemplo concreto — Un ejemplo ilustra, pero no prueba un enunciado general.
- ✗ no sirve: Suponer lo que se quiere probar — Eso es un argumento circular.
- ✗ no sirve: Apoyarse en un dibujo o en la intuición — Ayuda a entender, pero no es una demostración.

### Conjugado de un producto — `t.conj-producto` (nivel 2.5)

**Enunciado.** $\overline{zw}=\bar z\,\bar w$.

**Hipótesis.** $z=a+bi$, $w=c+di$ con $a,b,c,d\in\mathbb{R}$

**Depende de.** nada previo (solo definiciones y propiedades base)

**Demostración (grafo de dependencias entre líneas).** Cualquier orden que respete las flechas se acepta.

- **L1** ← ∅ — Sean $z=a+bi$ y $w=c+di$. Entonces $zw=(ac-bd)+(ad+bc)i$. _[Álgebra de los números: operar, despejar, sustituir]_
- **L2** ← L1 — Su conjugado es $\overline{zw}=(ac-bd)-(ad+bc)i$. _[Conjugado: conj(a+bi) = a − bi]_
- **L3** ← ∅ — Por otro lado, $\bar z\,\bar w=(a-bi)(c-di)=ac-ad\,i-bc\,i+bd\,i^2=$ $(ac-bd)-(ad+bc)i$. _[Álgebra de los números: operar, despejar, sustituir]_
- **L4** ← L2, L3 — Las dos expresiones coinciden: $\overline{zw}=\bar z\,\bar w$. ∎ _[Álgebra de los números: operar, despejar, sustituir]_

**Líneas distractoras (falsas a propósito).**

- Con $z=1+i$ y $w=2-i$ se comprueba; luego siempre. — _falla:_ un ejemplo no prueba el caso general
- Como la conjugación cambia el signo de $i$, y $i$ aparece en todos los términos, el producto se conserva. — _falla:_ es una intuición: hay que desarrollar los productos

**Errores para «cazar el error».**

- Sustituye **L1**: Sean $z=a+bi$ y $w=c+di$. Entonces $zw=(ac+bd)+(ad+bc)i$. — _diagnóstico:_ Error de cálculo: el resultado de la línea no sale de la anterior
- Sustituye **L2**: Su conjugado es $\overline{zw}=-(ac-bd)-(ad+bc)i$. — _diagnóstico:_ Error de cálculo: el resultado de la línea no sale de la anterior

**Estrategias.**

- ✓ válida: Desarrollar en coordenadas $a+bi$ y $c+di$ — Es la prueba estándar.
- ✓ válida: Usar la forma polar y que $\overline{r e^{i\theta}}=r e^{-i\theta}$ — Válida, pero depende de resultados posteriores del nivel.
- ✗ no sirve: Verificar un ejemplo concreto — Un ejemplo ilustra, pero no prueba un enunciado general.
- ✗ no sirve: Suponer lo que se quiere probar — Eso es un argumento circular.

### Módulo de un producto — `t.modulo-producto` (nivel 2.5)

**Enunciado.** $|zw|=|z|\,|w|$.

**Hipótesis.** $|z|^2=z\bar z$ y $|z|\ge 0$; Puedes citar el conjugado de un producto

**Depende de.** `t.conj-producto`

**Demostración (grafo de dependencias entre líneas).** Cualquier orden que respete las flechas se acepta.

- **L1** ← ∅ — Por definición de módulo, $|zv|^2=(zv)\,\overline{zv}$. _[Módulo: |a+bi|² = a² + b² = z·conj(z)]_
- **L2** ← L1 — Por el teorema del conjugado de un producto, $\overline{zv}=\bar z\,\bar v$. _[Conjugado de un producto]_
- **L3** ← L2 — Entonces $|zv|^2=zv\bar z\bar v=(z\bar z)(v\bar v)=|z|^2|v|^2$. _[Álgebra de los números: operar, despejar, sustituir]_
- **L4** ← L3 — Como $|zv|$ y $|z|\,|v|$ son no negativos y sus cuadrados coinciden, son iguales. ∎ _[Orden de los números: sumar lo mismo o multiplicar por un positivo conserva la desigualdad]_

**Líneas distractoras (falsas a propósito).**

- Como $|z+v|\le|z|+|v|$, el producto cumple una igualdad análoga. — _falla:_ son propiedades distintas
- Con $z=3+4i$, $v=1+i$: $|zv|=\sqrt{50}=5\sqrt 2$; luego siempre. — _falla:_ un ejemplo no prueba el caso general

**Errores para «cazar el error».**

- Sustituye **L2**: Por el teorema del conjugado, $\overline{zv}=\bar z+\bar v$. — _diagnóstico:_ Error de cálculo: el resultado de la línea no sale de la anterior
- Sustituye **L4**: Como sus cuadrados coinciden, son iguales (puede ser $a=-b$). — _diagnóstico:_ La conclusión no se sigue de lo anterior (falacia)

**Estrategias.**

- ✓ válida: Comparar los cuadrados de los módulos — Es la prueba estándar.
- ✓ válida: Desarrollar con coordenadas $a,b,c,d$ y comprobar la identidad de Lagrange — Válida: $(a^2+b^2)(c^2+d^2)=(ac-bd)^2+(ad+bc)^2$.
- ✗ no sirve: Verificar un ejemplo concreto — Un ejemplo ilustra, pero no prueba un enunciado general.
- ✗ no sirve: Suponer lo que se quiere probar — Eso es un argumento circular.

### Producto en forma polar — `t.polar-producto` (nivel 2.5)

**Enunciado.** Si $z=r(\cos\theta+i\sin\theta)$ y $w=s(\cos\varphi+i\sin\varphi)$, entonces $zw=rs\,(\cos(\theta+\varphi)+i\sin(\theta+\varphi))$.

**Hipótesis.** $r,s\ge 0$ y $\alpha,\beta\in\mathbb{R}$; Puedes usar las fórmulas de seno y coseno de una suma

**Depende de.** nada previo (solo definiciones y propiedades base)

**Demostración (grafo de dependencias entre líneas).** Cualquier orden que respete las flechas se acepta.

- **L1** ← ∅ — Multiplicamos: $uw=rs\,[(\cos\alpha\cos\beta-\sin\alpha\sin\beta)+i(\sin\alpha\cos\beta+\cos\alpha\sin\beta)]$, usando $i^2=-1$. _[Álgebra de los números: operar, despejar, sustituir]_
- **L2** ← L1 — Por la fórmula del coseno de una suma, $\cos\alpha\cos\beta-\sin\alpha\sin\beta=\cos(\alpha+\beta)$. _[cos(θ+φ) = cos θ cos φ − sen θ sen φ; sen(θ+φ) = sen θ cos φ + cos θ sen φ]_
- **L3** ← L1 — Por la fórmula del seno de una suma, $\sin\alpha\cos\beta+\cos\alpha\sin\beta=$ $\sin(\alpha+\beta)$. _[cos(θ+φ) = cos θ cos φ − sen θ sen φ; sen(θ+φ) = sen θ cos φ + cos θ sen φ]_
- **L4** ← L2, L3 — Sustituyendo, $uw=rs\,(\cos(\alpha+\beta)+i\sin(\alpha+\beta))$. ∎ _[Álgebra de los números: operar, despejar, sustituir]_

**Líneas distractoras (falsas a propósito).**

- Con $\alpha=\pi/2$ y $\beta=\pi/2$: $i\cdot i=-1$ y $\cos\pi=-1$; luego vale siempre. — _falla:_ un ejemplo no prueba el caso general
- Los módulos se suman y los ángulos se multiplican. — _falla:_ es al revés: módulos se multiplican y ángulos se suman

**Errores para «cazar el error».**

- Sustituye **L1**: Multiplicamos: $uw=rs\,[(\cos\alpha\cos\beta+\sin\alpha\sin\beta)+i(\sin\alpha\cos\beta+\cos\alpha\sin\beta)]$. — _diagnóstico:_ Error de cálculo: el resultado de la línea no sale de la anterior
- Sustituye **L2**: Por la fórmula del coseno de una suma, ese bloque es $\cos(\alpha-\beta)$. — _diagnóstico:_ Error de cálculo: el resultado de la línea no sale de la anterior

**Estrategias.**

- ✓ válida: Desarrollar el producto y reconocer las fórmulas de suma de ángulos — Es la prueba estándar.
- ✓ válida: Usar $e^{i\theta}e^{i\varphi}=e^{i(\theta+\varphi)}$ — Válida si se admite la exponencial compleja; aquí se parte de las fórmulas trigonométricas.
- ✗ no sirve: Verificar un ejemplo concreto — Un ejemplo ilustra, pero no prueba un enunciado general.
- ✗ no sirve: Suponer lo que se quiere probar — Eso es un argumento circular.

### Fórmula de De Moivre — `t.de-moivre` (nivel 2.6)

**Enunciado.** Para $n\in\mathbb{N}$: $(\cos\theta+i\sin\theta)^n=\cos n\theta+i\sin n\theta$.

**Hipótesis.** $\alpha\in\mathbb{R}$ y $m\ge 0$ (con $0\in\mathbb{N}$); Puedes citar el producto en forma polar

**Depende de.** `t.polar-producto`

**Demostración (grafo de dependencias entre líneas).** Cualquier orden que respete las flechas se acepta.

- **L1** ← ∅ — Sea $u=\cos\alpha+i\sin\alpha$ y $P(m):\ u^{m}=\cos m\alpha+i\sin m\alpha$. Probamos $P(m)$ para todo $m\ge 0$ por inducción. _[Principio de inducción: si P(0) (o P(1)) y P(n)⇒P(n+1), entonces P(n) para todo n]_
- **L2** ← L1 — Base: $u^0=1=\cos 0+i\sin 0$; $P(0)$ se cumple. _[Álgebra de los números: operar, despejar, sustituir]_
- **L3** ← L1 — Hipótesis de inducción: $u^{m}=\cos m\alpha+i\sin m\alpha$ para algún $m\ge 0$. _[Hipótesis]_
- **L4** ← L3 — Paso: $u^{m+1}=u^{m}\cdot u=(\cos m\alpha+i\sin m\alpha)(\cos\alpha+i\sin\alpha)$, por la hipótesis de inducción. _[Hipótesis de inducción]_
- **L5** ← L4 — Por el producto en forma polar (con módulos $1$), eso es $\cos(m\alpha+\alpha)+i\sin(m\alpha+\alpha)=$ $\cos(m+1)\alpha+i\sin(m+1)\alpha$. _[Producto en forma polar]_
- **L6** ← L2, L5 — Esto es $P(m+1)$. Por inducción, la fórmula vale para todo $m\ge 0$. ∎ _[Principio de inducción: si P(0) (o P(1)) y P(n)⇒P(n+1), entonces P(n) para todo n]_

**Líneas distractoras (falsas a propósito).**

- Comprobamos con $\alpha=\pi/4$ y $m=2,3,4$; coincide; luego siempre. — _falla:_ comprobar casos no es una demostración
- Los módulos se elevan a $m$ y los ángulos se suman $m$ veces. — _falla:_ es una descripción, no una prueba por inducción

**Errores para «cazar el error».**

- Sustituye **L4**: Paso: $u^{m+1}=u^{m}+u$. — _diagnóstico:_ Error de cálculo: el resultado de la línea no sale de la anterior
- Sustituye **L5**: Por el producto en forma polar, los ángulos se multiplican: $\cos(m\alpha\cdot \alpha)+\cdots$ — _diagnóstico:_ Error de cálculo: el resultado de la línea no sale de la anterior
- Sustituye **L2**: Base: $u^0=0$; $P(0)$ se cumple. — _diagnóstico:_ Error de cálculo: el resultado de la línea no sale de la anterior

**Estrategias.**

- ✓ válida: Inducción simple sobre $n$ — Es la prueba estándar.
- ✓ válida: Usar $e^{i\theta}$ y $(e^{i\theta})^n=e^{in\theta}$ — Es válida si se admite la exponencial compleja; aquí se parte del producto polar.
- ✗ no sirve: Verificar un ejemplo concreto — Un ejemplo ilustra, pero no prueba un enunciado general.
- ✗ no sirve: Suponer lo que se quiere probar — Eso es un argumento circular.

### De Moivre con exponente entero — `t.de-moivre-entero` (nivel 2.6)

**Enunciado.** La fórmula de De Moivre vale para todo $n\in\mathbb{Z}$.

**Hipótesis.** $\alpha\in\mathbb{R}$ y $m\ge 1$; Puedes citar De Moivre para $n\ge 0$ y el inverso de un complejo

**Depende de.** `t.de-moivre`, `t.complejo-inverso`

**Demostración (grafo de dependencias entre líneas).** Cualquier orden que respete las flechas se acepta.

- **L1** ← ∅ — Sea $z=\cos\alpha+i\sin\alpha$. Su módulo es $\cos^2\alpha+\sin^2\alpha=1\neq 0$, así que tiene inverso. _[Álgebra de los números: operar, despejar, sustituir]_
- **L2** ← L1 — Por el teorema del inverso de un complejo, $z^{-1}=\frac{\cos\alpha-i\sin\alpha}{1}=\cos(-\alpha)+i\sin(-\alpha)$. _[Inverso de un complejo]_
- **L3** ← L2 — Entonces $z^{-m}=(z^{-1})^{m}=(\cos(-\alpha)+i\sin(-\alpha))^{m}$. _[Álgebra de los números: operar, despejar, sustituir]_
- **L4** ← L3 — Por De Moivre aplicada al ángulo $-\alpha$ y al exponente $m\ge 0$, eso es $\cos(-m\alpha)+i\sin(-m\alpha)$. ∎ _[Fórmula de De Moivre]_

**Líneas distractoras (falsas a propósito).**

- Como $z^{-m}=1/z^{m}$, el ángulo se divide entre $m$. — _falla:_ el ángulo se multiplica por $-m$, no se divide
- Con $\alpha=\pi/2$ y $m=1$: $i^{-1}=-i$; luego siempre. — _falla:_ un ejemplo no prueba el caso general

**Errores para «cazar el error».**

- Sustituye **L2**: $z^{-1}=\cos\alpha+i\sin\alpha$ porque el módulo es $1$. — _diagnóstico:_ Error de cálculo: el resultado de la línea no sale de la anterior
- Sustituye **L4**: Por De Moivre con ángulo $\alpha$, eso es $\cos(m\alpha)+i\sin(m\alpha)$. — _diagnóstico:_ La conclusión no se sigue de lo anterior (falacia)

**Estrategias.**

- ✓ válida: Calcular el inverso con el conjugado y aplicar De Moivre al ángulo opuesto — Es la prueba estándar.
- ✓ válida: Usar $z^{-m}\cdot z^m=1$ y la unicidad del inverso — También válida, apoyada en el producto polar.
- ✗ no sirve: Verificar un ejemplo concreto — Un ejemplo ilustra, pero no prueba un enunciado general.
- ✗ no sirve: Suponer lo que se quiere probar — Eso es un argumento circular.

### Raíces n-ésimas — `t.raices-enesimas` (nivel 2.6)

**Enunciado.** Si $z=r(\cos\theta+i\sin\theta)\neq 0$, las soluciones de $w^n=z$ son exactamente $n$: $r^{1/n}\left(\cos\frac{\theta+2\pi k}{n}+i\sin\frac{\theta+2\pi k}{n}\right)$, $k=0,\dots,n-1$.

**Hipótesis.** $r>0$, $n\ge 1$ entero; Puedes citar De Moivre y el módulo de un producto

**Depende de.** `t.de-moivre`, `t.modulo-producto`

**Demostración (grafo de dependencias entre líneas).** Cualquier orden que respete las flechas se acepta.

- **L1** ← ∅ — (⇐) Si $w=\rho(\cos\varphi+i\sin\varphi)$ con $\rho=r^{1/n}$ y $\varphi=\frac{\theta+2\pi k}{n}$, por De Moivre $w^{n}=\rho^{n}(\cos n\varphi+i\sin n\varphi)=r(\cos(\theta+2\pi k)+i\sin(\theta+2\pi k))=z$. _[Fórmula de De Moivre]_
- **L2** ← ∅ — (⇒) Si $w^{n}=z$, entonces $w\neq 0$ y $w=\rho(\cos\varphi+i\sin\varphi)$ con $\rho>0$. Tomando módulos, $\rho^{n}=|w|^{n}=|z|=r$ por el  de un producto. _[Módulo de un producto]_
- **L3** ← L2 — Por De Moivre, $w^{n}=\rho^{n}(\cos n\varphi+i\sin n\varphi)$; igualando con $z$ y dividiendo entre $r$: $\cos n\varphi=\cos\theta$ y $\sin n\varphi=\sin\theta$. _[Fórmula de De Moivre]_
- **L4** ← L3 — Dos ángulos con el mismo seno y coseno difieren en un múltiplo de $2\pi$: $n\varphi=\theta+2\pi k$ para algún $k\in\mathbb{Z}$. _[Dos ángulos tienen el mismo seno y coseno si y solo si difieren en un múltiplo de 2π]_
- **L5** ← L1, L4 — Los valores $k$ y $k+n$ dan el mismo $w$, y $k=0,\dots,n-1$ dan $n$ argumentos distintos en $[\frac{\theta}{n},\frac{\theta}{n}+2\pi)$: hay exactamente $n$ soluciones. ∎ _[Dos ángulos tienen el mismo seno y coseno si y solo si difieren en un múltiplo de 2π]_

**Líneas distractoras (falsas a propósito).**

- Como $w=z^{1/n}$ tiene una sola raíz real positiva, no hay más soluciones. — _falla:_ en $\mathbb{C}$ hay $n$ raíces
- Con $z=-1$ y $n=2$ se obtienen $\pm i$; luego la fórmula vale siempre. — _falla:_ un ejemplo no prueba el caso general

**Errores para «cazar el error».**

- Sustituye **L1**: (⇐) Por De Moivre, $w^{n}=\rho(\cos n\varphi+i\sin n\varphi)=\cdots$ — _diagnóstico:_ Error de cálculo: el resultado de la línea no sale de la anterior
- Sustituye **L4**: Dos ángulos con el mismo seno y coseno son iguales: $n\varphi=\theta$. — _diagnóstico:_ Caso omitido: falta una posibilidad
- Sustituye **L5**: Hay infinitas soluciones, una por cada $k\in\mathbb{Z}$. ∎ — _diagnóstico:_ La conclusión no se sigue de lo anterior (falacia)

**Estrategias.**

- ✓ válida: Poner $w$ en forma polar y comparar módulos y argumentos — Es la prueba estándar.
- ✓ válida: Usar que $w^n-z$ tiene a lo sumo $n$ raíces (Mundo 3) — Cuenta bien, pero ese teorema aún no está disponible; la prueba aquí no lo necesita.
- ✗ no sirve: Verificar un ejemplo concreto — Un ejemplo ilustra, pero no prueba un enunciado general.
- ✗ no sirve: Suponer lo que se quiere probar — Eso es un argumento circular.

### Suma de las raíces de la unidad — `t.suma-raices-unidad` (nivel 2.6)

**Enunciado.** Si $n\ge 2$, la suma de las $n$ raíces $n$-ésimas de $1$ es $0$.

**Hipótesis.** $n\ge 2$ es un entero; Puedes citar las raíces n-ésimas y la suma geométrica

**Depende de.** `t.serie-geometrica`, `t.raices-enesimas`

**Demostración (grafo de dependencias entre líneas).** Cualquier orden que respete las flechas se acepta.

- **L1** ← ∅ — Por el teorema de las raíces $n$-ésimas aplicado a $1$, estas son $\zeta^j$ con $\zeta=\cos\frac{2\pi}{n}+i\sin\frac{2\pi}{n}$ y $j=0,\dots,n-1$. _[Raíces n-ésimas]_
- **L2** ← L1 — Como $n\ge 2$, $0<\frac{2\pi}{n}<2\pi$, así que $\zeta\neq 1$. _[Dos ángulos tienen el mismo seno y coseno si y solo si difieren en un múltiplo de 2π]_
- **L3** ← L2 — Por la suma geométrica con $r=\zeta\neq 1$: $\sum_{j=0}^{n-1}\zeta^j=\dfrac{\zeta^{n}-1}{\zeta-1}$. _[Suma geométrica]_
- **L4** ← L1, L3 — Como $\zeta$ es raíz $n$-ésima de $1$, $\zeta^{n}=1$; el numerador es $0$ y el denominador $\neq 0$: la suma es $0$. ∎ _[Álgebra de los números: operar, despejar, sustituir]_

**Líneas distractoras (falsas a propósito).**

- Con $n=4$ las raíces $1,i,-1,-i$ suman $0$; luego siempre. — _falla:_ un ejemplo no prueba el caso general
- Por simetría de los vértices del polígono, el centro es el origen, así que la suma es $0$. — _falla:_ es una intuición geométrica: hace falta el cálculo

**Errores para «cazar el error».**

- Sustituye **L2**: Como $n\ge 2$, $\zeta=1$. — _diagnóstico:_ La conclusión no se sigue de lo anterior (falacia)
- Sustituye **L3**: Por la suma geométrica, la suma es $\dfrac{\zeta^{n}-1}{\zeta+1}$. — _diagnóstico:_ Error de cálculo: el resultado de la línea no sale de la anterior
- Sustituye **L4**: Como $\zeta^{n}=0$, la suma es $0$. ∎ — _diagnóstico:_ Error de cálculo: el resultado de la línea no sale de la anterior

**Estrategias.**

- ✓ válida: Escribir las raíces como potencias de $\omega$ y sumar la progresión geométrica — Es la prueba estándar.
- ✓ válida: Usar las relaciones de Cardano-Vieta en $z^n-1$ (Mundo 3) — Válida: el coeficiente de $z^{n-1}$ es $0$; todavía no se dispone de ella.
- ✗ no sirve: Verificar un ejemplo concreto — Un ejemplo ilustra, pero no prueba un enunciado general.
- ✗ no sirve: Suponer lo que se quiere probar — Eso es un argumento circular.

### Grado de un producto — `t.grado-producto` (nivel 3.1)

**Enunciado.** Si $p,q\neq 0$, entonces $\operatorname{gr}(pq)=\operatorname{gr}p+\operatorname{gr}q$.

**Hipótesis.** $f\neq 0$ y $q\neq 0$; en $\mathbb{Q}$: $ab=0\Rightarrow a=0$ o $b=0$

**Depende de.** nada previo (solo definiciones y propiedades base)

**Demostración (grafo de dependencias entre líneas).** Cualquier orden que respete las flechas se acepta.

- **L1** ← ∅ — Sean $\operatorname{gr}f=m$ y $\operatorname{gr}q=s$, con coeficientes líderes $a_m\neq 0$ y $b_s\neq 0$. _[Grado: el mayor exponente con coeficiente no nulo]_
- **L2** ← L1 — En el producto $fq$ todos los términos tienen grado $\le m+s$, y el único de grado $m+s$ es $a_mb_sx^{m+s}$. _[Álgebra de los números: operar, despejar, sustituir]_
- **L3** ← L1 — Como $a_m\neq 0$ y $b_s\neq 0$, por ser un cuerpo (sin divisores de cero) en $\mathbb{Q}$, $a_mb_s\neq 0$. _[En ℚ, ℝ y ℂ: si ab = 0 entonces a = 0 o b = 0]_
- **L4** ← L2, L3 — Luego el término líder de $fq$ es $a_mb_sx^{m+s}$ y $\operatorname{gr}(fq)=m+s$. ∎ _[Grado: el mayor exponente con coeficiente no nulo]_

**Líneas distractoras (falsas a propósito).**

- Con $f=x+1$, $q=x-1$: $\operatorname{gr}(x^2-1)=2=1+1$; luego siempre. — _falla:_ un ejemplo no prueba el caso general
- El grado de un producto es el máximo de los grados. — _falla:_ eso es para la suma, no para el producto

**Errores para «cazar el error».**

- Sustituye **L2**: En el producto, el término de mayor grado es $(a_m+b_s)x^{m+s}$. — _diagnóstico:_ Error de cálculo: el resultado de la línea no sale de la anterior
- Sustituye **L3**: Como $a_m\neq 0$ y $b_s\neq 0$, $a_mb_s=0$. — _diagnóstico:_ La conclusión no se sigue de lo anterior (falacia)

**Estrategias.**

- ✓ válida: Multiplicar los coeficientes líderes y verificar que no se anulan — Es la prueba estándar.
- ✗ no sirve: Verificar un ejemplo concreto — Un ejemplo ilustra, pero no prueba un enunciado general.
- ✗ no sirve: Suponer lo que se quiere probar — Eso es un argumento circular.
- ✗ no sirve: Apoyarse en un dibujo o en la intuición — Ayuda a entender, pero no es una demostración.

### División de polinomios — `t.division-polinomios` (nivel 3.1)

**Enunciado.** Si $d\neq 0$, existen $q,r$ únicos con $p=dq+r$ y $\operatorname{gr}r<\operatorname{gr}d$.

**Hipótesis.** $f,d\in\mathbb{Q}[x]$, $d\neq 0$; Puedes citar el grado de un producto

**Depende de.** `t.grado-producto`

**Demostración (grafo de dependencias entre líneas).** Cualquier orden que respete las flechas se acepta.

- **L1** ← ∅ — Existencia, por inducción sobre $\operatorname{gr}f$. Si $\operatorname{gr}f<\operatorname{gr}d$ (o $f=0$): $h=0$ y $r=f$. _[Principio de inducción: si P(0) (o P(1)) y P(n)⇒P(n+1), entonces P(n) para todo n]_
- **L2** ← L1 — Si $\operatorname{gr}f=n\ge\operatorname{gr}d=m$, con líderes $a_n$ y $b_m$, sea $f_1=f-\frac{a_n}{b_m}x^{n-m}d$: se cancela el término de grado $n$, así que $\operatorname{gr}f_1<n$. _[División de polinomios: p = dq + r con grado de r menor que el de d]_
- **L3** ← L2 — Por hipótesis de inducción, $f_1=dh_1+r$ con $\operatorname{gr}r<\operatorname{gr}d$; entonces $f=d\left(h_1+\frac{a_n}{b_m}x^{n-m}\right)+r$. _[Hipótesis de inducción]_
- **L4** ← L3 — Unicidad: si $dh+r=dh'+r'$, entonces $d(h-h')=r'-r$ con $\operatorname{gr}(r'-r)<\operatorname{gr}d$. _[Álgebra de los números: operar, despejar, sustituir]_
- **L5** ← L4 — Si $h\neq h'$, por el grado de un producto $\operatorname{gr}(d(h-h'))\ge\operatorname{gr}d$, mayor que $\operatorname{gr}(r'-r)$: contradicción. Luego $h=h'$ y $r=r'$. ∎ _[Grado de un producto]_

**Líneas distractoras (falsas a propósito).**

- Dividimos $x^3+1$ entre $x+1$ y sale $x^2-x+1$ sin resto; luego siempre hay división exacta. — _falla:_ un ejemplo no prueba el teorema (y la división no siempre es exacta)
- Como los coeficientes son racionales, el resto siempre es una constante. — _falla:_ solo si $d$ tiene grado $1$

**Errores para «cazar el error».**

- Sustituye **L2**: Sea $f_1=f+\frac{a_n}{b_m}x^{n-m}d$. — _diagnóstico:_ Error de cálculo: el resultado de la línea no sale de la anterior
- Sustituye **L5**: Como $\operatorname{gr}(d(h-h'))=\operatorname{gr}d+\operatorname{gr}(h-h')<\operatorname{gr}d$. — _diagnóstico:_ La conclusión no se sigue de lo anterior (falacia)

**Estrategias.**

- ✓ válida: Inducción sobre el grado de $p$ restando un múltiplo de $d$ que cancela el término líder — Es la prueba estándar (formaliza la división larga).
- ✓ válida: Plantear $p=dq+r$ con coeficientes desconocidos y resolver el sistema triangular — También válida; se justifica con el mismo argumento de grados.
- ✗ no sirve: Verificar un ejemplo concreto — Un ejemplo ilustra, pero no prueba un enunciado general.
- ✗ no sirve: Suponer lo que se quiere probar — Eso es un argumento circular.

### Teorema del resto — `t.teorema-resto` (nivel 3.1)

**Enunciado.** El resto de dividir $p(x)$ entre $x-a$ es $p(a)$.

**Hipótesis.** $f\in\mathbb{Q}[x]$ y $c\in\mathbb{Q}$; Puedes citar la división de polinomios

**Depende de.** `t.division-polinomios`

**Demostración (grafo de dependencias entre líneas).** Cualquier orden que respete las flechas se acepta.

- **L1** ← ∅ — Por la división de polinomios, existen $h,r$ únicos con $f(x)=(x-c)h(x)+r(x)$ y $\operatorname{gr}r<\operatorname{gr}(x-c)=1$. _[División de polinomios]_
- **L2** ← L1 — Como $\operatorname{gr}r<1$, $r$ es una constante $\rho$. _[Grado: el mayor exponente con coeficiente no nulo]_
- **L3** ← L2 — Evaluando en $x=c$: $f(c)=(c-c)h(c)+\rho=$ $\rho$. _[Álgebra de los números: operar, despejar, sustituir]_
- **L4** ← L3 — Luego el resto es $\rho=f(c)$. ∎ _[División de polinomios: p = dq + r con grado de r menor que el de d]_

**Líneas distractoras (falsas a propósito).**

- Con $f=x^2+1$ y $c=2$: el resto es $5=f(2)$; luego siempre. — _falla:_ un ejemplo no prueba el teorema
- El resto es $f(-c)$. — _falla:_ el signo se confunde: se evalúa en $a$

**Errores para «cazar el error».**

- Sustituye **L2**: Como $\operatorname{gr}r<1$, $r=0$. — _diagnóstico:_ La conclusión no se sigue de lo anterior (falacia)
- Sustituye **L3**: Evaluando en $x=c$: $f(c)=(c-c)h(c)+\rho=h(c)+\rho$. — _diagnóstico:_ Error de cálculo: el resultado de la línea no sale de la anterior

**Estrategias.**

- ✓ válida: Evaluar la identidad de la división en $x=a$ — Es la prueba estándar.
- ✓ válida: Justificar la regla de Horner paso a paso — Equivale a la división sintética y da el mismo resto.
- ✗ no sirve: Verificar un ejemplo concreto — Un ejemplo ilustra, pero no prueba un enunciado general.
- ✗ no sirve: Suponer lo que se quiere probar — Eso es un argumento circular.

### Teorema del factor — `t.teorema-factor` (nivel 3.1)

**Enunciado.** $(x-a)\mid p(x)$ si y solo si $p(a)=0$.

**Hipótesis.** $f\in\mathbb{Q}[x]$ y $c\in\mathbb{Q}$; Puedes citar el teorema del resto

**Depende de.** `t.teorema-resto`

**Demostración (grafo de dependencias entre líneas).** Cualquier orden que respete las flechas se acepta.

- **L1** ← ∅ — Por el teorema del resto, $f(x)=(x-c)q(x)+f(c)$. _[Teorema del resto]_
- **L2** ← L1 — (⇒) Si $(x-c)\mid f$, el resto de la división es $0$; por L1, el resto es $f(c)$, así que $f(c)=0$. _[División de polinomios: p = dq + r con grado de r menor que el de d]_
- **L3** ← L1 — (⇐) Si $f(c)=0$, entonces $f(x)=(x-c)q(x)$, es decir $(x-c)\mid f(x)$. _[Álgebra de los números: operar, despejar, sustituir]_
- **L4** ← L2, L3 — Se cumplen las dos implicaciones. ∎ _[Para probar P ⟺ Q se prueban P ⇒ Q y Q ⇒ P]_

**Líneas distractoras (falsas a propósito).**

- Como $f(c)=0$, $c$ es raíz y por eso $(x+c)$ divide a $f$. — _falla:_ el factor es $x-a$, no $x+a$
- Con $f=x^2-1$ y $c=1$ se cumple; luego siempre. — _falla:_ un ejemplo no prueba el teorema

**Errores para «cazar el error».**

- Sustituye **L2**: (⇒) ... el resto es $0$; luego $f(0)=0$. — _diagnóstico:_ Error de cálculo: el resultado de la línea no sale de la anterior
- Sustituye **L3**: (⇐) Si $f(c)=0$, entonces $f(x)=q(x)$. — _diagnóstico:_ Error de cálculo: el resultado de la línea no sale de la anterior

**Estrategias.**

- ✓ válida: Aplicar el teorema del resto en ambos sentidos — Es la prueba estándar.
- ✗ no sirve: Verificar un ejemplo concreto — Un ejemplo ilustra, pero no prueba un enunciado general.
- ✗ no sirve: Suponer lo que se quiere probar — Eso es un argumento circular.
- ✗ no sirve: Apoyarse en un dibujo o en la intuición — Ayuda a entender, pero no es una demostración.

### Número máximo de raíces — `t.raices-maximo` (nivel 3.2)

**Enunciado.** Un polinomio no nulo de grado $n$ tiene a lo sumo $n$ raíces.

**Hipótesis.** $f\neq 0$ y $\operatorname{gr}f=m\ge 0$; Puedes citar el teorema del factor y el grado de un producto

**Depende de.** `t.teorema-factor`, `t.grado-producto`

**Demostración (grafo de dependencias entre líneas).** Cualquier orden que respete las flechas se acepta.

- **L1** ← ∅ — Base: si $m=0$, $f$ es una constante no nula y no tiene raíces ($0\le 0$). _[Principio de inducción: si P(0) (o P(1)) y P(n)⇒P(n+1), entonces P(n) para todo n]_
- **L2** ← L1 — Paso: supongamos el resultado para grado $m-1$ y sea $\operatorname{gr}f=m\ge 1$. Si $f$ no tiene raíces, ya está. _[Hipótesis de inducción]_
- **L3** ← L2 — Si $c$ es una raíz, por el teorema del factor $f=(x-c)h$ y, por el grado de un producto, $\operatorname{gr}h=m-1$. _[Teorema del factor]_
- **L4** ← L3 — Si $b\neq c$ es otra raíz, $0=(b-c)h(b)$ y, como $b-c\neq 0$, $h(b)=0$. _[En ℚ, ℝ y ℂ: si ab = 0 entonces a = 0 o b = 0]_
- **L5** ← L4 — Por hipótesis de inducción $h$ tiene a lo sumo $m-1$ raíces; las raíces de $f$ son $c$ y esas: a lo sumo $m$. ∎ _[Hipótesis de inducción]_

**Líneas distractoras (falsas a propósito).**

- Con $f=x^3-x$, las raíces $0,1,-1$ son $3$; luego siempre hay a lo sumo $3$. — _falla:_ un ejemplo no prueba el caso general
- Como $\mathbb{Q}$ es infinito, un polinomio puede tener infinitas raíces. — _falla:_ es falso para polinomios no nulos

**Errores para «cazar el error».**

- Sustituye **L3**: Si $c$ es una raíz, $f=(x+c)h$. — _diagnóstico:_ Error de cálculo: el resultado de la línea no sale de la anterior
- Sustituye **L5**: Por hipótesis de inducción $h$ tiene a lo sumo $m$ raíces; luego $f$ tiene a lo sumo $2m$. — _diagnóstico:_ Error de cálculo: el resultado de la línea no sale de la anterior

**Estrategias.**

- ✓ válida: Inducción sobre el grado extrayendo un factor $(x-a)$ — Es la prueba estándar.
- ✓ válida: Suponer $n+1$ raíces y factorizar $n+1$ factores lineales (grado $\ge n+1>n$) — Válida: da una contradicción de grados con el grado de un producto.
- ✗ no sirve: Verificar un ejemplo concreto — Un ejemplo ilustra, pero no prueba un enunciado general.
- ✗ no sirve: Suponer lo que se quiere probar — Eso es un argumento circular.

### Identidad de polinomios — `t.identidad-polinomios` (nivel 3.2)

**Enunciado.** Si dos polinomios de grado $\le n$ coinciden en $n+1$ puntos distintos, son iguales.

**Hipótesis.** $\operatorname{gr}f,\operatorname{gr}g\le n$; $f(a_i)=g(a_i)$ para $n+1$ valores distintos $a_i$; Puedes citar el máximo de raíces

**Depende de.** `t.raices-maximo`

**Demostración (grafo de dependencias entre líneas).** Cualquier orden que respete las flechas se acepta.

- **L1** ← ∅ — Sea $h=f-g$: tiene grado $\le n$. _[Grado: el mayor exponente con coeficiente no nulo]_
- **L2** ← L1 — $h(a_i)=f(a_i)-g(a_i)=0$ para los $n+1$ puntos: $h$ tiene al menos $n+1$ raíces distintas. _[Raíz de p: un número a con p(a) = 0]_
- **L3** ← L2 — Si $h\neq 0$, por el máximo de raíces tendría a lo sumo $\operatorname{gr}h\le n$ raíces: contradicción. _[Número máximo de raíces]_
- **L4** ← L3 — Luego $h=0$ y $f=g$. ∎ _[Reducción al absurdo: si suponer lo contrario lleva a una contradicción, lo supuesto es falso]_

**Líneas distractoras (falsas a propósito).**

- Con $n=1$ y dos rectas que coinciden en $2$ puntos son la misma; luego vale siempre. — _falla:_ un ejemplo no prueba el caso general
- Coinciden en $n$ puntos, así que son iguales. — _falla:_ hacen falta $n+1$ puntos, no $n$

**Errores para «cazar el error».**

- Sustituye **L1**: Sea $h=f+g$: tiene grado $\le n$. — _diagnóstico:_ Error de cálculo: el resultado de la línea no sale de la anterior
- Sustituye **L3**: Si $h\neq 0$, tendría a lo sumo $\operatorname{gr}h$ raíces, lo cual es compatible con $n+1$ raíces. — _diagnóstico:_ La conclusión no se sigue de lo anterior (falacia)

**Estrategias.**

- ✓ válida: Considerar $p-q$ y contar raíces — Es la prueba estándar.
- ✓ válida: Usar la interpolación de Lagrange (unicidad) — Válida; la unicidad de la interpolación es justamente este teorema.
- ✗ no sirve: Verificar un ejemplo concreto — Un ejemplo ilustra, pero no prueba un enunciado general.
- ✗ no sirve: Suponer lo que se quiere probar — Eso es un argumento circular.

### Raíces racionales — `t.raices-racionales` (nivel 3.2)

**Enunciado.** Si $\frac{p}{q}$ (irreducible) es raíz de $a_nx^n+\cdots+a_0\in\mathbb{Z}[x]$, entonces $p\mid a_0$ y $q\mid a_n$.

**Hipótesis.** $a_i\in\mathbb{Z}$, $a_m\neq 0$; $\operatorname{mcd}(u,v)=1$ y $p(u/v)=0$

**Depende de.** `t.lema-euclides`

**Demostración (grafo de dependencias entre líneas).** Cualquier orden que respete las flechas se acepta.

- **L1** ← ∅ — Multiplicando $p(u/v)=0$ por $v^m$: $a_mu^m+a_{m-1}u^{m-1}v+\cdots+a_0v^m=0$. _[Álgebra de los números: operar, despejar, sustituir]_
- **L2** ← L1 — Todos los términos salvo el último son múltiplos de $u$; por tanto $u\mid a_0v^m$. _[Divisibilidad de combinaciones]_
- **L3** ← L2 — Como $\operatorname{mcd}(u,v)=1$, también $\operatorname{mcd}(u,v^m)=1$ (producto de coprimos); por el lema de Euclides, $u\mid a_0$. _[Lema de Euclides]_
- **L4** ← L1 — Análogamente, todos los términos salvo el primero son múltiplos de $v$, así que $v\mid a_mu^m$, y por el lema de Euclides $v\mid a_m$. ∎ _[Lema de Euclides]_

**Líneas distractoras (falsas a propósito).**

- Como $u/v$ es raíz, $a_0=u$ y $a_m=v$. — _falla:_ solo dividen, no tienen por qué ser iguales
- Con $2x^2-3x+1$ y raíz $1/2$: $1\mid 1$ y $2\mid 2$; luego siempre. — _falla:_ un ejemplo no prueba el teorema

**Errores para «cazar el error».**

- Sustituye **L2**: Todos los términos salvo el último son múltiplos de $v$; por tanto $v\mid a_0v^m$. — _diagnóstico:_ La conclusión no se sigue de lo anterior (falacia)
- Sustituye **L3**: Como $u\mid a_0v^m$, entonces $u\mid a_0$ porque $u$ es primo. — _diagnóstico:_ La conclusión no se sigue de lo anterior (falacia)

**Estrategias.**

- ✓ válida: Multiplicar por $v^n$, aislar un término y usar el lema de Euclides — Es la prueba estándar.
- ✗ no sirve: Verificar un ejemplo concreto — Un ejemplo ilustra, pero no prueba un enunciado general.
- ✗ no sirve: Suponer lo que se quiere probar — Eso es un argumento circular.
- ✗ no sirve: Apoyarse en un dibujo o en la intuición — Ayuda a entender, pero no es una demostración.

### Raíz múltiple y derivada — `t.raiz-multiple` (nivel 3.2)

**Enunciado.** $a$ es raíz de multiplicidad $\ge 2$ de $p$ si y solo si $p(a)=p'(a)=0$.

**Hipótesis.** $p\in\mathbb{Q}[x]$, $c\in\mathbb{Q}$; Puedes citar el teorema del factor y la regla del producto para derivadas

**Depende de.** `t.teorema-factor`

**Demostración (grafo de dependencias entre líneas).** Cualquier orden que respete las flechas se acepta.

- **L1** ← ∅ — Probamos las dos implicaciones. _[Para probar P ⟺ Q se prueban P ⇒ Q y Q ⇒ P]_
- **L2** ← L1 — (⇒) Si $p=(x-c)^2h$, entonces $p(c)=0$ y, por la regla del producto, $p'=2(x-c)h+(x-c)^2h'$, que vale $0$ en $x=c$. _[Regla del producto para derivadas: (fg)′ = f′g + fg′]_
- **L3** ← L1 — (⇐) Si $p(c)=0$, por el teorema del factor $p=(x-c)h$. _[Teorema del factor]_
- **L4** ← L3 — Derivando, $p'=h+(x-c)h'$, así que $p'(c)=h(c)$. Como $p'(c)=0$, $h(c)=0$. _[Regla del producto para derivadas: (fg)′ = f′g + fg′]_
- **L5** ← L2, L4 — Por el teorema del factor, $(x-c)\mid h$, luego $(x-c)^2\mid p$. Con L2, se cumplen ambas implicaciones. ∎ _[Teorema del factor]_

**Líneas distractoras (falsas a propósito).**

- Si $p(c)=0$ entonces $c$ es raíz doble. — _falla:_ solo es simple en general: hace falta también $p'(a)=0$
- Con $x^2$ y $a=0$ se cumple; luego siempre. — _falla:_ un ejemplo no prueba el caso general

**Errores para «cazar el error».**

- Sustituye **L4**: Derivando, $p'=h'$, así que $p'(c)=h'(c)$. — _diagnóstico:_ Error de cálculo: el resultado de la línea no sale de la anterior
- Sustituye **L3**: (⇐) Si $p'(c)=0$, por el teorema del factor $p=(x-c)h$. — _diagnóstico:_ La conclusión no se sigue de lo anterior (falacia)

**Estrategias.**

- ✓ válida: Aplicar el teorema del factor dos veces con la regla del producto — Es la prueba estándar.
- ✗ no sirve: Verificar un ejemplo concreto — Un ejemplo ilustra, pero no prueba un enunciado general.
- ✗ no sirve: Suponer lo que se quiere probar — Eso es un argumento circular.
- ✗ no sirve: Apoyarse en un dibujo o en la intuición — Ayuda a entender, pero no es una demostración.

### Algoritmo de Euclides para polinomios — `t.mcd-polinomios` (nivel 3.3)

**Enunciado.** Si $p=sq+r$, entonces $\operatorname{mcd}(p,q)=\operatorname{mcd}(q,r)$.

**Hipótesis.** $f=sg+r$; Puedes usar la definición de divisibilidad

**Depende de.** `t.division-polinomios`

**Demostración (grafo de dependencias entre líneas).** Cualquier orden que respete las flechas se acepta.

- **L1** ← ∅ — Sea $h$ un divisor común de $f$ y $g$: $f=ha$ y $g=hb$. _[Divisibilidad: n | z si existe k entero con z = nk]_
- **L2** ← L1 — Entonces $r=f-sg=h(a-sb)$, así que $h\mid r$ y $h$ divide a $g$ y a $r$. _[Divisibilidad: n | z si existe k entero con z = nk]_
- **L3** ← L2 — Recíprocamente, si $h\mid g$ y $h\mid r$, de $f=sg+r$ se sigue que $h\mid f$. _[Divisibilidad: n | z si existe k entero con z = nk]_
- **L4** ← L2, L3 — Ambos pares tienen los mismos divisores comunes, luego el de mayor grado (hecho mónico) es el mismo: los mcd coinciden. ∎ _[mcd(a,b): el mayor entero que divide a ambos]_

**Líneas distractoras (falsas a propósito).**

- Con $f=x^2-1$, $g=x-1$, $r=0$ el mcd es $x-1$; luego el resultado vale siempre. — _falla:_ un ejemplo no prueba el caso general
- Como $f$ es mayor que $g$, su mcd es $g$. — _falla:_ el mcd no es el menor de los dos en general

**Errores para «cazar el error».**

- Sustituye **L2**: Entonces $r=f+sg=h(a+sb)$. — _diagnóstico:_ Error de cálculo: el resultado de la línea no sale de la anterior
- Sustituye **L3**: Recíprocamente, si $h\mid g$, entonces $h\mid f$. — _diagnóstico:_ La conclusión no se sigue de lo anterior (falacia)

**Estrategias.**

- ✓ válida: Probar que los divisores comunes de $(p,q)$ y de $(q,r)$ coinciden — Es la prueba estándar.
- ✗ no sirve: Verificar un ejemplo concreto — Un ejemplo ilustra, pero no prueba un enunciado general.
- ✗ no sirve: Suponer lo que se quiere probar — Eso es un argumento circular.
- ✗ no sirve: Apoyarse en un dibujo o en la intuición — Ayuda a entender, pero no es una demostración.

### Cuadráticas irreducibles — `t.cuadratica-irreducible` (nivel 3.3)

**Enunciado.** $x^2+bx+c$ es irreducible sobre $\mathbb{R}$ si y solo si $b^2-4c<0$.

**Hipótesis.** $b,c\in\mathbb{R}$ y $b^2-4c<0$; Puedes citar el teorema del factor

**Depende de.** `t.teorema-factor`

**Demostración (grafo de dependencias entre líneas).** Cualquier orden que respete las flechas se acepta.

- **L1** ← ∅ — Supongamos por reducción al absurdo que se factoriza: tendría un factor de grado $1$ (los grados suman $2$). _[Reducción al absurdo: si suponer lo contrario lleva a una contradicción, lo supuesto es falso]_
- **L2** ← L1 — Un factor lineal $x-a$ implica, por el teorema del factor, que $a$ es una raíz real. _[Teorema del factor]_
- **L3** ← L2 — Completando el cuadrado, $x^2+bx+c=(x+\tfrac{b}{2})^2-\tfrac{b^2-4c}{4}$; evaluado en $a$ y por L2 da $(a+\tfrac{b}{2})^2=\tfrac{b^2-4c}{4}$. _[Álgebra de los números: operar, despejar, sustituir]_
- **L4** ← L3 — El miembro izquierdo es no negativo (un cuadrado real) y el derecho es negativo: contradicción. Por tanto es irreducible. ∎ _[Reducción al absurdo: si suponer lo contrario lleva a una contradicción, lo supuesto es falso]_

**Líneas distractoras (falsas a propósito).**

- Con $x^2+1$ no hay raíces reales; luego todo polinomio de grado $2$ es irreducible. — _falla:_ un ejemplo no prueba el caso general
- Como $b^2-4c<0$, el polinomio no tiene coeficientes reales. — _falla:_ no se sigue: es el discriminante, no los coeficientes

**Errores para «cazar el error».**

- Sustituye **L3**: Completando el cuadrado, $x^2+bx+c=(x+b)^2-(b^2-4c)$. — _diagnóstico:_ Error de cálculo: el resultado de la línea no sale de la anterior
- Sustituye **L4**: El miembro izquierdo es un cuadrado negativo y el derecho también. — _diagnóstico:_ La conclusión no se sigue de lo anterior (falacia)

**Estrategias.**

- ✓ válida: Suponer una raíz real y completar el cuadrado — Es la prueba estándar.
- ✓ válida: Usar la fórmula cuadrática para ver que no hay raíces reales — Válida: sin raíces reales no hay factor lineal real.
- ✗ no sirve: Verificar un ejemplo concreto — Un ejemplo ilustra, pero no prueba un enunciado general.
- ✗ no sirve: Suponer lo que se quiere probar — Eso es un argumento circular.

### Cúbicas irreducibles — `t.cubica-irreducible` (nivel 3.3)

**Enunciado.** Un polinomio de grado $2$ o $3$ sobre $\mathbb{Q}$ es irreducible si y solo si no tiene raíces racionales.

**Hipótesis.** $p\in\mathbb{Q}[x]$, $\operatorname{gr}p=3$; Puedes citar el teorema del factor y el grado de un producto

**Depende de.** `t.teorema-factor`, `t.grado-producto`

**Demostración (grafo de dependencias entre líneas).** Cualquier orden que respete las flechas se acepta.

- **L1** ← ∅ — (⇐) Si $a\in\mathbb{Q}$ es una raíz, por el teorema del factor $p=(x-a)q$ con $\operatorname{gr}q=2$: es producto de dos polinomios no constantes. _[Teorema del factor]_
- **L2** ← ∅ — (⇒) Si $p=uv$ con $u,v$ no constantes, por el grado de un producto $\operatorname{gr}u+\operatorname{gr}v=3$. _[Grado de un producto]_
- **L3** ← L2 — Como ambos grados son $\ge 1$, uno de ellos vale 1: digamos $u=\alpha x+\beta$ con $\alpha\neq 0$. _[División en casos que cubren todas las posibilidades]_
- **L4** ← L3 — Entonces $a=-\beta/\alpha\in\mathbb{Q}$ cumple $p(a)=u(a)v(a)=0$: es una raíz racional. ∎ _[Raíz de p: un número a con p(a) = 0]_

**Líneas distractoras (falsas a propósito).**

- El polinomio $x^3-2$ no tiene raíces racionales; luego todo cúbico es irreducible. — _falla:_ un ejemplo no prueba el caso general
- Como el grado es $3$ impar, tiene una raíz racional. — _falla:_ tiene raíz real, no necesariamente racional

**Errores para «cazar el error».**

- Sustituye **L1**: (⇐) Si $a$ es una raíz, $p=(x+a)q$. — _diagnóstico:_ Error de cálculo: el resultado de la línea no sale de la anterior
- Sustituye **L4**: Entonces $a=\beta/\alpha$ cumple $p(a)=0$. — _diagnóstico:_ Error de cálculo: el resultado de la línea no sale de la anterior

**Estrategias.**

- ✓ válida: Probar las dos implicaciones por separado con el teorema del factor — Es la prueba estándar.
- ✗ no sirve: Verificar un ejemplo concreto — Un ejemplo ilustra, pero no prueba un enunciado general.
- ✗ no sirve: Suponer lo que se quiere probar — Eso es un argumento circular.
- ✗ no sirve: Apoyarse en un dibujo o en la intuición — Ayuda a entender, pero no es una demostración.

### Raíces complejas conjugadas — `t.conjugadas` (nivel 3.3)

**Enunciado.** Si $p$ tiene coeficientes reales y $p(z)=0$, entonces $p(\bar z)=0$.

**Hipótesis.** $c_k\in\mathbb{R}$ para todo $k$; $p(z)=0$; Puedes usar que el conjugado respeta sumas y productos

**Depende de.** `t.conj-producto`

**Demostración (grafo de dependencias entre líneas).** Cualquier orden que respete las flechas se acepta.

- **L1** ← ∅ — Como $c_k$ es real, $\overline{c_k}=c_k$. _[Conjugado: conj(a+bi) = a − bi]_
- **L2** ← L1 — Por el conjugado de un producto y de una suma, $\overline{p(z)}=\sum \overline{c_k}\,\overline{z}^{\,k}$. _[Conjugado de un producto]_
- **L3** ← L2 — Usando L1, $\overline{p(z)}=\sum c_k\,\overline{z}^{\,k}=p(\overline{z})$. _[Conjugado: conj(a+bi) = a − bi]_
- **L4** ← L3 — Como $p(z)=0$ y $\overline{0}=0$, concluimos $p(\overline{z})=\overline{0}=0$. ∎ _[Conjugado: conj(a+bi) = a − bi]_

**Líneas distractoras (falsas a propósito).**

- Con $x^2+1$ y $z=i$ se cumple; luego vale para todos. — _falla:_ un ejemplo no prueba el caso general
- Si $z$ es raíz, también lo es $-z$. — _falla:_ es falso en general: solo vale el conjugado, y solo con coeficientes reales

**Errores para «cazar el error».**

- Sustituye **L1**: Como $c_k$ es real, $\overline{c_k}=-c_k$. — _diagnóstico:_ Error de cálculo: el resultado de la línea no sale de la anterior
- Sustituye **L3**: Usando L1, $\overline{p(z)}=\sum c_k\,z^{k}=p(z)$. — _diagnóstico:_ La conclusión no se sigue de lo anterior (falacia)

**Estrategias.**

- ✓ válida: Calcular $\overline{p(z)}$ término a término — Es la prueba estándar.
- ✗ no sirve: Verificar un ejemplo concreto — Un ejemplo ilustra, pero no prueba un enunciado general.
- ✗ no sirve: Suponer lo que se quiere probar — Eso es un argumento circular.
- ✗ no sirve: Apoyarse en un dibujo o en la intuición — Ayuda a entender, pero no es una demostración.

### Fórmula cuadrática — `t.cuadratica-formula` (nivel 3.4)

**Enunciado.** Las raíces de $ax^2+bx+c$ ($a\neq0$) son $x=\dfrac{-b\pm\sqrt{b^2-4ac}}{2a}$.

**Hipótesis.** $a\neq 0$ y $\Delta\ge 0$; Puedes completar el cuadrado

**Depende de.** `t.teorema-factor`

**Demostración (grafo de dependencias entre líneas).** Cualquier orden que respete las flechas se acepta.

- **L1** ← ∅ — Como $a\neq 0$, dividimos entre $a$: $x^2+\tfrac{b}{a}x+\tfrac{c}{a}=0$. _[Álgebra de los números: operar, despejar, sustituir]_
- **L2** ← L1 — Completando el cuadrado: $\left(x+\tfrac{b}{2a}\right)^2=\tfrac{b^2}{4a^2}-\tfrac{c}{a}=\tfrac{\Delta}{4a^2}$. _[Álgebra de los números: operar, despejar, sustituir]_
- **L3** ← L2 — Como $\Delta\ge 0$, un cuadrado es igual a $\tfrac{\Delta}{4a^2}$ si y solo si la base es $\pm\tfrac{\sqrt\Delta}{2a}$. _[En ℚ, ℝ y ℂ: si ab = 0 entonces a = 0 o b = 0]_
- **L4** ← L3 — Despejando, $x=\dfrac{-b\pm\sqrt\Delta}{2a}$. Cada paso es una equivalencia, así que son todas las soluciones. ∎ _[Para probar P ⟺ Q se prueban P ⇒ Q y Q ⇒ P]_

**Líneas distractoras (falsas a propósito).**

- Con $x^2-3x+2$ la fórmula da $1$ y $2$; luego es correcta. — _falla:_ un ejemplo no prueba el caso general
- Como $\Delta\ge 0$, el polinomio tiene exactamente una raíz. — _falla:_ puede tener dos distintas (si $\Delta>0$)

**Errores para «cazar el error».**

- Sustituye **L2**: Completando el cuadrado: $\left(x+\tfrac{b}{a}\right)^2=\tfrac{\Delta}{4a^2}$. — _diagnóstico:_ Error de cálculo: el resultado de la línea no sale de la anterior
- Sustituye **L3**: Como $\Delta\ge 0$, la base es $\tfrac{\sqrt\Delta}{2a}$ únicamente. — _diagnóstico:_ La conclusión no se sigue de lo anterior (falacia)

**Estrategias.**

- ✓ válida: Dividir entre $a$ y completar el cuadrado — Es la prueba estándar.
- ✗ no sirve: Verificar un ejemplo concreto — Un ejemplo ilustra, pero no prueba un enunciado general.
- ✗ no sirve: Suponer lo que se quiere probar — Eso es un argumento circular.
- ✗ no sirve: Apoyarse en un dibujo o en la intuición — Ayuda a entender, pero no es una demostración.

### Vieta para cuadráticas — `t.vieta-cuadratica` (nivel 3.4)

**Enunciado.** Si $x_1,x_2$ son las raíces de $ax^2+bx+c$, entonces $x_1+x_2=-\frac{b}{a}$ y $x_1x_2=\frac{c}{a}$.

**Hipótesis.** $a\neq 0$, $r_1,x_2$ raíces con $r_1\neq x_2$; Puedes citar el teorema del factor

**Depende de.** `t.teorema-factor`

**Demostración (grafo de dependencias entre líneas).** Cualquier orden que respete las flechas se acepta.

- **L1** ← ∅ — Por el teorema del factor, $(x-r_1)$ divide al polinomio: $ax^2+qx+m=(x-r_1)(ax+k)$ para algún $k$. _[Teorema del factor]_
- **L2** ← L1 — Como $x_2\neq r_1$ es raíz, $(x_2-r_1)(ax_2+k)=0$ y, al ser $x_2-r_1\neq0$, $ax_2+k=0$. _[En ℚ, ℝ y ℂ: si ab = 0 entonces a = 0 o b = 0]_
- **L3** ← L2 — Así $k=-ax_2$ y el polinomio es $a(x-r_1)(x-x_2)=ax^2-a(r_1+x_2)x+ar_1x_2$. _[Álgebra de los números: operar, despejar, sustituir]_
- **L4** ← L3 — Comparando coeficientes: $q=-a(r_1+x_2)$ y $m=ar_1x_2$; dividiendo entre $a\neq 0$ se obtiene lo pedido. ∎ _[Álgebra de los números: operar, despejar, sustituir]_

**Líneas distractoras (falsas a propósito).**

- Con $x^2-5x+6$ y raíces $2,3$: suma $5$, producto $6$; luego siempre. — _falla:_ un ejemplo no prueba el caso general
- Como la suma de las raíces es $q$, queda demostrado. — _falla:_ falta el signo y dividir entre $a$

**Errores para «cazar el error».**

- Sustituye **L3**: Así $k=ax_2$ y el polinomio es $a(x-r_1)(x-x_2)$. — _diagnóstico:_ Error de cálculo: el resultado de la línea no sale de la anterior
- Sustituye **L4**: Comparando coeficientes: $q=a(r_1+x_2)$. — _diagnóstico:_ Error de cálculo: el resultado de la línea no sale de la anterior

**Estrategias.**

- ✓ válida: Factorizar con el teorema del factor y comparar coeficientes — Es la prueba estándar.
- ✓ válida: Sumar y multiplicar las dos raíces dadas por la fórmula cuadrática — Válida (para $\Delta\ge0$): se comprueba con las fórmulas del teorema anterior.
- ✗ no sirve: Verificar un ejemplo concreto — Un ejemplo ilustra, pero no prueba un enunciado general.
- ✗ no sirve: Suponer lo que se quiere probar — Eso es un argumento circular.

### Vieta para cúbicas — `t.vieta-cubica` (nivel 3.4)

**Enunciado.** Si $x_1,x_2,x_3$ son las raíces de $x^3+bx^2+cx+d$, entonces $\sum x_i=-b$, $\sum_{i<j}x_ix_j=c$ y $x_1x_2x_3=-d$.

**Hipótesis.** el polinomio es mónico con raíces distintas $x_1,x_2,x_3$; Puedes citar el teorema del factor

**Depende de.** `t.vieta-cuadratica`

**Demostración (grafo de dependencias entre líneas).** Cualquier orden que respete las flechas se acepta.

- **L1** ← ∅ — Por el teorema del factor aplicado tres veces (las raíces son distintas), $x^3+px^2+cx+s=(x-x_1)(x-x_2)(x-x_3)\,g$ con $g$ constante. _[Teorema del factor]_
- **L2** ← L1 — Comparando los términos de grado $3$ (ambos mónicos), $g=1$. _[Álgebra de los números: operar, despejar, sustituir]_
- **L3** ← L2 — Expandiendo: $(x-x_1)(x-x_2)(x-x_3)=x^3-(x_1+x_2+x_3)x^2+(x_1x_2+x_1x_3+x_2x_3)x-x_1x_2x_3$. _[Álgebra de los números: operar, despejar, sustituir]_
- **L4** ← L3 — Comparando coeficientes de $x^2$, $x$ y el término independiente: $p=-\sum x_i$, $c=\sum x_ix_j$ y $s=-x_1x_2x_3$. ∎ _[Álgebra de los números: operar, despejar, sustituir]_

**Líneas distractoras (falsas a propósito).**

- Con $x^3-6x^2+11x-6$ (raíces $1,2,3$) las tres relaciones se verifican; luego valen siempre. — _falla:_ un ejemplo no prueba el caso general
- Como $p$ es el coeficiente de $x^2$, la suma de raíces es $p$. — _falla:_ la suma de raíces es $-b$

**Errores para «cazar el error».**

- Sustituye **L3**: Expandiendo: $(x-x_1)(x-x_2)(x-x_3)=x^3+(x_1+x_2+x_3)x^2+\cdots$ — _diagnóstico:_ Error de cálculo: el resultado de la línea no sale de la anterior
- Sustituye **L4**: Comparando: $s=x_1x_2x_3$. — _diagnóstico:_ Error de cálculo: el resultado de la línea no sale de la anterior

**Estrategias.**

- ✓ válida: Factorizar con tres factores lineales, expandir y comparar coeficientes — Es la prueba estándar.
- ✗ no sirve: Verificar un ejemplo concreto — Un ejemplo ilustra, pero no prueba un enunciado general.
- ✗ no sirve: Suponer lo que se quiere probar — Eso es un argumento circular.
- ✗ no sirve: Apoyarse en un dibujo o en la intuición — Ayuda a entender, pero no es una demostración.

### Sumas de potencias de raíces — `t.potencias-raices` (nivel 3.4)

**Enunciado.** $x_1^2+x_2^2+x_3^2=(x_1+x_2+x_3)^2-2(x_1x_2+x_1x_3+x_2x_3)$.

**Hipótesis.** $x_1,x_2,x_3$ raíces del cúbico mónico; Puedes citar las relaciones de Vieta para cúbicas

**Depende de.** `t.vieta-cubica`

**Demostración (grafo de dependencias entre líneas).** Cualquier orden que respete las flechas se acepta.

- **L1** ← ∅ — Elevando al cuadrado la suma: $(x_1+x_2+x_3)^2=x_1^2+x_2^2+x_3^2+2(x_1x_2+x_1x_3+x_2x_3)$. _[Álgebra de los números: operar, despejar, sustituir]_
- **L2** ← L1 — Despejando: $x_1^2+x_2^2+x_3^2=(x_1+x_2+x_3)^2-2(x_1x_2+x_1x_3+x_2x_3)$. _[Álgebra de los números: operar, despejar, sustituir]_
- **L3** ← ∅ — Por Vieta, $x_1+x_2+x_3=-b$ y $x_1x_2+x_1x_3+x_2x_3=q$. _[Vieta para cúbicas]_
- **L4** ← L2, L3 — Sustituyendo: $x_1^2+x_2^2+x_3^2=(-b)^2-2q=$ $b^2-2q$. ∎ _[Álgebra de los números: operar, despejar, sustituir]_

**Líneas distractoras (falsas a propósito).**

- Con raíces $1,2,3$ la suma de cuadrados es $14$ y $b^2-2c=36-22=14$; luego siempre. — _falla:_ un ejemplo no prueba el caso general
- Como la suma de cuadrados es mayor que cero, $b^2>2q$. — _falla:_ no es una demostración de la identidad

**Errores para «cazar el error».**

- Sustituye **L1**: Elevando al cuadrado la suma: $(x_1+x_2+x_3)^2=x_1^2+x_2^2+x_3^2$. — _diagnóstico:_ Error de cálculo: el resultado de la línea no sale de la anterior
- Sustituye **L2**: Despejando: $x_1^2+x_2^2+x_3^2=(x_1+x_2+x_3)^2+2(x_1x_2+x_1x_3+x_2x_3)$. — _diagnóstico:_ Error de cálculo: el resultado de la línea no sale de la anterior

**Estrategias.**

- ✓ válida: Elevar al cuadrado la suma de las raíces y usar Vieta — Es la prueba estándar.
- ✗ no sirve: Verificar un ejemplo concreto — Un ejemplo ilustra, pero no prueba un enunciado general.
- ✗ no sirve: Suponer lo que se quiere probar — Eso es un argumento circular.
- ✗ no sirve: Apoyarse en un dibujo o en la intuición — Ayuda a entender, pero no es una demostración.

### Asociatividad del producto — `t.mat-producto-asoc` (nivel 4.1)

**Enunciado.** $(AB)C=A(BC)$ siempre que los productos estén definidos.

**Hipótesis.** los tamaños son compatibles; Puedes usar la definición del producto y que las sumas finitas se reordenan

**Depende de.** nada previo (solo definiciones y propiedades base)

**Demostración (grafo de dependencias entre líneas).** Cualquier orden que respete las flechas se acepta.

- **L1** ← ∅ — Fijamos $(i,j)$. Por definición, $((AB)C)_{ij}=\sum_{p}(AB)_{ip}C_{pj}$. _[Producto de matrices: (AB)ᵢⱼ = Σₖ aᵢₖ bₖⱼ]_
- **L2** ← L1 — Y $(AB)_{ip}=\sum_{q}A_{iq}B_{qp}$, luego $((AB)C)_{ij}=\sum_{p}\sum_{q}A_{iq}B_{qp}C_{pj}$. _[Producto de matrices: (AB)ᵢⱼ = Σₖ aᵢₖ bₖⱼ]_
- **L3** ← L2 — Como las sumas son finitas, se puede intercambiar el orden de las dos sumas y sacar factor común: $=\sum_{q}A_{iq}\sum_{p}B_{qp}C_{pj}$. _[Las sumas finitas se pueden reordenar y distribuir]_
- **L4** ← L3 — La suma interior es $(BC)_{qj}$ y la exterior es la definición de $(A(BC))_{ij}$. _[Producto de matrices: (AB)ᵢⱼ = Σₖ aᵢₖ bₖⱼ]_
- **L5** ← L4 — Las entradas coinciden para todo $(i,j)$, así que $(AB)C=A(BC)$. ∎ _[Lo probado para un elemento arbitrario vale para todos los elementos]_

**Líneas distractoras (falsas a propósito).**

- Con matrices $2\times2$ concretas se comprueba que $(AB)C=A(BC)$; luego siempre. — _falla:_ un ejemplo no prueba el caso general
- Como el producto de números es asociativo, el de matrices también lo es. — _falla:_ las entradas son sumas de productos: hay que reordenar las sumas

**Errores para «cazar el error».**

- Sustituye **L1**: Por definición, $((AB)C)_{ij}=\sum_{p}(AB)_{pi}C_{pj}$. — _diagnóstico:_ Error de cálculo: el resultado de la línea no sale de la anterior
- Sustituye **L3**: Intercambiamos $A$ y $B$ dentro de la suma: $\sum A_{qi}B\cdots$ — _diagnóstico:_ La conclusión no se sigue de lo anterior (falacia)

**Estrategias.**

- ✓ válida: Comparar la entrada $(i,j)$ de ambos lados con la definición del producto — Es la prueba estándar.
- ✗ no sirve: Verificar un ejemplo concreto — Un ejemplo ilustra, pero no prueba un enunciado general.
- ✗ no sirve: Suponer lo que se quiere probar — Eso es un argumento circular.
- ✗ no sirve: Apoyarse en un dibujo o en la intuición — Ayuda a entender, pero no es una demostración.

### Transpuesta de un producto — `t.mat-transpuesta-producto` (nivel 4.1)

**Enunciado.** $(AB)^T=B^TA^T$.

**Hipótesis.** $A$ es $m\times n$ y $B$ es $n\times p$; Puedes usar las definiciones de producto y de transpuesta

**Depende de.** nada previo (solo definiciones y propiedades base)

**Demostración (grafo de dependencias entre líneas).** Cualquier orden que respete las flechas se acepta.

- **L1** ← ∅ — Los tamaños coinciden: $(AB)^T$ es $p\times m$ y $B^TA^T$ es $(p\times n)(n\times m)=p\times m$. _[Producto de matrices: (AB)ᵢⱼ = Σₖ aᵢₖ bₖⱼ]_
- **L2** ← L1 — Por definición de transpuesta, $((AB)^T)_{rs}=(AB)_{sr}$. _[Transpuesta: (Aᵀ)ᵢⱼ = Aⱼᵢ]_
- **L3** ← L2 — Por definición del producto, $(AB)_{sr}=\sum_{p}A_{sp}B_{pr}$. _[Producto de matrices: (AB)ᵢⱼ = Σₖ aᵢₖ bₖⱼ]_
- **L4** ← L3 — Como $A_{sp}=(A^T)_{ps}$ y $B_{pr}=(B^T)_{rp}$, la suma es $\sum_{p}(B^T)_{rp}(A^T)_{ps}$ (el producto de números es conmutativo). _[Transpuesta: (Aᵀ)ᵢⱼ = Aⱼᵢ]_
- **L5** ← L4 — Eso es $(B^TA^T)_{rs}$ por la definición del producto. Las entradas coinciden: $(AB)^T=B^TA^T$. ∎ _[Producto de matrices: (AB)ᵢⱼ = Σₖ aᵢₖ bₖⱼ]_

**Líneas distractoras (falsas a propósito).**

- Con $A=\begin{pmatrix}1&2\\0&1\end{pmatrix}$ y $B=I$ se cumple; luego siempre. — _falla:_ un ejemplo no prueba el caso general
- Trasponer reparte sobre el producto: $(AB)^T=A^TB^T$. — _falla:_ el orden se invierte; $A^TB^T$ ni siquiera tiene el tamaño correcto en general

**Errores para «cazar el error».**

- Sustituye **L2**: Por definición de transpuesta, $((AB)^T)_{rs}=(AB)_{rs}$. — _diagnóstico:_ Error de cálculo: el resultado de la línea no sale de la anterior
- Sustituye **L4**: Como $A_{sp}=(A^T)_{sp}$, la suma es $\sum(A^T)_{sp}(B^T)_{pr}$. — _diagnóstico:_ Error de cálculo: el resultado de la línea no sale de la anterior

**Estrategias.**

- ✓ válida: Comparar entradas con las definiciones de transpuesta y producto — Es la prueba estándar.
- ✗ no sirve: Verificar un ejemplo concreto — Un ejemplo ilustra, pero no prueba un enunciado general.
- ✗ no sirve: Suponer lo que se quiere probar — Eso es un argumento circular.
- ✗ no sirve: Apoyarse en un dibujo o en la intuición — Ayuda a entender, pero no es una demostración.

### Unicidad de la inversa — `t.mat-inversa-unica` (nivel 4.1)

**Enunciado.** Si $A$ tiene inversa, es única.

**Hipótesis.** $AX=XA=I$ y $AY=YA=I$; Puedes citar la asociatividad del producto

**Depende de.** `t.mat-producto-asoc`

**Demostración (grafo de dependencias entre líneas).** Cualquier orden que respete las flechas se acepta.

- **L1** ← ∅ — Partimos de $X=XI$, porque $I$ es el neutro del producto. _[Inversa de A: una matriz B con AB = BA = I]_
- **L2** ← L1 — Como $Y$ es inversa de $A$, $I=AY$; entonces $X=X(AY)$. _[Inversa de A: una matriz B con AB = BA = I]_
- **L3** ← L2 — Por la asociatividad, $X(AY)=(XA)Y$. _[Asociatividad del producto]_
- **L4** ← L3 — Como $X$ es inversa de $A$, $XA=I$ y $(XA)Y=IY=Y$. _[Inversa de A: una matriz B con AB = BA = I]_
- **L5** ← L4 — Encadenando, $X=Y$. ∎ _[Lo probado para un elemento arbitrario vale para todos los elementos]_

**Líneas distractoras (falsas a propósito).**

- Con $A=I$ la inversa es $I$ y es única; luego siempre. — _falla:_ un ejemplo no prueba el caso general
- Dos inversas deben coincidir porque ambas multiplican a $A$ y dan $I$. — _falla:_ es lo que hay que probar: se necesita una cadena de igualdades

**Errores para «cazar el error».**

- Sustituye **L3**: Por la conmutatividad, $X(AY)=(AX)Y$. — _diagnóstico:_ La conclusión no se sigue de lo anterior (falacia)
- Sustituye **L4**: Como $X$ es inversa de $A$, $XA=0$. — _diagnóstico:_ Error de cálculo: el resultado de la línea no sale de la anterior

**Estrategias.**

- ✓ válida: Escribir $B=B(AC)=(BA)C=C$ — Es la prueba estándar.
- ✗ no sirve: Verificar un ejemplo concreto — Un ejemplo ilustra, pero no prueba un enunciado general.
- ✗ no sirve: Suponer lo que se quiere probar — Eso es un argumento circular.
- ✗ no sirve: Apoyarse en un dibujo o en la intuición — Ayuda a entender, pero no es una demostración.

### Inversa de un producto — `t.mat-inversa-producto` (nivel 4.1)

**Enunciado.** Si $A,B$ son invertibles, $(AB)^{-1}=B^{-1}A^{-1}$.

**Hipótesis.** $P$ y $Q$ invertibles; Puedes citar la unicidad de la inversa y la asociatividad

**Depende de.** `t.mat-inversa-unica`

**Demostración (grafo de dependencias entre líneas).** Cualquier orden que respete las flechas se acepta.

- **L1** ← ∅ — Calculamos $(PQ)(Q^{-1}P^{-1})=P(QQ^{-1})P^{-1}$ por asociatividad. _[Asociatividad del producto]_
- **L2** ← L1 — Como $QQ^{-1}=I$: $PIP^{-1}=PP^{-1}=I$. _[Inversa de A: una matriz B con AB = BA = I]_
- **L3** ← L2 — Análogamente $(Q^{-1}P^{-1})(PQ)=Q^{-1}(P^{-1}P)Q=Q^{-1}Q=I$. _[Inversa de A: una matriz B con AB = BA = I]_
- **L4** ← L2, L3 — Luego $Q^{-1}P^{-1}$ es una inversa de $PQ$, y por la unicidad de la inversa, es **la** inversa. ∎ _[Unicidad de la inversa]_

**Líneas distractoras (falsas a propósito).**

- Con $P=Q=2I$ se cumple; luego siempre. — _falla:_ un ejemplo no prueba el caso general
- Como cada una se invierte, el producto se invierte en el mismo orden: $P^{-1}Q^{-1}$. — _falla:_ el orden se invierte; hay que comprobarlo multiplicando

**Errores para «cazar el error».**

- Sustituye **L1**: Calculamos $(PQ)(P^{-1}Q^{-1})=P(QP^{-1})Q^{-1}$. — _diagnóstico:_ La conclusión no se sigue de lo anterior (falacia)
- Sustituye **L3**: $(Q^{-1}P^{-1})(PQ)=Q^{-1}(P^{-1}P)Q=0$. — _diagnóstico:_ Error de cálculo: el resultado de la línea no sale de la anterior

**Estrategias.**

- ✓ válida: Multiplicar $AB$ por $B^{-1}A^{-1}$ en los dos órdenes y usar unicidad — Es la prueba estándar.
- ✗ no sirve: Verificar un ejemplo concreto — Un ejemplo ilustra, pero no prueba un enunciado general.
- ✗ no sirve: Suponer lo que se quiere probar — Eso es un argumento circular.
- ✗ no sirve: Apoyarse en un dibujo o en la intuición — Ayuda a entender, pero no es una demostración.

### Operaciones elementales — `t.ops-elementales` (nivel 4.2)

**Enunciado.** Las operaciones elementales por filas no cambian el conjunto de soluciones de un sistema.

**Hipótesis.** $S₂$ resulta de $Σ$ por una operación elemental; Puedes usar que cada operación elemental se deshace con otra del mismo tipo

**Depende de.** nada previo (solo definiciones y propiedades base)

**Demostración (grafo de dependencias entre líneas).** Cualquier orden que respete las flechas se acepta.

- **L1** ← ∅ — Sea $x$ una solución de $Σ$. Veamos que lo es de $S₂$ según el tipo de operación (casos). _[División en casos que cubren todas las posibilidades]_
- **L2** ← L1 — Intercambiar dos ecuaciones no cambia el conjunto de condiciones; multiplicar una ecuación por $c\neq0$ conserva la igualdad que $x$ cumple. _[Operaciones elementales por filas: intercambiar dos filas, multiplicar una por c ≠ 0, sumar a una un múltiplo de otra]_
- **L3** ← L1 — Sumar a la ecuación $i$ el múltiplo $c$ de la $j$: si $x$ cumple ambas, cumple su combinación $e_i+ce_j$. _[Sistema lineal Ax = b; su conjunto de soluciones]_
- **L4** ← L2, L3 — Así toda solución de $Σ$ lo es de $S₂$. Recíprocamente, la operación inversa (intercambiar de nuevo, multiplicar por $1/c$, sumar $-ce_j$) lleva $S₂$ a $Σ$, luego toda solución de $S₂$ lo es de $Σ$. ∎ _[Operaciones elementales por filas: intercambiar dos filas, multiplicar una por c ≠ 0, sumar a una un múltiplo de otra]_

**Líneas distractoras (falsas a propósito).**

- Probamos con un sistema $2\times2$ y las soluciones no cambian; luego siempre. — _falla:_ un ejemplo no prueba el caso general
- Como la nueva ecuación sale de las otras, tiene las mismas soluciones. — _falla:_ falta la dirección contraria: que la operación se pueda deshacer

**Errores para «cazar el error».**

- Sustituye **L2**: Multiplicar una ecuación por $c$ conserva la igualdad aunque $c=0$. — _diagnóstico:_ La conclusión no se sigue de lo anterior (falacia)
- Sustituye **L4**: Con esto basta: toda solución de $S₂$ lo es de $Σ$ sin más. — _diagnóstico:_ La conclusión no se sigue de lo anterior (falacia)

**Estrategias.**

- ✓ válida: Probar que las soluciones se conservan y que la operación es reversible — Es la prueba estándar.
- ✓ válida: Ver cada operación como multiplicar por una matriz invertible $E$: $Ax=b\iff EAx=Eb$ — Válida y más corta.
- ✗ no sirve: Verificar un ejemplo concreto — Un ejemplo ilustra, pero no prueba un enunciado general.
- ✗ no sirve: Suponer lo que se quiere probar — Eso es un argumento circular.

### Solución general — `t.solucion-general` (nivel 4.2)

**Enunciado.** Si $Ax_p=b$, las soluciones de $Ax=b$ son exactamente $x_p+h$ con $Ah=0$.

**Hipótesis.** $Ax_p=b$; Puedes usar que el producto de matrices es distributivo

**Depende de.** nada previo (solo definiciones y propiedades base)

**Demostración (grafo de dependencias entre líneas).** Cualquier orden que respete las flechas se acepta.

- **L1** ← ∅ — Probamos las dos implicaciones. _[Para probar P ⟺ Q se prueban P ⇒ Q y Q ⇒ P]_
- **L2** ← L1 — (⇒) Si $Av=b$, sea $w=v-x_p$. Entonces $Aw=Av-Ax_p=b-b=0$ y $v=x_p+w$. _[Álgebra de los números: operar, despejar, sustituir]_
- **L3** ← L1 — (⇐) Si $v=x_p+w$ con $Aw=0$, por distributividad $Av=Ax_p+Aw$, que es $b+0=b$. _[Álgebra de los números: operar, despejar, sustituir]_
- **L4** ← L2, L3 — Por tanto el conjunto de soluciones es $\{x_p+w:Aw=0\}$. ∎ _[Para probar P ⟺ Q se prueban P ⇒ Q y Q ⇒ P]_

**Líneas distractoras (falsas a propósito).**

- Con $A=(1\ 1)$ y $b=2$ vale para $x_p=(1,1)$; luego siempre. — _falla:_ un ejemplo no prueba el caso general
- Las soluciones de $Av=b$ son exactamente las de $Av=0$. — _falla:_ solo es cierto si $b=0$

**Errores para «cazar el error».**

- Sustituye **L2**: (⇒) Sea $w=v+x_p$; entonces $Aw=2b$. — _diagnóstico:_ Error de cálculo: el resultado de la línea no sale de la anterior
- Sustituye **L3**: $Av=Ax_p\cdot Aw=b\cdot 0=0$. — _diagnóstico:_ Error de cálculo: el resultado de la línea no sale de la anterior

**Estrategias.**

- ✓ válida: Restar dos soluciones y usar linealidad — Es la prueba estándar.
- ✗ no sirve: Verificar un ejemplo concreto — Un ejemplo ilustra, pero no prueba un enunciado general.
- ✗ no sirve: Suponer lo que se quiere probar — Eso es un argumento circular.
- ✗ no sirve: Apoyarse en un dibujo o en la intuición — Ayuda a entender, pero no es una demostración.

### Homogéneos con más incógnitas — `t.homogeneo-libres` (nivel 4.2)

**Enunciado.** Un sistema homogéneo con más incógnitas que ecuaciones tiene una solución no trivial.

**Hipótesis.** $Ax=0$ con $A$ de tamaño $m\times q$ y $q>m$; Puedes citar que las operaciones elementales conservan las soluciones

**Depende de.** `t.ops-elementales`

**Demostración (grafo de dependencias entre líneas).** Cualquier orden que respete las flechas se acepta.

- **L1** ← ∅ — Escalonamos $A$ a su forma reducida $R$; por el teorema de las operaciones elementales, $Ax=0$ y $Rx=0$ tienen las mismas soluciones. _[Operaciones elementales]_
- **L2** ← L1 — Cada fila de $R$ tiene a lo sumo un pivote, así que hay a lo sumo $m$ pivotes. _[Forma escalonada reducida: pivotes 1 con ceros arriba y abajo]_
- **L3** ← L2 — Como hay $q>m$ columnas, al menos una columna no tiene pivote: es una variable libre. _[Forma escalonada reducida: pivotes 1 con ceros arriba y abajo]_
- **L4** ← L3 — Damos a esa variable el valor $1$ (y $0$ a las demás libres) y despejamos las variables pivote; obtenemos $x\neq0$ con $Rx=0$. _[Sistema lineal Ax = b; su conjunto de soluciones]_
- **L5** ← L1, L4 — Por L1, $Ax=0$. ∎ _[Operaciones elementales]_

**Líneas distractoras (falsas a propósito).**

- Con $x+y=0$ (una ecuación, dos incógnitas) hay solución no trivial $(1,-1)$; luego siempre. — _falla:_ un ejemplo no prueba el caso general
- Un sistema homogéneo siempre tiene la solución $x=0$. — _falla:_ eso es la solución trivial; aquí se pide una no trivial

**Errores para «cazar el error».**

- Sustituye **L2**: Cada fila de $R$ puede tener varios pivotes, así que hay a lo sumo $q$ pivotes. — _diagnóstico:_ Error de cálculo: el resultado de la línea no sale de la anterior
- Sustituye **L4**: Damos a la variable libre el valor $0$ y despejamos. — _diagnóstico:_ La conclusión no se sigue de lo anterior (falacia)

**Estrategias.**

- ✓ válida: Contar pivotes en la forma reducida y dar valor $1$ a una variable libre — Es la prueba estándar.
- ✗ no sirve: Verificar un ejemplo concreto — Un ejemplo ilustra, pero no prueba un enunciado general.
- ✗ no sirve: Suponer lo que se quiere probar — Eso es un argumento circular.
- ✗ no sirve: Apoyarse en un dibujo o en la intuición — Ayuda a entender, pero no es una demostración.

### Criterio de incompatibilidad — `t.incompatible` (nivel 4.2)

**Enunciado.** Un sistema es incompatible si y solo si al escalonar aparece una fila $(0\ \cdots\ 0\mid c)$ con $c\neq0$.

**Hipótesis.** $R$ es la forma escalonada reducida de $(A\mid b)$; Puedes citar el teorema de las operaciones elementales

**Depende de.** `t.ops-elementales`

**Demostración (grafo de dependencias entre líneas).** Cualquier orden que respete las flechas se acepta.

- **L1** ← ∅ — Por el teorema de las operaciones elementales, el sistema original y el de $R$ tienen las mismas soluciones. _[Operaciones elementales]_
- **L2** ← L1 — (⇐) Si hay una fila $(0\cdots0\mid k)$ con $k\neq0$, esa ecuación es $0=k$, imposible: no hay soluciones. _[Sistema lineal Ax = b; su conjunto de soluciones]_
- **L3** ← L1 — (⇒) Si no hay tal fila, cada fila no nula tiene un pivote. Damos a las variables libres el valor $0$ y a cada variable pivote el valor de la última columna de su fila. _[Forma escalonada reducida: pivotes 1 con ceros arriba y abajo]_
- **L4** ← L2, L3 — Esto satisface cada ecuación de $R$, luego el sistema es compatible. Por contrarrecíproco, incompatible implica que existe la fila $(0\cdots0\mid k\neq0)$. ∎ _[Para probar P ⟺ Q se prueban P ⇒ Q y Q ⇒ P]_

**Líneas distractoras (falsas a propósito).**

- Con $x+y=1$ y $x+y=2$ aparece $0=1$; luego siempre. — _falla:_ un ejemplo no prueba el caso general
- Si hay más ecuaciones que incógnitas, es incompatible. — _falla:_ puede ser compatible (por ejemplo, ecuaciones repetidas)

**Errores para «cazar el error».**

- Sustituye **L2**: Si hay una fila $(0\cdots0\mid 0)$, esa ecuación es $0=0$, imposible. — _diagnóstico:_ Error de cálculo: el resultado de la línea no sale de la anterior
- Sustituye **L3**: Damos a las variables pivote el valor $0$ y a las libres el valor de la última columna. — _diagnóstico:_ Error de cálculo: el resultado de la línea no sale de la anterior

**Estrategias.**

- ✓ válida: Comparar el rango de $A$ con el de $(A\mid b)$ — Válida: es equivalente a este criterio (Rouché-Capelli).
- ✗ no sirve: Verificar un ejemplo concreto — Un ejemplo ilustra, pero no prueba un enunciado general.
- ✗ no sirve: Suponer lo que se quiere probar — Eso es un argumento circular.
- ✗ no sirve: Apoyarse en un dibujo o en la intuición — Ayuda a entender, pero no es una demostración.

### Rouché-Capelli — `t.rouche-capelli` (nivel 4.3)

**Enunciado.** $Ax=b$ es compatible si y solo si $\operatorname{rango}A=\operatorname{rango}(A\mid b)$.

**Hipótesis.** $C$ es $m\times n$ y $c\in\mathbb{Q}^m$; Puedes citar el criterio de incompatibilidad

**Depende de.** `t.incompatible`

**Demostración (grafo de dependencias entre líneas).** Cualquier orden que respete las flechas se acepta.

- **L1** ← ∅ — Escalonamos $(C\mid c)$; las mismas operaciones, restringidas a las primeras $n$ columnas, escalonan $C$. _[Forma escalonada reducida: pivotes 1 con ceros arriba y abajo]_
- **L2** ← L1 — Los pivotes de $C$ son los pivotes de $(C\mid c)$ en las primeras $n$ columnas; la última columna tiene pivote o no. _[Rango de A: número de pivotes de su forma escalonada reducida]_
- **L3** ← L2 — Si la última columna tiene pivote, hay una fila $(0\cdots0\mid 1)$ y $\operatorname{rango}(C\mid c)=\operatorname{rango}C+1$; si no, los rangos coinciden. _[Rango de A: número de pivotes de su forma escalonada reducida]_
- **L4** ← L3 — Por el criterio de incompatibilidad, la fila $(0\cdots0\mid 1)$ aparece si y solo si el sistema es incompatible. _[Criterio de incompatibilidad]_
- **L5** ← L3, L4 — Luego es compatible si y solo si los rangos coinciden. ∎ _[Para probar P ⟺ Q se prueban P ⇒ Q y Q ⇒ P]_

**Líneas distractoras (falsas a propósito).**

- Con un sistema $2\times2$ de rangos iguales hay solución; luego siempre. — _falla:_ un ejemplo no prueba el caso general
- Si $\operatorname{rango}C=n$ siempre hay solución. — _falla:_ falso: con más ecuaciones que incógnitas puede ser incompatible

**Errores para «cazar el error».**

- Sustituye **L3**: Si la última columna tiene pivote, $\operatorname{rango}(C\mid c)=\operatorname{rango}C-1$. — _diagnóstico:_ Error de cálculo: el resultado de la línea no sale de la anterior
- Sustituye **L5**: Luego es incompatible si y solo si los rangos coinciden. — _diagnóstico:_ La conclusión no se sigue de lo anterior (falacia)

**Estrategias.**

- ✓ válida: Analizar si la última columna tiene pivote — Es la prueba estándar.
- ✗ no sirve: Verificar un ejemplo concreto — Un ejemplo ilustra, pero no prueba un enunciado general.
- ✗ no sirve: Suponer lo que se quiere probar — Eso es un argumento circular.
- ✗ no sirve: Apoyarse en un dibujo o en la intuición — Ayuda a entender, pero no es una demostración.

### Inversa por Gauss-Jordan — `t.inversa-gauss` (nivel 4.3)

**Enunciado.** $A$ ($n\times n$) es invertible si y solo si su forma reducida es $I$; entonces $(A\mid I)\to(I\mid A^{-1})$.

**Hipótesis.** $A$ es $n\times n$; Puedes citar las operaciones elementales y la inversa de un producto

**Depende de.** `t.ops-elementales`, `t.mat-inversa-producto`

**Demostración (grafo de dependencias entre líneas).** Cualquier orden que respete las flechas se acepta.

- **L1** ← ∅ — (⇒) Si $A$ es invertible y $Ax=0$, entonces $x=A^{-1}Ax=0$: solo hay la solución trivial. _[A es invertible si existe B con AB = BA = I]_
- **L2** ← L1 — Si la reducida tuviera una columna sin pivote habría una variable libre y una solución no trivial; luego hay $n$ pivotes en $n$ columnas y la reducida es $I$. _[Forma escalonada reducida: pivotes 1 con ceros arriba y abajo]_
- **L3** ← ∅ — (⇐) Si la reducida es $I$, cada operación elemental es multiplicar por una matriz invertible $E_i$: $E_k\cdots E_1A=I$. _[Operaciones elementales]_
- **L4** ← L3 — Entonces $A=E_1^{-1}\cdots E_k^{-1}$ es un producto de invertibles, así que $A$ es invertible y su inversa es $E_k\cdots E_1$. ∎ _[Inversa de un producto]_

**Líneas distractoras (falsas a propósito).**

- Con $A=\begin{pmatrix}1&1\\0&1\end{pmatrix}$ la reducida es $I$ y es invertible; luego siempre. — _falla:_ un ejemplo no prueba el caso general
- Como todas las matrices cuadradas se reducen, todas son invertibles. — _falla:_ se reducen, pero no siempre a $I$

**Errores para «cazar el error».**

- Sustituye **L1**: Si $A$ es invertible y $Ax=0$, entonces $x=Ax\cdot A^{-1}=0$. — _diagnóstico:_ Error de cálculo: el resultado de la línea no sale de la anterior
- Sustituye **L3**: Si la reducida es $I$, $E_1\cdots E_kA=I$. — _diagnóstico:_ Error de cálculo: el resultado de la línea no sale de la anterior

**Estrategias.**

- ✓ válida: Interpretar cada operación elemental como multiplicar por una matriz invertible — Es la prueba estándar.
- ✗ no sirve: Verificar un ejemplo concreto — Un ejemplo ilustra, pero no prueba un enunciado general.
- ✗ no sirve: Suponer lo que se quiere probar — Eso es un argumento circular.
- ✗ no sirve: Apoyarse en un dibujo o en la intuición — Ayuda a entender, pero no es una demostración.

### Criterios de invertibilidad — `t.invertible-equivalencias` (nivel 4.3)

**Enunciado.** Para $A$ cuadrada $n\times n$: $A$ invertible $\iff$ $Ax=0$ solo tiene $x=0$ $\iff$ $\operatorname{rango}A=n$.

**Hipótesis.** $B$ es $n\times n$; Puedes citar el criterio de Gauss-Jordan para la inversa

**Depende de.** `t.inversa-gauss`

**Demostración (grafo de dependencias entre líneas).** Cualquier orden que respete las flechas se acepta.

- **L1** ← ∅ — (1⇒2) Si $B$ es invertible y $Bv=0$: $v=B^{-1}(Bv)=B^{-1}0=0$. _[A es invertible si existe B con AB = BA = I]_
- **L2** ← L1 — (2⇒3) Si $\operatorname{rango}B<n$, hay una columna sin pivote, es decir una variable libre; poniéndole $1$ se obtiene $v\neq0$ con $Bv=0$, contra (2). Luego $\operatorname{rango}B=n$. _[Forma escalonada reducida: pivotes 1 con ceros arriba y abajo]_
- **L3** ← L2 — (3⇒1) Con $n$ pivotes en $n$ columnas la reducida de $B$ es $I$. _[Rango de A: número de pivotes de su forma escalonada reducida]_
- **L4** ← L3 — Por el criterio de Gauss-Jordan, $B$ es invertible. Hemos cerrado el ciclo $1\Rightarrow2\Rightarrow3\Rightarrow1$. ∎ _[Inversa por Gauss-Jordan]_

**Líneas distractoras (falsas a propósito).**

- Con $B=I$ las tres condiciones se cumplen; luego siempre. — _falla:_ un ejemplo no prueba el caso general
- Basta probar (1⇒2) para tener la equivalencia. — _falla:_ una sola implicación no da equivalencia

**Errores para «cazar el error».**

- Sustituye **L1**: (1⇒2) $v=(Bv)B^{-1}=0$. — _diagnóstico:_ Error de cálculo: el resultado de la línea no sale de la anterior
- Sustituye **L3**: (3⇒1) Con $n$ pivotes la reducida de $B$ es $0$. — _diagnóstico:_ Error de cálculo: el resultado de la línea no sale de la anterior

**Estrategias.**

- ✓ válida: Demostrar el ciclo $1\Rightarrow2\Rightarrow3\Rightarrow1$ — Es la prueba estándar.
- ✗ no sirve: Verificar un ejemplo concreto — Un ejemplo ilustra, pero no prueba un enunciado general.
- ✗ no sirve: Suponer lo que se quiere probar — Eso es un argumento circular.
- ✗ no sirve: Apoyarse en un dibujo o en la intuición — Ayuda a entender, pero no es una demostración.

### Rango más nulidad — `t.nulidad` (nivel 4.3)

**Enunciado.** El sistema $Ax=0$ ($A$ de tamaño $m\times n$) tiene $n-\operatorname{rango}A$ variables libres.

**Hipótesis.** $A$ es $m\times q$ con forma reducida $R$; Puedes citar la descripción de la solución general

**Depende de.** `t.solucion-general`

**Demostración (grafo de dependencias entre líneas).** Cualquier orden que respete las flechas se acepta.

- **L1** ← ∅ — Las soluciones de $Ax=0$ y de $Rx=0$ coinciden; cada una de las $q$ columnas de $R$ es pivote o libre. _[Forma escalonada reducida: pivotes 1 con ceros arriba y abajo]_
- **L2** ← L1 — Hay $\operatorname{rango}A$ columnas pivote, así que hay $q-\operatorname{rango}A$ columnas libres. _[Rango de A: número de pivotes de su forma escalonada reducida]_
- **L3** ← L2 — Cada fila de $R$ expresa su variable pivote en función de las libres: elegidas las libres arbitrariamente, las pivote quedan determinadas. _[Lo probado para un elemento arbitrario vale para todos los elementos]_
- **L4** ← L3 — Por la descripción de la solución general (con $b=0$ y $x_p=0$), el conjunto de soluciones se parametriza por las libres: $q-\operatorname{rango}A$ parámetros. ∎ _[Solución general]_

**Líneas distractoras (falsas a propósito).**

- En $x+y=0$ hay un parámetro, que es $2-1$; luego siempre. — _falla:_ un ejemplo no prueba el caso general
- El número de parámetros es $m-\operatorname{rango}A$. — _falla:_ los parámetros se cuentan con columnas, no con filas

**Errores para «cazar el error».**

- Sustituye **L2**: Hay $\operatorname{rango}A$ columnas libres y $q-\operatorname{rango}A$ pivote. — _diagnóstico:_ Error de cálculo: el resultado de la línea no sale de la anterior
- Sustituye **L3**: Fijadas las pivote arbitrariamente, quedan determinadas las libres. — _diagnóstico:_ La conclusión no se sigue de lo anterior (falacia)

**Estrategias.**

- ✓ válida: Clasificar las columnas en pivote y libres — Es la prueba estándar.
- ✗ no sirve: Verificar un ejemplo concreto — Un ejemplo ilustra, pero no prueba un enunciado general.
- ✗ no sirve: Suponer lo que se quiere probar — Eso es un argumento circular.
- ✗ no sirve: Apoyarse en un dibujo o en la intuición — Ayuda a entender, pero no es una demostración.

### Determinante e inversa (2×2) — `t.det-invertible-2x2` (nivel 4.4)

**Enunciado.** $\begin{pmatrix}a&b\\c&d\end{pmatrix}$ es invertible si y solo si $ad-bc\neq0$, con inversa $\frac{1}{ad-bc}\begin{pmatrix}d&-b\\-c&a\end{pmatrix}$.

**Hipótesis.** $A$ es una matriz $2\times2$ con entradas racionales; Puedes citar la unicidad de la inversa

**Depende de.** `t.mat-inversa-unica`

**Demostración (grafo de dependencias entre líneas).** Cualquier orden que respete las flechas se acepta.

- **L1** ← ∅ — Sea $B=\begin{pmatrix}d&-q\\-c&p\end{pmatrix}$. Un cálculo directo da $AB=BA=\Delta I$. _[Inversa de A: una matriz B con AB = BA = I]_
- **L2** ← L1 — (⇐) Si $\Delta\neq0$, $\frac1\Delta B$ cumple $A(\frac1\Delta B)=(\frac1\Delta B)A=I$: es la inversa de $A$. _[Inversa de A: una matriz B con AB = BA = I]_
- **L3** ← L1 — (⇒) Por contradicción, supongamos $\Delta=0$ y $A$ invertible. Entonces $AB=0$ y, multiplicando por $A^{-1}$ a la izquierda, $B=0$. _[Reducción al absurdo: si suponer lo contrario lleva a una contradicción, lo supuesto es falso]_
- **L4** ← L3 — Si $B=0$ entonces $p=q=c=d=0$, así que $A=0$, que no es invertible: contradicción. Luego $\Delta\neq0$. ∎ _[Unicidad de la inversa]_

**Líneas distractoras (falsas a propósito).**

- Con $A=\begin{pmatrix}1&2\\3&4\end{pmatrix}$, $\Delta=-2\neq0$ y es invertible; luego siempre. — _falla:_ un ejemplo no prueba el caso general
- Si $\Delta=0$ entonces $A=0$. — _falla:_ falso: $\begin{pmatrix}1&1\\1&1\end{pmatrix}$ tiene $\Delta=0$ y no es nula

**Errores para «cazar el error».**

- Sustituye **L1**: Sea $B=\begin{pmatrix}d&q\\c&p\end{pmatrix}$. Un cálculo directo da $AB=BA=\Delta I$. — _diagnóstico:_ Error de cálculo: el resultado de la línea no sale de la anterior
- Sustituye **L2**: (⇐) Si $\Delta\neq0$, $\Delta B$ cumple $A(\Delta B)=I$. — _diagnóstico:_ Error de cálculo: el resultado de la línea no sale de la anterior

**Estrategias.**

- ✓ válida: Multiplicar $A$ por su adjunta y usar $AB=\Delta I$ — Es la prueba estándar.
- ✗ no sirve: Verificar un ejemplo concreto — Un ejemplo ilustra, pero no prueba un enunciado general.
- ✗ no sirve: Suponer lo que se quiere probar — Eso es un argumento circular.
- ✗ no sirve: Apoyarse en un dibujo o en la intuición — Ayuda a entender, pero no es una demostración.

### Determinante de un producto (2×2) — `t.det-producto-2x2` (nivel 4.4)

**Enunciado.** Para matrices $2\times2$, $\det(AB)=\det A\cdot\det B$.

**Hipótesis.** $A$ y $B$ son $2\times2$; Puedes desarrollar productos y usar propiedades de cuerpo

**Depende de.** nada previo (solo definiciones y propiedades base)

**Demostración (grafo de dependencias entre líneas).** Cualquier orden que respete las flechas se acepta.

- **L1** ← ∅ — $AB=\begin{pmatrix}ae+br&aq+bh\\ze+wr&zq+wh\end{pmatrix}$. _[Producto de matrices: (AB)ᵢⱼ = Σₖ aᵢₖ bₖⱼ]_
- **L2** ← L1 — $\det(AB)=(ae+br)(zq+wh)-(aq+bh)(ze+wr)$. _[Álgebra de los números: operar, despejar, sustituir]_
- **L3** ← L2 — Al desarrollar, los términos $azeq$ y $bwrh$ aparecen con signos opuestos y se cancelan. _[Álgebra de los números: operar, despejar, sustituir]_
- **L4** ← L3 — Quedan $aweh+bzqr-awqr-bzeh=(aw-bz)(eh-qr)$. _[Álgebra de los números: operar, despejar, sustituir]_
- **L5** ← L4 — Eso es $\det A\det B$. ∎ _[Álgebra de los números: operar, despejar, sustituir]_

**Líneas distractoras (falsas a propósito).**

- Con $A=B=I$ se cumple; luego siempre. — _falla:_ un ejemplo no prueba el caso general
- Como el determinante es lineal, $\det(AB)=\det A+\det B$. — _falla:_ el determinante no es lineal en la matriz entera: es multiplicativo

**Errores para «cazar el error».**

- Sustituye **L1**: $AB=\begin{pmatrix}ae&bq\\zr&wh\end{pmatrix}$. — _diagnóstico:_ Error de cálculo: el resultado de la línea no sale de la anterior
- Sustituye **L4**: Quedan $aweh+bzqr=(aw+bz)(eh+qr)$. — _diagnóstico:_ Error de cálculo: el resultado de la línea no sale de la anterior

**Estrategias.**

- ✓ válida: Desarrollar ambos lados y comparar — Es la prueba estándar para $2\times2$.
- ✗ no sirve: Verificar un ejemplo concreto — Un ejemplo ilustra, pero no prueba un enunciado general.
- ✗ no sirve: Suponer lo que se quiere probar — Eso es un argumento circular.
- ✗ no sirve: Apoyarse en un dibujo o en la intuición — Ayuda a entender, pero no es una demostración.

### Regla de Cramer (2×2) — `t.cramer-2x2` (nivel 4.4)

**Enunciado.** Si $\det A\neq0$, la solución de $Ax=b$ es $x_i=\det A_i/\det A$, con $A_i$ la matriz $A$ cambiando su columna $i$ por $b$.

**Hipótesis.** $\Delta\neq 0$; Puedes citar la fórmula de la inversa de una $2\times2$

**Depende de.** `t.det-invertible-2x2`

**Demostración (grafo de dependencias entre líneas).** Cualquier orden que respete las flechas se acepta.

- **L1** ← ∅ — Como $\Delta\neq0$, por el teorema de determinante e inversa, $A^{-1}=\frac1\Delta\begin{pmatrix}s&-b\\-r&p\end{pmatrix}$. _[Determinante e inversa (2×2)]_
- **L2** ← L1 — Multiplicando $A\binom xy=\binom{e}{f}$ por $A^{-1}$ a la izquierda, $\binom xy=A^{-1}\binom{e}{f}$. _[Inversa de A: una matriz B con AB = BA = I]_
- **L3** ← L2 — Calculando el producto, $x=\frac{se-bf}{\Delta}$ e $y=\frac{-re+pf}{\Delta}$. _[Álgebra de los números: operar, despejar, sustituir]_
- **L4** ← L3 — El numerador de $x$ es $\det\begin{pmatrix}e&b\\f&s\end{pmatrix}$ (columna 1 cambiada) y el de $y$ es $\det\begin{pmatrix}p&e\\r&f\end{pmatrix}$. ∎ _[Álgebra de los números: operar, despejar, sustituir]_

**Líneas distractoras (falsas a propósito).**

- Con $x+y=3$, $x-y=1$ da $x=2$, $y=1$; luego la fórmula es correcta. — _falla:_ un ejemplo no prueba el caso general
- La solución es $x=\Delta\cdot e$. — _falla:_ falta la matriz inversa: $x$ es un cociente por $\Delta$

**Errores para «cazar el error».**

- Sustituye **L2**: Multiplicando por $A^{-1}$ a la derecha, $\binom xy=\binom{e}{f}A^{-1}$. — _diagnóstico:_ Error de cálculo: el resultado de la línea no sale de la anterior
- Sustituye **L3**: Calculando, $x=\frac{se+bf}{\Delta}$. — _diagnóstico:_ Error de cálculo: el resultado de la línea no sale de la anterior

**Estrategias.**

- ✓ válida: Usar $x=A^{-1}b$ con la inversa de $2\times2$ — Es la prueba estándar.
- ✗ no sirve: Verificar un ejemplo concreto — Un ejemplo ilustra, pero no prueba un enunciado general.
- ✗ no sirve: Suponer lo que se quiere probar — Eso es un argumento circular.
- ✗ no sirve: Apoyarse en un dibujo o en la intuición — Ayuda a entender, pero no es una demostración.

### Determinante de una triangular — `t.det-triangular` (nivel 4.4)

**Enunciado.** El determinante de una matriz triangular superior es el producto de su diagonal.

**Hipótesis.** $T$ es triangular superior (ceros bajo la diagonal); El determinante se define por desarrollo en la primera columna

**Depende de.** nada previo (solo definiciones y propiedades base)

**Demostración (grafo de dependencias entre líneas).** Cualquier orden que respete las flechas se acepta.

- **L1** ← ∅ — Base: si $n=1$, $\det T=u_{11}$, el producto de su única entrada diagonal. _[Principio de inducción: si P(0) (o P(1)) y P(n)⇒P(n+1), entonces P(n) para todo n]_
- **L2** ← L1 — Paso: supongamos cierto para $(n-1)\times(n-1)$. En $n\times n$, la primera columna de $T$ es $(u_{11},0,\dots,0)^T$. _[Hipótesis de inducción]_
- **L3** ← L2 — En el desarrollo por la primera columna, todos los sumandos con $u_{i1}$, $i\ge2$, son cero, así que $\det T=u_{11}\det M_{11}$. _[Determinante: det A = Σᵢ (−1)^{i+1} aᵢ₁ det(Mᵢ₁), desarrollo por la primera columna]_
- **L4** ← L3 — La submatriz $M_{11}$ es triangular superior $(n-1)\times(n-1)$ con diagonal $u_{22},\dots,u_{nn}$; por hipótesis de inducción $\det M_{11}=u_{22}\cdots u_{nn}$. _[Hipótesis de inducción]_
- **L5** ← L4 — Luego $\det T=u_{11}u_{22}\cdots u_{nn}$. ∎ _[Determinante: det A = Σᵢ (−1)^{i+1} aᵢ₁ det(Mᵢ₁), desarrollo por la primera columna]_

**Líneas distractoras (falsas a propósito).**

- Con $\begin{pmatrix}2&5\\0&3\end{pmatrix}$ el determinante es $6=2\cdot3$; luego siempre. — _falla:_ un ejemplo no prueba el caso general
- Como los ceros anulan todo, el determinante es $0$. — _falla:_ los ceros bajo la diagonal anulan los sumandos, no la diagonal

**Errores para «cazar el error».**

- Sustituye **L3**: Todos los sumandos con $u_{i1}$, $i\ge2$, valen $1$, así que $\det T=u_{11}+\det M_{11}$. — _diagnóstico:_ Error de cálculo: el resultado de la línea no sale de la anterior
- Sustituye **L4**: La submatriz $M_{11}$ tiene diagonal $u_{11},\dots,u_{nn}$. — _diagnóstico:_ Error de cálculo: el resultado de la línea no sale de la anterior

**Estrategias.**

- ✓ válida: Inducción sobre el tamaño con el desarrollo por la primera columna — Es la prueba estándar.
- ✗ no sirve: Verificar un ejemplo concreto — Un ejemplo ilustra, pero no prueba un enunciado general.
- ✗ no sirve: Suponer lo que se quiere probar — Eso es un argumento circular.
- ✗ no sirve: Apoyarse en un dibujo o en la intuición — Ayuda a entender, pero no es una demostración.

### Criterio del subespacio — `t.subespacio-criterio` (nivel 5.1)

**Enunciado.** Un subconjunto no vacío $W\subseteq V$ es subespacio si y solo si es cerrado bajo la suma y bajo el producto por escalares.

**Hipótesis.** $W\neq\emptyset$ y $W\subseteq V$; $u+v\in W$ y $cu\in W$ para $u,v\in W$, $c$ escalar

**Depende de.** nada previo (solo definiciones y propiedades base)

**Demostración (grafo de dependencias entre líneas).** Cualquier orden que respete las flechas se acepta.

- **L1** ← ∅ — Las operaciones están bien definidas en $W$ porque es cerrado bajo la suma y el producto por escalares. _[Subespacio: subconjunto W de V que es espacio vectorial con las mismas operaciones]_
- **L2** ← L1 — Existe $x\in W$ (no vacío); como $0\cdot x\in W$ y $0\cdot x=0$, el cero de $V$ está en $W$. _[Espacio vectorial: conjunto con suma y producto por escalares que cumplen los axiomas (asociatividad, conmutatividad, cero, opuesto, distributividades, neutro del escalar 1)]_
- **L3** ← L1 — Para $x\in W$, $(-1)x\in W$ y $(-1)x=-x$: cada elemento tiene opuesto en $W$. _[Espacio vectorial: conjunto con suma y producto por escalares que cumplen los axiomas (asociatividad, conmutatividad, cero, opuesto, distributividades, neutro del escalar 1)]_
- **L4** ← L1 — Los demás axiomas (asociatividad, conmutatividad, distributividades, $1\cdot x=x$) son igualdades que ya valen para todos los elementos de $V$, en particular para los de $W$. _[Los axiomas de identidades (asociatividad, conmutatividad, distributividad) valen en W porque valen en V]_
- **L5** ← L2, L3, L4 — Se cumplen todos los axiomas: $W$ es espacio vectorial. ∎ _[Espacio vectorial: conjunto con suma y producto por escalares que cumplen los axiomas (asociatividad, conmutatividad, cero, opuesto, distributividades, neutro del escalar 1)]_

**Líneas distractoras (falsas a propósito).**

- El conjunto $\{(x,y):x+y=0\}$ cumple lo pedido y es espacio; luego siempre. — _falla:_ un ejemplo no prueba el caso general
- Como $W\subseteq V$, hereda todos los axiomas sin comprobar nada. — _falla:_ falta ver que el cero y los opuestos están en $W$ y que las operaciones no salen de $W$

**Errores para «cazar el error».**

- Sustituye **L2**: Como $x+x\in W$, el cero está en $W$. — _diagnóstico:_ La conclusión no se sigue de lo anterior (falacia)
- Sustituye **L3**: Para $x\in W$, $2x\in W$ es el opuesto de $x$. — _diagnóstico:_ Error de cálculo: el resultado de la línea no sale de la anterior

**Estrategias.**

- ✓ válida: Comprobar cerradura, cero y opuestos, y heredar el resto de $V$ — Es la prueba estándar.
- ✗ no sirve: Verificar un ejemplo concreto — Un ejemplo ilustra, pero no prueba un enunciado general.
- ✗ no sirve: Suponer lo que se quiere probar — Eso es un argumento circular.
- ✗ no sirve: Apoyarse en un dibujo o en la intuición — Ayuda a entender, pero no es una demostración.

### El núcleo es subespacio — `t.nucleo-subespacio` (nivel 5.1)

**Enunciado.** Para toda matriz $A$, $\ker A=\{x:Ax=0\}$ es un subespacio.

**Hipótesis.** $A$ es una matriz $m\times n$; Puedes citar el criterio del subespacio

**Depende de.** `t.subespacio-criterio`

**Demostración (grafo de dependencias entre líneas).** Cualquier orden que respete las flechas se acepta.

- **L1** ← ∅ — No es vacío: $A\,0=0$, así que $0\in\ker A$. _[Núcleo de A: {x : Ax = 0}]_
- **L2** ← L1 — Sean $x,y\in\ker A$ arbitrarios: $Ax=0$ y $Ay=0$. Por distributividad $A(x+y)=Ax+Ay=0+0=0$. _[Lo probado para un elemento arbitrario vale para todos los elementos]_
- **L3** ← L1 — Para un escalar $λ$, $A(λx)=λ(Ax)=λ\cdot 0$, es decir, $A(λx)=0$. _[Núcleo de A: {x : Ax = 0}]_
- **L4** ← L2, L3 — Luego $\ker A$ es no vacío y cerrado bajo suma y escalares: por el criterio, es un subespacio. ∎ _[Criterio del subespacio]_

**Líneas distractoras (falsas a propósito).**

- Con $A=(1\ 1)$ el núcleo es una recta por el origen; luego siempre. — _falla:_ un ejemplo no prueba el caso general
- Como $Ax=0$ es una ecuación lineal, el conjunto es un subespacio. — _falla:_ es lo que hay que probar: se verifica con el criterio

**Errores para «cazar el error».**

- Sustituye **L2**: $A(x+y)=Ax\cdot Ay=0$. — _diagnóstico:_ Error de cálculo: el resultado de la línea no sale de la anterior
- Sustituye **L1**: No es vacío: $A\,0=1$. — _diagnóstico:_ Error de cálculo: el resultado de la línea no sale de la anterior

**Estrategias.**

- ✓ válida: Verificar no vacío, cerrado bajo suma y bajo escalares — Es la prueba estándar.
- ✗ no sirve: Verificar un ejemplo concreto — Un ejemplo ilustra, pero no prueba un enunciado general.
- ✗ no sirve: Suponer lo que se quiere probar — Eso es un argumento circular.
- ✗ no sirve: Apoyarse en un dibujo o en la intuición — Ayuda a entender, pero no es una demostración.

### Intersección de subespacios — `t.interseccion-subespacios` (nivel 5.1)

**Enunciado.** Si $W_1,W_2$ son subespacios de $V$, $W_1\cap W_2$ también lo es.

**Hipótesis.** $U_1,U_2$ son subespacios de $V$; Puedes citar el criterio del subespacio

**Depende de.** `t.subespacio-criterio`

**Demostración (grafo de dependencias entre líneas).** Cualquier orden que respete las flechas se acepta.

- **L1** ← ∅ — No es vacío: $0\in U_1$ y $0\in U_2$ (ambos son subespacios), así que $0\in U_1\cap U_2$. _[Subespacio: subconjunto W de V que es espacio vectorial con las mismas operaciones]_
- **L2** ← L1 — Sean $u,y\in U_1\cap U_2$. Como están en $U_1$, $u+y\in U_1$; como están en $U_2$, $u+y\in U_2$. Luego $u+y\in U_1\cap U_2$. _[Lo probado para un elemento arbitrario vale para todos los elementos]_
- **L3** ← L1 — Análogamente, para un escalar $λ$, $λu\in U_1$ y $λu\in U_2$ por ser ambos cerrados bajo escalares. _[Subespacio: subconjunto W de V que es espacio vectorial con las mismas operaciones]_
- **L4** ← L2, L3 — Por el criterio del subespacio, $U_1\cap U_2$ es subespacio. ∎ _[Criterio del subespacio]_

**Líneas distractoras (falsas a propósito).**

- En $\mathbb{R}^2$ dos rectas por el origen se cortan en $\{0\}$, que es subespacio; luego siempre. — _falla:_ un ejemplo no prueba el caso general
- Como $U_1\cap U_2\subseteq U_1$, hereda todas las propiedades. — _falla:_ un subconjunto de un subespacio no tiene por qué ser subespacio

**Errores para «cazar el error».**

- Sustituye **L2**: Como $u\in U_1$ y $y\in U_2$, $u+y\in U_1\cap U_2$. — _diagnóstico:_ La conclusión no se sigue de lo anterior (falacia)
- Sustituye **L1**: No es vacío: $0\in U_1$, así que $0\in U_1\cap U_2$. — _diagnóstico:_ La conclusión no se sigue de lo anterior (falacia)

**Estrategias.**

- ✓ válida: Verificar no vacío, suma y escalares usando que cada $W_i$ es subespacio — Es la prueba estándar.
- ✗ no sirve: Verificar un ejemplo concreto — Un ejemplo ilustra, pero no prueba un enunciado general.
- ✗ no sirve: Suponer lo que se quiere probar — Eso es un argumento circular.
- ✗ no sirve: Apoyarse en un dibujo o en la intuición — Ayuda a entender, pero no es una demostración.

### Unión de subespacios — `t.union-subespacio` (nivel 5.1)

**Enunciado.** $W_1\cup W_2$ es subespacio si y solo si $W_1\subseteq W_2$ o $W_2\subseteq W_1$.

**Hipótesis.** $U_1,W_2$ subespacios y $U_1\cup W_2$ subespacio; Puedes razonar por contradicción

**Depende de.** `t.subespacio-criterio`

**Demostración (grafo de dependencias entre líneas).** Cualquier orden que respete las flechas se acepta.

- **L1** ← ∅ — Supongamos por contradicción que ninguna inclusión se cumple: existen $x\in U_1\setminus W_2$ y $y\in W_2\setminus U_1$. _[Reducción al absurdo: si suponer lo contrario lleva a una contradicción, lo supuesto es falso]_
- **L2** ← L1 — Como $x,y\in U_1\cup W_2$, que es subespacio, $x+y\in U_1\cup W_2$: está en $U_1$ o en $W_2$. _[Criterio del subespacio]_
- **L3** ← L2 — Si $x+y\in U_1$, como $x\in U_1$ y $U_1$ es subespacio, $y=(x+y)-x$ pertenece a $U_1$, contra $y\notin U_1$. _[Subespacio: subconjunto W de V que es espacio vectorial con las mismas operaciones]_
- **L4** ← L2 — Si $x+y\in W_2$, de la misma forma $x=(x+y)-y\in W_2$, contra $x\notin W_2$. _[Subespacio: subconjunto W de V que es espacio vectorial con las mismas operaciones]_
- **L5** ← L3, L4 — Ambos casos contradicen; luego $U_1\subseteq W_2$ o $W_2\subseteq U_1$. ∎ _[Reducción al absurdo: si suponer lo contrario lleva a una contradicción, lo supuesto es falso]_

**Líneas distractoras (falsas a propósito).**

- Los ejes de $\mathbb{R}^2$ no cumplen que su unión sea subespacio, así que el resultado es cierto. — _falla:_ un ejemplo no prueba el caso general
- Como la unión contiene ambos subespacios, uno debe contener al otro. — _falla:_ es lo que hay que probar

**Errores para «cazar el error».**

- Sustituye **L2**: Como $x,y\in U_1\cap W_2$, $x+y$ también. — _diagnóstico:_ La conclusión no se sigue de lo anterior (falacia)
- Sustituye **L3**: Si $x+y\in U_1$, entonces $y=(x+y)+x\in U_1$. — _diagnóstico:_ Error de cálculo: el resultado de la línea no sale de la anterior

**Estrategias.**

- ✓ válida: Suponer elementos fuera de cada subespacio y analizar su suma — Es la prueba estándar.
- ✗ no sirve: Verificar un ejemplo concreto — Un ejemplo ilustra, pero no prueba un enunciado general.
- ✗ no sirve: Suponer lo que se quiere probar — Eso es un argumento circular.
- ✗ no sirve: Apoyarse en un dibujo o en la intuición — Ayuda a entender, pero no es una demostración.

### El generado es subespacio — `t.generado-subespacio` (nivel 5.2)

**Enunciado.** $\operatorname{gen}(S)$ es un subespacio y contiene a $S$.

**Hipótesis.** $S=\{v_1,\dots,v_k\}\subseteq V$; Puedes citar el criterio del subespacio

**Depende de.** `t.subespacio-criterio`

**Demostración (grafo de dependencias entre líneas).** Cualquier orden que respete las flechas se acepta.

- **L1** ← ∅ — $v_i=0\cdot v_1+\cdots+1\cdot v_i+\cdots+0\cdot v_k$: cada $v_i$ es combinación lineal de $S$, luego $S\subseteq\operatorname{gen}(S)$ (en particular no es vacío). _[Combinación lineal de v₁,…,vₖ: c₁v₁ + ⋯ + cₖvₖ]_
- **L2** ← L1 — Sean $x=\sum a_iv_i$ y $y=\sum b_iv_i$ en $\operatorname{gen}(S)$. Entonces $x+y=\sum(a_i+b_i)v_i$ por distributividad: es combinación lineal. _[Generado de S: el conjunto de todas las combinaciones lineales de elementos de S]_
- **L3** ← L1 — Para un escalar $α$, $αx=\sum(αa_i)v_i$: también es combinación lineal de $S$ (por distributividad y asociatividad). _[Generado de S: el conjunto de todas las combinaciones lineales de elementos de S]_
- **L4** ← L2, L3 — Por el criterio del subespacio, $\operatorname{gen}(S)$ es subespacio. ∎ _[Criterio del subespacio]_

**Líneas distractoras (falsas a propósito).**

- Con $S=\{(1,0),(0,1)\}$ el generado es $\mathbb{R}^2$, que es subespacio; luego siempre. — _falla:_ un ejemplo no prueba el caso general
- Como $S$ es finito, su generado es finito y por tanto un subespacio. — _falla:_ el generado suele ser infinito; además no es el argumento

**Errores para «cazar el error».**

- Sustituye **L2**: Entonces $x+y=\sum a_ib_iv_i$. — _diagnóstico:_ Error de cálculo: el resultado de la línea no sale de la anterior
- Sustituye **L3**: Para un escalar $α$, $αx=\sum(α+a_i)v_i$. — _diagnóstico:_ Error de cálculo: el resultado de la línea no sale de la anterior

**Estrategias.**

- ✓ válida: Comprobar que el generado contiene a $S$ y es cerrado bajo suma y escalares — Es la prueba estándar.
- ✗ no sirve: Verificar un ejemplo concreto — Un ejemplo ilustra, pero no prueba un enunciado general.
- ✗ no sirve: Suponer lo que se quiere probar — Eso es un argumento circular.
- ✗ no sirve: Apoyarse en un dibujo o en la intuición — Ayuda a entender, pero no es una demostración.

### Dependencia y combinación — `t.dependencia-combinacion` (nivel 5.2)

**Enunciado.** $v_1,\dots,v_k$ son dependientes si y solo si alguno es combinación lineal de los demás.

**Hipótesis.** $v_1,\dots,v_k\in V$; Basta usar la definición de independencia

**Depende de.** nada previo (solo definiciones y propiedades base)

**Demostración (grafo de dependencias entre líneas).** Cualquier orden que respete las flechas se acepta.

- **L1** ← ∅ — (⇒) Si son dependientes, existen $c_i$ no todos cero con $\sum c_iv_i=0$. Sea $j$ con $c_j\neq0$. _[v₁,…,vₖ son independientes si c₁v₁ + ⋯ + cₖvₖ = 0 solo se da con todos los cᵢ = 0]_
- **L2** ← L1 — Despejando, $v_j=-\frac{1}{c_j}\sum_{i\neq j}c_iv_i$ (se puede dividir porque $c_j\neq0$): es combinación lineal de los demás. _[Combinación lineal de v₁,…,vₖ: c₁v₁ + ⋯ + cₖvₖ]_
- **L3** ← L1 — (⇐) Si $v_j=\sum_{i\neq j}a_iv_i$, entonces $1\cdot v_j-\sum_{i\neq j}a_iv_i=0$. _[Combinación lineal de v₁,…,vₖ: c₁v₁ + ⋯ + cₖvₖ]_
- **L4** ← L2, L3 — Es una combinación igual a cero con el coeficiente de $v_j$ igual a $1\neq0$: los vectores son dependientes. ∎ _[v₁,…,vₖ son independientes si c₁v₁ + ⋯ + cₖvₖ = 0 solo se da con todos los cᵢ = 0]_

**Líneas distractoras (falsas a propósito).**

- $(1,0)$, $(2,0)$ son dependientes y el segundo es múltiplo del primero; luego siempre. — _falla:_ un ejemplo no prueba el caso general
- Si $v_1=0$ entonces son independientes. — _falla:_ con el vector cero son dependientes

**Errores para «cazar el error».**

- Sustituye **L2**: Despejando, $v_j=-c_j\sum_{i\neq j}c_iv_i$. — _diagnóstico:_ Error de cálculo: el resultado de la línea no sale de la anterior
- Sustituye **L4**: Es una combinación igual a cero con todos los coeficientes cero: dependientes. — _diagnóstico:_ La conclusión no se sigue de lo anterior (falacia)

**Estrategias.**

- ✓ válida: Usar la definición y despejar un vector — Es la prueba estándar.
- ✗ no sirve: Verificar un ejemplo concreto — Un ejemplo ilustra, pero no prueba un enunciado general.
- ✗ no sirve: Suponer lo que se quiere probar — Eso es un argumento circular.
- ✗ no sirve: Apoyarse en un dibujo o en la intuición — Ayuda a entender, pero no es una demostración.

### Independencia por rango — `t.independencia-matriz` (nivel 5.2)

**Enunciado.** Las columnas de $A$ ($m\times k$) son independientes si y solo si $Ax=0$ solo tiene $x=0$, es decir, $\operatorname{rango}A=k$.

**Hipótesis.** $A=(a_1\ \cdots\ a_k)$; Puedes citar el teorema del rango y las variables libres

**Depende de.** `t.nulidad`

**Demostración (grafo de dependencias entre líneas).** Cualquier orden que respete las flechas se acepta.

- **L1** ← ∅ — Para $c=(x_1,\dots,x_k)^T$, $Ac=x_1a_1+\cdots+x_ka_k$: es la combinación lineal de las columnas con coeficientes $x_i$. _[v₁,…,vₖ son independientes si c₁v₁ + ⋯ + cₖvₖ = 0 solo se da con todos los cᵢ = 0]_
- **L2** ← L1 — Luego las columnas son independientes $\iff$ ($Ac=0\Rightarrow c=0$) $\iff$ el sistema homogéneo solo tiene la solución trivial. _[v₁,…,vₖ son independientes si c₁v₁ + ⋯ + cₖvₖ = 0 solo se da con todos los cᵢ = 0]_
- **L3** ← L2 — Por el teorema de rango más nulidad, $Ac=0$ tiene $k-\operatorname{rango}A$ variables libres. _[Rango más nulidad]_
- **L4** ← L3 — Solo hay la solución trivial $\iff$ no hay variables libres $\iff$ $\operatorname{rango}A=k$. ∎ _[Rango de A: número de pivotes de su forma escalonada reducida]_

**Líneas distractoras (falsas a propósito).**

- Con $A=I$ las columnas son independientes y el rango es $k$; luego siempre. — _falla:_ un ejemplo no prueba el caso general
- Como $A$ tiene $m$ filas, el rango es siempre $m$. — _falla:_ el rango puede ser menor que $m$

**Errores para «cazar el error».**

- Sustituye **L1**: $Ac=x_1+\cdots+x_k$ (suma de los coeficientes). — _diagnóstico:_ Error de cálculo: el resultado de la línea no sale de la anterior
- Sustituye **L4**: Solo hay la solución trivial $\iff$ hay variables libres. — _diagnóstico:_ La conclusión no se sigue de lo anterior (falacia)

**Estrategias.**

- ✓ válida: Escribir la dependencia como $Ax=0$ y contar variables libres — Es la prueba estándar.
- ✗ no sirve: Verificar un ejemplo concreto — Un ejemplo ilustra, pero no prueba un enunciado general.
- ✗ no sirve: Suponer lo que se quiere probar — Eso es un argumento circular.
- ✗ no sirve: Apoyarse en un dibujo o en la intuición — Ayuda a entender, pero no es una demostración.

### Agregar un vector independiente — `t.agregar-independiente` (nivel 5.2)

**Enunciado.** Si $S$ es independiente y $v\notin\operatorname{gen}(S)$, entonces $S\cup\{v\}$ es independiente.

**Hipótesis.** $B$ independiente y $v\notin\operatorname{gen}(B)$; Puedes citar la caracterización de la dependencia

**Depende de.** `t.dependencia-combinacion`

**Demostración (grafo de dependencias entre líneas).** Cualquier orden que respete las flechas se acepta.

- **L1** ← ∅ — Supongamos $a_1v_1+\cdots+a_kv_k+λv=0$. Veamos que todos los coeficientes son cero. _[v₁,…,vₖ son independientes si c₁v₁ + ⋯ + cₖvₖ = 0 solo se da con todos los cᵢ = 0]_
- **L2** ← L1 — Si $λ\neq0$, despejando $v=-\frac{1}{λ}\sum a_iv_i\in\operatorname{gen}(B)$, lo que contradice la hipótesis. _[Reducción al absurdo: si suponer lo contrario lleva a una contradicción, lo supuesto es falso]_
- **L3** ← L2 — Luego $λ=0$ y queda $a_1v_1+\cdots+a_kv_k=0$. _[v₁,…,vₖ son independientes si c₁v₁ + ⋯ + cₖvₖ = 0 solo se da con todos los cᵢ = 0]_
- **L4** ← L3 — Como $B$ es independiente, $a_1=\cdots=a_k=0$. Así todos los coeficientes son cero. ∎ _[v₁,…,vₖ son independientes si c₁v₁ + ⋯ + cₖvₖ = 0 solo se da con todos los cᵢ = 0]_

**Líneas distractoras (falsas a propósito).**

- En $\mathbb{R}^2$, $\{(1,0)\}$ y $(0,1)$ cumplen lo dicho; luego siempre. — _falla:_ un ejemplo no prueba el caso general
- Como $v\neq0$, el conjunto ampliado es independiente. — _falla:_ no basta: $v$ podría estar en el generado

**Errores para «cazar el error».**

- Sustituye **L2**: Si $λ\neq0$, entonces $v\in\operatorname{gen}(B)$ y por tanto no hay contradicción. — _diagnóstico:_ La conclusión no se sigue de lo anterior (falacia)
- Sustituye **L3**: Luego $λ=0$ y queda $a_1v_1+\cdots+a_kv_k=v$. — _diagnóstico:_ Error de cálculo: el resultado de la línea no sale de la anterior

**Estrategias.**

- ✓ válida: Plantear una combinación igual a cero y probar que todos los coeficientes son nulos — Es la prueba estándar.
- ✗ no sirve: Verificar un ejemplo concreto — Un ejemplo ilustra, pero no prueba un enunciado general.
- ✗ no sirve: Suponer lo que se quiere probar — Eso es un argumento circular.
- ✗ no sirve: Apoyarse en un dibujo o en la intuición — Ayuda a entender, pero no es una demostración.

### Más vectores que generadores — `t.mas-que-generadores` (nivel 5.3)

**Enunciado.** Si $V$ está generado por $m$ vectores, cualquier lista de $m+1$ vectores de $V$ es dependiente.

**Hipótesis.** $V=\operatorname{gen}(w_1,\dots,w_p)$ y $u_1,\dots,u_{p+1}\in V$; Puedes citar el teorema de homogéneos con más incógnitas y la definición del generado

**Depende de.** `t.homogeneo-libres`, `t.generado-subespacio`

**Demostración (grafo de dependencias entre líneas).** Cualquier orden que respete las flechas se acepta.

- **L1** ← ∅ — Como $u_j\in V=\operatorname{gen}(w_i)$, existen escalares con $u_j=\sum_{i=1}^{p}a_{ij}w_i$ para $j=1,\dots,p+1$. _[Generado de S: el conjunto de todas las combinaciones lineales de elementos de S]_
- **L2** ← L1 — Consideremos el sistema homogéneo $\sum_{j}a_{ij}c_j=0$ para $i=1,\dots,p$: tiene $p$ ecuaciones y $p+1$ incógnitas $c_j$. _[Combinación lineal de v₁,…,vₖ: c₁v₁ + ⋯ + cₖvₖ]_
- **L3** ← L2 — Por el teorema de los homogéneos con más incógnitas que ecuaciones, existe una solución $(c_j)\neq0$. _[Homogéneos con más incógnitas]_
- **L4** ← L1, L3 — Entonces $\sum_jc_ju_j=\sum_i\left(\sum_ja_{ij}c_j\right)w_i$ y cada paréntesis vale $0$ (es la ecuación $i$ del sistema), así que la suma es $0$. _[Combinación lineal de v₁,…,vₖ: c₁v₁ + ⋯ + cₖvₖ]_
- **L5** ← L3, L4 — Hay una combinación lineal no trivial igual a $0$: los $u_j$ son dependientes. ∎ _[v₁,…,vₖ son independientes si c₁v₁ + ⋯ + cₖvₖ = 0 solo se da con todos los cᵢ = 0]_

**Líneas distractoras (falsas a propósito).**

- En $\mathbb{R}^2$, tres vectores cualesquiera son dependientes; luego vale para todo $m$. — _falla:_ un ejemplo no prueba el caso general
- Como $V$ tiene $p$ generadores, tiene dimensión $p$ y eso basta. — _falla:_ eso es una consecuencia que se prueba después de este resultado

**Errores para «cazar el error».**

- Sustituye **L2**: Consideremos $\sum_{j}a_{ij}c_j=0$ para $i=1,\dots,p+1$: $p+1$ ecuaciones y $p$ incógnitas. — _diagnóstico:_ Error de cálculo: el resultado de la línea no sale de la anterior
- Sustituye **L4**: Entonces $\sum_jc_ju_j=\sum_i\left(\sum_ja_{ij}c_j\right)w_i=w_1$. — _diagnóstico:_ Error de cálculo: el resultado de la línea no sale de la anterior

**Estrategias.**

- ✓ válida: Escribir los $u_j$ en función de los $w_i$ y aplicar el teorema de homogéneos — Es la prueba estándar.
- ✗ no sirve: Verificar un ejemplo concreto — Un ejemplo ilustra, pero no prueba un enunciado general.
- ✗ no sirve: Suponer lo que se quiere probar — Eso es un argumento circular.
- ✗ no sirve: Apoyarse en un dibujo o en la intuición — Ayuda a entender, pero no es una demostración.

### La dimensión está bien definida — `t.dimension-bien-definida` (nivel 5.3)

**Enunciado.** Dos bases de un mismo espacio tienen el mismo número de elementos.

**Hipótesis.** $B$ base con $r$ elementos y $G$ base con $s$ elementos; Puedes citar que más vectores que generadores son dependientes

**Depende de.** `t.mas-que-generadores`

**Demostración (grafo de dependencias entre líneas).** Cualquier orden que respete las flechas se acepta.

- **L1** ← ∅ — Supongamos por contradicción que $r>s$. _[Reducción al absurdo: si suponer lo contrario lleva a una contradicción, lo supuesto es falso]_
- **L2** ← L1 — $G$ genera $V$ con $s$ vectores y $B$ tiene $r\ge s+1$ vectores de $V$. _[Base: lista de vectores independiente que genera el espacio]_
- **L3** ← L2 — Por el teorema de más vectores que generadores, $B$ es dependiente. _[Más vectores que generadores]_
- **L4** ← L3 — Pero $B$ es base y por tanto independiente: contradicción. Luego $r\le s$. _[Base: lista de vectores independiente que genera el espacio]_
- **L5** ← L4 — Intercambiando los papeles de $B$ y $G$, $s\le r$. Por tanto $r=s$. ∎ _[Dimensión: número de vectores de una base]_

**Líneas distractoras (falsas a propósito).**

- En $\mathbb{R}^3$ las bases estándar tienen $3$ elementos; luego todas las bases de cualquier espacio coinciden en tamaño. — _falla:_ un ejemplo no prueba el caso general
- Dos bases generan lo mismo, así que tienen los mismos elementos. — _falla:_ tienen el mismo número, no los mismos vectores

**Errores para «cazar el error».**

- Sustituye **L2**: $G$ genera $V$ con $s$ vectores y $B$ tiene $r\ge s$ vectores. — _diagnóstico:_ Error de cálculo: el resultado de la línea no sale de la anterior
- Sustituye **L5**: Con los mismos papeles, $r\le s$ de nuevo. — _diagnóstico:_ La conclusión no se sigue de lo anterior (falacia)

**Estrategias.**

- ✓ válida: Probar $p\le q$ y, intercambiando, $q\le p$ — Es la prueba estándar.
- ✗ no sirve: Verificar un ejemplo concreto — Un ejemplo ilustra, pero no prueba un enunciado general.
- ✗ no sirve: Suponer lo que se quiere probar — Eso es un argumento circular.
- ✗ no sirve: Apoyarse en un dibujo o en la intuición — Ayuda a entender, pero no es una demostración.

### Independientes de tamaño n — `t.n-independientes-base` (nivel 5.3)

**Enunciado.** En un espacio de dimensión $n$, $n$ vectores independientes forman una base.

**Hipótesis.** $\dim V=m$ y $S$ es independiente con $m$ elementos; Puedes citar que las bases tienen el mismo tamaño y que agregar un vector independiente mantiene la independencia

**Depende de.** `t.dimension-bien-definida`, `t.agregar-independiente`

**Demostración (grafo de dependencias entre líneas).** Cualquier orden que respete las flechas se acepta.

- **L1** ← ∅ — Como $S$ es independiente, solo falta ver que genera $V$. Supongamos por contradicción que no: existe $w\in V\setminus\operatorname{gen}(S)$. _[Reducción al absurdo: si suponer lo contrario lleva a una contradicción, lo supuesto es falso]_
- **L2** ← L1 — Por el teorema de agregar un vector independiente, $S\cup\{w\}$ es independiente y tiene $m+1$ elementos. _[Agregar un vector independiente]_
- **L3** ← L2 — Una lista independiente puede completarse hasta una base de $V$, que tendría al menos $m+1$ elementos. _[Base: lista de vectores independiente que genera el espacio]_
- **L4** ← L3 — Pero todas las bases de $V$ tienen $m$ elementos (la dimensión está bien definida): contradicción. _[La dimensión está bien definida]_
- **L5** ← L4 — Luego $S$ genera $V$ y es una base. ∎ _[Base: lista de vectores independiente que genera el espacio]_

**Líneas distractoras (falsas a propósito).**

- En $\mathbb{R}^2$, dos vectores independientes forman base; luego vale en todas las dimensiones. — _falla:_ un ejemplo no prueba el caso general
- Como $S$ tiene $m$ vectores, es una base. — _falla:_ falta la independencia (o la generación)

**Errores para «cazar el error».**

- Sustituye **L2**: Por el teorema de agregar un vector independiente, $S\cup\{w\}$ es independiente y tiene $m$ elementos. — _diagnóstico:_ Error de cálculo: el resultado de la línea no sale de la anterior
- Sustituye **L4**: Pero todas las bases de $V$ tienen $m+1$ elementos. — _diagnóstico:_ Error de cálculo: el resultado de la línea no sale de la anterior

**Estrategias.**

- ✓ válida: Suponer que no genera, agregar un vector fuera del generado y contradecir la dimensión — Es la prueba estándar.
- ✗ no sirve: Verificar un ejemplo concreto — Un ejemplo ilustra, pero no prueba un enunciado general.
- ✗ no sirve: Suponer lo que se quiere probar — Eso es un argumento circular.
- ✗ no sirve: Apoyarse en un dibujo o en la intuición — Ayuda a entender, pero no es una demostración.

### Dimensión de un subespacio — `t.dim-subespacio` (nivel 5.3)

**Enunciado.** Si $W\subseteq V$ con $\dim V=n$, entonces $\dim W\le n$, con igualdad si y solo si $W=V$.

**Hipótesis.** $W$ subespacio de $V$ y $\dim V=m$; Puedes citar el teorema de más vectores que generadores y el de $n$ independientes

**Depende de.** `t.n-independientes-base`, `t.mas-que-generadores`

**Demostración (grafo de dependencias entre líneas).** Cualquier orden que respete las flechas se acepta.

- **L1** ← ∅ — Sea $\{w_1,\dots,w_d\}$ una base de $W$, con $d=\dim W$. Es una lista independiente de vectores de $V$. _[Base: lista de vectores independiente que genera el espacio]_
- **L2** ← L1 — Si fuera $d>m$, tendríamos $m+1$ vectores independientes en un espacio generado por $m$ vectores, contra el teorema de más vectores que generadores. Luego $d\le m$. _[Más vectores que generadores]_
- **L3** ← L1 — (⇒) Si $d=m$, la base de $W$ son $m$ vectores independientes de $V$: por el teorema de $n$ independientes, es una base de $V$. _[Independientes de tamaño n]_
- **L4** ← L3 — Entonces $V=\operatorname{gen}(w_1,\dots,w_m)=W$. _[Base: lista de vectores independiente que genera el espacio]_
- **L5** ← L2 — (⇐) Si $W=V$, entonces $\dim W=\dim V=m$. ∎ _[Dimensión: número de vectores de una base]_

**Líneas distractoras (falsas a propósito).**

- Una recta en $\mathbb{R}^3$ tiene dimensión $1\le3$; luego vale siempre. — _falla:_ un ejemplo no prueba el caso general
- Como $W\subseteq V$, $\dim W\le\dim V$ es evidente. — _falla:_ es lo que hay que demostrar, no un dato

**Errores para «cazar el error».**

- Sustituye **L2**: Si fuera $d>m$ no habría contradicción: los subespacios pueden ser mayores. — _diagnóstico:_ La conclusión no se sigue de lo anterior (falacia)
- Sustituye **L4**: Entonces $V=\operatorname{gen}(w_1,\dots,w_m)$ y por tanto $W$ es mayor que $V$. — _diagnóstico:_ La conclusión no se sigue de lo anterior (falacia)

**Estrategias.**

- ✓ válida: Comparar una base de $W$ con las de $V$ — Es la prueba estándar.
- ✗ no sirve: Verificar un ejemplo concreto — Un ejemplo ilustra, pero no prueba un enunciado general.
- ✗ no sirve: Suponer lo que se quiere probar — Eso es un argumento circular.
- ✗ no sirve: Apoyarse en un dibujo o en la intuición — Ayuda a entender, pero no es una demostración.

### Unicidad de coordenadas — `t.coordenadas-unicas` (nivel 5.4)

**Enunciado.** Si $B=(b_1,\dots,b_n)$ es base, cada $v$ se escribe de una única manera como $v=x_1b_1+\cdots+x_nb_n$.

**Hipótesis.** $B$ es una base: independiente y generadora; Basta la definición de independencia

**Depende de.** `t.dependencia-combinacion`

**Demostración (grafo de dependencias entre líneas).** Cualquier orden que respete las flechas se acepta.

- **L1** ← ∅ — Existencia: como $B$ genera $V$, $w$ es combinación lineal de los $e_i$. _[Base: lista de vectores independiente que genera el espacio]_
- **L2** ← L1 — Unicidad: supongamos $w=\sum x_ie_i=\sum y_ie_i$. _[Coordenadas de v respecto de la base B = (b₁,…,bₙ): el único (x₁,…,xₙ) con v = x₁b₁ + ⋯ + xₙbₙ]_
- **L3** ← L2 — Restando, $\sum(x_i-y_i)e_i=0$ por distributividad. _[Combinación lineal de v₁,…,vₖ: c₁v₁ + ⋯ + cₖvₖ]_
- **L4** ← L3 — Como $B$ es independiente, todos los coeficientes son cero: $x_i-y_i=0$ para todo $i$. _[v₁,…,vₖ son independientes si c₁v₁ + ⋯ + cₖvₖ = 0 solo se da con todos los cᵢ = 0]_
- **L5** ← L4 — Luego $x_i=y_i$ para todo $i$: la combinación es única. ∎ _[Coordenadas de v respecto de la base B = (b₁,…,bₙ): el único (x₁,…,xₙ) con v = x₁b₁ + ⋯ + xₙbₙ]_

**Líneas distractoras (falsas a propósito).**

- En $\mathbb{R}^2$ con la base canónica las coordenadas son únicas; luego siempre. — _falla:_ un ejemplo no prueba el caso general
- Como $B$ genera $V$, las coordenadas son únicas. — _falla:_ generar da existencia; la unicidad usa la independencia

**Errores para «cazar el error».**

- Sustituye **L3**: Sumando, $\sum(x_i+y_i)e_i=0$. — _diagnóstico:_ Error de cálculo: el resultado de la línea no sale de la anterior
- Sustituye **L4**: Como $B$ es generadora, todos los coeficientes son cero. — _diagnóstico:_ La conclusión no se sigue de lo anterior (falacia)

**Estrategias.**

- ✓ válida: Restar dos expresiones de $v$ y usar la independencia — Es la prueba estándar.
- ✗ no sirve: Verificar un ejemplo concreto — Un ejemplo ilustra, pero no prueba un enunciado general.
- ✗ no sirve: Suponer lo que se quiere probar — Eso es un argumento circular.
- ✗ no sirve: Apoyarse en un dibujo o en la intuición — Ayuda a entender, pero no es una demostración.

### Las coordenadas son lineales — `t.coordenadas-lineales` (nivel 5.4)

**Enunciado.** $[u+v]_B=[u]_B+[v]_B$ y $[cv]_B=c[v]_B$.

**Hipótesis.** $B$ es base y $[u]_B=(a_i)$, $[y]_B=(a_i')$; Puedes citar la unicidad de coordenadas

**Depende de.** `t.coordenadas-unicas`

**Demostración (grafo de dependencias entre líneas).** Cualquier orden que respete las flechas se acepta.

- **L1** ← ∅ — Sean $u=\sum a_ib_i$ y $y=\sum a_i'b_i$ las expresiones (únicas) de $u$ y $y$. _[Coordenadas de v respecto de la base B = (b₁,…,bₙ): el único (x₁,…,xₙ) con v = x₁b₁ + ⋯ + xₙbₙ]_
- **L2** ← L1 — Entonces $u+y=\sum(a_i+a_i')b_i$ por distributividad. _[Álgebra de los números: operar, despejar, sustituir]_
- **L3** ← L2 — Esa es una expresión de $u+y$ como combinación de la base; por la unicidad de coordenadas es **la** expresión, así que $[u+y]_B=(a_i+a_i')=[u]_B+[y]_B$. _[Unicidad de coordenadas]_
- **L4** ← L1 — Igualmente $λy=\sum(λa_i')b_i$ es la expresión de $λy$, luego $[λy]_B=λ[y]_B$. ∎ _[Unicidad de coordenadas]_

**Líneas distractoras (falsas a propósito).**

- Con la base canónica de $\mathbb{R}^2$ se comprueba; luego siempre. — _falla:_ un ejemplo no prueba el caso general
- Como $[\cdot]_B$ es una función, conserva todas las operaciones. — _falla:_ no toda función conserva las operaciones: hay que probarlo

**Errores para «cazar el error».**

- Sustituye **L2**: Entonces $u+y=\sum a_ia_i'b_i$. — _diagnóstico:_ Error de cálculo: el resultado de la línea no sale de la anterior
- Sustituye **L4**: Igualmente $λy=\sum(λ+a_i')b_i$. — _diagnóstico:_ Error de cálculo: el resultado de la línea no sale de la anterior

**Estrategias.**

- ✓ válida: Escribir $u+v$ y $cv$ con la base y usar la unicidad — Es la prueba estándar.
- ✗ no sirve: Verificar un ejemplo concreto — Un ejemplo ilustra, pero no prueba un enunciado general.
- ✗ no sirve: Suponer lo que se quiere probar — Eso es un argumento circular.
- ✗ no sirve: Apoyarse en un dibujo o en la intuición — Ayuda a entender, pero no es una demostración.

### Matriz de cambio de base — `t.matriz-cambio-base` (nivel 5.4)

**Enunciado.** Si $P$ tiene por columnas $[b_j]_C$, entonces $[v]_C=P[v]_B$ para todo $v$.

**Hipótesis.** $Q=([e_1]_C\ \cdots\ [e_n]_C)$; Puedes citar que las coordenadas son lineales

**Depende de.** `t.coordenadas-lineales`

**Demostración (grafo de dependencias entre líneas).** Cualquier orden que respete las flechas se acepta.

- **L1** ← ∅ — Sea $[u]_B=(x_1,\dots,x_n)$, es decir, $u=\sum x_je_j$. _[Coordenadas de v respecto de la base B = (b₁,…,bₙ): el único (x₁,…,xₙ) con v = x₁b₁ + ⋯ + xₙbₙ]_
- **L2** ← L1 — Por la linealidad de las coordenadas, $[u]_C=\sum x_j[e_j]_C$. _[Las coordenadas son lineales]_
- **L3** ← L2 — El miembro derecho es la combinación lineal de las columnas de $Q$ con coeficientes $x_j$, que es $Qx$ con $x=[u]_B$. _[Producto de matrices: (AB)ᵢⱼ = Σₖ aᵢₖ bₖⱼ]_
- **L4** ← L3 — Luego $[u]_C=Q[u]_B$. ∎ _[Matriz de cambio de base de B a C: columnas [b₁]_C, …, [bₙ]_C]_

**Líneas distractoras (falsas a propósito).**

- Con $V=\mathbb{R}^2$ y bases concretas se verifica; luego siempre. — _falla:_ un ejemplo no prueba el caso general
- Como $Q$ tiene las coordenadas de los $e_j$, es la identidad. — _falla:_ es la identidad solo si $B=C$

**Errores para «cazar el error».**

- Sustituye **L2**: Por la linealidad, $[u]_C=\sum x_j[e_j]_B$. — _diagnóstico:_ Error de cálculo: el resultado de la línea no sale de la anterior
- Sustituye **L3**: El miembro derecho es la combinación lineal de las **filas** de $Q$ con coeficientes $x_j$. — _diagnóstico:_ Error de cálculo: el resultado de la línea no sale de la anterior

**Estrategias.**

- ✓ válida: Aplicar $[\cdot]_C$ a $v=\sum x_jb_j$ usando linealidad — Es la prueba estándar.
- ✗ no sirve: Verificar un ejemplo concreto — Un ejemplo ilustra, pero no prueba un enunciado general.
- ✗ no sirve: Suponer lo que se quiere probar — Eso es un argumento circular.
- ✗ no sirve: Apoyarse en un dibujo o en la intuición — Ayuda a entender, pero no es una demostración.

### Inversa del cambio de base — `t.cambio-base-inversa` (nivel 5.4)

**Enunciado.** $P_{B\to C}$ es invertible y su inversa es $P_{C\to B}$.

**Hipótesis.** $B$ y $C$ son bases del mismo espacio de dimensión $n$; Puedes citar la fórmula del cambio de base y la unicidad de la inversa

**Depende de.** `t.matriz-cambio-base`, `t.mat-inversa-unica`

**Demostración (grafo de dependencias entre líneas).** Cualquier orden que respete las flechas se acepta.

- **L1** ← ∅ — Para todo $v$, $[v]_C=S[v]_B$ y $[v]_B=T[v]_C$ (teorema del cambio de base). _[Matriz de cambio de base]_
- **L2** ← L1 — Sustituyendo, $[v]_B=TS[v]_B$ para todo $v$. _[Matriz de cambio de base]_
- **L3** ← L2 — Como los vectores $[v]_B$ recorren **todos** los $x\in\mathbb{Q}^n$ (tomando $v=\sum x_jb_j$), $TSx=x$ para todo $x$; en particular para $x=e_j$, y por eso $TS=I$. _[Inversa de A: una matriz B con AB = BA = I]_
- **L4** ← L3 — Intercambiando los papeles de $B$ y $C$ se obtiene $ST=I$. _[Matriz de cambio de base]_
- **L5** ← L3, L4 — Luego $T$ es una inversa de $S$ y, por la unicidad de la inversa, $S^{-1}=T$. ∎ _[Unicidad de la inversa]_

**Líneas distractoras (falsas a propósito).**

- Con $B=\{e_1,e_2\}$ y $C=\{e_2,e_1\}$ se cumple; luego siempre. — _falla:_ un ejemplo no prueba el caso general
- Como cambiar de base y volver es no hacer nada, $T=S$. — _falla:_ volver deshace el cambio: es la inversa, no la misma matriz

**Errores para «cazar el error».**

- Sustituye **L2**: Sustituyendo, $[v]_B=ST[v]_B$ para todo $v$. — _diagnóstico:_ Error de cálculo: el resultado de la línea no sale de la anterior
- Sustituye **L4**: Intercambiando los papeles se obtiene $ST=0$. — _diagnóstico:_ Error de cálculo: el resultado de la línea no sale de la anterior

**Estrategias.**

- ✓ válida: Probar $QP=I=PQ$ y usar la unicidad de la inversa — Es la prueba estándar.
- ✗ no sirve: Verificar un ejemplo concreto — Un ejemplo ilustra, pero no prueba un enunciado general.
- ✗ no sirve: Suponer lo que se quiere probar — Eso es un argumento circular.
- ✗ no sirve: Apoyarse en un dibujo o en la intuición — Ayuda a entender, pero no es una demostración.

### T(0) = 0 — `t.lineal-cero-opuesto` (nivel 6.1)

**Enunciado.** Si $T$ es lineal, $T(0)=0$ y $T(-v)=-T(v)$.

**Hipótesis.** $T:V\to W$ es lineal; Basta usar la definición de linealidad

**Depende de.** nada previo (solo definiciones y propiedades base)

**Demostración (grafo de dependencias entre líneas).** Cualquier orden que respete las flechas se acepta.

- **L1** ← ∅ — $T(0)=T(0+0)=T(0)+T(0)$ por aditividad. _[Transformación lineal: T(u + v) = T(u) + T(v) y T(cv) = cT(v)]_
- **L2** ← L1 — Restando $T(0)$ a ambos lados, $0=T(0)$. _[Álgebra de los números: operar, despejar, sustituir]_
- **L3** ← L2 — Para $u$ arbitrario, $-u=(-1)u$, así que por homogeneidad $T(-u)=T((-1)u)$, que es igual a $(-1)T(u)=-T(u)$. _[Lo probado para un elemento arbitrario vale para todos los elementos]_
- **L4** ← L2, L3 — Con esto se cumplen las dos igualdades. ∎ _[Transformación lineal: T(u + v) = T(u) + T(v) y T(cv) = cT(v)]_

**Líneas distractoras (falsas a propósito).**

- Con $T(x)=2x$ se cumple $T(0)=0$; luego siempre. — _falla:_ un ejemplo no prueba el caso general
- Como $T$ conserva las operaciones, el cero va al cero. — _falla:_ hay que probarlo con la definición

**Errores para «cazar el error».**

- Sustituye **L1**: $T(0)=T(0\cdot 0)=T(0)\cdot T(0)$. — _diagnóstico:_ Error de cálculo: el resultado de la línea no sale de la anterior
- Sustituye **L3**: $T(-u)=T(u)-1$. — _diagnóstico:_ Error de cálculo: el resultado de la línea no sale de la anterior

**Estrategias.**

- ✓ válida: Escribir $0=0+0$ y $-v=(-1)v$ y aplicar la definición — Es la prueba estándar.
- ✗ no sirve: Verificar un ejemplo concreto — Un ejemplo ilustra, pero no prueba un enunciado general.
- ✗ no sirve: Suponer lo que se quiere probar — Eso es un argumento circular.
- ✗ no sirve: Apoyarse en un dibujo o en la intuición — Ayuda a entender, pero no es una demostración.

### Criterio de linealidad — `t.criterio-lineal` (nivel 6.1)

**Enunciado.** $T$ es lineal si y solo si $T(au+bv)=aT(u)+bT(v)$ para todos $u,v$ y escalares $a,b$.

**Hipótesis.** $T:V\to W$ es una función; Basta usar la definición de linealidad

**Depende de.** nada previo (solo definiciones y propiedades base)

**Demostración (grafo de dependencias entre líneas).** Cualquier orden que respete las flechas se acepta.

- **L1** ← ∅ — (⇒) Si $T$ es lineal: $T(au+bv)=T(au)+T(bv)$ por aditividad y $=aT(u)+bT(v)$ por homogeneidad. _[Transformación lineal: T(u + v) = T(u) + T(v) y T(cv) = cT(v)]_
- **L2** ← L1 — (⇐) Supongamos la identidad para todos $a,b,u,v$. Tomando $a=b=1$ se obtiene $T(u+v)=T(u)+T(v)$: aditividad. _[Lo probado para un elemento arbitrario vale para todos los elementos]_
- **L3** ← L1 — Tomando $b=0$: $T(au)=aT(u)+0\cdot T(v)$, que es igual a $aT(u)$, que es la homogeneidad. _[Lo probado para un elemento arbitrario vale para todos los elementos]_
- **L4** ← L2, L3 — Se cumplen aditividad y homogeneidad: $T$ es lineal. ∎ _[Para probar P ⟺ Q se prueban P ⇒ Q y Q ⇒ P]_

**Líneas distractoras (falsas a propósito).**

- Con $T(x)=3x$ se cumple la identidad; luego el criterio vale. — _falla:_ un ejemplo no prueba el caso general
- Como la identidad solo usa suma y escalar, es lo mismo que linealidad. — _falla:_ hay que deducir las dos propiedades por separado

**Errores para «cazar el error».**

- Sustituye **L2**: Tomando $a=b=0$ se obtiene $T(u+v)=T(u)+T(v)$. — _diagnóstico:_ Error de cálculo: el resultado de la línea no sale de la anterior
- Sustituye **L3**: Tomando $a=0$: $T(bv)=bT(v)$ y por eso $T(u+v)$ ya está. — _diagnóstico:_ La conclusión no se sigue de lo anterior (falacia)

**Estrategias.**

- ✓ válida: Probar (⇒) con la definición y (⇐) con $a=b=1$ y $b=0$ — Es la prueba estándar.
- ✗ no sirve: Verificar un ejemplo concreto — Un ejemplo ilustra, pero no prueba un enunciado general.
- ✗ no sirve: Suponer lo que se quiere probar — Eso es un argumento circular.
- ✗ no sirve: Apoyarse en un dibujo o en la intuición — Ayuda a entender, pero no es una demostración.

### T queda fijada por una base — `t.lineal-determinada-base` (nivel 6.1)

**Enunciado.** Dada una base $(b_1,\dots,b_n)$ y vectores $w_1,\dots,w_n$ existe una única $T$ lineal con $T(b_i)=w_i$.

**Hipótesis.** $(b_i)$ es una base de $V$; Puedes citar la unicidad y la linealidad de las coordenadas

**Depende de.** `t.coordenadas-unicas`, `t.coordenadas-lineales`

**Demostración (grafo de dependencias entre líneas).** Cualquier orden que respete las flechas se acepta.

- **L1** ← ∅ — Existencia: definimos $T(u)=\sum x_iz_i$ donde $(x_i)=[u]_B$ (las coordenadas son únicas, así que está bien definida). _[Coordenadas de v respecto de la base B = (b₁,…,bₙ): el único (x₁,…,xₙ) con v = x₁b₁ + ⋯ + xₙbₙ]_
- **L2** ← L1 — Es lineal: como $[u+u']_B=[u]_B+[u']_B$ y $[cu]_B=c[u]_B$, se tiene $T(u+u')=T(u)+T(u')$ y $T(cu)=cT(u)$. _[Las coordenadas son lineales]_
- **L3** ← L1 — Además $[b_i]_B=e_i$, así que $T(b_i)=z_i$. _[Coordenadas de v respecto de la base B = (b₁,…,bₙ): el único (x₁,…,xₙ) con v = x₁b₁ + ⋯ + xₙbₙ]_
- **L4** ← L3 — Unicidad: si $S$ es lineal con $S(b_i)=z_i$, para $u=\sum x_ib_i$ se tiene $S(u)=\sum x_iS(b_i)=\sum x_iz_i$, que es igual a $T(u)$. _[Transformación lineal: T(u + v) = T(u) + T(v) y T(cv) = cT(v)]_
- **L5** ← L2, L4 — Luego $S=T$. ∎ _[Lo probado para un elemento arbitrario vale para todos los elementos]_

**Líneas distractoras (falsas a propósito).**

- En $\mathbb{R}^2$ con la base canónica $T(x,y)=xw_1+yw_2$ cumple lo pedido; luego siempre. — _falla:_ un ejemplo no prueba el caso general
- Como las coordenadas existen, la transformación existe y es única. — _falla:_ falta probar la linealidad y que coincide con cualquier otra

**Errores para «cazar el error».**

- Sustituye **L2**: Como $[u+u']_B=[u]_B\cdot[u']_B$ se tiene $T(u+u')=\cdots$ — _diagnóstico:_ Error de cálculo: el resultado de la línea no sale de la anterior
- Sustituye **L4**: $S(u)=\sum S(x_i)b_i$. — _diagnóstico:_ Error de cálculo: el resultado de la línea no sale de la anterior

**Estrategias.**

- ✓ válida: Definir $T$ con coordenadas y probar unicidad por linealidad — Es la prueba estándar.
- ✗ no sirve: Verificar un ejemplo concreto — Un ejemplo ilustra, pero no prueba un enunciado general.
- ✗ no sirve: Suponer lo que se quiere probar — Eso es un argumento circular.
- ✗ no sirve: Apoyarse en un dibujo o en la intuición — Ayuda a entender, pero no es una demostración.

### La composición es lineal — `t.composicion-lineal` (nivel 6.1)

**Enunciado.** Si $T$ y $S$ son lineales, $S\circ T$ es lineal.

**Hipótesis.** $T$ y $S$ lineales; Puedes usar el criterio de linealidad

**Depende de.** `t.criterio-lineal`

**Demostración (grafo de dependencias entre líneas).** Cualquier orden que respete las flechas se acepta.

- **L1** ← ∅ — Sean $x,v\in U$ y $a,b$ escalares. Por definición, $(S\circ T)(ax+bv)=S(T(ax+bv))$. _[(S∘T)(v) = S(T(v))]_
- **L2** ← L1 — Como $T$ es lineal, $T(ax+bv)=aT(x)+bT(v)$. _[Criterio de linealidad]_
- **L3** ← L2 — Como $S$ es lineal, $S(aT(x)+bT(v))=aS(T(x))+bS(T(v))$. _[Criterio de linealidad]_
- **L4** ← L3 — Esto es $a(S\circ T)(x)+b(S\circ T)(v)$. Por el criterio de linealidad, $S\circ T$ es lineal. ∎ _[(S∘T)(v) = S(T(v))]_

**Líneas distractoras (falsas a propósito).**

- Con $T=S=2\cdot$ la composición $4\cdot$ es lineal; luego siempre. — _falla:_ un ejemplo no prueba el caso general
- Como composiciones de funciones son funciones, $S\circ T$ es lineal. — _falla:_ solo si ambas lo son, y hay que probarlo

**Errores para «cazar el error».**

- Sustituye **L2**: Como $T$ es lineal, $T(ax+bv)=T(a)x+T(b)v$. — _diagnóstico:_ Error de cálculo: el resultado de la línea no sale de la anterior
- Sustituye **L3**: Como $S$ es lineal, $S(aT(x)+bT(v))=aS(x)+bS(v)$. — _diagnóstico:_ Error de cálculo: el resultado de la línea no sale de la anterior

**Estrategias.**

- ✓ válida: Aplicar el criterio de linealidad dos veces — Es la prueba estándar.
- ✗ no sirve: Verificar un ejemplo concreto — Un ejemplo ilustra, pero no prueba un enunciado general.
- ✗ no sirve: Suponer lo que se quiere probar — Eso es un argumento circular.
- ✗ no sirve: Apoyarse en un dibujo o en la intuición — Ayuda a entender, pero no es una demostración.

### Núcleo e imagen son subespacios — `t.nucleo-imagen-subespacios` (nivel 6.2)

**Enunciado.** $\ker T\subseteq V$ e $\operatorname{im}T\subseteq W$ son subespacios.

**Hipótesis.** $T$ es lineal; Puedes citar el criterio del subespacio y que $T(0)=0$

**Depende de.** `t.subespacio-criterio`, `t.lineal-cero-opuesto`

**Demostración (grafo de dependencias entre líneas).** Cualquier orden que respete las flechas se acepta.

- **L1** ← ∅ — $\ker T$: como $T(0)=0$, $0\in\ker T$ (no vacío). _[T(0) = 0]_
- **L2** ← L1 — Si $u,v\in\ker T$, $T(u+v)=T(u)+T(v)=0$ y $T(cu)=cT(u)=0$: cerrado bajo suma y escalares. _[Núcleo de T: ker T = {v : T(v) = 0}]_
- **L3** ← L1 — $\operatorname{im}T$: $0=T(0)\in\operatorname{im}T$. Si $w_1=T(u)$ y $w_2=T(v)$, entonces $w_1+w_2=T(u+v)$ y $cw_1=T(cu)$ están en la imagen por linealidad. _[Imagen de T: im T = {T(v) : v ∈ V}]_
- **L4** ← L2, L3 — Por el criterio del subespacio, ambos son subespacios. ∎ _[Criterio del subespacio]_

**Líneas distractoras (falsas a propósito).**

- Con $T(x,y)=x$ el núcleo es el eje $y$ y la imagen $\mathbb{R}$; luego siempre. — _falla:_ un ejemplo no prueba el caso general
- Como $\ker T\subseteq V$, hereda ser subespacio. — _falla:_ un subconjunto no siempre es subespacio

**Errores para «cazar el error».**

- Sustituye **L2**: Si $u,v\in\ker T$, $T(u+v)=T(u)\cdot T(v)=0$. — _diagnóstico:_ Error de cálculo: el resultado de la línea no sale de la anterior
- Sustituye **L3**: $w_1+w_2=T(u)+T(v)=T(u\cdot v)$. — _diagnóstico:_ Error de cálculo: el resultado de la línea no sale de la anterior

**Estrategias.**

- ✓ válida: Aplicar el criterio del subespacio a cada uno — Es la prueba estándar.
- ✗ no sirve: Verificar un ejemplo concreto — Un ejemplo ilustra, pero no prueba un enunciado general.
- ✗ no sirve: Suponer lo que se quiere probar — Eso es un argumento circular.
- ✗ no sirve: Apoyarse en un dibujo o en la intuición — Ayuda a entender, pero no es una demostración.

### Inyectividad y núcleo — `t.inyectiva-nucleo` (nivel 6.2)

**Enunciado.** $T$ es inyectiva si y solo si $\ker T=\{0\}$.

**Hipótesis.** $T$ es lineal; Puedes citar que $T(0)=0$

**Depende de.** `t.lineal-cero-opuesto`

**Demostración (grafo de dependencias entre líneas).** Cualquier orden que respete las flechas se acepta.

- **L1** ← ∅ — (⇒) Si $T$ es inyectiva y $v\in\ker T$, entonces $T(v)=0=T(0)$, así que $v=0$. _[T(0) = 0]_
- **L2** ← ∅ — (⇐) Supongamos $\ker T=\{0\}$ y $T(x)=T(v)$. _[Núcleo de T: ker T = {v : T(v) = 0}]_
- **L3** ← L2 — Por linealidad, $T(x-v)=T(x)-T(v)=0$, es decir, $x-v\in\ker T$. _[Transformación lineal: T(u + v) = T(u) + T(v) y T(cv) = cT(v)]_
- **L4** ← L3 — Como el núcleo es $\{0\}$, $x-v=0$ y por tanto $x=v$. Así $T$ es inyectiva. ∎ _[Inyectiva: T(u) = T(v) implica u = v. Sobreyectiva: im T = W]_

**Líneas distractoras (falsas a propósito).**

- Con $T(x)=2x$ se cumple; luego siempre. — _falla:_ un ejemplo no prueba el caso general
- Como $T(0)=0$, el núcleo es $\{0\}$. — _falla:_ el cero siempre está; el núcleo podría ser mayor

**Errores para «cazar el error».**

- Sustituye **L1**: Si $v\in\ker T$, entonces $T(v)=0=T(0)$, así que $v\neq0$. — _diagnóstico:_ La conclusión no se sigue de lo anterior (falacia)
- Sustituye **L3**: Por linealidad, $T(x-v)=T(x)+T(v)=0$. — _diagnóstico:_ Error de cálculo: el resultado de la línea no sale de la anterior

**Estrategias.**

- ✓ válida: Probar las dos implicaciones usando $T(u-v)=T(u)-T(v)$ — Es la prueba estándar.
- ✗ no sirve: Verificar un ejemplo concreto — Un ejemplo ilustra, pero no prueba un enunciado general.
- ✗ no sirve: Suponer lo que se quiere probar — Eso es un argumento circular.
- ✗ no sirve: Apoyarse en un dibujo o en la intuición — Ayuda a entender, pero no es una demostración.

### Teorema de la dimensión — `t.rango-nulidad` (nivel 6.2)

**Enunciado.** Si $\dim V=n$ es finita, $\dim\ker T+\dim\operatorname{im}T=n$.

**Hipótesis.** $\dim V=m$ finita y $T$ lineal; Puedes citar que el núcleo es subespacio, que una lista independiente se extiende a una base y que la dimensión está bien definida

**Depende de.** `t.nucleo-imagen-subespacios`, `t.agregar-independiente`, `t.dimension-bien-definida`

**Demostración (grafo de dependencias entre líneas).** Cualquier orden que respete las flechas se acepta.

- **L1** ← ∅ — $\ker T$ es un subespacio; sea $(k_1,\dots,k_p)$ una base suya. Es una lista independiente de $V$. _[Núcleo e imagen son subespacios]_
- **L2** ← L1 — Extendemos esa lista a una base $(k_1,\dots,k_p,w_1,\dots,w_q)$ de $V$, con $p+q=m$. _[Agregar un vector independiente]_
- **L3** ← L2 — Generan la imagen: para $x=\sum a_ik_i+\sum b_jw_j$, $T(x)=\sum b_jT(w_j)$ porque $T(k_i)=0$. _[Imagen de T: im T = {T(v) : v ∈ V}]_
- **L4** ← L3 — Son independientes: si $\sum c_jT(w_j)=0$, entonces $\sum c_jw_j\in\ker T$, o sea $=\sum d_ik_i$; como la lista completa es independiente, todos los $c_j=0$. _[v₁,…,vₖ son independientes si c₁v₁ + ⋯ + cₖvₖ = 0 solo se da con todos los cᵢ = 0]_
- **L5** ← L2, L4 — Luego $(T(w_j))$ es base de $\operatorname{im}T$ y $\dim\operatorname{im}T=q$. Entonces $\dim\ker T+\dim\operatorname{im}T=p+q=m$ (la dimensión está bien definida). ∎ _[La dimensión está bien definida]_

**Líneas distractoras (falsas a propósito).**

- Con $T(x,y)=x$: $1+1=2$; luego siempre. — _falla:_ un ejemplo no prueba el caso general
- Como el núcleo y la imagen son subespacios de $V$, sus dimensiones suman $\dim V$. — _falla:_ la imagen vive en $W$, no en $V$; hay que probarlo

**Errores para «cazar el error».**

- Sustituye **L2**: Extendemos a una base con $p+q=m+1$ elementos. — _diagnóstico:_ Error de cálculo: el resultado de la línea no sale de la anterior
- Sustituye **L3**: Para $x=\sum a_ik_i+\sum b_jw_j$, $T(x)=\sum a_iT(k_i)$. — _diagnóstico:_ Error de cálculo: el resultado de la línea no sale de la anterior

**Estrategias.**

- ✓ válida: Extender una base del núcleo y probar que las imágenes de los nuevos vectores son base de la imagen — Es la prueba estándar.
- ✗ no sirve: Verificar un ejemplo concreto — Un ejemplo ilustra, pero no prueba un enunciado general.
- ✗ no sirve: Suponer lo que se quiere probar — Eso es un argumento circular.
- ✗ no sirve: Apoyarse en un dibujo o en la intuición — Ayuda a entender, pero no es una demostración.

### La inversa es lineal — `t.inversa-lineal` (nivel 6.2)

**Enunciado.** Si $T$ es lineal y biyectiva, $T^{-1}$ es lineal.

**Hipótesis.** $L$ lineal y biyectiva; Puedes usar el criterio de linealidad

**Depende de.** `t.criterio-lineal`

**Demostración (grafo de dependencias entre líneas).** Cualquier orden que respete las flechas se acepta.

- **L1** ← ∅ — Sean $p,w_2\in W$ y $a,b$ escalares. Basta probar $L^{-1}(ap+bw_2)=aL^{-1}(p)+bL^{-1}(w_2)$. _[Criterio de linealidad]_
- **L2** ← L1 — Aplicamos $L$ al miembro derecho: $L(aL^{-1}(p)+bL^{-1}(w_2))=aL(L^{-1}(p))+bL(L^{-1}(w_2))=ap+bw_2$. _[Transformación lineal: T(u + v) = T(u) + T(v) y T(cv) = cT(v)]_
- **L3** ← L2 — Entonces $aL^{-1}(p)+bL^{-1}(w_2)$ es un vector que $L$ envía a $ap+bw_2$. _[Lo probado para un elemento arbitrario vale para todos los elementos]_
- **L4** ← L3 — Como $L$ es inyectiva, el único vector que $L$ envía a $ap+bw_2$ es $L^{-1}(ap+bw_2)$: coinciden. ∎ _[Inyectiva: T(u) = T(v) implica u = v. Sobreyectiva: im T = W]_

**Líneas distractoras (falsas a propósito).**

- Con $L(x)=2x$ la inversa $x/2$ es lineal; luego siempre. — _falla:_ un ejemplo no prueba el caso general
- Como la inversa de una función lineal es lineal por definición. — _falla:_ hay que probarlo

**Errores para «cazar el error».**

- Sustituye **L2**: $L(aL^{-1}(p)+bL^{-1}(w_2))=L(a)p+L(b)w_2$. — _diagnóstico:_ Error de cálculo: el resultado de la línea no sale de la anterior
- Sustituye **L4**: Como $L$ es sobreyectiva, el único vector enviado a $ap+bw_2$ es $L^{-1}(ap+bw_2)$. — _diagnóstico:_ La conclusión no se sigue de lo anterior (falacia)

**Estrategias.**

- ✓ válida: Verificar la identidad del criterio aplicando $T$ y usando inyectividad — Es la prueba estándar.
- ✗ no sirve: Verificar un ejemplo concreto — Un ejemplo ilustra, pero no prueba un enunciado general.
- ✗ no sirve: Suponer lo que se quiere probar — Eso es un argumento circular.
- ✗ no sirve: Apoyarse en un dibujo o en la intuición — Ayuda a entender, pero no es una demostración.

### Matriz asociada — `t.matriz-asociada` (nivel 6.3)

**Enunciado.** Toda lineal $T:\mathbb{Q}^n\to\mathbb{Q}^m$ es $T(x)=Ax$ para una única $A$, cuyas columnas son $T(e_1),\dots,T(e_n)$.

**Hipótesis.** $L$ es lineal y $(e_j)$ la base canónica; Puedes citar que una lineal queda determinada por una base

**Depende de.** `t.criterio-lineal`, `t.lineal-determinada-base`

**Demostración (grafo de dependencias entre líneas).** Cualquier orden que respete las flechas se acepta.

- **L1** ← ∅ — Definimos $A$ con columnas $L(e_1),\dots,L(e_n)$. Todo $x=\sum x_je_j$. _[Matriz de T respecto de las bases B y C: columnas [T(bⱼ)]_C; para las canónicas, columnas T(eⱼ)]_
- **L2** ← L1 — Por linealidad, $L(x)=\sum x_jL(e_j)$. _[Transformación lineal: T(u + v) = T(u) + T(v) y T(cv) = cT(v)]_
- **L3** ← L1 — Y $Ax=\sum x_j(\text{columna }j\text{ de }A)=\sum x_jL(e_j)$ por la definición del producto matriz-vector. _[Producto de matrices: (AB)ᵢⱼ = Σₖ aᵢₖ bₖⱼ]_
- **L4** ← L2, L3 — Luego $L(x)=Ax$ para todo $x$. Unicidad: si $Ax=Bx$ para todo $x$, tomando $x=e_j$ las columnas $j$ coinciden, así que $A=B$. ∎ _[Matriz de T respecto de las bases B y C: columnas [T(bⱼ)]_C; para las canónicas, columnas T(eⱼ)]_

**Líneas distractoras (falsas a propósito).**

- Con $L(x,y)=(x+y,x)$ la matriz es $\begin{pmatrix}1&1\\1&0\end{pmatrix}$; luego siempre. — _falla:_ un ejemplo no prueba el caso general
- Como $L$ es una función de $\mathbb{Q}^n$, siempre es multiplicar por una matriz. — _falla:_ solo las lineales; hay que probarlo

**Errores para «cazar el error».**

- Sustituye **L3**: Y $Ax=\sum x_j(\text{fila }j\text{ de }A)$. — _diagnóstico:_ Error de cálculo: el resultado de la línea no sale de la anterior
- Sustituye **L2**: Por linealidad, $L(x)=\sum L(x_j)e_j$. — _diagnóstico:_ Error de cálculo: el resultado de la línea no sale de la anterior

**Estrategias.**

- ✓ válida: Escribir $x$ en la base canónica y usar linealidad — Es la prueba estándar.
- ✗ no sirve: Verificar un ejemplo concreto — Un ejemplo ilustra, pero no prueba un enunciado general.
- ✗ no sirve: Suponer lo que se quiere probar — Eso es un argumento circular.
- ✗ no sirve: Apoyarse en un dibujo o en la intuición — Ayuda a entender, pero no es una demostración.

### Matriz de la composición — `t.matriz-composicion` (nivel 6.3)

**Enunciado.** $[S\circ T]=[S]\,[T]$.

**Hipótesis.** $G,F$ lineales; Puedes citar la matriz asociada y la asociatividad del producto

**Depende de.** `t.matriz-asociada`, `t.mat-producto-asoc`

**Demostración (grafo de dependencias entre líneas).** Cualquier orden que respete las flechas se acepta.

- **L1** ← ∅ — Para todo $v$, $(G\circ F)(v)=G(F(v))$ por definición. _[(S∘T)(v) = S(T(v))]_
- **L2** ← L1 — Por la matriz asociada, $F(v)=[F]v$ y $G(w)=[G]w$. _[Matriz asociada]_
- **L3** ← L2 — Entonces $(G\circ F)(v)=[G]([F]v)=([G][F])v$ por la asociatividad del producto. _[Asociatividad del producto]_
- **L4** ← L3 — Así $G\circ F$ es multiplicar por $[G][F]$. Por la unicidad de la matriz asociada, $[G\circ F]=[G][F]$. ∎ _[Matriz asociada]_

**Líneas distractoras (falsas a propósito).**

- Con dos giros de $90^\circ$ se obtiene un giro de $180^\circ$; luego siempre. — _falla:_ un ejemplo no prueba el caso general
- Como la composición de funciones es asociativa, las matrices se multiplican. — _falla:_ hay que identificar la matriz con la unicidad

**Errores para «cazar el error».**

- Sustituye **L3**: Entonces $(G\circ F)(v)=([F][G])v$. — _diagnóstico:_ Error de cálculo: el resultado de la línea no sale de la anterior
- Sustituye **L1**: $(G\circ F)(v)=F(G(v))$. — _diagnóstico:_ Error de cálculo: el resultado de la línea no sale de la anterior

**Estrategias.**

- ✓ válida: Probar $(S\circ T)(x)=([S][T])x$ y usar la unicidad de la matriz — Es la prueba estándar.
- ✗ no sirve: Verificar un ejemplo concreto — Un ejemplo ilustra, pero no prueba un enunciado general.
- ✗ no sirve: Suponer lo que se quiere probar — Eso es un argumento circular.
- ✗ no sirve: Apoyarse en un dibujo o en la intuición — Ayuda a entender, pero no es una demostración.

### Matriz de la inversa — `t.matriz-inversa-transformacion` (nivel 6.3)

**Enunciado.** $T$ es invertible si y solo si $[T]$ lo es, y entonces $[T^{-1}]=[T]^{-1}$.

**Hipótesis.** $F$ lineal con matriz $A$ y $S=F^{-1}$ lineal; Puedes citar la matriz de la composición y la unicidad de la inversa

**Depende de.** `t.matriz-composicion`, `t.mat-inversa-unica`

**Demostración (grafo de dependencias entre líneas).** Cualquier orden que respete las flechas se acepta.

- **L1** ← ∅ — Como $S\circ F=\mathrm{id}$ y $[\mathrm{id}]=I$, por la matriz de la composición $[S]\,A=I$. _[Matriz de la composición]_
- **L2** ← ∅ — Como $F\circ S=\mathrm{id}$, igualmente $A\,[S]=I$. _[Matriz de la composición]_
- **L3** ← L1, L2 — Luego $[S]$ es una inversa de $A$ por ambos lados: $A$ es invertible. _[Inversa de A: una matriz B con AB = BA = I]_
- **L4** ← L3 — Por la unicidad de la inversa, $[S]=A^{-1}$. ∎ _[Unicidad de la inversa]_

**Líneas distractoras (falsas a propósito).**

- Con $T(x)=2x$ la matriz de la inversa es $\frac12I$; luego siempre. — _falla:_ un ejemplo no prueba el caso general
- La matriz de la inversa de una función es la transpuesta de su matriz. — _falla:_ falso en general

**Errores para «cazar el error».**

- Sustituye **L1**: Como $S\circ F=\mathrm{id}$, $[S]\,A=0$. — _diagnóstico:_ Error de cálculo: el resultado de la línea no sale de la anterior
- Sustituye **L2**: Como $F\circ S=\mathrm{id}$, igualmente $[S]\,A=I$ y no hay nada más que probar. — _diagnóstico:_ La conclusión no se sigue de lo anterior (falacia)

**Estrategias.**

- ✓ válida: Aplicar la matriz de la composición a $S\circ T$ y $T\circ S$ — Es la prueba estándar.
- ✗ no sirve: Verificar un ejemplo concreto — Un ejemplo ilustra, pero no prueba un enunciado general.
- ✗ no sirve: Suponer lo que se quiere probar — Eso es un argumento circular.
- ✗ no sirve: Apoyarse en un dibujo o en la intuición — Ayuda a entender, pero no es una demostración.

### Matriz respecto de bases — `t.matriz-respecto-bases` (nivel 6.3)

**Enunciado.** Si $[T]_{B,C}$ tiene columnas $[T(b_j)]_C$, entonces $[T(v)]_C=[T]_{B,C}[v]_B$.

**Hipótesis.** $B=(b_j)$ base de $V$, $C$ base de $W$, $F$ lineal; Puedes citar la linealidad de las coordenadas

**Depende de.** `t.coordenadas-lineales`, `t.matriz-cambio-base`

**Demostración (grafo de dependencias entre líneas).** Cualquier orden que respete las flechas se acepta.

- **L1** ← ∅ — Sea $[v]_B=(x_1,\dots,x_n)$, es decir, $v=\sum x_jb_j$. _[Coordenadas de v respecto de la base B = (b₁,…,bₙ): el único (x₁,…,xₙ) con v = x₁b₁ + ⋯ + xₙbₙ]_
- **L2** ← L1 — Por linealidad de $F$, $F(v)=\sum x_jF(b_j)$. _[Transformación lineal: T(u + v) = T(u) + T(v) y T(cv) = cT(v)]_
- **L3** ← L2 — Aplicando $[\cdot]_C$ y su linealidad, $[F(v)]_C=\sum x_j[F(b_j)]_C$. _[Las coordenadas son lineales]_
- **L4** ← L3 — Esa suma es la combinación lineal de las columnas de $P$ con coeficientes $x_j$, o sea $P\,[v]_B$. ∎ _[Matriz de T respecto de las bases B y C: columnas [T(bⱼ)]_C; para las canónicas, columnas T(eⱼ)]_

**Líneas distractoras (falsas a propósito).**

- Con $T=\mathrm{id}$ se obtiene la matriz de cambio de base; luego siempre. — _falla:_ un ejemplo no prueba el caso general
- Como $[\cdot]_C$ es lineal, ya queda demostrado. — _falla:_ también hace falta la linealidad de $T$ y la definición de la matriz

**Errores para «cazar el error».**

- Sustituye **L3**: Aplicando $[\cdot]_C$, $[F(v)]_C=\sum x_j[F(b_j)]_B$. — _diagnóstico:_ Error de cálculo: el resultado de la línea no sale de la anterior
- Sustituye **L4**: Esa suma es la combinación de las **filas** de $P$. — _diagnóstico:_ Error de cálculo: el resultado de la línea no sale de la anterior

**Estrategias.**

- ✓ válida: Aplicar $T$ y luego las coordenadas a $v=\sum x_jb_j$ — Es la prueba estándar.
- ✗ no sirve: Verificar un ejemplo concreto — Un ejemplo ilustra, pero no prueba un enunciado general.
- ✗ no sirve: Suponer lo que se quiere probar — Eso es un argumento circular.
- ✗ no sirve: Apoyarse en un dibujo o en la intuición — Ayuda a entender, pero no es una demostración.

### Fórmula de semejanza — `t.semejanza-cambio-base` (nivel 6.4)

**Enunciado.** Si $P=P_{C\to B}$, entonces $[T]_C=P^{-1}[T]_BP$.

**Hipótesis.** $B,C$ bases de $V$ y $F$ lineal; Puedes citar las matrices respecto de bases, la inversa del cambio de base y la unicidad de la matriz asociada

**Depende de.** `t.matriz-respecto-bases`, `t.cambio-base-inversa`, `t.matriz-asociada`

**Demostración (grafo de dependencias entre líneas).** Cualquier orden que respete las flechas se acepta.

- **L1** ← ∅ — Para todo $u$, $[u]_B=S[u]_C$ (cambio de base de $C$ a $B$). _[Inversa del cambio de base]_
- **L2** ← L1 — Por la matriz respecto de bases, $[F(u)]_B=[F]_B[u]_B=[F]_B\,S[u]_C$. _[Matriz respecto de bases]_
- **L3** ← L2 — Volviendo a $C$: $[F(u)]_C=S^{-1}[F(u)]_B$, pues $S^{-1}=P_{B\to C}$. _[Inversa del cambio de base]_
- **L4** ← L2, L3 — Luego $[F(u)]_C=(S^{-1}[F]_B\,S)[u]_C$ para todo $u$. _[Matriz de T respecto de las bases B y C: columnas [T(bⱼ)]_C; para las canónicas, columnas T(eⱼ)]_
- **L5** ← L4 — Como la matriz que cumple $[F(u)]_C=X[u]_C$ es única, $[F]_C=S^{-1}[F]_B\,S$. ∎ _[Matriz asociada]_

**Líneas distractoras (falsas a propósito).**

- Con $T=\mathrm{id}$ se obtiene $I=P^{-1}IP$; luego siempre. — _falla:_ un ejemplo no prueba el caso general
- Como cambiar de base no cambia la transformación, las matrices son iguales. — _falla:_ cambian: la fórmula las relaciona con $P$

**Errores para «cazar el error».**

- Sustituye **L2**: $[F(u)]_B=[F]_B[u]_B=[F]_B\,S^{-1}[u]_C$. — _diagnóstico:_ Error de cálculo: el resultado de la línea no sale de la anterior
- Sustituye **L3**: Volviendo a $C$: $[F(u)]_C=S[F(u)]_B$. — _diagnóstico:_ Error de cálculo: el resultado de la línea no sale de la anterior

**Estrategias.**

- ✓ válida: Seguir un vector de $C$ a $B$, aplicar $T$ y volver a $C$ — Es la prueba estándar.
- ✗ no sirve: Verificar un ejemplo concreto — Un ejemplo ilustra, pero no prueba un enunciado general.
- ✗ no sirve: Suponer lo que se quiere probar — Eso es un argumento circular.
- ✗ no sirve: Apoyarse en un dibujo o en la intuición — Ayuda a entender, pero no es una demostración.

### La traza es invariante — `t.traza-semejantes` (nivel 6.4)

**Enunciado.** $\operatorname{tr}(AB)=\operatorname{tr}(BA)$; en consecuencia matrices semejantes tienen la misma traza.

**Hipótesis.** $A,B$ son $n\times n$ y $S$ invertible; Puedes usar la definición del producto y reordenar sumas finitas

**Depende de.** `t.mat-producto-asoc`

**Demostración (grafo de dependencias entre líneas).** Cualquier orden que respete las flechas se acepta.

- **L1** ← ∅ — $\operatorname{tr}(AB)=\sum_i(AB)_{ii}=\sum_i\sum_kA_{ik}B_{ki}$ por la definición del producto. _[Producto de matrices: (AB)ᵢⱼ = Σₖ aᵢₖ bₖⱼ]_
- **L2** ← L1 — Intercambiando el orden de las sumas finitas, $=\sum_k\sum_iB_{ki}A_{ik}=\sum_k(BA)_{kk}=\operatorname{tr}(BA)$. _[Las sumas finitas se pueden reordenar y distribuir]_
- **L3** ← L2 — Para la semejanza, $\operatorname{tr}(S^{-1}(AS))=\operatorname{tr}((AS)\,S^{-1})$ aplicando L2 con $A\to S^{-1}$ y $B\to AS$. _[Asociatividad del producto]_
- **L4** ← L3 — Y $(AS)S^{-1}=A(SS^{-1})$, que por asociatividad e inversa es igual a $A$; así $\operatorname{tr}B=\operatorname{tr}A$. ∎ _[Asociatividad del producto]_

**Líneas distractoras (falsas a propósito).**

- Con $A=\begin{pmatrix}1&2\\0&1\end{pmatrix}$ y $B=I$ las trazas coinciden; luego siempre. — _falla:_ un ejemplo no prueba el caso general
- Como $AB$ y $BA$ son iguales, tienen la misma traza. — _falla:_ en general $AB\neq BA$; solo las trazas coinciden

**Errores para «cazar el error».**

- Sustituye **L1**: $\operatorname{tr}(AB)=\sum_i(A_{ii}\cdot B_{ii})$. — _diagnóstico:_ Error de cálculo: el resultado de la línea no sale de la anterior
- Sustituye **L4**: Y $(AS)S^{-1}=A(S+S^{-1})$. — _diagnóstico:_ Error de cálculo: el resultado de la línea no sale de la anterior

**Estrategias.**

- ✓ válida: Escribir las trazas con sumas dobles y reordenar — Es la prueba estándar.
- ✗ no sirve: Verificar un ejemplo concreto — Un ejemplo ilustra, pero no prueba un enunciado general.
- ✗ no sirve: Suponer lo que se quiere probar — Eso es un argumento circular.
- ✗ no sirve: Apoyarse en un dibujo o en la intuición — Ayuda a entender, pero no es una demostración.

### El determinante es invariante (2×2) — `t.det-semejantes-2x2` (nivel 6.4)

**Enunciado.** Dos matrices $2\times2$ semejantes tienen el mismo determinante.

**Hipótesis.** $S$ invertible y $Y=S^{-1}XS$; Puedes citar el determinante de un producto $2\times2$ y el criterio de invertibilidad

**Depende de.** `t.det-producto-2x2`, `t.det-invertible-2x2`

**Demostración (grafo de dependencias entre líneas).** Cualquier orden que respete las flechas se acepta.

- **L1** ← ∅ — Por el determinante de un producto, $\det Y=\det(S^{-1})\,\det X\,\det S$. _[Determinante de un producto (2×2)]_
- **L2** ← ∅ — Como $S$ es invertible, $\det S\neq0$ (criterio de invertibilidad $2\times2$). _[Determinante e inversa (2×2)]_
- **L3** ← L2 — De $S^{-1}S=I$ se tiene $\det(S^{-1})\det S=\det I=1$, así que $\det(S^{-1})\det S=1$. _[Determinante de un producto (2×2)]_
- **L4** ← L1, L3 — Sustituyendo en L1 y conmutando números, $\det Y=\det X$ por el factor $\det(S^{-1})\det S$, que vale $1$. ∎ _[Determinante: det A = Σᵢ (−1)^{i+1} aᵢ₁ det(Mᵢ₁), desarrollo por la primera columna]_

**Líneas distractoras (falsas a propósito).**

- Con $S=2I$ se cumple; luego siempre. — _falla:_ un ejemplo no prueba el caso general
- Como $Y$ y $X$ se parecen, tienen el mismo determinante. — _falla:_ hay que probarlo con las propiedades del determinante

**Errores para «cazar el error».**

- Sustituye **L1**: Por el determinante de un producto, $\det Y=\det(S^{-1})+\det X+\det S$. — _diagnóstico:_ Error de cálculo: el resultado de la línea no sale de la anterior
- Sustituye **L3**: De $S^{-1}S=I$ se tiene $\det(S^{-1})\det S=\det I=0$. — _diagnóstico:_ Error de cálculo: el resultado de la línea no sale de la anterior

**Estrategias.**

- ✓ válida: Usar $\det(XYZ)=\det X\det Y\det Z$ y $\det(P^{-1})=1/\det P$ — Es la prueba estándar.
- ✗ no sirve: Verificar un ejemplo concreto — Un ejemplo ilustra, pero no prueba un enunciado general.
- ✗ no sirve: Suponer lo que se quiere probar — Eso es un argumento circular.
- ✗ no sirve: Apoyarse en un dibujo o en la intuición — Ayuda a entender, pero no es una demostración.

### Potencias de matrices semejantes — `t.semejante-potencias` (nivel 6.4)

**Enunciado.** Si $A=PDP^{-1}$, entonces $A^k=PD^kP^{-1}$ para todo $k\ge1$.

**Hipótesis.** $M=PDP^{-1}$ con $P$ invertible; Puedes citar la asociatividad del producto

**Depende de.** `t.mat-producto-asoc`

**Demostración (grafo de dependencias entre líneas).** Cualquier orden que respete las flechas se acepta.

- **L1** ← ∅ — Base $n=1$: $M^1=M=PD^1P^{-1}$ por hipótesis. _[Principio de inducción: si P(0) (o P(1)) y P(n)⇒P(n+1), entonces P(n) para todo n]_
- **L2** ← L1 — Paso: supongamos $M^n=PD^nP^{-1}$. Entonces $M^{n+1}=M^nM=(PD^nP^{-1})(PDP^{-1})$. _[Hipótesis de inducción]_
- **L3** ← L2 — Por asociatividad, $=PD^n(P^{-1}P)DP^{-1}$, y $P^{-1}P=$ $I$. _[Asociatividad del producto]_
- **L4** ← L3 — Así $M^{n+1}=PD^{n+1}P^{-1}$. ∎ _[Hipótesis de inducción]_

**Líneas distractoras (falsas a propósito).**

- Con $D=2I$ y $k=2$ se comprueba; luego siempre. — _falla:_ un ejemplo no prueba el caso general
- Como $P$ y $P^{-1}$ se cancelan, $M^n=D^n$. — _falla:_ solo se cancelan en el producto intermedio, no en los extremos

**Errores para «cazar el error».**

- Sustituye **L2**: Entonces $M^{n+1}=(PD^nP^{-1})+(PDP^{-1})$. — _diagnóstico:_ Error de cálculo: el resultado de la línea no sale de la anterior
- Sustituye **L3**: Por asociatividad, $=PD^n(P^{-1}+P)DP^{-1}$. — _diagnóstico:_ Error de cálculo: el resultado de la línea no sale de la anterior

**Estrategias.**

- ✓ válida: Inducción sobre $k$ con $P^{-1}P=I$ en el medio — Es la prueba estándar.
- ✗ no sirve: Verificar un ejemplo concreto — Un ejemplo ilustra, pero no prueba un enunciado general.
- ✗ no sirve: Suponer lo que se quiere probar — Eso es un argumento circular.
- ✗ no sirve: Apoyarse en un dibujo o en la intuición — Ayuda a entender, pero no es una demostración.

### Valor propio y núcleo — `t.propio-nucleo` (nivel 7.1)

**Enunciado.** $\lambda$ es valor propio de $A$ si y solo si $A-\lambda I$ no es invertible; entonces $E_\lambda=\ker(A-\lambda I)$ es un subespacio.

**Hipótesis.** $A$ es $n\times n$; Puedes citar los criterios de invertibilidad y que el núcleo es subespacio

**Depende de.** `t.invertible-equivalencias`, `t.nucleo-subespacio`

**Demostración (grafo de dependencias entre líneas).** Cualquier orden que respete las flechas se acepta.

- **L1** ← ∅ — $λ$ es valor propio $\iff$ existe $x\neq0$ con $Ax=λx$, por definición. _[Valor propio λ de A: existe v ≠ 0 con Av = λv; v es un vector propio]_
- **L2** ← L1 — $Ax=λx\iff(A-λI)x=0$ (pasando $λx$ al otro lado y usando $Ix=x$). _[Espacio propio E_λ = ker(A − λI)]_
- **L3** ← L2 — Entonces $λ$ es propio $\iff(A-λI)x=0$ tiene una solución $x\neq0$ $\iff$ $A-λI$ no es invertible. _[Criterios de invertibilidad]_
- **L4** ← L2 — Por el teorema del núcleo, $E_λ=\ker(A-λI)$ es un subespacio. ∎ _[El núcleo es subespacio]_

**Líneas distractoras (falsas a propósito).**

- Con $A=\mathrm{diag}(2,3)$ y $λ=2$ se cumple; luego siempre. — _falla:_ un ejemplo no prueba el caso general
- Como $Ax=λx$, la matriz $A-λI$ es la matriz cero. — _falla:_ solo se anula sobre $v$, no sobre todo vector

**Errores para «cazar el error».**

- Sustituye **L2**: $Ax=λx\iff(A+λI)x=0$. — _diagnóstico:_ Error de cálculo: el resultado de la línea no sale de la anterior
- Sustituye **L3**: Es propio $\iff$ $(A-λI)x=0$ solo tiene $x=0$ $\iff$ no invertible. — _diagnóstico:_ La conclusión no se sigue de lo anterior (falacia)

**Estrategias.**

- ✓ válida: Pasar de $Av=\lambda v$ a $(A-\lambda I)v=0$ y usar los criterios de invertibilidad — Es la prueba estándar.
- ✗ no sirve: Verificar un ejemplo concreto — Un ejemplo ilustra, pero no prueba un enunciado general.
- ✗ no sirve: Suponer lo que se quiere probar — Eso es un argumento circular.
- ✗ no sirve: Apoyarse en un dibujo o en la intuición — Ayuda a entender, pero no es una demostración.

### Propios distintos son independientes — `t.propios-distintos-independientes` (nivel 7.1)

**Enunciado.** Vectores propios asociados a valores propios distintos son linealmente independientes.

**Hipótesis.** $Bw_i=μ_iw_i$, $w_i\neq0$, $μ_i$ distintos; Basta la definición de independencia

**Depende de.** `t.dependencia-combinacion`

**Demostración (grafo de dependencias entre líneas).** Cualquier orden que respete las flechas se acepta.

- **L1** ← ∅ — Base $k=1$: $w_1\neq0$, así que $\{w_1\}$ es independiente. _[v₁,…,vₖ son independientes si c₁v₁ + ⋯ + cₖvₖ = 0 solo se da con todos los cᵢ = 0]_
- **L2** ← L1 — Paso: supongamos independientes $w_1,\dots,w_{k-1}$ y sea $a_1w_1+\cdots+a_kw_k=0$ (1). _[Hipótesis de inducción]_
- **L3** ← L2 — Aplicando $B$: $a_1μ_1w_1+\cdots+a_kμ_kw_k=0$ (2); multiplicando (1) por $μ_k$: $a_1μ_kw_1+\cdots+a_kμ_kw_k=0$ (3). _[Valor propio λ de A: existe v ≠ 0 con Av = λv; v es un vector propio]_
- **L4** ← L3 — Restando (3) de (2): $a_1(μ_1-μ_k)w_1+\cdots+a_{k-1}(μ_{k-1}-μ_k)w_{k-1}=0$. _[v₁,…,vₖ son independientes si c₁v₁ + ⋯ + cₖvₖ = 0 solo se da con todos los cᵢ = 0]_
- **L5** ← L4 — Por hipótesis de inducción y como $μ_i-μ_k\neq0$, resulta $a_1=\cdots=a_{k-1}=0$. Entonces (1) queda $a_kw_k=0$, así que $a_k=0$. ∎ _[Hipótesis de inducción]_

**Líneas distractoras (falsas a propósito).**

- Con $\mathrm{diag}(1,2)$ y $e_1,e_2$ se cumple; luego siempre. — _falla:_ un ejemplo no prueba el caso general
- Como son vectores propios, son independientes por definición. — _falla:_ hace falta que los valores propios sean distintos

**Errores para «cazar el error».**

- Sustituye **L3**: Aplicando $B$: $a_1μ_1+\cdots+a_kμ_k=0$. — _diagnóstico:_ Error de cálculo: el resultado de la línea no sale de la anterior
- Sustituye **L4**: Sumando (3) y (2) se obtiene $a_1(μ_1+μ_k)w_1+\cdots=0$. — _diagnóstico:_ Error de cálculo: el resultado de la línea no sale de la anterior

**Estrategias.**

- ✓ válida: Inducción sobre $k$ aplicando $A$ y restando un múltiplo de la relación — Es la prueba estándar.
- ✗ no sirve: Verificar un ejemplo concreto — Un ejemplo ilustra, pero no prueba un enunciado general.
- ✗ no sirve: Suponer lo que se quiere probar — Eso es un argumento circular.
- ✗ no sirve: Apoyarse en un dibujo o en la intuición — Ayuda a entender, pero no es una demostración.

### Polinomio característico (2×2) — `t.polinomio-caracteristico-2x2` (nivel 7.1)

**Enunciado.** Los valores propios de una $2\times2$ son las raíces de $\lambda^2-(\operatorname{tr}A)\lambda+\det A$; su suma es $\operatorname{tr}A$ y su producto $\det A$.

**Hipótesis.** $A$ es una matriz $2\times2$; Puedes citar el criterio de invertibilidad $2\times2$, que un valor propio anula $A-\lambda I$ no invertible y Vieta

**Depende de.** `t.vieta-cuadratica`, `t.det-invertible-2x2`, `t.propio-nucleo`

**Demostración (grafo de dependencias entre líneas).** Cualquier orden que respete las flechas se acepta.

- **L1** ← ∅ — Por el teorema del valor propio y el núcleo, $λ$ es propio $\iff A-λI$ no es invertible. _[Valor propio y núcleo]_
- **L2** ← L1 — Por el criterio de invertibilidad $2\times2$, eso ocurre $\iff\det(A-λI)=0$, es decir, $(a-λ)(s-λ)-br=0$. _[Determinante e inversa (2×2)]_
- **L3** ← L2 — Desarrollando, $λ^2-(a+s)λ+(as-br)=0$. _[Álgebra de los números: operar, despejar, sustituir]_
- **L4** ← L3 — Por Vieta, la suma de las raíces es $a+s=\operatorname{tr}A$ (menos el coeficiente de $λ$) y el producto es el término independiente $as-br=\det A$. ∎ _[Vieta para cuadráticas]_

**Líneas distractoras (falsas a propósito).**

- Para $\begin{pmatrix}2&0\\0&3\end{pmatrix}$ el polinomio es $(\lambda-2)(\lambda-3)$; luego siempre. — _falla:_ un ejemplo no prueba el caso general
- Como $A$ tiene dos entradas diagonales, esos son los valores propios. — _falla:_ solo en triangulares

**Errores para «cazar el error».**

- Sustituye **L2**: Eso ocurre $\iff(a-λ)(s-λ)+br=0$. — _diagnóstico:_ Error de cálculo: el resultado de la línea no sale de la anterior
- Sustituye **L4**: Por Vieta, la suma de las raíces es $-(a+s)$. — _diagnóstico:_ Error de cálculo: el resultado de la línea no sale de la anterior

**Estrategias.**

- ✓ válida: Desarrollar $\det(A-\lambda I)$ y aplicar Vieta — Es la prueba estándar.
- ✗ no sirve: Verificar un ejemplo concreto — Un ejemplo ilustra, pero no prueba un enunciado general.
- ✗ no sirve: Suponer lo que se quiere probar — Eso es un argumento circular.
- ✗ no sirve: Apoyarse en un dibujo o en la intuición — Ayuda a entender, pero no es una demostración.

### Potencias y valores propios — `t.propios-potencias` (nivel 7.1)

**Enunciado.** Si $Av=\lambda v$, entonces $A^kv=\lambda^kv$ para todo $k\ge1$.

**Hipótesis.** $Bx=μx$; Puedes usar la asociatividad del producto

**Depende de.** `t.mat-producto-asoc`

**Demostración (grafo de dependencias entre líneas).** Cualquier orden que respete las flechas se acepta.

- **L1** ← ∅ — Base $k=1$: $Bx=μx$ por hipótesis. _[Principio de inducción: si P(0) (o P(1)) y P(n)⇒P(n+1), entonces P(n) para todo n]_
- **L2** ← L1 — Paso: supongamos $B^kx=μ^kx$. Entonces $B^{k+1}x=B(B^kx)$ por asociatividad. _[Asociatividad del producto]_
- **L3** ← L2 — Por hipótesis de inducción, $=B(μ^kx)=μ^k(Bx)$ (el escalar sale de la multiplicación). _[Hipótesis de inducción]_
- **L4** ← L3 — Y $Bx=μx$, de modo que $=μ^k\cdot μx$, que es igual a $μ^{k+1}x$. _[Valor propio λ de A: existe v ≠ 0 con Av = λv; v es un vector propio]_

**Líneas distractoras (falsas a propósito).**

- Con $A=\mathrm{diag}(2,3)$ y $v=e_1$: $A^3e_1=8e_1$; luego siempre. — _falla:_ un ejemplo no prueba el caso general
- Como $B^k$ es un producto de matrices, no puede actuar como un escalar. — _falla:_ sobre un vector propio sí actúa como $\lambda^k$

**Errores para «cazar el error».**

- Sustituye **L3**: Por hipótesis de inducción, $=B(μ^kx)=(μ+k)(Bx)$. — _diagnóstico:_ Error de cálculo: el resultado de la línea no sale de la anterior
- Sustituye **L4**: Y $Bx=μx$, de modo que $=kμx$. — _diagnóstico:_ Error de cálculo: el resultado de la línea no sale de la anterior

**Estrategias.**

- ✓ válida: Inducción sobre $k$ sacando el escalar — Es la prueba estándar.
- ✗ no sirve: Verificar un ejemplo concreto — Un ejemplo ilustra, pero no prueba un enunciado general.
- ✗ no sirve: Suponer lo que se quiere probar — Eso es un argumento circular.
- ✗ no sirve: Apoyarse en un dibujo o en la intuición — Ayuda a entender, pero no es una demostración.

### Diagonalizable y base de propios — `t.diagonalizable-base` (nivel 7.2)

**Enunciado.** $A$ ($n\times n$) es diagonalizable si y solo si hay una base de $\mathbb{Q}^n$ formada por vectores propios de $A$; entonces $A=PDP^{-1}$ con $P$ las columnas propias.

**Hipótesis.** $B$ es $n\times n$; Puedes citar el criterio de invertibilidad por columnas independientes

**Depende de.** `t.semejanza-cambio-base`, `t.invertible-equivalencias`

**Demostración (grafo de dependencias entre líneas).** Cualquier orden que respete las flechas se acepta.

- **L1** ← ∅ — (⇒) Si $B=PDP^{-1}$, entonces $BP=PD$. La columna $j$ de esta igualdad dice $Bv_j=d_jv_j$, con $v_j$ la columna $j$ de $P$. _[A es diagonalizable si A = PDP⁻¹ con D diagonal y P invertible]_
- **L2** ← L1 — Como $P$ es invertible, sus columnas $v_j$ son independientes y no nulas: forman una base de $\mathbb{Q}^n$ de vectores propios. _[Criterios de invertibilidad]_
- **L3** ← ∅ — (⇐) Sea $(v_1,\dots,v_n)$ una base de vectores propios con $Bv_j=d_jv_j$. Formamos $P=(v_1\ \cdots\ v_n)$ y $D=\mathrm{diag}(d_j)$. _[Valor propio λ de A: existe v ≠ 0 con Av = λv; v es un vector propio]_
- **L4** ← L3 — Entonces $BP=(Bv_1\ \cdots\ Bv_n)=(d_1v_1\ \cdots\ d_nv_n)=PD$. _[A es diagonalizable si A = PDP⁻¹ con D diagonal y P invertible]_
- **L5** ← L4 — Como las columnas de $P$ son independientes, $P$ es invertible (criterio de invertibilidad) y $B=PDP^{-1}$. ∎ _[Criterios de invertibilidad]_

**Líneas distractoras (falsas a propósito).**

- Con $\mathrm{diag}(1,2)$ la base canónica es de vectores propios; luego siempre. — _falla:_ un ejemplo no prueba el caso general
- Como $B$ tiene vectores propios, es diagonalizable. — _falla:_ hacen falta $n$ vectores propios independientes

**Errores para «cazar el error».**

- Sustituye **L1**: (⇒) De $B=PDP^{-1}$ resulta $PB=DP$. — _diagnóstico:_ Error de cálculo: el resultado de la línea no sale de la anterior
- Sustituye **L4**: Entonces $BP=(d_1v_1\ \cdots\ d_nv_n)=DP$. — _diagnóstico:_ Error de cálculo: el resultado de la línea no sale de la anterior

**Estrategias.**

- ✓ válida: Usar $AP=PD$ columna a columna — Es la prueba estándar.
- ✗ no sirve: Verificar un ejemplo concreto — Un ejemplo ilustra, pero no prueba un enunciado general.
- ✗ no sirve: Suponer lo que se quiere probar — Eso es un argumento circular.
- ✗ no sirve: Apoyarse en un dibujo o en la intuición — Ayuda a entender, pero no es una demostración.

### n valores propios distintos — `t.n-propios-distintos` (nivel 7.2)

**Enunciado.** Si $A$ ($n\times n$) tiene $n$ valores propios distintos, es diagonalizable.

**Hipótesis.** $A$ tiene $n$ valores propios distintos $λ_1,\dots,λ_n$; Puedes citar la independencia de vectores propios, el criterio de $n$ independientes y la caracterización de diagonalizable

**Depende de.** `t.propios-distintos-independientes`, `t.n-independientes-base`, `t.diagonalizable-base`

**Demostración (grafo de dependencias entre líneas).** Cualquier orden que respete las flechas se acepta.

- **L1** ← ∅ — Para cada $λ_i$ existe un vector propio $v_i\neq0$ con $Av_i=λ_iv_i$. _[Valor propio λ de A: existe v ≠ 0 con Av = λv; v es un vector propio]_
- **L2** ← L1 — Como los $λ_i$ son distintos, $v_1,\dots,v_n$ son linealmente independientes. _[Propios distintos son independientes]_
- **L3** ← L2 — Son $n$ vectores independientes en un espacio de dimensión $n$: por el criterio de $n$ independientes, forman una base. _[Independientes de tamaño n]_
- **L4** ← L3 — Hay una base de $\mathbb{Q}^n$ formada por vectores propios de $A$; por la caracterización de diagonalizable, $A$ es diagonalizable. ∎ _[Diagonalizable y base de propios]_

**Líneas distractoras (falsas a propósito).**

- La matriz $\begin{pmatrix}1&1\\0&2\end{pmatrix}$ lo cumple y es diagonalizable; luego siempre. — _falla:_ un ejemplo no prueba el caso general
- Si es diagonalizable entonces tiene $n$ valores propios distintos. — _falla:_ es la implicación contraria (y falsa: $I$ es diagonalizable)

**Errores para «cazar el error».**

- Sustituye **L2**: Como los $λ_i$ son distintos, $v_1,\dots,v_n$ son iguales. — _diagnóstico:_ Error de cálculo: el resultado de la línea no sale de la anterior
- Sustituye **L3**: Son $n$ vectores independientes, por lo que generan un espacio de dimensión $n-1$. — _diagnóstico:_ Error de cálculo: el resultado de la línea no sale de la anterior

**Estrategias.**

- ✓ válida: Usar que los propios de valores distintos son independientes y que $n$ independientes son base — Es la prueba estándar.
- ✗ no sirve: Verificar un ejemplo concreto — Un ejemplo ilustra, pero no prueba un enunciado general.
- ✗ no sirve: Suponer lo que se quiere probar — Eso es un argumento circular.
- ✗ no sirve: Apoyarse en un dibujo o en la intuición — Ayuda a entender, pero no es una demostración.

### Matriz defectiva (2×2) — `t.no-diagonalizable-defectiva` (nivel 7.2)

**Enunciado.** Si una $2\times2$ tiene un único valor propio $\lambda$ y $A\neq\lambda I$, no es diagonalizable.

**Hipótesis.** el único valor propio de $B$ es $μ$ y $B\neq μI$; Puedes citar la caracterización de las matrices diagonalizables

**Depende de.** `t.diagonalizable-base`

**Demostración (grafo de dependencias entre líneas).** Cualquier orden que respete las flechas se acepta.

- **L1** ← ∅ — Supongamos por contradicción que $B=SDS^{-1}$ con $D$ diagonal. _[Reducción al absurdo: si suponer lo contrario lleva a una contradicción, lo supuesto es falso]_
- **L2** ← L1 — Por la caracterización de diagonalizable, las entradas de la diagonal de $D$ son valores propios de $B$ (cada columna de $S$ es vector propio). _[Diagonalizable y base de propios]_
- **L3** ← L2 — Como el único valor propio es $μ$, $D=μI$. _[Valor propio λ de A: existe v ≠ 0 con Av = λv; v es un vector propio]_
- **L4** ← L3 — Entonces $B=S(μI)S^{-1}=μ(SS^{-1})$, que es igual a $μI$. _[A es diagonalizable si A = PDP⁻¹ con D diagonal y P invertible]_
- **L5** ← L4 — Esto contradice $B\neq μI$. Luego $B$ no es diagonalizable. ∎ _[Reducción al absurdo: si suponer lo contrario lleva a una contradicción, lo supuesto es falso]_

**Líneas distractoras (falsas a propósito).**

- La matriz $\begin{pmatrix}1&1\\0&1\end{pmatrix}$ no es diagonalizable; luego siempre. — _falla:_ un ejemplo no prueba el caso general
- Como el valor propio se repite, la matriz no puede ser diagonalizable. — _falla:_ $I$ tiene un valor propio repetido y es diagonal

**Errores para «cazar el error».**

- Sustituye **L3**: Como el único valor propio es $μ$, $D=0$. — _diagnóstico:_ Error de cálculo: el resultado de la línea no sale de la anterior
- Sustituye **L4**: Entonces $B=S(μI)S^{-1}=μS^2$. — _diagnóstico:_ Error de cálculo: el resultado de la línea no sale de la anterior

**Estrategias.**

- ✓ válida: Suponer $A=PDP^{-1}$ y obtener $A=\lambda I$ — Es la prueba estándar.
- ✗ no sirve: Verificar un ejemplo concreto — Un ejemplo ilustra, pero no prueba un enunciado general.
- ✗ no sirve: Suponer lo que se quiere probar — Eso es un argumento circular.
- ✗ no sirve: Apoyarse en un dibujo o en la intuición — Ayuda a entender, pero no es una demostración.

### Recurrencias con diagonalización — `t.recurrencia-diagonal` (nivel 7.2)

**Enunciado.** Si $x_{k+1}=Ax_k$ y $A=PDP^{-1}$, entonces $x_k=PD^kP^{-1}x_0$.

**Hipótesis.** $x_{n+1}=Ax_n$ y $A=SΛS^{-1}$; Puedes citar la fórmula de potencias de matrices semejantes

**Depende de.** `t.semejante-potencias`

**Demostración (grafo de dependencias entre líneas).** Cualquier orden que respete las flechas se acepta.

- **L1** ← ∅ — Por inducción, $x_n=A^nx_0$: para $n=0$ es $x_0=Ix_0$ y si vale para $n$, $x_{n+1}=Ax_n=A^{n+1}x_0$. _[Hipótesis de inducción]_
- **L2** ← L1 — Por el teorema de las potencias de matrices semejantes, $A^n=SΛ^nS^{-1}$ para $n\ge1$. _[Potencias de matrices semejantes]_
- **L3** ← L1, L2 — Sustituyendo, $x_n=SΛ^nS^{-1}x_0$. _[A es diagonalizable si A = PDP⁻¹ con D diagonal y P invertible]_
- **L4** ← L3 — Para $n=0$ el lado derecho es $SS^{-1}x_0$, que es igual a $x_0$, que coincide. ∎ _[Principio de inducción: si P(0) (o P(1)) y P(n)⇒P(n+1), entonces P(n) para todo n]_

**Líneas distractoras (falsas a propósito).**

- Con $A=\mathrm{diag}(2,3)$ se cumple la fórmula; luego siempre. — _falla:_ un ejemplo no prueba el caso general
- Como $Λ$ es diagonal, $x_n=Λ^nx_0$. — _falla:_ faltan $P$ y $P^{-1}$

**Errores para «cazar el error».**

- Sustituye **L1**: Por inducción, $x_n=Anx_0$. — _diagnóstico:_ Error de cálculo: el resultado de la línea no sale de la anterior
- Sustituye **L3**: Sustituyendo, $x_n=S^{-1}Λ^nSx_0$. — _diagnóstico:_ Error de cálculo: el resultado de la línea no sale de la anterior

**Estrategias.**

- ✓ válida: Probar $x_k=A^kx_0$ por inducción y sustituir $A^k=PD^kP^{-1}$ — Es la prueba estándar.
- ✗ no sirve: Verificar un ejemplo concreto — Un ejemplo ilustra, pero no prueba un enunciado general.
- ✗ no sirve: Suponer lo que se quiere probar — Eso es un argumento circular.
- ✗ no sirve: Apoyarse en un dibujo o en la intuición — Ayuda a entender, pero no es una demostración.

### Desigualdad de Cauchy-Schwarz — `t.cauchy-schwarz` (nivel 7.3)

**Enunciado.** $(u\cdot v)^2\le(u\cdot u)(v\cdot v)$ para todos $u,v\in\mathbb{R}^n$.

**Hipótesis.** $x,v\in\mathbb{R}^n$ con $v\neq0$; Puedes usar que $w\cdot w\ge0$ y la fórmula cuadrática (el caso $v=0$ es trivial)

**Depende de.** `t.cuadratica-formula`

**Demostración (grafo de dependencias entre líneas).** Cualquier orden que respete las flechas se acepta.

- **L1** ← ∅ — Si $v=0$ ambos lados valen $0$. Suponemos $v\neq0$ y consideramos $q(t)=(x-tv)\cdot(x-tv)\ge0$ para todo real $t$. _[Producto punto: u·v = Σ uᵢvᵢ; norma |u|² = u·u; u ⟂ v si u·v = 0]_
- **L2** ← L1 — Desarrollando, $q(t)=(v\cdot v)t^2-2(x\cdot v)t+(x\cdot x)$, una cuadrática con coeficiente líder $v\cdot v>0$. _[Álgebra de los números: operar, despejar, sustituir]_
- **L3** ← L2 — Si su discriminante fuera positivo, tendría dos raíces reales distintas y tomaría valores negativos entre ellas (por la fórmula cuadrática), contra $q\ge0$. _[Fórmula cuadrática]_
- **L4** ← L3 — Luego $\Delta=4(x\cdot v)^2-4(v\cdot v)(x\cdot x)\le0$, es decir, $(x\cdot v)^2\le(x\cdot x)(v\cdot v)$. ∎ _[Discriminante de ax² + bx + c: Δ = b² − 4ac]_

**Líneas distractoras (falsas a propósito).**

- Con $u=(1,0)$ y $v=(1,1)$: $1\le2$; luego siempre. — _falla:_ un ejemplo no prueba el caso general
- Como $|\cos\theta|\le1$, vale automáticamente. — _falla:_ usa la desigualdad que se quiere demostrar para definir el ángulo

**Errores para «cazar el error».**

- Sustituye **L2**: Desarrollando, $q(t)=(v\cdot v)t^2+2(x\cdot v)t+(x\cdot x)$. — _diagnóstico:_ Error de cálculo: el resultado de la línea no sale de la anterior
- Sustituye **L4**: Luego $\Delta\ge0$, es decir, $(x\cdot v)^2\ge(x\cdot x)(v\cdot v)$. — _diagnóstico:_ La conclusión no se sigue de lo anterior (falacia)

**Estrategias.**

- ✓ válida: Estudiar $\lvert u-tv\rvert^2\ge0$ como cuadrática en $t$ — Es la prueba estándar.
- ✓ válida: Descomponer $u=\mathrm{proy}_v u+w$ y usar $w\cdot w\ge0$ — Válida: también da la desigualdad.
- ✗ no sirve: Verificar un ejemplo concreto — Un ejemplo ilustra, pero no prueba un enunciado general.
- ✗ no sirve: Suponer lo que se quiere probar — Eso es un argumento circular.

### Ortogonales no nulos son independientes — `t.ortogonales-independientes` (nivel 7.3)

**Enunciado.** Vectores no nulos y ortogonales dos a dos son linealmente independientes.

**Hipótesis.** $u_i\neq0$ y $u_i\cdot u_l=0$ si $i\neq l$; Basta la definición de independencia y el producto punto

**Depende de.** nada previo (solo definiciones y propiedades base)

**Demostración (grafo de dependencias entre líneas).** Cualquier orden que respete las flechas se acepta.

- **L1** ← ∅ — Supongamos $c_1u_1+\cdots+c_ku_k=0$. Fijamos un índice $m$ arbitrario. _[v₁,…,vₖ son independientes si c₁v₁ + ⋯ + cₖvₖ = 0 solo se da con todos los cᵢ = 0]_
- **L2** ← L1 — Hacemos el producto punto con $u_m$: $\sum_ic_i(u_i\cdot u_m)=0\cdot u_m=0$. _[Producto punto: u·v = Σ uᵢvᵢ; norma |u|² = u·u; u ⟂ v si u·v = 0]_
- **L3** ← L2 — Por ortogonalidad, todos los sumandos con $i\neq m$ valen $0$, y queda $c_m(u_m\cdot u_m)=0$. _[Producto punto: u·v = Σ uᵢvᵢ; norma |u|² = u·u; u ⟂ v si u·v = 0]_
- **L4** ← L3 — Como $u_m\neq0$, $u_m\cdot u_m>0$, así que $c_m=0$. _[Producto punto: u·v = Σ uᵢvᵢ; norma |u|² = u·u; u ⟂ v si u·v = 0]_
- **L5** ← L4 — Como $m$ era arbitrario, todos los coeficientes son $0$: independientes. ∎ _[Lo probado para un elemento arbitrario vale para todos los elementos]_

**Líneas distractoras (falsas a propósito).**

- Con $e_1,e_2,e_3$ se cumple; luego siempre. — _falla:_ un ejemplo no prueba el caso general
- Como son ortogonales, no pueden ser proporcionales y por tanto son independientes. — _falla:_ dos a dos no proporcionales no basta: hay que probarlo con todos a la vez

**Errores para «cazar el error».**

- Sustituye **L3**: Por ortogonalidad, todos los sumandos con $i=m$ valen $0$. — _diagnóstico:_ Error de cálculo: el resultado de la línea no sale de la anterior
- Sustituye **L4**: Como $u_m\neq0$, $u_m\cdot u_m=0$. — _diagnóstico:_ Error de cálculo: el resultado de la línea no sale de la anterior

**Estrategias.**

- ✓ válida: Hacer el producto punto de una relación nula con cada $v_j$ — Es la prueba estándar.
- ✗ no sirve: Verificar un ejemplo concreto — Un ejemplo ilustra, pero no prueba un enunciado general.
- ✗ no sirve: Suponer lo que se quiere probar — Eso es un argumento circular.
- ✗ no sirve: Apoyarse en un dibujo o en la intuición — Ayuda a entender, pero no es una demostración.

### Proyección ortogonal — `t.proyeccion-ortogonal` (nivel 7.3)

**Enunciado.** Para $u\neq0$, $v-\operatorname{proy}_u(v)$ es ortogonal a $u$, y es el único múltiplo $cu$ con $v-cu\perp u$.

**Hipótesis.** $a\neq0$ y $c$ es un escalar; Basta la definición de ortogonalidad

**Depende de.** nada previo (solo definiciones y propiedades base)

**Demostración (grafo de dependencias entre líneas).** Cualquier orden que respete las flechas se acepta.

- **L1** ← ∅ — $(v-ca)\perp a$ significa $(v-ca)\cdot a=0$. _[Producto punto: u·v = Σ uᵢvᵢ; norma |u|² = u·u; u ⟂ v si u·v = 0]_
- **L2** ← L1 — Por bilinealidad, $(v-ca)\cdot a=v\cdot a-c(a\cdot a)$. _[Álgebra de los números: operar, despejar, sustituir]_
- **L3** ← L2 — Entonces la condición es $v\cdot a-c(a\cdot a)=0$, es decir, $c(a\cdot a)=v\cdot a$. _[Álgebra de los números: operar, despejar, sustituir]_
- **L4** ← L3 — Como $a\neq0$, $a\cdot a>0$ y podemos dividir: $c=\dfrac{v\cdot a}{a\cdot a}$. Todos los pasos son equivalencias. ∎ _[Producto punto: u·v = Σ uᵢvᵢ; norma |u|² = u·u; u ⟂ v si u·v = 0]_

**Líneas distractoras (falsas a propósito).**

- Con $u=(1,0)$ y $v=(3,4)$: $c=3$ y $v-3u=(0,4)\perp u$; luego siempre. — _falla:_ un ejemplo no prueba el caso general
- Como $v-ca$ es perpendicular a $a$ por construcción, el resultado es evidente. — _falla:_ es lo que hay que probar

**Errores para «cazar el error».**

- Sustituye **L2**: $(v-ca)\cdot a=v\cdot a+c(a\cdot a)$. — _diagnóstico:_ Error de cálculo: el resultado de la línea no sale de la anterior
- Sustituye **L4**: Como $a\neq0$, podemos dividir y queda $c=\dfrac{a\cdot a}{v\cdot a}$. — _diagnóstico:_ Error de cálculo: el resultado de la línea no sale de la anterior

**Estrategias.**

- ✓ válida: Imponer $(v-cu)\cdot u=0$ y despejar $c$ — Es la prueba estándar.
- ✗ no sirve: Verificar un ejemplo concreto — Un ejemplo ilustra, pero no prueba un enunciado general.
- ✗ no sirve: Suponer lo que se quiere probar — Eso es un argumento circular.
- ✗ no sirve: Apoyarse en un dibujo o en la intuición — Ayuda a entender, pero no es una demostración.

### Gram-Schmidt — `t.gram-schmidt` (nivel 7.3)

**Enunciado.** De $v_1,\dots,v_k$ independientes se obtienen $u_1=v_1$, $u_j=v_j-\sum_{i<j}\operatorname{proy}_{u_i}(v_j)$, ortogonales y con el mismo generado.

**Hipótesis.** $v_1,\dots,v_k$ independientes; Puedes citar la proyección ortogonal, que los ortogonales no nulos son independientes y que agregar un vector fuera del generado mantiene la independencia

**Depende de.** `t.proyeccion-ortogonal`, `t.ortogonales-independientes`, `t.agregar-independiente`

**Demostración (grafo de dependencias entre líneas).** Cualquier orden que respete las flechas se acepta.

- **L1** ← ∅ — Base: $u_1=v_1\neq0$ (es independiente) y $\operatorname{gen}(u_1)=\operatorname{gen}(v_1)$. _[Generado de S: el conjunto de todas las combinaciones lineales de elementos de S]_
- **L2** ← L1 — Paso: suponemos $u_1,\dots,u_{m-1}$ no nulos, ortogonales y con $\operatorname{gen}(u_1..u_{m-1})=\operatorname{gen}(v_1..v_{m-1})$. _[Hipótesis de inducción]_
- **L3** ← L2 — Ortogonalidad: para $l<m$, $u_m\cdot u_l=v_m\cdot u_l-\frac{v_m\cdot u_l}{u_l\cdot u_l}(u_l\cdot u_l)=0$, ya que los demás $u_i$ son ortogonales a $u_l$ (proyección ortogonal). _[Proyección ortogonal]_
- **L4** ← L2 — No nulo: $u_m=v_m-(\text{vector de }\operatorname{gen}(u_i))$ y $v_m\notin\operatorname{gen}(v_1..v_{m-1})=\operatorname{gen}(u_i)$ porque los $v_i$ son independientes. _[Agregar un vector independiente]_
- **L5** ← L3, L4 — Mismo generado: $u_m$ difiere de $v_m$ en un vector de $\operatorname{gen}(v_1..v_{m-1})$, así que ambos generados coinciden hasta $m$. Los $u_i$ son independientes (ortogonales no nulos). ∎ _[Ortogonales no nulos son independientes]_

**Líneas distractoras (falsas a propósito).**

- Con $v_1=(1,1)$, $v_2=(1,0)$ da $u_2=(1/2,-1/2)\perp u_1$; luego siempre. — _falla:_ un ejemplo no prueba el caso general
- Como restamos proyecciones, el resultado es ortogonal automáticamente. — _falla:_ hay que comprobar el producto punto con cada $u_l$

**Errores para «cazar el error».**

- Sustituye **L3**: $u_m\cdot u_l=v_m\cdot u_l+\frac{v_m\cdot u_l}{u_l\cdot u_l}(u_l\cdot u_l)$. — _diagnóstico:_ Error de cálculo: el resultado de la línea no sale de la anterior
- Sustituye **L4**: No nulo: $v_m\in\operatorname{gen}(u_i)$, así que $u_m=0$. — _diagnóstico:_ La conclusión no se sigue de lo anterior (falacia)

**Estrategias.**

- ✓ válida: Inducción sobre $j$ comprobando ortogonalidad, no nulidad e igualdad de generados — Es la prueba estándar.
- ✗ no sirve: Verificar un ejemplo concreto — Un ejemplo ilustra, pero no prueba un enunciado general.
- ✗ no sirve: Suponer lo que se quiere probar — Eso es un argumento circular.
- ✗ no sirve: Apoyarse en un dibujo o en la intuición — Ayuda a entender, pero no es una demostración.

### Propios de simétricas — `t.simetrica-propios-ortogonales` (nivel 7.4)

**Enunciado.** Si $A=A^T$, los vectores propios de valores propios distintos son ortogonales.

**Hipótesis.** $A$ simétrica, $α\neq μ$ valores propios; Puedes usar $u\cdot v=u^Tv$ y la transpuesta de un producto

**Depende de.** `t.mat-transpuesta-producto`

**Demostración (grafo de dependencias entre líneas).** Cualquier orden que respete las flechas se acepta.

- **L1** ← ∅ — Calculamos $(Ax)\cdot w=α(x\cdot w)$ por ser $x$ vector propio. _[Valor propio λ de A: existe v ≠ 0 con Av = λv; v es un vector propio]_
- **L2** ← L1 — Por otro lado, $(Ax)\cdot w=(Ax)^Tw=x^TA^Tw$ por la transpuesta de un producto. _[Transpuesta de un producto]_
- **L3** ← L2 — Como $A^T=A$, esto es $x^TAw=x^T(μw)=μ(x\cdot w)$. _[Matriz simétrica: A = Aᵀ]_
- **L4** ← L1, L3 — Igualando, $α(x\cdot w)=μ(x\cdot w)$, es decir, $(α-μ)(x\cdot w)=0$. _[Producto punto: u·v = Σ uᵢvᵢ; norma |u|² = u·u; u ⟂ v si u·v = 0]_
- **L5** ← L4 — Como $α-μ\neq0$, $x\cdot w=0$. ∎ _[Producto punto: u·v = Σ uᵢvᵢ; norma |u|² = u·u; u ⟂ v si u·v = 0]_

**Líneas distractoras (falsas a propósito).**

- Con $\begin{pmatrix}2&1\\1&2\end{pmatrix}$, $(1,1)\perp(1,-1)$; luego siempre. — _falla:_ un ejemplo no prueba el caso general
- Para toda matriz, los vectores propios de valores distintos son ortogonales. — _falla:_ solo para simétricas: $\begin{pmatrix}1&1\\0&2\end{pmatrix}$ no lo cumple

**Errores para «cazar el error».**

- Sustituye **L2**: $(Ax)^Tw=A^Tx^Tw$. — _diagnóstico:_ Error de cálculo: el resultado de la línea no sale de la anterior
- Sustituye **L5**: Como $α-μ\neq0$, $α=μ$. — _diagnóstico:_ La conclusión no se sigue de lo anterior (falacia)

**Estrategias.**

- ✓ válida: Calcular $(Av)\cdot w$ de dos maneras usando $A^T=A$ — Es la prueba estándar.
- ✗ no sirve: Verificar un ejemplo concreto — Un ejemplo ilustra, pero no prueba un enunciado general.
- ✗ no sirve: Suponer lo que se quiere probar — Eso es un argumento circular.
- ✗ no sirve: Apoyarse en un dibujo o en la intuición — Ayuda a entender, pero no es una demostración.

### Teorema espectral (2×2) — `t.espectral-2x2` (nivel 7.4)

**Enunciado.** Una $\begin{pmatrix}a&b\\b&d\end{pmatrix}$ real tiene valores propios reales y, si $b\neq0$, una base ortogonal de vectores propios.

**Hipótesis.** $p,q,s\in\mathbb{R}$, $q\neq0$; Puedes citar el polinomio característico $2\times2$, la fórmula cuadrática y los propios de simétricas

**Depende de.** `t.simetrica-propios-ortogonales`, `t.cuadratica-formula`, `t.polinomio-caracteristico-2x2`

**Demostración (grafo de dependencias entre líneas).** Cualquier orden que respete las flechas se acepta.

- **L1** ← ∅ — Por el polinomio característico, los valores propios son las raíces de $μ^2-(p+s)μ+(ps-q^2)$. _[Polinomio característico (2×2)]_
- **L2** ← L1 — Su discriminante es $\Delta=(p+s)^2-4(ps-q^2)=(p-s)^2+4q^2$. _[Discriminante de ax² + bx + c: Δ = b² − 4ac]_
- **L3** ← L2 — Como $q\neq0$, $4q^2>0$ y por tanto $\Delta>0$ (suma de un cuadrado y un número positivo). _[Discriminante de ax² + bx + c: Δ = b² − 4ac]_
- **L4** ← L3 — Por la fórmula cuadrática, con $\Delta>0$ hay dos raíces reales distintas. _[Fórmula cuadrática]_
- **L5** ← L4 — $A$ es simétrica y tiene dos valores propios distintos: por el teorema de propios de simétricas, sus vectores propios son ortogonales. ∎ _[Propios de simétricas]_

**Líneas distractoras (falsas a propósito).**

- Con $\begin{pmatrix}2&1\\1&2\end{pmatrix}$ los valores propios son $1,3$; luego siempre. — _falla:_ un ejemplo no prueba el caso general
- Todas las matrices reales tienen valores propios reales. — _falla:_ falso: un giro de $90^\circ$ no tiene valores propios reales

**Errores para «cazar el error».**

- Sustituye **L2**: Su discriminante es $\Delta=(p+s)^2-4(ps-q^2)=(p-s)^2-4q^2$. — _diagnóstico:_ Error de cálculo: el resultado de la línea no sale de la anterior
- Sustituye **L3**: Como $q\neq0$, $4q^2>0$ y por tanto $\Delta<0$. — _diagnóstico:_ La conclusión no se sigue de lo anterior (falacia)

**Estrategias.**

- ✓ válida: Probar $\Delta=(a-d)^2+4b^2>0$ y aplicar propios de simétricas — Es la prueba estándar.
- ✗ no sirve: Verificar un ejemplo concreto — Un ejemplo ilustra, pero no prueba un enunciado general.
- ✗ no sirve: Suponer lo que se quiere probar — Eso es un argumento circular.
- ✗ no sirve: Apoyarse en un dibujo o en la intuición — Ayuda a entender, pero no es una demostración.

### La estocástica tiene valor propio 1 — `t.markov-estocastica` (nivel 7.4)

**Enunciado.** Si $P$ es estocástica por columnas, $1$ es valor propio de $P$.

**Hipótesis.** las columnas de $P$ suman $1$; Puedes citar el criterio de invertibilidad y las operaciones elementales

**Depende de.** `t.invertible-equivalencias`, `t.ops-elementales`

**Demostración (grafo de dependencias entre líneas).** Cualquier orden que respete las flechas se acepta.

- **L1** ← ∅ — Consideramos $P-I$: cada columna suma $1-1=0$ (la entrada diagonal pierde un $1$). _[Matriz estocástica por columnas: entradas ≥ 0 y cada columna suma 1; vector de probabilidad: entradas ≥ 0 que suman 1]_
- **L2** ← L1 — Sumando todas las filas de $P-I$ se obtiene la fila cero $(0,\dots,0)$. _[Forma escalonada reducida: pivotes 1 con ceros arriba y abajo]_
- **L3** ← L2 — Entonces, con operaciones elementales (sumar todas las filas a la última), la forma escalonada de $P-I$ tiene una fila de ceros: su rango es menor que $m$. _[Operaciones elementales]_
- **L4** ← L3 — Por el criterio de invertibilidad, $P-I$ no es invertible (rango $<m$). _[Criterios de invertibilidad]_
- **L5** ← L4 — Existe entonces $v\neq0$ con $(P-I)v=0$, es decir $Pv=1\cdot v$: $1$ es valor propio. ∎ _[Valor propio λ de A: existe v ≠ 0 con Av = λv; v es un vector propio]_

**Líneas distractoras (falsas a propósito).**

- Con $\begin{pmatrix}0.5&0.2\\0.5&0.8\end{pmatrix}$ el valor propio $1$ aparece; luego siempre. — _falla:_ un ejemplo no prueba el caso general
- Las filas de $P$ suman $1$, así que $1$ es valor propio. — _falla:_ son las **columnas** las que suman $1$

**Errores para «cazar el error».**

- Sustituye **L1**: Consideramos $P-I$: cada columna suma $1+1=2$. — _diagnóstico:_ Error de cálculo: el resultado de la línea no sale de la anterior
- Sustituye **L4**: Por el criterio de invertibilidad, $P-I$ es invertible (rango $<m$). — _diagnóstico:_ La conclusión no se sigue de lo anterior (falacia)

**Estrategias.**

- ✓ válida: Mostrar que las filas de $P-I$ suman cero y deducir que es singular — Es la prueba estándar.
- ✗ no sirve: Verificar un ejemplo concreto — Un ejemplo ilustra, pero no prueba un enunciado general.
- ✗ no sirve: Suponer lo que se quiere probar — Eso es un argumento circular.
- ✗ no sirve: Apoyarse en un dibujo o en la intuición — Ayuda a entender, pero no es una demostración.

### Markov conserva probabilidades — `t.markov-conserva` (nivel 7.4)

**Enunciado.** Si $P$ es estocástica y $x$ un vector de probabilidad, $Px$ también lo es.

**Hipótesis.** $p_{ij}\ge0$, $\sum_ip_{ij}=1$, $x_k\ge0$, $\sum_kx_k=1$; Puedes usar la definición del producto y reordenar sumas finitas

**Depende de.** `t.mat-producto-asoc`

**Demostración (grafo de dependencias entre líneas).** Cualquier orden que respete las flechas se acepta.

- **L1** ← ∅ — Entradas no negativas: $(Px)_i=\sum_kp_{ik}x_k$ es suma de productos de números $\ge0$, luego es $\ge0$. _[Producto de matrices: (AB)ᵢⱼ = Σₖ aᵢₖ bₖⱼ]_
- **L2** ← L1 — Suma de las entradas: $\sum_i(Px)_i=\sum_i\sum_kp_{ik}x_k$. _[Producto de matrices: (AB)ᵢⱼ = Σₖ aᵢₖ bₖⱼ]_
- **L3** ← L2 — Intercambiando el orden de las sumas finitas, $=\sum_kx_k\left(\sum_ip_{ik}\right)$. _[Las sumas finitas se pueden reordenar y distribuir]_
- **L4** ← L3 — Como cada columna suma $1$, el paréntesis vale $1$, y queda $\sum_kx_k=1$. ∎ _[Matriz estocástica por columnas: entradas ≥ 0 y cada columna suma 1; vector de probabilidad: entradas ≥ 0 que suman 1]_

**Líneas distractoras (falsas a propósito).**

- Con $P=I$ se conserva la suma; luego siempre. — _falla:_ un ejemplo no prueba el caso general
- Como $P$ conserva sumas por ser lineal, $Px$ suma $1$. — _falla:_ la linealidad no basta: hace falta que las columnas sumen $1$

**Errores para «cazar el error».**

- Sustituye **L1**: Entradas no negativas: $(Px)_i=\sum_kp_{ik}-x_k$. — _diagnóstico:_ Error de cálculo: el resultado de la línea no sale de la anterior
- Sustituye **L3**: Intercambiando el orden de las sumas, $=\sum_kx_k\left(\sum_jp_{ij}\right)$. — _diagnóstico:_ Error de cálculo: el resultado de la línea no sale de la anterior

**Estrategias.**

- ✓ válida: Reordenar la suma doble y usar que las columnas suman $1$ — Es la prueba estándar.
- ✗ no sirve: Verificar un ejemplo concreto — Un ejemplo ilustra, pero no prueba un enunciado general.
- ✗ no sirve: Suponer lo que se quiere probar — Eso es un argumento circular.
- ✗ no sirve: Apoyarse en un dibujo o en la intuición — Ayuda a entender, pero no es una demostración.

### Neutro e inversos únicos — `t.grupo-unicidad` (nivel 8.1)

**Enunciado.** En un grupo el elemento neutro es único y cada elemento tiene un único inverso.

**Hipótesis.** $(G,\ast)$ es un grupo; Basta usar los axiomas

**Depende de.** nada previo (solo definiciones y propiedades base)

**Demostración (grafo de dependencias entre líneas).** Cualquier orden que respete las flechas se acepta.

- **L1** ← ∅ — (a) Sean $e$ y $e_2$ elementos neutros. Como $e$ es neutro, $e\ast e_2=e_2$. _[Grupo (G,∗): cerrado, asociativo, con elemento neutro e y con inverso a⁻¹ para cada a]_
- **L2** ← L1 — Como $e_2$ es neutro, $e\ast e_2=e$. _[Grupo (G,∗): cerrado, asociativo, con elemento neutro e y con inverso a⁻¹ para cada a]_
- **L3** ← L1, L2 — Luego $e=e\ast e_2=e_2$: el neutro es único. _[Lo probado para un elemento arbitrario vale para todos los elementos]_
- **L4** ← L3 — (b) Sean $b,y$ inversos de $a$: $a\ast b=b\ast a=e$ y $a\ast y=y\ast a=e$. Entonces $b=b\ast e=b\ast(a\ast y)=(b\ast a)\ast y=e\ast y=y$ por la asociatividad. _[Grupo (G,∗): cerrado, asociativo, con elemento neutro e y con inverso a⁻¹ para cada a]_
- **L5** ← L4 — Por tanto el inverso de $a$ es único. ∎ _[Grupo (G,∗): cerrado, asociativo, con elemento neutro e y con inverso a⁻¹ para cada a]_

**Líneas distractoras (falsas a propósito).**

- En $(\mathbb{Z},+)$ el neutro es $0$ y es único; luego siempre. — _falla:_ un ejemplo no prueba el caso general
- Como el neutro actúa sobre todos, no puede haber otro. — _falla:_ hay que probarlo con dos neutros

**Errores para «cazar el error».**

- Sustituye **L2**: Como $e_2$ es neutro, $e\ast e_2=e_2$ también. — _diagnóstico:_ La conclusión no se sigue de lo anterior (falacia)
- Sustituye **L4**: Entonces $b=b\ast e=b\ast(a\ast y)=(b\ast a)\ast y=e\ast y=b$. — _diagnóstico:_ Error de cálculo: el resultado de la línea no sale de la anterior

**Estrategias.**

- ✓ válida: Considerar dos neutros (e inversos) y compararlos con asociatividad — Es la prueba estándar.
- ✗ no sirve: Verificar un ejemplo concreto — Un ejemplo ilustra, pero no prueba un enunciado general.
- ✗ no sirve: Suponer lo que se quiere probar — Eso es un argumento circular.
- ✗ no sirve: Apoyarse en un dibujo o en la intuición — Ayuda a entender, pero no es una demostración.

### Cancelación — `t.grupo-cancelacion` (nivel 8.1)

**Enunciado.** En un grupo, $ab=ac\Rightarrow b=c$, y la ecuación $ax=b$ tiene la única solución $x=a^{-1}b$.

**Hipótesis.** $(G,\ast)$ grupo, $a,x,y\in G$; Puedes citar la unicidad del neutro y del inverso

**Depende de.** `t.grupo-unicidad`

**Demostración (grafo de dependencias entre líneas).** Cualquier orden que respete las flechas se acepta.

- **L1** ← ∅ — Sea $a\ast x=a\ast y$. Operando por la izquierda con $a^{-1}$: $a^{-1}\ast(a\ast x)=a^{-1}\ast(a\ast y)$. _[Grupo (G,∗): cerrado, asociativo, con elemento neutro e y con inverso a⁻¹ para cada a]_
- **L2** ← L1 — Por asociatividad, $(a^{-1}\ast a)\ast x=(a^{-1}\ast a)\ast y$, es decir, $e\ast x=e\ast y$. _[Grupo (G,∗): cerrado, asociativo, con elemento neutro e y con inverso a⁻¹ para cada a]_
- **L3** ← L2 — Como $e$ es neutro, $x=y$. Esto prueba la cancelación. _[Neutro e inversos únicos]_
- **L4** ← L3 — Existencia: $x=a^{-1}\ast x$ cumple $a\ast x=(a\ast a^{-1})\ast x=e\ast x=x$. _[Grupo (G,∗): cerrado, asociativo, con elemento neutro e y con inverso a⁻¹ para cada a]_
- **L5** ← L3, L4 — Unicidad: si $a\ast x=x=a\ast x'$, por cancelación resulta $x=x'$. ∎ _[Para probar P ⟺ Q se prueban P ⇒ Q y Q ⇒ P]_

**Líneas distractoras (falsas a propósito).**

- En $\mathbb{Z}_5^\times$ se cumple; luego siempre. — _falla:_ un ejemplo no prueba el caso general
- Como $a\ast x=a\ast y$, se puede dividir entre $a$ en cualquier estructura. — _falla:_ solo en grupos (existe $a^{-1}$)

**Errores para «cazar el error».**

- Sustituye **L1**: Operando por la derecha con $a^{-1}$: $(a\ast x)\ast a^{-1}=(a\ast y)\ast a^{-1}$. — _diagnóstico:_ La conclusión no se sigue de lo anterior (falacia)
- Sustituye **L4**: Existencia: $x=x\ast a^{-1}$ cumple $a\ast x=x$. — _diagnóstico:_ Error de cálculo: el resultado de la línea no sale de la anterior

**Estrategias.**

- ✓ válida: Operar por la izquierda con $a^{-1}$ — Es la prueba estándar.
- ✗ no sirve: Verificar un ejemplo concreto — Un ejemplo ilustra, pero no prueba un enunciado general.
- ✗ no sirve: Suponer lo que se quiere probar — Eso es un argumento circular.
- ✗ no sirve: Apoyarse en un dibujo o en la intuición — Ayuda a entender, pero no es una demostración.

### Inverso de un producto — `t.grupo-inverso-producto` (nivel 8.1)

**Enunciado.** En un grupo, $(ab)^{-1}=b^{-1}a^{-1}$.

**Hipótesis.** $(G,\ast)$ grupo, $x,b\in G$; Puedes citar la unicidad del inverso

**Depende de.** `t.grupo-unicidad`

**Demostración (grafo de dependencias entre líneas).** Cualquier orden que respete las flechas se acepta.

- **L1** ← ∅ — Calculamos $(x\ast b)\ast(b^{-1}\ast x^{-1})=x\ast(b\ast b^{-1})\ast x^{-1}$ por asociatividad. _[Grupo (G,∗): cerrado, asociativo, con elemento neutro e y con inverso a⁻¹ para cada a]_
- **L2** ← L1 — Como $b\ast b^{-1}=e$, esto es $x\ast e\ast x^{-1}=x\ast x^{-1}=e$. _[Grupo (G,∗): cerrado, asociativo, con elemento neutro e y con inverso a⁻¹ para cada a]_
- **L3** ← L2 — Análogamente $(b^{-1}\ast x^{-1})\ast(x\ast b)=b^{-1}\ast(x^{-1}\ast x)\ast b=b^{-1}\ast b=e$. _[Grupo (G,∗): cerrado, asociativo, con elemento neutro e y con inverso a⁻¹ para cada a]_
- **L4** ← L2, L3 — Luego $b^{-1}\ast x^{-1}$ es un inverso de $x\ast b$ y, por la unicidad del inverso, es **el** inverso. ∎ _[Neutro e inversos únicos]_

**Líneas distractoras (falsas a propósito).**

- En $S_3$ con dos transposiciones se verifica; luego siempre. — _falla:_ un ejemplo no prueba el caso general
- Como los inversos se conservan, $(x\ast b)^{-1}=x^{-1}\ast b^{-1}$. — _falla:_ el orden se invierte (solo coinciden en grupos conmutativos)

**Errores para «cazar el error».**

- Sustituye **L1**: Calculamos $(x\ast b)\ast(x^{-1}\ast b^{-1})=x\ast(b\ast x^{-1})\ast b^{-1}$. — _diagnóstico:_ La conclusión no se sigue de lo anterior (falacia)
- Sustituye **L3**: $(b^{-1}\ast x^{-1})\ast(x\ast b)=b^{-1}\ast b\ast x^{-1}\ast x=x$. — _diagnóstico:_ Error de cálculo: el resultado de la línea no sale de la anterior

**Estrategias.**

- ✓ válida: Multiplicar $ab$ por $b^{-1}a^{-1}$ en ambos órdenes y usar unicidad — Es la prueba estándar.
- ✗ no sirve: Verificar un ejemplo concreto — Un ejemplo ilustra, pero no prueba un enunciado general.
- ✗ no sirve: Suponer lo que se quiere probar — Eso es un argumento circular.
- ✗ no sirve: Apoyarse en un dibujo o en la intuición — Ayuda a entender, pero no es una demostración.

### El grupo de unidades de ℤₙ — `t.unidades-grupo` (nivel 8.1)

**Enunciado.** Las clases de $\mathbb{Z}_n$ coprimas con $n$ forman un grupo con la multiplicación, de orden $\varphi(n)$.

**Hipótesis.** $n\ge2$; Puedes citar la existencia del inverso modular y las operaciones con congruencias

**Depende de.** `t.inverso-modular`, `t.cong-operaciones`

**Demostración (grafo de dependencias entre líneas).** Cualquier orden que respete las flechas se acepta.

- **L1** ← ∅ — Cerradura: si $\gcd(a,n)=\gcd(y,n)=1$, entonces $\gcd(ay,n)=1$ (un primo que divide a $ay$ y a $n$ dividiría a $a$ o a $y$, lema de Euclides), y la multiplicación módulo $n$ está bien definida. _[Congruencias y operaciones]_
- **L2** ← L1 — Asociatividad: viene de la asociatividad de $\mathbb{Z}$ y de que las congruencias respetan el producto. _[Congruencias y operaciones]_
- **L3** ← L1 — Neutro: $1\in U_n$ y $1\cdot a\equiv a$. _[ℤₙ^×: clases de ℤₙ con inverso multiplicativo (coprimas con n)]_
- **L4** ← L1 — Inversos: si $\gcd(a,n)=1$, existe $a^{-1}$ con $a\,a^{-1}\equiv1\pmod{n}$ (teorema del inverso modular), y $a^{-1}$ también es coprimo con $n$. _[Inverso modular]_
- **L5** ← L1, L2, L3, L4 — Se cumplen los cuatro axiomas: $(U_n,\cdot)$ es un grupo, de orden $\varphi(n)$. ∎ _[Grupo (G,∗): cerrado, asociativo, con elemento neutro e y con inverso a⁻¹ para cada a]_

**Líneas distractoras (falsas a propósito).**

- Para $n=7$ se verifica; luego siempre. — _falla:_ un ejemplo no prueba el caso general
- Todo $\mathbb{Z}_n$ es un grupo para la multiplicación. — _falla:_ el $0$ no tiene inverso, y tampoco los no coprimos

**Errores para «cazar el error».**

- Sustituye **L1**: Cerradura: si $\gcd(a,n)=\gcd(y,n)=1$, entonces $\gcd(a+y,n)=1$. — _diagnóstico:_ Error de cálculo: el resultado de la línea no sale de la anterior
- Sustituye **L4**: Inversos: si $\gcd(a,n)=1$, el inverso es $n-a$. — _diagnóstico:_ Error de cálculo: el resultado de la línea no sale de la anterior

**Estrategias.**

- ✓ válida: Comprobar cerradura, asociatividad, neutro e inversos — Es la prueba estándar.
- ✗ no sirve: Verificar un ejemplo concreto — Un ejemplo ilustra, pero no prueba un enunciado general.
- ✗ no sirve: Suponer lo que se quiere probar — Eso es un argumento circular.
- ✗ no sirve: Apoyarse en un dibujo o en la intuición — Ayuda a entender, pero no es una demostración.

### Criterio del subgrupo — `t.subgrupo-criterio` (nivel 8.2)

**Enunciado.** Un $H\subseteq G$ no vacío es subgrupo si y solo si $ab^{-1}\in H$ para todos $a,b\in H$.

**Hipótesis.** $K\neq\emptyset$; Puedes citar la unicidad de inversos y el inverso de un producto

**Depende de.** `t.grupo-unicidad`, `t.grupo-inverso-producto`

**Demostración (grafo de dependencias entre líneas).** Cualquier orden que respete las flechas se acepta.

- **L1** ← ∅ — (⇒) Si $K$ es subgrupo, es cerrado bajo la operación y los inversos: $b^{-1}\in K$ y por tanto $x\ast b^{-1}\in K$. _[Subgrupo: subconjunto no vacío H ⊆ G que es grupo con la misma operación]_
- **L2** ← L1 — (⇐) Supongamos $x\ast b^{-1}\in K$ para todos. Existe $h\in K$; con $x=b=h$, $h\ast h^{-1}=e\in K$. _[Grupo (G,∗): cerrado, asociativo, con elemento neutro e y con inverso a⁻¹ para cada a]_
- **L3** ← L2 — Inversos: con $x=e$ y $b=h\in K$, $e\ast h^{-1}=h^{-1}\in K$. _[Neutro e inversos únicos]_
- **L4** ← L3 — Cerradura: si $x,b\in K$, entonces $b^{-1}\in K$ y $x\ast(b^{-1})^{-1}\in K$; pero $(b^{-1})^{-1}$, que es igual a $b$. _[Inverso de un producto]_
- **L5** ← L2, L3, L4 — Luego $x\ast b\in K$. La asociatividad se hereda de $G$: $K$ es subgrupo. ∎ _[Subgrupo: subconjunto no vacío H ⊆ G que es grupo con la misma operación]_

**Líneas distractoras (falsas a propósito).**

- En $\mathbb{Z}$ el conjunto $2\mathbb{Z}$ cumple el criterio y es subgrupo; luego siempre. — _falla:_ un ejemplo no prueba el caso general
- Basta que $K$ sea cerrado bajo la operación. — _falla:_ en grupos infinitos hacen falta también los inversos (por ejemplo $\mathbb{N}\subseteq\mathbb{Z}$)

**Errores para «cazar el error».**

- Sustituye **L2**: (⇐) Con $x=b=h$, $h\ast h^{-1}=h\in K$. — _diagnóstico:_ Error de cálculo: el resultado de la línea no sale de la anterior
- Sustituye **L4**: Cerradura: $(b^{-1})^{-1}=e$. — _diagnóstico:_ Error de cálculo: el resultado de la línea no sale de la anterior

**Estrategias.**

- ✓ válida: Deducir neutro, inversos y cerradura a partir de $ab^{-1}\in H$ — Es la prueba estándar.
- ✗ no sirve: Verificar un ejemplo concreto — Un ejemplo ilustra, pero no prueba un enunciado general.
- ✗ no sirve: Suponer lo que se quiere probar — Eso es un argumento circular.
- ✗ no sirve: Apoyarse en un dibujo o en la intuición — Ayuda a entender, pero no es una demostración.

### Clases laterales — `t.clases-laterales` (nivel 8.2)

**Enunciado.** Las clases laterales $aH$ forman una partición de $G$ y todas tienen $|H|$ elementos.

**Hipótesis.** $G$ grupo finito y $K$ subgrupo; Puedes citar la cancelación y que las clases de equivalencia particionan

**Depende de.** `t.grupo-cancelacion`, `t.equiv-particion`

**Demostración (grafo de dependencias entre líneas).** Cualquier orden que respete las flechas se acepta.

- **L1** ← ∅ — Definimos $a\sim b$ si $a^{-1}b\in K$. Es relación de equivalencia: reflexiva ($e\in K$), simétrica ($(a^{-1}b)^{-1}=b^{-1}a\in K$) y transitiva (producto en $K$). _[Relación de equivalencia: reflexiva, simétrica y transitiva]_
- **L2** ← L1 — La clase de $a$ es $\{b:a^{-1}b\in K\}=\{ah:h\in K\}=aK$. _[Clase lateral aH = {ah : h ∈ H}; índice [G:H] = número de clases laterales]_
- **L3** ← L2 — Por el teorema de que las clases de equivalencia particionan, las clases $aK$ forman una partición de $G$. _[Una equivalencia define una partición]_
- **L4** ← L2 — Tamaño: la función $f:K\to aK$, $f(h)=ah$ es sobreyectiva por definición e inyectiva por cancelación: $ah=ah'\Rightarrow h=h'$. _[Cancelación]_
- **L5** ← L4 — Luego $|aK|=|K|$ para toda clase. ∎ _[Biyectiva: inyectiva y sobreyectiva]_

**Líneas distractoras (falsas a propósito).**

- En $\mathbb{Z}_6$ con $H=\{0,3\}$ las clases son $\{0,3\},\{1,4\},\{2,5\}$; luego siempre. — _falla:_ un ejemplo no prueba el caso general
- Como $G$ es finito, las clases deben ser del mismo tamaño. — _falla:_ es lo que hay que probar

**Errores para «cazar el error».**

- Sustituye **L1**: Definimos $a\sim b$ si $ab\in K$. — _diagnóstico:_ La conclusión no se sigue de lo anterior (falacia)
- Sustituye **L4**: La función $f(h)=ha$ va de $K$ a $aK$. — _diagnóstico:_ Error de cálculo: el resultado de la línea no sale de la anterior

**Estrategias.**

- ✓ válida: Probar que $a\sim b\iff a^{-1}b\in H$ es de equivalencia y que $h\mapsto ah$ es biyección — Es la prueba estándar.
- ✗ no sirve: Verificar un ejemplo concreto — Un ejemplo ilustra, pero no prueba un enunciado general.
- ✗ no sirve: Suponer lo que se quiere probar — Eso es un argumento circular.
- ✗ no sirve: Apoyarse en un dibujo o en la intuición — Ayuda a entender, pero no es una demostración.

### Teorema de Lagrange — `t.lagrange` (nivel 8.2)

**Enunciado.** Si $G$ es finito y $H\le G$, entonces $|H|$ divide a $|G|$, y $|G|=[G:H]\,|H|$.

**Hipótesis.** $G$ finito y $K$ subgrupo; Puedes citar el teorema de las clases laterales

**Depende de.** `t.clases-laterales`

**Demostración (grafo de dependencias entre líneas).** Cualquier orden que respete las flechas se acepta.

- **L1** ← ∅ — Por el teorema de las clases laterales, $G$ es unión **disjunta** de las clases $g_1K,\dots,g_kK$, donde $k=[G:K]$. _[Clases laterales]_
- **L2** ← L1 — Todas tienen $|K|$ elementos, así que cada clase aporta $|K|$ al total. _[Clases laterales]_
- **L3** ← L2 — Como la unión es disjunta, el número de elementos es la suma: $|G|=|g_1K|+\cdots+|g_kK|$, que es igual a $k\cdot|K|$. _[Las sumas finitas se pueden reordenar y distribuir]_
- **L4** ← L3 — Así $|G|=[G:K]\cdot|K|$, y por tanto $|K|$ divide a $|G|$. ∎ _[Divisibilidad: n | z si existe k entero con z = nk]_

**Líneas distractoras (falsas a propósito).**

- Con $G=\mathbb{Z}_{12}$ y $H=\{0,4,8\}$, $3\mid12$; luego siempre. — _falla:_ un ejemplo no prueba el caso general
- Como $K\subseteq G$, $|K|\le|G|$ y eso basta. — _falla:_ menor o igual no es lo mismo que divisor

**Errores para «cazar el error».**

- Sustituye **L2**: Cada clase aporta $|G|/|K|$ elementos. — _diagnóstico:_ Error de cálculo: el resultado de la línea no sale de la anterior
- Sustituye **L3**: Como la unión es disjunta, $|G|=|g_1K|\cdot\cdots\cdot|g_kK|=|K|^k$. — _diagnóstico:_ Error de cálculo: el resultado de la línea no sale de la anterior

**Estrategias.**

- ✓ válida: Contar los elementos de $G$ por clases laterales — Es la prueba estándar.
- ✗ no sirve: Verificar un ejemplo concreto — Un ejemplo ilustra, pero no prueba un enunciado general.
- ✗ no sirve: Suponer lo que se quiere probar — Eso es un argumento circular.
- ✗ no sirve: Apoyarse en un dibujo o en la intuición — Ayuda a entender, pero no es una demostración.

### El orden de un elemento divide al del grupo — `t.orden-divide` (nivel 8.2)

**Enunciado.** En un grupo finito, $\operatorname{ord}(g)=|\langle g\rangle|$ divide a $|G|$, y $g^{|G|}=e$.

**Hipótesis.** $|G|=N$ y $\operatorname{ord}(a)=k$; Puedes citar el criterio del subgrupo y el teorema de Lagrange

**Depende de.** `t.lagrange`, `t.subgrupo-criterio`

**Demostración (grafo de dependencias entre líneas).** Cualquier orden que respete las flechas se acepta.

- **L1** ← ∅ — $\langle a\rangle=\{e,a,a^2,\dots,a^{k-1}\}$ y estos $k$ elementos son distintos: si $a^i=a^j$ con $0\le i<j<k$, entonces $a^{j-i}=e$ con $j-i<k$, contra la minimalidad del orden. _[Orden de g: el menor m ≥ 1 con gᵐ = e; ⟨g⟩ = {e, g, …, gᵐ⁻¹}]_
- **L2** ← L1 — Es subgrupo por el criterio: $a^i(a^j)^{-1}=a^{i-j}$ vuelve a ser una potencia de $a$. _[Criterio del subgrupo]_
- **L3** ← L2 — Por Lagrange, $|\langle a\rangle|=k$ divide a $|G|=N$: $N=kq$. _[Teorema de Lagrange]_
- **L4** ← L3 — Entonces $a^N=a^{kq}=(a^k)^q$, que es igual a $e^q=e$. _[Orden de g: el menor m ≥ 1 con gᵐ = e; ⟨g⟩ = {e, g, …, gᵐ⁻¹}]_

**Líneas distractoras (falsas a propósito).**

- En $\mathbb{Z}_7^\times$, $3^6=729\equiv1$; luego siempre. — _falla:_ un ejemplo no prueba el caso general
- Como $a\in G$, $a^N=e$ por ser $G$ finito. — _falla:_ es lo que hay que probar (se usa Lagrange)

**Errores para «cazar el error».**

- Sustituye **L1**: $\langle a\rangle=\{a,a^2,\dots,a^k\}$ con $a^k\neq e$. — _diagnóstico:_ Error de cálculo: el resultado de la línea no sale de la anterior
- Sustituye **L4**: Entonces $a^N=a^{k+q}=a^q$. — _diagnóstico:_ Error de cálculo: el resultado de la línea no sale de la anterior

**Estrategias.**

- ✓ válida: Probar $|\langle g\rangle|=\operatorname{ord}(g)$ y aplicar Lagrange — Es la prueba estándar.
- ✗ no sirve: Verificar un ejemplo concreto — Un ejemplo ilustra, pero no prueba un enunciado general.
- ✗ no sirve: Suponer lo que se quiere probar — Eso es un argumento circular.
- ✗ no sirve: Apoyarse en un dibujo o en la intuición — Ayuda a entender, pero no es una demostración.

### Neutro e inversos — `t.hom-identidad-inverso` (nivel 8.3)

**Enunciado.** Si $\varphi$ es homomorfismo, $\varphi(e)=e$ y $\varphi(a^{-1})=\varphi(a)^{-1}$.

**Hipótesis.** $φ(xy)=φ(x)φ(y)$; Puedes citar la cancelación y la unicidad de inversos

**Depende de.** `t.grupo-cancelacion`, `t.grupo-unicidad`

**Demostración (grafo de dependencias entre líneas).** Cualquier orden que respete las flechas se acepta.

- **L1** ← ∅ — $φ(e)=φ(e\ast e)=φ(e)\ast φ(e)$ por ser $φ$ homomorfismo. _[Homomorfismo: φ(a∗b) = φ(a)∘φ(b); núcleo ker φ = {a : φ(a) = e}; imagen im φ = φ(G)]_
- **L2** ← L1 — Escribimos $φ(e)=φ(e)\ast e_K$ y cancelamos $φ(e)$ por la izquierda: $φ(e)=e_K$. _[Cancelación]_
- **L3** ← L2 — Para el inverso: $φ(x)\ast φ(x^{-1})=φ(x\ast x^{-1})=φ(e)=e_K$. _[Homomorfismo: φ(a∗b) = φ(a)∘φ(b); núcleo ker φ = {a : φ(a) = e}; imagen im φ = φ(G)]_
- **L4** ← L3 — Luego $φ(x^{-1})$ es un inverso de $φ(x)$ y, por la unicidad del inverso, $φ(x^{-1})=φ(x)^{-1}$. ∎ _[Neutro e inversos únicos]_

**Líneas distractoras (falsas a propósito).**

- Para $x\mapsto2x$ de $(\mathbb{Z},+)$ en sí mismo se cumple; luego siempre. — _falla:_ un ejemplo no prueba el caso general
- Como $φ$ es una función, lleva neutro en neutro. — _falla:_ para funciones cualesquiera no es cierto: hace falta el homomorfismo

**Errores para «cazar el error».**

- Sustituye **L1**: $φ(e)=φ(e\ast e)=φ(e)+φ(e)$ siempre (suma). — _diagnóstico:_ La conclusión no se sigue de lo anterior (falacia)
- Sustituye **L3**: $φ(x)\ast φ(x^{-1})=φ(x\ast x^{-1})=φ(x)$. — _diagnóstico:_ Error de cálculo: el resultado de la línea no sale de la anterior

**Estrategias.**

- ✓ válida: Usar $e=e\ast e$ y $a\ast a^{-1}=e$ dentro de $\varphi$ — Es la prueba estándar.
- ✗ no sirve: Verificar un ejemplo concreto — Un ejemplo ilustra, pero no prueba un enunciado general.
- ✗ no sirve: Suponer lo que se quiere probar — Eso es un argumento circular.
- ✗ no sirve: Apoyarse en un dibujo o en la intuición — Ayuda a entender, pero no es una demostración.

### Núcleo e imagen son subgrupos — `t.nucleo-subgrupo` (nivel 8.3)

**Enunciado.** $\ker\varphi\le G$ e $\operatorname{im}\varphi\le H$; además $\varphi$ es inyectivo si y solo si $\ker\varphi=\{e\}$.

**Hipótesis.** $f$ homomorfismo; Puedes citar $\varphi(e)=e$, $\varphi(a^{-1})=\varphi(a)^{-1}$ y el criterio del subgrupo

**Depende de.** `t.hom-identidad-inverso`, `t.subgrupo-criterio`

**Demostración (grafo de dependencias entre líneas).** Cualquier orden que respete las flechas se acepta.

- **L1** ← ∅ — $\ker f\neq\emptyset$ porque $f(e)=e_K$, así que $e\in\ker f$. _[Neutro e inversos]_
- **L2** ← L1 — Si $x,b\in\ker f$: $f(x\ast b^{-1})=f(x)\ast f(b)^{-1}=e_K\ast e_K^{-1}=e_K$, luego $x\ast b^{-1}\in\ker f$. _[Neutro e inversos]_
- **L3** ← L2 — Por el criterio del subgrupo, $\ker f\le G$. _[Criterio del subgrupo]_
- **L4** ← L1 — Inyectivo $\Rightarrow\ker=\{e\}$: si $f(x)=e_K=f(e)$, la inyectividad da $x=e$. _[Homomorfismo: φ(a∗b) = φ(a)∘φ(b); núcleo ker φ = {a : φ(a) = e}; imagen im φ = φ(G)]_
- **L5** ← L3, L4 — $\ker=\{e\}\Rightarrow$ inyectivo: si $f(x)=f(b)$, entonces $f(x\ast b^{-1})=e_K$, así que $x\ast b^{-1}\in\ker=\{e\}$ y $x=b$. ∎ _[Para probar P ⟺ Q se prueban P ⇒ Q y Q ⇒ P]_

**Líneas distractoras (falsas a propósito).**

- Con $x\mapsto x\bmod2$ de $\mathbb{Z}$ en $\mathbb{Z}_2$ el núcleo es $2\mathbb{Z}$, un subgrupo; luego siempre. — _falla:_ un ejemplo no prueba el caso general
- Como $\ker f\subseteq G$, hereda ser subgrupo. — _falla:_ un subconjunto no siempre es subgrupo

**Errores para «cazar el error».**

- Sustituye **L2**: $f(x\ast b^{-1})=f(x)\ast f(b)=e_K$. — _diagnóstico:_ Error de cálculo: el resultado de la línea no sale de la anterior
- Sustituye **L5**: ...y $x\ast b^{-1}\in\ker=\{e\}$, así que $x=e$. — _diagnóstico:_ La conclusión no se sigue de lo anterior (falacia)

**Estrategias.**

- ✓ válida: Verificar el criterio del subgrupo y probar las dos implicaciones — Es la prueba estándar.
- ✗ no sirve: Verificar un ejemplo concreto — Un ejemplo ilustra, pero no prueba un enunciado general.
- ✗ no sirve: Suponer lo que se quiere probar — Eso es un argumento circular.
- ✗ no sirve: Apoyarse en un dibujo o en la intuición — Ayuda a entender, pero no es una demostración.

### Orden de G, núcleo e imagen — `t.orden-ker-im` (nivel 8.3)

**Enunciado.** Si $G$ es finito, $|G|=|\ker\varphi|\cdot|\operatorname{im}\varphi|$.

**Hipótesis.** $G$ finito y $φ$ homomorfismo; Puedes citar que el núcleo es subgrupo y el teorema de Lagrange

**Depende de.** `t.lagrange`, `t.nucleo-subgrupo`

**Demostración (grafo de dependencias entre líneas).** Cualquier orden que respete las flechas se acepta.

- **L1** ← ∅ — $N=\ker φ$ es un subgrupo de $G$, así que por Lagrange $|G|=[G:N]\cdot|N|$. _[Teorema de Lagrange]_
- **L2** ← L1 — Basta probar que $[G:N]=|\operatorname{im}φ|$: definimos $\psi:G/N\to\operatorname{im}φ$ por $\psi(aN)=φ(a)$. _[Clase lateral aH = {ah : h ∈ H}; índice [G:H] = número de clases laterales]_
- **L3** ← L2 — Está bien definida e inyectiva: $aN=yN\iff a^{-1}y\in N\iff φ(a^{-1}y)=e\iff φ(a)=φ(y)$. _[Núcleo e imagen son subgrupos]_
- **L4** ← L2 — Es sobreyectiva: todo elemento de $\operatorname{im}φ$ es $φ(a)=\psi(aN)$. _[Homomorfismo: φ(a∗b) = φ(a)∘φ(b); núcleo ker φ = {a : φ(a) = e}; imagen im φ = φ(G)]_
- **L5** ← L3, L4 — Por tanto $\psi$ es una biyección y $[G:N]=|\operatorname{im}φ|$. Así $|G|=|\operatorname{im}φ|\cdot|\ker φ|$. ∎ _[Las clases laterales de ker φ se corresponden uno a uno con los elementos de im φ]_

**Líneas distractoras (falsas a propósito).**

- Con $\mathbb{Z}_{12}\to\mathbb{Z}_4$, $|\ker|=3$ e $|\operatorname{im}|=4$: $3\cdot4=12$; luego siempre. — _falla:_ un ejemplo no prueba el caso general
- Como $|\operatorname{im}φ|\le|H|$, se cumple automáticamente. — _falla:_ la igualdad exige argumento con clases laterales

**Errores para «cazar el error».**

- Sustituye **L1**: Por Lagrange $|G|=[G:N]+|N|$. — _diagnóstico:_ Error de cálculo: el resultado de la línea no sale de la anterior
- Sustituye **L3**: ...$\iff ay^{-1}\in N$... — _diagnóstico:_ Error de cálculo: el resultado de la línea no sale de la anterior

**Estrategias.**

- ✓ válida: Construir la biyección entre las clases laterales de $\ker\varphi$ y $\operatorname{im}\varphi$ — Es la prueba estándar.
- ✗ no sirve: Verificar un ejemplo concreto — Un ejemplo ilustra, pero no prueba un enunciado general.
- ✗ no sirve: Suponer lo que se quiere probar — Eso es un argumento circular.
- ✗ no sirve: Apoyarse en un dibujo o en la intuición — Ayuda a entender, pero no es una demostración.

### Órdenes que respeta un homomorfismo — `t.orden-hom-divide` (nivel 8.3)

**Enunciado.** $|\operatorname{im}\varphi|$ divide a $\gcd(|G|,|H|)$ y $\operatorname{ord}(\varphi(g))$ divide a $\operatorname{ord}(g)$.

**Hipótesis.** $G,H$ finitos; Puedes citar la relación entre $|G|$, $|\ker|$ e $|\operatorname{im}|$ y el teorema de Lagrange

**Depende de.** `t.orden-ker-im`, `t.lagrange`

**Demostración (grafo de dependencias entre líneas).** Cualquier orden que respete las flechas se acepta.

- **L1** ← ∅ — Por $|G|=|\ker f|\cdot|\operatorname{im}f|$, $|\operatorname{im}f|$ divide a $|G|$. _[Orden de G, núcleo e imagen]_
- **L2** ← L1 — $\operatorname{im}f$ es un subgrupo de $H$, así que por Lagrange $|\operatorname{im}f|$ divide a $|H|$. _[Teorema de Lagrange]_
- **L3** ← L1, L2 — Un número que divide a $|G|$ y a $|H|$ divide a su máximo común divisor. _[Divisibilidad: n | z si existe k entero con z = nk]_
- **L4** ← L3 — Por tanto $|\operatorname{im}f|$ divide a $\gcd(|G|,|H|)$. ∎ _[Divisibilidad: n | z si existe k entero con z = nk]_

**Líneas distractoras (falsas a propósito).**

- Para $\mathbb{Z}_6\to\mathbb{Z}_9$ la imagen tiene orden $1$ o $3$, divisores de $3$; luego siempre. — _falla:_ un ejemplo no prueba el caso general
- Como $\operatorname{im}f\subseteq H$, su orden divide a $|G|$. — _falla:_ divide a $|H|$ por Lagrange, pero a $|G|$ hay que probarlo con el núcleo

**Errores para «cazar el error».**

- Sustituye **L1**: Por $|G|=|\ker f|+|\operatorname{im}f|$, ... — _diagnóstico:_ Error de cálculo: el resultado de la línea no sale de la anterior
- Sustituye **L2**: $\operatorname{im}f$ es un subgrupo de $G$, así que por Lagrange divide a $|G|$. — _diagnóstico:_ La conclusión no se sigue de lo anterior (falacia)

**Estrategias.**

- ✓ válida: Probar que divide a $|G|$ (núcleo e imagen) y a $|H|$ (Lagrange) — Es la prueba estándar.
- ✗ no sirve: Verificar un ejemplo concreto — Un ejemplo ilustra, pero no prueba un enunciado general.
- ✗ no sirve: Suponer lo que se quiere probar — Eso es un argumento circular.
- ✗ no sirve: Apoyarse en un dibujo o en la intuición — Ayuda a entender, pero no es una demostración.

### Reglas del anillo — `t.anillo-cero-producto` (nivel 8.4)

**Enunciado.** En un anillo, $0\cdot a=0$, $(-a)b=-(ab)$ y $(-a)(-b)=ab$.

**Hipótesis.** $A$ es un anillo; Puedes usar la distributividad y la cancelación de la suma

**Depende de.** nada previo (solo definiciones y propiedades base)

**Demostración (grafo de dependencias entre líneas).** Cualquier orden que respete las flechas se acepta.

- **L1** ← ∅ — $0\cdot a=(0+0)\cdot a=0\cdot a+0\cdot a$ por la distributividad. _[Anillo: (A,+) grupo abeliano, producto asociativo y distributivo; con unidad 1]_
- **L2** ← L1 — Sumando el opuesto de $0\cdot a$ a ambos lados (cancelación en el grupo aditivo), $0=0\cdot a$. _[Grupo (G,∗): cerrado, asociativo, con elemento neutro e y con inverso a⁻¹ para cada a]_
- **L3** ← L2 — Para el segundo resultado: $ay+(-a)y=(a+(-a))y=0\cdot y=0$. _[Anillo: (A,+) grupo abeliano, producto asociativo y distributivo; con unidad 1]_
- **L4** ← L3 — Luego $(-a)y$ es el opuesto de $ay$ porque sumado con $ab$ da $0$. Por la unicidad del opuesto, $(-a)y=-(ay)$. ∎ _[Grupo (G,∗): cerrado, asociativo, con elemento neutro e y con inverso a⁻¹ para cada a]_

**Líneas distractoras (falsas a propósito).**

- En $\mathbb{Z}$ vale, $0\cdot5=0$; luego en todo anillo. — _falla:_ un ejemplo no prueba el caso general
- Como el cero es el neutro, multiplicar por $0$ da $0$ por definición. — _falla:_ el $0$ es neutro de la suma; que anule al producto hay que probarlo

**Errores para «cazar el error».**

- Sustituye **L1**: $0\cdot a=(0\cdot 0)\cdot a=0\cdot a+0\cdot a$. — _diagnóstico:_ Error de cálculo: el resultado de la línea no sale de la anterior
- Sustituye **L3**: $ay+(-a)y=(a\cdot(-a))y=0$. — _diagnóstico:_ Error de cálculo: el resultado de la línea no sale de la anterior

**Estrategias.**

- ✓ válida: Usar $0=0+0$ y $a+(-a)=0$ con la distributividad — Es la prueba estándar.
- ✗ no sirve: Verificar un ejemplo concreto — Un ejemplo ilustra, pero no prueba un enunciado general.
- ✗ no sirve: Suponer lo que se quiere probar — Eso es un argumento circular.
- ✗ no sirve: Apoyarse en un dibujo o en la intuición — Ayuda a entender, pero no es una demostración.

### Una unidad no es divisor de cero — `t.unidad-no-divisor-cero` (nivel 8.4)

**Enunciado.** Si $a$ es unidad y $ab=0$, entonces $b=0$.

**Hipótesis.** $u$ tiene inverso $u^{-1}$ y $ub=0$; Puedes citar que $0\cdot x=0$ en todo anillo

**Depende de.** `t.anillo-cero-producto`

**Demostración (grafo de dependencias entre líneas).** Cualquier orden que respete las flechas se acepta.

- **L1** ← ∅ — Multiplicamos $ub=0$ por $u^{-1}$: $u^{-1}(ub)=u^{-1}\cdot 0$. _[Anillo: (A,+) grupo abeliano, producto asociativo y distributivo; con unidad 1]_
- **L2** ← L1 — Por asociatividad, el miembro izquierdo es $(u^{-1}u)b=1\cdot b=b$. _[Anillo: (A,+) grupo abeliano, producto asociativo y distributivo; con unidad 1]_
- **L3** ← L1 — El miembro derecho es $u^{-1}\cdot 0$, que es igual a $0$ por las reglas del anillo. _[Reglas del anillo]_
- **L4** ← L2, L3 — Igualando, $b=0$. Luego una unidad no es divisor de cero. ∎ _[Divisor de cero: a ≠ 0 con ab = 0 para algún b ≠ 0]_

**Líneas distractoras (falsas a propósito).**

- En $\mathbb{Z}_7$, $3b=0$ implica $b=0$; luego siempre. — _falla:_ un ejemplo no prueba el caso general
- Como $u\neq0$, de $ub=0$ sale $b=0$. — _falla:_ en un anillo con divisores de cero eso falla (por ejemplo $2\cdot3=0$ en $\mathbb{Z}_6$); aquí se necesita que $a$ sea unidad

**Errores para «cazar el error».**

- Sustituye **L1**: Multiplicamos $ub=0$ por $u$ (sumamos): $u+ub=0$. — _diagnóstico:_ La conclusión no se sigue de lo anterior (falacia)
- Sustituye **L3**: El miembro derecho es $u^{-1}\cdot 0=u^{-1}$. — _diagnóstico:_ Error de cálculo: el resultado de la línea no sale de la anterior

**Estrategias.**

- ✓ válida: Multiplicar por el inverso de $a$ para despejar $b$ — Es la prueba estándar.
- ✗ no sirve: Verificar un ejemplo concreto — Un ejemplo ilustra, pero no prueba un enunciado general.
- ✗ no sirve: Suponer lo que se quiere probar — Eso es un argumento circular.
- ✗ no sirve: Apoyarse en un dibujo o en la intuición — Ayuda a entender, pero no es una demostración.

### ℤₙ es cuerpo si y solo si n es primo — `t.zn-cuerpo` (nivel 8.4)

**Enunciado.** $\mathbb{Z}_n$ es un cuerpo si y solo si $n$ es primo.

**Hipótesis.** $p\ge2$; Puedes citar el lema de Euclides, el grupo de unidades de $\mathbb{Z}_n$ y que una unidad no es divisor de cero

**Depende de.** `t.lema-euclides`, `t.unidades-grupo`, `t.unidad-no-divisor-cero`

**Demostración (grafo de dependencias entre líneas).** Cualquier orden que respete las flechas se acepta.

- **L1** ← ∅ — (⇐) Si $p$ es primo y $1\le a<p$, entonces $\gcd(a,p)=1$ (el único divisor positivo propio de un primo es $1$). _[Primo: entero p > 1 cuyos únicos divisores positivos son 1 y p]_
- **L2** ← L1 — Por el teorema del grupo de unidades, $a$ es una unidad: tiene inverso. Así todo elemento no nulo tiene inverso: $\mathbb{Z}_p$ es un cuerpo. _[El grupo de unidades de ℤₙ]_
- **L3** ← ∅ — (⇒) Supongamos que $p$ no es primo: $p=ab$ con $1<a,b<p$. Entonces $a\cdot b\equiv0$ con $a,b\not\equiv0$. _[Divisor de cero: a ≠ 0 con ab = 0 para algún b ≠ 0]_
- **L4** ← L3 — Si $\mathbb{Z}_p$ fuera un cuerpo, $a$ sería unidad y, por el teorema de que una unidad no es divisor de cero, $b\equiv0$: contradicción. _[Una unidad no es divisor de cero]_
- **L5** ← L2, L4 — Luego si $\mathbb{Z}_p$ es cuerpo, $p$ es primo. ∎ _[Para probar P ⟺ Q se prueban P ⇒ Q y Q ⇒ P]_

**Líneas distractoras (falsas a propósito).**

- $\mathbb{Z}_5$ y $\mathbb{Z}_7$ son cuerpos y $5,7$ son primos; luego siempre. — _falla:_ un ejemplo no prueba el caso general
- Si $p$ es primo, $\mathbb{Z}_p$ es cuerpo; el recíproco es obvio. — _falla:_ el recíproco hay que probarlo con divisores de cero

**Errores para «cazar el error».**

- Sustituye **L1**: Si $p$ es primo y $1\le a<p$, entonces $a$ divide a $p$. — _diagnóstico:_ Error de cálculo: el resultado de la línea no sale de la anterior
- Sustituye **L3**: $p=ab$ con $1<a,b<p$; entonces $a+b\equiv0$. — _diagnóstico:_ Error de cálculo: el resultado de la línea no sale de la anterior

**Estrategias.**

- ✓ válida: Probar (⇐) con coprimalidad y (⇒) con divisores de cero — Es la prueba estándar.
- ✗ no sirve: Verificar un ejemplo concreto — Un ejemplo ilustra, pero no prueba un enunciado general.
- ✗ no sirve: Suponer lo que se quiere probar — Eso es un argumento circular.
- ✗ no sirve: Apoyarse en un dibujo o en la intuición — Ayuda a entender, pero no es una demostración.

### Dominios finitos — `t.dominio-finito-cuerpo` (nivel 8.4)

**Enunciado.** Todo dominio de integridad finito es un cuerpo.

**Hipótesis.** $A$ es finito, conmutativo, con $1\neq0$ y sin divisores de cero; Puedes citar las reglas del anillo

**Depende de.** `t.anillo-cero-producto`

**Demostración (grafo de dependencias entre líneas).** Cualquier orden que respete las flechas se acepta.

- **L1** ← ∅ — Sea $x\in A$, $x\neq0$. Definimos $m:A\to A$ por $m(x)=xx$. _[Dominio de integridad: anillo conmutativo con 1 ≠ 0 y sin divisores de cero]_
- **L2** ← L1 — $m$ es inyectiva: si $xx=xy$, entonces $x(x-y)=0$ y, como $x\neq0$ y no hay divisores de cero, $x-y=0$. _[Reglas del anillo]_
- **L3** ← L2 — Como $A$ es finito y $m$ es inyectiva, $m$ es sobreyectiva (principio del palomar). _[Inyectiva: T(u) = T(v) implica u = v. Sobreyectiva: im T = W]_
- **L4** ← L3 — Luego existe $x$ con $xx=1$: $x$ tiene inverso. Todo elemento no nulo es invertible y $A$ es un cuerpo. ∎ _[Cuerpo: anillo conmutativo con 1 ≠ 0 donde todo elemento no nulo tiene inverso multiplicativo]_

**Líneas distractoras (falsas a propósito).**

- $\mathbb{Z}_7$ es un dominio finito y es cuerpo; luego siempre. — _falla:_ un ejemplo no prueba el caso general
- El resultado falla para $\mathbb{Z}$ y por tanto es falso. — _falla:_ $\mathbb{Z}$ es un dominio **infinito**: no es contraejemplo

**Errores para «cazar el error».**

- Sustituye **L2**: $m$ es inyectiva: si $xx=xy$, entonces $x=y$ porque $x$ es positivo. — _diagnóstico:_ La conclusión no se sigue de lo anterior (falacia)
- Sustituye **L3**: Como $A$ es finito y $m$ es inyectiva, $m$ es constante. — _diagnóstico:_ Error de cálculo: el resultado de la línea no sale de la anterior

**Estrategias.**

- ✓ válida: Mostrar que $x\mapsto ax$ es inyectiva, por tanto sobreyectiva, y alcanzar el $1$ — Es la prueba estándar.
- ✗ no sirve: Verificar un ejemplo concreto — Un ejemplo ilustra, pero no prueba un enunciado general.
- ✗ no sirve: Suponer lo que se quiere probar — Eso es un argumento circular.
- ✗ no sirve: Apoyarse en un dibujo o en la intuición — Ayuda a entender, pero no es una demostración.

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

### Jefe: fermat-general — `jefe.fermat-general` (nivel J2)

**Enunciado.** (enunciado de la prueba del jefe; no entra al Códice)

**Hipótesis.** $p$ es primo y $a\in\mathbb{Z}$ es arbitrario; Puedes citar Fermat y las operaciones con congruencias

**Depende de.** `t.fermat`, `t.cong-operaciones`

**Demostración (grafo de dependencias entre líneas).** Cualquier orden que respete las flechas se acepta.

- **L1** ← ∅ — Distinguimos dos casos exhaustivos: $p\mid a$ o $p\nmid a$. _[División en casos que cubren todas las posibilidades]_
- **L2** ← L1 — Si $p\mid a$: $a\equiv 0$ y también $a^{p}\equiv 0$, luego $a^{p}\equiv a\pmod p$. _[a ≡ b (mod n) significa n | a − b]_
- **L3** ← L1 — Si $p\nmid a$: por el pequeño teorema de Fermat, $a^{p-1}\equiv 1\pmod p$. _[Pequeño teorema de Fermat]_
- **L4** ← L3 — Multiplicando por $a$ (las congruencias se pueden multiplicar), $a^{p}\equiv a\pmod p$. _[Congruencias y operaciones]_
- **L5** ← L2, L4 — En los dos casos se cumple. ∎ _[División en casos que cubren todas las posibilidades]_

**Líneas distractoras (falsas a propósito).**

- Comprobamos con $p=5$ y $a=2$: $32\equiv 2$; luego siempre. — _falla:_ un ejemplo no prueba el caso general
- Como $a^{p-1}\equiv 1$ siempre, se sigue el resultado. — _falla:_ Fermat exige $p\nmid a$: hay que tratar aparte $p\mid a$

**Errores para «cazar el error».**

- Sustituye **L2**: Si $p\mid a$: $a\equiv 1$ y por tanto $a^{p}\equiv 1$. — _diagnóstico:_ Error de cálculo: el resultado de la línea no sale de la anterior
- Sustituye **L4**: Dividiendo por $a$, $a^{p}\equiv a$. — _diagnóstico:_ Error de cálculo: el resultado de la línea no sale de la anterior

**Estrategias.**

- ✓ válida: Separar $p\mid a$ y $p\nmid a$ y usar Fermat en el segundo — Es la prueba estándar.
- ✓ válida: Inducción sobre $a$ con el binomio de Newton — Válida (los coeficientes binomiales son múltiplos de $p$), pero no usa los teoremas de este mundo.
- ✗ no sirve: Verificar un ejemplo concreto — Un ejemplo ilustra, pero no prueba un enunciado general.
- ✗ no sirve: Suponer lo que se quiere probar — Eso es un argumento circular.

### Jefe: n5-menos-n — `jefe.n5-menos-n` (nivel J2)

**Enunciado.** (enunciado de la prueba del jefe; no entra al Códice)

**Hipótesis.** $m\in\mathbb{Z}$; Puedes citar Fermat, las operaciones con congruencias y el lema de Euclides

**Depende de.** `t.fermat`, `t.lema-euclides`, `t.cong-operaciones`

**Demostración (grafo de dependencias entre líneas).** Cualquier orden que respete las flechas se acepta.

- **L1** ← ∅ — Como $30=2\cdot 3\cdot 5$ con primos distintos, basta probar que $2$, $3$ y $5$ dividen a $m^5-m$. _[Primo: entero p > 1 cuyos únicos divisores positivos son 1 y p]_
- **L2** ← L1 — Módulo $5$: si $5\mid m$ ambos términos son $\equiv 0$; si no, por Fermat $m^4\equiv 1$ y, multiplicando por $m$, $m^5\equiv m$. _[Pequeño teorema de Fermat]_
- **L3** ← L1 — Módulo $3$: si $3\nmid m$, por Fermat $m^2\equiv 1$, luego $m^4=(m^2)^2\equiv 1$ y $m^5\equiv m$; si $3\mid m$ es trivial. _[Pequeño teorema de Fermat]_
- **L4** ← L1 — Módulo $2$: si $m$ es impar, $m\equiv 1$ y $m^5\equiv 1\equiv m$; si es par, ambos son $\equiv 0$. _[Congruencias y operaciones]_
- **L5** ← L2, L3, L4 — Sea $M=m^5-m$ con $2,3,5\mid M$. Como $\operatorname{mcd}(3,2)=1$ y $3\mid 2k$ (con $M=2k$), por el lema de Euclides $3\mid k$; igual con $5$. Luego $30\mid M$. ∎ _[Lema de Euclides]_

**Líneas distractoras (falsas a propósito).**

- Comprobamos $m=1,2,3,4,5$: $0,30,240,1020,3120$ son múltiplos de $30$; luego siempre. — _falla:_ comprobar casos no es una demostración
- Como $2,3,5$ dividen a $m^5-m$, también divide su suma $2+3+5=10$. — _falla:_ dividir por cada primo no implica dividir por una suma

**Errores para «cazar el error».**

- Sustituye **L2**: Módulo $5$: por Fermat $m^5\equiv 1$. — _diagnóstico:_ Error de cálculo: el resultado de la línea no sale de la anterior
- Sustituye **L5**: Como $2,3,5\mid M$, entonces $2+3+5=10\mid M$. ∎ — _diagnóstico:_ La conclusión no se sigue de lo anterior (falacia)

**Estrategias.**

- ✓ válida: Probar la divisibilidad por $2$, $3$ y $5$ con Fermat y juntar con el lema de Euclides — Es la prueba estándar.
- ✓ válida: Comprobar los restos módulo $30$ de $n$ (30 casos) — Válida pero larga: 30 casos.
- ✗ no sirve: Verificar un ejemplo concreto — Un ejemplo ilustra, pero no prueba un enunciado general.
- ✗ no sirve: Suponer lo que se quiere probar — Eso es un argumento circular.

### Jefe: z-mas-inverso — `jefe.z-mas-inverso` (nivel J2)

**Enunciado.** (enunciado de la prueba del jefe; no entra al Códice)

**Hipótesis.** $|z|=1$ y $z=\cos\theta+i\sin\theta$; $n\in\mathbb{Z}$

**Depende de.** `t.complejo-inverso`, `t.de-moivre-entero`

**Demostración (grafo de dependencias entre líneas).** Cualquier orden que respete las flechas se acepta.

- **L1** ← ∅ — Como $|z|=1$, $z=\cos\theta+i\sin\theta$ para algún $\theta$ (forma polar con módulo $1$). _[Forma polar: z = r(cos θ + i sen θ) con r = |z|]_
- **L2** ← L1 — Por el teorema del inverso de un complejo, $z^{-1}=\frac{\bar z}{|z|^2}=\cos\theta-i\sin\theta$. _[Inverso de un complejo]_
- **L3** ← L2 — Por De Moivre con exponente entero, $z^{n}=\cos n\theta+i\sin n\theta$ y $z^{-n}=\cos(-n\theta)+i\sin(-n\theta)=\cos n\theta-i\sin n\theta$. _[De Moivre con exponente entero]_
- **L4** ← L3 — Sumando, las partes imaginarias se cancelan: $z^{n}+z^{-n}=$ $2\cos n\theta$. ∎ _[Álgebra de los números: operar, despejar, sustituir]_

**Líneas distractoras (falsas a propósito).**

- Con $\theta=\pi/3$ y $n=2$: $z^2+z^{-2}=2\cos(2\pi/3)=-1$; luego siempre. — _falla:_ un ejemplo no prueba el caso general
- Como $z^{-n}=-z^{n}$, la suma es $0$. — _falla:_ el inverso no es el opuesto

**Errores para «cazar el error».**

- Sustituye **L2**: $z^{-1}=\cos\theta+i\sin\theta$ porque $|z|=1$. — _diagnóstico:_ Error de cálculo: el resultado de la línea no sale de la anterior
- Sustituye **L3**: $z^{-n}=\cos n\theta+i\sin n\theta$. — _diagnóstico:_ Error de cálculo: el resultado de la línea no sale de la anterior

**Estrategias.**

- ✓ válida: Calcular $z^n$ y $z^{-n}$ con De Moivre y sumar — Es la prueba estándar.
- ✓ válida: Notar que $z^{-n}=\overline{z^n}$ y que $w+\bar w=2\operatorname{Re}w$ — Válida y más corta si se admite $\overline{z^n}=\bar z^n$ (conjugado de un producto).
- ✗ no sirve: Verificar un ejemplo concreto — Un ejemplo ilustra, pero no prueba un enunciado general.
- ✗ no sirve: Suponer lo que se quiere probar — Eso es un argumento circular.

### Jefe: cubica-irreducible — `jefe.cubica-irreducible` (nivel J3)

**Enunciado.** (enunciado de la prueba del jefe; no entra al Códice)

**Hipótesis.** $7$ es primo; Puedes citar el teorema de las raíces racionales y el de cúbicas irreducibles

**Depende de.** `t.raices-racionales`, `t.cubica-irreducible`

**Demostración (grafo de dependencias entre líneas).** Cualquier orden que respete las flechas se acepta.

- **L1** ← ∅ — Si $\frac{u}{v}$ (irreducible) es raíz racional de $x^3-7$, por el teorema de las raíces racionales $u\mid 7$ y $v\mid 1$. _[Raíces racionales]_
- **L2** ← L1 — Como $7$ es primo, los candidatos son $\pm1$ y $\pm 7$. _[Primo: entero p > 1 cuyos únicos divisores positivos son 1 y p]_
- **L3** ← L2 — Evaluando: $p(1)=1-7\neq0$, $p(-1)=-1-7\neq0$, $p(7)=7^3-7\neq0$ y $p(-7)=-7^3-7\neq0$ (porque $7>1$). _[Raíz de p: un número a con p(a) = 0]_
- **L4** ← L3 — Luego $x^3-7$ no tiene raíces racionales y, al tener grado $3$, es irreducible por el teorema de las cúbicas irreducibles. ∎ _[Cúbicas irreducibles]_

**Líneas distractoras (falsas a propósito).**

- Como $\sqrt[3]{7}$ es irracional, el polinomio es irreducible. — _falla:_ no basta: hay que descartar factores, y se hace con las raíces racionales
- Probamos $x=1$ y $x=2$ y no son raíces; entonces es irreducible. — _falla:_ faltan candidatos: hay que probarlos todos

**Errores para «cazar el error».**

- Sustituye **L1**: Por el teorema de las raíces racionales $u\mid 1$ y $v\mid 7$. — _diagnóstico:_ La conclusión no se sigue de lo anterior (falacia)
- Sustituye **L4**: Luego no tiene raíces racionales y por tanto es reducible. — _diagnóstico:_ La conclusión no se sigue de lo anterior (falacia)

**Estrategias.**

- ✓ válida: Descartar todos los candidatos racionales y usar que un cúbico sin raíces es irreducible — Es la prueba estándar.
- ✗ no sirve: Verificar un ejemplo concreto — Un ejemplo ilustra, pero no prueba un enunciado general.
- ✗ no sirve: Suponer lo que se quiere probar — Eso es un argumento circular.
- ✗ no sirve: Apoyarse en un dibujo o en la intuición — Ayuda a entender, pero no es una demostración.

### Jefe: conjugada-cuadratico — `jefe.conjugada-cuadratico` (nivel J3)

**Enunciado.** (enunciado de la prueba del jefe; no entra al Códice)

**Hipótesis.** $p\in\mathbb{R}[x]$, $p(w)=0$ y $w=a+bi$ con $b\neq 0$; Puedes citar el teorema de las conjugadas y el del factor

**Depende de.** `t.conjugadas`, `t.teorema-factor`

**Demostración (grafo de dependencias entre líneas).** Cualquier orden que respete las flechas se acepta.

- **L1** ← ∅ — Como los coeficientes son reales y $p(w)=0$, por el teorema de las conjugadas $p(\overline{w})=0$. _[Raíces complejas conjugadas]_
- **L2** ← L1 — Como $b\neq 0$, $w\neq\overline{w}$: son dos raíces distintas. _[Conjugado: conj(a+bi) = a − bi]_
- **L3** ← L2 — Por el teorema del factor, $(x-w)\mid p$; si $p=(x-w)q$, entonces $q(\overline{w})=0$ porque $\overline{w}-w\neq0$. _[Teorema del factor]_
- **L4** ← L3 — Otra vez por el teorema del factor $(x-\overline{w})\mid q$, así que $(x-w)(x-\overline{w})\mid p$. _[Teorema del factor]_
- **L5** ← L4 — Y $(x-w)(x-\overline{w})=x^2-2ax+a^2+b^2$. ∎ _[Conjugado: conj(a+bi) = a − bi]_

**Líneas distractoras (falsas a propósito).**

- Con $p=x^2+1$ y $w=i$ se cumple; luego siempre. — _falla:_ un ejemplo no prueba el caso general
- Como $w$ es raíz, $x-w$ divide a $p$, y eso ya da el cuadrático. — _falla:_ falta la conjugada: $x-z$ no tiene coeficientes reales

**Errores para «cazar el error».**

- Sustituye **L2**: Como $b\neq 0$, $w=\overline{w}$. — _diagnóstico:_ La conclusión no se sigue de lo anterior (falacia)
- Sustituye **L5**: Y $(x-w)(x-\overline{w})=x^2+2ax+a^2+b^2$. — _diagnóstico:_ Error de cálculo: el resultado de la línea no sale de la anterior

**Estrategias.**

- ✓ válida: Usar el teorema del factor con $z$ y con $\bar z$ (distintas) — Es la prueba estándar.
- ✗ no sirve: Verificar un ejemplo concreto — Un ejemplo ilustra, pero no prueba un enunciado general.
- ✗ no sirve: Suponer lo que se quiere probar — Eso es un argumento circular.
- ✗ no sirve: Apoyarse en un dibujo o en la intuición — Ayuda a entender, pero no es una demostración.

### Jefe: tercera-raiz — `jefe.tercera-raiz` (nivel J3)

**Enunciado.** (enunciado de la prueba del jefe; no entra al Códice)

**Hipótesis.** coeficientes reales y una raíz $z\notin\mathbb{R}$; Puedes citar el teorema de las conjugadas y las relaciones de Vieta

**Depende de.** `t.vieta-cubica`, `t.conjugadas`

**Demostración (grafo de dependencias entre líneas).** Cualquier orden que respete las flechas se acepta.

- **L1** ← ∅ — Por el teorema de las conjugadas, $\overline{z}$ también es raíz y $\overline{z}\neq z$ (si $z\notin\mathbb{R}$). _[Raíces complejas conjugadas]_
- **L2** ← L1 — Sean $z$, $\overline{z}$ y $x_3$ las tres raíces. Por Vieta, $z+\overline{z}+x_3=-p$. _[Vieta para cúbicas]_
- **L3** ← L2 — Como $z+\overline{z}=2\operatorname{Re}z$, despejando $x_3=-p-2\operatorname{Re}z$. _[Conjugado: conj(a+bi) = a − bi]_
- **L4** ← L3 — Y $x_3$ es real porque $p$ y $\operatorname{Re}z$ son reales. ∎ _[Álgebra de los números: operar, despejar, sustituir]_

**Líneas distractoras (falsas a propósito).**

- Con $x^3-x^2+x-1$, raíces $1,i,-i$: la tercera es $1$ y se cumple; luego siempre. — _falla:_ un ejemplo no prueba el caso general
- La tercera raíz es $\overline{z}$. — _falla:_ la conjugada ya es la **segunda** raíz

**Errores para «cazar el error».**

- Sustituye **L2**: Por Vieta, $z+\overline{z}+x_3=p$. — _diagnóstico:_ Error de cálculo: el resultado de la línea no sale de la anterior
- Sustituye **L3**: Como $z+\overline{z}=\operatorname{Re}z$, queda $x_3=-p-\operatorname{Re}z$. — _diagnóstico:_ Error de cálculo: el resultado de la línea no sale de la anterior

**Estrategias.**

- ✓ válida: Conjugada como segunda raíz y suma de Vieta — Es la prueba estándar.
- ✗ no sirve: Verificar un ejemplo concreto — Un ejemplo ilustra, pero no prueba un enunciado general.
- ✗ no sirve: Suponer lo que se quiere probar — Eso es un argumento circular.
- ✗ no sirve: Apoyarse en un dibujo o en la intuición — Ayuda a entender, pero no es una demostración.

### Jefe: transpuesta-inversa — `jefe.transpuesta-inversa` (nivel J4)

**Enunciado.** (enunciado de la prueba del jefe; no entra al Códice)

**Hipótesis.** $P$ es invertible; Puedes citar la transpuesta de un producto y la unicidad de la inversa

**Depende de.** `t.mat-transpuesta-producto`, `t.mat-inversa-unica`

**Demostración (grafo de dependencias entre líneas).** Cualquier orden que respete las flechas se acepta.

- **L1** ← ∅ — Sea $B=(P^{-1})^T$. Calculamos $P^TB=P^T(P^{-1})^T$. _[Transpuesta: (Aᵀ)ᵢⱼ = Aⱼᵢ]_
- **L2** ← L1 — Por la transpuesta de un producto, $P^T(P^{-1})^T=(P^{-1}P)^T$. _[Transpuesta de un producto]_
- **L3** ← L2 — Como $P^{-1}P=I$ y $I^T=I$, resulta $P^TB=I$. _[Inversa de A: una matriz B con AB = BA = I]_
- **L4** ← L3 — Análogamente $BP^T=(P^{-1})^TP^T=(PP^{-1})^T=I^T=I$. _[Transpuesta de un producto]_
- **L5** ← L3, L4 — Luego $B$ es una inversa de $P^T$ y, por la unicidad de la inversa, es **la** inversa: $(P^T)^{-1}=(P^{-1})^T$. ∎ _[Unicidad de la inversa]_

**Líneas distractoras (falsas a propósito).**

- Con $P=\begin{pmatrix}1&1\\0&1\end{pmatrix}$ la igualdad se verifica; luego siempre. — _falla:_ un ejemplo no prueba el caso general
- Trasponer e invertir son operaciones distintas, así que no pueden coincidir. — _falla:_ justamente se prueba que conmutan

**Errores para «cazar el error».**

- Sustituye **L2**: Por la transpuesta de un producto, $P^T(P^{-1})^T=(PP^{-1})^T$. — _diagnóstico:_ Error de cálculo: el resultado de la línea no sale de la anterior
- Sustituye **L3**: Como $P^{-1}P=I$ y $I^T=0$, resulta $P^TB=0$. — _diagnóstico:_ Error de cálculo: el resultado de la línea no sale de la anterior

**Estrategias.**

- ✓ válida: Probar que $(A^{-1})^T$ multiplica a $A^T$ dando $I$ por ambos lados y usar unicidad — Es la prueba estándar.
- ✗ no sirve: Verificar un ejemplo concreto — Un ejemplo ilustra, pero no prueba un enunciado general.
- ✗ no sirve: Suponer lo que se quiere probar — Eso es un argumento circular.
- ✗ no sirve: Apoyarse en un dibujo o en la intuición — Ayuda a entender, pero no es una demostración.

### Jefe: nilpotente — `jefe.nilpotente` (nivel J4)

**Enunciado.** (enunciado de la prueba del jefe; no entra al Códice)

**Hipótesis.** $N$ es cuadrada con $N^2=0$; Puedes citar la asociatividad y la unicidad de la inversa

**Depende de.** `t.mat-producto-asoc`, `t.mat-inversa-unica`

**Demostración (grafo de dependencias entre líneas).** Cualquier orden que respete las flechas se acepta.

- **L1** ← ∅ — Calculamos $(I-N)(I+N)=I+N-N-N^2$ (distributividad). _[Álgebra de los números: operar, despejar, sustituir]_
- **L2** ← L1 — Como $N^2=0$, $(I-N)(I+N)=I$. _[Asociatividad del producto]_
- **L3** ← L1 — Análogamente $(I+N)(I-N)=I-N+N-N^2$, que es igual a $I$. _[Álgebra de los números: operar, despejar, sustituir]_
- **L4** ← L2, L3 — Luego $I+N$ es una inversa de $I-N$ por ambos lados y, por la unicidad de la inversa, **la** inversa. ∎ _[Unicidad de la inversa]_

**Líneas distractoras (falsas a propósito).**

- Con $N=\begin{pmatrix}0&1\\0&0\end{pmatrix}$ se cumple; luego siempre. — _falla:_ un ejemplo no prueba el caso general
- Como $N^2=0$, entonces $N=0$. — _falla:_ falso: hay matrices no nulas con cuadrado cero

**Errores para «cazar el error».**

- Sustituye **L1**: Calculamos $(I-N)(I+N)=I+N+N-N^2$. — _diagnóstico:_ Error de cálculo: el resultado de la línea no sale de la anterior
- Sustituye **L3**: Análogamente $(I+N)(I-N)=I-N^2-N^2$. — _diagnóstico:_ Error de cálculo: el resultado de la línea no sale de la anterior

**Estrategias.**

- ✓ válida: Multiplicar $(I-A)$ por $(I+A)$ en ambos órdenes — Es la prueba estándar.
- ✓ válida: Usar la serie geométrica $I+A+A^2+\cdots$ — Válida (la serie se corta), pero necesita justificar la suma.
- ✗ no sirve: Verificar un ejemplo concreto — Un ejemplo ilustra, pero no prueba un enunciado general.
- ✗ no sirve: Suponer lo que se quiere probar — Eso es un argumento circular.

### Jefe: det-inversa — `jefe.det-inversa` (nivel J4)

**Enunciado.** (enunciado de la prueba del jefe; no entra al Códice)

**Hipótesis.** $P$ es $2\times2$ invertible; Puedes citar el determinante de un producto $2\times2$ y el criterio de invertibilidad

**Depende de.** `t.det-producto-2x2`, `t.det-invertible-2x2`

**Demostración (grafo de dependencias entre líneas).** Cualquier orden que respete las flechas se acepta.

- **L1** ← ∅ — Por el criterio de determinante e inversa $2\times2$, $P$ invertible implica $\det P\neq0$. _[Determinante e inversa (2×2)]_
- **L2** ← L1 — Como $PP^{-1}=I$, aplicamos el determinante: $\det(PP^{-1})=\det I=1$. _[Determinante: det A = Σᵢ (−1)^{i+1} aᵢ₁ det(Mᵢ₁), desarrollo por la primera columna]_
- **L3** ← L2 — Por el determinante de un producto, $\det P\cdot\det(P^{-1})=1$. _[Determinante de un producto (2×2)]_
- **L4** ← L1, L3 — Como $\det P\neq0$ se puede dividir entre $\det P$ y queda $\det(P^{-1})=1/\det P$. ∎ _[Álgebra de los números: operar, despejar, sustituir]_

**Líneas distractoras (falsas a propósito).**

- Con $P=2I$, $\det=4$ y $\det(P^{-1})=1/4$; luego siempre. — _falla:_ un ejemplo no prueba el caso general
- Como $\det(P^{-1})=-\det P$, la igualdad es inmediata. — _falla:_ la inversa del determinante es el recíproco, no el opuesto

**Errores para «cazar el error».**

- Sustituye **L2**: Como $PP^{-1}=I$, $\det(PP^{-1})=\det I=0$. — _diagnóstico:_ Error de cálculo: el resultado de la línea no sale de la anterior
- Sustituye **L3**: Por el determinante de un producto, $\det P+\det(P^{-1})=1$. — _diagnóstico:_ Error de cálculo: el resultado de la línea no sale de la anterior

**Estrategias.**

- ✓ válida: Usar $\det(AB)=\det A\det B$ con $B=A^{-1}$ — Es la prueba estándar.
- ✗ no sirve: Verificar un ejemplo concreto — Un ejemplo ilustra, pero no prueba un enunciado general.
- ✗ no sirve: Suponer lo que se quiere probar — Eso es un argumento circular.
- ✗ no sirve: Apoyarse en un dibujo o en la intuición — Ayuda a entender, pero no es una demostración.

### Jefe: interseccion-dim — `jefe.interseccion-dim` (nivel J5)

**Enunciado.** (enunciado de la prueba del jefe; no entra al Códice)

**Hipótesis.** $W_1,U_2$ subespacios de dimensión finita; Puedes citar la intersección de subespacios y la dimensión de un subespacio

**Depende de.** `t.interseccion-subespacios`, `t.dim-subespacio`

**Demostración (grafo de dependencias entre líneas).** Cualquier orden que respete las flechas se acepta.

- **L1** ← ∅ — Por el teorema de la intersección, $W_1\cap U_2$ es un subespacio de $V$. _[Intersección de subespacios]_
- **L2** ← L1 — Además $W_1\cap U_2\subseteq W_1$ y es subespacio; es decir, es un subespacio del espacio vectorial $W_1$. _[Subespacio: subconjunto W de V que es espacio vectorial con las mismas operaciones]_
- **L3** ← L2 — Por el teorema de la dimensión de un subespacio (aplicado a $W_1$), $\dim(W_1\cap U_2)\le\dim W_1$. _[Dimensión de un subespacio]_
- **L4** ← L1 — Intercambiando los papeles, $\dim(W_1\cap U_2)\le\dim U_2$, ya que $W_1\cap U_2\subseteq U_2$ también. _[Dimensión de un subespacio]_
- **L5** ← L3, L4 — Una cantidad menor o igual que dos números es menor o igual que el mínimo. ∎ _[Dimensión: número de vectores de una base]_

**Líneas distractoras (falsas a propósito).**

- Dos rectas distintas por el origen en $\mathbb{R}^2$ se cortan en $\{0\}$ (dimensión $0$); luego siempre. — _falla:_ un ejemplo no prueba el caso general
- Como $W_1\cap U_2$ está en ambos, su dimensión es la mayor de las dos. — _falla:_ es la desigualdad contraria

**Errores para «cazar el error».**

- Sustituye **L3**: Por el teorema anterior, $\dim(W_1\cap U_2)\ge\dim W_1$. — _diagnóstico:_ Error de cálculo: el resultado de la línea no sale de la anterior
- Sustituye **L1**: $W_1\cap U_2$ es subespacio porque $W_1\subseteq U_2$. — _diagnóstico:_ La conclusión no se sigue de lo anterior (falacia)

**Estrategias.**

- ✓ válida: Usar que la intersección es un subespacio contenido en cada uno — Es la prueba estándar.
- ✗ no sirve: Verificar un ejemplo concreto — Un ejemplo ilustra, pero no prueba un enunciado general.
- ✗ no sirve: Suponer lo que se quiere probar — Eso es un argumento circular.
- ✗ no sirve: Apoyarse en un dibujo o en la intuición — Ayuda a entender, pero no es una demostración.

### Jefe: coordenadas-independencia — `jefe.coordenadas-independencia` (nivel J5)

**Enunciado.** (enunciado de la prueba del jefe; no entra al Códice)

**Hipótesis.** $B$ es una base de $V$ y $\dim V=n$; Puedes citar la linealidad y la unicidad de las coordenadas

**Depende de.** `t.coordenadas-lineales`, `t.coordenadas-unicas`

**Demostración (grafo de dependencias entre líneas).** Cualquier orden que respete las flechas se acepta.

- **L1** ← ∅ — Para escalares $c_i$, por la linealidad de las coordenadas, $\left[\sum c_iw_i\right]_B=\sum c_i[w_i]_B$. _[Las coordenadas son lineales]_
- **L2** ← L1 — Por la unicidad de coordenadas, un vector tiene coordenadas $(0,\dots,0)$ si y solo si es el vector cero: $\sum c_iw_i=0\iff\sum c_i[w_i]_B=0$. _[Unicidad de coordenadas]_
- **L3** ← L2 — Así, las combinaciones lineales nulas de los $w_i$ y las de sus coordenadas tienen **los mismos** coeficientes. _[v₁,…,vₖ son independientes si c₁v₁ + ⋯ + cₖvₖ = 0 solo se da con todos los cᵢ = 0]_
- **L4** ← L3 — Luego los $w_i$ solo tienen la combinación nula trivial si y solo si sus coordenadas también. ∎ _[v₁,…,vₖ son independientes si c₁v₁ + ⋯ + cₖvₖ = 0 solo se da con todos los cᵢ = 0]_

**Líneas distractoras (falsas a propósito).**

- En $\mathbb{R}^2$ con $B=\{e_1,e_2\}$ las coordenadas coinciden con el vector; luego siempre. — _falla:_ un ejemplo no prueba el caso general
- Las coordenadas son una función inyectiva, así que preservan todo. — _falla:_ falta probar que preservan combinaciones lineales

**Errores para «cazar el error».**

- Sustituye **L1**: Por la linealidad de las coordenadas, $\left[\sum c_iw_i\right]_B=\prod c_i[w_i]_B$. — _diagnóstico:_ Error de cálculo: el resultado de la línea no sale de la anterior
- Sustituye **L2**: La unicidad dice que $[v]_B=0$ si y solo si $v$ es un vector de la base. — _diagnóstico:_ La conclusión no se sigue de lo anterior (falacia)

**Estrategias.**

- ✓ válida: Transportar toda combinación lineal nula con las coordenadas — Es la prueba estándar.
- ✗ no sirve: Verificar un ejemplo concreto — Un ejemplo ilustra, pero no prueba un enunciado general.
- ✗ no sirve: Suponer lo que se quiere probar — Eso es un argumento circular.
- ✗ no sirve: Apoyarse en un dibujo o en la intuición — Ayuda a entender, pero no es una demostración.

### Jefe: n-generadores — `jefe.n-generadores` (nivel J5)

**Enunciado.** (enunciado de la prueba del jefe; no entra al Códice)

**Hipótesis.** $\dim V=n$ y los $n$ vectores generan $V$; Puedes citar la caracterización de la dependencia y que la dimensión está bien definida

**Depende de.** `t.dependencia-combinacion`, `t.dimension-bien-definida`

**Demostración (grafo de dependencias entre líneas).** Cualquier orden que respete las flechas se acepta.

- **L1** ← ∅ — Como generan, solo falta ver que son independientes. Supongamos por contradicción que son dependientes. _[Reducción al absurdo: si suponer lo contrario lleva a una contradicción, lo supuesto es falso]_
- **L2** ← L1 — Por la caracterización de la dependencia, uno de ellos, digamos $v_j$, es combinación lineal de los otros. _[Dependencia y combinación]_
- **L3** ← L2 — Entonces los otros $n-1$ vectores también generan $V$ (pues $v_j$ ya está en su generado). _[Generado de S: el conjunto de todas las combinaciones lineales de elementos de S]_
- **L4** ← L3 — De una lista generadora se puede extraer una base, que tendría a lo sumo $n-1$ elementos. _[Base: lista de vectores independiente que genera el espacio]_
- **L5** ← L4 — Pero toda base de $V$ tiene $n$ elementos (la dimensión está bien definida): contradicción. Luego son independientes y forman una base. ∎ _[La dimensión está bien definida]_

**Líneas distractoras (falsas a propósito).**

- En $\mathbb{R}^2$, dos vectores que generan son base; luego vale para todo $n$. — _falla:_ un ejemplo no prueba el caso general
- Como son $n$ vectores y la dimensión es $n$, son una base automáticamente. — _falla:_ falta usar que generan (o que son independientes)

**Errores para «cazar el error».**

- Sustituye **L3**: Entonces los otros $n-1$ vectores generan algo más pequeño que $V$. — _diagnóstico:_ La conclusión no se sigue de lo anterior (falacia)
- Sustituye **L5**: Pero toda base de $V$ tiene $n-1$ elementos: contradicción. — _diagnóstico:_ Error de cálculo: el resultado de la línea no sale de la anterior

**Estrategias.**

- ✓ válida: Suponer dependencia, quitar un vector redundante y contradecir la dimensión — Es la prueba estándar.
- ✗ no sirve: Verificar un ejemplo concreto — Un ejemplo ilustra, pero no prueba un enunciado general.
- ✗ no sirve: Suponer lo que se quiere probar — Eso es un argumento circular.
- ✗ no sirve: Apoyarse en un dibujo o en la intuición — Ayuda a entender, pero no es una demostración.

### Jefe: inyectiva-sobre — `jefe.inyectiva-sobre` (nivel J6)

**Enunciado.** (enunciado de la prueba del jefe; no entra al Códice)

**Hipótesis.** $T:V\to V$ lineal, $\dim V=m$; Puedes citar la caracterización de la inyectividad, el teorema de la dimensión y la dimensión de un subespacio

**Depende de.** `t.inyectiva-nucleo`, `t.rango-nulidad`, `t.dim-subespacio`

**Demostración (grafo de dependencias entre líneas).** Cualquier orden que respete las flechas se acepta.

- **L1** ← ∅ — Por la caracterización de la inyectividad, $T$ es inyectiva $\iff\ker T=\{0\}\iff\dim\ker T=0$. _[Inyectividad y núcleo]_
- **L2** ← L1 — Por el teorema de la dimensión, $\dim\operatorname{im}T=m-\dim\ker T$. Luego $\dim\ker T=0\iff\dim\operatorname{im}T=m$. _[Teorema de la dimensión]_
- **L3** ← L2 — Como $\operatorname{im}T\subseteq V$ y $\dim V=m$, por la dimensión de un subespacio, $\dim\operatorname{im}T=m\iff\operatorname{im}T=V$. _[Dimensión de un subespacio]_
- **L4** ← L3 — Y $\operatorname{im}T=V$ significa que $T$ es sobreyectiva. _[Inyectiva: T(u) = T(v) implica u = v. Sobreyectiva: im T = W]_
- **L5** ← L1, L2, L3, L4 — Encadenando las equivalencias, inyectiva $\iff$ sobreyectiva. ∎ _[Para probar P ⟺ Q se prueban P ⇒ Q y Q ⇒ P]_

**Líneas distractoras (falsas a propósito).**

- En $\mathbb{R}^2$ el giro es inyectivo y sobreyectivo; luego siempre. — _falla:_ un ejemplo no prueba el caso general
- En dimensión infinita también ocurre, así que no hace falta la hipótesis. — _falla:_ en dimensión infinita puede fallar (por ejemplo, el desplazamiento)

**Errores para «cazar el error».**

- Sustituye **L2**: Por el teorema de la dimensión, $\dim\operatorname{im}T=m+\dim\ker T$. — _diagnóstico:_ Error de cálculo: el resultado de la línea no sale de la anterior
- Sustituye **L3**: Como $\operatorname{im}T\subseteq V$, $\dim\operatorname{im}T=m$ siempre. — _diagnóstico:_ La conclusión no se sigue de lo anterior (falacia)

**Estrategias.**

- ✓ válida: Convertir inyectiva en núcleo $\{0\}$ y usar rango más nulidad — Es la prueba estándar.
- ✗ no sirve: Verificar un ejemplo concreto — Un ejemplo ilustra, pero no prueba un enunciado general.
- ✗ no sirve: Suponer lo que se quiere probar — Eso es un argumento circular.
- ✗ no sirve: Apoyarse en un dibujo o en la intuición — Ayuda a entender, pero no es una demostración.

### Jefe: proyector — `jefe.proyector` (nivel J6)

**Enunciado.** (enunciado de la prueba del jefe; no entra al Códice)

**Hipótesis.** $E$ lineal y $E\circ E=E$; Puedes citar que núcleo e imagen son subespacios y que $T(0)=0$

**Depende de.** `t.nucleo-imagen-subespacios`, `t.lineal-cero-opuesto`

**Demostración (grafo de dependencias entre líneas).** Cualquier orden que respete las flechas se acepta.

- **L1** ← ∅ — El cero está en ambos (son subespacios), así que $\{0\}\subseteq\ker E\cap\operatorname{im}E$. _[Núcleo e imagen son subespacios]_
- **L2** ← L1 — Recíprocamente, sea $w\in\ker E\cap\operatorname{im}E$ arbitrario. Como $w\in\operatorname{im}E$, existe $u$ con $w=E(u)$. _[Imagen de T: im T = {T(v) : v ∈ V}]_
- **L3** ← L2 — Como $w\in\ker E$, $E(w)=0$. Pero $E(w)=E(E(u))=E^2(u)$, que es igual a $E(u)=w$. _[Núcleo de T: ker T = {v : T(v) = 0}]_
- **L4** ← L3 — Entonces $w=0$ (por L3 igualado con $0$). Luego la intersección es $\{0\}$. ∎ _[T(0) = 0]_

**Líneas distractoras (falsas a propósito).**

- Con el proyector sobre el eje $x$ la intersección es $\{0\}$; luego siempre. — _falla:_ un ejemplo no prueba el caso general
- Como núcleo e imagen son subespacios, su intersección es $\{0\}$ por defecto. — _falla:_ la intersección de dos subespacios no es siempre ${0}$

**Errores para «cazar el error».**

- Sustituye **L3**: Pero $E(w)=E(E(u))=E^2(u)=0$. — _diagnóstico:_ Error de cálculo: el resultado de la línea no sale de la anterior
- Sustituye **L2**: Como $w\in\operatorname{im}E$, $w=E(w)$. — _diagnóstico:_ La conclusión no se sigue de lo anterior (falacia)

**Estrategias.**

- ✓ válida: Tomar $w$ en ambos y usar $P^2=P$ — Es la prueba estándar.
- ✗ no sirve: Verificar un ejemplo concreto — Un ejemplo ilustra, pero no prueba un enunciado general.
- ✗ no sirve: Suponer lo que se quiere probar — Eso es un argumento circular.
- ✗ no sirve: Apoyarse en un dibujo o en la intuición — Ayuda a entender, pero no es una demostración.

### Jefe: traza-cuadrado — `jefe.traza-cuadrado` (nivel J6)

**Enunciado.** (enunciado de la prueba del jefe; no entra al Códice)

**Hipótesis.** $N=S^{-1}AS$; Puedes citar las potencias de matrices semejantes y la invariancia de la traza

**Depende de.** `t.semejante-potencias`, `t.traza-semejantes`

**Demostración (grafo de dependencias entre líneas).** Cualquier orden que respete las flechas se acepta.

- **L1** ← ∅ — De $N=S^{-1}AS$ se despeja $A=SNS^{-1}$ (multiplicando por $S$ y $S^{-1}$). _[A y B son semejantes si B = P⁻¹AP para alguna P invertible]_
- **L2** ← L1 — Por el teorema de las potencias de matrices semejantes, $A^2=SN^2S^{-1}$. _[Potencias de matrices semejantes]_
- **L3** ← L2 — Es decir, $A^2$ y $N^2$ son semejantes: $N^2=S^{-1}A^2S$. _[A y B son semejantes si B = P⁻¹AP para alguna P invertible]_
- **L4** ← L3 — Por la invariancia de la traza por semejanza, $\operatorname{tr}(N^2)=\operatorname{tr}(A^2)$. ∎ _[La traza es invariante]_

**Líneas distractoras (falsas a propósito).**

- Con $A=\mathrm{diag}(1,2)$ y $S=I$ se cumple; luego siempre. — _falla:_ un ejemplo no prueba el caso general
- Como $N$ y $A$ tienen la misma traza, sus cuadrados también. — _falla:_ hay que pasar por la semejanza de los cuadrados

**Errores para «cazar el error».**

- Sustituye **L2**: Por el teorema de las potencias, $A^2=S^2N^2(S^{-1})^2$. — _diagnóstico:_ Error de cálculo: el resultado de la línea no sale de la anterior
- Sustituye **L4**: Por la invariancia del determinante, $\operatorname{tr}(N^2)=\operatorname{tr}(A^2)$. — _diagnóstico:_ La conclusión no se sigue de lo anterior (falacia)

**Estrategias.**

- ✓ válida: Probar que $A^2$ y $B^2$ son semejantes y usar la invariancia de la traza — Es la prueba estándar.
- ✗ no sirve: Verificar un ejemplo concreto — Un ejemplo ilustra, pero no prueba un enunciado general.
- ✗ no sirve: Suponer lo que se quiere probar — Eso es un argumento circular.
- ✗ no sirve: Apoyarse en un dibujo o en la intuición — Ayuda a entender, pero no es una demostración.

### Jefe: nilpotente-propio — `jefe.nilpotente-propio` (nivel J7)

**Enunciado.** (enunciado de la prueba del jefe; no entra al Códice)

**Hipótesis.** $N^2=0$; Puedes citar la fórmula de potencias de vectores propios

**Depende de.** `t.propios-potencias`, `t.propio-nucleo`

**Demostración (grafo de dependencias entre líneas).** Cualquier orden que respete las flechas se acepta.

- **L1** ← ∅ — Sea $λ$ un valor propio de $N$: existe $x\neq0$ con $Nx=λx$. _[Valor propio λ de A: existe v ≠ 0 con Av = λv; v es un vector propio]_
- **L2** ← L1 — Por el teorema de potencias, $N^2x=λ^2x$. _[Potencias y valores propios]_
- **L3** ← L2 — Como $N^2=0$, $N^2x=0$; luego $λ^2x=0$. _[Valor propio y núcleo]_
- **L4** ← L3 — Como $x\neq0$ y el producto de un escalar por un vector no nulo solo es cero si el escalar es $0$, $λ^2=0$. Luego $λ=0$. ∎ _[En ℚ, ℝ y ℂ: si ab = 0 entonces a = 0 o b = 0]_

**Líneas distractoras (falsas a propósito).**

- Con $\begin{pmatrix}0&1\\0&0\end{pmatrix}$ el único valor propio es $0$; luego siempre. — _falla:_ un ejemplo no prueba el caso general
- Como $N^2=0$, entonces $N=0$ y todo vector es propio de $0$. — _falla:_ hay matrices no nulas con cuadrado cero

**Errores para «cazar el error».**

- Sustituye **L2**: Por el teorema de potencias, $N^2x=2λx$. — _diagnóstico:_ Error de cálculo: el resultado de la línea no sale de la anterior
- Sustituye **L4**: Como $x\neq0$, $λ^2=x$ y por tanto $λ=0$. — _diagnóstico:_ Error de cálculo: el resultado de la línea no sale de la anterior

**Estrategias.**

- ✓ válida: Aplicar $A$ dos veces a un vector propio — Es la prueba estándar.
- ✗ no sirve: Verificar un ejemplo concreto — Un ejemplo ilustra, pero no prueba un enunciado general.
- ✗ no sirve: Suponer lo que se quiere probar — Eso es un argumento circular.
- ✗ no sirve: Apoyarse en un dibujo o en la intuición — Ayuda a entender, pero no es una demostración.

### Jefe: transpuesta-propios — `jefe.transpuesta-propios` (nivel J7)

**Enunciado.** (enunciado de la prueba del jefe; no entra al Códice)

**Hipótesis.** $A$ es una matriz $2\times2$; Puedes citar el polinomio característico $2\times2$

**Depende de.** `t.polinomio-caracteristico-2x2`, `t.propio-nucleo`

**Demostración (grafo de dependencias entre líneas).** Cualquier orden que respete las flechas se acepta.

- **L1** ← ∅ — Por el polinomio característico, los valores propios de $A$ son las raíces de $\lambda^2-(a+d)\lambda+(ad-bc)$. _[Polinomio característico (2×2)]_
- **L2** ← L1 — Por el teorema del valor propio y el núcleo, $\lambda$ es valor propio de $A^T$ si y solo si $A^T-\lambda I$ no es invertible; para $2\times2$ esto se expresa con el polinomio característico de $A^T$. _[Valor propio y núcleo]_
- **L3** ← L2 — $A^T=\begin{pmatrix}a&c\\b&d\end{pmatrix}$, cuya traza es $a+d$ (igual que la de $A$). _[Traza: tr A = Σ aᵢᵢ (suma de la diagonal)]_
- **L4** ← L3 — Su determinante es $ad-cb=ad-bc$ (el producto de números es conmutativo). _[Polinomio característico (2×2)]_
- **L5** ← L1, L4 — Por el polinomio característico aplicado a $A^T$, sus valores propios son las raíces de $\lambda^2-(a+d)\lambda+(ad-bc)$: el **mismo** polinomio que para $A$. ∎ _[Polinomio característico (2×2)]_

**Líneas distractoras (falsas a propósito).**

- Con $A=\begin{pmatrix}1&2\\0&3\end{pmatrix}$ ambas tienen $\{1,3\}$; luego siempre. — _falla:_ un ejemplo no prueba el caso general
- Como $A^T$ tiene las mismas entradas, los vectores propios también coinciden. — _falla:_ los valores propios coinciden, los vectores propios no necesariamente

**Errores para «cazar el error».**

- Sustituye **L3**: $A^T=\begin{pmatrix}a&c\\b&d\end{pmatrix}$, cuya traza es $b+c$. — _diagnóstico:_ Error de cálculo: el resultado de la línea no sale de la anterior
- Sustituye **L4**: Su determinante es $ad+cb$. — _diagnóstico:_ Error de cálculo: el resultado de la línea no sale de la anterior

**Estrategias.**

- ✓ válida: Comparar los polinomios característicos de $A$ y de $A^T$ — Es la prueba estándar.
- ✗ no sirve: Verificar un ejemplo concreto — Un ejemplo ilustra, pero no prueba un enunciado general.
- ✗ no sirve: Suponer lo que se quiere probar — Eso es un argumento circular.
- ✗ no sirve: Apoyarse en un dibujo o en la intuición — Ayuda a entender, pero no es una demostración.

### Jefe: simetrica-diagonal — `jefe.simetrica-diagonal` (nivel J7)

**Enunciado.** (enunciado de la prueba del jefe; no entra al Códice)

**Hipótesis.** $S$ simétrica con $\lambda_1\neq\lambda_2$, $Sv=\lambda_1v$, $Sw=\lambda_2w$; Puedes citar la ortogonalidad de los propios de simétricas

**Depende de.** `t.simetrica-propios-ortogonales`, `t.diagonalizable-base`

**Demostración (grafo de dependencias entre líneas).** Cualquier orden que respete las flechas se acepta.

- **L1** ← ∅ — Por el teorema de propios de simétricas, $v\cdot w=0$ (valores propios distintos). _[Propios de simétricas]_
- **L2** ← L1 — Como $SP=(Sv\ Sw)=(\lambda_1v\ \lambda_2w)$, calculamos $P^TSP$ con entradas $v\cdot(\lambda_1v)$, $v\cdot(\lambda_2w)$, etc. _[Valor propio λ de A: existe v ≠ 0 con Av = λv; v es un vector propio]_
- **L3** ← L2 — Las entradas fuera de la diagonal son $\lambda_2(v\cdot w)$ y $\lambda_1(w\cdot v)$, que valen $0$ por L1. _[Producto punto: u·v = Σ uᵢvᵢ; norma |u|² = u·u; u ⟂ v si u·v = 0]_
- **L4** ← L3 — Luego $P^TSP=\begin{pmatrix}\lambda_1|v|^2&0\\0&\lambda_2|w|^2\end{pmatrix}$ es diagonal. (Además $v,w$ forman una base de propios, así que $S$ es diagonalizable.) ∎ _[Diagonalizable y base de propios]_

**Líneas distractoras (falsas a propósito).**

- Con $\begin{pmatrix}2&1\\1&2\end{pmatrix}$ y $v=(1,1)$, $w=(1,-1)$ se verifica; luego siempre. — _falla:_ un ejemplo no prueba el caso general
- Como $S$ es simétrica, $P^TSP$ es simétrica y por tanto diagonal. — _falla:_ simétrica no implica diagonal

**Errores para «cazar el error».**

- Sustituye **L1**: Por el teorema de propios de simétricas, $v\cdot w=1$. — _diagnóstico:_ Error de cálculo: el resultado de la línea no sale de la anterior
- Sustituye **L3**: Las entradas fuera de la diagonal son $\lambda_2(v\cdot w)$ y $\lambda_1(w\cdot v)$, que valen $\lambda_1\lambda_2$. — _diagnóstico:_ Error de cálculo: el resultado de la línea no sale de la anterior

**Estrategias.**

- ✓ válida: Calcular las entradas de $P^TAP$ con productos punto — Es la prueba estándar.
- ✗ no sirve: Verificar un ejemplo concreto — Un ejemplo ilustra, pero no prueba un enunciado general.
- ✗ no sirve: Suponer lo que se quiere probar — Eso es un argumento circular.
- ✗ no sirve: Apoyarse en un dibujo o en la intuición — Ayuda a entender, pero no es una demostración.

### Jefe: orden-primo-ciclico — `jefe.orden-primo-ciclico` (nivel J8)

**Enunciado.** (enunciado de la prueba del jefe; no entra al Códice)

**Hipótesis.** $|G|=p$ primo y $a\in G$, $a\neq e$; Puedes citar que el orden de un elemento divide al del grupo y el teorema de Lagrange

**Depende de.** `t.orden-divide`, `t.lagrange`

**Demostración (grafo de dependencias entre líneas).** Cualquier orden que respete las flechas se acepta.

- **L1** ← ∅ — Por el teorema del orden de un elemento, $\operatorname{ord}(a)$ divide a $|G|=p$. _[El orden de un elemento divide al del grupo]_
- **L2** ← L1 — Como $p$ es primo, sus únicos divisores positivos son $1$ y $p$. _[Primo: entero p > 1 cuyos únicos divisores positivos son 1 y p]_
- **L3** ← L2 — Como $a\neq e$, $\operatorname{ord}(a)\neq1$; luego $\operatorname{ord}(a)=p$. _[Orden de g: el menor m ≥ 1 con gᵐ = e; ⟨g⟩ = {e, g, …, gᵐ⁻¹}]_
- **L4** ← L3 — Entonces $\langle a\rangle$ tiene $p$ elementos, y es un subgrupo de $G$ con $|G|=p$ elementos: por tener el mismo número de elementos (finitos), $\langle a\rangle=G$. ∎ _[Teorema de Lagrange]_

**Líneas distractoras (falsas a propósito).**

- $\mathbb{Z}_5$ es cíclico y $5$ es primo; luego siempre. — _falla:_ un ejemplo no prueba el caso general
- Como $|G|$ es primo, $G$ no tiene subgrupos, y por eso es cíclico. — _falla:_ tiene los subgrupos triviales; el argumento es sobre el orden de un elemento

**Errores para «cazar el error».**

- Sustituye **L2**: Como $p$ es primo, sus únicos divisores positivos son $p$ y $p^2$. — _diagnóstico:_ Error de cálculo: el resultado de la línea no sale de la anterior
- Sustituye **L3**: Como $a\neq e$, $\operatorname{ord}(a)\neq p$; luego $\operatorname{ord}(a)=1$. — _diagnóstico:_ Error de cálculo: el resultado de la línea no sale de la anterior

**Estrategias.**

- ✓ válida: Usar que $\operatorname{ord}(g)\mid p$ y $\operatorname{ord}(g)\neq1$ — Es la prueba estándar.
- ✗ no sirve: Verificar un ejemplo concreto — Un ejemplo ilustra, pero no prueba un enunciado general.
- ✗ no sirve: Suponer lo que se quiere probar — Eso es un argumento circular.
- ✗ no sirve: Apoyarse en un dibujo o en la intuición — Ayuda a entender, pero no es una demostración.

### Jefe: fermat-lagrange — `jefe.fermat-lagrange` (nivel J8)

**Enunciado.** (enunciado de la prueba del jefe; no entra al Códice)

**Hipótesis.** $p$ primo y $p\nmid x$; Puedes citar el grupo de unidades de $\mathbb{Z}_n$, que $\mathbb{Z}_p$ es cuerpo y que $g^{|G|}=e$

**Depende de.** `t.unidades-grupo`, `t.orden-divide`, `t.zn-cuerpo`

**Demostración (grafo de dependencias entre líneas).** Cualquier orden que respete las flechas se acepta.

- **L1** ← ∅ — Como $p$ es primo, $\mathbb{Z}_p$ es un cuerpo: toda clase no nula es una unidad. _[ℤₙ es cuerpo si y solo si n es primo]_
- **L2** ← L1 — El grupo de unidades $\mathbb{Z}_p^\times$ tiene $\varphi(p)=p-1$ elementos (todas las clases no nulas). _[El grupo de unidades de ℤₙ]_
- **L3** ← L1 — La clase $[x]$ es no nula (pues $p\nmid x$), así que está en $\mathbb{Z}_p^\times$. _[ℤₙ^×: clases de ℤₙ con inverso multiplicativo (coprimas con n)]_
- **L4** ← L2, L3 — Por el teorema del orden de un elemento, $[x]^{|G|}=e$ con $|G|=p-1$ y $e=[1]$: $[x]^{p-1}=[1]$. _[El orden de un elemento divide al del grupo]_
- **L5** ← L4 — Es decir, $x^{p-1}\equiv1\pmod p$, que es el pequeño teorema de Fermat. ∎ _[a ≡ b (mod n) significa n | a − b]_

**Líneas distractoras (falsas a propósito).**

- Con $p=7$ y $a=3$: $3^6=729\equiv1$; luego siempre. — _falla:_ un ejemplo no prueba el caso general
- Como $x^{p}\equiv x$ siempre, se sigue el resultado. — _falla:_ es otra forma del teorema, no una demostración con grupos

**Errores para «cazar el error».**

- Sustituye **L2**: El grupo de unidades $\mathbb{Z}_p^\times$ tiene $p$ elementos. — _diagnóstico:_ Error de cálculo: el resultado de la línea no sale de la anterior
- Sustituye **L4**: Por el teorema del orden, $[x]^{|G|}=e$ con $|G|=p$. — _diagnóstico:_ Error de cálculo: el resultado de la línea no sale de la anterior

**Estrategias.**

- ✓ válida: Aplicar $g^{|G|}=e$ al grupo de unidades de $\mathbb{Z}_p$ — Es la prueba estándar.
- ✓ válida: Inducción sobre $a$ con el binomio de Newton — Válida, pero no usa teoría de grupos.
- ✗ no sirve: Verificar un ejemplo concreto — Un ejemplo ilustra, pero no prueba un enunciado general.
- ✗ no sirve: Suponer lo que se quiere probar — Eso es un argumento circular.

### Jefe: hom-coprimos — `jefe.hom-coprimos` (nivel J8)

**Enunciado.** (enunciado de la prueba del jefe; no entra al Códice)

**Hipótesis.** $\gcd(|G|,|K|)=1$ y $f:G\to K$ homomorfismo; Puedes citar que $|\operatorname{im}\varphi|$ divide a $\gcd(|G|,|K|)$ y que la imagen es subgrupo

**Depende de.** `t.orden-hom-divide`, `t.nucleo-subgrupo`

**Demostración (grafo de dependencias entre líneas).** Cualquier orden que respete las flechas se acepta.

- **L1** ← ∅ — Por el teorema de órdenes de homomorfismos, $|\operatorname{im}f|$ divide a $\gcd(|G|,|K|)=1$. _[Órdenes que respeta un homomorfismo]_
- **L2** ← L1 — Entonces $|\operatorname{im}f|=1$: la imagen es un subgrupo con un solo elemento, y todo subgrupo contiene al neutro. _[Núcleo e imagen son subgrupos]_
- **L3** ← L2 — Luego $\operatorname{im}f=\{e\}$: para todo $x\in G$, $f(x)\in\operatorname{im}f$ y por tanto $f(x)=e$. _[Homomorfismo: φ(a∗b) = φ(a)∘φ(b); núcleo ker φ = {a : φ(a) = e}; imagen im φ = φ(G)]_
- **L4** ← L3 — Es decir, $f$ es el homomorfismo trivial. ∎ _[Homomorfismo: φ(a∗b) = φ(a)∘φ(b); núcleo ker φ = {a : φ(a) = e}; imagen im φ = φ(G)]_

**Líneas distractoras (falsas a propósito).**

- De $\mathbb{Z}_3$ a $\mathbb{Z}_4$ el único homomorfismo es el trivial; luego siempre. — _falla:_ un ejemplo no prueba el caso general
- Como los órdenes son coprimos, no existen homomorfismos. — _falla:_ siempre existe el trivial

**Errores para «cazar el error».**

- Sustituye **L1**: Por el teorema, $|\operatorname{im}f|$ es múltiplo de $\gcd(|G|,|K|)=1$. — _diagnóstico:_ Error de cálculo: el resultado de la línea no sale de la anterior
- Sustituye **L2**: Entonces $|\operatorname{im}f|=1$ y por tanto $\ker f=\{e\}$. — _diagnóstico:_ La conclusión no se sigue de lo anterior (falacia)

**Estrategias.**

- ✓ válida: Probar que la imagen tiene un solo elemento — Es la prueba estándar.
- ✗ no sirve: Verificar un ejemplo concreto — Un ejemplo ilustra, pero no prueba un enunciado general.
- ✗ no sirve: Suponer lo que se quiere probar — Eso es un argumento circular.
- ✗ no sirve: Apoyarse en un dibujo o en la intuición — Ayuda a entender, pero no es una demostración.

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

### `w2.n1.divisores-de-n`

- Familia: aplicacion; habilidades: 2.1.divisores; requiere: nada.
- Ejemplo de enunciado: Escribe el conjunto de todos los divisores positivos de $63$.
- Verificador: `igual-conjunto`. Firmas de error de este ejemplo: `sin-extremos`, `sin-el-propio`, `solo-primos`.
- Explicación: Divisores de $63$: $\{1,3,7,9,21,63\}$.

### `w2.n1.division-entera`

- Familia: aplicacion; habilidades: 2.1.division-entera; requiere: nada.
- Ejemplo de enunciado: Divide $-61$ entre $5$ con resto no negativo: halla $q$ y $r$ con $-61=5q+r$ y $0\le r<5$.
- Verificador: `tupla-racional`. Firmas de error de este ejemplo: `resto-negativo`, `intercambia`.
- Explicación: $-61=5\cdot(-13)+4$.

### `w2.n1.combinacion-divisible`

- Familia: aplicacion; habilidades: 2.1.combinaciones; requiere: nada.
- Ejemplo de enunciado: Sabes que $5$ divide a $b=30$ y a $c=20$. Calcula $\dfrac{bx+cy}{5}$ para $x=-4$, $y=3$ (el resultado es entero).
- Verificador: `entero`. Firmas de error de este ejemplo: `signo`, `sin-factorizar`, `suma-simple`.
- Explicación: $(bx+cy)/5=6\cdot(-4)+4\cdot(3)=-12$.

### `w2.n1.numero-de-divisores`

- Familia: aplicacion; habilidades: 2.1.contar-divisores; requiere: nada.
- Ejemplo de enunciado: ¿Cuántos divisores positivos tiene $441$?
- Verificador: `entero`. Firmas de error de este ejemplo: `suma-exponentes`, `sin-uno`.
- Explicación: Resultado: $(2+1)\cdot (2+1)=9$.

### `w2.n1.multiplos-en-rango`

- Familia: aplicacion; habilidades: 2.1.contar-divisores; requiere: nada.
- Ejemplo de enunciado: ¿Cuántos múltiplos de $6$ hay entre $16$ y $195$, ambos incluidos?
- Verificador: `entero`. Firmas de error de este ejemplo: `diferencia`, `mas-uno`.
- Explicación: $32-2=30$.

### `w2.n2.mcd-mcm`

- Familia: aplicacion; habilidades: 2.2.mcd-mcm; requiere: nada.
- Ejemplo de enunciado: Calcula $\operatorname{mcm}(72,99)$.
- Verificador: `entero`. Firmas de error de este ejemplo: `confunde-mcd-mcm`, `producto`, `menor`.
- Explicación: $\operatorname{mcd}=9$ y $\operatorname{mcm}=792$.

### `w2.n2.pasos-euclides`

- Familia: aplicacion; habilidades: 2.2.euclides; requiere: nada.
- Ejemplo de enunciado: Al aplicar el algoritmo de Euclides a $(281,277)$, ¿cuántas divisiones se hacen hasta llegar a resto $0$?
- Verificador: `entero`. Firmas de error de este ejemplo: `sin-la-ultima`, `una-mas`.
- Explicación: $281=277\cdot 1+4$; $277=4\cdot 69+1$; $4=1\cdot 4+0$.

### `w2.n2.bezout-coef`

- Familia: aplicacion; habilidades: 2.2.bezout; requiere: nada.
- Ejemplo de enunciado: Halla enteros $x,y$ tales que $76x+87y=\operatorname{mcd}(76,87)$. Vale cualquier solución (el juego la comprueba).
- Verificador: `combinacion-lineal`. Firmas de error de este ejemplo: `signo`, `intercambiados`, `solo-un-resto`.
- Explicación: Por ejemplo $x=-8$, $y=7$ (hay infinitas).

### `w2.n2.diofantica-particular`

- Familia: aplicacion; habilidades: 2.2.diofantica; requiere: nada.
- Ejemplo de enunciado: Halla una solución entera $(x,y)$ de $35x+45y=40$.
- Verificador: `combinacion-lineal`. Firmas de error de este ejemplo: `sin-escalar`, `signo`.
- Explicación: Una solución es $(32,-24)$.

### `w2.n2.contexto-mcd-mcm`

- Familia: aplicacion; habilidades: 2.2.contexto, 2.2.mcd-mcm; requiere: nada.
- Ejemplo de enunciado: Una luz parpadea cada $18$ segundos y otra cada $63$ segundos; ahora coinciden. ¿Dentro de cuántos segundos volverán a coincidir por primera vez?
- Verificador: `entero`. Firmas de error de este ejemplo: `mcd`, `producto`.
- Explicación: La respuesta es 126.

### `w2.n3.reducir-modulo`

- Familia: aplicacion; habilidades: 2.3.reducir; requiere: nada.
- Ejemplo de enunciado: Halla el resto de $2955$ módulo $12$ (el representante $r$ con $0\le r<12$).
- Verificador: `entero`. Firmas de error de este ejemplo: `cociente`, `complemento`.
- Explicación: $2955\equiv3\pmod{12}$.

### `w2.n3.potencia-modular`

- Familia: aplicacion; habilidades: 2.3.potencia-modular; requiere: nada.
- Ejemplo de enunciado: Calcula $4^{17}\bmod 7$.
- Verificador: `entero`. Firmas de error de este ejemplo: `multiplica`, `reduce-exponente`.
- Explicación: $4^{17}\equiv2\pmod{7}$.

### `w2.n3.cong-lineal-resolver`

- Familia: aplicacion; habilidades: 2.3.cong-lineal; requiere: nada.
- Ejemplo de enunciado: Resuelve $2x\equiv 8\pmod{12}$: escribe el conjunto de todas las soluciones $x$ con $0\le x<12$ (si no hay ninguna, escribe la palabra vacío).
- Verificador: `igual-conjunto`. Firmas de error de este ejemplo: `solo-una`.
- Explicación: Soluciones: $\{4,10\}$.

### `w2.n3.congruencias-verdaderas`

- Familia: aplicacion; habilidades: 2.3.reducir, 2.3.potencia-modular; requiere: nada.
- Ejemplo de enunciado: Marca todas las congruencias que son verdaderas.
- Verificador: `conjunto-indices`. Firmas de error de este ejemplo: `omite-0`, `marca-de-mas`, `marca-de-mas`, `marca-de-mas`, `marca-de-mas`.
- Explicación: Son verdaderas: $-55\equiv -7\pmod{6}$.

### `w2.n3.criterios-divisibilidad`

- Familia: aplicacion; habilidades: 2.3.criterios, 2.3.reducir; requiere: nada.
- Ejemplo de enunciado: Halla el dígito $\square$ (de $0$ a $9$) para que $71\square54$ sea divisible por $11$.
- Verificador: `entero`. Firmas de error de este ejemplo: `suma-simple`.
- Explicación: El dígito es $6$.

### `w2.n4.inverso-modular`

- Familia: aplicacion; habilidades: 2.4.inverso; requiere: nada.
- Ejemplo de enunciado: Halla el inverso de $45$ módulo $49$: el $x$ con $0<x<49$ tal que $45x\equiv 1\pmod{49}$.
- Verificador: `entero`. Firmas de error de este ejemplo: `opuesto`, `opuesto-del-inverso`, `recíproco`.
- Explicación: $45\cdot 12=540\equiv 1\pmod{49}$.

### `w2.n4.tcr`

- Familia: aplicacion; habilidades: 2.4.tcr; requiere: nada.
- Ejemplo de enunciado: Halla el menor $x\ge 0$ con $x\equiv 0\pmod{5}$ y $x\equiv 1\pmod{3}$.
- Verificador: `entero`. Firmas de error de este ejemplo: `restos-cruzados`, `solo-un-modulo`.
- Explicación: $x=10$.

### `w2.n4.cifrado-afin`

- Familia: aplicacion; habilidades: 2.4.cifrado-afin, 2.4.inverso; requiere: nada.
- Ejemplo de enunciado: Se cifró con $E(x)=7x+2\pmod{26}$ (letras $A=0,\dots,Z=25$). Los números cifrados son $19,\ 20,\ 13$. Recupera los números originales (15 es el inverso de 7 módulo 26).
- Verificador: `tupla-racional`. Firmas de error de este ejemplo: `aplica-cifrado`, `sin-inverso`.
- Explicación: Resultado: $21,\ 10,\ 9$.

### `w2.n4.rsa-juguete`

- Familia: aplicacion; habilidades: 2.4.rsa, 2.4.inverso; requiere: nada.
- Ejemplo de enunciado: Con primos $p=5$, $q=11$ y exponente público $e=7$, ¿cuál es el exponente privado $d$ (con $0<d<(p-1)(q-1)$ y $ed\equiv 1\pmod{(p-1)(q-1)}$)?
- Verificador: `entero`. Firmas de error de este ejemplo: `usa-n`, `usa-e`, `phi-menos-e`.
- Explicación: $d=23$.

### `w2.n4.rotaciones-ciclos`

- Familia: aplicacion; habilidades: 2.4.rotaciones; requiere: nada.
- Ejemplo de enunciado: Un dial tiene $12$ marcas. Se gira siempre $8$ marcas en el mismo sentido. ¿Cuántos giros hacen falta, como mínimo, para volver a la marca de partida?
- Verificador: `entero`. Firmas de error de este ejemplo: `n`, `mcd`, `mcm`.
- Explicación: Hacen falta 3 giros.

### `w2.n4.fermat-aplicar`

- Familia: aplicacion; habilidades: 2.4.inverso; requiere: nada.
- Ejemplo de enunciado: Calcula $8^{119}\bmod 13$ ayudándote del teorema de Fermat ($p=13$ es primo).
- Verificador: `entero`. Firmas de error de este ejemplo: `reduce-por-p`, `uno`, `resto-exp`.
- Explicación: $8^{119}\equiv 8^{11}\equiv 5\pmod{13}$.

### `w2.n5.operar-complejos`

- Familia: aplicacion; habilidades: 2.5.operaciones; requiere: nada.
- Ejemplo de enunciado: Calcula $(-6-4i)(-1+2i)$ y escríbelo como $a+bi$.
- Verificador: `equivalente-complejo`. Firmas de error de este ejemplo: `i-cuadrado`, `sin-cruzados`, `componentes`.
- Explicación: El resultado es $14-8i$.

### `w2.n5.conjugado-inverso`

- Familia: aplicacion; habilidades: 2.5.conjugado-inverso; requiere: nada.
- Ejemplo de enunciado: Calcula $\dfrac{-2-2i}{-3+i}$ y escríbelo como $x+yi$ (fracciones si hace falta).
- Verificador: `equivalente-complejo`. Firmas de error de este ejemplo: `sin-normalizar`, `conjugado-del-numerador`, `solo-partes`.
- Explicación: $\tfrac{2}{5}+\tfrac{4}{5}i$.

### `w2.n5.a-polar`

- Familia: aplicacion; habilidades: 2.5.a-polar, 2.5.modulo-argumento; requiere: nada.
- Ejemplo de enunciado: Para $z=3+3i$ escribe $|z|^2$ y el argumento $\operatorname{Arg}(z)/\pi$ en $(-1,1]$ (como fracción; vale cualquier equivalente módulo $2$).
- Verificador: `tupla-racional`. Firmas de error de este ejemplo: `arg-del-conjugado`, `modulo-sin-cuadrado`.
- Explicación: $|z|^2=18$ y $\operatorname{Arg}(z)=1/4\pi$.

### `w2.n5.a-binomial`

- Familia: aplicacion; habilidades: 2.5.a-binomial; requiere: nada.
- Ejemplo de enunciado: Escribe en forma binomial $z=4\sqrt{2}\left(\cos\dfrac{5\pi}{4}\right)$.
- Verificador: `equivalente-complejo`. Firmas de error de este ejemplo: `sin-raiz`, `signos`, `modulo-sin-cancelar`.
- Explicación: $z=-4-4i$.

### `w2.n5.rotacion-plano`

- Familia: aplicacion; habilidades: 2.5.operaciones, 2.5.a-polar; requiere: nada.
- Ejemplo de enunciado: En el plano complejo se gira el punto $P=-1-4i$ un ángulo $3\pi/2$ en sentido antihorario alrededor del punto $C=-4-i$. ¿A qué número complejo va a parar?
- Verificador: `equivalente-complejo`. Firmas de error de este ejemplo: `sentido-contrario`, `centro-olvidado`, `sin-girar`.
- Explicación: El punto va a $-7-4i$.

### `w2.n6.potencia-de-moivre`

- Familia: aplicacion; habilidades: 2.6.potencias; requiere: nada.
- Ejemplo de enunciado: Calcula $(-3)^{4}$ y escríbelo como $a+bi$ (puedes usar la forma polar: $\arg z=1\pi$).
- Verificador: `equivalente-complejo`. Firmas de error de este ejemplo: `multiplica-por-n`, `exponente-menos-uno`.
- Explicación: $z^{4}=81$.

### `w2.n6.raices-enesimas`

- Familia: aplicacion; habilidades: 2.6.raices; requiere: nada.
- Ejemplo de enunciado: Halla todas las soluciones complejas de $z^2=-2i$ (escribe el conjunto, por ejemplo $\{1+i,\ -2i\}$).
- Verificador: `conjunto-complejos`. Firmas de error de este ejemplo: `solo-la-mitad`, `solo-reales`, `conjugadas`.
- Explicación: Las soluciones son $\{-1+i,1-i\}$.

### `w2.n6.argumentos-raices`

- Familia: aplicacion; habilidades: 2.6.raices-unidad, 2.6.raices; requiere: nada.
- Ejemplo de enunciado: Las $6$ raíces $6$-ésimas de $w=2\left(\cos \tfrac{1}{2}\pi+i\sin \tfrac{1}{2}\pi\right)$ tienen la forma $\rho(\cos\varphi_k+i\sin\varphi_k)$, $k=0,\dots,5$. Escribe $\varphi_k/\pi$ para cada $k$ (vale cualquier valor equivalente módulo $2$).
- Verificador: `tupla-racional`. Firmas de error de este ejemplo: `sin-2pik`, `pik-sin-doble`.
- Explicación: $\varphi_k/\pi=(1/2+2k)/6$.

### `w2.n6.identidades-trig`

- Familia: aplicacion; habilidades: 2.6.identidades-trig; requiere: nada.
- Ejemplo de enunciado: Usando De Moivre, expresa $\cos(6\theta)$ como polinomio en $c=\cos\theta$ (escribe el polinomio en $c$).
- Verificador: `equivalente-expr`. Firmas de error de este ejemplo: `solo-termino-mayor`, `potencia`.
- Explicación: El polinomio es $32c^{6}-48c^{4}+18c^{2}-1$.

### `w2.n6.vertices-cuadrado`

- Familia: aplicacion; habilidades: 2.6.poligonos, 2.6.raices; requiere: nada.
- Ejemplo de enunciado: Un cuadrado de centro $4+i$ tiene un vértice en $-3+3i$ (en el plano complejo). Escribe el conjunto de los otros tres vértices.
- Verificador: `conjunto-complejos`. Firmas de error de este ejemplo: `reflexiones`, `olvida-el-centro`, `solo-opuesto`.
- Explicación: Los vértices son $\{11-i,2-6i,6+8i\}$.

### `w2.jefe.estrategia`

- Familia: aplicacion; habilidades: ; requiere: nada.
- Ejemplo de enunciado: Tienes que resolver: «Hallar enteros $x,y$ con $35x+21y=14$.» ¿Qué herramienta del Mundo 2 es la más adecuada?
- Verificador: `indice`. Firmas de error de este ejemplo: `metodo-3`, `metodo-1`, `metodo-2`.
- Explicación: La herramienta más adecuada es: Euclides extendido (Bézout). Se busca una combinación lineal entera de dos números.

### `w3.n1.cociente-division`

- Familia: aplicacion; habilidades: 3.1.division; requiere: nada.
- Ejemplo de enunciado: Divide $p(x)=-x^{3}-5x^{2}-8x-3$ entre $d(x)=x+3$ y escribe el cociente $q(x)$.
- Verificador: `equivalente-expr`. Firmas de error de este ejemplo: `signo-del-termino-independiente`, `sin-termino-independiente`, `resto-como-cociente`.
- Explicación: $p=d\cdot q+r$ con $q=-x^{2}-2x-2$ y $r=3$.

### `w3.n1.resto-division`

- Familia: aplicacion; habilidades: 3.1.division; requiere: nada.
- Ejemplo de enunciado: Halla el resto de dividir $p(x)=2x^{3}+3x^{2}-2x-8$ entre $d(x)=x^{2}+x-2$ (un polinomio de grado menor que $2$).
- Verificador: `equivalente-expr`. Firmas de error de este ejemplo: `cociente`, `resto-con-signo-cambiado`.
- Explicación: El resto es $x-6$.

### `w3.n1.teorema-resto`

- Familia: aplicacion; habilidades: 3.1.resto; requiere: nada.
- Ejemplo de enunciado: ¿Cuál es el resto de dividir $p(x)=2x^{4}-4x^{3}-4x^{2}+5x+2$ entre $x-3$? (Sin hacer la división larga.)
- Verificador: `entero`. Firmas de error de este ejemplo: `p-de-menos-a`, `p-de-cero`, `suma-coeficientes`.
- Explicación: $p(3)=35$.

### `w3.n1.horner-coeficiente`

- Familia: aplicacion; habilidades: 3.1.horner, 3.1.division; requiere: nada.
- Ejemplo de enunciado: Al dividir $p(x)=3x^{5}-5x^{4}+5x^{3}-3x+6$ entre $x-4$ con la regla de Horner (división sintética), ¿cuál es el coeficiente de $x^{0}$ en el cociente?
- Verificador: `entero`. Firmas de error de este ejemplo: `resto`, `otro-coeficiente`, `sin-acarreo`.
- Explicación: El cociente es $3x^{4}+7x^{3}+33x^{2}+132x+525$ y el coeficiente pedido es 525.

### `w3.n1.determinar-parametro`

- Familia: aplicacion; habilidades: 3.1.parametros; requiere: nada.
- Ejemplo de enunciado: Halla $k$ para que $x+1$ divida a $p(x)=x^{4}+5x^{3}-2+kx$ (es decir, $p(-1)=0$).
- Verificador: `entero`. Firmas de error de este ejemplo: `signo`, `evalua-en-menos-a`.
- Explicación: $p(-1)=0$ da $k=-6$.

### `w3.n2.candidatos-racionales`

- Familia: aplicacion; habilidades: 3.2.candidatos; requiere: nada.
- Ejemplo de enunciado: Según el teorema de las raíces racionales, ¿cuáles son todos los posibles candidatos a raíz racional de $p(x)=6x^{4}-4x^{3}+2x^{2}-x+6$? (Escribe el conjunto de fracciones.)
- Verificador: `conjunto-racionales`. Firmas de error de este ejemplo: `solo-enteros`, `solo-positivos`.
- Explicación: Los candidatos son $\{-1,-1/2,-1/3,-1/6,-6,-2,-2/3,-3,-3/2,1,1/2,1/3,1/6,2,2/3,3,3/2,6\}$.

### `w3.n2.raices-racionales`

- Familia: aplicacion; habilidades: 3.2.raices; requiere: nada.
- Ejemplo de enunciado: Halla todas las raíces racionales de $p(x)=x^{2}-4$ (escribe el conjunto).
- Verificador: `conjunto-racionales`. Firmas de error de este ejemplo: `una-sola`.
- Explicación: Las raíces racionales son $\{-2,2\}$.

### `w3.n2.multiplicidad`

- Familia: aplicacion; habilidades: 3.2.multiplicidad; requiere: nada.
- Ejemplo de enunciado: ¿Cuál es la multiplicidad de $x=3$ como raíz de $p(x)=x^{4}-x^{3}-5x^{2}-x-6$?
- Verificador: `entero`. Firmas de error de este ejemplo: `una-menos`, `una-mas`, `grado`.
- Explicación: La multiplicidad es $1$.

### `w3.n2.polinomio-con-raices`

- Familia: aplicacion; habilidades: 3.2.construir; requiere: nada.
- Ejemplo de enunciado: Escribe, expandido, el polinomio mónico de menor grado cuyas raíces son $1, 3, -4$.
- Verificador: `equivalente-expr`. Firmas de error de este ejemplo: `signos-opuestos`, `falta-una-raiz`.
- Explicación: $p(x)=x^{3}-13x+12$.

### `w3.n2.raiz-doble-parametro`

- Familia: aplicacion; habilidades: 3.2.multiplicidad, 3.2.raices; requiere: nada.
- Ejemplo de enunciado: ¿Para qué valor de $k$ tiene $x^2-6x+k$ una raíz doble?
- Verificador: `entero`. Firmas de error de este ejemplo: `mitad`, `b-cuadrado`.
- Explicación: $k=9$.

### `w3.n3.factorizar-Q`

- Familia: aplicacion; habilidades: 3.3.factorizar; requiere: nada.
- Ejemplo de enunciado: Factoriza completamente en $\mathbb{Q}[x]$ el polinomio $p(x)=x^{4}+x^{3}-11x^{2}-27x-36$. Escribe un producto de factores irreducibles (usa $*$ entre factores).
- Verificador: `factorizacion`. Firmas de error de este ejemplo: `sin-separar`, `expandido`.
- Explicación: $p(x)=(x+3)(x-4)(x^{2}+2x+3)$.

### `w3.n3.cual-irreducible`

- Familia: aplicacion; habilidades: 3.3.irreducibles; requiere: nada.
- Ejemplo de enunciado: Solo uno de estos polinomios es irreducible en $\mathbb{Q}[x]$. ¿Cuál?
- Verificador: `indice`. Firmas de error de este ejemplo: `tiene-raiz-3`, `tiene-raiz-2`, `tiene-raiz`.
- Explicación: Solo $x^{3}-x^{2}-5x+4$ no tiene raíces racionales.

### `w3.n3.mcd`

- Familia: aplicacion; habilidades: 3.3.mcd; requiere: nada.
- Ejemplo de enunciado: Halla el máximo común divisor **mónico** de $p(x)=x^{2}+2x+1$ y $q(x)=x^{2}-1$ usando el algoritmo de Euclides (o factorizando).
- Verificador: `equivalente-expr`. Firmas de error de este ejemplo: `no-monico`, `producto`.
- Explicación: El mcd mónico es $x+1$.

### `w3.n3.raices-conjugadas`

- Familia: aplicacion; habilidades: 3.3.conjugadas; requiere: nada.
- Ejemplo de enunciado: Un polinomio **de coeficientes reales** y grado $3$ tiene como raíces $-3$ y $1+4i$. Escribe el conjunto de sus tres raíces.
- Verificador: `conjunto-complejos`. Firmas de error de este ejemplo: `sin-conjugada`, `opuesta`.
- Explicación: Las raíces son $-3$, $1+4i$ y $1-4i$.

### `w3.n3.polinomio-conjugadas`

- Familia: aplicacion; habilidades: 3.3.conjugadas, 3.3.factorizar; requiere: nada.
- Ejemplo de enunciado: Halla el polinomio **mónico de coeficientes reales** y menor grado que tiene como raíces $-1$ y $-3+2i$. Escríbelo expandido.
- Verificador: `equivalente-expr`. Firmas de error de este ejemplo: `sin-conjugada`, `signo-parte-real`.
- Explicación: $p(x)=x^{3}+7x^{2}+19x+13$.

### `w3.n3.contar-irreducibles`

- Familia: aplicacion; habilidades: 3.3.irreducibles; requiere: nada.
- Ejemplo de enunciado: ¿Para cuántos enteros $k$ con $-6\le k\le 6$ es $x^2+kx+5$ irreducible sobre $\mathbb{R}$?
- Verificador: `entero`. Firmas de error de este ejemplo: `solo-positivos`, `total`.
- Explicación: Hay $9$ valores.

### `w3.n4.formula-cuadratica`

- Familia: aplicacion; habilidades: 3.4.formula; requiere: nada.
- Ejemplo de enunciado: Usa la fórmula cuadrática para hallar las raíces de $x^{2}+6x+8=0$ (escribe el conjunto).
- Verificador: `conjunto-racionales`. Firmas de error de este ejemplo: `signo-de-b`.
- Explicación: Las raíces son $\{-4,-2\}$.

### `w3.n4.formula-complejas`

- Familia: aplicacion; habilidades: 3.4.formula; requiere: nada.
- Ejemplo de enunciado: Halla en $\mathbb{C}$ las raíces de $x^{2}-4x+29=0$ (escribe el conjunto).
- Verificador: `conjunto-complejos`. Firmas de error de este ejemplo: `una-sola`, `parte-real-opuesta`.
- Explicación: Las raíces son $2+5i$ y $2-5i$.

### `w3.n4.vieta-cuadratica`

- Familia: aplicacion; habilidades: 3.4.vieta; requiere: nada.
- Ejemplo de enunciado: Sin calcular las raíces, halla su suma $x_1+x_2$ y su producto $x_1x_2$ para $2x^{2}-2x-3$.
- Verificador: `tupla-racional`. Firmas de error de este ejemplo: `signo-suma`, `sin-dividir`, `intercambia`.
- Explicación: $x_1+x_2=1$, $x_1x_2=-3/2$.

### `w3.n4.vieta-cubica`

- Familia: aplicacion; habilidades: 3.4.vieta; requiere: nada.
- Ejemplo de enunciado: Para $x^{3}+6x^{2}-3x+8$ con raíces $x_1,x_2,x_3$, halla $x_1+x_2+x_3$, $x_1x_2+x_1x_3+x_2x_3$ y $x_1x_2x_3$.
- Verificador: `tupla-racional`. Firmas de error de este ejemplo: `signos-de-vieta`, `producto-signo`.
- Explicación: Valen $-6$, $-3$ y $-8$.

### `w3.n4.suma-cuadrados-raices`

- Familia: aplicacion; habilidades: 3.4.simetricas; requiere: nada.
- Ejemplo de enunciado: Si $x_1,x_2$ son las raíces de $x^2+8x+5$, calcula $x_1^2+x_2^2$ sin resolver la ecuación.
- Verificador: `entero`. Firmas de error de este ejemplo: `sin-2P`, `signo-2P`, `suma-productos`.
- Explicación: $x_1^2+x_2^2=(-8)^2-2(5)=54$.

### `w3.n4.polinomio-desde-vieta`

- Familia: aplicacion; habilidades: 3.4.construir; requiere: nada.
- Ejemplo de enunciado: Escribe el polinomio mónico de grado $3$ cuyas raíces cumplen $x_1+x_2+x_3=-4$, $x_1x_2+x_1x_3+x_2x_3=-2$ y $x_1x_2x_3=-3$.
- Verificador: `equivalente-expr`. Firmas de error de este ejemplo: `signos`, `producto`.
- Explicación: $x^{3}+4x^{2}-2x+3$.

### `w3.n4.parametro-razon`

- Familia: aplicacion; habilidades: 3.4.vieta, 3.4.simetricas; requiere: nada.
- Ejemplo de enunciado: En $x^2-16x+m$ una raíz es el triple de la otra. Halla $m$.
- Verificador: `entero`. Firmas de error de este ejemplo: `una-t-cuadrada`, `signo-t`.
- Explicación: $t=4$ y $m=3t^2=48$.

### `w3.jefe.estrategia`

- Familia: aplicacion; habilidades: ; requiere: nada.
- Ejemplo de enunciado: Tienes que resolver: «Un cúbico real tiene la raíz $3i$; ¿cuántas raíces reales tiene?» ¿Qué herramienta del Mundo 3 es la más adecuada?
- Verificador: `indice`. Firmas de error de este ejemplo: `metodo-4`, `metodo-1`, `metodo-0`.
- Explicación: La herramienta más adecuada es: Raíces complejas conjugadas. Hay una raíz compleja y coeficientes reales: la conjugada también es raíz.

### `w4.n1.producto`

- Familia: aplicacion; habilidades: 4.1.producto; requiere: nada.
- Ejemplo de enunciado: Calcula $AB$ para $A=\begin{pmatrix}-1&-1\\1&-1\end{pmatrix}$ y $B=\begin{pmatrix}3&-1\\3&-2\end{pmatrix}$.
- Verificador: `matriz`. Firmas de error de este ejemplo: `transpuesta`, `entrada-por-entrada`, `orden-invertido`.
- Explicación: $AB=\begin{pmatrix}-6&3\\0&1\end{pmatrix}$.

### `w4.n1.entrada-producto`

- Familia: aplicacion; habilidades: 4.1.producto; requiere: nada.
- Ejemplo de enunciado: Sean $A=\begin{pmatrix}4&0&2\\2&2&0\\2&-1&-3\end{pmatrix}$ y $B=\begin{pmatrix}1&-1&0\\-2&4&-1\\4&-2&3\end{pmatrix}$. Calcula solo la entrada $(AB)_{21}$ (sin multiplicar toda la matriz).
- Verificador: `entero`. Firmas de error de este ejemplo: `transpuesta`.
- Explicación: La entrada vale $-2$.

### `w4.n1.potencia-polinomio`

- Familia: aplicacion; habilidades: 4.1.producto, 4.1.propiedades; requiere: nada.
- Ejemplo de enunciado: Para $A=\begin{pmatrix}-3&-2\\-3&-2\end{pmatrix}$ calcula $A^2+1A-3I$ (con $I$ la identidad $2\times2$).
- Verificador: `matriz`. Firmas de error de este ejemplo: `sin-identidad`, `cuadrado-entradas`.
- Explicación: $\begin{pmatrix}9&8\\12&5\end{pmatrix}$.

### `w4.n1.inversa-2x2`

- Familia: aplicacion; habilidades: 4.1.inversa-2x2; requiere: nada.
- Ejemplo de enunciado: Halla la inversa de $A=\begin{pmatrix}-1&0\\-3&-2\end{pmatrix}$.
- Verificador: `matriz`. Firmas de error de este ejemplo: `sin-dividir`, `sin-cambiar-signos`, `transpuesta`.
- Explicación: $A^{-1}=\begin{pmatrix}-1&0\\\tfrac{3}{2}&-\tfrac{1}{2}\end{pmatrix}$.

### `w4.n1.transpuesta-producto`

- Familia: aplicacion; habilidades: 4.1.transpuesta, 4.1.propiedades; requiere: nada.
- Ejemplo de enunciado: Con $A=\begin{pmatrix}1&1&-3\\3&0&-3\end{pmatrix}$ y $B=\begin{pmatrix}2&2\\2&-2\\-1&3\end{pmatrix}$, calcula $(AB)^T$.
- Verificador: `matriz`. Firmas de error de este ejemplo: `sin-transponer`.
- Explicación: $(AB)^T=\begin{pmatrix}7&9\\-9&-3\end{pmatrix}$.

### `w4.n1.identidad-valida`

- Familia: aplicacion; habilidades: 4.1.propiedades; requiere: nada.
- Ejemplo de enunciado: ¿Cuál de estas igualdades es **verdadera para todas** las matrices (con tamaños compatibles)?
- Verificador: `indice`. Firmas de error de este ejemplo: `falsa-0`, `falsa-1`, `falsa-2`.
- Explicación: $A(B+C)=AB+AC$: Distributividad por la izquierda.

### `w4.n2.sistema-3x3`

- Familia: aplicacion; habilidades: 4.2.resolver; requiere: nada.
- Ejemplo de enunciado: Resuelve el sistema $\begin{cases}4x+y-z=1\\3x+2y+z=4\\-2x+y+z=-3\end{cases}$ y escribe $(x,y,z)$.
- Verificador: `tupla-racional`. Firmas de error de este ejemplo: `orden`, `signo`.
- Explicación: Solución: $(x,y,z)=(2,-3,4)$.

### `w4.n2.circuito`

- Familia: aplicacion; habilidades: 4.2.resolver; requiere: nada.
- Ejemplo de enunciado: En un circuito, la corriente $I_1$ se divide en $I_2$ e $I_3$ (nudo: $I_1=I_2+I_3$). Con $R_1=2\,\Omega$, $R_2=2\,\Omega$ y $R_3=3\,\Omega$: la malla de la fuente da $2I_1+2I_2=16$ y la otra malla $2I_2-3I_3=0$. Halla $(I_1,I_2,I_3)$ en amperios.
- Verificador: `tupla-racional`. Firmas de error de este ejemplo: `sin-nudo`, `intercambio`.
- Explicación: $(I_1,I_2,I_3)=(5,3,2)$ A.

### `w4.n2.escalonada-reducida`

- Familia: aplicacion; habilidades: 4.2.escalonar; requiere: nada.
- Ejemplo de enunciado: Halla la forma escalonada **reducida** (Gauss-Jordan) de $\begin{pmatrix}2&3&0&3\\3&0&1&8\\-3&1&0&13\end{pmatrix}$.
- Verificador: `matriz`. Firmas de error de este ejemplo: `sin-reducir`.
- Explicación: La forma reducida es $\begin{pmatrix}1&0&0&-\tfrac{36}{11}\\0&1&0&\tfrac{35}{11}\\0&0&1&\tfrac{196}{11}\end{pmatrix}$.

### `w4.n2.contar-soluciones`

- Familia: aplicacion; habilidades: 4.2.clasificar; requiere: nada.
- Ejemplo de enunciado: ¿Cuántas soluciones tiene $\begin{cases}-3x-2y+2z=0\\-y-3z=2\\-3x+8z=-5\end{cases}$?
- Verificador: `indice`. Firmas de error de este ejemplo: `otra-unica`, `otra-infinita`, `dos`.
- Explicación: El sistema tiene ninguna solución.

### `w4.n2.parametro-k`

- Familia: aplicacion; habilidades: 4.2.parametros, 4.2.clasificar; requiere: nada.
- Ejemplo de enunciado: Para el sistema $\begin{cases}2x+4y=1\\4x+ky=3\end{cases}$ halla el valor de $k$ para el cual el sistema no tiene ninguna solución.
- Verificador: `entero`. Firmas de error de este ejemplo: `signo`, `sin-multiplicar`.
- Explicación: $k=8$.

### `w4.n2.variables-libres`

- Familia: aplicacion; habilidades: 4.2.clasificar; requiere: nada.
- Ejemplo de enunciado: El sistema homogéneo $Ax=0$ tiene la matriz de coeficientes $A=\begin{pmatrix}-2&0&-4&-3&1\\2&0&4&3&-1\\-1&3&1&3&-2\end{pmatrix}$. ¿Cuántas variables libres tiene la solución general?
- Verificador: `entero`. Firmas de error de este ejemplo: `rango`.
- Explicación: Hay $5-2=3$ variables libres.

### `w4.n2.solucion-particular`

- Familia: aplicacion; habilidades: 4.2.resolver; requiere: nada.
- Ejemplo de enunciado: El sistema $\begin{cases}4x+4y-z=1\\-3x-2y-z=-7\end{cases}$ tiene infinitas soluciones. Halla la que cumple $z=3$ y escribe $(x,y)$.
- Verificador: `tupla-racional`. Firmas de error de este ejemplo: `olvida-z`, `orden`.
- Explicación: Solución: $(x,y)=(2,-1)$.

### `w4.n2.operacion-elemental`

- Familia: aplicacion; habilidades: 4.2.escalonar; requiere: nada.
- Ejemplo de enunciado: ¿Qué operación elemental por filas transforma $\begin{pmatrix}3&-3&2\\4&1&-2\\-2&-3&-3\end{pmatrix}$ en $\begin{pmatrix}12&-12&8\\4&1&-2\\-2&-3&-3\end{pmatrix}$?
- Verificador: `indice`. Firmas de error de este ejemplo: `otra-2`, `otra-0`, `otra-1`.
- Explicación: La operación es $F1 ← 4F1$.

### `w4.n3.rango`

- Familia: aplicacion; habilidades: 4.3.rango; requiere: nada.
- Ejemplo de enunciado: Calcula el rango de $A=\begin{pmatrix}3&-2&3&3\\3&-3&2&3\\1&-2&4&0\\1&-2&4&0\end{pmatrix}$.
- Verificador: `entero`. Firmas de error de este ejemplo: `filas`.
- Explicación: El rango es $3$.

### `w4.n3.inversa-3x3`

- Familia: aplicacion; habilidades: 4.3.inversa; requiere: nada.
- Ejemplo de enunciado: Halla $A^{-1}$ para $A=\begin{pmatrix}0&3&2\\3&-1&-1\\0&-2&-1\end{pmatrix}$ escalonando $(A\mid I)$.
- Verificador: `matriz`. Firmas de error de este ejemplo: `transpuesta`, `sin-dividir`.
- Explicación: $A^{-1}=\begin{pmatrix}\tfrac{1}{3}&\tfrac{1}{3}&\tfrac{1}{3}\\-1&0&-2\\2&0&3\end{pmatrix}$.

### `w4.n3.rouche`

- Familia: aplicacion; habilidades: 4.3.rouche; requiere: nada.
- Ejemplo de enunciado: Un sistema de $4$ ecuaciones con $4$ incógnitas tiene $\operatorname{rango}A=1$ y $\operatorname{rango}(A\mid b)=1$. ¿Cuántas soluciones tiene?
- Verificador: `indice`. Firmas de error de este ejemplo: `otra-1`, `otra-0`, `dos`.
- Explicación: Resultado: infinitas soluciones.

### `w4.n3.parametro-singular`

- Familia: aplicacion; habilidades: 4.3.invertibilidad; requiere: nada.
- Ejemplo de enunciado: ¿Para qué valor de $k$ la matriz $\begin{pmatrix}k&2&0\\4&-3&2\\-1&-1&2\end{pmatrix}$ **no** es invertible?
- Verificador: `entero`. Firmas de error de este ejemplo: `signo`, `cero`.
- Explicación: $\det=0$ cuando $k=-5$.

### `w4.n3.resolver-con-inversa`

- Familia: aplicacion; habilidades: 4.3.inversa; requiere: nada.
- Ejemplo de enunciado: Se sabe que $A^{-1}=\begin{pmatrix}1&-1\\-\tfrac{2}{3}&1\end{pmatrix}$. Resuelve $Ax=b$ con $b=\begin{pmatrix}24\\20\end{pmatrix}$ y escribe $(x_1,x_2)$.
- Verificador: `tupla-racional`. Firmas de error de este ejemplo: `multiplica-por-A`.
- Explicación: $x=(4,4)$.

### `w4.n3.cual-invertible`

- Familia: aplicacion; habilidades: 4.3.invertibilidad, 4.3.rango; requiere: nada.
- Ejemplo de enunciado: Solo una de estas matrices es invertible. ¿Cuál?
- Verificador: `indice`. Firmas de error de este ejemplo: `singular-1`, `singular-2`, `singular-0`.
- Explicación: Solo $\begin{pmatrix}-1&-2&-2\\0&-2&3\\-1&3&-1\end{pmatrix}$ tiene determinante no nulo.

### `w4.n3.nulidad`

- Familia: aplicacion; habilidades: 4.3.rango, 4.3.rouche; requiere: nada.
- Ejemplo de enunciado: Una matriz $4\times7$ tiene rango $2$. ¿Cuántos parámetros libres tiene la solución general de $Ax=0$?
- Verificador: `entero`. Firmas de error de este ejemplo: `con-filas`.
- Explicación: $7-2=5$.

### `w4.n4.det-3x3`

- Familia: aplicacion; habilidades: 4.4.calcular; requiere: nada.
- Ejemplo de enunciado: Calcula $\det\!\begin{vmatrix}4&-3&-2\\2&-2&3\\1&-2&1\end{vmatrix}$.
- Verificador: `entero`. Firmas de error de este ejemplo: `sin-restar`, `signo-opuesto`, `solo-restan`.
- Explicación: El determinante vale $17$.

### `w4.n4.det-por-operaciones`

- Familia: aplicacion; habilidades: 4.4.calcular, 4.4.propiedades; requiere: nada.
- Ejemplo de enunciado: Calcula $\det\!\begin{vmatrix}1&-1&1&-3\\0&-2&0&-1\\1&-1&-3&-5\\0&4&2&2\end{vmatrix}$ escalonando (trae la matriz a triangular con operaciones elementales y lleva la cuenta de los signos).
- Verificador: `entero`. Firmas de error de este ejemplo: `sin-signo`, `suma-diagonal`.
- Explicación: El determinante vale $-8$.

### `w4.n4.det-propiedades`

- Familia: aplicacion; habilidades: 4.4.propiedades; requiere: nada.
- Ejemplo de enunciado: Sean $A$ y $B$ matrices $3\times3$ con $\det A=-2$ y $\det B=-1$. Calcula $\det(3A^{2}(B^T)^{2})$.
- Verificador: `entero`. Firmas de error de este ejemplo: `sin-k-cubo`, `suma`, `sin-potencia`.
- Explicación: $3^3\cdot(-2)^{2}(-1)^{2}=108$.

### `w4.n4.parametro-cuadratico`

- Familia: aplicacion; habilidades: 4.4.calcular; requiere: nada.
- Ejemplo de enunciado: ¿Para qué valor **positivo** de $k$ se anula $\det\begin{pmatrix}k&-4\\-16&k\end{pmatrix}$?
- Verificador: `entero`. Firmas de error de este ejemplo: `sin-raiz`, `negativa`.
- Explicación: $k^2=64$ y $k=8$.

### `w4.n4.cramer`

- Familia: aplicacion; habilidades: 4.4.cramer; requiere: nada.
- Ejemplo de enunciado: Usa la regla de Cramer para hallar $y$ en $\begin{cases}2x-y-2z=12\\-2x+y-z=-3\\-2x+2y+3z=-17\end{cases}$
- Verificador: `entero`. Firmas de error de este ejemplo: `solo-numerador`, `cociente-invertido`.
- Explicación: $y=-12/6=-2$.

### `w4.n4.area-volumen`

- Familia: aplicacion; habilidades: 4.4.geometria; requiere: nada.
- Ejemplo de enunciado: Halla el área del paralelogramo generado por $u=(5,-3)$ y $v=(-3,2)$.
- Verificador: `entero`. Firmas de error de este ejemplo: `sin-restar`.
- Explicación: Área $=|1|=1$.

### `w4.n4.cofactor`

- Familia: aplicacion; habilidades: 4.4.calcular; requiere: nada.
- Ejemplo de enunciado: Para $A=\begin{pmatrix}1&2&-2\\-3&-3&3\\0&2&3\end{pmatrix}$ calcula el cofactor $C_{33}$.
- Verificador: `entero`. Firmas de error de este ejemplo: `signo-invertido`.
- Explicación: $C_{33}=3$.

### `w4.jefe.estrategia`

- Familia: aplicacion; habilidades: ; requiere: nada.
- Ejemplo de enunciado: Tienes que resolver: «Llevar una matriz $3\times4$ a su forma escalonada reducida.» ¿Qué herramienta del Mundo 4 es la más adecuada?
- Verificador: `indice`. Firmas de error de este ejemplo: `metodo-4`, `metodo-3`, `metodo-1`.
- Explicación: La herramienta más adecuada es: Eliminación gaussiana (escalonar). Hay que resolver un sistema o llevar una matriz a forma escalonada.

### `w5.n1.cuales-subespacios`

- Familia: aplicacion; habilidades: 5.1.reconocer; requiere: nada.
- Ejemplo de enunciado: Marca todos los subconjuntos de $\mathbb{R}^3$ que son **subespacios**.
- Verificador: `conjunto-indices`. Firmas de error de este ejemplo: `marca-de-mas`, `marca-de-mas`, `omite-2`, `marca-de-mas`.
- Explicación: Son subespacios: $x=2y$.

### `w5.n1.que-falla`

- Familia: aplicacion; habilidades: 5.1.propiedades; requiere: nada.
- Ejemplo de enunciado: El conjunto $\{(x,y,z):zx=0\}$ **no** es un subespacio de $\mathbb{R}^3$. ¿Qué propiedad falla?
- Verificador: `indice`. Firmas de error de este ejemplo: `otra-cero`, `otra-escalar`, `si`.
- Explicación: Los vectores de los ejes $z$ y $x$ están, pero su suma no.

### `w5.n1.parametro-subespacio`

- Familia: aplicacion; habilidades: 5.1.parametros, 5.1.reconocer; requiere: nada.
- Ejemplo de enunciado: Sea $W_k=\{(x,y,z):2x+3y-z=k^2-64\}$. ¿Para qué valor **positivo** de $k$ es $W_k$ un subespacio de $\mathbb{R}^3$?
- Verificador: `entero`. Firmas de error de este ejemplo: `cuadrado`, `negativo`.
- Explicación: $k^2=64$ y $k=8$.

### `w5.n1.vector-del-plano`

- Familia: aplicacion; habilidades: 5.1.nucleo, 5.1.reconocer; requiere: nada.
- Ejemplo de enunciado: Sea $W=\{(x,y,z):x+0y-2z=0\}$. Escribe un vector **no nulo** de $W$.
- Verificador: `nucleo-vector`. Firmas de error de este ejemplo: `vector-normal`, `cero`.
- Explicación: Por ejemplo $(0,1,0)$.

### `w5.n1.interseccion-vector`

- Familia: aplicacion; habilidades: 5.1.nucleo; requiere: nada.
- Ejemplo de enunciado: Sean $W_1=\{3x+2y+z=0\}$ y $W_2=\{-2x+2y+2z=0\}$ subespacios de $\mathbb{R}^3$. Escribe un vector **no nulo** de $W_1\cap W_2$.
- Verificador: `nucleo-vector`. Firmas de error de este ejemplo: `solo-uno`, `cero`.
- Explicación: Resolviendo el sistema se obtiene, por ejemplo, $(1/5,-4/5,1)$.

### `w5.n1.pertenece-plano`

- Familia: aplicacion; habilidades: 5.1.reconocer, 5.1.nucleo; requiere: nada.
- Ejemplo de enunciado: ¿Cuál de estos vectores pertenece a $W=\{(x,y,z):2x+y+3z=0\}$?
- Verificador: `indice`. Firmas de error de este ejemplo: `no-cumple-0`, `no-cumple-2`, `no-cumple-1`.
- Explicación: Solo $(7,-1,-2)$ cumple la ecuación.

### `w5.n2.coeficientes`

- Familia: aplicacion; habilidades: 5.2.combinacion; requiere: nada.
- Ejemplo de enunciado: Escribe $v=(4,10,6)$ como combinación lineal $v=a\,u_1+b\,u_2$ con $u_1=(-1,2,0)$ y $u_2=(-3,0,-2)$. Halla $(a,b)$.
- Verificador: `tupla-racional`. Firmas de error de este ejemplo: `orden`, `signo`.
- Explicación: $v=5u_1+-3u_2$ (con $b$ y $a$ como corresponde).

### `w5.n2.parametro-generado`

- Familia: aplicacion; habilidades: 5.2.generado, 5.2.combinacion; requiere: nada.
- Ejemplo de enunciado: ¿Para qué valor de $k$ el vector $(-12,14,k)$ pertenece a $\operatorname{gen}\{(0,1,4),(-3,3,3)\}$?
- Verificador: `entero`. Firmas de error de este ejemplo: `signo`, `suma`.
- Explicación: $k=20$.

### `w5.n2.independientes`

- Familia: aplicacion; habilidades: 5.2.independencia; requiere: nada.
- Ejemplo de enunciado: Sean $u_1=(4,-3,1)$, $u_2=(0,1,-3)$, $u_3=(-3,-1,0)$. ¿Son linealmente independientes?
- Verificador: `indice`. Firmas de error de este ejemplo: `dice-no`, `nulo`, `dos-proporcionales`.
- Explicación: El rango es $3$: independientes.

### `w5.n2.parametro-dependencia`

- Familia: aplicacion; habilidades: 5.2.independencia; requiere: nada.
- Ejemplo de enunciado: ¿Para qué valor de $k$ son linealmente **dependientes** los vectores $(k,4,0),\ (0,-3,3),\ (3,-3,1)$?
- Verificador: `entero`. Firmas de error de este ejemplo: `signo`, `cero`.
- Explicación: $k=-6$.

### `w5.n2.relacion-lineal`

- Familia: aplicacion; habilidades: 5.2.independencia, 5.2.combinacion; requiere: nada.
- Ejemplo de enunciado: Los vectores $u_1=(2,-1,4)$, $u_2=(4,4,-1)$ y $u_3=(8,2,7)$ son dependientes. Halla coeficientes $(c_1,c_2,c_3)$, **no todos cero**, con $c_1u_1+c_2u_2+c_3u_3=0$.
- Verificador: `dependencia-lineal`. Firmas de error de este ejemplo: `cero`, `unos`.
- Explicación: Sirve $(-2,-1,1)$ y sus múltiplos.

### `w5.n2.rango-conjunto`

- Familia: aplicacion; habilidades: 5.2.rango-conjunto; requiere: nada.
- Ejemplo de enunciado: ¿Cuál es la dimensión del subespacio generado por $(-1,3,4),\ (-1,-3,-12),\ (3,-3,4),\ (-6,6,-8),\ (-1,3,4)$?
- Verificador: `entero`. Firmas de error de este ejemplo: `cuenta-vectores`, `dimension-ambiente`.
- Explicación: El rango es $2$.

### `w5.n2.generan`

- Familia: aplicacion; habilidades: 5.2.generado, 5.2.independencia; requiere: nada.
- Ejemplo de enunciado: ¿Generan $\mathbb{R}^3$ los vectores $(4,-2,2),\ (-2,4,-3),\ (0,-1,1)$?
- Verificador: `indice`. Firmas de error de este ejemplo: `otra-0`, `otra-1`.
- Explicación: El rango es $3$.

### `w5.n3.dim-solucion`

- Familia: aplicacion; habilidades: 5.3.dimension; requiere: nada.
- Ejemplo de enunciado: ¿Cuál es la dimensión del subespacio $W=\{x,y,z,w,u\ \text{que cumplen}\ \begin{cases}-2x+2y+4z-w-3undefined=0\\3x-y-z+3w-3undefined=0\end{cases}\}\subseteq\mathbb{R}^5$?
- Verificador: `entero`. Firmas de error de este ejemplo: `rango`.
- Explicación: $\dim W=5-2=3$.

### `w5.n3.base-del-subespacio`

- Familia: aplicacion; habilidades: 5.3.base; requiere: nada.
- Ejemplo de enunciado: Halla una **base** de $W=\{x,y,z,w:\ \begin{cases}-x+3y+z+4w=0\\2x+4y-2z-w=0\end{cases}\}\subseteq\mathbb{R}^4$. Escribe los 2 vectores como filas.
- Verificador: `base-nucleo`. Firmas de error de este ejemplo: `dependientes`, `fuera`.
- Explicación: Una base posible es $(1,0,1,0),\ (19/10,-7/10,0,1)$.

### `w5.n3.completar-base`

- Familia: aplicacion; habilidades: 5.3.completar; requiere: nada.
- Ejemplo de enunciado: Los vectores $(-1,3,1)$ y $(2,-3,3)$ son independientes en $\mathbb{R}^3$. Halla un vector $w$ tal que, añadido a ellos, formen una **base** de $\mathbb{R}^3$.
- Verificador: `completa-base`. Firmas de error de este ejemplo: `cero`, `repetido`.
- Explicación: Sirve, por ejemplo, $(1,0,0)$.

### `w5.n3.es-base`

- Familia: aplicacion; habilidades: 5.3.base; requiere: nada.
- Ejemplo de enunciado: ¿Cuál de estos conjuntos es una **base** de $\mathbb{R}^3$?
- Verificador: `indice`. Firmas de error de este ejemplo: `dependientes`, `pocos`, `muchos`.
- Explicación: Solo uno tiene $3$ vectores independientes.

### `w5.n3.dim-espacios`

- Familia: aplicacion; habilidades: 5.3.espacios, 5.3.dimension; requiere: nada.
- Ejemplo de enunciado: ¿Cuál es la dimensión del espacio de las matrices **triangulares superiores** $5\times5$?
- Verificador: `entero`. Firmas de error de este ejemplo: `tamano-total`, `otro-conteo`.
- Explicación: La dimensión es $15$.

### `w5.n3.maximo-independientes`

- Familia: aplicacion; habilidades: 5.3.dimension; requiere: nada.
- Ejemplo de enunciado: En un espacio de dimensión $10$ se tienen $12$ vectores que lo generan. ¿Cuántos de ellos hay que quitar, como **mínimo**, para quedarse con una base?
- Verificador: `entero`. Firmas de error de este ejemplo: `quitar-n`, `quitar-uno`.
- Explicación: Sobran $2$ vectores.

### `w5.n4.coordenadas`

- Familia: aplicacion; habilidades: 5.4.coordenadas; requiere: nada.
- Ejemplo de enunciado: Sea $B=\{(1,-2,0),\ (2,-1,1),\ (2,1,2)\}$ una base de $\mathbb{R}^3$. Halla las coordenadas de $v=(12,-2,8)$ respecto de $B$, es decir, $[v]_B=(x_1,x_2,x_3)$.
- Verificador: `tupla-racional`. Firmas de error de este ejemplo: `coordenadas-canonicas`, `orden`.
- Explicación: $[v]_B=(0,4,2)$.

### `w5.n4.reconstruir-vector`

- Familia: aplicacion; habilidades: 5.4.reconstruir; requiere: nada.
- Ejemplo de enunciado: En la base $B=\{(1,1),\ (1,-1)\}$ de $\mathbb{R}^2$, un vector tiene coordenadas $[v]_B=(0,-3)$. ¿Cuál es $v$ en la base canónica?
- Verificador: `tupla-racional`. Firmas de error de este ejemplo: `coordenadas-sin-multiplicar`.
- Explicación: $v=(-3,3)$.

### `w5.n4.polinomio-taylor`

- Familia: aplicacion; habilidades: 5.4.polinomios, 5.4.coordenadas; requiere: nada.
- Ejemplo de enunciado: En el espacio de polinomios de grado $\le2$, halla las coordenadas de $p(x)=x^{2}+4x+4$ respecto de la base $B=\{1,\ (x-2),\ (x-2)^2\}$.
- Verificador: `tupla-racional`. Firmas de error de este ejemplo: `canonicas`, `orden`.
- Explicación: $[p]_B=(16,8,1)$.

### `w5.n4.matriz-cambio`

- Familia: aplicacion; habilidades: 5.4.cambio; requiere: nada.
- Ejemplo de enunciado: Sean $B=\{(-1,-1),\ (-2,1)\}$ y $C=\{(1,-2),\ (0,3)\}$ bases de $\mathbb{R}^2$. Halla la matriz de cambio de base $P_{B\to C}$ (de modo que $[v]_C=P[v]_B$).
- Verificador: `matriz`. Firmas de error de este ejemplo: `inversa`, `transpuesta`.
- Explicación: $P_{B\to C}=\begin{pmatrix}-1&-2\\-1&-1\end{pmatrix}$.

### `w5.n4.cambio-coordenadas`

- Familia: aplicacion; habilidades: 5.4.cambio, 5.4.coordenadas; requiere: nada.
- Ejemplo de enunciado: Sean $B=\{(1,0),\ (2,1)\}$ y $C=\{(1,0),\ (-2,-1)\}$ bases de $\mathbb{R}^2$ y $[v]_B=(2,-3)$. Halla $[v]_C$.
- Verificador: `tupla-racional`. Firmas de error de este ejemplo: `sin-cambiar`, `canonicas`.
- Explicación: $[v]_C=(2,3)$.

### `w5.n4.inversa-cambio`

- Familia: aplicacion; habilidades: 5.4.cambio; requiere: nada.
- Ejemplo de enunciado: Se sabe que $P_{B\to C}=\begin{pmatrix}-1&2\\-1&-1\end{pmatrix}$. Sin conocer las bases, halla $P_{C\to B}$.
- Verificador: `matriz`. Firmas de error de este ejemplo: `misma`, `transpuesta`.
- Explicación: $P_{C\to B}=\begin{pmatrix}-\tfrac{1}{3}&-\tfrac{2}{3}\\\tfrac{1}{3}&-\tfrac{1}{3}\end{pmatrix}$.

### `w5.jefe.estrategia`

- Familia: aplicacion; habilidades: ; requiere: nada.
- Ejemplo de enunciado: Tienes que resolver: «Decidir si $\{(x,y,z):x+y+z=1\}$ es un subespacio de $\mathbb{R}^3$.» ¿Qué herramienta del Mundo 5 es la más adecuada?
- Verificador: `indice`. Firmas de error de este ejemplo: `metodo-1`, `metodo-4`, `metodo-5`.
- Explicación: La herramienta más adecuada es: Criterio del subespacio. Se pregunta si un conjunto es subespacio: cero, suma y escalares.

### `w6.n1.cuales-lineales`

- Familia: aplicacion; habilidades: 6.1.reconocer; requiere: nada.
- Ejemplo de enunciado: Marca todas las funciones $T:\mathbb{R}^2\to\mathbb{R}^2$ que son **lineales**.
- Verificador: `conjunto-indices`. Firmas de error de este ejemplo: `marca-de-mas`, `marca-de-mas`, `omite-2`.
- Explicación: Son lineales: $(3x+2y,\ y)$.

### `w6.n1.que-falla`

- Familia: aplicacion; habilidades: 6.1.reconocer; requiere: nada.
- Ejemplo de enunciado: La función $T(x,y)=(x+y+2,\ y)$ **no** es lineal. ¿Qué falla?
- Verificador: `indice`. Firmas de error de este ejemplo: `otra-escalar`, `otra-suma`, `si`.
- Explicación: No cumple $T(0,0)=(0,0)$.

### `w6.n1.evaluar`

- Familia: aplicacion; habilidades: 6.1.evaluar; requiere: nada.
- Ejemplo de enunciado: Sea $T(x,y,z)=(-3x+y+z,\ 3x-2y+3z,\ x+y-2z)$. Calcula $T(2, -1, 3)$.
- Verificador: `tupla-racional`. Firmas de error de este ejemplo: `transpuesta`, `orden`.
- Explicación: $T(2, -1, 3)=(-4, 17, -5)$.

### `w6.n1.por-valores-base`

- Familia: aplicacion; habilidades: 6.1.por-base, 6.1.evaluar; requiere: nada.
- Ejemplo de enunciado: Sea $T:\mathbb{R}^2\to\mathbb{R}^2$ lineal con $T(-2, 1)=(-2, -2)$ y $T(0, -1)=(1, 1)$. Calcula $T(2, -3)$.
- Verificador: `tupla-racional`. Firmas de error de este ejemplo: `sin-coordenadas`.
- Explicación: $v=-1b_1+2b_2$, luego $T(v)=(4, 4)$.

### `w6.n1.composicion`

- Familia: aplicacion; habilidades: 6.1.evaluar, 6.1.geometria; requiere: nada.
- Ejemplo de enunciado: Sean $T(x,y)=(-x+2y,\ -3x-3y)$ y $S(x,y)=(-3x,\ -x-y)$. Calcula $(S\circ T)(1, 1)$.
- Verificador: `tupla-racional`. Firmas de error de este ejemplo: `orden-inverso`.
- Explicación: $T(v)=(1, -6)$ y $S(T(v))=(-3, 5)$.

### `w6.n1.parametro-lineal`

- Familia: aplicacion; habilidades: 6.1.reconocer; requiere: nada.
- Ejemplo de enunciado: Sea $T_k(x,y)=(2x+1y+k^2-9,\ y)$. ¿Para qué valor **positivo** de $k$ es $T_k$ lineal?
- Verificador: `entero`. Firmas de error de este ejemplo: `cuadrado`, `negativo`.
- Explicación: $k^2=9$ y $k=3$.

### `w6.n1.mapa-geometrico`

- Familia: aplicacion; habilidades: 6.1.geometria, 6.1.evaluar; requiere: nada.
- Ejemplo de enunciado: Un personaje está en el punto $(1, 2)$ del mapa (con el origen en el centro). Si se refleja en el eje $x$, ¿en qué punto queda?
- Verificador: `tupla-racional`. Firmas de error de este ejemplo: `sin-mover`, `intercambio`, `opuesto`.
- Explicación: Queda en (1, -2).

### `w6.n2.dim-nucleo-imagen`

- Familia: aplicacion; habilidades: 6.2.nucleo, 6.2.imagen; requiere: nada.
- Ejemplo de enunciado: Sea $T:\mathbb{R}^4\to\mathbb{R}^3$, $T(x,y,z,w)=(-3x+2y+4w,\ 12x-8y-16w,\ -3x+2y+4w)$. Halla $\dim\ker T$ y $\dim\operatorname{im}T$.
- Verificador: `tupla-racional`. Firmas de error de este ejemplo: `intercambio`.
- Explicación: $\dim\ker T=3$ y $\dim\operatorname{im}T=1$.

### `w6.n2.base-del-nucleo`

- Familia: aplicacion; habilidades: 6.2.nucleo; requiere: nada.
- Ejemplo de enunciado: Sea $T(x,y,z)=(4x-12y-4z,\ x-3y-z)$. Halla una **base** de $\ker T$ (escribe los 2 vectores como filas).
- Verificador: `base-nucleo`. Firmas de error de este ejemplo: `dependientes`, `fuera`.
- Explicación: Una base posible es $(3,1,0),\ (1,0,1)$.

### `w6.n2.en-la-imagen`

- Familia: aplicacion; habilidades: 6.2.imagen; requiere: nada.
- Ejemplo de enunciado: Sea $T(x,y,z)=(x+y+4z,\ x+4y+4z,\ -x-y-4z)$. ¿Cuál de estos vectores pertenece a $\operatorname{im}T$?
- Verificador: `indice`. Firmas de error de este ejemplo: `no-esta-1`, `no-esta-2`, `no-esta-0`.
- Explicación: Solo uno da un sistema compatible.

### `w6.n2.inyectiva-sobre`

- Familia: aplicacion; habilidades: 6.2.inyectiva, 6.2.rango-nulidad; requiere: nada.
- Ejemplo de enunciado: La transformación $T:\mathbb{R}^2\to\mathbb{R}^3$, $T(x,y)=(2x,\ -3x-2y,\ x-2y)$, es:
- Verificador: `indice`. Firmas de error de este ejemplo: `otra-si`, `otra-ii`, `otra-no`.
- Explicación: Rango $2$: inyectiva pero no sobreyectiva.

### `w6.n2.rango-nulidad`

- Familia: aplicacion; habilidades: 6.2.rango-nulidad; requiere: nada.
- Ejemplo de enunciado: Una transformación lineal $T$ con $\dim\ker T=4$ y $\dim\operatorname{im}T=3$ está definida en un espacio $V$. ¿Cuánto vale $\dim V$?
- Verificador: `entero`. Firmas de error de este ejemplo: `solo-imagen`, `diferencia`.
- Explicación: $4+3=7$.

### `w6.n2.vector-del-nucleo`

- Familia: aplicacion; habilidades: 6.2.nucleo; requiere: nada.
- Ejemplo de enunciado: Sea $T(x,y,z,w)=(4y-z-3w,\ 4x+4y-3z+4w)$. Escribe un vector **no nulo** de $\ker T$.
- Verificador: `nucleo-vector`. Firmas de error de este ejemplo: `cero`, `fila`.
- Explicación: Por ejemplo $(1/2,1/4,1,0)$.

### `w6.n2.derivada-contexto`

- Familia: aplicacion; habilidades: 6.2.rango-nulidad, 6.2.nucleo, 6.2.imagen; requiere: nada.
- Ejemplo de enunciado: Sea $T=\frac{d}{dx}:P_9\to P_9$ sobre los polinomios de grado $\le9$. ¿Cuánto vale $\dim\ker T$?
- Verificador: `entero`. Firmas de error de este ejemplo: `intercambio`, `dim-total`.
- Explicación: $\dim\ker T=1$, $\dim\operatorname{im}T=9$.

### `w6.n3.matriz-de-T`

- Familia: aplicacion; habilidades: 6.3.matriz; requiere: nada.
- Ejemplo de enunciado: Halla la matriz $[T]$ (respecto de las bases canónicas) de $T:\mathbb{R}^3\to\mathbb{R}^3$, $T(x,y,z)=(-2x-y,\ -3x-3y+2z,\ -x+2y)$.
- Verificador: `matriz`. Firmas de error de este ejemplo: `transpuesta`, `filas-intercambiadas`.
- Explicación: $[T]=\begin{pmatrix}-2&-1&0\\-3&-3&2\\-1&2&0\end{pmatrix}$.

### `w6.n3.matriz-por-imagenes`

- Familia: aplicacion; habilidades: 6.3.matriz; requiere: nada.
- Ejemplo de enunciado: Una transformación lineal $T:\mathbb{R}^3\to\mathbb{R}^2$ cumple $T(e_1)=(1,2)$, $T(e_2)=(-2,-2)$, $T(e_3)=(4,4)$. Escribe su matriz $[T]$.
- Verificador: `matriz`. Firmas de error de este ejemplo: `columnas-intercambiadas`.
- Explicación: $[T]=\begin{pmatrix}1&-2&4\\2&-2&4\end{pmatrix}$.

### `w6.n3.pipeline-grafico`

- Familia: aplicacion; habilidades: 6.3.composicion; requiere: nada.
- Ejemplo de enunciado: En un videojuego, un objeto primero se desliza horizontalmente (cizalla $x\mapsto x+y$) y **después** se refleja en el eje $y$. Halla la matriz $2\times2$ que hace las dos operaciones a la vez.
- Verificador: `matriz`. Firmas de error de este ejemplo: `orden-invertido`.
- Explicación: La matriz es $BA=\begin{pmatrix}-1&-1\\0&1\end{pmatrix}$.

### `w6.n3.matriz-respecto-bases`

- Familia: aplicacion; habilidades: 6.3.bases; requiere: nada.
- Ejemplo de enunciado: Sea $T:\mathbb{R}^2\to\mathbb{R}^2$ con matriz canónica $\begin{pmatrix}-2&1\\2&3\end{pmatrix}$, $B=\{(0,-2),(1,2)\}$ y $C=\{(3,2),(-1,0)\}$. Halla $[T]_{B,C}$.
- Verificador: `matriz`. Firmas de error de este ejemplo: `sin-cambiar-base`, `transpuesta`.
- Explicación: $[T]_{B,C}=\begin{pmatrix}-3&4\\-7&12\end{pmatrix}$.

### `w6.n3.matriz-de-la-inversa`

- Familia: aplicacion; habilidades: 6.3.inversa; requiere: nada.
- Ejemplo de enunciado: La transformación $T(x,y)=(-2x+2y,\ -3x+2y)$ es biyectiva. Halla la matriz de $T^{-1}$.
- Verificador: `matriz`. Firmas de error de este ejemplo: `misma-matriz`, `transpuesta-de-T`.
- Explicación: $[T^{-1}]=\begin{pmatrix}1&-1\\\tfrac{3}{2}&-1\end{pmatrix}$.

### `w6.n3.secuencia-punto`

- Familia: aplicacion; habilidades: 6.3.composicion, 6.3.matriz; requiere: nada.
- Ejemplo de enunciado: Un personaje está en $(5,2)$. En orden, se proyecta sobre el eje $x$; luego se estira al doble en el eje $x$; luego se desliza horizontalmente (cizalla $x\mapsto x+y$). ¿Dónde queda?
- Verificador: `tupla-racional`. Firmas de error de este ejemplo: `orden-invertido`.
- Explicación: Queda en (10,0).

### `w6.n4.cambiar-base-matriz`

- Familia: aplicacion; habilidades: 6.4.cambio; requiere: nada.
- Ejemplo de enunciado: La matriz de $T$ en la base canónica es $A=\begin{pmatrix}2&0\\-1&-3\end{pmatrix}$. Sea $C$ la base cuyos vectores son las columnas de $P=\begin{pmatrix}1&0\\1&1\end{pmatrix}$. Halla $[T]_C$.
- Verificador: `matriz`. Firmas de error de este ejemplo: `orden-invertido`, `sin-inversa`.
- Explicación: $[T]_C=P^{-1}AP=\begin{pmatrix}2&0\\-6&-3\end{pmatrix}$.

### `w6.n4.base-diagonalizante`

- Familia: aplicacion; habilidades: 6.4.diagonal, 6.4.cambio; requiere: nada.
- Ejemplo de enunciado: La transformación $T$ tiene matriz canónica $A=\begin{pmatrix}12&-15\\10&-13\end{pmatrix}$ y los vectores $v_1=(1,1)$ y $v_2=(3,2)$ cumplen $Av_1=-3v_1$ y $Av_2=2v_2$. Halla la matriz de $T$ en la base $\{v_1,v_2\}$.
- Verificador: `matriz`. Firmas de error de este ejemplo: `intercambio`, `canonica`.
- Explicación: $[T]_B=\begin{pmatrix}-3&0\\0&2\end{pmatrix}$.

### `w6.n4.potencia-semejante`

- Familia: aplicacion; habilidades: 6.4.potencias; requiere: nada.
- Ejemplo de enunciado: Sea $A=PDP^{-1}$ con $P=\begin{pmatrix}3&1\\2&1\end{pmatrix}$ y $D=\begin{pmatrix}2&0\\0&1\end{pmatrix}$. Calcula $A^{4}$.
- Verificador: `matriz`. Firmas de error de este ejemplo: `potencia-de-D`, `cada-entrada`.
- Explicación: $A^{4}=PD^{4}P^{-1}=\begin{pmatrix}46&-45\\30&-29\end{pmatrix}$.

### `w6.n4.invariantes`

- Familia: aplicacion; habilidades: 6.4.invariantes; requiere: nada.
- Ejemplo de enunciado: Sea $A=\begin{pmatrix}4&0\\1&3\end{pmatrix}$ y $B=P^{-1}AP$ con $P$ una matriz invertible desconocida. ¿Cuánto vale $\det B$?
- Verificador: `entero`. Firmas de error de este ejemplo: `otro-invariante`, `signo`.
- Explicación: Vale $12$ (invariante).

### `w6.n4.no-semejantes`

- Familia: aplicacion; habilidades: 6.4.invariantes; requiere: nada.
- Ejemplo de enunciado: Las matrices $A=\begin{pmatrix}-2&4\\0&-3\end{pmatrix}$ y $B=\begin{pmatrix}0&-2\\3&4\end{pmatrix}$ **no** son semejantes. ¿Qué invariante lo demuestra?
- Verificador: `indice`. Firmas de error de este ejemplo: `otro`, `entradas`, `filas`.
- Explicación: Aquí tienen distinta traza.

### `w6.n4.reflexion-en-recta`

- Familia: aplicacion; habilidades: 6.4.diagonal, 6.4.cambio; requiere: nada.
- Ejemplo de enunciado: La transformación $T$ refleja el plano en la recta que pasa por el origen con dirección $(4,-3)$. En la base $\{(4,-3),(3,4)\}$ su matriz es $\begin{pmatrix}1&0\\0&-1\end{pmatrix}$. Halla su matriz en la base **canónica**.
- Verificador: `matriz`. Firmas de error de este ejemplo: `proyeccion`, `sin-denominador`.
- Explicación: $[T]=PDP^{-1}=\begin{pmatrix}\tfrac{7}{25}&-\tfrac{24}{25}\\-\tfrac{24}{25}&-\tfrac{7}{25}\end{pmatrix}$.

### `w6.jefe.estrategia`

- Familia: aplicacion; habilidades: ; requiere: nada.
- Ejemplo de enunciado: Tienes que resolver: «Decidir si $T(x,y)=(xy,x)$ es lineal.» ¿Qué herramienta del Mundo 6 es la más adecuada?
- Verificador: `indice`. Firmas de error de este ejemplo: `metodo-2`, `metodo-5`, `metodo-3`.
- Explicación: La herramienta más adecuada es: Criterio de linealidad (cero, suma, escalares). Se pregunta si una función es lineal o qué propiedad falla.

### `w7.n1.valores-2x2`

- Familia: aplicacion; habilidades: 7.1.valores; requiere: nada.
- Ejemplo de enunciado: Halla los valores propios de $A=\begin{pmatrix}-3&6\\-4&7\end{pmatrix}$ (escribe el conjunto).
- Verificador: `conjunto-racionales`. Firmas de error de este ejemplo: `diagonal`, `traza-det`.
- Explicación: Los valores propios son $3$ y $1$.

### `w7.n1.vector-propio`

- Familia: aplicacion; habilidades: 7.1.vectores; requiere: nada.
- Ejemplo de enunciado: Sea $A=\begin{pmatrix}-11&-3&-4\\28&8&10\\8&2&3\end{pmatrix}$, que tiene a $\lambda=-1$ como valor propio. Escribe un vector propio **no nulo** asociado a $\lambda=-1$.
- Verificador: `nucleo-vector`. Firmas de error de este ejemplo: `cero`, `vector-unitario`.
- Explicación: Sirve, por ejemplo, $(-1,2,1)$.

### `w7.n1.cual-es-propio`

- Familia: aplicacion; habilidades: 7.1.reconocer; requiere: nada.
- Ejemplo de enunciado: Sea $A=\begin{pmatrix}0&6\\0&3\end{pmatrix}$. ¿Cuál de estos vectores es un **vector propio** de $A$?
- Verificador: `indice`. Firmas de error de este ejemplo: `no-propio-1`, `no-propio-2`, `no-propio-0`.
- Explicación: Solo $(1,0)$ cumple que $Av$ es múltiplo de $v$.

### `w7.n1.valor-del-vector`

- Familia: aplicacion; habilidades: 7.1.reconocer, 7.1.valores; requiere: nada.
- Ejemplo de enunciado: El vector $v=(1,1)$ es un vector propio de $A=\begin{pmatrix}-6&5\\-10&9\end{pmatrix}$. ¿Para qué valor propio $\lambda$ se cumple $Av=\lambda v$?
- Verificador: `entero`. Firmas de error de este ejemplo: `otro-valor`, `norma`.
- Explicación: $Av=-1v$.

### `w7.n1.triangular`

- Familia: aplicacion; habilidades: 7.1.valores; requiere: nada.
- Ejemplo de enunciado: Halla los valores propios de la matriz triangular $A=\begin{pmatrix}-3&3&3\\0&0&2\\0&0&-3\end{pmatrix}$ (escribe el conjunto, sin repetir).
- Verificador: `conjunto-racionales`. Firmas de error de este ejemplo: `suma`, `sin-diagonal`.
- Explicación: Los valores propios son \{-3,0\}.

### `w7.n1.potencia-vector`

- Familia: aplicacion; habilidades: 7.1.potencias; requiere: nada.
- Ejemplo de enunciado: Se sabe que $v=(1,1)$ es vector propio de $A=\begin{pmatrix}3&0\\5&-2\end{pmatrix}$. Calcula $A^{5}v$ sin calcular $A^{5}$.
- Verificador: `tupla-racional`. Firmas de error de este ejemplo: `una-vez`, `k-por-lambda`.
- Explicación: $\lambda=3$ y $A^{5}v=3^{5}v=(243,243)$.

### `w7.n1.traza-determinante`

- Familia: aplicacion; habilidades: 7.1.valores; requiere: nada.
- Ejemplo de enunciado: Una matriz $2\times2$ tiene traza $0$ y determinante $-9$. ¿Cuáles son sus valores propios? (escribe el conjunto).
- Verificador: `conjunto-racionales`. Firmas de error de este ejemplo: `traza-det`.
- Explicación: Son $-3$ y $3$.

### `w7.n1.dim-espacio-propio`

- Familia: aplicacion; habilidades: 7.1.vectores, 7.1.valores; requiere: nada.
- Ejemplo de enunciado: $A=\begin{pmatrix}2&1&0\\0&2&0\\0&0&-1\end{pmatrix}$ tiene a $\lambda=2$ como valor propio con multiplicidad algebraica $2$. ¿Cuál es la dimensión de su espacio propio $E_{2}$?
- Verificador: `entero`. Firmas de error de este ejemplo: `multiplicidad`.
- Explicación: $\dim E_{2}=1$.

### `w7.n2.matriz-diagonalizante`

- Familia: aplicacion; habilidades: 7.2.diagonalizar; requiere: nada.
- Ejemplo de enunciado: Halla una matriz invertible $P$ ($2\times2$) tal que $P^{-1}AP$ sea **diagonal**, con $A=\begin{pmatrix}1&-3\\2&-4\end{pmatrix}$. (Los valores propios de $A$ son enteros.)
- Verificador: `matriz-diagonalizante`. Firmas de error de este ejemplo: `identidad`, `columnas-iguales`.
- Explicación: Una $P$ posible es $\begin{pmatrix}3&1\\2&1\end{pmatrix}$.

### `w7.n2.es-diagonalizable`

- Familia: aplicacion; habilidades: 7.2.criterios; requiere: nada.
- Ejemplo de enunciado: ¿Es diagonalizable $A=\begin{pmatrix}-1&0&0\\0&7&4\\0&-12&-7\end{pmatrix}$ (sobre $\mathbb{R}$)?
- Verificador: `indice`. Firmas de error de este ejemplo: `otra-2`, `otra-0`, `otra-1`.
- Explicación: El valor repetido tiene dos vectores propios independientes.

### `w7.n2.hallar-diagonal`

- Familia: aplicacion; habilidades: 7.2.diagonalizar; requiere: nada.
- Ejemplo de enunciado: Los vectores $v_1=(1,1)$ y $v_2=(3,2)$ son vectores propios de $A=\begin{pmatrix}-12&15\\-10&13\end{pmatrix}$. Halla la matriz diagonal $D=P^{-1}AP$ con $P=(v_1\ v_2)$.
- Verificador: `matriz`. Firmas de error de este ejemplo: `orden-invertido`, `A`.
- Explicación: $D=\begin{pmatrix}3&0\\0&-2\end{pmatrix}$.

### `w7.n2.potencia-diagonalizando`

- Familia: aplicacion; habilidades: 7.2.potencias, 7.2.diagonalizar; requiere: nada.
- Ejemplo de enunciado: Calcula $A^{4}$ para $A=\begin{pmatrix}-5&6\\-2&2\end{pmatrix}$ diagonalizando (los valores propios son enteros).
- Verificador: `matriz`. Firmas de error de este ejemplo: `por-entradas`, `una-sola-vez`.
- Explicación: $A^{4}=\begin{pmatrix}61&-90\\30&-44\end{pmatrix}$.

### `w7.n2.recurrencia`

- Familia: aplicacion; habilidades: 7.2.recurrencias; requiere: nada.
- Ejemplo de enunciado: La sucesión cumple $x_{n+2}=3x_{n+1}-2x_n$ con $x_0=0$ y $x_1=4$. Calcula $x_{8}$ (puedes usar la matriz $\begin{pmatrix}3&-2\\1&0\end{pmatrix}$ y su diagonalización, de valores propios $2$ y $1$).
- Verificador: `entero`. Firmas de error de este ejemplo: `indice-corrido`, `signo-recurrencia`.
- Explicación: $x_{8}=1020$.

### `w7.n2.parametro-defectiva`

- Familia: aplicacion; habilidades: 7.2.criterios; requiere: nada.
- Ejemplo de enunciado: Sea $A_k=\begin{pmatrix}1&k\\0&1\end{pmatrix}$. ¿Para qué valor de $k$ es $A_k$ **diagonalizable**?
- Verificador: `entero`. Firmas de error de este ejemplo: `uno`.
- Explicación: Solo si $k=0$, cuando $A_k=1I$.

### `w7.n2.propios-independientes`

- Familia: aplicacion; habilidades: 7.2.criterios; requiere: nada.
- Ejemplo de enunciado: ¿Cuál es el **máximo** número de vectores propios linealmente independientes de $A=\begin{pmatrix}-2&0&0\\0&-2&0\\0&0&-2\end{pmatrix}$?
- Verificador: `entero`. Firmas de error de este ejemplo: `valores-propios`.
- Explicación: Hay $3$ vectores propios independientes.

### `w7.n3.producto-punto`

- Familia: aplicacion; habilidades: 7.3.punto; requiere: nada.
- Ejemplo de enunciado: Calcula $u\cdot v$ para $u=(-1,-2,-3)$ y $v=(-3,-1,3)$.
- Verificador: `entero`. Firmas de error de este ejemplo: `suma`, `sin-signos`.
- Explicación: $u\cdot v=-4$.

### `w7.n3.ortogonal-parametro`

- Familia: aplicacion; habilidades: 7.3.punto; requiere: nada.
- Ejemplo de enunciado: Halla $k$ para que $u=(1,1,3,0)$ y $v=(k,-2,-2,2)$ sean **ortogonales**.
- Verificador: `entero`. Firmas de error de este ejemplo: `signo`.
- Explicación: $k=8$.

### `w7.n3.proyeccion`

- Familia: aplicacion; habilidades: 7.3.proyeccion; requiere: nada.
- Ejemplo de enunciado: Halla la proyección ortogonal de $v=(-3,0)$ sobre $u=(-1,3)$.
- Verificador: `tupla-racional`. Firmas de error de este ejemplo: `escalar`, `sin-dividir`.
- Explicación: $\operatorname{proy}_u(v)=(-3/10,9/10)$.

### `w7.n3.vector-ortogonal`

- Familia: aplicacion; habilidades: 7.3.punto; requiere: nada.
- Ejemplo de enunciado: Halla un vector **no nulo** de $\mathbb{R}^3$ ortogonal a la vez a $u=(2,-2,4)$ y a $v=(-3,4,-2)$.
- Verificador: `nucleo-vector`. Firmas de error de este ejemplo: `cero`, `uno-de-ellos`.
- Explicación: Sirve, por ejemplo, $(-6,-4,1)$.

### `w7.n3.gram-schmidt-paso`

- Familia: aplicacion; habilidades: 7.3.gram-schmidt, 7.3.proyeccion; requiere: nada.
- Ejemplo de enunciado: Aplica un paso de Gram-Schmidt a $v_1=(-3,4,-3)$ y $v_2=(1,0,3)$: con $u_1=v_1$, halla $u_2=v_2-\operatorname{proy}_{u_1}(v_2)$.
- Verificador: `tupla-racional`. Firmas de error de este ejemplo: `sin-restar`, `proyeccion`.
- Explicación: $u_2=(-1/17,24/17,33/17)$.

### `w7.n3.gram-schmidt-3`

- Familia: aplicacion; habilidades: 7.3.gram-schmidt; requiere: nada.
- Ejemplo de enunciado: Aplica Gram-Schmidt (sin normalizar) a los vectores $v_1,v_2,v_3$ que son las filas de $\begin{pmatrix}2&-2&0\\1&-1&-2\\-1&-1&3\end{pmatrix}$. Escribe $u_1,u_2,u_3$ como filas.
- Verificador: `matriz`. Firmas de error de este ejemplo: `sin-cambiar`.
- Explicación: Resultado: $\begin{pmatrix}2&-2&0\\0&0&-2\\-1&-1&0\end{pmatrix}$.

### `w7.n3.norma-distancia`

- Familia: aplicacion; habilidades: 7.3.geometria, 7.3.punto; requiere: nada.
- Ejemplo de enunciado: Calcula el **cuadrado** de la distancia entre los puntos $P=(5,1)$ y $Q=(-1,-1)$.
- Verificador: `entero`. Firmas de error de este ejemplo: `sin-cuadrado`, `signo`.
- Explicación: Vale $40$.

### `w7.n3.tipo-de-angulo`

- Familia: aplicacion; habilidades: 7.3.geometria, 7.3.punto; requiere: nada.
- Ejemplo de enunciado: ¿Qué tipo de ángulo forman $u=(2,-3,-2,0)$ y $v=(-3,1,0,-1)$?
- Verificador: `indice`. Firmas de error de este ejemplo: `otro-r`, `otro-a`.
- Explicación: $u\cdot v=-9$: obtuso (mayor que $90^\circ$).

### `w7.n4.valores-simetrica`

- Familia: aplicacion; habilidades: 7.4.simetricas; requiere: nada.
- Ejemplo de enunciado: La matriz simétrica $A=\begin{pmatrix}2&2\\2&-1\end{pmatrix}$ tiene valores propios enteros. Escríbelos como conjunto.
- Verificador: `conjunto-racionales`. Firmas de error de este ejemplo: `diagonal`, `traza-det`.
- Explicación: Los valores propios son $3$ y $-2$.

### `w7.n4.otro-propio-ortogonal`

- Familia: aplicacion; habilidades: 7.4.simetricas; requiere: nada.
- Ejemplo de enunciado: La matriz simétrica $A=\begin{pmatrix}-1&2\\2&2\end{pmatrix}$ tiene a $u=(1,2)$ como vector propio con $\lambda=3$. Halla un vector propio **no nulo** del otro valor propio, $\lambda=-2$ (recuerda que es ortogonal a $u$).
- Verificador: `nucleo-vector`. Firmas de error de este ejemplo: `el-mismo`, `cero`.
- Explicación: Sirve $(2,-1)$.

### `w7.n4.un-paso`

- Familia: aplicacion; habilidades: 7.4.markov-paso; requiere: nada.
- Ejemplo de enunciado: El clima de una ciudad (soleado, lluvioso) se modela con una cadena de Markov de matriz de transición $P=\begin{pmatrix}\tfrac{3}{5}&\tfrac{1}{5}\\\tfrac{2}{5}&\tfrac{4}{5}\end{pmatrix}$ (la columna $j$ da las probabilidades de pasar *desde* el estado $j$). Hoy la distribución es $x_0=\begin{pmatrix}0\\1\end{pmatrix}$. ¿Cuál es la distribución de mañana, $x_1=Px_0$?
- Verificador: `tupla-racional`. Firmas de error de este ejemplo: `transpuesta`, `sin-actualizar`.
- Explicación: $x_1=(1/5,4/5)$.

### `w7.n4.dos-pasos`

- Familia: aplicacion; habilidades: 7.4.markov-paso; requiere: nada.
- Ejemplo de enunciado: Una tienda tiene dos clientes tipo A y B que cambian de marca según $P=\begin{pmatrix}0&\tfrac{1}{5}\\1&\tfrac{4}{5}\end{pmatrix}$ (columnas = origen). Hoy los clientes se reparten $x_0=\begin{pmatrix}\tfrac{1}{10}\\\tfrac{9}{10}\end{pmatrix}$. ¿Cuál será el reparto dentro de **dos** periodos, $x_2$?
- Verificador: `tupla-racional`. Firmas de error de este ejemplo: `un-periodo`, `orden`.
- Explicación: $x_2=(41/250,209/250)$.

### `w7.n4.estacionaria`

- Familia: aplicacion; habilidades: 7.4.estacionario; requiere: nada.
- Ejemplo de enunciado: Una cadena de Markov con dos estados tiene $P=\begin{pmatrix}\tfrac{4}{5}&\tfrac{1}{2}\\\tfrac{1}{5}&\tfrac{1}{2}\end{pmatrix}$. Halla la distribución **estacionaria** $\pi$ (con $P\pi=\pi$ y suma $1$).
- Verificador: `tupla-racional`. Firmas de error de este ejemplo: `sin-normalizar`, `invertido`.
- Explicación: $\pi=(5/7,2/7)$.

### `w7.n4.entrada-faltante`

- Familia: aplicacion; habilidades: 7.4.estocasticas; requiere: nada.
- Ejemplo de enunciado: $P=\begin{pmatrix}\tfrac{7}{10}&\tfrac{2}{5}&\tfrac{3}{10}\\\tfrac{1}{10}&\tfrac{2}{5}&p\\\tfrac{1}{5}&\tfrac{1}{5}&\tfrac{1}{5}\end{pmatrix}$ es una matriz de transición estocástica por columnas. ¿Cuánto vale $p$? (puedes escribirlo como fracción o decimal)
- Verificador: `racional`. Firmas de error de este ejemplo: ninguna (el verificador comprueba propiedades).
- Explicación: $p=1/2$.

### `w7.n4.cual-estocastica`

- Familia: aplicacion; habilidades: 7.4.estocasticas; requiere: nada.
- Ejemplo de enunciado: ¿Cuál de estas matrices es **estocástica por columnas** (puede ser matriz de transición de una cadena de Markov)?
- Verificador: `indice`. Firmas de error de este ejemplo: `por-filas`, `suma-mal`, `negativa`.
- Explicación: Solo una tiene columnas que suman $1$ con entradas no negativas.

### `w7.n4.valores-markov`

- Familia: aplicacion; habilidades: 7.4.estacionario, 7.4.estocasticas; requiere: nada.
- Ejemplo de enunciado: Halla los valores propios de la matriz de transición $P=\begin{pmatrix}\tfrac{9}{10}&\tfrac{4}{5}\\\tfrac{1}{10}&\tfrac{1}{5}\end{pmatrix}$ (escribe el conjunto).
- Verificador: `conjunto-racionales`. Firmas de error de este ejemplo: `solo-uno`, `traza`.
- Explicación: Los valores propios son $1$ y $1/10$.

### `w7.jefe.estrategia`

- Familia: aplicacion; habilidades: ; requiere: nada.
- Ejemplo de enunciado: Tienes que resolver: «Hallar el valor propio $\ne 1$ de una matriz de transición.» ¿Qué herramienta del Mundo 7 es la más adecuada?
- Verificador: `indice`. Firmas de error de este ejemplo: `metodo-2`, `metodo-3`, `metodo-1`.
- Explicación: La herramienta más adecuada es: Cadenas de Markov y distribución estacionaria. Hay probabilidades de transición, pasos del tiempo o un estado de equilibrio.

### `w8.n1.cuales-grupos`

- Familia: aplicacion; habilidades: 8.1.reconocer; requiere: nada.
- Ejemplo de enunciado: Marca todas las estructuras que son **grupos**.
- Verificador: `conjunto-indices`. Firmas de error de este ejemplo: `marca-de-mas`, `omite-1`, `omite-2`, `marca-de-mas`.
- Explicación: Son grupos: $(\mathbb{Z},+)$, $(\{1,-1\},\cdot)$.

### `w8.n1.unidades`

- Familia: aplicacion; habilidades: 8.1.unidades; requiere: nada.
- Ejemplo de enunciado: Escribe el conjunto de **unidades** de $\mathbb{Z}_{28}$ (las clases $a\in\{1,\dots,27\}$ con inverso multiplicativo).
- Verificador: `conjunto-racionales`. Firmas de error de este ejemplo: `todos-los-no-nulos`, `primos`.
- Explicación: Las unidades son \{1,3,5,9,11,13,15,17,19,23,25,27\} ($\varphi(28)=12$).

### `w8.n1.inverso-en-grupo`

- Familia: aplicacion; habilidades: 8.1.unidades, 8.1.reconocer; requiere: nada.
- Ejemplo de enunciado: En el grupo $(\mathbb{Z}_{25},+)$, ¿cuál es el inverso (opuesto) de $23$? (un representante entre $0$ y $24$).
- Verificador: `entero`. Firmas de error de este ejemplo: `inverso-mult`, `mismo`.
- Explicación: $-23\equiv2\pmod{25}$.

### `w8.n1.orden-unidades`

- Familia: aplicacion; habilidades: 8.1.unidades; requiere: nada.
- Ejemplo de enunciado: ¿Cuántos elementos tiene el grupo $(\mathbb{Z}_{17}^\times,\cdot)$ (su **orden**)?
- Verificador: `entero`. Firmas de error de este ejemplo: `n`.
- Explicación: $\varphi(17)=16$.

### `w8.n1.componer-permutaciones`

- Familia: aplicacion; habilidades: 8.1.permutaciones; requiere: nada.
- Ejemplo de enunciado: En $S_4$ sean $\sigma=(1,2,4,3)$ y $\tau=(3,2,1,4)$ en notación de una línea ($\sigma(i)$ es la $i$-ésima entrada). Calcula $\sigma\circ\tau$ (primero $\tau$) y escríbela en notación de una línea.
- Verificador: `tupla-racional`. Firmas de error de este ejemplo: `orden-invertido`.
- Explicación: $\sigma\circ\tau=(4,2,1,3)$.

### `w8.n1.inversa-permutacion`

- Familia: aplicacion; habilidades: 8.1.permutaciones; requiere: nada.
- Ejemplo de enunciado: En $S_5$, $\sigma=(4,1,2,5,3)$ (notación de una línea). Halla $\sigma^{-1}$.
- Verificador: `tupla-racional`. Firmas de error de este ejemplo: `misma`, `reflejada`.
- Explicación: $\sigma^{-1}=(2,3,5,1,4)$.

### `w8.n1.que-axioma-falla`

- Familia: aplicacion; habilidades: 8.1.reconocer; requiere: nada.
- Ejemplo de enunciado: La estructura $(2\mathbb{Z}\setminus\{0\},+)$ **no** es un grupo. ¿Qué propiedad falla?
- Verificador: `indice`. Firmas de error de este ejemplo: `otra-inverso`, `otra-neutro`, `otra-asoc`.
- Explicación: No es cerrado: $2+(-2)=0\notin$.

### `w8.n1.tabla-unidades`

- Familia: aplicacion; habilidades: 8.1.tablas, 8.1.unidades; requiere: nada.
- Ejemplo de enunciado: Completa la tabla de multiplicar del grupo $(\mathbb{Z}_{18}^\times,\cdot)$, con filas y columnas ordenadas como $1,\ 13,\ 11,\ 5,\ 17,\ 7$ (la entrada $(i,j)$ es el producto de la fila $i$ por la columna $j$ módulo $18$).
- Verificador: `matriz`. Firmas de error de este ejemplo: `sin-reducir`, `transpuesta-con-suma`.
- Explicación: La tabla es $\begin{pmatrix}1&13&11&5&17&7\\13&7&17&11&5&1\\11&17&13&1&7&5\\5&11&1&7&13&17\\17&5&7&13&1&11\\7&1&5&17&11&13\end{pmatrix}$.

### `w8.n2.cuales-subgrupos`

- Familia: aplicacion; habilidades: 8.2.subgrupos; requiere: nada.
- Ejemplo de enunciado: En el grupo $(\mathbb{Z}_{24},+)$ marca todos los subconjuntos que son **subgrupos**.
- Verificador: `conjunto-indices`. Firmas de error de este ejemplo: `omite-0`, `marca-de-mas`, `marca-de-mas`, `omite-3`.
- Explicación: Son subgrupos los que son $\langle d\rangle$ con $d\mid 24$.

### `w8.n2.orden-en-suma`

- Familia: aplicacion; habilidades: 8.2.ordenes; requiere: nada.
- Ejemplo de enunciado: ¿Cuál es el orden del elemento $45$ en el grupo $(\mathbb{Z}_{51},+)$?
- Verificador: `entero`. Firmas de error de este ejemplo: `n`, `mcd`.
- Explicación: $51/3=17$.

### `w8.n2.orden-en-producto`

- Familia: aplicacion; habilidades: 8.2.ordenes, 8.2.lagrange; requiere: nada.
- Ejemplo de enunciado: ¿Cuál es el orden de $10$ en el grupo $(\mathbb{Z}_{17}^\times,\cdot)$ (el menor $m\ge1$ con $10^m\equiv1\pmod{17}$)?
- Verificador: `entero`. Firmas de error de este ejemplo: `una-mas`.
- Explicación: $10^{16}\equiv1\pmod{17}$ y no antes.

### `w8.n2.subgrupo-generado`

- Familia: aplicacion; habilidades: 8.2.generados; requiere: nada.
- Ejemplo de enunciado: Escribe el subgrupo cíclico $\langle8\rangle$ de $(\mathbb{Z}_{15}^\times,\cdot)$ (todos sus elementos, como conjunto).
- Verificador: `conjunto-racionales`. Firmas de error de este ejemplo: `solo-generador`, `sin-neutro`.
- Explicación: Es \{1,2,4,8\}.

### `w8.n2.indice`

- Familia: aplicacion; habilidades: 8.2.lagrange; requiere: nada.
- Ejemplo de enunciado: Sea $G$ un grupo de orden $20$ y $H$ un subgrupo de orden $2$. ¿Cuál es el índice $[G:H]$ (número de clases laterales)?
- Verificador: `entero`. Firmas de error de este ejemplo: `orden-de-H`, `resta`.
- Explicación: $[G:H]=20/2=10$.

### `w8.n2.ordenes-subgrupos`

- Familia: aplicacion; habilidades: 8.2.lagrange, 8.2.generados; requiere: nada.
- Ejemplo de enunciado: El grupo $(\mathbb{Z}_{93},+)$ es cíclico: tiene exactamente un subgrupo de cada orden posible. Escribe el conjunto de **órdenes** de sus subgrupos.
- Verificador: `conjunto-racionales`. Firmas de error de este ejemplo: `sin-extremos`, `todos-hasta-n`.
- Explicación: Son los divisores de $93$: \{1,3,31,93\}.

### `w8.n2.clase-lateral`

- Familia: aplicacion; habilidades: 8.2.lagrange, 8.2.generados; requiere: nada.
- Ejemplo de enunciado: Sea $H=\langle6\rangle\le(\mathbb{Z}_{18},+)$. Escribe la clase lateral $5+H$.
- Verificador: `conjunto-racionales`. Firmas de error de este ejemplo: `es-H`, `solo-a`.
- Explicación: $5+H=\{5,11,17\}$.

### `w8.n2.lagrange-posible`

- Familia: aplicacion; habilidades: 8.2.lagrange; requiere: nada.
- Ejemplo de enunciado: Un grupo finito $G$ tiene orden $24$. ¿Qué orden **no puede** tener un subgrupo de $G$?
- Verificador: `indice`. Firmas de error de este ejemplo: `divide-2`, `divide-6`, `divide-3`.
- Explicación: $9$ no divide a $24$.

### `w8.n2.orden-permutacion`

- Familia: aplicacion; habilidades: 8.2.ordenes; requiere: nada.
- Ejemplo de enunciado: En $S_5$ la permutación $\sigma$ (notación de una línea) es $(4,5,1,3,2)$. ¿Cuál es su orden?
- Verificador: `entero`. Firmas de error de este ejemplo: `suma-ciclos`, `maximo`.
- Explicación: Ciclos de longitudes $3,2$: orden $6$.

### `w8.n3.cuales-homomorfismos`

- Familia: aplicacion; habilidades: 8.3.reconocer; requiere: nada.
- Ejemplo de enunciado: Considera $\varphi:\mathbb{Z}_{12}\to\mathbb{Z}_{8}$ dada por $\varphi(x)=kx\bmod 8$. Marca los valores de $k$ para los que $\varphi$ está bien definida y es un **homomorfismo**.
- Verificador: `conjunto-indices`. Firmas de error de este ejemplo: `omite-0`, `marca-de-mas`, `marca-de-mas`.
- Explicación: Sirven los $k$ con $8\mid 12k$.

### `w8.n3.tamano-nucleo`

- Familia: aplicacion; habilidades: 8.3.nucleo-imagen; requiere: nada.
- Ejemplo de enunciado: El homomorfismo $\varphi:\mathbb{Z}_{24}\to\mathbb{Z}_{15}$, $\varphi(x)=5x\bmod 15$, está bien definido. ¿Cuántos elementos tiene $\ker\varphi$?
- Verificador: `entero`. Firmas de error de este ejemplo: `imagen`, `uno`.
- Explicación: $|\ker\varphi|=8$ ($|\operatorname{im}|=3$).

### `w8.n3.tamano-imagen`

- Familia: aplicacion; habilidades: 8.3.nucleo-imagen, 8.3.ordenes; requiere: nada.
- Ejemplo de enunciado: Para $\varphi:\mathbb{Z}_{30}\to\mathbb{Z}_{15}$, $\varphi(x)=9x\bmod 15$ (homomorfismo), sabemos que $|\ker\varphi|=6$. ¿Cuánto vale $|\operatorname{im}\varphi|$?
- Verificador: `entero`. Firmas de error de este ejemplo: `nucleo`, `m`.
- Explicación: $30/6=5$.

### `w8.n3.parametro-hom`

- Familia: aplicacion; habilidades: 8.3.reconocer, 8.3.contar; requiere: nada.
- Ejemplo de enunciado: ¿Cuál es el **menor** $k\ge1$ para el que $\varphi:\mathbb{Z}_{27}\to\mathbb{Z}_{12}$, $\varphi(x)=kx\bmod 12$, es un homomorfismo bien definido?
- Verificador: `entero`. Firmas de error de este ejemplo: `uno`, `mcd`.
- Explicación: $k=12/3=4$.

### `w8.n3.nucleo-conjunto`

- Familia: aplicacion; habilidades: 8.3.nucleo-imagen; requiere: nada.
- Ejemplo de enunciado: Para el homomorfismo $\varphi:\mathbb{Z}_{12}\to\mathbb{Z}_{6}$, $\varphi(x)=5x\bmod 6$, escribe $\ker\varphi$ (como conjunto).
- Verificador: `conjunto-racionales`. Firmas de error de este ejemplo: `solo-cero`, `imagen`.
- Explicación: $\ker\varphi=\{0,6\}$.

### `w8.n3.tamanos-imagen-posibles`

- Familia: aplicacion; habilidades: 8.3.ordenes, 8.3.contar; requiere: nada.
- Ejemplo de enunciado: Sea $\varphi:G\to K$ un homomorfismo con $|G|=20$ y $|K|=18$. Escribe el conjunto de **todos los valores posibles** de $|\operatorname{im}\varphi|$ que permiten las condiciones de divisibilidad (los que dividen a ambos órdenes).
- Verificador: `conjunto-racionales`. Firmas de error de este ejemplo: `divisores-de-G`.
- Explicación: Los divisores de $2$: \{1,2\}.

### `w8.n3.contar-homomorfismos`

- Familia: aplicacion; habilidades: 8.3.contar; requiere: nada.
- Ejemplo de enunciado: ¿Cuántos homomorfismos distintos $\varphi:\mathbb{Z}_{15}\to\mathbb{Z}_{10}$ hay? (Todo homomorfismo es $\varphi(x)=kx$ con $k=\varphi(1)$.)
- Verificador: `entero`. Firmas de error de este ejemplo: `m`, `uno`.
- Explicación: Hay $\gcd(15,10)=5$.

### `w8.n4.cuales-cuerpos`

- Familia: aplicacion; habilidades: 8.4.reconocer, 8.4.zn; requiere: nada.
- Ejemplo de enunciado: Marca todas las estructuras (con sus operaciones usuales) que son **cuerpos**.
- Verificador: `conjunto-indices`. Firmas de error de este ejemplo: `marca-de-mas`, `omite-1`, `marca-de-mas`, `omite-3`.
- Explicación: Son cuerpos: $\mathbb{Q}$, $\mathbb{R}$.

### `w8.n4.divisores-de-cero`

- Familia: aplicacion; habilidades: 8.4.zn; requiere: nada.
- Ejemplo de enunciado: Escribe el conjunto de **divisores de cero** de $\mathbb{Z}_{16}$ (clases $a\neq0$ con $ab\equiv0$ para algún $b\not\equiv0$).
- Verificador: `conjunto-racionales`. Firmas de error de este ejemplo: `unidades`, `con-cero`.
- Explicación: Divisores de cero: \{2,4,6,8,10,12,14\}.

### `w8.n4.es-cuerpo-zn`

- Familia: aplicacion; habilidades: 8.4.reconocer, 8.4.zn; requiere: nada.
- Ejemplo de enunciado: ¿Es $\mathbb{Z}_{31}$ un cuerpo?
- Verificador: `indice`. Firmas de error de este ejemplo: `no-conmutativo`, `no-anillo`, `no-falso`.
- Explicación: $31$ es primo: $\mathbb{Z}_{31}$ es cuerpo.

### `w8.n4.inverso-en-cuerpo`

- Familia: aplicacion; habilidades: 8.4.ecuaciones; requiere: nada.
- Ejemplo de enunciado: En el cuerpo $\mathbb{Z}_{37}$, ¿cuál es el inverso multiplicativo de $18$? (un valor entre $1$ y $36$).
- Verificador: `entero`. Firmas de error de este ejemplo: `opuesto`, `a`.
- Explicación: $18\cdot35\equiv1$.

### `w8.n4.ecuacion-lineal-zn`

- Familia: aplicacion; habilidades: 8.4.ecuaciones; requiere: nada.
- Ejemplo de enunciado: Resuelve $11x\equiv1\pmod{18}$ en $\mathbb{Z}_{18}$: escribe el conjunto de **todas** las soluciones (vacío si no hay: $\emptyset$).
- Verificador: `conjunto-racionales`. Firmas de error de este ejemplo: `mal-signo`.
- Explicación: Soluciones: \{5\}.

### `w8.n4.contar-unidades-y-ceros`

- Familia: aplicacion; habilidades: 8.4.zn, 8.4.contar; requiere: nada.
- Ejemplo de enunciado: En $\mathbb{Z}_{58}$, ¿cuántas unidades hay y cuántos divisores de cero? (Recuerda que cada clase no nula es una cosa o la otra.)
- Verificador: `tupla-racional`. Firmas de error de este ejemplo: `orden-invertido`, `sin-restar-cero`.
- Explicación: Hay $28$ unidades y $29$ divisores de cero.

### `w8.n4.raices-de-uno`

- Familia: aplicacion; habilidades: 8.4.contar, 8.4.reconocer; requiere: nada.
- Ejemplo de enunciado: ¿Cuántas soluciones tiene $x^2\equiv1\pmod{44}$ en $\mathbb{Z}_{44}$?
- Verificador: `entero`. Firmas de error de este ejemplo: `dos`, `uno`.
- Explicación: Hay $4$ soluciones.

### `w8.jefe.estrategia`

- Familia: aplicacion; habilidades: ; requiere: nada.
- Ejemplo de enunciado: Tienes que resolver: «Hallar el índice de un subgrupo de orden $6$ en un grupo de orden $30$.» ¿Qué herramienta del Mundo 8 es la más adecuada?
- Verificador: `indice`. Firmas de error de este ejemplo: `metodo-2`, `metodo-3`, `metodo-4`.
- Explicación: La herramienta más adecuada es: Subgrupos y el teorema de Lagrange. Se pregunta qué órdenes puede tener un subgrupo o cuántas clases laterales hay.

