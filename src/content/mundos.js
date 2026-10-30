/* Mundos: el plan completo (niveles previstos) se cruza con lo que ya está registrado. Lo que falta aparece «en construcción»; nada de relleno. */
(function (AC) {
  const R = AC.registrar, reg = AC.reg;
  const PLAN = [
    [1, 'Fundamentos', 'Lógica, conjuntos, relaciones, funciones, métodos de demostración e inducción.', [['1.1', 'Lógica proposicional'], ['1.2', 'Cuantificadores y conjuntos'], ['1.3', 'Relaciones de equivalencia y orden'], ['1.4', 'Funciones'], ['1.5', 'Métodos de demostración'], ['1.6', 'Inducción']]],
    [2, 'Números', 'Divisibilidad, Euclides, congruencias y números complejos.', [['2.1', 'Divisibilidad'], ['2.2', 'Euclides y Bézout'], ['2.3', 'Congruencias'], ['2.4', 'Cifrado y rotaciones'], ['2.5', 'Complejos: forma binomial y polar'], ['2.6', 'De Moivre y raíces']]],
    [3, 'Polinomios', 'División, raíces, factorización y relaciones de Cardano-Vieta.', [['3.1', 'División y teorema del resto'], ['3.2', 'Raíces de un polinomio'], ['3.3', 'Factorización'], ['3.4', 'Relaciones de Cardano-Vieta']]],
    [4, 'Matrices y sistemas', 'Eliminación gaussiana, rango, inversa y determinantes.', [['4.1', 'Matrices y sus operaciones'], ['4.2', 'Eliminación gaussiana'], ['4.3', 'Rango e inversa'], ['4.4', 'Determinantes']]],
    [5, 'Espacios vectoriales', 'Subespacios, independencia, base y dimensión.', [['5.1', 'Subespacios'], ['5.2', 'Combinación lineal e independencia'], ['5.3', 'Base y dimensión'], ['5.4', 'Coordenadas']]],
    [6, 'Transformaciones lineales', 'Núcleo, imagen, matriz asociada y cambio de base.', [['6.1', 'Transformaciones lineales'], ['6.2', 'Núcleo e imagen'], ['6.3', 'Matriz asociada'], ['6.4', 'Cambio de base']]],
    [7, 'Valores propios y producto interno', 'Diagonalización, Gram-Schmidt y teorema espectral.', [['7.1', 'Valores y vectores propios'], ['7.2', 'Diagonalización'], ['7.3', 'Producto interno y Gram-Schmidt'], ['7.4', 'Matrices simétricas y cadenas de Markov']]],
    [8, 'Estructuras algebraicas', 'Grupos, anillos y cuerpos.', [['8.1', 'Grupos'], ['8.2', 'Subgrupos y Lagrange'], ['8.3', 'Homomorfismos'], ['8.4', 'Anillos y cuerpos']]],
  ];
  PLAN.forEach(([id, titulo, resumen, niveles]) => {
    const hechos = niveles.filter(([n]) => reg.niveles[n]).map(([n]) => n);
    const pend = niveles.filter(([n]) => !reg.niveles[n]).map(([n, t]) => ({ id: n, titulo: t }));
    const jefe = reg.jefes[id] || null;
    if (!jefe) pend.push({ id: 'J' + id, titulo: 'Jefe del mundo', jefe: true });
    R.mundo({ id, titulo, resumen, estado: !hechos.length ? 'en-construccion' : !pend.length ? 'completo' : 'parcial', niveles: hechos, pendientes: pend, jefe });
  });

  if (typeof module !== 'undefined') module.exports = AC;
})(globalThis.AC = globalThis.AC || {});
