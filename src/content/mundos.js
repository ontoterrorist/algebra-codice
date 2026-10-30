/* Mundos: sólo el 1 tiene contenido; los demás aparecen «en construcción» (sin relleno). */
(function (AC) {
  const R = AC.registrar;
  R.mundo({
    id: 1, titulo: 'Fundamentos', resumen: 'Lógica, conjuntos, relaciones, funciones, métodos de demostración e inducción.', estado: 'parcial',
    niveles: ['1.1'],
    pendientes: [
      { id: '1.2', titulo: 'Cuantificadores y conjuntos' }, { id: '1.3', titulo: 'Relaciones de equivalencia y orden' },
      { id: '1.4', titulo: 'Funciones' }, { id: '1.5', titulo: 'Métodos de demostración' }, { id: '1.6', titulo: 'Inducción' },
      { id: 'J1', titulo: 'Jefe: El Guardián del Principio', jefe: true },
    ],
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
