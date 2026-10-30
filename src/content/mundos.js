/* Mundos: sólo el 1 tiene contenido; los demás aparecen «en construcción» (sin relleno). */
(function (AC) {
  const R = AC.registrar;
  R.mundo({
    id: 1, titulo: 'Fundamentos', resumen: 'Lógica, conjuntos, relaciones, funciones, métodos de demostración e inducción.', estado: 'completo',
    niveles: ['1.1', '1.2', '1.3', '1.4', '1.5', '1.6'],
    pendientes: [],
    jefe: { id: 'J1', titulo: 'El Guardián del Principio', estrategia: 'w1.n5.clasificar-metodo', demos: ['dem.jefe-inversa-composicion', 'dem.jefe-complemento-inclusion', 'dem.jefe-suma-cubos'] },
  });
  [
    [2, 'Números', 'Divisibilidad, Euclides, congruencias y números complejos.'],
    [3, 'Polinomios', 'División, raíces, factorización y relaciones de Cardano-Vieta.'],
    [4, 'Matrices y sistemas', 'Eliminación gaussiana, rango, inversa y determinantes.'],
    [5, 'Espacios vectoriales', 'Subespacios, independencia, base y dimensión.'],
    [6, 'Transformaciones lineales', 'Núcleo, imagen, matriz asociada y cambio de base.'],
    [7, 'Valores propios y producto interno', 'Diagonalización, Gram-Schmidt y teorema espectral.'],
    [8, 'Estructuras algebraicas', 'Grupos, anillos y cuerpos.'],
  ].forEach(([id, titulo, resumen]) => R.mundo({ id, titulo, resumen, estado: 'en-construccion', niveles: [], pendientes: [] }));

  if (typeof module !== 'undefined') module.exports = AC;
})(globalThis.AC = globalThis.AC || {});
