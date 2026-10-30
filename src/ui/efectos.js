/* Efectos con propósito: partículas al ganar XP, destello al fijar una línea, nodos que se iluminan. */
(function (AC) {
  const fx = AC.fx = {
    reducir() {
      const aj = AC.juego.estado && AC.juego.estado.ajustes;
      return !!(aj && aj.reducirAnim) || !!(globalThis.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);
    },
    destello(el) {
      if (!el || fx.reducir()) return;
      el.classList.remove('destello'); void el.offsetWidth; el.classList.add('destello');
      setTimeout(() => el.classList.remove('destello'), 900);
    },
    iluminar(el) { if (el && !fx.reducir()) { el.classList.add('ilumina'); setTimeout(() => el.classList.remove('ilumina'), 1600); } },
    particulas(origen, n, colores) {
      if (fx.reducir() || !origen) return;
      const r = origen.getBoundingClientRect();
      const cv = document.createElement('canvas');
      cv.className = 'particulas'; cv.setAttribute('aria-hidden', 'true');
      cv.width = innerWidth; cv.height = innerHeight; document.body.appendChild(cv);
      const g = cv.getContext('2d'); if (!g) { cv.remove(); return; }
      const cs = colores || ['#d4a847', '#3cc6c0', '#f4e3a1'];
      const ps = Array.from({ length: n || 28 }, (_, i) => {
        const a = (Math.PI * 2 * i) / (n || 28) + (i % 3) * 0.2, v = 1.6 + (i % 5) * 0.55;
        return { x: r.left + r.width / 2, y: r.top + r.height / 2, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 1.2, vida: 1, c: cs[i % cs.length], s: 2 + (i % 3) };
      });
      let t0 = null;
      (function paso(t) {
        if (t0 === null) t0 = t;
        g.clearRect(0, 0, cv.width, cv.height);
        ps.forEach(p => { p.x += p.vx; p.y += p.vy; p.vy += 0.05; p.vida -= 0.014; g.globalAlpha = Math.max(0, p.vida); g.fillStyle = p.c; g.fillRect(p.x, p.y, p.s, p.s); });
        if (t - t0 < 1200 && ps.some(p => p.vida > 0)) requestAnimationFrame(paso); else cv.remove();
      })(performance.now());
    },
  };
  if (typeof module !== 'undefined') module.exports = AC;
})(globalThis.AC = globalThis.AC || {});
