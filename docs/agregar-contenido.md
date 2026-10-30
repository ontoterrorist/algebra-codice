# Cómo agregar contenido

Todo el contenido es **datos y generadores** registrados en `src/content/`. El motor no sabe de álgebra: solo instancia, corrige y lleva el progreso. Después de cualquier cambio:

```bash
node tools/test.js        # criterios 1 y 2: generadores (500 semillas), demostraciones, árbol de teoremas, motor
node tools/contraste.js   # contraste AA de los dos temas
node tools/auditar.js     # regenera docs/revision-matematica.md (conserva el bloque «Dudas»)
node build.js             # genera index.html (un solo archivo, sin red)
```

Los archivos nuevos se agregan en `src/manifest.js` (lista `content`), en el orden en que deben cargarse.

## 1. Agregar un ejercicio de aplicación

Un ejercicio es un **generador**: dada una semilla, devuelve una instancia completa. Se construye **hacia atrás** (primero la respuesta, luego el enunciado), declara su **verificador** y calcula **firmas de error** para cada instancia.

Ejemplo completo — «¿cuántas filas tiene la tabla de verdad de una fórmula con *n* letras?». Va en `src/content/w1/n1-logica.js`, antes de `R.nivel(...)`:

```js
R.generador({
  id: 'w1.n1.filas-de-la-tabla',           // único: w<mundo>.n<nivel>.<nombre>
  mundo: 1, nivel: '1.1', familia: 'aplicacion',
  habilidades: ['1.1.tabla'],              // deben existir en el catálogo (R.habilidad)
  dificultad: 1,                           // 1..3
  requiere: [],                            // teoremas que el ejercicio presupone (deben estar en el Códice)
  generar(rng) {
    const n = rng.int(2, 6);               // nunca Math.random: todo sale de rng (determinista por semilla)
    const letras = rng.sample(['P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W'], n);   // varía también las letras: ≥ 20 variantes
    const filas = 2 ** n;
    return {
      variantKey: letras.slice().sort().join(''),   // misma clave en la ventana de dominio = «la misma variante»
      enunciado: 'Una fórmula usa las letras $' + letras.join(',') + '$. ¿Cuántas filas tiene su tabla de verdad?',
      entrada: { tipo: 'entero' },         // campo numérico con teclado y vista previa
      verificador: { id: 'entero', args: { esperado: String(filas) } },
      solucionTexto: [String(filas)],      // el test comprueba que el enunciado NO contiene la respuesta
      firmas: [                            // errores típicos calculados con los datos de ESTA instancia
        { id: 'filas-lineal', respuesta: String(2 * n), mensaje: 'Duplicaste en vez de multiplicar: cada letra nueva duplica el número de filas, de modo que hay $2^n$.' },
        { id: 'filas-cuadrado', respuesta: String(n * n), mensaje: 'No es $n^2$: cada letra puede ser V o F, independientemente de las demás.' },
      ].filter(f => f.respuesta !== String(filas)),   // una firma nunca puede ser la respuesta correcta
      pistas: [                            // siempre tres: orientación, idea clave, primer paso
        'Orientación: piensa en cuántas combinaciones de V y F existen para las letras.',
        'Idea clave: cada letra nueva duplica el número de filas.',
        'Primer paso: con una sola letra hay 2 filas; con dos, 4.',
      ],
      explicacion: 'Cada una de las ' + n + ' letras toma dos valores, así que hay $2^{' + n + '} = ' + filas + '$ filas.',
    };
  },
});
```

Qué comprueba `tools/test.js` por ti: que la misma semilla dé la misma instancia, que ≥ 20 semillas distintas den variantes distintas, que la respuesta correcta se acepte, que una respuesta mala se rechace, que cada firma se rechace **y se detecte** con su mensaje, y que el enunciado no traiga la respuesta.

**Tipos de entrada** (`entrada.tipo` → verificador): `entero`/`racional` → `entero`/`racional`; `logica` → `equivalente-logica`; `conjunto` → `igual-conjunto` (campo con llaves y comas); `expr` → `equivalente-expr` (expresión en las variables de `entrada.vars`); `entero` con `satisface-entero` para contraejemplos (se evalúa la afirmación registrada en `AC.afirmaciones`); `eleccion` → `indice`; `multiple` → `conjunto-indices`; `tabla` → `tabla-de-verdad`; `procedimiento` → `ruta-valida`; `asignacion` → `asignacion`; `vf` → `vf-justificado`; `matriz` → `matriz`. Para uno nuevo, agrega su verificador en `src/engine/verificar.js`, su firma de detección en `src/engine/errores.js`, su control en `src/ui/controles.js` y su solución en `tools/bot.js`.

## 2. Agregar una demostración

Una demostración es un **grafo**, no un texto: cada línea declara de qué líneas depende (`deps`) y con qué se justifica (`just`). Se acepta cualquier orden que respete las dependencias. Los ocho modos (ordenar, justificar, huecos en dos escalones, estrategia, cazar el error, construcción, redactar) salen **del mismo objeto**.

Mínimo para un teorema nuevo:

1. Registrar el teorema en el catálogo (`R.teorema`), con sus `requiere`. Lo mismo debe quedar en el bloque `text` de `docs/diseno.md` §11.4: el test compara ambos.
2. Registrar la demostración con `R.demostracion({...})` (ver `src/content/w1/n1-demos.js`). Campos obligatorios: `id`, `teorema`, `enunciadoId`, `mundo`, `nivel`, `habilidades`, `requiere` (igual al del teorema), `parametros(rng)`, `enunciado(p)`, `hipotesis(p)`, `meta(p)`, `lineas(p)`, `orden_referencia`, `distractores(p)`, `errores(p)`, `estrategias`, `criterios`, `modelo(p)`, `pistas(p)`.
3. Cada línea: `{ id, texto, just: {tipo, ref}, deps: [...], huecos: [...] }`. Un hueco se marca en el texto con `⟦h1⟧` y se declara con `H('h1', correcta, [alternativas], esMatematica)`.
4. `just.ref` solo puede ser una definición/base de `content/refs.js` o un teorema que esté en `requiere` (o su cierre). Citar el propio teorema es **uso circular** y el test lo rechaza.
5. Los **distractores** no tienen `deps` hacia ellos ni los usa ninguna línea: son líneas falsas con la razón por la que fallan.
6. Los **errores** sustituyen una línea existente por una falsa y declaran el diagnóstico correcto entre cuatro opciones.

## 3. Agregar un nivel

```js
// src/content/w1/n2-cuantificadores.js  (y agregar el archivo a src/manifest.js)
R.habilidad({ id: '1.2.negar-cuantificado', nombre: 'Negar enunciados cuantificados', nivel: '1.2' });
R.teorema({ id: 't.neg-cuantificadores', titulo: 'Negación de cuantificadores', nivel: '1.2',
  enunciado: '$\\neg\\forall x\\,P(x)\\equiv\\exists x\\,\\neg P(x)$.', requiere: [], habilidades: ['1.2.negar-cuantificado'] });
// … generadores (≥ 4 de aplicación, cada uno con ≥ 20 variantes) y demostraciones (≥ 4 enunciados, ≥ 8 ejercicios) …
R.nivel({ id: '1.2', mundo: 1, titulo: 'Cuantificadores y conjuntos', tema: '…',
  habilidades: ['1.2.negar-cuantificado'], teoremas: ['t.neg-cuantificadores'],
  leccion: { intro: '…', definiciones: [{ nombre: '…', tex: '$…$' }], teorema: 't.neg-cuantificadores', ejemplo: { enunciado: '…', pasos: ['…'] } } });
```

Además: quita el nivel de `pendientes` en `src/content/mundos.js` y agrégalo a `niveles`; si el nivel abre mundo o jefe nuevo, actualiza el árbol de `docs/diseno.md`. El siguiente nivel se abre al **dominar** el anterior (80 % en los últimos 10 intentos válidos y demostraciones correctas sobre 2 enunciados distintos).

## 4. Agregar un jefe

En `src/content/mundos.js`, el mundo lleva `jefe: { id, titulo, estrategia, demos }`: `estrategia` es el generador de elección de método que usa la fase 2 y `demos` es la lista de demostraciones (con `nivel: 'J1'` y `habilidades: []`, ver `src/content/w1/jefe.js`) de las que se sortea una para la fase 3. Cada demostración del jefe debe citar al menos **dos teoremas de niveles anteriores**; el test lo comprueba. El jefe se abre cuando todos los niveles del mundo están dominados y todos sus teoremas están en el Códice.

## 5. Qué revisar a mano

Las pruebas no certifican el contenido matemático. Tras agregar teoremas, corre `node tools/auditar.js`, lee `docs/revision-matematica.md` y anota tus dudas en el bloque «Dudas» (el script lo conserva).
