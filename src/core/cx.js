/* Complejos con coordenadas racionales, ℚ(i): aritmética exacta. Los argumentos se dan como fracción de π (θ/π). */
(function (AC) {
  const Rat = AC.Rat;
  const cero = Rat.of(0), uno = Rat.of(1);

  class Cx {
    constructor(re, im) { this.re = re instanceof Rat ? re : Rat.of(re); this.im = im instanceof Rat ? im : Rat.of(im || 0); }
    static of(a, b) { return new Cx(Rat.of(a), Rat.of(b || 0)); }
    add(o) { return new Cx(this.re.add(o.re), this.im.add(o.im)); }
    sub(o) { return new Cx(this.re.sub(o.re), this.im.sub(o.im)); }
    mul(o) { return new Cx(this.re.mul(o.re).sub(this.im.mul(o.im)), this.re.mul(o.im).add(this.im.mul(o.re))); }
    conj() { return new Cx(this.re, this.im.neg()); }
    norm2() { return this.re.mul(this.re).add(this.im.mul(this.im)); }
    inv() { const n = this.norm2(); if (n.isZero()) throw new Error('inverso de cero'); return new Cx(this.re.div(n), this.im.neg().div(n)); }
    div(o) { return this.mul(o.inv()); }
    neg() { return new Cx(this.re.neg(), this.im.neg()); }
    pow(n) { let r = Cx.of(1); const b = n < 0 ? this.inv() : this; for (let i = 0; i < Math.abs(n); i++) r = r.mul(b); return r; }
    eq(o) { return this.re.eq(o.re) && this.im.eq(o.im); }
    isZero() { return this.re.isZero() && this.im.isZero(); }
    /* θ/π en (−1, 1] si el argumento es múltiplo de π/4 (re = 0, im = 0 o |re| = |im|); si no, null */
    argPi() {
      const a = this.re, b = this.im;
      if (this.isZero()) return null;
      if (b.isZero()) return a.cmp(cero) > 0 ? Rat.of(0) : Rat.of(1);
      if (a.isZero()) return b.cmp(cero) > 0 ? Rat.of(1, 2) : Rat.of(-1, 2);
      if (a.mul(a).eq(b.mul(b))) { const pa = a.cmp(cero) > 0, pb = b.cmp(cero) > 0; return pa && pb ? Rat.of(1, 4) : !pa && pb ? Rat.of(3, 4) : !pa && !pb ? Rat.of(-3, 4) : Rat.of(-1, 4); }
      return null;
    }
    /* «a+bi» legible: 3-2i, i, -1+i … */
    toString() {
      const a = this.re, b = this.im;
      const pb = b.isInt() ? (b.n === 1n ? '' : b.n === -1n ? '-' : String(b.n)) : '(' + b + ')';
      if (b.isZero()) return String(a);
      const parteIm = (b.isInt() ? pb : pb) + 'i';
      if (a.isZero()) return parteIm;
      const signo = b.cmp(cero) < 0 ? '' : '+';
      return (a.isInt() ? String(a) : '(' + a + ')') + signo + parteIm;
    }
    toTeX() {
      const a = this.re, b = this.im;
      const num = r => (r.isInt() ? String(r.n < 0n ? -r.n : r.n) : r.cmp(cero) < 0 ? '\\tfrac{' + (-r.n) + '}{' + r.d + '}' : '\\tfrac{' + r.n + '}{' + r.d + '}');
      const im = (b.cmp(cero) < 0 ? '-' : '') + (b.isInt() && (b.n === 1n || b.n === -1n) ? '' : num(b)) + 'i';
      if (b.isZero()) return a.toTeX();
      if (a.isZero()) return im;
      return a.toTeX() + (b.cmp(cero) < 0 ? '' : '+') + im;
    }
  }
  Cx.I = Cx.of(0, 1);

  /* «3-2i», «(1+i)/(2-i)», «i^3» … → Cx exacto (solo con la variable i), o null si no es un complejo racional */
  function parse(s) {
    try {
      const f = AC.expr.aF(AC.expr.parse(String(s)));
      const red = p => { let a = cero, b = cero; p.forEach((c, k) => { if (k === '') a = a.add(c); else { const m = /^i:(\d+)$/.exec(k); if (!m) throw new Error('variable'); const e = +m[1], sgn = (Math.floor(e / 2) % 2 === 0) ? 1 : -1, t = c.mul(Rat.of(sgn)); if (e % 2 === 0) a = a.add(t); else b = b.add(t); } }); return new Cx(a, b); };
      const n = red(f.n), d = red(f.d);
      if (d.isZero()) return null;
      return n.div(d);
    } catch (e) { return null; }
  }

  /* z = r(cos θ + i sen θ) con θ = t·π, para r² racional y t en múltiplos de 1/2 o 1/4 con coordenadas racionales */
  AC.Cx = Cx;
  AC.cx = { parse, cero, uno };
  if (typeof module !== 'undefined') module.exports = AC;
})(globalThis.AC = globalThis.AC || {});
