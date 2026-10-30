/* Orden de carga. Lo leen build.js (navegador) y tools/test.js (Node: sin `ui`). */
module.exports = {
  core: ['core/rng.js', 'core/rat.js', 'core/logic.js', 'core/conj.js', 'core/expr.js', 'core/numth.js', 'core/cx.js', 'core/poly.js', 'core/mat.js'],
  engine: [
    'engine/registro.js', 'engine/verificar.js', 'engine/errores.js', 'engine/demostracion.js',
    'engine/ejercicio.js', 'engine/leitner.js', 'engine/dominio.js', 'engine/xp.js', 'engine/codice.js',
    'engine/guardado.js', 'engine/juego.js', 'engine/planificador.js', 'engine/jefe.js', 'engine/reto.js', 'engine/logros.js',
  ],
  content: ['content/refs.js', 'content/w1/n1-logica.js', 'content/w1/n1-demos.js', 'content/w1/util.js', 'content/util2.js', 'content/w1/n2.js', 'content/w1/n3.js', 'content/w1/n4.js', 'content/w1/n5.js', 'content/w1/n6.js', 'content/w1/jefe.js', 'content/w2/n1.js', 'content/w2/n2.js', 'content/w2/n3.js', 'content/w2/n4.js', 'content/w2/n5.js', 'content/w2/n6.js', 'content/w2/jefe.js', 'content/w3/n1.js', 'content/w3/n2.js', 'content/w3/n3.js', 'content/w3/n4.js', 'content/w3/jefe.js', 'content/w4/n1.js', 'content/w4/n2.js', 'content/w4/n3.js', 'content/w4/n4.js', 'content/w4/jefe.js', 'content/w5/n1.js', 'content/w5/n2.js', 'content/w5/n3.js', 'content/w5/n4.js', 'content/w5/jefe.js', 'content/mundos.js'],
  ui: [
    'ui/dom.js', 'ui/personajes.js', 'ui/katex.js', 'ui/sonido.js', 'ui/efectos.js', 'ui/teclado.js', 'ui/controles.js',
    'ui/companero.js', 'ui/vistas.js', 'ui/app.js',
  ],
};
