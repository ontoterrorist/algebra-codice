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
