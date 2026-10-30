# El Códice de Álgebra

Juego web en español para aprender álgebra universitaria resolviendo problemas de aplicación y construyendo demostraciones. Cada teorema que demuestras entra al Códice y se vuelve una herramienta que puedes citar en las demostraciones siguientes. Estética de biblioteca nocturna (con tema claro), repetición espaciada, XP, estrellas, racha, desafío diario y jefes que exigen citar lo aprendido.

**Estado: los ocho mundos están completos** (versión local; revisión matemática pendiente de tu parte).

| Mundo | Tema | Niveles | Teoremas | Jefe |
|---|---|---|---|---|
| 1 | Fundamentos: lógica, conjuntos, relaciones, funciones, demostración, inducción | 6 | 28 | El Guardián del Principio |
| 2 | Números: divisibilidad, Euclides, congruencias, RSA, complejos | 6 | 26 | El Archivista de Relojes |
| 3 | Polinomios: división, raíces, factorización, Cardano-Vieta | 4 | 16 | El Fundidor de Raíces |
| 4 | Matrices y sistemas: Gauss, rango, inversa, determinantes | 4 | 16 | La Tejedora de Matrices |
| 5 | Espacios vectoriales: subespacios, independencia, base, coordenadas | 4 | 16 | El Arquitecto de Bases |
| 6 | Transformaciones lineales: núcleo, imagen, matriz asociada, semejanza | 4 | 16 | La Hechicera del Espejo |
| 7 | Valores propios y producto interno: diagonalización, Gram-Schmidt, Markov | 4 | 16 | El Oráculo de Autovalores |
| 8 | Estructuras algebraicas: grupos, Lagrange, homomorfismos, anillos y cuerpos | 4 | 16 | La Gran Maga de las Estructuras |

En total: 36 niveles, 150 teoremas con demostración (en 8 modos: ordenar, justificar, huecos, estrategia, cazar el error, construcción libre, redactar y autoevaluación), 238 generadores de ejercicios de aplicación y 8 jefes. Un **aprendiz de mago** (pixel art de PixelLab) te acompaña con frases breves y puede apagarse en Ajustes; cada jefe es un mago o hechicero con su retrato.

- Diseño: [`docs/diseno.md`](docs/diseno.md) · Revisión matemática: [`docs/revision-matematica.md`](docs/revision-matematica.md) · Agregar contenido: [`docs/agregar-contenido.md`](docs/agregar-contenido.md)
- Jugar: abre `index.html` (un solo archivo, sin red).
- Desarrollo: edita `src/` y ejecuta `node build.js`.
- Pruebas: `node tools/test.js [semillas]` (por defecto 500 por generador), `node tools/contraste.js` (WCAG AA), `node tools/auditar.js` (regenera la revisión matemática), `node tools/arbol.js` (apéndice C del diseño), `node tools/arreglar-barras.js` (duplica `\` de LaTeX en cadenas JS), `node tools/imagenes.js` (incrusta los retratos de `assets/personajes/`). En navegador: `tools/humo.js`.
