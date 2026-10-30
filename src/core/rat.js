/* Racionales exactos con BigInt. Acepta coma o punto decimal. */
(function (AC) {
  const gcd = (a, b) => { a = a < 0n ? -a : a; b = b < 0n ? -b : b; while (b) { [a, b] = [b, a % b]; } return a; };

  class Rat {
    constructor(n, d = 1n) {
      n = BigInt(n); d = BigInt(d);
      if (d === 0n) throw new Error('denominador cero');
      if (d < 0n) { n = -n; d = -d; }
      const g = gcd(n, d) || 1n;
      this.n = n / g; this.d = d / g;
    }
    static of(n, d = 1) { return new Rat(n, d); }
    add(o) { return new Rat(this.n * o.d + o.n * this.d, this.d * o.d); }
    sub(o) { return new Rat(this.n * o.d - o.n * this.d, this.d * o.d); }
    mul(o) { return new Rat(this.n * o.n, this.d * o.d); }
    div(o) { return new Rat(this.n * o.d, this.d * o.n); }
    neg() { return new Rat(-this.n, this.d); }
    eq(o) { return this.n === o.n && this.d === o.d; }
    cmp(o) { const x = this.n * o.d, y = o.n * this.d; return x < y ? -1 : x > y ? 1 : 0; }
    isInt() { return this.d === 1n; }
    isZero() { return this.n === 0n; }
    toString() { return this.d === 1n ? String(this.n) : this.n + '/' + this.d; }
    toTeX() {
      if (this.d === 1n) return String(this.n);
      return (this.n < 0n ? '-' : '') + '\\tfrac{' + (this.n < 0n ? -this.n : this.n) + '}{' + this.d + '}';
    }
    toNumber() { return Number(this.n) / Number(this.d); }
  }

  /* «3,5», «3.5», «-7/2», « 1 / 3 », «−2». Devuelve Rat o null. Decimales periódicos: no. */
  Rat.parse = function (s) {
    if (typeof s !== 'string') return null;
    s = s.trim().replace(/−/g, '-').replace(/\s+/g, '');
    let m = /^([+-]?)(\d+)(?:[.,](\d+))?$/.exec(s);
    if (m) {
      const frac = m[3] || '';
      const v = new Rat(BigInt(m[2] + frac), 10n ** BigInt(frac.length));
      return m[1] === '-' ? v.neg() : v;
    }
    m = /^([+-]?\d+)\/([+-]?\d+)$/.exec(s);
    if (m && BigInt(m[2]) !== 0n) return new Rat(BigInt(m[1]), BigInt(m[2]));
    return null;
  };

  AC.Rat = Rat;
  if (typeof module !== 'undefined') module.exports = AC;
})(globalThis.AC = globalThis.AC || {});
