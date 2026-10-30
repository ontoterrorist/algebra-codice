/* Grupos y anillos finitos de apoyo: ℤₙ (suma y producto), unidades, órdenes, subgrupos cíclicos, clases laterales y permutaciones (S₃, S₄). */
(function (AC) {
  const N = AC.numth, gcd = N.gcd;
  const md = (a, n) => ((a % n) + n) % n;
  const unidades = n => { const o = []; for (let k = 1; k < n; k++) if (gcd(k, n) === 1) o.push(k); return o; };
  const divisoresCero = n => { const o = []; for (let k = 1; k < n; k++) if (gcd(k, n) > 1) o.push(k); return o; };
  const ordenSuma = (a, n) => n / gcd(md(a, n) || n, n);
  const ordenProducto = (a, n) => { let x = md(a, n), k = 1; if (gcd(a, n) !== 1) return null; while (x !== 1 % n) { x = (x * a) % n; k++; if (k > n + 1) return null; } return k; };
  const generadoSuma = (g, n) => { const s = new Set(); let x = 0; do { s.add(x); x = (x + g) % n; } while (x !== 0); return [...s].sort((a, b) => a - b); };
  const generadoProducto = (g, n) => { const s = new Set(); let x = 1 % n; do { s.add(x); x = (x * g) % n; } while (x !== 1 % n && s.size <= n); return [...s].sort((a, b) => a - b); };
  const lateralSuma = (a, H, n) => [...new Set(H.map(h => md(a + h, n)))].sort((x, y) => x - y);
  /* permutaciones en notación de una línea (1-based): p[i-1] es la imagen de i; compose(p,q) = p∘q (primero q) */
  const compose = (p, q) => q.map(x => p[x - 1]);
  const inversaPerm = p => { const o = Array(p.length); p.forEach((x, i) => { o[x - 1] = i + 1; }); return o; };
  const ciclos = p => { const v = Array(p.length).fill(false), out = []; for (let i = 1; i <= p.length; i++) { if (v[i - 1]) continue; const c = []; let x = i; while (!v[x - 1]) { v[x - 1] = true; c.push(x); x = p[x - 1]; } out.push(c); } return out; };
  const ordenPerm = p => ciclos(p).reduce((l, c) => N.lcm(l, c.length), 1);
  const signo = p => (ciclos(p).reduce((s, c) => s + c.length - 1, 0) % 2 ? -1 : 1);
  const permutaciones = n => { if (n === 1) return [[1]]; const o = []; permutaciones(n - 1).forEach(q => { for (let i = 0; i <= q.length; i++) { const r = q.slice(); r.splice(i, 0, n); o.push(r); } }); return o; };
  const textoCiclos = p => ciclos(p).filter(c => c.length > 1).map(c => '(' + c.join('\\ ') + ')').join('') || 'e';
  AC.grupos = { md, unidades, divisoresCero, ordenSuma, ordenProducto, generadoSuma, generadoProducto, lateralSuma, compose, inversaPerm, ciclos, ordenPerm, signo, permutaciones, textoCiclos };
  if (typeof module !== 'undefined') module.exports = AC;
})(globalThis.AC = globalThis.AC || {});
