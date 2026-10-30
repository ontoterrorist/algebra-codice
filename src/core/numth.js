/* Teoría de números elemental con enteros pequeños (Number) y potencias modulares con BigInt. */
(function (AC) {
  const gcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) { [a, b] = [b, a % b]; } return a; };
  const lcm = (a, b) => (a === 0 || b === 0 ? 0 : Math.abs(a / gcd(a, b) * b));
  const mod = (a, n) => ((a % n) + n) % n;
  /* Euclides extendido: [g, x, y] con a x + b y = g = mcd(a, b) */
  function egcd(a, b) {
    let [r0, r1, s0, s1, t0, t1] = [a, b, 1, 0, 0, 1];
    while (r1 !== 0) { const q = Math.floor(r0 / r1); [r0, r1] = [r1, r0 - q * r1]; [s0, s1] = [s1, s0 - q * s1]; [t0, t1] = [t1, t0 - q * t1]; }
    return r0 < 0 ? [-r0, -s0, -t0] : [r0, s0, t0];
  }
  /* filas del algoritmo de Euclides: a = b·q + r */
  function pasosEuclides(a, b) {
    const out = []; while (b !== 0) { const q = Math.floor(a / b), r = a - q * b; out.push({ a, b, q, r }); [a, b] = [b, r]; }
    return out;
  }
  const inverso = (a, n) => { const [g, x] = egcd(mod(a, n), n); return g === 1 ? mod(x, n) : null; };
  function potmod(a, e, n) {
    let r = 1n, b = BigInt(mod(a, n)), x = BigInt(e); const N = BigInt(n);
    while (x > 0n) { if (x & 1n) r = (r * b) % N; b = (b * b) % N; x >>= 1n; }
    return Number(r);
  }
  const esPrimo = n => { if (n < 2) return false; for (let d = 2; d * d <= n; d++) if (n % d === 0) return false; return true; };
  const primosHasta = n => { const out = []; for (let k = 2; k <= n; k++) if (esPrimo(k)) out.push(k); return out; };
  function factorizar(n) { const out = []; for (let d = 2; d * d <= n; d++) { let e = 0; while (n % d === 0) { n /= d; e++; } if (e) out.push([d, e]); } if (n > 1) out.push([n, 1]); return out; }
  const divisores = n => { const out = []; for (let d = 1; d <= n; d++) if (n % d === 0) out.push(d); return out; };
  const phi = n => factorizar(n).reduce((f, [p, e]) => f * (p - 1) * p ** (e - 1), 1);
  /* x ≡ a (mod m), x ≡ b (mod n) con mcd(m, n) = 1 → x mod mn */
  function tcr2(a, m, b, n) { const inv = inverso(m, n); return mod(a + m * mod((b - a) * inv, n), m * n); }
  const coprimos = (n, lo, hi) => { const out = []; for (let k = lo; k <= hi; k++) if (gcd(k, n) === 1) out.push(k); return out; };

  AC.numth = { gcd, lcm, mod, egcd, pasosEuclides, inverso, potmod, esPrimo, primosHasta, factorizar, divisores, phi, tcr2, coprimos };
  if (typeof module !== 'undefined') module.exports = AC;
})(globalThis.AC = globalThis.AC || {});
