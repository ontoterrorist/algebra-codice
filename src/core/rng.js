/* PRNG con semilla (xmur3 + mulberry32). Nada del juego usa Math.random. */
(function (AC) {
  AC.hash = function (str) {
    str = String(str);
    let h = 1779033703 ^ str.length;
    for (let i = 0; i < str.length; i++) {
      h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
      h = (h << 13) | (h >>> 19);
    }
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return (h ^ (h >>> 16)) >>> 0;
  };

  AC.rng = function (seed) {
    let a = AC.hash(seed);
    const r = {
      seed,
      next() {
        a = (a + 0x6D2B79F5) | 0;
        let t = Math.imul(a ^ (a >>> 15), 1 | a);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
      },
      int(lo, hi) { return lo + Math.floor(r.next() * (hi - lo + 1)); },
      chance(p) { return r.next() < p; },
      pick(arr) { return arr[Math.floor(r.next() * arr.length)]; },
      shuffle(arr) {
        const b = arr.slice();
        for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(r.next() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; }
        return b;
      },
      sample(arr, k) { return r.shuffle(arr).slice(0, k); },
    };
    return r;
  };

  if (typeof module !== 'undefined') module.exports = AC;
})(globalThis.AC = globalThis.AC || {});
