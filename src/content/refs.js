/* Definiciones, propiedades base y diagnósticos que pueden citarse en una justificación. Los teoremas se citan por su id (t.*). */
(function (AC) {
  const R = AC.registrar;
  const ref = (id, tipo, nombre) => R.ref({ id, tipo, nombre });

  ref('hip', 'hipotesis', 'Hipótesis');
  ref('d.implicacion', 'definicion', 'Definición de →: «P→Q» equivale a «¬P ∨ Q»');
  ref('d.implicacion-valor', 'definicion', 'Tabla de →: si P→Q y P son verdaderas, Q es verdadera');
  ref('d.equivalencia-logica', 'definicion', 'Definición de ≡: mismos valores de verdad en todas las filas');
  ref('d.conectivos', 'definicion', 'Tablas de verdad de ¬, ∧ y ∨');
  ref('d.bicondicional', 'definicion', 'Definición de ↔: «P↔Q» equivale a «(P→Q) ∧ (Q→P)»');
  ref('b.conmutatividad', 'propiedad-base', 'Conmutatividad de ∧ y ∨');
  ref('b.asociatividad', 'propiedad-base', 'Asociatividad de ∧ y ∨');
  ref('b.doble-negacion', 'propiedad-base', 'Doble negación: ¬¬P ≡ P');
  ref('b.idempotencia', 'propiedad-base', 'Idempotencia: P ∧ P ≡ P');
  ref('b.transitividad-equiv', 'propiedad-base', 'Transitividad de ≡');
  ref('b.casos', 'propiedad-base', 'División en casos que cubren todas las posibilidades');
  ref('b.prueba-condicional', 'propiedad-base', 'Para probar «A→B» se supone A y se deduce B');

  ref('d.universal', 'definicion', 'Definición de ∀: «para todo x, P(x)» significa que P(a) es verdadera para cada a del dominio');
  ref('d.existencial', 'definicion', 'Definición de ∃: «existe x con P(x)» significa que P(a) es verdadera para algún a del dominio');
  ref('d.complemento', 'definicion', 'Definición de complemento: x ∈ Aᶜ ⟺ x ∉ A');
  ref('d.union', 'definicion', 'Definición de unión: x ∈ A∪B ⟺ x ∈ A o x ∈ B');
  ref('d.interseccion', 'definicion', 'Definición de intersección: x ∈ A∩B ⟺ x ∈ A y x ∈ B');
  ref('d.diferencia', 'definicion', 'Definición de diferencia: x ∈ A∖B ⟺ x ∈ A y x ∉ B');
  ref('d.inclusion', 'definicion', 'Definición de inclusión: A ⊆ B si todo elemento de A está en B');
  ref('d.igualdad-conj', 'definicion', 'Igualdad de conjuntos: A = B si tienen los mismos elementos (doble inclusión)');
  ref('b.doble-implicacion', 'propiedad-base', 'Para probar P ⟺ Q se prueban P ⇒ Q y Q ⇒ P');
  ref('b.contradiccion', 'propiedad-base', 'Reducción al absurdo: si suponer lo contrario lleva a una contradicción, lo supuesto es falso');
  ref('b.arbitrario', 'propiedad-base', 'Lo probado para un elemento arbitrario vale para todos los elementos');
  ref('d.relacion-equivalencia', 'definicion', 'Relación de equivalencia: reflexiva, simétrica y transitiva');
  ref('d.clase', 'definicion', 'Clase de equivalencia: [a] = { x : x ~ a }');
  ref('d.particion', 'definicion', 'Partición: subconjuntos no vacíos, disjuntos dos a dos, con unión igual al conjunto');
  ref('d.divisibilidad', 'definicion', 'Divisibilidad: n | z si existe k entero con z = nk');
  ref('b.cerradura-enteros', 'propiedad-base', 'Los enteros son cerrados bajo suma, resta y producto');
  ref('d.maximo', 'definicion', 'Máximo: m es máximo si x ≤ m para todo x del conjunto');
  ref('d.orden-parcial', 'definicion', 'Orden parcial: reflexivo, antisimétrico y transitivo');

  const dg = (id, texto) => R.diagnostico({ id, texto });
  dg('error-de-calculo', 'Error de cálculo: el resultado de la línea no sale de la anterior');
  dg('circular', 'Argumento circular: usa lo que se quiere probar');
  dg('no-justificado', 'Paso no justificado: se afirma sin razón');
  dg('caso-faltante', 'Caso omitido: falta una posibilidad');
  dg('demorgan-mal', 'De Morgan mal aplicado: no se cambió el conector');
  dg('confunde-recip', 'Confunde la contrapositiva con la recíproca');
  dg('conclusion-invalida', 'La conclusión no se sigue de lo anterior (falacia)');

  if (typeof module !== 'undefined') module.exports = AC;
})(globalThis.AC = globalThis.AC || {});
