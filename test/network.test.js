const test = require('node:test');
const assert = require('node:assert');
const { Network } = require('../js/network.js');
const { datasets } = require('../js/datasets.js');

// Seeded random numbers so every run gives the same result.
function mulberry32(seed) {
  return () => {
    seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function fit(hidden, data, steps, rng, lr = 0.1) {
  const net = new Network(hidden, rng);
  for (let s = 0; s < steps; s++) {
    net.trainBatch(Array.from({ length: 16 }, () => data[(rng() * data.length) | 0]), lr);
  }
  return net;
}

test('training lowers the loss', () => {
  const rng = mulberry32(1), data = datasets.Circles(rng);
  const before = new Network([6, 6], mulberry32(2)).evaluate(data).loss;
  const after = fit([6, 6], data, 3000, rng).evaluate(data).loss;
  assert.ok(after < before / 2, `loss ${before.toFixed(3)} -> ${after.toFixed(3)}`);
});

test('a network with hidden layers learns circles and XOR', () => {
  for (const name of ['Circles', 'XOR']) {
    const rng = mulberry32(7), data = datasets[name](rng);
    const { accuracy } = fit([6, 6], data, 4000, rng).evaluate(data);
    assert.ok(accuracy > 0.9, `${name} accuracy ${accuracy}`);
  }
});

test('with no hidden layers it cannot learn XOR (only a straight line)', () => {
  const rng = mulberry32(3), data = datasets.XOR(rng);
  const { accuracy } = fit([], data, 4000, rng).evaluate(data);
  assert.ok(accuracy < 0.8, `linear accuracy ${accuracy}`);
});

test('predictions are probabilities between 0 and 1', () => {
  const p = new Network([4], mulberry32(5)).predict(0.3, -0.2);
  assert.ok(p > 0 && p < 1);
});
