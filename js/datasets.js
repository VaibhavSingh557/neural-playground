/** Four 2D classification patterns. Every sample is [x, y, label] with x, y in [-1, 1]. */
(function (root) {
  const gaussian = (rng) => (rng() + rng() + rng() - 1.5) / 1.5;
  const uniform = (rng) => rng() * 2 - 1;

  const datasets = {
    Circles: (rng = Math.random) => Array.from({ length: 220 }, (_, i) => {
      const label = i % 2, r = label ? rng() * 0.35 : 0.6 + rng() * 0.3, t = rng() * 2 * Math.PI;
      return [r * Math.cos(t), r * Math.sin(t), label];
    }),
    XOR: (rng = Math.random) => Array.from({ length: 220 }, () => {
      let x = uniform(rng), y = uniform(rng);
      x += x > 0 ? 0.1 : -0.1; y += y > 0 ? 0.1 : -0.1;
      return [x * 0.9, y * 0.9, x * y > 0 ? 1 : 0];
    }),
    Moons: (rng = Math.random) => Array.from({ length: 220 }, (_, i) => {
      const label = i % 2, t = rng() * Math.PI, n = () => gaussian(rng) * 0.04;
      return label
        ? [-0.2 + Math.cos(t) * 0.6 + n(), -0.1 + Math.sin(t) * 0.6 + n(), 1]
        : [0.2 + Math.cos(t + Math.PI) * 0.6 + n(), 0.1 + Math.sin(t + Math.PI) * 0.6 + n(), 0];
    }),
    Spiral: (rng = Math.random) => Array.from({ length: 260 }, (_, i) => {
      const label = i % 2, r = 0.1 + rng() * 0.85, t = r * 6 + label * Math.PI, n = () => gaussian(rng) * 0.03;
      return [r * Math.sin(t) + n(), r * Math.cos(t) + n(), label];
    })
  };

  if (typeof module !== 'undefined' && module.exports) module.exports = { datasets };
  else root.NP = Object.assign(root.NP || {}, { datasets });
})(typeof window !== 'undefined' ? window : globalThis);
