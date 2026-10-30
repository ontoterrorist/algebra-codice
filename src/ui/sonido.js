/* Sonidos suaves sintetizados con Web Audio. Silenciables; no suenan hasta el primer gesto del usuario. */
(function (AC) {
  let ctx = null;
  function ac() {
    if (!ctx) {
      const C = globalThis.AudioContext || globalThis.webkitAudioContext;
      if (!C) return null;
      try { ctx = new C(); } catch (e) { return null; }
    }
    if (ctx.state === 'suspended') ctx.resume().catch(() => {});
    return ctx;
  }
  function nota(c, f, t0, dur, tipo, vol) {
    const o = c.createOscillator(), g = c.createGain();
    o.type = tipo || 'sine'; o.frequency.setValueAtTime(f, t0);
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(vol || 0.07, t0 + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    o.connect(g); g.connect(c.destination);
    o.start(t0); o.stop(t0 + dur + 0.05);
  }
  AC.sonido = {
    silenciado() { return !!(AC.juego.estado && AC.juego.estado.ajustes.silencio); },
    tocar(n) {
      if (AC.sonido.silenciado()) return;
      const c = ac(); if (!c) return; const t = c.currentTime;
      switch (n) {
        case 'ok': nota(c, 660, t, 0.14); nota(c, 880, t + 0.09, 0.2); break;
        case 'mal': nota(c, 220, t, 0.22, 'triangle', 0.06); nota(c, 180, t + 0.12, 0.28, 'triangle', 0.05); break;
        case 'parcial': nota(c, 523, t, 0.15); nota(c, 466, t + 0.12, 0.2); break;
        case 'destello': nota(c, 1175, t, 0.12, 'sine', 0.04); break;
        case 'click': nota(c, 440, t, 0.04, 'sine', 0.03); break;
        case 'teorema': [523, 659, 784, 1047].forEach((f, i) => nota(c, f, t + i * 0.1, 0.35)); break;
        case 'nivel': [392, 523, 659, 784, 1047].forEach((f, i) => nota(c, f, t + i * 0.09, 0.4)); break;
      }
    },
  };
  if (typeof module !== 'undefined') module.exports = AC;
})(globalThis.AC = globalThis.AC || {});
