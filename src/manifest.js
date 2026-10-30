/* Orden de carga. Lo leen build.js (navegador) y tools/test.js (Node: sin `ui`). */
module.exports = {
  core: ['core/rng.js', 'core/rat.js', 'core/logic.js'],
  engine: [
    'engine/registro.js', 'engine/verificar.js', 'engine/errores.js', 'engine/demostracion.js',
    'engine/ejercicio.js', 'engine/leitner.js', 'engine/dominio.js', 'engine/xp.js', 'engine/codice.js',
    'engine/guardado.js', 'engine/juego.js', 'engine/planificador.js', 'engine/reto.js', 'engine/logros.js',
  ],
  content: ['content/refs.js', 'content/w1/n1-logica.js', 'content/w1/n1-demos.js', 'content/mundos.js'],
  ui: [
    'ui/dom.js', 'ui/katex.js', 'ui/sonido.js', 'ui/efectos.js', 'ui/teclado.js', 'ui/controles.js',
    'ui/vistas.js', 'ui/app.js',
  ],
};
